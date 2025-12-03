"use strict";var _templateObject,_templateObject2,_templateObject3,_templateObject4,_templateObject5,_templateObject6,_templateObject7,_templateObject8,_templateObject9;function _taggedTemplateLiteralLoose(e,t){return t||(t=e.slice(0)),e.raw=t,e;}function _inheritsLoose(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,_setPrototypeOf(t,o);}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t;},_setPrototypeOf(t,e);}var


































































ChatTournament=function(_PSModel){






function ChatTournament(room){var _this;
_this=_PSModel.call(this)||this;_this.info={};_this.updates={};_this.room=void 0;_this.boxVisible=false;_this.selectedChallenge=0;_this.joinLeave=null;
_this.room=room;return _this;
}_inheritsLoose(ChatTournament,_PSModel);var _proto=ChatTournament.prototype;_proto.
tryAdd=function tryAdd(line){
if(PS.prefs.tournaments==='hide')return false;
this.room.add(line);
return true;
};ChatTournament.
arrayToPhrase=function arrayToPhrase(array){var finalSeparator=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'and';
if(array.length<=1)
return array.join();
return array.slice(0,-1).join(", ")+" "+finalSeparator+" "+array.slice(-1)[0];
};_proto.
handleJoinLeave=function handleJoinLeave(action,name){
this.joinLeave||(this.joinLeave={
join:[],
leave:[],
messageId:"joinleave-"+Date.now()
});
if(action==='join'&&this.joinLeave['leave'].includes(name)){
this.joinLeave['leave'].splice(this.joinLeave['leave'].indexOf(name),1);
}else if(action==='leave'&&this.joinLeave['join'].includes(name)){
this.joinLeave['join'].splice(this.joinLeave['join'].indexOf(name),1);
}else{
this.joinLeave[action].push(name);
}
if(!this.joinLeave[action].includes(name))this.joinLeave[action].push(name);
var message=this.joinLeave['join'].length?
ChatTournament.arrayToPhrase(this.joinLeave['join'])+' joined the tournament':
'';
if(this.joinLeave['join'].length&&this.joinLeave['leave'].length)message+='; ';
message+=this.joinLeave['leave'].length?
ChatTournament.arrayToPhrase(this.joinLeave['leave'])+' left the tournament':
'';

this.tryAdd("|uhtml|"+this.joinLeave.messageId+"|<div class=\"tournament-message-joinleave\">"+message+".</div>");
};_proto.
tournamentName=function tournamentName(){
if(!this.info.format||!this.info.generator)return"";
var formatName=BattleLog.formatName(this.info.format);
var type=this.info.generator;
return formatName+" "+type+" Tournament";
};_proto.
receiveLine=function receiveLine(args){var _this$info$teambuilde,_this2=this;
var data=args.slice(2);
var notify=PS.prefs.tournaments==='notify'||!PS.prefs.tournaments&&this.info.isJoined;
var cmd=args[1].toLowerCase();
if(args[0]==='tournaments'){
switch(cmd){
case'info':
var tournaments=JSON.parse(data.join('|'));
var buf="<div class=\"infobox tournaments-info\">";
if(tournaments.length<=0){
buf+="No tournaments are currently running.";
}else{
buf+="<ul>";for(var _i2=0;_i2<
tournaments.length;_i2++){var tournament=tournaments[_i2];
var formatName=BattleLog.formatName(tournament.format);
buf+="<li>";
buf+=BattleLog.html(_templateObject||(_templateObject=_taggedTemplateLiteralLoose(["<a class=\"ilink\" href=\"","\">","</a>"])),toRoomid(tournament.room),tournament.room);
buf+=BattleLog.html(_templateObject2||(_templateObject2=_taggedTemplateLiteralLoose([": "," ","",""])),formatName,tournament.generator,tournament.isStarted?" (Started)":"");
buf+="</li>";
}
buf+="</ul>";
}
buf+='</div>';
this.tryAdd("|html|"+buf);
break;

default:
return true;
}
}else if(args[0]==='tournament'){
switch(cmd){
case'create':{
this.info.format=args[2];
this.info.generator=args[3];
var _formatName=BattleLog.formatName(args[2]);
var type=args[3];
var _buf=BattleLog.html(_templateObject3||(_templateObject3=_taggedTemplateLiteralLoose(["<div class=\"tournament-message-create\">"," created.</div>"])),this.tournamentName());
if(!this.tryAdd("|html|"+_buf)){
var hiddenBuf=BattleLog.html(_templateObject4||(_templateObject4=_taggedTemplateLiteralLoose(["<div class=\"tournament-message-create\">"," created (and hidden).</div>"])),this.tournamentName());
this.room.add("|html|"+hiddenBuf);
}
if(notify){
this.room.notify({
title:"Tournament created",
body:"Room: "+this.room.title+"\nFormat: "+_formatName+"\nType: "+type,
id:'tournament-create'
});
}
break;
}

case'join':
case'leave':{
this.handleJoinLeave(cmd,args[2]);
break;
}

case'replace':{
this.tryAdd("||"+args[3]+" has joined the tournament, replacing "+args[4]+".");
break;
}

case'start':
this.room.dismissNotification('tournament-create');
if(!this.info.isJoined){
this.boxVisible=false;
}else if((_this$info$teambuilde=this.info.teambuilderFormat)!=null&&_this$info$teambuilde.startsWith('gen5')&&!Dex.loadedSpriteData['bw']){
Dex.loadSpriteData('bw');
}
var participants=data[0]?" ("+data[0]+" players)":"";
this.room.add("|html|<div class=\"tournament-message-start\">The tournament has started!"+participants+"</div>");
break;

case'disqualify':
this.tryAdd(BattleLog.html(_templateObject5||(_templateObject5=_taggedTemplateLiteralLoose(["|html|<div class=\"tournament-message-disqualify\">"," has been disqualified from the tournament.</div>"])),data[0]));
break;

case'autodq':
if(data[0]==='off'){
this.tryAdd("|html|<div class=\"tournament-message-autodq-off\">The tournament's automatic disqualify timer has been turned off.</div>");
}else if(data[0]==='on'){
var minutes=Math.round(parseInt(data[1])/1000/60);
this.tryAdd(BattleLog.html(_templateObject6||(_templateObject6=_taggedTemplateLiteralLoose(["|html|<div class=\"tournament-message-autodq-on\">The tournament's automatic disqualify timer has been set to "," minute",".</div>"])),minutes,minutes===1?"":"s"));
}else{
var seconds=Math.floor(parseInt(data[1])/1000);
PS.alert("Please respond to the tournament within "+seconds+" seconds or you may be automatically disqualified.");
if(notify){
this.room.notify({
title:"Tournament Automatic Disqualification Warning",
body:"Room: "+this.room.title+"\nSeconds: "+seconds,
id:'tournament-autodq-warning'
});
}
}
break;

case'autostart':
if(data[0]==='off'){
this.tryAdd("|html|<div class=\"tournament-message-autostart\">The tournament's automatic start is now off.</div>");
}else if(data[0]==='on'){
var _minutes=parseInt(data[1])/1000/60;
this.tryAdd(BattleLog.html(_templateObject7||(_templateObject7=_taggedTemplateLiteralLoose(["|html|<div class=\"tournament-message-autostart\">The tournament will automatically start in "," minute",".</div>"])),_minutes,_minutes===1?"":"s"));
}
break;

case'scouting':
if(data[0]==='allow'){
this.tryAdd("|html|<div class=\"tournament-message-scouting\">Scouting is now allowed (Tournament players can watch other tournament battles)</div>");
}else if(data[0]==='disallow'){
this.tryAdd("|html|<div class=\"tournament-message-scouting\">Scouting is now banned (Tournament players can't watch other tournament battles)</div>");
}
break;

case'update':
Object.assign(this.updates,JSON.parse(data.join('|')));
break;

case'updateend':
var info=Object.assign({},this.info,this.updates);
if(!info.isActive){
if(!info.isStarted||info.isJoined)
this.boxVisible=true;
info.isActive=true;
}

if('format'in this.updates||'teambuilderFormat'in this.updates){
if(!info.teambuilderFormat)info.teambuilderFormat=info.format;
}

if(info.isStarted&&info.isJoined){

if('challenges'in this.updates){var _info$challenges;
if((_info$challenges=info.challenges)!=null&&_info$challenges.length){var _this$info$challenges;
this.boxVisible=true;
if(!((_this$info$challenges=this.info.challenges)!=null&&_this$info$challenges.length)){

if(notify){
this.room.notify({
title:"Tournament challenges available",
body:"Room: "+this.room.title,
id:'tournament-challenges'
});
}
}
}
}

if('challenged'in this.updates){
if(info.challenged){
this.boxVisible=true;
if(!this.info.challenged){
if(notify){
this.room.notify({
title:"Tournament challenge from "+info.challenged,
body:"Room: "+this.room.title,
id:'tournament-challenged'
});
}
}
}
}
}

this.info=info;
this.updates={};
this.update();
break;

case'battlestart':{
var roomid=toRoomid(data[2]);
this.tryAdd("|uhtml|tournament-"+roomid+"|<div class=\"tournament-message-battlestart\"><a href=\""+roomid+"\" class=\"ilink\">Tournament battle between "+BattleLog.escapeHTML(data[0])+" and "+BattleLog.escapeHTML(data[1])+" started.</a></div>");
break;
}

case'battleend':{
var result="drawn";
if(data[2]==='win')
result="won";else
if(data[2]==='loss')
result="lost";
var message=BattleLog.escapeHTML(data[0])+" has "+result+" the match "+BattleLog.escapeHTML(data[3].split(',').join(' - '))+" against "+BattleLog.escapeHTML(data[1])+(data[4]==='fail'?" but the tournament does not support drawing, so it did not count":"")+".";
var _roomid=toRoomid(data[5]);
this.tryAdd("|uhtml|tournament-"+_roomid+"|<div class=\"tournament-message-battleend\"><a href=\""+_roomid+"\" class=\"ilink\">"+message+"</a></div>");
break;
}

case'end':
var endData=JSON.parse(data.join('|'));
this.info.format=endData.format;
this.info.generator=endData.generator;
if(endData.bracketData)this.info.bracketData=endData.bracketData;

if(this.room.log){
var bracketNode=document.createElement('div');
bracketNode.style.position='relative';
this.room.log.addNode(bracketNode);
preact.render(preact.h(TournamentBracket,{tour:this,abbreviated:true}),bracketNode);
}

this.room.add(BattleLog.html(_templateObject8||(_templateObject8=_taggedTemplateLiteralLoose(["|html|<div class=\"tournament-message-end-winner\">Congratulations to "," for winning the ","!</div>"])),ChatTournament.arrayToPhrase(endData.results[0]),this.tournamentName()));
if(endData.results[1]){
this.tryAdd(BattleLog.html(_templateObject9||(_templateObject9=_taggedTemplateLiteralLoose(["|html|<div class=\"tournament-message-end-runnerup\">Runner","-up: ","</div>"])),endData.results[1].length>1?"s":"",ChatTournament.arrayToPhrase(endData.results[1])));
}



case'forceend':
this.room.dismissNotification('tournament-create');
this.updates={};

this.info.isActive=false;
this.boxVisible=false;

if(cmd==='forceend'){
this.info={};
this.room.add("|html|<div class=\"tournament-message-forceend\">The tournament was forcibly ended.</div>");
}


this.room.tour=null;
this.update();
break;

case'error':{
var appendError=function(message){
_this2.tryAdd("|html|<div class=\"tournament-message-forceend\">"+BattleLog.sanitizeHTML(message)+"</div>");
};

switch(data[0]){
case'BracketFrozen':
case'AlreadyStarted':
appendError("The tournament has already started.");
break;

case'BracketNotFrozen':
case'NotStarted':
appendError("The tournament hasn't started yet.");
break;

case'UserAlreadyAdded':
appendError("You are already in the tournament.");
break;

case'AltUserAlreadyAdded':
appendError("One of your alts is already in the tournament.");
break;

case'UserNotAdded':
appendError((data[1]&&data[1]===PS.user.userid?"You aren't":"This user isn't")+" in the tournament.");
break;

case'NotEnoughUsers':
appendError("There aren't enough users.");
break;

case'InvalidAutoDisqualifyTimeout':
case'InvalidAutoStartTimeout':
appendError("That isn't a valid timeout value.");
break;

case'InvalidMatch':
appendError("That isn't a valid tournament matchup.");
break;

case'UserNotNamed':
appendError("You must have a name in order to join the tournament.");
break;

case'Full':
appendError("The tournament is already at maximum capacity for users.");
break;

case'AlreadyDisqualified':
appendError((data[1]&&data[1]===PS.user.userid?"You have":"This user has")+" already been disqualified.");
break;

case'Banned':
appendError("You are banned from entering tournaments.");
break;

default:
appendError("Unknown error: "+data[0]);
break;
}
break;
}

default:
return true;
}
}
};return ChatTournament;}(PSModel);var


