Feature: Contact Form Validation
  As a user without data
  I want to try submitting the form empty
  So that I can validate that the website displays validation messages

  @negative @validation
  Scenario: Attempt to submit the contact form without filling in required fields
    Given I am on Facephi's public page
    And I navigate to the Contact page
    Then the current URL should contain "contacta"
    When I try to submit the form without entering any data
    Then I should see an error message indicating that required fields are missing