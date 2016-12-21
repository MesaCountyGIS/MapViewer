define(["dojo/_base/declare","dojo/dom-construct","dojo/dom","dojo/dom-class","dojo/dom-attr","dojo/dnd/move","dojo/query","dojo/dom-style","esri/tasks/PrintTask","esri/tasks/PrintParameters","esri/tasks/PrintTemplate","esri/dijit/Print","dojo/on","dojo/_base/lang","dojo/touch","mesa/themeTools","mesa/searchTools","dijit/_WidgetBase","dijit/_TemplatedMixin","dojo/text!./templates/toolsView2.html","mesa/measureWidget","mesa/printWidget","mesa/queryWidget","mesa/bookmarkWidget","mesa/helpWidget","mesa/shareFormWidget","dijit/registry","mesa/basemapWidget2","dojo/NodeList-traverse"],function(declare,domConstruct,dom,domClass,domAttr,move,query,domStyle,PrintTask,PrintParameters,PrintTemplate,Print,on,lang,touch,themeTools,searchTools,_WidgetBase,_TemplatedMixin,template,measureWidget,printWidget,queryWidget,bookmarkWidget,helpWidget,shareFormWidget,registry,basemapWidget2){var map,toolsWidget,gsvc,popupObject,popupTemplateObject,Images,initialBasemap,device,parcels,legendObject;return declare("toolsWidget2",[_WidgetBase,_TemplatedMixin],{templateString:template,baseClass:"mesaTools",geometryServiceURL:null,printURL:null,imageList:null,mapRef:null,basemap:null,deviceUsed:null,popupRef:null,popupTemplateRef:null,legendRef:null,parcelLayer:null,postCreate:function(){function baseLayersSwitch(e,ParcelLayerObject,basemapObject,roadLabelObject){require(["dojo/query","dojo/dom-attr"],function(query,domAttr){var target=e.target?e.target:e.srcElement,thisClassName=domAttr.get(target,"class");thisClassName="input."+thisClassName.split(" ").pop();var box=query(thisClassName),layers={"input.pclcbx":ParcelLayerObject,"input.lbsgcbx":roadLabelObject,"input.bgcbx":basemapObject};for(i=0;i<box.length;i++)box[i].checked=!!target.checked;for(var x in layers)query(x)[0].checked?layers[x].show():layers[x].hide()})}function dispatchMainMenuClick(e){e.stopPropagation(),toPage=domAttr.has(this,"data-to")?domAttr.get(this,"data-to"):void 0,void 0!==toPage&&(domStyle.set("backMenu","visibility","visible"),domClass.add(query(".mainSideMenu")[0],"displayNo"),domClass.remove(query("."+toPage)[0],"displayNo"),domAttr.set("backMenu","data-to","mainSideMenu"),domAttr.set("backMenu","data-from",toPage))}function dispatchSearchMenuClick(e){e.stopPropagation(),domAttr.set("backMenu","data-to","searchMenu"),domAttr.set("backMenu","data-from","searchBox");var type=this.getAttribute("data-value");domClass.add(query(".searchMenu")[0],"displayNo"),dom.byId("searchLI").childNodes[0].nodeValue=this.childNodes[0].innerHTML,registry.byId("searchFieldDialog")&&registry.byId("searchFieldDialog").destroyRecursive(),searchTools.searchBy(type,void 0,"desktop",void 0,function(){domClass.remove(query(".searchMenu")[0],"displayNo"),toolsWidget.domNode.style.display="none"})}function dispatchMeasureTool(){if(dom.byId("measureTool")&&!registry.byId("measureTool")){var measure=new measureWidget({mapRef:map,gsvc:esriConfig.defaults.geometryService.url,device:device,parcelLayer:parcels},"measureTool");measure.startup()}}function dispatchImageChange(e){var spanList=this.parentNode.getElementsByTagName("span"),thisSpan=this.getElementsByTagName("span")[0];domAttr.get(this,"data-value");lmG.imageTool.basemapChanger(this),registry.byId("toolsView2").domNode.style.display="none",function(){for(i=0;i<spanList.length;i++)spanList[i].innerHTML="";thisSpan.innerHTML="&#10004;"}()}function dispatchImageryToggle(e){function createImageList(imageConfig){require(["esri/layers/ArcGISTiledMapServiceLayer"],function(ArcGISTiledMapServiceLayer){for(var x in imageConfig.images)lmG[imageConfig.images[x].imageId]=new ArcGISTiledMapServiceLayer(imageConfig.mapFolder+imageConfig.images[x].serviceName+imageConfig.serverType,{id:imageConfig.images[x].imageId})})}domAttr.get(this,"data-value");registry.byId("imagelist")?lmG.imageTool.basemapChanger(e.target):(createImageList(Images),lmG.imageTool=new basemapWidget2({mapRef:map,device:device,initialBasemap:initialBasemap},"imagelist"),lmG.imageTool.basemapChanger(e.target)),registry.byId("toolsView2").domNode.style.display="none",domClass.contains("imageYears","displayNo")?domClass.remove("imageYears","displayNo"):domClass.add("imageYears","displayNo"),"Show Imagery"===query("#Imagery").text()?query("#Imagery").text("Show Basemap"):(lmG.imageTool.basemapChanger("vector"),query("#Imagery").text("Show Imagery"))}function backButtonEvent(e){var backToPage=domAttr.get(e.target,"data-to"),fromPage=domAttr.get(e.target,"data-from");"searchBox"===fromPage&&domClass.contains(query(".searchMenu")[0],"displayNo")===!1&&(backToPage="mainSideMenu",fromPage="searchMenu"),domClass.add(query("."+fromPage)[0],"displayNo"),domClass.remove(query("."+backToPage)[0],"displayNo"),domClass.contains(query(".mainSideMenu")[0],"displayNo")===!1&&domStyle.set("backMenu","visibility","hidden")}domConstruct.place(this.domNode,this.srcNodeRef.id,"before"),domConstruct.place(dom.byId("legendDiv"),dom.byId("leg"),"replace"),toolsWidget=this,map=toolsWidget.mapRef,gsvc=toolsWidget.geometryServiceURL,popupObject=toolsWidget.popupRef,popupTemplateObject=toolsWidget.popupTemplateRef,Images=toolsWidget.imageList,initialBasemap=toolsWidget.basemap,device=toolsWidget.deviceUsed,parcels=toolsWidget.parcelLayer,legendObject=toolsWidget.legendRef;var legLayers=[];legLayers.push({layer:initialBasemap,title:"Basemap Layers",hideLayers:[7,12,17,22,23,24,25,26,27,28,32,35,36,37,38,39,50,51]}),legendObject.refresh(legLayers),on(query(".mainSideMenu li:not(#Imagery)"),"click",dispatchMainMenuClick),on(query(".themeMenu li"),"click",function(e){var layer=domAttr.get(this,"data-value");toolsWidget.dispatchThemeMenuClick(layer)}),on(query(".measureClick"),"click",dispatchMeasureTool),on(query(".searchMenu li"),"click",dispatchSearchMenuClick),on(dom.byId("Imagery"),"click",dispatchImageryToggle),on(query(".imageYears li"),"click",dispatchImageChange),on(dom.byId("backMenu"),touch.release,backButtonEvent),on(query(".baselyrs"),"click",function(e){baseLayersSwitch(e,parcels,initialBasemap,map._layers.roadLabels)})},startup:function(){this.inherited(arguments)},backToMap:function(){toolsWidget.domNode.style.display="none"},dispatchThemeMenuClick:function(layer,components){var thisSpan,spanList=query(".themeMenu")[0].getElementsByTagName("span");for(s=0;s<spanList.length;s++)domAttr.get(spanList[s].parentNode,"data-value")===layer&&(thisSpan=spanList[s].parentNode.getElementsByTagName("span")[0]);!function(){for(i=0;i<spanList.length;i++)spanList[i].innerHTML="";thisSpan.innerHTML="&#10004;"}(),themeTools.themeClick(thisSpan.parentNode,map,popupObject,popupTemplateObject,legendObject,initialBasemap,components),registry.byId("toolsView2").domNode.style.display="none"},measureClick:function(){if(!registry.byId("measureDialog2")){var measure=new measureWidget({gsvc:this.geometryServiceURL,device:"mobile"},"measureDialog2");measure.startup(),query("#toolPanel").html("Measure").attr("data-toolName","measureDialog2")}dom.byId("measureDialog2").style.display="block"===dom.byId("measureDialog2").style.display?"none":"block",toolsWidget.domNode.style.display="none"},shareClick:function(){if(!registry.byId("shareForm2")){var shareForm=new shareFormWidget({emailServiceUrl:"scripts/php/ShareMail.php",mapRef:map},"shareForm2");shareForm.startup()}dom.byId("shareForm2")&&(dom.byId("shareForm2").style.display="block"===dom.byId("shareForm2").style.display?"none":"block"),this.backToMap()},printClick:function(){if(!registry.byId("printDialog2")){var printer=new printWidget({printUrl:toolsWidget.printURL,mapRef:map,device:"mobile",callBack:toolsWidget.onClose},"printDialog2");printer.startup()}domStyle.set(dom.byId("printDialog2"),{display:"block"===domStyle.get(dom.byId("printDialog2"),"display")?"none":"block"}),this.backToMap()},helpClick:function(){if(dom.byId("helpMenu2")&&!registry.byId("helpMenu2")){var help=new helpWidget({printUrl:"http://mcmap2.mesacounty.us/arcgis/rest/services/Printing/MCExportWebMap/GPServer/Export%20Web%20Map",device:"desktop"},"helpMenu2");help.startup()}dom.byId("helpMenu2")&&(toolsWidget.domNode.style.display="none",domStyle.set(dom.byId("helpMenu2"),{display:"block"===domStyle.get(dom.byId("helpMenu2"),"display")?"none":"block"})),this.backToMap()},bookmarkClick:function(){if(!registry.byId("bookmarkDialog2")){var bookmarks=new bookmarkWidget({mapRef:map},"bookmarkDialog2");bookmarks.startup()}dom.byId("bookmarkDialog2")&&(toolsWidget.domNode.style.display="none",dom.byId("bookmarkDialog2").style.display="block"===dom.byId("bookmarkDialog2").style.display?"none":"block"),this.backToMap()},queryClick:function(){if(!registry.byId("queryDialog2")){var queryTool=new queryWidget({device:"mobile",mapRef:map,geometryServiceURL:gsvc},"queryDialog2");queryTool.startup(),query("#toolPanel").html("Query tool").attr("data-toolName","queryDialog2")}dom.byId("queryResultDialog").style.display="none",dom.byId("queryDialog2")&&(dom.byId("queryDialog2").style.display="block")},legendClick:function(){dom.byId("legendDialog").style.display="block",domClass.contains(dom.byId("legendDialog"),"displayNo")?domClass.remove(dom.byId("legendDialog"),"displayNo"):domClass.add(dom.byId("legendDialog"),"displayNo"),this.backToMap()},onClose:function(){dom.byId("toolPanel").style.display="none",query("#map_zoom_slider, #hidePanel, #rightPanel, .collapsedPanel").style("display","block")}})});