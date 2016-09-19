(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('UpdateBillingController', UpdateBillingController);

    /** @ngInject */
    function UpdateBillingController($mdDialog, apilaData, authentication, $mdToast) {

      var vm = this;

      // data
      vm.userid = authentication.currentUser().id;

      // functions
      vm.closeDialog = closeDialog;
      vm.updateCustomer = updateCustomer;

      //////////////////// PUBLIC FUNCTIONS /////////////////////////////

      function updateCustomer() {
        Stripe.card.createToken(vm.cardInfo,
          function(status, response) {

            if(status !== 200) {
              showErrorToast(response.error.message);
            } else {
              apilaData.updateCustomer(vm.userid, response)
              .success(function(response) {
                closeDialog();
              })
              .error(function(response) {
                console.log(response);
              });
            }

          });
      }

      function closeDialog()
      {
          $mdDialog.hide();
      }

      //////////////////// HELPER FUNCTIONS /////////////////////////////

      function showErrorToast(errorMsg) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(errorMsg)
            .position("top right")
            .hideDelay(3000)
        );
      }

    }

})();
