"use strict";function _readOnlyError(r){throw new TypeError('"'+r+'" is read-only');}function _inheritsLoose(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,_setPrototypeOf(t,o);}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t;},_setPrototypeOf(t,e);}/**
 * Teambuilder team editor, extracted from the rest of the Preact
 * client so that it can be used in isolation.
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license AGPLv3
 */var






















TeamEditorState=function(_PSModel){











































function TeamEditorState(team){var _this;
_this=_PSModel.call(this)||this;_this.team=void 0;_this.sets=[];_this.lastPackedTeam='';_this.gen=Dex.gen;_this.dex=Dex;_this.deletedSet=null;_this.search=new DexSearch();_this.format="gen"+_this.gen;_this.searchIndex=0;_this.originalSpecies=null;_this.narrow=false;_this.selectionTypeOrder=['pokemon','ability','item','move','stats','details'];_this.innerFocus=null;_this.isLetsGo=false;_this.isNatDex=false;_this.isBDSP=false;_this.formeLegality='normal';_this.abilityLegality='normal';_this.defaultLevel=100;_this.readonly=false;_this.fetching=false;_this.userSetsCache={};_this.










































































































































































































































ignoreRows=['header','sortpokemon','sortmove','html'];_this.






































































































































































































































































































































































































































_sampleSetPromises={};_this.team=team;_this.updateTeam(false);_this.setFormat(team.format);window.search=_this.search;return _this;}_inheritsLoose(TeamEditorState,_PSModel);var _proto=TeamEditorState.prototype;_proto.updateTeam=function updateTeam(readonly){if(this.lastPackedTeam!==this.team.packedTeam){this.sets=Teams.unpack(this.team.packedTeam);this.lastPackedTeam=this.team.packedTeam;}this.readonly=readonly;};_proto.setFormat=function setFormat(format){var team=this.team;var formatid=toID(format);this.format=formatid;team.format=formatid;this.dex=Dex.forFormat(formatid);this.gen=this.dex.gen;format=toID(format).slice(4);this.isLetsGo=formatid.includes('letsgo');this.isNatDex=formatid.includes('nationaldex')||formatid.includes('natdex');this.isBDSP=formatid.includes('bdsp');if(formatid.includes('almostanyability')||formatid.includes('aaa')){this.abilityLegality='hackmons';}else{this.abilityLegality='normal';}if(formatid.includes('hackmons')||formatid.includes('bh')){this.formeLegality='hackmons';this.abilityLegality='hackmons';}else if(formatid.includes('metronome')||formatid.includes('customgame')){this.formeLegality='custom';this.abilityLegality='hackmons';}else{this.formeLegality='normal';}this.defaultLevel=100;if(formatid.includes('vgc')||formatid.includes('bss')||formatid.includes('ultrasinnohclassic')||formatid.includes('battlespot')||formatid.includes('battlestadium')||formatid.includes('battlefestival')){this.defaultLevel=50;}if(formatid.includes('lc')){this.defaultLevel=5;}};_proto.setSearchType=function setSearchType(type,i,value){var _this$search,_this$search$results;var set=this.sets[i];this.search.setType(type,this.format,set);this.originalSpecies=null;this.search.prependResults=null;if(type==='move'){this.search.prependResults=this.getSearchMoves(set);if(value&&this.search.prependResults.some(function(row){return row[1].split('_')[2]===toID(value);})){value='';}}else if(value){switch(type){case'pokemon':if(this.dex.species.get(value).exists){this.originalSpecies=value;this.search.prependResults=[['pokemon',toID(value)]];value='';}break;case'item':if(toID(value)==='noitem')value='';if(this.dex.items.get(value).exists){this.search.prependResults=[['item',toID(value)]];value='';}break;case'ability':if(toID(value)==='selectability')value='';if(toID(value)==='noability')value='';if(this.dex.abilities.get(value).exists){this.search.prependResults=[['ability',toID(value)]];value='';}break;}}if(type==='item')((_this$search=this.search).prependResults||(_this$search.prependResults=[])).push(['item','']);this.search.find(value||'');this.searchIndex=((_this$search$results=this.search.results)==null||(_this$search$results=_this$search$results[0])==null?void 0:_this$search$results[0])==='header'?1:0;};_proto.updateSearchMoves=function updateSearchMoves(set){var _this$search$prependR;var oldResultsLength=((_this$search$prependR=this.search.prependResults)==null?void 0:_this$search$prependR.length)||0;this.search.prependResults=this.getSearchMoves(set);this.searchIndex+=this.search.prependResults.length-oldResultsLength;if(this.searchIndex<0)this.searchIndex=0;this.search.results=null;if(this.search.query){this.setSearchValue('');}else{this.search.find('');}};_proto.getSearchMoves=function getSearchMoves(set){var out=[];for(var i=0;i<Math.max(set.moves.length,4);i++){out.push(['move',"_"+(i+1)+"_"+toID(set.moves[i]||'')]);}return out;};_proto.setSearchValue=function setSearchValue(value){var _this$search$results2;this.search.find(value);this.searchIndex=((_this$search$results2=this.search.results)==null||(_this$search$results2=_this$search$results2[0])==null?void 0:_this$search$results2[0])==='header'?1:0;};_proto.selectSearchValue=function selectSearchValue(){var _this$search$results3,_result;var result=(_this$search$results3=this.search.results)==null?void 0:_this$search$results3[this.searchIndex];if(((_result=result)==null?void 0:_result[0])==='header'){var _this$search$results4;this.searchIndex++;result=(_this$search$results4=this.search.results)==null?void 0:_this$search$results4[this.searchIndex];}if(!result)return null;if(this.search.addFilter(result)){this.searchIndex=0;return null;}return this.getResultValue(result);};_proto.changeSpecies=function changeSpecies(set,speciesName){var _this$getDefaultItem;var species=this.dex.species.get(speciesName);if(set.item===this.getDefaultItem(set.species))set.item=undefined;if(set.name===set.species.split('-')[0])delete set.name;set.species=species.name;set.ability=this.getDefaultAbility(set);set.item=(_this$getDefaultItem=this.getDefaultItem(species.name))!=null?_this$getDefaultItem:set.item;if(toID(speciesName)==='Cathy'){set.name="Cathy";set.species='Trevenant';set.level=undefined;set.gender='F';set.item='Starf Berry';set.ability='Harvest';set.moves=['Substitute','Horn Leech','Earthquake','Phantom Force'];set.evs={hp:36,atk:252,def:0,spa:0,spd:0,spe:220};set.ivs=undefined;set.nature='Jolly';}};_proto.deleteSet=function deleteSet(index){if(this.sets.length<=index)return;this.deletedSet={set:this.sets[index],index:index};this.sets.splice(index,1);};_proto.undeleteSet=function undeleteSet(){if(!this.deletedSet)return;this.sets.splice(this.deletedSet.index,0,this.deletedSet.set);this.deletedSet=null;};_proto.copySet=function copySet(index){var _TeamEditorState$clip,_TeamEditorState$clip2,_this$team$key;if(this.sets.length<=index)return;TeamEditorState.clipboard||(TeamEditorState.clipboard={teams:{},otherSets:null,readonly:false});(_TeamEditorState$clip=TeamEditorState.clipboard).teams||(_TeamEditorState$clip.teams={});(_TeamEditorState$clip2=TeamEditorState.clipboard.teams)[_this$team$key=this.team.key]||(_TeamEditorState$clip2[_this$team$key]={team:this.team,sets:{},entire:false});if(this.readonly)TeamEditorState.clipboard.readonly=true;if(TeamEditorState.clipboard.teams[this.team.key].sets[index]===this.sets[index]){delete TeamEditorState.clipboard.teams[this.team.key].sets[index];if(!Object.keys(TeamEditorState.clipboard.teams[this.team.key].sets).length){delete TeamEditorState.clipboard.teams[this.team.key];}if(!Object.keys(TeamEditorState.clipboard.teams).length){TeamEditorState.clipboard.teams=null;if(!TeamEditorState.clipboard.otherSets){TeamEditorState.clipboard=null;}}return;}TeamEditorState.clipboard.teams[this.team.key].sets[index]=this.sets[index];};_proto.pasteSet=function pasteSet(index,isMove){if(!TeamEditorState.clipboard)return;if(this.readonly)return;if(isMove){if(TeamEditorState.clipboard.readonly)return;for(var key in TeamEditorState.clipboard.teams){var clipboardTeam=TeamEditorState.clipboard.teams[key];var sources=Object.keys(clipboardTeam.sets).map(Number);sources.sort(function(a,b){return-(a-b);});for(var _i2=0;_i2<sources.length;_i2++){var source=sources[_i2];if(key===this.team.key){this.sets.splice(source,1);if(source<index)index--;}else{var team=clipboardTeam.team;var _sets=Teams.unpack(team.packedTeam);_sets.splice(source,1);team.packedTeam=Teams.pack(_sets);}}}}var sets=[];for(var _key in TeamEditorState.clipboard.teams){var _clipboardTeam=TeamEditorState.clipboard.teams[_key];for(var _i4=0,_Object$values2=Object.values(_clipboardTeam.sets);_i4<_Object$values2.length;_i4++){var set=_Object$values2[_i4];sets.push(set);}}sets.push.apply(sets,TeamEditorState.clipboard.otherSets||[]);for(var _i6=0;_i6<sets.length;_i6++){var _set=sets[_i6];var newSet=JSON.parse(JSON.stringify(_set));this.sets.splice(index,0,newSet);index++;}TeamEditorState.clipboard=null;};_proto.downSearchValue=function downSearchValue(){var _this$search$results$,_this$search$results$2;if(!this.search.results||this.searchIndex>=this.search.results.length-1)return;this.searchIndex++;if(this.ignoreRows.includes((_this$search$results$=this.search.results[this.searchIndex])==null?void 0:_this$search$results$[0])){if(this.searchIndex>=this.search.results.length-1)return;this.searchIndex++;}if(this.ignoreRows.includes((_this$search$results$2=this.search.results[this.searchIndex])==null?void 0:_this$search$results$2[0])){if(this.searchIndex>=this.search.results.length-1)return;this.searchIndex++;}};_proto.upSearchValue=function upSearchValue(){var _this$search$results$3,_this$search$results$4,_this$search$results$5;if(!this.search.results||this.searchIndex<=0)return;if(this.searchIndex<=1&&this.ignoreRows.includes((_this$search$results$3=this.search.results[0])==null?void 0:_this$search$results$3[0]))return;this.searchIndex--;if(this.ignoreRows.includes((_this$search$results$4=this.search.results[this.searchIndex])==null?void 0:_this$search$results$4[0])){if(this.searchIndex<=0)return;this.searchIndex--;}if(this.ignoreRows.includes((_this$search$results$5=this.search.results[this.searchIndex])==null?void 0:_this$search$results$5[0])){if(this.searchIndex<=0)return;this.searchIndex--;}};_proto.getResultValue=function getResultValue(result){switch(result[0]){case'pokemon':return this.dex.species.get(result[1]).name;case'item':return this.dex.items.get(result[1]).name;case'ability':return this.dex.abilities.get(result[1]).name;case'move':if(result[1].startsWith('_')){var _result$1$slice$split=result[1].slice(1).split('_'),slot=_result$1$slice$split[0],moveid=_result$1$slice$split[1];return this.dex.moves.get(moveid).name+'|'+slot;}return this.dex.moves.get(result[1]).name;case'html':case'header':return'';default:return result[1];}};_proto.canAdd=function canAdd(){return this.sets.length<6||this.team.isBox;};_proto.getHPType=function getHPType(set){if(set.hpType)return set.hpType;var hpMove=set.ivs?null:this.getHPMove(set);if(hpMove)return hpMove;var hpTypes=['Fighting','Flying','Poison','Ground','Rock','Bug','Ghost','Steel','Fire','Water','Grass','Electric','Psychic','Ice','Dragon','Dark'];if(this.gen<=2){if(!set.ivs)return'Dark';var atkDV=Math.floor(set.ivs.atk/2);var defDV=Math.floor(set.ivs.def/2);return hpTypes[4*(atkDV%4)+defDV%4];}else{var ivs=set.ivs||this.defaultIVs(set);var hpTypeX=0;var i=1;var statOrder=['hp','atk','def','spe','spa','spd'];for(var _i8=0;_i8<statOrder.length;_i8++){var s=statOrder[_i8];if(ivs[s]===undefined)ivs[s]=31;hpTypeX+=i*(ivs[s]%2);i*=2;}return hpTypes[Math.floor(hpTypeX*15/63)];}};_proto.hpTypeMatters=function hpTypeMatters(set){if(this.gen<2)return false;if(this.gen>7)return false;for(var _i10=0,_set$moves2=set.moves;_i10<_set$moves2.length;_i10++){var move=_set$moves2[_i10];var moveid=toID(move);if(moveid.startsWith('hiddenpower'))return true;if(moveid==='transform')return true;}if(toID(set.ability)==='imposter')return true;return false;};_proto.getHPMove=function getHPMove(set){if(set.moves){for(var _i12=0,_set$moves4=set.moves;_i12<_set$moves4.length;_i12++){var move=_set$moves4[_i12];var moveid=toID(move);if(moveid.startsWith('hiddenpower')){return moveid.charAt(11).toUpperCase()+moveid.slice(12);}}}return null;};_proto.getIVs=function getIVs(set){var ivs=this.defaultIVs(set);if(set.ivs)Object.assign(ivs,set.ivs);return ivs;};_proto.defaultIVs=function defaultIVs(set){var noGuess=arguments.length>1&&arguments[1]!==undefined?arguments[1]:!!set.ivs;var useIVs=this.gen>2;var defaultIVs={hp:31,atk:31,def:31,spa:31,spd:31,spe:31};if(!useIVs){for(var _i14=0,_Dex$statNames2=Dex.statNames;_i14<_Dex$statNames2.length;_i14++){var stat=_Dex$statNames2[_i14];defaultIVs[stat]=15;}}if(noGuess)return defaultIVs;var hpType=this.getHPMove(set);var hpModulo=useIVs?2:4;var _this$prefersMinStats=this.prefersMinStats(set),minAtk=_this$prefersMinStats.minAtk,minSpe=_this$prefersMinStats.minSpe;if(minAtk)defaultIVs['atk']=0;if(minSpe)defaultIVs['spe']=0;if(!useIVs){var hpDVs=hpType?this.dex.types.get(hpType).HPdvs:null;if(hpDVs){for(var _stat in hpDVs)defaultIVs[_stat]=hpDVs[_stat];}}else{var hpIVs=hpType?this.dex.types.get(hpType).HPivs:null;if(hpIVs){if(this.canHyperTrain(set)){var _hpIVs$spe,_hpIVs$atk;if(minSpe)defaultIVs['spe']=(_hpIVs$spe=hpIVs['spe'])!=null?_hpIVs$spe:31;if(minAtk)defaultIVs['atk']=(_hpIVs$atk=hpIVs['atk'])!=null?_hpIVs$atk:31;}else{for(var _stat2 in hpIVs)defaultIVs[_stat2]=hpIVs[_stat2];}}}if(hpType){if(minSpe)defaultIVs['spe']%=hpModulo;if(minAtk)defaultIVs['atk']%=hpModulo;}if(minAtk&&useIVs){if(['Gouging Fire','Iron Boulder','Iron Crown','Raging Bolt'].includes(set.species)){defaultIVs['atk']=20;}else if(set.species.startsWith('Terapagos')){defaultIVs['atk']=15;}}return defaultIVs;};_proto.defaultHappiness=function defaultHappiness(set){if(set.moves.includes('Return'))return 255;if(set.moves.includes('Frustration'))return 0;return undefined;};_proto.prefersMinStats=function prefersMinStats(set){var _set$evs,_set$evs2;var minSpe=!((_set$evs=set.evs)!=null&&_set$evs.spe)&&set.moves.includes('Gyro Ball');var minAtk=!((_set$evs2=set.evs)!=null&&_set$evs2.atk);if(set.species.startsWith('Terapagos'))minSpe=false;if(this.format==='gen7hiddentype')return{minAtk:minAtk,minSpe:minSpe};if(this.format.includes('1v1'))return{minAtk:minAtk,minSpe:minSpe};if(set.ability==='Battle Bond'||['Koraidon','Miraidon','Gimmighoul-Roaming'].includes(set.species)){minAtk=false;return{minAtk:minAtk,minSpe:minSpe};}if(!set.moves.length)minAtk=false;for(var _i16=0,_set$moves6=set.moves;_i16<_set$moves6.length;_i16++){var moveName=_set$moves6[_i16];if(!moveName)continue;var move=this.dex.moves.get(moveName);if(move.id==='transform'){var hasMoveBesidesTransform=set.moves.length>1;if(!hasMoveBesidesTransform)minAtk=false;}else if(move.category==='Physical'&&!move.damage&&!move.ohko&&!['foulplay','endeavor','counter','bodypress','seismictoss','bide','metalburst','superfang'].includes(move.id)&&!(this.gen<8&&move.id==='rapidspin')){minAtk=false;}else if(['metronome','assist','copycat','mefirst','photongeyser','shellsidearm','terablast'].includes(move.id)||this.gen===5&&move.id==='naturepower'){minAtk=false;}}return{minAtk:minAtk,minSpe:minSpe};};_proto.getNickname=function getNickname(set){return set.name||this.dex.species.get(set.species).baseSpecies||'';};_proto.canHyperTrain=function canHyperTrain(set){var format=this.format;if(this.gen<7||format==='gen7hiddentype')return false;if((set.level||this.defaultLevel)===100)return true;if((set.level||this.defaultLevel)>=50&&this.defaultLevel===50)return true;return false;};_proto.getHPIVs=function getHPIVs(hpType){switch(hpType){case'Dark':return['111111'];case'Dragon':return['011111','101111','110111'];case'Ice':return['010111','100111','111110'];case'Psychic':return['011110','101110','110110'];case'Electric':return['010110','100110','111011'];case'Grass':return['011011','101011','110011'];case'Water':return['100011','111010'];case'Fire':return['101010','110010'];case'Steel':return['100010','111101'];case'Ghost':return['101101','110101'];case'Bug':return['100101','111100','101100'];case'Rock':return['001100','110100','100100'];case'Ground':return['000100','111001','101001'];case'Poison':return['001001','110001','100001'];case'Flying':return['000001','111000','101000'];case'Fighting':return['001000','110000','100000'];default:return null;}};_proto.getStat=function getStat(stat,set,ivOverride,evOverride,natureOverride){var _ref,_set$evs3,_BattleNatures,_BattleNatures2;var team=this.team;var supportsEVs=!team.format.includes('letsgo');var supportsAVs=!supportsEVs;var species=this.dex.species.get(set.species);if(!species.exists)return 0;var level=set.level||this.defaultLevel;var baseStat=species.baseStats[stat];var iv=ivOverride;var ev=(_ref=evOverride!=null?evOverride:(_set$evs3=set.evs)==null?void 0:_set$evs3[stat])!=null?_ref:this.gen>2?0:252;if(stat==='hp'){if(baseStat===1)return 1;if(!supportsEVs)return Math.trunc(Math.trunc(2*baseStat+iv+100)*level/100+10)+(supportsAVs?ev:0);return Math.trunc(Math.trunc(2*baseStat+iv+Math.trunc(ev/4)+100)*level/100+10);}var val=Math.trunc(Math.trunc(2*baseStat+iv+Math.trunc(ev/4))*level/100+5);if(!supportsEVs){val=Math.trunc(Math.trunc(2*baseStat+iv)*level/100+5);}if(natureOverride){val*=natureOverride;}else if(((_BattleNatures=BattleNatures[set.nature])==null?void 0:_BattleNatures.plus)===stat){val*=1.1;}else if(((_BattleNatures2=BattleNatures[set.nature])==null?void 0:_BattleNatures2.minus)===stat){val*=0.9;}if(!supportsEVs){var friendshipValue=Math.trunc((70/255/10+1)*100);val=Math.trunc(val)*friendshipValue/100+(supportsAVs?ev:0);}return Math.trunc(val);};_proto["export"]=function _export(compat){return Teams["export"](this.sets,this.dex,!compat);};_proto["import"]=function _import(value){this.sets=Teams["import"](value);this.save();};_proto.getTypeWeakness=function getTypeWeakness(type,attackType){var _this$dex$types$get$d;var weaknessType=(_this$dex$types$get$d=this.dex.types.get(type).damageTaken)==null?void 0:_this$dex$types$get$d[attackType];if(weaknessType===Dex.IMMUNE)return 0;if(weaknessType===Dex.RESIST)return 0.5;if(weaknessType===Dex.WEAK)return 2;return 1;};_proto.getWeakness=function getWeakness(types,abilityid,attackType){if(attackType==='Ground'&&abilityid==='levitate')return 0;if(attackType==='Water'&&abilityid==='dryskin')return 0;if(attackType==='Fire'&&abilityid==='flashfire')return 0;if(attackType==='Electric'&&abilityid==='lightningrod'&&this.gen>=5)return 0;if(attackType==='Grass'&&abilityid==='sapsipper')return 0;if(attackType==='Electric'&&abilityid==='motordrive')return 0;if(attackType==='Water'&&abilityid==='stormdrain'&&this.gen>=5)return 0;if(attackType==='Electric'&&abilityid==='voltabsorb')return 0;if(attackType==='Water'&&abilityid==='waterabsorb')return 0;if(attackType==='Ground'&&abilityid==='eartheater')return 0;if(attackType==='Fire'&&abilityid==='wellbakedbody')return 0;if(attackType==='Fire'&&abilityid==='primordialsea')return 0;if(attackType==='Water'&&abilityid==='desolateland')return 0;if(abilityid==='wonderguard'){for(var _i18=0;_i18<types.length;_i18++){var type=types[_i18];if(this.getTypeWeakness(type,attackType)<=1)return 0;}}var factor=1;if((attackType==='Fire'||attackType==='Ice')&&abilityid==='thickfat')factor*=0.5;if(attackType==='Fire'&&abilityid==='waterbubble')factor*=0.5;if(attackType==='Fire'&&abilityid==='heatproof')factor*=0.5;if(attackType==='Ghost'&&abilityid==='purifyingsalt')factor*=0.5;if(attackType==='Fire'&&abilityid==='fluffy')factor*=2;if((attackType==='Electric'||attackType==='Rock'||attackType==='Ice')&&abilityid==='deltastream'){factor*=0.5;}for(var _i20=0;_i20<types.length;_i20++){var _type=types[_i20];factor*=this.getTypeWeakness(_type,attackType);}return factor;};_proto.pokemonDefensiveCoverage=function pokemonDefensiveCoverage(set){var coverage={};var species=this.dex.species.get(set.species);var abilityid=toID(set.ability);for(var _i22=0,_this$dex$types$names2=this.dex.types.names();_i22<_this$dex$types$names2.length;_i22++){var type=_this$dex$types$names2[_i22];coverage[type]=this.getWeakness(species.types,abilityid,type);}return coverage;};_proto.teamDefensiveCoverage=function teamDefensiveCoverage(){var counters={};for(var _i24=0,_this$dex$types$names4=this.dex.types.names();_i24<_this$dex$types$names4.length;_i24++){var type=_this$dex$types$names4[_i24];counters[type]={type:type,resists:0,neutrals:0,weaknesses:0};}for(var _i26=0,_this$sets2=this.sets;_i26<_this$sets2.length;_i26++){var set=_this$sets2[_i26];var coverage=this.pokemonDefensiveCoverage(set);for(var _i28=0,_Object$entries2=Object.entries(coverage);_i28<_Object$entries2.length;_i28++){var _ref2=_Object$entries2[_i28];var _type2=_ref2[0];var value=_ref2[1];if(value<1){counters[_type2].resists++;}else if(value===1){counters[_type2].neutrals++;}else{counters[_type2].weaknesses++;}}}return counters;};_proto.getDefaultAbility=function getDefaultAbility(set){if(this.gen<3||this.isLetsGo||this.formeLegality==='custom')return set.ability;var species=this.dex.species.get(set.species);if(this.formeLegality==='hackmons'){if(this.gen<9||species.baseSpecies!=='Xerneas')return set.ability;}else if(this.abilityLegality==='hackmons'){if(!species.battleOnly)return set.ability;if(species.requiredItems.length||species.baseSpecies==='Meloetta')return set.ability;return species.abilities[0];}var abilities=Object.values(species.abilities);if(abilities.length===1)return abilities[0];if(set.ability&&abilities.includes(set.ability))return set.ability;return undefined;};_proto.getDefaultItem=function getDefaultItem(speciesName){var species=this.dex.species.get(speciesName);var items=species.requiredItems;if(this.gen!==7&&!this.isNatDex){items=items.filter(function(i){return!i.endsWith('ium Z');});}if(items.length===1){if(this.formeLegality==='normal'||this.formeLegality==='hackmons'&&this.gen===9&&species.battleOnly&&!species.isMega&&!species.isPrimal&&species.name!=='Necrozma-Ultra'){return items[0];}}return undefined;};_proto.save=function save(){this.team.packedTeam=Teams.pack(this.sets);this.lastPackedTeam=this.team.packedTeam;this.team.iconCache=null;};_proto.
fetchSampleSets=function fetchSampleSets(formatid){var _this2=this;
if(formatid in TeamEditorState.sampleSets)return;
if(formatid.length<=4){
TeamEditorState.sampleSets[formatid]=null;
return;
}
if(!(formatid in this._sampleSetPromises)){
this._sampleSetPromises[formatid]=Net("https://"+
Config.routes.client+"/data/sets/"+formatid+".json"
).get().then(function(json){
var data=JSON.parse(json);
TeamEditorState.sampleSets[formatid]=data;
_this2.update();
})["catch"](function(){
TeamEditorState.sampleSets[formatid]=null;
});
}
};_proto.

getSampleSets=function getSampleSets(set){var _d$stats,_d$stats2;
var d=TeamEditorState.sampleSets[this.format];
if(d===undefined){
this.fetchSampleSets(this.format);
return null;
}
if(!(d!=null&&d.dex))return[];
var speciesid=toID(set.species);
var all=Object.assign({},
d.dex[set.species],
d.dex[speciesid],(_d$stats=
d.stats)==null?void 0:_d$stats[set.species],(_d$stats2=
d.stats)==null?void 0:_d$stats2[speciesid]);

return Object.keys(all);
};_proto.

getUserSets=function getUserSets(set){
if(!this.userSetsCache[this.format]){
var userSets={};for(var _i30=0,_ref4=

((_window$PS=window.PS)==null?void 0:_window$PS.teams.list)||[];_i30<_ref4.length;_i30++){var _window$PS;var team=_ref4[_i30];
if(team.format!==this.format||!team.isBox)continue;

var setList=Teams.unpack(team.packedTeam);
var duplicateNameIndices={};for(var _i32=0;_i32<

setList.length;_i32++){var _boxSet$species,_userSets$_boxSet$spe;var boxSet=setList[_i32];
var name=boxSet.name||boxSet.species;
if(duplicateNameIndices[name]){
name+=" "+duplicateNameIndices[name];
}
duplicateNameIndices[name]=(duplicateNameIndices[name]||0)+1;

(_userSets$_boxSet$spe=userSets[_boxSet$species=boxSet.species])!=null?_userSets$_boxSet$spe:userSets[_boxSet$species]={};
userSets[boxSet.species][name]=boxSet;
}
}

this.userSetsCache[this.format]=userSets;
}

var cachedSets=this.userSetsCache[this.format];
if(Object.keys(cachedSets).length===0)return null;
return cachedSets[set.species]||{};
};return TeamEditorState;}(PSModel);TeamEditorState.clipboard=null;TeamEditorState.sampleSets={};var


