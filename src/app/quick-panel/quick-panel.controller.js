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

        socket.on('new-activity', function(data) {
          console.log(data);
        });

        vm.activities = [];

        vm.activities.push({
          "text": "Created a Resident bla bla",
          "date": moment().toDate(),
          "author": "shone",
          "type": "resident create"
        });

    }

})();
