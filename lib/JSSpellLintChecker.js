var fs = require('fs'),
    LintChecker = require('./LintChecker.js'),
    spellCheckerLib = require('lintspelljs'),
    spellChecker = new spellCheckerLib.JsSpellChecker(),
    Q = require('q');

function JSSpellintChecker(ext) {
    this.extension = ext;
}

JSSpellintChecker.prototype = Object.create(LintChecker.prototype);

JSSpellintChecker.prototype.processFile = function(aFile) {
    var self = this,
        deferred = Q.defer();
    aFile.readFile(function(err, src) {
        var errors = spellChecker.checkString(src);
        errors.forEach(function(aResult) {
            self.addResult(aFile, aResult);
        });
        deferred.resolve(aFile.issues);
    });
    return deferred.promise;
};

JSSpellintChecker.prototype.type = 'spell'.magenta.bold;

module.exports = JSSpellintChecker;
