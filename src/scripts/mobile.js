require(["dojo/domReady!"], function () {
    var aG = aG || {}; //Global application object
    var lmG = lmG || {}; //Global Layer Management object
    require([
"esri/map",
"esri/dijit/Search",
"dojo/dom",
"esri/tasks/GeometryService",
"esri/SpatialReference",
"esri/layers/FeatureLayer",
"esri/InfoTemplate",
"esri/layers/ArcGISTiledMapServiceLayer",
"esri/geometry/Extent",
"esri/dijit/PopupTemplate",
"esri/dijit/Bookmarks",
"dojo/dom", "dojo/dom-attr", "esri/dijit/PopupMobile",
"dojo/dnd/move", "dojo/query", "dojo/dom-style", "dojo/on", "dojox/mobile/parser", "esri/sniff",
"dijit/registry", "dojox/mobile", "dojox/mobile/deviceTheme",
"dojox/mobile/ToolBarButton", "dojox/mobile/View", "dojox/mobile/Heading", "dojox/mobile/Button",
"dojox/mobile/Accordion", "dojox/mobile/ContentPane", "dojox/mobile/ScrollableView", "dojo/touch", "dojo/dom-construct","dojo/touch", "dojo/domReady!"
], function (
        Map,
        Search,
        dom,
        GeometryService,
        SpatialReference,
        FeatureLayer,
        InfoTemplate,
        ArcGISTiledMapServiceLayer,
        Extent,
        PopupTemplate,
        Bookmarks,
        dom, domAttr,
        MobilePopup,
        move,
        query,
        domStyle,
        on, parser, has, registry, mobile, dTheme, ToolBarButton, View, Heading, Button, Accordion, ContentPane, ScrollableView, touch, domConstruct,touch

    ) {
        parser.parse();
        mobile.hideAddressBar();
        document.dojoClick = false;

        require(["esri/config"], function (esriConfig) {
            esriConfig.defaults.geometryService = "http://mcmap2.mesacounty.us/arcgis/rest/services/Utilities/Geometry/GeometryServer";
        });
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

        aG.map = new Map("map", {
            extent: initExtent,
            logo: false,
            infoWindow: new MobilePopup(null, dom.byId('popup'))
        });

        if (aG.map.loaded) {
            mapLoadHandler({
                "map": aG.map
            });
        } else {
            aG.map.on("load", mapLoadHandler);
        }

    var resizeEvt = (window.onorientationchange !== undefined && !has("android")) ? "orientationchange" : "resize";
    on(window, resizeEvt, resizeMap);

    function resizeMap() {
      mobile.hideAddressBar();
      domStyle.set("map", "height", has('iphone') ? screen.availHeight : window.innerHeight + "px");
      aG.map.resize();
      aG.map.reposition();
    }

    function mapLoadHandler() {
      resizeMap();
//      var symbol = new SimpleMarkerSymbol().setStyle(SimpleMarkerSymbol.STYLE_X).setSize(12);
//      symbol.outline.setWidth(4).setColor("blue");
    }
        
//        aG.resizeMap = function () {
//            mobile.hideAddressBar();
//            adjustMapHeight();
//            aG.map.resize();
//            aG.map.reposition();
//        }
//        
//        registry.byId('mapPage').on('AfterTransitionIn', aG.resizeMap);
//
//        var resizeEvt = (window.onorientationchange !== undefined && !has('android')) ? "orientationchange" : "resize";
//
//        on(window, resizeEvt, aG.resizeMap);
//
//        
//
//        function adjustMapHeight() {
//            var availHeight = (mobile.getScreenSize().h) - (registry.byId("mapPage").domNode.clientHeight - 1);
//            alert(has('iphone'))
//            if (has('iphone') || has('ipod')) {
//                availHeight += iphoneAdjustment();
//            }
//            dom.byId("map").style.height = availHeight + "px";
//        }
//
//        function iphoneAdjustment() {
//            var sz = mobile.getScreenSize();
//            if (sz.h > sz.w) { //portrait
//                //Need to add address bar height back to map because it has not been hidden yet
//                /* 44 = height of bottom safari button bar */
//                return screen.availHeight - window.innerHeight - 44;
//            } else { //landscape
//                //Need to react to full screen / bottom button bar visible toggles
//                var _conn = on(window, 'resize', function () {
//                    _conn.remove();
//                    aG.resizeMap();
//                });
//                return 0;
//            }
//        }

        lmG.roadLabels = new ArcGISTiledMapServiceLayer("http://mcmap2.mesacounty.us/arcgis/rest/services/maps/parcel_road_labels/MapServer", {
            id: "roadLabels"
        });
        lmG.vectorBasemap = new ArcGISTiledMapServiceLayer("http://mcmap2.mesacounty.us/arcgis/rest/services/maps/vector_basemap/MapServer", {
            id: "vectorBasemap"
        });

        //-------------------Begin parcel info window------------------------------------------//

        //aG.pTemp = new PopupTemplate({
        aG.pTemp = new PopupTemplate({
            title: "<b>Parcel Information:</b>",
            description: "<b>Account number:</b>  <a href='http://emap.mesacounty.us/assessor_lookup/Assessor_Parcel_Report.aspx?Account={ACCOUNTNO}'" + "target='_blank'>{ACCOUNTNO}</a><br><b>Parcel Number:</b> {PARCEL_NUM}<br><b>Owner:</b>  {OWNER}<br><b>Joint Owner:</b>  {JTOWNER}<br><b>Address:</b>  {LOCATION}<br><b>Sale Date:</b>" + " {SDATE}<br>" + "<b>Zoning:</b> {ZONING}<br><b>Acres:</b> {Acres}<br><b>Jurisdiction: </b>{JURISDICTION}<br>" + "<div id='mapButtons'>" + "<a title='Click to view parcel in Google Maps' href='http://maps.google.com/maps?t=h&q=http://emap.mesacounty.us/kmls?acct={ACCOUNTNO}'><button data-dojo-type='dojox/mobile/Button'>Google Maps</button></a>"
                //+ "<a title='Click to view parcel in Google Earth' tar href='http://emap.mesacounty.us/kmls?acct={ACCOUNTNO}'><button data-dojo-type='dojox/mobile/Button'>Google Earth</button></a>"
                + "<a title='Click to view parcel in Bing Maps' href='http://www.bing.com/maps/?mapurl=http://emap.mesacounty.us/kmls?acct={ACCOUNTNO}'><button data-dojo-type='dojox/mobile/Button'>Bing Maps</button></a></div>"
        });

        //add parcel layer with attribute fields exposed

        lmG.pLay = new FeatureLayer("http://mcmap2.mesacounty.us/arcgis/rest/services/maps/ParcelOnly4Query/MapServer/0", {
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: aG.pTemp,
            outFields: ["LOCATION", "ACCOUNTNO", "OWNER", "JTOWNER", "SDATE", "PARCEL_NUM", "ZONING", "Acres", "JURISDICTION"]
        });

        aG.map.addLayers([lmG.vectorBasemap, lmG.roadLabels, lmG.pLay]);

        //-------------------------------------------Begin geolocation code-------------------------------------------------------------//

        var locator = function () {
            require(["dojo/dom", "dojo/dom-attr", "dojo/on"], function (dom, domAttr, on) {
                var locateDiv = dom.byId("locateButton");
                on(locateDiv, "click", function (event) {
                    event.preventDefault();

                    domAttr.get(locateDiv, "data-state") === "on" ? startNav() : stopNav();
                });

                function startNav() {
                    require(["dojo/dom-attr"], function (domAttr) {
                        domAttr.set(locateDiv, "data-state", "off")
                        aG.map.graphics.clear();
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(zoomToLocation, locationError, {
                                'enableHighAccuracy': true,
                                'timeout': 20000
                            });
                            watchId = navigator.geolocation.watchPosition(showLocation, locationError, {
                                'enableHighAccuracy': true,
                                'timeout': 20000
                            });
                        } else {
                            alert("Browser doesn't support Geolocation. Visit http://caniuse.com to discover browser support for the Geolocation API.");
                        }
                    });
                }

                function stopNav() {
                    require(["dojo/dom-attr"], function (domAttr) {
                        aG.map.graphics.clear();
                        domAttr.set(locateDiv, "data-state", "on")
                        navigator.geolocation.clearWatch(watchId);
                    });
                }
            });

            function locationError(error) {
                //error occurred so stop watchPosition
                if (navigator.geolocation) {
                    navigator.geolocation.clearWatch(watchId);
                }
                switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("Location not provided");
                    break;

                case error.POSITION_UNAVAILABLE:
                    alert("Current location not available");
                    break;

                case error.TIMEOUT:
                    alert("Timeout");
                    break;

                default:
                    alert("unknown error");
                    break;
                }
            }

            function zoomToLocation(location) {
                //ga('send', 'event', 'Mobile Location', 'Zoom To');
                require([
                "esri/geometry/Point",
                "esri/tasks/GeometryService",
                "esri/SpatialReference"
            ], function (Point, GeometryService, SpatialReference) {
                    var gsvc = new GeometryService("http://mcmap2.mesacounty.us/arcgis/rest/services/Utilities/Geometry/GeometryServer");
                    var wgs84 = new SpatialReference({
                        wkid: 4326
                    });
                    point = new Point(location.coords.longitude, location.coords.latitude, wgs84);
                    gsvc.project([point], utm12, function (result) {
                        var utmGraphicPoint = result[0];
                        addGraphic(utmGraphicPoint);
                        aG.map.centerAndZoom(utmGraphicPoint, 500);
                    });
                });
            }

            function showLocation(location) {
                require([
                "esri/geometry/Point",
                "esri/tasks/GeometryService",
                "esri/SpatialReference"
            ], function (Point, GeometryService, SpatialReference) {
                    //zoom to the users location and add a graphic
                    var gsvc = new GeometryService("http://mcmap2.mesacounty.us/arcgis/rest/services/Utilities/Geometry/GeometryServer");
                    var wgs84 = new SpatialReference({
                        wkid: 4326
                    });
                    //var utm12 = new SpatialReference({ wkid: 102206 });
                    point = new Point(location.coords.longitude, location.coords.latitude, wgs84);
                    gsvc.project([point], utm12, function (result) {
                        var utmGraphicPoint = result[0];
                        aG.map.centerAt(utmGraphicPoint);
                    });

                });
            }

            function addGraphic(pt) {
                require([
                "esri/symbols/SimpleMarkerSymbol",
                "esri/symbols/SimpleLineSymbol",
                "dojo/_base/Color",
                "esri/graphic",
                "esri/geometry/Point"
            ], function (SimpleMarkerSymbol, SimpleLineSymbol, Color, Graphic, Point) {
                    var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 12,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                            new Color([210, 105, 30, 0.5]), 8),
                        new Color([210, 105, 30, 0.9])
                    );
                    graphic = new Graphic(pt, symbol);
                    aG.map.graphics.add(graphic);
                })
            };
        }
        locator();
        
        var fillView = function (id, url) {
            
                require(["dojox/mobile/ProgressIndicator", "dijit/registry", "dojo/request/xhr"], function (ProgressIndicator, registry, xhr) {
                    var view = registry.byId(id); // destination view
                    var prog = ProgressIndicator.getInstance();
                    document.body.appendChild(prog.domNode);
                    prog.start();
                    view.destroyDescendants();

                    xhr(url, {
                        handleAs: "text",
                        preventCache: true
                    }).then(function (response) {
                        var container = view.containerNode;
                        container.innerHTML = response;
                        parser.parse(container);
                        setTimeout(function(){ aG.searchEvents(); }, 5);
                        
                        prog.stop();
                    })
                });
            }
            //Fire off the above fillView function when the tools button is tapped
        require(["dijit/registry", "dojo/dom", "dojo/query", "dojo/on", "dojo/touch"], function (registry, dom, query, on, touch) {
            on(query(".toolsButton"), touch.release, function () {
                if (!(dom.byId("toolsPage").innerHTML.length > 500)) {
                    on(registry.byId('toolsPage'), 'onBeforeTransitionIn', fillView("toolsPage", "_static/tools.html"));
                }
            })
        });
        
        aG.searchEvents = function () {     
            require(["dojo/query", "dojo/on", "dijit/registry", "dojo/dom", "dojo/dom-construct", "dojo/dom-style"], 
                    function (query, on, registry, dom, domConstruct,domStyle) {
                on(dom.byId('searchSelect'), "keyup", function (event) {
//                    var len = dom.byId('searchSelect').value.length;
                    if (this.value.length > 2) {
                        domStyle.set(dom.byId('mainfish'), "display", "block");
                        require(["esri/request"], function (esriRequest) {
                            var request = esriRequest({
                                url: "http://mcmap2.mesacounty.us/arcgis/rest/services/maps/ParcePointQuery/MapServer/0/query",
                                content: {
                                    where: "LOCATION" + " LIKE '%" + dom.byId('searchSelect').value.replace(/\'/g, '\'\'') + "%'", //makes single quotes into double for sql
                                    outFields: "LOCATION",
                                    returnGeometry: true,
                                    f: "pjson"
                                },
                                // Data format
                                handleAs: "json"
                            }).then(requestSucceeded, requestFailed)
                        });
                    } //endIf
                    else {
                        if(!(domStyle.get(dom.byId('mainfish'), "display", "none"))){
                            domStyle.set(dom.byId('mainfish'), "display", "none");
                        }
                            
                    }
                });
                        function requestSucceeded(response) {
                            var features = response.features.slice(0, 13)
                            var mainul = "";
                            for (i = 0; i < features.length; i++) {
                                mainul += "<li data-x='" + features[i].geometry.x + "' data-y='" + features[i].geometry.y + "'>" + features[i].attributes["LOCATION"] + "</li>";
                            }
                            domStyle.set(dom.byId('mainfish'), "display", "block");
                            domConstruct.place(mainul, dom.byId('mainfish'), "only");
                        }

                        function requestFailed(error) {
                            console.log("Error: ", error.message);
                        }

                on(query("#mainfish"), "click", function (e) {
                    var target = e.srcElement ? e.srcElement:event.target;
                    if (target && target.nodeName == "LI") {
                        require(["dojo/dom-attr"], function (domAttr) {
                            zoomToPoint(domAttr.get(target, "data-x"), domAttr.get(target, "data-y"), "noPoint");
                        });
                    }
                        domStyle.set(dom.byId("mainfish"), "display", "none");
                        dom.byId("searchSelect").value = "";
                    changeView("toolsPage", "mapPage"); 
                })
            });
        }
        

        require(["dojo/on", "dojo/touch"], function (on, touch) {
            //The tap.hold dojox gesture does not work with the ESRI api. Here is how you can emulate the tap.hold
            on(dom.byId("map"), touch.press, function (e) {
                //create a setTimeout to fire the result of a long hold event
                var longhold = setTimeout(run, 800)
                    //If the touch is for the purpose of panning the map, clear the setTimeout function
                on(aG.map, "pan-start", function () {
                        clearTimeout(longhold);
                    })
                    //If the touch is for the purpose of zooming the map, clear the setTimeout function
                on(aG.map, "zoom-start", function () {
                        clearTimeout(longhold);
                    })
                    //if the touch is released before the setTimeout miliseconds parameter is up, clear the Timeout
                on(dom.byId("map"), touch.release, function () {
                        clearTimeout(longhold);
                    })
                    //Here is the function that is run if the press is intended to be a long press
                function run() {
                    require(["esri/geometry/ScreenPoint", "dojo/dom-class", "dojo/NodeList-dom"], function (ScreenPoint, domClass, NodeListDom) {
                        var scrnPoint = new ScreenPoint(e.touches[0].pageX, e.touches[0].pageY)
                        var mapPoint = aG.map.toMap(scrnPoint);
                        query("#contextView li:nth-child(1)")[0].innerHTML = "UTM Coordinates: X - " + mapPoint.x + "<br>Y - " + mapPoint.y
                            //registry.byId("mapPage").performTransition("rightContextPanel", 1, "none") //This is one way of doing the transition but is said to not handle more complex views well
                        changeView("mapPage", "contextView")
                    })
                }
            })
        })
    })


    function changeView(fromView, toView) {
        //The transitionEvent is supposed to be a more robust transition handler than performTransition
        require(["dojox/mobile/TransitionEvent", "dijit/registry"], function (TransitionEvent, registry) {
            var contextChange = registry.byId(fromView);
            new TransitionEvent(contextChange.domNode, {
                moveTo: toView,
                transition: "none",
                transitionDir: -1
            }).dispatch();
            resizeMap();
//            aG.resizeMap();
        });
    }

    function zoomToPoint(pointx, pointy, option) {
        require([
            "esri/graphic",
            "esri/geometry/Point",
            "esri/SpatialReference"
    ], function (
            Graphic, Point, SpatialReference
        ) {
            aG.map.graphics.clear();
            var utm12 = new SpatialReference({
                wkid: 102206
            });
            var mapPoint1 = new Point(pointx, pointy, utm12);
            aG.map.centerAndZoom(mapPoint1, 7);
            if (option == "noPoint") { //just select the parcel so the perimeter is highlighted
                require([
        "esri/tasks/query",
        "esri/layers/FeatureLayer"
            ], function (
                    Query, FeatureLayer
                ) {
                    var query = new Query();
                    query.geometry = mapPoint1;
                    //console.log(query.geometry)
                    lmG.pLay.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (parcel) {
                        //console.log(parcel)
                        var parcelObject = parcel[0];
                        aG.map.setExtent((aG.map.graphics.add(new Graphic(createJSONPolygon(parcelObject.geometry.rings)))).geometry.getExtent().expand(1.5));
                    });
                }); //End require
            } else { //add a point graphic to the map and label it
                //aG.map.setExtent(aG.initExtent)
                aG.map.centerAndZoom(mapPoint1, 7);
                addPointToMap(mapPoint1.x, mapPoint1.y, option);
            }
        }); //End zoomToPoint require
    }

    function createJSONPolygon(coords, selector, atts) {
        var frank = String(coords);
        var fixedCoords = frank.replace(/,/g, "],[");
        var fixedCoords2 = fixedCoords.replace(/],\[4/g, ",4");
        var polyColor = [82, 246, 248, 255];
        fixedCoords2 = JSON.parse("[[[" + fixedCoords2 + "]]]");
        if (selector == "subdiv") {
            var newDate = new Date(atts[2]);
            newDate = ((newDate.getMonth() + 1) + "/" + (newDate.getDate() + 1) + "/" + (newDate.getFullYear()));
            aG.map.graphics.clear();
            PolyPost = {
                "geometry": {
                    "rings": fixedCoords2,
                    "spatialReference": {
                        "wkid": 102206
                    }
                },
                "symbol": {
                    "color": [0, 0, 0, 64],
                    "outline": {
                        "color": polyColor,
                        "width": 2,
                        "type": "esriSLS",
                        "style": "esriSLSSolid"
                    },
                    "type": "esriSFS",
                    "style": "esriSFSSolid"
                },
                "attributes": {
                    "reception": atts[0],
                    "subname": atts[1],
                    "recdate": atts[2],
                    "surveyor": atts[3]
                },
                "infoTemplate": {
                    "title": atts[1],
                    "content": "Reception #: ${reception}<br><hr>Recorded Date: " + newDate + "<br><hr>Surveyor: ${surveyor}<br><hr><br><a title='This link will take you through to the Oncore site' target='_blank' href='http://apps.mesacounty.us/oncore/showdetails.aspx?cfn=${reception}'>Click here for subdivision plats</a><br>" +
                        "(<a title='subscription needed' target='_blank' href='http://clerk.mesacounty.us/recording/recorded-documents.aspx'>Login Required</a>)"
                }
            }
        } else if (selector == "noclear") {
            PolyPost = {
                "geometry": {
                    "rings": fixedCoords2,
                    "spatialReference": {
                        "wkid": 102206
                    }
                },
                "symbol": {
                    "color": [0, 0, 0, 64],
                    "outline": {
                        "color": polyColor,
                        "width": 2,
                        "type": "esriSLS",
                        "style": "esriSLSSolid"
                    },
                    "type": "esriSFS",
                    "style": "esriSFSNull"
                }
            }
        } else {
            aG.map.graphics.clear();
            PolyPost = {
                "geometry": {
                    "rings": fixedCoords2,
                    "spatialReference": {
                        "wkid": 102206
                    }
                },
                "symbol": {
                    "color": [0, 0, 0, 64],
                    "outline": {
                        "color": polyColor,
                        "width": 2,
                        "type": "esriSLS",
                        "style": "esriSLSSolid"
                    },
                    "type": "esriSFS",
                    "style": "esriSFSNull"
                }
            }
        }

        return PolyPost;
    }

    function addPointToMap(lon, lat, text) {
        require([
        "esri/graphic",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/geometry/Point",
        "dojo/_base/Color",
        "esri/tasks/GeometryService",
        "esri/SpatialReference"
    ], function (
            Graphic, SimpleMarkerSymbol, Point, Color, GeometryService, SpatialReference
        ) {
            var gsvc = new GeometryService("http://mcmap2.mesacounty.us/arcgis/rest/services/Utilities/Geometry/GeometryServer"),
                wgs84 = new SpatialReference({
                    wkid: 4326
                }),
                utm12 = new SpatialReference({
                    wkid: 102206
                }),
                point;
            if (text == "gcs") {
                text = (lat + ", " + lon);
                point = new Point(lon, lat, wgs84);
                gsvc.project([point], utm12, function (result) {
                    var utmGraphicPoint = result[0];
                    aG.map.graphics.add(new Graphic(utmGraphicPoint, new SimpleMarkerSymbol().setColor(new Color([255, 0, 0, 0.5]))));
                    pointText(utmGraphicPoint, text);
                });
            } else {
                text = text;
                point = new Point(lon, lat, utm12);
                aG.map.graphics.add(new Graphic(point, new SimpleMarkerSymbol().setColor(new Color([255, 0, 0, 0.5]))));
                pointText(point, text);
            }
        });
    }

})