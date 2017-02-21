(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .service('ChecklistsService', ChecklistsService);

    /** @ngInject */
    function ChecklistsService(apilaData, $log, msUtils, authentication, UpdateInfoService, $mdToast, UndoService) {

      var vm = null;

      function setViewModel(viewModel) {
        vm = viewModel;
        //UpdateInfoService.setData(vm.card._id, vm.card.updateInfo);
      }

      function updateCheckedCount(list, checkedItem, type)
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

          apilaData.updateCheckList(vm.card._id, list._id, list)
          .success(function(d) {

            if(type !== 'add') {
              if(checkedItem.checked) {
                UpdateInfoService.addUpdateInfo(checkedItem.name, "checkitem_checked", list.checklistName, "");
              } else {
                UpdateInfoService.addUpdateInfo(checkedItem.name, "checkitem_unchecked", list.checklistName, "");
              }
            }

          })
          .error(function(response) {
            $log.debug(response);
          });
      }


      function updateCheckListName(list, oldLists) {


        var currList = _.find(oldLists, {_id: list._id});

        apilaData.updateCheckList(vm.card._id, list._id, list)
        .success(function(d) {
          UpdateInfoService.addUpdateInfo('', "checklist_name", list.checklistName, currList.checklistName);
        })
        .error(function(response) {
          $log.debug(response);
        });
      }

      function restoreCheckItem() {
        var checklistOfItem = UndoService.getItem('checkitem');

        if(checklistOfItem) {

          var cardIndex = _.findIndex(vm.card.checklists, {_id: checklistOfItem._id});

          vm.card.checklists[cardIndex] = checklistOfItem;

          apilaData.updateCheckList(vm.card._id, checklistOfItem._id, checklistOfItem)
          .success(function(d) {

          });
        }
      }

      function addCheckItem(text, checkList)
      {
          if ( !text || text === '' ) { return; }

          var newCheckItem = {
              'name'   : text,
              'checked': false
          };

          checkList.checkItems.push(newCheckItem);

          apilaData.updateCheckList(vm.card._id, checkList._id, checkList)
          .success(function(d) {

              UpdateInfoService.addUpdateInfo(newCheckItem.name, 'checkitem', checkList.checklistName, "");
              updateCheckedCount(checkList, newCheckItem, 'add');
              text = "";
              vm.oldData.checklists = d;

          })
          .error(function() {
            $log.debug("Error while updateing checklist");
          });

      }


      function removeChecklist(item)
      {
        //send remove request to the api
        apilaData.deleteCheckList(vm.card._id, item._id)
        .success(function(d) {
          vm.card.checklists.splice(vm.card.checklists.indexOf(item), 1);

          UpdateInfoService.addUpdateInfo('', "checklists", "", item.checklistName);

          angular.forEach(vm.card.checklists, function (list)
          {
              updateCheckedCount(list);
          });

          UndoService.setItem(item, 'checklist');
          UndoService.showActionToast('checklist', function(){ createCheckList('restore'); });
        })
        .error(function(d){
          $log.debug("Error while removing checklist");
        });

      }

      function createCheckList(type)
      {

          var data = {
              id               : msUtils.guidGenerator(),
              name             : vm.newCheckListTitle,
              checklistName    : vm.newCheckListTitle,
              checkItemsChecked: 0,
              checkItems       : []
          };

          vm.newCheckListTitle = '';

          if(type === 'restore') {
            data = UndoService.getItem('checklist');
          }

          apilaData.addCheckList(vm.card._id, data)
          .success(function(d) {
              vm.card.checklists.push(d);

              if(type !== 'restore') {
                UpdateInfoService.addUpdateInfo('', 'checklists', data.name, "");
              }
              vm.newCheckListTitle = "Checklist";
          })
          .error(function(err) {
            $log.debug(err);
          });
      }

      function removeCheckItem(checklist, i) {
        var checkItemName = checklist.checkItems[i].name;
        var copyChecklist = angular.copy(checklist);

        checklist.checkItems.splice(i, 1);

        apilaData.updateCheckList(vm.card._id, checklist._id, checklist)
        .success(function(d) {

          UpdateInfoService.addUpdateInfo(checkItemName, 'checkitem_remove', "" , checklist.checklistName);

          UndoService.setItem(copyChecklist, 'checkitem');
          UndoService.showActionToast('checkitem', function(){ restoreCheckItem(); });

        })
        .error(function() {
          $log.debug("Error while updateing checklist");
        });



      }

      function updateCheckItem(checklist, checkitemId, text) {
        checklist.checkItems[checkitemId] = text;

        var oldChecklist = _.find(vm.oldData.checklists, {_id: checklist._id});
        var oldName = "";

        if(oldChecklist) {
          oldName = oldChecklist.checkItems[checkitemId].name;
        }

        UpdateInfoService.addUpdateInfo('', 'checkitem_change', checklist.checkItems[checkitemId].name , oldName , function(resp) {
          if(resp) {
            apilaData.updateCheckList(vm.card._id, checklist._id, checklist);
          }
        });

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
        updateCheckListName : updateCheckListName,
        addCheckItem : addCheckItem,
        removeChecklist : removeChecklist,
        createCheckList : createCheckList,
        removeCheckItem : removeCheckItem,
        updateCheckItem : updateCheckItem
      };

    }

})();
