define([
    'intern!object',
    'intern/chai!assert',
    'dojo/dom-construct',
    'dojo/_base/window',
    'esri/map',
    'esri/SpatialReference',
    'esri/layers/FeatureLayer',
    'esri/toolbars/edit',
    'mesa/measureWidget'

], function(registerSuite, assert, domConstruct, win, Map, SpatialReference, FeatureLayer, Edit, measureWidget) {
    var measure, map, res, outPolyArea, outPolyLength;
    registerSuite({
        name: 'Measure Widget Test',

        setup: function(){
            domConstruct.place('<div id="map" style="width:300px;height:200px;"></div>', win.body(), 'only');
            domConstruct.place('<div id="measure" style="width:300px;"></div>', win.body(), 'last');
            domConstruct.place('<input id="measureYes" type="checkbox" checked />', "measure", 'last');

            pLay = new FeatureLayer("http://mcmap2.mesacounty.us/arcgis/rest/services/maps/ParcelOnly4Query/MapServer/0", {
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: ["LOCATION", "ACCOUNTNO", "OWNER", "JTOWNER", "SDATE", "PARCEL_NUM", "ZONING", "Acres", "JURISDICTION"]
            });

            res = {
                "result": {
                    "areas":[4800.338916370976],
                    "lengths":[60981.02493438346]
                }
            };

            outPolyArea = "acres";
            outPolyLength = "feet";

            map = Map("map", {
                basemap: "topo",
                center: [-122.45, 37.75],
                zoom: 13,
                sliderStyle: "small"
            });

                measure = measureWidget({
                    gsvc: "http://mcmap2.mesacounty.us/arcgis/rest/services/Utilities/Geometry/GeometryServer",
                    mapRef: map,
                    device:"desktop",
                    parcelLayer: pLay
                }, "measure");
                measure.startup();
        },

        // 'Test enableCheck function': function() {
        //     console.log("EnableCheck() should return 'inline'. During the test it returned: ", measure.enableCheck())
        //     assert.deepEqual(measure.enableCheck(), "inline", 'The return of enableCheck() should equal the string "inline".');
        // },

        // 'Test _createAreaText function': function() {
        //     console.log("_createAreaText() should return 'Area: 4800.339 acres'. During the test it returned: ", measure._createAreaText(res, outPolyArea))
        //     assert.deepEqual(measure._createAreaText(res, outPolyArea), 'Area: 4800.339 acres', 'The return of _createAreaText() should equal the string "Area: 4800.339 acres".');
        // },
        //
        // 'Test _createPerimText function': function() {
        //     console.log("_createPerimText() should return 'Perimeter: 60981.025 feet'. During the test it returned: ", measure._createPerimText(res, outPolyLength))
        //     assert.deepEqual(measure._createPerimText(res, outPolyLength), 'Perimeter: 60981.025 feet', 'The return of _createPerimText() should equal the string "Perimeter: 60981.025 feet".');
        // },
        //
        // 'Test _outputArea function': function() {
        //     console.log("_outputArea() should return ['4800.339 acres", "60981.025 feet']. During the test it returned: ", measure._outputArea(res, outPolyArea, outPolyLength))
        //     assert.deepEqual(measure._outputArea(res, outPolyArea, outPolyLength), ["4800.339 acres", "60981.025 feet"], 'The return of _outputArea() should equal the array ["4800.339 acres", "60981.025 feet"].');
        // }




    });
});
