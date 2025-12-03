"use strict";var _PSView,_navigator$platform;function _inheritsLoose(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,_setPrototypeOf(t,o);}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t;},_setPrototypeOf(t,e);}/**
 * Panels
 *
 * Main view - sets up the frame, and the generic panels.
 *
 * Also sets up most global event listeners.
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license AGPLv3
 */












var VERTICAL_HEADER_WIDTH=240;
var NARROW_MODE_HEADER_WIDTH=280;var

PSRouter=function(){


function PSRouter(){this.roomid='';this.panelState='';
var currentRoomid=location.pathname.slice(1);
if(/^[a-z0-9-]*$/.test(currentRoomid)){
this.subscribeHistory();
}else if(location.pathname.endsWith('.html')){
this.subscribeHash();
}
}var _proto=PSRouter.prototype;_proto.
extractRoomID=function extractRoomID(url){
if(!url)return null;
if(url.startsWith(document.location.origin)){
url=url.slice(document.location.origin.length);
}else{
if(url.startsWith('http://')){
url=url.slice(7);
}else if(url.startsWith('https://')){
url=url.slice(8);
}
if(url.startsWith('psim.us/t/')){
url="viewteam-"+url.slice(10);
}
if(url.startsWith('teams.pokemonshowdown.com/view/')&&/[0-9]/.test(url.charAt(31))){
url="viewteam-"+url.slice(31);
}
if(url.startsWith('psim.us/r/')){
url="battle-"+url.slice(10);
}
if(url.startsWith('replay.pokemonshowdown.com/')&&/[a-z]/.test(url.charAt(27))){
url="battle-"+url.slice(27);
}
if(url.startsWith(document.location.host)){
url=url.slice(document.location.host.length);
}else if(PS.server.id==='showdown'&&url.startsWith('play.pokemonshowdown.com')){
url=url.slice(24);
}else if(PS.server.id==='showdown'&&url.startsWith('psim.us')){
url=url.slice(7);
}else if(url.startsWith('replay.pokemonshowdown.com')){
url=url.slice(26).replace('/','/battle-');
}
}
if(url.startsWith('/'))url=url.slice(1);
if(url==='.')url='';

if(!/^[a-z0-9-]*$/.test(url))return null;

var redirects=/^(appeals?|rooms?suggestions?|suggestions?|adminrequests?|bugs?|bugreports?|rules?|faq|credits?|privacy|contact|dex|insecure)$/;
if(redirects.test(url))return null;

if(url.startsWith('view-teams-view-')){
var teamid=url.slice(16);
url="viewteam-"+teamid;
}
return url;
};_proto.

updatePanelState=function updatePanelState(){
var room=PS.room;


if(room.noURL)room=PS.rooms[PS.popups[PS.popups.length-2]]||PS.panel;
if(room.noURL)room=PS.panel;


if(room.id==='news'&&room.location==='mini-window')room=PS.mainmenu;
if(room.id===''&&PS.leftPanelWidth&&PS.rightPanel){
room=PS.rightPanel;
}
if(room.id==='rooms')room=PS.leftPanel;

var roomid=room.id;
var panelState=PS.leftPanelWidth&&room===PS.panel?
PS.leftPanel.id+'..'+PS.rightPanel.id:
room.id;
var newTitle=roomid===''?'Showdown!':room.title+" - Showdown!";
var changed=roomid!==this.roomid;

this.roomid=roomid;
if(this.panelState===panelState)changed=null;
this.panelState=panelState;
return{roomid:roomid,changed:changed,newTitle:newTitle};
};_proto.
subscribeHash=function subscribeHash(){var _this=this;
if(location.hash){
var currentRoomid=location.hash.slice(1);
if(/^[a-z0-9-]+$/.test(currentRoomid)){
PS.join(currentRoomid);
}
}
{
var _this$updatePanelStat=this.updatePanelState(),newTitle=_this$updatePanelStat.newTitle;
document.title=newTitle;
}
PS.subscribe(function(){
var _this$updatePanelStat2=_this.updatePanelState(),roomid=_this$updatePanelStat2.roomid,changed=_this$updatePanelStat2.changed,newTitle=_this$updatePanelStat2.newTitle;
if(changed)location.hash=roomid?"#"+roomid:'';

document.title=newTitle;
});
window.addEventListener('hashchange',function(e){var _PS$rooms$PS$popups;

if(PS.popups.length&&(_PS$rooms$PS$popups=PS.rooms[PS.popups[PS.popups.length-1]])!=null&&_PS$rooms$PS$popups.noURL)return;
var possibleRoomid=location.hash.slice(1);
var currentRoomid=null;
if(/^[a-z0-9-]*$/.test(possibleRoomid)){
currentRoomid=possibleRoomid;
}
if(currentRoomid!==null){
if(currentRoomid===PS.room.id)return;
_this.roomid=currentRoomid;
PS.join(currentRoomid);
}
});
};_proto.
subscribeHistory=function subscribeHistory(){var _this2=this;
var currentRoomid=location.pathname.slice(1);
if(/^[a-z0-9-]+$/.test(currentRoomid)){
if(currentRoomid!=='preactalpha'&&currentRoomid!=='preactbeta'&&currentRoomid!=='beta'){
PS.join(currentRoomid);
}
}
if(!window.history)return;
{
var _this$updatePanelStat3=this.updatePanelState(),roomid=_this$updatePanelStat3.roomid,newTitle=_this$updatePanelStat3.newTitle;
history.replaceState(this.panelState,'',"/"+roomid);
document.title=newTitle;
}
PS.subscribe(function(){
var _this2$updatePanelSta=_this2.updatePanelState(),roomid=_this2$updatePanelSta.roomid,changed=_this2$updatePanelSta.changed,newTitle=_this2$updatePanelSta.newTitle;
if(changed){
history.pushState(_this2.panelState,'',"/"+roomid);
}else if(changed!==null){
history.replaceState(_this2.panelState,'',"/"+roomid);
}

document.title=newTitle;
});
window.addEventListener('popstate',function(e){
var possibleRoomid=location.pathname.slice(1);
var roomid=null;
if(/^[a-z0-9-]*$/.test(possibleRoomid)){
roomid=possibleRoomid;
}
if(typeof e.state==='string'){
var _ref=e.state.split('..'),leftRoomid=_ref[0],rightRoomid=_ref[1];
if(rightRoomid){
PS.addRoom({id:leftRoomid,location:'left',autofocus:false});
PS.addRoom({id:rightRoomid,location:'right',autofocus:false});
PS.leftPanel=PS.rooms[leftRoomid]||PS.leftPanel;
PS.rightPanel=PS.rooms[rightRoomid]||PS.rightPanel;
}
}
if(roomid!==null){
_this2.roomid=roomid;
PS.join(roomid);
}
});
};return PSRouter;}();

