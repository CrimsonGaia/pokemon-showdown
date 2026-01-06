"use strict";function _inheritsLoose(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,_setPrototypeOf(t,o);}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t;},_setPrototypeOf(t,e);}/**
 * Battle panel
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license AGPLv3
 */var


























BattlesRoom=function(_PSRoom){





function BattlesRoom(options){var _this;
_this=_PSRoom.call(this,options)||this;_this.classType='battles';_this.format='';_this.filters='';_this.battles=null;
_this.refresh();

if(PS.prefs.bwgfx){
Dex.loadSpriteData('bw');
}return _this;
}_inheritsLoose(BattlesRoom,_PSRoom);var _proto=BattlesRoom.prototype;_proto.
setFormat=function setFormat(format){
if(format===this.format)return this.refresh();
this.battles=null;
this.format=format;
this.update(null);
this.refresh();
};_proto.
refresh=function refresh(){
PS.send("/cmd roomlist "+toID(this.format)+", "+this.filters);
};return BattlesRoom;}(PSRoom);var


BattlesPanel=function(_PSRoomPanel){function BattlesPanel(){var _this2;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this2=_PSRoomPanel.call.apply(_PSRoomPanel,[this].concat(args))||this;_this2.






refresh=function(){
_this2.props.room.refresh();
};_this2.
changeFormat=function(e){
var value=e.target.value;
_this2.props.room.setFormat(value);
};_this2.
applyFilters=function(e){var _this2$base,_this2$base2;
e.preventDefault();
var minElo=(_this2$base=_this2.base)==null||(_this2$base=_this2$base.querySelector("select[name=elofilter]"))==null?void 0:_this2$base.value;
var searchPrefix=(_this2$base2=_this2.base)==null||(_this2$base2=_this2$base2.querySelector("input[name=prefixsearch]"))==null?void 0:_this2$base2.value;
_this2.props.room.filters=(minElo||'')+","+(searchPrefix||'');
_this2.refresh();
};return _this2;}_inheritsLoose(BattlesPanel,_PSRoomPanel);var _proto2=BattlesPanel.prototype;_proto2.
renderBattleLink=function renderBattleLink(battle){
var format=battle.id.split('-')[1];
var minEloMessage=typeof battle.minElo==='number'?"rated "+battle.minElo:battle.minElo;
return preact.h("div",{key:battle.id},preact.h("a",{href:"/"+battle.id,"class":"blocklink"},
minEloMessage&&preact.h("small",{style:"float:right"},"(",minEloMessage,")"),
preact.h("small",null,"[",format,"]"),preact.h("br",null),
preact.h("em",{"class":"p1"},battle.p1)," ",preact.h("small",{"class":"vs"},"vs.")," ",preact.h("em",{"class":"p2"},battle.p2)
));
};_proto2.
render=function render(){var _this3=this;
var room=this.props.room;
return preact.h(PSPanelWrapper,{room:room,scrollable:true},preact.h("div",{"class":"pad"},
preact.h("button",{"class":"button",style:"float:right;font-size:10pt;margin-top:3px",name:"closeRoom"},
preact.h("i",{"class":"fa fa-times","aria-hidden":true})," Close"
),
preact.h("div",{"class":"roomlist"},
preact.h("p",null,
preact.h("button",{"class":"button",name:"refresh",onClick:this.refresh},
preact.h("i",{"class":"fa fa-refresh","aria-hidden":true})," Refresh"
)," ",
preact.h("span",{
style:Dex.getPokemonIcon('meloetta-pirouette')+';display:inline-block;vertical-align:middle',"class":"picon",
title:"Meloetta is PS's mascot! The Pirouette forme is Fighting-type, and represents our battles."}
)
),

preact.h("p",null,
preact.h("label",{"class":"label"},"Format:"),preact.h(FormatDropdown,{onChange:this.changeFormat,placeholder:"(All formats)"})
),
preact.h("label",null,"Minimum Elo: ",
preact.h("select",{name:"elofilter",onChange:this.applyFilters},
preact.h("option",{value:"none"},"None"),preact.h("option",{value:"1100"},"1100"),preact.h("option",{value:"1300"},"1300"),
preact.h("option",{value:"1500"},"1500"),preact.h("option",{value:"1700"},"1700"),preact.h("option",{value:"1900"},"1900")
)
),

preact.h("form",{"class":"search",onSubmit:this.applyFilters},
preact.h("p",null,
preact.h("input",{type:"text",name:"prefixsearch","class":"textbox",placeholder:"Username prefix"}),
preact.h("button",{type:"submit","class":"button"},"Search")
)
),
preact.h("div",{"class":"list"},!room.battles?
preact.h("p",null,"Loading..."):
!room.battles.length?
preact.h("p",null,"No battles are going on"):
preact.h(preact.Fragment,null,
preact.h("p",null,room.battles.length===100?"100+":
room.battles.length," ",room.battles.length>1?"battles":"battle"),
room.battles.map(function(battle){return _this3.renderBattleLink(battle);})
)
)
)
));
};return BattlesPanel;}(PSRoomPanel);BattlesPanel.id='battles';BattlesPanel.routes=['battles'];BattlesPanel.Model=BattlesRoom;BattlesPanel.location='right';BattlesPanel.icon=preact.h("i",{"class":"fa fa-caret-square-o-right","aria-hidden":true});BattlesPanel.title='Battles';var


