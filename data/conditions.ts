export const Conditions: import('../sim/dex-conditions').ConditionDataTable = {
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
			this.effectState.oldAbility2 = target.getAbility(2).id;
			// Use the Aura status as the sourceEffect so it always logs |-ability| ... [slot]2
			// and pass the real source (if any) for nicer "[of]" attribution.
			target.setAbility(auraAbility, source ?? null, this.effect, false, false, 2);
			if (auraName !== 'Aura') {
				this.add('-status', target, 'aura', `[time]${this.effectState.time}`);
				this.add('-message', `${target.name}'s aura ${auraName} has engulfed their surroundings!`);
			} else { this.add('-status', target, 'aura', `[time]${this.effectState.time}`); }
		},
		onSwitchIn(target) {
			if (this.effectState.auraAbility) {
				// Non-null sourceEffect so client receives |-ability|... [slot]2 on switch-in too
				target.setAbility(this.effectState.auraAbility, null, this.effect, false, false, 2);
				this.add('-status', target, 'aura', `[time]${this.effectState.time}`, '[silent]');
			}
		},
		onResidualOrder: 9,
		onResidual(pokemon) {
			if (this.effectState.time) {
				this.effectState.time--;
				if (this.effectState.time <= 0) { pokemon.cureStatus();} 
				else { this.add('-status', pokemon, 'aura', `[time]${this.effectState.time}`, '[silent]'); } // update client-side timer display without re-announcing aura
			}
		},
		onEnd(target) {
			if (this.effectState.auraAbility) {
				const old = this.effectState.oldAbility2;
				if (old && old !== 'noability') {
					// Non-null sourceEffect so client receives restoration as |-ability|... [slot]2
					target.setAbility(old, null, this.effect, false, false, 2);
				}
				else { target.clearAbility(2); }
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
		onStart(target, source, sourceEffect) { // Cure burn before applying bubbleblight
			if (target.status === 'brn') {
				target.cureStatus();
				this.add('-curestatus', target, 'brn', '[from] bubbleblight');
				this.add('-message', `The bubbles soothed ${target.name}'s burn!`);
			}
			// Clear stat boosts
			target.clearBoosts();
			this.add('-clearboost', target);
			this.add('-status', target, 'bubbleblight');
			this.add('-message', `${target.name} is covered in bubbles!`);
		},
		onModifyAccuracyPriority: -1,
		onModifyAccuracy(accuracy) { 
			if (typeof accuracy !== 'number') return;
			else { return this.chainModify(1.25); }
		},
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
		}, // Damage reduction is handled directly in the sim/battle.js damage function
		onResidualOrder: 10,
		onResidual(pokemon) {
			if (pokemon.hasType('Water')) { this.damage(pokemon.baseMaxhp / 24); } 
			else if (pokemon.hasType('Ice')) { this.damage(pokemon.baseMaxhp / 8); } 
			else { this.damage(pokemon.baseMaxhp / 12); }
		},
	},
	dragonblight: {
		name: 'dragonblight',
		effectType: 'Status',
		onStart(target) { this.add('-status', target, 'dragonblight'); },
		onResidualOrder: 10,
		onResidual(pokemon) {
			if (pokemon.hasType('Dragon') || pokemon.hasType('Fairy')) return;
			this.damage(pokemon.baseMaxhp / 10);
		}, 
		onBeforeMove(pokemon, target, move) { 
			if (move && move.type === 'Dragon') {
				this.damage(pokemon.baseMaxhp / 10, pokemon, pokemon, this.effect);
				if (!pokemon.volatiles['confusion']) { pokemon.addVolatile('confusion'); }
			}
		},
		onModifyCritRatio(critRatio, pokemon) { 
			if (pokemon.volatiles['dragonblight']) { return Math.floor(critRatio / 2); }
			return critRatio;
		},
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.volatiles['dragonblight']) {
				const types = ['Electric', 'Fairy', 'Fire', 'Grass', 'Ice', 'Water'];
				if (types.includes(move.type)) { return this.chainModify(0.5); }
			}
		},
		onEnd(target) { this.add('-end', target, 'dragonblight'); },
	},
	fear: {
		name: 'fear',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') { this.add('-status', target, 'fear', '[from] ability: ' + sourceEffect.name, `[of] ${source}`); } 
			else { this.add('-status', target, 'fear'); } // Initialize fear counter based on type
			if (target.hasType('Dark') || target.hasType('Fighting')) { this.effectState.fearStacks = 0; } 
			else if (target.hasType('Normal') || target.hasType('Psychic')) { this.effectState.fearStacks = 4; }
			else { this.effectState.fearStacks = 2; }
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
		onSourceModifyDamage(damage, source, target, move) { if (move && (move.type === 'Dark' || move.type === 'Shadow')) { return this.chainModify(2); } },
	},
	frz: {
		name: 'frz',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') { this.add('-status', target, 'frz', '[from] ability: ' + sourceEffect.name, `[of] ${source}`); } 
			else { this.add('-status', target, 'frz'); }
			if (target.species.name === 'Shaymin-Sky' && target.baseSpecies.baseSpecies === 'Shaymin') { target.formeChange('Shaymin', this.effect, true); }
            // Initialize freeze turn counter
            if (!target.volatiles['frzturns']) { target.volatiles['frzturns'] = { turns: 1 }; }
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
			this.effectState.startTime = this.random(1, 4);
			this.effectState.time = this.effectState.startTime;
		},
        onModifySpA(spa, pokemon) { return Math.floor(spa * (2/3)); },
		onModifyPriority(priority, pokemon, move) { return (typeof priority === 'number' ? priority : 0) - 0.1; },
		onResidualOrder: 9.5,
		onResidual(pokemon) {
			this.add('-message', `${pokemon.name} is suffering from frostbite.`);
			this.effectState.time--;
			if (this.effectState.time <= 0) {
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
			if ((move.type === 'Fire' && move.id !== 'polarflare') || move.thawsTarget) { target.cureStatus(); }
            if (move && move.status === 'brn' && target.status === 'frostbite') {
                target.cureStatus(); 
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
			if (this.randomChance(1, 6)) { // Steadfast: boost Speed instead of being immobilized
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
			if (pokemon.battle.field.getPseudoWeather('timebreak')) {
				this.add('cant', pokemon, 'slp');
				return false;
			}
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
		onResidual(pokemon) { this.heal(pokemon.baseMaxhp / 8); },
		onDamagingHit(damage, target, source, move) { if (move && move.type === 'Electric' && target.status === 'slp') { target.cureStatus(); } },
	},
	drowsy: {
		name: 'drowsy',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			this.add('-status', target, 'drowsy');
			let duration = this.random(1, 4);
			// Halve drowsy duration for Electric and Flying types
			if (target.hasType('Electric') || target.hasType('Flying')) { duration = Math.ceil(duration / 2); }
			this.effectState.startTime = duration;
			this.effectState.time = this.effectState.startTime;
		},
		onModifyPriority(priority, pokemon, move) { return (typeof priority === 'number' ? priority : 0) - 2; },
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
		onResidual(pokemon) { this.damage(pokemon.baseMaxhp / 8); },
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
			if (this.effectState.stage < 15) { this.effectState.stage++; }
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
	charge: {
		name: 'charge',
		onStart(pokemon, source, effect) { 
			if (effect && ['Electromorphosis', 'Wind Power'].includes(effect.name)) { this.add('-start', pokemon, 'Charge', this.activeMove!.name, '[from] ability: ' + effect.name); } 
			else { this.add('-start', pokemon, 'Charge'); }
		},
		onRestart(pokemon, source, effect) {
			if (effect && ['Electromorphosis', 'Wind Power'].includes(effect.name)) { this.add('-start', pokemon, 'Charge', this.activeMove!.name, '[from] ability: ' + effect.name); } 
			else { this.add('-start', pokemon, 'Charge'); }
		},
		onBasePowerPriority: 9,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Electric') {
				this.debug('charge boost');
				return this.chainModify(2);
			}
		},
		onMoveAborted(pokemon, target, move) { if (move.type === 'Electric' && move.id !== 'chargebeam' && move.id !== 'charge') { pokemon.removeVolatile('charge'); } },
		onAfterMove(pokemon, target, move) { if (move.type === 'Electric' && move.id !== 'chargebeam' && move.id !== 'charge') { pokemon.removeVolatile('charge'); } },
		onEnd(pokemon) { this.add('-end', pokemon, 'Charge', '[silent]'); },
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
	confusion: {
		name: 'confusion', // this is a volatile status
		onStart(target, source, sourceEffect) {
			if (sourceEffect?.id === 'lockedmove') { this.add('-start', target, 'confusion', '[fatigue]'); } 
			else if (sourceEffect?.effectType === 'Ability') { this.add('-start', target, 'confusion', '[from] ability: ' + sourceEffect.name, `[of] ${source}`); } 
			else { this.add('-start', target, 'confusion'); }
			const min = sourceEffect?.id === 'axekick' ? 3 : 2;
			this.effectState.time = this.random(min, 6);
		},
		onEnd(target) { this.add('-end', target, 'confusion'); },
		onBeforeMovePriority: 3,
		onBeforeMove(pokemon) {
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
	curse: {
        name: 'Curse',
	    onStart(target) { this.add('-start', target, 'curse'); },
	    onResidualOrder: 10,
        onResidual(pokemon) { this.damage(pokemon.baseMaxhp / 5); },
	    onEnd(target) { this.add('-end', target, 'curse'); },
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
		onEnd(target) { this.add('-end', target, 'tripped', '[silent]'); },
	},
	magicdust: { // also changes ghost type contact resist to weakness, implemented in scripts.ts
			name: 'Magic Dust',
			duration: 1,
			onTryAddVolatile(status, target) { if (this.field.getPseudoWeather('silverdust')) { return null; } },
			onStart(target) {
				this.add('-start', target, 'magicdust');
				const terrain = target.battle.field.getTerrain();
				if (this.field.terrain === 'mistyterrain') {
					const misty = target.battle.field.pseudoWeather['mistyterrain'];
					if (misty && typeof misty.duration === 'number') { misty.duration += 2; }
				}
			},
			onImmunity(type, pokemon) { return false; },
		},
	silverdust: {
		name: 'Silver Dust',
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
				const activeMove = { id: this.toID('silverdustexplosion'), effectType: 'Move', type: 'Bug', flags: { explosive: 1 }, isExternal: true  }; 
				this.damage(damage, target, target, activeMove as ActiveMove);
			}
		},
		onTryMovePriority: -1,
		onTryMove(pokemon, target, move) {
			// If an affected pokemon attempts to use a Fire move, trigger explosion
			if (pokemon.side === this.effectState.target && move.type === 'Fire') {
				this.add('-activate', pokemon, 'move: Silver Powder');
				const damage = Math.max(1, Math.floor(pokemon.maxhp / 8));
				const activeMove = { id: this.toID('silverdustexplosion'), effectType: 'Move', type: 'Bug', flags: { explosive: 1 }, isExternal: true  }; 
				this.damage(damage, target, target, activeMove as ActiveMove);
				this.attrLastMove('[still]');
				return false;
			}
		},
		onResidual() { // Reduce Misty Terrain by 2 turns every turn
			const misty = this.field.pseudoWeather['mistyterrain'];
			if (misty && typeof misty.duration === 'number') {
				misty.duration = Math.max(0, misty.duration - 2);
				if (misty.duration <= 0) {
					this.field.removePseudoWeather('mistyterrain');
					this.add('-fieldend', 'terrain: Misty Terrain');
				}
			}
			// Deal 1/8 damage to Dragon, Fairy, and Ghost types
			for (const pokemon of this.effectState.target.active) { if (pokemon && !pokemon.fainted && (pokemon.hasType('Dragon') || pokemon.hasType('Fairy') || pokemon.hasType('Ghost'))) { this.damage(pokemon.maxhp / 8, pokemon); } }
		},
	},
	fairylockfree: {
		name: 'fairylockfree',
		noCopy: true,
		onStart(pokemon) { this.add('-start', pokemon, 'fairylockfree', '[silent]'); },
	},
	migraine: {
		name: 'Migraine',
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
		onTrapPokemon(pokemon) { if (this.effectState.source?.isActive) pokemon.tryTrap(); },
		onResidualOrder: 13,
		onResidual(pokemon) {
			const source = this.effectState.source;
			// G-Max Centiferno and G-Max Sandblast continue even after the user leaves the field
			if (source && (!source.isActive || source.hp <= 0 || !source.activeTurns)) {
				delete pokemon.volatiles['partiallytrapped'];
				this.add('-end', pokemon, this.effectState.sourceEffect, '[partiallytrapped]', '[silent]');
				return;
			}
			this.damage(pokemon.baseMaxhp / this.effectState.boundDivisor);
		},
	},
	groundedbyaffliction: {
		name: 'Grounded (Affliction)',
		onStart(pokemon) { // Apply grounded hazards as if the Pokémon just switched in
			const side = pokemon.side;
			if (side.sideConditions['stickyweb']) {
				if (!pokemon.hasItem('heavydutyboots')) {
					this.add('-activate', pokemon, 'move: Sticky Web');
					this.boost({ spe: -1 }, pokemon, side.foe.active[0], this.dex.getActiveMove('stickyweb'));
				}
			}
			if (side.sideConditions['spikes']) {
				if (!pokemon.hasItem('heavydutyboots') && !pokemon.hasType('Bug')) {
					const layers = side.sideConditions['spikes'].layers;
					const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
					this.damage(damageAmounts[layers] * pokemon.maxhp / 24);
				}
			}
			if (side.sideConditions['toxicspikes']) {
				if (pokemon.hasType('Poison')) {
					this.add('-sideend', side, 'move: Toxic Spikes', `[of] ${pokemon}`);
					side.removeSideCondition('toxicspikes');
				} else if (!pokemon.hasType('Steel') && !pokemon.hasItem('heavydutyboots') && !pokemon.hasType('Bug')) {
					const layers = side.sideConditions['toxicspikes'].layers;
					if (layers >= 2) { pokemon.trySetStatus('tox', side.foe.active[0]); } 
					else { pokemon.trySetStatus('psn', side.foe.active[0]); }
				}
			}
			if (side.sideConditions['caltrops']) {
				if (!pokemon.hasItem('heavydutyboots')) {
					const layers = side.sideConditions['caltrops'].layers || 1;
					const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
					this.damage(damageAmounts[layers] * pokemon.maxhp / 24);
				}
			}
		},
		// Override Ground-type immunity
		onImmunity(type) { if (type === 'Ground') return false; },
	},
	rainboweffect: {
		name: 'rainboweffect',
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
		noCopy: true,
		// Silent volatile used to track grounding state changes. No onStart/onEnd to avoid message spam
	},
	// Volatile condition: LuckEffect (boosts secondary effect chance by 20%)
	luckeffect: {
		name: 'luckeffect',
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
	//#region Move Locking 
	lockedmove: { // Outrage, Thrash, Petal Dance...
		name: 'lockedmove',
		duration: 2,
		onResidual(target) {
			if (target.status === 'slp') { delete target.volatiles['lockedmove']; } // don't lock, and bypass confusion for calming
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
			return this.effectState.move;
		},
	},
	twoturnmove: { // Skull Bash, SolarBeam, Sky Drop...
		name: 'twoturnmove',
		duration: 2,
		onStart(attacker, defender, effect) { // ("attacker" is the Pokemon using the two turn move and the Pokemon this condition is being applied to)
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
			if ( !pokemon.ignoringItem() && move.id !== this.effectState.move && move.id !== 'struggle' ) 
			{ // Fails unless the Choice item is being ignored, and no PP is lost
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
			if (pokemon.ignoringItem()) { return; }
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
	},
	futuremove: { // this is a slot condition
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
			const data = this.effectState; // time's up; time to hit! :D
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
	windswept: {
		name: 'windswept',
		onStart(pokemon) { this.add('-start', pokemon, 'Windswept'); },
		onEnd(pokemon) { this.add('-end', pokemon, 'Windswept'); },
	},
	magnetriseairborne: {
		name: 'Magnet Rise (Airborne)',
		noCopy: true,
		onStart(pokemon) { this.add('-start', pokemon, 'Magnet Rise'); },
		onEnd(pokemon) { this.add('-end', pokemon, 'Magnet Rise'); },
	},
	// #region PP Exhaustion
	defeathered: {
		name: 'Defeathered',
		noCopy: true,
		onStart(target) { this.add('-start', target, 'Defeathered'); },
		onAfterMove(target, source, move) { this.add('-message', `${target.name} was plucked thin! It can't even fly anymore.`); },
		onTypePriority: -1,
		onType(types, pokemon) {
			this.effectState.typeWas = types;
			return types.filter(type => type !== 'Flying');
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
		onModifyDef(def, pokemon) { if (pokemon.hasType('Ice') && this.field.isWeather('hail')) { return this.modify(def, 1.5); } },
		onWeatherModifyDamage(damage, attacker, defender, move) { if (move.flags && move.flags.wind) { return this.chainModify(1.2); } },
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') { this.add('-weather', 'Hail', '[from] ability: ' + effect.name, `[of] ${source}`); } 
			else { this.add('-weather', 'Hail'); }
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
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
		duration: 7,
		durationCallback(source, effect) {
			if (source?.hasItem('icyrock')) { return 11; }
			return 7;
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
			if (effect?.effectType === 'Ability') { this.add('-weather', 'Snowscape', '[from] ability: ' + effect.name, `[of] ${source}`); } 
			else { this.add('-weather', 'Snowscape'); }
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'Snowscape', '[upkeep]');
			if (this.field.isWeather('snowscape')) this.eachEvent('Weather');
		},
		onWeather(target) { if (target.hasType('ice')) { this.heal(target.baseMaxhp / 16); } },
		onFieldEnd() { this.add('-weather', 'none'); },
	},
	eclipse: {
		name: 'Eclipse',
		effectType: 'Weather',
		duration: 0,
		onTryMovePriority: 1,
		onTryMove(attacker, defender, move) {
			if (move.flags && (move.flags.light || move.flags.shadow)) {
				this.debug('eclipse light/shadow suppress');
				this.add('-fail', attacker, move, '[from] Eclipse');
				this.attrLastMove('[still]');
				return null;
			}
		},
		onFieldStart(field, source, effect) {
			this.add('-weather', 'Eclipse', '[from] ability: ' + effect.name, `[of] ${source}`);
			const suppressed = ['illuminate', 'shadowtag', 'shadowshield', 'shadowwalker', 'illuminate'];
			for (const target of this.getAllActive()) {
				if (target.hasItem('abilityshield')) continue;
				const activeSlots = (target as any).getActiveAbilitySlots?.() || [];
				for (const slot of activeSlots) {
					if (!slot.state) continue;
					if (!suppressed.includes(slot.id)) continue;
					if (slot.effect.flags['cantsuppress']) continue;
					this.singleEvent('End', slot.effect, slot.state, target, source, 'eclipse');
				}
			}
		},
		onSwitchIn(pokemon) {
			if (!this.field.isWeather('eclipse')) return;
			const suppressed = ['shadowtag', 'shadowshield', 'shadowwalker', 'illuminate'];
			if (pokemon.hasItem('abilityshield')) return;
			const activeSlots = (pokemon as any).getActiveAbilitySlots?.() || [];
			for (const slot of activeSlots) {
				if (!slot.state) continue;
				if (!suppressed.includes(slot.id)) continue;
				if (slot.effect.flags['cantsuppress']) continue;
				this.singleEvent('End', slot.effect, slot.state, pokemon, null, 'eclipse');
			}
		},
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (move.type === 'Dark' || move.type === 'Fairy') {
				this.debug('eclipse dark/fairy boost');
				return this.chainModify(1.3);
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'Eclipse', '[upkeep]');
			if (this.field.isWeather('eclipse')) this.eachEvent('Weather');
		},
		onUpdate(pokemon) {
			if (!this.field.isWeather('eclipse')) return;
			if (pokemon.hasAbility(['illuminate', 'shadowtag', 'shadowwalker'])) { pokemon.trapped = false; }
		},
		onWeather(target) {
			if (target.hasAbility(['illuminate', 'astralaspect', 'lunaraspect', 'lunamancy', 'nightbloom'])) { this.heal(target.baseMaxhp / 12); } 
			else if (target.hasAbility(['chlorophyll', 'solaraspect', 'solarpower'])) { this.damage(target.baseMaxhp / 12); }
		},
		onFieldEnd() {
			this.add('-weather', 'none');
			const suppressed = ['shadowtag', 'shadowshield', 'shadowwalker', 'illuminate'];
			const sortedActive = this.getAllActive();
			this.speedSort(sortedActive);
			for (const pokemon of sortedActive) {
				if (pokemon.hasItem('abilityshield')) continue;
				const activeSlots = (pokemon as any).getActiveAbilitySlots?.() || [];
				for (const slot of activeSlots) {
					if (!slot.state) continue;
					if (!suppressed.includes(slot.id)) continue;
					if (slot.effect.flags['cantsuppress']) continue;
					this.singleEvent('Start', slot.effect, slot.state, pokemon);
				}
			}
		},
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
			if (effect?.effectType === 'Ability') { this.add('-weather', 'RainDance', '[from] ability: ' + effect.name, `[of] ${source}`); } 
			else { this.add('-weather', 'RainDance'); }
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
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
		// This should be applied directly to the stat before any of the other modifiers are chained so we give it increased priority.
		onModifySpDPriority: 10,
		onModifySpD(spd, pokemon) { if (pokemon.hasType('Rock') && this.field.isWeather('sandstorm')) { return this.modify(spd, 1.5); } },
		onWeatherModifyDamage(damage, attacker, defender, move) { if (move.flags && move.flags.wind) { return this.chainModify(1.1); } },
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') { this.add('-weather', 'Sandstorm', '[from] ability: ' + effect.name, `[of] ${source}`); } 
			else { this.add('-weather', 'Sandstorm'); }
			for (const pokemon of this.getAllActive()) { pokemon.addVolatile('windburst'); }
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
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
		onEffectivenessPriority: 1,
		onEffectiveness(typeMod, target, type, move) {
			if (move?.flags?.slicing && (type === 'Steel' || type === 'Ice')) {
				this.debug('Sunny Day slicing weakness to ' + type);
				return typeMod + 1;
			}
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
		},
		onFieldStart(battle, source, effect) {
			if (effect?.effectType === 'Ability') { this.add('-weather', 'SunnyDay', '[from] ability: ' + effect.name, `[of] ${source}`); } 
			else { this.add('-weather', 'SunnyDay'); }
		},
		onImmunity(type, pokemon) {
			if (pokemon.hasItem('utilityumbrella')) return;
			if (type === 'frz') return false;
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
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
		onEffectivenessPriority: 1,
		onEffectiveness(typeMod, target, type, move) {
			if (move?.flags?.slicing && (type === 'Steel' || type === 'Ice')) {
				this.debug('Desolate Land slicing weakness to ' + type);
				return typeMod + 1;
			}
		},
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === 'Fire') {
				this.debug('Desolate Land fire boost');
				return this.chainModify(1.5);
			}
			if (move.flags && (move.flags.solar || move.flags.lunar)) { return this.chainModify(1.5); }
		},
		onFieldStart(field, source, effect) { this.add('-weather', 'DesolateLand', '[from] ability: ' + effect.name, `[of] ${source}`); },
		onImmunity(type, pokemon) {
			if (pokemon.hasItem('utilityumbrella')) return;
			if (type === 'frz') return false;
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'DesolateLand', '[upkeep]');
			this.eachEvent('Weather');
		},
		onWeather(target) {
			if (target.hasType('Ice') && !target.hasType('Fire')) { this.damage(target.baseMaxhp / 8); }
			if (target.hasType('Steel') && !target.hasType('Fire')) { this.damage(target.baseMaxhp / 16); }
			if (target.hasType('grass')) { this.heal(target.baseMaxhp / 8);}
		},
		onFieldEnd() { this.add('-weather', 'none');},
	},
	turbulentwinds: { //Bug type airborneness implemented in sim/pokemon.js:Pokemon#isGrounded
		name: 'TurbulentWinds',
		effectType: 'Weather',
		duration: 7,
		durationCallback(source, effect) {
			if (source?.hasItem('floatstone')) { return 11; }
			return 7;
		},
		// Prevent Tailwind from being set while active
		onSideCondition(condition, target, source, effect) {
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
        onImmunity(type, pokemon) {
            const groundingEffects = ['gravity', 'ingrain', 'smackdown', 'ironball', 'gastroacid', 'terrain'];
            if (pokemon.hasType('Flying') && groundingEffects.includes(type)) { return false; }
        },
		onWeatherModifyDamage(damage, attacker, defender, move) { if (move.flags && (move.flags.wind)) { return this.chainModify(1.3); } },
		onFieldStart(field, source, effect) {
			this.add('-weather', 'TurbulentWinds', '[from] ability: ' + effect.name, `[of] ${source}`);
			let dispelled = false;
			for (const side of this.sides) { if (side.removeSideCondition('tailwind')) { dispelled = true; } }
			if (dispelled) { this.add('-message', 'Turbulent Winds rage, dispelling all Tailwinds!'); }
			for (const pokemon of this.getAllActive()) {
				// Trigger Wind Rider and Wind Power when weather starts - check both ability slots
				const ability1 = this.toID((pokemon as any).ability1);
				const ability2 = this.toID((pokemon as any).ability2);
				if (ability1 === 'windrider' || ability2 === 'windrider') {
					this.add('-message', `${pokemon.name}'s Wind Rider is triggered by Turbulent Winds!`);
					if (this.boost({ atk: 1 }, pokemon, pokemon)) { this.add('-activate', pokemon, 'ability: Wind Rider', '[from] Turbulent Winds'); }
				}
				if (ability1 === 'windpower' || ability2 === 'windpower') {
					this.add('-message', `${pokemon.name}'s Wind Power is triggered by Turbulent Winds!`);
					if (!pokemon.volatiles['charge']) {
						pokemon.addVolatile('charge');
						this.add('-activate', pokemon, 'ability: Wind Power', '[from] Turbulent Winds');
					}
				} // Make Bug types airborne with windswept volatile
				if (pokemon.hasType('Bug')) { pokemon.addVolatile('windswept'); }
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'TurbulentWinds', '[upkeep]');
			this.eachEvent('Weather');
			for (const pokemon of this.getAllActive()) {
				// Trigger Wind Rider and Wind Power - check both ability slots
				const ability1 = this.toID((pokemon as any).ability1);
				const ability2 = this.toID((pokemon as any).ability2);
				if (ability1 === 'windrider' || ability2 === 'windrider') {
					this.add('-message', `${pokemon.name}'s Wind Rider is triggered by Turbulent Winds!`);
					if (this.boost({ atk: 1 }, pokemon, pokemon)) { this.add('-activate', pokemon, 'ability: Wind Rider', '[from] Turbulent Winds'); }
				}
				if (ability1 === 'windpower' || ability2 === 'windpower') {
					this.add('-message', `${pokemon.name}'s Wind Power is triggered by Turbulent Winds!`);
					if (!pokemon.volatiles['charge']) {
						pokemon.addVolatile('charge');
						this.add('-activate', pokemon, 'ability: Wind Power', '[from] Turbulent Winds');
					}
				}
				// Check for any Bug types that just switched in
				if (pokemon.hasType('Bug') && !pokemon.volatiles['windswept']) { pokemon.addVolatile('windswept'); }
			}
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
	deltastream: { //Bug type airborneness implemented in sim/pokemon.js:Pokemon#isGrounded
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
		onImmunity(type, pokemon) {
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
				if (effect.id === 'yawn' || (effect.effectType === 'Move' && !effect.secondaries)) { this.add('-activate', target, 'terrain: Electric Terrain'); }
				return false;
			}
		},
		onTryAddVolatile(status, target) {
			if (!target.isGrounded() || target.isSemiInvulnerable()) return;
			if (status.id === 'yawn') {
				this.add('-activate', target, 'terrain: Electric Terrain');
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
			if (effect?.effectType === 'Ability') { this.add('-terrain', 'Electric Terrain', '[from] ability: ' + effect.name, `[of] ${source}`, '[duration] ' + this.field.terrainState.duration); } 
			else { this.add('-terrain', 'Electric Terrain', '[duration] ' + this.field.terrainState.duration); }
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hasType('Steel')) {
					pokemon.addVolatile('electricterrainairborne');
					this.add('-message', `${pokemon.name} is lifted by the magnetic field!`);
				}
			}
		},
		onFieldResidualOrder: 27,
		onFieldResidualSubOrder: 7,
		onFieldResidual() { this.add('-terrain', 'Electric Terrain', '[upkeep]'); },
		onFieldEnd() {
			for (const pokemon of this.getAllActive()) {
				if (pokemon.volatiles['electricterrainairborne']) {
					pokemon.removeVolatile('electricterrainairborne');
					this.add('-message', `${pokemon.name} fell to the ground.`);
				}
			}
			this.add('-terrain', 'none');
		},
	},
	grassyterrain: {
		name: "Grassy Terrain",
		effectType: "Terrain",
		duration: 4,
		durationCallback(source, effect) { 
			if (source?.hasItem('terrainextender')) { return 11; }
			return 4;
		},
		onBasePowerPriority: 6,
		onBasePower(basePower, attacker, defender, move) {
			const weakenedMoves = ['earthquake', 'bulldoze', 'magnitude'];
			if (move.type === 'Ground' && defender.isGrounded() && !defender.isSemiInvulnerable()) { 
				this.debug('ground move weakened by grassy terrain');
				return this.chainModify(0.5);
			}
			if (move.type === 'Grass' && attacker.isGrounded()) { 
				this.debug('grassy terrain boost');
				return this.chainModify([5325, 4096]);
			}
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') { this.add('-terrain', 'Grassy Terrain', '[from] ability: ' + effect.name, `[of] ${source}`, '[duration] ' + this.field.terrainState.duration); } 
			else { this.add('-terrain', 'Grassy Terrain', '[duration] ' + this.field.terrainState.duration); }
		},
		onFieldResidualOrder: 27,
		onFieldResidualSubOrder: 7,
		onFieldResidual() {
			this.add('-terrain', 'Grassy Terrain', '[upkeep]');
			for (const pokemon of this.getAllActive()) {
				if (pokemon.isGrounded() && !pokemon.isSemiInvulnerable()) {
					if ((pokemon.hasType('Steel') && !pokemon.hasType('Grass')) || (pokemon.hasType('Ghost') && !pokemon.hasType('Grass'))) { this.debug('Steel and Ghost type don\'t receive Grassy Terrain healing'); } 
					else if (pokemon.hasType('Ground') && !pokemon.hasType('Grass')) {
						this.damage(pokemon.baseMaxhp / 16, pokemon, pokemon);
						this.debug('Ground type takes damage from Grassy Terrain');
					} 
					else { this.heal(pokemon.baseMaxhp / 16, pokemon, pokemon); }
				} 
				else { this.debug(`Pokemon semi-invuln or not grounded; Grassy Terrain skipped`); }
			}
		},
		onFieldEnd() { this.add('-terrain', 'none'); },
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
				this.add('-activate', target, 'terrain: Misty Terrain');
				return false;
			}
		},
		onTryAddVolatile(status, target, source, effect) {
			if (status.id === 'confusion') {
				if (effect.effectType === 'Move' && !effect.secondaries) this.add('-activate', target, 'terrain: Misty Terrain');
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
				move.flags.magic = 1;
				this.debug('misty terrain: wind/breath move gains magic flag');
			}
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') { this.add('-terrain', 'Misty Terrain', '[from] ability: ' + effect.name, `[of] ${source}`, '[duration] ' + this.field.terrainState.duration); } 
			else { this.add('-terrain', 'Misty Terrain', '[duration] ' + this.field.terrainState.duration); }
		},
		onFieldResidualOrder: 27,
		onFieldResidualSubOrder: 7,
		onFieldResidual() { this.add('-terrain', 'Misty Terrain', '[upkeep]'); },
		onFieldEnd() { this.add('-terrain', 'none'); },
	},
	psychicterrain: {
		name: "Psychic Terrain",
		effectType: "Terrain",
		duration: 4,
		durationCallback(source, effect) {
			if (source?.hasItem('terrainextender')) { return 11; }
			return 4;
		},
		boostedpsyparticle: false,
        setBoostedPsyParticle() {
            if (!this.boostedpsyparticle) {
                this.boostedpsyparticle = true;
                this.add('-message', 'The psychic particles intensify, they now last long enough to reach airborne Pokémon!');
            }
        },
		onTryHitPriority: 4,
		onTryHit(target, source, effect) {
			if (effect && (effect.priority <= 0.1 || effect.target === 'self')) { return; }
			if (target.isSemiInvulnerable() || target.isAlly(source)) return;
			const isAffected = this.boostedpsyparticle ? true : target.isGrounded();
			if (!isAffected) {
				const baseMove = this.dex.moves.get(effect.id);
				if (baseMove.priority > 0) { this.hint("Psychic Terrain doesn't affect Pokémon immune to Ground."); }
				return;
			}
			// Only block priority moves if the attacker is NOT Normal type
			const baseMove = this.dex.moves.get(effect.id);
			if (baseMove.priority > 0 && source && source.hasType && source.hasType('Normal')) { return; }
			this.add('-activate', target, 'terrain: Psychic Terrain');
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
			if (effect?.effectType === 'Ability') { this.add('-terrain', 'Psychic Terrain', '[from] ability: ' + effect.name, `[of] ${source}`, '[duration] ' + this.field.terrainState.duration); } 
			else { this.add('-terrain', 'Psychic Terrain', '[duration] ' + this.field.terrainState.duration); }
		},
		onFieldResidualOrder: 27,
		onFieldResidualSubOrder: 7,
		onFieldResidual() { this.add('-terrain', 'Psychic Terrain', '[upkeep]'); },
		onFieldEnd() {
			this.add('-terrain', 'none');
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
		onModifySpDPriority: 10,
		onModifySpD(spd, pokemon) { if (pokemon.hasType('Steel')) { return this.modify(spd, 0.7); } },
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') { this.add('-terrain', 'Toxic Terrain', '[from] ability: ' + effect.name, `[of] ${source}`, '[duration] ' + this.field.terrainState.duration); } 
			else { this.add('-terrain', 'Toxic Terrain', '[duration] ' + this.field.terrainState.duration); }
			for (const pokemon of this.getAllActive()) { if ((pokemon as any).toxicTerrainCounter === undefined) { (pokemon as any).toxicTerrainCounter = 0; } }
		},
		onSwitchIn(pokemon) { if ((pokemon as any).toxicTerrainCounter === undefined) { (pokemon as any).toxicTerrainCounter = 0; } },
		onFieldResidualOrder: 27,
		onFieldResidualSubOrder: 7,
		onFieldResidual() {
			this.add('-terrain', 'Toxic Terrain', '[upkeep]');
			for (const pokemon of this.getAllActive()) {
				if (!pokemon.isGrounded() || pokemon.isSemiInvulnerable()) continue;
				if (pokemon.hasType('Poison') || pokemon.hasType('Steel')) continue;
				if (pokemon.hasType('Grass') || pokemon.hasType('Water')) { this.damage(pokemon.baseMaxhp / 8, pokemon); } 
				else { this.damage(pokemon.baseMaxhp / 16, pokemon); }
				if (pokemon.status) continue;
				const typeMod = this.dex.getEffectiveness('Poison', pokemon);
				let threshold = 3;
				switch (typeMod) {
					case 2: // 4x weak
						threshold = 1;
						break;
					case 1: // 2x weak
						threshold = 2;
						break;
					case 0: // neutral
						threshold = 3;
						break;
					case -1: // resisted
						threshold = 4;
						break;
					default: // -2 (4x resisted)
						threshold = 5;
						break;
				}
				(pokemon as any).toxicTerrainCounter++;
				if ((pokemon as any).toxicTerrainCounter >= threshold) { if (pokemon.trySetStatus('tox')) { (pokemon as any).toxicTerrainCounter = 0; } }
			}
		},
		onFieldEnd() { this.add('-terrain', 'none'); },
	},
	//#region Other Field Effects
	gravity: {
		name: "Gravity",
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
		onBasePower(basePower, attacker, defender, move) { // Boost moves with crushing or throwing flags, and Grav Apple
			if ((move.flags && (move.flags.crush || move.flags.throw)) || move.id === 'gravapple') {
				this.debug('Gravity boost for crushing/throwing/Grav Apple');
				return this.chainModify(1.5);
			}
		},
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			// Throwing moves get 0.8x accuracy instead of the boost
			const move = this.activeMove;
			if (move && move.flags && move.flags.throw) { return this.chainModify(0.8); }
			return this.chainModify([6840, 4096]);
		},
		onDisableMove(pokemon) { for (const moveSlot of pokemon.moveSlots) { if (this.dex.moves.get(moveSlot.id).flags['gravity']) { pokemon.disableMove(moveSlot.id); } } },
		// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
		onBeforeMovePriority: 6,
		onBeforeMove(pokemon, target, move) {
			if (move.flags['gravity']) {
				this.add('cant', pokemon, 'move: Gravity', move);
				return false;
			}
		},
		onModifyMove(move, pokemon, target) {
			if (move.flags['gravity']) {
				this.add('cant', pokemon, 'move: Gravity', move);
				return false;
			}
		},
		onFieldResidualOrder: 27,
		onFieldResidualSubOrder: 2,
		onFieldEnd() { this.add('-fieldend', 'move: Gravity'); },
	},
	inverseroom: {
		duration: 5,
		durationCallback(source, effect) { return 5; },
		onEffectiveness(typeMod, target, type, move) { return -typeMod; },
		onNegateImmunity() { return false; },
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') { this.add('-fieldstart', 'move: Inverse Room', '[from] ability: ' + effect.name, `[of] ${source}`); } 
			else { this.add('-fieldstart', 'move: Inverse Room'); }
		},
		onFieldRestart(target, source) { this.field.removePseudoWeather('inverseroom'); },
		onFieldResidualOrder: 27,
		onFieldResidualSubOrder: 6,
		onFieldEnd() { this.add('-fieldend', 'move: Inverse Room'); },
	},
	magnetrise: {
		name: "Magnet Rise",
		duration: 4,
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') { this.add('-fieldstart', 'move: Magnet Rise', '[from] ability: Magnet Rise'); }
			else { this.add('-fieldstart', 'move: Magnet Rise'); }
			for (const pokemon of this.getAllActive()) { if (pokemon.hasType('Steel') || pokemon.hasAbility(['magnetrise', 'magneticpulse', 'magnetpull', 'minus', 'plus'])) { pokemon.addVolatile('magnetriseairborne'); } }
		},
		onImmunity(type, pokemon) { if (type === 'Ground' && (pokemon.hasType('Steel') ||  pokemon.hasAbility(['magnetrise', 'magneticpulse', 'magnetpull', 'minus', 'plus']))) { return false; } },
		onFieldResidualOrder: 27,
		onFieldResidualSubOrder: 7,
		onFieldEnd() { 
			this.add('-fieldend', 'move: Magnet Rise');
			for (const pokemon of this.getAllActive()) { if (pokemon.volatiles['magnetriseairborne']) { pokemon.removeVolatile('magnetriseairborne'); } }
		},
	},
	rainbow: {
		name: "Rainbow",
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
		duration: 4,
		durationCallback(source, effect) { 
			if (source?.lastItem === 'occaberry') return 2;
			return 4;
		},
		onFieldStart(field, source, effect) { this.add('-fieldstart', 'Sea of Fire'); },
		onFieldResidualOrder: 26,
		onFieldResidualSubOrder: 8,
		onFieldResidual() {
			for (const pokemon of this.getAllActive()) {
				if (!pokemon?.hp || pokemon.fainted || !pokemon.isGrounded()) continue;
				if (pokemon.hasType('Fire')) continue;
				const types = pokemon.getTypes();
				let typeMod = 0;
				for (const type of types) { typeMod += this.dex.getEffectiveness('Fire', type); }
				let divisor = 16; // neutral by default
				if (typeMod >= 2) divisor = 6; // 4x weak
				else if (typeMod === 1) divisor = 8; // 2x weak
				else if (typeMod === 0) divisor = 12; // neutral
				else if (typeMod === -1) divisor = 16; // resist
				else divisor = 24; // 4x resist or better
				this.damage(pokemon.baseMaxhp / divisor, pokemon);
			}
		},
		onFieldEnd() { this.add('-fieldend', 'Sea of Fire'); },
	},
	swamp: {
		name: "Swamp",
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
		onFieldStart(field, source, effect) {
			this.add('-fieldstart', 'Timebreak');
			this.effectState.caller = effect;
			// Duration pausing for every other residual driven effect is handled in Battle#fieldEvent
		},
		onFieldEnd() { this.add('-fieldend', 'Timebreak'); },
		// Remove Timebreak when the calling effect leaves the field
		onResidual() { // Pause residual effect if timebreak is active
			if (this.field.getPseudoWeather('timebreak')) return;
			if (this.effectState.caller && !this.field.pseudoWeather[this.effectState.caller.id]) { this.field.removePseudoWeather('timebreak'); }
		},
	},
	wildfyre: {
		name: "Wildfyre",
		duration: 4,
		onFieldStart(field, source, effect) { this.add('-fieldstart', 'Wildfyre'); },
		onFieldResidualOrder: 26,
		onFieldResidualSubOrder: 8,
		onFieldResidual() {
			for (const pokemon of this.getAllActive()) {
				if (!pokemon?.hp || pokemon.fainted) continue;
				if (pokemon.hasType('Dragon') || pokemon.hasType('Fairy') || !pokemon.isGrounded()) continue;
				const types = pokemon.getTypes();
				let typeMod = 0;
				for (const type of types) { typeMod += this.dex.getEffectiveness('Dragon', type); }
				let divisor = 16; // neutral by default
				if (typeMod >= 2) divisor = 3;      // 4x weak
				else if (typeMod === 1) divisor = 6; // 2x weak
				else if (typeMod === 0) divisor = 12; // neutral
				else if (typeMod === -1) divisor = 24; // resist
				else divisor =32; // 4x resist or better
				this.damage(pokemon.baseMaxhp / divisor, pokemon);
			}
		},
		onFieldEnd() { this.add('-fieldend', 'Wildfyre'); },
	},
	//#region Transformations
	// Commander needs two conditions so they are implemented here Dondozo
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
	// Their true typing for all their formes is Normal, and it's only Multitype and RKS System, respectively, that changes their type,
	// but their formes are specified to be their corresponding type in the Pokedex, so that needs to be overridden.
	arceus: {
		name: 'Arceus',
		onTypePriority: 1,
		onType(types, pokemon) {
			const ability1 = this.toID((pokemon as any).ability1);
			const ability2 = this.toID((pokemon as any).ability2);
			const hasMultitype = ability1 === 'multitype' || ability2 === 'multitype';
			if (pokemon.transformed || !hasMultitype && this.gen >= 8) return types;
			let type: string | undefined = 'Normal';
			if (hasMultitype) {
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
			const ability1 = this.toID((pokemon as any).ability1);
			const ability2 = this.toID((pokemon as any).ability2);
			const hasRKS = ability1 === 'rkssystem' || ability2 === 'rkssystem';
			if (pokemon.transformed || !hasRKS && this.gen >= 8) return types;
			let type: string | undefined = 'Normal';
			if (hasRKS) {
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
		duration: 1,
		onStart(pokemon) { this.add('-message', `${pokemon.name} slipped on the bubbles!`); },
		onBeforeMovePriority: 8,
		onBeforeMove(pokemon) {
			this.add('cant', pokemon, 'slip');
			return false;
		},
		onAccuracy() { return true; },
		onSourceModifyDamage() { return this.chainModify(2); },
	},
	shapememory: {
  		name: 'Shape Memory',
  		onEnd(pokemon) { // store current scaling vs current form baseline
    		const size = (pokemon.set as any).size || 'M';
    		let tiers = 0;
    		if (size === 'XS') tiers = -2;
    		else if (size === 'S') tiers = -1;
    		else if (size === 'L') tiers = 1;
    		else if (size === 'XL') tiers = 2;
    		const sp = pokemon.species;
    		const wMod = (sp as any).sizeWeightModifier ?? 0.1;
   		 	const hMod = (sp as any).sizeHeightModifier ?? 0.1;
    		const baseWeighthg = Math.max(1, Math.round(sp.weighthg * (1 + (tiers * wMod))));
    		const baseHeightmm = Math.max(10, Math.round((((sp as any).heightm || 0) * 1000) * (1 + (tiers * hMod))));
    		pokemon.shapeMemoryWeightScale = baseWeighthg ? (pokemon.weighthg / baseWeighthg) : 1;
    		pokemon.shapeMemoryHeightScale = baseHeightmm ? (pokemon.heightmm / baseHeightmm) : 1;
 		},
	},
	electricterrainairborne: {
		name: 'electricterrainairborne',
		onImmunity(type, pokemon) { // Steel types are airborne for all grounded effects except Electric Terrain effects
			const ignoreEffects = ['gravity', 'ingrain', 'smackdown', 'ironball', 'gastroacid', 'terrain'];
			if (ignoreEffects.includes(type) && type !== 'terrain') { return false; }
		},
	},
	//region misc
	teraempowered: {
		name: 'Tera Empowered',
		duration: 1,
		onStart(pokemon) { this.add('-start', pokemon, 'teraempowered'); },
		onEnd(pokemon) { this.add('-end', pokemon, 'teraempowered'); },
	},
	discombobulated: {
		name: 'Discombobulated',
		duration: 2,
		onStart(target) {
			this.add('-start', target, 'Discombobulate');
			this.add('-message', `${target.name} was suspended in the air!`);
		},
		onEnd(target) { this.add('-end', target, 'Discombobulate'); },
		onAccuracy(accuracy, target, source, move) { // Target cannot dodge moves (moves always have perfect accuracy against them)
			if (typeof accuracy !== 'number') return;
			return true;
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) { // Prevent using Ground-type moves
			if (move.type === 'Ground') {
				this.add('cant', pokemon, 'Discombobulate', move);
				this.add('-message', `${pokemon.name} can't use Ground-type moves while discombobulated!`);
				return false;
			}
		},
		// Target is treated as airborne (like being under Magnet Rise or having Levitate)
		// This is handled in battle.engine.js:BattlePokemon#isGrounded
	},
	lagging: {
		name: 'lagging',
		onStart(target) { this.add('-start', target, 'lagging'); },
		onFractionalPriority(priority, pokemon) { return (typeof priority === 'number' ? priority : 0) - 0.1; },
		onEnd(target) { this.add('-end', target, 'lagging'); },
		onResidualOrder: 33,
		onResidual(pokemon) { pokemon.removeVolatile('lagging'); },
	},
	pepped: {
		name: 'pepped',
		onStart(target) { this.add('-start', target, 'pepped'); },
		onFractionalPriority(priority, pokemon) { return (typeof priority === 'number' ? priority : 0) + 0.1; },
		onEnd(target) { this.add('-end', target, 'pepped'); },
		onResidualOrder: 33,
		onResidual(pokemon) { pokemon.removeVolatile('pepped'); },
	},
	spent: {
		name: 'spent',
		noCopy: true,
		onStart(pokemon) { this.add('-singlemove', pokemon, 'Spent', '[silent]'); },
		onAccuracy() { return true; },
		onSourceModifyDamage() { return this.chainModify(2); },
		onBeforeMovePriority: 100,
		onBeforeMove(pokemon) {
			this.debug('removing Spent before attack');
			pokemon.removeVolatile('spent');
		},
	},
	windburst: {
		name: 'windburst',
		duration: 1,
		onStart(pokemon) {
			const ability1 = this.toID((pokemon as any).ability1);
			const ability2 = this.toID((pokemon as any).ability2);
			if (ability1 === 'windrider' || ability2 === 'windrider') { this.boost({atk: 1}, pokemon, pokemon); }
			if (ability1 === 'windpower' || ability2 === 'windpower') { pokemon.addVolatile('charge'); }
		},
	},
	stellaroriginal: {
		name: 'stellaroriginal',
		noCopy: true,
		// Stores the original types before Stellar Terastallization for STAB calculation
	},
};
