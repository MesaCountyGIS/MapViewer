define(["dojo/_base/declare","dojo/dom-construct","dojo/dom","dojo/dom-class","dojo/dnd/move","dojo/query","dojo/on","dojo/touch","dojo/dom-style","esri/tasks/QueryTask","dojo/_base/Color","esri/symbols/SimpleLineSymbol","esri/graphic","esri/layers/FeatureLayer","dojo/_base/connect","dojo/dom-attr","dojo/_base/array","dojo/keys","esri/tasks/query","mesa/rangy","mesa/exportcsv","mesa/graphicsTools","esri/symbols/SimpleFillSymbol","esri/toolbars/draw","esri/tasks/BufferParameters","esri/tasks/GeometryService","esri/graphicsUtils","dijit/_WidgetBase","dijit/_TemplatedMixin","dojo/text!./templates/queryDialog.html","dojo/domReady!","dojo/NodeList-manipulate","dojo/NodeList-traverse","dojo/NodeList-dom"],function(declare,domConstruct,dom,domClass,move,query,on,touch,domStyle,QueryTask,Color,SimpleLineSymbol,Graphic,FeatureLayer,connect,domAttr,array,keys,Query,rangy,exportcsv,graphicsTools,SimpleFillSymbol,Draw,BufferParameters,GeometryService,graphicsUtils,_WidgetBase,_TemplatedMixin,template){var esriQuery,attQueryTask,queryWidget,CSV,map,result,field,selectedLI,gsvc,graphicTools,selValue,selectionToolbar,esriQuery,loqQueryTask,splitText,functionStopper=0,locator={};return declare("queryWidget",[_WidgetBase,_TemplatedMixin],{templateString:template,device:null,mapRef:null,geometryServiceURL:null,exportURL:null,csvOutputLocation:null,postCreate:function(){function activateQueryHeaderTabs(e){var targetTab=e.target?e.target:e.srcElement;!function(){query(".queryHeader a").forEach(function(tab){tab.className=""}),domClass.add(targetTab,"tabActivated")}(),"attributeTab"===targetTab.id?queryWidget.tabClick(".locationItem, .inlineLocationItem",".attributeItem",".inlineAttributeItem"):queryWidget.tabClick(".attributeItem, .inlineAttributeItem",".locationItem",".inlineLocationItem")}function toggleElementClass(elementClass){domClass.contains(query(elementClass)[0],"displayNo")?domClass.replace(query(elementClass)[0],"showBlock","displayNo"):domClass.replace(query(elementClass)[0],"displayNo","showBlock")}this.inherited(arguments),domConstruct.place(this.domNode,this.srcNodeRef.id,"before"),queryWidget=this,device=queryWidget.device,map=queryWidget.mapRef,splitText=void 0,geomType=void 0,selectionToolbar=new Draw(map),gsvc=new GeometryService(queryWidget.geometryServiceURL),graphicTools=new graphicsTools({geometryServiceURL:queryWidget.geometryServiceURL,mapRef:map}),CSV=exportcsv({xhrURL:queryWidget.exportURL,outputLocation:queryWidget.csvOutputLocation}),on(query(".queryHeader a"),touch.release,function(e){activateQueryHeaderTabs(e)}),on(dom.byId("addBuffer"),"click",function(){toggleElementClass("#bufferSelection")}),on(dom.byId("addBufferQuery"),"click",function(){toggleElementClass(".queryFields")}),on(dom.byId("qLayer"),"change",function(){queryWidget.clearHelpText(),dom.byId("qWhere").value=dom.byId("qFields").value=dom.byId("qFields").innerHTML="",dom.byId("getExamples").innerHTML="Get Examples",dom.byId("showExamples").style.display="none",dom.byId("showExamples").innerHTML=dom.byId("showExamples").value="",selValue=query("select[name=qLayer]")[0].value,"none"!==selValue&&(attQueryTask=new QueryTask("https://mcgis.mesacounty.us/arcgis/rest/services/maps/"+selValue),attQuery=new Query,attQuery.returnGeometry=!0,attQuery.outFields=["*"],attQuery.where="OBJECTID > 0",attQueryTask.execute(attQuery,queryWidget._showResult))}),on(dom.byId("getExamples"),"click",function(){"none"!==dom.byId("showExamples").style.display?(dom.byId("showExamples").style.display="none",dom.byId("getExamples").innerHTML="Show Examples"):void 0!==splitText&&(queryWidget.getExamples(splitText[0],splitText[1]),dom.byId("getExamples").innerHTML="Close Examples",dom.byId("showExamples").style.display="none")}),on(dom.byId("clearWhere"),"click",function(){dom.byId("qWhere").value="",dom.byId("showExamples").style.display="none",dom.byId("getExamples").innerHTML="Get Examples",dom.byId("showExamples").value="",queryWidget.clearHelpText()}),on(query("#qButtons button"),"click",function(e){var targetButton=e.target?e.target:e.srcElement;"Field examples"!=targetButton.title&&(queryWidget.clearHelpText(),"Like"!==targetButton.title&&"In"!==targetButton.title||(dom.byId("SQLhelpText").style.display="block",dom.byId("SQLhelpText").innerHTML="Like"===targetButton.title?"Replace the word <b style='background-color:AliceBlue;'>value</b> above with your input":"Replace the word <b style='background-color:AliceBlue;'>value(n)</b> above with your<br>input Separate values with a comma"),queryWidget.buildWhere("qWhere",targetButton.value))}),on(dom.byId("qWhere"),"keypress",function(e){return keys.ENTER===e.keyCode?(e.preventDefault(),queryWidget.runQuery()):void 0}),on(dom.byId("attdisplayby"),"change",function(){var changeval=query("select[name=attdisplayby]")[0].value;queryWidget.submitQuery(changeval)}),on(dom.byId("csv"),"click",function(){ga("send","event","Query","Queryexport","Exported to CSV"),attQueryTask.execute(esriQuery,CSV.returnCSV)}),on(query("#qButtonBlock span"),"click",function(event){if("none"===query("#qLayer")[0].value)confirm("Please select a layer first");else{functionStopper=0;var t;switch(query("#qButtonBlock span").style("backgroundColor","white"),domStyle.set(this,"backgroundColor","#ABABAB"),t=String(query(this).attr("data-toolName")),lmG.pLay.infoTemplate="",map.setMapCursor("crosshair"),t){case"POINT":selectionToolbar.activate(Draw.MULTI_POINT),locator.point=selectionToolbar.on("draw-end",queryWidget._drawfunc),ga("send","event","queryDrawTool","toolUsed","Point");break;case"LINE":selectionToolbar.activate(Draw.POLYLINE),locator.line=selectionToolbar.on("draw-end",queryWidget._drawfunc),ga("send","event","queryDrawTool","toolUsed","Polyline");break;case"POLYGON":selectionToolbar.activate(Draw.POLYGON),locator.poly=selectionToolbar.on("draw-end",queryWidget._drawfunc),ga("send","event","queryDrawTool","toolUsed","Polygon");break;case"RECTANGLE":selectionToolbar.activate(Draw.RECTANGLE),locator.rect=selectionToolbar.on("draw-end",queryWidget._drawfunc),ga("send","event","queryDrawTool","toolUsed","Rectangle");break;case"FREEHAND_POLYLINE":selectionToolbar.activate(Draw.FREEHAND_POLYLINE),locator.pLineFree=selectionToolbar.on("draw-end",queryWidget._drawfunc),ga("send","event","queryDrawTool","toolUsed","Freehand Polyline");break;case"FREEHAND_POLYGON":selectionToolbar.activate(Draw.FREEHAND_POLYGON),locator.pGonFree=selectionToolbar.on("draw-end",queryWidget._drawfunc),ga("send","event","queryDrawTool","toolUsed","Freehand Polygon")}}})},startup:function(){this.inherited(arguments)},_clearQuery:function(){dom.byId("queryResultDialog").style.display="none",query("#qLayer").val("option:contains('None Selected')","true"),dom.byId("qFields").innerHTML="",query("#SQLhelpText, #qWhere").forEach(function(n){n.value=""}),query("#queryDialog","#queryResultDialog","#showExamples","#SQLhelpText").forEach(function(x){x.style.display="none"})},clearClick:function(e){e.preventDefault(),map.graphics.clear()},clearHelpText:function(){dom.byId("SQLhelpText").style.display="none",dom.byId("SQLhelpText").value=""},backToQueryClick:function(){dom.byId("querytabPanel").style.display="block",dom.byId("queryResultDialog").style.display="none",queryWidget._toggleHeader()},tabClick:function(hide,showBlock,showInline){query(showBlock).forEach(function(node){domClass.replace(node,"showBlock","displayNo")}),query(showInline).forEach(function(node){domClass.replace(node,"showInline","displayNo")}),query(hide).forEach(function(node){domClass.replace(node,"displayNo","showBlock showInline")})},runQuery:function(type){domClass.contains(queryWidget.locationTab,"tabActivated")||void 0!==selValue&&""!==queryWidget.qWhere?(ga("send","event","attQuery","attQueryLayer",selValue),dom.byId("querytabPanel").style.display="none",dom.byId("queryResultDialog").style.display="block","location"!==type&&queryWidget.submitQuery(),queryWidget._toggleHeader()):confirm("Please select a layer and provide a where statement")},_toggleHeader:function(){query(".queryHeader span, .queryHeader div").toggleClass("displayNo")},_showResult:function(results){var dataType,html="<ul>",html2="",fieldsLength=results.fields.length;geomType=results.features[0].geometry.type;for(var i=0,il=fieldsLength;i<il;i++)"esriFieldTypeString"===results.fields[i].type?dataType="String":"esriFieldTypeDouble"===results.fields[i].type?dataType="Double":"esriFieldTypeInteger"===results.fields[i].type?dataType="Integer":"esriFieldTypeOID"===results.fields[i].type&&(dataType="OID"),html+="<li>"+String(results.fields[i].name)+" ("+dataType+")</li>",html2+="<option value='"+String(results.fields[i].name)+"'>"+String(results.fields[i].name)+"</option>";html+="</ul>",dom.byId("qFields").innerHTML=html,dom.byId("attdisplayby").innerHTML=html2,on(query("#qFields li"),"click",function(){dom.byId("showExamples").innerHTML="",dom.byId("showExamples").style.display="none",query("#getExamples").innerHTML("Get Examples"),splitText=this.innerHTML.split(" "),"(Double)"===splitText[1]||"(Integer)"===splitText[1]?query(".dimButtons").forEach(function(i){i.disabled=!0}):query(".dimButtons").forEach(function(i){i.disabled=!1}),queryWidget.buildWhere("qWhere",splitText[0])})},buildWhere:function(box,text){text=" "+text;var whereBox=dom.byId(box),selText=rangy.extractSelectedText(whereBox,text);"value"===selText?(text=text.slice(1,-1),rangy.replaceSelectedText(whereBox,text)):"value"!==selText&&selText.length>0?(rangy.replaceSelectedText(whereBox,text),whereBox.value+=text+" "):whereBox.value+=text+" "},getExamples:function(fieldName,type){function showExamples(results){var html="<ul>",uniqueValues=results.features.slice(1,50).map(function(f){return f.attributes[splitText[0]]});dom.byId("showExamples").style.display="inline-block";for(var i=0,il=uniqueValues.length;i<il;i++)html+="<li>"+uniqueValues[i]+"</li>";html+="</ul>",dom.byId("showExamples").innerHTML=html,on(query("#showExamples ul li"),"click",function(){var listVal;if("(String)"===splitText[1])var listVal="'"+this.innerHTML+"'";else listVal=this.innerHTML;queryWidget.buildWhere("qWhere",listVal)})}exampleQuery=new Query,exampleQuery.returnGeometry=!1,exampleQuery.outFields=[fieldName],exampleQuery.supportsAdvancedQueries=!0,exampleQuery.returnDistinctValues=!0;var whereString=fieldName;switch(type){case"(OID)":case"(Integer)":whereString+=" <> ''";break;case"(String)":whereString+=" <> '' AND "+fieldName+" <> 'Common' AND NOT "+fieldName+" LIKE 'M%' AND NOT "+fieldName+" LIKE '%DPT%' AND NOT "+fieldName+" LIKE '%PENDING%' AND "+fieldName+" IS NOT NULL AND "+fieldName+" NOT LIKE '%[.]00[%]%'";break;case"(Double)":whereString+=" > '0' AND "+fieldName+" IS NOT NULL";break;default:whereString+=" <> ''"}exampleQuery.where=whereString,attQueryTask.execute(exampleQuery,showExamples)},submitQuery:function(changefield){(changefield||dom.byId("qWhere").value)&&require(["esri/geometry/Extent","esri/SpatialReference"],function(Extent,SpatialReference){var utm12=new SpatialReference({wkid:102206}),countyExtent=new Extent({xmin:580802,ymin:4175457,xmax:892217,ymax:4428929,spatialReference:utm12});if(esriQuery=new Query,dom.byId("checkExtent").checked?esriQuery.geometry=map.extent:esriQuery.geometry=countyExtent,esriQuery.returnGeometry=!0,esriQuery.outFields=["*"],changefield){var ids=query("#resultWindow2 ul li div span").map(function(e){return e.innerText}),newWhere="OBJECTID IN ("+ids+")";splitText[0]=changefield,esriQuery.where=newWhere}else query("select[name=attdisplayby]")[0].value=splitText[0],esriQuery.where=dom.byId("qWhere").value;attQueryTask.execute(esriQuery,queryWidget._showSelected)})},_showSelected:function(results){var showHTML="<ul>",featuresLength=(results.fields.length,results.features.length);if(domClass.contains(dom.byId("locationTab"),"tabActivated")?dom.byId("clearGraphic").checked&&map.graphics.clear():map.graphics.clear(),"esriGeometryPolygon"===results.geometryType){for(var i=0,il=featuresLength;i<il;i++)map.graphics.add(new Graphic(graphicTools.createJSONPolygon(results.features[i].geometry.rings,"noclear","esriSFSSolid",[220,20,60])));map.setExtent(graphicsUtils.graphicsExtent(map.graphics.graphics))}for(var i=0,il=featuresLength;i<il;i++){var obID=results.features[i].attributes.OBJECTID;showHTML+="<li><span class='arrowSpan'>&#9654;</span><div class='resultdiv' style='display:inline;'>"+results.features[i].attributes[splitText[0]]+"<span style='display:none'>"+obID+"</span>"}showHTML+="</div></li></ul>",dom.byId("resultWindow2").innerHTML=showHTML;var x=dom.byId("qLayer"),layer=x.options[x.selectedIndex].innerHTML;dom.byId("resultLabel").innerHTML=layer,on(query("#resultWindow2 ul li"),"click",function(){var thisObjectID=query(this).children("div").children("span").innerHTML();selectedLI=this,query(this).next("#querydiv").length>0?query(this).children(".arrowSpan").html("&#9654;"):(query(".arrowSpan").html("&#9654;"),query(this).children(".arrowSpan").html("&#9660;"),resultQuery=new Query,resultQuery.returnGeometry=!0,resultQuery.outFields=["*"],resultQuery.where="OBJECTID = "+thisObjectID,attQueryTask.execute(resultQuery,function(result){queryWidget._showResults(result,"single")})),query("#querydiv").remove()})},_showResults:function(result,incoming){for(var gra,showHTML="",featureLength=result.features.length,geom=result.features[0].geometry,fieldNames=result.fields.map(function(f){return f.name}),len=fieldNames.length,i=0,il=featureLength;i<il;i++){showHTML="<table id='querydiv' style='font-size:0.7em;padding-left:1.5em;background-color:#ECF1EF'>";for(var u=0;u<len;u++)showHTML+="<tr><td style='font-weight:bold;'>"+fieldNames[u]+"</td><td style='padding-left:2em;'>"+result.features[i].attributes[fieldNames[u]]+"</td></tr>"}showHTML+="</table>",query(selectedLI).after(showHTML),"polygon"===geomType?"single"===incoming?map.setExtent(result.features[0].geometry.getExtent().expand(1.5)):map.setExtent(map.graphics.add(gra=new Graphic(graphicTools.createJSONPolygon(result.features[0].geometry.rings))).geometry.getExtent().expand(1.5)):"polyline"===geomType?map.setExtent(map.graphics.add(new Graphic(result.features[0].geometry,(new SimpleLineSymbol).setColor(new Color([255,0,0,.5])))).geometry.getExtent().expand(1.5)):"point"===geomType&&graphicTools.zoomToPoint(geom.x,geom.y,"")},_drawfunc:function(results){1!==functionStopper&&(field="","object"==typeof results?result=results:field=results,"none"!==dom.byId("qLayer").value&&0===field.length?(queryWidget.domNode.style.display="block",queryWidget._runloqQuery(result,""),selectionToolbar.deactivate(),query("#qButtonBlock").children("span").style("backgroundColor","white"),map.setMapCursor("default")):"none"!==dom.byId("qLayer").value&&field.length>0?queryWidget._runloqQuery(result,field):confirm("Please choose a layer before trying to run the query"),functionStopper=1)},_runloqQuery:function(results,trig){function fireQuery(){queryWidget.runQuery("location"),loqQueryTask.execute(esriQuery,queryWidget._showSelected)}ga("send","event","loqQuery","loqQueryLayer",selValue),selectionToolbar.deactivate(),lmG.pLay.infoTemplate=aG.pTemp;var bufUOM,bufDist="";if(esriQuery=new Query,loqQueryTask=new QueryTask("https://mcgis.mesacounty.us/arcgis/rest/services/maps/"+selValue),esriQuery.returnGeometry=!0,esriQuery.outFields=["*"],splitText=0===trig.length?["ACCOUNTNO"]:trig,!domClass.contains(dom.byId("bufferSelection"),"displayNo")&&(dom.byId("buffDist").value.length>0||dom.byId("buffDist").value>0)){var params=new BufferParameters;bufUOM=dom.byId("bufferUOM").value,bufDist=dom.byId("buffDist").value,"feet"===bufUOM?params.unit=GeometryService.UNIT_FOOT:"miles"===bufUOM?params.unit=GeometryService.UNIT_STATUTE_MILE:"meters"===bufUOM?params.unit=GeometryService.UNIT_METER:"yards"===bufUOM&&(params.unit=GeometryService.UNIT_FOOT,bufDist=3*bufDist),params.distances=[bufDist],gsvc.simplify([results.geometry],function(geometries){params.geometries=geometries,gsvc.buffer(params,function(geom){esriQuery.geometry=geom[0],!domClass.contains(query(".queryFields")[0],"displayNo")&&dom.byId("qWhere").value.length>0?(esriQuery.where=dom.byId("qWhere").value,ga("send","event","loqQuery","loqQueryFilter","Filtered by attributes and buffer"),fireQuery()):(ga("send","event","loqQuery","loqQueryFilter","Filtered by buffer"),fireQuery())})})}else!domClass.contains(query(".queryFields")[0],"displayNo")&&dom.byId("qWhere").value.length>0?(esriQuery.where=dom.byId("qWhere").value,esriQuery.geometry=results.geometry,ga("send","event","loqQuery","loqQueryFilter","Filtered by attributes"),fireQuery()):(ga("send","event","loqQuery","loqQueryFilter","loq Query without filter"),query("select[name=attdisplayby]")[0].value="ACCOUNTNO",esriQuery.geometry=results.geometry,fireQuery())}})});