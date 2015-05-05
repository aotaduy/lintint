var
    csslint = require('./csslint.js'),
    fs = require('fs'),
    LintChecker = require('./LintChecker.js');

function CSSLintChecker(ext) {
    this.extension = ext;
}

CSSLintChecker.prototype = Object.create(LintChecker.prototype);

CSSLintChecker.prototype.processFile = function(aFile) {
    var self = this;
    var src = fs.readFileSync(aFile.path);
    var errors = csslint(src.toString());
    errors.messages.forEach(function(aResult) {
        self.addResult(aFile, aResult);
    });
};

CSSLintChecker.prototype.type = 'csslint'.green;

module.exports = CSSLintChecker;
