init(); // initialize the map viewer

function init() {
    //Global namespaces for handling non-local variables
    aG = {}; //Global application object
    lmG = {}; //Global Layer Management object
    require([
        "esri/config", "dojo/on", "dojo/dom-construct", "dojo/text!./scripts/_config/config.json", "esri/dijit/Legend",
        "mesa/toolsWidget2" //fix bug requiring toolsWidget to be loaded
    ], function(esriConfig, on, domConstruct, JSONconfig, Legend) {

        /* The JSON configuration file is located in the scripts/_config directory.
        It contains urls for geometryService, print service and proxy. It also
        contains the imageServer url and a list of image service names and ids used
        to build the imagery layers for the app. */
        var JSONconfig = JSON.parse(JSONconfig);

        // Check if the site is being requested from a mobile or desktop device. then
        // set the map's popup accordingly.
        aG.popup = checkForMobile() === 1? setPopup("mobile", "popup"): setPopup("static", "popup");
        var device = aG.popup.domNode.className === 'esriPopupMobile'? 'mobile': 'desktop';

        // Set esriConfig variables
        esriConfig.defaults.io.proxyUrl = JSONconfig.proxyURL;
        esriConfig.defaults.io.alwaysUseProxy = false;
        esriConfig.defaults.geometryService = createGeometryService(JSONconfig.geometryService);

        document.dojoClick = false;
        // Set the spatial reference to 102206 for UTM zone 12
        var utm12 = setSpatialRef(102206);
        // See the setInitialExtent function for actual extent bounds
        var initExtent = setInitialExtent(utm12, device);
        // Create an ESRI map component
        aG.map = createMap(initExtent, aG.popup);
        // Initialize the popup for when parcels are clicked
        aG.pTemp = createPopupTemplate();
        // Create 3 layers to be initially added to the map
        lmG.pLay = createFeatureLayer(
            "https://mcgis.mesacounty.us/arcgis/rest/services/maps/ParcelOnly4Query/MapServer/0",
            aG.pTemp,
            ["LOCATION","ACCOUNTNO","OWNER","JTOWNER","SDATE","PARCEL_NUM","ZONING","Acres","JURISDICTION"]
            );
        lmG.roadLabels = createTiledMapServiceLayer("https://mcgis.mesacounty.us/image/rest/services/Mosaic_Datasets/Basemap_Labels/MapServer", "roadLabels");
        // Set a reference to the initial basemap. This is passed to the
        // basemapWidget module where it can be changed.
        var initialBasemap = createTiledMapServiceLayer("https://mcgis.mesacounty.us/image/rest/services/Mosaic_Datasets/Basemap_Background/MapServer", "vectorBasemap");

        // Add the initial basemap, labels and parcel layer to the map
        aG.map.addLayers([initialBasemap, lmG.pLay, lmG.roadLabels]);
        aG.map.on("load", function() {
            /* Once the map is loaded, initialize the following map components,
            check the url for parameters, register event handlers for the map,
            stop the loading icon from displaying and disable keyboard navigation
            for the ESRI api map. */
            createScalebar(aG.map);
            createContextMenu(aG.map, JSONconfig.geometryService);

            /*Create a dom node to hold the legend. Create a new legend object,
            then call runToolsView which will configure the legend*/
            var node = domConstruct.toDom("<div data-to='mainSideMenu' class='displayNo legendMenu' id='legendDiv'></div>");
            domConstruct.place(node, document.getElementById('map'), 'before');

            var legend = new Legend({
                map: aG.map,
            }, node);

            createHomeButton(aG.map);
            setEventHandlers(JSONconfig, aG.map, lmG.pLay, initialBasemap,
                lmG.roadLabels, aG.popup, aG.pTemp, legend);
            document.getElementById("loading").style.display = "none";
            aG.map.disableKeyboardNavigation();
            /*watches for variables in the url then runs urlMapType
            if it finds one*/

            JSONconfig.parcelTemplate = aG.pTemp;
            JSONconfig.popupTemplate = aG.popup;

            if ((location.href).indexOf("?") > -1) {
                urlMapType(location.href, aG.map, legend, initialBasemap, JSONconfig, device, lmG.pLay);
            } else {
                runToolsView(JSONconfig, aG.map, device,
                    aG.popup, aG.pTemp, legend, initialBasemap, lmG.pLay);
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
        on(dom.byId("locate"), touch.release, function(){
            showLocator(JSONconfig.geometryService, map)
        });
        on(query(".submen li, .submenu li"), touch.release, function() {
            showDropdownMenu.call(this, undefined, 'none');
        });
        on(query("#combobox, #mainfish"), "mouseenter, mouseleave, touchstart", function(e) {
            showDropdownMenu.call(this, e);
        });
    });
}

function showDropdownMenu(e, display){
    /*On mouse enter or click, display the dropdown. On mouse leave,
    remove the dropdown.*/
    require(['dojo/query'], function(query){
        if(display === undefined){
            display = e.type === "mouseleave"? "none": "block";
            classname = "." + query("#" + this.id + " ul")[0].className;
        }else{
            classname = "." + this.parentNode.className;
        }
        query(classname)[0].style.display = display;
    }.bind(this));
}

function createTiledMapServiceLayer(url, id) {
    var tile;
    require(["esri/layers/ArcGISTiledMapServiceLayer"], function(ArcGISTiledMapServiceLayer) {
        tile = new ArcGISTiledMapServiceLayer(url, {id: id});
    });
    return tile;
}

function createFeatureLayer(url, template, fields) {
    var service;
    require(["esri/layers/FeatureLayer"], function(FeatureLayer) {
        service = new FeatureLayer(url, {
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: template,
            outFields: fields
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
            description: "<b>Account number:</b>  <a href='https://emap.mesacounty.us/assessor_lookup/Assessor_Parcel_Report.aspx?Account={ACCOUNTNO}'" + "target='_blank'>{ACCOUNTNO}</a><br><b>Parcel Number:</b> {PARCEL_NUM}<br><b>Owner:</b>  {OWNER}<br><b>Joint Owner:</b>  {JTOWNER}<br><b>Address:</b>" + "{LOCATION}<br><b>Sale Date:</b>" + " {SDATE}<br>" + "<b>Zoning:</b> {ZONING}<br><b>Approximate Acres:</b> {Acres}<br><b>Jurisdiction: </b>{JURISDICTION}<br>" + "<div id='mapButtons'>" +
            "<a title='Click to view parcel in Google Earth' class='maplink' target='_blank' href='https://emap.mesacounty.us/kmls?acct={ACCOUNTNO}'>Google Earth</a>" + "<a title='Click to view parcel in Bing Maps' class='maplink' target='_blank' href='https://www.bing.com/maps/?mapurl=https://emap.mesacounty.us/kmls?acct={ACCOUNTNO}'>Bing Maps</a></div><br>"
        });
    });
    return temp;
}

function createMap(initExtent, popup) {
    var map;
    require(["esri/map"], function(Map) {
        map = new Map("map", {
            extent: initExtent,
            logo: false,
            infoWindow: popup
        });
    });
    return map;
}

function setInitialExtent(spatialRef, device) {
    var ext;
    var xmin = device === 'mobile'? 697373: 685960;
    var ymin = device === 'mobile'? 4322305: 4316261;
    var xmax = device === 'mobile'? 726312: 738288;
    var ymax = device === 'mobile'? 4335072: 4342506;
    require(["esri/geometry/Extent"], function(Extent) {
        ext = new Extent({"xmin": xmin, "ymin": ymin, "xmax": xmax, "ymax": ymax, "spatialReference": spatialRef});
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

function setPopup(type, popupNode) {
    /* Set the popup type depending on whether the requesting device is
    mobile or desktop*/
    var pop;
    if (type === "mobile") {
        require(["dojo/dom", "esri/dijit/PopupMobile"], function(dom, PopupMobile) {
            pop = PopupMobile(null, dom.byId(popupNode));
        }); //end require
    } else {
        require(["dojo/dom", "esri/dijit/Popup"], function(dom, Popup) {
            pop = Popup({
                titleInBody: false
            }, dom.byId(popupNode));
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
                    return window.matchMedia("only screen and (max-width: 1024px)").matches// && has("touch")
                        ? true: false;
                });
            } else {
                return window.matchMedia("only screen and (max-width: 1024px)").matches// && has("touch")
                    ? true: false;
            }
        });
        isMobile = has('mobile')? 1: 0;
    }); //end require
    return isMobile;
}

function runToolsView(config, map, device,
    popupObject, popupTemplateObject, legendObj, initialBasemap, parcels) {
    require([
        "dijit/registry", "mesa/toolsWidget2"
    ], function(registry, toolsWidget) {
        if (!(registry.byId("toolsView2"))) {
            var tools = new toolsWidget({
                geometryServiceURL: config.geometryService,
                printURL: config.printURL,
                imageList: config.imagesList,
                mapRef: map,
                basemap: initialBasemap,
                deviceUsed: device,
                popupRef: popupObject,
                popupTemplateRef: popupTemplateObject,
                legendRef: legendObj,
                parcelLayer: parcels
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

function createHomeButton(map) {
    require(["mesa/homeButton"], function(homeButton) {
        homeButton({mapRef: map});
    });
}

function createContextMenu(map, geometryServiceConfig) {
    require(["mesa/contextMenuWidget"], function(contextMenuWidget) {
      //layer 26 of eSurveyor is the trs sections layer
        contextMenuWidget({mapRef: map, geometryServiceURL: geometryServiceConfig, trsURL: "https://mcgis.mesacounty.us/arcgis/rest/services/maps/eSurveyor/MapServer/26"});
    });
}

function createScalebar(map) {
    require(["esri/dijit/Scalebar"], function(Scalebar) {
        var scalebar = new Scalebar({map: map, attachTo: "bottom-right", scalebarUnit: "dual"});
    }); //end require
}

function showLocator(geometryServiceURL, map) {
    require([
        "mesa/locatorWidget", "dojo/dom", "dojo/on", "dijit/registry"
    ], function(locatorWidget, dom, on, registry) {
        var locate = new locatorWidget({mapRef: map, gsvc: geometryServiceURL, device: "desktop"});
        locate.startup();
    });
}


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

function urlMapType(url, map, legend, initialBasemap, config, device, parcels) {
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
        "dojo/NodeList-manipulate"
    ], function(urlUtils, query, domAttr, array) {
        var urlParams = parseParameters(url);
        function parseParameters(url) {
            var queryObject = urlUtils.urlToObject(url).query;
            if (queryObject) {
                var params = {};
                for(var key in queryObject){
                    if(queryObject.hasOwnProperty(key)){
                        if(key === 'cbxid'){
                            params[key] = queryObject[key].split(",");
                        } else if (key === 'PARCEL_NUM'){
                            params[key] = queryObject[key].replace(/-/g, "");
                        } else if (key in ['field', 'ACCOUNTNO']){
                            params[key] = queryObject[key].ToUpperCase();
                        }else{
                            params[key] = queryObject[key];
                        }
                    }
                }
                var title = queryObject.maptype
                    ? createTitle(queryObject.maptype)
                    : 'Select Map';
                function createTitle(map_type) {
                    return query("#layerSelect ul li[data-value='" + map_type + "']").children('a').innerHTML()
                }
                params['title'] = title;
            }
            return params;
        }

        function maptypeFound(type) {
            require(["mesa/themeTools"], function(themeTools){
                themeTools.getTemplate(type);
            });
            return type;
        }

        function runQuery(layerid, field, value, service) {
            require([
                "esri/tasks/QueryTask", "esri/tasks/query", "esri/graphic", "mesa/graphicsTools"
            ], function(QueryTask, Query, Graphic, graphicsTools) {
                var graphicTool = new graphicsTools({geometryServiceURL: esriConfig.defaults.geometryService, mapRef: map});
                var dQueryTask = new QueryTask("https://mcgis.mesacounty.us/arcgis/rest/services/maps/" + service + "/MapServer/" + layerid);
                var dQuery = new Query();
                dQuery.returnGeometry = true;
                dQuery.outFields = [""];
                dQuery.where = field + " = '" + value + "'";
                dQueryTask.execute(dQuery, function(result) {
                    map.setExtent((map.graphics.add(new Graphic(graphicTool.createJSONPolygon(result.features[0].geometry.rings)))).geometry.getExtent().expand(1.5));
                });
            });
        }

            require([
                "dijit/registry", "mesa/toolsWidget2", "mesa/searchTools"
            ], function(registry, toolsWidget, searchTools) {
                var components = {
                    pVal: urlParams.title,
                    checkboxid: urlParams.cbxid
                }
                if (registry.byId("toolsView2")) {
                    (registry.byId("toolsView2").destroyRecursive());
                }

                //If no maptype is passed in the url, default to eassessor
                urlParams.maptype = urlParams.title === 'Select Map'?
                    'eassessor': urlParams.maptype;

                    var tools = new toolsWidget({
                        geometryServiceURL: config.geometryService,
                        printURL: config.printURL,
                        imageList: config.imagesList,
                        mapRef: map,
                        basemap: initialBasemap,
                        deviceUsed: device,
                        popupRef: config.popupTemplate,
                        popupTemplateRef: config.parcelTemplate,
                        legendRef: legend,
                        parcelLayer: parcels
                    }, "toolsView2");

                    tools.dispatchThemeMenuClick(urlParams.maptype, components);

                    if(urlParams.ACCOUNTNO !== undefined){
                        searchTools.searchBy("account", urlParams.ACCOUNTNO);
                    }
                    if(urlParams.PARCEL_NUM !== undefined){
                        searchTools.searchBy("parcelNo", urlParams.PARCEL_NUM);
                    }
                    if(urlParams.EXTENT !== undefined){
                        map.setExtent(extentZoom(urlParams.EXTENT));
                    }
                    if(urlParams.latlon !== undefined){
                        searchTools.searchBy("Latitude/Longitude", urlParams.latlon);
                    }
                    if(urlParams.field !== undefined){
                        runQuery(urlParams.layerid, urlParams.field, urlParams.value, urlParams.service);
                    }

                    if(urlParams.maptype !== undefined){
                        maptypeFound(urlParams.maptype);
                    }

            }); //end require
}); //end require
}
