(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardProjectController', DashboardProjectController);

    /** @ngInject */
    function DashboardProjectController($scope, $interval, $mdSidenav, $mdToast, DashboardData,
                        $mdDialog, $document, apilaData, authentication, $window, Idle)
    {
        var vm = this;

        // Data
        vm.dashboardData = DashboardData;
        vm.projects = vm.dashboardData.projects;
        vm.recoveryInfo = {};
        vm.currUserId = null;
        vm.bothRoles = 0;
        vm.chosenUser = '';
        vm.username = authentication.currentUser().name;
        vm.userid = authentication.currentUser().id;

        // stats
        vm.appointmentsToday = 0;
        vm.residentCount = 0;
        vm.issuesCount = 0;
        vm.isCreator = false;
        vm.userRole = '';
        vm.averageAge = 0;
        vm.averageStayTime = 0;

        vm.checkbox = true;
        vm.hasCommunity = false;

        vm.title = 'Join or create a new community';

        vm.myComunity = null;

        vm.pendingMemberTable = [];
        var communityMemberTable = [];

        // Functions
        vm.acceptMember = acceptMember;
        vm.declineMember = declineMember;
        vm.addRole = addRole;
        vm.removeMember = removeMember;
        vm.openRecoverModal = openRecoverModal;
        vm.openJoinModal = openJoinModal;
        vm.updateBillingModal = updateBillingModal;
        vm.cancelSubscription = cancelSubscription;

        Idle.watch();

        // Widget 1
        vm.widget1 = vm.dashboardData.widget1;


        apilaData.userCommunity(vm.userid)
        .success(function(d) {

          vm.myCommunity = d;

          vm.hasCommunity = true;

          console.log(vm.myCommunity);
          vm.isTestCommunity = vm.myCommunity.testCommunity;

          vm.communityMembers = vm.myCommunity.communityMembers;

          setMapLocations(vm.myCommunity._id);

          formatMembersData();


        })
        .error(function(d) {

        });

        function getCommunityMembers(communityid, callback) {

          console.log(communityid);

          apilaData.usersInCommunity(communityid)
          .success(function(response) {
            vm.communityMembers = response;
            console.log(response);
            callback();
          })
          .error(function(response) {
            console.log("Unable to load community members");
          });
        }


        function setMapLocations(id) {
          apilaData.getLocations(id)
          .success(function(response) {

            var markers = [];

            for(var i = 0; i < response.length; ++i) {
              markers.push({
                'id' : i,
                'coords' : {
                  latitude : response[i].movedFrom.latitude,
                  longitude: response[i].movedFrom.longitude
                }
              });
            }

            vm.locationsMap = {
                center: {
                  latitude : 33.2148412,
                  longitude: -97.13306829999999
                },
                zoom  : 4,
                'markers': markers
            };
          })
          .error(function(response) {
            console.log(response);
          });
        }


        function formatMembersData() {
          getAverageAge(vm.myCommunity._id);
          getAverageStayTime(vm.myCommunity._id);

          // WARNING creator checking must be before boss
          if(vm.myCommunity.creator.name === vm.username) {
            vm.isCreator = true;
            vm.userRole = "creator";
            vm.bothRoles++;
          }

          // check if we are creator of the community
          if(vm.myCommunity.boss.name === vm.username) {
            vm.userRole = "boss";
            vm.bothRoles++;
          }

          console.log(vm.bothRoles);

          if(vm.userRole == "") {
            if(_.find(vm.myCommunity.directors, {"name" : vm.username}) !== undefined) {
              vm.userRole = "directors";
            } else if(_.find(vm.myCommunity.minions, {"name" : vm.username}) !== undefined) {
              vm.userRole = "minions";
            }
          }

          console.log(vm.userRole);
          vm.currUserId = (_.find(vm.communityMembers, {'name' : vm.username}))._id;

          loadStats(vm.myCommunity._id);

          communityMemberTable = _.map(vm.communityMembers, function(v) {
            var boss = false;
            var director = false;
            var minion = false;
            var creator = false;
            var role = "";
            var recovery = "";

            console.log(v);

            if(vm.myCommunity.creator.name === v.name) {
              creator = true;
              role = "Creator";
            }

            if(vm.myCommunity.boss.name === v.name) {
              boss = true;
              role = "Boss";
            }

            if(_.find(vm.myCommunity.directors, {"name" : v.name}) !== undefined) {
              director = true;
              role = "Director";
            }

            if(_.find(vm.myCommunity.minions, {"name" : v.name}) !== undefined) {
              minion = true;
              role = "Minion";
            }

            if(v.recovery) {
              vm.chosenUser = v.recovery;

              if(v.recovery === vm.currUserId) {
                console.log("You are selected for recovery");
                recovery = true;
              }
            }

            var userImage = (v.userImage !== undefined) ? v.userImage : "https://s3-us-west-2.amazonaws.com/apilatest2/logo.png";

            return [userImage, v.name, v.email, v._id, boss, director, minion, creator, role, recovery];
          });

          vm.pendingMemberTable = _.map(vm.myCommunity.pendingMembers, function(v) {
            var userImage = (v.userImage !== undefined) ? v.userImage : "https://s3-us-west-2.amazonaws.com/apilatest2/logo.png";

            return [v.userImage, v.name, v.email, v._id];
          });

          vm.dashboardData.communityMemberWidget.table.rows = communityMemberTable;
          vm.dashboardData.pendingMemberWidget.table.rows = vm.pendingMemberTable;

          setWidget();

          vm.title = "Welcome to " + vm.myCommunity.name + " Community";
        }

        // Setting stats data
        function loadStats(id) {
          apilaData.appointmentsToday(id)
          .success(function(d) {
            vm.appointmentsToday = d;
          })
          .error(function(d) {
            console.log("Error loading appointments today count");
          });

          apilaData.residentCount(id)
          .success(function(d) {
            vm.residentCount = d;
          })
          .error(function(d) {
            console.log("Error loading resident count");
          });

          apilaData.issuesCount(id)
            .success(function(count) {
              vm.issuesCount = count;
            })
            .error(function(count) {
            });

        }

        (function getCustomerData() {
          apilaData.getCustomer(vm.userid)
          .success(function(response) {
            vm.customerData = response;

            console.log(vm.customerData);


            if(vm.customerData.customer.subscriptions.data.length > 0) {
              vm.subscriptionCanceled = false;
              vm.billingDate = moment(vm.customerData.customer.subscriptions.data[0].current_period_end * 1000).format('MMMM Do YYYY');
              vm.trialEndDate = moment(vm.customerData.customer.subscriptions.data[0].trial_end * 1000).format('MMMM Do YYYY');
            } else {
              vm.subscriptionCanceled = true;
            }
          })
          .error(function(response) {
            console.log(response);
          });
        })();

        function cancelSubscription() {
          var confirm = $mdDialog.confirm()
           .title('Are you sure you want to cancel your subscription?')
           .textContent('Cancelling means your community will get shut down and other community members would not be able to use it')
           .ariaLabel('Lucky day')
           .ok('Yes')
           .cancel('No');


         $mdDialog.show(confirm).then(function() {
           apilaData.cancelSubscription(vm.userid).
           success(function(response) {
             console.log(response);
             vm.subscriptionCanceled = true;
             $window.location.reload();
           })
           .error(function(response) {
             console.log(response);
           });
         }, function() {

         });
        }


        // Widget 2
        vm.widget2 = vm.dashboardData.widget2;

        // Widget 3
        vm.widget3 = vm.dashboardData.widget3;

        // Widget 4
        vm.widget4 = vm.dashboardData.widget4;


        vm.openCommunityModal = openCommunityModal;

        function acceptMember(index, member)
        {

          console.log("Pending member " + index);

          console.log(vm.pendingMemberTable.length);
          vm.pendingMemberTable.splice(0, 1);
          console.log(vm.pendingMemberTable.length);

          console.log(vm.pendingMemberTable);
          console.log(vm.pendingMemberWidget.table);

          var data = {};
          data.member = member[3];

          var addedMember = member.concat([false, false, true, false, "Minion", ""]);

          apilaData.acceptMember(data, vm.myCommunity._id)
          .success(function(d) {
            member.splice(member.length-1, 1);
            communityMemberTable.push(addedMember);
          })
          .error(function(d) {

          });
        }

        function removeMemberFromTable(userid) {
          for(var i = 0; i < communityMemberTable.length; ++i) {
            if(communityMemberTable[i][3] === userid) {
              communityMemberTable.splice(i, 1);
              return;
            }
          }
        }



        function removeMember(userid, name) {

          var confirm = $mdDialog.confirm()
             .title('Are you sure you want to remove the user ' + name)
             .ariaLabel('Lucky day')
             .ok('Yes')
             .cancel('Cancel');

             $mdDialog.show(confirm).then(function() {
               apilaData.removeMember(vm.myCommunity._id, userid)
               .success(function(response) {
                 console.log(response);
                 removeMemberFromTable(userid);

               })
               .error(function(response) {
                 console.log(response);
               });
              }, function() {

              });

        }

        function declineMember(index, memberid)
        {

          vm.pendingMemberTable.splice(index, 1);

          var data = {};
          data.member = memberid;



          apilaData.declineMember(data, vm.myCommunity._id)
          .success(function(d) {
            console.log(d);
          })
          .error(function(d) {

          });
        }

        function addRole(user, type) {

          var communityid = vm.myCommunity._id;
          var userId = user;

          var data = {};
          data.type = type;

          apilaData.addRole(communityid, userId, data)
          .success(function(response) {
            console.log("Role added");
          })
          .error(function(response) {
            console.log("Couldn't add a role");
          });
        }

        function updateBillingModal(ev)
        {
          $mdDialog.show({
              controller         : 'UpdateBillingController',
              controllerAs       : 'vm',
              templateUrl        : 'app/main/dashboard/dialogs/update_billing/update_billing.html',
              parent             : angular.element($document.body),
              targetEvent        : ev,
              clickOutsideToClose: true
          });
        }


        function openCommunityModal(ev)
        {
          $mdDialog.show({
              controller         : 'CreateCommunityController',
              controllerAs       : 'vm',
              templateUrl        : 'app/main/dashboard/dialogs/create/createCommunity.html',
              parent             : angular.element($document.body),
              targetEvent        : ev,
              clickOutsideToClose: true
          });
        }

        function openJoinModal(ev)
        {
          $mdDialog.show({
              controller         : 'JoinCommunityController',
              controllerAs       : 'vm',
              templateUrl        : 'app/main/dashboard/dialogs/join_community/join_community.html',
              parent             : angular.element($document.body),
              targetEvent        : ev,
              clickOutsideToClose: true
          });
        }


        function openRecoverModal(userToRecoverId, userToRecoverName, type)
        {
          vm.recoveryInfo.userToRecoverId = userToRecoverId;
          vm.recoveryInfo.userToRecoverName = userToRecoverName;
          vm.recoveryInfo.type = type;

          console.log(type);

          if(type === 'randomuser') {
            vm.recoveryInfo.bossId = vm.currUserId;

            showRecoveryDialog();

          } else {

          createRecovery(function(data) {

            showRecoveryDialog();

            vm.recoveryInfo.randomUsersName = data.chosenMemberName;
            vm.recoveryInfo.recoveryid = data.recoveryid;
            vm.recoveryInfo.bossId = vm.currUserId;

          });
        }

        }

        function showRecoveryDialog() {
          $mdDialog.show({
              controller         : 'RecoverController',
              controllerAs       : 'vm',
              templateUrl        : 'app/main/dashboard/dialogs/recover/recover.html',
              parent             : angular.element($document.body),
              locals             : {recoveryInfo: vm.recoveryInfo},
              clickOutsideToClose: true
          });
        }

        function createRecovery(callback) {

          var data = {};
          data.boss = vm.currUserId;
          data.recoveredMember = vm.recoveryInfo.userToRecoverId;

          apilaData.createIssueRecovery(data, vm.myCommunity._id)
          .success(function(response) {
            console.log(response);
            callback(response);
          })
          .error(function(response) {
            console.log(response);
            $mdToast.show(
              $mdToast.simple()
                .textContent(response.message)
                .position("top right")
                .hideDelay(2000)
            );
          });
        }

        function setWidget() {
          vm.communityMemberWidget = {
              title    : vm.dashboardData.communityMemberWidget.title,
              table    : vm.dashboardData.communityMemberWidget.table,
              dtOptions: {
               dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
               pagingType: 'simple',
               autoWidth : false,
               responsive: true,
               order     : [1, 'asc'],
               columnDefs: [
                   {
                       width    : '40',
                       orderable: false,
                       targets  : [0]
                   }
               ]
           }
          };


          vm.pendingMemberWidget = {
              title    : vm.dashboardData.pendingMemberWidget.title,
              table    : vm.dashboardData.pendingMemberWidget.table,
              dtOptions: {
               dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
               pagingType: 'simple',
               autoWidth : false,
               responsive: true,
               order     : [1, 'asc'],
               columnDefs: [
                   {
                       width    : '40',
                       orderable: false,
                       targets  : [0]
                   }
               ]
           }
          };
        }

        // Now widget
        vm.nowWidget = {
            now   : {
                second: '',
                minute: '',
                hour  : '',
                day   : '',
                month : '',
                year  : ''
            },
            ticker: function ()
            {
                var now = moment();
                vm.nowWidget.now = {
                    second : now.format('ss'),
                    minute : now.format('mm'),
                    hour   : now.format('HH'),
                    day    : now.format('D'),
                    weekDay: now.format('dddd'),
                    month  : now.format('MMMM'),
                    year   : now.format('YYYY')
                };
            }
        };

        // Weather widget
        //vm.weatherWidget = vm.dashboardData.weatherWidget;

        // Methods
        vm.toggleSidenav = toggleSidenav;
        vm.selectProject = selectProject;

        //////////
        vm.selectedProject = vm.projects[0];


      //  Now widget ticker
        vm.nowWidget.ticker();

        var nowWidgetTicker = $interval(vm.nowWidget.ticker, 1000);

        $scope.$on('$destroy', function ()
        {
            $interval.cancel(nowWidgetTicker);
        });

        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

        /**
         * Select project
         */
        function selectProject(project)
        {
            vm.selectedProject = project;
        }

        function getAverageAge(id) {
          apilaData.averageAge(id)
          .success(function(response) {
            vm.averageAge = response;
            console.log("Average age: " + response);
          })
          .error(function(response) {
            console.log(response);
          });
        }

        function getAverageStayTime(id) {
          apilaData.averageStayTime(id)
          .success(function(response) {
            vm.averageStayTime = response;
            console.log("Average stay: " + response);
          })
          .error(function(response) {
            console.log(response);
          });
        }

    }

})();
