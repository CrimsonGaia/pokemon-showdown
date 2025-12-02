	// @ts-nocheck
	// Modded abilities for Indigo Starstorm
	// Copied from base abilities.ts and modified for tripped support
// @ts-nocheck
// Modded abilities for Indigo Starstorm
// Copied from base abilities.ts and modified for tripped support

export const Abilities: import('../../sim/dex-abilities').AbilityDataTable = {
	bubblefoam: {
		// Dummy ability for mod compatibility
		name: "Bubblefoam",
		rating: 0,
		num: -1000,
	},
	adaptability: {
		onModifySTAB(stab, source, target, move) {
			// Only apply if the user gets STAB at all
			const moveTypes = [move.type];
			if (move.type2 && move.type2 !== move.type) moveTypes.push(move.type2);
			const matches = move.forceSTAB ? moveTypes : moveTypes.filter(t => source.hasType(t));
			if (matches.length > 0) {
				// Double the percentage bonus: (stab - 1) * 2 + 1
				return (stab - 1) * 2 + 1;
			}
		},
		flags: {},
		name: "Adaptability",
		rating: 4,
		num: 91,
	},
	innerfocus: {
		onTryAddVolatile(status, pokemon) {
			if (status.id === 'flinch' || status.id === 'tripped') return null;
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Inner Focus', `[of] ${target}`);
			}
		},
		flags: { breakable: 1 },
		name: "Inner Focus",
		rating: 1,
		num: 39,
	},
	steadfast: {
		onFlinch(pokemon) {
			this.boost({ spe: 1 });
		},
		onTripped(pokemon) {
			this.boost({ spe: 1 });
		},
		flags: {},
		name: "Steadfast",
		rating: 1,
		num: 80,
	},
	stench: {
		onModifyMovePriority: -1,
		onModifyMove(move) {
			if (move.category !== "Status") {
				this.debug('Adding Stench flinch/tripped');
				if (!move.secondaries) move.secondaries = [];
				for (const secondary of move.secondaries) {
					if (secondary.volatileStatus === 'flinch' || secondary.volatileStatus === 'tripped') return;
				}
				move.secondaries.push({
					chance: 10,
					volatileStatus: 'flinch',
				});
				move.secondaries.push({
					chance: 10,
					volatileStatus: 'tripped',
				});
			}
		},
		flags: {},
		name: "Stench",
		rating: 0.5,
		num: 1,
	},
	parentalbond: {
		onPrepareHit(source, target, move) {
			if (move.category === 'Status' || move.multihit || move.flags['noparentalbond'] || move.flags['charge'] ||
				move.flags['futuremove'] || move.spreadHit || move.isZ || move.isMax) return;
			move.multihit = 2;
			move.multihitType = 'parentalbond';
		},
		onSourceModifySecondaries(secondaries, target, source, move) {
			if (move.multihitType === 'parentalbond' && move.id === 'secretpower' && move.hit < 2) {
				// hack to prevent accidentally suppressing King's Rock/Razor Fang
				return secondaries.filter(effect => effect.volatileStatus === 'flinch' || effect.volatileStatus === 'tripped');
			}
		},
		flags: {},
		name: "Parental Bond",
		rating: 4.5,
		num: 185,
	},
	windrider: {
	// Copy of Wind Rider
	name: "Wind Rider",
	rating: 2,
	num: -2000,
	// Wind Rider: Immune to wind moves and boosts Attack when hit by one
	onTryHit(target, source, move) {
		if (move.flags && move.flags.wind) {
			this.add('-immune', target, '[from] ability: Wind Rider');
			if (target.boosts && typeof target.boosts.atk === 'number') {
				target.boosts.atk++;
			} else {
				target.boosts = target.boosts || {};
				target.boosts.atk = 1;
			}
			return null;
		}
	},
	flags: {},
},



//#region Aura Abilities
fellstinger: {
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.flags.pierce) { return this.chainModify(2); }
		},
		onModifyMove(move, pokemon) {
			if (move.flags.pierce) {
				if (move.pierce2) { delete move.pierce2; }
				if (move.pierce3) { delete move.pierce3; }
				move.pierce1 = true;
			}
		},
		flags: {},
		name: "Fell Stinger",
		rating: 3,
		num: -1001,
	},
	ragingbull: {
		onModifyMove(move, pokemon) { if (move.flags['contact']) { move.pierce2 = true; } },
		flags: {},
		name: "Raging Bull",
		rating: 3,
		num: -1002,
	},
	dragonsfury: {
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.flags['bite'] || move.flags['breath'] || move.flags['claw']) {
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Dragon's Fury",
		rating: 3,
		num: -1003,
	},
	esperwing: {
		onModifySpe(spe, pokemon) {
			return this.chainModify(2);
		},
		onModifyCritRatio(critRatio, pokemon, target, move) {
			return critRatio + 4;
		},
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
		num: -1004,
	},
	migraine: {
		onBeforeMovePriority: 2,
		onBeforeMove(pokemon) {
			if (this.randomChance(3, 10)) {
				this.add('cant', pokemon, 'ability: Migraine');
				this.damage(pokemon.baseMaxhp / 8);
				return false;
			}
		},
		flags: {},
		name: "Migraine",
		rating: 1,
		num: -1005,
	},
};
