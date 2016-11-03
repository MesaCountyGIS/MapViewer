//>>built
require({cache:{"url:esri/dijit/metadata/editor/templates/ValidationPane.html":'\x3cdiv class\x3d"gxeValidationPane" style\x3d"display:none;"\x3e\r\n  \x3cdiv\x3e\r\n    \x3cdiv class\x3d"gxeClickableText" style\x3d"display:none;"\r\n      data-dojo-attach-point\x3d"clearNode" \r\n      data-dojo-attach-event\x3d"onclick: _onClearClick"\r\n      \x3e${i18nBase.validationPane.clearMessages}\x3c/div\x3e\r\n    \x3cdiv class\x3d"gxeValidationPrompt" style\x3d"display:none;"\r\n      data-dojo-attach-point\x3d"promptNode" \r\n      \x3e${i18nBase.validationPane.prompt}\x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"gxeContent" data-dojo-attach-point\x3d"containerNode"\x3e\x3c/div\x3e\r\n\x3c/div\x3e'}});
define("esri/dijit/metadata/editor/ValidationPane","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/dom-class dojo/dom-construct dojo/dom-style dojo/has ../base/Templated ../base/ValidationMessage dojo/text!./templates/ValidationPane.html ../../../kernel".split(" "),function(b,f,g,e,h,c,k,l,m,n,p){b=b([l],{editor:null,templateString:n,postCreate:function(){this.inherited(arguments)},_addChild:function(d,a,c){var b=h.create("div",{},this.containerNode);new m({message:d,inputWidget:a,isValid:c,
validationPane:this},b)},addWarning:function(d,a){this._addChild(d,a);this._toggleClear(!0);this._toggleVisibility(!0);this.editor&&this.editor.editDocumentPane&&e.add(this.editor.editDocumentPane.domNode,"gxeRepairMode")},clearMessages:function(){g.forEach(this.getChildren(),function(a){a._isGxeValidationMessage&&a.destroyRecursive(!1)});this._toggleClear(!1);this._toggleVisibility(!1);try{this.containerNode.scrollTop=0}catch(d){}},_onClearClick:function(d){this.clearMessages()},_toggleClear:function(d){var a=
this.clearNode,b=this.promptNode;d?(c.set(a,"display","inline-block"),c.set(b,"display","inline-block")):(c.set(a,"display","none"),c.set(b,"display","none"))},_toggleVisibility:function(b){var a=this.domNode;b?c.set(a,"display","block"):c.set(a,"display","none");this.editor&&this.editor.editDocumentPane&&(e.remove(this.editor.editDocumentPane.domNode,"gxeRepairMode"),this.editor.resizeDocument(this.editor.editDocumentPane))},whenComplete:function(){this.editor&&this.editor.editDocumentPane&&e.contains(this.editor.editDocumentPane.domNode,
"gxeRepairMode")&&this.editor.resizeDocument(this.editor.editDocumentPane)}});k("extend-esri")&&f.setObject("dijit.metadata.editor.ValidationPane",b,p);return b});