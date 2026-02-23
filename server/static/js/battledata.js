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
"use strict";



























































var Teams=new(function(){function _class(){}var _proto=_class.prototype;_proto.
pack=function pack(team){
if(!team)return'';

function getIv(ivs,s){
return ivs[s]===31||ivs[s]===undefined?'':ivs[s].toString();
}

var buf='';for(var _i2=0;_i2<
team.length;_i2++){var set=team[_i2];
if(buf)buf+=']';


buf+=set.name||set.species;


var speciesid=this.packName(set.species||set.name);
buf+="|"+(this.packName(set.name||set.species)===speciesid?'':speciesid);


buf+="|"+this.packName(set.item);


buf+="|"+this.packName(set.ability);


buf+='|'+set.moves.map(this.packName).join(',');


buf+="|"+(set.nature||'');


var evs='|';
if(set.evs){
evs="|"+(set.evs['hp']||'')+","+(set.evs['atk']||'')+","+(set.evs['def']||'')+","+((
set.evs['spa']||'')+","+(set.evs['spd']||'')+","+(set.evs['spe']||''));
}
buf+=evs==='|,,,,,'?'|':evs;


buf+="|"+(set.gender||'');


var ivs='|';
if(set.ivs){
ivs="|"+getIv(set.ivs,'hp')+","+getIv(set.ivs,'atk')+","+getIv(set.ivs,'def')+","+(
getIv(set.ivs,'spa')+","+getIv(set.ivs,'spd')+","+getIv(set.ivs,'spe'));
}
buf+=ivs==='|,,,,,'?'|':ivs;


buf+="|"+(set.shiny?'S':'');


buf+="|"+(set.level&&set.level!==100?set.level:'');


buf+="|"+(set.happiness!==undefined&&set.happiness!==255?set.happiness:'');

if(set.pokeball||set.hpType||set.gigantamax||
set.dynamaxLevel!==undefined&&set.dynamaxLevel!==10||set.teraType||set.size){
buf+=","+(set.hpType||'');
buf+=","+this.packName(set.pokeball||'');
buf+=","+(set.gigantamax?'G':'');
buf+=","+(set.dynamaxLevel!==undefined&&set.dynamaxLevel!==10?set.dynamaxLevel:'');
buf+=","+(set.teraType||'');
buf+=","+(set.size||'');
}
}

return buf;
};_proto.

packName=function packName(name){
if(!name)return'';
return name.replace(/[^A-Za-z0-9]+/g,'');
};_proto.

unpack=function unpack(buf){
if(!buf)return[];


var endIndex=buf.indexOf(']');
if(endIndex>0){
var firstPart=buf.slice(0,endIndex);
var pipeCount=firstPart.split('|').length-1;
if(pipeCount===12||pipeCount===1){
buf=buf.slice(buf.indexOf('|')+1);
}
}

var team=[];
var i=0;
var j=0;
var lastI=0;

while(true){
var set={};
team.push(set);


j=buf.indexOf('|',i);
var name=buf.substring(i,j);
i=j+1;


j=buf.indexOf('|',i);
var species=Dex.species.get(buf.substring(i,j)||name);
set.species=species.name;
if(species.baseSpecies!==name)set.name=name;
i=j+1;


j=buf.indexOf('|',i);
set.item=Dex.items.get(buf.substring(i,j)).name;
i=j+1;


j=buf.indexOf('|',i);
var ability=Dex.abilities.get(buf.substring(i,j)).name;
set.ability=species.abilities&&
['','0','1','H','S'].includes(ability)?species.abilities[ability||'0']:ability;
i=j+1;


j=buf.indexOf('|',i);
set.moves=buf.substring(i,j).split(',').map(
function(moveid){return Dex.moves.get(moveid).name;}
);
i=j+1;


j=buf.indexOf('|',i);
set.nature=buf.substring(i,j);
if(set.nature==='undefined')delete set.nature;
i=j+1;


j=buf.indexOf('|',i);
if(j!==i){
var evstring=buf.substring(i,j);
if(evstring.length>5){
var evs=evstring.split(',');
set.evs={
hp:Number(evs[0])||0,
atk:Number(evs[1])||0,
def:Number(evs[2])||0,
spa:Number(evs[3])||0,
spd:Number(evs[4])||0,
spe:Number(evs[5])||0
};
}else if(evstring==='0'){
set.evs={hp:0,atk:0,def:0,spa:0,spd:0,spe:0};
}
}
i=j+1;


j=buf.indexOf('|',i);
if(i!==j)set.gender=buf.substring(i,j);
i=j+1;


j=buf.indexOf('|',i);
if(j!==i){
var ivs=buf.substring(i,j).split(',');
set.ivs={
hp:ivs[0]===''?31:Number(ivs[0]),
atk:ivs[1]===''?31:Number(ivs[1]),
def:ivs[2]===''?31:Number(ivs[2]),
spa:ivs[3]===''?31:Number(ivs[3]),
spd:ivs[4]===''?31:Number(ivs[4]),
spe:ivs[5]===''?31:Number(ivs[5])
};
}
i=j+1;


j=buf.indexOf('|',i);
if(i!==j)set.shiny=true;
i=j+1;


j=buf.indexOf('|',i);
if(i!==j)set.level=parseInt(buf.substring(i,j),10);
i=j+1;


j=buf.indexOf(']',i);
var misc=void 0;
if(j<0){
if(i<buf.length)misc=buf.substring(i).split(',',7);
}else{
if(i!==j)misc=buf.substring(i,j).split(',',7);
}
if(misc){
set.happiness=misc[0]?Number(misc[0]):undefined;
set.hpType=misc[1]||undefined;
set.pokeball=misc[2]||undefined;
set.gigantamax=!!misc[3]||undefined;
set.dynamaxLevel=misc[4]?Number(misc[4]):undefined;
set.teraType=misc[5]||undefined;
set.size=misc[6]||undefined;
}
i=j+1;
if(j<0||i<=lastI)break;
lastI=i;
}

return team;
};_proto.
unpackSpeciesOnly=function unpackSpeciesOnly(buf){
if(!buf)return[];

var team=[];
var i=0;
var lastI=0;

while(true){
var name=buf.slice(i,buf.indexOf('|',i));
i=buf.indexOf('|',i)+1;

team.push(buf.slice(i,buf.indexOf('|',i))||name);

for(var k=0;k<9;k++){
i=buf.indexOf('|',i)+1;
}

i=buf.indexOf(']',i)+1;

if(i<1||i<=lastI)break;
lastI=i;
}

return team;
};_proto.




exportSet=function exportSet(set){var dex=arguments.length>1&&arguments[1]!==undefined?arguments[1]:Dex;var newFormat=arguments.length>2?arguments[2]:undefined;
var text='';


if(set.name&&set.name!==set.species){
text+=set.name+" ("+set.species+")";
}else{
text+=""+set.species;
}
if(set.gender==='M')text+=" (M)";
if(set.gender==='F')text+=" (F)";
if(!newFormat&&set.item){
text+=" @ "+set.item;
}
text+="\n";
if((set.item||set.ability||dex.gen>=2)&&newFormat){
if(set.ability||dex.gen>=3)text+="["+(set.ability||'(select ability)')+"]";
if(set.item||dex.gen>=2)text+=" @ "+(set.item||"(no item)");
text+="\n";
}else if(set.ability&&set.ability!=='No Ability'){
text+="Ability: "+set.ability+"\n";
}

if(newFormat){
if(set.moves){for(var _i4=0,_set$moves2=
set.moves;_i4<_set$moves2.length;_i4++){var move=_set$moves2[_i4];
if(move.startsWith('Hidden Power ')){
var hpType=move.slice(13);
move=move.slice(0,13);
move=move+"["+hpType+"]";
}
text+="- "+(move||'')+"\n";
}
}
for(var i=((_set$moves3=set.moves)==null?void 0:_set$moves3.length)||0;i<4;i++){var _set$moves3;
text+="- \n";
}
}


var first=true;
if(set.evs||set.nature){
var nature=newFormat?BattleNatures[set.nature]:null;for(var _i6=0,_Dex$statNames2=
Dex.statNames;_i6<_Dex$statNames2.length;_i6++){var _set$evs;var stat=_Dex$statNames2[_i6];
var plusMinus=!newFormat?'':(nature==null?void 0:nature.plus)===stat?'+':(nature==null?void 0:nature.minus)===stat?'-':'';
var ev=((_set$evs=set.evs)==null?void 0:_set$evs[stat])||'';
if(ev===''&&!plusMinus)continue;
text+=first?"EVs: ":" / ";
first=false;
text+=""+ev+plusMinus+" "+BattleStatNames[stat];
}
}
if(!first){
if(set.nature&&newFormat)text+=" ("+set.nature+")";
text+="\n";
}
if(set.nature&&!newFormat){
text+=set.nature+" Nature\n";
}else if(['Hardy','Docile','Serious','Bashful','Quirky'].includes(set.nature)){
text+=set.nature+" Nature\n";
}
first=true;
if(set.ivs){for(var _i8=0,_Dex$statNames4=
Dex.statNames;_i8<_Dex$statNames4.length;_i8++){var _stat=_Dex$statNames4[_i8];
if(set.ivs[_stat]===undefined||isNaN(set.ivs[_stat])||set.ivs[_stat]===31)continue;
if(first){
text+="IVs: ";
first=false;
}else{
text+=" / ";
}
text+=set.ivs[_stat]+" "+BattleStatNames[_stat];
}
}
if(!first){
text+="\n";
}


if(set.level&&set.level!==100){
text+="Level: "+set.level+"\n";
}
if(set.shiny){
text+=!newFormat?"Shiny: Yes\n":"Shiny\n";
}
if(typeof set.happiness==='number'&&set.happiness!==255&&!isNaN(set.happiness)){
text+="Happiness: "+set.happiness+"\n";
}
if(typeof set.dynamaxLevel==='number'&&set.dynamaxLevel!==255&&!isNaN(set.dynamaxLevel)){
text+="Dynamax Level: "+set.dynamaxLevel+"\n";
}
if(set.gigantamax){
text+=!newFormat?"Gigantamax: Yes\n":"Gigantamax\n";
}
if(set.teraType){
text+="Tera Type: "+set.teraType+"\n";
}
if(set.size){
text+="Size: "+set.size+"\n";
}

if(!newFormat){for(var _i10=0,_ref2=
set.moves||[];_i10<_ref2.length;_i10++){var _move=_ref2[_i10];
if(_move.startsWith('Hidden Power ')){
var _hpType=_move.slice(13);
_move=_move.slice(0,13);
_move=!newFormat?_move+"["+_hpType+"]":""+_move+_hpType;
}
text+="- "+_move+"\n";
}
for(var _i11=((_set$moves4=set.moves)==null?void 0:_set$moves4.length)||0;_i11<4;_i11++){var _set$moves4;
text+="- \n";
}
}

text+="\n";
return text;
};_proto["export"]=




function _export(sets,dex,newFormat){
var text='';for(var _i13=0;_i13<
sets.length;_i13++){var set=sets[_i13];

text+=Teams.exportSet(set,dex,newFormat);
}
return text;
};_proto.

parseExportedTeamLine=function parseExportedTeamLine(line,isFirstLine,set){
if(isFirstLine||line.startsWith('[')){var _item;
var item;var _line$split=
line.split('@');line=_line$split[0];item=_line$split[1];
line=line.trim();
item=(_item=item)==null?void 0:_item.trim();
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
if(line.startsWith('[')&&line.endsWith(']')){


set.ability=line.slice(1,-1);
if(toID(set.ability)==='selectability'){
set.ability='';
}
}else if(line){
var parenIndex=line.lastIndexOf(' (');
if(line.endsWith(')')&&parenIndex!==-1){
set.species=Dex.species.get(line.slice(parenIndex+2,-1)).name;
set.name=line.slice(0,parenIndex);
}else{
set.species=Dex.species.get(line).name;
set.name='';
}
}
}else if(line.startsWith('Trait: ')){
set.ability=line.slice(7);
}else if(line.startsWith('Ability: ')){
set.ability=line.slice(9);
}else if(line.startsWith('Item: ')){
set.item=line.slice(6);
}else if(line.startsWith('Nickname: ')){
set.name=line.slice(10);
}else if(line.startsWith('Species: ')){
set.species=line.slice(9);
}else if(line==='Shiny: Yes'||line==='Shiny'){
set.shiny=true;
}else if(line.startsWith('Level: ')){
set.level=+line.slice(7);
}else if(line.startsWith('Happiness: ')){
set.happiness=+line.slice(11);
}else if(line.startsWith('Pokeball: ')){
set.pokeball=line.slice(10);
}else if(line.startsWith('Hidden Power: ')){
set.hpType=line.slice(14);
}else if(line.startsWith('Dynamax Level: ')){
set.dynamaxLevel=+line.slice(15);
}else if(line==='Gigantamax: Yes'||line==='Gigantamax'){
set.gigantamax=true;
}else if(line.startsWith('Tera Type: ')){
set.teraType=line.slice(11);
}else if(line.startsWith('Size: ')){
set.size=line.slice(6);
}else if(line.startsWith('EVs: ')){
var evLines=line.slice(5).split('(')[0].split('/');
set.evs={hp:0,atk:0,def:0,spa:0,spd:0,spe:0};
var plus='',minus='';for(var _i15=0;_i15<
evLines.length;_i15++){var evLine=evLines[_i15];
evLine=evLine.trim();
var spaceIndex=evLine.indexOf(' ');
if(spaceIndex===-1)continue;
var statid=BattleStatIDs[evLine.slice(spaceIndex+1)];
if(!statid)continue;
if(evLine.charAt(spaceIndex-1)==='+')plus=statid;
if(evLine.charAt(spaceIndex-1)==='-')minus=statid;
set.evs[statid]=parseInt(evLine.slice(0,spaceIndex),10)||0;
}
var nature=this.getNatureFromPlusMinus(plus,minus);
if(nature)set.nature=nature;
}else if(line.startsWith('IVs: ')){
var ivLines=line.slice(5).split(' / ');
set.ivs={hp:31,atk:31,def:31,spa:31,spd:31,spe:31};for(var _i17=0;_i17<
ivLines.length;_i17++){var ivLine=ivLines[_i17];
ivLine=ivLine.trim();
var _spaceIndex=ivLine.indexOf(' ');
if(_spaceIndex===-1)continue;
var _statid=BattleStatIDs[ivLine.slice(_spaceIndex+1)];
if(!_statid)continue;
var statval=parseInt(ivLine.slice(0,_spaceIndex),10);
if(isNaN(statval))statval=31;
set.ivs[_statid]=statval;
}
}else if(/^[A-Za-z]+ (N|n)ature/.exec(line)){
var natureIndex=line.indexOf(' Nature');
if(natureIndex===-1)natureIndex=line.indexOf(' nature');
if(natureIndex===-1)return;
line=line.slice(0,natureIndex);
if(line!=='undefined')set.nature=line;
}else if(line.startsWith('-')||line.startsWith('~')||line.startsWith('Move:')){
if(line.startsWith('Move:'))line=line.slice(4);
line=line.slice(line.charAt(1)===' '?2:1);
if(line.startsWith('Hidden Power [')){
var hpType=line.slice(14,line.indexOf(']'));
if(hpType.includes(']')||hpType.includes('['))hpType='';
line='Hidden Power '+hpType;
set.hpType=hpType;
}
if(line==='Frustration'&&set.happiness===undefined){
set.happiness=0;
}
set.moves.push(line);
}
};_proto.
getNatureFromPlusMinus=function getNatureFromPlusMinus(
plus,minus)
{
if(!plus||!minus)return null;
for(var i in BattleNatures){
if(BattleNatures[i].plus===plus&&BattleNatures[i].minus===minus){
return i;
}
}
return null;
};_proto["import"]=
function _import(buffer){
var lines=buffer.split("\n");

var sets=[];
var curSet=null;

while(lines.length&&!lines[0])lines.shift();
while(lines.length&&!lines[lines.length-1])lines.pop();

if(lines.length===1&&lines[0].includes('|')){
return Teams.unpack(lines[0]);
}for(var _i19=0;_i19<
lines.length;_i19++){var line=lines[_i19];
line=line.trim();
if(line===''||line==='---'){
curSet=null;
}else if(line.startsWith('===')){

}else if(line.includes('|')){

return Teams.unpack(line);
}else if(!curSet){
curSet={
name:'',species:'',gender:'',
moves:[]
};
sets.push(curSet);
this.parseExportedTeamLine(line,true,curSet);
}else{
this.parseExportedTeamLine(line,false,curSet);
}
}
return sets;
};return _class;}())(
);
"use strict";/**
 * Pokemon Showdown Dex Data
 * A collection of data and definitions for src/battle-dex.ts.
 * Larger data has their own files in data/, so this is just for small
 * miscellaneous data that doesn't need its own file.
 * Licensing note: PS's client has complicated licensing:
 * - The client as a whole is AGPLv3
 * - The battle replay/animation engine (battle-*.ts) by itself is MIT
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */









var BattleNatures={
Adamant:{
plus:'atk',
minus:'spa'
},
Bashful:{},
Bold:{plus:'def',minus:'atk'},
Brave:{plus:'atk',minus:'spe'},
Calm:{plus:'spd',minus:'atk'},
Careful:{plus:'spd',minus:'spa'},
Docile:{},
Gentle:{plus:'spd',minus:'def'},
Hardy:{},
Hasty:{plus:'spe',minus:'def'},
Impish:{plus:'def',minus:'spa'},
Jolly:{plus:'spe',minus:'spa'},
Lax:{plus:'def',minus:'spd'},
Lonely:{plus:'atk',minus:'def'},
Mild:{plus:'spa',minus:'def'},
Modest:{plus:'spa',minus:'atk'},
Naive:{plus:'spe',minus:'spd'},
Naughty:{plus:'atk',minus:'spd'},
Quiet:{plus:'spa',minus:'spe'},
Quirky:{},
Rash:{plus:'spa',minus:'spd'},
Relaxed:{plus:'def',minus:'spe'},
Sassy:{plus:'spd',minus:'spe'},
Serious:{},
Timid:{plus:'spe',minus:'atk'}
};
var BattleStatIDs={
HP:'hp',
hp:'hp',
Atk:'atk',
atk:'atk',
Def:'def',
def:'def',
SpA:'spa',
SAtk:'spa',
SpAtk:'spa',
spa:'spa',
spc:'spa',
Spc:'spa',
SpD:'spd',
SDef:'spd',
SpDef:'spd',
spd:'spd',
Spe:'spe',
Spd:'spe',
spe:'spe'
};

var BattleStatNames={
hp:'HP',
atk:'Atk',
def:'Def',
spa:'SpA',
spd:'SpD',
spe:'Spe'
};
var BattleBaseSpeciesChart=["unown","burmy","shellos","gastrodon","deerling","sawsbuck","vivillon","flabebe","floette","florges","furfrou","minior","alcremie","tatsugiri","pokestarufo","pokestarbrycenman","pokestarmt","pokestarmt2","pokestartransport","pokestargiant","pokestarhumanoid","pokestarmonster","pokestarf00","pokestarf002","pokestarspirit","pokestarblackdoor","pokestarwhitedoor","pokestarblackbelt"];

