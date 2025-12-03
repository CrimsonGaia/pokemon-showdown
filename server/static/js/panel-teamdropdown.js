"use strict";function _inheritsLoose(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,_setPrototypeOf(t,o);}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t;},_setPrototypeOf(t,e);}/**
 * Team Selector Panel
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license AGPLv3
 */var






PSTeambuilder=function(){function PSTeambuilder(){}PSTeambuilder.
exportPackedTeam=function exportPackedTeam(team,newFormat){
var sets=Teams.unpack(team.packedTeam);
var dex=Dex.forFormat(team.format);
return Teams["export"](sets,dex,newFormat);
};PSTeambuilder.
splitPrefix=function splitPrefix(buffer,delimiter){var prefixOffset=arguments.length>2&&arguments[2]!==undefined?arguments[2]:0;
var delimIndex=buffer.indexOf(delimiter);
if(delimIndex<0)return['',buffer];
return[buffer.slice(prefixOffset,delimIndex),buffer.slice(delimIndex+delimiter.length)];
};PSTeambuilder.
splitLast=function splitLast(buffer,delimiter){
var delimIndex=buffer.lastIndexOf(delimiter);
if(delimIndex<0)return[buffer,''];
return[buffer.slice(0,delimIndex),buffer.slice(delimIndex+delimiter.length)];
};PSTeambuilder.
importTeamBackup=function importTeamBackup(buffer){
var teams=[];
var lines=buffer.split("\n");

var curTeam=null;
var sets=null;

var curSet=null;

while(lines.length&&!lines[0])lines.shift();
while(lines.length&&!lines[lines.length-1])lines.pop();for(var _i2=0;_i2<

lines.length;_i2++){var line=lines[_i2];
line=line.trim();
if(line===''||line==='---'){
curSet=null;
}else if(line.startsWith('===')){
if(curTeam){

curTeam.packedTeam=Teams.pack(sets);
teams.push(curTeam);
}

curTeam={
name:'',
format:'',
packedTeam:'',
folder:'',
key:'',
iconCache:'',
isBox:false
};
sets=[];

line=line.slice(3,-3).trim();var _ref=
this.splitPrefix(line,']',1);curTeam.format=_ref[0];line=_ref[1];
if(!curTeam.format)curTeam.format='gen8';else
if(!curTeam.format.startsWith('gen'))curTeam.format="gen6"+curTeam.format;var _this$splitPrefix=

this.splitPrefix(line,'/');curTeam.folder=_this$splitPrefix[0];curTeam.name=_this$splitPrefix[1];
}else if(line.includes('|')){
if(curTeam){

curTeam.packedTeam=Teams.pack(sets);
teams.push(curTeam);
}
curTeam=null;
curSet=null;
var team=PS.teams.unpackLine(line);
if(team)teams.push(team);
}else if(!curSet){
if(!sets)continue;
curSet={
name:'',species:'',gender:'',
moves:[]
};
sets.push(curSet);
Teams.parseExportedTeamLine(line,true,curSet);
}else{
Teams.parseExportedTeamLine(line,false,curSet);
}
}
if(curTeam){
curTeam.packedTeam=Teams.pack(sets);
teams.push(curTeam);
}
return teams;
};PSTeambuilder.


dragStart=function dragStart(ev){var _ev$currentTarget;
var href=(_ev$currentTarget=ev.currentTarget)==null?void 0:_ev$currentTarget.getAttribute('href');
var team=href?PS.teams.byKey[href.slice(5)]:null;
if(!team)return;

var dataTransfer=ev.dataTransfer;
if(dataTransfer){
dataTransfer.effectAllowed='copyMove';
dataTransfer.setData("text/plain","[Team] "+team.name);
var filename=team.name;
if(team.format)filename='['+team.format+'] '+filename;
filename=$.trim(filename).replace(/[\\/]+/g,'')+'.txt';
var urlprefix="data:text/plain;base64,";
var contents=PSTeambuilder.exportPackedTeam(team).replace(/\n/g,'\r\n');
var downloadurl="text/plain:"+filename+":"+urlprefix+encodeURIComponent(window.btoa(unescape(encodeURIComponent(contents))));
console.log(downloadurl);
dataTransfer.setData("DownloadURL",downloadurl);
}

PS.dragging={type:'team',team:team,folder:null};









};return PSTeambuilder;}();PSTeambuilder.draggedTeam=null;


