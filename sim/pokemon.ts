/**
 * Simulator Pokemon
 * Pokemon Showdown - http://pokemonshowdown.com/
 * @license MIT license
 */
import { State } from './state';
import { toID } from './dex';
import type { PokemonMoveRequestData, PokemonSwitchRequestData } from './side';
type BoostID = import('./dex').Dex.BoostID;
type BoostsTable = import('./dex').Dex.BoostsTable;
type SparseBoostsTable = import('./dex').Dex.SparseBoostsTable;
/** A Pokemon's move slot. */
interface MoveSlot {
	id: ID;
	move: string;
	pp: number;
	maxpp: number;
	target?: string;
	disabled: boolean | 'hidden';
	disabledSource?: string;
	used: boolean;
	virtual?: boolean;
}
export interface AbilitySlot {
	slot: 1 | 2;
	id: ID;
	effect: Ability;
	state: EffectState;
}
interface Attacker {
	source: Pokemon;
	damage: number;
	thisTurn: boolean;
	move?: ID;
	slot: PokemonSlot;
	damageValue?: (number | boolean | undefined);
}
export interface EffectState {
	id: string;
	effectOrder: number;
	duration?: number;
	[k: string]: any;
}
// Berries which restore PP/HP and thus inflict external staleness when given to an opponent as there are very few non-malicious competitive reasons to do so
export const RESTORATIVE_BERRIES = new Set(['leppaberry', 'aguavberry', 'enigmaberry', 'figyberry', 'iapapaberry', 'magoberry', 'sitrusberry', 'wikiberry', 'oranberry',] as ID[]);
export class Pokemon {
	readonly side: Side;
	readonly battle: Battle;
	readonly set: PokemonSet;
	readonly name: string;
	/** `` `${sideid}: ${name}` `` - used to refer to pokemon in the protocol */
	readonly fullname: string;
	readonly level: number;
	readonly gender: GenderName;
	readonly happiness: number;
	readonly pokeball: ID;
	readonly baseMoveSlots: MoveSlot[];
	moveSlots: MoveSlot[];
	/**
	 * Index of `pokemon.side.pokemon` and `pokemon.side.active`, which are
	 * guaranteed to be the same for active pokemon. Note that this isn't
	 * its field position in multi battles - use `getSlot()` for that.
	 */
	position: number;
	/**
	 * Information about this pokemon visible to opponents when in battle
	 * (species, gender, level, shininess, tera state).
	 * @see https://github.com/smogon/pokemon-showdown/blob/master/sim/SIM-PROTOCOL.md#identifying-pok%C3%A9mon
	 */
	details: string;
	baseSpecies: Species;
	species: Species;
	speciesState: EffectState;
	status: ID;
	statusState: EffectState;
	volatiles: { [id: string]: EffectState };
	showCure?: boolean;
	/**
	 * These are the basic stats that appear on the in-game stats screen:
	 * calculated purely from the species base stats, level, IVs, EVs,
	 * and Nature, before modifications from item, ability, etc.
	 * Forme changes affect these, but Transform doesn't.
	 */
	baseStoredStats: StatsTable;
	/**
	 * These are pre-modification stored stats in-battle. At switch-in,
	 * they're identical to `baseStoredStats`, but can be temporarily changed
	 * until switch-out by effects such as Power Trick and Transform.
	 * Stat multipliers from abilities, items, and volatiles, such as
	 * Solar Power, Choice Band, or Swords Dance, are not stored in
	 * `storedStats`, but applied on top and accessed by `pokemon.getStat`.
	 */
	storedStats: StatsExceptHPTable;
	boosts: BoostsTable;
	baseAbility1: ID;
	baseAbility2: ID;
	ability1: ID;
	ability2: ID;
	abilityState1: EffectState;
	abilityState2: EffectState;
	usedAuraAbilities: Set<string>;
	item: ID;
	itemState: EffectState;
	lastItem: ID;
	usedItemThisTurn: boolean;
	ateBerry: boolean;
	// Gens 3-4 only
	itemKnockedOff: boolean;
	trapped: boolean | "hidden";
	maybeTrapped: boolean;
	maybeDisabled: boolean;
	/** true = locked,  */
	maybeLocked: boolean | null;
	illusion: Pokemon | null;
	transformed: boolean;
	maxhp: number;
	baseMaxhp: number;
	hp: number;
	fainted: boolean;
	faintQueued: boolean;
	subFainted: boolean | null;
	/** If this Pokemon should revert to its set species when it faints */
	formeRegression: boolean;
	types: string[];
	addedType: string;
	knownType: boolean;
	/** Keeps track of what type the client sees for this Pokemon. */
	apparentType: string;
	// If the switch is called by an effect with a special switch message, like U-turn or Baton Pass, this will be the ID of the calling effect.
	switchFlag: ID | boolean;
	forceSwitchFlag: boolean;
	skipBeforeSwitchOutEventFlag: boolean;
	draggedIn: number | null;
	newlySwitched: boolean;
	beingCalledBack: boolean;
	lastMove: ActiveMove | null;
	lastMoveUsed: ActiveMove | null;
	lastMoveTargetLoc?: number;
	moveThisTurn: string | boolean;
	statsRaisedThisTurn: boolean;
	statsLoweredThisTurn: boolean;
	/**
	 * The result of the last move used on the previous turn by this Pokemon. Stomping Tantrum checks this property for a value of false
	 * when determine whether to double its power, but it has four possible values:
	 * undefined indicates this Pokemon was not active last turn. It should not be used to indicate that a move was attempted and failed, either in a way that boosts Stomping Tantrum or not.
	 * null indicates that the Pokemon's move was skipped in such a way that does not boost Stomping Tantrum, either from having to recharge or spending a turn trapped by another Pokemon's Sky Drop.
	 * false indicates that the move completely failed to execute for any reason not mentioned above, including missing, the target being immune, the user being immobilized by an effect such as paralysis, etc.
	 * true indicates that the move successfully executed one or more of its effects on one or more targets, including hitting with an attack
	 * but dealing 0 damage to the target in cases such as Disguise, or that the move was blocked by one or more moves such as Protect.
	 */
	moveLastTurnResult: boolean | null | undefined;
	/**
	 * The result of the most recent move used this turn by this Pokemon.
	 * At the start of each turn, the value stored here is moved to its counterpart, moveLastTurnResult, and this property is reinitialized to undefined. This property can have one of four possible values:
	 * undefined indicates that this Pokemon has not yet finished an attempt to use a move this turn. As this value is only overwritten after a move finishes execution, it is not sufficient for an event
	 * to examine only this property when checking if a Pokemon has not moved yet this turn if the event could take place during that Pokemon's move.
	 * null indicates that the Pokemon's move was skipped in such a way that does not boost Stomping Tantrum, either from having to recharge or spending a turn trapped by another Pokemon's Sky Drop.
	 * false indicates that the move completely failed to execute for any reason not mentioned above, including missing, the target being immune, the user being immobilized by an effect such as paralysis, etc.
	 * true indicates that the move successfully executed one or more of its effects on one or more targets, including hitting with an attack but dealing 0 damage to the target in cases such as Disguise. It can
	 * also mean that the move was blocked by one or more moves such as Protect. Uniquely, this value can also be true if this Pokemon mega
	 * evolved or ultra bursted this turn, but in that case the value should always be overwritten by a move action before the end of that turn.
	 */
	moveThisTurnResult: boolean | null | undefined;
	hurtThisTurn: number | null;
	lastDamage: number;
	attackedBy: Attacker[];
	timesAttacked: number;
	/**
	 * Necrozma only light-charge counter. Increments every time this Pokemon is hit by a light move
	 * At 3, transforms into Ultra Necrozma
	 */
	lightCharge: number;
	isActive: boolean;
	activeTurns: number;
	/**
	 * This is for Fake-Out-likes specifically - it mostly counts how many move actions you've had since the last time you switched in, so 1/turn normally,
	 * +1 for Dancer/Instruct, -1 for shifting/Sky Drop.
	 * Incremented before the move is used, so the first move use has
	 * `activeMoveActions === 1`.
	 * Unfortunately, Truant counts Mega Evolution as an action and Fake Out doesn't, meaning that Truant can't use this number.
	 */
	activeMoveActions: number;
	previouslySwitchedIn: number;
	truantTurn: boolean;
	bondTriggered: boolean;
	// Gen 9 only
	heroMessageDisplayed: boolean;
	swordBoost: boolean;
	shieldBoost: boolean;
	syrupTriggered: boolean;
	stellarBoostedTypes: string[];
	/** Have this pokemon's Start events run yet? (Start events run every switch-in) */
	isStarted: boolean;
	duringMove: boolean;
	//IS PP depletion effects
	featherDanceSpent: boolean;
	// end of pp effects
	weaponDurability: number;
	maxWeaponDurability: number;
	weaponRecovery: number;
	weaponRecoveryLeft: number;
	weighthg: number;
	heightmm: number;
	shapeMemoryHeightScale?: number;
	shapeMemoryWeightScale?: number;
	mossArmorBroken?: boolean;
	mudArmorBroken?: boolean;
	speed: number;
	canMegaEvo: string | false | null | undefined;
	canMegaEvoX: string | false | null | undefined;
	canMegaEvoY: string | false | null | undefined;
	canMegaEvoZ: string | false | null | undefined;
	canMegaEvoA: string | false | null | undefined;
	canMegaEvoQ: string | false | null | undefined;
	// A Pokemon's Tera type if it can Terastallize, false if it is temporarily unable to tera and should have its ability restored upon switching out, or null if its inability to tera is permanent.
	canTerastallize: string | false | null;
	teraType: string;
	baseTypes: string[];
	terastallized?: string;
	/** Track which types have been used by Tera Shell ability */
	teraShellUsedTypes?: string[];
	/**
	 * The move ID this Pokemon currently uses as its Guard Action.
	 * Can be changed mid-battle by abilities/items (see `getGuardActionMove()`).
	 */
	guardAction: ID;
	/**
	 * Cooldown counter for the Guard Action, in "actions taken" (not turns).
	 * Decrements only when this Pokemon successfully uses a move — switching, flinching, full paralysis, etc. do not decrement it.
	 */
	guardActionCooldown?: number;
	/** A Pokemon's currently 'staleness' with respect to the Endless Battle Clause. */
	staleness?: 'internal' | 'external';
	/** Staleness that will be set once a future action occurs (eg. eating a berry). */
	pendingStaleness?: 'internal' | 'external';
	/** Temporary staleness that lasts only until the Pokemon switches. */
	volatileStaleness?: 'external';
	modifiedStats?: StatsExceptHPTable;
	modifyStat?: (this: Pokemon, statName: StatIDExceptHP, modifier: number) => void;
	// Stadium only
	recalculateStats?: (this: Pokemon) => void;
	// An object for storing untyped data, for mods to use.
	m: {
		innate?: string, // Partners in Crime
		originalSpecies?: string, // Mix and Mega
		[key: string]: any,
	};
	constructor(set: string | AnyObject, side: Side) {
		this.side = side;
		this.battle = side.battle;
		this.m = {};
		const pokemonScripts = this.battle.format.pokemon || this.battle.dex.data.Scripts.pokemon;
		if (pokemonScripts) Object.assign(this, pokemonScripts);
		if (typeof set === 'string') set = { name: set };
		this.baseSpecies = this.battle.dex.species.get(set.species || set.name);
		if (!this.baseSpecies.exists) { throw new Error(`Unidentified species: ${this.baseSpecies.name}`); }
		this.set = set as PokemonSet;
		this.species = this.baseSpecies;
		if (set.name === set.species || !set.name) { set.name = this.baseSpecies.baseSpecies; }
		this.speciesState = this.battle.initEffectState({ id: this.species.id });
		this.name = set.name.substr(0, 20);
		this.fullname = `${this.side.id}: ${this.name}`;
		set.level = this.battle.clampIntRange(set.adjustLevel || set.level || 100, 1, 9999);
		this.level = set.level;
		const genders: { [key: string]: GenderName | null } = { __proto__: null, M: 'M', F: 'F', N: 'N' };
		this.gender = genders[set.gender] || this.species.gender || this.battle.sample(['M', 'F']);
		if (this.gender === 'N') this.gender = '';
		this.happiness = typeof set.happiness === 'number' ? this.battle.clampIntRange(set.happiness, 0, 255) : 255;
		if (this.battle.format.mod === 'gen7letsgo') this.happiness = 70;
		this.pokeball = toID(this.set.pokeball) || 'pokeball' as ID;
		this.baseMoveSlots = [];
		this.moveSlots = [];
		if (!this.set.moves?.length) { throw new Error(`Set ${this.name} has no moves`); }
		for (const moveid of this.set.moves) {
			let move = this.battle.dex.moves.get(moveid);
			if (!move.id) continue;
			let basepp = move.pp;
			this.baseMoveSlots.push({
				move: move.name,
				id: move.id,
				pp: basepp,
				maxpp: basepp,
				target: move.target,
				disabled: false,
				disabledSource: '',
				used: false,
			});
		}
		this.position = 0;
		this.details = this.getUpdatedDetails();
		this.status = '';
		this.statusState = this.battle.initEffectState({});
		this.volatiles = {};
		this.showCure = undefined;
		if (!this.set.evs) { this.set.evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }; }
		if (!this.set.ivs) { this.set.ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 }; }
		const stats: StatsTable = { hp: 31, atk: 31, def: 31, spe: 31, spa: 31, spd: 31 };
		let stat: StatID;
		for (stat in stats) {
			if (!this.set.evs[stat]) this.set.evs[stat] = 0;
			if (!this.set.ivs[stat] && this.set.ivs[stat] !== 0) this.set.ivs[stat] = 31;
		}
		for (stat in this.set.evs) { this.set.evs[stat] = this.battle.clampIntRange(this.set.evs[stat], 0, 255); }
		for (stat in this.set.ivs) { this.set.ivs[stat] = this.battle.clampIntRange(this.set.ivs[stat], 0, 31); }
		// initialized in this.setSpecies(this.baseSpecies)
		this.baseStoredStats = null!;
		this.storedStats = { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
		this.boosts = { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0, crit: 0, };
		this.baseAbility1 = toID(set.ability);
		this.baseAbility2 = toID(set.ability2);
		this.ability1 = this.baseAbility1;
		this.ability2 = this.baseAbility2;
		this.abilityState1 = this.battle.initEffectState({ id: this.ability1, target: this });
		this.abilityState2 = this.battle.initEffectState({ id: this.ability2, target: this });
		this.usedAuraAbilities = new Set();
		this.item = toID(set.item);
		this.itemState = this.battle.initEffectState({ id: this.item, target: this });
		this.lastItem = '';
		this.usedItemThisTurn = false;
		this.itemKnockedOff = false;
		this.ateBerry = false;
		this.trapped = false;
		this.maybeTrapped = false;
		this.maybeDisabled = false;
		this.maybeLocked = false;
		this.illusion = null;
		this.transformed = false;
		this.fainted = false;
		this.faintQueued = false;
		this.subFainted = null;
		this.formeRegression = false;
		this.types = this.baseSpecies.types;
		this.baseTypes = this.types;
		this.addedType = '';
		this.knownType = true;
		this.apparentType = this.baseSpecies.types.join('/');
		// Every Pokemon has a Terastal type
		this.teraType = this.set.teraType || this.types[0];
		this.switchFlag = false;
		this.forceSwitchFlag = false;
		this.skipBeforeSwitchOutEventFlag = false;
		this.draggedIn = null;
		this.newlySwitched = false;
		this.beingCalledBack = false;
		this.lastMove = null;
		this.lastMoveUsed = null;
		this.moveThisTurn = '';
		this.statsRaisedThisTurn = false;
		this.statsLoweredThisTurn = false;
		this.hurtThisTurn = null;
		this.lastDamage = 0;
		this.attackedBy = [];
		this.timesAttacked = 0;
		this.lightCharge = 0;
		this.isActive = false;
		this.activeTurns = 0;
		this.activeMoveActions = 0;
		this.previouslySwitchedIn = 0;
		this.truantTurn = false;
		this.bondTriggered = false;
		this.heroMessageDisplayed = false;
		this.swordBoost = false;
		this.shieldBoost = false;
		this.syrupTriggered = false;
		this.stellarBoostedTypes = [];
		this.isStarted = false;
		this.duringMove = false;
		//IS PP Depletion effects
		this.featherDanceSpent = false;
		//end 
		this.maxWeaponDurability = this.species.weapondurability || 0;
		this.weaponDurability = this.maxWeaponDurability;
		this.weaponRecovery = this.species.weaponrecovery || 0;
		this.weaponRecoveryLeft = 0;
		this.weighthg = 1;
		this.heightmm = 10;
		this.speed = 0;
		this.canMegaEvo = this.battle.actions.canMegaEvo(this);
		this.canMegaEvoX = this.battle.actions.canMegaEvoX?.(this);
		this.canMegaEvoY = this.battle.actions.canMegaEvoY?.(this);
		this.canMegaEvoZ = this.battle.actions.canMegaEvoZ?.(this);
		this.canMegaEvoA = this.battle.actions.canMegaEvoA?.(this);
		this.canMegaEvoQ = this.battle.actions.canMegaEvoQ?.(this);
		this.canTerastallize = this.battle.actions.canTerastallize(this);
		const guardActionPool = (this.species.guardAction || []).map(toID);
		let chosenGuardAction = toID((this.set as any).guardAction);
		if (guardActionPool.length) {
			if (!chosenGuardAction || !guardActionPool.includes(chosenGuardAction)) { chosenGuardAction = guardActionPool[0]; }
		} else { chosenGuardAction = '' as ID; }
		this.guardAction = chosenGuardAction;
		this.guardActionCooldown = 0;
		this.maxhp = 0;
		this.baseMaxhp = 0;
		this.hp = 0;
		this.clearVolatile();
		this.hp = this.maxhp;
	}
	toJSON(): AnyObject { return State.serializePokemon(this); }
	get moves(): readonly string[] { return this.moveSlots.map(moveSlot => moveSlot.id); }
	get baseMoves(): readonly string[] { return this.baseMoveSlots.map(moveSlot => moveSlot.id); }
	getSlot(): PokemonSlot {
		const positionOffset = Math.floor(this.side.n / 2) * this.side.active.length;
		const positionLetter = 'abcdef'.charAt(this.position + positionOffset);
		return (this.side.id + positionLetter) as PokemonSlot;
	}
	toString() {
		const fullname = (this.illusion) ? this.illusion.fullname : this.fullname;
		return this.isActive ? this.getSlot() + fullname.slice(2) : fullname;
	}
	getUpdatedDetails(level?: number) {
		let name = this.species.name;
		if (['Greninja-Bond', 'Rockruff-Dusk'].includes(name)) name = this.species.baseSpecies;
		if (!level) level = this.level;
		return name + (level === 100 ? '' : `, L${level}`) + (this.gender === '' ? '' : `, ${this.gender}`) + (this.set.shiny ? ', shiny' : '');
	}
	getFullDetails = () => {
		const health = this.getHealth();
		let details = this.details;
		if (this.illusion) { details = this.illusion.getUpdatedDetails(this.battle.ruleTable.has('illusionlevelmod') ? this.illusion.level : this.level); }
		if (this.terastallized) details += `, tera:${this.terastallized}`;
		return { side: health.side, secret: `${details}|${health.secret}`, shared: `${details}|${health.shared}` };
	};
	updateSpeed() { this.speed = this.getActionSpeed(); }
	calculateStat(statName: StatIDExceptHP, boost: number, modifier?: number, statUser?: Pokemon) {
		statName = toID(statName) as StatIDExceptHP;
		// @ts-expect-error type checking prevents 'hp' from being passed, but we're paranoid
		if (statName === 'hp') throw new Error("Please read `maxhp` directly");
		// base stat
		let stat = this.storedStats[statName];
		// Wonder Room swaps defenses before calculating anything else
		if ('wonderroom' in this.battle.field.pseudoWeather) {
			if (statName === 'def') { stat = this.storedStats['spd']; } 
			else if (statName === 'spd') { stat = this.storedStats['def']; }
		}
		// stat boosts
		let boosts: SparseBoostsTable = {};
		const boostName = statName as BoostID;
		boosts[boostName] = boost;
		boosts = this.battle.runEvent('ModifyBoost', statUser || this, null, null, boosts);
		boost = boosts[boostName]!;
		const boostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
		if (boost > 6) boost = 6;
		if (boost < -6) boost = -6;
		if (boost >= 0) { stat = Math.floor(stat * boostTable[boost]); } 
		else { stat = Math.floor(stat / boostTable[-boost]); }
		// stat modifier
		return this.battle.modify(stat, (modifier || 1));
	}
	getStat(statName: StatIDExceptHP, unboosted?: boolean, unmodified?: boolean) {
		statName = toID(statName) as StatIDExceptHP;
		// @ts-expect-error type checking prevents 'hp' from being passed, but we're paranoid
		if (statName === 'hp') throw new Error("Please read `maxhp` directly");
		// base stat
		let stat = this.storedStats[statName];
		// Download ignores Wonder Room's effect, but this results in
		// stat stages being calculated on the opposite defensive stat
		if (unmodified && 'wonderroom' in this.battle.field.pseudoWeather) {
			if (statName === 'def') { statName = 'spd'; } 
			else if (statName === 'spd') { statName = 'def'; }
		}
		// stat boosts
		if (!unboosted) {
			let boosts = this.boosts;
			if (!unmodified) { boosts = this.battle.runEvent('ModifyBoost', this, null, null, { ...boosts }); }
			let boost = boosts[statName];
			const boostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
			if (boost > 6) boost = 6;
			if (boost < -6) boost = -6;
			if (boost >= 0) { stat = Math.floor(stat * boostTable[boost]); } 
			else { stat = Math.floor(stat / boostTable[-boost]); }
		}
		// stat modifier effects
		if (!unmodified) {
			const statTable: { [s in StatIDExceptHP]: string } = { atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe' };
			stat = this.battle.runEvent('Modify' + statTable[statName], this, null, null, stat);
		}
		if (statName === 'spe' && stat > 10000 && !this.battle.format.battle?.trunc) stat = 10000;
		return stat;
	}
	getActionSpeed() {
		let speed = this.getStat('spe', false, false);
		const trickRoomCheck = this.battle.ruleTable.has('twisteddimensionmod') ?
			!this.battle.field.getPseudoWeather('trickroom') : this.battle.field.getPseudoWeather('trickroom');
		if (trickRoomCheck) { speed = 10000 - speed; }
		return this.battle.trunc(speed, 13);
	}
	/**
	 * Gets the Pokemon's best stat.
	 * Moved to its own method due to frequent use of the same code.
	 * Used by Beast Boost, Quark Drive, and Protosynthesis.
	 */
	getBestStat(unboosted?: boolean, unmodified?: boolean): StatIDExceptHP {
		let statName: StatIDExceptHP = 'atk';
		let bestStat = 0;
		const stats: StatIDExceptHP[] = ['atk', 'def', 'spa', 'spd', 'spe'];
		for (const i of stats) {
			if (this.getStat(i, unboosted, unmodified) > bestStat) {
				statName = i;
				bestStat = this.getStat(i, unboosted, unmodified);
			}
		}
		return statName;
	}
	/* Commented out for now until a use for Combat Power is found in Let's Go
	getCombatPower() {
		let statSum = 0;
		let awakeningSum = 0;
		for (const stat in this.stats) {
			statSum += this.calculateStat(stat, this.boosts[stat as BoostName]);
			awakeningSum += this.calculateStat(stat, this.boosts[stat as BoostName]) + this.set.evs[stat];
		}
		const combatPower = Math.floor(Math.floor(statSum * this.level * 6 / 100) + (Math.floor(awakeningSum) * Math.floor((this.level * 4) / 100 + 2)));
		return this.battle.clampIntRange(combatPower, 0, 10000);
	}
	*/
	getWeight(): number { // canonical current weight is stored in hg
		let hg = this.weighthg;
		if (hg < 1) hg = 1; // 0.1kg minimum (1 hg = 0.1 kg)
		return hg / 10;
	}
	getHeightm(): number { // canonical current height is stored in mm
		let mm = this.heightmm;
		if (mm < 10) mm = 10; // 0.01m minimum
		return mm / 1000;
	}

	hasWeapon() { return this.weaponDurability > 0; }
	sendWeaponState() {
		if (this.maxWeaponDurability <= 0) return;
		let message = `${this.weaponDurability}/${this.maxWeaponDurability}`;
		if (this.weaponDurability === 0 && this.weaponRecoveryLeft > 0) { message += `|[recover]${this.weaponRecoveryLeft}`; }
		this.battle.add('-weapon', this, message);
	}
		tickWeaponRecovery() {
		if (this.maxWeaponDurability <= 0) return false;
		if (this.weaponDurability > 0) return false;
		if (this.weaponRecoveryLeft <= 0) return false;
		this.weaponRecoveryLeft--;
		if (this.weaponRecoveryLeft <= 0) {
			this.weaponDurability = this.maxWeaponDurability;
			this.weaponRecoveryLeft = 0;
			const crownedForme: { [k: string]: [string, string] } = {
				zacian: ['Zacian-Crowned', 'rustedsword'],
				zamazenta: ['Zamazenta-Crowned', 'rustedshield'],
			};
			const target = crownedForme[this.species.id];
			if (target && !this.item) {
				this.setItem(target[1]);
				this.formeChange(target[0], null, true);
			}
			this.sendWeaponState();
			this.battle.add('-message', `${this.name}'s weapon recovered!`);
			return true;
		}
		this.sendWeaponState();
		return false;
	}
	damageWeapon(amount: number) {
		if (this.maxWeaponDurability <= 0 || amount <= 0) return 0;
		const oldDurability = this.weaponDurability;
		this.weaponDurability = Math.max(0, this.weaponDurability - amount);
		if (oldDurability > 0 && this.weaponDurability === 0) {
			if (this.weaponRecovery > 0) { this.weaponRecoveryLeft = this.weaponRecovery; }
			this.breakWeapon();
		}
		if (oldDurability !== this.weaponDurability) { this.sendWeaponState(); }
		return oldDurability - this.weaponDurability;
	}
	breakWeapon() {
		if (this.weaponDurability > 0) return;
		const item = this.getItem();
		if (!item || !item.id || !item.onWeaponBreak) return;
		this.battle.singleEvent('WeaponBreak', item, this.itemState, this);
	}
	restoreWeapon(amount: number) {
		if (this.maxWeaponDurability <= 0 || amount <= 0) return 0;
		const oldDurability = this.weaponDurability;
		this.weaponDurability = Math.min(this.maxWeaponDurability, this.weaponDurability + amount);
		if (this.weaponDurability > 0) this.weaponRecoveryLeft = 0;
		if (oldDurability !== this.weaponDurability) { this.sendWeaponState(); }
		return this.weaponDurability - oldDurability;
	}
	
	getMoveData(move: string | Move) {
		move = this.battle.dex.moves.get(move);
		for (const moveSlot of this.moveSlots) { if (moveSlot.id === move.id) { return moveSlot; } }
		return null;
	}
	getMoveHitData(move: ActiveMove) {
		if (!move.moveHitData) move.moveHitData = {};
		const slot = this.getSlot();
		return move.moveHitData[slot] || (move.moveHitData[slot] = {
			crit: false,
			typeMod: 0,
		});
	}
	alliesAndSelf(): Pokemon[] { return this.side.allies(); }
	allies(): Pokemon[] { return this.side.allies().filter(ally => ally !== this); }
	adjacentAllies(): Pokemon[] { return this.side.allies().filter(ally => this.isAdjacent(ally)); }
	foes(all?: boolean): Pokemon[] { return this.side.foes(all); }
	adjacentFoes(): Pokemon[] {
		if (this.battle.activePerHalf <= 2) return this.side.foes();
		return this.side.foes().filter(foe => this.isAdjacent(foe));
	}
	isAlly(pokemon: Pokemon | null) { return !!pokemon && (this.side === pokemon.side || this.side.allySide === pokemon.side); }
	isAdjacent(pokemon2: Pokemon) {
		if (this.fainted || pokemon2.fainted) return false;
		if (this.battle.activePerHalf <= 2) return this !== pokemon2;
		if (this.side === pokemon2.side) return Math.abs(this.position - pokemon2.position) === 1;
		return Math.abs(this.position + pokemon2.position + 1 - this.side.active.length) <= 1;
	}
	getUndynamaxedHP(amount?: number) { return amount || this.hp; }
	/** Get targets for Dragon Darts */
	getSmartTargets(target: Pokemon, move: ActiveMove) {
		const target2 = target.adjacentAllies()[0];
		if (!target2 || target2 === this || !target2.hp) {
			move.smartTarget = false;
			return [target];
		}
		if (!target.hp) {
			move.smartTarget = false;
			return [target2];
		}
		return [target, target2];
	}
	getAtLoc(targetLoc: number) {
		let side = this.battle.sides[targetLoc < 0 ? this.side.n % 2 : (this.side.n + 1) % 2];
		targetLoc = Math.abs(targetLoc);
		if (targetLoc > side.active.length) {
			targetLoc -= side.active.length;
			side = this.battle.sides[side.n + 2];
		}
		return side.active[targetLoc - 1];
	}
	// Returns a relative location: 1-3, positive for foe, and negative for ally. Use `getAtLoc` to reverse.
	getLocOf(target: Pokemon) {
		const positionOffset = Math.floor(target.side.n / 2) * target.side.active.length;
		const position = target.position + positionOffset + 1;
		const sameHalf = (this.side.n % 2) === (target.side.n % 2);
		return sameHalf ? -position : position;
	}
	getMoveTargets(move: ActiveMove, target: Pokemon): { targets: Pokemon[], pressureTargets: Pokemon[] } {
		let targets: Pokemon[] = [];
		switch (move.target) {
		case 'all':
		case 'foeSide':
		case 'allySide':
		case 'allyTeam':
			if (!move.target.startsWith('foe')) { targets.push(...this.alliesAndSelf()); }
			if (!move.target.startsWith('ally')) { targets.push(...this.foes(true)); }
			if (targets.length && !targets.includes(target)) { this.battle.retargetLastMove(targets[targets.length - 1]); }
			break;
		case 'allAdjacent':
			targets.push(...this.adjacentAllies());
			// falls through
		case 'allAdjacentFoes':
			targets.push(...this.adjacentFoes());
			if (targets.length && !targets.includes(target)) { this.battle.retargetLastMove(targets[targets.length - 1]); }
			break;
		case 'allies':
			targets = this.alliesAndSelf();
			break;
		default:
			const selectedTarget = target;
			if (!target || (target.fainted && !target.isAlly(this)) && this.battle.gameType !== 'freeforall') {
				// If a targeted foe faints, the move is retargeted
				const possibleTarget = this.battle.getRandomTarget(this, move);
				if (!possibleTarget) return { targets: [], pressureTargets: [] };
				target = possibleTarget;
			}
			if (this.battle.activePerHalf > 1 && !move.tracksTarget) {
				const isCharging = move.flags['charge'] && !this.volatiles['twoturnmove'] &&
					!(move.id.startsWith('solarb') && ['sunnyday', 'desolateland'].includes(this.effectiveWeather())) &&
					!(move.id === 'electroshot' && ['raindance', 'primordialsea'].includes(this.effectiveWeather())) &&
					!(this.hasItem('powerherb') && move.id !== 'skydrop');
				if (!isCharging && !(move.id === 'pursuit' && (target.beingCalledBack || target.switchFlag))) { target = this.battle.priorityEvent('RedirectTarget', this, this, move, target); }
			}
			if (move.smartTarget) {
				targets = this.getSmartTargets(target, move);
				target = targets[0];
			} else { targets.push(target); }
			if (target.fainted && !move.flags['futuremove']) { return { targets: [], pressureTargets: [] }; }
			if (selectedTarget !== target) { this.battle.retargetLastMove(target); }
		}
		// Resolve apparent targets for Pressure.
		let pressureTargets = targets;
		if (move.target === 'foeSide') { pressureTargets = []; }
		if (move.flags['mustpressure']) { pressureTargets = this.foes(); }
		return { targets, pressureTargets };
	}
	ignoringAbility() {
		if (!this.isActive) return true;
		const abilitySlots = this.getAbilitySlots();
		// Certain Abilities won't activate while Transformed, even if they ordinarily
		// couldn't be suppressed (e.g. Disguise).
		if (this.transformed && abilitySlots.some((slot: any) => slot.effect.flags['notransform'])) { return true; }
		// If any ability slot is unsuppressible, abilities are not being ignored.
		if (abilitySlots.some((slot: any) => slot.effect.flags['cantsuppress'])) { return false; }
		if (this.volatiles['gastroacid']) return true;
		if (this.hasItem('Ability Shield') || this.ability1 === 'neutralizinggas' || this.ability2 === 'neutralizinggas') { return false; }
		for (const pokemon of this.battle.getAllActive()) { if ((pokemon.ability1 === 'neutralizinggas' || pokemon.ability2 === 'neutralizinggas') && !pokemon.volatiles['gastroacid'] && !pokemon.transformed && pokemon !== this) { return true; } }
		return false;
	}
	ignoringItem(isFling = false) {
		if (this.getItem().isPrimalOrb) return false;
		if (!this.isActive) return true;
		if (this.volatiles['embargo'] || this.battle.field.pseudoWeather['magicroom']) return true;
		// check Fling first to avoid infinite recursion
		if (isFling) return this.hasAbility('klutz');
		return !this.getItem().ignoreKlutz && this.hasAbility('klutz');
	}
	deductPP(move: string | Move, amount?: number | null, target?: Pokemon | null | false) {
		const gen = this.battle.gen;
		move = this.battle.dex.moves.get(move);
		const ppData = this.getMoveData(move);
		if (!ppData) return 0;
		ppData.used = true;
		if (!ppData.pp) return 0;
		const oldPP = ppData.pp;
		if (!amount) amount = 1;
		ppData.pp -= amount;
		if (ppData.pp < 0) {
			amount += ppData.pp;
			ppData.pp = 0;
		}
		if (move.id === 'featherdance' && oldPP > 0 && ppData.pp === 0) {
			this.featherDanceSpent = true;
			this.addVolatile('defeathered');
		}
		return amount;
	}
	moveUsed(move: ActiveMove, targetLoc?: number) {
		this.lastMove = move;
		this.lastMoveTargetLoc = targetLoc;
		this.moveThisTurn = move.id;
	}
	gotAttacked(move: string | Move, damage: number | false | undefined, source: Pokemon) {
		const damageNumber = (typeof damage === 'number') ? damage : 0;
		move = this.battle.dex.moves.get(move);
		this.attackedBy.push({
			source,
			damage: damageNumber,
			move: move.id,
			thisTurn: true,
			slot: source.getSlot(),
			damageValue: damage,
		});
	}
	getLastAttackedBy() {
		if (this.attackedBy.length === 0) return undefined;
		return this.attackedBy[this.attackedBy.length - 1];
	}
	getLastDamagedBy(filterOutSameSide: boolean) {
		const damagedBy: Attacker[] = this.attackedBy.filter(attacker => (typeof attacker.damageValue === 'number' && (filterOutSameSide === undefined || !this.isAlly(attacker.source))));
		if (damagedBy.length === 0) return undefined;
		return damagedBy[damagedBy.length - 1];
	}
	// This refers to multi-turn moves like SolarBeam and Outrage and Sky Drop, which remove all choice (no switching, etc). Don't use it for "soft locks" like Choice Band.
	getLockedMove(): ID | null {
		const lockedMove = this.battle.runEvent('LockMove', this);
		return (lockedMove === true) ? null : lockedMove;
	}
	getMoves(lockedMove?: ID | null, restrictData?: boolean): {
		move: string, id: ID, disabled?: string | boolean, disabledSource?: string,
		target?: string, pp?: number, maxpp?: number,
	}[] {
		if (lockedMove) {
			lockedMove = toID(lockedMove);
			this.trapped = true;
			if (lockedMove === 'recharge') {
				return [{
					move: 'Recharge',
					id: 'recharge' as ID,
				}];
			}
			for (const moveSlot of this.moveSlots) {
				if (moveSlot.id !== lockedMove) continue;
				return [{
					move: moveSlot.move,
					id: moveSlot.id,
				}];
			}
			// does this happen?
			return [{
				move: this.battle.dex.moves.get(lockedMove).name,
				id: lockedMove,
			}];
		}
		const moves = [];
		let hasValidMove = false;
		for (const moveSlot of this.moveSlots) {
			let moveName = moveSlot.move;
			if (moveSlot.id === 'return' || moveSlot.id === 'frustration') {
				const basePowerCallback = this.battle.dex.moves.get(moveSlot.id).basePowerCallback as (pokemon: Pokemon) => number;
				moveName += ` ${basePowerCallback(this)}`;
			}
			let target = moveSlot.target;
			switch (moveSlot.id) {
			case 'curse':
				if (!this.hasType('Ghost')) { target = this.battle.dex.moves.get('curse').nonGhostTarget; }
				break;
			case 'pollenpuff':
				// Heal Block only prevents Pollen Puff from targeting an ally when the user has Heal Block
				if (this.volatiles['healblock']) { target = 'adjacentFoe'; }
				break;
			case 'terastarstorm':
				if (this.species.name === 'Terapagos-Stellar') { target = 'allAdjacentFoes'; }
				break;
			}
			let disabled = moveSlot.disabled;
			if (moveSlot.pp <= 0 && !this.volatiles['partialtrappinglock']) { disabled = true; }
			const move = this.battle.dex.moves.get(moveSlot.id);
			const requiresWeapon = move.weaponmoveCallback ? move.weaponmoveCallback(this) : move.weaponmove;
			if (requiresWeapon && this.weaponDurability <= 0) { disabled = true; }
			if (disabled === 'hidden') { disabled = !restrictData; }
			if (!disabled) { hasValidMove = true; }
			moves.push({
				move: moveName,
				id: moveSlot.id,
				pp: moveSlot.pp,
				maxpp: moveSlot.maxpp,
				target,
				disabled,
			});
		}
		return hasValidMove ? moves : [];
	}
	getMoveRequestData() {
		let lockedMove = this.maybeLocked ? null : this.getLockedMove();
		// Information should be restricted for the last active Pokémon
		const isLastActive = this.isLastActive();
		const canSwitchIn = this.battle.canSwitch(this.side) > 0;
		let moves = this.getMoves(lockedMove, isLastActive);
		if (!moves.length) {
			moves = [{ move: 'Struggle', id: 'struggle' as ID, target: 'randomNormal', disabled: false }];
			lockedMove = 'struggle' as ID;
		}
		const data: PokemonMoveRequestData = { moves, };
		if (isLastActive) {
			this.maybeDisabled = this.maybeDisabled && !lockedMove;
			this.maybeLocked = this.maybeLocked || this.maybeDisabled;
			if (this.maybeDisabled) { data.maybeDisabled = this.maybeDisabled; }
			if (this.maybeLocked) { data.maybeLocked = this.maybeLocked; }
			if (canSwitchIn) {
				if (this.trapped === true) { data.trapped = true; } 
				else if (this.maybeTrapped) { data.maybeTrapped = true; }
			}
		} else {
			this.maybeDisabled = false;
			this.maybeLocked = false;
			if (canSwitchIn) { if (this.trapped) data.trapped = true; } // Discovered by selecting a valid Pokémon as a switch target and cancelling.
			this.maybeTrapped = false;
		}
		if (!lockedMove) {
			if (this.canMegaEvoX) data.canMegaEvoX = true;
			if (this.canMegaEvoY) data.canMegaEvoY = true;
			if (this.canMegaEvoZ) data.canMegaEvoZ = true;
			if (this.canMegaEvoA) data.canMegaEvoA = true;
			if (this.canMegaEvoQ) data.canMegaEvoQ = true;
			if (this.canTerastallize) data.canTerastallize = this.canTerastallize;
		}
		return data;
	}
	getSwitchRequestData(forAlly?: boolean): PokemonSwitchRequestData {
		const entry: PokemonSwitchRequestData = {
			ident: this.fullname,
			details: this.details,
			condition: this.getHealth().secret,
			active: (this.position < this.side.active.length),
			stats: {
				atk: this.baseStoredStats['atk'],
				def: this.baseStoredStats['def'],
				spa: this.baseStoredStats['spa'],
				spd: this.baseStoredStats['spd'],
				spe: this.baseStoredStats['spe'],
			},
			moves: this[forAlly ? 'baseMoves' : 'moves'].map(move => {
				if (move === 'frustration' || move === 'return') {
					const basePowerCallback = this.battle.dex.moves.get(move).basePowerCallback as (pokemon: Pokemon) => number;
					return `${move}${basePowerCallback(this)}` as ID;
				}
				return move as ID;
			}),
			baseAbility: this.baseAbility1,
			baseAbility2: this.baseAbility2,
			item: this.item,
			pokeball: this.pokeball,
		};
		entry.ability = this.ability1;
		entry.ability2 = this.ability2;
		entry.commanding = !!this.volatiles['commanding'] && !this.fainted;
		const activeSlot = this.side.active.indexOf(this);
		entry.reviving = activeSlot >= 0 && !!this.side.slotConditions[activeSlot]?.['revivalblessing'];
		entry.teraType = this.teraType;
		entry.terastallized = this.terastallized || '';
		return entry;
	}
	getGuardActionMove(): Move | null {
		// 5-tier source priority: Item -> Debuffs -> Buffs -> Ability1 -> Ability2.
		// Debuff/buff volatile tagging isn't implemented yet
		const item = this.ignoringItem() ? null : this.getItem();
		const ability1 = this.getAbility(1);
		const ability2 = this.getAbility(2);
		const hasOpinion = (source: AnyObject | null) => !!source && ((source as any).blocksGuardAction || (source as any).forcedGuardAction);
		let source: AnyObject | null = null;
		if (hasOpinion(item)) source = item;
		else if (hasOpinion(ability1)) source = ability1;
		else if (hasOpinion(ability2)) source = ability2;
		if (source && (source as any).blocksGuardAction) return null;
		let guardActionId: ID = source && (source as any).forcedGuardAction ? toID((source as any).forcedGuardAction) : this.guardAction;
		if (!guardActionId) return null;
		const modified = this.battle.runEvent('ModifyGuardAction', this, null, null, guardActionId);
		if (modified && typeof modified === 'string') guardActionId = toID(modified);
		const move = this.battle.dex.moves.get(guardActionId);
		return move.exists ? move : null;
	}
	isLastActive() {
		if (!this.isActive) return false;
		const allyActive = this.side.active;
		for (let i = this.position + 1; i < allyActive.length; i++) { if (allyActive[i] && !allyActive[i].fainted) return false; }
		return true;
	}
	positiveBoosts() {
		let boosts = 0;
		let boost: BoostID;
		for (boost in this.boosts) { if (this.boosts[boost] > 0) boosts += this.boosts[boost]; }
		return boosts;
	}
	getCappedBoost(boosts: SparseBoostsTable) {
		const cappedBoost: SparseBoostsTable = {};
		let boostName: BoostID;
		for (boostName in boosts) {
			const boost = boosts[boostName];
			if (!boost) continue;

			const min = boostName === 'crit' ? -4 : -6;
			const max = boostName === 'crit' ? 11 : 6;

			cappedBoost[boostName] =
				this.battle.clampIntRange(this.boosts[boostName] + boost, min, max) - this.boosts[boostName];
		}
		return cappedBoost;
	}
	boostBy(boosts: SparseBoostsTable) {
		boosts = this.getCappedBoost(boosts);
		let delta = 0;
		let boostName: BoostID;
		for (boostName in boosts) {
			delta = boosts[boostName]!;
			this.boosts[boostName] += delta;
		}
		return delta;
	}
	clearBoosts() {
		let boostName: BoostID;
		for (boostName in this.boosts) { this.boosts[boostName] = 0; }
	}
	setBoost(boosts: SparseBoostsTable) {
		let boostName: BoostID;
		for (boostName in boosts) { this.boosts[boostName] = boosts[boostName]!; }
	}
	copyVolatileFrom(pokemon: Pokemon, switchCause?: string | boolean) {
		this.clearVolatile();
		if (switchCause !== 'shedtail') this.boosts = pokemon.boosts;
		for (const i in pokemon.volatiles) {
			if (switchCause === 'shedtail' && i !== 'substitute') continue;
			if (this.battle.dex.conditions.getByID(i as ID).noCopy) continue;
			// shallow clones
			this.volatiles[i] = this.battle.initEffectState({ ...pokemon.volatiles[i], target: this });
			if (this.volatiles[i].linkedPokemon) {
				delete pokemon.volatiles[i].linkedPokemon;
				delete pokemon.volatiles[i].linkedStatus;
				for (const linkedPoke of this.volatiles[i].linkedPokemon) {
					const linkedPokeLinks = linkedPoke.volatiles[this.volatiles[i].linkedStatus].linkedPokemon;
					linkedPokeLinks[linkedPokeLinks.indexOf(pokemon)] = this;
				}
			}
		}
		pokemon.clearVolatile();
		for (const i in this.volatiles) {
			const volatile = this.getVolatile(i) as Condition;
			this.battle.singleEvent('Copy', volatile, this.volatiles[i], this);
		}
	}
	transformInto(pokemon: Pokemon, effect?: Effect) {
		const species = pokemon.species;
		if (
			pokemon.fainted || this.illusion || pokemon.illusion || pokemon.volatiles['substitute'] ||
			(pokemon.transformed) || (this.transformed) || species.name === 'Eternatus-Eternamax' ||
			(['Ogerpon', 'Terapagos'].includes(species.baseSpecies) && (this.terastallized || pokemon.terastallized)) ||
			this.terastallized === 'Stellar'
		) { return false; }
		if (this.battle.dex.currentMod === 'gen1stadium' && (species.name === 'Ditto' || (this.species.name === 'Ditto' && pokemon.moves.includes('transform')))) { return false; }
		// Shape Memory: preserve relative height/weight scaling across Transform
		let heightScale = 1;
		let weightScale = 1;
		const getBaselinesFor = (sp: Species) => {
			const size = (this.set as any).size || 'M';
			let tiers = 0;
			if (size === 'XS') tiers = -2;
			else if (size === 'S') tiers = -1;
			else if (size === 'L') tiers = 1;
			else if (size === 'XL') tiers = 2;
			const wMod = (sp as any).sizeWeightModifier ?? 0.1;
			const hMod = (sp as any).sizeHeightModifier ?? 0.1;
			const baseWeighthg = Math.max(1, Math.round(sp.weighthg * (1 + (tiers * wMod))));
			const baseHeightmm = Math.max(10, Math.round((((sp as any).heightm || 0) * 1000) * (1 + (tiers * hMod))));
			return {baseWeighthg, baseHeightmm};
		};
		if (this.volatiles['shapememory']) {
  			// Prefer persisted memory (survives switching)
  			weightScale = this.shapeMemoryWeightScale ?? 1;
  			heightScale = this.shapeMemoryHeightScale ?? 1;
  			// But if we currently have non-baseline size (e.g. boosted while active),
  			// update the memory from CURRENT form before transforming again.
  			const {baseWeighthg, baseHeightmm} = getBaselinesFor(this.species);
  			if (baseWeighthg) weightScale = this.weighthg / baseWeighthg;
  			if (baseHeightmm) heightScale = this.heightmm / baseHeightmm;
  			this.shapeMemoryWeightScale = weightScale;
  			this.shapeMemoryHeightScale = heightScale;
		}
		if (!this.setSpecies(species, effect, true)) return false;
		this.transformed = true;
		if (this.volatiles['shapememory']) { // apply scaling to the new form's baseline
			const {baseWeighthg, baseHeightmm} = getBaselinesFor(this.species);
			this.weighthg = Math.max(1, Math.round(baseWeighthg * weightScale));
			this.heightmm = Math.max(10, Math.round(baseHeightmm * heightScale));
		} else {
			this.weighthg = pokemon.weighthg;
			this.heightmm = pokemon.heightmm;
		}
		const types = pokemon.getTypes(true, true);
		this.setType(pokemon.volatiles['roost'] ? pokemon.volatiles['roost'].typeWas : types, true);
		this.addedType = pokemon.addedType;
		this.knownType = this.isAlly(pokemon) && pokemon.knownType;
		this.apparentType = pokemon.apparentType;
		let statName: StatIDExceptHP;
		for (statName in this.storedStats) {
			this.storedStats[statName] = pokemon.storedStats[statName];
			if (this.modifiedStats) this.modifiedStats[statName] = pokemon.modifiedStats![statName]; 
		}
		this.moveSlots = [];
		this.timesAttacked = pokemon.timesAttacked;
		for (const moveSlot of pokemon.moveSlots) {
			let moveName = moveSlot.move;
			this.moveSlots.push({
				move: moveName,
				id: moveSlot.id,
				pp: moveSlot.maxpp === 1 ? 1 : 5,
				maxpp: this.battle.gen >= 5 ? (moveSlot.maxpp === 1 ? 1 : 5) : moveSlot.maxpp,
				target: moveSlot.target,
				disabled: false,
				used: false,
				virtual: true,
			});
		}
		let boostName: BoostID;
		for (boostName in pokemon.boosts) { this.boosts[boostName] = pokemon.boosts[boostName]; }
		// we need to remove all of the overlapping crit volatiles before adding any of them
		const volatilesToCopy = ['focusenergy', 'laserfocus'];
		for (const volatile of volatilesToCopy) this.removeVolatile(volatile);
		for (const volatile of volatilesToCopy) { if (pokemon.volatiles[volatile]) { this.addVolatile(volatile); } }
		this.m.dragoncheer = pokemon.m.dragoncheer || 0;
		if (effect) { this.battle.add('-transform', this, pokemon, '[from] ' + effect.fullname); } 
		else { this.battle.add('-transform', this, pokemon); }
		if (this.terastallized) {
			this.knownType = true;
			this.apparentType = this.terastallized;
		}
		this.setAbility(pokemon.ability1, this, null, true, true, 1);
		if (pokemon.ability2) { this.setAbility(pokemon.ability2, this, null, true, true, 2); } 
		else { this.ability2 = '' as ID; }
		// Pokemon transformed into Ogerpon cannot Terastallize
		// Restoring their ability to tera after they untransform is handled ELSEWHERE
		if (['Ogerpon', 'Terapagos'].includes(this.species.baseSpecies) && this.canTerastallize) this.canTerastallize = false;
		return true;
	}
	/**
	 * Changes this Pokemon's species to the given speciesId (or species).
	 * This function only handles changes to stats and type.
	 * Use formeChange to handle changes to ability and sending client messages.
	 */
	setSpecies(rawSpecies: Species, source: Effect | null = this.battle.effect, isTransform = false) {
		const species = this.battle.runEvent('ModifySpecies', this, null, source, rawSpecies);
		if (!species) return null;
		this.species = species;
		this.setType(species.types, true);
		this.apparentType = rawSpecies.types.join('/');
		this.addedType = species.addedType || '';
		this.knownType = true;
		// Apply size modifier to weight
		const sizeWeightModifier = species.sizeWeightModifier || 0.1;
		let sizeTiers = 0;
		const size = this.set.size || 'M';
		if (size === 'XS') sizeTiers = -2;
		else if (size === 'S') sizeTiers = -1;
		else if (size === 'L') sizeTiers = 1;
		else if (size === 'XL') sizeTiers = 2;
		this.weighthg = Math.round(species.weighthg * (1 + (sizeTiers * sizeWeightModifier)));
		// Apply size modifier to height
		const sizeHeightModifier = (species as any).sizeHeightModifier ?? 0.1;
		let sizeTiersHeight = 0;
		const sizeH = this.set.size || 'M';
		if (sizeH === 'XS') sizeTiersHeight = -2;
		else if (sizeH === 'S') sizeTiersHeight = -1;
		else if (sizeH === 'L') sizeTiersHeight = 1;
		else if (sizeH === 'XL') sizeTiersHeight = 2;
		const baseHeightm = (species as any).heightm || 0;
		this.heightmm = Math.max(10, Math.round((baseHeightm * 1000) * (1 + (sizeTiersHeight * sizeHeightModifier))));
		const stats = this.battle.spreadModify(this.species.baseStats, this.set);
		if (this.species.maxHP) stats.hp = this.species.maxHP;
		if (!this.maxhp) {
			this.baseMaxhp = stats.hp;
			this.maxhp = stats.hp;
			this.hp = stats.hp;
		}
		if (!isTransform) this.baseStoredStats = stats;
		let statName: StatIDExceptHP;
		for (statName in this.storedStats) {
			this.storedStats[statName] = stats[statName];
			if (this.modifiedStats) this.modifiedStats[statName] = stats[statName];
		}
		this.speed = this.storedStats.spe;
		return species;
	}
	/**
	 * Changes this Pokemon's forme to match the given speciesId (or species).
	 * This function handles all changes to stats, ability, type, species, etc.
	 * as well as sending all relevant messages sent to the client.
	 */
	formeChange(
		speciesId: string | Species, source: Effect | null = this.battle.effect,
		isPermanent?: boolean, abilitySlot = '0', message?: string
	) {
		const rawSpecies = this.battle.dex.species.get(speciesId);
		const species = this.setSpecies(rawSpecies, source);
		if (!species) return false;
		// Weapon and Guard Action are species-derived, so a forme change needs to check the new form
		// Transform intentionally does NOT do this — see transformInto 
		// If the new forme doesn't define its own weapon stats, keep the current ones instead of hard-zeroing them
		// e.g. reverting zama crowned -> base on weapon break shouldn't erase max durability, or recovery can never finish.
		const newMaxWeaponDurability = species.weapondurability || this.maxWeaponDurability;
		if (newMaxWeaponDurability !== this.maxWeaponDurability) {
			// Scale current durability proportionally rather than resetting, so a partially broken weapon
			// transferring between formes with different maxes keeps the same relative durability
			this.weaponDurability = this.maxWeaponDurability > 0 ?
				Math.round(this.weaponDurability * newMaxWeaponDurability / this.maxWeaponDurability) :
				newMaxWeaponDurability;
			this.maxWeaponDurability = newMaxWeaponDurability;
			this.sendWeaponState();
		}
		this.weaponRecovery = species.weaponrecovery || this.weaponRecovery;
		// Zacian/Zamazenta swap Iron Head <-> Behemoth Blade/Bash as they enter or leave their Crowned forme.
		if (species.baseSpecies === 'Zacian' || species.baseSpecies === 'Zamazenta') {
			const weaponMoveOf: { [k: string]: ID } = { 'Zacian-Crowned': 'behemothblade' as ID, 'Zamazenta-Crowned': 'behemothbash' as ID };
			const targetMoveId = weaponMoveOf[species.name] || ('ironhead' as ID);
			const weaponMoveIds: ID[] = ['behemothblade' as ID, 'behemothbash' as ID, 'ironhead' as ID];
			const weaponSlot = this.baseMoveSlots.findIndex(slot => weaponMoveIds.includes(slot.id));
			if (weaponSlot >= 0 && this.baseMoveSlots[weaponSlot].id !== targetMoveId) {
				const newMove = this.battle.dex.moves.get(targetMoveId);
				this.baseMoveSlots[weaponSlot] = {
					move: newMove.name, id: newMove.id, pp: newMove.pp, maxpp: newMove.pp,
					target: newMove.target, disabled: false, disabledSource: '', used: false,
				};
				this.moveSlots = this.baseMoveSlots.slice();
			}
		}
		const guardActionPool = (species.guardAction || []).map(toID);
		if (guardActionPool.length) { if (!guardActionPool.includes(this.guardAction)) { this.guardAction = guardActionPool[0]; } } 
		else { this.guardAction = '' as ID; }
		// The species the opponent sees
		const apparentSpecies = this.illusion ? this.illusion.species.name : species.baseSpecies;
		if (isPermanent) {
			this.baseSpecies = rawSpecies;
			this.details = this.getUpdatedDetails();
			let details = (this.illusion || this).details;
			if (this.terastallized) details += `, tera:${this.terastallized}`;
			this.battle.add('detailschange', this, details);
			this.updateMaxHp();
			if (!source) { this.formeRegression = true; } // Tera forme text goes here
			else if (source.effectType === 'Item' && species.requiredItem) {
				this.canTerastallize = null; // National Dex behavior
				this.battle.add('-mega', this, apparentSpecies, species.requiredItem);
				this.moveThisTurnResult = true; // Mega Evolution counts as an action for Truant
				this.formeRegression = true;
			} else if (source.effectType === 'Status') { this.battle.add('-formechange', this, species.name, message); }
			else if (source.effectType === 'Item') { this.battle.add('-formechange', this, species.name, message, `[from] item: ${source.name}`); }
		} else {
			if (source?.effectType === 'Ability') { this.battle.add('-formechange', this, species.name, message, `[from] ability: ${source.name}`); } 
			else { this.battle.add('-formechange', this, this.illusion ? this.illusion.species.name : species.name, message); }
		}
		if (isPermanent && (!source || !['disguise', 'iceface'].includes(source.id))) {
			if (this.illusion && source) { // Tera forme breaks the Illusion
				this.ability1 = '' as ID; // Don't allow Illusion to wear off
				this.ability2 = '' as ID;
			}
			const ability = species.abilities[abilitySlot] || species.abilities['0'];
			const ability2 = species.abilities[abilitySlot + 1] || species.abilities['1'] || '';
			// Ogerpon's forme change doesn't override permanent abilities
			const abilitySlots = (this as any).getAbilitySlots?.() || [];
			if (source || !abilitySlots.some((slot: any) => slot.effect.flags['cantsuppress'])) {
				this.setAbility(ability, null, null, true, false, 1);
				if (ability2) { this.setAbility(ability2, null, null, true, false, 2); }
			}
			// However, its ability does reset upon switching out
			this.baseAbility1 = toID(ability);
			this.baseAbility2 = toID(ability2);
		}
		if (this.terastallized) {
			this.knownType = true;
			this.apparentType = this.terastallized;
		}
		return true;
	}
	updateMaxHp() {
		const newBaseMaxHp = this.battle.statModify(this.species.baseStats, this.set, 'hp');
		if (newBaseMaxHp === this.baseMaxhp) return;
		this.baseMaxhp = newBaseMaxHp;
		this.hp = this.hp <= 0 ? 0 : Math.max(1, newBaseMaxHp - (this.maxhp - this.hp));
		this.maxhp = newBaseMaxHp;
		if (this.hp) this.battle.add('-heal', this, this.getHealth, '[silent]');
	}
	clearVolatile(includeSwitchFlags = true) {
		this.boosts = {
			atk: 0,
			def: 0,
			spa: 0,
			spd: 0,
			spe: 0,
			accuracy: 0,
			evasion: 0,
			crit: 0,
		};
		if (this.volatiles['shapememory']) { // Shape Memory: persist size scaling across switching/untransform
			const size = (this.set as any).size || 'M';
			let tiers = 0;
			if (size === 'XS') tiers = -2;
			else if (size === 'S') tiers = -1;
			else if (size === 'L') tiers = 1;
			else if (size === 'XL') tiers = 2;
			const sp = this.species;
			const wMod = (sp as any).sizeWeightModifier ?? 0.1;
			const hMod = (sp as any).sizeHeightModifier ?? 0.1;
			const baseWeighthg = Math.max(1, Math.round(sp.weighthg * (1 + (tiers * wMod))));
			const baseHeightmm = Math.max(10, Math.round((((sp as any).heightm || 0) * 1000) * (1 + (tiers * hMod))));
			this.shapeMemoryWeightScale = baseWeighthg ? (this.weighthg / baseWeighthg) : 1;
			this.shapeMemoryHeightScale = baseHeightmm ? (this.heightmm / baseHeightmm) : 1;
		}
		this.moveSlots = this.baseMoveSlots.slice();
		this.transformed = false;
		this.ability1 = this.baseAbility1;
		this.ability2 = this.baseAbility2;
		if (this.canTerastallize === false) this.canTerastallize = this.teraType;
		for (const i in this.volatiles) { if (this.volatiles[i].linkedStatus) { this.removeLinkedVolatiles(this.volatiles[i].linkedStatus, this.volatiles[i].linkedPokemon); } }
		this.volatiles = {};
		if (includeSwitchFlags) {
			this.switchFlag = false;
			this.forceSwitchFlag = false;
		}
		this.lastMove = null;
		this.lastMoveUsed = null;
		this.moveThisTurn = '';
		this.moveLastTurnResult = undefined;
		this.moveThisTurnResult = undefined;
		this.lastDamage = 0;
		this.attackedBy = [];
		this.hurtThisTurn = null;
		this.newlySwitched = true;
		this.beingCalledBack = false;
		this.volatileStaleness = undefined;
		delete this.abilityState1.started;
		delete this.abilityState2.started;
		delete this.itemState.started;
		this.setSpecies(this.baseSpecies);
	}
	hasType(type: string | string[]) {
		const thisTypes = this.getTypes();
		if (typeof type === 'string') { return thisTypes.includes(type); }
		for (const typeName of type) { if (thisTypes.includes(typeName)) return true; }
		return false;
	}
	/**
	 * This function only puts the pokemon in the faint queue;
	 * actually setting of this.fainted comes later when the
	 * faint queue is resolved.
	 * Returns the amount of damage actually dealt
	 */
	faint(source: Pokemon | null = null, effect: Effect | null = null) {
		if (this.fainted || this.faintQueued) return 0;
		const d = this.hp;
		this.hp = 0;
		this.switchFlag = false;
		this.faintQueued = true;
		this.battle.faintQueue.push({
			target: this,
			source,
			effect,
		});
		return d;
	}
	damage(d: number, source: Pokemon | null = null, effect: Effect | null = null) {
		if (!this.hp || isNaN(d) || d <= 0) return 0;
		if (d < 1 && d > 0) d = 1;
		d = this.battle.trunc(d);
		this.hp -= d;
		if (this.hp <= 0) {
			d += this.hp;
			this.faint(source, effect);
		}
		return d;
	}
	tryTrap(isHidden = false) {
		if (!this.runStatusImmunity('trapped')) return false;
		if (this.trapped && isHidden) return true;
		this.trapped = isHidden ? 'hidden' : true;
		return true;
	}
	hasMove(moveid: string) {
		moveid = toID(moveid);
		for (const moveSlot of this.moveSlots) { if (moveid === moveSlot.id) { return moveid; } }
		return false;
	}
	disableMove(moveid: string, isHidden?: boolean, sourceEffect?: Effect) {
		if (!sourceEffect && this.battle.event) { sourceEffect = this.battle.effect; }
		moveid = toID(moveid);
		for (const moveSlot of this.moveSlots) {
			if (moveSlot.id === moveid && moveSlot.disabled !== true) {
				moveSlot.disabled = isHidden ? 'hidden' : true;
				moveSlot.disabledSource = (sourceEffect?.name || moveSlot.move);
			}
		}
	}
	/** Returns the amount of damage actually healed */
	heal(d: number, source: Pokemon | null = null, effect: Effect | null = null) {
		if (!this.hp) return false;
		d = this.battle.trunc(d);
		if (isNaN(d)) return false;
		if (d <= 0) return false;
		if (this.hp >= this.maxhp) return false;
		this.hp += d;
		if (this.hp > this.maxhp) {
			d -= this.hp - this.maxhp;
			this.hp = this.maxhp;
		}
		return d;
	}
	/** Sets HP, returns delta */
	sethp(d: number) {
		if (!this.hp) return 0;
		d = this.battle.trunc(d);
		if (isNaN(d)) return;
		if (d < 1) d = 1;
		d -= this.hp;
		this.hp += d;
		if (this.hp > this.maxhp) {
			d -= this.hp - this.maxhp;
			this.hp = this.maxhp;
		}
		return d;
	}
	trySetStatus(status: string | Condition, source: Pokemon | null = null, sourceEffect: Effect | null = null) { return this.setStatus(this.status || status, source, sourceEffect); }
	/** Unlike clearStatus, gives cure message */
	cureStatus(silent = false) {
		if (!this.hp || !this.status) return false;
		// Aura is immune to curing/removal unless the removal is coming from another aura effect.
		// This makes Aura persist through switch-outs without being cleared by generic cures.
		if (this.status === 'aura') {
			const eff = this.battle.effect;
			if (!eff || (eff.id !== 'aura' && !(eff as Move).flags?.aura)) { return false; }
		}
		this.battle.add('-curestatus', this, this.status, silent ? '[silent]' : '[msg]');
		if (this.status === 'slp' && this.removeVolatile('nightmare')) { this.battle.add('-end', this, 'Nightmare', '[silent]'); }
		this.setStatus('');
		return true;
	}
	setStatus(
		status: string | Condition,
		source: Pokemon | null = null,
		sourceEffect: Effect | null = null,
		ignoreImmunities = false
	) {
		if (!this.hp) return false;
		status = this.battle.dex.conditions.get(status);
		if (status.id === 'aura' && this.status && this.status !== 'aura') {
			this.clearStatus();
		}
		if (this.battle.event) {
			if (!source) source = this.battle.event.source;
			if (!sourceEffect) sourceEffect = this.battle.effect;
		}
		if (!source) source = this;
		if (this.status === status.id) {
			if ((sourceEffect as Move)?.status === this.status) { this.battle.add('-fail', this, this.status); } 
			else if ((sourceEffect as Move)?.status) {
				this.battle.add('-fail', source);
				this.battle.attrLastMove('[still]');
			}
			return false;
		}
		if ( !ignoreImmunities && status.id && !(source?.hasAbility('corrosion') && ['tox', 'psn'].includes(status.id)) ) 
		{
			// the game currently never ignores immunities
			if (!this.runStatusImmunity(status.id === 'tox' ? 'psn' : status.id)) {
				this.battle.debug('immune to status');
				if ((sourceEffect as Move)?.status) { this.battle.add('-immune', this); }
				return false;
			}
		}
		const prevStatus = this.status;
		const prevStatusState = this.statusState;
		if (status.id) {
			const result: boolean = this.battle.runEvent('SetStatus', this, source, sourceEffect, status);
			if (!result) {
				this.battle.debug('set status [' + status.id + '] interrupted');
				return result;
			}
		}
		this.status = status.id;
		this.statusState = this.battle.initEffectState({ id: status.id, target: this });
		if (source) this.statusState.source = source;
		if (status.duration) this.statusState.duration = status.duration;
		if (status.durationCallback) { this.statusState.duration = status.durationCallback.call(this.battle, this, source, sourceEffect); }
		if (status.id && !this.battle.singleEvent('Start', status, this.statusState, this, source, sourceEffect)) {
			this.battle.debug('status start [' + status.id + '] interrupted');
			// cancel the setstatus
			this.status = prevStatus;
			this.statusState = prevStatusState;
			return false;
		}
		if (status.id && !this.battle.runEvent('AfterSetStatus', this, source, sourceEffect, status)) { return false; }
		return true;
	}
	// Unlike cureStatus, does not give cure message
	clearStatus() {
		if (!this.hp || !this.status) return false;
		// Same aura protection as cureStatus
		if (this.status === 'aura') {
			const eff = this.battle.effect;
			if (!eff || eff.id !== 'aura') return false;
		}
		if (this.status === 'slp' && this.removeVolatile('nightmare')) { this.battle.add('-end', this, 'Nightmare', '[silent]'); }
		this.setStatus('');
		return true;
	}
	getStatus() { return this.battle.dex.conditions.getByID(this.status); }
	eatItem(force?: boolean, source?: Pokemon, sourceEffect?: Effect) {
		if (!this.item) return false;
		if ((!this.hp && this.item !== 'jabocaberry' && this.item !== 'rowapberry') || !this.isActive) return false;
		if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
		if (!source && this.battle.event?.target) source = this.battle.event.target;
		const item = this.getItem();
		if (sourceEffect?.effectType === 'Item' && this.item !== sourceEffect.id && source === this) {
			// if an item is telling us to eat it but we aren't holding it, we probably shouldn't eat what we are holding
			return false;
		}
		if (this.battle.runEvent('UseItem', this, null, null, item) && (force || this.battle.runEvent('TryEatItem', this, null, null, item))) {
			this.battle.add('-enditem', this, item, '[eat]');
			this.battle.singleEvent('Eat', item, this.itemState, this, source, sourceEffect);
			this.battle.runEvent('EatItem', this, source, sourceEffect, item);
			if (RESTORATIVE_BERRIES.has(item.id)) {
				switch (this.pendingStaleness) {
				case 'internal':
					if (this.staleness !== 'external') this.staleness = 'internal';
					break;
				case 'external':
					this.staleness = 'external';
					break;
				}
				this.pendingStaleness = undefined;
			}
			this.lastItem = this.item;
			this.item = '';
			this.battle.clearEffectState(this.itemState);
			this.usedItemThisTurn = true;
			this.ateBerry = true;
			this.battle.runEvent('AfterUseItem', this, null, null, item);
			return true;
		}
		return false;
	}
	useItem(source?: Pokemon, sourceEffect?: Effect) {
		if ((!this.hp && !this.getItem().isGem) || !this.isActive) return false;
		if (!this.item) return false;
		if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
		if (!source && this.battle.event?.target) source = this.battle.event.target;
		const item = this.getItem();
		if (sourceEffect?.effectType === 'Item' && this.item !== sourceEffect.id && source === this) {
			// if an item is telling us to eat it but we aren't holding it, we probably shouldn't eat what we are holding
			return false;
		}
		if (this.battle.runEvent('UseItem', this, null, null, item)) {
			switch (item.id) {
			case 'redcard':
				this.battle.add('-enditem', this, item, `[of] ${source}`);
				break;
			default:
				if (item.isGem) { this.battle.add('-enditem', this, item, '[from] gem'); } 
				else { this.battle.add('-enditem', this, item); }
				break;
			}
			if (item.boosts) { this.battle.boost(item.boosts, this, source, item); }
			this.battle.singleEvent('Use', item, this.itemState, this, source, sourceEffect);
			this.lastItem = this.item;
			this.item = '';
			this.battle.clearEffectState(this.itemState);
			this.usedItemThisTurn = true;
			this.battle.runEvent('AfterUseItem', this, null, null, item);
			return true;
		}
		return false;
	}
	takeItem(source?: Pokemon) {
		if (!this.item) return false;
		if (!source) source = this;
		const item = this.getItem();
		if (this.battle.runEvent('TakeItem', this, source, null, item)) {
			this.item = '';
			const oldItemState = this.itemState;
			this.battle.clearEffectState(this.itemState);
			this.pendingStaleness = undefined;
			this.battle.singleEvent('End', item, oldItemState, this);
			this.battle.runEvent('AfterTakeItem', this, null, null, item);
			return item;
		}
		return false;
	}
	setItem(item: string | Item, source?: Pokemon, effect?: Effect) {
		if (!this.hp || !this.isActive) return false;
		if (typeof item === 'string') item = this.battle.dex.items.get(item);
		const effectid = this.battle.effect ? this.battle.effect.id : '';
		if (RESTORATIVE_BERRIES.has('leppaberry' as ID)) {
			const inflicted = ['trick', 'switcheroo'].includes(effectid);
			const external = inflicted && source && !source.isAlly(this);
			this.pendingStaleness = external ? 'external' : 'internal';
		} else { this.pendingStaleness = undefined; }
		const oldItem = this.getItem();
		const oldItemState = this.itemState;
		this.item = item.id;
		this.itemState = this.battle.initEffectState({ id: item.id, target: this });
		if (oldItem.exists) this.battle.singleEvent('End', oldItem, oldItemState, this);
		if (item.id) { this.battle.singleEvent('Start', item, this.itemState, this, source, effect); }
		return true;
	}
	getItem() { return this.battle.dex.items.getByID(this.item); }
	hasItem(item: string | string[]) {
		if (Array.isArray(item)) { if (!item.map(toID).includes(this.item)) return false; } 
		else { if (toID(item) !== this.item) return false; }
		return !this.ignoringItem();
	}
	clearItem() { return this.setItem(''); }
	setAbility(
		ability: string | Ability, source?: Pokemon | null, sourceEffect?: Effect | null,
		isFromFormeChange = false, isTransform = false, slot: 1 | 2 = 1,
	) {
		if (!this.hp) return false;
		if (typeof ability === 'string') ability = this.battle.dex.abilities.get(ability);
		if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
		const abilityKey = slot === 1 ? 'ability1' : 'ability2';
		const abilityStateKey = slot === 1 ? 'abilityState1' : 'abilityState2';
		const oldAbility = this.battle.dex.abilities.get(this[abilityKey]);
		if (!isFromFormeChange) { if (ability.flags['cantsuppress'] || oldAbility.flags['cantsuppress']) return false; }
		if (!isFromFormeChange && !isTransform) {
			const setAbilityEvent: boolean | null = this.battle.runEvent('SetAbility', this, source, sourceEffect, ability);
			if (!setAbilityEvent) return setAbilityEvent;
		}
		this.battle.singleEvent('End', oldAbility, this[abilityStateKey], this, source);
		this[abilityKey] = ability.id;
		this[abilityStateKey] = this.battle.initEffectState({ id: ability.id, target: this });
		if (sourceEffect && !isFromFormeChange && !isTransform) {
			// Tell the client which ability slot changed (needed for ISL ability sets)
			const slotTag = slot === 2 ? '[slot]2' : null;
			if (source) {
				if (slotTag) { this.battle.add('-ability', this, ability.name, oldAbility.name, slotTag, `[from] ${sourceEffect.fullname}`, `[of] ${source}`); } 
				else { this.battle.add('-ability', this, ability.name, oldAbility.name, `[from] ${sourceEffect.fullname}`, `[of] ${source}`); }
			} else {
				if (slotTag) { this.battle.add('-ability', this, ability.name, oldAbility.name, slotTag, `[from] ${sourceEffect.fullname}`); } 
				else { this.battle.add('-ability', this, ability.name, oldAbility.name, `[from] ${sourceEffect.fullname}`); }
			}
		}
		if (ability.id && this.battle.gen > 3 && (!isTransform || oldAbility.id !== ability.id || this.battle.gen <= 4)) { this.battle.singleEvent('Start', ability, this[abilityStateKey], this, source); }
		return oldAbility.id;
	}
	getAbility(slot: 1 | 2 = 1) {
		const abilityKey = slot === 1 ? 'ability1' : 'ability2';
		return this.battle.dex.abilities.getByID(this[abilityKey]);
	}
	getAbilities(): Ability[] {
		const abilities: Ability[] = [];
		if (this.ability1) abilities.push(this.battle.dex.abilities.getByID(this.ability1));
		if (this.ability2) abilities.push(this.battle.dex.abilities.getByID(this.ability2));
		return abilities;
	}
	getAbilitySlots(): AbilitySlot[] {
		const slots: AbilitySlot[] = [];
		if (this.ability1) {
			slots.push({ slot: 1, id: this.ability1, effect: this.battle.dex.abilities.getByID(this.ability1), state: this.abilityState1 });
		}
		if (this.ability2) {
			slots.push({ slot: 2, id: this.ability2, effect: this.battle.dex.abilities.getByID(this.ability2), state: this.abilityState2 });
		}
		return slots;
	}
	getActiveAbilitySlots(): AbilitySlot[] {
		if (this.fainted || this.ignoringAbility()) return [];
		return this.getAbilitySlots().filter(slot => slot.effect.id);
	}
	hasAbility(ability: string | string[]) {
		if (Array.isArray(ability)) {
			const abilityIDs = ability.map(toID);
			if (!abilityIDs.includes(this.ability1) && !abilityIDs.includes(this.ability2)) return false;
		} else {
			const abilityID = toID(ability);
			if (abilityID !== this.ability1 && abilityID !== this.ability2) return false;
		}
		return !this.ignoringAbility();
	}
	clearAbility(slot?: 1 | 2) {
		if (slot === 1) { return this.setAbility('', undefined, undefined, false, false, 1); } 
		else if (slot === 2) { return this.setAbility('', undefined, undefined, false, false, 2); } 
		else { // Clear both
			this.setAbility('', undefined, undefined, false, false, 1);
			return this.setAbility('', undefined, undefined, false, false, 2);
		}
	}
	getNature() { return this.battle.dex.natures.get(this.set.nature); }
	addVolatile(
		status: string | Condition, source: Pokemon | null = null, sourceEffect: Effect | null = null,
		linkedStatus: string | Condition | null = null, ignoreImmunities = false
	): boolean | any {
		let result;
		status = this.battle.dex.conditions.get(status);
		// Prevent clearing Aura unless the current effect is Aura itself
		if (!status.id && this.status === 'aura') {
			const eff = this.battle.effect;
			if (!eff || eff.id !== 'aura') return false;
		}
		if (!this.hp && !status.affectsFainted) return false;
		if (linkedStatus && source && !source.hp) return false;
		if (this.battle.event) {
			if (!source) source = this.battle.event.source;
			if (!sourceEffect) sourceEffect = this.battle.effect;
		}
		if (!source) source = this;
		if (this.volatiles[status.id]) {
			if (!status.onRestart) return false;
			return this.battle.singleEvent('Restart', status, this.volatiles[status.id], this, source, sourceEffect);
		}
		if (!ignoreImmunities && !this.runStatusImmunity(status.id)) {
			this.battle.debug('immune to volatile status');
			if ((sourceEffect as Move)?.status) { this.battle.add('-immune', this); }
			return false;
		}
		result = this.battle.runEvent('TryAddVolatile', this, source, sourceEffect, status);
		if (!result) {
			this.battle.debug('add volatile [' + status.id + '] interrupted');
			return result;
		}
		this.volatiles[status.id] = this.battle.initEffectState({ id: status.id, name: status.name, target: this });
		if (source) {
			this.volatiles[status.id].source = source;
			this.volatiles[status.id].sourceSlot = source.getSlot();
		}
		if (sourceEffect) this.volatiles[status.id].sourceEffect = sourceEffect;
		if (status.duration) this.volatiles[status.id].duration = status.duration;
		if (status.durationCallback) { this.volatiles[status.id].duration = status.durationCallback.call(this.battle, this, source, sourceEffect); }
		result = this.battle.singleEvent('Start', status, this.volatiles[status.id], this, source, sourceEffect);
		if (!result) {
			// cancel
			delete this.volatiles[status.id];
			return result;
		}
		if (linkedStatus && source) {
			if (!source.volatiles[linkedStatus.toString()]) {
				source.addVolatile(linkedStatus, this, sourceEffect);
				source.volatiles[linkedStatus.toString()].linkedPokemon = [this];
				source.volatiles[linkedStatus.toString()].linkedStatus = status;
			} else { source.volatiles[linkedStatus.toString()].linkedPokemon.push(this); }
			this.volatiles[status.toString()].linkedPokemon = [source];
			this.volatiles[status.toString()].linkedStatus = linkedStatus;
		}
		return true;
	}
	getVolatile(status: string | Effect) {
		status = this.battle.dex.conditions.get(status) as Effect;
		if (!this.volatiles[status.id]) return null;
		return status;
	}
	removeVolatile(status: string | Effect) {
		if (!this.hp) return false;
		status = this.battle.dex.conditions.get(status) as Effect;
		if (!this.volatiles[status.id]) return false;
		const { linkedPokemon, linkedStatus } = this.volatiles[status.id];
		this.battle.singleEvent('End', status, this.volatiles[status.id], this);
		delete this.volatiles[status.id];
		if (linkedPokemon) { this.removeLinkedVolatiles(linkedStatus, linkedPokemon); }
		return true;
	}
	removeLinkedVolatiles(linkedStatus: string | Effect, linkedPokemon: Pokemon[]) {
		linkedStatus = linkedStatus.toString();
		for (const linkedPoke of linkedPokemon) {
			const volatileData = linkedPoke.volatiles[linkedStatus];
			if (!volatileData) continue;
			volatileData.linkedPokemon.splice(volatileData.linkedPokemon.indexOf(this), 1);
			if (volatileData.linkedPokemon.length === 0) { linkedPoke.removeVolatile(linkedStatus); }
		}
	}
	getHealth = () => {
		if (!this.hp) return { side: this.side.id, secret: '0 fnt', shared: '0 fnt' };
		let secret = `${this.hp}/${this.maxhp}`;
		let shared;
		if (this.battle.reportExactHP) { shared = secret; } 
		else if (this.battle.reportPercentages) {
			// HP Percentage Mod mechanics
			let percentage = Math.ceil(100 * this.hp / this.maxhp);
			if (percentage === 100 && this.hp < this.maxhp) { percentage = 99; }
			shared = `${percentage}/100`;
		} else {
			const pixels = Math.floor(48 * this.hp / this.maxhp) || 1;
			shared = `${pixels}/48`;
			if (pixels === 9) { shared += this.hp * 5 > this.maxhp ? 'y' : 'r'; } 
			else if (pixels === 24) { shared += this.hp * 2 > this.maxhp ? 'g' : 'y'; }
		}
		if (this.status) {
			secret += ` ${this.status}`;
			shared += ` ${this.status}`;
		}
		return { side: this.side.id, secret, shared };
	};
	// Sets a type (except on Arceus, who resists type changes)
	setType(newType: string | string[], enforce = false) {
		if (!enforce) {
			// No Pokemon should be able to have Stellar as a base type
			if (typeof newType === 'string' ? newType === 'Stellar' : newType.includes('Stellar')) return false;
			// First type of Arceus, Silvally cannot be normally changed
			if (((this.species.num === 493 || this.species.num === 773))) { return false; }
			// Terastallized Pokemon cannot have their base type changed except via forme change
			if (this.terastallized) return false;
		}
		if (!newType) throw new Error("Must pass type to setType");
		this.types = (typeof newType === 'string' ? [newType] : newType);
		this.addedType = '';
		this.knownType = true;
		this.apparentType = this.types.join('/');
		return true;
	}
	/** Removes any types added previously and adds another one. */
	addType(newType: string) {
		if (this.terastallized) return false;
		this.addedType = newType;
		return true;
	}
	getTypes(excludeAdded?: boolean, preterastallized?: boolean): string[] {
		if (!preterastallized && this.terastallized) { return [this.terastallized]; }
		const types = this.battle.runEvent('Type', this, null, null, this.types);
		if (!types.length) types.push(this.battle.gen >= 5 ? 'Normal' : '???');
		if (!excludeAdded && this.addedType) return types.concat(this.addedType);
		return types;
	}
	isGrounded(negateImmunity = false): boolean | null {
		if (!this.battle.suppressingAbility(this)) {
			// these abilities are immune to grounding effects
			const groundingImmunity = this.hasAbility('antigravitysystem') ? 'antigravitysystem' :
				this.hasAbility('cargoflier') && !('roost' in this.volatiles) ? 'cargoflier' :
				this.hasAbility('icestilts') ? 'icestilts' :
				this.hasAbility('lunamancy') ? 'lunamancy' : '';
			if (groundingImmunity) {
				this.battle.add('-activate', this, `ability: ${this.battle.dex.abilities.get(groundingImmunity).name}`);
				return false;
			}
			// Lunamancy forces opposing Pokemon to the ground under sun/eclipse
			if (this.foes().some(pokemon => pokemon.hp && pokemon.hasAbility('lunamancy') && !this.battle.suppressingAbility(pokemon)) && this.battle.field.isWeather(['sunnyday', 'desolateland', 'eclipse'])) { return true; }
			// Lunamancy protects an ally that is naturally airborne
			if (this.side.pokemon.some(pokemon => pokemon !== this && pokemon.hp && pokemon.hasAbility('lunamancy') && !this.battle.suppressingAbility(pokemon))) { 
				if ( 
					this.hasType('Flying') || this.hasAbility('levitate') || this.hasAbility('eelevate') || this.hasAbility('aerodynamic') ||
					'magnetrise' in this.volatiles || 'telekinesis' in this.volatiles || 'discombobulated' in this.volatiles || (!this.ignoringItem() && this.item === 'airballoon')
				) { return false; }
			}
		}
		let result: boolean | null = true;
		if ('gravity' in this.battle.field.pseudoWeather) { result = true; }
		else if ('ingrain' in this.volatiles) { result = true; }
		else if ('smackdown' in this.volatiles) { result = true; }
		else {
			const item = (this.ignoringItem() ? '' : this.item);
			if (item === 'ironball') { result = true; }
			else if (!negateImmunity && this.hasType('Flying') && !(this.hasType('???') && 'roost' in this.volatiles)) { result = false; }
			else if (this.hasAbility('levitate') && !this.battle.suppressingAbility(this)) { result = null; }
			else if (this.hasAbility('eelevate') && !this.battle.suppressingAbility(this)) { result = null; }
			else if (this.hasAbility('aerodynamic') && !this.battle.suppressingAbility(this)) { result = null; }
			else if (this.hasType('bug') && (this.effectiveWeather('turbulentwinds') || this.effectiveWeather('deltastream'))) { result = false; }
			else if ('magnetrise' in this.volatiles) { result = false; }
			else if ('telekinesis' in this.volatiles) { result = false; }
			else if (item === 'airballoon') { result = false; }
		}
		return result;
	}
	isSemiInvulnerable() { return (this.volatiles['fly'] || this.volatiles['bounce'] || this.volatiles['dive'] || this.volatiles['dig'] || this.volatiles['phantomforce'] || this.volatiles['shadowforce'] || this.isSkyDropped()); }
	isSkyDropped() {
		if (this.volatiles['skydrop']) return true;
		for (const foeActive of this.side.foe.active) { if (foeActive.volatiles['skydrop'] && foeActive.volatiles['skydrop'].source === this) { return true; } }
		return false;
	}
	/** Specifically: is protected against a single-target damaging move */
	isProtected() {
		return !!(
			this.volatiles['protect'] || this.volatiles['detect'] || this.volatiles['maxguard'] ||
			this.volatiles['kingsshield'] || this.volatiles['spikyshield'] || this.volatiles['banefulbunker'] ||
			this.volatiles['obstruct'] || this.volatiles['silktrap'] || this.volatiles['burningbulwark']
		);
	}
	// Like Field.effectiveWeather(), but ignores sun and rain if the Utility Umbrella is active for the Pokemon.
	effectiveWeather(message?: string | boolean) {
		const weather = this.battle.field.effectiveWeather();
		switch (weather) {
		case 'sunnyday':
		case 'raindance':
		case 'desolateland':
		case 'primordialsea':
			if (this.hasItem('utilityumbrella')) return '';
		}
		// TODO: check interactions of Mega Sol with Utility Umbrella and Desolate Land
		if (this.hasAbility('megasol') && weather !== 'sunnyday') {
			if (message) this.battle.add('-activate', this, 'ability: Mega Sol');
			return 'sunnyday' as ID;
		}
		if (this.hasAbility('hellfire') && weather !== 'sunnyday') {
			if (message) this.battle.add('-activate', this, 'ability: Hellfire');
			return 'sunnyday' as ID;
		}
		if (this.hasAbility('megablizzard') && weather !== 'snowscape') {
			if (message) this.battle.add('-activate', this, 'ability: Mega Blizzard');
			return 'snowscape' as ID;
		}
		if (this.hasAbility('megaluna') && weather !== 'eclipse') {
			if (message) this.battle.add('-activate', this, 'ability: Mega Luna');
			return 'eclipse' as ID;
		}
		return weather;
	}
	/**
	 * chain, if passed, is populated with one entry per contribution, for the effectiveness
	 * tooltip. kind/label/defendingType describe *what* contributed; mod is on the same
	 * +1/-1-per-tier scale as the return value (not a raw multiplier); effectLabel is set when an
	 * ability/item/move-level effect changed that specific contribution's value, naming what did.
	 */
	runEffectiveness(move: ActiveMove, chain?: { kind: 'type' | 'flag' | 'special', label: string, defendingType: string, mod: number, effectLabel?: string, immune?: boolean }[]) {
		let totalTypeMod = 0;
		if (this.terastallized && move.type === 'Stellar') {
			totalTypeMod = 1;
			if (chain) chain.push({ kind: 'special', label: 'Stellar Tera', defendingType: '', mod: 1 });
		} else {
			const moveTypes = [move.type];
			if (move.type2 && move.type2 !== move.type) moveTypes.push(move.type2);
			if (!move.flags?.magic) {
				const fullyImmuneType = moveTypes.find(t => !this.battle.dex.getImmunity(t, this));
				if (fullyImmuneType) {
					if (chain) chain.push({ kind: 'type', label: fullyImmuneType, defendingType: '', mod: 0, immune: true });
					return -99; // sentinel: battle-actions.ts reads this as "0x - Immune", not clamped like a normal mod
				}
			}
			const defendingTypes = (move.flags?.magic) ? this.getTypes(false, true) : this.getTypes();
			for (const attackingType of moveTypes) {
				for (const defendingType of defendingTypes) {
					let rawTypeMod = this.battle.dex.getEffectiveness(attackingType, defendingType);
					const afterMove = this.battle.singleEvent('Effectiveness', move, null, this, defendingType, move, rawTypeMod);
					const afterAbility = this.battle.runEvent('Effectiveness', this, defendingType, move, afterMove);
					totalTypeMod += afterAbility;
					if (chain && afterAbility !== 0) {
						let effectLabel: string | undefined;
						if (afterAbility !== rawTypeMod) { effectLabel = afterMove !== rawTypeMod ? `move: ${move.name}` : 'ability/item effect'; }
						chain.push({ kind: 'type', label: attackingType, defendingType, mod: afterAbility, effectLabel });
					}
				}
			}
		}
		for (const defendingType of this.getTypes()) {
			const typeData = this.battle.dex.types.get(defendingType);
			if (!typeData || !typeData.damageTaken) continue;
			for (const flag in move.flags) {
				let flagMod = typeData.damageTaken[flag];
				let effectLabel: string | undefined;
				if (flag === 'contact' && defendingType === 'Ghost' && this.volatiles && this.volatiles['magicdust']) {
					if (flagMod === 2) {
						this.battle.debug(`Magic Dust flips ${defendingType} contact resist to weak`);
						flagMod = 1;
						effectLabel = 'ability: Magic Dust';
					}
				}
				if (flagMod === 1) {
					this.battle.debug(`${defendingType} is weak to ${flag} flag (1.5x)`);
					totalTypeMod += 0.585;
					if (chain) chain.push({ kind: 'flag', label: flag, defendingType, mod: 0.585, effectLabel });
				}
				if (flagMod === 2) {
					this.battle.debug(`${defendingType} resists ${flag} flag (0.75x)`);
					totalTypeMod -= 0.415;
					if (chain) chain.push({ kind: 'flag', label: flag, defendingType, mod: -0.415, effectLabel });
				}
			}
		}
		if (this.species.name === 'Terapagos-Terastal' && this.hasAbility('Tera Shell') &&
			!this.battle.suppressingAbility(this)) {
			const teraShellSlot = this.ability1 === 'terashell' ? 1 : 2;
			const abilityStateKey = teraShellSlot === 1 ? 'abilityState1' : 'abilityState2';
			if (this[abilityStateKey].resisted) return -1;
			if (move.category === 'Status' || move.id === 'struggle' || !this.runImmunity(move) || totalTypeMod < 0 || this.hp < this.maxhp) { return totalTypeMod; }
			this.battle.add('-activate', this, 'ability: Tera Shell');
			this[abilityStateKey].resisted = true;
			if (chain) chain.push({ kind: 'special', label: 'Tera Shell', defendingType: '', mod: -1 - totalTypeMod, effectLabel: 'ability: Tera Shell' });
			return -1;
		}
		return totalTypeMod;
	}
		/** false = immune, true = not immune */
	runImmunity(source: ActiveMove | string, message?: string | boolean) {
		if (!source) return true;
		const move = typeof source !== 'string' ? source : undefined;
		const type: string = typeof source !== 'string' ? source.type : source;
		if (move && move.ignoreImmunity && (move.ignoreImmunity === true || move.ignoreImmunity[type])) return true;
		if (!type || type === '???') return true;
		if (!this.battle.dex.types.isName(type)) throw new Error("Use runStatusImmunity for " + type);
		if (move) {
			for (const defendingType of this.getTypes()) {
				const typeData = this.battle.dex.types.get(defendingType);
				if (!typeData?.damageTaken) continue;
				for (const flag in move.flags) {
					if (typeData.damageTaken[flag] === 3) {
						if (message) this.battle.add('-immune', this);
						return false;
					}
				}
			}
		}
		const types = move?.type2 && move.type2 !== type ? [type, move.type2] : [type];
		let notImmune: boolean | null = true;
		let blockedType = type;
		for (const t of types) {
			const negateImmunity = !this.battle.runEvent('NegateImmunity', this, t);
			const result = t === 'Ground'? this.isGrounded(negateImmunity): negateImmunity || this.battle.dex.getImmunity(t, this);
			if (!result) {
				notImmune = result;
				blockedType = t;
				break;
			}
		}
		if (notImmune) return true;
		if (move?.flags?.magic && notImmune === false) return true;
		if (!message) return false;
		if (notImmune === null) { this.battle.add('-immune', this, '[from] ability: Levitate'); return false; }
		if (!move) { this.battle.add('-immune', this); return false; }
		const moveFlags = Object.keys(move.flags || {}).filter(f => (move.flags as any)[f]);
		const targetTypes = this.getTypes();
		const header = [move.name, move.type, move.type2 || '', move.category, moveFlags.join(','), this.name, this.species.name, targetTypes[0] || '', targetTypes[1] || '', -99,].join('~');
		const entry = ['type', blockedType, '', 0, '', '1'].join('~');
		this.battle.add('-resisted', this, "It doesn't affect [POKEMON]...", '[chain] ' + header + '##' + entry);
		return false;
	}
	runStatusImmunity(type: string, message?: string) {
		if (this.fainted) return false;
		if (!type) return true;
		if (type === 'aura') return true;
		if (!this.battle.dex.getImmunity(type, this)) {
			this.battle.debug('natural status immunity');
			if (message) { this.battle.add('-immune', this); }
			return false;
		}
		const immunity = this.battle.runEvent('Immunity', this, null, null, type);
		if (!immunity) {
			this.battle.debug('artificial status immunity');
			if (message && immunity !== null) { this.battle.add('-immune', this); }
			return false;
		}
		return true;
	}
	// Breaks a fragile item, triggering onFragileBreak and removing the item. Returns true if an item was broken, false otherwise.
	breakItem(source?: Pokemon, effect?: Effect) {
		const item = this.getItem();
		if (!item.id || (!item.isFragile && !item.isMildlyFragile)) return false;
		if (typeof source === 'undefined' && this.battle.event?.target) source = this.battle.event.target;
		if (typeof effect === 'undefined' && this.battle.effect) effect = this.battle.effect;
		if (item.onFragileBreak) { this.battle.singleEvent('FragileBreak', item, this.itemState, this, source, effect); }
		if (item.isFragile) {
			this.battle.add('-enditem', this, item, '[broken]');
			this.lastItem = this.item;
			this.item = '';
			this.battle.clearEffectState(this.itemState);
			this.usedItemThisTurn = true;
			return true;
		}
		// For isMildlyFragile, only trigger the effect, do not remove the item
		return false;
	}
	/**
	 * Tracks Necrozma's light-charge counter and, once it reaches 3, transforms. No player choice is involved.
	 */
	tryLightCharge(source: Pokemon, move: ActiveMove) {
		if (!move.flags['light']) return;
		if (this.fainted) return;
		if (!['Necrozma', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane'].includes(this.species.name)) return;
		this.lightCharge++;
		this.battle.add('-lightcharge', this, `${this.lightCharge}/3`);
		if (this.lightCharge < 3) return;
		const ultraForme = this.battle.actions.canUltraBurst(this);
		if (!ultraForme) return; // not holding Ultranecrozium Z, or wrong forme
		this.lightCharge = 0;
		this.battle.actions.runUltraBurst(this);
	}
	destroy() {
		// deallocate ourself
		// get rid of some possibly-circular references
		(this as any).battle = null!;
		(this as any).side = null!;
	}
}