"use strict";function _inheritsLoose(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,_setPrototypeOf(t,o);}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t;},_setPrototypeOf(t,e);}/**
 * Teambuilder panel
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license AGPLv3
 */var









PSTextarea=function(_preact$Component){function PSTextarea(){var _this;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this=_preact$Component.call.apply(_preact$Component,[this].concat(args))||this;_this.
updateSize=function(){
var textbox=_this.base.querySelector('textarea');
var textboxTest=_this.base.querySelector('textarea.heighttester');
textboxTest.style.width=textbox.offsetWidth+"px";
textboxTest.value=textbox.value;
textbox.setAttribute('data-changed',textbox.value===_this.props.initialValue?'':'1');
var newHeight=Math.max(textboxTest.scrollHeight+40,50);
textbox.style.height=newHeight+"px";
};return _this;}_inheritsLoose(PSTextarea,_preact$Component);var _proto=PSTextarea.prototype;_proto.
componentDidMount=function componentDidMount(){
var textbox=this.base.querySelector('textarea');
if(this.props.initialValue){
textbox.value=this.props.initialValue;
}
this.updateSize();
window.addEventListener('resize',this.updateSize);
};_proto.
componentWillUnmount=function componentWillUnmount(){
window.removeEventListener('resize',this.updateSize);
};_proto.
render=function render(){
return preact.h("div",{style:"position:relative"},
preact.h("textarea",{
name:this.props.name,"class":"textbox",onInput:this.updateSize,onKeyUp:this.updateSize,
style:"box-sizing:border-box;width:100%;resize:none",title:this.props.name||'text input'}
),
preact.h("div",null,preact.h("textarea",{
"class":"textbox heighttester",
style:"box-sizing:border-box;resize:none;height:50px;visibility:hidden;position:absolute;left:-200px"}
))
);
};return PSTextarea;}(preact.Component);var


