Feature: Main navigation of Facephi's public site
  As a visiting user
  I want to be able to navigate through the main sections
  So that I can explore Facephi's products without navigation errors

  @smoke @happy_path
  Scenario Outline: Navigate from the home page to the <section> section
    Given I am on Facephi's public page
    When I access the "<section>" section from the main menu
    And I access the "<sub-section>" submenu
    Then the current URL should contain "<url>"

    Examples:
      | section       | sub-section             | url                     |
      | Productos     | Facephi Authentication  | facephi-authentication  |
      | Industrias    | Banca                   | banca                   |
      | Recursos      | Blog                    | blog                    |
      | Compañía      | Sobre Facephi           | sobre-facephi           |
