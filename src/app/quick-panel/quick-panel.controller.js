(function ()
{
    'use strict';

    angular
        .module('app.quick-panel')
        .controller('QuickPanelController', QuickPanelController);

    /** @ngInject */
    function QuickPanelController(msApi, socket)
    {
        var vm = this;

        // Data
        vm.date = new Date();
        vm.settings = {
            notify: true,
            cloud : false,
            retro : true
        };

        vm.activities = [];

        // Funtions
        vm.getColor = getColor;

        socket.on('add-activity', function(activity) {
          vm.activities.push(activity);
        });

        function getColor(type) {
          switch(type) {
            case "resident-create" || "resident-update":
              return {'background-color': '#C8E6C9'};

            case "issue-create":
              return {'background-color': '#BBDEFB'};

            case "appointment-create":
              return {'background-color': '#FFCDD2'};

            case "join-community":
              return {'background-color': '#FOF4C3'};

            case "task-create":
              return {'background-color': '#FFE0B2'};

            default:
              return {'background-color': 'white'};
          }
        }

    }

})();
