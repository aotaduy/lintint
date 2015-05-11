var
    csslint = require('csslint').CSSLint,
    path = require('path'),
    fs = require('fs'),
    configuration = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config/.csslintrc')));

module.exports = function(code) {
    return csslint.verify(code, configuration);
}
