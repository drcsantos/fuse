(function ()
{
    'use strict';

    angular.module('app.calendar')
        .controller('AppointmentMapController', AppointmentMapController);

    /** @ngInject */
    function AppointmentMapController($mdDialog, appointments)
    {
      var vm = this;

      // Data

      // Function
      vm.closeDialog = closeDialog;

      vm.locationsMap = {
        center: {
          latitude : 33.2148412,
          longitude: -97.13306829999999
        },
        zoom: 4

      };

      vm.tomorrowLocations = getLocations(isTomorrow);
      vm.todayLocations = getLocations(isToday);
      vm.currentWeekLocations = getLocations(isCurrentWeek);

      vm.switchTabs = function(state) {
        if(state === "Today") {
          vm.todayLocations = getLocations(isToday);
        } else if(state === "Tomorrow") {
          vm.tomorrowLocations = getLocations(isTomorrow);
        } else if(state === "This-Week") {
          vm.currentWeekLocations = getLocations(isCurrentWeek);
        }

      };

      function getLocations(timeRange) {

        var locations = [];

        var mainLocations = {};

        _.forEach(appointments, function(d) {
          if(!angular.isString(d.locationName)) {

            var geometry = d.locationName.geometry;
            var name = d.locationName.formatted_address;

            if(geometry && timeRange(d)) {

              //keep track of how many times is each location referenced
              if(!mainLocations[name]) {
                mainLocations[name] = {value: 1};
                mainLocations[name].center = {
                  latitude : geometry.location.lat,
                  longitude: geometry.location.lng
                };
              } else {
                mainLocations[name].value++;
              }

              locations.push({
                'id' : d._id,
                'coords' : {
                  latitude : geometry.location.lat,
                  longitude: geometry.location.lng
                }
              });
            }
          }
        });


        //finding the location that is most used and set the center to that
        var maxValue = {value: -1};

        for(var k in mainLocations) {
          if(mainLocations.hasOwnProperty(k)) {
            if(maxValue.value < mainLocations[k].value) {
              maxValue = mainLocations[k];
            }
          }
        }

        vm.locationsMap.center = maxValue.center || vm.locationsMap.center;
        vm.locationsMap.zoom = 10;

        return locations;
      }


      function isCurrentWeek(appoint) {
        var appointDate = moment(appoint.appointmentDate);
        var currentDate = moment();

        var startOfWeek = moment();
        var endOfWeek = moment();

        var dayOfWeek = currentDate.isoWeekday();

        startOfWeek = moment(currentDate).subtract(dayOfWeek, 'day');

        endOfWeek = moment(startOfWeek).add(6, 'day');

        return appointDate.isBetween(startOfWeek, endOfWeek);

      }

      function isToday(appoint) {
        if(appoint.appointmentDate){
          return moment(appoint.appointmentDate).isSame(moment(), 'day');
        }
      }

      function isTomorrow(appoint) {
        if(appoint.appointmentDate){
          var tomorrow = moment(appoint.appointmentDate);
          return tomorrow.isSame(moment().add(1, 'days'), 'day');
        }
      }

      function closeDialog() {
        $mdDialog.cancel();
      }

    }

})();
