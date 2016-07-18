(function ()
{
    'use strict';

    angular
        .module('app.profile')
        .controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController(authentication, apilaData, Upload, $mdToast, $timeout)
    {
        var vm = this;

        vm.searchText = "";

        // Data
        vm.username = authentication.currentUser().name;

        // Methods
        vm.sendRequest = sendRequest;
        vm.uploadFiles = uploadFiles;

        //Autofield selectbox setup
        vm.residentList = [];
        vm.selectedCommunity = {};

        vm.userImage = authentication.getUserImage();

        apilaData.communityList()
          .success(function(residentList) {
            //console.log(residentList);
            vm.residentList = residentList.map(function(elem) {
              return {value: elem._id, display: elem.name};
            });
          })
          .error(function(residentList) {
            console.log("Error retriving the list of residents");
          });

          vm.getMatches = function (text) {
            if(text === null) {
              return vm.residentList;
            }
            var textLower = text.toLowerCase();

              var ret = vm.residentList.filter(function (d) {
                  if(d.display != null)
                  return d.display.toLowerCase().indexOf(text) > -1;
              });
              return ret;
          }

        apilaData.userCommunity(vm.username)
          .success(function(d) {
            vm.myCommunity = d;
          })
          .error(function(d) {
          });


        function sendRequest()
        {

          if(vm.selectedItem === null) {
            return;
          }

          $mdToast.show(
            $mdToast.simple()
              .textContent('Invite Request Sent to ' + vm.selectedItem.display)
              .position("top right")
              .hideDelay(3000)
          );

          vm.communityId = vm.selectedItem.value;

          var data = {};
          data.pendingMember = vm.username;

          apilaData.addPendingMember(data, vm.communityId)
          .success(function(d) {
            vm.searchText = "";
          })
          .error(function(d) {

          });
        }

        function uploadFiles(file, errFiles) {

          var uploadUrl = apilaData.getApiUrl() + '/api/users/'+ vm.username + '/upload';

          console.log("Fik");

          if (file) {
              file.upload = Upload.upload({
                  url: uploadUrl,
                  data: {file: file},
                  headers: {
                      Authorization: 'Bearer ' + authentication.getToken()
                  }
              });

              file.upload.then(function (response) {
                  $timeout(function () {
                      file.result = response.data;

                      authentication.setUserImage(response.data);
                      vm.userImage = response.data;

                      $mdToast.show(
                        $mdToast.simple()
                          .textContent("User profile image updated!")
                          .position("top right")
                          .hideDelay(1000)
                      );

                  });

              });
          }
        }

        //////////
    }

})();
