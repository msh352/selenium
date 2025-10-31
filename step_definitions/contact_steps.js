import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import HomePage from '../pageObjects/HomePage.js';
import ContactPage from '../pageObjects/ContactPage.js';

Given('I navigate to the Contact page', async function () {
    await this.home.goToContact();
    this.contact = new ContactPage(this.driver);
});

When('I try to submit the form without entering any data', async function () {
    await this.contact.submitEmptyForm();
});

Then('I should see an error message indicating that required fields are missing', async function () {
    const errorText = await this.contact.getErrorText();
    assert.ok(
        errorText && errorText.length > 0,
        'No validation error message appeared after submitting the empty form'
    );
});
