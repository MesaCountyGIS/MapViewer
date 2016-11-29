define([
    'intern!object',
    'intern/chai!assert',
    'mesa/coordinateCleaner'

], function(registerSuite, assert, coordinateCleaner) {
    registerSuite({
        name: 'Coordinate Cleaner test',

        'Test coordinate function for array': function() {
            assert.typeOf(coordinateCleaner.cleanCoordinates("39,108"),
            "array",
            'The return value of two coordinates should be an array');
        },

        'Test coordinate function for appropriate return value': function() {
            assert.deepEqual(coordinateCleaner.cleanCoordinates("39, 108"),
            ["39", "108"],
            'with input of 39, 108, receive output as array of ["39", "108"]');
        },

        'Test coordinate function with a callback function': function() {
            assert.deepEqual(coordinateCleaner.cleanCoordinates("39,108", callback),
            callback("39","108"),
            'The return value is an array');
        },

        'Test _compareMS function with two valid degree/minute values': function() {
            assert.deepEqual(coordinateCleaner._compareMS("39 25", "108 25"),
            0,
            'The return value of a latitude and longitude value in degrees/minutes is number 0');
        },

        'Test _compareMS function with an invalid degree/minute value': function() {
            assert.deepEqual(coordinateCleaner._compareMS(["39", "61"], ["108", "25"]),
            "<div class='alertmessageIP alertmessage'>Minute and Second entries" +
                " must be 0-60. Please correct the following indicated entries." +
                "</div><br><b>Lat: 39</b> <u style='color:red;'>61</u>" +
                " <br><br><b>Lon: 108</b> <b>25</b> ",
            'The return value of a latitude and longitude value in degrees/minutes ' +
            'with an invalid value is an HTML error message');
        },

        'Test _processCoordinates function with valid degree/minute values': function() {
            assert.deepEqual(coordinateCleaner._processCoordinates("39", "108"),
            ["39", "108"],
            'Valid coordinates passed to _processCoordinates should return an array with those same coordinates.');
        }



    });
    function callback(x, y){
        console.log("the callback function received: ", x, y)
    }
});
