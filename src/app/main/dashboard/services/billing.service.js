(function() {

  'use strict';

  angular
    .module('app.dashboard')
    .service('BillingService', BillingService);


  /** @ngInject */
  function BillingService(apilaData, $mdDialog, $document, $window, $log) {

    function updateBillingModal(ev)
    {
      $mdDialog.show({
          controller         : 'UpdateBillingController',
          controllerAs       : 'vm',
          templateUrl        : 'app/main/dashboard/dialogs/update_billing/update_billing.html',
          parent             : angular.element($document.body),
          targetEvent        : ev,
          clickOutsideToClose: true
      });
    }

    function cancelSubscription(userid, subscriptionCanceled) {
      var confirm = $mdDialog.confirm()
       .title('Are you sure you want to cancel your subscription?')
       .textContent('Cancelling means your community will get shut down and other community members would not be able to use it')
       .ariaLabel('Lucky day')
       .ok('Yes')
       .cancel('No');


     $mdDialog.show(confirm).then(function() {
       apilaData.cancelSubscription(userid).
       success(function(response) {
         subscriptionCanceled = true;
         $window.location.reload();
       })
       .error(function(response) {
         $log.debug(response);
       });
     });
    }

    return {
      updateBillingModal : updateBillingModal,
      cancelSubscription : cancelSubscription
    };

  }

})();