TeambuilderRoom=function(_PSRoom){function TeambuilderRoom(){var _this2;for(var _len2=arguments.length,args=new Array(_len2),_key2=0;_key2<_len2;_key2++){args[_key2]=arguments[_key2];}_this2=_PSRoom.call.apply(_PSRoom,[this].concat(args))||this;_this2.
DEFAULT_FORMAT=Dex.modid;_this2.








curFolder='';_this2.
curFolderKeep='';_this2.
searchTerms=[];_this2.
exportMode=false;_this2.
exportCode=null;_this2.

clientCommands=_this2.parseClientCommands({
'newteam':function(target){
var isBox=(" "+target+" ").includes(' box ');
if((" "+target+" ").includes(' bottom ')){
PS.teams.push(this.createTeam(null,isBox));
}else{
PS.teams.unshift(this.createTeam(null,isBox));
}
this.update(null);
},
'deleteteam':function(target){
var team=PS.teams.byKey[target];
if(team)PS.teams["delete"](team);
this.update(null);
},
'undeleteteam':function(){
PS.teams.undelete();
this.update(null);
},
'backup':function(){
this.setExportMode(!this.exportMode);
this.update(null);
},
'createfolder':function(name){
if(name.includes('/')||name.includes('\\')){
PS.alert("Names can't contain slashes, since they're used as a folder separator.");
name=name.replace(/[\\/]/g,'');
}
if(name.includes('|')){
PS.alert("Names can't contain the character |, since they're used for storing teams.");
name=name.replace(/\|/g,'');
}
if(!name)return this.errorReply('Name required');

this.curFolderKeep=name+"/";
this.curFolder=name+"/";
this.update(null);
},
'renamefolder':function(name){
if(!name)return this.errorReply('New name required');
if(!this.curFolder.endsWith('/'))return this.errorReply('Not in a folder');

if(name.includes('/')||name.includes('\\')){
PS.alert("Names can't contain slashes, since they're used as a folder separator.");
name=name.replace(/[\\/]/g,'');
}
if(name.includes('|')){
PS.alert("Names can't contain the character |, since they're used for storing teams.");
name=name.replace(/\|/g,'');
}

var oldFolder=this.curFolder.slice(0,-1);for(var _i2=0,_PS$teams$list2=
PS.teams.list;_i2<_PS$teams$list2.length;_i2++){var team=_PS$teams$list2[_i2];
if(team.folder!==oldFolder)continue;
team.folder=name;
}
if(this.curFolderKeep===this.curFolder)this.curFolderKeep=name+"/";
this.curFolder=name+"/";
PS.teams.save();
this.update(null);
},
'deletefolder':function(){
if(!this.curFolder.endsWith('/'))return this.errorReply('Not in a folder');

var oldFolder=this.curFolder.slice(0,-1);for(var _i4=0,_PS$teams$list4=
PS.teams.list;_i4<_PS$teams$list4.length;_i4++){var team=_PS$teams$list4[_i4];
if(team.folder!==oldFolder)continue;
team.folder='';
}
if(this.curFolderKeep===this.curFolder)this.curFolderKeep='';
this.curFolder='';
PS.teams.save();
this.update(null);
},
'convertfoldertoprefix':function(){
if(!this.curFolder.endsWith('/'))return this.errorReply('Not in a folder');

var oldFolder=this.curFolder.slice(0,-1);for(var _i6=0,_PS$teams$list6=
PS.teams.list;_i6<_PS$teams$list6.length;_i6++){var team=_PS$teams$list6[_i6];
if(team.folder!==oldFolder)continue;
team.folder='';
team.name=oldFolder+" "+team.name;
}
if(this.curFolderKeep===this.curFolder)this.curFolderKeep='';
this.curFolder='';
PS.teams.save();
this.update(null);
}
});_this2.





































updateSearch=function(value){
if(!value){
_this2.searchTerms=[];
}else{
_this2.searchTerms=value.split(",").map(function(q){return q.trim().toLowerCase();});
}
};_this2.
matchesSearch=function(team){
if(_this2.searchTerms.length===0)return true;
var normalized=team.packedTeam.toLowerCase();
return _this2.searchTerms.every(function(term){return normalized.includes(term);});
};return _this2;}_inheritsLoose(TeambuilderRoom,_PSRoom);var _proto2=TeambuilderRoom.prototype;_proto2.sendDirect=function sendDirect(msg){PS.alert("Unrecognized command: "+msg);};_proto2.setExportMode=function setExportMode(exportMode){var partial=this.searchTerms.length||this.curFolder?'partial':true;var newExportMode=exportMode?partial:false;if(newExportMode===this.exportMode)return;this.exportMode=newExportMode;this.exportCode=null;};_proto2.createTeam=function createTeam(copyFrom){var isBox=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;if(copyFrom){return{name:"Copy of "+copyFrom.name,format:copyFrom.format,folder:copyFrom.folder,packedTeam:copyFrom.packedTeam,iconCache:null,isBox:copyFrom.isBox,key:''};}else{var format=this.curFolder&&!this.curFolder.endsWith('/')?this.curFolder:this.DEFAULT_FORMAT;var folder=this.curFolder.endsWith('/')?this.curFolder.slice(0,-1):'';return{name:(isBox?"Box":"Untitled")+" "+(PS.teams.list.length+1),format:format,folder:folder,packedTeam:'',iconCache:null,isBox:isBox,key:''};}};return TeambuilderRoom;}(PSRoom);var


