(function() {

  angular
    .module('app.core')
    .service('AppointmentsApi', AppointmentsApi);

  AppointmentsApi.$inject = ['$http', 'authentication'];

  function AppointmentsApi($http, authentication) {

    var appointmentsList = function(communityid, month) {
      return $http.get(apiUrl + '/api/appointments/' + communityid + '/month/' + month, getAuth());
    };

    var appointmentsListByMonth = function(month) {
      return $http.get(apiUrl + '/api/appointments/' + month, getAuth());
    };


    var appointmentById = function(appointmentid) {
      return $http.get(apiUrl + '/api/appointments/' + appointmentid, getAuth());
    };

    var addAppointment = function(data) {
      return $http.post(apiUrl + '/api/appointments/new', data, getAuth());
    };

    var updateAppointment = function(appointmentid, formData) {
      return $http.put(apiUrl + '/api/appointments/update/' + appointmentid,
        formData, getAuth());

    };

    var addAppointmentCommentById = function(appointmentid, data) {
      return $http.post(apiUrl + '/api/appointments/' + appointmentid + '/comments/', data, getAuth());
    };

    var appointmentsToday = function(communityId) {
      return $http.get(apiUrl + '/api/appointments/today/' + communityId, getAuth());
    };


    function getAppointmentsRoutes() {
      return {
        appointmentsList: appointmentsList,
        appointmentById: appointmentById,
        addAppointment: addAppointment,
        updateAppointment: updateAppointment,
        addAppointmentCommentById: addAppointmentCommentById,
        appointmentsListByMonth: appointmentsListByMonth,
        appointmentsToday: appointmentsToday
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
      getAppointmentsRoutes : getAppointmentsRoutes
    }
  }

})();
