(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .service('LabelsService', LabelsService);

    /** @ngInject */
    function LabelsService(apilaData, msUtils, authentication, UpdateInfoService) {

      var vm = null;

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

          label.updateInfo = UpdateInfoService.setUpdateInfo('labels', label.name, "");

          //send data to the api
          apilaData.addIssueLabelById(vm.card._id, label)
          .success(function(data) {
            data.id = data._id;
            vm.board.labels.push(data);
            vm.card.updateInfo.push(transformUpdateInfo(label.updateInfo));

            vm.newLabelName = '';

          })
          .error(function(data) {
            console.log("Error while adding label");
          });

      }

      function removeLabel(id)
      {
          var arr = vm.board.labels;
          arr.splice(arr.indexOf(arr.getById(vm.editLabelId)), 1);

          var updateInfo = UpdateInfoService.setUpdateInfo('labels', "", id.name);

          apilaData.deleteIssueLabelById(vm.card._id, id._id)
          .success(function(d) {

            vm.card.updateInfo.push(transformUpdateInfo(updateInfo));

            angular.forEach(vm.board.cards, function (card)
            {
                if ( card.idLabels && card.idLabels.indexOf(vm.editLabelId) > -1 )
                {
                    card.idLabels.splice(card.idLabels.indexOf(vm.editLabelId), 1);
                }
            });

          })
          .error(function(response) {
            console.log(response);
          });

          vm.newLabelName = '';
      }

      function editLabel(id) {
        vm.labelTabIndex = 2;
        vm.editLabelId = id;
      }

      function removeLabelFromCard(id) {

        var index = null;
        for(var i = 0; i < vm.card.labels.length; ++i) {
          if(vm.card.labels[i].id === id) {
            index = i;
            break;
          }
        }

        if(index != null) {
          vm.card.labels.splice(index, 1);
        }

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
        removeLabelFromCard : removeLabelFromCard,
        labelQuerySearch : labelQuerySearch,
        filterLabel : filterLabel,
        setViewModel : setViewModel
      };

    }

})();
