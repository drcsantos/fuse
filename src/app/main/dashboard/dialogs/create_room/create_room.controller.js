(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('CreateRoomController', CreateRoomController);

    /** @ngInject */
    function CreateRoomController($mdDialog, apilaData, $mdConstant) {

      var vm = this;

      // Data
      vm.form = {
        rooms: []
      };

      vm.seperators = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA];

      // Functions
      vm.closeDialog = closeDialog;
      vm.createRoom = createRoom;

      function createRoom() {
        console.log(vm.form);
      }

      function closeDialog()
      {
          $mdDialog.hide();
      }

    }

})();
