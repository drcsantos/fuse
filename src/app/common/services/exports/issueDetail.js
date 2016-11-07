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
      var filteredSubmitDate = dateFilter(data.submitDate, 'MMMM d, yyyy');
      var filteredCommentSubmitDate = dateFilter(data.comments.createdOn, 'MMMM d, yyyy');

      if (data.due) {
        var dueDate = dateFilter(new Date(data.due), 'MMM d, yyyy');
      }

      doc.setFontSize(20);
      doc.setTextColor(33, 33, 33);
      doc.setFont("courier");
      doc.setFontType("bold");
      doc.setLineWidth(25);

//////////////////////////////////////////////////// meta data

      doc.text(40, 40, data.title);
      doc.setFontSize(12);
      doc.text(40, 60, "Created by " + data.submitBy + " on " + filteredSubmitDate);
      doc.text(40, 72, "Status: " + data.status);
      doc.text(40, 84, "Timeframe: " + data.resolutionTimeframe);

//////////////////////////////////////////////////// description

      doc.setFillColor(33, 150, 243);
      doc.roundedRect(
        188, // x position
        100, // y position | bigger is lower on page
        224, // x length
        18, // y height
        7, 7, // rounded corners
        'F'); // F filled | FD filled with borders

      doc.ellipse(580, 109, 2, 2, 'F');
      doc.ellipse(570, 109, 2, 2, 'F');
      doc.ellipse(560, 109, 2, 2, 'F');
      doc.ellipse(550, 109, 2, 2, 'F');
      doc.ellipse(540, 109, 2, 2, 'F');
      doc.ellipse(530, 109, 2, 2, 'F');
      doc.ellipse(520, 109, 2, 2, 'F');
      doc.ellipse(510, 109, 2, 2, 'F');
      doc.ellipse(500, 109, 2, 2, 'F');
      doc.ellipse(490, 109, 2, 2, 'F');
      doc.ellipse(480, 109, 2, 2, 'F');
      doc.ellipse(470, 109, 2, 2, 'F');
      doc.ellipse(460, 109, 2, 2, 'F');
      doc.ellipse(450, 109, 2, 2, 'F');
      doc.ellipse(440, 109, 2, 2, 'F');
      doc.ellipse(430, 109, 2, 2, 'F');
      doc.ellipse(420, 109, 2, 2, 'F');
      // center
      doc.ellipse(180, 109, 2, 2, 'F');
      doc.ellipse(170, 109, 2, 2, 'F');
      doc.ellipse(160, 109, 2, 2, 'F');
      doc.ellipse(150, 109, 2, 2, 'F');
      doc.ellipse(140, 109, 2, 2, 'F');
      doc.ellipse(130, 109, 2, 2, 'F');
      doc.ellipse(120, 109, 2, 2, 'F');
      doc.ellipse(110, 109, 2, 2, 'F');
      doc.ellipse(100, 109, 2, 2, 'F');
      doc.ellipse(90,  109, 2, 2, 'F');
      doc.ellipse(80, 109, 2, 2, 'F');
      doc.ellipse(70, 109, 2, 2, 'F');
      doc.ellipse(60, 109, 2, 2, 'F');
      doc.ellipse(50, 109, 2, 2, 'F');
      doc.ellipse(40, 109, 2, 2, 'F');
      doc.ellipse(30, 109, 2, 2, 'F');
      doc.ellipse(20, 109, 2, 2, 'F');
      doc.text(260, 112, "Description");

      var descriptionLength = 78; // characters per line
      var descLeftofPoint = 0; // shifts down the page?

      if (data.description.length > descriptionLength) {
        var numTimes = Math.floor(data.description.length / descriptionLength);

        for (var j = 0; j < numTimes; ++j) {
          var txt = "";

          doc.text(20, // x position
            130 + // starting y position
            j * // number of lines
            12 + // coords per line
            descLeftofPoint, txt + data.description.substr(j * (descriptionLength), descriptionLength));
        }

        descLeftofPoint = numTimes * 12;
        offset = numTimes * 12;

      } else {
        doc.text(20, 130 + descLeftofPoint, "" + data.description);
        offset = 12;
      }

