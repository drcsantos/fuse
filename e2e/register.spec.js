'use strict';

describe('User register', function() {
  it('Should load register and maximize it', function () {
    browser.get('/auth/register');
    browser.driver.manage().window().maximize();
  });

  it('Register user', function() {

    element(by.model('vm.form.username')).sendKeys('Shone');
    element(by.model('vm.form.email')).sendKeys('shone@gmail.com');
    element(by.model('vm.form.password')).sendKeys('123456'); //very security
    element(by.model('vm.form.passwordConfirm')).sendKeys('123456');
    element(by.model('data.cb1')).click();

    element(by.css('.submit-button')).click();

    var communityTitle = element(by.binding('vm.title'));
    browser.wait(protractor.until.elementIsVisible(communityTitle), 10000, 'Error: Element did not display within 10 seconds');

  });

  it('Should logout the user', function() {
    element(by.css('.user-button')).click();
    element(by.css('#logout')).click();
  });
});
