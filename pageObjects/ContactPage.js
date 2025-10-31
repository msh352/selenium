import { By, until } from 'selenium-webdriver';
import { config } from '../support/config.js';

export default class ContactPage {
    constructor(driver) {
        this.driver = driver;

        // Contact form submit button
        this.submitButton = By.css('input#gform_submit_button_2');

        // Generic error message (may vary, so we try several common selectors)
        this.errorMessage = By.css(
            ".gform_validation_errors, .validation_error, .gfield_error, .error, [aria-invalid='true']"
        );
    }

    async submitEmptyForm() {
        const btn = await this.driver.wait(
            until.elementLocated(this.submitButton),
            config.defaultTimeout
        );
        await btn.click();
    }

    async getErrorText() {
        const err = await this.driver.wait(
            until.elementLocated(this.errorMessage),
            config.defaultTimeout
        );
        return err.getText();
    }
}
