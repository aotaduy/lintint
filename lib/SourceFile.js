var fs = require('fs'),
    Lazy = require('lazy'),
    path = require('path'),
    config = require('./ConfigurationResolver.js'),
    Q = require('q');

function SourceFile(aFilePath) {
    this.path = aFilePath;
    this.issues = [];
    this.contents = null;
    this.error = null;
}

SourceFile.prototype.stream = function() {
    return new Lazy(fs.createReadStream(this.path));
};

SourceFile.prototype.extension = function() {
    return path.extname(this.path);
};
SourceFile.prototype.rules = function() {
    return config.getInstance().rules;
};

SourceFile.prototype.process = function() {
    var self = this,
        promises;
    promises = self.rules()
    .filter(function(aRule) {
        return self.extension() === aRule.extension;
    })
    .map(function(aRule) {
        return aRule.processFile(self);
    });
    return Q.all(promises).then(function() { //Ignore promised issues and resolve with SourceFile
        self.cleanContents();
        return self;
    });
};
SourceFile.prototype.cleanContents = function() {
    this.contents = null;
};

SourceFile.prototype.readFile = function(callback) {
    var self = this,
        deferred = Q.defer();
    if (self.contents === null) {
        fs.readFile(self.path, function(err, source) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(source.toString());
            }
        });
        self.contents = deferred.promise;
    }
    return self.contents.then(function(source) {
            callback(null, source);
            return source; //Get the source to the next promise
        });
};

SourceFile.prototype.reportIssues = function() {
    if (this.issues.length > 0) {
        console.info('\n', this.path, '#', this.issues.length);
    }
    this.sortIssues();
    this.issues.forEach(function(anIssue) {
        anIssue.reportToConsole();
    });
};

SourceFile.prototype.sortIssues = function() {
    this.issues.sort(sortIssue);
};

function sortIssue(a, b) {
    if (a.file === b.file) {
        return a.line - b.line;
    }else {
        return a.file < b.file;
    }
}

module.exports = SourceFile;
