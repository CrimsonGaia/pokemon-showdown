"use strict";var _templateObject;function _readOnlyError(r){throw new TypeError('"'+r+'" is read-only');}function _taggedTemplateLiteralLoose(e,t){return t||(t=e.slice(0)),e.raw=t,e;}function _inheritsLoose(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,_setPrototypeOf(t,o);}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t;},_setPrototypeOf(t,e);}/**
 * Teambuilder team panel
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license AGPLv3
 */var










TeamRoom=function(_PSRoom){













function TeamRoom(options){var _this$team;var _this;
_this=_PSRoom.call(this,options)||this;_this.team=void 0;_this.forceReload=false;_this.clientCommands=_this.parseClientCommands({'validate':function(target){if(this.team.format.length<=4){return this.errorReply("You must select a format first.");}this.send("/utm "+this.team.packedTeam);this.send("/vtm "+this.team.format);}});
var team=PS.teams.byKey[_this.id.slice(5)]||null;
_this.team=team;
_this.title="[Team] "+(((_this$team=_this.team)==null?void 0:_this$team.name)||'Error');
if(team)_this.setFormat(team.format);
_this.load();return _this;
}_inheritsLoose(TeamRoom,_PSRoom);var _proto=TeamRoom.prototype;_proto.
setFormat=function setFormat(format){
var team=this.team;
team.format=toID(format);
};_proto.
load=function load(){var _PS$teams$loadTeam,_this2=this;
(_PS$teams$loadTeam=PS.teams.loadTeam(this.team,true))==null||_PS$teams$loadTeam.then(function(){
_this2.update(null);
});
};_proto.
upload=function upload(isPrivate){
var team=this.team;
var cmd=team.uploaded?'update':'save';

var buf=[];
if(team.uploaded){
buf.push(team.uploaded.teamid);
}else if(team.teamid){
return PS.alert("This team is for a different account. Please log into the correct account to update it.");
}
buf.push(team.name,team.format,isPrivate?1:0);
var exported=team.packedTeam;
if(!exported)return PS.alert("Add a Pokemon to your team before uploading it.");
buf.push(exported);
PS.teams.uploading=team;
PS.send("/teams "+cmd+" "+buf.join(', '));
team.uploadedPackedTeam=exported;
this.update(null);
};_proto.
stripNicknames=function stripNicknames(packedTeam){
var team=Teams.unpack(packedTeam);for(var _i2=0;_i2<
team.length;_i2++){var pokemon=team[_i2];
pokemon.name='';
}
return Teams.pack(team);
};_proto.
save=function save(){var _this$team2;
PS.teams.save();
var title="[Team] "+(((_this$team2=this.team)==null?void 0:_this$team2.name)||'Team');
if(title!==this.title){
this.title=title;
PS.update();
}
};return TeamRoom;}(PSRoom);var



