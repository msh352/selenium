import { Then, setDefaultTimeout } from '@cucumber/cucumber';
import { strict as assert } from 'assert';

setDefaultTimeout(30000);

/**
 * Step: Verify that the current URL contains a specific substring.
 * Usage: Then the current URL should contain "contacta"
 */
Then('the current URL should contain {string}', async function (partialUrl) {
    const currentUrl = await this.driver.getCurrentUrl();
    assert.ok(
        currentUrl.includes(partialUrl),
        `❌ The current URL (${currentUrl}) does not contain the expected value: ${partialUrl}`
    );
});

/**
 * Step: Verify that the current URL exactly matches an expected one.
 * Usage: Then the current URL should be "https://facephi.com/contacta/"
 */
Then('the current URL should be {string}', async function (expectedUrl) {
    const currentUrl = await this.driver.getCurrentUrl();
    assert.strictEqual(
        currentUrl,
        expectedUrl,
        `❌ The current URL (${currentUrl}) does not match the expected one: ${expectedUrl}`
    );
});
