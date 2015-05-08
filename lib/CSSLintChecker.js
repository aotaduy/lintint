var
    csslint = require('csslint').CSSLint,
    path = require('path'),
    fs = require('fs'),
    configuration = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config/.csslintrc'))),
    LintChecker = require('./LintChecker.js');

function CSSLintintChecker(ext) {
    this.extension = ext;
}

CSSLintintChecker.prototype = Object.create(LintChecker.prototype);

CSSLintintChecker.prototype.processFile = function(aFile) {
    var self = this;
    var src = fs.readFileSync(aFile.path);
    var errors = csslint.verify(src.toString(), configuration);
    errors.messages.forEach(function(aResult) {
        self.addResult(aFile, aResult);
    });
    return aFile.issues;
};

CSSLintintChecker.prototype.type = 'csslint'.green;

module.exports = CSSLintintChecker;
