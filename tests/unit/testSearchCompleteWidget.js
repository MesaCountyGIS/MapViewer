define([
    'intern!object',
    'intern/chai!assert',
    'dojo/dom-construct',
    'dojo/_base/window',
    'esri/map',
    "esri/SpatialReference",
    "esri/layers/FeatureLayer",
    'mesa/searchCompleteWidget'

], function(registerSuite, assert, domConstruct, win, Map, SpatialReference, FeatureLayer, searchCompleteWidget) {
    var printer, map;
    registerSuite({
        name: 'print widget test',

        setup: function(){
            domConstruct.place('<div id="map" style="width:300px;height:200px;"></div>', win.body(), 'only');
            domConstruct.place('<div id="print" style="width:300px;"></div>', win.body(), 'last');

            map = new Map("map", {
                basemap: "topo",
                center: [-122.45, 37.75],
                zoom: 13,
                sliderStyle: "small"
            });

                printer = new printWidget({
                    printUrl: "http://mcmap2.mesacounty.us/arcgis/rest/services/Printing/MCExportWebMap/GPServer/Export%20Web%20Map",
                    mapRef: map,
                    device:"desktop"
                }, "print");
                printer.startup();
        },

        'Test print function': function() {
            printer.exportClick().then(function(data) {
                var re = /^http/i;
                if (data.url) {
                    console.log('data.url: ', data.url);
                }
                    assert.strictEqual(re.test(data.url), true, 'data.url points to the result file, make sure it starts with http.');
            });
        }
    });
});
