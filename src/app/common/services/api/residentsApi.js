(function() {

  angular
    .module('app.core')
    .service('ResidentsApi', ResidentsApi);

  ResidentsApi.$inject = ['$http', 'authentication'];

  function ResidentsApi($http, authentication) {

        var residentsList = function(communityId) {
          return $http.get(apiUrl + '/api/residents/list/' + communityId, getAuth());
        };

        var residentsFullList = function(communityId) {
          return $http.get(apiUrl + '/api/residents/full-list/' + communityId, getAuth());
        };

        var addResident = function(data) {
          return $http.post(apiUrl + '/api/residents/new', data, getAuth());
        };

        var residentById = function(residentid) {
          return $http.get(apiUrl + '/api/residents/' + residentid, getAuth());
        };

        var updateResident = function(residentid, formData) {
          return $http.put(apiUrl + '/api/residents/update/' + residentid,
            formData, getAuth());

        };

        var residentCount = function(communityid) {
          return $http.get(apiUrl + '/api/residents/count/' + communityid, getAuth());
        };

        var averageAge = function(communityid) {
          return $http.get(apiUrl + '/api/residents/average_age/' + communityid, getAuth());
        };

        var averageStayTime = function(communityid) {
          return $http.get(apiUrl + '/api/residents/average_stay/' + communityid, getAuth());
        };

        var getLocations = function(communityid) {
          return $http.get(apiUrl + '/api/residents/' + communityid + '/locations', getAuth());
        };

        var updateListItem = function(residentid, data) {
          return $http.put(apiUrl + '/api/residents/' + residentid + '/listitem', data, getAuth());
        };

        var addContact = function(residentid, data) {
          return $http.post(apiUrl + '/api/residents/' + residentid + '/contact', data, getAuth());
        };

        var deleteResident = function(residentid) {
          return $http.delete(apiUrl + '/api/residents/' + residentid, getAuth());
        };


    function getResidentsRoutes() {
      return {
        residentsList: residentsList,
        residentsFullList: residentsFullList,
        addResident: addResident,
        residentById: residentById,
        updateResident: updateResident,
        residentCount: residentCount,
        averageAge: averageAge,
        averageStayTime: averageStayTime,
        getLocations: getLocations,
        updateListItem: updateListItem,
        addContact: addContact,
        deleteResident: deleteResident
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
      getResidentsRoutes : getResidentsRoutes
    }
  }

})();
