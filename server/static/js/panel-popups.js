"use strict";function _inheritsLoose(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,_setPrototypeOf(t,o);}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t;},_setPrototypeOf(t,e);}var

















UserRoom=function(_PSRoom){




function UserRoom(options){var _options$args;var _this;
_this=_PSRoom.call(this,options)||this;_this.classType='user';_this.userid=void 0;_this.name=void 0;_this.isSelf=void 0;
var userid=_this.id.split('-')[1]||'';
_this.setName(((_options$args=options.args)==null?void 0:_options$args.username)||userid);return _this;
}_inheritsLoose(UserRoom,_PSRoom);var _proto=UserRoom.prototype;_proto.
setName=function setName(name){
this.name=name;
this.userid=toID(name);
this.isSelf=this.userid===PS.user.userid;
if(/[a-zA-Z0-9]/.test(this.name.charAt(0)))this.name=' '+this.name;
this.update(null);
if(this.userid)PS.send("/cmd userdetails "+this.userid);
};return UserRoom;}(PSRoom);var


UserPanel=function(_PSRoomPanel){function UserPanel(){var _this2;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this2=_PSRoomPanel.call.apply(_PSRoomPanel,[this].concat(args))||this;_this2.














































































































































lookup=function(ev){var _querySelector;
ev.preventDefault();
ev.stopImmediatePropagation();
var room=_this2.props.room;
var username=(_querySelector=_this2.base.querySelector('input[name=username]'))==null?void 0:_querySelector.value;
room.setName(username||'');
};_this2.
maybeReset=function(ev){var _querySelector2;
var room=_this2.props.room;
var username=(_querySelector2=_this2.base.querySelector('input[name=username]'))==null?void 0:_querySelector2.value;
if(toID(username)!==room.userid){
room.setName('');
}
};return _this2;}_inheritsLoose(UserPanel,_PSRoomPanel);var _proto2=UserPanel.prototype;_proto2.renderUser=function renderUser(){var room=this.props.room;if(!room.userid)return null;var user=PS.mainmenu.userdetailsCache[room.userid]||{userid:room.userid,name:room.name.slice(1),avatar:'[loading]'};if(!user.avatar){user.name=room.name;}var hideInteraction=room.id.startsWith('viewuser-');var group=PS.server.getGroup(room.name);var groupName=group.name||null;if(group.type==='punishment'){groupName=preact.h("span",{style:"color:#777777"},groupName);}var globalGroup=PS.server.getGroup(user.group);var globalGroupName=globalGroup.name&&"Global "+globalGroup.name||null;if(globalGroup.type==='punishment'){globalGroupName=preact.h("span",{style:"color:#777777"},globalGroupName);}if(globalGroup.name===group.name)groupName=null;var roomsList=null;if(user.rooms){var battlebuf=[];var chatbuf=[];var privatebuf=[];for(var roomid in user.rooms){if(roomid==='global')continue;var curRoom=user.rooms[roomid];var roomrank=null;if(!/[A-Za-z0-9]/.test(roomid.charAt(0))){roomrank=preact.h("small",{style:"color: #888; font-size: 100%"},roomid.charAt(0));}roomid=toRoomid(roomid);if(roomid.substr(0,7)==='battle-'){var p1=curRoom.p1.substr(1);var p2=curRoom.p2.substr(1);var ownBattle=PS.user.userid===toUserid(p1)||PS.user.userid===toUserid(p2);var roomLink=preact.h("a",{href:"/"+roomid,"class":'ilink'+(ownBattle||roomid in PS.rooms?' yours':''),title:(p1||'?')+" v. "+(p2||'?')},roomrank,roomid.substr(7));if(curRoom.isPrivate){if(privatebuf.length)privatebuf.push(', ');privatebuf.push(roomLink);}else{if(battlebuf.length)battlebuf.push(', ');battlebuf.push(roomLink);}}else{var _roomLink=preact.h("a",{href:"/"+roomid,"class":'ilink'+(roomid in PS.rooms?' yours':'')},roomrank,roomid);if(curRoom.isPrivate){if(privatebuf.length)privatebuf.push(", ");privatebuf.push(_roomLink);}else{if(chatbuf.length)chatbuf.push(', ');chatbuf.push(_roomLink);}}}if(battlebuf.length)battlebuf.unshift(preact.h("br",null),preact.h("em",null,"Battles:")," ");if(chatbuf.length)chatbuf.unshift(preact.h("br",null),preact.h("em",null,"Chatrooms:")," ");if(privatebuf.length)privatebuf.unshift(preact.h("br",null),preact.h("em",null,"Private rooms:")," ");if(battlebuf.length||chatbuf.length||privatebuf.length){roomsList=preact.h("small",{"class":"rooms"},battlebuf,chatbuf,privatebuf);}}else if(user.rooms===false){roomsList=preact.h("strong",{"class":"offline"},"OFFLINE");}var isSelf=user.userid===PS.user.userid;var away=false;var status=null;if(user.status){away=user.status.startsWith('!');status=away?user.status.slice(1):user.status;}var buttonbar=[];if(!hideInteraction){buttonbar.push(isSelf?preact.h("p",{"class":"buttonbar"},preact.h("button",{"class":"button",disabled:true},"Challenge")," ",preact.h("button",{"class":"button","data-href":"dm-"},"Chat Self")):!PS.user.named?preact.h("p",{"class":"buttonbar"},preact.h("button",{"class":"button",disabled:true},"Challenge")," ",preact.h("button",{"class":"button",disabled:true},"Chat")," ",preact.h("button",{"class":"button",disabled:true},"\u2026")):preact.h("p",{"class":"buttonbar"},preact.h("button",{"class":"button","data-href":"challenge-"+user.userid},"Challenge")," ",preact.h("button",{"class":"button","data-href":"dm-"+user.userid},"Chat")," ",preact.h("button",{"class":"button","data-href":"useroptions-"+user.userid+"-"+(room.parentRoomid||'')},"\u2026")));if(isSelf){buttonbar.push(preact.h("hr",null),preact.h("p",{"class":"buttonbar",style:"text-align: right"},preact.h("button",{"class":"button","data-href":"login"},preact.h("i",{"class":"fa fa-pencil","aria-hidden":true})," Change name")," ",preact.h("button",{"class":"button","data-cmd":"/logout"},preact.h("i",{"class":"fa fa-power-off","aria-hidden":true})," Log out")));}}var avatar=user.avatar!=='[loading]'?Dex.resolveAvatar(""+(user.avatar||'unknown')):null;return[preact.h("div",{"class":"userdetails"},avatar&&(room.isSelf?preact.h("img",{src:avatar,"class":"trainersprite yours","data-href":"avatars"}):preact.h("img",{src:avatar,"class":"trainersprite"})),preact.h("strong",null,preact.h("a",{href:"//"+Config.routes.users+"/"+user.userid,target:"_blank",style:"color: "+(away?'#888888':BattleLog.usernameColor(user.userid))},user.name)),preact.h("br",null),status&&preact.h("div",{"class":"userstatus"},status),groupName&&preact.h("div",{"class":"usergroup roomgroup"},groupName),globalGroupName&&preact.h("div",{"class":"usergroup globalgroup"},globalGroupName),user.customgroup&&preact.h("div",{"class":"usergroup globalgroup"},user.customgroup),!hideInteraction&&roomsList),buttonbar];};_proto2.

render=function render(){
var room=this.props.room;
var showLookup=room.id==='users';

return preact.h(PSPanelWrapper,{room:room},preact.h("div",{"class":"pad"},
showLookup&&preact.h("form",{onSubmit:this.lookup,style:{minWidth:'278px'}},
preact.h("label",{"class":"label"},"Username: ",

preact.h("input",{type:"search",name:"username","class":"textbox autofocus",onInput:this.maybeReset,onChange:this.maybeReset})
),
!room.userid&&preact.h("p",{"class":"buttonbar"},
preact.h("button",{type:"submit","class":"button"},preact.h("strong",null,"Look up"))," ",
preact.h("button",{name:"closeRoom","class":"button"},"Close")
),
!!room.userid&&preact.h("hr",null)
),

this.renderUser()
));
};return UserPanel;}(PSRoomPanel);UserPanel.id='user';UserPanel.routes=['user-*','viewuser-*','users'];UserPanel.Model=UserRoom;UserPanel.location='popup';var


