var colors = require('colors'),
    fs = require('fs'),
    path = require('path'),
    LintChecker = require('./LintChecker.js'),
    JSCSCheckerConstructor = require('jscs'),
    JSCSChecker = new JSCSCheckerConstructor({esnext: false, configPath: '.jscsrc'}),
    JSCSloadConfigFile = require('jscs/lib/cli-config'),
    Q = require('q');

JSCSChecker.registerDefaultRules();
JSCSChecker.configure(JSCSloadConfigFile.load(path.resolve(__dirname, '../config/.jscsrc')));

function JSCSLintChecker(ext) {
    this.extension = ext;
}
JSCSLintChecker.prototype = Object.create(LintChecker.prototype);

JSCSLintChecker.prototype.processFile = function(aFile) {
    var self = this;
    var deferred = Q.defer();
    fs.readFile(aFile.path, function(error, src) {
        var errors = JSCSChecker.checkString(src.toString(), aFile.path);
        errors.getErrorList().forEach(function(aResult) {
            self.addResult(aFile, aResult);
        });
        deferred.resolve(aFile.issues);
    });
    return deferred.promise;
};

JSCSLintChecker.prototype.type = 'jscs'.green.bold;

module.exports = JSCSLintChecker;
