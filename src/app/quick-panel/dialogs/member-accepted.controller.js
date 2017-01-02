(function ()
{
    'use strict';

    angular
        .module('app.quick-panel')
        .controller('MemberAcceptedController', MemberAcceptedController);


   /** @ngInject */
   function MemberAcceptedController($mdDialog, $window, communityName) {
     var vm = this;

     // Data
     vm.communityName = communityName;

     // Functions
     vm.cancelDialog = cancelDialog;
     vm.refreshPage = refreshPage;

     function refreshPage() {
       $window.location.reload();
     }

     function cancelDialog(){
       $mdDialog.hide();
     }

   }

 })();