TournamentBox=function(_preact$Component){function TournamentBox(){var _this3;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this3=_preact$Component.call.apply(_preact$Component,[this].concat(args))||this;_this3.
subscription=void 0;_this3.
















acceptChallenge=function(ev,format,team){var _tour$info$challenges;
var tour=_this3.props.tour;
var room=tour.room;
var packedTeam=team?team.packedTeam:'';
PS.send("/utm "+packedTeam);
if(tour.info.challenged){
room.send("/tournament acceptchallenge");
}else if((_tour$info$challenges=tour.info.challenges)!=null&&_tour$info$challenges.length){
var target=tour.info.challenges[tour.selectedChallenge]||tour.info.challenges[0];
room.send("/tournament challenge "+target);
}
room.update(null);
};_this3.
validate=function(ev,format,team){
var room=_this3.props.tour.room;
var packedTeam=team?team.packedTeam:'';
PS.send("/utm "+packedTeam);
room.send("/tournament vtm");
room.update(null);
};_this3.
toggleBoxVisibility=function(){
_this3.props.tour.boxVisible=!_this3.props.tour.boxVisible;
_this3.forceUpdate();
};return _this3;}_inheritsLoose(TournamentBox,_preact$Component);var _proto2=TournamentBox.prototype;_proto2.componentDidMount=function componentDidMount(){var _this4=this;this.subscription=this.props.tour.subscribe(function(){_this4.forceUpdate();});};_proto2.componentWillUnmount=function componentWillUnmount(){this.subscription.unsubscribe();};_proto2.selectChallengeUser=function selectChallengeUser(ev){var target=ev.target;if(target.tagName!=='SELECT')return;var selectedIndex=target.selectedIndex;if(selectedIndex<0)return;this.props.tour.selectedChallenge=selectedIndex;this.forceUpdate();};_proto2.
renderTournamentTools=function renderTournamentTools(){var _info$challenges2,_info$challengeBys,_info$challenges3,_info$challenges4,_info$challengeBys2,_info$challenges5;
var tour=this.props.tour;
var info=tour.info;
if(!info.isJoined){
if(info.isStarted)return null;
return preact.h("div",{"class":"tournament-tools"},
preact.h("p",null,
preact.h("button",{"data-cmd":"/tournament join","class":"button"},preact.h("strong",null,"Join"))," ",
preact.h("button",{onClick:this.toggleBoxVisibility,"class":"button"},"Close")
)
);
}


var noMatches=!((_info$challenges2=info.challenges)!=null&&_info$challenges2.length)&&!((_info$challengeBys=info.challengeBys)!=null&&_info$challengeBys.length)&&!info.challenging&&!info.challenged;
return preact.h("div",{"class":"tournament-tools"},
preact.h(TeamForm,{
format:info.format,teamFormat:info.teambuilderFormat,hideFormat:true,
onSubmit:this.acceptChallenge,onValidate:this.validate},

info.isJoined&&!info.challenging&&!info.challenged&&!((_info$challenges3=info.challenges)!=null&&_info$challenges3.length)&&
preact.h("button",{name:"validate","class":"button"},preact.h("i",{"class":"fa fa-check","aria-hidden":true})," Validate"),
" ",
!!(!info.isStarted&&info.isJoined)&&
preact.h("button",{"data-cmd":"/tournament leave","class":"button"},"Leave"),

info.isStarted&&noMatches&&
preact.h("div",{"class":"tournament-nomatches"},"Waiting for battles to become available..."),

!!((_info$challenges4=info.challenges)!=null&&_info$challenges4.length)&&preact.h("div",{"class":"tournament-challenge"},
preact.h("div",{"class":"tournament-challenge-user"},"vs. ",info.challenges[tour.selectedChallenge]),
preact.h("button",{type:"submit","class":"button"},preact.h("strong",null,"Ready!")),
info.challenges.length>1&&preact.h("span",{"class":"tournament-challenge-user-menu"},
preact.h("select",{onChange:this.selectChallengeUser},
info.challenges.map(function(challenge,index){return(
preact.h("option",{value:index,selected:index===tour.selectedChallenge},challenge));}
)
)
)
),
!!((_info$challengeBys2=info.challengeBys)!=null&&_info$challengeBys2.length)&&preact.h("div",{"class":"tournament-challengeby"},
(_info$challenges5=info.challenges)!=null&&_info$challenges5.length?"Or wait":"Waiting"," for ",ChatTournament.arrayToPhrase(info.challengeBys,"or")," ","to challenge you."

),
!!info.challenging&&preact.h("div",{"class":"tournament-challenging"},
preact.h("div",{"class":"tournament-challenging-message"},"Waiting for ",info.challenging,"..."),
preact.h("button",{"data-cmd":"/tournament cancelchallenge","class":"button"},"Cancel")
),
!!info.challenged&&preact.h("div",{"class":"tournament-challenged"},
preact.h("div",{"class":"tournament-challenged-message"},"vs. ",info.challenged),
preact.h("button",{type:"submit","class":"button"},preact.h("strong",null,"Ready!"))
)
)
);
};_proto2.
render=function render(){
var tour=this.props.tour;
var info=tour.info;
return preact.h("div",{"class":"tournament-wrapper "+(info.isActive?'active':''),style:{left:this.props.left||0}},
preact.h("button",{"class":"tournament-title",onClick:this.toggleBoxVisibility},
preact.h("span",{"class":"tournament-status"},info.isStarted?"In Progress":"Signups"),
tour.tournamentName(),
tour.boxVisible?preact.h("i",{"class":"fa fa-caret-up","aria-hidden":true}):preact.h("i",{"class":"fa fa-caret-down","aria-hidden":true})
),
preact.h("div",{"class":"tournament-box "+(tour.boxVisible?'active':'')},
preact.h(TournamentBracket,{tour:tour}),
this.renderTournamentTools()
)
);
};return TournamentBox;}(preact.Component);var


