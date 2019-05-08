define([
    "dojo/dom-construct", "dojo/query", "dojo/dom-attr", "dojo/on", "dojo/dom", "esri/geometry/Extent", "esri/SpatialReference", "dojo/dom-style", "dojo/_base/array",
    "dijit/ConfirmDialog", "dojo/cookie", "esri/tasks/IdentifyTask", "esri/tasks/IdentifyParameters", "mesa/IdentifyTemplates", "esri/layers/ArcGISDynamicMapServiceLayer",
    "mesa/legendWidget", "dijit/registry", "dojo/text!./_config/config.json",
    "dojo/_base/declare", "dijit/_WidgetBase", "dojo/NodeList-dom", "dojo/domReady!"
], function(domConstruct, query, domAttr, on, dom, Extent, SpatialReference, domStyle, array,
    ConfirmDialog, cookie, IdentifyTask, IdentifyParameters, IdentifyTemplates, ArcGISDynamicMapServiceLayer,
    legendWidget,registry, JSONConfig,
    declare, _WidgetBase) {
    var layer, layerTitle, option, pVal, control, changeThemeWidget, layerConstructor, themeLayers, map, basemap, checkboxClick, infoWindow, infoTemplate, checkboxids, Legend;

    return declare("changeTheme", [_WidgetBase], {

            newLayer: null,
            layerTitle: null,
            option: null,
            mapRef: null,
            basemapRef: null,
            infoWindowRef: null,
            infoTemplateRef: null,
            mapLegend: null,
            components: null,
            layerConstructor: null,
            themeLayers: null,

            postCreate: function() {
                changeThemeWidget = this;
                map = changeThemeWidget.mapRef;
                infoWindow = changeThemeWidget.infoWindowRef;
                infoTemplate = changeThemeWidget.infoTemplateRef;
                layer = changeThemeWidget.newLayer;
                layerTitle = changeThemeWidget.layerTitle;
                option = changeThemeWidget.option;
                pVal = changeThemeWidget.components === undefined? null: changeThemeWidget.components.pVal;
                basemap = changeThemeWidget.basemapRef;
                Legend = changeThemeWidget.mapLegend;
                layerConstructor = changeThemeWidget.layerConstructor;
                themeLayers= changeThemeWidget.themeLayers;
                checkboxids = changeThemeWidget.components === undefined? null: changeThemeWidget.components.checkboxid;
                control = dom.byId(layer + "Select") ? (layer + "Select") : "noControl";
                if (checkboxids) {
                    // if boxes are checked through url parameters
                    changeThemeWidget.autoCheckBoxes(checkboxids);
                }

                on(query("." + layer + "cbx"), "change", function(e) {
                    //if boxes are checked manually
                    changeThemeWidget.changeBox();
                    changeThemeWidget.manualCheckBoxes(e.currentTarget.id);
                });
                changeThemeWidget.resetMap();
                changeThemeWidget.addFunction(layer, themeLayers[layer].popupFunc, themeLayers[layer].service, themeLayers);
                changeThemeWidget.loadTheme(themeLayers); //call loadTheme for the first time
            },

            autoCheckBoxes: function(boxes) {
                for (var i = 0; i < boxes.length; i++) {
                    checkBox(boxes[i]);
                }

                function checkBox(box) {
                    dom.byId(box.replace("-", "")).checked = box.indexOf("-") > -1 ? false : true;
                }
                checkboxids = "";
                layer === "trans" ? (changeThemeWidget.checkOHVDisclaimer(themeLayers)) : "";
            },

            manualCheckBoxes: function(box) {
                dom.byId(box).checked = dom.byId(box).checked ? true : false;
            },

            changeBox: function() {
                changeThemeWidget.addFunction(layer, themeLayers[layer].popupFunc, themeLayers[layer].service, themeLayers);
                changeThemeWidget.loadTheme(themeLayers);
                layer === "survey" ? (changeThemeWidget.setCalibZoom()) : "";
                layer === "trans" ? (changeThemeWidget.checkOHVDisclaimer(themeLayers)) : "";
            },

            addFunction: function(layer, name, path, Layers) {
                var layers = Layers[layer].lyrs ? Layers[layer].lyrs : [];
                var checked = query("input." + layer + "cbx:checked");
                var len = checked.length;
                for (var i = 0; i < len; i++) {
                    changeThemeWidget.createLayer(Layers, domAttr.get(checked[i], "data-value"));
                    layers.push(domAttr.get(checked[i], "data-opt"));
                }
                changeThemeWidget.runIT(path, name, layers);
            },

            createLayer: function(Layers, id) {
                if (lmG[id] === undefined) { //if it's undefined it hasn't been created yet.
                    for (var x in layerConstructor["layers"]) {
                        if (layerConstructor["layers"][x].layerId === id) {
                            lmG[id] = new ArcGISDynamicMapServiceLayer(layerConstructor["mapFolder"] + layerConstructor["layers"][x].serviceName + layerConstructor["serverType"], {
                                id: id,
                                opacity: layerConstructor["layers"][x].opacity
                            });
                            layerConstructor["layers"][x].visible ? (lmG[id].setVisibleLayers(layerConstructor["layers"][x].visible)) : void(0);
                          Layers[id].layerName = lmG[id]; //add to themeLayers
                        }
                    }
                } //end main if
            },

            resetMap: function() {
                map.infoWindow.hide();
                map.infoWindow.resize(350, 300);
                lmG.pLay.infoTemplate = '';
                //use the maptype variable when sharing a map through email. First set it to empty, then fill it with the current selection.
                lmG.maptype = "";
                lmG.maptype = layer;
                 //Set theme dropdown text node
                dom.byId("layerSelect").childNodes[0].nodeValue = layerTitle;
                query('#enterpriseSelect, #surveySelect, #demographSelect, #districtsSelect, #engdocsSelect, #landdevSelect, #politicalSelect, #schoolsSelect, #topoSelect, #floodSelect, .noLoad, #transSelect, #lawSelect, #vacantSelect, #zoningSelect').style("display", "none");
                dom.byId(control).style.display = "block";
            },

            setCalibZoom: function() {
                if (dom.byId("calib").checked) {
                    dom.byId('calibzoom').removeAttribute("disabled", "disabled");
                } else {
                    dom.byId('calibzoom').setAttribute("disabled", "disabled");
                }

                on(dom.byId("calibzoom"), "click", function() {
                    var utm12 = new SpatialReference({
                        wkid: 102206
                    });
                    var calibExt = new Extent({
                        "xmin": 697322,
                        "ymin": 4334595,
                        "xmax": 698932,
                        "ymax": 4335382,
                        "spatialReference": utm12
                    });
                    map.setExtent(calibExt);
                });
            },

            checkOHVDisclaimer: function(Layers) {
                query(".noLoad").forEach(function(node) {
                    domStyle.set(node, "display", "none");
                });
                if (query("input.transcbx")[0].checked === true) {
                    map.addLayers([lmG.loadLabels]);
                    query(".noLoad").forEach(function(node) {
                        domStyle.set(node, "display", "block");
                    });
                } else if (query("input.transcbx")[0].checked !== true &&
                    lmG.loadLabels !== undefined){
                    map.removeLayer(lmG.loadLabels);
                }

                if (query("input.transcbx")[1].checked === true) {
                    if (!(document.cookie.indexOf("ohvDisclaimer") >= -1) || (window.localStorage.getItem("ohvDisclaimer") !== "Accepted OHV Disclaimer")) {
                        var dial = new ConfirmDialog({
                            title: "Disclaimer",
                            href: "_static/ohvDisclaimer.html",
                            closable: false,
                            draggable: false,
                            style: "width:50em;margin:0 auto;color:white;background:#A59F91;padding:1em;border-radius:4px;font-size:0.75em;",
                            class: "ohvDisclaimer",
                            buttonOk: "Accept",
                            ButtonCancel: "Reject",
                            onCancel: function() {
                                query("input.transcbx")[1].checked = false;
                                changeThemeWidget.loadTheme(Layers);
                            },
                            onExecute: function() {
                                var useLocalStorage = changeThemeWidget.supports_local_storage();
                                var useCookie = cookie.isSupported();
                                if (useLocalStorage) {
                                    window.localStorage.setItem("ohvDisclaimer", "Accepted OHV Disclaimer");
                                } else {
                                    var exp = 1; // number of days to persist the cookie
                                    cookie("ohvDisclaimer", "Accepted OHV Disclaimer", {
                                        expires: 1
                                    });
                                }
                            }
                        });
                        dial.startup();
                        dial.show();
                    }
                }
            },

            loadTheme: function(Layers) {
                var themeArray = loadArray(Layers); //Create an array of layer names from themeLayers keys
                removeLayers(themeArray); // Remove all loaded layers in the map

                function loadArray(data) {
                    var newArray = [];
                    for (var t in data) {
                        if (data.hasOwnProperty(t)) {
                            newArray.push(t);
                        }
                    }
                    return newArray;
                }

                //Add the selected theme layer to the map
                for (var x in Layers) {
                    if (x === layer) {
                        if ((layer === "eassessor")) {
                            map.infoWindow = infoWindow;
                            lmG.pLay.infoTemplate = infoTemplate;
                            pushLayers('Basemap Layers', l = 0, x = 0);
                        } else if (control !== "noControl") {
                            function layerlist() {
                                return array.map(query("input." + layer + "cbx:checked"), function(item) {
                                    return item.attributes['data-value'].value;
                                });
                            }
                            addLayers(layerlist(), x = 0);
                            pushLayers(" ", layerlist(), x = 0);
                        } else {
                            changeThemeWidget.createLayer(Layers, x);
                            addLayers(l = 0, x);
                            pushLayers(layerTitle, l = 0, x);
                        }
                    } //end main if
                } //end for loop

                function pushLayers(layertitle, layerlist, x) {
                    var mapLegendLayers = [];
                    push('Basemap Layers', basemap, [7, 12, 17, 22, 23, 24, 25, 26, 27, 28, 32, 35, 36, 37, 38, 39, 50, 51]);

                    if (x === 0 && !(layerlist === 0)) {
                        for (i = 0; i < layerlist.length; i++) {
                            push(layertitle, Layers[(layerlist[i])].layerName, Layers[(layerlist[i])].lyrs ? Layers[(layerlist[i])].lyrs : []);
                            map.reorderLayer(Layers[(layerlist[i])].layerName, 1)
                        }

                    } else if (layerlist === 0 && !(x === 0)) {
                        push(layertitle, Layers[x].layerName, Layers[x].lyrs ? Layers[x].lyrs : []);
                    }

                    function push(title, layerName, hidelayers) {
                        mapLegendLayers.push({
                            layer: layerName,
                            title: title,
                            hideLayers: hidelayers
                        });
                        Legend.refresh(mapLegendLayers);
                    }
                    Legend.refresh(mapLegendLayers);
                }

                function addLayers(layerlist, x) {
                    if (!(layerlist === 0)) {
                        len = layerlist.length
                        for (i = 0; i < len; i++) {
                            map.addLayer(Layers[(layerlist[i])].layerName);
                        }
                    } else {
                        map.addLayer(Layers[x].layerName);
                    }
                }

                function removeLayers(themeArray) {
                    var mappingLayers = map.layerIds; //Array of all currently loaded map layers
                    var graphicsLayers = map.graphicsLayerIds; //Array of all currently loaded graphics layers

                    //Here we intersect mappingLayers and the themeArray which is an array of all the possible layer themes in the map
                    var frank = intersectArrays(themeArray, mappingLayers);
                    var joe = intersectArrays(themeArray, graphicsLayers);

                    //http://www.falsepositives.com/index.php/2009/12/01/javascript-function-to-get-the-intersect-of-2-arrays/ This was the solution for array intersection
                    function intersectArrays(firstArray, secondArray) {
                        var dict = {},
                            intersected = [],
                            selected;

                        var arrayLength1 = firstArray.length;
                        for (i = 0; i < arrayLength1; i++) {
                            dict[firstArray[i]] = true;
                        }
                        arrayLength2 = secondArray.length;
                        for (i = 0; i < arrayLength2; i++) {
                            selected = secondArray[i];
                            if (selected in dict) {
                                intersected.push(selected);
                            }
                        }
                        return intersected;
                    }

                    if (frank.length != 0) {
                        for (i = 0; i < frank.length; i++) {
                            map.removeLayer(map.getLayer(frank[i]));
                        }
                    }

                    if (joe.length > 0) {
                        for (var i = 0; i < joe.length; i++) {
                            var mac = map.getLayer(joe[i]).id;
                            for (var x in Layers) {
                                if (x === mac) {
                                    map.removeLayer(Layers[x].layerName);
                                }
                            }
                        }
                    }

                }
            },

            runIT: function(opt, name, lyrs) {
                map.graphics.clear();
                var len = lyrs.length;
                lmG.pLay.infoTemplate = '';
                var deferred;
                if(checkboxClick){
                    checkboxClick.remove()
                }
                checkboxClick = on(map, "click", function(evt) {
                        var IT = new IdentifyTask("https://mcgis.mesacounty.us/arcgis/rest/services/maps/" + opt + "/MapServer/");
                        var IP = new IdentifyParameters();
                        IP.geometry = evt.mapPoint;
                        IP.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
                        IP.returnGeometry = false;
                        IP.layerIds = lyrs;
                        IP.width = map.width;
                        IP.height = map.height;
                        IP.mapExtent = map.extent;
                        //Set how far away you can click and still select the item
                        IP.tolerance = (name === "towers" ? 8 : 3);
                        deferred = IT.execute(IP, function() {
                            name !== null ? IdentifyTemplates[name](evt, deferred, len, map, opt) : null;
                        });
                    }) //end click or tap
            },

            supports_local_storage: function() {
                try {
                    return 'localStorage' in window && window['localStorage'] !== null;
                } catch (e) {
                    return false;
                }
            }

        }) //end declare
}); // end define