UserOptionsPanel=function(_PSRoomPanel2){function UserOptionsPanel(){var _this3;for(var _len2=arguments.length,args=new Array(_len2),_key2=0;_key2<_len2;_key2++){args[_key2]=arguments[_key2];}_this3=_PSRoomPanel2.call.apply(_PSRoomPanel2,[this].concat(args))||this;_this3.





















handleMute=function(ev){
_this3.setState({showMuteInput:true,showBanInput:false,showLockInput:false});
ev.preventDefault();
ev.stopImmediatePropagation();
};_this3.
handleBan=function(ev){
_this3.setState({showBanInput:true,showMuteInput:false,showLockInput:false});
ev.preventDefault();
ev.stopImmediatePropagation();
};_this3.
handleLock=function(ev){
_this3.setState({showLockInput:true,showMuteInput:false,showBanInput:false});
ev.preventDefault();
ev.stopImmediatePropagation();
};_this3.

handleCancel=function(ev){
_this3.setState({showBanInput:false,showMuteInput:false,showLockInput:false,showConfirm:false});
ev.preventDefault();
ev.stopImmediatePropagation();
};_this3.

handleConfirm=function(ev){
var data=_this3.state.data;
if(!data)return;
var _this3$getTargets=_this3.getTargets(),targetUser=_this3$getTargets.targetUser,targetRoom=_this3$getTargets.targetRoom;

var cmd='';
if(data.action==="Mute"){
cmd+=data.duration==="1 hour"?"/hourmute ":"/mute ";
}else if(data.action==="Ban"){
cmd+=data.duration==="1 week"?"/weekban ":"/ban ";
}else if(data.action==="Lock"){
cmd+=data.duration==="1 week"?"/weeklock ":"/lock ";
}else if(data.action==="Namelock"){
cmd+="/namelock ";
}else{
return;
}
cmd+=targetUser+" "+(data.reason?','+data.reason:'');
targetRoom==null||targetRoom.send(cmd);
_this3.close();
};_this3.

handleAddFriend=function(ev){
var _this3$getTargets2=_this3.getTargets(),targetUser=_this3$getTargets2.targetUser,targetRoom=_this3$getTargets2.targetRoom;
targetRoom==null||targetRoom.send("/friend add "+targetUser);
_this3.setState({requestSent:true});
ev.preventDefault();
ev.stopImmediatePropagation();
};_this3.

handleIgnore=function(){
var _this3$getTargets3=_this3.getTargets(),targetUser=_this3$getTargets3.targetUser,targetRoom=_this3$getTargets3.targetRoom;
targetRoom==null||targetRoom.send("/ignore "+targetUser);
_this3.close();
};_this3.

handleUnignore=function(){
var _this3$getTargets4=_this3.getTargets(),targetUser=_this3$getTargets4.targetUser,targetRoom=_this3$getTargets4.targetRoom;
targetRoom==null||targetRoom.send("/unignore "+targetUser);
_this3.close();
};_this3.

muteUser=function(ev){var _this3$base;
_this3.setState({showMuteInput:false});
var hrMute=ev.currentTarget.value==="1hr";
var reason=(_this3$base=_this3.base)==null||(_this3$base=_this3$base.querySelector("input[name=mutereason]"))==null?void 0:_this3$base.value;
var data={
action:'Mute',
reason:reason,
duration:hrMute?"1 hour":"7 minutes"
};
_this3.setState({data:data,showConfirm:true});
ev.preventDefault();
ev.stopImmediatePropagation();
};_this3.

banUser=function(ev){var _this3$base2;
_this3.setState({showBanInput:false});
var weekBan=ev.currentTarget.value==="1wk";
var reason=(_this3$base2=_this3.base)==null||(_this3$base2=_this3$base2.querySelector("input[name=banreason]"))==null?void 0:_this3$base2.value;
var data={
action:'Ban',
reason:reason,
duration:weekBan?"1 week":"2 days"
};
_this3.setState({data:data,showConfirm:true});
ev.preventDefault();
ev.stopImmediatePropagation();
};_this3.

lockUser=function(ev){var _this3$base3;
_this3.setState({showLockInput:false});
var weekLock=ev.currentTarget.value==="1wk";
var isNamelock=ev.currentTarget.value==="nmlk";
var reason=(_this3$base3=_this3.base)==null||(_this3$base3=_this3$base3.querySelector("input[name=lockreason]"))==null?void 0:_this3$base3.value;
var data={
action:isNamelock?'Namelock':'Lock',
reason:reason,
duration:weekLock?"1 week":"2 days"
};
_this3.setState({data:data,showConfirm:true});
ev.preventDefault();
ev.stopImmediatePropagation();
};_this3.

isIgnoringUser=function(userid){
var ignoring=PS.prefs.ignore||{};
if(ignoring[userid]===1)return true;
return false;
};return _this3;}_inheritsLoose(UserOptionsPanel,_PSRoomPanel2);var _proto3=UserOptionsPanel.prototype;_proto3.getTargets=function getTargets(){var _targetRoom,_targetRoom2,_targetRoom3,_targetRoom4,_targetRoom5;var _this$props$room$id$s=this.props.room.id.split('-'),targetUser=_this$props$room$id$s[1],targetRoomid=_this$props$room$id$s[2];var targetRoom=PS.rooms[targetRoomid]||null;if(((_targetRoom=targetRoom)==null?void 0:_targetRoom.type)!=='chat')targetRoom=(_targetRoom2=targetRoom)==null?void 0:_targetRoom2.getParent();if(((_targetRoom3=targetRoom)==null?void 0:_targetRoom3.type)!=='chat')targetRoom=(_targetRoom4=targetRoom)==null?void 0:_targetRoom4.getParent();if(((_targetRoom5=targetRoom)==null?void 0:_targetRoom5.type)!=='chat')targetRoom=null;return{targetUser:targetUser,targetRoomid:targetRoomid,targetRoom:targetRoom};};_proto3.

render=function render(){var _this4=this,_this$state$data,_this$state$data2,_this$state$data3;
var room=this.props.room;
var banPerms=["@","#","~"];
var mutePerms=["%"].concat(banPerms);
var _this$getTargets=this.getTargets(),targetUser=_this$getTargets.targetUser,targetRoom=_this$getTargets.targetRoom;
var userRoomGroup=(targetRoom==null?void 0:targetRoom.users[PS.user.userid].charAt(0))||'';
var canMute=mutePerms.includes(userRoomGroup);
var canBan=banPerms.includes(userRoomGroup);
var canLock=mutePerms.includes(PS.user.group);
var isVisible=function(actionName){
if(actionName==='mute'){
return canMute&&!_this4.state.showLockInput&&!_this4.state.showBanInput&&!_this4.state.showConfirm;
}
if(actionName==='ban'){
return canBan&&!_this4.state.showLockInput&&!_this4.state.showMuteInput&&!_this4.state.showConfirm;
}
if(actionName==='lock'){
return canLock&&!_this4.state.showBanInput&&!_this4.state.showMuteInput&&!_this4.state.showConfirm;
}
};

return preact.h(PSPanelWrapper,{room:room,width:280},preact.h("div",{"class":"pad"},
preact.h("p",null,
this.isIgnoringUser(targetUser)?
preact.h("button",{onClick:this.handleUnignore,"class":"button"},"Unignore"

):

preact.h("button",{onClick:this.handleIgnore,"class":"button"},"Ignore"

)

),
preact.h("p",null,
preact.h("button",{"data-href":"view-help-request-report-user-"+targetUser,"class":"button"},"Report"

)
),
preact.h("p",null,
this.state.requestSent?
preact.h("button",{"class":"button disabled"},"Sent request"

):

preact.h("button",{onClick:this.handleAddFriend,"class":"button"},"Add friend"

)

),
(canMute||canBan||canLock)&&preact.h("hr",null),
this.state.showConfirm&&preact.h("p",null,
preact.h("small",null,(_this$state$data=
this.state.data)==null?void 0:_this$state$data.action," ",preact.h("b",null,targetUser)," ",
!((_this$state$data2=this.state.data)!=null&&_this$state$data2.action.endsWith('ock'))?preact.h(preact.Fragment,null,"from ",preact.h("b",null,targetRoom==null?void 0:targetRoom.title)):''," for ",(_this$state$data3=this.state.data)==null?void 0:_this$state$data3.duration,"?"
),
preact.h("p",{"class":"buttonbar"},
preact.h("button",{"class":"button",onClick:this.handleConfirm},
preact.h("i",{"class":"fa fa-confirm","aria-hidden":true})," Confirm"
)," ",
preact.h("button",{"class":"button",onClick:this.handleCancel},"Cancel"

)
)
),
preact.h("p",{"class":"buttonbar"},
isVisible('mute')&&(this.state.showMuteInput?
preact.h("div",null,
preact.h("label",{"class":"label"},"Reason: ",

preact.h("input",{name:"mutereason","class":"textbox autofocus",placeholder:"Mute reason (optional)"})
)," "," ",preact.h("br",null),
preact.h("button",{"class":"button",onClick:this.muteUser,value:"7min"},"For 7 Mins")," ",
preact.h("button",{"class":"button",onClick:this.muteUser,value:"1hr"},"For 1 Hour")," ",
preact.h("button",{"class":"button",onClick:this.handleCancel}," Cancel")
):

preact.h("button",{"class":"button",onClick:this.handleMute},
preact.h("i",{"class":"fa fa-hourglass-half","aria-hidden":true})," Mute"
)),
" ",
isVisible('ban')&&(this.state.showBanInput?
preact.h("div",null,
preact.h("label",{"class":"label"},"Reason: ",

preact.h("input",{name:"banreason","class":"textbox autofocus",placeholder:"Ban reason (optional)"})
),preact.h("br",null),
preact.h("button",{"class":"button",onClick:this.banUser,value:"2d"},"For 2 Days")," ",
preact.h("button",{"class":"button",onClick:this.banUser,value:"1wk"},"For 1 Week")," ",
preact.h("button",{"class":"button",onClick:this.handleCancel},"Cancel")
):

preact.h("button",{"class":"button",onClick:this.handleBan},
preact.h("i",{"class":"fa fa-gavel","aria-hidden":true})," Ban"
)),
" ",
isVisible('lock')&&(this.state.showLockInput?
preact.h("div",null,
preact.h("label",{"class":"label"},"Reason: ",

preact.h("input",{name:"lockreason","class":"textbox autofocus",placeholder:"Lock reason (optional)"})
),preact.h("br",null),
preact.h("button",{"class":"button",onClick:this.lockUser,value:"2d"},"For 2 Days")," ",
preact.h("button",{"class":"button",onClick:this.lockUser,value:"1wk"},"For 1 Week")," ",
preact.h("button",{"class":"button",onClick:this.lockUser,value:"nmlk"},"Namelock")," ",
preact.h("button",{"class":"button",onClick:this.handleCancel},"Cancel")
):

preact.h("button",{"class":"button",onClick:this.handleLock},
preact.h("i",{"class":"fa fa-lock","aria-hidden":true})," Lock/Namelock"
))

)
));
};return UserOptionsPanel;}(PSRoomPanel);UserOptionsPanel.id='useroptions';UserOptionsPanel.routes=['useroptions-*'];UserOptionsPanel.location='popup';UserOptionsPanel.noURL=true;var


UserListPanel=function(_PSRoomPanel3){function UserListPanel(){return _PSRoomPanel3.apply(this,arguments)||this;}_inheritsLoose(UserListPanel,_PSRoomPanel3);var _proto4=UserListPanel.prototype;_proto4.




render=function render(){
var room=this.props.room;
var parentRoom=room.getParent();
if(parentRoom.type!=='chat'&&parentRoom.type!=='battle'){
throw new Error("UserListPanel: "+room.id+" is not a chat room");
}

return preact.h(PSPanelWrapper,{room:room,width:280},preact.h("div",{"class":"pad"},
preact.h(ChatUserList,{room:parentRoom,"static":true})
));
};return UserListPanel;}(PSRoomPanel);UserListPanel.id='userlist';UserListPanel.routes=['userlist'];UserListPanel.location='semimodal-popup';UserListPanel.noURL=true;var


