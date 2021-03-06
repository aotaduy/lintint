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
    path = require('path');

function ConfigurationResolver() {
    this.initializeRules();
}

ConfigurationResolver.prototype = Object.create(Object.prototype);

ConfigurationResolver.prototype.initializeRules = function() {
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
};

ConfigurationResolver.prototype.pathInConfigDirectory = function(fileName) {
    return path.resolve(__dirname, '../config/', fileName);
};

function GlobalConfigurationResolver() {
    ConfigurationResolver.call(this);
}

function LocalConfigurationResolver(basePath) {
    this.basePath = basePath;
    ConfigurationResolver.call(this);
}

GlobalConfigurationResolver.prototype = Object.create(ConfigurationResolver.prototype);

LocalConfigurationResolver.prototype = Object.create(ConfigurationResolver.prototype);

LocalConfigurationResolver.prototype.getConfigFor = function(aRule) {
    return aRule.getLocalConfig(this);
};

GlobalConfigurationResolver.prototype.getConfigFor = function(aRule) {
    return aRule.getGlobalConfig(this);
};

LocalConfigurationResolver.prototype.findFile = function(fileName, defaultFileName) {
    var dir = path.resolve(path.dirname(this.basePath)),
        found = false,
        defaultFile = defaultFileName || this.pathInConfigDirectory(fileName);

    while (dir === path.resolve(dir, '../') && !found) {
        if (fs.existsSync(path.resolve(dir, fileName))) {
            found = true;
        } else {
            dir = path.resolve(dir, '../');
        }
    }
    if (found) {
        return path.resolve(dir, fileName);
    } else {
        return defaultFile;
    }
};

module.exports.getInstance = function getInstance() {
    if (module.exports.singleton === undefined) {
        module.exports.initializeGlobal();
    }
    return module.exports.singleton;
};
module.exports.initializeLocal = function(baseDir) {
    module.exports.singleton = new LocalConfigurationResolver(baseDir);
    return module.exports.singleton;
};

module.exports.initializeGlobal = function() {
    module.exports.singleton = new GlobalConfigurationResolver();
    return module.exports.singleton;
};
