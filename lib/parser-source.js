{
    var q = require('q');

    function doit(currentStep, what, text) {
        var fn;
        var notFound = Object.keys(currentStep[what]).every(function(key) {
            var re = new RegExp(key);
            var m = text.match(re);
            
            fn = currentStep[what][key].bind(currentStep);

            if (m) {
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

Start
 = Feature+

Feature
 = name:FeatureName
    inOrder:InOrder
    asA:AsA
    iWant:IWant
    EatLine LineTerminatorSequence?
    scenarios:Scenario+
    {
    return {
        name:name,
        inOrder:inOrder,
        asA:asA,
        iWant:iWant,
        scenarios:scenarios,
        exec: function exec(Step, callback) {
            var self = this;
            console.log(('Feature: ' + this.name
                            + '\n  In order ' + this.inOrder
                            + '\n  As a ' + this.asA
                            + '\n  I want ' + this.iWant).green);

            (function callee() {
                console.log();
                scenario = self.scenarios.shift();
                if (scenario) {
                    scenario.exec(Step, function() {
                        process.nextTick(callee)
                    });
                }
                else {
                    callback();
                }
            })();
            
        }
    }
}

Scenario
 = name:ScenarioName
 given:Given 
 when:When
 then:Then
 EatLine LineTerminatorSequence?
 {
    return {
        name:name,
        given:given,
        when:when,
        then:then,
        exec: function(Step, callback) {
            console.log(('  Scenario: ' + name).green);
            var currentStep = new Step();
            var self = this;
            var destroy = function(stepDefinition) {
                if (stepDefinition.destroy) {
                    stepDefinition.destroy();
                }
            }.bind(null, currentStep);

            var execPlan = [];
            ['given', 'when', 'then'].forEach(function(what) {
                self[what].forEach(function(step) {
                    execPlan.push({
                        text: step,
                        fn: doit(currentStep, what, step)
                    });
                });
            });

            (function callee() {
                var task = execPlan.shift();
                if (task) {
                    try {
                        p = task.fn();
                        if (p) {
                            p = p.then(function() {
                                console.log('    ' + task.text.green);
                                process.nextTick(callee);
                            }, function(err) {
                                console.log('    ' + task.text.red);
                                console.error(err.stack || err);
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
                        destroy();
                        callback();
                    }
                }
                else {
                    destroy();
                    callback();
                }
            })();
        }
    }
 }


FeatureName
 = "Feature: " name:EatLine LineTerminatorSequence? { return name.join('').replace(/,/g, '') }

InOrder
 = WhiteSpace* "In order " exp:EatLine LineTerminatorSequence? { return exp.join('').replace(/,/g, '') }

AsA
 = WhiteSpace* "As a " exp:EatLine LineTerminatorSequence? { return exp.join('').replace(/,/g, '') }

IWant
 = WhiteSpace* "I want " exp:EatLine LineTerminatorSequence? { return exp.join('').replace(/,/g, '') }


ScenarioName
 = WhiteSpace* "Scenario: " name:EatLine LineTerminatorSequence? { return name.join('').replace(/,/g, '') }

Given
 = WhiteSpace* "Given " exp:EatLine LineTerminatorSequence?
 and:And*
 { return ['Given ' + exp.join('').replace(/,/g, '')].concat(and) }

When
 = WhiteSpace* "When " exp:EatLine LineTerminatorSequence? 
  and:And*
 { return ["When " + exp.join('').replace(/,/g, '')].concat(and) }

Then
 = WhiteSpace* "Then " exp:EatLine LineTerminatorSequence? 
  and:And*
  { return ["Then " + exp.join('').replace(/,/g, '')].concat(and) }

And
 = WhiteSpace* "And " exp:EatLine LineTerminatorSequence? { return 'And ' + exp.join('').replace(/,/g, '') }

EatLine = (!LineTerminator .)*

WhiteSpace "whitespace"
  = "\t"
  / "\v"
  / "\f"
  / " "
  / "\u00A0"
  / "\uFEFF"
  / Zs

LineTerminator
  = [\n\r\u2028\u2029]

LineTerminatorSequence "end of line"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"

// Separator, Space
Zs = [\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]
