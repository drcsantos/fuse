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
      doc.text("Exported on", 10, 24);
      doc.text(10, 40, filteredExportDate + " ");

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

      doc.text("Full Code", 220, 270);
      doc.text("Yes", 225, 286);
      doc.text("No", 265, 286);

      doc.text("Sex", 390, 270);
      doc.text("Male", 395, 286);
      doc.text("Female", 435, 286);
      doc.text("Other", 495, 286);

      doc.text("Date of Birth", 220, 310);
      doc.line(297, 312, 380, 312);

      doc.text("Admission Date", 390, 310);
      doc.line(500, 312, 590, 312);

      doc.text("Moved From (Town)", 220, 336);
      doc.line(320, 338, 590, 338);

      doc.text("Primary Doctor", 220, 362);
      doc.line(320, 364, 590, 364);

      doc.text("Pharmacy", 220, 388);
      doc.line(320, 390, 590, 390);

      doc.text("Floor", 220, 414);
      doc.line(297, 416, 380, 416);

      doc.text("Room", 390, 414);
      doc.line(500, 416, 590, 416);

      doc.text("Assessment Interval", 10, 442);
      doc.text("None", 20, 458);
      doc.text("Weekly", 60, 458);
      doc.text("Monthly", 110, 458);
      doc.text("Quarterly", 160, 458);
      doc.text("Yearly", 220, 458);

      doc.text("Marital Status", 260, 442);
      doc.text("Single", 265, 458);
      doc.text("Divorced", 305, 458);
      doc.text("Widowed", 360, 458);
      doc.text("Married", 420, 458);
      doc.text("Single Never Married", 470, 458);

      doc.text("Handles Finances", 10, 482);
      doc.line(110, 484, 590, 484);

      doc.text("Long Term Care Insurance", 10, 508);
      doc.text("Yes", 20, 524);
      doc.text("No", 50, 524);

      doc.text("Receiving Long Term Care Insurance", 300, 508);
      doc.text("Yes", 320, 524);
      doc.text("No", 350, 524);

      doc.text("Appointment Coordination", 10, 548);
      doc.text("Self", 20, 564);
      doc.text("Assist", 60, 564);
      doc.text("Family", 100, 564);

      doc.text("Veteran", 300, 548);
      doc.text("Yes", 320, 564);
      doc.text("No", 350, 564);

      doc.text("Administrative Notes", 10, 634);
      doc.line(200, 636, 590, 636);
      doc.line(10, 660, 590, 660);

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

      doc.text("Layout Cloths", 15, 168);
      doc.text("Yes", 20, 184);
      doc.text("No", 60, 184);

      doc.text("Assist with Shoes", 200, 168);
      doc.text("Yes", 205, 184);
      doc.text("No", 245, 184);

      doc.text("Assist with Top", 400, 168);
      doc.text("Yes", 405, 184);
      doc.text("No", 445, 184);

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

      doc.rect(10, 308, 575, 600);
      doc.text("Mobility", 15, 322);
      doc.text("Inside Apartment", 15, 346);

      doc.text("Use of Assistive Device", 15, 370);
      doc.text("Walker", 20, 386);
      doc.text("Cane", 100, 386);
      doc.text("Wheelchair", 200, 386);
      doc.text("Electric Wheelchair", 300, 386);
      doc.text("No Device", 420, 386);
      doc.text("Other", 520, 386);

      doc.text("Assistance with Device", 15, 410);
      doc.line(100, 412, 580, 412);
      doc.line(100, 436, 580, 436);

      doc.text("Special Ambulation Needs", 15, 460);
      doc.line(100, 462, 580, 462);
      doc.line(100, 488, 580, 488);

      doc.text("Mobility Equipment", 15, 512);
      doc.text("Transfer Pole", 20, 528);
      doc.text("Side Rails", 120, 528);
      doc.text("Pivot Transfer", 220, 528);
      doc.text("Lift Recliner Chair", 320, 528);
      doc.text("Transfer Lift", 420, 528);

      doc.text("Outside Apartment", 15, 552);
      doc.setDrawColor(181,181,181); // draw grey line
      doc.line(100, 548, 580, 548);
      doc.setDrawColor(0,0,0); // draw black line

      doc.text("Use of Assistive Device", 15, 576);
      doc.text("Walker", 20, 592);
      doc.text("Cane", 100, 592);
      doc.text("Wheelchair", 200, 592);
      doc.text("Electric Wheelchair", 300, 592);
      doc.text("No Device", 420, 592);
      doc.text("Other", 520, 592);

      doc.text("Assistance with Device", 15, 616);
      doc.line(100, 618, 580, 618);
      doc.line(100, 642, 580, 642);

      doc.text("Special Ambulation Needs", 15, 666);
      doc.line(100, 668, 580, 668);
      doc.line(100, 692, 580, 692);

      doc.text("Transfers", 15, 716);
      doc.text("Independent", 20, 732);
      doc.text("Standby", 100, 732);
      doc.text("Full Assist", 200, 732);
      doc.text("Transfer Pole", 300, 732);
      doc.text("Gait Belt", 400, 732);

      doc.text("Transfers Description", 15, 756);
      doc.line(100, 758, 580, 758);
      doc.line(100, 782, 580, 782);

      doc.text("Fall Risk", 15, 806);
      doc.text("Yes", 20, 822);
      doc.text("No", 70, 822);

      doc.text("Fall Risk Description", 200, 806);
      doc.line(300, 808, 580, 808);
      doc.line(300, 832, 580, 832);

      doc.addPage();
      doc.rect(10, 0, 575, 210);

      doc.text("Bed Repositioning", 15, 24);
      doc.text("Yes", 20, 40);
      doc.text("No", 70, 40);

      doc.text("Two Person Lift", 200, 24);
      doc.text("Yes", 205, 40);
      doc.text("No", 255, 40);

      doc.text("Bed Reposition Description", 15, 64);
      doc.line(100, 66, 580, 66);
      doc.line(100, 90, 580, 90);

      doc.text("Bed Reposition Outside Agency", 15, 114);
      doc.line(100, 116, 580, 116);
      doc.line(100, 140, 580, 140);

      doc.text("Notes", 15, 164);
      doc.line(100, 166, 580, 166);
      doc.line(100, 188, 580, 188);

      doc.rect(10, 220, 575, 270);
      doc.text("Sleep", 15, 234);

      doc.text("Usual Bedtime", 15, 258);
      doc.line(100, 260, 580, 260);

      doc.text("Usual Arising Time", 15, 284);
      doc.line(100, 286, 580, 286);

      doc.text("Naps", 15, 310);
      doc.text("Yes", 20, 326);
      doc.text("No", 70, 326);

      doc.text("Nap Description", 200, 310);
      doc.line(300, 312, 580, 312);
      doc.line(300, 336, 580, 336);

      doc.text("Assistance to Bed", 15, 360);
      doc.text("Medication", 20, 376);
      doc.text("Positioning", 90, 376);
      doc.text("Pillows", 160, 376);
      doc.text("Drink", 210, 376);
      doc.text("Alcohol", 260, 376);
      doc.text("Hot Tea", 330, 376);
      doc.text("Warm Milk", 400, 376);
      doc.text("Other", 470, 376);
      doc.text("None", 540, 376);

      doc.text("Sleeps through the Night", 15, 400);
      doc.text("Yes", 20, 416);
      doc.text("No", 70, 416);

      doc.text("Can Call for Assistance", 250, 400);
      doc.text("Yes", 255, 416);
      doc.text("No", 325, 416);

      doc.text("Notes", 15, 440);
      doc.line(100, 442, 580, 442);
      doc.line(100, 466, 580, 466);

      doc.rect(10, 500, 575, 400);
      doc.text("Nutrition", 15, 514);

      doc.text("Overall Nutrition", 15, 538);
      doc.text("Good", 20, 554);
      doc.text("Poor", 70, 554);

      doc.text("Poor Nutition Description", 200, 538);
      doc.line(300, 540, 580, 540);
      doc.line(300, 564, 580, 564);

      doc.text("Diabetic", 15, 588);
      doc.text("Yes", 20, 604);
      doc.text("No", 70, 604);

      doc.text("Diabetic Type", 200, 588);
      doc.text("Diet Controlled", 205, 604);
      doc.text("Medication Controlled", 305, 604);
      doc.text("Insulin Controlled", 435, 604);

      doc.text("Blood Sugar Monitoring", 15, 628);
      doc.text("Yes", 20, 644);
      doc.text("No", 70, 644);

      doc.text("Bedtime Snack", 200, 628);
      doc.text("Yes", 205, 644);
      doc.text("No", 255, 644);

      doc.text("Adaptive Equipment", 15, 668);
      doc.text("Plate Guard", 20, 684);
      doc.text("Built Up Silverware", 120, 684);
      doc.text("Special Cups", 270, 684);
      doc.text("None", 370, 684);

      doc.text("Type of Diet", 15, 708);
      doc.text("BRAT", 20, 724);
      doc.text("Gluten Free", 100, 724);
      doc.text("Full Vegan", 180, 724);
      doc.text("Partial Vegan", 260, 724);
      doc.text("Lactose Free", 340, 724);
      doc.text("Other", 420, 724);
      doc.text("Regular", 500, 724);

      doc.text("Special Diet", 15, 748);
      doc.text("Pureed", 20, 764);
      doc.text("Ground", 100, 764);
      doc.text("Soft", 180, 764);
      doc.text("Regular", 260, 764);

      doc.text("Finger Foods", 15, 788);
      doc.text("Yes", 20, 804);
      doc.text("No", 70, 804);

      doc.text("Food in Room", 200, 788);
      doc.text("Yes", 205, 804);
      doc.text("No", 255, 804);

      doc.text("Drink in Room", 400, 788);
      doc.text("Yes", 405, 804);
      doc.text("No", 455, 804);

      doc.addPage();
      doc.rect(10, 0, 575, 116);

      doc.text("Food Assistance", 15, 24);
      doc.text("Independent", 20, 40);
      doc.text("Reminder", 100, 40);
      doc.text("Partial Assistance", 180, 40);
      doc.text("Full Assistance", 290, 40);

      doc.text("Notes", 15, 64);
      doc.line(100, 66, 580, 66);
      doc.line(100, 90, 580, 90);

      doc.rect(10, 126, 575, 600);
      doc.text("Physical Condition", 15, 140);
      doc.text("Skin", 15, 164);

      doc.text("Skin Condition", 15, 188);
      doc.text("Average", 20, 204);
      doc.text("Tears Easily", 80, 204);

      doc.text("Wound that needs Dressing", 200, 188);
      doc.text("Yes", 205, 204);
      doc.text("No", 255, 204);

      doc.text("Wound Amount", 400, 188);
      doc.line(500, 190, 580, 190);

      doc.text("At Risk for Skin Breakdown", 15, 228);
      doc.text("Yes", 20, 244);
      doc.text("No", 70, 244);

      doc.text("Infection", 15, 268);

      doc.text("UTI Risk", 15, 292);
      doc.text("Yes", 20, 308);
      doc.text("No", 70, 308);

      doc.text("URI Risk", 200, 292);
      doc.text("Yes", 205, 308);
      doc.text("No", 255, 308);

      doc.text("MRSA Risk", 400, 292);
      doc.text("Yes", 405, 308);
      doc.text("No", 455, 308);

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

      doc.save("Blank Careplan.pdf");
    }

    return {
      exportPdf : exportPdf
    };

  }

})();
