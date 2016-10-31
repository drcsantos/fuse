(function ()
{
    'use strict';

    angular
        .module('app.quick-panel')
        .controller('QuickPanelController', QuickPanelController);

    /** @ngInject */
    function QuickPanelController(msApi, socket, authentication, $mdDialog, $document)
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
        vm.openDialogs = openDialogs;

        socket.on('connect', function() {
          var userCommunity = authentication.currentUser().community;

          socket
          .emit('authenticate', {token: authentication.getToken()})
          .on('authenticated', function () {
            socket.emit('join-community', userCommunity);
            socket.emit('get-activities', userCommunity);

            socket.on('recent-activities', function(activities) {
              vm.activities = activities;
            });

            socket.on('add-activity', function(activity) {
              vm.activities.push(activity);
            });
          });

        });

        function getColor(type) {
          switch(type) {
            case "resident-create" || "resident-update":
              return {'background-color': '#C8E6C9'};

            case "issue-create":
              return {'background-color': '#BBDEFB'};

            case "appointment-create":
              return {'background-color': '#FFCDD2'};

            case "community-join":
              return {'background-color': '#FOF4C3'};

            case "task-create":
              return {'background-color': '#FFE0B2'};

            default:
              return {'background-color': 'white'};
          }
        }

        function openDialogs(type) {

          console.log(type);

          switch(type) {
            case "task-create":
            //  openTaskDialog({});
            break;
          }

        }

        function openTaskDialog(task)
        {
            $mdDialog.show({
                controller         : 'TaskDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/todo/dialogs/task/task-dialog.html',
                parent             : angular.element($document.body),
                clickOutsideToClose: true
                // locals             : {
                //     Task : task,
                //     Tasks: vm.tasks
                // }
            }).then(function(error) {
              if(!error) {
            //    loadTasks();
              }
            });
        }

    }

})();
