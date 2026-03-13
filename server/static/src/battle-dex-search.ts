/**
 * Search code for searching for dex information, used by the Dex and Teambuilder.
 * Dependencies: battledata, search-index
 * Optional dependencies: pokedex, moves, items, abilities
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */
import { Dex, type ModdedDex, toID, type ID } from "./battle-dex";
export type SearchType = ( 'pokemon' | 'type' | 'tier' | 'move' | 'flag' | 'item' | 'ability' | 'egggroup' | 'category' | 'article' | 'itemclass' );
export type SearchRow = ( [SearchType, ID, number?, number?] | ['sortpokemon' | 'sortmove' | 'sortitem', ''] | ['header' | 'html', string] );
type SearchFilter = [string, string];
/** ID, SearchType, index (if alias), offset (if offset alias) */
declare const BattleSearchIndex: [ID, SearchType, number?, number?][];
declare const BattleSearchIndexOffset: any;
declare const BattleTeambuilderTable: any;
// Backend for search UIs.
export class DexSearch {
	query = '';
	// Dex for the mod/generation to search.
	dex: ModdedDex = Dex;
	typedSearch: BattleTypedSearch<SearchType> | null = null;
	results: SearchRow[] | null = null;
	prependResults: SearchRow[] | null = null;
	exactMatch = false;
	static typeTable = {
		pokemon: 1,
		type: 2,
		tier: 3,
		move: 4,
		item: 5,
		ability: 6,
		egggroup: 7,
		category: 8,
		article: 9,
		flag: 10,
		itemclass: 11,
	};
	static typeName = {
		pokemon: 'Pok\u00e9mon',
		type: 'Type',
		tier: 'Tiers',
		move: 'Moves',
		flag: 'Flags',
		item: 'Items',
		ability: 'Abilities',
		egggroup: 'Egg group',
		category: 'Category',
		article: 'Article',
		itemclass: 'Item Class',
	};
	firstPokemonColumn: 'Tier' | 'Number' = 'Number';
	/**
	 * Column to sort by. Default is `null`, a smart sort determined by how good
	 * things are according to the base filters, falling back to dex number (for Pokemon) and name (for everything else).
	 */
	sortCol: string | null = null;
	reverseSort = false;
	// Filters for the search result. Does not include the two base filters (format and species).
	filters: SearchFilter[] | null = null;
	constructor(searchType: SearchType | '' = '', formatid = '' as ID, species = '' as ID) { this.setType(searchType, formatid, species); }
	getTypedSearch(searchType: SearchType | '', format = '' as ID, speciesOrSet: ID | Dex.PokemonSet = '' as ID) {
		if (!searchType) return null;
		switch (searchType) {
		case 'pokemon': return new BattlePokemonSearch('pokemon', format, speciesOrSet);
		case 'item': return new BattleItemSearch('item', format, speciesOrSet);
		case 'move': return new BattleMoveSearch('move', format, speciesOrSet);
		case 'flag': return new BattleFlagSearch('flag', format, speciesOrSet);
		case 'ability': return new BattleAbilitySearch('ability', format, speciesOrSet);
		case 'type': return new BattleTypeSearch('type', format, speciesOrSet);
		case 'category': return new BattleCategorySearch('category', format, speciesOrSet);
		}
		return null;
	}
	find(query: string) {
		query = toID(query);
		if (this.query === query && this.results && this.results.length > 0) { return false; }
		this.query = query;
		if (!query) {
			this.results = this.typedSearch?.getResults(this.filters, this.sortCol, this.reverseSort) || [];
			if (!this.filters && !this.sortCol && this.prependResults) { this.results = [...this.prependResults, ...this.results]; }
		} else { this.results = this.textSearch(query); }
		return true;
	}
	setType(searchType: SearchType | '', format = '' as ID, speciesOrSet: ID | Dex.PokemonSet = '' as ID) {
		// invalidate caches
		this.results = null;
		if (searchType !== this.typedSearch?.searchType) {
			this.filters = null;
			this.sortCol = null;
		}
		this.typedSearch = this.getTypedSearch(searchType, format, speciesOrSet);
		if (this.typedSearch) this.dex = this.typedSearch.dex;
		
	}
	capitalizeFirst(str: string) { return str.charAt(0).toUpperCase() + str.slice(1); }
	addFilter(entry: SearchFilter | SearchRow): boolean {
		if (!this.typedSearch) return false;
		let [type] = entry;
		if (this.typedSearch.searchType === 'pokemon') {
			if (type === this.sortCol) this.sortCol = null;
			if (!['type', 'move', 'flag', 'ability', 'tier'].includes(type)) return false;
			if (type === 'type') entry[1] = this.capitalizeFirst(entry[1]);
			if (type === 'move') entry[1] = toID(entry[1]);
			if (type === 'flag') {
				// Map flag IDs to tag names for Pokemon
				const tagMap: {[id: string]: string} = {
					'legendary': 'Legendary',
					'restrictedlegendary': 'Restricted Legendary',
					'mythical': 'Mythical',
					'restrictedmythical': 'Restricted Mythical',
					'paradox': 'Paradox',
					'restrictedparadox': 'Restricted Paradox',
					'sublegendary': 'Sub-Legendary',
					'mega': 'Mega',
					'powerhouse': 'Powerhouse',
				};
				const id = toID(entry[1]);
				entry[1] = tagMap[id] || this.capitalizeFirst(entry[1]);
			}
			if (type === 'ability') entry[1] = this.dex.abilities.get(entry[1]).name;
			if (type === 'tier') {
				if ((this.typedSearch as any)?.formatType === 'indigostarstorm') {
					const raw = String(entry[1]).trim();
					const tierAliases: {[id: string]: string} = {
						rega: 'Reg α',
						regalpha: 'Reg α',
						alpha: 'Reg α',

						regd: 'Reg Δ',
						regdelta: 'Reg Δ',
						delta: 'Reg Δ',

						regi: 'Reg ι',
						regiota: 'Reg ι',
						iota: 'Reg ι',

						regb: 'Reg β',
						regbeta: 'Reg β',
						beta: 'Reg β',

						regz: 'Reg ζ',
						regzeta: 'Reg ζ',
						zeta: 'Reg ζ',

						regg: 'Reg γ',
						reggamma: 'Reg γ',
						gamma: 'Reg γ',

						regth: 'Reg Θ',
						regtheta: 'Reg Θ',
						theta: 'Reg Θ',

						rege: 'Reg ε',
						regepsilon: 'Reg ε',
						epsilon: 'Reg ε',

						regl: 'Reg λ',
						reglambda: 'Reg λ',
						lambda: 'Reg λ',

						regp: 'Reg ψ',
						regpsi: 'Reg ψ',
						psi: 'Reg ψ',

						regn: 'Reg ν',
						regnu: 'Reg ν',
						nu: 'Reg ν',

						regf: 'Reg φ',
						regphi: 'Reg φ',
						phi: 'Reg φ',
					};
					const normalized = toID(raw);
					entry[1] = tierAliases[normalized] || raw;
				} else {
					const tierTable: { [id: string]: string } = {
						uber: "Uber",
						caplc: "CAP LC",
						capnfe: "CAP NFE",
						rega: "Reg α",
						regd: "Reg Δ",
						regi: "Reg ι",
						regb: "Reg β",
						regz: "Reg ζ",
						regg: "Reg γ",
						regth: "Reg Θ",
						rege: "Reg ε",
						regl: "Reg λ",
						regp: "Reg ψ",
						regn: "Reg ν",
						regf: "Reg φ",
					};
					entry[1] = toID(entry[1]);
					entry[1] = tierTable[entry[1]] || entry[1].toUpperCase();
				}
			}
			if (!this.filters) this.filters = [];
			this.results = null;
			for (const filter of this.filters) { if (filter[0] === type && filter[1] === entry[1]) { return true; } }
			this.filters.push(entry.slice(0, 2) as SearchFilter);
			return true;
		} else if (this.typedSearch.searchType === 'move') {
			if (type === this.sortCol) this.sortCol = null;
			if (!['type', 'category', 'flag', 'pokemon'].includes(type)) return false;
			if (type === 'type') entry[1] = this.capitalizeFirst(entry[1]);
			if (type === 'category') entry[1] = this.capitalizeFirst(entry[1]);
			if (type === 'flag') entry[1] = toID(entry[1]);
			if (type === 'pokemon') entry[1] = toID(entry[1]);
			if (!this.filters) this.filters = [];
			this.filters.push(entry.slice(0, 2) as SearchFilter);
			this.results = null;
			return true;
		} else if (this.typedSearch.searchType === 'item') {
			if (type === this.sortCol) this.sortCol = null;
			if (!['itemclass'].includes(type)) return false;
			if (type === 'itemclass') {
	// store canonical ID (as ID type)
	let classId = toID(entry[1]) as ID;
	if (classId === 'berries') classId = 'berry' as ID; // back-compat
	entry[1] = classId;
}
			if (!this.filters) this.filters = [];
			this.results = null;
			for (const filter of this.filters) { if (filter[0] === type && filter[1] === entry[1]) { return true; } }
			this.filters.push(entry.slice(0, 2) as SearchFilter);
			return true;
		}
		return false;
	}
	removeFilter(entry?: SearchFilter): boolean {
		if (!this.filters) return false;
		if (entry) {
			const filterid = entry.join(':');
			let deleted: string[] | null = null;
			// delete specific filter
			for (let i = 0; i < this.filters.length; i++) {
				if (filterid === this.filters[i].join(':')) {
					deleted = this.filters[i];
					this.filters.splice(i, 1);
					break;
				}
			}
			if (!deleted) return false;
		} else { this.filters.pop(); }
		if (!this.filters.length) this.filters = null;
		this.results = null;
		return true;
	}
	toggleSort(sortCol: string) {
		if (this.sortCol === sortCol) {
			if (!this.reverseSort) { this.reverseSort = true; } 
			else {
				this.sortCol = null;
				this.reverseSort = false;
			}
		} else {
			this.sortCol = sortCol;
			this.reverseSort = false;
		}
		this.results = null;
	}
	filterLabel(filterType: string) {
		if (this.typedSearch && this.typedSearch.searchType !== filterType) { return 'Filter'; }
		return null;
	}
	illegalLabel(id: ID) {
		if (this.typedSearch?.searchType === 'move') {
			const moveSearch = this.typedSearch as any;
			const dex = moveSearch.dex;
			const species = moveSearch.species ? dex.species.get(moveSearch.species) : null;
			const infusibleSlots = (species && (species as any).infusibleSlots) || 0;

			if (infusibleSlots) {
				const infusibleMoves: {[k: string]: 1} = {
					acid: 1, acidspray: 1, appleacid: 1, aquajet: 1, aquaring: 1, aromatherapy: 1, aromaticmist: 1, aurasphere: 1, aurorabeam: 1, belch: 1, boneclub: 1, bonerush: 1,
					bonemerang: 1, brine: 1, bubble: 1, bubblebeam: 1, bubbletrap: 1, burningjealousy: 1, chargebeam: 1, chistrike: 1, confide: 1, dragonbreath: 1, dragoncheer: 1,
					dragonrage: 1, eggbomb: 1, extrasensory: 1, faketears: 1, firepledge: 1, floralhealing: 1, grasspledge: 1, gravapple: 1, gunkshot: 1, hex: 1, lifedew: 1,
					magicpowder: 1, matchagotcha: 1, mist: 1, mistball: 1, mistyexplosion: 1, mudshot: 1, poisongas: 1, poisonpowder: 1, pollenpuff: 1, powdersnow: 1,
					ragepowder: 1, silverpowder: 1, simplebeam: 1, sleeppowder: 1, sludge: 1, sludgebomb: 1, sludgewave: 1, smog: 1, soak: 1, sparklingaria: 1, spicyextract: 1,
					stunspore: 1, syrupbomb: 1, toxic: 1, venomdrench: 1, waterpledge: 1, worryseed: 1,
				};

				if (infusibleMoves[id]) return null;
			}
		}
		return this.typedSearch?.illegalReasons?.[id] || null;
	}
	getTier(species: Dex.Species) { return this.typedSearch?.getTier(species) || ''; }
	textSearch(query: string): SearchRow[] {
		// Ensure baseResults and illegalReasons are populated
		if (this.typedSearch && !this.typedSearch.baseResults) { this.typedSearch.getResults(null, null); }
		if (this.typedSearch?.illegalReasons) { console.log('[DEBUG] illegalReasons count:', Object.keys(this.typedSearch.illegalReasons).length); }
		
		query = toID(query);
		// BattleSearchIndexOffset may not exist in some builds; guard against it
		const offsetTable: any = (typeof BattleSearchIndexOffset !== 'undefined' && BattleSearchIndexOffset) ? BattleSearchIndexOffset : [];
		this.exactMatch = false;
		let searchType: SearchType | '' = this.typedSearch?.searchType || '';

		// If searchType exists, we're searching mainly for results of that type.
		// We'll still search for results of other types, but those results
		// will only be used to filter results for that type.
		let searchTypeIndex = (searchType ? DexSearch.typeTable[searchType] : -1);

		/** searching for "Psychic type" will make the type come up over the move */
		let qFilterType: 'type' | '' = '';
		if (query.endsWith('type')) {
			if (query.slice(0, -4) in window.BattleTypeChart) {
				query = query.slice(0, -4);
				qFilterType = 'type';
			}
		}
		// i represents the location of the search index we're looking at
		let i = DexSearch.getClosest(query);
		this.exactMatch = (BattleSearchIndex[i][0] === query);
		// Even with output buffer buckets, we make multiple passes through
		// the search index. searchPasses is a queue of which pass we're on:
		// [passType, i, query]
		// By doing an alias pass after the normal pass, we ensure that
		// mid-word matches only display after start matches.
		let passType: SearchPassType | '' = '';
		/**
		 * pass types:
		 * * '': time to pop the next pass off the searchPasses queue
		 * * 'normal': start at i and stop when results no longer start with query
		 * * 'alias': like normal, but output aliases instead of non-alias results
		 * * 'fuzzy': start at i and stop when you have two results
		 * * 'exact': like normal, but stop at i
		 */
		type SearchPassType = 'normal' | 'alias' | 'fuzzy' | 'exact';
		/**
		 * [passType, i, query]
		 *
		 * i = index of BattleSearchIndex to start from
		 *
		 * By doing an alias pass after the normal pass, we ensure that
		 * mid-word matches only display after start matches.
		 */
		type SearchPass = [SearchPassType, number, string];
		let searchPasses: SearchPass[] = [['normal', i, query]];

		// For performance reasons, only do an alias pass if query is at
		// least 2 chars long
		if (query.length > 1) searchPasses.push(['alias', i, query]);

		// If the query matches an official alias in BattleAliases: These are
		// different from the aliases in the search index and are given
		// higher priority. We'll do a normal pass through the index with
		// the alias text before any other passes.
		let queryAlias;
		if (query in BattleAliases) {
			if (['sub', 'tr'].includes(query) || !toID(BattleAliases[query]).startsWith(query)) {
				queryAlias = toID(BattleAliases[query]);
				let aliasPassType: SearchPassType = (queryAlias === 'hiddenpower' ? 'exact' : 'normal');
				searchPasses.unshift([aliasPassType, DexSearch.getClosest(queryAlias), queryAlias]);
			}
			this.exactMatch = true;
		}
		// If there are no matches starting with query: Do a fuzzy match pass
		// Fuzzy matches will still be shown after alias matches
		if (!this.exactMatch && BattleSearchIndex[i][0].substr(0, query.length) !== query) {
			// No results start with this. Do a fuzzy match pass.
			let matchLength = query.length - 1;
			if (!i) i++;
			while (matchLength &&
				BattleSearchIndex[i][0].substr(0, matchLength) !== query.substr(0, matchLength) &&
				BattleSearchIndex[i - 1][0].substr(0, matchLength) !== query.substr(0, matchLength)) {
				matchLength--;
			}
			let matchQuery = query.substr(0, matchLength);
			while (i >= 1 && BattleSearchIndex[i - 1][0].substr(0, matchLength) === matchQuery) i--;
			searchPasses.push(['fuzzy', i, '']);
		}
		// We split the output buffers into 8 buckets. Bucket 0 is usually unused, and buckets 1-7 represent pokemon, types, moves, etc (see typeTable).
		// When we're done, the buffers are concatenated together to form our results, with each buffer getting its own header, unlike
		// multiple-pass results, which have no header.
		// Notes: if we have a searchType, that searchType's buffer will be on top
		let bufs: SearchRow[][] = [[], [], [], [], [], [], [], [], [], [], [], []];
		let topbufIndex = -1;
		let count = 0;
		let nearMatch = false;
		/** [type, id, typeIndex] */
		let instafilter: [SearchType, ID, number] | null = null;
		let instafilterSort = [0, 1, 2, 5, 4, 3, 6, 7, 8];
		let illegal = this.typedSearch?.illegalReasons;
		// We aren't actually looping through the entirety of the searchIndex
		for (i = 0; i < BattleSearchIndex.length; i++) {
			if (!passType) {
				let searchPass = searchPasses.shift();
				if (!searchPass) break;
				passType = searchPass[0];
				i = searchPass[1];
				query = searchPass[2];
			}
			let entry = BattleSearchIndex[i];
			if (!entry) { passType = ''; continue; }
			let id = entry[0];
			let type = entry[1];
			if (!id) { passType = ''; continue; }
			if (passType === 'fuzzy') {
				// fuzzy match pass; stop after 2 results
				if (count >= 2) {
					passType = '';
					continue;
				}
				nearMatch = true;
			} else if (passType === 'exact') {
				// exact pass; stop after 1 result
				if (count >= 1) {
					passType = '';
					continue;
				}
			} else if (id.substr(0, query.length) !== query) {
				// regular pass, time to move onto our next match
				passType = '';
				continue;
			}
			if (entry.length > 2) { if (passType !== 'alias') continue; } // alias entry
			else { if (passType === 'alias') continue; } // normal entry
			let typeIndex = DexSearch.typeTable[type];
			// For performance, with a query length of 1, we only fill the first bucket
			if (query.length === 1 && typeIndex !== (searchType ? searchTypeIndex : 1)) continue;
			// For pokemon queries, accept types/tier/abilities/moves/eggroups/flags as filters
			if (searchType === 'pokemon' && (typeIndex === 5 || (typeIndex > 7 && typeIndex !== 10))) continue;
			// For move queries, accept types/categories/flags as filters
			if (searchType === 'move' && ((typeIndex !== 8 && typeIndex !== 10 && typeIndex > 4) || typeIndex === 3)) continue;
			// For move queries in the teambuilder, don't accept pokemon as filters
			if (searchType === 'move' && illegal && typeIndex === 1) continue;
			// For item queries, accept itemclass as a filter
			if (searchType === 'item' && typeIndex !== searchTypeIndex && typeIndex !== 11) continue;
			// For ability queries, don't accept anything else as a filter
			if (searchType === 'ability' && typeIndex !== searchTypeIndex) continue;
			// Query was a type name followed 'type'; only show types
			if (qFilterType === 'type' && typeIndex !== 2) continue;
			// For flag queries, accept flags/moves as filters
			if (searchType === 'flag' && ((typeIndex !== 10 && typeIndex !== 4))) continue;
			// hardcode cases of duplicate non-consecutive aliases
			if ((id === 'megax' || id === 'megay') && 'mega'.startsWith(query)) continue;
			let matchStart = 0;
			let matchEnd = 0;
			if (passType === 'alias') {
				// alias entry
				// [aliasid, type, originalid, matchStart, originalindex]
				matchStart = entry[3]!;
				let originalIndex = entry[2]!;
				if (matchStart) {
					matchEnd = matchStart + query.length;
					const offsetRow = BattleSearchIndexOffset?.[originalIndex] || '';
					matchStart += (offsetRow[matchStart] || '0').charCodeAt(0) - 48;
					matchEnd += (offsetRow[matchEnd - 1] || '0').charCodeAt(0) - 48;
				}
				const originalEntry = BattleSearchIndex[originalIndex];
				if (!originalEntry) { passType = ''; continue; }
				id = originalEntry[0];
			} else {
				matchEnd = query.length;
				const offsetRow = BattleSearchIndexOffset[i] || '';
				if (matchEnd) matchEnd += (offsetRow[matchEnd - 1] || '0').charCodeAt(0) - 48;
			}
			// some aliases are substrings
			if (queryAlias === id && query !== id) continue;
			// This is a filter, set it as an instafilter candidate
			if (searchType && searchTypeIndex !== typeIndex) { if (!instafilter || instafilterSort[typeIndex] < instafilterSort[instafilter[2]]) { instafilter = [type, id, typeIndex]; } }
			// show types above Arceus formes
			if (topbufIndex < 0 && searchTypeIndex < 2 && passType === 'alias' && !bufs[1].length && bufs[2].length) { topbufIndex = 2; }
			if (illegal && typeIndex === searchTypeIndex) {
				// Always show illegal results under legal results.
				// This is done by putting legal results (and the type header)
				// in bucket 0, and illegal results in the searchType's bucket.
				// searchType buckets are always on top (but under bucket 0), so
				// illegal results will be seamlessly right under legal results.
				if (!bufs[typeIndex].length && !bufs[0].length) { bufs[0] = [['header', DexSearch.typeName[type]]]; }
				if (!(id in illegal)) typeIndex = 0;
			} else { if (!bufs[typeIndex].length) { bufs[typeIndex] = [['header', DexSearch.typeName[type]]]; } }
			// don't match duplicate aliases
			let curBufLength = (passType === 'alias' && bufs[typeIndex].length);
			if (curBufLength && bufs[typeIndex][curBufLength - 1][1] === id) continue;
			bufs[typeIndex].push([type, id, matchStart, matchEnd]);
			count++;
		}
		let topbuf: SearchRow[] = [];
		if (nearMatch) { topbuf = [['html', `<em>No exact match found. The closest matches alphabetically are:</em>`]]; }
		if (topbufIndex >= 0) {
			topbuf = topbuf.concat(bufs[topbufIndex]);
			bufs[topbufIndex] = [];
		}
		if (searchTypeIndex >= 0) {
			topbuf = topbuf.concat(bufs[0]);
			topbuf = topbuf.concat(bufs[searchTypeIndex]);
			bufs[searchTypeIndex] = [];
			bufs[0] = [];
		}
		if (this.typedSearch?.searchType === 'pokemon' && (this.typedSearch as any)?.formatType === 'indigostarstorm') {
			const islTiers: [ID, string, string[]][] = [
				['Reg α' as ID, 'Reg α [Alpha]', ['rega', 'regalpha', 'alpha']],
				['Reg Δ' as ID, 'Reg Δ [Delta]', ['regd', 'regdelta', 'delta']],
				['Reg ι' as ID, 'Reg ι [Iota]', ['regi', 'regiota', 'iota']],
				['Reg β' as ID, 'Reg β [Beta]', ['regb', 'regbeta', 'beta']],
				['Reg ζ' as ID, 'Reg ζ [Zeta]', ['regz', 'regzeta', 'zeta']],
				['Reg γ' as ID, 'Reg γ [Gamma]', ['regg', 'reggamma', 'gamma']],
				['Reg Θ' as ID, 'Reg Θ [Theta]', ['regth', 'regtheta', 'theta']],
				['Reg ε' as ID, 'Reg ε [Epsilon]', ['rege', 'regepsilon', 'epsilon']],
				['Reg λ' as ID, 'Reg λ [Lambda]', ['regl', 'reglambda', 'lambda']],
				['Reg ψ' as ID, 'Reg ψ [Psi]', ['regp', 'regpsi', 'psi']],
				['Reg ν' as ID, 'Reg ν [Nu]', ['regn', 'regnu', 'nu']],
				['Reg φ' as ID, 'Reg φ [Phi]', ['regf', 'regphi', 'phi']],
			];
			const tierMatches: SearchRow[] = [];
			const normalizedQuery = toID(query);
			for (const [tierId, tierName, aliases] of islTiers) {
				const normalizedTier = toID(tierName);
				const matches =
					normalizedQuery === 'tier' ||
					normalizedQuery === 'tiers' ||
					normalizedTier.startsWith(normalizedQuery) ||
					aliases.some(alias => alias.startsWith(normalizedQuery));
					if (matches) { tierMatches.push(['tier', tierName as ID, 0, Math.min(normalizedQuery.length || tierName.length, tierName.length)]); }		}
			if (tierMatches.length) topbuf = [['header', 'Tiers'], ...tierMatches, ...topbuf];
		}
		if (instafilter && count < 20) {
			// Result count is less than 20, so we can instafilter
			bufs.push(this.instafilter(searchType, instafilter[0], instafilter[1]));
		}
		this.results = Array.prototype.concat.apply(topbuf, bufs);
		// Filter results against baseResults for format legality
		// Only filter Pokemon, not other types like flags, types, abilities, etc.
		if (this.typedSearch && this.typedSearch.baseResults) {
			const legalSet = new Set<string>();
			for (const [type, id] of this.typedSearch.baseResults) { if (type !== 'header') { legalSet.add(id); } }
			this.results = this.results.filter(([type, id]) => {
				if (type === 'header' || type === 'html') return true;
				// Only apply legality filtering to Pokemon, not to filters like flags
				if (type === this.typedSearch!.searchType) return legalSet.has(id);
				return true;
			});
		}
		return this.results;
	}
	private instafilter(searchType: SearchType | '', fType: SearchType, fId: ID): SearchRow[] {
		let buf: SearchRow[] = [];
		let illegalBuf: SearchRow[] = [];
		let illegal = this.typedSearch?.illegalReasons;
		if (searchType === 'pokemon') {
			switch (fType) {
			case 'type':
				let type = fId.charAt(0).toUpperCase() + fId.slice(1) as Dex.TypeName;
				buf.push(['header', `${type}-type Pok\u00e9mon`]);
				for (let id in BattlePokedex) {
					if (!BattlePokedex[id].types) continue;
					if (this.dex.species.get(id).types.includes(type)) { (illegal && id in illegal ? illegalBuf : buf).push(['pokemon', id as ID]); }
				}
				break;
			case 'ability':
				let ability = Dex.abilities.get(fId).name;
				buf.push(['header', `${ability} Pok\u00e9mon`]);
				for (let id in BattlePokedex) {
					if (!BattlePokedex[id].abilities) continue;
					if (Dex.hasAbility(this.dex.species.get(id), ability)) { (illegal && id in illegal ? illegalBuf : buf).push(['pokemon', id as ID]); }
				}
				break;
			case 'flag':
				// Map flag IDs to tag names (Pokemon tags)
				const tagMap: {[id: string]: string} = {
					'legendary': 'Legendary',
					'restrictedlegendary': 'Restricted Legendary',
					'mythical': 'Mythical',
					'restrictedmythical': 'Restricted Mythical',
					'paradox': 'Paradox',
					'restrictedparadox': 'Restricted Paradox',
					'sublegendary': 'Sub-Legendary',
					'mega': 'Mega',
					'powerhouse': 'Powerhouse',
				};
				let flagName = tagMap[fId] || fId.charAt(0).toUpperCase() + fId.slice(1);
				buf.push(['header', `${flagName} Pok\u00e9mon`]);
				for (let id in BattlePokedex) {
					const species = this.dex.species.get(id);
					// Check tags array or special properties like isMega
					if ((species.tags && species.tags.includes(flagName)) || (flagName === 'Mega' && species.isMega)) { (illegal && id in illegal ? illegalBuf : buf).push(['pokemon', id as ID]); }
				}
				break;
			}
		} else if (searchType === 'move') {
			switch (fType) {
			case 'type':
				let type = fId.charAt(0).toUpperCase() + fId.slice(1);
				buf.push(['header', `${type}-type moves`]);
				for (let id in BattleMovedex) {
					const m: any = BattleMovedex[id];
					if (m.type === type || m.type2 === type) { (illegal && id in illegal ? illegalBuf : buf).push(['move', id as ID]); }
				}
				break;
			case 'category':
				let category = fId.charAt(0).toUpperCase() + fId.slice(1);
				buf.push(['header', `${category} moves`]);
				for (let id in BattleMovedex) { if (BattleMovedex[id].category === category) { (illegal && id in illegal ? illegalBuf : buf).push(['move', id as ID]); } }
				break;
			case 'flag':
				let flagName = BattleFlags && BattleFlags[fId] ? BattleFlags[fId].name : fId.charAt(0).toUpperCase() + fId.slice(1);
				buf.push(['header', `${flagName} moves`]);
				for (let id in BattleMovedex) {
					const move = BattleMovedex[id];
					if (move.flags && move.flags[fId]) { (illegal && id in illegal ? illegalBuf : buf).push(['move', id as ID]); }
				}
				break;
			}
		} else if (searchType === 'item') {
			switch (fType) {
			case 'itemclass' as any:
			const classId = BattleItemSearch.normalizeItemClass(fId === 'berries' ? 'berry' : fId);
			const className = BattleItemSearch.itemClassNames[classId] || classId;
			buf.push(['header', `${className} items`]);
			for (let id in BattleItems) {
				const item = this.dex.items.get(id);
				const itemClasses = BattleItemSearch.prototype.getItemClass(item);
				if (itemClasses.includes(classId)) { buf.push(['item', id as ID]); }
			}
			break;
			}
		}
		return [...buf, ...illegalBuf];
	}
	static getClosest(query: string) {
		// binary search through the index!
		let left = 0;
		let right = BattleSearchIndex.length - 1;
		while (right > left) {
			let mid = Math.floor((right - left) / 2 + left);
			if (BattleSearchIndex[mid][0] === query && (mid === 0 || BattleSearchIndex[mid - 1][0] !== query)) {
				// that's us
				return mid;
			} else if (BattleSearchIndex[mid][0] < query) {
				left = mid + 1;
			} else {
				right = mid - 1;
			}
		}
		if (left >= BattleSearchIndex.length - 1) left = BattleSearchIndex.length - 1;
		else if (BattleSearchIndex[left + 1][0] && BattleSearchIndex[left][0] < query) left++;
		if (left && BattleSearchIndex[left - 1][0] === query) left--;
		return left;
	}
}
//region Typed Search
abstract class BattleTypedSearch<T extends SearchType> {
	searchType: T;
	// Dex for the mod/generation to search.
	dex: ModdedDex = Dex;
	/**
	 * Format is the first of two base filters. It constrains results to things
	 * legal in the format, and affects the default sort.
	 * This string specifically normalizes out generation number and the words
	 * "Doubles" and "Let's Go" from the name.
	 */
	format = '' as ID;
	// `species` is the second of two base filters. It constrains results to things that species can use, and affects the default sort.
	species = '' as ID;
	/**
	 * `set` is a pseudo-base filter; it has minor effects on move sorting.
	 * (Abilities/items can affect what moves are sorted as usable.)
	 */
	set: Dex.PokemonSet | null = null;
	protected formatType: 'doubles' | 'bdsp' | 'bdspdoubles' | 'rs' | 'bw1' | 'letsgo' | 'metronome' | 'natdex' | 'nfe' |
		'ssdlc1' | 'ssdlc1doubles' | 'predlc' | 'predlcdoubles' | 'predlcnatdex' | 'svdlc1' | 'svdlc1doubles' |
		'svdlc1natdex' | 'stadium' | 'lc' | 'indigostarstorm' | null = null;
	isDoubles = false;