var BattlePokemonIconIndexes={

egg:1032+1,
pikachubelle:1032+2,
pikachulibre:1032+3,
pikachuphd:1032+4,
pikachupopstar:1032+5,
pikachurockstar:1032+6,
pikachucosplay:1032+7,
unownexclamation:1032+8,
unownquestion:1032+9,
unownb:1032+10,
unownc:1032+11,
unownd:1032+12,
unowne:1032+13,
unownf:1032+14,
unowng:1032+15,
unownh:1032+16,
unowni:1032+17,
unownj:1032+18,
unownk:1032+19,
unownl:1032+20,
unownm:1032+21,
unownn:1032+22,
unowno:1032+23,
unownp:1032+24,
unownq:1032+25,
unownr:1032+26,
unowns:1032+27,
unownt:1032+28,
unownu:1032+29,
unownv:1032+30,
unownw:1032+31,
unownx:1032+32,
unowny:1032+33,
unownz:1032+34,
castformrainy:1032+35,
castformsnowy:1032+36,
castformsunny:1032+37,
deoxysattack:1032+38,
deoxysdefense:1032+39,
deoxysspeed:1032+40,
burmysandy:1032+41,
burmytrash:1032+42,
wormadamsandy:1032+43,
wormadamtrash:1032+44,
cherrimsunshine:1032+45,
shelloseast:1032+46,
gastrodoneast:1032+47,
rotomfan:1032+48,
rotomfrost:1032+49,
rotomheat:1032+50,
rotommow:1032+51,
rotomwash:1032+52,
giratinaorigin:1032+53,
shayminsky:1032+54,
unfezantf:1032+55,
basculinbluestriped:1032+56,
darmanitanzen:1032+57,
deerlingautumn:1032+58,
deerlingsummer:1032+59,
deerlingwinter:1032+60,
sawsbuckautumn:1032+61,
sawsbucksummer:1032+62,
sawsbuckwinter:1032+63,
frillishf:1032+64,
jellicentf:1032+65,
tornadustherian:1032+66,
thundurustherian:1032+67,
landorustherian:1032+68,
kyuremblack:1032+69,
kyuremwhite:1032+70,
keldeoresolute:1032+71,
meloettapirouette:1032+72,
vivillonarchipelago:1032+73,
vivilloncontinental:1032+74,
vivillonelegant:1032+75,
vivillonfancy:1032+76,
vivillongarden:1032+77,
vivillonhighplains:1032+78,
vivillonicysnow:1032+79,
vivillonjungle:1032+80,
vivillonmarine:1032+81,
vivillonmodern:1032+82,
vivillonmonsoon:1032+83,
vivillonocean:1032+84,
vivillonpokeball:1032+85,
vivillonpolar:1032+86,
vivillonriver:1032+87,
vivillonsandstorm:1032+88,
vivillonsavanna:1032+89,
vivillonsun:1032+90,
vivillontundra:1032+91,
pyroarf:1032+92,
flabebeblue:1032+93,
flabebeorange:1032+94,
flabebewhite:1032+95,
flabebeyellow:1032+96,
floetteblue:1032+97,
floetteeternal:1032+98,
floetteorange:1032+99,
floettewhite:1032+100,
floetteyellow:1032+101,
florgesblue:1032+102,
florgesorange:1032+103,
florgeswhite:1032+104,
florgesyellow:1032+105,
furfroudandy:1032+106,
furfroudebutante:1032+107,
furfroudiamond:1032+108,
furfrouheart:1032+109,
furfroukabuki:1032+110,
furfroulareine:1032+111,
furfroumatron:1032+112,
furfroupharaoh:1032+113,
furfroustar:1032+114,
meowsticf:1032+115,
aegislashblade:1032+116,
xerneasneutral:1032+117,
hoopaunbound:1032+118,
rattataalola:1032+119,
raticatealola:1032+120,
raichualola:1032+121,
sandshrewalola:1032+122,
sandslashalola:1032+123,
vulpixalola:1032+124,
ninetalesalola:1032+125,
diglettalola:1032+126,
dugtrioalola:1032+127,
meowthalola:1032+128,
persianalola:1032+129,
geodudealola:1032+130,
graveleralola:1032+131,
golemalola:1032+132,
grimeralola:1032+133,
mukalola:1032+134,
exeggutoralola:1032+135,
marowakalola:1032+136,
greninjaash:1032+137,
zygarde10:1032+138,
zygardecomplete:1032+139,
oricoriopompom:1032+140,
oricoriopau:1032+141,
oricoriosensu:1032+142,
lycanrocmidnight:1032+143,
wishiwashischool:1032+144,
miniormeteor:1032+145,
miniororange:1032+146,
minioryellow:1032+147,
miniorgreen:1032+148,
miniorblue:1032+149,
miniorindigo:1032+150,
miniorviolet:1032+151,
magearnaoriginal:1032+152,
pikachuoriginal:1032+153,
pikachuhoenn:1032+154,
pikachusinnoh:1032+155,
pikachuunova:1032+156,
pikachukalos:1032+157,
pikachualola:1032+158,
pikachupartner:1032+159,
lycanrocdusk:1032+160,
necrozmaduskmane:1032+161,
necrozmadawnwings:1032+162,
necrozmaultra:1032+163,
pikachustarter:1032+164,
eeveestarter:1032+165,
meowthgalar:1032+166,
ponytagalar:1032+167,
rapidashgalar:1032+168,
farfetchdgalar:1032+169,
weezinggalar:1032+170,
mrmimegalar:1032+171,
corsolagalar:1032+172,
zigzagoongalar:1032+173,
linoonegalar:1032+174,
darumakagalar:1032+175,
darmanitangalar:1032+176,
darmanitangalarzen:1032+177,
yamaskgalar:1032+178,
stunfiskgalar:1032+179,
cramorantgulping:1032+180,
cramorantgorging:1032+181,
toxtricitylowkey:1032+182,
alcremierubycream:1032+183,
alcremiematchacream:1032+184,
alcremiemintcream:1032+185,
alcremielemoncream:1032+186,
alcremiesaltedcream:1032+187,
alcremierubyswirl:1032+188,
alcremiecaramelswirl:1032+189,
alcremierainbowswirl:1032+190,
eiscuenoice:1032+191,
indeedeef:1032+192,
morpekohangry:1032+193,
zaciancrowned:1032+194,
zamazentacrowned:1032+195,
slowpokegalar:1032+196,
slowbrogalar:1032+197,
zarudedada:1032+198,
pikachuworld:1032+199,
articunogalar:1032+200,
zapdosgalar:1032+201,
moltresgalar:1032+202,
slowkinggalar:1032+203,
calyrexice:1032+204,
calyrexshadow:1032+205,
growlithehisui:1032+206,
arcaninehisui:1032+207,
voltorbhisui:1032+208,
electrodehisui:1032+209,
typhlosionhisui:1032+210,
qwilfishhisui:1032+211,
sneaselhisui:1032+212,
samurotthisui:1032+213,
lilliganthisui:1032+214,
zoruahisui:1032+215,
zoroarkhisui:1032+216,
braviaryhisui:1032+217,
sliggoohisui:1032+218,
goodrahisui:1032+219,
avalugghisui:1032+220,
decidueyehisui:1032+221,
basculegionf:1032+222,
enamorustherian:1032+223,
taurospaldeacombat:1032+224,
taurospaldeablaze:1032+225,
taurospaldeaaqua:1032+226,
wooperpaldea:1032+227,
oinkolognef:1032+228,
palafinhero:1032+229,
mausholdfour:1032+230,
tatsugiridroopy:1032+231,
tatsugiristretchy:1032+232,
squawkabillyblue:1032+233,
squawkabillyyellow:1032+234,
squawkabillywhite:1032+235,
gimmighoulroaming:1032+236,
dialgaorigin:1032+237,
palkiaorigin:1032+238,
basculinwhitestriped:1032+239,
ursalunabloodmoon:1032+240,
ogerponwellspring:1032+241,
ogerponhearthflame:1032+242,
ogerponcornerstone:1032+243,
terapagosterastal:1032+244,
terapagosstellar:1032+245,
arceusbug:1032+246,
arceusdark:1032+247,
arceusdragon:1032+248,
arceuselectric:1032+249,
arceusfairy:1032+250,
arceusfighting:1032+251,
arceusfire:1032+252,
arceusflying:1032+253,
arceusghost:1032+254,
arceusgrass:1032+255,
arceusground:1032+256,
arceusice:1032+257,
arceuspoison:1032+258,
arceuspsychic:1032+259,
arceusrock:1032+260,
arceussteel:1032+261,
arceuswater:1032+262,
genesectdouse:1032+263,
genesectshock:1032+264,
genesectburn:1032+265,
genesectchill:1032+266,
silvallybug:1032+267,
silvallydark:1032+268,
silvallydragon:1032+269,
silvallyelectric:1032+270,
silvallyfairy:1032+271,
silvallyfighting:1032+272,
silvallyfire:1032+273,
silvallyflying:1032+274,
silvallyghost:1032+275,
silvallygrass:1032+276,
silvallyground:1032+277,
silvallyice:1032+278,
silvallypoison:1032+279,
silvallypsychic:1032+280,
silvallyrock:1032+281,
silvallysteel:1032+282,
silvallywater:1032+283,

greninjabond:658,
gumshoostotem:735,
raticatealolatotem:1032+120,
marowakalolatotem:1032+136,
araquanidtotem:752,
lurantistotem:754,
salazzletotem:758,
vikavolttotem:738,
togedemarutotem:777,
mimikyutotem:778,
mimikyubustedtotem:778,
ribombeetotem:743,
kommoototem:784,
sinisteaantique:854,
polteageistantique:855,
poltchageistartisan:1012,
sinistchamasterpiece:1013,
ogerpontealtera:1017,
ogerponwellspringtera:1032+241,
ogerponhearthflametera:1032+242,
ogerponcornerstonetera:1032+243,
toxtricitylowkeygmax:1320+69,

venusaurmega:1320+0,
charizardmegax:1320+1,
charizardmegay:1320+2,
blastoisemega:1320+3,
beedrillmega:1320+4,
pidgeotmega:1320+5,
alakazammega:1320+6,
slowbromega:1320+7,
gengarmega:1320+8,
kangaskhanmega:1320+9,
pinsirmega:1320+10,
gyaradosmega:1320+11,
aerodactylmega:1320+12,
mewtwomegax:1320+13,
mewtwomegay:1320+14,
ampharosmega:1320+15,
steelixmega:1320+16,
scizormega:1320+17,
heracrossmega:1320+18,
houndoommega:1320+19,
tyranitarmega:1320+20,
sceptilemega:1320+21,
blazikenmega:1320+22,
swampertmega:1320+23,
gardevoirmega:1320+24,
sableyemega:1320+25,
mawilemega:1320+26,
aggronmega:1320+27,
medichammega:1320+28,
manectricmega:1320+29,
sharpedomega:1320+30,
cameruptmega:1320+31,
altariamega:1320+32,
banettemega:1320+33,
absolmega:1320+34,
glaliemega:1320+35,
salamencemega:1320+36,
metagrossmega:1320+37,
latiasmega:1320+38,
latiosmega:1320+39,
kyogreprimal:1320+40,
groudonprimal:1320+41,
rayquazamega:1320+42,
lopunnymega:1320+43,
garchompmega:1320+44,
lucariomega:1320+45,
abomasnowmega:1320+46,
gallademega:1320+47,
audinomega:1320+48,
dianciemega:1320+49,
charizardgmax:1320+50,
butterfreegmax:1320+51,
pikachugmax:1320+52,
meowthgmax:1320+53,
machampgmax:1320+54,
gengargmax:1320+55,
kinglergmax:1320+56,
laprasgmax:1320+57,
eeveegmax:1320+58,
snorlaxgmax:1320+59,
garbodorgmax:1320+60,
melmetalgmax:1320+61,
corviknightgmax:1320+62,
orbeetlegmax:1320+63,
drednawgmax:1320+64,
coalossalgmax:1320+65,
flapplegmax:1320+66,
appletungmax:1320+67,
sandacondagmax:1320+68,
toxtricitygmax:1320+69,
centiskorchgmax:1320+70,
hatterenegmax:1320+71,
grimmsnarlgmax:1320+72,
alcremiegmax:1320+73,
copperajahgmax:1320+74,
duraludongmax:1320+75,
eternatuseternamax:1320+76,
venusaurgmax:1320+77,
blastoisegmax:1320+78,
rillaboomgmax:1320+79,
cinderacegmax:1320+80,
inteleongmax:1320+81,
urshifugmax:1320+82,
urshifurapidstrikegmax:1320+83,

syclant:1512+0,
revenankh:1512+1,
pyroak:1512+2,
fidgit:1512+3,
stratagem:1512+4,
arghonaut:1512+5,
kitsunoh:1512+6,
cyclohm:1512+7,
colossoil:1512+8,
krilowatt:1512+9,
voodoom:1512+10,
tomohawk:1512+11,
necturna:1512+12,
mollux:1512+13,
aurumoth:1512+14,
malaconda:1512+15,
cawmodore:1512+16,
volkraken:1512+17,
plasmanta:1512+18,
naviathan:1512+19,
crucibelle:1512+20,
crucibellemega:1512+21,
kerfluffle:1512+22,
pajantom:1512+23,
jumbao:1512+24,
caribolt:1512+25,
smokomodo:1512+26,
snaelstrom:1512+27,
equilibra:1512+28,
astrolotl:1512+29,
miasmaw:1512+30,
chromera:1512+31,
venomicon:1512+32,
venomiconepilogue:1512+33,
saharaja:1512+34,
hemogoblin:1512+35,
syclar:1512+36,
embirch:1512+37,
flarelm:1512+38,
breezi:1512+39,
scratchet:1512+40,
necturine:1512+41,
cupra:1512+42,
argalis:1512+43,
brattler:1512+44,
cawdet:1512+45,
volkritter:1512+46,
snugglow:1512+47,
floatoy:1512+48,
caimanoe:1512+49,
pluffle:1512+50,
rebble:1512+51,
tactite:1512+52,
privatyke:1512+53,
nohface:1512+54,
monohm:1512+55,
duohm:1512+56,
protowatt:1512+57,
voodoll:1512+58,
mumbao:1512+59,
fawnifer:1512+60,
electrelk:1512+61,
smogecko:1512+62,
smoguana:1512+63,
swirlpool:1512+64,
coribalis:1512+65,
justyke:1512+66,
solotl:1512+67,
miasmite:1512+68,
dorsoil:1512+69,
saharascal:1512+70,
ababo:1512+71,
scattervein:1512+72,
cresceidon:1512+73,
chuggalong:1512+74,
shox:1512+75,
chuggon:1512+76,
draggalong:1512+77,
ramnarok:1512+78,
ramnarokradiant:1512+79
};
var BattlePokemonIconIndexesLeft={
pikachubelle:1404+0,
pikachupopstar:1404+1,
clefairy:1404+2,
clefable:1404+3,
jigglypuff:1404+4,
wigglytuff:1404+5,
dugtrioalola:1404+6,
poliwhirl:1404+7,
poliwrath:1404+8,
mukalola:1404+9,
kingler:1404+10,
croconaw:1404+11,
cleffa:1404+12,
igglybuff:1404+13,
politoed:1404+14,
unownb:1404+15,
unownc:1404+16,
unownd:1404+17,
unowne:1404+18,
unownf:1404+19,
unowng:1404+20,
unownh:1404+21,
unownj:1404+22,
unownk:1404+23,
unownl:1404+24,
unownm:1404+25,
unownn:1404+26,
unownp:1404+27,
unownq:1404+28,
unownquestion:1404+29,
unownr:1404+30,
unowns:1404+31,
unownt:1404+32,
unownv:1404+33,
unownz:1404+34,
sneasel:1404+35,
teddiursa:1404+36,
roselia:1404+37,
zangoose:1404+38,
seviper:1404+39,
castformsnowy:1404+40,
absolmega:1404+41,
absol:1404+42,
regirock:1404+43,
torterra:1404+44,
budew:1404+45,
roserade:1404+46,
magmortar:1404+47,
togekiss:1404+48,
rotomwash:1404+49,
shayminsky:1404+50,
emboar:1404+51,
pansear:1404+52,
simisear:1404+53,
drilbur:1404+54,
excadrill:1404+55,
sawk:1404+56,
lilligant:1404+57,
garbodor:1404+58,
solosis:1404+59,
vanilluxe:1404+60,
amoonguss:1404+61,
klink:1404+62,
klang:1404+63,
klinklang:1404+64,
litwick:1404+65,
golett:1404+66,
golurk:1404+67,
kyuremblack:1404+68,
kyuremwhite:1404+69,
kyurem:1404+70,
keldeoresolute:1404+71,
meloetta:1404+72,
greninja:1404+73,
greninjabond:1404+73,
greninjaash:1404+74,
furfroudebutante:1404+75,
barbaracle:1404+76,
clauncher:1404+77,
clawitzer:1404+78,
sylveon:1404+79,
klefki:1404+80,
zygarde:1404+81,
zygarde10:1404+82,
zygardecomplete:1404+83,
dartrix:1404+84,
steenee:1404+85,
tsareena:1404+86,
comfey:1404+87,
miniormeteor:1404+88,
minior:1404+89,
miniororange:1404+90,
minioryellow:1404+91,
miniorgreen:1404+92,
miniorblue:1404+93,
miniorviolet:1404+94,
miniorindigo:1404+95,
dhelmise:1404+96,
necrozma:1404+97,
marshadow:1404+98,
pikachuoriginal:1404+99,
pikachupartner:1404+100,
necrozmaduskmane:1404+101,
necrozmadawnwings:1404+102,
necrozmaultra:1404+103,
stakataka:1404+104,
blacephalon:1404+105
};

var BattleAvatarNumbers={
1:'lucas',
2:'dawn',
3:'youngster-gen4dp',
4:'lass-gen4dp',
5:'camper',
6:'picnicker',
7:'bugcatcher-gen4dp',
8:'aromalady',
9:'twins-gen4dp',
10:'hiker-gen4',
11:'battlegirl-gen4',
12:'fisherman-gen4',
13:'cyclist-gen4',
14:'cyclistf-gen4',
15:'blackbelt-gen4dp',
16:'artist-gen4',
17:'pokemonbreeder-gen4',
18:'pokemonbreederf-gen4',
19:'cowgirl',
20:'jogger',
21:'pokefan-gen4',
22:'pokefanf-gen4',
23:'pokekid',
24:'youngcouple-gen4dp',
25:'acetrainer-gen4dp',
26:'acetrainerf-gen4dp',
27:'waitress-gen4',
28:'veteran-gen4',
29:'ninjaboy',
30:'dragontamer',
31:'birdkeeper-gen4dp',
32:'doubleteam',
33:'richboy-gen4',
34:'lady-gen4',
35:'gentleman-gen4dp',
36:'madame-gen4dp',
37:'beauty-gen4dp',
38:'collector',
39:'policeman-gen4',
40:'pokemonranger-gen4',
41:'pokemonrangerf-gen4',
42:'scientist-gen4dp',
43:'swimmer-gen4dp',
44:'swimmerf-gen4dp',
45:'tuber',
46:'tuberf',
47:'sailor',
48:'sisandbro',
49:'ruinmaniac',
50:'psychic-gen4',
51:'psychicf-gen4',
52:'gambler',
53:'guitarist-gen4',
54:'acetrainersnow',
55:'acetrainersnowf',
56:'skier',
57:'skierf-gen4dp',
58:'roughneck-gen4',
59:'clown',
60:'worker-gen4',
61:'schoolkid-gen4dp',
62:'schoolkidf-gen4',
63:'roark',
64:'barry',
65:'byron',
66:'aaron',
67:'bertha',
68:'flint',
69:'lucian',
70:'cynthia-gen4',
71:'bellepa',
72:'rancher',
73:'mars',
74:'galacticgrunt',
75:'gardenia',
76:'crasherwake',
77:'maylene',
78:'fantina',
79:'candice',
80:'volkner',
81:'parasollady-gen4',
82:'waiter-gen4dp',
83:'interviewers',
84:'cameraman',
85:'reporter',
86:'idol',
87:'cyrus',
88:'jupiter',
89:'saturn',
90:'galacticgruntf',
91:'argenta',
92:'palmer',
93:'thorton',
94:'buck',
95:'darach-caitlin',
96:'marley',
97:'mira',
98:'cheryl',
99:'riley',
100:'dahlia',
101:'ethan',
102:'lyra',
103:'twins-gen4',
104:'lass-gen4',
105:'acetrainer-gen4',
106:'acetrainerf-gen4',
107:'juggler',
108:'sage',
109:'li',
110:'gentleman-gen4',
111:'teacher',
112:'beauty',
113:'birdkeeper',
114:'swimmer-gen4',
115:'swimmerf-gen4',
116:'kimonogirl',
117:'scientist-gen4',
118:'acetrainercouple',
119:'youngcouple',
120:'supernerd',
121:'medium',
122:'schoolkid-gen4',
123:'blackbelt-gen4',
124:'pokemaniac',
125:'firebreather',
126:'burglar',
127:'biker-gen4',
128:'skierf',
129:'boarder',
130:'rocketgrunt',
131:'rocketgruntf',
132:'archer',
133:'ariana',
134:'proton',
135:'petrel',
136:'eusine',
137:'lucas-gen4pt',
138:'dawn-gen4pt',
139:'madame-gen4',
140:'waiter-gen4',
141:'falkner',
142:'bugsy',
143:'whitney',
144:'morty',
145:'chuck',
146:'jasmine',
147:'pryce',
148:'clair',
149:'will',
150:'koga',
151:'bruno',
152:'karen',
153:'lance',
154:'brock',
155:'misty',
156:'ltsurge',
157:'erika',
158:'janine',
159:'sabrina',
160:'blaine',
161:'blue',
162:'red',
163:'red',
164:'silver',
165:'giovanni',
166:'unknownf',
167:'unknown',
168:'unknown',
169:'hilbert',
170:'hilda',
171:'youngster',
172:'lass',
173:'schoolkid',
174:'schoolkidf',
175:'smasher',
176:'linebacker',
177:'waiter',
178:'waitress',
179:'chili',
180:'cilan',
181:'cress',
182:'nurseryaide',
183:'preschoolerf',
184:'preschooler',
185:'twins',
186:'pokemonbreeder',
187:'pokemonbreederf',
188:'lenora',
189:'burgh',
190:'elesa',
191:'clay',
192:'skyla',
193:'pokemonranger',
194:'pokemonrangerf',
195:'worker',
196:'backpacker',
197:'backpackerf',
198:'fisherman',
199:'musician',
200:'dancer',
201:'harlequin',
202:'artist',
203:'baker',
204:'psychic',
205:'psychicf',
206:'cheren',
207:'bianca',
208:'plasmagrunt-gen5bw',
209:'n',
210:'richboy',
211:'lady',
212:'pilot',
213:'workerice',
214:'hoopster',
215:'scientistf',
216:'clerkf',
217:'acetrainerf',
218:'acetrainer',
219:'blackbelt',
220:'scientist',
221:'striker',
222:'brycen',
223:'iris',
224:'drayden',
225:'roughneck',
226:'janitor',
227:'pokefan',
228:'pokefanf',
229:'doctor',
230:'nurse',
231:'hooligans',
232:'battlegirl',
233:'parasollady',
234:'clerk',
235:'clerk-boss',
236:'backers',
237:'backersf',
238:'veteran',
239:'veteranf',
240:'biker',
241:'infielder',
242:'hiker',
243:'madame',
244:'gentleman',
245:'plasmagruntf-gen5bw',
246:'shauntal',
247:'marshal',
248:'grimsley',
249:'caitlin',
250:'ghetsis-gen5bw',
251:'depotagent',
252:'swimmer',
253:'swimmerf',
254:'policeman',
255:'maid',
256:'ingo',
257:'alder',
258:'cyclist',
259:'cyclistf',
260:'cynthia',
261:'emmet',
262:'hilbert-wonderlauncher',
263:'hilda-wonderlauncher',
264:'hugh',
265:'rosa',
266:'nate',
267:'colress',
268:'beauty-gen5bw2',
269:'ghetsis',
270:'plasmagrunt',
271:'plasmagruntf',
272:'iris-gen5bw2',
273:'brycenman',
274:'shadowtriad',
275:'rood',
276:'zinzolin',
277:'cheren-gen5bw2',
278:'marlon',
279:'roxie',
280:'roxanne',
281:'brawly',
282:'wattson',
283:'flannery',
284:'norman',
285:'winona',
286:'tate',
287:'liza',
288:'juan',
289:'guitarist',
290:'steven',
291:'wallace',
292:'bellelba',
293:'benga',
294:'ash',
'#bw2elesa':'elesa-gen5bw2',
'#teamrocket':'teamrocket',
'#yellow':'yellow',
'#zinnia':'zinnia',
'#clemont':'clemont',
'#wally':'wally',
breeder:'pokemonbreeder',
breederf:'pokemonbreederf',
'hilbert-dueldisk':'hilbert-wonderlauncher',
'hilda-dueldisk':'hilda-wonderlauncher',
'nate-dueldisk':'nate-wonderlauncher',
'rosa-dueldisk':'rosa-wonderlauncher',
1001:'#1001',
1002:'#1002',
1003:'#1003',
1005:'#1005',
1010:'#1010'
};var



















PureEffect=





function PureEffect(id,name){this.effectType='PureEffect';this.id=void 0;this.name=void 0;this.gen=void 0;this.exists=void 0;
this.id=id;
this.name=name;
this.gen=0;
this.exists=false;
};var

Item=

























function Item(id,name,data){this.effectType='Item';this.id=void 0;this.name=void 0;this.gen=void 0;this.exists=void 0;this.num=void 0;this.spritenum=void 0;this.desc=void 0;this.shortDesc=void 0;this.megaStone=void 0;this.megaEvolves=void 0;this.zMove=void 0;this.zMoveType=void 0;this.zMoveFrom=void 0;this.zMoveUser=void 0;this.onPlate=void 0;this.onMemory=void 0;this.onDrive=void 0;this.fling=void 0;this.naturalGift=void 0;this.isPokeball=void 0;this.itemUser=void 0;this.isFragile=void 0;this.isMildlyFragile=void 0;
if(!data||typeof data!=='object')data={};
if(data.name)name=data.name;
this.name=Dex.sanitizeName(name);
this.id=id;
this.gen=data.gen||0;
this.exists='exists'in data?!!data.exists:true;
this.num=data.num||0;
this.spritenum=data.spritenum||0;
this.desc=data.desc||data.shortDesc||'';
this.shortDesc=data.shortDesc||this.desc;
this.megaStone=data.megaStone||'';
this.megaEvolves=data.megaEvolves||'';
this.zMove=data.zMove||null;
this.zMoveType=data.zMoveType||'';
this.zMoveFrom=data.zMoveFrom||'';
this.zMoveUser=data.zMoveUser||null;
this.onPlate=data.onPlate||'';
this.onMemory=data.onMemory||'';
this.onDrive=data.onDrive||'';
this.fling=data.fling||null;
this.naturalGift=data.naturalGift||null;
this.isPokeball=!!data.isPokeball;
this.itemUser=data.itemUser;
this.isFragile=!!data.isFragile;
this.isMildlyFragile=!!data.isMildlyFragile;
this.isFragile=data.isFragile;
this.isMildlyFragile=data.isMildlyFragile;
if(!this.gen){
if(this.num>=577){this.gen=6;}else
if(this.num>=537){this.gen=5;}else
if(this.num>=377){this.gen=4;}else
{this.gen=3;}
}
};var




































































Move=






































function Move(id,name,data){var _this$maxMove;this.effectType='Move';this.id=void 0;this.name=void 0;this.gen=void 0;this.exists=void 0;this.basePower=void 0;this.accuracy=void 0;this.pp=void 0;this.type=void 0;this.category=void 0;this.priority=void 0;this.target=void 0;this.pressureTarget=void 0;this.flags=void 0;this.critRatio=void 0;this.damage=void 0;this.desc=void 0;this.shortDesc=void 0;this.isNonstandard=void 0;this.isZ=void 0;this.zMove=void 0;this.isMax=void 0;this.maxMove=void 0;this.ohko=void 0;this.recoil=void 0;this.heal=void 0;this.multihit=void 0;this.hasCrashDamage=void 0;this.basePowerCallback=void 0;this.noPPBoosts=void 0;this.status=void 0;this.secondaries=void 0;this.num=void 0;
if(!data||typeof data!=='object')data={};
if(data.name)name=data.name;
this.name=Dex.sanitizeName(name);
this.id=id;
this.gen=data.gen||0;
this.exists='exists'in data?!!data.exists:true;
this.basePower=data.basePower||0;
this.accuracy=data.accuracy||0;
this.pp=data.pp||1;
this.type=data.type||'???';
this.category=data.category||'Physical';
this.priority=data.priority||0;
this.target=data.target||'normal';
this.pressureTarget=data.pressureTarget||this.target;
this.flags=data.flags||{};
this.critRatio=data.critRatio===0?0:data.critRatio||1;
this.damage=data.damage;

this.desc=data.desc;
this.shortDesc=data.shortDesc;
this.isNonstandard=data.isNonstandard||null;
this.isZ=data.isZ||'';
this.zMove=data.zMove||{};
this.ohko=data.ohko||null;
this.recoil=data.recoil||null;
this.heal=data.heal||null;
this.multihit=data.multihit||null;
this.hasCrashDamage=data.hasCrashDamage||false;
this.basePowerCallback=!!data.basePowerCallback;
this.noPPBoosts=data.noPPBoosts||false;
this.status=data.status||'';
this.secondaries=data.secondaries||(data.secondary?[data.secondary]:null);
this.isMax=data.isMax||false;
this.maxMove=data.maxMove||{basePower:0};
if(this.category!=='Status'&&!((_this$maxMove=this.maxMove)!=null&&_this$maxMove.basePower)){
if(this.isZ||this.isMax){this.maxMove={basePower:1};}else
if(!this.basePower){this.maxMove={basePower:100};}else
if(['Fighting','Poison'].includes(this.type)){
if(this.basePower>=150){this.maxMove={basePower:100};}else
if(this.basePower>=110){this.maxMove={basePower:95};}else
if(this.basePower>=75){this.maxMove={basePower:90};}else
if(this.basePower>=65){this.maxMove={basePower:85};}else
if(this.basePower>=55){this.maxMove={basePower:80};}else
if(this.basePower>=45){this.maxMove={basePower:75};}else
{this.maxMove={basePower:70};}
}else{
if(this.basePower>=150){this.maxMove={basePower:150};}else
if(this.basePower>=110){this.maxMove={basePower:140};}else
if(this.basePower>=75){this.maxMove={basePower:130};}else
if(this.basePower>=65){this.maxMove={basePower:120};}else
if(this.basePower>=55){this.maxMove={basePower:110};}else
if(this.basePower>=45){this.maxMove={basePower:100};}else
{this.maxMove={basePower:90};}
}
}
if(this.category!=='Status'&&!this.isZ&&!this.isMax){
var basePower=this.basePower;
this.zMove={};
if(Array.isArray(this.multihit))basePower*=3;
if(!basePower){this.zMove.basePower=100;}else
if(basePower>=140){this.zMove.basePower=200;}else
if(basePower>=130){this.zMove.basePower=195;}else
if(basePower>=120){this.zMove.basePower=190;}else
if(basePower>=110){this.zMove.basePower=185;}else
if(basePower>=100){this.zMove.basePower=180;}else
if(basePower>=90){this.zMove.basePower=175;}else
if(basePower>=80){this.zMove.basePower=160;}else
if(basePower>=70){this.zMove.basePower=140;}else
if(basePower>=60){this.zMove.basePower=120;}else
{this.zMove.basePower=100;}
if(data.zMove)this.zMove.basePower=data.zMove.basePower;
}
this.num=data.num||0;
if(!this.gen){
if(this.num>=743){this.gen=8;}else
if(this.num>=622){this.gen=7;}else
if(this.num>=560){this.gen=6;}else
if(this.num>=468){this.gen=5;}else
if(this.num>=355){this.gen=4;}else
if(this.num>=252){this.gen=3;}else
if(this.num>=166){this.gen=2;}else
if(this.num>=1){this.gen=1;}
}
};var



















