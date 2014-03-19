var assert = require('assert');
var webdriver = require('selenium-webdriver');
var q = require('q');

var StepDefinition = module.exports = function() {
    this.driver = new webdriver.Builder()
        .usingServer('http://192.168.56.1:4444/wd/hub')
        .withCapabilities(webdriver.Capabilities.chrome())
        .build();
}

StepDefinition.prototype = {
    given: {
        'I have browsed (.*)': function(url) {
            this.driver.get(url);
        },
        'I have entered (.*) into the search box': function(input) {
            this.driver.findElement(webdriver.By.name('q')).sendKeys(input);
        }
    },
    when: {
        'I press search': function() {
            this.driver.findElement(webdriver.By.name('btnG')).click();
        }
    },
    then: {
        'the title should be (.*)': function(result) {
            return this.driver.wait(function() {
                return this.driver.getTitle().then(function(title) {
                    return title === result;
                });
            }.bind(this), 1000);
        }
    },
    destroy: function() {
        this.driver.quit();
    }
}
