// documentation: https://parall.ax/products/jspdf

(function() {
  angular.module("app.core").service("exportResidentCensus", exportResidentCensus);

  exportResidentCensus.$inject = ['$filter'];

  function exportResidentCensus($filter) {

    function exportPdf(inBuildingResidents) {

      var doc = new jsPDF('p', 'pt');

      var dateFilter = $filter('date');
      // var filteredbirthDate = dateFilter(resident.birthDate, 'MMMM d, yyyy');

      // export config
      doc.setFont("courier");
      doc.setFontType("normal");
      doc.setFontSize(12);

      // config variables
      var startX = 14;
      var startY = 40;
      var spaceBetweenWords = 10; // horizontal spacing between the words
      var spaceBetweenResidents = 20; // vertical spacing down the page between entries
      var coordsPerLetter = 7.2439; // amount of page coordinates per letter in .length items
      var roomX = 200; // horizontal position of the room numbers row

      doc.text("Name", startX, startY - 20);
      doc.text("Room", roomX, startY - 20);

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

        doc.text(resident.room + " ",
          roomX,
          startY + (i*spaceBetweenResidents));
      });

      doc.save("ResidentCensus.pdf");

    }

    return {
      exportPdf : exportPdf
    };

  }

})();