PS.router=new PSRouter();var

PSRoomPanel=function(_preact$Component){function PSRoomPanel(){var _this3;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this3=_preact$Component.call.apply(_preact$Component,[this].concat(args))||this;_this3.
subscriptions=[];_this3.

















justUpdatedDimensions=false;return _this3;}_inheritsLoose(PSRoomPanel,_preact$Component);var _proto2=PSRoomPanel.prototype;_proto2.subscribeTo=function subscribeTo(model){var _this4=this;var callback=arguments.length>1&&arguments[1]!==undefined?arguments[1]:function(){_this4.forceUpdate();};var subscription=model.subscribe(callback);this.subscriptions.push(subscription);return subscription;};_proto2.componentDidMount=function componentDidMount(){var _this5=this;this.props.room.onParentEvent=function(id,e){if(id==='focus')_this5.focus();};this.subscriptions.push(this.props.room.subscribe(function(args){if(!args)_this5.forceUpdate();else _this5.receiveLine(args);}));this.componentDidUpdate();};_proto2.
updateDimensions=function updateDimensions(){
var justUpdated=this.justUpdatedDimensions;
this.justUpdatedDimensions=false;

var room=this.props.room;
var newWidth=this.base.offsetWidth;
var newHeight=this.base.offsetHeight;
if(room.width===newWidth&&room.height===newHeight){
return;
}

room.width=newWidth;
room.height=newHeight;

if(justUpdated)return;
this.justUpdatedDimensions=true;
this.forceUpdate();
};_proto2.
componentDidUpdate=function componentDidUpdate(){
var room=this.props.room;
var currentlyHidden=!room.width&&room.parentElem&&['popup','semimodal-popup'].includes(room.location);
this.updateDimensions();
if(currentlyHidden)return;
if(room.focusNextUpdate){
room.focusNextUpdate=false;
this.focus();
}
};_proto2.
componentWillUnmount=function componentWillUnmount(){
this.props.room.onParentEvent=null;for(var _i2=0,_this$subscriptions2=
this.subscriptions;_i2<_this$subscriptions2.length;_i2++){var subscription=_this$subscriptions2[_i2];
subscription.unsubscribe();
}
this.subscriptions=[];
};_proto2.
close=function close(){
PS.leave(this.props.room.id);
};_proto2.
componentDidCatch=function componentDidCatch(err){
this.props.room.caughtError=err.stack||err.message;
this.setState({});
};_proto2.
receiveLine=function receiveLine(args){};_proto2.





chooseParentValue=function chooseParentValue(value){
var dropdownButton=this.props.room.parentElem;
dropdownButton.value=value;
var changeEvent=new Event('change');
dropdownButton.dispatchEvent(changeEvent);
PS.closePopup();
};_proto2.
focus=function focus(){var _this$base;
if(PSView.hasTapped)return;

var autofocus=(_this$base=this.base)==null?void 0:_this$base.querySelector('.autofocus');
autofocus==null||autofocus.focus();
autofocus==null||autofocus.select==null||autofocus.select();
};_proto2.
render=function render(){
return preact.h(PSPanelWrapper,{room:this.props.room},
preact.h("div",{"class":"mainmessage"},preact.h("p",null,"Loading..."))
);
};return PSRoomPanel;}(preact.Component);


