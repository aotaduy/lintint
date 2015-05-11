var fs = require('fs'),
    Lazy = require('lazy'),
    LintIntegrator = require('./LintIntegrator.js'),
    path = require('path'),
    Q = require('q');

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
    var self = this,
        promises;
    promises = LintIntegrator.rules
    .filter(function(aRule) {
        return self.extension() === aRule.extension;
    })
    .map(function(aRule) {
        return aRule.processFile(self);
    });
    return Q.all(promises).then(function(issues) {
        return self;
    });
};

SourceFile.prototype.reportIssues = function() {
    if (this.issues.length > 0) {
        console.log('\n', this.path, '#' , this.issues.length);
    }
    this.sortIssues();
    this.issues.forEach(function(anIssue) {
        anIssue.reportToConsole();
    });
};

SourceFile.prototype.sortIssues = function() {
    this.issues.sort(sortIssue);
};

function sortIssue(a, b) {
    if (a.file === b.file) {
        return a.line - b.line;
    }else {
        return a.file < b.file;
    }
}

module.exports = SourceFile;
