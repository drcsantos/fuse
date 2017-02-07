(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .controller('ScrumboardCardDialogController', ScrumboardCardDialogController);

    /** @ngInject */
    function ScrumboardCardDialogController($document, $mdDialog, fuseTheming, $scope, $timeout, exportIssueDetail, LabelsService, ChecklistsService, $mdToast,
      fuseGenerator, msUtils, BoardService, cardId, apilaData, authentication, msNavigationService, $log, FileUploadService, UpdateInfoService, MembersService, Utils)
    {
        var vm = this;

        // Data
        LabelsService.setViewModel(vm);
        ChecklistsService.setViewModel(vm);
        MembersService.setViewModel(vm);

        vm.board = BoardService.data.data;
        vm.card = vm.board.cards.getById(cardId);

        vm.card.currdue = vm.card.due;

        vm.card.labels.map(function(d){d.id = d._id; return d;});
        vm.board.labels.map(function(d){d.id = d._id; return d;});

        vm.newLabelColor = 'red';
        vm.UpdateInfoService = UpdateInfoService;

        vm.Utils = Utils;

        vm.labels = vm.board.labels;

        var unchangedDueDate = angular.copy(vm.card.due);
        var oldData = angular.copy(vm.card);

        vm.oldData = oldData;

        console.log(oldData);

        vm.newCheckListTitle = "Checklist";

        vm.username = authentication.currentUser().name;
        var userid = authentication.currentUser().id;
        vm.userid = userid;
        vm.communityId = authentication.currentUser().communityId;

        vm.now = new Date();

        // Functions
        vm.palettes = fuseTheming.getRegisteredPalettes();
        vm.rgba = fuseGenerator.rgba;
        vm.toggleInArray = msUtils.toggleInArray;
        vm.exists = msUtils.exists;

        vm.existsMembers = function(item, arr) {
          return _.find(arr, {_id: item._id}) ? true : false;
        };

        vm.toggleMember = function(item, arr) {
          var exists = _.find(arr, {_id: item._id}) ? true : false;

          if(exists) {
            arr.splice(arr.indexOf(item), 1);
          } else {
            arr.push(item);
          }
        };

        vm.removeAttachment = removeAttachment;

        // Labels
        vm.labelQuerySearch = LabelsService.labelQuerySearch;
        vm.filterLabel = LabelsService.filterLabel;
        vm.addNewLabel = LabelsService.addNewLabel;
        vm.removeLabel = LabelsService.removeLabel;
        vm.removeLabelFromCard = LabelsService.removeLabelFromCard;
        vm.editLabel = LabelsService.editLabel;
        vm.addLabelToCard = addLabelToCard;
        vm.isLabelInCard = isLabelInCard;

        // Members
        vm.memberQuerySearch = MembersService.memberQuerySearch;
        vm.filterMember = MembersService.filterMember;
        vm.addMembers = addMembers;

        // Checklist
        vm.updateCheckedCount = ChecklistsService.updateCheckedCount;
        vm.addCheckItem = ChecklistsService.addCheckItem;
        vm.updateCheckListName = ChecklistsService.updateCheckListName;
        vm.removeChecklist = ChecklistsService.removeChecklist;
        vm.createCheckList = ChecklistsService.createCheckList;
        vm.removeCheckItem = ChecklistsService.removeCheckItem;
        vm.updateCheckItem = ChecklistsService.updateCheckItem;

        vm.addNewComment = addNewComment;
        vm.updateComment = updateComment;
        vm.updateIssue = updateIssue;

        vm.updatePlan = updatePlan;

        // Main field update
        vm.updateTextFields = updateTextFields;
        vm.removeDueDate = removeDueDate;
        vm.memberUpdate = memberUpdate;
        vm.updateLabel = updateLabel;
        vm.addMemberAutoComplete = addMemberAutoComplete;

        //Other
        vm.wordCloud = wordCloud;
        vm.closeDialog = closeDialog;
        vm.getCardList = getCardList;
        vm.removeCard = removeCard;
        vm.openImage = openImage;
        vm.changeStatus = changeStatus;
        vm.exportIssue = exportIssue;
        vm.addFinalPlan = addFinalPlan;

        vm.downloadedInfo = downloadedInfo;

        vm.formatUpdateArray = UpdateInfoService.formatUpdateArray;

        vm.getMatches = getMatches;

        vm.changeResponsibleParty = changeResponsibleParty;

        vm.uploadFiles = function(file, invalidFiles, card) {
          FileUploadService.uploadFiles(file, invalidFiles, card, UpdateInfoService.setUpdateInfo);
        };

        // load of lists of residents for autocomplete selection
        apilaData.usersInCommunity(vm.communityId)
          .success(function(usersList) {
            vm.residentList = usersList.map(function(elem) {

              if (elem.name === name) {
                vm.selectedItem = {
                  value: elem._id,
                  display: elem.name
                };
              }

              return {
                value: elem._id,
                display: elem.name
              };
            });

          })
          .error(function(usersList) {
            $log.debug("Error retriving the list of residents");
          });

        function getMatches(text) {
          if(text === null) {
            return;
          }

          var textLower = text.toLowerCase();

          var ret = vm.residentList.filter(function (d) {
              if(d.display != null) {
                return d.display.toLowerCase().indexOf(textLower) > -1;
              }
          });

          return ret;
        }

        // Load comments
        apilaData.issueCommentsList(vm.card._id)
        .success(function(response) {
          vm.card.comments = response;
        })
        .error(function(response) {
          $log.debug(response);
        });

        // Load updateInfo
        apilaData.issueUpdateInfo(vm.card._id)
        .success(function(response) {
          vm.card.updateInfo = response;
          UpdateInfoService.setData(vm.card._id, vm.card.updateInfo);
        })
        .error(function(response) {
          $log.debug(response);
        });

        apilaData.userCommunity(userid)
        .success(function(d) {

          vm.myCommunity = d;

          setUserRole();

          //load member list
          apilaData.usersInCommunity(d._id)
          .success(function(response) {
            vm.members = response;
          })
          .error(function(response) {
            $log.debug(response);
          });
        });


        function removeAttachment(item)
        {
            if ( vm.card.idAttachmentCover === item.id ){
                vm.card.idAttachmentCover = '';
            }

            var fileExtension = item.name.split('.').pop();

            if(!fileExtension) {
              fileExtension = item.name;
            }

            apilaData.deleteAttachment(vm.card._id, item._id, vm.card)
            .success(function(d) {
              vm.card.attachments.splice(vm.card.attachments.indexOf(item), 1);
              UpdateInfoService.addUpdateInfo('attachments', "" , fileExtension);
            })
            .error(function(d) {
              $log.debug(d);
            });
        }

        //////////////////////////// LABEL /////////////////////////////////


        function addLabelToCard(id) {
          if(!isLabelInCard(id)) {
            vm.card.labels.push(vm.board.labels.getById(id));

            vm.card.updateInfo.push(UpdateInfoService.setUpdateInfo('labels', vm.board.labels.getById(id).name, ""));
          } else {
            removeLabelFromCard(id);
          }

          updateIssue();

        }

        ////////////////////////////// MEMBERS ////////////////////////////

        function addMembers(item, array) {

            var exists = vm.existsMembers(item, array);

            vm.toggleMember(item, array);

            if(exists) {
              UpdateInfoService.addUpdateInfo('members', "", item.name, function(resp) {
                if(resp) {
                  updateIssue();
                }
              });
            } else {
              UpdateInfoService.addUpdateInfo('members', item.name, "", function(resp) {
                if(resp) {
                  updateIssue();
                }
              });
            }

        }

        function addMemberAutoComplete(selectedMember) {
          if(selectedMember !== null) {
            vm.card.addedMember = selectedMember;

            vm.card.idMembers.push(selectedMember);

            UpdateInfoService.addUpdateInfo('members', selectedMember.name, "", function(resp) {
              if(resp) {
                updateIssue();
              }
            });

          }
        }

        /////////////////////////// COMMENTS ///////////////////////////////

        function addNewComment(newCommentText)
        {
            var issueid = vm.card._id;

            var commentData = {
              commentText: newCommentText,
              author: authentication.currentUser().id
            };

            UpdateInfoService.addUpdateInfo('comments', commentData.commentText, "");

            apilaData.addIssueCommentById(issueid, commentData)
            .success(function(data) {

              //only updating frontend view with our comment so we can use our user data
              var newComment = createComment(newCommentText, data.createdOn);
              vm.card.comments.push(newComment);

            }).error(function(data) {
              $log.debug("Error while adding comment");
            });


        }

        ///////////////////////////// UPDATE ////////////////////////////////

        function updateIssue(type) {

          //console.log(updateIssue.caller.name);

          vm.card.title = vm.card.name;

          var oldResponsibleParty = oldData.responsibleParty._id ?
                                 oldData.responsibleParty._id : oldData.responsibleParty;

          // Remember if responsible party changes
          if(oldResponsibleParty !== vm.card.responsibleParty) {
            vm.card.oldResponsibleParty = oldResponsibleParty;
          }

          // Set author Id if it is an user object but api needs just an _id
          var populatedCard = angular.copy(vm.card);

          setAuthorId(populatedCard.comments);
          setAuthorId(populatedCard.finalPlan);
          setAuthorId(populatedCard.checklists);

          populatedCard.submitBy = populatedCard.submitBy._id;

          apilaData.updateIssue(vm.card._id, populatedCard)
          .success(function(response) {
            vm.card.addedMember = "";
            vm.card.updateField = "";
            updateMainFields(type);
          })
          .error(function(err) {
            $log.debug(err);
          });
        }

        ///////////////////////// UPDATE MAIN FIELDS //////////////////////////

       function removeDueDate() {
         vm.card.due = "";

         var currdue = vm.card.currdue;

          if(isNaN(vm.card.currdue)) {
           currdue = moment(vm.card.currdue).toDate().getTime();
          }

          UpdateInfoService.addUpdateInfo('due', '', currdue, function(resp) {
            if(resp) {
              updateIssue();
            }
          })
          vm.card.currdue = '';

        }

        function updateMainFields(type) {

          if(type === 'responsibleParty') {
            return;
            if(vm.selectedItem.value !== oldData.responsibleParty._id) {
              //UpdateInfoService.addUpdateInfo('responsibleParty', vm.selectedItem.display, oldData.responsibleParty.name);

            }
          }

          var oldValue = oldData[type];
          var newValue = vm.card[type];

          // we changed it
          if(oldValue !== newValue) {
            UpdateInfoService.addUpdateInfo(type, newValue, oldValue);
          }
        }

        function changeResponsibleParty(type) {

          var responsibleParty = oldData.responsibleParty._id ? oldData.responsibleParty._id : oldData.responsibleParty;

          console.log(vm.board);

          if(vm.selectedItem && (vm.selectedItem.value !== responsibleParty)) {

            vm.card.responsibleParty = vm.selectedItem.value;
            UpdateInfoService.addUpdateInfo('responsibleParty', vm.selectedItem.display, oldData.responsibleParty.name);

            var newList = _.find(vm.board.lists, {name: vm.selectedItem.display});
            var oldList = _.find(vm.board.lists, {name: oldData.responsibleParty.name});

            oldList.idCards = _.without(oldList.idCards, vm.card.id);

            newList.idCards.push(vm.card.id);

            vm.updateIssue(type);

            closeDialog();

          }

        }

        function updateTextFields(type) {
          vm.card.updateInfo.push(UpdateInfoService.setUpdateInfo(type, vm.card[type], ""));
          vm.updateIssue();
        }

        function memberUpdate(selectedMember) {
          vm.card.deletedMember = selectedMember;

          UpdateInfoService.addUpdateInfo('members', "" , selectedMember, function(resp) {
            vm.card.deletedMember = true;
            updateIssue();
          });

        }

        function updateLabel(labelid) {
          vm.updateIssue();
        }

        //Update due date
        $scope.$watch('vm.card.currdue', function() {
          if(unchangedDueDate !== vm.card.currdue) {

            if(vm.card.currdue) {
              vm.card.due = vm.card.currdue;

              UpdateInfoService.addUpdateInfo('due', vm.card.currdue, "", function(resp) {
                if(resp) {
                  vm.updateIssue();
                }
              });
            }

          }
        });

        ////////////////////////////// OTHER ///////////////////////////////

        function exportIssue() {

          apilaData.issuePopulateOne(vm.card._id)
          .success(function(resp) {
            vm.card.checklists = resp.checklists;

            vm.card.responsibleParty = vm.responsibleParty;

            exportIssueDetail.exportPdf(vm.card);

            UpdateInfoService.addUpdateInfo('export', vm.card.title, "");

          });

        }

        apilaData.issuePopulateOne(vm.card._id)
        .success(function(resp) {
          vm.card.finalPlan = resp.finalPlan;

          console.log(resp.finalPlan);

          vm.responsibleParty = resp.responsibleParty;

          vm.createdIssue = resp.submitBy.name + " created " + vm.card.title;

          vm.selectedItem = {
            value: resp.responsibleParty._id,
            display: resp.responsibleParty.name
          };

        });

        function changeStatus() {

          //if we switched it to Close and we dont have a final plan show Error
          if(vm.card.status === "Closed" && vm.card.finalPlan.length <= 0) {
            vm.card.status = oldData.status;
            showToast("You must write at least one final plan item before closing");
            return;
          }

          if(vm.card.status === "Shelved") {
            vm.card.shelvedDate = new Date();
          }

          vm.card.updateInfo.push(UpdateInfoService.setUpdateInfo('status', vm.card.status, ""));

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
                   $log.debug(d);
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

         function setAuthorId(subdocument) {
           subdocument.forEach(function(doc) {
             if(doc.author && doc.author._id) {
               doc.author = doc.author._id;
             }
           });
         }

         function downloadedInfo(name) {
           var extension = name.split('.').pop();

           if(extension) {
             UpdateInfoService.addUpdateInfo('downloaded', extension, "");
           }
         }

         function addFinalPlan() {

           var data = {
             "text" : vm.newFinalPlanText,
             "checklist" : vm.finalPlanChecklist,
             "author" : userid,
             "todoid": authentication.currentUser().todoid,
             "issueName": vm.card.name
           };

           apilaData.addFinalPlan(vm.card._id, data)
           .success(function(response) {

             if(!vm.finalPlanChecklist) {
               UpdateInfoService.addUpdateInfo('plan-todo', vm.newFinalPlanText, "");
             } else {
               UpdateInfoService.addUpdateInfo('plan-create', vm.newFinalPlanText, "");
             }

             response.author = {
               name: vm.username,
               userImage: authentication.getUserImage()
             };

             console.log(response);

             vm.card.finalPlan.push(response);
             vm.newFinalPlanText = "";

             if(!vm.finalPlanChecklist) {
               showToast("Created a new task in the todo section");
             }
           })
           .error(function(response) {
             $log.debug(response);
           });
         }

         function updatePlan(plan) {

           var copyPlan = angular.copy(plan);
           var oldPlan = _.find(oldData.finalPlan, {createdOn: plan.createdOn});

           if(oldPlan) {
             apilaData.updateFinalPlan(vm.card._id, plan._id, plan)
             .success(function(resp) {
               console.log(resp);

               UpdateInfoService.addUpdateInfo('plan', plan.text, oldPlan.text);

             })
             .error(function(err) {
               $log.debug(err);
             });
           }
         }

         function updateComment(comment) {
           var copyComment = angular.copy(comment);

           var oldComment = _.find(oldData.comments, {createdOn: comment.createdOn});

           if(oldComment) {
             copyComment.author = comment.author._id;

             apilaData.issueCommentsUpdate(vm.card._id, copyComment)
             .success(function(resp) {
               UpdateInfoService.addUpdateInfo('comment', comment.commentText, oldComment.commentText);
             })
             .error(function(err) {
               $log.debug(err);
             });
           }

         }

        ///////////////////////// HELPER FUNCTIONS ////////////////////////////

        function createComment(text, createdOn) {
          var newComment = {
              idMember: '',
              commentText : text,
              author    : {
                _id: authentication.currentUser().id,
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
              $log.debug(response);
            });
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

        function showToast(msg) {
          $mdToast.show(
            $mdToast.simple()
            .textContent(msg)
            .position("top right")
            .hideDelay(3000)
          );
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


    }
})();
