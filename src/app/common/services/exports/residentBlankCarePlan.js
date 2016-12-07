// documentation: https://parall.ax/products/jspdf

(function() {
  angular.module("app.core").service("exportBlankCarePlan", exportBlankCarePlan);

  exportBlankCarePlan.$inject = ['$filter', 'imageData'];

  function exportBlankCarePlan($filter, imageData) {

    function exportPdf(resident) {

      var exportDate = Date.now();

      var dateFilter = $filter('date');
      var filteredExportDate = dateFilter(exportDate, 'MMM d, yyyy');

      var doc = new jsPDF('p', 'pt');

      // export config
      doc.setFont("courier");
      doc.setFontType("normal");
      doc.setFontSize(12);
      doc.setLineWidth(1);

      // config variables
      var spaceBetweenLines = 24;
      var metaSpacing = 24;
      var coordsPerLetter = (594/82); // amount of page coordinates per letter in .length items
      var spaceBetweenOptionsHorizontal = 24; // horizontal spacing between the multiple choice options
      var spaceBetweenOptionsVertical = 16; // vertical spacing between the question and multiple choice options
      var numberOfOptionSpaces = 0;
      var optionsOffset = 5;
      var adminStartX = 215;
      var adminMid = 394;
      var midPoint = 300;
      var oneThird = 200;
      var twoThirds = 400;
      var startX = 15;
      var startY = 24;
      var endX = 580;
      var boxStartX = 10;
      var boxStartY = 10;
      var boxWidth = 575;
      var boxHeight = 8;

      // export date
      doc.text("Exported on", startX, startY);
      doc.text(filteredExportDate.toString(), startX, startY + spaceBetweenOptionsVertical);

      // community logo
      doc.rect(110, 10, 100, 100);
      doc.text("place holder", 120, 50);
      doc.text("for logo", 120, 62);

      // community info
      doc.text("Phone", adminStartX, startY + (metaSpacing * 0));
      doc.text("(719) 587-3514", 275, startY + (metaSpacing * 0));

      doc.text("Fax", adminStartX, startY + (metaSpacing * 1));
      doc.text("(719) 589-3614", 275, startY + (metaSpacing * 1));

      doc.text("Address", adminStartX, startY + (metaSpacing * 2));
      doc.text("3407 Carroll St Alamoa CO, 81101", 275, startY + (metaSpacing * 2));

      doc.text("Website", adminStartX, startY + (metaSpacing * 3));
      doc.text("AlamosaBridge.com", 275, startY + (metaSpacing * 3));

      // resident picture
      doc.rect(10, 120, 200, 280);
      doc.text("place holder", 60, 250);
      doc.text("for resident picture", 60, 262);

      // resident admin info
      doc.text("First Name", adminStartX, startY + (spaceBetweenLines * 5));
      doc.line(
        adminStartX + ("First Name".length * coordsPerLetter),
        startY + (spaceBetweenLines * 5),
        endX,
        startY + (spaceBetweenLines * 5)
      );

      doc.text("Preferred Name", adminStartX, startY + (spaceBetweenLines * 6));
      doc.line(
        adminStartX + ("Preferred Name".length * coordsPerLetter),
        startY + (spaceBetweenLines * 6),
        endX,
        startY + (spaceBetweenLines * 6)
      );

      doc.text("Middle Name", adminStartX, startY + (spaceBetweenLines * 7));
      doc.line(
        adminStartX + ("Middle Name".length * coordsPerLetter),
        startY + (spaceBetweenLines * 7),
        endX,
        startY + (spaceBetweenLines * 7)
      );

      doc.text("Last Name", adminStartX, startY + (spaceBetweenLines * 8));
      doc.line(
        adminStartX + ("Last Name".length * coordsPerLetter),
        startY + (spaceBetweenLines * 8),
        endX,
        startY + (spaceBetweenLines * 8)
      );

      doc.text("Maiden Name", adminStartX, startY + (spaceBetweenLines * 9));
      doc.line(
        adminStartX + ("Maiden Name".length * coordsPerLetter),
        startY + (spaceBetweenLines * 9),
        endX,
        startY + (spaceBetweenLines * 9)
      );

      doc.text("Moved From (Town)", adminStartX, startY + (spaceBetweenLines * 10));
      doc.line(
        adminStartX + ("Moved From (Town)".length * coordsPerLetter),
        startY + (spaceBetweenLines * 10),
        endX,
        startY + (spaceBetweenLines * 10)
      );

      doc.text("Primary Doctor", adminStartX, startY + (spaceBetweenLines * 11));
      doc.line(
        adminStartX + ("Primary Doctor".length * coordsPerLetter),
        startY + (spaceBetweenLines * 11),
        endX,
        startY + (spaceBetweenLines * 11)
      );

      doc.text("Pharmacy", adminStartX, startY + (spaceBetweenLines * 12));
      doc.line(
        adminStartX + ("Pharmacy".length * coordsPerLetter),
        startY + (spaceBetweenLines * 12),
        endX,
        startY + (spaceBetweenLines * 12)
      );

      doc.text("Date of Birth", adminStartX, startY + (spaceBetweenLines * 13));
      doc.line(
        adminStartX + ("Date of Birth".length * coordsPerLetter),
        startY + (spaceBetweenLines * 13),
        adminMid - 2,
        startY + (spaceBetweenLines * 13)
      );

      doc.text("Admission Date", adminMid, startY + (spaceBetweenLines * 13));
      doc.line(
        adminMid + ("Admission Date".length * coordsPerLetter),
        startY + (spaceBetweenLines * 13),
        endX,
        startY + (spaceBetweenLines * 13)
      );

      doc.text("Floor", adminStartX, startY + (spaceBetweenLines * 14));
      doc.line(
        adminStartX + ("Floor".length * coordsPerLetter),
        startY + (spaceBetweenLines * 14),
        adminMid - 2,
        startY + (spaceBetweenLines * 14)
      );

      doc.text("Room", adminMid, startY + (spaceBetweenLines * 14));
      doc.line(
        adminMid + ("Room".length * coordsPerLetter),
        startY + (spaceBetweenLines * 14),
        endX,
        startY + (spaceBetweenLines * 14)
      );

      doc.text("Full Code", adminStartX, startY + (spaceBetweenLines * 15));
      doc.text("Yes",
        adminStartX + 5,
        startY + (spaceBetweenLines * 15) + spaceBetweenOptionsVertical);
      doc.text("No",
        adminStartX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 15) + spaceBetweenOptionsVertical);

      doc.text("Sex", adminMid, startY + (spaceBetweenLines * 15));
      doc.text("Male",
        adminMid + optionsOffset,
        startY + (spaceBetweenLines * 15) + spaceBetweenOptionsVertical);
      doc.text("Female",
        adminMid + optionsOffset + ("Male".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 15) + spaceBetweenOptionsVertical);
      doc.text("Other",
        adminMid + optionsOffset + ("Female".length * coordsPerLetter) + ("Male".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 15) + spaceBetweenOptionsVertical);

      doc.text("Assessment Interval", startX, startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 1));
      doc.text("None",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 2));
      doc.text("Weekly",
        startX + optionsOffset + ("None".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 2));
      doc.text("Monthly",
        startX + optionsOffset + ("None".length * coordsPerLetter) + ("Weekly".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 2));
      doc.text("Quarterly",
        startX + optionsOffset + ("None".length * coordsPerLetter) + ("Weekly".length * coordsPerLetter) + ("Monthly".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 2));
      doc.text("Yearly",
        startX + optionsOffset + ("None".length * coordsPerLetter) + ("Weekly".length * coordsPerLetter) + ("Monthly".length * coordsPerLetter) + ("Quarterly".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 4),
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 2));

      doc.text("Marital Status", startX, startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 2));
      doc.text("Single",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 3));
      doc.text("Divorced",
        startX + optionsOffset + ("Single".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 3));
      doc.text("Widowed",
        startX + optionsOffset + ("Single".length * coordsPerLetter) + ("Divorced".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 3));
      doc.text("Married",
        startX + optionsOffset + ("Single".length * coordsPerLetter) + ("Divorced".length * coordsPerLetter) + ("Widowed".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 3));
      doc.text("Single Never Married",
        startX + optionsOffset + ("Single".length * coordsPerLetter) + ("Divorced".length * coordsPerLetter) + ("Widowed".length * coordsPerLetter) + ("Married".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 4),
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 3));

      doc.text("Long Term Care Insurance", startX, startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 3));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 4));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 4));

      doc.text("Receiving Long Term Care Insurance", midPoint, startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 3));
      doc.text("Yes",
        midPoint + optionsOffset,
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 4));
      doc.text("No",
        midPoint + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 4));

      doc.text("Appointment Coordination", startX, startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 4));
      doc.text("Self",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 5));
      doc.text("Assist",
        startX + optionsOffset + ("Self".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 5));
      doc.text("Family",
        startX + optionsOffset + ("Self".length * coordsPerLetter) + ("Assist".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 5));

      doc.text("Veteran", midPoint, startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 4));
      doc.text("Yes",
        midPoint + optionsOffset,
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 5));
      doc.text("No",
        midPoint + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 5));

      doc.text("Handles Finances", startX, startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 5));
      doc.line(
        startX + ("Handles Finances".length * coordsPerLetter),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 5),
        endX,
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 5));

      doc.text("Notes", startX, startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 5));
      doc.line(
        startX + ("Notes".length * coordsPerLetter),
        startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 5),
        endX,
        startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 5));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 5),
        endX,
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 5));

      doc.addPage();
      boxHeight = 0;

      doc.text("Life", startX, startY + (spaceBetweenLines * 0));
      boxHeight += (spaceBetweenLines * 1);

      doc.text("Religion", startX, startY + (spaceBetweenLines * 1));
      doc.line(
        startX + ("Religion".length * coordsPerLetter),
        startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0),
        endX,
        startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0),
        endX,
        startY + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 0),
        endX,
        startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 0));
      boxHeight += (spaceBetweenLines * 3);

      doc.text("Education", startX, startY + (spaceBetweenLines * 4));
      doc.line(
        startX + ("Education".length * coordsPerLetter),
        startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 0),
        endX,
        startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 0));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 0),
        endX,
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 0));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 0),
        endX,
        startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 0));
      boxHeight += (spaceBetweenLines * 3);

      doc.text("Occupation", startX, startY + (spaceBetweenLines * 7));
      doc.line(
        startX + ("Occupation".length * coordsPerLetter),
        startY + (spaceBetweenLines * 7) + (spaceBetweenOptionsVertical * 0),
        endX,
        startY + (spaceBetweenLines * 7) + (spaceBetweenOptionsVertical * 0));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 0),
        endX,
        startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 0));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 0),
        endX,
        startY + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 0));
      boxHeight += (spaceBetweenLines * 3);

      doc.text("Outside Agency", startX, startY + (spaceBetweenLines * 10));
      doc.line(
        startX + ("Outside Agency".length * coordsPerLetter),
        startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 0),
        endX,
        startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 0));
      boxHeight += (spaceBetweenLines * 1);

      doc.text("Speech", startX, startY + (spaceBetweenLines * 11));
      boxHeight += (spaceBetweenLines * 1);

      doc.text("Easily Understood", startX, startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 0));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 1));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 1));

      doc.text("English as Primary Language", midPoint, startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 0));
      doc.text("Yes",
        midPoint + optionsOffset,
        startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 1));
      doc.text("No",
        midPoint + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 1));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Other Languages", startX, startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 1));
      doc.line(
        startX + ("Other Languages".length * coordsPerLetter),
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 1),
        endX,
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 1));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Items", startX, startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 1));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Heating Pad", startX, startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 1));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 2));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 2));

      doc.text("Microwave", oneThird, startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 1));
      doc.text("Yes",
        oneThird + optionsOffset,
        startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 2));
      doc.text("No",
        oneThird + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 2));

      doc.text("Extension Cord", twoThirds, startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 1));
      doc.text("Yes",
        twoThirds + optionsOffset,
        startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 2));
      doc.text("No",
        twoThirds + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 2));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Notes", startX, startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 2));
      doc.line(
        startX + ("Notes".length * coordsPerLetter),
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 0) + (spaceBetweenOptionsVertical * 2),
        endX,
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 0) + (spaceBetweenOptionsVertical * 2));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 2),
        endX,
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 2));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 2),
        endX,
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 2));
      boxHeight += ((spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 1));

      doc.rect(boxStartX, boxStartY, boxWidth, boxHeight);

