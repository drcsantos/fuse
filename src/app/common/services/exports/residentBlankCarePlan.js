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
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

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
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

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
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

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
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Infection", startX, startY + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 5));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

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
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

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
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Hearing", startX, startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 7));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Left Ear", startX, startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 7));
      doc.text("Adequate",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 8));
      doc.text("Adequate with Aid",
        startX + optionsOffset + ("Adequate".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 8));
      doc.text("Poor",
        startX + optionsOffset + ("Adequate".length * coordsPerLetter) + ("Adequate with Aid".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 8));
      doc.text("None",
        startX + optionsOffset + ("Adequate".length * coordsPerLetter) + ("Adequate with Aid".length * coordsPerLetter) + ("Poor".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 8));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Right Ear", startX, startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 8));
      doc.text("Adequate",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 9));
      doc.text("Adequate with Aid",
        startX + optionsOffset + ("Adequate".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 9));
      doc.text("Poor",
        startX + optionsOffset + ("Adequate".length * coordsPerLetter) + ("Adequate with Aid".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 9));
      doc.text("None",
        startX + optionsOffset + ("Adequate".length * coordsPerLetter) + ("Adequate with Aid".length * coordsPerLetter) + ("Poor".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 9));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Hearing Ability", startX, startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 9));
      doc.text("None", startX + optionsOffset, startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 10));
      doc.line(startX + 40 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 9),
        startX + 230 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 9));
      doc.setFillColor(255,255,255);
      doc.circle(startX + 45 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 9),
        5, 'FD');
      doc.circle(startX + 65 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 9),
        5, 'FD');
      doc.circle(startX + 85 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 9),
        5, 'FD');
      doc.circle(startX + 105 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 9),
        5, 'FD');
      doc.circle(startX + 125 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 9),
        5, 'FD');
      doc.circle(startX + 145 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 9),
        5, 'FD');
      doc.circle(startX + 165 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 9),
        5, 'FD');
      doc.circle(startX + 185 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 9),
        5, 'FD');
      doc.circle(startX + 205 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 9),
        5, 'FD');
      doc.circle(startX + 225 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 9),
        5, 'FD');
      doc.text("Perfect", startX + 241 + optionsOffset, startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 10));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Wears Hearing Aid", startX, startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 10));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 11));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 11));

      doc.text("Help with Hearing Aid", twoThirds, startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 10));
      doc.text("Yes",
        twoThirds + optionsOffset,
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 11));
      doc.text("No",
        twoThirds + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 11));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Hearing Notes", startX, startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 11));
      doc.line(
        startX + ("Hearing Notes".length * coordsPerLetter),
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 11),
        endX,
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 11));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 11),
        endX,
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 11));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Vision", startX, startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 11));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Vision Device", startX, startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 11));
      doc.text("Glasses",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 12));
      doc.text("Contacts",
        startX + optionsOffset + ("Glasses".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 12));
      doc.text("None",
        startX + optionsOffset + ("Glasses".length * coordsPerLetter) + ("Contacts".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 12));

      doc.text("Vision Assist", twoThirds, startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 11));
      doc.text("Full",
        twoThirds + optionsOffset,
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 12));
      doc.text("Reminder",
        twoThirds + optionsOffset + ("Full".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 12));
      doc.text("None",
        twoThirds + optionsOffset + ("Full".length * coordsPerLetter) + ("Reminder".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 12));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Left Eye", startX, startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 12));
      doc.text("Adequate",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 13));
      doc.text("Adequate with Aid",
        startX + optionsOffset + ("Adequate".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 13));
      doc.text("Poor",
        startX + optionsOffset + ("Adequate".length * coordsPerLetter) + ("Adequate with Aid".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 13));
      doc.text("None",
        startX + optionsOffset + ("Adequate".length * coordsPerLetter) + ("Adequate with Aid".length * coordsPerLetter) + ("Poor".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 13));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Right Eye", startX, startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 13));
      doc.text("Adequate",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 14));
      doc.text("Adequate with Aid",
        startX + optionsOffset + ("Adequate".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 14));
      doc.text("Poor",
        startX + optionsOffset + ("Adequate".length * coordsPerLetter) + ("Adequate with Aid".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 14));
      doc.text("None",
        startX + optionsOffset + ("Adequate".length * coordsPerLetter) + ("Adequate with Aid".length * coordsPerLetter) + ("Poor".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 14));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Vision Ability", startX, startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 14));
      doc.text("None", startX + optionsOffset, startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 15));
      doc.line(startX + 40 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 14),
        startX + 230 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 14));
      doc.setFillColor(255,255,255);
      doc.circle(startX + 45 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 14),
        5, 'FD');
      doc.circle(startX + 65 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 14),
        5, 'FD');
      doc.circle(startX + 85 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 14),
        5, 'FD');
      doc.circle(startX + 105 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 14),
        5, 'FD');
      doc.circle(startX + 125 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 14),
        5, 'FD');
      doc.circle(startX + 145 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 14),
        5, 'FD');
      doc.circle(startX + 165 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 14),
        5, 'FD');
      doc.circle(startX + 185 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 14),
        5, 'FD');
      doc.circle(startX + 205 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 14),
        5, 'FD');
      doc.circle(startX + 225 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 14),
        5, 'FD');
      doc.text("Perfect", startX + 241 + optionsOffset, startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 15));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.rect(boxStartX, startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 2), boxWidth, boxHeight + 20);
      doc.addPage();
      boxHeight = 0;

      doc.text("Vision Notes", startX, startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 0));
      doc.line(
        startX + ("Vision Notes".length * coordsPerLetter),
        startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 0),
        endX,
        startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 0));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0),
        endX,
        startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Teeth", startX, startY + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Dentist", startX, startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 0));
      doc.line(
        startX + ("Dentist".length * coordsPerLetter),
        startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 0),
        endX,
        startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 0));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Teeth Care", startX, startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 0));
      doc.text("Great",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 1));
      doc.text("Good",
        startX + optionsOffset + ("Great".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 1));
      doc.text("Decent",
        startX + optionsOffset + ("Great".length * coordsPerLetter) + ("Good".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 1));
      doc.text("Lacking",
        startX + optionsOffset + ("Great".length * coordsPerLetter) + ("Good".length * coordsPerLetter) + ("Decent".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 1));
      doc.text("None",
        startX + optionsOffset + ("Great".length * coordsPerLetter) + ("Good".length * coordsPerLetter) + ("Decent".length * coordsPerLetter) + ("Lacking".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 4),
        startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 1));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Teeth Care Description", startX, startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 1));
      doc.line(
        startX + ("Teeth Care Description".length * coordsPerLetter),
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 1),
        endX,
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 1));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 1),
        endX,
        startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 1));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Teeth Assistance", startX, startY + (spaceBetweenLines * 7) + (spaceBetweenOptionsVertical * 1));
      doc.text("Full",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 7) + (spaceBetweenOptionsVertical * 2));
      doc.text("Reminder",
        startX + optionsOffset + ("Full".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 7) + (spaceBetweenOptionsVertical * 2));
      doc.text("Independent",
        startX + optionsOffset + ("Full".length * coordsPerLetter) + ("Reminder".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 7) + (spaceBetweenOptionsVertical * 2));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Upper Teeth", startX, startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 2));
      doc.text("Own",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 3));
      doc.text("Denture",
        startX + optionsOffset + ("Own".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 3));
      doc.text("Partial",
        startX + optionsOffset + ("Own".length * coordsPerLetter) + ("Denture".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 3));

      doc.text("Lower Teeth", twoThirds, startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 2));
      doc.text("Own",
        twoThirds + optionsOffset,
        startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 3));
      doc.text("Denture",
        twoThirds + optionsOffset + ("Own".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 3));
      doc.text("Partial",
        twoThirds + optionsOffset + ("Own".length * coordsPerLetter) + ("Denture".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 3));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Teeth Condition", startX, startY + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 3));
      doc.text("None", startX + optionsOffset, startY + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 4));
      doc.line(startX + 40 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 3),
        startX + 230 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 3));
      doc.setFillColor(255,255,255);
      doc.circle(startX + 45 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 3),
        5, 'FD');
      doc.circle(startX + 65 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 3),
        5, 'FD');
      doc.circle(startX + 85 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 3),
        5, 'FD');
      doc.circle(startX + 105 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 3),
        5, 'FD');
      doc.circle(startX + 125 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 3),
        5, 'FD');
      doc.circle(startX + 145 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 3),
        5, 'FD');
      doc.circle(startX + 165 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 3),
        5, 'FD');
      doc.circle(startX + 185 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 3),
        5, 'FD');
      doc.circle(startX + 205 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 3),
        5, 'FD');
      doc.circle(startX + 225 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 3),
        5, 'FD');
      doc.text("Perfect", startX + 241 + optionsOffset, startY + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 4));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Teeth Notes", startX, startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 4));
      doc.line(
        startX + ("Teeth Notes".length * coordsPerLetter),
        startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 4),
        endX,
        startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 4));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 4),
        endX,
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 4));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Medication", startX, startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 4));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Oxygen", startX, startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 4));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 5));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 5));

      doc.text("Oxygen Type", oneThird, startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 4));
      doc.text("Liquid",
        oneThird + optionsOffset,
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 5));
      doc.text("Concentrate",
        oneThird + optionsOffset + ("Liquid".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 5));

      doc.text("Oxygen Flow", twoThirds, startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 4));
      doc.text("Continuous",
        twoThirds + optionsOffset,
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 5));
      doc.text("Helios",
        twoThirds + optionsOffset + ("Continuous".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 5));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Medication", startX, startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 5));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 6));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 6));

      doc.text("Self Meds", oneThird, startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 5));
      doc.text("Yes",
        oneThird + optionsOffset,
        startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 6));
      doc.text("No",
        oneThird + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 6));

      doc.text("Med at Bedside", twoThirds, startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 5));
      doc.text("Yes",
        twoThirds + optionsOffset,
        startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 6));
      doc.text("No",
        twoThirds + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 6));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Chemotherapy", startX, startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 6));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 7));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 7));

      doc.text("Swallow Assist", oneThird, startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 6));
      doc.text("Yes",
        oneThird + optionsOffset,
        startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 7));
      doc.text("No",
        oneThird + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 7));

      doc.text("Dialysis", twoThirds, startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 6));
      doc.text("Yes",
        twoThirds + optionsOffset,
        startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 7));
      doc.text("No",
        twoThirds + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 7));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Marijuana", startX, startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 7));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 8));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 8));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Medication Notes", startX, startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 8));
      doc.line(
        startX + ("Medication Notes".length * coordsPerLetter),
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 8),
        endX,
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 8));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 8),
        endX,
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 8));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 1));

      doc.rect(boxStartX, boxStartY - 10, boxWidth, boxHeight + 10);

