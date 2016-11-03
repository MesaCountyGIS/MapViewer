//>>built
define("esri/tasks/datareviewer/DashboardTask","dojo/_base/declare dojo/_base/array dojo/_base/lang dojo/Deferred dojo/has ./_DRSBaseTask ./DashboardResult ./ReviewerFilters ../../kernel ../../request".split(" "),function(f,n,l,p,r,s,t,u,v,q){f=f(s,{declaredClass:"esri.tasks.datareviewer.DashboardTask",constructor:function(b){this.onGetDashboardResultsComplete=l.hitch(this,this.onGetDashboardResultsComplete);this.onGetDashboardFieldNamesComplete=l.hitch(this,this.onGetDashboardFieldNamesComplete)},
getDashboardResults:function(b,g){var f=this._successHandler,e=this._errorHandler,h=this._appendQueryParams,a=new p,m,c;null===g||void 0===g?(c=this._url+"/Dashboard/reviewerResultsBy/"+b,m={f:"json"}):(c=this._url+"/Dashboard/reviewerResultsBy/"+b+"/filter",m={f:"json",filtersArray:g.toJSON()});c=h(c);q({callbackParamName:"callback",url:c,content:m}).then(l.hitch(this,function(d,c){if(void 0!==d.error){var k=Error();k.message=d.error.message;k.code=d.error.code;e(k,a)}else try{if(void 0===d.dashboardResults)e(null,
a);else{var b=new t;n.forEach(d.dashboardResults,function(a,d){b.fieldValues.push(a.fieldValue);b.counts.push(a.count)});b.fieldName=d.fieldName;k=new u;k.createFromJsonObject(d);b.filters=k;f({dashboardResult:b},"onGetDashboardResultsComplete",a)}}catch(g){e(g,a)}}),function(b,c){e(b,a)});return a},getDashboardFieldNames:function(){var b=this._successHandler,g=this._errorHandler,f=this._appendQueryParams,e=this._url+"/Dashboard",e=f(e),h=new p;q({callbackParamName:"callback",url:e,content:{f:"json"}}).then(l.hitch(this,
function(a,f){if(void 0!==a.error){var c=Error();c.message=a.error.message;c.code=a.error.code;g(c,h)}else try{var d=[];n.forEach(a.reviewerResultsBy,function(a,b){d.push(a.name)});b({fieldNames:d},"onGetDashboardFieldNamesComplete",h)}catch(e){g(e,h)}}),function(a,b){g(a,h)});return h},onGetDashboardResultsComplete:function(b){},onGetDashboardFieldNamesComplete:function(b){}});r("extend-esri")&&l.setObject("tasks.datareviewer.DashboardTask",f,v);return f});