Flag=







function Flag(id,name,data){this.effectType='Flag';this.id=void 0;this.name=void 0;this.gen=void 0;this.exists=void 0;this.desc=void 0;this.shortDesc=void 0;
if(!data||typeof data!=='string')data={};
if(data.name)name=data.name;
this.name=Dex.sanitizeName(name);
this.id=id;
this.gen=data.gen||0;
this.exists='exists'in data?!!data.exists:true;
this.desc=data.desc;
this.shortDesc=data.shortDesc;
};var
Ability=












function Ability(id,name,data){this.effectType='Ability';this.id=void 0;this.name=void 0;this.gen=void 0;this.exists=void 0;this.num=void 0;this.shortDesc=void 0;this.desc=void 0;this.rating=void 0;this.flags=void 0;this.isNonstandard=void 0;
if(!data||typeof data!=='object')data={};
if(data.name)name=data.name;
this.name=Dex.sanitizeName(name);
this.id=id;
this.gen=data.gen||0;
this.exists='exists'in data?!!data.exists:true;
this.num=data.num||0;
this.shortDesc=data.shortDesc||data.desc||'';
this.desc=data.desc||data.shortDesc||'';
this.rating=data.rating||1;
this.flags=data.flags||{};
this.isNonstandard=!!data.isNonstandard;
if(!this.gen){
if(this.num>=234){this.gen=8;}else
if(this.num>=192){this.gen=7;}else
if(this.num>=165){this.gen=6;}else
if(this.num>=124){this.gen=5;}else
if(this.num>=77){this.gen=4;}else
if(this.num>=1){this.gen=3;}
}
};var

Species=

















































function Species(id,name,data){this.effectType='Species';this.id=void 0;this.name=void 0;this.gen=void 0;this.exists=void 0;this.baseSpecies=void 0;this.forme=void 0;this.formeid=void 0;this.spriteid=void 0;this.baseForme=void 0;this.num=void 0;this.types=void 0;this.abilities=void 0;this.baseStats=void 0;this.bst=void 0;this.weightkg=void 0;this.heightm=void 0;this.gender=void 0;this.color=void 0;this.genderRatio=void 0;this.eggGroups=void 0;this.tags=void 0;this.otherFormes=void 0;this.cosmeticFormes=void 0;this.evos=void 0;this.prevo=void 0;this.evoType=void 0;this.evoLevel=void 0;this.evoMove=void 0;this.evoItem=void 0;this.evoCondition=void 0;this.nfe=void 0;this.requiredItems=void 0;this.tier=void 0;this.isTotem=void 0;this.isMega=void 0;this.isPrimal=void 0;this.canGigantamax=void 0;this.cannotDynamax=void 0;this.requiredTeraType=void 0;this.battleOnly=void 0;this.isNonstandard=void 0;this.unreleasedHidden=void 0;this.changesFrom=void 0;
if(!data||typeof data!=='object')data={};
if(data.name)name=data.name;
this.name=Dex.sanitizeName(name);
this.id=id;
this.gen=data.gen||0;
this.exists='exists'in data?!!data.exists:true;
this.baseSpecies=data.baseSpecies||name;
this.forme=data.forme||'';
var baseId=toID(this.baseSpecies);
this.formeid=baseId===this.id?'':'-'+toID(this.forme);
this.spriteid=baseId+this.formeid;
if(this.spriteid.endsWith('totem'))this.spriteid=this.spriteid.slice(0,-5);
if(this.spriteid==='greninja-bond')this.spriteid='greninja';
if(this.spriteid==='rockruff-dusk')this.spriteid='rockruff';
if(this.spriteid.endsWith('-'))this.spriteid=this.spriteid.slice(0,-1);
this.baseForme=data.baseForme||'';
this.num=data.num||0;
this.types=data.types||['???'];
this.abilities=data.abilities||{0:"No Ability"};
this.baseStats=data.baseStats||{hp:0,atk:0,def:0,spa:0,spd:0,spe:0};
this.bst=this.baseStats.hp+this.baseStats.atk+this.baseStats.def+this.baseStats.spa+this.baseStats.spd+this.baseStats.spe;
this.weightkg=data.weightkg||0;
this.heightm=data.heightm||0;
this.gender=data.gender||'';
this.color=data.color||'';
this.genderRatio=data.genderRatio||null;
this.eggGroups=data.eggGroups||[];
this.tags=data.tags||[];
this.otherFormes=data.otherFormes||null;
this.cosmeticFormes=data.cosmeticFormes||null;
this.evos=data.evos||null;
this.prevo=data.prevo||'';
this.evoType=data.evoType||'';
this.evoLevel=data.evoLevel||0;
this.evoMove=data.evoMove||'';
this.evoItem=data.evoItem||'';
this.evoCondition=data.evoCondition||'';
this.nfe=data.nfe||false;
this.requiredItems=data.requiredItems||(data.requiredItem?[data.requiredItem]:[]);
this.tier=data.tier||'';
this.isTotem=false;
this.isMega=!!(this.forme&&['-mega','-megax','-megay'].includes(this.formeid));
this.isPrimal=!!(this.forme&&this.formeid==='-primal');
this.canGigantamax=!!data.canGigantamax;
this.cannotDynamax=!!data.cannotDynamax;
this.requiredTeraType=data.requiredTeraType||'';
this.battleOnly=data.battleOnly||(this.isMega?this.baseSpecies:undefined);
this.isNonstandard=data.isNonstandard||null;
this.unreleasedHidden=data.unreleasedHidden||false;
this.changesFrom=data.changesFrom||(
this.battleOnly!==this.baseSpecies?this.battleOnly:this.baseSpecies);
if(!this.gen){
if(this.num>=906||this.formeid.startsWith('-paldea')){this.gen=9;}else
if(this.num>=810||this.formeid.startsWith('-galar')||this.formeid.startsWith('-hisui')){this.gen=8;}else
if(this.num>=722||this.formeid==='-alola'||this.formeid==='-starter'){this.gen=7;}else
if(this.isMega||this.isPrimal){
this.gen=6;
this.battleOnly=this.baseSpecies;
}else
if(this.formeid==='-totem'||this.formeid==='-alolatotem'){
this.gen=7;
this.isTotem=true;
}else
if(this.num>=650){this.gen=6;}else
if(this.num>=494){this.gen=5;}else
if(this.num>=387){this.gen=4;}else
if(this.num>=252){this.gen=3;}else
if(this.num>=152){this.gen=2;}else
if(this.num>=1){this.gen=1;}
}
};








if(typeof require==='function'){

global.BattleBaseSpeciesChart=BattleBaseSpeciesChart;
global.BattleNatures=BattleNatures;
global.PureEffect=PureEffect;
global.Species=Species;
global.Ability=Ability;
global.Item=Item;
global.Move=Move;
}
"use strict";/**
 * Battle log
 *
 * An exercise in minimalism! This is a dependency of the client, which
 * requires IE9+ and uses Preact, and the replay player, which requires
 * IE7+ and uses jQuery. Therefore, this has to be compatible with IE7+
 * and use the DOM directly!
 *
 * Special thanks to PPK for QuirksMode.org, one of the few resources
 * available for how to do web development in these conditions.
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */var


















