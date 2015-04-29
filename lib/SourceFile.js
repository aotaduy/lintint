var Lazy = require('lazy');
var path = require('path');
var fs = require('fs');
var LintIntegrator = require('./LintIntegrator.js');

function SourceFile(aFilePath) {
    this.path = aFilePath;
    this.issues = [];
}

SourceFile.prototype.stream = function() {
    return new Lazy(fs.createReadStream(this.path));
};

SourceFile.prototype.extension = function() {
    return path.extname(this.path);
};
SourceFile.prototype.process = function() {
    var self = this;
    LintIntegrator.rules
    .filter(function(aRule) {
        return self.extension() === aRule.extension;
    })
    .forEach(function(aRule) {
        aRule.processFile(self);
    });
};
SourceFile.prototype.reportIssues = function() {
    if (this.issues.length > 0) {
        console.log('\n', this.path);
    }
    this.sortIssues();
    this.issues.forEach(function(anIssue) {
        anIssue.reportToConsole();
    });
};

SourceFile.prototype.sortIssues = function() {
    this.issues.sort(function(a, b) {
        if (a.file === b.file) {
            return a.line - b.line;
        }else {
            return a.file < b.file;
        }
    });
};

module.exports = SourceFile;
