(function ()
{
    'use strict';

    angular
        .module('app.quick-panel')
        .controller('QuickPanelController', QuickPanelController);

    /** @ngInject */
    function QuickPanelController(msApi, socket, $log, authentication, $window, $mdDialog, $document, apilaData, msNavigationService)
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
        var community = authentication.currentUser().community;
        var user = {
            name: authentication.currentUser().name,
            userImage: authentication.getUserImage()
        };

        var communityid = authentication.currentUser().community._id;

        var tasks = [];

        apilaData.activeTasksCount(todoid).then(function(response) {
          msNavigationService.saveItem('fuse.to-do', {
            badge: {
              content: response.data,
              color: '#FF6F00'
            }
          });
        });

          apilaData.openIssuesCount(authentication.currentUser().id, community._id)
            .success(function(count) {
              msNavigationService.saveItem('fuse.issues', {
                badge: {
                  content: count,
                  color: '#F44336'
                }
              });
            });

        // Funtions
        vm.getColor = getColor;

        apilaData.listTasks(todoid)
        .success(function(response) {
          tasks = response;
        });

        //check for tasks that became active
        setInterval(function() {

          var currTime = moment();

          tasks.forEach(function(task) {
            var inCycle = isInActiveCycle(task, currTime);
            if(!currTime.isSame(task.cycleDate, "day") && inCycle("days")){
              $log.debug("Set activity");
              addActivity(task);
            }
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

            socket.on('member-accepted', function(data) {
              $log.debug(data);
              if(authentication.currentUser().id === data.id) {
                $log.debug("Open accept dialog");
                openAcceptDialog(data.communityName);
              }
            });
          });

        });

        function openAcceptDialog(communityName) {
          $mdDialog.show({
              controller         : 'MemberAcceptedController',
              controllerAs       : 'vm',
              templateUrl        : 'app/quick-panel/dialogs/member-accepted.html',
              parent             : angular.element($document.body),
              locals: {
                communityName: communityName
              },
              clickOutsideToClose: true
          });
        }

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

        function addActivity(task) {

          var hasActivity = false;

          vm.activities.forEach(function(value) {
            if(moment().isSame(moment(value.createdOn), "day") && task.text + " is active" === value.text) {
              hasActivity = true;
            }
          });

          if(!hasActivity) {
            var activity = {
              _id: moment().format(),
              type: "task-active",
              createdOn: moment().toDate(),
              text: task.text + " is active",
              userId: user,
              communityId: communityid
            };

            vm.activities.push(activity);
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

    }

})();