/////////////////////////////////////////////////////////////// Allergies

      boxHeight = 0;
      doc.text("Allergies", startX, startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 2));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Medication Allergies", startX, startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 2));
      doc.line(startX,
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 2),
        180,
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 2));
      doc.line(startX,
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 2),
        180,
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 2));
      doc.line(startX,
        startY + (spaceBetweenLines * 24) + (spaceBetweenOptionsVertical * 2),
        180,
        startY + (spaceBetweenLines * 24) + (spaceBetweenOptionsVertical * 2));
      doc.line(startX,
        startY + (spaceBetweenLines * 25) + (spaceBetweenOptionsVertical * 2),
        180,
        startY + (spaceBetweenLines * 25) + (spaceBetweenOptionsVertical * 2));
      doc.line(startX,
        startY + (spaceBetweenLines * 26) + (spaceBetweenOptionsVertical * 2),
        180,
        startY + (spaceBetweenLines * 26) + (spaceBetweenOptionsVertical * 2));
      doc.line(startX,
        startY + (spaceBetweenLines * 27) + (spaceBetweenOptionsVertical * 2),
        180,
        startY + (spaceBetweenLines * 27) + (spaceBetweenOptionsVertical * 2));

      doc.text("Food Allergies", oneThird, startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 2));
      doc.line(oneThird,
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 2),
        380,
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 2));
      doc.line(oneThird,
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 2),
        380,
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 2));
      doc.line(oneThird,
        startY + (spaceBetweenLines * 24) + (spaceBetweenOptionsVertical * 2),
        380,
        startY + (spaceBetweenLines * 24) + (spaceBetweenOptionsVertical * 2));
      doc.line(oneThird,
        startY + (spaceBetweenLines * 25) + (spaceBetweenOptionsVertical * 2),
        380,
        startY + (spaceBetweenLines * 25) + (spaceBetweenOptionsVertical * 2));
      doc.line(oneThird,
        startY + (spaceBetweenLines * 26) + (spaceBetweenOptionsVertical * 2),
        380,
        startY + (spaceBetweenLines * 26) + (spaceBetweenOptionsVertical * 2));
      doc.line(oneThird,
        startY + (spaceBetweenLines * 27) + (spaceBetweenOptionsVertical * 2),
        380,
        startY + (spaceBetweenLines * 27) + (spaceBetweenOptionsVertical * 2));

      doc.text("Other Allergies", twoThirds, startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 2));
      doc.line(twoThirds,
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 2),
        580,
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 2));
      doc.line(twoThirds,
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 2),
        580,
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 2));
      doc.line(twoThirds,
        startY + (spaceBetweenLines * 24) + (spaceBetweenOptionsVertical * 2),
        580,
        startY + (spaceBetweenLines * 24) + (spaceBetweenOptionsVertical * 2));
      doc.line(twoThirds,
        startY + (spaceBetweenLines * 25) + (spaceBetweenOptionsVertical * 2),
        580,
        startY + (spaceBetweenLines * 25) + (spaceBetweenOptionsVertical * 2));
      doc.line(twoThirds,
        startY + (spaceBetweenLines * 26) + (spaceBetweenOptionsVertical * 2),
        580,
        startY + (spaceBetweenLines * 26) + (spaceBetweenOptionsVertical * 2));
      doc.line(twoThirds,
        startY + (spaceBetweenLines * 27) + (spaceBetweenOptionsVertical * 2),
        580,
        startY + (spaceBetweenLines * 27) + (spaceBetweenOptionsVertical * 2));
      boxHeight += ((spaceBetweenLines * 7) + (spaceBetweenOptionsVertical * 0));

      doc.text("Notes", startX, startY + (spaceBetweenLines * 28) + (spaceBetweenOptionsVertical * 2));
      doc.line(
        startX + ("Notes".length * coordsPerLetter),
        startY + (spaceBetweenLines * 28) + (spaceBetweenOptionsVertical * 0) + (spaceBetweenOptionsVertical * 2),
        endX,
        startY + (spaceBetweenLines * 28) + (spaceBetweenOptionsVertical * 0) + (spaceBetweenOptionsVertical * 2));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 29) + (spaceBetweenOptionsVertical * 2),
        endX,
        startY + (spaceBetweenLines * 29) + (spaceBetweenOptionsVertical * 2));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 30) + (spaceBetweenOptionsVertical * 2),
        endX,
        startY + (spaceBetweenLines * 30) + (spaceBetweenOptionsVertical * 2));
      boxHeight += ((spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 1));

      doc.rect(boxStartX,
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 1),
        boxWidth, boxHeight);

      doc.addPage();
      boxHeight = 0;

