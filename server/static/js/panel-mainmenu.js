"use strict";function _inheritsLoose(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,_setPrototypeOf(t,o);}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t;},_setPrototypeOf(t,e);}/**
 * Main menu panel
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license AGPLv3
 */var



















MainMenuRoom=function(_PSRoom){
























function MainMenuRoom(options){var _this;
_this=_PSRoom.call(this,options)||this;_this.classType='mainmenu';_this.userdetailsCache={};_this.roomsCache={};_this.searchCountdown=null;_this.searchSent=false;_this.search={searching:[],games:null};_this.disallowSpectators=PS.prefs.disallowspectators;_this.lastChallenged=null;_this.















startSearch=function(format,team){
PS.requestNotifications();
if(_this.searchCountdown){
PS.alert("Wait for this countdown to finish first...");
return;
}
_this.searchCountdown={
format:format,
packedTeam:(team==null?void 0:team.packedTeam)||'',
countdown:3,
timer:setInterval(_this.doSearchCountdown,1000)
};
_this.update(null);
};_this.
cancelSearch=function(){var _this$search$searchin;
if(_this.searchCountdown){
clearTimeout(_this.searchCountdown.timer);
_this.searchCountdown=null;
_this.update(null);
return true;
}
if(_this.searchSent||(_this$search$searchin=_this.search.searching)!=null&&_this$search$searchin.length){
_this.searchSent=false;
PS.send("/cancelsearch");
_this.update(null);
return true;
}
return false;
};_this.
doSearchCountdown=function(){
if(!_this.searchCountdown)return;

_this.searchCountdown.countdown--;
if(_this.searchCountdown.countdown<=0){
_this.doSearch(_this.searchCountdown);
clearTimeout(_this.searchCountdown.timer);
_this.searchCountdown=null;
}
_this.update(null);
};_this.
doSearch=function(search){
_this.searchSent=true;
var privacy=_this.adjustPrivacy();
PS.send("/utm "+search.packedTeam);
PS.send(privacy+"/search "+search.format);
};if(_this.backlog){PS.rooms['']=_this;PS.mainmenu=_this;for(var _i2=0,_this$backlog2=_this.backlog;_i2<_this$backlog2.length;_i2++){var args=_this$backlog2[_i2];_this.receiveLine(args);}_this.backlog=null;}return _this;}_inheritsLoose(MainMenuRoom,_PSRoom);var _proto=MainMenuRoom.prototype;_proto.adjustPrivacy=function adjustPrivacy(){PS.prefs.set('disallowspectators',this.disallowSpectators);if(this.disallowSpectators)return'/noreply /hidenext \n';return'';};_proto.
receiveLine=function receiveLine(args){
var cmd=args[0];
switch(cmd){
case'challstr':{
var challstr=args[1];
PS.user.challstr=challstr;
PSLoginServer.query(
'upkeep',{challstr:challstr}
).then(function(res){
if(!(res!=null&&res.username)){
PS.user.initializing=false;
return;
}

res.username=res.username.replace(/[|,;]+/g,'');
if(res.loggedin){
PS.user.registered={name:res.username,userid:toID(res.username)};
}
PS.user.handleAssertion(res.username,res.assertion);
});
return;
}case'updateuser':{
var fullName=args[1],namedCode=args[2],avatar=args[3];
var named=namedCode==='1';
if(named)PS.user.initializing=false;
PS.user.setName(fullName,named,avatar);
PS.teams.loadRemoteTeams();
return;
}case'updatechallenges':{
var challengesBuf=args[1];
this.receiveChallenges(challengesBuf);
return;
}case'updatesearch':{
var searchBuf=args[1];
this.receiveSearch(searchBuf);
return;
}case'queryresponse':{
var queryId=args[1],responseJSON=args[2];
this.handleQueryResponse(queryId,JSON.parse(responseJSON));
return;
}case'pm':{var _sideRoom$log;
var user1=args[1],user2=args[2],message=args[3];
this.handlePM(user1,user2,message);
var sideRoom=PS.rightPanel;
if((sideRoom==null?void 0:sideRoom.type)==="chat"&&PS.prefs.inchatpm)sideRoom==null||(_sideRoom$log=sideRoom.log)==null||_sideRoom$log.add(args);
return;
}case'formats':{
this.parseFormats(args);
return;
}case'popup':{
var _message=args[1];
PS.alert(_message.replace(/\|\|/g,'\n'));
return;
}
}
var lobby=PS.rooms['lobby'];
if(lobby)lobby.receiveLine(args);
};_proto.
receiveChallenges=function receiveChallenges(dataBuf){
var json;
try{
json=JSON.parse(dataBuf);
}catch(_unused){}
for(var userid in json.challengesFrom){
PS.getPMRoom(toID(userid));
}
if(json.challengeTo){
PS.getPMRoom(toID(json.challengeTo.to));
}
for(var roomid in PS.rooms){var _json$challengeTo,_json$challengeTo2;
var room=PS.rooms[roomid];
if(!room.pmTarget)continue;
var targetUserid=toID(room.pmTarget);
if(!room.challenged&&!(targetUserid in json.challengesFrom)&&
!room.challenging&&((_json$challengeTo=json.challengeTo)==null?void 0:_json$challengeTo.to)!==targetUserid){
continue;
}
room.challenged=room.parseChallenge(json.challengesFrom[targetUserid]);
room.challenging=((_json$challengeTo2=json.challengeTo)==null?void 0:_json$challengeTo2.to)===targetUserid?room.parseChallenge(json.challengeTo.format):null;
room.update(null);
}
};_proto.
receiveSearch=function receiveSearch(dataBuf){
var json;
this.searchSent=false;
try{
json=JSON.parse(dataBuf);
}catch(_unused2){}
this.search=json;
this.update(null);
};_proto.
parseFormats=function parseFormats(formatsList){
var isSection=false;
var section='';

var column=0;

window.NonBattleGames={rps:'Rock Paper Scissors'};
for(var i=3;i<=9;i+=2){
window.NonBattleGames["bestof"+i]="Best-of-"+i;
}
window.BattleFormats={};
for(var j=1;j<formatsList.length;j++){
var entry=formatsList[j];
if(isSection){
section=entry;
isSection=false;
}else if(entry===',LL'){
PS.teams.usesLocalLadder=true;
}else if(entry===''||entry.startsWith(',')&&!isNaN(Number(entry.slice(1)))){
isSection=true;

if(entry){
column=parseInt(entry.slice(1),10)||0;
}
}else{var _BattleFormats$id;
var name=entry;
var searchShow=true;
var challengeShow=true;
var tournamentShow=true;
var team=null;
var teambuilderLevel=null;
var lastCommaIndex=name.lastIndexOf(',');
var code=lastCommaIndex>=0?parseInt(name.substr(lastCommaIndex+1),16):NaN;
if(!isNaN(code)){
name=name.substr(0,lastCommaIndex);
if(code&1)team='preset';
if(!(code&2))searchShow=false;
if(!(code&4))challengeShow=false;
if(!(code&8))tournamentShow=false;
if(code&16)teambuilderLevel=50;
}else{

if(name.substr(name.length-2)===',#'){
team='preset';
name=name.substr(0,name.length-2);
}
if(name.substr(name.length-2)===',,'){
challengeShow=false;
name=name.substr(0,name.length-2);
}else if(name.substr(name.length-1)===','){
searchShow=false;
name=name.substr(0,name.length-1);
}
}
var id=toID(name);
var isTeambuilderFormat=!team&&!name.endsWith('Custom Game');
var teambuilderFormat='';
var teambuilderFormatName='';
if(isTeambuilderFormat){
teambuilderFormatName=name;
if(!id.startsWith('gen')){
teambuilderFormatName='[Gen 6] '+name;
}
var parenPos=teambuilderFormatName.indexOf('(');
if(parenPos>0&&name.endsWith(')')){

teambuilderFormatName=teambuilderFormatName.slice(0,parenPos).trim();
}
if(teambuilderFormatName!==name){
teambuilderFormat=toID(teambuilderFormatName);
if(BattleFormats[teambuilderFormat]){
BattleFormats[teambuilderFormat].isTeambuilderFormat=true;
}else{
BattleFormats[teambuilderFormat]={
id:teambuilderFormat,
name:teambuilderFormatName,
team:team,
section:section,
column:column,
rated:false,
isTeambuilderFormat:true,
effectType:'Format'
};
}
isTeambuilderFormat=false;
}
}
if((_BattleFormats$id=BattleFormats[id])!=null&&_BattleFormats$id.isTeambuilderFormat){
isTeambuilderFormat=true;
}

if(BattleFormats[id])delete BattleFormats[id];
BattleFormats[id]={
id:id,
name:name,
team:team,
section:section,
column:column,
searchShow:searchShow,
challengeShow:challengeShow,
tournamentShow:tournamentShow,
rated:searchShow&&id.substr(4,7)!=='unrated',
teambuilderLevel:teambuilderLevel,
teambuilderFormat:teambuilderFormat,
isTeambuilderFormat:isTeambuilderFormat,
effectType:'Format'
};
}
}


var multivariantFormats={};
for(var _id in BattleFormats){
var _teambuilderFormat=BattleFormats[BattleFormats[_id].teambuilderFormat];
if(!_teambuilderFormat||multivariantFormats[_teambuilderFormat.id])continue;
if(!_teambuilderFormat.searchShow&&!_teambuilderFormat.challengeShow&&!_teambuilderFormat.tournamentShow){

if(_teambuilderFormat.battleFormat){
multivariantFormats[_teambuilderFormat.id]=1;
_teambuilderFormat.battleFormat='';
}else{
_teambuilderFormat.battleFormat=_id;
}
}
}
PS.teams.update('format');
};_proto.
handlePM=function handlePM(user1,user2,message){
var userid1=toID(user1);
var userid2=toID(user2);
var pmTarget=PS.user.userid===userid1?user2:user1;
var pmTargetid=PS.user.userid===userid1?userid2:userid1;
var roomid="dm-"+pmTargetid;
if(pmTargetid===PS.user.userid)roomid='dm-';
var room=PS.rooms[roomid];
if(!room){
PS.addRoom({
id:roomid,
args:{pmTarget:pmTarget},
autofocus:false
});
room=PS.rooms[roomid];
}else{
room.updateTarget(pmTarget);
}
if(message)room.receiveLine(["c",user1,message]);
PS.update();
};_proto.
handleQueryResponse=function handleQueryResponse(id,response){var _PS$rooms,_PS$rooms2,_PS$rooms3;
switch(id){
case'userdetails':
var userid=response.userid;
var userdetails=this.userdetailsCache[userid];
if(!userdetails){
this.userdetailsCache[userid]=response;
}else{
Object.assign(userdetails,response);
}
(_PS$rooms=PS.rooms["user-"+userid])==null||_PS$rooms.update(null);
(_PS$rooms2=PS.rooms["viewuser-"+userid])==null||_PS$rooms2.update(null);
(_PS$rooms3=PS.rooms["users"])==null||_PS$rooms3.update(null);
break;
case'rooms':
if(response.pspl){for(var _i4=0,_response$pspl2=
response.pspl;_i4<_response$pspl2.length;_i4++){var roomInfo=_response$pspl2[_i4];roomInfo.spotlight="Spotlight";}
response.chat=[].concat(response.pspl,response.chat);
response.pspl=null;
}
if(response.official){for(var _i6=0,_response$official2=
response.official;_i6<_response$official2.length;_i6++){var _roomInfo=_response$official2[_i6];_roomInfo.section="Official";}
response.chat=[].concat(response.official,response.chat);
response.official=null;
}
this.roomsCache=response;
var roomsRoom=PS.rooms["rooms"];
if(roomsRoom)roomsRoom.update(null);
break;
case'roomlist':
var battlesRoom=PS.rooms["battles"];
if(battlesRoom){
var battleTable=response.rooms;
var battles=[];
for(var battleid in battleTable){
battleTable[battleid].id=battleid;
battles.push(battleTable[battleid]);
}
battlesRoom.battles=battles;
battlesRoom.update(null);
}
break;
case'laddertop':for(var _i8=0,_Object$entries2=
Object.entries(PS.rooms);_i8<_Object$entries2.length;_i8++){var _ref=_Object$entries2[_i8];var roomid=_ref[0];var ladderRoom=_ref[1];
if(roomid.startsWith('ladder-')){
ladderRoom.update(response);
}
}
break;
case'teamupload':
if(PS.teams.uploading){var _PS$rooms4,_PS$rooms$teambuilder;
var team=PS.teams.uploading;
team.uploaded={
teamid:response.teamid,
notLoaded:false,
"private":response["private"]
};
(_PS$rooms4=PS.rooms["team-"+team.key])==null||_PS$rooms4.update(null);
(_PS$rooms$teambuilder=PS.rooms.teambuilder)==null||_PS$rooms$teambuilder.update(null);
PS.teams.uploading=null;
}
break;
case'teamupdate':for(var _i10=0,_PS$teams$list2=
PS.teams.list;_i10<_PS$teams$list2.length;_i10++){var _team=_PS$teams$list2[_i10];
if(_team.teamid===response.teamid){var _PS$rooms5,_PS$rooms$teambuilder2;
_team.uploaded={
teamid:response.teamid,
notLoaded:false,
"private":response["private"]
};
(_PS$rooms5=PS.rooms["team-"+_team.key])==null||_PS$rooms5.update(null);
(_PS$rooms$teambuilder2=PS.rooms.teambuilder)==null||_PS$rooms$teambuilder2.update(null);
PS.teams.uploading=null;
break;
}
}
break;
}
};return MainMenuRoom;}(PSRoom);var


