//>>built
define("esri/arcade/arcadeRuntime","require exports ../geometry/Polygon ../graphic ../geometry/Polyline ../geometry/Point ../geometry/Extent ../geometry/Multipoint ../SpatialReference ./languageUtils ./treeAnalysis ./Dictionary ./Feature ./FunctionWrapper ./functions/date ./functions/string ./functions/maths ./functions/geometry ./functions/stats".split(" "),function(oa,s,X,Y,Z,$,aa,ba,ca,e,k,z,x,C,da,ea,fa,ga,ha){function G(b,a){for(var d=[],f=0;f<a.arguments.length;f++)d.push(g(b,a.arguments[f]));
return d}function p(b,a,d){try{return d(b,a,G(b,a))}catch(f){throw f;}}function D(b){return b instanceof u||b instanceof C}function g(b,a){try{switch(a.type){case "EmptyStatement":return m;case "VariableDeclarator":var d=null===a.init?null:g(b,a.init),f=a.id.name.toLowerCase();null!==b.localScope?b.localScope[f]={value:d,valueset:!0,node:a.init}:b.globalScope[f]={value:d,valueset:!0,node:a.init};return m;case "VariableDeclaration":for(var c=0;c<a.declarations.length;c++)g(b,a.declarations[c]);return m;
case "BlockStatement":var l;a:{for(var c=m,h=0;h<a.body.length;h++)if(c=g(b,a.body[h]),c instanceof v||c===y||c===H){l=c;break a}l=c}return l;case "FunctionDeclaration":var n=a.id.name.toLowerCase();b.globalScope[n]={valueset:!0,node:null,value:new C(a,b)};return m;case "ReturnStatement":var O;if(null===a.argument)O=new v(m);else{var ia=g(b,a.argument);O=new v(ia)}return O;case "IfStatement":var p;if("AssignmentExpression"===a.test.type||"UpdateExpression"===a.test.type)throw Error(k.nodeErrorMessage(a.test,
"RUNTIME","CANNOT_USE_ASSIGNMENT_IN_CONDITION"));var t=g(b,a.test);if(!0===t)p=g(b,a.consequent);else if(!1===t)p=null!==a.alternate?g(b,a.alternate):m;else throw Error(k.nodeErrorMessage(a,"RUNTIME","CANNOT_USE_NONBOOLEAN_IN_CONDITION"));return p;case "ExpressionStatement":var s;if("AssignmentExpression"===a.expression.type||"UpdateExpression"===a.expression.type)s=g(b,a.expression);else{var u=g(b,a.expression);s=u===m?m:new P(u)}return s;case "AssignmentExpression":var x;var Q,A=a.left.name.toLowerCase();
Q=g(b,a.right);if(null!==b.localScope&&void 0!==b.localScope[A])b.localScope[A]={value:W(Q,a.operator,b.localScope[A].value,a),valueset:!0,node:a.right},x=m;else if(void 0!==b.globalScope[A])b.globalScope[A]={value:W(Q,a.operator,b.globalScope[A].value,a),valueset:!0,node:a.right},x=m;else throw Error("Variable not recognised");return x;case "UpdateExpression":var R;var q,B=a.argument.name.toLowerCase();if(null!==b.localScope&&void 0!==b.localScope[B])q=b.localScope[B].value,b.localScope[B]={value:"++"===
a.operator?q+1:q-1,valueset:!0,node:a},R=!1===a.prefix?q:"++"===a.operator?q+1:q-1;else if(void 0!==b.globalScope[B])q=b.globalScope[B].value,b.globalScope[B]={value:"++"===a.operator?q+1:q-1,valueset:!0,node:a},R=!1===a.prefix?q:"++"===a.operator?q+1:q-1;else throw Error("Variable not recognised");return R;case "BreakStatement":return y;case "ContinueStatement":return H;case "ForStatement":null!==a.init&&g(b,a.init);l={testResult:!0,lastAction:m};do b:{var h=b,w=a,d=l;if(null!==w.test&&(d.testResult=
g(h,w.test),!1===d.testResult))break b;d.lastAction=g(h,w.body);d.lastAction===y?d.testResult=!1:d.lastAction instanceof v?d.testResult=!1:null!==w.update&&g(h,w.update)}while(!0===l.testResult);c=l.lastAction instanceof v?l.lastAction:m;return c;case "ForInStatement":return ja(b,a);case "Identifier":var S;var r;try{var I=a.name.toLowerCase();if(null!==b.localScope&&void 0!==b.localScope[I])r=b.localScope[I],!0!==r.valueset&&(r.value=g(b,r.node),r.valueset=!0),S=r.value;else if(void 0!==b.globalScope[I])r=
b.globalScope[I],!0!==r.valueset&&(r.value=g(b,r.node),r.valueset=!0),S=r.value;else throw Error(k.nodeErrorMessage(a,"RUNTIME","VARIABLENOTFOUND"));}catch(G){throw G;}return S;case "MemberExpression":return ka(b,a);case "Literal":return a.value;case "ThisExpression":throw Error(k.nodeErrorMessage(a,"RUNTIME","NOTSUPPORTED"));case "CallExpression":return la(b,a);case "UnaryExpression":var J;try{var E=g(b,a.argument);if(e.isBoolean(E))if("!"===a.operator)J=!E;else throw Error(k.nodeErrorMessage(a,
"RUNTIME","NOTSUPPORTEDUNARYOPERATOR"));else if(e.isNumber(E))if("-"===a.operator)J=-1*E;else if("+"===a.operator)J=1*E;else throw Error(k.nodeErrorMessage(a,"RUNTIME","NOTSUPPORTEDUNARYOPERATOR"));else throw Error(k.nodeErrorMessage(a,"RUNTIME","NOTSUPPORTEDTYPE"));}catch(K){throw K;}return J;case "BinaryExpression":return ma(b,a);case "LogicalExpression":var T;a:try{if("AssignmentExpression"===a.left.type||"UpdateExpression"===a.left.type)throw Error(k.nodeErrorMessage(a.left,"RUNTIME","CANNOT_USE_ASSIGNMENT_IN_CONDITION"));
if("AssignmentExpression"===a.right.type||"UpdateExpression"===a.right.type)throw Error(k.nodeErrorMessage(a.right,"RUNTIME","CANNOT_USE_ASSIGNMENT_IN_CONDITION"));var F=[g(b,a.left),g(b,a.right)],U=F[0],V=F[1];if(e.isBoolean(U)&&e.isBoolean(V))switch(a.operator){case "||":T=U||V;break a;case "\x26\x26":T=U&&V;break a;default:throw Error(k.nodeErrorMessage(a,"RUNTIME","ONLYORORAND"));}else throw Error(k.nodeErrorMessage(a,"RUNTIME","ONLYBOOLEAN"));}catch(L){throw L;}return T;case "ConditionalExpression":throw Error(k.nodeErrorMessage(a,
"RUNTIME","NOTSUPPORTED"));case "ArrayExpression":try{c=[];for(l=0;l<a.elements.length;l++){h=g(b,a.elements[l]);if(D(h))throw Error(k.nodeErrorMessage(a,"RUNTIME","FUNCTIONCONTEXTILLEGAL"));c.push(h)}}catch(M){throw M;}return c;case "ObjectExpression":c={};for(l=0;l<a.properties.length;l++){w=g(b,a.properties[l]);if(D(w.value))throw Error("Illegal Argument");c[w.key.toString()]=w.value}return new z(c);case "Property":return{key:"Identifier"===a.key.type?a.key.name:g(b,a.key),value:g(b,a.value)};
case "Array":throw Error(k.nodeErrorMessage(a,"RUNTIME","NOTSUPPORTED"));default:throw Error(k.nodeErrorMessage(a,"RUNTIME","UNREOGNISED"));}}catch(N){throw N;}}function ja(b,a){var d=g(b,a.right);"VariableDeclaration"===a.left.type&&g(b,a.left);var f=null,c="VariableDeclaration"===a.left.type?a.left.declarations[0].id.name:a.left.name;null!==b.localScope&&void 0!==b.localScope[c]&&(f=b.localScope[c]);null===f&&void 0!==b.globalScope[c]&&(f=b.globalScope[c]);if(null===f)throw Error(k.nodeErrorMessage(a,
"RUNTIME","VARIABLENOTDECLARED"));if(e.isArray(d)||e.isString(d)){for(var l=0;l<d.length&&!(f.value=l,c=g(b,a.body),c===y);l++)if(c instanceof v)return c;return m}if(d instanceof z||d instanceof x){d=d.keys();for(l=0;l<d.length&&!(f.value=d[l],c=g(b,a.body),c===y);l++)if(c instanceof v)return c}else return m}function W(b,a,d,f){switch(a){case "\x3d":return b;case "/\x3d":return e.toNumber(d)/e.toNumber(b);case "*\x3d":return e.toNumber(d)*e.toNumber(b);case "-\x3d":return e.toNumber(d)-e.toNumber(b);
case "+\x3d":return e.isString(d)||e.isString(b)?e.toString(d)+e.toString(b):e.toNumber(d)+e.toNumber(b);case "%\x3d":return e.toNumber(d)%e.toNumber(b);default:throw Error(k.nodeErrorMessage(f,"RUNTIME","OPERATORNOTRECOGNISED"));}}function ka(b,a){try{var d=g(b,a.object);if(null===d)throw Error(k.nodeErrorMessage(a,"RUNTIME","NOTFOUND"));if(!1===a.computed){if(d instanceof z||d instanceof x)return d.field(a.property.name)}else{var f=g(b,a.property);if(d instanceof z||d instanceof x){if(e.isString(f))return d.field(f)}else if(e.isArray(d)){if(e.isNumber(f)&&
isFinite(f)&&Math.floor(f)===f)return d[f]}else if(e.isString(d)&&e.isNumber(f)&&isFinite(f)&&Math.floor(f)===f)return d[f]}throw Error(k.nodeErrorMessage(a,"RUNTIME","INVALIDTYPE"));}catch(c){throw c;}}function ma(b,a){try{var d=[g(b,a.left),g(b,a.right)],f=d[0],c=d[1];switch(a.operator){case "\x3d\x3d":return e.equalityTest(f,c);case "\x3d":return e.equalityTest(f,c);case "!\x3d":return!e.equalityTest(f,c);case "\x3c":return f<c;case "\x3e":return f>c;case "\x3c\x3d":return f<=c;case "\x3e\x3d":return f>=
c;case "+":return e.isString(f)||e.isString(c)?e.toString(f)+e.toString(c):e.toNumber(f)+e.toNumber(c);case "-":return e.toNumber(f)-e.toNumber(c);case "*":return e.toNumber(f)*e.toNumber(c);case "/":return e.toNumber(f)/e.toNumber(c);case "%":return e.toNumber(f)%e.toNumber(c);default:throw Error(k.nodeErrorMessage(a,"RUNTIME","OPERATORNOTRECOGNISED"));}}catch(l){throw l;}}function la(b,a){try{if("Identifier"!==a.callee.type)throw Error(k.nodeErrorMessage(a,"RUNTIME","ONLYNODESSUPPORTED"));if(null!==
b.localScope&&void 0!==b.localScope[a.callee.name.toLowerCase()]){var d=b.localScope[a.callee.name.toLowerCase()];if(d.value instanceof u)return d.value.fn(b,a);if(d.value instanceof C)return K(b,a,d.value.definition);throw Error(k.nodeErrorMessage(a,"RUNTIME","NOTAFUNCTION"));}if(void 0!==b.globalScope[a.callee.name.toLowerCase()]){d=b.globalScope[a.callee.name.toLowerCase()];if(d.value instanceof u)return d.value.fn(b,a);if(d.value instanceof C)return K(b,a,d.value.definition);throw Error(k.nodeErrorMessage(a,
"RUNTIME","NOTAFUNCTION"));}throw Error(k.nodeErrorMessage(a,"RUNTIME","NOTFOUND"));}catch(f){throw f;}}function F(b){return null==b?"":e.isArray(b)?"Array":e.isDate(b)?"Date":e.isString(b)?"String":e.isBoolean(b)?"Boolean":e.isNumber(b)?"Number":b instanceof z?"Dictionary":b instanceof x?"Feature":b instanceof $?"Point":b instanceof X?"Polygon":b instanceof Z?"Polyline":b instanceof ba?"MultiPoint":b instanceof aa?"Envelope":D(b)?"Function":b===m?"Void":"number"===typeof b&&isNaN(b)?"Number":"Unrecognised Type"}
function L(b,a,d,f){try{var c=g(b,a.arguments[d]);if(e.equalityTest(c,f))return g(b,a.arguments[d+1]);var l=a.arguments.length-d;return 1===l?g(b,a.arguments[d]):2===l?null:L(b,a,d+2,f)}catch(h){throw h;}}function M(b,a,d,f){try{if(!0===f)return g(b,a.arguments[d+1]);if(3===a.arguments.length-d)return g(b,a.arguments[d+2]);var c=g(b,a.arguments[d+2]);if(!1===e.isBoolean(c))throw Error("WHEN needs boolean test conditions");return M(b,a,d+2,c)}catch(l){throw l;}}function t(b,a){var d=b.length,f=Math.floor(d/
2);if(0===d)return[];if(1===d)return[b[0]];for(var c=t(b.slice(0,f),a),d=t(b.slice(f,d),a),f=[];0<c.length||0<d.length;)if(0<c.length&&0<d.length){var e=a(c[0],d[0]);isNaN(e)&&(e=0);0>=e?(f.push(c[0]),c=c.slice(1)):(f.push(d[0]),d=d.slice(1))}else 0<c.length?(f.push(c[0]),c=c.slice(1)):0<d.length&&(f.push(d[0]),d=d.slice(1));return f}function N(b,a,d){try{var f=b.body;if(d.length!==b.params.length)throw Error("Invalid Parameter calls to function.");for(var c=0;c<d.length;c++)a.localScope[b.params[c].name.toLowerCase()]=
{d:null,value:d[c],valueset:!0,node:null};var e=g(a,f);if(e instanceof v)return e.value;if(e===y)throw Error("Cannot Break from a Function");if(e===H)throw Error("Cannot Continue from a Function");return e instanceof P?e.value:e}catch(h){throw h;}}function K(b,a,d){return p(b,a,function(a,c,e){a={spatialReference:b.spatialReference,applicationCache:void 0===b.applicationCache?null:b.applicationCache,globalScope:b.globalScope,depthCounter:b.depthCounter+1,localScope:{}};if(64<a.depthCounter)throw Error("Exceeded maximum function depth");
return N(d,a,e)})}function na(b){return function(){var a={applicationCache:void 0===b.context.applicationCache?null:b.context.applicationCache,spatialReference:b.context.spatialReference,localScope:{},depthCounter:b.context.depthCounter+1,globalScope:b.context.globalScope};if(64<a.depthCounter)throw Error("Exceeded maximum function depth");return N(b.definition,a,arguments)}}var v=function(){return function(b){this.value=b}}(),P=function(){return function(b){this.value=b}}(),u=function(){return function(b){this.fn=
b}}(),m={type:"VOID"},y={type:"BREAK"},H={type:"CONTINUE"},n={};da.registerFunctions(n,p);ea.registerFunctions(n,p);fa.registerFunctions(n,p);ga.registerFunctions(n,p,D);ha.registerFunctions(n,p);n["typeof"]=function(b,a){return p(b,a,function(a,b,c){e.pcCheck(c,1,1);a=F(c[0]);if("Unrecognised Type"===a)throw Error("Unrecognised Type");return a})};n.iif=function(b,a){try{e.pcCheck(null===a.arguments?[]:a.arguments,3,3);var d=g(b,a.arguments[0]);if(!1===e.isBoolean(d))throw Error("IF Function must have a boolean test condition");
return!0===d?g(b,a.arguments[1]):g(b,a.arguments[2])}catch(f){throw f;}};n.decode=function(b,a){try{if(2>a.arguments.length)throw Error("Missing Parameters");if(2===a.arguments.length)return g(b,a.arguments[1]);if(0===(a.arguments.length-1)%2)throw Error("Must have a default value result.");var d=g(b,a.arguments[0]);return L(b,a,1,d)}catch(f){throw f;}};n.when=function(b,a){try{if(3>a.arguments.length)throw Error("Missing Parameters");if(0===a.arguments.length%2)throw Error("Must have a default value result.");
var d=g(b,a.arguments[0]);if(!1===e.isBoolean(d))throw Error("WHEN needs boolean test conditions");return M(b,a,0,d)}catch(f){throw f;}};n.top=function(b,a){return p(b,a,function(a,b,c){e.pcCheck(c,2,2);if(e.isArray(c[0]))return c[1].length>=c[0].length?c[0]:c[0].slice(0,e.toNumber(c[1]));throw Error("Top cannot accept this parameter type");})};n.first=function(b,a){return p(b,a,function(a,b,c){e.pcCheck(c,1,1);return e.isArray(c[0])?0===c[0].length?null:c[0][0]:null})};n.sort=function(b,a){return p(b,
a,function(a,b,c){e.pcCheck(c,1,2);if(!1===e.isArray(c[0]))throw Error("Illegal Argument");if(1<c.length){if(!1===D(c[1]))throw Error("Illegal Argument");a=c[0];var g=na(c[1]);a=t(a,function(a,b){return g(a,b)})}else{a=c[0];if(0===a.length)return[];c={};for(b=0;b<a.length;b++){var h=F(a[b]);""!==h&&(c[h]=!0)}if(!0===c.Array||!0===c.Dictionary||!0===c.Feature||!0===c.Point||!0===c.Polygon||!0===c.Polyline||!0===c.MultiPoint||!0===c.Envelope||!0===c.Function)return a.slice(0);b=0;var h="",k;for(k in c)b++,
h=k;a=1<b||"String"===h?t(a,function(a,b){return null===a||void 0===a?null===b||void 0===b?0:1:null===b||void 0===b?-1:a.toString()<b.toString()?-1:a.toString()===b.toString()?0:1}):"Number"===h?t(a,function(a,b){return a-b}):"Boolean"===h?t(a,function(a,b){return a===b?0:a?-1:1}):"Date"===h?t(a,function(a,b){return b-a}):a.slice(0)}return a})};s.functionHelper={fixSpatialReference:e.fixSpatialReference,parseArguments:G,standardFunction:p};s.executeScript=function(b,a,d){d||(d=new ca(102100));var f=
a.vars,c=a.customfunctions,e={};f||(f={});c||(c={});e.infinity={value:Number.POSITIVE_INFINITY,valueset:!0,node:null};e.pi={value:Math.PI,valueset:!0,node:null};for(var h in n)e[h]={value:new u(n[h]),valueset:!0,node:null};for(h in c)e[h]={value:new u(c[h]),"native":!0,valueset:!0,node:null};for(h in f)e[h]=f[h]instanceof Y?{value:new z(f[h]),valueset:!0,node:null}:{value:f[h],valueset:!0,node:null};b=g({spatialReference:d,globalScope:e,localScope:null,depthCounter:1,applicationCache:void 0===a.applicationCache?
null:a.applicationCache},b.body[0].body);b instanceof v&&(b=b.value);b instanceof P&&(b=b.value);if(b===m)throw Error("Cannot return VOID");if(b===y)throw Error("Cannot return BREAK");if(b===H)throw Error("Cannot return CONTINUE");if(b instanceof C)throw Error("Cannot return FUNCTION");if(b instanceof u)throw Error("Cannot return FUNCTION");return b};s.extractFieldLiterals=function(b,a){void 0===a&&(a=!1);return k.findFieldLiterals(b,a)};s.validateScript=function(b,a){return k.validateScript(b,a,
"simple")};s.referencesMember=function(b,a){return k.referencesMember(b,a)};s.referencesFunction=function(b,a){return k.referencesFunction(b,a)}});