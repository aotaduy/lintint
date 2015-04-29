var LintChecker = require('./LintChecker.js');
var LintIssue = require('./LintIssue.js');

function RegExpLintChecker(ext, regexp, message) {
    this.extension = ext;
    this.regexp = regexp;
    this.message = message;
}
RegExpLintChecker.prototype = Object.create(LintChecker.prototype);

RegExpLintChecker.prototype.processFile = function(aFile) {
    var count = 0,
        self = this;
    aFile
    .stream()
    .lines
    .forEach(function(line) {
        count++;
        var match = self.regexp.exec(line);
        if (match !== null) {
            match.line = count;
            aFile.issues.push(new LintIssue(aFile, match.index, count, self.message, self));
        }
    });
};
RegExpLintChecker.prototype.type = 'regexp'.bold;

module.exports = RegExpLintChecker;
