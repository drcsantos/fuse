(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('UnitSelectController', UnitSelectController);

    /** @ngInject */
    function UnitSelectController($mdDialog) {

        var vm = this;

        // Functions
        vm.closeDialog = closeDialog;

        function closeDialog(resp) {
          $mdDialog.hide(resp);
        }

    }


})();