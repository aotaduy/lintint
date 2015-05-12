#!/usr/bin/env node

var CLIConstructor = require('./lib/Cli.js'),
    CLI;

CLI = new CLIConstructor(process.argv.slice(2));
CLI.runPromise().then(function(returnCode) {
    process.exit(returnCode);
});
