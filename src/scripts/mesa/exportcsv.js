define([
     "dojo/_base/declare", "dojo/dom-construct", "dojo/dom", "dojo/dom-class", "dojo/dnd/move", "dojo/query", "dojo/on", "dojo/dom-style",
    "esri/tasks/QueryTask", "dojo/_base/Color", "esri/symbols/SimpleLineSymbol", "esri/graphic", "esri/layers/FeatureLayer", "dojo/_base/connect",
    "dojo/dom-attr", "dojo/_base/array", "dojo/keys", "esri/tasks/query", "mesa/rangy", "dijit/_WidgetBase", "dojo/request/xhr"

 ], function (declare, domConstruct, dom, domClass, move, query, on, domStyle,
    QueryTask, Color, SimpleLineSymbol, graphic, FeatureLayer, connect,
    domAttr, array, keys, Query, rangy, _WidgetBase, xhr
) {

var csvExport;

    return declare("exportcsv", [_WidgetBase], {
        xhrURL: null,
        outputLocation: null,

        postCreate: function () {
            csvExport = this;
        },

        startup: function () {
            this.inherited(arguments);
        },

            returnCSV: function (csvResult) {
            var fieldNames = [],
                csvList = [],
                encodedData, uri, attNode;
            var fieldLength = csvResult.fields.length;
            var featureLength = csvResult.features.length;
            for (var x = 0, xl = fieldLength; x < xl; x++) {
                fieldNames.push(csvResult.fields[x].name);
            }
            var len = fieldNames.length;
            for (var i = 0; i < len; i++) {
                if (!(fieldNames[i] === "PARCELNUM")) {
                    csvList += fieldNames[i] + ",";
                }
            }

            csvList = csvList.substring(0, csvList.length - 1);
            csvList += "^";
            for (var i = 0, il = featureLength; i < il; i++) {
                for (var f = 0; f < len; f++) {
                    if (!(fieldNames[f] === "PARCELNUM")) {
                        if (!(fieldNames[f] === "SDATE")) {
                            attNode = String(csvResult.features[i].attributes[fieldNames[f]]);
                        } else {
                            var dateVal = (csvResult.features[i].attributes[fieldNames[f]]);
                            if (dateVal) {
                                var newDate = new Date(dateVal);
                                newDate = ((newDate.getMonth() + 1) + "/" + (newDate.getDate() + 1) + "/" + (newDate.getFullYear()));
                                attNode = newDate;
                            } else {
                                attNode = "Unavailable";
                            }
                        }
                        attNode = attNode.replace(/,/g, " ");
                        attNode = attNode.replace(/#/g, "\#");
                        attNode = attNode.replace(/%/g, "\%");
                        attNode = attNode.replace(/"/g, "\"");
                        csvList += attNode + ",";
                    }
                }
                csvList = csvList.substring(0, csvList.length - 1);
                csvList += "^";
            }
            csvList = csvList.substring(0, csvList.length - 1);
            csvList = csvList.replace(/","/g, "\,");
            csvList = csvList.replace(/,"/g, " ");
            csvList = csvList.replace(/",/g, "\,");
            csvList = csvList.replace(/ +(?= )/g, '');

            csvExport._sendXHR(csvExport.xhrURL, csvExport.outputLocation, csvList);

        },

        _sendXHR: function(url, outputLocation, csvList){
            xhr(url, {
                method: "POST",
                data: {
                    csvList: csvList
                }
            }).then(function(fileName){
                fileName = fileName.replace("\\", "/");
                document.location = outputLocation + fileName;
            });
        }

    });
});
