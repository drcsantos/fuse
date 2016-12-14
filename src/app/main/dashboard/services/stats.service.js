(function() {

  'use strict';

  angular
    .module('app.dashboard')
    .service('StatsService', StatsService);


  /** @ngInject */
  function StatsService(apilaData, $log) {

    var communityId = "";
    var averageAge = 0;
    var averageStayTime = 0;

    function getAverageAge() {
      apilaData.averageAge(communityId)
      .success(function(response) {
        $log.debug("averageAge: " + response);
        averageAge = response;
      })
      .error(function(response) {
        $log.debug(response);
      });
    }

    function getAverageStayTime() {
      apilaData.averageStayTime(communityId)
      .success(function(response) {
        averageStayTime = response;
      })
      .error(function(response) {
        $log.debug(response);
      });
    }

    function setData(id, avgAge, avgStayTime) {
      communityId = id;
      averageAge = avgAge;
      averageStayTime = avgStayTime;
    }

    return {
      getAverageAge : getAverageAge,
      getAverageStayTime : getAverageStayTime,
      setData : setData
    };

  }

})();
