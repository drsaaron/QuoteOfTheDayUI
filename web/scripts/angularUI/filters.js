/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module("quoteOfTheDayFilters", [])
        .filter('replaceEndOfLine', function($sce) {
            return function(input) {
                var msg = input.replace(/\n/g, '<br>');
                return $sce.trustAsHtml(msg);
//                return input.replace(new RegExp('\r?\n', 'g'), '<br />');
            };
});
