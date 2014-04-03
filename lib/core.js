'use strict';

var core = module.exports = exports = {
    createFeature: function(data) {
        return {
            name:data.name,
            description:data.description,
            scenarios:data.scenarios,
            exec: function executeFeature(Step, callback) {
                var self = this;
                console.log(('Feature: ' + this.name
                                + '\n  ' + this.description).green);

                (function callee() {
                    var scenario = self.scenarios.shift();
                    if (scenario) {
                        scenario.exec(Step, function() {
                            process.nextTick(callee);
                            console.log();
                        });
                    }
                    else {
                        callback();
                    }
                })();
            }
        }
    },

    createScenario: function(data) {
        return {
            name: data.name,
            given: data.given,
            when: data.when,
            then: data.then,
            exec: function executeScenario(Step, callback) {
                console.log(('  Scenario: ' + this.name).green);
                var currentStep = new Step();
                var self = this;
                var destroy = function(stepDefinition) {
                    if (stepDefinition.destroy) {
                        stepDefinition.destroy();
                    }
                }.bind(null, currentStep);
                var done = function() {
                    destroy();
                    if (callback) callback();
                }

                var execPlan = [];
                ['given', 'when', 'then'].forEach(function(what) {
                    self[what].forEach(function(step) {
                        execPlan.push({
                            text: step,
                            fn: core.executeStep(currentStep, what, step)
                        });
                    });
                });

                (function callee() {
                    var task = execPlan.shift();
                    if (task) {
                        try {
                            var p = task.fn();
                            if (p) {
                                p = p.then(function() {
                                    console.log('    ' + task.text.green);
                                    process.nextTick(callee);
                                }, function(err) {
                                    console.log('    ' + task.text.red);
                                    console.error(err.stack || err);
                                    done();
                                });
                            }
                            else {
                                console.log('    ' + task.text.green);
                                process.nextTick(callee);
                            }
                        }
                        catch (err) {
                            console.log('    ' + task.text.red);
                            console.error(err.stack || err);
                            done();
                        }
                    }
                    else {
                        done();
                    }
                })();
            }
        }
    },

    executeFeatures: function executeFeatures(Step, features) {
        (function callee() {

            var feature = features.shift();

            if (feature) {
                feature.exec(Step, function() {
                    console.log();
                    process.nextTick(callee);
                });
            }

        })();
    },

    executeStep: function executeStep(currentStep, what, text) {
        var fn = function() {};
        var notFound = Object.keys(currentStep[what]).every(function(key) {
            var re = new RegExp(key);
            var m = text.match(re);
            
            if (m) {
                fn = currentStep[what][key].bind(currentStep);
                for (var i = 1; i < m.length; i++) {
                    fn = fn.bind(null, m[i]);
                }

                return false;
            }

            return true;
        });

        if (notFound) {
            console.log('    ', text.red);
        }   

        return fn; 
    }
}