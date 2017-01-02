(function() {

  'use strict';

  angular
      .module('app.core')
      .service('Utils', Utils);

  Utils.$inject = [];

  function Utils() {

    function timeDiff(date) {
      var start = moment(date);
      var end = moment();

      var duration = moment.duration(end.diff(start));

      if(duration.asSeconds() < 60) {
        return Math.floor(duration.asSeconds()) + " seconds ago";
      } else if(duration.asMinutes() < 60) {
        return Math.floor(duration.asMinutes()) + " minutes ago";
      } else if(duration.asHours() < 24) {
        return Math.floor(duration.asHours()) + " hours ago";
      } else if(duration.asDays() < 30.4) {
        return Math.floor(duration.asDays()) + " days ago";
      } else if(duration.asMonths() < 12) {
        return Math.floor(duration.asMonths()) + " months ago";
      } else {
        return Math.floor(duration.asYears()) + " years ago";
      }

    }

    return {
      timeDiff: timeDiff
    };
  }

})();
