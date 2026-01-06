"use strict";function _inheritsLoose(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,_setPrototypeOf(t,o);}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t;},_setPrototypeOf(t,e);}/**
 * Client main
 *
 * Dependencies: client-core
 *
 * Sets up the main client models: Prefs, Teams, User, and PS.
 *
 * @author Guangcong Luo <guancongluo@gmail.com>
 * @license AGPLv3
 */

























































var PSPrefsDefaults={};var








PSPrefs=function(_PSStreamModel){




























































































function PSPrefs(){var _this;
_this=_PSStreamModel.call(this)||this;_this.theme='light';_this.nogif=null;_this.noanim=null;_this.bwgfx=null;_this.nopastgens=null;_this.blockPMs=null;_this.blockChallenges=null;_this.inchatpm=null;_this.noselfhighlight=null;_this.temporarynotifications=null;_this.leavePopupRoom=null;_this.refreshprompt=null;_this.language='english';_this.chatformatting={hidegreentext:false,hideme:false,hidespoiler:false,hidelinks:false,hideinterstice:true};_this.nounlink=null;_this.ignorenicks=null;_this.ignorespects=null;_this.ignoreopp=null;_this.autotimer=null;_this.rightpanelbattles=null;_this.disallowspectators=null;_this.starredformats=null;_this.showjoins=null;_this.showdebug=null;_this.showbattles=true;_this.autojoin=null;_this.ignore=null;_this.tournaments=null;_this.onepanel=false;_this.timestamps={};_this.mute=false;_this.effectvolume=50;_this.musicvolume=50;_this.notifvolume=50;_this.uploadprivacy=false;_this.afd=false;_this.highlights=null;_this.logtimes=null;_this.storageEngine='';_this.storage={};_this.origin="https://"+Config.routes.client;

for(var key in _this){
var value=_this[key];
if(['storage','subscriptions','origin','storageEngine','updates'].includes(key))continue;
if(typeof value==='function')continue;
PSPrefsDefaults[key]=value;
}


try{
if(window.localStorage){
_this.storageEngine='localStorage';
_this.load(JSON.parse(localStorage.getItem('showdown_prefs'))||{},true);
}
}catch(_unused){}return _this;
}_inheritsLoose(PSPrefs,_PSStreamModel);var _proto=PSPrefs.prototype;_proto.



set=function set(key,value){
if(value===null){
delete this.storage[key];
this[key]=PSPrefsDefaults[key];
}else{
this.storage[key]=value;
this[key]=value;
}
this.update(key);
this.save();
};_proto.

load=function load(newPrefs,noSave){
this.fixPrefs(newPrefs);
Object.assign(this,PSPrefsDefaults);
this.storage=newPrefs;
for(var key in PSPrefsDefaults){
if(key in newPrefs)this[key]=newPrefs[key];
}
this.setAFD();
this.update(null);
if(!noSave)this.save();
};_proto.
save=function save(){
switch(this.storageEngine){
case'localStorage':
localStorage.setItem('showdown_prefs',JSON.stringify(this.storage));
}
};_proto.
fixPrefs=function fixPrefs(newPrefs){
var oldShowjoins=newPrefs['showjoins'];
if(oldShowjoins!==undefined&&typeof oldShowjoins!=='object'){
var showjoins={};
var serverShowjoins={global:oldShowjoins?1:0};
var showroomjoins=newPrefs['showroomjoins'];
for(var _roomid in showroomjoins){
serverShowjoins[_roomid]=showroomjoins[_roomid]?1:0;
}
delete newPrefs['showroomjoins'];
showjoins[Config.server.id]=serverShowjoins;
newPrefs['showjoins']=showjoins;
}

var isChrome64=navigator.userAgent.includes(' Chrome/64.');
if(newPrefs['nogif']!==undefined){
if(!isChrome64){
delete newPrefs['nogif'];
}
}else if(isChrome64){
newPrefs['nogif']=true;
PS.alert('Your version of Chrome has a bug that makes animated GIFs freeze games sometimes, so certain animations have been disabled. Only some people have the problem, so you can experiment and enable them in the Options menu setting "Disable GIFs for Chrome 64 bug".');
}

var colorSchemeQuerySupported=(window.matchMedia==null?void 0:window.matchMedia('(prefers-color-scheme: dark)').media)!=='not all';
if(newPrefs['theme']==='system'&&!colorSchemeQuerySupported){
newPrefs['theme']='light';
}
if(newPrefs['dark']!==undefined){
if(newPrefs['dark']){
newPrefs['theme']='dark';
}
delete newPrefs['dark'];
}
};_proto.

setAFD=function setAFD(mode){
if(mode===undefined){var _Config$server;

if(typeof BattleTextAFD!=='undefined'){
for(var id in BattleTextNotAFD){
if(!BattleTextAFD[id]){
BattleTextAFD[id]=BattleTextNotAFD[id];
}else{
BattleTextAFD[id]=Object.assign({},BattleTextNotAFD[id],BattleTextAFD[id]);
}
}
}

if((_Config$server=Config.server)!=null&&_Config$server.afd){
mode=true;
}else if(this.afd!==undefined){
mode=this.afd;
}else{


}
}

Dex.afdMode=mode;

if(typeof BattleTextAFD!=='undefined'){
if(mode===true){
BattleText=BattleTextAFD;
}else{
BattleText=BattleTextNotAFD;
}
}
};_proto.
doAutojoin=function doAutojoin(){
var autojoin=PS.prefs.autojoin;
if(autojoin){var _PS$connection;
if(typeof autojoin==='string'){
autojoin={showdown:autojoin};
}
var rooms=autojoin[PS.server.id]||'';for(var _i2=0,_rooms$split2=
rooms.split(",");_i2<_rooms$split2.length;_i2++){var title=_rooms$split2[_i2];
PS.addRoom({id:toID(title),title:title,connected:true,autofocus:false});
};
var cmd="/autojoin "+rooms;
if((_PS$connection=PS.connection)!=null&&_PS$connection.queue.includes(cmd)){


return;
}

PS.send(cmd);
}

for(var _roomid2 in PS.rooms){
var room=PS.rooms[_roomid2];
if(room.type==='battle'){
room.connect();
}
}
};return PSPrefs;}(PSStreamModel);









































if(!window.BattleFormats)window.BattleFormats={};var




PSTeams=function(_PSStreamModel2){






function PSTeams(){var _this2;
_this2=_PSStreamModel2.call(this)||this;_this2.usesLocalLadder=false;_this2.list=[];_this2.byKey={};_this2.deletedTeams=[];_this2.uploading=null;
try{
_this2.unpackAll(localStorage.getItem('showdown_teams'));
}catch(_unused2){}return _this2;
}_inheritsLoose(PSTeams,_PSStreamModel2);var _proto2=PSTeams.prototype;_proto2.
teambuilderFormat=function teambuilderFormat(format){
var ruleSepIndex=format.indexOf('@@@');
if(ruleSepIndex>=0)format=format.slice(0,ruleSepIndex);
var formatid=toID(format);
if(!window.BattleFormats)return formatid;
var formatEntry=BattleFormats[formatid];
return(formatEntry==null?void 0:formatEntry.teambuilderFormat)||formatid;
};_proto2.
getKey=function getKey(name){
var baseKey=toID(name)||'0';
var key=baseKey;
var i=1;
while(key in this.byKey){
i++;
key=baseKey+"-"+i;
}
return key;
};_proto2.
unpackAll=function unpackAll(buffer){
if(!buffer){
this.list=[];
return;
}

if(buffer.startsWith('[')&&!buffer.trim().includes('\n')){
this.unpackOldBuffer(buffer);
return;
}

this.list=[];for(var _i4=0,_buffer$split2=
buffer.split('\n');_i4<_buffer$split2.length;_i4++){var line=_buffer$split2[_i4];
var _team=this.unpackLine(line);
if(_team)this.push(_team);
}
this.update('team');
};_proto2.
push=function push(team){
team.key=this.getKey(team.name);
this.list.push(team);
this.byKey[team.key]=team;
};_proto2.
unshift=function unshift(team){
team.key=this.getKey(team.name);
this.list.unshift(team);
this.byKey[team.key]=team;
};_proto2["delete"]=
function _delete(team){
var teamIndex=this.list.indexOf(team);
if(teamIndex<0)return false;
this.deletedTeams.push([team,teamIndex]);
this.list.splice(teamIndex,1);
delete this.byKey[team.key];
};_proto2.
undelete=function undelete(){
if(!this.deletedTeams.length)return;
var _ref=this.deletedTeams.pop(),team=_ref[0],teamIndex=_ref[1];
this.list.splice(teamIndex,0,team);
if(this.byKey[team.key])team.key=this.getKey(team.name);
this.byKey[team.key]=team;
};_proto2.
unpackOldBuffer=function unpackOldBuffer(buffer){
PS.alert("Your team storage format is too old for PS. You'll need to upgrade it at https://"+Config.routes.client+"/recoverteams.html");
this.list=[];
};_proto2.
packAll=function packAll(teams){
return teams.map(function(team){return(
(team.teamid?team.teamid+"[":'')+(
team.format||team.isBox?""+(team.format||'')+(team.isBox?'-box':'')+"]":"")+(
team.folder?team.folder+"/":"")+
team.name+"|"+team.packedTeam);}
).join('\n');
};_proto2.
save=function save(){
try{
localStorage.setItem('showdown_teams',this.packAll(this.list));
}catch(_unused3){}
this.update('team');
};_proto2.
unpackLine=function unpackLine(line){
var pipeIndex=line.indexOf('|');
if(pipeIndex<0)return null;
var bracketIndex=line.indexOf(']');
if(bracketIndex>pipeIndex)bracketIndex=-1;
var leftBracketIndex=line.indexOf('[');
if(leftBracketIndex<0)leftBracketIndex=0;
var isBox=line.slice(0,bracketIndex).endsWith('-box');
var slashIndex=line.lastIndexOf('/',pipeIndex);
if(slashIndex<0)slashIndex=bracketIndex;
var format=bracketIndex>0?line.slice(
leftBracketIndex?leftBracketIndex+1:0,isBox?bracketIndex-4:bracketIndex
):'gen9';
if(!format.startsWith('gen'))format='gen6'+format;
var name=line.slice(slashIndex+1,pipeIndex);
var teamid=leftBracketIndex>0?Number(line.slice(0,leftBracketIndex)):undefined;
return{
name:name,
format:format,
folder:line.slice(bracketIndex+1,slashIndex>0?slashIndex:bracketIndex+1),
packedTeam:line.slice(pipeIndex+1),
iconCache:null,
key:'',
isBox:isBox,
teamid:teamid
};
};_proto2.
loadRemoteTeams=function loadRemoteTeams(){var _this3=this;
PSLoginServer.query('getteams').then(function(data){
if(!data)return;
if(data.actionerror){
return PS.alert('Error loading uploaded teams: '+data.actionerror);
}
var teams={};for(var _i6=0,_data$teams2=
data.teams;_i6<_data$teams2.length;_i6++){var _team2=_data$teams2[_i6];
teams[_team2.teamid]=_team2;
}for(var _i8=0,_this3$list2=


_this3.list;_i8<_this3$list2.length;_i8++){var localTeam=_this3$list2[_i8];
if(localTeam.teamid){
var _team3=teams[localTeam.teamid];
if(!_team3){
continue;
}
localTeam.uploaded={
teamid:_team3.teamid,
notLoaded:false,
"private":_team3["private"]
};
delete teams[localTeam.teamid];
}
}for(var _i10=0,_Object$values2=


Object.values(teams);_i10<_Object$values2.length;_i10++){var _team4=_Object$values2[_i10];
var matched=false;for(var _i12=0,_this3$list4=
_this3.list;_i12<_this3$list4.length;_i12++){var _localTeam=_this3$list4[_i12];
if(_localTeam.teamid)continue;

var compare=_this3.compareTeams(_team4,_localTeam);
if(compare==='rename'){
if(!_localTeam.name.endsWith(' (local version)'))_localTeam.name+=' (local version)';
}else if(compare){


matched=true;
_localTeam.teamid=_team4.teamid;
_localTeam.uploaded={
teamid:_team4.teamid,
notLoaded:false,
"private":_team4["private"]
};
break;
}
}
if(!matched){
var mons=_team4.team.split(',').map(function(m){return{species:m,moves:[]};});
var newTeam={
name:_team4.name,
format:_team4.format,
folder:'',
packedTeam:Teams.pack(mons),
iconCache:null,
isBox:false,
key:_this3.getKey(_team4.name),
uploaded:{
teamid:_team4.teamid,
notLoaded:true,
"private":_team4["private"]
}
};
_this3.push(newTeam);
}
}
});
};_proto2.


loadTeam=function loadTeam(team,ifNeeded){
if(!(team!=null&&team.uploaded)||team.uploadedPackedTeam)return ifNeeded?undefined:Promise.resolve();
if(team.uploaded.notLoaded&&team.uploaded.notLoaded!==true)return team.uploaded.notLoaded;

var notLoaded=team.uploaded.notLoaded;
return team.uploaded.notLoaded=PSLoginServer.query('getteam',{
teamid:team.uploaded.teamid
}).then(function(data){
if(!team.uploaded)return;
if(!(data!=null&&data.team)){
PS.alert("Failed to load team: "+((data==null?void 0:data.actionerror)||"Error unknown. Try again later."));
return;
}
team.uploaded.notLoaded=false;
team.uploadedPackedTeam=data.team;
if(notLoaded){
team.packedTeam=data.team;
PS.teams.save();
}
});
};_proto2.
compareTeams=function compareTeams(serverTeam,localTeam){






var sanitize=function(name){return(name||"").replace(/\s+\(server version\)/g,'').trim();};
var nameMatches=sanitize(serverTeam.name)===sanitize(localTeam.name);
if(!(nameMatches&&serverTeam.format===localTeam.format)){
return false;
}


var mons=serverTeam.team.split(',').map(toID).sort().join(',');
var otherMons=Teams.unpackSpeciesOnly(localTeam.packedTeam).map(toID).sort().join(',');
if(mons!==otherMons)return'rename';
return true;
};return PSTeams;}(PSStreamModel);var







