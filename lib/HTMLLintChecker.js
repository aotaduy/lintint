var htmllint = require('htmllint');
var path = require('path');
var cjson = require('cjson');
var fs = require('fs');
var cfg = cjson.load(path.resolve(__dirname, '../config/htmllint/.htmllintrc'));
var LintChecker = require('./LintChecker.js');
var Q = require('q');

function HTMLLintChecker(ext) {
    this.extension = ext;
}
HTMLLintChecker.prototype = Object.create(LintChecker.prototype);

HTMLLintChecker.prototype.processFile = function(aFile) {
    var self = this,
        defer = Q.defer();
    htmllint.use(cfg.plugins || []);
    fs.readFile(aFile.path, function(err, src) {
        var promise = htmllint(src, cfg);
        promise.then(function(issues) {
            issues.forEach(function(aResult) {
                self.addResult(aFile, aResult);
            });
            defer.resolve();
        });
    });
    return defer.promise;
};
HTMLLintChecker.prototype.type = 'html'.cyan;
HTMLLintChecker.prototype.getMessageFor = function(aResult) {
    return htmllint.messages.renderIssue(aResult);
};

module.exports = HTMLLintChecker;
