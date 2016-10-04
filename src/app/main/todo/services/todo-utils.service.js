(function() {

  'use strict';

  angular
    .module('app.todo')
    .service('ToDoUtilsService', ToDoUtilsService);


  /** @ngInject */
  function ToDoUtilsService(apilaData, authentication) {

    return {
      "EVERY_HOUR" : 0,
      "TWICE_DAY" : 1,
      "EVERY_DAY" : 2,
      "EVERY_OTHER_DAY" : 3,
      "TWICE_WEEK" : 4,
      "EVERY_WEEK" : 5,
      "EVERY_TWO_WEEKS" : 6,
      "TWICE_MONTH" : 7,
      "EVERY_MONTH" : 8,
      "EVERY_TWO_MONTHS" : 9,
      "EVERY_QUATER" : 10,
      "TWICE_YEAR" : 11,
      "EVERY_YEAR" : 12,
    };

  }

})();
