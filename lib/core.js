'use strict';

var linq = require('linq');
var logger = require('./logger');

var core = module.exports = exports = {
    createFeature: function(data) {
        return {
            name: data.name,
            description: data.description,
            scenarios: data.scenarios,
            exec: function executeFeature(Step, callback) {
                var self = this;
                logger.log('\nFeature: ' + this.name + '\n  ' + this.description);

                (function callee() {
                    var scenario = self.scenarios.shift();
                    if (scenario) {
                        scenario.exec(Step, function() {
                            process.nextTick(callee);
                            logger.newline();
                        });
                    } else {
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
                logger.success('  Scenario: ' + this.name);
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
                var toto = linq.from(['given', 'when', 'then']).select(function(x) { return { text: x, fn: core.executeStep(currentStep, x, self[x]) }; });
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
                                    logger.success('    ' + task.text);
                                    process.nextTick(callee);
                                }, function(err) {
                                    logger.error('    ' + task.text);
                                    logger.error(err.stack || err);
                                    done();
                                });
                            } else {
                                logger.success('    ' + task.text);
                                process.nextTick(callee);
                            }
                        } catch (err) {
                            logger.error('    ' + task.text);
                            logger.error(err.stack || err);
                            done();
                        }
                    } else {
                        done();
                    }
                })();
            }
        }
    },

    executeFeatures: function executeFeatures(Step, features) {
        var stepsCount = linq.from(features).selectMany('$.scenarios').selectMany('$.given.concat($.when).concat($.then)').toArray().length;
        var featuresCount = features.length;

        (function callee() {

            var feature = features.shift();

            if (feature) {
                feature.exec(Step, function() {
                    logger.newline();
                    process.nextTick(callee);
                });
            } else {
                console.log(featuresCount + ' Features\n'
                    + stepsCount + ' Steps'
                );
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
            logger.error('    ', text);
        }

        return fn;
    }
}