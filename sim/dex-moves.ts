import { Utils } from '../lib/utils';
import type { ConditionData } from './dex-conditions';
import { assignMissingFields, BasicEffect, toID } from './dex-data';
type SparseBoostsTable = import('./dex').Dex.SparseBoostsTable;
/**
 * Describes the acceptable target(s) of a move.
 * adjacentAlly - Only relevant to Doubles or Triples, the move only targets an ally of the user.
 * adjacentAllyOrSelf - The move can target the user or its ally.
 * adjacentFoe - The move can target a foe, but not (in Triples) a distant foe.
 * all - The move targets the field or all Pokémon at once.
 * allAdjacent - The move is a spread move that also hits the user's ally.
 * allAdjacentFoes - The move is a spread move.
 * allies - The move affects all active Pokémon on the user's team.
 * allySide - The move adds a side condition on the user's side.
 * allyTeam - The move affects all unfainted Pokémon on the user's team.
 * any - The move can hit any other active Pokémon, not just those adjacent.
 * foeSide - The move adds a side condition on the foe's side.
 * normal - The move can hit one adjacent Pokémon of your choice.
 * randomNormal - The move targets an adjacent foe at random.
 * scripted - The move targets the foe that damaged the user.
 * self - The move affects the user of the move.
 */
export type MoveTarget =
	'adjacentAlly' | 'adjacentAllyOrSelf' | 'adjacentFoe' | 'all' | 'allAdjacent' | 'allAdjacentFoes' |
	'allies' | 'allySide' | 'allyTeam' | 'any' | 'foeSide' | 'normal' | 'randomNormal' | 'scripted' | 'self';
