function Constructor(file, index, line, message, checker) {
    this.file = file;
    this.index = index;
    this.line = line || 0;
    this.message = message;
    this.checker = checker;
}

Constructor.prototype.reportToConsole = function() {
    return '[' + this.checker.type + ']\t' + this.line.toString() + '\t' + this.message.bold;
};
