(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('RoomStyleController', RoomStyleController);

    /** @ngInject */
    function RoomStyleController($mdDialog, roomStyles, room, $log, apilaData, $mdConstant, authentication) {

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

      vm.deleteRoom = deleteRoom;

      function createRoom() {

        apilaData.createRoomStyle(communityId, vm.form)
        .success(function(response) {
          roomStyles.push(response);
          closeDialog(roomStyles);
        })
        .error(function(err) {
          $log.debug(err);
        });
      }

      function updateRoom() {

        apilaData.updateRoomStyle(communityId, vm.form)
        .success(function(response) {
          closeDialog(response);
        })
        .error(function(err) {
          $log.debug(err);
        });

      }

      function convertUnit() {

      }

      function deleteRoom() {
        apilaData.deleteRoomStyle(communityId, vm.form._id)
        .success(function(response) {

          _.remove(roomStyles, {"_id": response});

          $mdDialog.hide();
        })
        .error(function(err) {
          $log.debug(err);
        })
      }

      function closeDialog(resp)
      {
          $mdDialog.hide(resp);
      }

    }

})();
