init(); // initialize the map viewer

function init() {
    //Global namespaces for handling non-local variables
    aG = {}; //Global application object
    lmG = {}; //Global Layer Management object
    require([
        "esri/config", "dojo/on", "dojo/dom-construct", "dojo/text!./scripts/_config/config.json", "esri/dijit/Legend", "mesa/toolsWidget2" //fix bug requiring toolsWidget to be loaded
    ], function(esriConfig, on, domConstruct, JSONconfig, Legend) {

        /* The JSON configuration file is located in the scripts/_config directory.
        It contains urls for geometryService, print service and proxy. It also
        contains the imageServer url and a list of image service names and ids used
        to build the imagery layers for the app. */
        JSONconfig = JSON.parse(JSONconfig);

        // Check if the site is being requested from a mobile or desktop device. then
        // set the map's popup accordingly.
        aG.popup = checkForMobile() === 1? setPopup("mobile"): setPopup("static");

        // Set esriConfig variables
        esriConfig.defaults.io.proxyUrl = JSONconfig.proxyURL;
        esriConfig.defaults.io.alwaysUseProxy = false;
        esriConfig.defaults.geometryService = createGeometryService(JSONconfig.geometryService);

        document.dojoClick = false;
        // Set the spatial reference to 102206 for UTM zone 12
        var utm12 = setSpatialRef(102206);
        // See the setInitialExtent function for actual extent bounds
        var initExtent = setInitialExtent(utm12);
        // Create an ESRI map component
        aG.map = createMap(initExtent);
        // Initialize the popup for when parcels are clicked on
        aG.pTemp = createPopupTemplate();
        // Create 3 layers to be initially added to the map
        lmG.pLay = createFeatureLayer("http://mcmap2.mesacounty.us/arcgis/rest/services/maps/ParcelOnly4Query/MapServer/0");
        lmG.roadLabels = createTiledMapServiceLayer("http://mcmap2.mesacounty.us/arcgis/rest/services/maps/parcel_road_labels/MapServer", "roadLabels");
        lmG.vectorBasemap = createTiledMapServiceLayer("http://mcmap2.mesacounty.us/arcgis/rest/services/maps/vector_basemap/MapServer", "vectorBasemap");
        // Set a reference to the initial basemap. This is passed to the
        // basemapWidget module where it can be changed.
        var initialBasemap = lmG.vectorBasemap;

        // Add the initial basemap, labels and parcel layer to the map
        aG.map.addLayers([lmG.vectorBasemap, lmG.pLay, lmG.roadLabels]);
        aG.map.on("load", function() {
            /* Once the map is loaded, initialize the following map components,
            check the url for parameters, register event handlers for the map,
            stop the loading icon from displaying and disable keyboard navigation
            for the ESRI api map. */
            createScalebar(aG.map);
            createContextMenu(aG.map, JSONconfig.geometryService);


            // var legend = createLegend(aG.map, aG.popup.domNode.className);
            var node = domConstruct.toDom("<div data-to='mainSideMenu' class='displayNo legendMenu' id='legendDiv'></div>");
            domConstruct.place(node, document.body, 'after')
            var legend = new Legend({
                map: aG.map,
            }, node);

            runToolsView(JSONconfig.geometryService, JSONconfig.printURL, aG.map,
                aG.popup, aG.pTemp, legend);


            createHomeButton(aG.map);
                setEventHandlers(JSONconfig, aG.map, lmG.pLay, initialBasemap,
                lmG.roadLabels, aG.popup, aG.pTemp, legend);
            document.getElementById("loading").style.display = "none";
            aG.map.disableKeyboardNavigation();
            /*watches for variables in the url then runs urlMapType
            if it finds one*/
            if ((location.href).indexOf("?") > -1) {
                urlMapType(location.href, aG.map, legend);
            } else {
                return undefined;
            }
        });
    }); //end require
} //end of init function

