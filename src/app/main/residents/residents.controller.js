(function ()
{
    'use strict';

    angular
        .module('app.residents')
        .controller('MailController', MailController);

    /** @ngInject */
    function MailController($scope, $document, $timeout, $mdDialog, $mdMedia,
                  $mdSidenav, $mdToast,apilaData, authentication, exportPdf)
    {
        var vm = this;

        // Data
        vm.checked = [];
        vm.colors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg'];
        vm.selectedAccount = 'creapond';
        vm.selectedResident = null;
        vm.toggleSidenav = toggleSidenav;

        vm.responsiveReadPane = undefined;
        vm.activeMailPaneIndex = 0;
        vm.dynamicHeight = false;

        vm.scrollPos = 0;
        vm.scrollEl = angular.element('#content');

        vm.selectedMailShowDetails = false;

        vm.categoryList = ["Administrative",
                           "Allergy",
                           "Bathing",
                           "Continent",
                           "Mobility",
                           "Nutrition",
                           "Pain",
                           "Physical condition",
                           "Psychosocial",
                           "Sleep",
                           "Vitals"];

        // Methods
        vm.checkAll = checkAll;
        vm.closeReadPane = closeReadPane;
        vm.composeDialog = composeDialog;
        vm.isChecked = isChecked;
        vm.replyDialog = replyDialog;
        vm.selectResident = selectResident;
        vm.toggleStarred = toggleStarred;
        vm.toggleCheck = toggleCheck;
        vm.updateResident = updateResident;
        vm.exportCarePlan = exportCarePlan;

        vm.selectedCategory = "Administrative";

        vm.switchCategory = function(category) {
          vm.selectedCategory = category;
        }


      apilaData.userCommunity(authentication.currentUser().name)
      .success(function(d) {
          vm.community = d;
          residentList(vm.community._id);
        });


        function residentList(id){
          //loading the list of residents
          apilaData.residentsList(id)
          .success(function(d) {
              vm.residentList = d;
              })
              .error(function(d) {
                console.log("Error retriving the list of residents");
            });
        }


        //////////

        // Watch screen size to activate responsive read pane
        $scope.$watch(function ()
        {
            return $mdMedia('gt-md');
        }, function (current)
        {
            vm.responsiveReadPane = !current;
        });

        // Watch screen size to activate dynamic height on tabs
        $scope.$watch(function ()
        {
            return $mdMedia('xs');
        }, function (current)
        {
            vm.dynamicHeight = current;
        });

        /**
         * Select resident
         *
         * @param resident
         */
        function selectResident(resident)
        {
            vm.selectedResident = resident;

            drawGraphs(vm.selectedResident);

            $timeout(function ()
            {
                // If responsive read pane is
                // active, navigate to it
                if ( angular.isDefined(vm.responsiveReadPane) && vm.responsiveReadPane )
                {
                    vm.activeMailPaneIndex = 1;
                }

                // Store the current scrollPos
                vm.scrollPos = vm.scrollEl.scrollTop();

                // Scroll to the top
                vm.scrollEl.scrollTop(0);
            });
        }

        function createGraphData(vitalType, name)
        {
          var dataValues = _.map(vitalType, "data")
          var timeFrame = _.map(vitalType, function(d) {
            return moment(d.date).format("MMM Do YY");
          });

           var chartData =  {
            labels: timeFrame,
            series: [name],
            data  : [dataValues]
          };

          return chartData;

        }


        function drawGraphs(resident)
        {

          vm.vitalsCharts = [];

          vm.vitalsCharts.push(createGraphData(resident.temperature, 'Temperature'));
          vm.vitalsCharts.push(createGraphData(resident.bloodPressureSystolic, 'Blood Pressure Systolic'));
          vm.vitalsCharts.push(createGraphData(resident.bloodPressureDiastolic, 'Blood Pressure Diastolic'));
          vm.vitalsCharts.push(createGraphData(resident.oxygenSaturation, 'Oxygen Saturation'));
          vm.vitalsCharts.push(createGraphData(resident.pulse, 'Pulse'));
          vm.vitalsCharts.push(createGraphData(resident.vitalsPain, 'Vitals Pain'));
          vm.vitalsCharts.push(createGraphData(resident.respiration, 'Respiration'));

        }

        function exportCarePlan()
        {

          if(vm.selectedResident === null) {
            $mdToast.show(
              $mdToast.simple()
                .textContent("Please selecte a resident to export a care plan")
                .position("top right")
                .hideDelay(2000)
            );
            return;
          }

          vm.selectedCategory = "Vitals";

          $timeout(function ()
          {
            var tempCanvas = angular.element("#temperaturecanvas")[0];
            var bloodSysCanvas = angular.element("#bloodPressureSystolicCanvas")[0];
            var bloodDiasCanvas = angular.element("#bloodPressureDiastolicCanvas")[0];
            var oxygenCanvas = angular.element("#oxygenSaturationCanvas")[0];
            var pulseCanvas = angular.element("#plusCanvas")[0];
            var vitalsCanvas = angular.element("#vitalsPainCanvas")[0];
            var respCanvas = angular.element("#respirationCanvas")[0];

            var carePlanData = {};

            // vitals graphing
            carePlanData.temperature = tempCanvas.toDataURL();
            carePlanData.bloodSys = bloodSysCanvas.toDataURL();
            carePlanData.bloodDias = bloodDiasCanvas.toDataURL();
            carePlanData.oxygen = oxygenCanvas.toDataURL();
            carePlanData.pulse = pulseCanvas.toDataURL();
            carePlanData.vitals = vitalsCanvas.toDataURL();
            carePlanData.resp = respCanvas.toDataURL();

            // admin
            carePlanData.firstName = vm.selectedResident.firstName;
            carePlanData.middleName = vm.selectedResident.middleName;
            carePlanData.lastName = vm.selectedResident.lastName;
            carePlanData.maidenName = vm.selectedResident.maidenName;
            carePlanData.birthDate = vm.selectedResident.birthDate;
            carePlanData.admissionDate = vm.selectedResident.admissionDate;
            carePlanData.sex = vm.selectedResident.sex;
            carePlanData.buildingStatus = vm.selectedResident.buildingStatus;
            carePlanData.movedOutDescribe = vm.selectedResident.movedOutDescribe;
            carePlanData.movedOutTo = vm.selectedResident.movedOutTo;

            // Bathing
            carePlanData.typeOfBathing = vm.selectedResident.typeOfBathing;
            carePlanData.timeOfBathing = vm.selectedResident.timeOfBathing;
            carePlanData.frequencyOfBathing = vm.selectedResident.frequencyOfBathing;
            carePlanData.acceptanceOfBathing = vm.selectedResident.acceptanceOfBathing;
            carePlanData.dislikesBathingDescribe = vm.selectedResident.dislikesBathingDescribe;

            // Mobility
            carePlanData.insideApartment.useOfAssistiveDevice = vm.selectedResident.insideApartment.useOfAssistiveDevice;
            carePlanData.insideApartment.assitanceWithDevice = vm.selectedResident.insideApartment.assitanceWithDevice;
            carePlanData.insideApartment.specialAmbulationNeeds = vm.selectedResident.insideApartment.specialAmbulationNeeds;

            carePlanData.outsideApartment.useOfAssistiveDevice = vm.selectedResident.outsideApartment.useOfAssistiveDevice;
            carePlanData.outsideApartment.assitanceWithDevice = vm.selectedResident.outsideApartment.assitanceWithDevice;
            carePlanData.outsideApartment.specialAmbulationNeeds = vm.selectedResident.outsideApartment.specialAmbulationNeeds;

            carePlanData.transfers = vm.selectedResident.transfers;
            carePlanData.fallRisk = vm.selectedResident.fallRisk;
            carePlanData.fallRiskDescribe = vm.selectedResident.fallRiskDescribe;
            carePlanData.bedReposition = vm.selectedResident.bedReposition;

            // Allergy
            carePlanData.hasFoodAllergies = vm.selectedResident.hasFoodAllergies;
            carePlanData.foodAllergies = vm.selectedResident.foodAllergies;
            carePlanData.hasMedicationAllergies = vm.selectedResident.hasMedicationAllergies;
            carePlanData.medicationAllergies = vm.selectedResident.medicationAllergies;

            // sleep
            carePlanData.usualBedtime = vm.selectedResident.usualBedtime;
            carePlanData.usualArisingTime = vm.selectedResident.usualArisingTime;
            carePlanData.nap = vm.selectedResident.nap;
            carePlanData.napDescribe = vm.selectedResident.napDescribe;
            carePlanData.assistanceToBed = vm.selectedResident.assistanceToBed;
            carePlanData.sleepsThroughNight = vm.selectedResident.sleepsThroughNight;
            carePlanData.canCallForAssistance = vm.selectedResident.canCallForAssistance;

            // Continent
            carePlanData.bowelContinent = vm.selectedResident.bowelContinent;
            carePlanData.constipated = vm.selectedResident.constipated;
            carePlanData.laxative = vm.selectedResident.laxative;
            carePlanData.bladderContinent = vm.selectedResident.bladderContinent;
            carePlanData.dribbles = vm.selectedResident.dribbles;
            carePlanData.catheter = vm.selectedResident.catheter;
            carePlanData.catheterDescribe = vm.selectedResident.catheterDescribe;
            carePlanData.toiletingDevice = vm.selectedResident.toiletingDevice;

            // Nutrition
            

            carePlanData.communityName = vm.community.name;

            exportPdf.exportCarePlan(carePlanData);
          }, 500);
        }

        /**
         * Close read pane
         */
        function closeReadPane()
        {
            if ( angular.isDefined(vm.responsiveReadPane) && vm.responsiveReadPane )
            {
                vm.activeMailPaneIndex = 0;

                $timeout(function ()
                {
                    vm.scrollEl.scrollTop(vm.scrollPos);
                }, 650);
            }
        }

        /**
         * Toggle starred
         *
         * @param mail
         * @param event
         */
        function toggleStarred(mail, event)
        {
            event.stopPropagation();
            mail.starred = !mail.starred;
        }

        /**
         * Toggle checked status of the mail
         *
         * @param mail
         * @param event
         */
        function toggleCheck(mail, event)
        {
            if ( event )
            {
                event.stopPropagation();
            }

            var idx = vm.checked.indexOf(mail);

            if ( idx > -1 )
            {
                vm.checked.splice(idx, 1);
            }
            else
            {
                vm.checked.push(mail);
            }
        }

        /**
         * Return checked status of the mail
         *
         * @param mail
         * @returns {boolean}
         */
        function isChecked(mail)
        {
            return vm.checked.indexOf(mail) > -1;
        }

        /**
         * Check all
         */
        function checkAll()
        {
            if ( vm.allChecked )
            {
                vm.checked = [];
                vm.allChecked = false;
            }
            else
            {
                angular.forEach(vm.inbox, function (mail)
                {
                    if ( !isChecked(mail) )
                    {
                        toggleCheck(mail);
                    }
                });

                vm.allChecked = true;
            }
        }

        /**
         * Open compose dialog
         *
         * @param ev
         */
        function composeDialog(ev)
        {
            $mdDialog.show({
                controller         : 'ComposeDialogController',
                controllerAs       : 'vm',
                locals             : {
                    resList        : vm.residentList
                },
                templateUrl        : 'app/main/residents/dialogs/compose/compose-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : ev,
                clickOutsideToClose: true
            });
        }

        /**
         * Open reply dialog
         *
         * @param ev
         */
        function replyDialog(ev)
        {
            $mdDialog.show({
                controller         : 'ComposeDialogController',
                controllerAs       : 'vm',
                locals             : {
                    selectedResident: vm.selectedResident
                },
                templateUrl        : 'app/main/residents/dialogs/compose/compose-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : ev,
                clickOutsideToClose: true
            });
        }


        function updateResident(ev)
        {
          //switch form based on category selected
          var cat = vm.selectedCategory;

          if(vm.selectedCategory === "Physical condition") {
            cat = "PhysicalCondition";
          }

          var templateUrl = 'app/main/residents/dialogs/update/update-'
                             + cat + '.html';

            $mdDialog.show({
                controller         : 'UpdateController',
                controllerAs       : 'vm',
                locals             : {
                  currAppointment: ev
                },
                templateUrl        : templateUrl,
                parent             : angular.element($document.body),
                targetEvent        : ev,
                clickOutsideToClose: true
            });
        }

        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }
    }
})();
