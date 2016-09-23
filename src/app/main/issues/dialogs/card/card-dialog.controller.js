(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .controller('ScrumboardCardDialogController', ScrumboardCardDialogController);

    /** @ngInject */
    function ScrumboardCardDialogController($document, $mdDialog, fuseTheming, $scope, $timeout, exportIssueDetail,
      fuseGenerator, msUtils, BoardService, cardId, apilaData, authentication, msNavigationService, ImageUploadService, UpdateInfoService)
    {
        var vm = this;

        // Data
        vm.board = BoardService.data.data;
        vm.card = vm.board.cards.getById(cardId);

        vm.card.currdue = vm.card.due;

        vm.card.labels.map(function(d){d.id = d._id; return d;});
        vm.board.labels.map(function(d){d.id = d._id; return d;});

        vm.newLabelColor = 'red';
        vm.members = vm.board.members;
        vm.UpdateInfoService = UpdateInfoService;

        vm.labels = vm.board.labels;

        var unchangedDueDate = angular.copy(vm.card.due);
        var oldData = angular.copy(vm.card);

        vm.createdIssue = vm.card.submitBy + " created " + vm.card.title + " " +
                           UpdateInfoService.timeDiff(vm.card.submitDate);

        vm.newCheckListTitle = "Checklist";

        vm.username = authentication.currentUser().name;
        var userid = authentication.currentUser().id;

        vm.now = new Date();

        // Functions
        vm.palettes = fuseTheming.getRegisteredPalettes();
        vm.rgba = fuseGenerator.rgba;
        vm.toggleInArray = msUtils.toggleInArray;
        vm.exists = msUtils.exists;
        vm.existsMembers = msUtils.exists;

        vm.removeAttachment = removeAttachment;

        // Labels
        vm.labelQuerySearch = labelQuerySearch;
        vm.filterLabel = filterLabel;
        vm.addNewLabel = addNewLabel;
        vm.removeLabel = removeLabel;
        vm.removeLabelFromCard = removeLabelFromCard;
        vm.editLabel = editLabel;
        vm.addLabelToCard = addLabelToCard;
        vm.isLabelInCard = isLabelInCard;

        // Members
        vm.memberQuerySearch = memberQuerySearch;
        vm.filterMember = filterMember;
        vm.addMembers = addMembers;

        // Checklist
        vm.updateCheckedCount = updateCheckedCount;
        vm.addCheckItem = addCheckItem;
        vm.removeChecklist = removeChecklist;
        vm.createCheckList = createCheckList;
        vm.removeCheckItem = removeCheckItem;
        vm.updateCheckItem = updateCheckItem;

        vm.addNewComment = addNewComment;
        vm.updateIssue = updateIssue;

        // Main field update
        vm.updateTextFields = updateTextFields;
        vm.removeDueDate = removeDueDate;
        vm.memberUpdate = memberUpdate;
        vm.updateLabel = updateLabel;
        vm.selectedItemChange = selectedItemChange;

        //Other
        vm.wordCloud = wordCloud;
        vm.closeDialog = closeDialog;
        vm.getCardList = getCardList;
        vm.removeCard = removeCard;
        vm.openImage = openImage;
        vm.changeStatus = changeStatus;
        vm.exportIssue = exportIssue;

        vm.formatUpdateArray = UpdateInfoService.formatUpdateArray;

        vm.uploadFiles = function(file, invalidFiles, card) {
          ImageUploadService.uploadFiles(file, invalidFiles, card, UpdateInfoService.setUpdateInfo);
        };

        // Load comments
        apilaData.issueCommentsList(vm.card._id)
        .success(function(response) {
          vm.card.comments = response;
        })
        .error(function(response) {
          console.log(response);
        });

        // Load updateInfo
        apilaData.issueUpdateInfo(vm.card._id)
        .success(function(response) {
          vm.card.updateInfo = response;
        })
        .error(function(response) {
          console.log(response);
        });

        apilaData.userCommunity(userid)
        .success(function(d) {

          vm.myCommunity = d;

          setUserRole();

          //load member list
          apilaData.usersInCommunity(d._id)
          .success(function(d) {
            vm.members = d;
          })
          .error(function(d) {
            console.log("error while loading users");
          });
        });


        function removeAttachment(item)
        {
            if ( vm.card.idAttachmentCover === item.id ){
                vm.card.idAttachmentCover = '';
            }

            var updateInfo = UpdateInfoService.setUpdateInfo('attachments', "" , item.name);

            apilaData.deleteAttachment(vm.card._id, item._id, vm.card)
            .success(function(d) {
              vm.card.attachments.splice(vm.card.attachments.indexOf(item), 1);
              vm.card.updateInfo.push(transformUpdateInfo(updateInfo));
            })
            .error(function(d) {
              console.log(d);
            });
        }

        //////////////////////////// LABEL /////////////////////////////////

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
            .error(function() {
              console.log("Error while deleting label");
            });

            vm.newLabelName = '';
        }

        function editLabel(id) {
          vm.labelTabIndex = 2;
          vm.editLabelId = id;
        }

        function addLabelToCard(id) {
          if(!isLabelInCard(id)) {
            vm.card.labels.push(vm.board.labels.getById(id));

            vm.card.updateInfo.push(transformUpdateInfo(UpdateInfoService.setUpdateInfo('labels', vm.board.labels.getById(id).name, "")));
          } else {
            removeLabelFromCard(id);
          }

          updateIssue();

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


        ////////////////////////////// MEMBERS ////////////////////////////

        function addMembers(item, array) {

            msUtils.toggleInArray(item, array);

            vm.card.updateInfo.push(transformUpdateInfo(UpdateInfoService.setUpdateInfo('idMembers', item.name, "")));

            updateIssue();

        }

        function memberQuerySearch(query)
        {
            return query ? vm.members.filter(createFilterFor(query)) : [];
        }

        function filterMember(member)
        {
            if ( !vm.memberSearchText || vm.memberSearchText === '' )
            {
                return true;
            }

            return angular.lowercase(member.name).indexOf(angular.lowercase(vm.memberSearchText)) >= 0;
        }


        /////////////////////////// CHECKLISTS ///////////////////////////////

        function updateCheckedCount(list, checkedItem)
        {
            var checkItems = list.checkItems;
            var checkedItems = 0;
            var allCheckedItems = 0;
            var allCheckItems = 0;

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
              console.log(response);
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

            checkList.updateInfo = UpdateInfoService.setUpdateInfo('checkitem', newCheckItem.name, "");

            apilaData.updateCheckList(vm.card._id, checkList._id, checkList)
            .success(function(d) {

                vm.card.updateInfo.push(transformUpdateInfo(checkList.updateInfo));
                updateCheckedCount(checkList);

            })
            .error(function() {
              console.log("Error while updateing checklist");
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
              console.log("Error while removing checklist");
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

            data.updateInfo = UpdateInfoService.setUpdateInfo('checklists', data.name, "");

            vm.newCheckListTitle = '';

            apilaData.addCheckList(vm.card._id, data)
            .success(function(d) {
                vm.card.checklists.push(d);
                vm.card.updateInfo.push(transformUpdateInfo(data.updateInfo));
                vm.newCheckListTitle = "Checklist";
            })
            .error(function(d) {
              console.log("Error while adding checklist");
            });
        }

        /////////////////////////// COMMENTS ///////////////////////////////

        function addNewComment(newCommentText)
        {
            var issueid = vm.card._id;

            var commentData = {
              commentText: newCommentText,
              author: authentication.currentUser().id
            };

            vm.card.updateInfo.push(transformUpdateInfo(UpdateInfoService.setUpdateInfo('comments', commentData.commentText, "")));

            apilaData.addIssueCommentById(issueid, commentData)
            .success(function(data) {

              //only updating frontend view with our comment so we can use our user data
              var newComment = createComment(newCommentText, data.createdOn);
              vm.card.comments.push(newComment);

            }).error(function(data) {
              console.log("Error while adding comment");
            });


        }

        ///////////////////////////// UPDATE ////////////////////////////////

        function updateIssue(deletedMember) {

          vm.card.title = vm.card.name;

          //add updateInfo Data
          vm.card.modifiedBy = authentication.currentUser().id;
          vm.card.modifiedDate = new Date();

          vm.card.updateField = UpdateInfoService.checkChangedFields(oldData, vm.card, deletedMember);

          vm.card.updateInfo.push({
            updateBy : {
              name: authentication.currentUser().name,
              userImage : authentication.getUserImage()
            },
            updateDate : vm.card.modifiedDate,
            updateField : vm.card.updateField
          });

          apilaData.updateIssue(vm.card._id, vm.card);
        }

        ///////////////////////// UPDATE MAIN FIELDS //////////////////////////

       function removeDueDate() {
          vm.card.updateInfo.push(transformUpdateInfo(UpdateInfoService.setUpdateInfo('due', "" , vm.card.currdue)));
          vm.card.currdue = '';

          updateIssue();
        }

        function updateTextFields(type) {
          vm.card.updateInfo.push(transformUpdateInfo(UpdateInfoService.setUpdateInfo(type, vm.card[type], "")));
          vm.updateIssue();
        }

        function memberUpdate(selectedMember) {
          vm.card.deletedMember = selectedMember;
          vm.card.updateInfo.push(transformUpdateInfo(UpdateInfoService.setUpdateInfo('idMembers', "" , selectedMember)));

          updateIssue(selectedMember);

        }

        function updateLabel(labelid) {
          vm.updateIssue();
        }

        function selectedItemChange(selectedMember) {
          if(selectedMember !== null) {
            updateIssue();
          }
        }

        //Update due date
        $scope.$watch('vm.card.currdue', function() {
          if(unchangedDueDate !== vm.card.currdue) {

            if(vm.card.currdue != null) {
              if(vm.card.currdue !== "2016") {
                vm.card.due = vm.card.currdue;
                if(vm.card.due !== "") {
                  vm.card.updateInfo.push(transformUpdateInfo(UpdateInfoService.setUpdateInfo('due', vm.card.currdue, "")));
                }

                vm.updateIssue();
              }
            }

          }
        });

        ////////////////////////////// OTHER ///////////////////////////////

        function exportIssue() {
          exportIssueDetail.exportPdf(vm.card);
        }

        function changeStatus() {

          if(vm.card.status === "Shelved") {
            vm.card.shelvedDate = new Date();
          }

          vm.card.updateInfo.push(transformUpdateInfo(UpdateInfoService.setUpdateInfo('status', vm.card.status, "")));

          vm.updateIssue();

          // delete card
          var cardList = getCardList();

          cardList.idCards.splice(cardList.idCards.indexOf(vm.card.id), 1);
          vm.board.cards.splice(vm.board.cards.indexOf(vm.card), 1);
        }

        function openImage(url){
          $mdDialog.show({
                controllerAs: 'vm',
                controller: 'ImageViewController',
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                templateUrl: 'app/main/issues/dialogs/card/image-view/imageView.html',
                resolve: {
                  imgUrl: function() {
                    return url;
                  }
                }
              });
         }

         function closeDialog()
         {
             $mdDialog.hide();
         }

         function getCardList()
         {
             var response;
             for ( var i = 0, len = vm.board.lists.length; i < len; i++ )
             {
                 if ( vm.board.lists[i].idCards.indexOf(vm.card.id) > -1 )
                 {
                     response = vm.board.lists[i];
                     break;
                 }
             }
             return response;
         }

         function removeCard(ev)
         {
             var confirm = $mdDialog.confirm({
                 title              : 'Remove Card',
                 parent             : $document.find('#issues'),
                 textContent        : 'Are you sure want to remove card?',
                 ariaLabel          : 'remove card',
                 targetEvent        : ev,
                 clickOutsideToClose: true,
                 escapeToClose      : true,
                 ok                 : 'Remove',
                 cancel             : 'Cancel'
             });

             $mdDialog.show(confirm).then(function ()
             {
                 var cardList = getCardList();

                 //delete that issue
                 apilaData.deleteIssue(vm.card._id)
                 .success(function(d) {

                   cardList.idCards.splice(cardList.idCards.indexOf(vm.card.id), 1);
                   vm.board.cards.splice(vm.board.cards.indexOf(vm.card), 1);

                   updateIssueCount();

                 })
                 .error(function(d) {
                   console.log(d);
                 });

             }, function ()
             {
                 // Canceled
             });
         }

         function wordCloud() {
           $mdDialog.show({
                 controllerAs: 'vm',
                 controller: 'WordCloudController',
                 preserveScope: true,
                 autoWrap: true,
                 skipHide: true,
                 templateUrl: 'app/main/issues/dialogs/wordCloud/wordCloud.html',
                 locals: {
                   issue: vm.card
                 }
               });
         }

        ///////////////////////// HELPER FUNCTIONS ////////////////////////////

        function createComment(text, createdOn) {
          var newComment = {
              idMember: '',
              commentText : text,
              author    : {
                name: authentication.currentUser().name,
                userImage: authentication.getUserImage()
              },
              createdOn: createdOn
          };

          return newComment;
        }

        function isLabelInCard(id) {
          for(var i = 0; i < vm.card.labels.length; ++i) {
            if(vm.card.labels[i].id === id) {
              return true;
            }
          }

          return false;
        }

        function updateIssueCount() {
          apilaData.openIssuesCount(userid, vm.myCommunity._id)
            .success(function(count) {
              msNavigationService.saveItem('fuse.issues', {
                badge: {
                  content:  count,
                  color  : '#F44336'
                }
              });
            })
            .error(function(response) {
              console.log(response);
            });
        }

        //why this? when adding something new we want it to show imidiately right?
        //But we store userId in updateInfo not the whole object as everything that
        //is pushed imidiately is by us push our username and id
        function transformUpdateInfo(updateInfo) {
          updateInfo.updateBy = {
            'name' : authentication.currentUser().name,
            'userImage' : authentication.getUserImage()
          };

          return updateInfo;
        }

        function setUserRole() {
          if(vm.myCommunity.creator.name === vm.username) {
            vm.userRole = "creator";
          } else if(vm.myCommunity.boss.name === vm.username) {
            vm.userRole = "boss";
          } else if(_.find(vm.myCommunity.directors, {"name" : vm.username}) !== undefined) {
            vm.userRole = "directors";
          } else if(_.find(vm.myCommunity.minions, {"name" : vm.username}) !== undefined) {
            vm.userRole = "minions";
          }
        }

        ///////////////////////// THEME FUNCTIONS /////////////////////////////

        function createFilterFor(query)
        {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item)
            {
                return angular.lowercase(item.name).indexOf(lowercaseQuery) >= 0;
            };
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


    }
})();
