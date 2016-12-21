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
            // on(query('#mobileSearch ul li'), "click", openSearchDialog);
            // on(dom.byId("toolPanel"), touch.release, displayTool);
            on(query(".mainSideMenu li:not(#Imagery)"), "click", dispatchMainMenuClick);
            on(query('.themeMenu li'), "click", function(e){
                var layer = domAttr.get(this, 'data-value');
                toolsWidget.dispatchThemeMenuClick(layer);
            });
            on(query('.measureClick'), "click", dispatchMeasureTool);
            on(query('.searchMenu li'), "click", dispatchSearchMenuClick);
            on(dom.byId('Imagery'), "click", dispatchImageryToggle);
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

            function dispatchMainMenuClick(e){
                e.stopPropagation();
                toPage = domAttr.has(this, 'data-to')?
                    domAttr.get(this, 'data-to'): undefined;
                if(toPage !== undefined){
                    domStyle.set('backMenu', "visibility", "visible");
                    domClass.add(query(".mainSideMenu")[0], "displayNo");
                    domClass.remove(query("." + toPage)[0], "displayNo");
                    domAttr.set('backMenu', 'data-to', 'mainSideMenu');
                    domAttr.set('backMenu', 'data-from', toPage);
                }
            }

            function dispatchSearchMenuClick(e) {
                e.stopPropagation();
                domAttr.set('backMenu', 'data-to', "searchMenu");
                domAttr.set('backMenu', 'data-from', "searchBox");
                var type = this.getAttribute('data-value');
                //hide the search menu
                domClass.add(query(".searchMenu")[0], "displayNo");
                //display the search tool
                // domClass.remove(dom.byId("searchFieldDialog"), "displayNo");
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
                if (dom.byId("measureTool") && !(registry.byId("measureTool"))) { //remove the 2 after user caches have been updated
                    var measure = new measureWidget({
                        mapRef: map,
                        gsvc: esriConfig.defaults.geometryService.url,
                        device: device,
                        parcelLayer: parcels
                    }, "measureTool"); //remove the 2 after user caches have been updated
                    measure.startup();
                }
            }

            function dispatchQueryTool(map, geometryServiceURL) {
                    if (dom.byId("queryTool") && !(registry.byId("queryTool"))) { //remove the 2 after user caches have been updated
                        var queryTool = new queryWidget({
                            device: "desktop",
                            mapRef: map,
                            geometryServiceURL: geometryServiceURL,
                            exportURL: "scripts/php/toCSV.php",
                            csvOutputLocation: "scripts/php/"
                        }, "queryTool");
                        queryTool.startup();
                    }
                    // if (dom.byId("queryDialog2")) {
                    //     dom.byId("queryDialog2").style.display = dom.byId("queryDialog2").style.display === "block"
                    //         ? "none"
                    //         : "block";
                    // }
            }

            function dispatchImageChange(e) {
                var spanList = this.parentNode.getElementsByTagName('span');
                var thisSpan = this.getElementsByTagName('span')[0];
                var layer = domAttr.get(this, 'data-value');

                lmG.imageTool.basemapChanger(this);
                //go to mainSideMenu
                registry.byId("toolsView2").domNode.style.display = "none";


                //Place check mark next to currently active theme
                (function () {
                    for (i = 0; i < spanList.length; i++) {
                        spanList[i].innerHTML = '';
                    };
                    thisSpan.innerHTML = "&#10004;";
                })();
            }

            function dispatchImageryToggle(e) {
                var defaultYear = domAttr.get(this, "data-value");
                //toggle between imagery and basemap
                if (!(registry.byId("imagelist"))) {
                    createImageList(Images);
                    lmG.imageTool = new basemapWidget2({
                        mapRef: map,
                        device: device,
                        initialBasemap: initialBasemap
                    }, "imagelist");
                    lmG.imageTool.basemapChanger(e.target);
                }else{
                    lmG.imageTool.basemapChanger(e.target);
                }

                function createImageList(imageConfig) {
                    //Add the selected imagery and theme layer to the map
                    require(["esri/layers/ArcGISTiledMapServiceLayer"], function(ArcGISTiledMapServiceLayer) {
                        for (var x in imageConfig.images) {
                            lmG[imageConfig.images[x].imageId] = new ArcGISTiledMapServiceLayer(imageConfig.mapFolder + imageConfig.images[x].serviceName + imageConfig.serverType, {id: imageConfig.images[x].imageId});
                        }
                    }); // end require
                }

                //close menu
                registry.byId("toolsView2").domNode.style.display = "none";
                //display imageyear button on menu or remove it
                if(domClass.contains('imageYears', 'displayNo')){
                    domClass.remove('imageYears', "displayNo");
                }else{
                    domClass.add('imageYears', "displayNo");
                }
                //change button innerText to "Show Basemap" or "Show Imagery"
                if(query('#Imagery').text() === "Show Imagery"){
                    query('#Imagery').text("Show Basemap");
                }else{
                    lmG.imageTool.basemapChanger('vector');
                    query('#Imagery').text("Show Imagery");
                }
            }

            function backButtonEvent(e){
                var backToPage = domAttr.get(e.target, 'data-to');
                var fromPage = domAttr.get(e.target, 'data-from');

                //This is a terrible hack to get a single case of a back button
                //to work. Replace soon.
                if(fromPage === "searchBox" && domClass.contains(query(".searchMenu")[0], "displayNo") === false){
                    backToPage = "mainSideMenu";
                    fromPage = "searchMenu";
                }

                domClass.add(query("." + fromPage)[0], "displayNo");
                domClass.remove(query("." + backToPage)[0], "displayNo");

                //Once back on the main menu, remove the back button (There is
                //nothing to go back to)
                if(domClass.contains(query(".mainSideMenu")[0], "displayNo") === false){
                    domStyle.set('backMenu', "visibility", "hidden");
                }
            }
        },

        startup: function () {
            this.inherited(arguments);
        },

        backToMap: function () {
            // query("#map_zoom_slider, #hidePanel, #rightPanel, .collapsedPanel").style("display", "block");
            toolsWidget.domNode.style.display = "none";
        },

        dispatchThemeMenuClick: function(layer, components) {
            //Place check mark next to currently active theme
            var spanList = query('.themeMenu')[0].getElementsByTagName('span');
            var thisSpan;
            for(s = 0; s < spanList.length; s++){
                if(domAttr.get(spanList[s].parentNode, 'data-value') === layer){
                    thisSpan = spanList[s].parentNode.getElementsByTagName('span')[0];
                }
            }

            (function () {
                for (i = 0; i < spanList.length; i++) {
                    spanList[i].innerHTML = '';
                };
                thisSpan.innerHTML = "&#10004;";
            })();

            themeTools.themeClick(thisSpan.parentNode, map, popupObject, popupTemplateObject, legendObject, initialBasemap, components);

            //remove the side panel to show the map only.
            registry.byId("toolsView2").domNode.style.display = "none";
        },

        measureClick: function () {
            if (!(registry.byId("measureDialog2"))) { //remove the 2 after user caches have been updated
                var measure = new measureWidget({
                    gsvc: this.geometryServiceURL,
                    device: "mobile"
                }, "measureDialog2"); //remove the 2 after user caches have been updated
                measure.startup();
                query("#toolPanel").html("Measure").attr("data-toolName", "measureDialog2");
            }
            dom.byId("measureDialog2").style.display = dom.byId("measureDialog2").style.display === "block" ? "none" : "block";
            toolsWidget.domNode.style.display = "none";
        },

        shareClick: function () {
            if (!(registry.byId("shareForm2"))) { //remove the 2 after user caches have been updated
                var shareForm = new shareFormWidget({
                    emailServiceUrl: "scripts/php/ShareMail.php",
                    mapRef: map
                }, "shareForm2");
                shareForm.startup();
            }
        if (dom.byId("shareForm2")) { //delete
            dom.byId("shareForm2").style.display = dom.byId("shareForm2").style.display === "block" ? "none" : "block";
        }
        this.backToMap();
        },

        printClick: function () {
            if (!(registry.byId("printDialog2"))) { //remove the 2 after user caches have been updated
                var printer = new printWidget({
                    printUrl: toolsWidget.printURL,
                    mapRef: map,
                    device: "mobile",
                    callBack: toolsWidget.onClose
                }, "printDialog2"); //remove the 2 after user caches have been updated
                printer.startup();
            }
            domStyle.set(dom.byId("printDialog2"), { //remove the 2
                display: domStyle.get(dom.byId("printDialog2"), "display") === "block" ? "none" : "block"
            });
            this.backToMap();
        },

        helpClick: function () {
            if (dom.byId("helpMenu2") && !(registry.byId("helpMenu2"))) { //remove the 2 after user caches have been updated
                var help = new helpWidget({
                    printUrl: "http://mcmap2.mesacounty.us/arcgis/rest/services/Printing/MCExportWebMap/GPServer/Export%20Web%20Map",
                    device:"desktop"
                }, "helpMenu2"); //remove the 2 after user caches have been updated
                help.startup();
            }
            if (dom.byId("helpMenu2")) { //delete
                toolsWidget.domNode.style.display = "none";
                domStyle.set(dom.byId("helpMenu2"), { //remove the 2
                    display: domStyle.get(dom.byId("helpMenu2"), "display") === "block" ? "none" : "block" //remove the 2
                });
            }
            this.backToMap();
        },

        bookmarkClick: function () {
            if (!(registry.byId("bookmarkDialog2"))) { //remove the 2 after user caches have been updated
                var bookmarks = new bookmarkWidget({
                    mapRef: map
                }, "bookmarkDialog2");
                bookmarks.startup();
            }

            if (dom.byId("bookmarkDialog2")) { //delete
                toolsWidget.domNode.style.display = "none";
                dom.byId("bookmarkDialog2").style.display = dom.byId("bookmarkDialog2").style.display === "block" ? "none" : "block"
            }
            this.backToMap();
        },

        queryClick: function () {
            if (!(registry.byId("queryDialog2"))) { //remove the 2 after user caches have been updated
                var queryTool = new queryWidget({
                    device: "mobile",
                    mapRef: map,
                    geometryServiceURL: gsvc
                }, "queryDialog2");
                queryTool.startup();
                query("#toolPanel").html("Query tool").attr("data-toolName", "queryDialog2");
            }

            dom.byId("queryResultDialog").style.display = "none";

            if (dom.byId("queryDialog2")) {
                dom.byId("queryDialog2").style.display = "block";
            }

            // this.backToMap();
        },

        legendClick: function () {
            dom.byId("legendDialog").style.display = "block";
            domClass.contains(dom.byId("legendDialog"), "displayNo") ? domClass.remove(dom.byId("legendDialog"), "displayNo") : domClass.add(dom.byId("legendDialog"), "displayNo");
            this.backToMap();
        },


        onClose: function (){
            dom.byId("toolPanel").style.display = "none";
            query("#map_zoom_slider, #hidePanel, #rightPanel, .collapsedPanel").style("display", "block");
        }

    }); //end of declare
}); //end of define