TeambuilderPanel=function(_PSRoomPanel){function TeambuilderPanel(){var _this3;for(var _len3=arguments.length,args=new Array(_len3),_key3=0;_key3<_len3;_key3++){args[_key3]=arguments[_key3];}_this3=_PSRoomPanel.call.apply(_PSRoomPanel,[this].concat(args))||this;_this3.





clickFolder=function(e){
var room=_this3.props.room;
var elem=e.target;
var folder=null;
while(elem){
if(elem.getAttribute('data-href')){
return;
}
if(elem.className==='selectFolder'){
folder=elem.getAttribute('data-value')||'';
break;
}
if(elem.className==='folderlist'){
return;
}
elem=elem.parentElement;
}
if(folder===null)return;
e.preventDefault();
e.stopImmediatePropagation();
if(folder==='++'){
PS.prompt("Folder name?",{parentElem:elem,okButton:"Create"}).then(function(name){
name=(name||'').trim();
if(!name)return;

room.send("/createfolder "+name,elem);
});
return;
}
room.curFolder=folder;
_this3.forceUpdate();
};_this3.
addFormatFolder=function(ev){
var room=_this3.props.room;
var button=ev.currentTarget;
var folder=toID(button.value);
room.curFolderKeep=folder;
room.curFolder=folder;
button.value='';
_this3.forceUpdate();
};_this3.






















dragEnterTeam=function(ev){var _ev$currentTarget;
var draggedTeam=_this3.getDraggedTeam(ev);
if(draggedTeam===null)return;

var value=(_ev$currentTarget=ev.currentTarget)==null?void 0:_ev$currentTarget.getAttribute('data-teamkey');
var team=value?PS.teams.byKey[value]:null;
if(!team||team===draggedTeam)return;

var iOver=PS.teams.list.indexOf(team);
if(typeof draggedTeam==='number'){
if(iOver>=draggedTeam)PS.dragging.team=iOver+1;
PS.dragging.team=iOver;
_this3.forceUpdate();
return;
}

var iDragged=PS.teams.list.indexOf(draggedTeam);
if(iDragged<0||iOver<0)return;

PS.teams.list.splice(iDragged,1);



PS.teams.list.splice(iOver,0,draggedTeam);
_this3.forceUpdate();
};_this3.
dragEnterFolder=function(ev){var _ev$currentTarget2,_PS$dragging;
var value=((_ev$currentTarget2=ev.currentTarget)==null?void 0:_ev$currentTarget2.getAttribute('data-value'))||null;
if(value===null||((_PS$dragging=PS.dragging)==null?void 0:_PS$dragging.type)!=='team')return;
if(value==='++'||value==='')return;

PS.dragging.folder=value;
_this3.forceUpdate();
};_this3.
dragLeaveFolder=function(ev){var _ev$currentTarget3,_PS$dragging2;
var value=((_ev$currentTarget3=ev.currentTarget)==null?void 0:_ev$currentTarget3.getAttribute('data-value'))||null;
if(value===null||((_PS$dragging2=PS.dragging)==null?void 0:_PS$dragging2.type)!=='team')return;
if(value==='++'||value==='')return;

if(PS.dragging.folder===value)PS.dragging.folder=null;
_this3.forceUpdate();
};_this3.






























































dropFolder=function(ev){var _ev$currentTarget4,_PS$dragging3;
var value=((_ev$currentTarget4=ev.currentTarget)==null?void 0:_ev$currentTarget4.getAttribute('data-value'))||null;
if(value===null||((_PS$dragging3=PS.dragging)==null?void 0:_PS$dragging3.type)!=='team')return;
if(value==='++'||value==='')return;

PS.dragging.folder=null;
var team=PS.dragging.team;

if(typeof team==='number'){
TeambuilderPanel.addDraggedTeam(ev,value);
return;
}

if(value.endsWith('/')){
team.folder=value.slice(0,-1);
}else{
team.format=value;
}
PS.teams.save();
ev.stopImmediatePropagation();
_this3.forceUpdate();
};_this3.



updateSearch=function(ev){
var target=ev.currentTarget;
_this3.props.room.updateSearch(target.value);
_this3.forceUpdate();
};_this3.
clearSearch=function(){
var target=_this3.base.querySelector('input[type="search"]');
if(!target)return;
target.value='';
_this3.props.room.updateSearch('');
};_this3.


















































saveExport=function(e){var _querySelector;
var value=(_querySelector=_this3.base.querySelector('textarea[name="import"]'))==null?void 0:_querySelector.value;
if(!value)return alert('Textarea not found');
if(_this3.props.room.exportMode!==true)return alert('Wrong export mode');

var teams=PSTeambuilder.importTeamBackup(value);


PS.teams.list=[];
PS.teams.byKey={};for(var _i8=0;_i8<
teams.length;_i8++){var team=teams[_i8];PS.teams.push(team);}


var room=_this3.props.room;
room.exportMode=false;
PS.teams.update('team');
room.update(null);
};_this3.
renameFolder=function(ev){
var room=_this3.props.room;
var oldFolder=room.curFolder.slice(0,-1);
var elem=ev.currentTarget;
ev.stopImmediatePropagation();
ev.preventDefault();
PS.prompt("Rename ``"+oldFolder+"`` to?",{defaultValue:oldFolder,okButton:"Rename",parentElem:elem}).then(function(name){
name=(name||'').trim();
if(!name)return;
if(name===oldFolder)return;

room.send("/renamefolder "+name,elem);
});
};_this3.
promptDeleteFolder=function(ev){
var room=_this3.props.room;
var oldFolder=room.curFolder.slice(0,-1);
var elem=ev.currentTarget;
ev.stopImmediatePropagation();
ev.preventDefault();
PS.confirm("Delete ``"+oldFolder+"``? (doesn't delete teams)",{
okButton:"Delete",otherButtons:preact.h("button",{"class":"button","data-cmd":"/closeand /inopener /convertfoldertoprefix"},"Convert to prefix"),
parentElem:elem
}).then(function(result){
if(result)room.send("/deletefolder",elem);
});
};return _this3;}_inheritsLoose(TeambuilderPanel,_PSRoomPanel);var _proto3=TeambuilderPanel.prototype;_proto3.getDraggedTeam=function getDraggedTeam(ev){var _PS$dragging4,_ref;if(((_PS$dragging4=PS.dragging)==null?void 0:_PS$dragging4.type)==='team')return PS.dragging.team;var dataTransfer=ev.dataTransfer;if(!dataTransfer)return null;PS.dragging={type:'?'};console.log("dragging: "+dataTransfer.types+" | "+((_ref=[].concat(dataTransfer.files))==null?void 0:_ref.map(function(file){return file.name;})));if(!(dataTransfer.types.includes!=null&&dataTransfer.types.includes('Files')))return null;if(dataTransfer.files[0]&&!dataTransfer.files[0].name.endsWith('.txt'))return null;PS.dragging={type:'team',team:0,folder:null};return PS.dragging.team;};TeambuilderPanel.extractDraggedTeam=function extractDraggedTeam(ev){var _ev$dataTransfer,_file$text;var file=(_ev$dataTransfer=ev.dataTransfer)==null||(_ev$dataTransfer=_ev$dataTransfer.files)==null?void 0:_ev$dataTransfer[0];if(!file)return null;var name=file.name;if(name.slice(-4).toLowerCase()!=='.txt'){return null;}name=name.slice(0,-4);return file.text==null||(_file$text=file.text())==null?void 0:_file$text.then(function(result){var sets;try{sets=Teams["import"](result);}catch(_unused){PS.alert("Your file \""+file.name+"\" is not a valid team.");return null;}var format='';var bracketIndex=name.indexOf(']');var isBox=false;if(bracketIndex>=0){format=name.slice(1,bracketIndex);if(!format.startsWith('gen'))format='gen6'+format;if(format.endsWith('-box')){format=format.slice(0,-4);isBox=true;}name=name.slice(bracketIndex+1).trim();}return{name:name,format:format,folder:'',packedTeam:Teams.pack(sets),iconCache:null,key:'',isBox:isBox};});};TeambuilderPanel.addDraggedTeam=function addDraggedTeam(ev,folder){var _PS$dragging5,_this$extractDraggedT;var index=(_PS$dragging5=PS.dragging)==null?void 0:_PS$dragging5.team;if(typeof index!=='number')index=0;return(_this$extractDraggedT=this.extractDraggedTeam(ev))==null?void 0:_this$extractDraggedT.then(function(team){if(!team){return;}if(folder!=null&&folder.endsWith('/')){team.folder=folder.slice(0,-1);}else if(folder){team.format=folder;}PS.teams.push(team);PS.teams.list.pop();PS.teams.list.splice(index,0,team);PS.teams.save();PS.join('teambuilder');PS.update();});};TeambuilderPanel.handleDrop=function handleDrop(ev){var _PS$rooms$teambuilder;return!!this.addDraggedTeam(ev,(_PS$rooms$teambuilder=PS.rooms['teambuilder'])==null?void 0:_PS$rooms$teambuilder.curFolder);};_proto3.renderFolder=function renderFolder(value){var _PS$dragging6;var room=this.props.room;var cur=room.curFolder===value;var children;var folderOpenIcon=cur?'fa-folder-open':'fa-folder';if(value.endsWith('/')){children=[preact.h("i",{"class":"fa "+folderOpenIcon+(value==='/'?'-o':'')}),value.slice(0,-1)||'(uncategorized)'];}else if(value===''){children=[preact.h("em",null,"(all)")];}else if(value==='++'){children=[preact.h("i",{"class":"fa fa-plus","aria-hidden":true}),preact.h("em",null,"(add folder)")];}else{children=[preact.h("i",{"class":"fa "+folderOpenIcon+"-o"}),value.slice(4)||'(uncategorized)'];}var active=((_PS$dragging6=PS.dragging)==null?void 0:_PS$dragging6.folder)===value?' active':'';if(cur){return preact.h("div",{"class":"folder cur","data-value":value,onDragEnter:this.dragEnterFolder,onDragLeave:this.dragLeaveFolder,onDrop:this.dropFolder},preact.h("div",{"class":"folderhack3"},preact.h("div",{"class":"folderhack1"}),preact.h("div",{"class":"folderhack2"}),preact.h("button",{"class":"selectFolder"+active,"data-value":value},children)));}return preact.h("div",{"class":"folder","data-value":value,onDragEnter:this.dragEnterFolder,onDragLeave:this.dragLeaveFolder,onDrop:this.dropFolder},preact.h("button",{"class":"selectFolder"+active,"data-value":value},children));};_proto3.
renderFolderList=function renderFolderList(){
var room=this.props.room;






var folderTable={'':1};
var folders=[];for(var _i10=0,_PS$teams$list8=
PS.teams.list;_i10<_PS$teams$list8.length;_i10++){var team=_PS$teams$list8[_i10];
var folder=team.folder;
if(folder&&!(folder+"/"in folderTable)){
folders.push(folder+"/");
folderTable[folder+"/"]=1;
if(!('/'in folderTable)){
folders.push('/');
folderTable['/']=1;
}
}

var format=team.format||room.DEFAULT_FORMAT;
if(!(format in folderTable)){
folders.push(format);
folderTable[format]=1;
}
}
if(room.curFolderKeep.endsWith('/')||room.curFolder.endsWith('/')){
if(!('/'in folderTable)){
folders.push('/');
folderTable['/']=1;
}
}
if(!(room.curFolderKeep in folderTable)){
folderTable[room.curFolderKeep]=1;
folders.push(room.curFolderKeep);
}
if(!(room.curFolder in folderTable)){
folderTable[room.curFolder]=1;
folders.push(room.curFolder);
}

PSUtils.sortBy(folders,function(folder){return[
folder.endsWith('/')?10:-parseInt(folder.charAt(3),10),
folder];}
);

var renderedFormatFolders=[
preact.h("div",{"class":"foldersep"}),
preact.h("div",{"class":"folder"},preact.h("button",{
name:"format",value:"","data-selecttype":"teambuilder",
"class":"selectFolder","data-href":"/formatdropdown",onChange:this.addFormatFolder},

preact.h("i",{"class":"fa fa-plus","aria-hidden":true}),preact.h("em",null,"(add format folder)")
))];


var renderedFolders=[];


var gen=-1;for(var _i12=0;_i12<
folders.length;_i12++){var _format=folders[_i12];
var newGen=_format.endsWith('/')?0:parseInt(_format.charAt(3),10);
if(gen!==newGen){
gen=newGen;
if(gen===0){
renderedFolders.push.apply(renderedFolders,renderedFormatFolders);
renderedFormatFolders=[];
renderedFolders.push(preact.h("div",{"class":"foldersep"}));
renderedFolders.push(preact.h("div",{"class":"folder"},preact.h("h3",null,"Folders")));
}else{
renderedFolders.push(preact.h("div",{"class":"folder"},preact.h("h3",null,"Gen ",gen)));
}
}
renderedFolders.push(this.renderFolder(_format));
}
renderedFolders.push.apply(renderedFolders,renderedFormatFolders);

return preact.h("div",{"class":"folderlist",onClick:this.clickFolder},
preact.h("div",{"class":"folderlistbefore"}),

this.renderFolder(''),
renderedFolders,
preact.h("div",{"class":"foldersep"}),
this.renderFolder('++'),

preact.h("div",{"class":"folderlistafter"})
);
};_proto3.


visibleTeams=function visibleTeams(){var teams=arguments.length>0&&arguments[0]!==undefined?arguments[0]:PS.teams.list;
var room=this.props.room;

if(room.curFolder){
if(room.curFolder.endsWith('/')){
var filterFolder=room.curFolder.slice(0,-1);
teams=teams.filter(function(team){return!team||team.folder===filterFolder;});
}else{
var filterFormat=room.curFolder;
teams=teams.filter(function(team){return!team||team.format===filterFormat;});
}
}
if(!room.searchTerms.length)return teams;

var filteredTeams=teams.filter(function(team){return!team||room.matchesSearch(team);});
return filteredTeams;
};_proto3.

renderTeamPane=function renderTeamPane(){var _PS$dragging7,_this4=this;
var room=this.props.room;

var teams=PS.teams.list.slice();
var isDragging=false;
if(((_PS$dragging7=PS.dragging)==null?void 0:_PS$dragging7.type)==='team'&&typeof PS.dragging.team==='number'){
teams.splice(PS.dragging.team,0,null);
isDragging=true;
}else if(PS.teams.deletedTeams.length){
var undeleteIndex=PS.teams.deletedTeams[PS.teams.deletedTeams.length-1][1];
teams.splice(undeleteIndex,0,null);
}

var filterFolder=null;
var filterFormat=null;
var teamTerm='team';
if(room.curFolder){
if(room.curFolder.endsWith('/')){
filterFolder=room.curFolder.slice(0,-1);
teamTerm='team in folder';
}else{
filterFormat=room.curFolder;
if(filterFormat!==Dex.modid)teamTerm=BattleLog.formatName(filterFormat)+' team';
}
}

var filteredTeams=this.visibleTeams(teams);

if(room.exportMode){var _room$exportCode;
return preact.h("div",{"class":"teampane"},
preact.h("p",null,
preact.h("button",{"data-cmd":"/backup","class":"button"},
preact.h("i",{"class":"fa fa-caret-left","aria-hidden":true})," Back"
)," ",
room.exportMode!==true&&preact.h("button",{"class":"button",disabled:true},
preact.h("i",{"class":"fa fa-save","aria-hidden":true})," Save (not allowed for partial exports)"
),
room.exportMode===true&&preact.h("button",{onClick:this.saveExport,"class":"button"},
preact.h("i",{"class":"fa fa-save","aria-hidden":true})," Save changes"
)
),
preact.h(PSTextarea,{
name:"import",initialValue:(_room$exportCode=room.exportCode)!=null?_room$exportCode:room.exportCode=PS.teams.packAll(filteredTeams.filter(Boolean))}
)
);
}

return preact.h("div",{"class":"teampane"},
filterFolder?
preact.h("h2",null,
preact.h("i",{"class":"fa fa-folder-open","aria-hidden":true})," ",filterFolder," ",
preact.h("button",{"class":"button small",style:"margin-left:5px",onClick:this.renameFolder},
preact.h("i",{"class":"fa fa-pencil","aria-hidden":true})," Rename"
)," ",
preact.h("button",{"class":"button small",style:"margin-left:5px",onClick:this.promptDeleteFolder},
preact.h("i",{"class":"fa fa-times","aria-hidden":true})," Remove"
)
):
filterFolder===''?
preact.h("h2",null,preact.h("i",{"class":"fa fa-folder-open-o","aria-hidden":true})," Teams not in any folders"):
filterFormat?
preact.h("h2",null,preact.h("i",{"class":"fa fa-folder-open-o","aria-hidden":true})," ",filterFormat," ",preact.h("small",null,"(",teams.length,")")):

preact.h("h2",null,"All Teams ",preact.h("small",null,"(",teams.length,")")),

preact.h("p",null,
preact.h("button",{"data-cmd":"/newteam","class":"button big"},
preact.h("i",{"class":"fa fa-plus-circle","aria-hidden":true})," New ",teamTerm
)," ",
preact.h("button",{"data-cmd":"/newteam box","class":"button"},
preact.h("i",{"class":"fa fa-archive","aria-hidden":true})," New box"
),
preact.h("input",{
type:"search","class":"textbox",placeholder:"Search teams",
style:"margin-left:5px;",onKeyUp:this.updateSearch}
)
),
preact.h("ul",{"class":"teamlist"},
!teams.length?
preact.h("li",null,preact.h("em",null,"you have no teams lol")):
!filteredTeams.length&&room.searchTerms.length?
preact.h("li",null,preact.h("em",null,"you have no teams matching ",preact.h("code",null,room.searchTerms.join(", ")))):
!filteredTeams.length?
preact.h("li",null,preact.h("em",null,"you have no teams in this folder")):
filteredTeams.map(function(team){var _team$uploaded;return team?
preact.h("li",{key:team.key,onDragEnter:_this4.dragEnterTeam,"data-teamkey":team.key},
preact.h(TeamBox,{team:team,onClick:_this4.clearSearch})," ",
!team.uploaded&&preact.h("button",{"data-cmd":"/deleteteam "+team.key,"class":"option"},
preact.h("i",{"class":"fa fa-trash","aria-hidden":true})," Delete"
)," ",
(_team$uploaded=team.uploaded)!=null&&_team$uploaded["private"]?
preact.h("i",{"class":"fa fa-cloud gray"}):
team.uploaded?
preact.h("i",{"class":"fa fa-globe gray"}):
team.teamid?
preact.h("i",{"class":"fa fa-plug gray"}):

null

):
isDragging?
preact.h("li",{key:"dragging"},
preact.h("div",{"class":"team"})
):

preact.h("li",{key:"undelete"},
preact.h("button",{"data-cmd":"/undeleteteam","class":"option"},
preact.h("i",{"class":"fa fa-undo","aria-hidden":true})," Undo delete"
)
);}
)
),
preact.h("p",null,
preact.h("button",{"data-cmd":"/newteam bottom","class":"button"},
preact.h("i",{"class":"fa fa-plus-circle","aria-hidden":true})," New ",teamTerm
)," ",
preact.h("button",{"data-cmd":"/newteam box bottom","class":"button"},
preact.h("i",{"class":"fa fa-archive","aria-hidden":true})," New box"
)
),
preact.h("p",null,
preact.h("button",{"data-cmd":"/backup","class":"button"},
preact.h("i",{"class":"fa fa-file-code-o","aria-hidden":true})," Backup",
room.searchTerms.length?' search results':room.curFolder?' folder':''
)
)
);
};_proto3.
render=function render(){
var room=this.props.room;

return preact.h(PSPanelWrapper,{room:room},
preact.h("div",{"class":"folderpane"},
this.renderFolderList()
),
this.renderTeamPane()
);
};return TeambuilderPanel;}(PSRoomPanel);TeambuilderPanel.id='teambuilder';TeambuilderPanel.routes=['teambuilder'];TeambuilderPanel.Model=TeambuilderRoom;TeambuilderPanel.icon=preact.h("i",{"class":"fa fa-pencil-square-o","aria-hidden":true});TeambuilderPanel.title='Teambuilder';


PS.addRoomType(TeambuilderPanel);
//# sourceMappingURL=panel-teambuilder.js.map