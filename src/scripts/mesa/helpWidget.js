define([
     "dojo/_base/declare", "dojo/dom-construct", "dojo/dom", "dojo/dom-class", "dojo/dnd/move", "dojo/query", "mesa/problemFormWidget", "dijit/registry", "dojo/touch", "dojo/on",
     "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/HelpDialog.html", "dojo/domReady!"
 ], function (declare, domConstruct, dom, domClass, move, query, problemFormWidget, registry, touch, on,
     _WidgetBase, _TemplatedMixin, template) {
         var helpWidget;

    return declare("helpWidget", [_WidgetBase, _TemplatedMixin], {

        templateString: template,
        device:null,

        postCreate: function () {
            this.inherited(arguments);
            domConstruct.place(this.domNode, this.srcNodeRef.id, "before");

            helpWidget = this;
            device = helpWidget.device;
            if (device === "desktop") {
                new move.parentConstrainedMoveable(this.domNode, {
                    handle: this.queryHeader,
                    area: "margin",
                    within: true
                });
            }
            // on(query(".closeHelp"), touch.release, function () {
            //     helpWidget.closeClick();
            // });
            on(query(helpWidget), touch.release, function (a) {
                a.target.href? window.open(a.target.href, "_blank"): void(0);
            });

            on(helpWidget.sendMail, touch.release, function () {
                helpWidget.showProblemForm();
            });
        },

        showProblemForm: function(){
            if (dom.byId("problemForm2") && !(registry.byId("problemForm2"))) { //remove the 2 after user caches have been updated
                var problemForm = new problemFormWidget({
                    emailServiceUrl: "scripts/php/mailerror.php",
                    device: "desktop",
                }, "problemForm2");
                problemForm.startup();
                this.domNode.style.display = "none";
            }
            if (dom.byId("problemForm2")) {
                dom.byId("problemForm2").style.display = dom.byId("problemForm2").style.display === "block" ? "none" : "block";
            }
        },

        startup: function () {
            this.inherited(arguments);
        },

    closeClick: function(){
        helpWidget.domNode.style.display = "none";
    }

});//end declare
});//end define
