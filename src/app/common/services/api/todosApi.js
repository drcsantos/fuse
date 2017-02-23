(function() {

  angular
    .module('app.core')
    .service('TodosApi', TodosApi);

  TodosApi.$inject = ['$http', 'authentication'];

  function TodosApi($http, authentication) {

    var listTasks = function(todoId) {
      return $http.get(apiUrl + '/api/todos/' + todoId, getAuth());
    };

    var activeTasksCount = function(todoId) {
      return $http.get(apiUrl + '/api/todos/' + todoId +'/activecount', getAuth());
    };

    var addTask = function(todoId, data) {
      return $http.post(apiUrl + '/api/todos/' + todoId, data, getAuth());
    };

    var updateTask = function(todoId, taskid, data) {
      return $http.put(apiUrl + '/api/todos/' + todoId + '/task/' + taskid, data, getAuth());
    };

    var deleteTask = function(todoId, taskid) {
      return $http.delete(apiUrl + '/api/todos/'+ todoId + '/task/' + taskid, getAuth());
    };

    function getTodosRoutes() {
      return {
        listTasks:  listTasks,
        activeTasksCount: activeTasksCount,
        addTask: addTask,
        updateTask: updateTask,
        deleteTask: deleteTask
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
      getTodosRoutes : getTodosRoutes
    }
  }

})();
