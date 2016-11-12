(function() {
  angular.module("app.core").service("exportFaceSheet", exportFaceSheet);

  exportFaceSheet.$inject = [];

  function exportFaceSheet() {

    function exportPdf(resident) {

      var doc = new jsPDF('p', 'pt');

      doc.setFont("courier");
      doc.setFontType("normal");
      doc.setFontSize(12);

      doc.text("First name: " + resident.firstName, 100, 50);
      doc.text("Last name: " + resident.lastName, 100, 75);

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






      doc.save(resident.firstName + " " + resident.lastName + " Face Sheet.pdf");
    }

    return {
      exportPdf : exportPdf
    };

  }

})();