PSUser=function(_PSStreamModel3){function PSUser(){var _this4;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this4=_PSStreamModel3.call.apply(_PSStreamModel3,[this].concat(args))||this;_this4.
name="";_this4.
group='';_this4.
userid="";_this4.
named=false;_this4.
registered=null;_this4.
avatar="lucas";_this4.
challstr='';_this4.
loggingIn=null;_this4.
initializing=true;_this4.
gapiLoaded=false;_this4.
nameRegExp=null;return _this4;}_inheritsLoose(PSUser,_PSStreamModel3);var _proto3=PSUser.prototype;_proto3.
setName=function setName(fullName,named,avatar){
var loggingIn=!this.named&&named;
var _BattleTextParser$par=BattleTextParser.parseNameParts(fullName),name=_BattleTextParser$par.name,group=_BattleTextParser$par.group;
this.name=name;
this.group=group;
this.userid=toID(name);
this.named=named;
this.avatar=avatar;
this.update(null);
if(loggingIn){
for(var _roomid3 in PS.rooms){
var room=PS.rooms[_roomid3];
if(room.connectWhenLoggedIn)room.connect();
}
}
this.updateRegExp();
};_proto3.
validateName=function validateName(name){

name=name.replace(/[|,;]+/g,'');
var replaceList={
'A':'ＡⱯȺ','B':'ＢƂƁɃ','C':'ＣꜾȻ','D':'ＤĐƋƊƉꝹ','E':'ＥƐƎ','F':'ＦƑꝻ','G':'ＧꞠꝽꝾ','H':'ＨĦⱧⱵꞍ','I':'ＩƗ','J':'ＪɈ','K':'ＫꞢ','L':'ＬꝆꞀ','M':'ＭⱮƜ','N':'ＮȠƝꞐꞤ','O':'ＯǪǬØǾƆƟꝊꝌ','P':'ＰƤⱣꝐꝒꝔ','Q':'ＱꝖꝘɊ','R':'ＲɌⱤꝚꞦꞂ','S':'ＳẞꞨꞄ','T':'ＴŦƬƮȾꞆ','U':'ＵɄ','V':'ＶƲꝞɅ','W':'ＷⱲ','X':'Ｘ','Y':'ＹɎỾ','Z':'ＺƵȤⱿⱫꝢ','a':'ａąⱥɐ','b':'ｂƀƃɓ','c':'ｃȼꜿↄ','d':'ｄđƌɖɗꝺ','e':'ｅɇɛǝ','f':'ｆḟƒꝼ','g':'ｇɠꞡᵹꝿ','h':'ｈħⱨⱶɥ','i':'ｉɨı','j':'ｊɉ','k':'ｋƙⱪꝁꝃꝅꞣ','l':'ｌſłƚɫⱡꝉꞁꝇ','m':'ｍɱɯ','n':'ｎƞɲŉꞑꞥ','o':'ｏǫǭøǿɔꝋꝍɵ','p':'ｐƥᵽꝑꝓꝕ','q':'ｑɋꝗꝙ','r':'ｒɍɽꝛꞧꞃ','s':'ｓꞩꞅẛ','t':'ｔŧƭʈⱦꞇ','u':'ｕưừứữửựųṷṵʉ','v':'ｖʋꝟʌ','w':'ｗⱳ','x':'ｘ','y':'ｙɏỿ','z':'ｚƶȥɀⱬꝣ','AA':'Ꜳ','AE':'ÆǼǢ','AO':'Ꜵ','AU':'Ꜷ','AV':'ꜸꜺ','AY':'Ꜽ','DZ':'ǱǄ','Dz':'ǲǅ','LJ':'Ǉ','Lj':'ǈ','NJ':'Ǌ','Nj':'ǋ','OI':'Ƣ','OO':'Ꝏ','OU':'Ȣ','TZ':'Ꜩ','VY':'Ꝡ','aa':'ꜳ','ae':'æǽǣ','ao':'ꜵ','au':'ꜷ','av':'ꜹꜻ','ay':'ꜽ','dz':'ǳǆ','hv':'ƕ','lj':'ǉ','nj':'ǌ','oi':'ƣ','ou':'ȣ','oo':'ꝏ','ss':'ß','tz':'ꜩ','vy':'ꝡ'
};
var normalizeList={
'A':'ÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄ','B':'ḂḄḆ','C':'ĆĈĊČÇḈƇ','D':'ḊĎḌḐḒḎ','E':'ÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚ','F':'Ḟ','G':'ǴĜḠĞĠǦĢǤƓ','H':'ĤḢḦȞḤḨḪ','I':'ÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬ','J':'Ĵ','K':'ḰǨḲĶḴƘⱩꝀꝂꝄ','L':'ĿĹĽḶḸĻḼḺŁȽⱢⱠꝈ','M':'ḾṀṂ','N':'ǸŃÑṄŇṆŅṊṈ','O':'ÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘ','P':'ṔṖ','Q':'','R':'ŔṘŘȐȒṚṜŖṞ','S':'ŚṤŜṠŠṦṢṨȘŞⱾ','T':'ṪŤṬȚŢṰṮ','U':'ÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴ','V':'ṼṾ','W':'ẀẂŴẆẄẈ','X':'ẊẌ','Y':'ỲÝŶỸȲẎŸỶỴƳ','Z':'ŹẐŻŽẒẔ','a':'ẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁ','b':'ḃḅḇ','c':'ćĉċčçḉƈ','d':'ḋďḍḑḓḏ','e':'èéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛ','f':'','g':'ǵĝḡğġǧģǥ','h':'ĥḣḧȟḥḩḫẖ','i':'ìíîĩīĭïḯỉǐȉȋịįḭ','j':'ĵǰ','k':'ḱǩḳķḵ','l':'ŀĺľḷḹļḽḻ','m':'ḿṁṃ','n':'ǹńñṅňṇņṋṉ','o':'òóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộ','p':'ṕṗ','q':'','r':'ŕṙřȑȓṛṝŗṟ','s':'śṥŝṡšṧṣṩșşȿ','t':'ṫẗťṭțţṱṯ','u':'ùúûũṹūṻŭüǜǘǖǚủůűǔȕȗụṳ','v':'ṽṿ','w':'ẁẃŵẇẅẘẉ','x':'ẋẍ','y':'ỳýŷỹȳẏÿỷẙỵƴ','z':'źẑżžẓẕ'
};
var replaceRegexes=[];
for(var i in replaceList){
replaceRegexes.push([new RegExp('['+replaceList[i]+']','g'),i]);
}
var normalizeRegexes=[];
for(var _i13 in normalizeList){
normalizeRegexes.push([new RegExp('['+normalizeList[_i13]+']','g'),_i13]);
}for(var _i15=0;_i15<

replaceRegexes.length;_i15++){var _ref2=replaceRegexes[_i15];var regex=_ref2[0];var replacement=_ref2[1];
name=name.replace(regex,replacement);
}for(var _i17=0;_i17<
normalizeRegexes.length;_i17++){var _ref3=normalizeRegexes[_i17];var _regex=_ref3[0];var _replacement=_ref3[1];
name=name.replace(_regex,_replacement);
}
return name.trim();
};_proto3.
changeName=function changeName(name){var _this5=this;
name=this.validateName(name);
var userid=toID(name);
if(!userid){
this.updateLogin({name:name,error:"Usernames must contain at least one letter."});
return;
}

if(userid===this.userid){
PS.send("/trn "+name);
this.update({success:true});
return;
}
this.loggingIn=name;
this.update(null);
PSLoginServer.rawQuery(
'getassertion',{userid:userid,challstr:this.challstr}
).then(function(res){
_this5.handleAssertion(name,res);
_this5.updateRegExp();
});
};_proto3.
changeNameWithPassword=function changeNameWithPassword(name,password){var _this6=this;var special=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{needsPassword:true};
this.loggingIn=name;
if(!password&&!special){
this.updateLogin(Object.assign({
name:name,
error:"Password can't be empty."},
special)
);
}
this.update(null);
PSLoginServer.query(
'login',{name:name,pass:password,challstr:this.challstr}
).then(function(data){var _data$curuser;
_this6.loggingIn=null;
if(data!=null&&(_data$curuser=data.curuser)!=null&&_data$curuser.loggedin){

var username=data.curuser.loggedin.username;
_this6.registered={name:username,userid:toID(username)};
_this6.handleAssertion(name,data.assertion);
}else{

if(special.needsGoogle){
try{

gapi.auth2.getAuthInstance().signOut();
}catch(_unused4){}
}
_this6.updateLogin(Object.assign({
name:name,
error:(data==null?void 0:data.error)||'Wrong password.'},
special)
);
}
});
};_proto3.
updateLogin=function updateLogin(update){
this.update(update);
if(!PS.rooms['login']){
PS.join('login',{args:update});
}
};_proto3.
handleAssertion=function handleAssertion(name,assertion){
if(!assertion){
PS.alert("Error logging in.");
return;
}
this.loggingIn=null;
if(assertion.slice(0,14).toLowerCase()==='<!doctype html'){

var endIndex=assertion.indexOf('>');
if(endIndex>0)assertion=assertion.slice(endIndex+1);
}
if(assertion.startsWith('\r'))assertion=assertion.slice(1);
if(assertion.startsWith('\n'))assertion=assertion.slice(1);
if(assertion.includes('<')){
PS.alert("Something is interfering with our connection to the login server. Most likely, your internet provider needs you to re-log-in, or your internet provider is blocking Pokémon Showdown.");
return;
}
if(assertion===';'){
this.updateLogin({name:name,needsPassword:true});
}else if(assertion===';;@gmail'){
this.updateLogin({name:name,needsGoogle:true});
}else if(assertion.startsWith(';;')){
this.updateLogin({error:assertion.slice(2)});
}else if(assertion.includes('\n')||!assertion){
PS.alert("Something is interfering with our connection to the login server.");
}else{
PS.send("/trn "+name+",0,"+assertion);
this.update({success:true});
}
};_proto3.
logOut=function logOut(){var _PS$connection2;
PSLoginServer.query(
'logout',{userid:this.userid}
);
PS.send("/logout");
(_PS$connection2=PS.connection)==null||_PS$connection2.disconnect();

PS.alert("You have been logged out and disconnected.\n\nIf you wanted to change your name while staying connected, use the 'Change Name' button or the '/nick' command.");
this.name="";
this.group='';
this.userid="";
this.named=false;
this.registered=null;
this.update(null);
};_proto3.

updateRegExp=function updateRegExp(){
if(!this.named){
this.nameRegExp=null;
}else{
var escaped=this.name.replace(/[^A-Za-z0-9]+$/,'');


for(var i=escaped.length-1;i>0;i--){
if(/[^ -~]/.test(escaped[i])){
escaped=escaped.slice(0,i)+','+escaped.slice(i+1);
}
}
escaped=escaped.replace(/[[\]/{}()*+?.\\^$|-]/g,"\\$&");
escaped=escaped.replace(/,/g,"[^A-Za-z0-9]?");
this.nameRegExp=new RegExp('(?:\\b|(?!\\w))'+escaped+'(?:\\b|\\B(?!\\w))','i');
}
};return PSUser;}(PSStreamModel);var












