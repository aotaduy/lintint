var
    csslint = require('csslint').CSSLint,
    colors = require('colors'),
    path = require('path'),
    fs = require('fs'),
    LintChecker = require('./LintChecker.js'),
    Q = require('q');

function CSSLintChecker(ext) {
    this.extension = ext;
    LintChecker.call(this);
}

CSSLintChecker.prototype = Object.create(LintChecker.prototype);

CSSLintChecker.prototype.processFile = function(aFile) {
    var self = this,
        deferred = Q.defer();
    fs.readFile(aFile.path, function(err, source) {
        var errors = csslint.verify(source.toString(), self.configResolver.cssLint());
        errors.messages.forEach(function(aResult) {
            self.addResult(aFile, aResult);
        });
        deferred.resolve(aFile.issues);
    });
    return deferred.promise;
};

CSSLintChecker.prototype.type = 'csslint'.green;

module.exports = CSSLintChecker;
