define([
     "dojo/_base/declare", "dojo/dom-construct", "dojo/dom", "dojo/dom-class", "dojo/dnd/move", "dojo/query", "dojo/_base/xhr", "dojo/touch", "dojo/on",
     "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/problemFormDialog.html", "dojo/domReady!"
 ], function (declare, domConstruct, dom, domClass, move, query, xhr, touch, on,
     _WidgetBase, _TemplatedMixin, template) {

var problemWidget;
    return declare("problemFormWidget", [_WidgetBase, _TemplatedMixin], {

        templateString: template,
        geometryServiceUrl: null,
        emailServiceUrl: null,
        successMessage: null,

        postCreate: function () {
            this.inherited(arguments);
            problemWidget = this;
            domConstruct.place(this.domNode, this.srcNodeRef.id, "before");
            //add a property where you can add a number of classes to the widget on startup
            domClass.add(this.domNode, "query");

            on(problemWidget.closeProblem, touch.release, function(){
                problemWidget.closeClick();
            });
        },

        startup: function () {
            this.inherited(arguments);
        },

        sendClick: function () {
        var bValid = true;
        var name = this.problemName;
        var emailP = this.email;
        var message = this.message;
        var tips = this.validateTips;
        tips.className = "validateTips";
        bValid = bValid && checkLength(name, 1, "Please enter a name", tips);
        bValid = bValid && checkRegexp(emailP, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "Use email format name@mail.com", tips);
        bValid = bValid && checkLength(message, 5, "Please enter a message", tips);
        if (bValid === true) {
            name = name.value;
            message = message.value;
            email = emailP.value;
            xhr.post({
                url: this.emailServiceUrl,
                content: {
                    name: name,
                    email: email,
                    message: message
                },
                load: function (r) {
                    if (r === "Message sent!") {
                        confirm("You have successfully submitted your problem report.");
                        problemWidget.domNode.style.display = "none";
                    }
                },
                error: function (error) {
                    confirm("Error sending report!")
                }
            })
        }
    },

    closeClick: function(){
        this.problemName.value = "";
        this.email.value = "";
        this.message.value = "";
        this.domNode.style.display = "none";
        dom.byId("helpMenu2").style.display = "block";
    }

});//end declare

function checkLength(text, chars, message, errObject) {
        if (!(text.value.length > chars)) {
            errObject.className = "state-error";
            query(errObject).text(message);
            return false;
        } else {
            return true;
        }
    }

    function checkRegexp(o, regexp, n, errObject) {
        if (!(regexp.test(o.value))) {
            errObject.className = "state-error";
            query(errObject).text(n);
            return false;
        } else {
            return true;
        }
    }

});//end define