function PSPanelWrapper(props)



{
var room=props.room;
if(room.location==='mini-window'){
var size=props.fullSize?' mini-window-flex':'';
return preact.h("div",{
id:"room-"+room.id,
"class":"mini-window-contents tiny-layout ps-room-light"+(props.scrollable===true?' scrollable':'')+size,
onClick:props.focusClick?PSView.focusIfNoSelection:undefined,onDragEnter:props.onDragEnter},

props.children
);
}
if(PS.isPopup(room)){
var _style=PSView.getPopupStyle(room,props.width,props.fullSize);
return preact.h("div",{"class":"ps-popup",id:"room-"+room.id,style:_style,onDragEnter:props.onDragEnter},
props.children
);
}
var style=PSView.posStyle(room);
if(props.scrollable==='hidden')style.overflow='hidden';
var tinyLayout=room.width<620?' tiny-layout':'';
return preact.h("div",{
"class":"ps-room"+(room.id===''?'':' ps-room-light')+(props.scrollable===true?' scrollable':'')+tinyLayout,
id:"room-"+room.id,role:"tabpanel","aria-labelledby":"roomtab-"+room.id,
style:style,onClick:props.focusClick?PSView.focusIfNoSelection:undefined,onDragEnter:props.onDragEnter},

room.caughtError?preact.h("div",{"class":"broadcast broadcast-red"},preact.h("pre",null,room.caughtError)):props.children
);
}var

