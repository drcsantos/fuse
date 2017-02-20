(function() {
  'use strict';

  angular.
    module('app.quick-panel')
    .component('activityBox', {
      templateUrl: 'app/quick-panel/components/activityBox/activityBox.html',
      bindings: {
        'activity': '<'
      },
      controller: activityBoxController
    });

    angular.
      module('app.quick-panel').controller('activityBoxController', activityBoxController);

    function activityBoxController() {
      var vm = this;

      vm.timeAgo = function(date) {
        return moment(date).fromNow();
      }

      if(!vm.activity.userId.userImage) {
        vm.activity.userId.userImage = "assets/images/avatars/userDefaultProfile.png";
      }
    }

})();