VolumePanel=function(_PSRoomPanel4){function VolumePanel(){var _this5;for(var _len3=arguments.length,args=new Array(_len3),_key3=0;_key3<_len3;_key3++){args[_key3]=arguments[_key3];}_this5=_PSRoomPanel4.call.apply(_PSRoomPanel4,[this].concat(args))||this;_this5.




setVolume=function(e){
var slider=e.currentTarget;
PS.prefs.set(slider.name,Number(slider.value));
_this5.forceUpdate();
};_this5.
setMute=function(e){
var checkbox=e.currentTarget;
PS.prefs.set('mute',!!checkbox.checked);
PS.update();
};return _this5;}_inheritsLoose(VolumePanel,_PSRoomPanel4);var _proto5=VolumePanel.prototype;_proto5.
componentDidMount=function componentDidMount(){var _this6=this;
_PSRoomPanel4.prototype.componentDidMount.call(this);
this.subscriptions.push(PS.prefs.subscribe(function(){
_this6.forceUpdate();
}));
};_proto5.
render=function render(){
var room=this.props.room;
return preact.h(PSPanelWrapper,{room:room},preact.h("div",{"class":"pad"},
preact.h("h3",null,"Volume"),
preact.h("p",{"class":"volume"},
preact.h("label",{"class":"optlabel"},"Effects: ",
preact.h("span",{"class":"value"},!PS.prefs.mute&&PS.prefs.effectvolume?PS.prefs.effectvolume+"%":"-")
),
PS.prefs.mute?
preact.h("em",null,"(muted)"):
preact.h("input",{
type:"range",min:"0",max:"100",step:"1",name:"effectvolume",value:PS.prefs.effectvolume,
onChange:this.setVolume,onInput:this.setVolume,onKeyUp:this.setVolume}
)
),
preact.h("p",{"class":"volume"},
preact.h("label",{"class":"optlabel"},"Music: ",
preact.h("span",{"class":"value"},!PS.prefs.mute&&PS.prefs.musicvolume?PS.prefs.musicvolume+"%":"-")
),
PS.prefs.mute?
preact.h("em",null,"(muted)"):
preact.h("input",{
type:"range",min:"0",max:"100",step:"1",name:"musicvolume",value:PS.prefs.musicvolume,
onChange:this.setVolume,onInput:this.setVolume,onKeyUp:this.setVolume}
)
),
preact.h("p",{"class":"volume"},
preact.h("label",{"class":"optlabel"},"Notifications: ",

preact.h("span",{"class":"value"},!PS.prefs.mute&&PS.prefs.notifvolume?PS.prefs.notifvolume+"%":"-")
),
PS.prefs.mute?
preact.h("em",null,"(muted)"):
preact.h("input",{
type:"range",min:"0",max:"100",step:"1",name:"notifvolume",value:PS.prefs.notifvolume,
onChange:this.setVolume,onInput:this.setVolume,onKeyUp:this.setVolume}
)
),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},
preact.h("input",{type:"checkbox",name:"mute",checked:PS.prefs.mute,onChange:this.setMute})," Mute all"
)
)
));
};return VolumePanel;}(PSRoomPanel);VolumePanel.id='volume';VolumePanel.routes=['volume'];VolumePanel.location='popup';var


OptionsPanel=function(_PSRoomPanel5){function OptionsPanel(){var _this7;for(var _len4=arguments.length,args=new Array(_len4),_key4=0;_key4<_len4;_key4++){args[_key4]=arguments[_key4];}_this7=_PSRoomPanel5.call.apply(_PSRoomPanel5,[this].concat(args))||this;_this7.









setTheme=function(e){
var theme=e.currentTarget.value;
PS.prefs.set('theme',theme);
_this7.forceUpdate();
};_this7.
setLayout=function(e){var _PS;
var layout=e.currentTarget.value;
switch(layout){
case'':
PS.prefs.set('onepanel',null);
(_PS=PS).rightPanel||(_PS.rightPanel=PS.rooms['rooms']||null);
break;
case'onepanel':
PS.prefs.set('onepanel',true);
break;
case'vertical':
PS.prefs.set('onepanel','vertical');
break;
}
PS.update();
};_this7.
setChatroomTimestamp=function(ev){
var timestamp=ev.currentTarget.value;
PS.prefs.set('timestamps',Object.assign({},PS.prefs.timestamps,{chatrooms:timestamp||undefined}));
};_this7.
setPMsTimestamp=function(ev){
var timestamp=ev.currentTarget.value;
PS.prefs.set('timestamps',Object.assign({},PS.prefs.timestamps,{pms:timestamp||undefined}));
};_this7.

handleShowStatusInput=function(ev){
ev.preventDefault();
ev.stopImmediatePropagation();
_this7.setState({showStatusInput:!_this7.state.showStatusInput});
};_this7.

handleOnChange=function(ev){
var elem=ev.currentTarget;
var setting=elem.name;
var value=elem.checked;
switch(setting){
case'blockPMs':{
PS.prefs.set("blockPMs",value);
PS.send(value?'/blockpms':'/unblockpms');
break;
}
case'blockChallenges':{
PS.prefs.set("blockChallenges",value);
PS.send(value?'/blockchallenges':'/unblockchallenges');
break;
}
case'bwgfx':{
PS.prefs.set('bwgfx',value);
Dex.loadSpriteData(value||PS.prefs.noanim?'bw':'xy');
break;
}
case'language':{
PS.prefs.set(setting,elem.value);
PS.send("/language "+elem.value);
break;
}
case'tournaments':{
PS.prefs.set(setting,!elem.value?null:elem.value);
break;
}
case'refreshprompt':
case'noanim':
case'nopastgens':
case'noselfhighlight':
case'leavePopupRoom':
case'inchatpm':
PS.prefs.set(setting,value);
break;
}
};_this7.

editStatus=function(ev){var _statusInput$value;
var statusInput=_this7.base.querySelector('input[name=statustext]');
PS.send(statusInput!=null&&(_statusInput$value=statusInput.value)!=null&&_statusInput$value.length?"/status "+statusInput.value:"/clearstatus");
_this7.setState({showStatusUpdated:true,showStatusInput:false});
ev.preventDefault();
ev.stopImmediatePropagation();
};return _this7;}_inheritsLoose(OptionsPanel,_PSRoomPanel5);var _proto6=OptionsPanel.prototype;_proto6.componentDidMount=function componentDidMount(){_PSRoomPanel5.prototype.componentDidMount.call(this);this.subscribeTo(PS.user);};_proto6.

render=function render(){var _PS$user$registered;
var room=this.props.room;
return preact.h(PSPanelWrapper,{room:room},preact.h("div",{"class":"pad"},
preact.h("p",null,
preact.h("img",{
"class":"trainersprite yours",width:"40",height:"40",style:{verticalAlign:'middle'},
src:Dex.resolveAvatar(""+PS.user.avatar),"data-href":"avatars"}
)," ",
preact.h("strong",null,PS.user.name)
),
preact.h("p",null,
preact.h("button",{"class":"button","data-href":"avatars"}," Avatar...")
),

this.state.showStatusInput?
preact.h("p",null,
preact.h("input",{name:"statustext"}),
preact.h("button",{"class":"button",onClick:this.editStatus},preact.h("i",{"class":"fa fa-pencil","aria-hidden":true}))
):

preact.h("p",null,
preact.h("button",{"class":"button",onClick:this.handleShowStatusInput,disabled:this.state.showStatusUpdated},
this.state.showStatusUpdated?'Status Updated':'Status...')
),


PS.user.named&&(((_PS$user$registered=PS.user.registered)==null?void 0:_PS$user$registered.userid)===PS.user.userid?
preact.h("button",{className:"button","data-href":"changepassword"},"Password..."):
preact.h("button",{className:"button","data-href":"register"},"Register")),

preact.h("hr",null),
preact.h("h3",null,"Graphics"),
preact.h("p",null,
preact.h("label",{"class":"optlabel"},"Theme: ",preact.h("select",{name:"theme","class":"button",onChange:this.setTheme},
preact.h("option",{value:"light",selected:PS.prefs.theme==='light'},"Light"),
preact.h("option",{value:"dark",selected:PS.prefs.theme==='dark'},"Dark"),
preact.h("option",{value:"system",selected:PS.prefs.theme==='system'},"Match system theme")
))
),
preact.h("p",null,
preact.h("label",{"class":"optlabel"},"Layout: ",preact.h("select",{name:"layout","class":"button",onChange:this.setLayout},
preact.h("option",{value:"",selected:!PS.prefs.onepanel},"Two panels (if wide enough)"),
preact.h("option",{value:"onepanel",selected:PS.prefs.onepanel===true},"Single panel"),
preact.h("option",{value:"vertical",selected:PS.prefs.onepanel==='vertical'},"Vertical tabs")
))
),
preact.h("p",null,
preact.h("label",{"class":"optlabel"},"Background: ",
preact.h("button",{"class":"button","data-href":"changebackground"},"Change Background"

)
)
),
preact.h("p",null,
preact.h("label",{"class":"checkbox"}," ",preact.h("input",{
name:"noanim",checked:PS.prefs.noanim||false,type:"checkbox",onChange:this.handleOnChange}
)," Disable animations")
),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},preact.h("input",{
name:"bwgfx",checked:PS.prefs.bwgfx||false,type:"checkbox",onChange:this.handleOnChange}
),"  Use 2D sprites instead of 3D models")
),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},preact.h("input",{
name:"nopastgens",checked:PS.prefs.nopastgens||false,type:"checkbox",onChange:this.handleOnChange}
)," Use modern sprites for past generations")
),
preact.h("hr",null),
preact.h("h3",null,"Chat"),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},preact.h("input",{
name:"blockPMs",checked:PS.prefs.blockPMs||false,type:"checkbox",onChange:this.handleOnChange}
)," Block PMs")
),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},preact.h("input",{
name:"blockChallenges",checked:PS.prefs.blockChallenges||false,type:"checkbox",onChange:this.handleOnChange}
)," Block challenges")
),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},preact.h("input",{
name:"inchatpm",checked:PS.prefs.inchatpm||false,type:"checkbox",onChange:this.handleOnChange}
)," Show PMs in chatrooms")
),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},preact.h("input",{
name:"noselfhighlight",checked:PS.prefs.noselfhighlight||false,type:"checkbox",onChange:this.handleOnChange}
)," Do not highlight when your name is said in chat")
),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},preact.h("input",{
name:"leavePopupRoom",checked:PS.prefs.leavePopupRoom||false,type:"checkbox",onChange:this.handleOnChange}
)," Confirm before leaving a room")
),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},preact.h("input",{
name:"refreshprompt",checked:PS.prefs.refreshprompt||false,type:"checkbox",onChange:this.handleOnChange}
)," Confirm before refreshing")
),
preact.h("p",null,
preact.h("label",{"class":"optlabel"},"Language: ",

preact.h("select",{name:"language",onChange:this.handleOnChange,"class":"button"},
preact.h("option",{value:"german",selected:PS.prefs.language==="german"},"Deutsch"),
preact.h("option",{value:"english",selected:PS.prefs.language==="english"},"English"),
preact.h("option",{value:"spanish",selected:PS.prefs.language==="spanish"},"Espa\xF1ol"),
preact.h("option",{value:"french",selected:PS.prefs.language==="french"},"Fran\xE7ais"),
preact.h("option",{value:"italian",selected:PS.prefs.language==="italian"},"Italiano"),
preact.h("option",{value:"dutch",selected:PS.prefs.language==="dutch"},"Nederlands"),
preact.h("option",{value:"portuguese",selected:PS.prefs.language==="portuguese"},"Portugu\xEAs"),
preact.h("option",{value:"turkish",selected:PS.prefs.language==="turkish"},"T\xFCrk\xE7e"),
preact.h("option",{value:"hindi",selected:PS.prefs.language==="hindi"},"\u0939\u093F\u0902\u0926\u0940"),
preact.h("option",{value:"japanese",selected:PS.prefs.language==="japanese"},"\u65E5\u672C\u8A9E"),
preact.h("option",{value:"simplifiedchinese",selected:PS.prefs.language==="simplifiedchinese"},"\u7B80\u4F53\u4E2D\u6587"),
preact.h("option",{value:"traditionalchinese",selected:PS.prefs.language==="traditionalchinese"},"\u4E2D\u6587")
)
)
),
preact.h("p",null,
preact.h("label",{"class":"optlabel"},"Tournaments: ",
preact.h("select",{name:"tournaments","class":"button",onChange:this.handleOnChange},
preact.h("option",{value:"",selected:!PS.prefs.tournaments},"Notify when joined"),
preact.h("option",{value:"notify",selected:PS.prefs.tournaments==="notify"},"Always notify"),
preact.h("option",{value:"hide",selected:PS.prefs.tournaments==="hide"},"Hide")
)
)
),
preact.h("p",null,
preact.h("label",{"class":"optlabel"},"Timestamps: ",preact.h("select",{name:"layout","class":"button",onChange:this.setChatroomTimestamp},
preact.h("option",{value:"",selected:!PS.prefs.timestamps.chatrooms},"Off"),
preact.h("option",{value:"minutes",selected:PS.prefs.timestamps.chatrooms==="minutes"},"[HH:MM]"),
preact.h("option",{value:"seconds",selected:PS.prefs.timestamps.chatrooms==="seconds"},"[HH:MM:SS]")
))
),
preact.h("p",null,
preact.h("label",{"class":"optlabel"},"Timestamps in DMs: ",preact.h("select",{name:"layout","class":"button",onChange:this.setPMsTimestamp},
preact.h("option",{value:"",selected:!PS.prefs.timestamps.pms},"Off"),
preact.h("option",{value:"minutes",selected:PS.prefs.timestamps.pms==="minutes"},"[HH:MM]"),
preact.h("option",{value:"seconds",selected:PS.prefs.timestamps.pms==="seconds"},"[HH:MM:SS]")
))
),
preact.h("p",null,
preact.h("label",{"class":"optlabel"},"Chat preferences: ",

preact.h("button",{"class":"button","data-href":"chatformatting"},"Text formatting...")
)
),
preact.h("hr",null),
PS.user.named?preact.h("p",{"class":"buttonbar",style:"text-align: right"},
preact.h("button",{"class":"button","data-href":"login"},preact.h("i",{"class":"fa fa-pencil","aria-hidden":true})," Change name")," ",
preact.h("button",{"class":"button","data-cmd":"/logout"},preact.h("i",{"class":"fa fa-power-off","aria-hidden":true})," Log out")
):preact.h("p",{"class":"buttonbar",style:"text-align: right"},
preact.h("button",{"class":"button","data-href":"login"},preact.h("i",{"class":"fa fa-pencil","aria-hidden":true})," Choose name")
)
));
};return OptionsPanel;}(PSRoomPanel);OptionsPanel.id='options';OptionsPanel.routes=['options'];OptionsPanel.location='semimodal-popup';var


