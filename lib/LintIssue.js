function LintIssue(file, index, line, message, checker) {
    this.file = file;
    this.index = index;
    this.line = line;
    this.message = message;
    this.checker = checker;
}

LintIssue.prototype.reportToConsole = function() {
    console.log('[', this.checker.type, ']\t', this.line.toString().yellow.bold, '\t', this.message.bold);
};

module.exports = LintIssue;