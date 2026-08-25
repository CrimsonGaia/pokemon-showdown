/**
 * Team Validator
 * Handles team validation, and specifically learnset checking.
 */
import { Dex, toID } from './dex';
import { Utils } from '../lib/utils';
import { Tags } from '../data/tags';
import { Teams } from './teams';
import { PRNG } from './prng';
import { type RuleTable } from './dex-formats';
/**
 * Describes a possible way to get a pokemon. Is not exhaustive!
 * sourcesBefore covers all sources that do not have exclusive
 * moves (like catching wild pokemon).
 * First character is a generation number, 1-8.
 * Second character is a source ID, one of:
 * - E = egg, 3rd char+ is the father in gen 2-5, empty in gen 6-7
 *   because egg moves aren't restricted to fathers anymore
 * - S = event, 3rd char+ is the index in .eventData
 * Designed to match MoveSource where possible.
 */
export type PokemonSource = string;
export class TeamValidator {
	readonly format: Format;
	readonly dex: ModdedDex;
	readonly gen: number;
	readonly ruleTable: RuleTable;
	readonly toID: (str: any) => ID;
	constructor(format: string | Format, dex = Dex) {
		this.format = dex.formats.get(format);
		if (this.format.effectType !== 'Format') { throw new Error(`format '${format}' should be a 'Format', but was a '${this.format.effectType}'`); }
		this.dex = dex.forFormat(this.format);
		this.gen = this.dex.gen;
		this.ruleTable = this.dex.formats.getRuleTable(this.format);
		this.toID = toID;
	}
	//region Validate
	validateTeam(
		team: PokemonSet[] | null,
		options: {
			removeNicknames?: boolean,
			skipSets?: { [name: string]: { [key: string]: boolean } },
		} = {}
	): string[] | null {
		if (team && this.format.validateTeam) { return this.format.validateTeam.call(this, team, options) || null; }
		return this.baseValidateTeam(team, options);
	}
	baseValidateTeam(
		team: PokemonSet[] | null,
		options: {
			removeNicknames?: boolean,
			skipSets?: { [name: string]: { [key: string]: boolean } },
		} = {}
	): string[] | null {
		const format = this.format;
		const dex = this.dex;
		let problems: string[] = [];
		const ruleTable = this.ruleTable;
		if (format.team) {
			if (team) {
				return [
					`This format doesn't let you use your own team.`,
					`If you're not using a custom client, please report this as a bug. If you are, remember to use \`/utm null\` before starting a game in this format.`,
				];
			}
			const testTeamSeed = PRNG.generateSeed();
			try {
				const testTeamGenerator = Teams.getGenerator(format, testTeamSeed);
				testTeamGenerator.getTeam(options); // Throws error if generation fails
			} catch (e) {
				return [
					`${format.name}'s team generator (${format.team}) failed using these rules and seed (${testTeamSeed}):-`,
					`${e}`,
				];
			}
			return null;
		}
		if (!team) {
			return [
				`This format requires you to use your own team.`,
				`If you're not using a custom client, please report this as a bug.`,
			];
		}
		if (!Array.isArray(team)) { throw new Error(`Invalid team data`); }
		if (team.length < ruleTable.minTeamSize) { problems.push(`You must bring at least ${ruleTable.minTeamSize} Pok\u00E9mon (your team has ${team.length}).`); }
		if (team.length > ruleTable.maxTeamSize) { return [`You may only bring up to ${ruleTable.maxTeamSize} Pok\u00E9mon (your team has ${team.length}).`]; }
		// A limit is imposed here to prevent too much engine strain or too much layout deformation - to be exact, this is the limit allowed in Custom Game.
		if (team.length > 24) {
			problems.push(`Your team has more than than 24 Pok\u00E9mon, which the simulator can't handle.`);
			return problems;
		}
		const teamHas: { [k: string]: number } = {};
		for (const set of team) {
			if (!set) return [`You sent invalid team data. If you're not using a custom client, please report this as a bug.`];
			let setProblems: string[] | null = null;
			if (options.skipSets?.[set.name]) { for (const i in options.skipSets[set.name]) { teamHas[i] = (teamHas[i] || 0) + 1; } } 
			else { setProblems = (format.validateSet || this.validateSet).call(this, set, teamHas); }
			if (setProblems) { problems = problems.concat(setProblems); }
			if (options.removeNicknames) {
				const species = dex.species.get(set.species);
				set.name = species.baseSpecies;
				if (species.baseSpecies === 'Unown') set.species = 'Unown';
			}
		}
		for (const [rule, source, limit, bans] of ruleTable.complexTeamBans) {
			let count = 0;
			for (const ban of bans) { if (teamHas[ban] > 0) { count += limit ? teamHas[ban] : 1; } }
			if (limit && count > limit) {
				const clause = source ? ` by ${source}` : ``;
				problems.push(`You are limited to ${limit} of ${rule}${clause}.`);
			} else if (!limit && count >= bans.length) {
				const clause = source ? ` by ${source}` : ``;
				problems.push(`Your team has the combination of ${rule}, which is banned${clause}.`);
			}
		}
		for (const rule of ruleTable.keys()) {
			if ('!+-*'.includes(rule.charAt(0))) continue;
			const subformat = dex.formats.get(rule);
			if (subformat.onValidateTeam && ruleTable.has(subformat.id)) { problems = problems.concat(subformat.onValidateTeam.call(this, team, format, teamHas) || []); }
		}
		if (format.onValidateTeam) { problems = problems.concat(format.onValidateTeam.call(this, team, format, teamHas) || []); }
		if (!problems.length) return null;
		return problems;
	}
	getValidationSpecies(set: PokemonSet): { outOfBattleSpecies: Species, tierSpecies: Species } {
		const dex = this.dex;
		const ruleTable = this.ruleTable;
		const species = dex.species.get(set.species);
		const item = dex.items.get(set.item);
		let outOfBattleSpecies = species;
		let tierSpecies = species;
		if (ruleTable.has('obtainableformes')) {
			if (item.megaStone?.[species.name]) { tierSpecies = dex.species.get(item.megaStone[species.name]); } 
			else if (item.id === 'redorb' && species.id === 'groudon') { tierSpecies = dex.species.get('Groudon-Primal'); } 
			else if (item.id === 'blueorb' && species.id === 'kyogre') { tierSpecies = dex.species.get('Kyogre-Primal'); } 
			else if (item.id === 'rustedsword' && species.id === 'zacian') { tierSpecies = dex.species.get('Zacian-Crowned'); } 
			else if (item.id === 'rustedshield' && species.id === 'zamazenta') { tierSpecies = dex.species.get('Zamazenta-Crowned'); }
		}
		return { outOfBattleSpecies, tierSpecies };
	}
	validateSet(set: PokemonSet, teamHas: AnyObject): string[] | null {
		const format = this.format;
		const dex = this.dex;
		const ruleTable = this.ruleTable;
		let problems: string[] = [];
		if (!set) { return [`This is not a Pokemon.`]; }
		let species = dex.species.get(set.species);
		set.species = species.name;
		if (set.name && set.name.length > 18) {
			if (set.name === set.species) { set.name = species.baseSpecies; } 
			else { problems.push(`Nickname "${set.name}" too long (should be 18 characters or fewer)`); }
		}
		set.name = dex.getName(set.name);
		let item = dex.items.get(Utils.getString(set.item));
		set.item = item.name;
		let ability = dex.abilities.get(Utils.getString(set.ability));
		set.ability = ability.name;
		let ability2 = dex.abilities.get(Utils.getString(set.ability2 || ''));
		if (set.ability2) set.ability2 = ability2.name;
		let nature = dex.natures.get(Utils.getString(set.nature));
		set.nature = nature.name;
		if (!Array.isArray(set.moves)) set.moves = [];
		set.name = set.name || species.baseSpecies;
		let name = set.species;
		if (set.species !== set.name && species.baseSpecies !== set.name) { name = `${set.name} (${set.species})`; }
		if (!set.level) set.level = ruleTable.defaultLevel;
		let adjustLevel = ruleTable.adjustLevel;
		if (ruleTable.adjustLevelDown && set.level >= ruleTable.adjustLevelDown) { adjustLevel = ruleTable.adjustLevelDown; }
		if (set.level === adjustLevel || (set.level === 100 && ruleTable.maxLevel < 100)) {
			// Note that we're temporarily setting level 50 pokemon in VGC to level 100
			// This allows e.g. level 50 Hydreigon even though it doesn't evolve until level 64.
			// Leveling up can't make an obtainable pokemon unobtainable, so this is safe.
			// Just remember to set the level back to adjustLevel at the end of validation.
			set.level = ruleTable.maxLevel;
		}
		if (set.level < ruleTable.minLevel) { problems.push(`${name} (level ${set.level}) is below the minimum level of ${ruleTable.minLevel}${ruleTable.blame('minlevel')}`); }
		if (set.level > ruleTable.maxLevel) { problems.push(`${name} (level ${set.level}) is above the maximum level of ${ruleTable.maxLevel}${ruleTable.blame('maxlevel')}`); }
		const setHas: { [k: string]: true } = {};
		if (!(set as any).jvs) (set as any).jvs = TeamValidator.fillStats(null, 0);
		if (ruleTable.has('obtainableformes')) {
			problems.push(...this.validateForme(set));
			species = dex.species.get(set.species);
		}
		for (const [rule] of ruleTable) {
			if ('!+-*'.includes(rule.charAt(0))) continue;
			const subformat = dex.formats.get(rule);
			if (subformat.onChangeSet && ruleTable.has(subformat.id)) { problems = problems.concat(subformat.onChangeSet.call(this, set, format, setHas, teamHas) || []); }
		}
		if (format.onChangeSet) { problems = problems.concat(format.onChangeSet.call(this, set, format, setHas, teamHas) || []); }
		// onChangeSet can modify set.species, set.item, set.ability
		species = dex.species.get(set.species);
		item = dex.items.get(set.item);
		ability = dex.abilities.get(set.ability);
		ability2 = dex.abilities.get(set.ability2 || '');
		if (!['M', 'F'].includes(set.gender)) set.gender = '';
		const { outOfBattleSpecies, tierSpecies } = this.getValidationSpecies(set);
		if (ability.id === 'battlebond' && toID(species.baseSpecies) === 'greninja') {
			if (ruleTable.has('obtainablemisc')) {
				if (set.gender && set.gender !== 'M') { problems.push(`Battle Bond Greninja must be male.`); }
				set.gender = 'M';
			}
		} else if (ability.id === 'protean' && toID(species.baseSpecies) === 'greninja') {
			if (ruleTable.has('obtainablemisc')) {
				if (set.gender && set.gender !== 'F') { problems.push(`Protean Greninja must be female.`); }
				set.gender = 'F';
			}
		}
		if (!species.exists) { return [`The Pokemon "${set.species}" does not exist.`]; }
		if (item.id && !item.exists) { return [`"${set.item}" is an invalid item.`]; }
		if (ability.id && !ability.exists) { { return [`"${set.ability}" is an invalid ability.`]; } }
		if (ability2.id && !ability2.exists) { { return [`"${set.ability2}" is an invalid ability.`]; } }
		if (nature.id && !nature.exists) { { problems.push(`"${set.nature}" is an invalid nature.`); } }
		if (!ruleTable.has('terastalclause') || ruleTable.has('bonustypemod')) {
			const type = dex.types.get(set.teraType || species.requiredTeraType || species.types[0]);
			if (!type.exists || type.isNonstandard) { problems.push(`${name}'s Terastal type (${set.teraType}) is invalid.`); } 
			else if (species.requiredTeraType && species.requiredTeraType !== type.name && ruleTable.has('obtainablemisc')) { problems.push(`${species.name}'s Terastal type needs to be ${species.requiredTeraType}.`); }
			set.teraType = type.name;
		} else { delete set.teraType; }
		let problem = this.checkSpecies(set, species, tierSpecies, setHas);
		if (problem) problems.push(problem);
		problem = this.checkItem(set, item, setHas);
		if (problem) problems.push(problem);
		if (!set.ability) set.ability = 'No Ability';
		if (ruleTable.has('obtainableabilities')) {
				if (!ability.name || ability.name === 'No Ability') { problems.push(`${name} needs to have an ability.`); } 
				else if (!Object.values(species.abilities).includes(ability.name)) {
					if (tierSpecies.abilities[0] === ability.name) { set.ability = species.abilities[0]; } 
					else { problems.push(`${name} can't have ${set.ability}.`); }
				}
		}
		ability = dex.abilities.get(set.ability);
		problem = this.checkAbility(set, ability, setHas);
		if (problem) problems.push(problem);
		if (set.ability2) {
			ability2 = dex.abilities.get(set.ability2);
			problem = this.checkAbility(set, ability2, setHas);
			if (problem) problems.push(problem);
		}
		// Guard Action validation: species pool first, then let the ability override it.
		const guardActionPool = [...new Set([...(species.guardAction || []), ...(tierSpecies.guardAction || [])])].map(m => toID(m));
		const abilityForcedGuardAction = (ability as any).forcedGuardAction ? toID((ability as any).forcedGuardAction) : '';
		const abilityBlocksGuardAction = !!(ability as any).blocksGuardAction;
		if (abilityBlocksGuardAction) { delete set.guardAction; } 
		else if (abilityForcedGuardAction) { set.guardAction = dex.moves.get(abilityForcedGuardAction).name; } 
		else if (guardActionPool.length) {
			let guardActionId = toID(set.guardAction);
			if (!guardActionId) { guardActionId = guardActionPool[0]; }
			if (!guardActionPool.includes(guardActionId)) { problems.push(`${name}'s Guard Action (${set.guardAction}) is not one of its available Guard Actions (${guardActionPool.join(', ')}).`); }			else {
				const guardMove = dex.moves.get(guardActionId);
				set.guardAction = guardMove.exists ? guardMove.name : guardActionId;
			}
		} else if (set.guardAction) { problems.push(`${name} does not have access to a Guard Action.`); } 
		else { delete set.guardAction; }
		if (!set.nature) { set.nature = ''; }
		nature = dex.natures.get(set.nature);
		problem = this.checkNature(set, nature, setHas);
		if (problem) problems.push(problem);
		if (set.moves && Array.isArray(set.moves)) { set.moves = set.moves.filter(val => val); }
		if (!set.moves?.length) {
			problems.push(`${name} has no moves (it must have at least one to be usable).`);
			set.moves = [];
		}
		const moveLegalityWhitelist: { [k: string]: true | undefined } = {};
		for (const moveName of set.moves) {
			if (!moveName) continue;
			const move = dex.moves.get(Utils.getString(moveName));
			if (!move.exists) return [`"${move.name}" is an invalid move.`];
			problem = this.checkMove(set, move, setHas);
			if (problem) { problems.push(problem); }
		}
		problems.push(...this.validateMoves(species, set.moves, set, name, moveLegalityWhitelist));
		let isUnderleveled;
		let requiredLevel;
		if (ruleTable.has('obtainablemisc')) {
			// FIXME: Event pokemon given at a level under what it normally can be attained at gives a false positive
			let evoSpecies = species;
			while (evoSpecies.prevo) {
				if (set.level < (evoSpecies.evoLevel || 0)) {
					isUnderleveled = evoSpecies.name;
					requiredLevel = evoSpecies.evoLevel;
					break;
				}
				evoSpecies = dex.species.get(evoSpecies.prevo);
			}
		}
		if (teamHas) {
			for (const i in setHas) {
				if (i in teamHas) { teamHas[i]++; } 
				else { teamHas[i] = 1; }
			}
		}
		for (const [rule, source, limit, bans] of ruleTable.complexBans) {
			let count = 0;
			for (const ban of bans) { if (setHas[ban]) count++; }
			if (limit && count > limit) {
				const clause = source ? ` by ${source}` : ``;
				problems.push(`${name} is limited to ${limit} of ${rule}${clause}.`);
			} else if (!limit && count >= bans.length) {
				const clause = source ? ` by ${source}` : ``;
				if (source === 'Obtainable Moves') { problems.push(`${name} has the combination of ${rule}, which is impossible to obtain legitimately.`); } 
				else { problems.push(`${name} has the combination of ${rule}, which is banned${clause}.`); }
			}
		}
		for (const [rule] of ruleTable) {
			if ('!+-*'.includes(rule.charAt(0))) continue;
			const subformat = dex.formats.get(rule);
			if (subformat.onValidateSet && ruleTable.has(subformat.id)) { problems = problems.concat(subformat.onValidateSet.call(this, set, format, setHas, teamHas) || []); }
		}
		if (format.onValidateSet) { problems = problems.concat(format.onValidateSet.call(this, set, format, setHas, teamHas) || []); }
		const nameSpecies = dex.species.get(set.name);
		if (nameSpecies.exists && nameSpecies.name.toLowerCase() === set.name.toLowerCase()) {
			// nickname is the name of a species
			if (nameSpecies.baseSpecies === species.baseSpecies) { set.name = species.baseSpecies; } 
			else if (nameSpecies.name !== species.name &&
				nameSpecies.name !== species.baseSpecies && ruleTable.has('nicknameclause')) {
				// nickname species doesn't match actual species
				// Nickname Clause
				problems.push(`${name} must not be nicknamed a different Pokémon species than what it actually is.`);
			}
		}
		if (!problems.length) {
			if (!ruleTable.has('obtainablemisc')) { set.gender ||= 'N'; }
			if (adjustLevel) set.level = adjustLevel;
			return null;
		}
		return problems;
	}
	validateStats(set: PokemonSet, species: Species,): string[] | null {
		const problems = [];
		const name = set.name || set.species;
		const anySet = set as any;
		if (!anySet.jvs) anySet.jvs = TeamValidator.fillStats(null, 0);
		const jvs = anySet.jvs as Partial<StatsTable>;
		let totalJV = 0;
		for (const stat of ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const) {
			const jv = jvs[stat] ?? 0;
			if (jv < 0) { problems.push(`${name} has less than 0 JVs in ${Dex.stats.names[stat]}.`); }
			if (jv > 64) { problems.push(`${name} has more than 64 JVs in ${Dex.stats.names[stat]}.`); }
			totalJV += jv;
		}
		if (totalJV > 130) { problems.push(`${name} has ${totalJV} total JVs, which is more than the limit of 130.`); }
		return problems;
	}
	/**
	 * Returns array of error messages if invalid, undefined if valid
	 * If `because` is not passed, instead returns true if invalid.
	 */
	validateSource(set: PokemonSet, source: PokemonSource, setSources: PokemonSource, species: Species, because?: string) {
		let eventData: EventInfo | undefined;
		let eventSpecies = species;
		if (source.charAt(1) === 'S') {
			const splitSource = source.substr(source.charAt(2) === 'T' ? 3 : 2).split(' ');
			const eventLsetData = this.dex.species.getLearnsetData(eventSpecies.id);
			eventData = eventLsetData.eventData?.[parseInt(splitSource[0])];
			if (!eventData) { throw new Error(`${eventSpecies.name} from ${species.name} doesn't have data for event ${source}`); }
		} else { throw new Error(`Unidentified source ${source} passed to validateSource`); }
		// complicated fancy return signature
		return this.validateEvent(set, setSources, eventData, eventSpecies, because as any) as any;
	}
	validateForme(set: PokemonSet) {
		const dex = this.dex;
		const name = set.name || set.species;
		const problems = [];
		const item = dex.items.get(set.item);
		const species = dex.species.get(set.species);
		if (species.name === 'Necrozma-Ultra') {
			const whichMoves = (set.moves.map(toID).includes('sunsteelstrike' as ID) ? 1 : 0) + (set.moves.map(toID).includes('moongeistbeam' as ID) ? 2 : 0);
			if (item.name !== 'Ultranecrozium Z') { problems.push(`Necrozma-Ultra must start the battle holding Ultranecrozium Z.`); } // Necrozma-Ultra transforms from one of two formes, and neither one is the base forme
			else if (whichMoves === 1) {
				set.species = 'Necrozma-Dusk-Mane';
				set.ability = 'Prism Armor';
			} else if (whichMoves === 2) {
				set.species = 'Necrozma-Dawn-Wings';
				set.ability = 'Prism Armor';
			} else { problems.push(`Necrozma-Ultra must start the battle as Necrozma-Dusk-Mane or Necrozma-Dawn-Wings holding Ultranecrozium Z. Please specify which Necrozma it should start as.`); }
		} else if (species.baseSpecies === 'Zygarde') {
			if (species.name === 'Zygarde-Complete' || species.name === 'Zygarde-Mega') { problems.push(`${species.name} must start the battle as Zygarde or Zygarde-10% with Power Construct. Please specify which Zygarde it should start as.`); }
			if (item.id === 'zygardite' && set.ability !== 'Power Construct') { problems.push(`Zygarde holding Zygardite can only Mega Evolve with the Power Construct ability.`); }
		} else if (species.baseSpecies === 'Terapagos') {
			set.species = 'Terapagos';
			set.ability = 'Tera Shift';
		} else if (species.battleOnly) {
			if (species.requiredAbility && set.ability !== species.requiredAbility) { problems.push(`${species.name} transforms in-battle with ${species.requiredAbility}, please fix its ability.`); } // Darmanitan-Zen
			if (species.requiredItems) { if (!species.requiredItems.includes(item.name)) { problems.push(`${species.name} transforms in-battle with ${species.requiredItem}, please fix its item.`); } } // Mega or Primal
			if (species.requiredMove && !set.moves.map(toID).includes(toID(species.requiredMove))) { problems.push(`${species.name} transforms in-battle with ${species.requiredMove}, please fix its moves.`); } // Meloetta-Pirouette, Rayquaza-Mega
			if (typeof species.battleOnly !== 'string') { throw new Error(`${species.name} should have a string battleOnly`); } // Ultra Necrozma and Complete Zygarde are already checked above
			// Set to out-of-battle forme
			set.species = species.battleOnly;
		} else {
			if (species.requiredAbility) { throw new Error(`Species ${species.name} has a required ability despite not being a battle-only forme; it should just be in its abilities table.`); } // Impossible!
			if (species.requiredItems && !species.requiredItems.includes(item.name)) {
				if (species.baseSpecies === 'Arceus' || species.baseSpecies === 'Silvally') {
					problems.push(
						`${name} needs to hold ${species.requiredItems.join(' or ')}.`,
						`(It will revert to its Normal forme if you remove the item or give it a different item.)`
					);
				} else {
					// Memory/Drive/Griseous Orb/Plate/Z-Crystal - Forme mismatch
					const baseSpecies = this.dex.species.get(species.changesFrom);
					problems.push(
						`${name} needs to hold ${species.requiredItems.join(' or ')} to be in its ${species.forme} forme.`,
						`(It will revert to its ${baseSpecies.baseForme || 'base'} forme if you remove the item or give it a different item.)`
					);
				}
			}
			if (species.requiredMove && !set.moves.map(toID).includes(toID(species.requiredMove))) {
				const baseSpecies = this.dex.species.get(species.changesFrom);
				problems.push(
					`${name} needs to know the move ${species.requiredMove} to be in its ${species.forme} forme.`,
					`(It will revert to its ${baseSpecies.baseForme} forme if it forgets the move.)`
				);
			}
			// Mismatches between the set forme (if not base) and the item signature forme will have been rejected already.
			// It only remains to assign the right forme to a set with the base species (Arceus/Genesect/Giratina/Silvally).
			if (item.forcedForme && species.name === dex.species.get(item.forcedForme).baseSpecies) { set.species = item.forcedForme; }
		}
		if (species.name === 'Pikachu-Cosplay') {
			const cosplay: { [k: string]: string } = {
				meteormash: 'Pikachu-Rock-Star', iciclecrash: 'Pikachu-Belle', drainingkiss: 'Pikachu-Pop-Star',
				electricterrain: 'Pikachu-PhD', flyingpress: 'Pikachu-Libre',
			};
			for (const moveid of set.moves) {
				if (moveid in cosplay) {
					set.species = cosplay[moveid];
					break;
				}
			}
		}
		const crowned: { [k: string]: string } = { 'Zacian-Crowned': 'behemothblade', 'Zamazenta-Crowned': 'behemothbash', };
		if (species.name in crowned) {
			const behemothMove = set.moves.map(toID).indexOf(crowned[species.name] as ID);
			if (behemothMove >= 0) { set.moves[behemothMove] = 'ironhead'; }
		}
		return problems;
	}
	validateMoves(
		species: Species, moves: string[], set?: Partial<PokemonSet>,
		name: string = species.name, moveLegalityWhitelist: { [k: string]: true | undefined } = {}
	) {
		const dex = this.dex;
		const ruleTable = this.ruleTable;
		const problems = [];
		const checkCanLearn = (ruleTable.checkCanLearn?.[0] || this.checkCanLearn);
		const infusibleSlots = species.infusibleSlots || 0;
		let usedInfusibleSlots = 0;
		for (const moveName of moves) {
			const move = dex.moves.get(moveName);
			const moveid = move.id;
			if (moveLegalityWhitelist[moveid]) continue;
			const problem = checkCanLearn.call(this, move, species, null, set);
			if (!problem) continue;
			if (move.flags.infusible) {
				if (infusibleSlots > usedInfusibleSlots) {
					usedInfusibleSlots++;
					continue;
				}
				const capacity = infusibleSlots ?
					`only has ${infusibleSlots} infusible move slot${infusibleSlots === 1 ? '' : 's'}, which ${infusibleSlots === 1 ? 'is' : 'are'} already used` :
					`doesn't have any infusible move slots`;
				problems.push(`${name} has too many infused moves - ${species.name} ${capacity}, so ${move.name} isn't legal.`);
				continue;
			}
			problems.push(`${name}${problem}`);
		}
		return problems;
	}
	validateEvent(set: PokemonSet, setSources: PokemonSource, eventData: EventInfo, eventSpecies: Species): true | undefined;
	validateEvent(
		set: PokemonSet, setSources: PokemonSource, eventData: EventInfo, eventSpecies: Species,
		because: string, from?: string
	): string[] | undefined;
	/**
	 * Returns array of error messages if invalid, undefined if valid
	 * If `because` is not passed, instead returns true if invalid.
	 */
	validateEvent(
		set: PokemonSet, setSources: PokemonSource, eventData: EventInfo, eventSpecies: Species,
		because = ``, from = `from an event`
	) {
		const dex = this.dex;
		let name = set.species;
		const species = dex.species.get(set.species);
		if (!eventSpecies) eventSpecies = species;
		if (set.name && set.species !== set.name && species.baseSpecies !== set.name) name = `${set.name} (${set.species})`;
		const fastReturn = !because;
		if (eventData.from) from = `from ${eventData.from}`;
		const etc = `${because} ${from}`;
		const problems = [];
		if (eventData.level && (set.level || 0) < eventData.level) {
			if (fastReturn) return true;
			problems.push(`${name} must be at least level ${eventData.level}${etc}.`);
		}
		if ((eventData.shiny === true && !set.shiny) || (!eventData.shiny && set.shiny)) {
			if (fastReturn) return true;
			const shinyReq = eventData.shiny ? ` be shiny` : ` not be shiny`;
			problems.push(`${name} must${shinyReq}${etc}.`);
		}
		if (eventData.gender) {
			if (set.gender && eventData.gender !== set.gender) {
				if (fastReturn) return true;
				problems.push(`${name}'s gender must be ${eventData.gender}${etc}.`);
			}
		}
		if (problems.length) return problems;
		if (eventData.gender) set.gender = eventData.gender;
	}
	/**
	 * Returns null if you can learn the move, or a string explaining why you can't learn it.
	 * The following source methods are legal in Indigo Starstorm:
	 *   L### - level-up, learned at level ###
	 *   M    - TM / Move Reminder
	 *   T    - Tutor
	 *   S    - Event
	 *   R    - Restricted
	 */
	//region Check
	checkSpecies(set: PokemonSet, species: Species, tierSpecies: Species, setHas: { [k: string]: true }) {
		const dex = this.dex;
		const ruleTable = this.ruleTable;
		// https://www.smogon.com/forums/posts/8659168
		if ((tierSpecies.id === 'zamazentacrowned' && species.id === 'zamazenta') || (tierSpecies.id === 'zaciancrowned' && species.id === 'zacian')) { species = tierSpecies; }
		setHas['pokemon:' + species.id] = true;
		setHas['basepokemon:' + toID(species.baseSpecies)] = true;
		let isMega = false;
		if (tierSpecies !== species) {
			setHas['pokemon:' + tierSpecies.id] = true;
			if (tierSpecies.isMega || tierSpecies.isPrimal) {
				setHas['pokemontag:mega'] = true;
				isMega = true;
			}
		}
		let banReason = ruleTable.check('pokemon:' + species.id);
		if (banReason) { return `${species.name} is ${banReason}.`; }
		if (banReason === '') return null;
		if (tierSpecies !== species) {
			banReason = ruleTable.check('pokemon:' + tierSpecies.id);
			if (banReason) { return `${tierSpecies.name} is ${banReason}.`; }
			if (banReason === '') return null;
		}
		if (isMega) {
			banReason = ruleTable.check('pokemontag:mega', setHas);
			if (banReason) { return `Mega evolutions are ${banReason}.`; }
		}
		banReason = ruleTable.check('basepokemon:' + toID(species.baseSpecies));
		if (banReason) { return `${species.name} is ${banReason}.`; }
		if (banReason === '') {
			// don't allow nonstandard speciess when whitelisting standard base species
			// i.e. unbanning Pichu doesn't mean allowing Pichu-Spiky-Eared outside of Gen 4
			const baseSpecies = dex.species.get(species.baseSpecies);
			if (baseSpecies.isNonstandard === species.isNonstandard) { return null; }
		}
		// We can't return here because the `-nonexistent` rule is a bit complicated in terms of what trumps it. We don't want e.g.
		// +Mythical to unban Shaymin in Gen 1, for instance.
		let nonexistentCheck = Tags.nonexistent.genericFilter!(tierSpecies) && ruleTable.check('nonexistent');
		const EXISTENCE_TAG = ['past', 'future', 'lgpe', 'unobtainable', 'cap', 'custom', 'nonexistent'];
		for (const ruleid of ruleTable.tagRules) {
			if (ruleid.startsWith('*')) continue;
			const tagid = ruleid.slice(12) as ID;
			const tag = Tags[tagid];
			if ((tag.speciesFilter || tag.genericFilter)!(tierSpecies)) {
				const existenceTag = EXISTENCE_TAG.includes(tagid);
				if (ruleid.startsWith('+')) { // we want rules like +CAP to trump -Nonexistent, but most tags shouldn't
					if (!existenceTag && nonexistentCheck) continue;
					return null;
				}
				if (existenceTag) { // for a nicer error message
					nonexistentCheck = 'banned';
					break;
				}
				return `${species.name} is tagged ${tag.name}, which is ${ruleTable.check(ruleid.slice(1)) || "banned"}.`;
			}
		}
		if (nonexistentCheck) {
			if (tierSpecies.isNonstandard === 'Past' || tierSpecies.isNonstandard === 'Future') { return `${tierSpecies.name} does not exist in Gen ${dex.gen}.`; }
			if (tierSpecies.isNonstandard === 'Unobtainable') { return `${tierSpecies.name} is not possible to obtain in this game.`; }
			return `${tierSpecies.name} does not exist in this game.`;
		}
		if (nonexistentCheck === '') return null;
		banReason = ruleTable.check('pokemontag:allpokemon');
		if (banReason) { return `${species.name} is not in the list of allowed pokemon.`; }
		return null;
	}
	checkItem(set: PokemonSet, item: Item, setHas: { [k: string]: true }) {
		const dex = this.dex;
		const ruleTable = this.ruleTable;
		setHas['item:' + item.id] = true;
		let banReason = ruleTable.check('item:' + (item.id || 'noitem'));
		if (banReason) {
			if (!item.id) { return `${set.name} not holding an item is ${banReason}.`; }
			return `${set.name}'s item ${item.name} is ${banReason}.`;
		}
		if (banReason === '') return null;
		if (!item.id) return null;
		banReason = ruleTable.check('pokemontag:allitems');
		if (banReason) { return `${set.name}'s item ${item.name} is not in the list of allowed items.`; }
		// obtainability
		if (item.isNonstandard) {
			banReason = ruleTable.check('pokemontag:' + toID(item.isNonstandard));
			if (banReason) {
				if (item.isNonstandard === 'Unobtainable') { return `${item.name} is not obtainable without hacking or glitches.`; }
				return `${set.name}'s item ${item.name} is tagged ${item.isNonstandard}, which is ${banReason}.`;
			}
			if (banReason === '') return null;
		}
		if (item.isNonstandard && item.isNonstandard !== 'Unobtainable') {
			banReason = ruleTable.check('nonexistent', setHas);
			if (banReason) {
				if (['Past', 'Future'].includes(item.isNonstandard)) { return `${set.name}'s item ${item.name} does not exist in Gen ${dex.gen}.`; }
				return `${set.name}'s item ${item.name} does not exist in this game.`;
			}
			if (banReason === '') return null;
		}
		return null;
	}
	checkMove(set: PokemonSet, move: Move, setHas: { [k: string]: true }) {
		const dex = this.dex;
		const ruleTable = this.ruleTable;
		setHas['move:' + move.id] = true;
		let banReason = ruleTable.check('move:' + move.id);
		if (banReason) { return `${set.name}'s move ${move.name} is ${banReason}.`; }
		if (banReason === '') return null;
		banReason = ruleTable.check('pokemontag:allmoves');
		if (banReason) { return `${set.name}'s move ${move.name} is not in the list of allowed moves.`; }
		// obtainability
		if (move.isNonstandard) {
			banReason = ruleTable.check('pokemontag:' + toID(move.isNonstandard));
			if (banReason) {
				if (move.isNonstandard === 'Unobtainable') { return `${move.name} is not obtainable without hacking or glitches${move.gen < dex.gen ? ` in Gen ${dex.gen}` : ``}.`; }
				return `${set.name}'s move ${move.name} is tagged ${move.isNonstandard}, which is ${banReason}.`;
			}
			if (banReason === '') return null;
		}
		if (move.isNonstandard && move.isNonstandard !== 'Unobtainable') {
			banReason = ruleTable.check('nonexistent', setHas);
			if (banReason) {
				if (['Past', 'Future'].includes(move.isNonstandard)) { return `${set.name}'s move ${move.name} does not exist in Gen ${dex.gen}.`; }
				return `${set.name}'s move ${move.name} does not exist in this game.`;
			}
			if (banReason === '') return null;
		}
		return null;
	}
	checkAbility(set: PokemonSet, ability: Ability, setHas: { [k: string]: true }) {
		const dex = this.dex;
		const ruleTable = this.ruleTable;
		setHas['ability:' + ability.id] = true;
		let banReason = ruleTable.check('ability:' + ability.id);
		if (banReason) { return `${set.name}'s ability ${ability.name} is ${banReason}.`; }
		if (banReason === '') return null;
		banReason = ruleTable.check('pokemontag:allabilities');
		if (banReason) { return `${set.name}'s ability ${ability.name} is not in the list of allowed abilities.`; }
		// obtainability
		if (ability.isNonstandard) {
			banReason = ruleTable.check('pokemontag:' + toID(ability.isNonstandard));
			if (banReason) { return `${set.name}'s ability ${ability.name} is tagged ${ability.isNonstandard}, which is ${banReason}.`; }
			if (banReason === '') return null;
			banReason = ruleTable.check('nonexistent', setHas);
			if (banReason) {
				if (['Past', 'Future'].includes(ability.isNonstandard)) { return `${set.name}'s ability ${ability.name} does not exist in Gen ${dex.gen}.`; }
				return `${set.name}'s ability ${ability.name} does not exist in this game.`;
			}
			if (banReason === '') return null;
		}
		return null;
	}
	checkNature(set: PokemonSet, nature: Nature, setHas: { [k: string]: true }) {
		const dex = this.dex;
		const ruleTable = this.ruleTable;
		setHas['nature:' + nature.id] = true;
		let banReason = ruleTable.check('nature:' + nature.id);
		if (banReason) { return `${set.name}'s nature ${nature.name} is ${banReason}.`; }
		if (banReason === '') return null;
		banReason = ruleTable.check('allnatures');
		if (banReason) { return `${set.name}'s nature ${nature.name} is not in the list of allowed natures.`; }
		// obtainability
		if (nature.isNonstandard) {
			banReason = ruleTable.check('pokemontag:' + toID(nature.isNonstandard));
			if (banReason) { return `${set.name}'s nature ${nature.name} is tagged ${nature.isNonstandard}, which is ${banReason}.`; }
			if (banReason === '') return null;
			banReason = ruleTable.check('nonexistent', setHas);
			if (banReason) {
				if (['Past', 'Future'].includes(nature.isNonstandard)) { return `${set.name}'s nature ${nature.name} does not exist in Gen ${dex.gen}.`; }
				return `${set.name}'s nature ${nature.name} does not exist in this game.`;
			}
			if (banReason === '') return null;
		}
		return null;
	}
	checkCanLearn(
		move: Move,
		originalSpecies: Species,
		_setSources: any = null,
		set: Partial<PokemonSet> = {}
	): string | null {
		const dex = this.dex;
		move = dex.moves.get(move);
		const level = set.level || 100;
		const fullLearnset = dex.species.getFullLearnset(originalSpecies.id);
		if (!fullLearnset.length) { return ` can't learn any moves at all.`; }
		// Keep the most useful failure message across all sources - an unmet level
		// requirement shouldn't hide a later M/T/E source for the same move.
		let levelFailure: string | null = null;
		for (const { learnset } of fullLearnset) {
			const sources = learnset[move.id];
			if (!sources) continue;
			for (const learned of sources) {
				if (learned.charAt(0) !== '9') continue; // discard leftover non-gen-9 data
				const method = learned.charAt(1);
				switch (method) {
				case 'L': {
					const learnLevel = parseInt(learned.slice(2)) || 1;
					if (level >= learnLevel) { return null; }
					if (!levelFailure) { levelFailure = `'s move ${move.name} is learned at level ${learnLevel}.`; }
					continue;
				}
				case 'M': // TM / Move Reminder
				case 'T': // Tutor
				case 'E': // Egg move -> treated as Tutor in Indigo Starstorm
				case 'S': // Event
				case 'R': // Restricted
					return null;
				default:
					// Any other legacy suffix (e.g. X) is not an obtainable source in Indigo Starstorm.
					continue;
				}
			}
		}
		return levelFailure || ` can't learn ${move.name}.`;
	}
	static fillStats(stats: SparseStatsTable | null, fillNum = 0): StatsTable {
		const filledStats: StatsTable = { hp: fillNum, atk: fillNum, def: fillNum, spa: fillNum, spd: fillNum, spe: fillNum };
		if (stats) {
			let statName: StatID;
			for (statName in filledStats) {
				const stat = stats[statName];
				if (typeof stat === 'number') filledStats[statName] = stat;
			}
		}
		return filledStats;
	}
	static get(format: string | Format) { return new TeamValidator(format); }
}