function TeamBox(props)




{
var team=props.team;
var contents;
if(team){
team.iconCache||(team.iconCache=team.packedTeam?
Teams.unpackSpeciesOnly(team.packedTeam).map(


function(pokemon){return PSIcon({pokemon:pokemon});}
):

preact.h("em",null,"(empty ",team.isBox?'box':'team',")"));

var format=team.format;
if(format.startsWith(Dex.modid))format=format.slice(4);
format=(format?"["+format+"] ":"")+(team.folder?team.folder+"/":"");
contents=[
preact.h("strong",null,team.isBox&&preact.h("i",{"class":"fa fa-archive"})," ",format&&preact.h("span",null,format),team.name),
preact.h("small",null,team.iconCache)];

}else{
contents=[
preact.h("em",null,"Select a team")];

}
var className="team"+(team!=null&&team.isBox?' pc-box':'');
if(props.button){
return preact.h("button",{"class":className,value:team?team.key:''},
contents
);
}
if(props.noLink){
return preact.h("div",{"class":className},
contents
);
}
return preact.h("a",{
href:"team-"+(team?team.key:''),"class":className,draggable:true,
onDragStart:PSTeambuilder.dragStart,onClick:props.onClick},

contents
);
}var





TeamDropdownPanel=function(_PSRoomPanel){function TeamDropdownPanel(){var _this;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this=_PSRoomPanel.call.apply(_PSRoomPanel,[this].concat(args))||this;_this.




gen='';_this.
format=null;_this.








setFormat=function(ev){
var target=ev.currentTarget;
_this.format=target.name==='format'&&target.value||'';
_this.gen=target.name==='gen'&&target.value||'';
ev.preventDefault();
ev.stopImmediatePropagation();
_this.forceUpdate();
};_this.
click=function(e){
var curTarget=e.target;
var target;
while(curTarget&&curTarget!==e.currentTarget){
if(curTarget.tagName==='BUTTON'){
target=curTarget;
}
curTarget=curTarget.parentElement;
}
if(!target)return;

PS.teams.loadTeam(PS.teams.byKey[target.value],true);
_this.chooseParentValue(target.value);
};return _this;}_inheritsLoose(TeamDropdownPanel,_PSRoomPanel);var _proto=TeamDropdownPanel.prototype;_proto.getTeams=function getTeams(){var _this2=this;if(!this.format&&!this.gen)return PS.teams.list;return PS.teams.list.filter(function(team){if(_this2.gen&&!team.format.startsWith(_this2.gen))return false;if(_this2.format&&team.format!==_this2.format)return false;return true;});};_proto.
render=function render(){var _this3=this;
var room=this.props.room;
if(!room.parentElem){
return preact.h(PSPanelWrapper,{room:room},
preact.h("p",null,"Error: You tried to open a team selector, but you have nothing to select a team for.")
);
}
var baseFormat=room.parentElem.getAttribute('data-format')||Dex.modid;
var isFirstLoad=this.format===null;
if(isFirstLoad){
this.format=baseFormat;
}
var teams=this.getTeams();
if(!teams.length&&this.format&&isFirstLoad){
this.gen=this.format.slice(0,4);
this.format='';
teams=this.getTeams();
}
if(!teams.length&&this.gen&&isFirstLoad){
this.gen='';
teams=this.getTeams();
}

var availableWidth=document.body.offsetWidth;
var width=307;
if(availableWidth>636)width=613;
if(availableWidth>945)width=919;

var teamBuckets={};for(var _i4=0,_teams2=
teams;_i4<_teams2.length;_i4++){var team=_teams2[_i4];
var list=teamBuckets[team.folder]||(teamBuckets[team.folder]=[]);
list.push(team);
}

var teamList=[];

var baseGen=baseFormat.slice(0,4);
var genList=[];for(var _i6=0,_PS$teams$list2=
PS.teams.list;_i6<_PS$teams$list2.length;_i6++){var _team=_PS$teams$list2[_i6];
var gen=_team.format.slice(0,4);
if(gen&&!genList.includes(gen))genList.push(gen);
}
var hasOtherGens=genList.length>1||genList[0]!==baseGen;

teamList.push(preact.h("p",null,
baseFormat.length>4&&
preact.h("button",{
"class":'button'+(baseFormat===this.format?' disabled':''),
onClick:this.setFormat,name:"format",value:baseFormat},

preact.h("i",{"class":"fa fa-folder-o","aria-hidden":true})," [",baseFormat.slice(0,4),"] ",baseFormat.slice(4)
),
" ",
preact.h("button",{
"class":'button'+(baseGen===this.format?' disabled':''),onClick:this.setFormat,name:"format",value:baseGen},

preact.h("i",{"class":"fa fa-folder-o","aria-hidden":true})," [",baseGen,"] ",preact.h("em",null,"(uncategorized)")
)," ",
preact.h("button",{
"class":'button'+(baseGen===this.gen?' disabled':''),onClick:this.setFormat,name:"gen",value:baseGen},

preact.h("i",{"class":"fa fa-folder-o","aria-hidden":true})," [",baseGen,"] ",preact.h("em",null,"(all)")
)," ",
hasOtherGens&&!this.gen&&
preact.h("button",{"class":"button",onClick:this.setFormat,name:"gen",value:baseGen},"Other gens")

));

if(hasOtherGens&&this.gen){
teamList.push(preact.h("h2",null,"Other gens"));
teamList.push(preact.h("p",null,genList.sort().map(function(gen){return[
preact.h("button",{"class":'button'+(gen===_this3.gen?' disabled':''),onClick:_this3.setFormat,name:"gen",value:gen},
preact.h("i",{"class":"fa fa-folder-o","aria-hidden":true})," [",gen,"] ",preact.h("em",null,"(all)")
),
" "];}
)));
}

var isEmpty=true;
for(var folder in teamBuckets){
if(folder&&(this.gen||this.format)){
teamList.push(preact.h("h2",null,
preact.h("i",{"class":"fa fa-folder-open","aria-hidden":true})," ",folder," + ",
preact.h("i",{"class":"fa fa-folder-open-o","aria-hidden":true})," ",this.format||this.gen
));
}else if(folder){
teamList.push(preact.h("h2",null,
preact.h("i",{"class":"fa fa-folder-open","aria-hidden":true})," ",folder
));
}else if(this.gen||this.format){
teamList.push(preact.h("h2",null,
preact.h("i",{"class":"fa fa-folder-open-o","aria-hidden":true})," ",this.format||this.gen
));
}else{
teamList.push(preact.h("h2",null,
preact.h("i",{"class":"fa fa-folder-open-o","aria-hidden":true})," Teams not in any folders"
));
}
teamList.push(preact.h("ul",{"class":"teamdropdown",onClick:this.click},
teamBuckets[folder].map(function(team){return preact.h("li",{key:team.key,style:{display:'inline-block'}},
preact.h(TeamBox,{team:team,button:true})
);})
));
isEmpty=false;
}

return preact.h(PSPanelWrapper,{room:room,width:width},preact.h("div",{"class":"pad"},
teamList,
isEmpty&&preact.h("p",null,preact.h("em",null,"No teams found"))
));
};return TeamDropdownPanel;}(PSRoomPanel);TeamDropdownPanel.id='teamdropdown';TeamDropdownPanel.routes=['teamdropdown'];TeamDropdownPanel.location='semimodal-popup';TeamDropdownPanel.noURL=true;var






