function setEventHandlers(JSONconfig, map, parcelLayerObject, initialBasemap,
    roadLabels, popupObject, popupTemplateObject, legendObject) {
    require([
        "dojo/on", "dojo/query", "dojo/dom", "dojo/touch", "mesa/themeTools"
    ], function(on, query, dom, touch, themeTools) {
        window.addEventListener("orientationchange", orientationChanged, false);
        map.on("mouse-move", function(e){
            showCoords(e, "screenCoordinatesUTM");
        });
        on(dom.byId("menuSelect"), "click", function(legendObject) {
            runToolsView();
        });
        on(dom.byId("help"), touch.release, function(e) {
            showHelp(e, JSONconfig.printURL);
        });
        on(dom.byId("shareMap"), touch.release, function(){
            showShareForm(map);
        });
        // on(query("#DTLegend, #legendDialog > .dialogHeader > .dialogCloser"), touch.release, function() {
        //     toggleDialog("legendDialog");
        // });
        on(query("#DTprint"), touch.release, function() {
            showPrinter(map, JSONconfig.printURL);
        });
        on(query("#DTbookmarks"), touch.release, function(){
            showBookmarks(map);
        });
        on(query("#DTqueryatts"), touch.release, function() {
            showQuery(map, JSONconfig.geometryService);
        });
        on(query("#DTmeasure"), touch.release, function() {
            showMeasure(map, parcelLayerObject, JSONconfig.geometryService);
        });
        on(query("#DTbasemap,#IPbasemap"), touch.release, function() {
            showBasemap(map, JSONconfig.imagesList, initialBasemap);
        });
        on(query(".shareClass, #sharebutton"), touch.release, function(){
            showShare("socialShare");
        });
        on(query('#layerSelect ul li'), touch.release, function(e){

            themeTools.themeClick(e, this, map, popupObject, popupTemplateObject, legendObject);
        });
        on(query('.plus'), touch.release, clickPlus);
        on(query('.baselyrs'), "click", function(e){
            baseLayersSwitch(e, parcelLayerObject, initialBasemap, roadLabels);
        });
        // on(query(".collapsedPanel"), touch.release, animatePanel);
        on(dom.byId("hidePanel"), "click", themeTools.animatePanel);
        on(dom.byId("locate"), touch.release, function(){
            showLocator(JSONconfig.geometryService)
        });
        on(query(".submen li, .submenu li"), touch.release, function() {
            var classname = "." + this.parentNode.className;
            query(classname)[0].style.display = "none";
        });
        on(query("#combobox, #mainfish"), "mouseenter, mouseleave, touchstart", function(e) {
            var display = e.type === "mouseleave"? "none": "block";
            var classname = "." + query("#" + this.id + " ul")[0].className;
            query(classname)[0].style.display = display;
        });

        on(query('#searchLI ul li'), touch.release, function(e) {
            e.stopPropagation();
            var type = this.getAttribute('data-value');
            dom.byId("searchLI").childNodes[0].nodeValue = this.childNodes[0].innerHTML;
            require(["dijit/registry", "mesa/searchTools"], function(registry, searchTools) {
                if (registry.byId("searchFieldDialog"))
                    (registry.byId("searchFieldDialog").destroyRecursive());
                searchTools.searchBy(type, undefined, "desktop");
            }); //End require
        });
    });
}

function createTiledMapServiceLayer(url, id) {
    var tile;
    require(["esri/layers/ArcGISTiledMapServiceLayer"], function(ArcGISTiledMapServiceLayer) {
        tile = new ArcGISTiledMapServiceLayer(url, {id: id});
    });
    return tile;
}

function createFeatureLayer(url) {
    var service;
    require(["esri/layers/FeatureLayer"], function(FeatureLayer) {
        service = new FeatureLayer(url, {
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: aG.pTemp,
            outFields: [
                "LOCATION",
                "ACCOUNTNO",
                "OWNER",
                "JTOWNER",
                "SDATE",
                "PARCEL_NUM",
                "ZONING",
                "Acres",
                "JURISDICTION"
            ]
        });
    });
    return service;
}

function createGeometryService(serviceURL) {
    var service;
    require(["esri/tasks/GeometryService"], function(GeometryService) {
        service = new GeometryService(serviceURL);
    });
    return service;
}

