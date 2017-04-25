define([
    "dojo/_base/declare", "dojo/_base/lang", "dojo/dnd/move", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/measureDialog.html",
    "esri/tasks/GeometryService", "esri/geometry/mathUtils", "esri/layers/GraphicsLayer", "dojo/keys", "dojo/_base/connect", "esri/toolbars/draw", "esri/SnappingManager", "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/graphic", "esri/tasks/LengthsParameters", "dojo/touch", "esri/tasks/AreasAndLengthsParameters",
    "esri/tasks/BufferParameters", "esri/tasks/DistanceParameters", "esri/symbols/TextSymbol", "esri/symbols/Font", "dojo/_base/Color", "esri/geometry/Point",
    "esri/tasks/query", "esri/toolbars/edit", "esri/geometry/Extent", "dijit/Menu", "dijit/MenuItem", "dijit/MenuSeparator", "dojo/query", "dojo/dom", "dojo/dom-style",
    "dojo/dom-construct", "dojo/dom-class", "dojo/on", "dojo/NodeList-traverse", "dojo/NodeList-manipulate"
 ], function (declare, lang, move, _WidgetBase, _TemplatedMixin, template, GeometryService, mathUtils, GraphicsLayer, keys, Connect, Draw, SnappingManager,
     SimpleLineSymbol, SimpleMarkerSymbol, SimpleFillSymbol, Graphic, LengthsParameters, touch,
    AreasAndLengthsParameters, BufferParameters, DistanceParameters, TextSymbol, Font, Color, Point, Query, Edit, Extent, Menu, MenuItem, MenuSeparator, query,
    dom, domStyle, domConstruct, domClass, on) {

    var fillColor = new Color([255, 255, 0, 0.25]);
    var fillOpacity = 0.5;
    var outlineColor = new Color([255, 255, 0, 1]); //new Color([0, 0, 0, 1]);
    var outlineWidth = 5;
    var outlineOpacity = 1;
    var lineColor = new Color([255, 255, 0, 1]);
    var lineStyle = SimpleLineSymbol.STYLE_SOLID;
    var lineWidth = 5;
    var lineOpacity = 1;
    var textColor = new Color([207, 2, 38]);
    var textOpacity = 1;
    var textSize = "1em";
    var textStyle = Font.STYLE_ITALIC;
    var textWeight = Font.WEIGHT_BOLDER;
    var textVariant = Font.VARIANT_NORMAL;
    var textFamily = "Courier New";
    var toolType;
    var fillOpacity;
    var meas = {};
    // var editToolbar;
    var enabled = false;
    var newText = [];
    var shape;
    var selected;
    jerry = null;
    var ctxMenuForGraphics = new Menu({});
    var outLineLength;
    var lengthParams = new LengthsParameters();
    var map;
    var parcLayer;
    var outPolyLength;
    var outPolyArea;

    return declare("measureWidget", [_WidgetBase, _TemplatedMixin], {

        templateString: template,
        mapRef:null,
        gsvc: null,
        device: null,
        parcelLayer: null,

        postCreate: function () {
            this.inherited(arguments);
            domConstruct.place(this.domNode, this.srcNodeRef.id, "before");

            measureWidget = this;
            map = measureWidget.mapRef;
            parcLayer = measureWidget.parcelLayer;
            gsvc = measureWidget.gsvc;
            device = measureWidget.device;


            geometryServer = new GeometryService(gsvc);
            meas.point = new GraphicsLayer();
            meas.line = new GraphicsLayer();
            meas.poly = new GraphicsLayer();
            meas.text = new GraphicsLayer();
            meas.anno = new GraphicsLayer();
            // editToolbar = new Edit(map);
            tb = new Draw(map);
            map.addLayers([meas.point, meas.line, meas.poly, meas.text, meas.anno]);

            //dojo.keys.copyKey maps to CTRL on windows and Cmd on Mac.
            var snapper = map.enableSnapping({
                snapKey: keys.copyKey
            });
            var lyrinfo = [{
                layer: parcLayer
            }];
            snapper.setLayerInfos(lyrinfo);

            //Run enableCheck when the module is loaded to handle default
            //checkbox states.
            measureWidget.enableCheck(dom.byId("measureYes").checked);

            //Run enableCheck on change of #measureYes
            on(dom.byId("measureYes"), "change", function(){
                measureWidget.enableCheck(dom.byId("measureYes").checked);
            });

            on(dom.byId("uomPointBox"), "change", function () {
                if (dom.byId("uomPointBox").value === "latlon") {
                    dom.byId("gcsPointResult").style.display = "inline";
                    dom.byId("utmPointResult").style.display = "none";
                } else if (dom.byId("uomPointBox").value === "utm") {
                    dom.byId("gcsPointResult").style.display = "none";
                    dom.byId("utmPointResult").style.display = "inline";
                }
            });

            on(meas.poly, "mouse-over", function (evt) {
                selected = evt.graphic;
                ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());
            });
            on(meas.poly, "mouse-out", function (evt) {
                ctxMenuForGraphics.unBindDomNode(evt.graphic.getDojoShape().getNode());
            });

            on(meas.poly, "click", function (evt) {
                selected = evt.graphic;
                ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());
            });

            on(meas.line, "click", function (evt) {
                selected = evt.graphic;
                ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());
            });
            on(meas.point, "click", function (evt) {
                selected = evt.graphic;
                ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());
            });

            on(meas.line, "mouse-over", function (evt) {
                selected = evt.graphic;
                ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());
            });
            on(meas.line, "mouse-out", function (evt) {
                ctxMenuForGraphics.unBindDomNode(evt.graphic.getDojoShape().getNode());
            });

            on(meas.point, "mouse-over", function (evt) {
                selected = evt.graphic;
                ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());
            });
            on(meas.point, "mouse-out", function (evt) {
                ctxMenuForGraphics.unBindDomNode(evt.graphic.getDojoShape().getNode());
            });

            ctxMenuForGraphics.addChild(new MenuSeparator());
            ctxMenuForGraphics.addChild(new MenuItem({
                label: "Delete Graphic",
                onClick: function () {

                    var shape = selected.geometry.type;
                    var clickedExtent = selected.geometry.getExtent();
                    if (shape === 'polygon' || shape === 'polyline') {
                        for (i = 0; i < 2; i++) {
                            meas.text.graphics.forEach(function (graphic) {
                                if (clickedExtent.contains(graphic.geometry)) {
                                    meas.text.remove(graphic);
                                    meas.anno.remove(graphic);
                                }
                            })
                        }
                    } else {
                        var clickedPointExtent = measureWidget._pointToExtent(map, selected.geometry, 10);
                        meas.text.graphics.forEach(function (graphic) {
                            if (clickedPointExtent.contains(graphic.geometry)) {
                                meas.text.remove(graphic);
                                meas.anno.remove(graphic);
                            }
                        })
                    }

                    meas.point.remove(selected);
                    meas.poly.remove(selected);
                    meas.line.remove(selected);
                }
            }));

            ctxMenuForGraphics.startup();

            geometryServer.on("areas-and-lengths-complete", function (result) {
                var output = measureWidget._outputArea(result, outPolyArea, outPolyLength);
                dom.byId("area").innerHTML = output[0];
                dom.byId("length").innerHTML = output[1];
                measureWidget._measurementLabelPoints(areaAndLengthPolyGraphic, measureWidget._createAreaText(result, outPolyArea), measureWidget._createPerimText(result, outPolyLength));
            });

        },

        startup: function () {
            this.inherited(arguments);
        },

        _createAreaText: function(result, outPolyArea){
            return ("Area: " + result.result.areas[0].toFixed(3) + " " + outPolyArea);
        },

        _createPerimText: function(result, outPolyLength){
            return ("Perimeter: " + result.result.lengths[0].toFixed(3) + " " + outPolyLength);
        },

        _outputArea: function (result, outPolyArea, outPolyLength) {
            return [
                (result.result.areas[0].toFixed(3) + " " + outPolyArea),
                (result.result.lengths[0].toFixed(3) + " " + outPolyLength)
            ]
        },

        enableCheck: function (isChecked) {
            if (isChecked === true) {
                query(".showBlock").forEach(function (x) {
                    x.style.display = "inline";
                });
                return 'inline';
            } else {
                query(".showBlock").forEach(function (x) {
                    x.style.display = "none";
                });
                return 'none';
            }
        },

        clearClick: function () {
            meas.point.clear();
            meas.line.clear();
            meas.poly.clear();
            meas.text.clear();
            meas.anno.clear();
            map.infoWindow = aG.popup;
            query(this.gcsPointResult, this.utmPointResult).style("display", "none");
            query("#gcsPointResult, #utmPointResult, #polyResult, #lineResult").children("span.remove").forEach(function (x) {
                domConstruct.empty(x);
            });
        },

        setPoly: function (x) {
            measureWidget._resetButtonBlock(x.target, ['polySeg', x.target.getAttribute("data-set")], "#polyResult, #uomPolyBox, #uomText");
            tb.activate(Draw[(x.target.id).slice(4).toUpperCase()]);
            if (dom.byId("polyResult").style.display === "inline" && dom.byId("uomPolyBox").style.display === "inline" && dom.byId("uomText").style.display === "inline") {
                measureWidget._segments("uomPolyBox", "polysegment", x.target.id);
            }
            toolType = (x.target.id).slice(4);
            meas.del = on(tb, "draw-end", measureWidget._addAreaPoly);
        },

        setLine: function (x) {
            measureWidget._resetButtonBlock(x.target, ['lineSeg', x.target.getAttribute("data-set")], "#lineResult, #uomLineBox");
            tb.activate(Draw[(x.target.id).slice(4).toUpperCase()]);
            if (dom.byId("lineResult").style.display === "inline" && dom.byId("uomLineBox").style.display === "inline") {
                measureWidget._segments("uomLineBox", "segment", x.target.id);
            }
            toolType = (x.target.id).slice(4);
            meas.del = on(tb, "draw-end", measureWidget._addlinegraphic);
        },


        setPoint: function (x) {
            measureWidget._resetButtonBlock(x.target, null, "#uomPointBox");
            tb.activate(Draw[(x.target.id).slice(4).toUpperCase()]);
            toolType = "Point";
            meas.del = on(tb, "draw-end", function (geometry) {
                meas.point.add(new Graphic(geometry.geometry, new SimpleMarkerSymbol().setColor(fillColor)));
                ga('send', 'event', 'measureDrawTool', 'toolUsed', toolType);
                if (dom.byId('measureYes').checked) {
                    measureWidget._getPointLocation(geometry.geometry);
                }
            });
        },

        _resetButtonBlock: function (target, segmentText, inlines) {
            if (segmentText !== null) {
                dom.byId(segmentText[0]).style.display = segmentText[1];
            }
            query("#drawButtonBlock").children("span.drawButton").forEach(function (e) {
                domStyle.set(e, {
                    backgroundColor: "#FFFFFF"
                });
            });
            domStyle.set(target, {
                backgroundColor: "#ABABAB"
            });
            query("#lineResult, #polyResult, #gcsPointResult, #utmPointResult, #uomPolyBox, #uomLineBox, #uomPointBox").forEach(function (x) {
                domStyle.set(x, {
                    display: "none"
                });
            });
            query(inlines).forEach(function (x) {
                domStyle.set(x, {
                    display: "inline"
                });
            });
            query("#gcsPointResult, #utmPointResult, #polyResult, #lineResult").children("span.remove").forEach(function (x) {
                domConstruct.empty(x);
            });
            measureWidget._disconnect();
            parcLayer.infoTemplate = map.infoWindow = "";
            map.setMapCursor("crosshair");
        },

        _disconnect: function () {
            toolType = "";
            tb.deactivate();
            if (meas.del !== undefined) {
                meas.del.remove();
            }
            map.setMapCursor("default");
            map.infoWindow = aG.popup;
            parcLayer.infoTemplate = aG.pTemp;
        },

        _addAreaPoly: function (areaGeometry) {
            var polyGraphic = new SimpleFillSymbol();
            polyGraphic.setColor(fillColor);
            polyGraphic.setOutline(new SimpleLineSymbol(lineStyle, outlineColor, outlineWidth));
            var areaGraphic = new Graphic(areaGeometry.geometry, polyGraphic);
            areaAndLengthPolyGraphic = meas.poly.add(areaGraphic);
            if (dom.byId("measureYes").checked) {
                measureWidget._getAreaAndLength(areaGeometry);
            }
            measureWidget._disconnect();
        },

        _getAreaAndLength: function (areaGeometry) {
            polyUTM = areaGeometry.geometry;
            //setup the parameters for the areas and lengths operation
            var areasAndLengthParams = new AreasAndLengthsParameters();

            if (dom.byId("uomPolyBox").value === "UNIT_ACRES") {
                outPolyLength = "feet";
                outPolyArea = "acres";
                areasAndLengthParams.areaUnit = GeometryService.UNIT_ACRES;
                areasAndLengthParams.lengthUnit = GeometryService.UNIT_FOOT;
            } else if (dom.byId("uomPolyBox").value === "UNIT_SQUARE_MILES") {
                outPolyLength = "miles";
                outPolyArea = "SQ Miles";
                areasAndLengthParams.areaUnit = GeometryService.UNIT_SQUARE_MILES;
                areasAndLengthParams.lengthUnit = GeometryService.UNIT_STATUTE_MILE;
            } else if (dom.byId("uomPolyBox").value === "UNIT_SQUARE_KILOMETERS") {
                outPolyLength = "kilometers";
                outPolyArea = "SQ Kilometers";
                areasAndLengthParams.areaUnit = GeometryService.UNIT_SQUARE_KILOMETERS;
                areasAndLengthParams.lengthUnit = GeometryService.UNIT_KILOMETER;
            } else if (dom.byId("uomPolyBox").value === "UNIT_SQUARE_METERS") {
                outPolyLength = "meters";
                outPolyArea = "SQ MT";
                areasAndLengthParams.areaUnit = GeometryService.UNIT_SQUARE_METERS;
                areasAndLengthParams.lengthUnit = GeometryService.UNIT_METERS;
            } else if (dom.byId("uomPolyBox").value === "UNIT_SQUARE_FEET") {
                outPolyLength = "feet";
                outPolyArea = "SQ FT";
                areasAndLengthParams.areaUnit = GeometryService.UNIT_SQUARE_FEET;
                areasAndLengthParams.lengthUnit = GeometryService.UNIT_FOOT;
            }
            geometryServer.simplify([polyUTM], function (simplifiedGeometries) {
                areasAndLengthParams.polygons = simplifiedGeometries;
                geometryServer.areasAndLengths(areasAndLengthParams);
            });
            return outPolyLength
        },

        _addlinegraphic: function (geometry) {
            ga('send', 'event', 'measureDrawTool', 'toolUsed', toolType);
            meas.line.add(new Graphic(geometry.geometry, new SimpleLineSymbol(lineStyle, lineColor, lineWidth)));
            if (dom.byId('measureYes').checked === true) {
                measureWidget._getLineLength(geometry);
            }
            measureWidget._disconnect();
        },

        _getLineLength: function (geometry) {
            var unit = measureWidget._getlengthunit();
            lengthParams.polylines = [geometry.geometry];
            lengthParams.geodesic = true;

            geometryServer.lengths(lengthParams, function (result) {
                measureWidget._bufferLine(geometry, result, unit);
                measureWidget._outputLine(result, unit);
            });
        },

        _bufferLine: function (geometry, result, outLineLength) {
            var params = new BufferParameters();
            params.geometries = [geometry.geometry];
            params.distances = [1];
            params.unit = BufferParameters.UNIT_FOOT;
            var lineBufferFunction = geometryServer.buffer(params, function (bufferOutput) {
                if (dom.byId("uomLineBox").value === "Yards") {
                    var ydLength = result.lengths[0] / 3;
                    lineText = "Length: " + ydLength.toFixed(1) + " " + outLineLength;
                } else {
                    lineText = "Length: " + result.lengths[0].toFixed(1) + " " + outLineLength;
                }
                geometryServer.labelPoints(bufferOutput, function (labelPoints3) {
                    meas.text.add(new Graphic(labelPoints3[0], new TextSymbol(lineText).setColor(textColor).setFont(new Font(textSize, textStyle, textVariant, textWeight, textFamily)).setOffset(0, 10).setAlign(TextSymbol.ALIGN_MIDDLE)));
                });
            });
        },

        _outputLine: function (result, outLineLength) {
            if (dom.byId("uomLineBox").value == "Yards") {
                result = (result.lengths[0] / 3);
            } else {
                result = result.lengths[0];
            }
            var linelengthOutput = result.toFixed(3) + " " + outLineLength;
            query("#lineLength").text(linelengthOutput)
            delete window.result;
        },

        _getlengthunit: function () {
            if (dom.byId("uomLineBox").value === "Feet") {
                outLineLength = "feet";
                lengthParams.lengthUnit = GeometryService.UNIT_FOOT;
            } else if (dom.byId("uomLineBox").value === "Miles") {
                outLineLength = "miles";
                lengthParams.lengthUnit = GeometryService.UNIT_STATUTE_MILE;
            } else if (dom.byId("uomLineBox").value === "Kilometers") {
                outLineLength = "kilometers";
                lengthParams.lengthUnit = GeometryService.UNIT_KILOMETER;
            } else if (dom.byId("uomLineBox").value === "Meters") {
                outLineLength = "meters";
                lengthParams.lengthUnit = GeometryService.UNIT_METER;
            } else if (dom.byId("uomLineBox").value === "Yards") {
                outLineLength = "yards";
                lengthParams.lengthUnit = GeometryService.UNIT_FOOT;
            }

            return outLineLength
        },

        _pointToExtent: function (map, point, toleranceInPixel) {
            var pixelWidth = map.extent.getWidth() / map.width;
            var toleraceInMapCoords = toleranceInPixel * pixelWidth;
            return new Extent(point.x - toleraceInMapCoords,
                point.y - toleraceInMapCoords,
                point.x + toleraceInMapCoords,
                point.y + toleraceInMapCoords,
                map.spatialReference);
        },

        _measurementLabelPoints: function (coords, areaText, perimText) {
            geometryServer.labelPoints([coords.geometry], function (labelPoint) {
                meas.text.add(new Graphic(labelPoint[0], new TextSymbol(perimText).setColor(textColor).setFont(new Font(textSize, textStyle, textVariant, textWeight, textFamily)).setOffset(0, -10).setAlign(TextSymbol.ALIGN_MIDDLE)));
                meas.text.add(new Graphic(labelPoint[0], new TextSymbol(areaText).setColor(textColor).setFont(new Font(textSize, textStyle, textVariant, textWeight, textFamily)).setOffset(0, 10).setAlign(TextSymbol.ALIGN_MIDDLE)));
            });
        },

        _getPointLocation: function (UTMPoint) {
            require([
                    "esri/SpatialReference", "dojo/query", "dojo/dom-construct"
                ], function (SpatialReference, query, domConstruct) {
                var wgs84 = new SpatialReference({
                        wkid: 4326
                    }),
                    text;
                var uompb = dom.byId("uomPointBox").value;
                if (uompb === "latlon") {
                    dom.byId("gcsPointResult").style.display = "inline";
                    query("#utmPointResult span.remove").forEach(function (i) {
                        domConstruct.empty(i);
                    })
                    var point84 = geometryServer.project([UTMPoint], wgs84, function (result) {
                        point84 = result[0];
                        var lon = point84.x;
                        var lat = point84.y;
                        var firstPoint = new Point(lon, lat);
                        text = firstPoint.y.toFixed(3) + " " + firstPoint.x.toFixed(3);
                        measureWidget._measurementPointText(UTMPoint, text);
                        query("#latResult").text(firstPoint.y.toFixed(3) + " deg");
                        query("#lonResult").text(firstPoint.x.toFixed(3) + " deg");
                    })
                } else if (uompb === "utm") {
                    dom.byId("utmPointResult").style.display = "inline";
                    query("#gcsPointResult span.remove").forEach(function (i) {
                        domConstruct.empty(i);
                    })
                    text = "X: " + UTMPoint.x.toFixed(3) + " Y: " + UTMPoint.y.toFixed(3)
                    measureWidget._measurementPointText(UTMPoint, text);
                    query("#yResult").text(UTMPoint.y.toFixed(3) + " meters");
                    query("#xResult").text(UTMPoint.x.toFixed(3) + " meters");
                }
            });
        },

        _measurementPointText: function (point, text) {
            meas.text.add(new Graphic(point, new TextSymbol(text).setFont(new Font(textSize, textStyle, textVariant, textWeight, textFamily)).setColor(textColor).setOffset(0, 12).setAlign(TextSymbol.ALIGN_START))); //.setFont(textFont.setWeight(textWeight))
            measureWidget._disconnect();
        },

        _segments: function (uomBox, segment, selectedTool) {
            if(selectedTool === "drawPolygon" || selectedTool === "drawPolyline"){
            var jerry = on(map, 'click', function (evt) {
                var factor = [];
                var initpoint = 0;
                var cur = 0;
                var uom = dom.byId(uomBox).value;
                dom.byId(segment).innerHTML = 0;
                if (uom === "Feet" || uom === "UNIT_ACRES" || uom === "UNIT_SQUARE_FEET") {
                    factor = 3.28084;
                    uom = "Feet";
                } else if (uom === "Yards") {
                    factor = 1.09361;
                    uom = "Yards";
                } else if (uom === "Miles" || uom === "UNIT_SQUARE_MILES") {
                    factor = 0.000621371;
                    uom = "Miles";
                } else if (uom === "Kilometers" || uom === "UNIT_SQUARE_KILOMETERS") {
                    factor = 0.001;
                    oum = "Kilometers";
                } else {
                    factor = 1;
                    uom = "Meters";
                }
                initpoint = evt.mapPoint //new Point(evt.mapPoint.x, evt.mapPoint.y)
                function curCoords(evt) {
                    cur = evt.mapPoint;
                    dom.byId(segment).innerHTML = ((mathUtils.getLength(initpoint, cur)) * factor).toFixed(3) + " " + uom;
                }
                var tom = on(map, "mouse-move", curCoords)
                on(map, 'dbl-click', function () {
                    tom.remove();
                });
                var speedy = on(query("#drawPoint,#drawPolygon,#drawRectangle,#drawFreehand_polygon,#drawCircle"), 'click', function () {
                    if (jerry) {
                        jerry.remove();
                        speedy.remove();
                    }
                })
            })
            }else{
             return undefined
            }
        }
    }); //end of declare
}); //end of define
