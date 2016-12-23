define([
    "dojo/_base/declare", "dojo/dnd/move", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/shareFormDialog.html",
    "esri/tasks/GeometryService", "dojo/_base/xhr", "dojo/query", "dojo/dom", "dojo/dom-style", "dojo/touch",
    "dojo/dom-construct", "dojo/dom-class", "dojo/on", "dojo/NodeList-traverse", "dojo/NodeList-manipulate"
 ], function (declare, move, _WidgetBase, _TemplatedMixin, template, GeometryService, xhr, query,
    dom, domStyle, touch, domConstruct, domClass, on) {

        var shareWidget, map;

    return declare("shareFormWidget", [_WidgetBase, _TemplatedMixin], {

        templateString: template,
        emailServiceUrl: null,
        mapRef: null,
        successMessage: null,

        postCreate: function () {
            this.inherited(arguments);
            domConstruct.place(this.domNode, this.srcNodeRef.id, "before");
            // domClass.add(this.domNode, "query");
            shareWidget = this;
            map = shareWidget.mapRef;

            new move.parentConstrainedMoveable(this.domNode, {
                handle: this.shareHeader,
                area: "margin",
                within: true
            });

            on(query(shareWidget), touch.release, function (a) {
                a.target.href? window.open(a.target.href, "_blank"): void(0);
            });

            // on(shareWidget.closer, touch.release, function(){
            //     shareWidget.domNode.style.display = "none";
            // })

        },

        startup: function () {
            this.inherited(arguments);
        },

        sendClick: function () {
            shareWidget.validateTips.className = "validateTips";
            query(shareWidget.validateTips).text("All form fields are required.");
            var bValid = true;
            var name = shareWidget.shareName;
            var emailFrom = shareWidget.fromEmail;
            var emailS = shareWidget.shareEmail;
            var dialog = shareWidget.domNode;
            bValid = bValid && shareWidget._checkLength(name, 1, "Please enter a name.", shareWidget.validateTips);
            bValid = bValid && shareWidget._checkRegexp(emailFrom, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "Use email format name@mail.com", this.validateTips);
            bValid = bValid && shareWidget._checkRegexp(emailS, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "Use email format name@mail.com", this.validateTips);
            if (bValid === true) {
                var fromEmail = emailFrom.value;
                var message = name.value + "( " + fromEmail + " ) has shared a Mesa County Map view with you. Click the following link to open the map.\n\n " + shareWidget._createURL() + "\n\nIf you cannot click on the link, copy the address and paste it into a browser." + "\n\nDo Not Respond To This Email!\nThis email was generated from an unmonitored address.";
                var email = emailS.value;
                xhr.post({
                    url: shareWidget.emailServiceUrl,
                    content: {
                        name: name.value,
                        email: email,
                        message: message
                    },
                    load: function (r) {
                        if (r === "Message sent!") {
                            confirm("Map was shared successfully!");
                            name.value = "";
                            emailS.value = "";
                            emailFrom.value = "";
                        }
                    },
                    error: function (error) {
                        confirm("There was an error sending this map")
                    }
                })
            }
        },

        clearClick: function () {
            shareWidget.shareName.value = "";
            shareWidget.shareEmail.value = "";
            shareWidget.fromEmail.value = "";
        },

        _createURL: function(){
            var type = lmG.maptype;
            if (type === undefined) {
                type = "eassessor";
            } else {
                type = type;
            }
            var mapextt = aG.map.extent;
            var url = "http://emap.mesacounty.us/viewer?EXTENT=" + String(mapextt.xmin.toFixed(0) + ':' + mapextt.ymin.toFixed(0) + ':' + mapextt.xmax.toFixed(0) + ':' + mapextt.ymax.toFixed(0)) +
                "&maptype=" + type;
            return url
        },

        _checkLength: function(text, chars, message, errObject){
            if (!(text.value.length > chars)) {
                errObject.className = "state-error";
                query(errObject).text(message);
                return false;
            } else {
                return true;
            }
        },

        _checkRegexp: function(o, regexp, n, errObject) {
            if (!(regexp.test(o.value))) {
                errObject.className = "state-error";
                query(errObject).text(n);
                return false;
            } else {
                return true;
            }
        }

    }); //end of declare
}); //end of define
