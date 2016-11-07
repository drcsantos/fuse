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
      doc.text(40, 60, "Created by " + data.submitBy.name + " on " + filteredSubmitDate);
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


      createDots(580, 109, 420, doc, offset);
      // doc.ellipse(580, 109, 2, 2, 'F');
      // doc.ellipse(570, 109, 2, 2, 'F');
      // doc.ellipse(560, 109, 2, 2, 'F');
      // doc.ellipse(550, 109, 2, 2, 'F');
      // doc.ellipse(540, 109, 2, 2, 'F');
      // doc.ellipse(530, 109, 2, 2, 'F');
      // doc.ellipse(520, 109, 2, 2, 'F');
      // doc.ellipse(510, 109, 2, 2, 'F');
      // doc.ellipse(500, 109, 2, 2, 'F');
      // doc.ellipse(490, 109, 2, 2, 'F');
      // doc.ellipse(480, 109, 2, 2, 'F');
      // doc.ellipse(470, 109, 2, 2, 'F');
      // doc.ellipse(460, 109, 2, 2, 'F');
      // doc.ellipse(450, 109, 2, 2, 'F');
      // doc.ellipse(440, 109, 2, 2, 'F');
      // doc.ellipse(430, 109, 2, 2, 'F');
      // doc.ellipse(420, 109, 2, 2, 'F');

      // center
      createDots(180, 109, 20, doc, offset);

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


      createDots(580, 145, 420, doc, offset);

      // center
      createDots(180, 145, 20, doc, offset);

      doc.text(268, 148 + offset, "Comments");


      var commentLength = 78;
      var leftofPoint = 0;

      // for loop to grab all comments
      for (var i = 0; i < data.comments.length; ++i) {
        var comment = data.comments[i];

        console.log(comment);

        doc.text(20, 166 + offset + i * 36 + leftofPoint, comment.author.name + " on " + dateFilter(comment.createdOn, 'MMMM d, yyyy'));

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
