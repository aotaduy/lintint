var fs = require('fs');
var path = require('path');
var colors = require('colors');
var LintChecker = require('./LintChecker.js');

var JSCSCheckerConstructor = require('jscs');
var JSCSChecker = new JSCSCheckerConstructor({esnext: false, configPath: '.jscsrc'});
var JSCSloadConfigFile = require('jscs/lib/cli-config');
JSCSChecker.registerDefaultRules();
JSCSChecker.configure(JSCSloadConfigFile.load(path.resolve(__dirname, '../config/.jscsrc')));

function JSCSLintChecker(ext) {
    this.extension = ext;
}
JSCSLintChecker.prototype = Object.create(LintChecker.prototype);

JSCSLintChecker.prototype.processFile = function(aFile) {
    var self = this;
    var src = fs.readFileSync(aFile.path);
    var errors = JSCSChecker.checkString(src.toString(), aFile.path);
    errors.getErrorList().forEach(function(aResult) {
        self.addResult(aFile, aResult);
    });
};
JSCSLintChecker.prototype.type = 'jscs'.green.bold;
module.exports = JSCSLintChecker;
