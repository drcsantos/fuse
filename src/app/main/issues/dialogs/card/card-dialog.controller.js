(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .controller('ScrumboardCardDialogController', ScrumboardCardDialogController);

    /** @ngInject */
    function ScrumboardCardDialogController($document, $mdDialog, fuseTheming, $scope, $window, $timeout, exportIssueDetail, LabelsService, ChecklistsService, $mdToast,
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

        vm.newLabelColor = 'red';
        vm.UpdateInfoService = UpdateInfoService;

        vm.Utils = Utils;

        vm.labels = vm.board.labels;

        var unchangedDueDate = angular.copy(vm.card.due);
        var oldData = angular.copy(vm.card);

        vm.oldData = oldData;

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
        vm.removeLabelFromCard = removeLabelFromCard;
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

        vm.editPermissions = editPermissions;
        // Main field update
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
          FileUploadService.uploadFiles(file, invalidFiles, card);
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
              UpdateInfoService.addUpdateInfo('', 'attachments', "" , fileExtension);
            })
            .error(function(d) {
              $log.debug(d);
            });
        }

        //////////////////////////// LABEL /////////////////////////////////


        function addLabelToCard(id) {

          if(id) {
            var label = _.find(vm.board.labels, {_id: id});

            if(!isLabelInCard(label.name)) {

              apilaData.addLabelToCard(vm.card._id, label)
              .success(function(resp) {
                 vm.card.labels.push(label);

                 UpdateInfoService.addUpdateInfo('', 'labels', label.name, "");
              })
              .error(function(err) {
                $log.debug(err);
              });

            } else {
              vm.removeLabelFromCard(label.name);

               UpdateInfoService.addUpdateInfo('', 'labels', "", label.name);
            }
          }

        }

        function removeLabelFromCard(labelname, fromchip) {

          apilaData.removeLabelFromCard(vm.card._id, labelname)
          .success(function(resp) {

            if(!fromchip) {
              var index = _.findIndex(vm.card.labels, {name: labelname});

              if(index != null) {
                vm.card.labels.splice(index, 1);
              }
            }

          })
          .error(function(err) {
            $log.debug(err);
          });

        }

        ////////////////////////////// MEMBERS ////////////////////////////

        function addMembers(item, array) {

            var exists = vm.existsMembers(item, array);

            vm.toggleMember(item, array);

            if(exists) {
              UpdateInfoService.addUpdateInfo('', 'members', "", item.name, function(resp) {
                if(resp) {
                  updateIssue();
                }
              });
            } else {
              UpdateInfoService.addUpdateInfo('', 'members', item.name, "", function(resp) {
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

            UpdateInfoService.addUpdateInfo('', 'members', selectedMember.name, "", function(resp) {
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

            UpdateInfoService.addUpdateInfo('', 'comments', commentData.commentText, "");

            apilaData.addIssueCommentById(issueid, commentData)
            .success(function(data) {

              //only updating frontend view with our comment so we can use our user data
              var newComment = createComment(newCommentText, data.createdOn);
              newComment._id = data._id;
              vm.card.comments.push(newComment);

            }).error(function(data) {
              $log.debug("Error while adding comment");
            });


        }

        ///////////////////////////// UPDATE ////////////////////////////////

        function updateIssue(type) {

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

          UpdateInfoService.addUpdateInfo('', 'due', '', currdue, function(resp) {
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
            UpdateInfoService.addUpdateInfo('', type, newValue, oldValue);
          }
        }

        function changeResponsibleParty(type) {

          var responsibleParty = oldData.responsibleParty._id ? oldData.responsibleParty._id : oldData.responsibleParty;

          if(vm.selectedItem && (vm.selectedItem.value !== responsibleParty)) {

            vm.card.responsibleParty = vm.selectedItem.value;
            UpdateInfoService.addUpdateInfo('', 'responsibleParty', vm.selectedItem.display, oldData.responsibleParty.name);

            var newList = _.find(vm.board.lists, {name: vm.selectedItem.display});
            var oldList = _.find(vm.board.lists, {name: oldData.responsibleParty.name});

            oldList.idCards = _.without(oldList.idCards, vm.card.id);

            newList.idCards.push(vm.card.id);

            vm.updateIssue(type);

            closeDialog();

          }

        }

        function memberUpdate(selectedMember) {
          vm.card.deletedMember = selectedMember;

          UpdateInfoService.addUpdateInfo('', 'members', "" , selectedMember, function(resp) {
            vm.card.deletedMember = true;
            updateIssue();
          });

        }

        function updateLabel(label) {

          apilaData.updateIssueLabel(vm.communityId, label.name, label)
          .success(function(resp) {
            $window.location.reload();
          })
          .error(function(err) {
            $log.debug(err);
          });
        }

        //Update due date
        $scope.$watch('vm.card.currdue', function() {
          if(unchangedDueDate !== vm.card.currdue) {

            if(vm.card.currdue) {
              vm.card.due = vm.card.currdue;

              UpdateInfoService.addUpdateInfo('', 'due', vm.card.currdue, "", function(resp) {
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

            UpdateInfoService.addUpdateInfo('', 'export', vm.card.title, "");

          });

        }

        apilaData.issuePopulateOne(vm.card._id)
        .success(function(resp) {
          vm.card.finalPlan = resp.finalPlan;

          console.log(resp.finalPlan);

          vm.responsibleParty = resp.responsibleParty;

          LabelsService.setViewModel(vm);

          vm.submitBy = resp.submitBy;

          vm.createdIssue = resp.submitBy.name + " created " + vm.card.title;

          vm.selectedItem = {
            value: resp.responsibleParty._id,
            display: resp.responsibleParty.name
          };

        });

        function editPermissions(type) {
          if(vm.userRole) {

            if(vm.userRole === 'boss') {
              return false;
            }

            if(vm.userRole === 'directors') {
              return false;
            }

            if(vm.userRole === 'minions' || vm.userRole === 'creator') {

              if(!vm.card.responsibleParty._id) {
                return true;
              }

              // if our own issue
              if(vm.userid === vm.card.responsibleParty._id) {
                if(type === 'status' || type === 'responsibleParty') {
                  return true;
                } else {
                  return false;
                }
              } else {
                return true;
              }

            }
          }

          return true;
        }


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
             UpdateInfoService.addUpdateInfo('', 'downloaded', extension, "");
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

             if(vm.finalPlanChecklist) {
               UpdateInfoService.addUpdateInfo('', 'plan-todo', vm.newFinalPlanText, "");
             } else {
               UpdateInfoService.addUpdateInfo('', 'plan-create', vm.newFinalPlanText, "");
             }


             response.author = {
               _id: vm.userid,
               name: vm.username,
               userImage: authentication.getUserImage()
             };

             vm.card.finalPlan.push(response);
             vm.newFinalPlanText = "";

             if(vm.finalPlanChecklist) {
               showToast("Created a new task in the todo section");
             }
           })
           .error(function(response) {
             $log.debug(response);
           });
         }

         function updatePlan(plan) {

           var copyPlan = angular.copy(plan);
           var oldPlan = _.find(vm.card.finalPlan, {createdOn: plan.createdOn});

           if(oldPlan) {

             copyPlan.author = plan.author._id;

             apilaData.updateFinalPlan(vm.card._id, plan._id, plan)
             .success(function(resp) {

               UpdateInfoService.addUpdateInfo('', 'plan', plan.text, oldPlan.text);

             })
             .error(function(err) {
               $log.debug(err);
             });
           }
         }

         function updateComment(comment) {

           var copyComment = angular.copy(comment);

           var oldComment = _.find(vm.card.comments, {createdOn: comment.createdOn});

           if(oldComment) {
             copyComment.author = comment.author._id;

             apilaData.issueCommentsUpdate(vm.card._id, copyComment)
             .success(function(resp) {
               UpdateInfoService.addUpdateInfo('', 'comment', comment.commentText, oldComment.commentText);
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

        function isLabelInCard(name) {

          var label = _.find(vm.card.labels, {name: name});

          return (label) ? true : false;
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
          } else if(_.find(vm.myCommunity.directors, {"name" : vm.username}) !== undefined) {
            vm.userRole = "directors";
          } else if(_.find(vm.myCommunity.minions, {"name" : vm.username}) !== undefined) {
            vm.userRole = "minions";
          }

          if(vm.myCommunity.boss.name === vm.username) {
            vm.userRole = "boss";
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