BattleRoom=function(_ChatRoom){function BattleRoom(){var _this4;for(var _len2=arguments.length,args=new Array(_len2),_key2=0;_key2<_len2;_key2++){args[_key2]=arguments[_key2];}_this4=_ChatRoom.call.apply(_ChatRoom,[this].concat(args))||this;_this4.
classType='battle';_this4.





battle=null;_this4.

side=null;_this4.
request=null;_this4.
choices=null;_this4.
autoTimerActivated=null;return _this4;}_inheritsLoose(BattleRoom,_ChatRoom);var _proto3=BattleRoom.prototype;_proto3.

loadReplay=function loadReplay(){var _this5=this;
var replayid=this.id.slice(7);
Net("https://replay.pokemonshowdown.com/"+replayid+".json").get()["catch"]().then(function(data){
try{
var replay=JSON.parse(data);
_this5.title="["+replay.format+"] "+replay.players.join(' vs. ');
_this5.battle.stepQueue=replay.log.split('\n');
_this5.battle.atQueueEnd=false;
_this5.battle.pause();
_this5.battle.seekTurn(0);
_this5.connected='client-only';
_this5.update(null);
}catch(_unused){
_this5.receiveLine(['error','Battle not found']);
}
});
};return BattleRoom;}(ChatRoom);var


BattleDiv=function(_preact$Component){function BattleDiv(){return _preact$Component.apply(this,arguments)||this;}_inheritsLoose(BattleDiv,_preact$Component);var _proto4=BattleDiv.prototype;_proto4.
shouldComponentUpdate=function shouldComponentUpdate(){
return false;
};_proto4.
componentDidMount=function componentDidMount(){
var room=this.props.room;
if(room.battle){
this.base.replaceChild(room.battle.scene.$frame[0],this.base.firstChild);
}
};_proto4.
render=function render(){
return preact.h("div",null,preact.h("div",{"class":"battle"}));
};return BattleDiv;}(preact.Component);var


TimerButton=function(_preact$Component2){function TimerButton(){var _this6;for(var _len3=arguments.length,args=new Array(_len3),_key3=0;_key3<_len3;_key3++){args[_key3]=arguments[_key3];}_this6=_preact$Component2.call.apply(_preact$Component2,[this].concat(args))||this;_this6.
timerInterval=null;return _this6;}_inheritsLoose(TimerButton,_preact$Component2);var _proto5=TimerButton.prototype;_proto5.
componentWillUnmount=function componentWillUnmount(){
if(this.timerInterval){
clearInterval(this.timerInterval);
this.timerInterval=null;
}
};_proto5.
secondsToTime=function secondsToTime(seconds){
if(seconds===true)return'-:--';
var minutes=Math.floor(seconds/60);
seconds-=minutes*60;
return minutes+":"+(seconds<10?'0':'')+seconds;
};_proto5.
render=function render(){var _this7=this;
var time='Timer';
var room=this.props.room;
if(!this.timerInterval&&room.battle.kickingInactive){
this.timerInterval=setInterval(function(){
if(typeof room.battle.kickingInactive==='number'&&room.battle.kickingInactive>1){
room.battle.kickingInactive--;
if(room.battle.graceTimeLeft)room.battle.graceTimeLeft--;else
if(room.battle.totalTimeLeft)room.battle.totalTimeLeft--;
}
_this7.forceUpdate();
},1000);
}else if(this.timerInterval&&!room.battle.kickingInactive){
clearInterval(this.timerInterval);
this.timerInterval=null;
}

var timerTicking=room.battle.kickingInactive&&
room.request&&room.request.requestType!=="wait"&&room.choices&&!room.choices.isDone()?
' timerbutton-on':'';

if(room.battle.kickingInactive){
var secondsLeft=room.battle.kickingInactive;
time=this.secondsToTime(secondsLeft);
if(secondsLeft!==true){
if(secondsLeft<=10&&timerTicking){
timerTicking=' timerbutton-critical';
}

if(room.battle.totalTimeLeft){
var totalTime=this.secondsToTime(room.battle.totalTimeLeft);
time+=" |  "+totalTime+" total";
}
}
}

return preact.h("button",{
style:{position:"absolute",right:'10px'},"data-href":"battletimer","class":"button"+timerTicking,role:"timer"},

preact.h("i",{"class":"fa fa-hourglass-start","aria-hidden":true})," ",time
);
};return TimerButton;}(preact.Component);
;var

