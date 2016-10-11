(function() {

  'use strict';

  angular
    .module('app.todo')
    .service('ToDoUtilsService', ToDoUtilsService);


  /** @ngInject */
  function ToDoUtilsService(apilaData, authentication) {

    return {
      "HOURLY" : 0,
      "DAILY" : 1,
      "WEEKLY" : 2,
      "MONTHLY" : 3,
    };

  }

})();
