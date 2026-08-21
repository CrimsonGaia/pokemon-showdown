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
if(type==='flag'){entry[1]=this.capitalizeFirst(entry[1]);}
if(type==='ability')entry[1]=this.dex.abilities.get(entry[1]).name;
if(type==='tier'){
var raw=String(entry[1]).trim();
var tierAliases={
rega:'Reg α',regalpha:'Reg α',alpha:'Reg α',
regd:'Reg Δ',regdelta:'Reg Δ',delta:'Reg Δ',
regi:'Reg ι',regiota:'Reg ι',iota:'Reg ι',
regb:'Reg β',regbeta:'Reg β',beta:'Reg β',
regz:'Reg ζ',regzeta:'Reg ζ',zeta:'Reg ζ',
regg:'Reg γ',reggamma:'Reg γ',gamma:'Reg γ',
regth:'Reg Θ',regtheta:'Reg Θ',theta:'Reg Θ',
rege:'Reg ε',regepsilon:'Reg ε',epsilon:'Reg ε',
regl:'Reg λ',reglambda:'Reg λ',lambda:'Reg λ',
regp:'Reg ψ',regpsi:'Reg ψ',psi:'Reg ψ',
regn:'Reg ν',regnu:'Reg ν',nu:'Reg ν',
regf:'Reg φ',regphi:'Reg φ',phi:'Reg φ'
};
var normalized=toID(raw);
entry[1]=tierAliases[normalized]||raw;
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
illegalLabel=function illegalLabel(id){var _this$typedSearch3,_this$typedSearch4;
if(((_this$typedSearch3=this.typedSearch)==null?void 0:_this$typedSearch3.searchType)==='move'){
var moveSearch=this.typedSearch;
var dex=moveSearch.dex;
var species=moveSearch.species?dex.species.get(moveSearch.species):null;
var infusibleSlots=species&&species.infusibleSlots||0;
if(infusibleSlots&&dex.moves.get(id).flags.infusible)return null;
}
return((_this$typedSearch4=this.typedSearch)==null||(_this$typedSearch4=_this$typedSearch4.illegalReasons)==null?void 0:_this$typedSearch4[id])||null;
};_proto.
getTier=function getTier(species){var _this$typedSearch5;return((_this$typedSearch5=this.typedSearch)==null?void 0:_this$typedSearch5.getTier(species))||'';};_proto.

textSearch=function textSearch(query){var _this$typedSearch6,_this$typedSearch7,_this$typedSearch8,_this$typedSearch9,_this$typedSearch10;
if(this.typedSearch&&!this.typedSearch.baseResults){this.typedSearch.getResults(null,null);}
if((_this$typedSearch6=this.typedSearch)!=null&&_this$typedSearch6.illegalReasons){console.log('[DEBUG] illegalReasons count:',Object.keys(this.typedSearch.illegalReasons).length);}
query=toID(query);
var offsetTable=typeof BattleSearchIndexOffset!=='undefined'&&BattleSearchIndexOffset?BattleSearchIndexOffset:[];
this.exactMatch=false;
var searchType=((_this$typedSearch7=this.typedSearch)==null?void 0:_this$typedSearch7.searchType)||'';


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
var illegal=(_this$typedSearch8=this.typedSearch)==null?void 0:_this$typedSearch8.illegalReasons;

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
if(matchStart){var _BattleSearchIndexOff;
matchEnd=matchStart+query.length;
var offsetRow=((_BattleSearchIndexOff=BattleSearchIndexOffset)==null?void 0:_BattleSearchIndexOff[originalIndex])||'';
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
if(!(id in illegal)){
if(!bufs[0].length){bufs[0]=[['header',DexSearch.typeName[type]]];}
typeIndex=0;
}else{
continue;
}
}else{
if(!bufs[typeIndex].length){bufs[typeIndex]=[['header',DexSearch.typeName[type]]];}
}

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
if(((_this$typedSearch9=this.typedSearch)==null?void 0:_this$typedSearch9.searchType)==='pokemon'&&((_this$typedSearch10=this.typedSearch)==null?void 0:_this$typedSearch10.formatType)==='indigostarstorm'){
var normalizedQuery=toID(query);
var search=this.typedSearch;
var allowed=search.getAllowedISLTiers(this.typedSearch.format);
var matches=[];for(var _i6=0,_BattlePokemonSearch$2=
BattlePokemonSearch.ISL_TIER_ORDER;_i6<_BattlePokemonSearch$2.length;_i6++){var tierName=_BattlePokemonSearch$2[_i6];
if(!allowed.has(tierName))continue;
var normalizedTier=toID(tierName);
if(
normalizedQuery==='tier'||
normalizedQuery==='tiers'||
normalizedTier.startsWith(normalizedQuery))
{matches.push(['tier',tierName,0,Math.min(normalizedQuery.length,tierName.length)]);}
}
if(matches.length){topbuf=[['header','Tiers']].concat(matches,topbuf);}
}
if(instafilter&&count<20){

bufs.push(this.instafilter(searchType,instafilter[0],instafilter[1]));
}
this.results=Array.prototype.concat.apply(topbuf,bufs);
return this.results;
};_proto.
instafilter=function instafilter(searchType,fType,fId){var _this$typedSearch11;
var buf=[];
var illegalBuf=[];
var illegal=(_this$typedSearch11=this.typedSearch)==null?void 0:_this$typedSearch11.illegalReasons;
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
for(var _id in BattlePokedex){
if(!BattlePokedex[_id].abilities)continue;
if(Dex.hasAbility(this.dex.species.get(_id),ability)){(illegal&&_id in illegal?illegalBuf:buf).push(['pokemon',_id]);}
}
break;
case'flag':{
var flagName=BattleFlags&&BattleFlags[fId]&&BattleFlags[fId].name||fId.charAt(0).toUpperCase()+fId.slice(1);
buf.push(['header',flagName+" Pok\xE9mon"]);
for(var _id2 in BattlePokedex){
var species=this.dex.species.get(_id2);
var hasTag=fId==='mega'?species.isMega:(species.tags||[]).some(function(tag){return toID(tag)===fId;});
if(hasTag){(illegal&&_id2 in illegal?illegalBuf:buf).push(['pokemon',_id2]);}
}
break;
}
}
}else if(searchType==='move'){
switch(fType){
case'type':
var _type=fId.charAt(0).toUpperCase()+fId.slice(1);
buf.push(['header',_type+"-type moves"]);
for(var _id3 in BattleMovedex){
var m=BattleMovedex[_id3];
if(m.type===_type||m.type2===_type){(illegal&&_id3 in illegal?illegalBuf:buf).push(['move',_id3]);}
}
break;
case'category':
var category=fId.charAt(0).toUpperCase()+fId.slice(1);
buf.push(['header',category+" moves"]);
for(var _id4 in BattleMovedex){if(BattleMovedex[_id4].category===category){(illegal&&_id4 in illegal?illegalBuf:buf).push(['move',_id4]);}}
break;
case'flag':
var _flagName=BattleFlags&&BattleFlags[fId]?BattleFlags[fId].name:fId.charAt(0).toUpperCase()+fId.slice(1);
buf.push(['header',_flagName+" moves"]);
for(var _id5 in BattleMovedex){
var move=BattleMovedex[_id5];
if(move.flags&&move.flags[fId]){(illegal&&_id5 in illegal?illegalBuf:buf).push(['move',_id5]);}
}
break;
}
}else if(searchType==='item'){
switch(fType){
case'itemclass':
var classId=BattleItemSearch.normalizeItemClass(fId==='berries'?'berry':fId);
var className=BattleItemSearch.itemClassNames[classId]||classId;
buf.push(['header',className+" items"]);
for(var _id6 in BattleItems){
var item=this.dex.items.get(_id6);
var itemClasses=BattleItemSearch.prototype.getItemClass(item);
if(itemClasses.includes(classId)){buf.push(['item',_id6]);}
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
if(BattleSearchIndex[mid][0]===query&&(mid===0||BattleSearchIndex[mid-1][0]!==query)){return mid;}else
if(BattleSearchIndex[mid][0]<query){left=mid+1;}else
{right=mid-1;}
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
if(format.startsWith('predlc')){
if(format.includes('doubles')&&!format.includes('nationaldex')){
this.formatType='predlcdoubles';
this.isDoubles=true;
}else if(format.includes('nationaldex')){this.formatType='predlcnatdex';}else
{this.formatType='predlc';}
format=format.slice(6);
}
var normalizedFormat=toID(format);
if(normalizedFormat.includes('indigostarstorm')||normalizedFormat.includes('isl')){
console.log('[DEBUG] ISL format detected, original format:',format,'normalized:',normalizedFormat);
this.formatType='indigostarstorm';
this.dex=Dex.mod('gen9indigostarstorm');
if(normalizedFormat.startsWith('indigostarstorm')){format=normalizedFormat.slice('indigostarstorm'.length);}else
if(normalizedFormat.startsWith('isl')){format=normalizedFormat.slice('isl'.length);}else
{format=normalizedFormat;}
if(!format)format='ou';
}
if(format.includes('nationaldex')||format.startsWith('nd')||format.includes('natdex')){
format=format.startsWith('nd')?format.slice(2):format.includes('natdex')?format.slice(6):format.slice(11);
this.formatType='natdex';
if(!format)format='ou';
this.isDoubles=format.includes('doubles');
}
if(format.includes('doubles')&&!this.formatType){
this.formatType='doubles';
this.isDoubles=true;
}
this.format=format;
this.species='';
this.set=null;
if(typeof speciesOrSet==='string'){if(speciesOrSet)this.species=speciesOrSet;}else
{
this.set=speciesOrSet;
this.species=toID(this.set.species);
}
}var _proto2=BattleTypedSearch.prototype;_proto2.
getResults=function getResults(filters,sortCol,reverseSort){var _this=this,_illegalResults;
if(sortCol==='type'){return[this.sortRow].concat(BattleTypeSearch.prototype.getDefaultResults.call(this,reverseSort));}else
if(sortCol==='category'){return[this.sortRow].concat(BattleCategorySearch.prototype.getDefaultResults.call(this,reverseSort));}else
if(sortCol==='ability'){return[this.sortRow].concat(BattleAbilitySearch.prototype.getDefaultResults.call(this,reverseSort));}else
if(sortCol==='flag'){return[this.sortRow].concat(BattleFlagSearch.prototype.getDefaultResults.call(this,reverseSort));}
if(!this.baseResults){this.baseResults=this.getBaseResults();}
if(!this.baseIllegalResults){
var legalityFilter={};for(var _i8=0,_this$baseResults2=
this.baseResults;_i8<_this$baseResults2.length;_i8++){var _ref=_this$baseResults2[_i8];var resultType=_ref[0];var value=_ref[1];if(resultType===this.searchType)legalityFilter[value]=1;}
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
results=results.filter(function(_ref2){var rowType=_ref2[0];return rowType===_this.searchType;});
results=this.sort(results,sortCol,reverseSort);
if(illegalResults){
illegalResults=illegalResults.filter(function(_ref3){var rowType=_ref3[0];return rowType===_this.searchType;});
illegalResults=this.sort(illegalResults,sortCol,reverseSort);
}
}
if(this.sortRow){results=[this.sortRow].concat(results);}
if((_illegalResults=illegalResults)!=null&&_illegalResults.length){results=[].concat(results,[['header',"Illegal results"]],illegalResults);}
return results;
};_proto2.
firstLearnsetid=function firstLearnsetid(speciesid){
var table=BattleTeambuilderTable;
if(this.formatType==='indigostarstorm')table=table['gen9indigostarstorm'];
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
console.log('[DEBUG canLearn]',{speciesid:speciesid,moveid:moveid,gen:gen,genChar:genChar,formatType:this.formatType});
var learnsetid=this.firstLearnsetid(speciesid);
console.log('[DEBUG canLearn] firstLearnsetid:',learnsetid);
while(learnsetid){
var table=BattleTeambuilderTable;
if(this.formatType==='indigostarstorm')table=table['gen9indigostarstorm'];
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
this.formatType==='indigostarstorm'?'gen9indigostarstorm':
this.formatType==='svdlc1natdex'?'gen9dlc1natdex':
this.formatType==='natdex'?"gen"+gen+"natdex":"gen"+
gen;
if((_table=table)!=null&&_table[tableKey]){table=table[tableKey];}
if(!table||!table.overrideTier)return pokemon.tier;
var id=pokemon.id;
if(id in table.overrideTier){return table.overrideTier[id];}
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








BattlePokemonSearch=function(_BattleTypedSearch2){function BattlePokemonSearch(){var _this2;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this2=_BattleTypedSearch2.call.apply(_BattleTypedSearch2,[this].concat(args))||this;_this2.
sortRow=['sortpokemon',''];return _this2;}_inheritsLoose(BattlePokemonSearch,_BattleTypedSearch2);var _proto3=BattlePokemonSearch.prototype;_proto3.






















































getAllowedISLTiers=function getAllowedISLTiers(format){
var normalized=toID(format);
var currentTier=BattlePokemonSearch.ISL_FORMAT_ALIASES[normalized];
return new Set(BattlePokemonSearch.ISL_ALLOWED_TIERS[currentTier]||Object.keys(BattlePokemonSearch.ISL_ALLOWED_TIERS));
};_proto3.
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
getBaseResults=function getBaseResults(){var _this$formatType,_this$formatType2,_this$formatType3,_this$formatType4,_this3=this;
var format=this.format;
if(!format)return this.getDefaultResults();
var isVGCOrBS=format.startsWith('battlespot')||format.startsWith('bss')||format.startsWith('battlestadium')||format.startsWith('vgc');
var isDoublesOrBS=isVGCOrBS||((_this$formatType=this.formatType)==null?void 0:_this$formatType.includes('doubles'));
var dex=this.dex;
var table=BattleTeambuilderTable;
if(isVGCOrBS){table=table["gen"+dex.gen+"vgc"];}else
if(
table["gen"+dex.gen+"doubles"]&&
this.formatType!=='ssdlc1doubles'&&this.formatType!=='predlcdoubles'&&
this.formatType!=='svdlc1doubles'&&this.formatType!=='indigostarstorm'&&
!((_this$formatType2=this.formatType)!=null&&_this$formatType2.includes('natdex'))&&(
format.includes('doubles')||format.includes('triples')||
format==='freeforall'||format.startsWith('ffa')||
format==='partnersincrime'))

{
table=table["gen"+dex.gen+"doubles"];
isDoublesOrBS=true;
}else
if(dex.gen<9&&!this.formatType){table=table["gen"+dex.gen];}else
if(this.formatType==='natdex'){table=table["gen"+dex.gen+"natdex"];}else
if((_this$formatType3=this.formatType)!=null&&_this$formatType3.startsWith('predlc')){
if(this.formatType.includes('doubles')){table=table['gen9predlcdoubles'];}else
if(this.formatType.includes('natdex')){table=table['gen9predlcnatdex'];}else
{table=table['gen9predlc'];}
}else if((_this$formatType4=this.formatType)!=null&&_this$formatType4.startsWith('svdlc1')){
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
table.tierSet=(table.tierSet||[]).filter(function(_ref4){var type=_ref4[0],id=_ref4[1];
if(type==='header'||type==='html'||type==='sortpokemon'||type==='sortmove'||type==='sortitem')return true;
var sp=_this3.dex.species.get(id);
if(!sp||!sp.exists)return false;
if(sp.num>=10000||sp.num<0)return true;
var bs=_this3.dex.species.get(sp.baseSpecies||sp.name);
var ns=sp.isNonstandard||bs.isNonstandard;
var tier=_this3.getTier(sp);
if(tier.startsWith('CAP'))return false;
if(id.startsWith('pokestar'))return false;
if(sp.num===0||bs.num===0)return false;
return ns!=='Past';
});
var tierSet=table.tierSet;
var slices=table.formatSlices||{};
if(this.formatType==='indigostarstorm'){var _slices$BattlePokemon;
var allowedTiers=this.getAllowedISLTiers(format);
console.log('[DEBUG] ISL format detected. Format string:',format,'Allowed tiers:',Array.from(allowedTiers),'Available slices:',Object.keys(slices||{}));
if(!slices||slices['Reg α']===undefined){
console.log('[DEBUG] ISL: formatSlices missing Reg α; skipping ISL slicing');
return tierSet;
}
var orderedTiers=BattlePokemonSearch.ISL_TIER_ORDER.filter(function(tier){return allowedTiers.has(tier);});
if(!orderedTiers.length)return tierSet;
var start=slices[orderedTiers[0]];
if(start===undefined)return tierSet;
var nextTierIndex=BattlePokemonSearch.ISL_TIER_ORDER.indexOf(orderedTiers[orderedTiers.length-1])+1;
var end=nextTierIndex<BattlePokemonSearch.ISL_TIER_ORDER.length?(_slices$BattlePokemon=slices[BattlePokemonSearch.ISL_TIER_ORDER[nextTierIndex]])!=null?_slices$BattlePokemon:tierSet.length:tierSet.length;
tierSet=tierSet.slice(start,end);

tierSet=tierSet.filter(function(_ref5){var type=_ref5[0],id=_ref5[1];
if(type==='header')return true;
var sp=_this3.dex.species.get(id);
if(!sp||!sp.exists)return false;
if(sp.num===0)return false;
if(sp.num>=10000||sp.num<0)return true;
if(sp.isNonstandard==='Past')return false;
return true;
});

var allowedTiersFinal=this.getAllowedISLTiers(format);
var reversedTiers=BattlePokemonSearch.ISL_TIER_ORDER.filter(function(t){return allowedTiersFinal.has(t);}).reverse();
var specialSectionsFinal=[
'Restricted Mythical Pokémon',
'Restricted Legendary Pokémon',
'Restricted Paradox Pokémon',
'Mythical Pokémon',
'Legendary Pokémon',
'Paradox Pokémon'];

var finalSectionOrder=[].concat(specialSectionsFinal,reversedTiers);
var bySection=Object.create(null);for(var _i14=0;_i14<
finalSectionOrder.length;_i14++){var s=finalSectionOrder[_i14];bySection[s]=[];}
var seen=new Set();for(var _i16=0,_tierSet2=
tierSet;_i16<_tierSet2.length;_i16++){var row=_tierSet2[_i16];
if(row[0]!=='pokemon')continue;
var id=row[1];
var sp=this.dex.species.get(id);
if(!sp||!sp.exists)continue;
if(sp.gen&&sp.gen>this.dex.gen)continue;
if(seen.has(sp.id))continue;
seen.add(sp.id);
var base=this.dex.species.get(sp.baseSpecies||sp.name);
var tags=(base==null?void 0:base.tags)||[];
var sectionKey=void 0;
if(tags.includes('Restricted Mythical'))sectionKey='Restricted Mythical Pokémon';else
if(tags.includes('Restricted Legendary'))sectionKey='Restricted Legendary Pokémon';else
if(tags.includes('Restricted Paradox'))sectionKey='Restricted Paradox Pokémon';else
if(tags.includes('Mythical'))sectionKey='Mythical Pokémon';else
if(tags.includes('Legendary')||tags.includes('Sub-Legendary'))sectionKey='Legendary Pokémon';else
if(tags.includes('Paradox'))sectionKey='Paradox Pokémon';else
sectionKey=this.getTier(sp);
if(!bySection[sectionKey])bySection[sectionKey]=[];
bySection[sectionKey].push(['pokemon',sp.id]);
}
var _results=[];for(var _i18=0;_i18<
finalSectionOrder.length;_i18++){var section=finalSectionOrder[_i18];
var bucket=bySection[section];
if(!bucket||!bucket.length)continue;
_results.push(['header',section]);for(var _i20=0;_i20<
bucket.length;_i20++){var r=bucket[_i20];_results.push(r);}
}
return _results;
}
if(!(/^(battlestadium|vgc|doublesubers)/g.test(format)||format==='doubles'&&this.formatType==='natdex')){
tierSet=tierSet.filter(function(_ref6){var type=_ref6[0],id=_ref6[1];
if(type==='header'&&id==='DUber by technicality')return false;
if(type==='header'&&id==='Uber by technicality')return false;
return true;
});
}

var results=[];for(var _i22=0,_tierSet4=
tierSet;_i22<_tierSet4.length;_i22++){var _row=_tierSet4[_i22];
var rowType=_row[0];
if(rowType!=='pokemon'){results.push(_row);continue;}
var _id7=_row[1];
var _sp=this.dex.species.get(_id7);
if(!_sp||!_sp.exists)continue;

if(_sp.num===0)continue;

if(_sp.num>=10000||_sp.num<0){results.push(['pokemon',_id7]);continue;}
var bs=this.dex.species.get(_sp.baseSpecies||_sp.name);
var ns=_sp.isNonstandard||bs.isNonstandard;

if(ns==='Past')continue;

if(_sp.gen&&_sp.gen>this.dex.gen)continue;

var tier=this.getTier(_sp);
if(tier==='Illegal'||tier==='Unreleased')continue;
results.push(['pokemon',_id7]);
}
return results;
};_proto3.
filter=function filter(row,filters){
if(!filters)return true;
if(row[0]!=='pokemon')return true;
var species=this.dex.species.get(row[1]);for(var _i24=0;_i24<
filters.length;_i24++){var _ref7=filters[_i24];var filterType=_ref7[0];var value=_ref7[1];
switch(filterType){
case'type':if(species.types[0]!==value&&species.types[1]!==value)return false;
break;
case'egggroup':if(species.eggGroups[0]!==value&&species.eggGroups[1]!==value)return false;
break;
case'tier':
var speciesTier=this.getTier(species);
if(this.formatType==='indigostarstorm'){
var inclusiveTiers=BattlePokemonSearch.ISL_ALLOWED_TIERS;
var allowed=inclusiveTiers[value];
if(!allowed||!allowed.includes(speciesTier))return false;
}else{if(speciesTier!==value)return false;}
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
sort=function sort(results,sortCol,reverseSort){var _this4=this;
var sortOrder=reverseSort?-1:1;
if(sortCol==='tier'){
var tierOrder=['Reg α','Reg Δ','Reg ι','Reg β','Reg ζ','Reg γ','Reg Θ','Reg ε','Reg λ','Reg ψ','Reg ν','Reg φ'];
var categoryOrder=[
'Restricted Legendary',
'Restricted Mythical',
'Restricted Paradox',
'Legendary',
'Mythical',
'Paradox'];

var getCategoryPriority=function(species){
var base=_this4.dex.species.get(species.baseSpecies||species.name);
var tags=base.tags||[];
for(var i=0;i<categoryOrder.length;i++){
if(tags.includes(categoryOrder[i]))return i;
}
return categoryOrder.length;
};
return results.sort(function(_ref8,_ref9){var rowType1=_ref8[0],id1=_ref8[1];var rowType2=_ref9[0],id2=_ref9[1];
var species1=_this4.dex.species.get(id1);
var species2=_this4.dex.species.get(id2);
var cat1=getCategoryPriority(species1);
var cat2=getCategoryPriority(species2);
if(cat1!==cat2){return(cat1-cat2)*sortOrder;}
var tier1=_this4.getTier(species1);
var tier2=_this4.getTier(species2);
var index1=tierOrder.indexOf(tier1);
var index2=tierOrder.indexOf(tier2);
if(index1!==-1&&index2!==-1&&index1!==index2){return(index1-index2)*sortOrder;}
if(tier1!==tier2){return(tier1<tier2?-1:1)*sortOrder;}
if(species1.num!==species2.num){return(species1.num-species2.num)*sortOrder;}
return(species1.name<species2.name?-1:species1.name>species2.name?1:0)*sortOrder;
});
}else if(['hp','atk','def','spa','spd','spe'].includes(sortCol)){
return results.sort(function(_ref10,_ref11){var rowType1=_ref10[0],id1=_ref10[1];var rowType2=_ref11[0],id2=_ref11[1];
var stat1=_this4.dex.species.get(id1).baseStats[sortCol];
var stat2=_this4.dex.species.get(id2).baseStats[sortCol];
return(stat2-stat1)*sortOrder;
});
}else if(sortCol==='bst'){
return results.sort(function(_ref12,_ref13){var rowType1=_ref12[0],id1=_ref12[1];var rowType2=_ref13[0],id2=_ref13[1];
var base1=_this4.dex.species.get(id1).baseStats;
var base2=_this4.dex.species.get(id2).baseStats;
var bst1=base1.hp+base1.atk+base1.def+base1.spa+base1.spd+base1.spe;
var bst2=base2.hp+base2.atk+base2.def+base2.spa+base2.spd+base2.spe;
return(bst2-bst1)*sortOrder;
});
}else if(sortCol==='name'){
return results.sort(function(_ref14,_ref15){var rowType1=_ref14[0],id1=_ref14[1];var rowType2=_ref15[0],id2=_ref15[1];
var name1=id1;
var name2=id2;
return(name1<name2?-1:name1>name2?1:0)*sortOrder;
});
}
throw new Error("invalid sortcol");
};return BattlePokemonSearch;}(BattleTypedSearch);BattlePokemonSearch.ISL_TIER_ORDER=['Reg α','Reg Δ','Reg ι','Reg β','Reg ζ','Reg γ','Reg Θ','Reg ε','Reg λ','Reg ψ','Reg ν','Reg φ'];BattlePokemonSearch.ISL_FORMAT_ALIASES={rega:'Reg α',regalpha:'Reg α',alpha:'Reg α',regd:'Reg Δ',regdelta:'Reg Δ',delta:'Reg Δ',regi:'Reg ι',regiota:'Reg ι',iota:'Reg ι',regb:'Reg β',regbeta:'Reg β',beta:'Reg β',regz:'Reg ζ',regzeta:'Reg ζ',zeta:'Reg ζ',regg:'Reg γ',reggamma:'Reg γ',gamma:'Reg γ',regth:'Reg Θ',regtheta:'Reg Θ',theta:'Reg Θ',rege:'Reg ε',regepsilon:'Reg ε',epsilon:'Reg ε',regl:'Reg λ',reglambda:'Reg λ',lambda:'Reg λ',regp:'Reg ψ',regpsi:'Reg ψ',psi:'Reg ψ',regn:'Reg ν',regnu:'Reg ν',nu:'Reg ν',regf:'Reg φ',regphi:'Reg φ',phi:'Reg φ',babyleague:'Reg α',nfeleague:'Reg Δ',singlestageonly:'Reg ι','2ndstageleague':'Reg β',betaparadox:'Reg ζ','3rdstageleague':'Reg γ',norestricted:'Reg Θ',norestrictedspecial:'Reg Θ',restrictedparadox:'Reg ε',onerestricted:'Reg ψ','onerestrictedmythical':'Reg ν',tworestricted:'Reg ν','tworestrictedmythical':'Reg φ',regulationsetalpha:'Reg α',regulationsetdelta:'Reg Δ',regulationsetiota:'Reg ι',regulationsetbeta:'Reg β',regulationsetzeta:'Reg ζ',regulationsetgamma:'Reg γ',regulationsettheta:'Reg Θ',regulationsetepsilon:'Reg ε',regulationsetlambda:'Reg λ',regulationsetpsi:'Reg ψ',regulationsetnu:'Reg ν',regulationsetphi:'Reg φ'};BattlePokemonSearch.ISL_ALLOWED_TIERS={'Reg α':['Reg α'],'Reg Δ':['Reg α','Reg Δ'],'Reg ι':['Reg ι'],'Reg β':['Reg α','Reg Δ','Reg ι','Reg β'],'Reg ζ':['Reg α','Reg Δ','Reg ι','Reg β','Reg ζ'],'Reg γ':['Reg α','Reg Δ','Reg ι','Reg β','Reg ζ','Reg γ'],'Reg Θ':['Reg α','Reg Δ','Reg ι','Reg β','Reg ζ','Reg γ','Reg Θ'],'Reg ε':['Reg α','Reg Δ','Reg ι','Reg β','Reg ζ','Reg γ','Reg Θ','Reg ε'],'Reg λ':['Reg α','Reg Δ','Reg ι','Reg β','Reg ζ','Reg γ','Reg Θ','Reg ε','Reg λ'],'Reg ψ':['Reg α','Reg Δ','Reg ι','Reg β','Reg ζ','Reg γ','Reg Θ','Reg ε','Reg λ','Reg ψ'],'Reg ν':['Reg α','Reg Δ','Reg ι','Reg β','Reg ζ','Reg γ','Reg Θ','Reg ε','Reg λ','Reg ψ','Reg ν'],'Reg φ':['Reg α','Reg Δ','Reg ι','Reg β','Reg ζ','Reg γ','Reg Θ','Reg ε','Reg λ','Reg ψ','Reg ν','Reg φ']};var


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
return abilitySet;
};_proto4.
filter=function filter(row,filters){
if(!filters)return true;
if(row[0]!=='ability')return true;
var ability=this.dex.abilities.get(row[1]);for(var _i26=0;_i26<
filters.length;_i26++){var _ref16=filters[_i26];var filterType=_ref16[0];var value=_ref16[1];switch(filterType){
case'pokemon':if(!Dex.hasAbility(this.dex.species.get(value),ability.name))return false;
break;
}
}
return true;
};_proto4.
sort=function sort(results,sortCol,reverseSort){throw new Error("invalid sortcol");};return BattleAbilitySearch;}(BattleTypedSearch);var


BattleItemSearch=function(_BattleTypedSearch4){function BattleItemSearch(){var _this5;for(var _len2=arguments.length,args=new Array(_len2),_key2=0;_key2<_len2;_key2++){args[_key2]=arguments[_key2];}_this5=_BattleTypedSearch4.call.apply(_BattleTypedSearch4,[this].concat(args))||this;_this5.

sortRow=['sortitem',''];return _this5;}_inheritsLoose(BattleItemSearch,_BattleTypedSearch4);var _proto5=BattleItemSearch.prototype;_proto5.getTable=function getTable(){return BattleItems;};_proto5.
getDefaultResults=function getDefaultResults(){var _this$formatType5,_this$formatType6,_this$dex,_this$dex2,_this6=this;
var table=BattleTeambuilderTable;
if((_this$formatType5=this.formatType)!=null&&_this$formatType5.startsWith('bdsp')){table=table['gen8bdsp'];}else
if(this.formatType==='bw1'){table=table['gen5bw1'];}else
if(this.formatType==='rs'){table=table['gen3rs'];}else
if(this.formatType==='indigostarstorm'){table=table['gen9indigostarstorm'];}else
if(this.formatType==='natdex'){table=table["gen"+this.dex.gen+"natdex"];}else
if((_this$formatType6=this.formatType)!=null&&_this$formatType6.endsWith('doubles')){table=table["gen"+this.dex.gen+"doubles"];}else
if(this.formatType==='metronome'){table=table["gen"+this.dex.gen+"metronome"];}else
if(this.dex.gen<9){table=table["gen"+this.dex.gen];}else
{table=table['gen9']||table;}
if(!table||!table.items&&!table.itemSet)return[];
if(!table.itemSet){
table.itemSet=table.items.map(function(r){
if(typeof r==='string')return['item',r];
return[r[0],r[1]];
});
table.items=null;
}

var isSpeciesSpecificLegacyItem=function(item){
var forcedForme=item.forcedForme||'';
return!!(item.onMemory||/^Silvally-/.test(forcedForme)||item.onDrive||/^Genesect-/.test(forcedForme));
};
var isPastItem=function(item){return item.isNonstandard==='Past';};
var isExcludedItem=function(item){
if(!(item!=null&&item.exists))return true;
var id=item.id||'';
var name=item.name||'';
if(isPastItem(item))return true;
if(isSpeciesSpecificLegacyItem(item))return true;
if(item.isGem||id.endsWith('gem')||/\bGem\b/i.test(name))return true;
if(id.endsWith('fossil')||id.startsWith('fossilized')||/\bFossil\b/i.test(name)||/\bFossilized\b/i.test(name))return true;
if(id.endsWith('incense')||/\bIncense\b/i.test(name))return true;
return false;
};
var isISL=
this.formatType==='indigostarstorm'||
((_this$dex=this.dex)==null?void 0:_this$dex.modid)==='gen9indigostarstorm'||
(this.format||'').includes('isl')||
(this.format||'').includes('indigostarstorm');
console.log('[ITEM SEARCH BRANCH]',{
format:this.format,
formatType:this.formatType,
dexModid:(_this$dex2=this.dex)==null?void 0:_this$dex2.modid,
isISL:isISL
});
if(!isISL){
var baseResults=table.itemSet;
var _results2=[];
var inUselessSection=false;for(var _i28=0;_i28<
baseResults.length;_i28++){var row=baseResults[_i28];
if(row[0]==='header'){
inUselessSection=row[1]==='Useless items';
if(inUselessSection)continue;
_results2.push(row);
continue;
}
if(inUselessSection)continue;
if(row[0]!=='item'){
_results2.push(row);
continue;
}
var item=this.dex.items.get(row[1]);
if(isExcludedItem(item))continue;
_results2.push(row);
}
var typeboostRows=[];
var speciesSpecificRows=[];
var megaStoneRows=[];
var sweetRows=[];
var pokeballRows=[];
var flingRows=[];
var nouseRows=[];
for(var id in BattleItems){
var _item=this.dex.items.get(id);
if(isExcludedItem(_item))continue;
var _row2=['item',_item.id];
var itemClasses=this.getItemClass(_item);
if(itemClasses.includes('typeboost'))typeboostRows.push(_row2);else
if(itemClasses.includes('megastone'))megaStoneRows.push(_row2);else
if(itemClasses.includes('species'))speciesSpecificRows.push(_row2);else
if(itemClasses.includes('sweets'))sweetRows.push(_row2);else
if(itemClasses.includes('pokeball'))pokeballRows.push(_row2);
}
typeboostRows.sort(function(a,b){return _this6.dex.items.get(a[1]).name.localeCompare(_this6.dex.items.get(b[1]).name);});
speciesSpecificRows.sort(function(a,b){return _this6.dex.items.get(a[1]).name.localeCompare(_this6.dex.items.get(b[1]).name);});
megaStoneRows.sort(function(a,b){return _this6.dex.items.get(a[1]).name.localeCompare(_this6.dex.items.get(b[1]).name);});
sweetRows.sort(function(a,b){return _this6.dex.items.get(a[1]).name.localeCompare(_this6.dex.items.get(b[1]).name);});
pokeballRows.sort(function(a,b){return _this6.dex.items.get(a[1]).name.localeCompare(_this6.dex.items.get(b[1]).name);});
if(typeboostRows.length){
_results2.push(['header','Type Boost']);for(var _i30=0;_i30<
typeboostRows.length;_i30++){var _row3=typeboostRows[_i30];_results2.push(_row3);}
}
if(speciesSpecificRows.length){
_results2.push(['header','Pokémon-specific Items']);for(var _i32=0;_i32<
speciesSpecificRows.length;_i32++){var _row4=speciesSpecificRows[_i32];_results2.push(_row4);}
}
if(megaStoneRows.length){
_results2.push(['header','Mega Stones']);for(var _i34=0;_i34<
megaStoneRows.length;_i34++){var _row5=megaStoneRows[_i34];_results2.push(_row5);}
}
if(sweetRows.length){
_results2.push(['header','Alcremie Sweets']);for(var _i36=0;_i36<
sweetRows.length;_i36++){var _row6=sweetRows[_i36];_results2.push(_row6);}
}
if(pokeballRows.length){
_results2.push(['header','Poké Balls']);for(var _i38=0;_i38<
pokeballRows.length;_i38++){var _row7=pokeballRows[_i38];_results2.push(_row7);}
}
if(nouseRows.length){
_results2.push(['header','No Battle Effect']);for(var _i40=0;_i40<
nouseRows.length;_i40++){var _row8=nouseRows[_i40];_results2.push(_row8);}
}
if(flingRows.length){
_results2.push(['header','Fling Only']);for(var _i42=0;_i42<
flingRows.length;_i42++){var _row9=flingRows[_i42];_results2.push(_row9);}
}
return _results2;
}


var legalItems=[];
var seen=new Set();for(var _i44=0,_table$itemSet2=
table.itemSet;_i44<_table$itemSet2.length;_i44++){var _row10=_table$itemSet2[_i44];
if(_row10[0]!=='item')continue;
var _item2=this.dex.items.get(_row10[1]);
if(!(_item2!=null&&_item2.exists))continue;
if(seen.has(_item2.id))continue;
if(isExcludedItem(_item2))continue;
seen.add(_item2.id);
legalItems.push(_item2);
}
legalItems.sort(function(a,b){return a.name.localeCompare(b.name);});


var buckets=[
{label:'Stat Boost',tags:['statboost','!species','!evostones','!typeboost','!weather','!terrain','!fling','!pokeball','!nouse']},
{label:'Resist Berries',tags:['resist','!species','!evostones','!typeboost','!weather','!terrain','!fling','!pokeball','!nouse']},
{label:'Healing',tags:['healing','!species','!evostones','!typeboost','!weather','!terrain','!fling','!pokeball','!nouse']},
{label:'Status Cure',tags:['statuscure','!species','!evostones','!typeboost','!weather','!terrain','!fling','!pokeball','!nouse']},
{label:'Utility',tags:['utility','!species','!evostones','!typeboost','!weather','!terrain','!fling','!pokeball','!nouse']},
{label:'Weather/Terrain',tags:['weather','terrain','!species','!evostones','!typeboost','!fling','!pokeball','!nouse']},
{label:'Evolution Stones',tags:['evostones','!typeboost','!species','!fling','!pokeball','!nouse']},
{label:'Type Boost',tags:['typeboost','!species','!fling','!pokeball','!nouse']},
{label:'Uncategorized items',tags:['!species','!fling','!pokeball','!nouse']},
{label:'Signature Items',tags:['species','!megastone','!fling','!pokeball','!nouse']},
{label:'Mega Stones',tags:['megastone','!fling','!pokeball','!nouse']},
{label:'Z-Crystals',tags:['zcrystals','!fling','!pokeball','!nouse']},
{label:'TM/TR/HM',tags:['!fling','!nouse']},
{label:'Fling Only',tags:['fling','!nouse']},
{label:'Evolution Items without an effect',tags:['evolution','tradeevo','!nouse']},
{label:'Poké Balls',tags:['pokeball','!nouse']},
{label:'Literally No Battle Effect',tags:['nouse']}];

var isTechnicalMachineItem=function(item){
var id=item.id||'';
var name=item.name||'';
return /^(tm|tr|hm)\d+$/.test(id)||/^(TM|TR|HM)\d+/i.test(name);
};
var used=new Set();
var results=[];
var unsortedRows=[];
for(var i=0;i<legalItems.length;i++){
var _item3=legalItems[i];
var itemTags=this.getItemClass(_item3);
var matched=false;
if(isTechnicalMachineItem(_item3)){
var tmBucket=buckets.find(function(bucket){return bucket.label==='TM/TR/HM';});
if(tmBucket){
if(!tmBucket.rows)tmBucket.rows=[];
tmBucket.rows.push(['item',_item3.id]);
used.add(_item3.id);
matched=true;
}
}
if(!matched){
for(var j=0;j<buckets.length;j++){
var bucket=buckets[j];
if(!bucket.tags.length)continue;
var denied=false;
var allowed=bucket.tags.length===0;for(var _i46=0,_bucket$tags2=

bucket.tags;_i46<_bucket$tags2.length;_i46++){var tag=_bucket$tags2[_i46];
if(tag.startsWith('!')){
if(itemTags.includes(tag.slice(1))){
denied=true;
break;
}
}else{
if(itemTags.includes(tag)){
allowed=true;
}
}
}

if(denied||!allowed)continue;

if(!bucket.rows)bucket.rows=[];
bucket.rows.push(['item',_item3.id]);
used.add(_item3.id);
matched=true;
break;
}
}
if(!matched)unsortedRows.push(['item',_item3.id]);
}
for(var _i47=0;_i47<buckets.length;_i47++){
var _bucket=buckets[_i47];
var rows=[];
if(_bucket.label==='Uncategorized items'){rows=unsortedRows;}else
{rows=_bucket.rows||[];}
rows.sort(function(a,b){return _this6.dex.items.get(a[1]).name.localeCompare(_this6.dex.items.get(b[1]).name);});
if(rows.length){
results.push(['header',_bucket.label]);
results.push.apply(results,rows);
}
}
return results;
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



}[toID((_this$set=this.set)==null?void 0:_this$set.ability)];for(var _i49=0;_i49<
results.length;_i49++){var _item$itemUser;var row=results[_i49];
if(row[0]!=='item')continue;
var item=this.dex.items.get(row[1]);
if((_item$itemUser=item.itemUser)!=null&&_item$itemUser.includes(speciesName))speciesSpecific.push(row);
if(abilityItem===item.id)abilitySpecific.push(row);
}
if(speciesSpecific.length){
return[
['header',speciesName+'-only']].concat(
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
};BattleItemSearch.

























normalizeItemClass=function normalizeItemClass(tag){
var id=toID(tag||'');
var aliases={
tradeevolution:'tradeevo',
tradeevo:'tradeevo',
pokeball:'pokeball',
pokeballs:'pokeball',
speciesspecific:'species',
typeplate:'typeboost',
typeboost:'typeboost',
type:'typeboost',
plate:'typeboost',
zcrystal:'zcrystals',
zcrystals:'zcrystals',
evostone:'evostones',
evostones:'evostones',
megastone:'megastone',
statboost:'statboost',
statuscure:'statuscure',
sweets:'sweets',
sweet:'sweets',
alcremiesweet:'sweets',
alcremiesweets:'sweets',
fling:'fling',
flingonly:'fling',
nouse:'nouse',
noeffect:'nouse',
useless:'nouse',
nada:'nouse'
};
return aliases[id]||id;
};_proto5.
getItemClass=function getItemClass(item){
var raw=item==null?void 0:item.itemClass;
var classIds=[];
if(Array.isArray(raw)){
classIds=raw.
map(function(x){return BattleItemSearch.normalizeItemClass(x);}).
filter(function(classId,i,arr){return(
!!BattleItemSearch.itemClassNames[classId]&&arr.indexOf(classId)===i);}
).
slice(0,6);
}else if(typeof raw==='string'&&raw){
var classId=BattleItemSearch.normalizeItemClass(raw);
if(BattleItemSearch.itemClassNames[classId])classIds=[classId];
}
return classIds;
};_proto5.
defaultFilter=function defaultFilter(results){
if(this.species&&!this.dex.species.get(this.species).nfe){
results.splice(results.findIndex(function(row){return row[1]==='eviolite';}),1);
return results;
}
return results;
};_proto5.
filter=function filter(row,filters){
if(row[0]!=='item')return true;
var item=this.dex.items.get(row[1]);for(var _i51=0;_i51<
filters.length;_i51++){var _ref17=filters[_i51];var filterType=_ref17[0];var value=_ref17[1];
if(filterType==='itemclass'){
var v=BattleItemSearch.normalizeItemClass(value==='berries'?'berry':value);
var itemClasses=this.getItemClass(item);
if(!itemClasses.includes(v))return false;
}
}
return true;
};_proto5.
sort=function sort(results,sortCol,reverseSort){throw new Error("invalid sortcol");};return BattleItemSearch;}(BattleTypedSearch);BattleItemSearch.itemClassNames={fragile:'Fragile',"volatile":'Volatile',berry:'Berry',consumable:'Consumable',evolution:'Evolution',tradeevo:'Trade Evo',pokeball:'Poké Ball',healing:'Healing',statboost:'Stat Boost',statuscure:'Status Cure',resist:'Resist',reactive:'Reactive',utility:'Utility',species:'Species-specific',megastone:'Mega Stone',typeboost:'Type Boost',sweets:'Sweets',zcrystals:'Z-Crystals',evostones:'Evo Stones',weather:'Weather',terrain:'Terrain',fling:'Fling Only',nouse:'No Use'};var


BattleMoveSearch=function(_BattleTypedSearch5){function BattleMoveSearch(){var _this7;for(var _len3=arguments.length,args=new Array(_len3),_key3=0;_key3<_len3;_key3++){args[_key3]=arguments[_key3];}_this7=_BattleTypedSearch5.call.apply(_BattleTypedSearch5,[this].concat(args))||this;_this7.
sortRow=['sortmove',''];return _this7;}_inheritsLoose(BattleMoveSearch,_BattleTypedSearch5);var _proto6=BattleMoveSearch.prototype;_proto6.
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
if(!table)return weights;for(var _i53=0;_i53<
types.length;_i53++){var typeName=types[_i53];
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
for(var flag in move.flags||{}){score+=flagWeights[flag]||0;}
return score;
};_proto6.




getBaseResults=function getBaseResults(){var _this$formatType7,_this$formatType8,_lsetTable;
if(!this.species)return this.getDefaultResults();
var dex=this.dex;
var species=dex.species.get(this.species);
var format=this.format;
var regionBornLegality=dex.gen>=6&&(/^battle(spot|stadium|festival)/.test(format)||format.startsWith('bss')||format.startsWith('vgc')||dex.gen===9&&this.formatType!=='natdex');
var learnsetid=this.firstLearnsetid(species.id);
var moves=[];
var sketchMoves=[];
var sketch=false;
var gen=""+dex.gen;
var lsetTable=BattleTeambuilderTable;
if((_this$formatType7=this.formatType)!=null&&_this$formatType7.startsWith('predlc'))lsetTable=lsetTable['gen9predlc'];
if((_this$formatType8=this.formatType)!=null&&_this$formatType8.startsWith('svdlc1'))lsetTable=lsetTable['gen9dlc1'];
if(this.formatType==='indigostarstorm')lsetTable=lsetTable['gen9indigostarstorm']||lsetTable;
console.log('[DEBUG getMovesList] formatType:',this.formatType,'has learnsets?',!!((_lsetTable=lsetTable)!=null&&_lsetTable.learnsets));
while(learnsetid){
var learnset=lsetTable.learnsets[learnsetid];
console.log('[DEBUG getMovesList] learnsetid:',learnsetid,'has learnset?',!!learnset,'move count:',learnset?Object.keys(learnset).length:0);
if(learnset){
for(var moveid in learnset){var _this$formatType9,_BattleTeambuilderTab,_this$formatType10,_BattleTeambuilderTab2,_this$formatType11,_BattleTeambuilderTab3;
var learnsetEntry=learnset[moveid];
var move=dex.moves.get(moveid);
var minGenCode={6:'p',7:'q',8:'g',9:'a'};
if(regionBornLegality&&!learnsetEntry.includes(minGenCode[dex.gen])){continue;}
if(this.eggMovesOnly(learnsetid,species.id)&&(!learnsetEntry.includes('e')||dex.gen!==9)){continue;}
if(this.formatType!=='natdex'&&move.isNonstandard==="Past"){continue;}
if((_this$formatType9=this.formatType)!=null&&_this$formatType9.startsWith('dlc1')&&(_BattleTeambuilderTab=BattleTeambuilderTable['gen8dlc1'])!=null&&_BattleTeambuilderTab.nonstandardMoves.includes(moveid)){continue;}
if((_this$formatType10=this.formatType)!=null&&_this$formatType10.includes('predlc')&&this.formatType!=='predlcnatdex'&&(_BattleTeambuilderTab2=BattleTeambuilderTable['gen9predlc'])!=null&&_BattleTeambuilderTab2.nonstandardMoves.includes(moveid)){continue;}
if((_this$formatType11=this.formatType)!=null&&_this$formatType11.includes('svdlc1')&&this.formatType!=='svdlc1natdex'&&(_BattleTeambuilderTab3=BattleTeambuilderTable['gen9dlc1'])!=null&&_BattleTeambuilderTab3.nonstandardMoves.includes(moveid)){continue;}
if(moves.includes(moveid))continue;
moves.push(moveid);
if(moveid==='sketch')sketch=true;
if(moveid==='hiddenpower'){moves.push('hiddenpowerbug','hiddenpowerdark','hiddenpowerdragon','hiddenpowerelectric','hiddenpowerfighting','hiddenpowerfire','hiddenpowerflying','hiddenpowerghost','hiddenpowergrass','hiddenpowerground','hiddenpowerice','hiddenpowerpoison','hiddenpowerpsychic','hiddenpowerrock','hiddenpowersteel','hiddenpowerwater');}
}
}
learnsetid=this.nextLearnsetid(learnsetid,species.id,true);
}
if(this.formatType==='metronome')moves=['metronome'];
moves.sort();
sketchMoves.sort();
var flagWeights=this.getFlagWeightsForTypes(species.types);

var affinity=[];
var neutral=[];
var aversion=[];
var allMoveIds=[].concat(
moves.map(function(x){return x;}),
sketchMoves.map(function(x){return x;}));for(var _i55=0;_i55<

allMoveIds.length;_i55++){var id=allMoveIds[_i55];
var _move=dex.moves.get(id);
var score=this.getMoveAffinityScore(_move,flagWeights);
var entry={id:id,score:score};
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
var move=this.dex.moves.get(row[1]);for(var _i57=0;_i57<
filters.length;_i57++){var _ref18=filters[_i57];var filterType=_ref18[0];var value=_ref18[1];
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
sort=function sort(results,sortCol,reverseSort){var _this8=this;
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
return results.sort(function(_ref19,_ref20){var rowType1=_ref19[0],id1=_ref19[1];var rowType2=_ref20[0],id2=_ref20[1];
var move1=_this8.dex.moves.get(id1);
var move2=_this8.dex.moves.get(id2);
var pow1=move1.basePower||powerTable[id1]||(move1.category==='Status'?-1:1400);
var pow2=move2.basePower||powerTable[id2]||(move2.category==='Status'?-1:1400);
return(pow2-pow1)*sortOrder;
});
case'accuracy':
return results.sort(function(_ref21,_ref22){var rowType1=_ref21[0],id1=_ref21[1];var rowType2=_ref22[0],id2=_ref22[1];
var accuracy1=_this8.dex.moves.get(id1).accuracy||0;
var accuracy2=_this8.dex.moves.get(id2).accuracy||0;
if(accuracy1===true)accuracy1=101;
if(accuracy2===true)accuracy2=101;
return(accuracy2-accuracy1)*sortOrder;
});
case'crit':
return results.sort(function(_ref23,_ref24){var _m1$critRatio,_m2$critRatio;var rowType1=_ref23[0],id1=_ref23[1];var rowType2=_ref24[0],id2=_ref24[1];
var m1=_this8.dex.moves.get(id1);
var m2=_this8.dex.moves.get(id2);

var c1=(_m1$critRatio=m1.critRatio)!=null?_m1$critRatio:4;
var c2=(_m2$critRatio=m2.critRatio)!=null?_m2$critRatio:4;
if(c2!==c1)return(c2-c1)*sortOrder;
return(id1<id2?-1:id1>id2?1:0)*sortOrder;
});
case'pp':
return results.sort(function(_ref25,_ref26){var rowType1=_ref25[0],id1=_ref25[1];var rowType2=_ref26[0],id2=_ref26[1];
var pp1=_this8.dex.moves.get(id1).pp||0;
var pp2=_this8.dex.moves.get(id2).pp||0;
return(pp2-pp1)*sortOrder;
});
case'flags:':
return results.sort(function(_ref27,_ref28){var rowType1=_ref27[0],id1=_ref27[1];var rowType2=_ref28[0],id2=_ref28[1];
var f1=Object.keys(_this8.dex.moves.get(id1).flags||{}).sort().join(',');
var f2=Object.keys(_this8.dex.moves.get(id2).flags||{}).sort().join(',');
if(f1!==f2)return(f1<f2?-1:1)*sortOrder;
return(id1<id2?-1:id1>id2?1:0)*sortOrder;
});
case'name':
return results.sort(function(_ref29,_ref30){var rowType1=_ref29[0],id1=_ref29[1];var rowType2=_ref30[0],id2=_ref30[1];
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






getTable=function getTable(){return BattleFlags;};_proto8.
getDefaultResults=function getDefaultResults(reverseSort){
var seen={};
var results=[];for(var _i59=0,_this$dex$moves$all2=
this.dex.moves.all();_i59<_this$dex$moves$all2.length;_i59++){var move=_this$dex$moves$all2[_i59];
if(!move.flags)continue;
for(var flagId in move.flags){
if(!move.flags[flagId])continue;
if(BattleFlagSearch.HIDDEN_FLAGS.has(flagId))continue;
if(seen[flagId])continue;
seen[flagId]=1;
results.push(['flag',flagId]);
}
}
results.sort(function(a,b){return a[1].localeCompare(b[1]);});
if(reverseSort)results.reverse();
return results;
};_proto8.
getBaseResults=function getBaseResults(){return this.getDefaultResults();};_proto8.
filter=function filter(row,filters){throw new Error("invalid filter");};_proto8.
sort=function sort(results,sortCol,reverseSort){throw new Error("invalid sortcol");};return BattleFlagSearch;}(BattleTypedSearch);BattleFlagSearch.HIDDEN_FLAGS=new Set(['allyanim','bypasssub','cantusetwice','charge','defrost','distance','failcopycat','failencore','failinstruct','failmefirst','failmimic','futuremove','gravity','infusible','metronome','mirror','mustpressure','noassist','noparentalbond','nonsky','nosketch','nosleeptalk','pledgecombo','protect','recharge','reflectable','snatch']);var


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