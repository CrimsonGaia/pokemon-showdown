"use strict";function _inheritsLoose(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,_setPrototypeOf(t,o);}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t;},_setPrototypeOf(t,e);}/**
 * Search code for searching for dex information, used by the Dex and Teambuilder.
 * Dependencies: battledata, search-index
 * Optional dependencies: pokedex, moves, items, abilities
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */var









DexSearch=function(){










































function DexSearch(){var searchType=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'';var formatid=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'';var species=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'';this.query='';this.dex=Dex;this.typedSearch=null;this.results=null;this.prependResults=null;this.exactMatch=false;this.firstPokemonColumn='Number';this.sortCol=null;this.reverseSort=false;this.filters=null;this.setType(searchType,formatid,species);}var _proto=DexSearch.prototype;_proto.
getTypedSearch=function getTypedSearch(searchType){var format=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'';var speciesOrSet=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'';
if(!searchType)return null;
switch(searchType){
case'pokemon':return new BattlePokemonSearch('pokemon',format,speciesOrSet);
case'item':return new BattleItemSearch('item',format,speciesOrSet);
case'move':return new BattleMoveSearch('move',format,speciesOrSet);
case'flag':return new BattleFlagSearch('flag',format,speciesOrSet);
case'ability':return new BattleAbilitySearch('ability',format,speciesOrSet);
case'type':return new BattleTypeSearch('type',format,speciesOrSet);
case'category':return new BattleCategorySearch('category',format,speciesOrSet);
}
return null;
};_proto.
find=function find(query){
query=toID(query);
if(this.query===query&&this.results&&this.results.length>0){return false;}
this.query=query;
if(!query){var _this$typedSearch;
this.results=((_this$typedSearch=this.typedSearch)==null?void 0:_this$typedSearch.getResults(this.filters,this.sortCol,this.reverseSort))||[];
if(!this.filters&&!this.sortCol&&this.prependResults){this.results=[].concat(this.prependResults,this.results);}
}else{this.results=this.textSearch(query);}
return true;
};_proto.
setType=function setType(searchType){var _this$typedSearch2;var format=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'';var speciesOrSet=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'';

this.results=null;
if(searchType!==((_this$typedSearch2=this.typedSearch)==null?void 0:_this$typedSearch2.searchType)){
this.filters=null;
this.sortCol=null;
}
this.typedSearch=this.getTypedSearch(searchType,format,speciesOrSet);
if(this.typedSearch)this.dex=this.typedSearch.dex;
};_proto.
capitalizeFirst=function capitalizeFirst(str){return str.charAt(0).toUpperCase()+str.slice(1);};_proto.
addFilter=function addFilter(entry){
if(!this.typedSearch)return false;
var type=entry[0];
if(this.typedSearch.searchType==='pokemon'){
if(type===this.sortCol)this.sortCol=null;
if(!['type','move','flag','ability','tier'].includes(type))return false;
if(type==='type')entry[1]=this.capitalizeFirst(entry[1]);
if(type==='move')entry[1]=toID(entry[1]);
if(type==='flag'){

var tagMap={
'legendary':'Legendary',
'restrictedlegendary':'Restricted Legendary',
'mythical':'Mythical',
'restrictedmythical':'Restricted Mythical',
'paradox':'Paradox',
'restrictedparadox':'Restricted Paradox',
'sublegendary':'Sub-Legendary',
'mega':'Mega',
'powerhouse':'Powerhouse'
};
var id=toID(entry[1]);
entry[1]=tagMap[id]||this.capitalizeFirst(entry[1]);
}
if(type==='ability')entry[1]=this.dex.abilities.get(entry[1]).name;
if(type==='tier'){
var tierTable={
uber:"Uber",
caplc:"CAP LC",
capnfe:"CAP NFE"
};
entry[1]=toID(entry[1]);
entry[1]=tierTable[entry[1]]||entry[1].toUpperCase();
}
if(!this.filters)this.filters=[];
this.results=null;for(var _i2=0,_this$filters2=
this.filters;_i2<_this$filters2.length;_i2++){var _filter=_this$filters2[_i2];if(_filter[0]===type&&_filter[1]===entry[1]){return true;}}
this.filters.push(entry.slice(0,2));
return true;
}else if(this.typedSearch.searchType==='move'){
if(type===this.sortCol)this.sortCol=null;
if(!['type','category','flag','pokemon'].includes(type))return false;
if(type==='type')entry[1]=this.capitalizeFirst(entry[1]);
if(type==='category')entry[1]=this.capitalizeFirst(entry[1]);
if(type==='flag')entry[1]=toID(entry[1]);
if(type==='pokemon')entry[1]=toID(entry[1]);
if(!this.filters)this.filters=[];
this.filters.push(entry.slice(0,2));
this.results=null;
return true;
}else if(this.typedSearch.searchType==='item'){
if(type===this.sortCol)this.sortCol=null;
if(!['itemclass'].includes(type))return false;
if(type==='itemclass'){

var classId=toID(entry[1]);
if(classId==='berries')classId='berry';
entry[1]=classId;
}
if(!this.filters)this.filters=[];
this.results=null;for(var _i4=0,_this$filters4=
this.filters;_i4<_this$filters4.length;_i4++){var _filter2=_this$filters4[_i4];if(_filter2[0]===type&&_filter2[1]===entry[1]){return true;}}
this.filters.push(entry.slice(0,2));
return true;
}
return false;
};_proto.
removeFilter=function removeFilter(entry){
if(!this.filters)return false;
if(entry){
var filterid=entry.join(':');
var deleted=null;

for(var i=0;i<this.filters.length;i++){
if(filterid===this.filters[i].join(':')){
deleted=this.filters[i];
this.filters.splice(i,1);
break;
}
}
if(!deleted)return false;
}else{this.filters.pop();}
if(!this.filters.length)this.filters=null;
this.results=null;
return true;
};_proto.
toggleSort=function toggleSort(sortCol){
if(this.sortCol===sortCol){
if(!this.reverseSort){this.reverseSort=true;}else
{
this.sortCol=null;
this.reverseSort=false;
}
}else{
this.sortCol=sortCol;
this.reverseSort=false;
}
this.results=null;
};_proto.
filterLabel=function filterLabel(filterType){
if(this.typedSearch&&this.typedSearch.searchType!==filterType){return'Filter';}
return null;
};_proto.
illegalLabel=function illegalLabel(id){var _this$typedSearch3;return((_this$typedSearch3=this.typedSearch)==null||(_this$typedSearch3=_this$typedSearch3.illegalReasons)==null?void 0:_this$typedSearch3[id])||null;};_proto.
getTier=function getTier(species){var _this$typedSearch4;return((_this$typedSearch4=this.typedSearch)==null?void 0:_this$typedSearch4.getTier(species))||'';};_proto.
textSearch=function textSearch(query){var _this$typedSearch5,_this$typedSearch6,_this$typedSearch7,_this=this;

if(this.typedSearch&&!this.typedSearch.baseResults){this.typedSearch.getResults(null,null);}
if((_this$typedSearch5=this.typedSearch)!=null&&_this$typedSearch5.illegalReasons){console.log('[DEBUG] illegalReasons count:',Object.keys(this.typedSearch.illegalReasons).length);}

query=toID(query);

var offsetTable=typeof BattleSearchIndexOffset!=='undefined'&&BattleSearchIndexOffset?BattleSearchIndexOffset:[];
this.exactMatch=false;
var searchType=((_this$typedSearch6=this.typedSearch)==null?void 0:_this$typedSearch6.searchType)||'';




var searchTypeIndex=searchType?DexSearch.typeTable[searchType]:-1;


var qFilterType='';
if(query.endsWith('type')){
if(query.slice(0,-4)in window.BattleTypeChart){
query=query.slice(0,-4);
qFilterType='type';
}
}

var i=DexSearch.getClosest(query);
this.exactMatch=BattleSearchIndex[i][0]===query;





var passType='';


















var searchPasses=[['normal',i,query]];



if(query.length>1)searchPasses.push(['alias',i,query]);





var queryAlias;
if(query in BattleAliases){
if(['sub','tr'].includes(query)||!toID(BattleAliases[query]).startsWith(query)){
queryAlias=toID(BattleAliases[query]);
var aliasPassType=queryAlias==='hiddenpower'?'exact':'normal';
searchPasses.unshift([aliasPassType,DexSearch.getClosest(queryAlias),queryAlias]);
}
this.exactMatch=true;
}


if(!this.exactMatch&&BattleSearchIndex[i][0].substr(0,query.length)!==query){

var matchLength=query.length-1;
if(!i)i++;
while(matchLength&&
BattleSearchIndex[i][0].substr(0,matchLength)!==query.substr(0,matchLength)&&
BattleSearchIndex[i-1][0].substr(0,matchLength)!==query.substr(0,matchLength)){
matchLength--;
}
var matchQuery=query.substr(0,matchLength);
while(i>=1&&BattleSearchIndex[i-1][0].substr(0,matchLength)===matchQuery)i--;
searchPasses.push(['fuzzy',i,'']);
}




var bufs=[[],[],[],[],[],[],[],[],[],[],[],[]];
var topbufIndex=-1;
var count=0;
var nearMatch=false;

var instafilter=null;
var instafilterSort=[0,1,2,5,4,3,6,7,8];
var illegal=(_this$typedSearch7=this.typedSearch)==null?void 0:_this$typedSearch7.illegalReasons;

for(i=0;i<BattleSearchIndex.length;i++){
if(!passType){
var searchPass=searchPasses.shift();
if(!searchPass)break;
passType=searchPass[0];
i=searchPass[1];
query=searchPass[2];
}
var entry=BattleSearchIndex[i];
if(!entry){passType='';continue;}
var id=entry[0];
var type=entry[1];
if(!id){passType='';continue;}
if(passType==='fuzzy'){

if(count>=2){
passType='';
continue;
}
nearMatch=true;
}else if(passType==='exact'){

if(count>=1){
passType='';
continue;
}
}else if(id.substr(0,query.length)!==query){

passType='';
continue;
}
if(entry.length>2){if(passType!=='alias')continue;}else
{if(passType==='alias')continue;}
var typeIndex=DexSearch.typeTable[type];

if(query.length===1&&typeIndex!==(searchType?searchTypeIndex:1))continue;

if(searchType==='pokemon'&&(typeIndex===5||typeIndex>7&&typeIndex!==10))continue;

if(searchType==='move'&&(typeIndex!==8&&typeIndex!==10&&typeIndex>4||typeIndex===3))continue;

if(searchType==='move'&&illegal&&typeIndex===1)continue;

if(searchType==='item'&&typeIndex!==searchTypeIndex&&typeIndex!==11)continue;

if(searchType==='ability'&&typeIndex!==searchTypeIndex)continue;

if(qFilterType==='type'&&typeIndex!==2)continue;

if(searchType==='flag'&&typeIndex!==10&&typeIndex!==4)continue;

if((id==='megax'||id==='megay')&&'mega'.startsWith(query))continue;
var matchStart=0;
var matchEnd=0;
if(passType==='alias'){


matchStart=entry[3];
var originalIndex=entry[2];
if(matchStart){
matchEnd=matchStart+query.length;
var offsetRow=BattleSearchIndexOffset[originalIndex]||'';
matchStart+=(offsetRow[matchStart]||'0').charCodeAt(0)-48;
matchEnd+=(offsetRow[matchEnd-1]||'0').charCodeAt(0)-48;
}
var originalEntry=BattleSearchIndex[originalIndex];
if(!originalEntry){passType='';continue;}
id=originalEntry[0];
}else{
matchEnd=query.length;
var _offsetRow=BattleSearchIndexOffset[i]||'';
if(matchEnd)matchEnd+=(_offsetRow[matchEnd-1]||'0').charCodeAt(0)-48;
}

if(queryAlias===id&&query!==id)continue;

if(searchType&&searchTypeIndex!==typeIndex){if(!instafilter||instafilterSort[typeIndex]<instafilterSort[instafilter[2]]){instafilter=[type,id,typeIndex];}}

if(topbufIndex<0&&searchTypeIndex<2&&passType==='alias'&&!bufs[1].length&&bufs[2].length){topbufIndex=2;}
if(illegal&&typeIndex===searchTypeIndex){





if(!bufs[typeIndex].length&&!bufs[0].length){bufs[0]=[['header',DexSearch.typeName[type]]];}
if(!(id in illegal))typeIndex=0;
}else{if(!bufs[typeIndex].length){bufs[typeIndex]=[['header',DexSearch.typeName[type]]];}}

var curBufLength=passType==='alias'&&bufs[typeIndex].length;
if(curBufLength&&bufs[typeIndex][curBufLength-1][1]===id)continue;
bufs[typeIndex].push([type,id,matchStart,matchEnd]);
count++;
}
var topbuf=[];
if(nearMatch){topbuf=[['html',"<em>No exact match found. The closest matches alphabetically are:</em>"]];}
if(topbufIndex>=0){
topbuf=topbuf.concat(bufs[topbufIndex]);
bufs[topbufIndex]=[];
}
if(searchTypeIndex>=0){
topbuf=topbuf.concat(bufs[0]);
topbuf=topbuf.concat(bufs[searchTypeIndex]);
bufs[searchTypeIndex]=[];
bufs[0]=[];
}
if(instafilter&&count<20){

bufs.push(this.instafilter(searchType,instafilter[0],instafilter[1]));
}
this.results=Array.prototype.concat.apply(topbuf,bufs);


if(this.typedSearch&&this.typedSearch.baseResults){
var legalSet=new Set();for(var _i6=0,_this$typedSearch$bas2=
this.typedSearch.baseResults;_i6<_this$typedSearch$bas2.length;_i6++){var _ref=_this$typedSearch$bas2[_i6];var _type=_ref[0];var _id=_ref[1];if(_type!=='header'){legalSet.add(_id);}}
this.results=this.results.filter(function(_ref2){var type=_ref2[0],id=_ref2[1];
if(type==='header'||type==='html')return true;

if(type===_this.typedSearch.searchType)return legalSet.has(id);
return true;
});
}
return this.results;
};_proto.
instafilter=function instafilter(searchType,fType,fId){var _this$typedSearch8;
var buf=[];
var illegalBuf=[];
var illegal=(_this$typedSearch8=this.typedSearch)==null?void 0:_this$typedSearch8.illegalReasons;
if(searchType==='pokemon'){
switch(fType){
case'type':
var type=fId.charAt(0).toUpperCase()+fId.slice(1);
buf.push(['header',type+"-type Pok\xE9mon"]);
for(var id in BattlePokedex){
if(!BattlePokedex[id].types)continue;
if(this.dex.species.get(id).types.includes(type)){(illegal&&id in illegal?illegalBuf:buf).push(['pokemon',id]);}
}
break;
case'ability':
var ability=Dex.abilities.get(fId).name;
buf.push(['header',ability+" Pok\xE9mon"]);
for(var _id2 in BattlePokedex){
if(!BattlePokedex[_id2].abilities)continue;
if(Dex.hasAbility(this.dex.species.get(_id2),ability)){(illegal&&_id2 in illegal?illegalBuf:buf).push(['pokemon',_id2]);}
}
break;
case'flag':

var tagMap={
'legendary':'Legendary',
'restrictedlegendary':'Restricted Legendary',
'mythical':'Mythical',
'restrictedmythical':'Restricted Mythical',
'paradox':'Paradox',
'restrictedparadox':'Restricted Paradox',
'sublegendary':'Sub-Legendary',
'mega':'Mega',
'powerhouse':'Powerhouse'
};
var flagName=tagMap[fId]||fId.charAt(0).toUpperCase()+fId.slice(1);
buf.push(['header',flagName+" Pok\xE9mon"]);
for(var _id3 in BattlePokedex){
var species=this.dex.species.get(_id3);

if(species.tags&&species.tags.includes(flagName)||flagName==='Mega'&&species.isMega){(illegal&&_id3 in illegal?illegalBuf:buf).push(['pokemon',_id3]);}
}
break;
}
}else if(searchType==='move'){
switch(fType){
case'type':
var _type2=fId.charAt(0).toUpperCase()+fId.slice(1);
buf.push(['header',_type2+"-type moves"]);
for(var _id4 in BattleMovedex){
var m=BattleMovedex[_id4];
if(m.type===_type2||m.type2===_type2){(illegal&&_id4 in illegal?illegalBuf:buf).push(['move',_id4]);}
}
break;
case'category':
var category=fId.charAt(0).toUpperCase()+fId.slice(1);
buf.push(['header',category+" moves"]);
for(var _id5 in BattleMovedex){if(BattleMovedex[_id5].category===category){(illegal&&_id5 in illegal?illegalBuf:buf).push(['move',_id5]);}}
break;
case'flag':
var _flagName=BattleFlags&&BattleFlags[fId]?BattleFlags[fId].name:fId.charAt(0).toUpperCase()+fId.slice(1);
buf.push(['header',_flagName+" moves"]);
for(var _id6 in BattleMovedex){
var move=BattleMovedex[_id6];
if(move.flags&&move.flags[fId]){(illegal&&_id6 in illegal?illegalBuf:buf).push(['move',_id6]);}
}
break;
}
}else if(searchType==='item'){
switch(fType){
case'itemclass':
var classId=fId==='berries'?'berry':fId;
var className=fId.charAt(0).toUpperCase()+fId.slice(1);

var classNames={
fragile:'Fragile',
"volatile":'Volatile',
consumable:'Consumable',
berry:'Berry',
pokeball:'Pokéball',
evolution:'Evolution',
tradeevo:'Trade Evo'
};
className=classNames[classId]||className;
buf.push(['header',className+" items"]);
for(var _id7 in BattleItems){
var item=this.dex.items.get(_id7);
var itemClass=BattleItemSearch.prototype.getItemClass(item);
if(itemClass===classId){buf.push(['item',_id7]);}
}
break;
}
}
return[].concat(buf,illegalBuf);
};DexSearch.
getClosest=function getClosest(query){

var left=0;
var right=BattleSearchIndex.length-1;
while(right>left){
var mid=Math.floor((right-left)/2+left);
if(BattleSearchIndex[mid][0]===query&&(mid===0||BattleSearchIndex[mid-1][0]!==query)){

return mid;
}else if(BattleSearchIndex[mid][0]<query){
left=mid+1;
}else{
right=mid-1;
}
}
if(left>=BattleSearchIndex.length-1)left=BattleSearchIndex.length-1;else
if(BattleSearchIndex[left+1][0]&&BattleSearchIndex[left][0]<query)left++;
if(left&&BattleSearchIndex[left-1][0]===query)left--;
return left;
};return DexSearch;}();DexSearch.typeTable={pokemon:1,type:2,tier:3,move:4,item:5,ability:6,egggroup:7,category:8,article:9,flag:10,itemclass:11};DexSearch.typeName={pokemon:"Pok\xE9mon",type:'Type',tier:'Tiers',move:'Moves',flag:'Flags',item:'Items',ability:'Abilities',egggroup:'Egg group',category:'Category',article:'Article',itemclass:'Item Class'};var


