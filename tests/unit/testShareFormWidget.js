define([
    'intern!object',
    'intern/chai!assert',
    "esri/tasks/GeometryService",
    "esri/SpatialReference",
    "esri/map",
    "esri/geometry/Extent",
    "dojo/dom-construct",
    "dojo/_base/window",
    'mesa/shareFormWidget'

], function(registerSuite, assert, domConstruct, GeometryService, SpatialReference, Map, Extent, domConstruct, win, shareFormWidget) {
    var graphictools, polyRings, pointx, pointy;
    registerSuite({
        name: 'Graphics Tools Test',

        setup: function(){
            domConstruct.place('<div id="map" style="width:300px;height:200px;"></div>', win.body(), 'only');
            domConstruct.place('<div id="measure" style="width:300px;"></div>', win.body(), 'last');

            var utm12 = new SpatialReference({
                wkid: 102206
            });

            var initExtent = new Extent({
                "xmin": 685960,
                "ymin": 4316261,
                "xmax": 738288,
                "ymax": 4342506,
                "spatialReference": utm12
            });

            var popup = new Popup({
               offsetX: 10,
               offsetY: 10,
               zoomFactor: 2
             }, domConstruct.create("div"));

            var map = new Map("map", {
                extent: initExtent,
                logo: false,
                infoWindow: popup
            });

            shareForm = new shareFormWidget({
                emailServiceUrl: "scripts/php/ShareMail.php"
            });
        },

        'Test create an ESRI JSON polygon string': function() {
            assert.strictEqual(shareForm_createURL, 'The return value of input rings should be a JSON string containing rings');
        }


    });
    function callback(x, y){
        console.log("the callback function received: ", x, y)
    }
});
