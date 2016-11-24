(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('CreateRoomController', CreateRoomController);

    /** @ngInject */
    function CreateRoomController($mdDialog, roomStyles, room, apilaData, $mdConstant, authentication) {

      var vm = this;

      var communityId = authentication.currentUser().community._id;

      // Data
      vm.form = {
        rooms: []
      };



      if(room) {
        vm.form = room;
        vm.isUpdate = true;
      }

      vm.seperators = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA];

      // Functions
      vm.closeDialog = closeDialog;
      vm.createRoom = createRoom;
      vm.updateRoom = updateRoom;
      vm.convertUnit = convertUnit;

      function createRoom() {

        apilaData.createRoomStyle(communityId, vm.form)
        .success(function(response) {
          console.log(response);
          roomStyles.push(response);
          closeDialog();
        })
        .error(function(err) {
          console.log(err);
        });
      }

      function updateRoom() {

        apilaData.updateRoomStyle(communityId, vm.form)
        .success(function(response) {
          console.log(response);
          closeDialog();
        })
        .error(function(err) {
          console.log(err);
        });

      }

      function convertUnit() {
        // console.log(vm.form.areaUnit);
        // // convert from  meters to feet
        // if(!vm.form.areaUnit) {
        //   vm.form.area = vm.form.area / 3.28;
        // } else {
        //   vm.form.area = vm.form.area * 3.28;
        // }
      }

      function closeDialog()
      {
          $mdDialog.hide();
      }

    }

})();
