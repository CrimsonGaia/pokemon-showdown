"use strict";function _inheritsLoose(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,_setPrototypeOf(t,o);}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t;},_setPrototypeOf(t,e);}/**
 * Search Results
 *
 * Code for displaying sesrch results from battle-dex-search.ts
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license AGPLv3
 */var






PSSearchResults=function(_preact$Component){function PSSearchResults(){var _this;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this=_preact$Component.call.apply(_preact$Component,[this].concat(args))||this;_this.






URL_ROOT="//"+Config.routes.dex+"/";_this.
speciesId='';_this.
itemId='';_this.
abilityId='';_this.
moveIds=[];_this.
resultIndex=-1;_this.

















































































































































































































































































































































































































handleClick=function(ev){
var search=_this.props.search;
var target=ev.target;
while(target&&target.className!=='dexlist'){
if(target.tagName==='A'){
var entry=target.getAttribute('data-entry');
if(entry){
var _entry$split=entry.split('|'),type=_entry$split[0],name=_entry$split[1],slot=_entry$split[2];
if(search.addFilter([type,name])){
if(_this.props.onSelect){
_this.props.onSelect==null||_this.props.onSelect('','');
}else if(search.query){
search.find('');
_this.forceUpdate();
}
}else{
_this.props.onSelect==null||_this.props.onSelect(type,name,slot);
}
ev.preventDefault();
ev.stopImmediatePropagation();
break;
}
}
if(target.tagName==='BUTTON'){
var filter=target.getAttribute('data-filter');
if(filter){
search.removeFilter(filter.split(':'));
search.find('');
ev.preventDefault();
ev.stopPropagation();
_this.props.onSelect==null||_this.props.onSelect(null,'');
break;
}


var sort=target.getAttribute('data-sort');
if(sort){
search.toggleSort(sort);
search.find('');
ev.preventDefault();
ev.stopPropagation();
_this.props.onSelect==null||_this.props.onSelect(null,'');
break;
}
}

target=target.parentElement;
}
};return _this;}_inheritsLoose(PSSearchResults,_preact$Component);var _proto=PSSearchResults.prototype;_proto.renderPokemonSortRow=function renderPokemonSortRow(){var search=this.props.search;var sortCol=search.sortCol;return preact.h("li",{"class":"result"},preact.h("div",{"class":"sortrow"},preact.h("button",{"class":"sortcol numsortcol"+(!sortCol?' cur':'')},!sortCol?'Sort: ':search.firstPokemonColumn),preact.h("button",{"class":"sortcol pnamesortcol"+(sortCol==='name'?' cur':''),"data-sort":"name"},"Name"),preact.h("button",{"class":"sortcol typesortcol"+(sortCol==='type'?' cur':''),"data-sort":"type"},"Types"),preact.h("button",{"class":"sortcol abilitysortcol"+(sortCol==='ability'?' cur':''),"data-sort":"ability"},"Abilities"),preact.h("button",{"class":"sortcol statsortcol"+(sortCol==='hp'?' cur':''),"data-sort":"hp"},"HP"),preact.h("button",{"class":"sortcol statsortcol"+(sortCol==='atk'?' cur':''),"data-sort":"atk"},"Atk"),preact.h("button",{"class":"sortcol statsortcol"+(sortCol==='def'?' cur':''),"data-sort":"def"},"Def"),preact.h("button",{"class":"sortcol statsortcol"+(sortCol==='spa'?' cur':''),"data-sort":"spa"},"SpA"),preact.h("button",{"class":"sortcol statsortcol"+(sortCol==='spd'?' cur':''),"data-sort":"spd"},"SpD"),preact.h("button",{"class":"sortcol statsortcol"+(sortCol==='spe'?' cur':''),"data-sort":"spe"},"Spe"),preact.h("button",{"class":"sortcol statsortcol"+(sortCol==='bst'?' cur':''),"data-sort":"bst"},"BST")));};_proto.renderMoveSortRow=function renderMoveSortRow(){var sortCol=this.props.search.sortCol;return preact.h("li",{"class":"result"},preact.h("div",{"class":"sortrow"},preact.h("button",{"class":"sortcol movenamesortcol"+(sortCol==='name'?' cur':''),"data-sort":"name"},"Name"),preact.h("button",{"class":"sortcol movetypesortcol"+(sortCol==='type'?' cur':''),"data-sort":"type"},"Type"),preact.h("button",{"class":"sortcol movetypesortcol"+(sortCol==='category'?' cur':''),"data-sort":"category"},"Cat"),preact.h("button",{"class":"sortcol powersortcol"+(sortCol==='power'?' cur':''),"data-sort":"power"},"Pow"),preact.h("button",{"class":"sortcol accuracysortcol"+(sortCol==='accuracy'?' cur':''),"data-sort":"accuracy"},"Acc"),preact.h("button",{"class":"sortcol ppsortcol"+(sortCol==='pp'?' cur':''),"data-sort":"pp"},"PP")));};_proto.renderPokemonRow=function renderPokemonRow(id,matchStart,matchEnd,errorMessage){var search=this.props.search;var pokemon=search.dex.species.get(id);if(!pokemon)return preact.h("li",{"class":"result"},"Unrecognized pokemon");var tagStart=pokemon.forme?pokemon.name.length-pokemon.forme.length-1:0;var stats=pokemon.baseStats;var bst=0;for(var _i2=0,_Object$values2=Object.values(stats);_i2<_Object$values2.length;_i2++){var stat=_Object$values2[_i2];bst+=stat;}if(search.dex.gen<2)bst-=stats['spd'];if(errorMessage){return preact.h("li",{"class":"result"},preact.h("a",{href:this.URL_ROOT+"pokemon/"+id,"class":id===this.speciesId?'cur':'',"data-target":"push","data-entry":"pokemon|"+pokemon.name},preact.h("span",{"class":"col numcol"},search.getTier(pokemon)),preact.h("span",{"class":"col iconcol"},preact.h("span",{"class":"pixelated",style:Dex.getPokemonIcon(pokemon.id)})),preact.h("span",{"class":"col pokemonnamecol"},this.renderName(pokemon.name,matchStart,matchEnd,tagStart)),errorMessage));}return preact.h("li",{"class":"result"},preact.h("a",{href:this.URL_ROOT+"pokemon/"+id,"class":id===this.speciesId?'cur':'',"data-target":"push","data-entry":"pokemon|"+pokemon.name},preact.h("span",{"class":"col numcol"},search.getTier(pokemon)),preact.h("span",{"class":"col iconcol"},preact.h("span",{"class":"pixelated",style:Dex.getPokemonIcon(pokemon.id)})),preact.h("span",{"class":"col pokemonnamecol"},this.renderName(pokemon.name,matchStart,matchEnd,tagStart)),preact.h("span",{"class":"col typecol"},pokemon.types.map(function(type){return preact.h("img",{src:Dex.resourcePrefix+"sprites/types/"+type+".png",alt:type,height:"14",width:"32","class":"pixelated"});})),search.dex.gen>=3&&(pokemon.abilities['1']?preact.h("span",{"class":"col twoabilitycol"},pokemon.abilities['0'],preact.h("br",null),pokemon.abilities['1']):preact.h("span",{"class":"col abilitycol"},pokemon.abilities['0'])),search.dex.gen>=5&&(pokemon.abilities['S']?preact.h("span",{"class":"col twoabilitycol"+(pokemon.unreleasedHidden?' unreleasedhacol':'')},pokemon.abilities['H']||'',preact.h("br",null),pokemon.abilities['S']):pokemon.abilities['H']?preact.h("span",{"class":"col abilitycol"+(pokemon.unreleasedHidden?' unreleasedhacol':'')},pokemon.abilities['H']):preact.h("span",{"class":"col abilitycol"})),preact.h("span",{"class":"col statcol"},preact.h("em",null,"HP"),preact.h("br",null),stats.hp),preact.h("span",{"class":"col statcol"},preact.h("em",null,"Atk"),preact.h("br",null),stats.atk),preact.h("span",{"class":"col statcol"},preact.h("em",null,"Def"),preact.h("br",null),stats.def),search.dex.gen>2&&preact.h("span",{"class":"col statcol"},preact.h("em",null,"SpA"),preact.h("br",null),stats.spa),search.dex.gen>2&&preact.h("span",{"class":"col statcol"},preact.h("em",null,"SpD"),preact.h("br",null),stats.spd),search.dex.gen<2&&preact.h("span",{"class":"col statcol"},preact.h("em",null,"Spc"),preact.h("br",null),stats.spa),preact.h("span",{"class":"col statcol"},preact.h("em",null,"Spe"),preact.h("br",null),stats.spe),preact.h("span",{"class":"col bstcol"},preact.h("em",null,"BST",preact.h("br",null),bst))));};_proto.renderName=function renderName(name,matchStart,matchEnd,tagStart){if(name==='No Ability')return preact.h("i",null,"(no ability)");if(!matchEnd){if(!tagStart)return name;return[name.slice(0,tagStart),preact.h("small",null,name.slice(tagStart))];}var output=[name.slice(0,matchStart),preact.h("b",null,name.slice(matchStart,matchEnd)),name.slice(matchEnd,tagStart||name.length)];if(!tagStart)return output;if(matchEnd&&matchEnd>tagStart){if(matchStart<tagStart){matchStart=tagStart;}output.push(preact.h("small",null,name.slice(matchEnd)));}else{output.push(preact.h("small",null,name.slice(tagStart)));}return output;};_proto.renderItemRow=function renderItemRow(id,matchStart,matchEnd,errorMessage){var search=this.props.search;var item=search.dex.items.get(id);if(!item)return preact.h("li",{"class":"result"},"Unrecognized item");return preact.h("li",{"class":"result"},preact.h("a",{href:this.URL_ROOT+"items/"+id,"class":id===this.itemId?'cur':'',"data-target":"push","data-entry":"item|"+item.name},preact.h("span",{"class":"col itemiconcol"},preact.h("span",{"class":"pixelated",style:Dex.getItemIcon(item)})),preact.h("span",{"class":"col namecol"},id?this.renderName(item.name,matchStart,matchEnd):preact.h("i",null,"(no item)")),!!id&&errorMessage,!errorMessage&&preact.h("span",{"class":"col itemdesccol"},item.shortDesc)));};_proto.renderAbilityRow=function renderAbilityRow(id,matchStart,matchEnd,errorMessage){var search=this.props.search;var ability=search.dex.abilities.get(id);if(!ability)return preact.h("li",{"class":"result"},"Unrecognized ability");return preact.h("li",{"class":"result"},preact.h("a",{href:this.URL_ROOT+"abilities/"+id,"class":id===this.abilityId?'cur':'',"data-target":"push","data-entry":"ability|"+ability.name},preact.h("span",{"class":"col namecol"},id?this.renderName(ability.name,matchStart,matchEnd):preact.h("i",null,"(no ability)")),errorMessage,!errorMessage&&preact.h("span",{"class":"col abilitydesccol"},ability.shortDesc)));};_proto.renderMoveRow=function renderMoveRow(id,matchStart,matchEnd,errorMessage){var slot=null;if(id.startsWith('_')){var _ref=id.slice(1).split('_');slot=_ref[0];id=_ref[1];if(!id){return preact.h("li",{"class":"result"},preact.h("a",{href:this.URL_ROOT+"moves/","class":"cur","data-target":"push","data-entry":"move||"+slot},preact.h("span",{"class":"col movenamecol"},preact.h("i",null,"(slot ",slot," empty)"))));}}var search=this.props.search;var move=search.dex.moves.get(id);var entry=slot?"move|"+move.name+"|"+slot:"move|"+move.name;if(!move)return preact.h("li",{"class":"result"},"Unrecognized move");var tagStart=move.name.startsWith('Hidden Power')?12:0;if(errorMessage){return preact.h("li",{"class":"result"},preact.h("a",{href:this.URL_ROOT+"moves/"+id,"class":this.moveIds.includes(id)?'cur':'',"data-target":"push","data-entry":entry},preact.h("span",{"class":"col movenamecol"},this.renderName(move.name,matchStart,matchEnd,tagStart)),errorMessage));}var pp=move.pp===1||move.noPPBoosts?move.pp:move.pp*8/5;if(search.dex.gen<3)pp=Math.min(61,pp);return preact.h("li",{"class":"result"},preact.h("a",{href:this.URL_ROOT+"moves/"+id,"class":this.moveIds.includes(id)?'cur':'',"data-target":"push","data-entry":entry},preact.h("span",{"class":"col movenamecol"},this.renderName(move.name,matchStart,matchEnd,tagStart)),preact.h("span",{"class":"col typecol"},preact.h("img",{src:Dex.resourcePrefix+"sprites/types/"+encodeURIComponent(move.type)+".png",alt:move.type,height:"14",width:"32","class":"pixelated"}),preact.h("img",{src:Dex.resourcePrefix+"sprites/categories/"+move.category+".png",alt:move.category,height:"14",width:"32","class":"pixelated"})),preact.h("span",{"class":"col labelcol"},move.category!=='Status'?[preact.h("em",null,"Power"),preact.h("br",null),move.basePower||"\u2014"]:''),preact.h("span",{"class":"col widelabelcol"},preact.h("em",null,"Accuracy"),preact.h("br",null),move.accuracy&&move.accuracy!==true?move.accuracy+"%":"\u2014"),preact.h("span",{"class":"col pplabelcol"},preact.h("em",null,"PP"),preact.h("br",null),pp),preact.h("span",{"class":"col movedesccol"},move.shortDesc)));};_proto.renderTypeRow=function renderTypeRow(id,matchStart,matchEnd,errorMessage){var name=id.charAt(0).toUpperCase()+id.slice(1);return preact.h("li",{"class":"result"},preact.h("a",{href:this.URL_ROOT+"types/"+id,"data-target":"push","data-entry":"type|"+name},preact.h("span",{"class":"col namecol"},this.renderName(name,matchStart,matchEnd)),preact.h("span",{"class":"col typecol"},preact.h("img",{src:Dex.resourcePrefix+"sprites/types/"+encodeURIComponent(name)+".png",alt:name,height:"14",width:"32","class":"pixelated"})),errorMessage));};_proto.renderCategoryRow=function renderCategoryRow(id,matchStart,matchEnd,errorMessage){var name=id.charAt(0).toUpperCase()+id.slice(1);return preact.h("li",{"class":"result"},preact.h("a",{href:this.URL_ROOT+"categories/"+id,"data-target":"push","data-entry":"category|"+name},preact.h("span",{"class":"col namecol"},this.renderName(name,matchStart,matchEnd)),preact.h("span",{"class":"col typecol"},preact.h("img",{src:Dex.resourcePrefix+"sprites/categories/"+name+".png",alt:name,height:"14",width:"32","class":"pixelated"})),errorMessage));};_proto.renderArticleRow=function renderArticleRow(id,matchStart,matchEnd,errorMessage){var _window$BattleArticle;var isSearchType=id==='pokemon'||id==='moves';var name=((_window$BattleArticle=window.BattleArticleTitles)==null?void 0:_window$BattleArticle[id])||id.charAt(0).toUpperCase()+id.substr(1);return preact.h("li",{"class":"result"},preact.h("a",{href:this.URL_ROOT+"articles/"+id,"data-target":"push","data-entry":"article|"+name},preact.h("span",{"class":"col namecol"},this.renderName(name,matchStart,matchEnd)),preact.h("span",{"class":"col movedesccol"},isSearchType?"(search type)":"(article)"),errorMessage));};_proto.renderEggGroupRow=function renderEggGroupRow(id,matchStart,matchEnd,errorMessage){var name;if(id==='humanlike')name='Human-Like';else if(id==='water1')name='Water 1';else if(id==='water2')name='Water 2';else if(id==='water3')name='Water 3';if(name){if(matchEnd>5)matchEnd++;}else{name=id.charAt(0).toUpperCase()+id.slice(1);}return preact.h("li",{"class":"result"},preact.h("a",{href:this.URL_ROOT+"egggroups/"+id,"data-target":"push","data-entry":"egggroup|"+name},preact.h("span",{"class":"col namecol"},this.renderName(name,matchStart,matchEnd)),preact.h("span",{"class":"col movedesccol"},"(egg group)"),errorMessage));};_proto.renderTierRow=function renderTierRow(id,matchStart,matchEnd,errorMessage){var tierTable={uber:"Uber",caplc:"CAP LC",capnfe:"CAP NFE"};var name=tierTable[id]||id.toUpperCase();return preact.h("li",{"class":"result"},preact.h("a",{href:this.URL_ROOT+"tiers/"+id,"data-target":"push","data-entry":"tier|"+name},preact.h("span",{"class":"col namecol"},this.renderName(name,matchStart,matchEnd)),preact.h("span",{"class":"col movedesccol"},"(tier)"),errorMessage));};_proto.renderRow=function renderRow(row){var search=this.props.search;var type=row[0],id=row[1];var matchStart=0;var matchEnd=0;if(row.length>3){matchStart=row[2];matchEnd=row[3];}var errorMessage=null;var label;if(label=search.filterLabel(type)){errorMessage=preact.h("span",{"class":"col filtercol"},preact.h("em",null,label));}else if(label=search.illegalLabel(id)){errorMessage=preact.h("span",{"class":"col illegalcol"},preact.h("em",null,label));}switch(type){case'html':var sanitizedHTML=id.replace(/</g,'&lt;').replace(/&lt;em>/g,'<em>').replace(/&lt;\/em>/g,'</em>').replace(/&lt;strong>/g,'<strong>').replace(/&lt;\/strong>/g,'</strong>');return preact.h("li",{"class":"result"},preact.h("p",{dangerouslySetInnerHTML:{__html:sanitizedHTML}}));case'header':return preact.h("li",{"class":"result"},preact.h("h3",null,id));case'sortpokemon':return this.renderPokemonSortRow();case'sortmove':return this.renderMoveSortRow();case'pokemon':return this.renderPokemonRow(id,matchStart,matchEnd,errorMessage);case'move':return this.renderMoveRow(id,matchStart,matchEnd,errorMessage);case'item':return this.renderItemRow(id,matchStart,matchEnd,errorMessage);case'ability':return this.renderAbilityRow(id,matchStart,matchEnd,errorMessage);case'type':return this.renderTypeRow(id,matchStart,matchEnd,errorMessage);case'egggroup':return this.renderEggGroupRow(id,matchStart,matchEnd,errorMessage);case'tier':return this.renderTierRow(id,matchStart,matchEnd,errorMessage);case'category':return this.renderCategoryRow(id,matchStart,matchEnd,errorMessage);case'article':return this.renderArticleRow(id,matchStart,matchEnd,errorMessage);}return preact.h("li",null,"Error: not found");};PSSearchResults.renderFilters=function renderFilters(search,showHints){return search.filters&&preact.h("li",{"class":"dexlist-filters"},showHints&&"Filters: ",search.filters.map(function(_ref2){var type=_ref2[0],name=_ref2[1];return preact.h("button",{"class":"filter","data-filter":type+":"+name},name," ",preact.h("i",{"class":"fa fa-times-circle","aria-hidden":true}));}),!search.query&&showHints&&preact.h("small",{style:"color: #888"},"(backspace = delete filter)"));};_proto.

componentDidUpdate=function componentDidUpdate(){
if(this.props.resultIndex!==undefined){var _children,_children2;
(_children=this.base.children[this.resultIndex+1])==null||(_children=_children.children[0])==null||_children.classList.remove('hover');
this.resultIndex=this.props.resultIndex;
(_children2=this.base.children[this.resultIndex+1])==null||(_children2=_children2.children[0])==null||_children2.classList.add('hover');
}
};_proto.
componentDidMount=function componentDidMount(){
this.componentDidUpdate();
};_proto.
render=function render(){var _search$typedSearch,_results,_search$results,_results2,_this2=this;
var search=this.props.search;

var set=(_search$typedSearch=search.typedSearch)==null?void 0:_search$typedSearch.set;
if(set){
this.speciesId=toID(set.species);
this.itemId=toID(set.item);
this.abilityId=toID(set.ability);
this.moveIds=set.moves.map(toID);
}

var results=search.results;
if(this.props.windowing)results=((_results=results)==null?void 0:_results.slice(0,this.props.windowing))||null;

return preact.h("ul",{
"class":"dexlist",style:"min-height: "+(1+(((_search$results=search.results)==null?void 0:_search$results.length)||1))*33+"px;",onClick:this.handleClick},

!this.props.hideFilters&&PSSearchResults.renderFilters(search,true)||preact.h("li",null),(_results2=
results)==null?void 0:_results2.map(function(result){return _this2.renderRow(result);})
);
};return PSSearchResults;}(preact.Component);
//# sourceMappingURL=battle-searchresults.js.map