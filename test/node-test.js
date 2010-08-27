// A test file that is compatible with both Node.js and browsers.
// This is a bit ugly at the moment.

// Node require()'s
if (typeof(jslitmus) == 'undefined') {
  var jslitmus = require('../jslitmus');
  var sys = require('sys');
}
// Use the unsupported log method
var log = jslitmus.unsupported.log;

// Create the tests (and put 'em in an array, so we can modify them)
jslitmus.test('loop', function(count) {
  while (count--) {}
});

jslitmus.test('noloop', function() {
});

jslitmus.test('Array.join', function(count) {
  while (count--) {
    new Array(1000).join(' ');
  }
});

// Adjust the default min time so things run a bit faster
jslitmus.Test.prototype.MIN_TIME = .5;

jslitmus.on('*', function(test, a) {
  var e = this._emitting;
  log('"' + e + '" ' + test);
  //sys.log('Hz: ' + test.getHz() + ' -> ' + test.getHz(true));
  if (e == 'error') {
    log('ERROR:\n' + sys.inspect(a));
  } else if (e == 'all_complete') {
    log(jslitmus.getGoogleChart());
  }
});

jslitmus.runAll();
