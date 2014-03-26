var cuke = require('../lib');
var fs = require('fs');
var path = require('path');
var ls = fs.readdirSync(__dirname).filter(function(item) {
    return /\.cuke/.test(item);
}).map(function(itemName) {
    return /(.*?)\.cuke/.exec(itemName)[1];
});

for (var i = 0; i < ls.length; i++) {
    cuke(require('./' + ls[i] + '-steps'), fs.readFileSync(path.join(__dirname, ls[i] + '.cuke')).toString());
}
