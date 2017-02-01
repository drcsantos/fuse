(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .service('ChecklistsService', ChecklistsService);

    /** @ngInject */
    function ChecklistsService(apilaData, $log, msUtils, authentication, UpdateInfoService) {

      var vm = null;

      function setViewModel(viewModel) {
        vm = viewModel;
        //UpdateInfoService.setData(vm.card._id, vm.card.updateInfo);
      }

      function updateCheckedCount(list, checkedItem)
      {
          var checkItems = list.checkItems;
          var checkedItems = 0;
          var allCheckedItems = 0;
          var allCheckItems = 0;

          if(!checkedItem) {
            return;
          }

          angular.forEach(checkItems, function (checkItem)
          {
              if ( checkItem.checked )
              {
                  checkedItems++;
              }
          });

          list.checkItemsChecked = checkedItems;

          angular.forEach(vm.card.checklists, function (item)
          {
              allCheckItems += item.checkItems.length;
              allCheckedItems += item.checkItemsChecked;
          });

          vm.card.checkItems = allCheckItems;
          vm.card.checkItemsChecked = allCheckedItems;

          if(checkedItem.checked) {
            list.updateInfo = UpdateInfoService.setUpdateInfo("checkitem_checked", checkedItem.name, "");
          } else {
            list.updateInfo = UpdateInfoService.setUpdateInfo("checkitem_unchecked", checkedItem.name, "");
          }

          apilaData.updateCheckList(vm.card._id, list._id, list)
          .success(function(d) {
              vm.card.updateInfo.push(transformUpdateInfo(list.updateInfo));
          })
          .error(function(response) {
            $log.debug(response);
          });
      }

      function addCheckItem(text, checkList)
      {
          if ( !text || text === '' )
          {
              return;
          }

          var newCheckItem = {
              'name'   : text,
              'checked': false
          };

          checkList.checkItems.push(newCheckItem);

          //checkList.updateInfo = UpdateInfoService.setUpdateInfo('checkitem', newCheckItem.name, "");

          apilaData.updateCheckList(vm.card._id, checkList._id, checkList)
          .success(function(d) {

              //vm.card.updateInfo.push(transformUpdateInfo(checkList.updateInfo));
              UpdateInfoService.addUpdateInfo('checkitem', newCheckItem.name, "");
              updateCheckedCount(checkList, newCheckItem);
              text = "";

          })
          .error(function() {
            $log.debug("Error while updateing checklist");
          });

      }

      function removeChecklist(item)
      {

         var updateInfo = UpdateInfoService.setUpdateInfo("checklists", "", item.checklistName);

          //send remove request to the api
          apilaData.deleteCheckList(vm.card._id, item._id)
          .success(function(d) {
            vm.card.checklists.splice(vm.card.checklists.indexOf(item), 1);

            vm.card.updateInfo.push(transformUpdateInfo(updateInfo));

            angular.forEach(vm.card.checklists, function (list)
            {
                updateCheckedCount(list);
            });
          })
          .error(function(d){
            $log.debug("Error while removing checklist");
          });

      }

      function createCheckList()
      {

          var data = {
              id               : msUtils.guidGenerator(),
              name             : vm.newCheckListTitle,
              checklistName    : vm.newCheckListTitle,
              checkItemsChecked: 0,
              checkItems       : []
          };

          vm.card.submitBy = vm.card.submitBy._id;

          vm.newCheckListTitle = '';

          apilaData.addCheckList(vm.card._id, data)
          .success(function(d) {
              vm.card.checklists.push(d);
              
              UpdateInfoService.addUpdateInfo('checklists', data.name, "");
              vm.newCheckListTitle = "Checklist";
          })
          .error(function(err) {
            $log.debug(err);
          });
      }

      function removeCheckItem(checklist, i) {
        var checkItemName = checklist.checkItems[i].name;
        checklist.checkItems.splice(i, 1);
        vm.card.updateInfo.push(transformUpdateInfo(UpdateInfoService.setUpdateInfo('checkitem_remove', "" , checkItemName)));

        vm.updateIssue();
      }

      function updateCheckItem(checklist, checkitemId, text) {
        checklist.checkItems[checkitemId] = text;

        vm.card.updateInfo.push(transformUpdateInfo(UpdateInfoService.setUpdateInfo('checkitem_change', "" , text.name)));

        vm.updateIssue();
      }

      //////////////////////// HELPER FUNCTIONS ///////////////////////////////
      function transformUpdateInfo(updateInfo) {
        updateInfo.updateBy = {
          'name' : authentication.currentUser().name,
          'userImage' : authentication.getUserImage()
        };

        return updateInfo;
      }

      return {
        setViewModel : setViewModel,
        updateCheckedCount : updateCheckedCount,
        addCheckItem : addCheckItem,
        removeChecklist : removeChecklist,
        createCheckList : createCheckList,
        removeCheckItem : removeCheckItem,
        updateCheckItem : updateCheckItem
      };

    }

})();
