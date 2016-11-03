define(["dojo/_base/declare","dojo/dnd/move","dijit/_WidgetBase","dijit/_TemplatedMixin","dojo/text!./templates/basemapSelector.html","dojo/query","dojo/dom","dojo/dom-class","dojo/dom-style","dojo/dom-construct","dojo/dom-attr","dojo/on","dojo/touch","dojox/gesture/tap","dojo/NodeList-traverse","dojo/NodeList-manipulate"],function(declare,move,_WidgetBase,_TemplatedMixin,template,query,dom,domClass,domStyle,domConstruct,domAttr,on,touch,tap){var thisWidget,currentBasemap=[];return declare("basemapWidget",[_WidgetBase,_TemplatedMixin],{templateString:template,mapRef:void 0,device:void 0,initialBasemap:void 0,postCreate:function(){this.inherited(arguments),thisWidget=this,currentBasemap.push(thisWidget.initialBasemap),map=thisWidget.mapRef,domConstruct.place(this.domNode,this.srcNodeRef.id,"before"),on(query("#historicalImagery ul li"),touch.release,thisWidget.historicalImageryDropdown),on(query(".subyear li"),touch.release,function(){query(".subyear")[0].style.display="none"}),on(dom.byId("basemapDialog"),touch.release,function(){query(".subyear")[0].style.display="block"}),on(query(".subyear"),"mouseleave",function(){query(".subyear")[0].style.display="none"}),on(query("basemapDialog"),"mouseleave",function(){query(".subyear")[0].style.display="none"})},historicalImageryDropdown:function(e){var thisYear=this.attributes["data-value"].nodeValue;e.stopPropagation(),thisYear.length>0&&(dom.byId("historicalImagery").childNodes[0].nodeValue=this.childNodes[0].innerHTML,thisWidget.loadYear(thisYear))},basemapChanger:function(){var i=dom.byId("imagelist2");if("block"!==i.style.display){i.style.display="block";var newLayer=dom.byId("historicalImagery").attributes["data-value"].nodeValue;thisWidget.loadYear(newLayer),"desktop"===thisWidget.device?domClass.replace(dom.byId("DTbasemap"),"DTimagery","DTbasemap"):domClass.replace(dom.byId("MBasemap"),"Mimagery","Mbasemap"),domAttr.set(dom.byId("DTbasemap"),"title","Turn on Default Basemap"),domAttr.set(dom.byId("DTbasemap"),"title","Turn on Default Basemap")}else i.style.display="none",thisWidget.loadYear("vector"),"desktop"===thisWidget.device?domClass.replace(dom.byId("DTbasemap"),"DTbasemap","DTimagery"):domClass.replace(dom.byId("MBasemap"),"Mbasemap","Mimagery"),domAttr.set(dom.byId("DTbasemap"),"title","Turn on Imagery")},loadYear:function(newBasemap){var imageYear;"vector"!==newBasemap&&(dom.byId("historicalImagery").attributes["data-value"].nodeValue=newBasemap),map.removeLayer(currentBasemap[0]),currentBasemap.length=0;var historicalImagery={vector:lmG.vectorBasemap,A2015:lmG.A2015,A2014:lmG.A2014,A2012:lmG.A2012,A2011:lmG.A2011,A2010:lmG.A2010,A2009:lmG.A2009,A2008:lmG.A2008,A2007:lmG.A2007,A2006:lmG.A2006,A2005:lmG.A2005,A2003:lmG.A2003,A2001:lmG.A2001,A1997:lmG.A1997,A1994:lmG.A1994,A1986:lmG.A1986,A1977:lmG.A1977,A1966:lmG.A1966,A1954:lmG.A1954,A1937:lmG.A1937};for(var x in historicalImagery)x===newBasemap&&(imageYear=historicalImagery[x],currentBasemap.push(imageYear),map.addLayer(imageYear),map.reorderLayer(imageYear,0))}})});