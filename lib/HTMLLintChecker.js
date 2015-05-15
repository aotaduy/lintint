var htmllint = require('htmllint'),
    cjson = require('cjson'),
    LintChecker = require('./LintChecker.js'),
    Q = require('q');

function HTMLLintChecker(ext) {
    this.extension = ext;
}
HTMLLintChecker.prototype = Object.create(LintChecker.prototype);

HTMLLintChecker.prototype.processFile = function(aFile) {
    var self = this,
        config = self.getConfig(),
        deferred = Q.defer();
    htmllint.use(config.plugins || []);
    aFile.readFile(function(err, source) {
        var promise = htmllint(source, config);
        promise.then(function(issues) {
            issues.forEach(function(aResult) {
                self.addResult(aFile, aResult);
            });
            deferred.resolve(aFile.issues);
        });
    });
    return deferred.promise;
};

HTMLLintChecker.prototype.type = 'html'.cyan;

HTMLLintChecker.prototype.getLocalConfig = function(aResolver) {
    return cjson.load(aResolver.findFile('.htmllintrc'));
};

HTMLLintChecker.prototype.getGlobalConfig = function(aResolver) {
    return cjson.load(aResolver.pathInConfigDirectory('.htmllintrc'));
};

HTMLLintChecker.prototype.getMessageFor = function(aResult) {
    return htmllint.messages.renderIssue(aResult);
};

module.exports = HTMLLintChecker;
