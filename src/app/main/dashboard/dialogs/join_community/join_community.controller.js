(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('JoinCommunityController', JoinCommunityController);

    /** @ngInject */
    function JoinCommunityController($mdDialog, apilaData, $mdToast, authentication) {

      var vm = this;

      // Data
      vm.username = authentication.currentUser().name;
      vm.searchText = "";

      // Functions
      vm.closeDialog = closeDialog;
      vm.sendRequest = sendRequest;
      vm.getMatches = getMatches;

      // preload list of communities
      apilaData.communityList()
        .success(function(communityList) {
          vm.communityList = communityList.map(function(elem) {
            return {value: elem._id, display: elem.name};
          });
        })
        .error(function(communityList) {
          console.log("Error retriving the list of residents");
        });

      //////////////////// PUBLIC FUNCTIONS /////////////////////////////

      function sendRequest()
      {

        if(vm.selectedItem === null) {
          return;
        }

        // format pending data
        vm.communityId = vm.selectedItem.value;

        var data = {
          "pendingMember" : vm.username
        };

        apilaData.addPendingMember(data, vm.communityId)
        .success(function(d) {
          vm.searchText = "";
          showToastMsg();

          closeDialog();
        })
        .error(function(d) {
          closeDialog();
        });
      }

      function getMatches(text) {

        if(text === null) {
          return vm.communityList;
        }

        var textLower = text.toLowerCase();

        var ret = vm.communityList.filter(function (d) {
          if(d.display) {
            return d.display.toLowerCase().indexOf(textLower) > -1;
          }
        });

          return ret;
      }


      function closeDialog()
      {
          $mdDialog.hide();
      }

      //////////////////// HELPER FUNCTIONS /////////////////////////////
      function showToastMsg() {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Invite Request Sent to ' + vm.selectedItem.display)
            .position("top right")
            .hideDelay(3000)
        );
      }

    }

  })();
