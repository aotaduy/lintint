var colors = require('colors'),
    path = require('path'),
    LintChecker = require('./LintChecker.js'),
    JSCSCheckerConstructor = require('jscs'),
    JSCSLoadConfigFile = require('jscs/lib/cli-config'),
    JSCSChecker = new JSCSCheckerConstructor({esnext: false, configPath: '.jscsrc'}),
    Q = require('q');
JSCSChecker.registerDefaultRules();


function JSCSLintChecker(ext) {
    this.extension = ext;
    this.isConfigured = false;
}
JSCSLintChecker.prototype = Object.create(LintChecker.prototype);

JSCSLintChecker.prototype.configureChecker = function() {
    if (!this.isConfigured) {
        JSCSChecker.configure(this.getConfig());
        this.isConfigured = true;
    }
};

JSCSLintChecker.prototype.processFile = function(aFile) {
    var self = this;
    var deferred = Q.defer();
    aFile.readFile(function(error, src) {
        self.configureChecker();
        var errors = JSCSChecker.checkString(src, aFile.path);
        errors.getErrorList().forEach(function(aResult) {
            self.addResult(aFile, aResult);
        });
        deferred.resolve(aFile.issues);
    });
    return deferred.promise;
};

JSCSLintChecker.prototype.getLocalConfig = function(aResolver) {
    return JSCSLoadConfigFile.load(false, path.resolve(path.dirname(aResolver.basePath)));
};

JSCSLintChecker.prototype.getGlobalConfig = function(aResolver) {
    return JSCSLoadConfigFile.load(aResolver.pathInConfigDirectory('.jscsrc'));
};

JSCSLintChecker.prototype.type = 'jscs'.green.bold;

module.exports = JSCSLintChecker;
