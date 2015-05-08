var ESCLIEngine = require('eslint').CLIEngine,
    colors = require('colors'),
    eslintGlobals = require('../config/eslint/globals.js'),
    LintChecker = require('./LintChecker.js'),
    path = require('path'),
    Q = require('q');


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
    return aFile.issues;
};

EsLintChecker.prototype.type = 'eslint'.cyan.bold;

module.exports = EsLintChecker;
