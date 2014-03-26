var cuke = require('../lib');
var fs = require('fs');
var path = require('path');
var ls = fs.readdirSync(__dirname).map(function(itemName) {
    if (/\.cuke/.test(itemName)) {
        return /(.*?)\.cuke/.exec(itemName)[1];
    }
}).filter(function(item) {
    return !!item;
});

for (var i = 0; i < ls.length; i++) {
    cuke(require('./' + ls[i] + '-steps'), fs.readFileSync(path.join(__dirname, ls[i] + '.cuke')).toString());
}