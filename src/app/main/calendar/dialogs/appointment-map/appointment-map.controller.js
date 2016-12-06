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

      console.log(vm.currentWeekLocations);

      vm.locationsMap = {
          center: {
            latitude : 33.2148412,
            longitude: -97.13306829999999
          },
          zoom  : 4
      };

      function getLocations(timeRange) {

        var locations = [];

        _.forEach(appointments, function(d) {
          if(!angular.isString(d.locationName)) {
            var geometry = d.locationName.geometry;

            if(geometry && timeRange(d)) {
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

        return locations;
      }


      function isCurrentWeek(appoint) {
        var appointDate = moment(appoint.appointmentDate);
        var startOfWeek = moment().startOf('week').isoWeekday(1);
        var endOfWeek = startOfWeek.add(6, 'days');

        console.log(startOfWeek.toLocaleString());
        console.log(endOfWeek.toLocaleString());

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
