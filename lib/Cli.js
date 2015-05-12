/* Command Line Interface CLI for lintint*/
var ConfigurationResolver = require('./ConfigurationResolver.js'),
    findit = require('findit'),
    fs = require('fs'),
    minimist = require('minimist'),
    Q = require('q'),
    SourceFile = require('./SourceFile.js');

function CLI(commandLine) {
    this.argv = minimist(commandLine);
    this.started = process.hrtime();
}

CLI.prototype = Object.create(Object.prototype);

CLI.prototype.runPromise = function() {
    return Q.when(this.dispatch());
};

CLI.prototype.dispatch = function() {
    var promises = [],
        self = this;
    if (self.argv.help) {
        return self.showHelp();
    }
    if (self.argv.version) {
        return self.showVersion();
    }
    if (self.argv.config) {
        self.setConfigurationResolver(self.argv.config, self.argv._);
    }else {
        self.setConfigurationResolver('global', []);
    }
    if (self.argv._.length === 0) {
        return self.startFinderOn('.');
    } else {
        self.argv._.forEach(function(eachPath) {
            if (fs.existsSync(eachPath)) {
                promises.push(self.startFinderOn(eachPath));
            } else {
                console.info('No file or directory at', eachPath);
            }
        });
    }
    return Q.all(promises).then(function() {
        return 0;
    });
};

CLI.prototype.showHelp = function() {
    console.info('lint-integrator [options] <directories> <files>');
    console.info('If called without parameters check recursively the working directory (.)');
    console.info('Available options:');
    console.info('--help\t: Print this help');
    console.info('--version\t: Print version information');
    console.info('\tBy Andres Otaduy');
    return 0;
};

CLI.prototype.showVersion = function() {
    console.info('lintint version ' + require('../package.json').version);
    return 0;
};

CLI.prototype.setConfigurationResolver = function(aString, dirs) {
    var localDir = dirs.length === 0 ? '.' : dirs[0];
    if (aString === 'local') {
        this.configurationResolver = ConfigurationResolver.initializeLocal(localDir);
    }else {
        this.configurationResolver = ConfigurationResolver.initializeGlobal();
    }
    return this.configurationResolver;
};

CLI.prototype.startFinderOn = function(aPath) {
    var deferred = Q.defer(),
        finder = findit(aPath),
        self = this,
        filePromises = [];
    finder.on('file', function(file) {
        filePromises.push(new SourceFile(file, self.configurationResolver).process());
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
            console.info('[', totalIssues, 'issues in', files.length, 'files in', ms, 'ms ]');
        }).done(function() {
            deferred.resolve(0);
        });
    });
    return deferred.promise;
};

module.exports = CLI;
