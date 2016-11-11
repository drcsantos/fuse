(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.verify')
        .controller('VerifyController', VerifyController);

    /** @ngInject */
    function VerifyController(apilaData, $stateParams)
    {
        // Data
        var vm = this;

        vm.verifiedEmail = false;

        var token = $stateParams.token;

        // Methods
        apilaData.verifyEmail(token)
        .success(function(response) {
          vm.verifiedEmail = response.status;
        })
        .error(function(response) {
          vm.verifiedEmail = false;
        });

        //////////
    }
})();