BattleTypedSearch=function(){





























function BattleTypedSearch(searchType){var format=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'';var speciesOrSet=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'';this.searchType=void 0;this.dex=Dex;this.format='';this.species='';this.set=null;this.formatType=null;this.isDoubles=false;this.baseResults=null;this.baseIllegalResults=null;this.illegalReasons=null;this.results=null;this.sortRow=null;
this.searchType=searchType;
this.baseResults=null;
this.baseIllegalResults=null;

if(format.startsWith('gen')){
var gen=Number(format.charAt(3))||6;
format=format.slice(4)||'customgame';
this.dex=Dex.forGen(gen);
}else if(!format){this.dex=Dex;}

if(format.startsWith('dlc1')&&this.dex.gen===8){
if(format.includes('doubles')){
this.formatType='ssdlc1doubles';
this.isDoubles=true;
}else{this.formatType='ssdlc1';}
format=format.slice(4);
}
if(format.startsWith('predlc')){
if(format.includes('doubles')&&!format.includes('nationaldex')){
this.formatType='predlcdoubles';
this.isDoubles=true;
}else if(format.includes('nationaldex')){this.formatType='predlcnatdex';}else
{this.formatType='predlc';}
format=format.slice(6);
}
if(format.startsWith('dlc1')&&this.dex.gen===9){
if(format.includes('doubles')&&!format.includes('nationaldex')){
this.formatType='svdlc1doubles';
this.isDoubles=true;
}else if(format.includes('nationaldex')){this.formatType='svdlc1natdex';}else
{this.formatType='svdlc1';}
format=format.slice(4);
}
if(format.startsWith('stadium')){
this.formatType='stadium';
format=format.slice(7);
if(!format)format='ou';
}
if(format.startsWith('vgc')){
this.formatType='doubles';
this.isDoubles=true;
}
if(format==='vgc2020'){this.formatType='ssdlc1doubles';}
if(format.startsWith('vgc2023')){this.formatType=format.endsWith('rege')?'svdlc1doubles':'predlcdoubles';}
if(format.includes('bdsp')){
if(format.includes('doubles')){
this.formatType='bdspdoubles';
this.isDoubles=true;
}else{this.formatType='bdsp';}
format=format.slice(4);
this.dex=Dex.mod('gen8bdsp');
}
if(format.includes('bw1')){
this.formatType='bw1';
this.dex=Dex.mod('gen5bw1');
}
if(format.includes('adv200')){
this.formatType='rs';
this.dex=Dex.mod('gen3rs');
}
if(format==='partnersincrime')this.formatType='doubles';
if(format.startsWith('ffa')||format==='freeforall')this.formatType='doubles';
if(format.includes('letsgo')){
this.formatType='letsgo';
this.dex=Dex.mod('gen7letsgo');
}

if(format.startsWith('indigostarstorm')||format.startsWith('isl')){
console.log('[DEBUG] ISL format detected, original format:',format);
this.formatType='indigostarstorm';
this.dex=Dex.mod('gen9indigostarstorm');

if(format.startsWith('indigostarstorm')){
format=format.slice('indigostarstorm'.length);
}else{
format=format.slice('isl'.length);
}
if(!format)format='ou';
}
if(format.includes('nationaldex')||format.startsWith('nd')||format.includes('natdex')){
format=format.startsWith('nd')?format.slice(2):format.includes('natdex')?format.slice(6):format.slice(11);
this.formatType='natdex';
if(!format)format='ou';
this.isDoubles=format.includes('doubles');
}
if(format.includes('doubles')&&this.dex.gen>4&&!this.formatType){
this.formatType='doubles';
this.isDoubles=true;
}
if(this.formatType==='letsgo')format=format.slice(6);
if(format.includes('metronome')){
this.formatType='metronome';
}
if(format.endsWith('nfe')){
format=format.slice(3);
this.formatType='nfe';
if(!format)format='ou';
}
if((format.endsWith('lc')||format.startsWith('lc'))&&format!=='caplc'&&!this.formatType){
this.formatType='lc';
format='lc';
}
if(format.endsWith('draft')){
format=format.slice(0,-5);
if(!format)format='anythinggoes';
}
this.format=format;
this.species='';
this.set=null;
if(typeof speciesOrSet==='string'){
if(speciesOrSet)this.species=speciesOrSet;
}else{
this.set=speciesOrSet;
this.species=toID(this.set.species);
}

}var _proto2=BattleTypedSearch.prototype;_proto2.
getResults=function getResults(filters,sortCol,reverseSort){var _this2=this,_illegalResults;
if(sortCol==='type'){return[this.sortRow].concat(BattleTypeSearch.prototype.getDefaultResults.call(this,reverseSort));}else
if(sortCol==='category'){return[this.sortRow].concat(BattleCategorySearch.prototype.getDefaultResults.call(this,reverseSort));}else
if(sortCol==='ability'){return[this.sortRow].concat(BattleAbilitySearch.prototype.getDefaultResults.call(this,reverseSort));}else
if(sortCol==='flag'){return[this.sortRow].concat(BattleFlagSearch.prototype.getDefaultResults.call(this,reverseSort));}
if(!this.baseResults){this.baseResults=this.getBaseResults();}
if(!this.baseIllegalResults){
var legalityFilter={};for(var _i8=0,_this$baseResults2=
this.baseResults;_i8<_this$baseResults2.length;_i8++){var _ref3=_this$baseResults2[_i8];var resultType=_ref3[0];var value=_ref3[1];if(resultType===this.searchType)legalityFilter[value]=1;}
this.baseIllegalResults=[];
this.illegalReasons={};
for(var id in this.getTable()){
if(!(id in legalityFilter)){
this.baseIllegalResults.push([this.searchType,id]);
this.illegalReasons[id]='Illegal';
}
}
}
var results;
var illegalResults;
if(filters){
results=[];
illegalResults=[];for(var _i10=0,_this$baseResults4=
this.baseResults;_i10<_this$baseResults4.length;_i10++){var result=_this$baseResults4[_i10];
if(this.filter(result,filters)){
if(results.length&&result[0]==='header'&&results[results.length-1][0]==='header'){results[results.length-1]=result;}else
{results.push(result);}
}
}
if(results.length&&results[results.length-1][0]==='header'){results.pop();}for(var _i12=0,_this$baseIllegalResu2=
this.baseIllegalResults;_i12<_this$baseIllegalResu2.length;_i12++){var _result=_this$baseIllegalResu2[_i12];if(this.filter(_result,filters)){illegalResults.push(_result);}}
}else{
results=[].concat(this.baseResults);
illegalResults=null;
}
if(this.defaultFilter){results=this.defaultFilter(results);}
if(sortCol){
results=results.filter(function(_ref4){var rowType=_ref4[0];return rowType===_this2.searchType;});
results=this.sort(results,sortCol,reverseSort);
if(illegalResults){
illegalResults=illegalResults.filter(function(_ref5){var rowType=_ref5[0];return rowType===_this2.searchType;});
illegalResults=this.sort(illegalResults,sortCol,reverseSort);
}
}
if(this.sortRow){results=[this.sortRow].concat(results);}
if((_illegalResults=illegalResults)!=null&&_illegalResults.length){results=[].concat(results,[['header',"Illegal results"]],illegalResults);}
return results;
};_proto2.
firstLearnsetid=function firstLearnsetid(speciesid){var _this$formatType;
var table=BattleTeambuilderTable;
if((_this$formatType=this.formatType)!=null&&_this$formatType.startsWith('bdsp'))table=table['gen8bdsp'];
if(this.formatType==='letsgo')table=table['gen7letsgo'];
if(this.formatType==='bw1')table=table['gen5bw1'];
if(this.formatType==='rs')table=table['gen3rs'];
if(this.formatType==='indigostarstorm')table=table['gen9indigostarstorm']||table;
if(table&&table.learnsets&&speciesid in table.learnsets)return speciesid;
var species=this.dex.species.get(speciesid);
if(!species.exists)return'';
var baseLearnsetid=toID(species.baseSpecies);
if(typeof species.battleOnly==='string'&&species.battleOnly!==species.baseSpecies){baseLearnsetid=toID(species.battleOnly);}
if(table&&table.learnsets&&baseLearnsetid in table.learnsets)return baseLearnsetid;
return'';
};_proto2.
nextLearnsetid=function nextLearnsetid(learnsetid,speciesid){var checkingMoves=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;
if(learnsetid==='lycanrocdusk'||speciesid==='rockruff'&&learnsetid==='rockruff'){return'rockruffdusk';}
var lsetSpecies=this.dex.species.get(learnsetid);
if(!lsetSpecies.exists)return'';
if(lsetSpecies.id==='gastrodoneast')return'gastrodon';
if(lsetSpecies.id==='pumpkaboosuper')return'pumpkaboo';
if(lsetSpecies.id==='sinisteaantique')return'sinistea';
if(lsetSpecies.id==='tatsugiristretchy')return'tatsugiri';
var next=lsetSpecies.battleOnly||lsetSpecies.changesFrom||lsetSpecies.prevo;
if(next)return toID(next);
if(checkingMoves&&!lsetSpecies.prevo&&lsetSpecies.baseSpecies&&this.dex.species.get(lsetSpecies.baseSpecies).prevo){
var baseEvo=this.dex.species.get(lsetSpecies.baseSpecies);
while(baseEvo.prevo){baseEvo=this.dex.species.get(baseEvo.prevo);}
return toID(baseEvo);
}
return'';
};_proto2.
canLearn=function canLearn(speciesid,moveid){
var move=this.dex.moves.get(moveid);
if(this.formatType==='natdex'&&move.isNonstandard&&move.isNonstandard!=='Past'){return false;}
var gen=this.dex.gen;
var genChar=""+gen;
if(
this.format.startsWith('vgc')||
this.format.startsWith('bss')||
this.format.startsWith('battlespot')||
this.format.startsWith('battlestadium')||
this.format.startsWith('battlefestival')||
this.dex.gen===9&&this.formatType!=='natdex')
{
if(gen===9){genChar='a';}else
if(gen===8){genChar='g';}else
if(gen===7){genChar='q';}else
if(gen===6){genChar='p';}
}
console.log('[DEBUG canLearn]',{speciesid:speciesid,moveid:moveid,gen:gen,genChar:genChar,formatType:this.formatType});
var learnsetid=this.firstLearnsetid(speciesid);
console.log('[DEBUG canLearn] firstLearnsetid:',learnsetid);
while(learnsetid){var _this$formatType2;
var table=BattleTeambuilderTable;
if((_this$formatType2=this.formatType)!=null&&_this$formatType2.startsWith('bdsp'))table=table['gen8bdsp'];
if(this.formatType==='letsgo')table=table['gen7letsgo'];
if(this.formatType==='bw1')table=table['gen5bw1'];
if(this.formatType==='rs')table=table['gen3rs'];
if(this.formatType==='indigostarstorm')table=table['gen9indigostarstorm']||table;
if(!table||!table.learnsets){
console.log('[DEBUG canLearn] No table or learnsets');
break;
}
var learnset=table.learnsets[learnsetid];
console.log('[DEBUG canLearn] learnset for',learnsetid,':',learnset?Object.keys(learnset).slice(0,5):'undefined');
if(learnset&&moveid in learnset){console.log('[DEBUG canLearn] Move found!',moveid,'data:',learnset[moveid],'checking for genChar:',genChar);}
var eggMovesOnly=this.eggMovesOnly(learnsetid,speciesid);
if(learnset&&moveid in learnset&&(!this.format.startsWith('tradebacks')?learnset[moveid].includes(genChar):
learnset[moveid].includes(genChar)||learnset[moveid].includes(""+(gen+1))&&move.gen===gen)&&(!eggMovesOnly||learnset[moveid].includes('e')&&this.dex.gen===9))
{return true;}
learnsetid=this.nextLearnsetid(learnsetid,speciesid,true);
}
return false;
};_proto2.
getTier=function getTier(pokemon){var _table;
if(this.formatType==='metronome'){return pokemon.num>=0?String(pokemon.num):pokemon.tier;}
var table=window.BattleTeambuilderTable;
var gen=this.dex.gen;
var tableKey=this.formatType==='doubles'?"gen"+gen+"doubles":
this.formatType==='letsgo'?'gen7letsgo':
this.formatType==='bdsp'?'gen8bdsp':
this.formatType==='bdspdoubles'?'gen8bdspdoubles':
this.formatType==='bw1'?'gen5bw1':
this.formatType==='rs'?'gen3rs':
this.formatType==='indigostarstorm'?'gen9indigostarstorm':
this.formatType==='nfe'?"gen"+gen+"nfe":
this.formatType==='lc'?"gen"+gen+"lc":
this.formatType==='ssdlc1'?'gen8dlc1':
this.formatType==='ssdlc1doubles'?'gen8dlc1doubles':
this.formatType==='predlc'?'gen9predlc':
this.formatType==='predlcdoubles'?'gen9predlcdoubles':
this.formatType==='predlcnatdex'?'gen9predlcnatdex':
this.formatType==='svdlc1'?'gen9dlc1':
this.formatType==='svdlc1doubles'?'gen9dlc1doubles':
this.formatType==='svdlc1natdex'?'gen9dlc1natdex':
this.formatType==='natdex'?"gen"+gen+"natdex":
this.formatType==='stadium'?"gen"+gen+"stadium"+(gen>1?gen:''):
this.formatType==='indigostarstorm'?'gen9indigostarstorm':"gen"+
gen;
if((_table=table)!=null&&_table[tableKey]){table=table[tableKey];}
if(!table||!table.overrideTier)return pokemon.tier;
var id=pokemon.id;
if(id in table.overrideTier){return table.overrideTier[id];}
if(id.endsWith('totem')&&id.slice(0,-5)in table.overrideTier){return table.overrideTier[id.slice(0,-5)];}
id=toID(pokemon.baseSpecies);
if(id in table.overrideTier){return table.overrideTier[id];}
return pokemon.tier;
};_proto2.
eggMovesOnly=function eggMovesOnly(child,father){
if(this.dex.species.get(child).baseSpecies===this.dex.species.get(father).baseSpecies)return false;
var baseSpecies=father;
while(father){
if(child===father)return false;
father=this.nextLearnsetid(father,baseSpecies);
}
return true;
};return BattleTypedSearch;}();var









