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

      vm.todayLocations = getLocations(isToday);
      vm.tomorrowLocations = getLocations(isTomorrow);
      vm.currentWeekLocations = getLocations(isCurrentWeek);

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


              vm.locationsMap = {
                center: {
                  latitude : geometry.location.lat,
                  longitude: geometry.location.lng
                },
                zoom: 10

              };

              locations.push({
                'id' : d._id,
                'coords' : vm.locationsMap.center
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

        return locations;
      }


      function isCurrentWeek(appoint) {
        var appointDate = moment(appoint.appointmentDate);
        var startOfWeek = moment().startOf('week').isoWeekday(1);
        var endOfWeek = startOfWeek.add(6, 'days');

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
