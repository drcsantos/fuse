// documentation: https://parall.ax/products/jspdf

(function() {
  angular.module("app.core").service("exportResidentCensus", exportResidentCensus);

  exportResidentCensus.$inject = ['$filter'];

  function exportResidentCensus($filter) {

    function findRoomStyle(roomStyle, roomNumber) {

      for(var i = 0; i < roomStyle.length; ++i) {
        if(roomStyle[i].rooms.indexOf(roomNumber.toString()) !== -1) {
          return roomStyle[i].name;
        }
      }

      return "";
    }

    function calculateRange(allRooms, start, end) {

      var sortedRooms = _.sortBy(allRooms, function(room) {
        return +(room.replace(/\D/g, ''));
      });

      var roomsInRange = [];
      var counting = false;

      //if the start value is bigger swith it's places
      if(parseInt(start) > parseInt(end)) {
        var tmp = end;
        end = start;
        start = tmp;
      }

      sortedRooms.forEach(function(room) {
        if(room === start) {
          counting = true;
        }

        if(counting) {
          roomsInRange.push(room);
        }

        if(room === end) {
          counting = false;
        }

      });

      return roomsInRange;

    }

    function createAcronym(community, room) {
      var capAcronym = "";
      var roomStyleName = room;

      var matchedAcronym = roomStyleName.match(/\b(\w)/g);

      if(matchedAcronym) {
        capAcronym = matchedAcronym.join('').toUpperCase();
      }

      return capAcronym;
    }

    function exportPdf(inBuildingResidents, community) {

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

      var allRooms = _.flatten(_.map(community.roomStyle, "rooms"));

      // export date
      doc.text("Exported on", 10, metaStartY);
      doc.text(filteredExportDate + " ", 10, metaStartY + 16);

      // community logo
      doc.rect(110, 10, 100, 100);
      doc.text("place holder", 120, 50);
      doc.text("for logo", 120, 62);

      // community info
      if(community.phone) {
        doc.text("Phone", metaStartX, metaStartY);
        doc.text(community.phone, 275, metaStartY);
      }

      if(community.fax) {
        doc.text("Fax", metaStartX, metaStartY * 2);
        doc.text(community.fax, 275, metaStartY * 2);
      }

      if(community.address) {
        doc.text("Address", metaStartX, metaStartY * 3);
        doc.text(community.address, 275, metaStartY * 3);
      }

      if(community.website) {
        doc.text("Website", metaStartX, metaStartY * 4);
        doc.text(community.website, 275, metaStartY * 4);
      }

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

        var capAcronym = createAcronym(community, findRoomStyle(community.roomStyle, resident.room));

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

      // Community rooms

      var residentOffset = residentBlock * increment;
      var floorOffset = 0;
      var floorNumber = 0;

      var maxRoomNumber = 0;

      if(community.floors) {
        angular.forEach(community.floors, function(floor) {

          var roomRange = calculateRange(allRooms, floor.startRoom, floor.endRoom) || [];

          //calculate max room nums so we can offset to new rows
          if(roomRange.length > maxRoomNumber) {
            maxRoomNumber = roomRange.length;
          }

          // if we are over 3 floors go to next row
          if((floorOffset % 3) == 0 && floorOffset !== 0) {
            listStartY += (100 * maxRoomNumber);
            floorOffset = 0;
            maxRoomNumber = 0;
          }

          //draw room floor title
          doc.text("Floor " + (floorNumber + 1), listStartX + (floorOffset * 170), (listStartY + residentOffset));

          // Go through each room in current floor
          for(var i = 0; i < roomRange.length; ++i) {
            var x = listStartX + (floorOffset * 170);
            var y = (listStartY + residentOffset + 10) + (i * 90);

            doc.text("Room " + roomRange[i], x + 30, y + 40);

            var style = findRoomStyle(community.roomStyle, parseInt(roomRange[i]));
            var styleAcronym = createAcronym(community, style);

            doc.text("Style " + styleAcronym, x + 30, y + 60);

            doc.rect(x, y, 160, 80);
          }

          floorOffset++;
          floorNumber++;

        });
      }

      doc.save("ResidentCensus.pdf");

    }

    return {
      exportPdf : exportPdf
    };

  }

})();
