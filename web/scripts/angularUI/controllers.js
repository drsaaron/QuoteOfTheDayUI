/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';

var quoteOfTheDayControllers = angular.module('quoteOfTheDayControllers', []);
var urlRoot = "http://localhost:3000/";

quoteOfTheDayControllers.controller('QuoteOfTheDayController', [ '$scope', '$http', function($scope, $http) {
        
        // get the quote source code.
        $http.get(urlRoot + 'sourceCode').success(function(data) {
            $scope.sourceCodeList = data;
        });
        
        // quotes for a given source code
        $scope.quotesForSourceCode = [];
        
        // the selected source code
        $scope.selectedSourceCode = null;
        
        // get quotes for source code
        $scope.getQuotesForSourceCode = function(sourceCode) {
            $scope.selectedSourceCode = sourceCode;
            $http.get(urlRoot + 'quote?sourceCode='+sourceCode.number).success(function(data) {
                $scope.quotesForSourceCode = data;
                return false;
            });
        };
        
        // show quote details
        $scope.showQuoteDetail = function(quote) {
            alert("showing quote detail for " + quote.number);
        };
}]);