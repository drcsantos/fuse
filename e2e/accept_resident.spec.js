'use strict';

describe('Accept resident', function() {
  beforeEach(function () {
    browser.get('/auth/login');
  });

  it('Should logout the user', function() {
    element(by.css('.user-button')).click();
    element(by.css('#logout')).click();
  });

  it('Should login the user', function() {

    element(by.model('vm.form.email')).sendKeys('shone@gmail.com');
    element(by.model('vm.form.password')).sendKeys('123456');

    element(by.css('.submit-button')).click();

    var communityTitle = element(by.binding('vm.title'));
    browser.wait(protractor.until.elementIsVisible(communityTitle), 10000, 'Error: Element did not display within 10 seconds');

  });

  it('Should accept resident', function() {
      browser.driver.sleep(3000);

  });

  function submitForm() {

  }
});