////////////////////////////////////////////////////////////// Psychosocial

      boxHeight = 0;
      doc.text("Psychosocial", startX, startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 10));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Psychosocial Status", startX, startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 10));
      doc.text("Alert",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 11));
      doc.text("Friendly",
        startX + optionsOffset + ("Alert".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 11));
      doc.text("Disoriented",
        startX + optionsOffset + ("Alert".length * coordsPerLetter) + ("Friendly".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 11));
      doc.text("Withdrawn",
        startX + optionsOffset + ("Alert".length * coordsPerLetter) + ("Friendly".length * coordsPerLetter) + ("Disoriented".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 11));
      doc.text("Talkative",
        startX + optionsOffset + ("Alert".length * coordsPerLetter) + ("Friendly".length * coordsPerLetter) + ("Disoriented".length * coordsPerLetter) + ("Withdrawn".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 4),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 11));
      doc.text("Lonely",
        startX + optionsOffset + ("Alert".length * coordsPerLetter) + ("Friendly".length * coordsPerLetter) + ("Disoriented".length * coordsPerLetter) + ("Withdrawn".length * coordsPerLetter) + ("Talkative".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 5),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 11));
      doc.text("Happy",
        startX + optionsOffset + ("Alert".length * coordsPerLetter) + ("Friendly".length * coordsPerLetter) + ("Disoriented".length * coordsPerLetter) + ("Withdrawn".length * coordsPerLetter) + ("Talkative".length * coordsPerLetter) + ("Lonely".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 6),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 11));
      doc.text("Confused",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 12));
      doc.text("Uncooperative",
        startX + optionsOffset + ("Confused".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 12));
      doc.text("At Times Angry",
        startX + optionsOffset + ("Confused".length * coordsPerLetter) + ("Uncooperative".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 12));
      doc.text("Sad",
        startX + optionsOffset + ("Confused".length * coordsPerLetter) + ("Uncooperative".length * coordsPerLetter) + ("At Times Angry".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 12));
      doc.text("Emotional Outbursts",
        startX + optionsOffset + ("Confused".length * coordsPerLetter) + ("Uncooperative".length * coordsPerLetter) + ("At Times Angry".length * coordsPerLetter) + ("Sad".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 4),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 12));
      doc.text("Feel Like a Burden",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 13));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 3));

      doc.text("Psychosocial Description", startX, startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 13));
      doc.line(
        startX + ("Psychosocial Description".length * coordsPerLetter),
        startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 13),
        endX,
        startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 13));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 13),
        endX,
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 13));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Sundowner", startX, startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 13));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 14));
      doc.text("No",
        startX + optionsOffset + ("No".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 14));

      doc.text("Sundowner Description", oneThird, startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 13));
      doc.line(
        oneThird + ("Sundowner Description".length * coordsPerLetter),
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 13),
        endX,
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 13));
      doc.line(
        oneThird,
        startY + (spaceBetweenLines * 24) + (spaceBetweenOptionsVertical * 13),
        endX,
        startY + (spaceBetweenLines * 24) + (spaceBetweenOptionsVertical * 13));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.rect(boxStartX, startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 9), boxWidth, boxHeight + 30);

      doc.addPage();
      boxHeight = 0;

      doc.text("Comprehension", startX, startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 0));
      doc.text("Slow",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 1));
      doc.text("Moderate",
        startX + optionsOffset + ("Slow".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 1));
      doc.text("Quick",
        startX + optionsOffset + ("Slow".length * coordsPerLetter) + ("Moderate".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 1));

      doc.text("Dementia", midPoint, startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 0));
      doc.text("None",
        midPoint + optionsOffset,
        startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 1));
      doc.text("Mild",
        midPoint + optionsOffset + ("None".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 1));
      doc.text("Moderate",
        midPoint + optionsOffset + ("None".length * coordsPerLetter) + ("Mild".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 1));
      doc.text("Severe",
        midPoint + optionsOffset + ("None".length * coordsPerLetter) + ("Mild".length * coordsPerLetter) + ("Moderate".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 1));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Leaves without Intention", startX, startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 2));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 2));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("High Maintenance", startX, startY + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 2));
      doc.text("Easy", startX + optionsOffset, startY + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 3));
      doc.line(startX + 40 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 2),
        startX + 230 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 2));
      doc.setFillColor(255,255,255);
      doc.circle(startX + 45 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 2),
        5, 'FD');
      doc.circle(startX + 65 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 2),
        5, 'FD');
      doc.circle(startX + 85 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 2),
        5, 'FD');
      doc.circle(startX + 105 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 2),
        5, 'FD');
      doc.circle(startX + 125 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 2),
        5, 'FD');
      doc.circle(startX + 145 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 2),
        5, 'FD');
      doc.circle(startX + 165 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 2),
        5, 'FD');
      doc.circle(startX + 185 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 2),
        5, 'FD');
      doc.circle(startX + 205 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 2),
        5, 'FD');
      doc.circle(startX + 225 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 2),
        5, 'FD');
      doc.text("Difficult", startX + 241 + optionsOffset, startY + (spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 3));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("High Maintenance Description", startX, startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 3));
      doc.line(
        startX + ("High Maintenance Description".length * coordsPerLetter),
        startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 3),
        endX,
        startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 3));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 3),
        endX,
        startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 3));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Anxiety", startX, startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 3));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 4));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 4));

      doc.text("Antipsychotic Medication", midPoint, startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 3));
      doc.text("Yes",
        midPoint + optionsOffset,
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 4));
      doc.text("No",
        midPoint + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 4));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Smokes", startX, startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 4));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 5));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 5));

      doc.text("Smoke Description", oneThird, startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 4));
      doc.line(
        oneThird + ("Smoke Description".length * coordsPerLetter),
        startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 4),
        endX,
        startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 4));
      doc.line(
        oneThird,
        startY + (spaceBetweenLines * 7) + (spaceBetweenOptionsVertical * 4),
        endX,
        startY + (spaceBetweenLines * 7) + (spaceBetweenOptionsVertical * 4));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Sexually Active", startX, startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 4));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 5));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 5));

      doc.text("Sexually Active Description", oneThird, startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 4));
      doc.line(
        oneThird + ("Sexually Active Description".length * coordsPerLetter),
        startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 4),
        endX,
        startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 4));
      doc.line(
        oneThird,
        startY + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 4),
        endX,
        startY + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 4));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Alcohol", startX, startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 4));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 5));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 5));

      doc.text("Alcohol Description", oneThird, startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 4));
      doc.line(
        oneThird + ("Alcohol Description".length * coordsPerLetter),
        startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 4),
        endX,
        startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 4));
      doc.line(
        oneThird,
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 4),
        endX,
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 4));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Alcohol in Room", startX, startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 4));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 5));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 5));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Other Habits", startX, startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 5));
      doc.line(
        startX + ("Other Habits".length * coordsPerLetter),
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 5),
        endX,
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 5));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 5),
        endX,
        startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 5));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Participation", startX, startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 5));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("General Activity Participation", startX, startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 5));
      doc.text("Never",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 6));
      doc.text("Sometimes",
        startX + optionsOffset + ("Never".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 6));
      doc.text("Good",
        startX + optionsOffset + ("Never".length * coordsPerLetter) + ("Sometimes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 6));
      doc.text("Amazing",
        startX + optionsOffset + ("Never".length * coordsPerLetter) + ("Sometimes".length * coordsPerLetter) + ("Good".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 6));

      doc.text("Dining Room Participation", midPoint, startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 5));
      doc.text("Never",
        midPoint + optionsOffset,
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 6));
      doc.text("Sometimes",
        midPoint + optionsOffset + ("Never".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 6));
      doc.text("Good",
        midPoint + optionsOffset + ("Never".length * coordsPerLetter) + ("Sometimes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 6));
      doc.text("Amazing",
        midPoint + optionsOffset + ("Never".length * coordsPerLetter) + ("Sometimes".length * coordsPerLetter) + ("Good".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 6));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Bus Ride Participation", startX, startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 6));
      doc.text("Never",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 7));
      doc.text("Sometimes",
        startX + optionsOffset + ("Never".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 7));
      doc.text("Good",
        startX + optionsOffset + ("Never".length * coordsPerLetter) + ("Sometimes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 7));
      doc.text("Amazing",
        startX + optionsOffset + ("Never".length * coordsPerLetter) + ("Sometimes".length * coordsPerLetter) + ("Good".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 7));

      doc.text("Fitness Participation", midPoint, startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 6));
      doc.text("Never",
        midPoint + optionsOffset,
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 7));
      doc.text("Sometimes",
        midPoint + optionsOffset + ("Never".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 7));
      doc.text("Good",
        midPoint + optionsOffset + ("Never".length * coordsPerLetter) + ("Sometimes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 7));
      doc.text("Amazing",
        midPoint + optionsOffset + ("Never".length * coordsPerLetter) + ("Sometimes".length * coordsPerLetter) + ("Good".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 7));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Bingo Participation", startX, startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 7));
      doc.text("Never",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 8));
      doc.text("Sometimes",
        startX + optionsOffset + ("Never".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 8));
      doc.text("Good",
        startX + optionsOffset + ("Never".length * coordsPerLetter) + ("Sometimes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 8));
      doc.text("Amazing",
        startX + optionsOffset + ("Never".length * coordsPerLetter) + ("Sometimes".length * coordsPerLetter) + ("Good".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 8));

      doc.text("Community Participation", midPoint, startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 7));
      doc.text("Never",
        midPoint + optionsOffset,
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 8));
      doc.text("Sometimes",
        midPoint + optionsOffset + ("Never".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 8));
      doc.text("Good",
        midPoint + optionsOffset + ("Never".length * coordsPerLetter) + ("Sometimes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 8));
      doc.text("Amazing",
        midPoint + optionsOffset + ("Never".length * coordsPerLetter) + ("Sometimes".length * coordsPerLetter) + ("Good".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 8));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Time in Room", startX, startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 8));
      doc.text("Reading",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 9));
      doc.text("TV",
        startX + optionsOffset + ("Reading".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 9));
      doc.text("Game",
        startX + optionsOffset + ("Reading".length * coordsPerLetter) + ("TV".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 9));
      doc.text("Hobby",
        startX + optionsOffset + ("Reading".length * coordsPerLetter) + ("TV".length * coordsPerLetter) + ("Game".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 9));
      doc.text("Computer",
        startX + optionsOffset + ("Reading".length * coordsPerLetter) + ("TV".length * coordsPerLetter) + ("Game".length * coordsPerLetter) + ("Hobby".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 4),
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 9));
      doc.text("Radio",
        startX + optionsOffset + ("Reading".length * coordsPerLetter) + ("TV".length * coordsPerLetter) + ("Game".length * coordsPerLetter) + ("Hobby".length * coordsPerLetter) + ("Computer".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 5),
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 9));
      doc.text("Audio Books",
        startX + optionsOffset + ("Reading".length * coordsPerLetter) + ("TV".length * coordsPerLetter) + ("Game".length * coordsPerLetter) + ("Hobby".length * coordsPerLetter) + ("Computer".length * coordsPerLetter) + ("Radio".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 6),
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 9));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Volunteer", startX, startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 9));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 10));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 10));

      doc.text("Uses Fitness Equipment Independently", midPoint, startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 9));
      doc.text("Yes",
        midPoint + optionsOffset,
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 10));
      doc.text("No",
        midPoint + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 10));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Prefered Activites", startX, startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 10));
      doc.line(
        startX + ("Prefered Activites".length * coordsPerLetter),
        startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 10),
        endX,
        startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 10));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 10),
        endX,
        startY + (spaceBetweenLines * 22) + (spaceBetweenOptionsVertical * 10));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Drives a Car", startX, startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 10));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 11));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 11));

      doc.text("License Plate Number", oneThird, startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 10));
      doc.line(
        oneThird + ("License Plate Number".length * coordsPerLetter),
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 10),
        endX,
        startY + (spaceBetweenLines * 23) + (spaceBetweenOptionsVertical * 10));
      doc.line(
        oneThird,
        startY + (spaceBetweenLines * 24) + (spaceBetweenOptionsVertical * 10),
        endX,
        startY + (spaceBetweenLines * 24) + (spaceBetweenOptionsVertical * 10));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Spare Key Location", startX, startY + (spaceBetweenLines * 25) + (spaceBetweenOptionsVertical * 10));
      doc.line(
        startX + ("Spare Key Location".length * coordsPerLetter),
        startY + (spaceBetweenLines * 25) + (spaceBetweenOptionsVertical * 10),
        endX,
        startY + (spaceBetweenLines * 25) + (spaceBetweenOptionsVertical * 10));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 26) + (spaceBetweenOptionsVertical * 10),
        endX,
        startY + (spaceBetweenLines * 26) + (spaceBetweenOptionsVertical * 10));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.rect(boxStartX, boxStartY, boxWidth, boxHeight + 30);

      doc.addPage();
      boxHeight = 0;

      doc.text("Family Involvement", startX, startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 0));
      doc.text("None",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 1));
      doc.text("Some",
        startX + optionsOffset + ("None".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 0) + (spaceBetweenOptionsVertical * 1));
      doc.text("Frequent",
        startX + optionsOffset + ("None".length * coordsPerLetter) + ("Some".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
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

      doc.rect(boxStartX, boxStartY - 30, boxWidth, boxHeight + 30);

////////////////////////////////////////////////////////////// Pain

      boxHeight = 0;
      doc.text("Pain", startX, startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 3));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Has Pain", startX, startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 3));
      doc.text("Yes",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 4));
      doc.text("No",
        startX + optionsOffset + ("Yes".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 4));

      doc.text("Pain Severity", oneThird, startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 3));
      doc.text("None", oneThird + optionsOffset, startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 4));
      doc.line(oneThird + 40 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 3),
        oneThird + 230 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 3));
      doc.setFillColor(255,255,255);
      doc.circle(oneThird + 45 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 3),
        5, 'FD');
      doc.circle(oneThird + 65 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 3),
        5, 'FD');
      doc.circle(oneThird + 85 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 3),
        5, 'FD');
      doc.circle(oneThird + 105 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 3),
        5, 'FD');
      doc.circle(oneThird + 125 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 3),
        5, 'FD');
      doc.circle(oneThird + 145 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 3),
        5, 'FD');
      doc.circle(oneThird + 165 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 3),
        5, 'FD');
      doc.circle(oneThird + 185 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 3),
        5, 'FD');
      doc.circle(oneThird + 205 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 3),
        5, 'FD');
      doc.circle(oneThird + 225 + optionsOffset,
        startY + 13 + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 3),
        5, 'FD');
      doc.text("Extreme", oneThird + 241 + optionsOffset, startY + (spaceBetweenLines * 4) + (spaceBetweenOptionsVertical * 4));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Pain Location", startX, startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 4));
      doc.line(
        startX + ("Pain Location".length * coordsPerLetter),
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 4),
        endX,
        startY + (spaceBetweenLines * 5) + (spaceBetweenOptionsVertical * 4));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Pain Description", startX, startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 4));
      doc.line(
        startX + ("Pain Description".length * coordsPerLetter),
        startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 4),
        endX,
        startY + (spaceBetweenLines * 6) + (spaceBetweenOptionsVertical * 4));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 7) + (spaceBetweenOptionsVertical * 4),
        endX,
        startY + (spaceBetweenLines * 7) + (spaceBetweenOptionsVertical * 4));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.text("Max Pain Time of Day", startX, startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 4));
      doc.line(
        startX + ("Max Pain Time of Day".length * coordsPerLetter),
        startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 4),
        endX,
        startY + (spaceBetweenLines * 8) + (spaceBetweenOptionsVertical * 4));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Pain Increased By", startX, startY + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 4));
      doc.line(
        startX + ("Pain Increased By".length * coordsPerLetter),
        startY + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 4),
        endX,
        startY + (spaceBetweenLines * 9) + (spaceBetweenOptionsVertical * 4));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Pain Decreased By", startX, startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 4));
      doc.line(
        startX + ("Pain Decreased By".length * coordsPerLetter),
        startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 4),
        endX,
        startY + (spaceBetweenLines * 10) + (spaceBetweenOptionsVertical * 4));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 0));

      doc.text("Pain Managed By", startX, startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 4));
      doc.text("Medication",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 5));
      doc.text("Hot Pack",
        startX + optionsOffset + ("Medication".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 5));
      doc.text("Cold Pack",
        startX + optionsOffset + ("Medication".length * coordsPerLetter) + ("Hot Pack".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 5));
      doc.text("Positioning",
        startX + optionsOffset + ("Medication".length * coordsPerLetter) + ("Hot Pack".length * coordsPerLetter) + ("Cold Pack".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 5));
      doc.text("Topicals",
        startX + optionsOffset + ("Medication".length * coordsPerLetter) + ("Hot Pack".length * coordsPerLetter) + ("Cold Pack".length * coordsPerLetter) + ("Positioning".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 4),
        startY + (spaceBetweenLines * 11) + (spaceBetweenOptionsVertical * 5));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Pain Length", startX, startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 5));
      doc.text("New Onset",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 6));
      doc.text("Chronic",
        startX + optionsOffset + ("New Onset".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 12) + (spaceBetweenOptionsVertical * 6));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Notes", startX, startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 6));
      doc.line(
        startX + ("Notes".length * coordsPerLetter),
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 6),
        endX,
        startY + (spaceBetweenLines * 13) + (spaceBetweenOptionsVertical * 6));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 6),
        endX,
        startY + (spaceBetweenLines * 14) + (spaceBetweenOptionsVertical * 6));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 1));


      doc.rect(boxStartX, startY + (spaceBetweenLines * 3) + (spaceBetweenOptionsVertical * 2), boxWidth, boxHeight);

