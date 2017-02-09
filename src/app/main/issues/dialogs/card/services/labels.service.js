(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .service('LabelsService', LabelsService);

    /** @ngInject */
    function LabelsService(apilaData, $window, msUtils, $log, authentication, UpdateInfoService) {

      var vm = null;

      var communityId = authentication.currentUser().communityId;

      function setViewModel(viewModel) {
        vm = viewModel;
      }

      function addNewLabel()
      {

          var label = {
              id   : msUtils.guidGenerator(),
              name : vm.newLabelName,
              color: vm.newLabelColor,
              author: authentication.currentUser().name
          };

          //send data to the api
          apilaData.createLabel(communityId, label)
          .success(function(data) {
            data.id = data._id;
            vm.board.labels.push(data);

            vm.newLabelName = '';

          })
          .error(function(err) {
            $log.debug(err);
          });

      }

      function removeLabel(id)
      {

          apilaData.deleteLabel(communityId, id.name)
          .success(function(d) {

            angular.forEach(vm.board.cards, function (card)
            {
                if ( card.idLabels && card.idLabels.indexOf(vm.editLabelId) > -1 )
                {
                    card.idLabels.splice(card.idLabels.indexOf(vm.editLabelId), 1);
                }
            });

            $window.location.reload();

          })
          .error(function(response) {
            $log.debug(response);
          });

          vm.newLabelName = '';
      }

      function editLabel(label) {

        vm.labelTabIndex = 2;
        vm.editLabel = label;
        vm.editLabel.newName = label.name;

      }


      function labelQuerySearch(query)
      {
          return query ? vm.labels.filter(createFilterFor(query)) : [];
      }


      function filterLabel(label)
      {
          if ( !vm.labelSearchText || vm.labelSearchText === '' )
          {
              return true;
          }

          return angular.lowercase(label.name).indexOf(angular.lowercase(vm.labelSearchText)) >= 0;
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

      return {
        addNewLabel : addNewLabel,
        removeLabel : removeLabel,
        editLabel : editLabel,
        labelQuerySearch : labelQuerySearch,
        filterLabel : filterLabel,
        setViewModel : setViewModel
      };

    }

})();
