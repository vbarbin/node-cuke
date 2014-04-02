require('colors');
var fs = require('fs');
var path = require('path');
var pegjs = require('pegjs');
var core = require('./core.js')
var cukeParser = pegjs.buildParser(fs.readFileSync(path.join(__dirname, 'parser-source.js')).toString());

module.exports = function(Step, behaviour, callback) {
    var features = cukeParser.parse(behaviour);

    core.executeFeatures(Step, features);
};