	// Cached copy of what the results list would be with only base filters (i.e. with an empty `query` and `filters`)
	baseResults: SearchRow[] | null = null;
	// Cached copy of all results not in `baseResults` - mostly in case a user is wondering why a specific result isn't showing up.
	baseIllegalResults: SearchRow[] | null = null;
	illegalReasons: { [id: string]: string } | null = null;
	results: SearchRow[] | null = null;
	protected readonly sortRow: SearchRow | null = null;
	constructor(searchType: T, format = '' as ID, speciesOrSet: ID | Dex.PokemonSet = '' as ID) {
		this.searchType = searchType;
		this.baseResults = null;
		this.baseIllegalResults = null;

		if (format.startsWith('gen')) {
			const gen = (Number(format.charAt(3)) || 6);
			format = (format.slice(4) || 'customgame') as ID;
			this.dex = Dex.forGen(gen);
		} else if (!format) { this.dex = Dex; }

		if (format.startsWith('dlc1') && this.dex.gen === 8) {
			if (format.includes('doubles')) {
				this.formatType = 'ssdlc1doubles';
				this.isDoubles = true;
			} else { this.formatType = 'ssdlc1'; }
			format = format.slice(4) as ID;
		}
		if (format.startsWith('predlc')) {
			if (format.includes('doubles') && !format.includes('nationaldex')) {
				this.formatType = 'predlcdoubles';
				this.isDoubles = true;
			} else if (format.includes('nationaldex')) { this.formatType = 'predlcnatdex'; } 
			else { this.formatType = 'predlc'; }
			format = format.slice(6) as ID;
		}
		if (format.startsWith('dlc1') && this.dex.gen === 9) {
			if (format.includes('doubles') && !format.includes('nationaldex')) {
				this.formatType = 'svdlc1doubles';
				this.isDoubles = true;
			} else if (format.includes('nationaldex')) { this.formatType = 'svdlc1natdex'; }
			 else { this.formatType = 'svdlc1'; }
			format = format.slice(4) as ID;
		}
		if (format.startsWith('stadium')) {
			this.formatType = 'stadium';
			format = format.slice(7) as ID;
			if (!format) format = 'ou' as ID;
		}
		if (format.startsWith('vgc')) {
			this.formatType = 'doubles';
			this.isDoubles = true;
		}
		if (format === 'vgc2020') { this.formatType = 'ssdlc1doubles'; }
		if (format.startsWith('vgc2023')) { this.formatType = format.endsWith('rege') ? 'svdlc1doubles' : 'predlcdoubles'; }
		if (format.includes('bdsp')) {
			if (format.includes('doubles')) {
				this.formatType = 'bdspdoubles';
				this.isDoubles = true;
			} else { this.formatType = 'bdsp'; }
			format = format.slice(4) as ID;
			this.dex = Dex.mod('gen8bdsp' as ID);
		}
		if (format.includes('bw1')) {
			this.formatType = 'bw1';
			this.dex = Dex.mod('gen5bw1' as ID);
		}
		if (format.includes('adv200')) {
			this.formatType = 'rs';
			this.dex = Dex.mod('gen3rs' as ID);
		}
		if (format === 'partnersincrime') this.formatType = 'doubles';
		if (format.startsWith('ffa') || format === 'freeforall') this.formatType = 'doubles';
		if (format.includes('letsgo')) {
			this.formatType = 'letsgo';
			this.dex = Dex.mod('gen7letsgo' as ID);
		}
		// must happen AFTER the "gen9" stripping block, so format is like "indigostarstormou" or "indigostarstorm"
// must happen AFTER the "gen9" stripping block
const normalizedFormat = toID(format);

if (normalizedFormat.includes('indigostarstorm') || normalizedFormat.includes('isl')) {
	console.log('[DEBUG] ISL format detected, original format:', format, 'normalized:', normalizedFormat);
	this.formatType = 'indigostarstorm';
	this.dex = Dex.mod('gen9indigostarstorm' as ID);

	// strip the ISL marker if it is being used as a prefix
	if (normalizedFormat.startsWith('indigostarstorm')) {
		format = normalizedFormat.slice('indigostarstorm'.length) as ID;
	} else if (normalizedFormat.startsWith('isl')) {
		format = normalizedFormat.slice('isl'.length) as ID;
	} else {
		// if ISL appears later in the format id/name, keep the original tier fallback
		format = normalizedFormat as ID;
	}

	if (!format) format = 'ou' as ID;
}
		if (format.includes('nationaldex') || format.startsWith('nd') || format.includes('natdex')) {
			format = (format.startsWith('nd') ? format.slice(2) : format.includes('natdex') ? format.slice(6) : format.slice(11)) as ID;
			this.formatType = 'natdex';
			if (!format) format = 'ou' as ID;
			this.isDoubles = format.includes('doubles');
		}
		if (format.includes('doubles') && this.dex.gen > 4 && !this.formatType) {
			this.formatType = 'doubles';
			this.isDoubles = true;
		}
		if (this.formatType === 'letsgo') format = format.slice(6) as ID;
		if (format.includes('metronome')) {
			this.formatType = 'metronome';
		}
		if (format.endsWith('nfe')) {
			format = format.slice(3) as ID;
			this.formatType = 'nfe';
			if (!format) format = 'ou' as ID;
		}
		if ((format.endsWith('lc') || format.startsWith('lc')) && format !== 'caplc' && !this.formatType) {
			this.formatType = 'lc';
			format = 'lc' as ID;
		}
		if (format.endsWith('draft')) {
			format = format.slice(0, -5) as ID;
			if (!format) format = 'anythinggoes' as ID;
		}
		this.format = format;
		this.species = '' as ID;
		this.set = null;
		if (typeof speciesOrSet === 'string') {
			if (speciesOrSet) this.species = speciesOrSet;
		} else {
			this.set = speciesOrSet;
			this.species = toID(this.set.species);
		}
		// if (!searchType || !this.set) return;
	}
	getResults(filters?: SearchFilter[] | null, sortCol?: string | null, reverseSort?: boolean): SearchRow[] {
		if (sortCol === 'type') { return [this.sortRow!, ...BattleTypeSearch.prototype.getDefaultResults.call(this, reverseSort)]; } 
		
		else if (sortCol === 'category') { return [this.sortRow!, ...BattleCategorySearch.prototype.getDefaultResults.call(this, reverseSort)]; } 
		else if (sortCol === 'ability') { return [this.sortRow!, ...BattleAbilitySearch.prototype.getDefaultResults.call(this, reverseSort)]; } 
		else if (sortCol === 'flag') { return [this.sortRow!, ...BattleFlagSearch.prototype.getDefaultResults.call(this, reverseSort)]; }
		if (!this.baseResults) { this.baseResults = this.getBaseResults(); }
		if (!this.baseIllegalResults) {
			const legalityFilter: { [id: string]: 1 } = {};
			for (const [resultType, value] of this.baseResults) { if (resultType === this.searchType) legalityFilter[value] = 1; }
			this.baseIllegalResults = [];
			this.illegalReasons = {};
			for (const id in this.getTable()) {
				if (!(id in legalityFilter)) {
					this.baseIllegalResults.push([this.searchType, id as ID]);
					this.illegalReasons[id] = 'Illegal';
				}
			}
		}
		let results: SearchRow[];
		let illegalResults: SearchRow[] | null;
		if (filters) {
			results = [];
			illegalResults = [];
			for (const result of this.baseResults) {
				if (this.filter(result, filters)) {
					if (results.length && result[0] === 'header' && results[results.length - 1][0] === 'header') { results[results.length - 1] = result; } 
					else { results.push(result); }
				}
			}
			if (results.length && results[results.length - 1][0] === 'header') { results.pop(); }
			for (const result of this.baseIllegalResults) { if (this.filter(result, filters)) { illegalResults.push(result); } }
		} else {
			results = [...this.baseResults];
			illegalResults = null;
		}
		if (this.defaultFilter) { results = this.defaultFilter(results); }
		if (sortCol) {
			results = results.filter(([rowType]) => rowType === this.searchType);
			results = this.sort(results, sortCol, reverseSort);
			if (illegalResults) {
				illegalResults = illegalResults.filter(([rowType]) => rowType === this.searchType);
				illegalResults = this.sort(illegalResults, sortCol, reverseSort);
			}
		}
		if (this.sortRow) { results = [this.sortRow, ...results]; }
		if (illegalResults?.length) { results = [...results, ['header', "Illegal results"], ...illegalResults]; }
		return results;
	}
	protected firstLearnsetid(speciesid: ID) {
		let table = BattleTeambuilderTable;
		if (this.formatType?.startsWith('bdsp')) table = table['gen8bdsp'];
		if (this.formatType === 'letsgo') table = table['gen7letsgo'];
		if (this.formatType === 'bw1') table = table['gen5bw1'];
		if (this.formatType === 'rs') table = table['gen3rs'];
		if ((this.formatType as any) === 'indigostarstorm') table = table['gen9indigostarstorm'];
		if (table && table.learnsets && speciesid in table.learnsets) return speciesid;
		const species = this.dex.species.get(speciesid);
		if (!species.exists) return '' as ID;
		let baseLearnsetid = toID(species.baseSpecies);
		if (typeof species.battleOnly === 'string' && species.battleOnly !== species.baseSpecies) { baseLearnsetid = toID(species.battleOnly); }
		if (table && table.learnsets && baseLearnsetid in table.learnsets) return baseLearnsetid;
		return '' as ID;
	}
	protected nextLearnsetid(learnsetid: ID, speciesid: ID, checkingMoves = false) {
		if (learnsetid === 'lycanrocdusk' || (speciesid === 'rockruff' && learnsetid === 'rockruff')) { return 'rockruffdusk' as ID; }
		const lsetSpecies = this.dex.species.get(learnsetid);
		if (!lsetSpecies.exists) return '' as ID;
		if (lsetSpecies.id === 'gastrodoneast') return 'gastrodon' as ID;
		if (lsetSpecies.id === 'pumpkaboosuper') return 'pumpkaboo' as ID;
		if (lsetSpecies.id === 'sinisteaantique') return 'sinistea' as ID;
		if (lsetSpecies.id === 'tatsugiristretchy') return 'tatsugiri' as ID;
		const next = lsetSpecies.battleOnly || lsetSpecies.changesFrom || lsetSpecies.prevo;
		if (next) return toID(next);
		if (checkingMoves && !lsetSpecies.prevo && lsetSpecies.baseSpecies && this.dex.species.get(lsetSpecies.baseSpecies).prevo) {
			let baseEvo = this.dex.species.get(lsetSpecies.baseSpecies);
			while (baseEvo.prevo) { baseEvo = this.dex.species.get(baseEvo.prevo); }
			return toID(baseEvo);
		}
		return '' as ID;
	}
	protected canLearn(speciesid: ID, moveid: ID) {
		const move = this.dex.moves.get(moveid);
		if (this.formatType === 'natdex' && move.isNonstandard && move.isNonstandard !== 'Past') { return false; }
		const gen = this.dex.gen;
		let genChar = `${gen}`;
		if (
			this.format.startsWith('vgc') ||
			this.format.startsWith('bss') ||
			this.format.startsWith('battlespot') ||
			this.format.startsWith('battlestadium') ||
			this.format.startsWith('battlefestival') ||
			(this.dex.gen === 9 && this.formatType !== 'natdex')
		) {
			if (gen === 9) { genChar = 'a'; } 
			else if (gen === 8) { genChar = 'g'; } 
			else if (gen === 7) { genChar = 'q'; } 
			else if (gen === 6) { genChar = 'p'; }
		}
		console.log('[DEBUG canLearn]', {speciesid, moveid, gen, genChar, formatType: this.formatType});
		let learnsetid = this.firstLearnsetid(speciesid);
		console.log('[DEBUG canLearn] firstLearnsetid:', learnsetid);
		while (learnsetid) {
			let table = BattleTeambuilderTable;
			if (this.formatType?.startsWith('bdsp')) table = table['gen8bdsp'];
			if (this.formatType === 'letsgo') table = table['gen7letsgo'];
			if (this.formatType === 'bw1') table = table['gen5bw1'];
			if (this.formatType === 'rs') table = table['gen3rs'];
			if ((this.formatType as any) === 'indigostarstorm') table = table['gen9indigostarstorm'];
			if (!table || !table.learnsets) {
				console.log('[DEBUG canLearn] No table or learnsets');
				break;
			}
			let learnset = table.learnsets[learnsetid];
			console.log('[DEBUG canLearn] learnset for', learnsetid, ':', learnset ? Object.keys(learnset).slice(0, 5) : 'undefined');
			if (learnset && moveid in learnset) { console.log('[DEBUG canLearn] Move found!', moveid, 'data:', learnset[moveid], 'checking for genChar:', genChar); }
			const eggMovesOnly = this.eggMovesOnly(learnsetid, speciesid);
			if (learnset && (moveid in learnset) && (!this.format.startsWith('tradebacks') ? learnset[moveid].includes(genChar) :
				learnset[moveid].includes(genChar) || (learnset[moveid].includes(`${gen + 1}`) && move.gen === gen)) && (!eggMovesOnly || (learnset[moveid].includes('e') && this.dex.gen === 9))
			) { return true; }
			learnsetid = this.nextLearnsetid(learnsetid, speciesid, true);
		}
		return false;
	}
	getTier(pokemon: Dex.Species) {
		if (this.formatType === 'metronome') { return pokemon.num >= 0 ? String(pokemon.num) : pokemon.tier; }
		let table = window.BattleTeambuilderTable;
		const gen = this.dex.gen;
		const tableKey = this.formatType === 'doubles' ? `gen${gen}doubles` :
			this.formatType === 'letsgo' ? 'gen7letsgo' :
			this.formatType === 'bdsp' ? 'gen8bdsp' :
			this.formatType === 'bdspdoubles' ? 'gen8bdspdoubles' :
			this.formatType === 'bw1' ? 'gen5bw1' :
			this.formatType === 'rs' ? 'gen3rs' :
			(this.formatType as any) === 'indigostarstorm' ? 'gen9indigostarstorm' :
			this.formatType === 'nfe' ? `gen${gen}nfe` :
			this.formatType === 'lc' ? `gen${gen}lc` :
			this.formatType === 'ssdlc1' ? 'gen8dlc1' :
			this.formatType === 'ssdlc1doubles' ? 'gen8dlc1doubles' :
			this.formatType === 'predlc' ? 'gen9predlc' :
			this.formatType === 'predlcdoubles' ? 'gen9predlcdoubles' :
			this.formatType === 'predlcnatdex' ? 'gen9predlcnatdex' :
			this.formatType === 'svdlc1' ? 'gen9dlc1' :
			this.formatType === 'svdlc1doubles' ? 'gen9dlc1doubles' :
			this.formatType === 'svdlc1natdex' ? 'gen9dlc1natdex' :
			this.formatType === 'natdex' ? `gen${gen}natdex` :
			this.formatType === 'stadium' ? `gen${gen}stadium${gen > 1 ? gen : ''}` :
			(this.formatType as any) === 'indigostarstorm' ? 'gen9indigostarstorm' :
			`gen${gen}`;
		if (table?.[tableKey]) { table = table[tableKey]; }
		if (!table || !table.overrideTier) return pokemon.tier;
		let id = pokemon.id;
		if (id in table.overrideTier) { return table.overrideTier[id]; }
		if (id.endsWith('totem') && id.slice(0, -5) in table.overrideTier) { return table.overrideTier[id.slice(0, -5)]; }
		id = toID(pokemon.baseSpecies);
		if (id in table.overrideTier) { return table.overrideTier[id]; }
		return pokemon.tier;
	}
	eggMovesOnly(child: ID, father: ID) {
		if (this.dex.species.get(child).baseSpecies === this.dex.species.get(father).baseSpecies) return false;
		const baseSpecies = father;
		while (father) {
			if (child === father) return false;
			father = this.nextLearnsetid(father, baseSpecies);
		}
		return true;
	}
	abstract getTable(): { [id: string]: any };
	abstract getDefaultResults(): SearchRow[];
	abstract getBaseResults(): SearchRow[];
	abstract filter(input: SearchRow, filters: string[][]): boolean;
	defaultFilter?(input: SearchRow[]): SearchRow[];
	abstract sort(input: SearchRow[], sortCol: string, reverseSort?: boolean): SearchRow[];
	
}
//region Pokemon Search
class BattlePokemonSearch extends BattleTypedSearch<'pokemon'> {
	override sortRow: SearchRow = ['sortpokemon', ''];
	private getISLDisplaySpecies(species: Dex.Species): Dex.Species {
		const base = this.dex.species.get(species.baseSpecies || species.name);
		if (!base?.exists) return species;

		if (
			species.name !== base.name &&
			Array.isArray(base.cosmeticFormes) &&
			base.cosmeticFormes.includes(species.name)
		) {
			return base;
		}

		return species;
	}
	private static readonly ISL_TIER_ORDER = [
		'Reg α', 'Reg Δ', 'Reg ι', 'Reg β', 'Reg ζ', 'Reg γ',
		'Reg Θ', 'Reg ε', 'Reg λ', 'Reg ψ', 'Reg ν', 'Reg φ',
	] as const;
	private static readonly ISL_TIER_DISPLAY: {[k: string]: string} = {
		'Reg α': 'Reg α [Alpha]',
		'Reg Δ': 'Reg Δ [Delta]',
		'Reg ι': 'Reg ι [Iota]',
		'Reg β': 'Reg β [Beta]',
		'Reg ζ': 'Reg ζ [Zeta]',
		'Reg γ': 'Reg γ [Gamma]',
		'Reg Θ': 'Reg Θ [Theta]',
		'Reg ε': 'Reg ε [Epsilon]',
		'Reg λ': 'Reg λ [Lambda]',
		'Reg ψ': 'Reg ψ [Psi]',
		'Reg ν': 'Reg ν [Nu]',
		'Reg φ': 'Reg φ [Phi]',
	};
	private static readonly ISL_ALLOWED_TIERS: {[k: string]: string[]} = {
		'Reg α': ['Reg α'],
		'Reg Δ': ['Reg α', 'Reg Δ'],
		'Reg ι': ['Reg ι'],
		'Reg β': ['Reg α', 'Reg Δ', 'Reg ι', 'Reg β'],
		'Reg ζ': ['Reg α', 'Reg Δ', 'Reg ι', 'Reg β', 'Reg ζ'],
		'Reg γ': ['Reg α', 'Reg Δ', 'Reg ι', 'Reg β', 'Reg ζ', 'Reg γ'],
		'Reg Θ': ['Reg α', 'Reg Δ', 'Reg ι', 'Reg β', 'Reg ζ', 'Reg γ', 'Reg Θ'],
		'Reg ε': ['Reg α', 'Reg Δ', 'Reg ι', 'Reg β', 'Reg ζ', 'Reg γ', 'Reg Θ', 'Reg ε'],
		'Reg λ': ['Reg α', 'Reg Δ', 'Reg ι', 'Reg β', 'Reg ζ', 'Reg γ', 'Reg Θ', 'Reg ε', 'Reg λ'],
		'Reg ψ': ['Reg α', 'Reg Δ', 'Reg ι', 'Reg β', 'Reg ζ', 'Reg γ', 'Reg Θ', 'Reg ε', 'Reg λ', 'Reg ψ'],
		'Reg ν': ['Reg α', 'Reg Δ', 'Reg ι', 'Reg β', 'Reg ζ', 'Reg γ', 'Reg Θ', 'Reg ε', 'Reg λ', 'Reg ψ', 'Reg ν'],
		'Reg φ': ['Reg α', 'Reg Δ', 'Reg ι', 'Reg β', 'Reg ζ', 'Reg γ', 'Reg Θ', 'Reg ε', 'Reg λ', 'Reg ψ', 'Reg ν', 'Reg φ'],
	};
	private getCurrentISLTier(format: ID): string {
		return (
			format.includes('babyleague') ? 'Reg α' :
			format.includes('nfeleague') ? 'Reg Δ' :
			format.includes('singlestageonly') ? 'Reg ι' :
			format.includes('2ndstageleague') ? 'Reg β' :
			(format.includes('betaparadox') || (format.includes('beta') && format.includes('paradox'))) ? 'Reg ζ' :
			format.includes('3rdstageleague') ? 'Reg γ' :
			(format.includes('norestricted') || format.includes('norestrictedspecial')) ? 'Reg Θ' :
			format.includes('restrictedparadox') ? 'Reg ε' :
			(format.includes('onerestricted') && format.includes('mythical')) ? 'Reg ν' :
			(format.includes('tworestricted') && format.includes('mythical')) ? 'Reg φ' :
			format.includes('onerestricted') ? 'Reg λ' :
			format.includes('tworestricted') ? 'Reg ψ' :
			'Reg γ'
		);
	}
	private getAllowedISLTiers(format: ID): Set<string> {
		const currentTier = this.getCurrentISLTier(format);
		return new Set(BattlePokemonSearch.ISL_ALLOWED_TIERS[currentTier] || ['Reg γ']);
	}
	private isISLMegaForm(species: Dex.Species): boolean {
		const name = species.name;
		return (
			name.endsWith('-Mega') ||
			name.endsWith('-Mega-X') ||
			name.endsWith('-Mega-Y') ||
			name.endsWith('-Mega-Z')
		);
	}
	private isHiddenFromISLClientDex(species: Dex.Species, base: Dex.Species, tier: string): boolean {
		const ns = species.isNonstandard || base.isNonstandard;
		if (ns === 'CAP' || tier.startsWith('CAP')) return true;
		if (ns === 'Pokestar' || species.id.startsWith('pokestar')) return true;
		if (ns === 'Past' || ns === 'Gigantamax') return true;
		if (species.name === 'Pikachu-Starter' || species.name === 'Eevee-Starter') return true;
		if (species.battleOnly && species.name !== species.baseSpecies) return true;
		return false;
	}
	private getISLClientLegalityInfo(species: Dex.Species, format: ID) {
	const base = this.dex.species.get(species.baseSpecies || species.name);
	if (!species.exists || !base?.exists) return null;
	if (species.num === 0 || base.num === 0) return null;

	const tier = this.getTier(species);
	const allowedTiers = this.getAllowedISLTiers(format);
	if (!allowedTiers.has(tier)) return null;

	if (species.num < 13000 && this.isHiddenFromISLClientDex(species, base, tier)) return null;

	const exemptFromSpecialSections =
		species.name === 'Cosmog' ||
		species.name === 'Cosmoem' ||
		species.name === 'Calyrex' ||
		species.name === 'Phione';

	if (this.isISLMegaForm(species)) {
		return {tier, sectionCandidates: ['Mega Forms']};
	}

	const isRestrictedLegendary =
		(!!species.tags?.includes('Restricted Legendary') ||
			tier === 'Reg λ' ||
			tier === 'Reg ψ') &&
		!exemptFromSpecialSections;

	const isRestrictedParadox =
		(tier === 'Reg ε' ||
			!!species.tags?.includes('Restricted Paradox')) &&
		!exemptFromSpecialSections;

	const isRestrictedMythical =
		(tier === 'Reg ν' ||
			tier === 'Reg φ' ||
			!!species.tags?.includes('Restricted Mythical')) &&
		!exemptFromSpecialSections;

	const isLegendary =
		(!!species.tags?.includes('Legendary') || tier === 'Reg Θ') &&
		!isRestrictedLegendary &&
		!isRestrictedParadox &&
		!isRestrictedMythical &&
		!exemptFromSpecialSections;

	const isMythical =
		!!species.tags?.includes('Mythical') &&
		!isRestrictedMythical &&
		!exemptFromSpecialSections;

	const sectionCandidates: string[] = [];

	// Higher -> lower special sections.
	if (isRestrictedLegendary) sectionCandidates.push('Restricted Legendary Pokémon');
	if (isRestrictedParadox) sectionCandidates.push('Restricted Paradox Pokémon');
	if (isRestrictedMythical) sectionCandidates.push('Restricted Mythical Pokémon');
	if (isLegendary) sectionCandidates.push('Legendary Pokémon');
	if (isMythical) sectionCandidates.push('Mythical Pokémon');

	// Always fall back to the normal tier pool.
	sectionCandidates.push(tier);

	return {tier, sectionCandidates};
}
	getTable() { return BattlePokedex; }
	getDefaultResults(): SearchRow[] {
		let results: SearchRow[] = [];
		for (let id in BattlePokedex) {
			switch (id) {
			case 'bulbasaur': results.push(['header', "Generation 1"]);
				break;
			case 'chikorita': results.push(['header', "Generation 2"]);
				break;
			case 'treecko': results.push(['header', "Generation 3"]);
				break;
			case 'turtwig': results.push(['header', "Generation 4"]);
				break;
			case 'victini': results.push(['header', "Generation 5"]);
				break;
			case 'chespin': results.push(['header', "Generation 6"]);
				break;
			case 'rowlet': results.push(['header', "Generation 7"]);
				break;
			case 'grookey': results.push(['header', "Generation 8"]);
				break;
			case 'sprigatito': results.push(['header', "Generation 9"]);
				continue;
			}
			results.push(['pokemon', id as ID]);
		}
		return results;
	}
	getBaseResults(): SearchRow[] {
		const format = this.format;
		if (!format) return this.getDefaultResults();
		const isVGCOrBS = format.startsWith('battlespot') || format.startsWith('bss') || format.startsWith('battlestadium') || format.startsWith('vgc');
		const isHackmons = format.includes('hackmons') || format.endsWith('bh');
		let isDoublesOrBS = isVGCOrBS || this.formatType?.includes('doubles');
		const dex = this.dex;
		let table = BattleTeambuilderTable;
		if ((format.endsWith('cap') || format.endsWith('caplc')) && dex.gen < 9) { table = table[`gen${dex.gen}`]; } 
		else if (isVGCOrBS) { table = table[`gen${dex.gen}vgc`]; } 
		else if (dex.gen === 9 && isHackmons && !this.formatType) { table = table['bh']; } 
		else if (
			table[`gen${dex.gen}doubles`] && dex.gen > 4 &&
			this.formatType !== 'letsgo' && this.formatType !== 'bdspdoubles' &&
			this.formatType !== 'ssdlc1doubles' && this.formatType !== 'predlcdoubles' &&
			this.formatType !== 'svdlc1doubles' && this.formatType !== 'indigostarstorm' &&
			!this.formatType?.includes('natdex') &&
			(
				format.includes('doubles') || format.includes('triples') ||
				format === 'freeforall' || format.startsWith('ffa') ||
				format === 'partnersincrime'
			)
		) {
			table = table[`gen${dex.gen}doubles`];
			isDoublesOrBS = true;
		} 
		else if (dex.gen < 9 && !this.formatType) { table = table[`gen${dex.gen}`]; } 
		else if (this.formatType?.startsWith('bdsp')) { table = table['gen8' + this.formatType]; } 
		else if (this.formatType === 'letsgo') { table = table['gen7letsgo']; } 
		else if (this.formatType === 'bw1') { table = table['gen5bw1']; } 
		else if (this.formatType === 'rs') { table = table['gen3rs']; } 
		else if (this.formatType === 'natdex') { table = table[`gen${dex.gen}natdex`]; } 
		else if (this.formatType === 'metronome') { table = table[`gen${dex.gen}metronome`]; } 
		else if (this.formatType === 'nfe') { table = table[`gen${dex.gen}nfe`]; } 
		else if (this.formatType === 'lc') { table = table[`gen${dex.gen}lc`]; } 
		else if (this.formatType?.startsWith('ssdlc1')) {
			if (this.formatType.includes('doubles')) { table = table['gen8dlc1doubles']; } 
			else { table = table['gen8dlc1']; }
		} else if (this.formatType?.startsWith('predlc')) {
			if (this.formatType.includes('doubles')) { table = table['gen9predlcdoubles']; } 
			else if (this.formatType.includes('natdex')) { table = table['gen9predlcnatdex']; } 
			else { table = table['gen9predlc']; }
		} else if (this.formatType?.startsWith('svdlc1')) {
			if (this.formatType.includes('doubles')) { table = table['gen9dlc1doubles']; } 
			else if (this.formatType.includes('natdex')) { table = table['gen9dlc1natdex']; } 
			else { table = table['gen9dlc1']; }
		} else if ((this.formatType as any) === 'indigostarstorm') {
			table = table['gen9indigostarstorm'];
			console.log('[DEBUG] Loading gen9indigostarstorm table, table exists:', !!table, 'has tiers:', !!table?.tiers, 'has formatSlices:', !!table?.formatSlices, 'slice keys:', Object.keys(table?.formatSlices || {}));
			if (!table) {
				console.error('[DEBUG] gen9indigostarstorm table not found. ISL teambuilder will be empty.');
				table = { tierSet: [], formatSlices: {} } as any;
			}
		}
		if (!table || !table.tierSet) {
			if (table && table.tiers) {
				table.tierSet = table.tiers.map((r: any) => {
					if (typeof r === 'string') return ['pokemon', r];
					return [r[0], r[1]];
				});
				if ((this.formatType as any) !== 'indigostarstorm') table.tiers = null;
			} else {
				// If table doesn't have tiers, create an empty tierSet
				console.log('[DEBUG] Table has no tiers, creating empty tierSet');
				if (!table) table = {};
				table.tierSet = [];
			}
		}
			table.tierSet = (table.tierSet || []).filter(([type, id]: any) => {
		// Keep real structural rows only
		if (type === 'header' || type === 'html' || type === 'sortpokemon' || type === 'sortmove' || type === 'sortitem') return true;

		// Treat EVERYTHING ELSE as a pokemon row if it resolves to a species id.
		// (This is the same pipeline Gmax/Past go through.)
		const sp = this.dex.species.get(id);
		if (!sp || !sp.exists) return false;

		// Allow customs
		if (sp.num >= 10000 || sp.num < 0) return true;

		const bs = this.dex.species.get(sp.baseSpecies || sp.name);
		const ns = sp.isNonstandard || bs.isNonstandard;
		const tier = this.getTier(sp as any);
		if (tier.startsWith('CAP')) console.log('[ISL FILTER] dropping', id, tier);
		// Filter-out like other banned groups
		if (tier.startsWith('CAP')) return false;
		if (id.startsWith('pokestar')) return false;
		if (sp.num === 0 || bs.num === 0) return false;

		return ns !== 'Past' && ns !== 'Gigantamax';
	});
		let tierSet: SearchRow[] = table.tierSet;
		let slices: { [k: string]: number } = table.formatSlices || {};
		// ISL: derive the list from the Indigo Starstorm mod dex itself (what "exists" in the mod).
		// ISL: derive the teambuilder list from the Indigo Starstorm mod dex itself, AND apply regulation-stage rules based on the format string.
		if ((this.formatType as any) === 'indigostarstorm') {
			const currentTier = this.getCurrentISLTier(format);
			const allowedTiers = this.getAllowedISLTiers(format);
			const standardTierOrder = ['Reg α', 'Reg Δ', 'Reg ι', 'Reg β', 'Reg ζ', 'Reg γ'];
			const visibleTierOrder = standardTierOrder
				.filter(tier => allowedTiers.has(tier))
				.reverse();
			const specialSections = [
				'Restricted Legendary Pokémon',
				'Restricted Paradox Pokémon',
				'Restricted Mythical Pokémon',
				'Legendary Pokémon',
				'Mythical Pokémon',
			];
			const sectionOrder = [
				...specialSections,
				...visibleTierOrder,
				'Mega Forms',
			];
			const bySection: {[k: string]: Dex.Species[]} = Object.create(null);
for (const section of sectionOrder) bySection[section] = [];

const classified: {species: Dex.Species; sectionCandidates: string[]}[] = [];
const seenSpecies = new Set<string>();

for (const row of this.getDefaultResults()) {
	if (row[0] !== 'pokemon') continue;

	const rawSpecies = this.dex.species.get(row[1]);
	if (!rawSpecies?.exists) continue;

	const species = this.getISLDisplaySpecies(rawSpecies);
	if (seenSpecies.has(species.id)) continue;
	seenSpecies.add(species.id);

	const info = this.getISLClientLegalityInfo(species, format);
	if (!info) continue;

	classified.push({
		species,
		sectionCandidates: [...info.sectionCandidates],
	});
}
			// Resolve overlaps across the top special sections.
			// A mon defaults to the lower section unless the higher section has
			// at least one member that is unique to that higher section.
			const remaining = classified.slice();

			for (let s = 0; s < specialSections.length; s++) {
				const section = specialSections[s];
				const contenders: {species: Dex.Species; sectionCandidates: string[]}[] = [];

				for (let i = 0; i < remaining.length; i++) {
					const entry = remaining[i];
					if (entry.sectionCandidates[0] === section) contenders.push(entry);
				}
				if (!contenders.length) continue;

				let hasExclusiveMember = false;
				for (let i = 0; i < contenders.length; i++) {
					const next = contenders[i].sectionCandidates[1];
					if (!next || specialSections.indexOf(next) < 0) {
						hasExclusiveMember = true;
						break;
					}
				}

				if (hasExclusiveMember) {
					for (let i = 0; i < contenders.length; i++) {
						bySection[section].push(contenders[i].species);
					}
					for (let i = remaining.length - 1; i >= 0; i--) {
						if (remaining[i].sectionCandidates[0] === section) remaining.splice(i, 1);
					}
				} else {
					for (let i = 0; i < contenders.length; i++) {
						contenders[i].sectionCandidates.shift();
					}
					s--;
				}
			}
			// Everything left goes to its current best remaining section.
			for (const entry of remaining) {
				const section = entry.sectionCandidates[0];
				if (!section) continue;
				(bySection[section] ||= []).push(entry.species);
			}
			const results: SearchRow[] = [];
			for (const section of sectionOrder) {
				const bucket = bySection[section];
				if (!bucket?.length) continue;
				const label = BattlePokemonSearch.ISL_TIER_DISPLAY[section] || section;
				results.push(['header', label]);
				for (const species of bucket) { results.push(['pokemon', species.id]); }
			}
			return results;
		}
		if (format === 'ubers' || format === 'uber' || format === 'ubersuu' || format === 'nationaldexdoubles') { tierSet = tierSet.slice(slices.Uber); } 
		else if (isVGCOrBS || (isHackmons && dex.gen === 9 && !this.formatType)) {
			if (format.endsWith('series13') || format.endsWith('regj') || isHackmons) { } // Show Mythicals
			else if (
				format === 'vgc2010' || format === 'vgc2016' || format.startsWith('vgc2019') ||
				format === 'vgc2022' || format.endsWith('regg') || format.endsWith('regi')
			) { tierSet = tierSet.slice(slices["Restricted Legendary"]); } 
			else { tierSet = tierSet.slice(slices.Regular); }
			// Remove DLC Pokemon from Pre-DLC formats
			if (this.formatType?.includes('dlc')) { tierSet = tierSet.filter(([type, id]) => { return !['Unreleased', 'Illegal'].includes(this.getTier(this.dex.species.get(id))); }); }

			if (format.endsWith('regh')) {
				tierSet = tierSet.filter(([type, id]) => {
					const tags = this.dex.species.get(this.dex.species.get(id).baseSpecies).tags;
					return !tags.includes('Sub-Legendary') && !tags.includes('Paradox')
				});
			}
		} else if (format === 'ou') tierSet = tierSet.slice(slices.OU);
		else if (format === 'uubl') tierSet = tierSet.slice(slices.UUBL);
		else if (format === 'uu') tierSet = tierSet.slice(slices.UU);
		else if (format === 'ru') tierSet = tierSet.slice(slices.RU || slices.UU);
		else if (format === 'nu') tierSet = tierSet.slice(slices.NU || slices.RU || slices.UU);
		else if (format === 'pu') tierSet = tierSet.slice(slices.PU || slices.NU);
		else if (format === 'zu' && dex.gen === 5) tierSet = tierSet.slice(slices.PU || slices.NU);
		else if (format === 'zu') tierSet = tierSet.slice(slices.ZU || slices.PU || slices.NU);
		else if ( format === 'lc' || format === 'lcuu' || format.startsWith('lc') || (format !== 'caplc' && format.endsWith('lc')) ) tierSet = tierSet.slice(slices.LC);
		else if (format === 'cap' || format.endsWith('cap')) { tierSet = tierSet.slice(0, slices.AG || slices.Uber).concat(tierSet.slice(slices.OU)); } 
		else if (format === 'caplc') { tierSet = tierSet.slice(slices['CAP LC'], slices.AG || slices.Uber).concat(tierSet.slice(slices.LC)); } 
		else if (format === 'anythinggoes' || format.endsWith('ag') || format.startsWith('ag')) { tierSet = tierSet.slice(slices.AG); } 
		else if (isHackmons && (dex.gen < 9 || this.formatType === 'natdex')) { tierSet = tierSet.slice(slices.AG || slices.Uber); } 
		else if (format === 'monotype' || format.startsWith('monothreat')) tierSet = tierSet.slice(slices.Uber);
		else if (format === 'doublesubers') tierSet = tierSet.slice(slices.DUber);
		else if (format === 'doublesou' && dex.gen > 4) tierSet = tierSet.slice(slices.DOU);
		else if (format === 'doublesuu') tierSet = tierSet.slice(slices.DUU);
		else if (this.formatType === 'indigostarstorm') {
			console.log('[DEBUG] ISL format detected. Format string:', format, 'Available slices:', Object.keys(slices || {}));
			// Defensive: slices must exist and have Reg α, otherwise don't attempt slicing
			if (!slices || slices['Reg α'] === undefined) {
				console.log('[DEBUG] ISL: formatSlices missing Reg α; skipping ISL slicing');
				return tierSet;
			}
			// Read slice starts AFTER defensive check
			const sA = slices['Reg α'];
			const sD = slices['Reg Δ'] ?? tierSet.length;
			const sI = slices['Reg ι'] ?? tierSet.length;
			const sB = slices['Reg β'] ?? tierSet.length;
			const sZ = slices['Reg ζ'] ?? tierSet.length;
			const sG = slices['Reg γ'] ?? tierSet.length;
			const sT = slices['Reg Θ'] ?? tierSet.length;
			const sE = slices['Reg ε'] ?? tierSet.length;
			const sL = slices['Reg λ'] ?? tierSet.length;
			const sP = slices['Reg ψ'] ?? tierSet.length;
			const sN = slices['Reg ν'] ?? tierSet.length;
			const sF = slices['Reg φ'] ?? tierSet.length;
			let start = sA;
			let end = tierSet.length;
			// Standard regs are cumulative, except Reg ι which is exclusive.
			if (format.includes('babyleague')) { // Reg α
				start = sA;
				end = sD;
			} else if (format.includes('nfeleague')) { // Reg Δ = α + Δ
				start = sA;
				end = sI;
			} else if (format.includes('singlestageonly')) { // Reg ι = ι only
				start = sI;
				end = sB;
			} else if (format.includes('2ndstageleague')) { // Reg β = α + Δ + ι + β
				start = sA;
				end = sZ;
			} else if (format.includes('betaparadox') || (format.includes('beta') && format.includes('paradox'))) { // Reg ζ = α + Δ + ι + β + ζ
				start = sA;
				end = sG;
			} else if (format.includes('3rdstageleague')) { // Reg γ = α + Δ + ι + β + ζ + γ
				start = sA;
				end = sT;
			} else if (format.includes('norestricted') || format.includes('norestrictedspecial')) { // Reg Θ = full standard pool + Θ
				start = sA;
				end = sE;
			} else if (format.includes('restrictedparadox')) { // Reg ε = full standard pool + Θ + ε
				start = sA;
				end = sL;
			} else if (format.includes('onerestricted')) {
				if (format.includes('mythical')) { 	// Reg ν = full standard pool + Θ + ε + λ + ψ + ν
					start = sA;
					end = sF;
				} else { // Reg λ = full standard pool + Θ + ε + λ
					start = sA;
					end = sP;
				}
			} else if (format.includes('tworestricted')) {
				if (format.includes('mythical')) { // Reg φ = everything through φ
					start = sA;
					end = tierSet.length;
				} else { // Reg ψ = full standard pool + Θ + ε + λ + ψ
					start = sA;
					end = sN;
				}
			} else { // Fallback: standard pool through Reg γ
				start = sA;
				end = sT;
			}

			tierSet = tierSet.slice(start, end);
			// Filter out anything we never want visible in ISL teambuilder lists
			tierSet = tierSet.filter(([type, id]) => {
				if (type === 'header') return true;
				const sp = this.dex.species.get(id);
				if (!sp || !sp.exists) return false;
				// Hide MissingNo / glitchy num=0 entries (prevents 0.png sprite fetch)
				if (sp.num === 0) return false;
				// Always keep customs
				if (sp.num >= 10000 || sp.num < 0) return true;
				// Hard-hide these groups
				if (sp.isNonstandard === 'Past' || sp.isNonstandard === 'Gigantamax' || sp.isNonstandard === 'CAP') return false;
				// Extra-hard CAP removal (in case isNonstandard isn't set how you expect)
				if (sp.tier === 'CAP' || sp.tier === 'CAP LC' || sp.tier === 'CAP NFE') return false;
				return true;
			});
		}
		// Filter out Gmax Pokemon from standard tier selection
			if (!(/^(battlestadium|vgc|doublesubers)/g.test(format) || (format === 'doubles' && this.formatType === 'natdex'))) {
				tierSet = tierSet.filter(([type, id]) => {
					if (type === 'header' && id === 'DUber by technicality') return false;
					if (type === 'header' && id === 'Uber by technicality') return false;
					if (type === 'pokemon') return !id.endsWith('gmax');
					return true;
				});
			}
			return tierSet;
		}
		filter(row: SearchRow, filters: string[][]) {
			if (!filters) return true;
			if (row[0] !== 'pokemon') return true;
			const species = this.dex.species.get(row[1]);
			for (const [filterType, value] of filters) {
				switch (filterType) {
				case 'type': if (species.types[0] !== value && species.types[1] !== value) return false;
					break;
				case 'egggroup': if (species.eggGroups[0] !== value && species.eggGroups[1] !== value) return false;
					break;
				case 'tier':
					const speciesTier = this.getTier(species);
					if ((this.formatType as any) === 'indigostarstorm') {
						const inclusiveTiers = BattlePokemonSearch.ISL_ALLOWED_TIERS;
						const allowed = inclusiveTiers[value];
						if (!allowed || !allowed.includes(speciesTier)) return false;
					} else { if (speciesTier !== value) return false; }
					break;
				case 'ability': if (!Dex.hasAbility(species, value)) return false;
					break;
				case 'move': if (!this.canLearn(species.id, value as ID)) return false;
					break;
				case 'flag': if (value === 'Mega') { if (!species.isMega) return false; } // Special case for Mega since it uses isMega property
					else { if (!species.tags || !species.tags.includes(value)) return false; }
					break;
				}
			}
			return true;
		}
		sort(results: SearchRow[], sortCol: string, reverseSort?: boolean) {
			const sortOrder = reverseSort ? -1 : 1;

			if (sortCol === 'tier') {
				const tierOrder = ['Reg α', 'Reg Δ', 'Reg ι', 'Reg β', 'Reg ζ', 'Reg γ', 'Reg Θ', 'Reg ε', 'Reg λ', 'Reg ψ', 'Reg ν', 'Reg φ'];
				return results.sort(([rowType1, id1], [rowType2, id2]) => {
					const species1 = this.dex.species.get(id1);
					const species2 = this.dex.species.get(id2);

					const tier1 = this.getTier(species1);
					const tier2 = this.getTier(species2);

					const index1 = tierOrder.indexOf(tier1);
					const index2 = tierOrder.indexOf(tier2);

					if (index1 !== -1 && index2 !== -1 && index1 !== index2) {
						return (index1 - index2) * sortOrder;
					}
					if (tier1 !== tier2) {
						return (tier1 < tier2 ? -1 : 1) * sortOrder;
					}
					if (species1.num !== species2.num) {
						return (species1.num - species2.num) * sortOrder;
					}
					return (species1.name < species2.name ? -1 : species1.name > species2.name ? 1 : 0) * sortOrder;
				});
			} else if (['hp', 'atk', 'def', 'spa', 'spd', 'spe'].includes(sortCol)) {
				return results.sort(([rowType1, id1], [rowType2, id2]) => {
					const stat1 = this.dex.species.get(id1).baseStats[sortCol as Dex.StatName];
					const stat2 = this.dex.species.get(id2).baseStats[sortCol as Dex.StatName];
					return (stat2 - stat1) * sortOrder;
				});
			} else if (sortCol === 'bst') {
				return results.sort(([rowType1, id1], [rowType2, id2]) => {
					const base1 = this.dex.species.get(id1).baseStats;
					const base2 = this.dex.species.get(id2).baseStats;
					let bst1 = base1.hp + base1.atk + base1.def + base1.spa + base1.spd + base1.spe;
					let bst2 = base2.hp + base2.atk + base2.def + base2.spa + base2.spd + base2.spe;
					if (this.dex.gen === 1) {
						bst1 -= base1.spd;
						bst2 -= base2.spd;
					}
					return (bst2 - bst1) * sortOrder;
				});
			} else if (sortCol === 'name') {
				return results.sort(([rowType1, id1], [rowType2, id2]) => {
					const name1 = id1;
					const name2 = id2;
					return (name1 < name2 ? -1 : name1 > name2 ? 1 : 0) * sortOrder;
				});
			}
			throw new Error("invalid sortcol");
		}
	}
	//region Ability Search
	class BattleAbilitySearch extends BattleTypedSearch<'ability'> {
		getTable() { return BattleAbilities; }
		getDefaultResults(reverseSort?: boolean): SearchRow[] {
			const results: SearchRow[] = [];
			for (let id in BattleAbilities) { results.push(['ability', id as ID]); }
			if (reverseSort) results.reverse();
			return results;
		}
		getBaseResults(): SearchRow[] {
			if (!this.species) return this.getDefaultResults();
			const format = this.format;
			const isHackmons = (format.includes('hackmons') || format.endsWith('bh'));
			const isAAA = (format === 'almostanyability' || format.includes('aaa'));
			const dex = this.dex;
			console.log('[DEBUG] BattleAbilitySearch.getBaseResults() - species:', this.species, 'dex.modid:', dex.modid);
			let species = dex.species.get(this.species);
			console.log('[DEBUG] Got species:', species.name, 'abilities:', species.abilities);
			let abilitySet: SearchRow[] = [['header', "Abilities"]];

	if (species.isMega) {
		abilitySet.unshift(['html', `Will be <strong>${species.abilities['0']}</strong> after Mega Evolving.`]);
		species = dex.species.get(species.baseSpecies);
	}

	const a0 = species.abilities['0'];
	const a1 = species.abilities['1'];
	const aH = species.abilities['H'];
	const aS = species.abilities['S'];

	// Your mod: abilities are *sets*.
	// Set 1 uses keys 0/1, Set 2 uses keys H/S.
	if ((this.formatType as any) === 'indigostarstorm') {
		abilitySet = [['header', "Ability Set 1"]];
		if (a0) abilitySet.push(['ability', toID(a0)]);
		if (a1) abilitySet.push(['ability', toID(a1)]);

		if (aH || aS) {
			abilitySet.push(['header', "Ability Set 2"]);
			if (aH) abilitySet.push(['ability', toID(aH)]);
			if (aS) abilitySet.push(['ability', toID(aS)]);
		}
	} else {
		// vanilla behavior
		abilitySet.push(['ability', toID(a0)]);
		if (a1) abilitySet.push(['ability', toID(a1)]);
		if (aH) {
			abilitySet.push(['header', "Hidden Ability"]);
			abilitySet.push(['ability', toID(aH)]);
		}
		if (aS) {
			abilitySet.push(['header', "Special Event Ability"]);
			abilitySet.push(['ability', toID(aS)]);
		}
	}
		if (isAAA || format.includes('metronomebattle') || isHackmons) {
			let abilities: ID[] = [];
			for (let i in this.getTable()) {
				const ability = dex.abilities.get(i);
				if (ability.isNonstandard) continue;
				if (ability.gen > dex.gen) continue;
				abilities.push(ability.id);
			}

			let goodAbilities: SearchRow[] = [['header', "Abilities"]];
			let poorAbilities: SearchRow[] = [['header', "Situational Abilities"]];
			let badAbilities: SearchRow[] = [['header', "Unviable Abilities"]];
			for (const ability of abilities.sort().map(abil => dex.abilities.get(abil))) {
				let rating = ability.rating;
				if (ability.id === 'normalize') rating = 3;
				if (rating >= 3) { goodAbilities.push(['ability', ability.id]); } 
				else if (rating >= 2) { poorAbilities.push(['ability', ability.id]); } 
				else { badAbilities.push(['ability', ability.id]); }
			}
			abilitySet = [...goodAbilities, ...poorAbilities, ...badAbilities];
			// species is unused after this, so no need to replace
			if (species.isMega) { if (isAAA) { abilitySet.unshift(['html', `Will be <strong>${species.abilities['0']}</strong> after Mega Evolving.`]); } }
		}
		return abilitySet;
	}
	filter(row: SearchRow, filters: string[][]) {
		if (!filters) return true;
		if (row[0] !== 'ability') return true;
		const ability = this.dex.abilities.get(row[1]);
		for (const [filterType, value] of filters) { switch (filterType) {
			case 'pokemon': if (!Dex.hasAbility(this.dex.species.get(value), ability.name)) return false;
				break;
			}
		}
		return true;
	}
	sort(results: SearchRow[], sortCol: string | null, reverseSort?: boolean): SearchRow[] { throw new Error("invalid sortcol"); }
}
//region Item Search
class BattleItemSearch extends BattleTypedSearch<'item'> {
	getTable() { return BattleItems; }
	override sortRow: SearchRow = ['sortitem', ''];
		getDefaultResults(): SearchRow[] {
		let table: any = BattleTeambuilderTable;
		if (this.formatType?.startsWith('bdsp')) {
			table = table['gen8bdsp'];
		} else if (this.formatType === 'bw1') {
			table = table['gen5bw1'];
		} else if (this.formatType === 'rs') {
			table = table['gen3rs'];
		} else if ((this.formatType as any) === 'indigostarstorm') {
			table = table['gen9indigostarstorm'];
		} else if (this.formatType === 'natdex') {
			table = table[`gen${this.dex.gen}natdex`];
		} else if (this.formatType?.endsWith('doubles')) {
			table = table[`gen${this.dex.gen}doubles`];
		} else if (this.formatType === 'metronome') {
			table = table[`gen${this.dex.gen}metronome`];
		} else if (this.dex.gen < 9) {
			table = table[`gen${this.dex.gen}`];
		} else {
			table = table['gen9'] || table;
		}

		if (!table || (!table.items && !table.itemSet)) return [];

		if (!table.itemSet) {
			table.itemSet = table.items.map((r: any) => {
				if (typeof r === 'string') return ['item', r];
				return [r[0], r[1]];
			});
			table.items = null;
		}



		//excluded items
		const isZCrystal = (item: Dex.Item) => !!((item as any).zMove || (item as any).zMoveType || (item as any).zMoveFrom);
		const isSpeciesSpecificLegacyItem = (item: Dex.Item) => {
			const forcedForme = (item as any).forcedForme || '';
			return !!(
				(item as any).onMemory || /^Silvally-/.test(forcedForme) ||
				(item as any).onDrive || /^Genesect-/.test(forcedForme)
			);
		};
		const isCAPItem = (item: Dex.Item) => {
			const id = item.id || '';
			const forcedForme = (item as any).forcedForme || '';
			return !!(
				(item as any).isNonstandard === 'CAP' ||
				id === 'crucibellite' ||
				id === 'vilevial' ||
				(item as any).megaStone === 'Crucibelle-Mega' ||
				forcedForme === 'Venomicon-Epilogue'
			);
		};
		const isPastItem = (item: Dex.Item) => (item as any).isNonstandard === 'Past';

		const isExcludedItem = (item: Dex.Item) => {
			if (!item?.exists) return true;
			const id = item.id || '';
			const name = item.name || '';
			if (isPastItem(item)) return true;
			if (isZCrystal(item)) return true;
			if (isSpeciesSpecificLegacyItem(item)) return true;
			if (isCAPItem(item)) return true;
			if ((item as any).isGem || id.endsWith('gem') || /\bGem\b/i.test(name)) return true;
			if ( id.endsWith('fossil') || id.startsWith('fossilized') || /\bFossil\b/i.test(name) || /\bFossilized\b/i.test(name)) return true;
			if (id.endsWith('incense') || /\bIncense\b/i.test(name)) return true;
			return false;
		};




		// Non-ISL formats: keep existing behavior, but without "Useless items"
		const isISL =
			(this.formatType as any) === 'indigostarstorm' ||
			this.dex?.modid === 'gen9indigostarstorm' ||
			(this.format || '').includes('isl') ||
			(this.format || '').includes('indigostarstorm');
		console.log('[ITEM SEARCH BRANCH]', {
			format: this.format,
			formatType: this.formatType,
			dexModid: this.dex?.modid,
			isISL,
		});
		if (!isISL) {
			const baseResults: SearchRow[] = table.itemSet;
			const results: SearchRow[] = [];
			let inUselessSection = false;
			for (const row of baseResults) {
				if (row[0] === 'header') {
					inUselessSection = row[1] === 'Useless items';
					if (inUselessSection) continue;
					results.push(row);
					continue;
				}
				if (inUselessSection) continue;
				if (row[0] !== 'item') {
					results.push(row);
					continue;
				}
				const item = this.dex.items.get(row[1]);
				if (isExcludedItem(item)) continue;
				results.push(row);
			}
			const typePlateRows: SearchRow[] = [];
			const speciesSpecificRows: SearchRow[] = [];
			const megaStoneRows: SearchRow[] = [];
			const sweetRows: SearchRow[] = [];
			const pokeballRows: SearchRow[] = [];
			for (let id in BattleItems) {
				const item = this.dex.items.get(id);
				if (isExcludedItem(item)) continue;
				const row: SearchRow = ['item', item.id];
				const itemClasses = this.getItemClass(item);
				if (itemClasses.includes('typeplates')) typePlateRows.push(row);
				else if (itemClasses.includes('megastone')) megaStoneRows.push(row);
				else if (itemClasses.includes('species')) speciesSpecificRows.push(row);
				else if (itemClasses.includes('sweets')) sweetRows.push(row);
				else if (itemClasses.includes('pokeball')) pokeballRows.push(row);
			}
			typePlateRows.sort((a, b) => this.dex.items.get(a[1]).name.localeCompare(this.dex.items.get(b[1]).name));
			speciesSpecificRows.sort((a, b) => this.dex.items.get(a[1]).name.localeCompare(this.dex.items.get(b[1]).name));
			megaStoneRows.sort((a, b) => this.dex.items.get(a[1]).name.localeCompare(this.dex.items.get(b[1]).name));
			sweetRows.sort((a, b) => this.dex.items.get(a[1]).name.localeCompare(this.dex.items.get(b[1]).name));
			pokeballRows.sort((a, b) => this.dex.items.get(a[1]).name.localeCompare(this.dex.items.get(b[1]).name));
			if (typePlateRows.length) {
				results.push(['header', 'Type Plates']);
				for (const row of typePlateRows) results.push(row);
			}
			if (speciesSpecificRows.length) {
				results.push(['header', 'Pokémon-specific Items']);
				for (const row of speciesSpecificRows) results.push(row);
			}
			if (megaStoneRows.length) {
				results.push(['header', 'Mega Stones']);
				for (const row of megaStoneRows) results.push(row);
			}
			if (sweetRows.length) {
				results.push(['header', 'Alcremie Sweets']);
				for (const row of sweetRows) results.push(row);
			}
			if (pokeballRows.length) {
				results.push(['header', 'Poké Balls']);
				for (const row of pokeballRows) results.push(row);
			}
			return results;
		}
		// ISL: use itemSet as the candidate source and filter by actual ISL item data,
		// but do NOT require an explicit mod Items entry just to display inherited items.
		const legalItems: Dex.Item[] = [];
		const seen = new Set<ID>();

		for (const row of table.itemSet as SearchRow[]) {
			if (row[0] !== 'item') continue;
			const item = this.dex.items.get(row[1]);
			if (!item?.exists) continue;
			if (seen.has(item.id)) continue;
			if (isExcludedItem(item)) continue;

			seen.add(item.id);
			legalItems.push(item);
		}
		legalItems.sort((a, b) => a.name.localeCompare(b.name));
		type Bucket = {label: string; tags: string[]; rows?: SearchRow[]};
		//region Item Pools/Buckets
		const buckets: Bucket[] = [
			{label: 'Uncategorized items', tags: []},
			{label: 'Evolution Stones', tags: ['evostones']},
			{label: 'Weather/Terrain', tags: ['weather', 'terrain']},
			{label: 'Type Plates', tags: ['typeplates']},
			{label: 'Resist', tags: ['resist']},
			{label: 'Stat Boost', tags: ['statboost']},
			{label: 'Status Cure', tags: ['statuscure']},
			{label: 'Healing', tags: ['healing']},
			{label: 'Utility', tags: ['utility']},
			{label: 'Mega Stones', tags: ['megastone']},
			{label: 'Z-Crystals', tags: ['zcrystals']},
			{label: 'Signature Items', tags: ['species']},
			{label: 'TM/TR/HM', tags: []},
			{label: 'Alcremie Sweets', tags: ['sweets']},
			{label: 'Evolution Items without an effect', tags: ['evolution', 'tradeevo']},
			{label: 'Poké Balls', tags: ['pokeball']},
		];
		const isTechnicalMachineItem = (item: Dex.Item) => {
			const id = item.id || '';
			const name = item.name || '';
			return /^(tm|tr|hm)\d+$/.test(id) || /^(TM|TR|HM)\d+/i.test(name);
		};
		const used = new Set<string>();
		const results: SearchRow[] = [];
		const unsortedRows: SearchRow[] = [];
		for (let i = 0; i < legalItems.length; i++) {
			const item = legalItems[i];
			const itemTags = this.getItemClass(item);
			let matched = false;

			if (isTechnicalMachineItem(item)) {
				const tmBucket = buckets.find(bucket => bucket.label === 'TM/TR/HM');
				if (tmBucket) {
					if (!tmBucket.rows) tmBucket.rows = [];
					tmBucket.rows.push(['item', item.id]);
					used.add(item.id);
					matched = true;
				}
			}

			if (!matched) {
				for (let j = 0; j < buckets.length; j++) {
					const bucket = buckets[j];
					if (!bucket.tags.length) continue; // skip Unsorted and TM/TR/HM during tag matching
					for (let k = 0; k < bucket.tags.length; k++) {
						if (itemTags.includes(bucket.tags[k])) {
							if (!bucket.rows) bucket.rows = [];
							bucket.rows.push(['item', item.id]);
							used.add(item.id);
							matched = true;
							break;
						}
					}
					if (matched) break; // first match wins
				}
			}

			if (!matched) unsortedRows.push(['item', item.id]);
		}
		for (let i = 0; i < buckets.length; i++) {
			const bucket = buckets[i];
			let rows: SearchRow[] = [];
			if (bucket.label === 'Uncategorized items') { rows = unsortedRows; } 
			else { rows = ((bucket as any).rows || []) as SearchRow[]; }
			rows.sort((a, b) => this.dex.items.get(a[1]).name.localeCompare(this.dex.items.get(b[1]).name));
			if (rows.length) {
				results.push(['header', bucket.label]);
				results.push.apply(results, rows);
			}
		}
		return results;
	}
	getBaseResults(): SearchRow[] {
		if (!this.species) return this.getDefaultResults();
		const speciesName = this.dex.species.get(this.species).name;
		const results = this.getDefaultResults();
		const speciesSpecific: SearchRow[] = [];
		const abilitySpecific: SearchRow[] = [];
		const abilityItem = {
			protosynthesis: 'boosterenergy',
			quarkdrive: 'boosterenergy',
			// poisonheal: 'toxicorb',
			// toxicboost: 'toxicorb',
			// flareboost: 'flameorb',
		}[toID(this.set?.ability) as string];
		for (const row of results) {
			if (row[0] !== 'item') continue;
			const item = this.dex.items.get(row[1]);
			if (item.itemUser?.includes(speciesName)) speciesSpecific.push(row);
			if (abilityItem === item.id) abilitySpecific.push(row);
		}
		if (speciesSpecific.length) {
			return [
				['header', speciesName + '-only'],
				...speciesSpecific,
				...results,
			];
		}
		if (abilitySpecific.length) {
			return [
				['header', `Specific to ${this.set!.ability!}`],
				...abilitySpecific,
				...results,
			];
		}
		return results;
	}
	static itemClassNames: {[k: string]: string} = {
		fragile: 'Fragile',
		volatile: 'Volatile',
		berry: 'Berry',
		consumable: 'Consumable',
		evolution: 'Evolution',
		tradeevo: 'Trade Evolution',
		pokeball: 'Poké Ball',
		healing: 'Healing',
		statboost: 'Stat Boost',
		statuscure: 'Status Cure',
		resist: 'Resist',
		reactive: 'Reactive',
		utility: 'Utility',
		species: 'Species-specific',
		megastone: 'Mega Stone',
		typeplates: 'Type Plates',
		sweets: 'Sweets',
		zcrystals: 'Z-Crystals',
		evostones: 'Evo Stones',
		weather: 'Weather',
		terrain: 'Terrain',
	};