BattlePokemonSearch=function(_BattleTypedSearch2){function BattlePokemonSearch(){var _this3;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this3=_BattleTypedSearch2.call.apply(_BattleTypedSearch2,[this].concat(args))||this;_this3.
sortRow=['sortpokemon',''];return _this3;}_inheritsLoose(BattlePokemonSearch,_BattleTypedSearch2);var _proto3=BattlePokemonSearch.prototype;_proto3.
getTable=function getTable(){return BattlePokedex;};_proto3.
getDefaultResults=function getDefaultResults(){
var results=[];
for(var id in BattlePokedex){
switch(id){
case'bulbasaur':results.push(['header',"Generation 1"]);
break;
case'chikorita':results.push(['header',"Generation 2"]);
break;
case'treecko':results.push(['header',"Generation 3"]);
break;
case'turtwig':results.push(['header',"Generation 4"]);
break;
case'victini':results.push(['header',"Generation 5"]);
break;
case'chespin':results.push(['header',"Generation 6"]);
break;
case'rowlet':results.push(['header',"Generation 7"]);
break;
case'grookey':results.push(['header',"Generation 8"]);
break;
case'sprigatito':results.push(['header',"Generation 9"]);
continue;
}
results.push(['pokemon',id]);
}
return results;
};_proto3.
getBaseResults=function getBaseResults(){var _this$formatType3,_this$formatType4,_this$formatType5,_this$formatType6,_this$formatType7,_this$formatType8,_this4=this;
var format=this.format;
if(!format)return this.getDefaultResults();
var isVGCOrBS=format.startsWith('battlespot')||format.startsWith('bss')||format.startsWith('battlestadium')||format.startsWith('vgc');
var isHackmons=format.includes('hackmons')||format.endsWith('bh');
var isDoublesOrBS=isVGCOrBS||((_this$formatType3=this.formatType)==null?void 0:_this$formatType3.includes('doubles'));
var dex=this.dex;
var table=BattleTeambuilderTable;
if((format.endsWith('cap')||format.endsWith('caplc'))&&dex.gen<9){table=table["gen"+dex.gen];}else
if(isVGCOrBS){table=table["gen"+dex.gen+"vgc"];}else
if(dex.gen===9&&isHackmons&&!this.formatType){table=table['bh'];}else
if(
table["gen"+dex.gen+"doubles"]&&dex.gen>4&&
this.formatType!=='letsgo'&&this.formatType!=='bdspdoubles'&&
this.formatType!=='ssdlc1doubles'&&this.formatType!=='predlcdoubles'&&
this.formatType!=='svdlc1doubles'&&this.formatType!=='indigostarstorm'&&
!((_this$formatType4=this.formatType)!=null&&_this$formatType4.includes('natdex'))&&(

format.includes('doubles')||format.includes('triples')||
format==='freeforall'||format.startsWith('ffa')||
format==='partnersincrime'))

{
table=table["gen"+dex.gen+"doubles"];
isDoublesOrBS=true;
}else
if(dex.gen<9&&!this.formatType){table=table["gen"+dex.gen];}else
if((_this$formatType5=this.formatType)!=null&&_this$formatType5.startsWith('bdsp')){table=table['gen8'+this.formatType];}else
if(this.formatType==='letsgo'){table=table['gen7letsgo'];}else
if(this.formatType==='bw1'){table=table['gen5bw1'];}else
if(this.formatType==='rs'){table=table['gen3rs'];}else
if(this.formatType==='natdex'){table=table["gen"+dex.gen+"natdex"];}else
if(this.formatType==='metronome'){table=table["gen"+dex.gen+"metronome"];}else
if(this.formatType==='nfe'){table=table["gen"+dex.gen+"nfe"];}else
if(this.formatType==='lc'){table=table["gen"+dex.gen+"lc"];}else
if((_this$formatType6=this.formatType)!=null&&_this$formatType6.startsWith('ssdlc1')){
if(this.formatType.includes('doubles')){table=table['gen8dlc1doubles'];}else
{table=table['gen8dlc1'];}
}else if((_this$formatType7=this.formatType)!=null&&_this$formatType7.startsWith('predlc')){
if(this.formatType.includes('doubles')){table=table['gen9predlcdoubles'];}else
if(this.formatType.includes('natdex')){table=table['gen9predlcnatdex'];}else
{table=table['gen9predlc'];}
}else if((_this$formatType8=this.formatType)!=null&&_this$formatType8.startsWith('svdlc1')){
if(this.formatType.includes('doubles')){table=table['gen9dlc1doubles'];}else
if(this.formatType.includes('natdex')){table=table['gen9dlc1natdex'];}else
{table=table['gen9dlc1'];}
}else if(this.formatType==='indigostarstorm'){var _table2,_table3,_table4;
table=table['gen9indigostarstorm'];
console.log('[DEBUG] Loading gen9indigostarstorm table, table exists:',!!table,'has tiers:',!!((_table2=table)!=null&&_table2.tiers),'has formatSlices:',!!((_table3=table)!=null&&_table3.formatSlices),'slice keys:',Object.keys(((_table4=table)==null?void 0:_table4.formatSlices)||{}));
if(!table){
console.error('[DEBUG] gen9indigostarstorm table not found. ISL teambuilder will be empty.');
table={tierSet:[],formatSlices:{}};
}
}
if(!table||!table.tierSet){
if(table&&table.tiers){
table.tierSet=table.tiers.map(function(r){
if(typeof r==='string')return['pokemon',r];
return[r[0],r[1]];
});
if(this.formatType!=='indigostarstorm')table.tiers=null;
}else{

console.log('[DEBUG] Table has no tiers, creating empty tierSet');
if(!table)table={};
table.tierSet=[];
}
}
table.tierSet=(table.tierSet||[]).filter(function(_ref6){var type=_ref6[0],id=_ref6[1];

if(type==='header'||type==='html'||type==='sortpokemon'||type==='sortmove')return true;



var sp=_this4.dex.species.get(id);
if(!sp||!sp.exists)return false;


if(sp.num>=10000||sp.num<0)return true;

var bs=_this4.dex.species.get(sp.baseSpecies||sp.name);
var ns=sp.isNonstandard||bs.isNonstandard;
var tier=_this4.getTier(sp);
if(tier.startsWith('CAP'))console.log('[ISL FILTER] dropping',id,tier);

if(tier.startsWith('CAP'))return false;
if(id.startsWith('pokestar'))return false;
if(sp.num===0||bs.num===0)return false;

return ns!=='Past'&&ns!=='Gigantamax';
});
var tierSet=table.tierSet;
var slices=table.formatSlices||{};



if(this.formatType==='indigostarstorm'){
var results=[];


var getStage=function(sp){
var stage=1;
var cur=sp;
while(cur.prevo){
stage++;
var prev=_this4.dex.species.get(cur.prevo);
if(!prev||!prev.exists)break;
cur=prev;
}
return stage;
};
var canEvolve=function(sp){return!!(sp.evos&&sp.evos.length);};


var isBabyLeague=format.includes('babyleague');
var isNFELeague=format.includes('nfeleague');
var isSingleStage=format.includes('singlestageonly');
var isSecondStageLeague=format.includes('2ndstageleague');for(var _i14=0,_this$getDefaultResul2=

this.getDefaultResults();_i14<_this$getDefaultResul2.length;_i14++){var row=_this$getDefaultResul2[_i14];

if(row[0]!=='pokemon'){
if(row[0]==='header'||row[0]==='html'||row[0]==='sortpokemon'||row[0]==='sortmove'){
results.push(row);
}
continue;
}

var id=row[1];
var species=this.dex.species.get(id);


if(!species||!species.exists)continue;


var base=this.dex.species.get(species.baseSpecies||species.name);
if(species.num===0||base.num===0)continue;


if(species.num>=13000){
results.push(row);
continue;
}


var ns=species.isNonstandard||base.isNonstandard;
var tier=this.getTier(species);

if(ns==='CAP'||tier.startsWith('CAP'))continue;
if(ns==='Pokestar'||id.startsWith('pokestar'))continue;
if(ns==='Past'||ns==='Gigantamax')continue;


if(isBabyLeague){

if(!(getStage(species)===1&&canEvolve(species)))continue;
}else if(isNFELeague){

var stage=getStage(species);
if(!(stage===1&&canEvolve(species)||stage===2&&canEvolve(species)))continue;
}else if(isSingleStage){

if(!(getStage(species)===1&&!canEvolve(species)))continue;
}else if(isSecondStageLeague){

var _stage=getStage(species);
if(_stage>=3)continue;
}


results.push(row);
}

return results;
}
if(format==='ubers'||format==='uber'||format==='ubersuu'||format==='nationaldexdoubles'){tierSet=tierSet.slice(slices.Uber);}else
if(isVGCOrBS||isHackmons&&dex.gen===9&&!this.formatType){var _this$formatType9;
if(format.endsWith('series13')||format.endsWith('regj')||isHackmons){}else
if(
format==='vgc2010'||format==='vgc2016'||format.startsWith('vgc2019')||
format==='vgc2022'||format.endsWith('regg')||format.endsWith('regi'))
{tierSet=tierSet.slice(slices["Restricted Legendary"]);}else
{tierSet=tierSet.slice(slices.Regular);}

if((_this$formatType9=this.formatType)!=null&&_this$formatType9.includes('dlc')){tierSet=tierSet.filter(function(_ref7){var type=_ref7[0],id=_ref7[1];return!['Unreleased','Illegal'].includes(_this4.getTier(_this4.dex.species.get(id)));});}

if(format.endsWith('regh')){
tierSet=tierSet.filter(function(_ref8){var type=_ref8[0],id=_ref8[1];
var tags=_this4.dex.species.get(_this4.dex.species.get(id).baseSpecies).tags;
return!tags.includes('Sub-Legendary')&&!tags.includes('Paradox');
});
}
}else if(format==='ou')tierSet=tierSet.slice(slices.OU);else
if(format==='uubl')tierSet=tierSet.slice(slices.UUBL);else
if(format==='uu')tierSet=tierSet.slice(slices.UU);else
if(format==='ru')tierSet=tierSet.slice(slices.RU||slices.UU);else
if(format==='nu')tierSet=tierSet.slice(slices.NU||slices.RU||slices.UU);else
if(format==='pu')tierSet=tierSet.slice(slices.PU||slices.NU);else
if(format==='zu'&&dex.gen===5)tierSet=tierSet.slice(slices.PU||slices.NU);else
if(format==='zu')tierSet=tierSet.slice(slices.ZU||slices.PU||slices.NU);else
if(format==='lc'||format==='lcuu'||format.startsWith('lc')||format!=='caplc'&&format.endsWith('lc'))tierSet=tierSet.slice(slices.LC);else
if(format==='cap'||format.endsWith('cap')){tierSet=tierSet.slice(0,slices.AG||slices.Uber).concat(tierSet.slice(slices.OU));}else
if(format==='caplc'){tierSet=tierSet.slice(slices['CAP LC'],slices.AG||slices.Uber).concat(tierSet.slice(slices.LC));}else
if(format==='anythinggoes'||format.endsWith('ag')||format.startsWith('ag')){tierSet=tierSet.slice(slices.AG);}else
if(isHackmons&&(dex.gen<9||this.formatType==='natdex')){tierSet=tierSet.slice(slices.AG||slices.Uber);}else
if(format==='monotype'||format.startsWith('monothreat'))tierSet=tierSet.slice(slices.Uber);else
if(format==='doublesubers')tierSet=tierSet.slice(slices.DUber);else
if(format==='doublesou'&&dex.gen>4)tierSet=tierSet.slice(slices.DOU);else
if(format==='doublesuu')tierSet=tierSet.slice(slices.DUU);else
if(this.formatType==='indigostarstorm'){var _slices$RegΔ,_slices$RegΙ,_slices$RegΒ,_slices$RegΖ,_slices$RegΓ,_slices$RegΘ,_slices$RegΕ,_slices$RegΛ,_slices$RegΨ,_slices$RegΝ,_slices$RegΦ;
console.log('[DEBUG] ISL format detected. Format string:',format,'Available slices:',Object.keys(slices||{}));


if(!slices||slices['Reg α']===undefined){
console.log('[DEBUG] ISL: formatSlices missing Reg α; skipping ISL slicing');
return tierSet;
}


var sA=slices['Reg α'];
var sD=(_slices$RegΔ=slices['Reg Δ'])!=null?_slices$RegΔ:tierSet.length;
var sI=(_slices$RegΙ=slices['Reg ι'])!=null?_slices$RegΙ:tierSet.length;
var sB=(_slices$RegΒ=slices['Reg β'])!=null?_slices$RegΒ:tierSet.length;
var sZ=(_slices$RegΖ=slices['Reg ζ'])!=null?_slices$RegΖ:tierSet.length;
var sG=(_slices$RegΓ=slices['Reg γ'])!=null?_slices$RegΓ:tierSet.length;
var sT=(_slices$RegΘ=slices['Reg Θ'])!=null?_slices$RegΘ:tierSet.length;
var sE=(_slices$RegΕ=slices['Reg ε'])!=null?_slices$RegΕ:tierSet.length;
var sL=(_slices$RegΛ=slices['Reg λ'])!=null?_slices$RegΛ:tierSet.length;
var sP=(_slices$RegΨ=slices['Reg ψ'])!=null?_slices$RegΨ:tierSet.length;
var sN=(_slices$RegΝ=slices['Reg ν'])!=null?_slices$RegΝ:tierSet.length;
var sF=(_slices$RegΦ=slices['Reg φ'])!=null?_slices$RegΦ:tierSet.length;

var start=sG;
var end=tierSet.length;


if(format.includes('babyleague')){start=sA;end=sD;}else
if(format.includes('nfeleague')){start=sD;end=sI;}else
if(format.includes('singlestageonly')){start=sI;end=sB;}else
if(format.includes('2ndstageleague')){start=sB;end=sZ;}else


if(format.includes('betaparadox')||format.includes('beta')&&format.includes('paradox')){start=sZ;end=sG;}else
if(format.includes('3rdstageleague')){start=sG;end=sT;}else

if(format.includes('norestricted')||format.includes('norestrictedspecial')){start=sT;end=sE;}else
if(format.includes('restrictedparadox')){start=sE;end=sL;}else

if(format.includes('onerestricted')&&format.includes('mythical')){start=sN;end=sF;}else
if(format.includes('tworestricted')&&format.includes('mythical')){start=sF;end=tierSet.length;}else

if(format.includes('onerestricted')){start=sL;end=sP;}else
if(format.includes('tworestricted')){start=sP;end=sN;}else

{start=sG;end=tierSet.length;}

tierSet=tierSet.slice(start,end);


tierSet=tierSet.filter(function(_ref9){var type=_ref9[0],id=_ref9[1];
if(type==='header')return true;

var sp=_this4.dex.species.get(id);
if(!sp||!sp.exists)return false;


if(sp.num===0)return false;


if(sp.num>=10000||sp.num<0)return true;


if(sp.isNonstandard==='Past'||sp.isNonstandard==='Gigantamax'||sp.isNonstandard==='CAP')return false;


if(sp.tier==='CAP'||sp.tier==='CAP LC'||sp.tier==='CAP NFE')return false;

return true;
});
}

if(!(/^(battlestadium|vgc|doublesubers)/g.test(format)||format==='doubles'&&this.formatType==='natdex')){
tierSet=tierSet.filter(function(_ref10){var type=_ref10[0],id=_ref10[1];
if(type==='header'&&id==='DUber by technicality')return false;
if(type==='header'&&id==='Uber by technicality')return false;
if(type==='pokemon')return!id.endsWith('gmax');
return true;
});
}
return tierSet;
};_proto3.
filter=function filter(row,filters){
if(!filters)return true;
if(row[0]!=='pokemon')return true;
var species=this.dex.species.get(row[1]);for(var _i16=0;_i16<
filters.length;_i16++){var _ref11=filters[_i16];var filterType=_ref11[0];var value=_ref11[1];
switch(filterType){
case'type':if(species.types[0]!==value&&species.types[1]!==value)return false;
break;
case'egggroup':if(species.eggGroups[0]!==value&&species.eggGroups[1]!==value)return false;
break;
case'tier':if(this.getTier(species)!==value)return false;
break;
case'ability':if(!Dex.hasAbility(species,value))return false;
break;
case'move':if(!this.canLearn(species.id,value))return false;
break;
case'flag':if(value==='Mega'){if(!species.isMega)return false;}else
{if(!species.tags||!species.tags.includes(value))return false;}
break;
}
}
return true;
};_proto3.
sort=function sort(results,sortCol,reverseSort){var _this5=this;
var sortOrder=reverseSort?-1:1;
if(['hp','atk','def','spa','spd','spe'].includes(sortCol)){
return results.sort(function(_ref12,_ref13){var rowType1=_ref12[0],id1=_ref12[1];var rowType2=_ref13[0],id2=_ref13[1];
var stat1=_this5.dex.species.get(id1).baseStats[sortCol];
var stat2=_this5.dex.species.get(id2).baseStats[sortCol];
return(stat2-stat1)*sortOrder;
});
}else if(sortCol==='bst'){
return results.sort(function(_ref14,_ref15){var rowType1=_ref14[0],id1=_ref14[1];var rowType2=_ref15[0],id2=_ref15[1];
var base1=_this5.dex.species.get(id1).baseStats;
var base2=_this5.dex.species.get(id2).baseStats;
var bst1=base1.hp+base1.atk+base1.def+base1.spa+base1.spd+base1.spe;
var bst2=base2.hp+base2.atk+base2.def+base2.spa+base2.spd+base2.spe;
if(_this5.dex.gen===1){
bst1-=base1.spd;
bst2-=base2.spd;
}
return(bst2-bst1)*sortOrder;
});
}else if(sortCol==='name'){
return results.sort(function(_ref16,_ref17){var rowType1=_ref16[0],id1=_ref16[1];var rowType2=_ref17[0],id2=_ref17[1];
var name1=id1;
var name2=id2;
return(name1<name2?-1:name1>name2?1:0)*sortOrder;
});
}
throw new Error("invalid sortcol");
};return BattlePokemonSearch;}(BattleTypedSearch);var