TeamPanel=function(_PSRoomPanel){





function TeamPanel(props){var _this3;
_this3=_PSRoomPanel.call(this,props)||this;_this3.






















handleRename=function(ev){
var textbox=ev.currentTarget;
var room=_this3.props.room;

room.team.name=textbox.value.trim();
room.save();
};_this3.

uploadTeam=function(ev){
var room=_this3.props.room;
room.upload(room.team.uploaded?!!room.team.uploaded["private"]:PS.prefs.uploadprivacy);
};_this3.
restore=function(ev){
var room=_this3.props.room;
var team=room.team;
if(!team.uploadedPackedTeam){

PS.alert("Must use on an uploaded team.");
return;
}
team.packedTeam=team.uploadedPackedTeam;
room.forceReload=true;
room.save();
_this3.forceUpdate();
};_this3.
compare=function(ev){
var team=_this3.props.room.team;
if(!team.uploadedPackedTeam){

PS.alert("Must use on an uploaded team.");
return;
}
var uploadedTeam=Teams["export"](Teams.unpack(team.uploadedPackedTeam));
var localTeam=Teams["export"](Teams.unpack(team.packedTeam));
PS.alert(BattleLog.html(_templateObject||(_templateObject=_taggedTemplateLiteralLoose(["|html|<table class=\"table\" style=\"width:100%;font-size:14px\"><tr><th>Local</th><th>Uploaded</th></tr><tr><td>","</td><td>","</td></tr></table>"])),localTeam,uploadedTeam),{width:720});
ev.preventDefault();
ev.stopImmediatePropagation();
};_this3.

changePrivacyPref=function(ev){
PS.prefs.uploadprivacy=!ev.currentTarget.checked;
PS.prefs.save();
_this3.forceUpdate();
};_this3.
handleChangeFormat=function(ev){
var dropdown=ev.currentTarget;
var room=_this3.props.room;

room.setFormat(dropdown.value);
room.save();
_this3.forceUpdate();
TeamPanel.getFormatResources(room.team.format).then(function(){
_this3.forceUpdate();
});
};_this3.
save=function(){
_this3.props.room.save();
_this3.forceUpdate();
};var _room=_this3.props.room;if(_room.team){TeamPanel.getFormatResources(_room.team.format).then(function(){_this3.forceUpdate();});}return _this3;}_inheritsLoose(TeamPanel,_PSRoomPanel);TeamPanel.getFormatResources=function getFormatResources(format){var _this4=this;if(format in this.formatResources)return Promise.resolve(this.formatResources[format]);return Net('https://www.smogon.com/dex/api/formats/by-ps-name/'+format).get().then(function(result){_this4.formatResources[format]=JSON.parse(result);return _this4.formatResources[format];})["catch"](function(err){_this4.formatResources[format]=null;return _this4.formatResources[format];});};var _proto2=TeamPanel.prototype;_proto2.
renderResources=function renderResources(){
var room=this.props.room;
var team=room.team;
var info=TeamPanel.formatResources[team.format];
var formatName=BattleLog.formatName(team.format);
return info&&(info.resources.length||info.url)?
preact.h("details",{"class":"details",open:true},
preact.h("summary",null,preact.h("strong",null,"Teambuilding resources for ",formatName)),
preact.h("div",{style:"margin-left:5px"},preact.h("ul",null,
info.resources.map(function(resource){return(
preact.h("li",null,preact.h("p",null,preact.h("a",{href:resource.url,target:"_blank"},resource.resource_name))));}
)
),
preact.h("p",null,"Find ",
info.resources.length?'more ':'',"helpful resources for ",
formatName," on ",preact.h("a",{href:info.url,target:"_blank"},"the Smogon Dex"),"."
))
):
null;
};_proto2.
componentDidUpdate=function componentDidUpdate(){
var room=this.props.room;
room.load();
};_proto2.
render=function render(){
var room=this.props.room;
var team=room.team;
if(!team||room.forceReload){
if(room.forceReload){
room.forceReload=false;
room.update(null);
}
return preact.h(PSPanelWrapper,{room:room},
preact.h("a",{"class":"button",href:"teambuilder","data-target":"replace"},
preact.h("i",{"class":"fa fa-chevron-left","aria-hidden":true})," List"
),
preact.h("p",{"class":"error"},"Team doesn't exist"

)
);
}

var unsaved=team.uploaded&&team.uploadedPackedTeam?team.uploadedPackedTeam!==team.packedTeam:false;
return preact.h(PSPanelWrapper,{room:room,scrollable:true},preact.h("div",{"class":"pad"},
preact.h("a",{"class":"button",href:"teambuilder","data-target":"replace"},
preact.h("i",{"class":"fa fa-chevron-left","aria-hidden":true})," Teams"
)," ",
team.uploaded?
preact.h(preact.Fragment,null,
preact.h("button",{"class":"button"+(unsaved?' button-first':''),"data-href":"teamstorage-"+team.key},
preact.h("i",{"class":"fa fa-globe"})," Account ",team.uploaded["private"]?'':"(public)"
),
unsaved&&preact.h("button",{"class":"button button-last",onClick:this.uploadTeam},
preact.h("strong",null,"Upload changes")
)
):
team.teamid?
preact.h("button",{"class":"button","data-href":"teamstorage-"+team.key},
preact.h("i",{"class":"fa fa-plug"})," Disconnected (wrong account?)"
):

preact.h("button",{"class":"button","data-href":"teamstorage-"+team.key},
preact.h("i",{"class":"fa fa-laptop"})," Local"
),

preact.h("div",{style:"float:right"},preact.h("button",{
name:"format",value:team.format,"data-selecttype":"teambuilder",
"class":"button","data-href":"/formatdropdown",onChange:this.handleChangeFormat},

preact.h("i",{"class":"fa fa-folder-o"})," ",BattleLog.formatName(team.format)," ",
team.format.length<=4&&preact.h("em",null,"(uncategorized)")," ",preact.h("i",{"class":"fa fa-caret-down"})
)),
preact.h("label",{"class":"label teamname"},"Team name:",

preact.h("input",{
"class":"textbox",type:"text",value:team.name,
onInput:this.handleRename,onChange:this.handleRename,onKeyUp:this.handleRename}
)
),
preact.h(TeamEditor,{
team:team,onChange:this.save,readOnly:!!team.teamid&&!team.uploadedPackedTeam,resources:this.renderResources()},

!!(team.packedTeam&&team.format.length>4)&&preact.h("p",null,
preact.h("button",{"data-cmd":"/validate","class":"button"},preact.h("i",{"class":"fa fa-check"})," Validate")
),
!!(team.packedTeam||team.uploaded)&&preact.h("p",{"class":"infobox",style:"padding: 5px 8px"},
team.uploadedPackedTeam&&!team.uploaded?preact.h(preact.Fragment,null,"Uploading..."

):team.uploaded?preact.h(preact.Fragment,null,
preact.h("small",null,"Share URL:")," ",
preact.h(CopyableURLBox,{
url:"https://psim.us/t/"+team.uploaded.teamid+(team.uploaded["private"]?'-'+team.uploaded["private"]:'')}
)," ",
unsaved&&preact.h("div",{style:"padding-top:5px"},
preact.h("button",{"class":"button",onClick:this.uploadTeam},
preact.h("i",{"class":"fa fa-upload"})," ",preact.h("strong",null,"Upload changes")
)," ",
preact.h("button",{"class":"button",onClick:this.restore},"Revert to uploaded version"

)," ",
preact.h("button",{"class":"button",onClick:this.compare},"Compare"

)
)
):!team.teamid?preact.h(preact.Fragment,null,
preact.h("label",{"class":"checkbox inline"},
preact.h("input",{
name:"teamprivacy",checked:!PS.prefs.uploadprivacy,
type:"checkbox",onChange:this.changePrivacyPref}
)," Public"
),
preact.h("button",{"class":"button exportbutton",onClick:this.uploadTeam},
preact.h("i",{"class":"fa fa-upload"})," Upload for",
PS.prefs.uploadprivacy?' shareable URL':' shareable/searchable URL'
)
):preact.h(preact.Fragment,null,"This is a disconnected team. This could be because you uploaded it on a different account, or because you deleted or un-uploaded it on a different computer. For safety, you can't edit this team. You can, however, delete it, or make a copy (which will be editable)."




)
)
)
));
};return TeamPanel;}(PSRoomPanel);TeamPanel.id='team';TeamPanel.routes=['team-*'];TeamPanel.Model=TeamRoom;TeamPanel.title='Team';TeamPanel.formatResources={};var


