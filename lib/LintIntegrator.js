var CSSLintChecker = require('./CSSLintChecker.js'),
    EsLintChecker = require('./EsLintChecker.js'),
    HTMLLintChecker = require('./HTMLLintChecker.js'),
    JSCSLintChecker = require('./JSCSLintChecker.js'),
    JSHintLintChecker = require('./JSHintLintChecker.js'),
    JSSpellLintChecker = require('./JSSpellLintChecker.js'),
    RegExpLintChecker = require('./RegExpLintChecker.js'),
    LessCSSLintChecker = require('./LessCSSLintChecker.js');

var LintIntegrator = {
    rules: [
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
    ]
};

module.exports = LintIntegrator;
