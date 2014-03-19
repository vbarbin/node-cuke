var Using = require('../lib');

Using(require('./asyncCalculator-steps'), function() {

    Feature('Addition', function() {
        InOrder('to avoid silly mistakes');
        AsA('math idiot');
        IWant('to be told the sum of two numbers');

        Scenario('Add to numbers', function() {
            Given('I have entered 50 into the calculator');
            And('I have entered 70 into the calculator');
            When('I press add');
            Then('the result should be 120 on the screen');
        });

        Scenario('Add to other numbers', function() {
            Given('I have entered 30 into the calculator');
            And('I have entered 70 into the calculator');
            When('I press add');
            Then('the result should be 100 on the screen');
        });
    });

    Feature('Substraction', function() {
        InOrder('to avoid silly mistakes');
        AsA('math idiot');
        IWant('to be told the substraction of two numbers');

        Scenario('Add to numbers', function() {
            Given('I have entered 70 into the calculator');
            And('I have entered 50 into the calculator');
            When('I press substract');
            Then('the result should be 20 on the screen');
        });
    });

});
