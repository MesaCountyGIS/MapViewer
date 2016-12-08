define([
     "dojo/_base/declare", "dojo/dom-construct", "dojo/dom", "dojo/dom-class", "dojo/dom-attr", "dojo/dnd/move", "dojo/query", "dojo/dom-style",
    "esri/tasks/PrintTask", "esri/tasks/PrintParameters", "esri/tasks/PrintTemplate", "esri/dijit/Print", "dojo/on", "dojo/touch",
     "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/toolsView2.html", "mesa/measureWidget",
    "mesa/printWidget", "mesa/queryWidget", "mesa/bookmarkWidget", "mesa/helpWidget", "mesa/shareFormWidget", "dijit/registry", "mesa/basemapWidget"
], function (declare, domConstruct, dom, domClass, domAttr, move, query, domStyle,
    PrintTask, PrintParameters, PrintTemplate, Print, on, touch, _WidgetBase, _TemplatedMixin, template,
    measureWidget, printWidget, queryWidget, bookmarkWidget, helpWidget, shareFormWidget, registry,
basemapWidget) {
        var map, toolsWidget;

    return declare("toolsWidget2", [_WidgetBase, _TemplatedMixin], {

        templateString: template,
        baseClass: "mesaTools",
        geometryServiceURL: null,
        printURL: null,
        mapRef: null,

        postCreate: function () {
            domConstruct.place(this.domNode, this.srcNodeRef.id, "before");
            toolsWidget = this;
            map = toolsWidget.mapRef;
            gsvc = toolsWidget.geometryServiceURL;
            toolsWidget.domNode.style.display = "block";
            var searchList = '<div id="mobileSearch"><ul><b>Search By<br><br></b>' +
                '<li data-value="address"><a>Address</a></li>' +
                '<li data-value="intersection"><a>Road Intersection</a></li>' +
                '<li data-value="account"><a>Account Number</a></li>' +
                '<li data-value="parcelNo"><a>Parcel Number</a></li>' +
                '<li data-value="subdivision"><a>Subdivision</a></li>' +
                '<li data-value="PLSS"><a title="Search by Township, Range and Section">Township/Range</a></li>' +
                '<li data-value="place"><a>Place Name</a></li>' +
                '<li data-value="Latitude/Longitude"><a>Latitude/Longitude</a></li>' +
            '</ul></div>';
            domConstruct.place(searchList, query(".mesaTools")[0], "before");

            on(query('#mobileSearch ul li'), "click", openSearchDialog);
            on(dom.byId("toolPanel"), touch.release, displayTool);
            on(query(".mainSideMenu")[0], touch.release, dispatchMainMenuClick);
            on(query('.themeMenu li'), "click", setThemeMenuCheckmark);
            on(dom.byId('backMenu'), touch.release, setBackButtonTarget);

            function openSearchDialog(e){
                e.stopPropagation();
                var type = this.getAttribute('data-value');
                dom.byId('mobileSearch').style.display = "none";
                registry.byId("searchFieldDialog")? registry.byId("searchFieldDialog").destroyRecursive(): void(0);
                dom.byId("mobileSearch").style.display = "none";
                searchBy(type, undefined, "mobile", "toolsView");
                toolsWidget.backToMap();
            }

            function displayTool(e){
                var name = (domAttr.get(e.target, "data-toolName"));
                dom.byId(name).style.display = "block";
            }

            function dispatchMainMenuClick(e){
                toPage = domAttr.has(e.target, 'data-to')?
                    domAttr.get(e.target, 'data-to'): undefined;
                if(toPage !== undefined){
                    // dom.byId('backMenu').style.display = 'block';
                    domClass.add(query(".mainSideMenu")[0], "displayNo");
                    domClass.remove(query("." + toPage)[0], "displayNo");
                    domAttr.set('backMenu', 'data-to', 'mainSideMenu');
                    domAttr.set('backMenu', 'data-from', toPage);
                }
            }

            function setThemeMenuCheckmark(e){
                var spanList = this.parentNode.getElementsByTagName('span');
                console.log(spanList)
                var thisSpan = this.getElementsByTagName('span')[0];
                console.log(thisSpan)
                for (i = 0; i < spanList.length; i++){
                    spanList[i].innerHTML = '';
                };
                thisSpan.innerHTML = "&#10004;";
            }

            function setBackButtonTarget(e){
                var backToPage = domAttr.get(e.target, 'data-to');
                var fromPage = domAttr.get(e.target, 'data-from');
                domClass.add(query("." + fromPage)[0], "displayNo");
                domClass.remove(query("." + backToPage)[0], "displayNo");
            }


        },

        startup: function () {
            this.inherited(arguments);
        },

        backToMap: function () {
            // query("#map_zoom_slider, #hidePanel, #rightPanel, .collapsedPanel").style("display", "block");
            toolsWidget.domNode.style.display = "none";
        },

        _changeMenuState: function(){

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

        basemapClick: function () {
                if (!(registry.byId("imagelist2"))) { //remove the 2 after user caches have been updated
                        lmG.imageTool = new basemapWidget({
                               device: "mobile"
                        }, "imagelist2");
                        lmG.imageTool.startup();
                        lmG.imageTool.basemapChanger();
                } else if((registry.byId("imagelist2"))){
                    lmG.imageTool.basemapChanger();
                }
            this.backToMap();
        },

        searchClick: function () {
            // dom.byId("mobileSearch").style.display = "block";
            // dom.byId("autocompleteSearch").style.display = "block";
            // this.backToMap();
        },

        onClose: function (){
            dom.byId("toolPanel").style.display = "none";
            query("#map_zoom_slider, #hidePanel, #rightPanel, .collapsedPanel").style("display", "block");
        }

    }); //end of declare
}); //end of define
