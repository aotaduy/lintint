/* */
var CSSLintChecker = require('./CSSLintChecker.js'),
    EsLintChecker = require('./EsLintChecker.js'),
    HTMLLintChecker = require('./HTMLLintChecker.js'),
    JSCSLintChecker = require('./JSCSLintChecker.js'),
    JSHintLintChecker = require('./JSHintLintChecker.js'),
    JSSpellLintChecker = require('./JSSpellLintChecker.js'),
    RegExpLintChecker = require('./RegExpLintChecker.js'),
    LessCSSLintChecker = require('./LessCSSLintChecker.js'),
    fs = require('fs'),
    path = require('path'),
    singleton;

function GlobalConfigurationResolver() {
    ConfigurationResolver.call(this);
}

function ConfigurationResolver() {
    this.initializeRules();
}

ConfigurationResolver.prototype = Object.create(Object.prototype);

ConfigurationResolver.prototype.initializeRules = function() {
    var self = this;
    this.rules = [
        new CSSLintChecker('.css'),
        new LessCSSLintChecker('.less'),
        new RegExpLintChecker(
            '.html',
            /(?:translate }})|(?:\{\{'.*'}})|(?:\{\{::')/g,
            'translation: Please remove translation filter'),
        new RegExpLintChecker(
            '.less',
            /(?:margin-.*(:?\b 5|10|18|20|24|30|40|50|60)px)/g,
            'margin: Please use adaptative margins instead such as mb-desktop-10'),
        new RegExpLintChecker(
            '.less',
            /(?:\b:\b.*;)/g,
            'spacing: Please add space between colon and value'),
        new RegExpLintChecker(
            '.less',
            /font-/,
            'font: Please use standard classes for font settings'),
        new RegExpLintChecker(
            '.less',
            /important/,
            'important!: Please avoid use of important'),
        new RegExpLintChecker(
            '.html',
            /(?:ng-if="|ng-show="|ng-hide="|).*[a-zA-Z0-9]*\(\)/,
            'Please avoid function calls on this directive replace with a boolean variable instead'),
        new JSCSLintChecker('.js'),
        new JSHintLintChecker('.js'),
        new EsLintChecker('.js'),
        new HTMLLintChecker('.html'),
        new JSSpellLintChecker('.js')
    ];
    this.rules.forEach(function(each) {
        each.setConfig(self);
    });
};

function LocalConfigurationResolver(basePath) {
    this.basePath = basePath;
    ConfigurationResolver.call(this);
}

ConfigurationResolver.prototype.cssLint = function() {
    return JSON.parse(fs.readFileSync(this.cssLintPath()));
};

GlobalConfigurationResolver.prototype = Object.create(ConfigurationResolver.prototype);

GlobalConfigurationResolver.prototype.cssLintPath = function() {
    return pathInConfigDirectory('.csslintrc');
};

LocalConfigurationResolver.prototype = Object.create(ConfigurationResolver.prototype);

LocalConfigurationResolver.prototype.cssLintPath = function() {
    return this.findFile(this.basePath, '.csslintrc');
};

LocalConfigurationResolver.prototype.findFile = function(fromDir, fileName) {
    var dir = fromDir,
        found = false;
    while (dir !== path.resolve('/') && !found) {
        if (fs.existsSync(path.resolve(dir, fileName))) {
            found = true;
        } else {
            dir = path.resolve(dir, '../');
        }
    }
    if (found) {
        return path.resolve(dir, fileName);
    } else {
        return pathInConfigDirectory(fileName);
    }
};

function pathInConfigDirectory (fileName) {
    return path.resolve(__dirname, '../config/', fileName);
}

module.exports =  {
    getInstance:  function() {
        return singleton;
    },
    initializeGlobal: function() {
        return new GlobalConfigurationResolver();
    },
    initializeLocal:  function(baseDir) {
        return new LocalConfigurationResolver(baseDir);
    }
};
