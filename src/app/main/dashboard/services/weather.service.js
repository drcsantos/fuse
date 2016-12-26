(function() {

  'use strict';

  angular
    .module('app.dashboard')
    .service('WeatherService', WeatherService);


  /** @ngInject */
  function WeatherService($http, $log) {

    var API_KEY = "f6ae740f7c8d63c065cbaf1ca73ff0ee";

    function getWeather(city, units) {

      var requestUrl = createUrl(city, units);

      return $http.get(requestUrl);

    }

    function windDirection(deg) {
      if(deg >= 0 && deg <= 90) {
        return "NW";
      } else if(deg > 90 && deg <= 180) {
        return "NE";
      } else if(deg > 180 && deg <= 270) {
        return "SE";
      } else if(deg > 270 && deg <= 360) {
        return "SW";
      }
    }

    function createUrl(city, units, countryCode) {

      countryCode = countryCode || "us";
      units = units || 'metric';

      return "http://api.openweathermap.org/data/2.5/forecast?q=" +
            city + "," + countryCode + "&units=" + units + "&mode=json&APPID=" + API_KEY;
    }

    return {
      getWeather : getWeather,
      windDirection: windDirection
    };

  }

})();
