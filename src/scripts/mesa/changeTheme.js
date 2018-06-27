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
            // themeLayers: null,

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
                // layerConstructor = changeThemeWidget.layerConstructor;
                // themelayers= changeThemeWidget.themeLayers;
                JSONConfig = JSON.parse(JSONConfig);
                layerConstructor = JSONConfig.layerConstructor;
                themeLayers = JSONConfig.themeLayers;
                checkboxids = changeThemeWidget.components === undefined? null: changeThemeWidget.components.checkboxid;
                control = dom.byId(layer + "Select") ? (layer + "Select") : "noControl";

                // layer visibiliity in the legend is controlled by the lyrs value
                // themeLayers = {
                //     "towers": {
                //         layerName: lmG.towers,
                //         popupFunc: 'towers',
                //         service: 'PublicSafety'
                //     },
                //     "eassessor": 0,
                //     "enterprise": {
                //         layerName: lmG.enterprise,
                //         popupFunc: 'enterprise',
                //         service: 'Enterprise_Zones'
                //     },
                //     "opportunity": {
                //         layerName: lmG.enterprise,
                //         popupFunc: 'enterprise',
                //         service: 'Enterprise_Zones'
                //     },
                //     "firedist": {
                //         layerName: lmG.firedist,
                //         popupFunc: 'subList',
                //         service: 'Districts'
                //     },
                //     "flood": {
                //         layerName: lmG.flood,
                //         popupFunc: 'flood',
                //         service: 'Floodmap'
                //     },
                //     "futureland": {
                //         layerName: lmG.futureland,
                //         popupFunc: 'flu',
                //         service: 'Future_Land_Use',
                //         lyrs: [4, 6, 8, 9, 12, 13, 14, 15, 17]
                //     },
                //     "currentdev": {
                //         layerName: lmG.currentdev,
                //         popupFunc: 'landDev',
                //         service: 'Land_Development_Projects'
                //     },
                //     "histdev": {
                //         layerName: lmG.histdev,
                //         popupFunc: 'landDev',
                //         service: 'Land_Development_Projects'
                //     },
                //     "weeds": {
                //         layerName: lmG.weeds,
                //         popupFunc: 'wds',
                //         service: 'Weeds',
                //         lyrs: [0]
                //     },
                //     "persigo": {
                //         layerName: lmG.persigo,
                //         popupFunc: 'persigo',
                //         service: 'Persigo'
                //     },
                //     "propsales": {
                //         layerName: lmG.propsales,
                //         popupFunc: 'sales',
                //         service: 'Sales',
                //         // lyrs: [0]
                //     },
                //     "sewer": {
                //         layerName: lmG.sewer,
                //         popupFunc: 'subList',
                //         service: 'Districts'
                //     },
                //     "septic": {
                //         layerName: lmG.septic,
                //         popupFunc: 'sep',
                //         service: 'Septic_Locations',
                //         lyrs: [0]
                //     },
                //     "patrol": {
                //         layerName: lmG.patrol,
                //         popupFunc: 'law',
                //         service: 'SO_Areas'
                //     },
                //     "shoot": {
                //         layerName: lmG.shoot,
                //         popupFunc: 'law',
                //         service: 'SO_Areas',
                //         lyrs: [1]
                //     },
                //     "law": {
                //         layerName: lmG.law,
                //         popupFunc: 'law',
                //         service: 'SO_Areas'
                //     },
                //     "soils": {
                //         layerName: lmG.soils,
                //         popupFunc: 'soilTyp',
                //         service: 'Soils'
                //             // lyrs: [0,1,3,4,5]
                //     },
                //     "stormwater": {
                //         layerName: lmG.stormwater,
                //         popupFunc: 'strm',
                //         service: 'Stormwater'
                //             // lyrs: [1, 2, 3, 4, 5, 7, 8, 9, 10, 12, 14]
                //     },
                //     "survey": {
                //         layerName: lmG.survey,
                //         popupFunc: 'subList',
                //         service: 'eSurveyor'
                //     },
                //     "cameras": {
                //         layerName: lmG.cameras,
                //         popupFunc: 'trans',
                //         service: 'transportation'
                //     },
                //     "trails": {
                //         layerName: lmG.trails,
                //         popupFunc: 'trl',
                //         service: 'Trails',
                //         // lyrs: [0, 1, 2]
                //     },
                //     "vacant": {
                //         layerName: lmG.vacant,
                //         popupFunc: 'vac',
                //         service: 'Vacant_Lands'
                //     },
                //     "platag": {
                //         layerName: lmG.platag,
                //         popupFunc: 'vac',
                //         service: 'Vacant_Lands'
                //     },
                //     "platnoag": {
                //         layerName: lmG.platnoag,
                //         popupFunc: 'vac',
                //         service: 'Vacant_Lands'
                //     },
                //     "unplatag": {
                //         layerName: lmG.unplatag,
                //         popupFunc: 'vac',
                //         service: 'Vacant_Lands'
                //     },
                //     "unplatnoag": {
                //         layerName: lmG.unplatnoag,
                //         popupFunc: 'vac',
                //         service: 'Vacant_Lands'
                //     },
                //     "zoning": {
                //         layerName: lmG.zoning,
                //         popupFunc: 'zon',
                //         service: 'Zoning',
                //         // lyrs: [16, 15]
                //     },
                //     "mesasims": {
                //         layerName: lmG.mesasims,
                //         popupFunc: 'subList',
                //         service: 'eSurveyor'
                //     },
                //     "deltasims": {
                //         layerName: lmG.deltasims,
                //         popupFunc: 'subList',
                //         service: 'eSurveyor'
                //     },
                //     "districts": {
                //         layerName: lmG.districts,
                //         popupFunc: 'dist',
                //         service: 'Districts'
                //     },
                //     "soilcon": {
                //         layerName: lmG.soilcon,
                //         popupFunc: 'dist',
                //         service: 'Districts'
                //     },
                //     "cemetery": {
                //         layerName: lmG.cemetery,
                //         popupFunc: 'dist',
                //         service: 'Districts'
                //     },
                //     "conserv": {
                //         layerName: lmG.conserv,
                //         popupFunc: 'dist',
                //         service: 'Districts'
                //     },
                //     "hospital": {
                //         layerName: lmG.hospital,
                //         popupFunc: 'dist',
                //         service: 'Districts'
                //     },
                //     "san": {
                //         layerName: lmG.san,
                //         popupFunc: 'dist',
                //         service: 'Districts'
                //     },
                //     "pest": {
                //         layerName: lmG.pest,
                //         popupFunc: 'dist',
                //         service: 'Districts'
                //     },
                //     "water": {
                //         layerName: lmG.water,
                //         popupFunc: 'dist',
                //         service: 'Districts'
                //     },
                //     "improv": {
                //         layerName: lmG.improv,
                //         popupFunc: 'dist',
                //         service: 'Districts'
                //     },
                //     "tac": {
                //         layerName: lmG.tac,
                //         popupFunc: 'dist',
                //         service: 'Districts'
                //     },
                //     "citylimits": {
                //         layerName: lmG.citylimits,
                //         popupFunc: 'dist',
                //         service: 'Districts'
                //     },
                //     "monuments": {
                //         layerName: lmG.monuments,
                //         popupFunc: 'subList',
                //         service: 'eSurveyor'
                //     },
                //     "datumdif": {
                //         layerName: lmG.datumdif,
                //         popupFunc: 'subList',
                //         service: 'eSurveyor'
                //     },
                //     "calib": {
                //         layerName: lmG.calib,
                //         popupFunc: 'subList',
                //         service: 'eSurveyor'
                //     },
                //
                //     "surveycontours": {
                //         layerName: lmG.surveycontours,
                //         popupFunc: 'subList',
                //         service: 'eSurveyor'
                //     },
                //     "surveydem": {
                //         layerName: lmG.surveydem,
                //         popupFunc: 'subList',
                //         service: 'eSurveyor'
                //     },
                //     "irrig": {
                //         layerName: lmG.irrig,
                //         popupFunc: 'subList',
                //         service: 'Districts'
                //     },
                //     "drain": {
                //         layerName: lmG.drain,
                //         popupFunc: 'subList',
                //         service: 'Districts'
                //     },
                //     "schools": {
                //         layerName: lmG.schools,
                //         popupFunc: 'schools',
                //         service: 'Schools'
                //     },
                //     "cells": {
                //         layerName: lmG.cells,
                //         popupFunc: 'schools',
                //         service: 'Schools'
                //     },
                //     "distbound": {
                //         layerName: lmG.distbound,
                //         popupFunc: 'schools',
                //         service: 'Schools'
                //     },
                //     "elem": {
                //         layerName: lmG.elem,
                //         popupFunc: 'schools',
                //         service: 'Schools'
                //     },
                //     "middle": {
                //         layerName: lmG.middle,
                //         popupFunc: 'schools',
                //         service: 'Schools'
                //     },
                //     "fruita": {
                //         layerName: lmG.fruita,
                //         popupFunc: 'schools',
                //         service: 'Schools'
                //     },
                //     "high": {
                //         layerName: lmG.high,
                //         popupFunc: 'schools',
                //         service: 'Schools'
                //     },
                //     "commdist": {
                //         layerName: lmG.commdist,
                //         popupFunc: 'pol',
                //         service: 'eElections'
                //     },
                //     "precincts": {
                //         layerName: lmG.precincts,
                //         popupFunc: 'pol',
                //         service: 'eElections'
                //     },
                //     "board": {
                //         layerName: lmG.board,
                //         popupFunc: 'pol',
                //         service: 'eElections'
                //     },
                //     "sthouse": {
                //         layerName: lmG.sthouse,
                //         popupFunc: 'pol',
                //         service: 'eElections'
                //     },
                //     "stsen": {
                //         layerName: lmG.stsen,
                //         popupFunc: 'pol',
                //         service: 'eElections'
                //     },
                //     "coundist": {
                //         layerName: lmG.coundist,
                //         popupFunc: 'pol',
                //         service: 'eElections'
                //     },
                //     "demograph": {
                //         layerName: lmG.demograph,
                //         popupFunc: 'demograph',
                //         service: 'Census_Zip'
                //     },
                //     "zip": {
                //         layerName: lmG.zip,
                //         popupFunc: 'demograph',
                //         service: 'Census_Zip'
                //     },
                //     "census2010": {
                //         layerName: lmG.census2010,
                //         popupFunc: 'demograph',
                //         service: 'Census_Zip'
                //     },
                //     "topo": {
                //         layerName: lmG.topo,
                //         popupFunc: 'topo',
                //         service: 'Elevation'
                //     },
                //     "contours01": {
                //         layerName: lmG.contours01,
                //         popupFunc: 'topo',
                //         service: 'Elevation'
                //     },
                //     "contours12": {
                //         layerName: lmG.contours12,
                //         popupFunc: 'topo',
                //         service: 'Elevation'
                //     },
                //     "dem": {
                //         layerName: lmG.dem,
                //         popupFunc: 'subList',
                //         service: 'Elevation'
                //     },
                //     "sub": {
                //         layerName: lmG.sub,
                //         popupFunc: 'subList',
                //         service: 'eSurveyor'
                //     },
                //     "dep": {
                //         layerName: lmG.dep,
                //         popupFunc: 'subList',
                //         service: 'eSurveyor'
                //     },
                //     "hist": {
                //         layerName: lmG.hist,
                //         popupFunc: 'subList',
                //         service: 'eSurveyor'
                //     },
                //     "glo": {
                //         layerName: lmG.glo,
                //         popupFunc: 'subList',
                //         service: 'eSurveyor'
                //     },
                //     "deed": {
                //         layerName: lmG.deed,
                //         popupFunc: 'subList',
                //         service: 'eSurveyor'
                //     },
                //     "ded": {
                //         layerName: lmG.ded,
                //         popupFunc: 'subList',
                //         service: 'eSurveyor'
                //     },
                //     "vac": {
                //         layerName: lmG.vac,
                //         popupFunc: 'subList',
                //         service: 'eSurveyor'
                //     },
                //     "book": {
                //         layerName: lmG.book,
                //         popupFunc: 'subList',
                //         service: 'eSurveyor'
                //     },
                //     "proc": {
                //         layerName: lmG.proc,
                //         popupFunc: 'subList',
                //         service: 'eSurveyor'
                //     },
                //     "engdocs": {
                //         layerName: lmG.engdocs,
                //         popupFunc: 'engdocs',
                //         service: 'EngineeringTechDocs'
                //     },
                //     "struc": {
                //         layerName: lmG.struc,
                //         popupFunc: 'engdocs',
                //         service: 'EngineeringTechDocs'
                //     },
                //     "drnrep": {
                //         layerName: lmG.drnrep,
                //         popupFunc: 'engdocs',
                //         service: 'EngineeringTechDocs'
                //     },
                //     "geotech": {
                //         layerName: lmG.geotech,
                //         popupFunc: 'engdocs',
                //         service: 'EngineeringTechDocs'
                //     },
                //     "traffic": {
                //         layerName: lmG.traffic,
                //         popupFunc: 'engdocs',
                //         service: 'EngineeringTechDocs'
                //     },
                //     "asbuilt": {
                //         layerName: lmG.asbuilt,
                //         popupFunc: 'engdocs',
                //         service: 'EngineeringTechDocs'
                //     },
                //     "floodstud": {
                //         layerName: lmG.floodstud,
                //         popupFunc: 'engdocs',
                //         service: 'EngineeringTechDocs'
                //     },
                //     "drainplan": {
                //         layerName: lmG.drainplan,
                //         popupFunc: 'engdocs',
                //         service: 'EngineeringTechDocs'
                //     },
                //     "load": {
                //         layerName: lmG.load,
                //         popupFunc: 'trans',
                //         service: 'LoadLimits'
                //     },
                //     "ohv": {
                //         layerName: lmG.ohv,
                //         popupFunc: 'trans',
                //         service: 'transportation'
                //     },
                //     "trans": {
                //         layerName: lmG.trans,
                //         popupFunc: 'trans',
                //         service: 'transportation'
                //     },
                //     "speed": {
                //         layerName: lmG.trans,
                //         popupFunc: 'trans',
                //         service: 'transportation'
                //     },
                //     "counts": {
                //         layerName: lmG.trans,
                //         popupFunc: 'trans',
                //         service: 'transportation'
                //     },
                //     "perm": {
                //         layerName: lmG.perm,
                //         popupFunc: 'subList',
                //         service: 'eSurveyor'
                //     },
                //     "landdev": {
                //         layerName: lmG.landdev,
                //         popupFunc: 'landDev',
                //         service: 'Land_Development_Projects'
                //     },
                //     "political": {
                //         layerName: lmG.political,
                //         popupFunc: 'pol',
                //         service: 'eElections'
                //     },
                //     "loadLabels": {
                //         layerName: lmG.loadLabels,
                //         popupFunc: 'subList',
                //         service: 'LoadLimits'
                //     },
                //     "trs": {
                //         layerName: lmG.trs,
                //         popupFunc: 'subList',
                //         service: 'eSurveyor'
                //     },
                //     "floodsections": {
                //         layerName: lmG.floodsections,
                //         popupFunc: 'flood',
                //         service: 'Floodmap'
                //     },
                //     "floodbase": {
                //         layerName: lmG.floodbase,
                //         popupFunc: 'flood',
                //         service: 'Floodmap'
                //     },
                //     "floodbasins": {
                //         layerName: lmG.floodbasins,
                //         popupFunc: 'flood',
                //         service: 'Floodmap'
                //     },
                //     "floodcontours": {
                //         layerName: lmG.floodcontours,
                //         popupFunc: 'flood',
                //         service: 'Floodmap'
                //     },
                //     "floodpanelindex": {
                //         layerName: lmG.floodpanelindex,
                //         popupFunc: 'flood',
                //         service: 'Floodmap'
                //     },
                //     "floodreg": {
                //         layerName: lmG.floodreg,
                //         popupFunc: 'flood',
                //         service: 'Floodmap'
                //     },
                //     "floodnonreg": {
                //         layerName: lmG.floodnonreg,
                //         popupFunc: 'flood',
                //         service: 'Floodmap'
                //     },
                //     "boardbound": {
                //         layerName: lmG.boardbound,
                //         popupFunc: 'schools',
                //         service: 'Schools'
                //     }
                // };

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

            then: function() {
                // callback();
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
                          // if(id !== 'surveydem'){
                            lmG[id] = new ArcGISDynamicMapServiceLayer(layerConstructor["mapFolder"] + layerConstructor["layers"][x].serviceName + layerConstructor["serverType"], {
                                id: id,
                                opacity: layerConstructor["layers"][x].opacity
                            });
                            layerConstructor["layers"][x].visible ? (lmG[id].setVisibleLayers(layerConstructor["layers"][x].visible)) : void(0);
                          // } else {
                          //   require(["esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/ArcGISImageServiceLayer"], function(ArcGISTiledMapServiceLayer,ArcGISImageServiceLayer) {
                          //       // lmG[id] = new ArcGISTiledMapServiceLayer('https://mcgis.mesacounty.us/image/rest/services/DEM/DEM_Lidar/ImageServer', {
                          //       //     id: id,
                          //       //     opacity: layerConstructor["layers"][x].opacity
                          //       // });
                          //         lmG[id] = new ArcGISImageServiceLayer('https://mcgis.mesacounty.us/image/rest/services/DEM/DEM_Lidar/ImageServer',
                          //         {id: id});
                          //   });
                          // }

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
                query('#enterpriseSelect, #surveySelect, #demographSelect, #districtsSelect, #engdocsSelect, #landdevSelect, #politicalSelect, #schoolsSelect, #topoSelect, #floodSelect, .noLoad, #transSelect, #lawSelect, #vacantSelect').style("display", "none");
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
