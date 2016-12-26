(function() {

  'use strict';

  angular
    .module('app.dashboard')
    .service('WeatherService', WeatherService);


  /** @ngInject */
  function WeatherService($http, $log) {

    var API_KEY = "f6ae740f7c8d63c065cbaf1ca73ff0ee";

    var tempUnit = "";


    function currentWeather(city, units) {
      units = units || 'metric';

      var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city +"&units=" + units
                + "&mode=json&APPID=" + API_KEY;

      return $http.get(url);
    }

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

      if(units === 'metric') {
        tempUnit = "C";
      } else {
        tempUnit = "F";
      }

      return "http://api.openweathermap.org/data/2.5/forecast/daily?q=" +
            city + "," + countryCode + "&units=" + units + "&mode=json&APPID=" + API_KEY;
    }

    function mapIcon(weather) {

      weather = weather || '';

      weather = weather.toLowerCase();

      switch (weather) {
        case 'clear':
          return 'icon-weather-sunny'
        break;

        case 'clouds':
          return 'icon-weather-cloudy';
        break;

        case 'snow':
          return 'icon-weather-snowy'
        break;

        case 'rain':
          return 'icon-weather-rainy'
        break;

        default:
        return '';
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
      windDirection: windDirection,
      getTempUnit: getTempUnit,
      getDay: getDay,
      mapIcon: mapIcon,
      currentWeather: currentWeather
    };

  }

})();
