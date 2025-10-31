const fs = require('fs');
const path = require('path');
const reporter = require('cucumber-html-reporter');

const reportsDir = path.join(process.cwd(), 'reports');
const jsonReport = path.join(reportsDir, 'report.json');
const htmlReport = path.join(reportsDir, 'cucumber-report.html');

// 1. Asegurarnos de que la carpeta reports existe
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

// 2. Comprobar que Cucumber ha generado report.json
if (!fs.existsSync(jsonReport)) {
    console.error('❌ No report.json found. Did you run cucumber-js first?');
    process.exit(1);
}

// 3. (Opcional) Eliminar el HTML antiguo para no mezclar versiones previas
if (fs.existsSync(htmlReport)) {
    try {
        fs.unlinkSync(htmlReport);
        console.log('🧹 Old HTML report removed');
    } catch (err) {
        console.warn('⚠️ Could not remove previous HTML report:', err.message);
    }
}

// 4. Generar el reporte nuevo
const options = {
    theme: 'bootstrap', // also: 'simple', 'foundation', 'hierarchy'
    jsonFile: jsonReport,
    output: htmlReport,
    reportSuiteAsScenarios: true,
    launchReport: false, // lo dejamos false para no abrir navegador automáticamente
    metadata: {
        "Project": "Facephi Public Site E2E",
        "Tester": "Miguel Antonio",
        "Browser": "Chrome",
        "Framework": "Cucumber + Selenium WebDriver",
        "Platform": process.platform
    }
};

try {
    reporter.generate(options);
    console.log('✅ HTML report generated at reports/cucumber-report.html');
} catch (err) {
    console.error('❌ Failed to generate HTML report:', err.message);
    process.exit(1);
}
