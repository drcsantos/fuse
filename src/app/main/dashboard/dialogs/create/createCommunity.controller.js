(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('CreateCommunityController', CreateCommunityController);

  /** @ngInject */
  function CreateCommunityController($mdDialog, apilaData, authentication, $log, $mdToast, $window, activeEmail) {

    var vm = this;

    // Data
    vm.form = {};

    vm.hasCanceledCommunity = false;

    vm.username = authentication.currentUser().name;
    vm.userid = authentication.currentUser().id;

    vm.restoreCommunity = false;

    //Functions
    vm.closeDialog = closeDialog;
    vm.addCommunity = addCommunity;
    vm.recoverCommunity = recoverCommunity;

    // preload data if we have canceledCommunity
    apilaData.hasCanceledCommunity(vm.userid)
      .success(function(response) {
        vm.canceledCommunity = response;
        vm.hasCanceledCommunity = true;
      })
      .error(function(err) {
        $log.debug(err);
      });

    ///////////////////// PUBLIC FUNCTIONS /////////////////////////////////

    function addCommunity() {
      vm.form.communityMembers = [];
      vm.form.pendingMembers = [];

      vm.form.username = vm.username;

      if (!vm.form.name) {
        vm.nameError = "Community name must be specified";
        return;
      }

      Stripe.card.createToken(vm.cardInfo,
        function(status, response) {

          if (status !== 200) {
            processErrors(response.error);
          } else {
            saveCreditCard(response);
          }

        });

    }

    function recoverCommunity() {
      Stripe.card.createToken(vm.cardInfo,
        function(status, response) {

          if (status !== 200) {
            processErrors(response.error);
          } else {
            restoreCommunity(response);
          }

        });
    }

    function closeDialog() {
      $mdDialog.hide();
    }

    ///////////////////// PRIVATE FUNCTIONS /////////////////////////////////

    function saveCreditCard(response) {
      apilaData.saveCreditCard(vm.userid, response)
        .success(function(response) {

          apilaData.addCommunity(vm.form)
            .success(function(d) {
              closeDialog();

              showToast("Community has been created!");

              $window.location.reload();
            })
            .error(function(d) {
              $log.debug(d);
            });
        })
        .error(function(response) {
          $log.debug(response);
        });
    }

    function restoreCommunity(response) {
      apilaData.saveCreditCard(vm.userid, response)
        .success(function(response) {

          //restore community
          apilaData.restoreCommunity(vm.userid, vm.canceledCommunity._id)
            .success(function(response) {

              closeDialog();
              showToast("Community has been restored!");

              $window.location.reload();

            })
            .error(function(response) {
              $log.debug(response);
            });
        })
        .error(function(response) {
          $log.debug(response);
        });
    }

    function processErrors(error) {
      if (error.param === "card[number]") {
        vm.cardNumberError = "Invalid credit card number";
      } else if (error.param === "card[exp_month]") {
        vm.expMonthError = "Invalid Expiration Month entered please select between 01 - 12";
      } else if (error.param === "card[exp_year]") {
        vm.expYearError = "Invalid Expiration Year entered";
      }
    }


    function showToast(msg) {
      $mdToast.show(
        $mdToast.simple()
        .textContent(msg)
        .position("top right")
        .hideDelay(3000)
      );
    }


  }

})();
