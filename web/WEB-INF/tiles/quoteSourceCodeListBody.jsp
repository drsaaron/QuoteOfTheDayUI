<%-- 
    Document   : quoteSourceCodeListBody
    Created on : Dec 28, 2015, 12:48:58 PM
    Author     : scott
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib uri="http://struts.apache.org/tags-html" prefix="html" %>
<%@ taglib uri="http://struts.apache.org/tags-bean" prefix="bean" %>
<%@ taglib uri="http://struts.apache.org/tags-logic" prefix="logic" %>
<%@ taglib uri="http://struts.apache.org/tags-tiles" prefix="tiles" %>

<script lang="javascript">
    var quoteDetailsDialog;
    
    // retrieve the source code list and populate.
    $(function() {
        $.ajax({
            url: "<html:rewrite page="/data/sourceCode" />",
            type: "GET",
            dataType: "json",
            success: function(data, status, jqXHR) { showSourceCodeList(data); },
            error: function(jqXHR, textStatus, errorThrown) { alert("error: " + textStatus + ", errorThrown = " + errorThrown); }
        }); 
        
        // initialize dialogs
        quoteDetailsDialog = makeDialog($("#quoteDetailDialog"), 600, 750);
    });

    function showSourceCodeList(codeList) {
        var listHTML = "<ul>";
        $.each(codeList, function(i, code) {
            listHTML += "<li><a href='#' onclick='showQuotesForSourceCode(" + code.number + "); return false;'>" + code.text + "</a></li>";
        });
        listHTML += "</ul>";
        $("#quoteSourceCodeList").html(listHTML); 
    }
    
    function showQuotesForSourceCode(sourceCode) {
        // clear the div
        $("#quotesForSourceCodeQuotes").html("");
        
        // get the name of the source code.  For some reason I can't pass this down from the caller.
        var url = "<html:rewrite page="/data/sourceCode"/>" + "/" + sourceCode;
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            success: function(data, status, jqXHR) {
                $("#quotesForSourceCodeName").html("Quotes for <span class='quoteSourceCodeText'>" + data.text + "</span>");
            }
        });
        
        // get the quotes
        $.ajax({
            url: "<html:rewrite page="/data/quote" />",
            data: { sourceCode: sourceCode },                                                                                                                                                                                                                                                                                                                                                                                                               
            type: "GET",
            dataType: "json",
            success: function(data, status, jqXHR) { 
                $.each(data, function(i, quote) {
                    var html = "<p class='quote'>";
                    html += "<a href='#' onclick='showQuoteDetail(" + quote.number + "); return false;'>" + quote.number + "</a>";
                    html += "<br>";
                    var quoteText = quote.text;                    
                    html += quoteText.replace(/\n/g, "<br>");
                    $("#quotesForSourceCodeQuotes").append(html);
                });
            },
            error: function(jqXHR, textStatus, errorThrown) { alert("error: " + textStatus + ", errorThrown = " + errorThrown); }
        }); 
    }
    
    function isEmptyObject( obj ) {
        for ( var name in obj ) {
            return false;
        }
        return true;
    }
    
    function showQuoteDetail(quoteNumber) {
        $.ajax({
            url: "<html:rewrite page="/data/quote/" />" + quoteNumber,
            type: "GET",
            dataType: "json",
            success: function(quote, status, jqXHR) {
                // fill in the display
                $("#quoteDetailNumber").html("Quote #" + quote.number);
                var quoteText = quote.text.replace(/\n/g, "<br>");                   
                $("#quoteDetailText").html(quoteText);
                $("#quoteDetailUsable").html("Usable: " + quote.usable);
                
                // get the source code via synchronous AJAX.
                $.ajax({
                    url: "<html:rewrite page="/data/sourceCode/" />" + quote.sourceCode,
                    type: "GET",
                    async: false,
                    success: function(quoteSource, status, jqXHR) {
                        $("#quoteDetailSourceCode").html("Source: " + quoteSource.text);
                    },
                });
        
                // get the previous quote of the day usage for this quote, again
                // synchronous ajax
                $.ajax({
                    url: "<html:rewrite page="/data/qotdHistory/" />" + quote.number,
                    type: "GET",
                    async: false,
                    success: function(quoteHistory, status, jqXHR) {
                        var html = "";
                        var history = quoteHistory.historyByYear;
                        if (isEmptyObject(history)) {
                            html += "No quote of the day history";
                        } else {
                            $.each(history, function(year, yearHistory) {
                                html += year + "<ul>";
                                $.each(yearHistory, function(i, previousQOTD) {
                                    html += "<li>" + previousQOTD.runDate + "</li>";
                                });
                                html += "</ul>";
                            });
                        }
                        $("#quoteDetailPreviousUsage").html(html);
                    },
                });
                
                // show the dialog.
                quoteDetailsDialog.dialog("open");
            },
            error: function(jqXHR, textStatus, errorThrown) { alert("error: " + textStatus + ", errorThrown = " + errorThrown); }
        });
    }
</script>

<div id="quoteSourceCodeList" > </div>
<div id="quotesForSourceCode" > 
    <div id="quotesForSourceCodeName"> </div>
    <div id="quotesForSourceCodeQuotes"> </div>
</div>

<div id="quoteDetailDialog" title="Quote Details">
    <div id="quoteDetailNumber"> </div>
    <p>
    <div id="quoteDetailText"> </div>
    <p>
    <div id="quoteDetailUsable"></div>
    <p>
    <div id="quoteDetailSourceCode"> </div>
    <p>
    <div id="quoteDetailPreviousUsage"></div>
</div>

<p>