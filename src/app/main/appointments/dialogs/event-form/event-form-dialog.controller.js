(function() {
  'use strict';

  angular.module('app.appointments')
    .controller('EventFormDialogController', EventFormDialogController);

  /** @ngInject */
  function EventFormDialogController($mdDialog, dialogData, apilaData, authentication, exportAppointDetail) {
    var vm = this;

    // Data
    vm.dialogData = dialogData;

  //  vm.calendarEvent.date = dialogData.start;


    // Methods
    vm.saveEvent = saveEvent;
    vm.closeDialog = closeDialog;
    vm.updateIssue = updateIssue;
    vm.exportAppointment = exportAppointment;
    vm.inUpdate = inUpdate;
    vm.submitComment = submitComment;
    vm.getMatches = getMatches;

    init();

    apilaData.userCommunity(authentication.currentUser().name)
      .success(function(d) {
        vm.community = d;
        residentsList(vm.community._id);
      });

    //////////

    //This will only be set when the add part is active
    vm.dayTimeSwitch = "AM";
    vm.showCancel = false;

    //If we are in the add dialog
    if (!inUpdate()) {
          vm.transportation = "We are transporting";
          vm.showCancel = true;
          vm.currentTime =  new Date();
      }

    function getMatches(text) {
       if(text === null) {
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


    vm.residentList = [];
    vm.selectedUser = {};

    function residentsList(id){
      apilaData.residentsList(id)
        .success(function(residentList) {
          //console.log(residentList);
          vm.residentList = residentList.map(function(elem) {
            return {value: elem._id, display: elem.firstName + " " + elem.lastName};
          });
        })
        .error(function(residentList) {
          console.log("Error retriving the list of residents");
        });

    }


      //if we are in the update model set fields value
      if (vm.dialogData.calendarEvent) {

        vm.dayTimeSwitch = vm.calendarEvent.isAm;

        console.log(vm.calendarEvent);

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

        var fullName = vm.calendarEvent.currentUser.firstName + " " +
                       vm.calendarEvent.currentUser.lastName;

        vm.selectedItem = {value: vm.calendarEvent.currentUser._id,
                           display: fullName
                             };

        vm.selectedUser = vm.calendarEvent.currentUser;

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

        console.log(vm.calendarEvent);

        vm.calendarEvent.reason = vm.calendarEvent.reason;
        vm.isCancel = vm.calendarEvent.cancel;

        console.log(vm.calendarEvent.date);

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
          console.log(vm.date);
        }


      }
    }

    function saveEvent() {

      //set up the date to proper fields before sending to the api
      vm.calendarEvent.transportation = vm.transportation;
      vm.calendarEvent.residentId = vm.selectedItem.value;
      console.log(vm.selectedItem.display);
      vm.calendarEvent.date = vm.date;

      vm.calendarEvent.cancel = vm.isCancel;

      var parseDate = new Date(vm.calendarEvent.date);

      //setting timeSwith stuff
      // if (vm.dayTimeSwitch === false || vm.dayTimeSwitch === "PM") {
      //   vm.calendarEvent.isAm = false;
      // } else {
      //   vm.calendarEvent.isAm = true;
      // }

      //converting date to am/pm format
      if (vm.dayTimeSwitch === false || vm.dayTimeSwitch === "PM") {
        parseDate.setUTCHours(parseInt(vm.calendarEvent.hours) + 12);
      } else {
        parseDate.setUTCHours(parseInt(vm.calendarEvent.hours));
      }

      parseDate.setMinutes(vm.calendarEvent.minutes);

      setTime();


      console.log("The current date is:" + parseDate);

      //this is sent to db as the appointments date/time
      vm.calendarEvent.time = parseDate;

      // Update
      if (vm.dialogData.calendarEvent) {

        vm.calendarEvent.appointmentDate = vm.date;
        vm.calendarEvent.timezone = vm.date.getTimezoneOffset() / 60;

        //update info
        vm.calendarEvent.modifiedBy = authentication.currentUser().name;
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

            console.log(appoint);
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
            console.log("Something went wrong while updating the appointments");
          });

      } else { // Add

        console.log("Time added " + vm.calendarEvent.time);

       vm.calendarEvent.date = vm.calendarEvent.time;
       vm.calendarEvent.community = vm.community;

       vm.calendarEvent.appointmentDate = vm.date;
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
            console.log("Something went wrong with the appointment, try again");
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

          // var tmpText = '';
          // for(var i = 0; i < vm.formData.commentText.length;++i) {
          //   if(i % 40 == 0) {
          //     tmpText += '\n';
          //   }
          //   tmpText += vm.formData.commentText[i];
          // }
          //
          // console.log(tmpText);
          //
          // vm.formData.commentText = tmpText;

            apilaData.addAppointmentCommentById(vm.calendarEvent.appointId, vm.formData)
                .success(function(data) {
                    console.log("Comment has been aded");
                    vm.calendarEvent.appointmentComment.push(data);
                      vm.dialogData.calendarEvent.appointmentComment.push(data);
                    vm.formData.commentText = "";
                })
                .error(function(data) {
                    console.log("Error while adding comments");
                });
          }


    function exportAppointment() {
      var name = vm.calendarEvent.residentGoing.firstName + " to " + vm.calendarEvent.locationName;
      //exportPdf.exportAppointmentDetail(name, vm.calendarEvent);
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

    function inUpdate()
    {
      if (!vm.dialogData.calendarEvent){
        return false;
      }
      else {
        return true;
      }
    }


    function utcToLocalDate(date)
    {
      return new Date(date.getTime() + date.getTimezoneOffset()*60*1000);
    }
  }
})();
