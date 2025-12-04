"use strict";/**
 * Teams
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Functions for converting and generating teams.
 *
 * @license MIT
 */


















































































































var Teams=new(function(){function Teams(){}var _proto=Teams.prototype;_proto.
pack=function pack(team){
if(!team)return'';

function getIv(ivs,s){
return ivs[s]===31||ivs[s]===undefined?'':ivs[s].toString();
}

var buf='';for(var _i2=0;_i2<
team.length;_i2++){var set=team[_i2];
if(buf)buf+=']';


buf+=set.name||set.species;


var id=this.packName(set.species||set.name);
buf+="|"+(this.packName(set.name||set.species)===id?'':id);


buf+="|"+this.packName(set.item);


buf+="|"+this.packName(set.ability);


buf+='|'+set.moves.map(this.packName).join(',');


buf+="|"+(set.nature||'');


var evs='|';
if(set.evs){
evs="|"+(set.evs['hp']||'')+","+(set.evs['atk']||'')+","+(set.evs['def']||'')+","+((
set.evs['spa']||'')+","+(set.evs['spd']||'')+","+(set.evs['spe']||''));
}
if(evs==='|,,,,,'){
buf+='|';
}else{
buf+=evs;
}


if(set.gender){
buf+="|"+set.gender;
}else{
buf+='|';
}


var ivs='|';
if(set.ivs){
ivs="|"+getIv(set.ivs,'hp')+","+getIv(set.ivs,'atk')+","+getIv(set.ivs,'def')+","+(
getIv(set.ivs,'spa')+","+getIv(set.ivs,'spd')+","+getIv(set.ivs,'spe'));
}
if(ivs==='|,,,,,'){
buf+='|';
}else{
buf+=ivs;
}


if(set.shiny){
buf+='|S';
}else{
buf+='|';
}


if(set.level&&set.level!==100){
buf+="|"+set.level;
}else{
buf+='|';
}


if(set.happiness!==undefined&&set.happiness!==255){
buf+="|"+set.happiness;
}else{
buf+='|';
}

if(set.pokeball||set.hpType||set.gigantamax||
set.dynamaxLevel!==undefined&&set.dynamaxLevel!==10||set.teraType){
buf+=","+(set.hpType||'');
buf+=","+this.packName(set.pokeball||'');
buf+=","+(set.gigantamax?'G':'');
buf+=","+(set.dynamaxLevel!==undefined&&set.dynamaxLevel!==10?set.dynamaxLevel:'');
buf+=","+(set.teraType||'');
}
}

return buf;
};_proto.

unpack=function unpack(buf){var _this=this;
if(!buf)return null;
if(typeof buf!=='string')return buf;
if(buf.startsWith('[')&&buf.endsWith(']')){
try{
buf=this.pack(JSON.parse(buf));
}catch(_unused){
return null;
}
}

var team=[];
var i=0;
var j=0;


for(var count=0;count<24;count++){
var set={};
team.push(set);


j=buf.indexOf('|',i);
if(j<0)return null;
set.name=buf.substring(i,j);
i=j+1;


j=buf.indexOf('|',i);
if(j<0)return null;
set.species=this.unpackName(buf.substring(i,j),Dex.species)||set.name;
i=j+1;


j=buf.indexOf('|',i);
if(j<0)return null;
set.item=this.unpackName(buf.substring(i,j),Dex.items);
i=j+1;


j=buf.indexOf('|',i);
if(j<0)return null;
var ability=buf.substring(i,j);
var species=Dex.species.get(set.species);
set.ability=['','0','1','H','S'].includes(ability)?
species.abilities[ability||'0']||(ability===''?'':'!!!ERROR!!!'):
this.unpackName(ability,Dex.abilities);
i=j+1;


j=buf.indexOf('|',i);
if(j<0)return null;
set.moves=buf.substring(i,j).split(',',24).map(function(name){return _this.unpackName(name,Dex.moves);});
i=j+1;


j=buf.indexOf('|',i);
if(j<0)return null;
set.nature=this.unpackName(buf.substring(i,j),Dex.natures);
i=j+1;


j=buf.indexOf('|',i);
if(j<0)return null;
if(j!==i){
var evs=buf.substring(i,j).split(',',6);
set.evs={
hp:Number(evs[0])||0,
atk:Number(evs[1])||0,
def:Number(evs[2])||0,
spa:Number(evs[3])||0,
spd:Number(evs[4])||0,
spe:Number(evs[5])||0
};
}
i=j+1;


j=buf.indexOf('|',i);
if(j<0)return null;
if(i!==j)set.gender=buf.substring(i,j);
i=j+1;


j=buf.indexOf('|',i);
if(j<0)return null;
if(j!==i){
var ivs=buf.substring(i,j).split(',',6);
set.ivs={
hp:ivs[0]===''?31:Number(ivs[0])||0,
atk:ivs[1]===''?31:Number(ivs[1])||0,
def:ivs[2]===''?31:Number(ivs[2])||0,
spa:ivs[3]===''?31:Number(ivs[3])||0,
spd:ivs[4]===''?31:Number(ivs[4])||0,
spe:ivs[5]===''?31:Number(ivs[5])||0
};
}
i=j+1;


j=buf.indexOf('|',i);
if(j<0)return null;
if(i!==j)set.shiny=true;
i=j+1;


j=buf.indexOf('|',i);
if(j<0)return null;
if(i!==j)set.level=parseInt(buf.substring(i,j));
i=j+1;


j=buf.indexOf(']',i);
var misc=void 0;
if(j<0){
if(i<buf.length)misc=buf.substring(i).split(',',6);
}else{
if(i!==j)misc=buf.substring(i,j).split(',',6);
}
if(misc){
set.happiness=misc[0]?Number(misc[0]):255;
set.hpType=misc[1]||'';
set.pokeball=this.unpackName(misc[2]||'',Dex.items);
set.gigantamax=!!misc[3];
set.dynamaxLevel=misc[4]?Number(misc[4]):10;
set.teraType=misc[5];
}
if(j<0)break;
i=j+1;
}

return team;
};_proto.


packName=function packName(name){
if(!name)return'';
return name.replace(/[^A-Za-z0-9]+/g,'');
};_proto.


unpackName=function unpackName(name,dexTable){
if(!name)return'';
if(dexTable){
var obj=dexTable.get(name);
if(obj.exists)return obj.name;
}
return name.replace(/([0-9]+)/g,' $1 ').replace(/([A-Z])/g,' $1').replace(/[ ][ ]/g,' ').trim();
};_proto["export"]=




function _export(team,options){
var output='';for(var _i4=0;_i4<
team.length;_i4++){var set=team[_i4];
output+=this.exportSet(set,options)+"\n";
}
return output;
};_proto.

exportSet=function exportSet(set){var _ref=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{},hideStats=_ref.hideStats,removeNicknames=_ref.removeNicknames;
var out="";


if(typeof removeNicknames==='function'&&set.name&&set.name!==set.species){
set.name=removeNicknames(set.name)||set.species;
}
if(set.name&&set.name!==set.species&&removeNicknames!==true){
out+=set.name+" ("+set.species+")";
}else{
out+=set.species;
}
if(set.gender==='M')out+=" (M)";
if(set.gender==='F')out+=" (F)";
if(set.item)out+=" @ "+set.item;
out+="  \n";

if(set.ability){
out+="Ability: "+set.ability+"  \n";
}


if(set.level&&set.level!==100){
out+="Level: "+set.level+"  \n";
}
if(set.shiny){
out+="Shiny: Yes  \n";
}
if(typeof set.happiness==='number'&&set.happiness!==255&&!isNaN(set.happiness)){
out+="Happiness: "+set.happiness+"  \n";
}
if(set.pokeball){
out+="Pokeball: "+set.pokeball+"  \n";
}
if(set.hpType){
out+="Hidden Power: "+set.hpType+"  \n";
}
if(typeof set.dynamaxLevel==='number'&&set.dynamaxLevel!==10&&!isNaN(set.dynamaxLevel)){
out+="Dynamax Level: "+set.dynamaxLevel+"  \n";
}
if(set.gigantamax){
out+="Gigantamax: Yes  \n";
}
if(set.teraType){
out+="Tera Type: "+set.teraType+"  \n";
}


if(!hideStats){
if(set.evs){
var stats=Dex.stats.ids().map(
function(stat){return set.evs[stat]?
set.evs[stat]+" "+Dex.stats.shortNames[stat]:"";}
).filter(Boolean);
if(stats.length){
out+="EVs: "+stats.join(" / ")+"  \n";
}
}
if(set.nature){
out+=set.nature+" Nature  \n";
}
if(set.ivs){
var _stats=Dex.stats.ids().map(
function(stat){return set.ivs[stat]!==31&&set.ivs[stat]!==undefined?(
set.ivs[stat]||0)+" "+Dex.stats.shortNames[stat]:"";}
).filter(Boolean);
if(_stats.length){
out+="IVs: "+_stats.join(" / ")+"  \n";
}
}
}for(var _i6=0,_set$moves2=


set.moves;_i6<_set$moves2.length;_i6++){var move=_set$moves2[_i6];
if(move.startsWith("Hidden Power ")&&move.charAt(13)!=='['){
move="Hidden Power ["+move.slice(13)+"]";
}
out+="- "+move+"  \n";
}

return out;
};_proto.

parseExportedTeamLine=function parseExportedTeamLine(line,isFirstLine,set,aggressive){
if(isFirstLine){
var item;var _line$split=
line.split(' @ ');line=_line$split[0];item=_line$split[1];
if(item){
set.item=item;
if(toID(set.item)==='noitem')set.item='';
}
if(line.endsWith(' (M)')){
set.gender='M';
line=line.slice(0,-4);
}
if(line.endsWith(' (F)')){
set.gender='F';
line=line.slice(0,-4);
}
if(line.endsWith(')')&&line.includes('(')){
var _line$slice$split=line.slice(0,-1).split('('),name=_line$slice$split[0],species=_line$slice$split[1];
set.species=Dex.species.get(species).name;
set.name=name.trim();
}else{
set.species=Dex.species.get(line).name;
set.name='';
}
}else if(line.startsWith('Trait: ')){
line=line.slice(7);
set.ability=aggressive?toID(line):line;
}else if(line.startsWith('Ability: ')){
line=line.slice(9);
set.ability=aggressive?toID(line):line;
}else if(line==='Shiny: Yes'){
set.shiny=true;
}else if(line.startsWith('Level: ')){
line=line.slice(7);
set.level=+line;
}else if(line.startsWith('Happiness: ')){
line=line.slice(11);
set.happiness=+line;
}else if(line.startsWith('Pokeball: ')){
line=line.slice(10);
set.pokeball=aggressive?toID(line):line;
}else if(line.startsWith('Hidden Power: ')){
line=line.slice(14);
set.hpType=aggressive?toID(line):line;
}else if(line.startsWith('Tera Type: ')){
line=line.slice(11);
set.teraType=aggressive?line.replace(/[^a-zA-Z0-9]/g,''):line;
}else if(line==='Gigantamax: Yes'){
set.gigantamax=true;
}else if(line.startsWith('EVs: ')){
line=line.slice(5);
var evLines=line.split('/');
set.evs={hp:0,atk:0,def:0,spa:0,spd:0,spe:0};for(var _i8=0;_i8<
evLines.length;_i8++){var evLine=evLines[_i8];
var _evLine$trim$split=evLine.trim().split(' '),statValue=_evLine$trim$split[0],statName=_evLine$trim$split[1];
var statid=Dex.stats.getID(statName);
if(!statid)continue;
var value=parseInt(statValue);
set.evs[statid]=value;
}
}else if(line.startsWith('IVs: ')){
line=line.slice(5);
var ivLines=line.split('/');
set.ivs={hp:31,atk:31,def:31,spa:31,spd:31,spe:31};for(var _i10=0;_i10<
ivLines.length;_i10++){var ivLine=ivLines[_i10];
var _ivLine$trim$split=ivLine.trim().split(' '),_statValue=_ivLine$trim$split[0],_statName=_ivLine$trim$split[1];
var _statid=Dex.stats.getID(_statName);
if(!_statid)continue;
var _value=parseInt(_statValue);
if(isNaN(_value))_value=31;
set.ivs[_statid]=_value;
}
}else if(/^[A-Za-z]+ (N|n)ature/.test(line)){
var natureIndex=line.indexOf(' Nature');
if(natureIndex===-1)natureIndex=line.indexOf(' nature');
if(natureIndex===-1)return;
line=line.substr(0,natureIndex);
if(line!=='undefined')set.nature=aggressive?toID(line):line;
}else if(line.startsWith('-')||line.startsWith('~')){
line=line.slice(line.charAt(1)===' '?2:1);
if(line.startsWith('Hidden Power [')){
var hpType=line.slice(14,-1);
line='Hidden Power '+hpType;
if(!set.ivs&&Dex.types.isName(hpType)){
set.ivs={hp:31,atk:31,def:31,spa:31,spd:31,spe:31};
var hpIVs=Dex.types.get(hpType).HPivs||{};
for(var _statid2 in hpIVs){
set.ivs[_statid2]=hpIVs[_statid2];
}
}
}
if(line==='Frustration'&&set.happiness===undefined){
set.happiness=0;
}
set.moves.push(line);
}
};_proto["import"]=

function _import(buffer,aggressive){
var sanitize=aggressive?toID:Dex.getName;
if(buffer.startsWith('[')){
try{
var team=JSON.parse(buffer);
if(!Array.isArray(team))throw new Error("Team should be an Array but isn't");for(var _i12=0;_i12<
team.length;_i12++){var set=team[_i12];
set.name=sanitize(set.name);
set.species=sanitize(set.species);
set.item=sanitize(set.item);
set.ability=sanitize(set.ability);
set.gender=sanitize(set.gender);
set.nature=sanitize(set.nature);
var evs={hp:0,atk:0,def:0,spa:0,spd:0,spe:0};
if(set.evs){
for(var statid in evs){
if(typeof set.evs[statid]==='number')evs[statid]=set.evs[statid];
}
}
set.evs=evs;
var ivs={hp:31,atk:31,def:31,spa:31,spd:31,spe:31};
if(set.ivs){
for(var _statid3 in ivs){
if(typeof set.ivs[_statid3]==='number')ivs[_statid3]=set.ivs[_statid3];
}
}
set.ivs=ivs;
if(!Array.isArray(set.moves)){
set.moves=[];
}else{
set.moves=set.moves.map(sanitize);
}
}
return team;
}catch(_unused2){}
}

var lines=buffer.split("\n");

var sets=[];
var curSet=null;

while(lines.length&&!lines[0])lines.shift();
while(lines.length&&!lines[lines.length-1])lines.pop();

if(lines.length===1&&lines[0].includes('|')){
return this.unpack(lines[0]);
}for(var _i14=0;_i14<
lines.length;_i14++){var line=lines[_i14];
line=line.trim();
if(line===''||line==='---'){
curSet=null;
}else if(line.startsWith('===')){

}else if(!curSet){
curSet={
name:'',species:'',item:'',ability:'',gender:'',
nature:'',
evs:{hp:0,atk:0,def:0,spa:0,spd:0,spe:0},
ivs:{hp:31,atk:31,def:31,spa:31,spd:31,spe:31},
level:100,
moves:[]
};
sets.push(curSet);
this.parseExportedTeamLine(line,true,curSet,aggressive);
}else{
this.parseExportedTeamLine(line,false,curSet,aggressive);
}
}
return sets;
};_proto.

getGenerator=function getGenerator(format){var _format$ruleTable;var seed=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;
var TeamGenerator;
format=Dex.formats.get(format);
var mod=format.mod;
if(format.mod==='monkeyspaw')mod='gen9';
var formatID=toID(format);
if(mod==='gen9ssb'){
TeamGenerator=require("../data/mods/gen9ssb/random-teams")["default"];
}else if(formatID.includes('gen9babyrandombattle')){
TeamGenerator=require("../data/random-battles/gen9baby/teams")["default"];
}else if(formatID.includes('gen9randombattle')&&(_format$ruleTable=format.ruleTable)!=null&&_format$ruleTable.has('+pokemontag:cap')){
TeamGenerator=require("../data/random-battles/gen9cap/teams")["default"];
}else if(formatID.includes('gen9freeforallrandombattle')){
TeamGenerator=require("../data/random-battles/gen9ffa/teams")["default"];
}else{
TeamGenerator=require("../data/random-battles/"+mod+"/teams")["default"];
}

return new TeamGenerator(format,seed);
};_proto.

generate=function generate(format){var options=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;
return this.getGenerator(format,options==null?void 0:options.seed).getTeam(options);
};return Teams;}())(
);
//# sourceMappingURL=teams.js.map