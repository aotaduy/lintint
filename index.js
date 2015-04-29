#!/usr/bin/env node

var colors = require('colors');
var argv = require('minimist')(process.argv.slice(2));
var findit = require('findit');
var SourceFile = require('./lib/SourceFile.js');
var fs = require('fs');

if (argv.help) {
    console.log('lint-integrator [options] <directories> <files>');
    console.log('If called without parameters check recursively the cwd');
    console.log('Available options:');
    console.log('--help\t: Print this help');
    console.log('--version\t: Print version information');
    console.log('--version\t: By Andres Otaduy');
    return 0;
}
if (argv.version) {
    console.log('lint-integrator version 0.0.2');
    return 0;
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
    var files = [];
    finder.on('file', function(file, stat) {
        var aFile = new SourceFile(file);
        aFile.process();
        files.push(aFile);
    });

    finder.on('end', function() {
        files
        .forEach(function(aFile) {
            aFile.reportIssues();
        });
    });
}
