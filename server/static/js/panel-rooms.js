"use strict";function _inheritsLoose(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,_setPrototypeOf(t,o);}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t;},_setPrototypeOf(t,e);}/**
 * Room-list panel (default right-panel)
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license AGPLv3
 */var






RoomsRoom=function(_PSRoom){

function RoomsRoom(options){var _this;
_this=_PSRoom.call(this,options)||this;_this.classType='rooms';
PS.send("/cmd rooms");return _this;
}_inheritsLoose(RoomsRoom,_PSRoom);return RoomsRoom;}(PSRoom);var



RoomsPanel=function(_PSRoomPanel){function RoomsPanel(){var _this2;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this2=_PSRoomPanel.call.apply(_PSRoomPanel,[this].concat(args))||this;_this2.






hidden=false;_this2.
search='';_this2.
section='';_this2.
lastKeyCode=0;_this2.
roomList=[];_this2.
roomListFocusIndex=-1;_this2.
roomListLength=0;_this2.











hide=function(ev){
ev.stopImmediatePropagation();
PS.hideRightRoom();
};_this2.
changeSearch=function(ev){
var target=ev.currentTarget;
if(target.selectionStart!==target.selectionEnd)return;
_this2.updateRoomList(target.value);
_this2.forceUpdate();
};_this2.
changeSection=function(ev){
var target=ev.currentTarget;
_this2.section=target.value;
_this2.forceUpdate();
};_this2.
handleOnBlur=function(ev){
_this2.roomListFocusIndex=-1;
_this2.forceUpdate();
};_this2.
keyDownSearch=function(ev){
_this2.lastKeyCode=ev.keyCode;
if(ev.shiftKey||ev.ctrlKey||ev.altKey||ev.metaKey)return;
if(ev.keyCode===38){
_this2.roomListFocusIndex=Math.max(_this2.roomListFocusIndex-1,_this2.search?0:-1);
_this2.forceUpdate();
ev.preventDefault();
}else if(ev.keyCode===40){
_this2.roomListFocusIndex=Math.min(_this2.roomListFocusIndex+1,_this2.roomListLength-1);
_this2.forceUpdate();
ev.preventDefault();
}else if(ev.keyCode===13){
var target=ev.currentTarget;
var value=_this2.getRoomListFocusTitle()||target.value;
var arrowIndex=value.indexOf(" \u21D2 ");
if(arrowIndex>=0)value=value.slice(arrowIndex+3);
if(!/^[a-z0-9-]$/.test(value))value=toID(value);
ev.preventDefault();
ev.stopImmediatePropagation();
target.value='';
_this2.updateRoomList('');

PS.join(value);
}
};return _this2;}_inheritsLoose(RoomsPanel,_PSRoomPanel);var _proto=RoomsPanel.prototype;_proto.componentDidMount=function componentDidMount(){_PSRoomPanel.prototype.componentDidMount.call(this);this.subscriptions.push(PS.user.subscribe(function(update){if(!update&&PS.user.named)PS.send("/cmd rooms");}));};_proto.componentDidUpdate=function componentDidUpdate(){var _this$base;var el=(_this$base=this.base)==null?void 0:_this$base.querySelector('a.blocklink.cur');if(!this.roomListFocusIndex)return;el==null||el.scrollIntoView({behavior:'auto',block:'center'});};_proto.
updateRoomList=function updateRoomList(search){
if(search)search=toID(search);
var forceNoAutocomplete=this.search===(search||'')+"-";
if(search||this.search){
if(search===undefined||search===this.search)return;
this.search=search;
this.roomListFocusIndex=this.search?0:-1;
}
this.roomList=this.getRoomList(forceNoAutocomplete);for(var _i2=0,_this$roomList2=
this.roomList;_i2<_this$roomList2.length;_i2++){var _ref=_this$roomList2[_i2];var rooms=_ref[1];
rooms.sort(function(a,b){return(b.userCount||0)-(a.userCount||0);});
}
};_proto.
getRoomList=function getRoomList(forceNoAutocomplete){
var searchid=toID(this.search);

if(!searchid){
var roomsCache=PS.mainmenu.roomsCache;
var spotLightLabel='';
var officialRooms=[],chatRooms=[],hiddenRooms=[],spotLightRooms=[];for(var _i4=0,_ref3=
roomsCache.chat||[];_i4<_ref3.length;_i4++){var room=_ref3[_i4];
if(room.section!==this.section&&this.section!=='')continue;
if(room.privacy==='hidden'){
hiddenRooms.push(room);
}else if(room.spotlight){
spotLightLabel=room.spotlight;
spotLightRooms.push(room);
}else if(room.section==='Official'){
officialRooms.push(room);
}else{
chatRooms.push(room);
}
}
return[
["Official chat rooms",officialRooms],
[spotLightLabel,spotLightRooms],
["Chat rooms",chatRooms],
["Hidden rooms",hiddenRooms]];

}

var exactMatch=false;

var rooms=PS.mainmenu.roomsCache;
var roomList=[].concat(rooms.chat||[]);for(var _i6=0,_roomList2=
roomList;_i6<_roomList2.length;_i6++){var _room=_roomList2[_i6];
if(!_room.subRooms)continue;for(var _i8=0,_room$subRooms2=
_room.subRooms;_i8<_room$subRooms2.length;_i8++){var title=_room$subRooms2[_i8];
roomList.push({
title:title,
desc:"(Subroom of "+_room.title+")"
});
}
}

var results=roomList.filter(function(room){
var titleid=toID(room.title);
if(titleid===searchid)exactMatch=true;
return titleid.startsWith(searchid)||
toID(room.title.replace(/^The /,'')).startsWith(searchid);
});
roomList=roomList.filter(function(room){return!results.includes(room);});

results=results.concat(roomList.filter(function(room){return(
toID(room.title.toLowerCase().replace(/\b([a-z0-9])[a-z0-9]*\b/g,'$1')).startsWith(searchid)||
room.title.replace(/[^A-Z0-9]+/g,'').toLowerCase().startsWith(searchid));}
));

var hidden=!exactMatch?
[["Possible secret room",[{title:this.search,desc:"(Private room?)"}]]]:[];

var autoFill=this.lastKeyCode!==127&&this.lastKeyCode>=32;
if(autoFill&&!forceNoAutocomplete){
results.sort(function(a,b){return(b.userCount||0)-(a.userCount||0);});
var firstTitle=(results[0]||hidden[0][1][0]).title;
var firstTitleOffset=0;
while(
searchid!==toID(firstTitle.slice(0,firstTitleOffset))&&
firstTitleOffset<firstTitle.length)
{
firstTitleOffset++;
}
var autoFillValue=firstTitle.slice(firstTitleOffset);
if(!autoFillValue&&toID(firstTitle)!==searchid){
autoFillValue=" \u21D2 "+firstTitle;
}
var oldSearch=this.search;
var searchElem=this.base.querySelector('input[type=search]');
if(autoFillValue){
searchElem.value=oldSearch+autoFillValue;
searchElem.setSelectionRange(oldSearch.length,oldSearch.length+autoFillValue.length);
this.search+='-';
}

return[["Search results",results]].concat(hidden);
}

return[].concat(hidden,[["Search results",results]]);
};_proto.
render=function render(){var _rooms$sectionTitles;
if(this.hidden&&PS.isVisible(this.props.room))this.hidden=false;
if(this.hidden){
return preact.h(PSPanelWrapper,{room:this.props.room,scrollable:true},null);
}
var rooms=PS.mainmenu.roomsCache;
this.updateRoomList();

return preact.h(PSPanelWrapper,{room:this.props.room,scrollable:true},preact.h("div",{"class":"pad"},
preact.h("button",{"class":"button",style:"float:right;font-size:10pt;margin-top:3px",onClick:this.hide},
preact.h("i",{"class":"fa fa-caret-right","aria-hidden":true})," Hide"
),
preact.h("div",{"class":"roomcounters"},
preact.h("a",{"class":"button",href:"users",title:"Find an online user"},
preact.h("span",{
"class":"pixelated usercount",
title:"Meloetta is PS's mascot! The Aria forme is about using its voice, and represents our chatrooms."}
),
preact.h("strong",null,rooms.userCount||'-')," users online"
)," ",
preact.h("a",{"class":"button",href:"battles",title:"Watch an active battle"},
preact.h("span",{
"class":"pixelated battlecount",
title:"Meloetta is PS's mascot! The Pirouette forme is Fighting-type, and represents our battles."}
),
preact.h("strong",null,rooms.battleCount||'-')," active battles"
)
),
preact.h("div",null,
preact.h("select",{name:"sections","class":"button",onChange:this.changeSection},
preact.h("option",{value:""},"(All rooms)"),(_rooms$sectionTitles=
rooms.sectionTitles)==null?void 0:_rooms$sectionTitles.map(function(title){
return preact.h("option",{value:title}," ",title," ");
})
),
preact.h("br",null),preact.h("br",null),
preact.h("input",{
type:"search",name:"roomsearch","class":"textbox autofocus",style:"width: 100%; max-width: 480px",
placeholder:"Join or search for rooms",autocomplete:"off",
onInput:this.changeSearch,onKeyDown:this.keyDownSearch,onBlur:this.handleOnBlur}
)
),
this.renderRoomList()
));
};_proto.
getRoomListFocusTitle=function getRoomListFocusTitle(){var _this$roomList$map$re;
return(_this$roomList$map$re=this.roomList.map(function(_ref4){var rooms=_ref4[1];return rooms;}).reduce(function(a,b){return a.concat(b);})[this.roomListFocusIndex])==null?void 0:_this$roomList$map$re.title;
};_proto.
renderRoomList=function renderRoomList(){var _this3=this;
var roomsCache=PS.mainmenu.roomsCache;
if(roomsCache.userCount===undefined){
return preact.h("div",{"class":"roomlist"},preact.h("h2",null,"Official chat rooms"),preact.h("p",null,preact.h("em",null,"Connecting...")));
}
if(this.search){

}else if(PS.isOffline){
return preact.h("div",{"class":"roomlist"},preact.h("h2",null,"Offline"));
}else if(roomsCache.userCount===undefined){
return preact.h("div",{"class":"roomlist"},preact.h("h2",null,"Official chat rooms"),preact.h("p",null,preact.h("em",null,"Connecting...")));
}


var nextOffset=0;
return this.roomList.map(function(_ref5){var title=_ref5[0],rooms=_ref5[1];
if(!rooms.length)return null;

var sortedRooms=rooms.sort(function(a,b){return(b.userCount||0)-(a.userCount||0);});
var offset=nextOffset;
nextOffset+=sortedRooms.length;
_this3.roomListLength=nextOffset;

var index=_this3.roomListFocusIndex>=offset&&_this3.roomListFocusIndex<nextOffset?
_this3.roomListFocusIndex-offset:-1;

return preact.h("div",{"class":"roomlist"},
preact.h("h2",null,title),
sortedRooms.map(function(roomInfo,i){return preact.h("div",{key:roomInfo.title},
preact.h("a",{href:"/"+toID(roomInfo.title),"class":"blocklink"+(i===index?" cur":'')},
roomInfo.userCount!==undefined&&preact.h("small",{style:"float:right"},"(",roomInfo.userCount," users)"),
preact.h("strong",null,preact.h("i",{"class":"fa fa-comment-o","aria-hidden":true})," ",roomInfo.title,preact.h("br",null)),
preact.h("small",null,roomInfo.desc||'')
),
roomInfo.subRooms&&preact.h("div",{"class":"subrooms"},
preact.h("i",{"class":"fa fa-level-up fa-rotate-90","aria-hidden":true})," Subrooms: ",
roomInfo.subRooms.map(function(roomName){return[preact.h("a",{href:"/"+toID(roomName),"class":"blocklink"},
preact.h("i",{"class":"fa fa-comment-o","aria-hidden":true})," ",preact.h("strong",null,roomName)
),' '];})
)
);})
);
});
};return RoomsPanel;}(PSRoomPanel);RoomsPanel.id='rooms';RoomsPanel.routes=['rooms'];RoomsPanel.Model=RoomsRoom;RoomsPanel.location='right';RoomsPanel.icon=preact.h("i",{"class":"fa fa-plus rooms-plus","aria-hidden":true});RoomsPanel.title="Chat Rooms";


PS.addRoomType(RoomsPanel);
//# sourceMappingURL=panel-rooms.js.map