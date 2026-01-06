/**
 * Search
 *
 * Basically just an improved version of utilichart
 *
 * Dependencies: jQuery, battledata, search-index
 * Optional dependencies: pokedex, moves, items, abilities
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 */

(function (exports, $) {
	'use strict';

	function Search(elem, viewport) {
		this.$el = $(elem);
		this.el = this.$el[0];
		this.$viewport = (viewport ? $(viewport) : $(window));

		this.urlRoot = '';
		this.q = undefined; // uninitialized
		this.exactMatch = false;

		this.resultSet = null;
		this.filters = null;
		this.sortCol = null;
		this.renderedIndex = 0;
		this.renderingDone = true;
		this.externalFilter = false;
		this.cur = {};
		this.$inputEl = null;
		this.gen = 9;
		this.mod = null;

		this.engine = new DexSearch();
		window.search = this;

		var self = this;
		this.$el.on('click', '.more button', function (e) {
			e.preventDefault();
			self.updateScroll(true);
		});
		this.$el.on('click', '.filter', function (e) {
			e.preventDefault();
			self.removeFilter(e);
			if (self.$inputEl) self.$inputEl.focus();
		});
		this.$el.on('click', '.itemclasscol[data-tag], .itemconsumecol[data-tag]', function (e) {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
			var tag = e.currentTarget.dataset.tag;
			self.engine.addFilter(['itemclass', tag]);
			self.filters = self.engine.filters;
			self.find('');
			if (self.$inputEl) self.$inputEl.focus();
			return false;
		});
		this.$el.on('click', '.sortcol', function (e) {
			e.preventDefault();
			e.stopPropagation();
			var sortCol = e.currentTarget.dataset.sort;
			self.engine.toggleSort(sortCol);
			self.sortCol = self.engine.sortCol;
			self.find('');
		});
		this.$el.on('change', '#flag-icons-toggle', function (e) {
			console.log('[FLAG CHECKBOX] change event fired');
			var checked = e.currentTarget.checked;
			console.log('[FLAG CHECKBOX] checked:', checked);
			Storage.prefs('flagicons', checked);
			console.log('[FLAG CHECKBOX] preference saved, refreshing...');
			// Force a complete re-render by clearing the rendered state and re-rendering
			self.renderedIndex = 0;
			self.renderingDone = false;
			self.updateScroll();
		});
		this.$el.on('click', '#flag-icons-toggle', function (e) {
			console.log('[FLAG CHECKBOX] click event fired');
		});
		this.$el.on('change', '#category-display-toggle', function (e) {
			var value = e.currentTarget.value;
			Storage.prefs('categorydisplay', value);
			self.renderedIndex = 0;
			self.renderingDone = false;
			self.updateScroll();
		});
		this.$el.on('change', '#flag-tint-toggle', function (e) {
			var value = e.currentTarget.value;
			Storage.prefs('flagtint', value);
			self.renderedIndex = 0;
			self.renderingDone = false;
			self.updateScroll();
		});
	}

	Search.prototype.$ = function (query) {
		return this.$el.find(query);
	};

	// Helper function to render category based on user preference
	Search.prototype.getCategoryDisplay = function (category) {
		var displayMode = Dex.prefs('categorydisplay') || 'icons';
		var icon = Dex.getCategoryIcon(category);
		var text = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';
		
		// Color mapping for categories
		var categoryColors = {
			'Physical': '#F08030',
			'Special': '#4DB8A8',
			'Status': '#A8A878'
		};
		var color = categoryColors[text] || '#000';
		
		if (displayMode === 'text') {
			return '<span style="font-size: 10px; font-weight: bold; color: ' + color + ';">' + text + '</span>';
		} else if (displayMode === 'both') {
			// Remove the hidden span from the icon and show text below
			var iconOnly = icon.replace(/<span[^>]*>.*?<\/span>/g, '');
			return '<div style="display: inline-block; text-align: center;">' + iconOnly + '<div style="font-size: 8px; font-weight: bold; line-height: 1; margin-top: -1px; color: ' + color + ';">' + text + '</div></div>';
		} else {
			// icons (default)
			return icon;
		}
	};

	// Helper function to get CSS filter for category-based flag tinting
	Search.prototype.getCategoryFlagFilter = function (category) {
		var cat = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';
		switch (cat) {
			case 'Physical':
				// Orange tint for physical moves
				return 'sepia(100%) saturate(300%) hue-rotate(-10deg) brightness(0.9)';
			case 'Special':
				// Greenish tint for special moves with deeper coloration
				return 'sepia(100%) saturate(345%) hue-rotate(85deg) brightness(1.0)';
			case 'Status':
				// Olive/gray tint for status moves
				return 'sepia(100%) saturate(50%) hue-rotate(30deg) brightness(0.85)';
			default:
				return 'none';
		}
	};

	// Helper function to calculate crit chance based on crit ratio
	Search.prototype.getCritChance = function (critRatio) {
		// Gen 6+ crit system: 1/24, 1/8, 1/2, always
		// critRatio 0 = stage 0, critRatio 1 = stage 1, etc.
		var stage = Math.max(0, critRatio || 1);
		if (stage >= 3) return 'Always';
		var chances = [24, 8, 2]; // denominators for stages 0, 1, 2
		if (stage < chances.length) {
			return '1/' + chances[stage];
		}
		return 'Always';
	};

	// Helper function to get text color for category-based flag tinting
	Search.prototype.getCategoryTextColor = function (category) {
		var cat = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';
		switch (cat) {
			case 'Physical':
				return '#F08030';
			case 'Special':
				return '#4DB8A8';
			case 'Status':
				return '#A8A878';
			default:
				return '#000';
		}
	};

	//
	// Search functions
	//

	Search.prototype.find = function (query, firstElem) {
		if (!this.engine.find(query)) return; // nothing changed

		this.exactMatch = this.engine.exactMatch;
		this.q = this.engine.query;
		this.resultSet = this.engine.results;
		if (firstElem) {
			this.resultSet = [[this.engine.typedSearch.searchType, firstElem]].concat(this.resultSet);
			if (this.resultSet.length > 1 && ['sortpokemon', 'sortmove'].includes(this.resultSet[1][0])) {
				var sortRow = this.resultSet[1];
				this.resultSet[1] = this.resultSet[0];
				this.resultSet[0] = sortRow;
			}
		}
		if (this.filters) {
			this.resultSet = [['html', this.getFilterText()]].concat(this.resultSet);
		}

		this.renderedIndex = 0;
		this.renderingDone = false;
		this.updateScroll();
		return true;
	};
	Search.prototype.addFilter = function (node) {
		if (!node.dataset.entry) return false;
		var entry = node.dataset.entry.split('|');
		var result = this.engine.addFilter(entry);
		this.filters = this.engine.filters;
		return result;
	};
	Search.prototype.removeFilter = function (e) {
		var result;
		if (e) {
			result = this.engine.removeFilter(e.currentTarget.value.split(':'));
		} else {
			result = this.engine.removeFilter();
		}
		this.filters = this.engine.filters;
		this.find('');
		return result;
	};
	Search.prototype.getFilterText = function (q) {
		var buf = '<p>Filters: ';
		for (var i = 0; i < this.filters.length; i++) {
			var text = this.filters[i][1];
			if (this.filters[i][0] === 'move') text = Dex.moves.get(text).name;
			if (this.filters[i][0] === 'pokemon') text = Dex.species.get(text).name;
			if (this.filters[i][0] === 'itemclass') text = this.filters[i][1]; // Already capitalized
			buf += '<button class="filter" value="' + BattleLog.escapeHTML(this.filters[i].join(':')) + '">' + text + ' <i class="fa fa-times-circle"></i></button> ';
		}
		if (!q) buf += '<small style="color: #888">(backspace = delete filter)</small>';
		return buf + '</p>';
	};
	Search.prototype.updateScroll = function (forceAdd) {
		if (this.renderingDone) return;
		var top = this.$viewport.scrollTop();
		var bottom = top + this.$viewport.height();
		var windowHeight = $(window).height();
		var i = this.renderedIndex;
		var finalIndex = Math.floor(bottom / 33) + 1;
		if (!forceAdd && finalIndex <= i) return;
		if (finalIndex < i + 20) finalIndex = i + 20;
		if (bottom - top > windowHeight && !i) finalIndex = 20;
		if (forceAdd && finalIndex > i + 40) finalIndex = i + 40;

		var resultSet = this.resultSet;
		var buf = '';
		while (i < finalIndex) {
			if (!resultSet[i]) {
				this.renderingDone = true;
				break;
			}
			var row = resultSet[i];

			var errorMessage = '';
			var label;
			if ((label = this.engine.filterLabel(row[0]))) {
				errorMessage = '<span class="col filtercol"><em>' + label + '</em></span>';
			} else if ((label = this.engine.illegalLabel(row[1]))) {
				errorMessage = '<span class="col illegalcol"><em>' + label + '</em></span>';
			}

			var mStart = 0;
			var mEnd = 0;
			if (row.length > 3) {
				mStart = row[2];
				mEnd = row[3];
			}
			buf += this.renderRow(row[1], row[0], mStart, mEnd, errorMessage, row[1] in this.cur ? ' class="cur"' : '');

			i++;
		}
		if (!this.renderedIndex) {
			this.el.innerHTML = '<ul class="utilichart" style="height:' + (resultSet.length * 33) + 'px">' + buf + (!this.renderingDone ? '<li class="result more"><p><button class="button big">More</button></p></li>' : '') + '</ul>';
			this.moreVisible = true;
		} else {
			if (this.moreVisible) {
				this.$el.find('.more').remove();
				if (!forceAdd) this.moreVisible = false;
			}
			$(this.el.firstChild).append(buf + (forceAdd && !this.renderingDone ? '<li class="result more"><p><button class="button big">More</button></p></li>' : ''));
		}
		this.renderedIndex = i;
	};
	Search.prototype.setType = function (qType, format, set, cur) {
		this.engine.setType(qType, format, set);
		this.filters = this.engine.filters;
		this.sortCol = this.engine.sortCol;
		this.cur = cur || {};
		var firstElem;
		for (var id in cur) {
			firstElem = id;
			break;
		}
		this.find('', firstElem);
	};

	/*********************************************************
	 * Rendering functions
	 *********************************************************/

	// These all have static versions

	Search.prototype.renderRow = function (id, type, matchStart, matchLength, errorMessage, attrs) {
		// errorMessage = '<span class="col illegalcol"><em>' + errorMessage + '</em></span>';
		switch (type) {
		case 'html':
			return '<li class="result">' + id + '</li>';
		case 'header':
			return '<li class="result"><h3>' + id + '</h3></li>';
		case 'sortpokemon':
			return this.renderPokemonSortRow();
		case 'sortmove':
			return this.renderMoveSortRow();
		case 'pokemon':
			var pokemon = this.engine.dex.species.get(id);
			return this.renderPokemonRow(pokemon, matchStart, matchLength, errorMessage, attrs);
		case 'move':
			var move = this.engine.dex.moves.get(id);
			return this.renderMoveRow(move, matchStart, matchLength, errorMessage, attrs);
		case 'item':
			var item = this.engine.dex.items.get(id);
			return this.renderItemRow(item, matchStart, matchLength, errorMessage, attrs);
		case 'ability':
			var ability = this.engine.dex.abilities.get(id);
			return this.renderAbilityRow(ability, matchStart, matchLength, errorMessage, attrs);
		case 'type':
			var type = { name: id[0].toUpperCase() + id.substr(1) };
			return this.renderTypeRow(type, matchStart, matchLength, errorMessage);

			//RETURN TO THIS
		case 'egggroup':
			// very hardcode
			var egName;
			if (id === 'humanlike') egName = 'Human-Like';
			else if (id === 'water1') egName = 'Water 1';
			else if (id === 'water2') egName = 'Water 2';
			else if (id === 'water3') egName = 'Water 3';
			if (egName) {
				if (matchLength > 5) matchLength++;
			} else {
				egName = id[0].toUpperCase() + id.substr(1);
			}
			var egggroup = { name: egName };
			return this.renderEggGroupRow(egggroup, matchStart, matchLength, errorMessage);
		case 'tier':
			// very hardcode
			var tierTable = {
				uber: "Uber",
				ou: "OU",
				uu: "UU",
				ru: "RU",
				nu: "NU",
				pu: "PU",
				zu: "ZU",
				nfe: "NFE",
				lc: "LC",
				cap: "CAP",
				caplc: "CAP LC",
				capnfe: "CAP NFE",
				uubl: "UUBL",
				rubl: "RUBL",
				nubl: "NUBL",
				publ: "PUBL",
				zubl: "ZUBL"
			};
			var tier = { name: tierTable[id] };
			return this.renderTierRow(tier, matchStart, matchLength, errorMessage);
	case 'category':
		var category = { name: id[0].toUpperCase() + id.substr(1), id: id };
		return this.renderCategoryRow(category, matchStart, matchLength, errorMessage);
	case 'flag':
		var flag = { name: id[0].toUpperCase() + id.substr(1), id: id };
		return this.renderFlagRow(flag, matchStart, matchLength, errorMessage);
	case 'itemclass':
		var itemclassNames = {
			'fragile': 'Fragile',
			'volatile': 'Volatile',
			'consumable': 'Consumable',
			'pokeball': 'Pokéball',
			'evolution': 'Evolution',
			'tradeevo': 'Trade Evo'
		};
		var itemclass = { name: itemclassNames[id] || id[0].toUpperCase() + id.substr(1), id: id };
		return this.renderItemClassRow(itemclass, matchStart, matchLength, errorMessage);
		case 'article':
			var articleTitle = (window.BattleArticleTitles && BattleArticleTitles[id]) || (id[0].toUpperCase() + id.substr(1));
			var article = { name: articleTitle, id: id };
			return this.renderArticleRow(article, matchStart, matchLength, errorMessage);
		}
		return 'Error: not found';
	};
	Search.prototype.renderPokemonSortRow = function () {
		var buf = '<li class="result"><div class="sortrow">';
		buf += '<button class="sortcol numsortcol' + (!this.sortCol ? ' cur' : '') + '">' + (!this.sortCol ? 'Sort: ' : this.engine.firstPokemonColumn) + '</button>';
		buf += '<button class="sortcol pnamesortcol' + (this.sortCol === 'name' ? ' cur' : '') + '" data-sort="name">Name</button>';
		buf += '<button class="sortcol typesortcol' + (this.sortCol === 'type' ? ' cur' : '') + '" data-sort="type">Types</button>';
		buf += '<button class="sortcol abilitysortcol' + (this.sortCol === 'ability' ? ' cur' : '') + '" data-sort="ability">Abilities</button>';
		buf += '<button class="sortcol statsortcol' + (this.sortCol === 'hp' ? ' cur' : '') + '" data-sort="hp">HP</button>';
		buf += '<button class="sortcol statsortcol' + (this.sortCol === 'atk' ? ' cur' : '') + '" data-sort="atk">Atk</button>';
		buf += '<button class="sortcol statsortcol' + (this.sortCol === 'def' ? ' cur' : '') + '" data-sort="def">Def</button>';
		if (this.engine.dex.gen >= 2) {
			buf += '<button class="sortcol statsortcol' + (this.sortCol === 'spa' ? ' cur' : '') + '" data-sort="spa">SpA</button>';
			buf += '<button class="sortcol statsortcol' + (this.sortCol === 'spd' ? ' cur' : '') + '" data-sort="spd">SpD</button>';
		} else {
			buf += '<button class="sortcol statsortcol' + (this.sortCol === 'spa' ? ' cur' : '') + '" data-sort="spa">Spc</button>';
		}
		buf += '<button class="sortcol statsortcol' + (this.sortCol === 'spe' ? ' cur' : '') + '" data-sort="spe">Spe</button>';
		buf += '<button class="sortcol statsortcol' + (this.sortCol === 'bst' ? ' cur' : '') + '" data-sort="bst">BST</button>';
		buf += '</div></li>';
		return buf;
	};
	Search.prototype.renderMoveSortRow = function () {
		var buf = '<li class="result"><div class="sortrow">';
		buf += '<button class="sortcol movenamecol' + (this.sortCol === 'name' ? ' cur' : '') + '" data-sort="name">Name</button>';
		buf += '<button class="sortcol typecol' + (this.sortCol === 'type' ? ' cur' : '') + '" data-sort="type">Type</button>';
		buf += '<button class="sortcol catcol' + (this.sortCol === 'category' ? ' cur' : '') + '" data-sort="category">Category</button>';
		buf += '<button class="sortcol flagssortcol' + (this.sortCol === 'flag' ? ' cur' : '') + '" data-sort="flag" style="margin-left: 12px;">Flags</button>';
		buf += '<button class="sortcol labelcol' + (this.sortCol === 'power' ? ' cur' : '') + '" data-sort="power" style="margin-left: 0;">Power</button>';
		buf += '<button class="sortcol widelabelcol' + (this.sortCol === 'accuracy' ? ' cur' : '') + '" data-sort="accuracy">Accuracy</button>';
		buf += '<button class="sortcol labelcol' + (this.sortCol === 'crit' ? ' cur' : '') + '" data-sort="crit" style="margin-left: 0;">Crit</button>';
		buf += '<button class="sortcol pplabelcol' + (this.sortCol === 'pp' ? ' cur' : '') + '" data-sort="pp" style="margin-left: 0;">PP</button>';
		buf += '<span style="margin: 0 5px; color: #999;">|</span>';
		var categoryDisplay = Dex.prefs('categorydisplay') || 'icons';
		buf += '<label style="font-size: 9px; display: inline-flex; align-items: center; vertical-align: middle;">';
		buf += '<span style="margin-right: 1px; line-height: 1;">Category Icons:</span>';
		buf += '<select id="category-display-toggle" style="font-size: 9px; padding: 1px 3px 1px 1px; appearance: none; -webkit-appearance: none; -moz-appearance: none; width: 42px;">';
		buf += '<option value="icons"' + (categoryDisplay === 'icons' ? ' selected' : '') + '>Icons</option>';
		buf += '<option value="text"' + (categoryDisplay === 'text' ? ' selected' : '') + '>Text</option>';
		buf += '<option value="both"' + (categoryDisplay === 'both' ? ' selected' : '') + '>Both</option>';
		buf += '</select></label>';
		buf += '<span style="margin: 0 5px; color: #999;">|</span>';
		var flagIconsChecked = Dex.prefs('flagicons') !== false;
		buf += '<label style="font-size: 9px; cursor: pointer; display: inline-flex; align-items: center; vertical-align: middle; margin-right: 4px;">';
		buf += '<span style="line-height: 1; margin-right: 2px;">Flag Icons</span><input type="checkbox" id="flag-icons-toggle" style="margin: 0; vertical-align: middle;"' + (flagIconsChecked ? ' checked' : '') + '></label>';
		var flagTint = Dex.prefs('flagtint') || 'both';
		buf += '<label style="font-size: 9px; display: inline-flex; align-items: center; vertical-align: middle;">';
		buf += '<span style="margin-right: 1px; line-height: 1;">Flag Tint:</span>';
		buf += '<select id="flag-tint-toggle" style="font-size: 9px; padding: 1px 3px 1px 1px; appearance: none; -webkit-appearance: none; -moz-appearance: none; width: 40px;">';
		buf += '<option value="none"' + (flagTint === 'none' ? ' selected' : '') + '>None</option>';
		buf += '<option value="icons"' + (flagTint === 'icons' ? ' selected' : '') + '>Icons</option>';
		buf += '<option value="text"' + (flagTint === 'text' ? ' selected' : '') + '>Text</option>';
		buf += '<option value="both"' + (flagTint === 'both' ? ' selected' : '') + '>Both</option>';
		buf += '</select></label>';
		buf += '</div></li>';
		return buf;
	};
	Search.prototype.renderPokemonRow = function (pokemon, matchStart, matchLength, errorMessage, attrs) {
		if (!attrs) attrs = '';
		if (!pokemon) return '<li class="result">Unrecognized pokemon</li>';
		var id = toID(pokemon.name);
		if (Search.urlRoot) attrs += ' href="' + Search.urlRoot + 'pokemon/' + id + '" data-target="push"';
		var buf = '<li class="result"><a' + attrs + ' data-entry="pokemon|' + BattleLog.escapeHTML(pokemon.name) + '">';

		// number
		var tier = this.engine ? this.engine.getTier(pokemon) : pokemon.num;
		// buf += '<span class="col numcol">' + (pokemon.num >= 0 ? pokemon.num : 'CAP') + '</span> ';
		buf += '<span class="col numcol">' + tier + '</span> ';

		// icon
		buf += '<span class="col iconcol">';
		buf += '<span style="' + Dex.getPokemonIcon(pokemon.name) + '"></span>';
		buf += '</span> ';

		// name
		var name = pokemon.name;
		var tagStart = (pokemon.forme ? name.length - pokemon.forme.length - 1 : 0);
		if (tagStart) name = name.substr(0, tagStart);
		if (matchLength) {
			name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
		}
		if (tagStart) {
			if (matchLength && matchStart + matchLength > tagStart) {
				if (matchStart < tagStart) {
					matchLength -= tagStart - matchStart;
					matchStart = tagStart;
				}
				name += '<small>' + pokemon.name.substr(tagStart, matchStart - tagStart) + '<b>' + pokemon.name.substr(matchStart, matchLength) + '</b>' + pokemon.name.substr(matchStart + matchLength) + '</small>';
			} else {
				name += '<small>' + pokemon.name.substr(tagStart) + '</small>';
			}
		}
		buf += '<span class="col pokemonnamecol">' + name + '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		var gen = this.engine ? this.engine.dex.gen : 9;

		// type
		buf += '<span class="col typecol">';
		var types = pokemon.types;
		for (var i = 0; i < types.length; i++) {
			buf += Dex.getTypeIcon(types[i]);
		}
		buf += '</span> ';

		// abilities
		if (gen >= 3 && !(this.engine && this.engine.dex.modid === 'gen7letsgo')) {
			var abilities = pokemon.abilities;
			if (gen >= 5) {
				if (abilities['1']) {
					buf += '<span class="col twoabilitycol">' + abilities['0'] + '<br />' +
						abilities['1'] + '</span>';
				} else {
					buf += '<span class="col abilitycol">' + abilities['0'] + '</span>';
				}
				var unreleasedHidden = pokemon.unreleasedHidden;
				if (unreleasedHidden === 'Past' && (this.mod === 'natdex' || gen < 8)) unreleasedHidden = false;
				if (abilities['S']) {
					if (abilities['H']) {
					buf += '<span class="col twoabilitycol' + (unreleasedHidden ? ' unreleasedhacol' : '') + '">' + (abilities['H'] || '') + '<br />' + abilities['S'] + '</span>';
				} else {
					buf += '<span class="col abilitycol">' + abilities['S'] + '</span>';
					}
				} else if (abilities['H']) {
					buf += '<span class="col abilitycol' + (unreleasedHidden ? ' unreleasedhacol' : '') + '">' + abilities['H'] + '</span>';
				} else {
					buf += '<span class="col abilitycol"></span>';
				}
			} else {
				buf += '<span class="col abilitycol">' + abilities['0'] + '</span>';
				buf += '<span class="col abilitycol">' + (abilities['1'] ? abilities['1'] : '') + '</span>';
			}
		} else {
			buf += '<span class="col abilitycol"></span>';
			buf += '<span class="col abilitycol"></span>';
		}

		// base stats
		var stats = pokemon.baseStats;
		buf += '<span class="col statcol"><em>HP</em><br />' + stats.hp + '</span> ';
		buf += '<span class="col statcol"><em>Atk</em><br />' + stats.atk + '</span> ';
		buf += '<span class="col statcol"><em>Def</em><br />' + stats.def + '</span> ';
		if (gen >= 2) {
			buf += '<span class="col statcol"><em>SpA</em><br />' + stats.spa + '</span> ';
			buf += '<span class="col statcol"><em>SpD</em><br />' + stats.spd + '</span> ';
		} else {
			buf += '<span class="col statcol"><em>Spc</em><br />' + stats.spa + '</span> ';
		}
		buf += '<span class="col statcol"><em>Spe</em><br />' + stats.spe + '</span> ';
		var bst = 0;
		for (i in stats) {
			if (i === 'spd' && gen === 1) continue;
			bst += stats[i];
		}
		buf += '<span class="col bstcol"><em>BST<br />' + bst + '</em></span> ';

		buf += '</a></li>';

		return buf;
	};
	Search.prototype.renderTaggedPokemonRowInner = function (pokemon, tag, errorMessage) {
		var attrs = '';
		if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'pokemon/' + toID(pokemon.name) + '" data-target="push"';
		var buf = '<a' + attrs + ' data-entry="pokemon|' + BattleLog.escapeHTML(pokemon.name) + '">';

		// tag
		buf += '<span class="col tagcol shorttagcol">' + tag + '</span> ';

		// icon
		buf += '<span class="col iconcol">';
		buf += '<span style="' + Dex.getPokemonIcon(pokemon.name) + '"></span>';
		buf += '</span> ';

		// name
		var name = pokemon.name;
		var tagStart = (pokemon.forme ? name.length - pokemon.forme.length - 1 : 0);
		if (tagStart) name = name.substr(0, tagStart) + '<small>' + pokemon.name.substr(tagStart) + '</small>';
		buf += '<span class="col shortpokemonnamecol">' + name + '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		// type
		buf += '<span class="col typecol">';
		for (var i = 0; i < pokemon.types.length; i++) {
			buf += Dex.getTypeIcon(pokemon.types[i]);
		}
		buf += '</span> ';

		// abilities
		buf += '<span style="float:left;min-height:26px">';
		if (pokemon.abilities['1']) {
			buf += '<span class="col twoabilitycol">';
		} else {
			buf += '<span class="col abilitycol">';
		}
		for (var i in pokemon.abilities) {
			var ability = pokemon.abilities[i];
			if (!ability) continue;

			if (i === '1') buf += '<br />';
			if (i === 'H') ability = '</span><span class="col abilitycol"><em>' + pokemon.abilities[i] + '</em>';
			buf += ability;
		}
		if (!pokemon.abilities['H']) buf += '</span><span class="col abilitycol">';
		buf += '</span>';
		buf += '</span>';

		// base stats
		buf += '<span style="float:left;min-height:26px">';
		buf += '<span class="col statcol"><em>HP</em><br />' + pokemon.baseStats.hp + '</span> ';
		buf += '<span class="col statcol"><em>Atk</em><br />' + pokemon.baseStats.atk + '</span> ';
		buf += '<span class="col statcol"><em>Def</em><br />' + pokemon.baseStats.def + '</span> ';
		buf += '<span class="col statcol"><em>SpA</em><br />' + pokemon.baseStats.spa + '</span> ';
		buf += '<span class="col statcol"><em>SpD</em><br />' + pokemon.baseStats.spd + '</span> ';
		buf += '<span class="col statcol"><em>Spe</em><br />' + pokemon.baseStats.spe + '</span> ';
		var bst = 0;
		for (i in pokemon.baseStats) bst += pokemon.baseStats[i];
		buf += '<span class="col bstcol"><em>BST<br />' + bst + '</em></span> ';
		buf += '</span>';

		buf += '</a>';

		return buf;
	};

	Search.prototype.renderItemRow = function (item, matchStart, matchLength, errorMessage, attrs) {
		if (!attrs) attrs = '';
		if (!item) return '<li class="result">Unrecognized item</li>';
		var id = toID(item.name);
		
		// Calculate classification and type for later use
		var classification = '';
		var classificationClass = '';
		if (item.isFragile) {
			classification = 'Fragile';
			classificationClass = 'fragile';
		} else if (item.isMildlyFragile) {
			classification = 'Volatile';
			classificationClass = 'volatile';
		}
		
		var consumable = '';
		var consumableClass = '';
		var isSingleUse = (item.shortDesc || item.desc || '').includes('Single use');
		var evolutionStones = ['dawnstone', 'duskstone', 'firestone', 'icestone', 'leafstone', 'moonstone', 'shinystone', 'sunstone', 'thunderstone', 'waterstone'];
		var isEvolutionStone = evolutionStones.includes(id);
		var isEvolution = (item.shortDesc || item.desc || '').includes('Evolves') || isEvolutionStone;
		var isTradeEvo = (item.shortDesc || item.desc || '').includes('when traded');
		var isBerryItem = (item.isBerry || id.endsWith('berry')) && id !== 'berryjuice';
		if (item.isPokeball) {
			consumable = 'Pokéball';
			consumableClass = 'pokeball';
		} else if (isTradeEvo) {
			consumable = 'Trade Evo';
			consumableClass = 'tradeevo';
		} else if (isEvolution) {
			consumable = 'Evolution';
			consumableClass = 'evolution';
		} else if (isBerryItem) {
			consumable = 'Berry';
			consumableClass = 'berry';
		} else if (item.isGem || isSingleUse) {
			consumable = 'Consumable';
			consumableClass = 'consumable';
		}
		
		if (Search.urlRoot) attrs += ' href="' + Search.urlRoot + 'items/' + id + '" data-target="push"';
		var buf = '<li class="result itemrow"><a' + attrs + ' data-entry="item|' + BattleLog.escapeHTML(item.name) + '">';

		// icon
		buf += '<span class="col itemiconcol">';
		buf += '<span style="' + Dex.getItemIcon(item) + '"></span>';
		buf += '</span> ';

		// name
		var name = item.name;
		if (matchLength) {
			name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
		}
		buf += '<span class="col itemnamecol">' + name + '</span> ';

		// classification buttons container
		buf += '<span class="col itemclasscontainer">';
		
		// classification
		var fragileEmpty = classification ? '' : ' empty';
		var fragileTag = classification ? ' data-tag="' + classification.toLowerCase() + '"' : '';
		buf += '<span class="itemclasscol ' + classificationClass + fragileEmpty + '"' + fragileTag + '>' + (classification || '\u2014') + '</span>';

		// consumable
		var consumableEmpty = consumable ? '' : ' empty';
		var consumableTag = consumable ? ' data-tag="' + consumable.toLowerCase().replace(' ', '') + '"' : '';
		buf += '<span class="itemconsumecol ' + consumableClass + consumableEmpty + '"' + consumableTag + '>' + (consumable || '\u2014') + '</span>';
		
		buf += '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}
		// desc - split into main and fragile descriptions
		var fullDesc = item.shortDesc || '';
		var mainDesc = fullDesc;
		var fragileDesc = '';
		
		// Extract fragility-related text
		var fragileMatch = fullDesc.match(/\. (Fragile[^.]*\.|Volatile[^.]*\.)/);
		if (fragileMatch) {
			fragileDesc = fragileMatch[1];
			mainDesc = fullDesc.replace(fragileMatch[0], '.');
		}
		
		buf += '<span class="col itemdesccol">' + BattleLog.escapeHTML(mainDesc) + '</span> ';
		buf += '<span class="col fragiledesccol">' + BattleLog.escapeHTML(fragileDesc) + '</span> ';

		buf += '</a></li>';

		return buf;
	};
	Search.prototype.renderAbilityRow = function (ability, matchStart, matchLength, errorMessage, attrs) {
		if (!attrs) attrs = '';
		if (!ability) return '<li class="result">Unrecognized ability</li>';
		var id = toID(ability.name);
		if (Search.urlRoot) attrs += ' href="' + Search.urlRoot + 'abilities/' + id + '" data-target="push"';
		var buf = '<li class="result"><a' + attrs + ' data-entry="ability|' + BattleLog.escapeHTML(ability.name) + '">';

		// name
		var name = ability.name;
		if (matchLength) {
			name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
		}
		buf += '<span class="col namecol">' + name + '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		buf += '<span class="col abilitydesccol">' + BattleLog.escapeHTML(ability.shortDesc) + '</span> ';

		buf += '</a></li>';

		return buf;
	};
	Search.prototype.renderMoveRow = function (move, matchStart, matchLength, errorMessage, attrs) {
		if (!attrs) attrs = '';
		if (!move) return '<li class="result">Unrecognized move</li>';
		var id = toID(move.name);
		if (Search.urlRoot) attrs += ' href="' + Search.urlRoot + 'moves/' + id + '" data-target="push"';
		var buf = '<li class="result"><a' + attrs + ' data-entry="move|' + BattleLog.escapeHTML(move.name) + '">';

		// name
		var name = move.name;
		var tagStart = (name.substr(0, 12) === 'Hidden Power' ? 12 : 0);
		if (tagStart) name = name.substr(0, tagStart);
		if (matchLength) {
			name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
		}
		if (tagStart) {
			if (matchLength && matchStart + matchLength > tagStart) {
				if (matchStart < tagStart) {
					matchLength -= tagStart - matchStart;
					matchStart = tagStart;
				}
				name += '<small>' + move.name.substr(tagStart, matchStart - tagStart) + '<b>' + move.name.substr(matchStart, matchLength) + '</b>' + move.name.substr(matchStart + matchLength) + '</small>';
			} else {
				name += '<small>' + move.name.substr(tagStart) + '</small>';
			}
		}
		buf += '<span class="col movenamecol">' + name + '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		// type
		buf += '<span class="col typecol">';
		buf += Dex.getTypeIcon(move.type);
		buf += '</span> ';
		buf += '<span class="col catcol">';
		buf += this.getCategoryDisplay(move.category);
		buf += '</span> ';
		// render flags as textual labels (escaped), showing truthy keys from move.flags
		// but exclude implementation/internal flags from display.
		var HIDDEN_FLAGS = new Set(['allyanim', 'bypasssub', 'cantusetwice', 'charge', 'defrost', 'distance', 'failcopycat', 'failencore', 'failinstruct', 'failmefirst', 'failmimic', 'futuremove', 'gravity', 'metronome', 'mirror', 'mustpressure', 'noassist', 'noparentalbond', 'nonsky', 'nosketch', 'nosleeptalk', 'pledgecombo', 'protect', 'recharge', 'reflectable', 'snatch']);
		var flagsHtml = '';
		if (move.flags && typeof move.flags === 'object') {
			var flagKeys = Object.keys(move.flags).filter(function (k) { return move.flags[k]; });
			// filter out hidden/internal flags
			flagKeys = flagKeys.filter(function (k) { return !HIDDEN_FLAGS.has(k); });
			if (flagKeys.length) {
				var useFlagIcons = Dex.prefs('flagicons') !== false;
				var flagTintPref = Dex.prefs('flagtint') || 'both';
				var shouldTintText = flagTintPref === 'text' || flagTintPref === 'both';
				var textColor = shouldTintText ? this.getCategoryTextColor(move.category) : '';
				var self = this;
				flagsHtml = flagKeys.map(function (k) {
					if (useFlagIcons) {
						var icon = Dex.getFlagIcon(k);
						if (icon && icon !== '\u2014') return '<div>' + icon + '</div>';
					}
					var s = k.charAt(0).toUpperCase() + k.slice(1);
					if (textColor) {
						return '<div style="color: ' + textColor + ';">' + BattleLog.escapeHTML(s) + '</div>';
					}
					return '<div>' + BattleLog.escapeHTML(s) + '</div>';
				}).join('');
			}
		} else if (typeof move.flags === 'string') {
			var singleFlag = move.flags;
			if (!HIDDEN_FLAGS.has(singleFlag)) {
				var useFlagIcons2 = Dex.prefs('flagicons') !== false;
				var flagTintPref2 = Dex.prefs('flagtint') || 'both';
				var shouldTintText2 = flagTintPref2 === 'text' || flagTintPref2 === 'both';
				var textColor2 = shouldTintText2 ? this.getCategoryTextColor(move.category) : '';
				if (useFlagIcons2) {
					var icon2 = Dex.getFlagIcon(singleFlag);
					if (icon2 && icon2 !== '\u2014') {
						flagsHtml = '<div>' + icon2 + '</div>';
					} else {
						var sf = singleFlag.charAt(0).toUpperCase() + singleFlag.slice(1);
						if (textColor2) {
							flagsHtml = '<div style="color: ' + textColor2 + ';">' + BattleLog.escapeHTML(sf) + '</div>';
						} else {
							flagsHtml = '<div>' + BattleLog.escapeHTML(sf) + '</div>';
						}
					}
				} else {
					var sf = singleFlag.charAt(0).toUpperCase() + singleFlag.slice(1);
					if (textColor2) {
						flagsHtml = '<div style="color: ' + textColor2 + ';">' + BattleLog.escapeHTML(sf) + '</div>';
					} else {
						flagsHtml = '<div>' + BattleLog.escapeHTML(sf) + '</div>';
					}
				}
			}}
		
		// Determine if we need multi-flag class (3+ flags)
		var flagCount = 0;
		if (typeof move.flags === 'object' && move.flags) {
			flagCount = Object.keys(move.flags).filter(function (k) { return !HIDDEN_FLAGS.has(k); }).length;
		} else if (typeof move.flags === 'string' && !HIDDEN_FLAGS.has(move.flags)) {
			flagCount = 1;
		}
		var flagClass = flagCount >= 3 ? 'col flagcol multi-flag' : 'col flagcol';
	var flagTintPref = Dex.prefs('flagtint') || 'both';
	var shouldTintIcons = flagTintPref === 'icons' || flagTintPref === 'both';
	var categoryFilter = shouldTintIcons ? this.getCategoryFlagFilter(move.category) : 'none';
	
	buf += '<span class="' + flagClass + '" style="text-align:center; margin-left: 6px; filter: ' + categoryFilter + ';">' + flagsHtml + '</span> ';
		var pp = (move.pp === 1 || move.noPPBoosts ? move.pp : move.pp * 8 / 5);
		if (this.engine && this.engine.dex.gen < 3) pp = Math.min(61, pp);
		console.log('[CRIT DEBUG]', move.name, 'critRatio:', move.critRatio, 'num:', move.num, 'desc:', move.desc ? move.desc.substring(0, 30) : 'none');
		buf += '<span class="col labelcol" style="margin-left: 6px;">' + (move.category !== 'Status' ? ('<em>Power</em><br />' + (move.basePower || '&mdash;')) : '') + '</span> ';
		buf += '<span class="col widelabelcol"><em>Accuracy</em><br />' + (move.accuracy && move.accuracy !== true ? move.accuracy + '%' : '&mdash;') + '</span> ';
		var critValue = move.critRatio ? '<span style="position: relative; top: -0.5px;">' + ((move.critRatio - 4) >= 0 ? '+' + (move.critRatio - 4) : (move.critRatio - 4)) + '</span>' : '&mdash;';
		buf += '<span class="col labelcol"' + (move.critRatio ? ' style="cursor: help;" title="Crit Chance: ' + this.getCritChance(move.critRatio) + '"' : '') + '><em>Crit</em><br />' + critValue + '</span> ';
		buf += '<span class="col pplabelcol"><em>PP</em><br />' + pp + '</span> ';
		// desc
		buf += '<span class="col movedesccol">' + BattleLog.escapeHTML(move.shortDesc) + '</span> ';

		buf += '</a></li>';

		return buf;
	};
	Search.prototype.renderMoveRowInner = function (move, errorMessage) {
		var attrs = '';
		if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'moves/' + toID(move.name) + '" data-target="push"';
		var buf = '<a' + attrs + ' data-entry="move|' + BattleLog.escapeHTML(move.name) + '">';

		// name
		var name = move.name;
		var tagStart = (name.substr(0, 12) === 'Hidden Power' ? 12 : 0);
		if (tagStart) name = name.substr(0, tagStart) + '<small>' + move.name.substr(tagStart) + '</small>';
		buf += '<span class="col movenamecol">' + name + '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		// type
		buf += '<span class="col typecol">';
		buf += Dex.getTypeIcon(move.type);
		buf += this.getCategoryDisplay(move.category);
		buf += '</span> ';

		// flags
		var HIDDEN_FLAGS = new Set(['allyanim', 'bypasssub', 'charge', 'defrost', 'distance', 'failinstruct', 'gravity', 'mirror', 'nonsky', 'nosketch', 'protect', 'recharge', 'reflectable', 'snatch']);
		var innerFlagsHtml = '';
		if (move.flags && typeof move.flags === 'object') {
			var innerFlagKeys = Object.keys(move.flags).filter(function (k) { return move.flags[k]; });
			innerFlagKeys = innerFlagKeys.filter(function (k) { return !HIDDEN_FLAGS.has(k); });
			if (innerFlagKeys.length) {
				var useFlagIconsInner = Dex.prefs('flagicons') !== false;
				var flagTintPrefInner = Dex.prefs('flagtint') || 'both';
				var shouldTintTextInner = flagTintPrefInner === 'text' || flagTintPrefInner === 'both';
				var textColorInner = shouldTintTextInner ? this.getCategoryTextColor(move.category) : '';
				var self = this;
				innerFlagsHtml = innerFlagKeys.map(function (k) {
					if (useFlagIconsInner) {
						var iconInner = Dex.getFlagIcon(k);
						if (iconInner && iconInner !== '\u2014') return '<div>' + iconInner + '</div>';
					}
					var s = k.charAt(0).toUpperCase() + k.slice(1);
					if (textColorInner) {
						return '<div style="color: ' + textColorInner + ';">' + BattleLog.escapeHTML(s) + '</div>';
					}
					return '<div>' + BattleLog.escapeHTML(s) + '</div>';
				}).join('');
			}
		} else if (typeof move.flags === 'string') {
			var singleInnerFlag = move.flags;
			if (!HIDDEN_FLAGS.has(singleInnerFlag)) {
				var useFlagIconsInner2 = Dex.prefs('flagicons') !== false;
				var flagTintPrefInner2 = Dex.prefs('flagtint') || 'both';
				var shouldTintTextInner2 = flagTintPrefInner2 === 'text' || flagTintPrefInner2 === 'both';
				var textColorInner2 = shouldTintTextInner2 ? this.getCategoryTextColor(move.category) : '';
				if (useFlagIconsInner2) {
					var iconInner2 = Dex.getFlagIcon(singleInnerFlag);
					if (iconInner2 && iconInner2 !== '\u2014') {
						innerFlagsHtml = '<div>' + iconInner2 + '</div>';
					} else {
						var sif = singleInnerFlag.charAt(0).toUpperCase() + singleInnerFlag.slice(1);
						if (textColorInner2) {
							innerFlagsHtml = '<div style="color: ' + textColorInner2 + ';">' + BattleLog.escapeHTML(sif) + '</div>';
						} else {
							innerFlagsHtml = '<div>' + BattleLog.escapeHTML(sif) + '</div>';
						}
					}
				} else {
					var sif = singleInnerFlag.charAt(0).toUpperCase() + singleInnerFlag.slice(1);
					if (textColorInner2) {
						innerFlagsHtml = '<div style="color: ' + textColorInner2 + ';">' + BattleLog.escapeHTML(sif) + '</div>';
					} else {
						innerFlagsHtml = '<div>' + BattleLog.escapeHTML(sif) + '</div>';
					}
				}
			}
		}
		var flagTintPrefInner = Dex.prefs('flagtint') || 'both';
		var shouldTintIconsInner = flagTintPrefInner === 'icons' || flagTintPrefInner === 'both';
		var categoryFilterInner = shouldTintIconsInner ? this.getCategoryFlagFilter(move.category) : 'none';
		buf += '<span class="col flagcol" style="margin-left: 6px; filter: ' + categoryFilterInner + ';">' + innerFlagsHtml + '</span> ';

		// power, accuracy, pp
		var pp = (move.pp === 1 || move.noPPBoosts ? move.pp : move.pp * 8 / 5);
		if (this.engine && this.engine.dex.gen < 3) pp = Math.min(61, pp);
		buf += '<span class="col labelcol" style="margin-left: 6px;">' + (move.category !== 'Status' ? ('<em>Power</em><br />' + (move.basePower || '&mdash;')) : '') + '</span> ';
		buf += '<span class="col widelabelcol"><em>Accuracy</em><br />' + (move.accuracy && move.accuracy !== true ? move.accuracy + '%' : '&mdash;') + '</span> ';
		var critValue = move.critRatio ? '<span style="position: relative; top: -0.5px;">' + ((move.critRatio - 4) >= 0 ? '+' + (move.critRatio - 4) : (move.critRatio - 4)) + '</span>' : '&mdash;';
		buf += '<span class="col labelcol"' + (move.critRatio ? ' style="cursor: help;" title="Crit Chance: ' + this.getCritChance(move.critRatio) + '"' : '') + '><em>Crit</em><br />' + critValue + '</span> ';
		buf += '<span class="col pplabelcol"><em>PP</em><br />' + pp + '</span> ';

		// desc
		buf += '<span class="col movedesccol">' + BattleLog.escapeHTML(move.shortDesc || move.desc) + '</span> ';

		buf += '</a>';

		return buf;
	};
	Search.prototype.renderTaggedMoveRow = function (move, tag, errorMessage) {
		var attrs = '';
		if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'moves/' + toID(move.name) + '" data-target="push"';
		var buf = '<li class="result"><a' + attrs + ' data-entry="move|' + BattleLog.escapeHTML(move.name) + '">';

		// tag
		buf += '<span class="col tagcol">' + tag + '</span> ';

		// name
		var name = move.name;
		if (name.substr(0, 12) === 'Hidden Power') name = 'Hidden Power';
		buf += '<span class="col shortmovenamecol">' + name + '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		// type
		buf += '<span class="col typecol">';
		buf += Dex.getTypeIcon(move.type);
		buf += this.getCategoryDisplay(move.category);
		buf += '</span> ';

		// power, accuracy, pp
		buf += '<span class="col powercol">' + (move.category !== 'Status' ? ('<em>Power</em><br />' + (move.basePower || '&mdash;')) : '') + '</span> ';
		buf += '<span class="col widelabelcol"><em>Accuracy</em><br />' + (move.accuracy && move.accuracy !== true ? move.accuracy + '%' : '&mdash;') + '</span> ';
		buf += '<span class="col pplabelcol"><em>PP</em><br />' + (move.pp !== 1 ? move.pp * 8 / 5 : move.pp) + '</span> ';

		// desc
		buf += '<span class="col movedesccol">' + BattleLog.escapeHTML(move.shortDesc || move.desc) + '</span> ';

		buf += '</a></li>';

		return buf;
	};

	Search.prototype.renderTypeRow = function (type, matchStart, matchLength, errorMessage) {
		var attrs = '';
		if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'types/' + toID(type.name) + '" data-target="push"';
		var buf = '<li class="result"><a' + attrs + ' data-entry="type|' + BattleLog.escapeHTML(type.name) + '">';

		// name
		var name = type.name;
		if (matchLength) {
			name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
		}
		buf += '<span class="col namecol">' + name + '</span> ';

		// type
		buf += '<span class="col typecol">';
		buf += Dex.getTypeIcon(type.name);
		buf += '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		buf += '</a></li>';

		return buf;
	};
	Search.prototype.renderCategoryRow = function (category, matchStart, matchLength, errorMessage) {
		var attrs = '';
		if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'categories/' + category.id + '" data-target="push"';
		var buf = '<li class="result"><a' + attrs + ' data-entry="category|' + BattleLog.escapeHTML(category.name) + '">';

		// name
		var name = category.name;
		if (matchLength) {
			name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
		}
		buf += '<span class="col namecol">' + name + '</span> ';

		// category
		buf += '<span class="col typecol">' + this.getCategoryDisplay(category.name) + '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}


	buf += '</a></li>';

	return buf;
};

Search.prototype.renderFlagRow = function (flag, matchStart, matchLength, errorMessage) {
	var attrs = '';
	if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'categories/' + flag.id + '" data-target="push"';
	var buf = '<li class="result"><a' + attrs + ' data-entry="flag|' + BattleLog.escapeHTML(flag.name) + '">';

	// name
	var name = flag.name;
	if (matchLength) {
		name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
	}
	buf += '<span class="col namecol">' + name + '</span> ';

	// flag icon
	buf += '<span class="col flagcol" style="margin-left: 6px;">' + Dex.getFlagIcon(flag.id) + '</span> ';

	// error
	if (errorMessage) {
		buf += errorMessage + '</a></li>';
		return buf;
	}

	buf += '</a></li>';
	return buf;
};
	Search.prototype.renderArticleRow = function (article, matchStart, matchLength, errorMessage) {
		var attrs = '';
		if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'articles/' + article.id + '" data-target="push"';
		var isSearchType = (article.id === 'pokemon' || article.id === 'moves');
		if (isSearchType) attrs = ' href="' + article.id + '/" data-target="replace"';
		var buf = '<li class="result"><a' + attrs + ' data-entry="article|' + BattleLog.escapeHTML(article.name) + '">';

		// name
		var name = article.name;
		if (matchLength) {
			name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
		}
		buf += '<span class="col namecol">' + name + '</span> ';

		// article
		if (isSearchType) {
			buf += '<span class="col movedesccol">(search type)</span> ';
		} else {
			buf += '<span class="col movedesccol">(article)</span> ';
		}

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		buf += '</a></li>';

		return buf;
	};
	Search.prototype.renderEggGroupRow = function (egggroup, matchStart, matchLength, errorMessage) {
		var attrs = '';
		if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'egggroups/' + toID(egggroup.name) + '" data-target="push"';
		var buf = '<li class="result"><a' + attrs + ' data-entry="egggroup|' + BattleLog.escapeHTML(egggroup.name) + '">';

		// name
		var name = egggroup.name;
		if (matchLength) {
			name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
		}
		buf += '<span class="col namecol">' + name + '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		buf += '</a></li>';

		return buf;
	};
	Search.prototype.renderTierRow = function (tier, matchStart, matchLength, errorMessage) {
		var attrs = '';
		if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'tiers/' + toID(tier.name) + '" data-target="push"';
		var buf = '<li class="result"><a' + attrs + ' data-entry="tier|' + BattleLog.escapeHTML(tier.name) + '">';

		// name
		var name = tier.name;
		if (matchLength) {
			name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
		}
		buf += '<span class="col namecol">' + name + '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		buf += '</a></li>';

		return buf;
	};

	Search.prototype.renderItemClassRow = function (itemclass, matchStart, matchLength, errorMessage) {
		var attrs = '';
		var buf = '<li class="result"><a' + attrs + ' data-entry="itemclass|' + BattleLog.escapeHTML(itemclass.name) + '">';

		// name
		var name = itemclass.name;
		if (matchLength) {
			name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
		}
		buf += '<span class="col namecol">' + name + '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		buf += '</a></li>';

		return buf;
	};

	Search.gen = 9;
	Search.renderRow = Search.prototype.renderRow;
	Search.renderPokemonRow = Search.prototype.renderPokemonRow;
	Search.renderTaggedPokemonRowInner = Search.prototype.renderTaggedPokemonRowInner;
	Search.renderItemRow = Search.prototype.renderItemRow;
	Search.renderAbilityRow = Search.prototype.renderAbilityRow;
	Search.renderMoveRow = Search.prototype.renderMoveRow;
	Search.renderMoveRowInner = Search.prototype.renderMoveRowInner;
	Search.renderTaggedMoveRow = Search.prototype.renderTaggedMoveRow;
	Search.renderTypeRow = Search.prototype.renderTypeRow;
	Search.renderCategoryRow = Search.prototype.renderCategoryRow;
	Search.renderFlagRow = Search.prototype.renderFlagRow;
	Search.renderEggGroupRow = Search.prototype.renderEggGroupRow;
	Search.renderTierRow = Search.prototype.renderTierRow;
	Search.renderItemClassRow = Search.prototype.renderItemClassRow;

	exports.BattleSearch = Search;

})(window, jQuery);