	static normalizeItemClass(tag: string) {
		const id = toID(tag || '');
		const aliases: {[k: string]: string} = {
			tradeevolution: 'tradeevo',
			tradeevo: 'tradeevo',
			pokeball: 'pokeball',
			pokeballs: 'pokeball',
			speciesspecific: 'species',
			typeplate: 'typeplates',
			typeplates: 'typeplates',
			zcrystal: 'zcrystals',
			zcrystals: 'zcrystals',
			evostone: 'evostones',
			evostones: 'evostones',
			megastone: 'megastone',
			statboost: 'statboost',
			statuscure: 'statuscure',
			sweets: 'sweets',
			sweet: 'sweets',
			alcremiesweet: 'sweets',
			alcremiesweets: 'sweets',
		};
		return aliases[id] || id;
	}

	getItemClass(item: any) {
		const raw = item?.itemClass;
		let classIds: string[] = [];

		if (Array.isArray(raw)) {
			classIds = raw
				.map((x: string) => BattleItemSearch.normalizeItemClass(x))
				.filter((classId: string, i: number, arr: string[]) =>
					!!BattleItemSearch.itemClassNames[classId] && arr.indexOf(classId) === i
				)
				.slice(0, 6);
		} else if (typeof raw === 'string' && raw) {
			const classId = BattleItemSearch.normalizeItemClass(raw);
			if (BattleItemSearch.itemClassNames[classId]) classIds = [classId];
		}

		return classIds;
	}
	override defaultFilter(results: SearchRow[]) {
		if (this.species && !this.dex.species.get(this.species).nfe) {
			results.splice(results.findIndex(row => row[1] === 'eviolite'), 1);
			return results;
		}
		return results;
	}

