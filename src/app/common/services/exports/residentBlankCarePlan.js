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

      doc.setFont("helvetica");
      doc.setFontSize(12);
      doc.setLineWidth(1);

      // export date
      doc.text("Exported On", 10, 24);
      doc.text(10, 48, filteredExportDate + " ");

      // community logo
      doc.rect(110, 10, 100, 100);
      doc.text("place holder", 120, 50);
      doc.text("for logo", 120, 62);

      // community info
      doc.text("Phone", 215, 24);
      doc.text("(719) 587-3514", 275, 24);

      doc.text("Fax", 215, 48);
      doc.text("(719) 589-3614", 275, 48);

      doc.text("Address", 215, 72);
      doc.text("3407 Carroll St Alamoa CO, 81101", 275, 72);

      doc.text("Website", 215, 96);
      doc.text("AlamosaBridge.com", 275, 96);

      // resident picture
      doc.rect(10, 120, 200, 300);
      doc.text("place holder", 60, 250);
      doc.text("for resident picture", 60, 262);

      // resident admin info
      doc.text("First Name", 220, 150);
      doc.line(280, 152, 590, 152);

      doc.text("Preferred Name", 220, 174);
      doc.line(306, 176, 590, 176);

      doc.text("Middle Name", 220, 198);
      doc.line(291, 200, 590, 200);

      doc.text("Last Name", 220, 222);
      doc.line(280, 224, 590, 224);

      doc.text("Maiden Name", 220, 246);
      doc.line(297, 248, 590, 248);

      //doc.text("Room", 220, 270);
      doc.line(297, 272, 380, 272);

      doc.text("Sex", 390, 270);
      doc.text("Male", 395, 286);
      doc.text("Female", 435, 286);
      doc.text("Other", 495, 286);

      doc.text("Floor", 220, 270);
      doc.line(297, 272, 380, 272);

      doc.text("Date of Birth", 220, 310);
      doc.line(297, 312, 380, 312);

      doc.text("Admission Date", 390, 310);
      doc.line(500, 312, 600, 312);

      doc.text("Marital Status", 220, 318);
      doc.text("Veteran", 390, 318);

      doc.text("Full Code", 220, 342);
      doc.text("Assessment Interval", 390, 342);

      doc.text("Moved From (Town)", 220, 366);
      doc.line(320, 368, 590, 368);

      doc.text("Primary Doctor", 220, 390);
      doc.line(320, 392, 590, 392);

      doc.text("Pharmacy", 220, 414);
      doc.line(320, 416, 590, 416);

      doc.text("Long Term Care Insurance", 10, 438);
      doc.text("Yes", 20, 454);
      doc.text("No", 50, 454);

      doc.text("Receiving Long Term Care Insurance", 300, 438);
      doc.text("Yes", 320, 454);
      doc.text("No", 350, 454);

      doc.text("Person who Handles Finances", 10, 474);
      doc.line(200, 476, 590, 476);

      doc.text("Appointment Coordination", 10, 498);
      doc.text("Self", 20, 514);
      doc.text("Assist", 60, 514);
      doc.text("Family", 100, 514);

      doc.text("Administrative Notes", 10, 534);
      doc.line(200, 536, 590, 536);
      doc.line(10, 560, 590, 560);

      doc.addPage();

      doc.rect(10, 10, 575, 400);
      doc.text("Life", 15, 24);

      doc.text("Religion", 15, 48);
      doc.line(100, 50, 570, 50);
      doc.line(100, 74, 570, 74);

      doc.text("Education", 15, 96);
      doc.line(100, 98, 570, 98);
      doc.line(100, 122, 570, 122);

      doc.text("Occupation", 15, 144);
      doc.line(100, 146, 570, 146);
      doc.line(100, 170, 570, 170);

      doc.text("Outside Agency", 15, 192);
      doc.line(100, 194, 570, 194);

      doc.text("Speech", 15, 216);

      doc.text("Easily Understood", 15, 240);
      doc.text("Yes", 20, 256);
      doc.text("No", 60, 256);

      doc.text("English as Primary Language", 200, 240);
      doc.text("Yes", 220, 256);
      doc.text("No", 260, 256);

      doc.text("Other Langauges", 15, 276);
      doc.line(100, 278, 570, 278);

      doc.text("Items", 15, 300);

      doc.text("Heating Pad", 15, 324);
      doc.text("Yes", 20, 340);
      doc.text("No", 60, 340);

      doc.text("Microwave", 200, 324);
      doc.text("Yes", 205, 340);
      doc.text("No", 245, 340);

      doc.text("Extension Cord", 400, 324);
      doc.text("Yes", 405, 340);
      doc.text("No", 445, 340);

      doc.text("Notes", 15, 360);
      doc.line(100, 362, 570, 362);
      doc.line(100, 386, 570, 386);

      doc.rect(10, 420, 575, 268);
      doc.text("Allergies", 15, 434);

      doc.text("Medication Allergies", 15, 458);
      doc.line(15, 484, 180, 484);
      doc.line(15, 510, 180, 510);
      doc.line(15, 534, 180, 534);
      doc.line(15, 558, 180, 558);
      doc.line(15, 582, 180, 582);
      doc.line(15, 606, 180, 606);

      doc.text("Food Allergies", 200, 458);
      doc.line(200, 484, 380, 484);
      doc.line(200, 510, 380, 510);
      doc.line(200, 534, 380, 534);
      doc.line(200, 558, 380, 558);
      doc.line(200, 582, 380, 582);
      doc.line(200, 606, 380, 606);

      doc.text("Other Allergies", 400, 458);
      doc.line(400, 484, 580, 484);
      doc.line(400, 510, 580, 510);
      doc.line(400, 534, 580, 534);
      doc.line(400, 558, 580, 558);
      doc.line(400, 582, 580, 582);
      doc.line(400, 606, 580, 606);

      doc.text("Notes", 15, 636);
      doc.line(100, 638, 580, 638);
      doc.line(100, 662, 580, 662);

      doc.addPage();

      doc.rect(10, 10, 575, 288);
      doc.text("Assistance", 15, 24);

      doc.text("Assist with Hair", 15, 48);
      doc.text("Yes", 20, 64);
      doc.text("No", 60, 64);

      doc.text("Has Barber", 200, 48);
      doc.text("Yes", 205, 64);
      doc.text("No", 245, 64);

      doc.text("Assist with Shaving", 400, 48);
      doc.text("Yes", 405, 64);
      doc.text("No", 445, 64);

      doc.text("Assist with Finger Nails", 15, 88);
      doc.text("Yes", 20, 104);
      doc.text("No", 60, 104);

      doc.text("Assist with Toe Nails", 400, 88);
      doc.text("Yes", 405, 104);
      doc.text("No", 445, 104);

      doc.text("Assist with Makeup", 15, 128);
      doc.text("Yes", 20, 144);
      doc.text("No", 60, 144);

      doc.text("Assist with Jewelry", 200, 128);
      doc.text("Yes", 205, 144);
      doc.text("No", 245, 144);

      doc.text("Assist with Lotion", 400, 128);
      doc.text("Yes", 405, 144);
      doc.text("No", 445, 144);