BattleLog=function(){

























function BattleLog(elem,scene,innerElem){var _this=this;this.elem=void 0;this.innerElem=void 0;this.scene=null;this.preemptElem=null;this.atBottom=true;this.skippedLines=false;this.className=void 0;this.battleParser=null;this.joinLeave=null;this.lastRename=null;this.perspective=-1;this.getHighlight=null;this.
























onClick=function(ev){
var target=ev.target;
while(target&&target!==_this.elem){
if(target.tagName==='SUMMARY'){var _window$getSelection;
if((window.getSelection==null||(_window$getSelection=window.getSelection())==null?void 0:_window$getSelection.type)==='Range'){


ev.preventDefault();
}else{
setTimeout(_this.updateScroll,0);
}
}
target=target.parentElement;
}
};this.
onScroll=function(){
var distanceFromBottom=_this.elem.scrollHeight-_this.elem.scrollTop-_this.elem.clientHeight;
_this.atBottom=distanceFromBottom<30;
};this.






















































































































































































































































































































































































































































































































































































































































































































































































































































































updateScroll=function(){
if(_this.atBottom){
_this.elem.scrollTop=_this.elem.scrollHeight;
}
};this.elem=elem;if(!innerElem){elem.setAttribute('role','log');elem.innerHTML='';innerElem=document.createElement('div');innerElem.className='inner message-log';elem.appendChild(innerElem);}this.innerElem=innerElem;if(scene){this.scene=scene;var preemptElem=document.createElement('div');preemptElem.className='inner-preempt message-log';elem.appendChild(preemptElem);this.preemptElem=preemptElem;this.battleParser=new BattleTextParser();}this.className=elem.className;elem.onscroll=this.onScroll;elem.onclick=this.onClick;}var _proto=BattleLog.prototype;_proto.reset=function reset(){this.innerElem.innerHTML='';this.atBottom=true;this.skippedLines=false;};_proto.destroy=function destroy(){this.elem.onscroll=null;this.elem.innerHTML='';};_proto.addSeekEarlierButton=function addSeekEarlierButton(){var _this2=this;if(this.skippedLines)return;this.skippedLines=true;var el=document.createElement('div');el.className='chat';el.innerHTML='<button class="button earlier-button"><i class="fa fa-caret-up" aria-hidden="true"></i><br />Earlier messages</button>';var button=el.getElementsByTagName('button')[0];button==null||button.addEventListener==null||button.addEventListener('click',function(e){var _this2$scene;e.preventDefault();(_this2$scene=_this2.scene)==null||_this2$scene.battle.seekTurn(_this2.scene.battle.turn-100);});this.addNode(el);};_proto.add=function add(args,kwArgs,preempt,showTimestamps){var _this$scene,_window$app2,_window$PS2,_window$app3,_this$getHighlight,_this$scene2,_window$app5;if(kwArgs!=null&&kwArgs.silent)return;var battle=(_this$scene=this.scene)==null?void 0:_this$scene.battle;if(battle!=null&&battle.seeking){if(battle.stepQueue.length>2000){if(battle.seeking===Infinity?battle.currentStep<battle.stepQueue.length-2000:battle.turn<battle.seeking-100){this.addSeekEarlierButton();return;}}}var divClass='chat';var divHTML='';var noNotify;if(!['name','n'].includes(args[0]))this.lastRename=null;switch(args[0]){case'chat':case'c':case'c:':var name;var message;var timestamp=0;if(args[0]==='c:'){timestamp=parseInt(args[1]);name=args[2];message=args[3];}else{name=args[1];message=args[2];}var rank=name.charAt(0);if(battle!=null&&battle.ignoreSpects&&' +'.includes(rank))return;if(battle!=null&&battle.ignoreOpponent){var _window$app,_window$PS;if("\u2605\u2606".includes(rank)&&toUserid(name)!==(((_window$app=window.app)==null||(_window$app=_window$app.user)==null?void 0:_window$app.get('userid'))||((_window$PS=window.PS)==null||(_window$PS=_window$PS.user)==null?void 0:_window$PS.userid))){return;}}var ignoreList=((_window$app2=window.app)==null?void 0:_window$app2.ignore)||((_window$PS2=window.PS)==null||(_window$PS2=_window$PS2.prefs)==null?void 0:_window$PS2.ignore);if(ignoreList!=null&&ignoreList[toUserid(name)]&&" +^\u2605\u2606".includes(rank))return;var timestampHtml='';if(showTimestamps){var date=timestamp&&!isNaN(timestamp)?new Date(timestamp*1000):new Date();var components=[date.getHours(),date.getMinutes()];if(showTimestamps==='seconds'){components.push(date.getSeconds());}timestampHtml="<small class=\"gray\">["+components.map(function(x){return x<10?"0"+x:x;}).join(':')+"] </small>";}var isHighlighted=((_window$app3=window.app)==null||(_window$app3=_window$app3.rooms)==null?void 0:_window$app3[battle.roomid].getHighlight(message))||((_this$getHighlight=this.getHighlight)==null?void 0:_this$getHighlight.call(this,args));var _this$parseChatMessag=this.parseChatMessage(message,name,timestampHtml,isHighlighted);divClass=_this$parseChatMessag[0];divHTML=_this$parseChatMessag[1];noNotify=_this$parseChatMessag[2];if(!noNotify&&isHighlighted){var _window$app4;var notifyTitle="Mentioned by "+name+" in "+((battle==null?void 0:battle.roomid)||'');(_window$app4=window.app)==null||(_window$app4=_window$app4.rooms[(battle==null?void 0:battle.roomid)||''])==null||_window$app4.notifyOnce(notifyTitle,"\""+message+"\"",'highlight');}break;case'join':case'j':case'leave':case'l':{var user=BattleTextParser.parseNameParts(args[1]);if(battle!=null&&battle.ignoreSpects&&' +'.includes(user.group))return;var formattedUser=user.group+user.name;var isJoin=args[0].startsWith('j');if(!this.joinLeave){this.joinLeave={joins:[],leaves:[],element:document.createElement('div')};this.joinLeave.element.className='chat';}if(isJoin&&this.joinLeave.leaves.includes(formattedUser)){this.joinLeave.leaves.splice(this.joinLeave.leaves.indexOf(formattedUser),1);}else{this.joinLeave[isJoin?"joins":"leaves"].push(formattedUser);}var buf='';if(this.joinLeave.joins.length){buf+=this.textList(this.joinLeave.joins)+" joined";}if(this.joinLeave.leaves.length){if(this.joinLeave.joins.length)buf+="; ";buf+=this.textList(this.joinLeave.leaves)+" left";}this.joinLeave.element.innerHTML="<small>"+BattleLog.escapeHTML(buf)+"</small>";(preempt?this.preemptElem:this.innerElem).appendChild(this.joinLeave.element);return;}case'name':case'n':{var _user=BattleTextParser.parseNameParts(args[1]);if(toID(args[2])===toID(_user.name))return;if(!this.lastRename||toID(this.lastRename.to)!==toID(_user.name)){this.lastRename={from:args[2],to:'',element:document.createElement('div')};this.lastRename.element.className='chat';}this.lastRename.to=_user.group+_user.name;this.lastRename.element.innerHTML="<small>"+BattleLog.escapeHTML(this.lastRename.to)+" renamed from "+BattleLog.escapeHTML(this.lastRename.from)+".</small>";(preempt?this.preemptElem:this.innerElem).appendChild(this.lastRename.element);return;}case'chatmsg':case'':divHTML=BattleLog.escapeHTML(args[1]);break;case'chatmsg-raw':case'raw':case'html':divHTML=BattleLog.sanitizeHTML(args[1]);break;case'uhtml':case'uhtmlchange':this.changeUhtml(args[1],args[2],args[0]==='uhtml');return['',''];case'error':case'inactive':case'inactiveoff':divClass='chat message-error';divHTML=BattleLog.escapeHTML(args[1]);break;case'bigerror':this.message('<div class="broadcast-red">'+BattleLog.escapeHTML(args[1]).replace(/\|/g,'<br />')+'</div>');return;case'pm':divHTML="<strong data-href=\"user-"+BattleLog.escapeHTML(args[1])+"\"> "+BattleLog.escapeHTML(args[1])+":</strong> <span class=\"message-pm\"><i style=\"cursor:pointer\" data-href=\"user-"+BattleLog.escapeHTML(args[1],true)+"\">(Private to "+BattleLog.escapeHTML(args[2])+")</i> "+BattleLog.parseMessage(args[3])+" </span>";break;case'askreg':this.addDiv('chat','<div class="broadcast-blue"><b>Register an account to protect your ladder rating!</b><br /><button name="register" value="'+BattleLog.escapeHTML(args[1])+'"><b>Register</b></button></div>');return;case'unlink':{var _window$PS3,_window$Dex;if((_window$PS3=window.PS)!=null&&(_window$PS3=_window$PS3.prefs)!=null&&_window$PS3.nounlink||(_window$Dex=window.Dex)!=null&&(_window$Dex=_window$Dex.prefs)!=null&&_window$Dex.nounlink)return;var _user2=toID(args[2])||toID(args[1]);this.unlinkChatFrom(_user2);if(args[2]){var lineCount=parseInt(args[3],10);this.hideChatFrom(_user2,true,lineCount);}return;}case'hidelines':{var _window$PS4,_window$Dex2;if((_window$PS4=window.PS)!=null&&(_window$PS4=_window$PS4.prefs)!=null&&_window$PS4.nounlink||(_window$Dex2=window.Dex)!=null&&(_window$Dex2=_window$Dex2.prefs)!=null&&_window$Dex2.nounlink)return;var _user3=toID(args[2]);this.unlinkChatFrom(_user3);if(args[1]!=='unlink'){var _lineCount=parseInt(args[3],10);this.hideChatFrom(_user3,args[1]==='hide',_lineCount);}return;}case'debug':divClass='debug';divHTML='<div class="chat"><small style="color:#999">[DEBUG] '+BattleLog.escapeHTML(args[1])+'.</small></div>';break;case'notify':var title=args[1];var body=args[2];var roomid=(_this$scene2=this.scene)==null?void 0:_this$scene2.battle.roomid;if(!roomid)break;(_window$app5=window.app)==null||_window$app5.rooms[roomid].notifyOnce(title,body,'highlight');break;case'showteam':{if(!battle)return;var team=Teams.unpack(args[2]);if(!team.length)return;var side=battle.getSide(args[1]);var exportedTeam=team.map(function(set){var buf=Teams["export"]([set],battle.dex).replace(/\n/g,'<br />');if(set.name&&set.name!==set.species){buf=buf.replace(set.name,BattleLog.sanitizeHTML("<span class=\"picon\" style=\""+Dex.getPokemonIcon(set.species)+"\"></span><br />"+set.name));}else{buf=buf.replace(set.species,"<span class=\"picon\" style=\""+Dex.getPokemonIcon(set.species)+"\"></span><br />"+set.species);}if(set.item){buf=buf.replace(set.item,set.item+" <span class=\"itemicon\" style=\""+Dex.getItemIcon(set.item)+"\"></span>");}return buf;}).join('');divHTML="<div class=\"infobox\"><details class=\"details\"><summary>Open team sheet for "+side.name+"</summary>"+exportedTeam+"</details></div>";break;}case'seed':case'choice':case':':case'timer':case't:':case'J':case'L':case'N':case'spectator':case'spectatorleave':case'initdone':return;default:this.addBattleMessage(args,kwArgs);this.joinLeave=null;return;}if(divHTML){this.addDiv(divClass,divHTML,preempt);this.joinLeave=null;}};_proto.addBattleMessage=function addBattleMessage(args,kwArgs){var _this$battleParser$pa,_this$battleParser;switch(args[0]){case'warning':this.message('<strong>Warning:</strong> '+BattleLog.escapeHTML(args[1]));this.message("Bug? Report it to <a href=\"http://www.smogon.com/forums/showthread.php?t=3453192\">the replay viewer's Smogon thread</a>");if(this.scene)this.scene.wait(1000);return;case'variation':this.addDiv('','<small>Variation: <em>'+BattleLog.escapeHTML(args[1])+'</em></small>');break;case'rule':var ruleArgs=args[1].split(': ');this.addDiv('','<small><em>'+BattleLog.escapeHTML(ruleArgs[0])+(ruleArgs[1]?':':'')+'</em> '+BattleLog.escapeHTML(ruleArgs[1]||'')+'</small>');break;case'rated':this.addDiv('rated','<strong>'+(BattleLog.escapeHTML(args[1])||'Rated battle')+'</strong>');break;case'tier':this.addDiv('','<small>Format:</small> <br /><strong>'+BattleLog.escapeHTML(args[1])+'</strong>');break;case'turn':var h2elem=document.createElement('h2');h2elem.className='battle-history';var turnMessage;if(this.battleParser){turnMessage=this.battleParser.parseArgs(args,{}).trim();if(!turnMessage.startsWith('==')||!turnMessage.endsWith('==')){throw new Error("Turn message must be a heading.");}turnMessage=turnMessage.slice(2,-2).trim();this.battleParser.curLineSection='break';}else{turnMessage="Turn "+args[1];}h2elem.innerHTML=BattleLog.escapeHTML(turnMessage);this.addSpacer();this.addNode(h2elem);break;default:if(this.addAFDMessage(args,kwArgs))return;var line=(_this$battleParser$pa=(_this$battleParser=this.battleParser)==null?void 0:_this$battleParser.parseArgs(args,kwArgs||{},true))!=null?_this$battleParser$pa:null;if(line===null){this.addDiv('chat message-error','Unrecognized: |'+BattleLog.escapeHTML(args.join('|')));return;}if(line)this.messageFromLog(line);break;}};_proto.addAFDMessage=function addAFDMessage(args){var _this3=this;var kwArgs=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};if(!Dex.afdMode)return;if(!this.battleParser||!this.scene)return;var messageFromArgs=function(args1){var kwArgs1=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};_this3.messageFromLog(_this3.battleParser.parseArgs(args1,kwArgs1,true));};if(args[0]==='move'){if(kwArgs.from)return false;var moveid=toID(args[2]);if(moveid==='taunt'){messageFromArgs(args,kwArgs);var quotes=["Yo mama so fat, she 4x resists Ice- and Fire-type attacks!","Yo mama so ugly, Captivate raises her opponent's Special Attack!","Yo mama so dumb, she lowers her Special Attack when she uses Nasty Plot!","Yo mama so fat, she eats her Aguav Berry at 50% HP!","Yo Mama so stupid, she tried to count clouds one through eight!","Yo Mama so stupid, she thought Sticky Hold meant she needed to grab a stick!","Yo Mama so old, her Paradox forme would be Great Grandma!","Yo Mama so stupid, she can't learn anything from the move tutor!","Yo Mama so rude, she got Kyogre and Groudon to team up against her!","Yo Mama so fat, Focus Blast never misses her!","Yo Mama so fat, the Darkest Day is when she's tanning!","Yo Mama so stinky, her damaging moves have a 10% chance to make the opponent flinch!","Yo Mama so old, she has the NPCs from Legends Arceus in her yearbook!","Yo Mama so stupid, she's still trying to find Rhydon!","Yo Mama so stupid, she asked if the Insect Plate comes with an appetizer!","Yo Mama so bad, she got her Stunfisk paralyzed!","Yo Mama so nasty, Black Sludge heals her 1/16th!","Yo Mama so stupid, she gave her Bisharp Black Sludge!","Yo Mama so stupid, she runs a suboptimal EV spread on her Tera Poison Calm Mind Chimecho, making it faint to a Choice Banded Dragonite Tera Normal Extreme Speed!","Yo Mama so casual, she mains NatDex AG!","Yo Mama so casual, she ladders with Red's team!","Yo Mama so dumb, she scouts teams in Randbats!","Yo Mama so lazy, she loafs around every turn!","Yo Mama so fat, she changes type when holding a Dinner Plate!","Yo Mama so slow, even Trick Room won't let her go first!","Yo Mama so dumb, not even Gummis can raise her IQ!","Show me your moves!","Yo Mama so nasty, thinking about her gives a +2 Special Attack boost!","Yo Mama so broke, her deck has no energy cards so she can save on electricity!","Yo Mama so dumb, she tried using Twitch Plays Pokemon as a walkthrough guide!","Yo Mama so dumb, Slowpoke finishes her sentences!","Yo Mama so old, she babysat AZ!","Yo Mama so stupid, not even Own Tempo could prevent her from being confused!","Yo Mama so ugly, even Brock wanted nothing to do with her!","Yo Mama so stupid, she drank antifreeze to cure her status condition!","Yo Mama so trashy, they named a Wormadam forme after her!","Yo Mama so broke, her Gholdengo is made out of checkers!","Yo Mama so ugly, she killed Mimikyu when it saw her!","Yo Mama so fat, she doesn't need a Wailord to meet the Regis!","Unfortunate doesn't even begin to describe Yo Mama!","Yo Mama so dumb, she brags about using a bot to get her opponent's teams!","Yo Mama so fat, her Wishes cause integer overflows!","Yo Mama so ugly, she makes Attract fail!","Yo Mama so dumb, she makes Dondozo look aware!","Yo Mama so smelly, she KOes Nosepass without making a single move!","Yo mama so fat, she doesn't know what the item Leftovers is!","Yo Mama so ugly, she gets OHKOed by Mirror Shot!","Yo Mama so smelly, her VGC analysis pairs her with Slaking!","Yo Mama so old, she has to be extracted in Cinnabar Lab!","Yo Mama so fat, she sets Gravity on switch-in!","Yo Mama so dumb, she's immune to this move!"];var battle=this.scene.battle;var quote=quotes[((battle.p1.name.charCodeAt(2)||0)+(battle.p2.name.charCodeAt(2)||0)*19+(battle.p1.name.charCodeAt(3)||0)*61+(battle.p2.name.charCodeAt(3)||0)+battle.turn+(args[1].charCodeAt(1)||0)*109+(args[1].charCodeAt(2)||0)*113)%quotes.length];this.messageFromLog(this.battleParser.fixLowercase(this.battleParser.pokemon(args[1])+" said, \""+quote+"\""));this.scene.wait(3*this.scene.battle.messageFadeTime/this.scene.acceleration);return true;}}else if(args[0]==='-prepare'){var _moveid=toID(args[2]);if(_moveid==='chillyreception'){var dadJokes=["This should be a Fire-type move, because I'm spitting flames.","Why didn't Vigoroth evolve? Because it was Slaking on its training!","I'm going snowwhere fast!","Don't Slack Off if you wanna beat me!","Where do you buy toys for a Ground-type? Land-R-Us!","I've got half a mind to just leave. The other half belongs to my Shellder.","Why did the Slowking cross the road?","What's the best Pokemon to get rid of bugs? Flygone!","What's the best Pokemon to get rid of bugs? Heatmor. What, were you expecting a pun?","I guess you could call Heatmor an Ant-heater.","Why do they call it Enamor-us when you can only have one of them on a team?","Cloyster? I hardly know 'er!","Why do they call Shedinja invincible when I can still see it?","Dondozo? I don't think I can, that seems really cumbersome.","Appletun? No, there's only one of them.","Drilbur? I hardly know 'er!","Iron Crown? I hardly know 'er!","Shellder? I hardly know 'er!","Magnemite? I sure hope it will!","Graveler? I hardly know 'er!","Grimer? I hardly know 'er!","Baxcalibur? I hardly know 'er!","Why do they call it Kyurem when it doesn't heal anybody?","Conkeldurr? I hardly know 'er!","Weavile? No, I don't think we are.","Dragapult? Doesn't seem very efficient, don't they usually have wheels?","Dragonite? Sounds like it'd be hard with all that heavy armor.","How do you play whack-a-mole with a Fighting-type? Hit 'm on top!","I don't know who made Pokemon Go, but I'm trying to figure out how to make them Pokemon Go to the polls!","Gholdengo? Yeah, it should gholden-go somewhere else.","Some folks call me Charming, but I still feel like I take plenty of physical damage. What gives?","I learned this move in South America, they called it a Chile Reception","I had a Canadian Tyrogue. It evolved into a Hitmontreal.","Why do Venusaur's roommates wear earplugs at night? Because Venus-snores!","I bought stock in my Charmander before it evolved. Now I'm a Charmeleonaire!","Charizard? I actually think char is pretty easy!","Why doesn't Squirtle's mom buy it action figures? Because it likes to blast toys!","Why does Caterpie like Margarine so much? Because it's butter-free!","What did the Alolan Raichu say to the surfer? Nothing, it just waved!","Clefable? What's Clef able to do?","Why did the Nidorans start a revolution? Because they didn't Nidoking!","Alolan Ninetales? More like Aurora Nine-veils!","Wigglytuff? Doesn't look that tough to me.","I dug up a weird vegetable yesterday. Well, it wasn't THAT weird, just a little Oddish!","Why was the Vileplume so happy? Because it wasn't Gloom-y anymore!","What do you call three guys named Doug? A Dugtrio!","Why is it called Golduck when it's blue?","What Rock-type is the best at soccer? Goal-em!","Why is Galarian Slowbro so good at art? Because it's Quick on the Draw!","Do you like my jokes? I've got a Magne-ton of them!","Where do three-headed birds go for Carnival? Dodrio de Janeiro!","What would Muk be called if it could rap? Slime Shady!","Kingler? I hardly know 'er!","Exeggutor? I hardly know 'er!","Have you heard that Trainers who use Hypno are hip? No?","What do ghosts build at Christmastime? Gengar-bread houses!","What street does Voltorb live on? Elect Road!","I told a Hitmonlee some of my jokes. He really got a kick out of them!","What's a Hitmonchan's favorite holiday? Boxing Day!","Did you know Galarian Weezing doesn't know how to drive? It always puts the car in Neutral before stepping on the Gas!","How can you tell if a Poison-type has asthma? See if it's Weezing!","What Pokémon loves to find you when you hide? Seaking!","If we Psychic-types made a movie, it would have to Starmie!","Scyther? I hardly know 'er!","Pinsir? I hardly know 'er!","What Pokémon does Aladdin ride? A Magikarpet!","What do you get if you cut a Gyarados in half? Gyara-uno!","What do you call a Lapras carrying a gun? The Glock Ness Monster!","What's a Ditto's favorite food? Impasta!","Flareon? They should turn the flare off!","Where does a 1000-pound Snorlax sleep? Anywhere it wants!","Zapdos? Zap those what?","My Grass-type friend has been losing weight recently. It's nice to see them losing a few pounds, but I hate to see Me-gaining-'em!","What does a Fire-type wear around its neck? A Tie-phlosion!","Why do they call Ledian the Five Star Pokémon? I'd give it two stars at best!","Ariados? That's impressive, most people can't even perform one aria.","Crobat? It doesn't look like a crow at all!","Why do web developers hire Xatu to predict their profits? Because it can see their Future Sites!","What superhero lives under the sea and has Volt Absorb? The Green Lanturn!","Why should you never play cards with the Cottonweed Pokémon? Because it always Jump-bluffs!","What Pokémon comes after Espeon? T-peon!","Why did the Kartana faint to Bullet Punch? Because Scizor beats paper!","Sometimes I put lava in my gas tank. It really makes Magcargo!","I wrote my Ice-type friend a letter. I hope it gets Delibird!","What's a Mantine's favorite type of cheese? Mantaray Jack!","What kind of bird is Skarmory? A Roost-er!","My friend caught a Porygon. I also did, but he got jealous when I told him I caught a Porygon too!","What do you name a Smeargle that can't use Sketch anymore? Drew!","Why couldn't the smart Chansey evolve? Because ignorance is Blissey!","The classic Suicune set has a Water move, Calm Mind, and Sleep Talk. That's only 3 moves, but I'm sure you can figure out the Rest!","I went to one of Lugia's parties once. It was an Aero-blast!","What do pseudo-Legendaries pave their roads with? Tyrani-tar!","What's Ho-Oh's favorite food? Hot wings!","How often does Celebi travel? From time to time!","What's on a Grass-type's bathroom floor? Scep-tiles!","What's Blaziken's favorite food? Fried chicken!","Why doesn't Swampert go outside? Because it can't touch grass!","How do I know my jokes are good? I told them to a Mightyena and it couldn't stop laughing!","What kind of Poké Ball do you catch Dustox in? A mothball!","Who are Shiftry's biggest fans? Its hands!","Why was the evolving Surskit brought before a court? It was Masqu-arraigned!","Gardevoir? What's a voir and why should I guard it?","I moved in with a Breloom, but the apartment didn't have mushroom!","What's a Hariyama's favorite Pokémon games? Ultra SuMo!","I took my Delcatty to the vet because I thought it was going blind, but it had Normal-eyes!","What's Sableye's zodiac sign? Gem-in-eye!","What do you call a Medicham that's lost its pants? Yogi Bare!","Why does Aggron plant trees after a disaster? That's part of its Aggro-culture!","What happened when the Plusle and Minun fell in love? They multiplied!","I once rode on a Wailord's back. It was a whale of a time!","That Anger Point Camerupt sure has a temper. Crit it once and it'll blow its top!","What season does Spoink like the best? Spring!","I'd tell you a joke about Grumpig, but you wouldn't appreciate it. I'd be casting pearls before swine!","It takes a human 5 minutes to walk a block, but for Spinda it takes half an hour. The difference is staggering!","That cloud Pokémon acts innocent, but I know it has an Altaria motive!","Zangoose? It doesn't look like a goose at all!","What are Solrock's favorite music genres? Soul and rock!","They hate on you when you're a Barboach, but everyone wants to be your friend when you pull up Whis-cash!","What does a Lileep get from Dairy Queen? A Cra-Dilly Bar!","I know a way you can see invisible Kecleons, but that's beyond the Scope of this joke!","What does a Tropius wear over its shirt? A Har-vest!","Why is it called Walrein if it's better in snow?","I've always been a fan of ball-shaped Pokémon, but one in particular Sphealed the deal!","I'd make a joke about Luvdisc, but it's already a joke!","Why is the Iron Leg Pokémon always covered in dirt and slime? Because it's Meta-gross!","Why is Regirock called the Rock Peak Pokémon when it's so mid?","Why is Clear Body Regice such a bad liar? Because you can see right through it!","Why was Registeel fired from the convenience store? Because it would always Steel from the Regi-ster!","I'd make a joke about Latias, but that would be just plane silly!","Did you know that Rayquaza has a certain smell that it takes wherever it goes? That's right, it's Draggin' A-scent!","Did you hear about the Deoxys who took a DNA test? It got 100%!","What would the tier leader of OU be called if he was a Jirachi? Flinchinator!","I had a company that sold Infernapes, until I was told to cut out the monkey business!","Kricketunes must be my biggest fans. Every time I tell a joke, they're all I hear!","What kind of Poké Ball is best for Luxray? A Luxuray Ball!","Where does Bastiodon make all its money? Wall Street!","What kind of mystery novels does Wormadam like to read? Cloak and dagger!","Remember when Pachirisu won the World Championships? That was nuts!","Cherrim? I hardly know 'im!","Mothim? I hardly know 'im!","I used to buy Drifblim by the dozen, but we got hit with inflation and the price ballooned!","I took directions from a Mismagius, but now I don't know witch way to go!","Someone asked me if I liked Chingling. I said that I don't know, I've never chingled!","What do you do with a Bronzong you're in love with? Give it a ring!","People say they removed Chatot's sound-recording function because of profanity, but I think that's just mindless Chatter!","I have 108 jokes about Spiritomb, but not a single soul wants to hear them!","My Garchomp friend gained a lot of weight recently. He said it was pretty rough to look at the scales!","Why does Carnivine get Levitate? Because it's a Venus flying trap!","Why did Weavile drive a truck with six wheels? Because it had Triple Axles!","I got yelled at by a Lickilicky once. Talk about a tongue-lashing!","Why do they call Yanmega a dragonfly when it isn't Dragon/Flying?","My local arcade had to kick out this Ground/Flying type. He kept getting the Gligh-score and he was really toxic about it!","Why don't you ever see Mamoswines hiding in trees? Because they're really good at it!","What happens when your Porygon-Z uses Signal Beam? Software bugs!","What do you call a Gallade in a tuxedo? Sharply dressed!","Why do they call Rotom-Heat an oven when you of in the cold food of out hot eat the food?","Why does no one tell Rotom-Wash their secrets? They don't want it to air out their dirty laundry!","I had a joke about Uxie, but I forgot it!","I had a joke about Mesprit, but I don't think you're emotionally ready for it!","I had a joke about Azelf, but I don't have the willpower to tell it!","I had a joke about Dialga and time travel, but you didn't like it!","I had a joke about Palkia, but there's no space for it here!","Why couldn't Arceus go to Planet Fitness? Because it's a Judgment-free zone!","I had a joke about the Azure Flute, but you wouldn't get it!","Why does Victini always win? Beats me!","Some people think Overgrow is viable on Serperior. On the Contrary!","Once Samurott got a regional form, its usage really Spiked!","Did you hear about the Watchog that won a battle? Yeah, me neither!","I could tell a joke about Musharna, but I wouldn't dream of it!","Why does Throh never win? Because it always throws!","Cofagrigus is so cool! Don't you *cough* agree, Gus?","I wouldn't use Zoroark in OU—I have no Illusion that it's any good!","Why is Reuniclus so good at marketing? It knows what cells!","Why didn't the Ducklett evolve? It didn't Swanna!","I fought a Beartic once. It was unbearable!","Did you know it's a crime to make a Braviary sick? It's ill-eagle!","I attract Volcaronas like a moth to a flame!","I'd make a joke about Cobalion, but it's un-Justified!","What did Zekrom do when it was unhappy with its working conditions? It went on Bolt Strike!","Everyone plays Meloetta in exactly the same way. It's always the same old song and dance!","What's a Chesnaught's favorite Nature? Naughty!","Which part of Doublade is most dangerous? Da blade!","I'd say I'm a Pyroar, but I'd be lion!","Why does Talonflame laugh in the face of danger? Because it's a Brave Bird!","I stole a Delphox's wand, but it got me in a stick-y situation!","What are Aegislash's favorite Pokémon games? Sword and Shield!","What do you call it when you do a favor for a Malamar and it wants one in return? Squid pro quo!","I'm making an 8-bit game featuring Sylveon. It looks cute when it's Pixilated!","Why did Tyrantrum get its license taken away? It kept getting in T-wrecks!","Why does Goodra have such good fashion sense? Because it's always got the drip!","What do you get when you cross a Kingambit with a Gourgeist? Supreme Overgourd!","What do you call a dead Klefki? A skeleton key!","I dated a Xerneas once, but we broke up. Now it's my X!","I've never met an Yveltal. I don't know Y!","Why does Zygarde-Complete work so hard? Because it always gives 100%!","Why does Diancie have such good synergy with Ghost-types? Because diamonds are a ghoul's best friend!","What's Hoopa's favorite video game? Portal!","Why did Hoopa-Unbound get put into the Prison Bottle? Because it was armed and dangerous!","What do you call a joke about Volcanion? A wisecrack-a-toa!","Why does no one make friends with Incineroar? It's too Intimidating!","Can a Toucannon win a Double Battle? No, but two can!","What do you call your Lycanroc when it goes missing? A where-wolf!","Why are Wishiwashi so smart? They swim in schools!","What do you call it when Ribombee gets a free turn? A sticky situation!","Why are Mudsdales so strong? They have horsepower!","What's Araquanid's favorite candy? Bubble gum!","I had a Salazzle girlfriend once, but I broke it off because she was too toxic!","Why do they call it Comfey when every time someone sends it out it becomes the most stressful game of my life?","Why did the Golisopod make an emergency exit from the job interview? It made a bad First Impression!","I'm making a first-person shooting game starring Pyukumuku. It's called Duke Pyukem!","Why should you never mimic a Mimikyu? Because you're risking your neck!","Where in Alaska can you find Dhelmise? Anchorage!","Did you know that Kommo-o's scales are falling off all across the globe? It's a problem on a worldwide scale!","A Tapu Lele walks into a bar. The bartender gets nervous because there's no counter!","Did you hear that Tapu Fini's terrain is gone? It'll be mist!","Did you hear Lunala opened up a barber shop? It's called Totally Clips!","If OU doesn't suspect test Solgaleo, I'm going to go on Sunsteel Strike!","I heard they buffed Buzzwole in Pokémon Unite. I don't know why they needed to, it was already buff!","I want to ask Pheromosa out, but it strikes me as unapp-roach-able!","What do you call a Xurkitree that's only 3 feet tall? A short circuit!","What does Celesteela order when it goes to a Chinese restaurant? One-ton soup!","Why should you never invite a Kartana to poker night? Because it always knows when to fold!","Why did the Guzzlord love doing difficult jobs? Because it was a glutton for punishment!","What happened to the Necrozma that robbed a bank? It was in-prismed!","Why does Ultra Necrozma weigh less that Dusk Mane or Dawn Wings form? Because it's more light!","What attack does Stakataka learn at Level 1? Stakatackle!","Why is Blacephalon's head spherical? Because it's clowning a-round!","What is Inteleon's secret agent number? Bubble-O-7!","I'll be here all Corvi-night, folks!","What Bug/Psychic Pokémon can be found deep underground embedded in stone? Ore-beetle!","Why should you never give a Drednaw the Infinity Gauntlet? Because it's a snapping turtle!","A Flapple a day keeps the doctor away, as long as its attacks don't miss!","Why are my jokes so popular on Galar's Route 8? Because Sandaconda don't want none unless you got puns, hun!","My Cramorant was about to win a match, but then it choked!","What's Toxtricity's favorite Tera type? Rock!","Why does Centiskorch hate wearing Heavy-Duty Boots? By the time it's finished putting them all on, the battle's already over!","I've heard a lot of gossip about Polteageist, but I don't want to spill the tea!","Who hosts tea parties in Wonderland and bounces back hazard moves? The Mad Hatterene!","What kind of fur do you get from Grimmsnarl? As fur away as possible!","Of all the crimes Obstagoon's done, which one finally put it behind bars for good? Obstruction of justice!","Where do Cursola keep their gravestones? At the Great Burial Reef!","How does Sirfetch'd pass along all the insider info it knows about new Pokémon games? It leeks it!","What did the Mr. Mime say to the Mr. Rime? Nothing, silly, mimes can't talk!","I'd tell a joke about Runerigus, but the real joke is its evolution method!","Plenty of Pokémon have ridiculous numbers of alternate forms, but Alcremie takes the cake!","Can any Pokémon besides Tapu Lele set Psychic Terrain? Yes Indeedee!","What's a Copperajah's favorite kind of music? Heavy Metal!","Why did Dracovish get evicted from OU? It wouldn't pay the Fishious Rent!","Have you seen Duraludon's Gigantamax form? It really towers over you!","What's Dragapult's favorite game to play at a bar? Dragon Darts!","I'd tell you a joke about Zamazenta, but I'm pressed for time!","Why should you always run Zacian-Crowned? Because it has great STAB!","Originally the Gen 8 designers weren't going to add a generational mechanic, but Eternatus convinced them to make Dynamax canon!","What does Regieleki do to lose weight? Fast!","What do you get when you cross a Regidrago and a Klefki? Lockjaw!","I'd make a joke about Spectrier, but that would be beating a dead horse!","Make sure to never insult Ursaluna—last time I burned it, it swept my whole team!","Don't go near Ursaluna-Bloodmoon—it's a total lunatic!","You'd think Basculegion would be uncomfortable traveling forward in time hundreds of years, but don't worry—it's adaptable!","You have to use Strong Style Barb Barrage 20 times to evolve Hisuian Qwilfish? That seems like Overqwil to me!","Did you know that Meowscarada is really good at baking bread? Apparently it has a special Flour Trick!","I've got a ton of Skeledirge jokes. A skele-ton!","What do you do if you see a Quaquaval getting ready to kick you in the head? Duck!","Lokix? No thanks, I don't like using weight-based moves!","Why did the baker get a Fidough? He kneaded one!","How do you know Dachsbun has a good pedigree? It's pure bread!","Why did the Garganacl ragequit while losing a battle? Because it was salty!","You're telling me Ceruledge has dark purple armor and blue flaming swords for hands? What an edgelord!","You should try using Electromorphosis Bellibolt—its damage output is shocking!","I tried using Klawf on a stall team, but it was Klawful!","Rabsca told me its true body was inside the ball it's holding. I thought that was a load of crap!","My Shellder once spent time with an Espathra. It came back with a new Ability just called Link because Espathra takes no skill!","Why is Corviknight's natural predator so smart? Because she Thinks-a-ton!","I asked a Finizen why it worked as a sidekick for Palafin. The Finizen said it was serving a greater porpoise!","If you run in front of a Revavroom you get tired, but if you run behind it you get exhausted!","Why couldn't the Cyclizar stand up? It was two-tired!","Why does Houndstone press F? To pay its Last Respects!","Those entry hazards are nice, why not put up Glim-more-a' them?","Why did Dondozo get demonetized on YouTube? It wouldn't stop cursing!","Have you heard the joke about Farigiraf's neck? It's a long one!","What do you call a Dudunsparce that gets faster when it's hit with a Dark move? A Rattled-snake!","What do you call a Dunsparce? No, really, I'm curious.","Why do people love Donphan so much? Because it has Great Tusks!","What do you get when you cross Kingambit and Ogerpon? The Supreme Ogrelord!","What did ancient Magneton economists invest in? Sandy Stocks!","I'm starting a band featuring Slither Wing. It's called Smash Moth!","Why does the Paldean alphabet go L, M, N, Flutter Mane, Q, R? Because Flutter Mane is OP!","What did Iron Bundle's mother say when it went out in the cold? Bundle up, and be sure to cover everything!","Iron Hands is a fantastic Pokémon. Let's all give it a great big hand!","What should you do if an Iron Treads uses Autotomize? Tread lightly!","What Paradox Pokémon do you like to run? Personally, I run Thorns!","What kind of computers does Wo-Chien like to use? Tablets!","Man, that Chien-Pao OHKOing me Sword of Ruined my day!","When I saw my special attacks doing 25% less damage than usual, I knew there was some-Ting wrong!","What do you call a really old Salamence telling a really dull story? Boring Moon!","I once visited Chi-Yu's home, but it had no walls!","I don't know what the Iron Valiant set is until I look inside the box, but I can't—it's impossible to check!","Why is Miraidon banned to AG? Because it's from the future, so it's not allowed to be present!","I once met a Koraidon, so I turned around and said that the past is behind me!","What's the opposite of Walking Wake? Sleepwalking!","What does Sinistcha wear on St. Patrick's Day? A green tea-shirt!","Why are the Loyal Three always male? Toxic masculinity!","One of Ogerpon's forms got banned, but it was pretty controversial on the Internet. It started a Hearth-flame war!","You don't like Archaludon? Too bad, build a bridge and get over it!","What move can only be used by a Hydrapple that's been fermented in brine? Pickle Beam!","Why is Raging Bolt so delusional? Because it's got its head in the clouds!","Iron Boulder? Boulders aren't made of iron, silly!","Iron Crown? But my crown isn't wrinkled!","I hear Terapagos got banned from OU in less than a day. It must've had a Stellar performance!","I'd make a joke about Pecharunt's poison, but it's too confusing!","How many Pokémon fans does it take to change a lightbulb? None, they just complain about how much better the last lightbulb was!","That's the last time I try to make a call in winter, I'm getting a Chilly Reception!","Maybe I should tell spicier jokes and go for a Chili Reception instead!","Did you hear the one about the Slowking who switched out?","You've heard of stand-up comedy, but have you heard of switch-out comedy?","You bought those fossils from Clay? Did you buy them on Clay-away?","How do you get a Trainer onto a bus? Poke 'em on!","U-Turn? No, YOU turn, I'm going straight!","Does Gen 1 have a Pokémon missing? No!"];var _battle=this.scene.battle;var joke=dadJokes[((_battle.p1.name.charCodeAt(2)||0)+(_battle.p2.name.charCodeAt(2)||0)*19+(_battle.p1.name.charCodeAt(3)||0)*61+(_battle.p2.name.charCodeAt(3)||0)+_battle.turn+(args[1].charCodeAt(1)||0)*109+(args[1].charCodeAt(2)||0)*113)%dadJokes.length];messageFromArgs(args,kwArgs);this.messageFromLog("\""+joke+"\"");this.scene.wait(3*this.scene.battle.messageFadeTime/this.scene.acceleration);return true;}}if(Dex.afdMode!==true)return;if(args[0]==='faint'){if(!Dex.afdFaint){messageFromArgs(args,kwArgs);this.message('<div class="broadcast-red" style="font-size:10pt">Needed that one alive? Buy <strong>Max Revive DLC</strong>, yours for only $9.99!<br /> <a href="/trustworthy-dlc-link">CLICK HERE!</a></div>');Dex.afdFaint=true;return true;}}else if(args[0]==='-crit'){if(!Dex.afdCrit){messageFromArgs(args,kwArgs);this.message('<div class="broadcast-red" style="font-size:10pt">Crit mattered? Buy <strong>Crit Insurance DLC</strong>, yours for only $4.99!<br /> <a href="/trustworthy-dlc-link">CLICK HERE!</a></div>');Dex.afdCrit=true;return true;}}else if(args[0]==='move'){if(kwArgs.from)return false;var _moveid2=toID(args[2]);if(_moveid2==='earthquake'){if(this.scene.animating&&window.$){$('body').css({position:'absolute',left:0,right:0,top:0,bottom:0}).animate({left:-30,right:30},75).animate({left:30,right:-30},100).animate({left:-30,right:30},100).animate({left:30,right:-30},100).animate({left:0,right:0},100,function(){$('body').css({position:'static'});});}messageFromArgs(['move',args[1],'Fissure']);this.messageFromLog('Just kidding! It was **Earthquake**!');return true;}else if(_moveid2==='stealthrock'){var srNames=['Sneaky Pebbles','Sly Rubble','Subtle Sediment','Buried Bedrock','Camouflaged Cinnabar','Clandestine Cobblestones','Cloaked Clay','Concealed Ore','Covert Crags','Crafty Coal','Discreet Bricks','Disguised Debris','Espionage Pebbles','Furtive Fortress','Hush-Hush Hardware','Incognito Boulders','Invisible Quartz','Masked Minerals','Mischievous Masonry','Obscure Ornaments','Private Paragon','Secret Solitaire','Sheltered Sand','Surreptitious Sapphire','Undercover Ultramarine'];messageFromArgs(['move',args[1],srNames[Math.floor(Math.random()*srNames.length)]]);return true;}else if(_moveid2==='extremespeed'){messageFromArgs(args,kwArgs);var fastWords=['H-Hayai','Masaka','Its fast'];this.messageFromLog("**"+fastWords[Math.floor(Math.random()*fastWords.length)]+"**");return true;}else if(_moveid2==='aerialace'){messageFromArgs(['move',args[1],'Tsubame Gaeshi']);return true;}}return false;};_proto.messageFromLog=function messageFromLog(line){this.message.apply(this,this.parseLogMessage(line));};_proto.textList=function textList(list){var message='';var listNoDuplicates=[];for(var _i2=0,_list2=list;_i2<_list2.length;_i2++){var user=_list2[_i2];if(!listNoDuplicates.includes(user))listNoDuplicates.push(user);}list=listNoDuplicates;if(list.length===1)return list[0];if(list.length===2)return list[0]+" and "+list[1];for(var i=0;i<list.length-1;i++){if(i>=5){return message+"and "+(list.length-5)+" others";}message+=list[i]+", ";}return message+"and "+list[list.length-1];};_proto.parseLogMessage=function parseLogMessage(message){var messages=message.split('\n').map(function(line){line=BattleLog.escapeHTML(line);line=line.replace(/\*\*(.*)\*\*/,'<strong>$1</strong>');line=line.replace(/\|\|([^|]*)\|\|([^|]*)\|\|/,'<abbr title="$1">$2</abbr>');if(line.startsWith('  '))line='<small>'+line.trim()+'</small>';return line;});return[messages.join('<br />'),messages.filter(function(line){return!line.startsWith('<small>[');}).join('<br />')];};_proto.message=function message(_message){var _this$scene3;var sceneMessage=arguments.length>1&&arguments[1]!==undefined?arguments[1]:_message;(_this$scene3=this.scene)==null||_this$scene3.message(sceneMessage);this.addDiv('battle-history',_message);};_proto.addNode=function addNode(node,preempt){(preempt?this.preemptElem:this.innerElem).appendChild(node);if(this.atBottom){this.elem.scrollTop=this.elem.scrollHeight;}};_proto.
addDiv=function addDiv(className,innerHTML,preempt){
var el=document.createElement('div');
el.className=className;
el.innerHTML=innerHTML;
this.addNode(el,preempt);
};_proto.
prependDiv=function prependDiv(className,innerHTML,preempt){
var el=document.createElement('div');
el.className=className;
el.innerHTML=innerHTML;
if(this.innerElem.childNodes.length){
this.innerElem.insertBefore(el,this.innerElem.childNodes[0]);
}else{
this.innerElem.appendChild(el);
}
this.updateScroll();
};_proto.
addSpacer=function addSpacer(){
this.addDiv('spacer battle-history','<br />');
};_proto.
changeUhtml=function changeUhtml(id,htmlSrc,forceAdd){
id=toID(id);
var classContains=' uhtml-'+id+' ';
var elements=[];for(var _i4=0,_this$innerElem$child2=
this.innerElem.childNodes;_i4<_this$innerElem$child2.length;_i4++){var node=_this$innerElem$child2[_i4];
if(node.className&&(' '+node.className+' ').includes(classContains)){
elements.push(node);
}
}
if(this.preemptElem){for(var _i6=0,_this$preemptElem$chi2=
this.preemptElem.childNodes;_i6<_this$preemptElem$chi2.length;_i6++){var _node=_this$preemptElem$chi2[_i6];
if(_node.className&&(' '+_node.className+' ').includes(classContains)){
elements.push(_node);
}
}
}
if(htmlSrc&&elements.length&&!forceAdd){for(var _i8=0;_i8<
elements.length;_i8++){var element=elements[_i8];
element.innerHTML=BattleLog.sanitizeHTML(htmlSrc);
}
this.updateScroll();
return;
}for(var _i10=0;_i10<
elements.length;_i10++){var _element=elements[_i10];
_element.parentElement.removeChild(_element);
}
if(!htmlSrc)return;
if(forceAdd){
this.addDiv('notice uhtml-'+id,BattleLog.sanitizeHTML(htmlSrc));
}else{
this.prependDiv('notice uhtml-'+id,BattleLog.sanitizeHTML(htmlSrc));
}
};_proto.
hideChatFrom=function hideChatFrom(userid){var showRevealButton=arguments.length>1&&arguments[1]!==undefined?arguments[1]:true;var lineCount=arguments.length>2&&arguments[2]!==undefined?arguments[2]:0;
var classStart='chat chatmessage-'+userid+' ';
var nodes=[];for(var _i12=0,_this$innerElem$child4=
this.innerElem.childNodes;_i12<_this$innerElem$child4.length;_i12++){var node=_this$innerElem$child4[_i12];
if(node.className&&(node.className+' ').startsWith(classStart)){
nodes.push(node);
}
}
if(this.preemptElem){for(var _i14=0,_this$preemptElem$chi4=
this.preemptElem.childNodes;_i14<_this$preemptElem$chi4.length;_i14++){var _node2=_this$preemptElem$chi4[_i14];
if(_node2.className&&(_node2.className+' ').startsWith(classStart)){
nodes.push(_node2);
}
}
}
if(lineCount)nodes=nodes.slice(-lineCount);for(var _i16=0,_nodes2=

nodes;_i16<_nodes2.length;_i16++){var _node3=_nodes2[_i16];
_node3.style.display='none';
_node3.className='revealed '+_node3.className;
}
if(!nodes.length||!showRevealButton)return;
var button=document.createElement('button');
button.name='toggleMessages';
button.value=userid;
button.className='subtle';
button.innerHTML="<small>("+nodes.length+" line"+(nodes.length>1?'s':'')+" from "+userid+" hidden)</small>";
var lastNode=nodes[nodes.length-1];
lastNode.appendChild(document.createTextNode(' '));
lastNode.appendChild(button);
};BattleLog.

