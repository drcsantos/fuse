(function() {

  angular
    .module('app.core')
    .service('apilaData', apilaData);

  apilaData.$inject = ['$http', 'authentication', 'IssuesApi', 'CommunitiesApi', 'ResidentsApi', 'AppointmentsApi', 'UsersApi', 'TodosApi'];

  function apilaData($http, authentication, IssuesApi, CommunitiesApi, ResidentsApi, AppointmentsApi, UsersApi, TodosApi) {

    ////////////////////////////////////////////////

    var apiUrl="http://localhost:3300";

    function getAuth() {
      return {
        "headers": {
          Authorization: 'Bearer ' + authentication.getToken()
        }
      };
    }

    IssuesApi.setApiUrl(apiUrl);
    var issuesApiRoutes = IssuesApi.getIssueRoutes();

    ResidentsApi.setApiUrl(apiUrl);
    var residentsApiRoutes = ResidentsApi.getResidentsRoutes();

    CommunitiesApi.setApiUrl(apiUrl);
    var communitiesApiRoutes = CommunitiesApi.getCommunitiesRoutes();

    AppointmentsApi.setApiUrl(apiUrl);
    var appointmentsApiRoutes = AppointmentsApi.getAppointmentsRoutes();

    UsersApi.setApiUrl(apiUrl);
    var usersApiRoutes = UsersApi.getUsersRoutes();

    TodosApi.setApiUrl(apiUrl);
    var todosApiRoutes = TodosApi.getTodosRoutes();

    var getApiUrl = function() {
      return apiUrl;
    };

    var createToDoActivity = function(todoId, data) {
      return $http.post(apiUrl + '/api/activity/' + todoId, data, getAuth());
    };

    var listLogs = function(communityid) {
      return $http.get(apiUrl + '/api/logs/' + communityid, getAuth());
    };

    var listUserLogs = function(communityid, userid) {
      return $http.get(apiUrl + '/api/user_logs/' + communityid + "/user/" + userid, getAuth());
    };

    return _.extend({

      getApiUrl: getApiUrl,

      listLogs: listLogs,
      listUserLogs: listUserLogs,

      createToDoActivity: createToDoActivity

    }, issuesApiRoutes, communitiesApiRoutes, residentsApiRoutes, appointmentsApiRoutes, usersApiRoutes, todosApiRoutes);
  }

})();
