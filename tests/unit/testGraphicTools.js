define([
    'intern!object',
    'intern/chai!assert',
    "esri/tasks/GeometryService",
    "esri/SpatialReference",
    "esri/map",
    "esri/geometry/Extent",
    "dojo/dom-construct",
    "dojo/_base/window",
    "esri/dijit/Popup",
    'mesa/graphicsTools'

], function(registerSuite, assert, GeometryService, SpatialReference, Map, Extent, domConstruct, win, Popup, graphicsTools) {
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

            var geometryServiceURL = "http://mcmap2.mesacounty.us/arcgis/rest/services/Utilities/Geometry/GeometryServer";
            var gsvc = new GeometryService(geometryServiceURL);

            polyRings = [704880.5784,4329354.058800001,704859.1242000004,4329353.884,704858.0027000001,4329391.800100001,704885.7401,4329392.335200001,704880.5784,4329354.058800001];

            pointx = 760673.8660000004;
            pointy = 4348600.403999999;

            graphictools = new graphicsTools({
                geometryServiceURL: geometryServiceURL,
                mapRef: map,
            });


        },

        'Test create an ESRI JSON polygon string': function() {
            assert.strictEqual(JSON.stringify(graphictools.createJSONPolygon(polyRings)), '{"geometry":{"rings":[[[704880.5784,4329354.058800001],[704859.1242000004,4329353.884],[704858.0027000001,4329391.800100001],[704885.7401,4329392.335200001],[704880.5784,4329354.058800001]]],"spatialReference":{"wkid":102206}},"symbol":{"color":[0,0,0,64],"outline":{"color":[82,246,248,255],"width":2,"type":"esriSLS","style":"esriSLSSolid"},"type":"esriSFS","style":"esriSFSNull"}}',
            'The return value of input rings should be a JSON string containing rings');
            console.log(polyRings)
        },


    });
    function callback(x, y){
        console.log("the callback function received: ", x, y)
    }
});
