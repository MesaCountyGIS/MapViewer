var aG = {}; //Global application object
var lmG = {}; //Global Layer Management object

init(); // initialize the map view

function init() {
  require([
    "esri/config", "dojo/on", "dojo/dom-construct", "dojo/text!./scripts/_config/config.json", "esri/dijit/Legend",
    "dojo/query", "dojo/dom", "dojo/touch", "mesa/themeTools", "dijit/registry", "mesa/toolsWidget2", "mesa/searchTools",
    "esri/tasks/QueryTask", "esri/graphic", "mesa/graphicsTools", "esri/urlUtils", "dojo/dom-attr", "dojo/_base/array",
    "esri/geometry/Extent", "esri/SpatialReference", "mesa/locatorWidget", "esri/dijit/Scalebar", "mesa/contextMenuWidget",
    "mesa/homeButton", "dojo/has", "dojo/sniff", "esri/dijit/PopupMobile", "esri/dijit/Popup",
    "esri/map",
    "esri/dijit/PopupTemplate",
    "esri/tasks/GeometryService", "esri/layers/FeatureLayer", "esri/layers/ArcGISTiledMapServiceLayer",
    "libs/matchMedia", "dojo/NodeList-traverse", "dojo/NodeList-manipulate"
  ], function(esriConfig, on, domConstruct, JSONconfig, Legend,
    query, dom, touch, themeTools, registry, toolsWidget, searchTools,
    QueryTask, Graphic, graphicsTools, urlUtils, domAttr, array,
    Extent, SpatialReference, locatorWidget, Scalebar, contextMenuWidget,
    homeButton, has, sniff, PopupMobile, Popup,
    Map,
    PopupTemplate,
    GeometryService, FeatureLayer, ArcGISTiledMapServiceLayer) {

    /* The JSON configuration file is located in the scripts/_config directory.
    It contains urls for geometryService, print service and proxy. It also
    contains the imageServer url and a list of image service names and ids used
    to build the imagery layers for the app. */
    JSONconfig = JSON.parse(JSONconfig);

    // Check if the site is being requested from a mobile or desktop device. then
    // set the map's popup accordingly.
    aG.popup = checkForMobile() === 1 ? setPopup("mobile", "popup") : setPopup("static", "popup");
    var device = aG.popup.domNode.className === 'esriPopupMobile' ? 'mobile' : 'desktop';

    // Set esriConfig variables
    esriConfig.defaults.io.proxyUrl = JSONconfig.proxyURL;
    esriConfig.defaults.io.alwaysUseProxy = false;
    esriConfig.defaults.geometryService = new GeometryService(JSONconfig.geometryService);
    document.dojoClick = false;
    // Set the spatial reference to 102206 for UTM zone 12
    var utm12 = new SpatialReference({
      wkid: 102206
    });
    // See the setInitialExtent function for actual extent bounds
    var initExtent = setInitialExtent(utm12, device);
    // Create an ESRI map component
    aG.map = createMap(initExtent, aG.popup);
    // Initialize the popup for when parcels are clicked
    aG.pTemp = createPopupTemplate();
    // Create 3 layers to be initially added to the map
    lmG.pLay = createFeatureLayer(
      "https://mcgis.mesacounty.us/arcgis/rest/services/maps/ParcelOnly4Query/MapServer/0",
      aG.pTemp, ["LOCATION", "ACCOUNTNO", "OWNER", "JTOWNER", "SDATE", "PARCEL_NUM", "ZONING", "Acres", "JURISDICTION"]
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
      var scalebar = new Scalebar({
        map: aG.map,
        attachTo: "bottom-right"
      });
      scalebar.show();
      createContextMenu(aG.map, JSONconfig.geometryService);

      /*Create a dom node to hold the legend. Create a new legend object,
      then call runToolsView which will configure the legend*/
      var node = domConstruct.toDom("<div data-to='mainSideMenu' class='displayNo legendMenu' id='legendDiv'></div>");
      domConstruct.place(node, document.getElementById('map'), 'before');

      var legend = new Legend({ map: aG.map }, node);

      homeButton({mapRef: aG.map});

      window.addEventListener("orientationchange", orientationChanged, false);
      aG.map.on("mouse-move", function(e) {
          document.getElementById("screenCoordinatesUTM").innerHTML = ("X=" + e.mapPoint.x.toFixed(1) + "  " + "Y=" + e.mapPoint.y.toFixed(1));
      });
      on(dom.byId("menuSelect"), "click", function(legend) {
        runToolsView(JSONconfig, aG.map, device,aG.popup, aG.pTemp, legend, initialBasemap, lmG.pLay);
      });
      on(dom.byId("locate"), touch.release, function() {
        var locate = new locatorWidget({
          mapRef: aG.map,
          gsvc: JSONconfig.geometryService,
          device: "desktop"
        });
        locate.startup();
      });
      on(query(".submen li, .submenu li"), touch.release, function(e) {
        showDropdownMenu(e, "none");
      });
      on(query("#combobox, #mainfish"), "mouseenter, mouseleave, touchstart", function(e) {
        showDropdownMenu(e);
      });


      document.getElementById("loading").style.display = "none";
      aG.map.disableKeyboardNavigation();

      JSONconfig.parcelTemplate = aG.pTemp;
      JSONconfig.popupTemplate = aG.popup;

      /*watches for variables in the url then runs urlMapType
      if it finds one or more*/
      if ((location.href).indexOf("?") > -1) {
        urlMapType(location.href, aG.map, legend, initialBasemap, JSONconfig, device, lmG.pLay);
      } else {
        runToolsView(JSONconfig, aG.map,device,aG.popup, aG.pTemp, legend, initialBasemap, lmG.pLay);
      }
    });


    function showDropdownMenu(e, display) {
      /*On mouse enter or click, display the dropdown. On mouse leave,
      remove the dropdown.*/
      if (display === undefined) {
        display = e.type === "mouseleave" ? "none" : "block";
        query("." + query("#" + e.currentTarget.id + " ul")[0].className)[0].style.display = display;
      } else {
        //If a menu item is clicked, remove the dropdown
        query("." + e.currentTarget.parentNode.className)[0].style.display = display;
      }
    }

    function createTiledMapServiceLayer(url, id) {
      return new ArcGISTiledMapServiceLayer(url, {
        id: id
      });
    }

    function createFeatureLayer(url, template, fields) {
      return new FeatureLayer(url, {
        mode: FeatureLayer.MODE_ONDEMAND,
        infoTemplate: template,
        outFields: fields
      });
    }

    function createPopupTemplate() {
      return new PopupTemplate({
        fieldInfos: [{
          fieldName: "Acres",
          visible: true,
          format: {
            places: 2
          }
        }],
        title: "<b>Parcel Information:</b>",
        description: "<b>Account number:</b>  <a href='https://emap.mesacounty.us/assessor_lookup/Assessor_Parcel_Report.aspx?Account={ACCOUNTNO}'" + "target='_blank'>{ACCOUNTNO}</a><br><b>Parcel Number:</b> {PARCEL_NUM}<br><b>Owner:</b>  {OWNER}<br><b>Joint Owner:</b>  {JTOWNER}<br><b>Address:</b>" + "{LOCATION}<br><b>Sale Date:</b>" + " {SDATE}<br>" + "<b>Zoning:</b> {ZONING}<br><b>Approximate Acres:</b> {Acres}<br><b>Jurisdiction: </b>{JURISDICTION}<br>" + "<div id='mapButtons'>" +
          "<a title='Click to view parcel in Google Earth' class='maplink' target='_blank' href='https://emap.mesacounty.us/kmls?acct={ACCOUNTNO}'>Google Earth</a>" + "<a title='Click to view parcel in Bing Maps' class='maplink' target='_blank' href='https://www.bing.com/maps/?mapurl=https://emap.mesacounty.us/kmls?acct={ACCOUNTNO}'>Bing Maps</a></div><br>"
      });
    }

    function createMap(initExtent, popup) {
      return new Map("map", {
        extent: initExtent,
        logo: false,
        infoWindow: popup
      });
    }

    function setInitialExtent(spatialReference, device) {
      var xmin = device === 'mobile' ? 697373 : 685960;
      var ymin = device === 'mobile' ? 4322305 : 4316261;
      var xmax = device === 'mobile' ? 726312 : 738288;
      var ymax = device === 'mobile' ? 4335072 : 4342506;
      return new Extent({
        xmin:xmin,
        ymin:ymin,
        xmax:xmax,
        ymax:ymax,
        spatialReference:spatialReference
      });
    }

    function setPopup(type, popupNode) {
      /* Set the popup type depending on whether the requesting device is
      mobile or desktop*/
      if (type === "mobile") {
        return PopupMobile(null, dom.byId(popupNode));
      } else {
        return Popup({
          titleInBody: false
        }, dom.byId(popupNode));
      }
    }

    function checkForMobile() {
      has.add("mobile", function(global, document, anElement) {
        if (has("ie")) {
          return window.matchMedia("only screen and (max-width: 1024px)").matches // && has("touch")
            ?
            true : false;
        } else {
          return window.matchMedia("only screen and (max-width: 1024px)").matches // && has("touch")
            ?
            true : false;
        }
      });
      return has('mobile') ? 1 : 0;
    }

    function runToolsView(config, mapRef, deviceUsed, popupRef, popupTemplateRef, legendRef, basemap, parcelLayer) {
        // const {mapRef, deviceUsed, popupRef, popupTemplateRef, legendRef, basemap, parcelLayer} = appConfig;
      if (!(registry.byId("toolsView2"))) {
        new toolsWidget({
          geometryServiceURL: config.geometryService,
          printURL: config.printURL,
          imageList: config.imagesList,
          mapRef:mapRef,
          basemap:basemap,
          deviceUsed:deviceUsed,
          popupRef:popupRef,
          popupTemplateRef:popupTemplateRef,
          legendRef:legendRef,
          parcelLayer:parcelLayer
        }, "toolsView2");
        registry.byId("toolsView2").domNode.style.display = "none"
      } else {
        if (registry.byId("toolsView2").domNode.style.display === "block") {
          registry.byId("toolsView2").domNode.style.display = "none";
        } else {
          registry.byId("toolsView2").domNode.style.display = "block";
        }
      }
    }

    function orientationChanged() {
      if (query(".expandedPanel")[0]) {
        query(".expandedPanel")[0].style.display = "none";
      }
    }

    function createContextMenu(mapRef, geometryServiceURL) {
      contextMenuWidget({
        mapRef:mapRef,
        geometryServiceURL:geometryServiceURL,
        trsURL: "https://mcgis.mesacounty.us/arcgis/rest/services/maps/eSurveyor/MapServer/12"
      });
    }

    function extentZoom(extentObject, wkid) {
      var spatRef = new SpatialReference({
        wkid: wkid
      });
      var ext = extentObject.split(':');
      var xmin = parseInt(ext[0]),
        ymin = parseInt(ext[1]),
        xmax = parseInt(ext[2]),
        ymax = parseInt(ext[3]);
      return new Extent(
        xmin,
        ymin,
        xmax,
        ymax,
        spatRef
      );
    }

    function urlMapType(url, map, legend, initialBasemap, config, device, parcels) {
      /*urlMapType (and its main sub-function parseParameters) is used to parse
      GET requests to the viewer api.
      The api allows control of the map by setting the map theme,
      turning on or off layers (cbxid), passing the layer id of
      the requested REST service, passing the table field name used
      for querying the REST service, passing a query value to REST
      and passing in the name of the REST service to be queried.*/
      var parseParameters = function(url) {
        var queryObject = urlUtils.urlToObject(url).query;
        var params = {};
        if (queryObject) {
          Object.keys(queryObject).forEach(function(key) {
            if (key === 'cbxid') {
              params[key] = queryObject[key].split(",");
            } else if (key === 'PARCEL_NUM') {
              params[key] = queryObject[key].replace(/-/g, "");
            } else if (key in ['field', 'ACCOUNTNO']) {
              params[key] = queryObject[key].ToUpperCase();
            } else {
              params[key] = queryObject[key];
            }
          });
          var title = queryObject.maptype ?
            query("#layerSelect ul li[data-value='" + queryObject.maptype + "']").children('a').innerHTML() :
            'Select Map';

          params['title'] = title;
        }
        return params;
      }

      var urlParams = parseParameters(url);

      var maptypeFound = function(type) {
        return themeTools.getTemplate(type);
      }

      function runQuery(layerid, field, value, service) {
        var graphicTool = new graphicsTools({
          geometryServiceURL: esriConfig.defaults.geometryService,
          mapRef: map
        });
        var dQueryTask = new QueryTask("https://mcgis.mesacounty.us/arcgis/rest/services/maps/" + service + "/MapServer/" + layerid);
        var dQuery = new query();
        dQuery.returnGeometry = true;
        dQuery.outFields = [""];
        dQuery.where = field + " = '" + value + "'";
        dQueryTask.execute(dQuery, function(result) {
          map.setExtent((map.graphics.add(new Graphic(graphicTool.createJSONPolygon(result.features[0].geometry.rings)))).geometry.getExtent().expand(1.5));
        });
      }

      if (registry.byId("toolsView2")) {
        (registry.byId("toolsView2").destroyRecursive());
      }

      //If no maptype is passed in the url, default to eassessor
      urlParams.maptype = urlParams.title === 'Select Map' ?
        'eassessor' : urlParams.maptype;

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

      var components = {
        pVal: urlParams.title,
        checkboxid: urlParams.cbxid
      }

      tools.dispatchThemeMenuClick(urlParams.maptype, components, true);

      //This timeout function is needed because there is a timeout in themeTools (fired
      //above) that is causing parcels to lose their blue selected outline. Fix needing
      //the timeout in dispatchThemeMenuClick and you can get rid of this one
      setTimeout(function() {
        if (urlParams.ACCOUNTNO !== undefined) {
          searchTools.searchBy("account", urlParams.ACCOUNTNO);
        }
        if (urlParams.PARCEL_NUM !== undefined) {
          searchTools.searchBy("parcelNo", urlParams.PARCEL_NUM);
        }
        if (urlParams.EXTENT !== undefined) {
          map.setExtent(extentZoom(urlParams.EXTENT, 102206)); //send extent parameters and wkid
        }
        if (urlParams.latlon !== undefined) {
          searchTools.searchBy("Latitude/Longitude", urlParams.latlon);
        }
        if (urlParams.field !== undefined) {
          runQuery(urlParams.layerid, urlParams.field, urlParams.value, urlParams.service);
        }
        if (urlParams.maptype !== undefined) {
          maptypeFound(urlParams.maptype);
        }
      }, 201);
    }
  }); //end require
} //end of init function
