var
    csslint = require('csslint').CSSLint,
    colors = require('colors'),
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
    aFile.readFile(function(err, source) {
        var errors = csslint.verify(source, self.getConfig());
        errors.messages.forEach(function(aResult) {
            self.addResult(aFile, aResult);
        });
        deferred.resolve(aFile.issues);
    });
    return deferred.promise;
};

CSSLintChecker.prototype.getLocalConfig = function(aResolver) {
    return JSON.parse(fs.readFileSync(aResolver.findFile('.csslintrc')));
};

CSSLintChecker.prototype.getGlobalConfig = function(aResolver) {
    return JSON.parse(fs.readFileSync(aResolver.pathInConfigDirectory('.csslintrc')));
};

CSSLintChecker.prototype.type = 'csslint'.green;

module.exports = CSSLintChecker;