TeamEditor=function(_preact$Component){function TeamEditor(){var _this3;for(var _len=arguments.length,args=new Array(_len),_key2=0;_key2<_len;_key2++){args[_key2]=arguments[_key2];}_this3=_preact$Component.call.apply(_preact$Component,[this].concat(args))||this;_this3.



wizard=true;_this3.
editor=void 0;_this3.
setTab=function(ev){
var target=ev.currentTarget;
var wizard=target.value==='wizard';
_this3.wizard=wizard;
_this3.forceUpdate();
};_this3.






































cancelClipboard=function(){
TeamEditorState.clipboard=null;
_this3.forceUpdate();
};_this3.
update=function(){
_this3.forceUpdate();
};return _this3;}_inheritsLoose(TeamEditor,_preact$Component);TeamEditor.probablyMobile=function probablyMobile(){return document.body.offsetWidth<500;};var _proto2=TeamEditor.prototype;_proto2.renderDefensiveCoverage=function renderDefensiveCoverage(){var editor=this.editor;if(editor.team.isBox)return null;if(!editor.sets.length)return null;var counters=Object.values(editor.teamDefensiveCoverage());PSUtils.sortBy(counters,function(counter){return[counter.resists,-counter.weaknesses];});var good=[],medium=[],bad=[];var renderTypeDefensive=function(counter){return preact.h("tr",null,preact.h("th",null,counter.type),preact.h("td",null,counter.resists," ",preact.h("small",{"class":"gray"},"resist")),preact.h("td",null,counter.weaknesses," ",preact.h("small",{"class":"gray"},"weak")));};for(var _i34=0;_i34<counters.length;_i34++){var counter=counters[_i34];if(counter.resists>0){good.push(renderTypeDefensive(counter));}else if(counter.weaknesses<=0){medium.push(renderTypeDefensive(counter));}else{bad.push(renderTypeDefensive(counter));}}return preact.h("details",{"class":"details"},preact.h("summary",null,preact.h("strong",null,"Defensive coverage"),preact.h("table",{"class":"details-preview table"},bad,preact.h("tr",null,preact.h("td",{colSpan:3},preact.h("span",{"class":"details-preview ilink"},preact.h("small",null,"See all")))))),preact.h("table",{"class":"table"},bad,medium,good));};_proto2.
renderClipboard=function renderClipboard(){var _Object$values3,_TeamEditorState$clip3;
if(!TeamEditorState.clipboard)return null;

var renderSet=function(set){return preact.h("div",{"class":"set"},
preact.h("small",null,
preact.h(PSIcon,{pokemon:set})," ",set.name||set.species,
set.ability&&" ["+set.ability+"]",set.item&&" @ "+set.item,
" - ",set.moves.join(' / ')||'(No moves)'
)
);};
return preact.h("div",{"class":"infobox"},"Clipboard",(_Object$values3=

Object.values(TeamEditorState.clipboard.teams||{}))==null?void 0:_Object$values3.map(function(clipboardTeam){return(
Object.values(clipboardTeam.sets).map(function(set){return renderSet(set);}));}
),(_TeamEditorState$clip3=
TeamEditorState.clipboard.otherSets)==null?void 0:_TeamEditorState$clip3.map(function(set){return renderSet(set);}),
preact.h("button",{"class":"button",onClick:this.cancelClipboard},
preact.h("i",{"class":"fa fa-times","aria-hidden":true})," Cancel"
)
);
};_proto2.
render=function render(){var _this4=this,_this$props$narrow;
if(!this.editor){
this.editor=new TeamEditorState(this.props.team);
this.editor.subscribe(function(){
_this4.forceUpdate();
});
}
var editor=this.editor;
window.editor=editor;
editor.updateTeam(!!this.props.readOnly);
editor.narrow=(_this$props$narrow=this.props.narrow)!=null?_this$props$narrow:document.body.offsetWidth<500;
if(this.props.team.format!==editor.format){
editor.setFormat(this.props.team.format);
}

return preact.h("div",{"class":"teameditor"},
preact.h("ul",{"class":"tabbar"},
preact.h("li",null,preact.h("button",{onClick:this.setTab,value:"wizard","class":"button"+(this.wizard?' cur':'')},"Wizard"

)),
preact.h("li",null,preact.h("button",{onClick:this.setTab,value:"import","class":"button"+(!this.wizard?' cur':'')},"Import/Export"

))
),
this.renderClipboard(),
this.wizard?
preact.h(TeamWizard,{editor:editor,onChange:this.props.onChange,onUpdate:this.update}):

preact.h(TeamTextbox,{editor:editor,onChange:this.props.onChange,onUpdate:this.update}),

!this.editor.innerFocus&&preact.h(preact.Fragment,null,
this.props.children,
preact.h("div",{"class":"team-resources"},
preact.h("br",null),preact.h("hr",null),preact.h("br",null),
this.renderDefensiveCoverage(),
this.props.resources
)
)
);
};return TeamEditor;}(preact.Component);var


