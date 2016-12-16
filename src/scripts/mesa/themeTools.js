define([
    "dojo/_base/array",
    "dojo/dom-construct", "dojo/dom-attr", "dojo/dom",
    "dojo/query", "dojo/dom-class", "dojo/dom-style",
    "mesa/changeTheme"
], function (array, domConstruct, domAttr, dom, query, domClass, domStyle, changeTheme) {


        function _themeClick(e, self, map, popupObject, popupTemplateObject, legend, initialBasemap, components) {
            // e.stopPropagation();
            var newLayer = self.attributes['data-value'].nodeValue;
            _getTemplate(newLayer);
            if (newLayer !== 'epom' && newLayer.length > 0) {
                var layerTitle = self.getElementsByTagName('a')[0].innerHTML;
                var option = self.attributes['data-opt']
                    ? self.attributes['data-opt'].nodeValue: null;
                setTimeout(function() {
                    new changeTheme({
                        newLayer: newLayer,
                        layerTitle: layerTitle,
                        option: option,
                        pVal: null,
                        mapRef: map,
                        basemapRef: initialBasemap,
                        infoWindowRef: popupObject,
                        infoTemplateRef: popupTemplateObject,
                        checkboxid: null,
                        mapLegend: legend
                    }).then(_animatePanel(e));
                }, 200);
            }
        }

        function _getTemplate(newLayerName) {
            var templateName = "dojo/text!./scripts/esri/mesa/templates/" + newLayerName + "Select.html";
            document.getElementById(newLayerName + "Select") || require([
                templateName
            ], function(template) {
                domConstruct.place(template, "noControl", "before");
            });
        }

        function _animatePanel(e) {
            /*AnimatePanel opens and closes the right side panel that displays a theme's
            layers. The layers have check boxes next to them to toggle the layer on and
            off.*/
            if (e === "open") {
                dom.byId("hidePanel").innerHTML = "hide";
                dom.byId("noControl").style.display = "block";
                domClass.replace(dom.byId("rightPanel"), "expandedPanel", "collapsedPanel");
                domClass.add("noControl", "someControl");
            } else {
                var parentcls = domAttr.get(e.target.parentNode, "class");
                if (query(".select").every(function(node) {
                    return domStyle.get(node, "display") === "none";
                })) {
                    domClass.remove("noControl", "someControl");
                } else {
                    domClass.add("noControl", "someControl");
                }
                if (e.type === "click" && parentcls === "collapsedPanel") {
                    dom.byId("hidePanel").innerHTML = "hide";
                    domClass.replace(dom.byId("rightPanel"), "expandedPanel", "collapsedPanel");
                } else if (e.type === "click" && parentcls === "expandedPanel") {
                    dom.byId("hidePanel").innerHTML = "Layers";
                    domClass.replace(dom.byId("rightPanel"), "collapsedPanel", "expandedPanel");
                } else if (e.target.nodeName === "A" || e.target.nodeName === "LI") {
                    dom.byId("hidePanel").innerHTML = "hide";
                    domClass.replace(dom.byId("rightPanel"), "expandedPanel", "collapsedPanel");
                } else {
                    return
                }
            }
        }

return {
    themeClick:_themeClick,
    getTemplate:_getTemplate,
    animatePanel:_animatePanel
    };//end of return object

});//end define
