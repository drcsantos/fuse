(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .service('UndoService', UndoService);

    /** @ngInject */
    function UndoService($mdToast) {

      var savedItem = {};

      function showActionToast(callback) {

         var toast = $mdToast.simple()
           .textContent('Do you want to undo checklist deletion?')
           .action('UNDO')
           .highlightAction(true)
           .highlightClass('md-accent')
           .position('top right')
           .hideDelay(10000);

         $mdToast.show(toast).then(function(response) {
           if ( response == 'ok' ) {

             //createCheckList('restore');
             callback();
           }
         });
       };

       function setItem(item) {
         savedItem = item;
       }

       function getItem() {
         return savedItem;
       }

       return {
         showActionToast: showActionToast,
         setItem: setItem,
         getItem: getItem
       };

    }

})();
