(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.register')
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    function RegisterController($location, authentication, $log, $mdToast)
    {
        // Data
        var vm = this;

         vm.credentials = {
            name: "",
            email: "",
            password: ""
        };

        // Functions
        vm.register = register;
        vm.doRegister = doRegister;


        function register() {

            vm.credentials.name = vm.form.username;
            vm.credentials.email = vm.form.email;
            vm.credentials.password = vm.form.password;

            vm.doRegister();
        };

        function doRegister() {

          vm.notSamePass = "";
          vm.userExists = "";
          vm.emailExists = "";

          if (vm.form.passwordConfirm !== vm.form.password) {
            vm.notSamePass = "The passwords don't match";
            return;
          }

          console.log('do register');

          authentication
            .register(vm.credentials)
            .error(function(error) {

              if (error.errmsg.indexOf("name_1") !== -1) {
                vm.userExists = "This username already exists";
              }

              if (error.errmsg.indexOf("email") !== -1) {
                vm.emailExists = "This email already exists";
              }

              if(error.errmsg.indexOf("failed_send") !== -1) {
                showToast("Unable to send verification email. Please contact the administrators.");
              }
            })
            .then(function() {
              $log.debug("success register: " + authentication.currentUser().name);
              $location.path('/auth/login');
            });
        };


        function showToast(msg) {
          $mdToast.show(
            $mdToast.simple()
            .textContent(msg)
            .position("top right")
            .hideDelay(2000)
          );
        }
        //////////
    }
})();
