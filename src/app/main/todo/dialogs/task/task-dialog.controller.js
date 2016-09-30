(function ()
{
    'use strict';

    angular
        .module('app.todo')
        .controller('TaskDialogController', TaskDialogController);

    /** @ngInject */
    function TaskDialogController($mdDialog, Task, Tasks, event, authentication, apilaData)
    {
        var vm = this;

        // Data
        vm.title = 'Edit Task';
        vm.task = angular.copy(Task);
        vm.newTask = false;
        vm.tasks = Tasks;

        vm.todoid = authentication.currentUser().todoid;

        if ( !vm.task ) {
            vm.title = 'New Task';
            vm.newTask = true;
        } else {
          vm.newTask = false;
          vm.form = vm.task;
        }

        // Methods
        vm.addNewTask = addNewTask;
        vm.updateTask = updateTask;
        vm.closeDialog = closeDialog;

        //////////

        function addNewTask()
        {
            apilaData.addTask(vm.todoid, vm.form)
            .success(function(response) {
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


        function closeDialog()
        {
            $mdDialog.hide();
        }
    }
})();
