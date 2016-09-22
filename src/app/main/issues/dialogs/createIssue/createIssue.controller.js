(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .controller('CreateIssueController', CreateIssueController);

    /** @ngInject */
    function CreateIssueController($mdDialog, apilaData, board, name, authentication, msNavigationService) {

      var vm = this;

      // Data
      var username = authentication.currentUser().name;
      var userid = authentication.currentUser().id;

      vm.residentList = [];
      vm.selectedUser = {};

      //Functions
      vm.closeDialog = closeDialog;
      vm.addIssue = addIssue;
      vm.getMatches = getMatches;

      apilaData.userCommunity(userid)
      .success(function(d) {
        vm.myCommunity = d;
      });

      function closeDialog()
      {
          $mdDialog.hide();
      }

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

     // load of lists of residents for autocomplete selection
     apilaData.usersList()
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
         console.log("Error retriving the list of residents");
       });

      function addIssue() {

        vm.form.responsibleParty = vm.selectedItem.value;
        vm.form.community = vm.myCommunity;

        apilaData.addIssue(vm.form)
            .success(function(issue) {

              //format issue for frontend
              issue.id = issue._id;
              issue.name = issue.title;

              addIssueToList(issue);

              updateIssueCount();

              closeDialog();
            })
            .error(function(issue) {
                console.log("Error while adding issue");
            });
      }

      /////////////////////// HELPER FUNCTIONS //////////////////////////

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

      function addIssueToList(issue) {

        //wierd stuff with board.data
        if(board.data === undefined) {
          board.data = board;
        }

        // add to general list of cards
        board.data.cards.push(issue);

        // find the right list to add a new issue to
        var rightList = _.find(board.data.lists, {"name" : issue.responsibleParty.name});

        rightList.idCards.push(issue.id);

      }

    }

})();
