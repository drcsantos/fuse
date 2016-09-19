'use strict';

describe('Add resident', function() {
  beforeEach(function () {
    browser.get('/residents');
  });

  it('Add resident', function() {

    var addBtn = element(by.css('#add-resident'));
    addBtn.click();

    // wait for modal to pop up
    browser.waitForAngular();

    submitForm();

  });

  function submitForm() {
    var firstName = element(by.model("vm.form.firstName"));
    firstName.sendKeys("Jolovan");

    var lastName = element(by.model('vm.form.lastName'));
    lastName.sendKeys('Iznogud');

    var middleName = element(by.model('vm.form.middleName'));
    middleName.sendKeys('Mile');

    var maidenName = element(by.model('vm.form.maidenName'));
    maidenName.sendKeys('Keva');

    var birthDate = element(by.model('vm.form.birthDate'));
    birthDate.sendKeys('11/06/1993');

    var admissionDate = element(by.model('vm.form.admissionDate'));
    admissionDate.sendKeys('12/07/2003');

    element(by.model('vm.form.sex')).sendKeys('BKN01');

    element(by.model('vm.form.locationInfo')).sendKeys('Denv');
    element(by.model('vm.form.locationInfo')).sendKeys(protractor.Key.ARROW_DOWN);
    element(by.model('vm.form.locationInfo')).sendKeys(protractor.Key.ENTER);

    element(by.model('vm.form.buildingStatus')).sendKeys('BKN01');

    element(by.css('#add-resident-btn')).click();

  }
});