TeamTextbox=function(_preact$Component2){function TeamTextbox(){var _this5;for(var _len2=arguments.length,args=new Array(_len2),_key3=0;_key3<_len2;_key3++){args[_key3]=arguments[_key3];}_this5=_preact$Component2.call.apply(_preact$Component2,[this].concat(args))||this;_this5.




editor=void 0;_this5.
setInfo=



[];_this5.
textbox=null;_this5.
heightTester=null;_this5.
compat=false;_this5.

setDirty=false;_this5.
windowing=true;_this5.
selection=




null;_this5.
innerFocus=








null;_this5.







input=function(){
_this5.updateText();
_this5.save();
};_this5.
keyUp=function(){return _this5.updateText(true);};_this5.
contextMenu=function(ev){
if(!ev.shiftKey){var _this5$innerFocus,_this5$innerFocus2;
var hadInnerFocus=(_this5$innerFocus=_this5.innerFocus)==null?void 0:_this5$innerFocus.range[1];
_this5.openInnerFocus();
if(hadInnerFocus!==((_this5$innerFocus2=_this5.innerFocus)==null?void 0:_this5$innerFocus2.range[1])){
ev.preventDefault();
ev.stopImmediatePropagation();
}
}
};_this5.













keyDown=function(ev){
var editor=_this5.editor;
switch(ev.keyCode){
case 27:
case 8:
if(_this5.innerFocus){
var atStart=_this5.innerFocus.range[0]===_this5.textbox.selectionStart&&
_this5.innerFocus.range[0]===_this5.textbox.selectionEnd;
if(ev.keyCode===27||atStart){
if(editor.search.removeFilter()){
editor.setSearchValue(_this5.getInnerFocusValue());
_this5.resetScroll();
_this5.forceUpdate();
ev.stopImmediatePropagation();
ev.preventDefault();
}else if(_this5.closeMenu()){
ev.stopImmediatePropagation();
ev.preventDefault();
}
}
}
break;
case 38:
if(_this5.innerFocus){
editor.upSearchValue();
var resultsUp=_this5.base.querySelector('.searchresults');
if(resultsUp){
resultsUp.scrollTop=Math.max(0,editor.searchIndex*33-Math.trunc((window.innerHeight-100)*0.4));
}
_this5.forceUpdate();
ev.preventDefault();
}
break;
case 40:
if(_this5.innerFocus){
editor.downSearchValue();
var resultsDown=_this5.base.querySelector('.searchresults');
if(resultsDown){
resultsDown.scrollTop=Math.max(0,editor.searchIndex*33-Math.trunc((window.innerHeight-100)*0.4));
}
_this5.forceUpdate();
ev.preventDefault();
}
break;
case 9:
case 13:
if(ev.keyCode===13&&ev.shiftKey)return;
if(ev.altKey||ev.metaKey)return;
if(!_this5.innerFocus){
if(_this5.maybeReplaceLine()){

}else if(
_this5.textbox.selectionStart===_this5.textbox.value.length&&(
_this5.textbox.value.endsWith('\n\n')||!_this5.textbox.value))
{
_this5.addPokemon();
}else if(!_this5.openInnerFocus()){
break;
}
ev.stopImmediatePropagation();
ev.preventDefault();
}else{
var result=_this5.editor.selectSearchValue();
if(result!==null){
var _result$split=result.split('|'),name=_result$split[0],moveSlot=_result$split[1];
_this5.selectResult(_this5.innerFocus.type,name,moveSlot);
}else{
_this5.replaceNoFocus('',_this5.innerFocus.range[0],_this5.innerFocus.range[1]);
_this5.editor.setSearchValue('');
_this5.forceUpdate();
}
_this5.resetScroll();
ev.stopImmediatePropagation();
ev.preventDefault();
}
break;
case 80:
if(ev.metaKey){var _window$PS2;
(_window$PS2=window.PS)==null||_window$PS2.alert(editor["export"](_this5.compat));
ev.stopImmediatePropagation();
ev.preventDefault();
break;
}
}
};_this5.
maybeReplaceLine=function(){var _exec;
if(_this5.textbox.selectionStart!==_this5.textbox.selectionEnd)return;
var current=_this5.textbox.selectionEnd;
var lineStart=_this5.textbox.value.lastIndexOf('\n',current)+1;
var value=_this5.textbox.value.slice(lineStart,current);

var pokepaste=(_exec=/^https?:\/\/pokepast.es\/([a-z0-9]+)(?:\/.*)?$/.exec(value))==null?void 0:_exec[1];
if(pokepaste){
_this5.editor.fetching=true;
Net("https://pokepast.es/"+pokepaste+"/json").get().then(function(json){
var paste=JSON.parse(json);
var pasteTxt=paste.paste.replace(/\r\n/g,'\n');
if(_this5.textbox){

var valueIndex=_this5.textbox.value.indexOf(value);
_this5.replace(paste.paste.replace(/\r\n/g,'\n'),valueIndex,valueIndex+value.length);
}else{
_this5.editor["import"](pasteTxt);
}
var notes=paste["notes"];
if(notes.startsWith("Format: ")){
var formatid=toID(notes.slice(8));
_this5.editor.setFormat(formatid);
}
var title=paste["title"];
if(title&&!title.startsWith('Untitled')){
_this5.editor.team.name=title.replace(/[|\\/]/g,'');
}
_this5.editor.fetching=false;
_this5.props.onUpdate==null||_this5.props.onUpdate();
});
return true;
}
return false;
};_this5.















closeMenu=function(){
if(_this5.innerFocus){
_this5.clearInnerFocus();
if(_this5.setDirty){
_this5.updateText();
_this5.save();
}else{
_this5.forceUpdate();
}
_this5.textbox.focus();
return true;
}
return false;
};_this5.
updateText=function(noTextChange,autoSelect){
var textbox=_this5.textbox;
var value=textbox.value;
var selectionStart=textbox.selectionStart||0;
var selectionEnd=textbox.selectionEnd||0;

if(_this5.innerFocus){
if(!noTextChange){
var lineEnd=_this5.textbox.value.indexOf('\n',_this5.innerFocus.range[0]);
if(lineEnd<0)lineEnd=_this5.textbox.value.length;
var line=_this5.textbox.value.slice(_this5.innerFocus.range[0],lineEnd);
if(_this5.innerFocus.rangeEndChar){
var _index=line.indexOf(_this5.innerFocus.rangeEndChar);
if(_index>=0)lineEnd=_this5.innerFocus.range[0]+_index;
}
_this5.innerFocus.range[1]=lineEnd;
}
var _this5$innerFocus$ran=_this5.innerFocus.range,start=_this5$innerFocus$ran[0],end=_this5$innerFocus$ran[1];
if(selectionStart>=start&&selectionStart<=end&&selectionEnd>=start&&selectionEnd<=end){
if(!noTextChange){
_this5.updateSearch();
_this5.setDirty=true;
}
return;
}
_this5.clearInnerFocus();
value=textbox.value;
selectionStart=textbox.selectionStart||0;
selectionEnd=textbox.selectionEnd||0;
}

if(_this5.setDirty){
_this5.setDirty=false;
noTextChange=false;
}

_this5.heightTester.style.width=textbox.offsetWidth+"px";

var index=0;

var setIndex=null;
var nextSetIndex=0;
if(!noTextChange)_this5.setInfo=[];
_this5.selection=null;

while(index<value.length){
var nlIndex=value.indexOf('\n',index);
if(nlIndex<0)nlIndex=value.length;
var _line=value.slice(index,nlIndex);

if(!_line.trim()){
setIndex=null;
index=nlIndex+1;
continue;
}

if(setIndex===null&&index&&!noTextChange&&_this5.setInfo.length){
_this5.setInfo[_this5.setInfo.length-1].bottomY=_this5.getYAt(index-1);
}

if(setIndex===null){
if(!noTextChange){
var atIndex=_line.indexOf('@');
var species=atIndex>=0?_line.slice(0,atIndex).trim():_line.trim();
if(species.endsWith(' (M)')||species.endsWith(' (F)')){
species=species.slice(0,-4);
}
if(species.endsWith(')')){
var parenIndex=species.lastIndexOf(' (');
if(parenIndex>=0){
species=species.slice(parenIndex+2,-1);
}
}
_this5.setInfo.push({
species:species,
bottomY:-1,
index:index
});
}
setIndex=nextSetIndex;
nextSetIndex++;
}

var selectionEndCutoff=selectionStart===selectionEnd?nlIndex:nlIndex+1;
var _start=index,_end=index+_line.length;
if(index<=selectionStart&&selectionEnd<=selectionEndCutoff){

var type=null;
var lcLine=_line.toLowerCase().trim();

if(lcLine.startsWith('ability:')){
type='ability';
}else if(lcLine.startsWith('-')){
type='move';
}else if(
!lcLine||lcLine.startsWith('level:')||lcLine.startsWith('gender:')||
(lcLine+':').startsWith('shiny:')||(lcLine+':').startsWith('gigantamax:')||
lcLine.startsWith('tera type:')||lcLine.startsWith('dynamax level:'))
{
type='details';
}else if(
lcLine.startsWith('ivs:')||lcLine.startsWith('evs:')||
lcLine.endsWith(' nature'))
{
type='stats';
}else{
type='pokemon';
var _atIndex=_line.indexOf('@');
if(_atIndex>=0){
if(selectionStart>index+_atIndex){
type='item';
_start=index+_atIndex+1;
}else{
_end=index+_atIndex;
if(_line.charAt(_atIndex-1)===']'||_line.charAt(_atIndex-2)===']'){
type='ability';
}
}
}
}

if(typeof autoSelect==='string')autoSelect=autoSelect===type;
_this5.selection={
setIndex:setIndex,type:type,lineRange:[_start,_end],typeIndex:0
};
if(autoSelect)_this5.engageFocus();
}

index=nlIndex+1;
}
if(!noTextChange){
var _end2=value.endsWith('\n\n')?value.length-1:value.length;
var bottomY=_this5.getYAt(_end2,true);
if(_this5.setInfo.length){
_this5.setInfo[_this5.setInfo.length-1].bottomY=bottomY;
}

textbox.style.height=bottomY+100+"px";
}
_this5.forceUpdate();
};_this5.














































selectResult=function(type,name,moveSlot){
if(type===null){
_this5.resetScroll();
_this5.forceUpdate();
}else if(!type){
_this5.changeSet(_this5.innerFocus.type,'');
}else{
_this5.changeSet(type,name,moveSlot);
}
};_this5.

















































































































changeCompat=function(ev){
var checkbox=ev.currentTarget;
_this5.compat=checkbox.checked;
_this5.editor["import"](_this5.textbox.value);
_this5.textbox.value=_this5.editor["export"](_this5.compat);


_this5.updateText();
};_this5.




























































clickDetails=function(ev){var _this5$innerFocus3;
var target=ev.currentTarget;
var i=parseInt(target.value||'0');
if(((_this5$innerFocus3=_this5.innerFocus)==null?void 0:_this5$innerFocus3.type)===target.name){
_this5.innerFocus=null;
_this5.forceUpdate();
return;
}
_this5.engageFocus({
offsetY:null,
setIndex:i,
type:target.name,
typeIndex:0,
range:[0,0],
rangeEndChar:''
});
};_this5.
addPokemon=function(){
if(_this5.textbox.value&&!_this5.textbox.value.endsWith('\n\n')){
_this5.textbox.value+=_this5.textbox.value.endsWith('\n')?'\n':'\n\n';
}
var end=_this5.textbox.value==='\n\n'?0:_this5.textbox.value.length;
_this5.textbox.setSelectionRange(end,end);
_this5.textbox.focus();
_this5.engageFocus({
offsetY:_this5.getYAt(end,true),
setIndex:_this5.setInfo.length,
type:'pokemon',
typeIndex:0,
range:[end,end],
rangeEndChar:'@'
});
};_this5.
scrollResults=function(ev){
if(!ev.currentTarget.scrollTop)return;
_this5.windowing=false;
if(document.documentElement.clientWidth===document.documentElement.scrollWidth){
ev.currentTarget.scrollIntoViewIfNeeded==null||ev.currentTarget.scrollIntoViewIfNeeded();
}
_this5.forceUpdate();
};_this5.






















































handleSetChange=function(){
if(_this5.selection){
_this5.replaceSet(_this5.selection.setIndex);
_this5.forceUpdate();
}
};_this5.



copyAll=function(ev){
_this5.textbox.select();
document.execCommand('copy');
var button=ev==null?void 0:ev.currentTarget;
if(button){
button.innerHTML='<i class="fa fa-check" aria-hidden="true"></i> Copied';
button.className+=' cur';
}
};return _this5;}_inheritsLoose(TeamTextbox,_preact$Component2);var _proto3=TeamTextbox.prototype;_proto3.getYAt=function getYAt(index,fullLine){if(index<0)return 10;if(index===0)return 31;var newValue=this.textbox.value.slice(0,index);this.heightTester.value=fullLine&&!newValue.endsWith('\n')?newValue+'\n':newValue;return this.heightTester.scrollHeight;};_proto3.openInnerFocus=function openInnerFocus(){var _this$selection;var oldRange=(_this$selection=this.selection)==null?void 0:_this$selection.lineRange;this.updateText(true,true);if(this.selection){if(this.selection.lineRange===oldRange)return!!this.innerFocus;if(this.textbox.selectionStart===this.textbox.selectionEnd){var range=this.getSelectionTypeRange();if(range)this.textbox.setSelectionRange(range[0],range[1]);}}return!!this.innerFocus;};_proto3.getInnerFocusValue=function getInnerFocusValue(){if(!this.innerFocus)return'';return this.textbox.value.slice(this.innerFocus.range[0],this.innerFocus.range[1]);};_proto3.clearInnerFocus=function clearInnerFocus(){if(this.innerFocus){if(this.innerFocus.type==='pokemon'){var value=this.getInnerFocusValue();if(!toID(value)){this.replaceNoFocus(this.editor.originalSpecies||'',this.innerFocus.range[0],this.innerFocus.range[1]);}}this.innerFocus=null;}};_proto3.engageFocus=function engageFocus(focus){if(this.innerFocus&&!focus)return;var editor=this.editor;if(editor.readonly)return;if(!focus){var _this$selection2;if(!((_this$selection2=this.selection)!=null&&_this$selection2.type))return;var range=this.getSelectionTypeRange();if(!range)return;var _this$selection3=this.selection,type=_this$selection3.type,setIndex=_this$selection3.setIndex;var rangeEndChar=this.textbox.value.charAt(range[1]);if(rangeEndChar===' ')rangeEndChar+=this.textbox.value.charAt(range[1]+1);focus={offsetY:this.getYAt(range[0]),setIndex:setIndex,type:type,typeIndex:this.selection.typeIndex,range:range,rangeEndChar:rangeEndChar};}this.innerFocus=focus;if(focus.type==='details'||focus.type==='stats'){this.forceUpdate();return;}var value=this.textbox.value.slice(focus.range[0],focus.range[1]);editor.setSearchType(focus.type,focus.setIndex,value);this.resetScroll();this.textbox.setSelectionRange(focus.range[0],focus.range[1]);this.forceUpdate();};_proto3.updateSearch=function updateSearch(){if(!this.innerFocus)return;var range=this.innerFocus.range;var editor=this.editor;var value=this.textbox.value.slice(range[0],range[1]);editor.setSearchValue(value);this.resetScroll();this.forceUpdate();};_proto3.getSelectionTypeRange=function getSelectionTypeRange(){var selection=this.selection;if(!(selection!=null&&selection.lineRange))return null;var _selection$lineRange=selection.lineRange,start=_selection$lineRange[0],end=_selection$lineRange[1];var lcLine=this.textbox.value.slice(start,end).toLowerCase();if(lcLine.endsWith('  ')){end-=2;lcLine=lcLine.slice(0,-2);}switch(selection.type){case'pokemon':{if(lcLine.endsWith(' ')){lcLine=lcLine.slice(0,-1);end--;}if(lcLine.endsWith(' (m)')||lcLine.endsWith(' (f)')){lcLine=lcLine.slice(0,-4);end-=4;}if(lcLine.endsWith(')')){var parenIndex=lcLine.lastIndexOf(' (');if(parenIndex>=0){start=start+parenIndex+2;end--;}}return[start,end];}case'item':{if(lcLine.startsWith(' '))start++;return[start,end];}case'ability':{if(lcLine.startsWith('[')){start++;if(lcLine.endsWith(' ')){end--;lcLine=lcLine.slice(0,-1);}if(lcLine.endsWith(']')){end--;}return[start,end];}if(!lcLine.startsWith('ability:'))return null;start+=lcLine.startsWith('ability: ')?9:8;return[start,end];}case'move':{if(!lcLine.startsWith('-'))return null;start+=lcLine.startsWith('- ')?2:1;return[start,end];}}return[start,end];};_proto3.changeSet=function changeSet(type,name,moveSlot){var focus=this.innerFocus;if(!focus)return;if(type===focus.type&&type!=='pokemon'){this.replace(name,focus.range[0],focus.range[1]);this.updateText(false,true);return;}switch(type){case'pokemon':{var _this$editor$sets,_focus$setIndex;var set=(_this$editor$sets=this.editor.sets)[_focus$setIndex=focus.setIndex]||(_this$editor$sets[_focus$setIndex]={species:'',moves:[]});this.editor.changeSpecies(set,name);this.replaceSet(focus.setIndex);this.updateText(false,true);break;}case'ability':{this.editor.sets[focus.setIndex].ability=name;this.replaceSet(focus.setIndex);this.updateText(false,true);break;}}};_proto3.getSetRange=function getSetRange(index){if(!this.setInfo[index]){var _this$innerFocus;if(((_this$innerFocus=this.innerFocus)==null?void 0:_this$innerFocus.setIndex)===index){return this.innerFocus.range;}return[this.textbox.value.length,this.textbox.value.length];}var start=this.setInfo[index].index;var end=this.setInfo[index+1].index;return[start,end];};_proto3.replaceSet=function replaceSet(index){var editor=this.editor;var team=editor.team;if(!team)return;var newText=Teams.exportSet(editor.sets[index],editor.dex,!this.compat);var _this$getSetRange=this.getSetRange(index),start=_this$getSetRange[0],end=_this$getSetRange[1];if(start&&start===this.textbox.value.length&&!this.textbox.value.endsWith('\n\n')){newText=(this.textbox.value.endsWith('\n')?'\n':'\n\n')+newText;}this.replaceNoFocus(newText,start,end,start+newText.length);if(!this.setInfo[index]){this.updateText();this.save();}else{if(this.setInfo[index+1]){this.setInfo[index+1].index=start+newText.length;}this.setDirty=true;}};_proto3.replace=function replace(text,start,end){var selectionStart=arguments.length>3&&arguments[3]!==undefined?arguments[3]:start;var selectionEnd=arguments.length>4&&arguments[4]!==undefined?arguments[4]:start+text.length;var textbox=this.textbox;textbox.focus();textbox.setSelectionRange(start,end);document.execCommand('insertText',false,text);this.save();};_proto3.replaceNoFocus=function replaceNoFocus(text,start,end){var selectionStart=arguments.length>3&&arguments[3]!==undefined?arguments[3]:start;var selectionEnd=arguments.length>4&&arguments[4]!==undefined?arguments[4]:start+text.length;var textbox=this.textbox;var value=textbox.value;textbox.value=value.slice(0,start)+text+value.slice(end);textbox.setSelectionRange(selectionStart,selectionEnd);this.save();};_proto3.save=function save(){var _this$props$onChange,_this$props;this.editor["import"](this.textbox.value);(_this$props$onChange=(_this$props=this.props).onChange)==null||_this$props$onChange.call(_this$props);};_proto3.componentDidMount=function componentDidMount(){var _this6=this;this.textbox=this.base.getElementsByClassName('teamtextbox')[0];this.heightTester=this.base.getElementsByClassName('heighttester')[0];this.editor=this.props.editor;var exportedTeam=this.editor["export"](this.compat);this.textbox.value=exportedTeam;this.updateText();setTimeout(function(){return _this6.updateText();});};_proto3.componentWillUnmount=function componentWillUnmount(){this.textbox=null;this.heightTester=null;};_proto3.resetScroll=function resetScroll(){this.windowing=true;var searchResults=this.base.querySelector('.searchresults');if(searchResults)searchResults.scrollTop=0;};_proto3.windowResults=function windowResults(){if(this.windowing){return Math.ceil(window.innerHeight/33);}return null;};_proto3.renderDetails=function renderDetails(set,i){var editor=this.editor;var species=editor.dex.species.get(set.species);var GenderChart={'M':'Male','F':'Female','N':"\u2014"};var gender=GenderChart[set.gender||species.gender||'N'];return preact.h("button",{"class":"textbox setdetails",name:"details",value:i,onClick:this.clickDetails},preact.h("span",{"class":"detailcell"},preact.h("label",null,"Level"),set.level||editor.defaultLevel),preact.h("span",{"class":"detailcell"},preact.h("label",null,"Shiny"),set.shiny?'Yes':"\u2014"),editor.gen===9?preact.h("span",{"class":"detailcell"},preact.h("label",null,"Tera"),preact.h(PSIcon,{type:set.teraType||species.requiredTeraType||species.types[0]})):editor.hpTypeMatters(set)?preact.h("span",{"class":"detailcell"},preact.h("label",null,"H. Power"),preact.h(PSIcon,{type:editor.getHPType(set)})):preact.h("span",{"class":"detailcell"},preact.h("label",null,"Gender"),gender));};_proto3.renderStats=function renderStats(set,i){var editor=this.editor;return preact.h("button",{"class":"textbox setstats",name:"stats",value:i,onClick:this.clickDetails},StatForm.renderStatGraph(set,editor));};_proto3.bottomY=function bottomY(){var _this$setInfo$bottomY,_this$setInfo;return(_this$setInfo$bottomY=(_this$setInfo=this.setInfo[this.setInfo.length-1])==null?void 0:_this$setInfo.bottomY)!=null?_this$setInfo$bottomY:8;};_proto3.
render=function render(){var _this7=this,_this$innerFocus2,_this$setInfo$this$in,_this$setInfo$this$in2;
var editor=this.props.editor;
var statsDetailsOffset=editor.gen>=3?18:-1;
return preact.h("div",null,
preact.h("p",null,
preact.h("button",{"class":"button",onClick:this.copyAll},
preact.h("i",{"class":"fa fa-copy","aria-hidden":true})," Copy"
)," ",
preact.h("label",{"class":"checkbox inline"},
preact.h("input",{type:"checkbox",name:"compat",onChange:this.changeCompat})," Old export format"
)
),
preact.h("div",{"class":"teameditor-text"},
preact.h("textarea",{
"class":"textbox teamtextbox",style:"padding-left:"+(editor.narrow?'50px':'100px'),
onInput:this.input,onContextMenu:this.contextMenu,onKeyUp:this.keyUp,onKeyDown:this.keyDown,
onClick:this.keyUp,onChange:this.maybeReplaceLine,
placeholder:" Paste exported teams, pokepaste URLs, or JSON here",readOnly:editor.readonly}
),
preact.h("textarea",{
"class":"textbox teamtextbox heighttester",tabIndex:-1,"aria-hidden":true,
style:"padding-left:"+(editor.narrow?'50px':'100px')+";visibility:hidden;left:-15px"}
),
preact.h("div",{"class":"teamoverlays"},
this.setInfo.slice(0,-1).map(function(info){return(
preact.h("hr",{style:"top:"+(info.bottomY-18)+"px;pointer-events:none"}));}
),
editor.canAdd()&&!!this.setInfo.length&&preact.h("hr",{style:"top:"+(this.bottomY()-18)+"px"}),
this.setInfo.map(function(info,i){
if(!info.species)return null;
var set=editor.sets[i];
if(!set)return null;
var prevOffset=i===0?8:_this7.setInfo[i-1].bottomY;
var species=editor.dex.species.get(info.species);
var num=Dex.getPokemonIconNum(species.id);
if(!num)return null;

if(editor.narrow){
return preact.h("div",{style:"top:"+(prevOffset+1)+"px;left:5px;position:absolute;text-align:center;pointer-events:none"},
preact.h("div",null,preact.h(PSIcon,{pokemon:species.id})),
species.types.map(function(type){return preact.h("div",null,preact.h(PSIcon,{type:type}));}),
preact.h("div",null,preact.h(PSIcon,{item:set.item||null}))
);
}
return[preact.h("div",{
style:
"top:"+(prevOffset-7)+"px;left:0;position:absolute;text-align:right;"+"width:94px;padding:103px 5px 0 0;min-height:24px;pointer-events:none;"+

Dex.getTeambuilderSprite(set,editor.dex)},


preact.h("div",null,species.types.map(function(type){return preact.h(PSIcon,{type:type});}),preact.h(PSIcon,{item:set.item||null}))
),preact.h("div",{style:"top:"+(prevOffset+statsDetailsOffset)+"px;right:9px;position:absolute"},
_this7.renderStats(set,i)
),preact.h("div",{style:"top:"+(prevOffset+statsDetailsOffset)+"px;right:145px;position:absolute"},
_this7.renderDetails(set,i)
)];
}),
editor.canAdd()&&!(this.innerFocus&&this.innerFocus.setIndex>=this.setInfo.length)&&
preact.h("div",{style:"top:"+(this.bottomY()-3)+"px;left:"+(editor.narrow?55:105)+"px;position:absolute"},
preact.h("button",{"class":"button",onClick:this.addPokemon},
preact.h("i",{"class":"fa fa-plus","aria-hidden":true})," Add Pok\xE9mon"
)
),

((_this$innerFocus2=this.innerFocus)==null?void 0:_this$innerFocus2.offsetY)!=null&&
preact.h("div",{
"class":"teaminnertextbox teaminnertextbox-"+this.innerFocus.type,
style:"top:"+(this.innerFocus.offsetY-21)+"px;left:"+(editor.narrow?46:96)+"px;"}
)

),
this.innerFocus&&
preact.h("div",{
"class":"searchresults",
style:"top:"+(((_this$setInfo$this$in=(_this$setInfo$this$in2=this.setInfo[this.innerFocus.setIndex])==null?void 0:_this$setInfo$this$in2.bottomY)!=null?_this$setInfo$this$in:this.bottomY()+50)-12)+"px",
onScroll:this.scrollResults},

preact.h("button",{"class":"button closesearch",onClick:this.closeMenu},
!editor.narrow&&preact.h("kbd",null,"Esc")," ",preact.h("i",{"class":"fa fa-times","aria-hidden":true})," Close"
),
this.innerFocus.type==='stats'?
preact.h(StatForm,{editor:editor,set:this.editor.sets[this.innerFocus.setIndex],onChange:this.handleSetChange}):
this.innerFocus.type==='details'?
preact.h(DetailsForm,{editor:editor,set:this.editor.sets[this.innerFocus.setIndex],onChange:this.handleSetChange}):

preact.h(PSSearchResults,{
search:editor.search,resultIndex:editor.searchIndex,
windowing:this.windowResults(),onSelect:this.selectResult}
)

)

)
);
};return TeamTextbox;}(preact.Component);TeamTextbox.EMPTY_PROMISE=Promise.resolve(null);var


