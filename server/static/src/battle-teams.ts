import { Dex, toID, type ModdedDex } from "./battle-dex";
import { BattleNatures, BattleStatNames, BattleStatIDs, type StatNameExceptHP, type ID } from "./battle-dex-data";
export declare namespace Teams {
	// Teams.PokemonSet can be sparse, in which case that entry should be inferred from the rest of the set, according to sensible defaults.
		export interface FullPokemonSet {
		/** Defaults to species name (not including forme), like in games */
		name: string;
		species: string;
		/** Defaults to no item */
		item?: string;
		/** Defaults to no ability (error in Gen 3+) */
		ability?: string;
		/** Second ability slot, used when abilitySet === 2 */
		ability2?: string;
		/** 1 = abilities 0/1, 2 = abilities H/S */
		abilitySet?: 1 | 2;
		moves: string[];
		/** Defaults to no nature (error in Gen 3+) */
		nature?: Dex.NatureName;
		/** Defaults to random legal gender, NOT subject to gender ratios */
		gender?: string;
		/** Defaults to flat 252's (200's/0's in Let's Go) (error in gen 3+) */
		evs: Partial<Dex.StatsTable>;
		/** Defaults to whatever makes sense - flat 31's unless you have Gyro Ball etc */
		ivs: Dex.StatsTable;
		/**
		 * Judgment Values — replaces the classic EV/IV split entirely. IVs are
		 * always 31; this is the only stat-investment number that matters.
		 * 0-64 per stat, 130 total.
		 */
		jvs?: Partial<Dex.StatsTable>;
		/** Defaults as you'd expect (100 normally, 50 in VGC-likes, 5 in LC) */
		level: number;
		/** Defaults to no (error if shiny event) */
		shiny: boolean;
		/** Defaults to 255 unless you have Frustration, in which case 0 */
		happiness: number;
		/** Defaults to event required ball, otherwise Poké Ball */
		pokeball: string;
		/** Defaults to the primary type */
		teraType?: string;
		/** Pokemon size (cosmetic) */
		size?: string;
		/** Forced Guard Action move, if any */
		guardAction?: string;
	}
	export interface PokemonSet extends Partial<FullPokemonSet> { /** Defaults to species name (not including forme), like in games */
		species: string;
		moves: string[];
	}
	export interface Team {
		name: string;
		format: ID;
		folder: string;
		/** Note that this can be wrong if `.uploaded?.notLoaded` */
		packedTeam: string;
		isBox: boolean;
	}
}
export const Teams = new class {
		pack(team: Teams.PokemonSet[] | null): string {
		if (!team) return '';
		function getJv(jvs: Partial<Dex.StatsTable> | undefined, s: keyof Dex.StatsTable): string {
			return !jvs || !jvs[s] ? '' : jvs[s]!.toString();
		}
		let buf = '';
		for (const set of team) {
			if (buf) buf += ']';
			// name
			buf += (set.name || set.species);
			// species
			const speciesid = this.packName(set.species || set.name);
			buf += `|${this.packName(set.name || set.species) === speciesid ? '' : speciesid}`;
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
			buf += `|${set.gender || ''}`;
			// jvs (0 is the omitted/blank default, not 31 — there's no IV system)
			let jvs = '|';
			if (set.jvs) { jvs = `|${getJv(set.jvs, 'hp')},${getJv(set.jvs, 'atk')},${getJv(set.jvs, 'def')},` + `${getJv(set.jvs, 'spa')},${getJv(set.jvs, 'spd')},${getJv(set.jvs, 'spe')}`; }
			buf += jvs === '|,,,,,' ? '|' : jvs;
			// shiny
			buf += `|${set.shiny ? 'S' : ''}`;
			// level
			buf += `|${set.level && set.level !== 100 ? set.level : ''}`;
			// misc: pokeball, teraType, abilitySet, guardAction
			if (set.pokeball || set.teraType || set.abilitySet || set.guardAction) {
				buf += `,${this.packName(set.pokeball || '')}`;
				buf += `,${set.teraType || ''}`;
				buf += `,${set.abilitySet || ''}`;
				buf += `,${this.packName(set.guardAction || '')}`;
			}
		}
		return buf;
	}
	/** Very similar to toID but without the lowercase conversion */
	packName(this: void, name: string | undefined | null) {
		if (!name) return '';
		return name.replace(/[^A-Za-z0-9]+/g, '');
	}
	unpack(buf: string): Teams.PokemonSet[] {
		if (!buf) return [];
		// first, detect if this has team metadata
		const endIndex = buf.indexOf(']');
		if (endIndex > 0) {
			const firstPart = buf.slice(0, endIndex);
			const pipeCount = firstPart.split('|').length - 1;
			if (pipeCount === 12 || pipeCount === 1) { buf = buf.slice(buf.indexOf('|') + 1); }
		}
		const team = [];
		let i = 0;
		let j = 0;
		let lastI = 0;
		const clampJv = (n: number) => (n < 0 ? 0 : n > 64 ? 64 : n);
		while (true) {
			const set: Teams.PokemonSet = {} as any;
			team.push(set);
			// name
			j = buf.indexOf('|', i);
			const name = buf.substring(i, j);
			i = j + 1;
			// species
			j = buf.indexOf('|', i);
			const species = Dex.species.get(buf.substring(i, j) || name);
			set.species = species.name;
			if (species.baseSpecies !== name) set.name = name;
			i = j + 1;
			// ISL schema: size is a core field (placed before item)
			j = buf.indexOf('|', i);
			set.size = buf.substring(i, j) || undefined;
			i = j + 1;
			// item
			j = buf.indexOf('|', i);
			set.item = Dex.items.get(buf.substring(i, j)).name;
			i = j + 1;
			// ISL schema: abilities field is "abilitySet/ability/ability2"
			j = buf.indexOf('|', i);
			{
				const abilityField = buf.substring(i, j).split('/');
				const as = Number(abilityField[0]) === 2 ? 2 : 1;
				set.abilitySet = as;
				const a1 = Dex.abilities.get(abilityField[1] || '').name;
				const a2 = Dex.abilities.get(abilityField[2] || '').name;
				set.ability = (species.abilities && ['', '0', '1', 'H', 'S'].includes(a1) ? species.abilities[a1 as '0' || '0'] : a1);
				if (a2) { set.ability2 = (species.abilities && ['', '0', '1', 'H', 'S'].includes(a2) ? species.abilities[a2 as '0' || '0'] : a2); }
			}
			i = j + 1;
			// moves
			j = buf.indexOf('|', i);
			set.moves = buf.substring(i, j).split(',').map(moveid => Dex.moves.get(moveid).name);
			i = j + 1;
			// nature
			j = buf.indexOf('|', i);
			set.nature = buf.substring(i, j) as Dex.NatureName;
			if (set.nature as any === 'undefined') delete set.nature;
			i = j + 1;
			// gender
			j = buf.indexOf('|', i);
			if (i !== j) set.gender = buf.substring(i, j);
			i = j + 1;
			// jvs (this wire slot carries JVs, 0 default, 0-64 range — no IV system)
			j = buf.indexOf('|', i);
			if (j !== i) {
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
			if (i !== j) set.shiny = true;
			i = j + 1;
			// level
			j = buf.indexOf('|', i);
			if (i !== j) set.level = parseInt(buf.substring(i, j), 10);
			i = j + 1;
			// misc: pokeball, teraType, abilitySet, guardAction
			j = buf.indexOf(']', i);
			let misc;
			if (j < 0) { if (i < buf.length) misc = buf.substring(i).split(',', 4); } 
			else { if (i !== j) misc = buf.substring(i, j).split(',', 4); }
			if (misc) {
				set.pokeball = Dex.items.get(misc[0] || '').name || undefined;
				set.teraType = misc[1] || undefined;
				if (misc[2]) set.abilitySet = Number(misc[2]) === 2 ? 2 : 1;
				set.guardAction = misc[3] ? Dex.moves.get(misc[3]).name : undefined;
			}
			i = j + 1;
			if (j < 0 || i <= lastI) break;
			lastI = i;
		}
		return team;
	}
	unpackSpeciesOnly(buf: string): string[] {
		if (!buf) return [];
		const team = [];
		let i = 0;
		let lastI = 0;
		while (true) {
			const name = buf.slice(i, buf.indexOf('|', i));
			i = buf.indexOf('|', i) + 1;
			team.push(buf.slice(i, buf.indexOf('|', i)) || name);
			for (let k = 0; k < 9; k++) { i = buf.indexOf('|', i) + 1; }
			i = buf.indexOf(']', i) + 1;
			if (i < 1 || i <= lastI) break;
			lastI = i;
		}
		return team;
	}
	// (You may wish to manually add two spaces to the end of every line so linebreaks are preserved in Markdown; I assume mostly for Reddit.)
	exportSet(set: Teams.PokemonSet, dex: ModdedDex = Dex, newFormat?: boolean) {
		let text = '';
		// core
		if (set.name && set.name !== set.species) { text += `${set.name} (${set.species})`; }
		else { text += `${set.species}`; }
		if (set.gender === 'M') text += ` (M)`;
		if (set.gender === 'F') text += ` (F)`;
		if (!newFormat && set.item) { text += ` @ ${set.item}`; }
		text += `\n`;
		if ((set.item || set.ability || dex.gen >= 2) && newFormat) {
			if (set.ability || dex.gen >= 3) text += `[${set.ability || '(select ability)'}]`;
			if (set.item || dex.gen >= 2) text += ` @ ${set.item || "(no item)"}`;
			text += `\n`;
		} else if (set.ability && set.ability !== 'No Ability') { text += `Ability: ${set.ability}\n`; }
		if (newFormat) {
			if (set.moves) {
				for (let move of set.moves) {
					if (move.startsWith('Hidden Power ')) {
						const hpType = move.slice(13);
						move = move.slice(0, 13);
						move = `${move}[${hpType}]`;
					}
					text += `- ${move || ''}\n`;
				}
			}
			for (let i = set.moves?.length || 0; i < 4; i++) { text += `- \n`; }
		}
		// stats
		let first = true;
		if (set.evs || set.nature) {
			const nature = newFormat ? BattleNatures[set.nature as 'Serious'] : null;
			for (const stat of Dex.statNames) {
				const plusMinus = !newFormat ? '' : nature?.plus === stat ? '+' : nature?.minus === stat ? '-' : '';
				const ev = set.evs?.[stat] || '';
				if (ev === '' && !plusMinus) continue;
				text += first ? `EVs: ` : ` / `;
				first = false;
				text += `${ev}${plusMinus} ${BattleStatNames[stat]}`;
			}
		}
		if (!first) {
			if (set.nature && newFormat) text += ` (${set.nature})`;
			text += `\n`;
		}
		if (set.nature && !newFormat) { text += `${set.nature} Nature\n`; } 
		else if (['Hardy', 'Docile', 'Serious', 'Bashful', 'Quirky'].includes(set.nature!)) { text += `${set.nature!} Nature\n`; }
		first = true;
		if (set.jvs) {
			for (const stat of Dex.statNames) {
				if (!set.jvs[stat]) continue;
				if (first) {
					text += `JVs: `;
					first = false;
				} else { text += ` / `; }
				text += `${set.jvs[stat]} ${BattleStatNames[stat]}`;
			}
		}
		if (!first) { text += `\n`; }
		// details
		if (set.level && set.level !== 100) { text += `Level: ${set.level}\n`; }
		if (set.shiny) { text += !newFormat ? `Shiny: Yes\n` : `Shiny\n`; }
		if (typeof set.happiness === 'number' && set.happiness !== 255 && !isNaN(set.happiness)) { text += `Happiness: ${set.happiness}\n`; }
		if (set.teraType) { text += `Tera Type: ${set.teraType}\n`; }
		if (set.size) { text += `Size: ${set.size}\n`; }
		if (!newFormat) {
			for (let move of set.moves || []) {
				if (move.startsWith('Hidden Power ')) {
					const hpType = move.slice(13);
					move = move.slice(0, 13);
					move = !newFormat ? `${move}[${hpType}]` : `${move}${hpType}`;
				}
				text += `- ${move}\n`;
			}
			for (let i = set.moves?.length || 0; i < 4; i++) { text += `- \n`; }
		}
		text += `\n`;
		return text;
	}
	// TODO: finish this impl
	// getFullSet(set: Teams.PokemonSet, dex: ModdedDex): Teams.FullPokemonSet {
	// 	//
	// }
	export(sets: Teams.PokemonSet[], dex?: ModdedDex, newFormat?: boolean) {
		let text = '';
		for (const set of sets) { text += Teams.exportSet(set, dex, newFormat); } // core
		return text;
	}
	parseExportedTeamLine(line: string, isFirstLine: boolean, set: Dex.PokemonSet) {
		if (isFirstLine || line.startsWith('[')) {
			let item;
			[line, item] = line.split('@');
			line = line.trim();
			item = item?.trim();
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
			if (line.startsWith('[') && line.endsWith(']')) {
				// the ending `]` is necessary to establish this as ability
				// (rather than nickname starting with `[`)
				set.ability = line.slice(1, -1);
				if (toID(set.ability) === 'selectability') {
					set.ability = '';
				}
			} else if (line) {
				const parenIndex = line.lastIndexOf(' (');
				if (line.endsWith(')') && parenIndex !== -1) {
					set.species = Dex.species.get(line.slice(parenIndex + 2, -1)).name;
					set.name = line.slice(0, parenIndex);
				} else {
					set.species = Dex.species.get(line).name;
					set.name = '';
				}
			}
		} else if (line.startsWith('Trait: ')) { set.ability = line.slice(7); } 
		else if (line.startsWith('Ability: ')) { set.ability = line.slice(9); } 
		else if (line.startsWith('Item: ')) { set.item = line.slice(6); } 
		else if (line.startsWith('Nickname: ')) { set.name = line.slice(10); } 
		else if (line.startsWith('Species: ')) { set.species = line.slice(9); } 
		else if (line === 'Shiny: Yes' || line === 'Shiny') { set.shiny = true; } 
		else if (line.startsWith('Level: ')) { set.level = +line.slice(7); } 
		else if (line.startsWith('Happiness: ')) { set.happiness = +line.slice(11); } 
		else if (line.startsWith('Pokeball: ')) { set.pokeball = line.slice(10); } 
		else if (line.startsWith('Tera Type: ')) { set.teraType = line.slice(11); } 
		else if (line.startsWith('Size: ')) { set.size = line.slice(6); } 
		else if (line.startsWith('EVs: ')) {
			const evLines = line.slice(5).split('(')[0].split('/');
			set.evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
			let plus = '', minus = '';
			for (let evLine of evLines) {
				evLine = evLine.trim();
				const spaceIndex = evLine.indexOf(' ');
				if (spaceIndex === -1) continue;
				const statid = BattleStatIDs[evLine.slice(spaceIndex + 1)];
				if (!statid) continue;
				if (evLine.charAt(spaceIndex - 1) === '+') plus = statid;
				if (evLine.charAt(spaceIndex - 1) === '-') minus = statid;
				set.evs[statid] = parseInt(evLine.slice(0, spaceIndex), 10) || 0;
			}
			const nature = this.getNatureFromPlusMinus(plus as StatNameExceptHP, minus as StatNameExceptHP);
			if (nature) set.nature = nature;
		} else if (line.startsWith('JVs: ') || line.startsWith('IVs: ')) {
			// Accept legacy "IVs:" text too, in case of old pasted sets, but the
			// values always land in jvs now — there's no IV system.
			const isLegacyIV = line.startsWith('IVs: ');
			const jvLines = line.slice(5).split(' / ');
			set.jvs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
			for (let jvLine of jvLines) {
				jvLine = jvLine.trim();
				const spaceIndex = jvLine.indexOf(' ');
				if (spaceIndex === -1) continue;
				const statid = BattleStatIDs[jvLine.slice(spaceIndex + 1)];
				if (!statid) continue;
				let statval = parseInt(jvLine.slice(0, spaceIndex), 10);
				if (isNaN(statval)) statval = 0;
				// A legacy "31 Atk"-style IV line means "not invested" in the new
				// system, not "31 JVs" — only non-31 legacy values carried real
				// information (Hidden Power IVs), which don't map to JVs at all.
				set.jvs[statid] = isLegacyIV ? 0 : (statval < 0 ? 0 : statval > 64 ? 64 : statval);
			}
		} else if (/^[A-Za-z]+ (N|n)ature/.exec(line)) {
			let natureIndex = line.indexOf(' Nature');
			if (natureIndex === -1) natureIndex = line.indexOf(' nature');
			if (natureIndex === -1) return;
			line = line.slice(0, natureIndex);
			if (line !== 'undefined') set.nature = line as Dex.NatureName;
		} else if (line.startsWith('-') || line.startsWith('~') || line.startsWith('Move:')) {
			if (line.startsWith('Move:')) line = line.slice(4);
			line = line.slice(line.charAt(1) === ' ' ? 2 : 1);
			if (line === 'Frustration' && set.happiness === undefined) { set.happiness = 0; }
			set.moves.push(line);
		}
	}
	getNatureFromPlusMinus(
		plus: StatNameExceptHP | '' | null, minus: StatNameExceptHP | '' | null
	): Dex.NatureName | null {
		if (!plus || !minus) return null;
		for (const i in BattleNatures) { if (BattleNatures[i as 'Serious'].plus === plus && BattleNatures[i as 'Serious'].minus === minus) { return i as Dex.NatureName; } }
		return null;
	}
	import(buffer: string): Dex.PokemonSet[] {
		const lines = buffer.split("\n");
		const sets: Dex.PokemonSet[] = [];
		let curSet: Dex.PokemonSet | null = null;
		while (lines.length && !lines[0]) lines.shift();
		while (lines.length && !lines[lines.length - 1]) lines.pop();
		if (lines.length === 1 && lines[0].includes('|')) { return Teams.unpack(lines[0]); }
		for (let line of lines) {
			line = line.trim();
			if (line === '' || line === '---') { curSet = null; } 
			else if (line.startsWith('===')) { } // team backup format; ignore
			else if (line.includes('|')) { return Teams.unpack(line); } // packed format
			else if (!curSet) {
				curSet = { name: '', species: '', gender: '', moves: [], };
				sets.push(curSet);
				this.parseExportedTeamLine(line, true, curSet);
			} else { this.parseExportedTeamLine(line, false, curSet); }
		}
		return sets;
	}
};