////////////////////////////////////////////////////////////// Assistance

      doc.text("Assistance", startX, startY);
      boxHeight += (spaceBetweenLines * 1);

      doc.text("Assist with Hair", startX, startY + (spaceBetweenLines * 1));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Has Barber", oneThird, startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));
      doc.text("Yes",
        oneThird + optionsOffset,
        startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));
      doc.text("No",
        oneThird + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Assist with Shaving", twoThirds, startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));
      doc.text("Yes",
        twoThirds + optionsOffset,
        startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));
      doc.text("No",
        twoThirds + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Assist with Finger Nails", startX, startY + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 1));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 2));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 2));

      doc.text("Assist with Toe Nails", twoThirds, startY + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 1));
      doc.text("Yes",
        twoThirds + optionsOffset,
        startY + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 2));
      doc.text("No",
        twoThirds + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 2));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Assist with Makeup", startX, startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 2));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 3));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 3));

      doc.text("Assist with Jewelry", oneThird, startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 2));
      doc.text("Yes",
        oneThird + optionsOffset,
        startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 3));
      doc.text("No",
        oneThird + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 3));

      doc.text("Assist with Lotion", twoThirds, startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 2));
      doc.text("Yes",
        twoThirds + optionsOffset,
        startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 3));
      doc.text("No",
        twoThirds + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 3));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Layout Cloths", startX, startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 3));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 4));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 4));

      doc.text("Assist with Shoes", oneThird, startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 3));
      doc.text("Yes",
        oneThird + optionsOffset,
        startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 4));
      doc.text("No",
        oneThird + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 4));

      doc.text("Assist with Top", twoThirds, startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 3));
      doc.text("Yes",
        twoThirds + optionsOffset,
        startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 4));
      doc.text("No",
        twoThirds + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 4));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Assist with Buttons", startX, startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 4));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 5));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 5));

      doc.text("Assist with Zippers", oneThird, startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 4));
      doc.text("Yes",
        oneThird + optionsOffset,
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 5));
      doc.text("No",
        oneThird + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 5));

      doc.text("Assist with Bottom", twoThirds, startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 4));
      doc.text("Yes",
        twoThirds + optionsOffset,
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 5));
      doc.text("No",
        twoThirds + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 5));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Notes", startX, startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 5));
      doc.line(
        startX + ("Notes".length * coordsPerLetter),
        startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 5),
        endX,
        startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 5));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 7) + (spaceBetweenOptionsVertical * 5),
        endX,
        startY + (spaceBetweenLines * 7) + (spaceBetweenOptionsVertical * 5));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 1));

      doc.rect(boxStartX, boxStartY, boxWidth, boxHeight);