function createPopupTemplate() {
    var temp;
    require(["esri/dijit/PopupTemplate"], function(PopupTemplate) {
        temp = new PopupTemplate({
            fieldInfos: [
                {
                    fieldName: "Acres",
                    visible: true,
                    format: {
                        places: 2
                    }
                }
            ],
            title: "<b>Parcel Information:</b>",
            description: "<b>Account number:</b>  <a href='http://emap.mesacounty.us/assessor_lookup/Assessor_Parcel_Report.aspx?Account={ACCOUNTNO}'" + "target='_blank'>{ACCOUNTNO}</a><br><b>Parcel Number:</b> {PARCEL_NUM}<br><b>Owner:</b>  {OWNER}<br><b>Joint Owner:</b>  {JTOWNER}<br><b>Address:</b>" + "{LOCATION}<br><b>Sale Date:</b>" + " {SDATE}<br>" + "<b>Zoning:</b> {ZONING}<br><b>Approximate Acres:</b> {Acres}<br><b>Jurisdiction: </b>{JURISDICTION}<br>" + "<div id='mapButtons'>" +
            //"<a title='Click to view parcel in Google Maps' class='maplink' target='_blank' href='http://maps.google.com/maps?t=h&q=http://emap.mesacounty.us/kmls?acct={ACCOUNTNO}'>Google Maps</a>" +
            "<a title='Click to view parcel in Google Earth' class='maplink' target='_blank' href='http://emap.mesacounty.us/kmls?acct={ACCOUNTNO}'>Google Earth</a>" + "<a title='Click to view parcel in Bing Maps' class='maplink' target='_blank' href='http://www.bing.com/maps/?mapurl=http://emap.mesacounty.us/kmls?acct={ACCOUNTNO}'>Bing Maps</a></div><br>"
        });
    });
    return temp;
}

function createMap(initExtent) {
    var map;
    require(["esri/map"], function(Map) {
        map = new Map("map", {
            extent: initExtent,
            logo: false,
            infoWindow: aG.popup
        });
    });
    return map;
}

function setInitialExtent(spatialRef) {
    var ext;
    require(["esri/geometry/Extent"], function(Extent) {
        ext = new Extent({"xmin": 685960, "ymin": 4316261, "xmax": 738288, "ymax": 4342506, "spatialReference": spatialRef});
    });
    return ext;
}

function setSpatialRef(wkid) {
    var ref;
    require(["esri/SpatialReference"], function(SpatialReference) {
        ref = new SpatialReference({wkid: wkid});
    });
    return ref;
}

function setPopup(type) {
    /* Set the popup type depending on whether the requesting device is
    mobile or desktop*/
    var pop;
    if (type === "mobile") {
        require(["dojo/dom", "esri/dijit/PopupMobile"], function(dom, PopupMobile) {
            pop = PopupMobile(null, dom.byId('popup'));
        }); //end require
    } else {
        require(["esri/dijit/Popup"], function(Popup) {
            pop = Popup({
                titleInBody: false
            }, document.getElementById('popup'));
        }); //end else require
    }
    return pop;
}

function checkForMobile() {
    var isMobile;
    require([
        "dojo/has", "dojo/sniff"
    ], function(has, sniff) {
        has.add("mobile", function(global, document, anElement) {
            if (has("ie")) {
                require(["libs/matchMedia"], function() {
                    return window.matchMedia("only screen and (max-width: 1024px)").matches && has("touch")
                        ? true: false;
                });
            } else {
                return window.matchMedia("only screen and (max-width: 1024px)").matches && has("touch")
                    ? true: false;
            }
        });
        isMobile = has('mobile')? 1: 0;
    }); //end require
    return isMobile;
}

