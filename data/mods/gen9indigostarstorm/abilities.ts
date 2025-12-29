// @ts-nocheck
// REMINDER: Add new abilities to the Indigo Starstorm region (below) unless explicitly specified otherwise
// Keep Indigo Starstorm abilities at the top, before the base game abilities
export const Abilities: import('../../sim/dex-abilities').AbilityDataTable = {
	// #region Indigo Starstorm
	adeptfighter: {
		onEffectiveness(typeMod, target, type, move) {
			if (!move || move.category === 'Status') return;
			if (!move.flags || !(move.flags['aura'] || move.flags['kick'] || move.flags['punch'] || move.flags['sweep'])) return;
			if (type === 'Ice' || type === 'Rock' || type === 'Steel') { return 1; }
		},
		flags: {},
		name: "Adept Fighter",
		rating: 3,
		num: 1000,
	},
	aerodynamic: {
		onImmunity(type, pokemon) { if (type === 'deltastream' || type === 'turbulentwinds') return false; },
		onModifyDamage(damage, source, target, move) {
			const weather = this.field.effectiveWeather();
			if ((weather === 'deltastream' || weather === 'turbulentwinds') && move.flags?.wind) {
				if (weather === 'deltastream') { return this.chainModify(1 / 1.5); }
				else if (weather === 'turbulentwinds') { return this.chainModify(1 / 1.3); }
			}
		},
		onDamagingHit(damage, target, source, move) { if (move.flags?.wind) { this.boost({spe: 1}, target, target, this.effect); } },
		flags: {},
		name: "Aerodynamic",
		rating: 2.5,
		num: 1001,
	},
	antigravitysystem: {
		onTryImmunity(type, pokemon) {
			const groundingEffects = ['gravity', 'ingrain', 'smackdown', 'ironball', 'gastroacid', 'terrain', 'ground'];
			if (groundingEffects.includes(type)) return false;
		},
		onTryAddVolatile(status, target) { if (status.id === 'tripped') { return null; } },
		flags: {},
		name: "Anti Gravity System",
		rating: 2,
		num: 1002,
	},
	astralaspect: {
		onBasePower(basePower, attacker, defender, move) {
		if (move.flags?.aura || move.flags?.lunar || move.flags?.solar) { return this.chainModify(1.2); }
		if (defender.hasAbility('astralaspect') && move.flags?.contact) { return this.chainModify(0.5); } },
		onModifyAtk(atk, pokemon) { if ((this.field.isWeather('sunnyday') || this.field.isWeather('desolateland')) && pokemon.hasAbility('astralaspect')) { return this.chainModify(1.15); } },
		onModifyDef(def, pokemon) { if ((this.field.isWeather('sunnyday') || this.field.isWeather('desolateland')) && pokemon.hasAbility('astralaspect')) { return this.chainModify(1.15); } },
		onModifySpA(spa, pokemon) { if ((this.field.isWeather('sunnyday') || this.field.isWeather('desolateland')) && pokemon.hasAbility('astralaspect')) { return this.chainModify(1.15); } },
		onModifySpD(spd, pokemon) { if ((this.field.isWeather('sunnyday') || this.field.isWeather('desolateland')) && pokemon.hasAbility('astralaspect')) { return this.chainModify(1.15); } },
		onModifySpe(spe, pokemon) { if ((this.field.isWeather('sunnyday') || this.field.isWeather('desolateland')) && pokemon.hasAbility('astralaspect')) { return this.chainModify(1.15); } },
		onResidual(pokemon) { if (pokemon.hasAbility('astralaspect') && (this.field.isWeather('sunnyday') || this.field.isWeather('desolateland'))) { this.heal(pokemon.baseMaxhp / 16, pokemon, pokemon); } },
		onTryHit(target, source, move) { if (move.flags?.aura || move.flags?.lunar || move.flags?.solar) { if (target !== source) { if (target.hp && target.hp < target.maxhp) { this.heal(target.baseMaxhp / 4, target, target); }
		this.add('-immune', target, '[from] ability: Astral Aspect');
		return null;
			}
		}
		},
		flags: {},
		name: "Astral Aspect",
		rating: 2.5,
		num: 1003,
	},
	auramaster: {
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.aura) { return this.chainModify(1.5); } },
		onResidualOrder: 10,
		onResidual(pokemon) { if (pokemon.status === 'aura' && pokemon.statusState.time !== undefined) { pokemon.statusState.time += 0.5; } },
		onFlinch(target) { return false; },
		onTryHit(target, source, move) { if (move.flags?.aura && target !== source) { this.add('-immune', target, '[from] ability: Aura Master');
		return null;
			}
		},
		// When hit by an Aura move, extend aura duration by 1 turn and heal 25% MaxHP
		onDamagingHit(damage, target, source, move) { if (move.flags?.aura && target.status === 'aura' && target.statusState.time !== undefined) { 
				target.statusState.time += 1;
				this.heal(target.baseMaxhp / 4, target, target);
				this.add('-heal', target, target.getHealth, '[from] ability: Aura Master');
			}
		},
		onAfterSetStatus(status, target, source, effect) { // When another pokemon inflicts itself with an Aura, copy it with the same aura type (reference: Synchronize)
			if (status.id === 'aura' && source && source !== target) {
				if (target.hasAbility('auramaster')) { this.add('-activate', target, 'ability: Aura Master');
					const auraData = { // Copy the specific aura type from the source's statusState
						auraAbility: source.statusState?.auraAbility,
						auraName: source.statusState?.auraName,
						auraDuration: source.statusState?.auraDuration,
					};
					target.trySetStatus('aura', target, { status: 'aura', id: 'auramaster', ...auraData } as Effect);
				}
			}
		},
		flags: {},
		name: "Aura Master",
		rating: 3,
		num: 1004,
	},
	balloonphysics: {
		onTryHit(target, source, move) { if ((move.flags?.launching || move.flags?.sweep) && target !== source) { this.add('-immune', target, '[from] ability: Balloon Physics');
			return null;
			}
		},
		onDamagingHit(damage, target, source, move) { if (move.flags?.launching || move.flags?.sweep) { target.addVolatile('balloonphysicsairborne'); } },
		onAfterMove(source, target, move) { if (move.flags?.airborne) { source.addVolatile('balloonphysicsairborne'); } },
		condition: {
			duration: 2,
			onStart(target) { this.add('-start', target, 'Balloon Physics (Airborne)'); },
			onImmunity(type) { if (type === 'Ground') return false; },
			onEnd(target) { this.add('-end', target, 'Balloon Physics (Airborne)'); },
		},
		flags: {},
		name: "Balloon Physics",
		rating: 2.5,
		num: 1005,
	},
	betterthanone: {
		onPrepareHit(source, target, move) { // After using a Biting or Piercing move, followup with a 25% power attack (reference: Parental Bond)
			if (move.category === 'Status' || move.multihit || move.flags['charge'] || move.flags['futuremove'] || move.spreadHit || move.isZ || move.isMax) return;
			if (move.flags?.bite || move.flags?.piercing) {
				move.multihit = 2;
				move.multihitType = 'betterthanone';
				move.smartTarget = true; // Reference: Dragon Darts - hit different targets if available
			}
		},
		onSourceBasePower(basePower, target, source, move) { if (move.multihitType === 'betterthanone' && move.hit > 1) { return this.chainModify(0.25); } }, // for reference, Parental Bond does 50%
		onBeforeMovePriority: 11,
		onBeforeMove(pokemon, target, move) { if (pokemon.status === 'slp') { move.sleepUsable = true; } },
		flags: {},
		name: "Better Than One",
		rating: 3,
		num: 1006,
	},
	blazingbell: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) { if (move.flags['sound'] && !pokemon.volatiles['dynamax']) {  move.type = 'Fire'; } },
        onBasePower(basePower, attacker, defender, move) { if (move.flags['sound']) { return this.chainModify(1.2); } },
		flags: {},
		name: "Blazing Bell",
		rating: 1.5,
		num: 1007,
	},
	blazingvortex: {
		onStart(source) {
			if (this.field.getPseudoWeather('seaoffire')) return;
			this.field.addPseudoWeather('seaoffire', source, source.ability, 4);
		},
		flags: {},
		name: "Blazing Vortex",
		rating: 4,
		num: 1008,
	},
	bountifulharvest: {
		onStart(pokemon) { // Upon entering the field, heal ally for 1/6 of their MaxHP (reference: Harvest berry restoration)
			for (const ally of pokemon.adjacentAllies()) { if (ally.hp && ally.hp < ally.maxhp) {
				this.heal(ally.baseMaxhp / 6, ally, pokemon);
				this.add('-heal', ally, ally.getHealth, '[from] ability: Bountiful Harvest');
				}
			}
		},
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (!pokemon.hp || pokemon.item || !this.dex.items.get(pokemon.lastItem).isBerry) { if (pokemon.hp && pokemon.hp < pokemon.maxhp) { this.heal(pokemon.baseMaxhp / 16, pokemon, pokemon); }
				return;
			}
			if (this.field.isWeather(['sunnyday', 'desolateland']) || this.field.isTerrain('grassyterrain')) {
				pokemon.setItem(pokemon.lastItem);
				pokemon.lastItem = '';
				this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Bountiful Harvest');
				return;
			}
			if ((this.field.isWeather(['hail', 'sandstorm', 'snowscape']) || this.field.isTerrain('toxicterrain')) && this.randomChance(1, 4)) {
				pokemon.setItem(pokemon.lastItem);
				pokemon.lastItem = '';
				this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Bountiful Harvest');
				return;
			}
			if (this.randomChance(1, 2)) {
				pokemon.setItem(pokemon.lastItem);
				pokemon.lastItem = '';
				this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Bountiful Harvest');
				return;
			}
			if (pokemon.hp && pokemon.hp < pokemon.maxhp) { this.heal(pokemon.baseMaxhp / 16, pokemon, pokemon); }
		},
		flags: {},
		name: "Bountiful Harvest",
		rating: 3.5,
		num: 1009,
	},
	bubblefoam: {
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.spin) { return this.chainModify([5325, 4096]);  } },
		onDamagingHit(damage, target, source, move) { // When hit by a Contact move, reset the attacker's stat changes
			if (this.checkMoveMakesContact(move, source, target)) { this.add('-clearboost', source);
				source.clearBoosts();
			}
		},
		onAfterMove(source, target, move) { // When user lands a contact move, reset the target's stat changes
			if (move.category !== 'Status' && this.checkMoveMakesContact(move, source, target)) { this.add('-clearboost', target);
				target.clearBoosts();
			}
		},
		name: "Bubblefoam",
		rating: 2.5,
		num: 1010,
	},
	cannonfire: {
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.bullet || move.flags?.bomb) { return this.chainModify([5325, 4096]);  } },
		flags: {},
		name: "Cannonfire",
		rating: 2.5,
		num: 1011,
	},
	cargoflier: {
		onTryImmunity(type, pokemon) {
			const groundingEffects = ['gravity', 'ingrain', 'smackdown', 'ironball', 'gastroacid', 'terrain', 'ground'];
			if (groundingEffects.includes(type) && type !== 'roost') return false;
		},
		flags: {},
		name: "Cargo Flier",
		rating: 2,
		num: 1012,
	},
	concretepillars: {
		onBasePower(basePower, attacker, defender, move) { if (move.type === 'Rock' || move.flags?.spin) { return this.chainModify(1.5); } },
		onModifyMove(move, pokemon) {  if (move.flags?.contact) {
			move.flags.contact = 0;
			move.flags.weapon = 1;
			}
		},
		flags: {},
		name: "Concrete Pillars",
		rating: 3,
		num: 1013,
	},
	conversion: {
		onStart(pokemon) {
			const target = pokemon.side.foe.active[pokemon.position];
			if (!target || target.fainted) return;
			const targetType = target.getTypes()[0];
			if (targetType === '???') return;
			if (pokemon.hasType(targetType)) return;
			if (!pokemon.setType(pokemon.getTypes(true).concat([targetType]))) return;
			this.add('-start', pokemon, 'typeadd', targetType, '[from] ability: Conversion');
		},
		flags: {},
		name: "Conversion",
		rating: 2.5,
		num: 1014,
	},
	conversion2: {
		onDamagingHit(damage, target, source, move) {
			if (!move.type) return;
			const possibleTypes = [];
			const allTypes = this.dex.types.all();
			for (const type of allTypes) {
				if (type.id === '???') continue;
				const effectiveness = this.dex.getEffectiveness(move.type, type.name);
				if (effectiveness < 0 || this.dex.getImmunity(move.type, type.name) === false) { possibleTypes.push(type.name); }
			}
			if (!possibleTypes.length) return;
			const newType = this.sample(possibleTypes);
			if (target.hasType(newType)) return;
			if (!target.setType(target.getTypes(true).concat([newType]))) return;
			this.add('-start', target, 'typeadd', newType, '[from] ability: Conversion 2');
		},
		flags: {},
		name: "Conversion 2",
		rating: 3,
		num: 1015,
	},
	dreameater: {
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			for (const target of pokemon.foes()) { if (target.status === 'slp') {
					const dmg = target.baseMaxhp / 12;
					this.damage(dmg, target, pokemon);
					this.heal(dmg, pokemon, pokemon);
				}
			}
		},
		flags: {},
		name: "Dream Eater",
		rating: 2.5,
		num: 1016,
	},
	elementalaffinity: {
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.punch) { return this.chainModify(1.3); } },
		onModifyMove(move, pokemon) {
			const elementalTypes = ['Fire', 'Electric', 'Grass', 'Ice', 'Water'];
			if (move.category === 'Physical' && elementalTypes.includes(move.type)) { move.category = 'Special'; }
		},
		flags: {},
		name: "EleMental Affinity",
		rating: 3,
		num: 1017,
	},
	enchantingvoice: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) { if (move.flags['sound'] && !pokemon.volatiles['dynamax']) {  move.type = 'Fairy'; } },
        onBasePower(basePower, attacker, defender, move) { if (move.flags['sound']) { return this.chainModify(1.2); } },
		flags: {},
		name: "Enchanting Voice",
		rating: 1.5,
		num: 1018,
	},
	flamepads: {
		onModifyMove(move, pokemon) { if (move.flags?.kick) { delete move.flags['contact']; } },
		onDamagingHit(damage, target, source, move) { if (move.flags?.kick && this.randomChance(1, 5)) { target.trySetStatus('brn', source); } },
		flags: {},
		name: "Flame Pads",
		rating: 3,
		num: 1019,
	},
	foodpouch: {
		onSwitchInPriority: -2,
		onStart(pokemon) { for (const ally of pokemon.adjacentAllies()) { this.heal(ally.baseMaxhp / 3, ally, pokemon); } },
		flags: {},
		name: "Food Pouch",
		rating: 0,
		num: 1020,
	},
	forestscurse: {
		onFoeTrapPokemon(pokemon) {
			if (pokemon.hasType(['Flying', 'Ghost', 'Grass'])) return;
			if (pokemon.isAdjacent(this.effectState.target)) { pokemon.tryTrap(true); }
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectState.target;
			if (!source || !pokemon.isAdjacent(source)) return;
			if (pokemon.hasType(['Flying', 'Ghost', 'Grass'])) return;
			pokemon.maybeTrapped = true;
		},
		onResidual(pokemon) {
			for (const target of pokemon.foes()) {
				if (target.hasType(['Flying', 'Ghost', 'Grass'])) continue;
				if (!target.volatiles['leechseed']) { target.addVolatile('leechseed', pokemon); }
				if (target.hp <= target.maxhp / 2 && !target.hasType('Grass')) {
					if (!target.setType(target.getTypes(true).concat('Grass'))) continue;
					this.add('-start', target, 'typeadd', 'Grass', '[from] ability: Forest\'s Curse', '[of] ' + pokemon);
				}
			}
		},
		flags: {},
		name: "Forest's Curse",
		rating: 4,
		num: 1078,
	},
	gracefulstep: {
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.kick) { return this.chainModify(1.3); } },
		onModifyMove(move, pokemon) { if (move.flags?.kick) { delete move.flags['contact']; } },
		flags: {},
		name: "Graceful Step",
		rating: 3,
		num: 1021,
	},
	gravitywell: {
		onStart(source) {
			if (this.field.getPseudoWeather('gravity')) return;
			this.field.addPseudoWeather('gravity', source, source.ability, 5);
		},
		flags: {},
		name: "Gravity Well",
		rating: 4,
		num: 1022,
	},
	hailstorm: {
		onStart(source) { this.field.setWeather('hail'); },
		flags: {},
		name: "Hailstorm",
		rating: 4,
		num: 1023,
	},
	hardtopcarapace: {
		onTryHit(target, source, move) { if (move && (move.flags?.bomb || move.flags?.crush)) { this.add('-immune', target, '[from] ability: Hardtop Carapace');
			return null;
			}
		},
		flags: {},
		name: "Hardtop Carapace",
		rating: 2.5,
		num: 1024,
	},
	herbalmedicine: {
		onSwitchInPriority: -2,
		onStart(pokemon) { for (const ally of pokemon.adjacentAllies()) {
			this.heal(ally.baseMaxhp / 3, ally, pokemon);
			if (ally.status && ally.status !== 'aura') {
				ally.cureStatus();
				this.add('-curestatus', ally, '[from] ability: Herbal Medicine', '[of] ' + pokemon);
				}
			}
		},
		flags: {},
		name: "Herbal Medicine",
		rating: 0,
		num: 1025,
	},
	highdrop: {
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.bomb) { return this.chainModify([5325, 4096]);  } },
		flags: {},
		name: "High Drop",
		rating: 2.5,
		num: 1026,
	},
	hivemind: { // Make Bug or Psychic type allies copy damaging moves used by the user
		onAfterMove(source, target, move) {
			if (!move || move.category === 'Status' || !source.isActive) return;
			for (const ally of source.adjacentAllies()) {
				if (!ally.isActive || ally.fainted) continue;
				if (!ally.hasType('Bug') && !ally.hasType('Psychic')) continue;
				let moveTarget = target;
				if (!moveTarget || !moveTarget.isActive || moveTarget.fainted) { // If original target is invalid, find an enemy
					const foes = ally.foes();
					moveTarget = foes.find(foe => foe.isActive && !foe.fainted) || null;
				}
				if (moveTarget) {
					this.add('-activate', ally, 'ability: Hive Mind', '[of] ' + source);
					this.actions.useMove(move.id, ally, { target: moveTarget });
				}
			}
		},
		flags: {},
		name: "Hive Mind",
		rating: 3,
		num: 1027,
	},
	hoarfrostrimes: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) { if (move.flags['sound'] && !pokemon.volatiles['dynamax']) {  move.type = 'Ice'; } },
        onBasePower(basePower, attacker, defender, move) { if (move.flags['sound']) { return this.chainModify(1.2); } },
		onAnyAfterSetStatus(status, target, source, effect) {
			if (source !== this.effectState.target || target === source || effect.effectType !== 'Move') return;
			if (status.id === 'charm') { if (target.trySetStatus('frz', source, effect)) { this.add('-status', target, 'frz', '[from] ability: Hoarfrost Rimes', '[of] ' + source); } }
		},
		flags: {},
		name: "Hoarfrost Rimes",
		rating: 1.5,
		num: 1028,
	},
	hypnotize: {
		onAfterSetStatus(status, target, source, effect) {
			if (source !== this.effectState.target || target === source || effect.effectType !== 'Move') return;
			if (status.id === 'drowsy' || status.id === 'slp') { target.addVolatile('confusion'); }
		},
		flags: {},
		name: "Hypnotize",
		rating: 2.5,
		num: 1029,
	},
	infernalheat: {
		onAnyBasePower(basePower, source, target, move) { if (move.type === 'Water') { return this.chainModify(0.7); } },
		onAnyTryMove(target, source, move) { if (move.type === 'Water' && this.field.isWeather(['sunnyday', 'desolateland'])) {
				this.attrLastMove('[still]');
				this.add('-fail', source, move, '[from] ability: Infernal Heat', '[of] ' + this.effectState.target);
				this.add('-message', `The water evaporated in the harsh sunlight!`);
				return false;
			}
		},
		flags: {},
		name: "Infernal Heat",
		rating: 4,
		num: 1030,
	},
	karmicreversal: {
		onDamagingHit(damage, target, source, move) {
			if (move.category !== 'Physical') return;
			if (move.basePower >= 120) { this.boost({atk: 2}, target, target, this.effect); }
			else if (move.basePower >= 90) { this.boost({atk: 1}, target, target, this.effect); }
		},
		flags: {},
		name: "Karmic Reversal",
		rating: 3,
		num: 1031,
	},
	lacedclaws: {
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.claw) { return this.chainModify(1.3); } },
		onAfterMoveSecondary(target, source, move) {
			if (!source || source.fainted || !target || target.fainted) return;
			if ((move.flags?.claw || move.flags?.pierce) && move.category !== 'Status' && target.side !== source.side) { if (this.randomChance(3, 10)) { if (target.trySetStatus('tox', source, move)) { this.add('-ability', source, 'Laced Claws'); } } }
		},
		flags: {},
		name: "Laced Claws",
		rating: 3,
		num: 1032,
	},
	lingeringspirit: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) { if (!target.hp) { // Check if Damp is on the field
			for (const pokemon of this.getAllActive()) { if (pokemon.hasAbility('damp')) {
					this.add('-ability', pokemon, 'Damp');
					this.add('-message', `${pokemon.name}'s Damp prevents Lingering Spirit from activating!`);
					return;
					}
				}
				this.add('-activate', target, 'ability: Lingering Spirit');
				for (const pokemon of this.getAllActive()) { if (pokemon !== target && !pokemon.fainted) { if (!pokemon.hasType('Dark') && !pokemon.hasType('Ghost') && !pokemon.hasType('Fairy')) { pokemon.addVolatile('curse'); } } }
			}
		},
		flags: {},
		name: "Lingering Spirit",
		rating: 3,
		num: 1033,
	},
	longsnout: {
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.sweep) { return this.chainModify(1.3); } },
		onModifyMove(move, pokemon) { if (move.flags?.sweep && move.target === 'normal') {
				move.target = 'allAdjacentFoes';
				move.isSpread = true;
			}
		},
		flags: {},
		name: "Long Snout",
		rating: 3,
		num: 1034,
	},
	lunaraspect: {
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.lunar) { return this.chainModify(1.3); } },
		onSourceModifyDamage(damage, source, target, move) { if (move.flags && move.flags.solar) { this.debug('Lunar Aspect weakness to solar');
				return this.chainModify(2);
			}
		},
		onTryHit(target, source, move) { if (move.flags?.lunar && target !== source) {
				if (target.hp && target.hp < target.maxhp) { this.heal(target.baseMaxhp / 4, target, target); }
				this.add('-immune', target, '[from] ability: Lunar Aspect');
				return null;
			}
		},
		onModifyAtk(atk, pokemon) { if ((this.field.isWeather('sunnyday') || this.field.isWeather('desolateland')) && pokemon.hasAbility('lunaraspect')) { return this.chainModify(1.15); } },
		onModifyDef(def, pokemon) { if ((this.field.isWeather('sunnyday') || this.field.isWeather('desolateland')) && pokemon.hasAbility('lunaraspect')) { return this.chainModify(1.15); } },
		onModifySpA(spa, pokemon) { if ((this.field.isWeather('sunnyday') || this.field.isWeather('desolateland')) && pokemon.hasAbility('lunaraspect')) { return this.chainModify(1.15); } },
		onModifySpD(spd, pokemon) { if ((this.field.isWeather('sunnyday') || this. field.isWeather('desolateland')) && pokemon.hasAbility('lunaraspect')) { return this.chainModify(1.15); } },
		onModifySpe(spe, pokemon) { if ((this.field.isWeather('sunnyday') || this.field.isWeather('desolateland')) && pokemon.hasAbility('lunaraspect')) { return this.chainModify(1.15); } },
		onResidual(pokemon) { if (pokemon.hasAbility('lunaraspect') && (this.field.isWeather('sunnyday') || this.field.isWeather('desolateland'))) { this.heal(pokemon.baseMaxhp / 16, pokemon, pokemon); } },
		flags: {},
		name: "Lunar Aspect",
		rating: 3.5,
		num: 1035,
	},
	lunamancy: {
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.lunar) { return this.chainModify(1.3); } },
		onTryImmunity(type, pokemon) {
			const groundingEffects = ['gravity', 'ingrain', 'smackdown', 'ironball'];
			if (groundingEffects.includes(type)) return false;
		},
		onAllyTryImmunity(type, pokemon) {
			const groundingEffects = ['gravity', 'ingrain', 'smackdown', 'ironball'];
			if (groundingEffects.includes(type)) return false;
		},
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) { if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				for (const target of pokemon.foes()) {
					if (target.fainted || !target.hp) continue;
					if (target.volatiles['smackdown']) continue;
					target.addVolatile('smackdown');
					this.add('-start', target, 'Smack Down', '[from] ability: Lunamancy');
				}
			}
		},
		flags: {},
		name: "Lunamancy",
		rating: 3.5,
		num: 1036,
	},
	memorywipe: {
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) { if (!activated) { this.add('-ability', pokemon, 'Memory Wipe', 'boost');
					activated = true;
				}
				this.clearBoosts(target);
				this.add('-clearboost', target);
				this.boost({ spdef: -1 }, target, pokemon, null, true);
			}
		},
		flags: {},
		name: "Memory Wipe",
		rating: 3.5,
		num: 1037,
	},
	miracleeye: {
		onModifyMovePriority: -5,
		onModifyMove(move, pokemon) { // Allow Psychic-type moves to hit Dark types for neutral damage
			if (move.type === 'Psychic') {
				if (!move.ignoreImmunity) move.ignoreImmunity = {};
				if (move.ignoreImmunity !== true) { move.ignoreImmunity['Psychic'] = true; }
			}
		},
		flags: {},
		name: "Miracle Eye",
		rating: 3,
		num: 1038,
	},
	mudarmor: {
		onDamagingHit(damage, target, source, move) { if (!target.mudArmorBroken) { if (move.crit || move.type === 'Grass' || move.type === 'Ice' || move.type === 'Water') { // Break armor if hit by critical hit or Grass/Ice/Water move
				target.mudArmorBroken = true; 
				this.add('-activate', target, 'ability: Mud Armor');
				this.add('-message', `${target.name}'s Mud Armor broke!`);
				}
			}
		},
		onSourceModifyDamage(damage, source, target, move) { if (!target.mudArmorBroken) { if (move.type === 'Electric' || move.type === 'Fire' || move.type === 'Rock') { this.debug('Mud Armor resist');
				return this.chainModify(0.5);
				}
			}
		},
		flags: { breakable: 1 },
		name: "Mud Armor",
		rating: 4.5,
		num: 1039,
	},
	mudroller: { // If user is Rabsca, set Psychic Terrain after being hit, or after a Psychic move is used on the field
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.bomb || move.flags?.crush || move.flags?.spin) { return this.chainModify(1.5); } },
		onDamagingHit(damage, target, source, move) {  if (target.baseSpecies.baseSpecies === 'Rabsca') { this.field.setTerrain('psychicterrain'); } },
		onAnyAfterMove(source, target, move) {  if (this.effectState.target.baseSpecies.baseSpecies === 'Rabsca' && move.type === 'Psychic') { this.field.setTerrain('psychicterrain'); } },
		flags: {},
		name: "Mud Roller",
		rating: 3,
		num: 1040,
	},
	musician: {
	    onBasePower(basePower, attacker, defender, move) {if (move.flags && move.flags.dance) {  return this.chainModify(1.3);  } },
		flags: {},
		name: "Musician", 
		rating: 1.5,
    	num: 1041,
	},
	needleice: {
	   onBasePower(basePower, attacker, defender, move) { if (move.flags && move.flags.pierce) { return this.chainModify(1.3); } },
	   onDamagingHitOrder: 1,
	   onDamagingHit(damage, target, source, move) { if (this.checkMoveMakesContact(move, source, target, true)) {
			this.damage(source.baseMaxhp / 8, source, target);
			if (this.randomChance(1, 10)) { source.trySetStatus('frostbite', target, move);  }
		   }
	   },
	       flags: {},
	       name: "Needle Ice", 
	       rating: 1.5,
	       num: 1042,
	},
	nightbloom: {
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.lunar) { return this.chainModify(1.3); } },
		onTryHit(target, source, move) { if (move.flags?.lunar && target !== source) {
				this.boost({spe: 1}, target, target, this.effect);
				this.heal(target.baseMaxhp / 4, target, target);
				this.add('-immune', target, '[from] ability: Nightbloom');
				return null;
			}
		},
		onModifySpe(spe, pokemon) { if (this.field.isWeather('sunnyday') || this.field.isWeather('desolateland')) { return this.chainModify(2); } },
		onTrapPrevention(pokemon, trapper) { if (trapper.hasAbility('shadowtag')) { return false; } },
		flags: {},
		name: "Nightbloom",
		rating: 4,
		num: 1043,
	},
	packmentality: {
		onAllyAfterMove(source, target, move) {
			if (!this.effectState.target || this.effectState.target.fainted) return;
			if (source === this.effectState.target) return; // Don't trigger on own moves
			if (!target || target.fainted || !target.isActive) return;
			if (move.category === 'Status') return;
			let packTarget = target;
			if (move.target === 'allAdjacentFoes' || move.target === 'allAdjacent' || move.target === 'allNearFoes') { // For spread moves, choose a random foe
				const possibleTargets = this.effectState.target.foes().filter((foe: any) => foe.isAdjacent(this.effectState.target) && !foe.fainted);
				if (possibleTargets.length) { packTarget = this.sample(possibleTargets); } 
				else { return; }
			}
			const packMove = {
				basePower: 30,
				type: 'Dark',
				category: 'Physical',
				flags: { contact: 1, protect: 1 },
				willCrit: false,
				ignoreAbility: false,
			};
			this.add('-ability', this.effectState.target, 'Pack Mentality');
			this.actions.tryMoveHit(packTarget, this.effectState.target, packMove);
		},
		flags: {},
		name: "Pack Mentality",
		rating: 2,
		num: 1044,
	},
	pressurizedcell: {
		onModifyAtk(atk, attacker, defender, move) { if (move.type === 'Electric') { return this.chainModify(1.2); } },
		onModifySpA(spa, attacker, defender, move) { if (move.type === 'Electric') { return this.chainModify(1.2); } },
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.explosive) { return this.chainModify(1.5); } },
		onDamagingHit(damage, target, source, move) { if (move.type === 'Electric') { this.add('-activate', target, 'ability: Pressurized Cell');
			const explosionDamage = this.actions.getDamage(
				target, 
				target, 
				{
					basePower: 40,
					type: 'Electric',
					category: 'Special',
				}
			);
			// Damage all active Pokémon including the user
			for (const pokemon of this.getAllActive()) { if (pokemon && !pokemon.fainted) { this.damage(explosionDamage, pokemon, target, {
				id: 'pressurizedcell',
				effectType: 'Ability',
				flags: { explosive: 1 },
					});
				}
			}
		}
		},
		flags: {},
		name: "Pressurized Cell",
		rating: 3.5,
		num: 1045,
	},
	pressurizedgas: {
		onDamagingHit(damage, target, source, move) { this.field.setTerrain('mistyterrain'); },
		flags: {},
		name: "Pressurized Gas",
		rating: 2.5,
		num: 1046,
	},
	proudtusks: {
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.pierce) { return this.chainModify(1.3); } },
		onModifyMove(move, pokemon) {
			// Improve pierce levels: Pierce3 -> Pierce2, Pierce2 -> Pierce1, Pierce1 stays Pierce1
			if (move.pierce3) {
				delete move.pierce3;
				move.pierce2 = true;
			} else if (move.pierce2 && !move.pierce1) {
				delete move.pierce2;
				move.pierce1 = true;
			}
			// Pierce1 remains unchanged (already strongest)
		},
		flags: {},
		name: "Proud Tusks",
		rating: 3,
		num: 1047,
	},
	rainbowwings: {
		onStart(source) {
			if (this.field.getPseudoWeather('rainbow')) return;
			this.field.addPseudoWeather('rainbow', source, source.ability, 4);
		},
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.wing) { return this.chainModify(1.5); } },
		onTrapPrevention(pokemon, trapper) { if (trapper.hasAbility('shadowtag')) { return false; } },
		flags: {},
		name: "Rainbow Wings",
		rating: 4,
		num: 1048,
	},
	ramparts: {
		onSourceModifyDamage(damage, source, target, move) { if (move.flags && move.flags.breath || move.flags.contact || move.flags.wind) { this.debug('Rampart resistance to breath, contact, wind');
			return this.chainModify(0.5);
			}
			else if (move.flags && move.flags.bomb || move.flags.bullet || move.flags.explosive) { this.debug('Rampart weakness to bomb, bullet, explosive');
			return this.chainModify(2);
			}
		},
		onTryHit(target, source, move) { if (move.flags?.pierce || move.breaksProtect) { this.add('-immune', target, '[from] ability: Ramparts');
				return null;
			}
		},
		flags: {},
		name: "Ramparts",
		rating: 4,
		num: 1049,

	},
	rejuvenation: {
		onStart(pokemon) { if (!pokemon.volatiles['aquaring']) { pokemon.addVolatile('aquaring'); } },
		flags: {},
		name: "Rejuvenation",
		shortDesc: "On switch-in, the user surrounds itself with Aqua Ring.",
		rating: 3.5,
		num: -1,
	},
	resonance: {
		onTryHit(target, source, move) {
			if (move.flags?.sound || move.flags?.wind) { this.add('-immune', target, '[from] ability: Resonance');
				return null;
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.flags?.wind) {
				this.add('-activate', target, 'ability: Resonance');
				const counterDamage = Math.floor(damage * 1.2);
				for (const foe of target.foes()) {
					this.damage(counterDamage, foe, target, {
						id: 'resonance',
						effectType: 'Ability',
						flags: { sound: 1 },
					});
				}
			}
		},
		flags: {},
		name: "Resonance",
		rating: 4,
		num: 1050,
	},
	rockbody: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Rock') { if (!this.heal(target.baseMaxhp / 4)) { this.add('-immune', target, '[from] ability: Rock Body'); }
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Rock Body",
		rating: 3.5,
		num: 1051,
	},
	seaguardianscurse: {
		onStart(pokemon) { this.add('-ability', pokemon, 'Sea Guardian\'s Curse');
			const auraData = {
				auraAbility: 'mentalsurge',
				auraName: 'Mental Surge',
				auraDuration: 4, 
			};
			pokemon.trySetStatus('aura', pokemon, { status: 'aura', id: 'seaguardianscurse', ...auraData } as Effect);
		},
		onDeductPP(target, source) {
			if (target.isAlly(source)) return;
			return 1;
		},
		flags: {},
		name: "Sea Guardian's Curse",
		rating: 4.5,
		num: 1052,
	},
	seedgift: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			if (!pokemon.abilityState.seedgiftUses) { pokemon.abilityState.seedgiftUses = 0; }
			if (pokemon.abilityState.seedgiftUses >= 6) {
				this.add('-activate', pokemon, 'ability: Seed Gift', '[failed]');
				this.add('-message', `${pokemon.name}'s There are no seeds left!`);
				return;
			}
			let healed = false;
			for (const ally of pokemon.adjacentAllies()) {
				this.heal(ally.baseMaxhp / 3, ally, pokemon);
				healed = true;
			}
			if (healed) { // Increment counter only if healing occurred
				pokemon.abilityState.seedgiftUses++;
				const remaining = 6 - pokemon.abilityState.seedgiftUses;
				this.add('-message', `Seed Gift can activate ${remaining} more time${remaining !== 1 ? 's' : ''} this battle.`);
			}
		},
		flags: {},
		name: "Seed Gift",
		rating: 0,
		num: 1053,
	},
	seismiccore: {
		onResidualOrder: 28,
		onResidual(pokemon) {
			if (!pokemon.abilityState.seismicTurns) { pokemon.abilityState.seismicTurns = 0; }
			pokemon.abilityState.seismicTurns++;
			// Trigger every other turn (on even turns: 2, 4, 6, etc.)
			if (pokemon.abilityState.seismicTurns % 2 === 0) {
				const foes = pokemon.foes().filter(foe => !foe.fainted);
				if (foes.length === 0) return;
				const target = this.sample(foes);
				this.add('-activate', pokemon, 'ability: Seismic Core');
				// Determine category based on which attacking stat is lower 
				const category = pokemon.getStat('atk', false, true) < pokemon.getStat('spa', false, true) ? 'Physical' : 'Special';
				const damage = this.actions.getDamage(
					pokemon,
					target,
					{
						basePower: 55,
						type: 'Fire',
						category: category,
					}
				);
				this.damage(damage, target, pokemon, {
					id: 'seismiccore',
					effectType: 'Ability',
					flags: { bomb: 1 },
				});
			}
		},
		flags: {},
		name: "Seismic Core",
		rating: 3.5,
		num: 1054,
	},
	shadowwalker: {
		onModifyMove(move) { if (move.flags?.shadow) { move.infiltrates = true; } },
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.shadow) { return this.chainModify(1.3); } },
		onTrapPrevention(pokemon, trapper) { if (trapper.hasAbility('shadowtag')) { return false; } },
		flags: {},
		name: "Shadow Walker",
		rating: 3,
		num: 1055,
	},
	shellsword: {
		onModifyMove(move, pokemon) {  if (move.flags?.slice) {
			move.flags.contact = 0;
			move.flags.weapon = 1;
			}
		},
		flags: {},
		name: "Shell Sword",
		rating: 3,
		num: 1056,
	},
	solaraspect: {
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.solar) { return this.chainModify(1.3); } },
		onSourceModifyDamage(damage, source, target, move) { if (move.flags && move.flags.lunar) { this.debug('Solar Aspect weakness to lunar');
			return this.chainModify(2);
			}
		},
		onTryHit(target, source, move) { if (move.flags?.solar && target !== source) { if (target.hp && target.hp < target.maxhp) { this.heal(target.baseMaxhp / 4, target, target); }
				this.add('-immune', target, '[from] ability: Solar Aspect');
				return null;
			}
		},
		onModifyAtk(atk, pokemon) { if ((this.field.isWeather('sunnyday') || this.field.isWeather('desolateland')) && pokemon.hasAbility('solaraspect')) { return this.chainModify(1.15); } },
		onModifyDef(def, pokemon) { if ((this.field.isWeather('sunnyday') || this.field.isWeather('desolateland')) && pokemon.hasAbility('solaraspect')) { return this.chainModify(1.15); } },
		onModifySpA(spa, pokemon) { if ((this.field.isWeather('sunnyday') || this.field.isWeather('desolateland')) && pokemon.hasAbility('solaraspect')) { return this.chainModify(1.15); } },
		onModifySpD(spd, pokemon) { if ((this.field.isWeather('sunnyday') || this.field.isWeather('desolateland')) && pokemon.hasAbility('solaraspect')) { return this.chainModify(1.15); } },
		onModifySpe(spe, pokemon) { if ((this.field.isWeather('sunnyday') || this.field.isWeather('desolateland')) && pokemon.hasAbility('solaraspect')) { return this.chainModify(1.15); } },
		onResidual(pokemon) { if (pokemon.hasAbility('solaraspect') && (this.field.isWeather('sunnyday') || this.field.isWeather('desolateland'))) { this.heal(pokemon.baseMaxhp / 16, pokemon, pokemon); } },
		flags: {},
		name: "Solar Aspect",
		rating: 3.5,
		num: 1057,
	},
	souleater: {
		onAnyFaintPriority: 1,
		onAnyFaint() {
		const target = this.effectState.target;
		if (target && target.hp > 0 && !target.fainted) { this.heal(target.maxhp / 4, target, null, this.effect); }
		},
		flags: {},
		name: "Soul Eater",
		rating: 3.5,
		num: 1058,
	},
	soothingfeelers: {
		onDamagingHit(damage, target, source, move) { if (this.checkMoveMakesContact(move, source, target)) { if (this.randomChance(3, 10)) { source.trySetStatus('aura', target, {
					auraAbility: 'tranquilspirit',
					auraName: 'Tranquil Spirit',
					auraDuration: 2,
					});
				}
			}
		},
		onSourceHit(target, source, move) { if (move && this.checkMoveMakesContact(move, source, target)) { if (this.randomChance(3, 10)) { target.trySetStatus('aura', source, {
					auraAbility: 'tranquilspirit',
					auraName: 'Tranquil Spirit',
					auraDuration: 2,
					});
				}
			}
		},
		flags: {},
		name: "Soothing Feelers",
		rating: 3.5,
		num: 1059,
	},
	spellhorizon: {
		onStart(source) {
			if (this.field.getPseudoWeather('magicroom')) return;
			this.field.addPseudoWeather('magicroom', source, source.ability, 5);
		},
		flags: {},
		name: "Spell Horizon",
		rating: 4,
		num: 1060,
	},
	spritiguide: {
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.aura) { return this.chainModify(1.5); } },
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target === source || move.hasBounced || target.isSemiInvulnerable()) return;
			if (!move.flags?.aura) return;
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.add('-activate', target, 'ability: Spirit Guide');
			this.actions.useMove(newMove, target, { target: source });
			return null;
		},
		onAllyTryHitSide(target, source, move) {
			if (target.isAlly(source) || move.hasBounced || target.isSemiInvulnerable()) return;
			if (!move.flags?.aura) return;
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.add('-activate', this.effectState.target, 'ability: Spirit Guide');
			this.actions.useMove(newMove, this.effectState.target, { target: source });
			move.hasBounced = true;
			return null;
		},
		flags: {},
		name: "Spirit Guide",
		rating: 3,
		num: 1061,
	},
	starterdough: {
		onStart(pokemon) {
			if (pokemon.abilityState.bakedState === 'burnt') {
				const currentTypes = pokemon.getTypes(true);
				if (!currentTypes.includes('Rock')) {
					pokemon.setType(currentTypes.concat('Rock'));
					this.add('-start', pokemon, 'typeadd', 'Rock', '[from] ability: Starter Dough');
				}
			}
		},
		onSourceModifyDamage(damage, source, target, move) { // User's Breath moves heal the target instead of dealing damage
			if (move.flags?.breath && source.hasAbility('starterdough')) { this.heal(damage, target, source);
				return 0;
			}
		},
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (pokemon.abilityState.bakedState === 'baked') { return this.chainModify(1.5); } 
			else if (pokemon.abilityState.bakedState === 'burnt') { return this.chainModify(2); }
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				if (!target.abilityState.bakedState) { target.abilityState.bakedState = 'none'; }
				if (target.abilityState.bakedState === 'none') {
					// First Fire hit: become Baked
					target.abilityState.bakedState = 'baked';
					this.add('-activate', target, 'ability: Starter Dough');
					this.add('-message', `${target.name} has been baked!`);
				} else if (target.abilityState.bakedState === 'baked') {
					// Second Fire hit while Baked: become Burnt
					target.abilityState.bakedState = 'burnt';
					const currentTypes = target.getTypes(true);
					if (!currentTypes.includes('Rock')) {
						target.setType(currentTypes.concat('Rock'));
						this.add('-start', target, 'typeadd', 'Rock', '[from] ability: Starter Dough');
					}
					this.add('-activate', target, 'ability: Starter Dough');
					this.add('-message', `${target.name} has been burnt to a crisp!`);
				}
				this.add('-immune', target, '[from] ability: Starter Dough');
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Starter Dough",
		rating: 4,
		num: 1062,
	},
	steelwings: {
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.slice) { return this.chainModify(1.5); } },
		onModifyMove(move, pokemon) {  if (move.flags?.wing) { move.flags.slice = 1; } },
		flags: {},
		name: "Steel Wings",
		rating: 3,
		num: 1063,
	},
	superconductor: {
		onModifySpe(spe, pokemon) { if (this.field.isWeather(['hail', 'snow', 'snowscape'])) { return this.chainModify(1.25); } },
		onTryHit(target, source, move) { if (this.field.isWeather(['hail', 'snow', 'snowscape']) && move.type === 'Electric') { this.add('-immune', target, '[from] ability: Superconducto');
			return null;
			}
		},
		onStart(pokemon) { if (this.field.isWeather(['hail', 'snow', 'snowscape'])) { pokemon.addVolatile('superconductoairborne'); } },
		onWeatherChange(target, source, sourceEffect) {
			if (this.field.isWeather(['hail', 'snow', 'snowscape'])) { target.addVolatile('superconductoairborne'); }
			else { target.removeVolatile('superconductoairborne'); }
		},
		condition: {
			noCopy: true,
			onStart(target) {
				this.add('-start', target, 'Superconducto');
				this.add('-message', `${target.name} became airborne!`);
			},
			onImmunity(type) { if (type === 'Ground') return false; },
			onEnd(target) { this.add('-end', target, 'Superconducto'); },
		},
		flags: {},
		name: "Superconductor",
		rating: 4,
		num: 1064,
	},
	steelgirder: {
		onBasePower(basePower, attacker, defender, move) { if (move.type === 'Steel') { return this.chainModify(1.5); } },
		onModifyMove(move, pokemon) {  if (move.flags?.contact) {
			move.flags.contact = 0;
			move.flags.weapon = 1;
			}
		},
		flags: {},
		name: "Steel Girder",
		rating: 3,
		num: 1065,
	},
	thorns: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) { if (this.checkMoveMakesContact(move, source, target, true)) { this.damage(source.baseMaxhp / 12, source, target); } },
		flags: {},
		name: "Thorns",
		rating: 2.5,
		num: 1066,
	},
	threeminded: {
		onPrepareHit(source, target, move) {
			if (move.category === 'Status' || move.multihit || move.flags['charge'] || move.flags['futuremove'] || move.spreadHit || move.isZ || move.isMax) return;
			if (move.flags?.bite || move.flags?.piercing) {
				move.multihit = 3;
				move.multihitType = 'betterthanone';
			}
		},
		onSourceBasePower(basePower, target, source, move) { if (move.multihitType === 'betterthanone') { return this.chainModify(0.5); } },
		onBeforeMovePriority: 11,
		onBeforeMove(pokemon, target, move) { if (pokemon.status === 'slp') { move.sleepUsable = true; } },
		flags: {},
		name: "Three Minded",
		rating: 3,
		num: 1067,
	},
	thunderhead: {
		onBasePower(basePower, attacker, defender, move) { if (move.type === 'Electric' && this.field.isWeather(['hail', 'snow', 'snowscape', 'raindance', 'primordialsea'])) { return this.chainModify(1.3); } },
		onImmunity(type, pokemon) { if (type === 'hail') return false; },
		flags: {},
		name: "Thunderhead",
		rating: 3,
		num: 1068,
	},
	thunderthighs: {
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.kick) { return this.chainModify(1.3); } },
		onDamagingHit(damage, target, source, move) { if (this.checkMoveMakesContact(move, source, target)) { if (this.randomChance(2, 10)) { source.trySetStatus('par', target); } } },
		onAfterMove(source, target, move) { if (move && this.checkMoveMakesContact(move, source, target)) { source.addVolatile('charge'); } },
		flags: {},
		name: "Thunder Thighs",
		rating: 3,
		num: 1069,
	},
	timebreak: {
		onStart(source) { this.field.addPseudoWeather('timebreak', source, source.ability); },
		onEnd(pokemon) { if (this.field.getPseudoWeather('timebreak')) { for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('timebreak')) { return; }
			}
			this.field.removePseudoWeather('timebreak');
			}
		},
		flags: {},
		name: "Time Break",
		rating: 5,
		num: 1070,
	},
	tippedthorns: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) { if (this.checkMoveMakesContact(move, source, target, true)) 
		{ this.damage(source.baseMaxhp / 16, source, target); } 
		{ if (this.randomChance(2, 10)) { source.trySetStatus('par', target); } }
		},
		flags: {},
		name: "TippedThorns",
		rating: 3,
		num: 1071,
	},
	toxicpollen: {
		onDamagingHit(damage, target, source, move) { if (this.randomChance(3, 10)) { source.trySetStatus('tox', target); } },
		flags: {},
		name: "Toxic Pollen",
		rating: 3,
		num: 1072,
	},
	toxicsurge: {
		onStart(source) { this.field.setTerrain('toxicterrain'); },
		flags: {},
		name: "Toxic Surge",
		rating: 4,
		num: 1073,
	},
	twominded: {
		onBeforeMovePriority: 11,
		onBeforeMove(pokemon, target, move) { if (pokemon.status === 'slp') { move.sleepUsable = true; } },
		flags: {},
		name: "Two Minded",
		rating: 3,
		num: 1067,
	},
	volvation: {
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.spin) { return this.chainModify(1.5); } },
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) { if (move.flags && (move.flags.bullet || move.flags.bite || move.flags.bomb || move.flags.claw || move.flags.explosive || move.flags.kick || move.flags.pierce || move.flags.punch || move.flags.slice)) { this.debug('Volvation weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) { if (move.flags && (move.flags.bullet || move.flags.bite || move.flags.bomb || move.flags.claw || move.flags.explosive || move.flags.kick || move.flags.pierce || move.flags.punch || move.flags.slice)) { this.debug('Volvation weaken');
				return this.chainModify(0.5);
			}
		},
		flags: {},
		name: "Volvation",
		rating: 3,
		num: 1074,
	},
	waterlogged: {
		onStart(source) { this.field.addPseudoWeather('swamp', source, source.ability); },
		flags: {},
		name: "Waterlogged",
		rating: 3.5,
		num: 1075,
	},
	webarmor: {
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) { if (!pokemon.webArmorBroken) { return this.chainModify(2); } },
		onDamagingHit(damage, target, source, move) { if (!target.webArmorBroken && (move.type === 'Fire' || move.flags?.slice)) {
				target.webArmorBroken = true;
				this.add('-activate', target, 'ability: Web Armor');
				this.add('-message', `${target.name}'s Web Armor was destroyed!`);
			}
			if (!target.webArmorBroken && this.checkMoveMakesContact(move, source, target)) { this.boost({ spe: -1 }, source, target, null, true); }
		},
		flags: { breakable: 1 },
		name: "Web Armor",
		rating: 4,
		num: 1076,
	},
	woodpillar: {
		onBasePower(basePower, attacker, defender, move) { if (move.type === 'Grass') { return this.chainModify(1.5); } },
		onModifyMove(move, pokemon) {  if (move.flags?.contact) {
			move.flags.contact = 0;
			move.flags.weapon = 1;
			}
		},
		flags: {},
		name: "Steel Girder",
		rating: 3,
		num: 1077,
	},



	// #region Aura Abilities
	craftergod: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) { this.debug('Crafter God ATK boost');
			return this.chainModify(1.2);
		},
		onModifySpe(spe, pokemon) { this.debug('Crafter God Speed boost');
			return this.chainModify(1.2);
		},
		onTryAddVolatile(status, pokemon) { if (status.id === 'flinch') { this.add('-immune', pokemon, '[from] ability: Crafter God');
			return null;
			}
		},
		onTryBoost(boost, target, source, effect) { if (effect.name === 'Intimidate' && boost.atk) {
			delete boost.atk;
			this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Crafter God', `[of] ${target}`);
			}
		},
		flags: {},
		name: "Crafter God",
		rating: 4,
		num: -1,
	},
	dragonsfury: {
		onBasePower(basePower, pokemon, target, move) { if (move.flags['bite'] || move.flags['breath'] || move.flags['claw']) { return this.chainModify(1.5); } },
		flags: {},
		name: "Dragon's Fury",
		rating: 3,
		num: -2,
	},
	esperwing: {
		onModifySpe(spe, pokemon) { return this.chainModify(2); },
		onModifyCritRatio(critRatio, pokemon, target, move) { return critRatio + 4; },
		onStart(pokemon) {
			const terrain = this.field.getTerrain();
			if (terrain && terrain.id === 'psychicterrain') {
				(terrain as any).boostedpsyparticle = true;
				this.add('-fieldactivate', 'Psychic Terrain particles boosted');
			}
		},
		flags: {},
		name: "Esper Wing",
		rating: 3,
		num: -3,
	},
	fellstinger: {
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags?.pierce) { this.debug('Fell Stinger pierce boost');
				return this.chainModify(2);
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.flags?.pierce && target.volatiles['protect']) { this.debug('Fell Stinger piercing through protect at half damage');
				return this.chainModify(0.5);
			}
		},
		onModifyMove(move, attacker, defender) { if (move.flags?.pierce) {
				move.pierce2 = false;
				move.pierce3 = false;
				move.pierce1 = true;
			}
		},
		flags: {},
		name: "Fell Stinger",
		rating: 4,
		num: -4,
	},
	giantslayer: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) { this.debug('Giant Slayer ATK boost');
			return this.chainModify(1.5);
		},
		onTryBoost(boost, target, source, effect) { if (effect.name === 'Intimidate' && boost.atk) {
			delete boost.atk;
			this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Giant Slayer', `[of] ${target}`);
			}
		},
		flags: {},
		name: "Giant Slayer",
		rating: 4,
		num: -5,
	},
	imperialbastion: {
		onModifyDefPriority: 5,
		onModifyDef(def, pokemon) { this.debug('Imperial Bastion DEF boost');
			return this.chainModify(1.5);
		},
		onTryBoost(boost, target, source, effect) { if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Imperial Bastion', `[of] ${target}`);
			}
		},
		flags: {},
		name: "Imperial Bastion",
		rating: 4,
		num: -6,
	},
	indomitablespirit: {
		onBasePower(basePower, attacker, defender, move) { if (move.flags?.aura || move.flags?.dance || move.flags?.heal || move.flags?.kick || move.flags?.punch || move.flags?.slice || move.flags?.sweep || move.flags?.throwing) { this.debug('Indomitable Spirit boost');
				return this.chainModify(1.3);
			}
		},
		onTryAddVolatile(status, pokemon) { if (status.id === 'flinch' || status.id === 'confusion') { this.add('-immune', pokemon, '[from] ability: Indomitable Spirit');
				return null;
			}
		},
		flags: {},
		name: "Indomitable Spirit",
		rating: 4.5,
		num: -7,
	},
	mentalsurge: {
		onStart(pokemon) {
			this.field.setTerrain('psychicterrain');
			const terrain = this.field.getTerrain();
			if (terrain && terrain.id === 'psychicterrain') {
				(terrain as any).boostedpsyparticle = true;
				this.add('-fieldactivate', 'Psychic Terrain particles boosted');
			}
		},
		flags: {},
		name: "Mental Surge",
		rating: 4.5,
		num: -8,
	},
	migraine: {
		onBeforeMovePriority: 2,
		onBeforeMove(pokemon) { if (this.randomChance(3, 10)) { this.add('cant', pokemon, 'ability: Migraine');
				this.damage(pokemon.baseMaxhp / 8);
				return false;
			}
		},
		flags: {},
		name: "Migraine",
		rating: 1,
		num: -9,
	},
	ragingbull: {
		onModifyMove(move, attacker, defender) { if (move.flags?.contact) { move.pierce3 = true; } },
		flags: {},
		name: "Raging Bull",
		rating: 3.5,
		num: -10,
	},
	tranquilspirit: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) { return this.chainModify(0.7); },
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) { return this.chainModify(0.7); },
		onBeforeMovePriority: 9,
		onBeforeMove(pokemon) { if (this.randomChance(3, 10)) {
			this.add('cant', pokemon, 'Tranquil Spirit');
			this.add('-message', `${pokemon.name} is lulled about and doesn't act!`);
			return false;
			}
		},
		flags: {},
		name: "Tranquil Spirit",
		rating: 1,
		num: -11,
	},
	weaponconjuration: {
		onModifyMove(move, attacker, defender) { if (move.flags?.contact) {
				move.flags.contact = 0;
				if (!move.flags.aura) move.flags.aura = 1;
				if (!move.flags.weapon) move.flags.weapon = 1;
			}
		},
		flags: {},
		name: "Weapon Conjuration",
		rating: 3.5,
		num: -12,
	},



	// #region Gen 3 Abilities
	arenatrap: {
		onFoeTrapPokemon(pokemon) {
			if (!pokemon.isAdjacent(this.effectState.target)) return;
			if (pokemon.isGrounded()) { pokemon.tryTrap(true); }
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectState.target;
			if (!source || !pokemon.isAdjacent(source)) return;
			if (pokemon.isGrounded(!pokemon.knownType)) { pokemon.maybeTrapped = true; } // Negate immunity if the type is unknown
		},
		flags: {},
		name: "Arena Trap",
		rating: 5,
		num: 71,
	},
	battlearmor: {
		onCriticalHit: false,
		flags: { breakable: 1 },
		name: "Battle Armor",
		rating: 1,
		num: 4,
	},
	blaze: { // Immune to damage under Rain
		onDamage(damage, target, source, effect) { if (target.hp > target.maxhp / 5 && ['raindance', 'primordialsea', 'sandstorm', 'turbulentwinds'].includes(target.battle.field.effectiveWeather())) {
				this.add('-ability', target, 'Blaze');
				this.add('-immune', target, '[from] ability: Blaze [Rain]');
				return false;
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) { if (attacker.hp > attacker.maxhp / 5 && move.type === 'Fire') { return this.chainModify(1.2);  } },
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) { if (attacker.hp > attacker.maxhp / 5 && move.type === 'Fire') { return this.chainModify(1.2);  } },
		flags: {},
		name: "Blaze",
		rating: 2,
		num: 66,
	},
	camouflage: {
		onSwitchIn(pokemon) {
			const weather = pokemon.effectiveWeather();
			const terrain = pokemon.battle.field.terrain;
			let primaryType = 'Normal';
			let secondaryType = null;
			switch (weather) { // Primary type based on weather
				case 'sunnyday':
				case 'desolateland':
					primaryType = 'Fire';
					break;
				case 'raindance':
				case 'primordialsea':
					primaryType = 'Water';
					break;
				case 'sandstorm':
					primaryType = 'Rock';
					break;
				case 'hail':
				case 'snowscape':
					primaryType = 'Ice';
					break;
				case 'turbulentwinds':
				case 'deltastream':
					primaryType = 'Flying';
					break;
			}
			switch (terrain) { // Secondary type based on terrain
				case 'grassy':
					secondaryType = 'Grass';
					break;
				case 'psychic':
					secondaryType = 'Psychic';
					break;
				case 'misty':
					secondaryType = 'Fairy';
					break;
				case 'electric':
					secondaryType = 'Electric';
					break;
				case 'toxic':
					secondaryType = 'Poison';
					break;
			}
			const newTypes = secondaryType ? [primaryType, secondaryType] : [primaryType];
			pokemon.setType(newTypes);
			this.add('-start', pokemon, 'typechange', newTypes.join('/'), '[from] ability: Camouflage');
		},
		flags: {},
		name: "Camouflage",
		rating: 2,
		num: 16,
	},
	chlorophyll: {
		onModifySpe(spe, pokemon) { if (["sunnyday", "desolateland"].includes(pokemon.effectiveWeather())) { return this.chainModify(2); } },
		onBasePower(basePower, attacker, defender, move) { if (["sunnyday", "desolateland"].includes(attacker.effectiveWeather()) && move.flags && move.flags.solar)  { return this.chainModify(1.2); }
		},
		flags: {},
		name: "Chlorophyll",
		rating: 3,
		num: 34,
	},
	clearbody: {
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			let i: BoostID;
			for (i in boost) { if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries && effect.id !== 'octolock') { this.add("-fail", target, "unboost", "[from] ability: Clear Body", `[of] ${target}`); }
		},
		flags: { breakable: 1 },
		name: "Clear Body",
		rating: 2,
		num: 29,
	},
	cloudnine: {
		onSwitchIn(pokemon) { // Cloud Nine does not activate when Skill Swapped or when Neutralizing Gas leaves the field
			this.add('-ability', pokemon, 'Cloud Nine');
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, pokemon);
		},
		onStart(pokemon) {
			pokemon.abilityState.ending = false; // Clear the ending flag
			this.eachEvent('WeatherChange', this.effect);
		},
		onEnd(pokemon) {
			pokemon.abilityState.ending = true;
			this.eachEvent('WeatherChange', this.effect);
		},
		suppressWeather: true,
		flags: {},
		name: "Cloud Nine",
		rating: 1.5,
		num: 13,
	},
	colorchange: {
		onAfterMoveSecondary(target, source, move) {
			if (!target.hp) return;
			const type = move.type;
			if (
				target.isActive && move.effectType === 'Move' && move.category !== 'Status' &&
				type !== '???' && !target.hasType(type)
			) {
				if (!target.setType(type)) return false;
				this.add('-start', target, 'typechange', type, '[from] ability: Color Change');
				if (target.side.active.length === 2 && target.position === 1) { // Curse Glitch
					const action = this.queue.willMove(target);
					if (action && action.move.id === 'curse') { action.targetLoc = -1; }
				}
			}
		},
		flags: {},
		name: "Color Change",
		rating: 0,
		num: 16,
	},
	compoundeyes: {
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('compoundeyes - enhancing accuracy');
			return this.chainModify([5325, 4096]);
		},
		flags: {},
		name: "Compound Eyes",
		rating: 3,
		num: 14,
	},
	cutecharm: {
		onDamagingHit(damage, target, source, move) { if (this.checkMoveMakesContact(move, source, target)) { if (this.randomChance(3, 10)) { source.addVolatile('attract', this.effectState.target); } } },
		flags: {},
		name: "Cute Charm",
		rating: 0.5,
		num: 56,
	},
	damp: {
		onAnyTryMove(target, source, effect) {
			if (effect && effect.flags && effect.flags.explosive) {
				this.attrLastMove('[still]');
				this.add('cant', this.effectState.target, 'ability: Damp', effect, `[of] ${target}`);
				return false;
			}
		},
		onAnyDamage(damage, target, source, effect) { if (effect && effect.name === 'Aftermath') { return false; } },
		onSetStatus(status, target, source, effect) { if (status.id === 'brn') { this.add('-immune', target, '[from] ability: Damp');
				return false;
			}
		},
		onAnyBasePower(basePower, user, target, move) { if ( (move.type === 'Fire') || (move.flags && (move.flags.bomb || move.flags.contact)) )  { return this.chainModify(0.5); }
		},
		flags: { breakable: 1 },
		name: "Damp",
		rating: 0.5,
		num: 6,
	},
	drizzle: {
		onStart(source) {
			if (source.species.id === 'kyogre' && source.item === 'blueorb') return;
			this.field.setWeather('raindance');
},
		flags: {},
		name: "Drizzle",
		rating: 4,
		num: 2,
	},
	drought: {
		onStart(source) {
			if (source.species.id === 'groudon' && source.item === 'redorb') return;
			this.field.setWeather('sunnyday');
		},
		flags: {},
		name: "Drought",
		rating: 4,
		num: 70,
	},
	earlybird: {
		onFractionalPriorityPriority: -2,
		onFractionalPriority(priority, pokemon, target, move) { // 10% chance to move first in priority bracket, 100% if asleep
		if (move && move.category === "Status" && (pokemon.ability1 === "myceliummight" || pokemon.ability2 === "myceliummight")) return;
		if (priority <= 0 && (pokemon.status === 'slp' || this.randomChance(1, 10))) { this.add('-activate', pokemon, 'ability: Early Bird');
			return 0.1;
		}
		return;
		},
		flags: {},
		name: "Early Bird",
		rating: 2.5,
		num: 48,
	},
	effectspore: {
		onDamagingHit(damage, target, source, move) { if (this.checkMoveMakesContact(move, source, target) && !source.status && source.runStatusImmunity('powder')) {
				if (this.randomChance(1, 5)) { source.trySetStatus('psn', target); } 
				else if (this.randomChance(1, 5)) { source.trySetStatus('drowsy', target); } 
				else if (this.randomChance(1, 5)) { source.trySetStatus('par', target); }
			}
		},
		flags: {},
		name: "Effect Spore",
		rating: 2,
		num: 27,
	},
	flamebody: {
		onDamagingHit(damage, target, source, move) { if (this.checkMoveMakesContact(move, source, target)) { if (this.randomChance(3, 10)) { source.trySetStatus('brn', target); } } },
		flags: {},
		name: "Flame Body",
		rating: 2,
		num: 49,
	},
	flashfire: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				move.accuracy = true;
				if (!target.addVolatile('flashfire')) { this.add('-immune', target, '[from] ability: Flash Fire'); }
				return null;
			}
		},
		onEnd(pokemon) { pokemon.removeVolatile('flashfire'); },
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(target) { this.add('-start', target, 'ability: Flash Fire'); },
			onModifyAtkPriority: 5,
			onModifyAtk(atk, attacker, defender, move) { if (move.type === 'Fire' && attacker.hasAbility('flashfire')) {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA(atk, attacker, defender, move) { if (move.type === 'Fire' && attacker.hasAbility('flashfire')) {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onEnd(target) { this.add('-end', target, 'ability: Flash Fire', '[silent]'); },
		},
		flags: { breakable: 1 },
		name: "Flash Fire",
		rating: 3.5,
		num: 18,
	},
	forecast: {
		onSwitchInPriority: -2,
		onStart(pokemon) { this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon); },
		onWeatherChange(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Castform' || pokemon.transformed) return;
			let forme = null;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				if (pokemon.species.id !== 'castformsunny') forme = 'Castform-Sunny';
				break;
			case 'raindance':
			case 'primordialsea':
				if (pokemon.species.id !== 'castformrainy') forme = 'Castform-Rainy';
				break;
			case 'hail':
			case 'snowscape':
				if (pokemon.species.id !== 'castformsnowy') forme = 'Castform-Snowy';
				break;
			default:
				if (pokemon.species.id !== 'castform') forme = 'Castform';
				break;
			}
			if (pokemon.isActive && forme) { pokemon.formeChange(forme, this.effect, false, '0', '[msg]'); }
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1 },
		name: "Forecast",
		rating: 2,
		num: 59,
	},
	guts: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) { if (pokemon.status) { return this.chainModify(1.5); } },
		flags: {},
		name: "Guts",
		rating: 3.5,
		num: 62,
	},
	hugepower: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk) { return this.chainModify(2); },
		flags: {},
		name: "Huge Power",
		rating: 5,
		num: 37,
	},
	hustle: { // This should be applied directly to the stat as opposed to chaining with the others
		onModifyAtkPriority: 5,
		onModifyAtk(atk) { return this.modify(atk, 1.5); },
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy, target, source, move) { if (move.category === 'Physical' && typeof accuracy === 'number') { return this.chainModify([3277, 4096]); } },
		flags: {},
		name: "Hustle",
		rating: 3.5,
		num: 55,
	},
	hypercutter: {
		onBasePower(basePower, attacker, defender, move) { if (move.flags && move.flags.claw) { return this.chainModify([5325, 4096]); } },
		// Prevent Attack from being lowered by any effect
		onTryBoost(boost, target, source, effect) { if (boost.atk && boost.atk < 0) {
				delete boost.atk;
				if (!(effect as ActiveMove).secondaries) { this.add("-fail", target, "unboost", "Attack", "[from] ability: Hyper Cutter", `[of] ${target}`); }
			}
		},
		flags: { breakable: 1 },
		name: "Hyper Cutter",
		rating: 2.5,
		num: 52,
	},
	illuminate: {
		// Boosts accuracy of all moves on field by 1.1x
		onModifyAccuracy(accuracy) { if (typeof accuracy === 'number') { return this.chainModify([4506, 4096]); } },
		onBasePower(basePower, attacker, defender, move) { if (move.flags && move.flags.light) { return this.chainModify(1.5); } },
		onSourceModifyDamage(damage, source, target, move) { if (move.type === 'Dark' || (move.flags && move.flags.shadow)) { return this.chainModify(0.5); } },
		onTrapPokemon(pokemon) { if (pokemon.hasAbility('shadowtag')) { return false; } },
		flags: { breakable: 1 },
		name: "Illuminate",
		rating: 3,
		num: 35,
	},
	immunity: {
		onUpdate(pokemon) { if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				this.add('-activate', pokemon, 'ability: Immunity');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'psn' && status.id !== 'tox') return;
			if ((effect as Move)?.status) { this.add('-immune', target, '[from] ability: Immunity'); }
			return false;
		},
		flags: { breakable: 1 },
		name: "Immunity",
		rating: 2,
		num: 17,
	},
	innerfocus: {
		onTryAddVolatile(status, pokemon) { if (status.id === 'flinch' || status.id === 'tripped') return null; },
		onTryBoost(boost, target, source, effect) { if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Inner Focus', `[of] ${target}`);
			}
		},
		onBasePower(basePower, attacker, defender, move) { if (attacker.hasAbility('innerfocus') && move.flags && move.flags.beam) { return this.chainModify([4915, 4096]);  } },
		flags: { breakable: 1 },
		name: "Inner Focus",
		rating: 1,
		num: 39,
	},
	insomnia: {
		onUpdate(pokemon) { if (pokemon.status === 'slp') {
				this.add('-activate', pokemon, 'ability: Insomnia');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'slp') return;
			if ((effect as Move)?.status) { this.add('-immune', target, '[from] ability: Insomnia'); }
			return false;
		},
		onTryAddVolatile(status, target) { if (status.id === 'yawn') {
				this.add('-immune', target, '[from] ability: Insomnia');
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Insomnia",
		rating: 1.5,
		num: 15,
	},
	intimidate: {
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) { if (!activated) {
					this.add('-ability', pokemon, 'Intimidate', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) { this.add('-immune', target); } 
				else { this.boost({ atk: -1 }, target, pokemon, null, true); }
			}
		},
		flags: {},
		name: "Intimidate",
		rating: 3.5,
		num: 22,
	},
	keeneye: {
		onModifyAccuracy(accuracy, target, source, move) { if (target.hasAbility('keeneye')) { return this.chainModify(1.2); } },
		onTryHitPriority: 1,
		onTryHit(target, source, move) { // Block priority moves targeting the user and copy them
			if (target.hasAbility('keeneye') && move.priority > 0 && target !== source) {
				this.add('-ability', target, 'Keen Eye');
				this.add('-immune', target, '[from] ability: Keen Eye');
				target.addVolatile('keeneyecopy', source);
				target.volatiles['keeneyecopy'].move = move.id;
				target.volatiles['keeneyecopy'].source = source;
				return null;
			}
		},
		onAfterMove(pokemon, target, move) {
			if (pokemon.volatiles['keeneyecopy']) {
				const copiedMove = pokemon.volatiles['keeneyecopy'].move;
				const source = pokemon.volatiles['keeneyecopy'].source;
				pokemon.removeVolatile('keeneyecopy');
				const moveObj = this.dex.getActiveMove(copiedMove);
				pokemon.useMove(moveObj);
			}
		},
		condition: { duration: 0, },
		flags: { breakable: 1 },
		name: "Keen Eye",
		rating: 3.5,
		num: 51,
	},
	levitate: { // airborneness implemented in sim/pokemon.js:Pokemon#isGrounded
		flags: { breakable: 1 },
		name: "Levitate",
		rating: 3.5,
		num: 26,
	},
	lightningrod: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') { if (!this.boost({ spa: 1 })) { this.add('-immune', target, '[from] ability: Lightning Rod'); }
				return null; }
		},
		onAnyRedirectTarget(target, source, source2, move) {
			if (move.type !== 'Electric' || move.flags['pledgecombo']) return;
			const redirectTarget = ['randomNormal', 'adjacentFoe'].includes(move.target) ? 'normal' : move.target;
			if (this.validTarget(this.effectState.target, source, redirectTarget)) {
				if (move.smartTarget) move.smartTarget = false;
				if (this.effectState.target !== target) { this.add('-activate', this.effectState.target, 'ability: Lightning Rod'); }
				return this.effectState.target;
			}
		},
		flags: { breakable: 1 },
		name: "Lightning Rod",
		rating: 3,
		num: 31,
	},
	limber: {
		onUpdate(pokemon) {
			if (pokemon.status === 'par') { this.add('-activate', pokemon, 'ability: Limber');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'par') return;
			if ((effect as Move)?.status) { this.add('-immune', target, '[from] ability: Limber'); }
			return false;
		},
		onBoost(boost, target, source, effect) { if (boost.spe && boost.spe < 0) {
				boost.spe = 0;
				this.add('-fail', target, 'unboost', 'Speed', '[from] ability: Limber');
			}
		},
		flags: { breakable: 1 },
		name: "Limber",
		rating: 2,
		num: 7,
	},
	liquidooze: {
		onSourceTryHeal(damage, target, source, effect) {
			this.debug(`Heal is occurring: ${target} <- ${source} :: ${effect.id}`);
			const canOoze = ['drain', 'leechseed', 'strengthsap'];
			if (canOoze.includes(effect.id)) { this.damage(damage);
				return 0;
			}
		},
		flags: {},
		name: "Liquid Ooze",
		rating: 2.5,
		num: 64,
	},
	magmaarmor: {
		// Prevents freeze, resists Fire/Ice, immune to Water, DEF+1 when hit by Water, 10% burn on contact
		onUpdate(pokemon) {
			if (pokemon.status === 'frz') { this.add('-activate', pokemon, 'ability: Magma Armor');
				pokemon.cureStatus();
			}
		},
		onImmunity(type, pokemon) { if (type === 'frz' || type === 'Water') return false; },
		onSourceModifyDamage(damage, source, target, move) { if (move.type === 'Fire' || move.type === 'Ice') { this.debug('Magma Armor resistance to Fire/Ice');
				return this.chainModify(0.5);
			}
			if (move.type === 'Water') { this.debug('Magma Armor immunity to Water');
				return this.chainModify(0);
			}
		},
		onDamagingHit(damage, target, source, move) { 
			if (move.type === 'Water') { this.boost({def: 1}, target, target, null, true); }
			if (move.flags && move.flags.contact && this.randomChance(1, 10)) { source.trySetStatus('brn', target); }
		},
		flags: { breakable: 1 },
		name: "Magma Armor",
		rating: 5,
		num: 40,
	},
	magnetpull: {
		onFoeTrapPokemon(pokemon) { if (pokemon.hasType('Steel') && pokemon.isAdjacent(this.effectState.target)) { pokemon.tryTrap(true); } },
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectState.target;
			if (!source || !pokemon.isAdjacent(source)) return;
			if (!pokemon.knownType || pokemon.hasType('Steel')) { pokemon.maybeTrapped = true; }
		},
		// Electric type pokemon are locked onto this Pokémon
		onRedirectTarget(target, source, source2, move) { if (move.type === 'Electric' && target !== this.effectState.target && this.effectState.target.isAdjacent(target)) { return this.effectState.target; }
			// Steel-type moves are locked onto this Pokémon
			if (move.type === 'Steel' && target !== this.effectState.target && this.effectState.target.isAdjacent(target)) { return this.effectState.target; }
		},
		onFoeBeforeMove(pokemon, target, move) { if (pokemon.hasType('Steel') && target !== this.effectState.target && this.effectState.target.isAdjacent(pokemon)) { return this.effectState.target; } },
		flags: {},
		name: "Magnet Pull",
		rating: 4,
		num: 42,
	},
	magneticpulse: {
		onDamagingHit(damage, target, source, move) {
			if (move.flags?.contact && source.hasType('Electric')) {
				source.setType(source.getTypes(true).map(type => type === 'Electric' ? null : type).filter(Boolean));
				this.add('-start', source, 'typechange', source.getTypes().join('/'), '[from] ability: Magnetic Pulse', '[of] ' + target);
			}
		},
		onSourceModifyDamage(damage, source, target, move) { if (move.type === 'Electric') { this.debug('Magnetic Pulse resistance to Electric');
				return this.chainModify(0.5);
			}
		},
		onTrapImmunity(trapped, target, trapper) { if (trapper.hasAbility('magnetpull')) { return false; } },
		flags: {},
		name: "Magnetic Pulse",
		rating: 3.5,
		num: 13006,
	},
	marvelscale: {
		onSourceModifyDamage(damage, source, target, move) { if (move.flags && move.flags.light) { this.debug('Marvel Scale resistance to light');
				return this.chainModify(0.5);
			}
		},
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) { if (pokemon.status) return this.chainModify(1.5); },
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) { if (pokemon.status) return this.chainModify(1.5); },
		onModifySecondaries(secondaries, target, source, move) { if (target.status) { this.debug('Marvel Scale (Shield Dust logic) prevent secondary');
				return secondaries.filter(effect => !!effect.self);
			}
		},
		flags: { breakable: 1 },
		name: "Marvel Scale",
		rating: 3,
		num: 63,
	},
	minus: {
		// If ally has Plus/Minus, 1.5x SpA, 1.3x Beam moves, ignore redirection
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) { for (const allyActive of pokemon.allies()) { if (allyActive.hasAbility(['minus', 'plus'])) {
					return this.chainModify(1.5);
				}
			}
		},
		onBasePower(basePower, attacker, defender, move) { for (const allyActive of attacker.allies()) { if (allyActive.hasAbility(['minus', 'plus'])) { if (move.flags && move.flags.beam) { return this.chainModify(1.3); } } } },
		onRedirectTarget(target, source, source2, move) { for (const allyActive of source.allies()) { if (allyActive.hasAbility(['minus', 'plus'])) { return target; } } },
		flags: {},
		name: "Minus",
		rating: 1,
		num: 58,
	},
	naturalcure: {
		onCheckShow(pokemon) {
			if (pokemon.side.active.length === 1) return;
			if (pokemon.showCure === true || pokemon.showCure === false) return;
			const cureList = [];
			let noCureCount = 0;
			for (const curPoke of pokemon.side.active) {
				if (!curPoke?.status) { continue; } // this.add('-message', "" + curPoke + " skipped: not statused or doesn't exist");
				if (curPoke.showCure) { continue; } // this.add('-message', "" + curPoke + " skipped: Natural Cure already known");
				const species = curPoke.species;
				if (!Object.values(species.abilities).includes('Natural Cure')) { continue; } // this.add('-message', "" + curPoke + " skipped: no Natural Cure");
				if (!species.abilities['1'] && !species.abilities['H']) { continue; } // this.add('-message', "" + curPoke + " skipped: only one ability");
				if (curPoke !== pokemon && !this.queue.willSwitch(curPoke)) { continue; } // this.add('-message', "" + curPoke + " skipped: not switching");
				if (curPoke.hasAbility('naturalcure')) { cureList.push(curPoke); } // this.add('-message', "" + curPoke + " confirmed: could be Natural Cure (and is)");
				else { noCureCount++; } // this.add('-message', "" + curPoke + " confirmed: could be Natural Cure (but isn't)");
			}
			if (!cureList.length || !noCureCount) { for (const pkmn of cureList) { pkmn.showCure = true; } } // It's possible to know what pokemon were cured
			else { // It's not possible to know what pokemon were cured. Unlike a -hint, this is real information that battlers need, so we use a -message
				this.add('-message', `(${cureList.length} of ${pokemon.side.name}'s pokemon ${cureList.length === 1 ? "was" : "were"} cured by Natural Cure.)`);
				for (const pkmn of cureList) { pkmn.showCure = false; }
			}
		},
		onSwitchOut(pokemon) {
			if (!pokemon.status) return;
			// if pokemon.showCure is undefined, it was skipped because its ability is known
			if (pokemon.showCure === undefined) pokemon.showCure = true;
			if (pokemon.showCure) this.add('-curestatus', pokemon, pokemon.status, '[from] ability: Natural Cure');
			pokemon.clearStatus();
			// only reset .showCure if it's false (once you know a Pokemon has Natural Cure, its cures are always known)
			if (!pokemon.showCure) pokemon.showCure = undefined;
		},
		flags: {},
		name: "Natural Cure",
		rating: 2.5,
		num: 30,
	},
	oblivious: {
		onUpdate(pokemon) {
			if (pokemon.volatiles['attract']) {
				this.add('-activate', pokemon, 'ability: Oblivious');
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] ability: Oblivious');
			}
			if (pokemon.volatiles['taunt']) {
				this.add('-activate', pokemon, 'ability: Oblivious');
				pokemon.removeVolatile('taunt');
			}
		},
		onImmunity(type, pokemon) { if (type === 'attract') return false; },
		onTryHit(pokemon, target, move) {
			if (move.id === 'attract' || move.id === 'captivate' || move.id === 'taunt') { this.add('-immune', pokemon, '[from] ability: Oblivious');
				return null;
			}
			if (move.id === 'followme' || move.id === 'ragepowder') { this.add('-immune', pokemon, '[from] ability: Oblivious');
				return null;
			}
		},
		onTrapPrevention(pokemon) { return false; },
		onTryBoost(boost, target, source, effect) { if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Oblivious', `[of] ${target}`);
			}
		},
		flags: { breakable: 1 },
		name: "Oblivious",
		rating: 2.5,
		num: 12,
	},
	overgrow: {
		onBasePowerPriority: 6,
		onBasePower(basePower, attacker, defender, move) {
			if (move.name && move.name.includes('Solar')) { this.debug('Overgrow Solar boost');
				return this.chainModify([1200, 1000]);
			}
			if (move.id === 'vinewhip') { this.debug('Overgrow Vine Whip boost');
				return this.chainModify(2);
			}
		},
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual(pokemon) { if (this.field.isTerrain('grassy') && pokemon.isGrounded() && !pokemon.isSemiInvulnerable()) { this.heal(pokemon.baseMaxhp / 8, pokemon, pokemon); } },
		flags: {},
		name: "Overgrow",
		rating: 3.5,
		num: 65,
	},
	owntempo: {
		onUpdate(pokemon) { if (pokemon.volatiles['confusion']) {
				this.add('-activate', pokemon, 'ability: Own Tempo');
				pokemon.removeVolatile('confusion');
			}
		},
		onTryAddVolatile(status, pokemon) { if (status.id === 'confusion') return null; },
		onHit(target, source, move) {
			if (move?.volatileStatus === 'confusion') { this.add('-immune', target, 'confusion', '[from] ability: Own Tempo'); }
			if (move?.priority && move.priority > 0) { this.add('-immune', target, '[from] ability: Own Tempo');
				return null;
			}
		},
		onTryBoost(boost, target, source, effect) { if (boost) { // Block all stat stage changes (positive and negative)
				let i: BoostID;
				for (i in boost) { delete boost[i]; }
				this.add('-fail', target, 'unboost', '[from] ability: Own Tempo', `[of] ${target}`);
			}
		},
		flags: { breakable: 1 },
		name: "Own Tempo",
		rating: 3.5,
		num: 20,
	},
	pickup: {
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (pokemon.item) return;
			const pickupTargets = this.getAllActive().filter(target => ( target.lastItem && target.usedItemThisTurn && pokemon.isAdjacent(target) ));
			if (!pickupTargets.length) return;
			const randomTarget = this.sample(pickupTargets);
			const item = randomTarget.lastItem;
			randomTarget.lastItem = '';
			this.add('-item', pokemon, this.dex.items.get(item), '[from] ability: Pickup');
			pokemon.setItem(item);
		},
		flags: {},
		name: "Pickup",
		rating: 0.5,
		num: 53,
	},
	plus: {
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) { for (const allyActive of pokemon.allies()) { if (allyActive.hasAbility(['minus', 'plus'])) { return this.chainModify(1.5); } } },
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) { if (move.name && move.name.includes('Pulse')) { this.debug('Plus Pulse boost');
				return this.chainModify([1300, 1000]);
			}
		},
		// Redirect Electric moves and heal 25% MaxHP
		onTryHit(target, source, move) { if (target !== source && move.type === 'Electric') { if (!this.heal(target.baseMaxhp / 4)) { this.add('-immune', target, '[from] ability: Plus'); }
				return null;
			}
		},
		onAnyRedirectTarget(target, source, source2, move) { // Redirect Electric Type moves to the user
			if (move.type !== 'Electric' || move.flags['pledgecombo']) return;
			const redirectTarget = ['randomNormal', 'adjacentFoe'].includes(move.target) ? 'normal' : move.target;
			if (this.validTarget(this.effectState.target, source, redirectTarget)) {
				if (move.smartTarget) move.smartTarget = false;
				if (this.effectState.target !== target) { this.add('-activate', this.effectState.target, 'ability: Plus'); }
				return this.effectState.target;
			}
		},
		flags: { breakable: 1 },
		name: "Plus",
		rating: 3.5,
		num: 57,
	},
	poisonpoint: {
		onDamagingHit(damage, target, source, move) { if (this.checkMoveMakesContact(move, source, target)) { if (this.randomChance(3, 10)) { source.trySetStatus('psn', target); } } },
		flags: {},
		name: "Poison Point",
		rating: 1.5,
		num: 38,
	},
	pressure: {
		onStart(pokemon) { this.add('-ability', pokemon, 'Pressure'); },
		onDeductPP(target, source) { if (target.isAlly(source)) return;
			return 1;
		},
		flags: {},
		name: "Pressure",
		rating: 2.5,
		num: 46,
	},
	purepower: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk) { return this.chainModify(2); },
		flags: {},
		name: "Pure Power",
		rating: 5,
		num: 74,
	},
	raindish: {
		onWeather(target, source, effect) {
			if (target.hasItem('utilityumbrella')) return;
			if (effect.id === 'raindance' || effect.id === 'primordialsea') { this.heal(target.baseMaxhp / 16); }
		},
		flags: {},
		name: "Rain Dish",
		rating: 1.5,
		num: 44,
	},
	rockhead: {
		onTryAddVolatile(status, pokemon) { if (status.id === 'flinch') { this.add('-immune', pokemon, '[from] ability: Rock Head');
				return null;
			}
		},
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) { if (move.flags && move.flags.crush) { this.debug('Rock Head crush resist');
			return this.chainModify(0.5);
			}
		},
		onDamage(damage, target, source, effect) { if (effect.id === 'recoil') {
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') return null;
			}
		},
		flags: {},
		name: "Rock Head",
		rating: 3,
		num: 69,
	},
	roughskin: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) { if (this.checkMoveMakesContact(move, source, target, true)) { this.damage(source.baseMaxhp / 8, source, target); } },
		flags: {},
		name: "Rough Skin",
		rating: 2.5,
		num: 24,
	},
	runaway: {
		onTrapPokemonPriority: -10,
		onTrapPokemon(pokemon) { pokemon.trapped = false; },
		onMaybeTrapPokemonPriority: -10,
		onMaybeTrapPokemon(pokemon) { pokemon.maybeTrapped = false; },
		flags: {},
		name: "Run Away",
		rating: 0,
		num: 50,
	},
	sandstream: {
		onImmunity(type, pokemon) { if (type === 'sandstorm') return false; },
		onStart(source) { this.field.setWeather('sandstorm'); },
		flags: {},
		name: "Sand Stream",
		rating: 4,
		num: 45,
	},
	sandveil: {
		onImmunity(type, pokemon) { if (type === 'sandstorm') return false; },
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (this.field.isWeather('sandstorm')) { this.debug('Sand Veil - boosting DEF');
				return this.chainModify([1200, 1000]);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) { if (this.field.isWeather('sandstorm')) { this.debug('Sand Veil - boosting SpDEF');
				return this.chainModify([1200, 1000]);
			}
		},
		flags: { breakable: 1 },
		name: "Sand Veil",
		rating: 1.5,
		num: 8,
	},
	serenegrace: {
		onModifyMovePriority: -2,
		onModifyMove(move) {
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) { if (secondary.chance) secondary.chance *= 2; }
			}
			if (move.self?.chance) move.self.chance *= 2;
		},
		flags: {},
		name: "Serene Grace",
		rating: 3.5,
		num: 32,
	},
	shadowtag: {
		onFoeDisableMove(pokemon) {
			// Prevent trapped foes from using Shadow moves
			if (pokemon.trapped) { for (const moveSlot of pokemon.moveSlots) { const move = this.dex.moves.get(moveSlot.id);
				if (move.flags && move.flags.shadow) {
					moveSlot.disabled = true;
					moveSlot.disabledSource = 'shadowtag';
					}
				}
			}
		},
		onFoeTrapPokemon(pokemon) { if (!pokemon.hasAbility('shadowtag') && pokemon.isAdjacent(this.effectState.target)) { pokemon.tryTrap(true); } },
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectState.target;
			if (!source || !pokemon.isAdjacent(source)) return;
			if (!pokemon.hasAbility('shadowtag')) { pokemon.maybeTrapped = true; }
		},
		flags: {},
		name: "Shadow Tag",
		rating: 5,
		num: 23,
	},
	shedskin: {
		onTrapPokemonPriority: -10,
		onTrapPokemon(pokemon) { pokemon.trapped = false; },
		onMaybeTrapPokemonPriority: -10,
		onMaybeTrapPokemon(pokemon) { pokemon.maybeTrapped = false; },
		onResidualOrder: 5,
		onResidualSubOrder: 3,
		onResidual(pokemon) {
			if (pokemon.hp && pokemon.status && this.randomChance(33, 100)) {
				this.debug('shed skin');
				this.add('-activate', pokemon, 'ability: Shed Skin');
				pokemon.cureStatus();
			}
		},
		flags: {},
		name: "Shed Skin",
		rating: 3.5,
		num: 61,
	},
	shellarmor: {
		onCriticalHit: false,
		flags: { breakable: 1 },
		name: "Shell Armor",
		rating: 1,
		num: 75,
	},
	shielddust: {
		onModifySecondaries(secondaries) { this.debug('Shield Dust prevent secondary');
			return secondaries.filter(effect => !!effect.self);
		},
		flags: { breakable: 1 },
		name: "Shield Dust",
		rating: 2,
		num: 19,
	},
	soundproof: {
		onTryHit(target, source, move) { if (target !== source && move.flags['sound']) { this.add('-immune', target, '[from] ability: Soundproof');
			return null;
			}
		},
		onAllyTryHitSide(target, source, move) { if (move.flags['sound']) { this.add('-immune', this.effectState.target, '[from] ability: Soundproof'); } },
		flags: { breakable: 1 },
		name: "Soundproof",
		rating: 2,
		num: 43,
	},
	speedboost: {
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) { if (pokemon.activeTurns) { this.boost({ spe: 1 }); } },
		flags: {},
		name: "Speed Boost",
		rating: 4.5,
		num: 3,
	},
	static: {
		onDamagingHit(damage, target, source, move) { if (this.checkMoveMakesContact(move, source, target)) { if (this.randomChance(3, 10)) { source.trySetStatus('par', target); } } },
		flags: {},
		name: "Static",
		rating: 2,
		num: 9,
	},
	stench: {
		onModifyMovePriority: -1,
		onModifyMove(move) { if (move.category !== "Status") {
				if (!move.secondaries) move.secondaries = [];
				for (const secondary of move.secondaries) { if (secondary.volatileStatus === 'flinch') return; }
				move.secondaries.push({
					chance: 10,
					volatileStatus: 'flinch',
				});
			}
		},
		onBeforeMove(pokemon, target, move) {
			if (move.id === 'aromaticmist' || move.id === 'aromatherapy' || move.id === 'sweetscent') {
				this.add('cant', pokemon, 'ability: Stench', move);
				this.add('-message', `The stench prevents the use of ${move.name}!`);
				return false;
			}
		},
		onFoeSuppressAbility(ability) { if (ability.id === 'aromaveil' || ability.id === 'lingeringaroma' || ability.id === 'sweetveil' || ability.id === 'supersweetsyrup') { return true; } },
		flags: {},
		name: "Stench",
		rating: 0.5,
		num: 1,
	},
	stickyhold: {
		onTakeItem(item, pokemon, source) {
			if (!this.activeMove) throw new Error("Battle.activeMove is null");
			if (!pokemon.hp || pokemon.item === 'stickybarb') return;
			if ((source && source !== pokemon) || this.activeMove.id === 'knockoff') { this.add('-activate', pokemon, 'ability: Sticky Hold');
				return false;
			}
		},
		flags: { breakable: 1 },
		name: "Sticky Hold",
		rating: 1.5,
		num: 60,
	},
	sturdy: {
		onTryHit(pokemon, target, move) { if (move.ohko) { this.add('-immune', pokemon, '[from] ability: Sturdy');
				return null;
			}
		},
		onDamagePriority: -30,
		onDamage(damage, target, source, effect) { if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') { this.add('-ability', target, 'Sturdy');
				return target.hp - 1;
			}
		},
		flags: { breakable: 1 },
		name: "Sturdy",
		rating: 3,
		num: 5,
	},
	suctioncups: {
		onDragOutPriority: 1,
		onDragOut(pokemon) { this.add('-activate', pokemon, 'ability: Suction Cups');
			return null;
		},
		onTakeItem(item, pokemon, source) { if (source && source !== pokemon) { this.add('-activate', pokemon, 'ability: Suction Cups');
				return false;
			}
		},
		flags: { breakable: 1 },
		name: "Suction Cups",
		rating: 1,
		num: 21,
	},
	swarm: {
		onAllyAfterMove(source, target, move) {
			if (!this.effectState.target || this.effectState.target.fainted) return;
			if (source === this.effectState.target) return; // Don't trigger on own moves
			if (!target || target.fainted || !target.isActive) return;
			if (move.category === 'Status') return;
			let swarmTarget = target; // Determine the target for the follow-up attack
			if (move.target === 'allAdjacentFoes' || move.target === 'allAdjacent' || move.target === 'allNearFoes') { // For spread moves, choose a random foe
				const possibleTargets = this.effectState.target.foes().filter((foe: any) => foe.isAdjacent(this.effectState.target) && !foe.fainted);
				if (possibleTargets.length) { swarmTarget = this.sample(possibleTargets); } 
				else { return; }
			}
			const swarmMove = {
				basePower: 30,
				type: 'Bug',
				category: 'Physical',
				flags: { contact: 1, protect: 1 },
				willCrit: false,
				ignoreAbility: false,
			};
			this.add('-ability', this.effectState.target, 'Swarm');
			this.actions.tryMoveHit(swarmTarget, this.effectState.target, swarmMove);
		},
		flags: {},
		name: "Swarm",
		rating: 2,
		num: 68,
	},
	swiftswim: {
		onModifySpe(spe, pokemon) { if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) { return this.chainModify(2); } },
		flags: {},
		name: "Swift Swim",
		rating: 3,
		num: 33,
	},
	synchronize: {
		onAfterSetStatus(status, target, source, effect) {
			if (!source || source === target) return;
			if (effect && effect.id === 'toxicspikes') return;
			if (status.id === 'slp' || status.id === 'frz' || status.id === 'aura') return;
			this.add('-activate', target, 'ability: Synchronize');
			// Hack to make status-prevention abilities think Synchronize is a status move and show messages when activating against it.
			source.trySetStatus(status, target, { status: status.id, id: 'synchronize' } as Effect);
		},
		flags: {},
		name: "Synchronize",
		rating: 2,
		num: 28,
	},
	thickfat: {
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) { if (move.type === 'Ice' || move.type === 'Fire' || (move.flags && move.flags.punch)) { this.debug('Thick Fat weaken'); 
			return this.chainModify(0.5); 
			} 
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) { if (move.type === 'Ice' || move.type === 'Fire' || (move.flags && move.flags.punch)) { this.debug('Thick Fat weaken');
			return this.chainModify(0.5);
			}
		},
		flags: { breakable: 1 },
		name: "Thick Fat",
		rating: 3.5,
		num: 47,
	},
	torrent: {
		onImmunity(type, pokemon) { if (type === 'turbulentwinds') return false; },
		onStart(source) { this.field.setWeather('turbulentwinds'); },
		flags: {},
		name: "Torrent",
		rating: 2,
		num: 67,
	},
	trace: { 
		onStart(pokemon) { // interaction with No Ability is complicated: https://www.smogon.com/forums/threads/pokemon-sun-moon-battle-mechanics-research.3586701/page-76#post-7790209
			this.effectState.seek = true;
			if (pokemon.adjacentFoes().some(foeActive => foeActive.ability1 === 'noability')) { this.effectState.seek = false; }
			// interaction with Ability Shield is similar to No Ability
			if (pokemon.hasItem('Ability Shield')) {
				this.add('-block', pokemon, 'item: Ability Shield');
				this.effectState.seek = false;
			}
			if (this.effectState.seek) { this.singleEvent('Update', this.effect, this.effectState, pokemon); }
		},
		onUpdate(pokemon) {
			if (!this.effectState.seek) return;
			const possibleTargets = pokemon.adjacentFoes().filter( target => !target.getAbility(1).flags['notrace'] && target.ability1 !== 'noability' );
			if (!possibleTargets.length) return;
			const target = this.sample(possibleTargets);
			const ability = target.getAbility(1); // Always copy from slot 1
			// Determine which slot Trace is in
			const traceSlot = pokemon.ability1 === 'trace' ? 1 : 2;
			pokemon.setAbility(ability, target, null, false, false, traceSlot);
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1 },
		name: "Trace",
		rating: 2.5,
		num: 36,
	},
	truant: {
		onStart(pokemon) {
			pokemon.removeVolatile('truant');
			if (pokemon.activeTurns && (pokemon.moveThisTurnResult !== undefined || !this.queue.willMove(pokemon))) { pokemon.addVolatile('truant'); }
		},
		onBeforeMovePriority: 9,
		onBeforeMove(pokemon) { if (pokemon.removeVolatile('truant')) { this.add('cant', pokemon, 'ability: Truant');
			return false;
			}
			pokemon.addVolatile('truant');
		},
		onModifyMove(move) {
			delete move.flags['protect'];
			move.pierce1 = true;
		},
		condition: {},
		flags: {},
		name: "Truant",
		rating: -1,
		num: 54,
	},
	vitalspirit: {
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) { if (move.flags && move.flags.aura) { return this.chainModify(1.5); }},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'drowsy') return;
			if ((effect as Move)?.status) { this.add('-immune', target, '[from] ability: Vital Spirit'); }
			return false;
		},
		onTryAddVolatile(status, target) { if (status.id === 'drowsy') { this.add('-immune', target, '[from] ability: Vital Spirit');
				return null;
			}
		},
		onBeforeMove(pokemon) { if (pokemon.status === 'slp') { this.add('-activate', pokemon, 'ability: Vital Spirit');
			pokemon.cureStatus();
			}
		},
		flags: { breakable: 1 },
		name: "Vital Spirit",
		rating: 1.5,
		num: 72,
	},
	voltabsorb: {
		onTryHit(target, source, move) { if (target !== source && move.type === 'Electric') { if (!this.heal(target.baseMaxhp / 4)) { this.add('-immune', target, '[from] ability: Volt Absorb'); }
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Volt Absorb",
		rating: 3.5,
		num: 10,
	},
	waterabsorb: {
		onTryHit(target, source, move) { if (target !== source && move.type === 'Water') { if (!this.heal(target.baseMaxhp / 4)) { this.add('-immune', target, '[from] ability: Water Absorb'); }
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Water Absorb",
		rating: 3.5,
		num: 11,
	},
	waterveil: {
		onUpdate(pokemon) { if (pokemon.status === 'brn') { this.add('-activate', pokemon, 'ability: Water Veil');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if ((effect as Move)?.status) { this.add('-immune', target, '[from] ability: Water Veil'); }
			return false;
		},
		flags: { breakable: 1 },
		name: "Water Veil",
		rating: 2,
		num: 41,
	},
	whitesmoke: {
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			let i: BoostID;
			for (i in boost) { if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries && effect.id !== 'octolock') { this.add("-fail", target, "unboost", "[from] ability: White Smoke", `[of] ${target}`); }
		},
		flags: { breakable: 1 },
		name: "White Smoke",
		rating: 2,
		num: 73,
	},
	wonderguard: {
		onTryHit(target, source, move) {
			if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle') return;
			if (move.id === 'skydrop' && !source.volatiles['skydrop']) return;
			this.debug('Wonder Guard immunity: ' + move.id);
			if (target.runEffectiveness(move) <= 0 || !target.runImmunity(move)) {
				if (move.smartTarget) { move.smartTarget = false; } 
				else {  this.add('-immune', target, '[from] ability: Wonder Guard'); }
				return null;
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, failskillswap: 1, breakable: 1 },
		name: "Wonder Guard",
		rating: 5,
		num: 25,
	},



	// #region Gen 4 Abilities
	adaptability: {
		onModifySTAB(stab, source, target, move) { if (move.forceSTAB || source.hasType(move.type)) { return stab * (4/3);  } },
		flags: {},
		name: "Adaptability",
		rating: 4,
		num: 91,
	},
	aftermath: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (!target.hp) { // When fainting from a damaging move, deal 1/4 of own MaxHP to all adjacent pokemon as typeless explosive
				const explosionDamage = Math.max(1, Math.floor(target.maxhp / 4));
				this.add('-activate', target, 'ability: Aftermath');
				for (const adjacent of target.adjacentFoes()) { this.damage(explosionDamage, adjacent, target, {id: 'aftermath', effectType: 'Ability', flags: { explosive: 1 }, isExternal: true}); }
				for (const adjacent of target.adjacentAllies()) { this.damage(explosionDamage, adjacent, target, {id: 'aftermath', effectType: 'Ability', flags: { explosive: 1 }, isExternal: true}); }
			}
		},
		flags: {notransform: 1},
		name: "Aftermath",
		rating: 2,
		num: 106,
	},
	airlock: {
		onSwitchIn(pokemon) { // Air Lock does not activate when Skill Swapped or when Neutralizing Gas leaves the field
			this.add('-ability', pokemon, 'Air Lock');
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, pokemon);
		},
		onStart(pokemon) {
			pokemon.abilityState.ending = false; // Clear the ending flag
			this.eachEvent('WeatherChange', this.effect);
		},
		onEnd(pokemon) {
			pokemon.abilityState.ending = true;
			this.eachEvent('WeatherChange', this.effect);
		},
		suppressWeather: true,
		flags: {},
		name: "Air Lock",
		rating: 1.5,
		num: 76,
	},
	angerpoint: {
		onHit(target, source, move) {
			if (!target.hp) return;
			if (move?.effectType === 'Move' && target.getMoveHitData(move).crit) { this.boost({atk: 3}, target, target); }
		},
		onMoveFail(target, source, move) {
			if (!target.hp) return;
			this.boost({atk: 3}, target, target);
		},
		onAfterMove(pokemon, target, move) {
			if (!pokemon.hp) return;
			if (move.miss) { this.boost({atk: 3}, pokemon, pokemon); }
		},
		flags: {},
		name: "Anger Point",
		rating: 1,
		num: 83,
	},
	anticipation: {
		onStart(pokemon) { for (const target of pokemon.foes()) { for (const moveSlot of target.moveSlots) {
					const move = this.dex.moves.get(moveSlot.move);
					if (move.category === 'Status') continue;
					const moveType = move.id === 'hiddenpower' ? target.hpType : move.type;
					if (this.dex.getEffectiveness(moveType, pokemon) > 0) { this.add('-ability', pokemon, 'Anticipation');
						return;
					}
				}
			}
		},
		onModifyMove(move, attacker, defender) {
			if (!defender || defender.ability !== 'anticipation') return;
			if (move.priority > 0 || this.dex.getEffectiveness(move.type, defender) > 0) { move.anticipationBoostEvasion = true; }
		},
		onModifyAccuracy(accuracy, target, source, move) { if (move?.anticipationBoostEvasion) { return this.chainModify(2/3);  } }, // 1.5x evasion = 2/3 accuracy
		flags: {},
		name: "Anticipation",
		rating: 0.5,
		num: 107,
	},
	baddreams: {
		onResidualOrder: 28,
		onResidualSubOrder: 2,
	drowsypower: {
		onSetStatus(status, target, source, effect) { if (status.id === 'slp' && target.hasAbility('drowsypower')) { for (const mon of this.getAllActive()) { if (mon !== target && mon.hp && !mon.hasAbility('drowsypower')) {
			if (mon.status && mon.status !== 'aura' && mon.status !== 'drowsy' && mon.status !== 'slp') { mon.cureStatus(); } // Only override if not aura, drowsy, or sleep
			if (!mon.status || mon.status === 'drowsy') { mon.trySetStatus('drowsy', target, this.effect); }
			}
		}
		}
		},
		flags: {},
		name: "Drowsy Power",
		rating: 2.5,
		num: -1006,
	},
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			for (const target of pokemon.foes()) { if (target.status === 'slp' || target.hasAbility('comatose')) { this.damage(target.baseMaxhp / 8, target, pokemon); } }
		},
		onAllyAfterStatus(target, source, status, effect) { if (status === 'slp' && target.status !== 'slp') { target.trySetStatus('fear', source); } },
		flags: {},
		name: "Bad Dreams",
		rating: 1.5,
		num: 123,
	},
	download: {
		onStart(pokemon) {
			let totaldef = 0;
			let totalspd = 0;
			for (const target of pokemon.foes()) {
				totaldef += target.getStat('def', false, true);
				totalspd += target.getStat('spd', false, true);
			}
			if (totaldef && totaldef >= totalspd) { this.boost({ spa: 1 }); } 
			else if (totalspd) { this.boost({ atk: 1 }); }
		},
		flags: {},
		name: "Download",
		rating: 3.5,
		num: 88,
	},
	dryskin: {
		onTryHit(target, source, move) { if (target !== source && move.type === 'Water') { if (!this.heal(target.baseMaxhp / 4)) { this.add('-immune', target, '[from] ability: Dry Skin'); }
				return null;
			}
		},
		onSourceBasePowerPriority: 17,
		onSourceBasePower(basePower, attacker, defender, move) { if (move.type === 'Fire') { return this.chainModify(1.25); } },
        onSourceModifyDamage(damage, source, target, move) { if (move.type === 'Ice') { this.debug('Dry Skin reduces Ice damage');
            return this.chainModify(0.75);
            }
        },
		onWeather(target, source, effect) {
			if (target.hasItem('utilityumbrella')) return;
			if (effect.id === 'raindance' || effect.id === 'primordialsea' || effect.id === 'snow') { this.heal(target.baseMaxhp / 8); } 
			else if (effect.id === 'sunnyday' || effect.id === 'desolateland') { this.damage(target.baseMaxhp / 8, target, target); }
		},
		flags: { breakable: 1 },
		name: "Dry Skin",
		rating: 3,
		num: 87,
	},
	filter: {
		onSourceModifyDamage(damage, source, target, move) { if (target.getMoveHitData(move).typeMod > 0) { this.debug('Filter neutralize');
			return this.chainModify(0.75);
			}
		},
		onTryHit(target, source, move) { if (move.flags && move.flags['powder']) { this.add('-immune', target, '[from] ability: Filter');
			return null;
			}
		},
		flags: { breakable: 1 },
		name: "Filter",
		rating: 4,
		num: 111,
		},
	flowergift: {
		onSwitchInPriority: -2,
		onStart(pokemon) { this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon); },
		onWeatherChange(pokemon) {
			if (!pokemon.isActive || pokemon.baseSpecies.baseSpecies !== 'Cherrim' || pokemon.transformed) return;
			if (!pokemon.hp) return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) { if (pokemon.species.id !== 'cherrimsunshine') { pokemon.formeChange('Castform-Sunny'); } } 
			else { if (pokemon.species.id === 'cherrimsunshine') { pokemon.formeChange('Castform'); } }
		},
		onAllyModifyAtkPriority: 3,
		onAllyModifyAtk(atk, pokemon) {
			if (this.effectState.target.baseSpecies.baseSpecies !== 'Cherrim') return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) { return this.chainModify(1.5); }
		},
		onAllyModifySpDPriority: 4,
		onAllyModifySpD(spd, pokemon) {
			if (this.effectState.target.baseSpecies.baseSpecies !== 'Cherrim') return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) { return this.chainModify(1.5); }
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, breakable: 1 },
		name: "Flower Gift",
		rating: 1,
		num: 122,
	},
	forewarn: {
		onStart(pokemon) { // Reveal both Abilities and Item of the foe in front of the user
		const position = pokemon.position;
		const foe = pokemon.side.foe.active[position];
		if (foe && !foe.fainted) {
			const abilities = foe.ability ? [foe.getAbility().name] : [];
			if (foe.ability2 && foe.ability2 !== foe.ability) {
				const ability2 = this.dex.abilities.get(foe.ability2).name;
				if (!abilities.includes(ability2)) abilities.push(ability2);
			}
			for (const abilityName of abilities) { this.add('-ability', foe, abilityName, '[from] ability: Forewarn', `[of] ${pokemon}`); }
			if (foe.item) { this.add('-item', foe, foe.getItem().name, '[from] ability: Forewarn', `[of] ${pokemon}`); }
		}
		},
		flags: {},
		name: "Forewarn",
		rating: 0.5,
		num: 108,
	},
	frisk: {
		onStart(pokemon) { // Reveal all opponent items
			const foes = pokemon.foes();
			for (const target of foes) { if (target.item) { this.add('-item', target, target.getItem().name, '[from] ability: Frisk', `[of] ${pokemon}`); } }
			const team = [pokemon];
			if (pokemon.side.active.length > 1) { for (const mon of pokemon.side.active) { if (mon !== pokemon && !mon.fainted) team.push(mon); } }
			const emptyMons = team.filter(mon => !mon.item && !mon.ignoringItem());
			const stealableFoes = foes.filter(foe => foe.item && !foe.ignoringItem() && !this.dex.items.get(foe.item).onTakeItem === false);
			for (let i = 0; i < Math.min(emptyMons.length, stealableFoes.length); i++) {
				const taker = emptyMons[i];
				const victim = stealableFoes[i];
				const item = victim.takeItem();
				if (item) {
					taker.setItem(item);
					this.add('-item', taker, this.dex.items.get(item).name, '[from] ability: Frisk', `[of] ${taker}`);
				}
			}
		},
		flags: {},
		name: "Frisk",
		rating: 1.5,
		num: 119,
		},
	gluttony: {
		onStart(pokemon) { pokemon.abilityState.gluttony = true; },
		onDamage(item, pokemon) { pokemon.abilityState.gluttony = true; },
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				const berry = this.dex.items.get(source.item);
				if (berry && berry.isBerry) {
					source.takeItem();
					this.add('-enditem', source, berry.name, '[from] ability: Gluttony', '[eat]');
					this.singleEvent('Eat', berry, source.itemState, target, source, move);
				}
			}
		},
		onAfterMove(source, target, move) {
			if (!move || !move.flags['contact']) return;
			if (!target || !target.isActive) return;
			const berry = this.dex.items.get(target.item);
			if (berry && berry.isBerry) {
				target.takeItem();
				this.add('-enditem', target, berry.name, '[from] ability: Gluttony', '[eat]');
				this.singleEvent('Eat', berry, target.itemState, source, target, move);
			}
		},
		flags: {},
		name: "Gluttony",
		rating: 1.5,
		num: 82,
	},
	heatproof: {
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) { if (move.type === 'Fire') { this.debug('Heatproof Atk weaken');
			return this.chainModify(0.5);
			} 
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) { if (move.type === 'Fire') { this.debug('Heatproof SpA weaken');
			return this.chainModify(0.5);
			} 
		},
		onDamage(damage, target, source, effect) { if (effect && effect.id === 'brn') { return damage / 2; } 
		},
		flags: { breakable: 1 },
		name: "Heatproof",
		rating: 2,
		num: 85,
	},
	honeygather: {
		flags: {},
		name: "Honey Gather",
		rating: 0,
		num: 118,
	},
	hydration: {
		onResidualOrder: 5,
		onResidualSubOrder: 3,
		onResidual(pokemon) {
			if (pokemon.status && ['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				this.debug('hydration');
				this.add('-activate', pokemon, 'ability: Hydration');
				pokemon.cureStatus();
			}
		},
		flags: {},
		name: "Hydration",
		rating: 1.5,
		num: 93,
	},
	icebody: {
		onWeather(target, source, effect) { if (effect.id === 'hail' || effect.id === 'snowscape') { this.heal(target.baseMaxhp / 16); } },
		onImmunity(type, pokemon) { if (type === 'hail') return false; },
		flags: {},
		name: "Ice Body",
		rating: 1,
		num: 115,
	},
	ironfist: {
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) { if (move.flags['punch']) { this.debug('Iron Fist boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Iron Fist",
		rating: 3,
		num: 89,
	},
	klutz: { // Item suppression implemented in Pokemon.ignoringItem() within sim/pokemon.js
		// Klutz isn't technically active immediately in-game, but it activates early enough to beat all items
		onSwitchInPriority: 1,
		onStart(pokemon) { this.singleEvent('End', pokemon.getItem(), pokemon.itemState, pokemon); },
		flags: {},
		name: "Klutz",
		rating: -1,
		num: 103,
	},
	leafguard: { 
		onSetStatus(status, target, source, effect) { if (["sunnyday", "desolateland"].includes(target.effectiveWeather())) { if ((effect as Move)?.status) { this.add('-immune', target, '[from] ability: Leaf Guard');
					return false;
				}
			}
		},
		onTryAddVolatile(status, target, source, effect) { if (["sunnyday", "desolateland"].includes(target.effectiveWeather())) { if (status.id === 'yawn') { this.add('-immune', target, '[from] ability: Leaf Guard');
					return null;
				}
			}
		},
		onTryHit(target, source, move) { if (["sunnyday", "desolateland"].includes(target.effectiveWeather())) { if (move.category === 'Status' && move.id !== 'yawn' && move.id !== 'healblock' && move.id !== 'perishsong') { this.add('-immune', target, '[from] ability: Leaf Guard');
					return null;
				}
			}
		},
		flags: { breakable: 1 },
		name: "Leaf Guard",
		rating: 0.5,
		num: 102,
	},
	magicguard: {
		onDamage(damage, target, source, effect) { if (effect.effectType !== 'Move') { if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
			return false;
			} 
		},
		onSourceModifyDamage(damage, source, target, move) { if (move.flags && move.flags.magic) { this.debug('Magic Guard resistance to magic');
			return this.chainModify(0.5);
		}
		},
		flags: {},
		name: "Magic Guard",
		rating: 4,
		num: 98,
	},
	moldbreaker: {
		onStart(pokemon) { this.add('-ability', pokemon, 'Mold Breaker'); },
		onModifyMove(move) { move.ignoreAbility = true; },
		flags: {},
		name: "Mold Breaker",
		rating: 3,
		num: 104,
	},
	motordrive: {
		onTryHit(target, source, move) { if (target !== source && move.type === 'Electric') { if (!this.boost({ spe: 1 })) { this.add('-immune', target, '[from] ability: Motor Drive'); }
				return null;
			}
		},
		onStart(pokemon) { if (pokemon.volatiles['charge'] && !pokemon.volatiles['motordrivechargeboosted']) {
				this.boost({ spe: 1 }, pokemon, pokemon, null, true);
				pokemon.volatiles['motordrivechargeboosted'] = true;
			}
		},
		onAddVolatile(status, pokemon) { if (status.id === 'charge' && !pokemon.volatiles['motordrivechargeboosted']) {
				this.boost({ spe: 1 }, pokemon, pokemon, null, true);
				pokemon.volatiles['motordrivechargeboosted'] = true;
			}
		},
		onEnd(pokemon) { if (pokemon.volatiles['motordrivechargeboosted']) delete pokemon.volatiles['motordrivechargeboosted']; },
		flags: { breakable: 1 },
		name: "Motor Drive",
		rating: 3,
		num: 78,
	},
	multitype: { // Multitype's type-changing itself is implemented in statuses.js
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Multitype",
		rating: 4,
		num: 121,
	},
	noguard: {
		onAnyInvulnerabilityPriority: 1,
		flags: {},
		name: "No Guard",
		rating: 4,
		num: 99,
	},
	normalize: {
		onModifyTypePriority: 1,
		onModifyType(move, pokemon) {
			const noModifyType = [ 'hiddenpower', 'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'struggle', 'technoblast', 'terrainpulse', 'weatherball', ];
			if (!(move.isZ && move.category !== 'Status') && (!noModifyType.includes(move.id) || this.activeMove?.isMax) && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Normal';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) { if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]); },
		flags: {},
		name: "Normalize",
		rating: 0,
		num: 96,
	},
	poisonheal: {
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) { if (effect.id === 'psn' || effect.id === 'tox') { this.heal(target.baseMaxhp / 8);
				return false;
			}
		},
		flags: {},
		name: "Poison Heal",
		rating: 4,
		num: 90,
	},
	quickfeet: {
		onModifySpe(spe, pokemon) { if (pokemon.status) { return this.chainModify(1.5); } },
		flags: {},
		name: "Quick Feet",
		rating: 2.5,
		num: 95,
	},
	reckless: {
		onDamage(damage, target, source, effect) { if (effect && (effect.id === 'recoil' || effect.id === 'crash')) { this.debug('Reckless halves recoil/crash damage');
				return Math.floor(damage / 2);
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) { if (move.recoil || move.hasCrashDamage) { this.debug('Reckless boost');
				return this.chainModify(1.3);
			}
		},
		flags: {},
		name: "Reckless",
		rating: 3,
		num: 120,
	},
	rivalry: {
		onBasePowerPriority: 24,
		onBasePower(basePower, attacker, defender, move) { if (attacker.gender && defender.gender) { if (attacker.gender === defender.gender) { this.debug('Rivalry boost');
			return this.chainModify(1.25);
		} else { this.debug('Rivalry weaken');
					return this.chainModify(0.75);
				}
			}
		},
		flags: {},
		name: "Rivalry",
		rating: 0,
		num: 79,
	},
	scrappy: {
		onModifyMovePriority: -5,
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Fighting'] = true;
				move.ignoreImmunity['Normal'] = true;
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Scrappy', `[of] ${target}`);
			}
		},
		flags: {},
		name: "Scrappy",
		rating: 3,
		num: 113,
	},
	simple: {
		onChangeBoost(boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
			let i: BoostID;
			for (i in boost) { boost[i]! *= 2; }
		},
		flags: { breakable: 1 },
		name: "Simple",
		rating: 4,
		num: 86,
	},
	skilllink: {
		onModifyMove(move) {
			if (move.multihit && Array.isArray(move.multihit) && move.multihit.length) { move.multihit = move.multihit[1]; }
			if (move.multiaccuracy) { delete move.multiaccuracy; }
		},
		flags: {},
		name: "Skill Link",
		rating: 3,
		num: 92,
	},
	slowstart: {
		onStart(pokemon) { this.add('-start', pokemon, 'ability: Slow Start');
			this.effectState.counter = 3;
		},
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) { if (this.effectState.counter) {
				this.effectState.counter--;
				if (!this.effectState.counter) {
					this.add('-end', pokemon, 'Slow Start');
					delete this.effectState.counter;
					pokemon.setStatus('aura', pokemon, {
						auraAbility: 'craftergod',
						auraName: 'Crafter God',
						auraDuration: 5,
					} as any);
				}
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) { if (this.effectState.counter) { return this.chainModify(0.5); } },
		onModifySpe(spe, pokemon) { if (this.effectState.counter) { return this.chainModify(0.5); } },
		flags: {},
		name: "Slow Start",
		rating: 0,
		num: 112,
	},
	sniper: {
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).crit) { this.debug('Sniper crit boost');
				return this.chainModify(1.5);
			}
			if ((move.flags && (move.flags.bullet || move.flags.pierce))) { this.debug('Sniper bullet/piercing boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Sniper",
		rating: 2,
		num: 97,
	},
	snowcloak: {
		onImmunity(type, pokemon) { if (type === 'hail') return false; },
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) { if (this.field.isWeather(['hail', 'snowscape'])) { this.debug('Snow Cloak Def boost');
				return this.chainModify(1.3);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) { if (this.field.isWeather(['hail', 'snowscape'])) { this.debug('Snow Cloak SpD boost');
				return this.chainModify(1.3);
			}
		},
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target === source || move.hasBounced || !move.type) return;
			if (move.type === 'Light') {
				this.add('-immune', target, '[from] ability: Snow Cloak');
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				newMove.pranksterBoosted = false;
				this.actions.useMove(newMove, target, { target: source });
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Snow Cloak",
		rating: 1.5,
		num: 81,
	},
	snowwarning: {
		onStart(source) { this.field.setWeather('snowscape'); },
		flags: {},
		name: "Snow Warning",
		rating: 4,
		num: 117,
	},
	solarpower: {
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) { if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) { return this.chainModify(1.5); } },
        onBasePower(basePower, attacker, defender, move) { if (move.flags && move.flags.solar) { this.debug('Solar Power solar move boost');
            return this.chainModify([1200, 1000]);
            }
        },
		onWeather(target, source, effect) {
			if (target.hasItem('utilityumbrella')) return;
			if (effect.id === 'sunnyday' || effect.id === 'desolateland') { this.damage(target.baseMaxhp / 10, target, target); }
		},
		flags: {},
		name: "Solar Power",
		rating: 2,
		num: 94,
	},
	solidrock: {
		onSourceModifyDamage(damage, source, target, move) { if (target.getMoveHitData(move).typeMod > 0) { this.debug('Solid Rock neutralize');
			return this.chainModify(0.75);
			} 
		},
		onFlinch(target) { this.add('-immune', target, '[from] ability: Solid Rock');
			return false;
		},
		onTryHit(target, source, move) { if (move && move.flags && move.flags.slicing) { this.add('-immune', target, '[from] ability: Solid Rock');
			return null;
			}
		},
		flags: { breakable: 1 },
		name: "Solid Rock",
		rating: 3,
		num: 116,
	},
	stall: {
		onFractionalPriority: -0.1,
		onDamagePriority: -30,
		onDamage(damage, target, source, effect) { if (target.hp > 1 && damage >= target.hp && effect && effect.effectType === 'Move') { this.add('-ability', target, 'Stall');
				return target.hp - 1;
			}
		},
		flags: {},
		name: "Stall",
		rating: -1,
			num: 100,
	},
	
	steadfast: {
		onFlinch(pokemon) { this.boost({ spe: 1 }); },
		onTripped(pokemon) { this.boost({ spe: 1 }); },
		flags: {},
		name: "Steadfast",
		rating: 1,
		num: 80,
	},
	stormdrain: {
		onTryHit(target, source, move) { if (target !== source && move.type === 'Water') { if (!this.boost({ spa: 1 })) { this.add('-immune', target, '[from] ability: Storm Drain'); }
			return null;
			}
		},
		onAnyRedirectTarget(target, source, source2, move) {
			if (move.type !== 'Water' || move.flags['pledgecombo']) return;
			const redirectTarget = ['randomNormal', 'adjacentFoe'].includes(move.target) ? 'normal' : move.target;
			if (this.validTarget(this.effectState.target, source, redirectTarget)) {
				if (move.smartTarget) move.smartTarget = false;
				if (this.effectState.target !== target) { this.add('-activate', this.effectState.target, 'ability: Storm Drain'); }
				return this.effectState.target;
			}
		},
		flags: { breakable: 1 },
		name: "Storm Drain",
		rating: 3,
		num: 114,
	},
	superluck: {
		onModifyCritRatio(critRatio) { return critRatio + 2; },
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('Super Luck - boosting accuracy');
			return this.chainModify(1.2);
		},
		onModifyAccuracyPriority: -1,
		onModifyAccuracy(accuracy, target) {
			if (typeof accuracy !== 'number') return;
			if (accuracy < 100) { this.debug('Super Luck - reducing opponent accuracy');
				return this.chainModify(0.8);
			}
		},
		onModifySecondaries(secondaries) {
			this.debug('Super Luck boost');
			return secondaries.map(effect => { if (effect.chance) { return {...effect, chance: effect.chance * 1.5}; }
				return effect;
			});
		},
		flags: {},
		name: "Super Luck",
		rating: 1.5,
		num: 105,
	},
	tangledfeet: {
		onModifyAccuracyPriority: -1,
		onModifyAccuracy(accuracy, target) {
			if (typeof accuracy !== 'number') return;
			if (target?.volatiles['confusion']) { this.debug('Tangled Feet - decreasing accuracy');
			return this.chainModify(0.5);
			}
		},
		flags: { breakable: 1 },
		name: "Tangled Feet",
		rating: 1,
		num: 77,
	},
	technician: {
		onBasePowerPriority: 30,
		onBasePower(basePower, attacker, defender, move) {
			const basePowerAfterMultiplier = this.modify(basePower, this.event.modifier);
			this.debug(`Base Power: ${basePowerAfterMultiplier}`);
			if (basePowerAfterMultiplier <= 60) { this.debug('Technician boost');
			return this.chainModify(1.5);
			}
            if (move.flags && move.flags.weapon) { this.debug('Technician weapon boost');
                return this.chainModify(1.3);
            }
		},
		flags: {},
		name: "Technician",
		rating: 3.5,
		num: 101,
	},
	tintedlens: {
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod < 0) { this.debug('Tinted Lens boost');
			return this.chainModify(2);
			}
            if (move.flags && move.flags.light) { this.debug('Tinted Lens light resist');
                return this.chainModify(0.5);
            }
		},
		flags: {},
		name: "Tinted Lens",
		rating: 4,
		num: 110,
	},
	unaware: {
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectState.target;
			if (unawareUser === pokemon) return;
			if (unawareUser === this.activePokemon && pokemon === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (pokemon === this.activePokemon && unawareUser === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['def'] = 0;
				boosts['spa'] = 0;
				boosts['accuracy'] = 0;
			}
		},
		flags: { breakable: 1 },
		name: "Unaware",
		rating: 4,
		num: 109,
	},
	unburden: {
		onAfterUseItem(item, pokemon) {
			if (pokemon !== this.effectState.target) return;
			pokemon.addVolatile('unburden');
		},
		onTakeItem(item, pokemon) { pokemon.addVolatile('unburden'); },
		onEnd(pokemon) { pokemon.removeVolatile('unburden'); },
		condition: { onModifySpe(spe, pokemon) { if (!pokemon.item && !pokemon.ignoringAbility()) { return this.chainModify(2); } }, },
		flags: {},
		name: "Unburden",
		rating: 3.5,
		num: 84,
	},



	// #region Gen 5 Abilities
	analytic: {
		onBasePowerPriority: 21,
		onBasePower(basePower, pokemon) {
			let boosted = true;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (this.queue.willMove(target)) { boosted = false;
					break;
				}
			}
			if (boosted) { this.debug('Analytic boost');
				return this.chainModify([5325, 4096]);
			}
		},
		flags: {},
		name: "Analytic",
		rating: 2.5,
		num: 148,
	},
	bigpecks: {
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			if ((boost.def && boost.def < 0) || (boost.atk && boost.atk < 0)) {
				if (boost.def && boost.def < 0) delete boost.def;
				if (boost.atk && boost.atk < 0) delete boost.atk;
				if (!(effect as ActiveMove).secondaries && effect.id !== 'octolock') { this.add("-fail", target, "unboost", "Attack/Defense", "[from] ability: Big Pecks", `[of] ${target}`); }
			}
		},
		onBasePower(basePower, attacker, defender, move) { if (move.flags['piercing'] || move.flags['wing']) { return this.chainModify(1.3); } },
		flags: { breakable: 1 },
		name: "Big Pecks",
		rating: 1.5,
		num: 145,
	},
	contrary: {
		onChangeBoost(boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
			let i: BoostID;
			for (i in boost) { boost[i]! *= -1; }
		},
		flags: { breakable: 1 },
		name: "Contrary",
		rating: 4.5,
		num: 126,
	},
	cursedbody: {
		onDamagingHit(damage, target, source, move) {
			if (source.volatiles['disable']) return;
			if (!move.isMax && !move.flags['futuremove'] && move.id !== 'struggle') { if (this.randomChance(3, 10)) {
					source.addVolatile('disable', this.effectState.target);
					if (!source.volatiles['curse'] && source.hp && source.side && source.side.name !== target.side.name) { this.add('-ability', target, 'Cursed Body');
						source.addVolatile('curse', target);
					}
				}
			}
		},
		onBasePowerPriority: 7,
		onBasePower(basePower, attacker, defender, move) { if (move.flags['magic']) { return this.chainModify(1.5); } },
		flags: {},
		name: "Cursed Body",
		rating: 2,
		num: 130,
	},
	defeatist: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) { if (pokemon.hp <= pokemon.maxhp / 2) { return this.chainModify(0.5); } },
		onModifySpAPriority: 5,
		onModifySpA(atk, pokemon) { if (pokemon.hp <= pokemon.maxhp / 2) { return this.chainModify(0.5); } },
		flags: {},
		name: "Defeatist",
		rating: -1,
		num: 129,
	},
	defiant: {
		onAfterEachBoost(boost, target, source, effect) {
			if (!source || target.isAlly(source)) { return; }
			let statsLowered = false;
			let i: BoostID;
			for (i in boost) { if (boost[i]! < 0) {  statsLowered = true; } }
			if (statsLowered) { this.boost({ atk: 2 }, target, target, null, false, true); }
		},
		flags: {},
		name: "Defiant",
		rating: 3,
		num: 128,
	},
	flareboost: {
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) { if (pokemon.status === 'brn') { return this.chainModify(1.5); } },
		onModifySpe(spe, pokemon) { if (pokemon.status === 'brn') { return this.chainModify(1.5); } },
		onTryHit(target, source, move) { if (target !== source && move.type === 'Fire') { this.add('-immune', target, '[from] ability: Flare Boost');
			return null;
			}
		},
		onDamagingHit(damage, target, source, move) { if (move.type === 'Fire') { target.boost({spa: 1, spe: 1}, target, target, this.effect); } },
		flags: {},
		name: "Flare Boost",
		rating: 2,
		num: 138,
		},
	friendguard: {
		onAnyModifyDamage(damage, source, target, move) { if (target !== this.effectState.target && target.isAlly(this.effectState.target)) { this.debug('Friend Guard weaken');
				return this.chainModify(0.75);
			}
		},
		flags: { breakable: 1 },
		name: "Friend Guard",
		rating: 0,
		num: 132,
	},
	harvest: {
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (!pokemon.hp || pokemon.item || !this.dex.items.get(pokemon.lastItem).isBerry) return;
			if (this.field.isWeather(['sunnyday', 'desolateland']) || this.field.isTerrain('grassyterrain')) {
				pokemon.setItem(pokemon.lastItem);
				pokemon.lastItem = '';
				this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Harvest');
				return;
			}
			if ((this.field.isWeather(['hail', 'sandstorm', 'snowscape']) || this.field.isTerrain('toxicterrain')) && this.randomChance(1, 4)) {
				pokemon.setItem(pokemon.lastItem);
				pokemon.lastItem = '';
				this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Harvest');
				return;
			}
			if (this.randomChance(1, 2)) {
				pokemon.setItem(pokemon.lastItem);
				pokemon.lastItem = '';
				this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Harvest');
			}
		},
		flags: {},
		name: "Harvest",
		rating: 2.5,
		num: 139,
	},
	healer: { // Heal user and adjacent allies by 6.25% and 50% chance to cure status, before residual damage
		onBasePower(basePower, user, target, move) { if (move && move.flags && move.flags.heal) { return this.chainModify([5325, 4096]); } },
		onResidualOrder: 4,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (pokemon.hp && pokemon.hp < pokemon.maxhp) { this.heal(pokemon.baseMaxhp / 16, pokemon, pokemon); }
			if (pokemon.status && this.randomChance(1, 2)) { this.add('-activate', pokemon, 'ability: Healer');
				pokemon.cureStatus();
			}
			for (const ally of pokemon.adjacentAllies()) { if (ally.hp && ally.hp < ally.maxhp) { this.heal(ally.baseMaxhp / 16, ally, pokemon); }
				if (ally.status && this.randomChance(1, 2)) { this.add('-activate', pokemon, 'ability: Healer');
					ally.cureStatus();
				}
			}
		},
		flags: {},
		name: "Healer",
		rating: 2.5,
		num: 131,
	},
	heavymetal: {
		onModifyWeightPriority: 1,
		onModifyWeight(weighthg) { return weighthg * 2; },
		onModifyDef(def, pokemon) { return this.chainModify([4516, 4096]); },
		onModifySpD(spd, pokemon) { return this.chainModify([4516, 4096]);  },
		onSourceModifyDamage(damage, source, target, move) { if (move.flags && move.flags.sweep) { this.debug('Heavy Metal weakness to sweeping');
			return this.chainModify(2);
		}
		},
		flags: { breakable: 1 },
		name: "Heavy Metal",
		rating: 2,
		num: 134,
	},
	illusion: { // yes, you can Illusion an active pokemon but only if it's to your right
		onBeforeSwitchIn(pokemon) {
			pokemon.illusion = null;
			for (let i = pokemon.side.pokemon.length - 1; i > pokemon.position; i--) {
				const possibleTarget = pokemon.side.pokemon[i];
				if (!possibleTarget.fainted) { // If Ogerpon is in the last slot while the Illusion Pokemon is Terastallized, Illusion will not disguise as anything
					if (!pokemon.terastallized || !['Ogerpon', 'Terapagos'].includes(possibleTarget.species.baseSpecies)) { pokemon.illusion = possibleTarget; }
					break;
				}
			}
		},
		onDamagingHit(damage, target, source, move) { if (target.illusion) { this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, source, move); }  },
		onEnd(pokemon) { if (pokemon.illusion) {
				this.debug('illusion cleared');
				pokemon.illusion = null;
				const details = pokemon.getUpdatedDetails();
				this.add('replace', pokemon, details);
				this.add('-end', pokemon, 'Illusion');
				if (this.ruleTable.has('illusionlevelmod')) { this.hint("Illusion Level Mod is active, so this Pok\u00e9mon's true level was hidden.", true); }
			}
		},
		onFaint(pokemon) { pokemon.illusion = null; },
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Illusion",
		rating: 4.5,
		num: 149,
	},
	imposter: {
		onSwitchIn(pokemon) { // Imposter does not activate when Skill Swapped or when Neutralizing Gas leaves the field
			const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			if (target) { pokemon.transformInto(target, this.dex.abilities.get('imposter')); }
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1 },
		name: "Imposter",
		rating: 5,
		num: 150,
	},
	infiltrator: {
		onModifyMove(move) { move.infiltrates = true; },
		onBasePower(basePower, attacker, defender, move) { if (attacker.hasAbility('infiltrator') && move.flags && move.flags.pierce) { return this.chainModify([5325, 4096]); } },
		flags: {},
		name: "Infiltrator",
		rating: 2.5,
		num: 151,
	},
	ironbarbs: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) { if (this.checkMoveMakesContact(move, source, target, true)) { this.damage(source.baseMaxhp / 8, source, target); } },
		flags: {},
		name: "Iron Barbs",
		rating: 2.5,
		num: 160,
	},
	justified: {
		onDamagingHit(damage, target, source, move) { if (move.type === 'Dark' || (move.flags && (move.flags.binding || move.flags.sweep || move.flags.shadow))) { this.boost({ atk: 1 }, target, source, null, true); } },
		onSetStatus(status, target, source, effect) { if (status.id === 'curse') { this.boost({ atk: 1 }, target, source, null, true); } },
		onSourceModifyDamage(damage, source, target, move) { if (move.type === 'Dark' || (move.flags && (move.flags.binding || move.flags.sweep || move.flags.shadow))) { return this.chainModify(0.5); } },
		flags: {},
		name: "Justified",
		rating: 3.5,
		num: 154,
	},
	lightmetal: {
		onModifyWeightPriority: 1,
		onModifyWeight(weighthg) { return this.trunc(weighthg / 2); },
		onModifySpe(spe, pokemon) { return this.chainModify([4915, 4096]); },
		onSourceModifyDamage(damage, source, target, move) { if (move.flags && move.flags.wind) { this.debug('Light Metal weakness to wind');
				return this.chainModify(2);
			}
		},
		flags: { breakable: 1 },
		name: "Light Metal",
		rating: 1,
		num: 135,
	},
	magicbounce: {
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target === source || move.hasBounced || target.isSemiInvulnerable()) { return; }
			if (!move.flags['reflectable'] && !move.flags['magic']) return;
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, target, { target: source });
			return null;
		},
		onAllyTryHitSide(target, source, move) {
			if (target.isAlly(source) || move.hasBounced || target.isSemiInvulnerable()) { return; }
			if (!move.flags['reflectable'] && !move.flags['magic']) return;
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, this.effectState.target, { target: source });
			move.hasBounced = true; // only bounce once in free-for-all battles
			return null;
		},
		flags: { breakable: 1 },
		name: "Magic Bounce",
		rating: 4,
		num: 156,
	},
	moody: {
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			let stats: BoostID[] = [];
			const boost: SparseBoostsTable = {};
			let statPlus: BoostID;
			for (statPlus in pokemon.boosts) {
				if (statPlus === 'accuracy' || statPlus === 'evasion') continue;
				if (pokemon.boosts[statPlus] < 6) { stats.push(statPlus); }
			}
			let randomStat: BoostID | undefined = stats.length ? this.sample(stats) : undefined;
			if (randomStat) boost[randomStat] = 2;
			stats = [];
			let statMinus: BoostID;
			for (statMinus in pokemon.boosts) {
				if (statMinus === 'accuracy' || statMinus === 'evasion') continue;
				if (pokemon.boosts[statMinus] > -6 && statMinus !== randomStat) { stats.push(statMinus); }
			}
			randomStat = stats.length ? this.sample(stats) : undefined;
			if (randomStat) boost[randomStat] = -1;
			this.boost(boost, pokemon, pokemon);
		},
		flags: {},
		name: "Moody",
		rating: 5,
		num: 141,
	},
	moxie: {
		onSourceAfterFaint(length, target, source, effect) { if (effect && effect.effectType === 'Move') { this.boost({ atk: length }, source); } },
		flags: {},
		name: "Moxie",
		rating: 3,
		num: 153,
	},
	multiscale: {
		onSourceModifyDamage(damage, source, target, move) { if (target.hp >= target.maxhp) { this.debug('Multiscale weaken');
			return this.chainModify(0.5);
			}
		},
		flags: { breakable: 1 },
		name: "Multiscale",
		rating: 3.5,
		num: 136,
	},
	mummy: { // always replace ability1 
		onDamagingHit(damage, target, source, move) {
			const sourceAbility = source.getAbility();
			if (sourceAbility.flags['cantsuppress'] || sourceAbility.id === 'mummy') { return; }
			if (this.checkMoveMakesContact(move, source, target, !source.isAlly(target))) {
				const oldAbility = source.ability;
				source.setAbility('mummy');
				if (oldAbility && oldAbility !== 'mummy') { this.add('-activate', target, 'ability: Mummy', this.dex.abilities.get(oldAbility).name, `[of] ${source}`); }
			}
		},
		flags: {},
		name: "Mummy",
		rating: 2,
		num: 152,
	},
	overcoat: {
		onImmunity(type, pokemon) { if (type === 'sandstorm' || type === 'hail' || type === 'powder') return false; },
		onTryHitPriority: 1,
		onTryHit(target, source, move) { if (move.flags['powder'] && target !== source && this.dex.getImmunity('powder', target)) { this.add('-immune', target, '[from] ability: Overcoat');
			return null;
			}
		},
		flags: { breakable: 1 },
		name: "Overcoat",
		rating: 2,
		num: 142,
	},
	pickpocket: {
		onAfterMove(pokemon, target, move) {
			if (!target || !move?.flags['contact']) return;
			if (pokemon.item || pokemon.switchFlag || pokemon.forceSwitchFlag || target.switchFlag === true) return;
			const theirItem = target.takeItem(pokemon);
			if (!theirItem) return;
			if (!pokemon.setItem(theirItem)) { target.item = theirItem.id;
				return;
			}
			this.add('-enditem', target, theirItem, '[silent]', '[from] ability: Pickpocket', `[of] ${pokemon}`);
			this.add('-item', pokemon, theirItem, '[from] ability: Pickpocket', `[of] ${pokemon}`);
		},
		onAfterMoveSecondary(target, source, move) { if (source && source !== target && move?.flags['contact']) {
				if (target.item || target.switchFlag || target.forceSwitchFlag || source.switchFlag === true) { return; }
				const yourItem = source.takeItem(target);
				if (!yourItem) { return; }
				if (!target.setItem(yourItem)) { source.item = yourItem.id;
					return;
				}
				this.add('-enditem', source, yourItem, '[silent]', '[from] ability: Pickpocket', `[of] ${source}`);
				this.add('-item', target, yourItem, '[from] ability: Pickpocket', `[of] ${source}`);
			}
		},
		flags: {},
		name: "Pickpocket",
		rating: 1,
		num: 124,
	},
	poisontouch: { // Despite not being a secondary, Shield Dust / Covert Cloak block Poison Touch's effect
		onSourceDamagingHit(damage, target, source, move) {
			if (target.hasAbility('shielddust') || target.hasItem('covertcloak')) return;
			if (this.checkMoveMakesContact(move, target, source)) { if (this.randomChance(3, 10)) { target.trySetStatus('psn', source); } }
		},
		flags: {},
		name: "Poison Touch",
		rating: 2,
		num: 143,
	},
	prankster: {
		onModifyPriority(priority, pokemon, target, move) { if (move?.category === 'Status') { move.pranksterBoosted = true;
				return priority + 1;
			}
		},
		flags: {},
		name: "Prankster",
		rating: 4,
		num: 158,
	},
	rattled: {
		onDamagingHit(damage, target, source, move) { if (['Dark', 'Bug', 'Ghost'].includes(move.type) ||  (move.flags && (move.flags.explosive || move.flags.sound || move.flags.shadow))) { this.boost({ spe: 1 }); } },
		onTryAddVolatile(status, target) { if (status.id === 'fear') { this.boost({ spe: 1 }); } },
		onAfterBoost(boost, target, source, effect) { if (effect?.name === 'Intimidate' && boost.atk) { this.boost({ spe: 1 }); } },
		flags: {},
		name: "Rattled",
		rating: 1.5,
		num: 155,
	},
	regenerator: {
		onSwitchOut(pokemon) { pokemon.heal(pokemon.baseMaxhp / 3); },
		flags: {},
		name: "Regenerator",
		rating: 4.5,
		num: 144,
	},
	sandforce: {
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) { if (this.field.isWeather('sandstorm')) { if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') { this.debug('Sand Force boost');
					return this.chainModify([5325, 4096]);
				}
			}
		},
		onImmunity(type, pokemon) { if (type === 'sandstorm') return false; },
		flags: {},
		name: "Sand Force",
		rating: 2,
		num: 159,
	},
	sandrush: {
		onModifySpe(spe, pokemon) { if (this.field.isWeather('sandstorm')) { return this.chainModify(2); } },
		onImmunity(type, pokemon) { if (type === 'sandstorm') return false; },
		flags: {},
		name: "Sand Rush",
		rating: 3,
		num: 146,
	},
	sapsipper: {
		onTryHitPriority: 1,
		onTryHit(target, source, move) { if (target !== source && move.type === 'Grass') { if (!this.boost({ atk: 1 })) { this.add('-immune', target, '[from] ability: Sap Sipper'); }
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (source === this.effectState.target || !target.isAlly(source)) return;
			if (move.type === 'Grass') { this.boost({ atk: 1 }, this.effectState.target); }
		},
		flags: { breakable: 1 },
		name: "Sap Sipper",
		rating: 3,
		num: 157,
	},
	sheerforce: {
		onModifyMove(move, pokemon) {
			if (move.secondaries) {
				delete move.secondaries;
				// Technically not a secondary effect, but it is negated
				delete move.self;
				if (move.id === 'clangoroussoulblaze') delete move.selfBoost;
				// Actual negation of `AfterMoveSecondary` effects implemented in scripts.js
				move.hasSheerForce = true;
			}
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, pokemon, target, move) { if (move.hasSheerForce) return this.chainModify([5325, 4096]); },
		flags: {},
		name: "Sheer Force",
		rating: 3.5,
		num: 125,
	},
	telepathy: {
		onTryHit(target, source, move) { if (target !== source && target.isAlly(source) && move.category !== 'Status') { this.add('-activate', target, 'ability: Telepathy');
				return null;
			}
		},
		onModifyAccuracyPriority: -1,
		onModifyAccuracy(accuracy, target, source, move) {
			if (!move.spreadHit) return;
			if (!target.isAlly(source)) return;
			const telepathyUser = source.side.active.find(ally => ally?.hasAbility('telepathy'));
			if (telepathyUser && telepathyUser.moveThisTurnResult === false) { this.add('-activate', target, 'ability: Telepathy');
				return false; 
			}
		},
		flags: { breakable: 1 },
		name: "Telepathy",
		rating: 0,
		num: 140,
	},
	teravolt: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Teravolt');
			// Check if any pokemon has Turboblaze to activate Overdrive
			const hasTurboblaze = this.getAllActive().some(p => p.hasAbility('turboblaze'));
			if (hasTurboblaze) {
				pokemon.addVolatile('overdrive');
				this.add('-start', pokemon, 'Overdrive', '[from] ability: Teravolt');
				this.add('-message', `${pokemon.name}'s Teravolt resonates with Turboblaze! An overwhelming surge of electric power erupts, suppressing all abilities in its wake!`);
			}
		},
		onModifyMove(move) { move.ignoreAbility = true; },
		onBasePower(basePower, attacker, defender, move) { if (move.type === 'Electric') {
				const multiplier = attacker.volatiles['overdrive'] ? 1.5 : 1.2;
				this.debug(`Teravolt Electric boost: ${multiplier}x`);
				return this.chainModify(multiplier);
			}
		},
		onTryHit(target, source, move) { if (target.volatiles['overdrive'] && move.type === 'Fire') {
				this.add('-immune', target, '[from] ability: Teravolt [Overdrive]');
				this.boost({ atk: 1 }, target, target);
				return null;
			}
		},
		condition: {
			onStart(pokemon) { for (const target of this.getAllActive()) { if (!target.hasAbility(['teravolt', 'turboblaze'])) { target.addVolatile('gastroacid'); } } },
			onEnd(pokemon) { for (const target of this.getAllActive()) { if (target.volatiles['gastroacid']) { target.removeVolatile('gastroacid'); } } },
		},
		flags: {},
		name: "Teravolt",
		shortDesc: "Moves ignore abilities. Electric moves 1.2x. With Turboblaze: Overdrive mode - Electric 1.5x, Fire immunity/+Atk, suppress all abilities except Teravolt/Turboblaze.",
		rating: 3,
		num: 164,
	},
	toxicboost: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) { if ((attacker.status === 'psn' || attacker.status === 'tox') && move.category === 'Physical') { return this.chainModify(1.5); } },
		onModifySpe(spe, pokemon) { if (pokemon.status === 'psn' || pokemon.status === 'tox') { return this.chainModify(1.5); } },
		flags: {},
		name: "Toxic Boost",
		rating: 3,
		num: 137,
	},
	turboblaze: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Turboblaze');
			const hasTeravolt = this.getAllActive().some(p => p.hasAbility('teravolt'));
			if (hasTeravolt) {
				pokemon.addVolatile('overdrive');
				this.add('-start', pokemon, 'Overdrive', '[from] ability: Turboblaze');
				this.add('-message', `${pokemon.name}'s Turboblaze harmonizes with Teravolt! A blazing inferno engulfs the battlefield, making it hard to move!`);
			}
		},
		onModifyMove(move) { move.ignoreAbility = true; },
		onBasePower(basePower, attacker, defender, move) { if (move.type === 'Fire') {
				const multiplier = attacker.volatiles['overdrive'] ? 1.5 : 1.2;
				this.debug(`Turboblaze Fire boost: ${multiplier}x`);
				return this.chainModify(multiplier);
			}
		},
		onTryHit(target, source, move) { if (target.volatiles['overdrive'] && move.type === 'Electric') {
				this.add('-immune', target, '[from] ability: Turboblaze [Overdrive]');
				this.boost({ spa: 1 }, target, target);
				return null;
			}
		},
		condition: {
			onStart(pokemon) { this.field.addPseudoWeather('turboblazeoverdrive'); },
			onEnd(pokemon) { this.field.removePseudoWeather('turboblazeoverdrive'); },
			onAnyDeductPP(target, source) { if (target.isAlly(source)) return;
				return 1;
			},
		},
		flags: {},
		name: "Turboblaze",
		shortDesc: "Moves ignore abilities. Fire moves 1.2x. With Teravolt: Overdrive mode - Fire 1.5x, Electric immunity/+SpA, other Pokemon consume 2 PP per move.",
		rating: 3,
		num: 163,
	},
	unnerve: {
		onSwitchInPriority: 1,
		onStart(pokemon) {
			if (this.effectState.unnerved) return;
			this.add('-ability', pokemon, 'Unnerve');
			this.effectState.unnerved = true;
		},
		onEnd() { this.effectState.unnerved = false; },
		onFoeTryEatItem() { return !this.effectState.unnerved; },
		flags: {},
		name: "Unnerve",
		rating: 1,
		num: 127,
	},
	victorystar: {
		onAnyModifyAccuracyPriority: -1,
		onAnyModifyAccuracy(accuracy, target, source) { if (source.isAlly(this.effectState.target) && typeof accuracy === 'number') { return this.chainModify([4506, 4096]); } },
		flags: {},
		name: "Victory Star",
		rating: 2,
		num: 162,
	},
	weakarmor: {
		onDamagingHit(damage, target, source, move) { if (move.category === 'Physical') { this.boost({ def: -1, spe: 2 }, target, target); } },
		flags: {},
		name: "Weak Armor",
		rating: 1,
		num: 133,
	},
	wonderskin: {
		onModifyAccuracyPriority: 10,
		onModifyAccuracy(accuracy, target, source, move) { if (move.category === 'Status' && typeof accuracy === 'number') { this.debug('Wonder Skin - setting accuracy to 50');
				return 50;
			}
		},
		onResidualOrder: 29,
		onResidual(pokemon) { if (pokemon.status && this.randomChance(1, 3)) { this.add('-activate', pokemon, 'ability: Wonder Skin', '[status cure]');
				pokemon.cureStatus();
			}
		},
		flags: { breakable: 1 },
		name: "Wonder Skin",
		rating: 2,
		num: 147,
	},
	zenmode: {
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Darmanitan' || pokemon.transformed) { return; }
			if (pokemon.hp <= pokemon.maxhp / 2 && !['Zen', 'Galar-Zen'].includes(pokemon.species.forme)) { pokemon.addVolatile('zenmode'); } 
			else if (pokemon.hp > pokemon.maxhp / 2 && ['Zen', 'Galar-Zen'].includes(pokemon.species.forme)) {
				pokemon.addVolatile('zenmode'); // in case of base Darmanitan-Zen
				pokemon.removeVolatile('zenmode');
			}
		},
		onEnd(pokemon) {
			if (!pokemon.volatiles['zenmode'] || !pokemon.hp) return;
			pokemon.transformed = false;
			delete pokemon.volatiles['zenmode'];
			if (pokemon.species.baseSpecies === 'Darmanitan' && pokemon.species.battleOnly) { pokemon.formeChange(pokemon.species.battleOnly as string, this.effect, false, '0', '[silent]'); }
		},
		condition: {
			onStart(pokemon) {
				if (!pokemon.species.name.includes('Galar')) { if (pokemon.species.id !== 'darmanitanzen') pokemon.formeChange('Darmanitan-Zen'); } 
				else { if (pokemon.species.id !== 'darmanitangalarzen') pokemon.formeChange('Darmanitan-Galar-Zen'); }
			},
			onEnd(pokemon) { if (['Zen', 'Galar-Zen'].includes(pokemon.species.forme)) { pokemon.formeChange(pokemon.species.battleOnly as string); } },
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Zen Mode",
		rating: 0,
		num: 161,
	},


	
	// #region Gen 6 Abilities
	aerilate: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [ 'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball', ];
			if (move.type === 'Normal' && (!noModifyType.includes(move.id) || this.activeMove?.isMax) && !(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Flying';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) { if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]); },
		flags: {},
		name: "Aerilate",
		rating: 4,
		num: 184,
	},
	aromaveil: {
		onAllyTryAddVolatile(status, target, source, effect) {
			const blocked = ['attract', 'disable', 'encore', 'healblock', 'taunt', 'torment', 'imprison', 'followme', 'ragepowder', 'spotlight'];
			if (blocked.includes(status.id)) { if (effect.effectType === 'Move') {
					const effectHolder = this.effectState.target;
					this.add('-block', target, 'ability: Aroma Veil', `[of] ${effectHolder}`);
				}
				return null;
			}
		},
		onStart(pokemon) {
			const cureStatuses = ['attract', 'disable', 'encore', 'healblock', 'taunt', 'torment', 'imprison', 'followme', 'ragepowder', 'spotlight'];
			for (const ally of pokemon.alliesAndSelf()) { for (const status of cureStatuses) { if (ally.volatiles[status]) {
						ally.removeVolatile(status);
						this.add('-end', ally, status, '[from] ability: Aroma Veil');
					}
				}
			}
		},
		flags: { breakable: 1 },
		name: "Aroma Veil",
		rating: 2,
		num: 165,
	},
	aurabreak: {
		onStart(pokemon) { 
			this.add('-ability', pokemon, 'Aura Break');
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.species.id === 'palafinheroforme') {
					this.add('-message', `${target.name} really was a zero after all...`);
					target.formeChange('Palafin', this.effect, false);
				}
				// Remove aura status and associated ability, then heal
				if (target.status === 'aura') {
					this.add('-message', `${target.name}'s aura was broken!`);
					target.cureStatus();
					target.setAbility(target.baseAbility);
					this.heal(target.baseMaxhp / 5, target, pokemon, this.effect);
				}
			}
		},
		onBeforeMovePriority: 5,
		onBeforeMove(attacker, defender, move) { if (move.flags?.aura) { this.add('-message', `${attacker.name} cannot use aura moves while Aura Break is active!`);
				return false;
			}
		},
		onAnyTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			move.hasAuraBreak = true;
		},
		// Invert Aura Master and Spirit Guide: reduce damage from aura moves instead of boosting
		onAnyModifyDamage(damage, source, target, move) { if (move.flags?.aura) { if (source.hasAbility('auramaster') || source.hasAbility('spritiguide')) { this.debug('Aura Break inverting Aura Master/Spirit Guide');
					return this.chainModify(0.67); // 1/1.5 to invert the 1.5x boost
				}
			}
		},
		// Invert Aura Master: damage instead of heal when hit by aura move
		onAnyDamagingHit(damage, target, source, move) { if (move.flags?.aura) { if (target.hasAbility('auramaster')) {
					this.damage(target.baseMaxhp / 4, target, null, this.effect);
					this.add('-message', `${target.name}'s Aura Master backfired!`);
				}
			}
		},
		onAnyFaintPriority: 2,
		onAnyFaint() { // Invert Soul Heart and Soul Eater
			const target = this.effectState.target;
			if (target.hasAbility('soulheart')) {
				this.boost({ spa: -1 }, target);
				this.add('-message', `${target.name}'s Soul Heart was inverted!`);
			}
			if (target.hasAbility('souleater')) {  this.damage(target.maxhp / 4, target, null, this.effect); }
		},
		onSuppressAbility(pokemon) {
			const suppressedAbilities = [
				'armortail', 'battery', 'beadsofruin', 'damp', 'electricsurge', 'friendguard', 'grassysurge', 'hadronengine', 'justified', 'klutz', 'levitate', 'magicbounce', 'magicguard', 'mistysurge',
				'moody', 'moxie', 'pressure', 'psychicsurge', 'orichalcumpulse', 'queenlymajesty', 'steelyspirit', 'swordofruin', 'tabletsofruin', 'teravolt', 'turboblaze', 'vesselofruin', 'victorystar',
				'auramaster', 'blazingvortex', 'drowsypower', 'forestscurse', 'hivemind', 'infernalheat', 'lingeringspirit', 'lunamancy', 'toxicsurge'
			];
			if (suppressedAbilities.includes(pokemon.ability)) { return true; }
		},
		flags: { breakable: 1 },
		name: "Aura Break",
		rating: 1,
		num: 188,
	},
	bulletproof: {
		onTryHit(pokemon, target, move) { if (move.flags['bullet']) { this.add('-immune', pokemon, '[from] ability: Bulletproof'); return null; } },
		flags: { breakable: 1 },
		name: "Bulletproof",
		rating: 3,
		num: 171,
	},
	cheekpouch: {
		onEatItem(item, pokemon) { this.heal(pokemon.baseMaxhp / 3); },
		flags: {},
		name: "Cheek Pouch",
		rating: 2,
		num: 167,
	},
	competitive: {
		onAfterEachBoost(boost, target, source, effect) {
			if (!source || target.isAlly(source)) { return; }
			let statsLowered = false;
			let i: BoostID;
			for (i in boost) { if (boost[i]! < 0) { statsLowered = true; } }
			if (statsLowered) { this.boost({ spa: 2 }, target, target, null, false, true); }
		},
		flags: {},
		name: "Competitive",
		rating: 2.5,
		num: 172,
	},
	darkaura: {
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Dark Aura');
		},
		onAnyBasePowerPriority: 20,
		onAnyBasePower(basePower, source, target, move) {
			if (target === source || move.category === 'Status' || move.type !== 'Dark') return;
			if (!move.auraBooster?.hasAbility('Dark Aura')) move.auraBooster = this.effectState.target;
			if (move.auraBooster !== this.effectState.target) return;
			return this.chainModify([move.hasAuraBreak ? 3072 : 5448, 4096]);
		},
		flags: {},
		name: "Dark Aura",
		rating: 3,
		num: 186,
	},
	deltastream: {
		onStart(source) { this.field.setWeather('deltastream'); },
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			if (this.field.getWeather().id === 'deltastream' && !strongWeathers.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherState.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('deltastream')) { this.field.weatherState.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		flags: {},
		name: "Delta Stream",
		rating: 4,
		num: 191,
	},
	desolateland: {
		onStart(source) { this.field.setWeather('sunnyday'); },
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			if (this.field.getWeather().id === 'desolateland' && !strongWeathers.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherState.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('desolateland')) { this.field.weatherState.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		flags: {},
		name: "Desolate Land",
		rating: 4.5,
		num: 190,
	},
	fairyaura: {
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Fairy Aura');
		},
		onAnyBasePowerPriority: 20,
		onAnyBasePower(basePower, source, target, move) {
			if (target === source || move.category === 'Status' || move.type !== 'Fairy') return;
			if (!move.auraBooster?.hasAbility('Fairy Aura')) move.auraBooster = this.effectState.target;
			if (move.auraBooster !== this.effectState.target) return;
			return this.chainModify([move.hasAuraBreak ? 3072 : 5448, 4096]);
		},
		flags: {},
		name: "Fairy Aura",
		rating: 3,
		num: 187,
	},
	flowerveil: { // Protects user from status, redirection, and stat lowering effects. Under Sun, Grassy, or Misty Terrain, also protects ally.
		onSetStatus(status, target, source, effect) { if (target.hasAbility('flowerveil')) { if (source && target !== source) { this.add('-block', target, 'ability: Flower Veil');
					return null;
				}
			}
		},
		onTryBoost(boost, target, source, effect) { if (target.hasAbility('flowerveil')) { if (source && target !== source) {
					let blocked = false;
					for (const i in boost) { if (boost[i]! < 0) {
							delete boost[i];
							blocked = true;
						}
					}
					if (blocked) this.add('-block', target, 'ability: Flower Veil');
				}
			}
		},
		onRedirectTarget(target, source, source2, move) { if (target.hasAbility('flowerveil')) { this.add('-block', target, 'ability: Flower Veil');
				return target;
			}
		},
		onAllySetStatus(status, target, source, effect) {
			const holder = this.effectState.target;
			if (holder.hasAbility('flowerveil')) {
				const terrain = this.field.terrain;
				const weather = this.field.weather;
				if ((terrain === 'grassyterrain' || terrain === 'mistyterrain' || weather === 'sunnyday' || weather === 'desolateland') && source && target !== source) { this.add('-block', target, 'ability: Flower Veil', `[of] ${holder}`);
					return null;
				}
			}
		},
		onAllyTryBoost(boost, target, source, effect) {
			const holder = this.effectState.target;
			if (holder.hasAbility('flowerveil')) {
				const terrain = this.field.terrain;
				const weather = this.field.weather;
				if ((terrain === 'grassyterrain' || terrain === 'mistyterrain' || weather === 'sunnyday' || weather === 'desolateland') && source && target !== source) {
					let blocked = false;
					for (const i in boost) {
						if (boost[i]! < 0) {
							delete boost[i];
							blocked = true;
						}
					}
					if (blocked) this.add('-block', target, 'ability: Flower Veil', `[of] ${holder}`);
				}
			}
		},
		onAllyRedirectTarget(target, source, source2, move) {
			const holder = this.effectState.target;
			if (holder.hasAbility('flowerveil')) {
				const terrain = this.field.terrain;
				const weather = this.field.weather;
				if ((terrain === 'grassyterrain' || terrain === 'mistyterrain' || weather === 'sunnyday' || weather === 'desolateland')) { this.add('-block', target, 'ability: Flower Veil', `[of] ${holder}`);
					return target;
				}
			}
		},
		flags: { breakable: 1 },
		name: "Flower Veil",
		rating: 0,
		num: 166,
		},
	furcoat: {
		onModifyDefPriority: 6,
		onModifyDef(def) { return this.chainModify(2); },
		onSourceModifyDamage(damage, source, target, move) { if (move.flags?.claw || move.flags?.slice) { this.debug('Fur Coat weakness to claw/slicing');
				return this.chainModify(2);
			}
		},
		flags: { breakable: 1 },
		name: "Fur Coat",
		rating: 4,
		num: 169,
		},
	galewings: {
		onModifyPriority(priority, pokemon, target, move) { if (move?.type === 'Flying' && pokemon.hp >= pokemon.maxhp / 2) return priority + 1; },
		onBasePower(basePower, pokemon, target, move) { if (move.flags?.wind || move.flags?.wing) { return this.chainModify(1.3); } },
		flags: {},
		name: "Gale Wings",
		rating: 1.5,
		num: 177,
		},
	gooey: {
		onDamagingHit(damage, target, source, move) { if (this.checkMoveMakesContact(move, source, target, true)) { this.add('-ability', target, 'Gooey');
				this.boost({ spe: -1 }, source, target, null, true);
			}
		},
		// New effect: When user lands a contact move, lower the target's Speed 1 stage
		onAfterMove(source, target, move) {
			if (!move || !move.flags['contact']) return;
			if (!target || !target.isActive) return;
			if (source.hasAbility('gooey')) { this.add('-ability', source, 'Gooey');
				this.boost({ spe: -1 }, target, source, null, true);
			}
		},
		flags: {},
		name: "Gooey",
		rating: 2,
		num: 183,
	},
	grasspelt: {
		onModifyDefPriority: 6,
		onModifyDef(pokemon) { if (this.field.isTerrain('grassyterrain')) return this.chainModify(2); },
		flags: { breakable: 1 },
		name: "Grass Pelt",
		rating: 0.5,
		num: 179,
	},
	magician: {
		onBasePower(basePower, attacker, defender, move) { if (move.flags && move.flags.magic) { return this.chainModify(1.5); } },
		onAfterMoveSecondarySelf(source, target, move) {
			if (!move || source.switchFlag === true || !move.hitTargets || source.item || source.volatiles['gem'] || move.id === 'fling' || move.category === 'Status') return;
			const hitTargets = move.hitTargets;
			this.speedSort(hitTargets);
			for (const pokemon of hitTargets) { if (pokemon !== source) {
				const yourItem = pokemon.takeItem(source);
				if (!yourItem) continue;
				if (!source.setItem(yourItem)) { pokemon.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
					continue;
				}
				this.add('-item', source, yourItem, '[from] ability: Magician', `[of] ${pokemon}`);
				return;
				}
			}
		},
		flags: {},
		name: "Magician",
		rating: 1,
		num: 170,
	},
	megalauncher: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) { if (move.flags['pulse'] || move.flags['aura'] || move.flags['beam'] || move.flags['bomb']) { return this.chainModify(1.5); } },
		flags: {},
		name: "Mega Launcher",
		rating: 3,
		num: 178,
	},
	parentalbond: { // Damage modifier implemented in BattleActions#modifyDamage()
		onPrepareHit(source, target, move) {
			if (move.category === 'Status' || move.multihit || move.flags['noparentalbond'] || move.flags['charge'] || move.flags['futuremove'] || move.spreadHit || move.isZ || move.isMax) return;
			move.multihit = 2;
			move.multihitType = 'parentalbond';
		},
		// hack to prevent accidentally suppressing King's Rock/Razor Fang
		onSourceModifySecondaries(secondaries, target, source, move) { if (move.multihitType === 'parentalbond' && move.id === 'secretpower' && move.hit < 2) { return secondaries.filter(effect => effect.volatileStatus === 'flinch' || effect.volatileStatus === 'tripped'); } },
		flags: {},
		name: "Parental Bond",
		rating: 4.5,
		num: 185,
	},
	pixilate: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [ 'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball', ];
			if (move.type === 'Normal' && (!noModifyType.includes(move.id) || this.activeMove?.isMax) && !(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Fairy';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) { if (move.typeChangerBoosted === this.effect) return this.chainModify(1.3); },
		flags: {},
		name: "Pixilate",
		rating: 4,
		num: 182,
	},
	primordialsea: {
		onStart(source) { this.field.setWeather('primordialsea'); },
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			if (this.field.getWeather().id === 'primordialsea' && !strongWeathers.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherState.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('primordialsea')) { this.field.weatherState.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		flags: {},
		name: "Primordial Sea",
		rating: 4.5,
		num: 189,
	},
	protean: {
		onPrepareHit(source, target, move) {
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch' || move.callsMove) return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] ability: Protean');
			}
		},
		flags: {},
		name: "Protean",
		rating: 4,
		num: 168,
	},
	refrigerate: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [ 'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball', ];
			if (move.type === 'Normal' && (!noModifyType.includes(move.id) || this.activeMove?.isMax) && !(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Ice';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) { if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]); },
		flags: {},
		name: "Refrigerate",
		rating: 4,
		num: 174,
	},
	stancechange: {
		onModifyMovePriority: 1,
		onModifyMove(move, attacker, defender) {
			if (attacker.species.baseSpecies !== 'Aegislash' || attacker.transformed) return;
			if (move.category === 'Status' && move.id !== 'kingsshield') return;
			const targetForme = (move.id === 'kingsshield' ? 'Aegislash' : 'Aegislash-Blade');
			if (attacker.species.name !== targetForme) attacker.formeChange(targetForme);
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Stance Change",
		rating: 4,
		num: 176,
	},
	strongjaw: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) { if (move.flags['bite']) { return this.chainModify(1.5); } },
		flags: {},
		name: "Strong Jaw",
		rating: 3.5,
		num: 173,
	},
	sweetveil: {
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Sweet Veil');
		},
		onAllySetStatus(status, target, source, effect) { if (status.id === 'slp') {
				this.debug('Sweet Veil interrupts sleep');
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Sweet Veil', `[of] ${effectHolder}`);
				return null;
			}
		},
		onAllyTryAddVolatile(status, target) { if (status.id === 'yawn') {
				this.debug('Sweet Veil blocking yawn');
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Sweet Veil', `[of] ${effectHolder}`);
				return null;
			}
		},
		onAnyModifyAtk(atk, target, source, move) {
			const abilityHolder = this.effectState.target;
			if (target.hasAbility('sweetveil')) return;
			if (!move.ruinedAtk?.hasAbility('sweetveil')) move.ruinedAtk = abilityHolder;
			if (move.ruinedAtk !== abilityHolder) return;
			this.debug('Sweet Veil Atk drop');
			return this.chainModify(0.85);
		},
		flags: { breakable: 1 },
		name: "Sweet Veil",
		rating: 2,
		num: 175,
	},
	symbiosis: {
		onAfterHeal(damage, pokemon, source, effect) {
			if (!pokemon.allies().length) return;
			for (const ally of pokemon.allies()) { if (ally && !ally.fainted) {
					const healAmount = Math.floor(damage * 0.5);
					if (healAmount > 0) { this.add('-activate', pokemon, 'ability: Symbiosis');
						this.heal(healAmount, ally, pokemon);
					}
				}
			}
		},
		onAllyBoost(boost, target, source, effect) {
			const pokemon = this.effectState.target;
			if (target === pokemon || !target || target.fainted) return;
			const copyBoost: {[stat: string]: number} = {};
			let statCopied = false;
			for (const stat in boost) { if (boost[stat as BoostID]) {
					copyBoost[stat] = boost[stat as BoostID]!;
					statCopied = true;
				}
			}
			if (statCopied) { this.add('-activate', pokemon, 'ability: Symbiosis');
				this.boost(copyBoost as SparseBoostsTable, pokemon, pokemon);
			}
		},
		flags: {},
		name: "Symbiosis",
		rating: 0,
		num: 180,
	},
	toughclaws: {
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) { if (move.flags && move.flags.claw) { return this.chainModify(1.5); } 
			else if (move.flags && move.flags.contact) { return this.chainModify([5325, 4096]); }
		},
		flags: {},
		name: "Tough Claws",
		rating: 3.5,
		num: 181,
	},



	// #region Gen 7 Abilities
	battery: {
		onAllyBasePowerPriority: 22,
		onAllyBasePower(basePower, attacker, defender, move) { if (attacker !== this.effectState.target && move.category === 'Special') { if (this.effectState.target.volatiles['charged']) { this.debug('Battery supercharged boost');
					return this.chainModify(1.5);
				}
				this.debug('Battery boost');
				return this.chainModify([5325, 4096]);
			}
		},
		onHit(target, source, move) { if (move.type === 'Electric' && target.hasAbility('battery')) { if (!target.volatiles['charged']) {
					target.addVolatile('charged');
					this.add('-start', target, 'charged', '[from] ability: Battery');
				}
			}
		},
		flags: {},
		name: "Battery",
		rating: 0,
		num: 217,
	},
	battlebond: {
		onSourceAfterFaint(length, target, source, effect) {
			if (source.bondTriggered) return;
			if (effect?.effectType !== 'Move') return;
			if (source.species.id === 'greninjabond' && source.hp && !source.transformed && source.side.foePokemonLeft()) {
				this.boost({ atk: 1, spa: 1, spe: 1 }, source, source, this.effect);
				this.add('-activate', source, 'ability: Battle Bond');
				source.bondTriggered = true;
			}
		},
		onModifyMovePriority: -1,
		onModifyMove(move, attacker) { if (move.id === 'watershuriken' && attacker.species.name === 'Greninja-Ash' && !attacker.transformed) { move.multihit = 3; } },
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Battle Bond",
		rating: 3.5,
		num: 210,
	},
	beastboost: {
		onSourceAfterFaint(length, target, source, effect) { if (effect && effect.effectType === 'Move') {
				const bestStat = source.getBestStat(true, true);
				this.boost({ [bestStat]: length }, source);
			}
		},
		flags: {},
		name: "Beast Boost",
		rating: 3.5,
		num: 224,
	},
	berserk: {
		onDamage(damage, target, source, effect) { if ( effect.effectType === "Move" && !effect.multihit && !(effect.hasSheerForce && source.hasAbility('sheerforce')) ) 
			{ this.effectState.checkedBerserk = false; } 
			else { this.effectState.checkedBerserk = true; }
		},
		onTryEatItem(item) {
			const healingItems = [ 'aguavberry', 'enigmaberry', 'figyberry', 'iapapaberry', 'magoberry', 'sitrusberry', 'wikiberry', 'oranberry', 'berryjuice', ];
			if (healingItems.includes(item.id)) { return this.effectState.checkedBerserk; }
			return true;
		},
		onAfterMoveSecondary(target, source, move) {
			this.effectState.checkedBerserk = true;
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			const lastAttackedBy = target.getLastAttackedBy();
			if (!lastAttackedBy) return;
			const damage = move.multihit && !move.smartTarget ? move.totalDamage : lastAttackedBy.damage;
			if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) { this.boost({ spa: 1 }, target, target); }
		},
		flags: {},
		name: "Berserk",
		rating: 2,
		num: 201,
	},
	comatose: {
		onStart(pokemon) { this.add('-ability', pokemon, 'Comatose'); },
		onSetStatus(status, target, source, effect) { if ((effect as Move)?.status) { this.add('-immune', target, '[from] ability: Comatose'); }
			return false;
		}, // Permanent sleep "status" implemented in the relevant sleep-checking effects
		flags: { noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Comatose",
		rating: 4,
		num: 213,
	},
	corrosion: { // Implemented in sim/pokemon.js:Pokemon#setStatus
		flags: {},
		name: "Corrosion",
		rating: 2.5,
		num: 212,
	},
	dancer: {
	    onBasePower(basePower, attacker, defender, move) {if (move.flags && move.flags.dance) {  return this.chainModify(1.2);  } },
	    flags: {},
	    name: "Dancer", 
	    rating: 1.5,
		num: 216,
	},
	dazzling: {
		onFoeTryMove(target, source, move) {
			const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
			if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) { return; }
			const dazzlingHolder = this.effectState.target;
			if ((source.isAlly(dazzlingHolder) || move.target === 'all') && move.priority > 0.1) {
				this.attrLastMove('[still]');
				this.add('cant', dazzlingHolder, 'ability: Dazzling', move, `[of] ${target}`);
				return false;
			}
		},
		flags: { breakable: 1 },
		name: "Dazzling",
		rating: 2.5,
		num: 219,
	},
	disguise: {
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) { if (effect?.effectType === 'Move' && ['mimikyu', 'mimikyutotem'].includes(target.species.id)) { this.add('-activate', target, 'ability: Disguise');
				this.effectState.busted = true;
				return 0;
			}
		},
		onCriticalHit(target, source, move) {
			if (!target) return;
			if (!['mimikyu', 'mimikyutotem'].includes(target.species.id)) { return; }
			const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;
			if (!target.runImmunity(move)) return;
			return false;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target || move.category === 'Status') return;
			if (!['mimikyu', 'mimikyutotem'].includes(target.species.id)) { return; }
			const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;
			if (!target.runImmunity(move)) return;
			return 0;
		},
		onUpdate(pokemon) { if (['mimikyu', 'mimikyutotem'].includes(pokemon.species.id) && this.effectState.busted) {
				const speciesid = pokemon.species.id === 'mimikyutotem' ? 'Mimikyu-Busted-Totem' : 'Mimikyu-Busted';
				pokemon.formeChange(speciesid, this.effect, true);
				this.damage(pokemon.baseMaxhp / 8, pokemon, pokemon, this.dex.species.get(speciesid));
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1, breakable: 1, notransform: 1, },
		name: "Disguise",
		rating: 3.5,
		num: 209,
	},
	electricsurge: {
		onStart(source) { this.field.setTerrain('electricterrain'); },
		flags: {},
		name: "Electric Surge",
		rating: 4,
		num: 226,
	},
	emergencyexit: {
		onEmergencyExit(target) {
			if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
			for (const side of this.sides) { for (const active of side.active) { active.switchFlag = false; } }
			target.switchFlag = true;
			this.add('-activate', target, 'ability: Emergency Exit');
		},
		flags: {},
		name: "Emergency Exit",
		rating: 1,
		num: 194,
	},
	fluffy: {
		onSourceModifyDamage(damage, source, target, move) {
			let mod = 1;
			if (move.type === 'Fire') mod *= 2;
			if (move.flags['contact']) mod /= 2;
			return this.chainModify(mod);
		},
		flags: { breakable: 1 },
		name: "Fluffy",
		rating: 3.5,
		num: 218,
	},
	fullmetalbody: {
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			let i: BoostID;
			for (i in boost) { if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries && effect.id !== 'octolock') { this.add("-fail", target, "unboost", "[from] ability: Full Metal Body", `[of] ${target}`); }
		},
		onSourceModifyDamage(damage, source, target, move) { if ( (move.flags?.bullet || move.flags?.kick || move.flags?.pierce || move.flags?.punch || move.flags?.slice) ) { this.debug('Full Metal Body resistance');
				return this.chainModify(0.5);
			}
		},
		flags: {},
		name: "Full Metal Body",
		rating: 2,
		num: 230,
		},
	galvanize: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [ 'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball', ];
			if (move.type === 'Normal' && (!noModifyType.includes(move.id) || this.activeMove?.isMax) && !(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Electric';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) { if (move.typeChangerBoosted === this.effect) return this.chainModify(1.5); },
		flags: {},
		name: "Galvanize",
		rating: 4,
		num: 206,
	},
	grassysurge: {
		onStart(source) { this.field.setTerrain('grassyterrain'); },
		flags: {},
		name: "Grassy Surge",
		rating: 4,
		num: 229,
	},
	innardsout: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) { if (!target.hp) { this.damage(target.getUndynamaxedHP(damage), source, target); } },
		flags: {},
		name: "Innards Out",
		rating: 4,
		num: 215,
	},
	liquidvoice: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) { if (move.flags['sound'] && !pokemon.volatiles['dynamax']) {  move.type = 'Water'; } },
        onBasePower(basePower, attacker, defender, move) { if (move.flags['sound']) { return this.chainModify(1.2); } },
		flags: {},
		name: "Liquid Voice",
		rating: 1.5,
		num: 204,
	},
	longreach: {
		onModifyMove(move) { delete move.flags['contact']; },
		flags: {},
		name: "Long Reach",
		rating: 1,
		num: 203,
	},
	merciless: {
		onModifyCritRatio(critRatio, source, target) { if (target && ['psn', 'tox'].includes(target.status)) return 5; },
		flags: {},
		name: "Merciless",
		rating: 1.5,
		num: 196,
	},
	mistysurge: {
		onStart(source) { this.field.setTerrain('mistyterrain'); },
		flags: {},
		name: "Misty Surge",
		rating: 3.5,
		num: 228,
	},
	neuroforce: {
		onModifyDamage(damage, source, target, move) {
			if (move && move.type === 'Psychic') { move.ignoreImmunity = true; }
			if (move && target.getMoveHitData(move).typeMod > 0) { return this.chainModify(1.3); }
		},
		flags: {},
		name: "Neuroforce",
		rating: 2.5,
		num: 233,
	},
	powerconstruct: {
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Zygarde' || pokemon.transformed || !pokemon.hp) return;
			if (pokemon.species.id === 'zygardecomplete' || pokemon.hp > pokemon.maxhp / 2) return;
			this.add('-activate', pokemon, 'ability: Power Construct');
			pokemon.formeChange('Zygarde-Complete', this.effect, true);
			pokemon.canMegaEvo = pokemon.canMegaEvo === false ? false : this.actions.canMegaEvo(pokemon);
			pokemon.formeRegression = true;
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Power Construct",
		rating: 5,
		num: 211,
	},
	powerofalchemy: {
		onAllyFaint(target) {
			if (!this.effectState.target.hp) return;
			const ability = target.getAbility();
			if (ability.flags['noreceiver'] || ability.id === 'noability') return;
			this.effectState.target.setAbility(ability, target);
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.flags?.magic) {
				this.debug('Power of Alchemy magic resistance');
				return this.chainModify(0.75);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1 },
		name: "Power of Alchemy",
		shortDesc: "Copies ally's ability on faint. Resists magic moves (0.75x damage).",
		rating: 0,
		num: 223,
	},
	prismarmor: {
		onSourceModifyDamage(damage, source, target, move) { if (target.getMoveHitData(move).typeMod > 0) { this.debug('Prism Armor neutralize');
				return this.chainModify(0.75);
			}
		},
		onTryHit(target, source, move) { if (move.flags && (move.flags.beam || move.flags.light)) { this.add('-immune', target, '[from] ability: Prism Armor');
				return null;
			}
		},
		flags: {},
		name: "Prism Armor",
		rating: 3,
		num: 232,
	},
	psychicsurge: {
		onStart(source) { this.field.setTerrain('psychicterrain');  },
		flags: {},
		name: "Psychic Surge",
		rating: 4,
		num: 227,
	},
	queenlymajesty: {
		onFoeTryMove(target, source, move) {
			const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
			if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) { return; }
			const dazzlingHolder = this.effectState.target;
			if ((source.isAlly(dazzlingHolder) || move.target === 'all') && move.priority > 0.1) {
				this.attrLastMove('[still]');
				this.add('cant', dazzlingHolder, 'ability: Queenly Majesty', move, `[of] ${target}`);
				return false;
			}
		},
		flags: { breakable: 1 },
		name: "Queenly Majesty",
		rating: 2.5,
		num: 214,
	},
	receiver: {
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags && move.flags.throwing) { this.debug('Receiver throwing boost');
				return this.chainModify([1300, 1000]);
			}
		},
		onTryHit(target, source, move) { if (move.flags && move.flags.throwing) { this.add('-activate', target, 'ability: Receiver');
				this.useMove('throwback', target, source);
				return null;
			}
			if (move.id === 'fling') { // Handle Fling: catch the item if user has no item
				const sourceItem = source.getItem();
				if (sourceItem && !target.item) { this.add('-activate', target, 'ability: Receiver');
					target.setItem(sourceItem);
					source.setItem(null);
					return null;
				}
			}
		},
		onAllyFaint(target) {
			if (!this.effectState.target.hp) return;
			const ability = target.getAbility();
			if (ability.flags['noreceiver'] || ability.id === 'noability') return;
			this.effectState.target.setAbility(ability, target);
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1 },
		name: "Receiver",
		rating: 2,
		num: 222,
	},
	rkssystem: { // RKS System's type-changing itself is implemented in statuses.js
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "RKS System",
		rating: 4,
		num: 225,
	},
	schooling: {
		onSwitchInPriority: -1,
		onStart(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 || pokemon.transformed) return;
			if (pokemon.hp > pokemon.maxhp / 4) { if (pokemon.species.id === 'wishiwashi') { pokemon.formeChange('Wishiwashi-School'); }
			} else { if (pokemon.species.id === 'wishiwashischool') { pokemon.formeChange('Wishiwashi'); } }
		},
		onResidualOrder: 29,
		onResidual(pokemon) { 
			if ( pokemon.baseSpecies.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 || pokemon.transformed || !pokemon.hp )  return;
			if (pokemon.hp > pokemon.maxhp / 4) { if (pokemon.species.id === 'wishiwashi') { pokemon.formeChange('Wishiwashi-School'); } } 
			else { if (pokemon.species.id === 'wishiwashischool') { pokemon.formeChange('Wishiwashi'); } }
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Schooling",
		rating: 3,
		num: 208,
	},
	shadowshield: {
		onSourceModifyDamage(damage, source, target, move) { if (target.hp >= target.maxhp) { this.debug('Shadow Shield weaken');
				return this.chainModify(0.5);
			}
		},
		onTryHit(target, source, move) { if (move.flags && move.flags.shadow) { this.add('-immune', target, '[from] ability: Shadow Shield');
				return null;
			}
		},
		onTrapPrevention(pokemon, trapper) { if (trapper.hasAbility('shadowtag')) { return false; } },
		flags: {},
		name: "Shadow Shield",
		rating: 4,
		num: 231,
	},
	shieldsdown: {
		onSwitchInPriority: -1,
		onStart(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Minior' || pokemon.transformed) return;
			if (pokemon.hp > pokemon.maxhp / 2) { if (pokemon.species.forme !== 'Meteor') { pokemon.formeChange('Minior-Meteor'); } } 
			else { if (pokemon.species.forme === 'Meteor') { pokemon.formeChange(pokemon.set.species); } }
		},
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Minior' || pokemon.transformed || !pokemon.hp) return;
			if (pokemon.hp > pokemon.maxhp / 2) { if (pokemon.species.forme !== 'Meteor') { pokemon.formeChange('Minior-Meteor'); } }
			 else { if (pokemon.species.forme === 'Meteor') { this.field.setWeather('turbulentwinds');
					pokemon.formeChange(pokemon.set.species);
				}
			}
		},
		onSetStatus(status, target, source, effect) {
			if (target.species.id !== 'miniormeteor' || target.transformed) return;
			// Allow aura and drowsy status, block all others
			if (status.id === 'aura' || status.id === 'drowsy') return;
			if ((effect as Move)?.status) { this.add('-immune', target, '[from] ability: Shields Down'); }
			return false;
		},
		onTryAddVolatile(status, target) {
			if (target.species.id !== 'miniormeteor' || target.transformed) return;
			// Allow aura and drowsy, block yawn
			if (status.id === 'aura' || status.id === 'drowsy') return;
			if (status.id !== 'yawn') return;
			this.add('-immune', target, '[from] ability: Shields Down');
			return null;
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Shields Down",
		rating: 3,
		num: 197,
	},
	slushrush: {
		onModifySpe(spe, pokemon) { if (this.field.isWeather(['hail', 'snowscape'])) { return this.chainModify(2); } },
		flags: {},
		name: "Slush Rush",
		rating: 3,
		num: 202,
	},
	soulheart: {
		onAnyFaintPriority: 1,
		onAnyFaint() {
			const target = this.effectState.target;
			this.boost({ spa: 1 }, target);
			// Extend aura duration by 1 turn if user has an active aura
			if (target.status === 'aura' && target.statusState.time) {
				target.statusState.time++;
				this.add('-message', `${target.name}'s aura was extended!`);
			}
		},
		flags: {},
		name: "Soul-Heart",
		rating: 3.5,
		num: 220,
	},
	stakeout: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender) { if (!defender.activeTurns) { this.debug('Stakeout boost');
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender) { if (!defender.activeTurns) { this.debug('Stakeout boost');
				return this.chainModify(2);
			}
		},
		flags: {},
		name: "Stakeout",
		rating: 4.5,
		num: 198,
	},
	stamina: {
		onDamagingHit(damage, target, source, effect) { this.boost({ def: 1 }); },
		flags: {},
		name: "Stamina",
		rating: 4,
		num: 192,
	},
	steelworker: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) { if (move.type === 'Steel') { this.debug('Steelworker boost');
				return this.chainModify(1.5);
 			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) { if (move.type === 'Steel') { this.debug('Steelworker boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Steelworker",
		rating: 3.5,
		num: 200,
	},
	surgesurfer: {
		onModifySpe(spe, pokemon) { if (this.field.getTerrain()) { return this.chainModify(2); } },
		onModifyMove(move, pokemon) { if (move.id === 'surf' && this.field.getTerrain()) {
				move.basePower = 105;
				const terrain = this.field.getTerrain();
				let secondaryType = null;
				if (terrain.id === 'electricterrain') secondaryType = 'Electric';
				else if (terrain.id === 'grassyterrain') secondaryType = 'Grass';
				else if (terrain.id === 'psychicterrain') secondaryType = 'Psychic';
				else if (terrain.id === 'mistyterrain') secondaryType = 'Fairy';
				else if (terrain.id === 'toxicterrain') secondaryType = 'Poison';
				if (secondaryType) { if (!move.secondaries) move.secondaries = [];
					move.type = 'Water';
					(move as any).secondaryTypes = [secondaryType];
				}
			}
		},
		flags: {},
		name: "Surge Surfer",
		rating: 3,
		num: 207,
	},
	tanglinghair: {
		onDamagingHit(damage, target, source, move) { if (this.checkMoveMakesContact(move, source, target, true)) { this.add('-ability', target, 'Tangling Hair');
				this.boost({ spe: -1 }, source, target, null, true);
                source.addVolatile('partiallytrapped', target, target, this.dex.conditions.get('bind'));
			}
		},
		flags: {},
		name: "Tangling Hair",
		rating: 2,
		num: 221,
	},
	triage: {
		onModifyPriority(priority, pokemon, target, move) { if (move?.flags['heal']) return priority + 3; },
		flags: {},
		name: "Triage",
		rating: 3.5,
		num: 205,
	},
	waterbubble: {
		onSourceModifyAtkPriority: 5,
		onSourceModifyAtk(atk, attacker, defender, move) { if ( move.type === 'Fire' || move.flags?.crush || move.flags?.explosive || move.flags?.sound )  { return this.chainModify(0.5); } },
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) { if ( move.type === 'Fire' || move.flags?.crush || move.flags?.explosive || move.flags?.sound )  { return this.chainModify(0.5); } },
		onModifyAtk(atk, attacker, defender, move) { if (move.type === 'Water') { return this.chainModify(2); } },
		onModifySpA(atk, attacker, defender, move) { if (move.type === 'Water') { return this.chainModify(2); } },
		onUpdate(pokemon) { if (pokemon.status === 'brn') { this.add('-activate', pokemon, 'ability: Water Bubble');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if ((effect as Move)?.status) { this.add('-immune', target, '[from] ability: Water Bubble'); }
			return false;
		},
		flags: { breakable: 1 },
		name: "Water Bubble",
		rating: 4.5,
		num: 199,
	},
	watercompaction: {
		onTryHit(target, source, move) { if (move.type === 'Water' && target !== source) { this.add('-immune', target, '[from] ability: Water Compaction');
				this.boost({ def: 2 }, target, target, this.effect);
				return null;
			}
		},
		flags: {},
		name: "Water Compaction",
		rating: 1.5,
		num: 195,
	},
	wimpout: {
		onEmergencyExit(target) {
			if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
			for (const side of this.sides) { for (const active of side.active) { active.switchFlag = false; } }
			target.switchFlag = true;
			this.add('-activate', target, 'ability: Wimp Out');
		},
		flags: {},
		name: "Wimp Out",
		rating: 1,
		num: 193,
	},



	// #region Gen 8 Abilities
	asoneglastrier: {
		onSwitchInPriority: 1,
		onStart(pokemon) {
			if (this.effectState.unnerved) return;
			this.add('-ability', pokemon, 'As One');
			this.add('-ability', pokemon, 'Unnerve');
			this.effectState.unnerved = true;
		},
		onEnd() { this.effectState.unnerved = false; },
		onFoeTryEatItem() { return !this.effectState.unnerved; },
		onSourceAfterFaint(length, target, source, effect) { if (effect && effect.effectType === 'Move') { this.boost({ atk: length }, source, source, this.dex.abilities.get('chillingneigh')); } },
		flags: { noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "As One (Glastrier)",
		rating: 3.5,
		num: 266,
	},
	asonespectrier: {
		onSwitchInPriority: 1,
		onStart(pokemon) {
			if (this.effectState.unnerved) return;
			this.add('-ability', pokemon, 'As One');
			this.add('-ability', pokemon, 'Unnerve');
			this.effectState.unnerved = true;
		},
		onEnd() { this.effectState.unnerved = false; },
		onFoeTryEatItem() { return !this.effectState.unnerved; },
		onSourceAfterFaint(length, target, source, effect) { if (effect && effect.effectType === 'Move') { this.boost({ spa: length }, source, source, this.dex.abilities.get('grimneigh')); } },
		flags: { noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "As One (Spectrier)",
		rating: 3.5,
		num: 267,
	},
	ballfetch: {
		flags: {},
		name: "Ball Fetch",
		rating: 0,
		num: 237,
	},
	chillingneigh: {
		onSourceAfterFaint(length, target, source, effect) { if (effect && effect.effectType === 'Move') { this.boost({ atk: length }, source); } },
		flags: {},
		name: "Chilling Neigh",
		rating: 3,
		num: 264,
	},
	cottondown: {
		onDamagingHit(damage, target, source, move) {
			let activated = false;
			for (const pokemon of this.getAllActive()) {
				if (pokemon === target || pokemon.fainted) continue;
				if (!activated) { this.add('-ability', target, 'Cotton Down');
					activated = true;
				}
				this.boost({ spe: -1 }, pokemon, target, null, true);
			}
		},
		flags: {},
		name: "Cotton Down",
		rating: 2,
		num: 238,
	},
	curiousmedicine: {
		onStart(pokemon) {
			for (const ally of pokemon.adjacentAllies()) {
				let removedCount = 0;
				// Count and clear stat stages
				for (const stat in ally.boosts) { if (ally.boosts[stat as BoostID]) { removedCount += Math.abs(ally.boosts[stat as BoostID]); } }
				if (removedCount > 0) {
					ally.clearBoosts();
					this.add('-clearboost', ally, '[from] ability: Curious Medicine', `[of] ${pokemon}`);
				}
				
				// Count and cure status
				if (ally.status) {
					removedCount++;
					ally.cureStatus();
				}
				if (removedCount > 0) { this.heal(ally.baseMaxhp * removedCount / 7, ally, pokemon, this.effect); }
			}
		},
		flags: {},
		name: "Curious Medicine",
		rating: 0,
		num: 261,
	},
	dauntlessshield: {
		onStart(pokemon) {
			if (pokemon.shieldBoost) return;
			pokemon.shieldBoost = true;
			pokemon.setStatus('aura', pokemon, {
				auraAbility: 'imperialbastion',
				auraName: 'Imperial Bastion',
				auraDuration: 4,
			} as any);
		},
		onBasePower(basePower, attacker, defender, move) {
			let multiplier = 1;
			if (move.flags?.weapon) { multiplier *= 1.2; }
			if (move.flags?.crash) { multiplier *= 1.1; }
			if (multiplier !== 1) { return this.chainModify(multiplier); }
		},
		flags: {},
		name: "Dauntless Shield",
		rating: 3.5,
		num: 235,
	},
	dragonsmaw: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) { if (move.type === 'Dragon' || move.flags['bite']) { this.debug("Dragon's Maw boost");
			return this.chainModify(1.5);
		}
		return atk;
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) { if (move.type === 'Dragon' || move.flags['bite']) { this.debug("Dragon's Maw boost");
			return this.chainModify(1.5);
		}
		return atk;
		},
		flags: {},
		name: "Dragon's Maw",
		rating: 3.5,
		num: 263,
	},
	gorillatactics: {
		onStart(pokemon) { pokemon.abilityState.choiceLock = ""; },
		onBeforeMove(pokemon, target, move) {
			if (move.isZOrMaxPowered || move.id === 'struggle') return;
			if (pokemon.abilityState.choiceLock && pokemon.abilityState.choiceLock !== move.id) { // Fails unless ability is being ignored (these events will not run), no PP lost.
				this.addMove('move', pokemon, move.name);
				this.attrLastMove('[still]');
				this.debug("Disabled by Gorilla Tactics");
				this.add('-fail', pokemon);
				return false;
			}
		},
		onModifyMove(move, pokemon) {
			if (pokemon.abilityState.choiceLock || move.isZOrMaxPowered || move.id === 'struggle') return;
			pokemon.abilityState.choiceLock = move.id;
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.volatiles['dynamax']) return;
			this.debug('Gorilla Tactics Atk Boost');
			return this.chainModify(1.5);
		},
		onDisableMove(pokemon) {
			if (!pokemon.abilityState.choiceLock) return;
			if (pokemon.volatiles['dynamax']) return;
			for (const moveSlot of pokemon.moveSlots) { if (moveSlot.id !== pokemon.abilityState.choiceLock) { pokemon.disableMove(moveSlot.id, false, this.effectState.sourceEffect); } }
		},
		onEnd(pokemon) { pokemon.abilityState.choiceLock = ""; },
		flags: {},
		name: "Gorilla Tactics",
		rating: 4.5,
		num: 255,
	},
	grimneigh: {
		onSourceAfterFaint(length, target, source, effect) { if (effect && effect.effectType === 'Move') { this.boost({ spa: length }, source); } },
		flags: {},
		name: "Grim Neigh",
		rating: 3,
		num: 265,
	},
	gulpmissile: {
		onDamagingHit(damage, target, source, move) {
			if (!source.hp || !source.isActive || target.isSemiInvulnerable()) return;
			if (['cramorantgulping', 'cramorantgorging'].includes(target.species.id)) {
				this.damage(source.baseMaxhp / 4, source, target);
				if (target.species.id === 'cramorantgulping') { this.boost({ def: -1 }, source, target, null, true); } 
				else { source.trySetStatus('par', target, move);  }
				target.formeChange('cramorant', move);
			}
		},
		onSourceTryPrimaryHit(target, source, effect) { // The Dive part of this mechanic is implemented in Dive's `onTryMove` in moves.ts
			if (effect?.id === 'surf' && source.hasAbility('gulpmissile') && source.species.name === 'Cramorant') {
				const forme = source.hp <= source.maxhp / 2 ? 'cramorantgorging' : 'cramorantgulping';
				source.formeChange(forme, effect);
			}
		},
		flags: { cantsuppress: 1, notransform: 1 },
		name: "Gulp Missile",
		rating: 2.5,
		num: 241,
	},
	hungerswitch: {
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (pokemon.species.baseSpecies !== 'Morpeko' || pokemon.terastallized) return;
			const targetForme = pokemon.species.name === 'Morpeko' ? 'Morpeko-Hangry' : 'Morpeko';
			pokemon.formeChange(targetForme);
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Hunger Switch",
		rating: 1,
		num: 258,
	},
	iceface: {
		onSwitchInPriority: -2,
		onStart(pokemon) { if (this.field.isWeather(['hail', 'snowscape']) && pokemon.species.id === 'eiscuenoice') { this.add('-activate', pokemon, 'ability: Ice Face');
				this.effectState.busted = false;
				pokemon.formeChange('Eiscue', this.effect, true);
			}
		},
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) { if (effect?.effectType === 'Move' && effect.category === 'Physical' && target.species.id === 'eiscue') { this.add('-activate', target, 'ability: Ice Face');
				this.effectState.busted = true;
				return 0;
			}
		},
		onCriticalHit(target, type, move) {
			if (!target) return;
			if (move.category !== 'Physical' || target.species.id !== 'eiscue') return;
			if (target.volatiles['substitute'] && !(move.flags['bypasssub'] || move.infiltrates)) return;
			if (!target.runImmunity(move)) return;
			return false;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target) return;
			if (move.category !== 'Physical' || target.species.id !== 'eiscue') return;
			const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;
			if (!target.runImmunity(move)) return;
			return 0;
		},
		onUpdate(pokemon) { if (pokemon.species.id === 'eiscue' && this.effectState.busted) { pokemon.formeChange('Eiscue-Noice', this.effect, true); } },
		onWeatherChange(pokemon, source, sourceEffect) { // snow/hail resuming because Cloud Nine/Air Lock ended does not trigger Ice Face
			if ((sourceEffect as Ability)?.suppressWeather) return;
			if (!pokemon.hp) return;
			if (this.field.isWeather(['hail', 'snowscape']) && pokemon.species.id === 'eiscuenoice') { this.add('-activate', pokemon, 'ability: Ice Face');
				this.effectState.busted = false;
				pokemon.formeChange('Eiscue', this.effect, true);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1, breakable: 1, notransform: 1, },
		name: "Ice Face",
		rating: 3,
		num: 248,
	},
	icescales: {
		onSourceModifyDamage(damage, source, target, move) { if (move.category === 'Special') { return this.chainModify(0.5); } },
		flags: { breakable: 1 },
		name: "Ice Scales",
		rating: 4,
		num: 246,
	},
	intrepidsword: {
		onStart(pokemon) {
			if (pokemon.swordBoost) return;
			pokemon.swordBoost = true;
			pokemon.setStatus('aura', pokemon, {
				auraAbility: 'giantslayer',
				auraName: 'Giant Slayer',
				auraDuration: 4,
			} as any);
		},
		onBasePower(basePower, attacker, defender, move) {
			let multiplier = 1;
			if (move.flags?.weapon) { multiplier *= 1.2; }
			if (move.flags?.slicing) { multiplier *= 1.1; }
			if (multiplier !== 1) { return this.chainModify(multiplier); }
		},
		flags: {},
		name: "Intrepid Sword",
		rating: 4,
		num: 234,
	},
	libero: {
		onPrepareHit(source, target, move) {
			if (this.effectState.libero) return;
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch' || move.callsMove) return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.effectState.libero = true;
				this.add('-start', source, 'typechange', type, '[from] ability: Libero');
			}
		},
		flags: {},
		name: "Libero",
		rating: 4,
		num: 236,
	},
	mimicry: {
		onSwitchInPriority: -1,
		onStart(pokemon) { this.singleEvent('TerrainChange', this.effect, this.effectState, pokemon); },
		onTerrainChange(pokemon) {
			let types;
			switch (this.field.terrain) {
			case 'electricterrain':
				types = ['Electric'];
				break;
			case 'grassyterrain':
				types = ['Grass'];
				break;
			case 'mistyterrain':
				types = ['Fairy'];
				break;
			case 'psychicterrain':
				types = ['Psychic'];
				break;
			default:
				types = pokemon.baseSpecies.types;
			}
			const oldTypes = pokemon.getTypes();
			if (oldTypes.join() === types.join() || !pokemon.setType(types)) return;
			if (this.field.terrain || pokemon.transformed) { this.add('-start', pokemon, 'typechange', types.join('/'), '[from] ability: Mimicry');
				if (!this.field.terrain) this.hint("Transform Mimicry changes you to your original un-transformed types.");
			} else {
				this.add('-activate', pokemon, 'ability: Mimicry');
				this.add('-end', pokemon, 'typechange', '[silent]');
			}
		},
		flags: {},
		name: "Mimicry",
		rating: 0,
		num: 250,
	},
	mirrorarmor: {
		onTryBoost(boost, target, source, effect) { // Don't bounce self stat changes, or boosts that have already bounced
			if (!source || target === source || !boost || effect.name === 'Mirror Armor') return;
			let b: BoostID;
			for (b in boost) { if (boost[b]! < 0) {
				if (target.boosts[b] === -6) continue;
				const negativeBoost: SparseBoostsTable = {};
				negativeBoost[b] = boost[b];
				delete boost[b];
				if (source.hp) { this.add('-ability', target, 'Mirror Armor');
						this.boost(negativeBoost, source, target, null, true);
					}
				}
			}
		},
		onTryHit(target, source, move) {
			if (!source || target === source || !move || move.hasBounced) return;
			if (move.flags && move.flags.light) {
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				this.add('-ability', target, 'Mirror Armor');
				this.actions.useMove(newMove, target, {target: source});
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Mirror Armor",
		rating: 2,
		num: 240,
	},
	neutralizinggas: { // Ability suppression implemented in sim/pokemon.ts:Pokemon#ignoringAbility
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			this.add('-ability', pokemon, 'Neutralizing Gas');
			pokemon.abilityState.ending = false;
			const auraAbilities = ['dragonsfury', 'esperwing', 'migraine'];
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue; // Do not suppress the user's other ability
				if (auraAbilities.includes(target.getAbility().id)) continue; // Aura abilities ignore Neutralizing Gas
				if (target.hasItem('Ability Shield')) { this.add('-block', target, 'item: Ability Shield');
					continue;
				} // Can't suppress a Tatsugiri inside of Dondozo already
				if (target.volatiles['commanding']) { continue; }
				if (target.illusion) { this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, pokemon, 'neutralizinggas'); }
				if (target.volatiles['slowstart']) {
					delete target.volatiles['slowstart'];
					this.add('-end', target, 'Slow Start', '[silent]');
				}
				if (strongWeathers.includes(target.getAbility().id)) { this.singleEvent('End', this.dex.abilities.get(target.getAbility().id), target.abilityState, target, pokemon, 'neutralizinggas'); }
			}
		},
		onEnd(source) {
			if (source.transformed) return;
			for (const pokemon of this.getAllActive()) { if (pokemon !== source && pokemon.hasAbility('Neutralizing Gas')) { return; } }
			this.add('-end', source, 'ability: Neutralizing Gas');
			// FIXME this happens before the pokemon switches out, should be the opposite order.
			// Not an easy fix since we cant use a supported event. Would need some kind of special event that
			// gathers events to run after the switch and then runs them when the ability is no longer accessible.
			// (If you're tackling this, do note extreme weathers have the same issue)
			// Mark this pokemon's ability as ending so Pokemon#ignoringAbility skips it
			if (source.abilityState.ending) return;
			source.abilityState.ending = true;
			const sortedActive = this.getAllActive();
			this.speedSort(sortedActive);
			for (const pokemon of sortedActive) { if (pokemon !== source) { if (pokemon.getAbility().flags['cantsuppress']) continue; // does not interact with e.g Ice Face, Zen Mode
					if (pokemon.hasItem('abilityshield')) continue; // don't restart abilities that weren't suppressed
					this.singleEvent('Start', pokemon.getAbility(), pokemon.abilityState, pokemon);
					if (pokemon.ability === "gluttony") { pokemon.abilityState.gluttony = false; }
				}
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Neutralizing Gas",
		rating: 3.5,
		num: 256,
	},
	pastelveil: {
		onStart(pokemon) {
			for (const ally of pokemon.alliesAndSelf()) { if (['psn', 'tox'].includes(ally.status)) { this.add('-activate', pokemon, 'ability: Pastel Veil');
					ally.cureStatus();
				}
			}
		},
		onUpdate(pokemon) { if (['psn', 'tox'].includes(pokemon.status)) { this.add('-activate', pokemon, 'ability: Pastel Veil');
				pokemon.cureStatus();
			}
		},
		onAnySwitchIn() { ((this.effect as any).onStart as (p: Pokemon) => void).call(this, this.effectState.target); },
		onSetStatus(status, target, source, effect) {
			if (!['psn', 'tox'].includes(status.id)) return;
			if ((effect as Move)?.status) { this.add('-immune', target, '[from] ability: Pastel Veil'); }
			return false;
		},
		onAllySetStatus(status, target, source, effect) {
			if (!['psn', 'tox'].includes(status.id)) return;
			if ((effect as Move)?.status) {
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Pastel Veil', `[of] ${effectHolder}`);
			}
			return false;
		},
		flags: { breakable: 1 },
		name: "Pastel Veil",
		rating: 2,
		num: 257,
	},
	perishbody: {
		onDamagingHit(damage, target, source, move) {
			if (!this.checkMoveMakesContact(move, source, target) || source.volatiles['perishsong']) return;
			this.add('-ability', target, 'Perish Body');
			source.addVolatile('perishsong');
			target.addVolatile('perishsong');
		},
		flags: {},
		name: "Perish Body",
		rating: 1,
		num: 253,
	},
	powerspot: {
		onAllyBasePowerPriority: 22,
		onAllyBasePower(basePower, attacker, defender, move) { if (attacker !== this.effectState.target) { this.debug('Power Spot boost');
				return this.chainModify([5325, 4096]);
			}
		},
		flags: {},
		name: "Power Spot",
		rating: 0,
		num: 249,
	},
	propellertail: { // most of the implementation is in Battle#getTarget
		onModifyMovePriority: 1,
		onModifyMove(move) { move.tracksTarget = move.target !== 'scripted';  },
		flags: {},
		name: "Propeller Tail",
		rating: 0,
		num: 239,
	},
	punkrock: {
		onBasePowerPriority: 7,
		onBasePower(basePower, attacker, defender, move) { if (move.flags['sound']) { this.debug('Punk Rock boost');
				return this.chainModify([5325, 4096]);
			}
		},
		onSourceModifyDamage(damage, source, target, move) { if (move.flags['sound']) { this.debug('Punk Rock weaken');
				return this.chainModify(0.5);
			}
		},
		flags: { breakable: 1 },
		name: "Punk Rock",
		rating: 3.5,
		num: 244,
	},
	quickdraw: {
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) { if (move.flags && move.flags.weapon) { this.debug('Quick Draw weapon boost');
				return this.chainModify([1300, 1000]);
			}
		},
		onFractionalPriorityPriority: -1,
		onFractionalPriority(priority, pokemon, target, move) { if (move.category !== "Status" && this.randomChance(3, 10)) { this.add('-activate', pokemon, 'ability: Quick Draw');
			return 0.1;
			}
		},
		flags: {},
		name: "Quick Draw",
		rating: 2.5,
		num: 259,
	},
	ripen: {
		onTryHeal(damage, target, source, effect) {
			if (!effect) return;
			if (effect.name === 'Berry Juice' || effect.name === 'Leftovers') { this.add('-activate', target, 'ability: Ripen'); }
			if ((effect as Item).isBerry) return this.chainModify(2);
		},
		onChangeBoost(boost, target, source, effect) { if (effect && (effect as Item).isBerry) {
			let b: BoostID;
			for (b in boost) { boost[b]! *= 2; }
			}
		},
		onSourceModifyDamagePriority: -1,
		onSourceModifyDamage(damage, source, target, move) { if (target.abilityState.berryWeaken) { target.abilityState.berryWeaken = false;
				return this.chainModify(0.5);
			}
		},
		onTryEatItemPriority: -1,
		onTryEatItem(item, pokemon) { this.add('-activate', pokemon, 'ability: Ripen'); },
		onEatItem(item, pokemon) {
			const weakenBerries = [ 'Babiri Berry', 'Charti Berry', 'Chilan Berry', 'Chople Berry', 'Coba Berry', 'Colbur Berry', 'Haban Berry', 'Kasib Berry', 'Kebia Berry', 'Occa Berry', 'Passho Berry', 'Payapa Berry', 'Rindo Berry', 'Roseli Berry', 'Shuca Berry', 'Tanga Berry', 'Wacan Berry', 'Yache Berry', ];
			pokemon.abilityState.berryWeaken = weakenBerries.includes(item.name); // Record if the pokemon ate a berry to resist the attack
		},
		flags: {},
		name: "Ripen",
		rating: 2,
		num: 247,
	},
	sandspit: {
		onDamagingHit(damage, target, source, move) { this.field.setWeather('sandstorm'); },
		flags: {},
		name: "Sand Spit",
		rating: 1,
		num: 245,
	},
	screencleaner: {
		onStart(pokemon) {
			let activated = false;
			for (const sideCondition of ['reflect', 'lightscreen', 'auroraveil']) { for (const side of [pokemon.side, ...pokemon.side.foeSidesWithConditions()]) { if (side.getSideCondition(sideCondition)) { if (!activated) { this.add('-activate', pokemon, 'ability: Screen Cleaner');
							activated = true;
						}
						side.removeSideCondition(sideCondition);
					}
				}
			}
		},
		flags: {},
		name: "Screen Cleaner",
		rating: 2,
		num: 251,
	},
	stalwart: {
		onModifyMovePriority: 1,
		onModifyMove(move) { move.tracksTarget = move.target !== 'scripted';  }, // most of the implementation is in Battle#getTarget
		flags: {},
		name: "Stalwart",
		rating: 0,
		num: 242,
	},
	steamengine: {
		onDamagingHit(damage, target, source, move) { if (['Water', 'Fire'].includes(move.type)) { this.boost({ spe: 6 });  }  },
		flags: {},
		name: "Steam Engine",
		rating: 2,
		num: 243,
	},
	steelyspirit: {
		onAllyBasePowerPriority: 22,
		onAllyBasePower(basePower, attacker, defender, move) { if (move.type === 'Steel') { this.debug('Steely Spirit boost');
			return this.chainModify(1.5);
			}
		},
		onResidualOrder: 10,
		onResidual(pokemon) { // User and ally auras deplete at half the usual rate (0.5 per turn instead of 1)
			const team = [pokemon, ...pokemon.allies()];
			for (const ally of team) {
				if (ally.status === 'aura' && ally.statusState.time !== undefined) {
					// Add 0.5 back after the aura's natural -1 decrement, resulting in -0.5 net
					ally.statusState.time += 0.5;
				}
			}
		},
		flags: {},
		name: "Steely Spirit",
		rating: 3.5,
		num: 252,
	},
	transistor: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) { if (move.type === 'Electric') { this.debug('Transistor boost');
				return this.chainModify([5325, 4096]);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) { if (move.type === 'Electric') { this.debug('Transistor boost');
				return this.chainModify([5325, 4096]);
			}
		},
		flags: {},
		name: "Transistor",
		rating: 3.5,
		num: 262,
	},
	unseenfist: {
		onModifyMove(move) { if (move.flags['contact']) {
				delete move.flags['protect'];
				move.pierce2 = true;
			}
		},
		flags: {},
		name: "Unseen Fist",
		rating: 2,
		num: 260,
	},
	wanderingspirit: {
		onDamagingHit(damage, target, source, move) {
			if (source.getAbility().flags['failskillswap'] || target.volatiles['dynamax']) return;
			if (this.checkMoveMakesContact(move, source, target)) {
				const targetCanBeSet = this.runEvent('SetAbility', target, source, this.effect, source.ability);
				if (!targetCanBeSet) return targetCanBeSet;
				const sourceAbility = source.setAbility('wanderingspirit', target);
				if (!sourceAbility) return;
				if (target.isAlly(source)) { this.add('-activate', target, 'Skill Swap', '', '', `[of] ${source}`); }
				else { this.add('-activate', target, 'ability: Wandering Spirit', this.dex.abilities.get(sourceAbility).name, 'Wandering Spirit', `[of] ${source}`); }
				target.setAbility(sourceAbility);
			}
		},
		flags: {},
		name: "Wandering Spirit",
		rating: 2.5,
		num: 254,
	},



	// #region Gen 9 Abilities
	angershell: {
		onDamage(damage, target, source, effect) { if (
				effect.effectType === "Move" &&
				!effect.multihit &&
				!(effect.hasSheerForce && source.hasAbility('sheerforce'))
			) 
			{ this.effectState.checkedAngerShell = false; } 
			else { this.effectState.checkedAngerShell = true; }
		},
		onTryEatItem(item) {
			const healingItems = [ 'aguavberry', 'enigmaberry', 'figyberry', 'iapapaberry', 'magoberry', 'sitrusberry', 'wikiberry', 'oranberry', 'berryjuice', ];
			if (healingItems.includes(item.id)) { return this.effectState.checkedAngerShell; }
			return true;
		},
		onAfterMoveSecondary(target, source, move) {
			this.effectState.checkedAngerShell = true;
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			const lastAttackedBy = target.getLastAttackedBy();
			if (!lastAttackedBy) return;
			const damage = move.multihit ? move.totalDamage : lastAttackedBy.damage;
			if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
				this.boost({ atk: 1, spa: 1, spe: 1, def: -1, spd: -1 }, target, target);
			}
		},
		flags: {},
		name: "Anger Shell",
		rating: 3,
		num: 271,
	},
	armortail: {
		onFoeTryMove(target, source, move) {
			const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
			if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) { return;}
			const armorTailHolder = this.effectState.target;
			if ((source.isAlly(armorTailHolder) || move.target === 'all') && move.priority > 0.1) {
				this.attrLastMove('[still]');
				this.add('cant', armorTailHolder, 'ability: Armor Tail', move, `[of] ${target}`);
				return false;
			}
		},
		flags: { breakable: 1 },
		name: "Armor Tail",
		rating: 2.5,
		num: 296,
	},
	beadsofruin: {
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Beads of Ruin');
		},
		onAnyModifySpD(spd, target, source, move) {
			const abilityHolder = this.effectState.target;
			if (target.hasAbility('Beads of Ruin')) return;
			if (!move.ruinedSpD?.hasAbility('Beads of Ruin')) move.ruinedSpD = abilityHolder;
			if (move.ruinedSpD !== abilityHolder) return;
			this.debug('Beads of Ruin SpD drop');
			return this.chainModify(0.75);
		},
		flags: {},
		name: "Beads of Ruin",
		rating: 4.5,
		num: 284,
	},
	commander: {
		onAnySwitchInPriority: -2,
		onAnySwitchIn() { ((this.effect as any).onUpdate as (p: Pokemon) => void).call(this, this.effectState.target); },
		onStart(pokemon) { ((this.effect as any).onUpdate as (p: Pokemon) => void).call(this, pokemon); },
		onUpdate(pokemon) {
			if (this.gameType !== 'doubles') return;
			if (this.queue.peek()?.choice === 'runSwitch') return;
			const ally = pokemon.allies()[0];
			if (pokemon.switchFlag || ally?.switchFlag) return;
			if (!ally || pokemon.baseSpecies.baseSpecies !== 'Tatsugiri' || ally.baseSpecies.baseSpecies !== 'Dondozo') { if (pokemon.getVolatile('commanding')) pokemon.removeVolatile('commanding');
				return;
			}

			if (!pokemon.getVolatile('commanding')) {
				if (ally.getVolatile('commanded')) return;
				this.queue.cancelAction(pokemon);
				this.add('-activate', pokemon, 'ability: Commander', `[of] ${ally}`);
				pokemon.addVolatile('commanding');
				ally.addVolatile('commanded', pokemon);
			} else {
				if (!ally.fainted) return;
				pokemon.removeVolatile('commanding');
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Commander",
		rating: 0,
		num: 279,
	},
	costar: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			const ally = pokemon.allies()[0];
			if (!ally) return;
			let i: BoostID;
			for (i in ally.boosts) { pokemon.boosts[i] = ally.boosts[i]; }
			const volatilesToCopy = ['dragoncheer', 'focusenergy', 'gmaxchistrike', 'laserfocus'];
			for (const volatile of volatilesToCopy) pokemon.removeVolatile(volatile);
			for (const volatile of volatilesToCopy) { if (ally.volatiles[volatile]) {
					pokemon.addVolatile(volatile);
					if (volatile === 'gmaxchistrike') pokemon.volatiles[volatile].layers = ally.volatiles[volatile].layers;
					if (volatile === 'dragoncheer') pokemon.volatiles[volatile].hasDragonType = ally.volatiles[volatile].hasDragonType;
				}
			}
			this.add('-copyboost', pokemon, ally, '[from] ability: Costar');
		},
		flags: {},
		name: "Costar",
		rating: 0,
		num: 294,
	},
	cudchew: {
		onEatItem(item, pokemon, source, effect) { if (item.isBerry && (!effect || !['bugbite', 'pluck'].includes(effect.id))) {
				this.effectState.berry = item;
				this.effectState.counter = 2;
				if (!this.queue.peek()) this.effectState.counter--;
			}
		},
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (!this.effectState.berry || !pokemon.hp) return;
			if (--this.effectState.counter <= 0) {
				const item = this.effectState.berry;
				this.add('-activate', pokemon, 'ability: Cud Chew');
				this.add('-enditem', pokemon, item.name, '[eat]');
				if (this.singleEvent('Eat', item, null, pokemon, null, null)) { this.runEvent('EatItem', pokemon, null, null, item); }
				if (item.onEat) pokemon.ateBerry = true;
				delete this.effectState.berry;
				delete this.effectState.counter;
			}
		},
		flags: {},
		name: "Cud Chew",
		rating: 2,
		num: 291,
	},
	eartheater: {
		onTryHit(target, source, move) { if (target !== source && move.type === 'Ground') { if (!this.heal(target.baseMaxhp / 4)) { this.add('-immune', target, '[from] ability: Earth Eater'); }
			return null;
			}
		},
		onSwitchIn(pokemon) { // Absorb Spikes on entry (like Poison-types absorb Toxic Spikes)
			const side = pokemon.side;
			const spikes = side.sideConditions['spikes'];
			if (spikes) {
				const layers = spikes.layers || 1;
				this.add('-sideend', side, 'Spikes', '[from] ability: Earth Eater', '[of] ' + pokemon);
				delete side.sideConditions['spikes'];
				const healAmount = Math.floor(pokemon.baseMaxhp / 10) * layers;
				if (healAmount > 0) this.heal(healAmount, pokemon, pokemon, this.dex.abilities.get('eartheater'));
			}
		},
		flags: { breakable: 1 },
		name: "Earth Eater",
		rating: 3.5,
		num: 297,
	},
	electromorphosis: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) { target.addVolatile('charge'); },
		flags: {},
		name: "Electromorphosis",
		rating: 3,
		num: 280,
	},
	embodyaspectcornerstone: {
		onStart(pokemon) { if (pokemon.baseSpecies.name === 'Ogerpon-Cornerstone-Tera' && pokemon.terastallized && !this.effectState.embodied) {
				this.effectState.embodied = true;
				this.boost({ def: 1 }, pokemon);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Embody Aspect (Cornerstone)",
		rating: 3.5,
		num: 304,
	},
	embodyaspecthearthflame: {
		onStart(pokemon) { if (pokemon.baseSpecies.name === 'Ogerpon-Hearthflame-Tera' && pokemon.terastallized && !this.effectState.embodied) {
				this.effectState.embodied = true;
				this.boost({ atk: 1 }, pokemon);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Embody Aspect (Hearthflame)",
		rating: 3.5,
		num: 303,
	},
	embodyaspectteal: {
		onStart(pokemon) { if (pokemon.baseSpecies.name === 'Ogerpon-Teal-Tera' && pokemon.terastallized && !this.effectState.embodied) {
				this.effectState.embodied = true;
				this.boost({ spe: 1 }, pokemon);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Embody Aspect (Teal)",
		rating: 3.5,
		num: 301,
	},
	embodyaspectwellspring: {
		onStart(pokemon) { if (pokemon.baseSpecies.name === 'Ogerpon-Wellspring-Tera' && pokemon.terastallized && !this.effectState.embodied) {
				this.effectState.embodied = true;
				this.boost({ spd: 1 }, pokemon);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Embody Aspect (Wellspring)",
		rating: 3.5,
		num: 302,
	},
	goodasgold: {
		onSetStatus(status, target, source, effect) { if (source && source !== target) { this.add('-immune', target, '[from] ability: Good as Gold'); }
			return false;
		},
		onTryAddVolatile(status, target, source, effect) { if (['confusion', 'yawn', 'leechseed', 'taunt', 'torment', 'encore', 'disable', 'healblock', 'attract', 'curse', 'nightmare', 'perishsong', 'partiallytrapped'].includes(status.id)) { this.add('-immune', target, '[from] ability: Good as Gold');
				return null;
			}
		},
		onBoost(boost, target, source, effect) {
			if (!source || target === source) return;
			let showMsg = false;
			for (const stat in boost) { if (boost[stat] < 0) {
					boost[stat] = 0;
					showMsg = true;
				}
			}
			if (showMsg) { this.add('-fail', target, 'unboost', '[from] ability: Good as Gold'); }
		},
		onSourceModifyDamage(damage, source, target, move) { if (move.flags?.slicing) { this.debug('Good as Gold weakness to slicing');
				return this.chainModify(2);
			}
		},
		flags: { breakable: 1 },
		name: "Good as Gold",
		rating: 5,
		num: 283,
	},
	guarddog: {
		onDragOutPriority: 1,
		onDragOut(pokemon) { this.add('-activate', pokemon, 'ability: Guard Dog');
			return null;
		},
		onTryBoostPriority: 2,
		onTryBoost(boost, target, source, effect) { if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.boost({ atk: 1 }, target, target, null, false, true);
			}
		},
		flags: { breakable: 1 },
		name: "Guard Dog",
		rating: 2,
		num: 275,
	},
	hadronengine: {
		onStart(pokemon) { if (!this.field.setTerrain('electricterrain') && this.field.isTerrain('electricterrain')) { this.add('-activate', pokemon, 'ability: Hadron Engine'); } },
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) { if (this.field.isTerrain('electricterrain')) { this.debug('Hadron Engine boost');
				return this.chainModify([5461, 4096]);
			}
		},
		flags: {},
		name: "Hadron Engine",
		rating: 4.5,
		num: 289,
	},
	hospitality: {
		onSwitchInPriority: -2,
		onStart(pokemon) { for (const ally of pokemon.adjacentAllies()) { this.heal(ally.baseMaxhp / 3, ally, pokemon); } },
		flags: {},
		name: "Hospitality",
		rating: 0,
		num: 299,
	},
	lingeringaroma: {
		onDamagingHit(damage, target, source, move) {
			const sourceAbility = source.getAbility();
			if (sourceAbility.flags['cantsuppress'] || sourceAbility.id === 'lingeringaroma') { return; }
			if (this.checkMoveMakesContact(move, source, target, !source.isAlly(target))) {
				const oldAbility = source.setAbility('lingeringaroma', target);
				if (oldAbility) { this.add('-activate', target, 'ability: Lingering Aroma', this.dex.abilities.get(oldAbility).name, `[of] ${source}`); }
			}
		},
		flags: {},
		name: "Lingering Aroma",
		rating: 2,
		num: 268,
	},
	mindseye: {
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost.accuracy && boost.accuracy < 0) {
				delete boost.accuracy;
				if (!(effect as ActiveMove).secondaries) { this.add("-fail", target, "unboost", "accuracy", "[from] ability: Mind's Eye", `[of] ${target}`); }
			}
		},
		onModifyMovePriority: -5,
		onModifyMove(move) {
			move.ignoreEvasion = true;
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Fighting'] = true;
				move.ignoreImmunity['Normal'] = true;
			}
		},
		flags: { breakable: 1 },
		name: "Mind's Eye",
		rating: 0,
		num: 300,
	},
	myceliummight: {
		onFractionalPriorityPriority: -1,
		onFractionalPriority(priority, pokemon, target, move) { if (move.category === 'Status') {
				return -0.1;
			}
		},
		onModifyMove(move) { if (move.category === 'Status') {
				move.ignoreAbility = true;
				move.ignoreImmunity = true;
			}
		},
		flags: {},
		name: "Mycelium Might",
		rating: 2,
		num: 298,
	},
	opportunist: {
		onFoeAfterBoost(boost, target, source, effect) {
			if (effect?.name === 'Opportunist' || effect?.name === 'Mirror Herb') return;
			if (!this.effectState.boosts) this.effectState.boosts = {} as SparseBoostsTable;
			const boostPlus = this.effectState.boosts;
			let i: BoostID;
			for (i in boost) { if (boost[i]! > 0) { boostPlus[i] = (boostPlus[i] || 0) + boost[i]!; } }
		},
		onAllyAfterBoost(boost, target, source, effect) {
			if (effect?.name === 'Opportunist' || effect?.name === 'Mirror Herb') return;
			if (!this.effectState.boosts) this.effectState.boosts = {} as SparseBoostsTable;
			const boostPlus = this.effectState.boosts;
			let i: BoostID;
			for (i in boost) { if (boost[i]! > 0) { boostPlus[i] = (boostPlus[i] || 0) + boost[i]!; } }
		},
		onAnySwitchInPriority: -3,
		onAnySwitchIn() {
			if (!this.effectState.boosts) return;
			this.boost(this.effectState.boosts, this.effectState.target);
			delete this.effectState.boosts;
		},
		onAnyAfterMega() {
			if (!this.effectState.boosts) return;
			this.boost(this.effectState.boosts, this.effectState.target);
			delete this.effectState.boosts;
		},
		onAnyAfterTerastallization() {
			if (!this.effectState.boosts) return;
			this.boost(this.effectState.boosts, this.effectState.target);
			delete this.effectState.boosts;
		},
		onAnyAfterMove() {
			if (!this.effectState.boosts) return;
			this.boost(this.effectState.boosts, this.effectState.target);
			delete this.effectState.boosts;
		},
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (!this.effectState.boosts) return;
			this.boost(this.effectState.boosts, this.effectState.target);
			delete this.effectState.boosts;
		},
		onEnd() { delete this.effectState.boosts; },
		flags: {},
		name: "Opportunist",
		rating: 3,
		num: 290,
	},
	orichalcumpulse: {
		onStart(pokemon) { if (this.field.setWeather('sunnyday')) { this.add('-activate', pokemon, 'Orichalcum Pulse', '[source]'); } 
			else if (this.field.isWeather('sunnyday')) { this.add('-activate', pokemon, 'ability: Orichalcum Pulse'); }
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) { if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) { this.debug('Orichalcum boost');
				return this.chainModify([5461, 4096]);
			}
		},
		flags: {},
		name: "Orichalcum Pulse",
		rating: 4.5,
		num: 288,
	},
	poisonpuppeteer: {
		onAnyAfterSetStatus(status, target, source, effect) {
			if (source.baseSpecies.name !== "Pecharunt") return;
			if (source !== this.effectState.target || target === source || effect.effectType !== 'Move') return;
			if (status.id === 'psn' || status.id === 'tox') { target.addVolatile('confusion'); }
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Poison Puppeteer",
		rating: 3,
		num: 310,
	},
	protosynthesis: {
		onSwitchInPriority: -2,
		onStart(pokemon) { this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon); },
		onWeatherChange(pokemon) { 
			if (this.field.isWeather('sunnyday')) { pokemon.addVolatile('protosynthesis'); }
			else if (!pokemon.volatiles['protosynthesis']?.fromBooster && !this.field.isWeather('sunnyday')) { pokemon.removeVolatile('protosynthesis'); }
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['protosynthesis'];
			this.add('-end', pokemon, 'Protosynthesis', '[silent]');
		},
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) { if (effect?.name === 'Booster Energy') {
					this.effectState.fromBooster = true;
					this.add('-activate', pokemon, 'ability: Protosynthesis', '[fromitem]');
				} else { this.add('-activate', pokemon, 'ability: Protosynthesis'); }
				this.effectState.bestStat = pokemon.getBestStat(false, true);
				this.add('-start', pokemon, 'protosynthesis' + this.effectState.bestStat);
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				if (this.effectState.bestStat !== 'atk' || pokemon.ignoringAbility()) return;
				this.debug('Protosynthesis atk boost');
				return this.chainModify([1300, 1000]);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, pokemon) {
				if (this.effectState.bestStat !== 'def' || pokemon.ignoringAbility()) return;
				this.debug('Protosynthesis def boost');
				return this.chainModify([1300, 1000]);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				if (this.effectState.bestStat !== 'spa' || pokemon.ignoringAbility()) return;
				this.debug('Protosynthesis spa boost');
				return this.chainModify([1300, 1000]);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, pokemon) {
				if (this.effectState.bestStat !== 'spd' || pokemon.ignoringAbility()) return;
				this.debug('Protosynthesis spd boost');
				return this.chainModify([1300, 1000]);
			},
			onModifySpe(spe, pokemon) {
				if (this.effectState.bestStat !== 'spe' || pokemon.ignoringAbility()) return;
				this.debug('Protosynthesis spe boost');
				return this.chainModify([1300, 1000]);
			},
			onEnd(pokemon) { this.add('-end', pokemon, 'Protosynthesis'); },
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Protosynthesis",
		rating: 3,
		num: 281,
	},
	purifyingsalt: {
		onSetStatus(status, target, source, effect) { if ((effect as Move)?.status) { this.add('-immune', target, '[from] ability: Purifying Salt'); }
			return false;
		},
		onTryAddVolatile(status, target) { if (status.id === 'yawn') { this.add('-immune', target, '[from] ability: Purifying Salt');
				return null;
			}
		},
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) { if (move.type === 'Ghost' || move.type === 'Water') { this.debug('Purifying Salt weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(spa, attacker, defender, move) { if (move.type === 'Ghost' || move.type === 'Water') { this.debug('Purifying Salt weaken');
				return this.chainModify(0.5);
			}
		},
		flags: { breakable: 1 },
		name: "Purifying Salt",
		rating: 4,
		num: 272,
	},
	quarkdrive: {
		onSwitchInPriority: -2,
		onStart(pokemon) { this.singleEvent('TerrainChange', this.effect, this.effectState, pokemon); },
		onTerrainChange(pokemon) { 
			if (this.field.isTerrain('electricterrain')) { pokemon.addVolatile('quarkdrive'); } 
			else if (!pokemon.volatiles['quarkdrive']?.fromBooster) { pokemon.removeVolatile('quarkdrive'); }
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['quarkdrive'];
			this.add('-end', pokemon, 'Quark Drive', '[silent]');
		},
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) { if (effect?.name === 'Booster Energy') {
					this.effectState.fromBooster = true;
					this.add('-activate', pokemon, 'ability: Quark Drive', '[fromitem]');
				} else { this.add('-activate', pokemon, 'ability: Quark Drive'); }
				this.effectState.bestStat = pokemon.getBestStat(false, true);
				this.add('-start', pokemon, 'quarkdrive' + this.effectState.bestStat);
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				if (this.effectState.bestStat !== 'atk' || pokemon.ignoringAbility()) return;
				this.debug('Quark Drive atk boost');
				return this.chainModify([1300, 1000]);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, pokemon) {
				if (this.effectState.bestStat !== 'def' || pokemon.ignoringAbility()) return;
				this.debug('Quark Drive def boost');
				return this.chainModify([1300, 1000]);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				if (this.effectState.bestStat !== 'spa' || pokemon.ignoringAbility()) return;
				this.debug('Quark Drive spa boost');
				return this.chainModify([1300, 1000]);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, pokemon) {
				if (this.effectState.bestStat !== 'spd' || pokemon.ignoringAbility()) return;
				this.debug('Quark Drive spd boost');
				return this.chainModify([1300, 1000]);
			},
			onModifySpe(spe, pokemon) {
				if (this.effectState.bestStat !== 'spe' || pokemon.ignoringAbility()) return;
				this.debug('Quark Drive spe boost');
				return this.chainModify([1300, 1000]);
			},
			onEnd(pokemon) { this.add('-end', pokemon, 'Quark Drive'); },
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Quark Drive",
		rating: 3,
		num: 282,
	},
	rockypayload: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) { if (move.type === 'Rock' || (move.flags && move.flags.bomb)) { this.debug('Rocky Payload boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) { if (move.type === 'Rock' || (move.flags && move.flags.bomb)) { this.debug('Rocky Payload boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Rocky Payload",
		rating: 3.5,
		num: 276,
	},
	seedsower: {
		onDamagingHit(damage, target, source, move) { this.field.setTerrain('grassyterrain'); },
		flags: {},
		name: "Seed Sower",
		rating: 2.5,
		num: 269,
	},
	sharpness: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) { if (move.flags['slicing']) { this.debug('Sharpness boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Sharpness",
		rating: 3.5,
		num: 292,
	},
	supremeoverlord: {
		onStart(pokemon) { if (pokemon.side.totalFainted) {
				this.add('-activate', pokemon, 'ability: Supreme Overlord');
				const fallen = Math.min(pokemon.side.totalFainted, 5);
				this.add('-start', pokemon, `fallen${fallen}`, '[silent]');
				this.effectState.fallen = fallen;
			}
		},
		onEnd(pokemon) { this.add('-end', pokemon, `fallen${this.effectState.fallen}`, '[silent]'); },
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) { if (this.effectState.fallen) {
				const powMod = [4096, 4301, 4505, 4710, 4915, 5120]; //5% boost, vanilla is 10%
				this.debug(`Supreme Overlord boost (halved): ${powMod[this.effectState.fallen]}/4096`);
				return this.chainModify([powMod[this.effectState.fallen], 4096]);
			}
		},
		flags: {},
		name: "Supreme Overlord",
		rating: 4,
		num: 293,
	},
	supersweetsyrup: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Supersweet Syrup');
			for (const target of pokemon.adjacentFoes()) { 
				if (target.volatiles['substitute']) { this.add('-immune', target); }
				else { this.boost({ evasion: -1 }, target, pokemon, null, true); }
			}
		},
		flags: {},
		name: "Supersweet Syrup",
		rating: 1.5,
		num: 306,
	},
	swordofruin: {
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Sword of Ruin');
		},
		onAnyModifyDef(def, target, source, move) {
			const abilityHolder = this.effectState.target;
			if (target.hasAbility('Sword of Ruin')) return;
			if (!move.ruinedDef?.hasAbility('Sword of Ruin')) move.ruinedDef = abilityHolder;
			if (move.ruinedDef !== abilityHolder) return;
			this.debug('Sword of Ruin Def drop');
			return this.chainModify(0.75);
		},
		flags: {},
		name: "Sword of Ruin",
		rating: 4.5,
		num: 285,
	},
	tabletsofruin: {
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Tablets of Ruin');
		},
		onAnyModifyAtk(atk, source, target, move) {
			const abilityHolder = this.effectState.target;
			if (source.hasAbility('Tablets of Ruin')) return;
			if (!move.ruinedAtk) move.ruinedAtk = abilityHolder;
			if (move.ruinedAtk !== abilityHolder) return;
			this.debug('Tablets of Ruin Atk drop');
			return this.chainModify(0.75);
		},
		flags: {},
		name: "Tablets of Ruin",
		rating: 4.5,
		num: 284,
	},
	teraformzero: {
		onAfterTerastallization(pokemon) {
			if (pokemon.baseSpecies.name !== 'Terapagos-Stellar') return;
			if (this.field.weather || this.field.terrain) { this.add('-ability', pokemon, 'Teraform Zero');
				this.field.clearWeather();
				this.field.clearTerrain();
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Teraform Zero",
		rating: 3,
		num: 309,
	},
	terashell: {
		onStart(pokemon) { if (!pokemon.teraShellUsedTypes) { pokemon.teraShellUsedTypes = []; } },
		onBasePower(basePower, attacker, defender, move) {
			if (defender.hp < defender.maxhp) return;
			if (move.category === 'Status') return;
			if (!defender.teraShellUsedTypes) { defender.teraShellUsedTypes = []; }
			// Check if already activated for this move
			if (this.effectState.activatedFor === move.id) return;
			const allTypes = ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];
			const availableTypes = allTypes.filter(type => !defender.teraShellUsedTypes.includes(type) && !defender.hasType(type));
			if (availableTypes.length === 0) return;
			// Find types by effectiveness
			const resistTypes = availableTypes.filter(type => {
				const effectiveness = this.dex.getEffectiveness(move.type, type);
				return effectiveness < 0;
			});
			const immuneTypes = availableTypes.filter(type => {
				const effectiveness = this.dex.getEffectiveness(move.type, type);
				return effectiveness === -Infinity || effectiveness <= -2;
			});
			const neutralTypes = availableTypes.filter(type => {
				const effectiveness = this.dex.getEffectiveness(move.type, type);
				return effectiveness === 0;
			});
			const weakTypes = availableTypes.filter(type => {
				const effectiveness = this.dex.getEffectiveness(move.type, type);
				return effectiveness > 0;
			});
			let selectedType;
			if (resistTypes.length > 0) { selectedType = this.sample(resistTypes); } 
			else if (immuneTypes.length > 0) { selectedType = this.sample(immuneTypes); } 
			else if (neutralTypes.length > 0) { selectedType = this.sample(neutralTypes); } 
			else if (weakTypes.length > 0) { selectedType = this.sample(weakTypes); } 
			else { return; }
			defender.teraShellUsedTypes.push(selectedType);
			this.effectState.activatedFor = move.id;
			this.add('-activate', defender, 'ability: Tera Shell');
			defender.setType([defender.getTypes()[0], selectedType]);
			this.add('-start', defender, 'typechange', defender.getTypes().join('/'), '[from] ability: Tera Shell');
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, breakable: 1 },
		name: "Tera Shell",
		rating: 3.5,
		num: 308,
	},
	terashift: {
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Terapagos') return;
			if (pokemon.species.forme !== 'Terastal') { this.add('-activate', pokemon, 'ability: Tera Shift');
				pokemon.formeChange('Terapagos-Terastal', this.effect, true);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1, notransform: 1 },
		name: "Tera Shift",
		rating: 3,
		num: 307,
	},
	thermalexchange: {
		onDamagingHit(damage, target, source, move) { if (move.type === 'Fire') { this.boost({ atk: 1 }); } },
		onUpdate(pokemon) { if (pokemon.status === 'brn') { this.add('-activate', pokemon, 'ability: Thermal Exchange');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if ((effect as Move)?.status) { this.add('-immune', target, '[from] ability: Thermal Exchange'); }
			return false;
		},
		flags: { breakable: 1 },
		name: "Thermal Exchange",
		rating: 2.5,
		num: 270,
	},
	toxicchain: {
		onSourceDamagingHit(damage, target, source, move) {
			if (target.hasAbility('shielddust') || target.hasItem('covertcloak')) return;
			if (this.randomChance(3, 10)) { target.trySetStatus('tox', source); }
		},
		flags: {},
		name: "Toxic Chain",
		rating: 4.5,
		num: 305,
	},
	toxicdebris: {
		onDamagingHit(damage, target, source, move) {
			const side = source.isAlly(target) ? source.side.foe : source.side;
			const toxicSpikes = side.sideConditions['toxicspikes'];
			if (move.category === 'Physical' && (!toxicSpikes || toxicSpikes.layers < 2)) { this.add('-activate', target, 'ability: Toxic Debris');
				side.addSideCondition('toxicspikes', target);
			}
		},
		flags: {},
		name: "Toxic Debris",
		rating: 3.5,
		num: 295,
	},
	vesselofruin: {
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Vessel of Ruin');
		},
		onAnyModifySpA(spa, source, target, move) {
			const abilityHolder = this.effectState.target;
			if (source.hasAbility('Vessel of Ruin')) return;
			if (!move.ruinedSpA) move.ruinedSpA = abilityHolder;
			if (move.ruinedSpA !== abilityHolder) return;
			this.debug('Vessel of Ruin SpA drop');
			return this.chainModify(0.75);
		},
		flags: {},
		name: "Vessel of Ruin",
		rating: 4.5,
		num: 284,
	},
	wellbakedbody: {
		onTryHit(target, source, move) { if (target !== source && move.type === 'Fire') { if (!this.boost({ def: 2 })) { this.add('-immune', target, '[from] ability: Well-Baked Body'); }
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Well-Baked Body",
		rating: 3.5,
		num: 273,
	},
	windpower: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) { if (move.flags['wind']) {
				target.addVolatile('charge');
				this.boost({spa: 1}, target, target, this.effect);
			}
		},
		onSideConditionStart(side, source, sideCondition) {
			const pokemon = this.effectState.target;
			if (sideCondition.id === 'tailwind') {
				pokemon.addVolatile('charge');
				this.boost({spa: 1}, pokemon, pokemon, this.effect);
			}
		},
		flags: {},
		name: "Wind Power",
		rating: 1,
		num: 277,
	},
	windrider: {
		onStart(pokemon) { if (pokemon.side.sideConditions['tailwind']) { this.boost({ atk: 1 }, pokemon, pokemon); } },
		onTryHit(target, source, move) { if (target !== source && move.flags['wind']) { if (!this.boost({ atk: 1 }, target, target)) { this.add('-immune', target, '[from] ability: Wind Rider'); }
				return null;
			}
		},
		onSideConditionStart(side, source, sideCondition) {
			const pokemon = this.effectState.target;
			if (sideCondition.id === 'tailwind') { this.boost({ atk: 1 }, pokemon, pokemon); }
		},
		flags: { breakable: 1 },
		name: "Wind Rider",
		rating: 3.5,
		num: 274,
	},
	zerotohero: {
		onSwitchOut(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Palafin') return;
			if (pokemon.species.forme !== 'Hero') {
				pokemon.formeChange('Palafin-Hero', this.effect, true);
				pokemon.heroMessageDisplayed = false;
			}
		},
		onSwitchIn(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Palafin') return;
			if (!pokemon.heroMessageDisplayed && pokemon.species.forme === 'Hero') { this.add('-activate', pokemon, 'ability: Zero to Hero');
				pokemon.heroMessageDisplayed = true;
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1, notransform: 1 },
		name: "Zero to Hero",
		rating: 5,
		num: 278,
	},



	// #region CAP Abilities
	mountaineer: {
		onDamage(damage, target, source, effect) { if (effect && effect.id === 'stealthrock') { return false; } },
		onTryHit(target, source, move) { if (move.type === 'Rock' && !target.activeTurns) { this.add('-immune', target, '[from] ability: Mountaineer');
			return null;
			}
		},
		isNonstandard: "CAP",
		flags: { breakable: 1 },
		name: "Mountaineer",
		rating: 3,
		num: -1,
	},
	persistent: { // implemented in the corresponding move
		isNonstandard: "CAP",
		flags: {},
		name: "Persistent",
		rating: 3,
		num: -3,
	},
	rebound: {
		isNonstandard: "CAP",
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (this.effectState.target.activeTurns) return;
			if (target === source || move.hasBounced || !move.flags['reflectable'] || target.isSemiInvulnerable()) { return; }
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, target, { target: source });
			return null;
		},
		onAllyTryHitSide(target, source, move) {
			if (this.effectState.target.activeTurns) return;
			if (target.isAlly(source) || move.hasBounced || !move.flags['reflectable'] || target.isSemiInvulnerable()) { return; }
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, this.effectState.target, { target: source });
			move.hasBounced = true; // only bounce once in free-for-all battles
			return null;
		},
		flags: { breakable: 1 },
		name: "Rebound",
		rating: 3,
		num: -2,
	},


	
	// #region No Ability
	noability: {
		isNonstandard: "Past",
		flags: {},
		name: "No Ability",
		rating: 0.1,
		num: 0,
	},
};