GooglePasswordBox=function(_preact$Component){function GooglePasswordBox(){return _preact$Component.apply(this,arguments)||this;}_inheritsLoose(GooglePasswordBox,_preact$Component);var _proto7=GooglePasswordBox.prototype;_proto7.
componentDidMount=function componentDidMount(){var _this8=this;
window.gapiCallback=function(response){
PS.user.changeNameWithPassword(_this8.props.name,response.credential,{needsGoogle:true});
};

PS.user.gapiLoaded=true;
var script=document.createElement('script');
script.async=true;
script.src='https://accounts.google.com/gsi/client';
document.getElementsByTagName('head')[0].appendChild(script);
};_proto7.
render=function render(){
return preact.h("div",{"class":"google-password-box"},
preact.h("div",{
id:"g_id_onload","data-client_id":"912270888098-jjnre816lsuhc5clj3vbcn4o2q7p4qvk.apps.googleusercontent.com",
"data-context":"signin","data-ux_mode":"popup","data-callback":"gapiCallback","data-auto_prompt":"false"}
),
preact.h("div",{
"class":"g_id_signin","data-type":"standard","data-shape":"pill","data-theme":"filled_blue","data-text":"continue_with",
"data-size":"large","data-logo_alignment":"left","data-auto_select":"true","data-itp_support":"true",
style:"width:fit-content;margin:0 auto"},
"[loading Google log-in button]")
);
};return GooglePasswordBox;}(preact.Component);var


LoginPanel=function(_PSRoomPanel6){function LoginPanel(){var _this9;for(var _len5=arguments.length,args=new Array(_len5),_key5=0;_key5<_len5;_key5++){args[_key5]=arguments[_key5];}_this9=_PSRoomPanel6.call.apply(_PSRoomPanel6,[this].concat(args))||this;_this9.





























handleSubmit=function(ev){
ev.preventDefault();
var passwordBox=_this9.base.querySelector('input[name=password]');
if(passwordBox){
PS.user.changeNameWithPassword(_this9.getUsername(),passwordBox.value);
}else{
PS.user.changeName(_this9.getUsername());
}
};_this9.
update=function(){
_this9.forceUpdate();
};_this9.





reset=function(ev){
ev.preventDefault();
ev.stopImmediatePropagation();
_this9.props.room.args=null;
_this9.forceUpdate();
};_this9.
handleShowPassword=function(ev){
ev.preventDefault();
ev.stopImmediatePropagation();
_this9.setState({passwordShown:!_this9.state.passwordShown});
};return _this9;}_inheritsLoose(LoginPanel,_PSRoomPanel6);var _proto8=LoginPanel.prototype;_proto8.componentDidMount=function componentDidMount(){var _this10=this;_PSRoomPanel6.prototype.componentDidMount.call(this);this.subscriptions.push(PS.user.subscribe(function(args){if(args){if(args.success){_this10.close();return;}_this10.props.room.args=args;setTimeout(function(){return _this10.focus();},1);}_this10.forceUpdate();}));};_proto8.getUsername=function getUsername(){var _this$props$room$args,_this$base;var loginName=PS.user.loggingIn||((_this$props$room$args=this.props.room.args)==null?void 0:_this$props$room$args.name);if(loginName)return loginName;var input=(_this$base=this.base)==null?void 0:_this$base.querySelector('input[name=username]');if(input&&!input.disabled){return input.value;}return PS.user.named?PS.user.name:'';};_proto8.focus=function focus(){var _ref;var passwordBox=this.base.querySelector('input[name=password]');var usernameBox=this.base.querySelector('input[name=username]');(_ref=passwordBox||usernameBox)==null||_ref.select();};_proto8.
render=function render(){
var room=this.props.room;
var loginState=room.args;
return preact.h(PSPanelWrapper,{room:room,width:280},preact.h("div",{"class":"pad"},
preact.h("h3",null,"Log in"),
preact.h("form",{onSubmit:this.handleSubmit},
(loginState==null?void 0:loginState.error)&&preact.h("p",{"class":"error"},loginState.error),
preact.h("p",null,preact.h("label",{"class":"label"},"Username: ",
preact.h("small",{"class":"preview",style:"color:"+BattleLog.usernameColor(toID(this.getUsername()))},"(color)"),
preact.h("input",{
"class":"textbox",type:"text",name:"username",
onInput:this.update,onChange:this.update,autocomplete:"username",
value:this.getUsername(),disabled:!!PS.user.loggingIn||!!(loginState!=null&&loginState.name)}
)
)),
PS.user.named&&!loginState&&preact.h("p",null,
preact.h("small",null,"(Others will be able to see your name change. To change name privately, use \"Log out\")")
),
(loginState==null?void 0:loginState.needsPassword)&&preact.h("p",null,
preact.h("i",{"class":"fa fa-level-up fa-rotate-90","aria-hidden":true})," ",preact.h("strong",null,"if you registered this name:"),
preact.h("label",{"class":"label"},"Password: ",

preact.h("input",{
"class":"textbox",type:this.state.passwordShown?'text':'password',name:"password",
autocomplete:"current-password",style:"width:173px"}
),
preact.h("button",{
type:"button",onClick:this.handleShowPassword,"aria-label":"Show password",
"class":"button",style:"float:right;margin:-21px 0 10px;padding: 2px 6px"},
preact.h("i",{"class":"fa fa-eye","aria-hidden":true}))
)
),
(loginState==null?void 0:loginState.needsGoogle)&&preact.h(preact.Fragment,null,
preact.h("p",null,preact.h("i",{"class":"fa fa-level-up fa-rotate-90","aria-hidden":true})," ",preact.h("strong",null,"if you registered this name:")),
preact.h("p",null,preact.h(GooglePasswordBox,{name:this.getUsername()}))
),
preact.h("p",{"class":"buttonbar"},
PS.user.loggingIn?
preact.h("button",{disabled:true,"class":"cur"},"Logging in..."):
loginState!=null&&loginState.needsPassword?
preact.h(preact.Fragment,null,
preact.h("button",{type:"submit","class":"button"},preact.h("strong",null,"Log in"))," ",
preact.h("button",{type:"button",onClick:this.reset,"class":"button"},"Cancel")
):
loginState!=null&&loginState.needsGoogle?
preact.h("button",{type:"button",onClick:this.reset,"class":"button"},"Cancel"):

preact.h(preact.Fragment,null,
preact.h("button",{type:"submit","class":"button"},preact.h("strong",null,"Choose name"))," ",
preact.h("button",{type:"button",name:"closeRoom","class":"button"},"Cancel")
),
" "
),
(loginState==null?void 0:loginState.name)&&preact.h("div",null,
preact.h("p",null,
preact.h("i",{"class":"fa fa-level-up fa-rotate-90","aria-hidden":true})," ",preact.h("strong",null,"if not:")
),
preact.h("p",{style:{maxWidth:'210px',margin:'0 auto'}},"This is someone else's account. Sorry."

),
preact.h("p",{"class":"buttonbar"},
preact.h("button",{"class":"button",onClick:this.reset},"Try another name")
)
)
)
));
};return LoginPanel;}(PSRoomPanel);LoginPanel.id='login';LoginPanel.routes=['login'];LoginPanel.location='semimodal-popup';var