//////////////////////////////////////////////////////////////// mobility

      boxHeight = 0;
      doc.text("Mobility", startX, startY + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 5));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Inside Apartment", startX, startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 5));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Use of Assistive Device", startX, startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 5));
      doc.text("Walker",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 6));
      doc.text("Cane",
        startX + optionsOffset + ("Walker".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 6));
      doc.text("Wheelchair",
        startX + optionsOffset + ("Walker".length * coordsPerLetter) + ("Cane".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 6));
      doc.text("Electric Wheelchair",
        startX + optionsOffset + ("Walker".length * coordsPerLetter) + ("Cane".length * coordsPerLetter) + ("Wheelchair".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 6));
      doc.text("No Device",
        startX + optionsOffset + ("Walker".length * coordsPerLetter) + ("Cane".length * coordsPerLetter) + ("Wheelchair".length * coordsPerLetter) + ("Electric Wheelchair".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 4),
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 6));
      doc.text("Other",
        startX + optionsOffset + ("Walker".length * coordsPerLetter) + ("Cane".length * coordsPerLetter) + ("Wheelchair".length * coordsPerLetter) + ("Electric Wheelchair".length * coordsPerLetter) + ("No Device".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 5),
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 6));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Assistance with Device", startX, startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 6));
      doc.line(
        startX + ("Assistance with Device".length * coordsPerLetter),
        startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 6),
        endX,
        startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 6));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 6),
        endX,
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 6));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Special Ambulation Needs", startX, startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 6));
      doc.line(
        startX + ("Special Ambulation Needs".length * coordsPerLetter),
        startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 6),
        endX,
        startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 6));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 6),
        endX,
        startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 6));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Mobility Equipment", startX, startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 6));
      doc.text("Transfer Pole",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 7));
      doc.text("Side Rails",
        startX + optionsOffset + ("Transfer Pole".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 7));
      doc.text("Pivot Transfer",
        startX + optionsOffset + ("Transfer Pole".length * coordsPerLetter) + ("Side Rails".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 7));
      doc.text("Lift Recliner",
        startX + optionsOffset + ("Transfer Pole".length * coordsPerLetter) + ("Side Rails".length * coordsPerLetter) + ("Lift Recliner".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 7));
      doc.text("Transfer Lift",
        startX + optionsOffset + ("Transfer Pole".length * coordsPerLetter) + ("Side Rails".length * coordsPerLetter) + ("Lift Recliner".length * coordsPerLetter) + ("Transfer Lift".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 4),
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 7));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Outside Apartment", startX, startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 7));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Use of Assistive Device", startX, startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 7));
      doc.text("Walker",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 8));
      doc.text("Cane",
        startX + optionsOffset + ("Walker".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 8));
      doc.text("Wheelchair",
        startX + optionsOffset + ("Walker".length * coordsPerLetter) + ("Cane".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 8));
      doc.text("Electric Wheelchair",
        startX + optionsOffset + ("Walker".length * coordsPerLetter) + ("Cane".length * coordsPerLetter) + ("Wheelchair".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 8));
      doc.text("No Device",
        startX + optionsOffset + ("Walker".length * coordsPerLetter) + ("Cane".length * coordsPerLetter) + ("Wheelchair".length * coordsPerLetter) + ("Electric Wheelchair".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 4),
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 8));
      doc.text("Other",
        startX + optionsOffset + ("Walker".length * coordsPerLetter) + ("Cane".length * coordsPerLetter) + ("Wheelchair".length * coordsPerLetter) + ("Electric Wheelchair".length * coordsPerLetter) + ("No Device".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 5),
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 8));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Assistance with Device", startX, startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 8));
      doc.line(
        startX + ("Assistance with Device".length * coordsPerLetter),
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 8),
        endX,
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 8));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 8),
        endX,
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 8));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Special Ambulation Needs", startX, startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 8));
      doc.line(
        startX + ("Special Ambulation Needs".length * coordsPerLetter),
        startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 8),
        endX,
        startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 8));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 8),
        endX,
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 8));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Transfers", startX, startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 8));
      doc.text("Independent",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 9));
      doc.text("Standby",
        startX + optionsOffset + ("Independent".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 9));
      doc.text("Full Assist",
        startX + optionsOffset + ("Independent".length * coordsPerLetter) + ("Standby".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 9));
      doc.text("Transfer Pole",
        startX + optionsOffset + ("Independent".length * coordsPerLetter) + ("Standby".length * coordsPerLetter) + ("Full Assist".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 9));
      doc.text("Gait Belt",
        startX + optionsOffset + ("Independent".length * coordsPerLetter) + ("Standby".length * coordsPerLetter) + ("Full Assist".length * coordsPerLetter) + ("Transfer Pole".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 4),
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 9));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Transfers Description", startX, startY + (spaceBetweenLines * 24) + (spaceBetweenOptionsVertical * 9));
      doc.line(
        startX + ("Transfers Description".length * coordsPerLetter),
        startY + (spaceBetweenLines * 24) + (spaceBetweenOptionsVertical * 9),
        endX,
        startY + (spaceBetweenLines * 24) + (spaceBetweenOptionsVertical * 9));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 25) + (spaceBetweenOptionsVertical * 9),
        endX,
        startY + (spaceBetweenLines * 25) + (spaceBetweenOptionsVertical * 9));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Fall Risk", startX, startY + (spaceBetweenLines * 26) + (spaceBetweenOptionsVertical * 9));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 26) + (spaceBetweenOptionsVertical * 10));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 26) + (spaceBetweenOptionsVertical * 10));

      doc.text("Fall Risk Description", oneThird, startY + (spaceBetweenLines * 26) + (spaceBetweenOptionsVertical * 9));
      doc.line(
        oneThird + ("Fall Risk Description".length * coordsPerLetter),
        startY + (spaceBetweenLines * 26) + (spaceBetweenOptionsVertical * 9),
        endX,
        startY + (spaceBetweenLines * 26) + (spaceBetweenOptionsVertical * 9));
      doc.line(
        oneThird,
        startY + (spaceBetweenLines * 27) + (spaceBetweenOptionsVertical * 9),
        endX,
        startY + (spaceBetweenLines * 27) + (spaceBetweenOptionsVertical * 9));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));
      boxHeight += 20;

      doc.rect(boxStartX, startY + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 4), boxWidth, boxHeight);
      doc.addPage();
      boxHeight = 0;

      doc.text("Bed Repositioning", startX, startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 0));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 1));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 1));

      doc.text("Two Person Lift", twoThirds, startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 0));
      doc.text("Yes",
        twoThirds + optionsOffset,
        startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 1));
      doc.text("No",
        twoThirds + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 1));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Bed Reposition Description", startX, startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));
      doc.line(
        startX + ("Bed Reposition Description".length * coordsPerLetter),
        startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1),
        endX,
        startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 1),
        endX,
        startY + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 1));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Bed Reposition Outside Agency", startX, startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 1));
      doc.line(
        startX + ("Bed Reposition Outside Agency".length * coordsPerLetter),
        startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 1),
        endX,
        startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 1));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 1),
        endX,
        startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 1));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Notes", startX, startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 1));
      doc.line(
        startX + ("Notes".length * coordsPerLetter),
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 1),
        endX,
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 1));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 1),
        endX,
        startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 1));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 1));

      doc.rect(boxStartX, boxStartY - 10, boxWidth, boxHeight + 10);

