var LintIssue = require('./LintIssue.js');

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

LintChecker.prototype.setConfig = function(aConfig) {
    this.configResolver = aConfig;
};
module.exports = LintChecker;
