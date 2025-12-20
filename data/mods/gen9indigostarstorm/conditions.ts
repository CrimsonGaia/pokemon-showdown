// @ts-nocheck
export const Conditions = {
	
	// #region Status	
	aura: {
		name: 'aura',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			// Self-inflicted ability-based auras only activate once per battle
			if (sourceEffect?.effectType === 'Ability' && target === source) {
				if (!target.usedAuraAbilities) { target.usedAuraAbilities = new Set(); }
				if (target.usedAuraAbilities.has(sourceEffect.id)) {
					this.add('-fail', target);
					return false;
				}
				target.usedAuraAbilities.add(sourceEffect.id);
			}
			// Ability-based auras targeting others can be used multiple times consecutively (no slot check)
			let auraAbility = 'No Ability';
			let auraName = 'Aura';
			let auraDuration = 5; // Default duration
			if (sourceEffect?.auraAbility) { auraAbility = sourceEffect.auraAbility; }
			if (sourceEffect?.auraName) { auraName = sourceEffect.auraName; }
			if (sourceEffect?.auraDuration) { auraDuration = sourceEffect.auraDuration; }
			// Store the aura ability, name, and duration in the status state
			this.effectState.auraAbility = auraAbility;
			this.effectState.auraName = auraName;
			this.effectState.time = auraDuration;
			this.effectState.ignoreNeutralizingGas = true; // Auras ignore Neutralizing Gas
			target.setAbility(auraAbility, target, sourceEffect, false, false, 2);
			if (auraName !== 'Aura') {
				this.add('-status', target, 'aura');
				this.add('-message', `${target.name}'s aura ${auraName} has engulfed their surroundings!`);
			} else { this.add('-status', target, 'aura'); }
		},
		onSwitchIn(target) {
			if (this.effectState.auraAbility) { target.setAbility(this.effectState.auraAbility, target, null, false, false, 2); }
		},
		onResidualOrder: 9,
		onResidual(pokemon) {
			if (this.effectState.time) {
				this.effectState.time--;
				if (this.effectState.time <= 0) { pokemon.cureStatus(); }
			}
		},
		onEnd(target) {
			if (this.effectState.auraAbility) {
				target.clearAbility(2);
				if (this.effectState.auraName && this.effectState.auraName !== 'Aura') {
					this.add('-end', target, 'aura');
					this.add('-message', `${target.name}'s ${this.effectState.auraName} faded!`);
				} else { this.add('-end', target, 'aura'); }
			}
		},
	},
	bubbleblight: {
		name: 'bubbleblight',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			// Cure burn before applying bubbleblight
			if (target.status === 'brn') {
				target.cureStatus();
				this.add('-curestatus', target, 'brn', '[from] bubbleblight');
				this.add('-message', `The bubbles soothed ${target.name}'s burn!`);
			}
			// Clear stat boosts
			target.clearBoosts();
			this.add('-clearboost', target);
			this.add('-status', target, 'bubbleblight');
			this.add('-message', `${target.name} is covered in bubble blight!`);
		},
		onModifyEvasion(evasion, pokemon) { return this.chainModify(0.75); },
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) { if (move.flags && move.flags.spin) { return this.chainModify(1.3); } },
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {
			if (move.flags && (move.flags.airborne || move.flags.crash || move.flags.dance || move.flags.kick)) {
				pokemon.addVolatile('slip');
				return;
			}
		},
		onEnd(target) { this.add('-end', target, 'bubbleblight'); },
	},
	brn: {
		name: 'brn',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.id === 'flameorb') { this.add('-status', target, 'brn', '[from] item: Flame Orb'); } 
			else if (sourceEffect && sourceEffect.effectType === 'Ability') { this.add('-status', target, 'brn', '[from] ability: ' + sourceEffect.name, `[of] ${source}`); } 
			else { this.add('-status', target, 'brn'); }
		},
		// Damage reduction is handled directly in the sim/battle.js damage function
		onResidualOrder: 10,
		onResidual(pokemon) {
			if (pokemon.battle.field.getPseudoWeather('timebreak')) return;
			if (pokemon.hasType('Water')) { this.damage(pokemon.baseMaxhp / 24); } 
			else if (pokemon.hasType('Ice')) { this.damage(pokemon.baseMaxhp / 8); } 
			else { this.damage(pokemon.baseMaxhp / 12); }
		},
	},
	dragonblight: {
		name: 'dragonblight',
		effectType: 'Status',
		onStart(target, source, sourceEffect) { this.add('-start', target, 'dragonblight'); },
		onEnd(target) { this.add('-end', target, 'dragonblight'); },
		onResidualOrder: 10,
		onResidual(pokemon) {
			if (pokemon.battle.field.getPseudoWeather('timebreak')) return;
			if (pokemon.hasType('Dragon') || pokemon.hasType('Fairy')) return;
			this.damage(pokemon.baseMaxhp / 12);
		},
		// Apply damage and confusion when user uses a Dragon-type move
		onBeforeMove(pokemon, target, move) {
			if (move && move.type === 'Dragon') {
				this.damage(pokemon.baseMaxhp / 12, pokemon, pokemon, this.effect);
				if (!pokemon.volatiles['confusion']) { pokemon.addVolatile('confusion'); }
			}
		},
		// Halve user's crit ratio (rounded down, min 1)
		onModifyCritRatio(critRatio, pokemon) {
			if (pokemon.volatiles['dragonblight']) { return Math.floor(critRatio / 2); }
			return critRatio;
		},
		// Halve damage for certain types
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.volatiles['dragonblight']) {
				const types = ['Electric', 'Fairy', 'Fire', 'Grass', 'Ice', 'Water'];
				if (types.includes(move.type)) { return this.chainModify(0.5); }
			}
		},
	},
	fear: {
		name: 'fear',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') { this.add('-status', target, 'fear', '[from] ability: ' + sourceEffect.name, `[of] ${source}`); } 
			else { this.add('-status', target, 'fear'); }
			// Initialize fear counter based on type
			if (target.hasType('Dark') || target.hasType('Fighting')) {
				this.effectState.fearStacks = 0;
			} else if (target.hasType('Normal') || target.hasType('Psychic')) {
				this.effectState.fearStacks = 4;
			} else {
				this.effectState.fearStacks = 2;
			}
		},
		onModifySpA(spa, pokemon) { return Math.floor(spa * 0.5); },
		onDamagingHit(damage, target, source, move) {
			if (move && (move.type === 'Dark' || move.type === 'Shadow')) {
				if (this.effectState.fearStacks < 9) {
					this.effectState.fearStacks++;
					this.add('-message', `${target.name}'s fear intensified! (Stack: ${this.effectState.fearStacks})`);
				}
			}
		},
		onBeforeMove(pokemon, target, move) {
			if (move && (move.type === 'Dark' || move.type === 'Shadow')) {
				// Steadfast: boost Speed instead of being immobilized
				if (pokemon.hasAbility('steadfast')) {
					this.add('-activate', pokemon, 'ability: Steadfast');
					this.boost({ spe: 1 }, pokemon);
					return;
				}
				this.add('cant', pokemon, 'fear');
				return false;
			}
			// Calculate freeze chance based on fear stacks
			const stacks = this.effectState.fearStacks || 0;
			let freezeChance: [number, number];
			switch (stacks) {
				case 0: freezeChance = [1, 24]; break;
				case 1: freezeChance = [1, 16]; break;
				case 2: freezeChance = [1, 12]; break;
				case 3: freezeChance = [1, 8]; break;
				case 4: freezeChance = [1, 6]; break;
				case 5: freezeChance = [1, 4]; break;
				case 6: freezeChance = [1, 3]; break;
				case 7: freezeChance = [1, 2]; break;
				case 8: freezeChance = [2, 3]; break;
				default: freezeChance = [3, 4]; break; // 9 or higher
			}
			if (this.randomChance(freezeChance[0], freezeChance[1])) {
				this.add('cant', pokemon, 'fear');
				this.add('-message', `${pokemon.name} was paralyzed with fear!`);
				return false;
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move && (move.type === 'Dark' || move.type === 'Shadow')) {
				return this.chainModify(2);
			}
		},
	},
	frz: {
		name: 'frz',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') { this.add('-status', target, 'frz', '[from] ability: ' + sourceEffect.name, `[of] ${source}`); } 
			else { this.add('-status', target, 'frz'); }
			if (target.species.name === 'Shaymin-Sky' && target.baseSpecies.baseSpecies === 'Shaymin') { target.formeChange('Shaymin', this.effect, true); }
            // Initialize freeze turn counter
            if (!target.volatiles['frzturns']) {  target.volatiles['frzturns'] = { turns: 1 }; }
			else { target.volatiles['frzturns'].turns = 1; }
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {
			if (move.flags['defrost'] && !(move.id === 'burnup' && !pokemon.hasType('Fire'))) return;
            // Calculate thaw chance: 20% per turn, max 100%
			if (pokemon.battle.field.getPseudoWeather('timebreak')) return false;
			let turns = pokemon.volatiles['frzturns'] ? pokemon.volatiles['frzturns'].turns : 1;
			let thawChance = Math.min(turns * 20, 100);
			if (this.randomChance(thawChance, 100)) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'frz');
			// Increment freeze turn counter for next turn
			if (!pokemon.volatiles['frzturns']) { pokemon.volatiles['frzturns'] = { turns: 2 }; } 
			else { if (!pokemon.battle.field.getPseudoWeather('timebreak')) { pokemon.volatiles['frzturns'].turns++; } }
			return false;
		},
		onModifyMove(move, pokemon) {
			if (move.flags['defrost']) {
				this.add('-curestatus', pokemon, 'frz', `[from] move: ${move}`);
				pokemon.clearStatus();
                if (pokemon.volatiles['frzturns']) delete pokemon.volatiles['frzturns'];
			}
		},
		onAfterMoveSecondary(target, source, move) {
			if (move.thawsTarget) {
				target.cureStatus();
                if (target.volatiles['frzturns']) delete target.volatiles['frzturns'];
			}
		},
		onDamagingHit(damage, target, source, move) {
			if ((move.type === 'Fire' && move.id !== 'polarflare') || move.thawsTarget) {
				target.cureStatus();
				if (target.volatiles['frzturns']) delete target.volatiles['frzturns'];
			}
			// Cure freeze if hit by a move that attempts to burn
			if (move && move.status === 'brn' && target.status === 'frz') {
				target.cureStatus();
				move.status = '';
			}
		},
	},
	frostbite: {
		name: 'frostbite',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			this.add('-status', target, 'frostbite');
			this.effectState.startTime = this.random(1, 3);
			this.effectState.time = this.effectState.startTime;
		},
        onModifySpA(spa, pokemon) { return Math.floor(spa * (2/3)); },
		onModifyPriority(priority, pokemon, move) { return (typeof priority === 'number' ? priority : 0) + (move?.priority ?? 0) - 0.1; },
		onResidualOrder: 9.5,
		onResidual(pokemon) {
			this.add('-message', `${pokemon.name} is suffering from frostbite.`);
			if (pokemon.battle.field.getPseudoWeather('timebreak')) return;
			this.effectState.time--;
			if (this.effectState.time <= 0) {
				this.add('-message', `${pokemon.name} was frozen solid from frostbite!`);
				// Remove frostbite and set freeze directly, bypassing status block
				pokemon.cureStatus();
				pokemon.setStatus('frz');
			}
		},
		onSetStatus(status, target, source, effect) {
			this.debug('Frostbite blocks status: ' + status.id);
			return false;
		},
		onEnd(target) { this.add('-curestatus', target, 'frostbite'); },
		onDamagingHit(damage, target, source, move) {
			// Cure frostbite if hit by a Fire-type move
			if ((move.type === 'Fire' && move.id !== 'polarflare') || move.thawsTarget) { target.cureStatus(); }
            // Cure frostbite if hit by a move that attempts to burn
            if (move && move.status === 'brn' && target.status === 'frostbite') {
                target.cureStatus();
                // Prevent burn from being applied
                move.status = '';
            }
		},
	},
	par: {
		name: 'par',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') { this.add('-status', target, 'par', '[from] ability: ' + sourceEffect.name, `[of] ${source}`); }
			else { this.add('-status', target, 'par'); }
		},
		onModifySpePriority: -101,
		onModifySpe(spe, pokemon) {
			// Psychic types ignore the Speed drop 
			if (pokemon.hasType('Psychic')) return spe;
			spe = this.finalModify(spe);
			if (!pokemon.hasAbility('quickfeet')) { spe = Math.floor(spe * 50 / 100); }
			return spe;
		},
		onModifySpA(spa, pokemon) {
			if (pokemon.hasType('Psychic')) { return Math.floor(spa * 0.8); }
			return spa;
		},
		onModifySpD(spd, pokemon) {
			if (pokemon.hasType('Psychic')) { return Math.floor(spd * 0.8); }
			return spd;
		},
		onBeforeMovePriority: 1,
		onBeforeMove(pokemon) {
			if (pokemon.hasType('Psychic')) return; // Psychic types ignore move prevention from paralysis
			if (pokemon.hasType('Electric')) return; // Electric types ignore move prevention from paralysis
			if (this.randomChance(1, 6)) {
				// Steadfast: boost Speed instead of being immobilized
				if (pokemon.hasAbility('steadfast')) {
					this.add('-activate', pokemon, 'ability: Steadfast');
					this.boost({ spe: 1 }, pokemon);
					return;
				}
				this.add('cant', pokemon, 'par');
				return false;
			}
		},
	},
	slp: {
		name: 'slp',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') { this.add('-status', target, 'slp', '[from] ability: ' + sourceEffect.name, `[of] ${source}`); } 
			else if (sourceEffect && sourceEffect.effectType === 'Move') { this.add('-status', target, 'slp', `[from] move: ${sourceEffect.name}`); } 
			else { this.add('-status', target, 'slp'); }
			let duration = this.random(2, 5); // 1-3 turns, halved for Electric and Flying types
			if (target.hasType('Electric') || target.hasType('Flying')) { duration = Math.ceil(duration / 2); }
			this.effectState.startTime = duration;
			this.effectState.time = this.effectState.startTime;
			if (target.removeVolatile('nightmare')) { this.add('-end', target, 'Nightmare', '[silent]'); }
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {
			if (pokemon.hasAbility('earlybird')) { pokemon.statusState.time--; }
			pokemon.statusState.time--;
			if (pokemon.statusState.time <= 0) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'slp');
			if (move.sleepUsable) { return; }
			return false;
		},
		onResidualOrder: 9,
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 8);
		},
		onDamagingHit(damage, target, source, move) { if (move && move.type === 'Electric' && target.status === 'slp') { target.cureStatus(); } },
	},
	drowsy: {
			name: 'drowsy',
			effectType: 'Status',
			onStart(target, source, sourceEffect) {
				this.add('-status', target, 'drowsy');
				let duration = this.random(1, 3);
				// Halve drowsy duration for Electric and Flying types
				if (target.hasType('Electric') || target.hasType('Flying')) {
					duration = Math.ceil(duration / 2);
				}
				this.effectState.startTime = duration;
				this.effectState.time = this.effectState.startTime;
			},
			onModifyPriority(priority, pokemon, move) { return (typeof priority === 'number' ? priority : 0) + (move?.priority ?? 0) - 2; },
			onResidualOrder: 9.5,
			onResidual(pokemon) {
				this.add('-message', `${pokemon.name} is drowsing.`);
				this.effectState.time--;
				if (this.effectState.time <= 0) { // Remove drowsy and set sleep directly, bypassing status block
					this.add('-message', `${pokemon.name} fell asleep from drowsiness.`);
					pokemon.cureStatus();
					pokemon.setStatus('slp');
				}
			},
			onSetStatus(status, target, source, effect) {
				this.debug('Drowsy blocks status: ' + status.id);
				return false;
			},
			onEnd(target) { this.add('-curestatus', target, 'drowsy'); },
			onFlinch(pokemon) { if (pokemon.status === 'drowsy') { pokemon.cureStatus(); } },
			onDamagingHit(damage, target, source, move) { if (move && move.type === 'Electric' && target.status === 'drowsy') { target.cureStatus(); } },
		},
	psn: {
		name: 'psn',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') { this.add('-status', target, 'psn', '[from] ability: ' + sourceEffect.name, `[of] ${source}`); } 
			else { this.add('-status', target, 'psn'); }
		},
		onModifySpD(spd, pokemon) { return Math.floor(spd * (2/3)); },
		onResidualOrder: 9,
		onResidual(pokemon) {
			if (pokemon.battle.field.getPseudoWeather('timebreak')) return;
			this.damage(pokemon.baseMaxhp / 8);
		},
	},
	tox: {
		name: 'tox',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			this.effectState.stage = 0;
			if (sourceEffect && sourceEffect.id === 'toxicorb') { this.add('-status', target, 'tox', '[from] item: Toxic Orb'); } 
			else if (sourceEffect && sourceEffect.effectType === 'Ability') { this.add('-status', target, 'tox', '[from] ability: ' + sourceEffect.name, `[of] ${source}`); } 
			else { this.add('-status', target, 'tox'); }
		},
		onSwitchIn() { this.effectState.stage = 0; },
		onResidualOrder: 9,
		onResidual(pokemon) {
			if (pokemon.battle.field.getPseudoWeather('timebreak')) return;
			if (this.effectState.stage < 15 && !pokemon.battle.field.getPseudoWeather('timebreak')) { this.effectState.stage++; }
			this.damage(this.clampIntRange(pokemon.baseMaxhp / 16, 1) * this.effectState.stage);
		},
	},

	// #region Volatiles
	allured: {
		name: 'allured',
		duration: 1,
		onStart(target, source, effect) {
			this.add('-start', target, 'allured');
			if (target.statsRaisedThisTurn) { target.addVolatile('confusion', source, effect); }
		},
		onEnd(target) { this.add('-end', target, 'allured'); },
		onAfterMove(target, source, move) { if (target.statsRaisedThisTurn) { target.addVolatile('confusion', source, move); } },
	},
    jealous: {
        name: 'jealous',
        duration: 1,
        onStart(target, source, effect) {
            this.add('-start', target, 'jealous');
            if (target.statsRaisedThisTurn) { target.trySetStatus('brn', source, effect); }
        },
        onEnd(target) { this.add('-end', target, 'jealous');  },
        onAfterMove(target, source, move) { if (target.statsRaisedThisTurn) { target.trySetStatus('brn', source, move); } },
    },
	eeriespellpp: {
		name: 'eeriespellpp',
		duration: 1,
		onStart(target) {
			this.add('-start', target, 'eeriespellpp');
			const lastMove = target.lastMove;
			if (lastMove && target.deductPP) {
				target.deductPP(lastMove.id, 3);
				this.add('-activate', target, 'move: Eerie Spell', lastMove.name);
			}
		},
		onResidualOrder: 10,
		onResidual(target) {
			const lastMove = target.lastMove;
			if (lastMove && target.deductPP) {
				target.deductPP(lastMove.id, 3);
				this.add('-activate', target, 'move: Eerie Spell', lastMove.name);
			}
		},
		onEnd(target) { this.add('-end', target, 'eeriespellpp'); },
	},
	eeriespelltrap: {
	name: 'eeriespelltrap',
	duration: 2,
	onStart(target) { this.add('-start', target, 'eeriespelltrap'); },
	onTrapPokemon(pokemon) { pokemon.trapped = true; },
	onEnd(target) { this.add('-end', target, 'eeriespelltrap'); },
	},
	confusion: {
		name: 'confusion',
		// this is a volatile status
		onStart(target, source, sourceEffect) {
			if (sourceEffect?.id === 'lockedmove') { this.add('-start', target, 'confusion', '[fatigue]'); } 
			else if (sourceEffect?.effectType === 'Ability') { this.add('-start', target, 'confusion', '[from] ability: ' + sourceEffect.name, `[of] ${source}`); } 
			else { this.add('-start', target, 'confusion'); }
			const min = sourceEffect?.id === 'axekick' ? 3 : 2;
			this.effectState.time = this.random(min, 6);
		},
		onEnd(target) { this.add('-end', target, 'confusion');
		},
		onBeforeMovePriority: 3,
		onBeforeMove(pokemon) {
			// Pause confusion duration if Timebreak is active
			if (!pokemon.battle.field.getPseudoWeather('timebreak')) { pokemon.volatiles['confusion'].time--; }
			if (!pokemon.volatiles['confusion'].time) {
				pokemon.removeVolatile('confusion');
				return;
			}
			this.add('-activate', pokemon, 'confusion');
			if (!this.randomChance(33, 100)) { return; }
			this.activeTarget = pokemon;
			const damage = this.actions.getConfusionDamage(pokemon, 40);
			if (typeof damage !== 'number') throw new Error("Confusion damage not dealt");
			const activeMove = { id: this.toID('confused'), effectType: 'Move', type: '???' };
			this.damage(damage, pokemon, pokemon, activeMove as ActiveMove);
			return false;
		},
	},
	flinch: {
		name: 'flinch',
		duration: 1,
		onBeforeMovePriority: 8,
		onBeforeMove(pokemon) {
			this.add('cant', pokemon, 'flinch');
			this.runEvent('Flinch', pokemon);
			return false;
		},
	},
	tripped: {
		name: 'tripped',
		duration: 1,
		onBeforeMovePriority: 8,
		onBeforeMove(this: Battle, pokemon: Pokemon) {
			this.add('cant', pokemon, 'tripped');
			return false;
		},
	},
	magicdust: {
			name: 'Magic Dust',
			effectType: 'Volatile',
			duration: 1,
			onTryAddVolatile(status, target) { if (this.field.getPseudoWeather('silverpowder')) { return null; } },
			onStart(target) {
				this.add('-start', target, 'magicdust');
				const terrain = target.battle.field.getTerrain();
				if (terrain === 'mistyterrain') {
					const misty = target.battle.field.pseudoWeather['mistyterrain'];
					if (misty && typeof misty.duration === 'number') { misty.duration += 2; }
				}
			},
			onImmunity(type, pokemon) { return false; },
			onEnd(target) { this.add('-end', target, 'magicdust'); },
		},
	silverpowder: {
		name: 'Silver Powder',
		effectType: 'SideCondition',
		duration: 3,
		onStart() { // Dispel Magic Dust from Pokémon on the affected side
			this.add('-sidestart', this.effectState.target, 'move: Silver Powder'); 
			for (const pokemon of this.effectState.target.active) { if (pokemon && pokemon.removeVolatile('magicdust')) { this.add('-end', pokemon, 'magicdust', '[silent]'); } }
		},
		onSourceModifyMove(move, source, target) {
			// If hit by a Fire move, ignite the powder
			if (move.type === 'Fire' && target && target.side === this.effectState.target) {
				// Powder ignites as a Bug-type Explosive move dealing 1/8 HP
				const damage = Math.max(1, Math.floor(target.maxhp / 8));
				this.add('-activate', target, 'move: Silver Powder');
				this.damage(damage, target, target, {id: 'silverpowderexplosion', effectType: 'Move', type: 'Bug', flags: { explosive: 1 }, isExternal: true});
			}
		},
		onTryMovePriority: -1,
		onTryMove(pokemon, target, move) {
			// If an affected pokemon attempts to use a Fire move, trigger explosion
			if (pokemon.side === this.effectState.target && move.type === 'Fire') {
				this.add('-activate', pokemon, 'move: Silver Powder');
				const damage = Math.max(1, Math.floor(pokemon.maxhp / 8));
				this.damage(damage, pokemon, pokemon, {id: 'silverpowderexplosion', effectType: 'Move', type: 'Bug', flags: { explosive: 1 }, isExternal: true});
				this.attrLastMove('[still]');
				return false;
			}
		},
		onResidual() { // Reduce Misty Terrain by 2 turns every turn
			const misty = this.field.pseudoWeather['mistyterrain'];
			if (misty && typeof misty.duration === 'number') {
				misty.duration = Math.max(0, misty.duration - 2);
				if (misty.duration === 0) {
					this.field.removePseudoWeather('mistyterrain');
					this.add('-fieldend', 'move: Misty Terrain');
				}
			}
			// Deal 1/8 damage to Dragon, Fairy, and Ghost types
			for (const pokemon of this.effectState.target.active) { if (pokemon && !pokemon.fainted && (pokemon.hasType('Dragon') || pokemon.hasType('Fairy') || pokemon.hasType('Ghost'))) { this.damage(pokemon.maxhp / 8, pokemon); } }
		},
		onEnd() { this.add('-sideend', this.effectState.target, 'move: Silver Powder'); },
	},
	fairylockfree: {
		name: 'fairylockfree',
		noCopy: true,
		onStart(pokemon) { this.add('-start', pokemon, 'fairylockfree', '[silent]'); },
	},
	curse: {
        name: 'Curse',
	    effectType: 'Volatile',
	    onStart(target) { this.add('-start', target, 'curse'); },
	    onResidualOrder: 10,
        onResidual(pokemon) {
			if (pokemon.battle.field.getPseudoWeather('timebreak')) return;
			this.damage(pokemon.baseMaxhp / 4);
	    },
	    onEnd(target) { this.add('-end', target, 'curse'); },
    },
	migraine: {
		name: 'Migraine',
		effectType: 'Volatile',
		duration: 7,
		onStart(target) { this.add('-start', target, 'migraine'); },
		onBeforeMovePriority: 2,
		onBeforeMove(pokemon) {
			if (this.randomChance(3, 10)) {
				this.add('cant', pokemon, 'migraine');
				this.damage(pokemon.baseMaxhp / 8);
				return false;
			}
		},
		onEnd(target) { this.add('-end', target, 'migraine'); },
	},
	trapped: {
		name: 'trapped',
		noCopy: true,
		onTrapPokemon(pokemon) { pokemon.tryTrap(); },
		onStart(target) { this.add('-activate', target, 'trapped'); },
	},
	trapper: {
		name: 'trapper',
		noCopy: true,
	},
	partiallytrapped: {
		name: 'partiallytrapped',
		duration: 5,
		onStart(pokemon, source) {
			this.add('-activate', pokemon, 'move: ' + this.effectState.sourceEffect, `[of] ${source}`);
			this.effectState.boundDivisor = source.hasItem('gripclaw') ? 6 : 8;
			this.effectState.boundDivisor = source.hasItem('bindingband') ? 5 : 8;
			// Flying-types become grounded when bound
			if (pokemon.hasType('Flying') && !pokemon.volatiles['groundedbyaffliction']) {
				pokemon.addVolatile('groundedbyaffliction');
				this.add('-message', `${pokemon.name} became grounded due to being bound!`);
			}
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, this.effectState.sourceEffect, '[partiallytrapped]');
			// Remove grounded effect if present
			if (pokemon.volatiles['groundedbyaffliction']) {
				pokemon.removeVolatile('groundedbyaffliction');
				this.add('-message', `${pokemon.name} freed its movement.`);
			}
		},
		onTrapPokemon(pokemon) {
			const gmaxEffect = ['gmaxcentiferno', 'gmaxsandblast'].includes(this.effectState.sourceEffect.id);
			if (this.effectState.source?.isActive || gmaxEffect) pokemon.tryTrap();
		},
		onResidualOrder: 13,
		onResidual(pokemon) {
			const source = this.effectState.source;
			// G-Max Centiferno and G-Max Sandblast continue even after the user leaves the field
			const gmaxEffect = ['gmaxcentiferno', 'gmaxsandblast'].includes(this.effectState.sourceEffect.id);
			if (source && (!source.isActive || source.hp <= 0 || !source.activeTurns) && !gmaxEffect) {
				delete pokemon.volatiles['partiallytrapped'];
				this.add('-end', pokemon, this.effectState.sourceEffect, '[partiallytrapped]', '[silent]');
				return;
			}
			this.damage(pokemon.baseMaxhp / this.effectState.boundDivisor);
		},
	},
	groundedbyaffliction: {
		name: 'Grounded (Affliction)',
		effectType: 'Volatile',
		onStart(pokemon) {
			// Apply grounded hazards as if the Pokémon just switched in
			// Check for and apply each hazard effect that affects grounded Pokémon
			const side = pokemon.side;
			
			// Sticky Web
			if (side.sideConditions['stickyweb']) {
				if (!pokemon.hasItem('heavydutyboots')) {
					this.add('-activate', pokemon, 'move: Sticky Web');
					this.boost({ spe: -1 }, pokemon, side.foe.active[0], this.dex.getActiveMove('stickyweb'));
				}
			}
			
			// Spikes
			if (side.sideConditions['spikes']) {
				if (!pokemon.hasItem('heavydutyboots') && !pokemon.hasType('Bug')) {
					const layers = side.sideConditions['spikes'].layers;
					const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
					this.damage(damageAmounts[layers] * pokemon.maxhp / 24);
				}
			}
			
			// Toxic Spikes
			if (side.sideConditions['toxicspikes']) {
				if (pokemon.hasType('Poison')) {
					this.add('-sideend', side, 'move: Toxic Spikes', `[of] ${pokemon}`);
					side.removeSideCondition('toxicspikes');
				} else if (!pokemon.hasType('Steel') && !pokemon.hasItem('heavydutyboots') && !pokemon.hasType('Bug')) {
					const layers = side.sideConditions['toxicspikes'].layers;
					if (layers >= 2) {
						pokemon.trySetStatus('tox', side.foe.active[0]);
					} else {
						pokemon.trySetStatus('psn', side.foe.active[0]);
					}
				}
			}
			
			// Steel Spikes (if present in your mod)
			if (side.sideConditions['steelspikes']) {
				if (!pokemon.hasItem('heavydutyboots')) {
					const layers = side.sideConditions['steelspikes'].layers || 1;
					const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
					this.damage(damageAmounts[layers] * pokemon.maxhp / 24);
				}
			}
		},
		// Override Ground-type immunity
		onImmunity(type) {
			if (type === 'Ground') return false;
		},
	},
	rainboweffect: {
		name: 'rainboweffect',
		effectType: 'Volatile',
		duration: 4,
		onStart(target) { this.add('-start', target, 'rainboweffect'); },
		onModifyMove(move, pokemon) {
			if (move.secondaries && move.id !== 'secretpower') {
				this.debug('doubling secondary chance (rainboweffect)');
				for (const secondary of move.secondaries) {
					if (pokemon.hasAbility('serenegrace') && secondary.volatileStatus === 'flinch') continue;
					if (secondary.chance) secondary.chance *= 2;
				}
				if (move.self?.chance) move.self.chance *= 2;
			}
		},
		onEnd(target) { this.add('-end', target, 'rainboweffect'); },
	},
	trackgroundedstate: {
		name: 'trackgroundedstate',
		effectType: 'Volatile',
		noCopy: true,
		// Silent volatile used to track grounding state changes
		// No onStart/onEnd to avoid message spam
	},
	// Volatile condition: LuckEffect (boosts secondary effect chance by 20%)
	luckeffect: {
		name: 'luckeffect',
		effectType: 'Volatile',
		duration: 4,
		onStart(target) { this.add('-start', target, 'luckeffect'); },
		onModifyMove(move, pokemon) {
			if (move.secondaries && move.id !== 'secretpower') {
				this.debug('boosting secondary chance by 20% (luckeffect)');
				for (const secondary of move.secondaries) {
					if (pokemon.hasAbility('serenegrace') && secondary.volatileStatus === 'flinch') continue;
					if (secondary.chance) secondary.chance = Math.min(secondary.chance * 1.2, 100);
				}
				if (move.self?.chance) move.self.chance = Math.min(move.self.chance * 1.2, 100);
			}
		},
		onEnd(target) { this.add('-end', target, 'luckeffect'); },
	},
	//#region Other
	lockedmove: {
		// Outrage, Thrash, Petal Dance...
		name: 'lockedmove',
		duration: 2,
		onResidual(target) {
			if (target.status === 'slp') { delete target.volatiles['lockedmove']; } // don't lock, and bypass confusion for calming
			// Pause lockedmove duration decrement if Timebreak is active
			if (target.battle.field.getPseudoWeather('timebreak')) return;
			this.effectState.trueDuration--;
		},
		onStart(target, source, effect) {
			this.effectState.trueDuration = this.random(2, 4);
			this.effectState.move = effect.id;
		},
		onRestart() { if (this.effectState.trueDuration >= 2) { this.effectState.duration = 2; } },
		onAfterMove(pokemon) { if (this.effectState.duration === 1) { pokemon.removeVolatile('lockedmove'); } },
		onEnd(target) {
			if (this.effectState.trueDuration > 1) return;
			target.addVolatile('confusion');
		},
		onLockMove(pokemon) {
			if (pokemon.volatiles['dynamax']) return;
			return this.effectState.move;
		},
	},
	twoturnmove: {
		// Skull Bash, SolarBeam, Sky Drop...
		name: 'twoturnmove',
		duration: 2,
		onStart(attacker, defender, effect) {
			// ("attacker" is the Pokemon using the two turn move and the Pokemon this condition is being applied to)
			this.effectState.move = effect.id;
			attacker.addVolatile(effect.id);
			// lastMoveTargetLoc is the location of the originally targeted slot before any redirection
			// note that this is not updated for moves called by other moves
			// i.e. if Dig is called by Metronome, lastMoveTargetLoc will still be the user's location
			let moveTargetLoc: number = attacker.lastMoveTargetLoc!;
			if (effect.sourceEffect && this.dex.moves.get(effect.id).target !== 'self') {
				// this move was called by another move such as Metronome
				// and needs a random target to be determined this turn
				// it will already have one by now if there is any valid target
				// but if there isn't one we need to choose a random slot now
				if (defender.fainted) { defender = this.sample(attacker.foes(true)); }
				moveTargetLoc = attacker.getLocOf(defender);
			}
			attacker.volatiles[effect.id].targetLoc = moveTargetLoc;
			this.attrLastMove('[still]');
			// Run side-effects normally associated with hitting (e.g., Protean, Libero)
			this.runEvent('PrepareHit', attacker, defender, effect);
        },
        onResidual(target) {
            // Pause twoturnmove duration decrement if Timebreak is active
            if (target.battle.field.getPseudoWeather('timebreak')) return;
            this.effectState.duration--;
		},
		onEnd(target) { target.removeVolatile(this.effectState.move); },
		onLockMove() { return this.effectState.move; },
		onMoveAborted(pokemon) { pokemon.removeVolatile('twoturnmove'); },
	},
	choicelock: {
		name: 'choicelock',
		noCopy: true,
		onStart(pokemon) {
			if (!this.activeMove) throw new Error("Battle.activeMove is null");
			if (!this.activeMove.id || this.activeMove.hasBounced || this.activeMove.sourceEffect === 'snatch') return false;
			this.effectState.move = this.activeMove.id;
		},
		onBeforeMove(pokemon, target, move) {
			if (!pokemon.getItem().isChoice) {
				pokemon.removeVolatile('choicelock');
				return;
			}
			if ( !pokemon.ignoringItem() && !pokemon.volatiles['dynamax'] && move.id !== this.effectState.move && move.id !== 'struggle' ) 
			{
				// Fails unless the Choice item is being ignored, and no PP is lost
				this.addMove('move', pokemon, move.name);
				this.attrLastMove('[still]');
				this.debug("Disabled by Choice item lock");
				this.add('-fail', pokemon);
				return false;
			}
		},
		onDisableMove(pokemon) {
			if (!pokemon.getItem().isChoice || !pokemon.hasMove(this.effectState.move)) {
				pokemon.removeVolatile('choicelock');
				return;
			}
			if (pokemon.ignoringItem() || pokemon.volatiles['dynamax']) { return; }
			for (const moveSlot of pokemon.moveSlots) { if (moveSlot.id !== this.effectState.move) { pokemon.disableMove(moveSlot.id, false, this.effectState.sourceEffect); } }
		},
	},
	mustrecharge: {
		name: 'mustrecharge',
		duration: 2,
		onBeforeMovePriority: 11,
		onBeforeMove(pokemon) {
			this.add('cant', pokemon, 'recharge');
			pokemon.removeVolatile('mustrecharge');
			pokemon.removeVolatile('truant');
			return null;
		},
		onStart(pokemon) { this.add('-mustrecharge', pokemon); },
		onLockMove: 'recharge',
        onResidual(target) {
            // Pause mustrecharge duration decrement if Timebreak is active
            if (target.battle.field.getPseudoWeather('timebreak')) return;
            this.effectState.duration--;
        },
	},
	futuremove: {
		// this is a slot condition
		name: 'futuremove',
		onStart(target) {
			this.effectState.targetSlot = target.getSlot();
			this.effectState.endingTurn = (this.turn - 1) + 2;
			if (this.effectState.endingTurn >= 254) { this.hint(`In Gen 8+, Future attacks will never resolve when used on the 255th turn or later.`); }
		},
		onResidualOrder: 3,
		onResidual(target: Pokemon) {
			if (this.getOverflowedTurnCount() < this.effectState.endingTurn) return;
			target.side.removeSlotCondition(this.getAtSlot(this.effectState.targetSlot), 'futuremove');
		},
		onEnd(target) {
			const data = this.effectState;
			// time's up; time to hit! :D
			const move = this.dex.moves.get(data.move);
			if (target.fainted || target === data.source) {
				this.hint(`${move.name} did not hit because the target is ${(target.fainted ? 'fainted' : 'the user')}.`);
				return;
			}
			this.add('-end', target, 'move: ' + move.name);
			target.removeVolatile('Protect');
			target.removeVolatile('Endure');
			if (data.source.hasAbility('infiltrator') && this.gen >= 6) { data.moveData.infiltrates = true; }
			if (data.source.hasAbility('normalize') && this.gen >= 6) { data.moveData.type = 'Normal'; }
			const hitMove = new this.dex.Move(data.moveData) as ActiveMove;
			this.actions.trySpreadMoveHit([target], data.source, hitMove, true);
			if (data.source.isActive && data.source.hasItem('lifeorb') && this.gen >= 5) { this.singleEvent('AfterMoveSecondarySelf', data.source.getItem(), data.source.itemState, data.source, target, data.source.getItem()); }
			this.activeMove = null;
			this.checkWin();
		},
	},
	healreplacement: {
		// this is a slot condition
		name: 'healreplacement',
		onStart(target, source, sourceEffect) {
			this.effectState.sourceEffect = sourceEffect;
			this.add('-activate', source, 'healreplacement');
		},
		onSwitchIn(target) {
			if (!target.fainted) {
				target.heal(target.maxhp);
				this.add('-heal', target, target.getHealth, '[from] move: ' + this.effectState.sourceEffect, '[zeffect]');
				target.side.removeSlotCondition(target, 'healreplacement');
			}
		},
	},
	stall: {
		// Protect, Detect, Endure counter
		name: 'stall',
		duration: 2,
		counterMax: 729,
		onStart() { this.effectState.counter = 3; },
		onStallMove(pokemon) {
			// this.effectState.counter should never be undefined here.
			// However, just in case, use 1 if it is undefined.
			const counter = this.effectState.counter || 1;
			this.debug(`Success chance: ${Math.round(100 / counter)}%`);
			const success = this.randomChance(1, counter);
			if (!success) delete pokemon.volatiles['stall'];
			return success;
		},
		onRestart() {
			if (this.effectState.counter < (this.effect as Condition).counterMax!) { this.effectState.counter *= 3; }
			this.effectState.duration = 2;
		},
	},
	gem: {
		name: 'gem',
		duration: 1,
		affectsFainted: true,
		onBasePowerPriority: 14,
		onBasePower(basePower, user, target, move) {
			this.debug('Gem Boost');
			return this.chainModify([5325, 4096]);
		},
	},

	// #region Weather 
	hail: {
		name: 'Hail',
		effectType: 'Weather',
		duration: 7,
		durationCallback(source, effect) {
			if (source?.hasItem('icyrock')) { return 11; }
			return 7;
		},
		onModifyDefPriority: 10,
		onModifyDef(def, pokemon) {
			if (pokemon.hasType('Ice') && this.field.isWeather('hail')) { return this.modify(def, 1.5); }
		},
		onModifyWeatherDamage(damage, attacker, defender, move) { if (move.flags && move.flags.wind) { return this.chainModify(1.2); } },
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'Hail', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else { this.add('-weather', 'Hail'); }
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			if (this.field.getPseudoWeather('timebreak')) return;
			if (target.battle.field.getPseudoWeather('timebreak')) return;
			this.add('-weather', 'Hail', '[upkeep]');
			if (this.field.isWeather('hail')) this.eachEvent('Weather');
		},
		onWeather(target) {
			if (target.hasType('Dragon') || target.hasType('Grass')) { this.damage(target.baseMaxhp / 8); } 
			else { this.damage(target.baseMaxhp / 16); }
		},
		onFieldEnd() { this.add('-weather', 'none'); },
	},
	snowscape: {
		name: 'Snowscape',
		effectType: 'Weather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('icyrock')) { return 8; }
			return 5;
		},
		onModifyDefPriority: 10,
		onModifyDef(def, pokemon) {
			if (this.field.isWeather('snowscape')) {
				if (pokemon.hasType('Ice')) { def = this.modify(def, 1.5); }
				if (pokemon.hasType('Steel')) { if (!(pokemon.hasType('Ice'))) { def = this.modify(def, 0.5); } }
				return def;
			}
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'Snowscape', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else { this.add('-weather', 'Snowscape'); }
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			if (this.field.getPseudoWeather('timebreak')) return;
			this.add('-weather', 'Snowscape', '[upkeep]');
			if (this.field.isWeather('snowscape')) this.eachEvent('Weather');
		},
		onWeather(target) { if (target.hasType('ice')) { this.heal(target.baseMaxhp / 16); } },
		onFieldEnd() { this.add('-weather', 'none'); },
	},
	raindance: {
		name: 'RainDance',
		effectType: 'Weather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('damprock')) { return 8; }
			return 5;
		},
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === 'Water') {
				this.debug('rain water boost');
				return this.chainModify(1.5);
			}
			if (move.type === 'Fire') {
				this.debug('rain fire suppress');
				return this.chainModify(0.5);
			}
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'RainDance', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else { this.add('-weather', 'RainDance'); }
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			if (this.field.getPseudoWeather('timebreak')) return;
			this.add('-weather', 'RainDance', '[upkeep]');
			if (this.field.isWeather('raindance')) this.eachEvent('Weather');
		},
		onWeather(target) {
			if (target.hasType('Water')) { this.heal(target.baseMaxhp / 16); } 
			else if (target.hasType('Fire') || target.hasType('Poison')) { this.damage(target.baseMaxhp / 16); }
		},
		onFieldEnd() { this.add('-weather', 'none'); },
	},
	primordialsea: {
		name: 'PrimordialSea',
		effectType: 'Weather',
		duration: 0,
		onTryMovePriority: 1,
		onTryMove(attacker, defender, move) {
			if (move.type === 'Fire' && move.category !== 'Status') {
				this.debug('Primordial Sea fire suppress');
				this.add('-fail', attacker, move, '[from] Primordial Sea');
				this.attrLastMove('[still]');
				return null;
			}
		},
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === 'Water') {
				this.debug('Rain water boost');
				return this.chainModify(1.5);
			}
		},
		onFieldStart(field, source, effect) { this.add('-weather', 'PrimordialSea', '[from] ability: ' + effect.name, `[of] ${source}`); },
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'PrimordialSea', '[upkeep]');
			this.eachEvent('Weather');
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hasType('Water')) { this.heal(pokemon.baseMaxhp / 8, pokemon); } 
				else if (pokemon.hasType('Fire') || pokemon.hasType('Poison')) { this.damage(pokemon.baseMaxhp / 8, pokemon); }
			}
		},
		onFieldEnd() { this.add('-weather', 'none'); },
	},
	sandstorm: {
		name: 'Sandstorm',
		effectType: 'Weather',
		duration: 7,
		durationCallback(source, effect) {
			if (source?.hasItem('smoothrock')) { return 11; }
			return 7;
		},
		onTryMovePriority: 2,
		onTryMove(attacker, defender, move) {
			if (move.flags && move.flags.powder) {
				this.add('-fail', attacker, move, '[from] Sandstorm');
				this.add('-message', "The winds spread the powder wide, nullifying their effects");
				return false;
			}
		},
		// This should be applied directly to the stat before any of the other modifiers are chained
		// So we give it increased priority.
		onModifySpDPriority: 10,
		onModifySpD(spd, pokemon) { if (pokemon.hasType('Rock') && this.field.isWeather('sandstorm')) { return this.modify(spd, 1.5); } },
		onModifyWeatherDamage(damage, attacker, defender, move) { if (move.flags && move.flags.wind) { return this.chainModify(1.1); } },
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'Sandstorm', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else { this.add('-weather', 'Sandstorm'); }
			for (const pokemon of this.getAllActive()) { pokemon.addVolatile('windburst'); }
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			if (this.field.getPseudoWeather('timebreak')) return;
			this.add('-weather', 'Sandstorm', '[upkeep]');
			if (this.field.isWeather('sandstorm')) this.eachEvent('Weather');
			for (const pokemon of this.getAllActive()) { pokemon.addVolatile('windburst'); }
		},
		onWeather(target) {
			if (target.hasType('Fire')) { this.damage(target.baseMaxhp / 8); } 
			else { this.damage(target.baseMaxhp / 16); }
		},
		onFieldEnd() { this.add('-weather', 'none'); },
	},
	sunnyday: {
		name: 'SunnyDay',
		effectType: 'Weather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('heatrock')) { return 8; }
			return 5;
		},
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (move.id === 'hydrosteam' && !attacker.hasItem('utilityumbrella')) {
				this.debug('Sunny Day Hydro Steam boost');
				return this.chainModify(1.5);
			}
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === 'Fire') {
				this.debug('Sunny Day fire boost');
				return this.chainModify(1.5);
			}
			if (move.type === 'Water') {
				this.debug('Sunny Day water suppress');
				return this.chainModify(0.5);
			}
			if (move.flags && (move.flags.solar || move.flags.lunar)) { return this.chainModify(1.2); }
			// Stack slicing effect for Steel/Ice dual types, but Fire types are immune
			if (move.flags && move.flags.slicing) {
				const isSteel = defender.hasType('Steel');
				const isIce = defender.hasType('Ice');
				const isFire = defender.hasType('Fire');
				if (isFire) return;
				if (isSteel && isIce) { return this.chainModify(1.2 * 1.2);  } // 1.44x for dual type
				else if (isSteel || isIce) { return this.chainModify(1.2); }
			}
		},
		onFieldStart(battle, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'SunnyDay', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else { this.add('-weather', 'SunnyDay'); }
		},
		onImmunity(type, pokemon) {
			if (pokemon.hasItem('utilityumbrella')) return;
			if (type === 'frz') return false;
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			if (this.field.getPseudoWeather('timebreak')) return;
			this.add('-weather', 'SunnyDay', '[upkeep]');
			if (this.field.isWeather('sunnyday')) this.eachEvent('Weather');
		},
		onWeather(target) {
				if (target.hasType('Ice') && !target.hasType('Fire')) { this.damage(target.baseMaxhp / 16); }
				if (target.hasType('grass')) { this.heal(target.baseMaxhp / 16); }
		},
		onFieldEnd() { this.add('-weather', 'none'); },
	},
	desolateland: {
		name: 'DesolateLand',
		effectType: 'Weather',
		duration: 0,
		onTryMovePriority: 1,
		onTryMove(attacker, defender, move) {
			if (move.type === 'Water' && move.category !== 'Status') {
				this.debug('Desolate Land water suppress');
				this.add('-fail', attacker, move, '[from] Desolate Land');
				this.attrLastMove('[still]');
				return null;
			}
		},
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === 'Fire') {
				this.debug('Desolate Land fire boost');
				return this.chainModify(1.5);
			}
			if (move.flags && (move.flags.solar || move.flags.lunar)) { return this.chainModify(1.5); }
			// Stack slicing effect for Steel/Ice dual types, but Fire types are immune
			if (move.flags && move.flags.slicing) {
				const isSteel = defender.hasType('Steel');
				const isIce = defender.hasType('Ice');
				const isFire = defender.hasType('Fire');
				if (isFire) return;
				if (isSteel && isIce) { return this.chainModify(1.2 * 1.2); } // 1.44x for dual type 
				else if (isSteel || isIce) { return this.chainModify(1.2); }
			}
		},
		onFieldStart(field, source, effect) { this.add('-weather', 'DesolateLand', '[from] ability: ' + effect.name, `[of] ${source}`); },
		onImmunity(type, pokemon) {
			if (pokemon.hasItem('utilityumbrella')) return;
			if (type === 'frz') return false;
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			if (this.field.getPseudoWeather('timebreak')) return;
			this.add('-weather', 'DesolateLand', '[upkeep]');
			this.eachEvent('Weather');
		},
		onWeather(target) {
			// Double healing and damage effects compared to SunnyDay
			if (target.hasType('Ice') && !target.hasType('Fire')) { this.damage(target.baseMaxhp / 8); }
			if (target.hasType('Steel') && !target.hasType('Fire')) { this.damage(target.baseMaxhp / 16); }
			if (target.hasType('grass')) { this.heal(target.baseMaxhp / 8);}
		},
		onFieldEnd() { this.add('-weather', 'none');},
	},
	turbulentwinds: {
		name: 'TurbulentWinds',
		effectType: 'Weather',
		duration: 0,
		durationCallback(source, effect) {
			if (source?.hasItem('floatstone')) { return 11; }
			return 7;
		},
		// Make Bug types airborne while Turbulent Winds is active (immune to all grounded effects)
		onImmunity(type, pokemon) {
			if (this.field.isWeather('turbulentwinds') && pokemon.hasType('Bug')) {
				// Bug types are treated as airborne for all grounded effects
				const groundedEffects = [
					'ground', // Ground-type moves
					'spikes', 'toxicspikes', // Entry hazards
					'arenatrap', // Trapping ability
					'stickyweb', // Sticky Web
					'terrain', // Terrain effects
				];
				if (groundedEffects.includes(type)) { return false; }
			}
		},
		// Prevent Tailwind from being set while active
		onTrySideCondition(condition, target, source, effect) {
			if (condition === 'stealthrock' && this.field.isWeather('turbulentwinds')) {
				if (!this.field.stealthRockSuppressed) {
					this.add('-message', 'Stealth Rock is suppressed by Turbulent Winds!');
					this.field.stealthRockSuppressed = true;
				}
				return false;
			}
			if (condition === 'tailwind' && this.field.isWeather('turbulentwinds')) {
				this.add('-message', 'Tailwind cannot be set while Turbulent Winds are active!');
				return false;
			}
			// Prevent Stealth Rock activation while weather is active
			if (condition === 'stealthrock' && this.field.isWeather('turbulentwinds')) {
				if (!this.field.stealthRockSuppressed) {
					this.add('-message', 'The rocks were swept up by the Turbulent Winds!');
					this.field.stealthRockSuppressed = true;
				}
				return false;
			}
		},
		onTryMovePriority: 2,
		onTryMove(attacker, defender, move) {
			if (move.flags && move.flags.powder) {
				this.add('-fail', attacker, move, '[from] Turbulent Winds');
				this.add('-message', "The winds spread the powder wide, nullifying their effects");
				return false;
			}
		},
        // Prevent Flying types from being grounded
        onTryImmunity(type, pokemon) {
            const groundingEffects = ['gravity', 'ingrain', 'smackdown', 'ironball', 'gastroacid', 'terrain'];
            if (pokemon.hasType('Flying') && groundingEffects.includes(type)) { return false; }
        },
		onWeatherModifyDamage(damage, attacker, defender, move) { if (move.flags && (move.flags.wind)) { return this.chainModify(1.3); } },
		onFieldStart(field, source, effect) {
			this.add('-weather', 'TurbulentWinds', '[from] ability: ' + effect.name, `[of] ${source}`);
			let dispelled = false;
			for (const side of this.sides) { if (side.removeSideCondition('tailwind')) { dispelled = true; } }
			if (dispelled) { this.add('-message', 'Turbulent Winds rage, dispelling all Tailwinds!'); }
			for (const pokemon of this.getAllActive()) { pokemon.addVolatile('windburst'); }
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			if (this.field.getPseudoWeather('timebreak')) return;
			this.add('-weather', 'TurbulentWinds', '[upkeep]');
			this.eachEvent('Weather');
			for (const pokemon of this.getAllActive()) { pokemon.addVolatile('windburst'); }
		},
		onWeather(target) { if (target.hasType('Fire')) { this.damage(target.baseMaxhp / 16); } },
		onFieldEnd() {
			if (this.field.stealthRockSuppressed) {
				this.add('-message', 'The rocks settle back into position.');
				this.field.stealthRockSuppressed = false;
			}
			this.add('-weather', 'none');
		},
	},
	deltastream: {
		name: 'DeltaStream',
		effectType: 'Weather',
		duration: 0,
		onEffectivenessPriority: -1,
		onEffectiveness(typeMod, target, type, move) {
			if (move && move.effectType === 'Move' && move.category !== 'Status' && type === 'Flying' && typeMod > 0) {
				this.add('-fieldactivate', 'Delta Stream');
				return 0;
			}
		},
		// Make Bug types airborne while DeltaStream is active (immune to all grounded effects)
		onImmunity(type, pokemon) {
			if (this.field.isWeather('deltastream') && pokemon.hasType('Bug')) {
				const groundedEffects = [ 'ground', 'spikes', 'toxicspikes', 'arenatrap', 'stickyweb', 'terrain', ];
				if (groundedEffects.includes(type)) { return false; }
			}
		},
		// Prevent Tailwind from being set while active
		onTrySideCondition(condition, target, source, effect) {
			if (condition === 'stealthrock' && this.field.isWeather('deltastream')) {
				if (!this.field.stealthRockSuppressed) {
					this.add('-message', 'The rocks were swept up by Delta Stream!');
					this.field.stealthRockSuppressed = true;
				}
				return false;
			}
			if (condition === 'tailwind' && this.field.isWeather('deltastream')) {
				this.add('-message', 'Tailwind cannot be set while Delta Stream is active!');
				return false;
			}
		},
		onTryMovePriority: 2,
		onTryMove(attacker, defender, move) {
			if (move.flags && move.flags.powder) {
				this.add('-fail', attacker, move, '[from] Delta Stream');
				this.add('-message', "The winds spread the powder wide, nullifying their effects");
				return false;
			}
		},
		// Prevent Flying types from being grounded
		onTryImmunity(type, pokemon) {
			const groundingEffects = ['gravity', 'ingrain', 'smackdown', 'ironball', 'gastroacid', 'terrain'];
			if (pokemon.hasType('Flying') && groundingEffects.includes(type)) { return false; }
		},
		onWeatherModifyDamage(damage, attacker, defender, move) { if (move.flags && (move.flags.wind)) { return this.chainModify(1.5); } },
		onFieldStart(field, source, effect) {
			this.add('-weather', 'DeltaStream', '[from] ability: ' + effect.name, `[of] ${source}`);
			let dispelled = false;
			for (const side of this.sides) { if (side.removeSideCondition('tailwind')) { dispelled = true; } }
			if (dispelled) { this.add('-message', 'Delta Stream overpowers, dispelling all Tailwinds!'); }
			for (const pokemon of this.getAllActive()) {pokemon.addVolatile('windburst'); }
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			if (this.field.getPseudoWeather('timebreak')) return;
			this.add('-weather', 'DeltaStream', '[upkeep]');
			this.eachEvent('Weather');
			for (const pokemon of this.getAllActive()) { pokemon.addVolatile('windburst'); }
		},
		onWeather(target) { if (target.hasType('Fire')) { this.damage(target.baseMaxhp / 8); } },
		onFieldEnd() {
			if (this.field.stealthRockSuppressed) {
				this.add('-message', 'The rocks settle back into position.');
				this.field.stealthRockSuppressed = false;
			}
			this.add('-weather', 'none');
		},
	},

	// #region Terrain 
	electricterrain: {
	
		name: "Electric Terrain",
		effectType: "Terrain",
		duration: 4,
		durationCallback(source, effect) {
			if (source?.hasItem('terrainextender')) { return 11; }
			return 4;
		},
		onSetStatus(status, target, source, effect) {
			if (status.id === 'slp' && target.isGrounded() && !target.isSemiInvulnerable()) {
				if (effect.id === 'yawn' || (effect.effectType === 'Move' && !effect.secondaries)) { this.add('-activate', target, 'move: Electric Terrain'); }
				return false;
			}
		},
		onTryAddVolatile(status, target) {
			if (!target.isGrounded() || target.isSemiInvulnerable()) return;
			if (status.id === 'yawn') {
				this.add('-activate', target, 'move: Electric Terrain');
				return null;
			}
		},
		onBasePowerPriority: 6,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Electric' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
				this.debug('electric terrain boost');
				return this.chainModify([5325, 4096]);
			}
			if (move.flags && move.flags.pulse && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
				this.debug('pulse move weakened by electric terrain');
				return this.chainModify(0.7);
			}
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') { this.add('-fieldstart', 'move: Electric Terrain', '[from] ability: ' + effect.name, `[of] ${source}`); } 
			else { this.add('-fieldstart', 'move: Electric Terrain'); }
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hasType('Steel')) {
					pokemon.addVolatile('electricterrainairborne');
					this.add('-message', `${pokemon.name} is lifted by the magnetic field!`);
				}
			}
		},
		onFieldResidualOrder: 27,
		onFieldResidualSubOrder: 7,
		onFieldEnd() {
			for (const pokemon of this.getAllActive()) {
				if (pokemon.volatiles['electricterrainairborne']) {
					pokemon.removeVolatile('electricterrainairborne');
					this.add('-message', `${pokemon.name} fell to the ground.`);
				}
			}
			this.add('-fieldend', 'move: Electric Terrain');
		},
	},
	grassyterrain: {
	
		name: "Grassy Terrain",
		effectType: "Terrain",
		duration: 4,
		durationCallback(source, effect) { if (source?.hasItem('terrainextender')) { return 11; }
			return 4;
		},
		onBasePowerPriority: 6,
		onBasePower(basePower, attacker, defender, move) {
			const weakenedMoves = ['earthquake', 'bulldoze', 'magnitude'];
			if (move.type === 'Ground' && defender.isGrounded() && !defender.isSemiInvulnerable()) { this.debug('ground move weakened by grassy terrain');
				return this.chainModify(0.5);
			}
			if (move.type === 'Grass' && attacker.isGrounded()) { this.debug('grassy terrain boost');
				return this.chainModify([5325, 4096]);
			}
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') { this.add('-fieldstart', 'move: Grassy Terrain', '[from] ability: ' + effect.name, `[of] ${source}`); } 
			else { this.add('-fieldstart', 'move: Grassy Terrain'); }
		},
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (pokemon.isGrounded() && !pokemon.isSemiInvulnerable()) {
				if ((pokemon.hasType('Steel') && !pokemon.hasType('Grass')) || (pokemon.hasType('Ghost') && !pokemon.hasType('Grass'))) { this.debug('Steel and Ghost type don\'t receive Grassy Terrain healing'); } 
				else if (pokemon.hasType('Ground') && !pokemon.hasType('Grass')) {
					this.damage(pokemon.baseMaxhp / 16, pokemon, pokemon);
					this.debug('Ground type takes damage from Grassy Terrain');
				} else { this.heal(pokemon.baseMaxhp / 16, pokemon, pokemon); }
			} else { this.debug(`Pokemon semi-invuln or not grounded; Grassy Terrain skipped`); }
		},
		onFieldResidualOrder: 27,
		onFieldResidualSubOrder: 7,
		onFieldEnd() { this.add('-fieldend', 'move: Grassy Terrain'); },
	},
	mistyterrain: {
		name: "Misty Terrain",
		effectType: "Terrain",
		duration: 4,
		durationCallback(source, effect) {
			if (source?.hasItem('terrainextender')) { return 11; }
			return 4;
		},
		onImmunity(type, pokemon) {
			if (pokemon.hasType('Ghost')) {
				// Remove Ghost type-based immunities
				if (type !== 'mistyterrainreveal' && type !== 'Status') {
					this.add('-message', `${pokemon.name}'s form was revealed by the mist particles!`);
					return false;
				}
			}
		},
		onSetStatus(status, target, source, effect) {
			const blockedStatuses = ['brn', 'dragonblight', 'psn', 'tox'];
			if (blockedStatuses.includes(status.id)) {
				this.add('-activate', target, 'move: Misty Terrain');
				return false;
			}
		},
		onTryAddVolatile(status, target, source, effect) {
			if (status.id === 'confusion') {
				if (effect.effectType === 'Move' && !effect.secondaries) this.add('-activate', target, 'move: Misty Terrain');
				return null;
			}
		},
		onBasePowerPriority: 6,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Dragon' || move.type === 'Dark' || (move.flags && move.flags.shadow)) {
				this.debug('misty terrain weaken');
				return this.chainModify(0.5);
			}
			if ((move.flags && (move.flags.aura || move.flags.breath || move.flags.lunar || move.flags.magic))) {
				this.debug('misty terrain boost for aura/breath/lunar/magic moves');
				return this.chainModify(1.2);
			}
			if (move.flags && (move.flags.wind || move.flags.breath)) {
				move.flags.magic = true;
				this.debug('misty terrain: wind/breath move gains magic flag');
			}
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') { this.add('-fieldstart', 'move: Misty Terrain', '[from] ability: ' + effect.name, `[of] ${source}`); } 
			else { this.add('-fieldstart', 'move: Misty Terrain'); }
		},
		onFieldResidualOrder: 27,
		onFieldResidualSubOrder: 7,
		onFieldEnd() { this.add('-fieldend', 'Misty Terrain'); },
	},
	psychicterrain: {
		name: "Psychic Terrain",
		effectType: "Terrain",
		duration: 4,
		durationCallback(source, effect) {
			if (source?.hasItem('terrainextender')) { return 11; }
			return 4;
		},
		// New property: boostedpsyparticle
		boostedpsyparticle: false,
        setBoostedPsyParticle() {
            if (!this.boostedpsyparticle) {
                this.boostedpsyparticle = true;
                this.add('-message', 'The psychic particles intensify, they now last long enough to reach airborne Pokémon!');
            }
        },
		// To trigger boostedpsyparticle, set this property to true from an effect or event
		onTryHitPriority: 4,
		onTryHit(target, source, effect) {
			if (effect && (effect.priority <= 0.1 || effect.target === 'self')) { return; }
			if (target.isSemiInvulnerable() || target.isAlly(source)) return;
			// If boostedpsyparticle is true, fliers are affected as if grounded
			const isAffected = this.boostedpsyparticle ? true : target.isGrounded();
			if (!isAffected) {
				const baseMove = this.dex.moves.get(effect.id);
				if (baseMove.priority > 0) { this.hint("Psychic Terrain doesn't affect Pokémon immune to Ground."); }
				return;
			}
			// Only block priority moves if the attacker is NOT Normal type
			const baseMove = this.dex.moves.get(effect.id);
			if (baseMove.priority > 0 && source && source.hasType && source.hasType('Normal')) { return; }
			this.add('-activate', target, 'move: Psychic Terrain');
				return null;
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				// If boostedpsyparticle is true, fliers are affected as if grounded
				const isAffected = this.boostedpsyparticle ? true : attacker.isGrounded();
				if (move.type === 'Psychic' && isAffected && !attacker.isSemiInvulnerable()) {
					this.debug('psychic terrain boost');
					return this.chainModify([5325, 4096]);
				}
				if (move.flags && move.flags.pulse && isAffected && !attacker.isSemiInvulnerable()) {
					this.debug('psychic terrain pulse boost');
					return this.chainModify(1.3);
				}
			},
			onFieldStart(field, source, effect) {
				if (effect?.effectType === 'Ability') { this.add('-fieldstart', 'move: Psychic Terrain', '[from] ability: ' + effect.name, `[of] ${source}`); } 
				else { this.add('-fieldstart', 'move: Psychic Terrain'); }
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'move: Psychic Terrain');
				// Reset boostedpsyparticle when terrain ends
				this.boostedpsyparticle = false;
			},
	},
	toxicterrain: {
		name: "Toxic Terrain",
		effectType: "Terrain",
		duration: 4,
		durationCallback(source, effect) {
			if (source?.hasItem('terrainextender')) { return 11; }
			return 4;
		},
		// This should be applied directly to the stat before any of the other modifiers are chained
		// So we give it increased priority.
		onModifySpDPriority: 10,
		onModifySpD(spd, pokemon) { if (pokemon.hasType('Steel') && this.field.isTerrain('toxicterrain')) { return this.modify(spd, 0.7); } },
		onModifyWeatherDamage(damage, attacker, defender, move) { if (move.flags && move.flags.wind) { return this.chainModify(1.1); } },
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') { this.add('-fieldstart', 'move: Toxic Terrain', '[from] ability: ' + effect.name, `[of] ${source}`); } 
			else { this.add('-fieldstart', 'move: Toxic Terrain'); }
		},
		onFieldResidualOrder: 27,
		onFieldResidualSubOrder: 8,
		onFieldResidual() {
				for (const pokemon of this.getAllActive()) {
					if (!pokemon.isGrounded() || pokemon.hasType('Poison') || pokemon.hasType('Steel')) continue;
					if (pokemon.hasType('Grass') || pokemon.hasType('Water')) { this.damage(pokemon.baseMaxhp / 8, pokemon, pokemon, this.effect); } 
					else { this.damage(pokemon.baseMaxhp / 16, pokemon, pokemon, this.effect); }
					// Toxic Terrain counter logic
					if (!pokemon.volatiles['toxicterraincounter']) {
						const type1 = pokemon.getTypes()[0];
						const type2 = pokemon.getTypes()[1];
						let effectiveness = 1;
						if (type1) effectiveness *= this.dex.getEffectiveness('Poison', type1);
						if (type2) effectiveness *= this.dex.getEffectiveness('Poison', type2);
						let counter;
						if (effectiveness > 1) counter = 1; // 4x weak
						else if (effectiveness === 1) counter = 2; // 2x weak
						else if (effectiveness === 0) counter = 3; // neutral
						else if (effectiveness === -1) counter = 4; // 2x resist
						else counter = 5; // 4x resist
						pokemon.volatiles['toxicterraincounter'] = {turns: counter};
					} else if (!pokemon.status || pokemon.status !== 'tox') {
						pokemon.volatiles['toxicterraincounter'].turns--;
						if (pokemon.volatiles['toxicterraincounter'].turns <= 0) {
							pokemon.setStatus('tox');
							delete pokemon.volatiles['toxicterraincounter'];
						}
					}
				}
		},
		onFieldEnd() { this.add('-fieldend', 'move: Toxic Terrain'); },
	},
	
	//#region Other Field Effects
	
	gravity: {
		name: "Gravity",
		effectType: "Field",
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasAbility('persistent')) {
				this.add('-activate', source, 'ability: Persistent', '[move] Gravity');
				return 7;
			}
			return 5;
		},
		onFieldStart(target, source) {
			if (source?.hasAbility('persistent')) { this.add('-fieldstart', 'move: Gravity', '[persistent]'); } 
			else { this.add('-fieldstart', 'move: Gravity'); }
			for (const pokemon of this.getAllActive()) {
				let applies = false;
				if (pokemon.removeVolatile('bounce') || pokemon.removeVolatile('fly')) {
					applies = true;
					this.queue.cancelMove(pokemon);
					pokemon.removeVolatile('twoturnmove');
				}
				if (pokemon.volatiles['skydrop']) {
					applies = true;
					this.queue.cancelMove(pokemon);
					if (pokemon.volatiles['skydrop'].source) { this.add('-end', pokemon.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]'); }
					pokemon.removeVolatile('skydrop');
					pokemon.removeVolatile('twoturnmove');
				}
				if (pokemon.volatiles['magnetrise']) {
					applies = true;
					delete pokemon.volatiles['magnetrise'];
				}
				if (pokemon.volatiles['telekinesis']) {
					applies = true;
					delete pokemon.volatiles['telekinesis'];
				}
				if (applies) this.add('-activate', pokemon, 'move: Gravity');
			}
		},
		onBasePower(basePower, attacker, defender, move) {
				// Boost moves with crushing or throwing flags, and Grav Apple
				if ((move.flags && (move.flags.crushing || move.flags.throwing)) || move.id === 'gravapple') {
					this.debug('Gravity boost for crushing/throwing/Grav Apple');
					return this.chainModify(1.5);
				}
			},
		onModifyAccuracy(accuracy) {
				if (typeof accuracy !== 'number') return;
				// Throwing moves get 0.8x accuracy instead of the boost
				const move = this.activeMove;
				if (move && move.flags && move.flags.throwing) { return this.chainModify(0.8); }
				return this.chainModify([6840, 4096]);
		},
		onDisableMove(pokemon) { for (const moveSlot of pokemon.moveSlots) { if (this.dex.moves.get(moveSlot.id).flags['gravity']) { pokemon.disableMove(moveSlot.id); } } },
		// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
		onBeforeMovePriority: 6,
		onBeforeMove(pokemon, target, move) {
				if ((move.flags['gravity'] || move.flags['airborne']) && !move.isZ) {
					this.add('cant', pokemon, 'move: Gravity', move);
					return false;
				}
		},
		onModifyMove(move, pokemon, target) {
				if ((move.flags['gravity'] || move.flags['airborne']) && !move.isZ) {
					this.add('cant', pokemon, 'move: Gravity', move);
					return false;
				}
		},
		onFieldResidualOrder: 27,
		onFieldResidualSubOrder: 2,
		onFieldEnd() { this.add('-fieldend', 'move: Gravity'); },
	},
	rainbow: {
		name: "Rainbow",
		effectType: "Field",
		duration: 4,
		durationCallback(source, effect) {
			if (source?.hasItem('prismscale')) { return 7; }
			return 4;
		},
		onFieldStart(field, source, effect) { this.add('-fieldstart', 'Rainbow'); },
		onFieldResidualOrder: 26,
		onFieldResidualSubOrder: 7,
		onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Stellar') {
					this.debug('Rainbow boost for Stellar-type moves');
					return this.chainModify(1.2);
				}
			},
			onModifyCritRatio(critRatio, pokemon, target, move) { return critRatio + 1; },
		onFieldEnd() { this.add('-fieldend', 'Rainbow'); },
		onModifyMove(move, pokemon) {
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					if (pokemon.hasAbility('serenegrace') && secondary.volatileStatus === 'flinch') continue;
					if (secondary.chance) secondary.chance *= 2;
				}
				if (move.self?.chance) move.self.chance *= 2;
			}
		},
	},
	seaoffire: {
		name: "Sea of Fire",
		effectType: "Field",
		duration: 4,
		onFieldStart(field, source, effect) { this.add('-fieldstart', 'SeaofFire'); },
		onFieldResidual() {
				for (const pokemon of this.getAllActive()) {
					if (pokemon.hasType('Fire')) continue;
					// Calculate Fire-type effectiveness
					const type1 = pokemon.getTypes()[0];
					const type2 = pokemon.getTypes()[1];
					let effectiveness = 1;
					if (type1) effectiveness *= this.dex.getEffectiveness('Fire', type1);
					if (type2) effectiveness *= this.dex.getEffectiveness('Fire', type2);
					let divisor;
					if (effectiveness > 1) divisor = 6; // 4x weak
					else if (effectiveness === 1) divisor = 10; // 2x weak
					else if (effectiveness === 0) divisor = 16; // neutral
					else if (effectiveness === -1) divisor = 24; // 2x resist
					else divisor = 32; // 4x resist
					this.damage(pokemon.baseMaxhp / divisor, pokemon);
				}
		},
		onFieldResidualOrder: 26,
		onFieldResidualSubOrder: 8,
		onFieldEnd() { this.add('-fieldend', 'SeaofFire'); },
	},
	swamp: {
		name: "Swamp",
		effectType: "Field",
		duration: 4,
		onFieldStart(field, source, effect) { this.add('-fieldstart', 'Swamp'); },
		onFieldResidualOrder: 26,
		onFieldResidualSubOrder: 9,
		onFieldEnd() { this.add('-fieldend', 'Swamp'); },
		onModifySpe(spe, pokemon) {
			  if (!pokemon.isGrounded()) return spe;
			  if (pokemon.hasType('Bug') || pokemon.hasType('Grass') || pokemon.hasType('Ground') || pokemon.hasType('Water')) return spe;
			  return this.chainModify(0.25);
		},
	},
	timebreak: {
			name: "Timebreak",
			effectType: "Field",
			onFieldStart(field, source, effect) {
				this.add('-fieldstart', 'Timebreak');
				this.effectState.caller = effect;
				for (const key in this.field.pseudoWeather) {
					if (key !== 'timebreak' && this.field.pseudoWeather[key]?.duration) {
						this.field.pseudoWeather[key].pausedDuration = this.field.pseudoWeather[key].duration;
						delete this.field.pseudoWeather[key].duration;
					}
				}
			},
			onFieldEnd() {
				this.add('-fieldend', 'Timebreak');
				// Resume all other effect timers
				for (const key in this.field.pseudoWeather) {
					if (key !== 'timebreak' && this.field.pseudoWeather[key]?.pausedDuration) {
						this.field.pseudoWeather[key].duration = this.field.pseudoWeather[key].pausedDuration;
						delete this.field.pseudoWeather[key].pausedDuration;
					}
				}
			},
			// Remove Timebreak when the calling effect leaves the field
			onResidual() {
				// Pause residual effect if timebreak is active
				if (this.field.getPseudoWeather('timebreak')) return;
				if (this.effectState.caller && !this.field.pseudoWeather[this.effectState.caller.id]) { this.field.removePseudoWeather('timebreak'); }
			},
		},

	//#region Transformations
	
	// Commander needs two conditions so they are implemented here
	// Dondozo
	commanded: {
		name: "Commanded",
		noCopy: true,
		onStart(pokemon) { this.boost({ atk: 2, spa: 2, spe: 2, def: 2, spd: 2 }, pokemon); },
		onDragOutPriority: 2,
		onDragOut() { return false; },
		// Prevents Shed Shell allowing a swap
		onTrapPokemonPriority: -11,
		onTrapPokemon(pokemon) { pokemon.trapped = true; },
	},
	// Tatsugiri
	commanding: {
		name: "Commanding",
		noCopy: true,
		onDragOutPriority: 2,
		onDragOut() { return false; },
		// Prevents Shed Shell allowing a swap
		onTrapPokemonPriority: -11,
		onTrapPokemon(pokemon) { pokemon.trapped = true; },
		// Dodging moves is handled in BattleActions#hitStepInvulnerabilityEvent
		// This is here for moves that manually call this event like Perish Song
		onInvulnerability: false,
		onBeforeTurn(pokemon) { this.queue.cancelAction(pokemon); },
	},

	// Arceus and Silvally's actual typing is implemented here.
	// Their true typing for all their formes is Normal, and it's only
	// Multitype and RKS System, respectively, that changes their type,
	// but their formes are specified to be their corresponding type
	// in the Pokedex, so that needs to be overridden.
	// This is mainly relevant for Hackmons Cup and Balanced Hackmons.
	arceus: {
		name: 'Arceus',
		onTypePriority: 1,
		onType(types, pokemon) {
			if (pokemon.transformed || pokemon.ability !== 'multitype' && this.gen >= 8) return types;
			let type: string | undefined = 'Normal';
			if (pokemon.ability === 'multitype') {
				type = pokemon.getItem().onPlate;
				if (!type) { type = 'Normal'; }
			}
			return [type];
		},
	},
	silvally: {
		name: 'Silvally',
		onTypePriority: 1,
		onType(types, pokemon) {
			if (pokemon.transformed || pokemon.ability !== 'rkssystem' && this.gen >= 8) return types;
			let type: string | undefined = 'Normal';
			if (pokemon.ability === 'rkssystem') {
				type = pokemon.getItem().onMemory;
				if (!type) { type = 'Normal'; }
			}
			return [type];
		},
	},
	rolloutstorage: {
		name: 'rolloutstorage',
		duration: 2,
		onBasePower(relayVar, source, target, move) {
			let bp = Math.max(1, move.basePower);
			bp *= 2 ** source.volatiles['rolloutstorage'].contactHitCount;
			if (source.volatiles['defensecurl']) { bp *= 2; }
			source.removeVolatile('rolloutstorage');
			return bp;
		},
	},
	slip: {
		name: 'slip',
		effectType: 'Volatile',
		duration: 1,
		onStart(pokemon) {
			this.add('-message', `${pokemon.name} slipped on the bubbles!`);
			this.effectState.totalDamage = 0;
		},
		onBeforeMovePriority: 8,
		onBeforeMove(pokemon) {
			this.add('cant', pokemon, 'slip');
			return false;
		},
		onAfterDamage(damage, target, source, effect) {
			// Track damage dealt by the slipping pokemon
			if (source && source === this.effectState.target && effect?.effectType === 'Move') {
				this.effectState.totalDamage += damage;
			}
		},
		onAfterMoveSecondary(target, source, move) {
			// Apply 1/8 of total damage dealt as recoil
			if (this.effectState.totalDamage > 0) {
				const recoil = Math.max(1, Math.floor(this.effectState.totalDamage / 8));
				this.damage(recoil, pokemon, pokemon, 'slip');
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move && move.id !== 'slip') {
				return this.chainModify(2);
			}
		},
	},
};
export const electricterrainairborne: ModdedConditionData = {
	name: 'electricterrainairborne',
	effectType: 'Volatile',
	onImmunity(type, pokemon) {
		// Steel types are airborne for all grounded effects except Electric Terrain effects
		const ignoreEffects = ['gravity', 'ingrain', 'smackdown', 'ironball', 'gastroacid', 'terrain'];
		if (ignoreEffects.includes(type) && type !== 'terrain') { return false; }
	},
};
export const Lagging: ModdedConditionData = {
    name: 'lagging',
    effectType: 'Volatile',
    onStart(target) { this.add('-start', target, 'lagging'); },
    onFractionalPriority(priority, pokemon) { return (typeof priority === 'number' ? priority : 0) - 0.1; },
    onEnd(target) { this.add('-end', target, 'lagging'); },
	onEndOfTurn(pokemon) { pokemon.removeVolatile('lagging'); },
};
export const Pepped: ModdedConditionData = {
    name: 'pepped',
    effectType: 'Volatile',
    onStart(target) { this.add('-start', target, 'pepped'); },
    onFractionalPriority(priority, pokemon) { return (typeof priority === 'number' ? priority : 0) + 0.1; },
    onEnd(target) { this.add('-end', target, 'pepped'); },
    onEndOfTurn(pokemon) { pokemon.removeVolatile('pepped'); },
};
export const Windburst: ModdedConditionData = {
    name: 'windburst',
    effectType: 'Volatile',
    duration: 1,
    onStart(pokemon) {
        const ability = pokemon.getAbility();
        if (ability.id === 'windrider') { this.boost({atk: 1}, pokemon, pokemon); } 
		else if (ability.id === 'windpower') { pokemon.addVolatile('charge'); }
    },
    onEnd(pokemon) { pokemon.removeVolatile('windburst'); },
};
export const nightdazelock: ModdedConditionData = {
		name: 'Night Daze Lock',
		duration: 2,
		effectType: 'Volatile',
		onStart(target) { this.add('-start', target, 'Night Daze Lock'); },
		onEnd(target) { this.add('-end', target, 'Night Daze Lock'); },
		onTryMove(pokemon, target, move) {
			if (move.flags && (move.flags.light || move.flags.solar)) {
				this.add('cant', pokemon, 'move: ' + move.name, '[Night Daze Lock]');
				return false;
			}
		},
	};
