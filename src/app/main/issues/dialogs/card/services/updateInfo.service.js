(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .service('UpdateInfoService', UpdateInfoService);


    /** @ngInject */
    function UpdateInfoService(apilaData, authentication) {


      var update = "";
      var issueid = "";


      /**
      * Gets an array of updateFields and formates them from proper display
      */
      function formatUpdateArray(updateInfo, updatedBy, updateDate, ipAddress) {
        _.forEach(updateInfo, function(v, k) {
          v.infoFormated = " changed " + v.field +
                            " from " + v.old + " to " + v.new;

          v.userName = updatedBy.name;
          v.ipAddress = ipAddress;

          v.userImage = updatedBy.userImage || authentication.getUserImage();


         if(v.field === "name") {
           v.field = "title";
         }

         //formating for members
         if(v.field === "members") {
           if(v.old === "") {
             v.infoFormated =  "added " + v.new + " as a Member";
           } else {
             v.infoFormated =  "removed " + v.old + " as a Member";
           }
         }

         //formating for attachemnts
         if(v.field === "attachments") {
           if(v.old === "") {
             v.infoFormated =  " added a ." + v.new  + " Attachment";
             v.tooltip = v.new;
           } else {
             v.infoFormated =  " removed a ." + v.old + " Attachment";
             v.tooltip = v.old;
           }
         }

         //formating for labels
         if(v.field === "labels") {
           if(v.old === "") {
             v.infoFormated =  "added the " + v.new + " label";
           } else {
             v.infoFormated =  "removed the " + v.old + " label";
           }
         }

         //formating for checklists
         if(v.field === "checklists") {
           if(v.old === "") {
             v.infoFormated =  " created the " + v.new + " Checklist";
           } else {
             v.infoFormated =  " removed the " + v.old + " Checklist";
           }
         }

         //formating for checklists item
         if(v.field === "checkitem") {
           if(v.old === "") {
             v.firstPart =  " added a ";
             v.checklist = "Checklist";
             v.secondPart =  "item to " + v.new;
             v.differentLayout = true;

           } else {
             v.infoFormated =  " removed a Checklist item in " + v.old;
           }
         }

         if(v.field === "checklist_name") {
           v.infoFormated =  " changed a checklist title - ";
           v.oldTip = "old";
           v.newTip = "new";
         }

         if(v.field === "checkitem_remove") {
             v.firstPart =  " removed a ";
             v.checklist = "Checklist";
             v.secondPart =  " item in " + v.old;
             v.differentLayout = true;
         }

         if(v.field === "checkitem_change") {
           v.infoFormated = " changed a checklist item - ";
           v.oldTip = "old";
           v.newTip = "new";
         }

         if(v.field === "checkitem_checked") {
              v.firstPart =  " completed a ";
              v.checklist = "Checklist";
              v.secondPart = " item in " + v.new;
              v.differentLayout = true;
         }

         if(v.field === "checkitem_unchecked") {
             v.firstPart =  " uncompleted a ";
             v.checklist = "Checklist";
             v.secondPart = " item in " + v.new;
             v.differentLayout = true;
         }

         if(v.field === "comments") {
           if(v.old === "") {
             v.infoFormated =  " created a Comment ";
             v.tooltip = v.new;
             v.multiline = true;
           }
         }

         if(v.field === "due") {
           if(v.old === "") {
             v.infoFormated = " set a Due Date ";
             v.tooltip = moment(+v.new).format('MMMM Do YYYY');
           } else {
             v.infoFormated =  " removed a Due Date ";
             v.tooltip = moment(+v.old).format('MMMM Do YYYY');
           }
         }

         if(v.field === "status") {
           v.infoFormated =  " changed the issue status to " + v.new ;
         }

         if(v.field === "downloaded") {
           v.infoFormated = "downloaded a " + v.new + " Attachment";
         }

         if(v.field === "plan-create") {
           v.infoFormated =  " created a Plan";
           v.tooltip = v.new;
           v.multiline = true;
         }

         if(v.field === "plan-todo") {
           v.infoFormated =  " crated a Plan and added it to their To-Do";
           v.tooltip = v.new;
           v.multiline = true;
         }


         if(v.field === "description" || v.field === "title" || v.field === "resolutionTimeframe"
         || v.field === "comment" || v.field === "responsibleParty" || v.field === "plan") {
           v.infoFormated =  " changed the " + _.startCase(v.field) + " - ";
           v.oldTip = "old";
           v.newTip = "new";
         }

         if(v.field === "export") {
           v.infoFormated = " downloaded " + v.new;
         }

         v.timeDiff = timeDiff(updateDate);

        });

        return updateInfo;
      }

      function setData(issueId, updateInfo) {
        update = updateInfo;
        issueid = issueId;
      }

      function addUpdateInfo(checktooltip, fieldName, newField, oldField, finished) {

        var updateInfo = {
          updateBy : authentication.currentUser().id,
          updateDate : new Date(),
          updateField : [{
            "field": fieldName,
            "new": newField,
            "old": oldField,
            "checktooltip": checktooltip
          }]
        };

        if(updateInfo) {
          apilaData.addUpdateInfo(issueid, updateInfo)
          .success(function(u) {

            updateInfo.updateBy = {
              'name' : authentication.currentUser().name,
              'userImage' : authentication.getUserImage()
            };
            update.push(updateInfo);

            if(finished) {
              finished(true);
            }

          })
          .error(function(err) {
            console.log(err);
            if(finished) {
              finished(false);
            }
          });
        }

      }

      function timeDiff(date) {
        var start = moment(date);
        var end = moment();

        var duration = moment.duration(end.diff(start));

        if(duration.asSeconds() < 60) {
          return Math.floor(duration.asSeconds()) + " seconds ago";
        } else if(duration.asMinutes() < 60) {
          return Math.floor(duration.asMinutes()) + " minutes ago";
        } else if(duration.asHours() < 24) {
          return Math.floor(duration.asHours()) + " hours ago";
        } else if(duration.asDays() < 31) {
          return Math.floor(duration.asDays()) + " days ago";
        } else if(duration.asMonths() < 12) {
          return Math.floor(duration.asMonths()) + " months ago";
        } else {
          return Math.floor(duration.asYears()) + " years ago";
        }

      }

      return {
        formatUpdateArray : formatUpdateArray,
        addUpdateInfo : addUpdateInfo,
        setData : setData,
        timeDiff : timeDiff
      };
    }

})();
