(function() {

  angular
    .module('app.core')
    .service('IssuesApi', IssuesApi);

  IssuesApi.$inject = ['$http', 'authentication'];

  function IssuesApi($http, authentication) {

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

    var restoreAttachment = function(issueid, data) {
      return $http.put(apiUrl + '/api/issues/' + issueid +'/attachments/restore', data, getAuth());
    };

     var updateConfidential = function(issueid, data) {
      return $http.put(apiUrl + '/api/issues/' + issueid +'/confidential', data, getAuth());
    };


    function getIssueRoutes() {
      return {
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
        restoreAttachment: restoreAttachment,
        updateConfidential: updateConfidential
      };

    }

    var apiUrl = "";

    function setApiUrl(url) {
      apiUrl = url;
    }

    function getAuth() {
      return {
        "headers": {
          Authorization: 'Bearer ' + authentication.getToken()
        }
      };
    }

    return {
      setApiUrl : setApiUrl,
      getIssueRoutes : getIssueRoutes
    }
  }

})();
