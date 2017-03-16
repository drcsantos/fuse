(function() {

    angular
        .module('app.core')
        .service('authentication', authentication);

    authentication.$inject = ['$http', '$window', '$log'];

    function authentication($http, $window, $log) {

       var apiUrl="http://localhost:3300";

       var changedUsername = "";
       var community = {};

       var userImage = "assets/images/avatars/userDefaultProfile.png";

        // create a saveToken method to read a value from localStorage
        var saveToken = function(token) {
            $window.sessionStorage['apila-token'] = token;
            var name = JSON.parse($window.atob(token.split('.')[1])).name;
            $window.sessionStorage['apila-username'] = $window.btoa(name);
        };

        // create a getToken method to read a value from localStorage
        var getToken = function() {
            return $window.sessionStorage['apila-token'];
        };

        var isLoggedIn = function() {
            var token = getToken();

            if (token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        var currentUser = function() {
            if (isLoggedIn()) {
                var token = getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                var encodedName = $window.sessionStorage['apila-username'];

                var name = $window.atob(encodedName);

                getCommunity(payload._id);

                console.log(payload);

                return {
                    email: payload.email,
                    name: name,
                    id: payload._id,
                    community: community,
                    communityId: payload.community,
                    todoid: payload.todoid
                };
            }
        };

        var changeUsername = function(username) {
          $window.sessionStorage['apila-username'] = $window.btoa(username);

        };

        var getUserImage = function() {
          if(userImage === "") {
            return "assets/images/avatars/userDefaultProfile.png";
          } else {
            return userImage;
          }

        };

        var setUserImage = function(image) {
          userImage = image;
        };

        var register = function(user) {
            return $http.post(apiUrl + '/api/register', user).success(function(data) {
                saveToken(data.token);
            });
        };

        var login = function(user) {
            return $http.post(apiUrl + '/api/login', user).success(function(data) {
                saveToken(data.token);
                //getCommunity();
            });
        };

        var logout = function() {
            $window.sessionStorage.removeItem('apila-token');
            $window.sessionStorage.removeItem('apila-username');
        };

        function getCommunity(id) {
          $http.get(apiUrl + '/api/users/community/' + id, {"headers": {
            Authorization: 'Bearer ' + getToken()
          }})
          .success(function(response) {
            community = response;
          })
          .error(function(response) {
            $log.debug(response);
          });
        }

        if (isLoggedIn()) {
          $http.get(apiUrl + '/api/users/' + currentUser().id + "/image")
          .success(function(response) {
            userImage = response;
          })
          .error(function(response) {
            $log.debug("Unable to load user image");
          });
        }

        // expose methods to application
        return {
            currentUser: currentUser,
            saveToken: saveToken,
            getToken: getToken,
            isLoggedIn: isLoggedIn,
            register: register,
            login: login,
            logout: logout,
            getUserImage: getUserImage,
            setUserImage: setUserImage,
            changeUsername : changeUsername,
            getCommunity : getCommunity
        };
    }


})();