TournamentBracket=function(_preact$Component2){function TournamentBracket(){var _this5;for(var _len2=arguments.length,args=new Array(_len2),_key2=0;_key2<_len2;_key2++){args[_key2]=arguments[_key2];}_this5=_preact$Component2.call.apply(_preact$Component2,[this].concat(args))||this;_this5.


subscription=void 0;_this5.
























































dragging=


null;_this5.
onMouseDown=function(ev){
var elem=_this5.base;
var canScrollVertically=elem.scrollHeight>elem.clientHeight;
var canScrollHorizontally=elem.scrollWidth>elem.clientWidth;
if(!canScrollVertically&&!canScrollHorizontally)return;
if(ev.button)return;

ev.preventDefault();

window.addEventListener('mousemove',_this5.onMouseMove);
window.addEventListener('mouseup',_this5.onMouseUp);
_this5.dragging={
x:ev.clientX,
y:ev.clientY
};
elem.style.cursor='grabbing';
};_this5.
onMouseMove=function(ev){
if(!_this5.dragging)return;
var dx=ev.clientX-_this5.dragging.x;
var dy=ev.clientY-_this5.dragging.y;
_this5.dragging.x=ev.clientX;
_this5.dragging.y=ev.clientY;
var elem=_this5.base;
elem.scrollLeft-=dx;
elem.scrollTop-=dy;
};_this5.
onMouseUp=function(ev){
if(!_this5.dragging)return;
_this5.dragging=null;
var elem=_this5.base;
elem.style.cursor='grab';
window.removeEventListener('mousemove',_this5.onMouseMove);
window.removeEventListener('mouseup',_this5.onMouseUp);
};_this5.

















popOut=function(ev){
PS.join('tourpopout',{
parentElem:ev.currentTarget,
args:{tour:_this5.props.tour}
});
ev.stopImmediatePropagation();
ev.preventDefault();
};return _this5;}_inheritsLoose(TournamentBracket,_preact$Component2);var _proto3=TournamentBracket.prototype;_proto3.renderTableBracket=function renderTableBracket(data){if(data.tableContents.length===0)return null;if(data.tableHeaders.rows.length>4&&this.props.abbreviated){var rows=data.tableHeaders.rows.map(function(row,i){return{name:row,score:data.scores[i]};});rows.sort(function(a,b){return b.score-a.score;});rows=rows.slice(0,4);return preact.h("div",{"class":"pad"},preact.h("table",{"class":"tournament-bracket-table",style:"border-bottom-width:0"},rows.map(function(row,i){return preact.h("tr",null,preact.h("th",null,row.name),preact.h("td",null,row.score),preact.h("td",{"class":"tournament-bracket-table-cell-null"},i<3?preact.h("i",{"class":"fa fa-trophy","aria-hidden":true,style:{color:['#d6c939','#adb2bb','#ca8530'][i]}}):null));}),preact.h("tr",null,preact.h("th",{colSpan:2},"..."),preact.h("td",{"class":"tournament-bracket-table-cell-null"}))));}return preact.h("div",{"class":"pad"},preact.h("table",{"class":"tournament-bracket-table"},preact.h("tr",null,preact.h("td",{"class":"empty"}),data.tableHeaders.cols.map(function(name){return preact.h("th",null,name);})),data.tableHeaders.rows.map(function(name,r){return preact.h("tr",null,preact.h("th",null,name),data.tableContents[r].map(function(cell){return cell?preact.h("td",{"class":"tournament-bracket-table-cell-"+cell.state+(cell.state==='finished'?"tournament-bracket-table-cell-result-"+cell.result:'')},cell.state==='unavailable'?"Unavailable":cell.state==='available'?"Waiting":cell.state==='challenging'?"Challenging":cell.state==='inprogress'?preact.h("a",{href:toRoomid(cell.room),"class":"ilink"},"In-progress"):cell.state==='finished'?cell.score.join(" - "):null):preact.h("td",{"class":"tournament-bracket-table-cell-null"});}),preact.h("th",{"class":"tournament-bracket-row-score"},data.scores[r]));})));};_proto3.componentWillUnmount=function componentWillUnmount(){window.removeEventListener('mousemove',this.onMouseMove);window.removeEventListener('mouseup',this.onMouseUp);};_proto3.componentDidUpdate=function componentDidUpdate(){var elem=this.base;var canScrollVertically=elem.scrollHeight>elem.clientHeight;var canScrollHorizontally=elem.scrollWidth>elem.clientWidth;if(!canScrollVertically&&!canScrollHorizontally){elem.style.cursor='default';}else{elem.style.cursor='grab';}};_proto3.componentDidMount=function componentDidMount(){this.componentDidUpdate();};_proto3.
render=function render(){
var data=this.props.tour.info.bracketData;
return preact.h("div",{
"class":"tournament-bracket"+(this.props.poppedOut?' tournament-popout-bracket':''),
onMouseDown:this.onMouseDown,onMouseUp:this.onMouseUp,onMouseMove:this.onMouseMove},

(data==null?void 0:data.type)==='table'?this.renderTableBracket(data):
(data==null?void 0:data.type)==='tree'?preact.h(TournamentTreeBracket,{data:data,abbreviated:this.props.abbreviated}):
null,
this.props.poppedOut?
preact.h("button",{"class":"tournament-close-link button","data-cmd":"/close"},
preact.h("i",{"class":"fa fa-times","aria-hidden":true})," Close"
):

preact.h("button",{"class":"tournament-popout-link button",onClick:this.popOut},
preact.h("i",{"class":"fa fa-arrows-alt","aria-hidden":true})," Pop-out"
)

);
};return TournamentBracket;}(preact.Component);var

