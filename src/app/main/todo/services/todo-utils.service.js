(function() {

  'use strict';

  angular
    .module('app.todo')
    .service('ToDoUtilsService', ToDoUtilsService);


  /** @ngInject */
  function ToDoUtilsService(apilaData, authentication) {

    function convertToPm(value) {
      var americanTime = "";

      americanTime = (value < 12) ? value + " am" :  (value - 12) + ' pm';

      americanTime = (value === 0) ? "12 am" :  americanTime;
      americanTime = (value === 12) ? "12 pm" :  americanTime;

      return americanTime;
    }

    return {
      convertToPm: convertToPm,
      "HOURLY" : 0,
      "DAILY" : 1,
      "WEEKLY" : 2,
      "MONTHLY" : 3,
    };


  }

})();
