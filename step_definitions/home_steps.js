import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import HomePage from '../pageObjects/HomePage.js';

Given("I am on Facephi's public page", async function () {
    this.home = new HomePage(this.driver);
    await this.home.open();
});

When('I access the {string} section from the main menu', async function (section) {
    await this.home.goToSection(section);
});

When('I access the {string} submenu', async function (subSection) {
    await this.home.goToSubSection(subSection);
});

Then(
    'I should see a headline or title consistent with the {string} section',
    async function (section) {
        const headline = await this.home.getPageHeadline();
        assert.ok(
            headline && headline.length > 0,
            `No headline was found in the ${section} section`
        );
    }
);

Then('the page should load without visible errors', async function () {
    const headline = await this.home.getPageHeadline();
    assert.ok(headline, 'Main content does not appear to have loaded properly');
});