//////////////////////////////////////////////////// comments

      doc.setFillColor(33, 150, 243);
      doc.roundedRect(
        188, // x position
        136 + offset, // y position | bigger is lower on page
        224, // x length
        18, // y height
        7, 7, // rounded corners
        'F'); // F filled | FD filled with borders

      doc.ellipse(580, 145 + offset, 2, 2, 'F');
      doc.ellipse(570, 145 + offset, 2, 2, 'F');
      doc.ellipse(560, 145 + offset, 2, 2, 'F');
      doc.ellipse(550, 145 + offset, 2, 2, 'F');
      doc.ellipse(540, 145 + offset, 2, 2, 'F');
      doc.ellipse(530, 145 + offset, 2, 2, 'F');
      doc.ellipse(520, 145 + offset, 2, 2, 'F');
      doc.ellipse(510, 145 + offset, 2, 2, 'F');
      doc.ellipse(500, 145 + offset, 2, 2, 'F');
      doc.ellipse(490, 145 + offset, 2, 2, 'F');
      doc.ellipse(480, 145 + offset, 2, 2, 'F');
      doc.ellipse(470, 145 + offset, 2, 2, 'F');
      doc.ellipse(460, 145 + offset, 2, 2, 'F');
      doc.ellipse(450, 145 + offset, 2, 2, 'F');
      doc.ellipse(440, 145 + offset, 2, 2, 'F');
      doc.ellipse(430, 145 + offset, 2, 2, 'F');
      doc.ellipse(420, 145 + offset, 2, 2, 'F');
      // center
      doc.ellipse(180, 145 + offset, 2, 2, 'F');
      doc.ellipse(170, 145 + offset, 2, 2, 'F');
      doc.ellipse(160, 145 + offset, 2, 2, 'F');
      doc.ellipse(150, 145 + offset, 2, 2, 'F');
      doc.ellipse(140, 145 + offset, 2, 2, 'F');
      doc.ellipse(130, 145 + offset, 2, 2, 'F');
      doc.ellipse(120, 145 + offset, 2, 2, 'F');
      doc.ellipse(110, 145 + offset, 2, 2, 'F');
      doc.ellipse(100, 145 + offset, 2, 2, 'F');
      doc.ellipse(90,  145 + offset, 2, 2, 'F');
      doc.ellipse(80, 145 + offset, 2, 2, 'F');
      doc.ellipse(70, 145 + offset, 2, 2, 'F');
      doc.ellipse(60, 145 + offset, 2, 2, 'F');
      doc.ellipse(50, 145 + offset, 2, 2, 'F');
      doc.ellipse(40, 145 + offset, 2, 2, 'F');
      doc.ellipse(30, 145 + offset, 2, 2, 'F');
      doc.ellipse(20, 145 + offset, 2, 2, 'F');
      doc.text(268, 148 + offset, "Comments");


      var commentLength = 78;
      var leftofPoint = 0;

      // for loop to grab all comments
      for (var i = 0; i < data.comments.length; ++i) {
        var comment = data.comments[i];

        doc.text(20, 166 + offset + i * 36 + leftofPoint, comment.author + " on " + filteredCommentSubmitDate);

        // if statement to determine if long
        if (comment.commentText.length > commentLength) {
          var numTimes = Math.floor(comment.commentText.length / commentLength);

          for (var j = 0; j < numTimes; ++j) {
            var txt = "";
            if (j === 0) {
              txt = "";
            }
            doc.text(20, 178 + offset + i * 36 + j * 12 + leftofPoint, txt + comment.commentText.substr(j * (commentLength), commentLength));
          }
          leftofPoint = numTimes * 12;
        } else {
          doc.text(20, 178 + offset + i * 36 + leftofPoint, comment.commentText);
        }
      }

      doc.save(fileName);

    }


    return {
      exportPdf : exportPdf
    };

  }

})();
