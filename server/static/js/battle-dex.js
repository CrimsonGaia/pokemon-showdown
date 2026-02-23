"use strict";var _process$versions;/**
 * Pokemon Showdown Dex
 * Roughly equivalent to sim/dex.js in a Pokemon Showdown server, but
 * designed for use in browsers rather than in Node.
 * This is a generic utility library for Pokemon Showdown code: any
 * code shared between the replay viewer and the client usually ends up here.
 * Licensing note: PS's client has complicated licensing:
 * - The client as a whole is AGPLv3
 * - The battle replay/animation engine (battle-*.ts) by itself is MIT
 * Compiled into battledata.js which includes all dependencies
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */





































var ISL_ALLOWED_CACHE=new WeakMap();




if(typeof window==='undefined'){global.window=global;}else
{window.exports=window;}
window.nodewebkit=!!(typeof process!=='undefined'&&(_process$versions=process.versions)!=null&&_process$versions['node-webkit']);
function toID(text){var _text,_text2;
if((_text=text)!=null&&_text.id){text=text.id;}else
if((_text2=text)!=null&&_text2.userid){text=text.userid;}
if(typeof text!=='string'&&typeof text!=='number')return'';
return(""+text).toLowerCase().replace(/[^a-z0-9]+/g,'');
}
function toUserid(text){return toID(text);}

var PSUtils=new(function(){function _class(){}var _proto=_class.prototype;_proto.







splitFirst=function splitFirst(str,delimiter){var limit=arguments.length>2&&arguments[2]!==undefined?arguments[2]:1;
var splitStr=[];
while(splitStr.length<limit){
var delimiterIndex=str.indexOf(delimiter);
if(delimiterIndex>=0){
splitStr.push(str.slice(0,delimiterIndex));
str=str.slice(delimiterIndex+delimiter.length);
}else{
splitStr.push(str);
str='';
}
}
splitStr.push(str);
return splitStr;
};_proto.









compare=function compare(a,b){
if(typeof a==='number'){return a-b;}
if(typeof a==='string'){return a.localeCompare(b);}
if(typeof a==='boolean'){return(a?1:2)-(b?1:2);}
if(Array.isArray(a)){
for(var i=0;i<a.length;i++){
var comparison=PSUtils.compare(a[i],b[i]);
if(comparison)return comparison;
}
return 0;
}
if(a.reverse){return PSUtils.compare(b.reverse,a.reverse);}
throw new Error("Passed value "+a+" is not comparable");
};_proto.








sortBy=function sortBy(array,callback){
if(!callback)return array.sort(PSUtils.compare);
return array.sort(function(a,b){return PSUtils.compare(callback(a),callback(b));});
};return _class;}())(
);

function toRoomid(roomid){return roomid.replace(/[^a-zA-Z0-9-]+/g,'').toLowerCase();}
function toName(name){
if(typeof name!=='string'&&typeof name!=='number')return'';
name=(""+name).replace(/[|\s[\],\u202e]+/g,' ').trim();
if(name.length>18)name=name.substr(0,18).trim();

name=name.replace(
/[\u0300-\u036f\u0483-\u0489\u0610-\u0615\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06ED\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]{3,}/g,
''
);
name=name.replace(/[\u239b-\u23b9]/g,'');
return name;
}




