ViewTeamPanel=function(_PSRoomPanel2){function ViewTeamPanel(){var _this5;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this5=_PSRoomPanel2.call.apply(_PSRoomPanel2,[this].concat(args))||this;_this5.




team=void 0;_this5.
teamData=

null;return _this5;}_inheritsLoose(ViewTeamPanel,_PSRoomPanel2);var _proto3=ViewTeamPanel.prototype;_proto3.
componentDidMount=function componentDidMount(){var _this6=this;
_PSRoomPanel2.prototype.componentDidMount.call(this);
var roomid=this.props.room.id;
var _roomid$slice$split=roomid.slice(9).split('-'),teamid=_roomid$slice$split[0],password=_roomid$slice$split[1];
PSLoginServer.query('getteam',{
teamid:teamid,
password:password,
full:true
}).then(function(untypedData){
var data=untypedData;
if(!data){
_this6.team=null;
return;
}
_this6.team={
name:data.title,
format:data.format,
folder:'',
packedTeam:data.team,
iconCache:null,
key:'',
isBox:false,
teamid:parseInt(teamid)
};for(var _i4=0,_PS$teams$list2=
PS.teams.list;_i4<_PS$teams$list2.length;_i4++){var localTeam=_PS$teams$list2[_i4];
if(localTeam.teamid===_this6.team.teamid){
_this6.team.key=localTeam.key;
break;
}
}
_this6.props.room.title="[Team] "+(_this6.team.name||'Untitled team');
_this6.teamData=data;
PS.update();
});
};_proto3.

render=function render(){
var room=this.props.room;
var team=this.team;
var teamData=this.teamData;
if(!team){
return preact.h(PSPanelWrapper,{room:room},
team===null?preact.h("p",{"class":"error"},"Team doesn't exist"

):preact.h("p",null,"Loading..."

)
);
}

return preact.h(PSPanelWrapper,{room:room,scrollable:true},preact.h("div",{"class":"pad"},
preact.h("h1",null,team.name||"Untitled team"),
preact.h(CopyableURLBox,{
url:"https://psim.us/t/"+team.teamid+(teamData["private"]?'-'+teamData["private"]:'')}
)," ",
preact.h("p",null,"Uploaded by: ",preact.h("strong",null,teamData.ownerid)),
preact.h("p",null,"Format: ",preact.h("strong",null,teamData.format)),
preact.h("p",null,"Views: ",preact.h("strong",null,teamData.views)),
team.key&&preact.h("p",null,preact.h("a",{"class":"button",href:"team-"+team.key},"Edit")),
preact.h(TeamEditor,{team:team,readOnly:true})
));
};return ViewTeamPanel;}(PSRoomPanel);ViewTeamPanel.id='viewteam';ViewTeamPanel.routes=['viewteam-*'];ViewTeamPanel.Model=TeamRoom;ViewTeamPanel.title='Loading...';var



