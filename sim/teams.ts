/**
 * Teams
 * Pokemon Showdown - http://pokemonshowdown.com/
 * Functions for converting and generating teams.
 * @license MIT
 */
import { Dex, toID } from './dex';
import type { PRNG, PRNGSeed } from './prng';
interface ExportOptions {
	hideStats?: boolean;
	removeNicknames?: boolean | ((nickname: string) => string | null);
}
export interface PokemonSet {
	// Nickname. Should be identical to its base species if not specified by the player, e.g. "Minior".
	name: string;
	/**
	 * Species name (including forme if applicable), e.g. "Minior-Red".
	 * This should always be converted to an id before use.
	 */
	species: string;
	/**
	 * This can be an id, e.g. "whiteherb" or a full name, e.g. "White Herb".
	 * This should always be converted to an id before use.
	 */
	item: string;
	/**
	 * This can be an id, e.g. "shieldsdown" or a full name,
	 * e.g. "Shields Down".
	 * This should always be converted to an id before use.
	 */
	ability: string;
	// Second ability (optional). This can be an id or a full name. This should always be converted to an id before use.
	ability2?: string;
	/**
	 * Which ability set is selected (1 or 2).
	 * Set 1 uses abilities['0'] and abilities['1']
	 * Set 2 uses abilities['H'] and abilities['S']
	 */
	abilitySet?: 1 | 2;
	/**
	 * Each move can be an id, e.g. "shellsmash" or a full name,
	 * e.g. "Shell Smash"
	 * These should always be converted to ids before use.
	 */
	guardAction?: string;
	moves: string[];
	// This can be an id, e.g. "adamant" or a full name, e.g. "Adamant". This should always be converted to an id before use.
	nature: string;
	gender: string;
	/**
	 * Effort Values, used in stat calculation.
	 * These must be between 0 and 255, inclusive.
	 * Also used to store AVs for Let's Go
	 */
	evs?: StatsTable;
	/**
	 * Individual Values, used in stat calculation.
	 * These must be between 0 and 31, inclusive.
	 *
	 * These are also used as DVs, or determinant values, in Gens
	 * 1 and 2, which are represented as even numbers from 0 to 30.
	 *
	 * In Gen 2-6, these must match the Hidden Power type.
	 *
	 * In Gen 7+, Bottle Caps means these can either match the
	 * Hidden Power type or 31.
	 */
	ivs: StatsTable;
	/**
	 * Juggle Values — replaces the classic EV/IV split entirely. IVs are
	 * always 31 for stat calculation purposes (see Battle#statModify); this is
	 * the only stat-investment number that matters. 0–64 per stat, 130 total.
	 */
	jvs?: StatsTable;
	/**
	 * This is usually between 1 and 100, inclusive,
	 * but the simulator supports levels up to 9999 for testing purposes.
	 */
	level: number;
	/**
	 * While having no direct competitive effect, certain Pokemon cannot
	 * be legally obtained as shiny, either as a whole or with certain
	 * event-only abilities or moves.
	 */
	shiny?: boolean;
	/**
	 * The pokeball this Pokemon is in. Like shininess, this property has no direct competitive effects, but has implications for
	 * event legality. For example, any Rayquaza that knows V-Create must be sent out from a Cherish Ball.
	 * TODO: actually support this in the validator, switching animations, and the teambuilder.
	 */
	pokeball?: string;
	// Tera Type
	teraType?: string;
	/**
	 * Pokemon size (XS, S, M, L, XL).
	 */
	size?: string;
}
export const Teams = new class Teams {
	pack(team: PokemonSet[] | null): string {
		if (!team) return '';
		function getJv(jvs: StatsTable, s: keyof StatsTable): string { return !jvs[s] ? '' : jvs[s].toString(); }
		let buf = '';
		for (const set of team) {
			if (buf) buf += ']';
			// name
			buf += (set.name || set.species);
			// species
			const id = this.packName(set.species || set.name);
			buf += `|${this.packName(set.name || set.species) === id ? '' : id}`;
			// ISL schema: size is a core field (placed before item)
			buf += `|${String(set.size || '').toUpperCase()}`;
			// item
			buf += `|${this.packName(set.item)}`;
			// ISL schema: abilities field is "abilitySet/ability/ability2"
			const abilitySet = (set.abilitySet === 2 ? 2 : 1);
			buf += `|${abilitySet}/${this.packName(set.ability)}/${this.packName(set.ability2)}`;
			// moves
			buf += '|' + set.moves.map(this.packName).join(',');
			// nature
			buf += `|${set.nature || ''}`;
			// gender
			if (set.gender) { buf += `|${set.gender}`; } 
			else { buf += '|'; }
			// jvs (this wire slot used to be classic IVs 
			let jvs = '|';
			if (set.jvs) { jvs = `|${getJv(set.jvs, 'hp')},${getJv(set.jvs, 'atk')},${getJv(set.jvs, 'def')},` + `${getJv(set.jvs, 'spa')},${getJv(set.jvs, 'spd')},${getJv(set.jvs, 'spe')}`; }
			if (jvs === '|,,,,,') { buf += '|'; } 
			else { buf += jvs; }
			// shiny
			if (set.shiny) { buf += '|S'; } 
			else { buf += '|'; }
			// level
			if (set.level && set.level !== 100) { buf += `|${set.level}`; } 
			else { buf += '|'; }
			// misc
			if (set.pokeball || set.teraType || set.abilitySet || set.guardAction) {
				buf += `,${this.packName(set.pokeball || '')}`;
				buf += `,${set.teraType || ''}`;
				buf += `,${set.abilitySet || ''}`;
				buf += `,${this.packName(set.guardAction || '')}`;
			}
		}
		return buf;
	}
	unpack(buf: string): PokemonSet[] | null {
		if (!buf) return null;
		if (typeof buf !== 'string') return buf;
		if (buf.startsWith('[') && buf.endsWith(']')) {
			try { buf = this.pack(JSON.parse(buf)); } 
			catch { return null; }
		}
		const team = [];
		let i = 0;
		let j = 0;
		// limit to 24
		for (let count = 0; count < 24; count++) {
			const set: PokemonSet = {} as PokemonSet;
			team.push(set);
			// name
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.name = buf.substring(i, j);
			i = j + 1;
			// species
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.species = this.unpackName(buf.substring(i, j), Dex.species) || set.name;
			i = j + 1;
			// ISL compatibility: field after species can be either SIZE (new) or ITEM (old)
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			const f1 = buf.substring(i, j);
			i = j + 1;
			const f1u = (f1 || '').toUpperCase();
			const isNew = (f1u === '' || f1u === 'XS' || f1u === 'S' || f1u === 'M' || f1u === 'L' || f1u === 'XL');
			if (isNew) {
				// NEW (ISL): size
				set.size = f1u || 'M';
				// item
				j = buf.indexOf('|', i);
				if (j < 0) return null;
				set.item = this.unpackName(buf.substring(i, j), Dex.items);
				i = j + 1;
				// abilities field: "abilitySet/ability/ability2"
				j = buf.indexOf('|', i);
				if (j < 0) return null;
				const abilField = buf.substring(i, j);
				i = j + 1;
				if (abilField) {
					const parts = abilField.split('/');
					set.abilitySet = (Number(parts[0]) || 1) as 1 | 2;
					set.ability = parts[1] ? this.unpackName(parts[1], Dex.abilities) : '';
					set.ability2 = parts[2] ? this.unpackName(parts[2], Dex.abilities) : '';
				} else {
					set.abilitySet = 1;
					set.ability = '';
					set.ability2 = '';
				}
			} else {
				// OLD (vanilla): f1 was item
				set.size = 'M';
				set.item = this.unpackName(f1, Dex.items);
				// ability
				j = buf.indexOf('|', i);
				if (j < 0) return null;
				const ability = buf.substring(i, j);
				const species = Dex.species.get(set.species);
				set.ability = ['', '0', '1', 'H', 'S'].includes(ability) ?
					species.abilities[ability as '0' || '0'] || (ability === '' ? '' : '!!!ERROR!!!') :
					this.unpackName(ability, Dex.abilities);
				i = j + 1;
			}
			// moves
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.moves = buf.substring(i, j).split(',', 24).map(name => this.unpackName(name, Dex.moves));
			i = j + 1;
			// nature
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.nature = this.unpackName(buf.substring(i, j), Dex.natures);
			i = j + 1;
			// gender 
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (i !== j) set.gender = buf.substring(i, j);
			i = j + 1;
			// jvs (see pack() — this wire slot carries JVs, 0 default, 0-64 range)
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (j !== i) {
				const clampJv = (n: number) => (n < 0 ? 0 : n > 64 ? 64 : n);
				const jvs = buf.substring(i, j).split(',', 6);
				set.jvs = {
					hp: jvs[0] === '' ? 0 : clampJv(Number(jvs[0]) || 0),
					atk: jvs[1] === '' ? 0 : clampJv(Number(jvs[1]) || 0),
					def: jvs[2] === '' ? 0 : clampJv(Number(jvs[2]) || 0),
					spa: jvs[3] === '' ? 0 : clampJv(Number(jvs[3]) || 0),
					spd: jvs[4] === '' ? 0 : clampJv(Number(jvs[4]) || 0),
					spe: jvs[5] === '' ? 0 : clampJv(Number(jvs[5]) || 0),
				};
			}
			i = j + 1;
			// shiny
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (i !== j) set.shiny = true;
			i = j + 1;
			// level
			let setEnd = buf.indexOf(']', i);
			if (setEnd < 0) setEnd = buf.length;
			let commaIdx = buf.indexOf(',', i);
			if (commaIdx < 0 || commaIdx > setEnd) commaIdx = -1;
			const levelEnd = commaIdx >= 0 ? commaIdx : setEnd;
			if (i !== levelEnd) set.level = parseInt(buf.substring(i, levelEnd));
			i = levelEnd;
			// misc: pokeball, teraType, abilitySet, guardAction
			let misc;
			if (commaIdx >= 0) { misc = buf.substring(commaIdx, setEnd).split(',', 9); }
			if (misc) {
				set.pokeball = this.unpackName(misc[1] || '', Dex.items);
				set.teraType = misc[2];
				if (misc[3] !== undefined && misc[3] !== '') set.abilitySet = Number(misc[3]) as 1 | 2;
				if (misc[4] !== undefined && misc[4] !== '') set.guardAction = this.unpackName(misc[4], Dex.moves);
			}
			if (setEnd >= buf.length) break;
			i = setEnd + 1;
		}
		return team;
	}
	/** Very similar to toID but without the lowercase conversion */
	packName(this: void, name: string | undefined | null) {
		if (!name) return '';
		return name.replace(/[^A-Za-z0-9]+/g, '');
	}
	/** Will not entirely recover a packed name, but will be a pretty readable guess */
	unpackName(name: string, dexTable?: { get: (name: string) => AnyObject }) {
		if (!name) return '';
		if (dexTable) {
			const obj = dexTable.get(name);
			if (obj.exists) return obj.name;
		}
		return name.replace(/([0-9]+)/g, ' $1 ').replace(/([A-Z])/g, ' $1').replace(/[ ][ ]/g, ' ').trim();
	}
	// Exports a team in human-readable PS export format
	export(team: PokemonSet[], options?: ExportOptions) {
		let output = '';
		for (const set of team) { output += this.exportSet(set, options) + `\n`; }
		return output;
	}
	exportSet(set: PokemonSet, { hideStats, removeNicknames }: ExportOptions = {}) {
		let out = ``;
		// core
		if (typeof removeNicknames === 'function' && set.name && set.name !== set.species) { set.name = removeNicknames(set.name) || set.species; }
		if (set.name && set.name !== set.species && removeNicknames !== true) { out += `${set.name} (${set.species})`; } 
		else { out += set.species; }
		if (set.gender === 'M') out += ` (M)`;
		if (set.gender === 'F') out += ` (F)`;
		if (set.item) out += ` @ ${set.item}`;
		out += `  \n`;
		if (set.ability) { out += `Ability: ${set.ability}  \n`; }
		if (set.ability2) { out += `Ability 2: ${set.ability2}  \n`; }
		if (set.abilitySet) { out += `Ability Set: ${set.abilitySet}  \n`; }
		// details
		if (set.level && set.level !== 100) { out += `Level: ${set.level}  \n`; }
		if (set.shiny) { out += `Shiny: Yes  \n`; }
		if (set.pokeball) { out += `Pokeball: ${set.pokeball}  \n`; }
		if (set.teraType) { out += `Tera Type: ${set.teraType}  \n`; }
		if (set.size) { out += `Size: ${set.size}  \n`; }
		// stats
		if (!hideStats) {
			if (set.evs) {
				const evs = set.evs;
				const stats = Dex.stats.ids().map(
					stat => evs[stat] ?
						`${evs[stat]} ${Dex.stats.shortNames[stat]}` : ``
				).filter(Boolean);
				if (stats.length) { out += `EVs: ${stats.join(" / ")}  \n`; }
			}
			if (set.nature) { out += `${set.nature} Nature  \n`; }
			if (set.ivs) {
				const stats = Dex.stats.ids().map(
					stat => (set.ivs[stat] !== 31 && set.ivs[stat] !== undefined) ?
						`${set.ivs[stat] || 0} ${Dex.stats.shortNames[stat]}` : ``
				).filter(Boolean);
				if (stats.length) { out += `IVs: ${stats.join(" / ")}  \n`; }
			}
		}
		// moves
		for (let move of set.moves) {
			if (move.startsWith(`Hidden Power `) && move.charAt(13) !== '[') { move = `Hidden Power [${move.slice(13)}]`; }
			out += `- ${move}  \n`;
		}
		return out;
	}
	parseExportedTeamLine(line: string, isFirstLine: boolean, set: PokemonSet, aggressive?: boolean) {
		if (isFirstLine) {
			let item;
			[line, item] = line.split(' @ ');
			if (item) {
				set.item = item;
				if (toID(set.item) === 'noitem') set.item = '';
			}
			if (line.endsWith(' (M)')) {
				set.gender = 'M';
				line = line.slice(0, -4);
			}
			if (line.endsWith(' (F)')) {
				set.gender = 'F';
				line = line.slice(0, -4);
			}
			if (line.endsWith(')') && line.includes('(')) {
				const [name, species] = line.slice(0, -1).split('(');
				set.species = Dex.species.get(species).name;
				set.name = name.trim();
			} else {
				set.species = Dex.species.get(line).name;
				set.name = '';
			}
		} else if (line.startsWith('Trait: ')) {
			line = line.slice(7);
			set.ability = aggressive ? toID(line) : line;
		} else if (line.startsWith('Ability: ')) {
			line = line.slice(9);
			set.ability = aggressive ? toID(line) : line;
		} else if (line.startsWith('Ability 2: ')) {
			line = line.slice(11);
			set.ability2 = aggressive ? toID(line) : line;
		} else if (line.startsWith('Ability Set: ')) {
			line = line.slice(13);
			set.abilitySet = +line as 1 | 2;
		} else if (line === 'Shiny: Yes') { set.shiny = true; } 
		else if (line.startsWith('Level: ')) {
			line = line.slice(7);
			set.level = +line;
		} else if (line.startsWith('Pokeball: ')) {
			line = line.slice(10);
			set.pokeball = aggressive ? toID(line) : line;
		} else if (line.startsWith('Tera Type: ')) {
			line = line.slice(11);
			set.teraType = aggressive ? line.replace(/[^a-zA-Z0-9]/g, '') : line;
		} else if (line.startsWith('Size: ')) {
			line = line.slice(6);
			set.size = line;
		} 
		else if (line.startsWith('EVs: ')) {
			line = line.slice(5);
			const evLines = line.split('/');
			set.evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
			for (const evLine of evLines) {
				const [statValue, statName] = evLine.trim().split(' ');
				const statid = Dex.stats.getID(statName);
				if (!statid) continue;
				const value = parseInt(statValue);
				set.evs[statid] = value;
			}
		} else if (line.startsWith('IVs: ')) {
			line = line.slice(5);
			const ivLines = line.split('/');
			set.ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
			for (const ivLine of ivLines) {
				const [statValue, statName] = ivLine.trim().split(' ');
				const statid = Dex.stats.getID(statName);
				if (!statid) continue;
				let value = parseInt(statValue);
				if (isNaN(value)) value = 31;
				set.ivs[statid] = value;
			}
		} else if (/^[A-Za-z]+ (N|n)ature/.test(line)) {
			let natureIndex = line.indexOf(' Nature');
			if (natureIndex === -1) natureIndex = line.indexOf(' nature');
			if (natureIndex === -1) return;
			line = line.substr(0, natureIndex);
			if (line !== 'undefined') set.nature = aggressive ? toID(line) : line;
		} else if (line.startsWith('-') || line.startsWith('~')) {
			line = line.slice(line.charAt(1) === ' ' ? 2 : 1);
			if (line.startsWith('Hidden Power [')) {
				const hpType = line.slice(14, -1);
				line = 'Hidden Power ' + hpType;
				if (!set.ivs && Dex.types.isName(hpType)) {
					set.ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
					const hpIVs = Dex.types.get(hpType).HPivs || {};
					for (const statid in hpIVs) { set.ivs[statid as StatID] = hpIVs[statid as StatID]!; }
				}
			}
			set.moves.push(line);
		}
	}
	/** Accepts a team in any format (JSON, packed, or exported) */
	import(buffer: string, aggressive?: boolean): PokemonSet[] | null {
		const sanitize = aggressive ? toID : Dex.getName;
		if (buffer.startsWith('[')) {
			try {
				const team = JSON.parse(buffer);
				if (!Array.isArray(team)) throw new Error(`Team should be an Array but isn't`);
				for (const set of team) {
					set.name = sanitize(set.name);
					set.species = sanitize(set.species);
					set.item = sanitize(set.item);
					set.ability = sanitize(set.ability);
					set.gender = sanitize(set.gender);
					set.nature = sanitize(set.nature);
					const evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
					if (set.evs) { for (const statid in evs) { if (typeof set.evs[statid] === 'number') evs[statid as StatID] = set.evs[statid]; } }
					set.evs = evs;
					const ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
					if (set.ivs) { for (const statid in ivs) { if (typeof set.ivs[statid] === 'number') ivs[statid as StatID] = set.ivs[statid]; } }
					set.ivs = ivs;
					if (!Array.isArray(set.moves)) { set.moves = []; } 
					else { set.moves = set.moves.map(sanitize); }
				}
				return team;
			} catch {}
		}
		const lines = buffer.split("\n");
		const sets: PokemonSet[] = [];
		let curSet: PokemonSet | null = null;
		while (lines.length && !lines[0]) lines.shift();
		while (lines.length && !lines[lines.length - 1]) lines.pop();
		if (lines.length === 1 && lines[0].includes('|')) { return this.unpack(lines[0]); }
		for (let line of lines) {
			line = line.trim();
			if (line === '' || line === '---') { curSet = null; } 
			else if (line.startsWith('===')) { }  // team backup format; ignore
			else if (!curSet) {
				curSet = {
					name: '', species: '', item: '', ability: '', gender: '',
					nature: '',
					evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
					ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
					level: 100,
					moves: [],
				};
				sets.push(curSet);
				this.parseExportedTeamLine(line, true, curSet, aggressive);
			} else { this.parseExportedTeamLine(line, false, curSet, aggressive); }
		}
		return sets;
	}
	getGenerator(format: Format | string, seed: PRNG | PRNGSeed | null = null) {
		let TeamGenerator;
		format = Dex.formats.get(format);
		let mod = format.mod;
		if (format.mod === 'monkeyspaw') mod = 'gen9';
		const formatID = toID(format);
		if (mod === 'gen9ssb') { TeamGenerator = require(`../data/mods/gen9ssb/random-teams`).default; } 
		else if (formatID.includes('gen9babyrandombattle')) { TeamGenerator = require(`../data/random-battles/gen9baby/teams`).default; } 
		else if (formatID.includes('gen9randombattle') && format.ruleTable?.has('+pokemontag:cap')) { TeamGenerator = require(`../data/random-battles/gen9cap/teams`).default; } 
		else if (formatID.includes('gen9freeforallrandombattle')) { TeamGenerator = require(`../data/random-battles/gen9ffa/teams`).default; } 
		else { TeamGenerator = require(`../data/random-battles/${mod}/teams`).default; }
		return new TeamGenerator(format, seed);
	}
	generate(format: Format | string, options: PlayerOptions | null = null): PokemonSet[] { return this.getGenerator(format, options?.seed).getTeam(options); }
};
export default Teams;