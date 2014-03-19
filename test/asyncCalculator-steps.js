var assert = require('assert');
var q = require('q');

var AsyncCalculatorSteps = module.exports = exports = function() {
    this.calculator = require('./asyncCalculator');
    this.inputs = [];
};

AsyncCalculatorSteps.prototype = {
    given: {
        'I have entered (\\d*) into the calculator': function(n) {
            this.inputs.push(+n);
        }
    },
    when: {
        'I press (.*)': function(operation) {
            return q.npost(this.calculator, operation, this.inputs).then(function(result) {
                this.result = result;
            }.bind(this));
        }
    },
    then: {
        'the result should be (\\d*) on the screen': function(result) {
            assert.equal(this.result, +result);
        }
    }
};