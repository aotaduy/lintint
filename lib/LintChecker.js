var LintIssue = require('./LintIssue.js'),
    ConfigurationResolver = require('./ConfigurationResolver.js');

function LintChecker() {

}

LintChecker.prototype.addResult = function(aFile, aResult) {
    aFile.issues.push(new LintIssue(
                aFile,
                aResult.column,
                aResult.line,
                this.getMessageFor(aResult),
                this));
};

LintChecker.prototype.getMessageFor = function(aResult) {
    return aResult.message;
};
LintChecker.prototype.configurationResolver = function() {
    return ConfigurationResolver.getInstance();
};
LintChecker.prototype.getConfig = function() {
    return this.configurationResolver().getConfigFor(this);
};

module.exports = LintChecker;
