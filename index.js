#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2)),
    findit = require('findit'),
    SourceFile = require('./lib/SourceFile.js'),
    fs = require('fs'),
    Q = require('q'),
    start = process.hrtime();

if (argv.help) {
    console.log('lint-integrator [options] <directories> <files>');
    console.log('If called without parameters check recursively the cwd');
    console.log('Available options:');
    console.log('--help\t: Print this help');
    console.log('--version\t: Print version information');
    console.log('--version\t: By Andres Otaduy');
    process.exit();
}
if (argv.version) {
    console.log('lint-integrator version 0.0.3');
    process.exit();
}

if (argv._.length === 0) {
    startFinderOn('.');
} else {
    argv._.forEach(function(eachPath) {
        if (fs.existsSync(eachPath)) {
            startFinderOn(eachPath);
        } else {
            console.log('No file or directory at', eachPath);
        }
    });

}

function startFinderOn(aPath) {
    var finder = findit(aPath);
    var filePromises = [];
    finder.on('file', function(file) {
        var aFile = new SourceFile(file);
        filePromises.push(aFile.process());
    });

    finder.on('end', function() {
        Q.all(filePromises).then(function(files) {
            var totalIssues = 0;
            var diff, msecs;
            files
            .forEach(function(aFile) {
                aFile.reportIssues();
                totalIssues =  totalIssues + aFile.issues.length;
            });
            diff = process.hrtime(start);
            msecs = ((diff[0] * 1e9 + diff[1]) / 1000000).toFixed(0);
            console.log('[', totalIssues, 'issues in', files.length, 'files in', msecs, 'ms ]');
        }).done();
    });
}