TournamentTreeBracket=function(_preact$Component3){function TournamentTreeBracket(){var _this6;for(var _len3=arguments.length,args=new Array(_len3),_key3=0;_key3<_len3;_key3++){args[_key3]=arguments[_key3];}_this6=_preact$Component3.call.apply(_preact$Component3,[this].concat(args))||this;_this6.


d3Loader=null;return _this6;}_inheritsLoose(TournamentTreeBracket,_preact$Component3);var _proto4=TournamentTreeBracket.prototype;_proto4.
forEachTreeNode=function forEachTreeNode(node,callback){var depth=arguments.length>2&&arguments[2]!==undefined?arguments[2]:0;
callback(node,depth);
if(node.children){for(var _i4=0,_node$children2=
node.children;_i4<_node$children2.length;_i4++){var child=_node$children2[_i4];
this.forEachTreeNode(child,callback,depth+1);
}
}
};_proto4.
cloneTree=function cloneTree(node){var _this7=this;
var clonedNode=Object.assign({},node);
if(node.children){
clonedNode.children=node.children.map(function(child){return _this7.cloneTree(child);});
}
return clonedNode;
};_proto4.










generateTreeBracket=function generateTreeBracket(data,abbreviated){var _this8=this;
var div=document.createElement('div');
div.className='tournament-bracket-tree';

if(!data.rootNode){
var users=data.users;
if(users!=null&&users.length){
div.innerHTML="<b>"+users.length+"</b> user"+(users.length!==1?'s':'')+":<br />"+BattleLog.escapeHTML(users.join(", "));
}else{
div.innerHTML="<b>0</b> users";
}
return div;
}
if(!window.d3){
div.innerHTML="<b>d3 not loaded yet</b>";
this.d3Loader||(this.d3Loader=PS.libsLoaded.then(function(){
_this8.forceUpdate();
}));
return div;
}
this.d3Loader=null;

var name=PS.user.name;



var newTree=this.cloneTree(data.rootNode);
if(newTree.team)newTree.highlightLink=true;
var highlightName=newTree.team;

this.forEachTreeNode(newTree,function(node,depth){var _node$children3;
if(((_node$children3=node.children)==null?void 0:_node$children3.length)===2){var _node$children4;
node.team1=node.children[0].team;
node.team2=node.children[1].team;
var shouldHaveChildren=node.children.some(function(child){var _child$children;return((_child$children=child.children)==null?void 0:_child$children.length)===2;});
if(!shouldHaveChildren)node.children=[];
if(depth>=2&&(_node$children4=node.children)!=null&&_node$children4.length&&abbreviated){
node.children=[];
node.abbreviated=true;
}

if(node.highlightLink){for(var _i6=0,_node$children6=
node.children;_i6<_node$children6.length;_i6++){var child=_node$children6[_i6];
if(child.team===node.team){
child.highlightLink=true;
}
}
}else if(
node.state==='inprogress'||node.state==='available'||node.state==='challenging'||
node.state==='unavailable')
{for(var _i8=0,_node$children8=
node.children;_i8<_node$children8.length;_i8++){var _child=_node$children8[_i8];
if(_child.team&&!_child.team.startsWith('(')){
_child.highlightLink=true;
}
}
}else if(highlightName){for(var _i10=0,_node$children10=
node.children;_i10<_node$children10.length;_i10++){var _child2=_node$children10[_i10];
if(_child2.team===highlightName){
_child2.highlightLink=true;
}
}
}
}
});



var numLeaves=0;
var hasLeafAtDepth=[];
this.forEachTreeNode(newTree,function(node,depth){var _node$children11;
hasLeafAtDepth[depth]||(hasLeafAtDepth[depth]=false);
if(!((_node$children11=node.children)!=null&&_node$children11.length)){
numLeaves++;
hasLeafAtDepth[depth]=true;
}
});






var depthsWithLeaves=hasLeafAtDepth.filter(Boolean).length;
var breadthCompression=depthsWithLeaves>2?0.8:2;
var maxBreadth=numLeaves-(depthsWithLeaves-1)/breadthCompression;
var maxDepth=hasLeafAtDepth.length;

var nodeSize=TournamentTreeBracket.nodeSize;
var size={
width:nodeSize.width*maxDepth+nodeSize.separationX*(maxDepth+1),
height:nodeSize.height*2*(maxBreadth+0.5)+nodeSize.separationY*maxBreadth
};



var tree=d3.layout.tree().
size([size.height,size.width-nodeSize.width-nodeSize.separationX]).
separation(function(){return 1;}).
children(function(node){var _node$children12;return(
(_node$children12=node.children)!=null&&_node$children12.length?node.children:null);}
);
var nodes=tree.nodes(newTree);
var links=tree.links(nodes);



var layoutRoot=d3.select(div).
append('svg:svg').attr('width',size.width).attr('height',size.height).
append('svg:g').
attr('transform',"translate("+(-nodeSize.width/2-6)+",0)");



var diagonalLink=d3.svg.diagonal().
source(function(link){return{
x:link.source.x,y:link.source.y+nodeSize.width/2
};}).
target(function(link){return{
x:link.target.x,y:link.target.y-nodeSize.width/2
};}).
projection(function(link){return[
size.width-link.y,link.x];}
);
layoutRoot.selectAll('path.tournament-bracket-tree-link').data(links).enter().
append('svg:path').
attr('d',diagonalLink).
classed('tournament-bracket-tree-link',true).
classed('tournament-bracket-tree-link-active',function(link){return(
!!link.target.highlightLink);}
);



var nodeGroup=layoutRoot.selectAll('g.tournament-bracket-tree-node').data(nodes).enter().
append('svg:g').classed('tournament-bracket-tree-node',true).attr('transform',function(node){return"translate("+(
size.width-node.y)+","+node.x+")";}
);
nodeGroup.each(function(node){
var elem=d3.select(this);
var outerElem=elem;

if(node.abbreviated){
elem.append('svg:text').attr('y',-nodeSize.height/2+4).
attr('x',-nodeSize.width/2-7).classed('tournament-bracket-tree-abbreviated',true).
text('...');
}

if(node.state==='inprogress'){
elem=elem.append('svg:a').attr('xlink:href',toRoomid(node.room)).classed('ilink',true).
on('click',function(){
var ev=d3.event;
if(ev.metaKey||ev.ctrlKey)return;
ev.preventDefault();
ev.stopPropagation();
var roomid=ev.currentTarget.getAttribute('href');
PS.join(roomid);
});
}

outerElem.classed('tournament-bracket-tree-node-match',true);
outerElem.classed('tournament-bracket-tree-node-match-'+node.state,true);

if(node.team&&!node.team1&&!node.team2){
var rect=elem.append('svg:rect').classed('tournament-bracket-tree-draw',true).
attr('rx',nodeSize.radius).
attr('x',-nodeSize.width/2).attr('width',nodeSize.width).
attr('y',-nodeSize.height/2).attr('height',nodeSize.height);
if(node.team===name)rect.attr('stroke-dasharray','5,5').attr('stroke-width',2);

elem.append('svg:text').classed('tournament-bracket-tree-node-team',true).
attr('y',nodeSize.textOffset).
classed('tournament-bracket-tree-node-team-draw',true).
text(node.team||'');
}else{
var rect1=elem.append('svg:rect').
attr('rx',nodeSize.radius).
attr('x',-nodeSize.width/2).attr('width',nodeSize.width).
attr('y',-nodeSize.height).attr('height',nodeSize.height);
var rect2=elem.append('svg:rect').
attr('rx',nodeSize.radius).
attr('x',-nodeSize.width/2).attr('width',nodeSize.width).
attr('y',0).attr('height',nodeSize.height);
if(node.team1===name)rect1.attr('stroke-dasharray','5,5').attr('stroke-width',2);
if(node.team2===name)rect2.attr('stroke-dasharray','5,5').attr('stroke-width',2);

var row1=elem.append('svg:text').attr('y',-nodeSize.height/2+nodeSize.textOffset).
classed('tournament-bracket-tree-node-row1',true);
var row2=elem.append('svg:text').attr('y',nodeSize.height/2+nodeSize.textOffset).
classed('tournament-bracket-tree-node-row2',true);

var team1=row1.append('svg:tspan').classed('tournament-bracket-tree-team',true).
text(node.team1||'');
var team2=row2.append('svg:tspan').classed('tournament-bracket-tree-team',true).
text(node.team2||'');

if(node.state==='available'){
elem.append('title').text("Waiting");
}else if(node.state==='challenging'){
elem.append('title').text("Challenging");
}else if(node.state==='inprogress'){
elem.append('title').text("In-progress");
}else if(node.state==='finished'){
if(node.result==='win'){
rect1.classed('tournament-bracket-tree-win',true);
rect2.classed('tournament-bracket-tree-loss',true);
team1.classed('tournament-bracket-tree-team-win',true);
team2.classed('tournament-bracket-tree-team-loss',true);
}else if(node.result==='loss'){
rect1.classed('tournament-bracket-tree-loss',true);
rect2.classed('tournament-bracket-tree-win',true);
team1.classed('tournament-bracket-tree-team-loss',true);
team2.classed('tournament-bracket-tree-team-win',true);
}else{
rect1.classed('tournament-bracket-tree-draw',true);
rect2.classed('tournament-bracket-tree-draw',true);
team1.classed('tournament-bracket-tree-team-draw',true);
team2.classed('tournament-bracket-tree-team-draw',true);
}

elem.classed('tournament-bracket-tree-node-match-result-'+node.result,true);
row1.append('svg:tspan').text(" ("+node.score[0]+")").classed('tournament-bracket-tree-score',true);
row2.append('svg:tspan').text(" ("+node.score[1]+")").classed('tournament-bracket-tree-score',true);
}
}
});

return div;
};_proto4.
componentDidMount=function componentDidMount(){
this.base.appendChild(this.generateTreeBracket(this.props.data,this.props.abbreviated));
};_proto4.
shouldComponentUpdate=function shouldComponentUpdate(props){
if(props.data===this.props.data&&!this.d3Loader)return false;
this.base.replaceChild(this.generateTreeBracket(props.data),this.base.children[0]);
return false;
};_proto4.
render=function render(){
return preact.h("div",{"class":"pad"});
};return TournamentTreeBracket;}(preact.Component);TournamentTreeBracket.nodeSize={width:160,height:15,radius:5,separationX:20,separationY:10,textOffset:4};var


TourPopOutPanel=function(_PSRoomPanel){function TourPopOutPanel(){return _PSRoomPanel.apply(this,arguments)||this;}_inheritsLoose(TourPopOutPanel,_PSRoomPanel);var _proto5=TourPopOutPanel.prototype;_proto5.




componentDidMount=function componentDidMount(){var _this$props$room$args;
var tour=(_this$props$room$args=this.props.room.args)==null?void 0:_this$props$room$args.tour;
if(tour)this.subscribeTo(tour);
};_proto5.
render=function render(){var _room$args;
var room=this.props.room;
var tour=(_room$args=room.args)==null?void 0:_room$args.tour;
return preact.h(PSPanelWrapper,{room:room,fullSize:true},
tour&&preact.h(TournamentBracket,{tour:tour,poppedOut:true})
);
};return TourPopOutPanel;}(PSRoomPanel);TourPopOutPanel.id='tourpopout';TourPopOutPanel.routes=['tourpopout'];TourPopOutPanel.location='semimodal-popup';TourPopOutPanel.noURL=true;


PS.addRoomType(TourPopOutPanel);
//# sourceMappingURL=panel-chat-tournament.js.map