unlinkNodeList=function unlinkNodeList(nodeList,classStart){for(var _i18=0;_i18<
nodeList.length;_i18++){var node=nodeList[_i18];
if(node.className&&(node.className+' ').startsWith(classStart)){
var linkList=node.getElementsByTagName('a');

for(var i=linkList.length-1;i>=0;i--){
var linkNode=linkList[i];
var parent=linkNode.parentElement;
if(!parent)continue;for(var _i20=0,_linkNode$childNodes2=
linkNode.childNodes;_i20<_linkNode$childNodes2.length;_i20++){var childNode=_linkNode$childNodes2[_i20];
parent.insertBefore(childNode,linkNode);
}
parent.removeChild(linkNode);
}
}
}
};_proto.

unlinkChatFrom=function unlinkChatFrom(userid){
var classStart='chat chatmessage-'+userid+' ';
var innerNodeList=this.innerElem.childNodes;
BattleLog.unlinkNodeList(innerNodeList,classStart);

if(this.preemptElem){
var preemptNodeList=this.preemptElem.childNodes;
BattleLog.unlinkNodeList(preemptNodeList,classStart);
}
};_proto.

preemptCatchup=function preemptCatchup(){
if(!this.preemptElem.firstChild)return;
this.innerElem.appendChild(this.preemptElem.firstChild);
};BattleLog.

escapeFormat=function escapeFormat(){var formatid=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'';var fixGen6=arguments.length>1?arguments[1]:undefined;
var atIndex=formatid.indexOf('@@@');
if(atIndex>=0){
return this.escapeHTML(this.formatName(formatid.slice(0,atIndex),fixGen6))+
'<br />Custom rules: '+this.escapeHTML(formatid.slice(atIndex+3));
}
return this.escapeHTML(this.formatName(formatid,fixGen6));
};BattleLog.




formatName=function formatName(){var formatid=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'';var fixGen6=arguments.length>1?arguments[1]:undefined;
if(!formatid)return'';

var atIndex=formatid.indexOf('@@@');
if(atIndex>=0){
return this.formatName(formatid.slice(0,atIndex),fixGen6)+
' (Custom rules: '+this.escapeHTML(formatid.slice(atIndex+3))+')';
}
if(fixGen6&&!formatid.startsWith('gen')){
formatid="gen6"+formatid;
}
var name=formatid;
if(window.BattleFormats&&BattleFormats[formatid]){
name=BattleFormats[formatid].name;
}
if(window.NonBattleGames&&NonBattleGames[formatid]){
name=NonBattleGames[formatid];
}
if(name.startsWith('gen')){
name=name.replace(/^gen([0-9])/,'[Gen $1] ');
}
if(name.startsWith("[Gen "+Dex.gen+"] ")){
name=name.slice(("[Gen "+Dex.gen+"] ").length);
}else if(name.startsWith("[Gen "+Dex.gen+" ")){
name='['+name.slice(("[Gen "+Dex.gen+" ").length);
}
return name||"[Gen "+Dex.gen+"]";
};BattleLog.

escapeHTML=function escapeHTML(str,jsEscapeToo){
if(typeof str==='number')str=""+str;
if(typeof str!=='string')return'';
str=str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
if(jsEscapeToo)str=str.replace(/\\/g,'\\\\').replace(/'/g,'\\\'');
return str;
};BattleLog.



html=function html(strings){
var buf=strings[0];
var i=0;for(var _len=arguments.length,args=new Array(_len>1?_len-1:0),_key=1;_key<_len;_key++){args[_key-1]=arguments[_key];}
while(i<args.length){
buf+=this.escapeHTML(args[i]);
buf+=strings[++i];
}
return buf;
};BattleLog.

unescapeHTML=function unescapeHTML(str){
str=str?''+str:'';
return str.replace(/&quot;/g,'"').replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&');
};BattleLog.




hashColor=function hashColor(name){
return"color:"+this.usernameColor(name)+";";
};BattleLog.

usernameColor=function usernameColor(name){
if(this.colorCache[name])return this.colorCache[name];
var hash;
if(Config.customcolors[name]){
hash=MD5(Config.customcolors[name]);
}else{
hash=MD5(name);
}
var H=parseInt(hash.substr(4,4),16)%360;
var S=parseInt(hash.substr(0,4),16)%50+40;
var L=Math.floor(parseInt(hash.substr(8,4),16)%20+30);

var _this$HSLToRGB=this.HSLToRGB(H,S,L),R=_this$HSLToRGB.R,G=_this$HSLToRGB.G,B=_this$HSLToRGB.B;
var lum=R*R*R*0.2126+G*G*G*0.7152+B*B*B*0.0722;

var HLmod=(lum-0.2)*-150;
if(HLmod>18)HLmod=(HLmod-18)*2.5;else
if(HLmod<0)HLmod/=3;else
HLmod=0;

var Hdist=Math.min(Math.abs(180-H),Math.abs(240-H));
if(Hdist<15){
HLmod+=(15-Hdist)/3;
}

L+=HLmod;

var _this$HSLToRGB2=this.HSLToRGB(H,S,L),r=_this$HSLToRGB2.R,g=_this$HSLToRGB2.G,b=_this$HSLToRGB2.B;
var toHex=function(x){
var hex=Math.round(x*255).toString(16);
return hex.length===1?'0'+hex:hex;
};
this.colorCache[name]="#"+toHex(r)+toHex(g)+toHex(b);
return this.colorCache[name];
};BattleLog.

HSLToRGB=function HSLToRGB(H,S,L){
var C=(100-Math.abs(2*L-100))*S/100/100;
var X=C*(1-Math.abs(H/60%2-1));
var m=L/100-C/2;

var R1;
var G1;
var B1;
switch(Math.floor(H/60)){
case 1:R1=X;G1=C;B1=0;break;
case 2:R1=0;G1=C;B1=X;break;
case 3:R1=0;G1=X;B1=C;break;
case 4:R1=X;G1=0;B1=C;break;
case 5:R1=C;G1=0;B1=X;break;
case 0:default:R1=C;G1=X;B1=0;break;
}
var R=R1+m;
var G=G1+m;
var B=B1+m;
return{R:R,G:G,B:B};
};BattleLog.

prefs=function prefs(name){var _window$Storage;

if((_window$Storage=window.Storage)!=null&&_window$Storage.prefs)return Storage.prefs(name);

if(window.PS)return PS.prefs[name];

return undefined;
};_proto.

parseChatMessage=function parseChatMessage(
message,name,timestamp,isHighlighted)
{var _BattleLog$prefs,_window$app6,_window$PS5;
var showMe=!((_BattleLog$prefs=BattleLog.prefs('chatformatting'))!=null&&_BattleLog$prefs.hideme);
var group=' ';
if(!/[A-Za-z0-9]/.test(name.charAt(0))){

group=name.charAt(0);
name=name.substr(1);
}
var colorStyle=" style=\"color:"+BattleLog.usernameColor(toID(name))+"\"";
var clickableName="<small class=\"groupsymbol\">"+BattleLog.escapeHTML(group)+"</small><span class=\"username\">"+BattleLog.escapeHTML(name)+"</span>";
var isMine=((_window$app6=window.app)==null||(_window$app6=_window$app6.user)==null?void 0:_window$app6.get('name'))===name||((_window$PS5=window.PS)==null?void 0:_window$PS5.user.name)===name;
var hlClass=isHighlighted?' highlighted':'';
var mineClass=isMine?' mine':'';

var cmd='';
var target='';
if(message.startsWith('/')){
if(message.charAt(1)==='/'){
message=message.slice(1);
}else{
var spaceIndex=message.indexOf(' ');
cmd=spaceIndex>=0?message.slice(1,spaceIndex):message.slice(1);
if(spaceIndex>=0)target=message.slice(spaceIndex+1);
}
}

switch(cmd){
case'me':
case'mee':
var parsedMessage=BattleLog.parseMessage(' '+target);
if(cmd==='mee')parsedMessage=parsedMessage.slice(1);
if(!showMe){
return[
'chat chatmessage-'+toID(name)+hlClass+mineClass,
timestamp+"<strong"+colorStyle+">"+clickableName+":</strong> <em>/me"+parsedMessage+"</em>"];

}
return[
'chat chatmessage-'+toID(name)+hlClass+mineClass,
timestamp+"<em><i><strong"+colorStyle+">&bull; "+clickableName+"</strong>"+parsedMessage+"</i></em>"];

case'invite':
var roomid=toRoomid(target);
return[
'chat',
timestamp+"<em>"+clickableName+" invited you to join the room \""+roomid+"\"</em>"+("<div class=\"notice\"><button class=\"button\" name=\"joinRoom\" value=\""+
roomid+"\">Join "+roomid+"</button></div>")];

case'announce':
return[
'chat chatmessage-'+toID(name)+hlClass+mineClass,
timestamp+"<strong"+colorStyle+">"+clickableName+":</strong> <span class=\"message-announce\">"+BattleLog.parseMessage(target)+"</span>"];

case'log':
return[
'chat chatmessage-'+toID(name)+hlClass+mineClass,
timestamp+"<span class=\"message-log\">"+BattleLog.parseMessage(target)+"</span>"];

case'data-pokemon':
case'data-item':
case'data-ability':
case'data-move':
return['chat message-error','[outdated code no longer supported]'];
case'text':
return['chat',BattleLog.parseMessage(target)];
case'error':
return['chat message-error',formatText(target,true)];
case'html':
if(!name){
return[
'chat'+hlClass,
timestamp+"<em>"+BattleLog.sanitizeHTML(target)+"</em>"];

}
return[
'chat chatmessage-'+toID(name)+hlClass+mineClass,
timestamp+"<strong"+colorStyle+">"+clickableName+":</strong> <em>"+BattleLog.sanitizeHTML(target)+"</em>"];

case'uhtml':
case'uhtmlchange':
var parts=target.split(',');
var htmlSrc=parts.slice(1).join(',').trim();
this.changeUhtml(parts[0],htmlSrc,cmd==='uhtml');
return['',''];
case'raw':
return['chat',BattleLog.sanitizeHTML(target),true];
case'nonotify':
return['chat',BattleLog.sanitizeHTML(target),true];
default:

if(!name){
return[
'chat'+hlClass,
timestamp+"<em>"+BattleLog.parseMessage(message)+"</em>"];

}
return[
'chat chatmessage-'+toID(name)+hlClass+mineClass,
timestamp+"<strong"+colorStyle+">"+clickableName+":</strong> <em>"+BattleLog.parseMessage(message)+"</em>"];

}
};BattleLog.

parseMessage=function parseMessage(str){var isTrusted=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;

if(str.substr(0,3)==='>> '||str.substr(0,4)==='>>> ')return this.escapeHTML(str);

if(str.substr(0,3)==='<< ')return this.escapeHTML(str);
str=formatText(str,isTrusted);

var options=BattleLog.prefs('chatformatting')||{};

if(options.hidelinks){
str=str.replace(/<a[^>]*>/g,'<u>').replace(/<\/a>/g,'</u>');
}
if(options.hidespoiler){
str=str.replace(/<span class="spoiler">/g,'<span class="spoiler-shown">');
}
if(options.hidegreentext){
str=str.replace(/<span class="greentext">/g,'<span>');
}

return str;
};BattleLog.


