PSServer=function(){function PSServer(){this.
id=Config.defaultserver.id;this.
host=Config.defaultserver.host;this.
port=Config.defaultserver.port;this.
httpport=Config.defaultserver.httpport;this.
altport=Config.defaultserver.altport;this.
registered=Config.defaultserver.registered;this.
prefix='/showdown';this.
protocol=Config.defaultserver.httpport?'https':'http';this.
groups={
'#':{
name:"Room Owner (#)",
type:'leadership',
order:101
},
'~':{
name:"Administrator (~)",
type:'leadership',
order:102
},
'&':{
name:"Administrator (&)",
type:'leadership',
order:103
},
"\u2605":{
name:"Host (\u2605)",
type:'staff',
order:104
},
'@':{
name:"Moderator (@)",
type:'staff',
order:105
},
'%':{
name:"Driver (%)",
type:'staff',
order:106
},

'*':{
name:"Bot (*)",
order:109
},
"\u2606":{
name:"Player (\u2606)",
order:110
},
'+':{
name:"Voice (+)",
order:200
},
' ':{
order:201
},
'!':{
name:"Muted (!)",
type:'punishment',
order:301
},
'✖':{
name:"Namelocked (\u2716)",
type:'punishment',
order:302
},
"\u203D":{
name:"Locked (\u203D)",
type:'punishment',
order:303
}
};this.
defaultGroup={
order:108
};}var _proto4=PSServer.prototype;_proto4.
getGroup=function getGroup(symbol){
return this.groups[(symbol||' ').charAt(0)]||this.defaultGroup;
};return PSServer;}();





























































function makeLoadTracker(){
var resolver;
var tracker=new Promise(function(resolve){
resolver=resolve;
});
tracker.loaded=function(){
resolver();
};
return tracker;
}var