/////////////////////////////////////////////////////////////// Sleep

      boxHeight = 0;
      doc.text("Sleep", startX, startY + (spaceBetweenLines * 7) + (spaceBetweenOptionsVertical * 3));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Usual Bedtime", startX, startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 3));
      doc.line(
        startX + ("Usual Bedtime".length * coordsPerLetter),
        startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 3),
        endX,
        startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 3));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Usual Arising Time", startX, startY + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 3));
      doc.line(
        startX + ("Usual Arising Time".length * coordsPerLetter),
        startY + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 3),
        endX,
        startY + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 3));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Naps", startX, startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 3));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 4));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 4));

      doc.text("Nap Description", oneThird, startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 3));
      doc.line(
        oneThird + ("Nap Description".length * coordsPerLetter),
        startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 3),
        endX,
        startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 3));
      doc.line(
        oneThird,
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 3),
        endX,
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 3));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Assistance to Bed", startX, startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 3));
      doc.text("Medication",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 4));
      doc.text("Positioning",
        startX + optionsOffset + ("Medication".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 4));
      doc.text("Pillows",
        startX + optionsOffset + ("Medication".length * coordsPerLetter) + ("Positioning".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 4));
      doc.text("Drink",
        startX + optionsOffset + ("Medication".length * coordsPerLetter) + ("Positioning".length * coordsPerLetter) + ("Pillows".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 4));
      doc.text("Alcohol",
        startX + optionsOffset + ("Medication".length * coordsPerLetter) + ("Positioning".length * coordsPerLetter) + ("Pillows".length * coordsPerLetter) + ("Drink".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 4),
        startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 4));
      doc.text("Hot Tea",
        startX + optionsOffset + ("Medication".length * coordsPerLetter) + ("Positioning".length * coordsPerLetter) + ("Pillows".length * coordsPerLetter) + ("Drink".length * coordsPerLetter) + ("Alcohol".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 5),
        startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 4));
      doc.text("Warm Milk",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 5));
      doc.text("Other",
        startX + optionsOffset + ("Warm Milk".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 5));
      doc.text("None",
        startX + optionsOffset + ("Warm Milk".length * coordsPerLetter) + ("Other".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 5));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 2));

      doc.text("Sleeps through the Night", startX, startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 5));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 6));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 6));

      doc.text("Can Call for Assistance", twoThirds, startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 5));
      doc.text("Yes",
        twoThirds + optionsOffset,
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 6));
      doc.text("No",
        twoThirds + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 6));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Notes", startX, startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 6));
      doc.line(
        startX + ("Notes".length * coordsPerLetter),
        startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 6),
        endX,
        startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 6));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 6),
        endX,
        startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 6));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 1));

      doc.rect(boxStartX, startY + (spaceBetweenLines * 7) + (spaceBetweenOptionsVertical * 2), boxWidth, boxHeight);

/////////////////////////////////////////////////////////////// Nutrition

      boxHeight = 0;
      doc.text("Nutrition", startX, startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 6));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Overall Nutrition", startX, startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 6));
      doc.text("Good",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 7));
      doc.text("Poor",
        startX + optionsOffset + ("Good".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 7));

      doc.text("Poor Nutrition Description", oneThird, startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 6));
      doc.line(
        oneThird + ("Poor Nutrition Description".length * coordsPerLetter),
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 6),
        endX,
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 6));
      doc.line(
        oneThird,
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 6),
        endX,
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 6));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Diabetic", startX, startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 6));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 7));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 7));

      doc.text("Blood Sugar Monitoring", oneThird, startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 6));
      doc.text("Yes",
        oneThird + optionsOffset,
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 7));
      doc.text("No",
        oneThird + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 7));

      doc.text("Bedtime Snack", twoThirds, startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 6));
      doc.text("Yes",
        twoThirds + optionsOffset,
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 7));
      doc.text("No",
        twoThirds + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 7));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Diabetic Type", startX, startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 7));
      doc.text("Diet Controlled",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 8));
      doc.text("Medication Controlled",
        startX + optionsOffset + ("Diet Controlled".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 8));
      doc.text("Insulin Controlled",
        startX + optionsOffset + ("Diet Controlled".length * coordsPerLetter) + ("Medication Controlled".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 8));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Adaptive Equipment", startX, startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 8));
      doc.text("Plate Guard",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 9));
      doc.text("Built Up Silverware",
        startX + optionsOffset + ("Plate Guard".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 9));
      doc.text("Special Cups",
        startX + optionsOffset + ("Plate Guard".length * coordsPerLetter) + ("Built Up Silverware".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 9));
      doc.text("None",
        startX + optionsOffset + ("Plate Guard".length * coordsPerLetter) + ("Built Up Silverware".length * coordsPerLetter) + ("Special Cups".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 9));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Type of Diet", startX, startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 9));
      doc.text("BRAT",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 10));
      doc.text("Gluten Free",
        startX + optionsOffset + ("BRAT".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 10));
      doc.text("Full Vegan",
        startX + optionsOffset + ("BRAT".length * coordsPerLetter) + ("Gluten Free".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 10));
      doc.text("Partial Vegan",
        startX + optionsOffset + ("BRAT".length * coordsPerLetter) + ("Gluten Free".length * coordsPerLetter) + ("Full Vegan".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 10));
      doc.text("Lactose Free",
        startX + optionsOffset + ("BRAT".length * coordsPerLetter) + ("Gluten Free".length * coordsPerLetter) + ("Full Vegan".length * coordsPerLetter) + ("Partial Vegan".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 4),
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 10));
      doc.text("Other",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 11));
      doc.text("Regular",
        startX + optionsOffset + ("Other".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 11));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 2));

      doc.text("Special Diet", startX, startY + (spaceBetweenLines * 24) + (spaceBetweenOptionsVertical * 11));
      doc.text("Pureed",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 24) + (spaceBetweenOptionsVertical * 12));
      doc.text("Ground",
        startX + optionsOffset + ("Pureed".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 24) + (spaceBetweenOptionsVertical * 12));
      doc.text("Soft",
        startX + optionsOffset + ("Pureed".length * coordsPerLetter) + ("Ground".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 24) + (spaceBetweenOptionsVertical * 12));
      doc.text("Regular",
        startX + optionsOffset + ("Pureed".length * coordsPerLetter) + ("Ground".length * coordsPerLetter) + ("Soft".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 24) + (spaceBetweenOptionsVertical * 12));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Finger Foods", startX, startY + (spaceBetweenLines * 25) + (spaceBetweenOptionsVertical * 12));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 25) + (spaceBetweenOptionsVertical * 13));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 25) + (spaceBetweenOptionsVertical * 13));

      doc.text("Food in Room", oneThird, startY + (spaceBetweenLines * 25) + (spaceBetweenOptionsVertical * 12));
      doc.text("Yes",
        oneThird + optionsOffset,
        startY + (spaceBetweenLines * 25) + (spaceBetweenOptionsVertical * 13));
      doc.text("No",
        oneThird + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 25) + (spaceBetweenOptionsVertical * 13));

      doc.text("Drink in Room", twoThirds, startY + (spaceBetweenLines * 25) + (spaceBetweenOptionsVertical * 12));
      doc.text("Yes",
        twoThirds + optionsOffset,
        startY + (spaceBetweenLines * 25) + (spaceBetweenOptionsVertical * 13));
      doc.text("No",
        twoThirds + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 25) + (spaceBetweenOptionsVertical * 13));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.rect(boxStartX, startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 5), boxWidth, boxHeight + 10);

      doc.addPage();
      boxHeight = 0;

      doc.text("Food Assistance", startX, startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 0));
      doc.text("Independent",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 1));
      doc.text("Reminder",
        startX + optionsOffset + ("Independent".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 1));
      doc.text("Partial Assistance",
        startX + optionsOffset + ("Independent".length * coordsPerLetter) + ("Reminder".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 1));
      doc.text("Full Assistance",
        startX + optionsOffset + ("Independent".length * coordsPerLetter) + ("Reminder".length * coordsPerLetter) + ("Partial Assistance".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 1));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Notes", startX, startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));
      doc.line(
        startX + ("Notes".length * coordsPerLetter),
        startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1),
        endX,
        startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 1),
        endX,
        startY + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 1));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 1));

      doc.rect(boxStartX, boxStartY - 10, boxWidth, boxHeight + 10);