	filter(row: SearchRow, filters: string[][]) {
		if (row[0] !== 'item') return true;
		const item = this.dex.items.get(row[1]);

		for (const [filterType, value] of filters) {
			if (filterType === 'itemclass') {
				const v = BattleItemSearch.normalizeItemClass(value === 'berries' ? 'berry' : value);
				const itemClasses = this.getItemClass(item);
				if (!itemClasses.includes(v)) return false;
			}
		}
		return true;
	}
	sort(results: SearchRow[], sortCol: string | null, reverseSort?: boolean): SearchRow[] { throw new Error("invalid sortcol"); }
}
//region Move Search
class BattleMoveSearch extends BattleTypedSearch<'move'> {
	override sortRow: SearchRow = ['sortmove', ''];
	getTable() { return BattleMovedex; }
	getDefaultResults(): SearchRow[] {
		let results: SearchRow[] = [];
		results.push(['header', "Moves"]);
		for (let id in BattleMovedex) {
			switch (id) {
			case 'paleowave':
				results.push(['header', "CAP moves"]);
				break;
			case 'magikarpsrevenge':
				continue;
			}
			results.push(['move', id as ID]);
		}
		return results;
	}
		private getFlagWeightsForTypes(types: readonly string[]): Record<string, number> {
		// TypeAffinityAversion was exported in teambuilder: exports.TypeAffinityAversion = {...}
		// In the browser, exports === window, so this is available as window.TypeAffinityAversion
		const table = (window as any).TypeAffinityAversion as Record<string, any> | undefined;
		const weights: Record<string, number> = {};
		if (!table) return weights;

		for (const typeName of types) {
			const entry = table[toID(typeName)];
			if (!entry) continue;

			// affinity => +weight
			if (entry.affinity) {
				for (const flag in entry.affinity) {
					const w = Number(entry.affinity[flag]) || 0;
					weights[flag] = (weights[flag] || 0) + w;
				}
			}
			// aversion => -weight
			if (entry.aversion) {
				for (const flag in entry.aversion) {
					const w = Number(entry.aversion[flag]) || 0;
					weights[flag] = (weights[flag] || 0) - w;
				}
			}
		}
		return weights;
	}

