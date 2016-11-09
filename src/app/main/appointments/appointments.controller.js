(function() {
  'use strict';

  angular
    .module('app.appointments')
    .controller('AppoitmentsController', AppoitmentsController);

  /** @ngInject */
  function AppoitmentsController($mdDialog, $document, apilaData, msNavigationService,
                                 authentication, $state, $scope, SearchService, exportAppointments) {
    var vm = this;

    // Data
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    var appointList = [];

    vm.events = [[]];

    var appointments = null;

    var username = authentication.currentUser().name;
    var userid = authentication.currentUser().id;

    // Functions
    vm.addEvent = addEvent;
    vm.next = next;
    vm.prev = prev;
    vm.exportAppointments = exportAppoint;

    function openIssuesCount(id) {
      apilaData.openIssuesCount(userid, id)
        .success(function(count) {
          msNavigationService.saveItem('fuse.issues', {
            badge: {
              content: count,
              color: '#F44336'
            }
          });
        })
        .error(function(count) {});
    }


    apilaData.userCommunity(userid)
      .success(function(d) {
        vm.community = d;
        loadAppoitnments(vm.community._id);
        openIssuesCount(vm.community._id);
        loadIssues(vm.community._id);
        loadBirthdays(vm.community._id);

        var searchParams = ["title", "transportation", "locationDoctor", "reason", "locationName",
                            "cancel", "appointmentDate"];

        SearchService.setData(appointList, searchParams);

        SearchService.subscribe($scope, function() {

          vm.events[0] = SearchService.getResult();
        });

      });

    var loadAppoitnments = function(id) {

      //load all the events and show them on the callendar
      apilaData.appointmentsList(id)
        .success(function(data) {
          appointments = data;
          var i = 1;
          angular.forEach(data, function(value, key) {
            var currAppoint = addAppointment(value);
            appointList.push(currAppoint);

          });

          vm.events[0] = appointList;

        })
        .error(function(e) {
          console.log("error loading appointments");
        });

    };

    var loadIssues = function(id) {
      apilaData.dueIssuesList(id)
      .success(function(response) {
        angular.forEach(response, function(value, key) {

          var dueDate =  new Date(value.due);

          var calEvent = {
            title: value.title,
            start: dueDate,
            end: null,
            stick: true,
            color: "#228B22"
          };

          appointList.push(calEvent);

        });
      })
      .error(function(response) {

      });
    };

    var loadBirthdays = function(id) {

      apilaData.residentsList(id)
      .success(function(response) {
        angular.forEach(response, function(value, key) {

          // get current year, and set that for birthday on cal
          var currYear = moment().year();
          var startDate = moment(value.birthDate).year(currYear);

          var calEvent = {
            title: value.firstName + " " + value.lastName + "'s Birthday",
            start: startDate,
            end: null,
            stick: true,
            color: "#9C27B0"
          };

          appointList.push(calEvent);

        });
      })
      .error(function(response) {

      });
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

      //fitler out just the events from the selected montg and then map to table
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
        arr.push(d.locationName.formatted_address || d.locationName);
        arr.push(d.locationDoctor);
        arr.push(d.transportation);

        return arr;
      });

      exportAppointments.exportPdf(columns, rows, month);
    }

    function next() {
      vm.calendarView.calendar.next();
    }

    function prev() {
      vm.calendarView.calendar.prev();
    }

    function eventDetail(calendarEvent, e) {
      showEventDetailDialog(calendarEvent, e);
    }

    function select(start, end, e) {
      showEventFormDialog('add', false, start, end, e);
    }

    function addEvent(e) {
      var start = new Date().getUTCDate(),
        end = new Date();

      showEventFormDialog('add', false, start, end, e);
    }


    function showEventDetailDialog(calendarEvent, e) {
      $mdDialog.show({
        controller: 'EventDetailDialogController',
        controllerAs: 'vm',
        templateUrl: 'app/main/appointments/dialogs/event-detail/event-detail-dialog.html',
        parent: angular.element($document.body),
        targetEvent: e,
        clickOutsideToClose: true,
        locals: {
          calendarEvent: calendarEvent,
          showEventFormDialog: showEventFormDialog,
          event: e
        }
      });
    }

    function editEvent(calendarEvent)
    {
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
                (appointment.locationName.formatted_address || appointment.locationName);

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
        stick: true,
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
        templateUrl: 'app/main/appointments/dialogs/event-form/event-form-dialog.html',
        parent: angular.element($document.body),
        targetEvent: e,
        clickOutsideToClose: true,
        locals: {
          dialogData: dialogData
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
