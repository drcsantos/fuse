(function() {
  'use strict';

  angular
    .module('app.residents')
    .controller('ResidentController', ResidentController);


  /** @ngInject */
  function ResidentController($scope, $document, $timeout, $mdDialog, $mdMedia, SliderMapping, $log, $stateParams, SearchResident,
    $mdSidenav, $mdToast, apilaData, authentication, exportCarePlan, exportResidentCensus, exportFaceSheet, exportBlankCarePlan, uiGmapGoogleMapApi, ResidentUpdateInfoService) {
    var vm = this;


    // Data
    vm.checked = [];
    vm.updateInfoList = [];
    vm.colors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg'];
    vm.selectedAccount = 'creapond';
    vm.selectedResident = null;

    vm.responsiveReadPane = undefined;
    vm.activeMailPaneIndex = 0;
    vm.dynamicHeight = false;

    vm.selectedCategory = "Administrative";

    vm.latitude = -1;
    vm.longitude = -1;

    var dontUpdateUrl = false;

    vm.scrollPos = 0;
    vm.scrollEl = angular.element('#content');

    vm.selectedMailShowDetails = false;

    vm.userid = authentication.currentUser().id;

    vm.categoryList = [
      "Administrative",
      "Allergy",
      "Assistance",
      "Bathing",
      "Incontinent",
      "Life",
      "Mobility",
      "Nutrition",
      "Pain",
      "Physical condition",
      "Psychosocial",
      "Sleep",
      "Vitals",
      "Contacts",
      "Updates"
    ];

    vm.replaceNumberValue = SliderMapping.replaceNumberValue;

    // Methods
    vm.selectResident = selectResident;
    vm.updateResident = updateResident;
    vm.exportCarePlan = exportResident;
    vm.exportCensus = exportCensus;
    vm.exportResidentFaceSheet = exportResidentFaceSheet;
    vm.exportBlankPlan = exportBlankPlan;
    vm.replyDialog = replyDialog;
    vm.composeDialog = composeDialog;

    vm.switchCategory = function(category) {
      vm.selectedCategory = category;
    };

    vm.displayName = function(resident) {
      if(resident.aliasName) {
        return resident.firstName + ' "' + resident.aliasName + '" ' + resident.lastName;
      } else {
        return resident.firstName + ' ' + resident.lastName;
      }

    };

    var currResidBatch = 100;

    vm.showMore = function() {

      // we dont have enough for next page or we loaded everything
      if(vm.residentList.length < 100 || vm.residentList.length === vm.allResidents.length) {
        return;
      }

      // so we dont load the same thing twice
      if(vm.residentList.length <= currResidBatch) {

        var offset = vm.allResidents.length - currResidBatch;

        offset = (offset < 100) ? offset : 100;

        vm.residentList = vm.residentList.concat(vm.allResidents.slice(currResidBatch, currResidBatch + offset));
        currResidBatch += offset;
      }
    };


    vm.clearSearch = function() {
      if(vm.search === "") {
        vm.residentList = vm.originalList;
      }
    }

    // get the end of field text which are seperated by newline
    function findBeginingOfField(indexValue, searchObject) {
       for(var i = indexValue; i >= 0; --i) {
          if(searchObject.searchString[i] === '\n') {
            return i + 1;
          }
       }

       return indexValue;
    }

    vm.searchResidents = function() {

      if(vm.search === "") {
        vm.residentList = vm.originalList;
      }

      if(vm.search.length > 0) {
        var residents = vm.allResidents.filter(function(resid) {
          var fullName = (resid.firstName + resid.aliasName + resid.lastName).toLowerCase();

          var searchObject = SearchResident.transformResidentForSearch(resid);

          var indexValue  = searchObject.searchString.toLowerCase().indexOf(vm.search.toLowerCase());

          if(indexValue !== -1) {

            var fieldType = _.startCase(searchObject.fieldsTypes[indexValue.toString()]);

            //if we didnt find the type of field for the part of string we found
            if(!fieldType) {
              var fieldStart = findBeginingOfField(indexValue, searchObject);

              fieldType = _.startCase(searchObject.fieldsTypes[fieldStart]);
            }

            resid.fieldType = fieldType;
          }

          return indexValue !== -1;
        });

        vm.residentList = residents;
      }

    }

    //small helper function for resident filtering
    function filterResident(condition) {
      return vm.allResidents.filter(function(resid) {
          var buildingStatus = resid.buildingStatus;

          resid.fieldType = buildingStatus;

          if(condition.indexOf(buildingStatus) !== -1) {
            return true;
          } else {
            return false;
          }
        });
    }

    vm.filterByStatus = function(status) {
      if(status === 'all') {
        vm.residentList = vm.originalList;
      } else if(status === 'active') {
        var activeStatuses = ['In Building', 'Rehab', 'Hospital', 'Out of Building'];

        vm.residentList = filterResident(activeStatuses);
      } else {
        var activeStatuses = ['Dead', 'Moved Out'];

        vm.residentList = filterResident(activeStatuses);
      }
    }

    //// INITIAL LOADING  ////
    apilaData.userCommunity(vm.userid)
      .success(function(d) {
        vm.community = d;
        residentList(vm.community._id);
      });



    //loading the list of residents
    function residentList(id) {
      apilaData.residentsFullList(id)
        .success(function(d) {
          vm.allResidents = d;

          vm.residentList = d.slice(0, 100);
          vm.originalList = angular.copy(vm.residentList);

        })
        .error(function(d) {
          $log.debug("Error Retrieving the List of Residents");
        });
    }


    function selectResident(resid) {

      if(resid) {
        console.log(resid);
        apilaData.residentById(resid._id)
        .success(function(resident) {

          resident.submitName = resident.submitBy.name;
          resident.submitBy = resident.submitBy._id;

          vm.selectedResident = resident;

          var contact = _.filter(vm.selectedResident.residentContacts, function(v) {
            if(v._id === resident.handlesFinances) {
              return true;
            }
          });

          if(contact.length > 0) {
            vm.handlesFinances = contact[0].firstName + " " + contact[0].lastName;
          } else {
            vm.handlesFinances = "";
          }

          vm.shownContact = resident.residentContacts[0];

          drawGraphs(vm.selectedResident);

          vm.updateInfoList = ResidentUpdateInfoService.formatUpdateArray(vm.selectedResident.updateInfo, vm.selectedResident);

          if (vm.selectedResident.movedFrom) {
            vm.latitude = vm.selectedResident.movedFrom.latitude;
            vm.longitude = vm.selectedResident.movedFrom.longitude;
          }

          vm.movedFromMap = {
            center: {
              latitude: vm.latitude,
              longitude: vm.longitude
            },
            zoom: 8,
            marker: {
              id: 0,
              coords: {
                latitude: vm.latitude,
                longitude: vm.longitude
              }
            }
          };


          $timeout(function() {
            // If responsive read pane is
            // active, navigate to it
            if (angular.isDefined(vm.responsiveReadPane) && vm.responsiveReadPane) {
              vm.activeMailPaneIndex = 1;
            }

            // Store the current scrollPos
            vm.scrollPos = vm.scrollEl.scrollTop();

            // Scroll to the top
            vm.scrollEl.scrollTop(0);
          });
        });
      }

    }

    function selectedResidentToast() {
      if (vm.selectedResident === null) {
        $mdToast.show(
          $mdToast.simple()
          .textContent("Please Select a Resident to Export")
          .position("top right")
          .hideDelay(2000)
        );
        return false;
      } else {
        return true;
      }
    }


    function exportResident() {

      if(!selectedResidentToast()){
        return;
      }

      var carePlanData = {};

      // setting all the properties from selectedResident to carePlanData to export
      for (var prop in vm.selectedResident) {
        if (vm.selectedResident.hasOwnProperty(prop)) {
          carePlanData[prop] = vm.selectedResident[prop];
        }
      }

      // community
      carePlanData.communityName = vm.community.name;
      carePlanData.community = vm.community;

      carePlanData.tempUnit = vm.community.tempUnit === 'Celsius' ? 'C' : 'F';
      carePlanData.weightUnit = vm.community.weightUnit === 'Pounds' ? 'lbs' : 'kg';

      exportCarePlan.exportPdf(carePlanData);

    }

    function exportCensus() {

      apilaData.residentsFullList(vm.community._id)
      .success(function(residents) {

        var inBuildingResidents = _.filter(residents, ['buildingStatus', 'In Building']);

        if(inBuildingResidents.length === 0) {
          $mdToast.show(
            $mdToast.simple()
            .textContent("There aren't any In Building Residents")
            .position("top right")
            .hideDelay(2000)
          );
        } else {
          exportResidentCensus.exportPdf(residents, inBuildingResidents, vm.community);
        }
      });

    }

    function exportResidentFaceSheet() {

      if(!selectedResidentToast()){
        return;
      }

      var exportData = vm.selectedResident;

      exportData.community = vm.community;

      exportFaceSheet.exportPdf(exportData);
    }

    function exportBlankPlan() {
      exportBlankCarePlan.exportPdf(vm.selectedResident);
    }

    function updateResident(resident, from) {
      //switch form based on category selected
      var cat = vm.selectedCategory;

      if(resident) {

        apilaData.residentById(resident._id)
        .success(function(ress) {

          ress.submitName = ress.submitBy.name;
          ress.submitBy = ress.submitBy._id;

          vm.selectedResident = ress;

          selectResident(resident);

          if (vm.selectedCategory === "Physical condition") {
            cat = "PhysicalCondition";
          }

          if (vm.selectedCategory === "Updates") {
            $mdToast.show(
              $mdToast.simple()
              .textContent("Updates category is not available to update")
              .position("top right")
              .hideDelay(2000)
            );
            return;
          }

          var templateUrl = 'app/main/residents/dialogs/update/update-' +
            cat + '.html';

          $mdDialog.show({
              controller: 'UpdateController',
              controllerAs: 'vm',
              locals: {
                currResident: vm.selectedResident,
                residentDisplay: resident,
                category: cat
              },
              templateUrl: templateUrl,
              parent: angular.element($document.body),
              targetEvent: resident,
              clickOutsideToClose: true
            })
            .then(function(res) {

              if(res) {

                //resident deleted 
                if(res === 'deleted') {
                  vm.selectedResident = null;
                  _.remove(vm.residentList, {_id: resident._id});
                  _.remove(vm.allResidents, {_id: resident._id});
                  _.remove(vm.originalList, {_id: resident._id});

                  $mdToast.show(
                    $mdToast.simple()
                    .textContent("You removed " + resident.firstName + " " + resident.lastName)
                    .position("top right")
                    .hideDelay(2000));
                      
                  return;
                }

                resident.firstName = res.firstName;
                resident.lastName = res.lastName;
                resident.aliasName = res.aliasName;

                apilaData.residentById(resident._id)
                .success(function(updatedRes) {

                  updatedRes.submitName = updatedRes.submitBy.name;
                  updatedRes.submitBy = updatedRes.submitBy._id;

                  vm.selectedResident = updatedRes;

                  vm.updateInfoList = ResidentUpdateInfoService.formatUpdateArray(vm.selectedResident.updateInfo, vm.selectedResident);
                });
              }

            });
        });
      }

    }

    /////////////////////////////////////////////////////////////////
    //// DIALOGS ////

    function composeDialog(ev) {
      $mdDialog.show({
        controller: 'ComposeDialogController',
        controllerAs: 'vm',
        locals: {
          resList: vm.residentList
        },
        templateUrl: 'app/main/residents/dialogs/compose/compose-dialog.html',
        parent: angular.element($document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      });
    }

    function replyDialog(ev) {
      $mdDialog.show({
        controller: 'ComposeDialogController',
        controllerAs: 'vm',
        locals: {
          selectedResident: vm.selectedResident
        },
        templateUrl: 'app/main/residents/dialogs/compose/compose-dialog.html',
        parent: angular.element($document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      });
    }

    /////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////
    //// HELPER FUNCTIONS ////

    function createGraphData(vitalType, name) {
      var dataValues = _.map(vitalType, "data")
      var timeFrame = _.map(vitalType, function(d) {
        return moment(d.date).format("MMM Do YY");
      });

      var chartData = {
        labels: timeFrame,
        series: [name],
        data: [dataValues]
      };

      return chartData;

    }


    function drawGraphs(resident) {

      vm.vitalsCharts = [];

      var bloodDiasValues = _.map(resident.bloodPressureDiastolic, "data")
      var timeFrame = _.map(resident.bloodPressureDiastolic, function(d) {
        return moment(d.date).format("MMM Do YY");
      });

      var bloodSysValues = _.map(resident.bloodPressureSystolic, "data")

      vm.bloodPresureChart = {
        labels: timeFrame,
        series: ['Blood Pressure Diastolic', 'Blood Pressure Systolic'],
        data: [
          bloodDiasValues, bloodSysValues
        ]
      };

      vm.vitalsCharts.push(createGraphData(resident.temperature, 'Temperature'));
      vm.vitalsCharts.push(vm.bloodPresureChart);
      vm.vitalsCharts.push(createGraphData(resident.bloodPressureDiastolic, 'Blood Pressure Diastolic'));
      vm.vitalsCharts.push(createGraphData(resident.oxygenSaturation, 'Oxygen Saturation'));
      vm.vitalsCharts.push(createGraphData(resident.pulse, 'Pulse'));
      vm.vitalsCharts.push(createGraphData(resident.vitalsPain, 'Vitals Pain'));
      vm.vitalsCharts.push(createGraphData(resident.respiration, 'Respiration'));
      vm.vitalsCharts.push(createGraphData(resident.weight, 'Weight'));
      vm.vitalsCharts.push(createGraphData(resident.internationalNormalizedRatio, 'INR'));

    }

    ///////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////
    //// FUSE UI FUNCTIONS ////

    // Watch screen size to activate responsive read pane
    $scope.$watch(function() {
      return $mdMedia('gt-md');
    }, function(current) {
      vm.responsiveReadPane = !current;
    });

    // Watch screen size to activate dynamic height on tabs
    $scope.$watch(function() {
      return $mdMedia('xs');
    }, function(current) {
      vm.dynamicHeight = current;
    });


  }
})();
