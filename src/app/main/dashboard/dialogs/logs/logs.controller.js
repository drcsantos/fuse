(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('LogsController', LogsController);

    /** @ngInject */
    function LogsController($mdDialog, apilaData, authentication, name, userId) {
      var vm = this;

      vm.userName = name;
      vm.userId = userId;

      var communityid = authentication.currentUser().communityId;

      // Functions
      vm.closeDialog = closeDialog;

      apilaData.listUserLogs(communityid, vm.userId)
      .success(function(resp) {
        console.log(resp);
        vm.ipLogs = resp;
      })
      .error(function(err) {
        console.log(err);
      });

      function closeDialog() {
          $mdDialog.hide();
      }
    }

})();
