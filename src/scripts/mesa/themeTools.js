define([
    "dojo/_base/array",
    "dojo/dom-construct", "dojo/dom-attr", "dojo/dom",
    "dojo/query", "dojo/dom-class", "dojo/dom-style",
    "mesa/changeTheme",
    "dojo/text!./_config/config.json"
], function (array, domConstruct, domAttr, dom, query, domClass, domStyle, changeTheme
  ,JSONConfig
) {


        function _themeClick(self, map, popupObject, popupTemplateObject, legend, initialBasemap, components) {
          
            var newLayer = self.attributes['data-value'].nodeValue;
            //Avoid parsing JSONConfig twice.
            if(typeof(JSONConfig) !== 'object'){JSONConfig = JSON.parse(JSONConfig);}
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
                        // pVal: null,
                        mapRef: map,
                        basemapRef: initialBasemap,
                        infoWindowRef: popupObject,
                        infoTemplateRef: popupTemplateObject,
                        mapLegend: legend,
                        components: components,
                        layerConstructor: JSONConfig.layerConstructor,
                        themeLayers: JSONConfig.themeLayers,
                    })

                }, 200);
            }
        }

        function _getTemplate(newLayerName) {
            var templateName = "dojo/text!./scripts/esri/mesa/templates/" + newLayerName + "Select.html";
            document.getElementById(newLayerName + "Select") || require([templateName], function(template) {
                domConstruct.place(template, "noControl", "before");
            });
        }

return {
    themeClick:_themeClick,
    getTemplate:_getTemplate
    };//end of return object

});//end define
