var fs = require('fs');
var path = require('path');
var LintChecker = require('./LintChecker.js');

var spellCheckerLib = require('lintspelljs');
var spellChecker = new spellCheckerLib.JsSpellChecker();

function JSSpellintChecker(ext) {
    this.extension = ext;
}
JSSpellintChecker.prototype = Object.create(LintChecker.prototype);

JSSpellintChecker.prototype.processFile = function(aFile) {
    var self = this;
    console.log(aFile.path);
    var src = fs.readFileSync(aFile.path);
    var errors = spellChecker.checkString(src);
    errors.forEach(function(aResult) {
        self.addResult(aFile, aResult);
    });
};
JSSpellintChecker.prototype.type = 'spell'.magenta.bold;
module.exports = JSSpellintChecker;
