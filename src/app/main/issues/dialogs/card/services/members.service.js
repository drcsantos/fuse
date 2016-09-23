(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .service('MembersService', MembersService);

    /** @ngInject */
    function MembersService(apilaData, msUtils, authentication, UpdateInfoService) {

      var vm = null;

      function setViewModel(viewModel) {
        vm = viewModel;
      }

      function memberQuerySearch(query)
      {
          return query ? vm.members.filter(createFilterFor(query)) : [];
      }

      /////////////////// HELPER FUNCTIONS /////////////////////////

      function transformUpdateInfo(updateInfo) {
        updateInfo.updateBy = {
          'name' : authentication.currentUser().name,
          'userImage' : authentication.getUserImage()
        };

        return updateInfo;
      }

      function createFilterFor(query)
      {
          var lowercaseQuery = angular.lowercase(query);
          return function filterFn(item)
          {
              return angular.lowercase(item.name).indexOf(lowercaseQuery) >= 0;
          };
      }

      function filterMember(member)
      {
          if ( !vm.memberSearchText || vm.memberSearchText === '' )
          {
              return true;
          }

          return angular.lowercase(member.name).indexOf(angular.lowercase(vm.memberSearchText)) >= 0;
      }

      return {
        setViewModel : setViewModel,
        memberQuerySearch : memberQuerySearch,
        filterMember : filterMember
      };
    }

})();
