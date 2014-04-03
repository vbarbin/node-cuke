'use strict';

var core = require('../lib/core');
var q = require('q');

describe('Cuke core', function() {

    it('should exist', function() {
        expect(core).toBeDefined();
    });

    var featureSource = {
        name: 'Test feature',
        description: 'In order to run\nAs a test\nI want to be a real feature',
        scenarios: []
    };

    var scenarioSource = {
        name: 'Test Scenario',
        given: ['I have entered 2'],
        when: ['I do something'],
        then: ['It should produce some result'],
    };

    var Step;
    var stepSpy;
    var noOp = function() {};

    beforeEach(function() {
        stepSpy = jasmine.createSpy('some step process');
        Step = function() {};
        Step.prototype = {
            given: {
                'I have entered (\\d*)': stepSpy
            },
            when: {
                'I do something': noOp
            },
            then: {
                'It should produce some result': noOp
            }
        };
    })

    describe('createFeature', function() {

        it('should return a Feature object', function() {
            var feature = core.createFeature(featureSource);

            expect(feature.name).toBe(featureSource.name);
            expect(feature.description).toEqual(featureSource.description);
            expect(feature.scenarios).toBe(featureSource.scenarios);
            expect(feature.exec).toBeDefined();
        });

    });

    describe('createScenario', function() {

        it('should return a Feature object', function() {
            var scenario = core.createScenario(scenarioSource);

            expect(scenario.name).toBe(scenarioSource.name);
        });

    });

    describe('executeFeatures', function() {

        it('should execute inner scenarios', function() {
            var features = [core.createFeature(featureSource)];
            features[0].scenarios.push(core.createScenario(scenarioSource));
            core.executeFeatures(Step, features);
            expect(stepSpy).toHaveBeenCalled();
        });

    });

    describe('executeScenario', function() {

        it('should execute step even when no callback is passed', function() {
            var scenario = core.createScenario(scenarioSource);
            scenario.exec(Step);
            expect(stepSpy).toHaveBeenCalled();
        });

        it('should execute step destroy when defined', function() {
            var scenario = core.createScenario(scenarioSource);
            var destroySpy = jasmine.createSpy('destroy');
            Step.prototype.destroy = function() {
                destroySpy();
            };
            scenario.exec(Step, function() {
                expect(stepSpy).toHaveBeenCalled();
                expect(destroySpy).toHaveBeenCalled();
            });
        });

        describe('with promises', function() {

            it('should execute step', function(done) {
                var scenario = core.createScenario(scenarioSource);
                Step.prototype.when['I do something'] = function() {
                    var deferred = q.defer();
                    process.nextTick(function() {
                        deferred.resolve();
                    });

                    return deferred.promise;
                };
                scenario.exec(Step, function() {
                    expect(stepSpy).toHaveBeenCalled();
                    done();
                });
            });

            it('should handle errors when executing step', function(done) {
                var scenario = core.createScenario(scenarioSource);
                Step.prototype.when['I do something'] = function() {
                    var deferred = q.defer();
                    process.nextTick(function() {
                        deferred.reject({message: 'Error', stack: 'Error'});
                    });

                    return deferred.promise.catch(function(err) {
                        expect(err.message).toEqual('Error');
                        done();
                    });
                };
                scenario.exec(Step, function() {
                });
            });

        });

    });

    describe('executeStep', function() {

        it('should not execute step when string does not match', function() {
            core.executeStep(new Step(), 'given', 'I do not match')();
            expect(stepSpy).not.toHaveBeenCalled();
        });

        it('should execute step when string matches', function() {
            core.executeStep(new Step(), 'given', 'I have entered 2')();
            expect(stepSpy).toHaveBeenCalled();
        });

    });

});