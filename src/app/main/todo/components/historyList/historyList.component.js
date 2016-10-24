(function() {
  'use strict';

  angular
      .module('app.todo')
      .component('historyList', {
        templateUrl: 'app/main/todo/components/historyList/historyList.html',
        controller: function() {
          var vm = this;

          console.log(vm);

        },
        bindings: {
          list: '<',
          listName: '@name'
        }

      });

})();
