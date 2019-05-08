define([
    "dojo/query",
    "dojo/on",
    "dojo/touch",
    "dojo/dom",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/dom-class",
    "esri/geometry/Extent",
    "esri/SpatialReference",
    "dojo/_base/array",
    "esri/dijit/Legend",
    "dojo/_base/declare",
    "dojo/text!./templates/legendDialog.html",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/NodeList-dom",
    "dojo/domReady!"
], function(query, on, touch, dom, domAttr, domConstruct, domStyle, domClass, Extent,
    SpatialReference, array, Legend, declare, template, _WidgetBase, _TemplatedMixin) {

    // var legend, legendWidget, defaultBasemap, map, popup, legendLayers = [];

    return declare("legendWidget", [_WidgetBase, _TemplatedMixin], {

        templateString: template,
        mapRef: null,
        defaultBasemap: null,
        popupRef: null,
        attachControl: null,
        legendObject: null,

        postCreate: function() {
          console.log("jimmg")
            //Place the widget if it hasn't been placed already
            if(!(dom.byId(this.domNode))){
                domConstruct.place(this.domNode, this.srcNodeRef.id, "before");
            }
            const legendWidget = this;
            const defaultBasemap = legendWidget.defaultBasemap;
            const map = legendWidget.mapRef;
            const popup = legendWidget.popupRef;
            const legendToggleButtonId = legendWidget.attachControl.id;
            const legendObject = legendWidget.legendObject;
            const legendLayers = [];

            on(dom.byId(legendToggleButtonId), touch.release, function() {
                legendWidget.toggleDialog();
            });

            //if the legend is not yet created
            legendWidget.createLegend();
        },

        createLegend: function() {
            legendLayers.push({
                layer: defaultBasemap,
                title: 'Basemap Layers',
                hideLayers: [
                    7,12,17,22,23,24,25,26,27,28,32,35,36,37,38,39,50,51
                ]
            });

            // legendObject.srcNodeRef = dom.byId("legendDiv");
            legendObject.refresh(legendLayers);

            if (popup === 'popup') {
                legendWidget.toggleDialog();
                //Run the makeBoxesMoveable function from app.js
                //this should be pulled out and put in app.js
                makeBoxesMoveable();
            }
        },

        toggleDialog: function() { //fires on click of #DTLegend and #IPLegend - toggles the legend
            if (domClass.contains(dom.byId(legendWidget.domNode), "displayNo")) {
                dom.byId(legendWidget.domNode).style.display = "block";
                (domClass.remove(dom.byId(legendWidget.domNode), "displayNo"));
            } else {
                dom.byId(legendWidget.domNode).style.display = "none";
                (domClass.add(dom.byId(legendWidget.domNode), "displayNo"));
            }
        },

    }) //end declare
}); // end define