var Dex=new(function(){function _class2(){var _this=this;this.
Ability=Ability;this.
Item=Item;this.
Move=Move;this.
Flags=Flag;this.
Species=Species;this.
gen=9;this.
modid='gen9';this.
cache=null;this.
REGULAR=0;this.
WEAK=1;this.
RESIST=2;this.
IMMUNE=3;this.
statNames=['hp','atk','def','spa','spd','spe'];this.
statNamesExceptHP=['atk','def','spa','spd','spe'];this.
pokeballs=null;this.
resourcePrefix=function(_window$document){
var prefix='';
if(((_window$document=window.document)==null||(_window$document=_window$document.location)==null?void 0:_window$document.protocol)!=='http:')prefix='https:';
return prefix+"//"+(window.Config?Config.routes.client:'play.pokemonshowdown.com')+"/";
}();this.
indigostarstormPrefix=function(_window$document2){
var iprefix='';
if(((_window$document2=window.document)==null||(_window$document2=_window$document2.location)==null?void 0:_window$document2.protocol)!=='http:')iprefix='https:';
return iprefix+"//"+(window.Config?Config.routes.client:'https://github.com/CrimsonGaia/pokemon-showdown-client/tree/master/play.pokemonshowdown.com/sprites/');
}();this.
fxPrefix=function(_window$document3){
var protocol=((_window$document3=window.document)==null||(_window$document3=_window$document3.location)==null?void 0:_window$document3.protocol)!=='http:'?'https:':'';
return protocol+"//"+(window.Config?Config.routes.client:'play.pokemonshowdown.com')+"/fx/";
}();this.
loadedSpriteData={xy:1,bw:0};this.
moddedDexes={};this.






afdMode=void 0;this.
































































moves={
get:function(nameOrMove){
if(nameOrMove&&typeof nameOrMove!=='string'){return nameOrMove;}
var name=nameOrMove||'';
var id=toID(nameOrMove);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(!window.BattleMovedex)window.BattleMovedex={};
var data=window.BattleMovedex[id];
if(data&&typeof data.exists==='boolean')return data;
if(!data&&id.substr(0,11)==='hiddenpower'&&id.length>11){
var _ref=/([a-z]*)([0-9]*)/.exec(id),hpWithType=_ref[1],hpPower=_ref[2];
data=Object.assign({},
window.BattleMovedex[hpWithType]||{},{
basePower:Number(hpPower)||60});

}
if(!data&&id.substr(0,6)==='return'&&id.length>6){
data=Object.assign({},
window.BattleMovedex['return']||{},{
basePower:Number(id.slice(6))});

}
if(!data&&id.substr(0,11)==='frustration'&&id.length>11){
data=Object.assign({},
window.BattleMovedex['frustration']||{},{
basePower:Number(id.slice(11))});

}
if(!data)data={exists:false};
var move=new Move(id,name,data);
window.BattleMovedex[id]=move;
return move;
}
};this.

flags={
get:function(nameOrFlag){
if(nameOrFlag&&typeof nameOrFlag!=='string'){return nameOrFlag;}
var name=nameOrFlag||'';
var id=toID(nameOrFlag);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(!window.BattleFlags)window.BattleFlags={};
var data=window.BattleFlags[id];
if(data&&typeof data.exists==='boolean')return data;
if(!data)data={exists:false};
var flag=new Flag(id,name,data);
window.BattleFlags[id]=BattleFlags;
return flag;
}};this.
items={
get:function(nameOrItem){
if(nameOrItem&&typeof nameOrItem!=='string'){return nameOrItem;}
var name=nameOrItem||'';
var id=toID(nameOrItem);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(!window.BattleItems)window.BattleItems={};
var data=window.BattleItems[id];
if(data&&typeof data.exists==='boolean')return data;
if(!data)data={exists:false};
var item=new Item(id,name,data);
window.BattleItems[id]=item;
return item;
}
};this.
abilities={
get:function(nameOrAbility){
if(nameOrAbility&&typeof nameOrAbility!=='string'){return nameOrAbility;}
var name=nameOrAbility||'';
var id=toID(nameOrAbility);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(!window.BattleAbilities)window.BattleAbilities={};
var data=window.BattleAbilities[id];
if(data&&typeof data.exists==='boolean')return data;
if(!data)data={exists:false};
var ability=new Ability(id,name,data);
window.BattleAbilities[id]=ability;
return ability;
}
};this.
species={
get:function(nameOrSpecies){
if(nameOrSpecies&&typeof nameOrSpecies!=='string'){return nameOrSpecies;}
var name=nameOrSpecies||'';
var id=toID(nameOrSpecies);
var formid=id;
if(!window.BattlePokedexAltForms)window.BattlePokedexAltForms={};
if(formid in window.BattlePokedexAltForms)return window.BattlePokedexAltForms[formid];
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}else if(window.BattlePokedex&&!(id in BattlePokedex)&&window.BattleBaseSpeciesChart){for(var _i2=0,_BattleBaseSpeciesCha2=
BattleBaseSpeciesChart;_i2<_BattleBaseSpeciesCha2.length;_i2++){var baseSpeciesId=_BattleBaseSpeciesCha2[_i2];
if(formid.startsWith(baseSpeciesId)){
id=baseSpeciesId;
break;
}
}
}
if(!window.BattlePokedex)window.BattlePokedex={};
var data=window.BattlePokedex[id];
var species;
if(data&&typeof data.exists==='boolean'){species=data;}else
{var _evos;
if(!data)data={exists:false};
if(!data.tier&&id.endsWith('totem')){data.tier=_this.species.get(id.slice(0,-5)).tier;}
if(!data.tier&&data.baseSpecies&&toID(data.baseSpecies)!==id){data.tier=_this.species.get(data.baseSpecies).tier;}
data.nfe=data.id==='dipplin'||!!((_evos=data.evos)!=null&&_evos.some(function(evo){
var evoSpecies=_this.species.get(evo);
return!evoSpecies.isNonstandard||evoSpecies.isNonstandard===data.isNonstandard||

evoSpecies.isNonstandard==="Unobtainable";
}));
species=new Species(id,name,data);
window.BattlePokedex[id]=species;
}
if(species.cosmeticFormes){for(var _i4=0,_species$cosmeticForm2=
species.cosmeticFormes;_i4<_species$cosmeticForm2.length;_i4++){var forme=_species$cosmeticForm2[_i4];
if(toID(forme)===formid){
species=new Species(formid,name,Object.assign({},
species,{
name:forme,
forme:forme.slice(species.name.length+1),
baseForme:"",
baseSpecies:species.name,
otherFormes:null})
);
window.BattlePokedexAltForms[formid]=species;
break;
}
}
}
return species;
}
};this.
types={
allCache:null,
namesCache:null,
get:function(type){
if(!type||typeof type==='string'){var _window$BattleTypeCha;
var id=toID(type);
var name=id.substr(0,1).toUpperCase()+id.substr(1);
type=((_window$BattleTypeCha=window.BattleTypeChart)==null?void 0:_window$BattleTypeCha[id])||{};
if(type.damageTaken)type.exists=true;
if(!type.id)type.id=id;
if(!type.name)type.name=name;
if(!type.effectType){
type.effectType='Type';
}
}
return type;
},
all:function(){
if(_this.types.allCache)return _this.types.allCache;
var types=[];
for(var id in window.BattleTypeChart||{}){types.push(Dex.types.get(id));}
if(types.length)_this.types.allCache=types;
return types;
},
names:function(){
if(_this.types.namesCache)return _this.types.namesCache;
var names=_this.types.all().map(function(type){return type.name;});
names.splice(names.indexOf('Stellar'),1);
if(names.length)_this.types.namesCache=names;
return names;
},
isName:function(name){var _window$BattleTypeCha2;
var id=toID(name);
if(name!==id.substr(0,1).toUpperCase()+id.substr(1))return false;
return(_window$BattleTypeCha2=window.BattleTypeChart)==null?void 0:_window$BattleTypeCha2.hasOwnProperty(id);
}
};}var _proto2=_class2.prototype;_proto2.mod=function mod(modid){if(modid==='gen9')return this;if(!window.BattleTeambuilderTable)return this;if(modid in this.moddedDexes){return this.moddedDexes[modid];}this.moddedDexes[modid]=new ModdedDex(modid);return this.moddedDexes[modid];};_proto2.forGen=function forGen(gen){if(!gen)return this;return this.mod("gen"+gen);};_proto2.formatGen=function formatGen(format){var formatid=toID(format);if(!formatid)return Dex.gen;if(!formatid.startsWith('gen'))return 6;return parseInt(formatid.charAt(3))||Dex.gen;};_proto2.forFormat=function forFormat(format){var dex=Dex.forGen(Dex.formatGen(format));var formatid=toID(format).slice(4);if(dex.gen===7&&formatid.includes('letsgo')){dex=Dex.mod('gen7letsgo');}if(dex.gen===8&&formatid.includes('bdsp')){dex=Dex.mod('gen8bdsp');}if(dex.gen===9&&(formatid.includes('indigostarstorm')||formatid.includes('isl'))){dex=Dex.mod('gen9indigostarstorm');}return dex;};_proto2.resolveAvatar=function resolveAvatar(avatar){var _window$Config;if(window.BattleAvatarNumbers&&avatar in BattleAvatarNumbers){avatar=BattleAvatarNumbers[avatar];}if(avatar.startsWith('#')){return Dex.resourcePrefix+'sprites/trainers-custom/'+toID(avatar.substr(1))+'.png';}if(avatar.includes('.')&&(_window$Config=window.Config)!=null&&(_window$Config=_window$Config.server)!=null&&_window$Config.registered){var protocol=Config.server.port===443?'https':'http';var server=protocol+"://"+Config.server.host+":"+Config.server.port;return server+"/avatars/"+encodeURIComponent(avatar).replace(/%3F/g,'?');}return Dex.resourcePrefix+'sprites/trainers/'+Dex.sanitizeName(avatar||'unknown')+'.png';};_proto2.sanitizeName=function sanitizeName(name){if(!name)return'';return(''+name).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').slice(0,50);};_proto2.prefs=function prefs(prop){var _window$Storage,_window$PS;return(_window$Storage=window.Storage)!=null&&_window$Storage.prefs?window.Storage.prefs(prop):(_window$PS=window.PS)==null||(_window$PS=_window$PS.prefs)==null?void 0:_window$PS[prop];};_proto2.getShortName=function getShortName(name){var shortName=name.replace(/[^A-Za-z0-9]+$/,'');if(shortName.includes('(')){shortName+=name.slice(shortName.length).replace(/[^()]+/g,'').replace(/\(\)/g,'');}return shortName;};_proto2.getEffect=function getEffect(name){name=(name||'').trim();if(name.substr(0,5)==='item:'){return Dex.items.get(name.substr(5).trim());}else if(name.substr(0,8)==='ability:'){return Dex.abilities.get(name.substr(8).trim());}else if(name.substr(0,5)==='move:'){return Dex.moves.get(name.substr(5).trim());}var id=toID(name);return new PureEffect(id,name);};_proto2.getGen3Category=function getGen3Category(type){return['Fire','Water','Grass','Electric','Ice','Psychic','Dark','Dragon'].includes(type)?'Special':'Physical';};_proto2.
hasAbility=function hasAbility(species,ability){
for(var i in species.abilities){if(ability===species.abilities[i])return true;}
return false;
};_proto2.
loadSpriteData=function loadSpriteData(gen){
if(this.loadedSpriteData[gen])return;
this.loadedSpriteData[gen]=1;
var path=$('script[src*="pokedex-mini.js"]').attr('src')||'';
var qs='?'+(path.split('?')[1]||'');
path=(/.+?(?=data\/pokedex-mini\.js)/.exec(path)||[])[0]||'';
var el=document.createElement('script');
el.src=path+'data/pokedex-mini-bw.js'+qs;
document.getElementsByTagName('body')[0].appendChild(el);
};_proto2.
getSpriteData=function getSpriteData(pokemon,isFront)







{var options=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{gen:6};
var mechanicsGen=options.gen||6;
var isDynamax=!!options.dynamax;
if(pokemon instanceof Pokemon){
if(pokemon.volatiles.transform){
options.shiny=pokemon.volatiles.transform[2];
options.gender=pokemon.volatiles.transform[3];
}else{
options.shiny=pokemon.shiny;
options.gender=pokemon.gender;
}
var isGigantamax=false;
if(pokemon.volatiles.dynamax){
if(pokemon.volatiles.dynamax[1]){isGigantamax=true;}else
if(options.dynamax!==false){isDynamax=true;}
}
pokemon=pokemon.getSpeciesForme()+(isGigantamax?'-Gmax':'');
}
var species=Dex.species.get(pokemon);

if(species.name.endsWith('-Gmax'))isDynamax=false;
var spriteData={
gen:mechanicsGen,
w:96,
h:96,
y:0,
url:Dex.resourcePrefix+'sprites/',
pixelated:true,
isFrontSprite:false,
cryurl:'',
shiny:options.shiny
};
var name=species.spriteid;
var dir;
var facing;
if(isFront){
spriteData.isFrontSprite=true;
dir='';
facing='front';
}else{
dir='-back';
facing='back';
}








var graphicsGen=mechanicsGen;
if(Dex.prefs('nopastgens'))graphicsGen=6;
if(Dex.prefs('bwgfx')&&graphicsGen>=6)graphicsGen=5;
spriteData.gen=Math.max(graphicsGen,Math.min(species.gen,5));
var baseDir=['','gen1','gen2','gen3','gen4','gen5','','','',''][spriteData.gen];
var miscData=null;
var speciesid=species.id;
if(species.isTotem)speciesid=toID(name);
if(window.BattlePokemonSprites)miscData=BattlePokemonSprites[speciesid];
if(!miscData&&window.BattlePokemonSpritesBW)miscData=BattlePokemonSpritesBW[speciesid];
if(!miscData)miscData={};
if(miscData.num!==0&&miscData.num>-5000){
var baseSpeciesid=toID(species.baseSpecies);
spriteData.cryurl='audio/cries/'+baseSpeciesid;
var formeid=species.formeid;
if(species.isMega||formeid&&(
formeid==='-crowned'||
formeid==='-eternal'||
formeid==='-eternamax'||
formeid==='-four'||
formeid==='-hangry'||
formeid==='-hero'||
formeid==='-lowkey'||
formeid==='-noice'||
formeid==='-primal'||
formeid==='-rapidstrike'||
formeid==='-roaming'||
formeid==='-school'||
formeid==='-sky'||
formeid==='-starter'||
formeid==='-super'||
formeid==='-therian'||
formeid==='-unbound'||
baseSpeciesid==='calyrex'||
baseSpeciesid==='kyurem'||
baseSpeciesid==='cramorant'||
baseSpeciesid==='indeedee'||
baseSpeciesid==='lycanroc'||
baseSpeciesid==='necrozma'||
baseSpeciesid==='oinkologne'||
baseSpeciesid==='oricorio'||
baseSpeciesid==='slowpoke'||
baseSpeciesid==='tatsugiri'||
baseSpeciesid==='zygarde'))
{spriteData.cryurl+=formeid;}
spriteData.cryurl+='.mp3';
}
if(options.shiny&&mechanicsGen>1)dir+='-shiny';

if(Dex.afdMode||options.afd){

dir='afd'+dir;
spriteData.url+=dir+'/'+name+'.png';


if(isDynamax&&!options.noScale){
spriteData.w*=0.25;
spriteData.h*=0.25;
spriteData.y+=-22;
}else if(species.isTotem&&!options.noScale){
spriteData.w*=0.5;
spriteData.h*=0.5;
spriteData.y+=-11;
}
return spriteData;
}

if(options.mod){
spriteData.cryurl="sprites/"+options.mod+"/audio/"+toID(species.baseSpecies);
spriteData.cryurl+='.mp3';
}
var animatedSprite=false;
if(!Dex.prefs('noanim')&&!Dex.prefs('nogif')&&spriteData.gen>=5){
var animationArray=[];
if(baseDir===''&&window.BattlePokemonSprites){animationArray.push([BattlePokemonSprites[speciesid],'']);}
if(window.BattlePokemonSpritesBW){animationArray.push([BattlePokemonSpritesBW[speciesid],'gen5']);}for(var _i6=0;_i6<
animationArray.length;_i6++){var _ref2=animationArray[_i6];var animationData=_ref2[0];var animDir=_ref2[1];
if(!animationData)continue;
if(animationData[facing+'f']&&options.gender==='F')facing+='f';
if(!animationData[facing])continue;
if(facing.endsWith('f'))name+='-f';
if(spriteData.gen>=6)spriteData.pixelated=false;
dir=animDir+'ani'+dir;
spriteData.w=animationData[facing].w;
spriteData.h=animationData[facing].h;
spriteData.url+=dir+'/'+name+'.gif';
animatedSprite=true;
break;
}
}
if(!animatedSprite){


dir=(baseDir||'gen5')+dir;


if(spriteData.gen>=4&&miscData['frontf']&&options.gender==='F'){name+='-f';}
spriteData.url+=dir+'/'+name+'.png';
}
if(!options.noScale){if(graphicsGen>4){}else
if(spriteData.isFrontSprite){
spriteData.w*=2;
spriteData.h*=2;
spriteData.y+=-16;
}else
{
spriteData.w*=2/1.5;
spriteData.h*=2/1.5;
spriteData.y+=-11;
}
if(spriteData.gen<=2)spriteData.y+=2;
}
if(isDynamax&&!options.noScale){
spriteData.w*=2;
spriteData.h*=2;
spriteData.y+=-22;
}else if(species.isTotem&&!options.noScale){
spriteData.w*=1.5;
spriteData.h*=1.5;
spriteData.y+=-11;
}
return spriteData;
};_proto2.
getPokemonIconNum=function getPokemonIconNum(id,isFemale,facingLeft){var _window$BattlePokemon,_window$BattlePokedex,_window$BattlePokemon2;
var num=0;
if((_window$BattlePokemon=window.BattlePokemonSprites)!=null&&(_window$BattlePokemon=_window$BattlePokemon[id])!=null&&_window$BattlePokemon.num){num=BattlePokemonSprites[id].num;}else
if((_window$BattlePokedex=window.BattlePokedex)!=null&&(_window$BattlePokedex=_window$BattlePokedex[id])!=null&&_window$BattlePokedex.num){num=BattlePokedex[id].num;}
if(num<0)num=0;
if(num>1025)num=0;
if((_window$BattlePokemon2=window.BattlePokemonIconIndexes)!=null&&_window$BattlePokemon2[id]){num=BattlePokemonIconIndexes[id];}
if(isFemale){
if(['unfezant','frillish','jellicent','meowstic','pyroar'].includes(id)){num=BattlePokemonIconIndexes[id+'f'];}
}
if(facingLeft){if(BattlePokemonIconIndexesLeft[id]){num=BattlePokemonIconIndexesLeft[id];}}
return num;
};_proto2.
getPokemonIcon=function getPokemonIcon(pokemon,facingLeft){var _pokemon,_pokemon2,_pokemon3,_pokemon4,_pokemon5;
if(pokemon==='pokeball'){return"background:transparent url("+Dex.resourcePrefix+"sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -0px 4px";}else
if(pokemon==='pokeball-statused'){return"background:transparent url("+Dex.resourcePrefix+"sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -40px 4px";}else
if(pokemon==='pokeball-fainted'){return"background:transparent url("+Dex.resourcePrefix+"sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -80px 4px;opacity:.4;filter:contrast(0)";}else
if(pokemon==='pokeball-none'){return"background:transparent url("+Dex.resourcePrefix+"sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -80px 4px";}
var id=toID(pokemon);
if(!pokemon||typeof pokemon==='string')pokemon=null;

if((_pokemon=pokemon)!=null&&_pokemon.speciesForme)id=toID(pokemon.speciesForme);

if((_pokemon2=pokemon)!=null&&_pokemon2.species)id=toID(pokemon.species);

if((_pokemon3=pokemon)!=null&&(_pokemon3=_pokemon3.volatiles)!=null&&_pokemon3.formechange&&!pokemon.volatiles.transform){

id=toID(pokemon.volatiles.formechange[1]);
}
var num=this.getPokemonIconNum(id,((_pokemon4=pokemon)==null?void 0:_pokemon4.gender)==='F',facingLeft);
var top=Math.floor(num/12)*30;
var left=num%12*40;
var fainted=(_pokemon5=pokemon)!=null&&_pokemon5.fainted?";opacity:.3;filter:grayscale(100%) brightness(.5)":"";

return"background:transparent url("+Dex.resourcePrefix+"sprites/pokemonicons-sheet.png?v19) no-repeat scroll -"+left+"px -"+top+"px"+fainted;
};_proto2.
getTeambuilderSpriteData=function getTeambuilderSpriteData(pokemon){var dex=arguments.length>1&&arguments[1]!==undefined?arguments[1]:Dex;
var gen=dex.gen;
var id=toID(pokemon.species||pokemon);
var species=Dex.species.get(id);
var spriteid;
if(typeof pokemon==='string'){spriteid=species.spriteid||id;}else
{
spriteid=pokemon.spriteid;
if(pokemon.species&&!spriteid){spriteid=species.spriteid||id;}
}
if(species.exists===false)return{spriteDir:'sprites/gen5',spriteid:'0',x:10,y:5};
if(Dex.afdMode){
return{
spriteid:spriteid,
spriteDir:'sprites/afd',
shiny:!!pokemon.shiny,
x:10,
y:5
};
}
var spriteData={
spriteid:spriteid,
spriteDir:'sprites/dex',
x:-2,
y:-3
};
if(pokemon.shiny)spriteData.shiny=true;
if(dex.modid==='gen7letsgo')gen=8;
if(Dex.prefs('nopastgens'))gen=9;
if(Dex.prefs('bwgfx')&&gen>5)gen=5;
var homeExists=(!species.isNonstandard||!['CAP','Custom'].includes(species.isNonstandard)||
species.id==="xerneasneutral")&&![
"floetteeternal","pichuspikyeared","pikachubelle","pikachucosplay","pikachulibre","pikachuphd","pikachupopstar","pikachurockstar"].
includes(species.id);
if(gen>=8&&homeExists){
spriteData.spriteDir='sprites/home-centered';
spriteData.x=8;
spriteData.y=10;
spriteData.h=96;
return spriteData;
}
var xydexExists=!species.isNonstandard||species.isNonstandard==='Past'||species.isNonstandard==='CAP'||[
"pikachustarter","eeveestarter","meltan","melmetal","pokestarufo","pokestarufo2","pokestarbrycenman","pokestarmt","pokestarmt2","pokestargiant","pokestarhumanoid","pokestarmonster","pokestarf00","pokestarf002","pokestarspirit"].
includes(species.id);
if(species.gen>=8&&species.isNonstandard!=='CAP')xydexExists=false;
if(gen>=6&&xydexExists){
if(species.gen>=7){
spriteData.x=-6;
spriteData.y=-7;
}else if(id.substr(0,6)==='arceus'){
spriteData.x=-2;
spriteData.y=7;
}else if(id==='garchomp'){
spriteData.x=-2;
spriteData.y=2;
}else if(id==='garchompmega'){
spriteData.x=-2;
spriteData.y=0;
}
return spriteData;
}
spriteData.spriteDir='sprites/gen5';
if(gen<=1&&species.gen<=1)spriteData.spriteDir='sprites/gen1';else
if(gen<=2&&species.gen<=2)spriteData.spriteDir='sprites/gen2';else
if(gen<=3&&species.gen<=3)spriteData.spriteDir='sprites/gen3';else
if(gen<=4&&species.gen<=4)spriteData.spriteDir='sprites/gen4';
spriteData.x=10;
spriteData.y=5;
return spriteData;
};_proto2.
getTeambuilderSprite=function getTeambuilderSprite(pokemon,dex){var xOffset=arguments.length>2&&arguments[2]!==undefined?arguments[2]:0;var yOffset=arguments.length>3&&arguments[3]!==undefined?arguments[3]:0;
if(!pokemon)return'';
var data=this.getTeambuilderSpriteData(pokemon,dex);
var shiny=data.shiny?'-shiny':'';
var resize=data.h?"background-size:"+data.h+"px":'';
return"background-image:url("+Dex.resourcePrefix+data.spriteDir+shiny+"/"+data.spriteid+".png);background-position:"+(data.x+xOffset)+"px "+(data.y+yOffset)+"px;background-repeat:no-repeat;"+resize;
};_proto2.
getItemIcon=function getItemIcon(item){var _item;
var num=0;
if(typeof item==='string'&&window.BattleItems)item=window.BattleItems[toID(item)];
if((_item=item)!=null&&_item.spritenum)num=item.spritenum;
var top=Math.floor(num/16)*24;
var left=num%16*24;
return"background:transparent url("+Dex.resourcePrefix+"sprites/itemicons-sheet.png?v1) no-repeat scroll -"+left+"px -"+top+"px";
};_proto2.
getTypeIcon=function getTypeIcon(type,b){
type=this.types.get(type).name;
if(!type)type='???';
var sanitizedType=type.replace(/\?/g,'%3f');
return"<img src=\""+Dex.resourcePrefix+"sprites/types/"+sanitizedType+".png\" alt=\""+type+"\" height=\"14\" width=\"32\" class=\"pixelated"+(b?' b':'')+"\" />";
};_proto2.
getFlagIcon=function getFlagIcon(flag){
if(!flag)return"\u2014";
var flagID=toID(flag);
var sanitizedFlag='';
switch(flagID){
case'zmove':sanitizedFlag='Z-Move';break;
case'maxmove':sanitizedFlag='Max Move';break;
case'contact':sanitizedFlag='Contact';break;
case'binding':case'bind':sanitizedFlag='Bind';break;
case'bite':sanitizedFlag='Bite';break;
case'bomb':sanitizedFlag='Bomb';break;
case'bullet':sanitizedFlag='Bullet';break;
case'drain':sanitizedFlag='Drain';break;
case'explosive':sanitizedFlag='Explosive';break;
case'fist':case'punch':sanitizedFlag='Punch';break;
case'powder':sanitizedFlag='Powder';break;
case'pulse':sanitizedFlag='Pulse';break;
case'slicing':case'slice':sanitizedFlag='Slice';break;
case'sound':sanitizedFlag='Sound';break;
case'wind':sanitizedFlag='Wind';break;
case'airborne':sanitizedFlag='Airborne';break;
case'aura':sanitizedFlag='Aura';break;
case'beam':sanitizedFlag='Beam';break;
case'breath':sanitizedFlag='Breath';break;
case'claw':sanitizedFlag='Claw';break;
case'crash':sanitizedFlag='Crash';break;
case'crush':sanitizedFlag='Crush';break;
case'dance':sanitizedFlag='Dance';break;
case'heal':sanitizedFlag='Heal';break;
case'kick':sanitizedFlag='Kick';break;
case'launch':sanitizedFlag='Launch';break;
case'light':sanitizedFlag='Light';break;
case'lunar':sanitizedFlag='Lunar';break;
case'magic':sanitizedFlag='Magic';break;
case'pierce':sanitizedFlag='Pierce';break;
case'shadow':sanitizedFlag='Shadow';break;
case'solar':sanitizedFlag='Solar';break;
case'spin':sanitizedFlag='Spin';break;
case'sweep':sanitizedFlag='Sweep';break;
case'throw':sanitizedFlag='Throw';break;
case'weapon':sanitizedFlag='Weapon';break;
case'wing':sanitizedFlag='Wing';break;
case'bypassprotect':sanitizedFlag='Bypass Protect';break;
case'nonreflectable':sanitizedFlag='Non-Reflectable';break;
case'nonmirror':sanitizedFlag='Non-Mirror';break;
case'nonsnatchable':sanitizedFlag='Non-Snatchable';break;
case'bypasssubstitute':sanitizedFlag='Bypass Substitute';break;
case'gmaxmove':sanitizedFlag='G-Max Move';break;
default:
sanitizedFlag='undefined';
break;
}
var flagText=sanitizedFlag.charAt(0).toUpperCase()+sanitizedFlag.slice(1);

return"<img src=\"sprites/flagicons/"+sanitizedFlag+".png\" alt=\""+flagText+"\" height=\"32\" width=\"132\" class=\"pixelated\" onerror=\"this.style.display='none'; this.nextSibling.style.display='inline';\" /><span style=\"display: none;\">"+flagText+"</span>";
};_proto2.
getCategoryIcon=function getCategoryIcon(category){
var categoryID=toID(category);
var sanitizedCategory='';
switch(categoryID){
case'physical':
case'special':
case'status':
sanitizedCategory=categoryID.charAt(0).toUpperCase()+categoryID.slice(1);
break;
default:
sanitizedCategory='undefined';
break;
}
return"<img src=\""+Dex.resourcePrefix+"sprites/categories/"+sanitizedCategory+".png\" alt=\""+sanitizedCategory+"\" height=\"14\" width=\"32\" class=\"pixelated\" onerror=\"this.style.display='none'; this.nextSibling.style.display='inline';\" /><span style=\"display: none; font-size: 10px; font-weight: bold; text-align: center;\">"+sanitizedCategory+"</span>";
};_proto2.
getPokeballs=function getPokeballs(){var _window;
if(this.pokeballs)return this.pokeballs;
this.pokeballs=[];
(_window=window).BattleItems||(_window.BattleItems={});for(var _i8=0,_Object$values2=
Object.values(BattleItems);_i8<_Object$values2.length;_i8++){var data=_Object$values2[_i8];
if(!data.isPokeball)continue;
this.pokeballs.push(data.name);
}
return this.pokeballs;
};return _class2;}())(
);var

ModdedDex=function(){












function ModdedDex(modid){var _this2=this;this.gen=void 0;this.modid=void 0;this.cache={Moves:{},Flags:{},Items:{},Abilities:{},Species:{},Types:{}};this.pokeballs=null;this.






moves={
get:function(name){var _window$BattleTeambui2;
var id=toID(name);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(_this2.cache.Moves.hasOwnProperty(id))return _this2.cache.Moves[id];

var base=Dex.moves.get(name);
var data=Object.assign({},base);


for(var i=Dex.gen-1;i>=_this2.gen;i--){var _window$BattleTeambui;
var table=(_window$BattleTeambui=window.BattleTeambuilderTable)==null?void 0:_window$BattleTeambui["gen"+i];
if(table!=null&&table.overrideMoveData&&id in table.overrideMoveData)Object.assign(data,table.overrideMoveData[id]);
}


var modTable=(_window$BattleTeambui2=window.BattleTeambuilderTable)==null?void 0:_window$BattleTeambui2[_this2.modid];
var modHas=!!(modTable!=null&&modTable.overrideMoveData&&id in modTable.overrideMoveData);
if(modHas)Object.assign(data,modTable.overrideMoveData[id]);


if(modHas&&base&&base.exists===false){
data.exists=true;
data.id||(data.id=id);
data.name||(data.name=name);
}

if(_this2.gen<=3&&data.category!=='Status')data.category=Dex.getGen3Category(data.type);

var move=new Move(id,data.name||name,data);
_this2.cache.Moves[id]=move;
return move;
}
};this.

flags={
get:function(name){var _window$BattleTeambui4;
var id=toID(name);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(_this2.cache.Flags.hasOwnProperty(id))return _this2.cache.Flags[id];

var base=Dex.flags.get(name);
var data=Object.assign({},base);

for(var i=Dex.gen-1;i>=_this2.gen;i--){var _window$BattleTeambui3;
var table=(_window$BattleTeambui3=window.BattleTeambuilderTable)==null?void 0:_window$BattleTeambui3["gen"+i];
if(table!=null&&table.overrideFlagData&&id in table.overrideFlagData)Object.assign(data,table.overrideFlagData[id]);
}

var modTable=(_window$BattleTeambui4=window.BattleTeambuilderTable)==null?void 0:_window$BattleTeambui4[_this2.modid];
var modHas=!!(modTable!=null&&modTable.overrideFlagData&&id in modTable.overrideFlagData);
if(modHas)Object.assign(data,modTable.overrideFlagData[id]);

if(modHas&&base&&base.exists===false){
data.exists=true;
data.id||(data.id=id);
data.name||(data.name=name);
}

var flag=new Flag(id,data.name||name,data);
_this2.cache.Flags[id]=flag;
return flag;
}
};this.

items={
get:function(name){var _window$BattleTeambui6;
var id=toID(name);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(_this2.cache.Items.hasOwnProperty(id))return _this2.cache.Items[id];

var base=Dex.items.get(name);
var data=Object.assign({},base);

for(var i=Dex.gen-1;i>=_this2.gen;i--){var _window$BattleTeambui5;
var table=(_window$BattleTeambui5=window.BattleTeambuilderTable)==null?void 0:_window$BattleTeambui5["gen"+i];
if(table!=null&&table.overrideItemData&&id in table.overrideItemData)Object.assign(data,table.overrideItemData[id]);
}

var modTable=(_window$BattleTeambui6=window.BattleTeambuilderTable)==null?void 0:_window$BattleTeambui6[_this2.modid];
var modHas=!!(modTable!=null&&modTable.overrideItemData&&id in modTable.overrideItemData);
if(modHas)Object.assign(data,modTable.overrideItemData[id]);

if(modHas&&base&&base.exists===false){
data.exists=true;
data.id||(data.id=id);
data.name||(data.name=name);
}

var item=new Item(id,data.name||name,data);
_this2.cache.Items[id]=item;
return item;
}
};this.

abilities={
get:function(name){var _window$BattleTeambui8;
var id=toID(name);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(_this2.cache.Abilities.hasOwnProperty(id))return _this2.cache.Abilities[id];

var base=Dex.abilities.get(name);
var data=Object.assign({},base);

for(var i=Dex.gen-1;i>=_this2.gen;i--){var _window$BattleTeambui7;
var table=(_window$BattleTeambui7=window.BattleTeambuilderTable)==null?void 0:_window$BattleTeambui7["gen"+i];
if(table!=null&&table.overrideAbilityData&&id in table.overrideAbilityData)Object.assign(data,table.overrideAbilityData[id]);
}

var modTable=(_window$BattleTeambui8=window.BattleTeambuilderTable)==null?void 0:_window$BattleTeambui8[_this2.modid];
var modHas=!!(modTable!=null&&modTable.overrideAbilityData&&id in modTable.overrideAbilityData);
if(modHas)Object.assign(data,modTable.overrideAbilityData[id]);

if(modHas&&base&&base.exists===false){
data.exists=true;
data.id||(data.id=id);
data.name||(data.name=name);
}

var ability=new Ability(id,data.name||name,data);
_this2.cache.Abilities[id]=ability;
return ability;
}
};this.

species={
get:function(name){var _window$BattleTeambui10,_data$evos;
var id=toID(name);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(_this2.cache.Species.hasOwnProperty(id))return _this2.cache.Species[id];

var base=Dex.species.get(name);
var data=Object.assign({},base);


for(var i=Dex.gen-1;i>=_this2.gen;i--){var _window$BattleTeambui9;
var table=(_window$BattleTeambui9=window.BattleTeambuilderTable)==null?void 0:_window$BattleTeambui9["gen"+i];
if(table!=null&&table.overrideSpeciesData&&id in table.overrideSpeciesData)Object.assign(data,table.overrideSpeciesData[id]);
}


var modTable=(_window$BattleTeambui10=window.BattleTeambuilderTable)==null?void 0:_window$BattleTeambui10[_this2.modid];
var modHas=!!(modTable!=null&&modTable.overrideSpeciesData&&id in modTable.overrideSpeciesData);
if(modHas)Object.assign(data,modTable.overrideSpeciesData[id]);


if(modHas&&base&&base.exists===false){
data.exists=true;
data.id||(data.id=id);
data.name||(data.name=name);
}



if(_this2.modid==='gen9indigostarstorm'){var _data$num;
var allowedSet=ISL_ALLOWED_CACHE.get(_this2);
if(!allowedSet){
var allowedIds=[];


var rows=(modTable==null?void 0:modTable.tiers)||(modTable==null?void 0:modTable.tierSet);
if(rows){for(var _i10=0;_i10<
rows.length;_i10++){var row=rows[_i10];

if(typeof row==='string'){
allowedIds.push(toID(row));
}else if(Array.isArray(row)&&row[0]==='pokemon'&&row[1]){
allowedIds.push(toID(row[1]));
}
}
}

allowedSet=new Set(allowedIds);
ISL_ALLOWED_CACHE.set(_this2,allowedSet);
}


var num=(_data$num=data.num)!=null?_data$num:base==null?void 0:base.num;
var isCustom=typeof num==='number'&&(num>=10000||num<0);


var baseId=toID(data.baseSpecies||data.name||name);
var ok=isCustom||allowedSet.has(id)||allowedSet.has(baseId);

if(!ok)data.isNonstandard='Past';
}
if(_this2.gen<3||_this2.modid==='gen7letsgo')data.abilities={0:"No Ability"};

if(modTable!=null&&modTable.overrideTier&&id in modTable.overrideTier)data.tier=modTable.overrideTier[id];
if(!data.tier&&id.endsWith('totem'))data.tier=_this2.species.get(id.slice(0,-5)).tier;
if(!data.tier&&data.baseSpecies&&toID(data.baseSpecies)!==id)data.tier=_this2.species.get(data.baseSpecies).tier;
if(data.gen&&data.gen>_this2.gen)data.tier='Illegal';

data.nfe=data.id==='dipplin'||!!((_data$evos=data.evos)!=null&&_data$evos.some(function(evo){
var evoSpecies=_this2.species.get(evo);
return!evoSpecies.isNonstandard||evoSpecies.isNonstandard===data.isNonstandard||
evoSpecies.isNonstandard==="Unobtainable";
}));

var species=new Species(id,data.name||name,data);
_this2.cache.Species[id]=species;
return species;
}
};this.

types={
namesCache:null,
names:function(){
if(_this2.types.namesCache)return _this2.types.namesCache;
var names=Dex.types.names();
if(!names.length)return[];
var curNames=[].concat(names);

if(_this2.gen<6)curNames.splice(curNames.indexOf('Fairy'),1);
if(_this2.gen<2)curNames.splice(curNames.indexOf('Dark'),1);
if(_this2.gen<2)curNames.splice(curNames.indexOf('Steel'),1);
_this2.types.namesCache=curNames;
return curNames;
},
get:function(name){
var id=toID(name);
name=id.substr(0,1).toUpperCase()+id.substr(1);
if(_this2.cache.Types.hasOwnProperty(id))return _this2.cache.Types[id];
var data=Object.assign({},Dex.types.get(name));
for(var i=7;i>=_this2.gen;i--){
var table=window.BattleTeambuilderTable["gen"+i];
if(id in table.removeType){
data.exists=false;
break;
}
if(id in table.overrideTypeChart)data=Object.assign({},data,table.overrideTypeChart[id]);
}
_this2.cache.Types[id]=data;
return data;
}
};this.modid=modid;var gen=parseInt(modid.charAt(3),10);if(!modid.startsWith('gen')||!gen)throw new Error("Unsupported modid");this.gen=gen;}var _proto3=ModdedDex.prototype;_proto3.

getPokeballs=function getPokeballs(){var _window2;
if(this.pokeballs)return this.pokeballs;
this.pokeballs=[];
(_window2=window).BattleItems||(_window2.BattleItems={});for(var _i12=0,_Object$values4=
Object.values(BattleItems);_i12<_Object$values4.length;_i12++){var data=_Object$values4[_i12];
if(data.gen&&data.gen>this.gen)continue;
if(!data.isPokeball)continue;
this.pokeballs.push(data.name);
}
return this.pokeballs;
};return ModdedDex;}();


if(typeof require==='function'){
global.Dex=Dex;
global.toID=toID;
}
//# sourceMappingURL=battle-dex.js.map