//////////////////////////////////////////////////////////////////// bathing

      doc.text("Bathing", startX, startY + (spaceBetweenLines * 15) + (spaceBetweenOptionsVertical * 8));

      doc.text("Type of Bathing", startX, startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 8));
      doc.text("Shower",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 9));
      doc.text("Bathtub",
        startX + optionsOffset + ("Shower".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 9));
      doc.text("Spit Bath",
        startX + optionsOffset + ("Shower".length * coordsPerLetter) + ("Bathtub".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 16) + (spaceBetweenOptionsVertical * 9));

      doc.text("Time of Bathing", startX, startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 9));
      doc.text("Morning",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 10));
      doc.text("Evening",
        startX + optionsOffset + ("Morning".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 10));
      doc.text("Before Breakfast",
        startX + optionsOffset + ("Morning".length * coordsPerLetter) + ("Evening".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 10));
      doc.text("After Breakfast",
        startX + optionsOffset + ("Morning".length * coordsPerLetter) + ("Evening".length * coordsPerLetter) + ("Before Breakfast".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 10));
      doc.text("Before Supper",
        startX + optionsOffset + ("Morning".length * coordsPerLetter) + ("Evening".length * coordsPerLetter) + ("Before Breakfast".length * coordsPerLetter) + ("After Breakfast".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 4),
        startY + (spaceBetweenLines * 17) + (spaceBetweenOptionsVertical * 10));
      doc.text("After Supper",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 18) + (spaceBetweenOptionsVertical * 10));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 2));

      doc.text("Frequency of Bathing", startX, startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 10));
      doc.text("None",
        startX + optionsOffset,
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 11));
      doc.text("Once a Week",
        startX + optionsOffset + ("None".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 1),
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 11));
      doc.text("Twice a Week",
        startX + optionsOffset + ("None".length * coordsPerLetter) + ("Once a Week".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 2),
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 11));
      doc.text("Every Other Day",
        startX + optionsOffset + ("None".length * coordsPerLetter) + ("Once a Week".length * coordsPerLetter) + ("Twice a Week".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 3),
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 11));
      doc.text("Every Day",
        startX + optionsOffset + ("None".length * coordsPerLetter) + ("Once a Week".length * coordsPerLetter) + ("Twice a Week".length * coordsPerLetter) + ("Every Other Day".length * coordsPerLetter) + (spaceBetweenOptionsHorizontal * 4),
        startY + (spaceBetweenLines * 19) + (spaceBetweenOptionsVertical * 11));
      boxHeight += ((spaceBetweenLines * 1) + (spaceBetweenOptionsVertical * 1));

      doc.text("Bathing Days", startX, startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 11));
      doc.line(
        startX + ("Bathing Days".length * coordsPerLetter),
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 11),
        endX,
        startY + (spaceBetweenLines * 20) + (spaceBetweenOptionsVertical * 11));
      doc.line(
        startX,
        startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 11),
        endX,
        startY + (spaceBetweenLines * 21) + (spaceBetweenOptionsVertical * 11));
      boxHeight += ((spaceBetweenLines * 2) + (spaceBetweenOptionsVertical * 0));

      doc.save("Blank Careplan.pdf");
    }

    return {
      exportPdf : exportPdf
    };

  }

})();