////////////////////////////////////////////////////////////// Physical Condition

      boxHeight = 0;
      doc.text("Physical Condition", startX, startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 3));
      doc.text("Skin", startX, startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 3));

      doc.text("Skin Condition", startX, startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 3));
      doc.text("Average",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 4));
      doc.text("Tears Easily",
        startX + optionsOffset + ("Average".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 4));

      doc.text("At Risk for Skin Breakdown", twoThirds - 20, startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 3));
      doc.text("Yes",
        twoThirds - 20 + optionsOffset,
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 4));
      doc.text("No",
        twoThirds - 20 + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 4));

      doc.text("Has a Wound", startX, startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 4));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 5));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 5));

      doc.text("Wound Amount", oneThird, startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 4));
      doc.line(
        oneThird + ("Wound Amount".length * coordsPerLetter),
        startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 4),
        endX,
        startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 4));

      doc.text("Wound Description", startX, startY + (spaceBetweenLines * 7) + (spaceBetweenOptionsVertical * 5));
      doc.line(
        startX + ("Wound Description".length * coordsPerLetter),
        startY + (spaceBetweenLines * 7) + (spaceBetweenOptionsVertical * 5),
        endX,
        startY + (spaceBetweenLines * 7) + (spaceBetweenOptionsVertical * 5));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 5),
        endX,
        startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 5));

      doc.text("Infection", startX, startY + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 5));

      doc.text("UTI Risk", startX, startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 5));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 6));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 6));

      doc.text("URI Risk", oneThird, startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 5));
      doc.text("Yes",
        oneThird + optionsOffset,
        startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 6));
      doc.text("No",
        oneThird + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 6));

      doc.text("MRSA Risk", twoThirds, startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 5));
      doc.text("Yes",
        twoThirds + optionsOffset,
        startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 6));
      doc.text("No",
        twoThirds + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 6));

      doc.text("VRE Risk", startX, startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 6));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 7));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 7));

      doc.text("Shingles Risk", oneThird, startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 6));
      doc.text("Yes",
        oneThird + optionsOffset,
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 7));
      doc.text("No",
        oneThird + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 7));

      doc.text("Pneumonia Risk", twoThirds, startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 6));
      doc.text("Yes",
        twoThirds + optionsOffset,
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 7));
      doc.text("No",
        twoThirds + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 7));
