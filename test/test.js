var chai = require('chai');
var expect = chai.expect;
var fs = require('fs');
var path = require('path');
var sinon = require('sinon');

var SourceFile = require('../lib/SourceFile.js');
var CliConstructor = require('../lib/Cli.js');

describe('Integrator', function() {
    describe('Check source file', function() {
        ['js', 'html', 'css', 'less'].forEach(function(fileType) {
            forEachSourceDo('/fixtures/broken/' + fileType + '/', function(source) {
                it('should check in ' + fileType + ' files and report', function(done) {
                    source.process().then(function() {
                        expect(source.issues.length).to.be.above(0);
                        done();
                    });
                });
            });
        });
        it('Should sort results by line', function(done) {
            var previousLine, source;
            previousLine = 0;
            source = new SourceFile(path.join(__dirname, './fixtures/broken/js/varspelling.js'));
            source.process().then(function() {
                source.sortIssues();
                source.issues.forEach(function(each) {
                    expect(previousLine).to.be.at.most(each.line);
                    previousLine = each.line;
                });
                done();
            });
        });
        ['js', 'html', 'css'].forEach(function(fileType) {
            forEachSourceDo('/fixtures/clean/' + fileType + '/', function(source) {
                it('Should check in clean ' + fileType + ' files and do not report', function(done) {
                    source.process().then(function() {
                        expect(source.issues.length).to.be.equal(0);
                        done();
                    });
                });
            });
        });
    });
});

describe('CLI test Console', function() {
    var consoleSpy, CLI;
    it('should show help', function() {
        consoleSpy = sinon.stub(console, 'log');
        CLI = new CliConstructor(['--help']);
        CLI.dispatch();
        expect(consoleSpy.callCount).to.be.equal(6);
        consoleSpy.restore();
    });
    it('should show version', function() {
        consoleSpy = sinon.stub(console, 'log');
        CLI = new CliConstructor(['--version']);
        CLI.dispatch();
        expect(consoleSpy.calledOnce).to.be.true;
        consoleSpy.restore();
    });
});

function forEachSourceDo(aPath, f) {
    var files = fs.readdirSync(path.join(__dirname, aPath));
    var source;
    files.forEach(function(aFilePath) {
        source = new SourceFile(path.join(__dirname, aPath, aFilePath));
        f(source);
    });
}