AvatarsPanel=function(_PSRoomPanel7){function AvatarsPanel(){return _PSRoomPanel7.apply(this,arguments)||this;}_inheritsLoose(AvatarsPanel,_PSRoomPanel7);var _proto9=AvatarsPanel.prototype;_proto9.




render=function render(){
var room=this.props.room;

var avatars=[];
for(var i=1;i<=293;i++){var _window$BattleAvatarN;
if(i===162||i===168)continue;
avatars.push([i,((_window$BattleAvatarN=window.BattleAvatarNumbers)==null?void 0:_window$BattleAvatarN[i])||""+i]);
}

return preact.h(PSPanelWrapper,{room:room,width:1210},preact.h("div",{"class":"pad"},
preact.h("label",{"class":"optlabel"},preact.h("strong",null,"Choose an avatar or "),
preact.h("button",{"class":"button","data-cmd":"/close"}," Cancel")
),
preact.h("div",{"class":"avatarlist"},
avatars.map(function(_ref2){var i=_ref2[0],avatar=_ref2[1];return(
preact.h("button",{
"data-cmd":"/closeand /avatar "+avatar,title:"/avatar "+avatar,
"class":"option pixelated"+(avatar===PS.user.avatar?' cur':''),
style:"background-position: -"+((i-1)%16*80+1)+"px -"+(Math.floor((i-1)/16)*80+1)+"px"}
));}
)
),
preact.h("div",{style:"clear:left"}),
preact.h("p",null,preact.h("button",{"class":"button","data-cmd":"/close"},"Cancel"))
));
};return AvatarsPanel;}(PSRoomPanel);AvatarsPanel.id='avatars';AvatarsPanel.routes=['avatars'];AvatarsPanel.location='semimodal-popup';var


BattleForfeitPanel=function(_PSRoomPanel8){function BattleForfeitPanel(){return _PSRoomPanel8.apply(this,arguments)||this;}_inheritsLoose(BattleForfeitPanel,_PSRoomPanel8);var _proto10=BattleForfeitPanel.prototype;_proto10.





render=function render(){
var room=this.props.room;
var battleRoom=room.getParent();

return preact.h(PSPanelWrapper,{room:room,width:480},preact.h("div",{"class":"pad"},
preact.h("p",null,"Forfeiting makes you lose the battle. Are you sure?"),
preact.h("p",null,
preact.h("button",{"data-cmd":"/closeand /inopener /closeand /forfeit","class":"button"},preact.h("strong",null,"Forfeit and close"))," ",
preact.h("button",{"data-cmd":"/closeand /inopener /forfeit","class":"button"},"Just forfeit")," ",
!battleRoom.battle.rated&&preact.h("button",{type:"button","data-href":"replaceplayer","class":"button"},"Replace player"

)," ",
preact.h("button",{type:"button","data-cmd":"/close","class":"button"},"Cancel"

)
)
));
};return BattleForfeitPanel;}(PSRoomPanel);BattleForfeitPanel.id='forfeit';BattleForfeitPanel.routes=['forfeitbattle'];BattleForfeitPanel.location='semimodal-popup';BattleForfeitPanel.noURL=true;var


ReplacePlayerPanel=function(_PSRoomPanel9){function ReplacePlayerPanel(){var _this11;for(var _len6=arguments.length,args=new Array(_len6),_key6=0;_key6<_len6;_key6++){args[_key6]=arguments[_key6];}_this11=_PSRoomPanel9.call.apply(_PSRoomPanel9,[this].concat(args))||this;_this11.





handleReplacePlayer=function(ev){var _room$getParent,_this11$base;
var room=_this11.props.room;
var battleRoom=(_room$getParent=room.getParent())==null?void 0:_room$getParent.getParent();
var newPlayer=(_this11$base=_this11.base)==null||(_this11$base=_this11$base.querySelector("input[name=newplayer]"))==null?void 0:_this11$base.value;
if(!(newPlayer!=null&&newPlayer.length))return battleRoom.add("|error|Enter player's name");
if(battleRoom.battle.ended)return battleRoom.add("|error|Cannot replace player, battle has already ended.");
var playerSlot=battleRoom.battle.p1.id===PS.user.userid?"p1":"p2";
battleRoom.send('/leavebattle');
battleRoom.send("/addplayer "+newPlayer+", "+playerSlot);
_this11.close();
ev.preventDefault();
};return _this11;}_inheritsLoose(ReplacePlayerPanel,_PSRoomPanel9);var _proto11=ReplacePlayerPanel.prototype;_proto11.

render=function render(){
var room=this.props.room;

return preact.h(PSPanelWrapper,{room:room,width:480},preact.h("div",{"class":"pad"},
preact.h("form",{onSubmit:this.handleReplacePlayer},
preact.h("p",null,"Replacement player's name:"),
preact.h("p",null,
preact.h("input",{name:"newplayer","class":"textbox autofocus"})
),
preact.h("p",null,
preact.h("button",{type:"submit","class":"button"},
preact.h("strong",null,"Replace")
)," ",
preact.h("button",{type:"button","data-cmd":"/close","class":"button"},"Cancel"

)
)
)
));
};return ReplacePlayerPanel;}(PSRoomPanel);ReplacePlayerPanel.id='replaceplayer';ReplacePlayerPanel.routes=['replaceplayer'];ReplacePlayerPanel.location='semimodal-popup';ReplacePlayerPanel.noURL=true;var


ChangePasswordPanel=function(_PSRoomPanel10){function ChangePasswordPanel(){var _this12;for(var _len7=arguments.length,args=new Array(_len7),_key7=0;_key7<_len7;_key7++){args[_key7]=arguments[_key7];}_this12=_PSRoomPanel10.call.apply(_PSRoomPanel10,[this].concat(args))||this;_this12.







handleChangePassword=function(ev){var _this12$base,_this12$base2,_this12$base3;
ev.preventDefault();
var oldpassword=(_this12$base=_this12.base)==null||(_this12$base=_this12$base.querySelector('input[name=oldpassword]'))==null?void 0:_this12$base.value;
var password=(_this12$base2=_this12.base)==null||(_this12$base2=_this12$base2.querySelector('input[name=password]'))==null?void 0:_this12$base2.value;
var cpassword=(_this12$base3=_this12.base)==null||(_this12$base3=_this12$base3.querySelector('input[name=cpassword]'))==null?void 0:_this12$base3.value;
if(!(oldpassword!=null&&oldpassword.length)||
!(password!=null&&password.length)||
!(cpassword!=null&&cpassword.length))return _this12.setState({errorMsg:"All fields are required"});
if(password!==cpassword)return _this12.setState({errorMsg:'Passwords do not match'});
PSLoginServer.query("changepassword",{
oldpassword:oldpassword,
password:password,
cpassword:cpassword
}).then(function(data){
if(data!=null&&data.actionerror)return _this12.setState({errorMsg:data==null?void 0:data.actionerror});
PS.alert("Your password was successfully changed!");

})["catch"](function(err){
console.error(err);
_this12.setState({errorMsg:err.message});
});

_this12.setState({errorMsg:''});
};return _this12;}_inheritsLoose(ChangePasswordPanel,_PSRoomPanel10);var _proto12=ChangePasswordPanel.prototype;_proto12.

render=function render(){var _this$state$errorMsg;
var room=this.props.room;

return preact.h(PSPanelWrapper,{room:room,width:280},preact.h("div",{"class":"pad"},
preact.h("form",{onSubmit:this.handleChangePassword},
!!((_this$state$errorMsg=this.state.errorMsg)!=null&&_this$state$errorMsg.length)&&preact.h("p",null,
preact.h("b",{"class":"message-error"}," ",this.state.errorMsg)
),
preact.h("p",null,"Change your password:"),
preact.h("p",null,
preact.h("label",{"class":"label"},"Username: ",

preact.h("input",{name:"username",value:PS.user.name,readOnly:true,autocomplete:"username","class":"textbox disabled"})
)
),
preact.h("p",null,
preact.h("label",{"class":"label"},"Old password: ",

preact.h("input",{name:"oldpassword",type:"password",autocomplete:"current-password","class":"textbox autofocus"})
)
),
preact.h("p",null,
preact.h("label",{"class":"label"},"New password: ",

preact.h("input",{name:"password",type:"password",autocomplete:"new-password","class":"textbox"})
)
),
preact.h("p",null,
preact.h("label",{"class":"label"},"New password (confirm): ",

preact.h("input",{name:"cpassword",type:"password",autocomplete:"new-password","class":"textbox"})
)
),
preact.h("p",{"class":"buttonbar"},
preact.h("button",{type:"submit","class":"button"},
preact.h("strong",null,"Change password")
)," ",
preact.h("button",{type:"button","data-cmd":"/close","class":"button"},"Cancel")
)
)
)
);
};return ChangePasswordPanel;}(PSRoomPanel);ChangePasswordPanel.id="changepassword";ChangePasswordPanel.routes=["changepassword"];ChangePasswordPanel.location="semimodal-popup";ChangePasswordPanel.noURL=true;var


RegisterPanel=function(_PSRoomPanel11){function RegisterPanel(){var _this13;for(var _len8=arguments.length,args=new Array(_len8),_key8=0;_key8<_len8;_key8++){args[_key8]=arguments[_key8];}_this13=_PSRoomPanel11.call.apply(_PSRoomPanel11,[this].concat(args))||this;_this13.








handleRegisterUser=function(ev){var _this13$base,_this13$base2,_this13$base3;
ev.preventDefault();
var captcha=(_this13$base=_this13.base)==null||(_this13$base=_this13$base.querySelector('input[name=captcha]'))==null?void 0:_this13$base.value;
var password=(_this13$base2=_this13.base)==null||(_this13$base2=_this13$base2.querySelector('input[name=password]'))==null?void 0:_this13$base2.value;
var cpassword=(_this13$base3=_this13.base)==null||(_this13$base3=_this13$base3.querySelector('input[name=cpassword]'))==null?void 0:_this13$base3.value;
if(!(captcha!=null&&captcha.length)||
!(password!=null&&password.length)||
!(cpassword!=null&&cpassword.length))return _this13.setState({errorMsg:"All fields are required"});
if(password!==cpassword)return _this13.setState({errorMsg:'Passwords do not match'});
PSLoginServer.query("register",{
captcha:captcha,
password:password,
cpassword:cpassword,
username:PS.user.name,
challstr:PS.user.challstr
}).then(function(data){var _data$curuser;
if(data!=null&&data.actionerror)_this13.setState({errorMsg:data==null?void 0:data.actionerror});
if(data!=null&&(_data$curuser=data.curuser)!=null&&_data$curuser.loggedin){
var name=data.curuser.username;
PS.user.registered={name:name,userid:toID(name)};
if(data!=null&&data.assertion)PS.user.handleAssertion(name,data==null?void 0:data.assertion);
_this13.close();
PS.alert("You have been successfully registered.");
}
})["catch"](function(err){
console.error(err);
_this13.setState({errorMsg:err.message});
});

_this13.setState({errorMsg:''});
};return _this13;}_inheritsLoose(RegisterPanel,_PSRoomPanel11);var _proto13=RegisterPanel.prototype;_proto13.

render=function render(){var _this$state$errorMsg2;
var room=this.props.room;

return preact.h(PSPanelWrapper,{room:room,width:280},preact.h("div",{"class":"pad"},
preact.h("form",{onSubmit:this.handleRegisterUser},
!!((_this$state$errorMsg2=this.state.errorMsg)!=null&&_this$state$errorMsg2.length)&&preact.h("p",null,
preact.h("b",{"class":"message-error"}," ",this.state.errorMsg)
),
preact.h("p",null,"Register your account:"),
preact.h("p",null,
preact.h("label",{"class":"label"},"Username: ",

preact.h("input",{name:"name",value:PS.user.name,readOnly:true,autocomplete:"username","class":"textbox disabled"})
)
),
preact.h("p",null,
preact.h("label",{"class":"label"},"Password: ",

preact.h("input",{name:"password",type:"password",autocomplete:"new-password","class":"textbox autofocus"})
)
),
preact.h("p",null,
preact.h("label",{"class":"label"},"Password (confirm): ",

preact.h("input",{name:"cpassword",type:"password",autocomplete:"new-password","class":"textbox"})
)
),
preact.h("p",null,
preact.h("label",{"class":"label"},preact.h("img",{
src:"https://play.pokemonshowdown.com/sprites/gen5ani/pikachu.gif",
alt:"An Electric-type mouse that is the mascot of the Pok\xE9mon franchise."}
))
),
preact.h("p",null,
preact.h("label",{"class":"label"},"What is this pokemon? ",

preact.h("input",{name:"captcha","class":"textbox"})
)
),
preact.h("p",{"class":"buttonbar"},
preact.h("button",{type:"submit","class":"button"},preact.h("strong",null,"Register"))," ",
preact.h("button",{type:"button","data-cmd":"/close","class":"button"},"Cancel")
)
)

)
);
};return RegisterPanel;}(PSRoomPanel);RegisterPanel.id="register";RegisterPanel.routes=["register"];RegisterPanel.location="semimodal-popup";RegisterPanel.noURL=true;RegisterPanel.rightPopup=true;var