BattleAbilitySearch=function(_BattleTypedSearch3){function BattleAbilitySearch(){return _BattleTypedSearch3.apply(this,arguments)||this;}_inheritsLoose(BattleAbilitySearch,_BattleTypedSearch3);var _proto4=BattleAbilitySearch.prototype;_proto4.
getTable=function getTable(){return BattleAbilities;};_proto4.
getDefaultResults=function getDefaultResults(reverseSort){
var results=[];
for(var id in BattleAbilities){results.push(['ability',id]);}
if(reverseSort)results.reverse();
return results;
};_proto4.
getBaseResults=function getBaseResults(){
if(!this.species)return this.getDefaultResults();
var format=this.format;
var isHackmons=format.includes('hackmons')||format.endsWith('bh');
var isAAA=format==='almostanyability'||format.includes('aaa');
var dex=this.dex;
console.log('[DEBUG] BattleAbilitySearch.getBaseResults() - species:',this.species,'dex.modid:',dex.modid);
var species=dex.species.get(this.species);
console.log('[DEBUG] Got species:',species.name,'abilities:',species.abilities);
var abilitySet=[['header',"Abilities"]];

if(species.isMega){
abilitySet.unshift(['html',"Will be <strong>"+species.abilities['0']+"</strong> after Mega Evolving."]);
species=dex.species.get(species.baseSpecies);
}

var a0=species.abilities['0'];
var a1=species.abilities['1'];
var aH=species.abilities['H'];
var aS=species.abilities['S'];



if(this.formatType==='indigostarstorm'){
abilitySet=[['header',"Ability Set 1"]];
if(a0)abilitySet.push(['ability',toID(a0)]);
if(a1)abilitySet.push(['ability',toID(a1)]);

if(aH||aS){
abilitySet.push(['header',"Ability Set 2"]);
if(aH)abilitySet.push(['ability',toID(aH)]);
if(aS)abilitySet.push(['ability',toID(aS)]);
}
}else{

abilitySet.push(['ability',toID(a0)]);
if(a1)abilitySet.push(['ability',toID(a1)]);
if(aH){
abilitySet.push(['header',"Hidden Ability"]);
abilitySet.push(['ability',toID(aH)]);
}
if(aS){
abilitySet.push(['header',"Special Event Ability"]);
abilitySet.push(['ability',toID(aS)]);
}
}
if(isAAA||format.includes('metronomebattle')||isHackmons){
var abilities=[];
for(var i in this.getTable()){
var ability=dex.abilities.get(i);
if(ability.isNonstandard)continue;
if(ability.gen>dex.gen)continue;
abilities.push(ability.id);
}

var goodAbilities=[['header',"Abilities"]];
var poorAbilities=[['header',"Situational Abilities"]];
var badAbilities=[['header',"Unviable Abilities"]];for(var _i18=0,_abilities$sort$map2=
abilities.sort().map(function(abil){return dex.abilities.get(abil);});_i18<_abilities$sort$map2.length;_i18++){var _ability=_abilities$sort$map2[_i18];
var rating=_ability.rating;
if(_ability.id==='normalize')rating=3;
if(rating>=3){goodAbilities.push(['ability',_ability.id]);}else
if(rating>=2){poorAbilities.push(['ability',_ability.id]);}else
{badAbilities.push(['ability',_ability.id]);}
}
abilitySet=[].concat(goodAbilities,poorAbilities,badAbilities);

if(species.isMega){if(isAAA){abilitySet.unshift(['html',"Will be <strong>"+species.abilities['0']+"</strong> after Mega Evolving."]);}}
}
return abilitySet;
};_proto4.
filter=function filter(row,filters){
if(!filters)return true;
if(row[0]!=='ability')return true;
var ability=this.dex.abilities.get(row[1]);for(var _i20=0;_i20<
filters.length;_i20++){var _ref18=filters[_i20];var filterType=_ref18[0];var value=_ref18[1];switch(filterType){
case'pokemon':if(!Dex.hasAbility(this.dex.species.get(value),ability.name))return false;
break;
}
}
return true;
};_proto4.
sort=function sort(results,sortCol,reverseSort){throw new Error("invalid sortcol");};return BattleAbilitySearch;}(BattleTypedSearch);var


