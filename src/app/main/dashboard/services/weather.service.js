(function() {

  'use strict';

  angular
    .module('app.dashboard')
    .service('WeatherService', WeatherService);


  /** @ngInject */
  function WeatherService($http, $log) {

    var API_KEY = "ed6ec2b3aefd4f6fa5a124152171201";

    var tempUnit = "";


    function getWeather(city) {

      var url = "https://api.apixu.com/v1/forecast.json?key=" + API_KEY + "&q=" + city +"&days=4";

      return $http.get(url);
    }

    function mapIcon(weather) {

      weather = weather || '';

      weather = weather.toLowerCase();

      if(weather.indexOf('cloud') !== -1) {
        return 'icon-weather-cloudy';
      } else if(weather.indexOf('clear') !== -1) {
        return 'icon-weather-sunny';
      } else if(weather.indexOf('snow') !== -1) {
        return 'icon-weather-snowy';
      } else if(weather.indexOf('rain') !== -1) {
        return 'icon-weather-rainy';
      }

    }

    function getDay(date) {
      return moment.unix(parseInt(date)).format("dddd");
    }

    function getTempUnit() {
      return tempUnit;
    }

    return {
      getWeather : getWeather,
      getTempUnit: getTempUnit,
      getDay: getDay,
      mapIcon: mapIcon
    };

  }

})();