TeamStoragePanel=function(_PSRoomPanel3){function TeamStoragePanel(){var _this7;for(var _len2=arguments.length,args=new Array(_len2),_key2=0;_key2<_len2;_key2++){args[_key2]=arguments[_key2];}_this7=_PSRoomPanel3.call.apply(_PSRoomPanel3,[this].concat(args))||this;_this7.





chooseOption=function(ev){var _team$uploaded,_team$uploaded2;
var storage=ev.currentTarget.value;
var room=_this7.props.room;
var team=_this7.team();

if(storage==='local'&&team.uploaded){
PS.send("/teams delete "+team.uploaded.teamid);
team.uploaded=undefined;
team.teamid=undefined;
team.uploadedPackedTeam=undefined;
PS.teams.save();
room.getParent().update(null);
}else if(storage==='public'&&(_team$uploaded=team.uploaded)!=null&&_team$uploaded["private"]){
PS.send("/teams setprivacy "+team.uploaded.teamid+",no");
}else if(storage==='account'&&((_team$uploaded2=team.uploaded)==null?void 0:_team$uploaded2["private"])===null){
PS.send("/teams setprivacy "+team.uploaded.teamid+",yes");
}else if(storage==='public'&&!team.teamid){
room.getParent().upload(false);
}else if(storage==='account'&&!team.teamid){
room.getParent().upload(true);
}
ev.stopImmediatePropagation();
ev.preventDefault();
_this7.close();
};return _this7;}_inheritsLoose(TeamStoragePanel,_PSRoomPanel3);var _proto4=TeamStoragePanel.prototype;_proto4.
team=function team(){
var teamKey=this.props.room.id.slice(12);
var team=PS.teams.byKey[teamKey];
return team;
};_proto4.

render=function render(){var _team$uploaded3;
var room=this.props.room;

var team=this.team();
var storage=(_team$uploaded3=team.uploaded)!=null&&_team$uploaded3["private"]?
'account':
team.uploaded?
'public':
team.teamid?
'disconnected':

'local';


if(storage==='disconnected'){
return preact.h(PSPanelWrapper,{room:room,width:280},preact.h("div",{"class":"pad"},
preact.h("div",null,preact.h("button",{"class":"option cur","data-cmd":"/close"},
preact.h("i",{"class":"fa fa-plug"})," ",preact.h("strong",null,"Disconnected"),preact.h("br",null),"Not found in the Teams database. Maybe you uploaded it on a different account?"

))
));
}
return preact.h(PSPanelWrapper,{room:room,width:280},preact.h("div",{"class":"pad"},
preact.h("div",null,preact.h("button",{"class":"option"+(storage==='local'?' cur':''),onClick:this.chooseOption,value:"local"},
preact.h("i",{"class":"fa fa-laptop"})," ",preact.h("strong",null,"Local"),preact.h("br",null),"Stored in cookies on your computer. Warning: Your browser might delete these. Make sure to use backups."

)),
preact.h("div",null,preact.h("button",{"class":"option"+(storage==='account'?' cur':''),onClick:this.chooseOption,value:"account"},
preact.h("i",{"class":"fa fa-cloud"})," ",preact.h("strong",null,"Account"),preact.h("br",null),"Uploaded to the Teams database. You can share with the URL."

)),
preact.h("div",null,preact.h("button",{"class":"option"+(storage==='public'?' cur':''),onClick:this.chooseOption,value:"public"},
preact.h("i",{"class":"fa fa-globe"})," ",preact.h("strong",null,"Account (public)"),preact.h("br",null),"Uploaded to the Teams database publicly. Share with the URL or people can find it by searching."

))
));
};return TeamStoragePanel;}(PSRoomPanel);TeamStoragePanel.id="teamstorage";TeamStoragePanel.routes=["teamstorage-*"];TeamStoragePanel.location="semimodal-popup";TeamStoragePanel.noURL=true;


PS.addRoomType(TeamPanel,TeamStoragePanel,ViewTeamPanel);
//# sourceMappingURL=panel-teambuilder-team.js.map