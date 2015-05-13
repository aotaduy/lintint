var colors = require('colors'),
    fs = require('fs'),
    path = require('path'),
    ConfigurationResolver = require('./ConfigurationResolver.js'),
    LintChecker = require('./LintChecker.js'),
    JSCSCheckerConstructor = require('jscs'),
    JSCSloadConfigFile = require('jscs/lib/cli-config'),
    JSCSChecker = new JSCSCheckerConstructor({esnext: false, configPath: '.jscsrc'}),
    Q = require('q');

function JSCSLintChecker(ext) {
    this.extension = ext;
    this.isConfigured = false;
}
JSCSLintChecker.prototype = Object.create(LintChecker.prototype);

JSCSLintChecker.prototype.configureChecker = function(aFile) {
    if (!this.isConfigured) {
        JSCSChecker.registerDefaultRules();
        JSCSChecker.configure(this.getConfig());
        this.isConfigured = true;
    }
};

JSCSLintChecker.prototype.processFile = function(aFile) {
    var self = this;
    var deferred = Q.defer();
    fs.readFile(aFile.path, function(error, src) {
        self.configureChecker();
        var errors = JSCSChecker.checkString(src.toString(), aFile.path);
        errors.getErrorList().forEach(function(aResult) {
            self.addResult(aFile, aResult);
        });
        deferred.resolve(aFile.issues);
    });
    return deferred.promise;
};

JSCSLintChecker.prototype.getLocalConfig = function(aResolver) {
    return JSCSloadConfigFile.load(false, path.resolve(path.dirname(aResolver.basePath)));
};

JSCSLintChecker.prototype.getGlobalConfig = function(aResolver) {
    return JSCSloadConfigFile.load(aResolver.pathInConfigDirectory('.jscsrc'));
};

JSCSLintChecker.prototype.type = 'jscs'.green.bold;

module.exports = JSCSLintChecker;
