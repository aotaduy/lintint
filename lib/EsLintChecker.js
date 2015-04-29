    var ESCLIEngine = require('eslint').CLIEngine,
        LintChecker = require('./LintChecker.js'),
        eslintGlobals = require('../config/eslint/globals.js'),
        path = require('path');

function EsLintChecker(ext) {
    this.extension = ext;
}
EsLintChecker.prototype = Object.create(LintChecker.prototype);
EsLintChecker.prototype.processFile = function(aFile) {
    var self = this,
        eslint = new ESCLIEngine({
            useEslintrc: true,
            configFile: path.resolve(__dirname, '../config/eslint/eslint.json'),
            globals: eslintGlobals});
    eslint
        .executeOnFiles([aFile.path])
        .results[0].messages.forEach(function(aResult) {
            self.addResult(aFile, aResult);
        });
};

EsLintChecker.prototype.type = 'eslint'.cyan.bold;
module.exports = EsLintChecker;
