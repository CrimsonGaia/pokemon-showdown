"use strict";var _PSStorage;function _inheritsLoose(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,_setPrototypeOf(t,o);}function _wrapNativeSuper(t){var r="function"==typeof Map?new Map():void 0;return _wrapNativeSuper=function(t){if(null===t||!_isNativeFunction(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==r){if(r.has(t))return r.get(t);r.set(t,Wrapper);}function Wrapper(){return _construct(t,arguments,_getPrototypeOf(this).constructor);}return Wrapper.prototype=Object.create(t.prototype,{constructor:{value:Wrapper,enumerable:!1,writable:!0,configurable:!0}}),_setPrototypeOf(Wrapper,t);},_wrapNativeSuper(t);}function _construct(t,e,r){if(_isNativeReflectConstruct())return Reflect.construct.apply(null,arguments);var o=[null];o.push.apply(o,e);var p=new(t.bind.apply(t,o))();return r&&_setPrototypeOf(p,r.prototype),p;}function _isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));}catch(t){}return(_isNativeReflectConstruct=function(){return!!t;})();}function _isNativeFunction(t){try{return-1!==Function.toString.call(t).indexOf("[native code]");}catch(n){return"function"==typeof t;}}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t;},_setPrototypeOf(t,e);}function _getPrototypeOf(t){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t);},_getPrototypeOf(t);}/**
 * Connection library
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */var






PSConnection=function(){









function PSConnection(){var _this=this;this.socket=null;this.connected=false;this.queue=[];this.reconnectDelay=1000;this.reconnectCap=15000;this.shouldReconnect=true;this.reconnectTimer=null;this.worker=null;
var loading=PSStorage.init();
if(loading){
loading.then(function(){
_this.initConnection();
});
}else{
this.initConnection();
}
}var _proto=PSConnection.prototype;_proto.

initConnection=function initConnection(){
if(!this.tryConnectInWorker())this.directConnect();
};_proto.

canReconnect=function canReconnect(){
var uptime=Date.now()-PS.startTime;
if(uptime>24*60*60*1000){
PS.confirm("It's been over a day since you first connected. Please refresh.",{
okButton:'Refresh'
}).then(function(confirmed){var _PS$room;
if(confirmed)(_PS$room=PS.room)==null||_PS$room.send("/refresh");
});
return false;
}
return this.shouldReconnect;
};_proto.

tryConnectInWorker=function tryConnectInWorker(){var _this2=this;
if(this.socket)return false;
if(this.connected)return true;

if(this.worker){
this.worker.postMessage({type:'connect',server:PS.server});
return true;
}

try{
var worker=new Worker('/js/client-connection-worker.js');
this.worker=worker;

worker.postMessage({type:'connect',server:PS.server});

worker.onmessage=function(event){
var _event$data=event.data,type=_event$data.type,data=_event$data.data;
switch(type){
case'connected':
console.log("\u2705 (CONNECTED via worker)");
_this2.connected=true;
_this2.queue.forEach(function(msg){return worker.postMessage({type:'send',data:msg});});
_this2.queue=[];
PS.update();
break;
case'message':
PS.receive(data);
break;
case'disconnected':
_this2.handleDisconnect();
break;
case'error':
console.warn("Worker connection error: "+data);
_this2.worker=null;


_this2.handleDisconnect();
break;
}
};

worker.onerror=function(ev){
console.warn('Worker connection error:',ev);
_this2.worker=null;
_this2.directConnect();
};

return true;
}catch(_unused){
console.warn('Worker connection failed, falling back to regular connection.');
this.worker=null;
return false;
}
};_proto.

directConnect=function directConnect(){var _this3=this;
if(this.worker)return;

var server=PS.server;
var port=server.protocol==='https'?":"+server.port:":"+server.httpport;
var url=server.protocol+"://"+server.host+port+server.prefix;

try{
this.socket=new SockJS(url,[],{timeout:5*60*1000});
}catch(_unused2){
this.socket=new WebSocket(url.replace('http','ws')+'/websocket');
}

var socket=this.socket;

socket.onopen=function(){
console.log("\u2705 (CONNECTED)");
_this3.connected=true;
_this3.reconnectDelay=1000;
_this3.queue.forEach(function(msg){return socket.send(msg);});
_this3.queue=[];
PS.update();
};

socket.onmessage=function(ev){
PS.receive(''+ev.data);
};

socket.onclose=function(){
console.log("\u274C (DISCONNECTED)");
_this3.handleDisconnect();
console.log("\u2705 (DISCONNECTED)");
_this3.connected=false;
PS.isOffline=true;
for(var roomid in PS.rooms){
var room=PS.rooms[roomid];
if(room.connected===true)room.connected='autoreconnect';
}
_this3.socket=null;
PS.update();
};

socket.onerror=function(ev){
PS.isOffline=true;

_this3.retryConnection();
PS.update();
};
};_proto.

handleDisconnect=function handleDisconnect(){
this.connected=false;
PS.isOffline=true;
this.socket=null;
for(var roomid in PS.rooms){
var room=PS.rooms[roomid];
if(room.connected===true)room.connected='autoreconnect';
}
this.retryConnection();
PS.update();
};_proto.

retryConnection=function retryConnection(){var _this4=this;
if(!this.canReconnect())return;
if(this.reconnectTimer)return;

this.reconnectTimer=setTimeout(function(){
_this4.reconnectTimer=null;
if(!_this4.connected&&_this4.canReconnect()){
PS.mainmenu.send('/reconnect');
_this4.reconnectDelay=Math.min(_this4.reconnectDelay*2,_this4.reconnectCap);
}
PS.update();
},this.reconnectDelay);
};_proto.

disconnect=function disconnect(){var _this$socket,_this$worker;
this.shouldReconnect=false;
(_this$socket=this.socket)==null||_this$socket.close();
(_this$worker=this.worker)==null||_this$worker.terminate();
this.worker=null;
this.handleDisconnect();
PS.update();
};_proto.
reconnect=function reconnect(){
if(this.connected)return;
if(this.worker&&this.tryConnectInWorker())return;
this.directConnect();
};_proto.

send=function send(msg){
if(!this.connected){
this.queue.push(msg);
return;
}
if(this.worker){
this.worker.postMessage({type:'send',data:msg});
}else if(this.socket){
this.socket.send(msg);
}
};PSConnection.

connect=function connect(){var _PS$connection;
if((_PS$connection=PS.connection)!=null&&_PS$connection.socket)return;
PS.isOffline=false;
if(!PS.connection){
PS.connection=new PSConnection();
}else{
PS.connection.reconnect();
}
PS.prefs.doAutojoin();
};return PSConnection;}();var


