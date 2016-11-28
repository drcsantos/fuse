(function ()
{
    'use strict';

    angular
        .module('app.quick-panel')
        .controller('QuickPanelController', QuickPanelController);

    /** @ngInject */
    function QuickPanelController(msApi, socket, authentication, $mdDialog, $document, apilaData)
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

        var todoid = authentication.currentUser().todoid;
        var tasks = [];

        // Funtions
        vm.getColor = getColor;
        vm.openDialogs = openDialogs;

        apilaData.listTasks(todoid)
        .success(function(response) {
          tasks = response;
        });

        //check for tasks that became active
        setInterval(function() {

          tasks.forEach(function(task) {
            var inCycle = isInActiveCycle(task, moment());
            console.log(inCycle("days"));
          });
        }, 10000);

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

        function isInActiveCycle(task, currTime) {

          var currHour = currTime.hour();
          var currDay = currTime.isoWeekday();
          var currWeek = weekOfMonth(currTime);
          var currMonth = currTime.month();

          return function(cycle){
            if(cycle === "hours") {
              return (currHour >= task.hourStart && currHour <= task.hourEnd);
            } else if(cycle === "days") {
              return task.activeDays[currDay - 1];
            } else if(cycle === "weeks") {
              return task.activeWeeks[currWeek - 1];
            } else if(cycle === "months") {
              return task.activeMonths[currMonth];
            }
          };

        }

        function weekOfMonth(m) {
          return m.week() - moment(m).startOf('month').week() + 1;
        }

        function openDialogs(type) {
        }

    }

})();
