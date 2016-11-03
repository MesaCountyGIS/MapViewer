
define(["dojo/_base/declare", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/dom-construct", "dojo/dom-style", "esri/request", "dojo/dom", "dojo/on", "dijit/registry"],
    function (declare, _WidgetBase, _TemplatedMixin, domConstruct, domStyle, esriRequest, dom, on, registry) {

        return declare("autocomplete", _WidgetBase, {

            inputs: {
                url: null,
                inputNode: null,
                ulNode: null,
                whereField: null,
                outfields: null,
                returnGeometry: null
            },

        startup: function () {
            var input = dom.byId(this.inputNode);
            var ul = dom.byId(this.ulNode);
            var where = this.whereField;
            var field = this.outfields;
            var geom = this.returnGeometry;
            var url = this.url;
            on(input, "keypress", function (event) {
                var len = input.value.length;
                if (len > 2) {
                    var request = esriRequest({
                        url: url,
                        content: {
                            where: where + " LIKE '%" + input.value.replace(/\'/g, '\'\'') + "%'",     //makes single quotes into double for sql
                            outFields: field,
                            returnGeometry: geom,
                            f: "pjson"
                        },
                        // Data format
                        handleAs: "json"
                    });
                    request.then(requestSucceeded, requestFailed)
                }//endIf
                else {
                    domStyle.set(ul, "display", "none");
                }
            })
            function requestSucceeded(response) {
                var features = response.features.slice(0, 19)
                var mainul = "";
                for (i = 0; i < features.length; i++) {
                    mainul += "<li data-x='" + features[i].geometry.x + "' data-y='" + features[i].geometry.y + "'>" + features[i].attributes[where] + "</li>";
                }
                domConstruct.place(mainul, ul, "last");
                domStyle.set(dom.byId('mainfish'), "display", "block");
            }

            function requestFailed (error) {
                console.log("Error: ", error.message);
            }

        }

    })//end declare
})//end define
