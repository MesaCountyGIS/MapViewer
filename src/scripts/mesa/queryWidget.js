define([
     "dojo/_base/declare", "dojo/dom-construct", "dojo/dom", "dojo/dom-class", "dojo/dnd/move", "dojo/query", "dojo/on", "dojo/touch", "dojo/dom-style",
    "esri/tasks/QueryTask", "dojo/_base/Color", "esri/symbols/SimpleLineSymbol", "esri/graphic", "esri/layers/FeatureLayer", "dojo/_base/connect",
    "dojo/dom-attr", "dojo/_base/array", "dojo/keys", "esri/tasks/query", "mesa/rangy", "mesa/exportcsv", "mesa/graphicsTools",
        "esri/symbols/SimpleFillSymbol", "esri/toolbars/draw", "esri/tasks/BufferParameters", "esri/tasks/GeometryService", "esri/graphicsUtils",
     "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/queryDialog.html", "dojo/domReady!", "dojo/NodeList-manipulate", "dojo/NodeList-traverse",
        "dojo/NodeList-dom"
 ], function (declare, domConstruct, dom, domClass, move, query, on, touch, domStyle,
            QueryTask, Color, SimpleLineSymbol, Graphic, FeatureLayer, connect,
            domAttr, array, keys, Query, rangy, exportcsv, graphicsTools, SimpleFillSymbol, Draw, BufferParameters, GeometryService, graphicsUtils,
            _WidgetBase, _TemplatedMixin, template) {

            var queryWidget;
            var functionStopper = 0;
            var returnToolsClick, returnQueryClick;
            var locator = {}, CSV,
                map, result, field, selectedLI, gsvc, graphicTools;
            var selValue, selectionToolbar, selectQuery, loqQueryTask, splitText, loqGeomType;
            return declare("queryWidget", [_WidgetBase, _TemplatedMixin], {
                    templateString: template,
                    device: null,
                    mapRef: null,
                    geometryServiceURL: null,
                    exportURL: null,
                    csvOutputLocation: null,

                    postCreate: function () {

                        this.inherited(arguments);
                        domConstruct.place(this.domNode, this.srcNodeRef.id, "before");

                        queryWidget = this;
                        device = queryWidget.device;
                        map = queryWidget.mapRef;
                        splitText = undefined;
                        geomType = undefined;
                        selectionToolbar = new Draw(map);
                        gsvc = new GeometryService(queryWidget.geometryServiceURL);
                        graphicTools = new graphicsTools({
                            geometryServiceURL: queryWidget.geometryServiceURL,
                            mapRef: map
                        });

                        CSV = exportcsv({
                            xhrURL: queryWidget.exportURL,
                            outputLocation: queryWidget.csvOutputLocation
                        })

                        // if (device === "desktop") {
                        //     domStyle.set(dom.byId("closeQuery"), 'display', "block");
                        //     domStyle.set(dom.byId("returnToMap"), 'display', "none");
                        //     domStyle.set(dom.byId("returnToTools"), 'display', "none");
                        //     new move.parentConstrainedMoveable(this.domNode, {
                        //         handle: this.queryHeader,
                        //         area: "margin",
                        //         within: true
                        //     });
                        // }else{
                        //     query(".closeQuery")[0].innerHTML = "Cancel";
                        // }

                        on(query(".queryHeader a"), touch.release, function (e) {
                            var targetTab = e.target ? e.target : e.srcElement;
                            query(".queryHeader a").forEach(function (tab) {
                                tab.className = ''
                            });
                            domClass.add(targetTab, "tabActivated");

                            if (targetTab.id === "attributeTab") {
                                // device === "mobile"? query(".closeQuery")[0].innerHTML = "Close": void(0);
                                queryWidget.tabClick(".locationItem, .inlineLocationItem", ".attributeItem", ".inlineAttributeItem");
                            } else {
                                // device === "mobile"? query(".closeQuery")[0].innerHTML = "Cancel": void(0);
                                queryWidget.tabClick(".attributeItem, .inlineAttributeItem", ".locationItem", ".inlineLocationItem");
                            }
                        });

                        // on(dom.byId("closeQuery"), touch.release, function () {
                        //     queryWidget.closeClick();
                        // });

                        on(dom.byId("addBuffer"), "click", function () {
                            if (domClass.contains(dom.byId('bufferSelection'), "displayNo")) {
                                domClass.replace(dom.byId('bufferSelection'), "showBlock", "displayNo");
                            } else {
                                domClass.replace(dom.byId('bufferSelection'), "displayNo", "showBlock");
                            }
                        });

                        on(dom.byId("addBufferQuery"), "click", function () {
                            if (domClass.contains(query(".queryFields")[0], "displayNo")) {
                                domClass.replace(query(".queryFields")[0], "showBlock", "displayNo");
                            } else {
                                domClass.replace(query(".queryFields")[0], "displayNo", "showBlock");
                            }
                        });

                        on(dom.byId("qLayer"), "change", function () {
                            queryWidget.clearHelpText();
                            dom.byId("qWhere").value = dom.byId("qFields").value = dom.byId("qFields").innerHTML = "";
                            dom.byId("getExamples").innerHTML = "Get Examples";
                            dom.byId("showExamples").style.display = "none";
                            dom.byId("showExamples").innerHTML = dom.byId("showExamples").value = "";
                            selValue = query('select[name=qLayer]')[0].value;
                            if (!(selValue === "none")) {
                                attQueryTask = new QueryTask("http://mcmap2.mesacounty.us/arcgis/rest/services/maps/" + selValue);
                                attQuery = new Query();
                                attQuery.returnGeometry = true;
                                attQuery.outFields = ["*"];
                                attQuery.where = "OBJECTID > 0";
                                attQueryTask.execute(attQuery, queryWidget._showResult);
                            }
                        });

                        on(dom.byId("getExamples"), "click", function () {
                            if (!(dom.byId("showExamples").style.display === "none")) {
                                dom.byId("showExamples").style.display = "none";
                                dom.byId("getExamples").innerHTML = "Show Examples";
                            } else {
                                if (splitText !== undefined) {
                                    queryWidget.getExamples(splitText[0], splitText[1]);
                                    dom.byId("getExamples").innerHTML = "Close Examples";
                                    dom.byId("showExamples").style.display = "none";
                                }
                            }
                        });

                        on(query("#qButtons button"), "click", function (e) {
                            var targetButton = e.target ? e.target : e.srcElement;
                            if (targetButton.title != "Field examples") {
                                queryWidget.clearHelpText();
                                if (targetButton.title === "Like" || targetButton.title === "In") {
                                    dom.byId("SQLhelpText").style.display = "block";
                                    dom.byId("SQLhelpText").innerHTML = targetButton.title === "Like" ? "Replace the word <b style='background-color:AliceBlue;'>value</b> above with your input" :
                                        "Replace the word <b style='background-color:AliceBlue;'>value(n)</b> above with your<br>input Separate values with a comma";
                                }
                                queryWidget.buildWhere("qWhere", targetButton.value);
                            }
                        });

                        on(dom.byId('clearWhere'), "click", function () {
                            dom.byId("qWhere").value = "";
                            dom.byId("showExamples").style.display = "none";
                            dom.byId("getExamples").innerHTML = "Get Examples";
                            dom.byId("showExamples").value = "";
                            queryWidget.clearHelpText();
                        });

                        on(dom.byId("qWhere"), "keypress", function (e) {
                            return keys.ENTER === e.keyCode ? (e.preventDefault(), queryWidget.runQuery()) : void(0);
                        });

                        on(dom.byId("attdisplayby"), "change", function () {
                            var changeval = query('select[name=attdisplayby]')[0].value;
                            queryWidget.submitQuery(changeval);
                        });

                        on(dom.byId("csv"), "click", function () {
                            ga('send', 'event', 'Query', 'Queryexport', 'Exported to CSV');
                            attQueryTask.execute(geomQuery, CSV.returnCSV);
                        });

                        on(query("#qButtonBlock span"), "click", function (event) {
                            if(query("#qLayer")[0].value === "none"){
                            confirm("Please select a layer first")
                        }else{
                            //Why does _drawfunc get called as many times as qButtonBlock spans are clicked? I don't know but functionStopper stops it.
                            functionStopper = 0;
                            var t;
                            query("#qButtonBlock span").style("backgroundColor", "white")
                            domStyle.set(this, "backgroundColor", "#ABABAB")
                            t = String(query(this).attr("data-toolName"))
                            lmG.pLay.infoTemplate = "";
                            map.setMapCursor("crosshair");

                            switch (t) {
                            case "POINT":
                                selectionToolbar.activate(Draw.MULTI_POINT);
                                locator.point = selectionToolbar.on("draw-end", queryWidget._drawfunc)
                                ga('send', 'event', 'queryDrawTool', 'toolUsed', 'Point');
                                break;
                            case "LINE":
                                selectionToolbar.activate(Draw.POLYLINE);
                                locator.line = selectionToolbar.on("draw-end", queryWidget._drawfunc)
                                ga('send', 'event', 'queryDrawTool', 'toolUsed', 'Polyline');
                                break;
                            case "POLYGON":
                                selectionToolbar.activate(Draw.POLYGON);
                                locator.poly = selectionToolbar.on("draw-end", queryWidget._drawfunc)
                                ga('send', 'event', 'queryDrawTool', 'toolUsed', 'Polygon');
                                break;
                            case "RECTANGLE":
                                selectionToolbar.activate(Draw.RECTANGLE);
                                locator.rect = selectionToolbar.on("draw-end", queryWidget._drawfunc)
                                ga('send', 'event', 'queryDrawTool', 'toolUsed', 'Rectangle');
                                break;
                            case "FREEHAND_POLYLINE":
                                selectionToolbar.activate(Draw.FREEHAND_POLYLINE);
                                locator.pLineFree = selectionToolbar.on("draw-end", queryWidget._drawfunc)
                                ga('send', 'event', 'queryDrawTool', 'toolUsed', 'Freehand Polyline');
                                break;
                            case "FREEHAND_POLYGON":
                                selectionToolbar.activate(Draw.FREEHAND_POLYGON);
                                locator.pGonFree = selectionToolbar.on("draw-end", queryWidget._drawfunc)
                                ga('send', 'event', 'queryDrawTool', 'toolUsed', 'Freehand Polygon');
                                break;
                            default:
                                break;
                            }

                            // if(device === "mobile"){
                            //     dom.byId("toolsView").style.display = "none";
                            //     dom.byId("hidePanel").style.display = "block";
                            //     queryWidget.domNode.style.display = "none";
                            // }

                            }
                        });

                        // on(query(".returnToMap")[0], "click", function (e) {
                        //     dom.byId("toolsView").style.display = "none";
                        //     queryWidget.domNode.style.display = "none";
                        //     dom.byId("toolPanel").style.display = "block";
                        //     query("#map_zoom_slider, #hidePanel, #rightPanel, .collapsedPanel").style("display", "block");
                        // });

                        // on(query(".returnToTools")[0], "click", function (e) {
                        //     if(domClass.contains(dom.byId("resultDiv"), "displayNo")){
                        //         queryWidget.domNode.style.display = "none";
                        //         dom.byId("toolPanel").style.display = "none";
                        //         dom.byId("toolsView").style.display = "block";
                        //         dom.byId("hidePanel").style.display = "none";
                        //     }else{
                        //         queryWidget.backToQueryClick();
                        //     }
                        //
                        // });
                    },

                    startup: function () {
                        this.inherited(arguments);
                    },

                    // closeClick: function () {
                    //     map.graphics.clear();
                    //     queryWidget._clearQuery();
                    //     domClass.contains(dom.byId("tabSpan"), 'displayNo') ? (domClass.remove(dom.byId("tabSpan"), 'displayNo'),
                    //         domClass.add(dom.byId("resultDiv"), 'displayNo')) : void(0);
                    //     dom.byId("querytabPanel").style.display = "block";
                    //     dom.byId("toolsView").style.display = "none";
                    //     dom.byId("returnToTools").innerHTML = "Tools";
                    //     dom.byId("hidePanel").style.display = "block";
                    //     queryWidget.domNode.style.display = "none";
                    // },

                    _clearQuery: function () {
                        dom.byId("queryResultDialog").style.display = "none";
                        query("#qLayer").val("option:contains('None Selected')", 'true');
                        dom.byId("qFields").innerHTML = "";
                        query("#SQLhelpText, #qWhere").forEach(function (n) {
                            n.value = "";
                        });
                        query("#queryDialog", "#queryResultDialog", "#showExamples", "#SQLhelpText").forEach(function(x){
                            x.style.display = "none";
                        });
                    },

                    clearClick: function (e) {
                        e.preventDefault();
                        map.graphics.clear();
                    },

                    clearHelpText: function () {
                        dom.byId("SQLhelpText").style.display = "none";
                        dom.byId("SQLhelpText").value = "";
                    },

                    backToQueryClick: function () {
                        dom.byId("querytabPanel").style.display = "block";
                        dom.byId("queryResultDialog").style.display = "none";
                        // dom.byId("returnToTools").innerHTML = "Tools";
                        queryWidget._toggleHeader();
                    },

                    tabClick: function (hide, showBlock, showInline) {
                        query(showBlock).forEach(function (node) {
                            domClass.replace(node, "showBlock", "displayNo");
                        });
                        query(showInline).forEach(function (node) {
                            domClass.replace(node, "showInline", "displayNo");
                        });
                        query(hide).forEach(function (node) {
                            domClass.replace(node, "displayNo", "showBlock showInline");
                        });
                    },

                    runQuery: function (type) {
                        if(!(domClass.contains(queryWidget.locationTab, "tabActivated")) && (selValue === undefined || queryWidget.qWhere === "")){
                        confirm("Please select a layer and provide a where statement")
                    }else{
                        ga('send', 'event', 'attQuery', 'attQueryLayer', selValue);
                        dom.byId("querytabPanel").style.display = "none";
                        dom.byId("queryResultDialog").style.display = "block";
                        // dom.byId("returnToTools").innerHTML = "Query";
                        // domClass.replace(dom.byId("returnToTools"), "returnToQuery", "returnToTools");
                        type !== "location"? queryWidget.submitQuery(): void(0);
                        queryWidget._toggleHeader();
                    }
                    },

                    _toggleHeader: function () {
                        query(".queryHeader span, .queryHeader div").toggleClass("displayNo");
                    },

                    _showResult: function (results) {
                        var html = "<ul>",
                            html2 = "",
                            dataType;
                        var fieldsLength = results.fields.length;
                        geomType = results.features[0].geometry.type;
                        for (var i = 0, il = fieldsLength; i < il; i++) {
                            if (results.fields[i].type === "esriFieldTypeString") {
                                dataType = "String";
                            } else if (results.fields[i].type === "esriFieldTypeDouble") {
                                dataType = "Double";
                            } else if (results.fields[i].type === "esriFieldTypeInteger") {
                                dataType = "Integer";
                            } else if (results.fields[i].type === "esriFieldTypeOID") {
                                dataType = "OID";
                            }
                            html += "<li>" + String(results.fields[i].name) + " (" + dataType + ")" + "</li>";
                            html2 += "<option value='" + String(results.fields[i].name) + "'>" + String(results.fields[i].name) + "</option>";
                        }
                        html += "</ul>";
                        //Display fields used to build the where clause
                        dom.byId("qFields").innerHTML = html;
                        //Populate list of fields that the results should be listed by
                        dom.byId("attdisplayby").innerHTML = html2;

                        on(query('#qFields li'), "click", function () {
                            dom.byId("showExamples").innerHTML = "";
                            dom.byId("showExamples").style.display = "none";
                            query("#getExamples").innerHTML("Get Examples");
                            splitText = this.innerHTML.split(' ');
                            if (splitText[1] === "(Double)" || splitText[1] === "(Integer)") {
                                query(".dimButtons").forEach(function (i) {
                                    i.disabled = true;
                                })
                            } else {
                                query(".dimButtons").forEach(function (i) {
                                    i.disabled = false
                                })
                            }
                            queryWidget.buildWhere("qWhere", splitText[0]);
                        });
                    },

                    buildWhere: function (box, text) {
                        text = " " + text;
                        var whereBox = dom.byId(box);
                        var selText = rangy.extractSelectedText(whereBox, text);
                        if (selText === "value") {
                            text = text.slice(1, -1);
                            rangy.replaceSelectedText(whereBox, text);
                        } else if (!(selText === "value") && (selText.length > 0)) {
                            rangy.replaceSelectedText(whereBox, text);
                            whereBox.value += (text + " ");
                        } else {
                            whereBox.value += (text + " ");
                        }
                    },

                    getExamples: function (fieldName, type) {
                        exampleQuery = new Query();
                        exampleQuery.returnGeometry = false;
                        exampleQuery.outFields = [fieldName];
                        exampleQuery.supportsAdvancedQueries = true;
                        exampleQuery.returnDistinctValues = true;
                        var whereString = fieldName;
                        switch (type) {
                        case "(OID)":
                        case "(Integer)":
                            whereString += " <> ''";
                            break;
                        case "(String)":
                            whereString += " <> '' AND " + fieldName + " <> 'Common' AND NOT " + fieldName + " LIKE 'M%' AND NOT " + fieldName + " LIKE '%DPT%' AND NOT " + fieldName + " LIKE '%PENDING%' AND " + fieldName + " IS NOT NULL AND " + fieldName + " NOT LIKE '%[.]00[%]%'";
                            break;
                        case "(Double)":
                            whereString += " > '0' AND " + fieldName + " IS NOT NULL";
                            break;
                        default:
                            whereString += " <> ''";
                        }
                        exampleQuery.where = whereString;

                        attQueryTask.execute(exampleQuery, showExamples);

                        function showExamples(results) {
                            var values = [],
                                uniqueValues = [];
                            var featuresLength = results.features.length;
                            for (var i = 0, il = featuresLength; i < il; i++) {
                                values.push(results.features[i].attributes[splitText[0]]);
                            }
                            array.forEach(values, function (el, i) {
                                if (array.indexOf(el, uniqueValues) === -1) {
                                    uniqueValues.push(el);
                                }
                            })
                            dom.byId("showExamples").style.display = "inline-block";
                            var html = "<ul>";
                            for (var i = 0, il = uniqueValues.length; i < il; i++) {
                                html += "<li>" + uniqueValues[i] + "</li>";
                            }
                            html += "</ul>";
                            dom.byId("showExamples").innerHTML = html;
                            on(query('#showExamples ul li'), "click", function () {
                                var listVal;
                                if (splitText[1] === "(String)") {
                                    var listVal = "'" + this.innerHTML + "'";
                                } else {
                                    listVal = this.innerHTML;
                                }
                                queryWidget.buildWhere("qWhere", listVal);
                            });
                        }
                    },

                    submitQuery: function (changefield) {
                        if (changefield || dom.byId("qWhere").value) {
                            require([
                "esri/geometry/Extent", "esri/SpatialReference"
            ], function (Extent, SpatialReference) {
                                var utm12 = new SpatialReference({
                                    wkid: 102206
                                });
                                var countyExtent = new Extent({
                                    "xmin": 580802,
                                    "ymin": 4175457,
                                    "xmax": 892217,
                                    "ymax": 4428929,
                                    "spatialReference": utm12
                                });
                                geomQuery = new Query();
                                if (dom.byId('checkExtent').checked) {
                                    geomQuery.geometry = map.extent;
                                } else {
                                    geomQuery.geometry = countyExtent;
                                }
                                geomQuery.returnGeometry = true;
                                geomQuery.outFields = ["*"];

                                if (!changefield) {
                                    query('select[name=attdisplayby]')[0].value = splitText[0];
                                    geomQuery.where = dom.byId("qWhere").value;
                                } else {
                                    splitText[0] = changefield;
                                    geomQuery.where = dom.byId("qWhere").value;
                                }
                                attQueryTask.execute(geomQuery, queryWidget._showSelected);
                            })
                        } else {
                            return
                        }
                    },


                    _showSelected: function (results) {
                        var fieldNames = [],
                            showHTML = "<ul>",
                            obID;
                        var fieldsLength = results.fields.length;
                        var featuresLength = results.features.length;
                        if (domClass.contains(dom.byId("locationTab"), "tabActivated")) {
                                if (dom.byId("clearGraphic").checked) {
                                    map.graphics.clear();
                                }
                            }else{
                                map.graphics.clear();
                            }

                            if(results.geometryType === "esriGeometryPolygon"){
                                for (var i = 0, il = featuresLength; i < il; i++) {
                                    map.graphics.add(new Graphic(graphicTools.createJSONPolygon(results.features[i].geometry.rings, "noclear", "esriSFSSolid", [220, 20, 60])));
                                }
                                map.setExtent(graphicsUtils.graphicsExtent(map.graphics.graphics))
                            }

                            for (var x = 0, xl = fieldsLength; x < xl; x++) {
                                fieldNames.push(results.fields[x].name);
                            }
                            for (var i = 0, il = featuresLength; i < il; i++) {
                                obID = results.features[i].attributes["OBJECTID"];
                                showHTML += "<li><span class='arrowSpan'>&#9654;</span><div class='resultdiv' style='display:inline;'>" + results.features[i].attributes[splitText[0]] + "<span style='display:none'>" + obID + "</span>";
                            }
                            showHTML += "</div></li></ul>"; dom.byId("resultWindow2").innerHTML = showHTML;
                            var x = dom.byId('qLayer');
                            var layer = x.options[x.selectedIndex].innerHTML; dom.byId("resultLabel").innerHTML = layer;

                            on(query('#resultWindow2 ul li'), "click", function () {
                                var thisObjectID = query(this).children('div').children('span').innerHTML();
                                selectedLI = this;
                                if (query(this).next("#querydiv").length > 0) {
                                    query(this).children('.arrowSpan').html('&#9654;');
                                } else {
                                    query('.arrowSpan').html('&#9654;');
                                    query(this).children('.arrowSpan').html('&#9660;');
                                    resultQuery = new Query();
                                    resultQuery.returnGeometry = true;
                                    resultQuery.outFields = ["*"];
                                    resultQuery.where = "OBJECTID = " + thisObjectID;
                                    attQueryTask.execute(resultQuery, function(result){
                                        queryWidget._showResults(result, "single");
                                    });
                                }
                                query("#querydiv").remove();
                            });
                        },

                        _showResults: function (result, incoming) {
                                var fieldNames = [],
                                    showHTML = "",
                                    gra;
                                var fieldLength = result.fields.length;
                                var featureLength = result.features.length;
                                for (var x = 0, xl = fieldLength; x < xl; x++) {
                                    fieldNames.push(result.fields[x].name);
                                }
                                for (var i = 0, il = featureLength; i < il; i++) {
                                    showHTML = "<table id='querydiv' style='font-size:0.7em;padding-left:1.5em;background-color:#ECF1EF'>";
                                    var len = fieldNames.length;
                                    for (var u = 0; u < len; u++) {
                                        showHTML += "<tr><td style='font-weight:bold;'>" + fieldNames[u] + "</td><td style='padding-left:2em;'>" + result.features[i].attributes[fieldNames[u]] + "</td></tr>";
                                    }
                                }
                                showHTML += "</table>";
                                query(selectedLI).after(showHTML);
                                if (geomType === "polygon") {
                                    if (incoming === "single"){
                                        map.setExtent(result.features[0].geometry.getExtent().expand(1.5))
                                    }else{
                                        // new SimpleLineSymbol().setColor(new Color([255, 0, 0, 0.5]))
                                    map.setExtent((map.graphics.add(gra = new Graphic(graphicTools.createJSONPolygon(result.features[0].geometry.rings)))).geometry.getExtent().expand(1.5));
                                }
                                } else if (geomType === "polyline") {
                                    map.setExtent((map.graphics.add(new Graphic(result.features[0].geometry, new SimpleLineSymbol().setColor(new Color([255, 0, 0, 0.5]))))).geometry.getExtent().expand(1.5));
                                } else if (geomType === "point") {
                                    var lon = result.features[0].geometry.x;
                                    var lat = result.features[0].geometry.y;
                                    graphicTools.zoomToPoint(lon, lat, "");
                                }
                            },

                            _drawfunc: function (results) {
                                //functionStopper stops _drawfunc from running as many times as the draw tool is clicked.
                                if (functionStopper !== 1) {
                                    field = '';
                                    if (typeof results === 'object') {
                                        result = results;
                                    } else {
                                        field = results;
                                    }
                                    //If there is a layer chosen and the query is run using a draw tool, run the following code
                                    if (!(dom.byId("qLayer").value === "none") && field.length === 0) {
                                        queryWidget.domNode.style.display = "block";
                                        // device === "mobile"? query(".closeQuery")[0].innerHTML = "View Map": void(0);
                                        queryWidget._runloqQuery(result, '');
                                        selectionToolbar.deactivate();
                                        query("#qButtonBlock").children('span').style("backgroundColor", "white");
                                        map.setMapCursor("default");
                                        //Otherwise, if the query is being run from the results dialog, pass in the field name so the results can be displayed using it
                                    } else if (!(dom.byId("qLayer").value === "none") && field.length > 0) {
                                        queryWidget._runloqQuery(result, field);
                                    } else {
                                        confirm("Please choose a layer before trying to run the query")
                                    }
                                    functionStopper = 1;
                                }
                            },

                            _runloqQuery: function (results, trig) {
                                ga('send', 'event', 'loqQuery', 'loqQueryLayer', selValue);
                                selectionToolbar.deactivate();
                                lmG.pLay.infoTemplate = aG.pTemp;
                                var bufDist = "",
                                    bufUOM, whereClause;
                                selectQuery = new Query();
                                loqQueryTask = new QueryTask("http://mcmap2.mesacounty.us/arcgis/rest/services/maps/" + selValue);
                                selectQuery.returnGeometry = true;
                                selectQuery.outFields = ["*"];

                                if (trig.length === 0) {
                                    splitText = ["ACCOUNTNO"];
                                } else {
                                    splitText = trig;
                                }

                                if (!(domClass.contains(dom.byId("bufferSelection"), "displayNo")) && (dom.byId("buffDist").value.length > 0 || dom.byId("buffDist").value > 0)) { //We are doing a buffer and a buffere value is listed
                                    var params = new BufferParameters();
                                    bufUOM = dom.byId("bufferUOM").value;
                                    bufDist = dom.byId("buffDist").value;

                                    if (bufUOM === "feet") {
                                        params.unit = GeometryService.UNIT_FOOT;
                                    } else if (bufUOM === "miles") {
                                        params.unit = GeometryService.UNIT_STATUTE_MILE;
                                    } else if (bufUOM === "meters") {
                                        params.unit = GeometryService.UNIT_METER;
                                    } else if (bufUOM === "yards") {
                                        params.unit = GeometryService.UNIT_FOOT;
                                        bufDist = bufDist * 3;
                                    }

                                    params.distances = [bufDist];

                                    gsvc.simplify([results.geometry], function (geometries) {
                                        params.geometries = geometries;
                                        gsvc.buffer(params, function (geom) {
                                            selectQuery.geometry = geom[0];
                                            //if buffer tool and attribute tool are displayed and have a value listed
                                            if (
                                            !(domClass.contains(query(".queryFields")[0], "displayNo")) && dom.byId("qWhere").value.length > 0
                                        ){
                                                selectQuery.where = dom.byId("qWhere").value;
                                                ga('send', 'event', 'loqQuery', 'loqQueryFilter', 'Filtered by attributes and buffer');
                                                fireQuery();
                                            } else {
                                                ga('send', 'event', 'loqQuery', 'loqQueryFilter', 'Filtered by buffer');
                                                fireQuery();
                                            }
                                        });
                                    });
                            } else if (!(domClass.contains(query(".queryFields")[0], "displayNo")) && dom.byId("qWhere").value.length > 0) {
                                    selectQuery.where = dom.byId("qWhere").value;
                                    selectQuery.geometry = results.geometry;
                                    ga('send', 'event', 'loqQuery', 'loqQueryFilter', 'Filtered by attributes');
                                    fireQuery();
                                }else{
                                    ga('send', 'event', 'loqQuery', 'loqQueryFilter', 'loq Query without filter');
                                    selectQuery.geometry = results.geometry;
                                    fireQuery();
                                }

                                function fireQuery() {
                                    queryWidget.runQuery("location");
                                    loqQueryTask.execute(selectQuery, queryWidget._showSelected);
                                }
                            }
                    }); //end of declare
            }); //end of define
