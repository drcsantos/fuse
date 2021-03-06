(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardProjectController', DashboardProjectController);

    /** @ngInject */
    function DashboardProjectController($scope, $interval, $mdSidenav, $mdToast, msNavigationService, $log, WeatherService,
                        $mdDialog, $document, apilaData, authentication, $window, Idle, MemberService, BillingService)
    {
        var vm = this;

        // Data
        vm.recoveryInfo = {};
        vm.contactInfo = {};
        vm.currUserId = null;
        vm.bothRoles = 0;
        vm.chosenUser = '';
        vm.username = authentication.currentUser().name;
        vm.userid = authentication.currentUser().id;

        vm.community = authentication.currentUser().community;

        vm.roomList = _.flatten(_.map(vm.community.roomStyle, "rooms"));

        // Weather data
        vm.units = "imperial";
        vm.windDirection = WeatherService.windDirection;
        vm.getDay = WeatherService.getDay;
        vm.mapIcon = WeatherService.mapIcon;

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
        vm.selectedProject = {"name" : "Create a new community"};

        vm.myComunity = null;

        vm.pendingMemberTable = [];
        vm.communityMemberTable = [];

        vm.currentStep = 0;

        // Functions
        vm.acceptMember = MemberService.acceptMember;
        vm.declineMember = MemberService.declineMember;
        vm.addRole = MemberService.addRole;
        vm.removeMember = MemberService.removeMember;

        vm.openRecoverModal = openRecoverModal;
        vm.openJoinModal = openJoinModal;
        vm.openCommunityModal = openCommunityModal;

        vm.updateBillingModal = BillingService.updateBillingModal;
        vm.selectProject = selectProject;

        vm.updateContactAndRoomInfo = updateContactAndRoomInfo;
        vm.updateFloors = updateFloors;

        vm.roomDialog = roomDialog;
        vm.getMatches = getMatches;

        vm.refreshWeather = refreshWeather;
        vm.changeWeatherUnit = changeWeatherUnit;

        vm.cancelSubscription = function() {
          BillingService.cancelSubscription(vm.userid, vm.subscriptionCanceled);
        };

        Idle.watch();

        apilaData.userCommunity(vm.userid)
        .success(function(d) {

          vm.myCommunity = d;

          vm.contactInfo = vm.myCommunity;

          vm.communityTown = vm.myCommunity.town || "Denever";

          getWeather();

          vm.hasCommunity = true;
          vm.isTestCommunity = vm.myCommunity.testCommunity;

          vm.communityMembers = vm.myCommunity.communityMembers;

          setMapLocations(vm.myCommunity._id);

          vm.floors = vm.myCommunity.floors;

          formatMembersData();

          MemberService.setData(vm.pendingMemberTable, vm.communityMemberTable, vm.myCommunity._id);

        })
        .error(function(d) {

        });

        function getCommunityMembers(communityid, callback) {

          apilaData.usersInCommunity(communityid)
          .success(function(response) {
            vm.communityMembers = response;
            $log.debug(response);
            callback();
          })
          .error(function(response) {
            $log.debug("Unable to load community members");
          });
        }


        function setMapLocations(id) {
          apilaData.getLocations(id)
          .success(function(response) {

            $log.debug(response);

            var markers = [];

            for(var i = 0; i < response.length; ++i) {

              if(response[i].movedFrom) {
                markers.push({
                  'id' : i,
                  'coords' : {
                    latitude : response[i].movedFrom.latitude,
                    longitude: response[i].movedFrom.longitude
                  }
                });
              }

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
            $log.debug(response);
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

          if(vm.userRole == "") {
            if(_.find(vm.myCommunity.directors, {"name" : vm.username}) !== undefined) {
              vm.userRole = "directors";
            } else if(_.find(vm.myCommunity.minions, {"name" : vm.username}) !== undefined) {
              vm.userRole = "minions";
            }
          }

          vm.currUserId = (_.find(vm.communityMembers, {'name' : vm.username}))._id;

          loadStats(vm.myCommunity._id);

          $log.debug(vm.communityMembers);

          vm.communityMemberTable = _.map(vm.communityMembers, function(v) {
            var boss = false;
            var director = false;
            var minion = false;
            var creator = false;
            var role = "";
            var recovery = "";

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
                $log.debug("You are selected for recovery");
                recovery = true;
              }
            }

            var userImage = (v.userImage !== undefined) ? v.userImage : "https://s3-us-west-2.amazonaws.com/apilatest2/logo.png";

            return [userImage, v.name, v.email, v._id, boss, director, minion, creator, role, recovery];
          });

          $log.debug(vm.communityMemberTable);

          vm.pendingMemberTable = _.map(vm.myCommunity.pendingMembers, function(v) {
            var userImage = (v.userImage !== undefined) ? v.userImage : "https://s3-us-west-2.amazonaws.com/apilatest2/logo.png";

            return [v.userImage, v.name, v.email, v._id];
          });

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
            $log.debug("Error loading appointments today count");
          });

          apilaData.residentCount(id)
          .success(function(d) {
            vm.residentCount = d;
          })
          .error(function(d) {
            $log.debug("Error loading resident count");
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
            if(response.status) {
              vm.customerData = response;

              if(vm.customerData.customer.subscriptions.data.length > 0) {
                vm.subscriptionCanceled = false;
                vm.billingDate = moment(vm.customerData.customer.subscriptions.data[0].current_period_end * 1000).format('MMMM Do YYYY');
                vm.trialEndDate = moment(vm.customerData.customer.subscriptions.data[0].trial_end * 1000).format('MMMM Do YYYY');
              } else {
                vm.subscriptionCanceled = true;
              }
            }

          })
          .error(function(response) {
            //dont show an error if the user didnt create stripe customer info
            if(response.customer !== null) {
              $log.debug(response);
            }
          });
        })();

        apilaData.getUser(vm.userid)
        .success(function(response) {
          vm.activeEmail = response.active;
        })
        .error(function(err) {
          $log.debug(err);
        });

        function openCommunityModal(ev)
        {
          //vm.activeEmail = true; //TODO: REMOVE THIS VERY BAD MUCH JUST FOR TEST

          if(!vm.activeEmail) {
            $mdToast.show(
              $mdToast.simple()
                .textContent("Please verify your email before creating a community")
                .position("top right")
                .hideDelay(2000)
            );
          } else {
            $mdDialog.show({
                controller         : 'CreateCommunityController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/dashboard/dialogs/create/createCommunity.html',
                parent             : angular.element($document.body),
                targetEvent        : ev,
                locals: {
                  activeEmail: vm.activeEmail
                },
                clickOutsideToClose: true
            });
          }

        }

        function getMatches(text) {

          if(text === null) {
            return vm.roomList;
          }

          var textLower = text.toLowerCase();

          var ret = vm.roomList.filter(function (d) {
            if(d) {
              return d.toLowerCase().indexOf(textLower) > -1;
            }
          });

            return ret;
        }

        function openJoinModal(ev)
        {
          //vm.activeEmail = true; //TODO: REMOVE THIS VERY BAD MUCH JUST FOR TEST

          if(!vm.activeEmail) {
            $mdToast.show(
              $mdToast.simple()
                .textContent("Please verify your email before joining a community")
                .position("top right")
                .hideDelay(2000)
            );
          } else {

            $mdDialog.show({
                controller         : 'JoinCommunityController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/dashboard/dialogs/join_community/join_community.html',
                parent             : angular.element($document.body),
                targetEvent        : ev,
                clickOutsideToClose: true
            });
          }
        }

        /////////////////////////////// WEATHER ///////////////////////////////


        function getWeather() {
          WeatherService.getWeather(vm.communityTown, vm.units)
          .then(function(response) {
            vm.tempUnit = WeatherService.getTempUnit();
            vm.weatherData = response.data;
          })
          .catch(function(err) {
            $log.error(err);
          });

          WeatherService.currentWeather(vm.communityTown, vm.units)
          .then(function(response) {
            vm.tempUnit = WeatherService.getTempUnit();
            vm.currentWeather  = response.data;
          })
          .catch(function(err) {
            $log.error(err);
          });
        }

        function refreshWeather(){
          getWeather();
        };

        function changeWeatherUnit() {
          if(vm.units === 'metric') {
            vm.units = 'imperial';
          } else {
            vm.units = 'metric';
          }

          getWeather();
        };


        /////////////////////////////// WEATHER ///////////////////////////////

        function updateFloors() {

          apilaData.updateFloor(vm.myCommunity._id, vm.floors)
          .success(function(resp) {
            $log.debug(resp);
          })
          .error(function(err) {
            $log.debug(err);
          })
        }

        function updateContactAndRoomInfo(type) {

          vm.contactInfo.rooms = vm.myCommunity.rooms;

          if(type === "floors") {

            var newFloors = vm.myCommunity.numFloors - vm.floors.length;

            if(vm.floors.length === 0) { //create floors for first time
              vm.floors = generateFloors(vm.myCommunity.numFloors, 0);

            } else if(newFloors > 0) {  // adding new floors
              vm.floors = vm.floors.concat(generateFloors(newFloors, vm.floors.length));

            } else if(newFloors < 0) { // removing new floors
              vm.floors.splice(newFloors);

            } if(vm.myCommunity.numFloors === 0) { // reset floors
              vm.floors = [];
            }

          } else if(type === "town") {
            vm.communityTown = vm.contactInfo.town;
            getWeather();
          }

          vm.contactInfo.floors = vm.floors;

          apilaData.updateContactAndRoomInfo(vm.myCommunity._id, vm.contactInfo)
          .error(function(err) {
            $log.debug(err);
          });
        }

        function generateFloors(numFloors, startCount) {

          var floorRange = _.range(numFloors);

          var floors = _.map(floorRange, function(floorNumber) {
           return {
             floorNumber: floorNumber + startCount,
             startRoom: null,
             endRoom: null
           }});

           return floors;
        }

        function openRecoverModal(userToRecoverId, userToRecoverName, type)
        {
          vm.recoveryInfo.userToRecoverId = userToRecoverId;
          vm.recoveryInfo.userToRecoverName = userToRecoverName;
          vm.recoveryInfo.type = type;

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

        function roomDialog(room) {

          $mdDialog.show({
              controller         : 'RoomStyleController',
              controllerAs       : 'vm',
              templateUrl        : 'app/main/dashboard/dialogs/room_style/room_style.html',
              parent             : angular.element($document.body),
              locals             : {roomStyles: vm.myCommunity.roomStyle, room: room},
              clickOutsideToClose: true
          }).then(function(resp) {

            vm.community.roomStyle = resp;

            vm.roomList = _.flatten(_.map(vm.community.roomStyle, "rooms"));
          });
        }

        function createRecovery(callback) {

          var data = {};
          data.boss = vm.currUserId;
          data.recoveredMember = vm.recoveryInfo.userToRecoverId;

          apilaData.createIssueRecovery(data, vm.myCommunity._id)
          .success(function(response) {
            callback(response);
          })
          .error(function(response) {
            $log.debug(response);
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
              title    : "Community Members",
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

        function getAverageAge(id) {
          apilaData.averageAge(id)
          .success(function(response) {
            vm.averageAge = response;
            $log.debug("Average age: " + response);
          })
          .error(function(response) {
            $log.debug(response);
          });
        }

        function getAverageStayTime(id) {
          apilaData.averageStayTime(id)
          .success(function(stayTime) {
            vm.averageStayTime = Math.floor(stayTime);
          })
          .error(function(err) {
            $log.debug(err);
          });
        }

        function selectProject(project)
        {
            vm.selectedProject = project;
        }


        ///////////////////// THEME CODE //////////////////////////////////

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

        // Methods
        vm.toggleSidenav = toggleSidenav;

      //  Now widget ticker
        vm.nowWidget.ticker();

        var nowWidgetTicker = $interval(vm.nowWidget.ticker, 1000);

        $scope.$on('$destroy', function ()
        {
            $interval.cancel(nowWidgetTicker);
        });

        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

    }

})();