PSRoom=function(_PSStreamModel4){





















































function PSRoom(options){var _this7;
_this7=_PSStreamModel4.call(this)||this;_this7.id=void 0;_this7.title="";_this7.type='';_this7.isPlaceholder=false;_this7.classType='';_this7.location='left';_this7.closable=true;_this7.connected=false;_this7.canConnect=false;_this7.connectWhenLoggedIn=false;_this7.onParentEvent=null;_this7.width=0;_this7.height=0;_this7.focusNextUpdate=false;_this7.parentElem=null;_this7.parentRoomid=null;_this7.rightPopup=false;_this7.notifications=[];_this7.isSubtleNotifying=false;_this7.minimized=false;_this7.caughtError=void 0;_this7.noURL=void 0;_this7.args=void 0;_this7.

































































































































































globalClientCommands=_this7.parseClientCommands({
'j,join':function(target,cmd,elem){
target=PS.router.extractRoomID(target)||target;
var roomid=/[^a-z0-9-]/.test(target)?toID(target):target;
PS.join(roomid,{parentElem:elem});
},
'part,leave,close':function(target,cmd,elem){
var roomid=(/[^a-z0-9-]/.test(target)?toID(target):target)||this.id;
var room=PS.rooms[roomid];
var battle=room==null?void 0:room.battle;

if((room==null?void 0:room.type)==="battle"&&!battle.ended&&battle.mySide.id===PS.user.userid&&!battle.isReplay){
PS.join("forfeitbattle",{parentElem:elem});
return;
}
if((room==null?void 0:room.type)==="chat"&&room.connected===true&&PS.prefs.leavePopupRoom&&!target){
PS.join("confirmleaveroom",{parentElem:elem});
return;
}

PS.leave(roomid);
},
'closeand':function(target){


this.send(target);
PS.leave(this.id);
},
'receivepopup':function(target){
PS.alert(target);
},
'inopener,inparent':function(target){

var room=this.getParent();
if(room&&PS.isPopup(room))room=room.getParent();

room.send(target);
},
'maximize':function(target){
var roomid=/[^a-z0-9-]/.test(target)?toID(target):target;
var targetRoom=roomid?PS.rooms[roomid]:this;
if(!targetRoom)return this.errorReply("Room '"+roomid+"' not found.");
if(PS.isNormalRoom(targetRoom)){
this.errorReply("'"+roomid+"' is already maximized.");
}else if(!PS.isPopup(targetRoom)){
PS.moveRoom(targetRoom,'left',false,0);
PS.update();
}else{
this.errorReply("'"+roomid+"' is a popup and can't be maximized.");
}
},
'logout':function(){
PS.user.logOut();
},
'reconnect,connect':function(){var _this8=this;
if(this.connected&&this.connected!=='autoreconnect'){
return this.errorReply("You are already connected.");
}

if(!PS.isOffline){

try{
this.connect();
}catch(err){
this.errorReply(err.message);
}
return;
}


var uptime=Date.now()-PS.startTime;
if(uptime>24*60*60*1000){
PS.confirm("It's been over a day since you first connected. Please refresh.",{
okButton:'Refresh'
}).then(function(confirmed){
if(confirmed)_this8.send("/refresh");
});
return;
}
PSConnection.connect();
},
'refresh':function(){
document.location.reload();
},
'workoffline':function(){var _PS$connection3;
if(PS.isOffline){
return this.add("|error|You are already offline.");
}
(_PS$connection3=PS.connection)==null||_PS$connection3.disconnect();
},
'cancelsearch':function(){
if(PS.mainmenu.cancelSearch()){
this.add("||Search cancelled.",true);
}else{
this.errorReply("You're not currently searching.");
}
},
'disallowspectators':function(target){
PS.prefs.set('disallowspectators',target!=='off');
},
'star':function(target){
var id=toID(target);
if(!window.BattleFormats[id]&&!/^gen[1-9]$/.test(id)){
this.errorReply("Format "+id+" does not exist");
return;
}
var starred=PS.prefs.starredformats||{};
starred[id]=true;
PS.prefs.set('starredformats',starred);
this.add("||Added format "+id+" to favourites");
this.update(null);
},
'unstar':function(target){
var id=toID(target);
if(!window.BattleFormats[id]&&!/^gen[1-9]$/.test(id)){
this.errorReply("Format "+id+" does not exist");
return;
}
var starred=PS.prefs.starredformats||{};
if(!starred[id]){
this.errorReply(id+" is not in your favourites!");
return;
}
delete starred[id];
PS.prefs.set('starredformats',starred);
this.add("||Removed format "+id+" from favourites");
this.update(null);
},
'nick':function(target,cmd,element){
var noNameChange=PS.user.userid===toID(target);
if(!noNameChange)PS.join('login',{parentElem:element});
if(target){
PS.user.changeName(target);
}
},
'avatar':function(target){var _window$BattleAvatarN;
target=target.toLowerCase();
if(/[^a-z0-9-]/.test(target))target=toID(target);
var avatar=((_window$BattleAvatarN=window.BattleAvatarNumbers)==null?void 0:_window$BattleAvatarN[target])||target;
PS.user.avatar=avatar;
if(this.type!=='chat'&&this.type!=='battle'){
PS.send("/avatar "+avatar);
}else{
this.sendDirect("/avatar "+avatar);
}
},
'open,user':function(target){
var roomid="user-"+toID(target);
PS.join(roomid,{
args:{username:target}
});
},
'ignore':function(target){
var ignore=PS.prefs.ignore||{};
if(!target)return true;
if(toID(target)===PS.user.userid){
this.add("||You are not able to ignore yourself.");
}else if(ignore[toID(target)]){
this.add("||User '"+target+"' is already on your ignore list. "+"(Moderator messages will not be ignored.)"
);
}else{
ignore[toID(target)]=1;
this.add("||User '"+target+"' ignored. (Moderator messages will not be ignored.)");
PS.prefs.set("ignore",ignore);
}
},
'unignore':function(target){
var ignore=PS.prefs.ignore||{};
if(!target)return false;
if(!ignore[toID(target)]){
this.add("||User '"+target+"' isn't on your ignore list.");
}else{
ignore[toID(target)]=0;
this.add("||User '"+target+"' no longer ignored.");
PS.prefs.set("ignore",ignore);
}
},
'clearignore':function(target){
if(toID(target)!=='confirm'){
this.add("||Are you sure you want to clear your ignore list?");
this.add('|html|If you\'re sure, use <code>/clearignore confirm</code>');
return false;
}
var ignoreList=PS.prefs.ignore||{};
if(!Object.keys(ignoreList).length)return this.add("You have no ignored users.");
PS.prefs.set('ignore',null);
this.add("||Your ignore list was cleared.");
},
'ignorelist':function(target){
var ignoreList=Object.keys(PS.prefs.ignore||{});
if(ignoreList.length===0){
this.add('||You are currently not ignoring anyone.');
}else{
var ignoring=[];
for(var key in PS.prefs.ignore){
if(PS.prefs.ignore[key]===1)ignoring.push(key);
}
if(!ignoring.length)return this.add('||You are currently not ignoring anyone.');
this.add("||You are currently ignoring: "+ignoring.join(', '));
}
},
'showjoins':function(target){
var showjoins=PS.prefs.showjoins||{};
var serverShowjoins=showjoins[PS.server.id]||{};
if(target){
var room=toID(target);
if(serverShowjoins['global']){
delete serverShowjoins[room];
}else{
serverShowjoins[room]=1;
}
this.add("||Join/leave messages in room "+room+": ALWAYS ON");
}else{
serverShowjoins={global:1};
this.add("||Join/leave messages: ALWAYS ON");
}
showjoins[PS.server.id]=serverShowjoins;
PS.prefs.set("showjoins",showjoins);
},
'hidejoins':function(target){
var showjoins=PS.prefs.showjoins||{};
var serverShowjoins=showjoins[PS.server.id]||{};
if(target){
var room=toID(target);
if(!serverShowjoins['global']){
delete serverShowjoins[room];
}else{
serverShowjoins[room]=0;
}
this.add("||Join/leave messages on room "+room+": OFF");
}else{
serverShowjoins={global:0};
this.add("||Join/leave messages: OFF");
}
showjoins[PS.server.id]=serverShowjoins;
PS.prefs.set('showjoins',showjoins);
},
'showdebug':function(){
PS.prefs.set('showdebug',true);
this.add('||Debug battle messages: ON');
var onCSS='.debug {display: block;}';
var style=document.querySelector('style[id=debugstyle]');
if(style){
style.innerHTML=onCSS;
}else{var _document$querySelect;
style=document.createElement('style');
style.id="debugstyle";
style.innerHTML=onCSS;
(_document$querySelect=document.querySelector('head'))==null||_document$querySelect.append(style);
}
},
'hidedebug':function(){
PS.prefs.set('showdebug',true);
this.add('||Debug battle messages: OFF');
var onCSS='.debug {display: none;}';
var style=document.querySelector('style[id=debugstyle]');
if(style){
style.innerHTML=onCSS;
}else{var _document$querySelect2;
style=document.createElement('style');
style.id="debugstyle";
style.innerHTML=onCSS;
(_document$querySelect2=document.querySelector('head'))==null||_document$querySelect2.append(style);
}
},
'showbattles':function(){
PS.prefs.set('showbattles',true);
this.add('||Battle Messages: ON');
},
'hidebattles':function(){
PS.prefs.set('showbattles',false);
this.add('||Battle Messages: HIDDEN');
},
'afd':function(target){
if(!target)return this.send('/help afd');
var mode=toID(target);
if(mode==='sprites'){
PS.prefs.set('afd','sprites');
PS.prefs.setAFD('sprites');
this.add('||April Fools\' Day mode set to SPRITES.');
}else if(mode==='off'){
PS.prefs.set('afd',null);
PS.prefs.setAFD();
this.add('||April Fools\' Day mode set to OFF temporarily.');
this.add('||Trying to turn it off permanently? Use /afd never');
}else if(mode==='default'){
PS.prefs.setAFD();
PS.prefs.set('afd',null);
this.add('||April Fools\' Day mode set to DEFAULT (Currently '+(Dex.afdMode?'FULL':'OFF')+').');
}else if(mode==='full'){
PS.prefs.set('afd',true);
PS.prefs.setAFD(true);
this.add('||April Fools\' Day mode set to FULL.');
}else if(target==='never'){var _Config$server2;
PS.prefs.set('afd',false);
PS.prefs.setAFD(false);
this.add('||April Fools\' Day mode set to NEVER.');
if((_Config$server2=Config.server)!=null&&_Config$server2.afd){
this.add('||You\'re using the AFD URL, which will still override this setting and enable AFD mode on refresh.');
}
}else{
if(target)this.add('||AFD option "'+target+'" not recognized');
var curMode=PS.prefs.afd;
if(curMode===true)curMode='FULL';
if(curMode===false)curMode='NEVER';
if(curMode)curMode=curMode.toUpperCase();
if(!curMode)curMode='DEFAULT (currently '+(Dex.afdMode?'FULL':'OFF')+')';
this.add('||AFD is currently set to '+mode);
this.send('/help afd');
}
for(var _roomid4 in PS.rooms){
var battle=PS.rooms[_roomid4]&&PS.rooms[_roomid4].battle;
if(!battle)continue;
battle.resetToCurrentTurn();
}
},
'clearpms':function(){
var rooms=PS.miniRoomList.filter(function(roomid){return roomid.startsWith('dm-');});
if(!rooms.length)return this.add('||You do not have any PM windows open.');for(var _i19=0;_i19<
rooms.length;_i19++){var _roomid5=rooms[_i19];
PS.leave(_roomid5);
}
this.add("||All PM windows cleared and closed.");
},
'unpackhidden':function(){
PS.prefs.set('nounlink',true);
this.add('||Locked/banned users\' chat messages: ON');
},
'packhidden':function(){
PS.prefs.set('nounlink',false);
this.add('||Locked/banned users\' chat messages: HIDDEN');
},
'hl,highlight':function(target){
var highlights=PS.prefs.highlights||{};
if(target.includes(' ')){
var targets=target.split(' ');
var subCmd=targets[0];
targets=targets.slice(1).join(' ').match(/([^,]+?({\d*,\d*})?)+/g);

for(var i=0,len=targets.length;i<len;i++){
targets[i]=targets[i].replace(/\n/g,'').trim();
}
switch(subCmd){
case'add':case'roomadd':{
var key=subCmd==='roomadd'?PS.server.id+'#'+this.id:'global';
var highlightList=highlights[key]||[];
for(var _i20=0,_len2=targets.length;_i20<_len2;_i20++){
if(!targets[_i20])continue;
if(/[\\^$*+?()|{}[\]]/.test(targets[_i20])){

try{
new RegExp(targets[_i20]);
}catch(e){
return this.add("|error|"+(e.message.substr(0,28)==='Invalid regular expression: '?e.message:'Invalid regular expression: /'+targets[_i20]+'/: '+e.message));
}
}
if(highlightList.includes(targets[_i20])){
return this.add("|error|"+targets[_i20]+" is already on your highlights list.");
}
}
highlights[key]=highlightList.concat(targets);
this.add("||Now highlighting on "+(key==='global'?"(everywhere): ":"(in "+key+"): ")+" "+highlights[key].join(', '));

ChatRoom.updateHighlightRegExp(highlights);
break;
}
case'delete':case'roomdelete':{
var _key2=subCmd==='roomdelete'?PS.server.id+'#'+this.id:'global';
var _highlightList=highlights[_key2]||[];
var newHls=[];
for(var _i21=0,_len3=_highlightList.length;_i21<_len3;_i21++){
if(!targets.includes(_highlightList[_i21])){
newHls.push(_highlightList[_i21]);
}
}
highlights[_key2]=newHls;
this.add("||Now highlighting on "+(_key2==='global'?"(everywhere): ":"(in "+_key2+"): ")+" "+highlights[_key2].join(', '));

ChatRoom.updateHighlightRegExp(highlights);
break;
}
default:

this.errorReply('Invalid /highlight command.');
this.handleSend('/help highlight');
return;
}
PS.prefs.set('highlights',highlights);
}else{
if(['clear','roomclear','clearall'].includes(target)){
var _key3=target==='roomclear'?PS.server.id+'#'+this.id:target==='clearall'?'':'global';
if(_key3){
highlights[_key3]=[];
this.add("||All highlights ("+(_key3==='global'?"everywhere":"in "+_key3)+") cleared.");
ChatRoom.updateHighlightRegExp(highlights);
}else{
PS.prefs.set('highlights',null);
this.add("||All highlights (in all rooms and globally) cleared.");
ChatRoom.updateHighlightRegExp({});
}
}else if(['show','list','roomshow','roomlist'].includes(target)){

var _key4=target.startsWith('room')?PS.server.id+'#'+this.id:'global';
if(highlights[_key4]&&highlights[_key4].length>0){
this.add("||Current highlight list "+(_key4==='global'?"(everywhere): ":"(in "+_key4+"): ")+highlights[_key4].join(", "));
}else{
this.add("||Your highlight list"+(_key4==='global'?'':' in '+_key4)+" is empty.");
}
}else{

this.errorReply('Invalid /highlight command.');
this.handleSend('/help highlight');
}
}
},
'senddirect':function(target){
this.sendDirect(target);
},
'h,help':function(target){
switch(toID(target)){
case'chal':
case'chall':
case'challenge':
this.add('||/challenge - Open a prompt to challenge a user to a battle.');
this.add('||/challenge [user] - Challenge the user [user] to a battle.');
this.add('||/challenge [user], [format] - Challenge the user [user] to a battle in the specified [format].');
this.add('||/challenge [user], [format] @@@ [rules] - Challenge the user [user] to a battle with custom rules.');
this.add('||[rules] can be a comma-separated list of: [added rule], ![removed rule], -[banned thing], *[restricted thing], +[unbanned/unrestricted thing]');
this.add('||/battlerules - Detailed information on what can go in [rules].');
return;
case'accept':
this.add('||/accept - Accept a challenge if only one is pending.');
this.add('||/accept [user] - Accept a challenge from the specified user.');
return;
case'reject':
this.add('||/reject - Reject a challenge if only one is pending.');
this.add('||/reject [user] - Reject a challenge from the specified user.');
return;
case'user':
case'open':
this.add('||/user [user] - Open a popup containing the user [user]\'s avatar, name, rank, and chatroom list.');
return;
case'news':
this.add('||/news - Opens a popup containing the news.');
return;
case'ignore':
case'unignore':
this.add('||/ignore [user] - Ignore all messages from the user [user].');
this.add('||/unignore [user] - Remove the user [user] from your ignore list.');
this.add('||/ignorelist - List all the users that you currently ignore.');
this.add('||/clearignore - Remove all users on your ignore list.');
this.add('||Note that staff messages cannot be ignored.');
return;
case'nick':
this.add('||/nick [new username] - Change your username.');
return;
case'clear':
this.add('||/clear - Clear the room\'s chat log.');
return;
case'showdebug':
case'hidedebug':
this.add('||/showdebug - Receive debug messages from battle events.');
this.add('||/hidedebug - Ignore debug messages from battle events.');
return;
case'showjoins':
case'hidejoins':
this.add('||/showjoins [room] - Receive users\' join/leave messages. Optionally for only specified room.');
this.add('||/hidejoins [room] - Ignore users\' join/leave messages. Optionally for only specified room.');
return;
case'showbattles':
case'hidebattles':
this.add('||/showbattles - Receive links to new battles in Lobby.');
this.add('||/hidebattles - Ignore links to new battles in Lobby.');
return;
case'unpackhidden':
case'packhidden':
this.add('||/unpackhidden - Suppress hiding locked or banned users\' chat messages after the fact.');
this.add('||/packhidden - Hide locked or banned users\' chat messages after the fact.');
this.add('||Hidden messages from a user can be restored by clicking the button underneath their lock/ban reason.');
return;
case'timestamps':
this.add('||Set your timestamps preference:');
this.add('||/timestamps [all|lobby|pms], [minutes|seconds|off]');
this.add('||all - Change all timestamps preferences, lobby - Change only lobby chat preferences, pms - Change only PM preferences.');
this.add('||off - Set timestamps off, minutes - Show timestamps of the form [hh:mm], seconds - Show timestamps of the form [hh:mm:ss].');
return;
case'highlight':
case'hl':
this.add('||Set up highlights:');
this.add('||/highlight add [word 1], [word 2], [...] - Add the provided list of words to your highlight list.');
this.add('||/highlight roomadd [word 1], [word 2], [...] - Add the provided list of words to the highlight list of whichever room you used the command in.');
this.add('||/highlight list - List all words that currently highlight you.');
this.add('||/highlight roomlist - List all words that currently highlight you in whichever room you used the command in.');
this.add('||/highlight delete [word 1], [word 2], [...] - Delete the provided list of words from your entire highlight list.');
this.add('||/highlight roomdelete [word 1], [word 2], [...] - Delete the provided list of words from the highlight list of whichever room you used the command in.');
this.add('||/highlight clear - Clear your global highlight list.');
this.add('||/highlight roomclear - Clear the highlight list of whichever room you used the command in.');
this.add('||/highlight clearall - Clear your entire highlight list (all rooms and globally).');
return;
case'rank':
case'ranking':
case'rating':
case'ladder':
this.add('||/rating - Get your own rating.');
this.add('||/rating [username] - Get user [username]\'s rating.');
return;
case'afd':
this.add('||/afd full - Enable all April Fools\' Day jokes.');
this.add('||/afd sprites - Enable April Fools\' Day sprites.');
this.add('||/afd default - Set April Fools\' Day to default (full on April 1st, off otherwise).');
this.add('||/afd off - Disable April Fools\' Day jokes until the next refresh, and set /afd default.');
this.add('||/afd never - Disable April Fools\' Day jokes permanently.');
return;
default:
return true;
}
},
'autojoin,cmd,crq,query':function(){
this.errorReply("This is a PS system command; do not use it.");
}
});_this7.
clientCommands=null;_this7.
currentElement=null;_this7.id=options.id;_this7.title=options.title||_this7.title||_this7.id;if(options.type)_this7.type=options.type;if(options.location)_this7.location=options.location;if(options.parentElem)_this7.parentElem=options.parentElem;if(options.parentRoomid)_this7.parentRoomid=options.parentRoomid;if(_this7.location!=='popup'&&_this7.location!=='semimodal-popup')_this7.parentElem=null;if(options.rightPopup)_this7.rightPopup=true;if(options.connected)_this7.connected=options.connected;if(options.backlog)_this7.backlog=options.backlog;_this7.noURL=options.noURL||false;_this7.args=options.args||null;return _this7;}_inheritsLoose(PSRoom,_PSStreamModel4);var _proto5=PSRoom.prototype;_proto5.getParent=function getParent(){if(this.parentRoomid)return PS.rooms[this.parentRoomid]||null;return null;};_proto5.notify=function notify(options){var _this9=this;var desktopNotification=null;var roomIsFocused=(document.hasFocus==null?void 0:document.hasFocus())&&PS.isVisible(this);if(roomIsFocused&&!options.noAutoDismiss)return;if(!roomIsFocused){PS.playNotificationSound();try{desktopNotification=new Notification(options.title,{body:options.body});if(desktopNotification){desktopNotification.onclick=function(){window.focus();PS.focusRoom(_this9.id);};if(PS.prefs.temporarynotifications){setTimeout(function(){var _desktopNotification;(_desktopNotification=desktopNotification)==null||_desktopNotification.close();},5000);}}}catch(_unused5){}}if(options.noAutoDismiss&&!options.id){throw new Error("Must specify id for manual dismissing");}if(options.id){this.notifications=this.notifications.filter(function(notification){return notification.id!==options.id;});}this.notifications.push({title:options.title,body:options.body,id:options.id||'',noAutoDismiss:options.noAutoDismiss||false,notification:desktopNotification});PS.update();};_proto5.subtleNotify=function subtleNotify(){var _PS$prefs$logtimes,_room$lastMessage;if(PS.isVisible(this))return;var room=PS.rooms[this.id];var lastSeenTimestamp=((_PS$prefs$logtimes=PS.prefs.logtimes)==null||(_PS$prefs$logtimes=_PS$prefs$logtimes[PS.server.id])==null?void 0:_PS$prefs$logtimes[this.id])||0;var lastMessageTime=+(((_room$lastMessage=room.lastMessage)==null?void 0:_room$lastMessage[1])||0);if(lastMessageTime-room.timeOffset<=lastSeenTimestamp)return;this.isSubtleNotifying=true;PS.update();};_proto5.dismissNotificationAt=function dismissNotificationAt(i){try{var _this$notifications$i;(_this$notifications$i=this.notifications[i].notification)==null||_this$notifications$i.close();}catch(_unused6){}this.notifications.splice(i,1);};_proto5.dismissNotification=function dismissNotification(id){var index=this.notifications.findIndex(function(n){return n.id===id;});if(index!==-1){this.dismissNotificationAt(index);}PS.update();};_proto5.autoDismissNotifications=function autoDismissNotifications(){var room=PS.rooms[this.id];if(room.lastMessageTime){var lastMessageDates=PS.prefs.logtimes||{};if(!lastMessageDates[PS.server.id])lastMessageDates[PS.server.id]={};lastMessageDates[PS.server.id][room.id]=room.lastMessageTime||0;PS.prefs.set('logtimes',lastMessageDates);}for(var i=this.notifications.length-1;i>=0;i--){if(!this.notifications[i].noAutoDismiss){this.dismissNotificationAt(i);}}this.isSubtleNotifying=false;};_proto5.connect=function connect(){throw new Error("This room is not designed to connect to a server room");};_proto5.handleReconnect=function handleReconnect(msg){};_proto5.receiveLine=function receiveLine(args){switch(args[0]){case'title':{this.title=args[1];PS.update();break;}case'notify':{var title=args[1],body=args[2],toHighlight=args[3];if(toHighlight&&!ChatRoom.getHighlight(toHighlight,this.id))break;this.notify({title:title,body:body});break;}case'tempnotify':{var id=args[1],_title=args[2],_body=args[3],_toHighlight=args[4];if(_toHighlight&&!ChatRoom.getHighlight(_toHighlight,this.id))break;this.notify({title:_title,body:_body,id:id});break;}case'tempnotifyoff':{var _id=args[1];this.dismissNotification(_id);break;}default:{if(this.canConnect){this.update(args);}else{throw new Error("This room is not designed to receive messages");}}}};_proto5.add=function add(line,ifChat){if(this.type!=='chat'&&this.type!=='battle'){if(!ifChat){var _PS$rooms;PS.mainmenu.handlePM(PS.user.userid,PS.user.userid);(_PS$rooms=PS.rooms['dm-'])==null||_PS$rooms.receiveLine(BattleTextParser.parseLine(line));}}else{this.receiveLine(BattleTextParser.parseLine(line));}};_proto5.errorReply=function errorReply(message){var element=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.currentElement;if((element==null?void 0:element.tagName)==='BUTTON'){PS.alert(message,{parentElem:element});}else{this.add("|error|"+message);}};_proto5.parseClientCommands=function parseClientCommands(commands){var parsedCommands={};for(var cmd in commands){var names=cmd.split(',').map(function(name){return name.trim();});for(var _i23=0;_i23<names.length;_i23++){var name=names[_i23];if(name.includes(' '))throw new Error("Client command names cannot contain spaces: "+name);parsedCommands[name]=commands[cmd];}}return parsedCommands;};_proto5.




handleSend=function handleSend(line){var _this$clientCommands;var element=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.currentElement;
if(!line.startsWith('/')||line.startsWith('//'))return line;
var spaceIndex=line.indexOf(' ');
var cmd=spaceIndex>=0?line.slice(1,spaceIndex):line.slice(1);
var target=spaceIndex>=0?line.slice(spaceIndex+1).trim():'';

var cmdHandler=this.globalClientCommands[cmd]||((_this$clientCommands=this.clientCommands)==null?void 0:_this$clientCommands[cmd]);
if(!cmdHandler)return line;

var previousElement=this.currentElement;
this.currentElement=element;
var cmdResult=cmdHandler.call(this,target,cmd,element);
this.currentElement=previousElement;
if(cmdResult===true)return line;
return cmdResult||null;
};_proto5.
send=function send(msg,element){
if(!msg)return;
msg=this.handleSend(msg,element);
if(!msg)return;
this.sendDirect(msg);
};_proto5.
sendDirect=function sendDirect(msg){
if(this.connected==='expired')return this.add("This room has expired (you can't chat in it anymore)");
PS.send(msg,this.id);
};_proto5.
destroy=function destroy(){
if(this.connected===true){
this.sendDirect("/noreply /leave "+this.id);
this.connected=false;
}
};return PSRoom;}(PSStreamModel);var


