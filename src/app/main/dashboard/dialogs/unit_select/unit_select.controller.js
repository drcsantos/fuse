(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('UnitSelectController', UnitSelectController);

    /** @ngInject */
    function UnitSelectController($mdDialog, apilaData, community) {

        var vm = this;

        // Functions
        vm.closeDialog = closeDialog;
        vm.updateUnits = updateUnits;

        // Data
        vm.form = {};
        vm.form.areaUnit = (community.areaUnit === 'Feet') ? true : false;
        vm.form.tempUnit = (community.tempUnit === 'Fahrenheith') ? true : false;
        vm.form.weightUnit = (community.weightUnit === 'Pounds') ? true : false;

        console.log(vm.form);

        function closeDialog(resp) {
          $mdDialog.hide(resp);
        }

        function updateUnits() {

            community.areaUnit = vm.form.areaUnit ? 'Feet' : 'Meters';
            community.weightUnit = vm.form.weightUnit ? 'Pounds' : 'Kilograms';
            community.tempUnit = vm.form.tempUnit ? 'Fahrenheith' : 'Celsius';

            apilaData.updateUnits(community._id, community)
            .success(function(resp) {
                closeDialog();
            })
            .error(function(err) {
                console.log(err);
            });
        }

    }


})();