import { FS } from '../../../lib';
import { toID } from '../../../sim/dex-data';
import { type SwitchAction } from "../../../sim/battle-queue";
// Similar to User.usergroups. Cannot import here due to users.ts requiring Chat
// This also acts as a cache, meaning ranks will only update when a hotpatch/restart occurs
const usergroups: { [userid: string]: string } = {};
const usergroupData = FS('config/usergroups.csv').readIfExistsSync().split('\n');
for (const row of usergroupData) {
	if (!toID(row)) continue;
	const cells = row.split(',');
	if (cells.length > 3) throw new Error(`Invalid entry when parsing usergroups.csv`);
	usergroups[toID(cells[0])] = cells[1].trim() || ' ';
}
const roomauth: { [roomid: string]: { [userid: string]: string } } = {};
/**
 * Given a username and room, returns the auth they have in that room. Used for some conditional messages/effects.
 * Each room is cached on the first call until the process is restarted.
 */
export function getRoomauth(name: string, room: string) {
	const userid = toID(name);
	const roomid = toID(room);
	if (roomauth[roomid]) return roomauth[roomid][userid] || null;
	const roomsList: any[] = JSON.parse(FS('config/chatrooms.json').readIfExistsSync() || '[]');
	const roomData = roomsList.find(r => toID(r.title) === roomid);
	if (!roomData) return null;
	roomauth[roomid] = roomData.auth;
	return roomauth[roomid][userid] || null;
}
export function getName(name: string): string {
	const userid = toID(name);
	if (!userid) throw new Error('No/Invalid name passed to getSymbol');
	let group = usergroups[userid] || ' ';
	if (name === 'Artemis') group = '@';
	if (name === 'Jeopard-E' || name === 'Ice Kyubs') group = '*';
	return `${Math.floor(Date.now() / 1000)}|${group}${name}`;
}
export function enemyStaff(pokemon: Pokemon): string {
	const foePokemon = pokemon.side.foe.active[0];
	if (foePokemon.illusion) return foePokemon.illusion.name;
	return foePokemon.name;
}
/** TODO: What happened to make this work weird?
 * Assigns a new set to a Pokémon
 * @param pokemon the Pokemon to assign the set to
 * @param newSet the SSBSet to assign
 */
/**
 * Assigns new moves to a Pokemon
 * @param pokemon The Pokemon whose moveset is to be modified
 * @param newSet The set whose moves should be assigned
 */
