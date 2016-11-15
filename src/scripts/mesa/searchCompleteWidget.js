define([
     "dojo/_base/declare", "dojo/dom-construct", "dojo/dom", "dojo/dom-class", "dojo/dnd/move", "dojo/query", "mesa/graphicsTools", "esri/request", "dojo/Deferred", "dojo/touch",
     "dojo/request/script", "dojo/json", "dojo/keys", "dijit/focus", "dojo/html", "dojo/on", "esri/graphic","esri/geometry/Point","esri/SpatialReference", "esri/tasks/query", "esri/layers/FeatureLayer",
     "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/searchCompleteDialog.html", "dojo/domReady!"
 ], function (declare, domConstruct, dom, domClass, move, query, graphicsTools, esriRequest, Deferred, touch,
     script, JSON, keys, focusUtil, html, on, Graphic, Point, SpatialReference, Query, FeatureLayer,
    _WidgetBase, _TemplatedMixin, template) {
        var map, thisWidget, type, service, where, outFields, targetGeom, functionParam, graphicTool, option;

    return declare("searchCompleteWidget", [_WidgetBase, _TemplatedMixin], {

        templateString: template,
        device: "desktop",
        mapRef: undefined,
        type: undefined,
        service: undefined,
        where: undefined,
        outFields: undefined,
        targetGeom: undefined,
        functionParam: undefined,
        geometryServiceURL: undefined,
        option: undefined,
        turnOff: undefined,
        resultsShown:10,
        minInputLength: 2,

        postCreate: function () {
            this.inherited(arguments);
            domConstruct.place(this.domNode, this.srcNodeRef.id, "before");
            dom.byId("resultUL")? domConstruct.destroy("resultUL"): void(0);
            this.searchValue.innerHTML = ("Search " + this.type);
            this.option === undefined? this.domNode.style.display = "block":void(0);
            thisWidget = this;
            map = thisWidget.mapRef;
            option = thisWidget.option;
            this.loc.value = "";

            graphicTool = new graphicsTools({
                geometryServiceURL: thisWidget.geometryServiceURL,
                mapRef: map,
            });
            map.disableKeyboardNavigation();
            if(this.functionParam !== "gcs"){
                this.loc.focus();
            if (thisWidget.device === "desktop") {
                new move.parentConstrainedMoveable(this.domNode, {
                    handle: this.searchHeader,
                    area: "margin",
                    within: true
                });
            }

        option !== undefined? (thisWidget._runScript()
        .then(function(data){
            thisWidget.setExtent(data.features[0].geometry.rings)
        })
    ): void(0);
    }else{
        this.loc.style.display = "none";
        option === undefined? (this.GCSblock.style.display = "block",this.coords.focus()): this.coordClick();
    }

          on(thisWidget.loc, "keyup", function(e){
              if(dom.byId("resultUL") && e.keyCode === keys.DOWN_ARROW){
                  query("#resultUL > li")[0].focus();
              }else if(dom.byId("resultUL") && e.keyCode === keys.UP_ARROW){
                  query("#resultUL > li")[((query("#resultUL li").length) - 1)].focus();
              }else{
            thisWidget._runScript().then(function(data){
                var html = "<ul data-dojo-attach-point='resultUL' id='resultUL'>";
                for(i=0; i < thisWidget.resultsShown; i++){
                    if(data.features && data.features[i]){
                    var dataAttr = data.features[i].geometry.rings? ("data-rings='" + data.features[i].geometry.rings[0] + "'>"):
                    ("data-x='" + data.features[i].geometry.x + "' data-y='" + data.features[i].geometry.y + "'>")
                    html += "<li tabindex='" + i + "' "
                    + dataAttr
                    + data.features[i].attributes[thisWidget.outFields] + "</li>";
                }
                }
                html += "</ul>";
                return html

        })//end of first then
        .then(function(html){
            dom.byId("resultUL")? domConstruct.destroy("resultUL"): void(0);
            domConstruct.place(html, thisWidget.loc, "after");

            on(query("#resultUL > li"), "keyup", function(e){
                if(e.keyCode === keys.DOWN_ARROW || e.keyCode === keys.UP_ARROW){
                    if(e.target.nextSibling && (e.keyCode === keys.UP_ARROW && e.target.nextSibling.tabIndex === 1) || (e.keyCode === keys.DOWN_ARROW &&
                        e.target.tabIndex === ((query("#resultUL li").length) - 1))){
                        thisWidget.loc.focus()
                    }else{
                        var move = e.keyCode === keys.DOWN_ARROW? focusUtil.curNode.tabIndex + 1: focusUtil.curNode.tabIndex - 1;
                        query("#resultUL > li")[move].focus();
                    }
                }else if(e.keyCode === keys.ENTER){
                    thisWidget.handleClick(e, thisWidget);
                }
            });

            on(query("#resultUL li"), touch.release, function(e){
                thisWidget.turnOff !== undefined? dom.byId(thisWidget.turnOff).style.display = "none": void(0);
                thisWidget.handleClick(e, thisWidget);
                thisWidget.closeClick();


            });//end of on click event
        });//end of second then
    }//end of if statement
          });//end of keyup event

          on(query("#coords"), "keyup", function(e){
              if(e.keyCode === keys.ENTER){
                  thisWidget.coordClick();
              }
          });
        },

        coordClick: function(){
            var coordinates = option === undefined? thisWidget.coords.value: option;
            thisWidget.turnOff !== undefined? dom.byId(thisWidget.turnOff).style.display = "none": void(0);
            graphicTool.zoom(coordinates);
            dom.byId("searchLI").childNodes[0].nodeValue = ("Search By...");
        },

        _runScript: function(){
            var value = option !== undefined? thisWidget.option: thisWidget.loc.value.replace(/\'/g, '\'\'').replace(/\-/g, '');
            return(script.get("http://mcmap2.mesacounty.us/arcgis/rest/services/maps/" + thisWidget.service, {
             jsonp: "callback",
             query: {
                       where: thisWidget.where  + " '%" + value + "%'",
                       outFields: thisWidget.outFields,
                       returnGeometry: true,
                       f: "pjson"
                   }
           }))
       },

        startup: function () {
            this.inherited(arguments);
        },

        closeClick: function () {
            this.domNode.style.display = "none";
            dom.byId("searchLI").childNodes[0].nodeValue = ("Search By...");
        },

        handleClick: function(e, searchWidget){
            var target = e.target ? e.target : e.srcElement;
            option === undefined? thisWidget.domNode.style.display = "none":void(0);
            dom.byId("searchLI").childNodes[0].nodeValue = ("Search By...");
            domConstruct.destroy("resultUL");
            thisWidget.defaultSearch();
            var name = searchWidget.functionParam !== "noPoint"? target.innerHTML: searchWidget.functionParam;
            searchWidget.targetGeom === "point"?
            graphicTool.zoomToPoint(Number(target.getAttribute("data-x")), Number(target.getAttribute("data-y")), name)
            : //Add the noPoint variable to keep the point graphic from drawing on the screen
            (thisWidget.setExtent(target.getAttribute("data-rings")),
            map.setExtent((map.graphics.add(new Graphic(graphicTool.createJSONPolygon(target.getAttribute("data-rings"))))).geometry.getExtent().expand(1.5)))
            map.enableKeyboardNavigation();
        },

        setExtent: function(target){
            map.setExtent((map.graphics.add(new Graphic(graphicTool.createJSONPolygon(target)))).geometry.getExtent().expand(1.5));
        },

        defaultSearch: function() {
            dom.byId("loc").value = "";
            dom.byId("searchLI").childNodes[0].nodeValue = 'Search By...';
        }
});//end of declare
});//end of define
