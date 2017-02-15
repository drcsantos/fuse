(function() {

  angular
    .module('app.core')
    .service('apilaData', apilaData);

  apilaData.$inject = ['$http', 'authentication'];

  function apilaData($http, authentication) {

    ////////////////////////////////////////////////

    var apiUrl="http://localhost:3300";

    function getAuth() {
      return {
        "headers": {
          Authorization: 'Bearer ' + authentication.getToken()
        }
      };
    }


    var getApiUrl = function() {
      return apiUrl;
    };

    ///////////////////////////////////////////////

    /***************** ISSUES RESOURCES ***************/

    var issuesList = function(status, communityid) {
      return $http.get(apiUrl + '/api/issues/list/' + status + "/id/" + communityid, getAuth());
    };
    var issueById = function(issueid) {
      return $http.get(apiUrl + '/api/issues/' + issueid, getAuth());
    };

    var listIssueByUsername = function(username, status, communityid) {
      return $http.get(apiUrl + '/api/issues/' + username + "/s/" + status +
        "/id/" + communityid, getAuth());
    };

    var addIssue = function(data) {
      return $http.post(apiUrl + '/api/issues/new', data, getAuth());
    };

    var updateIssue = function(issueid, data) {
      return $http.put(apiUrl + '/api/issues/' + issueid, data, getAuth());
    };

    var createLabel = function(communityid, data) {
      return $http.post(apiUrl + '/api/issues/labels/' + communityid, data, getAuth());
    }

    var addLabelToCard = function(issueid, data) {
      return $http.post(apiUrl + '/api/issues/' + issueid + '/labels/' + data._id, data, getAuth());
    };

    var removeLabelFromCard = function(issueid, labelname) {
      return $http.delete(apiUrl + '/api/issues/' + issueid + '/labels/' + labelname, getAuth());
    };

    var deleteLabel = function(communityid, labelname) {
      return $http.delete(apiUrl + '/api/community/' + communityid + '/labels/' + labelname, getAuth());
    };

    var updateIssueLabel = function(communityid, labelname, data) {
      return $http.put(apiUrl + '/api/issues/' + communityid + '/labels/' + labelname, data, getAuth());
    };

    var addIssueCommentById = function(issueid, data) {
      return $http.post(apiUrl + '/api/issues/' + issueid + '/comments/new', data, getAuth());
    };

    var issueCommentsList = function(issueid) {
      return $http.get(apiUrl + '/api/issues/' + issueid + '/comments/', getAuth());
    };

    var issueCommentsUpdate = function(issueid, comment) {
      return $http.put(apiUrl + '/api/issues/' + issueid + '/comments/update',comment, getAuth());
    };

    var addCheckList = function(issueid, data) {
      return $http.post(apiUrl + '/api/issues/' + issueid + '/checklists/new', data, getAuth());
    };

    var updateCheckList = function(issueid, checklistid, data) {
      return $http.put(apiUrl + '/api/issues/' + issueid + '/checklists/' + checklistid,
        data, getAuth());
    };

    var deleteCheckList = function(issueid, checklistid) {
      return $http.delete(apiUrl + '/api/issues/' + issueid + '/checklists/' + checklistid, getAuth());
    };

    var deleteAttachment = function(issueid, attachmentid, data) {
      return $http.delete(apiUrl + '/api/issues/' + issueid + '/attachments/' + attachmentid, getAuth());
    };

    var addFinalPlan = function(issueid, data) {
      return $http.put(apiUrl + '/api/issues/' + issueid + '/finalplan', data, getAuth());
    };

    var openIssuesCount = function(username, communityId) {
      return $http.get(apiUrl + '/api/issues/count/' + username + '/id/' + communityId, getAuth());
    };

    var deleteIssue = function(issueid) {
      return $http.delete(apiUrl + '/api/issues/' + issueid, getAuth());
    };

    var issuesCount = function(communityId) {
      return $http.get(apiUrl + '/api/issues/issuescount/' + communityId, getAuth());
    };

    var dueIssuesList = function(communityId) {
      return $http.get(apiUrl + '/api/issues/due/' + communityId, getAuth());
    };

    var issueUpdateInfo = function(issueid) {
      return $http.get(apiUrl + '/api/issues/' + issueid + '/updateinfo', getAuth());
    };

    var addUpdateInfo = function(issueid, data) {
      return $http.put(apiUrl + '/api/issues/' + issueid + '/updateinfo', data,  getAuth());
    };

    var updateFinalPlan = function(issueid, planid, data) {
      return $http.put(apiUrl + '/api/issues/' + issueid + '/plan/' + planid, data, getAuth());
    };

    var issuePopulateOne = function(issueid) {
      return $http.get(apiUrl + '/api/issues/' + issueid + '/populate', getAuth());
    };

    var createIssueRecovery = function(data, communityid) {
      return $http.post(apiUrl + '/api/issues/recovery/' + communityid, data, getAuth());
    };

    var verifyPassword = function(data, userid) {
      return $http.post(apiUrl + '/api/issues/recovery/verify/' + userid, data, getAuth());
    };

    /***************** APPOINTMENTS RESOURCES ***************/

    var appointmentsList = function(communityid, month) {
      return $http.get(apiUrl + '/api/appointments/' + communityid + '/month/' + month, getAuth());
    };

    var appointmentsListByMonth = function(month) {
      return $http.get(apiUrl + '/api/appointments/' + month, getAuth());
    };


    var appointmentById = function(appointmentid) {
      return $http.get(apiUrl + '/api/appointments/' + appointmentid, getAuth());
    };

    var addAppointment = function(data) {
      return $http.post(apiUrl + '/api/appointments/new', data, getAuth());
    };

    var updateAppointment = function(appointmentid, formData) {
      return $http.put(apiUrl + '/api/appointments/update/' + appointmentid,
        formData, getAuth());

    };

    var addAppointmentCommentById = function(appointmentid, data) {
      return $http.post(apiUrl + '/api/appointments/' + appointmentid + '/comments/', data, getAuth());
    };

    var appointmentsToday = function(communityId) {
      return $http.get(apiUrl + '/api/appointments/today/' + communityId, getAuth());
    };

    /*********************************************************/

    /***************** RESIDENTS RESOURCES ******************/

    var residentsList = function(communityId) {
      return $http.get(apiUrl + '/api/residents/list/' + communityId, getAuth());
    };

    var residentsFullList = function(communityId) {
      return $http.get(apiUrl + '/api/residents/full-list/' + communityId, getAuth());
    };


    var addResident = function(data) {
      return $http.post(apiUrl + '/api/residents/new', data, getAuth());
    };

    var residentById = function(residentid) {
      return $http.get(apiUrl + '/api/residents/' + residentid, getAuth());
    };

    var updateResident = function(residentid, formData) {
      return $http.put(apiUrl + '/api/residents/update/' + residentid,
        formData, getAuth());

    };

    var residentCount = function(communityid) {
      return $http.get(apiUrl + '/api/residents/count/' + communityid, getAuth());
    };

    var averageAge = function(communityid) {
      return $http.get(apiUrl + '/api/residents/average_age/' + communityid, getAuth());
    };

    var averageStayTime = function(communityid) {
      return $http.get(apiUrl + '/api/residents/average_stay/' + communityid, getAuth());
    };

    var getLocations = function(communityid) {
      return $http.get(apiUrl + '/api/residents/' + communityid + '/locations', getAuth());
    };

    var updateListItem = function(residentid, data) {
      return $http.put(apiUrl + '/api/residents/' + residentid + '/listitem', data, getAuth());
    };

    var addContact = function(residentid, data) {
      return $http.post(apiUrl + '/api/residents/' + residentid + '/contact', data, getAuth());
    };

    /**************************************************************/

    /***************** USERS RESOURCES ***************/

    var usersList = function() {
      return $http.get(apiUrl + '/api/users', getAuth());
    };

    var changeUsername = function(userid, data) {
      return $http.put(apiUrl + "/api/users/change/" + userid, data, getAuth());
    };

    var usersInCommunity = function(communityId) {
      return $http.get(apiUrl + '/api/users/list/' + communityId, getAuth());
    };

    var userCommunity = function(userid) {
      return $http.get(apiUrl + '/api/users/community/' + userid, getAuth());
    };

    var forgotPassword = function(email) {
      return $http.post(apiUrl + '/api/users/forgotpassowrd/' + email);
    };

    var resetPassword = function(token, data) {
      return $http.post(apiUrl + '/api/users/reset/' + token, data);
    };

    var verifyEmail = function(token) {
      return $http.post(apiUrl + '/api/users/verify/' + token);
    };

    var getUser = function(userid) {
      return $http.get(apiUrl + '/api/users/getuser/' + userid, getAuth());
    };

    var saveCreditCard = function(userid, data) {
      return $http.post(apiUrl + '/api/users/' + userid + '/savecard', data, getAuth());
    };

    var getCustomer = function(userid) {
      return $http.get(apiUrl + '/api/users/' + userid + "/customer", getAuth());
    };

    var cancelSubscription = function(userid) {
      return $http.delete(apiUrl + '/api/users/' + userid + '/subscription', getAuth());
    };

    var updateCustomer = function(userid, data) {
      return $http.put(apiUrl + '/api/users/' + userid + '/update', data, getAuth());
    };

    /***************** COMMUNITY RESOURCES ***************/

    var addCommunity = function(data) {
      return $http.post(apiUrl + '/api/communities/new', data);
    };

    var communityList = function(data) {
      return $http.get(apiUrl + '/api/communities/', getAuth());
    };

    var acceptMember = function(data, communityid) {
      return $http.put(apiUrl + '/api/communities/accept/' + communityid, data, getAuth());
    };

    var addPendingMember = function(data, communityid) {
      return $http.put(apiUrl + '/api/communities/pending/' + communityid, data, getAuth());
    };

    var declineMember = function(data, communityid) {
      return $http.put(apiUrl + '/api/communities/decline/' + communityid, data, getAuth());
    };

    var addRole = function(communityid, userid, data) {
      return $http.post(apiUrl + '/api/communities/' + communityid + "/role/" + userid, data, getAuth());
    };

    var acceptMember = function(data, communityid) {
      return $http.put(apiUrl + '/api/communities/accept/' + communityid, data, getAuth());
    };

    var updateFloor = function(communityid, data) {
      return $http.put(apiUrl + '/api/communities/' + communityid + "/floor", data, getAuth());
    };

    var addFloor = function(communityid, data) {
      return $http.post(apiUrl + '/api/communities/' + communityid + "/floor", data, getAuth());
    };

    var removeMember = function(communityid, userid) {
      return $http.delete(apiUrl + '/api/communities/' + communityid + "/user/" + userid, getAuth());
    };

    var deleteRoomStyle = function(communityid, roomid) {
      return $http.delete(apiUrl + '/api/communities/' + communityid + "/roomstyle/" + roomid, getAuth());
    };

    var hasCanceledCommunity = function(userid) {
      return $http.get(apiUrl + '/api/communities/canceled/' + userid, getAuth());
    };

    var restoreCommunity = function(userid, communityid) {
      return $http.post(apiUrl + '/api/communities/' + communityid + '/restore/' + userid, {}, getAuth());
    };

    var updateContactAndRoomInfo = function(communityid, data) {
      return $http.put(apiUrl + '/api/communities/' + communityid +'/contactinfo', data, getAuth());
    };

    var createRoomStyle = function(communityid, data) {
      return $http.post(apiUrl + '/api/communities/' + communityid + '/roomstyle', data, getAuth());
    };

    var updateRoomStyle = function(communityid, data) {
      return $http.put(apiUrl + '/api/communities/' + communityid + '/roomstyle/' + data._id, data, getAuth());
    };

    ////////////////////////// TODOS RESOURCES /////////////////////////////

    var listTasks = function(todoId) {
      return $http.get(apiUrl + '/api/todos/' + todoId, getAuth());
    };

    var activeTasksCount = function(todoId) {
      return $http.get(apiUrl + '/api/todos/' + todoId +'/activecount', getAuth());
    };

    var addTask = function(todoId, data) {
      return $http.post(apiUrl + '/api/todos/' + todoId, data, getAuth());
    };

    var updateTask = function(todoId, taskid, data) {
      return $http.put(apiUrl + '/api/todos/' + todoId + '/task/' + taskid, data, getAuth());
    };

    var deleteTask = function(todoId, taskid) {
      return $http.delete(apiUrl + '/api/todos/'+ todoId + '/task/' + taskid, getAuth());
    };

    ////////////////////////////////// ACTIVITY /////////////////////////////////
    var createToDoActivity = function(todoId, data) {
      return $http.post(apiUrl + '/api/activity/' + todoId, data, getAuth());
    };

    /*********************** LOGS  *********************/

    var listLogs = function(communityid) {
      return $http.get(apiUrl + '/api/logs/' + communityid, getAuth());
    };

    /****************************************************/

    return {
      //appointments
      appointmentsList: appointmentsList,
      appointmentById: appointmentById,
      addAppointment: addAppointment,
      updateAppointment: updateAppointment,
      addAppointmentCommentById: addAppointmentCommentById,
      appointmentsListByMonth: appointmentsListByMonth,
      appointmentsToday: appointmentsToday,

      //issues
      issuesList: issuesList,
      issueById: issueById,
      addIssue: addIssue,
      addIssueCommentById: addIssueCommentById,
      updateIssue: updateIssue,
      listIssueByUsername: listIssueByUsername,
      addLabelToCard: addLabelToCard,
      createLabel: createLabel,
      deleteLabel: deleteLabel,
      removeLabelFromCard: removeLabelFromCard,
      updateIssueLabel: updateIssueLabel,
      addCheckList: addCheckList,
      updateCheckList: updateCheckList,
      issueCommentsUpdate: issueCommentsUpdate,
      deleteCheckList: deleteCheckList,
      addFinalPlan: addFinalPlan,
      deleteAttachment: deleteAttachment,
      openIssuesCount: openIssuesCount,
      deleteIssue: deleteIssue,
      issuesCount: issuesCount,
      issueCommentsList : issueCommentsList,
      dueIssuesList: dueIssuesList,
      issueUpdateInfo: issueUpdateInfo,
      addUpdateInfo: addUpdateInfo,
      updateFinalPlan: updateFinalPlan,
      createIssueRecovery: createIssueRecovery,
      verifyPassword: verifyPassword,
      issuePopulateOne: issuePopulateOne,

      //residents
      residentsList: residentsList,
      residentsFullList: residentsFullList,
      addResident: addResident,
      residentById: residentById,
      updateResident: updateResident,
      residentCount: residentCount,
      averageAge: averageAge,
      averageStayTime: averageStayTime,
      getLocations: getLocations,
      updateListItem: updateListItem,
      addContact: addContact,

      //api url
      getApiUrl: getApiUrl,

      //users
      usersList: usersList,
      changeUsername: changeUsername,
      usersInCommunity: usersInCommunity,
      userCommunity: userCommunity,
      forgotPassword: forgotPassword,
      resetPassword: resetPassword,
      verifyEmail: verifyEmail,
      getUser: getUser,
      saveCreditCard: saveCreditCard,
      getCustomer: getCustomer,
      cancelSubscription: cancelSubscription,
      updateCustomer: updateCustomer,

      //community
      addCommunity: addCommunity,
      communityList: communityList,
      acceptMember: acceptMember,
      addPendingMember: addPendingMember,
      declineMember: declineMember,
      addRole: addRole,
      updateFloor: updateFloor,
      addFloor: addFloor,
      removeMember: removeMember,
      deleteRoomStyle: deleteRoomStyle,
      hasCanceledCommunity: hasCanceledCommunity,
      restoreCommunity: restoreCommunity,
      updateContactAndRoomInfo: updateContactAndRoomInfo,
      createRoomStyle: createRoomStyle,
      updateRoomStyle: updateRoomStyle,

      //todos
      listTasks:  listTasks,
      activeTasksCount: activeTasksCount,
      addTask: addTask,
      updateTask: updateTask,
      deleteTask: deleteTask,

      //logs
      listLogs: listLogs,

      //activity
      createToDoActivity: createToDoActivity

    };
  }

})();
