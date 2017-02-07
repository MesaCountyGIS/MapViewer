define([
     "dojo/_base/declare", "dojo/dom-construct", "dojo/dom", "dojo/dom-class",
     "dojo/dom-attr", "dojo/dnd/move", "dojo/query", "dojo/dom-style",
    "esri/tasks/PrintTask", "esri/tasks/PrintParameters", "esri/tasks/PrintTemplate",
    "esri/dijit/Print", "dojo/on", "dojo/_base/lang", "dojo/touch", "mesa/themeTools", "mesa/searchTools",
     "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/toolsView2.html",
     "mesa/measureWidget", "mesa/printWidget", "mesa/queryWidget", "mesa/bookmarkWidget",
     "mesa/helpWidget", "mesa/shareFormWidget", "dijit/registry", "mesa/basemapWidget2", "dojo/NodeList-traverse"
], function (declare, domConstruct, dom, domClass, domAttr, move, query, domStyle,
    PrintTask, PrintParameters, PrintTemplate, Print, on, lang, touch, themeTools, searchTools,
    _WidgetBase, _TemplatedMixin, template, measureWidget, printWidget, queryWidget,
    bookmarkWidget, helpWidget, shareFormWidget, registry, basemapWidget2) {
        var map, toolsWidget, gsvc, popupObject, popupTemplateObject, Images, initialBasemap, device, parcels, legendObject;

    return declare("toolsWidget2", [_WidgetBase, _TemplatedMixin], {

        templateString: template,
        baseClass: "mesaTools",
        geometryServiceURL: null,
        printURL: null,
        imageList: null,
        mapRef: null,
        basemap: null,
        deviceUsed: null,
        popupRef: null,
        popupTemplateRef: null,
        legendRef: null,
        parcelLayer: null,

        postCreate: function () {
            domConstruct.place(this.domNode, this.srcNodeRef.id, "before");
            domConstruct.place(dom.byId("legendDiv"), dom.byId("leg"), "replace");

            toolsWidget = this;
            map = toolsWidget.mapRef;
            gsvc = toolsWidget.geometryServiceURL;
            popupObject = toolsWidget.popupRef;
            popupTemplateObject = toolsWidget.popupTemplateRef;
            Images = toolsWidget.imageList;
            initialBasemap = toolsWidget.basemap;
            device = toolsWidget.deviceUsed;
            printerURL = toolsWidget.printURL;
            parcels = toolsWidget.parcelLayer;
            //Push the original basemap into the legend
            legendObject = toolsWidget.legendRef;
            var legLayers = [];
            legLayers.push({
                layer: initialBasemap,
                title: 'Basemap Layers',
                hideLayers: [
                    7,12,17,22,23,24,25,26,27,28,32,35,36,37,38,39,50,51
                ]
            });
            legendObject.refresh(legLayers);
            //Set up event handlers for slide out menu
            on(query(".mainSideMenu li"), "click", dispatchMainMenuClick);
            on(query("#DTtoolstrip button, #panelTab, #sharebutton, .submen li"), "click", togglePanel);
            on(query('.themeMenu li'), "click", function(e){
                var layer = domAttr.get(this, 'data-value');
                toolsWidget.dispatchThemeMenuClick(layer);
            });
            on(query('.measureClick'), "click", dispatchMeasureTool);
            on(query('.queryClick'), "click", dispatchQueryTool);
            on(query('.bookmarkClick'), "click", dispatchBookmarks);
            on(query('.printClick'), "click", dispatchPrinter);
            on(query('.helpClick'), "click", dispatchHelp);
            on(query('.shareClick, #sharebutton'), "click", dispatchShareForm);
            on(query('.searchMenu li, .submen li'), "click", dispatchSearchMenuClick);
            on(query('.Imagery, .DTimagery'), "click", dispatchImageryToggle);
            on(query('.imageYears li'), "click", dispatchImageChange);
            on(dom.byId('backMenu'), touch.release, backButtonEvent);
            on(query('.baselyrs'), "click", function(e){
                baseLayersSwitch(e, parcels, initialBasemap, map._layers.roadLabels);
            });

            //Turns on and off the base layers
            function baseLayersSwitch(e, ParcelLayerObject, basemapObject, roadLabelObject) {
                require([
                    "dojo/query", "dojo/dom-attr"
                ], function(query, domAttr) {
                    var target = e.target? e.target: e.srcElement;
                    var thisClassName = domAttr.get(target, "class");
                    thisClassName = 'input.' + thisClassName.split(" ").pop();
                    var box = query(thisClassName);
                    var layers = {
                        'input.pclcbx': ParcelLayerObject,
                        'input.lbsgcbx': roadLabelObject,
                        'input.bgcbx': basemapObject
                    };
                    for (i = 0; i < box.length; i++) {
                        box[i].checked = target.checked? true: false;
                    }
                    for (var x in layers) {
                        if (query(x)[0].checked) {
                            layers[x].show();
                        } else {
                            layers[x].hide();
                        }
                    }
                });
            }

            function openSearchDialog(e){
                e.stopPropagation();
                var type = this.getAttribute('data-value');
                dom.byId('mobileSearch').style.display = "none";
                if(registry.byId("searchFieldDialog")){
                    registry.byId("searchFieldDialog").destroyRecursive();
                }
                searchBy(type, undefined, "mobile", "toolsView");
                toolsWidget.backToMap();
            }

            function togglePanel(e){
                if(domStyle.get('toolsView2', 'display') === "none"){
                    if((this.id !== "panelTab") && (domStyle.get('backMenu', "visibility") === 'visible')){
                        backButtonEvent();
                    }
                    domStyle.set('toolsView2', "display", "block");
                }else{
                    if(domAttr.get(this, 'data-to') === domAttr.get(dom.byId("backMenu"), 'data-from')){
                        domStyle.set('toolsView2', "display", "none");
                    }
                    backButtonEvent();
                }
                if(this.id !== "panelTab"){
                    dispatchMainMenuClick.call(this, e);
                }

            }

            function dispatchMainMenuClick(e){
                e.stopPropagation();
                toPage = domAttr.has(this, 'data-to')?
                    domAttr.get(this, 'data-to'): undefined;
                if(toPage !== undefined){
                    if(domStyle.get(query('.stacked-toggle span')[0], "display") === "block"){
                        domStyle.set('backMenu', "visibility", "visible");
                    }

                    domClass.add(query(".mainSideMenu")[0], "displayNo");
                    domClass.remove(query("." + toPage)[0], "displayNo");

                    domAttr.set('backMenu', 'data-to', 'mainSideMenu');
                    domAttr.set('backMenu', 'data-from', toPage);
                }
            }

            function backButtonEvent(){
                var backToPage = domAttr.get(dom.byId("backMenu"), 'data-to');
                var fromPage = domAttr.get(dom.byId("backMenu"), 'data-from');
                /*This is a terrible hack to get a single case of a back button
                to work. Replace soon.*/
                if(fromPage === "searchBox" && domClass.contains(query(".searchMenu")[0], "displayNo") === false){
                    backToPage = "mainSideMenu";
                    fromPage = "searchMenu";
                }else if(fromPage === "problemForm" && domClass.contains(query(".helpTool")[0], "displayNo") === false){
                    backToPage = "mainSideMenu";
                    fromPage = "helpTool";
                }

                domClass.add(query("." + fromPage)[0], "displayNo");
                domClass.remove(query("." + backToPage)[0], "displayNo");

                /*Once back on the main menu, remove the back button (There is
                nothing to go back to)*/
                if(domClass.contains(query(".mainSideMenu")[0], "displayNo") === false){
                    domStyle.set('backMenu', "visibility", "hidden");
                }
            }

            function dispatchSearchMenuClick(e) {
                e.stopPropagation();
                var to = this.parentNode.className === 'submen'?
                    'mainSideMenu': 'searchMenu';
                    var from = this.parentNode.className === 'submen'?
                        'searchFieldDialog': 'searchBox';
                domAttr.set('backMenu', 'data-to', to);
                domAttr.set('backMenu', 'data-from', "searchBox");

                var type = this.getAttribute('data-value');
                //hide the search menu
                domClass.add(query(".searchMenu")[0], "displayNo");
                //The searchLI list item is still populated on a small screen
                //in case the screen is just minimized and gets maximized
                dom.byId("searchLI").childNodes[0].nodeValue = this.childNodes[0].innerHTML;
                if (registry.byId("searchFieldDialog")){
                    (registry.byId("searchFieldDialog").destroyRecursive());
                }
                searchTools.searchBy(type, undefined, "desktop", undefined, function(){
                    domClass.remove(query(".searchMenu")[0], "displayNo");
                    toolsWidget.domNode.style.display = "none";
                });
            }

            function dispatchMeasureTool() {
                if (dom.byId("measureTool") && !(registry.byId("measureTool"))) {
                    var measure = new measureWidget({
                        mapRef: map,
                        gsvc: esriConfig.defaults.geometryService.url,
                        device: device,
                        parcelLayer: parcels
                    }, "measureTool");
                    measure.startup();
                }
            }

            function dispatchQueryTool() {
                    if (dom.byId("queryTool") && !(registry.byId("queryTool"))) {
                        var Query = new queryWidget({
                            device: device,
                            mapRef: map,
                            geometryServiceURL: esriConfig.defaults.geometryService.url,
                            exportURL: "scripts/php/toCSV.php",
                            csvOutputLocation: "scripts/php/"
                        }, "queryTool");
                        Query.startup();
                    }
            }

            function dispatchBookmarks() {
                    if (!(registry.byId("bookmarkTool"))) {
                        var bookmarks = new bookmarkWidget({
                            mapRef: map
                        }, "bookmarkTool");
                        bookmarks.startup();
                    }
            }

            function dispatchPrinter() {
                    if (!(registry.byId("printTool"))) {
                        var printer = new printWidget({
                            printUrl: printerURL,
                            mapRef: map,
                            device: device
                        }, "printTool");
                        printer.startup();
                    }
            }

            function dispatchHelp() {
                if (dom.byId("helpTool") && !(registry.byId("helpTool"))) {
                    var help = new helpWidget({
                        printUrl: printerURL,
                        device: device
                    }, "helpTool");
                    help.startup();
                }
            }

            function dispatchShareForm(map) {
                if (!(registry.byId("shareTool"))) {
                    var shareForm = new shareFormWidget({
                        emailServiceUrl: "scripts/php/ShareMail.php",
                        mapRef: map
                    }, "shareTool");
                }
            }

            function checkmarks(){
                return{
                    get: function (spanList) {
                        for (i = 0; i < spanList.length; i++) {
                            if(spanList[i].innerHTML !== ""){
                                defaultYearElement = spanList[i].parentNode;
                                return defaultYearElement;
                            }
                        };
                    },

                    set: function (spanList, thisSpan) {
                        for (i = 0; i < spanList.length; i++) {
                            spanList[i].innerHTML = '';
                        };
                        thisSpan.innerHTML = "&#10004;";
                    }
                }
            }

            function dispatchImageChange(e) {
                var spanList = this.parentNode.getElementsByTagName('span');
                var thisSpan = this.getElementsByTagName('span')[0];
                var layer = domAttr.get(this, 'data-value');

                lmG.imageTool.basemapChanger(this);

                //Place check mark next to currently active image year
                new checkmarks().set(spanList, thisSpan);
            }

            function dispatchImageryToggle(e) {
                if (!(registry.byId("imagelist"))) {
                    createImageList(Images);
                    lmG.imageTool = new basemapWidget2({
                        mapRef: map,
                        device: device,
                        initialBasemap: initialBasemap
                    }, "imagelist");
                }

                function createImageList(imageConfig) {
                    //Add the selected imagery and theme layer to the map
                    require(["esri/layers/ArcGISTiledMapServiceLayer"], function(ArcGISTiledMapServiceLayer) {
                        for (var x in imageConfig.images) {
                            lmG[imageConfig.images[x].imageId] = new ArcGISTiledMapServiceLayer(imageConfig.mapFolder + imageConfig.images[x].serviceName + imageConfig.serverType, {id: imageConfig.images[x].imageId});
                        }
                    }); // end require
                }
            }

            function shareMap() {
                if (!(registry.byId("shareForm2"))) { //remove the 2 after user caches have been updated
                    var shareForm = new shareFormWidget({
                        emailServiceUrl: "scripts/php/ShareMail.php",
                        mapRef: map
                    }, "shareForm2");
                    shareForm.startup();
                }
            }
        },

        startup: function () {
            this.inherited(arguments);
        },

        backToMap: function () {
            toolsWidget.domNode.style.display = "none";
        },

        dispatchThemeMenuClick: function(layer, components) {
            //Place check mark next to currently active theme
            var spanList = query('.themeMenu')[0].getElementsByTagName('span');
            var thisSpan;
            (function () {
                //Set thisSpan to the currently selected theme
                for(s = 0; s < spanList.length; s++){
                    if(domAttr.get(spanList[s].parentNode, 'data-value') === layer){
                        thisSpan = spanList[s].parentNode.getElementsByTagName('span')[0];
                    }
                }
                //Set a checkmark next to the currently selected theme
                for (i = 0; i < spanList.length; i++) {
                    spanList[i].innerHTML = '';
                };
                thisSpan.innerHTML = "&#10004;";
            })();

            setTimeout(function () {
                themeTools.themeClick(thisSpan.parentNode, map, popupObject, popupTemplateObject, legendObject, initialBasemap, components);
            }, 10);

            //remove the side panel to show the map only.
            registry.byId("toolsView2").domNode.style.display = "none";
        }
    }); //end of declare
}); //end of define