initSanitizeHTML=function initSanitizeHTML(){var _this4=this;
if(this.tagPolicy)return;
if(!('html4'in window)){
throw new Error('sanitizeHTML requires caja');
}



Object.assign(html4.ELEMENTS,{
marquee:0,
blink:0,
psicon:html4.eflags['OPTIONAL_ENDTAG']|html4.eflags['EMPTY'],
username:0,
spotify:0,
youtube:0,
formatselect:0,
copytext:0,
twitch:0
});



Object.assign(html4.ATTRIBS,{

'marquee::behavior':0,
'marquee::bgcolor':0,
'marquee::direction':0,
'marquee::height':0,
'marquee::hspace':0,
'marquee::loop':0,
'marquee::scrollamount':0,
'marquee::scrolldelay':0,
'marquee::truespeed':0,
'marquee::vspace':0,
'marquee::width':0,
'psicon::pokemon':0,
'psicon::item':0,
'psicon::type':0,
'selectformat::type':0,
'psicon::category':0,
'username::name':0,
'form::data-submitsend':0,
'formatselect::format':0,
'div::data-server':0,
'button::data-send':0,
'form::data-delimiter':0,
'button::data-delimiter':0,
'*::aria-label':0,
'*::aria-hidden':0
});



















this.tagPolicy=function(tagName,attribs){
if(html4.ELEMENTS[tagName]&html4.eflags['UNSAFE']){
return;
}

function getAttrib(key){
for(var i=0;i<attribs.length-1;i+=2){
if(attribs[i]===key){
return attribs[i+1];
}
}
return undefined;
}
function setAttrib(key,value){
for(var i=0;i<attribs.length-1;i+=2){
if(attribs[i]===key){
attribs[i+1]=value;
return;
}
}
attribs.push(key,value);
}
function deleteAttrib(key){
for(var i=0;i<attribs.length-1;i+=2){
if(attribs[i]===key){
attribs.splice(i,2);
return;
}
}
}

var dataUri='';
var targetReplace=false;

var unsanitizedStyle='';

if(tagName==='a'){
if(getAttrib('target')==='replace'){
targetReplace=true;
}
}else if(tagName==='img'){
var src=getAttrib('src')||'';
if(src.startsWith('data:image/')){
dataUri=src;
}
if(src.startsWith('//')){
if(location.protocol!=='http:'&&location.protocol!=='https:'){

setAttrib('src','https:'+src);
}
}
}else if(tagName==='twitch'){var _exec;

var _src=getAttrib('src')||"";
var channelId=(_exec=/(https?:\/\/)?twitch.tv\/([A-Za-z0-9]+)/i.exec(_src))==null?void 0:_exec[2];
var height=parseInt(getAttrib('height')||"",10)||400;
var width=parseInt(getAttrib('width')||"",10)||340;
return{
tagName:'iframe',
attribs:[
'src',"https://player.twitch.tv/?channel="+channelId+"&parent="+location.hostname+"&autoplay=false",
'allowfullscreen','true','height',""+height,'width',""+width]

};
}else if(tagName==='username'){

tagName='strong';
var color=_this4.usernameColor(toID(getAttrib('name')));
unsanitizedStyle="color:"+color;
}else if(tagName==='spotify'){var _exec2;

var _src2=getAttrib('src')||'';
var songId=(_exec2=/(?:\?v=|\/track\/)([A-Za-z0-9]+)/.exec(_src2))==null?void 0:_exec2[1];

return{
tagName:'iframe',
attribs:['src',"https://open.spotify.com/embed/track/"+songId,'width','300','height','380','frameborder','0','allowtransparency','true','allow','encrypted-media']
};
}else if(tagName==='youtube'){var _exec3,_exec4;


var _src3=getAttrib('src')||'';

var _width=getAttrib('width')||'0';
var _height=getAttrib('height')||'0';
if(Number(_width)<200){
_width=window.innerWidth>=400?'400':'320';
}
if(Number(_height)<200){
_height=window.innerWidth>=400?'225':'200';
}
var videoId=(_exec3=/(?:\?v=|\/embed\/)([A-Za-z0-9_-]+)/.exec(_src3))==null?void 0:_exec3[1];
if(!videoId)return{tagName:'img',attribs:['alt',"invalid src for <youtube>"]};

var time=(_exec4=/(?:\?|&)(?:t|start)=([0-9]+)/.exec(_src3))==null?void 0:_exec4[1];
_this4.players.push(null);
var idx=_this4.players.length;
_this4.initYoutubePlayer(idx);
return{
tagName:'iframe',
attribs:[
'id',"youtube-iframe-"+idx,
'width',_width,'height',_height,
'src',"https://www.youtube.com/embed/"+videoId+"?enablejsapi=1&playsinline=1"+(time?"&start="+time:''),
'frameborder','0','allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture','allowfullscreen','allowfullscreen',
'time',""+(time||0)]

};
}else if(tagName==='formatselect'){
return{
tagName:'button',
attribs:[
'type','selectformat',
'class',"select formatselect",
'value',getAttrib('format')||getAttrib('value')||'',
'name',getAttrib('name')||'']

};
}else if(tagName==='copytext'){
return{
tagName:'button',
attribs:[
'type',getAttrib('type'),
'class',getAttrib('class')||'button',
'value',getAttrib('value'),
'name','copyText']

};
}else if(tagName==='psicon'){


var iconType=null;
var iconValue=null;
for(var i=0;i<attribs.length-1;i+=2){
if(attribs[i]==='pokemon'||attribs[i]==='item'||attribs[i]==='type'||attribs[i]==='category'){var _attribs$slice=
attribs.slice(i,i+2);iconType=_attribs$slice[0];iconValue=_attribs$slice[1];
break;
}
}
tagName='span';

if(iconType){
var className=getAttrib('class');

if(iconType==='pokemon'){
setAttrib('class','picon'+(className?' '+className:''));
unsanitizedStyle=Dex.getPokemonIcon(iconValue);
}else if(iconType==='item'){
setAttrib('class','itemicon'+(className?' '+className:''));
unsanitizedStyle=Dex.getItemIcon(iconValue);
}else if(iconType==='type'){
tagName=Dex.getTypeIcon(iconValue).slice(1,-3);
}else if(iconType==='category'){
tagName=Dex.getCategoryIcon(iconValue).slice(1,-3);
}
}
}

attribs=html.sanitizeAttribs(tagName,attribs,function(urlData){
if(urlData.scheme_==='geo'||urlData.scheme_==='sms'||urlData.scheme_==='tel')return null;
return urlData;
});
if(unsanitizedStyle){
var style=getAttrib('style');
setAttrib('style',unsanitizedStyle+(style?'; '+style:''));
}

if(dataUri&&tagName==='img'){
setAttrib('src',dataUri);
}
if(tagName==='a'||tagName==='form'&&!getAttrib('data-submitsend')){
if(targetReplace){
setAttrib('data-target','replace');
deleteAttrib('target');
}else{
setAttrib('target','_blank');
}
if(tagName==='a'){
setAttrib('rel','noopener');
}
}
return{tagName:tagName,attribs:attribs};
};
};BattleLog.
localizeTime=function localizeTime(full,date,time,timezone){var _Intl;
var parsedTime=new Date(date+'T'+time+(timezone||'Z').toUpperCase());



if(!parsedTime.getTime())return full;

var formattedTime;

if((_Intl=window.Intl)!=null&&_Intl.DateTimeFormat){
formattedTime=new Intl.DateTimeFormat(undefined,{
month:'long',day:'numeric',hour:'numeric',minute:'numeric'
}).format(parsedTime);
}else{


formattedTime=parsedTime.toLocaleString();
}
return'<time>'+BattleLog.escapeHTML(formattedTime)+'</time>';
};BattleLog.
sanitizeHTML=function sanitizeHTML(input){
if(typeof input!=='string')return'';

this.initSanitizeHTML();

input=input.replace(/<username([^>]*)>([^<]*)<\/username>/gi,function(match,attrs,username){
if(/\bname\s*=\s*"/.test(attrs))return match;
var escapedUsername=username.replace(/"/g,'&quot;').replace(/>/g,'&gt;');
return"<username"+attrs+" name=\""+escapedUsername+"\">"+username+"</username>";
});



var sanitized=html.sanitizeWithPolicy(input,this.tagPolicy);
















return sanitized.replace(
/<time>\s*([+-]?\d{4,}-\d{2}-\d{2})[T ](\d{2}:\d{2}(?::\d{2}(?:\.\d{3})?)?)(Z|[+-]\d{2}:\d{2})?\s*<\/time>/ig,
this.localizeTime
);
};BattleLog.

initYoutubePlayer=function initYoutubePlayer(idx){var _this5=this;
var id="youtube-iframe-"+idx;
var loadPlayer=function(){
var el=$("#"+id);
if(!el.length)return;
var player=new window.YT.Player(id,{
events:{
onStateChange:function(event){
if(event.data===window.YT.PlayerState.PLAYING){for(var _i22=0,_BattleLog$players2=
BattleLog.players;_i22<_BattleLog$players2.length;_i22++){var curPlayer=_BattleLog$players2[_i22];
if(player===curPlayer)continue;
curPlayer==null||curPlayer.pauseVideo==null||curPlayer.pauseVideo();
}
}
}
}
});
var time=Number(el.attr('time'));
if(time){
player.seekTo(time);
}
_this5.players[idx-1]=player;
};

this.ensureYoutube().then(function(){
setTimeout(function(){return loadPlayer();},300);
});
};BattleLog.

ensureYoutube=function ensureYoutube(){
if(this.ytLoading)return this.ytLoading;

this.ytLoading=new Promise(function(resolve){
var el=document.createElement('script');
el.type='text/javascript';
el.async=true;
el.src='https://youtube.com/iframe_api';
el.onload=function(){


var loopCheck=function(){var _window$YT;
if(!((_window$YT=window.YT)!=null&&_window$YT.Player)){
setTimeout(function(){return loopCheck();},300);
}else{
resolve();
}
};
loopCheck();
};
document.body.appendChild(el);
});
return this.ytLoading;
};BattleLog.


























createReplayFile=function createReplayFile(room){
var battle=room.battle;
var replayid=room.id;
if(replayid){var _window$Config;

replayid=replayid.slice(7);
if(((_window$Config=window.Config)==null?void 0:_window$Config.server.id)!=='showdown'){var _window$Config2;
if(!((_window$Config2=window.Config)!=null&&_window$Config2.server.registered)){
replayid='unregisteredserver-'+replayid;
}else{
replayid=Config.server.id+'-'+replayid;
}
}
}else if(room.fragment){

replayid=room.fragment;
}else{
replayid=battle.id;
}

battle.seekTurn(Infinity);
if(!battle.atQueueEnd)return null;
var buf='<!DOCTYPE html>\n';
buf+='<meta charset="utf-8" />\n';
buf+='<!-- version 1 -->\n';
buf+="<title>"+BattleLog.escapeHTML(battle.tier)+" replay: "+BattleLog.escapeHTML(battle.p1.name)+" vs. "+BattleLog.escapeHTML(battle.p2.name)+"</title>\n";

buf+='<style>\n';
buf+='html,body {font-family:Verdana, sans-serif;font-size:10pt;margin:0;padding:0;}body{padding:12px 0;} .battle-log {font-family:Verdana, sans-serif;font-size:10pt;} .battle-log-inline {border:1px solid #AAAAAA;background:#EEF2F5;color:black;max-width:640px;margin:0 auto 80px;padding-bottom:5px;} .battle-log .inner {padding:4px 8px 0px 8px;} .battle-log .inner-preempt {padding:0 8px 4px 8px;} .battle-log .inner-after {margin-top:0.5em;} .battle-log h2 {margin:0.5em -8px;padding:4px 8px;border:1px solid #AAAAAA;background:#E0E7EA;border-left:0;border-right:0;font-family:Verdana, sans-serif;font-size:13pt;} .battle-log .chat {vertical-align:middle;padding:3px 0 3px 0;font-size:8pt;} .battle-log .chat strong {color:#40576A;} .battle-log .chat em {padding:1px 4px 1px 3px;color:#000000;font-style:normal;} .chat.mine {background:rgba(0,0,0,0.05);margin-left:-8px;margin-right:-8px;padding-left:8px;padding-right:8px;} .spoiler {color:#BBBBBB;background:#BBBBBB;padding:0px 3px;} .spoiler:hover, .spoiler:active, .spoiler-shown {color:#000000;background:#E2E2E2;padding:0px 3px;} .spoiler a {color:#BBBBBB;} .spoiler:hover a, .spoiler:active a, .spoiler-shown a {color:#2288CC;} .chat code, .chat .spoiler:hover code, .chat .spoiler:active code, .chat .spoiler-shown code {border:1px solid #C0C0C0;background:#EEEEEE;color:black;padding:0 2px;} .chat .spoiler code {border:1px solid #CCCCCC;background:#CCCCCC;color:#CCCCCC;} .battle-log .rated {padding:3px 4px;} .battle-log .rated strong {color:white;background:#89A;padding:1px 4px;border-radius:4px;} .spacer {margin-top:0.5em;} .message-announce {background:#6688AA;color:white;padding:1px 4px 2px;} .message-announce a, .broadcast-green a, .broadcast-blue a, .broadcast-red a {color:#DDEEFF;} .broadcast-green {background-color:#559955;color:white;padding:2px 4px;} .broadcast-blue {background-color:#6688AA;color:white;padding:2px 4px;} .infobox {border:1px solid #6688AA;padding:2px 4px;} .infobox-limited {max-height:200px;overflow:auto;overflow-x:hidden;} .broadcast-red {background-color:#AA5544;color:white;padding:2px 4px;} .message-learn-canlearn {font-weight:bold;color:#228822;text-decoration:underline;} .message-learn-cannotlearn {font-weight:bold;color:#CC2222;text-decoration:underline;} .message-effect-weak {font-weight:bold;color:#CC2222;} .message-effect-resist {font-weight:bold;color:#6688AA;} .message-effect-immune {font-weight:bold;color:#666666;} .message-learn-list {margin-top:0;margin-bottom:0;} .message-throttle-notice, .message-error {color:#992222;} .message-overflow, .chat small.message-overflow {font-size:0pt;} .message-overflow::before {font-size:9pt;content:\'...\';} .subtle {color:#3A4A66;}\n';
buf+='</style>\n';
buf+='<div class="wrapper replay-wrapper" style="max-width:1180px;margin:0 auto">\n';
buf+='<input type="hidden" name="replayid" value="'+replayid+'" />\n';
buf+='<div class="battle"></div><div class="battle-log"></div><div class="replay-controls"></div><div class="replay-controls-2"></div>\n';
buf+="<h1 style=\"font-weight:normal;text-align:center\"><strong>"+BattleLog.escapeHTML(battle.tier)+"</strong><br /><a href=\"http://"+Config.routes.users+"/"+toID(battle.p1.name)+"\" class=\"subtle\" target=\"_blank\">"+BattleLog.escapeHTML(battle.p1.name)+"</a> vs. <a href=\"http://"+Config.routes.users+"/"+toID(battle.p2.name)+"\" class=\"subtle\" target=\"_blank\">"+BattleLog.escapeHTML(battle.p2.name)+"</a></h1>\n";
buf+='<script type="text/plain" class="battle-log-data">'+battle.stepQueue.join('\n').replace(/\//g,'\\/')+'</script>\n';
buf+='</div>\n';
buf+='<div class="battle-log battle-log-inline"><div class="inner">'+battle.scene.log.elem.innerHTML+'</div></div>\n';
buf+='</div>\n';
buf+='<script>\n';
buf+="let daily = Math.floor(Date.now()/1000/60/60/24);document.write('<script src=\"https://"+Config.routes.client+"/js/replay-embed.js?version'+daily+'\"></'+'script>');\n";
buf+='</script>\n';
return buf;
};BattleLog.

createReplayFileHref=function createReplayFileHref(room){

var replayFile=BattleLog.createReplayFile(room);
if(!replayFile){
return'javascript:alert("You will need to click Download again once the replay file is at the end.");void 0';
}
return'data:text/plain;base64,'+encodeURIComponent(btoa(unescape(encodeURIComponent(replayFile))));
};return BattleLog;}();BattleLog.colorCache={};BattleLog.interstice=function(){var whitelist=Config.whitelist||[];var patterns=whitelist.map(function(entry){return new RegExp("^(https?:)?//([A-Za-z0-9-]*\\.)?"+entry.replace(/\./g,'\\.')+"(/.*)?",'i');});return{isWhitelisted:function(uri){if(uri.startsWith('/')&&uri[1]!=='/'){return true;}for(var _i24=0;_i24<patterns.length;_i24++){var pattern=patterns[_i24];if(pattern.test(uri))return true;}return false;},getURI:function(uri){return"http://"+Config.routes.root+"/interstice?uri="+encodeURIComponent(uri);}};}();BattleLog.players=[];BattleLog.ytLoading=null;BattleLog.tagPolicy=null;


if(window.Net){
Net("/config/colors.json?"+Math.random()).get().then(function(response){
var data=JSON.parse(response);
Object.assign(Config.customcolors,data);
})["catch"](function(){});
}
"use strict";/**
 * Pokemon Showdown Log Misc
 *
 * Some miscellaneous helper functions for battle-log.ts, namely:
 *
 * - an MD5 hasher
 *
 * - a parseText function (for converting chat text to HTML),
 *   cross-compiled from the server
 *
 * Licensing note: PS's client has complicated licensing:
 * - The client as a whole is AGPLv3
 * - The battle replay/animation engine (battle-*.ts) by itself is MIT
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */




function MD5(f){function i(b,c){var d,e,f,g,h;f=b&2147483648;g=c&2147483648;d=b&1073741824;e=c&1073741824;h=(b&1073741823)+(c&1073741823);return d&e?h^2147483648^f^g:d|e?h&1073741824?h^3221225472^f^g:h^1073741824^f^g:h^f^g;}function j(b,c,d,e,f,g,h){b=i(b,i(i(c&d|~c&e,f),h));return i(b<<g|b>>>32-g,c);}function k(b,c,d,e,f,g,h){b=i(b,i(i(c&e|d&~e,f),h));return i(b<<g|b>>>32-g,c);}function l(b,c,e,d,f,g,h){b=i(b,i(i(c^e^d,f),h));return i(b<<g|b>>>32-g,c);}function m(b,c,e,d,f,g,h){b=i(b,i(i(e^(c|~d),
f),h));return i(b<<g|b>>>32-g,c);}function n(b){var c="",e="",d;for(d=0;d<=3;d++)e=b>>>d*8&255,e="0"+e.toString(16),c+=e.substr(e.length-2,2);return c;}var g=[],o,p,q,r,b,c,d,e,f=function(b){for(var b=b.replace(/\r\n/g,"\n"),c="",e=0;e<b.length;e++){var d=b.charCodeAt(e);d<128?c+=String.fromCharCode(d):(d>127&&d<2048?c+=String.fromCharCode(d>>6|192):(c+=String.fromCharCode(d>>12|224),c+=String.fromCharCode(d>>6&63|128)),c+=String.fromCharCode(d&63|128));}return c;}(f),g=function(b){var c,d=b.length;c=
d+8;for(var e=((c-c%64)/64+1)*16,f=Array(e-1),g=0,h=0;h<d;)c=(h-h%4)/4,g=h%4*8,f[c]|=b.charCodeAt(h)<<g,h++;f[(h-h%4)/4]|=128<<h%4*8;f[e-2]=d<<3;f[e-1]=d>>>29;return f;}(f);b=1732584193;c=4023233417;d=2562383102;e=271733878;for(f=0;f<g.length;f+=16)o=b,p=c,q=d,r=e,b=j(b,c,d,e,g[f+0],7,3614090360),e=j(e,b,c,d,g[f+1],12,3905402710),d=j(d,e,b,c,g[f+2],17,606105819),c=j(c,d,e,b,g[f+3],22,3250441966),b=j(b,c,d,e,g[f+4],7,4118548399),e=j(e,b,c,d,g[f+5],12,1200080426),d=j(d,e,b,c,g[f+6],17,2821735955),c=
j(c,d,e,b,g[f+7],22,4249261313),b=j(b,c,d,e,g[f+8],7,1770035416),e=j(e,b,c,d,g[f+9],12,2336552879),d=j(d,e,b,c,g[f+10],17,4294925233),c=j(c,d,e,b,g[f+11],22,2304563134),b=j(b,c,d,e,g[f+12],7,1804603682),e=j(e,b,c,d,g[f+13],12,4254626195),d=j(d,e,b,c,g[f+14],17,2792965006),c=j(c,d,e,b,g[f+15],22,1236535329),b=k(b,c,d,e,g[f+1],5,4129170786),e=k(e,b,c,d,g[f+6],9,3225465664),d=k(d,e,b,c,g[f+11],14,643717713),c=k(c,d,e,b,g[f+0],20,3921069994),b=k(b,c,d,e,g[f+5],5,3593408605),e=k(e,b,c,d,g[f+10],9,38016083),
d=k(d,e,b,c,g[f+15],14,3634488961),c=k(c,d,e,b,g[f+4],20,3889429448),b=k(b,c,d,e,g[f+9],5,568446438),e=k(e,b,c,d,g[f+14],9,3275163606),d=k(d,e,b,c,g[f+3],14,4107603335),c=k(c,d,e,b,g[f+8],20,1163531501),b=k(b,c,d,e,g[f+13],5,2850285829),e=k(e,b,c,d,g[f+2],9,4243563512),d=k(d,e,b,c,g[f+7],14,1735328473),c=k(c,d,e,b,g[f+12],20,2368359562),b=l(b,c,d,e,g[f+5],4,4294588738),e=l(e,b,c,d,g[f+8],11,2272392833),d=l(d,e,b,c,g[f+11],16,1839030562),c=l(c,d,e,b,g[f+14],23,4259657740),b=l(b,c,d,e,g[f+1],4,2763975236),
e=l(e,b,c,d,g[f+4],11,1272893353),d=l(d,e,b,c,g[f+7],16,4139469664),c=l(c,d,e,b,g[f+10],23,3200236656),b=l(b,c,d,e,g[f+13],4,681279174),e=l(e,b,c,d,g[f+0],11,3936430074),d=l(d,e,b,c,g[f+3],16,3572445317),c=l(c,d,e,b,g[f+6],23,76029189),b=l(b,c,d,e,g[f+9],4,3654602809),e=l(e,b,c,d,g[f+12],11,3873151461),d=l(d,e,b,c,g[f+15],16,530742520),c=l(c,d,e,b,g[f+2],23,3299628645),b=m(b,c,d,e,g[f+0],6,4096336452),e=m(e,b,c,d,g[f+7],10,1126891415),d=m(d,e,b,c,g[f+14],15,2878612391),c=m(c,d,e,b,g[f+5],21,4237533241),
b=m(b,c,d,e,g[f+12],6,1700485571),e=m(e,b,c,d,g[f+3],10,2399980690),d=m(d,e,b,c,g[f+10],15,4293915773),c=m(c,d,e,b,g[f+1],21,2240044497),b=m(b,c,d,e,g[f+8],6,1873313359),e=m(e,b,c,d,g[f+15],10,4264355552),d=m(d,e,b,c,g[f+6],15,2734768916),c=m(c,d,e,b,g[f+13],21,1309151649),b=m(b,c,d,e,g[f+4],6,4149444226),e=m(e,b,c,d,g[f+11],10,3174756917),d=m(d,e,b,c,g[f+2],15,718787259),c=m(c,d,e,b,g[f+9],21,3951481745),b=i(b,o),c=i(c,p),d=i(d,q),e=i(e,r);return(n(b)+n(c)+n(d)+n(e)).toLowerCase();};
"use strict";exports.BattleText={Default:{},gen9indigostarstorm:{}};
"use strict";exports.BattleTextAFD={
"default":{






























mega:"  [POKEMON]'s [ITEM] glows!",
megaNoItem:"  [POKEMON]'s lack of Mega Stone glows!",
megaGen6:"  [POKEMON]'s [ITEM] glows!",
transformMega:"[POKEMON] thinks it's a big deal!",
primal:"[POKEMON]'s reversion! It got nostalgic about the old days!",
zPower:"  [POKEMON] is about to stop holding back!",
zBroken:"  [POKEMON]'s shields are failing!",
terastallize:"  [POKEMON] is cosplaying as [TYPE]-type!",




cant:"[POKEMON] can't use [MOVE]!",
cantNoMove:"[POKEMON] can't move!",
fail:"  Things did not go as planned!",



transform:"[POKEMON] transformed!",
typeChange:"  [POKEMON] transformed into the [TYPE] type!",
typeChangeFromEffect:"  [POKEMON]'s [EFFECT] made it the [TYPE] type!",
typeAdd:"  [TYPE] type was added to [POKEMON]!",

start:"  ([EFFECT] started on [POKEMON]!)",
end:"  [POKEMON] was freed from [EFFECT]!",
activate:"  ([EFFECT] activated!)",
startTeamEffect:"  ([EFFECT] started on [TEAM]!)",
endTeamEffect:"  ([EFFECT] ended on [TEAM]!)",
startFieldEffect:"  ([EFFECT] started!)",
endFieldEffect:"  ([EFFECT] ended!)",

changeAbility:"  [POKEMON] acquired [ABILITY]!",
addItem:"  [POKEMON] obtained one [ITEM].",
takeItem:"  [POKEMON] stole [SOURCE]'s [ITEM]!",
eatItem:"  [POKEMON] ate its [ITEM]!",
useGem:"  The [ITEM] strengthened [POKEMON]'s power!",
eatItemWeaken:"  The [ITEM] weakened damage to [POKEMON]!",
removeItem:"  [POKEMON] lost its [ITEM]!",
activateItem:"  ([POKEMON] used its [ITEM]!)",
activateWeaken:"  The [ITEM] weakened the damage to [POKEMON]!",

damage:"  ([POKEMON] was hurt!)",
damagePercentage:"  ([POKEMON] lost [PERCENTAGE] of its health!)",
damageFromPokemon:"  [POKEMON] is hurt by [SOURCE]'s [ITEM]!",
damageFromItem:"  [POKEMON] is hurt by its [ITEM]!",
damageFromPartialTrapping:"  [POKEMON] is hurt by [MOVE]!",
heal:"  [POKEMON] restored its HP.",
healFromZEffect:"  [POKEMON] restored its HP using its Z-Power!",
healFromEffect:"  [POKEMON] restored HP using its [EFFECT]!",

boost:"  [POKEMON]'s [STAT] increased!",
boost2:"  [POKEMON]'s [STAT] increased twice!",
boost3:"  [POKEMON]'s [STAT] increased a lot!",
boost0:"  [POKEMON]'s [STAT] won't go any higher!",
boostFromItem:"  The [ITEM] raised [POKEMON]'s [STAT]!",
boost2FromItem:"  The [ITEM] raised [POKEMON]'s [STAT] twice!",
boost3FromItem:"  The [ITEM] raised [POKEMON]'s [STAT] a lot!",
boostFromZEffect:"  [POKEMON] boosted its [STAT] using its Z-Power!",
boost2FromZEffect:"  [POKEMON] boosted its [STAT] twice using its Z-Power!",
boost3FromZEffect:"  [POKEMON] boosted its [STAT] a lot using its Z-Power!",
boostMultipleFromZEffect:"  [POKEMON] boosted its stats using its Z-Power!",

unboost:"  [POKEMON]'s [STAT] was lowered!",
unboost2:"  [POKEMON]'s [STAT] was lowered twice!",
unboost3:"  [POKEMON]'s [STAT] was lowered a lot!",
unboost0:"  [POKEMON]'s [STAT] won't go any lower!",
unboostFromItem:"  The [ITEM] lowered [POKEMON]'s [STAT]!",
unboost2FromItem:"  The [ITEM] lowered [POKEMON]'s [STAT] twice!",
unboost3FromItem:"  The [ITEM] lowered [POKEMON]'s [STAT] a lot!",

swapBoost:"  [POKEMON] switched stat changes with its target!",
swapOffensiveBoost:"  [POKEMON] switched all changes to its Strength and Intelligence with its target!",
swapDefensiveBoost:"  [POKEMON] switched all changes to its Armor and Resistance with its target!",
copyBoost:"  [POKEMON] copied [TARGET]'s stat changes!",
clearBoost:"  [POKEMON]'s stat changes were removed!",
clearBoostFromZEffect:"  [POKEMON] returned its decreased stats to normal using its Z-Power!",
invertBoost:"  [POKEMON]'s stat changes were inverted!",
clearAllBoost:"  All stat changes were eliminated!",

superEffective:"  It hit its enemy's weakness!",
superEffectiveSpread:"  It hit [POKEMON]'s weakness!",
resisted:"  It was resisted...",
resistedSpread:"  [POKEMON] resisted the attack.",
crit:"  A lucky hit! Remember to buy crit insurance!",
critSpread:"  A lucky hit on [POKEMON]! How dare you!",
immune:"  [POKEMON] is immune to such dastardly tricks!",
immuneNoPokemon:"  The foe was immune!",
immuneOHKO:"  [POKEMON] is unaffected!",
miss:"  [POKEMON] avoided the attack!",
missNoPokemon:"  [SOURCE]'s attack missed!",

center:"  Automatic center!",
noTarget:"  But there was no target...",
ohko:"  It's a one-hit KO!",
combine:"  The two moves have become one! It's a combined move!",
hitCount:"  Hit [NUMBER] times!",
hitCountSingular:"  Hit 1 time!"
},
dynamax:{

start:"  ([POKEMON]'s Tinymax!)",
end:"  ([POKEMON] returned to normal!)",
block:"  The move was blocked by the power of Tinymax!",
fail:"  [POKEMON] shook its head. It seems like it can't use this move..."
},


hp:{
statName:"Constitution",
statShortName:"HP"
},
atk:{
statName:"Strength",
statShortName:"Atk"
},
def:{
statName:"Armor",
statShortName:"Def"
},
spa:{
statName:"Intelligence",
statShortName:"SpA"
},
spd:{
statName:"Resistance",
statShortName:"SpD"
},
spe:{
statName:"Agility",
statShortName:"Spe"
},
accuracy:{
statName:"accuracy"
},
evasion:{
statName:"evasiveness"
},
spc:{
statName:"Intelligence",
statShortName:"Spc"
},
stats:{
statName:"stats"
},


confusion:{
start:"  [POKEMON] became confused!",
startFromFatigue:"  [POKEMON] became confused due to fatigue!",
end:"  [POKEMON] snapped out of its confusion!",
endFromItem:"  [POKEMON]'s [ITEM] snapped it out of its confusion!",
alreadyStarted:"  [POKEMON] is already confused!",
activate:"  [POKEMON] is confused!",
damage:"It hurt itself in its confusion!"
},
drain:{
heal:"  [SOURCE] will find its attacker's health restored!"
},
flinch:{
cant:"[POKEMON] flinched and couldn't move!"
},
healreplacement:{
activate:"  [POKEMON] will restore its replacement's HP using its Z-Power!"
},
nopp:{
cant:"[POKEMON] used [MOVE]!\n  But there was no PP left for the move!"
},
recharge:{
cant:"[POKEMON] must recharge!"
},
recoil:{
damage:"  [POKEMON] is damaged by the recoil!"
},
unboost:{
fail:"  [POKEMON]'s stats were not lowered!",
failSingular:"  [POKEMON]'s [STAT] was not lowered!"
},
struggle:{
activate:"  [POKEMON] has no moves left!"
},
trapped:{
start:"  [POKEMON] can no longer escape!"
}
};

exports.BattleTextNotAFD=exports.BattleText;
"use strict";/**
 * Text parser
 *
 * No dependencies
 * Optional dependency: BattleText
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */var







BattleTextParser=function(){














function BattleTextParser(){var perspective=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'p1';this.p1="Player 1";this.p2="Player 2";this.p3="Player 3";this.p4="Player 4";this.perspective=void 0;this.gen=9;this.turn=0;this.curLineSection='break';this.lowercaseRegExp=undefined;this.











































































































































































































































pokemonName=function(pokemon){
if(!pokemon)return'';
if(!pokemon.startsWith('p'))return"???pokemon:"+pokemon+"???";
if(pokemon.charAt(3)===':')return BattleTextParser.escapeReplace(pokemon.slice(4).trim());else
if(pokemon.charAt(2)===':')return BattleTextParser.escapeReplace(pokemon.slice(3).trim());
return"???pokemon:"+pokemon+"???";
};this.perspective=perspective;}BattleTextParser.parseLine=function parseLine(line,noDefault){if(!line.startsWith('|')){return['',line];}if(line==='|'){return['done'];}var index=line.indexOf('|',1);var cmd=line.slice(1,index);switch(cmd){case'chatmsg':case'chatmsg-raw':case'raw':case'error':case'html':case'inactive':case'inactiveoff':case'warning':case'fieldhtml':case'controlshtml':case'pagehtml':case'bigerror':case'debug':case'tier':case'challstr':case'popup':case'':return[cmd,line.slice(index+1)];case'c':case'chat':case'uhtml':case'uhtmlchange':case'queryresponse':case'showteam':var index2a=line.indexOf('|',index+1);return[cmd,line.slice(index+1,index2a),line.slice(index2a+1)];case'c:':case'pm':var index2b=line.indexOf('|',index+1);var index3b=line.indexOf('|',index2b+1);return[cmd,line.slice(index+1,index2b),line.slice(index2b+1,index3b),line.slice(index3b+1)];}if(noDefault)return null;return line.slice(1).split('|');};BattleTextParser.parseBattleLine=function parseBattleLine(line){var args=this.parseLine(line,true);if(args)return{args:args,kwArgs:{}};args=line.slice(1).split('|');var kwArgs={};while(args.length>1){var lastArg=args[args.length-1];if(!lastArg.startsWith('['))break;var bracketPos=lastArg.indexOf(']');if(bracketPos<=0)break;kwArgs[lastArg.slice(1,bracketPos)]=lastArg.slice(bracketPos+1).trim()||'.';args.pop();}return BattleTextParser.upgradeArgs({args:args,kwArgs:kwArgs});};BattleTextParser.parseNameParts=function parseNameParts(text){var group='';if(!/[A-Za-z0-9]/.test(text.charAt(0))){group=text.charAt(0);text=text.slice(1);}var name=text;var atIndex=text.indexOf('@');var status='';var away=false;if(atIndex>0){name=text.slice(0,atIndex);status=text.slice(atIndex+1);if(status.startsWith('!')){away=true;status=status.slice(1);}}return{group:group,name:name,away:away,status:status};};BattleTextParser.upgradeArgs=function upgradeArgs(_ref){var args=_ref.args,kwArgs=_ref.kwArgs;switch(args[0]){case'-activate':{if(kwArgs.item||kwArgs.move||kwArgs.number||kwArgs.ability)return{args:args,kwArgs:kwArgs};var _args=args,pokemon=_args[1],effect=_args[2],arg3=_args[3],arg4=_args[4];var target=kwArgs.of;var id=BattleTextParser.effectId(effect);if(kwArgs.block)return{args:['-fail',pokemon],kwArgs:kwArgs};if(id==='wonderguard')return{args:['-immune',pokemon],kwArgs:{from:'ability:Wonder Guard'}};if(id==='beatup'&&kwArgs.of)return{args:args,kwArgs:{name:kwArgs.of}};if(['ingrain','quickguard','wideguard','craftyshield','matblock','protect','mist','safeguard','electricterrain','mistyterrain','psychicterrain','telepathy','stickyhold','suctioncups','aromaveil','flowerveil','sweetveil','disguise','safetygoggles','protectivepads'].includes(id)){if(target){kwArgs.of=pokemon;return{args:['-block',target,effect,arg3],kwArgs:kwArgs};}return{args:['-block',pokemon,effect,arg3],kwArgs:kwArgs};}if(id==='charge'){return{args:['-singlemove',pokemon,effect],kwArgs:{of:target}};}if(['bind','wrap','clamp','whirlpool','firespin','magmastorm','sandtomb','infestation','snaptrap','thundercage','trapped'].includes(id)){return{args:['-start',pokemon,effect],kwArgs:{of:target}};}if(id==='fairylock'){return{args:['-fieldactivate',effect],kwArgs:{}};}if(id==='symbiosis'||id==='poltergeist'){kwArgs.item=arg3;}else if(id==='magnitude'){kwArgs.number=arg3;}else if(id==='skillswap'||id==='mummy'||id==='lingeringaroma'||id==='wanderingspirit'){kwArgs.ability=arg3;kwArgs.ability2=arg4;}else if(['eeriespell','gmaxdepletion','spite','grudge','forewarn','sketch','leppaberry','mysteryberry'].includes(id)){kwArgs.move=arg3;kwArgs.number=arg4;}args=['-activate',pokemon,effect,target||''];break;}case'-fail':{if(kwArgs.from==='ability: Flower Veil'){return{args:['-block',kwArgs.of,'ability: Flower Veil'],kwArgs:{of:args[1]}};}break;}case'-start':{if(kwArgs.from==='Protean'||kwArgs.from==='Color Change')kwArgs.from='ability:'+kwArgs.from;break;}case'move':{if(kwArgs.from==='Magic Bounce')kwArgs.from='ability:Magic Bounce';break;}case'cant':{var _args2=args,_pokemon2=_args2[1],_effect2=_args2[2],move=_args2[3];if(['ability: Damp','ability: Dazzling','ability: Queenly Majesty','ability: Armor Tail'].includes(_effect2)){args[0]='-block';return{args:['-block',_pokemon2,_effect2,move,kwArgs.of],kwArgs:{}};}break;}case'-heal':{var _id=BattleTextParser.effectId(kwArgs.from);if(['dryskin','eartheater','voltabsorb','waterabsorb'].includes(_id))kwArgs.of='';break;}case'-restoreboost':{args[0]='-clearnegativeboost';break;}case'-weather':{if(args[1]==='Snow')args[1]='Snowscape';break;}case'-ability':{if(args[3]&&(args[3].startsWith('p1')||args[3].startsWith('p2')||args[3]==='boost')){args[4]=args[3];args[3]='';}break;}case'-nothing':return{args:['-activate','','move:Splash'],kwArgs:kwArgs};}return{args:args,kwArgs:kwArgs};};var _proto=BattleTextParser.prototype;_proto.extractMessage=function extractMessage(buf){var out='';for(var _i2=0,_buf$split2=buf.split('\n');_i2<_buf$split2.length;_i2++){var _line=_buf$split2[_i2];var _BattleTextParser$par=BattleTextParser.parseBattleLine(_line),args=_BattleTextParser$par.args,kwArgs=_BattleTextParser$par.kwArgs;out+=this.parseArgs(args,kwArgs)||'';}return out;};_proto.fixLowercase=function fixLowercase(input){if(this.lowercaseRegExp===undefined){var prefixes=['pokemon','opposingPokemon','team','opposingTeam','party','opposingParty'].map(function(templateId){var template=BattleText["default"][templateId];if(template.startsWith(template.charAt(0).toUpperCase()))return'';var bracketIndex=template.indexOf('[');if(bracketIndex>=0)return template.slice(0,bracketIndex);return template;}).filter(function(prefix){return prefix;});if(prefixes.length){var buf="((?:^|\n)(?:  |  \\(|\\[)?)("+prefixes.map(BattleTextParser.escapeRegExp).join('|')+")";this.lowercaseRegExp=new RegExp(buf,'g');}else{this.lowercaseRegExp=null;}}if(!this.lowercaseRegExp)return input;return input.replace(this.lowercaseRegExp,function(match,p1,p2){return p1+p2.charAt(0).toUpperCase()+p2.slice(1);});};BattleTextParser.escapeRegExp=function escapeRegExp(input){return input.replace(/[\\^$.*+?()[\]{}|]/g,'\\$&');};BattleTextParser.escapeReplace=function escapeReplace(input){return input.replace(/\$/g,'$$$$');};_proto.


pokemon=function pokemon(_pokemon){
if(!_pokemon)return'';
var side=_pokemon.slice(0,2);
if(!['p1','p2','p3','p4'].includes(side))return"???pokemon:"+_pokemon+"???";
var name=this.pokemonName(_pokemon);
var isNear=side===this.perspective||side===BattleTextParser.allyID(side);
var template=BattleText["default"][isNear?'pokemon':'opposingPokemon'];
return template.replace('[NICKNAME]',name).replace(/\$/g,'$$$$');
};_proto.


pokemonFull=function pokemonFull(pokemon,details){
var nickname=this.pokemonName(pokemon);

var species=details.split(',')[0];
if(nickname===species)return[pokemon.slice(0,2),"**"+species+"**"];
return[pokemon.slice(0,2),nickname+" (**"+species+"**)"];
};_proto.

trainer=function trainer(side){
side=side.slice(0,2);
if(side==='p1')return this.p1;
if(side==='p2')return this.p2;
if(side==='p3')return this.p3;
if(side==='p4')return this.p4;
return"???side:"+side+"???";
};BattleTextParser.

allyID=function allyID(sideid){
if(sideid==='p1')return'p3';
if(sideid==='p2')return'p4';
if(sideid==='p3')return'p1';
if(sideid==='p4')return'p2';
return'';
};_proto.

team=function team(side){var isFar=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;
side=side.slice(0,2);
if(side===this.perspective||side===BattleTextParser.allyID(side)){
return!isFar?BattleText["default"].team:BattleText["default"].opposingTeam;
}
return isFar?BattleText["default"].team:BattleText["default"].opposingTeam;
};_proto.

own=function own(side){
side=side.slice(0,2);
if(side===this.perspective){
return'OWN';
}
return'';
};_proto.

party=function party(side){
side=side.slice(0,2);
if(side===this.perspective||side===BattleTextParser.allyID(side)){
return BattleText["default"].party;
}
return BattleText["default"].opposingParty;
};BattleTextParser.

effectId=function effectId(effect){
if(!effect)return'';
if(effect.startsWith('item:')||effect.startsWith('move:')){
effect=effect.slice(5);
}else if(effect.startsWith('ability:')){
effect=effect.slice(8);
}
return toID(effect);
};_proto.

effect=function effect(_effect){
if(!_effect)return'';
if(_effect.startsWith('item:')||_effect.startsWith('move:')){
_effect=_effect.slice(5);
}else if(_effect.startsWith('ability:')){
_effect=_effect.slice(8);
}
return _effect.trim();
};_proto.

template=function template(type){for(var _len=arguments.length,namespaces=new Array(_len>1?_len-1:0),_key=1;_key<_len;_key++){namespaces[_key-1]=arguments[_key];}for(var _i4=0;_i4<
namespaces.length;_i4++){var namespace=namespaces[_i4];
if(!namespace)continue;
if(namespace==='OWN'){
return BattleText["default"][type+'Own']+'\n';
}
if(namespace==='NODEFAULT'){
return'';
}
var id=BattleTextParser.effectId(namespace);
if(BattleText[id]&&type in BattleText[id]){
if(BattleText[id][type].charAt(1)==='.')type=BattleText[id][type].slice(2);
if(BattleText[id][type].startsWith('#'))id=BattleText[id][type].slice(1);
if(!BattleText[id][type])return'';
var _template=BattleText[id][type];
for(var i=Dex.gen-1;i>=this.gen;i--){
var curTemplate=BattleText[id][type+"Gen"+i];
if(curTemplate)_template=curTemplate;
}
return _template+'\n';
}
}
if(!BattleText["default"][type])return'';
var template=BattleText["default"][type];
for(var _i5=Dex.gen-1;_i5>=this.gen;_i5--){
var _curTemplate=BattleText["default"][type+"Gen"+_i5];
if(_curTemplate)template=_curTemplate;
}
return template+'\n';
};_proto.

maybeAbility=function maybeAbility(effect,holder){
if(!effect)return'';
if(!effect.startsWith('ability:'))return'';
return this.ability(effect.slice(8).trim(),holder);
};_proto.

ability=function ability(name,holder){
if(!name)return'';
return BattleText["default"].abilityActivation.replace('[POKEMON]',this.pokemon(holder)).replace('[ABILITY]',this.effect(name))+'\n';
};BattleTextParser.

stat=function stat(_stat){
var entry=BattleText[_stat||"stats"];
if(!(entry!=null&&entry.statName))return"???stat:"+_stat+"???";
return entry.statName;
};_proto.

lineSection=function lineSection(args,kwArgs){
if(kwArgs.premajor)return'preMajor';
if(kwArgs.postmajor)return'postMajor';
if(kwArgs.major)return'major';

var cmd=args[0];
switch(cmd){
case'done':case'turn':
return'break';
case'move':case'cant':case'switch':case'drag':case'upkeep':case'start':
case'-mega':case'-candynamax':case'-terastallize':
return'major';
case'switchout':case'faint':
return'preMajor';
case'-zpower':
return'postMajor';
case'-damage':{
var id=BattleTextParser.effectId(kwArgs.from);
if(id==='confusion')return'major';
return'postMajor';
}
case'-curestatus':{
var _id2=BattleTextParser.effectId(kwArgs.from);
if(_id2==='naturalcure')return'preMajor';
return'postMajor';
}
case'-start':{
var _id3=BattleTextParser.effectId(kwArgs.from);
if(_id3==='protean')return'preMajor';
return'postMajor';
}
case'-activate':{
var _id4=BattleTextParser.effectId(args[2]);
if(_id4==='confusion'||_id4==='attract')return'preMajor';
return'postMajor';
}
}
return cmd.startsWith('-')?'postMajor':'';
};_proto.

sectionBreak=function sectionBreak(args,kwArgs){
var prevSection=this.curLineSection;
var curSection=this.lineSection(args,kwArgs);
if(!curSection)return false;
this.curLineSection=curSection;
switch(curSection){
case'break':
if(prevSection!=='break')return true;
return false;
case'preMajor':
case'major':
if(prevSection==='postMajor'||prevSection==='major')return true;
return false;
case'postMajor':
return false;
}
};_proto.

parseArgs=function parseArgs(args,kwArgs,noSectionBreak){
var buf=!noSectionBreak&&this.sectionBreak(args,kwArgs)?'\n':'';
return buf+this.fixLowercase(this.parseArgsInner(args,kwArgs)||'');
};_proto.

parseArgsInner=function parseArgsInner(args,kwArgs){
var cmd=args[0];
switch(cmd){
case'player':{
var side=args[1],name=args[2];
if(side==='p1'&&name){
this.p1=BattleTextParser.escapeReplace(name);
}else if(side==='p2'&&name){
this.p2=BattleTextParser.escapeReplace(name);
}else if(side==='p3'&&name){
this.p3=BattleTextParser.escapeReplace(name);
}else if(side==='p4'&&name){
this.p4=BattleTextParser.escapeReplace(name);
}
return'';
}

case'gen':{
var num=args[1];
this.gen=parseInt(num,10);
return'';
}

case'turn':{
var _num=args[1];
this.turn=Number.parseInt(_num,10);
return this.template('turn').replace('[NUMBER]',_num)+'\n';
}

case'start':{
return this.template('startBattle').replace('[TRAINER]',this.p1).replace('[TRAINER]',this.p2);
}

case'win':case'tie':{
var _name=args[1];
if(cmd==='tie'||!_name){
return this.template('tieBattle').replace('[TRAINER]',this.p1).replace('[TRAINER]',this.p2);
}
return this.template('winBattle').replace('[TRAINER]',_name);
}

case'switch':{
var pokemon=args[1],details=args[2];
var _this$pokemonFull=this.pokemonFull(pokemon,details),_side=_this$pokemonFull[0],fullname=_this$pokemonFull[1];
var template=this.template('switchIn',this.own(_side));
return template.replace('[TRAINER]',this.trainer(_side)).replace('[FULLNAME]',fullname);
}

case'drag':{
var _pokemon3=args[1],_details=args[2];
var _this$pokemonFull2=this.pokemonFull(_pokemon3,_details),_side2=_this$pokemonFull2[0],_fullname=_this$pokemonFull2[1];
var _template2=this.template('drag');
return _template2.replace('[TRAINER]',this.trainer(_side2)).replace('[FULLNAME]',_fullname);
}

case'detailschange':case'-transform':case'-formechange':{
var _pokemon4=args[1],arg2=args[2],arg3=args[3];
var newSpecies='';
switch(cmd){
case'detailschange':newSpecies=arg2.split(',')[0].trim();break;
case'-transform':newSpecies=arg3;break;
case'-formechange':newSpecies=arg2;break;
}
var newSpeciesId=toID(newSpecies);
var id='';
var templateName='transform';
if(cmd!=='-transform'){
switch(newSpeciesId){
case'greninjaash':id='battlebond';break;
case'mimikyubusted':id='disguise';break;
case'zygardecomplete':id='powerconstruct';break;
case'necrozmaultra':id='ultranecroziumz';break;
case'darmanitanzen':id='zenmode';break;
case'darmanitan':id='zenmode';templateName='transformEnd';break;
case'darmanitangalarzen':id='zenmode';break;
case'darmanitangalar':id='zenmode';templateName='transformEnd';break;
case'aegislashblade':id='stancechange';break;
case'aegislash':id='stancechange';templateName='transformEnd';break;
case'wishiwashischool':id='schooling';break;
case'wishiwashi':id='schooling';templateName='transformEnd';break;
case'miniormeteor':id='shieldsdown';break;
case'minior':id='shieldsdown';templateName='transformEnd';break;
case'eiscuenoice':id='iceface';break;
case'eiscue':id='iceface';templateName='transformEnd';break;
case'terapagosterastal':id='terashift';break;
}
}else if(newSpecies){
id='transform';
}
var _template3=this.template(templateName,id,kwArgs.msg?'':'NODEFAULT');
var line1=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon4);
return line1+_template3.replace('[POKEMON]',this.pokemon(_pokemon4)).replace('[SPECIES]',newSpecies);
}

case'switchout':{
var _pokemon5=args[1];
var _side3=_pokemon5.slice(0,2);
var _template4=this.template('switchOut',kwArgs.from,this.own(_side3));
return _template4.replace('[TRAINER]',this.trainer(_side3)).replace('[NICKNAME]',this.pokemonName(_pokemon5)).replace('[POKEMON]',this.pokemon(_pokemon5));
}

case'faint':{
var _pokemon6=args[1];
var _template5=this.template('faint');
return _template5.replace('[POKEMON]',this.pokemon(_pokemon6));
}

case'swap':{
var _pokemon7=args[1],target=args[2];
if(!target||!isNaN(Number(target))){
var _template6=this.template('swapCenter');
return _template6.replace('[POKEMON]',this.pokemon(_pokemon7));
}
var _template7=this.template('swap');
return _template7.replace('[POKEMON]',this.pokemon(_pokemon7)).replace('[TARGET]',this.pokemon(target));
}

case'move':{
var _pokemon8=args[1],move=args[2];
var _line2=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon8);
if(kwArgs.zeffect){
_line2=this.template('zEffect').replace('[POKEMON]',this.pokemon(_pokemon8));
}
var _template8=this.template('move',kwArgs.from);
return _line2+_template8.replace('[POKEMON]',this.pokemon(_pokemon8)).replace('[MOVE]',move);
}

case'cant':{
var _pokemon9=args[1],effect=args[2],_move=args[3];
var _template9=this.template('cant',effect,'NODEFAULT')||
this.template(_move?'cant':'cantNoMove');
var _line3=this.maybeAbility(effect,kwArgs.of||_pokemon9);
return _line3+_template9.replace('[POKEMON]',this.pokemon(_pokemon9)).replace('[MOVE]',_move);
}

case'-candynamax':{
var _side4=args[1];
var own=this.own(_side4);
var _template10='';
if(this.turn===1){
if(own)_template10=this.template('canDynamax',own);
}else{
_template10=this.template('canDynamax',own);
}
return _template10.replace('[TRAINER]',this.trainer(_side4));
}

case'message':{
var message=args[1];
return''+message+'\n';
}

case'-start':{var _kwArgs$from;
var _pokemon10=args[1],_effect3=args[2],_arg=args[3];
var _line4=this.maybeAbility(_effect3,_pokemon10)||this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon10);
var _id5=BattleTextParser.effectId(_effect3);
if(_id5==='typechange'){
var _template11=this.template('typeChange',kwArgs.from);
return _line4+_template11.replace('[POKEMON]',this.pokemon(_pokemon10)).replace('[TYPE]',_arg).
replace('[SOURCE]',this.pokemon(kwArgs.of));
}
if(_id5==='typeadd'){
var _template12=this.template('typeAdd',kwArgs.from);
return _line4+_template12.replace('[POKEMON]',this.pokemon(_pokemon10)).replace('[TYPE]',_arg);
}
if(_id5.startsWith('stockpile')){
var _num2=_id5.slice(9);
var _template13=this.template('start','stockpile');
return _line4+_template13.replace('[POKEMON]',this.pokemon(_pokemon10)).replace('[NUMBER]',_num2);
}
if(_id5.startsWith('perish')){
var _num3=_id5.slice(6);
var _template14=this.template('activate','perishsong');
return _line4+_template14.replace('[POKEMON]',this.pokemon(_pokemon10)).replace('[NUMBER]',_num3);
}
if(_id5.startsWith('protosynthesis')||_id5.startsWith('quarkdrive')){
var stat=_id5.slice(-3);
var _template15=this.template('start',_id5.slice(0,_id5.length-3));
return _line4+_template15.replace('[POKEMON]',this.pokemon(_pokemon10)).replace('[STAT]',BattleTextParser.stat(stat));
}
var templateId='start';
if(kwArgs.already)templateId='alreadyStarted';
if(kwArgs.fatigue)templateId='startFromFatigue';
if(kwArgs.zeffect)templateId='startFromZEffect';
if(kwArgs.damage)templateId='activate';
if(kwArgs.block)templateId='block';
if(kwArgs.upkeep)templateId='upkeep';
if(templateId==='start'&&(_kwArgs$from=kwArgs.from)!=null&&_kwArgs$from.startsWith('item:')){
templateId+='FromItem';
}
var _template16=this.template(templateId,kwArgs.from,_effect3);
return _line4+_template16.replace('[POKEMON]',this.pokemon(_pokemon10)).replace('[EFFECT]',this.effect(_effect3)).
replace('[MOVE]',_arg).replace('[SOURCE]',this.pokemon(kwArgs.of)).replace('[ITEM]',this.effect(kwArgs.from));
}

case'-end':{var _kwArgs$from2;
var _pokemon11=args[1],_effect4=args[2];
var _line5=this.maybeAbility(_effect4,_pokemon11)||this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon11);
var _id6=BattleTextParser.effectId(_effect4);
if(_id6==='doomdesire'||_id6==='futuresight'){
var _template17=this.template('activate',_effect4);
return _line5+_template17.replace('[TARGET]',this.pokemon(_pokemon11));
}
var _templateId='end';
var _template18='';
if((_kwArgs$from2=kwArgs.from)!=null&&_kwArgs$from2.startsWith('item:')){
_template18=this.template('endFromItem',_effect4);
}
if(!_template18)_template18=this.template(_templateId,_effect4);
return _line5+_template18.replace('[POKEMON]',this.pokemon(_pokemon11)).replace('[EFFECT]',this.effect(_effect4)).
replace('[SOURCE]',this.pokemon(kwArgs.of)).replace('[ITEM]',this.effect(kwArgs.from));
}

case'-ability':{
var _pokemon12=args[1],ability=args[2],oldAbility=args[3];
var _line6='';
if(oldAbility)_line6+=this.ability(oldAbility,_pokemon12);
_line6+=this.ability(ability,_pokemon12);
if(kwArgs.fail){
var _template19=this.template('block',kwArgs.from);
return _line6+_template19;
}
if(kwArgs.from){
if(!oldAbility)_line6=this.maybeAbility(kwArgs.from,_pokemon12)+_line6;
var _template20=this.template('changeAbility',kwArgs.from);
return _line6+_template20.replace('[POKEMON]',this.pokemon(_pokemon12)).replace('[ABILITY]',this.effect(ability)).
replace('[SOURCE]',this.pokemon(kwArgs.of));
}
var _id7=BattleTextParser.effectId(ability);
if(_id7==='unnerve'){
var _template21=this.template('start',ability);
return _line6+_template21.replace('[TEAM]',this.team(_pokemon12.slice(0,2),true));
}
var _templateId2='start';
if(_id7==='anticipation'||_id7==='sturdy')_templateId2='activate';
var _template22=this.template(_templateId2,ability,'NODEFAULT');
return _line6+_template22.replace('[POKEMON]',this.pokemon(_pokemon12));
}

case'-endability':{
var _pokemon13=args[1],_ability=args[2];
if(_ability)return this.ability(_ability,_pokemon13);
var _line7=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon13);
var _template23=this.template('start','Gastro Acid');
return _line7+_template23.replace('[POKEMON]',this.pokemon(_pokemon13));
}

