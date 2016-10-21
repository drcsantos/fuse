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

        vm.test = 10;

        function convertToPm(value) {
          var americanTime = "";

          americanTime = (value < 12) ? value + " am" :  (value - 12) + ' pm';

          americanTime = (value === 0) ? "12 am" :  americanTime;
          americanTime = (value === 12) ? "12 pm" :  americanTime;

          return americanTime;
        }

        vm.todoid = authentication.currentUser().todoid;

        if ( !vm.task ) {
            vm.title = 'New Task';
            vm.newTask = true;
            vm.form = {
              "text" : "",
              "occurrence" : 2,
              "activeDays" : [],
              "activeMonths" : [false, false, false, false, false, false, false, false, false, false, false, false ],
              "activeWeeks": [false, false, false, false, false]
            };

            vm.slider = {
              minValue: 0,
              maxValue: 23,
              options: {
                //pushRange: true,
                noSwitching: true,
                showTicks: true,
                translate: function(value) {
                  return ToDoUtilsService.convertToPm(value);
                }
              }
            };

            // Monday - Friday selected by default
            for(var i = 0; i < 5; ++i) {
              vm.form.activeDays[i] = true;
            }

        } else {
          vm.newTask = false;
          vm.form = vm.task;

          vm.slider = {
            minValue: vm.form.hourStart,
            maxValue: vm.form.hourEnd,
            options: {
              //pushRange: true,
              noSwitching: true,
              showTicks: true,
              translate: function(value) {
                return ToDoUtilsService.convertToPm(value);
              }
            }
          };
        }

        // Methods
        vm.addNewTask = addNewTask;
        vm.updateTask = updateTask;
        vm.closeDialog = closeDialog;
        vm.cancelDialog = cancelDialog;
        vm.selectEveryMonth = selectEveryMonth;
        vm.selectEveryWeek = selectEveryWeek;

        //////////

        function addNewTask()
        {

          vm.form.hourStart = vm.slider.minValue;
          vm.form.hourEnd = vm.slider.maxValue;

            apilaData.addTask(vm.todoid, vm.form)
            .success(function(response) {
              errorMessages();
              vm.tasks.push(response);
              closeDialog();
            })
            .error(function(response) {
              console.log(response);
            });

        }

        function updateTask() {

          vm.form.hourStart = vm.slider.minValue;
          vm.form.hourEnd = vm.slider.maxValue;

          apilaData.updateTask(vm.todoid, vm.task._id,  vm.form)
          .success(function(response) {

            errorMessages();

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

        function errorMessages() {
          var currDay = moment().isoWeekday();
          if(currDay === 6 || currDay === 7) {
            if(vm.form.occurrence > 0 && vm.form.occurrence <= 3) {
                showToast("The task is created but will only be shown Monday - Friday");
            } else if(vm.form.occurrence === 0) {
              showToast("The task is created but will only be shown Monday - Friday from 8am-4pm");
            }
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

        function cancelDialog() {
          $mdDialog.hide(true);
        }

        function closeDialog()
        {
            $mdDialog.hide(false);
        }
    }
})();
