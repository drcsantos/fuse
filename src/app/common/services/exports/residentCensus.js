// documentation: https://parall.ax/products/jspdf

(function() {
  angular.module("app.core").service("exportResidentCensus", exportResidentCensus);

  exportResidentCensus.$inject = [];

  function exportResidentCensus() {

    function exportPdf(inBuildingResidents) {

      var doc = new jsPDF('p', 'pt');

      // config variables
      var startX = 14;
      var startY = 30;
      var spaceBetweenWords = 10; // horizontal spacing between the words
      var spaceBetweenResidents = 20; // vertical spacing down the page between entries
      var coordsPerLetter = 7.2439; // amount of page coordinates per letter in .length items

      // export config
      doc.setFont("courier");
      doc.setFontType("normal");
      doc.setFontSize(12);

      // loop for all the residents
      angular.forEach(inBuildingResidents, function(resident, i) {
        doc.text(resident.firstName,
          startX,
          startY + (i*spaceBetweenResidents));

        doc.text(resident.aliasName,
          startX + (resident.firstName.length * coordsPerLetter) + spaceBetweenWords,
          startY + (i*spaceBetweenResidents));

        doc.text(resident.lastName,
          startX + ((resident.firstName.length * coordsPerLetter) + (resident.aliasName.length * coordsPerLetter)) + (spaceBetweenWords * 2),
          startY + (i*spaceBetweenResidents));
      });

      doc.save("ResidentCensus.pdf");

    }

    return {
      exportPdf : exportPdf
    };

  }

})();