FormatDropdownPanel=function(_PSRoomPanel2){function FormatDropdownPanel(){var _this4;for(var _len2=arguments.length,args=new Array(_len2),_key2=0;_key2<_len2;_key2++){args[_key2]=arguments[_key2];}_this4=_PSRoomPanel2.call.apply(_PSRoomPanel2,[this].concat(args))||this;_this4.




gen='';_this4.
format=null;_this4.
search='';_this4.
click=function(e){var _curTarget;
var curTarget=e.target;
var target;
if(((_curTarget=curTarget)==null?void 0:_curTarget.tagName)==='I')return;
while(curTarget&&curTarget!==e.currentTarget){
if(curTarget.tagName==='BUTTON'){
target=curTarget;
}
curTarget=curTarget.parentElement;
}
if(!target)return;

_this4.chooseParentValue(target.value);
};_this4.
updateSearch=function(ev){
_this4.search=ev.currentTarget.value;
_this4.forceUpdate();
};_this4.
toggleGen=function(ev){
var target=ev.currentTarget;
_this4.gen=_this4.gen===target.value?'':target.value;
_this4.forceUpdate();
};return _this4;}_inheritsLoose(FormatDropdownPanel,_PSRoomPanel2);var _proto2=FormatDropdownPanel.prototype;_proto2.
render=function render(){var _this5=this;
var room=this.props.room;
if(!room.parentElem){
return preact.h(PSPanelWrapper,{room:room},
preact.h("p",null,"Error: You tried to open a format selector, but you have nothing to select a format for.")
);
}

var formatsLoaded=!!window.BattleFormats;
if(formatsLoaded){
formatsLoaded=false;

for(var i in window.BattleFormats){
formatsLoaded=true;
break;
}
}
var curGen=function(gen){return _this5.gen===gen?' cur':'';};
var searchBar=preact.h("div",{style:"margin-bottom: 0.5em"},
preact.h("input",{
type:"search",name:"search",placeholder:"Search formats","class":"textbox autofocus",autocomplete:"off",
onInput:this.updateSearch,onChange:this.updateSearch}
)," ",
preact.h("button",{onClick:this.toggleGen,value:"gen9","class":"button button-first"+curGen('gen9')},"Gen 9"),
preact.h("button",{onClick:this.toggleGen,value:"gen8","class":"button button-middle"+curGen('gen8')},"8"),
preact.h("button",{onClick:this.toggleGen,value:"gen7","class":"button button-middle"+curGen('gen7')},"7"),
preact.h("button",{onClick:this.toggleGen,value:"gen6","class":"button button-middle"+curGen('gen6')},"6"),
preact.h("button",{onClick:this.toggleGen,value:"gen5","class":"button button-middle"+curGen('gen5')},"5"),
preact.h("button",{onClick:this.toggleGen,value:"gen4","class":"button button-middle"+curGen('gen4')},"4"),
preact.h("button",{onClick:this.toggleGen,value:"gen3","class":"button button-middle"+curGen('gen3')},"3"),
preact.h("button",{onClick:this.toggleGen,value:"gen2","class":"button button-middle"+curGen('gen2')},"2"),
preact.h("button",{onClick:this.toggleGen,value:"gen1","class":"button button-last"+curGen('gen1')},"1")
);
if(!formatsLoaded){
return preact.h(PSPanelWrapper,{room:room},preact.h("div",{"class":"pad"},
searchBar,
preact.h("p",null,"Loading...")
));
}






var selectType=
room.parentElem.getAttribute('data-selecttype')||'challenge';

var curFormat=toID(room.parentElem.value);
var formats=Object.values(BattleFormats).filter(function(format){
if(selectType==='challenge'&&format.challengeShow===false)return false;
if(selectType==='search'&&format.searchShow===false)return false;
if(selectType==='tournament'&&format.tournamentShow===false)return false;
if(selectType==='teambuilder'&&format.team)return false;
return true;
});

var curSection='';
var curColumnNum=0;
var curColumn=[];
var columns=[curColumn];
var searchID=toID(this.search);for(var _i8=0;_i8<
formats.length;_i8++){var format=formats[_i8];
if(searchID&&!toID(format.name).includes(searchID)){
continue;
}
if(this.gen&&!format.id.startsWith(this.gen))continue;

if(format.column!==curColumnNum){
if(curColumn.length){
curColumn=[];
columns.push(curColumn);
}
curColumnNum=format.column;
}
if(format.section!==curSection){
curSection=format.section;
if(curSection){
curColumn.push({id:null,section:curSection});
}
}
curColumn.push(format);
}
if(this.gen&&selectType==='teambuilder'){
columns[0].unshift({
id:this.gen,
name:"[Gen "+this.gen.slice(3)+"]",
section:'No Format'
});
}

var width=Math.max(columns.length,2.1)*225+30;
var noResults=curColumn.length===0;
var starredPrefs=PS.prefs.starredformats||{};

var starred=Object.keys(starredPrefs).filter(function(id){return starredPrefs[id]===true;}).reverse();
var starredDone=false;

return preact.h(PSPanelWrapper,{room:room,width:width},preact.h("div",{"class":"pad"},
searchBar,
columns.map(function(column){return(
preact.h("ul",{"class":"options",onClick:_this5.click},
!starredDone&&(starred==null?void 0:starred.map(function(id,i){
if(_this5.gen&&!id.startsWith(_this5.gen))return null;
var format=BattleFormats[id];
if(/^gen[1-9]$/.test(id)){
format||(format={
id:id,
name:"[Gen "+id.slice(3)+"]",
section:'No Format',
challengeShow:false,
searchShow:false
});
}
if(!format)return null;
if(i===starred.length-1)starredDone=true;
if(selectType==='challenge'&&format.challengeShow===false)return null;
if(selectType==='search'&&format.searchShow===false)return null;
if(selectType==='teambuilder'&&format.team)return null;
return preact.h("li",null,preact.h("button",{value:format.name,"class":"option"+(curFormat===format.id?' cur':'')},
format.name.replace('[Gen 8 ','[').replace('[Gen 9] ','').replace('[Gen 7 ','['),
format.section==='No Format'&&preact.h("em",null," (uncategorized)"),
preact.h("i",{"class":"star fa fa-star cur","data-cmd":"/unstar "+format.id})
));
})),
column.map(function(format){

if(starred.includes(format.id||''))return'';
if(format.id){
return preact.h("li",null,preact.h("button",{
value:format.name,
"class":"option"+(curFormat===format.id?' cur':'')},

format.name.replace('[Gen 8 ','[').replace('[Gen 9] ','').replace('[Gen 7 ','['),
format.section==='No Format'&&preact.h("em",null," (uncategorized)"),
preact.h("i",{"class":"star fa fa-star-o","data-cmd":"/star "+format.id})
));
}else{
return preact.h("li",null,preact.h("h3",null,format.section));
}
})
));}
),
noResults&&preact.h("p",null,
preact.h("em",null,"No formats",!!searchID&&" matching \""+searchID+"\""," found")
),
preact.h("div",{style:"float: left"})
));
};return FormatDropdownPanel;}(PSRoomPanel);FormatDropdownPanel.id='formatdropdown';FormatDropdownPanel.routes=['formatdropdown'];FormatDropdownPanel.location='semimodal-popup';FormatDropdownPanel.noURL=true;


PS.addRoomType(TeamDropdownPanel,FormatDropdownPanel);
//# sourceMappingURL=panel-teamdropdown.js.map