export type MoveFlag = 0 | 1;
export interface MoveFlags {
	// Core Flags
	binding?: MoveFlag; // 
	bite?: MoveFlag; // Power is multiplied by 1.5 when used by a Pokemon with the Ability Strong Jaw.
	bullet?: MoveFlag; // Has no effect on Pokemon with the Ability Bulletproof.
	bomb?: MoveFlag; //
	contact?: MoveFlag; // Makes contact.
	crash?: MoveFlag; //
	dance?: MoveFlag; // When used by a Pokemon, other Pokemon with the Ability Dancer can attempt to execute the same move.
	drain?: MoveFlag; //
	explosive?: MoveFlag; //
	heal?: MoveFlag; // Prevented from being executed or selected during Heal Block's effect.
	powder?: MoveFlag; // Has no effect on Pokemon which are Grass-type, have the Ability Overcoat, or hold Safety Goggles.
	pulse?: MoveFlag; // Power is multiplied by 1.5 when used by a Pokemon with the Ability Mega Launcher.
	punch?: MoveFlag; // Power is multiplied by 1.2 when used by a Pokemon with the Ability Iron Fist.
	slicing?: MoveFlag; // Power is multiplied by 1.5 when used by a Pokemon with the Ability Sharpness.
	sound?: MoveFlag; // Has no effect on Pokemon with the Ability Soundproof.
	wind?: MoveFlag; // Activates the Wind Power and Wind Rider Abilities.
	// Indigo Starstorm Flags
	airborne?: MoveFlag; // Cannot be used under Gravity.
	aura?: MoveFlag; //
	beam?: MoveFlag; //
	breath?: MoveFlag; //
	claw?: MoveFlag; //
	crush?: MoveFlag; //
	kick?: MoveFlag; //
	launch?: MoveFlag; //
	light?: MoveFlag; //
	lunar?: MoveFlag; //
	magic?: MoveFlag; // Ignores tera. Turns target's immunities into resists. Lowered STAB modifier.
	pierce?: MoveFlag; //
	shadow?: MoveFlag; //
	solar?: MoveFlag; //
	spin?: MoveFlag; //
	sweep?: MoveFlag; //
	throw?: MoveFlag; //
	weapon?: MoveFlag; //
	wing?: MoveFlag; //
	// Other Flags
	allyanim?: MoveFlag; // The move plays its animation when used on an ally.
	bypasssub?: MoveFlag; // Ignores a target's substitute.
	cantusetwice?: MoveFlag; // The user cannot select this move after a previous successful use.
	charge?: MoveFlag; // The user is unable to make a move between turns.
	defrost?: MoveFlag; // Thaws the user if executed successfully while the user is frozen.
	distance?: MoveFlag; // Can target a Pokemon positioned anywhere in a Triple Battle.
	failcopycat?: MoveFlag; // Cannot be selected by Copycat.
	failencore?: MoveFlag; // Encore fails if target used this move.
	failinstruct?: MoveFlag; // Cannot be repeated by Instruct.
	failmefirst?: MoveFlag; // Cannot be selected by Me First.
	failmimic?: MoveFlag; // Cannot be copied by Mimic.
	futuremove?: MoveFlag; // Targets a slot, and in 2 turns damages that slot.
	gravity?: MoveFlag; // Prevented from being executed or selected during Gravity's effect.
	infusible?: MoveFlag; // Can occupy certain species' infusibleSlots even if not naturally learnable by that species.
	metronome?: MoveFlag; // Can be selected by Metronome.
	mirror?: MoveFlag; // Can be copied by Mirror Move.
	mustpressure?: MoveFlag; // Additional PP is deducted due to Pressure when it ordinarily would not.
	noassist?: MoveFlag; // Cannot be selected by Assist.
	nonsky?: MoveFlag; // Prevented from being executed or selected in a Sky Battle.
	noparentalbond?: MoveFlag; // Cannot be made to hit twice via Parental Bond.
	nosketch?: MoveFlag; // Cannot be copied by Sketch.
	nosleeptalk?: MoveFlag; // Cannot be selected by Sleep Talk.
	pledgecombo?: MoveFlag; // Gems will not activate. Cannot be redirected by Storm Drain / Lightning Rod.
	protect?: MoveFlag; // Blocked by Detect, Protect, Spiky Shield, and if not a Status move, King's Shield.
	recharge?: MoveFlag; // If this move is successful, the user must recharge on the following turn and cannot make a move.
	reflectable?: MoveFlag; // Bounced back to the original user by Magic Coat or the Ability Magic Bounce.
	snatch?: MoveFlag; // Can be stolen from the original user and instead used by another Pokemon using Snatch.
}
export interface HitEffect {
	onHit?: MoveEventMethods['onHit'];
	// set pokemon conditions
	boosts?: SparseBoostsTable | null;
	status?: string;
	volatileStatus?: string;
	// set side/slot conditions
	sideCondition?: string;
	slotCondition?: string;
	// set field conditions
	pseudoWeather?: string;
	terrain?: string;
	weather?: string;
}
export interface SecondaryEffect extends HitEffect {
	chance?: number;
	/** Used to flag a secondary effect as added by Poison Touch */
	ability?: Ability;
	kingsrock?: boolean;
	self?: HitEffect;
}
export interface MoveEventMethods {
	basePowerCallback?: (this: Battle, pokemon: Pokemon, target: Pokemon, move: ActiveMove) => number | false | null;
	/** Return true to stop the move from being used */
	beforeMoveCallback?: (this: Battle, pokemon: Pokemon, target: Pokemon | null, move: ActiveMove) => boolean | void;
	beforeTurnCallback?: (this: Battle, pokemon: Pokemon, target: Pokemon) => void;
	damageCallback?: (this: Battle, pokemon: Pokemon, target: Pokemon) => number | false;
	priorityChargeCallback?: (this: Battle, pokemon: Pokemon) => void;
	onDisableMove?: (this: Battle, pokemon: Pokemon) => void;
	onAfterHit?: CommonHandlers['VoidSourceMove'];
	onAfterSubDamage?: (this: Battle, damage: number, target: Pokemon, source: Pokemon, move: ActiveMove) => void;
	onAfterMoveSecondarySelf?: CommonHandlers['VoidSourceMove'];
	onAfterMoveSecondary?: CommonHandlers['VoidMove'];
	onAfterMove?: CommonHandlers['VoidSourceMove'];
	onDamagePriority?: number;
	onDamage?: (this: Battle, damage: number, target: Pokemon, source: Pokemon, effect: Effect) => number | boolean | null | void;
	/* Invoked by the global BasePower event (onEffect = true) */
	onBasePower?: CommonHandlers['ModifierSourceMove'];
	onEffectiveness?: (this: Battle, typeMod: number, target: Pokemon | null, type: string, move: ActiveMove) => number | void;
	onHit?: CommonHandlers['ResultMove'];
	onHitField?: CommonHandlers['ResultMove'];
	onHitSide?: (this: Battle, side: Side, source: Pokemon, move: ActiveMove) => boolean | null | "" | void;
	onModifyMove?: (this: Battle, move: ActiveMove, pokemon: Pokemon, target: Pokemon | null) => void;
	onModifyPriority?: CommonHandlers['ModifierSourceMove'];
	onMoveFail?: CommonHandlers['VoidMove'];
	onModifyType?: (this: Battle, move: ActiveMove, pokemon: Pokemon, target: Pokemon) => void;
	onModifyTarget?: (this: Battle, relayVar: { target: Pokemon }, pokemon: Pokemon, target: Pokemon, move: ActiveMove) => void;
	onPrepareHit?: CommonHandlers['ResultMove'];
	onTry?: CommonHandlers['ResultSourceMove'];
	onTryHit?: CommonHandlers['ExtResultSourceMove'];
	onTryHitField?: CommonHandlers['ResultMove'];
	onTryHitSide?: (this: Battle, side: Side, source: Pokemon, move: ActiveMove) => boolean | null | "" | void;
	onTryImmunity?: CommonHandlers['ResultMove'];
	onTryMove?: CommonHandlers['ResultSourceMove'];
	onUseMoveMessage?: CommonHandlers['VoidSourceMove'];
}
export interface MoveData extends EffectData, MoveEventMethods, HitEffect {
	/** Hidden Power */
	realMove?: string;
	damage?: number | 'level' | false | null;
	contestType?: string;
	noPPBoosts?: boolean;
	ohko?: boolean | 'Ice';
	thawsTarget?: boolean;
	heal?: number[] | null;
	forceSwitch?: boolean;
	name: string;
	/** move index number, used for Metronome rolls */
	num?: number;
	condition?: ConditionData;
	basePower: number;
	accuracy: true | number;
	pp: number;
	category: 'Physical' | 'Special' | 'Status';
	type: string;
	type2?: string;
	priority: number;
	target: MoveTarget;
	flags: MoveFlags;
	weaponmove?: boolean;
	weaponmoveCallback?: (pokemon: Pokemon) => boolean;
	weaponDamage?: number;
	weaponDamageOnProtect?: boolean;
	selfSwitch?: 'copyvolatile' | 'shedtail' | boolean;
	selfBoost?: { boosts?: SparseBoostsTable };
	selfdestruct?: 'always' | 'ifHit' | boolean;
	// Restored standard move data properties
	/**
	 * Note that this is only "true" recoil. Other self-damage, like Struggle, crash (High Jump Kick), Mind Blown, Life Orb,
	 *  and even Substitute and Healing Wish, are sometimes called "recoil" by the community, but don't count as "real" recoil.
	 */
	recoil?: [number, number];
	drain?: [number, number];
	pierce?: [number, number];
	breaksProtect?: boolean;
	mindBlownRecoil?: boolean;
	stealsBoosts?: boolean;
	struggleRecoil?: boolean;
	secondary?: SecondaryEffect | null;
	secondaries?: SecondaryEffect[] | null;
	self?: SecondaryEffect | null;
	hasSheerForce?: boolean;
	// Hit effect modifiers
	alwaysHit?: boolean; // currently unused
	baseMoveType?: string;
	basePowerModifier?: number;
	critModifier?: number;
	critRatio?: number;
	// Pokemon for the attack stat. Ability and Item damage modifiers still come from the real attacker.
	overrideOffensivePokemon?: 'target' | 'source';
	// Physical moves use attack stat modifiers, special moves use special attack stat modifiers.
	overrideOffensiveStat?: StatIDExceptHP;
	// Pokemon for the defense stat. Ability and Item damage modifiers still come from the real defender.
	overrideDefensivePokemon?: 'target' | 'source';
	// uses modifiers that match the new stat
	overrideDefensiveStat?: StatIDExceptHP;
	forceSTAB?: boolean;
	ignoreAbility?: boolean;
	ignoreAccuracy?: boolean;
	ignoreDefensive?: boolean;
	ignoreEvasion?: boolean;
	ignoreImmunity?: boolean | { [typeName: string]: boolean };
	ignoreNegativeOffensive?: boolean;
	ignoreOffensive?: boolean;
	ignorePositiveDefensive?: boolean;
	ignorePositiveEvasion?: boolean;
	multiaccuracy?: boolean;
	multihit?: number | number[];
	multihitType?: 'parentalbond' | 'betterthanone' | 'sixminded';
	noDamageVariance?: boolean;
	nonGhostTarget?: MoveTarget;
	spreadModifier?: number;
	sleepUsable?: boolean;
	// Will change target if current target is unavailable. (Dragon Darts)
	smartTarget?: boolean;
	// Tracks the original target through Ally Switch and other switch-out-and-back-in situations, rather than just targeting a slot. (Stalwart, Snipe Shot)
	tracksTarget?: boolean;
	willCrit?: boolean;
	callsMove?: boolean;
	// Mechanics flags
	hasCrashDamage?: boolean;
	isConfusionSelfHit?: boolean;
	stallingMove?: boolean;
	baseMove?: ID;
	guardActionCD?: number; // If this move can be used as a Guard Action, how many of the user's actions before it's usable again
	isInfusible?: boolean; // If true, this move can occupy a species' infusibleSlots even if not naturally learnable.

}
export interface MoveDataTable { [moveid: IDEntry]: MoveData }
export interface Move extends Readonly<BasicEffect & MoveData> { readonly effectType: 'Move'; }
interface MoveHitData {
	[targetSlotid: string]: {
		/** Did this move crit against the target? */
		crit: boolean,
		/** The type effectiveness of this move against the target */
		typeMod: number,
		pierced?: [number, number],
	};
}
type MutableMove = BasicEffect & MoveData;
export interface ActiveMove extends MutableMove {
	ignoreImmunityBreaking?: boolean; 
	intendedTotalDamage?: number;
	baseMove?: ID;
	readonly name: string;
	readonly effectType: 'Move';
	readonly id: ID;
	num: number;
	weather?: ID;
	status?: ID;
	hit: number;
	moveHitData?: MoveHitData;
	hitTargets?: Pokemon[];
	ability?: Ability;
	allies?: Pokemon[];
	auraBooster?: Pokemon;
	causedCrashDamage?: boolean;
	forceStatus?: ID;
	hasAuraBreak?: boolean;
	hasBounced?: boolean;
	hasSheerForce?: boolean;
	/** Is the move called by Dancer? Used to prevent infinite Dancer recursion. */
	isExternal?: boolean;
	lastHit?: boolean;
	magnitude?: number;
	pranksterBoosted?: boolean;
	selfDropped?: boolean;
	selfSwitch?: 'copyvolatile' | 'shedtail' | boolean;
	spreadHit?: boolean;
	statusRoll?: string;
	/** Hardcode to make Tera Stellar STAB work with multihit moves */
	stellarBoosted?: boolean;
	totalDamage?: number | false;
	typeChangerBoosted?: Effect;
	willChangeForme?: boolean;
	infiltrates?: boolean;
	ruinedAtk?: Pokemon;
	ruinedDef?: Pokemon;
	ruinedSpA?: Pokemon;
	ruinedSpD?: Pokemon;
}
type MoveCategory = 'Physical' | 'Special' | 'Status';
export class DataMove extends BasicEffect implements Readonly<BasicEffect & MoveData> {
	declare readonly effectType: 'Move';
	/** Move type. */
	readonly type: string;
	/** Secondary type for dual-typed moves. If present, this move is considered to have both types for effectiveness and STAB. */
	readonly type2?: string;
	/** Move target. */
	readonly target: MoveTarget;
	/** Move base power. */
	readonly basePower: number;
	/** Move base accuracy. True denotes a move that always hits. */
	readonly accuracy: true | number;
	/** Critical hit ratio. Defaults to 1. */
	readonly critRatio: number;
	/** Will this move always or never be a critical hit? */
	declare readonly willCrit?: boolean;
	/** Can this move OHKO foes? */
	declare readonly ohko?: boolean | 'Ice';
	// Base move type. This is the move type as specified by the games, tracked because it often differs from the real move type.
	readonly baseMoveType: string;
	// Secondary effect. You usually don't want to access this directly; but through the secondaries array.
	readonly secondary: SecondaryEffect | null;
	// Secondary effects. An array because there can be more than one (for instance, Fire Fang has both a burn and a flinch secondary).
	readonly secondaries: SecondaryEffect[] | null;
	// Moves manually boosted by Sheer Force that don't have secondary effects. e.g. Jet Punch
	readonly hasSheerForce: boolean;
	// Move priority. Higher priorities go before lower priorities, trumping the Speed stat.
	readonly priority: number;
	/** Move category. */
	readonly category: MoveCategory;
	// Pokemon for the attack stat. Ability and Item damage modifiers still come from the real attacker.
	readonly overrideOffensivePokemon?: 'target' | 'source';
	// Physical moves use attack stat modifiers, special moves use special attack stat modifiers.
	readonly overrideOffensiveStat?: StatIDExceptHP;
	// Pokemon for the defense stat. Ability and Item damage modifiers still come from the real defender.
	readonly overrideDefensivePokemon?: 'target' | 'source';
	// uses modifiers that match the new stat
	readonly overrideDefensiveStat?: StatIDExceptHP;
	/** Whether or not this move ignores negative attack boosts. */
	readonly ignoreNegativeOffensive: boolean;
	/** Whether or not this move ignores positive defense boosts. */
	readonly ignorePositiveDefensive: boolean;
	/** Whether or not this move ignores attack boosts. */
	readonly ignoreOffensive: boolean;
	/** Whether or not this move ignores defense boosts. */
	readonly ignoreDefensive: boolean;
	/**
	 * Whether or not this move ignores type immunities. Defaults to true for Status moves and false for Physical/Special moves.
	 * If an Object, its keys represent the types whose immunities are ignored, and its values should only be true.
	 */
	readonly ignoreImmunity: { [typeName: string]: boolean } | boolean;
	/** Base move PP. */
	readonly pp: number;
	/** Whether or not this move can receive PP boosts. */
	readonly noPPBoosts: boolean;
	/** How many times does this move hit? */
	declare readonly multihit?: number | number[];
	readonly flags: MoveFlags;
	readonly weaponmove: boolean;
	readonly weaponmoveCallback?: (pokemon: Pokemon) => boolean;
	readonly weaponDamage: number;
	readonly weaponDamageOnProtect: boolean;
	/** Whether or not the user must switch after using this move. */
	readonly selfSwitch?: 'copyvolatile' | 'shedtail' | boolean;
	/** Move target used if the user is not a Ghost type (for Curse). */
	readonly nonGhostTarget: MoveTarget;
	/** Whether or not the move ignores abilities. */
	readonly ignoreAbility: boolean;
	/**
	 * Move damage against the current target
	 * false = move will always fail with "But it failed!"
	 * null = move will always silently fail
	 * undefined = move does not deal fixed damage
	 */
	readonly damage: number | 'level' | false | null;
	/** Whether or not this move hit multiple targets. */
	readonly spreadHit: boolean;
	/** Modifier that affects damage when multiple targets are hit. */
	declare readonly spreadModifier?: number;
	/**  Modifier that affects damage when this move is a critical hit. */
	declare readonly critModifier?: number;
	/** Forces the move to get STAB even if the type doesn't match. */
	readonly forceSTAB: boolean;
	readonly volatileStatus?: ID;
	declare readonly guardActionCD?: number;
	declare readonly isInfusible?: boolean;
	declare readonly onEffectiveness?: (this: Battle, typeMod: number, target: Pokemon | null, type: string, move: ActiveMove) => number | void;
	declare readonly onModifySTAB?: CommonHandlers['ModifierSourceMove'];
	constructor(data: AnyObject) {
		super(data);
		this.fullname = `move: ${this.name}`;
		this.effectType = 'Move';
		this.type = Utils.getString(data.type);
		this.type2 = data.type2 ? Utils.getString(data.type2) : undefined;
		this.target = data.target;
		this.basePower = Number(data.basePower);
		this.accuracy = data.accuracy!;
		this.critRatio = Number(data.critRatio ?? -1);
		this.baseMoveType = Utils.getString(data.baseMoveType) || this.type;
		this.secondary = data.secondary || null;
		this.secondaries = data.secondaries || (this.secondary && [this.secondary]) || null;
		this.hasSheerForce = !!(data.hasSheerForce && !this.secondaries);
		this.priority = Number(data.priority) || 0;
		this.category = data.category!;
		this.overrideOffensiveStat = data.overrideOffensiveStat || undefined;
		this.overrideOffensivePokemon = data.overrideOffensivePokemon || undefined;
		this.overrideDefensiveStat = data.overrideDefensiveStat || undefined;
		this.overrideDefensivePokemon = data.overrideDefensivePokemon || undefined;
		this.ignoreNegativeOffensive = !!data.ignoreNegativeOffensive;
		this.ignorePositiveDefensive = !!data.ignorePositiveDefensive;
		this.ignoreOffensive = !!data.ignoreOffensive;
		this.ignoreDefensive = !!data.ignoreDefensive;
		this.ignoreImmunity = (data.ignoreImmunity !== undefined ? data.ignoreImmunity : this.category === 'Status');
		this.pp = Number(data.pp);
		this.noPPBoosts = !!(data.noPPBoosts ?? data.isZ);
		this.flags = data.flags || {};
		this.weaponmove = !!data.weaponmove;
		this.weaponmoveCallback = data.weaponmoveCallback || undefined;
		this.weaponDamage = data.weaponDamage || 0;
		this.weaponDamageOnProtect = data.weaponDamageOnProtect ?? true;
		this.selfSwitch = (typeof data.selfSwitch === 'string' ? (data.selfSwitch as ID) : data.selfSwitch) || undefined;
		this.nonGhostTarget = data.nonGhostTarget || '';
		this.ignoreAbility = data.ignoreAbility || false;
		this.damage = data.damage!;
		this.spreadHit = data.spreadHit || false;
		this.forceSTAB = !!data.forceSTAB;
		this.volatileStatus = typeof data.volatileStatus === 'string' ? (data.volatileStatus as ID) : undefined;
		if (!this.gen) { 
			if (this.num >= 827) {  this.gen = 9; } 
			else if (this.num >= 743) { this.gen = 8; } 
			else if (this.num >= 622) { this.gen = 7; } 
			else if (this.num >= 560) { this.gen = 6; } 
			else if (this.num >= 468) { this.gen = 5; } 
			else if (this.num >= 355) { this.gen = 4; } 
			else if (this.num >= 252) { this.gen = 3; } 
			else if (this.num >= 166) { this.gen = 2; } 
			else if (this.num >= 1) { this.gen = 1; }
		}
		assignMissingFields(this, data);
		// Magic moves ignore type immunities (treated as resistances instead) 
		if (this.flags.magic) {
			(this as any).ignoreImmunity = true;
			const origEffectiveness = this.onEffectiveness;
			(this as any).onEffectiveness = function (this: Battle, typeMod: number, target: Pokemon | null, type: string, move: ActiveMove) {
				if (typeMod <= -99) return -1;
				if (typeof origEffectiveness === 'function') { return origEffectiveness.call(this, typeMod, target, type, move); }
				return typeMod;
			};
			(this as any).onModifySTAB = function (this: Battle, stab: number, source: Pokemon, target: Pokemon, move: ActiveMove) {
				const moveTypes = [move.type];
				if (move.type2 && move.type2 !== move.type) moveTypes.push(move.type2);
				const originalTypes = source.getTypes(false, true);
				const matches = move.forceSTAB ? moveTypes : moveTypes.filter(t => originalTypes.includes(t));
				if (matches.length === 1) return 1.2;
				if (matches.length === 2) return 1.4;
			};
		}
	}
}
const EMPTY_MOVE = Utils.deepFreeze(new DataMove({ name: '', exists: false }));
export class DexMoves {
	readonly dex: ModdedDex;
	readonly moveCache = new Map<ID, Move>();
	allCache: readonly Move[] | null = null;
	constructor(dex: ModdedDex) { this.dex = dex; }
	get(name?: string | Move): Move {
		if (name && typeof name !== 'string') return name;
		const id = name ? toID(name.trim()) : '' as ID;
		return this.getByID(id);
	}
	getByID(id: ID): Move {
		if (id === '') return EMPTY_MOVE;
		let move = this.moveCache.get(id);
		if (move) return move;
		if (this.dex.getAlias(id)) {
			move = this.get(this.dex.getAlias(id));
			if (move.exists) { this.moveCache.set(id, move); }
			return move;
		}
		if (id.startsWith('hiddenpower')) { id = /([a-z]*)([0-9]*)/.exec(id)![1] as ID; }
		if (id && this.dex.data.Moves.hasOwnProperty(id)) {
			const moveData = this.dex.data.Moves[id] as any;
			const moveTextData = this.dex.getDescs('Moves', id, moveData);
			move = new DataMove({
				name: id,
				...moveData,
				...moveTextData,
			});
			if (move.gen > this.dex.gen) { (move as any).isNonstandard = 'Future'; }
			if (this.dex.parentMod) {
				// If move is exactly identical to parentMod's move, reuse parentMod's copy
				const parentMod = this.dex.mod(this.dex.parentMod);
				if (moveData === parentMod.data.Moves[id]) {
					const parentMove = parentMod.moves.getByID(id);
					if (
						move.isNonstandard === parentMove.isNonstandard &&
						move.desc === parentMove.desc && move.shortDesc === parentMove.shortDesc
					) { move = parentMove; }
				}
			}
		} else { move = new DataMove({ name: id, exists: false, }); }
		if (move.exists) this.moveCache.set(id, this.dex.deepFreeze(move));
		return move;
	}
	all(): readonly Move[] {
		if (this.allCache) return this.allCache;
		const moves = [];
		for (const id in this.dex.data.Moves) { moves.push(this.getByID(id as ID)); }
		this.allCache = Object.freeze(moves);
		return this.allCache;
	}
}