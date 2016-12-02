(function() {
  angular.module("app.core").service("exportFaceSheet", exportFaceSheet);

  exportFaceSheet.$inject = [];

  function exportFaceSheet() {

    function exportPdf(resident) {

      var doc = new jsPDF('p', 'pt');

      // export config
      doc.setFont("courier");
      doc.setFontType("normal");
      doc.setFontSize(12);

      // config variables
      var startX = 0;
      var startY = 0;
      var spaceBetweenLines = 12;

      doc.text(resident.firstName, 100, 50);
      doc.text(resident.lastName, 100, 75);

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







      doc.save(resident.firstName + " " + resident.lastName + " Face Sheet.pdf");
    }

    return {
      exportPdf : exportPdf
    };

  }

})();
