(function() {
  'use strict';

  angular
      .module('app.todo')
      .component('historyList', {
        templateUrl: 'app/main/todo/components/historyList/historyList.html',
        controller: function() {
          var vm = this;

          vm.dateFormat = "MMM dd, yyyy";
          //if it's a hourly task
          if(vm.task.occurrence === 0) {
            vm.dateFormat = "MMM dd, yyyy 'at' h:mma";
          }

        },
        bindings: {
          list: '<',
          task: '<',
          listName: '@name'
        }

      });

})();