BattlePanel=function(_PSRoomPanel2){function BattlePanel(){var _this8;for(var _len4=arguments.length,args=new Array(_len4),_key4=0;_key4<_len4;_key4++){args[_key4]=arguments[_key4];}_this8=_PSRoomPanel2.call.apply(_PSRoomPanel2,[this].concat(args))||this;_this8.



















































team=null;_this8.
send=function(text,elem){
_this8.props.room.send(text,elem);
};_this8.
focusIfNoSelection=function(){var _window$getSelection;
if((window.getSelection==null||(_window$getSelection=window.getSelection())==null?void 0:_window$getSelection.type)==='Range')return;
_this8.focus();
};_this8.
onKey=function(e){
if(e.keyCode===33){
var chatLog=_this8.base.getElementsByClassName('chat-log')[0];
chatLog.scrollTop=chatLog.scrollTop-chatLog.offsetHeight+60;
return true;
}else if(e.keyCode===34){
var _chatLog=_this8.base.getElementsByClassName('chat-log')[0];
_chatLog.scrollTop=_chatLog.scrollTop+_chatLog.offsetHeight-60;
return true;
}
return false;
};_this8.
toggleBoostedMove=function(e){
var checkbox=e.currentTarget;
var choices=_this8.props.room.choices;
if(!choices)return;
switch(checkbox.name){
case'mega':
choices.current.mega=checkbox.checked;
break;
case'megax':
choices.current.megax=checkbox.checked;
choices.current.megay=false;
break;
case'megay':
choices.current.megay=checkbox.checked;
choices.current.megax=false;
break;
case'ultra':
choices.current.ultra=checkbox.checked;
break;
case'z':
choices.current.z=checkbox.checked;
break;
case'max':
choices.current.max=checkbox.checked;
break;
case'tera':
choices.current.tera=checkbox.checked;
break;
}
_this8.props.room.update(null);
};_this8.



















battleHeight=360;_this8.













































































































































































































































































































































































































































































































































































































































































handleDownloadReplay=function(e){
var room=_this8.props.room;
var target=e.currentTarget;

var filename=(room.battle.tier||'Battle').replace(/[^A-Za-z0-9]/g,'');
var date=new Date();
filename+="-"+date.getFullYear();
filename+="-"+(date.getMonth()>=9?'':'0')+(date.getMonth()+1);
filename+="-"+(date.getDate()>=10?'':'0')+date.getDate();
filename+='-'+toID(room.battle.p1.name);
filename+='-'+toID(room.battle.p2.name);
target.href=window.BattleLog.createReplayFileHref(room);
target.download=filename+'.html';
e.stopPropagation();
};return _this8;}_inheritsLoose(BattlePanel,_PSRoomPanel2);BattlePanel.handleDrop=function handleDrop(ev){var _ev$dataTransfer;var file=(_ev$dataTransfer=ev.dataTransfer)==null||(_ev$dataTransfer=_ev$dataTransfer.files)==null?void 0:_ev$dataTransfer[0];if((file==null?void 0:file.type)==='text/html'){var roomNum=1;for(;roomNum<100;roomNum++){if(!PS.rooms["battle-uploaded-"+roomNum])break;}file.text().then(function(html){var titleStart=html.indexOf('<title>');var titleEnd=html.indexOf('</title>');var title='Uploaded Replay';if(titleStart>=0&&titleEnd>titleStart){title=html.slice(titleStart+7,titleEnd-1);var colonIndex=title.indexOf(':');var hyphenIndex=title.lastIndexOf('-');if(hyphenIndex>colonIndex+2){title=title.substring(colonIndex+2,hyphenIndex-1);}else{title=title.substring(colonIndex+2);}}var index1=html.indexOf('<script type="text/plain" class="battle-log-data">');var index2=html.indexOf('<script type="text/plain" class="log">');if(index1<0&&index2<0){PS.alert("Unrecognized HTML file: Only replay files are supported.");return;}if(index1>=0){html=html.slice(index1+50);}else if(index2>=0){html=html.slice(index2+38);}var index3=html.indexOf('</script>');html=html.slice(0,index3);html=html.replace(/\\\//g,'/');PS.join("battle-uploaded-"+roomNum);var room=PS.rooms["battle-uploaded-"+roomNum];if(!room)return;room.title=title;room.connected='client-only';PS.receive(">battle-uploaded-"+roomNum+"\n"+html);});return true;}};var _proto6=BattlePanel.prototype;_proto6.componentDidMount=function componentDidMount(){var _room$backlog,_this9=this;var room=this.props.room;var $elem=$(this.base);var battle=room.battle||(room.battle=new Battle({id:room.id,$frame:$elem.find('.battle'),$logFrame:$elem.find('.battle-log'),log:(_room$backlog=room.backlog)==null?void 0:_room$backlog.map(function(args){return'|'+args.join('|');})}));var scene=battle.scene;room.backlog=null;room.log||(room.log=scene.log);room.log.getHighlight=room.handleHighlight;scene.tooltips.listen($elem.find('.battle-controls-container'));scene.tooltips.listen(scene.log.elem);_PSRoomPanel2.prototype.componentDidMount.call(this);battle.seekTurn(Infinity);battle.subscribe(function(){return _this9.forceUpdate();});};_proto6.updateLayout=function updateLayout(){if(!this.base)return;var room=this.props.room;var width=this.base.offsetWidth;if(width&&width<640){var _room$battle;var scale=width/640;(_room$battle=room.battle)==null||_room$battle.scene.$frame.css('transform',"scale("+scale+")");this.battleHeight=Math.round(360*scale);}else{var _room$battle2;(_room$battle2=room.battle)==null||_room$battle2.scene.$frame.css('transform','none');this.battleHeight=360;}};_proto6.receiveLine=function receiveLine(args){var room=this.props.room;switch(args[0]){case'initdone':room.battle.seekTurn(Infinity);return;case'request':this.receiveRequest(args[1]?JSON.parse(args[1]):null);return;case'win':case'tie':this.receiveRequest(null);break;case'c':case'c:':case'chat':case'chatmsg':case'inactive':room.battle.instantAdd('|'+args.join('|'));return;case'error':if(args[1].startsWith('[Invalid choice]')&&room.request){room.choices=new BattleChoiceBuilder(room.request);room.update(null);}break;}room.battle.add('|'+args.join('|'));if(PS.prefs.noanim)this.props.room.battle.seekTurn(Infinity);};_proto6.receiveRequest=function receiveRequest(request){var room=this.props.room;if(!request){room.request=null;room.choices=null;return;}if(PS.prefs.autotimer&&!room.battle.kickingInactive&&!room.autoTimerActivated){this.send('/timer on');room.autoTimerActivated=true;}BattleChoiceBuilder.fixRequest(request,room.battle);if(request.side){room.battle.myPokemon=request.side.pokemon;room.battle.setViewpoint(request.side.id);room.side=request.side;}room.request=request;room.choices=new BattleChoiceBuilder(request);this.notifyRequest();room.update(null);};_proto6.notifyRequest=function notifyRequest(){var _room$request;var room=this.props.room;var oName=room.battle.farSide.name;if(oName)oName=" against "+oName;switch((_room$request=room.request)==null?void 0:_room$request.requestType){case'move':room.notify({title:"Your move!",body:"Move in your battle"+oName});break;case'switch':room.notify({title:"Your switch!",body:"Switch in your battle"+oName});break;case'team':room.notify({title:"Team preview!",body:"Choose your team order in your battle"+oName});break;}};_proto6.renderControls=function renderControls(){var room=this.props.room;if(!room.battle)return null;if(room.battle.ended)return this.renderAfterBattleControls();if(room.side&&room.request){return this.renderPlayerControls(room.request);}var atStart=!room.battle.started;var atEnd=room.battle.atQueueEnd;return preact.h("div",{"class":"controls"},preact.h("p",null,atEnd?preact.h("button",{"class":"button disabled","aria-disabled":true,"data-cmd":"/play",style:"min-width:4.5em"},preact.h("i",{"class":"fa fa-play","aria-hidden":true}),preact.h("br",null),"Play"):room.battle.paused?preact.h("button",{"class":"button","data-cmd":"/play",style:"min-width:4.5em"},preact.h("i",{"class":"fa fa-play","aria-hidden":true}),preact.h("br",null),"Play"):preact.h("button",{"class":"button","data-cmd":"/pause",style:"min-width:4.5em"},preact.h("i",{"class":"fa fa-pause","aria-hidden":true}),preact.h("br",null),"Pause")," ",preact.h("button",{"class":"button button-first"+(atStart?" disabled":""),"data-cmd":"/ffto 0",style:"margin-right:2px"},preact.h("i",{"class":"fa fa-undo","aria-hidden":true}),preact.h("br",null),"First turn"),preact.h("button",{"class":"button button-first"+(atStart?" disabled":""),"data-cmd":"/ffto -1"},preact.h("i",{"class":"fa fa-step-backward","aria-hidden":true}),preact.h("br",null),"Prev turn"),preact.h("button",{"class":"button button-last"+(atEnd?" disabled":""),"data-cmd":"/ffto +1",style:"margin-right:2px"},preact.h("i",{"class":"fa fa-step-forward","aria-hidden":true}),preact.h("br",null),"Skip turn"),preact.h("button",{"class":"button button-last"+(atEnd?" disabled":""),"data-cmd":"/ffto end"},preact.h("i",{"class":"fa fa-fast-forward","aria-hidden":true}),preact.h("br",null),"Skip to end")),preact.h("p",null,preact.h("button",{"class":"button","data-cmd":"/switchsides"},preact.h("i",{"class":"fa fa-random","aria-hidden":true})," Switch viewpoint")));};_proto6.renderMoveButton=function renderMoveButton(props){if(!props){return preact.h("button",{"class":"movebutton",disabled:true},"\xA0");}var pp=props.moveData.maxpp?props.moveData.pp+"/"+props.moveData.maxpp:"\u2014";return preact.h("button",{"data-cmd":props.cmd,"data-tooltip":props.tooltip,"class":"movebutton has-tooltip "+(props.moveData.disabled?'disabled':"type-"+props.type),"aria-disabled":props.moveData.disabled},props.name,preact.h("br",null),preact.h("small",{"class":"type"},props.type)," ",preact.h("small",{"class":"pp"},pp),"\xA0");};_proto6.renderPokemonButton=function renderPokemonButton(props){var pokemon=props.pokemon;if(!pokemon){return preact.h("button",{"data-cmd":props.cmd,"class":(props.disabled?'disabled ':'')+"has-tooltip","aria-disabled":props.disabled,style:props.disabled==='fade'?'opacity: 0.5':'',"data-tooltip":props.tooltip},"(empty slot)");}var hpColorClass;switch(BattleScene.getHPColor(pokemon)){case'y':hpColorClass='hpbar hpbar-yellow';break;case'r':hpColorClass='hpbar hpbar-red';break;default:hpColorClass='hpbar';break;}return preact.h("button",{"data-cmd":props.cmd,"class":(props.disabled?'disabled ':'')+"has-tooltip","aria-disabled":props.disabled,style:props.disabled==='fade'?'opacity: 0.5':'',"data-tooltip":props.tooltip},PSIcon({pokemon:pokemon}),pokemon.name,!props.noHPBar&&!pokemon.fainted&&preact.h("span",{"class":hpColorClass},preact.h("span",{style:{width:Math.round(pokemon.hp*92/pokemon.maxhp)||1}})),!props.noHPBar&&pokemon.status&&preact.h("span",{"class":"status "+pokemon.status}));};_proto6.renderMoveMenu=function renderMoveMenu(choices){var moveRequest=choices.currentMoveRequest();var canDynamax=moveRequest.canDynamax&&!choices.alreadyMax;var canMegaEvo=moveRequest.canMegaEvo&&!choices.alreadyMega;var canMegaEvoX=moveRequest.canMegaEvoX&&!choices.alreadyMega;var canMegaEvoY=moveRequest.canMegaEvoY&&!choices.alreadyMega;var canZMove=moveRequest.zMoves&&!choices.alreadyZ;var canUltraBurst=moveRequest.canUltraBurst;var canTerastallize=moveRequest.canTerastallize;var maybeDisabled=moveRequest.maybeDisabled;var maybeLocked=moveRequest.maybeLocked;return preact.h("div",{"class":"movemenu"},maybeDisabled&&preact.h("p",null,preact.h("em",{"class":"movewarning"},"You ",preact.h("strong",null,"might")," have some moves disabled, so you won't be able to cancel an attack!")),maybeLocked&&preact.h("p",null,preact.h("em",{"class":"movewarning"},"You ",preact.h("strong",null,"might")," be locked into a move. ",preact.h("button",{"class":"button","data-cmd":"/choose testfight"},"Try Fight button")," ","(prevents switching if you're locked)")),this.renderMoveControls(moveRequest,choices),preact.h("div",{"class":"megaevo-box"},canDynamax&&preact.h("label",{"class":"megaevo"+(choices.current.max?' cur':'')},preact.h("input",{type:"checkbox",name:"max",checked:choices.current.max,onChange:this.toggleBoostedMove})," ",moveRequest.gigantamax?'Gigantamax':'Dynamax'),canMegaEvo&&preact.h("label",{"class":"megaevo"+(choices.current.mega?' cur':'')},preact.h("input",{type:"checkbox",name:"mega",checked:choices.current.mega,onChange:this.toggleBoostedMove})," ","Mega Evolution"),canMegaEvoX&&preact.h("label",{"class":"megaevo"+(choices.current.mega?' cur':'')},preact.h("input",{type:"checkbox",name:"megax",checked:choices.current.megax,onChange:this.toggleBoostedMove})," ","Mega Evolution X"),canMegaEvoY&&preact.h("label",{"class":"megaevo"+(choices.current.mega?' cur':'')},preact.h("input",{type:"checkbox",name:"megay",checked:choices.current.megay,onChange:this.toggleBoostedMove})," ","Mega Evolution Y"),canUltraBurst&&preact.h("label",{"class":"megaevo"+(choices.current.ultra?' cur':'')},preact.h("input",{type:"checkbox",name:"ultra",checked:choices.current.ultra,onChange:this.toggleBoostedMove})," ","Ultra Burst"),canZMove&&preact.h("label",{"class":"megaevo"+(choices.current.z?' cur':'')},preact.h("input",{type:"checkbox",name:"z",checked:choices.current.z,onChange:this.toggleBoostedMove})," ","Z-Power"),canTerastallize&&preact.h("label",{"class":"megaevo"+(choices.current.tera?' cur':'')},preact.h("input",{type:"checkbox",name:"tera",checked:choices.current.tera,onChange:this.toggleBoostedMove})," ","Terastallize",preact.h("br",null),preact.h("span",{dangerouslySetInnerHTML:{__html:Dex.getTypeIcon(canTerastallize)}}))));};_proto6.renderMoveControls=function renderMoveControls(active,choices){var _this10=this;var battle=this.props.room.battle;var dex=battle.dex;var pokemonIndex=choices.index();var activeIndex=battle.mySide.n>1?pokemonIndex+battle.pokemonControlled:pokemonIndex;var serverPokemon=choices.request.side.pokemon[pokemonIndex];var valueTracker=new ModifiableValue(battle,battle.nearSide.active[activeIndex],serverPokemon);var tooltips=battle.scene.tooltips;if(choices.current.max||active.maxMoves&&!active.canDynamax){if(!active.maxMoves){return preact.h("div",{"class":"message-error"},"Maxed with no max moves");}var gmax=active.gigantamax&&dex.moves.get(active.gigantamax);return active.moves.map(function(moveData,i){var move=dex.moves.get(moveData.name);var moveType=tooltips.getMoveType(move,valueTracker,gmax||true)[0];var maxMoveData=active.maxMoves[i];if(maxMoveData.name!=='Max Guard'){maxMoveData=tooltips.getMaxMoveFromType(moveType,gmax);}var gmaxTooltip=maxMoveData.id.startsWith('gmax')?"|"+maxMoveData.id:"";var tooltip="maxmove|"+moveData.name+"|"+pokemonIndex+gmaxTooltip;return _this10.renderMoveButton({name:maxMoveData.name,cmd:"/move "+(i+1)+" max",type:moveType,tooltip:tooltip,moveData:moveData});});}if(choices.current.z){if(!active.zMoves){return preact.h("div",{"class":"message-error"},"No Z moves");}return active.moves.map(function(moveData,i){var zMoveData=active.zMoves[i];if(!zMoveData){return _this10.renderMoveButton(null);}var specialMove=dex.moves.get(zMoveData.name);var move=specialMove.exists?specialMove:dex.moves.get(moveData.name);var moveType=tooltips.getMoveType(move,valueTracker)[0];var tooltip="zmove|"+moveData.name+"|"+pokemonIndex;return _this10.renderMoveButton({name:zMoveData.name,cmd:"/move "+(i+1)+" zmove",type:moveType,tooltip:tooltip,moveData:{pp:1,maxpp:1}});});}var special=choices.moveSpecial(choices.current);return active.moves.map(function(moveData,i){var move=dex.moves.get(moveData.name);var moveType=tooltips.getMoveType(move,valueTracker)[0];var tooltip="move|"+moveData.name+"|"+pokemonIndex;return _this10.renderMoveButton({name:move.name,cmd:"/move "+(i+1)+special,type:moveType,tooltip:tooltip,moveData:moveData});});};_proto6.renderMoveTargetControls=function renderMoveTargetControls(request,choices){var _choices$currentMove,_this11=this;var battle=this.props.room.battle;var moveTarget=(_choices$currentMove=choices.currentMove())==null?void 0:_choices$currentMove.target;if((moveTarget==='adjacentAlly'||moveTarget==='adjacentFoe')&&battle.gameType==='freeforall'){moveTarget='normal';}var moveChoice=choices.stringChoice(choices.current);var userSlot=choices.index()+Math.floor(battle.mySide.n/2)*battle.pokemonControlled;var userSlotCross=battle.farSide.active.length-1-userSlot;return[battle.farSide.active.map(function(pokemon,i){var _pokemon;var disabled=false;if(moveTarget==='adjacentAlly'||moveTarget==='adjacentAllyOrSelf'){disabled=true;}else if(moveTarget==='normal'||moveTarget==='adjacentFoe'){if(Math.abs(userSlotCross-i)>1)disabled=true;}if((_pokemon=pokemon)!=null&&_pokemon.fainted)pokemon=null;return _this11.renderPokemonButton({pokemon:pokemon,cmd:disabled?"":"/"+moveChoice+" +"+(i+1),disabled:disabled&&'fade',tooltip:"activepokemon|1|"+i});}).reverse(),preact.h("div",{style:"clear: left"}),battle.nearSide.active.map(function(pokemon,i){var _pokemon2;var disabled=false;if(moveTarget==='adjacentFoe'){disabled=true;}else if(moveTarget==='normal'||moveTarget==='adjacentAlly'||moveTarget==='adjacentAllyOrSelf'){if(Math.abs(userSlot-i)>1)disabled=true;}if(moveTarget!=='adjacentAllyOrSelf'&&userSlot===i)disabled=true;if((_pokemon2=pokemon)!=null&&_pokemon2.fainted)pokemon=null;return _this11.renderPokemonButton({pokemon:pokemon,cmd:disabled?"":"/"+moveChoice+" -"+(i+1),disabled:disabled&&'fade',tooltip:"activepokemon|0|"+i});})];};_proto6.renderSwitchMenu=function renderSwitchMenu(request,choices,ignoreTrapping){var _choices$currentMoveR,_choices$currentMoveR2,_this12=this;var battle=this.props.room.battle;var numActive=choices.requestLength();var maybeTrapped=!ignoreTrapping&&((_choices$currentMoveR=choices.currentMoveRequest())==null?void 0:_choices$currentMoveR.maybeTrapped);var trapped=!ignoreTrapping&&!maybeTrapped&&((_choices$currentMoveR2=choices.currentMoveRequest())==null?void 0:_choices$currentMoveR2.trapped);var isReviving=battle.myPokemon.some(function(p){return p.reviving;});return preact.h("div",{"class":"switchmenu"},maybeTrapped&&preact.h("em",{"class":"movewarning"},"You ",preact.h("strong",null,"might")," be trapped, so you won't be able to cancel a switch!",preact.h("br",null)),trapped&&preact.h("em",{"class":"movewarning"},"You're ",preact.h("strong",null,"trapped")," and cannot switch!",preact.h("br",null)),isReviving&&preact.h("em",{"class":"movewarning"},"Choose a pokemon to revive!",preact.h("br",null)),request.side.pokemon.map(function(serverPokemon,i){var cantSwitch=trapped||i<numActive||choices.alreadySwitchingIn.includes(i+1)||serverPokemon.fainted;if(isReviving)cantSwitch=!serverPokemon.fainted;return _this12.renderPokemonButton({pokemon:serverPokemon,cmd:"/switch "+(i+1),disabled:cantSwitch,tooltip:"switchpokemon|"+i});}));};_proto6.renderTeamPreviewChooser=function renderTeamPreviewChooser(request,choices){var _this13=this;return request.side.pokemon.map(function(serverPokemon,i){var cantSwitch=choices.alreadySwitchingIn.includes(i+1);return _this13.renderPokemonButton({pokemon:serverPokemon,cmd:"/switch "+(i+1),disabled:cantSwitch&&'fade',tooltip:"switchpokemon|"+i});});};_proto6.renderTeamList=function renderTeamList(){var _this14=this;var team=this.team;if(!team)return;return preact.h("div",{"class":"switchcontrols"},preact.h("h3",{"class":"switchselect"},"Team"),preact.h("div",{"class":"switchmenu"},team.map(function(serverPokemon,i){return _this14.renderPokemonButton({pokemon:serverPokemon,cmd:"",disabled:true,tooltip:"switchpokemon|"+i});})));};_proto6.renderChosenTeam=function renderChosenTeam(request,choices){var _this15=this;return choices.alreadySwitchingIn.map(function(slot){var serverPokemon=request.side.pokemon[slot-1];return _this15.renderPokemonButton({pokemon:serverPokemon,cmd:"/switch "+slot,disabled:true,tooltip:"switchpokemon|"+(slot-1)});});};_proto6.renderOldChoices=function renderOldChoices(request,choices){if(!choices)return null;if(request.requestType!=='move'&&request.requestType!=='switch'&&request.requestType!=='team')return;if(choices.isEmpty())return null;var buf=[preact.h("button",{"data-cmd":"/cancel","class":"button"},preact.h("i",{"class":"fa fa-chevron-left","aria-hidden":true})," Back"),' '];if(choices.isDone()&&choices.noCancel){buf=['Waiting for opponent...',preact.h("br",null)];}else if(choices.isDone()&&choices.choices.length<=1){buf=[];}var battle=this.props.room.battle;for(var i=0;i<choices.choices.length;i++){var choiceString=choices.choices[i];if(choiceString==="testfight"){buf.push(request.side.pokemon[i].name+" is locked into a move.");return buf;}var choice=void 0;try{choice=choices.parseChoice(choiceString,i);}catch(err){buf.push(preact.h("span",{"class":"message-error"},err.message));}if(!choice)continue;var pokemon=request.side.pokemon[i];var active=request.requestType==='move'?request.active[i]:null;if(choice.choiceType==='move'){var _choices$currentMove2;buf.push(pokemon.name+" will ");if(choice.mega)buf.push(preact.h("strong",null,"Mega")," Evolve and ");if(choice.megax)buf.push(preact.h("strong",null,"Mega")," Evolve (X) and ");if(choice.megay)buf.push(preact.h("strong",null,"Mega")," Evolve (Y) and ");if(choice.ultra)buf.push(preact.h("strong",null,"Ultra")," Burst and ");if(choice.tera)buf.push("Terastallize (",preact.h("strong",null,(active==null?void 0:active.canTerastallize)||'???'),") and ");if(choice.max&&active!=null&&active.canDynamax)buf.push(active!=null&&active.gigantamax?"Gigantamax and ":"Dynamax and ");buf.push("use ",preact.h("strong",null,(_choices$currentMove2=choices.currentMove(choice,i))==null?void 0:_choices$currentMove2.name));if(choice.targetLoc>0||battle.gameType==='freeforall'){var target=battle.farSide.active[choice.targetLoc-1];if(!target){buf.push(" at slot "+choice.targetLoc);}else{buf.push(" at "+target.name);}}else if(choice.targetLoc<0){var _target=battle.nearSide.active[-choice.targetLoc-1];if(!_target){buf.push(" at ally slot "+choice.targetLoc);}else{buf.push(" at ally "+_target.name);}}}else if(choice.choiceType==='switch'){var _target2=request.side.pokemon[choice.targetPokemon-1];buf.push(pokemon.name+" will switch to ",preact.h("strong",null,_target2.name));}else if(choice.choiceType==='shift'){buf.push(pokemon.name+" will ",preact.h("strong",null,"shift")," to the center");}else if(choice.choiceType==='team'){var _target3=request.side.pokemon[choice.targetPokemon-1];buf.push("You picked ",preact.h("strong",null,_target3.name));}buf.push(preact.h("br",null));}return buf;};_proto6.renderPlayerWaitingControls=function renderPlayerWaitingControls(){return preact.h("div",{"class":"controls"},preact.h("div",{"class":"whatdo"},preact.h("button",{"class":"button","data-cmd":"/ffto end"},"Skip animation ",preact.h("i",{"class":"fa fa-fast-forward","aria-hidden":true}))),this.renderTeamList());};_proto6.renderPlayerControls=function renderPlayerControls(request){var room=this.props.room;var atEnd=room.battle.atQueueEnd;if(!atEnd)return this.renderPlayerWaitingControls();var choices=room.choices;if(!choices)return'Error: Missing BattleChoiceBuilder';if(choices.request!==request){choices=new BattleChoiceBuilder(request);room.choices=choices;}if(choices.isDone()){return preact.h("div",{"class":"controls"},preact.h("div",{"class":"whatdo"},this.renderOldChoices(request,choices)),preact.h("div",{"class":"pad"},choices.noCancel?null:preact.h("button",{"data-cmd":"/cancel","class":"button"},"Cancel")),this.renderTeamList());}if(request.side){room.battle.myPokemon=request.side.pokemon;this.team=request.side.pokemon;}switch(request.requestType){case'move':{var index=choices.index();var pokemon=request.side.pokemon[index];if(choices.current.move){var _choices$currentMove3;var moveName=(_choices$currentMove3=choices.currentMove())==null?void 0:_choices$currentMove3.name;return preact.h("div",{"class":"controls"},preact.h("div",{"class":"whatdo"},this.renderOldChoices(request,choices),pokemon.name," should use ",preact.h("strong",null,moveName)," at where? "),preact.h("div",{"class":"switchcontrols"},preact.h("div",{"class":"switchmenu"},this.renderMoveTargetControls(request,choices))));}var canShift=room.battle.gameType==='triples'&&index!==1;return preact.h("div",{"class":"controls"},preact.h("div",{"class":"whatdo"},this.renderOldChoices(request,choices),"What will ",preact.h("strong",null,pokemon.name)," do?"),preact.h("div",{"class":"movecontrols"},preact.h("h3",{"class":"moveselect"},"Attack"),this.renderMoveMenu(choices)),preact.h("div",{"class":"switchcontrols"},canShift&&[preact.h("h3",{"class":"shiftselect"},"Shift"),preact.h("button",{"data-cmd":"/shift"},"Move to center")],preact.h("h3",{"class":"switchselect"},"Switch"),this.renderSwitchMenu(request,choices)));}case'switch':{var _pokemon3=request.side.pokemon[choices.index()];return preact.h("div",{"class":"controls"},preact.h("div",{"class":"whatdo"},this.renderOldChoices(request,choices),"What will ",preact.h("strong",null,_pokemon3.name)," do?"),preact.h("div",{"class":"switchcontrols"},preact.h("h3",{"class":"switchselect"},"Switch"),this.renderSwitchMenu(request,choices,true)));}case'team':{return preact.h("div",{"class":"controls"},preact.h("div",{"class":"whatdo"},choices.alreadySwitchingIn.length>0?[preact.h("button",{"data-cmd":"/cancel","class":"button"},preact.h("i",{"class":"fa fa-chevron-left","aria-hidden":true})," Back")," What about the rest of your team? "]:"How will you start the battle? "),preact.h("div",{"class":"switchcontrols"},preact.h("h3",{"class":"switchselect"},"Choose ",choices.alreadySwitchingIn.length<=0?"lead":"slot "+(choices.alreadySwitchingIn.length+1)),preact.h("div",{"class":"switchmenu"},this.renderTeamPreviewChooser(request,choices),preact.h("div",{style:"clear:left"}))),preact.h("div",{"class":"switchcontrols"},choices.alreadySwitchingIn.length>0&&preact.h("h3",{"class":"switchselect"},"Team so far"),preact.h("div",{"class":"switchmenu"},this.renderChosenTeam(request,choices))));}}return null;};_proto6.renderAfterBattleControls=function renderAfterBattleControls(){var room=this.props.room;var isNotTiny=room.width>700;return preact.h("div",{"class":"controls"},preact.h("p",null,preact.h("span",{style:"float: right"},preact.h("a",{onClick:this.handleDownloadReplay,href:"//"+Config.routes.replays+"/download","class":"button replayDownloadButton"},preact.h("i",{"class":"fa fa-download","aria-hidden":true})," Download replay"),preact.h("br",null),preact.h("br",null),preact.h("button",{"class":"button","data-cmd":"/savereplay"},preact.h("i",{"class":"fa fa-upload","aria-hidden":true})," Upload and share replay")),preact.h("button",{"class":"button","data-cmd":"/play",style:"min-width:4.5em"},preact.h("i",{"class":"fa fa-undo","aria-hidden":true}),preact.h("br",null),"Replay")," ",isNotTiny&&preact.h("button",{"class":"button button-first","data-cmd":"/ffto 0",style:"margin-right:2px"},preact.h("i",{"class":"fa fa-undo","aria-hidden":true}),preact.h("br",null),"First turn"),isNotTiny&&preact.h("button",{"class":"button button-first","data-cmd":"/ffto -1"},preact.h("i",{"class":"fa fa-step-backward","aria-hidden":true}),preact.h("br",null),"Prev turn")),room.side?preact.h("p",null,preact.h("button",{"class":"button","data-cmd":"/close"},preact.h("strong",null,"Main menu"),preact.h("br",null),preact.h("small",null,"(closes this battle)"))," ",preact.h("button",{"class":"button","data-cmd":"/closeand /challenge "+room.battle.farSide.id+","+room.battle.tier},preact.h("strong",null,"Rematch"),preact.h("br",null),preact.h("small",null,"(closes this battle)"))):preact.h("p",null,preact.h("button",{"class":"button","data-cmd":"/switchsides"},preact.h("i",{"class":"fa fa-random","aria-hidden":true})," Switch viewpoint")));};_proto6.

render=function render(){var _room$battle3;
var room=this.props.room;
this.updateLayout();
var id="room-"+room.id;
var hardcoreStyle=(_room$battle3=room.battle)!=null&&_room$battle3.hardcoreMode?preact.h("style",{
dangerouslySetInnerHTML:{__html:"#"+id+" .battle .turn, #"+id+" .battle-history { display: none !important; }"}}
):null;

if(room.width<700){
return preact.h(PSPanelWrapper,{room:room,focusClick:true,scrollable:"hidden"},
hardcoreStyle,
preact.h(BattleDiv,{room:room}),
preact.h(ChatLog,{
"class":"battle-log hasuserlist",room:room,noSubscription:true},

preact.h("div",{"class":"battle-controls",role:"complementary","aria-label":"Battle Controls"},
this.renderControls()
)
),
preact.h(ChatTextEntry,{room:room,onMessage:this.send,onKey:this.onKey,left:0}),
preact.h(ChatUserList,{room:room,minimized:true}),
preact.h("button",{
"data-href":"battleoptions","class":"button",
style:{position:'absolute',right:'75px'}},
"Battle options"

),
room.battle&&!room.battle.ended&&room.request&&room.battle.mySide.id===PS.user.userid&&
preact.h(TimerButton,{room:room}),
preact.h("div",{"class":"battle-controls-container"})
);
}

return preact.h(PSPanelWrapper,{room:room,focusClick:true,scrollable:"hidden"},
hardcoreStyle,
preact.h(BattleDiv,{room:room}),
preact.h(ChatLog,{
"class":"battle-log hasuserlist",room:room,left:640,noSubscription:true}


),
preact.h(ChatTextEntry,{room:room,onMessage:this.send,onKey:this.onKey,left:640}),
preact.h(ChatUserList,{room:room,left:640,minimized:true}),
preact.h("button",{
"data-href":"battleoptions","class":"button",
style:{position:'absolute',right:'15px'}},
"Battle options"

),
preact.h("div",{"class":"battle-controls-container"},
preact.h("div",{"class":"battle-controls",role:"complementary","aria-label":"Battle Controls"},
room.battle&&!room.battle.ended&&room.request&&room.battle.mySide.id===PS.user.userid&&
preact.h(TimerButton,{room:room}),
this.renderControls()
)
)
);
};return BattlePanel;}(PSRoomPanel);BattlePanel.id='battle';BattlePanel.routes=['battle-*'];BattlePanel.Model=BattleRoom;


PS.addRoomType(BattlePanel,BattlesPanel);
//# sourceMappingURL=panel-battle.js.map