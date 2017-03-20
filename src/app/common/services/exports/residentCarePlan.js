// documentation: https://parall.ax/products/jspdf

(function() {
  angular.module("app.core").service("exportCarePlan", exportCarePlan);

  exportCarePlan.$inject = ['$filter', 'imageData', 'graphs'];

  function exportCarePlan($filter, imageData, graphs) {


    function multilineText(doc, textArr, x, y, config) {

      var offset = 0;
      var newPage = false;

      textArr.forEach(function(textLine) {
        doc.text(x, y + offset, textLine);
        offset += 12;

        // if y goes over page height create new page and reset coords
        if (y + offset > 780) {
          doc.addPage();
          newPage = true;

          config.fullSpaceOffset = 0;
          config.halfSpaceOffset = 0;
          config.startY = 24;
          y = 24;
          offset = 0;
        }
      });

      config.startY = y + offset + 5;

      var calculatedY  = calculateOffset(doc, 24, 16, config);

      //if there are offsets substract for Y to take that in account
      if(calculatedY !== config.startY) {
        var diff = (calculatedY - config.startY);
        config.startY -= diff;
      }

    };

    function calculateOffset(doc, fullSpace, halfSpace, config, textLength) {

      var positionY = (config.startY + (fullSpace * config.fullSpaceOffset) +
        (halfSpace * config.halfSpaceOffset));

      // create a new page and reset the offsets
      if (positionY > doc.internal.pageSize.height) {
        doc.addPage();

        config.fullSpaceOffset = 0;
        config.halfSpaceOffset = 0;
        config.startY = 24;

        positionY = (config.startY + (fullSpace * config.fullSpaceOffset) +
          (halfSpace * config.halfSpaceOffset));
      }

      return positionY;
    }

    function exportPdf(data) {

      var doc = new jsPDF('p', 'pt', 'letter');
      var fileName = data.firstName + ' ' + data.lastName + ' Care Plan.pdf';

      // date config
      var residentBirthDate = new Date(data.birthDate);
      var residentAdmissionDate = new Date(data.admissionDate);
      var exportDate = Date.now();
      var dateFilter = $filter('date');
      var residentFilteredBirthDate = dateFilter(residentBirthDate, 'MMMM d, yyyy');
      var residentFilteredAdmissionDate = dateFilter(residentAdmissionDate, 'MMMM d, yyyy');
      var filteredExportDate = dateFilter(exportDate, 'MMM d, yyyy');

      if (data.insideApartment === undefined) {
        data.insideApartment = {};
      }

      if (data.outApartment === undefined) {
        data.outApartment = {};
      }

      // export config
      doc.setFont("courier");
      doc.setFontType("normal");
      doc.setFontSize(12);
      doc.setLineWidth(1);

      // config variables
      var coordsPerLetter = (594 / 82); // amount of page coordinates per letter in .length items
      var metaX = 215;
      var twoColumnSplitX = 300;
      var nonMetaStartY = 420;
      var offsetFromLabel = 120;
      var textLength = 460; //px per line
      var splitText;
      var title; // title of each sections.  used to calculate title art (blue dots!)

      var fullSpace = 24;
      var halfSpace = 16;

      var config = {
        startX: 15,
        startY: 24,
        fullSpaceOffset: 0,
        halfSpaceOffset: 0,
        columnOneOffset: 0,
        columnTwoOffset: 0
      };

      var columnOneY = (config.columnOneOffset * halfSpace);
      var columnTwoY = (config.columnTwoOffset * halfSpace);

      var calculateY = calculateOffset.bind(this, doc, fullSpace, halfSpace);

      var positionY = calculateY(config);
      var positionX = config.startX;


      function drawField(field, text, offset, filter) {

        filter = filter || field;

        if (field) {
          if(offset === 'half') {
            config.halfSpaceOffset++;
          } else {
            config.fullSpaceOffset++;
          }

          positionX = metaX;
          positionY = calculateY(config);
          doc.text(text, positionX, positionY);
          positionX = metaX + offsetFromLabel;
          doc.text(filter, positionX, positionY);
        } else {
          field = "";
        }
      }

      function drawMultiline(field, text, offset) {
        if (field) {
          positionX = config.startX;
          splitText = doc.splitTextToSize(field, textLength);
          positionY = calculateY(config, splitText.length);

          if(offset) {
            doc.text(text, positionX, positionY);
          } else {
            doc.text(text, (config.startX + offsetFromLabel) - (text.length * coordsPerLetter), positionY);
          }

          positionX = config.startX + offsetFromLabel;

          multilineText(doc, splitText, positionX, positionY, config);

        } else {
          field = "";
        }
      }

      // export date
      doc.text("Exported on", positionX, positionY);

      config.halfSpaceOffset++;
      positionY = calculateY(config);
      doc.text(filteredExportDate.toString(), positionX, positionY);

      // community logo
      doc.rect(110, 10, 100, 100);
      doc.text("place holder", 120, 50);
      doc.text("for logo", 120, 62);

      // resident picture
      doc.rect(10, 120, 200, 280);
      doc.text("place holder", 60, 250);
      doc.text("for resident picture", 60, 262);

      ///////// community information
      positionX = metaX;
      config.halfSpaceOffset = 0;
      positionY = calculateY(config);
      if (data.community.name) {
        doc.text(data.community.name, positionX, positionY);
      } else {
        doc.text("Test Community", positionX, positionY);
      }

      config.fullSpaceOffset++;
      positionX = metaX;
      positionY = calculateY(config);
      doc.text("Phone: ", positionX, positionY);
      positionX = metaX + offsetFromLabel;
      if (data.community.phone) {
        doc.text(data.community.phone, positionX, positionY);
      } else {
        doc.text("Enter a Phone Number", positionX, positionY);
      }

      config.halfSpaceOffset++;
      positionX = metaX;
      positionY = calculateY(config);
      doc.text("Fax: ", positionX, positionY);
      positionX = metaX + offsetFromLabel;
      if (data.community.fax) {
        doc.text(data.community.fax, positionX, positionY);
      } else {
        doc.text("Enter a Fax Number", positionX, positionY);
      }

      config.halfSpaceOffset++;
      positionX = metaX;
      positionY = calculateY(config);
      doc.text("Address: ", positionX, positionY);
      positionX = metaX + offsetFromLabel;
      if (data.community.address) {
        doc.text(data.community.address, positionX, positionY);
      } else {
        doc.text("Enter an Address", positionX, positionY);
      }

      config.halfSpaceOffset++;
      positionX = metaX;
      positionY = calculateY(config);
      doc.text("Website: ", positionX, positionY);
      positionX = metaX + offsetFromLabel;
      if (data.community.website) {
        doc.text(data.community.website, positionX, positionY);
      } else {
        doc.text("Enter a Website", positionX, positionY);
      }


      ///////// residents name
      positionX = metaX;
      doc.setFontType("bold");
      config.fullSpaceOffset++;
      config.halfSpaceOffset++;
      positionY = calculateY(config);
      doc.text(data.firstName, positionX, positionY);
      positionX += (data.firstName.length * coordsPerLetter);

      if (data.aliasName) {
        doc.text(" \"" + data.aliasName + "\" ", positionX, positionY);
        positionX += ((data.aliasName.length + 3) * coordsPerLetter);
      } else {
        data.aliasName = "";
      }

      if (data.middleName) {
        doc.text(" " + data.middleName, positionX, positionY);
        positionX += ((data.middleName.length + 1) * coordsPerLetter);
      } else {
        data.middleName = "";
      }

      doc.text(" " + data.lastName, positionX, positionY);
      doc.setFontType("normal");

      drawField(data.maidenName, "Maiden Name: ", "half");

      if(data.movedFrom) {
        drawField(data.movedFrom.name, "From: ", "half");
      }

      drawField(data.birthDate, "Date of Birth: ", "half", residentFilteredBirthDate);

      drawField(data.admissionDate, "Admission Date: ", "half", residentFilteredAdmissionDate);

      drawField(data.sex, "Sex: ", "half");

      drawField(data.maritalStatus, "Marital Status: ", "half");

      if (data.veteran === true) {
        config.halfSpaceOffset++;
        positionX = metaX;
        positionY = calculateY(config);
        doc.text("Veteran", positionX, positionY);
      }

      drawField(data.primaryDoctor, "Primary Doctor: ", "full");

      drawField(data.pharmacy, "Pharmacy: ", "half");

      drawField(data.buildingStatus, "Building Status: ", "half");

      drawField(data.admittedFrom, "Admitted From: ", "half");


      if (data.longTermCareInsurance === true && data.receiveingLongTermCareInsurance === true) {
        positionX = metaX;
        config.halfSpaceOffset++;
        positionY = calculateY(config);
        doc.text("Receiving Long Term Care Insurance", positionX, positionY);
      } else if (data.longTermCareInsurance === true && data.receiveingLongTermCareInsurance === false) {
        positionX = metaX;
        config.halfSpaceOffset++;
        positionY = calculateY(config);
        doc.text("Has but not receiving Long Term Care Insurance", positionX, positionY);
      }

      doc.setFontType("bold");
      doc.setTextColor(139, 0, 0);
      config.halfSpaceOffset++;
      positionX = metaX;
      positionY = calculateY(config);
      if (data.fullCode === true) {
        doc.text("Full Code", positionX, positionY);
      } else {
        doc.text("No Code", positionX, positionY);
      }
      doc.setTextColor(0, 0, 0);
      doc.setFontType("normal");

      //////////////////////////////////////////

      config.halfSpaceOffset = 0;
      config.fullSpaceOffset = 0;
      config.startY = 420;

      drawMultiline(data.administrativeNotes, "Notes:", true);

      /////////////////////////////////////////// life section

      positionY = calculateY(config);
      title = "Life";
      doc.setFillColor(33, 150, 243);

      // right side dots
      createDots(
        594,
        10,
        (297 + ((title.length / 2) * coordsPerLetter) + 28),
        doc, positionY);
      // left side dots
      createDots(
        (297 - ((title.length / 2) * coordsPerLetter) - 6),
        10,
        20,
        doc, positionY);
      // (how far to extend to the right X, how far down to start Y, how far to extend to the left X)

      doc.setFontType("bold");
      doc.roundedRect(
        (297 - (((title.length) / 2) * coordsPerLetter)) - 20, // x position
        positionY, // y position | bigger is lower on page
        (title.length * coordsPerLetter) + 40, // x length
        18, // y height
        7, 7, // rounded corners
        'F'); // F filled | FD filled with borders

      config.fullSpaceOffset++;
      config.halfSpaceOffset += 0.5;
      doc.text(title, 297 - (((title.length) / 2) * coordsPerLetter), positionY + 12);
      doc.setFontType("normal");

      drawMultiline(data.religion, "Religion: ");

      drawMultiline(data.education, "Education: ");

      drawMultiline(data.occupation, "Occupation: ");

      drawMultiline(data.contribution, "Contribution: ");

      //////////////////////////// column one

      if (data.shopping.length !== 0) {
        positionX = config.startX;
        positionY = calculateY(config) + columnOneY;
        doc.text("Shopping Person:",
          (config.startX + offsetFromLabel) - ("Shopping Person: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        doc.text(data.shopping, positionX, positionY);
        config.columnOneOffset += data.shopping.length;
        columnOneY = (config.columnOneOffset * halfSpace);
      } else {
        data.shopping = "";
      }

      if (data.outsideAgency) {
        positionX = config.startX;
        positionY = calculateY(config) + columnOneY;
        doc.text("Outside Agency:",
          (config.startX + offsetFromLabel) - ("Outside Agency: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        doc.text(data.outsideAgency, positionX, positionY);
        config.columnOneOffset++;
        columnOneY = (config.columnOneOffset * halfSpace);
      } else {
        data.outsideAgency = "";
      }

      if (data.easilyUnderstood === true && data.englishFirstLanguage === true) {
        positionX = config.startX;
        positionY = calculateY(config) + columnOneY;
        doc.text("Is easily understood", positionX, positionY);
        config.columnOneOffset++;
      } else if (data.easilyUnderstood === true && data.englishFirstLanguage === false) {
        positionX = config.startX;
        positionY = calculateY(config) + columnOneY;
        doc.text("Is easily understood but English", positionX, positionY);
        doc.text("is not their first language.", positionX, positionY + 12);
        config.columnOneOffset += 1.75;
      } else if (data.easilyUnderstood === false && data.englishFirstLanguage === true) {
        positionX = config.startX;
        positionY = calculateY(config) + columnOneY;
        doc.text("Is not easily understood", positionX, positionY);
        config.columnOneOffset++;
      } else if (data.easilyUnderstood === false && data.englishFirstLanguage === false) {
        positionX = config.startX;
        positionY = calculateY(config) + columnOneY;
        doc.text("Is not easily understood and English", positionX, positionY);
        doc.text("is not their first language.", positionX, positionY + 12);
        config.columnOneOffset += 1.75;
      }

      ////////////////////// column two

      function drawBoolean(field, text) {
        if (field === true) {
          positionX = twoColumnSplitX;
          positionY = calculateY(config) + columnTwoY;
          doc.text(text, positionX, positionY);
          config.columnTwoOffset++;
          columnTwoY = (config.columnTwoOffset * halfSpace);
        }
      }

      drawBoolean(data.supportGroup, "Has a Support Group");

      drawBoolean(data.heatingPad, "Has a Heating Pad");

      drawBoolean(data.microwave, "Has a Microwave");

      drawBoolean(data.extensionCord, "Uses Extension Cords");

      if (data.extensionCord === true || data.microwave === true || data.heatingPad === true) {
        positionX = twoColumnSplitX;
        positionY = calculateY(config) + columnTwoY;
        doc.text("These devices have been assessed", positionX, positionY);
        doc.text("for safety.", positionX, positionY + 12);
        config.columnTwoOffset += 1.75;
        columnTwoY = (config.columnTwoOffset * halfSpace);
      }

      // if statement to determine the larger column then add it to offset
      if (config.columnOneOffset >= config.columnTwoOffset) {
        config.halfSpaceOffset += config.columnOneOffset;
      } else if (config.columnOneOffset < config.columnTwoOffset) {
        config.halfSpaceOffset += config.columnTwoOffset;
      }

      if (data.otherLanguage) {
        positionX = config.startX;
        positionY = calculateY(config);
        doc.text("Other Languages:",
          (config.startX + offsetFromLabel) - ("Other Languages: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        doc.text(data.otherLanguage, positionX, positionY);
        config.halfSpaceOffset++;
      } else {
        data.otherLanguage = "";
      }

      drawMultiline(data.lifeNotes, "Notes: ");

      ////////////////////////////////////////// allergy section

      positionY = calculateY(config);
      title = "Allergies";
      doc.setFillColor(33, 150, 243);

      // right side dots
      createDots(
        594,
        10,
        (297 + ((title.length / 2) * coordsPerLetter) + 28),
        doc, positionY);
      // left side dots
      createDots(
        (297 - ((title.length / 2) * coordsPerLetter) - 6),
        10,
        20,
        doc, positionY);
      // (how far to extend to the right X, how far down to start Y, how far to extend to the left X)

      doc.setFontType("bold");
      doc.roundedRect(
        (297 - (((title.length) / 2) * coordsPerLetter)) - 20, // x position
        positionY, // y position | bigger is lower on page
        (title.length * coordsPerLetter) + 40, // x length
        18, // y height
        7, 7, // rounded corners
        'F'); // F filled | FD filled with borders

      config.fullSpaceOffset++;
      config.halfSpaceOffset += 0.5;
      doc.text(title, 297 - (((title.length) / 2) * coordsPerLetter), positionY + 12);
      doc.setFontType("normal");

      if (data.foodAllergies.length !== 0) {
        positionX = config.startX;
        positionY = calculateY(config);
        doc.text("Food Allergies:",
          (config.startX + offsetFromLabel) - ("Food Allergies: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        var splitfoodAllergies = doc.splitTextToSize(data.foodAllergies.join(', '), textLength);
        doc.text(splitfoodAllergies, positionX, positionY);
        config.halfSpaceOffset += splitfoodAllergies.length;
      } else {
        data.foodAllergies = "";
      }


      if (data.medicationAllergies.length !== 0) {
        positionX = config.startX;
        positionY = calculateY(config);
        doc.text("Med Allergies:",
          (config.startX + offsetFromLabel) - ("Med Allergies: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        var splitmedicationAllergies = doc.splitTextToSize(data.medicationAllergies.join(', '), textLength);
        doc.text(splitmedicationAllergies, positionX, positionY);
        config.halfSpaceOffset += splitmedicationAllergies.length;
      } else {
        data.medicationAllergies = "";
      }

      if (data.otherAllergies.length !== 0) {
        positionX = config.startX;
        positionY = calculateY(config);
        doc.text("Other Allergies:",
          (config.startX + offsetFromLabel) - ("Other Allergies: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        var splitOtherAllergies = doc.splitTextToSize(data.otherAllergies.join(', '), textLength);
        doc.text(splitOtherAllergies, positionX, positionY);
        config.halfSpaceOffset += splitOtherAllergies.length;
      } else {
        data.otherAllergies = "";
      }

      drawMultiline(data.allergyNotes, "Notes: ");

      ////////////////////////////////////////// Assistance section

      positionY = calculateY(config);
      title = "Assistance";
      doc.setFillColor(33, 150, 243);

      // right side dots
      createDots(
        594,
        10,
        (297 + ((title.length / 2) * coordsPerLetter) + 28),
        doc, positionY);
      // left side dots
      createDots(
        (297 - ((title.length / 2) * coordsPerLetter) - 6),
        10,
        20,
        doc, positionY);
      // (how far to extend to the right X, how far down to start Y, how far to extend to the left X)

      doc.roundedRect(
        (297 - (((title.length) / 2) * coordsPerLetter)) - 20, // x position
        positionY, // y position | bigger is lower on page
        (title.length * coordsPerLetter) + 40, // x length
        18, // y height
        7, 7, // rounded corners
        'F'); // F filled | FD filled with borders

      config.fullSpaceOffset++;
      config.halfSpaceOffset += 0.5;
      doc.setFontType("bold");
      doc.text(title, 297 - (((title.length) / 2) * coordsPerLetter), positionY + 12);
      doc.setFontType("normal");

      if (data.hairAssist === true) {
        positionX = config.startX;
        positionY = calculateY(config);
        doc.text("Needs Assistance with Hair", positionX, positionY);
        config.halfSpaceOffset++;
      }

      if (data.barber === true) {
        positionX = config.startX;
        positionY = calculateY(config);
        doc.text("Has a Barber", positionX, positionY);
        config.halfSpaceOffset++;
      }

      if (data.shaveAssist) {
        positionX = config.startX;
        positionY = calculateY(config);
        doc.text("Shave Assist:",
          (config.startX + offsetFromLabel) - ("Shave Assist: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        doc.text(data.shaveAssist, positionX, positionY);
        config.halfSpaceOffset++;
      } else {
        data.shaveAssist = "";
      }

      drawMultiline(data.hairNotes, "Hair Notes: ");

////////////////////////////////////////// mobility section

      positionY = calculateY(config);
      title = "Mobility";
      doc.setFillColor(33, 150, 243);

      // right side dots
      createDots(
        594,
        10,
        (297 + ((title.length / 2) * coordsPerLetter) + 28),
        doc, positionY);
      // left side dots
      createDots(
        (297 - ((title.length / 2) * coordsPerLetter) - 6),
        10,
        20,
        doc, positionY);
      // (how far to extend to the right X, how far down to start Y, how far to extend to the left X)

      doc.roundedRect(
        (297 - (((title.length) / 2) * coordsPerLetter)) - 20, // x position
        positionY, // y position | bigger is lower on page
        (title.length * coordsPerLetter) + 40, // x length
        18, // y height
        7, 7, // rounded corners
        'F'); // F filled | FD filled with borders

      config.fullSpaceOffset++;
      config.halfSpaceOffset += 0.5;
      doc.setFontType("bold");
      doc.text(title, 297 - (((title.length) / 2) * coordsPerLetter), positionY + 12);
      doc.setFontType("normal");

      positionX = config.startX;
      positionY = calculateY(config);
      doc.text("Inside their Apartment", positionX, positionY);
      config.halfSpaceOffset++;

      if (data.insideApartment.useOfAssistiveDevice) {
        positionX = config.startX;
        positionY = calculateY(config);
        doc.text("Assistive Device:",
          (config.startX + offsetFromLabel) - ("Assistive Device: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        doc.text(data.insideApartment.useOfAssistiveDevice, positionX, positionY);
        config.halfSpaceOffset++;
      } else {
        data.insideApartment.useOfAssistiveDevice = "";
      }

      if(data.insideApartment) {
        drawMultiline(data.insideApartment.assitanceWithDevice, "Device Notes: ");
      }

      if(data.insideApartment) {
        drawMultiline(data.insideApartment.specialAmbulationNeeds, "Special Needs: ");
      }

/*
      if (data.insideApartment.apartmentMobilityDevices.length !== 0) {
        positionX = config.startX;
        positionY = calculateY(config);
        doc.text("Devices:",
          (config.startX + offsetFromLabel) - ("Devices: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        var splitMobilityDevices = doc.splitTextToSize(data.insideApartment.apartmentMobilityDevices.join(', '), textLength);
        doc.text(splitMobilityDevices, positionX, positionY);
        config.halfSpaceOffset += splitOtherAllergies.length;
      } else {
        data.insideApartment.apartmentMobilityDevices = "";
      }

      if (data.insideApartment.apartmentMobilityDevices.length !== 0) {
        positionX = config.startX;
        splitText = doc.splitTextToSize(data.insideApartment.apartmentMobilityDevices, textLength);
        positionY = calculateY(config, splitText.length);
        doc.text("Devices:",
          (config.startX + offsetFromLabel) - ("Devices: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        multilineText(doc, splitText, positionX, positionY, config);
      } else {
        data.insideApartment.apartmentMobilityDevices = "";
      }
*/

      if(data.insideApartment) {
        drawMultiline(data.insideApartment.mobilitySafetyAssessment, "Assessment: ");
      }

      positionX = config.startX;
      positionY = calculateY(config);
      doc.text("Outside their Apartment", positionX, positionY);
      config.halfSpaceOffset++;


      if (data.outsideApartment && data.outsideApartment.useOfAssistiveDevice) {
        positionX = config.startX;
        positionY = calculateY(config);
        doc.text("Assistive Device:",
          (config.startX + offsetFromLabel) - ("Assistive Device: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        doc.text(data.outsideApartment.useOfAssistiveDevice, positionX, positionY);
        config.halfSpaceOffset++;
      } else {
        if(data.outsideApartment) {
          data.outsideApartment.useOfAssistiveDevice = "";
        }
      }

      //draw the graphs page
      doc.addPage();

      doc.line(305, 0, 305, 800);

      doc.line(0, 201, 610, 201);
      doc.line(0, 397, 610, 397);
      doc.line(0, 593, 610, 593);

      //it is an array of data, date fields
      graphs.drawGraph(doc, data.temperature, "Temperature",  0, 0);
      //graphs.drawGraph(doc, data.oxygenSaturation, "Oxygen Saturation", 0, 196);
      //graphs.drawGraph(doc, data.pulse, "Pulse", 0, 392);
      //graphs.drawGraph(doc, data.vitalsPain, "Pain", 0, 588);

      //graphs.drawGraph(doc, data.respiration, "Respiration", 310, 0);
      //graphs.drawGraph(doc, data.weight, "Weight", 310, 196);
      //graphs.drawGraph(doc, data.internationalNormalizedRatio, "INR", 310, 392);
      //graphs.drawGraph(doc, data.bloodPressureDiastolic, "Blood Pressure", 310, 588);

      doc.addPage();

      // used for calculating the coordinates per letter - 84/610
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

      // used to get height of page in coordinates = 850
      doc.text("700", 10, 700);
      doc.text("710", 10, 710);
      doc.text("720", 10, 720);
      doc.text("730", 10, 730);
      doc.text("740", 10, 740);
      doc.text("750", 10, 750);
      doc.text("760", 10, 760);
      doc.text("770", 10, 770);
      doc.text("780", 10, 780);
      doc.text("790", 10, 790);
      doc.text("800", 10, 800);
      doc.text("791", 30, 791);
      doc.text("792", 60, 792);
      doc.text("793", 90, 793);
      doc.text("794", 120, 794);
      doc.text("795", 150, 795);
      doc.text("796", 180, 796);
      doc.text("797", 210, 797);
      doc.text("798", 240, 798);
      doc.text("799", 270, 799);

      //Graph with 2 lines
      // doc.addPage();

      // graphs.drawGraph(doc, data.bloodPressureDiastolic, "bloodPressureDiastolic",  0, 0);
      // graphs.drawGraph(doc, data.bloodPressureSystolic, "bloodPressureSystolic",  0, 0);

      //it is an array of data, date fields
      // if(data.oxygenSaturation.length > 0) {
      //   doc.setDrawColor(0,0,0);
      //   doc.rect(
      //     10,
      //     128,
      //     594,
      //     108);

      //   console.log(data.oxygenSaturation);

      //   var maxData = _.max(_.map(data.oxygenSaturation,"data"));
      //   var minData = _.min(_.map(data.oxygenSaturation,"data"));

      //   var maxDate = _.max(_.map(data.oxygenSaturation,"date"));
      //   var minDate = _.min(_.map(data.oxygenSaturation,"date"));

      //   console.log(maxData + " : " + minData); //get the max and min of our data
      //   console.log(maxDate + " : " + minDate); //get the max and min of our date

      //   _.forEach(data.oxygenSaturation, function(point) {
      //     //point.data and point.date
      //   });

      //   var graphSpacingY = (594/(data.oxygenSaturation.length-1));
      //   var coordsPerDataUnitY = 108/(maxData - minData);
      //   var coordsPerDateUnitX = 594/(maxDate - minDate);
      //   var yValue;

      //   console.log(coordsPerDateUnitX + " " + coordsPerDataUnitY);

      //   for (i = 0; i < data.oxygenSaturation.length; i++) {
      //     doc.setFillColor(255,0,0);
      //     doc.setDrawColor(255,0,0);
      //     doc.circle(
      //       (graphSpacingY * i) + 10, // x
      //       236 - ((data.oxygenSaturation[i].data - minData) * coordsPerDataUnitY), // y
      //       3,  // radius
      //       'F');

      //     if (i !== (data.oxygenSaturation.length - 1)) {
      //       doc.line(
      //         (graphSpacingY * i) + 10, // x1
      //         236 - ((data.oxygenSaturation[i].data - minData) * coordsPerDataUnitY),  // y1
      //         (graphSpacingY * (i + 1)) + 10, // x2
      //         236 - ((data.oxygenSaturation[i + 1].data - minData) * coordsPerDataUnitY
      //       )); // y2
      //     }
      //     // doc.text(118 - ((data.temperature[i].data - minData) * coordsPerDataUnitY) + " ", 10, i * 20)
      //   }

      //   var chartTitle;
      //   chartTitle = "Oxygen Saturation";
      //   doc.text(chartTitle, 602 - (chartTitle.length * coordsPerLetter), 138);

      //   doc.text("Length: " + data.oxygenSaturation.length, 40, 440);
      //   doc.text(data.oxygenSaturation[0].data.toString(), 40, 460);
      //   doc.text(data.oxygenSaturation[0].date, 40, 480);
      //   doc.text("coordsPerDataUnitY: " + coordsPerDataUnitY, 40, 500);
      //   doc.text("coordsPerDateUnitX: " + coordsPerDateUnitX, 40, 520);
      //   doc.text("max/minDate: " + maxDate + " : " + minDate, 40, 540);

     // }

      // other fields you can use
      // data.oxygenSaturation
      // data.pulse
      // data.vitalsPain
      // data.respiration
      // data.weight
      // data.bloodPressureDiastolic
      // data.bloodPressureSystolic


      doc.save(fileName);
    }


    // Helper functions to make blue dots
    function createDots(x, y, end, doc, positionY) {

      var dots = [];
      var step = 10;

      if (end < x) {
        dots = _.range(end - step, x + step, step);
      } else {
        dots = _.range(x - step, end + step, step);
      }

      dots.forEach(function(pos) {
        doc.ellipse(pos, y + positionY, 2, 2, 'F');
      });

    }

    return {
      exportPdf: exportPdf
    };

  }

})();