BackgroundListPanel=function(_PSRoomPanel12){function BackgroundListPanel(){var _this14;for(var _len9=arguments.length,args=new Array(_len9),_key9=0;_key9<_len9;_key9++){args[_key9]=arguments[_key9];}_this14=_PSRoomPanel12.call.apply(_PSRoomPanel12,[this].concat(args))||this;_this14.















setBg=function(ev){
var curtarget=ev.currentTarget;
var bg=curtarget.value;
if(bg==='custom'){var _this14$props$room$ar;
PSBackground.set(((_this14$props$room$ar=_this14.props.room.args)==null?void 0:_this14$props$room$ar.bgUrl)||'','custom');
_this14.close();
}else{
PSBackground.set('',bg);
}
ev.preventDefault();
ev.stopImmediatePropagation();
_this14.forceUpdate();
};_this14.

































uploadBg=function(ev){var _this14$base;
_this14.setState({status:undefined});
var input=(_this14$base=_this14.base)==null?void 0:_this14$base.querySelector('input[name=bgfile]');
BackgroundListPanel.handleUploadedFiles(input==null?void 0:input.files,true);
ev.preventDefault();
ev.stopImmediatePropagation();
};return _this14;}_inheritsLoose(BackgroundListPanel,_PSRoomPanel12);BackgroundListPanel.handleDrop=function handleDrop(ev){var _ev$dataTransfer,_files$;var files=(_ev$dataTransfer=ev.dataTransfer)==null?void 0:_ev$dataTransfer.files;if(files!=null&&(_files$=files[0])!=null&&(_files$=_files$.type)!=null&&_files$.startsWith('image/')){BackgroundListPanel.handleUploadedFiles(files);return true;}};BackgroundListPanel.handleUploadedFiles=function handleUploadedFiles(files,skipConfirm){if(!(files!=null&&files[0]))return;var file=files[0];var reader=new FileReader();reader.onload=function(){var _PS$rooms$changebackg;var bgUrl=reader.result;if(bgUrl.length>4200000){PS.join('changebackground',{args:{error:"Image is too large and can't be saved. It should be under 3.5MB or so."}});return;}if(skipConfirm){PSBackground.set(bgUrl,'custom');}else{PS.join('changebackground',{args:{bgUrl:bgUrl}});}(_PS$rooms$changebackg=PS.rooms['changebackground'])==null||_PS$rooms$changebackg.update(null);};reader.onerror=function(){PS.join('changebackground',{args:{error:"Failed to load background image."}});};reader.readAsDataURL(file);};var _proto14=BackgroundListPanel.prototype;_proto14.

renderUpload=function renderUpload(){var _room$args,_room$args2;
var room=this.props.room;
if((_room$args=room.args)!=null&&_room$args.error){
return preact.h(PSPanelWrapper,{room:room,width:480},preact.h("div",{"class":"pad"},
preact.h("p",{"class":"error"},room.args.error),
preact.h("p",{"class":"buttonbar"},
preact.h("button",{"data-cmd":"/close","class":"button"},preact.h("strong",null,"Done"))
)
));
}

if((_room$args2=room.args)!=null&&_room$args2.bgUrl){
return preact.h(PSPanelWrapper,{room:room,width:480},preact.h("div",{"class":"pad"},
preact.h("p",null,
preact.h("img",{src:room.args.bgUrl,style:"display:block;margin:auto;max-width:90%;max-height:500px"})
),
preact.h("p",{"class":"buttonbar"},
preact.h("button",{onClick:this.setBg,value:"custom","class":"button"},preact.h("strong",null,"Set as background"))," ",
preact.h("button",{"data-cmd":"/close","class":"button"},"Cancel")
)
));
}

return null;
};_proto14.

render=function render(){
var room=this.props.room;
var option=function(val){return val===PSBackground.id?'option cur':'option';};
return this.renderUpload()||preact.h(PSPanelWrapper,{room:room,width:480},preact.h("div",{"class":"pad"},
preact.h("p",null,preact.h("strong",null,"Default")),
preact.h("div",{"class":"bglist"},
preact.h("button",{onClick:this.setBg,value:"","class":option('')},
preact.h("strong",{
style:"\r background: #888888;\r color: white;\r padding: 16px 18px;\r display: block;\r font-size: 12pt;\r "},






"Random")
)
),
preact.h("div",{style:"clear: left"}),
preact.h("p",null,preact.h("strong",null,"Official")),
preact.h("div",{"class":"bglist"},
preact.h("button",{onClick:this.setBg,value:"charizards","class":option('charizards')},
preact.h("span",{"class":"bg",style:"background-position: 0 -0px"}),"Charizards"

),
preact.h("button",{onClick:this.setBg,value:"horizon","class":option('horizon')},
preact.h("span",{"class":"bg",style:"background-position: 0 -90px"}),"Horizon"

),
preact.h("button",{onClick:this.setBg,value:"waterfall","class":option('waterfall')},
preact.h("span",{"class":"bg",style:"background-position: 0 -180px"}),"Waterfall"

),
preact.h("button",{onClick:this.setBg,value:"ocean","class":option('ocean')},
preact.h("span",{"class":"bg",style:"background-position: 0 -270px"}),"Ocean"

),
preact.h("button",{onClick:this.setBg,value:"shaymin","class":option('shaymin')},
preact.h("span",{"class":"bg",style:"background-position: 0 -360px"}),"Shaymin"

),
preact.h("button",{onClick:this.setBg,value:"solidblue","class":option('solidblue')},
preact.h("span",{"class":"bg",style:"background: #344b6c"}),"Solid blue"

)
),
preact.h("div",{style:"clear: left"}),
preact.h("p",null,preact.h("strong",null,"Custom")),
preact.h("p",null,"Upload:"

),
preact.h("p",null,preact.h("input",{type:"file",accept:"image/*",name:"bgfile",onChange:this.uploadBg})),
!!this.state.status&&preact.h("p",{"class":"error"},this.state.status),
preact.h("p",{"class":"buttonbar"},
preact.h("button",{"data-cmd":"/close","class":"button"},preact.h("strong",null,"Done"))
)
)
);
};return BackgroundListPanel;}(PSRoomPanel);BackgroundListPanel.id='changebackground';BackgroundListPanel.routes=['changebackground'];BackgroundListPanel.location='semimodal-popup';BackgroundListPanel.noURL=true;var


ChatFormattingPanel=function(_PSRoomPanel13){function ChatFormattingPanel(){var _this15;for(var _len10=arguments.length,args=new Array(_len10),_key10=0;_key10<_len10;_key10++){args[_key10]=arguments[_key10];}_this15=_PSRoomPanel13.call.apply(_PSRoomPanel13,[this].concat(args))||this;_this15.





handleOnChange=function(ev){
var setting="hide"+ev.currentTarget.name;
var value=ev.currentTarget.checked;
var curPref=PS.prefs.chatformatting;
curPref[setting]=value;
PS.prefs.set("chatformatting",curPref);
ev.preventDefault();
ev.stopImmediatePropagation();
};return _this15;}_inheritsLoose(ChatFormattingPanel,_PSRoomPanel13);var _proto15=ChatFormattingPanel.prototype;_proto15.

render=function render(){
var room=this.props.room;
var ctrl=PSView.isMac?'Cmd':'Ctrl';
return preact.h(PSPanelWrapper,{room:room,width:480},preact.h("div",{"class":"pad"},
preact.h("p",null,"Usable formatting:"),
preact.h("p",null,"**",preact.h("strong",null,"bold"),"** (",preact.h("kbd",null,ctrl),"+",preact.h("kbd",null,"B"),")"),
preact.h("p",null,"__",preact.h("em",null,"italics"),"__ (",preact.h("kbd",null,ctrl),"+",preact.h("kbd",null,"I"),")"),
preact.h("p",null,"``",preact.h("code",null,"code formatting"),"`` (",preact.h("kbd",null,"Ctrl"),"+",preact.h("kbd",null,"`"),")"),
preact.h("p",null,"~~",preact.h("s",null,"strikethrough"),"~~"),
preact.h("p",null,"^^",preact.h("sup",null,"superscript"),"^^"),
preact.h("p",null,"\\\\",preact.h("sub",null,"subscript"),"\\\\"),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},
preact.h("input",{
onChange:this.handleOnChange,
type:"checkbox",
name:"greentext",
checked:PS.prefs.chatformatting.hidegreentext}
)," Suppress ",preact.h("span",{"class":"greentext"},">greentext")
)
),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},
preact.h("input",{
onChange:this.handleOnChange,
type:"checkbox",
name:"me",
checked:PS.prefs.chatformatting.hideme}

)," Suppress ",preact.h("code",null,"/me")," ",preact.h("em",null,"action formatting")
)
),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},
preact.h("input",{
onChange:this.handleOnChange,
type:"checkbox",
name:"spoiler",
checked:PS.prefs.chatformatting.hidespoiler}
)," Auto-show spoilers: ",preact.h("span",{"class":"spoiler"},"these things")
)
),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},
preact.h("input",{
onChange:this.handleOnChange,
type:"checkbox",
name:"links",
checked:PS.prefs.chatformatting.hidelinks}
)," Make [[clickable links]] unclickable"
)
),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},
preact.h("input",{
onChange:this.handleOnChange,
type:"checkbox",
name:"interstice",
checked:PS.prefs.chatformatting.hideinterstice}
)," Don't warn for untrusted links"
)
),
preact.h("p",null,preact.h("button",{"data-cmd":"/close","class":"button"},"Done"))
)
);
};return ChatFormattingPanel;}(PSRoomPanel);ChatFormattingPanel.id='chatformatting';ChatFormattingPanel.routes=['chatformatting'];ChatFormattingPanel.location='semimodal-popup';ChatFormattingPanel.noURL=true;var