PSStorage=function(){function PSStorage(){}PSStorage.






init=function init(){var _this5=this;
if(this.loaded){
if(this.loaded===true)return;
return this.loaded;
}
if(Config.testclient){
return;
}else if(location.protocol+"//"+location.hostname===PSStorage.origin){var _Config;

(_Config=Config).server||(_Config.server=Config.defaultserver);
return;
}


if(!('postMessage'in window)){

PS.alert("Sorry, psim connections are unsupported by your browser.");
return;
}

window.addEventListener('message',this.onMessage);

if(document.location.hostname!==Config.routes.client){
var iframe=document.createElement('iframe');
iframe.src='https://'+Config.routes.client+'/crossdomain.php?host='+
encodeURIComponent(document.location.hostname)+
'&path='+encodeURIComponent(document.location.pathname.substr(1))+
'&protocol='+encodeURIComponent(document.location.protocol);
iframe.style.display='none';
document.body.appendChild(iframe);
}else{var _Config2;
(_Config2=Config).server||(_Config2.server=Config.defaultserver);
$("<iframe src=\"https://"+
Config.routes.client+"/crossprotocol.html?v1.2\" style=\"display: none;\"></iframe>"
).appendTo('body');
setTimeout(function(){



},2000);
}
this.loaded=new Promise(function(resolve){
_this5.loader=resolve;
});
return this.loaded;
};PSStorage.
































































































request=function request(type,uri,data){
if(!PSStorage.requests)return;
var idx=PSStorage.requestCount++;
return new Promise(function(resolve){
PSStorage.requests[idx]=resolve;
PSStorage.postCrossOriginMessage((type==='GET'?'R':'S')+JSON.stringify([uri,data,idx,'text']));
});
};return PSStorage;}();_PSStorage=PSStorage;PSStorage.frame=null;PSStorage.requests=null;PSStorage.requestCount=0;PSStorage.origin="https://"+Config.routes.client;PSStorage.loader=void 0;PSStorage.loaded=false;PSStorage.onMessage=function(e){if(e.origin!==_PSStorage.origin)return;_PSStorage.frame=e.source;var data=e.data;switch(data.charAt(0)){case'c':Config.server=JSON.parse(data.substr(1));if(Config.server.registered&&Config.server.id!=='showdown'&&Config.server.id!=='smogtours'){var link=document.createElement('link');link.rel='stylesheet';link.href="//"+Config.routes.client+"/customcss.php?server="+encodeURIComponent(Config.server.id);document.head.appendChild(link);}Object.assign(PS.server,Config.server);break;case'p':var newData=JSON.parse(data.substr(1));if(newData)PS.prefs.load(newData,true);PS.prefs.save=function(){var prefData=JSON.stringify(PS.prefs.storage);_PSStorage.postCrossOriginMessage('P'+prefData);try{localStorage.setItem('showdown_prefs',prefData);}catch(_unused3){}};PS.prefs.update(null);break;case't':if(window.nodewebkit)return;var oldTeams;if(PS.teams.list.length){oldTeams=PS.teams.list;}PS.teams.unpackAll(data.substr(1));PS.teams.save=function(){var packedTeams=PS.teams.packAll(PS.teams.list);_PSStorage.postCrossOriginMessage('T'+packedTeams);if(document.location.hostname===Config.routes.client){try{localStorage.setItem('showdown_teams_local',packedTeams);}catch(_unused4){}}PS.teams.update('team');};if(oldTeams){PS.teams.list=PS.teams.list.concat(oldTeams);PS.teams.save();localStorage.removeItem('showdown_teams');}if(data==='tnull'&&!PS.teams.list.length){PS.teams.unpackAll(localStorage.getItem('showdown_teams_local'));}break;case'a':if(data==='a0'){PS.alert("Your browser doesn't support third-party cookies. Some things might not work correctly.");}if(!window.nodewebkit){try{_PSStorage.frame.postMessage("",_PSStorage.origin);}catch(_unused5){return;}_PSStorage.requests={};}_PSStorage.loaded=true;_PSStorage.loader==null||_PSStorage.loader();_PSStorage.loader=undefined;break;case'r':var reqData=JSON.parse(data.slice(1));var idx=reqData[0];if(_PSStorage.requests[idx]){_PSStorage.requests[idx](reqData[1]);delete _PSStorage.requests[idx];}break;}};PSStorage.
postCrossOriginMessage=function(data){
try{

return _PSStorage.frame.postMessage(data,_PSStorage.origin);
}catch(_unused6){
}
return false;
};
;

