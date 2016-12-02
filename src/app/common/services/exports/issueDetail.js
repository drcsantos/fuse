// documentation: https://parall.ax/products/jspdf

(function() {
  angular.module("app.core").service("exportIssueDetail", exportIssueDetail);

  exportIssueDetail.$inject = ['$filter', 'imageData'];

  function exportIssueDetail($filter, imageData) {

    function exportPdf(data) {

//////////////////////////////////////////////////// config

      var doc = new jsPDF('p', 'pt', 'letter');

      var fileName = "Issue " + data.title + ".pdf";
      var offset = 0;

      var dateFilter = $filter('date');
      var filteredSubmitDate = dateFilter(data.submitDate, 'MMM d, yyyy');

      var dueDate = null;
      var coordsPerLetter = (610/84); // amount of page coordinates per letter in .length items

      console.log(data);

      if (data.due) {
        dueDate = dateFilter(moment(parseInt(data.currdue)).toDate(), 'MMM d, yyyy');
      }

      doc.setFontSize(20);
      doc.setTextColor(33, 33, 33);
      doc.setFont("courier");
      doc.setFontType("normal");
      doc.setLineWidth(1);

//////////////////////////////////////////////////// meta data

      doc.text(40, 40 + offset, data.title);
      doc.setFontSize(12);
      doc.text(40, 60 + offset, "Created by " + data.submitBy.name + " on " + filteredSubmitDate);
      offset += 12;

      doc.text(40, 72 + offset, "Status:");
      doc.text(170, 72 + offset, data.status);

      doc.text(40, 84 + offset, "Timeframe:");
      doc.text(170, 84 + offset, data.resolutionTimeframe);

      doc.text(40, 96 + offset, "Responsibe Party:");
      doc.text(170, 96 + offset, data.responsibleParty.name);

      if (data.due) {
        doc.text(40, 108 + offset, "Due Date:");
        doc.text(170, 108 + offset, dueDate);
        offset += 12;
      }

//////////////////////////////////////////////////// description

      doc.setFillColor(33, 150, 243);
      doc.roundedRect(
        188, // x position
        112 + offset, // y position | bigger is lower on page
        224, // x length
        18, // y height
        7, 7, // rounded corners
        'F'); // F filled | FD filled with borders


      createDots(590, 121, 420, doc, offset);
      createDots(180, 121, 30, doc, offset);

      doc.setFontType("bold");
      doc.text(260, 124 + offset, "Description");
      doc.setFontType("normal");

      var descriptionLength = 79; // characters per line
      var descLeftofPoint = 0; // shifts down the page?

      if (data.description.length > descriptionLength) {
        var numTimes = Math.floor(data.description.length / descriptionLength);

        for (var j = 0; j < numTimes; ++j) {
          var txt = "";

          doc.text(20, // x position
            (142 + offset) + // starting y position
            j * // number of lines
            12 + // coords per line
            descLeftofPoint, txt + data.description.substr(j * (descriptionLength), descriptionLength));
        }

        descLeftofPoint = numTimes * 12;
        offset += numTimes * 12;

      } else {
        doc.text(20, 142 + offset + descLeftofPoint, "" + data.description);
        offset += 12;
      }

//////////////////////////////////////////////////// checklists

      doc.setFillColor(33, 150, 243);
      doc.roundedRect(
        188, // x position
        148 + offset, // y position | bigger is lower on page
        224, // x length
        18, // y height
        7, 7, // rounded corners
        'F'); // F filled | FD filled with borders

      createDots(590, 157, 420, doc, offset); // right side dots
      createDots(180, 157, 30, doc, offset); // left side dots (x, y, end, doc, offset)
      // (how far to extend to the right X, how far down to start Y, how far to extend to the left X)

      doc.setFontType("bold");
      doc.text(268, 160 + offset, "Checklists");
      doc.setFontType("normal");

      if (data.checklists) {
        // Checklists and check items
        data.checklists.forEach(function(checklist) {

          doc.text(20, 178 + offset, checklist.checklistName + " created by " + checklist.author + " on " + dateFilter(checklist.createdOn, 'MMM d, yyyy'));
          offset += 12;

          //Go through each checkitem in checklist
          checklist.checkItems.forEach(function(checkitem) {
            if(checkitem.checked) {
              doc.rect(20, 170 + offset, 10, 10, 'F');
              doc.setDrawColor(255,255,255);
              doc.line(21, 175 + offset, 24, 178 + offset);
              doc.line(24, 178 + offset, 28, 171 + offset);
              doc.setDrawColor(0);

              doc.line(34, 176 + offset, 34 + (checkitem.name.length * coordsPerLetter), 176 + offset);
              doc.text(34, 178 + offset, checkitem.name);

              offset += 12;
            } else {
              doc.rect(20, 170 + offset, 10, 10);
              doc.text(34, 178 + offset, checkitem.name);

              offset += 12;
            }
          });
          offset += 12;
        });
      } else {
        doc.text(20, 178 + offset, "No Checklists Created");
        offset += 12;
      }

//////////////////////////////////////////////////// comments

      doc.setFillColor(33, 150, 243);
      doc.roundedRect(
        188, // x position
        184 + offset, // y position | bigger is lower on page
        224, // x length
        18, // y height
        7, 7, // rounded corners
        'F'); // F filled | FD filled with borders

      createDots(590, 193, 400, doc, offset); // right side dots
      createDots(180, 193, 30, doc, offset); // left side dots (x, y, end, doc, offset)
      // (how far to extend to the right X, how far down to start Y, how far to extend to the left X)

      doc.setFontType("bold");
      doc.text(278, 196 + offset, "Comments");
      doc.setFontType("normal");

      var commentLength = 78;
      var leftofPoint = 0;

      // for loop to grab all comments
      for (var i = 0; i < data.comments.length; ++i) {
        var comment = data.comments[i];

        console.log(comment);

        doc.text(20, 226 + offset + i * 36 + leftofPoint, comment.author.name + " on " + dateFilter(comment.createdOn, 'h:mm a MMM d, yyyy'));

        // if statement to determine if long
        if (comment.commentText.length > commentLength) {
          var numTimes = Math.floor(comment.commentText.length / commentLength);

          for (var j = 0; j < numTimes; ++j) {
            var txt = "";
            if (j === 0) {
              txt = "";
            }
            doc.text(20, 238 + offset + i * 36 + j * 12 + leftofPoint, txt + comment.commentText.substr(j * (commentLength), commentLength));
          }
          leftofPoint = numTimes * 12;
          offset += numTimes * 12;
        } else {
          doc.text(20, 238 + offset + i * 36 + leftofPoint, comment.commentText);
        }
      }

      doc.save(fileName);
    }

    // Helper functions to make blue dots
    function createDots(x, y, end, doc, offset) {

      var dots = [];
      var step = 10;

      if(end < x) {
        dots = _.range(end - step, x + step, step);
      } else {
        dots = _.range(x - step, end + step, step);
      }

      dots.forEach(function(pos) {
        doc.ellipse(pos, y + offset, 2, 2, 'F');
      });

    }


    return {
      exportPdf : exportPdf
    };

  }

})();