function runToolsView(geometryService, printURL, map,
    popupObject, popupTemplateObject, legendObj) {
    require([
        "dijit/registry", "mesa/toolsWidget2"
    ], function(registry, toolsWidget) {
        if (!(registry.byId("toolsView2"))) {
            var tools = new toolsWidget({
                geometryServiceURL: geometryService,
                printURL: printURL,
                mapRef: map,
                popupRef: popupObject,
                popupTemplateRef: popupTemplateObject,
                legendRef: legendObj
            }, "toolsView2");
            registry.byId("toolsView2").domNode.style.display = "none"
        } else {
            if(registry.byId("toolsView2").domNode.style.display === "block"){
                registry.byId("toolsView2").domNode.style.display = "none";
            }else{
            registry.byId("toolsView2").domNode.style.display = "block";
        }
        }
    }); //end require
}

function orientationChanged() {
    require(["dojo/query"], function(query) {
        if (query(".expandedPanel")[0]) {
            query(".expandedPanel")[0].style.display = "none";
        }
    });
}

function showShare(id) {
    //Toggle the social sharing tools UI
        document.getElementById(id).style.display = document.getElementById(id).style.display === "block"
            ? "none": "block";
}

function makeBoxesMoveable() {
    //Make dialog boxes moveable
    require([
        "dojo/dnd/move", "dojo/query", "dojo/dom"
    ], function(move, query, dom) {
        for (i = 0, len = query(".moveableDialog"); i < len.length; i++) {
            move.parentConstrainedMoveable(dom.byId(len[i].id), {
                handle: query("#" + len[i].id + " > header"),
                area: "margin",
                within: true
            });
        }

        new move.parentConstrainedMoveable(dom.byId("popup"), {
            handle: dom.byId("popup"),
            area: "margin",
            within: !0
        });
    });
}

function createHomeButton(map) {
    require(["mesa/homeButton"], function(homeButton) {
        homeButton({mapRef: map});
    });
}

function createContextMenu(map, geometryServiceConfig) {
    require(["mesa/contextMenuWidget"], function(contextMenuWidget) {
        contextMenuWidget({mapRef: map, geometryServiceURL: geometryServiceConfig, trsURL: "http://mcmap2.mesacounty.us/arcgis/rest/services/maps/eSurveyor/MapServer/26"});
    });
}

function createImageList(imageConfig) {
    //Add the selected imagery and theme layer to the map
    require(["esri/layers/ArcGISTiledMapServiceLayer"], function(ArcGISTiledMapServiceLayer) {
        for (var x in imageConfig.images) {
            lmG[imageConfig.images[x].imageId] = new ArcGISTiledMapServiceLayer(imageConfig.mapFolder + imageConfig.images[x].serviceName + imageConfig.serverType, {id: imageConfig.images[x].imageId});
        }
    }); // end require
}

function createScalebar(map) {
    require(["esri/dijit/Scalebar"], function(Scalebar) {
        var scalebar = new Scalebar({map: map, attachTo: "bottom-right", scalebarUnit: "dual"});
    }); //end require
}

// function createLegend(map, initialBasemap, popup, button){
//     var leg, legendLayers = [];
//     require(["mesa/legendWidget", "esri/dijit/Legend"], function(legendWidget, Legend) {
//         leg = new Legend({
//                 map: map
//             }, "legendDiv");
//
//         new legendWidget({
//             mapRef: map,
//             defaultBasemap: initialBasemap,
//             popupRef: popup,
//             attachControl: button,
//             legendObject: leg
//         },'legendDialog');
//
//     }); //end require
//     setTimeout(function(){console.log('foo', leg)}, 500)
//     // setTimeout(function(){
//     //     return leg;
//     // }, 500)
// }

// function createLegend(map, device) {
//     var leg, legLayers = [];
//     legLayers.push({
//         layer: lmG.vectorBasemap,
//         title: 'Basemap Layers',
//         hideLayers: [
//             7,12,17,22,23,24,25,26,27,28,32,35,36,37,38,39,50,51
//         ]
//     });
//     require(["esri/dijit/Legend"], function(Legend) {
//         leg = new Legend({
//             map: map,
//             layerInfos: legLayers
//         }, "legendDiv");
//         leg.startup();
//     });
//     if (device === 'esriPopup') {
//         // toggleDialog("legendDialog");
//         // makeBoxesMoveable();
//     }
//     return leg;
// }