LeaveRoomPanel=function(_PSRoomPanel14){function LeaveRoomPanel(){return _PSRoomPanel14.apply(this,arguments)||this;}_inheritsLoose(LeaveRoomPanel,_PSRoomPanel14);var _proto16=LeaveRoomPanel.prototype;_proto16.





render=function render(){
var room=this.props.room;
var parentRoomid=room.parentRoomid;

return preact.h(PSPanelWrapper,{room:room,width:480},preact.h("div",{"class":"pad"},
preact.h("p",null,"Close ",preact.h("code",null,parentRoomid||"ERROR"),"?"),
preact.h("p",{"class":"buttonbar"},
preact.h("button",{"data-cmd":"/closeand /close "+parentRoomid,"class":"button autofocus"},
preact.h("strong",null,"Close Room")
)," ",
preact.h("button",{"data-cmd":"/close","class":"button"},"Cancel"

)
)
));
};return LeaveRoomPanel;}(PSRoomPanel);LeaveRoomPanel.id='confirmleaveroom';LeaveRoomPanel.routes=['confirmleaveroom'];LeaveRoomPanel.location='semimodal-popup';LeaveRoomPanel.noURL=true;var

BattleOptionsPanel=function(_PSRoomPanel15){function BattleOptionsPanel(){var _this16;for(var _len11=arguments.length,args=new Array(_len11),_key11=0;_key11<_len11;_key11++){args[_key11]=arguments[_key11];}_this16=_PSRoomPanel15.call.apply(_PSRoomPanel15,[this].concat(args))||this;_this16.





handleHardcoreMode=function(ev){
var mode=ev.currentTarget.checked;
var room=_this16.getBattleRoom();
if(!room)return _this16.close();

room.battle.setHardcoreMode(mode);
if(mode){
room.add("||Hardcore mode ON: Information not available in-game is now hidden.");
}else{
room.add("||Hardcore mode OFF: Information not available in-game is now shown.");
}
room.update(null);
};_this16.
handleIgnoreSpectators=function(ev){
var value=typeof ev==="object"?
ev.currentTarget.checked:
ev;
var room=_this16.getBattleRoom();
if(!room)return _this16.close();

room.battle.ignoreSpects=value;
room.add("||Spectators "+(room.battle.ignoreSpects?'':'no longer ')+"ignored.");
var chats=document.querySelectorAll('.battle-log .chat');
var displaySetting=room.battle.ignoreSpects?'none':'';for(var _i2=0;_i2<
chats.length;_i2++){var chat=chats[_i2];
var small=chat.querySelector('small');
if(!small)continue;
var text=small.innerText;
var isPlayerChat=text.includes("\u2606")||text.includes("\u2605");
if(!isPlayerChat){
chat.style.display=displaySetting;
}
}
room.battle.scene.log.updateScroll();
};_this16.
handleIgnoreOpponent=function(ev){
var value=typeof ev==="object"?
ev.currentTarget.checked:
ev;
var room=_this16.getBattleRoom();
if(!room)return _this16.close();

room.battle.ignoreOpponent=value;
room.battle.resetToCurrentTurn();
};_this16.
handleIgnoreNicks=function(ev){
var value=typeof ev==="object"?
ev.currentTarget.checked:
ev;
var room=_this16.getBattleRoom();
if(!room)return _this16.close();

room.battle.ignoreNicks=value;
room.battle.resetToCurrentTurn();
};_this16.
handleAllSettings=function(ev){
var setting=ev.currentTarget.name;
var value=ev.currentTarget.checked;
var room=_this16.getBattleRoom();

switch(setting){
case'autotimer':{
PS.prefs.set('autotimer',value);
if(value){
room==null||room.send('/timer on');
}
break;
}
case'ignoreopp':{
PS.prefs.set('ignoreopp',value);
_this16.handleIgnoreOpponent(value);
break;
}
case'ignorespects':{
PS.prefs.set('ignorespects',value);
_this16.handleIgnoreSpectators(value);
break;
}
case'ignorenicks':{
PS.prefs.set('ignorenicks',value);
_this16.handleIgnoreNicks(value);
break;
}
case'rightpanel':{
PS.prefs.set('rightpanelbattles',value);
break;
}
case'disallowspectators':{
PS.prefs.set('disallowspectators',value);
PS.mainmenu.disallowSpectators=value;
break;
}
}
};return _this16;}_inheritsLoose(BattleOptionsPanel,_PSRoomPanel15);var _proto17=BattleOptionsPanel.prototype;_proto17.
getBattleRoom=function getBattleRoom(){
var battleRoom=this.props.room.getParent();
return battleRoom!=null&&battleRoom.battle?battleRoom:null;
};_proto17.

render=function render(){var _battleRoom$battle;
var room=this.props.room;
var battleRoom=this.getBattleRoom();
var isPlayer=!!(battleRoom!=null&&battleRoom.battle.myPokemon);
var canOfferTie=battleRoom&&(battleRoom.battle.turn>=100&&isPlayer||PS.user.group==='~');
return preact.h(PSPanelWrapper,{room:room,width:380},preact.h("div",{"class":"pad"},
battleRoom&&preact.h(preact.Fragment,null,
preact.h("p",null,preact.h("strong",null,"In this battle")),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},
preact.h("input",{
checked:battleRoom.battle.hardcoreMode,
type:"checkbox",onChange:this.handleHardcoreMode}
)," Hardcore mode (hide info not shown in-game)"
)
),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},
preact.h("input",{
checked:battleRoom.battle.ignoreSpects,
type:"checkbox",onChange:this.handleIgnoreSpectators}
)," Ignore spectators"
)
),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},
preact.h("input",{
checked:battleRoom.battle.ignoreOpponent,
type:"checkbox",onChange:this.handleIgnoreOpponent}
)," Ignore opponent"
)
),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},
preact.h("input",{
checked:(_battleRoom$battle=battleRoom.battle)==null?void 0:_battleRoom$battle.ignoreNicks,
type:"checkbox",onChange:this.handleIgnoreNicks}
)," Ignore nicknames"
)
)
),
preact.h("p",null,preact.h("strong",null,"All battles")),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},
preact.h("input",{
name:"disallowspectators",checked:PS.prefs.disallowspectators||false,
type:"checkbox",onChange:this.handleAllSettings}
)," ",preact.h("abbr",{title:"You can still invite spectators by giving them the URL or using the /invite command"},"Invite only (hide from Battles list)")
)
),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},
preact.h("input",{
name:"ignorenicks",checked:PS.prefs.ignorenicks||false,
type:"checkbox",onChange:this.handleAllSettings}
)," Ignore Pok\xE9mon nicknames"
)
),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},
preact.h("input",{
name:"ignorespects",checked:PS.prefs.ignorespects||false,
type:"checkbox",onChange:this.handleAllSettings}
)," Ignore spectators"
)
),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},
preact.h("input",{
name:"ignoreopp",checked:PS.prefs.ignoreopp||false,
type:"checkbox",onChange:this.handleAllSettings}
)," Ignore opponent"
)
),
preact.h("p",null,
preact.h("label",{"class":"checkbox"},
preact.h("input",{
name:"autotimer",checked:PS.prefs.autotimer||false,
type:"checkbox",onChange:this.handleAllSettings}
)," Automatically start timer"
)
),
!PS.prefs.onepanel&&document.body.offsetWidth>=800&&preact.h("p",null,
preact.h("label",{"class":"checkbox"},
preact.h("input",{
name:"rightpanel",checked:PS.prefs.rightpanelbattles||false,
type:"checkbox",onChange:this.handleAllSettings}
)," Open new battles in the right-side panel"
)
),
preact.h("p",{"class":"buttonbar"},
preact.h("button",{"data-cmd":"/close","class":"button"},"Done")," ",
battleRoom&&preact.h("button",{"data-cmd":"/closeand /inopener /offertie","class":"button",disabled:!canOfferTie},"Offer Tie"

)
)
)
);
};return BattleOptionsPanel;}(PSRoomPanel);BattleOptionsPanel.id='battleoptions';BattleOptionsPanel.routes=['battleoptions'];BattleOptionsPanel.location='semimodal-popup';BattleOptionsPanel.noURL=true;var


PopupRoom=function(_PSRoom2){function PopupRoom(){var _this17$args;var _this17;for(var _len12=arguments.length,args=new Array(_len12),_key12=0;_key12<_len12;_key12++){args[_key12]=arguments[_key12];}_this17=_PSRoom2.call.apply(_PSRoom2,[this].concat(args))||this;_this17.
returnValue=(_this17$args=_this17.args)==null?void 0:_this17$args.cancelValue;return _this17;}_inheritsLoose(PopupRoom,_PSRoom2);var _proto18=PopupRoom.prototype;_proto18.
destroy=function destroy(){var _this$args;
(_this$args=this.args)==null||_this$args.callback==null||_this$args.callback(this.returnValue);
_PSRoom2.prototype.destroy.call(this);
};return PopupRoom;}(PSRoom);var


