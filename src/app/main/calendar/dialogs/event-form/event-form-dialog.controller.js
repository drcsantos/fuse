(function() {
  'use strict';

  angular.module('app.calendar')
    .controller('EventFormDialogController', EventFormDialogController);

  /** @ngInject */
  function EventFormDialogController($mdDialog, dialogData, residentList, $log, apilaData, errorCheck, authentication, $window, $mdToast, Utils, exportAppointDetail) {
    var vm = this;

    // Data
    vm.dialogData = dialogData;

    vm.isDisabled = false;
    vm.Utils = Utils;

    vm.residentList = residentList;

  //  vm.calendarEvent.date = dialogData.start;
    var userid = authentication.currentUser().id;

    var requiredArray = ['reason', 'locationName'];

    vm.error = {};

    // Methods
    vm.saveEvent = saveEvent;
    vm.closeDialog = closeDialog;
    vm.updateIssue = updateIssue;
    vm.exportAppointment = exportAppointment;
    vm.inUpdate = inUpdate;
    vm.submitComment = submitComment;
    vm.getMatches = getMatches;

    init();

    var communityid = authentication.currentUser().community._id;
    vm.community = authentication.currentUser().community;

    //////////

    //This will only be set when the add part is active
    vm.dayTimeSwitch = "AM";
    vm.showCancel = false;

    vm.autocompleteOptions = {
       componentRestrictions: { country: 'us' },
       types: ['establishment']
    };

    //If we are in the add dialog
    if (!inUpdate()) {
          vm.transportation = "We are transporting";
          vm.showCancel = true;
          vm.currentTime =  new Date();
      }

      vm.changeComment = function(comment) {
        return comment.split(/((?:\w+ ){15})/g).filter(Boolean).join("\n");
      };

    function getMatches(text) {
      if(!text) {
         return vm.residentList;
       }

       var textLower = text.toLowerCase();

       var ret = vm.residentList.filter(function (d) {
           if(d.display != null) {
             return d.display.toLowerCase().indexOf(textLower) > -1;
           }

       });

       return ret;
     }

    vm.selectedUser = {};


      //if we are in the update model set fields value
      if (vm.dialogData.calendarEvent) {

        vm.dayTimeSwitch = vm.calendarEvent.isAm;

        vm.currentTime = new Date();

        if(vm.calendarEvent.isAm) {
          vm.currentTime.setHours(vm.calendarEvent.hours);
        } else {
          vm.currentTime.setHours(vm.calendarEvent.hours + 12);
        }

        vm.currentTime.setMinutes(vm.calendarEvent.minutes);

        if(vm.dayTimeSwitch == false) {
          vm.dayTimeSwitch = "PM";
        } else {
          vm.dayTimeSwitch = "AM";
        }

        var firstName = vm.calendarEvent.currentUser.aliasName || vm.calendarEvent.currentUser.firstName;

        var fullName = firstName + " " + vm.calendarEvent.currentUser.lastName;

        vm.selectedItem = {value: vm.calendarEvent.currentUser._id,
                           display: fullName
                             };

        vm.selectedUser = vm.calendarEvent.currentUser;

        vm.currDay = moment().isoWeekday();

      }

    function updateIssue()
    {
      if (inUpdate())
      {
        if(vm.selectedItem){
          saveEvent();
        }

      }

    }


    /**
     * Initialize
     */
    function init() {
      vm.dialogTitle = (vm.dialogData.type === 'add' ? 'Add Appointment' : 'Edit Appointment');

      // Edit
      if (vm.dialogData.calendarEvent) {

        vm.calendarEvent = angular.copy(vm.dialogData.calendarEvent);

        vm.calendarEvent.reason = vm.calendarEvent.reason;
        vm.isCancel = vm.calendarEvent.cancel;

        vm.date = new Date(vm.calendarEvent.start);

        //vm.date.setHours(parseInt(vm.calendarEvent.hours) + parseInt(vm.date.getTimezoneOffset()/60));
        vm.transportation = vm.calendarEvent.transportation;


        // Convert moment.js dates to javascript date object
        if (moment.isMoment(vm.calendarEvent.date)) {
          vm.calendarEvent.date = vm.calendarEvent.date.toDate();
        }

      }
      // Add
      else {
        // Convert moment.js dates to javascript date object
        if (moment.isMoment(vm.dialogData.date)) {

          vm.dialogData.date = vm.dialogData.date.toDate();

        }
        vm.calendarEvent = {
          start: vm.dialogData.start,
          end: vm.dialogData.end
        };

        //the date that is set when we click the dialog must be in local time for the md-datepicker
        if(dialogData.start._d !== undefined) {
          vm.date = utcToLocalDate(dialogData.start._d);
          $log.debug(vm.date);
        }


      }
    }


    function saveEvent() {

      if(checkFields()) {
        return;
      }

      //set up the date to proper fields before sending to the api
      vm.calendarEvent.transportation = vm.transportation;
      vm.calendarEvent.residentId = vm.selectedItem.value;
      vm.calendarEvent.date = vm.date;

      vm.calendarEvent.cancel = vm.isCancel;

      var parseDate = new Date(vm.calendarEvent.date);

      //converting date to am/pm format
      if (vm.dayTimeSwitch === false || vm.dayTimeSwitch === "PM") {
        parseDate.setUTCHours(parseInt(vm.calendarEvent.hours) + 12);
      } else {
        parseDate.setUTCHours(parseInt(vm.calendarEvent.hours));
      }

      parseDate.setMinutes(vm.calendarEvent.minutes);

      setTime();

      //this is sent to db as the appointments date/time
      vm.calendarEvent.time = parseDate;

      vm.isDisabled = true;

      // Update
      if (vm.dialogData.calendarEvent) {

        vm.calendarEvent.appointmentDate = vm.date;
        vm.calendarEvent.appointmentDate.setHours(0,0,0,0);

        vm.calendarEvent.timezone = vm.date.getTimezoneOffset() / 60;

        //update info
        vm.calendarEvent.modifiedBy = authentication.currentUser().id;
        vm.calendarEvent.modifiedDate = new Date();

        var changedFields = checkChangedFields(vm.dialogData.calendarEvent, vm.calendarEvent);

        if(changedFields.length > 0) {
          vm.calendarEvent.updateField = changedFields;
        }

        var srcEvents = [];

        if(vm.calendarEvent.source != undefined) {
          srcEvents = vm.calendarEvent.source.events;
          vm.calendarEvent.source.events.length = 0;
        }

        vm.calendarEvent.date = vm.calendarEvent.time;


        apilaData.updateAppointment(vm.calendarEvent.appointId, vm.calendarEvent)
          .success(function(appoint) {

            var calId = vm.dialogData.calendarEvent._id;

            vm.calendarEvent = appoint;
            vm.calendarEvent.source = srcEvents;
            vm.calendarEvent.residentGoing = appoint.residentGoing;
            vm.calendarEvent.appointId = appoint._id;
            vm.calendarEvent.title = appoint.reason;
            vm.calendarEvent.calId = calId;
            vm.calendarEvent.currentUser = appoint.residentGoing;

            var response = {
              type: vm.dialogData.type,
              calendarEvent: vm.calendarEvent
            };

            $mdDialog.hide(response);

          })
          .error(function(appoint) {
            $mdDialog.hide();
            $log.debug("Something went wrong while updating the appointments");
          });

      } else { // Add


       vm.calendarEvent.date = vm.calendarEvent.time;
       vm.calendarEvent.community = vm.community;

       vm.calendarEvent.appointmentDate = vm.date;
       vm.calendarEvent.appointmentDate.setHours(0,0,0,0);

       vm.calendarEvent.timezone = vm.date.getTimezoneOffset() / 60;


        apilaData.addAppointment(vm.calendarEvent)
          .success(function(appoint) {

            vm.calendarEvent = appoint;
            vm.calendarEvent.appointId = appoint._id;
            vm.calendarEvent.title = appoint.reason;
            var response = {
              type: vm.dialogData.type,
              calendarEvent: vm.calendarEvent
            };

            $mdDialog.hide(response);


          })
          .error(function(appoint) {

            if(appoint.error_list) {
              showToast("Appointment is created but there was an error showing it");
              $window.location.reload();
            }

            $mdDialog.hide();
            $log.debug(appoint);
          });
      }

  }



    //checks what fields changed in the updates
    function checkChangedFields(oldData, newData) {
              var d1 = new Date(oldData.date);
              var d2 = newData.date;

              var diff = [];
              var attributeArr = [
                  "reason",
                  "locationName",
                  "locationDoctor",
                  "transportation",
              ];

              for (var i = 0; i < attributeArr.length; ++i) {

                  if (oldData[attributeArr[i]] !== newData[attributeArr[i]]) {

                      diff.push({
                          "field": attributeArr[i],
                          "old": oldData[attributeArr[i]],
                          "new": newData[attributeArr[i]]
                      });
                  }
              }

              if(d1.getTime() !== d2.getTime()) {
                diff.push({
                  "field": "time",
                  "old": d1,
                  "new": d2
                });
              }

              return diff;
          }


    function submitComment() {
      apilaData.addAppointmentCommentById(vm.calendarEvent.appointId, vm.formData)
          .success(function(data) {

            data.author = {
              _id : userid,
              name : authentication.currentUser().name
            };

            vm.calendarEvent.appointmentComment.push(data);
            vm.dialogData.calendarEvent.appointmentComment.push(data);
            vm.formData.commentText = "";
          })
          .error(function(data) {
              $log.debug("Error while adding comments");
          });
    }


    function exportAppointment() {
      var name = vm.calendarEvent.residentGoing.firstName + " to " +
               (vm.calendarEvent.locationName.name || vm.calendarEvent.locationName);

      exportAppointDetail.exportPdf(name, vm.calendarEvent);
    }

    function closeDialog() {
      $mdDialog.cancel();
    }


    function setTime() {
      var hours = vm.currentTime.getHours();
      var minutes = vm.currentTime.getMinutes();
      var isAm = true;

      if(hours >= 12) {
        hours -= 12;
        isAm = false;
      }

      vm.calendarEvent.hours = hours;
      vm.calendarEvent.minutes = minutes;
      vm.calendarEvent.isAm = isAm;
    }

    function checkFields() {
      var error = false;

      if(errorCheck.requiredFields(vm.calendarEvent, vm.error, requiredArray)) {
        error = true;
      }

      if(!vm.date) {
        vm.error.date = true;
        error = true;
      } else {
        vm.error.date = false;
      }

      if(!vm.currentTime) {
        vm.error.currentTime = true;
        error = true;
      } else {
        vm.error.currentTime = false;
      }

      if(!vm.selectedItem) {
        vm.error.selectedItem = true;
        error = true;
      } else {
        vm.error.selectedItem = false;
      }

      return error;
    }

    function inUpdate()
    {
      if (!vm.dialogData.calendarEvent){
        return false;
      }
      else {
        return true;
      }
    }

    function showToast(msg) {
      $mdToast.show(
        $mdToast.simple()
        .textContent(msg)
        .position("top right")
        .hideDelay(2000)
      );
    }


    function utcToLocalDate(date)
    {
      return new Date(date.getTime() + date.getTimezoneOffset()*60*1000);
    }
  }
})();
