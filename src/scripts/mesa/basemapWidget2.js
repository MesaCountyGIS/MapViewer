define([
    "dojo/_base/declare",
    "dojo/dnd/move",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/basemapSelector.html",
    "dojo/query",
    "dojo/dom",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/on",
    "dojo/touch",
    "dojox/gesture/tap",
    "dojo/NodeList-traverse",
    "dojo/NodeList-manipulate"
], function(declare, move, _WidgetBase, _TemplatedMixin,
    template,
    query, dom, domClass, domStyle, domConstruct, domAttr, on, touch, tap) {

    var thisWidget, currentBasemap = [], basemapMemory;
    return declare("basemapWidget", [_WidgetBase, _TemplatedMixin], {
        templateString: template,
        mapRef: undefined,
        device: undefined,
        initialBasemap: undefined,

        postCreate: function() {
            thisWidget = this;
            basemapMemory = currentBasemap.push(thisWidget.initialBasemap);
            map = thisWidget.mapRef;
        },


        basemapChanger: function(target) {
            if(typeof(target) === 'string'){ //if we are going from imagery to vector
                thisWidget.loadYear(target);
                return target;
            }else{ //if going from vector to imagery
                var newLayer = target.attributes['data-value'].nodeValue;
                thisWidget.loadYear(newLayer);
                if(domClass.contains(this, "basemapClick")){
                    thisWidget._change(target.id, "block", "Default Basemap", ["DTimagery", "DTbasemap"]);
                }

                return newLayer;
            }
        },

        _change : function(i, display, message, addRemove) {
            domAttr.set(dom.byId("DTbasemap"), 'title', "Turn on " + message);
            if (thisWidget.device === "desktop") {
                if (domClass.contains(dom.byId("DTbasemap"), addRemove[1])) {
                    domClass.replace(dom.byId("DTbasemap"), addRemove[0], addRemove[1]);
                } else {
                    domClass.replace(dom.byId("DTbasemap"), addRemove[1], addRemove[0]);
                }
            }
        },

        loadYear: function(newBasemap) {
            var imageYear;
            basemapMemory = currentBasemap[0];
            map.removeLayer(currentBasemap[0]);
            currentBasemap.length = 0;
            var historicalImagery = ({
                "vector": thisWidget.initialBasemap,
                "hillshade": lmG.hillshade,
                "usgs": lmG.usgs,
                "A2018": lmG.A2018,
                "A2017": lmG.A2017,
                "A2016": lmG.A2016,
                "A2015": lmG.A2015,
                "A2014": lmG.A2014,
                "A2012": lmG.A2012,
                "A2011": lmG.A2011,
                "A2010": lmG.A2010,
                "A2009": lmG.A2009,
                "A2008": lmG.A2008,
                "A2007": lmG.A2007,
                "A2006": lmG.A2006,
                "A2005": lmG.A2005,
                "A2003": lmG.A2003,
                "A2001": lmG.A2001,
                "A1997": lmG.A1997,
                "A1994": lmG.A1994,
                "A1986": lmG.A1986,
                "A1977": lmG.A1977,
                "A1966": lmG.A1966,
                "A1954": lmG.A1954,
                "A1937": lmG.A1937
            });
            //Add the selected theme layer to the map
            for (var x in historicalImagery) {
                if (x === newBasemap) {
                    imageYear = historicalImagery[x];
                    currentBasemap.push(imageYear);
                    map.addLayer(imageYear);
                    map.reorderLayer(imageYear, 0);
                }
            }
            return imageYear.id;
        }

    }); //end declare

}); //end define