function toggleDialog(dialogId) { //fires on click of #DTLegend and #IPLegend - toggles the legend
    require([
        "dojo/dom", "dojo/dom-class"
    ], function(dom, domClass) {
        if (domClass.contains(dom.byId("legendDialog"), "displayNo")) {
            dom.byId("legendDialog").style.display = "block";
            (domClass.remove(dom.byId("legendDialog"), "displayNo"));
        } else {
            dom.byId("legendDialog").style.display = "none";
            (domClass.add(dom.byId("legendDialog"), "displayNo"));
        }
    });
}

//update showPrinter to remove old code after users have replaced code in their cache
function showPrinter(map, printURL) {
    require([
        "mesa/printWidget",
        "dojo/dom-construct",
        "dojo/dom",
        "dojo/on",
        "dijit/registry",
        "dojo/dom-style"
    ], function(printWidget, domConstruct, dom, on, registry, domStyle) {
        if (!(registry.byId("printDialog2"))) {
            var printer = new printWidget({
                printUrl: printURL,
                mapRef: map,
                device: "desktop"
            }, "printDialog2"); //remove the 2 after user caches have been updated
            printer.startup();
        }
        domStyle.set(dom.byId("printDialog2"), { //remove the 2
            display: domStyle.get(dom.byId("printDialog2"), "display") === "block"
                ? "none": "block" //remove the 2
        });
    });
}

function showBookmarks(map) {
    require([
        "dijit/registry", "mesa/bookmarkWidget", "dojo/dom"
    ], function(registry, bookmarkWidget, dom) {

        if (!(registry.byId("bookmarkDialog2"))) { //remove the 2 after user caches have been updated
            var bookmarks = new bookmarkWidget({
                mapRef: map
            }, "bookmarkDialog2");
            bookmarks.startup();
        }

        if (dom.byId("bookmarkDialog2")) { //delete
            dom.byId("bookmarkDialog2").style.display = dom.byId("bookmarkDialog2").style.display === "block"
                ? "none"
                : "block";
        }
    });
}

//update showPrinter to remove old code after users have replaced code in their cache
function showHelp(e, printURL) {
    e.preventDefault();
    require([
        "mesa/helpWidget",
        "dojo/dom-construct",
        "dojo/dom",
        "dojo/on",
        "dijit/registry",
        "dojo/dom-style"
    ], function(helpWidget, domConstruct, dom, on, registry, domStyle) {
        if (dom.byId("helpMenu2") && !(registry.byId("helpMenu2"))) { //remove the 2 after user caches have been updated
            var help = new helpWidget({
                printUrl: printURL,
                device: "desktop"
            }, "helpMenu2"); //remove the 2 after user caches have been updated
            help.startup();
        }
        if (dom.byId("helpMenu2")) { //delete
            domStyle.set(dom.byId("helpMenu2"), { //remove the 2
                display: domStyle.get(dom.byId("helpMenu2"), "display") === "block"
                    ? "none": "block" //remove the 2
            });
        }
    });
}

function showQuery(map, geometryServiceURL) {
    require([
        "dojo/dom", "dijit/registry", "mesa/queryWidget"
    ], function(dom, registry, queryWidget) {
        if (dom.byId("queryDialog2") && !(registry.byId("queryDialog2"))) { //remove the 2 after user caches have been updated
            var queryTool = new queryWidget({
                device: "desktop",
                mapRef: map,
                geometryServiceURL: geometryServiceURL,
                exportURL: "scripts/php/toCSV.php",
                csvOutputLocation: "scripts/php/"
            }, "queryDialog2");
            queryTool.startup();
        }
        if (dom.byId("queryDialog2")) {
            dom.byId("queryDialog2").style.display = dom.byId("queryDialog2").style.display === "block"
                ? "none"
                : "block";
        }
    });
}

function showBasemap(map, imageConfig, initialBasemap) {
    require([
        "dijit/registry", "mesa/basemapWidget"
    ], function(registry) {
        if (!(registry.byId("imagelist2"))) { //remove the 2 after user caches have been updated
            createImageList(imageConfig);
            lmG.imageTool = new basemapWidget({
                mapRef: map,
                device: "desktop",
                initialBasemap: initialBasemap
            }, "imagelist2");
        }
        lmG.imageTool.basemapChanger();
    });
}

