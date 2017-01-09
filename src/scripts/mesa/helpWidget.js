define([
     "dojo/_base/declare", "dojo/dom-construct", "dojo/dom", "dojo/dom-class", "dojo/dom-attr", "dojo/dnd/move", "dojo/query", "mesa/problemFormWidget", "dijit/registry", "dojo/touch", "dojo/on",
     "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/HelpDialog.html", "dojo/domReady!"
 ], function (declare, domConstruct, dom, domClass, domAttr, move, query, problemFormWidget, registry, touch, on,
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
            // if (device === "desktop") {
            //     new move.parentConstrainedMoveable(this.domNode, {
            //         handle: this.queryHeader,
            //         area: "margin",
            //         within: true
            //     });
            // }
            // on(query(".closeHelp"), touch.release, function () {
            //     helpWidget.closeClick();
            // });
            // on(query(helpWidget), touch.release, function (a) {
            //     a.target.href? window.open(a.target.href, "_blank"): void(0);
            // });

            on(helpWidget.sendMail, touch.release, function () {
                helpWidget.showProblemForm();
            });
        },

        showProblemForm: function(){
            if (dom.byId("problemForm") && !(registry.byId("problemForm"))) { //remove the 2 after user caches have been updated
                var problemForm = new problemFormWidget({
                    emailServiceUrl: "scripts/php/mailerror.php",
                    device: "desktop",
                }, "problemForm");
                problemForm.startup();
                // this.domNode.style.display = "none";
            }
            domAttr.set('backMenu', 'data-to', "helpTool");
            domAttr.set('backMenu', 'data-from', "problemForm");
            //hide the search menu
            domClass.add(query(".helpTool")[0], "displayNo");
            domClass.remove(query(".problemForm")[0], "displayNo");
        },

        startup: function () {
            this.inherited(arguments);
        },

    closeClick: function(){
        helpWidget.domNode.style.display = "none";
    }

});//end declare
});//end define
