"use strict";function _inheritsLoose(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,_setPrototypeOf(t,o);}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t;},_setPrototypeOf(t,e);}/**
 * Ladder Panel
 *
 * Panel for ladder formats and associated ladder tables.
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>, Adam Tran <aviettran@gmail.com>
 * @license MIT
 */var































LadderFormatRoom=function(_PSRoom){








function LadderFormatRoom(options){var _this;
_this=_PSRoom.call(this,options)||this;_this.classType='ladder';_this.format=_this.id.split('-')[1];_this.notice=void 0;_this.searchValue='';_this.loading=false;_this.error=void 0;_this.ladderData=void 0;_this.



setNotice=function(notice){
_this.notice=notice;
_this.update(null);
};_this.
setSearchValue=function(searchValue){
_this.searchValue=searchValue;
_this.update(null);
};_this.
setError=function(error){
_this.loading=false;
_this.error=error.message;
_this.update(null);
};_this.
setLadderData=function(ladderData){
_this.loading=false;
if(ladderData){
_this.ladderData=JSON.parse(ladderData);
}else{
_this.ladderData=undefined;
}
_this.update(null);
};_this.
requestLadderData=function(searchValue){
if(!_this.format)return;
_this.searchValue=searchValue;
_this.loading=true;
if(PS.teams.usesLocalLadder){
_this.send("/cmd laddertop "+_this.format+" "+toID(_this.searchValue));
}else if(_this.format!==undefined){
Net("//pokemonshowdown.com/ladder/"+_this.format+".json").
get({
query:{
prefix:toID(searchValue)
}
}).
then(_this.setLadderData)["catch"](
_this.setError);
}
_this.update(null);
};if(_this.format)_this.title=BattleLog.formatName(_this.format);return _this;}_inheritsLoose(LadderFormatRoom,_PSRoom);return LadderFormatRoom;}(PSRoom);var


LadderFormatPanel=function(_PSRoomPanel){function LadderFormatPanel(){var _this2;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this2=_PSRoomPanel.call.apply(_PSRoomPanel,[this].concat(args))||this;_this2.





























changeSearch=function(e){
e.preventDefault();
_this2.props.room.requestLadderData(_this2.base.querySelector('input[name=searchValue]').value);
};return _this2;}_inheritsLoose(LadderFormatPanel,_PSRoomPanel);var _proto=LadderFormatPanel.prototype;_proto.componentDidMount=function componentDidMount(){var _this3=this;var room=this.props.room;room.requestLadderData('');this.subscriptions.push(room.subscribe(function(response){if(response){var format=response[0],ladderData=response[1];if(room.format===format){if(!ladderData){room.setError(new Error('No data returned from server.'));}else{room.setLadderData(ladderData);}}}_this3.forceUpdate();}));this.subscriptions.push(PS.teams.subscribe(function(){_this3.forceUpdate();}));};_proto.
renderHeader=function renderHeader(){
if(PS.teams.usesLocalLadder)return null;

var room=this.props.room;
return preact.h("h3",null,
BattleLog.formatName(room.format)," Top",
room.searchValue?" - '"+room.searchValue+"'":" 500"
);
};_proto.
renderSearch=function renderSearch(){
if(PS.teams.usesLocalLadder)return null;

var room=this.props.room;
return preact.h("form",{"class":"search",onSubmit:this.changeSearch},preact.h("p",null,
preact.h("input",{
type:"text",
name:"searchValue",
"class":"textbox searchinput",
value:BattleLog.escapeHTML(room.searchValue),
placeholder:"username prefix",
onChange:this.changeSearch}
)," ",
preact.h("button",{type:"submit","class":"button"},"Search")
));
};_proto.
renderTable=function renderTable(){var _room$ladderData;
var room=this.props.room;

if(room.loading||!BattleFormats){
return preact.h("p",null,preact.h("i",{"class":"fa fa-refresh fa-spin","aria-hidden":true})," ",preact.h("em",null,"Loading..."));
}else if(room.error!==undefined){
return preact.h("p",null,"Error: ",room.error);
}else if(!room.ladderData){
return null;
}
var showCOIL=((_room$ladderData=room.ladderData)==null||(_room$ladderData=_room$ladderData.toplist[0])==null?void 0:_room$ladderData.coil)!==undefined;

return preact.h("table",{"class":"table readable-bg"},
preact.h("tr",{"class":"table-header"},
preact.h("th",null),
preact.h("th",null,"Name"),
preact.h("th",{style:{textAlign:'center'}},preact.h("abbr",{title:"Elo rating"},"Elo")),
preact.h("th",{style:{textAlign:'center'}},
preact.h("abbr",{title:"user's percentage chance of winning a random battle (Glicko X-Act Estimate)"},"GXE")
),
preact.h("th",{style:{textAlign:'center'}},
preact.h("abbr",{title:"Glicko-1 rating system: rating\xB1deviation (provisional if deviation>100)"},"Glicko-1")
),
showCOIL&&preact.h("th",{style:{textAlign:'center'}},"COIL")
),
room.ladderData.toplist.map(function(row,i){var _row$coil;return preact.h("tr",null,
preact.h("td",{style:{textAlign:'right'}},
i<3&&preact.h("i",{"class":"fa fa-trophy","aria-hidden":true,style:{color:['#d6c939','#adb2bb','#ca8530'][i]}})," ",i+1
),
preact.h("td",null,preact.h("span",{
"class":"username no-interact",style:{
fontWeight:i<10?'bold':'normal',color:BattleLog.usernameColor(row.userid)
}},

row.username
)),
preact.h("td",{style:{textAlign:'center'}},preact.h("strong",null,row.elo.toFixed(0))),
preact.h("td",{style:{textAlign:'center'}},Math.trunc(row.gxe),preact.h("small",null,".",row.gxe.toFixed(1).slice(-1),"%")),
preact.h("td",{style:{textAlign:'center'}},preact.h("em",null,row.rpr.toFixed(0),preact.h("small",null," \xB1 ",row.rprd.toFixed(0)))),
showCOIL&&preact.h("td",{style:{textAlign:'center'}},(_row$coil=row.coil)==null?void 0:_row$coil.toFixed(0))
);}),
!room.ladderData.toplist.length&&preact.h("tr",null,preact.h("td",{colSpan:5},
preact.h("em",null,"No one has played any ranked games yet.")
))
);
};_proto.
render=function render(){
var room=this.props.room;
return preact.h(PSPanelWrapper,{room:room,scrollable:true},
preact.h("div",{"class":"ladder pad"},
preact.h("p",null,
preact.h("button",{"class":"button","data-href":"ladder","data-target":"replace"},
preact.h("i",{"class":"fa fa-chevron-left","aria-hidden":true})," Format List"
)
),
preact.h("p",null,
preact.h("button",{"class":"button","data-href":"ladder","data-target":"replace"},
preact.h("i",{"class":"fa fa-refresh","aria-hidden":true})," Refresh"
)," ",preact.h("a",{"class":"button",href:"/view-seasonladder-gen9randombattle"},
preact.h("i",{"class":"fa fa-trophy","aria-hidden":true})," Seasonal rankings"
),
this.renderSearch()
),
this.renderHeader(),
this.renderTable()
)
);
};return LadderFormatPanel;}(PSRoomPanel);LadderFormatPanel.id='ladderformat';LadderFormatPanel.routes=['ladder-*'];LadderFormatPanel.Model=LadderFormatRoom;LadderFormatPanel.icon=preact.h("i",{"class":"fa fa-list-ol","aria-hidden":true});var


