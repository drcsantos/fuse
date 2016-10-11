(function ()
{
    'use strict';

    angular
        .module('app.todo')
        .controller('TaskDialogController', TaskDialogController);

    /** @ngInject */
    function TaskDialogController($mdDialog, Task, Tasks, event, $mdToast, authentication, apilaData)
    {
        var vm = this;

        // Data
        vm.title = 'Edit Task';
        vm.task = angular.copy(Task);
        vm.newTask = false;
        vm.tasks = Tasks;

        vm.canSubmit = false;

        vm.test = 10;

        vm.slider = {
          minValue: 8,
          maxValue: 4,
          options: {
            showTicksValues: true,
            stepsArray: [
              {legend: '8 am', value: 8},
              {legend: '9 am', value: 9},
              {legend: '10 am', value: 10},
              {legend: '11 am', value: 11},
              {legend: '12 am', value: 12},
              {legend: '1 pm', value: 1},
              {legend: '2 pm', value: 2},
              {legend: '3 pm', value: 3},
              {legend: '4 pm', value: 4}
            ],
            translate: function(value) {
              return "";
            }
          }
        };

        vm.todoid = authentication.currentUser().todoid;

        if ( !vm.task ) {
            vm.title = 'New Task';
            vm.newTask = true;
            vm.form = {
              "text" : "",
              "occurrence" : 2,
              "activeDays" : []
            };

            // Monday - Friday selected by default
            for(var i = 0; i < 5; ++i) {
              vm.form.activeDays[i] = true;
            }

        } else {
          vm.newTask = false;
          vm.form = vm.task;

          vm.slider.minValue = vm.form.hourStart;
          vm.slider.maxValue = vm.form.hourEnd;
        }

        // Methods
        vm.addNewTask = addNewTask;
        vm.updateTask = updateTask;
        vm.closeDialog = closeDialog;
        vm.cancelDialog = cancelDialog;

        //////////

        function addNewTask()
        {

          vm.form.hourStart = vm.slider.minValue;
          vm.form.hourEnd = vm.slider.maxValue;

          console.log(vm.form.hourStart + " " + vm.form.hourEnd);

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