TeamWizard=function(_preact$Component3){function TeamWizard(){var _this8;for(var _len3=arguments.length,args=new Array(_len3),_key4=0;_key4<_len3;_key4++){args[_key4]=arguments[_key4];}_this8=_preact$Component3.call.apply(_preact$Component3,[this].concat(args))||this;_this8.


setSearchBox=null;_this8.
windowing=true;_this8.
setFocus=function(ev){
var editor=_this8.props.editor;
if(editor.readonly)return;
var target=ev.currentTarget;
var _split=(target.value||'').split('|'),rawType=_split[0],i=_split[1];
var setIndex=parseInt(i);
var type=rawType;
if(!target.value||editor.innerFocus&&editor.innerFocus.setIndex===setIndex&&editor.innerFocus.type===type){
_this8.changeFocus(null);
return;
}
_this8.changeFocus({
setIndex:setIndex,
type:type
});
};_this8.
deleteSet=function(ev){
var target=ev.currentTarget;
var i=parseInt(target.value);
var editor=_this8.props.editor;
editor.deleteSet(i);
if(editor.innerFocus){
_this8.changeFocus({
setIndex:editor.sets.length,
type:'pokemon'
});
}
_this8.handleSetChange();
ev.preventDefault();
};_this8.
copySet=function(ev){var _window$PS3;
var target=ev.currentTarget;
var i=parseInt(target.value);
var editor=_this8.props.editor;
editor.copySet(i);
editor.innerFocus=null;
_this8.props.onUpdate();
(_window$PS3=window.PS)==null||_window$PS3.update();
ev.preventDefault();
};_this8.
undeleteSet=function(ev){var _editor$deletedSet;
var editor=_this8.props.editor;
var setIndex=(_editor$deletedSet=editor.deletedSet)==null?void 0:_editor$deletedSet.index;
editor.undeleteSet();
if(editor.innerFocus&&setIndex!==undefined){
_this8.changeFocus({
setIndex:setIndex,
type:'pokemon'
});
}
_this8.handleSetChange();
ev.preventDefault();
};_this8.
pasteSet=function(ev){var _window$PS4;
var target=ev.currentTarget;
var i=parseInt(target.value);
var editor=_this8.props.editor;
editor.pasteSet(i);
_this8.handleSetChange();
(_window$PS4=window.PS)==null||_window$PS4.update();
ev.preventDefault();
};_this8.
moveSet=function(ev){
var target=ev.currentTarget;
var i=parseInt(target.value);
var editor=_this8.props.editor;
editor.pasteSet(i,true);
_this8.handleSetChange();
ev.preventDefault();
};_this8.


































































































































































handleSetChange=function(){
_this8.props.editor.save();
_this8.props.onChange==null||_this8.props.onChange();
_this8.forceUpdate();
};_this8.







selectResult=function(type,name,slot,reverse){
var editor=_this8.props.editor;
_this8.clearSearchBox();
if(type===null){
_this8.resetScroll();
_this8.forceUpdate();
}if(!type){
editor.setSearchValue('');
_this8.resetScroll();
_this8.forceUpdate();
}else{var _editor$sets;
var setIndex=editor.innerFocus.setIndex;
var set=(_editor$sets=editor.sets)[setIndex]||(_editor$sets[setIndex]={species:'',moves:[]});
switch(type){
case'pokemon':
editor.changeSpecies(set,name);
_this8.changeFocus({
setIndex:setIndex,
type:reverse?'details':'ability'
});
break;
case'ability':
if(name==='No Ability'&&editor.gen<=2)name='';
set.ability=name;
_this8.changeFocus({
setIndex:setIndex,
type:reverse?'pokemon':'item'
});
break;
case'item':
set.item=name;
_this8.changeFocus({
setIndex:setIndex,
type:reverse?'ability':'move'
});
break;
case'move':
if(slot){

var i=parseInt(slot)-1;
if(set.moves[i]){
set.moves[i]='';

if(i===set.moves.length-1){
while(set.moves.length>4&&!set.moves[set.moves.length-1]){
set.moves.pop();
}
}

if(set.moves.length>4&&i<set.moves.length-1){
set.moves[i]=set.moves.pop();
}
}
}else if(set.moves.includes(name)){
set.moves.splice(set.moves.indexOf(name),1);
}else{
for(var _i35=0;_i35<set.moves.length+1;_i35++){
if(!set.moves[_i35]){
set.moves[_i35]=name;
break;
}
}
}
if(set.moves.length===4&&set.moves.every(Boolean)){
_this8.changeFocus({
setIndex:setIndex,
type:reverse?'item':'stats'
});
}else{
if(editor.search.query){
_this8.resetScroll();
}
editor.updateSearchMoves(set);
}
break;
}
editor.save();
_this8.props.onChange==null||_this8.props.onChange();
_this8.forceUpdate();
}
};_this8.
loadSampleSet=function(setName){var _TeamEditorState$samp,_ref5,_ref6,_data$dex$set$species,_data$dex,_data$dex2,_data$stats,_data$stats2;
var editor=_this8.props.editor;
var setIndex=editor.innerFocus.setIndex;
var set=editor.sets[setIndex];
if(!(set!=null&&set.species))return;

var data=(_TeamEditorState$samp=TeamEditorState.sampleSets)==null?void 0:_TeamEditorState$samp[editor.format];
var sid=toID(set.species);
var setTemplate=(_ref5=(_ref6=(_data$dex$set$species=data==null||(_data$dex=data.dex)==null||(_data$dex=_data$dex[set.species])==null?void 0:_data$dex[setName])!=null?_data$dex$set$species:data==null||(_data$dex2=data.dex)==null||(_data$dex2=_data$dex2[sid])==null?void 0:_data$dex2[setName])!=null?_ref6:
data==null||(_data$stats=data.stats)==null||(_data$stats=_data$stats[set.species])==null?void 0:_data$stats[setName])!=null?_ref5:data==null||(_data$stats2=data.stats)==null||(_data$stats2=_data$stats2[sid])==null?void 0:_data$stats2[setName];
if(!setTemplate)return;

var applied=JSON.parse(JSON.stringify(setTemplate));
Object.assign(set,applied);

editor.save();
_this8.props.onUpdate==null||_this8.props.onUpdate();
_this8.forceUpdate();
};_this8.
handleLoadUserSet=function(ev){
var setName=ev.target.value;
_this8.loadUserSet(setName);
};_this8.
loadUserSet=function(setName){
var editor=_this8.props.editor;
var setIndex=editor.innerFocus.setIndex;
var set=editor.sets[setIndex];
if(!(set!=null&&set.species))return;

var userSets=editor.getUserSets(set);
var setTemplate=userSets==null?void 0:userSets[setName];
if(!setTemplate)return;

var applied=JSON.parse(JSON.stringify(setTemplate));
delete applied.name;
Object.assign(set,applied);

editor.save();
_this8.props.onUpdate==null||_this8.props.onUpdate();
_this8.forceUpdate();
};_this8.
updateSearch=function(ev){
var searchBox=ev.currentTarget;
_this8.props.editor.setSearchValue(searchBox.value);
_this8.resetScroll();
_this8.forceUpdate();
};_this8.
handleClickFilters=function(ev){
var search=_this8.props.editor.search;
var target=ev.target;
while(target&&target.className!=='dexlist'){
if(target.tagName==='BUTTON'){
var filter=target.getAttribute('data-filter');
if(filter){
search.removeFilter(filter.split(':'));
var searchBox=_this8.base.querySelector('input[name=value]');
search.find((searchBox==null?void 0:searchBox.value)||'');
if(!TeamEditor.probablyMobile())searchBox==null||searchBox.select();
_this8.forceUpdate();
ev.preventDefault();
ev.stopPropagation();
break;
}
}

target=target.parentElement;
}
};_this8.
keyDownSearch=function(ev){var _editor$innerFocus;
var searchBox=ev.currentTarget;
var editor=_this8.props.editor;
switch(ev.keyCode){
case 8:
if(searchBox.selectionStart===0&&searchBox.selectionEnd===0){
editor.search.removeFilter();
editor.setSearchValue(searchBox.value);
_this8.resetScroll();
_this8.forceUpdate();
}
break;
case 38:
editor.upSearchValue();
var resultsUp=_this8.base.querySelector('.wizardsearchresults');
if(resultsUp){
resultsUp.scrollTop=Math.max(0,editor.searchIndex*33-Math.trunc((window.innerHeight-300)/2));
}
_this8.forceUpdate();
ev.preventDefault();
break;
case 40:
editor.downSearchValue();
var resultsDown=_this8.base.querySelector('.wizardsearchresults');
if(resultsDown){
resultsDown.scrollTop=Math.max(0,editor.searchIndex*33-Math.trunc((window.innerHeight-300)/2));
}
_this8.forceUpdate();
ev.preventDefault();
break;
case 37:

ev.stopImmediatePropagation();
break;
case 39:

ev.stopImmediatePropagation();
break;
case 13:
case 9:
var value=editor.selectSearchValue();
if(((_editor$innerFocus=editor.innerFocus)==null?void 0:_editor$innerFocus.type)!=='move')searchBox.value=value||'';
if(value!==null){var _editor$innerFocus2;
if(ev.keyCode===9&&((_editor$innerFocus2=editor.innerFocus)==null?void 0:_editor$innerFocus2.type)==='move'){
_this8.changeFocus({
setIndex:editor.innerFocus.setIndex,
type:ev.shiftKey?'item':'stats'
});
}else{var _editor$innerFocus3;
var _value$split=value.split('|'),name=_value$split[0],moveSlot=_value$split[1];
_this8.selectResult(((_editor$innerFocus3=editor.innerFocus)==null?void 0:_editor$innerFocus3.type)||'',name,moveSlot,ev.keyCode===9&&ev.shiftKey);
}
}else{
_this8.clearSearchBox();
editor.setSearchValue('');
_this8.resetScroll();
_this8.forceUpdate();
}
ev.preventDefault();
break;
}
};_this8.
scrollResults=function(ev){
if(!ev.currentTarget.scrollTop)return;
_this8.windowing=false;
if(document.documentElement.clientWidth===document.documentElement.scrollWidth){
ev.currentTarget.scrollIntoViewIfNeeded==null||ev.currentTarget.scrollIntoViewIfNeeded();
}
_this8.forceUpdate();
};return _this8;}_inheritsLoose(TeamWizard,_preact$Component3);var _proto4=TeamWizard.prototype;_proto4.changeFocus=function changeFocus(focus){var editor=this.props.editor;editor.innerFocus=focus;if(!focus){this.props.onUpdate();return;}var set=editor.sets[focus.setIndex];if(focus.type==='details'){this.setSearchBox=set.name||'';}else if(focus.type!=='stats'){var value;if(focus.type==='pokemon')value=(set==null?void 0:set.species)||'';else if(focus.type==='item')value=set.item;else if(focus.type==='ability')value=set.ability;editor.setSearchType(focus.type,focus.setIndex,value);this.resetScroll();this.setSearchBox=value||'';}this.props.onUpdate();};_proto4.renderSet=function renderSet(set,i){var _TeamEditorState$clip4;var editor=this.props.editor;var sprite=Dex.getTeambuilderSprite(set,editor.dex);if(!set){return preact.h("div",{"class":"set-button"},preact.h("div",{style:"text-align:right"},editor.deletedSet?preact.h("button",{onClick:this.undeleteSet,"class":"option"},preact.h("i",{"class":"fa fa-undo","aria-hidden":true})," Undo delete"):preact.h("button",{"class":"option",style:"visibility:hidden"},preact.h("i",{"class":"fa fa-trash","aria-hidden":true})," Delete")),preact.h("table",null,preact.h("tr",null,preact.h("td",{rowSpan:2,"class":"set-pokemon"},preact.h("div",{"class":"border-collapse"},preact.h("button",{"class":"button button-first cur",onClick:this.setFocus,value:"pokemon|"+i},preact.h("span",{"class":"sprite",style:sprite},preact.h("span",{"class":"sprite-inner"},preact.h("strong",{"class":"label"},"Pokemon")," ",preact.h("em",null,"(choose species)")))))),preact.h("td",{colSpan:2,"class":"set-details"}),preact.h("td",{rowSpan:2,"class":"set-moves"}),preact.h("td",{rowSpan:2,"class":"set-stats"})),preact.h("tr",null,preact.h("td",{"class":"set-ability"}),preact.h("td",{"class":"set-item"}))));}while(set.moves.length<4)set.moves.push('');var overfull=set.moves.length>4?' overfull':'';var cur=function(t){var _editor$innerFocus4;return editor.readonly||((_editor$innerFocus4=editor.innerFocus)==null?void 0:_editor$innerFocus4.type)===t&&editor.innerFocus.setIndex===i?' cur':'';};var species=editor.dex.species.get(set.species);var isCur=(_TeamEditorState$clip4=TeamEditorState.clipboard)!=null&&(_TeamEditorState$clip4=_TeamEditorState$clip4.teams)!=null&&(_TeamEditorState$clip4=_TeamEditorState$clip4[editor.team.key])!=null&&_TeamEditorState$clip4.sets[i]?' cur':'';return preact.h("div",{"class":"set-button"+isCur},preact.h("div",{style:"text-align:right"},preact.h("button",{"class":"option",onClick:this.copySet,value:i},preact.h("i",{"class":"fa fa-copy","aria-hidden":true})," ",isCur?"Remove from clipboard":TeamEditorState.clipboard?"Add to clipboard":editor.readonly?"Copy":"Copy/Move")," ",!(TeamEditorState.clipboard||editor.readonly)&&preact.h("button",{"class":"option",onClick:this.deleteSet,value:i},preact.h("i",{"class":"fa fa-trash","aria-hidden":true})," Delete")),preact.h("table",null,preact.h("tr",null,preact.h("td",{rowSpan:2,"class":"set-pokemon"},preact.h("div",{"class":"border-collapse"},preact.h("button",{"class":"button button-first"+cur('pokemon'),onClick:this.setFocus,value:"pokemon|"+i},preact.h("span",{"class":"sprite",style:sprite},preact.h("span",{"class":"sprite-inner"},preact.h("strong",{"class":"label"},"Pokemon")," ",set.species))))),preact.h("td",{colSpan:2,"class":"set-details"},preact.h("div",{"class":"border-collapse"},preact.h("button",{"class":"button button-middle"+cur('details'),onClick:this.setFocus,value:"details|"+i},preact.h("span",{"class":"detailcell"},preact.h("strong",{"class":"label"},"Types")," ",species.types.map(function(type){return preact.h("div",null,preact.h(PSIcon,{type:type}));})),preact.h("span",{"class":"detailcell"},preact.h("strong",{"class":"label"},"Level")," ",set.level||editor.defaultLevel,editor.narrow&&set.shiny&&preact.h(preact.Fragment,null,preact.h("br",null),preact.h("img",{src:Dex.resourcePrefix+"sprites/misc/shiny.png",width:22,height:22,alt:"Shiny"})),!editor.narrow&&set.gender&&set.gender!=='N'&&preact.h(preact.Fragment,null,preact.h("br",null),preact.h("img",{src:Dex.fxPrefix+"gender-"+set.gender.toLowerCase()+".png",alt:set.gender,width:"7",height:"10","class":"pixelated"}))),!!(!editor.narrow&&(set.shiny||editor.gen>=2))&&preact.h("span",{"class":"detailcell"},preact.h("strong",{"class":"label"},"Shiny")," ",set.shiny?preact.h("img",{src:Dex.resourcePrefix+"sprites/misc/shiny.png",width:22,height:22,alt:"Yes"}):"\u2014"),editor.gen===9&&preact.h("span",{"class":"detailcell"},preact.h("strong",{"class":"label"},"Tera")," ",preact.h(PSIcon,{type:set.teraType||species.requiredTeraType||species.types[0]})),editor.hpTypeMatters(set)&&preact.h("span",{"class":"detailcell"},preact.h("strong",{"class":"label"},"H.P.")," ",preact.h(PSIcon,{type:editor.getHPType(set)}))))),preact.h("td",{rowSpan:2,"class":"set-moves"},preact.h("div",{"class":"border-collapse"},preact.h("button",{"class":"button button-middle"+cur('move')+overfull,onClick:this.setFocus,value:"move|"+i},preact.h("strong",{"class":"label"},"Moves")," ",set.moves.map(function(move,mi){return preact.h("div",null,!editor.narrow&&preact.h("small",{"class":"gray"},"\u2022"),mi>=4?preact.h("span",{"class":"message-error"},move||editor.narrow&&'-'||''):move||editor.narrow&&'-');}),!set.moves.length&&preact.h("em",null,"(no moves)")))),preact.h("td",{rowSpan:2,"class":"set-stats"},preact.h("div",{"class":"border-collapse"},preact.h("button",{"class":"button button-last"+cur('stats'),onClick:this.setFocus,value:"stats|"+i},StatForm.renderStatGraph(set,this.props.editor,true))))),preact.h("tr",null,preact.h("td",{"class":"set-ability"},preact.h("div",{"class":"border-collapse"},preact.h("button",{"class":"button button-middle"+cur('ability'),onClick:this.setFocus,value:"ability|"+i},(editor.gen>=3||set.ability)&&preact.h(preact.Fragment,null,preact.h("strong",{"class":"label"},"Ability")," ",set.ability!=='No Ability'&&set.ability||(!set.ability?preact.h("em",null,"(choose ability)"):preact.h("em",null,"(no ability)")))))),preact.h("td",{"class":"set-item"},preact.h("div",{"class":"border-collapse"},preact.h("button",{"class":"button button-middle"+cur('item'),onClick:this.setFocus,value:"item|"+i},(editor.gen>=2||set.item)&&preact.h(preact.Fragment,null,set.item&&preact.h(PSIcon,{item:set.item}),preact.h("strong",{"class":"label"},"Item")," ",set.item||preact.h("em",null,"(no item)"))))))),preact.h("button",{"class":"button set-nickname"+cur('details'),onClick:this.setFocus,value:"details|"+i},preact.h("strong",{"class":"label"},"Nickname")," ",editor.getNickname(set)));};_proto4.clearSearchBox=function clearSearchBox(){var searchBox=this.base.querySelector('input[name=value]');if(searchBox){searchBox.value='';if(!TeamEditor.probablyMobile())searchBox.focus();}};_proto4.
resetScroll=function resetScroll(){
this.windowing=true;
var searchResults=this.base.querySelector('.wizardsearchresults');
if(searchResults)searchResults.scrollTop=0;
};_proto4.
windowResults=function windowResults(){
if(this.windowing){
return Math.ceil(window.innerHeight/33);
}
return null;
};_proto4.

componentDidUpdate=function componentDidUpdate(){
var searchBox=this.base.querySelector('input[name=value], input[name=nickname]');
if(this.setSearchBox!==null){
if(searchBox){
searchBox.value=this.setSearchBox;
if(!TeamEditor.probablyMobile())searchBox.select();
}
this.setSearchBox=null;
}
var filters=this.base.querySelector('.dexlist-filters');
if(searchBox&&searchBox.name==='value'){
if(filters){
var _filters$getBoundingC=filters.getBoundingClientRect(),width=_filters$getBoundingC.width;
searchBox.style.paddingLeft=width+5+"px";
}else{
searchBox.style.paddingLeft="3px";
}
}
};_proto4.
renderInnerFocus=function renderInnerFocus(){var _this9=this;
var editor=this.props.editor;
if(!editor.innerFocus)return null;
var _editor$innerFocus5=editor.innerFocus,type=_editor$innerFocus5.type,setIndex=_editor$innerFocus5.setIndex;
var set=this.props.editor.sets[setIndex];
var cur=function(i){return setIndex===i?' cur':'';};
var sampleSets=type==='ability'?editor.getSampleSets(set):[];
var userSets=type==='ability'?editor.getUserSets(set):null;
return preact.h("div",{"class":"team-focus-editor"},
preact.h("ul",{"class":"tabbar"},
preact.h("li",{"class":"home-li"},preact.h("button",{"class":"button",onClick:this.setFocus},
preact.h("i",{"class":"fa fa-chevron-left","aria-hidden":true})," Back"
)),
editor.sets.map(function(curSet,i){return preact.h("li",null,preact.h("button",{
"class":"button picontab"+cur(i),onClick:_this9.setFocus,value:type+"|"+i},

preact.h(PSIcon,{pokemon:curSet}),preact.h("br",null),
editor.getNickname(curSet)
));}),
editor.canAdd()&&preact.h("li",null,preact.h("button",{
"class":"button picontab"+cur(editor.sets.length),onClick:this.setFocus,value:"pokemon|"+editor.sets.length},

preact.h("i",{"class":"fa fa-plus"})
))
),
preact.h("div",{"class":"pad",style:"padding-top:0"},this.renderSet(set,setIndex)),
type==='stats'?
preact.h(StatForm,{editor:editor,set:set,onChange:this.handleSetChange}):
type==='details'?
preact.h(DetailsForm,{editor:editor,set:set,onChange:this.handleSetChange}):

preact.h("div",null,
preact.h("div",{"class":"searchboxwrapper pad",onClick:this.handleClickFilters},
preact.h("input",{
type:"search",name:"value","class":"textbox",placeholder:"Search or filter",
onInput:this.updateSearch,onKeyDown:this.keyDownSearch,autocomplete:"off"}
),
PSSearchResults.renderFilters(editor.search)
),
preact.h("div",{"class":"wizardsearchresults",onScroll:this.scrollResults},
preact.h(PSSearchResults,{
search:editor.search,hideFilters:true,resultIndex:editor.searchIndex,
onSelect:this.selectResult,windowing:this.windowResults()}
),
(sampleSets==null?void 0:sampleSets.length)!==0&&
preact.h("div",{"class":"sample-sets"},
preact.h("h3",null,"Sample sets"),
sampleSets?
preact.h("div",null,
sampleSets.map(function(setName){return preact.h(preact.Fragment,null,
preact.h("button",{"class":"button",onClick:function(){return _this9.loadSampleSet(setName);}},
setName
)," "
);})
):

preact.h("div",null,"Loading...")

),

userSets!==null&&
preact.h("div",{"class":"sample-sets"},
preact.h("h3",null,"Box sets"),
Object.keys(userSets).length>0?
preact.h("div",null,
Object.keys(userSets).map(function(setName){return preact.h(preact.Fragment,null,
preact.h("button",{"class":"button",value:setName,onClick:_this9.handleLoadUserSet},
setName
)," "
);})
):

preact.h("div",null,"No ",set.species," sets found in boxes")

)

)
)

);
};_proto4.
render=function render(){var _this10=this;
var editor=this.props.editor;
if(editor.innerFocus)return this.renderInnerFocus();
if(editor.fetching){
return preact.h("div",{"class":"teameditor"},"Fetching Paste...");
}

var clipboard=TeamEditorState.clipboard;
var willNotMove=function(i){var _clipboard$teams$edit,_clipboard$teams$edit2,_clipboard$teams$edit3;return(
(clipboard==null?void 0:clipboard.teams)&&!clipboard.otherSets&&clipboard.teams[editor.team.key]&&
Object.keys((_clipboard$teams$edit=clipboard.teams[editor.team.key])==null?void 0:_clipboard$teams$edit.sets).length===1&&
!!((_clipboard$teams$edit2=clipboard.teams[editor.team.key])!=null&&_clipboard$teams$edit2.sets[i]||(_clipboard$teams$edit3=clipboard.teams[editor.team.key])!=null&&_clipboard$teams$edit3.sets[i-1]));};

var pasteControls=function(i){var _editor$deletedSet2;return editor.readonly?
null:
clipboard?preact.h("p",null,
preact.h("button",{"class":"button notifying",onClick:_this10.pasteSet,value:i},
preact.h("i",{"class":"fa fa-clipboard","aria-hidden":true})," Paste copy here"
)," ",
!willNotMove(i)&&preact.h("button",{"class":"button notifying",onClick:_this10.moveSet,value:i,disabled:clipboard.readonly},
preact.h("i",{"class":"fa fa-arrow-right","aria-hidden":true})," Move here"
)
):((_editor$deletedSet2=editor.deletedSet)==null?void 0:_editor$deletedSet2.index)===i?preact.h("p",{style:"text-align:right"},
preact.h("button",{"class":"button",onClick:_this10.undeleteSet},
preact.h("i",{"class":"fa fa-undo","aria-hidden":true})," Undo delete"
)
):null;};
return preact.h("div",{"class":"teameditor"},
editor.sets.map(function(set,i){return[
pasteControls(i),
_this10.renderSet(set,i)];}
),
pasteControls(editor.sets.length),
editor.canAdd()&&preact.h("p",null,preact.h("button",{"class":"button big",onClick:this.setFocus,value:"pokemon|"+editor.sets.length},
preact.h("i",{"class":"fa fa-plus","aria-hidden":true})," Add Pok\xE9mon"
))
);
};return TeamWizard;}(preact.Component);var


