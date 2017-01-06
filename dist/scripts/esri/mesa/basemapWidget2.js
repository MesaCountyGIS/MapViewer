define(["dojo/_base/declare","dojo/dnd/move","dijit/_WidgetBase","dijit/_TemplatedMixin","dojo/text!./templates/basemapSelector.html","dojo/query","dojo/dom","dojo/dom-class","dojo/dom-style","dojo/dom-construct","dojo/dom-attr","dojo/on","dojo/touch","dojox/gesture/tap","dojo/NodeList-traverse","dojo/NodeList-manipulate"],function(declare,move,_WidgetBase,_TemplatedMixin,template,query,dom,domClass,domStyle,domConstruct,domAttr,on,touch,tap){var thisWidget,currentBasemap=[];return declare("basemapWidget",[_WidgetBase,_TemplatedMixin],{templateString:template,mapRef:void 0,device:void 0,initialBasemap:void 0,postCreate:function(){thisWidget=this,currentBasemap.push(thisWidget.initialBasemap),map=thisWidget.mapRef},basemapChanger:function(target){if(console.log("prime",this,target),"string"==typeof target)return this.loadYear(target),target;var newLayer=target.attributes["data-value"].nodeValue;return this.loadYear(newLayer),"desktop"===this.device&&"imageLI"!==target.className&&this._change(target.id,"block","Default Basemap",["DTimagery","DTbasemap"]),newLayer},_change:function(i,display,message,addRemove){domAttr.set(dom.byId("DTbasemap"),"title","Turn on "+message),"desktop"===thisWidget.device&&(domClass.contains(dom.byId("DTbasemap"),addRemove[1])?domClass.replace(dom.byId("DTbasemap"),addRemove[0],addRemove[1]):domClass.replace(dom.byId("DTbasemap"),addRemove[1],addRemove[0]))},loadYear:function(newBasemap){var imageYear;map.removeLayer(currentBasemap[0]),currentBasemap.length=0;var historicalImagery={vector:thisWidget.initialBasemap,A2015:lmG.A2015,A2014:lmG.A2014,A2012:lmG.A2012,A2011:lmG.A2011,A2010:lmG.A2010,A2009:lmG.A2009,A2008:lmG.A2008,A2007:lmG.A2007,A2006:lmG.A2006,A2005:lmG.A2005,A2003:lmG.A2003,A2001:lmG.A2001,A1997:lmG.A1997,A1994:lmG.A1994,A1986:lmG.A1986,A1977:lmG.A1977,A1966:lmG.A1966,A1954:lmG.A1954,A1937:lmG.A1937};for(var x in historicalImagery)x===newBasemap&&(imageYear=historicalImagery[x],currentBasemap.push(imageYear),map.addLayer(imageYear),map.reorderLayer(imageYear,0));return imageYear.id}})});