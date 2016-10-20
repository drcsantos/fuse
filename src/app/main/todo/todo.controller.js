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
        vm.allTasks = [];

        vm.completed = [];
        vm.overDue = [];
        vm.notCompleted = [];

        vm.currTasks = [];

        var utils = ToDoUtilsService;

        vm.selectedCategory = "tasks"; //Tasks mean the current undone tasks

        vm.todoid = authentication.currentUser().todoid;

        vm.selectedFilter = {
            filter : 'Start Date',
            dueDate: 'Next 3 days'
        };

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

        vm.items = [];
        for (var i = 0; i < 1000; i++) {
          vm.items.push(i);
        }

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
        vm.showActiveDays = showActiveDays;
        vm.showActiveMonths = showActiveMonths;
        vm.showActiveWeeks = showActiveWeeks;
        vm.toggleHistory = toggleHistory;

        init();

        //////////

        function loadTasks() {
          apilaData.listTasks(vm.todoid)
          .success(function(response) {
            vm.tasks = response;

            vm.completed = [];
            vm.overDue = [];
            vm.notCompleted = [];

            vm.currTasks = [];

            vm.allTasks = response;
            console.log(vm.tasks);

            angular.forEach(vm.tasks, function(task) {
              if(task.state === "current") {
                vm.currTasks.push(task);
              }

            });

            angular.forEach(vm.tasks, function(task) {

              if(task.completed.length > 0) {
                vm.completed.push(task);
              }

              if(task.overDue.length > 0) {
                vm.overDue.push(task);
              }

              if(task.notCompleted.length > 0) {
                vm.notCompleted.push(task);
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
            }).then(function(error) {
              if(!error) {
                loadTasks();
              }
            });
        }

        function toggleCompleted(task, event)
        {
            event.stopPropagation();

            task.state = "complete";

            //remove the task from array by id
            _.remove(vm.currTasks, {"_id" : task._id});

            // var found = false;
            // for(var i = 0; i < vm.completed.length; ++i) {
            //   if(vm.completed[i]._id === task._id) {
            //     vm.completed[i].completed.push({"counter" : 0, updatedOn: new Date()});
            //     found = true;
            //     break;
            //   }
            // }
            //
            // if(!found) {
            //   vm.completed.push(task);
            // }

            updateTask(task);
        }

        function setCurrentTasks(type) {

          if(type === "completed") {
            vm.currTasks = vm.completed;
            vm.selectedCategory = "completed";
          } else if (type === "overdue") {
            vm.currTasks = vm.overDue;
            vm.selectedCategory = "overdue";
          } else if(type === "notcompleted") {
            vm.currTasks = vm.notCompleted;
            vm.selectedCategory = "notcompleted";
          } else if(type === "tasks"){
            //vm.currTasks = vm.tasks;
            loadTasks();
            vm.selectedCategory = "tasks";
          } else if(type === "all-tasks") {
            vm.selectedCategory = "all-tasks";
            vm.currTasks = vm.allTasks;
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

        function showActiveDays(task) {
          var daysDesc = "";
          var days = task.activeDays;
          var count = 0;

          var dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

          if(task.occurrence === utils.HOURLY) {
            daysDesc += " (" +   ToDoUtilsService.convertToPm(task.hourStart ) +
            " - " + ToDoUtilsService.convertToPm(task.hourEnd ) + " ) ";
          }

          daysDesc += " (";

          // if standard Monday - Friday work week is selected
          if(days[0] === true && days[1] === true && days[2] === true && days[3] === true && days[4] === true)
          {
            if(!days[5] && !days[6]) {
              return daysDesc + " Mon - Fri ) ";
            }
          }

          // check each day
          for(var i = 0; i < days.length; ++i) {
            if(days[i] === true) {
              daysDesc += " " + dayNames[i] + ",";
              count++;
            }
          }

          // if every day is selected
          if(count === 7) {
            return "( All week )";
          }

          // remove the last ,
          if(daysDesc[daysDesc.length-1] === ',') {
            daysDesc = daysDesc.slice(0, -1);
          }


          return daysDesc + " ) ";

        }

        function showActiveWeeks(task) {
          var weeksFormated = "( ";
          var weeks = task.activeWeeks;

          var weekNames = ["First", "Second", "Third", "Fourth", "Last"];

          if(task.everyWeek === true) {
            return "( Every Week )";
          }

          // check each day
          for(var i = 0; i < weeks.length; ++i) {
            if(weeks[i] === true) {
              weeksFormated += " " + weekNames[i] + ",";
            }
          }

          weeksFormated = removeLastComma(weeksFormated);

          weeksFormated += " Week of Each Month";

          return weeksFormated + " )";
        }

        function showActiveMonths(task) {
          var monthsFormated = "(";
          var months = task.activeMonths;
          var count = 0;

          var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

          // check each day
          for(var i = 0; i < months.length; ++i) {
            if(months[i] === true) {
              monthsFormated += " " + monthNames[i] + ",";
              count++;
            }
          }

          // if every day is selected
          if(count === 12) {
            return "( Every Month )";
          }

          // remove the last ,
          monthsFormated = removeLastComma(monthsFormated);

          return monthsFormated + ' )';
        }

        function toggleHistory(event, task) {
          event.stopPropagation();

          task.showHistory = !task.showHistory;
        }

        //////////////////////// HELPER FUNCTINS ////////////////////////

        //removes a comma if that is the last char in a string
        function removeLastComma(str) {
          if(str[str.length-1] === ',') {
            return str.slice(0, -1);
          } else {
            return str;
          }
        }

        function updateTask(task) {

          apilaData.updateTask(vm.todoid, task._id,  task)
          .success(function(response) {

            console.log(response);

            //Update the correct tasks with new values
            for(var i = 0; i < vm.tasks.length; ++i) {
              if(vm.tasks[i]._id === task._id) {
                if(vm.tasks[i].completed.length !== response.completed.length) {
                  vm.completed.push(response);
                }

                if(vm.tasks[i].overDue.length !== response.overDue.length) {
                  vm.overDue.push(task);
                }
                break;
              }
            }
          })
          .error(function(response) {
            console.log(response);
          });

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