function showShareForm(map) {
    require([
        "mesa/shareFormWidget", "dijit/registry", "dojo/dom"
    ], function(shareFormWidget, registry, dom) {
        if (!(registry.byId("shareForm2"))) { //remove the 2 after user caches have been updated
            var shareForm = new shareFormWidget({
                emailServiceUrl: "scripts/php/ShareMail.php",
                mapRef: map
            }, "shareForm2");
            shareForm.startup();
        }
        if (dom.byId("shareForm2")) { //delete
            dom.byId("shareForm2").style.display = dom.byId("shareForm2").style.display === "block"
                ? "none": "block";
        }
    });
}

function showMeasure(map, parcelLayer, geometryService) {
    require([
        "mesa/measureWidget", "dojo/dom", "dojo/on", "dijit/registry"
    ], function(measureWidget, dom, on, registry) {
        if (dom.byId("measureDialog2") && !(registry.byId("measureDialog2"))) { //remove the 2 after user caches have been updated
            var measure = new measureWidget({
                mapRef: map,
                gsvc: geometryService,
                device: "desktop",
                parcelLayer: parcelLayer
            }, "measureDialog2"); //remove the 2 after user caches have been updated
            measure.startup();
        }

        if (dom.byId("measureDialog2")) { //delete
            dom.byId("measureDialog2").style.display = dom.byId("measureDialog2").style.display === "block"
                ? "none"
                : "block";
        }
    });
}

function showLocator(geometryServiceURL) {
    require([
        "mesa/locatorWidget", "dojo/dom", "dojo/on", "dijit/registry"
    ], function(locatorWidget, dom, on, registry) {
        var locate = new locatorWidget({mapRef: aG.map, gsvc: geometryServiceURL, device: "desktop"});
        locate.startup();
    });
}

// function searchBy(type, option, device, turnOff) {
//     var thisFunctionParam = "noPoint";
//     var thisTargetGeometry = "polygon";
//     var thisOutFields = "LOCATION";
//     var thisService = "ParcelOnly4Query/MapServer/0/query";
//     var thisType = "Address";
//     require(["mesa/searchCompleteWidget"], function(searchCompleteWidget) {
//         switch (type) {
//             case "address":
//                 thisTargetGeometry = "point";
//                 thisService = "ParcePointQuery/MapServer/0/query";
//                 break;
//             case "intersection":
//                 thisFunctionParam = "Intersection";
//                 thisTargetGeometry = "point";
//                 thisOutFields = "Intersection";
//                 thisService = "roads_and_intersections/MapServer/0/query";
//                 thisType = "Intersection";
//                 break;
//             case "account":
//                 thisOutFields = "ACCOUNTNO";
//                 thisType = "Account";
//                 break;
//             case "parcelNo":
//                 thisOutFields = "PARCELNUM";
//                 thisType = "Parcel Number";
//                 break;
//             case "subdivision":
//                 thisOutFields = "SUBNAME";
//                 thisService = "eSurveyor/MapServer/13/query";
//                 thisType = "Subdivision";
//                 break;
//             case "place":
//                 thisFunctionParam = "FEATURE_NAME";
//                 thisTargetGeometry = "point";
//                 thisOutFields = "FEATURE_NAME";
//                 thisService = "PlaceNames/MapServer/0/query";
//                 thisType = "Place Name";
//                 break;
//             case "PLSS":
//                 thisOutFields = "TRSM";
//                 thisService = "eSurveyor/MapServer/26/query";
//                 thisType = "Township/Range";
//                 break;
//             case "Latitude/Longitude":
//                 thisFunctionParam = "gcs";
//                 thisTargetGeometry = "point";
//                 thisType = "Latitude/Longitude";
//                 break;
//             default:
//                 alert("This tool has not been implemented");
//         }
//         new searchCompleteWidget({
//             device: device,
//             mapRef: aG.map,
//             type: thisType,
//             service: thisService,
//             where: thisOutFields + " LIKE",
//             outFields: thisOutFields,
//             targetGeom: thisTargetGeometry,
//             functionParam: thisFunctionParam,
//             geometryServiceURL: esriConfig.defaults.geometryService,
//             option: option !== undefined? option: undefined,
//             turnOff: turnOff
//         }, "searchFieldDialog").startup();
//     }); //End require
// } //end searchBy function

