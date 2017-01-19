(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('BuildingSetupController', BuildingSetupController);

    /** @ngInject */
    function BuildingSetupController($mdDialog, apilaData, $mdToast, $log, authentication, community) {

      var vm = this;

      // Data
      vm.community = community;
      vm.contactInfo = {};

      vm.roomList = _.flatten(_.map(vm.community.roomStyle, "rooms"));

      vm.floors = community.floors;

      updateContactAndRoomInfo("floors");

      // Functions
      vm.closeDialog = closeDialog;
      vm.save = save;
      vm.getMatches = getMatches;
      vm.updateContactAndRoomInfo = updateContactAndRoomInfo;
      vm.updateFloors = updateFloors;

      function save() {
        apilaData.updateContactAndRoomInfo(vm.community._id, vm.community)
        .success(function(resp) {
            updateFloors();
        })
        .error(function(err) {
          $log.debug(err);
        });

        closeDialog();
      }

      function updateContactAndRoomInfo(type) {

        vm.contactInfo.rooms = vm.community.rooms;

        if(type === "floors") {

          var newFloors = vm.community.numFloors - vm.floors.length;

          if(vm.floors.length === 0) { //create floors for first time
            vm.floors = generateFloors(vm.community.numFloors, 0);

          } else if(newFloors > 0) {  // adding new floors
            vm.floors = vm.floors.concat(generateFloors(newFloors, vm.floors.length));

          } else if(newFloors < 0) { // removing new floors
            vm.floors.splice(newFloors);

          } if(vm.community.numFloors === 0) { // reset floors
            vm.floors = [];
          }

        }

        vm.contactInfo.floors = vm.floors;

      }

      function getMatches(text) {

        if(text === null) {
          return vm.roomList;
        }

        var sortedRooms = _.sortBy(vm.roomList, function(room) {
          return +(room.replace(/\D/g, '')); //remove letters and convert to number
        });

        var textLower = text.toLowerCase();

        var ret = sortedRooms.filter(function (d) {
          if(d) {
            return d.toLowerCase().indexOf(textLower) > -1;
          }
        });

        return ret;
      }

      function updateFloors() {

        apilaData.updateFloor(vm.community._id, vm.floors)
        .success(function(resp) {
          $log.debug(resp);
        })
        .error(function(err) {
          $log.debug(err);
        })
      }

      function closeDialog() {
          $mdDialog.hide();
      }

      function generateFloors(numFloors, startCount) {

        var floorRange = _.range(numFloors);

        var floors = _.map(floorRange, function(floorNumber) {
         return {
           floorNumber: floorNumber + startCount,
           startRoom: null,
           endRoom: null
         }});

         return floors;
      }

    }


})();
