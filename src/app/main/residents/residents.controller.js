(function() {
  'use strict';

  angular
    .module('app.residents')
    .controller('ResidentController', ResidentController);


  /** @ngInject */
  function ResidentController($scope, $document, $timeout, $mdDialog, $mdMedia, SliderMapping, $log,
    $mdSidenav, $mdToast, apilaData, authentication, exportCarePlan, exportResidentCensus, exportFaceSheet, exportBlankCarePlan, uiGmapGoogleMapApi, ResidentUpdateInfoService) {
    var vm = this;


    // Data
    vm.checked = [];
    vm.updateInfoList = [];
    vm.colors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg'];
    vm.selectedAccount = 'creapond';
    vm.selectedResident = null;
    vm.toggleSidenav = toggleSidenav;

    vm.responsiveReadPane = undefined;
    vm.activeMailPaneIndex = 0;
    vm.dynamicHeight = false;

    vm.selectedCategory = "Administrative";

    vm.latitude = -1;
    vm.longitude = -1;

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

    vm.checkAll = checkAll;
    vm.closeReadPane = closeReadPane;
    vm.isChecked = isChecked;
    vm.toggleStarred = toggleStarred;
    vm.toggleCheck = toggleCheck;

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
    }

    var arrayFields = ['foodAllergies', 'medicationAllergies', 'otherAllergies', 'foodLikes',
            'foodDislikes', 'outsideAgencyFile', 'psychosocialStatus', 'shopping', 'painManagedBy'];

    function transformResidentForSearch(resident) {

      var searchString = "";

      var fieldsTypes = {};

      for(var key in resident) {
        if(resident.hasOwnProperty(key)) {

          //skip over there fields
          if(key === "_id" || key === '$$hashKey' || key === 'community' || key === 'submitBy' || key === 'submitDate') {
            continue;
          }

          //format dates
          if(key === 'birthDate') {
            fieldsTypes[searchString.length] = key;
            searchString += moment(resident[key]).format('YYYY MM DD') + ' ';
            continue;
          }

          //handling boolean fields
          if(resident[key] == true) {
            fieldsTypes[searchString.length] = key;
            searchString += key + ' ';
            continue;
          }

          //handle arrays
          if(_.includes(arrayFields, key)) {
            fieldsTypes[searchString.length] = key;
            searchString += resident[key].join(' ');
            continue;
          }

          //skip objects for now
          if(angular.isObject(resident[key])) {
            continue;
          }

          if(resident[key]) {
            fieldsTypes[searchString.length] = key;
            searchString += resident[key] + ' ';
          }

        }
      }

      return { searchString: searchString, fieldsTypes: fieldsTypes };
    }

    vm.clearSearch = function() {
      if(vm.search === "") {
        vm.residentList = vm.originalList;
      }
    }

    vm.searchResidents = function() {

      if(vm.search === "") {
        vm.residentList = vm.originalList;
      }

      if(vm.search.length > 0) {
        var residents = vm.allResidents.filter(function(resid) {
          var fullName = (resid.firstName + resid.aliasName + resid.lastName).toLowerCase();

          var searchObject = transformResidentForSearch(resid);

          var indexValue  = searchObject.searchString.toLowerCase().indexOf(vm.search.toLowerCase());

          // var matched = searchObject.searchString.toLowerCase().match(new RegExp(vm.search.toLowerCase(), 'g'));

          // if(matched) {
          //   console.log(matched);
          // }

          if(indexValue !== -1) {
            resid.fieldType = _.startCase(searchObject.fieldsTypes[indexValue.toString()]);
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

      var savedCategory = angular.copy(vm.selectedCategory);
      vm.selectedCategory = "Vitals";

      $timeout(function() {
        var tempCanvas = angular.element("#temperaturecanvas")[0];
        var bloodCanvas = angular.element("#bloodPressureCanvas")[0];
        var oxygenCanvas = angular.element("#oxygenSaturationCanvas")[0];
        var pulseCanvas = angular.element("#plusCanvas")[0];
        var vitalsCanvas = angular.element("#vitalsPainCanvas")[0];
        var respCanvas = angular.element("#respirationCanvas")[0];
        //var weightCanvas = angular.element("#weightCanvas")[0];

        var carePlanData = {};

        // setting all the properties from selectedResident to carePlanData to export
        for (var prop in vm.selectedResident) {
          if (vm.selectedResident.hasOwnProperty(prop)) {
            carePlanData[prop] = vm.selectedResident[prop];
          }
        }

        // vitals graphing
        carePlanData.temperature = tempCanvas.toDataURL();
        carePlanData.bloodCanvas = bloodCanvas.toDataURL();
        carePlanData.oxygen = oxygenCanvas.toDataURL();
        carePlanData.pulse = pulseCanvas.toDataURL();
        carePlanData.vitals = vitalsCanvas.toDataURL();
        carePlanData.resp = respCanvas.toDataURL();
        //carePlanData.weight = weightCanvas.toDataURL();

        // community
        carePlanData.communityName = vm.community.name;
        carePlanData.community = vm.community;

        exportCarePlan.exportPdf(carePlanData);

        vm.selectedCategory = savedCategory;
      }, 700);

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

    function updateResident(resident) {
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
                residentDisplay: resident
              },
              templateUrl: templateUrl,
              parent: angular.element($document.body),
              targetEvent: resident,
              clickOutsideToClose: true
            })
            .then(function(res) {

              if(res) {
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

    /**
     * Toggle sidenav
     *
     * @param sidenavId
     */
    function toggleSidenav(sidenavId) {
      $mdSidenav(sidenavId).toggle();
    }


    /**
     * Close read pane
     */
    function closeReadPane() {
      if (angular.isDefined(vm.responsiveReadPane) && vm.responsiveReadPane) {
        vm.activeMailPaneIndex = 0;

        $timeout(function() {
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
    function toggleStarred(mail, event) {
      event.stopPropagation();
      mail.starred = !mail.starred;
    }

    function toggleCheck(mail, event) {
      if (event) {
        event.stopPropagation();
      }

      var idx = vm.checked.indexOf(mail);

      if (idx > -1) {
        vm.checked.splice(idx, 1);
      } else {
        vm.checked.push(mail);
      }
    }

    /**
     * Return checked status of the mail
     *
     * @param mail
     * @returns {boolean}
     */
    function isChecked(mail) {
      return vm.checked.indexOf(mail) > -1;
    }


    /**
     * Check all
     */
    function checkAll() {
      if (vm.allChecked) {
        vm.checked = [];
        vm.allChecked = false;
      } else {
        angular.forEach(vm.inbox, function(mail) {
          if (!isChecked(mail)) {
            toggleCheck(mail);
          }
        });

        vm.allChecked = true;
      }
    }
  }
})();