PSView=function(_preact$Component2){































































function PSView(){var _this6;
_this6=_preact$Component2.call(this)||this;_this6.













































































































































































































































































































handleClickOverlay=function(ev){var _ev$target;


if(((_ev$target=ev.target)==null?void 0:_ev$target.className)==='ps-overlay'){
PS.closePopup();
ev.preventDefault();
ev.stopImmediatePropagation();
}
};PS.subscribe(function(){return _this6.forceUpdate();});if(PSView.isSafari){var _document$querySelect;(_document$querySelect=document.querySelector('meta[name=viewport]'))==null||_document$querySelect.setAttribute('content','width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0');}window.onbeforeunload=function(ev){return PS.prefs.refreshprompt?"Are you sure you want to leave?":null;};window.addEventListener('submit',function(ev){var elem=ev.target;if(elem!=null&&elem.getAttribute('data-submitsend')){var inputs=Net.formData(elem);var cmd=elem.getAttribute('data-submitsend');for(var _i4=0,_Object$entries2=Object.entries(inputs);_i4<_Object$entries2.length;_i4++){var _ref2=_Object$entries2[_i4];var name=_ref2[0];var value=_ref2[1];cmd=cmd.replace("{"+name+"}",value===true?'on':value===false?'off':value);}cmd=cmd.replace(/\{[a-z0-9-]+\}/g,'');var room=PS.getRoom(elem)||PS.mainmenu;room.sendDirect(cmd);ev.preventDefault();ev.stopImmediatePropagation();}});window.addEventListener('pointerdown',function(ev){PSView.hasTapped=ev.pointerType==='touch'||ev.pointerType==='pen';});window.addEventListener('click',function(ev){var elem=ev.target;var clickedRoom=PS.getRoom(elem);while(elem){if(elem.className==='spoiler'){elem.className='spoiler-shown';}else if(elem.className==='spoiler-shown'){elem.className='spoiler';}if((" "+elem.className+" ").includes(' username ')){var name=elem.getAttribute('data-name')||elem.innerText;var userid=toID(name);var roomid=((" "+elem.className+" ").includes(' no-interact ')?'viewuser':'user')+"-"+userid;PS.join(roomid,{parentElem:elem,rightPopup:elem.className==='userbutton username',args:{username:name}});ev.preventDefault();ev.stopImmediatePropagation();return;}if(elem.tagName==='A'||elem.getAttribute('data-href')){if(ev.ctrlKey||ev.metaKey||ev.shiftKey)break;var href=elem.getAttribute('data-href')||elem.getAttribute('href');var _roomid=PS.router.extractRoomID(href);var shortLinks=/^(rooms?suggestions?|suggestions?|adminrequests?|forgotpassword|bugs?(reports?)?|formatsuggestions|rules?|faq|credits?|privacy|contact|dex|(damage)?calc|insecure|replays?|devdiscord|smogdex|smogcord|forums?|trustworthy-dlc-link)$/;if(_roomid==='appeal'||_roomid==='appeals')_roomid='view-help-request--appeal';if(_roomid==='report')_roomid='view-help-request--report';if(_roomid==='requesthelp')_roomid='view-help-request--other';if(_roomid!==null&&elem.className!=='no-panel-intercept'&&!shortLinks.test(_roomid)){var _location=null;if(elem.getAttribute('data-target')==='replace'){var room=PS.getRoom(elem);if(room){PS.leave(room.id);_location=room.location;}}PS.join(_roomid,{parentElem:elem,location:_location});if(!PS.isPopup(PS.rooms[_roomid])){PS.closeAllPopups();}ev.preventDefault();ev.stopImmediatePropagation();}return;}if(elem.getAttribute('data-cmd')){var cmd=elem.getAttribute('data-cmd');var _room=PS.getRoom(elem)||PS.mainmenu;_room.send(cmd,elem);ev.preventDefault();ev.stopImmediatePropagation();return;}if(elem.getAttribute('data-sendraw')){var _cmd=elem.getAttribute('data-sendraw');var _room2=PS.getRoom(elem)||PS.mainmenu;_room2.sendDirect(_cmd);ev.preventDefault();ev.stopImmediatePropagation();return;}if(elem.tagName==='BUTTON'){if(_this6.handleButtonClick(elem)){ev.preventDefault();ev.stopImmediatePropagation();return;}else if(!elem.getAttribute('type')){elem.setAttribute('type','button');}}if(elem.id.startsWith('room-')){break;}elem=elem.parentElement;}if(PS.room!==clickedRoom){if(clickedRoom)PS.room=clickedRoom;PS.room.autoDismissNotifications();PS.closePopupsAbove(clickedRoom);PS.update();}if(clickedRoom&&!PS.isPopup(clickedRoom)){PSView.scrollToRoom();}});window.addEventListener('keydown',function(ev){var elem=ev.target;var isTextInput=false;var isNonEmptyTextInput=false;if(elem){isTextInput=elem.tagName==='INPUT'||elem.tagName==='TEXTAREA';if(isTextInput&&['button','radio','checkbox','file'].includes(elem.type)){isTextInput=false;}if(isTextInput&&elem.value){isNonEmptyTextInput=true;}if(elem.contentEditable==='true'){isTextInput=true;if(elem.textContent&&elem.textContent!=='\n'){isNonEmptyTextInput=true;}}}if(!isNonEmptyTextInput){if((PS.room.onParentEvent==null?void 0:PS.room.onParentEvent('keydown',ev))===false){ev.stopImmediatePropagation();ev.preventDefault();return;}}var modifierKey=ev.ctrlKey||ev.altKey||ev.metaKey||ev.shiftKey;var altKey=!ev.ctrlKey&&ev.altKey&&!ev.metaKey&&!ev.shiftKey;if(altKey&&ev.keyCode===38){PS.arrowKeysUsed=true;PS.focusUpRoom();}else if(altKey&&ev.keyCode===40){PS.arrowKeysUsed=true;PS.focusDownRoom();}else if(ev.keyCode===27){if(PS.popups.length){ev.stopImmediatePropagation();ev.preventDefault();PS.closePopup();PS.focusRoom(PS.room.id);}else if(PS.room.id==='rooms'){PS.hideRightRoom();}}if(isNonEmptyTextInput)return;if(altKey&&ev.keyCode===37){PS.arrowKeysUsed=true;PS.focusLeftRoom();}else if(altKey&&ev.keyCode===39){PS.arrowKeysUsed=true;PS.focusRightRoom();}if(modifierKey)return;if(ev.keyCode===37){PS.arrowKeysUsed=true;PS.focusLeftRoom();}else if(ev.keyCode===39){PS.arrowKeysUsed=true;PS.focusRightRoom();}else if(ev.keyCode===191&&!isTextInput&&PS.room===PS.mainmenu){ev.stopImmediatePropagation();ev.preventDefault();PS.join('dm---');}});window.addEventListener('dragend',function(ev){PS.dragging=null;ev.preventDefault();});window.addEventListener('drop',function(ev){var _ev$dataTransfer,_PS$dragging;console.log("drop: "+((_ev$dataTransfer=ev.dataTransfer)==null?void 0:_ev$dataTransfer.dropEffect));var target=ev.target;if(((_PS$dragging=PS.dragging)==null?void 0:_PS$dragging.type)==='room'){var _type;if((_type=target.type)!=null&&_type.startsWith("text")){PS.dragging=null;return;}PS.updateAutojoin();ev.preventDefault();PS.dragging=null;return;}if(!PS.dragging||PS.dragging.type==='?'){var _ev$dataTransfer2;if(!((_ev$dataTransfer2=ev.dataTransfer)!=null&&_ev$dataTransfer2.files.length))return;}ev.preventDefault();for(var _i6=0,_Object$values2=Object.values(PS.roomTypes);_i6<_Object$values2.length;_i6++){var Panel=_Object$values2[_i6];if(Panel.handleDrop!=null&&Panel.handleDrop(ev)){PS.dragging=null;return;}}PS.alert("Sorry, we don't know what to do with that file.\n\nSupported file types:\n"+"- images (to set your background)\n- downloaded replay files\n- team files");PS.dragging=null;});var colorSchemeQuery=window.matchMedia==null?void 0:window.matchMedia('(prefers-color-scheme: dark)');if((colorSchemeQuery==null?void 0:colorSchemeQuery.media)!=='not all'){colorSchemeQuery.addEventListener('change',function(cs){if(PS.prefs.theme==='system')document.body.className=cs.matches?'dark':'';});}PS.prefs.subscribeAndRun(function(key){if(!key||key==='theme'){var dark=PS.prefs.theme==='dark'||PS.prefs.theme==='system'&&(colorSchemeQuery==null?void 0:colorSchemeQuery.matches);document.body.className=dark?'dark':'';}});return _this6;}_inheritsLoose(PSView,_preact$Component2);PSView.setTextboxFocused=function setTextboxFocused(focused){if(!PSView.narrowMode)return;if(!PSView.isChrome&&!PSView.isSafari)return;this.textboxFocused=focused;if(focused){document.documentElement.classList.remove('scroll-snap-enabled');PSView.scrollToRoom();}else{document.documentElement.classList.add('scroll-snap-enabled');}};PSView.focusPreview=function focusPreview(room){if(room!==PS.room)return'';var verticalBuf=this.verticalFocusPreview();if(verticalBuf)return verticalBuf;var isMiniRoom=PS.room.location==='mini-window';var _PS$horizontalNav=PS.horizontalNav(),rooms=_PS$horizontalNav.rooms,index=_PS$horizontalNav.index;if(index===-1)return'';var buf=' ';var leftRoom=PS.rooms[rooms[index-1]];if(leftRoom)buf+="\u2190 "+leftRoom.title;buf+=PS.arrowKeysUsed||isMiniRoom?" | ":" (use arrow keys) ";var rightRoom=PS.rooms[rooms[index+1]];if(rightRoom)buf+=rightRoom.title+" \u2192";return buf;};PSView.verticalFocusPreview=function verticalFocusPreview(){var _PS$verticalNav=PS.verticalNav(),rooms=_PS$verticalNav.rooms,index=_PS$verticalNav.index;if(index===-1)return'';var upRoom=PS.rooms[rooms[index-1]];var downRoom=PS.rooms[rooms[index+1]];if(index===rooms.length-2&&rooms[index+1]==='news')downRoom=undefined;if(!upRoom&&!downRoom)return'';var buf=' ';var altLabel=PSView.isMac?'ᴏᴘᴛ':'ᴀʟᴛ';if(upRoom)buf+=altLabel+"\u2191 "+upRoom.title;buf+=" | ";if(downRoom)buf+=altLabel+"\u2193 "+downRoom.title;return buf;};PSView.scrollToHeader=function scrollToHeader(){if(PSView.narrowMode&&window.scrollX>0){if(PSView.isSafari||PSView.isFirefox){document.documentElement.classList.remove('scroll-snap-enabled');window.scrollTo(0,0);setTimeout(function(){if(!PSView.textboxFocused)document.documentElement.classList.add('scroll-snap-enabled');},1);}else{window.scrollTo(0,0);}}};PSView.scrollToRoom=function scrollToRoom(){if(PSView.narrowMode&&window.scrollX===0){if(PSView.isSafari||PSView.isFirefox){document.documentElement.classList.remove('scroll-snap-enabled');window.scrollTo(NARROW_MODE_HEADER_WIDTH,0);setTimeout(function(){if(!PSView.textboxFocused)document.documentElement.classList.add('scroll-snap-enabled');},1);}else{window.scrollTo(NARROW_MODE_HEADER_WIDTH,0);}}};var _proto3=PSView.prototype;_proto3.
handleButtonClick=function handleButtonClick(elem){
switch(elem.name){
case'closeRoom':{var _PS$getRoom,_PS$rooms$roomid;
var roomid=elem.value||((_PS$getRoom=PS.getRoom(elem))==null?void 0:_PS$getRoom.id)||'';
(_PS$rooms$roomid=PS.rooms[roomid])==null||_PS$rooms$roomid.send('/close',elem);
return true;
}
case'joinRoom':
PS.join(elem.value,{
parentElem:elem
});
return true;
case'register':
PS.join('register',{
parentElem:elem
});
return true;
case'showOtherFormats':{

var table=elem.closest('table');
var _room3=PS.getRoom(elem);
if(table){var _log;for(var _i8=0,_table$querySelectorA2=
table.querySelectorAll('tr.hidden');_i8<_table$querySelectorA2.length;_i8++){var row=_table$querySelectorA2[_i8];
row.style.display='table-row';
}for(var _i10=0,_table$querySelectorA4=
table.querySelectorAll('tr.no-matches');_i10<_table$querySelectorA4.length;_i10++){var _row=_table$querySelectorA4[_i10];
_row.style.display='none';
}
elem.closest('tr').style.display='none';
(_log=_room3.log)==null||_log.updateScroll();
}
return true;
}
case'copyText':
var dummyInput=document.createElement("input");



dummyInput.id="dummyInput";
dummyInput.value=elem.value||elem.href||"";
dummyInput.style.position='absolute';
elem.appendChild(dummyInput);
dummyInput.select();
document.execCommand("copy");
elem.removeChild(dummyInput);
elem.innerText='Copied!';
return true;
case'send':
case'cmd':
var room=PS.getRoom(elem)||PS.mainmenu;
if(elem.name==='send'){
room.sendDirect(elem.value);
}else{
room.send(elem.value);
}
return true;
}
return false;
};_proto3.
componentDidCatch=function componentDidCatch(err){
PS.mainmenu.caughtError=err.stack||err.message;
this.setState({});
};PSView.
containingRoomid=function containingRoomid(elem){
var curElem=elem;
while(curElem){
if(curElem.id.startsWith('room-')){
return curElem.id.slice(5);
}
curElem=curElem.parentElement;
}
return null;
};PSView.
isEmptyClick=function isEmptyClick(e){
try{
var selection=window.getSelection();
if(selection.type==='Range')return false;
}catch(_unused){}
BattleTooltips.hideTooltip();
};PSView.
posStyle=function posStyle(room){
if(PS.leftPanelWidth===null){

if(room===PS.panel){

return{top:'30px',left:PSView.verticalHeaderWidth+"px",minWidth:"none"};
}
}else if(PS.leftPanelWidth===0){

if(room===PS.panel)return{};
}else{

if(room===PS.leftPanel)return{width:PS.leftPanelWidth+"px",right:'auto'};
if(room===PS.rightPanel)return{top:56,left:PS.leftPanelWidth+1};
}

return{display:'none'};
};PSView.
getPopupStyle=function getPopupStyle(room,width,fullSize){var _room$parentElem;
if(fullSize){
return{width:'90%',maxHeight:'90%',maxWidth:'none',position:'relative',margin:'5vh auto 0'};
}

var source=(_room$parentElem=room.parentElem)==null?void 0:_room$parentElem.getBoundingClientRect();
if(source&&!source.width&&!source.height&&!source.top&&!source.left){

room.parentElem=null;
PS.update();
}

if(room.location==='modal-popup'||!room.parentElem||!source){
return{maxWidth:width||480};
}
if(!room.width||!room.height){
room.focusNextUpdate=true;
return{
position:'absolute',
visibility:'hidden',
margin:0,
top:0,
left:0
};
}

var style={
position:'absolute',
margin:0
};




var isFixed=room.location!=='popup';
var offsetLeft=isFixed?0:window.scrollX;
var offsetTop=isFixed?0:window.scrollY;
var availableWidth=document.documentElement.clientWidth+offsetLeft;
var availableHeight=document.documentElement.clientHeight;

var sourceWidth=source.width;
var sourceHeight=source.height;
var sourceTop=source.top+offsetTop;
var sourceLeft=source.left+offsetLeft;

var height=room.height;
width=width||room.width;

if(room.rightPopup){

if(availableHeight>sourceTop+height+5&&(
sourceTop<availableHeight*2/3||sourceTop+200<availableHeight)){
style.top=sourceTop;
}else if(sourceTop+sourceHeight>=height){
style.bottom=Math.max(availableHeight-sourceTop-sourceHeight,0);
}else{
style.top=Math.max(0,availableHeight-height);
}
var popupLeft=sourceLeft+sourceWidth;
if(width!=='auto'&&popupLeft+width>availableWidth){

style={
position:'absolute',
margin:0
};
}else{
style.left=popupLeft;
}

}

if(style.left===undefined){

if(availableHeight>sourceTop+sourceHeight+height+5&&(
sourceTop+sourceHeight<availableHeight*2/3||sourceTop+sourceHeight+200<availableHeight)){
style.top=sourceTop+sourceHeight;
}else if(height+30<=sourceTop){
style.bottom=Math.max(availableHeight-sourceTop,0);
}else if(height+35<availableHeight){
style.bottom=5;
}else{
style.top=25;
}

var availableAlignedWidth=availableWidth-sourceLeft;
if(width!=='auto'&&availableAlignedWidth<width+10){


style.left=Math.max(availableWidth-width-10,offsetLeft);
}else{
style.left=sourceLeft;
}

}

if(width)style.maxWidth=width;

return style;
};_proto3.
renderRoom=function renderRoom(room){
var RoomType=PS.roomTypes[room.type];
var Panel=RoomType&&!room.isPlaceholder&&!room.caughtError?RoomType:PSRoomPanel;
return preact.h(Panel,{key:room.id,room:room});
};_proto3.
renderPopup=function renderPopup(room){
var RoomType=PS.roomTypes[room.type];
var Panel=RoomType&&!room.isPlaceholder&&!room.caughtError?RoomType:PSRoomPanel;
if(room.location==='popup'&&room.parentElem){
return preact.h(Panel,{key:room.id,room:room});
}
return preact.h("div",{key:room.id,"class":"ps-overlay",onClick:this.handleClickOverlay,role:"dialog"},
preact.h(Panel,{room:room})
);
};_proto3.
render=function render(){var _this7=this;
var rooms=[];
for(var roomid in PS.rooms){
var room=PS.rooms[roomid];
if(PS.isNormalRoom(room)){
rooms.push(this.renderRoom(room));
}
}
return preact.h("div",{"class":"ps-frame",role:"none"},
preact.h(PSHeader,null),
preact.h(PSMiniHeader,null),
rooms,
PS.popups.map(function(roomid){return _this7.renderPopup(PS.rooms[roomid]);})
);
};return PSView;}(preact.Component);_PSView=PSView;PSView.isIOS=['iPad Simulator','iPhone Simulator','iPod Simulator','iPad','iPhone','iPod'].includes(navigator.platform);PSView.isChrome=navigator.userAgent.includes(' Chrome/');PSView.isSafari=!_PSView.isChrome&&navigator.userAgent.includes(' Safari/');PSView.isFirefox=navigator.userAgent.includes(' Firefox/');PSView.isMac=(_navigator$platform=navigator.platform)==null?void 0:_navigator$platform.startsWith('Mac');PSView.textboxFocused=false;PSView.dragend=null;PSView.hasTapped=false;PSView.narrowMode=false;PSView.verticalHeaderWidth=VERTICAL_HEADER_WIDTH;PSView.focusIfNoSelection=function(ev){var _window$getSelection;var room=PS.getRoom(ev.target,true);if(!room)return;if((window.getSelection==null||(_window$getSelection=window.getSelection())==null?void 0:_window$getSelection.type)==='Range')return;room.autoDismissNotifications();PS.setFocus(room);};


function PSIcon(
props)

{
if('pokemon'in props){
return preact.h("span",{"class":"picon",style:Dex.getPokemonIcon(props.pokemon)});
}
if('item'in props){
return preact.h("span",{"class":"itemicon",style:Dex.getItemIcon(props.item)});
}
if('type'in props){
var type=Dex.types.get(props.type).name;
if(!type)type='???';
var sanitizedType=type.replace(/\?/g,'%3f');
return preact.h("img",{
src:Dex.resourcePrefix+"sprites/types/"+sanitizedType+".png",alt:type,
height:"14",width:"32","class":"pixelated"+(props.b?' b':''),style:"vertical-align:middle"}
);
}
if('category'in props){
var categoryID=toID(props.category);
var sanitizedCategory='';
switch(categoryID){
case'physical':
case'special':
case'status':
sanitizedCategory=categoryID.charAt(0).toUpperCase()+categoryID.slice(1);
break;
default:
sanitizedCategory='undefined';
break;
}
return preact.h("img",{
src:Dex.resourcePrefix+"sprites/categories/"+sanitizedCategory+".png",alt:sanitizedCategory,
height:"14",width:"32","class":"pixelated",style:"vertical-align:middle"}
);
}
return null;
}
//# sourceMappingURL=panels.js.map