const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const reporter = require('cucumber-html-reporter');

const reportsDir = path.join(process.cwd(), 'reports');
const screenshotsDir = path.join(reportsDir, 'screenshots');
const jsonReport = path.join(reportsDir, 'report.json');
const htmlReport = path.join(reportsDir, 'cucumber-report.html');

// Step 1. Clean previous artifacts before running tests
function cleanReports() {
    console.log('🧹 Cleaning previous reports...');

    // Delete report.json and cucumber-report.html if they exist
    [jsonReport, htmlReport].forEach((file) => {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
            console.log(`   ✗ Removed ${file}`);
        }
    });

    // Delete screenshots directory if it exists
    if (fs.existsSync(screenshotsDir)) {
        fs.rmSync(screenshotsDir, { recursive: true, force: true });
        console.log(`   ✗ Removed ${screenshotsDir}`);
    }

    // Recreate empty screenshots directory
    fs.mkdirSync(screenshotsDir, { recursive: true });
    console.log(`   ✓ Created empty ${screenshotsDir}`);
}

// Step 2. Run cucumber-js and capture exit code
function runCucumber() {
    console.log('▶ Running cucumber-js...');
    return new Promise((resolve) => {
        const cucumber = spawn('npx', ['cucumber-js'], { stdio: 'inherit' });

        cucumber.on('close', (code) => {
            console.log(`ℹ cucumber-js finished with exit code ${code}`);
            resolve(code); // 0 = all passed, >0 = some failed
        });
    });
}

// Step 3. Generate HTML report from report.json
function generateHtmlReport() {
    console.log('📄 Generating HTML report...');

    if (!fs.existsSync(jsonReport)) {
        console.error('❌ report.json was not generated. Cannot build HTML report.');
        process.exit(1);
    }

    const options = {
        theme: 'bootstrap', // 'simple', 'foundation', 'hierarchy' also available
        jsonFile: jsonReport,
        output: htmlReport,
        reportSuiteAsScenarios: true,
        launchReport: false,
        metadata: {
            Project: 'Facephi Public Site E2E',
            Tester: 'Miguel Antonio',
            Browser: 'Chrome',
            Framework: 'Cucumber + Selenium WebDriver',
            Platform: process.platform,
        },
    };

    reporter.generate(options);
    console.log('✅ HTML report generated at reports/cucumber-report.html');
}

// Step 4. Final post-processing after tests
async function main() {
    cleanReports();

    const exitCode = await runCucumber();

    generateHtmlReport();

    if (exitCode === 0) {
        // All tests passed
        console.log('✅ All tests passed');
        // screenshotsDir already exists and is empty because we wiped it before run
    } else {
        // Some tests failed
        console.log('⚠ Some tests failed');
        // screenshotsDir already contains screenshots from failing scenarios (written by hooks.js)
    }

    // Exit with same code cucumber returned, so CI can still fail if tests failed
    process.exit(exitCode);
}

main().catch((err) => {
    console.error('💥 Fatal runner error:', err);
    process.exit(1);
});
