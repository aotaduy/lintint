var
    csslint = require('./CsslintWrapper.js'),
    less = require('less'),
    fs = require('fs'),
    LintChecker = require('./LintChecker.js'),
    Q = require('q');


function LessCSSLintChecker(ext) {
    this.extension = ext;
}

LessCSSLintChecker.prototype = Object.create(LintChecker.prototype);

LessCSSLintChecker.prototype.processFile = function(aFile) {
    var self = this,
        deferred = Q.defer();
    fs.readFile(aFile.path, function(error, source) {
        less.render(source.toString()).then(function(lessResult) {
            var errors = csslint(lessResult.css);
            errors.messages.forEach(function(aResult) {
                self.addResult(aFile, aResult);
            });
            deferred.resolve(aFile.issues);
        }, function(error) {
            self.addResult(aFile, error);
            deferred.resolve(aFile.issues);
        });
    });
    return deferred.promise;
};

LessCSSLintChecker.prototype.type = 'less+csslint'.green;

module.exports = LessCSSLintChecker;
