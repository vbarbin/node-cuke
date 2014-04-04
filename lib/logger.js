require('colors');

module.exports = {
    newline: function() {
        console.log();
    },
    log: function(text) {
        console.log(text);
    },
    success: function(text) {
        console.log(text.green);
    },
    error: function(text) {
        console.log(text.red);
    }
}