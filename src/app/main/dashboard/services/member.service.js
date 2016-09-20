(function() {

  'use strict';

  angular
    .module('app.dashboard')
    .service('MemberService', MemberService);


  /** @ngInject */
  function MemberService(apilaData, $mdDialog) {

    var pendingMemberTable = null;
    var communityMemberTable = null;
    var communityId = null;

    function acceptMember(index, member)
    {
      //remove it from pending table
      pendingMemberTable.splice(0, 1);

      var data = {};
      data.member = member[3];

      var addedMember = member.concat([false, false, true, false, "Minion", ""]);

      apilaData.acceptMember(data, communityId)
      .success(function(d) {
        member.splice(member.length-1, 1);
        communityMemberTable.push(addedMember);
      })
      .error(function(d) {
        console.log(d);
      });
    }

    function declineMember(index, memberid)
    {
      var data = {
        "member" : memberid
      };

      apilaData.declineMember(data, communityId)
      .success(function(d) {
        pendingMemberTable.splice(index, 1);
      })
      .error(function(d) {
        console.log(d);
      });
    }

    function removeMember(userid, name) {

      var confirm = createConfirmDialog(name);

      $mdDialog.show(confirm).then(function() {

        apilaData.removeMember(communityId, userid)
          .success(function(response) {
            removeMemberFromTable(userid);
          })
          .error(function(response) {
            console.log(response);
          });

      });

    }

    function addRole(user, type) {
      var userId = user;

      var data = {
        "type" : type
      };

      apilaData.addRole(communityId, userId, data)
      .success(function(response) {
        console.log("Role added " + response);
      })
      .error(function(response) {
        console.log("Couldn't add a role");
      });
    }

    function setData(pendingMember, communityMember, id) {
      pendingMemberTable = pendingMember;
      communityMemberTable = communityMember;
      communityId = id;
    }

    ///////////////////// HELPER FUNCTIONS /////////////////////////////////

    function removeMemberFromTable(userid) {
      for(var i = 0; i < communityMemberTable.length; ++i) {
        if(communityMemberTable[i][3] === userid) {
          communityMemberTable.splice(i, 1);
          return;
        }
      }
    }

    function createConfirmDialog(name) {
      var confirm = $mdDialog.confirm()
         .title('Are you sure you want to remove the user ' + name)
         .ariaLabel('Lucky day')
         .ok('Yes')
         .cancel('Cancel');

      return confirm;
    }

    return {
      acceptMember : acceptMember,
      declineMember : declineMember,
      removeMember : removeMember,
      addRole : addRole,
      setData : setData
    };

  }

})();
