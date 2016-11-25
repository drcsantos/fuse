(function ()
{
    'use strict';

    angular.module('app.appointments')
        .controller('AppointmentMapController', AppointmentMapController);

    /** @ngInject */
    function AppointmentMapController($mdDialog, appointments)
    {
      var vm = this;

      // Data
      console.log(appointments);

      // Function
      vm.closeDialog = closeDialog;


      vm.todayLocations = getLocations(isToday);
      vm.tomorrowLocations = getLocations(isTomorrow);

      console.log(vm.tomorrowLocations);

      console.log(vm.locations);

      vm.locationsMap = {
          center: {
            latitude : 33.2148412,
            longitude: -97.13306829999999
          },
          zoom  : 4
          //markers: vm.locations
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
