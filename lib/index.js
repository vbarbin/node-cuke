require('colors');
var fs = require('fs');
var path = require('path');
var pegjs = require('pegjs');
var cukeParser = pegjs.buildParser(fs.readFileSync(path.join(__dirname, 'parser-source.js')).toString());

module.exports = function(Step, behaviour, callback) {
    var features = cukeParser.parse(behaviour);

    (function callee() {

        var feature = features.shift();

        if (feature) {
            feature.exec(Step, function() {
                console.log();
                process.nextTick(callee);
            });
        }
        else {
            if (callback) callback();
        }

    })();
};