BattleItemSearch=function(_BattleTypedSearch4){function BattleItemSearch(){return _BattleTypedSearch4.apply(this,arguments)||this;}_inheritsLoose(BattleItemSearch,_BattleTypedSearch4);var _proto5=BattleItemSearch.prototype;_proto5.
getTable=function getTable(){return BattleItems;};_proto5.
getDefaultResults=function getDefaultResults(){var _this$formatType10,_this$formatType11;
var table=BattleTeambuilderTable;

if((_this$formatType10=this.formatType)!=null&&_this$formatType10.startsWith('bdsp')){
table=table['gen8bdsp'];
}else if(this.formatType==='bw1'){
table=table['gen5bw1'];
}else if(this.formatType==='rs'){
table=table['gen3rs'];
}else if(this.formatType==='indigostarstorm'){

table=table['gen9indigostarstorm']||table;

if(!table.items&&!table.itemSet)table=BattleTeambuilderTable['gen9']||BattleTeambuilderTable["gen"+this.dex.gen];
}else if(this.formatType==='natdex'){
table=table["gen"+this.dex.gen+"natdex"];
}else if((_this$formatType11=this.formatType)!=null&&_this$formatType11.endsWith('doubles')){
table=table["gen"+this.dex.gen+"doubles"];
}else if(this.formatType==='metronome'){
table=table["gen"+this.dex.gen+"metronome"];
}else if(this.dex.gen<9){
table=table["gen"+this.dex.gen];
}else{

table=table['gen9']||table;
}


if(!table||!table.items&&!table.itemSet)return[];
if(!table.itemSet){
table.itemSet=table.items.map(function(r){
if(typeof r==='string')return['item',r];
return[r[0],r[1]];
});
table.items=null;
}

return table.itemSet;
};_proto5.
getBaseResults=function getBaseResults(){var _this$set;
if(!this.species)return this.getDefaultResults();
var speciesName=this.dex.species.get(this.species).name;
var results=this.getDefaultResults();
var speciesSpecific=[];
var abilitySpecific=[];
var abilityItem={
protosynthesis:'boosterenergy',
quarkdrive:'boosterenergy'



}[toID((_this$set=this.set)==null?void 0:_this$set.ability)];for(var _i22=0;_i22<
results.length;_i22++){var _item$itemUser;var row=results[_i22];
if(row[0]!=='item')continue;
var item=this.dex.items.get(row[1]);
if((_item$itemUser=item.itemUser)!=null&&_item$itemUser.includes(speciesName))speciesSpecific.push(row);
if(abilityItem===item.id)abilitySpecific.push(row);
}
if(speciesSpecific.length){
return[
['header',"Specific to "+speciesName]].concat(
speciesSpecific,
results);

}
if(abilitySpecific.length){
return[
['header',"Specific to "+this.set.ability]].concat(
abilitySpecific,
results);

}
return results;
};_proto5.
defaultFilter=function defaultFilter(results){
if(this.species&&!this.dex.species.get(this.species).nfe){
results.splice(results.findIndex(function(row){return row[1]==='eviolite';}),1);
return results;
}
return results;
};_proto5.








getItemClass=function getItemClass(item){
var id=item.id;

if(BattleItemSearch.fragileItems.has(id))return'fragile';
if(BattleItemSearch.volatileItems.has(id))return'volatile';
if(BattleItemSearch.pokeballItems.has(id))return'pokeball';
if(BattleItemSearch.berryItems.has(id))return'berry';
if(BattleItemSearch.tradeEvoItems.has(id))return'tradeevo';
if(BattleItemSearch.evolutionItems.has(id))return'evolution';
if(BattleItemSearch.consumableItems.has(id))return'consumable';
return'';
};_proto5.
filter=function filter(row,filters){
if(row[0]!=='item')return true;
var item=this.dex.items.get(row[1]);for(var _i24=0;_i24<
filters.length;_i24++){var _ref19=filters[_i24];var filterType=_ref19[0];var value=_ref19[1];
if(filterType==='itemclass'){
var itemClass=this.getItemClass(item);
var v=value==='berries'?'berry':value;
if(itemClass!==v)return false;
}
}
return true;
};_proto5.
sort=function sort(results,sortCol,reverseSort){throw new Error("invalid sortcol");};return BattleItemSearch;}(BattleTypedSearch);BattleItemSearch.fragileItems=new Set(['airballoon','focussash','powerherb','electricseed','grassyseed','mistyseed','psychicseed','snowball','weaknesspolicy','absorbbulb','cellbattery','luminousmoss','mentalherb','whiteherb','redcard']);BattleItemSearch.volatileItems=new Set(['boosterenergy']);BattleItemSearch.berryItems=new Set(['aguavberry','apicotberry','aspearberry','babiriberry','belueberry','blukberry','chartiberry','cheriberry','chestoberry','chilanberry','chopleberry','cobaberry','colburberry','cornnberry','custapberry','durinberry','enigmaberry','figyberry','ganlonberry','grepaberry','habanberry','hondewberry','iapapaberry','jabocaberry','kasibberry','kebiaberry','kelpsyberry','lansatberry','leppaberry','liechiberry','lumberry','magoberry','magostberry','micleberry','nanabberry','nomelberry','occaberry','oranberry','pamtreberry','passhoberry','payapaberry','pechaberry','persimberry','petayaberry','pinapberry','pomegberry','qualotberry','rabutaberry','rawstberry','razzberry','rindoberry','rowapberry','salacberry','shucaberry','sitrusberry','spelonberry','starfberry','tamatoberry','tangaberry','wacanberry','watmelberry','wepearberry','wikiberry','yacheberry']);BattleItemSearch.pokeballItems=new Set(['pokeball','greatball','ultraball','masterball','safariball','fastball','levelball','lureball','heavyball','loveball','friendball','moonball','sportball','netball','diveball','nestball','repeatball','timerball','luxuryball','premierball','duskball','healball','quickball','cherishball','parkball','dreamball','beastball']);BattleItemSearch.evolutionItems=new Set(['firestone','waterstone','thunderstone','leafstone','moonstone','sunstone','shinystone','duskstone','dawnstone','everstone','linkingcord','ovalstone','icestone']);BattleItemSearch.tradeEvoItems=new Set(['deepseatooth','deepseascale','dragonscale','electirizer','magmarizer','metalcoat','prismscale','protector','reapercloth','sachet','upgrade','whippeddream']);BattleItemSearch.consumableItems=new Set(['normalgem','fightinggem','flyinggem','poisongem','groundgem','rockgem','buggem','ghostgem','steelgem','firegem','watergem','grassgem','electricgem','psychicgem','icegem','dragongem','darkgem','fairygem','focusband','kingsrock','razorclaw','razorfang']);var


