// documentation: https://parall.ax/products/jspdf

(function() {
  angular.module("app.core").service("exportResidentCensus", exportResidentCensus);

  exportResidentCensus.$inject = ['$filter'];

  function exportResidentCensus($filter) {

    function exportPdf(inBuildingResidents) {

      var doc = new jsPDF('p', 'pt');

      // date filtering
      var dateFilter = $filter('date');
      var exportDate = Date.now();
      var filteredExportDate = dateFilter(exportDate, 'MMM d, yyyy');
      var filteredbirthDate = "";

      // export config
      doc.setFont("courier");
      doc.setFontType("normal");
      doc.setFontSize(12);
      doc.setLineWidth(1);
      doc.setDrawColor(33,33,33);

      //sort by room number
      inBuildingResidents = _.sortBy(inBuildingResidents, ['room']);

      // config variables
      var metaStartX = 215;
      var metaStartY = 24;
      var listStartX = 14;
      var listStartY = 150;
      var spaceBetweenWords = 10; // horizontal spacing between the words
      var spaceBetweenResidents = 20; // vertical spacing down the page between entries
      var coordsPerLetter = (594/82); // amount of page coordinates per letter in .length items
      var numberOfWords = 1;
      var aliasLength = 0;
      var roomX = 350; // horizontal position of the room numbers row
      var birthDateX = 450; // horizontal position of the date of birth row

      //number of resident rows before new page is created
      var newPageRows = 16;

      var increment = 0;

      // export date
      doc.text("Exported on", 10, metaStartY);
      doc.text(filteredExportDate + " ", 10, metaStartY + 16);

      // community logo
      doc.rect(110, 10, 100, 100);
      doc.text("place holder", 120, 50);
      doc.text("for logo", 120, 62);

      // community info
      doc.text("Phone", metaStartX, metaStartY);
      doc.text("(719) 587-3514", 275, metaStartY);

      doc.text("Fax", metaStartX, metaStartY * 2);
      doc.text("(719) 589-3614", 275, metaStartY * 2);

      doc.text("Address", metaStartX, metaStartY * 3);
      doc.text("3407 Carroll St Alamoa CO, 81101", 275, metaStartY * 3);

      doc.text("Website", metaStartX, metaStartY * 4);
      doc.text("AlamosaBridge.com", 275, metaStartY * 4);

      doc.text("Name", listStartX, listStartY - 20);
      doc.text("Room", roomX, listStartY - 20);
      doc.text("Date of Birth", birthDateX, listStartY - 20);

      // loop for all the residents
      angular.forEach(inBuildingResidents, function(resident, i) {

       filteredbirthDate = dateFilter(resident.birthDate, 'MMMM d, yyyy');

       //draw line on every third resident
       if((i+1) % 3 === 0) {
         doc.setLineWidth(16);
         doc.setDrawColor(224,224,224);
         doc.line(10,
           listStartY - 3 + (increment*spaceBetweenResidents),
           570,
           listStartY - 3 + (increment*spaceBetweenResidents));
       }

        //creates a new page after newPageRows (first time it's 15 later 20)
        if(((increment+1) % newPageRows === 0)) {
          newPageRows = 20;
          listStartX = 14;
          listStartY = 20;

          increment = 0;

          doc.addPage();
        }

        doc.text(resident.firstName,
          listStartX,
          listStartY + (increment*spaceBetweenResidents));

        if(resident.aliasName) {
          doc.text("\"" + resident.aliasName + "\"",
            listStartX + ((resident.firstName.length) * coordsPerLetter) + spaceBetweenWords,
            listStartY + (increment*spaceBetweenResidents));
          numberOfWords = 2;
          aliasLength = (resident.aliasName.length + 2);
        } else {
          resident.aliasName = "";
          numberOfWords = 1;
          aliasLength = 0;
        }

        doc.text(resident.lastName,
          listStartX + ((resident.firstName.length * coordsPerLetter) + (aliasLength * coordsPerLetter)) + (spaceBetweenWords * numberOfWords),
          listStartY + (increment*spaceBetweenResidents));

        doc.text(resident.room.toString(),
          roomX,
          listStartY + (increment*spaceBetweenResidents));

        doc.text(filteredbirthDate,
          birthDateX,
          listStartY + (increment*spaceBetweenResidents));

        increment++;

      });

      doc.save("ResidentCensus.pdf");

    }

    return {
      exportPdf : exportPdf
    };

  }

})();
