define(["dojo/_base/declare","dojo/dom-construct","dojo/dom","dojo/dom-class","dojo/dnd/move","dojo/query","mesa/graphicsTools","esri/request","dojo/Deferred","dojo/touch","dojo/request/script","dojo/json","dojo/keys","dijit/focus","dojo/html","dojo/on","esri/graphic","esri/geometry/Point","esri/SpatialReference","esri/tasks/query","esri/layers/FeatureLayer","dijit/_WidgetBase","dijit/_TemplatedMixin","dojo/text!./templates/searchCompleteDialog.html","dojo/domReady!"],function(declare,domConstruct,dom,domClass,move,query,graphicsTools,esriRequest,Deferred,touch,script,JSON,keys,focusUtil,html,on,Graphic,Point,SpatialReference,Query,FeatureLayer,_WidgetBase,_TemplatedMixin,template){var map,thisWidget,graphicTool,option;return declare("searchCompleteWidget",[_WidgetBase,_TemplatedMixin],{templateString:template,device:"esriPopup",mapRef:void 0,type:void 0,service:void 0,where:void 0,outFields:void 0,targetGeom:void 0,functionParam:void 0,geometryServiceURL:void 0,option:void 0,turnOff:void 0,resultsShown:10,minInputLength:2,postCreate:function(){this.inherited(arguments),domConstruct.place(this.domNode,this.srcNodeRef.id,"before"),dom.byId("resultUL")?domConstruct.destroy("resultUL"):void 0,this.searchValue.innerHTML="Search "+this.type,void 0===this.option?this.domNode.style.display="block":void 0,thisWidget=this,map=thisWidget.mapRef,option=thisWidget.option,this.loc.value="",graphicTool=new graphicsTools({geometryServiceURL:thisWidget.geometryServiceURL,mapRef:map}),map.disableKeyboardNavigation(),"gcs"!==this.functionParam?(this.loc.focus(),"esriPopup"===thisWidget.device&&new move.parentConstrainedMoveable(this.domNode,{handle:this.searchHeader,area:"margin",within:!0}),void 0!==option?thisWidget._runScript().then(function(data){thisWidget.setExtent(data.features[0].geometry.rings)}):void 0):(this.loc.style.display="none",void 0===option?(this.GCSblock.style.display="block",this.coords.focus()):this.coordClick()),on(thisWidget.loc,"keyup",function(e){dom.byId("resultUL")&&e.keyCode===keys.DOWN_ARROW?query("#resultUL > li")[0].focus():dom.byId("resultUL")&&e.keyCode===keys.UP_ARROW?query("#resultUL > li")[query("#resultUL li").length-1].focus():thisWidget._runScript().then(function(data){var html="<ul data-dojo-attach-point='resultUL' id='resultUL'>";for(i=0;i<thisWidget.resultsShown;i++)if(data.features&&data.features[i]){var dataAttr=data.features[i].geometry.rings?"data-rings='"+data.features[i].geometry.rings[0]+"'>":"data-x='"+data.features[i].geometry.x+"' data-y='"+data.features[i].geometry.y+"'>";html+="<li tabindex='"+i+"' "+dataAttr+data.features[i].attributes[thisWidget.outFields]+"</li>"}return html+="</ul>"}).then(function(html){dom.byId("resultUL")?domConstruct.destroy("resultUL"):void 0,domConstruct.place(html,thisWidget.loc,"after"),on(query("#resultUL > li"),"keyup",function(e){if(e.keyCode===keys.DOWN_ARROW||e.keyCode===keys.UP_ARROW)if(e.target.nextSibling&&e.keyCode===keys.UP_ARROW&&1===e.target.nextSibling.tabIndex||e.keyCode===keys.DOWN_ARROW&&e.target.tabIndex===query("#resultUL li").length-1)thisWidget.loc.focus();else{var move=e.keyCode===keys.DOWN_ARROW?focusUtil.curNode.tabIndex+1:focusUtil.curNode.tabIndex-1;query("#resultUL > li")[move].focus()}else e.keyCode===keys.ENTER&&thisWidget.handleClick(e,thisWidget)}),on(query("#resultUL li"),touch.release,function(e){void 0!==thisWidget.turnOff?dom.byId(thisWidget.turnOff).style.display="none":void 0,thisWidget.handleClick(e,thisWidget),thisWidget.closeClick()})})}),on(query("#coords"),"keyup",function(e){e.keyCode===keys.ENTER&&thisWidget.coordClick()})},coordClick:function(){var coordinates=void 0===option?thisWidget.coords.value:option;void 0!==thisWidget.turnOff?dom.byId(thisWidget.turnOff).style.display="none":void 0,graphicTool.zoom(coordinates),dom.byId("searchLI").childNodes[0].nodeValue="Search By..."},_runScript:function(){var value=void 0!==option?thisWidget.option:thisWidget.loc.value.replace(/\'/g,"''").replace(/\-/g,"");return script.get("http://mcmap2.mesacounty.us/arcgis/rest/services/maps/"+thisWidget.service,{jsonp:"callback",query:{where:thisWidget.where+" '%"+value+"%'",outFields:thisWidget.outFields,returnGeometry:!0,f:"pjson"}})},startup:function(){this.inherited(arguments)},closeClick:function(){this.domNode.style.display="none",dom.byId("searchLI").childNodes[0].nodeValue="Search By..."},handleClick:function(e,searchWidget){var target=e.target?e.target:e.srcElement;void 0===option?thisWidget.domNode.style.display="none":void 0,dom.byId("searchLI").childNodes[0].nodeValue="Search By...",domConstruct.destroy("resultUL"),thisWidget.defaultSearch();var name="noPoint"!==searchWidget.functionParam?target.innerHTML:searchWidget.functionParam;"point"===searchWidget.targetGeom?graphicTool.zoomToPoint(Number(target.getAttribute("data-x")),Number(target.getAttribute("data-y")),name):(thisWidget.setExtent(target.getAttribute("data-rings")),map.setExtent(map.graphics.add(new Graphic(graphicTool.createJSONPolygon(target.getAttribute("data-rings")))).geometry.getExtent().expand(1.5))),map.enableKeyboardNavigation()},setExtent:function(target){map.setExtent(map.graphics.add(new Graphic(graphicTool.createJSONPolygon(target))).geometry.getExtent().expand(1.5))},defaultSearch:function(){dom.byId("loc").value="",dom.byId("searchLI").childNodes[0].nodeValue="Search By..."}})});