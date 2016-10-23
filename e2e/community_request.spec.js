'use strict';

describe('Community request', function() {
  beforeEach(function () {
    browser.get('/auth/login');
  });

  it('Login user', function() {

    element(by.model('vm.form.email')).sendKeys('pajo@gmail.com');
    element(by.model('vm.form.password')).sendKeys('123456');

    element(by.css('.submit-button')).click();

    var communityTitle = element(by.binding('vm.title'));
    browser.wait(protractor.until.elementIsVisible(communityTitle), 10000, 'Error: Element did not display within 10 seconds');

  });

  it('Should send a request to join community', function() {

    var addBtn = element(by.css('#join-modal'));
    addBtn.click();

    // wait for modal to pop up
    browser.waitForAngular();

    var selectedItem = element(by.css("md-autocomplete input#select-community"));
    //selectedItem.sendKeys("North");
    selectedItem.sendKeys(protractor.Key.ARROW_DOWN);
    selectedItem.sendKeys(protractor.Key.ENTER);

    element(by.css("#send-request")).click();

    browser.driver.sleep(1000);

  });

});