BattleMoveSearch=function(_BattleTypedSearch5){function BattleMoveSearch(){var _this6;for(var _len2=arguments.length,args=new Array(_len2),_key2=0;_key2<_len2;_key2++){args[_key2]=arguments[_key2];}_this6=_BattleTypedSearch5.call.apply(_BattleTypedSearch5,[this].concat(args))||this;_this6.
sortRow=['sortmove',''];return _this6;}_inheritsLoose(BattleMoveSearch,_BattleTypedSearch5);var _proto6=BattleMoveSearch.prototype;_proto6.
getTable=function getTable(){return BattleMovedex;};_proto6.
getDefaultResults=function getDefaultResults(){
var results=[];
results.push(['header',"Moves"]);
for(var id in BattleMovedex){
switch(id){
case'paleowave':
results.push(['header',"CAP moves"]);
break;
case'magikarpsrevenge':
continue;
}
results.push(['move',id]);
}
return results;
};_proto6.
getFlagWeightsForTypes=function getFlagWeightsForTypes(types){


var table=window.TypeAffinityAversion;
var weights={};
if(!table)return weights;for(var _i26=0;_i26<

types.length;_i26++){var typeName=types[_i26];
var entry=table[toID(typeName)];
if(!entry)continue;


if(entry.affinity){
for(var flag in entry.affinity){
var w=Number(entry.affinity[flag])||0;
weights[flag]=(weights[flag]||0)+w;
}
}

if(entry.aversion){
for(var _flag in entry.aversion){
var _w=Number(entry.aversion[_flag])||0;
weights[_flag]=(weights[_flag]||0)-_w;
}
}
}
return weights;
};_proto6.

getMoveAffinityScore=function getMoveAffinityScore(move,flagWeights){
var score=0;
for(var flag in move.flags||{}){
score+=flagWeights[flag]||0;
}
return score;
};_proto6.
moveIsNotUseless=function moveIsNotUseless(id,species,moves,set){var _this$formatType12;


var dex=this.dex;
var abilityid=set?toID(set.ability):'';
var itemid=set?toID(set.item):'';
if(this.formatType==='metronome'){if(id==='metronome')return true;}
if(itemid==='pidgeotite')abilityid='noguard';
if(itemid==='blastoisinite')abilityid='megalauncher';
if(itemid==='aerodactylite')abilityid='toughclaws';
if(itemid==='glalitite')abilityid='refrigerate';
switch(id){
case'fakeout':case'flamecharge':case'nuzzle':case'poweruppunch':case'trailblaze':
return abilityid!=='sheerforce';
case'solarbeam':case'solarblade':
return['desolateland','drought','chlorophyll','orichalcumpulse'].includes(abilityid)||itemid==='powerherb';
case'dynamicpunch':case'grasswhistle':case'inferno':case'sing':
return abilityid==='noguard';
case'heatcrash':case'heavyslam':
return species.weightkg>=(species.evos?75:130);
case'aerialace':
return['technician','toughclaws'].includes(abilityid)&&!moves.includes('bravebird');
case'ancientpower':
return['serenegrace','technician'].includes(abilityid)||!moves.includes('powergem');
case'aquajet':
return!moves.includes('jetpunch');
case'aurawheel':
return species.baseSpecies==='Morpeko';
case'axekick':
return!moves.includes('highjumpkick');
case'barrier':
return!moves.includes('acidarmor');
case'bellydrum':
return moves.includes('aquajet')||moves.includes('jetpunch')||moves.includes('extremespeed')||['iceface','unburden'].includes(abilityid);
case'bulletseed':
return['skilllink','technician'].includes(abilityid);
case'chillingwater':
return!moves.includes('scald');
case'counter':case'mirrorcoat':
return species.baseStats.hp>=65;
case'dazzlinggleam':
return!moves.includes('alluringvoice')||((_this$formatType12=this.formatType)==null?void 0:_this$formatType12.includes('doubles'));
case'darkvoid':
return dex.gen<7;
case'dualwingbeat':
return abilityid==='technician'||!moves.includes('drillpeck');
case'electroshot':
return true;
case'feint':
return abilityid==='refrigerate';
case'futuresight':
return dex.gen>5;
case'grassyglide':
return abilityid==='grassysurge';
case'gyroball':
return species.baseStats.spe<=60;
case'headbutt':
return abilityid==='serenegrace';
case'hex':
return!moves.includes('infernalparade');
case'hiddenpowerelectric':
return!(dex.gen<4&&moves.includes('thunderpunch'))&&!moves.includes('thunderbolt');
case'hiddenpowerfighting':
return!(dex.gen<4&&moves.includes('brickbreak'))&&!moves.includes('aurasphere')&&!moves.includes('focusblast');
case'hiddenpowerfire':
return!(dex.gen<4&&moves.includes('firepunch'))&&!moves.includes('flamethrower')&&!moves.includes('mysticalfire')&&!moves.includes('burningjealousy');
case'hiddenpowergrass':
return!(dex.gen<4&&moves.includes('leafblade'))||dex.gen>3&&!moves.includes('energyball')&&!moves.includes('grassknot')&&!moves.includes('gigadrain');
case'hiddenpowerice':
return!moves.includes('icebeam')&&dex.gen<4&&!moves.includes('icepunch')||dex.gen>5&&!moves.includes('aurorabeam')&&!moves.includes('glaciate');
case'hiddenpowerflying':
return dex.gen<4&&!moves.includes('drillpeck');
case'hiddenpowerbug':
return dex.gen<4&&!moves.includes('megahorn');
case'hiddenpowerpsychic':
return species.baseSpecies==='Unown';
case'hyperspacefury':
return species.id==='hoopaunbound';
case'hypnosis':
return dex.gen<4&&!moves.includes('sleeppowder')||dex.gen>6&&abilityid==='baddreams';
case'icepunch':
return!moves.includes('icespinner')||['sheerforce','ironfist'].includes(abilityid)||itemid==='punchingglove';
case'iciclecrash':
return!moves.includes('mountaingale');
case'iciclespear':
return dex.gen>3;
case'icywind':

return species.baseSpecies==='Keldeo'||this.isDoubles;
case'infestation':
return moves.includes('stickyweb');
case'irondefense':
return!moves.includes('acidarmor')&&!moves.includes('barrier');
case'irontail':
return dex.gen>5&&!moves.includes('ironhead')&&!moves.includes('gunkshot')&&!moves.includes('poisonjab');
case'jumpkick':
return!moves.includes('highjumpkick')&&!moves.includes('axekick');
case'lastresort':
return set&&set.moves.length<3;
case'leafblade':
return true;
case'leechlife':
return dex.gen>6;
case'magiccoat':
return dex.gen>3;
case'meteorbeam':
return true;
case'mysticalfire':
return dex.gen>6&&!moves.includes('flamethrower');
case'naturepower':
return dex.gen===5;
case'needlearm':
return dex.gen<4;
case'nightslash':
return!moves.includes('crunch')&&!(moves.includes('knockoff')&&dex.gen>=6);
case'outrage':
return dex.gen>3&&!moves.includes('glaiverush');
case'petaldance':
return abilityid==='owntempo';
case'phantomforce':
return!moves.includes('poltergeist')&&!moves.includes('shadowclaw')||this.isDoubles;
case'poisonfang':
return species.types.includes('Poison')&&!moves.includes('gunkshot')&&!moves.includes('poisonjab');
case'raindance':
return dex.gen<4;
case'relicsong':
return species.id==='meloetta';
case'refresh':
return!moves.includes('aromatherapy')&&!moves.includes('healbell');
case'risingvoltage':
return abilityid==='electricsurge'||abilityid==='hadronengine';
case'rocktomb':
return abilityid==='technician';
case'selfdestruct':
return dex.gen<5&&!moves.includes('explosion');
case'shadowpunch':
return abilityid==='ironfist'&&!moves.includes('ragefist');
case'shelter':
return!moves.includes('acidarmor')&&!moves.includes('irondefense');
case'skyuppercut':
return dex.gen<4;
case'smackdown':
return species.types.includes('Ground');
case'smartstrike':
return species.types.includes('Steel')&&!moves.includes('ironhead');
case'soak':
return abilityid==='unaware';
case'steelwing':
return!moves.includes('ironhead');
case'stompingtantrum':
return!moves.includes('earthquake')&&!moves.includes('drillrun')||this.isDoubles;
case'stunspore':
return!moves.includes('thunderwave');
case'sunnyday':
return dex.gen<4;
case'technoblast':
return dex.gen>5&&itemid.endsWith('drive')||itemid==='dousedrive';
case'teleport':
return dex.gen>7;
case'temperflare':
return!moves.includes('flareblitz')&&!moves.includes('pyroball')&&!moves.includes('sacredfire')&&!moves.includes('bitterblade')&&!moves.includes('firepunch')||this.isDoubles;
case'terrainpulse':case'waterpulse':
return['megalauncher','technician'].includes(abilityid)&&!moves.includes('originpulse');
case'thief':
return dex.gen===2;
case'toxicspikes':
return abilityid!=='toxicdebris';
case'triattack':
return dex.gen>3;
case'trickroom':
return species.baseStats.spe<=100;
case'wildcharge':
return!moves.includes('supercellslam');
case'zapcannon':
return abilityid==='noguard'||dex.gen<4&&!moves.includes('thunderwave');
}
if(this.isDoubles&&BattleMoveSearch.GOOD_DOUBLES_MOVES.includes(id)){return true;}
var move=dex.moves.get(id);
if(!move.exists)return true;
if(move.category==='Status'){return BattleMoveSearch.GOOD_STATUS_MOVES.includes(id);}
if(move.basePower<75){return BattleMoveSearch.GOOD_WEAK_MOVES.includes(id)||abilityid==='technician'&&move.basePower===60;}
if(id==='skydrop')return true;
if(move.flags['charge']){return itemid==='powerherb';}
if(move.flags['recharge']){return false;}
if(move.flags['slicing']&&abilityid==='sharpness'){return true;}
return!BattleMoveSearch.BAD_STRONG_MOVES.includes(id);
};_proto6.












getBaseResults=function getBaseResults(){var _this$formatType13,_this$formatType14,_this$formatType15,_this$formatType16,_lsetTable;
if(!this.species)return this.getDefaultResults();
var dex=this.dex;
var species=dex.species.get(this.species);
var format=this.format;
var isHackmons=format.includes('hackmons')||format.endsWith('bh');
var isSTABmons=format.includes('stabmons')||format==='staaabmons';
var isTradebacks=format.includes('tradebacks');
var regionBornLegality=dex.gen>=6&&(/^battle(spot|stadium|festival)/.test(format)||format.startsWith('bss')||format.startsWith('vgc')||dex.gen===9&&this.formatType!=='natdex');
var learnsetid=this.firstLearnsetid(species.id);
var moves=[];
var sketchMoves=[];
var sketch=false;
var gen=""+dex.gen;
var lsetTable=BattleTeambuilderTable;
if((_this$formatType13=this.formatType)!=null&&_this$formatType13.startsWith('bdsp'))lsetTable=lsetTable['gen8bdsp'];
if(this.formatType==='letsgo')lsetTable=lsetTable['gen7letsgo'];
if(this.formatType==='bw1')lsetTable=lsetTable['gen5bw1'];
if(this.formatType==='rs')lsetTable=lsetTable['gen3rs'];
if((_this$formatType14=this.formatType)!=null&&_this$formatType14.startsWith('ssdlc1'))lsetTable=lsetTable['gen8dlc1'];
if(this.formatType==='indigostarstorm')lsetTable=lsetTable['gen9indigostarstorm']||lsetTable;
if((_this$formatType15=this.formatType)!=null&&_this$formatType15.startsWith('predlc'))lsetTable=lsetTable['gen9predlc'];
if((_this$formatType16=this.formatType)!=null&&_this$formatType16.startsWith('svdlc1'))lsetTable=lsetTable['gen9dlc1'];
if(this.formatType==='indigostarstorm')lsetTable=lsetTable['gen9indigostarstorm']||lsetTable;
console.log('[DEBUG getMovesList] formatType:',this.formatType,'has learnsets?',!!((_lsetTable=lsetTable)!=null&&_lsetTable.learnsets));
while(learnsetid){
var learnset=lsetTable.learnsets[learnsetid];
console.log('[DEBUG getMovesList] learnsetid:',learnsetid,'has learnset?',!!learnset,'move count:',learnset?Object.keys(learnset).length:0);
if(learnset){
for(var moveid in learnset){var _this$formatType17,_BattleTeambuilderTab,_this$formatType18,_BattleTeambuilderTab2,_this$formatType19,_BattleTeambuilderTab3;
var learnsetEntry=learnset[moveid];
var move=dex.moves.get(moveid);
var minGenCode={6:'p',7:'q',8:'g',9:'a'};
if(regionBornLegality&&!learnsetEntry.includes(minGenCode[dex.gen])){continue;}
if(this.eggMovesOnly(learnsetid,species.id)&&(!learnsetEntry.includes('e')||dex.gen!==9)){continue;}
if(!learnsetEntry.includes(gen)&&(!isTradebacks?true:!(move.gen<=dex.gen&&learnsetEntry.includes(""+(dex.gen+1))))){continue;}
if(this.formatType!=='natdex'&&move.isNonstandard==="Past"){continue;}
if((_this$formatType17=this.formatType)!=null&&_this$formatType17.startsWith('dlc1')&&(_BattleTeambuilderTab=BattleTeambuilderTable['gen8dlc1'])!=null&&_BattleTeambuilderTab.nonstandardMoves.includes(moveid)){continue;}
if((_this$formatType18=this.formatType)!=null&&_this$formatType18.includes('predlc')&&this.formatType!=='predlcnatdex'&&(_BattleTeambuilderTab2=BattleTeambuilderTable['gen9predlc'])!=null&&_BattleTeambuilderTab2.nonstandardMoves.includes(moveid)){continue;}
if((_this$formatType19=this.formatType)!=null&&_this$formatType19.includes('svdlc1')&&this.formatType!=='svdlc1natdex'&&(_BattleTeambuilderTab3=BattleTeambuilderTable['gen9dlc1'])!=null&&_BattleTeambuilderTab3.nonstandardMoves.includes(moveid)){continue;}
if(moves.includes(moveid))continue;
moves.push(moveid);
if(moveid==='sketch')sketch=true;
if(moveid==='hiddenpower'){moves.push('hiddenpowerbug','hiddenpowerdark','hiddenpowerdragon','hiddenpowerelectric','hiddenpowerfighting','hiddenpowerfire','hiddenpowerflying','hiddenpowerghost','hiddenpowergrass','hiddenpowerground','hiddenpowerice','hiddenpowerpoison','hiddenpowerpsychic','hiddenpowerrock','hiddenpowersteel','hiddenpowerwater');}
}
}
learnsetid=this.nextLearnsetid(learnsetid,species.id,true);
}
if(sketch||isHackmons){
if(isHackmons)moves=[];
for(var id in BattleMovedex){
if(!format.startsWith('cap')&&(id==='paleowave'||id==='shadowstrike'))continue;
var _move=dex.moves.get(id);
if(_move.gen>dex.gen)continue;
if(sketch){
if(_move.flags['nosketch']||_move.isMax||_move.isZ)continue;
if(_move.isNonstandard&&_move.isNonstandard!=='Past')continue;
if(_move.isNonstandard==='Past'&&this.formatType!=='natdex')continue;
sketchMoves.push(_move.id);
}else{
if(!(dex.gen<8||this.formatType==='natdex')&&_move.isZ)continue;
if(typeof _move.isMax==='string')continue;
if(_move.isMax&&dex.gen>8)continue;
if(_move.isNonstandard==='Past'&&this.formatType!=='natdex')continue;
if(_move.isNonstandard==='LGPE'&&this.formatType!=='letsgo')continue;
moves.push(_move.id);
}
}
}
if(this.formatType==='metronome')moves=['metronome'];
if(isSTABmons){
for(var _id8 in this.getTable()){
var _move2=dex.moves.get(_id8);
if(moves.includes(_move2.id))continue;
if(_move2.gen>dex.gen)continue;
if(_move2.isZ||_move2.isMax||_move2.isNonstandard&&_move2.isNonstandard!=='Unobtainable')continue;
var speciesTypes=[];
var moveTypes=[];
for(var i=dex.gen;i>=species.gen&&i>=_move2.gen;i--){
var genDex=Dex.forGen(i);
moveTypes.push(genDex.moves.get(_move2.name).type);
var pokemon=genDex.species.get(species.name);
var baseSpecies=genDex.species.get(pokemon.changesFrom||pokemon.name);
if(!pokemon.battleOnly)speciesTypes.push.apply(speciesTypes,pokemon.types);
var prevo=pokemon.prevo;
while(prevo){
var prevoSpecies=genDex.species.get(prevo);
speciesTypes.push.apply(speciesTypes,prevoSpecies.types);
prevo=prevoSpecies.prevo;
}
if(pokemon.battleOnly&&typeof pokemon.battleOnly==='string'){species=dex.species.get(pokemon.battleOnly);}
var excludedForme=function(s){return['Alola','Alola-Totem','Galar','Galar-Zen','Hisui','Paldea','Paldea-Combat','Paldea-Blaze','Paldea-Aqua'].includes(s.forme);};
if(baseSpecies.otherFormes&&!['Wormadam','Urshifu'].includes(baseSpecies.baseSpecies)){
if(!excludedForme(species))speciesTypes.push.apply(speciesTypes,baseSpecies.types);for(var _i28=0,_baseSpecies$otherFor2=
baseSpecies.otherFormes;_i28<_baseSpecies$otherFor2.length;_i28++){var formeName=_baseSpecies$otherFor2[_i28];
var forme=dex.species.get(formeName);
if(!forme.battleOnly&&!excludedForme(forme))speciesTypes.push.apply(speciesTypes,forme.types);
}
}
}
var valid=false;for(var _i30=0;_i30<
moveTypes.length;_i30++){var type=moveTypes[_i30];if(speciesTypes.includes(type)){
valid=true;
break;
}
}
if(valid)moves.push(_id8);
}
}
moves.sort();
sketchMoves.sort();


var flagWeights=this.getFlagWeightsForTypes(species.types);


var affinity=[];
var neutral=[];
var aversion=[];


var allMoveIds=[].concat(
moves.map(function(x){return x;}),
sketchMoves.map(function(x){return x;}));for(var _i32=0;_i32<


allMoveIds.length;_i32++){var _id9=allMoveIds[_i32];
var _move3=dex.moves.get(_id9);
var score=this.getMoveAffinityScore(_move3,flagWeights);
var entry={id:_id9,score:score};

if(score>0)affinity.push(entry);else
if(score<0)aversion.push(entry);else
neutral.push(entry);
}


affinity.sort(function(a,b){return b.score-a.score||(a.id<b.id?-1:a.id>b.id?1:0);});
neutral.sort(function(a,b){return a.id<b.id?-1:a.id>b.id?1:0;});
aversion.sort(function(a,b){return a.score-b.score||(a.id<b.id?-1:a.id>b.id?1:0);});

var out=[];
if(affinity.length){
out.push(['header','Affinity']);
out.push.apply(out,affinity.map(function(x){return['move',x.id];}));
}
if(neutral.length){
out.push(['header','Neutral']);
out.push.apply(out,neutral.map(function(x){return['move',x.id];}));
}
if(aversion.length){
out.push(['header','Aversion']);
out.push.apply(out,aversion.map(function(x){return['move',x.id];}));
}
return out;
};_proto6.
filter=function filter(row,filters){
if(!filters)return true;
if(row[0]!=='move')return true;
var move=this.dex.moves.get(row[1]);for(var _i34=0;_i34<
filters.length;_i34++){var _ref20=filters[_i34];var filterType=_ref20[0];var value=_ref20[1];
switch(filterType){
case'type':{
var type2=move.type2;
if(move.type!==value&&type2!==value)return false;
break;
}
case'category':if(move.category!==value)return false;
break;
case'flag':if(!(value in move.flags))return false;
break;
case'pokemon':if(!this.canLearn(value,move.id))return false;
break;
}
}
return true;
};_proto6.
sort=function sort(results,sortCol,reverseSort){var _this7=this;
var sortOrder=reverseSort?-1:1;
switch(sortCol){
case'power':
var powerTable={
"return":102,frustration:102,spitup:300,trumpcard:200,naturalgift:80,grassknot:120,
lowkick:120,gyroball:150,electroball:150,flail:200,reversal:200,present:120,
wringout:120,crushgrip:120,heatcrash:120,heavyslam:120,fling:130,magnitude:150,
beatup:24,punishment:1020,psywave:1250,nightshade:1200,seismictoss:1200,
dragonrage:1140,sonicboom:1120,superfang:1350,endeavor:1399,sheercold:1501,
fissure:1500,horndrill:1500,guillotine:1500
};
return results.sort(function(_ref21,_ref22){var rowType1=_ref21[0],id1=_ref21[1];var rowType2=_ref22[0],id2=_ref22[1];
var move1=_this7.dex.moves.get(id1);
var move2=_this7.dex.moves.get(id2);
var pow1=move1.basePower||powerTable[id1]||(move1.category==='Status'?-1:1400);
var pow2=move2.basePower||powerTable[id2]||(move2.category==='Status'?-1:1400);
return(pow2-pow1)*sortOrder;
});
case'accuracy':
return results.sort(function(_ref23,_ref24){var rowType1=_ref23[0],id1=_ref23[1];var rowType2=_ref24[0],id2=_ref24[1];
var accuracy1=_this7.dex.moves.get(id1).accuracy||0;
var accuracy2=_this7.dex.moves.get(id2).accuracy||0;
if(accuracy1===true)accuracy1=101;
if(accuracy2===true)accuracy2=101;
return(accuracy2-accuracy1)*sortOrder;
});
case'crit':
return results.sort(function(_ref25,_ref26){var _m1$critRatio,_m2$critRatio;var rowType1=_ref25[0],id1=_ref25[1];var rowType2=_ref26[0],id2=_ref26[1];
var m1=_this7.dex.moves.get(id1);
var m2=_this7.dex.moves.get(id2);


var c1=(_m1$critRatio=m1.critRatio)!=null?_m1$critRatio:4;
var c2=(_m2$critRatio=m2.critRatio)!=null?_m2$critRatio:4;


if(c2!==c1)return(c2-c1)*sortOrder;


return(id1<id2?-1:id1>id2?1:0)*sortOrder;
});
case'pp':
return results.sort(function(_ref27,_ref28){var rowType1=_ref27[0],id1=_ref27[1];var rowType2=_ref28[0],id2=_ref28[1];
var pp1=_this7.dex.moves.get(id1).pp||0;
var pp2=_this7.dex.moves.get(id2).pp||0;
return(pp2-pp1)*sortOrder;
});
case'flags:':
return results.sort(function(_ref29,_ref30){var rowType1=_ref29[0],id1=_ref29[1];var rowType2=_ref30[0],id2=_ref30[1];
var f1=Object.keys(_this7.dex.moves.get(id1).flags||{}).sort().join(',');
var f2=Object.keys(_this7.dex.moves.get(id2).flags||{}).sort().join(',');
if(f1!==f2)return(f1<f2?-1:1)*sortOrder;
return(id1<id2?-1:id1>id2?1:0)*sortOrder;
});
case'name':
return results.sort(function(_ref31,_ref32){var rowType1=_ref31[0],id1=_ref31[1];var rowType2=_ref32[0],id2=_ref32[1];
var name1=id1;
var name2=id2;
return(name1<name2?-1:name1>name2?1:0)*sortOrder;
});
}
throw new Error("invalid sortcol");
};return BattleMoveSearch;}(BattleTypedSearch);BattleMoveSearch.GOOD_STATUS_MOVES=['acidarmor','agility','aromatherapy','auroraveil','autotomize','banefulbunker','batonpass','bellydrum','bulkup','burningbulwark','calmmind','chillyreception','clangoroussoul','coil','cottonguard','courtchange','curse','defog','destinybond','detect','disable','dragondance','encore','extremeevoboost','filletaway','geomancy','glare','haze','healbell','healingwish','healorder','heartswap','honeclaws','kingsshield','leechseed','lightscreen','lovelykiss','lunardance','magiccoat','maxguard','memento','milkdrink','moonlight','morningsun','nastyplot','naturesmadness','noretreat','obstruct','painsplit','partingshot','perishsong','protect','quiverdance','recover','reflect','reflecttype','rest','revivalblessing','roar','rockpolish','roost','shedtail','shellsmash','shiftgear','shoreup','silktrap','slackoff','sleeppowder','sleeptalk','softboiled','spikes','spikyshield','spore','stealthrock','stickyweb','strengthsap','substitute','switcheroo','swordsdance','synthesis','tailglow','tailwind','taunt','thunderwave','tidyup','toxic','transform','trick','victorydance','whirlwind','willowisp','wish','yawn'];BattleMoveSearch.GOOD_WEAK_MOVES=['accelerock','acrobatics','aquacutter','avalanche','barbbarrage','bonemerang','bouncybubble','bulletpunch','buzzybuzz','ceaselessedge','circlethrow','clearsmog','doubleironbash','dragondarts','dragontail','drainingkiss','endeavor','facade','firefang','flipturn','flowertrick','freezedry','frustration','geargrind','gigadrain','grassknot','gyroball','icefang','iceshard','iciclespear','infernalparade','knockoff','lastrespects','lowkick','machpunch','mortalspin','mysticalpower','naturesmadness','nightshade','nuzzle','pikapapow','populationbomb','psychocut','psyshieldbash','pursuit','quickattack','ragefist','rapidspin','return','rockblast','ruination','saltcure','scorchingsands','seismictoss','shadowclaw','shadowsneak','sizzlyslide','stoneaxe','storedpower','stormthrow','suckerpunch','superfang','surgingstrikes','tachyoncutter','tailslap','thunderclap','tripleaxel','tripledive','twinbeam','uturn','vacuumwave','veeveevolley','voltswitch','watershuriken','weatherball'];BattleMoveSearch.BAD_STRONG_MOVES=['belch','burnup','crushclaw','dragonrush','dreameater','eggbomb','firepledge','flyingpress','futuresight','grasspledge','hyperbeam','hyperfang','hyperspacehole','jawlock','landswrath','megakick','megapunch','mistyexplosion','muddywater','nightdaze','pollenpuff','rockclimb','selfdestruct','shelltrap','skyuppercut','slam','strength','submission','synchronoise','takedown','thrash','uproar','waterpledge'];BattleMoveSearch.GOOD_DOUBLES_MOVES=['allyswitch','bulldoze','coaching','electroweb','faketears','fling','followme','healpulse','helpinghand','junglehealing','lifedew','lunarblessing','muddywater','pollenpuff','psychup','ragepowder','safeguard','skillswap','snipeshot','wideguard','decorate','snarl'];var





