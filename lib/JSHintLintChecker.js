var jshintcli = require('jshint/src/cli'),
    LintChecker = require('./LintChecker.js');

function JSHintLintChecker(ext) {
    this.extension = ext;
}

JSHintLintChecker.prototype = Object.create(LintChecker.prototype);

JSHintLintChecker.prototype.processFile = function(aFile) {
    var self = this,
        cliOptions = {};
    cliOptions.args = [aFile.path];
    cliOptions.config = self.getConfig();
    cliOptions.maxerr = Infinity;
    cliOptions.reporter = function(results) {
        results.forEach(function(aResult) {
            self.addResult(aFile, aResult.error);
        });
    };
    jshintcli.run(cliOptions);
    return aFile.issues;
};

JSHintLintChecker.prototype.type = 'jshint'.yellow.bold;

JSHintLintChecker.prototype.getLocalConfig = function(aResolver) {
    return jshintcli.loadConfig(aResolver.findFile('.jshintrc'));
};

JSHintLintChecker.prototype.getGlobalConfig = function(aResolver) {
    return jshintcli.loadConfig(aResolver.pathInConfigDirectory('.jshintrc'));
};

JSHintLintChecker.prototype.getMessageFor = function(aResult) {
    return aResult.reason;
};

module.exports = JSHintLintChecker;