export function changeMoves(context: Battle, pokemon: Pokemon, newMoves: (string | string[])[]) {
	const carryOver = pokemon.moveSlots.slice().map(m => m.pp / m.maxpp);
	// In case there are ever less than 4 moves
	while (carryOver.length < 4) { carryOver.push(1); }
	const result = [];
	let slot = 0;
	for (const newMove of newMoves) {
		const moveName = Array.isArray(newMove) ? newMove[context.random(newMove.length)] : newMove;
		const move = context.dex.moves.get(context.toID(moveName));
		if (!move.id) continue;
		const moveSlot = {
			move: move.name,
			id: move.id,
			pp: Math.floor(move.pp * carryOver[slot]),
			maxpp: move.pp,
			target: move.target,
			disabled: false,
			disabledSource: '',
			used: false,
		};
		result.push(moveSlot);
		slot++;
	}
	return result;
}
export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	inherit: 'gen9',
	// Magic moves ignore type and ability immunities, treat those immunities as resistances
	init() {
		// eslint-disable-next-line no-console
		console.log('[DEBUG] banal in TypeChart:', Object.prototype.hasOwnProperty.call(this.data.TypeChart, 'banal'),
		'exists:', this.types.get('banal').exists, 'name:', this.types.get('banal').name);
		for (const id in this.data.Moves) {
			const move = this.data.Moves[id];
			if (move.flags && move.flags.magic) {
				move.ignoreImmunity = true;
				move.ignoreAbility = true;
				const origEffect = move.onEffectiveness;
				move.onEffectiveness = function(typeMod: number, target: any, type: string, moveArg: any) {
					if (typeMod <= -99) return -1;
					if (typeof origEffect === 'function') { return origEffect.call(this, typeMod, target, type, moveArg); }
					return typeMod;
				};
				// Magic moves use 1.2x as their base STAB if one type matches, 1.4x if both types match
				// Magic moves are not affected by Terastallization - only check original types
				(move as any).onModifySTAB = function(stab: number, source: any, target: any, moveArg: any) {
					const moveTypes = [moveArg.type];
					if (moveArg.type2 && moveArg.type2 !== moveArg.type) moveTypes.push(moveArg.type2);
					// Only check original types (pre-Tera), ignore current Tera type
					const originalTypes = source.getTypes(false, true);
					const matches = moveArg.forceSTAB ? moveTypes : moveTypes.filter(t => originalTypes.includes(t));
					if (matches.length === 1) {  return 1.2; } 
					else if (matches.length === 2) {  return 1.4;  }
				};
			}
		}
	},
	getAbilityEffectOrder(pokemon: Pokemon, abilityIds?: string[]) {
		const wanted = abilityIds?.map(id => toID(id));
		const slots = (pokemon as any).getAbilitySlots?.() || [];
		for (const slot of slots) {
			if (!slot.state) continue;
			if (!wanted || wanted.includes(slot.id)) { return slot.state.effectOrder ?? 0; }
		}
		return 0;
	},
	runAbilityEventNotify(
		eventid: string,
		holder: Pokemon,
		target?: Pokemon | null,
		source?: Pokemon | null,
		effect?: Effect | null,
		...args: any[]
	) {
		const slots = (holder as any).getActiveAbilitySlots?.() || [];
		for (const slot of slots) {
			if (!slot.state) continue;
			(this as any).singleEvent(eventid, slot.effect, slot.state, target ?? holder, source, effect, ...args);
		}
	},
	runAbilityEventCancel(
		eventid: string,
		holder: Pokemon,
		target?: Pokemon | null,
		source?: Pokemon | null,
		effect?: Effect | null,
		...args: any[]
	) {
		const slots = (holder as any).getActiveAbilitySlots?.() || [];
		for (const slot of slots) {
			if (!slot.state) continue;
			const result = (this as any).singleEvent(eventid, slot.effect, slot.state, target ?? holder, source, effect, ...args);
			if (result === false || result === null) return result;
		}
		return true;
	},
	runAbilityEventChain(
		eventid: string,
		holder: Pokemon,
		value: any,
		target?: Pokemon | null,
		source?: Pokemon | null,
		effect?: Effect | null,
		...args: any[]
	) {
		let cur = value;
		const slots = (holder as any).getActiveAbilitySlots?.() || [];
		for (const slot of slots) {
			if (!slot.state) continue;
			const result = (this as any).singleEvent(eventid, slot.effect, slot.state, target ?? holder, source, effect, cur, ...args);
			if (result !== undefined) cur = result;
		}
		return cur;
	},
	//#region Pokemon
	pokemon: {
		// @ts-ignore - custom ISL method
		initAbilitySet() {
			const abilities = this.species.abilities;
			if (!abilities) return;
			console.log(`[ISL] === Initializing ability set for ${this.name} ===`);
			console.log(`[ISL] Species abilities:`, JSON.stringify(abilities));
			console.log(`[ISL] Pokemon set abilitySet:`, (this as any).set?.abilitySet);
			// Determine which ability set to use - prioritize the abilitySet property from the set
			let isSet2 = false;
			if ((this as any).set && (this as any).set.abilitySet === 2) {
				isSet2 = true;
				console.log(`[ISL] Using Set 2 (explicit from set.abilitySet)`);
			} else if ((this as any).set && (this as any).set.abilitySet === 1) {
				isSet2 = false;
				console.log(`[ISL] Using Set 1 (explicit from set.abilitySet)`);
			} else { // Fallback: determine from current ability
				const currentAbility = this.ability || (this as any).baseAbility || '';
				console.log(`[ISL] Current ability: ${currentAbility}`);
				console.log(`[ISL] Checking isSet2: currentAbility === abilities['H'] (${abilities['H']}) || currentAbility === abilities['S'] (${abilities['S']})`);
				isSet2 = currentAbility === abilities['H'] || currentAbility === abilities['S'];
				console.log(`[ISL] Using Set ${isSet2 ? 2 : 1} (inferred from current ability)`);
			}
			if (isSet2) {
				// Use Ability Set 2 (H + S)
				(this as any).ability1 = abilities['H'] || abilities['0'];
				(this as any).ability2 = abilities['S'] || abilities['1'];
			} else {
				// Use Ability Set 1 (0 + 1)
				(this as any).ability1 = abilities['0'];
				(this as any).ability2 = abilities['1'];
			}
			console.log(`[ISL] RESULT: ability1=${(this as any).ability1}, ability2=${(this as any).ability2}`);
			console.log(`[ISL] ===================================`);
			(this as any).ability = (this as any).ability1;
			if (!(this as any).baseAbility) { (this as any).baseAbility = (this as any).ability1; }
		},
		getAbilitySlots() {
			const slots: any[] = [];
			const ability1 = toID((this as any).ability1 || (this as any).ability);
			if (ability1) {
				slots.push({
					slot: 1,
					id: ability1,
					effect: (this as any).battle.dex.abilities.get(ability1),
					state: (this as any).abilityState1 || (this as any).abilityState,
				});
			}
			const ability2 = toID((this as any).ability2 || '');
			if (ability2) {
				slots.push({
					slot: 2,
					id: ability2,
					effect: (this as any).battle.dex.abilities.get(ability2),
					state: (this as any).abilityState2,
				});
			}
			return slots;
		},
		getActiveAbilitySlots() {
			if ((this as any).fainted) return [];
			if (typeof (this as any).ignoringAbility === 'function' && (this as any).ignoringAbility()) return [];
			return (this as any).getAbilitySlots().filter((slot: any) => slot.effect?.id);
		},
	},
};