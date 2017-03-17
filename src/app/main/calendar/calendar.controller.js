(function() {
  'use strict';

  angular
    .module('app.calendar')
    .controller('AppoitmentsController', AppoitmentsController);

  /** @ngInject */
  function AppoitmentsController($mdDialog, $document, apilaData, msNavigationService, $log,
                                 authentication, $state, $scope, SearchService, exportAppointments) {
    var vm = this;

    // Data
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    var appointList = [];

    vm.events = [[]];

    var visitedMonths = {};

    var appointments = null;

    var searchParams = ["title", "transportation", "locationDoctor", "reason", "locationName",
                        "cancel", "appointmentDate"];

    var username = authentication.currentUser().name;
    var userid = authentication.currentUser().id;
    var communityid = authentication.currentUser().communityId;

    // Functions
    vm.addEvent = addEvent;
    vm.next = next;
    vm.prev = prev;
    vm.exportAppointments = exportAppoint;
    vm.openAppointmentMapDialog = openAppointmentMapDialog;

    //resident list for the dropdown select
    apilaData.residentsList(communityid)
      .success(function(residentList) {

        vm.birthdayResidents = residentList;

        vm.residentList = residentList.map(function(resid) {

          var name = resid.aliasName ? resid.aliasName : resid.firstName;

          return {value:resid._id, display: name + " " + resid.lastName};
        });
      })
      .error(function(err) {
        $log.debug(err);
      });

    apilaData.userCommunity(userid)
      .success(function(d) {
        vm.community = d;
        loadAppoitnments(vm.community._id, moment().format("YYYY M"));
        visitedMonths[moment().format("YYYY M")] = true; //remember that we loaded curr month

      });

    var loadAppoitnments = function(id, month) {

      //load all the events and show them on the callendar
      apilaData.appointmentsList(id, month)
        .success(function(data) {

          if(data.length === 0) {
            loadIssues(id, month);
            return;
          }

          appointments = data;
          var appointLists = [];
          angular.forEach(data, function(value, key) {
            var currAppoint = addAppointment(value);
            appointLists.push(currAppoint);

          });

          vm.events[0] = vm.events[0].concat(appointLists);

          SearchService.setData(appointLists, searchParams);
          SearchService.subscribe($scope, function() {
          
            vm.events[0] = SearchService.getResult();
          });

          loadIssues(id, month);

        })
        .error(function(err) {
          $log.debug(err);
        });

    };

    var loadIssues = function(id, month) {
      apilaData.dueIssuesList(id)
      .success(function(response) {
        angular.forEach(response, function(value, key) {

          var splitedMonth = month.split(' ');

          if(value.due && splitedMonth && moment(value.due).format('M') === splitedMonth[1]) {
            var dueDate = new Date(value.due);

            var calEvent = {
              title: value.title,
              start: dueDate,
              end: null,
              stick: true,
              color: "#228B22"
            };

            vm.events[0].push(calEvent);
          }

        });

        loadBirthdays(id, month);
      })
      .error(function(response) {
        $log.debug(response);
      });
    };

    var addBirthdays = function(residents, id, month) {
       angular.forEach(residents, function(resident) {

          // get current year, and set that for birthday on cal
          var currYear = moment().year();

          var splitedMonth = month.split(' ');

          if(resident.birthDate && splitedMonth && resident.buildingStatus !== "Dead" && resident.buildingStatus !== "Moved Out" &&
            moment(resident.birthDate).format('M') === splitedMonth[1]) {
            var startDate = moment(resident.birthDate).year(currYear);

            var calEvent = {
              title: resident.firstName + " " + resident.lastName + "'s Birthday",
              start: startDate,
              end: null,
              stick: true,
              color: "#9C27B0"
            };

            vm.events[0].push(calEvent);
          }


        });
    };

    var loadBirthdays = function(id, month) {

      // if residents list already loaded just add it if not send a request to api
      if(vm.birthdayResidents) {
        addBirthdays(vm.birthdayResidents, id, month);
      } else {
        apilaData.residentsList(id)
        .success(function(response) {
          addBirthdays(response, id, month);
        })
        .error(function(err) {
          $log.debug(response);
        });
      }

    };

    vm.calendarUiConfig = {
      calendar: {
        editable: true,
        eventLimit: false,
        header: '',
        handleWindowResize: false,
        aspectRatio: 1,
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        viewRender: function(view) {

          vm.calendarView = view;
          vm.calendar = vm.calendarView.calendar;
          vm.currentMonthShort = vm.calendar.getDate().format('MMM');

        },
        columnFormat: {
          month: 'ddd',
          week: 'ddd D',
          day: 'ddd M'
        },
        eventClick: editEvent,
        selectable: true,
        selectHelper: true,
        select: select
      }
    };

    function exportAppoint() {

      var columns = ["Resident", "Date", "Reason", "Location", "Doctor", "Transportation"];

      var month = vm.calendar.getDate().format("MMMM");

      //firt sort the events by date
      var sortedEvents = _.sortBy(vm.events[0], function(p) {
        return p.start;
      });

      //fitler out just the events from the selected month and then map to table
      var rows = _.map(_.filter(sortedEvents, function(o) {
        return moment(o.start).format("MM") === vm.calendar.getDate().format("MM") && o.cancel === false;
      }),

      function(d) {
        var arr = [];

        var name = "";
        if (d.residentGoing != null) {
          name = d.residentGoing.firstName + " " + d.residentGoing.lastName;
        }

        arr.push(name);
        arr.push(moment(d.start).format("MM/DD hh:mm A"));
        arr.push(d.reason);
        arr.push(d.locationName.name || d.locationName);
        arr.push(d.locationDoctor);
        arr.push(d.transportation);

        return arr;
      });

      exportAppointments.exportPdf(columns, rows, month);
    }

    function next() {
      vm.calendarView.calendar.next();

      var currMonth = vm.calendar.getDate().format("YYYY M");

      if(!visitedMonths[currMonth]) {
        loadAppoitnments(vm.community._id, currMonth);
        visitedMonths[currMonth] = true;
      }
    }

    function prev() {
      vm.calendarView.calendar.prev();

      var currMonth = vm.calendar.getDate().format("YYYY M");

      if(!visitedMonths[currMonth]) {
        loadAppoitnments(vm.community._id, currMonth);
        visitedMonths[currMonth] = true;
      }
    }

    function select(start, end, e) {
      showEventFormDialog('add', false, start, end, e);
    }

    function addEvent(e) {
      var start = new Date().getUTCDate(),
        end = new Date();

      showEventFormDialog('add', false, start, end, e);
    }

    function editEvent(calendarEvent)
    {
        console.log(calendarEvent);
        showEventFormDialog('edit', calendarEvent, false, false, event);
    }

    function addAppointment(appointemnt) {
      return createAppointemnt(appointemnt, "add");
    }

    function updateAppointment(appointemnt) {
      return createAppointemnt(appointemnt, "update");
    }

    function createAppointemnt(appointment, type) {
      var hours = appointment.hours;

      if (!appointment.isAm) {
        appointment.hours += 12;
      }

      //if it's 12 am we need it to 00 for the ISO format thing
      if(appointment.hours === 12 && appointment.isAm) {
        appointment.hours = 0;
      }

      //if it's 12 pm it will be 24 but we need to set 12 in ISO format
      if(appointment.hours === 24) {
        appointment.hours = 12;
      }

      var startDate = new Date(appointment.appointmentDate);
      startDate.setHours(appointment.hours);
      startDate.setMinutes(appointment.minutes);

      var resident = appointment.residentGoing;

      var name = resident.aliasName ? resident.aliasName : resident.firstName;

      var title = name + " " + resident.lastName + " to " +
                (appointment.locationName.name || appointment.locationName);

      var calEvent = {
        title: title,
        start: startDate,
        end: null,
        transportation: appointment.transportation,
        reason: appointment.reason,
        isAm: appointment.isAm,
        minutes: appointment.minutes,
        hours: hours,
        timezone: appointment.timezone,
        locationDoctor: appointment.locationDoctor,
        locationName: appointment.locationName,
        date: appointment.time,
        currentUser: resident,
        appointId: appointment._id,
        cancel: appointment.cancel,
        appointmentComment: appointment.appointmentComment,
        residentGoing: resident,
        stick: true
      };

      if(type === "add") {
        calEvent.id = appointment._id;
        calEvent._id = appointment._id;
      }

      if (appointment.cancel === true) {
        calEvent.color = "#f24438";
      }

      return calEvent;
    }

    function openAppointmentMapDialog() {
      $mdDialog.show({
        controller: 'AppointmentMapController',
        controllerAs: 'vm',
        templateUrl: 'app/main/calendar/dialogs/appointment-map/appointment-map.html',
        parent: angular.element($document.body),
        clickOutsideToClose: true,
        locals: {
          appointments: appointments
        }
      });
    }


    function showEventFormDialog(type, calendarEvent, start, end, e) {
      var dialogData = {
        type: type,
        calendarEvent: calendarEvent,
        start: start,
        end: end
      };

      $mdDialog.show({
        controller: 'EventFormDialogController',
        controllerAs: 'vm',
        templateUrl: 'app/main/calendar/dialogs/event-form/event-form-dialog.html',
        parent: angular.element($document.body),
        targetEvent: e,
        clickOutsideToClose: true,
        locals: {
          dialogData: dialogData,
          residentList: vm.residentList
        }
      }).then(function(response) {

        if (response.type === 'add') {
          vm.events[0].push(addAppointment(response.calendarEvent));
        } else {

          for (var i = 0; i < vm.events[0].length; i++) {

            // Update
            if (vm.events[0][i].appointId === response.calendarEvent.appointId) {

              vm.events[0][i] = updateAppointment(response.calendarEvent);
              break;
            }
          }
        }
      });
    }

  }

})();