LadderListPanel=function(_PSRoomPanel2){function LadderListPanel(){return _PSRoomPanel2.apply(this,arguments)||this;}_inheritsLoose(LadderListPanel,_PSRoomPanel2);var _proto2=LadderListPanel.prototype;_proto2.





componentDidMount=function componentDidMount(){
this.subscribeTo(PS.teams);
};_proto2.
renderList=function renderList(){
if(!window.BattleFormats){
return preact.h("p",null,"Loading...");
}
var currentSection="";
var buf=[];for(var _i2=0,_Object$entries2=
Object.entries(BattleFormats);_i2<_Object$entries2.length;_i2++){var _ref=_Object$entries2[_i2];var id=_ref[0];var format=_ref[1];
if(!format.rated||!format.searchShow)continue;
if(format.section!==currentSection){
currentSection=format.section;
buf.push(preact.h("h3",null,currentSection));
}
buf.push(preact.h("div",null,
preact.h("a",{href:"/ladder-"+id,"class":"blocklink",style:{fontSize:'11pt',padding:'3px 6px'}},
BattleLog.formatName(format.id)
)
));
}
return buf;
};_proto2.
render=function render(){
var room=this.props.room;
return preact.h(PSPanelWrapper,{room:room,scrollable:true},
preact.h("div",{"class":"ladder pad"},
preact.h("p",null,
preact.h("a",{"class":"button",href:"//"+Config.routes.users+"/",target:"_blank"},"Look up a specific user's rating"

)
),
preact.h("p",null,
preact.h("button",{"data-href":"view-ladderhelp","class":"button"},
preact.h("i",{"class":"fa fa-info-circle","aria-hidden":true})," How the ladder works"
)
),
this.renderList()
)
);
};return LadderListPanel;}(PSRoomPanel);LadderListPanel.id='ladder';LadderListPanel.routes=['ladder'];LadderListPanel.icon=preact.h("i",{"class":"fa fa-list-ol","aria-hidden":true});LadderListPanel.title='Ladder';


PS.addRoomType(LadderFormatPanel,LadderListPanel);
//# sourceMappingURL=panel-ladder.js.map