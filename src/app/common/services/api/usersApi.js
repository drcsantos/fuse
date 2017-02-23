(function() {

  angular
    .module('app.core')
    .service('UsersApi', UsersApi);

  UsersApi.$inject = ['$http', 'authentication'];

  function UsersApi($http, authentication) {

    var usersList = function() {
      return $http.get(apiUrl + '/api/users', getAuth());
    };

    var changeUsername = function(userid, data) {
      return $http.put(apiUrl + "/api/users/change/" + userid, data, getAuth());
    };

    var usersInCommunity = function(communityId) {
      return $http.get(apiUrl + '/api/users/list/' + communityId, getAuth());
    };

    var userCommunity = function(userid) {
      return $http.get(apiUrl + '/api/users/community/' + userid, getAuth());
    };

    var forgotPassword = function(email) {
      return $http.post(apiUrl + '/api/users/forgotpassowrd/' + email);
    };

    var resetPassword = function(token, data) {
      return $http.post(apiUrl + '/api/users/reset/' + token, data);
    };

    var verifyEmail = function(token) {
      return $http.post(apiUrl + '/api/users/verify/' + token);
    };

    var getUser = function(userid) {
      return $http.get(apiUrl + '/api/users/getuser/' + userid, getAuth());
    };

    var saveCreditCard = function(userid, data) {
      return $http.post(apiUrl + '/api/users/' + userid + '/savecard', data, getAuth());
    };

    var getCustomer = function(userid) {
      return $http.get(apiUrl + '/api/users/' + userid + "/customer", getAuth());
    };

    var cancelSubscription = function(userid) {
      return $http.delete(apiUrl + '/api/users/' + userid + '/subscription', getAuth());
    };

    var updateCustomer = function(userid, data) {
      return $http.put(apiUrl + '/api/users/' + userid + '/update', data, getAuth());
    };


    function getUsersRoutes() {
      return {
        usersList: usersList,
        changeUsername: changeUsername,
        usersInCommunity: usersInCommunity,
        userCommunity: userCommunity,
        forgotPassword: forgotPassword,
        resetPassword: resetPassword,
        verifyEmail: verifyEmail,
        getUser: getUser,
        saveCreditCard: saveCreditCard,
        getCustomer: getCustomer,
        cancelSubscription: cancelSubscription,
        updateCustomer: updateCustomer
      };

    }

    var apiUrl = "";

    function setApiUrl(url) {
      apiUrl = url;
    }

    function getAuth() {
      return {
        "headers": {
          Authorization: 'Bearer ' + authentication.getToken()
        }
      };
    }

    return {
      setApiUrl : setApiUrl,
      getUsersRoutes : getUsersRoutes
    }
  }

})();