////----------------Begin screen coordinate display code---------------------------------------------//
function showCoords(evt, id) {
    document.getElementById(id).innerHTML = ("X=" + evt.mapPoint.x.toFixed(1) + "  " + "Y=" + evt.mapPoint.y.toFixed(1));
}
////----------------End screen coordinate display code---------------------------------------------//

function extentZoom(extentObject) {
    var viewExtent;
    require([
        "esri/geometry/Extent", "esri/SpatialReference"
    ], function(Extent, SpatialReference) {
        var utm12 = new SpatialReference({wkid: 102206});
        var ext = extentObject.split(':');
        var xmini = parseInt(ext[0]),
            ymini = parseInt(ext[1]),
            xmaxi = parseInt(ext[2]),
            ymaxi = parseInt(ext[3]);
        viewExtent = new Extent({"xmin": xmini, "ymin": ymini, "xmax": xmaxi, "ymax": ymaxi, "spatialReference": utm12});
    });
    return viewExtent;
}

//Turns on and off the base layers
function baseLayersSwitch(e, ParcelLayerObject, basemapObject, roadLabelObject) {
    require([
        "dojo/query", "dojo/dom-attr"
    ], function(query, domAttr) {
        var target = e.target? e.target: e.srcElement;
        var thisClassName = domAttr.get(target, "class");
        thisClassName = 'input.' + thisClassName.split(" ").pop();
        var baselayers = query(".expand")[0];
        var box = query(thisClassName);
        var layers = {
            'input.pclcbx': ParcelLayerObject,
            'input.lbsgcbx': basemapObject,
            'input.bgcbx': roadLabelObject
        };
        for (i = 0; i < box.length; i++) {
            box[i].checked = target.checked? true: false;
        }
        if (baselayers.checked) {
            for (var x in layers) {
                if (query(x)[0].checked) {
                    layers[x].show();
                } else {
                    layers[x].hide();
                }
            }
        } else {
            for (var x in layers) {
                layers[x].hide();
            }
        }
    });
}

function clickPlus(e) {
    /* Toggle expansion of the baselayers check boxes on the "Layers" tab
    on the right side of the map. */
    require([
        "dojo/query",
        "dojo/dom-attr",
        "dojo/dom-style",
        "dojo/dom-class",
        "dojo/NodeList-traverse",
        "dojo/NodeList-manipulate"
    ], function(query, domAttr, domStyle, domClass) {
        var cls = domAttr.get(e.target, "class");
        cls = cls.split(" ")[1];
        if("minus" !== cls){
            query(".plus").forEach(function(node) {
                domClass.replace(node, "minus", "plus");
            });
            query(".lyrexpand").children("li").forEach(function(node) {
                domStyle.set(node, "display", "block");
            });
        }else{
            query(".plusSign").forEach(function(node) {
                domClass.replace(node, "plus", "minus");
            });
            query(".lyrexpand").children("li").forEach(function(node) {
                domStyle.set(node, "display", "none");
            });
        }
    });
}