StatForm=function(_preact$Component4){function StatForm(){var _this11;for(var _len4=arguments.length,args=new Array(_len4),_key5=0;_key5<_len4;_key5++){args[_key5]=arguments[_key5];}_this11=_preact$Component4.call.apply(_preact$Component4,[this].concat(args))||this;_this11.
































































































































































handleGuess=function(){
var _this11$props=_this11.props,editor=_this11$props.editor,set=_this11$props.set;
var team=editor.team;

var guess=new BattleStatGuesser(team.format).guess(set);
set.evs=guess.evs;
_this11.plus=guess.plusStat||null;
_this11.minus=guess.minusStat||null;
_this11.updateNatureFromPlusMinus();
_this11.props.onChange();
};_this11.
handleOptimize=function(){
var _this11$props2=_this11.props,editor=_this11$props2.editor,set=_this11$props2.set;
var team=editor.team;

var optimized=BattleStatOptimizer(set,team.format);
if(!optimized)return;

set.evs=optimized.evs;
_this11.plus=optimized.plus||null;
_this11.minus=optimized.minus||null;
_this11.props.onChange();
};_this11.


























































































plus=null;_this11.
minus=null;_this11.










changeEV=function(ev){
var target=ev.currentTarget;
var set=_this11.props.set;
var statID=target.name.split('-')[1];
var value=Math.abs(parseInt(target.value));

if(isNaN(value)){
if(set.evs)delete set.evs[statID];
}else{
set.evs||(set.evs={});
set.evs[statID]=value;
}

if(target.type==='range'){

var maxEv=_this11.maxEVs();
if(maxEv<6*252){
var totalEv=0;for(var _i37=0,_Object$values5=
Object.values(set.evs||{});_i37<_Object$values5.length;_i37++){var curEv=_Object$values5[_i37];totalEv+=curEv;}
if(totalEv>maxEv&&totalEv-value<=maxEv){
set.evs[statID]=maxEv-(totalEv-value)-maxEv%4;
}
}
}else{
if(target.value.includes('+')){
if(statID==='hp'){
alert("Natures cannot raise or lower HP.");
return;
}
_this11.plus=statID;
}else if(_this11.plus===statID){
_this11.plus=null;
}
if(target.value.includes('-')){
if(statID==='hp'){
alert("Natures cannot raise or lower HP.");
return;
}
_this11.minus=statID;
}else if(_this11.minus===statID){
_this11.minus=null;
}
_this11.updateNatureFromPlusMinus();
}

_this11.props.onChange();
};_this11.
updateNatureFromPlusMinus=function(){
var set=_this11.props.set;
set.nature=Teams.getNatureFromPlusMinus(_this11.plus,_this11.minus)||undefined;
};_this11.













changeIV=function(ev){
var target=ev.currentTarget;
var set=_this11.props.set;
var statID=target.name.split('-')[1];
var value=_this11.dvToIv(target.value);
if(value===null){
if(set.ivs){
delete set.ivs[statID];
if(Object.values(set.ivs).every(function(iv){return iv===undefined;})){
set.ivs=undefined;
}
}
}else{
set.ivs||(set.ivs={hp:31,atk:31,def:31,spa:31,spd:31,spe:31});
set.ivs[statID]=value;
}
_this11.props.onChange();
};_this11.
changeNature=function(ev){
var target=ev.currentTarget;
var set=_this11.props.set;
var nature=target.value;
if(nature==='Serious'){
delete set.nature;
}else{
set.nature=nature;
}
_this11.props.onChange();
};_this11.
changeIVSpread=function(ev){
var target=ev.currentTarget;
var set=_this11.props.set;
if(!target.value)return;

if(target.value==='auto'){
set.ivs=undefined;
}else{
var _target$value$split$m=target.value.split('/').map(Number),hp=_target$value$split$m[0],atk=_target$value$split$m[1],def=_target$value$split$m[2],spa=_target$value$split$m[3],spd=_target$value$split$m[4],spe=_target$value$split$m[5];
set.ivs={hp:hp,atk:atk,def:def,spa:spa,spd:spd,spe:spe};
}
_this11.props.onChange();
};return _this11;}_inheritsLoose(StatForm,_preact$Component4);StatForm.renderStatGraph=function renderStatGraph(set,editor,evs){var defaultEV=editor.gen>2?0:252;var ivs=editor.getIVs(set);return Dex.statNames.map(function(statID){var _set$evs$statID,_set$evs4,_BattleNatures3,_BattleNatures4;if(statID==='spd'&&editor.gen===1)return null;var stat=editor.getStat(statID,set,ivs[statID]);var ev=(_set$evs$statID=(_set$evs4=set.evs)==null?void 0:_set$evs4[statID])!=null?_set$evs$statID:defaultEV;var width=stat*75/504;if(statID==='hp')width=stat*75/704;if(width>75)width=75;var hue=Math.floor(stat*180/714);if(hue>360)hue=360;var statName=editor.gen===1&&statID==='spa'?'Spc':BattleStatNames[statID];if(evs&&!ev&&!set.evs&&statID==='hp')ev='EVs';return preact.h("span",{"class":"statrow"},preact.h("label",null,statName)," ",preact.h("span",{"class":"statgraph"},preact.h("span",{style:"width:"+width+"px;background:hsl("+hue+",40%,75%);border-color:hsl("+hue+",40%,45%)"}))," ",!evs&&preact.h("em",null,stat),evs&&preact.h("em",null,ev||''),evs&&(((_BattleNatures3=BattleNatures[set.nature])==null?void 0:_BattleNatures3.plus)===statID?preact.h("small",null,"+"):((_BattleNatures4=BattleNatures[set.nature])==null?void 0:_BattleNatures4.minus)===statID?preact.h("small",null,"\u2212"):null));});};var _proto5=StatForm.prototype;_proto5.renderIVMenu=function renderIVMenu(){var _this$props2=this.props,editor=_this$props2.editor,set=_this$props2.set;if(editor.gen<=2)return null;var hpType=editor.getHPMove(set);var hpIVdata=hpType&&!editor.canHyperTrain(set)&&editor.getHPIVs(hpType)||null;var autoSpread=set.ivs&&editor.defaultIVs(set,false);var autoSpreadValue=autoSpread&&Object.values(autoSpread).join('/');if(!hpIVdata){return preact.h("select",{name:"ivspread","class":"button",onChange:this.changeIVSpread},preact.h("option",{value:"",selected:true},"IV spreads"),autoSpreadValue&&preact.h("option",{value:"auto"},"Auto (",autoSpreadValue,")"),preact.h("optgroup",{label:"min Atk"},preact.h("option",{value:"31/0/31/31/31/31"},"31/0/31/31/31/31")),preact.h("optgroup",{label:"min Atk, min Spe"},preact.h("option",{value:"31/0/31/31/31/0"},"31/0/31/31/31/0")),preact.h("optgroup",{label:"max all"},preact.h("option",{value:"31/31/31/31/31/31"},"31/31/31/31/31/31")),preact.h("optgroup",{label:"min Spe"},preact.h("option",{value:"31/31/31/31/31/0"},"31/31/31/31/31/0")));}var minStat=editor.gen>=6?0:2;var hpIVs=hpIVdata.map(function(ivs){return ivs.split('').map(function(iv){return parseInt(iv);});});return preact.h("select",{name:"ivspread","class":"button",onChange:this.changeIVSpread},preact.h("option",{value:"",selected:true},"Hidden Power ",hpType," IVs"),autoSpreadValue&&preact.h("option",{value:"auto"},"Auto (",autoSpreadValue,")"),preact.h("optgroup",{label:"min Atk"},hpIVs.map(function(ivs){var spread=ivs.map(function(iv,i){return(i===1?minStat:30)+iv;}).join('/');return preact.h("option",{value:spread},spread);})),preact.h("optgroup",{label:"min Atk, min Spe"},hpIVs.map(function(ivs){var spread=ivs.map(function(iv,i){return(i===5||i===1?minStat:30)+iv;}).join('/');return preact.h("option",{value:spread},spread);})),preact.h("optgroup",{label:"max all"},hpIVs.map(function(ivs){var spread=ivs.map(function(iv){return 30+iv;}).join('/');return preact.h("option",{value:spread},spread);})),preact.h("optgroup",{label:"min Spe"},hpIVs.map(function(ivs){var spread=ivs.map(function(iv,i){return(i===5?minStat:30)+iv;}).join('/');return preact.h("option",{value:spread},spread);})));};_proto5.smogdexLink=function smogdexLink(s){var editor=this.props.editor;var species=editor.dex.species.get(s);var format=editor.format;var smogdexid=toID(species.baseSpecies);if(species.id==='meowstic'){smogdexid='meowstic-m';}else if(species.forme){switch(species.baseSpecies){case'Alcremie':case'Basculin':case'Burmy':case'Castform':case'Cherrim':case'Deerling':case'Flabebe':case'Floette':case'Florges':case'Furfrou':case'Gastrodon':case'Genesect':case'Keldeo':case'Mimikyu':case'Minior':case'Pikachu':case'Polteageist':case'Sawsbuck':case'Shellos':case'Sinistea':case'Tatsugiri':case'Vivillon':break;default:smogdexid+='-'+toID(species.forme);break;}}var generationNumber=9;if(format.startsWith('gen')){var number=parseInt(format.charAt(3),10);if(1<=number&&number<=8){generationNumber=number;}format=format.slice(4);}var generation=['rb','gs','rs','dp','bw','xy','sm','ss','sv'][generationNumber-1];if(format==='battlespotdoubles'){smogdexid+='/vgc15';}else if(format==='doublesou'||format==='doublesuu'){smogdexid+='/doubles';}else if(format==='ou'||format==='uu'||format==='ru'||format==='nu'||format==='pu'||format==='lc'||format==='monotype'||format==='mixandmega'||format==='nfe'||format==='nationaldex'||format==='stabmons'||format==='1v1'||format==='almostanyability'){smogdexid+='/'+format;}else if(format==='balancedhackmons'){smogdexid+='/bh';}else if(format==='anythinggoes'){smogdexid+='/ag';}else if(format==='nationaldexag'){smogdexid+='/national-dex-ag';}return"http://smogon.com/dex/"+generation+"/pokemon/"+smogdexid+"/";};_proto5.renderSpreadGuesser=function renderSpreadGuesser(){var _this$props3=this.props,editor=_this$props3.editor,set=_this$props3.set;var team=editor.team;if(editor.gen<3){return preact.h("p",null,"(",preact.h("a",{target:"_blank",href:this.smogdexLink(set.species)},"Smogon\xA0analysis"),")");}var guess=new BattleStatGuesser(team.format).guess(set);var role=guess.role;var guessedEVs=guess.evs;var guessedPlus=guess.plusStat||null;var guessedMinus=guess.minusStat||null;return preact.h("p",{"class":"suggested"},preact.h("small",null,"Guessed spread: "),role==='?'?"(Please choose 4 moves to get a guessed spread)":preact.h("button",{name:"setStatFormGuesses","class":"button",onClick:this.handleGuess},role,": ",Dex.statNames.map(function(statID){return guessedEVs[statID]?guessedEVs[statID]+" "+BattleStatNames[statID]:null;}).filter(Boolean).join(' / '),!!(guessedPlus&&guessedMinus)&&" (+"+BattleStatNames[guessedPlus]+", -"+BattleStatNames[guessedMinus]+")"),preact.h("small",null," (",preact.h("a",{target:"_blank",href:this.smogdexLink(set.species)},"Smogon\xA0analysis"),")"));};_proto5.renderStatOptimizer=function renderStatOptimizer(){var optimized=BattleStatOptimizer(this.props.set,this.props.editor.format);if(!optimized)return null;return preact.h("p",null,preact.h("small",null,preact.h("em",null,"Protip:")," Use a different nature to ",optimized.savedEVs?"save "+optimized.savedEVs+" EVs":'get higher stats',": "),preact.h("button",{name:"setStatFormOptimization","class":"button",onClick:this.handleOptimize},Dex.statNames.map(function(statID){return optimized.evs[statID]?optimized.evs[statID]+" "+BattleStatNames[statID]:null;}).filter(Boolean).join(' / '),!!(optimized.plus&&optimized.minus)&&" (+"+BattleStatNames[optimized.plus]+", -"+BattleStatNames[optimized.minus]+")"));};_proto5.setInput=function setInput(name,value){var evInput=this.base.querySelector("input[name=\""+name+"\"]");if(evInput)evInput.value=value;};_proto5.update=function update(init){var _querySelector;var set=this.props.set;var nature=BattleNatures[set.nature];var skipID=!init?(_querySelector=this.base.querySelector('input:focus'))==null?void 0:_querySelector.name:undefined;if(nature!=null&&nature.plus){this.plus=(nature==null?void 0:nature.plus)||null;this.minus=(nature==null?void 0:nature.minus)||null;}else if(this.plus&&this.minus){this.plus=null;this.minus=null;}for(var _i39=0,_Dex$statNames4=Dex.statNames;_i39<_Dex$statNames4.length;_i39++){var _set$evs5,_set$ivs;var statID=_Dex$statNames4[_i39];var ev=""+(((_set$evs5=set.evs)==null?void 0:_set$evs5[statID])||'');var plusMinus=this.plus===statID?'+':this.minus===statID?'-':'';var iv=this.ivToDv((_set$ivs=set.ivs)==null?void 0:_set$ivs[statID]);if(skipID!=="ev-"+statID)this.setInput("ev-"+statID,ev+plusMinus);if(skipID!=="iv-"+statID)this.setInput("iv-"+statID,iv);}};_proto5.componentDidMount=function componentDidMount(){this.update(true);};_proto5.componentDidUpdate=function componentDidUpdate(){this.update();};_proto5.renderStatbar=function renderStatbar(stat,statID){var width=stat*180/504;if(statID==='hp')width=Math.floor(stat*180/704);if(width>179)width=179;var hue=Math.floor(stat*180/714);if(hue>360)hue=360;return preact.h("span",{style:"width:"+Math.floor(width)+"px;background:hsl("+hue+",85%,45%);border-color:hsl("+hue+",85%,35%)"});};_proto5.dvToIv=function dvToIv(dvOrIvString){var dvOrIv=Number(dvOrIvString);if(isNaN(dvOrIv))return null;var useIVs=this.props.editor.gen>2;return useIVs?dvOrIv:dvOrIv===15?31:dvOrIv*2;};_proto5.ivToDv=function ivToDv(iv){if(iv===null||iv===undefined)return'';var useIVs=this.props.editor.gen>2;return""+(useIVs?iv:Math.trunc(iv/2));};_proto5.
maxEVs=function maxEVs(){
var team=this.props.editor.team;
var useEVs=!team.format.includes('letsgo');
return useEVs?510:Infinity;
};_proto5.
render=function render(){var _this12=this;
var _this$props4=this.props,editor=_this$props4.editor,set=_this$props4.set;
var team=editor.team;
var species=editor.dex.species.get(set.species);

var baseStats=species.baseStats;

var nature=BattleNatures[set.nature||'Serious'];

var useEVs=!team.format.includes('letsgo');

var maxEV=useEVs?252:200;
var stepEV=useEVs?4:1;
var defaultEV=useEVs&&editor.gen<=2&&!set.evs?maxEV:0;
var useIVs=editor.gen>2;


var statNames={
hp:'HP',
atk:'Attack',
def:'Defense',
spa:'Sp. Atk.',
spd:'Sp. Def.',
spe:'Speed'
};
if(editor.gen===1)statNames.spa='Special';

var ivs=editor.getIVs(set);
var stats=Dex.statNames.filter(function(statID){return editor.gen>1||statID!=='spd';}).map(function(statID){return[
statID,statNames[statID],editor.getStat(statID,set,ivs[statID])];}
);

var remaining=null;
var maxEv=this.maxEVs();
if(maxEv<6*252){
var totalEv=0;for(var _i41=0,_Object$values7=
Object.values(set.evs||{});_i41<_Object$values7.length;_i41++){var ev=_Object$values7[_i41];totalEv+=ev;}
if(totalEv<=maxEv){
remaining=totalEv>maxEv-2?0:maxEv-2-totalEv;
}else{
remaining=maxEv-totalEv;
}
remaining||(remaining=null);
}
var defaultIVs=editor.defaultIVs(set);

return preact.h("div",{style:"font-size:10pt",role:"dialog","aria-label":"Stats"},
preact.h("div",{"class":"resultheader"},preact.h("h3",null,"EVs, IVs, and Nature")),
preact.h("div",{"class":"pad"},
this.renderSpreadGuesser(),
preact.h("table",null,
preact.h("tr",null,
preact.h("th",null),
preact.h("th",null,"Base"),
preact.h("th",{"class":"setstatbar"}),
preact.h("th",null,useEVs?'EVs':'AVs'),
preact.h("th",null),
preact.h("th",null,useIVs?'IVs':'DVs'),
preact.h("th",null)
),
stats.map(function(_ref7){var _set$evs$statID2,_set$evs6;var statID=_ref7[0],statName=_ref7[1],stat=_ref7[2];return preact.h("tr",null,
preact.h("th",{style:"text-align:right;font-weight:normal"},statName),
preact.h("td",{style:"text-align:right"},preact.h("strong",null,baseStats[statID])),
preact.h("td",{"class":"setstatbar"},_this12.renderStatbar(stat,statID)),
preact.h("td",null,preact.h("input",{
name:"ev-"+statID,placeholder:""+(defaultEV||''),
type:"text",inputMode:"numeric","class":"textbox default-placeholder",style:"width:40px",
onInput:_this12.changeEV,onChange:_this12.changeEV}
)),
preact.h("td",null,preact.h("input",{
name:"evslider-"+statID,value:(_set$evs$statID2=(_set$evs6=set.evs)==null?void 0:_set$evs6[statID])!=null?_set$evs$statID2:defaultEV,min:"0",max:maxEV,step:stepEV,
type:"range","class":"evslider",tabIndex:-1,"aria-hidden":true,
onInput:_this12.changeEV,onChange:_this12.changeEV}
)),
preact.h("td",null,preact.h("input",{
name:"iv-"+statID,min:0,max:useIVs?31:15,placeholder:""+defaultIVs[statID],style:"width:40px",
type:"number",inputMode:"numeric","class":"textbox default-placeholder",onInput:_this12.changeIV,onChange:_this12.changeIV}
)),
preact.h("td",{style:"text-align:right"},preact.h("strong",null,stat))
);}),
preact.h("tr",null,
preact.h("td",{colSpan:2}),
preact.h("td",{"class":"setstatbar",style:"text-align:right"},remaining!==null?'Remaining:':''),
preact.h("td",{style:"text-align:center"},remaining&&remaining<0?preact.h("b",{"class":"message-error"},remaining):remaining),
preact.h("td",{colSpan:3,style:"text-align:right"},this.renderIVMenu())
)
),
editor.gen>=3&&preact.h("p",null,"Nature: ",
preact.h("select",{name:"nature","class":"button",onChange:this.changeNature},
Object.entries(BattleNatures).map(function(_ref8){var natureName=_ref8[0],curNature=_ref8[1];return(
preact.h("option",{value:natureName,selected:curNature===nature},
natureName,
curNature.plus&&" (+"+BattleStatNames[curNature.plus]+", -"+BattleStatNames[curNature.minus]+")"
));}
)
)
),
editor.gen>=3&&preact.h("p",null,
preact.h("small",null,preact.h("em",null,"Protip:")," You can also set natures by typing ",preact.h("kbd",null,"+")," and ",preact.h("kbd",null,"-")," in the EV box.")
),
editor.gen>=3&&this.renderStatOptimizer()
)
);
};return StatForm;}(preact.Component);var


