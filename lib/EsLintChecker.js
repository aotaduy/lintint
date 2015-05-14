var ESCLIEngine = require('eslint').CLIEngine,
    colors = require('colors'),
    eslintGlobals = require('../config/eslint/globals.js'),
    LintChecker = require('./LintChecker.js');

function EsLintChecker(ext) {
    this.extension = ext;
}
EsLintChecker.prototype = Object.create(LintChecker.prototype);
EsLintChecker.prototype.processFile = function(aFile) {
    var self = this,
        eslint = new ESCLIEngine({
            useEslintrc: true,
            configFile: this.getConfig(),
            globals: eslintGlobals});
    eslint
        .executeOnFiles([aFile.path])
        .results[0].messages.forEach(function(aResult) {
            self.addResult(aFile, aResult);
        });
    return aFile.issues;
};

EsLintChecker.prototype.getLocalConfig = function(aResolver) {
    return aResolver.findFile('.eslintrc', this.getGlobalConfig());
};

EsLintChecker.prototype.getGlobalConfig = function(aResolver) {
    return aResolver.pathInConfigDirectory('eslint/eslint.json');
};

EsLintChecker.prototype.type = 'eslint'.cyan.bold;

module.exports = EsLintChecker;
