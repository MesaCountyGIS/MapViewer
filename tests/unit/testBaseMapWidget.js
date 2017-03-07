define([
    'intern!object',
    'intern/chai!assert',
    'dojo/dom-construct',
    'dojo/_base/window',
    'esri/map',
    "esri/geometry/Extent",
    "esri/layers/ArcGISTiledMapServiceLayer",
    'mesa/basemapWidget'

], function(registerSuite, assert, domConstruct, win, Map, Extent, ArcGISTiledMapServiceLayer, basemapWidget) {
    var initBasemap, map, evt;
    lmG={};
    registerSuite({
        name: 'Basemap Widget Test',

        setup: function(){
            domConstruct.place('<div id="map" style="width:300px;height:200px;"></div>', win.body(), 'only');
            domConstruct.place('<div id="vector" style="width:300px;"></div>', win.body(), 'last');
            domConstruct.place('<div id="imagelist2" style="width:300px;"></div>', win.body(), 'last');
            domConstruct.place('<div id="historicalImagery" data-value="A2015" style="width:300px;"></div>', win.body(), 'last');
            domConstruct.place('<button id="DTbasemap" title="Turn on Default Basemap"></button>', win.body(), 'last');
            domConstruct.place('<button id="MBasemap" title="Turn on Default Basemap"></button>', win.body(), 'last');
            domConstruct.place('<li id="historicalImagery"></li>', win.body(), 'last');
            domConstruct.place('<li id="li" data-value="A2015"><a>2015 Countywide</a></li>', win.body(), 'last');

            evt = document.getElementById("li");

            map = Map("map", {
                basemap: "topo",
                center: [-122.45, 37.75],
                zoom: 13,
                sliderStyle: "small"
            });

            var url0 = "http://mcmap2.mesacounty.us/arcgis/rest/services/maps/vector_basemap/MapServer";
            lmG.vectorBasemap = ArcGISTiledMapServiceLayer(
                url0,{
                    id:"vectorBasemap"
                });

            var url = "http://mcmap2.mesacounty.us/arcgis/rest/services/maps/vector_basemap/MapServer";
            initBasemap = ArcGISTiledMapServiceLayer(
                url,{
                    id:"vector"
                });

            var url2 = "http://mcmap2.mesacounty.us/arcgis/rest/services/Mosaic_Datasets/MesaCounty_2015/ImageServer";
            lmG.A2015 = ArcGISTiledMapServiceLayer(
                url2,{
                    id:"A2015"
                });

            map.addLayers([initBasemap, lmG.A2015]);

            basemap = basemapWidget({
                mapRef: map,
                device:"desktop",
                initialBasemap: initBasemap
            }, "imagelist2");
            basemap.startup();
        },

        'Test loadYear function': function() {
            console.log("loadyear() should return an array with the single value 'A2015'. During the test it returned: ", basemap.loadYear('A2015'))
            assert.deepEqual(basemap.loadYear('A2015'), 'A2015', 'The return of enableCheck() should equal the string "A2015".');
        },

        'Test basemapChanger function': function() {
            console.log("basemapChanger() should return 'A2015'. During the test it returned: ", basemap.basemapChanger())
            assert.deepEqual(basemap.basemapChanger(), 'A2015', 'The return of basemapChanger() should equal the string "A2015".');
        },

        'Test historicalImageryDropdown function': function() {
            console.log("historicalImageryDropdown(evt) should return 'A2015'. During the test it returned: ", basemap.historicalImageryDropdown.call(evt))
            assert.deepEqual(basemap.historicalImageryDropdown.call(evt), 'A2015', 'The return of historicalImageryDropdown() should equal the string "A2015".');
        }




    });
});
