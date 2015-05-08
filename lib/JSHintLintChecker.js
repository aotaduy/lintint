var jshintcli = require('jshint/src/cli'),
    path = require('path'),
    LintChecker = require('./LintChecker.js');

function JSHintLintChecker(ext) {
    this.extension = ext;
}

JSHintLintChecker.prototype = Object.create(LintChecker.prototype);

JSHintLintChecker.prototype.processFile = function(aFile) {
    var self = this,
        cliOptions = {};
    cliOptions.args = [aFile.path];
    cliOptions.config = jshintcli.loadConfig(path.resolve(__dirname, '../config/.jshintrc'));
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

JSHintLintChecker.prototype.getMessageFor = function(aResult) {
    return aResult.reason;
};

module.exports = JSHintLintChecker;