PlaceholderRoom=function(_PSRoom2){

function PlaceholderRoom(options){var _this10;
_this10=_PSRoom2.call(this,options)||this;_this10.classType='placeholder';
_this10.isPlaceholder=true;return _this10;
}_inheritsLoose(PlaceholderRoom,_PSRoom2);var _proto6=PlaceholderRoom.prototype;_proto6.
receiveLine=function receiveLine(args){
(this.backlog||(this.backlog=[])).push(args);
};return PlaceholderRoom;}(PSRoom);

























var PS=new(function(_PSModel){








































































































































function _class(){var _document$querySelect3;var _this11;
_this11=_PSModel.call(this)||this;_this11.down=false;_this11.prefs=new PSPrefs();_this11.teams=new PSTeams();_this11.user=new PSUser();_this11.server=new PSServer();_this11.connection=null;_this11.isOffline=false;_this11.startTime=Date.now();_this11.router=null;_this11.rooms={};_this11.roomTypes={};_this11.routes=Object.assign(Object.create(null),{"teambuilder":"*","news":"*mini-window","":"*","rooms":"*right","user-*":"*popup","viewuser-*":"*popup","volume":"*popup","options":"*popup","*":"*right","battle-*":"*","battles":"*right","teamdropdown":"*semimodal-popup","formatdropdown":"*semimodal-popup","team-*":"*","ladder":"*","ladder-*":"*","view-*":"*","login":"*semimodal-popup","help-*":"chat"});_this11.leftRoomList=[];_this11.rightRoomList=[];_this11.miniRoomList=[];_this11.popups=[];_this11.room=null;_this11.panel=null;_this11.leftPanel=null;_this11.rightPanel=null;_this11.leftPanelWidth=0;_this11.mainmenu=null;_this11.dragging=null;_this11.lastMessageTime='';_this11.arrowKeysUsed=false;_this11.newsHTML=((_document$querySelect3=document.querySelector('#room-news .readable-bg'))==null?void 0:_document$querySelect3.innerHTML)||'';_this11.libsLoaded=makeLoadTracker();

_this11.mainmenu=_this11.addRoom({
id:'',
title:"Home"
});

_this11.addRoom({
id:'rooms',
title:"Rooms",
autofocus:false
});
_this11.rightPanel=_this11.rooms['rooms'];

if(_this11.newsHTML){
_this11.addRoom({
id:'news',
title:"News",
autofocus:false
});
}


var autojoin=_this11.prefs.autojoin;
if(autojoin){
if(typeof autojoin==='string'){
autojoin={showdown:autojoin};
}
var rooms=autojoin[_this11.server.id]||'';for(var _i25=0,_rooms$split4=
rooms.split(",");_i25<_rooms$split4.length;_i25++){var title=_rooms$split4[_i25];
_this11.addRoom({id:toID(title),title:title,connected:true,autofocus:false});
}
}


if(window.webkitNotification){var _window;
(_window=window).Notification||(_window.Notification=window.webkitNotification);
}

_this11.updateLayout();
window.addEventListener('resize',function(){

if(_this11.updateLayout())_PSModel.prototype.update.call(_this11);
});return _this11;
}_inheritsLoose(_class,_PSModel);var _proto7=_class.prototype;_proto7.



















getWidthFor=function getWidthFor(room){
switch(room.type){
case'mainmenu':
return{
minWidth:340,
width:628,
maxWidth:628,
isMainMenu:true
};
case'chat':
case'rooms':
case'battles':
return{
minWidth:320,
width:570,
maxWidth:640
};
case'teambuilder':
return{
minWidth:850,
width:850,
maxWidth:850
};
case'team':
return{
minWidth:1050,
width:1050,
maxWidth:1050
};
case'battle':
return{
minWidth:320,
width:956,
maxWidth:1180
};
}
return{
minWidth:640,
width:640,
maxWidth:640
};
};_proto7.

updateLayout=function updateLayout(){
var leftPanelWidth=this.calculateLeftPanelWidth();
var totalWidth=document.body.offsetWidth;
var totalHeight=document.body.offsetHeight;
var roomHeight=totalHeight-56;
if(leftPanelWidth===null){
this.panel.width=totalWidth-200;
this.panel.height=totalHeight;
}else if(leftPanelWidth){
this.leftPanel.width=leftPanelWidth;
this.leftPanel.height=roomHeight;
this.rightPanel.width=totalWidth+1-leftPanelWidth;
this.rightPanel.height=roomHeight;
}else{
this.panel.width=totalWidth;
this.panel.height=roomHeight;
}

if(this.leftPanelWidth!==leftPanelWidth){
this.leftPanelWidth=leftPanelWidth;
return true;
}
return false;
};_proto7.
getRoom=function getRoom(elem,skipClickable){var _curElem;
var curElem=elem;

if(((_curElem=curElem)==null?void 0:_curElem.name)==='closeRoom'&&curElem.value){
return PS.rooms[curElem.value]||null;
}
while(curElem){var _curElem$classList,_curElem$classList2;
if(curElem.id.startsWith('room-')){
return PS.rooms[curElem.id.slice(5)]||null;
}
if(curElem.getAttribute('data-roomid')){
return PS.rooms[curElem.getAttribute('data-roomid')]||null;
}
if(skipClickable&&(
curElem.tagName==='A'||curElem.tagName==='BUTTON'||curElem.tagName==='INPUT'||
curElem.tagName==='SELECT'||curElem.tagName==='TEXTAREA'||curElem.tagName==='LABEL'||(_curElem$classList=
curElem.classList)!=null&&_curElem$classList.contains('textbox')||(_curElem$classList2=curElem.classList)!=null&&_curElem$classList2.contains('username')))
{
return null;
}
curElem=curElem.parentElement;
}
return null;
};_proto7.
dragOnto=function dragOnto(fromRoom,toLocation,toIndex){

if(fromRoom.id===''||fromRoom.id==='rooms')return;

var onHome=toLocation==='left'&&toIndex===0;

PS.moveRoom(fromRoom,toLocation,onHome,toIndex);
PS.update();
};_proto7.
update=function update(){
this.updateLayout();
_PSModel.prototype.update.call(this);
};_proto7.
receive=function receive(msg){var _room2;
msg=msg.endsWith('\n')?msg.slice(0,-1):msg;
var roomid='';
if(msg.startsWith('>')){
var nlIndex=msg.indexOf('\n');
roomid=msg.slice(1,nlIndex);
msg=msg.slice(nlIndex+1);
}
var roomid2=roomid||'lobby';
var room=PS.rooms[roomid];
console.log("\u2705 "+(roomid?'['+roomid+'] ':'')+'%c'+msg,"color: #007700");
var isInit=false;for(var _i27=0,_msg$split2=
msg.split('\n');_i27<_msg$split2.length;_i27++){var _room;var line=_msg$split2[_i27];
var args=BattleTextParser.parseLine(line);
switch(args[0]){
case'init':{
isInit=true;
room=PS.rooms[roomid2];
var type=args[1];
if(!room){
room=this.addRoom({
id:roomid2,
type:type,
connected:true,
autofocus:roomid!=='staff'&&roomid!=='upperstaff',


autoclosePopups:false
});
}else{
room.type=type;
this.updateRoomTypes();
}
if(room){
if(room.connected==='autoreconnect'){
room.connected=true;
if(room.handleReconnect(msg))return;
}
room.connected=true;
}
this.updateAutojoin();
this.update();
continue;
}case'deinit':{
room=PS.rooms[roomid2];
if(room&&room.connected!=='expired'){
room.connected=false;
this.removeRoom(room);
}
this.updateAutojoin();
this.update();
continue;
}case'noinit':{
room=PS.rooms[roomid2];
if(room){
room.connected=false;
if(args[1]==='namerequired'){
room.connectWhenLoggedIn=true;
if(!PS.user.initializing){
room.receiveLine(['error',args[2]]);
}
}else if(args[1]==='nonexistent'){


if(room.type==='chat'||room.type==='battle')room.receiveLine(args);
}else if(args[1]==='rename'){
room.connected=true;
room.title=args[3]||room.title;
this.renameRoom(room,args[2]);
}
}
this.update();
continue;
}

}
(_room=room)==null||_room.receiveLine(args);
}
(_room2=room)==null||_room2.update(isInit?["initdone"]:null);
};_proto7.
send=function send(msg,roomid){
var bracketRoomid=roomid?"["+roomid+"] ":'';
console.log("\u25B6\uFE0F "+bracketRoomid+"%c"+msg,"color: #776677");
if(!this.connection){
PS.alert("You are not connected and cannot send "+msg+".");
return;
}
this.connection.send((roomid||'')+"|"+msg);
};_proto7.
isVisible=function isVisible(room){
if(!this.leftPanelWidth){

return room===this.panel||room===this.room;
}else{

return room===this.rightPanel||room===this.leftPanel||room===this.room;
}
};_proto7.
calculateLeftPanelWidth=function calculateLeftPanelWidth(){
var available=document.body.offsetWidth;
if(document.documentElement.clientWidth<800||this.prefs.onepanel==='vertical'){
return null;
}


if(!this.leftPanel||!this.rightPanel||this.prefs.onepanel){
return 0;
}




var left=this.getWidthFor(this.leftPanel);
var right=this.getWidthFor(this.rightPanel);

var excess=available-(left.width+right.width);
if(excess>=0){

var leftStretch=left.maxWidth-left.width;
if(!leftStretch)return left.width;
var rightStretch=right.maxWidth-right.width;
if(leftStretch+rightStretch>=excess)return left.maxWidth;

return left.width+Math.floor(excess*leftStretch/(leftStretch+rightStretch));
}

if(left.isMainMenu){
if(available>=left.minWidth+right.width){
return left.minWidth;
}
return 0;
}

if(available>=left.width+right.minWidth){
return left.width;
}
return 0;
};_proto7.
createRoom=function createRoom(options){var _options$noURL;
options.location||(options.location=this.getRouteLocation(options.id));
options.type||(options.type=this.getRoute(options.id)||'');
var RoomType=this.roomTypes[options.type];
(_options$noURL=options.noURL)!=null?_options$noURL:options.noURL=RoomType==null?void 0:RoomType.noURL;
if(RoomType!=null&&RoomType.title)options.title=RoomType.title;
var Model=RoomType?RoomType.Model||PSRoom:PlaceholderRoom;
return new Model(options);
};_proto7.
getRouteInfo=function getRouteInfo(roomid){
if(this.routes[roomid])return this.routes[roomid];
var hyphenIndex=roomid.indexOf('-');
if(hyphenIndex<0)return this.routes['*']||null;
roomid=roomid.slice(0,hyphenIndex)+'-*';
if(this.routes[roomid])return this.routes[roomid];
return null;
};_proto7.
getRouteLocation=function getRouteLocation(roomid){

if(roomid.startsWith('dm-')){
if(document.documentElement.clientWidth<=818){
return'left';
}
return'mini-window';
}
var routeInfo=this.getRouteInfo(roomid);
if(!routeInfo)return'left';
if(routeInfo.startsWith('*'))return routeInfo.slice(1);
return PS.roomTypes[routeInfo].location||'left';
};_proto7.
getRoute=function getRoute(roomid){
var routeInfo=this.getRouteInfo(roomid);
return routeInfo!=null&&routeInfo.startsWith('*')?null:routeInfo||null;
};_proto7.
addRoomType=function addRoomType(){for(var _len4=arguments.length,types=new Array(_len4),_key5=0;_key5<_len4;_key5++){types[_key5]=arguments[_key5];}for(var _i29=0;_i29<
types.length;_i29++){var RoomType=types[_i29];
this.roomTypes[RoomType.id]=RoomType;for(var _i31=0,_RoomType$routes2=
RoomType.routes;_i31<_RoomType$routes2.length;_i31++){var route=_RoomType$routes2[_i31];
this.routes[route]=RoomType.id;
}
}
this.updateRoomTypes();
};_proto7.
updateRoomTypes=function updateRoomTypes(){
var updated=false;
for(var _roomid6 in this.rooms){
var room=this.rooms[_roomid6];
var typeIsGuessed=room.type===this.routes['*']&&!_roomid6.includes('-');
if(!room.isPlaceholder&&!typeIsGuessed)continue;

var type=!typeIsGuessed&&room.type||this.getRoute(_roomid6)||room.type||'';
if(!room.isPlaceholder&&type===room.type)continue;

var RoomType=type&&this.roomTypes[type];
if(!RoomType)continue;

var options=room;
if(RoomType.title)options.title=RoomType.title;
options.type=type;
var Model=RoomType.Model||PSRoom;
var newRoom=new Model(options);
this.rooms[_roomid6]=newRoom;
if(this.leftPanel===room)this.leftPanel=newRoom;
if(this.rightPanel===room)this.rightPanel=newRoom;
if(this.panel===room)this.panel=newRoom;
if(_roomid6==='')this.mainmenu=newRoom;
if(this.room===room){
this.room=newRoom;
newRoom.focusNextUpdate=true;
}

updated=true;
}
if(updated)this.update();
};_proto7.
setFocus=function setFocus(room){
room.onParentEvent==null||room.onParentEvent('focus');
};_proto7.
focusRoom=function focusRoom(roomid){
var room=this.rooms[roomid];
if(!room)return false;
if(this.room===room){
this.setFocus(room);
return true;
}
this.closePopupsAbove(room,true);
if(!this.isVisible(room)){
room.focusNextUpdate=true;
}
if(PS.isNormalRoom(room)){
if(room.location==='right'){
this.rightPanel=room;
}else{
this.leftPanel=room;
}
this.panel=this.room=room;
}else{
if(room.location==='mini-window'){
this.leftPanel=this.panel=PS.mainmenu;
}
this.room=room;
}
this.room.autoDismissNotifications();
this.update();
this.setFocus(room);
return true;
};_proto7.
horizontalNav=function horizontalNav(){var room=arguments.length>0&&arguments[0]!==undefined?arguments[0]:this.room;
if(this.leftPanelWidth===null){
return{rooms:[],index:-1};
}
var rooms=this.leftRoomList.concat(this.rightRoomList);
var miniRoom=this.miniRoomList[0]!=='news'?this.miniRoomList[0]:null;
if(miniRoom)rooms.splice(1,0,miniRoom);
var roomid=room.location==='mini-window'&&miniRoom||room.id;

var index=rooms.indexOf(roomid);

return{rooms:rooms,index:index};
};_proto7.
verticalNav=function verticalNav(){var room=arguments.length>0&&arguments[0]!==undefined?arguments[0]:this.room;
if(this.leftPanelWidth===null){
var _rooms=[''].concat(this.miniRoomList,this.leftRoomList.slice(1),this.rightRoomList);
var _index=_rooms.indexOf(room.id);
return{rooms:_rooms,index:_index};
}
if(room.location!=='mini-window'){
return{rooms:[],index:-1};
}
var rooms=this.miniRoomList;
var index=rooms.indexOf(room.id);

return{rooms:rooms,index:index};
};_proto7.
focusLeftRoom=function focusLeftRoom(){
var _this$horizontalNav=this.horizontalNav(),rooms=_this$horizontalNav.rooms,index=_this$horizontalNav.index;
if(index===-1)return;

if(index===0){
return this.focusRoom(rooms[rooms.length-1]);
}
return this.focusRoom(rooms[index-1]);
};_proto7.
focusRightRoom=function focusRightRoom(){
var _this$horizontalNav2=this.horizontalNav(),rooms=_this$horizontalNav2.rooms,index=_this$horizontalNav2.index;
if(index===-1)return;

if(index===rooms.length-1){
return this.focusRoom(rooms[0]);
}
return this.focusRoom(rooms[index+1]);
};_proto7.
focusUpRoom=function focusUpRoom(){
var _this$verticalNav=this.verticalNav(),rooms=_this$verticalNav.rooms,index=_this$verticalNav.index;
if(index===-1)return;

if(index===0){
return this.focusRoom(rooms[rooms.length-1]);
}
return this.focusRoom(rooms[index-1]);
};_proto7.
focusDownRoom=function focusDownRoom(){
var _this$verticalNav2=this.verticalNav(),rooms=_this$verticalNav2.rooms,index=_this$verticalNav2.index;
if(index===-1)return;

if(index===rooms.length-1){
return this.focusRoom(rooms[0]);
}
return this.focusRoom(rooms[index+1]);
};_proto7.
alert=function alert(message){var opts=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};
this.join("popup-"+this.popups.length,{
args:Object.assign({message:message},opts,{parentElem:null}),
parentElem:opts.parentElem
});
};_proto7.
confirm=function confirm(message)


{var _opts$cancelButton,_this12=this;var opts=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};
(_opts$cancelButton=opts.cancelButton)!=null?_opts$cancelButton:opts.cancelButton='Cancel';
return new Promise(function(resolve){
_this12.join("popup-"+_this12.popups.length,{
args:Object.assign({message:message,okValue:true,cancelValue:false,callback:resolve},opts,{parentElem:null}),
parentElem:opts.parentElem
});
});
};_proto7.
prompt=function prompt(message)


