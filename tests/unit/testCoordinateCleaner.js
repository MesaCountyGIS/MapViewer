define([
    'intern!object',
    'intern/chai!assert',
    'mesa/coordinateCleaner'

], function(registerSuite, assert, coordinateCleaner) {
    registerSuite({
        name: 'Coordinate Cleaner test',

        'Test coordinate function for array': function() {
            assert.typeOf(coordinateCleaner.cleanCoordinates("39,108"), "array", 'The return value of two coordinates should be an array');
        },

        'Test coordinate function for appropriate return value': function() {
            assert.deepEqual(coordinateCleaner.cleanCoordinates("39, 108"), ["39", "108"], 'with input of 39, 108, receive output as array of ["39", "108"]');
        },

        'Test coordinate function with a callback function': function() {
            assert.deepEqual(coordinateCleaner.cleanCoordinates("39,108", callback), callback("39","108"), 'The return value is an array');
        },

        'Test compareMS function': function() {
            assert.deepEqual(coordinateCleaner._compareMS("39 25", "108 25"), 0, 'The return value of a latitude and longitude value in degrees/minutes is number 0');
        }



    });
    function callback(x, y){
        console.log("the callback function received: ", x, y)
    }
});
