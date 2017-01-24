define(["dojo/_base/declare", "dijit/_WidgetBase", "esri/graphic", "esri/geometry/Point", "esri/SpatialReference", "esri/tasks/query", "esri/layers/FeatureLayer", "dojo/json",
"esri/symbols/TextSymbol", "esri/symbols/Font", "dojo/_base/Color", "esri/tasks/GeometryService", "esri/symbols/SimpleMarkerSymbol", "mesa/coordinateCleaner"],
function (declare, _WidgetBase, Graphic, Point, SpatialReference,Query, FeatureLayer, JSON,
TextSymbol, Font, Color, GeometryService, SimpleMarkerSymbol, coordinateCleaner
) {
    var graphicsWidget, map, gsvc, utm12;

    return declare("graphicsTools", [_WidgetBase],{

        geometryServiceURL: null,
        mapRef: null,

        postCreate: function(){
            graphicsWidget = this;
            map = graphicsWidget.mapRef;
            gsvc = graphicsWidget.geometryServiceURL;
            utm12 = new SpatialReference({wkid: map.extent.spatialReference.wkid});
        },

zoomToPoint: function(pointx, pointy, option) {
        map.graphics.clear();
        var mapPoint1 = new Point(pointx, pointy, utm12);
        if (option === "noPoint") { //just select the parcel so the perimeter is highlighted
            var parcelObject;
            var query = new Query();
            query.geometry = mapPoint1;
            lmG.pLay.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (parcel) {
                parcelObject = parcel[0];
                map.setExtent((map.graphics.add(new Graphic(graphicsWidget.createJSONPolygon(parcelObject.geometry.rings)))).geometry.getExtent().expand(1.5));
            });
        } else { //add a point graphic to the map and label it
            map.centerAndZoom(mapPoint1, 7);
            this.addPointToMap(mapPoint1.x, mapPoint1.y, option);
        }
},

createJSONPolygon: function(coords, selector, style, lineColor, polyColor) {
    style = style ||  "esriSFSNull";
    lineColor = lineColor || [82, 246, 248];//blue default
    polyColor = polyColor || [255,255,224];//yellow default
    var frank = String(coords);
    var fixedCoords = frank.replace(/,/g, "],[");
    var fixedCoords2 = fixedCoords.replace(/],\[4/g, ",4");
        fixedCoords2 = JSON.parse("[[[" + fixedCoords2 + "]]]");
        map.graphics !== null? selector !== "noclear"? map.graphics.clear():void(0): void(0);
        PolyPost = {
            "geometry": {
                "rings": fixedCoords2,
                "spatialReference": {
                    "wkid": 102206
                }
            },
            "symbol": {
                "color": polyColor,
                "outline": {
                    "color": lineColor,
                    "width": 2,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                },
                "type": "esriSFS",
                "style": "esriSFSNull"
            }
        }
    return PolyPost;
},

createPolyLabel: function(coords, textnode) {
        gsvc.labelPoints([coords.geometry], function (labelPoints) {
            map.graphics.add(new Graphic(labelPoints[0], new TextSymbol(textnode).setColor(
                new Color([255, 71, 71])).setOffset(0, 12).setAlign(
                TextSymbol.ALIGN_MIDDLE).setFont(
                new Font(18).setWeight(
                    Font.WEIGHT_BOLDER))));
        });
},

//--function for adding a graphic point to the map when search by lat/long tool is used
addPointToMap: function(lon, lat, text) {
        var spatialRef = text === "gcs"? new SpatialReference({wkid: 4326}): utm12;
        var point = new Point(lon, lat, spatialRef);
        if (text === "gcs") {
            gsvc.project([point], utm12, function (result) {
                var utmGraphicPoint = result[0];
                map.graphics.add(new Graphic(utmGraphicPoint, new SimpleMarkerSymbol().setColor(new Color([255, 0, 0, 0.5]))));
                graphicsWidget.pointText(utmGraphicPoint, (lat + ", " + lon));
            });
        } else {
            map.graphics.add(new Graphic(point, new SimpleMarkerSymbol().setColor(new Color([255, 0, 0, 0.5]))));
            graphicsWidget.pointText(point, text);
        }
},


pointText: function(point, text) {
        map.graphics.add(new Graphic(point, new TextSymbol(text).setColor(new Color([216, 71, 71])).setOffset(0, 12).setAlign(TextSymbol.ALIGN_START).setFont(new Font(18).setWeight(Font.WEIGHT_BOLD))));
},

zoom: function(coordinates) {
    map.graphics.clear();
    coordinateCleaner.cleanCoordinates(coordinates, this.doMath);
},


doMath: function(latD, lonD) {
        document.getElementById("searchFieldDialog").style.display = "none";
        latD = (Math.abs(latD));
        lonD = -(Math.abs(lonD));
        document.getElementById("coords") !== null? document.getElementById("coords").value = latD.toFixed(7) + "," + lonD.toFixed(7): void(0)
        latD = latD; //.toFixed(5);
        lonD = lonD; //.toFixed(5);
        var zoomToPoint = new Point(lonD, latD);
        var utmZoomToPoint = gsvc.project([zoomToPoint], utm12, function (result) {
            utmZoomToPoint = result[0];
            map.centerAndZoom(utmZoomToPoint, 8);
        });
        graphicsWidget.addPointToMap(lonD, latD, "gcs");
        map.enableKeyboardNavigation();
        return
}

})//end of declare

});//end of define
