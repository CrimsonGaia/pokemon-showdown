"use strict";/**
 * Battle choices
 *
 * PS will send requests "what do you do this turn?", and you send back
 * choices "I switch Pikachu for Caterpie, and Squirtle uses Water Gun"
 *
 * This file contains classes for handling requests and choices.
 *
 * Dependencies: battle-dex
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */var














































































































BattleChoiceBuilder=function(){
























function BattleChoiceBuilder(request){this.request=void 0;this.noCancel=void 0;this.choices=[];this.current={choiceType:'move',move:0,targetLoc:0,mega:false,megax:false,megay:false,ultra:false,z:false,max:false,tera:false};this.alreadySwitchingIn=[];this.alreadyMega=false;this.alreadyMax=false;this.alreadyZ=false;this.alreadyTera=false;
this.request=request;
this.noCancel=request.noCancel||request.requestType==='wait';
this.fillPasses();
}var _proto=BattleChoiceBuilder.prototype;_proto.

toString=function toString(){
var choices=this.choices;
if(this.current.move)choices=choices.concat(this.stringChoice(this.current));
return choices.join(', ').replace(/, team /g,', ');
};_proto.

isDone=function isDone(){
return this.choices.length>=this.requestLength();
};_proto.
isEmpty=function isEmpty(){for(var _i2=0,_this$choices2=
this.choices;_i2<_this$choices2.length;_i2++){var choice=_this$choices2[_i2];
if(choice!=='pass')return false;
}
if(this.current.move)return false;
return true;
};_proto.


index=function index(){
return this.choices.length;
};_proto.

requestLength=function requestLength(){
var request=this.request;
switch(request.requestType){
case'move':
return request.active.length;
case'switch':
return request.forceSwitch.length;
case'team':
return request.chosenTeamSize||1;
case'wait':
return 0;
}
};_proto.
currentMoveRequest=function currentMoveRequest(){var index=arguments.length>0&&arguments[0]!==undefined?arguments[0]:this.index();
if(this.request.requestType!=='move')return null;
return this.request.active[index];
};_proto.
noMoreSwitchChoices=function noMoreSwitchChoices(){
if(this.request.requestType!=='switch')return false;
for(var i=this.requestLength();i<this.request.side.pokemon.length;i++){
var pokemon=this.request.side.pokemon[i];
if(!pokemon.fainted&&!this.alreadySwitchingIn.includes(i+1)){
return false;
}
}
return true;
};_proto.

addChoice=function addChoice(choiceString){
var choice;
try{
choice=this.parseChoice(choiceString);
}catch(err){
return err.message;
}
if(!choice){
return"You do not need to manually choose to pass; the client handles it for you automatically";
}

var isLastChoice=this.choices.length+1>=this.requestLength();
if(choice.choiceType==='move'){var _this$currentMoveRequ;
if(!choice.targetLoc&&this.request.targetable){var _this$currentMove;
var choosableTargets=['normal','any','adjacentAlly','adjacentAllyOrSelf','adjacentFoe'];
if(choosableTargets.includes((_this$currentMove=this.currentMove(choice))==null?void 0:_this$currentMove.target)){
this.current=choice;
return null;
}
}
if((_this$currentMoveRequ=this.currentMoveRequest())!=null&&_this$currentMoveRequ.maybeDisabled&&isLastChoice){
this.noCancel=true;
}
if(choice.mega||choice.megax||choice.megay)this.alreadyMega=true;
if(choice.z)this.alreadyZ=true;
if(choice.max)this.alreadyMax=true;
if(choice.tera)this.alreadyTera=true;
this.current={
choiceType:'move',
move:0,
targetLoc:0,
mega:false,
megax:false,
megay:false,
ultra:false,
z:false,
max:false,
tera:false
};
}else if(choice.choiceType==='switch'||choice.choiceType==='team'){var _this$currentMoveRequ2,_this$currentMoveRequ3;
if((_this$currentMoveRequ2=this.currentMoveRequest())!=null&&_this$currentMoveRequ2.trapped){
return"You are trapped and cannot switch out";
}
if(this.alreadySwitchingIn.includes(choice.targetPokemon)){
if(choice.choiceType==='switch'){
return"You've already chosen to switch that Pokémon in";
}

for(var i=0;i<this.alreadySwitchingIn.length;i++){
if(this.alreadySwitchingIn[i]===choice.targetPokemon){
this.alreadySwitchingIn.splice(i,1);
this.choices.splice(i,1);
return null;
}
}
return"Unexpected bug, please report this";
}
if((_this$currentMoveRequ3=this.currentMoveRequest())!=null&&_this$currentMoveRequ3.maybeTrapped&&isLastChoice){
this.noCancel=true;
}
this.alreadySwitchingIn.push(choice.targetPokemon);
}else if(choice.choiceType==='testfight'){
if(isLastChoice){
this.noCancel=true;
}
}else if(choice.choiceType==='shift'){
if(this.index()===1){
return"Only Pokémon not already in the center can shift to the center";
}
}
this.choices.push(this.stringChoice(choice));
this.fillPasses();
return null;
};_proto.






fillPasses=function fillPasses(){
var request=this.request;
switch(request.requestType){
case'move':
while(this.choices.length<request.active.length&&!request.active[this.choices.length]){
this.choices.push('pass');
}
break;
case'switch':
var noMoreSwitchChoices=this.noMoreSwitchChoices();
while(this.choices.length<request.forceSwitch.length){
if(!request.forceSwitch[this.choices.length]||noMoreSwitchChoices){
this.choices.push('pass');
}else{
break;
}
}
}
};_proto.

currentMove=function currentMove(){var _this$currentMoveList;var choice=arguments.length>0&&arguments[0]!==undefined?arguments[0]:this.current;var index=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.index();
var moveIndex=choice.move-1;
return((_this$currentMoveList=this.currentMoveList(index,choice))==null?void 0:_this$currentMoveList[moveIndex])||null;
};_proto.

currentMoveList=function currentMoveList()

{var index=arguments.length>0&&arguments[0]!==undefined?arguments[0]:this.index();var current=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.current;
var moveRequest=this.currentMoveRequest(index);
if(!moveRequest)return null;
if(current.max||moveRequest.maxMoves&&!moveRequest.canDynamax){
return moveRequest.maxMoves||null;
}
if(current.z){
return moveRequest.zMoves||null;
}
return moveRequest.moves;
};_proto.



parseChoice=function parseChoice(choice){var index=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.choices.length;
var request=this.request;
if(request.requestType==='wait')throw new Error("It's not your turn to choose anything");

if(choice==='shift'||choice==='testfight'){
if(request.requestType!=='move'){
throw new Error("You must switch in a Pok\xE9mon, not move.");
}
return{choiceType:choice};
}

if(choice.startsWith('move ')){
if(request.requestType!=='move'){
throw new Error("You must switch in a Pok\xE9mon, not move.");
}
var moveRequest=request.active[index];
choice=choice.slice(5);
var current={
choiceType:'move',
move:0,
targetLoc:0,
mega:false,
megax:false,
megay:false,
ultra:false,
z:false,
max:false,
tera:false
};
while(true){




if(/\s(?:-|\+)?[1-3]$/.test(choice)&&toID(choice)!=='conversion2'){
if(current.targetLoc)throw new Error("Move choice has multiple targets");
current.targetLoc=parseInt(choice.slice(-2),10);
choice=choice.slice(0,-2).trim();
}else if(choice.endsWith(' mega')){
current.mega=true;
choice=choice.slice(0,-5);
}else if(choice.endsWith(' megax')){
current.megax=true;
choice=choice.slice(0,-6);
}else if(choice.endsWith(' megay')){
current.megay=true;
choice=choice.slice(0,-6);
}else if(choice.endsWith(' zmove')){
current.z=true;
choice=choice.slice(0,-6);
}else if(choice.endsWith(' ultra')){
current.ultra=true;
choice=choice.slice(0,-6);
}else if(choice.endsWith(' dynamax')){
current.max=true;
choice=choice.slice(0,-8);
}else if(choice.endsWith(' max')){
current.max=true;
choice=choice.slice(0,-4);
}else if(choice.endsWith(' terastallize')){
current.tera=true;
choice=choice.slice(0,-13);
}else if(choice.endsWith(' terastal')){
current.tera=true;
choice=choice.slice(0,-9);
}else{
break;
}
}

if(/^[0-9]+$/.test(choice)){

current.move=parseInt(choice,10);
}else{


var moveid=toID(choice);
if(moveid.startsWith('hiddenpower'))moveid='hiddenpower';

for(var i=0;i<moveRequest.moves.length;i++){
if(moveid===moveRequest.moves[i].id){
current.move=i+1;
if(moveRequest.moves[i].disabled){
throw new Error("Move \""+moveRequest.moves[i].name+"\" is disabled");
}
break;
}
}
if(!current.move&&moveRequest.zMoves){
for(var _i3=0;_i3<moveRequest.zMoves.length;_i3++){
if(!moveRequest.zMoves[_i3])continue;
if(moveid===moveRequest.zMoves[_i3].id){
current.move=_i3+1;
current.z=true;
break;
}
}
}
if(!current.move&&moveRequest.maxMoves){
for(var _i4=0;_i4<moveRequest.maxMoves.length;_i4++){
if(moveid===moveRequest.maxMoves[_i4].id){
if(moveRequest.maxMoves[_i4].disabled){
throw new Error("Move \""+moveRequest.maxMoves[_i4].name+"\" is disabled");
}
current.move=_i4+1;
current.max=true;
break;
}
}
}
}
if(current.max&&!moveRequest.canDynamax)current.max=false;
var move=this.currentMove(current,index);
if(!move||move.disabled){var _move$name;
throw new Error("Move "+((_move$name=move==null?void 0:move.name)!=null?_move$name:current.move)+" is disabled");
}
return current;
}

if(choice.startsWith('switch ')||choice.startsWith('team ')){var _this$request$side;
choice=choice.slice(choice.startsWith('team ')?5:7);
var isTeamPreview=request.requestType==='team';
var _current={
choiceType:isTeamPreview?'team':'switch',
targetPokemon:0
};
if(/^[0-9]+$/.test(choice)){

_current.targetPokemon=parseInt(choice,10);
}else{

var lowerChoice=choice.toLowerCase();
var choiceid=toID(choice);
var matchLevel=0;
var match=0;
for(var _i5=0;_i5<request.side.pokemon.length;_i5++){
var serverPokemon=request.side.pokemon[_i5];
var curMatchLevel=0;
if(choice===serverPokemon.name){
curMatchLevel=10;
}else if(lowerChoice===serverPokemon.name.toLowerCase()){
curMatchLevel=9;
}else if(choiceid===toID(serverPokemon.name)){
curMatchLevel=8;
}else if(choiceid===toID(serverPokemon.speciesForme)){
curMatchLevel=7;
}else if(choiceid===toID(Dex.species.get(serverPokemon.speciesForme).baseSpecies)){
curMatchLevel=6;
}
if(curMatchLevel>matchLevel){
match=_i5+1;
matchLevel=curMatchLevel;
}
}
if(!match){
throw new Error("Couldn't find Pok\xE9mon \""+choice+"\" to switch to");
}
_current.targetPokemon=match;
}
if(!isTeamPreview&&_current.targetPokemon-1<this.requestLength()){
throw new Error("That Pok\xE9mon is already in battle!");
}
var target=request.side.pokemon[_current.targetPokemon-1];
var isReviving=(_this$request$side=this.request.side)==null?void 0:_this$request$side.pokemon.some(function(p){return p.reviving;});
if(!target){
throw new Error("Couldn't find Pok\xE9mon \""+choice+"\" to switch to!");
}
if(isReviving&&target.fainted)return _current;
if(isReviving&&!target.fainted){
throw new Error(target.name+" still has energy to battle!");
}
if(target.fainted){
throw new Error(target.name+" is fainted and cannot battle!");
}
return _current;
}

if(choice==='pass')return null;

throw new Error("Unrecognized choice \""+choice+"\"");
};_proto.




stringChoice=function stringChoice(choice){
if(!choice)return"pass";
switch(choice.choiceType){
case'move':
var target=choice.targetLoc?" "+(choice.targetLoc>0?'+':'')+choice.targetLoc:"";
return"move "+choice.move+this.moveSpecial(choice)+target;
case'switch':
case'team':
return choice.choiceType+" "+choice.targetPokemon;
case'shift':
case'testfight':
return choice.choiceType;
}
};_proto.
moveSpecial=function moveSpecial(choice){
return(choice.max?' max':'')+(
choice.mega?' mega':'')+(
choice.megax?' megax':'')+(
choice.megay?' megay':'')+(
choice.ultra?' ultra':'')+(
choice.z?' zmove':'')+(
choice.tera?' terastallize':'');
};BattleChoiceBuilder.












fixRequest=function fixRequest(request,battle){
if(!request.requestType){
request.requestType='move';
if(request.forceSwitch){
request.requestType='switch';
}else if(request.teamPreview){
request.requestType='team';
}else if(request.wait){
request.requestType='wait';
}
}

if(request.requestType==='wait')request.noCancel=true;
if(request.side){for(var _i7=0,_request$side$pokemon2=
request.side.pokemon;_i7<_request$side$pokemon2.length;_i7++){var serverPokemon=_request$side$pokemon2[_i7];
battle.parseDetails(serverPokemon.ident.substr(4),serverPokemon.ident,serverPokemon.details,serverPokemon);
battle.parseHealth(serverPokemon.condition,serverPokemon);
}
}
if(request.requestType==='team'&&!request.chosenTeamSize){
request.chosenTeamSize=1;
if(battle.gameType==='doubles'){
request.chosenTeamSize=2;
}
if(battle.gameType==='triples'||battle.gameType==='rotation'){
request.chosenTeamSize=3;
}for(var _i9=0,_request$side$pokemon4=

request.side.pokemon;_i9<_request$side$pokemon4.length;_i9++){var switchable=_request$side$pokemon4[_i9];
if(toID(switchable.baseAbility)==='illusion'||toID(switchable.baseAbility2)==='illusion'){
request.chosenTeamSize=request.side.pokemon.length;
}
}
if(request.maxChosenTeamSize){
request.chosenTeamSize=request.maxChosenTeamSize;
}
if(battle.teamPreviewCount){
var chosenTeamSize=battle.teamPreviewCount;
if(chosenTeamSize>0&&chosenTeamSize<=request.side.pokemon.length){
request.chosenTeamSize=chosenTeamSize;
}
}
}
request.targetable||(request.targetable=battle.mySide.active.length>1);

if(request.active){
request.active=request.active.map(
function(active,i){return request.side.pokemon[i].fainted?null:active;}
);for(var _i11=0,_request$active2=
request.active;_i11<_request$active2.length;_i11++){var active=_request$active2[_i11];
if(!active)continue;for(var _i13=0,_active$moves2=
active.moves;_i13<_active$moves2.length;_i13++){var move=_active$moves2[_i13];
if(move.move)move.name=move.move;
move.id=toID(move.name);
}
if(active.maxMoves){
if(active.maxMoves.maxMoves){
active.gigantamax=active.maxMoves.gigantamax;
active.maxMoves=active.maxMoves.maxMoves;
}for(var _i15=0,_active$maxMoves2=
active.maxMoves;_i15<_active$maxMoves2.length;_i15++){var _move=_active$maxMoves2[_i15];
if(_move.move)_move.name=Dex.moves.get(_move.move).name;
_move.id=toID(_move.name);
}
}
if(active.canZMove){
active.zMoves=active.canZMove;for(var _i17=0,_active$zMoves2=
active.zMoves;_i17<_active$zMoves2.length;_i17++){var _move2=_active$zMoves2[_i17];
if(!_move2)continue;
if(_move2.move)_move2.name=_move2.move;
_move2.id=toID(_move2.name);
}
}
}
}
};return BattleChoiceBuilder;}();
//# sourceMappingURL=battle-choices.js.map