BattleCategorySearch=function(_BattleTypedSearch6){function BattleCategorySearch(){return _BattleTypedSearch6.apply(this,arguments)||this;}_inheritsLoose(BattleCategorySearch,_BattleTypedSearch6);var _proto7=BattleCategorySearch.prototype;_proto7.
getTable=function getTable(){return{physical:1,special:1,status:1};};_proto7.
getDefaultResults=function getDefaultResults(reverseSort){
var results=[
['category','physical'],
['category','special'],
['category','status']];

if(reverseSort)results.reverse();
return results;
};_proto7.
getBaseResults=function getBaseResults(){return this.getDefaultResults();};_proto7.
filter=function filter(row,filters){throw new Error("invalid filter");};_proto7.
sort=function sort(results,sortCol,reverseSort){throw new Error("invalid sortcol");};return BattleCategorySearch;}(BattleTypedSearch);var


BattleFlagSearch=function(_BattleTypedSearch7){function BattleFlagSearch(){return _BattleTypedSearch7.apply(this,arguments)||this;}_inheritsLoose(BattleFlagSearch,_BattleTypedSearch7);var _proto8=BattleFlagSearch.prototype;_proto8.
getTable=function getTable(){
return{
contact:1,binding:1,bite:1,bomb:1,bullet:1,
drain:1,explosive:1,fist:1,powder:1,pulse:1,slicing:1,sound:1,
wind:1,airborne:1,aura:1,beam:1,breath:1,claw:1,crash:1,crush:1,
kick:1,launch:1,light:1,lunar:1,magic:1,pierce:1,shadow:1,
solar:1,spin:1,sweep:1,"throw":1,weapon:1,wing:1,bypassprotect:1,
nonreflectable:1,nonmirror:1,nonsnatchable:1,bypasssubstitute:1,maxmove:1,gmaxmove:1,zmove:1
};
};_proto8.
getDefaultResults=function getDefaultResults(reverseSort){
var results=[
['flag','contact'],
['flag','binding'],
['flag','bite'],
['flag','bomb'],
['flag','bullet'],
['flag','drain'],
['flag','explosive'],
['flag','fist'],
['flag','powder'],
['flag','pulse'],
['flag','slicing'],
['flag','sound'],
['flag','wind'],
['flag','airborne'],
['flag','aura'],
['flag','beam'],
['flag','breath'],
['flag','claw'],
['flag','crash'],
['flag','crush'],
['flag','kick'],
['flag','launch'],
['flag','light'],
['flag','lunar'],
['flag','magic'],
['flag','pierce'],
['flag','shadow'],
['flag','solar'],
['flag','spin'],
['flag','sweep'],
['flag','throw'],
['flag','weapon'],
['flag','wing'],
['flag','bypassprotect'],
['flag','nonreflectable'],
['flag','nonmirror'],
['flag','nonsnatchable'],
['flag','bypasssubstitute'],
['flag','maxmove'],
['flag','gmaxmove'],
['flag','zmove']];

if(reverseSort)results.reverse();
return results;
};_proto8.
getBaseResults=function getBaseResults(){return this.getDefaultResults();};_proto8.
filter=function filter(row,filters){throw new Error("invalid filter");};_proto8.
sort=function sort(results,sortCol,reverseSort){throw new Error("invalid sortcol");};return BattleFlagSearch;}(BattleTypedSearch);var


BattleTypeSearch=function(_BattleTypedSearch8){function BattleTypeSearch(){return _BattleTypedSearch8.apply(this,arguments)||this;}_inheritsLoose(BattleTypeSearch,_BattleTypedSearch8);var _proto9=BattleTypeSearch.prototype;_proto9.
getTable=function getTable(){return window.BattleTypeChart;};_proto9.
getDefaultResults=function getDefaultResults(reverseSort){
var results=[];
for(var id in window.BattleTypeChart){results.push(['type',id]);}
if(reverseSort)results.reverse();
return results;
};_proto9.
getBaseResults=function getBaseResults(){return this.getDefaultResults();};_proto9.
filter=function filter(row,filters){throw new Error("invalid filter");};_proto9.
sort=function sort(results,sortCol,reverseSort){throw new Error("invalid sortcol");};return BattleTypeSearch;}(BattleTypedSearch);
//# sourceMappingURL=battle-dex-search.js.map