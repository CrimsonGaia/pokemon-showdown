/**
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
import { Pokemon, type ServerPokemon } from "./battle";
import {
	BattleAvatarNumbers, BattleBaseSpeciesChart, BattlePokemonIconIndexes, BattlePokemonIconIndexesLeft,
	Ability, Item, Move, Flag, Species, PureEffect, type ID, type Type,
} from "./battle-dex-data";
import type * as DexData from "./battle-dex-data";
import type { Teams } from "./battle-teams";
import { Config } from "./client-main";
export declare namespace Dex {
	/* eslint-disable @typescript-eslint/no-shadow */
	export type Ability = DexData.Ability;
	export type Item = DexData.Item;
	export type Move = DexData.Move;
	export type Flag = DexData.Flag;
	export type Species = DexData.Species;
	export type Type = DexData.Type;
	export type Nature = DexData.Nature;
	export type PureEffect = DexData.PureEffect;
	export type Effect = DexData.Effect;
	export type ID = DexData.ID;
	/* eslint-enable @typescript-eslint/no-shadow */
	export type StatName = DexData.StatName;
	export type StatNameExceptHP = DexData.StatNameExceptHP;
	export type BoostStatName = DexData.BoostStatName;
	export type TypeName = DexData.TypeName;
	export type StatusName = DexData.StatusName;
	export type GenderName = DexData.GenderName;
	export type NatureName = DexData.NatureName;
	export type MoveTarget = DexData.MoveTarget;
	export type REGULAR = 0;
	export type WEAK = 1;
	export type RESIST = 2;
	export type IMMUNE = 3;
	export type WeaknessType = REGULAR | WEAK | RESIST | IMMUNE;
	export type StatsTable = { hp: number, atk: number, def: number, spa: number, spd: number, spe: number };
	export type PokemonSet = Teams.PokemonSet;
}
const ISL_ALLOWED_CACHE: WeakMap<object, Set<ID>> = new WeakMap();
export type { ID };
declare const require: any;
declare const global: any;
declare const process: any;
if (typeof window === 'undefined') { global.window = global; } // Node
else { window.exports = window; } // browser (possibly NW.js!)
window.nodewebkit = !!(typeof process !== 'undefined' && process.versions?.['node-webkit']);
export function toID(text: any) {
	if (text?.id) { text = text.id; } 
	else if (text?.userid) { text = text.userid; }
	if (typeof text !== 'string' && typeof text !== 'number') return '' as ID;
	return `${text}`.toLowerCase().replace(/[^a-z0-9]+/g, '') as ID;
}
export function toUserid(text: any) { return toID(text); }
type Comparable = number | string | boolean | Comparable[] | { reverse: Comparable };
export const PSUtils = new class {
	/**
	 * Like string.split(delimiter), but only recognizes the first `limit`
	 * delimiters (default 1).
	 * `"1 2 3 4".split(" ", 2) => ["1", "2"]`
	 * `splitFirst("1 2 3 4", " ", 1) => ["1", "2 3 4"]`
	 * Returns an array of length exactly limit + 1.
	 */
	splitFirst(str: string, delimiter: string, limit = 1) {
		let splitStr: string[] = [];
		while (splitStr.length < limit) {
			let delimiterIndex = str.indexOf(delimiter);
			if (delimiterIndex >= 0) {
				splitStr.push(str.slice(0, delimiterIndex));
				str = str.slice(delimiterIndex + delimiter.length);
			} else {
				splitStr.push(str);
				str = '';
			}
		}
		splitStr.push(str);
		return splitStr;
	}
	/**
	 * Compares two variables; intended to be used as a smarter comparator.
	 * The two variables must be the same type (TypeScript will not check this).
	 * - Numbers are sorted low-to-high, use `-val` to reverse
	 * - Strings are sorted A to Z case-semi-insensitively, use `{reverse: val}` to reverse
	 * - Booleans are sorted true-first (REVERSE of casting to numbers), use `!val` to reverse
	 * - Arrays are sorted lexically in the order of their elements
	 * In other words: `[num, str]` will be sorted A to Z, `[num, {reverse: str}]` will be sorted Z to A.
	 */
	compare(a: Comparable, b: Comparable): number {
		if (typeof a === 'number') { return a - (b as number); }
		if (typeof a === 'string') { return a.localeCompare(b as string); }
		if (typeof a === 'boolean') { return (a ? 1 : 2) - (b ? 1 : 2); }
		if (Array.isArray(a)) {
			for (let i = 0; i < a.length; i++) {
				const comparison = PSUtils.compare(a[i], (b as Comparable[])[i]);
				if (comparison) return comparison;
			}
			return 0;
		}
		if (a.reverse) { return PSUtils.compare((b as { reverse: string }).reverse, a.reverse); }
		throw new Error(`Passed value ${a as any} is not comparable`);
	}
	/**
	 * Sorts an array according to the callback's output on its elements.
	 * The callback's output is compared according to `PSUtils.compare` (in
	 * particular, it supports arrays so you can sort by multiple things).
	 */
	sortBy<T>(array: T[], callback: (a: T) => Comparable): T[];
	// Sorts an array according to `PSUtils.compare`. (Correctly sorts numbers, unlike `array.sort`)
	sortBy<T extends Comparable>(array: T[]): T[];
	sortBy<T>(array: T[], callback?: (a: T) => Comparable) {
		if (!callback) return (array as any[]).sort(PSUtils.compare);
		return array.sort((a, b) => PSUtils.compare(callback(a), callback(b)));
	}
};
// Sanitize a room ID by removing anything that isn't alphanumeric or `-`. Shouldn't actually do anything except against malicious input.
export function toRoomid(roomid: string) { return roomid.replace(/[^a-zA-Z0-9-]+/g, '').toLowerCase(); }
export function toName(name: any) {
	if (typeof name !== 'string' && typeof name !== 'number') return '';
	name = `${name}`.replace(/[|\s[\],\u202e]+/g, ' ').trim();
	if (name.length > 18) name = name.substr(0, 18).trim();
	// remove zalgo
	name = name.replace(
		/[\u0300-\u036f\u0483-\u0489\u0610-\u0615\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06ED\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]{3,}/g,
		''
	);
	name = name.replace(/[\u239b-\u23b9]/g, '');
	return name;
}
export interface SpriteData {
	w: number;
	h: number;
	y?: number;
	gen?: number;
	url?: string;
	rawHTML?: string;
	pixelated?: boolean;
	isFrontSprite?: boolean;
	cryurl?: string;
	shiny?: boolean;
}
export interface TeambuilderSpriteData {
	x: number;
	y: number;
	h?: number;
	spriteDir: string;
	spriteid: string;
	shiny?: boolean;
}
export const Dex = new class implements ModdedDex {
	readonly Ability = Ability;
	readonly Item = Item;
	readonly Move = Move;
	readonly Flags = Flag;
	readonly Species = Species;
	readonly gen = 9;
	readonly modid = 'gen9' as ID;
	readonly cache = null!;
	formats: any = null;
	readonly REGULAR = 0;
	readonly WEAK = 1;
	readonly RESIST = 2;
	readonly IMMUNE = 3;
	readonly statNames: readonly Dex.StatName[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
	readonly statNamesExceptHP: readonly Dex.StatNameExceptHP[] = ['atk', 'def', 'spa', 'spd', 'spe'];
	pokeballs: string[] | null = null;
	resourcePrefix = (() => {
		let prefix = '';
		if (window.document?.location?.protocol !== 'http:') prefix = 'https:';
		return `${prefix}//${window.Config ? Config.routes.client : 'play.pokemonshowdown.com'}/`;
	})();
	indigostarstormPrefix = (() => {
		let iprefix = '';
		if (window.document?.location?.protocol !== 'http:') iprefix = 'https:';
		return `${iprefix}//${window.Config ? Config.routes.client : 'https://github.com/CrimsonGaia/pokemon-showdown-client/tree/master/play.pokemonshowdown.com/sprites/'}`;
	})();
	fxPrefix = (() => {
		const protocol = (window.document?.location?.protocol !== 'http:') ? 'https:' : '';
		return `${protocol}//${window.Config ? Config.routes.client : 'play.pokemonshowdown.com'}/fx/`;
	})();
	loadedSpriteData = { xy: 1, bw: 0 };
	moddedDexes: { [mod: string]: ModdedDex } = {};
	/**
	 * April Fools' Day setting:
	 * * `true` = FULL, all jokes on
	 * * `'sprites'` = SPRITES, only sprites and taunts
	 * * `false | null | undefined` = OFF
	 */
	afdMode?: boolean | 'sprites';
	mod(modid: ID): ModdedDex {
		if (modid === 'gen9') return this;
		if (!window.BattleTeambuilderTable) return this;
		if (modid in this.moddedDexes) { return this.moddedDexes[modid]; }
		this.moddedDexes[modid] = new ModdedDex(modid);
		return this.moddedDexes[modid];
	}
	forGen(gen: number): ModdedDex {
		if (!gen) return this;
		return this.mod(`gen${gen}` as ID);
	}
	formatGen(format: string) {
		const formatid = toID(format);
		if (!formatid) return Dex.gen;
		if (!formatid.startsWith('gen')) return 6;
		return parseInt(formatid.charAt(3)) || Dex.gen;
	}
	forFormat(format: string): ModdedDex {
		let dex = Dex.forGen(Dex.formatGen(format));
		const formatid = toID(format).slice(4);
		if (dex.gen === 7 && formatid.includes('letsgo')) { dex = Dex.mod('gen7letsgo' as ID); }
		if (dex.gen === 8 && formatid.includes('bdsp')) { dex = Dex.mod('gen8bdsp' as ID); }
		if (dex.gen === 9 && (formatid.includes('indigostarstorm') || formatid.includes('isl'))) { dex = Dex.mod('gen9indigostarstorm' as ID); }
		return dex;
	}
	resolveAvatar(avatar: string): string {
		if (window.BattleAvatarNumbers && avatar in BattleAvatarNumbers) { avatar = BattleAvatarNumbers[avatar]; }
		if (avatar.startsWith('#')) { return Dex.resourcePrefix + 'sprites/trainers-custom/' + toID(avatar.substr(1)) + '.png'; }
		if (avatar.includes('.') && window.Config?.server?.registered) {
			// custom avatar served by the server
			const protocol = (Config.server.port === 443) ? 'https' : 'http';
			const server = `${protocol}://${Config.server.host}:${Config.server.port}`;
			return `${server}/avatars/${encodeURIComponent(avatar).replace(/%3F/g, '?')}`;
		}
		return Dex.resourcePrefix + 'sprites/trainers/' + Dex.sanitizeName(avatar || 'unknown') + '.png';
	}
	/**
	 * This is used to sanitize strings from data files like `moves.js` and `teambuilder-tables.js`.
	 * This makes sure untrusted strings can't wreak havoc if someone forgets to escape it before putting it in HTML.
	 * None of these characters belong in these files, anyway. (They can be used in move descriptions, but those are served from `text.js`, which are definitely always treated as unsanitized.)
	 */
	sanitizeName(name: any) {
		if (!name) return '';
		return ('' + name)
			.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
			.slice(0, 50);
	}
	prefs(prop: string) {
		// @ts-expect-error this is what I get for calling it Storage...
		return window.Storage?.prefs ? window.Storage.prefs(prop) : window.PS?.prefs?.[prop];
	}
	getShortName(name: string) {
		let shortName = name.replace(/[^A-Za-z0-9]+$/, '');
		if (shortName.includes('(')) { shortName += name.slice(shortName.length).replace(/[^()]+/g, '').replace(/\(\)/g, ''); }
		return shortName;
	}
	getEffect(name: string | null | undefined): PureEffect | Item | Ability | Move | Flag {
		name = (name || '').trim();
		if (name.substr(0, 5) === 'item:') { return Dex.items.get(name.substr(5).trim()); } 
		else if (name.substr(0, 8) === 'ability:') { return Dex.abilities.get(name.substr(8).trim()); } 
		else if (name.substr(0, 5) === 'move:') { return Dex.moves.get(name.substr(5).trim()); }
		let id = toID(name);
		return new PureEffect(id, name);
	}
	//region move definition
	moves = {
		allCache: null as Move[] | null,
		get: (nameOrMove: string | Move | null | undefined): Move => {
			if (nameOrMove && typeof nameOrMove !== 'string') { return nameOrMove; } // TODO: don't accept Moves here
			let name = nameOrMove || '';
			let id = toID(nameOrMove);
			if (window.BattleAliases && id in BattleAliases) {
				name = BattleAliases[id];
				id = toID(name);
			}
			if (!window.BattleMovedex) window.BattleMovedex = {};
			let data = window.BattleMovedex[id];
			if (data && typeof data.exists === 'boolean') return data;
			if (!data && id.substr(0, 11) === 'hiddenpower' && id.length > 11) {
				let [, hpWithType, hpPower] = /([a-z]*)([0-9]*)/.exec(id)!;
				data = {
					...(window.BattleMovedex[hpWithType] || {}),
					basePower: Number(hpPower) || 60,
				};
			}
			if (!data && id.substr(0, 6) === 'return' && id.length > 6) {
				data = {
					...(window.BattleMovedex['return'] || {}),
					basePower: Number(id.slice(6)),
				};
			}
			if (!data && id.substr(0, 11) === 'frustration' && id.length > 11) {
				data = {
					...(window.BattleMovedex['frustration'] || {}),
					basePower: Number(id.slice(11)),
				};
			}
			if (!data) data = { exists: false };
			let move = new Move(id, name, data);
			window.BattleMovedex[id] = move;
			return move;
		},
		all: (): readonly Move[] => {
			const moves: Move[] = [];
			const searchIndex: [string, string][] = window.BattleSearchIndex || [];
			for (const entry of searchIndex) {
				if (entry[1] === 'move') moves.push(this.moves.get(entry[0]));
			}
			return moves;
		},
	};
	getGen3Category(type: string) { return ['Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Psychic', 'Dark', 'Dragon',].includes(type) ? 'Special' : 'Physical'; }
	//region flag definition
	flags = {
		get: (nameOrFlag: string | Flag | null | undefined): Flag => {
			if (nameOrFlag && typeof nameOrFlag !== 'string') { return nameOrFlag; }
			let name = nameOrFlag || '';
			let id = toID(nameOrFlag);
			if (window.BattleAliases && id in BattleAliases) {
				name = BattleAliases[id];
				id = toID(name);
			}
			if (!window.BattleFlags) window.BattleFlags = {};
			let data = window.BattleFlags[id];
			if (data && typeof data.exists === 'boolean') return data;
			if (!data) data = { exists: false };
			let flag = new Flag(id, name, data);
			window.BattleFlags[id] = BattleFlags;
			return flag ;
		},
	};
		//region item definition
	items = {
		get: (nameOrItem: string | Item | null | undefined): Item => {
			if (nameOrItem && typeof nameOrItem !== 'string') { return nameOrItem; } // TODO: don't accept Items here
			let name = nameOrItem || '';
			let id = toID(nameOrItem);
			if (window.BattleAliases && id in BattleAliases) {
				name = BattleAliases[id];
				id = toID(name);
			}
			if (!window.BattleItems) window.BattleItems = {};
			let data = window.BattleItems[id];
			if (data && typeof data.exists === 'boolean') return data;
			if (!data) data = { exists: false };
			let item = new Item(id, name, data);
			window.BattleItems[id] = item;
			return item;
		},
	};
	//region ability definition
	abilities = {
		get: (nameOrAbility: string | Ability | null | undefined): Ability => {
			if (nameOrAbility && typeof nameOrAbility !== 'string') { return nameOrAbility; } // TODO: don't accept Abilities here
			let name = nameOrAbility || '';
			let id = toID(nameOrAbility);
			if (window.BattleAliases && id in BattleAliases) {
				name = BattleAliases[id];
				id = toID(name);
			}
			if (!window.BattleAbilities) window.BattleAbilities = {};
			let data = window.BattleAbilities[id];
			if (data && typeof data.exists === 'boolean') return data;
			if (!data) data = { exists: false };
			let ability = new Ability(id, name, data);
			window.BattleAbilities[id] = ability;
			return ability;
		},
	};
	//region species definition
	species = {
		get: (nameOrSpecies: string | Species | null | undefined): Species => {
			if (nameOrSpecies && typeof nameOrSpecies !== 'string') { return nameOrSpecies; } // TODO: don't accept Species' here
			let name = nameOrSpecies || '';
			let id = toID(nameOrSpecies);
			let formid = id;
			if (!window.BattlePokedexAltForms) window.BattlePokedexAltForms = {};
			if (formid in window.BattlePokedexAltForms) return window.BattlePokedexAltForms[formid];
			if (window.BattleAliases && id in BattleAliases) {
				name = BattleAliases[id];
				id = toID(name);
			} else if (window.BattlePokedex && !(id in BattlePokedex) && window.BattleBaseSpeciesChart) {
				for (const baseSpeciesId of BattleBaseSpeciesChart) {
					if (formid.startsWith(baseSpeciesId)) {
						id = baseSpeciesId;
						break;
					}
				}
			}
			if (!window.BattlePokedex) window.BattlePokedex = {};
			let data = window.BattlePokedex[id];
			let species: Species;
			if (data && typeof data.exists === 'boolean') { species = data; } 
			else {
				if (!data) data = { exists: false };
				if (!data.tier && data.baseSpecies && toID(data.baseSpecies) !== id) { data.tier = this.species.get(data.baseSpecies).tier; }
				data.nfe = data.id === 'dipplin' || !!(data as Species).evos?.some(evo => {
					const evoSpecies = this.species.get(evo);
					return !evoSpecies.isNonstandard || evoSpecies.isNonstandard === data.isNonstandard ||
						// Pokemon with Hisui evolutions
						evoSpecies.isNonstandard === "Unobtainable";
				});
				species = new Species(id, name, data);
				window.BattlePokedex[id] = species;
			}
			if (species.cosmeticFormes) {
				for (const forme of species.cosmeticFormes) {
					if (toID(forme) === formid) {
						species = new Species(formid, name, {
							...species,
							name: forme,
							forme: forme.slice(species.name.length + 1),
							baseForme: "",
							baseSpecies: species.name,
							otherFormes: null,
						});
						window.BattlePokedexAltForms[formid] = species;
						break;
					}
				}
			}
			return species;
		},
	};
	//region type definition
	types = {
		allCache: null as Type[] | null,
		namesCache: null as Dex.TypeName[] | null,
		get: (type: any): Type => {
			if (!type || typeof type === 'string') {
				const id = toID(type) as string;
				const name = id.substr(0, 1).toUpperCase() + id.substr(1);
				type = window.BattleTypeChart?.[id] || {};
				if (type.damageTaken) type.exists = true;
				if (!type.id) type.id = id;
				if (!type.name) type.name = name;
				if (!type.effectType) { type.effectType = 'Type'; }
			}
			return type;
		},
		all: (): readonly Type[] => {
			if (this.types.allCache) return this.types.allCache;
			const types = [];
			for (const id in (window.BattleTypeChart || {})) { types.push(Dex.types.get(id)); }
			if (types.length) this.types.allCache = types;
			return types;
		},
		names: (): readonly Dex.TypeName[] => {
			if (this.types.namesCache) return this.types.namesCache;
			const names = this.types.all().map(type => type.name as Dex.TypeName);
			names.splice(names.indexOf('Stellar'), 1);
			if (names.length) this.types.namesCache = names;
			return names;
		},
		isName: (name: string | null): boolean => {
			const id = toID(name);
			if (name !== id.substr(0, 1).toUpperCase() + id.substr(1)) return false;
			return window.BattleTypeChart?.hasOwnProperty(id);
		},
	};
	hasAbility(species: Species, ability: string) {
		for (const i in species.abilities) { if (ability === species.abilities[i as '0']) return true; }
		return false;
	}
	loadSpriteData(gen: 'xy' | 'bw') {
		if (this.loadedSpriteData[gen]) return;
		this.loadedSpriteData[gen] = 1;
		let path = $('script[src*="pokedex-mini.js"]').attr('src') || '';
		let qs = '?' + (path.split('?')[1] || '');
		path = ((/.+?(?=data\/pokedex-mini\.js)/.exec(path)) || [])[0] || '';
		let el = document.createElement('script');
		el.src = path + 'data/pokedex-mini-bw.js' + qs;
		document.getElementsByTagName('body')[0].appendChild(el);
	}
	getSpriteData(pokemon: Pokemon | Species | string, isFront: boolean, options: { gen?: number, shiny?: boolean, gender?: Dex.GenderName, afd?: boolean, noScale?: boolean, mod?: string, } = { gen: 6 }) {
		const mechanicsGen = options.gen || 6;
		if (pokemon instanceof Pokemon) {
			if (pokemon.volatiles.transform) {
				options.shiny = pokemon.volatiles.transform[2];
				options.gender = pokemon.volatiles.transform[3];
			} else {
				options.shiny = pokemon.shiny;
				options.gender = pokemon.gender;
			}
			pokemon = pokemon.getSpeciesForme();
		}
		const species = Dex.species.get(pokemon);
		let spriteData = { gen: mechanicsGen, w: 96, h: 96, y: 0, url: Dex.resourcePrefix + 'sprites/', pixelated: true, isFrontSprite: false, cryurl: '', shiny: options.shiny, };
		let name = species.spriteid;
		let dir;
		let facing;
		if (isFront) {
			spriteData.isFrontSprite = true;
			dir = '';
			facing = 'front';
		} else {
			dir = '-back';
			facing = 'back';
		}
		// Decide which gen sprites to use.
		// There are several different generations we care about here:
		//   - mechanicsGen: the generation number of the mechanics and battle (options.gen)
		//   - graphicsGen: the generation number of sprite/field graphics the user has requested.
		//     This will default to mechanicsGen, but may be altered depending on user preferences.
		//   - spriteData.gen: the generation number of a the specific Pokemon sprite in question.
		//     This defaults to graphicsGen, but if the graphicsGen doesn't have a sprite for the Pokemon
		//     (eg. Darmanitan in graphicsGen 2) then we go up gens until it exists.
		let graphicsGen = mechanicsGen;
		if (Dex.prefs('nopastgens')) graphicsGen = 6;
		if (Dex.prefs('bwgfx') && graphicsGen >= 6) graphicsGen = 5;
		spriteData.gen = Math.max(graphicsGen, Math.min(species.gen, 5));
		const baseDir = ['', 'gen1', 'gen2', 'gen3', 'gen4', 'gen5', '', '', '', ''][spriteData.gen];
		let miscData = null;
		let speciesid = species.id;
		if (window.BattlePokemonSprites) miscData = BattlePokemonSprites[speciesid];
		if (!miscData && window.BattlePokemonSpritesBW) miscData = BattlePokemonSpritesBW[speciesid];
		if (!miscData) miscData = {};
		if (miscData.num !== 0 && miscData.num > -5000) {
			let baseSpeciesid = toID(species.baseSpecies);
			spriteData.cryurl = 'audio/cries/' + baseSpeciesid;
			let formeid = species.formeid;
			if (species.isMega || formeid && (
				formeid === '-crowned' ||
				formeid === '-eternal' ||
				formeid === '-four' ||
				formeid === '-hangry' ||
				formeid === '-hero' ||
				formeid === '-lowkey' ||
				formeid === '-noice' ||
				formeid === '-primal' ||
				formeid === '-rapidstrike' ||
				formeid === '-roaming' ||
				formeid === '-school' ||
				formeid === '-sky' ||
				formeid === '-starter' ||
				formeid === '-super' ||
				formeid === '-therian' ||
				formeid === '-unbound' ||
				baseSpeciesid === 'calyrex' ||
				baseSpeciesid === 'kyurem' ||
				baseSpeciesid === 'cramorant' ||
				baseSpeciesid === 'indeedee' ||
				baseSpeciesid === 'lycanroc' ||
				baseSpeciesid === 'necrozma' ||
				baseSpeciesid === 'oinkologne' ||
				baseSpeciesid === 'oricorio' ||
				baseSpeciesid === 'slowpoke' ||
				baseSpeciesid === 'tatsugiri' ||
				baseSpeciesid === 'zygarde'
			)) { spriteData.cryurl += formeid; }
			spriteData.cryurl += '.mp3';
		}
		if (options.shiny && mechanicsGen > 1) dir += '-shiny';
		// April Fool's 2014
		if (Dex.afdMode || options.afd) {
			// Explicit false check above means AFD will be off if the user disables it - no matter what
			dir = 'afd' + dir;
			spriteData.url += dir + '/' + name + '.png';
			// Duplicate code but needed to make AFD tinymax work
			// April Fool's 2020
			return spriteData;
		}
		// Mod Cries
		if (options.mod) {
			spriteData.cryurl = `sprites/${options.mod}/audio/${toID(species.baseSpecies)}`;
			spriteData.cryurl += '.mp3';
		}
		let animatedSprite = false;
		if (!Dex.prefs('noanim') && !Dex.prefs('nogif') && spriteData.gen >= 5) {
			const animationArray: [AnyObject, string][] = [];
			if (baseDir === '' && window.BattlePokemonSprites) { animationArray.push([BattlePokemonSprites[speciesid], '']); }
			if (window.BattlePokemonSpritesBW) { animationArray.push([BattlePokemonSpritesBW[speciesid], 'gen5']); }
			for (const [animationData, animDir] of animationArray) {
				if (!animationData) continue;
				if (animationData[facing + 'f'] && options.gender === 'F') facing += 'f';
				if (!animationData[facing]) continue;
				if (facing.endsWith('f')) name += '-f';
				if (spriteData.gen >= 6) spriteData.pixelated = false;
				dir = animDir + 'ani' + dir;
				spriteData.w = animationData[facing].w;
				spriteData.h = animationData[facing].h;
				spriteData.url += dir + '/' + name + '.gif';
				animatedSprite = true;
				break;
			}
		}
		if (!animatedSprite) {
			// There is no entry or enough data in pokedex-mini.js
			// Handle these in case-by-case basis; either using BW sprites or matching the played gen.
			dir = (baseDir || 'gen5') + dir;
			// Gender differences don't exist prior to Gen 4,
			// so there are no sprites for it
			if (spriteData.gen >= 4 && miscData['frontf'] && options.gender === 'F') { name += '-f'; }
			spriteData.url += dir + '/' + name + '.png';
		}
		if (!options.noScale) { if (graphicsGen > 4) {} // no scaling
			else if (spriteData.isFrontSprite) {
				spriteData.w *= 2;
				spriteData.h *= 2;
				spriteData.y += -16;
			} 
			else { // old gen backsprites are multiplied by 1.5x by the 3D engine
				spriteData.w *= 2 / 1.5;
				spriteData.h *= 2 / 1.5;
				spriteData.y += -11;
			}
			if (spriteData.gen <= 2) spriteData.y += 2;
		}
		return spriteData;
	}
	getPokemonIconNum(id: ID, isFemale?: boolean, facingLeft?: boolean) {
		let num = 0;
		if (window.BattlePokemonSprites?.[id]?.num) { num = BattlePokemonSprites[id].num; } 
		else if (window.BattlePokedex?.[id]?.num) { num = BattlePokedex[id].num; }
		if (num < 0) num = 0;
		if (num > 1025) num = 0;
		if (window.BattlePokemonIconIndexes?.[id]) { num = BattlePokemonIconIndexes[id]; }
		if (isFemale) {
			if (['unfezant', 'frillish', 'jellicent', 'meowstic', 'pyroar'].includes(id)) { num = BattlePokemonIconIndexes[id + 'f']; }
		}
		if (facingLeft) { if (BattlePokemonIconIndexesLeft[id]) { num = BattlePokemonIconIndexesLeft[id]; } }
		return num;
	}
	getPokemonIcon(pokemon: string | Pokemon | ServerPokemon | Dex.PokemonSet | null, facingLeft?: boolean) {
		if (pokemon === 'pokeball') { return `background:transparent url(${Dex.resourcePrefix}sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -0px 4px`; } 
		else if (pokemon === 'pokeball-statused') { return `background:transparent url(${Dex.resourcePrefix}sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -40px 4px`; } 
		else if (pokemon === 'pokeball-fainted') { return `background:transparent url(${Dex.resourcePrefix}sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -80px 4px;opacity:.4;filter:contrast(0)`; } 
		else if (pokemon === 'pokeball-none') { return `background:transparent url(${Dex.resourcePrefix}sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -80px 4px`; }
		let id = toID(pokemon);
		if (!pokemon || typeof pokemon === 'string') pokemon = null;
		// @ts-expect-error safe, but too lazy to cast
		if (pokemon?.speciesForme) id = toID(pokemon.speciesForme);
		// @ts-expect-error safe, but too lazy to cast
		if (pokemon?.species) id = toID(pokemon.species);
		// @ts-expect-error safe, but too lazy to cast
		if (pokemon?.volatiles?.formechange && !pokemon.volatiles.transform) {
			// @ts-expect-error safe, but too lazy to cast
			id = toID(pokemon.volatiles.formechange[1]);
		}
		let num = this.getPokemonIconNum(id, pokemon?.gender === 'F', facingLeft);
		let top = Math.floor(num / 12) * 30;
		let left = (num % 12) * 40;
		let fainted = ((pokemon as Pokemon | ServerPokemon)?.fainted ?
			`;opacity:.6;filter:grayscale(60%) brightness(.5)` : ``);
		return `background:transparent url(${Dex.resourcePrefix}sprites/pokemonicons-sheet.png?v19) no-repeat scroll -${left}px -${top}px${fainted}`;
	}
	getTeambuilderSpriteData(pokemon: any, dex: ModdedDex = Dex): TeambuilderSpriteData {
		let gen = dex.gen;
		let id = toID(pokemon.species || pokemon);
		let species = Dex.species.get(id);
		let spriteid: string;
		if (typeof pokemon === 'string') { spriteid = species.spriteid || id; } 
		else {
			spriteid = pokemon.spriteid;
			if (pokemon.species && !spriteid) { spriteid = species.spriteid || id; }
		}
		if (species.exists === false) return { spriteDir: 'sprites/gen5', spriteid: '0', x: 10, y: 5 };
		if (Dex.afdMode) {
			return {
				spriteid,
				spriteDir: 'sprites/afd',
				shiny: !!pokemon.shiny,
				x: 10,
				y: 5,
			};
		}
		const spriteData: TeambuilderSpriteData = {
			spriteid,
			spriteDir: 'sprites/dex',
			x: -2,
			y: -3,
		};
		if (pokemon.shiny) spriteData.shiny = true;
		if (dex.modid === 'gen7letsgo') gen = 8;
		if (Dex.prefs('nopastgens')) gen = 9;
		if (Dex.prefs('bwgfx') && gen > 5) gen = 5;
		let homeExists = (!species.isNonstandard || !['CAP', 'Custom'].includes(species.isNonstandard) ||
			species.id === "xerneasneutral") && ![
			"floetteeternal", "pichuspikyeared", "pikachubelle", "pikachucosplay", "pikachulibre", "pikachuphd", "pikachupopstar", "pikachurockstar",
		].includes(species.id);
		if (gen >= 8 && homeExists) {
			spriteData.spriteDir = 'sprites/home-centered';
			spriteData.x = 8;
			spriteData.y = 10;
			spriteData.h = 96;
			return spriteData;
		}
		let xydexExists = (!species.isNonstandard || species.isNonstandard === 'Past' || species.isNonstandard === 'CAP') || [
			"pikachustarter", "eeveestarter", "meltan", "melmetal", "pokestarufo", "pokestarufo2", "pokestarbrycenman", "pokestarmt", "pokestarmt2", "pokestargiant", "pokestarhumanoid", "pokestarmonster", "pokestarf00", "pokestarf002", "pokestarspirit",
		].includes(species.id);
		if (species.gen >= 8 && species.isNonstandard !== 'CAP') xydexExists = false;
		if (gen >= 6 && xydexExists) {
			if (species.gen >= 7) {
				spriteData.x = -6;
				spriteData.y = -7;
			} else if (id.substr(0, 6) === 'arceus') {
				spriteData.x = -2;
				spriteData.y = 7;
			} else if (id === 'garchomp') {
				spriteData.x = -2;
				spriteData.y = 2;
			} else if (id === 'garchompmega') {
				spriteData.x = -2;
				spriteData.y = 0;
			}
			return spriteData;
		}
		spriteData.spriteDir = 'sprites/gen5';
		if (gen <= 1 && species.gen <= 1) spriteData.spriteDir = 'sprites/gen1';
		else if (gen <= 2 && species.gen <= 2) spriteData.spriteDir = 'sprites/gen2';
		else if (gen <= 3 && species.gen <= 3) spriteData.spriteDir = 'sprites/gen3';
		else if (gen <= 4 && species.gen <= 4) spriteData.spriteDir = 'sprites/gen4';
		spriteData.x = 10;
		spriteData.y = 5;
		return spriteData;
	}
	getTeambuilderSprite(pokemon: any, dex?: ModdedDex, xOffset = 0, yOffset = 0) {
		if (!pokemon) return '';
		const data = this.getTeambuilderSpriteData(pokemon, dex);
		const shiny = (data.shiny ? '-shiny' : '');
		const resize = (data.h ? `background-size:${data.h}px` : '');
		return `background-image:url(${Dex.resourcePrefix}${data.spriteDir}${shiny}/${data.spriteid}.png);background-position:${data.x + xOffset}px ${data.y + yOffset}px;background-repeat:no-repeat;${resize}`;
	}
	//region Get Icons
	getItemIcon(item: any, scale = 1 / 2) { // call with Dex.getItemIcon(item, X / Y) for fractional scaling, if no 2nd argument is provided, defaults to 1/2 size
		let itemData = item;
		if (typeof item === 'string') { itemData = Dex.items.get(item); }
		const filename = encodeURIComponent(itemData?.name || item);
		const size = 96 * scale;
		return `background:transparent url(${Dex.resourcePrefix}sprites/itemicons/${filename}.png) no-repeat center center;background-size:${size}px ${size}px;`;
	}
	getItemIconpixel(item: any, scale = 1 / 2) { // call with Dex.getItemIcon(item, X / Y) for fractional scaling, if no 2nd argument is provided, defaults to 1/2 size
		let itemData = item;
		if (typeof item === 'string') { itemData = Dex.items.get(item); }
		const filename = encodeURIComponent(itemData?.name || item);
		const size = 96 * scale;
		return `background:transparent url(${Dex.resourcePrefix}sprites/itemiconspixel/${filename}.png) no-repeat center center;background-size:${size}px ${size}px;`;
	}
	getTypeIcon(type: string | null, b?: boolean, type2?: string | null) {
		let t1 = type ? this.types.get(type).name : '???';
		let t2 = type2 && this.types.get(type2)
		? this.types.get(type2).name
		: null;
		const icon = (t: string) => {
			let sanitized = t.replace(/\?/g, '%3f');
			return `<img src="${Dex.resourcePrefix}sprites/types/${sanitized}.png" alt="${t}" height="14" width="32" class="pixelated${b ? ' b' : ''}" />`;
		};
		return icon(t1) + (t2 ? icon(t2) : '');
	}

	getFlagIcon(flag: string | null,) {
		if (!flag) return '\u2014'; // em dash
		const flagID = toID(flag);
		let sanitizedFlag = '';
		switch (flagID) {
		case 'contact': sanitizedFlag = 'Contact'; break;
		case 'binding': case 'bind': sanitizedFlag = 'Bind'; break;
		case 'bite': sanitizedFlag = 'Bite'; break;
		case 'bomb': sanitizedFlag = 'Bomb'; break;
		case 'bullet': sanitizedFlag = 'Bullet'; break;
		case 'drain': sanitizedFlag = 'Drain'; break;
		case 'explosive': sanitizedFlag = 'Explosive'; break;
		case 'fist': case 'punch': sanitizedFlag = 'Punch'; break;
		case 'powder': sanitizedFlag = 'Powder'; break;
		case 'pulse': sanitizedFlag = 'Pulse'; break;
		case 'slicing': case 'slice': sanitizedFlag = 'Slice'; break;
		case 'sound': sanitizedFlag = 'Sound'; break;
		case 'wind': sanitizedFlag = 'Wind'; break;
		case 'airborne': sanitizedFlag = 'Airborne'; break;
		case 'aura': sanitizedFlag = 'Aura'; break;
		case 'beam': sanitizedFlag = 'Beam'; break;
		case 'breath': sanitizedFlag = 'Breath'; break;
		case 'claw': sanitizedFlag = 'Claw'; break;
		case 'crash': sanitizedFlag = 'Crash'; break;
		case 'crush': sanitizedFlag = 'Crush'; break;
		case 'dance': sanitizedFlag = 'Dance'; break;
		case 'heal': sanitizedFlag = 'Heal'; break;
		case 'kick': sanitizedFlag = 'Kick'; break;
		case 'launch': sanitizedFlag = 'Launch'; break;
		case 'light': sanitizedFlag = 'Light'; break;
		case 'lunar': sanitizedFlag = 'Lunar'; break;
		case 'magic': sanitizedFlag = 'Magic'; break;
		case 'pierce': sanitizedFlag = 'Pierce'; break;
		case 'shadow': sanitizedFlag = 'Shadow'; break;
		case 'solar': sanitizedFlag = 'Solar'; break;
		case 'spin': sanitizedFlag = 'Spin'; break;
		case 'sweep': sanitizedFlag = 'Sweep'; break;
		case 'throw': sanitizedFlag = 'Throw'; break;
		case 'weapon': sanitizedFlag = 'Weapon'; break;
		case 'wing': sanitizedFlag = 'Wing'; break;
		case 'bypassprotect': sanitizedFlag = 'Bypass Protect'; break;
		case 'nonreflectable': sanitizedFlag = 'Non-Reflectable'; break;
		case 'nonmirror': sanitizedFlag = 'Non-Mirror'; break;
		case 'nonsnatchable': sanitizedFlag = 'Non-Snatchable'; break;
		case 'bypasssubstitute': sanitizedFlag = 'Bypass Substitute'; break;
		default:
			sanitizedFlag = 'undefined';
			break;
		}
		const flagText = sanitizedFlag.charAt(0).toUpperCase() + sanitizedFlag.slice(1);
		return `<img src="${Dex.resourcePrefix}sprites/flagicons/${sanitizedFlag}.png" alt="${flagText}" height="32" width="132" class="pixelated" onerror="this.style.display='none'; this.nextSibling.style.display='inline';" /><span style="display: none;">${flagText}</span>`;
	}
	statusNames = ['par', 'psn', 'tox', 'brn', 'frz', 'slp', 'aura', 'bubbleblight', 'curse', 'dragonblight', 'fear', 'frostbite', 'drowsy', 'confusion', 'flinch'];
	isStatusName(name: string | null) {
		if (!name) return false;
		return this.statusNames.indexOf(toID(name)) !== -1;
	}
	getStatusIcon(status: string | null) {
		if (!status) return '\u2014'; // em dash
		const statusID = toID(status);
		let sanitizedStatus = '';
		switch (statusID) {
		case 'par': sanitizedStatus = 'Paralysis'; break;
		case 'psn': sanitizedStatus = 'Poison'; break;
		case 'tox': sanitizedStatus = 'Toxic'; break;
		case 'brn': sanitizedStatus = 'Burn'; break;
		case 'frz': sanitizedStatus = 'Frozen'; break;
		case 'slp': sanitizedStatus = 'Sleep'; break;
		case 'aura': sanitizedStatus = 'Aura'; break;
		case 'bubbleblight': sanitizedStatus = 'Bubbleblight'; break;
		case 'curse': sanitizedStatus = 'Curse'; break;
		case 'dragonblight': sanitizedStatus = 'Dragonblight'; break;
		case 'fear': sanitizedStatus = 'Fear'; break;
		case 'frostbite': sanitizedStatus = 'Frostbite'; break;
		case 'drowsy': sanitizedStatus = 'Drowsy'; break;
		case 'confusion': sanitizedStatus = 'Confused'; break;
		case 'flinch': sanitizedStatus = 'Flinch'; break;
		default:
			sanitizedStatus = 'undefined';
			break;
		}
		const statusText = sanitizedStatus.charAt(0).toUpperCase() + sanitizedStatus.slice(1);
		return `<img src="${Dex.resourcePrefix}sprites/status-is/${sanitizedStatus}_IS.png" alt="${statusText}" height="32" width="132" class="pixelated" onerror="this.style.display='none'; this.nextSibling.style.display='inline';" /><span style="display: none;">${statusText}</span>`;
	}
	fieldEffectNames = ['sun', 'sunnyday', 'harshsunshine', 'desolateland', 'rain', 'raindance', 'heavyrain', 'primordialsea', 'sand', 'sandstorm', 'hail', 'snow', 'snowscape', 'fog', 'strongwinds', 'deltastream', 'electricterrain', 'grassyterrain', 'mistyterrain', 'psychicterrain'];
	isFieldEffectName(name: string | null) {
		if (!name) return false;
		return this.fieldEffectNames.indexOf(toID(name)) !== -1;
	}
	getFieldEffectIcon(effect: string | null) {
		if (!effect) return '\u2014'; // em dash
		const effectID = toID(effect);
		let sanitizedEffect = '';
		switch (effectID) {
		case 'sunnyday': sanitizedEffect = 'Sun'; break;
		case 'raindance': sanitizedEffect = 'Rain'; break;
		case 'sandstorm': sanitizedEffect = 'Sandstorm'; break;
		case 'hail': sanitizedEffect = 'Hail'; break;
		case 'snowscape': sanitizedEffect = 'Snow'; break;
		case 'turbulentwinds': sanitizedEffect = 'Turbulent Winds'; break;
		case 'electricterrain': sanitizedEffect = 'Electric Terrain'; break;
		case 'grassyterrain': sanitizedEffect = 'Grassy Terrain'; break;
		case 'mistyterrain': sanitizedEffect = 'Misty Terrain'; break;
		case 'psychicterrain': sanitizedEffect = 'Psychic Terrain'; break;
		case 'toxicterrain': sanitizedEffect = 'Toxic Terrain'; break;
		default:
			sanitizedEffect = 'undefined';
			break;
		}
		const filename = encodeURIComponent(sanitizedEffect);
		return `<img src="${Dex.resourcePrefix}sprites/fieldeffects/${filename}.png" alt="${sanitizedEffect}" height="14" width="58" class="pixelated" onerror="this.style.display='none'; this.nextSibling.style.display='inline';" /><span style="display: none;">${sanitizedEffect}</span>`;
	}
	getCategoryIcon(category: string | null) {
		const categoryID = toID(category);
		let sanitizedCategory = '';
		switch (categoryID) {
		case 'physical':
		case 'special':
		case 'status':
			sanitizedCategory = categoryID.charAt(0).toUpperCase() + categoryID.slice(1);
			break;
		default:
			sanitizedCategory = 'undefined';
			break;
		}
		return `<img src="${Dex.resourcePrefix}sprites/categories/${sanitizedCategory}.png" alt="${sanitizedCategory}" height="14" width="32" class="pixelated" onerror="this.style.display='none'; this.nextSibling.style.display='inline';" /><span style="display: none; font-size: 10px; font-weight: bold; text-align: center;">${sanitizedCategory}</span>`;
	}
	getPokeballs() {
		if (this.pokeballs) return this.pokeballs;
		this.pokeballs = [];
		window.BattleItems ||= {};
		for (const data of Object.values(BattleItems)) {
			if (!data.isPokeball) continue;
			this.pokeballs.push(data.name);
		}
		return this.pokeballs;
	}
};
//region Modded Dex
export class ModdedDex {
	readonly gen: number;
	readonly modid: ID;
	readonly cache = {
		Moves: {} as { [k: string]: Move },
		Flags: {} as { [k: string]: Flag },
		Items: {} as { [k: string]: Item },
		Abilities: {} as { [k: string]: Ability },
		Species: {} as { [k: string]: Species },
		Types: {} as { [k: string]: Dex.Effect },
	};
	pokeballs: string[] | null = null;
	formats: any;

	constructor(modid: ID) {
		this.modid = modid;
		const gen = parseInt(modid.charAt(3), 10);
		if (!modid.startsWith('gen') || !gen) throw new Error("Unsupported modid");
		this.gen = gen;
	}
	//region ISL move definition
	moves = {
		get: (name: string): Move => {
			let id = toID(name);
			if (window.BattleAliases && id in BattleAliases) {
				name = BattleAliases[id];
				id = toID(name);
			}
			if (this.cache.Moves.hasOwnProperty(id)) return this.cache.Moves[id];
			const base: any = Dex.moves.get(name);
			let data: any = { ...base };
			for (let i = Dex.gen - 1; i >= this.gen; i--) {
				const table = window.BattleTeambuilderTable?.[`gen${i}`];
				if (table?.overrideMoveData && id in table.overrideMoveData) Object.assign(data, table.overrideMoveData[id]);
			}
			const modTable = window.BattleTeambuilderTable?.[this.modid];
			const modHas = !!(modTable?.overrideMoveData && id in modTable.overrideMoveData);
			if (modHas) Object.assign(data, modTable.overrideMoveData[id]);
			if (modHas && base && base.exists === false) {
				data.exists = true;
				data.id ||= id;
				data.name ||= name;
			}
			if (this.gen <= 3 && data.category !== 'Status') data.category = Dex.getGen3Category(data.type);
			const move = new Move(id, data.name || name, data);
			this.cache.Moves[id] = move;
			return move;
		},
		all: (): readonly Move[] => {
			const moves: Move[] = [];
			const searchIndex: [string, string][] = window.BattleSearchIndex || [];
			for (const entry of searchIndex) {
				if (entry[1] === 'move') moves.push(this.moves.get(entry[0]));
			}
			return moves;
		},
	};
	//region ISL flag definition
	flags = {
		get: (name: string): Flag => {
			let id = toID(name);
			if (window.BattleAliases && id in BattleAliases) {
				name = BattleAliases[id];
				id = toID(name);
			}
			if (this.cache.Flags.hasOwnProperty(id)) return this.cache.Flags[id];
			const base: any = Dex.flags.get(name);
			let data: any = { ...base };
			for (let i = Dex.gen - 1; i >= this.gen; i--) {
				const table = window.BattleTeambuilderTable?.[`gen${i}`];
				if (table?.overrideFlagData && id in table.overrideFlagData) Object.assign(data, table.overrideFlagData[id]);
			}
			const modTable = window.BattleTeambuilderTable?.[this.modid];
			const modHas = !!(modTable?.overrideFlagData && id in modTable.overrideFlagData);
			if (modHas) Object.assign(data, modTable.overrideFlagData[id]);
			if (modHas && base && base.exists === false) {
				data.exists = true;
				data.id ||= id;
				data.name ||= name;
			}
			const flag = new Flag(id, data.name || name, data);
			this.cache.Flags[id] = flag;
			return flag;
		},
	};
	//region ISL item definition
	items = {
		get: (name: string): Item => {
			let id = toID(name);
			if (window.BattleAliases && id in BattleAliases) {
				name = BattleAliases[id];
				id = toID(name);
			}
			if (this.cache.Items.hasOwnProperty(id)) return this.cache.Items[id];
			const base: any = Dex.items.get(name);
			let data: any = { ...base };
			for (let i = Dex.gen - 1; i >= this.gen; i--) {
				const table = window.BattleTeambuilderTable?.[`gen${i}`];
				if (table?.overrideItemData && id in table.overrideItemData) Object.assign(data, table.overrideItemData[id]);
			}
			const modTable = window.BattleTeambuilderTable?.[this.modid];
			const modHas = !!(modTable?.overrideItemData && id in modTable.overrideItemData);
			if (modHas) Object.assign(data, modTable.overrideItemData[id]);
			if (modHas && base && base.exists === false) {
				data.exists = true;
				data.id ||= id;
				data.name ||= name;
			}
			const item = new Item(id, data.name || name, data);
			this.cache.Items[id] = item;
			return item;
		},
	};
	//region ISL ability definition
	abilities = {
		get: (name: string): Ability => {
			let id = toID(name);
			if (window.BattleAliases && id in BattleAliases) {
				name = BattleAliases[id];
				id = toID(name);
			}
			if (this.cache.Abilities.hasOwnProperty(id)) return this.cache.Abilities[id];
			const base: any = Dex.abilities.get(name);
			let data: any = { ...base };
			for (let i = Dex.gen - 1; i >= this.gen; i--) {
				const table = window.BattleTeambuilderTable?.[`gen${i}`];
				if (table?.overrideAbilityData && id in table.overrideAbilityData) Object.assign(data, table.overrideAbilityData[id]);
			}
			const modTable = window.BattleTeambuilderTable?.[this.modid];
			const modHas = !!(modTable?.overrideAbilityData && id in modTable.overrideAbilityData);
			if (modHas) Object.assign(data, modTable.overrideAbilityData[id]);
			if (modHas && base && base.exists === false) {
				data.exists = true;
				data.id ||= id;
				data.name ||= name;
			}
			const ability = new Ability(id, data.name || name, data);
			this.cache.Abilities[id] = ability;
			return ability;
		},
	};
	//region ISL species definition
	species = {
		get: (name: string): Species => {
			let id = toID(name);
			if (window.BattleAliases && id in BattleAliases) {
				name = BattleAliases[id];
				id = toID(name);
			}
			if (this.cache.Species.hasOwnProperty(id)) return this.cache.Species[id];
			const base: any = Dex.species.get(name);
			let data: any = { ...base };
			// inherited gen overrides
			for (let i = Dex.gen - 1; i >= this.gen; i--) {
				const table = window.BattleTeambuilderTable?.[`gen${i}`];
				if (table?.overrideSpeciesData && id in table.overrideSpeciesData) Object.assign(data, table.overrideSpeciesData[id]);
			}
			// mod overrides (also used as full defs for NEW species later)
			const modTable = window.BattleTeambuilderTable?.[this.modid];
			const modHas = !!(modTable?.overrideSpeciesData && id in modTable.overrideSpeciesData);
			if (modHas) Object.assign(data, modTable.overrideSpeciesData[id]);
			// if base doesn't exist but mod defines it, make it real
			if (modHas && base && base.exists === false) {
				data.exists = true;
				data.id ||= id;
				data.name ||= name;
			}
			// Indigo Starstorm roster behavior:
			// Anything not explicitly in the gen9indigostarstorm teambuilder table is treated as Past,
			// so the client hides it the same way it hides non-roster mons in official gens.
			if (this.modid === 'gen9indigostarstorm') {
				let allowedSet = ISL_ALLOWED_CACHE.get(this);
				if (!allowedSet) {
					const allowedIds: ID[] = [];
					// Prefer tiers if present; otherwise use tierSet.
					const rows: any[] | undefined = (modTable as any)?.tiers || (modTable as any)?.tierSet;
					if (rows) {
						for (const row of rows) {
							// tiers can be "Pikachu" strings or ['pokemon','pikachu'] rows depending on build step
							if (typeof row === 'string') { allowedIds.push(toID(row) as ID); } 
							else if (Array.isArray(row) && row[0] === 'pokemon' && row[1]) { allowedIds.push(toID(row[1]) as ID); }
						}
					}
					allowedSet = new Set(allowedIds);
					ISL_ALLOWED_CACHE.set(this, allowedSet);
				}
				// Always keep custom mons
				const num = (data.num ?? base?.num) as number | undefined;
				const isCustom = typeof num === 'number' && (num >= 10000 || num < 0);
				// Allow forms if either the form OR its baseSpecies is allowed
				const baseId = toID(data.baseSpecies || data.name || name) as ID;
				const ok = isCustom || allowedSet.has(id) || allowedSet.has(baseId);
				if (!ok) data.isNonstandard = 'Past';
			}
			if (this.gen < 3 || this.modid === 'gen7letsgo') data.abilities = { 0: "No Ability" };
			if (modTable?.overrideTier && id in modTable.overrideTier) data.tier = modTable.overrideTier[id];
			if (!data.tier && data.baseSpecies && toID(data.baseSpecies) !== id) data.tier = this.species.get(data.baseSpecies).tier;
			if (data.gen && data.gen > this.gen) data.tier = 'Illegal';
			data.nfe = data.id === 'dipplin' || !!data.evos?.some((evo: string) => {
				const evoSpecies = this.species.get(evo);
				return !evoSpecies.isNonstandard || evoSpecies.isNonstandard === data.isNonstandard || evoSpecies.isNonstandard === "Unobtainable";
			});
			const species = new Species(id, data.name || name, data);
			this.cache.Species[id] = species;
			return species;
		},
	};
	types = {
		namesCache: null as readonly Dex.TypeName[] | null,
		names: (): readonly Dex.TypeName[] => {
			if (this.types.namesCache) return this.types.namesCache;
			const names = Dex.types.names();
			if (!names.length) return [];
			const curNames = [...names];
			const modTable = window.BattleTeambuilderTable?.[this.modid];
			if (modTable?.overrideTypeChart) {
				for (const typeId of Object.keys(modTable.overrideTypeChart)) {
					const typeName = typeId.charAt(0).toUpperCase() + typeId.slice(1);
					if (!curNames.includes(typeName as Dex.TypeName)) curNames.push(typeName as Dex.TypeName);
				}
			}
			this.types.namesCache = curNames;
			return curNames;
		},
		get: (name: string): Dex.Type => {
			const id = toID(name);
			name = id.substr(0, 1).toUpperCase() + id.substr(1);
			const modTablePre = window.BattleTeambuilderTable?.[this.modid];
			const modHasTypePatch = !!(modTablePre?.overrideTypeChart && id in modTablePre.overrideTypeChart);
			if (this.cache.Types.hasOwnProperty(id) && !modHasTypePatch) return this.cache.Types[id];
			let data = { ...Dex.types.get(name) };
			const modTable = window.BattleTeambuilderTable?.[this.modid];
			if (modTable) {
				if (modTable.removeType && id in modTable.removeType) { data.exists = false; }
				if (modTable.overrideTypeChart && id in modTable.overrideTypeChart) {
					data = { ...data, ...modTable.overrideTypeChart[id] };
					if ((data as any).damageTaken) (data as any).exists = true;
				}
			}
			for (let i = 7; i >= this.gen; i--) {
				const table = window.BattleTeambuilderTable[`gen${i}`];
				if (id in table.removeType) {
					data.exists = false;
					break;
				}
				if (id in table.overrideTypeChart) data = { ...data, ...table.overrideTypeChart[id] };
			}
			this.cache.Types[id] = data;
			return data;
		},
	};
	getPokeballs() {
		if (this.pokeballs) return this.pokeballs;
		this.pokeballs = [];
		window.BattleItems ||= {};
		for (const data of Object.values(BattleItems)) {
			if (data.gen && data.gen > this.gen) continue;
			if (!data.isPokeball) continue;
			this.pokeballs.push(data.name);
		}
		return this.pokeballs;
	}
}
if (typeof require === 'function') { // in Node
	global.Dex = Dex;
	global.toID = toID;
}