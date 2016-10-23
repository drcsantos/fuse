(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('RecoverController', RecoverController);

    /** @ngInject */
    function RecoverController($mdDialog, recoveryInfo, apilaData, $mdToast) {

      var vm = this;

      // Data
      vm.recoveryInfo = recoveryInfo;

      // Functions
      vm.closeDialog = closeDialog;
      vm.verifyPassword = verifyPassword;

      //////////////////// PUBLIC FUNCTIONS /////////////////////////////

      function verifyPassword() {

        var data = {};
        data.password = vm.form.password;
        data.recoveryid = vm.recoveryInfo.recoveryid;
        data.type = vm.recoveryInfo.type;

        apilaData.verifyPassword(data, vm.recoveryInfo.bossId)
        .success(function(response) {
          closeDialog();

          showToast("Your password has been verified");
        })
        .error(function(response) {
          showToast("Your password doesn't match!");
        });
      }

      function closeDialog()
      {
          $mdDialog.hide();
      }

      //////////////////// HELPER FUNCTIONS /////////////////////////////

      function showToast(msg) {
        $mdToast.show(
          $mdToast.simple()
          .textContent(msg)
          .position("top right")
          .hideDelay(2000)
        );
      }

    }

})();
