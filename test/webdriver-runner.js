var Using = require('../lib');

Using(require('./webdriver-steps'), function() {
    Feature('Google Search', function() {
        InOrder('find something');
        AsA('man');
        IWant('to be able to search in google');

        Scenario('Search webdriver', function() {
            Given('I have browsed http://www.google.com');
            And('I have entered webdriver into the search box');
            When('I press search');
            Then('the title should be webdriver - Google Search');
        });

        Scenario('Search coco', function() {
            Given('I have browsed http://www.google.com');
            And('I have entered coco into the search box');
            When('I press search');
            Then('the title should be coco - Google Search');
        });
    });
});
