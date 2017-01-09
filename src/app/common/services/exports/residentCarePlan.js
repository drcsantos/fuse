// documentation: https://parall.ax/products/jspdf

(function() {
  angular.module("app.core").service("exportCarePlan", exportCarePlan);

  exportCarePlan.$inject = ['$filter', 'imageData'];

  function exportCarePlan($filter, imageData) {


    function multilineText(doc, textArr, x, y, config) {

      var offset = 0;
      var newPage = false;

      textArr.forEach(function(textLine) {
        doc.text(x,y + offset, textLine);
        offset += 12;

        // if y goes over page height create new page and reset coords
        if(y + offset > 780) {
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

    };

    function calculateOffset(doc, fullSpace, halfSpace, config, textLength) {

      var positionY = (config.startY + (fullSpace * config.fullSpaceOffset) +
                                       (halfSpace * config.halfSpaceOffset));

      // create a new page and reset the offsets
      if(positionY > doc.internal.pageSize.height) {
        doc.addPage();

        config.fullSpaceOffset = 0;
        config.halfSpaceOffset = 0;
        config.startY = 24;

        positionY = (config.startY + (fullSpace * config.fullSpaceOffset) +
                                         (halfSpace * config.halfSpaceOffset));
      } else if(textLength) {
          //config.halfSpaceOffset += textLength;
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
      var coordsPerLetter = (594/82); // amount of page coordinates per letter in .length items
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
        startX : 15,
        startY : 24,
        fullSpaceOffset : 0,
        halfSpaceOffset : 0,
        columnOneOffset : 0,
        columnTwoOffset : 0
      };

      var columnOneY = (config.columnOneOffset * halfSpace);
      var columnTwoY = (config.columnTwoOffset * halfSpace);

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

      // resident picture
      doc.rect(10, 120, 200, 280);
      doc.text("place holder", 60, 250);
      doc.text("for resident picture", 60, 262);

      ///////// community information
      positionX = metaX;
      config.halfSpaceOffset = 0;
      positionY = calculateY(config);
      doc.text(data.community.name, positionX, positionY);

      config.fullSpaceOffset++;
      positionX = metaX;
      positionY = calculateY(config);
      doc.text("Phone: ", positionX, positionY);
      positionX = metaX + offsetFromLabel;
      doc.text(data.community.phone, positionX, positionY);

      config.halfSpaceOffset++;
      positionX = metaX;
      positionY = calculateY(config);
      doc.text("Fax: ", positionX, positionY);
      positionX = metaX + offsetFromLabel;
      doc.text(data.community.fax, positionX, positionY);

      config.halfSpaceOffset++;
      positionX = metaX;
      positionY = calculateY(config);
      doc.text("Address: ", positionX, positionY);
      positionX = metaX + offsetFromLabel;
      doc.text(data.community.address, positionX, positionY);

      config.halfSpaceOffset++;
      positionX = metaX;
      positionY = calculateY(config);
      doc.text("Website: ", positionX, positionY);
      positionX = metaX + offsetFromLabel;
      doc.text(data.community.website, positionX, positionY);


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

      if (data.maidenName) {
        config.fullSpaceOffset++;
        positionX = metaX;
        positionY = calculateY(config);
        doc.text("Maiden Name: ", positionX, positionY);
        positionX = metaX + offsetFromLabel;
        doc.text(data.maidenName, positionX, positionY);
      } else {
        data.maidenName = "";
      }

      if (data.movedFrom) {
        config.halfSpaceOffset++;
        positionX = metaX;
        positionY = calculateY(config);
        doc.text("From: ", positionX, positionY);
        positionX = metaX + offsetFromLabel;
        doc.text(data.movedFrom.name, positionX, positionY);
      } else {
        data.movedFrom = "";
      }

      if (data.birthDate) {
        config.halfSpaceOffset++;
        positionX = metaX;
        positionY = calculateY(config);
        doc.text("Date of Birth: ", positionX, positionY);
        positionX = metaX + offsetFromLabel;
        doc.text(residentFilteredBirthDate, positionX, positionY);
      } else {
        data.birthDate = "";
      }

      if (data.admissionDate) {
        config.halfSpaceOffset++;
        positionX = metaX;
        positionY = calculateY(config);
        doc.text("Admission Date: ", positionX, positionY);
        positionX = metaX + offsetFromLabel;
        doc.text(residentFilteredAdmissionDate, positionX, positionY);
      } else {
        data.admissionDate = "";
      }

      if (data.sex) {
        config.halfSpaceOffset++;
        positionX = metaX;
        positionY = calculateY(config);
        doc.text("Sex: ", positionX, positionY);
        positionX = metaX + offsetFromLabel;
        doc.text(data.sex, positionX, positionY);
      } else {
        data.sex = "";
      }

      if (data.maritalStatus) {
        config.halfSpaceOffset++;
        positionX = metaX;
        positionY = calculateY(config);
        doc.text("Marital Status: ", positionX, positionY);
        positionX = metaX + offsetFromLabel;
        doc.text(data.maritalStatus, positionX, positionY);
      } else {
        data.maritalStatus = "";
      }

      if (data.veteran === true) {
        config.halfSpaceOffset++;
        positionX = metaX;
        positionY = calculateY(config);
        doc.text("Veteran", positionX, positionY);
      }

      if (data.primaryDoctor) {
        config.fullSpaceOffset++;
        positionX = metaX;
        positionY = calculateY(config);
        doc.text("Primary Doctor: ", positionX, positionY);
        positionX = metaX + offsetFromLabel;
        doc.text(data.primaryDoctor, positionX, positionY);
      } else {
        data.primaryDoctor = "";
      }

      if (data.pharmacy) {
        config.halfSpaceOffset++;
        positionX = metaX;
        positionY = calculateY(config);
        doc.text("Pharmacy: ", positionX, positionY);
        positionX = metaX + offsetFromLabel;
        doc.text(data.pharmacy, positionX, positionY);
      } else {
        data.pharmacy = "";
      }

      if (data.buildingStatus) {
        config.halfSpaceOffset++;
        positionX = metaX;
        positionY = calculateY(config);
        doc.text("Building Status: ", positionX, positionY);
        positionX = metaX + offsetFromLabel;
        doc.text(data.buildingStatus, positionX, positionY);
      } else {
        data.buildingStatus = "";
      }

      if (data.admittedFrom) {
        config.halfSpaceOffset++;
        positionX = metaX;
        positionY = calculateY(config);
        doc.text("Admitted From: ", positionX, positionY);
        positionX = metaX + offsetFromLabel;
        doc.text(data.admittedFrom, positionX, positionY);
      } else {
        data.admittedFrom = "";
      }

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

      if (data.administrativeNotes) {
        positionX = config.startX;
        splitText = doc.splitTextToSize(data.administrativeNotes, textLength);
        positionY = calculateY(config, splitText.length);
        doc.text("Notes:", positionX, positionY);
        positionX = config.startX + offsetFromLabel;
        multilineText(doc, splitText, positionX, positionY, config);
      } else {
        data.administrativeNotes = "";
      }

/////////////////////////////////////////// life section

      positionY = calculateY(config);
      title = "Life";
      doc.setFillColor(33, 150, 243);

      // right side dots
      createDots(
        594,
        10,
        (297 + ((title.length/2) * coordsPerLetter) + 28),
        doc, positionY);
      // left side dots
      createDots(
        (297 - ((title.length/2) * coordsPerLetter) - 6),
        10,
        20,
        doc, positionY);
      // (how far to extend to the right X, how far down to start Y, how far to extend to the left X)

      doc.setFontType("bold");
      doc.roundedRect(
        (297 - (((title.length)/2)  * coordsPerLetter)) - 20, // x position
        positionY, // y position | bigger is lower on page
        (title.length * coordsPerLetter) + 40, // x length
        18, // y height
        7, 7, // rounded corners
        'F'); // F filled | FD filled with borders

      config.fullSpaceOffset++;
      config.halfSpaceOffset += 0.5;
      doc.text(title, 297 - (((title.length)/2)  * coordsPerLetter), positionY + 12);
      doc.setFontType("normal");

      if (data.religion) {
        positionX = config.startX;
        splitText = doc.splitTextToSize(data.religion, textLength);
        positionY = calculateY(config, splitText.length);
        doc.text("Religion:",
          (config.startX + offsetFromLabel) - ("Religion: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        multilineText(doc, splitText, positionX, positionY, config);
      } else {
        data.religion = "";
      }

      if (data.education) {
        positionX = config.startX;
        splitText = doc.splitTextToSize(data.education, textLength);
        positionY = calculateY(config, splitText.length);
        doc.text("Education:",
          (config.startX + offsetFromLabel) - ("Education: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        multilineText(doc, splitText, positionX, positionY, config);
      } else {
        data.education = "";
      }

      if (data.occupation) {
        positionX = config.startX;
        splitText = doc.splitTextToSize(data.occupation, textLength);
        positionY = calculateY(config, splitText.length);
        doc.text("Occupation:",
          (config.startX + offsetFromLabel) - ("Occupation: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        multilineText(doc, splitText, positionX, positionY, config);
      } else {
        data.occupation = "";
      }

      if (data.contribution) {
        positionX = config.startX;
        splitText = doc.splitTextToSize(data.contribution, textLength);
        positionY = calculateY(config, splitText.length);
        doc.text("Contribution:",
          (config.startX + offsetFromLabel) - ("Contribution: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        multilineText(doc, splitText, positionX, positionY, config);
      } else {
        data.contribution = "";
      }

//////////////////////////// column one

      if (data.shopping) {
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

      if (data.supportGroup === true) {
        positionX = twoColumnSplitX;
        positionY = calculateY(config) + columnTwoY;
        doc.text("Has a Support Group", positionX, positionY);
        config.columnTwoOffset++;
        columnTwoY = (config.columnTwoOffset * halfSpace);
      }

      if (data.heatingPad === true) {
        positionX = twoColumnSplitX;
        positionY = calculateY(config) + columnTwoY;
        doc.text("Has a Heating Pad", positionX, positionY);
        config.columnTwoOffset++;
        columnTwoY = (config.columnTwoOffset * halfSpace);
      }

      if (data.microwave === true) {
        positionX = twoColumnSplitX;
        positionY = calculateY(config) + columnTwoY;
        doc.text("Has a Microwave", positionX, positionY);
        config.columnTwoOffset++;
        columnTwoY = (config.columnTwoOffset * halfSpace);
      }

      if (data.extensionCord === true) {
        positionX = twoColumnSplitX;
        positionY = calculateY(config) + columnTwoY;
        doc.text("Uses Extension Cords", positionX, positionY);
        config.columnTwoOffset++;
        columnTwoY = (config.columnTwoOffset * halfSpace);
      }

      if (data.extensionCord === true || data.microwave === true || data.heatingPad === true) {
        positionX = twoColumnSplitX;
        positionY = calculateY(config) + columnTwoY;
        //doc.text("test:" + accessorySafetyAssessment, positionX, positionY);
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

      if (data.lifeNotes) {
        positionX = config.startX;
        splitText = doc.splitTextToSize(data.lifeNotes, textLength);
        positionY = calculateY(config, splitText.length);
        doc.text("Notes:",
          (config.startX + offsetFromLabel) - ("Notes: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        multilineText(doc, splitText, positionX, positionY, config);
      } else {
        data.lifeNotes = "";
      }

////////////////////////////////////////// allergy section

      positionY = calculateY(config);
      title = "Allergies";
      doc.setFillColor(33, 150, 243);

      // right side dots
      createDots(
        594,
        10,
        (297 + ((title.length/2) * coordsPerLetter) + 28),
        doc, positionY);
      // left side dots
      createDots(
        (297 - ((title.length/2) * coordsPerLetter) - 6),
        10,
        20,
        doc, positionY);
      // (how far to extend to the right X, how far down to start Y, how far to extend to the left X)

      doc.setFontType("bold");
      doc.roundedRect(
        (297 - (((title.length)/2)  * coordsPerLetter)) - 20, // x position
        positionY, // y position | bigger is lower on page
        (title.length * coordsPerLetter) + 40, // x length
        18, // y height
        7, 7, // rounded corners
        'F'); // F filled | FD filled with borders

      config.fullSpaceOffset++;
      config.halfSpaceOffset += 0.5;
      doc.text(title, 297 - (((title.length)/2)  * coordsPerLetter), positionY + 12);
      doc.setFontType("normal");

      if (data.foodAllergies) {
        positionX = config.startX;
        positionY = calculateY(config);
        doc.text("Food Allergies:",
          (config.startX + offsetFromLabel) - ("Food Allergies: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        doc.text(data.foodAllergies, positionX, positionY);
        config.halfSpaceOffset += data.foodAllergies.length;
      } else {
        data.foodAllergies = "";
      }

      if (data.medicationAllergies) {
        positionX = config.startX;
        positionY = calculateY(config);
        doc.text("Med Allergies:",
          (config.startX + offsetFromLabel) - ("Med Allergies: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        doc.text(data.medicationAllergies, positionX, positionY);
        config.halfSpaceOffset += data.medicationAllergies.length;
      } else {
        data.medicationAllergies = "";
      }

      if (data.otherAllergies) {
        positionX = config.startX;
        positionY = calculateY(config);
        doc.text("Other Allergies:",
          (config.startX + offsetFromLabel) - ("Other Allergies: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        doc.text(data.otherAllergies, positionX, positionY);
        config.halfSpaceOffset += data.otherAllergies.length;
      } else {
        data.otherAllergies = "";
      }

      if (data.allergyNotes) {
        positionX = config.startX;
        splitText = doc.splitTextToSize(data.allergyNotes, textLength);
        positionY = calculateY(config, splitText.length);
        doc.text("Notes:",
          (config.startX + offsetFromLabel) - ("Notes: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        multilineText(doc, splitText, positionX, positionY, config);
      } else {
        data.allergyNotes = "";
      }

////////////////////////////////////////// Assistance section

      positionY = calculateY(config);
      title = "Assistance";
      doc.setFillColor(33, 150, 243);

      // right side dots
      createDots(
        594,
        10,
        (297 + ((title.length/2) * coordsPerLetter) + 28),
        doc, positionY);
      // left side dots
      createDots(
        (297 - ((title.length/2) * coordsPerLetter) - 6),
        10,
        20,
        doc, positionY);
      // (how far to extend to the right X, how far down to start Y, how far to extend to the left X)

      doc.roundedRect(
        (297 - (((title.length)/2)  * coordsPerLetter)) - 20, // x position
        positionY, // y position | bigger is lower on page
        (title.length * coordsPerLetter) + 40, // x length
        18, // y height
        7, 7, // rounded corners
        'F'); // F filled | FD filled with borders

      config.fullSpaceOffset++;
      config.halfSpaceOffset += 0.5;
      doc.setFontType("bold");
      doc.text(title, 297 - (((title.length)/2)  * coordsPerLetter), positionY + 12);
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

      if (data.hairNotes) {
        positionX = config.startX;
        splitText = doc.splitTextToSize(data.hairNotes, textLength);
        positionY = calculateY(config, splitText.length);
        doc.text("Hair Notes:",
          (config.startX + offsetFromLabel) - ("Hair Notes: ".length * coordsPerLetter),
          positionY);
        positionX = config.startX + offsetFromLabel;
        multilineText(doc, splitText, positionX, positionY, config);
      } else {
        data.hairNotes = "";
      }


/*
      if (data.hasFoodAllergies === true || data.hasMedicationAllergies === true) {

        arrayLengthOffset = 174;

        if (data.hasFoodAllergies === true) {
          doc.text(295, arrayLengthOffset, "Food Allergies:");
          doc.text(430, arrayLengthOffset, data.foodAllergies);
          arrayLengthOffset = (data.foodAllergies.length * 12) + arrayLengthOffset;
        }

        if (data.hasMedicationAllergies === true) {
          doc.text(295, arrayLengthOffset, "Medication Allergies:");
          doc.text(430, arrayLengthOffset, data.medicationAllergies);
          arrayLengthOffset = (data.medicationAllergies.length * 12) + arrayLengthOffset;
        }

        arrayLengthOffset = arrayLengthOffset + 25;

      } else {
        doc.text(295, 174, data.firstName + " has no known allergies");
        arrayLengthOffset = 174 + 35;
      }

      // bathing line
      doc.setDrawColor(3, 169, 244);
      doc.line(0, arrayLengthOffset, 650, arrayLengthOffset);
      doc.text(300, arrayLengthOffset + 3, "BATHING");

      doc.text(295, arrayLengthOffset + 24, "Type:");
      doc.text(430, arrayLengthOffset + 24, data.typeOfBathing + " ");

      doc.text(295, arrayLengthOffset + 36, "Time:");
      doc.text(430, arrayLengthOffset + 36, data.timeOfBathing + " ");

      doc.text(295, arrayLengthOffset + 48, "Frequency:");
      doc.text(430, arrayLengthOffset + 48, data.frequencyOfBathing + " ");

      arrayLengthOffset = arrayLengthOffset + 60;

      doc.text(295, arrayLengthOffset, "Acceptance:");
      doc.text(430, arrayLengthOffset, data.acceptanceOfBathing + " ");

      if (data.acceptanceOfBathing == "Dislikes") {
        doc.text(295, arrayLengthOffset + 12, "Why Dislikes:");
        doc.text(430, arrayLengthOffset + 12, data.dislikesBathingDescribe + " ");
        arrayLengthOffset = arrayLengthOffset + 12;
      }

      // continent line
      doc.setDrawColor(121, 85, 72);
      doc.line(0, arrayLengthOffset + 38, 650, arrayLengthOffset + 38);
      doc.text(300, arrayLengthOffset + 41, "CONTINENT");

      doc.text(295, arrayLengthOffset + 62, "Bowel Continent:");
      doc.text(430, arrayLengthOffset + 62, data.bowelContinent + " ");

      doc.text(295, arrayLengthOffset + 74, "Constipated:");
      doc.text(430, arrayLengthOffset + 74, data.constipated + " ");

      doc.text(295, arrayLengthOffset + 86, "Laxative:");
      doc.text(430, arrayLengthOffset + 86, data.laxative + " ");

      doc.text(295, arrayLengthOffset + 110, "Bladder Continent:");
      doc.text(430, arrayLengthOffset + 110, data.bladderContinent + " ");

      doc.text(295, arrayLengthOffset + 122, "Dribbles:");
      doc.text(430, arrayLengthOffset + 122, data.dribbles + " ");

      if (data.catheter == true) {
        doc.text(295, arrayLengthOffset + 134, "Catheter Description:");
        doc.text(430, arrayLengthOffset + 134, data.catheterDescribe + " ");
        arrayLengthOffset = arrayLengthOffset + 12;
      }

      arrayLengthOffset = arrayLengthOffset + 134;

      doc.text(295, arrayLengthOffset, "Toileting Device:");
      doc.text(430, arrayLengthOffset, data.toiletingDevice + " ");

      // mobility line
      doc.setDrawColor(255, 235, 59);
      doc.line(0, arrayLengthOffset + 38, 650, arrayLengthOffset + 38);
      doc.text(300, arrayLengthOffset + 41, "MOBILITY");

      doc.text(295, arrayLengthOffset + 62, "Inside Apartment:");
      doc.text(295, arrayLengthOffset + 74, "Use of Assistive Device:");
      doc.text(450, arrayLengthOffset + 74, data.insideApartment.useOfAssistiveDevice + " ");

      doc.text(295, arrayLengthOffset + 86, "Assitance with Device:");
      doc.text(450, arrayLengthOffset + 86, data.insideApartment.assitanceWithDevice + " ");

      doc.text(295, arrayLengthOffset + 98, "Special Ambulation Needs:");
      doc.text(450, arrayLengthOffset + 98, data.insideApartment.specialAmbulationNeeds + " ");

      doc.text(295, arrayLengthOffset + 122, "Outside Apartment:");
      doc.text(295, arrayLengthOffset + 134, "Use of Assistive Device:");
      doc.text(450, arrayLengthOffset + 134, data.toiletingDevice + " ");

      doc.text(295, arrayLengthOffset + 146, "Assitance with Device:");
      doc.text(450, arrayLengthOffset + 146, data.toiletingDevice + " ");

      doc.text(295, arrayLengthOffset + 158, "Special Ambulation Needs:");
      doc.text(450, arrayLengthOffset + 158, data.toiletingDevice + " ");

      doc.text(295, arrayLengthOffset + 182, "Transfers:");
      doc.text(450, arrayLengthOffset + 182, data.transfers + " ");

      if (data.fallRisk == true) {
        doc.text(295, arrayLengthOffset + 194, "Fall Risk Description:");
        doc.text(450, arrayLengthOffset + 194, data.fallRiskDescribe + " ");
        arrayLengthOffset = arrayLengthOffset + 12;
      }

      doc.text(295, arrayLengthOffset + 194, "Bed Reposition:");
      doc.text(450, arrayLengthOffset + 194, data.bedReposition + " ");

      arrayLengthOffset = arrayLengthOffset + 202

      // big vertical line
      doc.setDrawColor(120, 144, 156);
      doc.setLineWidth(220);
      doc.line(180, 0, 180, 800);

      // community title
      doc.setFontSize(16.6);
      doc.text(75, 40, data.communityName);

      // logo
      var logoPosX = 55,
        logoPosY = 55;
      var logoWidth = 190,
        logoHeight = 75;
      doc.addImage(imageData.getImage('transperent_logo'), 'PNG', logoPosX, logoPosY, logoPosX + logoWidth, logoPosY + logoHeight);

      // admin header
      doc.setTextColor(33, 33, 33);
      doc.setFontSize(16.6);
      doc.text(135, 220, "Care Plan");
      doc.text(164, 235, "for");
      doc.text(75, adminOffset, data.firstName);


      if (data.middleName !== "" || data.middleName === undefined) {
        adminOffset = adminOffset + 15;
        doc.text(75, adminOffset, data.middleName + " ");
      }

      doc.text(75, adminOffset + 15, data.lastName);

      // admin info
      doc.setFontSize(10);

      doc.text(147, adminOffset + 30, "Sex: " + data.sex);
      if (data.sex == "Female") {
        doc.text(99, adminOffset + 30, "Maiden Name: " + data.maidenName);
        adminOffset = adminOffset + 12;
      }
      doc.text(87, adminOffset + 42, "Date of Birth: " + residentFilteredBirthDate);
      doc.text(81, adminOffset + 54, "Admission Date: " + residentFilteredAdmissionDate);
      if (data.buildingStatus == "Moved Out") {
        doc.text(87, 42 + adminOffset, "Moved Out: " + movedOutTo);
        doc.text(87, 42 + adminOffset, "Reason: " + movedOutDescribe);
        adminOffset = adminOffset + 24;
      } else {
        doc.text(75, 66 + adminOffset, "Building Status: " + data.buildingStatus);
      }
      doc.text(81, adminOffset + 104, "Story about " + data.firstName + " " + data.lastName);
      doc.text(81, adminOffset + 116, "could go here");

      doc.addPage();
      doc.setLineWidth(25);
      var offset2 = 0;

      // nutrition line
      doc.setDrawColor(139, 195, 74);
      doc.line(0, 25, 650, 25);
      doc.text(300, 28, "NUTRITION");

      doc.text(20, 49, "Overall Nutrition:");
      doc.text(220, 49, data.overallNutrition + " ");

      if (data.overallNutrition == "Poor") {
        doc.text(20, 61, "Poor Nutrition Description:");
        doc.text(220, 61, data.poorNutritionDescribe + " ");
        offset2 = 12;
      }

      if (data.diabetic == true) {
        doc.text(20, 61 + offset2, "Diabetic Type:");
        doc.text(220, 61 + offset2, data.diabeticType + " ");

        doc.text(20, 73 + offset2, "Blood Sugar Monitoring:");
        doc.text(220, 73 + offset2, data.bloodSugarMonitoring + " ");
        offset2 = 12 + offset2;
      } else {
        doc.text(20, 61 + offset2, data.firstName + " is not diabetic");
      }

      doc.text(20, 73 + offset2, "Bedtime Snack:");
      doc.text(220, 73 + offset2, data.bedtimeSnack + " ");

      doc.text(20, 85 + offset2, "Adaptive Equipment:");
      doc.text(220, 85 + offset2, data.adaptiveEquipment + " ");

      doc.text(20, 97 + offset2, "Needs Food in Small Peices:");
      doc.text(220, 97 + offset2, data.needsFoodInSmallPeices + " ");

      doc.text(20, 109 + offset2, "Type of Diet:");
      doc.text(220, 109 + offset2, data.typeOfDiet + " ");

      doc.text(20, 121 + offset2, "Finger Foods:");
      doc.text(220, 121 + offset2, data.fingerFoods + " ");

      if (data.foodLikes.length !== 0) {
        doc.text(20, 133 + offset2, "Food Likes:");
        doc.text(220, 133 + offset2, data.foodLikes);
        doc.text(400, 133 + offset2, "likes length: " + data.foodLikes.length + " | offset2: " + offset2);
        offset2 = (data.foodLikes.length * 12) + offset2;
      }

      if (data.foodDislikes.length !== 0) {
        doc.text(20, 133 + offset2, "Food Dislikes:");
        doc.text(220, 133 + offset2, data.foodDislikes);
        doc.text(400, 133 + offset2, "dislikes length: " + data.foodDislikes.length + " | offset2: " + offset2);
        offset2 = (data.foodDislikes.length * 12) + offset2;
      }

      // pain line
      doc.setDrawColor(244, 67, 54);
      doc.line(0, 159 + offset2, 650, 159 + offset2);
      doc.text(300, 162 + offset2, "PAIN");

      if (data.hasPain == true) {
        doc.text(20, 186 + offset2, "Pain Location:");
        doc.text(220, 186 + offset2, data.painLocation + " ");

        doc.text(20, 198 + offset2, "Pain Description:");
        doc.text(220, 198 + offset2, data.painDescription + " ");

        doc.text(20, 210 + offset2, "Max Pain Time:");
        doc.text(220, 210 + offset2, data.maxPainTime + " ");

        doc.text(20, 222 + offset2, "Pain Increased By:");
        doc.text(220, 222 + offset2, data.painIncreasedBy + " ");

        doc.text(20, 234 + offset2, "Pain Decreased By:");
        doc.text(220, 234 + offset2, data.painDecreasedBy + " ");

        doc.text(20, 246 + offset2, "Pain Managed By:");
        doc.text(220, 246 + offset2, data.painManagedBy + " ");

        doc.text(20, 258 + offset2, "Pain Length:");
        doc.text(220, 258 + offset2, data.painLength + " ");

        offset2 = offset2 + 84;

      } else {
        doc.text(20, 186 + offset2, data.firstName + " has not mentioned pain");
      }

      // physical condition line
      doc.setDrawColor(33, 150, 243);
      doc.line(0, 212 + offset2, 650, 212 + offset2);
      doc.text(300, 215 + offset2, "PHYSICAL");

      doc.text(20, 236 + offset2, "Skin Condition:");
      doc.text(220, 236 + offset2, data.skinCondition + " ");

      if (data.hasWound == true) {
        doc.text(20, 248 + offset2, "Wound Description:");
        doc.text(220, 248 + offset2, data.hasWoundDescribe + " ");

        doc.text(20, 260 + offset2, "Wound Amount:");
        doc.text(220, 260 + offset2, data.woundAmount + " ");

        offset2 = offset2 + 24;
      }

      doc.text(20, 248 + offset2, "Right Ear:");
      doc.text(220, 248 + offset2, data.rightEar + " ");

      doc.text(20, 260 + offset2, "Left Ear:");
      doc.text(220, 260 + offset2, data.leftEar + " ");

      doc.text(20, 272 + offset2, "Hearing Notes:");
      doc.text(220, 272 + offset2, data.hearingNotes + " ");

      if (data.wearsHearingAid == true) {
        if (data.helpWithHearingAid == true) {
          doc.text(20, 284 + offset2, "Hearing Aid Help:");
          doc.text(220, 284 + offset2, data.helpWithHearingAidDescribe + " ");

          offset2 = offset2 + 12;
        }
      }

      doc.text(20, 284 + offset2, "Right Eye:");
      doc.text(220, 284 + offset2, data.rightEye + " ");

      doc.text(20, 296 + offset2, "Left Eye:");
      doc.text(220, 296 + offset2, data.leftEye + " ");

      doc.text(20, 308 + offset2, "Vision Notes:");
      doc.text(220, 308 + offset2, data.visionNotes + " ");

      doc.text(20, 320 + offset2, "Dentist Name:");
      doc.text(220, 320 + offset2, data.dentistName + " ");

      if (data.upperDentureFit == true) {
        doc.text(20, 332 + offset2, "Upper Denture Fit:");
        doc.text(220, 332 + offset2, data.upperDentureFitDescribe + " ");

        offset2 = offset2 + 12;
      }

      doc.text(20, 332 + offset2, "Upper Teeth:");
      doc.text(220, 332 + offset2, data.upperTeeth + " ");

      if (data.lowerDentureFit == true) {
        doc.text(20, 344 + offset2, "Lower Denture Fit:");
        doc.text(220, 344 + offset2, data.lowerDentureFitDescribe + " ");

        offset2 = offset2 + 12;
      }

      doc.text(20, 344 + offset2, "Lower Teeth:");
      doc.text(220, 344 + offset2, data.lowerTeeth + " ");

      doc.text(20, 356 + offset2, "Teeth Condition:");
      doc.text(220, 356 + offset2, data.teethCondition + " ");

      doc.addPage();
      doc.setLineWidth(25);
      var offset3 = 0;

      // psychosocial line
      doc.setDrawColor(156, 39, 176);
      doc.line(0, 25, 650, 25);
      doc.text(300, 28, "PSYCHOSOCIAL");

      if (data.psychosocialStatus.length !== 0) {
        doc.text(20, 49, "Psychosocial Status:");
        doc.text(220, 49, data.psychosocialStatus);
        offset3 = offset3 + (data.psychosocialStatus.length * 12) - 12;
      }

      doc.text(20, 61 + offset3, "Psychosocial Status Description:");
      doc.text(220, 61 + offset3, data.psychosocialStatusDescribe + " ");

      doc.text(20, 73 + offset3, "Comprehension:");
      doc.text(220, 73 + offset3, data.comprehension + " ");

      if (data.smokes == true) {
        doc.text(20, 85 + offset3, "Smokes:");
        doc.text(220, 85 + offset3, data.smokesDescribe);
        offset3 = offset3 + 12;
      }

      if (data.alcohol == true) {
        doc.text(20, 85 + offset3, "Alcohol:");
        doc.text(220, 85 + offset3, data.alcoholDescribes);
        offset3 = offset3 + 12;
      }

      if (data.sexualActive == true) {
        doc.text(20, 85 + offset3, "Sexual Activity:");
        doc.text(220, 85 + offset3, data.sexualActiveDescribe);
        offset3 = offset3 + 12;
      }

      doc.text(20, 85 + offset3, "Other Habits:");
      doc.text(220, 85 + offset3, data.otherHabits + " ");

      doc.text(20, 97 + offset3, "Activity Participation:");
      doc.text(220, 97 + offset3, data.generalActivityParticipation + " ");

      doc.text(20, 109 + offset3, "Dining Room Participation:");
      doc.text(220, 109 + offset3, data.diningRoomParticipation + " ");

      doc.text(20, 121 + offset3, "Bus Ride Participation:");
      doc.text(220, 121 + offset3, data.busRideParticipation + " ");

      doc.text(20, 133 + offset3, "Fitness Class Participation:");
      doc.text(220, 133 + offset3, data.fitnessClassParticipation + " ");

      doc.text(20, 145 + offset3, "Bingo Participation:");
      doc.text(220, 145 + offset3, data.bingoParticipation + " ");

      doc.text(20, 157 + offset3, "Community Participation:");
      doc.text(220, 157 + offset3, data.communityParticipation + " ");

      doc.text(20, 169 + offset3, "Time in Room:");
      doc.text(220, 169 + offset3, data.timeInRoom + " ");

      if (data.drivesCar == true) {
        doc.text(20, 181 + offset3, "License Plate Number:");
        doc.text(220, 181 + offset3, data.licensePlateNumber + " ");

        doc.text(20, 193 + offset3, "Spare Key Location:");
        doc.text(220, 193 + offset3, data.spareKeyLocation);

        doc.text(20, 205 + offset3, "Driving Needs:");
        doc.text(220, 205 + offset3, data.drivingNeeds);

        offset3 = offset3 + 36;
      }

      doc.text(20, 181 + offset3, "Prefered Activites:");
      doc.text(220, 181 + offset3, data.preferedActivites + " ");

      doc.text(20, 193 + offset3, "Uses Fitness Equipment Alone:");
      doc.text(220, 193 + offset3, data.useFitnessEquipmentIndependently + " ");

      doc.text(20, 205 + offset3, "Family Involvement:");
      doc.text(220, 205 + offset3, data.familyInvolvement + " ");

      doc.text(20, 217 + offset3, "High Maintenance:");
      doc.text(220, 217 + offset3, data.highMaintenance + " ");

      // sleep line
      doc.setDrawColor(233, 30, 99);
      doc.line(0, 255 + offset3, 650, 255 + offset3);
      doc.text(300, 258 + offset3, "SLEEP");

      doc.text(20, 279 + offset3, "Usual Bedtime:");
      doc.text(220, 279 + offset3, data.usualBedtime + " ");

      doc.text(20, 291 + offset3, "Usual Arising Time:");
      doc.text(220, 291 + offset3, data.usualArisingTime + " ");

      if (data.nap == true) {
        doc.text(20, 303 + offset3, "Nap Description:");
        doc.text(220, 303 + offset3, data.napDescribe + " ");

        offset3 = offset3 + 12;
      }

      doc.text(20, 303 + offset3, "Assistance to Bed:");
      doc.text(220, 303 + offset3, data.assistanceToBed + " ");

      if (data.sleepsThroughNight == true) {
        doc.text(20, 315 + offset3, "Can Call for Assistance:");
        doc.text(220, 315 + offset3, data.canCallForAssistance + " ");

        offset3 = offset3 + 12;
      }

      doc.addPage();
      doc.setLineWidth(25);
      var offset4 = 0;

      // vitals line
      doc.setDrawColor(205, 220, 57);
      doc.line(0, 25, 650, 25);
      doc.text(300, 28, "VITALS");

      doc.text(50, 100, "Temperature");
      doc.addImage(data.temperature, 'PNG', 50, 120, 150, 150);

      doc.text(210, 100, "Blood Pressure ");
      doc.addImage(data.bloodCanvas, 'PNG', 250, 120, 150, 150);

      doc.text(410, 100, "Respiration");
      doc.addImage(data.resp, 'PNG', 410, 120, 150, 150);


      doc.text(50, 300, "Oxygen Saturation");
      doc.addImage(data.oxygen, 'PNG', 50, 320, 150, 150);

      doc.text(210, 300, "Pulse");
      doc.addImage(data.pulse, 'PNG', 250, 320, 150, 150);

      doc.text(410, 300, "Pain");
      doc.addImage(data.vitals, 'PNG', 410, 320, 150, 150);

*/

      doc.save(fileName);
    }

    // Helper functions to make blue dots
    function createDots(x, y, end, doc, positionY) {

      var dots = [];
      var step = 10;

      if(end < x) {
        dots = _.range(end - step, x + step, step);
      } else {
        dots = _.range(x - step, end + step, step);
      }

      dots.forEach(function(pos) {
        doc.ellipse(pos, y + positionY, 2, 2, 'F');
      });

    }

    return {
      exportPdf : exportPdf
    };

  }

})();