case'-item':{
var _pokemon14=args[1],item=args[2];
var _id8=BattleTextParser.effectId(kwArgs.from);
var _target='';
if(['magician','pickpocket'].includes(_id8)){var _ref2=
[kwArgs.of,''];_target=_ref2[0];kwArgs.of=_ref2[1];
}
var _line8=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon14);
if(['thief','covet','bestow','magician','pickpocket'].includes(_id8)){
var _template24=this.template('takeItem',kwArgs.from);
return _line8+_template24.replace('[POKEMON]',this.pokemon(_pokemon14)).replace('[ITEM]',this.effect(item)).
replace('[SOURCE]',this.pokemon(_target||kwArgs.of));
}
if(_id8==='frisk'){
var hasTarget=kwArgs.of&&_pokemon14&&kwArgs.of!==_pokemon14;
var _template25=this.template(hasTarget?'activate':'activateNoTarget',"Frisk");
return _line8+_template25.replace('[POKEMON]',this.pokemon(kwArgs.of)).replace('[ITEM]',this.effect(item)).
replace('[TARGET]',this.pokemon(_pokemon14));
}
if(kwArgs.from){
var _template26=this.template('addItem',kwArgs.from);
return _line8+_template26.replace('[POKEMON]',this.pokemon(_pokemon14)).replace('[ITEM]',this.effect(item));
}
var _template27=this.template('start',item,'NODEFAULT');
return _line8+_template27.replace('[POKEMON]',this.pokemon(_pokemon14));
}

