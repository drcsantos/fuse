'use strict';

describe('Create community', function() {
  beforeEach(function () {
    browser.get('/dashboard');
  });

  it('Create community', function() {

    var addBtn = element(by.css('#join-community'));
    addBtn.click();

    // wait for modal to pop up
    browser.waitForAngular();

    submitForm();


  });

  it('Should logout the user', function() {
    element(by.css('.user-button')).click();
    element(by.css('#logout')).click();
  });

  function submitForm() {
    var titleInput = element(by.model("vm.form.name"));
    titleInput.sendKeys("North Korea");

    var cardNumber = element(by.model("vm.cardInfo.number"));
    cardNumber.sendKeys("4242424242424242");

    var expMonth = element(by.model("vm.cardInfo.exp_month"));
    expMonth.sendKeys("11");

    var expYear = element(by.model("vm.cardInfo.exp_year"));
    expYear.sendKeys("19");

    var cvc = element(by.model("vm.cardInfo.cvc"));
    expMonth.sendKeys("729");

    element(by.css('#add-community')).click();

    browser.driver.sleep(3500);
    browser.waitForAngular();
  }
});
