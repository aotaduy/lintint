var
    csslint = require('./csslint.js'),
    less = require('less'),
    fs = require('fs'),
    LintChecker = require('./LintChecker.js');

function LessCSSLintChecker(ext) {
    this.extension = ext;
}

LessCSSLintChecker.prototype = Object.create(LintChecker.prototype);

LessCSSLintChecker.prototype.processFile = function(aFile) {
    var self = this;
    var src = fs.readFileSync(aFile.path);
    less.render(src.toString()).then(function(lessResult) {
        var errors = csslint(lessResult.css);
        errors.messages.forEach(function(aResult) {
            self.addResult(aFile, aResult);
        });
    }, function(error) {
        self.addResult(aFile, error);
    }).then(function() {aFile.reportIssues();});
};

LessCSSLintChecker.prototype.type = 'less+csslint'.green;

module.exports = LessCSSLintChecker;