case'-enditem':{
var _pokemon15=args[1],_item=args[2];
var _line9=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon15);
if(kwArgs.eat){
var _template28=this.template('eatItem',kwArgs.from);
return _line9+_template28.replace('[POKEMON]',this.pokemon(_pokemon15)).replace('[ITEM]',this.effect(_item));
}
var _id9=BattleTextParser.effectId(kwArgs.from);
if(_id9==='gem'){
var _template29=this.template('useGem',_item);
return _line9+_template29.replace('[POKEMON]',this.pokemon(_pokemon15)).replace('[ITEM]',this.effect(_item)).
replace('[MOVE]',kwArgs.move);
}
if(_id9==='stealeat'){
var _template30=this.template('removeItem',"Bug Bite");
return _line9+_template30.replace('[SOURCE]',this.pokemon(kwArgs.of)).replace('[ITEM]',this.effect(_item));
}
if(kwArgs.from){
var _template31=this.template('removeItem',kwArgs.from);
return _line9+_template31.replace('[POKEMON]',this.pokemon(_pokemon15)).replace('[ITEM]',this.effect(_item)).
replace('[SOURCE]',this.pokemon(kwArgs.of));
}
if(kwArgs.weaken){
var _template32=this.template('activateWeaken');
return _line9+_template32.replace('[POKEMON]',this.pokemon(_pokemon15)).replace('[ITEM]',this.effect(_item));
}
var _template33=this.template('end',_item,'NODEFAULT');
if(!_template33)_template33=this.template('activateItem').replace('[ITEM]',this.effect(_item));
return _line9+_template33.replace('[POKEMON]',this.pokemon(_pokemon15)).replace('[TARGET]',this.pokemon(kwArgs.of));
}

case'-status':{var _kwArgs$from3;
var _pokemon16=args[1],status=args[2];
var _line10=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon16);
if((_kwArgs$from3=kwArgs.from)!=null&&_kwArgs$from3.startsWith('item:')){
var _template34=this.template('startFromItem',status);
return _line10+_template34.replace('[POKEMON]',this.pokemon(_pokemon16)).replace('[ITEM]',this.effect(kwArgs.from));
}
if(BattleTextParser.effectId(kwArgs.from)==='rest'){
var _template35=this.template('startFromRest',status);
return _line10+_template35.replace('[POKEMON]',this.pokemon(_pokemon16));
}
var _template36=this.template('start',status);
return _line10+_template36.replace('[POKEMON]',this.pokemon(_pokemon16));
}

case'-curestatus':{var _kwArgs$from4;
var _pokemon17=args[1],_status=args[2];
if(BattleTextParser.effectId(kwArgs.from)==='naturalcure'){
var _template37=this.template('activate',kwArgs.from);
return _template37.replace('[POKEMON]',this.pokemon(_pokemon17));
}
var _line11=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon17);
if((_kwArgs$from4=kwArgs.from)!=null&&_kwArgs$from4.startsWith('item:')){
var _template38=this.template('endFromItem',_status);
return _line11+_template38.replace('[POKEMON]',this.pokemon(_pokemon17)).replace('[ITEM]',this.effect(kwArgs.from));
}
if(kwArgs.thaw){
var _template39=this.template('endFromMove',_status);
return _line11+_template39.replace('[POKEMON]',this.pokemon(_pokemon17)).replace('[MOVE]',this.effect(kwArgs.from));
}
var _template40=this.template('end',_status,'NODEFAULT');
if(!_template40)_template40=this.template('end').replace('[EFFECT]',_status);
return _line11+_template40.replace('[POKEMON]',this.pokemon(_pokemon17));
}

case'-cureteam':{
return this.template('activate',kwArgs.from);
}

case'-singleturn':case'-singlemove':{
var _pokemon18=args[1],_effect5=args[2];
var _line12=this.maybeAbility(_effect5,kwArgs.of||_pokemon18)||
this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon18);
var _id10=BattleTextParser.effectId(_effect5);
if(_id10==='instruct'){
var _template41=this.template('activate',_effect5);
return _line12+_template41.replace('[POKEMON]',this.pokemon(kwArgs.of)).replace('[TARGET]',this.pokemon(_pokemon18));
}
var _template42=this.template('start',_effect5,'NODEFAULT');
if(!_template42)_template42=this.template('start').replace('[EFFECT]',this.effect(_effect5));
return _line12+_template42.replace('[POKEMON]',this.pokemon(_pokemon18)).replace('[SOURCE]',this.pokemon(kwArgs.of)).
replace('[TEAM]',this.team(_pokemon18.slice(0,2)));
}

case'-sidestart':{
var _side5=args[1],_effect6=args[2];
var _template43=this.template('start',_effect6,'NODEFAULT');
if(!_template43)_template43=this.template('startTeamEffect').replace('[EFFECT]',this.effect(_effect6));
return _template43.replace('[TEAM]',this.team(_side5)).replace('[PARTY]',this.party(_side5));
}

case'-sideend':{
var _side6=args[1],_effect7=args[2];
var _template44=this.template('end',_effect7,'NODEFAULT');
if(!_template44)_template44=this.template('endTeamEffect').replace('[EFFECT]',this.effect(_effect7));
return _template44.replace('[TEAM]',this.team(_side6)).replace('[PARTY]',this.party(_side6));
}

case'-weather':{
var weather=args[1];
if(!weather||weather==='none'){
var _template45=this.template('end',kwArgs.from,'NODEFAULT');
if(!_template45)return this.template('endFieldEffect').replace('[EFFECT]',this.effect(weather));
return _template45;
}
if(kwArgs.upkeep){
return this.template('upkeep',weather,'NODEFAULT');
}
var _line13=this.maybeAbility(kwArgs.from,kwArgs.of);
var _template46=this.template('start',weather,'NODEFAULT');
if(!_template46)_template46=this.template('startFieldEffect').replace('[EFFECT]',this.effect(weather));
return _line13+_template46;
}

case'-fieldstart':case'-fieldactivate':{
var _effect8=args[1];
var _line14=this.maybeAbility(kwArgs.from,kwArgs.of);
if(BattleTextParser.effectId(kwArgs.from)==='hadronengine'){
return _line14+this.template('start','hadronengine').replace('[POKEMON]',this.pokemon(kwArgs.of));
}
var _templateId3=cmd.slice(6);
if(BattleTextParser.effectId(_effect8)==='perishsong')_templateId3='start';
var _template47=this.template(_templateId3,_effect8,'NODEFAULT');
if(!_template47)_template47=this.template('startFieldEffect').replace('[EFFECT]',this.effect(_effect8));
return _line14+_template47.replace('[POKEMON]',this.pokemon(kwArgs.of));
}

case'-fieldend':{
var _effect9=args[1];
var _template48=this.template('end',_effect9,'NODEFAULT');
if(!_template48)_template48=this.template('endFieldEffect').replace('[EFFECT]',this.effect(_effect9));
return _template48;
}

case'-sethp':{
var _effect10=kwArgs.from;
return this.template('activate',_effect10);
}

case'-message':{
var _message=args[1];
return'  '+_message+'\n';
}

case'-hint':{
var _message2=args[1];
return'  ('+_message2+')\n';
}

case'-activate':{
var _pokemon19=args[1],_effect11=args[2],_target2=args[3];
var _id11=BattleTextParser.effectId(_effect11);
if(_id11==='celebrate'){
return this.template('activate','celebrate').replace('[TRAINER]',this.trainer(_pokemon19.slice(0,2)));
}
if(!_target2&&
['hyperdrill','hyperspacefury','hyperspacehole','phantomforce','shadowforce','feint'].includes(_id11)){var _ref3=
[kwArgs.of,_pokemon19];_pokemon19=_ref3[0];_target2=_ref3[1];
if(!_pokemon19)_pokemon19=_target2;
}
if(!_target2)_target2=kwArgs.of||_pokemon19;

var _line15=this.maybeAbility(_effect11,_pokemon19);

if(_id11==='lockon'||_id11==='mindreader'){
var _template49=this.template('start',_effect11);
return _line15+_template49.replace('[POKEMON]',this.pokemon(kwArgs.of)).replace('[SOURCE]',this.pokemon(_pokemon19));
}

if((_id11==='mummy'||_id11==='lingeringaroma')&&kwArgs.ability){
_line15+=this.ability(kwArgs.ability,_target2);
_line15+=this.ability(_id11==='mummy'?'Mummy':'Lingering Aroma',_target2);
var _template50=this.template('changeAbility',_id11);
return _line15+_template50.replace('[TARGET]',this.pokemon(_target2));
}

if(_id11==='commander'){


if(_target2===_pokemon19)return _line15;
var _template51=this.template('activate',_id11);
return _line15+_template51.replace('[POKEMON]',this.pokemon(_pokemon19)).replace(/\[TARGET\]/g,this.pokemon(_target2));
}

var _templateId4='activate';
if(_id11==='forewarn'&&_pokemon19===_target2){
_templateId4='activateNoTarget';
}
if((_id11==='protosynthesis'||_id11==='quarkdrive')&&kwArgs.fromitem){
_templateId4='activateFromItem';
}
if(_id11==='orichalcumpulse'&&kwArgs.source){
_templateId4='start';
}
var _template52=this.template(_templateId4,_effect11,'NODEFAULT');
if(!_template52){
if(_line15)return _line15;
_template52=this.template('activate');
return _line15+_template52.replace('[EFFECT]',this.effect(_effect11));
}

if(_id11==='brickbreak'){
_template52=_template52.replace('[TEAM]',this.team(_target2.slice(0,2)));
}
if(kwArgs.ability){
_line15+=this.ability(kwArgs.ability,_pokemon19);
}
if(kwArgs.ability2){
_line15+=this.ability(kwArgs.ability2,_target2);
}
if(kwArgs.move||kwArgs.number||kwArgs.item||kwArgs.name){
_template52=_template52.replace('[MOVE]',kwArgs.move).replace('[NUMBER]',kwArgs.number).
replace('[ITEM]',kwArgs.item).replace('[NAME]',kwArgs.name);
}
return _line15+_template52.replace('[POKEMON]',this.pokemon(_pokemon19)).replace('[TARGET]',this.pokemon(_target2)).
replace('[SOURCE]',this.pokemon(kwArgs.of));
}

case'-prepare':{
var _pokemon20=args[1],_effect12=args[2],_target3=args[3];
var _template53=this.template('prepare',_effect12);
return _template53.replace('[POKEMON]',this.pokemon(_pokemon20)).replace('[TARGET]',this.pokemon(_target3));
}

case'-damage':{
var _pokemon21=args[1],percentage=args[3];
var _template54=this.template('damage',kwArgs.from,'NODEFAULT');
var _line16=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon21);
var _id12=BattleTextParser.effectId(kwArgs.from);
if(_template54){
return _line16+_template54.replace('[POKEMON]',this.pokemon(_pokemon21));
}

if(!kwArgs.from){
_template54=this.template(percentage?'damagePercentage':'damage');
return _line16+_template54.replace('[POKEMON]',this.pokemon(_pokemon21)).replace('[PERCENTAGE]',percentage);
}
if(kwArgs.from.startsWith('item:')){
_template54=this.template(kwArgs.of?'damageFromPokemon':'damageFromItem');
return _line16+_template54.replace('[POKEMON]',this.pokemon(_pokemon21)).replace('[ITEM]',this.effect(kwArgs.from)).
replace('[SOURCE]',this.pokemon(kwArgs.of));
}
if(kwArgs.partiallytrapped||_id12==='bind'||_id12==='wrap'){
_template54=this.template('damageFromPartialTrapping');
return _line16+_template54.replace('[POKEMON]',this.pokemon(_pokemon21)).replace('[MOVE]',this.effect(kwArgs.from));
}

_template54=this.template('damage');
return _line16+_template54.replace('[POKEMON]',this.pokemon(_pokemon21));
}

case'-heal':{
var _pokemon22=args[1];
var _template55=this.template('heal',kwArgs.from,'NODEFAULT');
var _line17=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon22);
if(_template55){
return _line17+_template55.replace('[POKEMON]',this.pokemon(_pokemon22)).replace('[SOURCE]',this.pokemon(kwArgs.of)).
replace('[NICKNAME]',kwArgs.wisher);
}

if(kwArgs.from&&!kwArgs.from.startsWith('ability:')){
_template55=this.template('healFromEffect');
return _line17+_template55.replace('[POKEMON]',this.pokemon(_pokemon22)).replace('[EFFECT]',this.effect(kwArgs.from));
}

_template55=this.template('heal');
return _line17+_template55.replace('[POKEMON]',this.pokemon(_pokemon22));
}

case'-boost':case'-unboost':{var _kwArgs$from5;
var _pokemon23=args[1],_stat2=args[2],_num4=args[3];
if(_stat2==='spa'&&this.gen===1)_stat2='spc';
var amount=parseInt(_num4,10);
var _line18=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon23);
var _templateId5=cmd.slice(1);
if(amount>=3)_templateId5+='3';else
if(amount>=2)_templateId5+='2';else
if(amount===0)_templateId5+='0';
if(amount&&kwArgs.zeffect){
_templateId5+=kwArgs.multiple?'MultipleFromZEffect':'FromZEffect';
}else if(amount&&(_kwArgs$from5=kwArgs.from)!=null&&_kwArgs$from5.startsWith('item:')){
var _template56=this.template(_templateId5+'FromItem',kwArgs.from);
return _line18+_template56.replace('[POKEMON]',this.pokemon(_pokemon23)).replace('[STAT]',BattleTextParser.stat(_stat2)).
replace('[ITEM]',this.effect(kwArgs.from));
}
var _template57=this.template(_templateId5,kwArgs.from);
return _line18+_template57.replace(/\[POKEMON\]/g,this.pokemon(_pokemon23)).replace('[STAT]',BattleTextParser.stat(_stat2));
}

case'-setboost':{
var _pokemon24=args[1];
var _effect13=kwArgs.from;
var _line19=this.maybeAbility(_effect13,kwArgs.of||_pokemon24);
var _template58=this.template('boost',_effect13);
return _line19+_template58.replace('[POKEMON]',this.pokemon(_pokemon24));
}

case'-swapboost':{
var _pokemon25=args[1],_target4=args[2];
var _line20=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon25);
var _id13=BattleTextParser.effectId(kwArgs.from);
var _templateId6='swapBoost';
if(_id13==='guardswap')_templateId6='swapDefensiveBoost';
if(_id13==='powerswap')_templateId6='swapOffensiveBoost';
var _template59=this.template(_templateId6,kwArgs.from);
return _line20+_template59.replace('[POKEMON]',this.pokemon(_pokemon25)).replace('[TARGET]',this.pokemon(_target4));
}

case'-copyboost':{
var _pokemon26=args[1],_target5=args[2];
var _line21=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon26);
var _template60=this.template('copyBoost',kwArgs.from);
return _line21+_template60.replace('[POKEMON]',this.pokemon(_pokemon26)).replace('[TARGET]',this.pokemon(_target5));
}

case'-clearboost':case'-clearpositiveboost':case'-clearnegativeboost':{
var _pokemon27=args[1],source=args[2];
var _line22=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon27);
var _templateId7='clearBoost';
if(kwArgs.zeffect)_templateId7='clearBoostFromZEffect';
var _template61=this.template(_templateId7,kwArgs.from);
return _line22+_template61.replace('[POKEMON]',this.pokemon(_pokemon27)).replace('[SOURCE]',this.pokemon(source));
}

case'-invertboost':{
var _pokemon28=args[1];
var _line23=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon28);
var _template62=this.template('invertBoost',kwArgs.from);
return _line23+_template62.replace('[POKEMON]',this.pokemon(_pokemon28));
}

case'-clearallboost':{
return this.template('clearAllBoost',kwArgs.from);
}

case'-crit':case'-supereffective':case'-resisted':{
var _pokemon29=args[1];
var _templateId8=cmd.slice(1);
if(_templateId8==='supereffective')_templateId8='superEffective';
if(kwArgs.spread)_templateId8+='Spread';
var _template63=this.template(_templateId8);
return _template63.replace('[POKEMON]',this.pokemon(_pokemon29));
}

case'-block':{
var _pokemon30=args[1],_effect14=args[2],_move2=args[3],attacker=args[4];
var _line24=this.maybeAbility(_effect14,kwArgs.of||_pokemon30);
var _template64=this.template('block',_effect14);
return _line24+_template64.replace('[POKEMON]',this.pokemon(_pokemon30)).
replace('[SOURCE]',this.pokemon(attacker||kwArgs.of)).replace('[MOVE]',_move2);
}

case'-fail':{
var _pokemon31=args[1],_effect15=args[2],_stat3=args[3];
var _id14=BattleTextParser.effectId(_effect15);
var blocker=BattleTextParser.effectId(kwArgs.from);
var _line25=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon31);
var _templateId9='block';
if(['desolateland','primordialsea'].includes(blocker)&&
!['sunnyday','raindance','sandstorm','hail','snowscape','chillyreception'].includes(_id14)){
_templateId9='blockMove';
}else if(blocker==='uproar'&&kwArgs.msg){
_templateId9='blockSelf';
}
var _template65=this.template(_templateId9,kwArgs.from);
if(_template65){
return _line25+_template65.replace('[POKEMON]',this.pokemon(_pokemon31));
}

if(_id14==='unboost'){
_template65=this.template(_stat3?'failSingular':'fail','unboost');
return _line25+_template65.replace('[POKEMON]',this.pokemon(_pokemon31)).replace('[STAT]',_stat3);
}

_templateId9='fail';
if(['brn','frz','par','psn','slp','substitute','shedtail'].includes(_id14)){
_templateId9='alreadyStarted';
}
if(kwArgs.heavy)_templateId9='failTooHeavy';
if(kwArgs.weak)_templateId9='fail';
if(kwArgs.forme)_templateId9='failWrongForme';
_template65=this.template(_templateId9,_id14);
return _line25+_template65.replace('[POKEMON]',this.pokemon(_pokemon31));
}

case'-immune':{
var _pokemon32=args[1];
var _line26=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon32);
var _template66=this.template('block',kwArgs.from);
if(!_template66){
var _templateId10=kwArgs.ohko?'immuneOHKO':'immune';
_template66=this.template(_pokemon32?_templateId10:'immuneNoPokemon',kwArgs.from);
}
return _line26+_template66.replace('[POKEMON]',this.pokemon(_pokemon32));
}

case'-miss':{
var _source=args[1],_pokemon33=args[2];
var _line27=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon33);
if(!_pokemon33){
var _template67=this.template('missNoPokemon');
return _line27+_template67.replace('[SOURCE]',this.pokemon(_source));
}
var _template68=this.template('miss');
return _line27+_template68.replace('[POKEMON]',this.pokemon(_pokemon33));
}

case'-center':case'-ohko':case'-combine':{
return this.template(cmd.slice(1));
}

case'-notarget':{
return this.template('noTarget');
}

case'-mega':case'-primal':{
var _pokemon34=args[1],species=args[2],_item2=args[3];
var _id15='';
var _templateId11=cmd.slice(1);
if(species==='Rayquaza'){
_id15='dragonascent';
_templateId11='megaNoItem';
}
if(!_item2&&cmd==='-mega')_templateId11='megaNoItem';
var _template69=this.template(_templateId11,_id15);
var _side7=_pokemon34.slice(0,2);
var pokemonName=this.pokemon(_pokemon34);
if(cmd==='-mega'){
var template2=this.template('transformMega');
_template69+=template2.replace('[POKEMON]',pokemonName).replace('[SPECIES]',species);
}
return _template69.replace('[POKEMON]',pokemonName).replace('[ITEM]',_item2).replace('[TRAINER]',this.trainer(_side7));
}

case'-terastallize':{
var _pokemon35=args[1],type=args[2];
var _id16='';
var _templateId12=cmd.slice(1);
var _template70=this.template(_templateId12,_id16);
var _pokemonName=this.pokemon(_pokemon35);
return _template70.replace('[POKEMON]',_pokemonName).replace('[TYPE]',type);
}

case'-zpower':{
var _pokemon36=args[1];
var _template71=this.template('zPower');
return _template71.replace('[POKEMON]',this.pokemon(_pokemon36));
}

case'-burst':{
var _pokemon37=args[1];
var _template72=this.template('activate',"Ultranecrozium Z");
return _template72.replace('[POKEMON]',this.pokemon(_pokemon37));
}

case'-zbroken':{
var _pokemon38=args[1];
var _template73=this.template('zBroken');
return _template73.replace('[POKEMON]',this.pokemon(_pokemon38));
}

case'-hitcount':{
var _num5=args[2];
if(_num5==='1'){
return this.template('hitCountSingular');
}
return this.template('hitCount').replace('[NUMBER]',_num5);
}

case'-waiting':{
var _pokemon39=args[1],_target6=args[2];
var _template74=this.template('activate',"Water Pledge");
return _template74.replace('[POKEMON]',this.pokemon(_pokemon39)).replace('[TARGET]',this.pokemon(_target6));
}

case'-anim':{
return'';
}

default:{
return null;
}
}
};return BattleTextParser;}();




if(typeof require==='function'){

global.BattleTextParser=BattleTextParser;
}

//# sourceMappingURL=battledata.js.map