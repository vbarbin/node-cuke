var cuke = require('../lib');
var fs = require('fs');
var path = require('path');
var ls = fs.readdirSync(__dirname).filter(function(item) {
    return /\.feature/.test(item);
}).map(function(itemName) {
    return /(.*?)\.feature/.exec(itemName)[1];
});

for (var i = 0; i < ls.length; i++) {
    cuke(require('./' + ls[i] + '-steps'), fs.readFileSync(path.join(__dirname, ls[i] + '.feature')).toString());
}