PopupPanel=function(_PSRoomPanel16){function PopupPanel(){var _this18;for(var _len13=arguments.length,args=new Array(_len13),_key13=0;_key13<_len13;_key13++){args[_key13]=arguments[_key13];}_this18=_PSRoomPanel16.call.apply(_PSRoomPanel16,[this].concat(args))||this;_this18.






handleSubmit=function(ev){var _room$args3;
ev.preventDefault();
ev.stopImmediatePropagation();
var room=_this18.props.room;
room.returnValue=(_room$args3=room.args)==null?void 0:_room$args3.okValue;
var textbox=_this18.base.querySelector('input[name=value]');
if(textbox){
room.returnValue=textbox.value;
}
_this18.close();
};return _this18;}_inheritsLoose(PopupPanel,_PSRoomPanel16);var _proto19=PopupPanel.prototype;_proto19.
componentDidMount=function componentDidMount(){var _this$props$room$args2;
_PSRoomPanel16.prototype.componentDidMount.call(this);
var textbox=this.base.querySelector('input[name=value]');
if(!textbox)return;
textbox.value=((_this$props$room$args2=this.props.room.args)==null?void 0:_this$props$room$args2.value)||'';
textbox.select();
};_proto19.
parseMessage=function parseMessage(message){
if(message.startsWith('|html|')){
return BattleLog.sanitizeHTML(message.slice(6));
}
return BattleLog.parseMessage(message);
};_proto19.

render=function render(){var _room$args4,_room$args5,_room$args6,_room$args7,_room$args8,_room$args9,_room$args10;
var room=this.props.room;
var okButton=((_room$args4=room.args)==null?void 0:_room$args4.okButton)||'OK';
var cancelButton=(_room$args5=room.args)==null?void 0:_room$args5.cancelButton;
var otherButtons=(_room$args6=room.args)==null?void 0:_room$args6.otherButtons;
var value=(_room$args7=room.args)==null?void 0:_room$args7.value;
var type=((_room$args8=room.args)==null?void 0:_room$args8.type)||(typeof value==='string'?'text':null);
var message=(_room$args9=room.args)==null?void 0:_room$args9.message;
return preact.h(PSPanelWrapper,{room:room,width:((_room$args10=room.args)==null?void 0:_room$args10.width)||480},
preact.h("form",{"class":"pad",onSubmit:this.handleSubmit},
message&&preact.h("p",{
style:"white-space:pre-wrap;word-wrap:break-word",
dangerouslySetInnerHTML:{__html:this.parseMessage(message||'')}}
),
!!type&&preact.h("p",null,preact.h("input",{name:"value",type:type,"class":"textbox autofocus",style:"width:100%;box-sizing:border-box"})),
preact.h("p",{"class":"buttonbar"},
preact.h("button",{"class":"button"+(!type?' autofocus':''),type:"submit",style:"min-width:50px"},
preact.h("strong",null,okButton)
)," ",
otherButtons," ",
!!cancelButton&&preact.h("button",{"class":"button","data-cmd":"/close",type:"button"},
cancelButton
)
)
)
);
};return PopupPanel;}(PSRoomPanel);PopupPanel.id='popup';PopupPanel.routes=['popup-*'];PopupPanel.location='semimodal-popup';PopupPanel.noURL=true;PopupPanel.Model=PopupRoom;var


RoomTabListPanel=function(_PSRoomPanel17){function RoomTabListPanel(){var _this19;for(var _len14=arguments.length,args=new Array(_len14),_key14=0;_key14<_len14;_key14++){args[_key14]=arguments[_key14];}_this19=_PSRoomPanel17.call.apply(_PSRoomPanel17,[this].concat(args))||this;_this19.





startingLayout=PS.prefs.onepanel;_this19.
handleLayoutChange=function(ev){
var checkbox=ev.currentTarget;
PS.prefs.onepanel=checkbox.checked?'vertical':_this19.startingLayout;
PS.update();
};return _this19;}_inheritsLoose(RoomTabListPanel,_PSRoomPanel17);var _proto20=RoomTabListPanel.prototype;_proto20.
render=function render(){
var verticalTabs=PS.prefs.onepanel==='vertical';
return preact.h(PSPanelWrapper,{room:this.props.room},preact.h("div",{"class":"tablist"},
preact.h("ul",null,
PS.leftRoomList.map(function(roomid){return PSHeader.renderRoomTab(roomid,true);})
),
preact.h("ul",null,
PS.rightRoomList.map(function(roomid){return PSHeader.renderRoomTab(roomid,true);})
),
preact.h("div",{"class":"pad"},preact.h("label",{"class":"checkbox"},preact.h("input",{
type:"checkbox",checked:verticalTabs,onChange:this.handleLayoutChange}
)," Try vertical tabs"))
));
};return RoomTabListPanel;}(PSRoomPanel);RoomTabListPanel.id='roomtablist';RoomTabListPanel.routes=['roomtablist'];RoomTabListPanel.location='semimodal-popup';RoomTabListPanel.noURL=true;var

BattleTimerPanel=function(_PSRoomPanel18){function BattleTimerPanel(){return _PSRoomPanel18.apply(this,arguments)||this;}_inheritsLoose(BattleTimerPanel,_PSRoomPanel18);var _proto21=BattleTimerPanel.prototype;_proto21.





render=function render(){
var room=this.props.room.getParent();
return preact.h(PSPanelWrapper,{room:this.props.room},preact.h("div",{"class":"pad"},
room.battle.kickingInactive?
preact.h("button",{"class":"button","data-cmd":"/closeand /inopener /timer stop"},"Stop Timer"):

preact.h("button",{"class":"button","data-cmd":"/closeand /inopener /timer start"},"Start Timer")

)
);
};return BattleTimerPanel;}(PSRoomPanel);BattleTimerPanel.id='battletimer';BattleTimerPanel.routes=['battletimer'];BattleTimerPanel.location='semimodal-popup';BattleTimerPanel.noURL=true;var


RulesPanel=function(_PSRoomPanel19){function RulesPanel(){return _PSRoomPanel19.apply(this,arguments)||this;}_inheritsLoose(RulesPanel,_PSRoomPanel19);var _proto22=RulesPanel.prototype;_proto22.







componentDidMount=function componentDidMount(){var _this20=this;
_PSRoomPanel19.prototype.componentDidMount.call(this);
var args=this.props.room.args;
var isWarn=(args==null?void 0:args.type)==='warn';
if(isWarn&&args){
var timerRef=setInterval(function(){
var timeLeft=_this20.state.timeLeft||5;
var canClose=timeLeft===1;
_this20.setState({canClose:canClose,timeLeft:timeLeft-1});
if(canClose){
clearInterval(_this20.state.timerRef);
_this20.setState({timerRef:null});
}
},1000);
if(!this.state.timerRef)this.setState({timerRef:timerRef});
}
};_proto22.

render=function render(){var _room$args11,_room$args12,_room$args13;
var room=this.props.room;
var type=(_room$args11=room.args)==null?void 0:_room$args11.type;
var isWarn=type==='warn';
var message=((_room$args12=room.args)==null?void 0:_room$args12.message)||'';
return preact.h(PSPanelWrapper,{room:room,width:((_room$args13=room.args)==null?void 0:_room$args13.width)||780},
preact.h("div",{"class":"pad"},

isWarn&&
preact.h("p",null,preact.h("strong",{style:"color:red"},BattleLog.escapeHTML(message)||'You have been warned for breaking the rules.'
)),

preact.h("h2",null,"Pok\xE9mon Showdown Rules"),
preact.h("p",null,preact.h("b",null,"1.")," Be nice to people. Respect people. Don't be rude or mean to people."),
preact.h("p",null,preact.h("b",null,"2.")," ",' ',"Follow US laws (PS is based in the US). No porn (minors use PS), don't distribute pirated material, ",
' ',"and don't slander others."
),
preact.h("p",null,preact.h("b",null,"3.")," ",' ',"\xA0No sex. Don't discuss anything sexually explicit, not even in private messages, ",
' ',"not even if you're both adults."
),
preact.h("p",null,preact.h("b",null,"4.")," ",' ',"\xA0No cheating. Don't exploit bugs to gain an unfair advantage. ",
' ',"Don't game the system (by intentionally losing against yourself or a friend in a ladder match, by timerstalling, etc). ",
' ',"Don't impersonate staff if you're not."
),
preact.h("p",null,preact.h("b",null,"5.")," ",' ',"Moderators have discretion to punish any behaviour they deem inappropriate, whether or not it's on this list. ",
' ',"If you disagree with a moderator ruling, appeal to an administrator (a user with ~ next to their name) or ",
' ',
preact.h("a",{href:"https://pokemonshowdown.com/appeal"},"Discipline Appeals"),"."),
preact.h("p",null,"(Note: The First Amendment does not apply to PS, since PS is not a government organization.)"),
preact.h("p",null,preact.h("b",null,"Chat")),
preact.h("p",null,preact.h("b",null,"1.")," ",' ',"Do not spam, flame, or troll. This includes advertising, raiding, ",
' ',"asking questions with one-word answers in the lobby, ",
' ',"and flooding the chat such as by copy/pasting logs in the lobby."
),
preact.h("p",null,preact.h("b",null,"2.")," ",' ',"Don't call unnecessary attention to yourself. Don't be obnoxious. ALL CAPS and ",
preact.h("i",null,"formatting")," ",' ',"are acceptable to emphasize things, but should be used sparingly, not all the time."
),
preact.h("p",null,preact.h("b",null,"3.")," ",' ',"No minimodding: don't mod if it's not your job. Don't tell people they'll be muted, ",
' ',"don't ask for people to be muted, ",
' ',"and don't talk about whether or not people should be muted ('inb4 mute\\, etc). ",
' ',"This applies to bans and other punishments, too."
),
preact.h("p",null,preact.h("b",null,"4.")," ",' ',"We reserve the right to tell you to stop discussing moderator decisions if you become unreasonable or belligerent"
),
preact.h("p",null,preact.h("b",null,"5.")," English only, unless specified otherwise."),
preact.h("p",null,"(Note: You can opt out of chat rules in private chat rooms and battle rooms, ",' ',"but only if all ROs or players agree to it.)"
),

!isWarn&&preact.h(preact.Fragment,null,
preact.h("p",null,preact.h("b",null,"Usernames")),
preact.h("p",null,"Your username can be chosen and changed at any time. Keep in mind:"),
preact.h("p",null,preact.h("b",null,"1.")," Usernames may not impersonate a recognized user (a user with %, @, #, or ~ next to their name) ",' ',"or a famous person/organization that uses PS or is associated with Pok\xE9mon."
),
preact.h("p",null,preact.h("b",null,"2.")," Usernames may not be derogatory or insulting in nature, to an individual or group ",' ',"(insulting yourself is okay as long as it's not too serious)."
),
preact.h("p",null,preact.h("b",null,"3.")," Usernames may not directly reference sexual activity, or be excessively disgusting."),
preact.h("p",null,"This policy is less restrictive than that of many places, so you might see some \"borderline\" nicknames ",' ',"that might not be accepted elsewhere. You might consider it unfair that they are allowed to keep their ",
' ',"nickname. The fact remains that their nickname follows the above rules, and ",
' ',"if you were asked to choose a new name, yours does not."
)
),

preact.h("p",{"class":"buttonbar"},preact.h("button",{
name:"close",
"data-cmd":"/close","class":"button autofocus",
disabled:!this.state.canClose},
" Close ",this.state.timerRef&&preact.h(preact.Fragment,null,"(",this.state.timeLeft," sec)")))
)
);
};return RulesPanel;}(PSRoomPanel);RulesPanel.id='rules';RulesPanel.routes=['rules-*'];RulesPanel.location='modal-popup';RulesPanel.noURL=true;RulesPanel.Model=PopupRoom;


PS.addRoomType(
UserPanel,
UserOptionsPanel,
UserListPanel,
VolumePanel,
OptionsPanel,
LoginPanel,
AvatarsPanel,
ChangePasswordPanel,
RegisterPanel,
BattleForfeitPanel,
ReplacePlayerPanel,
BackgroundListPanel,
LeaveRoomPanel,
ChatFormattingPanel,
PopupPanel,
RoomTabListPanel,
BattleOptionsPanel,
BattleTimerPanel,
RulesPanel
);
//# sourceMappingURL=panel-popups.js.map