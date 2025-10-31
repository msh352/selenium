module.exports = {
    default: {
        paths: ["./features/**/*.feature"],
        require: [
            "./step_definitions/**/*.js",
            "./support/hooks.js"
        ],
        format: [
            "progress",
            "json:reports/report.json"
        ],
        publishQuiet: true,
        timeout: 20000
    }
};
