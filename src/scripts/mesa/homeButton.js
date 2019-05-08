define([
     "dojo/_base/declare", "dijit/_WidgetBase", "esri/geometry/Extent", "dojo/dom-attr",
     "dojo/query", "dojo/on", "dojo/NodeList-traverse", "dojo/NodeList-manipulate"
 ], function (declare, _WidgetBase, Extent, domAttr, query, on) {

    return declare("homeButton", [_WidgetBase], {
               mapRef: null,

        postCreate: function () {
            const map = this.mapRef;
            query(".esriSimpleSliderIncrementButton").after("<div title='Zoom to map extent' class='esriSimpleSliderHomeButton'></div>");
            domAttr.set(query(".esriSimpleSliderHomeButton").next()[0], "title", "Zoom Out");
            domAttr.set(query(".esriSimpleSliderHomeButton").parent()[0], "title", "Zoom In");
            on(query(".esriSimpleSliderHomeButton"), "click", function () {

                var x = new Extent({
                    "xmin": 685960,
                    "ymin": 4316261,
                    "xmax": 738288,
                    "ymax": 4342506,
                    "spatialReference": 102206
                });
                map.setExtent(x);
                map.graphics.clear();
            });
    } //end postCreate
}); // end declare
});// end define
