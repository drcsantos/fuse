(function() {
  angular.module("app.core").service("exportFaceSheet", exportFaceSheet);

  exportFaceSheet.$inject = ['$filter'];

  function exportFaceSheet($filter) {

    function calculateOffset(doc, fullSpace, halfSpace, config) {

      var positionY = (config.startY + (fullSpace * config.fullSpaceOffset) +
                                       (halfSpace * config.halfSpaceOffset));

      // create a new page and reset the offsets
      if(positionY > doc.internal.pageSize.height) {
        doc.addPage();

        config.fullSpaceOffset = 0;
        config.halfSpaceOffset = 0;

      }

      return positionY;
    }

    function exportPdf(data) {

      var doc = new jsPDF('p', 'pt');

      // date config
      var residentBirthDate = new Date(data.birthDate);
      var residentAdmissionDate = new Date(data.admissionDate);
      var exportDate = Date.now();
      var dateFilter = $filter('date');
      var residentFilteredBirthDate = dateFilter(residentBirthDate, 'MMMM d, yyyy');
      var residentFilteredAdmissionDate = dateFilter(residentAdmissionDate, 'MMMM d, yyyy');
      var filteredExportDate = dateFilter(exportDate, 'MMM d, yyyy');


      // export config
      doc.setFont("courier");
      doc.setFontType("normal");
      doc.setFontSize(12);
      doc.setLineWidth(1);

      // config variables
      var coordsPerLetter = (594/82); // amount of page coordinates per letter in .length items
      var metaX = 215;
      var nonMetaStartY = 420;
      var offsetFromLabel = 120;
      var textLength = 460; //px per line
      var splitText;

      var fullSpace = 24;
      var halfSpace = 16;

      var config = {
        startX : 15,
        startY : 24,
        fullSpaceOffset : 0,
        halfSpaceOffset : 0
      };

      var calculateY = calculateOffset.bind(this, doc, fullSpace, halfSpace);

      var positionY = calculateY(config);
      var positionX = config.startX;

      // export date
      doc.text("Exported on", positionX, positionY);

      config.halfSpaceOffset++;
      positionY = calculateY(config);
      doc.text(filteredExportDate.toString(), positionX, positionY);

      // community logo
      doc.rect(110, 10, 100, 100);
      doc.text("place holder", 120, 50);
      doc.text("for logo", 120, 62);

      // community information
      positionX = metaX;
      config.halfSpaceOffset = 0;
      positionY = calculateY(config);
      //doc.text(data.communityName, positionX, positionY);

      config.fullSpaceOffset++;
      positionX = metaX;
      positionY = calculateY(config);
      doc.text("Phone: ", positionX, positionY);
      positionX = metaX + offsetFromLabel;
      //doc.text(data.community.phone, positionX, positionY);

      config.halfSpaceOffset++;
      positionX = metaX;
      positionY = calculateY(config);
      doc.text("Fax: ", positionX, positionY);
      positionX = metaX + offsetFromLabel;
      //doc.text(data.community.fax, positionX, positionY);

      config.halfSpaceOffset++;
      positionX = metaX;
      positionY = calculateY(config);
      doc.text("Address: ", positionX, positionY);
      positionX = metaX + offsetFromLabel;
      //doc.text(data.community.address, positionX, positionY);

      config.halfSpaceOffset++;
      positionX = metaX;
      positionY = calculateY(config);
      doc.text("Website: ", positionX, positionY);
      positionX = metaX + offsetFromLabel;
      //doc.text(data.community.website, positionX, positionY);

      doc.addPage();

      // used for calculating the coordinates per letter
      doc.text(" 0         1         2         3          4        5         6         7         8", 0, 180);
      doc.text("012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789", 0, 200);
      doc.text("550", 550, 220);
      doc.text("560", 560, 240);
      doc.text("570", 570, 260);
      doc.text("580", 580, 280);
      doc.text("590", 590, 300);
      doc.text("591", 591, 320);
      doc.text("592", 592, 340);
      doc.text("593", 593, 360);
      doc.text("594", 594, 380);

      // used for calculating the coordinates per letter
      doc.text(" 0         1         2         3          4        5         6         7         8", 0, 380);
      doc.text("012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789", 0, 400);
      doc.text("600", 600, 420);
      doc.text("601", 601, 440);
      doc.text("602", 602, 460);
      doc.text("603", 603, 480);
      doc.text("604", 604, 500);
      doc.text("605", 605, 520);
      doc.text("606", 606, 540);
      doc.text("607", 607, 560);
      doc.text("608", 608, 580);
      doc.text("609", 609, 600);
      doc.text("610", 610, 620);







      doc.save(data.firstName + " " + data.lastName + " Face Sheet.pdf");
    }

    return {
      exportPdf : exportPdf
    };

  }

})();