{var _opts$cancelButton2,_this13=this;var opts=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};
(_opts$cancelButton2=opts.cancelButton)!=null?_opts$cancelButton2:opts.cancelButton='Cancel';
return new Promise(function(resolve){
_this13.join("popup-"+_this13.popups.length,{
args:Object.assign({
message:message,value:opts.defaultValue||'',
okValue:true,cancelValue:false,callback:resolve},opts,{parentElem:null}),

parentElem:opts.parentElem
});
});
};_proto7.
getPMRoom=function getPMRoom(userid){
var myUserid=PS.user.userid;
var roomid="dm-"+[userid,myUserid].sort().join('-');
if(this.rooms[roomid])return this.rooms[roomid];
this.join(roomid);
return this.rooms[roomid];
};_proto7.








addRoom=function addRoom(options){var _options$autofocus,_options$autoclosePop,_options$parentRoomid,_this$getRoom;
(_options$autofocus=options.autofocus)!=null?_options$autofocus:options.autofocus=true;
(_options$autoclosePop=options.autoclosePopups)!=null?_options$autoclosePop:options.autoclosePopups=options.autofocus;

if(options.id.startsWith('challenge-')){
this.requestNotifications();
options.id="dm-"+options.id.slice(10);
options.args={challengeMenuOpen:true};
}
if(options.id.startsWith('dm-')){
this.requestNotifications();
if(options.id.length>=5&&options.id.endsWith('--')){
options.id=options.id.slice(0,-2);
options.args={initialSlash:true};
}
}
if(options.id.startsWith('battle-')&&PS.prefs.rightpanelbattles)options.location='right';
(_options$parentRoomid=options.parentRoomid)!=null?_options$parentRoomid:options.parentRoomid=(_this$getRoom=this.getRoom(options.parentElem))==null?void 0:_this$getRoom.id;
var parentRoom=options.parentRoomid?this.rooms[options.parentRoomid]:null;
var preexistingRoom=this.rooms[options.id];
if(preexistingRoom&&this.isPopup(preexistingRoom)){
var sameOpener=preexistingRoom.parentElem===options.parentElem;
this.closePopupsAbove(parentRoom,true);
if(sameOpener)return;
preexistingRoom=this.rooms[options.id];
}
if(preexistingRoom){
if(options.autofocus){var _options$args;
if((_options$args=options.args)!=null&&_options$args.challengeMenuOpen){
preexistingRoom.openChallenge();
}
this.focusRoom(preexistingRoom.id);
}
return preexistingRoom;
}
if(options.autoclosePopups){var _options$parentElem;
var parentPopup=parentRoom;
if(((_options$parentElem=options.parentElem)==null?void 0:_options$parentElem.name)==='closeRoom'){





parentPopup=PS.rooms['roomtablist']||parentPopup;
}
this.closePopupsAbove(parentPopup,true);
}
var room=this.createRoom(options);
this.rooms[room.id]=room;
var location=room.location;
room.location=null;
this.moveRoom(room,location,!options.autofocus);
if(options.backlog){for(var _i33=0,_options$backlog2=
options.backlog;_i33<_options$backlog2.length;_i33++){var args=_options$backlog2[_i33];
room.receiveLine(args);
}
}
if(options.autofocus)room.focusNextUpdate=true;
return room;
};_proto7.
hideRightRoom=function hideRightRoom(){
if(PS.rightPanel){
if(PS.panel===PS.rightPanel)PS.panel=PS.leftPanel;
if(PS.room===PS.rightPanel)PS.room=PS.leftPanel;
PS.rightPanel=null;
PS.update();
PS.focusRoom(PS.leftPanel.id);
}
};_proto7.
roomVisible=function roomVisible(room){
if(PS.isNormalRoom(room)){
return!this.leftPanelWidth?room===this.panel:room===this.leftPanel||room===this.rightPanel;
}
if(room.location==='mini-window'){
return!this.leftPanelWidth?this.mainmenu===this.panel:this.mainmenu===this.leftPanel;
}

return true;
};_proto7.
renameRoom=function renameRoom(room,id){

if(this.rooms[id])this.removeRoom(this.rooms[id]);

var oldid=room.id;
room.id=id;
this.rooms[id]=room;
delete this.rooms[oldid];

var popupIndex=this.popups.indexOf(oldid);
if(popupIndex>=0)this.popups[popupIndex]=id;
var leftRoomIndex=this.leftRoomList.indexOf(oldid);
if(leftRoomIndex>=0)this.leftRoomList[leftRoomIndex]=id;
var rightRoomIndex=this.rightRoomList.indexOf(oldid);
if(rightRoomIndex>=0)this.rightRoomList[rightRoomIndex]=id;
var miniRoomIndex=this.miniRoomList.indexOf(oldid);
if(miniRoomIndex>=0)this.miniRoomList[miniRoomIndex]=id;

this.update();
};_proto7.
isPopup=function isPopup(room){
if(!room)return false;
return room.location==='popup'||room.location==='semimodal-popup'||room.location==='modal-popup';
};_proto7.
isNormalRoom=function isNormalRoom(room){
if(!room)return false;
return room.location==='left'||room.location==='right';
};_proto7.
moveRoom=function moveRoom(room,location,background,index){
if(room.location===location&&index===undefined){
if(background===true){
if(room===this.leftPanel){
this.leftPanel=this.mainmenu;
this.panel=this.mainmenu;
}else if(room===this.rightPanel){
this.rightPanel=this.rooms['rooms']||null;
this.panel=this.rightPanel||this.leftPanel;
}
}else if(background===false){
this.focusRoom(room.id);
}
return;
}
var POPUPS=['popup','semimodal-popup','modal-popup'];
if(this.isPopup(room)&&POPUPS.includes(location)){
room.location=location;
return;
}

background!=null?background:background=!this.roomVisible(room);

if(room.location==='mini-window'){
var miniRoomIndex=this.miniRoomList.indexOf(room.id);
if(miniRoomIndex>=0){
this.miniRoomList.splice(miniRoomIndex,1);
}
if(this.room===room)this.room=this.panel;
}else if(POPUPS.includes(room.location)){
var popupIndex=this.popups.indexOf(room.id);
if(popupIndex>=0){
this.popups.splice(popupIndex,1);
}
if(this.room===room)this.room=this.panel;
}else if(room.location==='left'){
var leftRoomIndex=this.leftRoomList.indexOf(room.id);
if(leftRoomIndex>=0){
this.leftRoomList.splice(leftRoomIndex,1);
}
if(this.room===room)this.room=this.mainmenu;
if(this.panel===room)this.panel=this.mainmenu;
if(this.leftPanel===room)this.leftPanel=this.mainmenu;
}else if(room.location==='right'){
var rightRoomIndex=this.rightRoomList.indexOf(room.id);
if(rightRoomIndex>=0){
this.rightRoomList.splice(rightRoomIndex,1);
}
if(this.room===room)this.room=this.rooms['rooms']||this.leftPanel;
if(this.panel===room)this.panel=this.rooms['rooms']||this.leftPanel;
if(this.rightPanel===room)this.rightPanel=this.rooms['rooms']||null;
}

room.location=location;
switch(location){
case'left':
this.leftRoomList.splice(Math.max(index!=null?index:Infinity,1),0,room.id);
break;
case'right':
this.rightRoomList.splice(Math.min(index!=null?index:-1,this.rightRoomList.length-1),0,room.id);
break;
case'mini-window':
this.miniRoomList.splice(index!=null?index:0,0,room.id);
break;
case'popup':
case'semimodal-popup':
case'modal-popup':

this.popups.push(room.id);
this.room=room;
break;
default:
throw new Error("Invalid room location: "+location);
}
if(!background){
if(location==='left')this.leftPanel=this.panel=room;
if(location==='right')this.rightPanel=this.panel=room;
if(location==='mini-window')this.leftPanel=this.panel=this.mainmenu;
this.room=room;
}
};_proto7.
removeRoom=function removeRoom(room){
var wasFocused=this.room===room;
room.destroy();
delete PS.rooms[room.id];

var leftRoomIndex=PS.leftRoomList.indexOf(room.id);
if(leftRoomIndex>=0){
PS.leftRoomList.splice(leftRoomIndex,1);
}
if(PS.leftPanel===room){
PS.leftPanel=this.mainmenu;
if(PS.panel===room)PS.panel=this.mainmenu;
if(PS.room===room)PS.room=this.mainmenu;
}

var rightRoomIndex=PS.rightRoomList.indexOf(room.id);
if(rightRoomIndex>=0){
PS.rightRoomList.splice(rightRoomIndex,1);
}
if(PS.rightPanel===room){
var newRightRoomid=PS.rightRoomList[rightRoomIndex]||PS.rightRoomList[rightRoomIndex-1];
PS.rightPanel=newRightRoomid?PS.rooms[newRightRoomid]:null;
if(PS.panel===room)PS.panel=PS.rightPanel||PS.leftPanel;
if(PS.room===room)PS.room=PS.panel;
}

if(room.location==='mini-window'){
var miniRoomIndex=PS.miniRoomList.indexOf(room.id);
if(miniRoomIndex>=0){
PS.miniRoomList.splice(miniRoomIndex,1);
}
if(PS.room===room){
PS.room=PS.rooms[PS.miniRoomList[miniRoomIndex]]||PS.rooms[PS.miniRoomList[miniRoomIndex-1]]||PS.mainmenu;
}
}

if(this.popups.length&&room.id===this.popups[this.popups.length-1]){
this.popups.pop();
if(this.popups.length){

PS.room=PS.rooms[this.popups[this.popups.length-1]];
}else{var _room$parentRoomid;

PS.room=PS.rooms[(_room$parentRoomid=room.parentRoomid)!=null?_room$parentRoomid:PS.panel.id]||PS.panel;

if(PS.room.location!=='mini-window'||PS.panel!==PS.mainmenu)PS.room=PS.panel;
}
}

if(wasFocused){
this.room.focusNextUpdate=true;
}
};_proto7.

