var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var fs = require('fs');
var path = require('path');
var sinon = require('sinon');
var config = require('../lib/ConfigurationResolver.js');
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
            source = new SourceFile(
                path.join(__dirname, './fixtures/broken/js/varspelling.js')
            );

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
    beforeEach(function() {
        consoleSpy = sinon.stub(console, 'info');
    });
    afterEach(function() {
        consoleSpy.restore();
    });
    it('should show help', function(done) {
        CLI = new CliConstructor(['--help']);
        CLI.runPromise().then(function(exitCode) {
            expect(exitCode).to.be.equal(0);
            expect(consoleSpy.callCount).to.be.equal(6);
            done();
        });
    });
    it('should show version', function(done) {
        CLI = new CliConstructor(['--version']);
        CLI.runPromise().then(function(exitCode) {
            expect(exitCode).to.be.equal(0);
            expect(consoleSpy.callCount).to.be.equal(1);
            done();
        });
    });
    it('should run on broken', function(done) {
        var promise;
        CLI = new CliConstructor([path.join(__dirname, './fixtures/broken')]);
        promise = CLI.runPromise();
        expect(promise).to.eventually.equal(0).and.notify(done);
    });
    it('should run on different files', function(done) {
        var promise;
        CLI = new CliConstructor([
            path.join(__dirname, './fixtures/clean/js'),
            path.join(__dirname, './fixtures/broken/css')]);
        promise = CLI.runPromise();
        expect(promise).to.eventually.equal(0).and.notify(done);
    });

});
describe('Configuration selection', function() {
    it('should select global configuration files', function(done) {
        var CLI = new CliConstructor(['--config=global', path.join(__dirname, './fixtures/clean/css')]);
        CLI.dispatch();
        expect(config.getInstance()).to.have.not.ownProperty('basePath');
        done();
    });
    it('should default to global configuration files', function(done) {
        var CLI = new CliConstructor([path.join(__dirname, './fixtures/clean/css')]);
        CLI.dispatch();
        expect(config.getInstance()).to.have.not.ownProperty('basePath');
        done();
    });
    it('should select local configuration file', function(done) {
        var CLI = new CliConstructor([
            '--config=local',
            path.join(__dirname, './fixtures/clean/css')
        ]);
        CLI.dispatch();
        expect(config.getInstance()).to.have.ownProperty('basePath');
        done();
    });
});

function forEachSourceDo(aPath, f) {
    var
        files = fs.readdirSync(path.join(__dirname, aPath)),
        source;

    files.forEach(function(aFilePath) {
        source = new SourceFile(path.join(__dirname, aPath, aFilePath));
        f(source);
    });
}
