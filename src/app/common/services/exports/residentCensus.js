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

      var filteredbirthDate1 = "";
      var filteredbirthDate2 = "";
      var filteredbirthDate3 = "";

      // export config
      doc.setFont("courier");
      doc.setFontType("normal");
      doc.setFontSize(12);
      doc.setLineWidth(1);
      doc.setDrawColor(33,33,33);

      //sort by room number
      inBuildingResidents = _.sortBy(inBuildingResidents, ['room']);

      // config variables
      var coordsPerLetter = (594/82);
      var metaStartX = 215;
      var metaStartY = 24;
      var listStartX = 14;
      var listStartY = 150;

      var residentBlock = 42;
      var verticalOffset;
      var horizontalOffset;

      //number of resident rows before new page is created
      var newPageRows = 36;

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
      doc.text("3407 Carroll St Alamosa CO, 81101", 275, metaStartY * 3);

      doc.text("Website", metaStartX, metaStartY * 4);
      //doc.text("AlamosaBridge.com", 275, metaStartY * 4);
      doc.text(data.community.website, 275, metaStartY * 4);

      angular.forEach(inBuildingResidents, function(resident, i) {
        filteredbirthDate1 = dateFilter(resident.birthDate, 'MMM');
        filteredbirthDate2 = dateFilter(resident.birthDate, 'dd');
        filteredbirthDate3 = dateFilter(resident.birthDate, 'yyyy');

        //creates a new page after newPageRows
        if(((increment+1) % newPageRows === 0)) {
          newPageRows = 42; // number of entries on remaining pages
          listStartX = 14;
          listStartY = 20;

          increment = 0;

          doc.addPage();
        }

        //draw line on every third resident
        if((i+1) % 3 === 0) {
          doc.setLineWidth(16);
          doc.setDrawColor(224,224,224);
          doc.line(10,
            listStartY - 3 + (residentBlock * increment),
            585,
            listStartY - 3 + (residentBlock * increment));
        }

        if(resident.aliasName) {
          doc.text(resident.aliasName.slice(0, 12),
            listStartX,
            listStartY + (residentBlock * increment));
        } else {
          doc.text(resident.firstName.slice(0, 12),
            listStartX,
            listStartY + (residentBlock * increment));
        }

        if(resident.middleName) {
          doc.text(resident.middleName.slice(0, 12),
            listStartX,
            listStartY + 10 + (residentBlock * increment));
        } else {
          resident.middleName = "";
        }

        if(resident.lastName) {
          doc.text(resident.lastName.slice(0, 12),
            listStartX,
            listStartY + 20 + (residentBlock * increment));
        } else {
          resident.lastName = "";
        }

        if(resident.birthDate) {
          doc.text(filteredbirthDate1,
            listStartX + (14 * coordsPerLetter),
            listStartY + (residentBlock * increment));
          doc.text(filteredbirthDate2,
            listStartX + (14 * coordsPerLetter),
            listStartY + 10 + (residentBlock * increment));
          doc.text(filteredbirthDate3,
            listStartX + (14 * coordsPerLetter),
            listStartY + 20 + (residentBlock * increment));
        } else {
          resident.birthDate = "";
        }

        var string = "one Bedroom Deluxe";
        var matches = string.match(/\b(\w)/g);
        var acronym = matches.join('');
        var capAcronym = acronym.toUpperCase();

        if (resident.room) {
          doc.text(capAcronym.slice(0, 4),
            listStartX + (20 * coordsPerLetter),
            listStartY + (residentBlock * increment));
          doc.text(resident.room.slice(0, 4),
            listStartX + (20 * coordsPerLetter),
            listStartY + 10 + (residentBlock * increment));
        } else {
          resident.room = "";
        }

        increment++;

      });

      doc.save("ResidentCensus.pdf");

    }

    return {
      exportPdf : exportPdf
    };

  }

})();
