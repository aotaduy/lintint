var chai = require('chai');
var expect = chai.expect;
var fs = require('fs');
var path = require('path');

var SourceFile = require('../lib/SourceFile.js');

describe('Integrator', function() {
    describe('Check source file', function() {
        it('Run checks on files and report', function() {
            var files = fs.readdirSync(path.join(__dirname, '/fixtures/broken/'));
            var source;
            files.forEach(function(aFilePath) {
                source = new SourceFile(path.join(__dirname, '/fixtures/broken/', aFilePath));
                source.process();
                expect(source.issues.length).to.be.above(0);
            });
        });
        it('Should sort results by line', function() {
            var previousLine, source;
            previousLine = 0;
            source = new SourceFile(path.join(__dirname, './fixtures/broken/varspelling.js'));
            source.process();
            source.sortIssues();
            source.issues.forEach(function(each) {
                expect(previousLine).to.be.at.most(each.line);
                previousLine = each.line;
            });
        });
        it('Run checks on clean files and do not report', function() {
            var files = fs.readdirSync(path.join(__dirname,'./fixtures/clean/'));
            var source;
            files.forEach(function(aFilePath) {
                source = new SourceFile(path.join(__dirname, '/fixtures/clean/', aFilePath));
                source.process();
                expect(source.issues.length).to.be.equal(0);
            });
        });
    });
});