//
      doc.text("Layout Cloths", 15, 168);
      doc.text("Yes", 20, 184);
      doc.text("No", 60, 184);

      doc.text("Assist with Shoes", 200, 168);
      doc.text("Yes", 205, 184);
      doc.text("No", 245, 184);

      doc.text("Assist with Top", 400, 168);
      doc.text("Yes", 405, 184);
      doc.text("No", 445, 184);
//
      doc.text("Assist with Bottom", 15, 208);
      doc.text("Yes", 20, 224);
      doc.text("No", 60, 224);

      doc.text("Assist with Buttons", 200, 208);
      doc.text("Yes", 205, 224);
      doc.text("No", 245, 224);

      doc.text("Assist with Zippers", 400, 208);
      doc.text("Yes", 405, 224);
      doc.text("No", 445, 224);

      doc.text("Notes", 15, 248);
      doc.line(100, 250, 580, 250);
      doc.line(100, 274, 580, 274);

      doc.rect(10, 308, 575, 288);
      doc.text("Mobility", 15, 322);
      doc.text("Inside Apartment", 15, 346);

      doc.text("Use of Assistive Device", 15, 370);
      doc.text("Walker", 20, 386);
      doc.text("Cane", 120, 386);
      doc.text("Wheelchair", 220, 386);
      doc.text("Electric Wheelchair", 320, 386);
      doc.text("No Device", 420, 386);
      doc.text("Other", 520, 386);

      doc.text("Assistance with Device", 15, 410);
      doc.line(100, 412, 580, 412);
      doc.line(100, 436, 580, 436);

      doc.text("Special Ambulation Needs", 15, 460);
      doc.line(100, 462, 580, 462);
      doc.line(100, 488, 580, 488);

      doc.save("Blank Careplan.pdf");
    }

    return {
      exportPdf : exportPdf
    };

  }

})();