/*

      doc.text("VRE Risk", 15, 332);
      doc.text("Yes", 20, 348);
      doc.text("No", 70, 348);

      doc.text("Shingles Risk", 200, 332);
      doc.text("Yes", 205, 348);
      doc.text("No", 255, 348);

      doc.text("Pneumonia Risk", 400, 332);
      doc.text("Yes", 405, 348);
      doc.text("No", 455, 348);

      doc.text("Hearing", 15, 372);

      doc.text("Left Ear", 15, 396);
      doc.text("Adequate", 20, 412);
      doc.text("Adequate with Aid", 85, 412);
      doc.text("Poor", 195, 412);
      doc.text("None", 230, 412);

      doc.text("Right Ear", 300, 396);
      doc.text("Adequate", 305, 412);
      doc.text("Adequate with Aid", 370, 412);
      doc.text("Poor", 480, 412);
      doc.text("None", 515, 412);

      doc.text("Hearing Ability", 15, 436);
      doc.line(55, 448, 245, 448);
      doc.text("None", 15, 452);
      doc.setFillColor(255,255,255);
      doc.circle(60, 448, 5, 'FD');
      doc.circle(80, 448, 5, 'FD');
      doc.circle(100, 448, 5, 'FD');
      doc.circle(120, 448, 5, 'FD');
      doc.circle(140, 448, 5, 'FD');
      doc.circle(160, 448, 5, 'FD');
      doc.circle(180, 448, 5, 'FD');
      doc.circle(200, 448, 5, 'FD');
      doc.circle(220, 448, 5, 'FD');
      doc.circle(240, 448, 5, 'FD');
      doc.text("Perfect", 256, 452);

      doc.text("Wears Hearing Aid", 15, 476);
      doc.text("Yes", 20, 492);
      doc.text("No", 70, 492);

      doc.text("Help with Hearing Aids", 300, 476);
      doc.text("Yes", 305, 492);
      doc.text("No", 355, 492);

      doc.text("Hearing Notes", 15, 516);
      doc.line(100, 518, 580, 518);
      doc.line(100, 542, 580, 542);

      doc.text("Vision", 15, 566);

      doc.text("Vision Device", 15, 590);
      doc.text("Glasses", 20, 606);
      doc.text("Contacts", 80, 606);
      doc.text("None", 150, 606);

      doc.text("Vision Assist", 300, 590);
      doc.text("Full", 305, 606);
      doc.text("Independent", 345, 606);
      doc.text("Reminder", 435, 606);
      doc.text("None", 505, 606);

      doc.text("Left Eye", 15, 630);
      doc.text("Adequate", 20, 646);
      doc.text("Adequate with Aid", 80, 646);
      doc.text("Poor", 190, 646);
      doc.text("None", 230, 646);

      doc.text("Right Eye", 300, 630);
      doc.text("Adequate", 305, 646);
      doc.text("Adequate with Aid", 365, 646);
      doc.text("Poor", 475, 646);
      doc.text("None", 515, 646);

      doc.text("Vision", 15, 670);
      doc.line(55, 682, 245, 682);
      doc.text("None", 15, 686);
      doc.setFillColor(255,255,255);
      doc.circle(60, 682, 5, 'FD');
      doc.circle(80, 682, 5, 'FD');
      doc.circle(100, 682, 5, 'FD');
      doc.circle(120, 682, 5, 'FD');
      doc.circle(140, 682, 5, 'FD');
      doc.circle(160, 682, 5, 'FD');
      doc.circle(180, 682, 5, 'FD');
      doc.circle(200, 682, 5, 'FD');
      doc.circle(220, 682, 5, 'FD');
      doc.circle(240, 682, 5, 'FD');
      doc.text("Perfect", 256, 686);

      doc.text("Vision Notes", 15, 710);
      doc.line(100, 712, 580, 712);
      doc.line(100, 736, 580, 736);

      doc.text("Teeth", 15, 760);

      doc.text("Dentist", 15, 784);
      doc.line(100, 786, 580, 786);

      doc.addPage();
      doc.rect(10, 0, 575, 416);

      doc.text("Teeth Care", 15, 24);
      doc.text("Great", 20, 40);
      doc.text("Good", 70, 40);
      doc.text("Decent", 120, 40);
      doc.text("Lacking", 170, 40);
      doc.text("None", 220, 40);

      doc.text("Teeth Assistance", 300, 24);
      doc.text("Full", 305, 40);
      doc.text("Reminder", 355, 40);
      doc.text("Independent", 435, 40);

      doc.text("Teeth Care Description", 15, 64);
      doc.line(100, 66, 580, 66);
      doc.line(100, 90, 580, 90);

      doc.text("Upper Teeth", 15, 114);
      doc.text("Own", 20, 130);
      doc.text("Dentures", 70, 130);
      doc.text("Partial", 150, 130);

      doc.text("Lower Teeth", 300, 114);
      doc.text("Own", 305, 130);
      doc.text("Dentures", 355, 130);
      doc.text("Partial", 435, 130);

      doc.text("Teeth Condition", 15, 154);
      doc.line(55, 166, 245, 166);
      doc.text("None", 15, 170);
      doc.setFillColor(255,255,255);
      doc.circle(60, 166, 5, 'FD');
      doc.circle(80, 166, 5, 'FD');
      doc.circle(100, 166, 5, 'FD');
      doc.circle(120, 166, 5, 'FD');
      doc.circle(140, 166, 5, 'FD');
      doc.circle(160, 166, 5, 'FD');
      doc.circle(180, 166, 5, 'FD');
      doc.circle(200, 166, 5, 'FD');
      doc.circle(220, 166, 5, 'FD');
      doc.circle(240, 166, 5, 'FD');
      doc.text("Perfect", 256, 170);

      doc.text("Teeth Notes", 15, 194);
      doc.line(100, 196, 580, 196);
      doc.line(100, 220, 580, 220);

      doc.text("Oxygen", 15, 244);
      doc.text("Yes", 20, 260);
      doc.text("No", 70, 260);

      doc.text("Oxygen Type", 200, 244);
      doc.text("Liquid", 205, 260);
      doc.text("Concentrate", 255, 260);

      doc.text("Oxygen Flow", 400, 244);
      doc.text("Continuous", 405, 260);
      doc.text("Helios", 485, 260);

      doc.text("Medication", 15, 284);
      doc.text("Yes", 20, 300);
      doc.text("No", 70, 300);

      doc.text("Self Meds", 200, 284);
      doc.text("Yes", 205, 300);
      doc.text("No", 255, 300);

      doc.text("Meds at Bedside", 400, 284);
      doc.text("Yes", 405, 300);
      doc.text("No", 455, 300);

      doc.text("Chemotherapy", 15, 324);
      doc.text("Yes", 20, 340);
      doc.text("No", 70, 340);

      doc.text("Swallow Assist", 200, 324);
      doc.text("Yes", 205, 340);
      doc.text("No", 255, 340);

      doc.text("Dialysis", 400, 324);
      doc.text("Yes", 405, 340);
      doc.text("No", 455, 340);

      doc.text("Marijuana", 15, 364);
      doc.text("Yes", 20, 380);
      doc.text("No", 70, 380);

      doc.text("Notes", 200, 364);
      doc.line(290, 366, 580, 366);
      doc.line(200, 390, 580, 390);

////////////////////////////////////////////////////////////// Psychosocial

      doc.rect(10, 426, 575, 500);
      doc.text("Psychosocial", 15, 440);

      doc.text("Psychosocial Status", 15, 464);
      doc.text("Alert", 20, 480);
      doc.text("Friendly", 70, 480);
      doc.text("Disoriented", 130, 480);
      doc.text("Withdrawn", 200, 480);
      doc.text("Talkative", 300, 480);
      doc.text("Lonely", 400, 480);
      doc.text("Happy", 500, 480);

      doc.text("Confused", 20, 496);
      doc.text("Uncooperative", 100, 496);
      doc.text("At Times Angry", 200, 496);
      doc.text("Sad", 300, 496);
      doc.text("Emotional Outbursts", 350, 496);
      doc.text("Feel Like a Burden", 480, 496);

      doc.text("Psychosocial Description", 15, 520);
      doc.line(100, 522, 580, 522);
      doc.line(100, 546, 580, 546);

      doc.text("Comprehension", 15, 570);
      doc.text("Slow", 20, 586);
      doc.text("Moderate", 70, 586);
      doc.text("Quick", 140, 586);

      doc.text("Dementia", 300, 570);
      doc.text("None", 305, 586);
      doc.text("Mild", 355, 586);
      doc.text("Moderate", 405, 586);
      doc.text("Severe", 475, 586);

      doc.text("Sundowner", 15, 610);
      doc.text("Yes", 20, 626);
      doc.text("No", 70, 626);

      doc.text("Sundowner Description", 200, 610);
      doc.line(300, 612, 580, 612);
      doc.line(300, 636, 580, 636);

      doc.text("Leaves without Intention", 15, 660);
      doc.text("Yes", 20, 676);
      doc.text("No", 70, 676);

      doc.text("High Maintenance", 200, 660);
      doc.line(240, 672, 430, 672);
      doc.text("Easy", 200, 676);
      doc.setFillColor(255,255,255);
      doc.circle(245, 672, 5, 'FD');
      doc.circle(265, 672, 5, 'FD');
      doc.circle(285, 672, 5, 'FD');
      doc.circle(305, 672, 5, 'FD');
      doc.circle(325, 672, 5, 'FD');
      doc.circle(345, 672, 5, 'FD');
      doc.circle(365, 672, 5, 'FD');
      doc.circle(385, 672, 5, 'FD');
      doc.circle(405, 672, 5, 'FD');
      doc.circle(425, 672, 5, 'FD');
      doc.text("Difficult", 441, 676);

      doc.text("High Maintenance Description", 15, 700);
      doc.line(100, 702, 580, 702);
      doc.line(100, 726, 580, 726);

      doc.text("Anxiety", 15, 750);
      doc.text("Yes", 20, 766);
      doc.text("No", 70, 766);

      doc.text("Antipsychotic Medication", 300, 750);
      doc.text("Yes", 305, 766);
      doc.text("No", 355, 766);

      doc.text("Smokes", 15, 790);
      doc.text("Yes", 20, 806);
      doc.text("No", 70, 806);

      doc.text("Smoke Description", 200, 790);
      doc.line(300, 792, 580, 792);
      doc.line(300, 816, 580, 816);

      doc.addPage();
      doc.rect(10, 0, 575, 626);

      doc.text("Alcohol", 15, 24);
      doc.text("Yes", 20, 40);
      doc.text("No", 70, 40);

      doc.text("Alcohol in Room", 300, 24);
      doc.text("Yes", 305, 40);
      doc.text("No", 355, 40);

      doc.text("Alcohol Description", 15, 64);
      doc.line(100, 66, 580, 66);
      doc.line(100, 90, 580, 90);

      doc.text("Sexually Active", 15, 114);
      doc.text("Yes", 20, 130);
      doc.text("No", 70, 130);

      doc.text("Sexually Active Description", 200, 114);
      doc.line(300, 116, 580, 116);
      doc.line(300, 140, 580, 140);

      doc.text("Other Habits", 15, 164);
      doc.line(100, 166, 580, 166);
      doc.line(100, 190, 580, 190);

      doc.text("Participation", 15, 214);

      doc.text("General Activity Participation", 15, 238);
      doc.text("Never", 20, 254);
      doc.text("Sometimes", 70, 254);
      doc.text("Good", 150, 254);
      doc.text("Amazing", 200, 254);

      doc.text("Dining Room Participation", 300, 238);
      doc.text("Never", 305, 254);
      doc.text("Sometimes", 355, 254);
      doc.text("Good", 435, 254);
      doc.text("Amazing", 485, 254);

      doc.text("Bus Ride Participation", 15, 278);
      doc.text("Never", 20, 294);
      doc.text("Sometimes", 70, 294);
      doc.text("Good", 150, 294);
      doc.text("Amazing", 200, 294);

      doc.text("Fitness Participation", 300, 278);
      doc.text("Never", 305, 294);
      doc.text("Sometimes", 355, 294);
      doc.text("Good", 435, 294);
      doc.text("Amazing", 485, 294);

      doc.text("Bingo Participation", 15, 318);
      doc.text("Never", 20, 334);
      doc.text("Sometimes", 70, 334);
      doc.text("Good", 150, 334);
      doc.text("Amazing", 200, 334);

      doc.text("Community Participation", 300, 318);
      doc.text("Never", 305, 334);
      doc.text("Sometimes", 355, 334);
      doc.text("Good", 435, 334);
      doc.text("Amazing", 485, 334);

      doc.text("Time in Room", 15, 358);
      doc.text("Reading", 20, 374);
      doc.text("TV", 90, 374);
      doc.text("Game", 130, 374);
      doc.text("Hobby", 190, 374);
      doc.text("Computer", 260, 374);
      doc.text("Radio", 340, 374);
      doc.text("Audio Books", 410, 374);

      doc.text("Volunteer", 15, 398);
      doc.text("Yes", 20, 414);
      doc.text("No", 70, 414);

      doc.text("Prefered Activites", 200, 398);
      doc.line(300, 400, 580, 400);
      doc.line(300, 424, 580, 424);

      doc.text("Drives a Car", 15, 448);
      doc.text("Yes", 20, 464);
      doc.text("No", 70, 464);

      doc.text("License Plate Number", 200, 448);
      doc.line(300, 450, 580, 450);

      doc.text("Spare Key Location", 15, 484);
      doc.line(100, 486, 280, 486);
      doc.line(100, 510, 280, 510);

      doc.text("Spare Key Location", 300, 484);
      doc.line(400, 486, 580, 486);
      doc.line(400, 510, 580, 510);

      doc.text("Uses Fitness Equipment Independently", 15, 534);
      doc.text("Yes", 20, 550);
      doc.text("No", 70, 550);

      doc.text("Family Involvement", 300, 534);
      doc.text("None", 305, 550);
      doc.text("Some", 365, 550);
      doc.text("Frequent", 425, 550);

      doc.text("Notes", 15, 574);
      doc.line(100, 576, 580, 576);
      doc.line(100, 600, 580, 600);

      doc.rect(10, 636, 575, 220);

////////////////////////////////////////////////////////////// Pain

      doc.text("Pain", 15, 650);

      doc.text("Has Pain", 15, 674);
      doc.text("Yes", 20, 690);
      doc.text("No", 70, 690);

      doc.text("Pain Severity", 200, 674);
      doc.line(240, 686, 430, 686);
      doc.text("None", 200, 690);
      doc.setFillColor(255,255,255);
      doc.circle(245, 686, 5, 'FD');
      doc.circle(265, 686, 5, 'FD');
      doc.circle(285, 686, 5, 'FD');
      doc.circle(305, 686, 5, 'FD');
      doc.circle(325, 686, 5, 'FD');
      doc.circle(345, 686, 5, 'FD');
      doc.circle(365, 686, 5, 'FD');
      doc.circle(385, 686, 5, 'FD');
      doc.circle(405, 686, 5, 'FD');
      doc.circle(425, 686, 5, 'FD');
      doc.text("Extreme", 441, 690);

      doc.text("Pain Location", 15, 714);
      doc.line(100, 716, 580, 716);

      doc.text("Pain Description", 15, 740);
      doc.line(100, 742, 580, 742);

      doc.text("Maximum Pain Time of Day", 15, 766);
      doc.line(100, 768, 580, 768);

      doc.text("Pain Increased By", 15, 792);
      doc.line(100, 794, 580, 794);

      doc.text("Pain Decreased By", 15, 818);
      doc.line(100, 820, 580, 820);

      doc.addPage();
      doc.rect(10, 0, 575, 158);

      doc.text("Pain Managed By", 15, 28);
      doc.text("Medication", 20, 44);
      doc.text("Hot Pack", 90, 44);
      doc.text("Cold Pack", 160, 44);
      doc.text("Positioning", 230, 44);
      doc.text("Topicals", 300, 44);

      doc.text("Pain Length", 15, 68);
      doc.text("New Onset", 20, 84);
      doc.text("Chronic", 90, 84);

      doc.text("Notes", 15, 108);
      doc.line(100, 110, 580, 110);
      doc.line(100, 134, 580, 134);
*/
      doc.save("Blank Careplan.pdf");
    }

    return {
      exportPdf : exportPdf
    };

  }

})();
