(function() {

  angular
    .module('app.core')
    .service('CommunitiesApi', CommunitiesApi);

  CommunitiesApi.$inject = ['$http', 'authentication'];

  function CommunitiesApi($http, authentication) {

    var addCommunity = function(data) {
      return $http.post(apiUrl + '/api/communities/new', data);
    };

    var communityList = function(data) {
      return $http.get(apiUrl + '/api/communities/', getAuth());
    };

    var acceptMember = function(data, communityid) {
      return $http.put(apiUrl + '/api/communities/accept/' + communityid, data, getAuth());
    };

    var addPendingMember = function(data, communityid) {
      return $http.put(apiUrl + '/api/communities/pending/' + communityid, data, getAuth());
    };

    var declineMember = function(data, communityid) {
      return $http.put(apiUrl + '/api/communities/decline/' + communityid, data, getAuth());
    };

    var addRole = function(communityid, userid, data) {
      return $http.post(apiUrl + '/api/communities/' + communityid + "/role/" + userid, data, getAuth());
    };

    var acceptMember = function(data, communityid) {
      return $http.put(apiUrl + '/api/communities/accept/' + communityid, data, getAuth());
    };

    var updateFloor = function(communityid, data) {
      return $http.put(apiUrl + '/api/communities/' + communityid + "/floor", data, getAuth());
    };

    var addFloor = function(communityid, data) {
      return $http.post(apiUrl + '/api/communities/' + communityid + "/floor", data, getAuth());
    };

    var removeMember = function(communityid, userid) {
      return $http.delete(apiUrl + '/api/communities/' + communityid + "/user/" + userid, getAuth());
    };

    var deleteRoomStyle = function(communityid, roomid) {
      return $http.delete(apiUrl + '/api/communities/' + communityid + "/roomstyle/" + roomid, getAuth());
    };

    var hasCanceledCommunity = function(userid) {
      return $http.get(apiUrl + '/api/communities/canceled/' + userid, getAuth());
    };

    var restoreCommunity = function(userid, communityid) {
      return $http.post(apiUrl + '/api/communities/' + communityid + '/restore/' + userid, {}, getAuth());
    };

    var updateContactAndRoomInfo = function(communityid, data) {
      return $http.put(apiUrl + '/api/communities/' + communityid +'/contactinfo', data, getAuth());
    };

    var createRoomStyle = function(communityid, data) {
      return $http.post(apiUrl + '/api/communities/' + communityid + '/roomstyle', data, getAuth());
    };

    var updateRoomStyle = function(communityid, data) {
      return $http.put(apiUrl + '/api/communities/' + communityid + '/roomstyle/' + data._id, data, getAuth());
    };



    function getCommunitiesRoutes() {
      return {
        addCommunity: addCommunity,
        communityList: communityList,
        acceptMember: acceptMember,
        addPendingMember: addPendingMember,
        declineMember: declineMember,
        addRole: addRole,
        updateFloor: updateFloor,
        addFloor: addFloor,
        removeMember: removeMember,
        deleteRoomStyle: deleteRoomStyle,
        hasCanceledCommunity: hasCanceledCommunity,
        restoreCommunity: restoreCommunity,
        updateContactAndRoomInfo: updateContactAndRoomInfo,
        createRoomStyle: createRoomStyle,
        updateRoomStyle: updateRoomStyle
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
      getCommunitiesRoutes : getCommunitiesRoutes
    }
  }

})();
