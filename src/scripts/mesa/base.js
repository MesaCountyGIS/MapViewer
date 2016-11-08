define([
"esri/layers/ArcGISTiledMapServiceLayer",
"esri/layers/FeatureLayer",
"esri/tasks/GeometryService",
"esri/dijit/PopupTemplate",
"esri/map",
"esri/geometry/Extent",
"esri/SpatialReference",
"esri/tasks/QueryTask",
"esri/tasks/query",
"esri/graphic",
"mesa/graphicsTools",
"dojo/dom",
"dojo/on",
"esri/dijit/PopupMobile",
"esri/dijit/Popup",
"esri/dijit/Legend"
"dojo/has",
"dojo/sniff",
"dijit/registry",
"mesa/toolsWidget",
"dojo/query",
"dojo/dnd/move",
"mesa/homeButton",
"mesa/contextMenuWidget",
"esri/dijit/Scalebar",
"esri/urlUtils",
"dojo/_base/array",
"dojo/dom-class",
"dojo/dom-construct",
"dojo/dom-style",
"dojo/dom-attr",
"mesa/printWidget",
"mesa/bookmarkWidget",
"mesa/helpWidget",
"mesa/queryWidget",
"mesa/basemapWidget",
"mesa/shareFormWidget",
"mesa/measureWidget",
"mesa/locatorWidget",
"mesa/searchCompleteWidget",
"mesa/changeTheme",
"dojo/NodeList-traverse",
"dojo/NodeList-manipulate",
"libs/matchMedia"

], function (
    ArcGISTiledMapServiceLayer,
    FeatureLayer,
    GeometryService,
    PopupTemplate,
    Map,
    Extent,
    SpatialReference,
    QueryTask,
    Query,
    Graphic,
    graphicsTools,
    dom,
    on,
    PopupMobile,
    Popup,
    Legend,
    has,
    sniff,
    registry,
    toolsWidget,
    query,
    move,
    homeButton,
    contextMenuWidget,
    Scalebar,
    urlUtils,
    array,
    domClass,
    domConstruct,
    domStyle,
    domAttr,
    printWidget,
    bookmarkWidget,
    helpWidget,
    queryWidget,
    basemapWidget,
    shareFormWidget,
    measureWidget,
    locatorWidget,
    searchCompleteWidget,
    changeTheme
) {

    return {

createTiledMapServiceLayer: function(url, id) {
    return new ArcGISTiledMapServiceLayer(url, {id: id});
},


createFeatureLayer: function(url) {
    return new FeatureLayer(url, {
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
},

createGeometryService: function(serviceURL) {
    return service = new GeometryService(serviceURL);
},

createPopupTemplate: function() {
    return temp = new PopupTemplate({
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
},

createMap: function(initExtent) {
    return new Map("map", {
        extent: initExtent,
        logo: false,
        infoWindow: aG.popup
    });
},

setInitialExtent: function(spatialRef) {
    return new Extent({"xmin": 685960, "ymin": 4316261, "xmax": 738288, "ymax": 4342506, "spatialReference": spatialRef});
},

setSpatialRef: function(wkid) {
    return ref = new SpatialReference({wkid: wkid});
},

setPopup: function(type) {
    /* Set the popup type depending on whether the requesting device is
    mobile or desktop*/
    if (type === "mobile") {
        return PopupMobile(null, dom.byId('popup'));
    } else {
        return Popup({
            titleInBody: false
        }, document.getElementById('popup'));
    }
},

checkForMobile: function() {
has.add("mobile", function(global, document, anElement) {
    if (has("ie")) {
            return window.matchMedia("only screen and (max-width: 1024px)").matches && has("touch")
                ? true: false;
    } else {
        return window.matchMedia("only screen and (max-width: 1024px)").matches && has("touch")
            ? true: false;
    }
});
return has('mobile')? 1: 0;
},

runToolsView: function(geometryService, printURL, map) {
    require([
        "dijit/registry", "mesa/toolsWidget"
    ], function(registry, toolsWidget) {
        if (!(registry.byId("toolsView"))) {
            var tools = new toolsWidget({
                geometryServiceURL: geometryService,
                printURL: printURL,
                mapRef: map
            }, "toolsView");
            tools.startup();
            query("#map_zoom_slider, #hidePanel, #rightPanel, .collapsedPanel").style("display", "none");
        } else {
            registry.byId("toolsView").domNode.style.display = "block";
            query("#map_zoom_slider, #hidePanel, #rightPanel, .collapsedPanel").style("display", "none");
        }
    }); //end require
},

orientationChanged: function() {
    query(".expandedPanel")[0].style.display = "none";
},

showShare: function(id) {
    //Toggle the social sharing tools UI
        document.getElementById(id).style.display = document.getElementById(id).style.display === "block"
            ? "none": "block";
},

makeBoxesMoveable: function() {
//Make dialog boxes moveable
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
},

createHomeButton: function(map) {
    homeButton({mapRef: map});
},

createContextMenu: function(map, geometryServiceConfig) {
    contextMenuWidget({mapRef: map, geometryServiceURL: geometryServiceConfig.geometryService, trsURL: "http://mcmap2.mesacounty.us/arcgis/rest/services/maps/eSurveyor/MapServer/26"});
},

createImageList: function(imageConfig) {
    //Add the selected imagery and theme layer to the map
    for (var x in imageConfig.images) {
        lmG[imageConfig.images[x].imageId] = new ArcGISTiledMapServiceLayer(imageConfig.mapFolder + imageConfig.images[x].serviceName + imageConfig.serverType, {id: imageConfig.images[x].imageId});
    }
},

createScalebar: function(map) {
    require(["esri/dijit/Scalebar"], function(Scalebar) {
        var scalebar = new Scalebar({map: map, attachTo: "bottom-right", scalebarUnit: "dual"});
    }); //end require
},

createLegend: function(map, device) {
    lmG.legendLayers.push({
        layer: lmG.vectorBasemap,
        title: 'Basemap Layers',
        hideLayers: [
            7,
            12,
            17,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            32,
            35,
            36,
            37,
            38,
            39,
            50,
            51
        ]
    });

    lmG.legend = new Legend({
        map: map,
        layerInfos: lmG.legendLayers
    }, "legendDiv");
    lmG.legend.startup();

    if (device === 'popup') {
        console.log(this)
        this.toggleDialog("legendDialog");
        this.makeBoxesMoveable();
    }
},

toggleDialog: function(dialogId) { //fires on click of #DTLegend and #IPLegend - toggles the legend
    if (domClass.contains(dom.byId("legendDialog"), "displayNo")) {
        dom.byId("legendDialog").style.display = "block";
        (domClass.remove(dom.byId("legendDialog"), "displayNo"))
    } else {
        dom.byId("legendDialog").style.display = "none";
        (domClass.add(dom.byId("legendDialog"), "displayNo"));
    }
},

//update showPrinter to remove old code after users have replaced code in their cache
showPrinter: function(map, printURL) {
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
},

showBookmarks: function(map) {
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
},

//update showPrinter to remove old code after users have replaced code in their cache
showHelp: function(e, printURL) {
    e.preventDefault();
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
},

showQuery: function(map, geometryServiceURL) {
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
},

showBasemap: function(map, imageConfig, initialBasemap) {
    if (!(registry.byId("imagelist2"))) { //remove the 2 after user caches have been updated
        createImageList(imageConfig);
        lmG.imageTool = new basemapWidget({
            mapRef: map,
            device: "desktop",
            initialBasemap: initialBasemap
        }, "imagelist2");
        lmG.imageTool.startup();
        lmG.imageTool.basemapChanger();
    } else if ((registry.byId("imagelist2"))) {
        lmG.imageTool.basemapChanger();
    }
},

showShareForm: function(map) {
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
},

showMeasure: function(map, parcelLayer, geometryService) {
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
},

showLocator: function(map, geometryService) {
    require([
        "mesa/locatorWidget", "dojo/dom", "dojo/on", "dijit/registry"
    ], function(locatorWidget, dom, on, registry) {
        var locate = new locatorWidget({mapRef: map, gsvc: geometryService, device: "desktop"});
        locate.startup();
    });
},

searchBy: function(map, type, option, device, turnOff) {
    var thisFunctionParam = "noPoint";
    var thisTargetGeometry = "polygon";
    var thisOutFields = "LOCATION";
    var thisService = "ParcelOnly4Query/MapServer/0/query";
    var thisType = "Address";
    switch (type) {
        case "address":
            thisTargetGeometry = "point";
            thisService = "ParcePointQuery/MapServer/0/query";
            break;
        case "intersection":
            thisFunctionParam = "Intersection";
            thisTargetGeometry = "point";
            thisOutFields = "Intersection";
            thisService = "roads_and_intersections/MapServer/0/query";
            thisType = "Intersection";
            break;
        case "account":
            thisOutFields = "ACCOUNTNO";
            thisType = "Account";
            break;
        case "parcelNo":
            thisOutFields = "PARCELNUM";
            thisType = "Parcel Number";
            break;
        case "subdivision":
            thisOutFields = "SUBNAME";
            thisService = "eSurveyor/MapServer/13/query";
            thisType = "Subdivision";
            break;
        case "place":
            thisFunctionParam = "FEATURE_NAME";
            thisTargetGeometry = "point";
            thisOutFields = "FEATURE_NAME";
            thisService = "PlaceNames/MapServer/0/query";
            thisType = "Place Name";
            break;
        case "PLSS":
            thisOutFields = "TRSM";
            thisService = "eSurveyor/MapServer/26/query";
            thisType = "Township/Range";
            break;
        case "Latitude/Longitude":
            thisFunctionParam = "gcs";
            thisTargetGeometry = "point";
            thisType = "Latitude/Longitude";
            break;
        default:
            alert("This tool has not been implemented");
    }

    new searchCompleteWidget({
        device: device,
        mapRef: map,
        type: thisType,
        service: thisService,
        where: thisOutFields + " LIKE",
        outFields: thisOutFields,
        targetGeom: thisTargetGeometry,
        functionParam: thisFunctionParam,
        geometryServiceURL: esriConfig.defaults.geometryService,
        option: option !== undefined
            ? option
            : undefined,
        turnOff: turnOff
    }, "searchFieldDialog").startup();
},

showCoords: function(evt, id) {
    document.getElementById(id).innerHTML = ("X=" + evt.mapPoint.x.toFixed(1) + "  " + "Y=" + evt.mapPoint.y.toFixed(1));
},

extentZoom: function(extentObject) {
    var utm12 = new SpatialReference({wkid: 102206});
    var ext = extentObject.split(':');
    var xmini = parseInt(ext[0]),
        ymini = parseInt(ext[1]),
        xmaxi = parseInt(ext[2]),
        ymaxi = parseInt(ext[3]);
    return new Extent({"xmin": xmini, "ymin": ymini, "xmax": xmaxi, "ymax": ymaxi, "spatialReference": utm12});
},

//Turns on and off the base layers
baseLayersSwitch: function(e, ParcelLayerObject, basemapObject, roadLabelObject) {
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
},

clickPlus: function(e) {
    /* Toggle expansion of the baselayers check boxes on the "Layers" tab
    on the right side of the map. */
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
},

urlMapType: function(url, map) {
    /*urlMapType (and its main sub-function parseParameters) is used to parse
    GET requests to the viewer api.
    The api allows control of the map by setting the map theme,
    turning on or off layers (cbxid), passing the layer id of
    the requested REST service, passing the table field name used
    for querying the REST service, passing a query value to REST
    and passing in the name of the REST service to be queried.*/
    var urlParams = parseParameters(url);
    function parseParameters(url) {
        var queryObject = urlUtils.urlToObject(url).query;
        if (queryObject) {
            //Check if maptype is passed. If it is, load the theme template
            //and open the theme's layer panel.
            var maptype = queryObject.maptype
                ? maptypeFound(queryObject.maptype.toLowerCase())
                : '';

            var title = queryObject.maptype
                ? createTitle(queryObject.maptype)
                : 'Select Map';
            function createTitle(map_type) {
                return query("#layerSelect ul li[data-value='" + map_type + "']").children('a').innerHTML()
            }
            var layerid = queryObject.layerid
                ? queryObject.layerid
                : '';
            var checkboxid = queryObject.cbxid
                ? (queryObject.cbxid).toLowerCase().split(",")
                : '';
            var field = queryObject.field
                ? String(queryObject.field).toUpperCase()
                : '';
            var value = queryObject.value
                ? queryObject.value
                : '';
            var service = queryObject.service
                ? queryObject.service
                : '';
            var coordinates = queryObject.latlon
                ? queryObject.latlon
                : '';
            var accountNumber = queryObject.ACCOUNTNO
                ? queryObject.ACCOUNTNO.toUpperCase()
                : '';
            var parcelNumber = queryObject.PARCEL_NUM
                ? queryObject.PARCEL_NUM.replace(/-/g, "")
                : '';
            var extent = queryObject.EXTENT
                ? queryObject.EXTENT.toUpperCase()
                : '';
            var params = [maptype, title, layerid, value, checkboxid];
            coordinates !== ''
                ? searchBy(map, "Latitude/Longitude", coordinates)
                : null;
            field !== ''
                ? runQuery(layerid, field, value)
                : null;
            accountNumber !== ''
                ? (searchBy(map, "account", accountNumber))
                : null;
            parcelNumber !== ''
                ? (searchBy(map, "parcelNo", parcelNumber))
                : null;
            extent !== ''
                ? map.setExtent(this.extentZoom(extent))
                : null;
        }

        function maptypeFound(type) {
            getTemplate(type);
            animatePanel("open")
            // setTimeout(function(){animatePanel("open")}, 400);
            //After loading the theme, return the theme title so it can
            //be displayed on the map.
            return type;
        }

        function runQuery(layerid, field, value) {
            var graphicTool = new graphicsTools({geometryServiceURL: esriConfig.defaults.geometryService, mapRef: map});
            dQueryTask = new QueryTask("http://mcmap2.mesacounty.us/arcgis/rest/services/maps/" + service + "/MapServer/" + layerid);
            dQuery = new Query();
            dQuery.returnGeometry = true;
            dQuery.outFields = [""];
            dQuery.where = field + " = '" + value + "'";
            dQueryTask.execute(dQuery, function(result) {
                map.setExtent((map.graphics.add(new Graphic(graphicTool.createJSONPolygon(result.features[0].geometry.rings)))).geometry.getExtent().expand(1.5));
            });
        }
        return params;
    }

    if (urlParams[1] !== 'Select Map') {
        new changeTheme({
            newLayer: urlParams[0],
            layerTitle: urlParams[1],
            option: urlParams[2],
            pVal: urlParams[3],
            mapRef: map,
            infoWindowRef: aG.popup,
            infoTemplateRef: aG.pTemp,
            checkboxid: urlParams[4]
        });
    } else {
        return
    }
},

getTemplate: function(newLayerName) {
    var templateName = "dojo/text!./scripts/esri/mesa/templates/" + newLayerName + "Select.html";
    document.getElementById(newLayerName + "Select") || require([
        templateName
    ], function(template) {
        domConstruct.place(template, "noControl", "before");
    });
},

themeClick: function(e, map, popupObject, popupTemplateObject) {
    e.stopPropagation();
    var newLayer = this.attributes['data-value'].nodeValue;
    getTemplate(newLayer);
    if (newLayer !== 'epom' && newLayer.length > 0) {
        var layerTitle = this.getElementsByTagName('a')[0].innerHTML;
        var option = this.attributes['data-opt']
            ? this.attributes['data-opt'].nodeValue: null;
        setTimeout(function() {
            new changeTheme({
                newLayer: newLayer,
                layerTitle: layerTitle,
                option: option,
                pVal: null,
                mapRef: map,
                infoWindowRef: popupObject,
                infoTemplateRef: popupTemplateObject
            }).then(animatePanel(e));
        }, 200);
    }
},

animatePanel: function(e) {
    /*AnimatePanel opens and closes the right side panel that displays a theme's
    layers. The layers have check boxes next to them to toggle the layer on and
    off.*/
    if (e === "open") {
        dom.byId("hidePanel").innerHTML = "hide";
        dom.byId("noControl").style.display = "block";
        domClass.replace(dom.byId("rightPanel"), "expandedPanel", "collapsedPanel");
    } else {
        var parentcls = domAttr.get(e.target.parentNode, "class");
        if (query(".select").every(function(node) {
            return domStyle.get(node, "display") === "none";
        })) {
            domClass.remove("noControl", "someControl");
        } else {
            domClass.add("noControl", "someControl");
        }
        if (e.type === "click" && parentcls === "collapsedPanel") {
            dom.byId("hidePanel").innerHTML = "hide";
            domClass.replace(dom.byId("rightPanel"), "expandedPanel", "collapsedPanel");
        } else if (e.type === "click" && parentcls === "expandedPanel") {
            dom.byId("hidePanel").innerHTML = "Layers";
            domClass.replace(dom.byId("rightPanel"), "collapsedPanel", "expandedPanel");
        } else if (e.target.nodeName === "A" || e.target.nodeName === "LI") {
            dom.byId("hidePanel").innerHTML = "hide";
            domClass.replace(dom.byId("rightPanel"), "expandedPanel", "collapsedPanel");
        } else {
            return
        }
    }
},

}

});
