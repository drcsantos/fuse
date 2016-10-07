(function ()
{
    'use strict';

    angular
        .module('app.todo')
        .controller('TodoController', TodoController);

    /** @ngInject */
    function TodoController($document, $mdDialog, $mdSidenav, authentication, apilaData, ToDoUtilsService)
    {
        var vm = this;

        // Data
        vm.tasks = [];

        vm.completed = [];
        vm.overdue = [];
        vm.notcompleted = [];

        vm.currTasks = [];

        var utils = ToDoUtilsService;

        vm.selectedCategory = "tasks"; //Tasks mean the current undone tasks

        vm.todoid = authentication.currentUser().todoid;

        vm.selectedFilter = {
            filter : 'Start Date',
            dueDate: 'Next 3 days'
        };
        vm.selectedProject = 'creapond';

        // Tasks will be filtered against these models
        vm.taskFilters = {
            search   : '',
            completed: '',
            deleted  : false,
            important: '',
            starred  : '',
            startDate: '',
            dueDate  : ''
        };
        vm.taskFiltersDefaults = angular.copy(vm.taskFilters);
        vm.showAllTasks = true;

        vm.taskOrder = '';
        vm.taskOrderDescending = false;

        vm.sortableOptions = {
            handle        : '.handle',
            forceFallback : true,
            ghostClass    : 'todo-item-placeholder',
            fallbackClass : 'todo-item-ghost',
            fallbackOnBody: true,
            sort          : true
        };
        vm.msScrollOptions = {
            suppressScrollX: true
        };

        // Functions
        vm.preventDefault = preventDefault;
        vm.openTaskDialog = openTaskDialog;
        vm.toggleCompleted = toggleCompleted;
        vm.toggleSidenav = toggleSidenav;
        vm.toggleFilter = toggleFilter;
        vm.toggleFilterWithEmpty = toggleFilterWithEmpty;
        vm.filterByStartDate = filterByStartDate;
        vm.filterByDueDate = filterByDueDate;
        vm.resetFilters = resetFilters;
        vm.setCurrentTasks = setCurrentTasks;
        vm.deleteTask = deleteTask;

        init();

        //////////

        function loadTasks() {
          apilaData.listTasks(vm.todoid)
          .success(function(response) {
            vm.tasks = response;

            vm.completed = [];
            vm.overdue = [];
            vm.notcompleted = [];

            vm.currTasks = [];

            angular.forEach(vm.tasks, function(task) {
              if(task.current) {
                vm.currTasks.push(task);
              }

            });

            angular.forEach(vm.tasks, function(task) {

              //var category = taskCategory(task);

              if(task.completed.length > 0) {
                vm.completed.push(task);
              }

              if(task.overDue.length > 0) {
                vm.overdue.push(task);
              }

              if(task.notCompleted.length > 0) {
                vm.notcompleted.push(task);
              }
            });

          })
          .error(function(response) {
            console.log(response);
          });
        }

        loadTasks();


        function openTaskDialog(ev, task)
        {
            $mdDialog.show({
                controller         : 'TaskDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/todo/dialogs/task/task-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : ev,
                clickOutsideToClose: true,
                locals             : {
                    Task : task,
                    Tasks: vm.tasks,
                    event: ev
                }
            }).then(function() {
              loadTasks();
            });
        }

        function toggleCompleted(task, event)
        {
            event.stopPropagation();

            task.complete = true;

            //remove he task from array by id
            _.remove(vm.currTasks, {"_id" : task._id});

            var found = false;
            for(var i = 0; i < vm.completed.length; ++i) {
              if(vm.completed[i]._id === task._id) {
                vm.completed[i].completed.push({"counter" : 0, updatedOn: new Date()});
                found = true;
                break;
              }
            }

            if(!found) {
              vm.completed.push(task);
            }

            updateTask(task);
        }

        function setCurrentTasks(type) {

          if(type === "completed") {
            vm.currTasks = vm.completed;
            vm.selectedCategory = "completed";
          } else if (type === "overdue") {
            vm.currTasks = vm.overdue;
            vm.selectedCategory = "overdue";
          } else if(type === "notcompleted") {
            vm.currTasks = vm.notcompleted;
            vm.selectedCategory = "notcompleted";
          } else if(type === "tasks"){
            //vm.currTasks = vm.tasks;
            loadTasks();
            vm.selectedCategory = "tasks";
          }

        }

        function deleteTask(task) {
          apilaData.deleteTask(vm.todoid, task._id)
          .success(function(response) {
            loadTasks();
          })
          .error(function(response) {
            console.log(response);
          });
        }
        //////////////////////// HELPER FUNCTINS ////////////////////////

        function updateTask(task) {

          apilaData.updateTask(vm.todoid, task._id,  task)
          .success(function(response) {

            // Update the correct tasks with new values
            for(var i = 0; i < vm.tasks.length; ++i) {
              if(vm.tasks[i]._id === task._id) {
                vm.tasks[i].complete = task.complete;
                vm.tasks[i].completed.push({"counter" : 0, updatedOn: new Date()});
                break;
              }
            }
          })
          .error(function(response) {
            console.log(response);
          });

        }

        // checks if the task is finished for the current interval
        function taskCategory(task) {
          var currTime = moment();

          if(!task.complete) {
            if(task.occurrence === utils.EVERY_DAY) {
              //if it's past 12 pm it's overdue
              if(currTime.hour() >= 12) {
                return 'overdue';
              }
            }
          }

        }

        function isTaskOverdue(task) {

        }

        /////////////////////////// THEME CODE //////////////////////////

        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

        function init()
        {
            angular.forEach(vm.tasks, function (task)
            {
                if ( task.startDate )
                {
                    task.startDate = new Date(task.startDate);
                    task.startDateTimestamp = task.startDate.getTime();
                }

                if ( task.dueDate )
                {
                    task.dueDate = new Date(task.dueDate);
                    task.dueDateTimestamp = task.dueDate.getTime();
                }
            });
        }

        function preventDefault(e)
        {
            e.preventDefault();
            e.stopPropagation();
        }

        ////////////////////////////// FILTERS ///////////////////////////////

        function toggleFilter(filter)
        {
            vm.taskFilters[filter] = !vm.taskFilters[filter];

            checkFilters();
        }


        function toggleFilterWithEmpty(filter)
        {
            if ( vm.taskFilters[filter] === '' )
            {
                vm.taskFilters[filter] = true;
            }
            else
            {
                vm.taskFilters[filter] = '';
            }

            checkFilters();
        }

        function resetFilters()
        {
            vm.showAllTasks = true;
            vm.taskFilters = angular.copy(vm.taskFiltersDefaults);
        }

        function checkFilters()
        {
            vm.showAllTasks = !!angular.equals(vm.taskFiltersDefaults, vm.taskFilters);
        }

        function filterByStartDate(item)
        {
            if ( vm.taskFilters.startDate === true )
            {
                return item.startDate === new Date();
            }

            return true;
        }

        function filterByDueDate(item)
        {
            if ( vm.taskFilters.dueDate === true )
            {
                return !(item.dueDate === null || item.dueDate.length === 0);
            }

            return true;
        }

    }
})();