NewsPanel=function(_PSRoomPanel){function NewsPanel(){var _this2;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this2=_PSRoomPanel.call.apply(_PSRoomPanel,[this].concat(args))||this;_this2.




change=function(ev){
var target=ev.currentTarget;
if(target.value==='1'){
document.cookie="preactalpha=1; expires=Thu, 1 Oct 2025 12:00:00 UTC; path=/";
}else{
document.cookie="preactalpha=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
if(target.value==='leave'){
document.location.href="/";
}
};return _this2;}_inheritsLoose(NewsPanel,_PSRoomPanel);var _proto2=NewsPanel.prototype;_proto2.
render=function render(){
var cookieSet=document.cookie.includes('preactalpha=1');
return preact.h(PSPanelWrapper,{room:this.props.room,fullSize:true,scrollable:true},
preact.h("div",{"class":"construction"},"This is the client rewrite beta test.",

preact.h("form",null,
preact.h("label",{"class":"checkbox"},
preact.h("input",{type:"radio",name:"preactalpha",value:"1",onChange:this.change,checked:cookieSet})," ","Use Rewrite always"

),
preact.h("label",{"class":"checkbox"},
preact.h("input",{type:"radio",name:"preactalpha",value:"0",onChange:this.change,checked:!cookieSet})," ","Use Rewrite with URL"

),
preact.h("label",{"class":"checkbox"},
preact.h("input",{type:"radio",name:"preactalpha",value:"leave",onChange:this.change})," ","Back to the old client"

)
),"Provide feedback in ",
preact.h("a",{href:"development",style:"color:black"},"the Dev chatroom"),"."
),
preact.h("div",{"class":"readable-bg",dangerouslySetInnerHTML:{__html:PS.newsHTML}})
);
};return NewsPanel;}(PSRoomPanel);NewsPanel.id='news';NewsPanel.routes=['news'];NewsPanel.title='News';NewsPanel.location='mini-window';var


MainMenuPanel=function(_PSRoomPanel2){function MainMenuPanel(){var _this3;for(var _len2=arguments.length,args=new Array(_len2),_key2=0;_key2<_len2;_key2++){args[_key2]=arguments[_key2];}_this3=_PSRoomPanel2.call.apply(_PSRoomPanel2,[this].concat(args))||this;_this3.







submitSearch=function(ev,format,team){
if(!PS.user.named){
PS.join('login',{
parentElem:_this3.base.querySelector('.big.button')
});
return;
}
PS.mainmenu.startSearch(format,team);
};_this3.
handleDragStart=function(e){var _PS$rightPanel;
var room=PS.getRoom(e.currentTarget);
if(!room)return;
var foreground=PS.leftPanel.id===room.id||((_PS$rightPanel=PS.rightPanel)==null?void 0:_PS$rightPanel.id)===room.id;
PS.dragging={type:'room',roomid:room.id,foreground:foreground};
};_this3.
handleDragEnter=function(e){var _PS$dragging,_PS$rooms$draggingRoo;

e.preventDefault();
if(((_PS$dragging=PS.dragging)==null?void 0:_PS$dragging.type)!=='room')return;
var draggingRoom=PS.dragging.roomid;
if(draggingRoom===null)return;

var draggedOverRoom=PS.getRoom(e.target);
if(draggingRoom===(draggedOverRoom==null?void 0:draggedOverRoom.id))return;

var index=PS.miniRoomList.indexOf(draggedOverRoom==null?void 0:draggedOverRoom.id);
if(index>=0){
PS.dragOnto(PS.rooms[draggingRoom],'mini-window',index);
}else if(((_PS$rooms$draggingRoo=PS.rooms[draggingRoom])==null?void 0:_PS$rooms$draggingRoo.location)!=='mini-window'){
PS.dragOnto(PS.rooms[draggingRoom],'mini-window',0);
}




};_this3.





handleClickMinimize=function(e){var _e$target,_e$target2;
if((_e$target=e.target)!=null&&_e$target.getAttribute('data-cmd')){
return;
}
if((_e$target2=e.target)!=null&&(_e$target2=_e$target2.parentNode)!=null&&_e$target2.getAttribute('data-cmd')){
return;
}
var room=PS.getRoom(e.currentTarget);
if(room){
room.minimized=!room.minimized;
_this3.forceUpdate();
}
};return _this3;}_inheritsLoose(MainMenuPanel,_PSRoomPanel2);var _proto3=MainMenuPanel.prototype;_proto3.focus=function focus(){var _this$base;(_this$base=this.base)==null||(_this$base=_this$base.querySelector('.formatselect'))==null||_this$base.focus();};_proto3.renderMiniRoom=function renderMiniRoom(room){var RoomType=PS.roomTypes[room.type];var Panel=RoomType||PSRoomPanel;return preact.h(Panel,{key:room.id,room:room});};_proto3.
renderMiniRooms=function renderMiniRooms(){var _this4=this;
return PS.miniRoomList.map(function(roomid){
var room=PS.rooms[roomid];
var notifying=room.notifications.length?' notifying':room.isSubtleNotifying?' subtle-notifying':'';
return preact.h("div",{
"class":"mini-window"+(room.minimized?' collapsed':'')+(room===PS.room?' focused':''),
key:roomid,"data-roomid":roomid},

preact.h("h3",{
"class":"mini-window-header"+notifying,draggable:true,onDragStart:_this4.handleDragStart,onClick:_this4.handleClickMinimize},

preact.h("button",{"class":"closebutton","data-cmd":"/close","aria-label":"Close",tabIndex:-1},
preact.h("i",{"class":"fa fa-times-circle","aria-hidden":true})
),
preact.h("button",{"class":"maximizebutton","data-cmd":"/maximize",tabIndex:-1,"aria-label":"Maximize"},
preact.h("i",{"class":"fa fa-stop-circle","aria-hidden":true})
),
preact.h("button",{"class":"minimizebutton",tabIndex:-1,"aria-label":"Expand/Collapse"},
preact.h("i",{"class":"fa fa-minus-circle","aria-hidden":true})
),
room.title
),
_this4.renderMiniRoom(room)
);
});
};_proto3.
renderGames=function renderGames(){
if(!PS.mainmenu.search.games)return null;


return preact.h("div",{"class":"menugroup"},
preact.h("p",{"class":"label"},"You are in:"),
Object.entries(PS.mainmenu.search.games).map(function(_ref2){var roomid=_ref2[0],gameName=_ref2[1];return preact.h("div",null,
preact.h("a",{"class":"blocklink",href:""+roomid},gameName)
);})
);
};_proto3.
renderSearchButton=function renderSearchButton(){var _PS$mainmenu$searchCo;
if(PS.down){
return preact.h("div",{"class":"menugroup",style:"background: rgba(10,10,10,.6)"},
PS.down==='ddos'?
preact.h("p",{"class":"error"},preact.h("strong",null,"Pok\xE9mon Showdown is offline due to a DDoS attack!")):

preact.h("p",{"class":"error"},preact.h("strong",null,"Pok\xE9mon Showdown is offline due to technical difficulties!")),

preact.h("p",null,
preact.h("div",{style:{textAlign:'center'}},
preact.h("img",{width:"96",height:"96",src:"//"+Config.routes.client+"/sprites/gen5/teddiursa.png",alt:""})
),"Bear with us as we freak out."

),
preact.h("p",null,"(We'll be back up in a few hours.)")
);
}

if(!PS.user.userid||PS.isOffline){var _PS$connection;
return preact.h(TeamForm,{"class":"menugroup",onSubmit:this.submitSearch,selectType:"search"},
preact.h("button",{"class":"mainmenu1 mainmenu big button disabled",disabled:true,name:"search"},
preact.h("em",null,PS.isOffline?[preact.h("span",{"class":"fa-stack fa-lg"},
preact.h("i",{"class":"fa fa-plug fa-flip-horizontal fa-stack-1x","aria-hidden":true}),
preact.h("i",{"class":"fa fa-ban fa-stack-2x text-danger","aria-hidden":true})
)," Disconnected"]:"Connecting...")
),
PS.isOffline&&preact.h("p",{"class":"buttonbar"},
preact.h("button",{"class":"button","data-cmd":"/reconnect"},
preact.h("i",{"class":"fa fa-plug","aria-hidden":true})," ",preact.h("strong",null,"Reconnect")
)," ",
((_PS$connection=PS.connection)==null?void 0:_PS$connection.reconnectTimer)&&preact.h("small",null,"(Autoreconnect in ",Math.round(PS.connection.reconnectDelay/1000),"s)")
)
);
}

return preact.h(TeamForm,{
"class":"menugroup",format:(_PS$mainmenu$searchCo=PS.mainmenu.searchCountdown)==null?void 0:_PS$mainmenu$searchCo.format,selectType:"search",onSubmit:this.submitSearch},

preact.h("p",null,
preact.h("button",{"class":"button small","data-href":"battleoptions",title:"Options","aria-label":"Options"},"Battle options ",
preact.h("i",{"class":"fa fa-caret-down"})
)),
PS.mainmenu.searchCountdown?
preact.h(preact.Fragment,null,
preact.h("button",{"class":"mainmenu1 mainmenu big button disabled",type:"submit"},preact.h("strong",null,
preact.h("i",{"class":"fa fa-refresh fa-spin","aria-hidden":true})," Searching in ",PS.mainmenu.searchCountdown.countdown,"..."
)),
preact.h("p",{"class":"buttonbar"},preact.h("button",{"class":"button","data-cmd":"/cancelsearch"},"Cancel"))
):
PS.mainmenu.searchSent||PS.mainmenu.search.searching.length?
preact.h(preact.Fragment,null,
preact.h("button",{"class":"mainmenu1 mainmenu big button disabled",type:"submit"},
preact.h("strong",null,preact.h("i",{"class":"fa fa-refresh fa-spin","aria-hidden":true})," Searching...")
),
preact.h("p",{"class":"buttonbar"},preact.h("button",{"class":"button","data-cmd":"/cancelsearch"},"Cancel"))
):

preact.h("button",{"class":"mainmenu1 mainmenu big button",type:"submit"},
preact.h("strong",null,"Battle!"),preact.h("br",null),
preact.h("small",null,"Find a random opponent")
)

);
};_proto3.
render=function render(){
var onlineButton=' button'+(PS.isOffline?' disabled':'');
var tinyLayout=this.props.room.width<620?' tiny-layout':'';
return preact.h(PSPanelWrapper,{room:this.props.room,scrollable:true,onDragEnter:this.handleDragEnter},
preact.h("div",{"class":"mainmenu-mini-windows"+tinyLayout},
this.renderMiniRooms()
),
preact.h("div",{"class":"mainmenu"+tinyLayout},
preact.h("div",{"class":"mainmenu-left"},
this.renderGames(),

this.renderSearchButton(),

preact.h("div",{"class":"menugroup"},
preact.h("p",null,preact.h("a",{"class":"mainmenu2 mainmenu button",href:"teambuilder"},"Teambuilder")),
preact.h("p",null,preact.h("a",{"class":"mainmenu3 mainmenu"+onlineButton,href:"ladder"},"Ladder")),
preact.h("p",null,preact.h("a",{"class":"mainmenu4 mainmenu"+onlineButton,href:"view-tournaments-all"},"Tournaments"))
),

preact.h("div",{"class":"menugroup"},
preact.h("p",null,preact.h("a",{"class":"mainmenu4 mainmenu"+onlineButton,href:"battles"},"Watch a battle")),
preact.h("p",null,preact.h("a",{"class":"mainmenu5 mainmenu"+onlineButton,href:"users"},"Find a user")),
preact.h("p",null,preact.h("a",{"class":"mainmenu6 mainmenu"+onlineButton,href:"view-friends-all"},"Friends")),
preact.h("p",null,preact.h("a",{"class":"mainmenu7 mainmenu"+onlineButton,href:"resources"},"Info & Resources"))
)
),
preact.h("div",{"class":"mainmenu-right",style:{display:PS.leftPanelWidth?'none':'block'}},
preact.h("div",{"class":"menugroup"},
preact.h("p",null,preact.h("a",{"class":"mainmenu1 mainmenu"+onlineButton,href:"rooms"},"Chat rooms")),
PS.server.id!=='showdown'&&
preact.h("p",null,preact.h("a",{"class":"mainmenu2 mainmenu"+onlineButton,href:"lobby"},"Lobby chat"))

)
),
preact.h("div",{"class":"mainmenu-footer"},
preact.h("div",{"class":"bgcredit"}),
preact.h("small",null,
preact.h("a",{href:"//"+Config.routes.dex+"/",target:"_blank"},"Pok\xE9dex")," | ",
preact.h("a",{href:"//"+Config.routes.replays+"/",target:"_blank"},"Replays")," | ",
preact.h("a",{href:"//"+Config.routes.root+"/rules",target:"_blank"},"Rules")," | ",
preact.h("a",{href:"//"+Config.routes.root+"/credits",target:"_blank"},"Credits")," | ",
preact.h("a",{href:"//smogon.com/forums/",target:"_blank"},"Forum")
)
)
)
);
};return MainMenuPanel;}(PSRoomPanel);MainMenuPanel.id='mainmenu';MainMenuPanel.routes=[''];MainMenuPanel.Model=MainMenuRoom;MainMenuPanel.icon=preact.h("i",{"class":"fa fa-home","aria-hidden":true});var


FormatDropdown=function(_preact$Component){function FormatDropdown(){var _this5;for(var _len3=arguments.length,args=new Array(_len3),_key3=0;_key3<_len3;_key3++){args[_key3]=arguments[_key3];}_this5=_preact$Component.call.apply(_preact$Component,[this].concat(args))||this;_this5.




format='';_this5.
change=function(e){
if(!_this5.base)return;
_this5.format=_this5.base.value;
_this5.forceUpdate();
if(_this5.props.onChange)_this5.props.onChange(e);
};return _this5;}_inheritsLoose(FormatDropdown,_preact$Component);var _proto4=FormatDropdown.prototype;_proto4.
componentWillMount=function componentWillMount(){
if(this.props.format!==undefined){
this.format=this.props.format;
}
};_proto4.
render=function render(){
this.format||(this.format=this.props.format||this.props.defaultFormat||'');
var _this$format$split=this.format.split('@@@'),formatName=_this$format$split[0],customRules=_this$format$split[1];
if(window.BattleLog)formatName=BattleLog.formatName(formatName);
if(this.props.format||PS.mainmenu.searchSent){
return preact.h("button",{
name:"format",value:this.format,"class":"select formatselect preselected",disabled:true},

formatName,
!!customRules&&[preact.h("br",null),preact.h("small",null,"Custom rules: ",customRules)]
);
}
return preact.h("button",{
name:"format",value:this.format,"data-selecttype":this.props.selectType,
"class":"select formatselect","data-href":"/formatdropdown",onChange:this.change},

formatName||!!this.props.placeholder&&preact.h("em",null,this.props.placeholder)||null,
!!customRules&&[preact.h("br",null),preact.h("small",null,"Custom rules: ",customRules)]
);
};return FormatDropdown;}(preact.Component);var


TeamDropdown=function(_preact$Component2){function TeamDropdown(){var _this6;for(var _len4=arguments.length,args=new Array(_len4),_key4=0;_key4<_len4;_key4++){args[_key4]=arguments[_key4];}_this6=_preact$Component2.call.apply(_preact$Component2,[this].concat(args))||this;_this6.
teamFormat='';_this6.
teamKey='';_this6.
change=function(){
if(!_this6.base)return;
_this6.teamKey=_this6.base.value;
_this6.forceUpdate();
};return _this6;}_inheritsLoose(TeamDropdown,_preact$Component2);var _proto5=TeamDropdown.prototype;_proto5.
getDefaultTeam=function getDefaultTeam(teambuilderFormat){for(var _i12=0,_PS$teams$list4=
PS.teams.list;_i12<_PS$teams$list4.length;_i12++){var team=_PS$teams$list4[_i12];
if(team.format===teambuilderFormat)return team.key;
}
return'';
};_proto5.
render=function render(){var _window$BattleFormats;
var teamFormat=PS.teams.teambuilderFormat(this.props.format);
var formatData=(_window$BattleFormats=window.BattleFormats)==null?void 0:_window$BattleFormats[teamFormat];
if(formatData!=null&&formatData.team){
return preact.h("button",{"class":"select teamselect preselected",name:"team",value:"random",disabled:true},
preact.h("div",{"class":"team"},
preact.h("strong",null,"Random team"),
preact.h("small",null,
preact.h(PSIcon,{pokemon:null}),
preact.h(PSIcon,{pokemon:null}),
preact.h(PSIcon,{pokemon:null}),
preact.h(PSIcon,{pokemon:null}),
preact.h(PSIcon,{pokemon:null}),
preact.h(PSIcon,{pokemon:null})
)
)
);
}
if(teamFormat!==this.teamFormat){
this.teamFormat=teamFormat;
this.teamKey=this.getDefaultTeam(teamFormat);
}
var team=PS.teams.byKey[this.teamKey]||null;
return preact.h("button",{
name:"team",value:this.teamKey,
"class":"select teamselect","data-href":"/teamdropdown","data-format":teamFormat,onChange:this.change},

PS.roomTypes['teamdropdown']&&preact.h(TeamBox,{team:team,noLink:true})
);
};return TeamDropdown;}(preact.Component);var


TeamForm=function(_preact$Component3){function TeamForm(){var _this7;for(var _len5=arguments.length,args=new Array(_len5),_key5=0;_key5<_len5;_key5++){args[_key5]=arguments[_key5];}_this7=_preact$Component3.call.apply(_preact$Component3,[this].concat(args))||this;_this7.





format='';_this7.
changeFormat=function(ev){
_this7.format=ev.target.value;
};_this7.
submit=function(ev,validate){var _window$BattleFormats2;
ev.preventDefault();
var format=_this7.format;
var teamElement=_this7.base.querySelector('button[name=team]');
var teamKey=teamElement.value;
var team=teamKey?PS.teams.byKey[teamKey]:undefined;
if(!((_window$BattleFormats2=window.BattleFormats[toID(format)])!=null&&_window$BattleFormats2.team)&&!team){
PS.alert('You need to go into the Teambuilder and build a team for this format.',{
parentElem:teamElement
});
return;
}
PS.teams.loadTeam(team).then(function(){var _ref3;
(_ref3=validate==='validate'?_this7.props.onValidate:_this7.props.onSubmit)==null||_ref3(ev,format,team);
});
};_this7.
handleClick=function(ev){
var target=ev.target;
while(target&&target!==_this7.base){
if(target.tagName==='BUTTON'&&target.name==='validate'){
_this7.submit(ev,'validate');
return;
}
target=target.parentNode;
}
};return _this7;}_inheritsLoose(TeamForm,_preact$Component3);var _proto6=TeamForm.prototype;_proto6.
render=function render(){
if(window.BattleFormats){
var starredPrefs=PS.prefs.starredformats||{};

var starred=Object.keys(starredPrefs).filter(function(id){return starredPrefs[id]===true;}).reverse();
if(!this.format){
this.format="gen"+Dex.gen+"randombattle";for(var _i14=0;_i14<
starred.length;_i14++){var id=starred[_i14];
var format=window.BattleFormats[id];
if(!format)continue;
if(this.props.selectType==='challenge'&&(format==null?void 0:format.challengeShow)===false)continue;
if(this.props.selectType==='search'&&(format==null?void 0:format.searchShow)===false)continue;
if(this.props.selectType==='teambuilder'&&format!=null&&format.team)continue;
this.format=id;
break;
}
}
}
return preact.h("form",{"class":this.props["class"],onSubmit:this.submit,onClick:this.handleClick},
!this.props.hideFormat&&preact.h("p",null,
preact.h("label",{"class":"label"},"Format:",
preact.h("br",null),
preact.h(FormatDropdown,{
selectType:this.props.selectType,format:this.props.format,defaultFormat:this.format,
onChange:this.changeFormat}
)
)
),
preact.h("p",null,
preact.h("label",{"class":"label"},"Team:",
preact.h("br",null),
preact.h(TeamDropdown,{format:this.props.teamFormat||this.format})
)
),
preact.h("p",null,this.props.children)
);
};return TeamForm;}(preact.Component);


PS.addRoomType(NewsPanel,MainMenuPanel);
//# sourceMappingURL=panel-mainmenu.js.map