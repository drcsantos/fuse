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

        var communityid = authentication.currentUser().communityId;

        var tasks = [];
        var issueCount = 0;

        apilaData.activeTasksCount(todoid).then(function(response) {
          msNavigationService.saveItem('fuse.to-do', {
            badge: {
              content: response.data,
              color: '#FF6F00'
            }
          });
        });

        //Update every 5 min. for task cound update
        setInterval(function() {
          apilaData.activeTasksCount(todoid).then(function(response) {
            msNavigationService.saveItem('fuse.to-do', {
              badge: {
                content: response.data,
                color: '#FF6F00'
              }
            });
          });
        }, 5*60000);

        function updateIssueBadge(count) {
          msNavigationService.saveItem('fuse.issues', {
            badge: {
              content: count,
              color: '#F44336'
            }
          });
        }

        apilaData.openIssuesCount(authentication.currentUser().id, authentication.currentUser().communityId)
          .success(function(count) {
            issueCount = count;
            updateIssueBadge(count);
          });

        // Funtions
        vm.getColor = getColor;

        apilaData.listTasks(todoid)
        .success(function(response) {
          tasks = response;
        });

        //check for tasks that became active
        // setInterval(function() {
        //
        //   var currTime = moment();
        //
        //   tasks.forEach(function(task) {
        //     var inCycle = isInActiveCycle(task, currTime);
        //
        //     switch (task.occurrence) {
        //       case 0:
        //         if(inCycle("hours") && currTime.hour() !== task.cycleDate.hour()){
        //           addActivity(task);
        //         }
        //       break;
        //
        //       case 1:
        //         if(!currTime.isSame(task.cycleDate, "day") && inCycle("days")){
        //           addActivity(task);
        //         }
        //       break;
        //
        //       case 2:
        //         if(!currTime.isSame(task.cycleDate, "week") && inCycle("weeks")){
        //           addActivity(task);
        //         }
        //       break;
        //
        //       case 3:
        //         if(!currTime.isSame(task.cycleDate, "month") && inCycle("months")){
        //           addActivity(task);
        //         }
        //       break;
        //
        //     }
        //
        //   });
        // }, 15000);

        socket.on('connect', function() {
          var userCommunity = authentication.currentUser().community;
          var userid = authentication.currentUser().id;

          socket
          .emit('authenticate', {token: authentication.getToken()})
          .on('authenticated', function () {
            socket.emit('join-community', {community: userCommunity, userid: userid});

            socket.emit('get-activities', userCommunity, userid);

            socket.on('recent-activities', function(activities) {
              vm.activities = activities;
              console.log("Activities loaded");
            });

            socket.on('issue-count-update', function(type) {
              console.log("In issue update count " + issueCount);
              if(type === 'increment') {
                updateIssueBadge(++issueCount);
              } else if(type === 'decrement') {
                updateIssueBadge(--issueCount);
              }
            });

            socket.on('add-activity', function(activity) {

              var exists = _.find(vm.activities, {_id: activity._id});

              console.log("Activity Added!");

              if(!exists) {
                vm.activities.push(activity);
              }

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

            $log.debug(value.text);

            if(moment().isSame(moment(value.createdOn), "day") && ("Task " + task.text + " is active") === value.text) {
              hasActivity = true;
            }
          });

          if(!hasActivity) {
            var activity = {
              type: "task-active",
              text: "Task " + task.text + " is active",
              userId: authentication.currentUser().id,
              communityId: communityid
            };

            saveActivity(activity);

          }
        }

        function saveActivity(acitivity) {
          apilaData.createToDoActivity(todoid, acitivity)
          .success(function(resp) {
            vm.activities.push(resp);
          })
          .error(function(err) {
            $log.debug(err);
          });
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
