var
    csslint = require('csslint').CSSLint,
    colors = require('colors'),
    path = require('path'),
    fs = require('fs'),
    LintChecker = require('./LintChecker.js');

function CSSLintChecker(ext) {
    this.extension = ext;
}

CSSLintChecker.prototype = Object.create(LintChecker.prototype);

CSSLintChecker.prototype.processFile = function(aFile) {
    var self = this;
    var src = fs.readFileSync(aFile.path);
    var errors = csslint.verify(src.toString(), configuration);
    errors.messages.forEach(function(aResult) {
        self.addResult(aFile, aResult);
    });
    return aFile.issues;
};

CSSLintChecker.prototype.type = 'csslint'.green;

module.exports = CSSLintChecker;
