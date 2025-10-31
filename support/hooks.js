import { Before, After, Status } from '@cucumber/cucumber';
import { createDriver, quitDriver } from './driver.js';
import fs from 'fs';
import path from 'path';

Before(async function () {
    this.driver = await createDriver();
});

After(async function (scenario) {
    const failed = scenario.result?.status === Status.FAILED;

    if (failed && this.driver && this.driver.takeScreenshot) {
        try {
            const screenshotBase64 = await this.driver.takeScreenshot();

            // Attach screenshot to Cucumber (for rich reporters if needed)
            if (this.attach) {
                this.attach(screenshotBase64, 'image/png');
            }

            // Persist screenshot to disk for failed scenarios
            const screenshotsDir = path.join(process.cwd(), 'reports', 'screenshots');
            if (!fs.existsSync(screenshotsDir)) {
                fs.mkdirSync(screenshotsDir, { recursive: true });
            }

            // Safe file name based on scenario name
            const safeName = scenario.pickle.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const filePath = path.join(screenshotsDir, `${safeName}.png`);

            fs.writeFileSync(filePath, screenshotBase64, 'base64');
            console.log(`📸 Saved screenshot for failed scenario at: ${filePath}`);
        } catch (err) {
            console.warn('⚠️ Could not capture screenshot:', err.message);
        }
    }

    await quitDriver();
});
