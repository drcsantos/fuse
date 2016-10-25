(function ()
{
    'use strict';

    angular
        .module('app.todo')
        .controller('TaskDialogController', TaskDialogController);

    /** @ngInject */
    function TaskDialogController($mdDialog, Task, Tasks, event, $mdToast, authentication, apilaData, ToDoUtilsService)
    {
        var vm = this;

        // Data
        vm.title = 'Edit Task';
        vm.task = angular.copy(Task);
        vm.newTask = false;
        vm.tasks = Tasks;

        vm.canSubmit = false;

        vm.todoid = authentication.currentUser().todoid;

        if ( !vm.task ) {
            vm.title = 'New Task';
            vm.newTask = true;
            vm.form = {
              "text" : "",
              "occurrence" : 1,
              "activeDays" : [],
              "activeMonths" : [false, false, false, false, false, false, false, false, false, false, false, false ],
              "activeWeeks": [false, false, false, false, false],
              hourStart: 0,
              hourEnd: 23,
            };

            // Monday - Friday selected by default
            for(var i = 0; i < 5; ++i) {
              vm.form.activeDays[i] = true;
            }

        } else {
          vm.newTask = false;
          vm.form = vm.task;
        }

        // Methods
        vm.addNewTask = addNewTask;
        vm.updateTask = updateTask;
        vm.closeDialog = closeDialog;
        vm.cancelDialog = cancelDialog;
        vm.selectEveryMonth = selectEveryMonth;
        vm.selectEveryWeek = selectEveryWeek;

        function addNewTask()
        {
            apilaData.addTask(vm.todoid, vm.form)
            .success(function(task) {
              errorMessages(task, "created");
              vm.tasks.push(task);
              closeDialog();
            })
            .error(function(response) {
              console.log(response);
            });

        }

        function updateTask() {

          apilaData.updateTask(vm.todoid, vm.task._id,  vm.form)
          .success(function(task) {

            errorMessages(task, "updated");

            // Update the correct tasks with new values
            for(var i = 0; i < vm.tasks.length; ++i) {
              if(vm.tasks[i]._id === vm.task._id) {
                vm.tasks[i].text = vm.form.text;
                vm.tasks[i].occurrence = vm.form.occurrence;
                break;
              }
            }

            closeDialog();
          })
          .error(function(response) {
            console.log(response);
          });

        }

        function selectEveryMonth() {
            vm.form.activeMonths = _.map(vm.form.activeMonths, function(elem) {
              return vm.form.everyMonth;
            });
        }

        function selectEveryWeek() {
            vm.form.activeWeeks = _.map(vm.form.activeWeeks, function(elem) {
              return vm.form.everyWeek;
            });
        }

        function errorMessages(task, action) {
          if(!isInActiveCycle(task)) {
            showToast("The task is " + action +" but it's not currently active");
          }
        }

        function showToast(msg) {
          $mdToast.show(
            $mdToast.simple()
            .textContent(msg)
            .position("top right")
            .hideDelay(3000)
          );
        }

        function convertToPm(value) {
          var americanTime = "";

          americanTime = (value < 12) ? value + " am" :  (value - 12) + ' pm';

          americanTime = (value === 0) ? "12 am" :  americanTime;
          americanTime = (value === 12) ? "12 pm" :  americanTime;

          return americanTime;
        }

        function isInActiveCycle(task) {

          var currTime = moment();
          var currHour = currTime.hour();
          var currDay = currTime.isoWeekday();
          var currWeek = weekOfMonth(currTime);
          var currMonth = currTime.month();

          var result = false;

          if(task.occurrence === 0) {
            result = (currHour >= task.hourStart && currHour <= task.hourEnd);
          } else if(task.occurrence === 1) {
            result = task.activeDays[currDay - 1];
          } else if(task.occurrence === 2) {
            result = task.activeWeeks[currWeek - 1];
          } else if(task.occurrence === 3) {
            result = task.activeMonths[currMonth];
          }

          //sometimes an array will be like activeDays will have less items
          if(result === undefined) {
            result = false;
          }

          return result;

        }

        function weekOfMonth(m) {
          return m.week() - moment(m).startOf('month').week() + 1;
        }

        function cancelDialog() {
          $mdDialog.hide(true);
        }

        function closeDialog()
        {
            $mdDialog.hide(false);
        }

        setTimeout(function() {
          vm.slider = {
              options: {
                floor: 0,
                ceil: 23,
                noSwitching: true,
                showTicks: true,
                translate: function(value) {
                  return ToDoUtilsService.convertToPm(value);
                }
              }
            };
        }, 350);
    }
})();
