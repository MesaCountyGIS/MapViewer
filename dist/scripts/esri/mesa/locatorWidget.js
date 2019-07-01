define(["dojo/_base/declare","dojo/dom-construct","dojo/dom","dojo/dom-class","dojo/dnd/move","dojo/query","mesa/graphicsTools","esri/request","dojo/Deferred","dojo/touch","dojo/request/script","dojo/json","dojo/keys","dijit/focus","dojo/html","dojo/on","esri/graphic","esri/geometry/Point","esri/SpatialReference","esri/tasks/GeometryService","esri/symbols/SimpleMarkerSymbol","esri/symbols/SimpleLineSymbol","dojo/_base/Color","dijit/_WidgetBase","dojo/domReady!"],function(declare,domConstruct,dom,domClass,move,query,graphicsTools,esriRequest,Deferred,touch,script,JSON,keys,focusUtil,html,on,Graphic,Point,SpatialReference,GeometryService,SimpleMarkerSymbol,SimpleLineSymbol,Color,_WidgetBase){return declare("locatorWidget",[_WidgetBase],{mapRef:null,device:"desktop",gsvc:null,postCreate:function(){function startNav(){dom.byId("locate").setAttribute("data-state","on"),map.graphics.clear(),navigator.geolocation?(navigator.geolocation.getCurrentPosition(zoomToLocation,locationError,{enableHighAccuracy:!0,timeout:2e4}),watchId=navigator.geolocation.watchPosition(showLocation,locationError,{enableHighAccuracy:!0,timeout:2e4})):confirm("Your browser doesn't support Geolocation. Visit http://caniuse.com to discover browser support for the Geolocation API.")}function stopNav(){map.graphics.clear(),dom.byId("locate").setAttribute("data-state","off"),navigator.geolocation.clearWatch(watchId)}function locationError(error){switch(navigator.geolocation&&navigator.geolocation.clearWatch(watchId),error.code){case error.PERMISSION_DENIED:alert("Location not provided");break;case error.POSITION_UNAVAILABLE:alert("Current location not available");break;case error.TIMEOUT:alert("Timeout");break;default:alert("unknown error")}}function zoomToLocation(location){point=new Point(location.coords.longitude,location.coords.latitude,wgs84),gsvc.project([point],utm12,function(result){var utmGraphicPoint=result[0];addGraphic(utmGraphicPoint),map.centerAndZoom(utmGraphicPoint,500)})}function showLocation(location){var point=new Point(location.coords.longitude,location.coords.latitude,wgs84);gsvc.project([point],utm12,function(result){var utmGraphicPoint=result[0],graphicFound=map.graphics.graphics.some(function(x){return"locate"===x.attributes.id});graphicFound?graphic.setGeometry(utmGraphicPoint):addGraphic(utmGraphicPoint),map.centerAt(utmGraphicPoint)})}function addGraphic(pt){var symbol=new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE,12,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([210,105,30,.5]),8),new Color([210,105,30,.9]));graphic=new Graphic(pt,symbol,{id:"locate"}),map.graphics.add(graphic)}var map=this.mapRef,gsvc=new GeometryService(this.gsvc),wgs84=new SpatialReference({wkid:4326}),utm12=new SpatialReference({wkid:102206});"off"===dom.byId("locate").getAttribute("data-state")?startNav():stopNav()}})});