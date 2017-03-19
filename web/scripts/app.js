/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function ($) {
    var dataRoot = "http://localhost:3000/";
    
    // define the quote source code model
    var SourceCode = Backbone.Model.extend({
        urlRoot: dataRoot + "sourceCode",
    });

    // define the source code collection
    var SourceCodeCollection = Backbone.Collection.extend({
        model: SourceCode,
        url: dataRoot + "sourceCode",
        // retrieve the collection
        retrieveCollection: function () {
            this.fetch();
        },
    });

    // view for a source code
    var oldAddView = null;
    var SourceCodeView = Backbone.View.extend({
        tagName: "li",
        
        className: "quoteSourceListText",
        
        template: _.template($("#quoteSourceCodeTemplate").html()),
        
        // render a source code using the template
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        
        events: {
            "click #quotesForSourceCodeLink": "showQuotesForSourceCode",
            "click button.addQuoteButton": "addQuote"
        },
        
        // get the quotes for a specific source code.
        showQuotesForSourceCode: function () {
            quoteCollection.retrieveBySourceCode(this.model);

            return false;
        },
        
        oldAddView: null,
        
        addQuote: function() {
            // if we have a previous add quote view, undelegate events.
            // this will prevent multiple click events from propagating.
            if (oldAddView !== null) {
                oldAddView.undelegateEvents();
            }
            var addQuoteDialog = new AddQuoteView({ model: this.model });
            addQuoteDialog.render();
            oldAddView = addQuoteDialog;
        }
    });

    // view for the source code collection
    var SourceCodeCollectionView = Backbone.View.extend({
        el: $("#quoteSourceCodeList ul"),
        initialize: function () {
            // when a new item is added to the collection, refresh the view
            var that = this;
            this.collection.bind("add", function (i) {
                that.handleNewItem(i);
            });
        },
        // render the full collection
        render: function () {
            var that = this;

            // clear the current list
            this.$el.find("article").remove();

            // add each element
            _.each(this.collection.models, function (item) {
                that.renderSourceCode(item);
            }, this);
        },
        // render an individual source code
        renderSourceCode: function (i) {
            var view = new SourceCodeView({model: i});
            this.$el.append(view.render().el);
        },
        // handle an item being added to the collection
        handleNewItem: function (newItem) {
            this.renderSourceCode(newItem);
        },
    });

    // model for a quote
    var Quote = Backbone.Model.extend({
        urlRoot: dataRoot + "quote",
        idAttribute: "number",
    });

    // model for quote collection
    var QuoteCollection = Backbone.Collection.extend({
        model: Quote,
        url: dataRoot + "quote",
        // retrieve quotes for a specific source code
        retrieveBySourceCode: function (sourceCode) {
            // trigger an event to indicate we're refreshing the list
            this.trigger("beginRefreshList", sourceCode);

            // retrieve
            this.fetch({
                data: $.param({sourceCode: sourceCode.attributes.number}),
            });
        }
    });

    // view for a quote
    var oldEditQuoteView = null;
    var QuoteView = Backbone.View.extend({
        tagName: "p",
        className: "quote",
        template: _.template($("#quoteTemplate").html()),
        
        initialize: function() {
            var that = this;
            
            // bind the sync event to refresh the display when a quote is changed
            this.model.bind("sync", function(updated) {
                that.render();
            });
        },
        
        // render a source code using the template
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        
        events: {
            "click #showQuoteDetail": "showQuoteDetail",
            "click #editQuoteButton": "editQuote"
        },
        // show the details of a quote
        showQuoteDetail: function () {
            var detailView = new QuoteDetailsView({ model: this.model });
            detailView.render();
            return false;
        },
        
        oldEditQuoteView: null,
        
        // edit the quote
        editQuote: function() {
            if (oldEditQuoteView !== null) {
                oldEditQuoteView.undelegateEvents();
            }
            
            var editQuoteView = new EditQuoteView({ model: this.model });
            editQuoteView.render();
            
            oldEditQuoteView = editQuoteView;
        }
    });

    // view for a collection of quotes
    var QuoteCollectionView = Backbone.View.extend({
        el: $("#quotesForSourceCodeQuotes"),
        
        initialize: function () {
            // when a new item is added to the collection, refresh the view
            var that = this;
            this.collection.bind("add", function (i) {
                that.handleNewItem(i);
            });

            // when the quote collection is about to be refreshed, clear
            this.collection.bind("beginRefreshList", function (sourceCode) {  
                // update the collection view panel with the source code name.
                $("#quotesForSourceCodeName").html("Quotes for <span class='quoteSourceCodeText'>" + sourceCode.attributes.text + "</span>");

                // clear the list to prepare for the new quotes
                that.clearList();
            })
        },
        
        // render the full collection
        render: function () {
            var that = this;

            // clear the current list
            this.clearList();

            // add each element
            _.each(this.collection.models, function (item) {
                that.renderQuote(item);
            }, this);
        },
        
        // render an individual source code
        renderQuote: function (i) {
            var view = new QuoteView({model: i});
            this.$el.append(view.render().el);
        },
        
        // handle an item being added to the collection
        handleNewItem: function (newItem) {
            this.renderQuote(newItem);
        },
        
        clearList: function () {
            this.$el.find("p").remove();
        },
    });

    function isEmptyObject( obj ) {
        for ( var name in obj ) {
            return false;
        }
        return true;
    }
    
    var EditQuoteView = Backbone.View.extend({
        el: $("#editQuoteDialog"),
        
        events: {
            "click button.submit": "saveQuote",
        },
        
        editQuoteTemplate: _.template($("#editQuoteTemplate").html()),
        
        initialize: function() {
            var formString = this.editQuoteTemplate(this.model.toJSON());
            
            var dialogForm = $("#editQuoteDialog");
            dialogForm.html(formString);
            
            this.dialog = dialogForm.dialog({
                autoOpen: false,
                height: 600,
                width: 750,
                modal: true,
                show: {effect: "clip", duration: 500},
                hide: {effect: "clip", duration: 500}
            });
        },
        
        render: function () {
            this.dialog.dialog("open");
        },
        
        saveQuote: function(e) {
            e.stopPropagation();
            var that = this;
            
            // close the dialog
            this.dialog.dialog("close");
            
            // build the object.
            var quoteData = {  };
            $(e.target).closest("form").find(":input").not("button").each(function () {
                var el = $(this);
                
                if (el.attr("class") === "usable") {
                    quoteData["usable"] = el.prop("checked");
                } else {
                    quoteData[el.attr("class")] = el.val();
                }
            });
            
            // save the quote.
            var quote = this.model;
            quote.attributes.text = quoteData["text"];
            quote.attributes.usable = quoteData["usable"];
            quote.save(null, {
                success: function(model, response) {    
                }
            });
            
            // done
            return false;
        }
    });
    
    var AddQuoteView = Backbone.View.extend({
        el: $("#addQuoteDialog"),
                
        events: {
            "click button.submit": "saveQuote",
        },
        
        addQuoteTemplate: _.template($("#addQuoteTemplate").html()),
        
        initialize: function() {
            var formString = this.addQuoteTemplate(this.model.toJSON());
            
            var dialogForm = $("#addQuoteDialog");
            dialogForm.html(formString);
            
            this.dialog = dialogForm.dialog({
                autoOpen: false,
                height: 600,
                width: 750,
                modal: true,
                show: {effect: "clip", duration: 500},
                hide: {effect: "clip", duration: 500}
            });
        },
        
        render: function () {
            this.dialog.dialog("open");
        },
        
        saveQuote: function(e) {
            e.stopPropagation();
            var that = this;
            
            // close the dialog
            this.dialog.dialog("close");
            
            // build the object.
            var quoteData = {};
            $(e.target).closest("form").find(":input").not("button").each(function () {
                var el = $(this);
                
                if (el.attr("class") === "usable") {
                    quoteData["usable"] = el.prop("checked");
                } else {
                    quoteData[el.attr("class")] = el.val();
                }
            });
            
            // save the quote.
            var quote = new Quote(quoteData);
            quote.save(null, {
                success: function(model, response) {    
                    // retrieve the quotes for this source code.
                    quoteCollection.retrieveBySourceCode(that.model);
                }
            });
            
            // done
            return false;
        }
    });
    
    // a view for quote details, which will open a dialog
    var QuoteDetailsView = Backbone.View.extend({
        el: $("#quoteDetailDialog"),
        template: _.template($("#quoteDetailsTemplate").html()),
        
        initialize: function() {
            // setup the dialog
            var formString = this.template(this.model.toJSON());
            var dialogForm = $("#quoteDetailDialog");
            dialogForm.html(formString);
            this.dialog = dialogForm.dialog({
                autoOpen: false,
                height: 600,
                width: 750,
                modal: true,
                show: {effect: "clip", duration: 500},
                hide: {effect: "clip", duration: 500}
            });

            // retrieve QOTD history and add.
            var qotdHistory = new QuoteOfTheDayHistory({ quoteNumber: this.model.attributes.number });
            qotdHistory.fetch({
                success: function() {
                    var html = "";
                    var historyByYear = qotdHistory.get("historyByYear");
                    
                    if (isEmptyObject(historyByYear)) {
                        html = "No quote of the day history";
                    } else {
                        $.each(historyByYear, function(year, yearHistory) {
                            html += year + "<ul>";
                            $.each(yearHistory, function(i, previousQOTD) {
                                html += "<li>" + previousQOTD.runDate + "</li>";
                            });
                            html += "</ul>";
                        });
                    }
                    
                    // add 
                    $("#quoteDetailPreviousUsage").html(html);
                }
            });
        },
        
        render: function () {
            this.dialog.dialog("open");
        }
    });

    // model for quote of the day history
    var QuoteOfTheDayHistory = Backbone.Model.extend({
        idAttribute: "quoteNumber",
        urlRoot: dataRoot + "qotdHistory/" 
    });
    
    // initialize the source code collection and view
    var sourceCodeCollection = new SourceCodeCollection();
    var sourceCodeCollectionView = new SourceCodeCollectionView({collection: sourceCodeCollection});

    // initialize the quote collection and view
    var quoteCollection = new QuoteCollection();
    var quoteCollectionView = new QuoteCollectionView({collection: quoteCollection});

    // fetch the soure code collection.  this is apparently a no-no, but how else?
    sourceCodeCollection.retrieveCollection();

}(jQuery));
