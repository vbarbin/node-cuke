require('colors');
var fs = require('fs');
var pegjs = require('pegjs');
//var cukeParser = require('./parser');
var cukeParser = pegjs.buildParser(fs.readFileSync(__dirname + '/parser-source.js').toString());

module.exports = function(Step, behaviour) {
    var features = [];
    var currentFeature;
    var currentStep;
    var currentScenario;

    var cuke = {
        Feature: function(name, fn) {
            currentFeature = {
                name: name,
                scenarios: [],
                exec: function exec(callback) {
                    var scenario = this.scenarios.shift();

                    if (scenario) {
                        console.log();
                        scenario(exec.bind(this, callback));
                    }
                    else {
                        callback();
                    }
                }
            };

            fn();

            features.push(currentFeature);
            currentFeature = null;
        },
        InOrder: function(text) {
            currentFeature.inOrder = text;
        },
        AsA: function(text) {
            currentFeature.asA = text;
        },
        IWant: function(text) {
            currentFeature.iWant = text;
        },
        Scenario: function(name, fn) {
            currentStep = new Step();
            currentScenario = [];

            fn();

            var destroy = function(stepDefinition) {
                if (stepDefinition.destroy) {
                    stepDefinition.destroy();
                }
            }.bind(null, currentStep);

            currentFeature.scenarios.push(function(currentScenario, callback) {
                console.log(('  Scenario: ' + name).green);

                (function callee() {
                    var step = currentScenario.shift();

                    if (step) {
                        var p;

                        try {
                            p = step.fn();
                        }
                        catch (err) {
                            console.log('    ', step.text.red);
                            console.error(err.stack || err);
                            destroy();
                            return callback();
                        }

                        if (p) {
                            p.then(function() {
                                console.log('    ', step.text.green);
                                process.nextTick(callee);
                            }, function(err) {
                                console.log('    ', step.text.red);
                                console.error(err.stack || err);
                                destroy();
                                callback();
                            });
                        }
                        else {
                            console.log('    ', step.text.green);
                            process.nextTick(callee);
                        }
                    }
                    else {
                        destroy();
                        callback();
                    }
                })();
            }.bind(null, currentScenario));
        },
        Given: function(text) {
            doit(currentStep, currentScenario, 'given', 'Given ' + text);
            this.And = this.GivenAnd;
        },
        GivenAnd: function(text) {
            doit(currentStep, currentScenario, 'given', 'And ' + text);
        },
        When: function(text) {
            doit(currentStep, currentScenario, 'when', 'When ' + text);
            this.And = this.WhenAnd;
        },
        WhenAnd: function(text) {
            doit(currentStep, currentScenario, 'when', 'And ' + text);
        },
        Then: function(text) {
            doit(currentStep, currentScenario, 'then', 'Then ' + text);
            this.And = this.ThenAnd;
        },
        ThenAnd: function(text) {
            doit(currentStep, currentScenario, 'then', 'And ' + text);
        }
    };

    console.log(cukeParser.parse(behaviour));

    (function callee() {

        var feature = features.shift();

        if (feature) {
            console.log('Feature:', feature.name);
            console.log('  In order', feature.inOrder);
            console.log('  As a', feature.asA);
            console.log('  I want', feature.iWant);

            feature.exec(function() {
                console.log();
                process.nextTick(callee);
            });
        }

    })();
};

function doit(currentStep, currentScenario, what, text) {
    var notFound = Object.keys(currentStep[what]).every(function(key) {
        var re = new RegExp(key);
        var m = text.match(re);
        var fn = currentStep[what][key].bind(currentStep);

        if (m) {
            for (var i = 1; i < m.length; i++) {
                fn = fn.bind(null, m[i]);
            }

            currentScenario.push({
                fn: fn,
                text: text
            });

            return false;
        }

        return true;
    });

    if (notFound) {
        console.log(text.red);
    }
}