function urlMapType(url, map, legend) {
    /*urlMapType (and its main sub-function parseParameters) is used to parse
    GET requests to the viewer api.
    The api allows control of the map by setting the map theme,
    turning on or off layers (cbxid), passing the layer id of
    the requested REST service, passing the table field name used
    for querying the REST service, passing a query value to REST
    and passing in the name of the REST service to be queried.*/
    require([
        "esri/urlUtils",
        "dojo/query",
        "dojo/NodeList-traverse",
        "dojo/dom-attr",
        "dojo/_base/array",
        "dojo/NodeList-manipulate",
        "mesa/searchTools"
    ], function(urlUtils, query, domAttr, array, searchTools) {
        var urlParams = parseParameters(url);
        function parseParameters(url) {
            var queryObject = urlUtils.urlToObject(url).query;
            if (queryObject) {
                //Check if maptype is passed. If it is, load the theme template
                //and open the theme's layer panel.
                var maptype = queryObject.maptype
                    ? maptypeFound(queryObject.maptype.toLowerCase())
                    : undefined;

                var title = queryObject.maptype
                    ? createTitle(maptype)
                    : 'Select Map';
                function createTitle(map_type) {
                    return query("#layerSelect ul li[data-value='" + map_type + "']").children('a').innerHTML()
                }
                var layerid = queryObject.layerid
                    ? queryObject.layerid
                    : undefined;
                var checkboxid = queryObject.cbxid
                    ? (queryObject.cbxid).toLowerCase().split(",")
                    : undefined;
                var field = queryObject.field
                    ? String(queryObject.field).toUpperCase()
                    : undefined;
                var value = queryObject.value
                    ? queryObject.value
                    : undefined;
                var service = queryObject.service
                    ? queryObject.service
                    : undefined;
                var coordinates = queryObject.latlon
                    ? queryObject.latlon
                    : undefined;
                var accountNumber = queryObject.ACCOUNTNO
                    ? queryObject.ACCOUNTNO.toUpperCase()
                    : undefined;
                var parcelNumber = queryObject.PARCEL_NUM
                    ? queryObject.PARCEL_NUM.replace(/-/g, "")
                    : undefined;
                var extent = queryObject.EXTENT
                    ? queryObject.EXTENT.toUpperCase()
                    : undefined;
                var params = [maptype, title, layerid, value, checkboxid];

                if(coordinates !== undefined){
                    searchTools.searchBy("Latitude/Longitude", coordinates);
                }
                if(field !== undefined){
                    runQuery(layerid, field, value);
                }
                if(accountNumber !== undefined){
                    searchTools.searchBy("account", accountNumber);
                }
                if(parcelNumber !== undefined){
                    searchTools.searchBy("parcelNo", parcelNumber);
                }
                if(extent !== undefined){
                    map.setExtent(extentZoom(extent));
                }
            }

            function maptypeFound(type) {
                require(["mesa/themeTools"], function(themeTools){
                    themeTools.getTemplate(type);
                    themeTools.animatePanel("open");
                });
                // setTimeout(function(){animatePanel("open")}, 400);
                //After loading the theme, return the theme title so it can
                //be displayed on the map.
                return type;
            }

            function runQuery(layerid, field, value) {
                require([
                    "esri/tasks/QueryTask", "esri/tasks/query", "esri/graphic", "mesa/graphicsTools"
                ], function(QueryTask, Query, Graphic, graphicsTools) {
                    var graphicTool = new graphicsTools({geometryServiceURL: esriConfig.defaults.geometryService, mapRef: map});
                    dQueryTask = new QueryTask("http://mcmap2.mesacounty.us/arcgis/rest/services/maps/" + service + "/MapServer/" + layerid);
                    dQuery = new Query();
                    dQuery.returnGeometry = true;
                    dQuery.outFields = [""];
                    dQuery.where = field + " = '" + value + "'";
                    dQueryTask.execute(dQuery, function(result) {
                        map.setExtent((map.graphics.add(new Graphic(graphicTool.createJSONPolygon(result.features[0].geometry.rings)))).geometry.getExtent().expand(1.5));
                    });
                });
            }
            return params;
        }

        if (urlParams[1] !== 'Select Map') {
            require([
                "mesa/changeTheme", "dojo/dom"
            ], function(changeTheme, dom) {
                new changeTheme({
                    newLayer: urlParams[0],
                    layerTitle: urlParams[1],
                    option: urlParams[2],
                    pVal: urlParams[3],
                    mapRef: map,
                    infoWindowRef: aG.popup,
                    infoTemplateRef: aG.pTemp,
                    checkboxid: urlParams[4],
                    mapLegend:legend
                });

            });
        } else {
            return
        }
    }); //end require
}
