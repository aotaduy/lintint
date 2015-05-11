/* Command Line Interface CLI for lintint*/
var findit = require('findit'),
    fs = require('fs'),
    minimist = require('minimist'),
    Q = require('q'),
    SourceFile = require('./SourceFile.js');

function CLI(commandLine) {
    this.argv = minimist(commandLine);
    this.started = process.hrtime();
}

CLI.prototype = Object.create(Object.prototype);

CLI.prototype.dispatch = function() {
    var self = this;
    if (self.argv.help) {
        return self.showHelp();
    }
    if (self.argv.version) {
        return self.showVersion();
    }
    if (self.argv._.length === 0) {
        self.startFinderOn('.');
    } else {
        self.argv._.forEach(function(eachPath) {
            if (fs.existsSync(eachPath)) {
                self.startFinderOn(eachPath);
            } else {
                console.log('No file or directory at', eachPath);
            }
        });

    }
};

CLI.prototype.showHelp = function() {
    console.log('lint-integrator [options] <directories> <files>');
    console.log('If called without parameters check recursively the working directory (.)');
    console.log('Available options:');
    console.log('--help\t: Print this help');
    console.log('--version\t: Print version information');
    console.log('\tBy Andres Otaduy');
    return 0;
};

CLI.prototype.showVersion = function() {
    console.log('lint-integrator version 0.0.3');
    return 0;
};

CLI.prototype.startFinderOn = function(aPath) {
    var finder = findit(aPath),
        self = this,
        filePromises = [];
    finder.on('file', function(file) {
        filePromises.push(new SourceFile(file).process());
    });

    finder.on('end', function() {
        Q.all(filePromises).then(function(files) {
            var totalIssues = 0;
            var diff, ms;
            files
            .forEach(function(aFile) {
                aFile.reportIssues();
                totalIssues =  totalIssues + aFile.issues.length;
            });
            diff = process.hrtime(self.started);
            ms = ((diff[0] * 1e9 + diff[1]) / 1000000).toFixed(0);
            console.log('[', totalIssues, 'issues in', files.length, 'files in', ms, 'ms ]');
        }).done();
    });
};

module.exports = CLI;