export const discombobulated: ModdedConditionData = {
	name: 'Discombobulated',
	duration: 2,
	effectType: 'Volatile',
	onStart(target) {
		this.add('-start', target, 'Discombobulated');
		this.add('-message', `${target.name} was launched into the air and is now discombobulated!`);
	},
	onEnd(target) {
		this.add('-end', target, 'Discombobulated');
	},
	onModifyAccuracy(accuracy, target, source, move) {
		// Target cannot dodge moves (moves always have perfect accuracy against them)
		if (typeof accuracy !== 'number') return;
		return true; // Always hit
	},
	onBeforeMovePriority: 10,
	onBeforeMove(pokemon, target, move) {
		// Prevent using Ground-type moves
		if (move.type === 'Ground') {
			this.add('cant', pokemon, 'Discombobulated', move);
			this.add('-message', `${pokemon.name} can't use Ground-type moves while airborne!`);
			return false;
		}
	},
	// Target is treated as airborne (like being under Magnet Rise or having Levitate)
	// This is handled in battle.engine.js:BattlePokemon#isGrounded
};
export const roundhousekick: ModdedConditionData = {
	name: 'Roundhouse Kick',
	duration: 1,
	effectType: 'Volatile',
	onStart(target) {
		this.add('-singleturn', target, 'Roundhouse Kick');
		this.add('-message', `${target.name} is focusing to counter incoming attacks!`);
	},
	onSourceModifyDamage(damage, source, target, move) {
		if (move.category !== 'Status') {
			this.add('-activate', target, 'Roundhouse Kick');
			return this.chainModify(0.125);
		}
	},
	onAfterMoveSecondary(target, source, move) {
		if (!source || source === target || !source.hp || !target.hp) return;
		if (move.category !== 'Status') {
			this.add('-message', `${target.name} counters with a kick!`);
			this.actions.useMove('roundhousekickcounter', target, source);
		}
	},
};
export const stellaroriginal: ModdedConditionData = {
	name: 'stellaroriginal',
	effectType: 'Volatile',
	noCopy: true,
	// Stores the original types before Stellar Terastallization for STAB calculation
};
