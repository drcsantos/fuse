// documentation: https://parall.ax/products/jspdf

(function() {
  angular.module("app.core").service("exportCarePlan", exportCarePlan);

  exportCarePlan.$inject = ['$filter', 'imageData'];

  function exportCarePlan($filter, imageData) {


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
        doc.text(data.foodAllergies, positionX, positionY);
        config.halfSpaceOffset += data.foodAllergies.length;
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
        doc.text(data.medicationAllergies, positionX, positionY);
        config.halfSpaceOffset += data.medicationAllergies.length;
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

////////////////////////////////////////// Assistance section

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

      positionX = config.startX;
      positionY = calculateY(config);
      doc.text("Outside their Apartment", positionX, positionY);
      config.halfSpaceOffset++;


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