PSConnection.connect();

var PSLoginServer=new(function(){function _class(){}var _proto2=_class.prototype;_proto2.
rawQuery=function rawQuery(act,data){





data.act=act;
var url='/~~'+PS.server.id+'/action.php';
if(location.pathname.endsWith('.html')){
url='https://'+Config.routes.client+url;
if(typeof POKEMON_SHOWDOWN_TESTCLIENT_KEY==='string'){
data.sid=POKEMON_SHOWDOWN_TESTCLIENT_KEY.replace(/%2C/g,',');
}
}
return PSStorage.request('POST',url,data)||Net(url).get({method:'POST',body:data}).then(
function(res){return res!=null?res:null;}
)["catch"](
function(){return null;}
);
};_proto2.
query=function query(act){var data=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};
return this.rawQuery(act,data).then(
function(res){return res?JSON.parse(res.slice(1)):null;}
)["catch"](
function(){return null;}
);
};return _class;}())(
);var









HttpError=function(_Error){


function HttpError(message,statusCode,body){var _this6;
_this6=_Error.call(this,message)||this;_this6.statusCode=void 0;_this6.body=void 0;
_this6.name='HttpError';
_this6.statusCode=statusCode;
_this6.body=body;
try{
Error.captureStackTrace(_this6,HttpError);
}catch(_unused7){}return _this6;
}_inheritsLoose(HttpError,_Error);return HttpError;}(_wrapNativeSuper(Error));var

NetRequest=function(){

function NetRequest(uri){this.uri=void 0;
this.uri=uri;
}var _proto3=NetRequest.prototype;_proto3.









get=function get(){var _this7=this;var opts=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};
return new Promise(function(resolve,reject){
var xhr=new XMLHttpRequest();
var uri=_this7.uri;
if(opts.query){
uri+=(uri.includes('?')?'&':'?')+Net.encodeQuery(opts.query);
}
xhr.open(opts.method||'GET',uri);
xhr.onreadystatechange=function(){
var DONE=4;
if(xhr.readyState===DONE){
if(xhr.status===200){
resolve(xhr.responseText||'');
return;
}
var err=new HttpError(xhr.statusText||"Connection error",xhr.status,xhr.responseText);
reject(err);
}
};
if(opts.body){
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xhr.send(Net.encodeQuery(opts.body));
}else{
xhr.send();
}
});
};_proto3.












post=function post(){var opts=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var body=arguments.length>1?arguments[1]:undefined;
if(!body)body=opts.body;
return this.get(Object.assign({},
opts,{
method:'POST',
body:body})
);
};return NetRequest;}();


function Net(uri){
if(uri.startsWith('/')&&!uri.startsWith('//')&&Net.defaultRoute)uri=Net.defaultRoute+uri;
if(uri.startsWith('//')&&document.location.protocol==='file:')uri='https:'+uri;
return new NetRequest(uri);
}

Net.defaultRoute='';

Net.encodeQuery=function(data){
if(typeof data==='string')return data;
var urlencodedData='';
for(var _key in data){
if(urlencodedData)urlencodedData+='&';
var value=data[_key];
if(value===true)value='on';
if(value===false||value===null||value===undefined)value='';
urlencodedData+=encodeURIComponent(_key)+'='+encodeURIComponent(value);
}
return urlencodedData;
};

Net.formData=function(form){

var elements=form.querySelectorAll('input[name], select[name], textarea[name]');
var out={};for(var _i2=0;_i2<
elements.length;_i2++){var element=elements[_i2];
if(element.type==='checkbox'){
out[element.name]=element.getAttribute('value')?
element.checked?element.value:'':

!!element.checked;

}else if(element.type!=='radio'||element.checked){
out[element.name]=element.value;
}
}
return out;
};
//# sourceMappingURL=client-connection.js.map