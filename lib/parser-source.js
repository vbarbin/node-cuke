Start
 = Feature+

Feature
 = FeatureName
 InOrder
 AsA
 IWant
 EatLine LineTerminator?
 Scenario+

Scenario
 = ScenarioName
 Given And* When And* Then And*
 EatLine LineTerminator?

FeatureName
 = "Feature: " name:EatLine LineTerminator? { return { featureName: name.join('').replace(/,/g, '') }}

InOrder
 = WhiteSpace* "In order " exp:EatLine LineTerminator? { return { inOrder: exp.join('').replace(/,/g, '') } }

AsA
 = WhiteSpace* "As a " exp:EatLine LineTerminator? { return { asa: exp.join('').replace(/,/g, '') } }

IWant
 = WhiteSpace* "I want " exp:EatLine LineTerminator? { return { iWant: exp.join('').replace(/,/g, '') } }

ScenarioName
 = WhiteSpace* "Scenario: " name:EatLine LineTerminator? { return { scenarioName: name.join('').replace(/,/g, '') }}

Given
 = WhiteSpace* "Given " exp:EatLine LineTerminator? { return { given: exp.join('').replace(/,/g, '') } }

When
 = WhiteSpace* "When " exp:EatLine LineTerminator? { return { when: exp.join('').replace(/,/g, '') } }

And
 = WhiteSpace* "And " exp:EatLine LineTerminator? { return { and: exp.join('').replace(/,/g, '') } }

Then
 = WhiteSpace* "Then " exp:EatLine LineTerminator? { return { then: exp.join('').replace(/,/g, '') } }

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