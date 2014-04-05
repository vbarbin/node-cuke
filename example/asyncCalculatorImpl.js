module.exports = {
    add: function(a, b, callback) {
        setTimeout(function() {
            callback(null, a + b);
        }, 100);
    },
    substract: function(a, b, callback) {
        setTimeout(function() {
            callback(null, a - b);
        }, 100);
    }
}