closePopup=function closePopup(skipUpdate){
if(!this.popups.length)return;
this.leave(this.popups[this.popups.length-1]);
if(!skipUpdate)this.update();
};_proto7.
closeAllPopups=function closeAllPopups(skipUpdate){
this.closePopupsAbove(null,skipUpdate);
};_proto7.
closePopupsAbove=function closePopupsAbove(room,skipUpdate){
if(!this.popups.length)return;



for(var i=this.popups.length-1;i>=0;i--){
if(room&&this.popups[i]===room.id)break;
this.removeRoom(PS.rooms[this.popups[i]]);
}
if(!skipUpdate)this.update();
};_proto7.

join=function join(roomid,options){

if(PS.rooms[roomid]&&!PS.isPopup(PS.rooms[roomid])){
if(this.room.id===roomid)return;
this.focusRoom(roomid);
return;
}
this.addRoom(Object.assign({id:roomid},options));
this.update();
};_proto7.
leave=function leave(roomid){
if(!roomid||roomid==='rooms')return;
var room=PS.rooms[roomid];
if(room){
this.removeRoom(room);
this.update();
}
};_proto7.

updateAutojoin=function updateAutojoin(){
if(!PS.server.registered)return;
var autojoins=[];
var autojoinCount=0;
var rooms=this.rightRoomList;for(var _i35=0;_i35<
rooms.length;_i35++){var _roomid7=rooms[_i35];
var room=PS.rooms[_roomid7];
if(!room)return;
if(room.type!=='chat'||room.pmTarget)continue;
autojoins.push(room.id.includes('-')?room.id:room.title||room.id);
if(room.id==='staff'||room.id==='upperstaff'||PS.server.id!=='showdown'&&room.id==='lobby')continue;
autojoinCount++;
if(autojoinCount>=15)break;
}

var thisAutojoin=autojoins.join(',')||null;
var autojoin=this.prefs.autojoin||null;
if(this.server.id==='showdown'&&typeof autojoin!=='object'){

if(autojoin===thisAutojoin)return;

this.prefs.set('autojoin',thisAutojoin||null);
}else{

autojoin=typeof autojoin==='string'?{showdown:autojoin}:autojoin||{};
if(autojoin[this.server.id]===thisAutojoin)return;

autojoin[this.server.id]=thisAutojoin||'';
this.prefs.set('autojoin',autojoin);
}
};_proto7.
requestNotifications=function requestNotifications(){
try{var _window$webkitNotific;
if((_window$webkitNotific=window.webkitNotifications)!=null&&_window$webkitNotific.requestPermission){





window.webkitNotifications.requestPermission();
}else if(window.Notification){
Notification.requestPermission==null||Notification.requestPermission(function(permission){});
}
}catch(_unused7){}
};_proto7.
playNotificationSound=function playNotificationSound(){
if(window.BattleSound&&!this.prefs.mute){
window.BattleSound.playSound('audio/notification.wav',this.prefs.notifvolume);
}
};return _class;}(PSModel))(
);
//# sourceMappingURL=client-main.js.map