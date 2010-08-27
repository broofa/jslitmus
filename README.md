# jslitmus: JavaScript benchmark testing made easy

jslitmus is copyright(C) Robert Kieffer, 2010.
It is available for use under the MIT opensource license.

## Examples

Better/richer examples are forthcoming.  For now, checkout [test/example.htm](http://github.com/broofa/jslitmus/blob/master/test/example.htm).  It demonstrates how to setup and run tests, how to listen for test results, and how to get a google graph link for the results.  (It even shows how to shorten that URL via bit.ly)

### In a web page:

    <script src="jslitmus.js"></script>
    <script>
    // Create a test to see how fast Array.join() is on 10K elements
    var a = new Array(10000);
    jslitmus.test('Join 10K elements', function() {
        a.join(' ');
    });

    // Log the test results
    jslitmus.on('complete', function(test) {
        console.log(test);
    });

    // Run it!
    jslitmus.runAll();
    </script>
  
Outputs:

    >>> Join 10K elements, f = 6.305khz (5.12k/0.812secs)

I.e. Our test function runs at a "frequency" of 6,305 times per second.

### In a Node.js

    var sys = require('sys');
    var jslitmus = require('./jslitmus.js');

    var a = new Array(10000);
    jslitmus.test('Join 10K elements', function() {
        a.join(' ');
    });

    // Log the test results
    jslitmus.on('complete', function(test) {
        sys.log(test);
    });

    // Run it!
    jslitmus.runAll();

## jslitmus API
In addition to the following, jslitmus also inherits the EventEmitter API, below.

### Properties
* <b>Test</b> - Class used to represent and evaluate a test function.  See API docs below for more info.
* <b>unsupported.*</b> - Methods that jslitmus implements for internal use, but that are useful enough to warrant exposing publically.  But as the name says these will not be supported as part of the main jslitmus API.  Use at your own risk.
* <b>platform</b> - Platform detection information.  Contains the following properties:
    * <b>name</b> - Common name (e.g. "Chrome", "IE", "Safari", "node")
    * <b>version</b> - Version string
    * <b>os</b> - Operating system, if known
    * <b>description</b> - String summarizing the above properties. (This is what the 'platform' object evaluates to when cast to a string, btw.)

### Methods
* <b>test(name, function)</b> - Add a test function
* <b>runAll()</b> - Run all test functions added with jslitmus.test()
* <b>getGoogleChart()</b> - Return a URL to a google chart image for all test results.  Typically called as part of 'all_complete' event handling.

### Events
* <b>all_complete</b>() - Emitted after all tests have completed.
* <b>error</b>(err) - Fires when an exception is thrown inside jslitmus.

Also, the following events are forwarded from any test created with jslitmus.test().  See the corresponding jslitmus.Test API event documentation for details:

* <b>complete</b>(test)
* <b>error</b>(err)
* <b>reset</b>(test)
* <b>results</b>(test)
* <b>start</b>(test)

## jslitmus.Test API
In addition to the following, jslitmus.Test also inherits the EventEmitter API, below.

### Properties
* <b>INIT_COUNT</b> - The initial iteration count to start with. There's not much reason to change this - jslitmus does a pretty good job of auto-calibrating. (default = 10)
* <b>MAX_COUNT</b> - The maximum iteration count to allow. (default = 1e9)
* <b>MIN_TIME</b> - The minimum a test run should take to be considered valid.  (seconds, default = 1)
* <b>count</b> - (read only) The number of iterations the test ran/will run for. (read only)
* <b>f</b> - The test function. (read only)
* <b>isLoop</b> - True if the test function is expected to provide it's own iteration loop. (read only)
* <b>name</b> - The test name.
* <b>period</b> - The 'period' of the test (time/iterations) (read only)
* <b>running</b> - True if the test is in progress (read only)
* <b>time</b> - The time taken to run the test (msecs, read only)

### Methods
* <b>run</b>(count, synchronous) - Run the test with the specified iteration count.  If 'synchronous' is true this blocks until the test has completed, otherwise it's asynchronous.
* <b>getHz</b>(normalize) - Get the frequency at which the test function can be run.  If 'normalize' is true, jslitmus will attempt to subtract out the time invoved in doing the iteration loop (which can be significant when testing fast operations like "x++".)
* <b>bestOf</b>(n) - Run the test n times, keeping the best result.
* <b>reset</b> - Reset the test.
* <b>clone</b> - Clone the test. The returned clone is reset() automatically.

### Events
* <b>complete</b>(test) - Fires when a test has been completed
* <b>error</b>(err) - Fires if an exception is thrown inside a test
* <b>reset</b>(test) - Fires when a test has been reset (e.g. in preparation for being run again)
* <b>results</b>(test) - Fires when test results  are available.
* <b>start</b>(test) - Fires when a test has been started, before results are available.  The test.count property indicates the number of iterations the test will be run for.

## EventEmitter API
The EventEmitter API is not exposed directly - it is only available through jslitmus and jslitmus.Test objects that inherit it.

### Properties
* <b>_emitting</b> - The event currently being emitted

### Methods
* <b>on</b>(event, function) -  Register a callback function for an event.
* <b>emit</b>(event, ...) - Notify listeners of an event.  All subsequent arguments are passed into listener functions.
* <b>removeListener</b>(event, function) - Remove a previously registered callback function.
* <b>removeAllListeners</b>(event) - Remove all registered callback functions.