DetailsForm=function(_preact$Component5){function DetailsForm(){var _this13;for(var _len5=arguments.length,args=new Array(_len5),_key6=0;_key6<_len5;_key6++){args[_key6]=arguments[_key6];}_this13=_preact$Component5.call.apply(_preact$Component5,[this].concat(args))||this;_this13.

















changeNickname=function(ev){
var target=ev.currentTarget;
var set=_this13.props.set;
if(target.value){
set.name=target.value.trim();
}else{
delete set.name;
}
_this13.props.onChange();
};_this13.
changeTera=function(ev){
var target=ev.currentTarget;
var _this13$props=_this13.props,editor=_this13$props.editor,set=_this13$props.set;
var species=editor.dex.species.get(set.species);
if(!target.value||target.value===(species.requiredTeraType||species.types[0])){
delete set.teraType;
}else{
set.teraType=target.value.trim();
}
_this13.props.onChange();
};_this13.
changeLevel=function(ev){
var target=ev.currentTarget;
var set=_this13.props.set;
if(target.value){
set.level=parseInt(target.value.trim());
}else{
delete set.level;
}
_this13.props.onChange();
};_this13.
changeGender=function(ev){
var target=ev.currentTarget;
var set=_this13.props.set;
if(target.value){
set.gender=target.value.trim();
}else{
delete set.gender;
}
_this13.props.onChange();
};_this13.
changeHappiness=function(ev){
var target=ev.currentTarget;
var set=_this13.props.set;
if(target.value){
set.happiness=parseInt(target.value.trim());
}else{
delete set.happiness;
}
_this13.props.onChange();
};_this13.
changeShiny=function(ev){
var target=ev.currentTarget;
var set=_this13.props.set;
if(target.value){
set.shiny=true;
}else{
delete set.shiny;
}
_this13.props.onChange();
};_this13.
changeDynamaxLevel=function(ev){
var target=ev.currentTarget;
var set=_this13.props.set;
if(target.value){
set.dynamaxLevel=parseInt(target.value.trim());
}else{
delete set.dynamaxLevel;
}
_this13.props.onChange();
};_this13.
changeGigantamax=function(ev){
var target=ev.currentTarget;
var set=_this13.props.set;
if(target.checked){
set.gigantamax=true;
}else{
delete set.gigantamax;
}
_this13.props.onChange();
};_this13.
changeHPType=function(ev){
var target=ev.currentTarget;
var set=_this13.props.set;
if(target.value){
set.hpType=target.value;
}else{
delete set.hpType;
}
_this13.props.onChange();
};_this13.










































































































































selectSprite=function(ev){
var target=ev.currentTarget;
var formId=target.value;
var _this13$props2=_this13.props,editor=_this13$props2.editor,set=_this13$props2.set;
var species=editor.dex.species.get(formId);
if(!species.exists)return;
editor.changeSpecies(set,species.name);
_this13.props.onChange();
_this13.forceUpdate();
};return _this13;}_inheritsLoose(DetailsForm,_preact$Component5);var _proto6=DetailsForm.prototype;_proto6.update=function update(init){var _querySelector2;var set=this.props.set;var skipID=!init?(_querySelector2=this.base.querySelector('input:focus'))==null?void 0:_querySelector2.name:undefined;var nickname=this.base.querySelector('input[name="nickname"]');if(nickname&&skipID!=='nickname')nickname.value=set.name||'';};_proto6.componentDidMount=function componentDidMount(){this.update(true);};_proto6.componentDidUpdate=function componentDidUpdate(){this.update();};_proto6.renderGender=function renderGender(gender){var genderTable={'M':"Male",'F':"Female"};if(gender==='N')return'Unknown';return preact.h(preact.Fragment,null,preact.h("img",{src:Dex.fxPrefix+"gender-"+gender.toLowerCase()+".png",alt:"",width:"7",height:"10","class":"pixelated"})," ",genderTable[gender]);};_proto6.render=function render(){var _set$level,_set$happiness,_set$dynamaxLevel,_this14=this;var _this$props5=this.props,editor=_this$props5.editor,set=_this$props5.set;var species=editor.dex.species.get(set.species);return preact.h("div",{style:"font-size:10pt",role:"dialog","aria-label":"Details"},preact.h("div",{"class":"resultheader"},preact.h("h3",null,"Details")),preact.h("div",{"class":"pad"},preact.h("p",null,preact.h("label",{"class":"label"},"Nickname: ",preact.h("input",{name:"nickname","class":"textbox default-placeholder",placeholder:species.baseSpecies,onInput:this.changeNickname,onChange:this.changeNickname}))),preact.h("p",null,preact.h("label",{"class":"label"},"Level: ",preact.h("input",{name:"level",value:(_set$level=set.level)!=null?_set$level:'',placeholder:""+editor.defaultLevel,type:"number",inputMode:"numeric",min:"1",max:"100",step:"1","class":"textbox inputform numform default-placeholder",style:"width: 50px",onInput:this.changeLevel,onChange:this.changeLevel})),preact.h("small",null,"(You probably want to change the team's levels by changing the format, not here)")),editor.gen>1&&preact.h(preact.Fragment,null,preact.h("p",null,preact.h("div",{"class":"label"},"Shiny: ",preact.h("div",{"class":"labeled"},preact.h("label",{"class":"checkbox inline"},preact.h("input",{type:"radio",name:"shiny",value:"true",checked:set.shiny,onInput:this.changeShiny,onChange:this.changeShiny})," ",preact.h("img",{src:Dex.resourcePrefix+"sprites/misc/shiny.png",width:22,height:22,alt:"Shiny"})," Yes"),preact.h("label",{"class":"checkbox inline"},preact.h("input",{type:"radio",name:"shiny",value:"",checked:!set.shiny,onInput:this.changeShiny,onChange:this.changeShiny})," No")))),preact.h("p",null,preact.h("div",{"class":"label"},"Gender: ",species.gender?preact.h("strong",null,this.renderGender(species.gender)):preact.h("div",{"class":"labeled"},preact.h("label",{"class":"checkbox inline"},preact.h("input",{type:"radio",name:"gender",value:"M",checked:set.gender==='M',onInput:this.changeGender,onChange:this.changeGender})," ",this.renderGender('M')),preact.h("label",{"class":"checkbox inline"},preact.h("input",{type:"radio",name:"gender",value:"F",checked:set.gender==='F',onInput:this.changeGender,onChange:this.changeGender})," ",this.renderGender('F')),preact.h("label",{"class":"checkbox inline"},preact.h("input",{type:"radio",name:"gender",value:"",checked:!set.gender||set.gender==='N',onInput:this.changeGender,onChange:this.changeGender})," Random")))),editor.isLetsGo?preact.h("p",null,preact.h("label",{"class":"label"},"Happiness: ",preact.h("input",{name:"happiness",value:"",placeholder:"70",type:"number",inputMode:"numeric","class":"textbox inputform numform default-placeholder",style:"width: 50px",onInput:this.changeHappiness,onChange:this.changeHappiness}))):(editor.gen<8||editor.isNatDex)&&preact.h("p",null,preact.h("label",{"class":"label"},"Happiness: ",preact.h("input",{name:"happiness",value:(_set$happiness=set.happiness)!=null?_set$happiness:'',placeholder:"255",type:"number",inputMode:"numeric",min:"0",max:"255",step:"1","class":"textbox inputform numform default-placeholder",style:"width: 50px",onInput:this.changeHappiness,onChange:this.changeHappiness})))),editor.gen===8&&!editor.isBDSP&&!species.cannotDynamax&&preact.h("p",null,preact.h("label",{"class":"label",style:"display:inline"},"Dynamax Level: ",preact.h("input",{name:"dynamaxlevel",value:(_set$dynamaxLevel=set.dynamaxLevel)!=null?_set$dynamaxLevel:'',placeholder:"10",type:"number",inputMode:"numeric",min:"0",max:"10",step:"1","class":"textbox inputform numform default-placeholder",onInput:this.changeDynamaxLevel,onChange:this.changeDynamaxLevel}))," ",species.canGigantamax?preact.h("label",{"class":"checkbox inline"},preact.h("input",{type:"checkbox",name:"gigantamax",value:"true",checked:set.gigantamax,onInput:this.changeGigantamax,onChange:this.changeGigantamax})," Gigantamax"):species.forme==='Gmax'&&preact.h("label",{"class":"checkbox inline"},preact.h("input",{type:"checkbox",checked:true,disabled:true})," Gigantamax")),(!editor.isLetsGo&&editor.gen===7||editor.isNatDex||species.baseSpecies==='Unown')&&preact.h("p",null,preact.h("label",{"class":"label"},"Hidden Power Type: ",preact.h("select",{name:"hptype","class":"button",onChange:this.changeHPType},Dex.types.all().map(function(type){return type.HPivs&&preact.h("option",{value:type.name,selected:editor.getHPType(set)===type.name},type.name);})))),editor.gen===9&&preact.h("p",null,preact.h("label",{"class":"label",title:"Tera Type"},"Tera Type: ",species.requiredTeraType&&editor.formeLegality==='normal'?preact.h("select",{name:"teratype","class":"button cur",disabled:true},preact.h("option",null,species.requiredTeraType)):preact.h("select",{name:"teratype","class":"button",onChange:this.changeTera},Dex.types.all().map(function(type){return preact.h("option",{value:type.name,selected:(set.teraType||species.requiredTeraType||species.types[0])===type.name},type.name);})))),species.cosmeticFormes&&preact.h("div",null,preact.h("p",null,preact.h("strong",null,"Form:")),preact.h("div",{style:"display:flex;flex-wrap:wrap;gap:6px;max-width:400px;"},function(_species$cosmeticForm){var baseId=toID(species.baseSpecies);var forms=(_species$cosmeticForm=species.cosmeticFormes)!=null&&_species$cosmeticForm.length?[baseId].concat(species.cosmeticFormes.map(toID)):[baseId];return forms.map(function(id){var sp=editor.dex.species.get(id);var isCur=toID(set.species)===id;return preact.h("button",{value:id,"class":"button piconbtn"+(isCur?' cur':''),style:{padding:'2px'},onClick:_this14.selectSprite},preact.h(PSIcon,{pokemon:{species:sp.name}}),preact.h("br",null),sp.forme||sp.baseForme||sp.baseSpecies);});}()))));};return DetailsForm;}(preact.Component);
//# sourceMappingURL=battle-team-editor.js.map