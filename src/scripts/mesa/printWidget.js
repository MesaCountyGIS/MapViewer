//This widget is meant to be used with the ESRI Print Task and Print Parameters
define([
     "dojo/_base/declare", "dojo/dom-construct", "dojo/dom", "dojo/dom-class", "dojo/dnd/move", "dojo/query", "dojo/touch",
    "esri/tasks/PrintTask", "esri/tasks/PrintParameters", "esri/tasks/PrintTemplate", "esri/dijit/Print", "dojo/on",
     "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/printDialog.html", "dojo/domReady!"
 ], function (declare, domConstruct, dom, domClass, move, query, touch,
    PrintTask, PrintParameters, PrintTemplate, Print, on, _WidgetBase, _TemplatedMixin, template) {
        var map;

    return declare("printWidget", [_WidgetBase, _TemplatedMixin], {

        templateString: template,
        printUrl: null,
        mapRef: null,
        device:null,
        callBack: null,
        widgetTitle: "Export For Printing",
        mapTitle: "Mesa County Map",
        widget: null,
        button: null,


        postCreate: function () {
            this.inherited(arguments);
            domConstruct.place(this.domNode, this.srcNodeRef.id, "before");
            domClass.add(this.domNode, "query");

            printWidget = this;
            device = printWidget.device;
            map = this.mapRef;
            callback = printWidget.callBack? printWidget.callBack: function(){void(0)};
            if (device === "desktop") {
                new move.parentConstrainedMoveable(this.domNode, {
                    handle: this.printHeader,
                    area: "margin",
                    within: true
                });
            }

            on(printWidget.closePrint, touch.release, function(){
                printWidget.closeClick();
            })
        },

        startup: function () {
            this.inherited(arguments);
        },

        _setSpinnerAttr: function (dis) {
            dis === 'show'? (domConstruct.place("<div id='progressbar' data-dojo-attach-point='progressbar'>Exporting...<span class='spinner'></span></div>", dom.byId(this.mapRef.id), "before")):
             domConstruct.destroy("progressbar");
        },

        closeClick: function (e) {
            printWidget.domNode.style.display = "none";
            printWidget.mapTitle.value = "";
            printWidget.printLayout[0].selected = "true";
            printWidget.printLayout[0].selected = "true";
            callback();
        },
        exportClick: function () {
            printWidget.set("spinner", "show");
            var printTask = new PrintTask(this.printUrl, {
                    async: true
                }),
                params = new PrintParameters,
                template = new PrintTemplate,
                format = printWidget.printFormat.value;
            layout = printWidget.printLayout.value;
            Title = printWidget.focusNode.value;
            printWidget.cbxLayout.checked && (layout += " with Legend");

            template.exportOptions = {
                width: 1800,
                height: 1200,
                dpi: 96
            };
            template.layoutOptions = {
                titleText: Title
            };
            template.format = format;
            template.layout = layout;
            params.map = map;
            params.template = template;
            params.outSpatialReference = map.spatialReference;
            var printed = printTask.execute(params, printWidget._printResult, printWidget._printError);
            return printed.then(function(e){
                return e
            })
        },

        _printResult: function(result){
            var dev = navigator.userAgent;
            var ios = dev.toLowerCase().match(/(iphone|ipod|ipad)/);
            // if (ios) {
            //     var node = domConstruct.create("a");
            //     node.attr("href", result.url);
            // } else {
                window.open(result.url, "_blank");
                printWidget.set("spinner", "hide");
            // }
        },

        _printError: function (error) {
            alert("there was an error exporting the map!");
            printWidget.set("spinner", "hide");
        }
    }); //end of declare
}); //end of define