	private getMoveAffinityScore(move: Dex.Move, flagWeights: Record<string, number>): number {
		let score = 0;
		for (const flag in (move.flags || {})) {
			score += (flagWeights[flag] || 0);
		}
		return score;
	}
	private moveIsNotUseless(id: ID, species: Dex.Species, moves: string[], set: Dex.PokemonSet | null) {
		// Please do not mark moves as useless if there is any doubt whatsoever. I don't care if you think it's clutter or whatever. We are not in the
		// business of taking sides in arguments, or making judgments about specific metagames. If it could potentially be useful in some metagame, it is not useless.
		const dex = this.dex;
		let abilityid: ID = set ? toID(set.ability) : '' as ID;
		const itemid: ID = set ? toID(set.item) : '' as ID;
		if (this.formatType === 'metronome') { if (id === 'metronome') return true; }
		if (itemid === 'pidgeotite') abilityid = 'noguard' as ID;
		if (itemid === 'blastoisinite') abilityid = 'megalauncher' as ID;
		if (itemid === 'aerodactylite') abilityid = 'toughclaws' as ID;
		if (itemid === 'glalitite') abilityid = 'refrigerate' as ID;
		switch (id) {
		case 'fakeout': case 'flamecharge': case 'nuzzle': case 'poweruppunch': case 'trailblaze':
			return abilityid !== 'sheerforce';
		case 'solarbeam': case 'solarblade':
			return ['desolateland', 'drought', 'chlorophyll', 'orichalcumpulse'].includes(abilityid) || itemid === 'powerherb';
		case 'dynamicpunch': case 'grasswhistle': case 'inferno': case 'sing':
			return abilityid === 'noguard';
		case 'heatcrash': case 'heavyslam':
			return species.weightkg >= (species.evos ? 75 : 130);
		case 'aerialace':
			return ['technician', 'toughclaws'].includes(abilityid) && !moves.includes('bravebird');
		case 'ancientpower':
			return ['serenegrace', 'technician'].includes(abilityid) || !moves.includes('powergem');
		case 'aquajet':
			return !moves.includes('jetpunch');
		case 'aurawheel':
			return species.baseSpecies === 'Morpeko';
		case 'axekick':
			return !moves.includes('highjumpkick');
		case 'barrier':
			return !moves.includes('acidarmor');
		case 'bellydrum':
			return moves.includes('aquajet') || moves.includes('jetpunch') || moves.includes('extremespeed') || ['iceface', 'unburden'].includes(abilityid);
		case 'bulletseed':
			return ['skilllink', 'technician'].includes(abilityid);
		case 'chillingwater':
			return !moves.includes('scald');
		case 'counter': case 'mirrorcoat':
			return species.baseStats.hp >= 65;
		case 'dazzlinggleam':
			return !moves.includes('alluringvoice') || this.formatType?.includes('doubles');
		case 'darkvoid':
			return dex.gen < 7;
		case 'dualwingbeat':
			return abilityid === 'technician' || !moves.includes('drillpeck');
		case 'electroshot':
			return true;
		case 'feint':
			return abilityid === 'refrigerate';
		case 'futuresight':
			return dex.gen > 5;
		case 'grassyglide':
			return abilityid === 'grassysurge';
		case 'gyroball':
			return species.baseStats.spe <= 60;
		case 'headbutt':
			return abilityid === 'serenegrace';
		case 'hex':
			return !moves.includes('infernalparade');
		case 'hiddenpowerelectric':
			return !(dex.gen < 4 && moves.includes('thunderpunch')) && !moves.includes('thunderbolt');
		case 'hiddenpowerfighting':
			return !(dex.gen < 4 && moves.includes('brickbreak')) && !moves.includes('aurasphere') && !moves.includes('focusblast');
		case 'hiddenpowerfire':
			return !(dex.gen < 4 && moves.includes('firepunch')) && !moves.includes('flamethrower') && !moves.includes('mysticalfire') && !moves.includes('burningjealousy');
		case 'hiddenpowergrass':
			return !(dex.gen < 4 && moves.includes('leafblade')) || (dex.gen > 3 && !moves.includes('energyball') && !moves.includes('grassknot') && !moves.includes('gigadrain'));
		case 'hiddenpowerice':
			return !moves.includes('icebeam') && (dex.gen < 4 && !moves.includes('icepunch')) || (dex.gen > 5 && !moves.includes('aurorabeam') && !moves.includes('glaciate'));
		case 'hiddenpowerflying':
			return dex.gen < 4 && !moves.includes('drillpeck');
		case 'hiddenpowerbug':
			return dex.gen < 4 && !moves.includes('megahorn');
		case 'hiddenpowerpsychic':
			return species.baseSpecies === 'Unown';
		case 'hyperspacefury':
			return species.id === 'hoopaunbound';
		case 'hypnosis':
			return (dex.gen < 4 && !moves.includes('sleeppowder')) || (dex.gen > 6 && abilityid === 'baddreams');
		case 'icepunch':
			return !moves.includes('icespinner') || ['sheerforce', 'ironfist'].includes(abilityid) || itemid === 'punchingglove';
		case 'iciclecrash':
			return !moves.includes('mountaingale');
		case 'iciclespear':
			return dex.gen > 3;
		case 'icywind':
			// Keldeo needs Hidden Power for Electric/Ghost
			return species.baseSpecies === 'Keldeo' || this.isDoubles;
		case 'infestation':
			return moves.includes('stickyweb');
		case 'irondefense':
			return !moves.includes('acidarmor') && !moves.includes('barrier');
		case 'irontail':
			return dex.gen > 5 && !moves.includes('ironhead') && !moves.includes('gunkshot') && !moves.includes('poisonjab');
		case 'jumpkick':
			return !moves.includes('highjumpkick') && !moves.includes('axekick');
		case 'lastresort':
			return set && set.moves.length < 3;
		case 'leafblade':
			return true;
		case 'leechlife':
			return dex.gen > 6;
		case 'magiccoat':
			return dex.gen > 3;
		case 'meteorbeam':
			return true;
		case 'mysticalfire':
			return dex.gen > 6 && !moves.includes('flamethrower');
		case 'naturepower':
			return dex.gen === 5;
		case 'needlearm':
			return dex.gen < 4;
		case 'nightslash':
			return !moves.includes('crunch') && !(moves.includes('knockoff') && dex.gen >= 6);
		case 'outrage':
			return dex.gen > 3 && !moves.includes('glaiverush');
		case 'petaldance':
			return abilityid === 'owntempo';
		case 'phantomforce':
			return (!moves.includes('poltergeist') && !moves.includes('shadowclaw')) || this.isDoubles;
		case 'poisonfang':
			return species.types.includes('Poison') && !moves.includes('gunkshot') && !moves.includes('poisonjab');
		case 'raindance':
			return dex.gen < 4;
		case 'relicsong':
			return species.id === 'meloetta';
		case 'refresh':
			return !moves.includes('aromatherapy') && !moves.includes('healbell');
		case 'risingvoltage':
			return abilityid === 'electricsurge' || abilityid === 'hadronengine';
		case 'rocktomb':
			return abilityid === 'technician';
		case 'selfdestruct':
			return dex.gen < 5 && !moves.includes('explosion');
		case 'shadowpunch':
			return abilityid === 'ironfist' && !moves.includes('ragefist');
		case 'shelter':
			return !moves.includes('acidarmor') && !moves.includes('irondefense');
		case 'skyuppercut':
			return dex.gen < 4;
		case 'smackdown':
			return species.types.includes('Ground');
		case 'smartstrike':
			return species.types.includes('Steel') && !moves.includes('ironhead');
		case 'soak':
			return abilityid === 'unaware';
		case 'steelwing':
			return !moves.includes('ironhead');
		case 'stompingtantrum':
			return (!moves.includes('earthquake') && !moves.includes('drillrun')) || this.isDoubles;
		case 'stunspore':
			return !moves.includes('thunderwave');
		case 'sunnyday':
			return dex.gen < 4;
		case 'technoblast':
			return dex.gen > 5 && itemid.endsWith('drive') || itemid === 'dousedrive';
		case 'teleport':
			return dex.gen > 7;
		case 'temperflare':
			return (!moves.includes('flareblitz') && !moves.includes('pyroball') && !moves.includes('sacredfire') && !moves.includes('bitterblade') && !moves.includes('firepunch')) || this.isDoubles;
		case 'terrainpulse': case 'waterpulse':
			return ['megalauncher', 'technician'].includes(abilityid) && !moves.includes('originpulse');
		case 'thief':
			return dex.gen === 2;
		case 'toxicspikes':
			return abilityid !== 'toxicdebris';
		case 'triattack':
			return dex.gen > 3;
		case 'trickroom':
			return species.baseStats.spe <= 100;
		case 'wildcharge':
			return !moves.includes('supercellslam');
		case 'zapcannon':
			return abilityid === 'noguard' || (dex.gen < 4 && !moves.includes('thunderwave'));
		}
		if (this.isDoubles && BattleMoveSearch.GOOD_DOUBLES_MOVES.includes(id)) { return true; }
		const move = dex.moves.get(id);
		if (!move.exists) return true;
		if (move.category === 'Status') { return BattleMoveSearch.GOOD_STATUS_MOVES.includes(id); }
		if (move.basePower < 75) { return BattleMoveSearch.GOOD_WEAK_MOVES.includes(id) || (abilityid === 'technician' && move.basePower === 60); }
		if (id === 'skydrop') return true;
		if (move.flags['charge']) { return itemid === 'powerherb'; }
		if (move.flags['recharge']) { return false; }
		if (move.flags['slicing'] && abilityid === 'sharpness') { return true; }
		return !BattleMoveSearch.BAD_STRONG_MOVES.includes(id);
	}
	static readonly GOOD_STATUS_MOVES = [
		'acidarmor', 'agility', 'aromatherapy', 'auroraveil', 'autotomize', 'banefulbunker', 'batonpass', 'bellydrum', 'bulkup', 'burningbulwark', 'calmmind', 'chillyreception', 'clangoroussoul', 'coil', 'cottonguard', 'courtchange', 'curse', 'defog', 'destinybond', 'detect', 'disable', 'dragondance', 'encore', 'extremeevoboost', 'filletaway', 'geomancy', 'glare', 'haze', 'healbell', 'healingwish', 'healorder', 'heartswap', 'honeclaws', 'kingsshield', 'leechseed', 'lightscreen', 'lovelykiss', 'lunardance', 'magiccoat', 'maxguard', 'memento', 'milkdrink', 'moonlight', 'morningsun', 'nastyplot', 'naturesmadness', 'noretreat', 'obstruct', 'painsplit', 'partingshot', 'perishsong', 'protect', 'quiverdance', 'recover', 'reflect', 'reflecttype', 'rest', 'revivalblessing', 'roar', 'rockpolish', 'roost', 'shedtail', 'shellsmash', 'shiftgear', 'shoreup', 'silktrap', 'slackoff', 'sleeppowder', 'sleeptalk', 'softboiled', 'spikes', 'spikyshield', 'spore', 'stealthrock', 'stickyweb', 'strengthsap', 'substitute', 'switcheroo', 'swordsdance', 'synthesis', 'tailglow', 'tailwind', 'taunt', 'thunderwave', 'tidyup', 'toxic', 'transform', 'trick', 'victorydance', 'whirlwind', 'willowisp', 'wish', 'yawn',
	] as ID[] as readonly ID[];
	static readonly GOOD_WEAK_MOVES = [
		'accelerock', 'acrobatics', 'aquacutter', 'avalanche', 'barbbarrage', 'bonemerang', 'bouncybubble', 'bulletpunch', 'buzzybuzz', 'ceaselessedge', 'circlethrow', 'clearsmog', 'doubleironbash', 'dragondarts', 'dragontail', 'drainingkiss', 'endeavor', 'facade', 'firefang', 'flipturn', 'flowertrick', 'freezedry', 'frustration', 'geargrind', 'gigadrain', 'grassknot', 'gyroball', 'icefang', 'iceshard', 'iciclespear', 'infernalparade', 'knockoff', 'lastrespects', 'lowkick', 'machpunch', 'mortalspin', 'mysticalpower', 'naturesmadness', 'nightshade', 'nuzzle', 'pikapapow', 'populationbomb', 'psychocut', 'psyshieldbash', 'pursuit', 'quickattack', 'ragefist', 'rapidspin', 'return', 'rockblast', 'ruination', 'saltcure', 'scorchingsands', 'seismictoss', 'shadowclaw', 'shadowsneak', 'sizzlyslide', 'stoneaxe', 'storedpower', 'stormthrow', 'suckerpunch', 'superfang', 'surgingstrikes', 'tachyoncutter', 'tailslap', 'thunderclap', 'tripleaxel', 'tripledive', 'twinbeam', 'uturn', 'vacuumwave', 'veeveevolley', 'voltswitch', 'watershuriken', 'weatherball',
	] as ID[] as readonly ID[];
	static readonly BAD_STRONG_MOVES = [
		'belch', 'burnup', 'crushclaw', 'dragonrush', 'dreameater', 'eggbomb', 'firepledge', 'flyingpress', 'futuresight', 'grasspledge', 'hyperbeam', 'hyperfang', 'hyperspacehole', 'jawlock', 'landswrath', 'megakick', 'megapunch', 'mistyexplosion', 'muddywater', 'nightdaze', 'pollenpuff', 'rockclimb', 'selfdestruct', 'shelltrap', 'skyuppercut', 'slam', 'strength', 'submission', 'synchronoise', 'takedown', 'thrash', 'uproar', 'waterpledge',
	] as ID[] as readonly ID[];
	static readonly GOOD_DOUBLES_MOVES = [
		'allyswitch', 'bulldoze', 'coaching', 'electroweb', 'faketears', 'fling', 'followme', 'healpulse', 'helpinghand', 'junglehealing', 'lifedew', 'lunarblessing', 'muddywater', 'pollenpuff', 'psychup', 'ragepowder', 'safeguard', 'skillswap', 'snipeshot', 'wideguard', 'decorate', 'snarl',
	] as ID[] as readonly ID[];
	getBaseResults() {
		if (!this.species) return this.getDefaultResults();
		const dex = this.dex;
		let species = dex.species.get(this.species);
		const format = this.format;
		const isHackmons = (format.includes('hackmons') || format.endsWith('bh'));
		const isSTABmons = (format.includes('stabmons') || format === 'staaabmons');
		const isTradebacks = format.includes('tradebacks');
		const regionBornLegality = dex.gen >= 6 && (/^battle(spot|stadium|festival)/.test(format) || format.startsWith('bss') || format.startsWith('vgc') || (dex.gen === 9 && this.formatType !== 'natdex'));
		let learnsetid = this.firstLearnsetid(species.id);
		let moves: string[] = [];
		let sketchMoves: string[] = [];
		let sketch = false;
		let gen = `${dex.gen}`;
		let lsetTable = BattleTeambuilderTable;
		if (this.formatType?.startsWith('bdsp')) lsetTable = lsetTable['gen8bdsp'];
		if (this.formatType === 'letsgo') lsetTable = lsetTable['gen7letsgo'];
		if (this.formatType === 'bw1') lsetTable = lsetTable['gen5bw1'];
		if (this.formatType === 'rs') lsetTable = lsetTable['gen3rs'];
		if (this.formatType?.startsWith('ssdlc1')) lsetTable = lsetTable['gen8dlc1'];
		if ((this.formatType as any) === 'indigostarstorm') lsetTable = lsetTable['gen9indigostarstorm'] || lsetTable;
		if (this.formatType?.startsWith('predlc')) lsetTable = lsetTable['gen9predlc'];
		if (this.formatType?.startsWith('svdlc1')) lsetTable = lsetTable['gen9dlc1'];
		if ((this.formatType as any) === 'indigostarstorm') lsetTable = lsetTable['gen9indigostarstorm'] || lsetTable;
		console.log('[DEBUG getMovesList] formatType:', this.formatType, 'has learnsets?', !!lsetTable?.learnsets);
		while (learnsetid) {
			let learnset = lsetTable.learnsets[learnsetid];
			console.log('[DEBUG getMovesList] learnsetid:', learnsetid, 'has learnset?', !!learnset, 'move count:', learnset ? Object.keys(learnset).length : 0);
			if (learnset) {
				for (let moveid in learnset) {
					let learnsetEntry = learnset[moveid];
					const move = dex.moves.get(moveid);
					const minGenCode: { [gen: number]: string } = { 6: 'p', 7: 'q', 8: 'g', 9: 'a' };
					if (regionBornLegality && !learnsetEntry.includes(minGenCode[dex.gen])) { continue; }
					if (this.eggMovesOnly(learnsetid, species.id) &&(!learnsetEntry.includes('e') || dex.gen !== 9)) { continue; }
					if (!learnsetEntry.includes(gen) && (!isTradebacks ? true : !(move.gen <= dex.gen && learnsetEntry.includes(`${dex.gen + 1}`))) ) { continue; }
					if (this.formatType !== 'natdex' && move.isNonstandard === "Past") { continue; }
					if (this.formatType?.startsWith('dlc1') && BattleTeambuilderTable['gen8dlc1']?.nonstandardMoves.includes(moveid)) { continue; }
					if (this.formatType?.includes('predlc') && this.formatType !== 'predlcnatdex' && BattleTeambuilderTable['gen9predlc']?.nonstandardMoves.includes(moveid)) { continue; }
					if (this.formatType?.includes('svdlc1') && this.formatType !== 'svdlc1natdex' && BattleTeambuilderTable['gen9dlc1']?.nonstandardMoves.includes(moveid)) { continue; }
					if (moves.includes(moveid)) continue;
					moves.push(moveid);
					if (moveid === 'sketch') sketch = true;
					if (moveid === 'hiddenpower') {moves.push('hiddenpowerbug', 'hiddenpowerdark', 'hiddenpowerdragon', 'hiddenpowerelectric', 'hiddenpowerfighting', 'hiddenpowerfire', 'hiddenpowerflying', 'hiddenpowerghost', 'hiddenpowergrass', 'hiddenpowerground', 'hiddenpowerice', 'hiddenpowerpoison', 'hiddenpowerpsychic', 'hiddenpowerrock', 'hiddenpowersteel', 'hiddenpowerwater');}
				}
			}
			learnsetid = this.nextLearnsetid(learnsetid, species.id, true);
		}
		if (sketch || isHackmons) {
			if (isHackmons) moves = [];
			for (let id in BattleMovedex) {
				if (!format.startsWith('cap') && (id === 'paleowave' || id === 'shadowstrike')) continue;
				const move = dex.moves.get(id);
				if (move.gen > dex.gen) continue;
				if (sketch) {
					if (move.flags['nosketch'] || move.isMax || move.isZ) continue;
					if (move.isNonstandard && move.isNonstandard !== 'Past') continue;
					if (move.isNonstandard === 'Past' && this.formatType !== 'natdex') continue;
					sketchMoves.push(move.id);
				} else {
					if (!(dex.gen < 8 || this.formatType === 'natdex') && move.isZ) continue;
					if (typeof move.isMax === 'string') continue;
					if (move.isMax && dex.gen > 8) continue;
					if (move.isNonstandard === 'Past' && this.formatType !== 'natdex') continue;
					if (move.isNonstandard === 'LGPE' && this.formatType !== 'letsgo') continue;
					moves.push(move.id);
				}
			}
		}
		if (this.formatType === 'metronome') moves = ['metronome'];
		if (isSTABmons) {
			for (let id in this.getTable()) {
				const move = dex.moves.get(id);
				if (moves.includes(move.id)) continue;
				if (move.gen > dex.gen) continue;
				if (move.isZ || move.isMax || (move.isNonstandard && move.isNonstandard !== 'Unobtainable')) continue;
				const speciesTypes: string[] = [];
				const moveTypes: string[] = [];
				for (let i = dex.gen; i >= species.gen && i >= move.gen; i--) {
					const genDex = Dex.forGen(i);
					moveTypes.push(genDex.moves.get(move.name).type);
					const pokemon = genDex.species.get(species.name);
					let baseSpecies = genDex.species.get(pokemon.changesFrom || pokemon.name);
					if (!pokemon.battleOnly) speciesTypes.push(...pokemon.types);
					let prevo = pokemon.prevo;
					while (prevo) {
						const prevoSpecies = genDex.species.get(prevo);
						speciesTypes.push(...prevoSpecies.types);
						prevo = prevoSpecies.prevo;
					}
					if (pokemon.battleOnly && typeof pokemon.battleOnly === 'string') { species = dex.species.get(pokemon.battleOnly); }
					const excludedForme = (s: Dex.Species) => [ 'Alola', 'Alola-Totem', 'Galar', 'Galar-Zen', 'Hisui', 'Paldea', 'Paldea-Combat', 'Paldea-Blaze', 'Paldea-Aqua', ].includes(s.forme);
					if (baseSpecies.otherFormes && !['Wormadam', 'Urshifu'].includes(baseSpecies.baseSpecies)) {
						if (!excludedForme(species)) speciesTypes.push(...baseSpecies.types);
						for (const formeName of baseSpecies.otherFormes) {
							const forme = dex.species.get(formeName);
							if (!forme.battleOnly && !excludedForme(forme)) speciesTypes.push(...forme.types);
						}
					}
				}
				let valid = false;
				for (let type of moveTypes) { if (speciesTypes.includes(type)) {
					valid = true;
					break;
					}
				}
				if (valid) moves.push(id);
			}
		}
				moves.sort();
		sketchMoves.sort();

		// Build weights for this Pokemon's typing
		const flagWeights = this.getFlagWeightsForTypes(species.types);

		type Scored = { id: ID; score: number };
		const affinity: Scored[] = [];
		const neutral: Scored[] = [];
		const aversion: Scored[] = [];

		// Keep current inclusion behavior: learned moves + sketch moves
		const allMoveIds: ID[] = [
			...moves.map(x => x as ID),
			...sketchMoves.map(x => x as ID),
		];

		for (const id of allMoveIds) {
			const move = dex.moves.get(id);
			const score = this.getMoveAffinityScore(move, flagWeights);
			const entry = { id, score };

			if (score > 0) affinity.push(entry);
			else if (score < 0) aversion.push(entry);
			else neutral.push(entry);
		}

		// Sort: score desc for Affinity, score asc (most negative first) for Aversion, id tie-break
		affinity.sort((a, b) => (b.score - a.score) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
		neutral.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
		aversion.sort((a, b) => (a.score - b.score) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

		const out: SearchRow[] = [];
		if (affinity.length) {
			out.push(['header', 'Affinity']);
			out.push(...affinity.map(x => ['move', x.id] as SearchRow));
		}
		if (neutral.length) {
			out.push(['header', 'Neutral']);
			out.push(...neutral.map(x => ['move', x.id] as SearchRow));
		}
		if (aversion.length) {
			out.push(['header', 'Aversion']);
			out.push(...aversion.map(x => ['move', x.id] as SearchRow));
		}
		return out;
	}
	filter(row: SearchRow, filters: string[][]) {
		if (!filters) return true;
		if (row[0] !== 'move') return true;
		const move = this.dex.moves.get(row[1]);
		for (const [filterType, value] of filters) {
			switch (filterType) {
			case 'type': {
				const type2 = (move as any).type2 as string | undefined;
				if (move.type !== value && type2 !== value) return false;
				break;
			}
			case 'category': if (move.category !== value) return false;
				break;
			case 'flag': if (!(value in move.flags)) return false;
				break;
			case 'pokemon': if (!this.canLearn(value as ID, move.id)) return false;
				break;
			}
		}
		return true;
	}
	sort(results: SearchRow[], sortCol: string, reverseSort?: boolean): SearchRow[] {
		const sortOrder = reverseSort ? -1 : 1;
		switch (sortCol) {
		case 'power':
			let powerTable: { [id: string]: number | undefined } = {
				return: 102, frustration: 102, spitup: 300, trumpcard: 200, naturalgift: 80, grassknot: 120,
				lowkick: 120, gyroball: 150, electroball: 150, flail: 200, reversal: 200, present: 120,
				wringout: 120, crushgrip: 120, heatcrash: 120, heavyslam: 120, fling: 130, magnitude: 150,
				beatup: 24, punishment: 1020, psywave: 1250, nightshade: 1200, seismictoss: 1200,
				dragonrage: 1140, sonicboom: 1120, superfang: 1350, endeavor: 1399, sheercold: 1501,
				fissure: 1500, horndrill: 1500, guillotine: 1500,
			};
			return results.sort(([rowType1, id1], [rowType2, id2]) => {
				let move1 = this.dex.moves.get(id1);
				let move2 = this.dex.moves.get(id2);
				let pow1 = move1.basePower || powerTable[id1] || (move1.category === 'Status' ? -1 : 1400);
				let pow2 = move2.basePower || powerTable[id2] || (move2.category === 'Status' ? -1 : 1400);
				return (pow2 - pow1) * sortOrder;
			});
		case 'accuracy':
			return results.sort(([rowType1, id1], [rowType2, id2]) => {
				let accuracy1 = this.dex.moves.get(id1).accuracy || 0;
				let accuracy2 = this.dex.moves.get(id2).accuracy || 0;
				if (accuracy1 === true) accuracy1 = 101;
				if (accuracy2 === true) accuracy2 = 101;
				return (accuracy2 - accuracy1) * sortOrder;
			});
		case 'crit':
			return results.sort(([rowType1, id1], [rowType2, id2]) => {
				const m1 = this.dex.moves.get(id1);
				const m2 = this.dex.moves.get(id2);

				// Your mod: "base" crit is critRatio 4 (+0). Fallback to 4 if unset.
				const c1 = (m1.critRatio ?? 4);
				const c2 = (m2.critRatio ?? 4);

				// Default (1st click) should be highest -> lowest (same convention as power/acc/pp)
				if (c2 !== c1) return (c2 - c1) * sortOrder;

				// Tie-break by name for stable ordering
				return (id1 < id2 ? -1 : id1 > id2 ? 1 : 0) * sortOrder;
			});
		case 'pp':
			return results.sort(([rowType1, id1], [rowType2, id2]) => {
				let pp1 = this.dex.moves.get(id1).pp || 0;
				let pp2 = this.dex.moves.get(id2).pp || 0;
				return (pp2 - pp1) * sortOrder;
			});
		case 'flags:':
			return results.sort(([rowType1, id1], [rowType2, id2]) => {
				const f1 = Object.keys(this.dex.moves.get(id1).flags || {}).sort().join(',');
				const f2 = Object.keys(this.dex.moves.get(id2).flags || {}).sort().join(',');
				if (f1 !== f2) return (f1 < f2 ? -1 : 1) * sortOrder;
				return (id1 < id2 ? -1 : id1 > id2 ? 1 : 0) * sortOrder;
			});
		case 'name':
			return results.sort(([rowType1, id1], [rowType2, id2]) => {
				const name1 = id1;
				const name2 = id2;
				return (name1 < name2 ? -1 : name1 > name2 ? 1 : 0) * sortOrder;
			});
		}
		throw new Error("invalid sortcol");
		}
	}



	//region Category Search                      
	class BattleCategorySearch extends BattleTypedSearch<'category'> {
		getTable() { return { physical: 1, special: 1, status: 1 }; }
		getDefaultResults(reverseSort?: boolean): SearchRow[] {
			const results: SearchRow[] = [
				['category', 'physical' as ID],
				['category', 'special' as ID],
				['category', 'status' as ID],
			];
			if (reverseSort) results.reverse();
			return results;
		}
		getBaseResults() { return this.getDefaultResults(); }
		filter(row: SearchRow, filters: string[][]): boolean { throw new Error("invalid filter"); }
		sort(results: SearchRow[], sortCol: string | null, reverseSort?: boolean): SearchRow[] { throw new Error("invalid sortcol"); }
	}
	//region Flag Search
	class BattleFlagSearch extends BattleTypedSearch<'flag'> {
		getTable() {
			return {
				contact: 1, binding: 1, bite: 1, bomb: 1, bullet: 1,
				drain: 1, explosive: 1, fist: 1, powder: 1, pulse: 1, slicing: 1, sound: 1,
				wind: 1, airborne: 1, aura: 1, beam: 1, breath: 1, claw: 1, crash: 1, crush: 1,
				kick: 1, launch: 1, light: 1, lunar: 1, magic: 1, pierce: 1, shadow: 1,
				solar: 1, spin: 1, sweep: 1, throw: 1, weapon: 1, wing: 1, bypassprotect: 1,
				nonreflectable: 1, nonmirror: 1, nonsnatchable: 1, bypasssubstitute: 1, maxmove: 1, gmaxmove: 1, zmove: 1,

				legendary: 1, restrictedlegendary: 1,
				mythical: 1, restrictedmythical: 1,
				paradox: 1, restrictedparadox: 1,
				mega: 1, powerhouse: 1,
			};
		}
		getDefaultResults(reverseSort?: boolean): SearchRow[] {
			const results: SearchRow[] = [
				['flag', 'restrictedlegendary' as ID],
				['flag', 'restrictedmythical' as ID],
				['flag', 'restrictedparadox' as ID],
				['flag', 'legendary' as ID],
				['flag', 'mythical' as ID],
				['flag', 'paradox' as ID],
				['flag', 'mega' as ID],
				['flag', 'powerhouse' as ID],

				['flag', 'contact' as ID],
				['flag', 'binding' as ID],
				['flag', 'bite' as ID],
				['flag', 'bomb' as ID],
				['flag', 'bullet' as ID],
				['flag', 'drain' as ID],
				['flag', 'explosive' as ID],
				['flag', 'fist' as ID],
				['flag', 'powder' as ID],
				['flag', 'pulse' as ID],
				['flag', 'slicing' as ID],
				['flag', 'sound' as ID],
				['flag', 'wind' as ID],
				['flag', 'airborne' as ID],
				['flag', 'aura' as ID],
				['flag', 'beam' as ID],
				['flag', 'breath' as ID],
				['flag', 'claw' as ID],
				['flag', 'crash' as ID],
				['flag', 'crush' as ID],
				['flag', 'kick' as ID],
				['flag', 'launch' as ID],
				['flag', 'light' as ID],
				['flag', 'lunar' as ID],
				['flag', 'magic' as ID],
				['flag', 'pierce' as ID],
				['flag', 'shadow' as ID],
				['flag', 'solar' as ID],
				['flag', 'spin' as ID],
				['flag', 'sweep' as ID],
				['flag', 'throw' as ID],
				['flag', 'weapon' as ID],
				['flag', 'wing' as ID],
				['flag', 'bypassprotect' as ID],
				['flag', 'nonreflectable' as ID],
				['flag', 'nonmirror' as ID],
				['flag', 'nonsnatchable' as ID],
				['flag', 'bypasssubstitute' as ID],
				['flag', 'maxmove' as ID],
				['flag', 'gmaxmove' as ID],
				['flag', 'zmove' as ID],
			];
			if (reverseSort) results.reverse();
			return results;
		}
		getBaseResults() { return this.getDefaultResults(); }
		filter(row: SearchRow, filters: string[][]): boolean { throw new Error("invalid filter"); }
		sort(results: SearchRow[], sortCol: string | null, reverseSort?: boolean): SearchRow[] { throw new Error("invalid sortcol"); }
	}
	//region Type Search
	class BattleTypeSearch extends BattleTypedSearch<'type'> {
		getTable() { return window.BattleTypeChart; }
		getDefaultResults(reverseSort?: boolean): SearchRow[] {
			const results: SearchRow[] = [];
			for (let id in window.BattleTypeChart) { results.push(['type', id as ID]); }
			if (reverseSort) results.reverse();
			return results;
		}
		getBaseResults() { return this.getDefaultResults(); }
		filter(row: SearchRow, filters: string[][]): boolean { throw new Error("invalid filter"); }
		sort(results: SearchRow[], sortCol: string | null, reverseSort?: boolean): SearchRow[] { throw new Error("invalid sortcol"); }
	}