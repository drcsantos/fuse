(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('CreateRoomController', CreateRoomController);

    /** @ngInject */
    function CreateRoomController($mdDialog, apilaData, $mdConstant, authentication) {

      var vm = this;

      var communityId = authentication.currentUser().community._id;

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

        apilaData.createRoomStyle(communityId, vm.form)
        .success(function(response) {
          console.log(response);
          closeDialog();
        })
        .error(function(err) {
          console.log(err);
        });
      }

      function closeDialog()
      {
          $mdDialog.hide();
      }

    }

})();
