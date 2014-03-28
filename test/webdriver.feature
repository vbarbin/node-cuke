Feature: Google Search
  In order to find something
  As a web addict
  I want to be able to search in google

  Scenario: Search webdriver
    Given I have browsed http://www.google.com
    And I have entered webdriver into the search box
    When I press search
    Then the title should be webdriver - Google Search

  Scenario: Search coco
    Given I have browsed http://www.google.com
    And I have entered coco into the search box
    When I press search
    Then the title should be coco - Google Search
