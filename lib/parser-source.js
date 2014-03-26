Start
 = Feature+

Feature
 = featureName:FeatureName
 inOrder:InOrder
 asA:AsA
 iWant:IWant
 EatLine LineTerminatorSequence?
 scenarios:Scenario+
 {
    return {
         featureName:featureName,
         inOrder:inOrder,
         asA:asA,
         iWant:iWant,
         scenarios:scenarios
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
      scenarioName:name,
      given:given,
      when:when,
      then:then
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
 { return [exp.join('').replace(/,/g, '')].concat(and) }

When
 = WhiteSpace* "When " exp:EatLine LineTerminatorSequence? 
  and:And*
 { return [exp.join('').replace(/,/g, '')].concat(and) }

Then
 = WhiteSpace* "Then " exp:EatLine LineTerminatorSequence? 
  and:And*
  { return [exp.join('').replace(/,/g, '')].concat(and) }

And
 = WhiteSpace* "And " exp:EatLine LineTerminatorSequence? { return exp.join('').replace(/,/g, '') }

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
