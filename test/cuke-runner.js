var cuke = require('../lib');
var fs = require('fs');
var path = require('path');
var ls = fs.readdirSync(__dirname).filter(function(item) {
    return /\.feature/.test(item);
}).map(function(itemName) {
    return /(.*?)\.feature/.exec(itemName)[1];
});

(function callee() {
    var feature = ls.shift();
    if (feature) {
        cuke(require('./' + feature + '-steps'), fs.readFileSync(path.join(__dirname, feature + '.feature')).toString(), function() {
            process.nextTick(callee);
        });
    }
})();
