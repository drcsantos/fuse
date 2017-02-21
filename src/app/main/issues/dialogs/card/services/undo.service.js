(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .service('UndoService', UndoService);

    /** @ngInject */
    function UndoService($mdToast) {

      var savedItem = {};

      var description = {
        'checklist' : 'Do you want to undo checklist deletion?',
        'checkitem' : 'Do you want to undo checkitem deletion?',
        'attachment' : 'Do you want to undo attachment deletion?'
      };

      function showActionToast(text, callback) {

         var toast = $mdToast.simple()
           .textContent(description[text])
           .action('UNDO')
           .highlightAction(true)
           .highlightClass('md-accent')
           .position('top right')
           .hideDelay(10000);

         $mdToast.show(toast).then(function(response) {
           if ( response == 'ok' ) {
             callback();
           }
         });
       };

       function setItem(item, type) {
         savedItem[type] = item;
       }

       function getItem(type) {
         return savedItem[type];
       }

       return {
         showActionToast: showActionToast,
         setItem: setItem,
         getItem: getItem
       };

    }

})();
