var
    fs = require('fs');

module.exports = function(code, configuration) {
    return csslint.verify(code, configuration);
};
