Feature: Test
  In order to test this syntax
  As a developper
  I want to parse feature files.

  Scenario: Server
    Given I've started my server on port 12334
    And I've browsed to http://localhost:12334/index.html
    When I click the button doit
    Then I should see Hello world in the textbox