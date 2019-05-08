// import declare from "dojo/_base/declare";
// import * as _WidgetBase from "dijit/_WidgetBase";
// import * as Menu from "dijit/Menu";
// import * as MenuItem from "dijit/MenuItem";
// import * as MenuSeparator from "dijit/MenuSeparator";
// import * as Point from "esri/geometry/Point";
// import * as domConstruct from "dojo/dom-construct";
// import * as GeometryService from "esri/tasks/GeometryService";
// import * as SpatialReference from "esri/SpatialReference";

    define([
        "dojo/_base/declare", "dijit/_WidgetBase", "dijit/Menu", "dijit/MenuItem", "dijit/MenuSeparator", "esri/geometry/Point",
        "dojo/dom-construct", "esri/tasks/GeometryService", "esri/SpatialReference"
    ], function (
        declare, _WidgetBase, Menu, MenuItem, MenuSeparator, Point, domConstruct, GeometryService, SpatialReference
    ) {
            return declare("contextMenuWidget", [_WidgetBase], {
            // export default declare("contextMenuWidget", [_WidgetBase], {
                mapRef: null,
                geometryServiceURL: null,
                trsURL: null,

                postCreate: function () {
                    this.inherited(arguments);
                    const map = this.mapRef;
                    const trsURL = this.trsURL;
                    const gsvc = new GeometryService(this.geometryServiceURL);
                    const wgs84 = new SpatialReference({
                        wkid: 4326
                    });

        ctxMenuForMap = new Menu({
            style: "background-color:#EEEEEE;font-size:0.8em;width:140px;height:auto;",
            onOpen: function (box) {
                rightClickGCSCoordinates = getMapPointFromMenuPosition(box);
            },
            targetNodeIds: [map.id],
            onShow: function () {}
        });

        ctxMenuForMap.addChild(new MenuSeparator());
        ctxMenuForMap.addChild(new MenuItem({
            label: "Google Street View",
            iconClass: "googleStreetViewIcon",
            onClick: function (evt) {
                ga('send', 'event', 'ContextMenu', 'Google Street View');
                gsvc.project([rightClickGCSCoordinates], wgs84, function (result) {
                    const googCoords = result[0]
                    const prefix = "https://maps.google.com/maps?output=svembed&layer=c&cbp=12,132.595,,0,4.429&cbll=";
                    const coords = googCoords.y + "," + googCoords.x;
                    const url = prefix + coords;
                    window.open(url);
                });
            }
        }));

        ctxMenuForMap.addChild(new MenuSeparator({
            style: "border-bottom:1px solid lightgray;"
        }));
        ctxMenuForMap.addChild(new MenuSeparator({}));
        ctxMenuForMap.addChild(new MenuItem({
            label: "Copy Geographic Coordinates",
            iconClass: "latLonGlobeIcon",
            onClick: function (evt) {
                ga('send', 'event', 'ContextMenu', 'Geographic Coordinates');
                gsvc.project([rightClickGCSCoordinates], wgs84, function (result) {
                    geogCoords = result[0]
                    const coordString = "Latitude =  " + geogCoords.y.toFixed(7) + "  " + "Longitude =  " + geogCoords.x.toFixed(7);
                    window.prompt("Press Crtl+C to copy coordinates\n\nThen press Enter or click OK to close this window", coordString);
                });
            }
        }));

        ctxMenuForMap.addChild(new MenuSeparator({
            style: "border-bottom:1px solid lightgray;"
        }));
        ctxMenuForMap.addChild(new MenuSeparator({}));
        ctxMenuForMap.addChild(new MenuItem({
            label: "Copy UTM Coordinates",
            iconClass: "utmCubeGlobeIcon",
            onClick: function (evt) {
                ga('send', 'event', 'ContextMenu', 'UTM Coordinates');
                const coordString = "X coordinate =  " + rightClickGCSCoordinates.x.toFixed(7) + "  " + "Y coordinate =  " + rightClickGCSCoordinates.y.toFixed(7);
                window.prompt("Press Crtl+C to copy coordinates\n\nThen press Enter or click OK to close this window", coordString);
            }
        }));

        ctxMenuForMap.addChild(new MenuSeparator({
            style: "border-bottom:1px solid lightgray;"
        }));
        ctxMenuForMap.addChild(new MenuSeparator({}));
        ctxMenuForMap.addChild(new MenuItem({
            label: "Get Township/Range/Section",
            iconClass: "trsIcon",
            //style: "margin:1em;",
            onClick: function (evt) {
                ga('send', 'event', 'ContextMenu', 'Township/Range/Section');
                require([
                    "esri/tasks/QueryTask",
                    "esri/tasks/query"
                ], function (QueryTask, Query) {
                    trsQueryTask = new QueryTask(trsURL);
                    trsQuery = new Query();
                    trsQuery.returnGeometry = false;
                    trsQuery.outFields = ["TRSM"];
                    trsQuery.geometry = rightClickGCSCoordinates;

                    trsQueryTask.execute(trsQuery, function (result) {
                        const trsString = result.features[0].attributes['TRSM'] + " meridian";
                        window.prompt("Press Crtl+C to copy Township Range and Section\nThen press Enter or click OK to close this window\n", trsString);
                    });
                });
            }
        }));

        //        ctxMenuForMap.addChild(new MenuSeparator({
        //            style: "border-bottom:1px solid lightgray;"
        //        }));
        //        ctxMenuForMap.addChild(new MenuItem({
        //            label: "3 Word Position",
        ////            iconClass: "w3wIcon",
        //            onClick: function (evt) {
        //                ga('send', 'event', 'ContextMenu', 'What 3 Words');
        //                gsvc.project([rightClickGCSCoordinates], wgs84, function (result) {
        //                    const w3wCoords = result[0]
        //                    const prefix = "http://api.what3words.com/position?key=JNX6U9YX&lang=en&position=";
        //                    const coords = w3wCoords.y + "," + w3wCoords.x;
        //                    const url = prefix + coords;
        //                    require(["dojo/request/xhr"], function(xhr){
        //                        xhr(url, {
        //                        handleAs: "json",
        //                            method:"GET"
        //                        }).then(function(data){
        //                            window.prompt("Press Crtl+C to copy 3 word position\nThen press Enter or click OK to close this window\n", data.words);
        //                        });
        //                    })
        //                });
        //            }
        //        }));

        ctxMenuForMap.addChild(new MenuSeparator({}));
        ctxMenuForMap.startup();


        // Method for getting screen coordinates from context menu corner and converting it to GCS coordinates
        function getMapPointFromMenuPosition(box) {

            const x = box.x;
            const y = box.y
            switch (box.corner) {
            case "TR":
                x += box.w;
                break;
            case "BL":
                y += box.h;
                break;
            case "BR":
                x += box.w;
                y += box.h;
                break;
            }
            const screenPoint = new Point(x - map.position.x, y - map.position.y);
            const mapPoint = map.toMap(screenPoint);
            return mapPoint;
        }

      }
  }); //end declare

}); //end define
