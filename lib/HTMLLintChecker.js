var htmllint = require('htmllint'),
    path = require('path'),
    cjson = require('cjson'),
    fs = require('fs'),
    config = cjson.load(path.resolve(__dirname, '../config/htmllint/.htmllintrc')),
    LintChecker = require('./LintChecker.js'),
    Q = require('q');

function HTMLLintChecker(ext) {
    this.extension = ext;
}
HTMLLintChecker.prototype = Object.create(LintChecker.prototype);

HTMLLintChecker.prototype.processFile = function(aFile) {
    var self = this,
        deferred = Q.defer();
    htmllint.use(config.plugins || []);
    fs.readFile(aFile.path, function(err, source) {
        var promise = htmllint(source.toString(), config);
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

HTMLLintChecker.prototype.getMessageFor = function(aResult) {
    return htmllint.messages.renderIssue(aResult);
};

module.exports = HTMLLintChecker;
