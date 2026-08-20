export const Items: import('../sim/dex-items').ItemDataTable = {
	// #region Berries
	jabocaberry: {
		name: "Jaboca Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'utility'],
		shortDesc: "If holder is hit by a physical move, and survives, attacker loses HP equal to the damage dealt. Fragile; if broken, holder loses 1/10HP. Belch Effect: 20% chance to Dragonblight target. 1 time use.",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { this.damage(pokemon.maxhp / 10, pokemon); },
		belch: {
			status: 'dragonblight',
			chance: 20,
		},
		onDamagingHit(damage, target, source, move) {if (move.category === 'Physical' && source.hp && source.isActive && !(source.ability1 === 'magicguard' || source.ability2 === 'magicguard')) { if (target.eatItem()) { this.damage(damage, source, target, null); } }},
		onEat() { },
		num: 211,
		gen: 4,
	},
	lansatberry: {
		name: "Lansat Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'statboost'],
		shortDesc: "While held, grants Luck Effect. If HP≤2/3 (or 100% with Gluttony), grants Focus Energy and Rainbow Effect. Fragile; if broken, grants holder Focus Energy. Belch Effect: grants Focus Energy to target. 1 time use.",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) {
			this.boost({crit: 2}, pokemon);
			pokemon.addVolatile('focusenergy');
		},
		belch: {
			effect(target, source, move) {
				this.boost({crit: 2}, target, source, move);
				target.addVolatile('focusenergy', source, move);
			},
		},
				onEat(pokemon) {
			this.boost({crit: 2}, pokemon);
			pokemon.addVolatile('focusenergy');
			pokemon.addVolatile('rainboweffect');
		},
		   num: 206,
		   gen: 3,
	},
	leppaberry: {
		name: "Leppa Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'utility'],
		shortDesc: "Heals 10 PP to a move that reaches 0 PP. Fragile. 1 time use.",
		isBerry: true,
		isFragile: true,
		onUpdate(pokemon) {
			if (!pokemon.hp) return;
			if (pokemon.moveSlots.some(move => move.pp === 0)) { pokemon.eatItem(); }
		},
		onEat(pokemon) {
			const moveSlot = pokemon.moveSlots.find(move => move.pp === 0) || pokemon.moveSlots.find(move => move.pp < move.maxpp);
			if (!moveSlot) return;
			moveSlot.pp += 10;
			if (moveSlot.pp > moveSlot.maxpp) moveSlot.pp = moveSlot.maxpp;
			this.add('-activate', pokemon, 'item: Leppa Berry', moveSlot.move, '[consumed]');
		},
		num: 154,
		gen: 3,
	},
	keeberry: {
		name: "Kee Berry",
		itemClass: ['berry', 'consumable', 'healing', 'statboost', 'reactive'],
		shortDesc: "Raises holder's Defense 1 stage before being hit by a physical attack. Belch Effect: 30% chance to Toxic Poison target. 1 time use.",
		isBerry: true,
		belch: {
			status: 'tox',
			chance: 30,
		},
		onSourceModifyDamage(damage, source, target, move) {
			   if (move.category === 'Physical' && target.hp && target.isActive) {
				   if (move.id === 'present' && move.heal) return;
				   if (target.eatItem()) { this.boost({ def: 1 }, target); }
			   }
		   },
		   onEat() {},
		num: 687,
		gen: 6,
	},
	marangaberry: {
		name: "Maranga Berry",
		itemClass: ['berry', 'consumable', 'statboost', 'reactive', 'utility'],
		shortDesc: "Raises holder's SpDef 1 stage before being hit by a special attack. If hit by contact move while held, transfers to attacker.",
		isBerry: true,
		belch: { },
		onHit(target, source, move) {
			if (source && source !== target && !source.item && move && this.checkMoveMakesContact(move, source, target)) {
				const berry = target.takeItem();
				if (!berry) return;
				source.setItem(berry);
			}
		},
		onSourceModifyDamage(damage, source, target, move) { if (move.category === 'Special' && target.hp && target.isActive) { if (target.eatItem()) { this.boost({ spd: 1 }, target); } } },
		onEat() {},
		num: 688,
		gen: 6,
	},
	oranberry: {
		name: "Oran Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'healing'],
		shortDesc: "If HP≤1/2, heal 50HP. Fragile; if broken, heal 25HP. Belch Effect: 75% chance to poison target, heals 10HP after damage is dealt",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { this.heal(25, pokemon); },
		belch: {
			status: 'psn',
			chance: 75,
			effect(target, source, move) { if (target && target.hp > 0) target.heal(10); }, 
		},
		onUpdate(pokemon) { if (pokemon.hp <= pokemon.maxhp / 2) { pokemon.eatItem(); } },
		onTryEatItem(item, pokemon) { if (!this.runEvent('TryHeal', pokemon, null, this.effect, 50)) return false; },
		onEat(pokemon) { this.heal(50); },
		num: 155,
		gen: 3,
	},
	rowapberry: {
		name: "Rowap Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'utility'],
		shortDesc: "If holder is hit by a special move, and survives, attacker loses HP equal to the damage dealt. Fragile; if broken, clears grounded hazards. Belch Effect: remove target's active aura. 1 time use.",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { // Remove GROUNDED hazards from the user's side
		   const hazards = ['spikes', 'toxicspikes', 'stickyweb', 'steelspikes'];
		   for (const hazard of hazards) { if (pokemon.side.removeSideCondition(hazard)) { this.add('-message', `Rowap pods broke loose and spun the ${this.dex.conditions.get(hazard).name} away!`); } }
	   },
		belch: { effect(target) { if (target && target.status === 'aura') { target.cureStatus(); } }, },
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Special' && source.hp && source.isActive && !(source.ability1 === 'magicguard' || source.ability2 === 'magicguard')) {
				if (target.eatItem()) {  // Reflect the damage dealt back to the attacker
					this.damage(damage, source, target, null);
					this.boost({spd: 1}, target);
			   }
		   }
		},
		onEat() { },
		num: 212,
		gen: 4,
	},
	sitrusberry: {
		name: "Sitrus Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'healing'],
		shortDesc: "If HP≤1/2, Heals 1/4HP. Fragile; if broken, heals 1/8HP. Belch Effect: target heals 1/24HP. 1 time use.",
		isBerry: true,
		isFragile: true,
		belch: { effect: function(target) { target.heal(target.maxhp / 24); }, },
        onFragileBreak(pokemon) { this.heal(pokemon.maxhp / 8, pokemon); },
		onUpdate(pokemon) { if (pokemon.hp <= pokemon.maxhp / 2) { pokemon.eatItem(); } },
		onTryEatItem(item, pokemon) { if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 4)) return false; },
		onEat(pokemon) { this.heal(pokemon.baseMaxhp / 4); },
		num: 158,
		gen: 3,
	},
	starfberry: {
		name: "Starf Berry",
		itemClass: ['berry', 'consumable', 'statboost'],
		shortDesc: "If HP≤1/4(or 1/2 with Gluttony), Raises a random stat 2 stages. 1 time use.",
		isBerry: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
				((pokemon.ability1 === 'gluttony' && pokemon.abilityState1.gluttony) ||
				(pokemon.ability2 === 'gluttony' && pokemon.abilityState2.gluttony)))) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			const stats: BoostID[] = [];
			for (const stat in pokemon.boosts) { if (stat !== 'accuracy' && stat !== 'evasion' && pokemon.boosts[stat as BoostID] < 6) { stats.push(stat as BoostID); } }
			if (stats.length) {
				const randomStat = this.sample(stats);
				const boost: SparseBoostsTable = {};
				boost[randomStat] = 2;
				this.boost(boost);
			}
		},
		num: 207,
		gen: 3,
	},
	
//region Pinch Berries
	apicotberry: {
		name: "Apicot Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'statboost'],
		shortDesc: "If HP≤2/3, Raises holder's Sp Def 1 stage. Fragile; if broken, raises Sp Def 1 stage.",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { this.boost({ spd: 1 }, pokemon);  },
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp * 2 / 3 || (pokemon.hp <= pokemon.maxhp &&
				((pokemon.ability1 === 'gluttony' && pokemon.abilityState1.gluttony) ||
				(pokemon.ability2 === 'gluttony' && pokemon.abilityState2.gluttony)))) { pokemon.eatItem(); }
		},
		onEat(pokemon) { this.boost({ spd: 1 }); },
		num: 205,
		gen: 3,
	},
	custapberry: {
		name: "Custap Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'utility', 'healing'],
		shortDesc: "If HP≤1/3(or 2/3 with Gluttony), Holder moves 1st in its priority bracket, and heals 30HP. Fragile; if broken, heals 20HP and grants Pepped. Belch Effect: inflicts Lagging status. 1 time use.",
		isBerry: true,
		belch: { effect: function(target) { target.addVolatile('lagging'); }, },
        isFragile: true,
		onFragileBreak(pokemon) {
			pokemon.heal(20);
			pokemon.addVolatile('pepped');
		},
		onFractionalPriorityPriority: -2,
		onFractionalPriority(priority, pokemon) {
			if (
				priority <= 0 &&
				(pokemon.hp <= pokemon.maxhp / 3 || (pokemon.hp <= pokemon.maxhp * 2 / 3 &&
					((pokemon.ability1 === 'gluttony' && pokemon.abilityState1.gluttony) ||
					(pokemon.ability2 === 'gluttony' && pokemon.abilityState2.gluttony))))
			) {
				if (pokemon.eatItem()) {
					this.add('-activate', pokemon, 'item: Custap Berry', '[consumed]');
					pokemon.heal(30);
					return 4;
				}
			}
		},
		onEat() { },
		num: 210,
		gen: 4,
	},
	ganlonberry: {
		name: "Ganlon Berry",
		itemClass: ['berry', 'consumable', 'statboost'],
		shortDesc: "If HP≤2/3,, Raises holder's Defense 1 stage. 1 time use.",
		isBerry: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp * 2 / 3 || (pokemon.hp <= pokemon.maxhp &&
				((pokemon.ability1 === 'gluttony' && pokemon.abilityState1.gluttony) ||
				(pokemon.ability2 === 'gluttony' && pokemon.abilityState2.gluttony)))) { pokemon.eatItem(); }
		},
		onEat(pokemon) { this.boost({ def: 1 }); },
		num: 202,
		gen: 3,
	},
	liechiberry: {
		name: "Liechi Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'statboost'],
		shortDesc: "If HP≤1/3(or 2/3 with Gluttony), Raises holder's Attack 1 stage. Fragile; if broken, raises Attack 1 stage.",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { this.boost({ atk: 1 }, pokemon); },
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp * 2 / 3 || (pokemon.hp <= pokemon.maxhp &&
				((pokemon.ability1 === 'gluttony' && pokemon.abilityState1.gluttony) ||
				(pokemon.ability2 === 'gluttony' && pokemon.abilityState2.gluttony)))) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) { this.boost({ atk: 1 }); },
		num: 201,
		gen: 3,
	},
	micleberry: {
		name: "Micle Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'statboost', 'healing'],
		shortDesc: "If HP≤1/2(or 100% with Gluttony), raises holder's Accuracy 3 stages, heals 75HP, and raises Crit 3 stages. Fragile; if broken, same effects apply. 1 time use.",
		isBerry: true,
		isFragile: true,
		belch: {},
		onResidual(pokemon) {
			if (
				pokemon.hp <= pokemon.maxhp / 2 ||
				(
					pokemon.hp <= pokemon.maxhp &&
					( (pokemon.ability1 === 'gluttony' && pokemon.abilityState1.gluttony) || (pokemon.ability2 === 'gluttony' && pokemon.abilityState2.gluttony) )
				)
			) { pokemon.eatItem(); }
		},
		onEat(pokemon) {
			this.heal(75, pokemon);
			this.boost({accuracy: 3, crit: 3}, pokemon);
		},
		onFragileBreak(pokemon) {
			this.heal(75, pokemon);
			this.boost({accuracy: 3, crit: 3}, pokemon);
		},
		num: 209,
		gen: 4,
	},
	petayaberry: {
		name: "Petaya Berry",
		itemClass: ['berry', 'consumable', 'statboost'],
		shortDesc: "If HP≤1/3(or 2/3 with Gluttony), Raises holder's Special Attack 1 stage. Fragile; if broken, raises Special Attack 1 stage.",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { this.boost({ spa: 1 }, pokemon); },
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp * 2 / 3 || (pokemon.hp <= pokemon.maxhp &&
				((pokemon.ability1 === 'gluttony' && pokemon.abilityState1.gluttony) ||
				(pokemon.ability2 === 'gluttony' && pokemon.abilityState2.gluttony)))) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) { this.boost({ spa: 1 }); },
		num: 204,
		gen: 3,
	},
	salacberry: {
		name: "Salac Berry",
		itemClass: ['berry', 'consumable', 'statboost'],
		shortDesc: "If HP≤1/4(or 1/2 with Gluttony), Raises holder's Speed 1 stage. 1 time use.",
		isBerry: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
				((pokemon.ability1 === 'gluttony' && pokemon.abilityState1.gluttony) ||
				(pokemon.ability2 === 'gluttony' && pokemon.abilityState2.gluttony)))) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) { this.boost({ spe: 1 }); },
		num: 203,
		gen: 3,
	},
//region Type Berries
	babiriberry: {
		name: "Babiri Berry",
		itemClass: ['volatile', 'berry', 'consumable', 'resist', 'healing' ],
		shortDesc: "1st supereffective Steel hit charges berry and halves incoming damage. 2nd hit consumes berry, halves damage, and heals 75HP. Volatile; if disturbed while charged, sets Caltrops on both sides and loses charge. Belch Effect: 20% chance to Burn target.",
		isBerry: true,
		isMildlyFragile: true,
		onMildlyFragileBreak(pokemon) {
			if (pokemon.itemState && pokemon.itemState.chargeditem) {
				pokemon.side.addSideCondition('steelspikes', pokemon);
				pokemon.side.foe.addSideCondition('steelspikes', pokemon);
				delete pokemon.itemState.chargeditem;
				this.add('-message', `${pokemon.name}'s Babiri Berry returned to normal.`);
			}
		},
		belch: {
			status: 'brn',
			chance: 20,
		},
		onSourceModifyDamage(damage, source, target, move) {
				if (move.type === 'Steel' && target.getMoveHitData(move).typeMod > 0) {
					const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
					if (hitSub) return;
					if (!target.itemState?.chargeditem) {
						if (!target.itemState) target.itemState = {} as any;
						target.itemState.chargeditem = true;
						this.add('-message', `${target.name}'s Babiri Berry absorbed the blow! ${target.name}'s Babiri Berry is surging with metallic energy!`);
						return this.chainModify(0.5);
					}
					if (target.eatItem()) {
						if (target.itemState?.chargeditem) delete target.itemState.chargeditem;
						this.debug('-50% reduction');
						this.add('-enditem', target, this.effect, '[weaken]');
						return this.chainModify(0.5);
					}
				}
			},
			onEat(pokemon) { if (pokemon.itemState && pokemon.itemState.chargeditem) { this.heal(75, pokemon); } },
		num: 199,
		gen: 4,
	},
	chartiberry: {
		name: "Charti Berry",
		itemClass: ['volatile', 'berry', 'consumable', 'resist', 'healing' ],
		shortDesc: "1st supereffective Rock hit charges berry and halves incoming damage. 2nd hit consumes berry, halves damage, and heals 75HP. Volatile; if disturbed while charged, sets Stealth Rock on both sides and loses charge. Belch Effect: 130 BP, 20% flinch chance.",
		isBerry: true,
		isMildlyFragile: true,
		onMildlyFragileBreak(pokemon) {
			if (pokemon.itemState && pokemon.itemState.chargeditem) {
				pokemon.side.addSideCondition('stealthrock', pokemon);
				pokemon.side.foe.addSideCondition('stealthrock', pokemon);
				delete pokemon.itemState.chargeditem;
				this.add('-message', `${pokemon.name}'s Charti Berry returned to normal.`);
			}
		},
		belch: {
			basePower: 130,
			volatileStatus: 'flinch',
			chance: 20,
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Rock' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (!target.itemState) target.itemState = {} as any;
					target.itemState.chargeditem = true;
					this.add('-message', `The force was absorbed by the core of ${target.name}'s Charti Berry! ${target.name}'s Charti Berry is surging with crystalline energy!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
					if (target.itemState?.chargeditem) delete target.itemState.chargeditem;
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat(pokemon) { if (pokemon.itemState && pokemon.itemState.chargeditem) { this.heal(75, pokemon); } },
		num: 195,
		gen: 4,
	},
	chilanberry: {
		name: "Chilan Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'resist'],
		shortDesc: "Halves damage from a Normal-type attack. Fragile Belch Effect: 140 BP. 1 time use.",
		isBerry: true,
		isFragile: true,
		belch: { basePower: 140, effect: function(target) { if (target.status === 'aura') { target.cureStatus(); } }, },
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Normal' && (!target.volatiles['substitute'] || move.flags['bypasssub'] || (move.infiltrates && this.gen >= 6))) 
			{ if (target.eatItem()) {
					if (target.itemState?.chargeditem) delete target.itemState.chargeditem;
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 200,
		gen: 4,
	},
	chopleberry: {
		name: "Chople Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'resist', 'healing'],
		shortDesc: "1st supereffective Fighting hit charges berry and halves incoming damage. 2nd hit consumes berry, halves damage, and heals 75HP. Fragile; if broken, Burns holder. If broken while charged, also grants Focus Energy. Belch Effect: 10% chance to Burn target.",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) {
			pokemon.trySetStatus('brn');
			if (pokemon.itemState && pokemon.itemState.chargeditem) {
				this.boost({crit: 2}, pokemon);
				pokemon.addVolatile('focusenergy');
			}
		},
		belch: {
			status: 'brn',
			chance: 10,
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Fighting' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (!target.itemState) target.itemState = {} as any;
					target.itemState.chargeditem = true;
					this.add('-message', `${target.name}'s Chople Berry absorbed the blow! ${target.name}'s Chople Berry is surging with fighting spirit!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
					if (target.itemState?.chargeditem) delete target.itemState.chargeditem;
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat(pokemon) { if (pokemon.itemState && pokemon.itemState.chargeditem) { this.heal(75, pokemon); } },
		num: 189,
		gen: 4,
	},
	cobaberry: {
		name: "Coba Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'resist', 'healing'],
		shortDesc: "1st supereffective Flying hit charges berry and halves incoming damage. 2nd hit consumes berry, halves damage, and heals 75HP. Fragile; if broken while charged, applies Wind Burst.",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { if (pokemon.itemState && pokemon.itemState.chargeditem) { pokemon.addVolatile('windburst'); } },
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Flying' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (!target.itemState) target.itemState = {} as any;
					target.itemState.chargeditem = true;
					this.add('-message', `You can feel the winds surging around ${target.name}'s Coba Berry!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
					if (target.itemState?.chargeditem) delete target.itemState.chargeditem;
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat(pokemon) { if (pokemon.itemState && pokemon.itemState.chargeditem) { this.heal(75, pokemon); } },
		num: 192,
		gen: 4,
	},
	colburberry: {
		name: "Colbur Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'resist', 'healing'],
		shortDesc: "If hit by contact move while holding, transfers to attacker. 1st supereffective Dark hit charges berry and halves incoming damage. 2nd hit consumes berry, halves damage, and heals 75HP. Volatile; if disturbed while charged, sets Spikes on both sides and loses charge. Belch Effect: 20% chance to lower target's Attack 1 stage.",
		isBerry: true,
		isMildlyFragile: true,
		onMildlyFragileBreak(pokemon) {
			if (pokemon.itemState && pokemon.itemState.chargeditem) {
				pokemon.side.addSideCondition('spikes', pokemon);
				pokemon.side.foe.addSideCondition('spikes', pokemon);
				delete pokemon.itemState.chargeditem;
				this.add('-message', `${pokemon.name}'s Colbur Berry returned to normal.`);
			}
		},
		belch: {
			chance: 20,
			effect: function(target) { this.boost({atk: -1}, target); }, 
		},
		onHit(target, source, move) {
			if (source && source !== target && !source.item && move && this.checkMoveMakesContact(move, source, target)) {
				const berry = target.takeItem();
				if (!berry) return;
				source.setItem(berry);
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
				if (move.type === 'Dark' && target.getMoveHitData(move).typeMod > 0) {
					const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
					if (hitSub) return;
					if (!target.itemState?.chargeditem) {
						if (!target.itemState) target.itemState = {} as any;
						target.itemState.chargeditem = true;
						this.add('-message', `${target.name}'s Colbur Berry absorbed the blow! ${target.name}'s Colbur Berry is surging with malicious intent!`);
						return this.chainModify(0.5);
					}
					if (target.eatItem()) {
						if (target.itemState?.chargeditem) delete target.itemState.chargeditem;
						this.debug('-50% reduction');
						this.add('-enditem', target, this.effect, '[weaken]');
						return this.chainModify(0.5);
					}
				}
			},
		onEat(pokemon) { if (pokemon.itemState && pokemon.itemState.chargeditem) { this.heal(75, pokemon); } },
		num: 198,
		gen: 4,
	},
	habanberry: {
		name: "Haban Berry",
		itemClass: ['volatile', 'berry', 'consumable', 'resist', 'healing'],
		shortDesc: "1st supereffective Dragon hit charges berry and halves incoming damage. 2nd hit consumes berry, halves damage, and heals 75HP. Volatile; if disturbed while charged, Dragonblights holder and loses charge. Belch Effect: 30% chance to Dragonblight the target.",
		isBerry: true,
		isMildlyFragile: true,
		onMildlyFragileBreak(pokemon) {
			if (pokemon.itemState && pokemon.itemState.chargeditem) {
				pokemon.trySetStatus('dragonblight');
				delete pokemon.itemState.chargeditem;
				this.add('-message', `${pokemon.name}'s Haban Berry returned to normal.`);
			}
		},
		belch: {effect: function(target) { if (this.randomChance(30, 100)) { target.trySetStatus('dragonblight'); } },},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Dragon' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (!target.itemState) target.itemState = {} as any;
					target.itemState.chargeditem = true;
					this.add('-message', `You can feel the draconic energy radiating from ${target.name}'s Haban Berry!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
					if (target.itemState?.chargeditem) delete target.itemState.chargeditem;
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat(pokemon) { if (pokemon.itemState && pokemon.itemState.chargeditem) { this.heal(75, pokemon); } },
		num: 197,
		gen: 4,
	},
	kasibberry: {
		name: "Kasib Berry",
		itemClass: ['volatile', 'berry', 'consumable', 'statuscure', 'resist', 'healing'],
		shortDesc: "1st supereffective Ghost hit charges berry and halves incoming damage. 2nd hit consumes berry, halves damage, and heals 75HP. While held: Grants immunity to Curse. Volatile; if disturbed, holder gains Focus Energy; if disturbed while charged, also inflicts Curse and loses charge. Belch Effect: cures target's Curse. 1 time use.",
		isBerry: true,
		isMildlyFragile: true,
		belch: {
			effect(target) {
				if (target.volatiles['curse']) {
					target.removeVolatile('curse');
					this.add('-curestatus', target, 'curse', '[from] item: Kasib Berry');
				}
			},
		},
		onMildlyFragileBreak(pokemon) {
			this.boost({crit: 2}, pokemon);
			pokemon.addVolatile('focusenergy');
			if (pokemon.itemState && pokemon.itemState.chargeditem) {
				pokemon.m.kasibBerryCurseImmunityDisabled = true;
				pokemon.trySetStatus('curse');
				pokemon.m.kasibBerryCurseImmunityDisabled = false;
				delete pokemon.itemState.chargeditem;
				this.add('-message', `The trapped spirits were released from ${pokemon.name}'s Kasib Berry.`);
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Ghost' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (!target.itemState) target.itemState = {} as any;
					target.itemState.chargeditem = true;
					this.add('-message', `You can see the spectral wisps emanating from ${target.name}'s Kasib Berry!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
					if (target.itemState?.chargeditem) delete target.itemState.chargeditem;
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat(pokemon) {
			if (pokemon.itemState && pokemon.itemState.chargeditem) {
				this.boost({crit: 2}, pokemon);
				pokemon.addVolatile('focusenergy');
				this.heal(75, pokemon);
			}
		},
		onTryAddVolatile(status, pokemon) {
			if (status && status.id === 'curse') {
				if (pokemon.m && pokemon.m.kasibBerryCurseImmunityDisabled) {
					// Immunity temporarily disabled, allow curse
					return;
				}
				this.add('-immune', pokemon, '[from] item: Kasib Berry');
				return null;
			}
		},
		num: 196,
		gen: 4,
	},
	kebiaberry: {
		name: "Kebia Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'resist', 'healing'],
		shortDesc: "1st supereffective Poison hit charges berry and halves incoming damage. 2nd hit consumes berry, halves damage, and heals 75HP. Fragile; if broken, inflicts poison; if broken while charged, inflicts Toxic Poison and sets Toxic Spikes on both sides. Belch Effect: 20% chance each to Toxic Poison or Poison target.",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) {
			if (pokemon.itemState && pokemon.itemState.chargeditem) {
				pokemon.trySetStatus('tox');
				pokemon.side.addSideCondition('toxicspikes');
				pokemon.side.foe.addSideCondition('toxicspikes');
			} else { pokemon.trySetStatus('psn'); }
		},
		belch: {
			effect(target) {
				if (this.randomChance(20, 100)) { target.trySetStatus('tox'); } 
				else if (this.randomChance(20, 100)) { target.trySetStatus('psn'); }
			},
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Poison' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (!target.itemState) target.itemState = {} as any;
					target.itemState.chargeditem = true;
					this.add('-message', `${target.name}'s Kebia Berry absorbed the blow! ${target.name}'s Kebia Berry is bubbling with Toxic particles!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
					if (target.itemState?.chargeditem) delete target.itemState.chargeditem;
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat(pokemon) { if (pokemon.itemState && pokemon.itemState.chargeditem) { this.heal(75, pokemon); } },
		num: 190,
		gen: 4,
	},
	occaberry: {
		name: "Occa Berry",
		itemClass: ['volatile', 'berry', 'consumable', 'resist', 'healing'],
		shortDesc: "1st supereffective Fire hit charges berry and halves incoming damage. 2nd hit consumes berry, halves damage, and heals 75HP. Volatile; if disturbed, Burns holder; if broken while charged, sets Sea of Fire on both sides 2 turns. Belch Effect: 20% chance each to Burn target.",
		isBerry: true,
		isMildlyFragile: true,
		onMildlyFragileBreak(pokemon) {
			pokemon.trySetStatus('brn');
			if (pokemon.itemState?.chargeditem) {
				pokemon.battle.field.addPseudoWeather('seaoffire', pokemon, this.effect);
				this.add('-message', `The flames burst out of ${pokemon.name}'s Occa Berry. The battlefield is engulfed in a Sea of Fire!`);
				delete pokemon.itemState.chargeditem;
			}
		},
		belch: {
			status: 'brn',
			chance: 20,
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Fire' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (!target.itemState) target.itemState = {} as any;
					target.itemState.chargeditem = true;
					this.add('-message', `${target.name}'s Occa Berry absorbed thermal energy! ${target.name}'s Occa Berry is radiating heat!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
					if (target.itemState?.chargeditem) delete target.itemState.chargeditem;
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat(pokemon) { if (pokemon.itemState && pokemon.itemState.chargeditem) { this.heal(75, pokemon); } },
		num: 184,
		gen: 4,
	},
	passhoberry: {
		name: "Passho Berry",
		itemClass: ['volatile', 'berry', 'consumable', 'resist', 'healing'],
		shortDesc: "1st supereffective Water hit charges berry and halves incoming damage. 2nd hit consumes berry, halves damage, and heals 125HP. Fragile; if broken, cures holder of Burn; if broken while charged, Grants holder Aqua Ring. Belch Effect: cures target of Burn.",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) {
			if (pokemon.status === 'brn') pokemon.cureStatus();
			if (pokemon.itemState && pokemon.itemState.chargeditem) { pokemon.addVolatile('aquaring'); }
		},
		belch: { effect: function(target) { if (target.status === 'brn') target.cureStatus(); }, },
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Water' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (!target.itemState) target.itemState = {} as any;
					target.itemState.chargeditem = true;
					this.add('-message', `${target.name}'s Passho Berry absorbed the flow! ${target.name}'s Passho Berry is swirling with aqueous energy!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
					if (target.itemState?.chargeditem) delete target.itemState.chargeditem;
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat(pokemon) { if (pokemon.itemState && pokemon.itemState.chargeditem) { this.heal(125, pokemon); } },
		num: 185,
		gen: 4,
	},
	payapaberry: {
		name: "Payapa Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'resist', 'utility'],
		shortDesc: "1st supereffective Psychic type hit's damage is halved. The holder then transforms into the attacker. Fragile; if broken, transforms the holder into the attacker",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) {
			const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			if (target) {  pokemon.transformInto(target, this.dex.abilities.get('imposter')); }
		},
		belch: {
			chance: 30,
			volatileStatus: 'confusion',
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Psychic' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (target.eatItem()) {
					if (target.itemState?.chargeditem) delete target.itemState.chargeditem;
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		   onEat(pokemon) {
			   this.heal(75, pokemon);
			   // Try to transform into the opposing active Pokemon, like Imposter
			   const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			   if (target) { pokemon.transformInto(target, this.dex.abilities.get('imposter')); }
		   },
		num: 193,
		gen: 4,
	},
	rindoberry: {
		name: "Rindo Berry",
		itemClass: ['gragile', 'berry', 'consumable', 'resist', 'healing', 'statuscure'],
		shortDesc: "1st supereffective Grass hit charges berry and halves incoming damage. 2nd hit consumes berry, halves damage, cures holder of Drowsy or Sleep, and heals 125HP. Fragile; if broken while charged, cures holder of Drowsy or Sleep, and Grants holder Ingrain. Belch Effect: 30% chance to inflict Drowsy.",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) {
			if (pokemon.itemState && pokemon.itemState.chargeditem) {
				if (pokemon.status === 'slp' || pokemon.status === 'drowsy') pokemon.cureStatus();
				pokemon.addVolatile('ingrain');
			}
		},
		belch: {
			chance: 30,
			status: 'drowsy',
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Grass' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (!target.itemState) target.itemState = {} as any;
					target.itemState.chargeditem = true;
					this.add('-message', `${target.name}'s Rindo Berry absorbed the blow! ${target.name}'s Rindo Berry is glowing with life energy!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
					if (target.itemState?.chargeditem) delete target.itemState.chargeditem;
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat(pokemon) {
			if (pokemon.itemState && pokemon.itemState.chargeditem) {
				if (pokemon.status === 'slp' || pokemon.status === 'drowsy') pokemon.cureStatus();
				this.heal(125, pokemon);
			}
		},
		num: 187,
		gen: 4,
	},
	roseliberry: {
		name: "Roseli Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'resist', 'healing'],
		shortDesc: "1st supereffective Fairy hit charges berry and halves incoming damage. 2nd hit consumes berry, halves damage, and heals 75HP. Fragile; if broken, cures holder of Dragonblight; if broken while charged, Inflicts holder with Magic Dust. Belch Effect: Supereffective on Dragon Type targets.",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) {
			if (pokemon.status === 'dragonblight') pokemon.cureStatus();
			if (pokemon.itemState && pokemon.itemState.chargeditem) { pokemon.addVolatile('magicdust'); }
		},
		belch: {
			effect(target, source, move) {
			   // Make Belch always super effective against Dragon types
			   if (move) {
				   const origOnEffectiveness = move.onEffectiveness;
				   move.onEffectiveness = function(typeMod, type, move_, target_) {
					   if (target_ && typeof target_ === 'object' && 'hasType' in target_ && typeof target_.hasType === 'function' && target_.hasType('Dragon')) { return 1; }
					   if (typeof origOnEffectiveness === 'function') { return origOnEffectiveness.call(this, typeMod, type, move_, target_); }
					   return typeMod;
				   };
			   }
		   },
	   },
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Fairy' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (!target.itemState) target.itemState = {} as any;
					target.itemState.chargeditem = true;
					this.add('-message', `${target.name}'s Roseli Berry absorbed the spell! ${target.name}'s Roseli Berry is swirling with magical energy!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
					if (target.itemState?.chargeditem) delete target.itemState.chargeditem;
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat(pokemon) {
			if (pokemon.status === 'dragonblight') pokemon.cureStatus();
			if (pokemon.itemState && pokemon.itemState.chargeditem) { this.heal(75, pokemon); }
		},
		num: 686,
		gen: 6,
	},
	shucaberry: {
		name: "Shuca Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'resist', 'healing'],
		shortDesc: "1st supereffective Ground hit charges berry and halves incoming damage. 2nd hit consumes berry, halves damage, and heals 75HP. Fragile.",
		isBerry: true,
		isFragile: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Ground' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (!target.itemState) target.itemState = {} as any;
					target.itemState.chargeditem = true;
					this.add('-message', `${target.name}'s Shuca Berry absorbed the blow! ${target.name}'s Shuca Berry is shaking with terrestrial energy!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
					if (target.itemState?.chargeditem) delete target.itemState.chargeditem;
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					this.heal(75, target);
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 191,
		gen: 4,
	},
	tangaberry: {
		name: "Tanga Berry",
		itemClass: ['volatile', 'berry', 'consumable', 'resist', 'healing'],
		shortDesc: "1st supereffective Bug hit charges berry and halves incoming damage. 2nd hit consumes berry, halves damage, and heals 75HP. Fragile; if broken, Confuses the holder; if broken while charged, spreads Sticky Web on both sides. Belch Effect: 20% chance to Confuse.",
		isBerry: true,
		isMildlyFragile: true,
		onMildlyFragileBreak(pokemon) {
			pokemon.addVolatile('confusion');
			if (pokemon.itemState && pokemon.itemState.chargeditem) {
				pokemon.side.addSideCondition('stickyweb');
				pokemon.side.foe.addSideCondition('stickyweb');
			} 
		},
		belch: {
			chance: 20,
			volatileStatus: 'confusion',
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Bug' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (!target.itemState) target.itemState = {} as any;
					target.itemState.chargeditem = true;
					this.add('-message', `${target.name}'s Tanga Berry absorbed the blow! ${target.name}'s Tanga Berry is swarming with energy!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
					if (target.itemState?.chargeditem) delete target.itemState.chargeditem;
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat(pokemon) { if (pokemon.itemState && pokemon.itemState.chargeditem) { this.heal(75, pokemon); } },
		num: 194,
		gen: 4,
	},
	wacanberry: {
		name: "Wacan Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'resist', 'healing'],
		shortDesc: "1st supereffective Electric hit charges berry and negates all damage. 2nd hit consumes berry, halves damage, and heals 75HP. Fragile; if broken, Paralyzes holder; if broken while charged, holder also loses 1/3HP. Belch Effect: 10% chance to Paralyze target.",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) {
			if (pokemon.itemState && pokemon.itemState.chargeditem) {
				const damage = Math.floor(pokemon.maxhp / 3);
				this.add('-message', `The Wacan Berry exploded! ${pokemon.name} lost ${damage}HP.`);
				this.damage(damage, pokemon);
			}
			pokemon.trySetStatus('par');
		},
		belch: {
			status: 'par',
			chance: 10,
		},
		   onSourceModifyDamage(damage, source, target, move) {
			   if (move.type === 'Electric' && target.getMoveHitData(move).typeMod > 0) {
				   const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				   if (hitSub) return;
				   if (!target.itemState?.chargeditem) {
					   if (!target.itemState) target.itemState = {} as any;
						target.itemState.chargeditem = true;
					   this.add('-message', `${target.name}'s Wacan Berry absorbed the shock! ${target.name}'s Wacan Berry is surging with electricity!`);
					   return 0;
					}
					if (target.eatItem()) {
						if (target.itemState?.chargeditem) delete target.itemState.chargeditem;
						this.debug('-50% reduction');
						this.add('-enditem', target, this.effect, '[weaken]');
						return this.chainModify(0.5);
					}
			   }
		   },
		onEat(pokemon) { if (pokemon.itemState && pokemon.itemState.chargeditem) { this.heal(75, pokemon); } },
		num: 186,
		gen: 4,
	},
	yacheberry: {
		name: "Yache Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'resist', 'healing'],
		shortDesc: "1st supereffective Ice hit charges berry and halves incoming damage. 2nd hit consumes berry, halves damage, and heals 75HP. Fragile; if broken, Freezes holder; if broken while charged, holder also loses 1/3HP. Belch Effect: 10% chance to Freeze target.",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) {
			if (pokemon.itemState && pokemon.itemState.chargeditem) {
				const damage = Math.floor(pokemon.maxhp / 3);
				this.add('-message', `The Yache Berry exploded! ${pokemon.name} lost ${damage}HP.`);
				this.damage(damage, pokemon);
			}
			pokemon.trySetStatus('frz');
		},
		belch: {
			status: 'frz',
			chance: 10,
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Ice' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				   if (!target.itemState?.chargeditem) {
					   if (!target.itemState) target.itemState = {} as any;
						target.itemState.chargeditem = true;
					   this.add('-message', `${target.name}'s Yache Berry absorbed the cold! ${target.name}'s Yache Berry is surging with icy energy!`);
					   return this.chainModify(0.5);
				   }
				if (target.eatItem()) {
					if (target.itemState?.chargeditem) delete target.itemState.chargeditem;
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat(pokemon) { if (pokemon.itemState && pokemon.itemState.chargeditem) { this.heal(75, pokemon); } },
		num: 188,
		gen: 4,
	},
// #region Status Cure Berries
	aspearberry: {
		name: "Aspear Berry",
		itemClass: ['berry', 'consumable', 'statuscure'],
		shortDesc: "Cures holder of Freeze or Frostbite. Belch effect: Cures Freeze or Frostbite. 1 time use.",
		isBerry: true,
		belch: { effect: function(target) { if (target.status === 'frz' || target.status === 'frostbite') { target.cureStatus(); } }, },
		onUpdate(pokemon) { if (pokemon.status === 'frz' || pokemon.status === 'frostbite') { pokemon.eatItem(); } },
		onEat(pokemon) { if (pokemon.status === 'frz' || pokemon.status === 'frostbite') { pokemon.cureStatus(); } },
		num: 199,
		gen: 4,
	},
	cheriberry: {
		name: "Cheri Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'statuscure'],
		shortDesc: "Cures holder of Paralysis. Fragile; if broken while Paralyzed, cures Paralysis. Belch Effect: while Paralyzed, cures target's Paralysis. 1 time use.",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { if (pokemon.status === 'par') { pokemon.cureStatus(); } },
		belch: { effect: function(target) { if (target.status === 'par') { target.cureStatus(); } }, },
		onUpdate(pokemon) { if (pokemon.status === 'par') { pokemon.eatItem(); } },
		onEat(pokemon) { if (pokemon.status === 'par') { pokemon.cureStatus(); } },
		num: 149,
		gen: 3,
	},
	chestoberry: {
		name: "Chesto Berry",
		itemClass: ['berry', 'consumable', 'statuscure'],
		shortDesc: "Cures holder of Sleep or Drowsy. Belch Effect: while ASleep/Drowsy, cures target. 1 time use.",
		isBerry: true,
		belch: {effect: function(target) { if (target.status === 'slp'  || target.status === 'drowsy') { target.cureStatus(); } },},
		onUpdate(pokemon) { if (pokemon.status === 'slp' || pokemon.status === 'drowsy') { pokemon.eatItem(); } },
		onEat(pokemon) { if (pokemon.status === 'slp' || pokemon.status === 'drowsy') { pokemon.cureStatus(); } },
		num: 150,
		gen: 3,
	},
	durinberry: {
		name: "Durin Berry",
		itemClass: ['berry', 'consumable', 'statuscure'],
		shortDesc: "Cures holder of Bubbleblight. Belch effect: Cures Bubbleblight. 1 time use.",
		isBerry: true,
		belch: { effect: function(target) { if (target.status === 'bubbleblight') { target.cureStatus(); } }, },
		onUpdate(pokemon) { if (pokemon.status === 'bubbleblight') { pokemon.eatItem(); } },
		onEat(pokemon) { if (pokemon.status === 'bubbleblight') { pokemon.cureStatus(); } },
		num: 182,
		gen: 3,
	},
	lumberry: {
		name: "Lum Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'statuscure'],
		shortDesc: "Cures holder of any status or Confusion. Fragile. 1 time use.",
		isBerry: true,
		isFragile: true,
		onAfterSetStatusPriority: -1,
		onAfterSetStatus(status, pokemon) { pokemon.eatItem(); },
		onUpdate(pokemon) { if (pokemon.status || pokemon.volatiles['confusion']) { pokemon.eatItem(); } },
		onEat(pokemon) {
			pokemon.cureStatus();
			pokemon.removeVolatile('confusion');
		},
		num: 157,
		gen: 3,
	},
	pechaberry: {
		name: "Pecha Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'statuscure'],
		shortDesc: "Cures holder of Poison or Toxic Poison. Fragile; if broken while Poisoned, cures Poison or Toxic Poison. Belch Effect: while Poisoned, cures target's Poison or Toxic Poison. 1 time use.",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { if (pokemon.status === 'psn' || pokemon.status === 'tox') pokemon.cureStatus(); },
		belch: { effect: function(target) { if (target.status === 'psn' || target.status === 'tox') { target.cureStatus(); } }, },
		onUpdate(pokemon) { if (pokemon.status === 'psn' || pokemon.status === 'tox') { pokemon.eatItem(); } },
		onEat(pokemon) { if (pokemon.status === 'psn' || pokemon.status === 'tox') { pokemon.cureStatus(); } },
		num: 151,
		gen: 3,
	},
	persimberry: {
		name: "Persim Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'statuscure'],
		shortDesc: "Cures holder of Confusion. Fragile; if broken while Confused, cures Confusion. Belch Effect: while Confused, cures target's Confusion. 1 time use.",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { if (pokemon.volatiles['confusion']) pokemon.removeVolatile('confusion'); },
		belch: { effect(target) { if (target && target.volatiles['confusion']) { target.removeVolatile('confusion'); } }, },
		onUpdate(pokemon) { if (pokemon.volatiles['confusion']) { pokemon.eatItem(); } },
		onEat(pokemon) { pokemon.removeVolatile('confusion'); },
		num: 156,
		gen: 3,
	},
	pinapberry: {
		name: "Pinap Berry",
		itemClass: ['berry', 'nouse'],
		shortDesc: "Cures holder of Fear. Belch effect: Cures Fear. 1 time use.",
		isBerry: true,
		belch: { effect: function(target) { if (target.status === 'fear') { target.cureStatus(); } }, },
		onUpdate(pokemon) { if (pokemon.status === 'fear') { pokemon.eatItem(); } },
		onEat(pokemon) { if (pokemon.status === 'fear') { pokemon.cureStatus(); } },
		num: 168,
		gen: 3,
	},
	rawstberry: {
		name: "Rawst Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'statuscure'],
		shortDesc: "Cures holder of Burn. Fragile; if broken while Burnt, cures Burn. Belch Effect: while Burnt, cures target's Burn. 1 time use.",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { if (pokemon.status === 'brn') pokemon.cureStatus(); },
		belch: { effect: function(target) { if (target.status === 'brn') { target.cureStatus(); } }, },
		onUpdate(pokemon) { if (pokemon.status === 'brn') { pokemon.eatItem(); } },
		onEat(pokemon) { if (pokemon.status === 'brn') { pokemon.cureStatus(); } },
		num: 152,
		gen: 3,
	},
	razzberry: {
		name: "Razz Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'statuscure'],
		shortDesc: "Cures holder of Dragonblight. Fragile; if broken while inflicted with Dragonblight, cures Dragonblight. Belch Effect: while inflicted with Dragonblight, cures target's Dragonblight. 1 time use.",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { if (pokemon.status === 'dragonblight') pokemon.cureStatus(); },
		belch: { effect: function(target) { if (target.status === 'dragonblight') { target.cureStatus(); } }, },
		onUpdate(pokemon) { if (pokemon.status === 'dragonblight') { pokemon.eatItem(); } },
		onEat(pokemon) { if (pokemon.status === 'dragonblight') { pokemon.cureStatus(); } },
		num: 164,
		gen: 3,
	},
//region Useless Berries
	belueberry: {
		name: "Belue Berry",
		itemClass: ['fragile', 'berry', 'consumable'],
		shortDesc: "Cannot be eaten by the holder. Fragile. Belch Effect: 20% chance to infatuate target.",
		isBerry: true,
		isFragile: true,
		belch: {
			volatileStatus: 'attract',
			chance: 20,
		},
		num: 183,
		gen: 3,
	},
	blukberry: {
		name: "Bluk Berry",
		itemClass: ['fragile', 'berry'],
		shortDesc: "Cannot be eaten by the holder. Fragile",
		isBerry: true,
		isFragile: true,
		onEat: false,
		num: 165,
		gen: 3,
		isNonstandard: "Past",
	},
	cornnberry: {
		name: "Cornn Berry",
		itemClass: ['berry', 'nouse'],
		shortDesc: "Cannot be eaten by the holder. No effect.",
		isBerry: true,
		onEat: false,
		num: 175,
		gen: 3,
		isNonstandard: "Past",
	},
	grepaberry: {
		name: "Grepa Berry",
		itemClass: ['fragile', 'berry', 'nouse'],
		shortDesc: "Cannot be eaten by the holder. Fragile. No effect.",
		isBerry: true,
		isFragile: true,
		onEat: false,
		num: 173,
		gen: 3,
	},
	hondewberry: {
		name: "Hondew Berry",
		itemClass: ['berry', 'nouse'],
		shortDesc: "Cannot be eaten by the holder. No effect.",
		isBerry: true,
		onEat: false,
		num: 172,
		gen: 3,
	},
	kelpsyberry: {
		name: "Kelpsy Berry",
		itemClass: ['berry', 'nouse'],
		shortDesc: "Cannot be eaten by the holder. No effect.",
		isBerry: true,
		belch: {},
		onEat: false,
		num: 170,
		gen: 3,
	},
	magostberry: {
		name: "Magost Berry",
		itemClass: ['fragile', 'berry', 'nouse'],
		shortDesc: "Cannot be eaten by the holder. Fragile. No effect.",
		isBerry: true,
		isFragile: true,
		belch: {},
		onEat: false,
		num: 176,
		gen: 3,
		isNonstandard: "Past",
	},
	nanabberry: {
		name: "Nanab Berry",
		itemClass: ['fragile', 'berry', 'nouse'],
		shortDesc: "Cannot be eaten by the holder. Fragile. No effect.",
		isBerry: true,
		isFragile: true,
		belch: { },
		onEat: false,
		num: 166,
		gen: 3,
		isNonstandard: "Past",
	},
	nomelberry: {
		name: "Nomel Berry",
		itemClass: ['berry', 'nouse'],
		shortDesc: "Cannot be eaten by the holder. No effect.",
		isBerry: true,
		belch: { },
		onEat: false,
		num: 178,
		gen: 3,
		isNonstandard: "Past",
	},
	pamtreberry: {
		name: "Pamtre Berry",
		itemClass: ['berry', 'nouse'],
		shortDesc: "Cannot be eaten by the holder. No effect.",
		isBerry: true,
		belch: { },
		onEat: false,
		num: 180,
		gen: 3,
		isNonstandard: "Past",
	},
	pomegberry: {
		name: "Pomeg Berry",
		itemClass: ['fragile', 'berry', 'nouse'],
		shortDesc: "Cannot be eaten by the holder. Fragile. No effect.",
		isBerry: true,
		isFragile: true,
		belch: { },
		onEat: false,
		num: 169,
		gen: 3,
	},
	qualotberry: {
		name: "Qualot Berry",
		itemClass: ['berry', 'nouse'],
		shortDesc: "Cannot be eaten by the holder. No effect.",
		isBerry: true,
		belch: { },
		onEat: false,
		num: 171,
		gen: 3,
	},
	rabutaberry: {
		name: "Rabuta Berry",
		itemClass: ['berry', 'nouse'],
		shortDesc: "Cannot be eaten by the holder. No effect.",
		isBerry: true,
		belch: { },
		onEat: false,
		num: 177,
		gen: 3,
		isNonstandard: "Past",
	},
	spelonberry: {
		name: "Spelon Berry",
		itemClass: ['fragile', 'berry', 'consumable'],
		shortDesc: "Cannot be eaten by the holder. Fragile; if broken, Burns holder. Belch Effect: becomes a Poison/Fire type move that can hit Steel types with a 30% chance to Burn target.",
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { pokemon.trySetStatus('brn'); },
	   	belch: {
			effect(target, source, move) {
				if (this.randomChance(30, 100)) { target.trySetStatus('brn', source, move); }
				if (move && source && !source.volatiles['spelonberrybelch']) {
					move.type = 'Poison/Fire';
					this.add('-activate', source, 'item: Spelon Berry', '[dualtype]', 'Poison/Fire');
					source.addVolatile('spelonberrybelch');
					const origOnTryImmunity = move.onTryImmunity;
					move.onTryImmunity = function(target, source, move_) {
						if (
							move_ &&
							move_.id === 'belch' &&
							source?.volatiles?.['spelonberrybelch'] &&
							target?.hasType?.('Steel')
						) { return false; }
						if (typeof origOnTryImmunity === 'function') { return origOnTryImmunity.call(this, target, source, move_); }
						return undefined;
					};
				}
			},
		},
		num: 179,
		gen: 3,
	},
	tamatoberry: {
		name: "Tamato Berry",
		itemClass: ['fragile', 'berry', 'nouse'],
		shortDesc: "Cannot be eaten by the holder. Fragile. No effect.",
		isBerry: true,
		isFragile: true,
		onEat: false,
		num: 174,
		gen: 3,
	},
	watmelberry: {
		name: "Watmel Berry",
		itemClass: ['fragile', 'berry', 'nouse'],
		shortDesc: "Cannot be eaten by the holder. Fragile. No effect.",
		isBerry: true,
		isFragile: true,
		belch: { },
		onEat: false,
		num: 181,
		gen: 3,
		isNonstandard: "Past",
	},
	wepearberry: {
		name: "Wepear Berry",
		itemClass: ['berry', 'nouse'],
		shortDesc: "Cannot be eaten by the holder. No effect.",
		isBerry: true,
		belch: { },
		onEat: false,
		num: 167,
		gen: 3,
		isNonstandard: "Past",
	},
// #region Battle Items
	abilityshield: {
		name: "Ability Shield",
		itemClass: ['statboost'],
		shortDesc: "Protects holder from the effects of enemy abilities in defensive calcs. Immune to protection-breaking effects.",
		fling: { basePower: 30, },
		ignoreKlutz: true,
		onTryBoost(boost, target, source, effect) {
			if (effect?.effectType === 'Ability') {
				let blocked = false;
				for (const stat in boost) { if (boost[stat as BoostID]! < 0) blocked = true; }
				if (blocked) {
					this.add('-block', target, 'item: Ability Shield');
					return null;
				}
			}
		},
		onTryAddVolatile(status, pokemon, source, effect) {
			if (effect?.effectType === 'Ability') {
				this.add('-block', pokemon, 'item: Ability Shield');
				return null;
			}
		},
		onModifyGuardAction(guardActionId, pokemon) { if (guardActionId === 'guard') return 'guardlv2'; },
		num: 1881,
		gen: 9,
	},
	absorbbulb: {
		name: "Absorb Bulb",
		itemClass: ['healing'],
		shortDesc: "1.2x power on Holder's draining moves. Immune to Water-type damage; when hit by Water moves, heals 1/8HP. After absorbing 2 Water moves, item breaks, and grants Aqua Ring.",
		fling: { basePower: 30, },
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) { if (move.flags['drain']) return this.chainModify([6144, 4096]); },
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!target.itemState) target.itemState = {} as any;
				if (!target.itemState.absorbCount) target.itemState.absorbCount = 0;
				this.heal(target.baseMaxhp / 8, target);
				this.add('-immune', target, '[from] item: Absorb Bulb');
				this.add('-message', `${target.name}'s Absorb Bulb absorbed the flow! ${target.name}'s Absorb Bulb is swirling with aqueous energy!`);
				target.itemState.absorbCount++;
				if (target.itemState.absorbCount >= 2) {
					target.addVolatile('aquaring');
					this.add('-message', `${target.name}'s Absorb Bulb burst! ${target.name} is surrounded by a veil of water!`);
					target.useItem();
				}
				return null;
			}
		},
		num: 545,
		gen: 5,
	},
	airballoon: { // airborneness implemented in sim/pokemon.js:Pokemon#isGrounded
		name: "Air Balloon",
		itemClass: ['fragile', 'reactive'],
		shortDesc: "Holder is immune to grounded effects. Pops when hit by a damaging bind, bullet, contact, slice, beam, claw, or pierce move. When popped, triggers wind effects. Replaces user's Guard Action with Leap. Fragile.",
		isFragile: true,
		onStart(target) { if (!target.ignoringItem() && !this.field.getPseudoWeather('gravity')) { this.add('-item', target, 'Air Balloon'); } },
		onFragileBreak(pokemon) {
			if (pokemon.item !== 'airballoon') return;
			pokemon.item = '';
			this.clearEffectState(pokemon.itemState);
			this.runEvent('AfterUseItem', pokemon, null, null, this.dex.items.get('airballoon'));
			pokemon.addVolatile('windburst');
			this.add('-message', `${pokemon.name}'s Air Balloon popped and released a gust of wind!`);
		},
		onDamagingHit(damage, target, source, move) {
			if (
				target.item === 'airballoon' &&
				move && move.category !== 'Status' &&
				( move.flags['binding'] || move.flags['bullet'] || move.flags['contact'] || move.flags['slicing'] || move.flags['beam'] || move.flags['claw'] || move.flags['pierce'] )
			) {
				target.item = '';
				this.clearEffectState(target.itemState);
				this.runEvent('AfterUseItem', target, null, null, this.dex.items.get('airballoon'));
				target.addVolatile('windburst');
				this.add('-message', `${target.name}'s Air Balloon popped and released a gust of wind!`);
			}
		},
		forcedGuardAction: 'leap',
		num: 541,
		gen: 5,
	},
	bigroot: {
		name: "Big Root",
		itemClass: ['healing'],
		shortDesc: "1.5x healing on Holder's draining moves, Leech Seed, Ingrain, Aqua Ring, and Strength Sap.",
		fling: { basePower: 10, },
		onTryHealPriority: 1,
		onTryHeal(damage, target, source, effect) {
			const heals = ['drain', 'leechseed', 'ingrain', 'aquaring', 'strengthsap'];
			if (heals.includes(effect.id)) { return this.chainModify([6144, 4096]); }
		},
		num: 296,
		gen: 4,
	},
	bindingband: { // implemented in conditions.ts
		name: "Binding Band",
		itemClass: ['utility'],
		shortDesc: "1.2x power on Holder's binding moves. Holder's bind deals 1/5HP per turn [instead of 1/8]",
		fling: { basePower: 30, },
		num: 544,
		gen: 5,
		onModifyDamage(damage, source, target, move) { if (move.flags['binding']) { return this.chainModify(1.2); } },
	},
	blacksludge: {
		name: "Black Sludge",
		itemClass: ['healing'],
		shortDesc: "If Poison type: at the end of every turn, holder Heals 1/16HP, loses 1/8HP otherwise.",
		fling: { basePower: 30, },
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) {
			if (pokemon.hasType('Poison')) { this.heal(pokemon.baseMaxhp / 16); } 
			else { this.damage(pokemon.baseMaxhp / 8); }
		},
		num: 281,
		gen: 4,
	},
	blunderpolicy: { // Item activation located in scripts.js
		name: "Blunder Policy",
		itemClass: ['statboost'],
		shortDesc: "If holder misses a move, Boost holder's Attack and Sp Atk 2 stages.",
		fling: { basePower: 80, },
		num: 1121,
		gen: 8,
	},
	boosterenergy: {
		name: "Booster Energy",
		itemClass: ['statboost', 'weather', 'terrain'],
		shortDesc: "Activates Protosynthesis outside of sun or Quark Drive outside of Electric Terrain. 1 time use.",
		fling: { basePower: 30, },
		onSwitchInPriority: -2,
		onStart(pokemon) { this.effectState.started = true; ((this.effect as any).onUpdate as (p: Pokemon) => void).call(this, pokemon); },
		onUpdate(pokemon) {
			if (!this.effectState.started || pokemon.transformed) return;
			if ((pokemon.ability1 === 'protosynthesis' || pokemon.ability2 === 'protosynthesis') && !this.field.isWeather('sunnyday') && pokemon.useItem()) { pokemon.addVolatile('protosynthesis'); }
			if ((pokemon.ability1 === 'quarkdrive' || pokemon.ability2 === 'quarkdrive') && !this.field.isTerrain('electricterrain') && pokemon.useItem()) { pokemon.addVolatile('quarkdrive'); }
		},
		num: 1880,
		gen: 9,
	},
	cellbattery: {
		name: "Cell Battery",
		itemClass: ['statboost', 'reactive'],
		shortDesc: "When hit by an Electric type move: raises holder's Attack, Sp Atk, Sp Def 1 stage, grants Charge, and charges the Cell Battery. While charged: Grants Charge status at end of turn, discharges battery. If hit by an Electric type move while charged: causes 40 BP Electric explosion hitting all Pokemon and destroys item.",
		fling: { basePower: 30, },
		onResidual(pokemon) {
			if (pokemon.item === 'cellbattery' && pokemon.itemState && pokemon.itemState.charged && !pokemon.volatiles['charged']) {
				pokemon.addVolatile('charged');
				pokemon.itemState.charged = false;
				this.add('-message', `${pokemon.name} absorbed the Cell Battery's charge!`);
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Electric') { 
				if (target.itemState && target.itemState.charged) { // Check if charged (stored in itemState)
					this.add('-message', `${target.name}'s Cell Battery exploded!`);
					const explosionMove = {
						name: 'Cell Battery Explosion',
						type: 'Electric',
						category: 'Special',
						basePower: 40,
						willCrit: false,
						flags: { explosive: 1 },
					};
					for (const pokemon of this.getAllActive()) {
						if (pokemon !== target) {
							const explosionDamage = this.actions.getDamage(target, pokemon, explosionMove as ActiveMove);
							if (explosionDamage) { this.damage(explosionDamage, pokemon, target); }
						}
					}
					const selfDamage = this.actions.getDamage(target, target, explosionMove as ActiveMove);
					if (selfDamage) { this.damage(selfDamage, target); }
					target.useItem();
				} else { // 1st hit - boost stats, give user charge volatile, and charge the item
					this.boost({ atk: 1, spa: 1, spd: 1 }, target);
					target.addVolatile('charge');
					if (!target.itemState) target.itemState = {} as any;
					target.itemState.charged = true;
					this.add('-message', `${target.name}'s Cell Battery is charging!`);
				}
			}
		},
		num: 546,
		gen: 5,
	},
	choiceband: {
		name: "Choice Band",
		itemClass: ['statboost'],
		shortDesc: "1.5x ATK. Holder is locked into the 1st move it chooses.",
		fling: { basePower: 10, },
		onStart(pokemon) {
			if (pokemon.volatiles['choicelock']) { this.debug('removing choicelock'); }
			pokemon.removeVolatile('choicelock');
		},
		onModifyMove(move, pokemon) { pokemon.addVolatile('choicelock'); },
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) { if (pokemon.volatiles['dynamax']) return;
			return this.chainModify(1.5);
		},
		isChoice: true,
		blocksGuardAction: true,
		num: 220,
		gen: 3,
	},
	choicescarf: {
		name: "Choice Scarf",
		itemClass: ['statboost'],
		shortDesc: "1.5x Speed. Holder is locked into the 1st move it chooses.",
		fling: { basePower: 10, },
		onStart(pokemon) {
			if (pokemon.volatiles['choicelock']) { this.debug('removing choicelock'); }
			pokemon.removeVolatile('choicelock');
		},
		onModifyMove(move, pokemon) { pokemon.addVolatile('choicelock'); },
		onModifySpe(spe, pokemon) {
			if (pokemon.volatiles['dynamax']) return;
			return this.chainModify(1.5);
		},
		isChoice: true,
		blocksGuardAction: true,
		num: 287,
		gen: 4,
	},
	dragonorb: {
		name: "Dragon Orb",
		shortDesc: "At the end of every turn, holder is inflicted with Dragonblight.",
		fling: {
			basePower: 30,
			status: 'dragonblight',
		},
		onResidualOrder: 28,
		onResidualSubOrder: 3,
		onResidual(pokemon) { pokemon.trySetStatus('dragonblight', pokemon); },
		num: 272,
		gen: 4,
	},
	ejectbutton: {
		name: "Eject Button",
		itemClass: ['reactive', 'utility'],
		shortDesc: "If holder is hit by an attack, it immediately switches out. 1 time use.",
		fling: { basePower: 30, },
		onAfterMoveSecondaryPriority: 2,
		onAfterMoveSecondary(target, source, move) {
			if (source && source !== target && target.hp && move && move.category !== 'Status' && !move.flags['futuremove']) {
				if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.beingCalledBack || target.isSkyDropped()) return;
				if (target.volatiles['commanding'] || target.volatiles['commanded']) return;
				for (const pokemon of this.getAllActive()) { if (pokemon.switchFlag === true) return; }
				target.switchFlag = true;
				if (target.useItem()) { source.switchFlag = false; } 
				else { target.switchFlag = false; }
			}
		},
		num: 547,
		gen: 5,
	},
	ejectpack: {
		name: "Eject Pack",
		itemClass: ['reactive', 'utility'],
		shortDesc: "If holder's stats are lowered, it immediately switches out. 1 time use.",
		fling: { basePower: 50, },
		onAfterBoost(boost, pokemon) {
			if (this.effectState.eject || this.activeMove?.id === 'partingshot') return;
			for (const i in boost) {
				if (boost[i as BoostID]! < 0) {
					this.effectState.eject = true;
					break;
				}
			}
		},
		onAnySwitchInPriority: -4,
		onAnySwitchIn() { if (!this.effectState.eject) return; (this.effectState.target as Pokemon).useItem(); },
		onAnyAfterMega() { if (!this.effectState.eject) return; (this.effectState.target as Pokemon).useItem(); },
		onAnyAfterMove() { if (!this.effectState.eject) return; (this.effectState.target as Pokemon).useItem(); },
		onResidualOrder: 29,
		onResidual(pokemon) { if (!this.effectState.eject) return; (this.effectState.target as Pokemon).useItem(); },
		onUseItem(item, pokemon) {
			if (!this.canSwitch(pokemon.side)) return false;
			if (pokemon.volatiles['commanding'] || pokemon.volatiles['commanded']) return false;
			for (const active of this.getAllActive()) { if (active.switchFlag === true) return false; }
			return true;
		},
		onUse(pokemon) { pokemon.switchFlag = true; },
		onEnd() { delete this.effectState.eject; },
		onTakeItem(item, source) { return false; },
		num: 1119,
		gen: 8,
	},
	eviolite: {
		name: "Eviolite",
		itemClass: ['statboost'],
		shortDesc: "If holder's species is NOT fully evolved: 1.5x Defense and Sp Def.",
		fling: { basePower: 40, },
		onModifyDefPriority: 2,
		onModifyDef(def, pokemon) { if (pokemon.baseSpecies.nfe) { return this.chainModify(1.5); } },
		onModifySpDPriority: 2,
		onModifySpD(spd, pokemon) { if (pokemon.baseSpecies.nfe) { return this.chainModify(1.5); } },
		num: 538,
		gen: 5,
	},
	expertbelt: {
		name: "Expert Belt",
		itemClass: ['utility'],
		shortDesc: "Holder's super effective attacks are boosed in power 1.3x.",
		fling: { basePower: 10, },
		onModifyDamage(damage, source, target, move) { if (move && target.getMoveHitData(move).typeMod > 0) { return this.chainModify([5325, 4096]); } },
		num: 268,
		gen: 4,
	},
	floatstone: {
		name: "Float Stone",
		itemClass: ['statboost'],
		shortDesc: "1/2 weight, 1.2x Speed. Holder takes 1.2x more damage from Crash and Launch moves.",
		fling: { basePower: 30, },
		onStart(target) { if (!target.ignoringItem()) { this.add('-item', target, 'Float Stone'); } },
		onModifyWeight(weighthg) { return this.trunc(weighthg / 2); },
		onModifySpe(spe) { return this.chainModify(1.2); },
		onSourceModifyDamage(damage, source, target, move) { if (move.flags['crash'] || move.flags['launch'] || move.flags['throw']) { return this.chainModify(1.2); } },
		num: 539,
		gen: 5,
	},
	focusband: {
		name: "Focus Band",
		itemClass: ['utility'],
		shortDesc: "10% chance to survive a lethal hit with 1HP. Replaces user's Guard Action with Endure.",
		fling: { basePower: 10, },
		onDamagePriority: -40,
		onDamage(damage, target, source, effect) {
			if (this.randomChance(1, 10) && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add("-activate", target, "item: Focus Band");
				return target.hp - 1;
			}
		},
		forcedGuardAction: 'endure',
		num: 230,
		gen: 2,
	},
	focussash: {
		name: "Focus Sash",
		itemClass: ['utility'],
		shortDesc: "If holder is at full HP and is hit by an attack that would KO it, it survives with 1HP. 1 time use. Replaces user's Guard Action with Endure.",
		fling: { basePower: 10, },
		onDamagePriority: -40,
		onDamage(damage, target, source, effect) { if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') { if (target.useItem()) { return target.hp - 1; } } },
		forcedGuardAction: 'endure',
		num: 275,
		gen: 4,
	},
	gripclaw: {
		name: "Grip Claw",
		itemClass: ['utility'],
		shortDesc: "At the end of every turn, holder loses 1/6HP. 1.2x power on holder's Claw moves.",
		fling: { basePower: 90, },
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) { this.damage(pokemon.baseMaxhp / 6); },
		onModifyDamage(damage, source, target, move) { if (move.flags['claw']) { return this.chainModify(1.2); } },
		num: 286,
		gen: 4,
	},
	heavydutyboots: { // Hazard Immunity implemented in moves.ts
		name: "Heavy-Duty Boots",
		itemClass: ['utility'],
		shortDesc: "Holder is immune to grounded hazards.",
		fling: { basePower: 80, },
		num: 1120,
		gen: 8,
	},
	ironball: { // airborneness negation implemented in sim/pokemon.js:Pokemon#isGrounded
		name: "Iron Ball",
		shortDesc: "Holder's weight increases by 35 kg. Holder becomes grounded and is prevented from using Airborne moves. Speed reduction varies by weight ratio and type (100%-50% based on species weight; Bug types carry 4x weight, Fighting/Dragon 2x, Flying 0.5x).",
		fling: { basePower: 130, },
		onDisableMove(pokemon) { for (const moveSlot of pokemon.moveSlots) { if (this.dex.moves.get(moveSlot.id).flags['gravity']) { pokemon.disableMove(moveSlot.id); } } },
		onEffectiveness(typeMod, target, type, move) {
			if (!target) return;
			if (target.volatiles['ingrain'] || target.volatiles['smackdown'] || this.field.getPseudoWeather('gravity')) return;
			if (move.type === 'Ground' && target.hasType('Flying')) return 0;
		},
		onModifyWeight(weighthg) { return weighthg + 35; },
		onModifySpe(spe, pokemon) {
			// Calculate speed reduction based on percentage of Iron Ball's weight relative to Pokémon's base weight
			// Type modifiers to mimic irl strength differences
			const ballWeight = 35;
			let baseWeight = pokemon.baseSpecies.weightkg;
			if (pokemon.hasType('Bug')) { baseWeight *= 4; } 
			else if (pokemon.hasType('Fighting') || pokemon.hasType('Dragon')) { baseWeight *= 2; } 
			else if (pokemon.hasType('Flying')) { baseWeight *= 0.5; }
			const weightRatio = ballWeight / baseWeight;
			let speedMultiplier = 1;
			if (weightRatio >= 2) { speedMultiplier = 1; } 
			else if (weightRatio >= 1.5) { speedMultiplier = 0.9; } 
			else if (weightRatio >= 1) { speedMultiplier = 0.8; } 
			else if (weightRatio >= 0.75) { speedMultiplier = 0.7; } 
			else if (weightRatio >= 0.5) { speedMultiplier = 0.5; }
			
			return this.chainModify(speedMultiplier);
		},
		num: 278,
		gen: 4,
	},
	laggingtail: {
		name: "Lagging Tail",
		shortDesc: "Holder moves last in its priority bracket.",
		fling: { basePower: 10, },
		onFractionalPriority: -0.1,
		num: 279,
		gen: 4,
	},
	leftovers: {
		name: "Leftovers",
		itemClass: ['healing'],
		shortDesc: "At the end of every turn, holder Heals 1/16HP.",
		fling: { basePower: 10, },
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) { this.heal(pokemon.baseMaxhp / 16); },
		num: 234,
		gen: 2,
	},
	lifeorb: {
		name: "Life Orb",
		itemClass: ['statboost'],
		shortDesc: "Holder's attacks have 1.3x power, and it loses 1/10 itsHP after the attack.",
		fling: { basePower: 30, },
		onModifyDamage(damage, source, target, move) { return this.chainModify([5324, 4096]); },
		onAfterMoveSecondarySelf(source, target, move) { if (source && source !== target && move && move.category !== 'Status' && !source.forceSwitchFlag) { this.damage(source.baseMaxhp / 10, source, source, this.dex.items.get('lifeorb')); } },
		num: 270,
		gen: 4,
	},
	loadeddice: { // partially implemented in sim/battle-actions.ts:BattleActions#hitStepMoveHitLoop
		name: "Loaded Dice",
		itemClass: ['utility'],
		shortDesc: "Holder's multi-hit moves always hit the maximum number of times. No accuracy checks on multi-hit moves.",
		fling: { basePower: 30, },
		onModifyMove(move) { if (move.multiaccuracy) { delete move.multiaccuracy; } },
		num: 1886,
		gen: 9,
	},
	luminousmoss: {
		name: "Luminous Moss",
		itemClass: ['statboost', 'reactive', 'weather'],
		shortDesc: "1.2x power on holder's Light moves. If hit by Water-type move or in rain, raises Sp Def 1 stage [2 when charged] and consumes item; If holder is hight by a Light move, item is charged.",
		fling: { basePower: 30, },
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) { if (move.flags['light']) { return this.chainModify(1.2); } },
		onDamagingHit(damage, target, source, move) {
			// Check if hit by Water-type move or if it's raining, or if hit by a Light move (charges the item)
			if (move.type === 'Water' || this.field.isWeather('raindance') || this.field.isWeather('primordialsea')) {
				const boost = { spd: target.itemState?.charged ? 2 : 1 };
				this.boost(boost, target);
				target.useItem();
			} else if (move.flags['light']) {
				if (!target.itemState) target.itemState = {} as any;
				target.itemState.charged = true;
				this.add('-message', `${target.name}'s Luminous Moss is flourishing!`);
			}
		},
		num: 648,
		gen: 6,
	},
	mentalherb: {
		name: "Mental Herb",
		itemClass: ['consumable', 'statuscure'],
		shortDesc: "Cures holder of infatuated, taunted, encored, tormented, disabled, or heal blocked. 1 time use.",
		fling: {
			basePower: 10,
			effect(pokemon) {
				const conditions = ['attract', 'taunt', 'encore', 'torment', 'disable', 'healblock'];
				for (const FirstCondition of conditions) {
					if (pokemon.volatiles[FirstCondition]) { for (const SecondCondition of conditions) {
							pokemon.removeVolatile(SecondCondition);
							if (FirstCondition === 'attract' && SecondCondition === 'attract') { this.add('-end', pokemon, 'move: Attract', '[from] item: Mental Herb'); }
						} return;
					}
				}
			},
		},
		onUpdate(pokemon) {
			const conditions = ['attract', 'taunt', 'encore', 'torment', 'disable', 'healblock'];
			for (const FirstCondition of conditions) {
				if (pokemon.volatiles[FirstCondition]) {
					if (!pokemon.useItem()) return;
					for (const SecondCondition of conditions) { 
						pokemon.removeVolatile(SecondCondition);
						if (FirstCondition === 'attract' && SecondCondition === 'attract') { this.add('-end', pokemon, 'move: Attract', '[from] item: Mental Herb'); }
					} return;
				}
			}
		},
		num: 219,
		gen: 3,
	},
	metronome: {
		name: "Metronome",
		itemClass: ['utility'],
		shortDesc: "Damage of moves used on consecutive turns is increased by 30% per use, up to 150% (5 consecutive uses). Resets when a different move is used.",
		fling: { basePower: 30, },
		onStart(pokemon) { pokemon.addVolatile('metronome'); },
		condition: {
			onStart(pokemon) {
				this.effectState.lastMove = '';
				this.effectState.numConsecutive = 0;
			},
			onTryMovePriority: -2,
			onTryMove(pokemon, target, move) {
				if (!pokemon.hasItem('metronome')) { pokemon.removeVolatile('metronome');
					return;
				}
				if (move.callsMove) return;
				// Counter doesn't reset due to move failing or switching - only track when it's the same move
				if (this.effectState.lastMove === move.id) { this.effectState.numConsecutive++; } 
				else { this.effectState.numConsecutive = 1; }
				this.effectState.lastMove = move.id;
			},
			onModifyDamage(damage, source, target, move) { // 30% stacking bonus per consecutive use, max 5x (2.5x = 1 + 0.3 * 5 consecutive uses)
				const maxConsecutive = 5;
				const numConsecutive = Math.min(this.effectState.numConsecutive, maxConsecutive);
				const multiplier = 1 + (0.3 * (numConsecutive - 1));
				this.debug(`Current Metronome boost: ${multiplier}x (${numConsecutive} consecutive)`);
				return this.chainModify(multiplier);
			},
		},
		num: 277,
		gen: 4,
	},
	mirrorherb: {
		name: "Mirror Herb",
		itemClass: ['consumable', 'statboost'],
		shortDesc: "When an opponent raises its stats, holder copies all positive stat boosts. 1 time use.",
		fling: { basePower: 30, },
		onFoeAfterBoost(boost, target, source, effect) {
			if (effect?.name === 'Opportunist' || effect?.name === 'Mirror Herb') return;
			if (!this.effectState.boosts) this.effectState.boosts = {} as SparseBoostsTable;
			const boostPlus = this.effectState.boosts;
			for (const i in boost) {
				if (boost[i as BoostID]! > 0) {
					boostPlus[i as BoostID] = (boostPlus[i as BoostID] || 0) + boost[i as BoostID]!;
					this.effectState.ready = true;
				}
			}
		},
		onAnySwitchInPriority: -3,
		onAnySwitchIn() { if (!this.effectState.ready) return; (this.effectState.target as Pokemon).useItem(); },
		onAnyAfterMega() { if (!this.effectState.ready) return; (this.effectState.target as Pokemon).useItem(); },
		onAnyAfterTerastallization() { if (!this.effectState.ready) return; (this.effectState.target as Pokemon).useItem(); },
		onAnyAfterMove() { if (!this.effectState.ready) return; (this.effectState.target as Pokemon).useItem(); },
		onResidualOrder: 29,
		onResidual(pokemon) { if (!this.effectState.ready) return; (this.effectState.target as Pokemon).useItem(); },
		onUse(pokemon) { this.boost(this.effectState.boosts, pokemon); },
		onEnd() {
			delete this.effectState.boosts;
			delete this.effectState.ready;
		},
		num: 1883,
		gen: 9,
	},
	muscleband: {
		name: "Muscle Band",
		itemClass: ['statboost'],
		shortDesc: "Holder's physical attacks have 1.1x power.",
		fling: { basePower: 10, },
		onBasePowerPriority: 16,
		onBasePower(basePower, user, target, move) { if (move.category === 'Physical') { return this.chainModify([4505, 4096]); } },
		num: 266,
		gen: 4,
	},
	protectivepads: { // protective effect handled in Battle#checkMoveMakesContact
		name: "Protective Pads",
		itemClass: ['utility'],
		shortDesc: "Holder's contact moves do not activate contact effects. Recoil and crash damage is halved.",
		fling: { basePower: 30, },
		onDamagePriority: -40,
		onDamage(damage, target, source, effect) { if (effect && (effect.id === 'recoil' || effect.id === 'crash')) { return Math.ceil(damage * 0.5); } },
		onModifyGuardAction(guardActionId, pokemon) { if (guardActionId === 'guard') return 'guardlv2'; },
		num: 880,
		gen: 7,
	},
	punchingglove: {
		name: "Punching Glove",
		itemClass: ['utility'],
		shortDesc: "Holder's Punch moves have 1.2x power and do not make contact. Damage taken from Punch moves is halved.",
		fling: { basePower: 30, },
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Punching Glove boost');
				return this.chainModify(1.2);
			}
		},
		onModifyMovePriority: 1,
		onModifyMove(move) { if (move.flags['punch']) delete move.flags['contact']; },
		onSourceModifyDamage(damage, source, target, move) { if (move.flags['punch']) return this.chainModify(0.5); },
		num: 1884,
		gen: 9,
	},
	quickclaw: {
		name: "Quick Claw",
		itemClass: ['utility'],
		shortDesc: "Holder has a 20% chance to move 1st in its priority bracket.",
		fling: { basePower: 80, },
		onFractionalPriorityPriority: -2,
		onFractionalPriority(priority, pokemon, target, move) {
			if (move.category === "Status" && (pokemon.ability1 === "myceliummight" || pokemon.ability2 === "myceliummight")) return;
			if (priority <= 0 && this.randomChance(1, 5)) { 
				this.add('-activate', pokemon, 'item: Quick Claw');
				return 0.1;
			}
		},
		num: 217,
		gen: 2,
	},
	redcard: {
		name: "Red Card",
		itemClass: ['consumable', 'utility'],
		shortDesc: "If holder is hit by an attack, the attacker is forced to switch out. 1 time use.",
		fling: { basePower: 10, },
		onAfterMoveSecondary(target, source, move) {
			if (source && source !== target && source.hp && target.hp && move && move.category !== 'Status') {
				if (!source.isActive || !this.canSwitch(source.side) || source.forceSwitchFlag || target.forceSwitchFlag) { return; }
				if (target.useItem(source)) { if (this.runEvent('DragOut', source, target, move)) { source.forceSwitchFlag = true; } }
			} // The item is used up even against a pokemon with Ingrain or that otherwise can't be forced out
		},
		num: 542,
		gen: 5,
	},
	ringtarget: {
		name: "Ring Target",
		shortDesc: "Holder's type immunities are negated.",
		fling: { basePower: 10, },
		onNegateImmunity: false,
		num: 543,
		gen: 5,
	},
	rockyhelmet: {
		name: "Rocky Helmet",
		itemClass: ['reactive'],
		shortDesc: "If holder is hit by a contact move, the attacker loses 1/6HP.",
		fling: { basePower: 60, },
		onDamagingHitOrder: 2,
		onDamagingHit(damage, target, source, move) { if (this.checkMoveMakesContact(move, source, target)) { this.damage(source.baseMaxhp / 6, source, target); } },
		num: 540,
		gen: 5,
	},
	roomservice: {
		name: "Room Service",
		itemClass: ['healing', 'utility'],
		shortDesc: "While Trick Room, Magic Room, or Wonder Room is active, holder moves 1st in its priority bracket; otherwise moves last. While room is active, heals ally 1/16HP each turn.",
		fling: { basePower: 100, },
		onFractionalPriorityPriority: -2,
		onFractionalPriority(priority, pokemon) { // Under Trick Room, Magic Room, or Wonder Room: moves 1st in priority bracket, moves last otherwise
			const hasRoom = this.field.getPseudoWeather('trickroom') || this.field.getPseudoWeather('magicroom') || this.field.getPseudoWeather('wonderroom');
			if (hasRoom) { return 0.1; } 
			else { return -0.1;  }
		},
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) { const hasRoom = this.field.getPseudoWeather('trickroom') || this.field.getPseudoWeather('magicroom') || this.field.getPseudoWeather('wonderroom');
			if (hasRoom) { 
				const ally = pokemon.side.active.find(p => p && p !== pokemon && p.hp);
				if (ally) {
					this.heal(ally.baseMaxhp / 16, ally);
					this.add('-activate', pokemon, 'item: Room Service');
				} 
			}
		},
		num: 1122,
		gen: 8,
	},
	safetygoggles: {
		name: "Safety Goggles",
		itemClass: ['weather'],
		shortDesc: "Holder is immune to powder moves and damage from Sandstorm or Hail.",
		fling: { basePower: 80, },
		onImmunity(type, pokemon) { if (type === 'sandstorm' || type === 'hail' || type === 'powder') return false; },
		onTryHit(pokemon, source, move) { 
			if (move.flags['powder'] && pokemon !== source && this.dex.getImmunity('powder', pokemon)) { 
				this.add('-activate', pokemon, 'item: Safety Goggles', move.name);
				return null;
			}
		},
		num: 650,
		gen: 6,
	},
	scopelens: {
		name: "Scope Lens",
		itemClass: ['statboost'],
		shortDesc: "Holder's critical hit ratio is raised 4 stages.",
		fling: { basePower: 30, },
		onModifyCritRatio(critRatio) { return critRatio + 4; },
		num: 232,
		gen: 2,
	},
	shedshell: {
		name: "Shed Shell",
		itemClass: ['utility'],
		shortDesc: "Holder may switch out even when trapped.",
		fling: { basePower: 10, },
		onTrapPokemonPriority: -10,
		onTrapPokemon(pokemon) { pokemon.trapped = false; },
		onMaybeTrapPokemonPriority: -10,
		onMaybeTrapPokemon(pokemon) { pokemon.maybeTrapped = false; },
		num: 295,
		gen: 4,
	},
	shellbell: {
		name: "Shell Bell",
		itemClass: ['healing'],
		shortDesc: "After an attack, holder Heals 1/5 of the damage dealt inHP.",
		fling: { basePower: 30, },
		onAfterMoveSecondarySelfPriority: -1,
		onAfterMoveSecondarySelf(pokemon, target, move) { if (move.totalDamage && !pokemon.forceSwitchFlag) { this.heal(move.totalDamage / 5, pokemon); } },
		num: 253,
		gen: 3,
	},
	stickybarb: {
		name: "Sticky Barb",
		itemClass: ['reactive'],
		shortDesc: "At the end of every turn, holder loses 1/8HP. If hit by a contact move, attacker loses 1/6HP and receives the barb if it has no item.",
		fling: { basePower: 80, },
		onResidualOrder: 28,
		onResidualSubOrder: 3,
		onResidual(pokemon) { this.damage(pokemon.baseMaxhp / 8); },
		onHit(target, source, move) {
			if (source && source !== target && move && this.checkMoveMakesContact(move, source, target)) {
				this.damage(source.baseMaxhp / 6, source, target);
				if (!source.item) { // Transfer item if attacker has no item
					const barb = target.takeItem();
					if (!barb) return;
					source.setItem(barb);
				}
			}
		},
		num: 288,
		gen: 4,
	},
	throatspray: {
		name: "Throat Spray",
		itemClass: ['consumable', 'statboost'],
		shortDesc: "Raises holder's Sp Atk 1 stage if it uses a sound move. 1 time use.",
		fling: { basePower: 30, },
		onAfterMoveSecondarySelf(target, source, move) { if (move.flags['sound']) { target.useItem(); } },
		boosts: { spa: 1, },
		num: 1118,
		gen: 8,
	},
	toxicorb: {
		name: "Toxic Orb",
		shortDesc: "At the end of every turn, holder becomes badly poisoned.",
		fling: {
			basePower: 30,
			status: 'tox',
		},
		onResidualOrder: 28,
		onResidualSubOrder: 3,
		onResidual(pokemon) { pokemon.trySetStatus('tox', pokemon); },
		num: 272,
		gen: 4,
	},
	utilityumbrella: {
		name: "Utility Umbrella",
		itemClass: ['reactive', 'weather'],
		shortDesc: "Holder is immune to weather effects. Beam, breath, and pulse moves against holder deal 0.8x damage. If hit by launch move, holder becomes airborne. Breaks if hit by a critical beam, breath, or pulse move.",
		fling: { basePower: 60, },
		// Partially implemented in Pokemon.effectiveWeather() in sim/pokemon.ts
		onStart(pokemon) { 
			if (!pokemon.ignoringItem()) return;
			if (['sunnyday', 'raindance', 'desolateland', 'primordialsea', 'hail'].includes(this.field.effectiveWeather())) { this.runEvent('WeatherChange', pokemon, pokemon, this.effect); }
		},
		onUpdate(pokemon) { 
			if (!this.effectState.inactive) return;
			this.effectState.inactive = false;
			if (['sunnyday', 'raindance', 'desolateland', 'primordialsea', 'hail'].includes(this.field.effectiveWeather())) { this.runEvent('WeatherChange', pokemon, pokemon, this.effect); }
		},
		onEnd(pokemon) {
			if (['sunnyday', 'raindance', 'desolateland', 'primordialsea', 'hail'].includes(this.field.effectiveWeather())) { this.runEvent('WeatherChange', pokemon, pokemon, this.effect); }
			this.effectState.inactive = true;
		},
		onSourceModifyDamage(damage, source, target, move) { if (move.flags['beam'] || move.flags['breath'] || move.flags['pulse']) { return this.chainModify(0.8); } },
		// If holder is hit by a Launch move, user is airborne till the end of the turn
		onDamagingHit(damage, target, source, move) {
			if (move.flags['launch']) { target.addVolatile('airborne'); }
			// Break item on crit from Beam, Breath, or Pulse moves
			if ((move.flags['beam'] || move.flags['breath'] || move.flags['pulse']) && move.willCrit) {
				this.add('-enditem', target, 'Utility Umbrella', '[broken]');
				target.setItem('');
			}
		},
		num: 1123,
		gen: 8,
	},
	weaknesspolicy: {
		name: "Weakness Policy",
		itemClass: ['consumable', 'reactive', 'statboost'],
		shortDesc: "If holder is hit by a super effective attack, its Attack and Sp Atk raise 2 stages. 1 time use.",
		fling: { basePower: 80, },
		onDamagingHit(damage, target, source, move) { if (!move.damage && !move.damageCallback && target.getMoveHitData(move).typeMod > 0) { target.useItem(); } },
		boosts: {
			atk: 2,
			spa: 2,
		},
		num: 639,
		gen: 6,
	},
	whiteherb: {
		name: "White Herb",
		itemClass: ['consumable', 'utility'],
		shortDesc: "Heals all lowered stats to 0 when any stat is lowered. 1 time use.",
		fling: {
			basePower: 10,
			effect(pokemon) {
				let activate = false;
				const boosts: SparseBoostsTable = {};
				for (const i in pokemon.boosts) {
					if (pokemon.boosts[i as BoostID] < 0) {
						activate = true;
						boosts[i as BoostID] = 0;
					}
				}
				if (activate) {
					pokemon.setBoost(boosts);
					this.add('-clearnegativeboost', pokemon, '[silent]');
				}
			},
		},
		onStart(pokemon) {
			this.effectState.boosts = {} as SparseBoostsTable;
			let ready = false;
			for (const i in pokemon.boosts) {
				if (pokemon.boosts[i as BoostID] < 0) {
					ready = true;
					this.effectState.boosts[i as BoostID] = 0;
				}
			}
			if (ready) (this.effectState.target as Pokemon).useItem();
			delete this.effectState.boosts;
		},
		onAnySwitchInPriority: -2,
		onAnySwitchIn() { ((this.effect as any).onStart as (p: Pokemon) => void).call(this, this.effectState.target); },
		onAnyAfterMega() { ((this.effect as any).onStart as (p: Pokemon) => void).call(this, this.effectState.target); },
		onAnyAfterMove() { ((this.effect as any).onStart as (p: Pokemon) => void).call(this, this.effectState.target); },
		onResidualOrder: 29,
		onResidual(pokemon) { ((this.effect as any).onStart as (p: Pokemon) => void).call(this, pokemon); },
		onUse(pokemon) {
			pokemon.setBoost(this.effectState.boosts);
			this.add('-clearnegativeboost', pokemon, '[silent]');
		},
		num: 214,
		gen: 3,
	},
	widelens: {
		name: "Wide Lens",
		itemClass: ['statboost'],
		shortDesc: "Holder's move accuracy is 1.1x.",
		fling: { basePower: 10, },
		onSourceModifyAccuracyPriority: -2,
		onSourceModifyAccuracy(accuracy) { if (typeof accuracy === 'number') { return this.chainModify([4505, 4096]); } },
		num: 265,
		gen: 4,
	},
	wiseglasses: {
		name: "Wise Glasses",
		itemClass: ['statboost'],
		shortDesc: "Holder's special attacks have 1.1x power.",
		fling: { basePower: 10, },
		onBasePowerPriority: 16,
		onBasePower(basePower, user, target, move) { if (move.category === 'Special') { return this.chainModify([4505, 4096]); } },
		num: 267,
		gen: 4,
	},
	zoomlens: {
		name: "Zoom Lens",
		itemClass: ['statboost'],
		shortDesc: "Holder's move accuracy is 1.2x if holder moves after target.",
		fling: { basePower: 10, },
		onSourceModifyAccuracyPriority: -2,
		onSourceModifyAccuracy(accuracy, target) {
			if (typeof accuracy === 'number' && !this.queue.willMove(target)) {
				this.debug('Zoom Lens boosting accuracy');
				return this.chainModify([4915, 4096]);
			}
		},
		num: 276,
		gen: 4,
	},
	// #region Weather/Terrain
	damprock: {
		name: "Damp Rock",
		itemClass: ['weather'],
		shortDesc: "Holder's use of Rain Dance lasts 8 turns instead of 5.",
		fling: { basePower: 60, },
		num: 285,
		gen: 4,
	},
	heatrock: {
		name: "Heat Rock",
		itemClass: ['weather'],
		shortDesc: "Holder's use of Sunny Day lasts 8 turns instead of 5.",
		fling: { basePower: 60, },
		num: 284,
		gen: 4,
	},
	icyrock: {
		name: "Icy Rock",
		itemClass: ['weather'],
		shortDesc: "Holder's use of Hail or Snowscape lasts 11 turns instead of 7.",
		fling: { basePower: 40, },
		num: 282,
		gen: 4,
	},
	smoothrock: {
		name: "Smooth Rock",
		itemClass: ['weather'],
		shortDesc: "Holder's use of Sandstorm lasts 11 turns instead of 7.",
		fling: {
			basePower: 10,
		},
		num: 283,
		gen: 4,
	},
	aeolicrock: {
		name: "Aeolic Rock",
		itemClass: ['weather'],
		shortDesc: "Holder's use of Turbulent Winds lasts 11 turns instead of 7.",
		fling: {
			basePower: 60,
		},
		num: 12000,
		gen: 9,
	},
	terrainextender: { // implemented in conditions.t9ol
		name: "Terrain Extender",
		itemClass: ['terrain'],
		shortDesc: "Holder's use of terrain moves lasts 8 turns instead of 5. Fragile.",
		fling: { basePower: 60, },
		isFragile: true,
		onFragileBreak() { },
		num: 879,
		gen: 7,
	},
	electricseed: {
		name: "Electric Seed",
		itemClass: ['statboost', 'terrain'],
		shortDesc: "Raises holder's Defense 1 stage when Electric Terrain is active. 1 time use.",
		fling: { basePower: 10, },
		onSwitchInPriority: -1,
		onStart(pokemon) { if (!pokemon.ignoringItem() && this.field.isTerrain('electricterrain')) { pokemon.useItem(); } },
		onTerrainChange(pokemon) { if (this.field.isTerrain('electricterrain')) { pokemon.useItem(); } },
		boosts: { def: 1, },
		num: 881,
		gen: 7,
	},
	grassyseed: {
		name: "Grassy Seed",
		itemClass: ['statboost', 'terrain'],
		shortDesc: "Raises holder's Defense 1 stage when Grassy Terrain is active. 1 time use.",
		fling: { basePower: 10, },
		onSwitchInPriority: -1,
		onStart(pokemon) { if (!pokemon.ignoringItem() && this.field.isTerrain('grassyterrain')) { pokemon.useItem(); } },
		onTerrainChange(pokemon) { if (this.field.isTerrain('grassyterrain')) { pokemon.useItem(); } },
		boosts: { def: 1, },
		num: 884,
		gen: 7,
	},
	mistyseed: {
		name: "Misty Seed",
		itemClass: ['statboost', 'terrain'],
		shortDesc: "Raises holder's Sp Def 1 stage when Misty Terrain is active. 1 time use.",
		fling: { basePower: 10,},
		onSwitchInPriority: -1,
		onStart(pokemon) { if (!pokemon.ignoringItem() && this.field.isTerrain('mistyterrain')) { pokemon.useItem(); } },
		onTerrainChange(pokemon) { if (this.field.isTerrain('mistyterrain')) { pokemon.useItem(); } },
		boosts: { spd: 1, },
		num: 883,
		gen: 7,
	},
	psychicseed: {
		name: "Psychic Seed",
		itemClass: ['statboost', 'terrain'],
		shortDesc: "Raises holder's Sp Def 1 stage when Psychic Terrain is active. 1 time use.",
		fling: { basePower: 10, },
		onSwitchInPriority: -1,
		onStart(pokemon) { if (!pokemon.ignoringItem() && this.field.isTerrain('psychicterrain')) { pokemon.useItem(); } },
		onTerrainChange(pokemon) { if (this.field.isTerrain('psychicterrain')) { pokemon.useItem(); } },
		boosts: { spd: 1, },
		num: 882,
		gen: 7,
	},
	toxicseed: {
		name: "Toxic Seed",
		itemClass: ['statboost', 'terrain'],
		shortDesc: "Raises holder's Sp Def 1 stage when Toxic Terrain is active. 1 time use.",
		fling: { basePower: 10, },
		onSwitchInPriority: -1,
		onStart(pokemon) { if (!pokemon.ignoringItem() && this.field.isTerrain('toxicterrain')) { pokemon.useItem(); } },
		onTerrainChange(pokemon) { if (this.field.isTerrain('toxicterrain')) { pokemon.useItem(); } },
		boosts: { spd: 1, },
		gen: 9,
	},
	// #region Signature Items
	adamantcrystal: {
		name: "Adamant Crystal",
		itemClass: ['species', 'statboost'],
		shortDesc: "If held by Dialga, its Steel- and Dragon-type attacks have 1.35x power, and transforms it into Dialga-Origin.",
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.num === 483 && (move.type === 'Steel' || move.type === 'Dragon')) {
				return this.chainModify([5529, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if (source?.baseSpecies.num === 483 || pokemon.baseSpecies.num === 483) {
				return false;
			}
			return true;
		},
		forcedForme: "Dialga-Origin",
		itemUser: ["Dialga-Origin"],
		num: 1777,
		gen: 8,
	},
	adamantorb: {
		name: "Adamant Orb",
		itemClass: ['species', 'statboost'],
		shortDesc: "If held by Dialga, its Steel- and Dragon-type attacks have 1.35x power.",
		fling: { basePower: 60, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (user.baseSpecies.num === 483 && (move.type === 'Steel' || move.type === 'Dragon')) { 
			return this.chainModify([5529, 4096]); } },
		num: 135,
		gen: 4,
	},
	caphchassis: {
		name: "Caph Chassis",
		itemClass: ['species',],
		shortDesc: "If held by Revavroom, Transforms it into Revavroom-Caph",
		fling: { basePower: 120, },
		num: 12100,
		gen: 9,
	},
	cornerstonemask: {
		name: "Cornerstone Mask",
		itemClass: ['species'],
		shortDesc: "If held by Ogerpon, 1.2x power of Weapon moves, transforms it into Ogerpon-Cornerstone, changes holder's Tera type to Rock. When Terastallized: Ability 2 is replaced with Embody Aspect [Cornerstone].",
		fling: { basePower: 60, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (user.baseSpecies.name.startsWith('Ogerpon-Cornerstone') && move.flags['weapon']) { return this.chainModify([4915, 4096]); } },
		onTakeItem(item, source) { if (source.baseSpecies.baseSpecies === 'Ogerpon') return false;
			return true;
		},
		forcedForme: "Ogerpon-Cornerstone",
		itemUser: ["Ogerpon-Cornerstone"],
		num: 2406,
		gen: 9,
	},
	griseouscore: {
		name: "Griseous Core",
		itemClass: ['species', 'statboost'],
		shortDesc: "If held by Giratina, its Ghost- and Dragon-type attacks have 1.35x power, and transforms it into Giratina-Origin.",
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (user.baseSpecies.num === 487 && (move.type === 'Ghost' || move.type === 'Dragon')) { return this.chainModify([5529, 4096]); } },
		onTakeItem(item, pokemon, source) { if (source?.baseSpecies.num === 487 || pokemon.baseSpecies.num === 487) { return false; }
			return true;
		},
		forcedForme: "Giratina-Origin",
		itemUser: ["Giratina-Origin"],
		num: 1779,
		gen: 8,
	},
	griseousorb: {
		name: "Griseous Orb",
		itemClass: ['species', 'statboost'],
		shortDesc: "If held by Giratina, its Ghost- and Dragon-type attacks have 1.35x power.",
		fling: { basePower: 60, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (user.baseSpecies.num === 487 && (move.type === 'Ghost' || move.type === 'Dragon')) { return this.chainModify([5529, 4096]); } },
		itemUser: ["Giratina"],
		num: 112,
		gen: 4,
	},
	hearthflamemask: {
		name: "Hearthflame Mask",
		itemClass: ['species'],
		shortDesc: "If held by Ogerpon, 1.2x power of Weapon moves, transforms it into Ogerpon-Hearthflame, changes holder's Tera type to Fire. When Terastallized: Ability 2 is replaced with Embody Aspect [Hearthflame].",
		fling: { basePower: 60, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (user.baseSpecies.name.startsWith('Ogerpon-Hearthflame') && move.flags['weapon']) { return this.chainModify([4915, 4096]); } },
		onTakeItem(item, source) { if (source.baseSpecies.baseSpecies === 'Ogerpon') return false;
			return true;
		},
		forcedForme: "Ogerpon-Hearthflame",
		itemUser: ["Ogerpon-Hearthflame"],
		num: 2408,
		gen: 9,
	},
	lustrousglobe: {
		name: "Lustrous Globe",
		itemClass: ['species', 'statboost'],
		shortDesc: "If held by Palkia, its Water- and Dragon-type attacks have 1.35x power, and transforms it into Palkia-Origin.",
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (user.baseSpecies.num === 484 && (move.type === 'Water' || move.type === 'Dragon')) { return this.chainModify([5529, 4096]); } },
		onTakeItem(item, pokemon, source) {
			if (source?.baseSpecies.num === 484 || pokemon.baseSpecies.num === 484) { return false; }
			return true;
		},
		forcedForme: "Palkia-Origin",
		itemUser: ["Palkia-Origin"],
		num: 1778,
		gen: 8,
	},
	lustrousorb: {
		name: "Lustrous Orb",
		itemClass: ['species', 'statboost'],
		shortDesc: "If held by Palkia, its Water- and Dragon-type attacks have 1.35x power.",
		fling: { basePower: 60, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (user.baseSpecies.num === 484 && (move.type === 'Water' || move.type === 'Dragon')) { return this.chainModify([5529, 4096]); } },
		itemUser: ["Palkia"],
		num: 136,
		gen: 4,
	},
	lightball: {
		name: "Light Ball",
		itemClass: ['species', 'statboost'],
		shortDesc: "If held by Pikachu, its Attack and Sp Atk are doubled. Boosts light moves 1.5x.",
		fling: {
			basePower: 30,
			status: 'par',
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) { if (pokemon.baseSpecies.baseSpecies === 'Pikachu') { return this.chainModify(2); } },
		onModifySpAPriority: 1,
		onModifySpA(spa, pokemon) { if (pokemon.baseSpecies.baseSpecies === 'Pikachu') { return this.chainModify(2); } },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.flags['light']) { return this.chainModify(1.5); } },
		itemUser: ["Pikachu", "Pikachu-Cosplay", "Pikachu-Rock-Star", "Pikachu-Belle", "Pikachu-Pop-Star", "Pikachu-PhD", "Pikachu-Libre", "Pikachu-Original", "Pikachu-Hoenn", "Pikachu-Sinnoh", "Pikachu-Unova", "Pikachu-Kalos", "Pikachu-Alola", "Pikachu-Partner", "Pikachu-Starter", "Pikachu-World"],
		num: 236,
		gen: 2,
	},
	navichassis: {
		name: "Navi Chassis",
		itemClass: ['species',],
		shortDesc: "If held by Revavroom, Transforms it into Revavroom-Navi",
		fling: { basePower: 120, },
		num: 12101,
		gen: 9,
	},
	ruchbahchassis: {
		name: "Ruchbah Chassis",
		itemClass: ['species',],
		shortDesc: "If held by Revavroom, Transforms it into Revavroom-Ruchbah",
		fling: { basePower: 120, },
		num: 12102,
		gen: 9,
	},
	rustedshield: {
		name: "Rusted Shield",
		itemClass: ['species'],
		shortDesc: "If held by Zamazenta, this item transforms it into its Crowned Forme.",
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 889) || pokemon.baseSpecies.num === 889) { return false; }
			return true;
		},
		onWeaponBreak(pokemon) {
			this.add('-message', `${pokemon.name}'s Rusted Shield ran out of energy!`);
			this.add('-enditem', pokemon, 'Rusted Shield', '[from] weapon break');
			pokemon.item = '';
			pokemon.itemState = this.initEffectState({ id: '', target: pokemon });
			if (pokemon.species.id === 'zamazentacrowned') { pokemon.formeChange('Zamazenta', this.effect, true); }
		},
		itemUser: ["Zamazenta-Crowned"],
		num: 1104,
		gen: 8,
	},
	rustedsword: {
		name: "Rusted Sword",
		itemClass: ['species'],
		shortDesc: "If held by Zacian, this item transforms it into its Crowned Forme.",
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 888) || pokemon.baseSpecies.num === 888) { return false; }
			return true;
		},
		onWeaponBreak(pokemon) {
			this.add('-message', `${pokemon.name}'s Rusted Sword ran out of energy!`);
			this.add('-enditem', pokemon, 'Rusted Sword', '[from] weapon break');
			pokemon.item = '';
			pokemon.itemState = this.initEffectState({ id: '', target: pokemon });
			if (pokemon.species.id === 'zaciancrowned') { pokemon.formeChange('Zacian', this.effect, true); }
		},
		itemUser: ["Zacian-Crowned"],
		num: 1103,
		gen: 8,
	},
	schedarchassis: {
		name: "Schedar Chassis",
		itemClass: ['species',],
		shortDesc: "If held by Revavroom, Transforms it into Revavroom-Schedar",
		fling: { basePower: 120, },
		num: 12103,
		gen: 9,
	},
	seginchassis: {
		name: "Segin Chassis",
		itemClass: ['species',],
		shortDesc: "If held by Revavroom, Transforms it into Revavroom-Segin",
		fling: { basePower: 120, },
		num: 12104,
		gen: 9,
	},
	souldew: {
		name: "Soul Dew",
		itemClass: ['species', 'statboost'],
		shortDesc: "If held by Latios or Latias: 1.35x power for Psychic, Dragon, Aura moves. Protects their Ability.",
		fling: { basePower: 30, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if ((user.baseSpecies.num === 380 || user.baseSpecies.num === 381) && (move.type === 'Psychic' || move.type === 'Dragon' || move.flags['aura'])) { return this.chainModify([5529, 4096]); } },
		onSetAbility(ability, target, source, effect) {
			if ((target.baseSpecies.num === 380 || target.baseSpecies.num === 381) && source && source !== target) {
				this.add('-fail', target, 'move: ' + (effect?.name || 'Ability Change'));
				return null;
			}
		},
		itemUser: ["Latios", "Latias"],
		num: 225,
		gen: 3,
	},
	thickclub: {
		name: "Thick Club",
		itemClass: ['species', 'statboost'],
		shortDesc: "If held by Cubone or Marowak, its Attack is doubled.",
		fling: { basePower: 90, },
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) { if (pokemon.baseSpecies.baseSpecies === 'Cubone' || pokemon.baseSpecies.baseSpecies === 'Marowak') { return this.chainModify(2); } },
		itemUser: ["Marowak", "Marowak-Alola", "Cubone"],
		num: 258,
		gen: 2,
	},
	wellspringmask: {
		name: "Wellspring Mask",
		itemClass: ['species'],
		shortDesc: "If held by Ogerpon, 1.2x power of Weapon moves, transforms it into Ogerpon-Wellspring, changes holder's Tera type to Water. When Terastallized: Ability 2 is replaced with Embody Aspect [Wellspring].",
		fling: { basePower: 60, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (user.baseSpecies.name.startsWith('Ogerpon-Wellspring') && move.flags['weapon']) { return this.chainModify([4915, 4096]); } },
		onTakeItem(item, source) { if (source.baseSpecies.baseSpecies === 'Ogerpon') return false;
			return true;
		},
		forcedForme: "Ogerpon-Wellspring",
		itemUser: ["Ogerpon-Wellspring"],
		num: 2407,
		gen: 9,
	},
	// #region Evolution Stones
	dawnstone: {
		name: "Dawn Stone",
		itemClass: ['evostones', 'evolution'],
		shortDesc: "1.2x power on holder's Light, Solar moves. Reduces damage from incoming Dark type, Lunar, Shadow moves 20%. Holder's Dark type, Lunar, and Shadow moves fail.",
		fling: { basePower: 80, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.flags['light'] || move.flags['solar']) { return this.chainModify([4915, 4096]); } },
		onSourceModifyDamage(damage, source, target, move) { if (move.type === 'Dark' || move.flags['lunar'] || move.flags['shadow']) { return this.chainModify(0.8); } },
		onBeforeMove(source, target, move) {
			if (move.type === 'Dark' || move.flags['lunar'] || move.flags['shadow']) {
				this.add('-fail', source, 'move: ' + move.name);
				return false;
			}
		},
		num: 109,
		gen: 4,
	},
	duskstone: {
		name: "Dusk Stone",
		itemClass: ['evostones', 'evolution'],
		shortDesc: "1.2x power on holder's Dark type, Shadow moves. Reduces damage from incoming Light, Solar moves 20%. Holder's Light, Solar moves fail.",
		fling: { basePower: 80, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Dark' || move.flags['shadow']) { return this.chainModify([4915, 4096]); } },
		onSourceModifyDamage(damage, source, target, move) { if (move.flags['light'] || move.flags['solar']) { return this.chainModify(0.8); } },
		onBeforeMove(source, target, move) {
			if (move.flags['light'] || move.flags['solar']) {
				this.add('-fail', source, 'move: ' + move.name);
				return false;
			}
		},
		num: 108,
		gen: 4,
	},
	firestone: {
		name: "Fire Stone",
		itemClass: ['evostones', 'evolution', 'weather'],
		shortDesc: "1.2x power on holder's Fire type moves. Reduces damage from incoming Ice type moves 20%. Immune to Freeze and Frostbite. Ice type holders take 1/16HP per turn. Item's effect is dulled under rain, or for 2 turns after being hit by a Water type move.",
		fling: { basePower: 30, },
		onStart(pokemon) {
			if (!pokemon.itemState) pokemon.itemState = {id: '', effectOrder: 0};
			pokemon.itemState.charge = 0;
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Fire' && user.itemState && user.itemState.charge === 0) { return this.chainModify([4915, 4096]); } },
		onSourceModifyDamage(damage, source, target, move) { if (move.type === 'Ice' && target.itemState && target.itemState.charge === 0) { return this.chainModify(0.8); } },
		onUpdate(pokemon) {
			if (this.field.isWeather(['raindance', 'primordialsea'])) {
				if (!pokemon.itemState) pokemon.itemState = {id: '', effectOrder: 0};
				if (pokemon.itemState.charge === undefined) {
					pokemon.itemState.charge = 3;
					this.add('-message', `${pokemon.name}'s Fire Stone was dulled by the rain!`);
				}
			} else if (pokemon.itemState && pokemon.itemState.charge !== undefined && pokemon.itemState.charge > 0) {
				pokemon.itemState.charge--;
				if (pokemon.itemState.charge === 0) { this.add('-message', `${pokemon.name}'s Fire Stone returned to normal.`); }
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Water') {
				if (!target.itemState) target.itemState = {id: '', effectOrder: 0};
				target.itemState.charge = 2;
				this.add('-message', `${target.name}'s Fire Stone was dulled by the water!`);
			}
		},
		onImmunity(type, pokemon) { if ((type === 'frz' || type === 'frostbite') && pokemon.itemState && pokemon.itemState.charge === 0) { return false; } },
		onResidualOrder: 28,
		onResidualSubOrder: 3,
		onResidual(pokemon) { if (pokemon.hasType('Ice')) { this.damage(pokemon.baseMaxhp / 16); } },
		num: 82,
		gen: 1,
	},
	icestone: {
		name: "Ice Stone",
		itemClass: ['evostones', 'evolution', 'weather'],
		shortDesc: "1.2x power on holder's Ice type moves. Reduces damage from incoming Water type moves 20%. Immune to Burn. Fire, Grass type holders take 1/16HP per turn. Item's effect is dulled under Sun, or over Sea of Fire, or for 2 turns after being hit by a Fire type move.",
		fling: { basePower: 30, },
		onStart(pokemon) {
			if (!pokemon.itemState) pokemon.itemState = {id: '', effectOrder: 0};
			pokemon.itemState.charge = 0;
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Ice' && user.itemState && user.itemState.charge === 0) { return this.chainModify([4915, 4096]); } },
		onSourceModifyDamage(damage, source, target, move) { if (move.type === 'Fire' && target.itemState && target.itemState.charge === 0) { return this.chainModify(0.8); } },
		onUpdate(pokemon) {
			if (this.field.isWeather(['sunnyday', 'desolateland']) || this.field.getPseudoWeather('seaoffire')) {
				if (!pokemon.itemState) pokemon.itemState = {id: '', effectOrder: 0};
				if (pokemon.itemState.charge === undefined) {
					pokemon.itemState.charge = 3;
					this.add('-message', `${pokemon.name}'s Ice Stone was dulled by the heat!`);
				}
			} else if (pokemon.itemState && pokemon.itemState.charge !== undefined && pokemon.itemState.charge > 0) {
				pokemon.itemState.charge--;
				if (pokemon.itemState.charge === 0) { this.add('-message', `${pokemon.name}'s Ice Stone returned to normal.`); }
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Fire') {
				if (!target.itemState) target.itemState = {id: '', effectOrder: 0};
				target.itemState.charge = 2;
				this.add('-message', `${target.name}'s Ice Stone was dulled by the flames!`);
			}
		},
		onImmunity(type, pokemon) { if ((type === 'frz' || type === 'frostbite') && pokemon.itemState && pokemon.itemState.charge === 0) { return false; } },
		onResidualOrder: 28,
		onResidualSubOrder: 3,
		onResidual(pokemon) { if (pokemon.hasType('Fire') || pokemon.hasType('Grass')) { this.damage(pokemon.baseMaxhp / 16); } },
		num: 849,
		gen: 7,
	},
	leafstone: {
		name: "Leaf Stone",
		itemClass: ['evostones', 'evolution', 'healing', 'statuscure', 'weather'],
		shortDesc: "1.2x power on holder's Grass type moves. Reduces damage from incoming Water type moves 20%. Under Sun, heal holder 1/24HP and 1/6 chance to cure status at end of every turn. Item's effect is dulled under Hail or Snow, or for 2 turns after being hit by a Ice type move.",
		fling: { basePower: 30, },
		onStart(pokemon) {
			if (!pokemon.itemState) pokemon.itemState = {id: '', effectOrder: 0};
			pokemon.itemState.charge = 0;
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Grass' && user.itemState && user.itemState.charge === 0) { return this.chainModify([4915, 4096]); } },
		onSourceModifyDamage(damage, source, target, move) { if (move.type === 'Water' && target.itemState && target.itemState.charge === 0) { return this.chainModify(0.8); } },
		onUpdate(pokemon) {
			if (this.field.isWeather(['hail', 'snow'])) {
				if (!pokemon.itemState) pokemon.itemState = {id: '', effectOrder: 0};
				if (pokemon.itemState.charge === undefined) {
					pokemon.itemState.charge = 3;
					this.add('-message', `${pokemon.name}'s Leaf Stone was dulled by the cold!`);
				}
			} else if (pokemon.itemState && pokemon.itemState.charge !== undefined && pokemon.itemState.charge > 0) {
				pokemon.itemState.charge--;
				if (pokemon.itemState.charge === 0) { this.add('-message', `${pokemon.name}'s Leaf Stone returned to normal.`); }
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Ice') {
				if (!target.itemState) target.itemState = {id: '', effectOrder: 0};
				target.itemState.charge = 2;
				this.add('-message', `${target.name}'s Leaf Stone was dulled by the ice!`);
			}
		},
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) {
			if (this.field.isWeather(['sunnyday', 'desolateland']) && pokemon.itemState && pokemon.itemState.charge === 0) {
				this.heal(pokemon.baseMaxhp / 24);
				if (pokemon.status && pokemon.status !== 'aura' && this.randomChance(1, 6)) { pokemon.cureStatus(); }
			}
		},
		num: 85,
		gen: 1,
	},
	moonstone: {
		name: "Moon Stone",
		itemClass: ['evostones', 'evolution', 'statboost', 'statuscure', 'utility', 'weather'],
		shortDesc: "Boosts light/lunar/shadow moves 1.2x. Increases damage from incoming Solar, Magic moves 20%. Under Sun, 1.4x damage on holder's Light, Lunar moves; 1.2x damage on Magic moves; 0.8x damage on Shadow moves; 1/2 chance to cure holder's Status at end of turn. Item's effect is dulled under Hail, Rain, Sandstorm, Snow, or for 2 turns after being hit by a Dark type, or Solar move.",
		fling: { basePower: 30, },
		onStart(pokemon) {
			if (!pokemon.itemState) pokemon.itemState = {id: '', effectOrder: 0};
			pokemon.itemState.charge = 0;
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.itemState && user.itemState.charge === 0) {
				if (move.flags['light'] || move.flags['lunar'] || move.flags['shadow']) {
					if (this.field.isWeather(['sunnyday', 'desolateland'])) {
						if (move.flags['light'] || move.flags['lunar']) { return this.chainModify([5734, 4096]); } 
						else if (move.flags['shadow']) { return this.chainModify(0.8); }
					} else { return this.chainModify([4915, 4096]); }
				} else if (move.flags['magic'] && this.field.isWeather(['sunnyday', 'desolateland'])) {  return this.chainModify([4915, 4096]); }
			}
		},
		onSourceModifyDamage(damage, source, target, move) { if (target.itemState && target.itemState.charge === 0) { if (move.flags['solar'] || move.flags['magic']) { return this.chainModify([4915, 4096]); } } },
		onUpdate(pokemon) {
			if (this.field.isWeather(['hail', 'snow', 'raindance', 'primordialsea', 'sandstorm'])) {
				if (!pokemon.itemState) pokemon.itemState = {id: '', effectOrder: 0};
				if (pokemon.itemState.charge === undefined) {
					pokemon.itemState.charge = 3;
					this.add('-message', `${pokemon.name}'s Moon Stone was dulled by the weather!`);
				}
			} else if (pokemon.itemState && pokemon.itemState.charge !== undefined && pokemon.itemState.charge > 0) {
				pokemon.itemState.charge--;
				if (pokemon.itemState.charge === 0) { this.add('-message', `${pokemon.name}'s Moon Stone returned to normal.`); }
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Dark' || move.flags['solar']) {
				if (!target.itemState) target.itemState = {id: '', effectOrder: 0};
				target.itemState.charge = 2;
				this.add('-message', `${target.name}'s Moon Stone was dulled!`);
			}
		},
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) { if (this.field.isWeather(['sunnyday', 'desolateland']) && pokemon.itemState && pokemon.itemState.charge === 0) { if (pokemon.status && pokemon.status !== 'aura' && this.randomChance(1, 2)) { pokemon.cureStatus(); } } },
		num: 81,
		gen: 1,
	},
	shinystone: {
		name: "Shiny Stone",
		itemClass: ['evostones', 'evolution'],
		shortDesc: "1.2x power on holder's Light, Pulse moves. Reduces damage from incoming Dark type, Shadow moves 20%. and blocks those moves. Holder's Dark type, Shadow moves fail.",
		fling: { basePower: 80, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.flags['light'] || move.flags['pulse']) { return this.chainModify([4915, 4096]); } },
		onSourceModifyDamage(damage, source, target, move) { if (move.type === 'Dark' || move.flags['shadow']) { return this.chainModify(0.8); } },
		onBeforeMovePriority: 5,
		onBeforeMove(pokemon, target, move) {
			if (move.type === 'Dark' || move.flags['shadow']) {
				this.add('-fail', pokemon, 'move: ' + move.name);
				this.attrLastMove('[still]');
				return false;
			}
		},
		num: 107,
		gen: 4,
	},
	sunstone: {
		name: "Sun Stone",
		itemClass: ['evostones', 'evolution', 'utility', 'weather'],
		shortDesc: "1.2x[1.3x under Sun] power on holder's Fire type, Explosive, Light, Solar moves. Increases damage from incoming Water type, Lunar moves 20%[50% under Sun]. Reduces damage from incoming Dark type, Shadow moves 20%[50% under Sun]. Item's effect is dulled under Hail, Rain, Sandstorm Snow, or for 2 turns after being hit by a Dark type or Lunar move.",
		fling: { basePower: 30, },
		onStart(pokemon) {
			if (!pokemon.itemState) pokemon.itemState = {id: '', effectOrder: 0};
			pokemon.itemState.charge = 0;
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.itemState && user.itemState.charge === 0) {
				if (move.type === 'Fire' || move.flags['explosive'] || move.flags['light'] || move.flags['solar']) {
					if (this.field.isWeather(['sunnyday', 'desolateland'])) {
						return this.chainModify([5325, 4096]);
					} else {return this.chainModify([4915, 4096]);}
				}
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.itemState && target.itemState.charge === 0) {
				if (move.type === 'Water' || move.flags['lunar']) {
					if (this.field.isWeather(['sunnyday', 'desolateland'])) { return this.chainModify(1.5); }
					else { return this.chainModify([4915, 4096]); }
				} else if (move.type === 'Dark' || move.flags['shadow']) {
					if (this.field.isWeather(['sunnyday', 'desolateland'])) { return this.chainModify(0.5); }
					else { return this.chainModify(0.8); }
				}
			}
		},
		onUpdate(pokemon) {
			if (this.field.isWeather(['hail', 'snow', 'raindance', 'primordialsea', 'sandstorm'])) {
				if (!pokemon.itemState) pokemon.itemState = {id: '', effectOrder: 0};
				if (pokemon.itemState.charge === undefined) {
					pokemon.itemState.charge = 3;
					this.add('-message', `${pokemon.name}'s Sun Stone was dulled by the weather!`);
				}
			} else if (pokemon.itemState && pokemon.itemState.charge !== undefined && pokemon.itemState.charge > 0) {
				pokemon.itemState.charge--;
				if (pokemon.itemState.charge === 0) { this.add('-message', `${pokemon.name}'s Sun Stone returned to normal.`); }
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Dark' || move.flags['lunar']) {
				if (!target.itemState) target.itemState = {id: '', effectOrder: 0};
				target.itemState.charge = 2;
				this.add('-message', `${target.name}'s Sun Stone was dulled!`);
			}
		},
		num: 80,
		gen: 2,
	},
	thunderstone: {
		name: "Thunder Stone",
		itemClass: ['evostones', 'evolution'],
		shortDesc: "1.2x power on holder's Electric type moves. Immune to Drowsy, Sleep. Flying, Water type holders take 1/12HP per turn. Item's effect dulls for 2 turns if holder's Electric type move targets a Ground type.",
		fling: { basePower: 30, },
		onStart(pokemon) {
			if (!pokemon.itemState) pokemon.itemState = {id: '', effectOrder: 0};
			pokemon.itemState.charge = 0;
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Electric' && user.itemState && user.itemState.charge === 0) { return this.chainModify([4915, 4096]); } },
		onImmunity(type, pokemon) { if ((type === 'slp' || type === 'drowsy') && pokemon.itemState && pokemon.itemState.charge === 0) { return false; } },
		onTryHit(target, source, move) {
			if (move.type === 'Electric' && target.hasType('Ground') && source.itemState) {
				source.itemState.charge = 2;
				this.add('-message', `${source.name}'s Thunder Stone was dulled!`);
			}
		},
		onUpdate(pokemon) {
			if (pokemon.itemState && pokemon.itemState.charge !== undefined && pokemon.itemState.charge > 0) {
				pokemon.itemState.charge--;
				if (pokemon.itemState.charge === 0) { this.add('-message', `${pokemon.name}'s Thunder Stone returned to normal.`); }
			}
		},
		onResidualOrder: 28,
		onResidualSubOrder: 3,
		onResidual(pokemon) { if ((pokemon.hasType('Water') || pokemon.hasType('Flying')) && !pokemon.hasType('Electric')) { this.damage(pokemon.baseMaxhp / 12); } },
		num: 83,
		gen: 1,
	},
	waterstone: {
		name: "Water Stone",
		itemClass: ['evostones', 'evolution', 'utility', 'terrain'],
		shortDesc: "1.2x power on holder's Water type, Pulse, Sweeping moves. Reduces damage from incoming Fire type moves 20%. Immune to Burn. Fire, Poison type holders take 1/12HP per turn. Item's effect is dulled over Electric, Grassy, Toxic terrains, or for 2 turns after being hit by an Electric, Grass, or Poison type move.",
		fling: { basePower: 30, },
		onStart(pokemon) {
			if (!pokemon.itemState) pokemon.itemState = {id: '', effectOrder: 0};
			pokemon.itemState.charge = 0;
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if ((move.type === 'Water' || move.flags['sweep'] || move.flags['pulse']) && user.itemState && user.itemState.charge === 0) {
				return this.chainModify([4915, 4096]);
			}
		},
		onSourceModifyDamage(damage, source, target, move) { if (move.type === 'Fire' && target.itemState && target.itemState.charge === 0) { return this.chainModify(0.8); } },
		onUpdate(pokemon) {
			if (this.field.isTerrain('electricterrain') || this.field.isTerrain('grassyterrain') || this.field.isTerrain('toxicterrain')) {
				if (!pokemon.itemState) pokemon.itemState = {id: '', effectOrder: 0};
				if (pokemon.itemState.charge === undefined) {
					pokemon.itemState.charge = 3;
					this.add('-message', `${pokemon.name}'s Water Stone was dulled by the terrain!`);
				}
			} else if (pokemon.itemState && pokemon.itemState.charge !== undefined && pokemon.itemState.charge > 0) {
				pokemon.itemState.charge--;
				if (pokemon.itemState.charge === 0) { this.add('-message', `${pokemon.name}'s Water Stone returned to normal.`); }
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Electric' || move.type === 'Grass' || move.type === 'Poison') {
				if (!target.itemState) target.itemState = {id: '', effectOrder: 0};
				target.itemState.charge = 2;
				this.add('-message', `${target.name}'s Water Stone was dulled!`);
			}
		},
		onImmunity(type, pokemon) { if (type === 'brn' && pokemon.itemState && pokemon.itemState.charge === 0) { return false; } },
		onResidualOrder: 28,
		onResidualSubOrder: 3,
		onResidual(pokemon) { if (pokemon.hasType('Fire') || pokemon.hasType('Poison')) { this.damage(pokemon.baseMaxhp / 12); } },
		num: 84,
		gen: 1,
	},
	// #region Unique Evo Items
	auspiciousarmor: {
		name: "Auspicious Armor",
		itemClass: ['evolution'],
		shortDesc: "Evolves Charcadet into Armarouge when used.",
		fling: { basePower: 30, },
		num: 2344,
		gen: 9,
	},
	chippedpot: {
		name: "Chipped Pot",
		itemClass: ['evolution'],
		shortDesc: "Evolves Poltchageist into Sinistcha when used.",
		fling: { basePower: 80, },
		num: 1254,
		gen: 8,
	},
	crackedpot: {
		name: "Cracked Pot",
		itemClass: ['evolution'],
		shortDesc: "Evolves Sinistea into Polteageist when used.",
		fling: { basePower: 80, },
		num: 1253,
		gen: 8,
	},
	galaricacuff: {
		name: "Galarica Cuff",
		itemClass: ['evolution'],
		shortDesc: "Evolves Galarian Slowpoke into Galarian Slowbro when used.",
		fling: { basePower: 30, },
		num: 1582,
		gen: 8,
	},
	galaricawreath: {
		name: "Galarica Wreath",
		itemClass: ['evolution'],
		shortDesc: "Evolves Galarian Slowpoke into Galarian Slowking when used.",
		fling: { basePower: 30, },
		num: 1592,
		gen: 8,
	},
	maliciousarmor: {
		name: "Malicious Armor",
		itemClass: ['evolution'],
		shortDesc: "Evolves Charcadet into Ceruledge when used.",
		fling: { basePower: 30, },
		num: 1861,
		gen: 9,
	},
	masterpieceteacup: {
		name: "Masterpiece Teacup",
		itemClass: ['evolution'],
		shortDesc: "Evolves Poltchageist into Sinistcha-Masterpiece when used.",
		fling: { basePower: 80, },
		num: 2404,
		gen: 9,
	},
	metalalloy: {
		name: "Metal Alloy",
		itemClass: ['evolution', 'typeboost', 'resist'],
		shortDesc: "1.2x power on holder's Steel type moves. Reduces incoming Fire type damage 20%, increases incoming Electric type damage 20%.",
		num: 2482,
		fling: { basePower: 30, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Steel') { return this.chainModify([4915, 4096]); } },
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Fire') { return this.chainModify(0.8); }
			if (move.type === 'Electric') { return this.chainModify(1.2); }
		},
		gen: 9,
	},
	sweetapple: {
		name: "Sweet Apple",
		itemClass: ['evolution'],
		shortDesc: "Evolves Applin into Appletun when used.",
		fling: { basePower: 30, },
		num: 1116,
		gen: 8,
	},
	syrupyapple: {
		name: "Syrupy Apple",
		itemClass: ['evolution'],
		shortDesc: "Evolves Applin into Dipplin when used.",
		fling: { basePower: 30, },
		num: 2402,
		gen: 9,
	},
	tartapple: {
		name: "Tart Apple",
		itemClass: ['evolution'],
		shortDesc: "Evolves Applin into Flapple when used.",
		fling: { basePower: 30, },
		num: 1117,
		gen: 8,
	},
	unremarkableteacup: {
		name: "Unremarkable Teacup",
		itemClass: ['evolution'],
		shortDesc: "Evolves Poltchageist into Sinistcha when used.",
		fling: { basePower: 80, },
		num: 2403,
		gen: 9,
	},
// #region Trade Evolution Items
	dragonscale: {
		name: "Dragon Scale",
		itemClass: ['tradeevo'],
		shortDesc: "Evolves Seadra into Kingdra when traded.",
		fling: { basePower: 30, },
		num: 235,
		gen: 2,
	},
	dubiousdisc: {
		name: "Dubious Disc",
		itemClass: ['tradeevo'],
		shortDesc: "Evolves Porygon2 into Porygon-Z when traded.",
		fling: { basePower: 50, },
		num: 324,
		gen: 4,
	},
	electirizer: {
		name: "Electirizer",
		itemClass: ['tradeevo'],
		shortDesc: "Evolves Electabuzz into Electivire when traded.",
		fling: { basePower: 80, },
		num: 322,
		gen: 4,
	},
	kingsrock: {
		name: "King's Rock",
		itemClass: ['tradeevo', 'utility'],
		shortDesc: "Holder's attacks without a chance to flinch gain a 10% chance to flinch. Evolves Poliwhirl into Politoed, or Slowpoke into Slowking when traded.",
		fling: {
			basePower: 30,
			volatileStatus: 'flinch',
		},
		onModifyMovePriority: -1,
		onModifyMove(move) {
			if (move.category !== "Status") {
				if (!move.secondaries) move.secondaries = [];
				for (const secondary of move.secondaries) { if (secondary.volatileStatus === 'flinch') return; }
				move.secondaries.push({
					chance: 10,
					volatileStatus: 'flinch',
				});
			}
		},
		num: 221,
		gen: 2,
	},
	magmarizer: {
		name: "Magmarizer",
		itemClass: ['tradeevo'],
		shortDesc: "Evolves Magmar into Magmortar when traded.",
		fling: { basePower: 80, },
		num: 323,
		gen: 4,
	},
	ovalstone: {
		name: "Oval Stone",
		itemClass: ['tradeevo'],
		shortDesc: "Evolves Happiny into Chansey when leveled up during the day.",
		fling: { basePower: 80, },
		num: 110,
		gen: 4,
	},
	prismscale: {
		name: "Prism Scale",
		itemClass: ['tradeevo', 'statboost'],
		shortDesc: "Extends duration of holder's Rainbow to 7 turns [from 4]. Holder's critical hit ratio is raised 2 stages. Evolves Feebas into Milotic when traded.",
		fling: { basePower: 30, },
		onModifyCritRatio(critRatio) { return critRatio + 2; },
		num: 537,
		gen: 5,
	},
	protector: {
		name: "Protector",
		itemClass: ['tradeevo', 'statboost'],
		shortDesc: "Holder's Defense is 1.2x, weight +100kg. Immune to protection breaking effects Speed reduction varies by weight ratio and type (100%-50% based on species weight; Bug types carry 4x weight, Fighting/Dragon 2x, Flying 0.5x). Evolves Rhydon into Rhyperior when traded.",
		fling: { basePower: 80, },
		onModifyDefPriority: 1,
		onModifyDef(def) { return this.chainModify(1.2); },
		onModifyWeight(weighthg, pokemon) { return weighthg + 10000; }, // Add 100kg (10000 hectograms) to weight
		onModifySpe(spe, pokemon) {
			const baseWeight = pokemon.species.weightkg;
			const modifiedWeight = baseWeight + 100;
				let typeModifier = 1;
			if (pokemon.hasType('Bug')) typeModifier = 4;
			else if (pokemon.hasType('Dragon') || pokemon.hasType('Fighting')) typeModifier = 2;
			else if (pokemon.hasType('Flying')) typeModifier = 0.5;
			const effectiveWeight = modifiedWeight * typeModifier;
			const weightRatio = effectiveWeight / baseWeight;
			let speedMod = 1;
			if (weightRatio >= 2) speedMod = 1;
			else if (weightRatio >= 1.5) speedMod = 0.8;
			else if (weightRatio >= 1) speedMod = 0.7;
			else if (weightRatio >= 0.75) speedMod = 0.5;
			else speedMod = 0.3;
			return this.chainModify(speedMod);
		},
		onTryBoost(boost, target, source, effect) { if (effect && effect.id === 'feint') { return null; } },
		num: 321,
		gen: 4,
	},
	razorclaw: {
		name: "Razor Claw",
		itemClass: ['statboost'],
		shortDesc: "Holder's critical hit ratio is raised 4 stages.",
		fling: { basePower: 80,},
		onModifyCritRatio(critRatio) { return critRatio + 4; },
		num: 326,
		gen: 4,
	},
	razorfang: {
		name: "Razor Fang",
		shortDesc: "Holder's attacks without a chance to flinch gain a 10% chance to flinch.",
		fling: {
			basePower: 30,
			volatileStatus: 'flinch',
		},
		onModifyMovePriority: -1,
		onModifyMove(move) {
			if (move.category !== "Status") {
				if (!move.secondaries) move.secondaries = [];
				for (const secondary of move.secondaries) { if (secondary.volatileStatus === 'flinch') return; }
				move.secondaries.push({
					chance: 10,
					volatileStatus: 'flinch',
				});
			}
		},
		num: 327,
		gen: 4,
	},
	reapercloth: {
		name: "Reaper Cloth",
		itemClass: ['tradeevo', 'statboost', 'utility'],
		shortDesc: "Boosts Ghost/aura moves 1.2x, increases incoming aura/magic damage taken 20%. Curses non-Ghosts. Torn if holder is hit by a slicing/claw move. Evolves Dusclops into Dusknoir when traded.",
		fling: { basePower: 10, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Ghost' || move.flags['aura']) { return this.chainModify(1.2); } },
		onSourceModifyDamage(damage, source, target, move) { if (move.flags['aura'] || move.flags['magic']) { return this.chainModify(1.2); } },
		onResidualOrder: 28,
		onResidualSubOrder: 4,
		onResidual(pokemon) { if (!pokemon.hasType('Ghost')) { pokemon.addVolatile('curse'); } },
		onDamagingHit(damage, target, source, move) {
			if (move.flags['slicing'] || move.flags['claw']) {
				target.setItem('');
				this.add('-enditem', target, 'Reaper Cloth', '[from] move: ' + move.name);
				this.add('-message', `${target.name}'s Reaper Cloth was torn to shreds!`);
			}
		},
		num: 325,
		gen: 4,
	},
	upgrade: {
		name: "Up-Grade",
		itemClass: ['tradeevo'],
		shortDesc: "Evolves Porygon into Porygon2 when traded.",
		fling: { basePower: 30, },
		num: 252,
		gen: 2,
	},
	// #region Type Boosting Items
	blackbelt: {
		name: "Black Belt",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Fighting type, Punch, Kick, Sweep, Throw moves.",
		fling: { basePower: 30, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move && (move.type === 'Fighting' || move.flags['punch'] || move.flags['kick'] || move.flags['sweep'] || move.flags['throw'])) { return this.chainModify([4915, 4096]); }
		},
		num: 241,
		gen: 2,
	},
	blackglasses: {
		name: "Black Glasses",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Dark type, Aura moves. Reduces incoming Light damage 20%.",
		fling: { basePower: 30, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move && (move.type === 'Dark' || move.flags['aura'])) { return this.chainModify([4915, 4096]); } },
		onSourceModifyDamage(damage, source, target, move) { if (move.flags['light']) { return this.chainModify(0.8); } },
		num: 240,
		gen: 2,
	},
	charcoal: {
		name: "Charcoal",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Fire type moves. Reduces incoming Dark/Ghost damage 20%. Dark, Ghost type holders take 1/16HP per turn.",
		fling: { basePower: 30, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move && move.type === 'Fire') { return this.chainModify([4915, 4096]); } },
		onSourceModifyDamage(damage, source, target, move) { if (move.type === 'Dark' || move.type === 'Ghost') { return this.chainModify(0.8); } },
		onResidualOrder: 28,
		onResidualSubOrder: 3,
		onResidual(pokemon) { if (pokemon.hasType('Dark') || pokemon.hasType('Ghost')) { this.damage(pokemon.baseMaxhp / 16); } },
		num: 249,
		gen: 2,
	},
	dragonfang: {
		name: "Dragon Fang",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Dragon type, Bite moves. Bite moves have 10% chance to inflict Dragonblight.",
		fling: { basePower: 70, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move && (move.type === 'Dragon' || move.flags['bite'])) { return this.chainModify([4915, 4096]); } },
		onModifyMove(move, pokemon) {
			if (move.flags['bite']) {
				move.secondaries = move.secondaries || [];
				move.secondaries.push({
					chance: 10,
					status: 'dragonblight',
				} );
			}
		},
		num: 250,
		gen: 2,
	},
	fairyfeather: {
		name: "Fairy Feather",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Fairy type, Wind moves.",
		fling: { basePower: 10, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move && (move.type === 'Fairy' || move.flags['wind'])) { return this.chainModify([4915, 4096]); } },
		num: 2401,
		gen: 9,
	},
	hardstone: {
		name: "Hard Stone",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Rock type, Throw moves.",
		fling: { basePower: 100, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move && (move.type === 'Rock'|| move.flags['throw'])) { return this.chainModify([4915, 4096]); } },
		num: 238,
		gen: 2,
	},
	magnet: {
		name: "Magnet",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Electric type moves. The moves of Electric type pokemon, and Electric and Steel Type moves are redirected to the holder",
		fling: { basePower: 30, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Electric') { return this.chainModify([4915, 4096]); } },
		onRedirectTarget(target, source, source2, move) { if (move && (move.type === 'Electric' || move.type === 'Steel') && source !== target) { return target; } },
		num: 242,
		gen: 2,
	},
	metalcoat: {
		name: "Metal Coat",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Steel type moves. Reduces incoming Water damage 20%, increases incoming Electric damage 20%.",
		fling: { basePower: 30, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Steel') { return this.chainModify([4915, 4096]); } },
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Water') { return this.chainModify(0.8); }
			if (move.type === 'Electric') { return this.chainModify(1.2); }
		},
		num: 233,
		gen: 2,
	},
	miracleseed: {
		name: "Miracle Seed",
		itemClass: ['typeboost', 'healing'],
		shortDesc: "1.2x power on holder's Grass type moves. Holder heals 1/24HP each turn.",
		fling: { basePower: 30, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Grass') { return this.chainModify([4915, 4096]); } },
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) { this.heal(pokemon.baseMaxhp / 24); },
		num: 239,
		gen: 2,
	},
	mysticwater: {
		name: "Mystic Water",
		itemClass: ['typeboost', 'healing'],
		shortDesc: "1.2x power on holder's Water type moves. Charges when hit by Water. When charged: grants Aqua Ring and Immunity to the immunity breaking effect of Magic moves.",
		fling: { basePower: 30, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Water') { return this.chainModify([4915, 4096]); } },
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Water') {
				if (!target.itemState) target.itemState = {} as any;
				target.itemState.charged = true;
				this.add('-message', `${target.name}'s Mystic Water absorbed the flow! ${target.name}'s Mystic Water is swirling with aqueous energy!`);
				target.addVolatile('aquaring');
			}
		},
		// Charge the item if Aqua Ring is gained through any means
		onUpdate(pokemon: Pokemon) {
			if (pokemon.volatiles['aquaring'] && (!pokemon.itemState || !pokemon.itemState.charged)) {
				if (!pokemon.itemState) pokemon.itemState = {} as any;
				pokemon.itemState.charged = true;
			}
		},
		// While charged, user is immune to immunity breaking effect of Magic moves
		onImmunity(type: string, pokemon: Pokemon) { if (pokemon.itemState?.charged && type === 'Magic') { return false; } },
		num: 243,
		gen: 2,
	},
	nevermeltice: {
		name: "Never-Melt Ice",
		itemClass: ['typeboost', 'weather'],
		shortDesc: "1.2x power on holder's Ice type moves. Reduces incoming Fire damage by 30%. Ice type holders become immune to Sun damage.",
		fling: { basePower: 30, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Ice') { return this.chainModify([4915, 4096]); } },
		onSourceModifyDamage(damage, source, target, move) { if (move.type === 'Fire') { return this.chainModify(0.7); } },
		onImmunity(type: string, pokemon: Pokemon) { if (pokemon.hasType('Ice') && this.field.isWeather('sunnyday')) { return false; } },
		num: 246,
		gen: 2,
	},
	poisonbarb: {
		name: "Poison Barb",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Poison type, Pierce moves. Deals 1/12HP and Poisons attackers on contact.",
		fling: {
			basePower: 70,
			status: 'psn',
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move && (move.type === 'Poison' || move.flags['pierce'])) { return this.chainModify([4915, 4096]); } },
		onDamagingHit(damage, target, source, move) {
			if (move && this.checkMoveMakesContact(move, source, target)) {
				this.damage(source.baseMaxhp / 12, source, target);
				source.trySetStatus('psn', target);
			}
		},
		num: 245,
		gen: 2,
	},
	sharpbeak: {
		name: "Sharp Beak",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Flying type, Pierce moves. Holder's Bite moves consume opponent's held berries.",
		fling: { basePower: 50, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move && (move.type === 'Flying' || move.flags['pierce'])) { return this.chainModify([4915, 4096]); } },
		// Biting moves consume opponent's berry
		onAfterHit(target, source, move) {
			if (move && move.flags['bite'] && target.item) {
				const itemData = this.dex.items.get(target.item);
				if (itemData.isBerry) { target.eatItem(); }
			}
		},
		num: 244,
		gen: 2,
	},
	silkscarf: {
		name: "Silk Scarf",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Normal type moves, and moves without a secondary effect. Holder's Bind moves deal 1/7 damage per turn [instead of 1/8].",
		fling: { basePower: 10, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Normal' || !move.secondary) { return this.chainModify([4915, 4096]); } },
		onModifyMove(move, pokemon) { if (move.flags['binding']) { move.damage = 1/7; } },
		num: 251,
		gen: 3,
	},
	silverpowder: {
		name: "Silver Powder",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Bug type moves. Reduces incoming Light damage 20%, increases power against Dark, Fairy, Ghost type targets 20%.",
		fling: { basePower: 10, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Bug') return this.chainModify([4915, 4096]); },
		onSourceModifyDamage(damage, source, target, move) { if (move.flags?.light) return this.chainModify(0.8); },
		onModifyDamage(damage, source, target, move) { if (target.hasType('Dark') || target.hasType('Fairy') || target.hasType('Ghost')) { return this.chainModify([4915, 4096]); } },
		num: 222,
		gen: 2,
	},
	softsand: {
		name: "Soft Sand",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Ground type moves. Reduces incoming Water damage by 30%.",
		fling: { basePower: 10, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Ground') { return this.chainModify([4915, 4096]); } },
		onSourceModifyDamage(damage, source, target, move) { if (move.type === 'Water') { return this.chainModify(0.7); } },
		num: 237,
		gen: 2,
	},
	spelltag: {
		name: "Spell Tag",
		itemClass: ['typeboost', 'utility', 'terrain'],
		shortDesc: "1.2x power on holder's Ghost type moves. Immune to magic moves. Holder's Magic moves fail. Supresses Magic Bounce, Magic Guard, Magician, and Misty Terrain.  Dragon, Fairy type holders take 1/12HP per turn. Ghost type holders are bound.",
		fling: { basePower: 30, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Ghost') { return this.chainModify([4915, 4096]); } },
		onTryHit(target, source, move) { 
			if (move.flags['magic']) { this.add('-immune', target); return null; }
			if (this.field.isTerrain('mistyterrain') && target.isGrounded()) { move.terrain = undefined; }
		},
		onBeforeMove(source, target, move) { if (move.flags['magic']) { this.add('-fail', source, 'move: ' + move.name); return false; } },
		onModifyMove(move, pokemon) {
			if (move.target === 'normal' || move.target === 'randomNormal' || move.target === 'adjacentFoe' || move.target === 'adjacentAlly') { move.ignoreAbility = true; }
			if (this.field.isTerrain('mistyterrain')) { move.terrain = undefined; }
		},
		onImmunity(type, pokemon) {if (pokemon.hasType('Ghost') && type === 'trapped') {return false;}},
		onStart(pokemon) { if (pokemon.hasAbility(['magicbounce', 'magicguard', 'magician'])) { pokemon.addVolatile('gastroacid'); } },
		onFoeTryMove(source, target, move) { if (target.hasItem('spelltag') && source.hasAbility(['magicbounce', 'magicguard', 'magician'])) { source.addVolatile('gastroacid'); } },
		onResidualOrder: 28,
		onResidualSubOrder: 3,
		onResidual(pokemon) { if (pokemon.hasType('Dragon') || pokemon.hasType('Fairy')) { this.damage(pokemon.baseMaxhp / 12); } },
		num: 247,
		gen: 2,
	},
	snowball: {
		name: "Snowball",
		itemClass: ['typeboost', 'utility', 'weather'],
		shortDesc: "1.2x power (1.5x in snow) on holder's Ice/throw moves. Melts in sun.",
		fling: { basePower: 30, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Ice' || move.flags['throw']) {
				let modifier = 1.2;
				if (this.field.isWeather('snow') && (move.type === 'Ice' || move.flags['throw'])) { modifier = 1.5; }
				return this.chainModify(modifier);
			}
		},
		onUpdate(pokemon) { if (this.field.isWeather('sunnyday') || this.field.isWeather('desolateland')) { pokemon.setItem(''); } },
		num: 649,
		gen: 6,
	},
	twistedspoon: {
		name: "Twisted Spoon",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Psychic type, Beam, Pulse moves. Increases power against Steel type targets 20%.",
		fling: { basePower: 30, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Psychic' || move.flags['beam'] || move.flags['pulse']) { return this.chainModify([4915, 4096]); } },
		onSourceModifyDamage(damage, source, target, move) { if (target.hasType('Steel')) { return this.chainModify([4915, 4096]); } },
		num: 248,
		gen: 2,
	},
	// #region Type Plates
	blankplate: {
		name: "Blank Plate",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Normal type moves. Judgment is Normal type.",
		onPlate: 'Normal',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {if (move && move.type === 'Normal') { return this.chainModify([4915, 4096]); } },
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) { return false; }
			return true;
		},
		forcedForme: "Arceus-Normal",
		num: 12300,
		gen: 8,
	},
	dracoplate: {
		name: "Draco Plate",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Dragon type moves. Judgment is Dragon type.",
		onPlate: 'Dragon',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {if (move && move.type === 'Dragon') { return this.chainModify([4915, 4096]); } },
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) { return false; }
			return true;
		},
		forcedForme: "Arceus-Dragon",
		num: 311,
		gen: 4,
	},
	dreadplate: {
		name: "Dread Plate",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Dark type moves. Judgment is Dark type.",
		onPlate: 'Dark',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move && move.type === 'Dark') { return this.chainModify([4915, 4096]); } },
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) { return false; }
			return true;
		},
		forcedForme: "Arceus-Dark",
		num: 312,
		gen: 4,
	},
	earthplate: {
		name: "Earth Plate",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Ground type moves. Judgment is Ground type.",
		onPlate: 'Ground',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move && move.type === 'Ground') { return this.chainModify([4915, 4096]); } },
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) { return false; }
			return true;
		},
		forcedForme: "Arceus-Ground",
		num: 305,
		gen: 4,
	},
	fistplate: {
		name: "Fist Plate",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Fighting type moves. Judgment is Fighting type.",
		onPlate: 'Fighting',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move && move.type === 'Fighting') { return this.chainModify([4915, 4096]); } },
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) { return false; }
			return true;
		},
		forcedForme: "Arceus-Fighting",
		num: 303,
		gen: 4,
	},
	flameplate: {
		name: "Flame Plate",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Fire type moves. Judgment is Fire type.",
		onPlate: 'Fire',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move && move.type === 'Fire') { return this.chainModify([4915, 4096]) } },
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) { return false; }
			return true;
		},
		forcedForme: "Arceus-Fire",
		num: 298,
		gen: 4,
	},
	icicleplate: {
		name: "Icicle Plate",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Ice type moves. Judgment is Ice type.",
		onPlate: 'Ice',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Ice') { return this.chainModify([4915, 4096]); } },
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) { return false; }
			return true;
		},
		forcedForme: "Arceus-Ice",
		num: 302,
		gen: 4,
	},
	insectplate: {
		name: "Insect Plate",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Bug type moves. Judgment is Bug type.",
		onPlate: 'Bug',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Bug') { return this.chainModify([4915, 4096]); } },
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) { return false; }
			return true;
		},
		forcedForme: "Arceus-Bug",
		num: 308,
		gen: 4,
	},
	ironplate: {
		name: "Iron Plate",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Steel type moves. Judgment is Steel type.",
		onPlate: 'Steel',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Steel') { return this.chainModify([4915, 4096]); } },
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) { return false; }
			return true;
		},
		forcedForme: "Arceus-Steel",
		num: 313,
		gen: 4,
	},
	meadowplate: {
		name: "Meadow Plate",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Grass type moves. Judgment is Grass type.",
		onPlate: 'Grass',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Grass') { return this.chainModify([4915, 4096]); } },
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) { return false; }
			return true;
		},
		forcedForme: "Arceus-Grass",
		num: 301,
		gen: 4,
	},
	mindplate: {
		name: "Mind Plate",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Psychic type moves. Judgment is Psychic type.",
		onPlate: 'Psychic',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Psychic') { return this.chainModify([4915, 4096]); } },
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) { return false; }
			return true;
		},
		forcedForme: "Arceus-Psychic",
		num: 307,
		gen: 4,
	},
	pixieplate: {
		name: "Pixie Plate",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Fairy type moves. Judgment is Fairy type.",
		onPlate: 'Fairy',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move && move.type === 'Fairy') { return this.chainModify([4915, 4096]); } },
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) { return false; }
			return true;
		},
		forcedForme: "Arceus-Fairy",
		num: 644,
		gen: 6,
	},
	skyplate: {
		name: "Sky Plate",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Flying type moves. Judgment is Flying type.",
		onPlate: 'Flying',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Flying') { return this.chainModify([4915, 4096]); } },
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) { return false; }
			return true;
		},
		forcedForme: "Arceus-Flying",
		num: 306,
		gen: 4,
	},
	splashplate: {
		name: "Splash Plate",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Water type moves. Judgment is Water type.",
		onPlate: 'Water',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Water') { return this.chainModify([4915, 4096]); } },
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) { return false; }
			return true;
		},
		forcedForme: "Arceus-Water",
		num: 299,
		gen: 4,
	},
	spookyplate: {
		name: "Spooky Plate",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Ghost type moves. Judgment is Ghost type.",
		onPlate: 'Ghost',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Ghost') { return this.chainModify([4915, 4096]); } },
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) { return false; }
			return true;
		},
		forcedForme: "Arceus-Ghost",
		num: 310,
		gen: 4,
	},
	stoneplate: {
		name: "Stone Plate",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Rock type moves. Judgment is Rock type.",
		onPlate: 'Rock',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Rock') { return this.chainModify([4915, 4096]); } },
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) { return false; }
			return true;
		},
		forcedForme: "Arceus-Rock",
		num: 309,
		gen: 4,
	},
	toxicplate: {
		name: "Toxic Plate",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Poison type moves. Judgment is Poison type.",
		onPlate: 'Poison',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Poison') { return this.chainModify([4915, 4096]); } },
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) { return false; }
			return true;
		},
		forcedForme: "Arceus-Poison",
		num: 304,
		gen: 4,
	},
	zapplate: {
		name: "Zap Plate",
		itemClass: ['typeboost'],
		shortDesc: "1.2x power on holder's Electric type moves. Judgment is Electric type.",
		onPlate: 'Electric',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Electric') { return this.chainModify([4915, 4096]); } },
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) { return false; }
			return true;
		},
		forcedForme: "Arceus-Electric",
		num: 300,
		gen: 4,
	},
	// #region Poké Balls
	beastball: {
		name: "Beast Ball",
		itemClass: ['pokeball'],
		num: 851,
		gen: 7,
		isPokeball: true,
	},
	cherishball: {
		name: "Cherish Ball",
		itemClass: ['pokeball'],
		num: 16,
		gen: 4,
		isPokeball: true,
		isNonstandard: "Unobtainable",
	},
	diveball: {
		name: "Dive Ball",
		itemClass: ['pokeball'],
		num: 7,
		gen: 3,
		isPokeball: true,
	},	
	dreamball: {
		name: "Dream Ball",
		itemClass: ['pokeball'],
		num: 576,
		gen: 5,
		isPokeball: true,
	},
	duskball: {
		name: "Dusk Ball",
		itemClass: ['pokeball'],
		num: 13,
		gen: 4,
		isPokeball: true,
	},
	fastball: {
		name: "Fast Ball",
		itemClass: ['pokeball'],
		num: 492,
		gen: 2,
		isPokeball: true,
	},
	friendball: {
		name: "Friend Ball",
		itemClass: ['pokeball'],
		num: 497,
		gen: 2,
		isPokeball: true,
	},
	greatball: {
		name: "Great Ball",
		itemClass: ['pokeball'],
		num: 3,
		gen: 1,
		isPokeball: true,
	},
	healball: {
		name: "Heal Ball",
		itemClass: ['pokeball', 'healing'],
		num: 14,
		gen: 4,
		isPokeball: true,
	},
	heavyball: {
		name: "Heavy Ball",
		itemClass: ['pokeball'],
		num: 495,
		gen: 2,
		isPokeball: true,
	},
	levelball: {
		name: "Level Ball",
		itemClass: ['pokeball'],
		num: 493,
		gen: 2,
		isPokeball: true,
	},
	loveball: {
		name: "Love Ball",
		itemClass: ['pokeball'],
		num: 496,
		gen: 2,
		isPokeball: true,
	},
	lureball: {
		name: "Lure Ball",
		itemClass: ['pokeball'],
		num: 494,
		gen: 2,
		isPokeball: true,
	},
	luxuryball: {
		name: "Luxury Ball",
		itemClass: ['pokeball'],
		num: 11,
		gen: 3,
		isPokeball: true,
	},
	masterball: {
		name: "Master Ball",
		itemClass: ['pokeball'],
		num: 1,
		gen: 1,
		isPokeball: true,
	},
	moonball: {
		name: "Moon Ball",
		itemClass: ['pokeball'],
		num: 498,
		gen: 2,
		isPokeball: true,
	},
	nestball: {
		name: "Nest Ball",
		itemClass: ['pokeball'],
		num: 8,
		gen: 3,
		isPokeball: true,
	},
	netball: {
		name: "Net Ball",
		itemClass: ['pokeball'],
		num: 6,
		gen: 3,
		isPokeball: true,
	},
	parkball: {
		name: "Park Ball",
		itemClass: ['pokeball'],
		num: 500,
		gen: 4,
		isPokeball: true,
		isNonstandard: "Unobtainable",
	},
	pokeball: {
		name: "Poke Ball",
		itemClass: ['pokeball'],
		num: 4,
		gen: 1,
		isPokeball: true,
	},
	premierball: {
		name: "Premier Ball",
		itemClass: ['pokeball'],
		num: 12,
		gen: 3,
		isPokeball: true,
	},
	quickball: {
		name: "Quick Ball",
		itemClass: ['pokeball'],
		num: 15,
		gen: 4,
		isPokeball: true,
	},
	repeatball: {
		name: "Repeat Ball",
		itemClass: ['pokeball'],
		num: 9,
		gen: 3,
		isPokeball: true,
	},
	safariball: {
		name: "Safari Ball",
		itemClass: ['pokeball'],
		num: 5,
		gen: 1,
		isPokeball: true,
	},
	sportball: {
		name: "Sport Ball",
		itemClass: ['pokeball'],
		num: 499,
		gen: 2,
		isPokeball: true,
	},
	strangeball: {
		name: "Strange Ball",
		itemClass: ['pokeball'],
		num: 1785,
		gen: 8,
		isPokeball: true,
		isNonstandard: "Unobtainable",
	},
	timerball: {
		name: "Timer Ball",
		itemClass: ['pokeball'],
		num: 10,
		gen: 3,
		isPokeball: true,
	},
	ultraball: {
		name: "Ultra Ball",
		itemClass: ['pokeball'],
		num: 2,
		gen: 1,
		isPokeball: true,
	},
// #region Silvally Memories
	bugmemory: {
		name: "Bug Memory",
		itemClass: ['species'],
		shortDesc: "Holder's type changes to Bug. Multi-Attack is Bug type.",
		onMemory: 'Bug',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Bug",
		itemUser: ["Silvally-Bug"],
		num: 909,
		gen: 7,
	},
	darkmemory: {
		name: "Dark Memory",
		itemClass: ['species'],
		shortDesc: "Holder's type changes to Dark. Multi-Attack is Dark type.",
		onMemory: 'Dark',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Dark",
		itemUser: ["Silvally-Dark"],
		num: 919,
		gen: 7,
	},
	dragonmemory: {
		name: "Dragon Memory",
		itemClass: ['species'],
		shortDesc: "Holder's type changes to Dragon. Multi-Attack is Dragon type.",
		onMemory: 'Dragon',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Dragon",
		itemUser: ["Silvally-Dragon"],
		num: 918,
		gen: 7,
	},
	electricmemory: {
		name: "Electric Memory",
		itemClass: ['species'],
		shortDesc: "Holder's type changes to Electric. Multi-Attack is Electric type.",
		onMemory: 'Electric',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Electric",
		itemUser: ["Silvally-Electric"],
		num: 915,
		gen: 7,
	},
	fairymemory: {
		name: "Fairy Memory",
		itemClass: ['species'],
		shortDesc: "Holder's type changes to Fairy. Multi-Attack is Fairy type.",
		onMemory: 'Fairy',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Fairy",
		itemUser: ["Silvally-Fairy"],
		num: 920,
		gen: 7,
	},
	fightingmemory: {
		name: "Fighting Memory",
		itemClass: ['species'],
		shortDesc: "Holder's type changes to Fighting. Multi-Attack is Fighting type.",
		onMemory: 'Fighting',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Fighting",
		itemUser: ["Silvally-Fighting"],
		num: 904,
		gen: 7,
	},
	firememory: {
		name: "Fire Memory",
		itemClass: ['species'],
		shortDesc: "Holder's type changes to Fire. Multi-Attack is Fire type.",
		onMemory: 'Fire',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Fire",
		itemUser: ["Silvally-Fire"],
		num: 912,
		gen: 7,
	},
	flyingmemory: {
		name: "Flying Memory",
		itemClass: ['species'],
		shortDesc: "Holder's type changes to Flying. Multi-Attack is Flying type.",
		onMemory: 'Flying',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Flying",
		itemUser: ["Silvally-Flying"],
		num: 905,
		gen: 7,
	},
	ghostmemory: {
		name: "Ghost Memory",
		itemClass: ['species'],
		shortDesc: "Holder's type changes to Ghost. Multi-Attack is Ghost type.",
		onMemory: 'Ghost',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Ghost",
		itemUser: ["Silvally-Ghost"],
		num: 910,
		gen: 7,
	},
	grassmemory: {
		name: "Grass Memory",
		itemClass: ['species'],
		shortDesc: "Holder's type changes to Grass. Multi-Attack is Grass type.",
		onMemory: 'Grass',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false }
			return true;
		},
		forcedForme: "Silvally-Grass",
		itemUser: ["Silvally-Grass"],
		num: 914,
		gen: 7,
	},
	groundmemory: {
		name: "Ground Memory",
		itemClass: ['species'],
		shortDesc: "Holder's type changes to Ground. Multi-Attack is Ground type.",
		onMemory: 'Ground',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Ground",
		itemUser: ["Silvally-Ground"],
		num: 907,
		gen: 7,
	},
	icememory: {
		name: "Ice Memory",
		itemClass: ['species'],
		shortDesc: "Holder's type changes to Ice. Multi-Attack is Ice type.",
		onMemory: 'Ice',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Ice",
		itemUser: ["Silvally-Ice"],
		num: 917,
		gen: 7,
	},
	normalmemory: {
		name: "Normal Memory",
		itemClass: ['species'],
		shortDesc: "Holder's type changes to Normal. Multi-Attack is Normal type.",
		onMemory: 'Normal',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Normal",
		itemUser: ["Silvally-Normal"],
		num: 917,
		gen: 9,
	},
	poisonmemory: {
		name: "Poison Memory",
		itemClass: ['species'],
		shortDesc: "Holder's type changes to Poison. Multi-Attack is Poison type.",
		onMemory: 'Poison',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Poison",
		itemUser: ["Silvally-Poison"],
		num: 906,
		gen: 7,
	},
	psychicmemory: {
		name: "Psychic Memory",
		itemClass: ['species'],
		shortDesc: "Holder's type changes to Psychic. Multi-Attack is Psychic type.",
		onMemory: 'Psychic',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Psychic",
		itemUser: ["Silvally-Psychic"],
		num: 916,
		gen: 7,
	},
	rockmemory: {
		name: "Rock Memory",
		itemClass: ['species'],
		shortDesc: "Holder's type changes to Rock. Multi-Attack is Rock type.",
		onMemory: 'Rock',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Rock",
		itemUser: ["Silvally-Rock"],
		num: 908,
		gen: 7,
	},
	steelmemory: {
		name: "Steel Memory",
		itemClass: ['species'],
		shortDesc: "Holder's type changes to Steel. Multi-Attack is Steel type.",
		onMemory: 'Steel',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Steel",
		itemUser: ["Silvally-Steel"],
		num: 911,
		gen: 7,
	},
	watermemory: {
		name: "Water Memory",
		itemClass: ['species'],
		shortDesc: "Holder's type changes to Water. Multi-Attack is Water type.",
		onMemory: 'Water',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Water",
		itemUser: ["Silvally-Water"],
		num: 913,
		gen: 7,
	},
//region Sweets
	berrysweet: {
		name: "Berry Sweet",
		itemClass: ['sweets', 'evolution', 'fling'],
		fling: { basePower: 10, },
		num: 1111,
		gen: 8,
	},
	cloversweet: {
		name: "Clover Sweet",
		itemClass: ['sweets', 'evolution', 'fling'],
		fling: { basePower: 10, },
		num: 1112,
		gen: 8,
	},
	flowersweet: {
		name: "Flower Sweet",
		itemClass: ['sweets', 'evolution', 'fling'],
		fling: { basePower: 0, },
		num: 1113,
		gen: 8,
	},
	lovesweet: {
		name: "Love Sweet",
		itemClass: ['sweets', 'evolution', 'fling'],
		fling: { basePower: 10, },
		num: 1110,
		gen: 8,
	},
	ribbonsweet: {
		name: "Ribbon Sweet",
		itemClass: ['sweets', 'evolution', 'fling'],
		fling: { basePower: 10, },
		num: 1115,
		gen: 8,
	},
	starsweet: {
		name: "Star Sweet",
		itemClass: ['sweets', 'evolution', 'fling'],
		fling: { basePower: 10, },
		num: 1114,
		gen: 8,
	},
	strawberrysweet: {
		name: "Strawberry Sweet",
		itemClass: ['sweets', 'evolution', 'fling'],
		fling: { basePower: 10, },
		num: 1109,
		gen: 8,
	},
// #region Genesect Drives
	bloomdrive: {
		name: "Bloom Drive",
		itemClass: ['species'],
		shortDesc: "Holder's Techno Blast is Grass type.",
		onTakeItem(item, pokemon, source) { 
			if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) { return false; }
			return true;
		},
		onDrive: 'Grass',
		forcedForme: "Genesect-Bloom",
		itemUser: ["Genesect-Bloom"],
		num: 12000,
		gen: 9,
	},
	burndrive: {
		name: "Burn Drive",
		itemClass: ['species'],
		shortDesc: "Holder's Techno Blast is Fire type.",
		onTakeItem(item, pokemon, source) { 
			if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) { return false; }
			return true;
		},
		onDrive: 'Fire',
		forcedForme: "Genesect-Burn",
		itemUser: ["Genesect-Burn"],
		num: 118,
		gen: 5,
	},
	chilldrive: {
		name: "Chill Drive",
		itemClass: ['species'],
		shortDesc: "Holder's Techno Blast is Ice type.",
		onTakeItem(item, pokemon, source) { 
			if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) { return false; }
			return true;
		},
		onDrive: 'Ice',
		forcedForme: "Genesect-Chill",
		itemUser: ["Genesect-Chill"],
		num: 119,
		gen: 5,
	},
	dousedrive: {
		name: "Douse Drive",
		itemClass: ['species'],
		shortDesc: "Holder's Techno Blast is Water type.",
		onTakeItem(item, pokemon, source) { 
			if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) { return false; }
			return true;
		},
		onDrive: 'Water',
		forcedForme: "Genesect-Douse",
		itemUser: ["Genesect-Douse"],
		num: 116,
		gen: 5,
	},
	galedrive: {
		name: "Gale Drive",
		itemClass: ['species'],
		shortDesc: "Holder's Techno Blast is Flying type.",
		onTakeItem(item, pokemon, source) { 
			if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) { return false; }
			return true;
		},
		onDrive: 'Flying',
		forcedForme: "Genesect-Gale",
		itemUser: ["Genesect-Gale"],
		num: 12000,
		gen: 9,
	},
	rotdrive: {
		name: "Rot Drive",
		itemClass: ['species'],
		shortDesc: "Holder's Techno Blast is Poison type.",
		onTakeItem(item, pokemon, source) { 
			if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) { return false; }
			return true;
		},
		onDrive: 'Poison',
		forcedForme: "Genesect-Rot",
		itemUser: ["Genesect-Rot"],
		num: 12000,
		gen: 9,
	},
	shadedrive: {
		name: "Shade Drive",
		itemClass: ['species'],
		shortDesc: "Holder's Techno Blast is Dark type.",
		onTakeItem(item, pokemon, source) { 
			if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) { return false; }
			return true;
		},
		onDrive: 'Dark',
		forcedForme: "Genesect-Shade",
		itemUser: ["Genesect-Shade"],
		num: 12000,
		gen: 9,
	},
	shockdrive: {
		name: "Shock Drive",
		itemClass: ['species'],
		shortDesc: "Holder's Techno Blast is Electric type.",
		onTakeItem(item, pokemon, source) { 
			if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) { return false; }
			return true;
		},
		onDrive: 'Electric',
		forcedForme: "Genesect-Shock",
		itemUser: ["Genesect-Shock"],
		num: 117,
		gen: 5,
	},
	// #region Mega Stones
	abomasite: {
		name: "Abomasite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Abomasnow": "Abomasnow-Mega" },
		itemUser: ["Abomasnow"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 674,
		gen: 6,
	},
	absolite: {
		name: "Absolite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Absol": "Absol-Mega" },
		itemUser: ["Absol"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 677,
		gen: 6,
	},
	absolitez: {
		name: "Absolite Z",
		itemClass: ['megastone', 'species'],
		megaStone: { "Absol": "Absol-Mega-Z" },
		itemUser: ["Absol"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2638,
		gen: 9,
		isNonstandard: "Future",
	},
	aerodactylite: {
		name: "Aerodactylite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Aerodactyl": "Aerodactyl-Mega" },
		itemUser: ["Aerodactyl"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 672,
		gen: 6,
	},
	aggronite: {
		name: "Aggronite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Aggron": "Aggron-Mega" },
		itemUser: ["Aggron"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 667,
		gen: 6,
	},
	alakazite: {
		name: "Alakazite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Alakazam": "Alakazam-Mega" },
		itemUser: ["Alakazam"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 679,
		gen: 6,
	},
	alcremite: {
		name: "Alcremite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Alcremie": "Alcremie-Mega-Z" },
		itemUser: ["Alcremie"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2582,
		gen: 9,
	},
	altarianite: {
		name: "Altarianite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Altaria": "Altaria-Mega" },
		itemUser: ["Altaria"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 755,
		gen: 6,
	},
	ampharosite: {
		name: "Ampharosite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Ampharos": "Ampharos-Mega" },
		itemUser: ["Ampharos"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 658,
		gen: 6,
	},
	audinite: {
		name: "Audinite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Audino": "Audino-Mega" },
		itemUser: ["Audino"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 757,
		gen: 6,
	},
	banettite: {
		name: "Banettite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Banette": "Banette-Mega" },
		itemUser: ["Banette"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 668,
		gen: 6,
	},
   barbaracite: {
       name: "Barbaracite",
	   itemClass: ['megastone', 'species'],
       megaStone: { "Barbaracle": "Barbaracle-Mega" },
       itemUser: ["Barbaracle"],
       onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
       num: 2581,
       gen: 9,
   },
   baxcalibriteq: {
		name: "Baxcalibrite Q",
		itemClass: ['megastone', 'species'],
		megaStone: { "Baxcalibur": "Baxcalibur-Mega-Q" },
		itemUser: ["Baxcalibur"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2648,
		gen: 9,
	},
	baxcalibritey: {
		name: "Baxcalibrite Y",
		itemClass: ['megastone', 'species'],
		megaStone: { "Baxcalibur": "Baxcalibur-Mega-Y" },
		itemUser: ["Baxcalibur"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2648,
		gen: 9,
	},
   beedrillite: {
       name: "Beedrillite",
	   itemClass: ['megastone', 'species'],
       megaStone: { "Beedrill": "Beedrill-Mega" },
       itemUser: ["Beedrill"],
       onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
       num: 770,
       gen: 6,
   },
   blastoisinitey: {
       name: "Blastoisinite Y",
	   itemClass: ['megastone', 'species'],
       megaStone: { "Blastoise": "Blastoise-Mega-Y" },
       itemUser: ["Blastoise"],
       onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
       num: 661,
       gen: 6,
   },
   blastoisinitez: {
	   name: "Blastoisinite Z",
	   itemClass: ['megastone', 'species'],
	   megaStone: { "Blastoise": "Blastoise-Mega-Z" },
	   itemUser: ["Blastoise"],
	   onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
	   num: 2639,
	   gen: 9,
   },
   blazikenite: {
       name: "Blazikenite",
	   itemClass: ['megastone', 'species'],
       megaStone: { "Blaziken": "Blaziken-Mega" },
       itemUser: ["Blaziken"],
       onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
       num: 664,
       gen: 6,
   },
   cameruptite: {
       name: "Cameruptite",
	   itemClass: ['megastone', 'species'],
       megaStone: { "Camerupt": "Camerupt-Mega" },
       itemUser: ["Camerupt"],
       onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
       num: 767,
       gen: 6,
   },
   centiskite: {
	   name: "Centiskite",
	   itemClass: ['megastone', 'species'],
	   megaStone: { "Centiskorch": "Centiskorch-Mega-Z" },
	   itemUser: ["Centiskorch"],
	   onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
	   num: 2583,
	   gen: 9,
   },
   chandelurite: {
       name: "Chandelurite",
	   itemClass: ['megastone', 'species'],
       megaStone: { "Chandelure": "Chandelure-Mega" },
       itemUser: ["Chandelure"],
       onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
       num: 2574,
       gen: 9,
   },
   charizarditex: {
		name: "Charizardite X",
		itemClass: ['megastone', 'species'],
		megaStone: { "Charizard": "Charizard-Mega-X" },
		itemUser: ["Charizard"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 660,
		gen: 6,
	},
	charizarditey: {
		name: "Charizardite Y",
		itemClass: ['megastone', 'species'],
		megaStone: { "Charizard": "Charizard-Mega-Y" },
		itemUser: ["Charizard"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 678,
		gen: 6,
	},
   chesnaughtite: {
       name: "Chesnaughtite",
	   itemClass: ['megastone', 'species'],
       megaStone: { "Chesnaught": "Chesnaught-Mega" },
       itemUser: ["Chesnaught"],
       onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
       num: 2575,
       gen: 9,
   },
   clefablite: {
		name: "Clefablite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Clefable": "Clefable-Mega" },
		itemUser: ["Clefable"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2559,
		gen: 9,
	},
	chimechite: {
		name: "Chimechite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Chimecho": "Chimecho-Mega" },
		itemUser: ["Chimecho"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		num: 2637,
		gen: 9,
	},
	crabominite: {
		name: "Crabominite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Crabominable": "Crabominable-Mega-X" },
		itemUser: ["Crabominable"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2644,
		gen: 9,
	},
	darkranite: {
		name: "Darkranite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Darkrai": "Darkrai-Mega" },
		itemUser: ["Darkrai"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2568,
		gen: 9,
	},
	delphoxite: {
		name: "Delphoxite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Delphox": "Delphox-Mega" },
		itemUser: ["Delphox"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2576,
		gen: 9,
	},
	diancite: {
		name: "Diancite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Diancie": "Diancie-Mega" },
		itemUser: ["Diancie"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 764,
		gen: 6,
	},
	dragalgite: {
		name: "Dragalgite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Dragalge": "Dragalge-Mega" },
		itemUser: ["Dragalge"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2582,
		gen: 9,
	},
	dragoninite: {
		name: "Dragoninite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Dragonite": "Dragonite-Mega" },
		itemUser: ["Dragonite"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2562,
		gen: 9,
	},
	drampanite: {
		name: "Drampanite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Drampa": "Drampa-Mega" },
		itemUser: ["Drampa"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2585,
		gen: 9,
	},
	eelektrossite: {
		name: "Eelektrossite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Eelektross": "Eelektross-Mega" },
		itemUser: ["Eelektross"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2573,
		gen: 9,
	},
	emboarite: {
		name: "Emboarite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Emboar": "Emboar-Mega" },
		itemUser: ["Emboar"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2569,
		gen: 9,
	},
	excadrite: {
		name: "Excadrite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Excadrill": "Excadrill-Mega" },
		itemUser: ["Excadrill"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2570,
		gen: 9,
	},
	falinksite: {
		name: "Falinksite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Falinks": "Falinks-Mega" },
		itemUser: ["Falinks"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2586,
		gen: 9,
	},
	feraligite: {
		name: "Feraligite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Feraligatr": "Feraligatr-Mega" },
		itemUser: ["Feraligatr"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2564,
		gen: 9,
	},
	floettite: {
		name: "Floettite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Floette": "Floette-Mega" },
		itemUser: ["Floette-Eternal"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2579,
		gen: 9,
	},
	froslassite: {
		name: "Froslassite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Froslass": "Froslass-Mega" },
		itemUser: ["Froslass"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2566,
		gen: 9,
	},
	galladite: {
		name: "Galladite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Gallade": "Gallade-Mega" },
		itemUser: ["Gallade"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 756,
		gen: 6,
	},
	garchompitex: {
		name: "Garchompite X",
		itemClass: ['megastone', 'species'],
		megaStone: { "Garchomp": "Garchomp-Mega-X" },
		itemUser: ["Garchomp"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 683,
		gen: 6,
	},
	garchompitez: {
		name: "Garchompite Z",
		itemClass: ['megastone', 'species'],
		megaStone: { "Garchomp": "Garchomp-Mega-Z" },
		itemUser: ["Garchomp"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2561,
		gen: 9,
	},
	gardevoirite: {
		name: "Gardevoirite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Gardevoir": "Gardevoir-Mega" },
		itemUser: ["Gardevoir"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 657,
		gen: 6,
	},
	gengaritex: {
		name: "Gengarite X",
		itemClass: ['megastone', 'species'],
		megaStone: { "Gengar": "Gengar-Mega-X" },
		itemUser: ["Gengar"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 656,
		gen: 6,
	},
	gengaritez: {
		name: "Gengarite Z",
		itemClass: ['megastone', 'species'],
		megaStone: { "Gengar": "Gengar-Mega-Z" },
		itemUser: ["Gengar"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2560,
		gen: 9,
	},
	glalitite: {
		name: "Glalitite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Glalie": "Glalie-Mega" },
		itemUser: ["Glalie"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 763,
		gen: 6,
	},
	glimmoranite: {
		name: "Glimmoranite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Glimmora": "Glimmora-Mega" },
		itemUser: ["Glimmora"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		num: 2650,
		gen: 9,
	},
	golisopite: {
		name: "Golisopite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Golisopod": "Golisopod-Mega" },
		itemUser: ["Golisopod"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2645,
		gen: 9,
	},
	golurkite: {
		name: "Golurkite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Golurk": "Golurk-Mega" },
		itemUser: ["Golurk"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2642,
		gen: 9,
	},
	greninjite: { // TODO: Figure out if this works on Greninja-Bond
		name: "Greninjite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Greninja": "Greninja-Mega" },
		itemUser: ["Greninja"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2577,
		gen: 9,
	},
	gyaradosite: {
		name: "Gyaradosite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Gyarados": "Gyarados-Mega" },
		itemUser: ["Gyarados"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 676,
		gen: 6,
	},
	hawluchanite: {
		name: "Hawluchanite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Hawlucha": "Hawlucha-Mega" },
		itemUser: ["Hawlucha"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2583,
		gen: 9,
	},
	heatranite: {
		name: "Heatranite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Heatran": "Heatran-Mega" },
		itemUser: ["Heatran"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2567,
		gen: 9,
	},
	heracronite: {
		name: "Heracronite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Heracross": "Heracross-Mega" },
		itemUser: ["Heracross"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 680,
		gen: 6,
	},
	houndoominite: {
		name: "Houndoominite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Houndoom": "Houndoom-Mega" },
		itemUser: ["Houndoom"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 666,
		gen: 6,
	},
	hydranerite: {
		name: "Hydranerite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Hydranero": "Hydranero-Mega-Z" },
		itemUser: ["Hydranero"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2587,
		gen: 9,
	},
	kangaskhanite: {
		name: "Kangaskhanite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Kangaskhan": "Kangaskhan-Mega" },
		itemUser: ["Kangaskhan"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 675,
		gen: 6,
	},
	klinkliteq: {
		name: "Klinklite Q",
		itemClass: ['megastone', 'species'],
		megaStone: { "Klinklang": "Klinklang-Mega" },
		itemUser: ["Klinklang"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 7000,
		gen: 9,
	},
	latiasite: {
		name: "Latiasite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Latias": "Latias-Mega" },
		itemUser: ["Latias"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 684,
		gen: 6,
	},
	latiosite: {
		name: "Latiosite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Latios": "Latios-Mega" },
		itemUser: ["Latios"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 685,
		gen: 6,
	},
	lopunnite: {
		name: "Lopunnite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Lopunny": "Lopunny-Mega" },
		itemUser: ["Lopunny"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 768,
		gen: 6,
	},
	lucarionite: {
		name: "Lucarionite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Lucario": "Lucario-Mega" },
		itemUser: ["Lucario"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 673,
		gen: 6,
	},
	lucarionitez: {
		name: "Lucarionite Z",
		itemClass: ['megastone', 'species'],
		megaStone: { "Lucario": "Lucario-Mega-Z" },
		itemUser: ["Lucario"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2641,
		gen: 9,
	},
	magearnite: {
		name: "Magearnite",
		itemClass: ['megastone', 'species'],
		megaStone: {
			"Magearna": "Magearna-Mega",
			"Magearna-Original": "Magearna-Original-Mega",
		},
		itemUser: ["Magearna", "Magearna-Original"],
		onTakeItem(item, source) {
			return !item.megaStone || (!item.megaStone[source.baseSpecies.name] &&
				!Object.values(item.megaStone).includes(source.baseSpecies.name));
		},
		num: 2646,
		gen: 9,
	},
	malamarite: {
		name: "Malamarite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Malamar": "Malamar-Mega" },
		itemUser: ["Malamar"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2580,
		gen: 9,
	},
	manectite: {
		name: "Manectite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Manectric": "Manectric-Mega" },
		itemUser: ["Manectric"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 682,
		gen: 6,
	},
	mantinite: {
		name: "Mantinite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Mantine": "Mantine-Mega-Z" },
		itemUser: ["Mantine"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2590,
		gen: 9,
	},
	mawilite: {
		name: "Mawilite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Mawile": "Mawile-Mega" },
		itemUser: ["Mawile"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 681,
		gen: 6,
	},
	medichamite: {
		name: "Medichamite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Medicham": "Medicham-Mega" },
		itemUser: ["Medicham"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 665,
		gen: 6,
	},
	meganiumitex: {
		name: "Meganiumite X",
		itemClass: ['megastone', 'species'],
		megaStone: { "Meganium": "Meganium-Mega-X" },
		itemUser: ["Meganium"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2563,
		gen: 9,
	},
	meganiumitey: {
		name: "Meganiumite Y",
		itemClass: ['megastone', 'species'],
		megaStone: { "Meganium": "Meganium-Mega-Y" },
		itemUser: ["Meganium"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2563,
		gen: 9,
	},
	metagrossiteq: {
		name: "Metagrossite Q",
		itemClass: ['megastone', 'species'],
		megaStone: { "Metagross": "Metagross-Mega-Q" },
		itemUser: ["Metagross"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 12000,
		gen: 9,
	},
	metagrossitex: {
		name: "Metagrossite X",
		itemClass: ['megastone', 'species'],
		megaStone: { "Metagross": "Metagross-Mega-X" },
		itemUser: ["Metagross"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 758,
		gen: 6,
		isNonstandard: "Unobtainable",
	},
	meowsticite: {
		name: "Meowsticite",
		itemClass: ['megastone', 'species'],
		megaStone: {
			"Meowstic": "Meowstic-M-Mega",
			"Meowstic-F": "Meowstic-F-Mega",
		},
		itemUser: ["Meowstic", "Meowstic-F"],
		onTakeItem(item, source) { return !item.megaStone || (!item.megaStone[source.baseSpecies.name] && !Object.values(item.megaStone).includes(source.baseSpecies.name)); },
		num: 2643,
		gen: 9,
	},
	mewtwonitex: {
		name: "Mewtwonite X",
		itemClass: ['megastone', 'species'],
		megaStone: { "Mewtwo": "Mewtwo-Mega-X" },
		itemUser: ["Mewtwo"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 662,
		gen: 6,
	},
	mewtwonitey: {
		name: "Mewtwonite Y",
		itemClass: ['megastone', 'species'],
		megaStone: { "Mewtwo": "Mewtwo-Mega-Y" },
		itemUser: ["Mewtwo"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 663,
		gen: 6,
	},
	orbeetlite: {
		name: "Orbeetlite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Orbeetle": "Orbeetle-Mega-Z" },
		itemUser: ["Orbeetle"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2578,
		gen: 9,
	},
	pidgeotite: {
		name: "Pidgeotite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Pidgeot": "Pidgeot-Mega" },
		itemUser: ["Pidgeot"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 762,
		gen: 6,
	},
	pinsirite: {
		name: "Pinsirite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Pinsir": "Pinsir-Mega" },
		itemUser: ["Pinsir"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 671,
		gen: 6,
	},
	pyroarite: {
		name: "Pyroarite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Pyroar": "Pyroar-Mega" },
		itemUser: ["Pyroar"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2578,
		gen: 9,
	},
	raichunitex: {
		name: "Raichunite X",
		itemClass: ['megastone', 'species'],
		megaStone: { "Raichu": "Raichu-Mega-X" },
		itemUser: ["Raichu"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2635,
		gen: 9,
	},
	raichunitey: {
		name: "Raichunite Y",
		itemClass: ['megastone', 'species'],
		megaStone: { "Raichu": "Raichu-Mega-Y" },
		itemUser: ["Raichu"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2636,
		gen: 9,
	},
	sablenite: {
		name: "Sablenite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Sableye": "Sableye-Mega" },
		itemUser: ["Sableye"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 754,
		gen: 6,
	},
	salamenciteq: {
		name: "Salamencite Q",
		itemClass: ['megastone', 'species'],
		megaStone: { "Salamence": "Salamence-Mega-Q" },
		itemUser: ["Salamence"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 12036,
		gen: 9,
	},
	salamencitey: {
		name: "Salamencite Y",
		itemClass: ['megastone', 'species'],
		megaStone: { "Salamence": "Salamence-Mega-Y" },
		itemUser: ["Salamence"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 769,
		gen: 6,
		isNonstandard: "Unobtainable",
	},
	sandacondite: {
		name: "Sandacondite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Sandaconda": "Sandaconda-Mega-Z" },
		itemUser: ["Sandaconda"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2584,
		gen: 9,
	},
	sceptilite: {
		name: "Sceptilite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Sceptile": "Sceptile-Mega" },
		itemUser: ["Sceptile"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 753,
		gen: 6,
	},
	scizorite: {
		name: "Scizorite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Scizor": "Scizor-Mega" },
		itemUser: ["Scizor"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 670,
		gen: 6,
	},
	scolipite: {
		name: "Scolipite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Scolipede": "Scolipede-Mega" },
		itemUser: ["Scolipede"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2571,
		gen: 9,
	},
	scraftinite: {
		name: "Scraftinite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Scrafty": "Scrafty-Mega" },
		itemUser: ["Scrafty"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2572,
		gen: 9,
	},
	sharpedonite: {
		name: "Sharpedonite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Sharpedo": "Sharpedo-Mega" },
		itemUser: ["Sharpedo"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 759,
		gen: 6,
	},
	skarmorite: {
		name: "Skarmorite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Skarmory": "Skarmory-Mega" },
		itemUser: ["Skarmory"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2565,
		gen: 9,
	},
	slowbronite: {
		name: "Slowbronite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Slowbro": "Slowbro-Mega" },
		itemUser: ["Slowbro"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 760,
		gen: 6,
	},
	snorlaxite: {
		name: "Snorlaxite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Snorlax": "Snorlax-Mega" },
		itemUser: ["Snorlax"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2562,
		gen: 9,
	},
	staraptite: {
		name: "Staraptite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Staraptor": "Staraptor-Mega" },
		itemUser: ["Staraptor"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2647,
		gen: 9,
	},
	starminite: {
		name: "Starminite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Starmie": "Starmie-Mega" },
		itemUser: ["Starmie"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2561,
		gen: 9,
	},
	steelixite: {
		name: "Steelixite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Steelix": "Steelix-Mega" },
		itemUser: ["Steelix"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 761,
		gen: 6,
	},
	swampertite: {
		name: "Swampertite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Swampert": "Swampert-Mega" },
		itemUser: ["Swampert"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 752,
		gen: 6,
	},
	tatsugirinite: {
		name: "Tatsugirinite",
		itemClass: ['megastone', 'species'],
		megaStone: {
			"Tatsugiri": "Tatsugiri-Curly-Mega",
			"Tatsugiri-Droopy": "Tatsugiri-Droopy-Mega",
			"Tatsugiri-Stretchy": "Tatsugiri-Stretchy-Mega",
		},
		itemUser: ["Tatsugiri", "Tatsugiri-Droopy", "Tatsugiri-Stretchy"],
		onTakeItem(item, source) {
			return !item.megaStone || (!item.megaStone[source.baseSpecies.name] &&
				!Object.values(item.megaStone).includes(source.baseSpecies.name));
		},
		num: 2649,
		gen: 9,
	},
	tyranitarite: {
		name: "Tyranitarite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Tyranitar": "Tyranitar-Mega" },
		itemUser: ["Tyranitar"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 669,
		gen: 6,
	},
	venusaurite: {
		name: "Venusaurite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Venusaur": "Venusaur-Mega" },
		itemUser: ["Venusaur"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 659,
		gen: 6,
	},
	victreebelite: {
		name: "Victreebelite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Victreebel": "Victreebel-Mega" },
		itemUser: ["Victreebel"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2560,
		gen: 9,
	},
	zygardite: {
		name: "Zygardite",
		itemClass: ['megastone', 'species'],
		megaStone: { "Zygarde": "Zygarde-Mega" },
		itemUser: ["Zygarde-Complete"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2584,
		gen: 9,
	},
	// #region EV Training Items
	poweranklet: {
		name: "Power Anklet",
		ignoreKlutz: true,
		fling: { basePower: 70, },
		onModifySpe(spe) { return this.chainModify(0.5); },
		num: 293,
		gen: 4,
	},
	powerband: {
		name: "Power Band",
		ignoreKlutz: true,
		fling: { basePower: 70, },
		onModifySpe(spe) { return this.chainModify(0.5); },
		num: 292,
		gen: 4,
	},
	powerbelt: {
		name: "Power Belt",
		ignoreKlutz: true,
		fling: { basePower: 70, },
		onModifySpe(spe) { return this.chainModify(0.5); },
		num: 290,
		gen: 4,
	},
	powerbracer: {
		name: "Power Bracer",
		ignoreKlutz: true,
		fling: { basePower: 70, },
		onModifySpe(spe) { return this.chainModify(0.5); },
		num: 289,
		gen: 4,
	},
	powerlens: {
		name: "Power Lens",
		ignoreKlutz: true,
		fling: { basePower: 70, },
		onModifySpe(spe) { return this.chainModify(0.5); },
		num: 291,
		gen: 4,
	},
	powerweight: {
		name: "Power Weight",
		ignoreKlutz: true,
		fling: { basePower: 70, },
		onModifySpe(spe) { return this.chainModify(0.5); },
		num: 294,
		gen: 4,
	},
	// #region Useless Items
	bignugget: {
		name: "Big Nugget",
		itemClass: ['fling'],
		fling: { basePower: 130, },
		num: 581,
		gen: 5,
	},
	bottlecap: {
		name: "Bottle Cap",
		itemClass: ['nouse'],
		fling: { basePower: 30, },
		num: 795,
		gen: 7,
	},
	goldbottlecap: {
		name: "Gold Bottle Cap",
		itemClass: ['nouse'],
		fling: { basePower: 30, },
		num: 796,
		gen: 7,
	},
	prettyfeather: {
		name: "Pretty Feather",
		fling: { basePower: 20, },
		num: 571,
		gen: 5,
	},
	rarebone: {
		name: "Rare Bone",
		itemClass: ['fling'],
		fling: { basePower: 100, },
		num: 106,
		gen: 4,
	},



































	//region REMOVED ITEMS
	choicespecs: {
		name: "Choice Specs",
		itemClass: ['statboost'],
		shortDesc: "1.5x Sp Atk. Holder is locked into the 1st move it chooses.",
		fling: { basePower: 10, },
		onStart(pokemon) {
			if (pokemon.volatiles['choicelock']) { this.debug('removing choicelock'); }
			pokemon.removeVolatile('choicelock');
		},
		onModifyMove(move, pokemon) { pokemon.addVolatile('choicelock'); },
		onModifySpAPriority: 1,
		onModifySpA(spa, pokemon) {
			if (pokemon.volatiles['dynamax']) return;
			return this.chainModify(1.5);
		},
		isChoice: true,
		num: 297,
		gen: 4,
		isNonstandard: "Unobtainable",
	},
	clearamulet: {
		name: "Clear Amulet",
		itemClass: ['utility'],
		shortDesc: "Prevents other Pokemon from lowering the holder's stat stages.",
		fling: { basePower: 30, },
		onTryBoostPriority: 1,
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			for (const i in boost) {
				if (boost[i as BoostID]! < 0) {
					delete boost[i as BoostID];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries && effect.id !== 'octolock') { this.add('-fail', target, 'unboost', '[from] item: Clear Amulet', `[of] ${target}`); } 
		},
		num: 1882,
		gen: 9,
		isNonstandard: "Unobtainable",
	},
	covertcloak: {
		name: "Covert Cloak",
		itemClass: ['utility'],
		shortDesc: "Holder is immune to the secondary effects of other Pokemon's moves.",
		fling: { basePower: 30, },
		onModifySecondaries(secondaries) {
			this.debug('Covert Cloak prevent secondary');
			return secondaries.filter(effect => !!effect.self);
		},
		num: 1885,
		gen: 9,
		isNonstandard: "Unobtainable",
	},
	destinyknot: {
		name: "Destiny Knot",
		itemClass: ['utility'],
		shortDesc: "If holder becomes infatuated, the other Pokemon also becomes infatuated.",
		fling: { basePower: 10, },
		onAttractPriority: -100,
		onAttract(target, source) {
			this.debug(`attract intercepted: ${target} from ${source}`);
			if (!source || source === target) return;
			if (!source.volatiles['attract']) source.addVolatile('attract', target);
		},
		num: 280,
		gen: 4,
		isNonstandard: "Unobtainable",
	},
	flameorb: {
		name: "Flame Orb",
		shortDesc: "At the end of every turn, attempts to Burn holder.",
		fling: {
			basePower: 30,
			status: 'brn',
		},
		onResidualOrder: 28,
		onResidualSubOrder: 3,
		onResidual(pokemon) { pokemon.trySetStatus('brn', pokemon); },
		num: 273,
		gen: 4,
		isNonstandard: "Unobtainable",
	},
	lightclay: { // implemented in the corresponding thing
		name: "Light Clay",
		itemClass: ['utility'],
		shortDesc: "Holder's use of Light Screen or Reflect lasts 8 turns instead of 5.",
		fling: { basePower: 30, },
		num: 269,
		gen: 4,
		isNonstandard: "Unobtainable",
	},
	powerherb: {
		name: "Power Herb",
		itemClass: ['consumable', 'utility'],
		shortDesc: "Holder's two-turn moves complete in one turn. 1 time use.",
		fling: { basePower: 10, },
		onChargeMove(pokemon, target, move) {
			if (pokemon.useItem()) {
				this.debug('power herb - remove charge turn for ' + move.id);
				this.attrLastMove('[still]');
				this.addMove('-anim', pokemon, move.name, target);
				return false; // skip charge turn
			}
		},
		num: 271,
		gen: 4,
		isNonstandard: "Unobtainable",
	},
	//region unused 
	aguavberry: {
		name: "Aguav Berry",
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Dragon",
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
				pokemon.hasAbility('gluttony') && pokemon.abilityState1.gluttony)) {
				pokemon.eatItem();
			}
		},
		onTryEatItem(item, pokemon) {
			if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 3)) return false;
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 3);
			if (pokemon.getNature().minus === 'spd') {
				pokemon.addVolatile('confusion');
			}
		},
		num: 162,
		gen: 3,
		isNonstandard: "Past",
	},
	berryjuice: {
		name: "Berry Juice",
		itemClass: ['healing'],
		shortDesc: "Heals 20HP when the holder'sHP is at 50% or less. 1 time use.",
		fling: { basePower: 30, },
		onUpdate(pokemon) { if (pokemon.hp <= pokemon.maxhp / 2) { if (this.runEvent('TryHeal', pokemon, null, this.effect, 20) && pokemon.useItem()) { this.heal(20); } } },
		num: 43,
		gen: 2,
		isNonstandard: "Past",
	},
	blueorb: {
		name: "Blue Orb",
		itemClass: ['species'],
		shortDesc: "If held by Kyogre, this item triggers its Primal Reversion.",
		onSwitchInPriority: -1,
		onSwitchIn(pokemon) { if (pokemon.isActive && pokemon.baseSpecies.name === 'Kyogre' && !pokemon.transformed) { pokemon.formeChange('Kyogre-Primal', this.effect, true); } },
		onTakeItem(item, source) { if (source.baseSpecies.baseSpecies === 'Kyogre') return false;
			return true;
		},
		itemUser: ["Kyogre"],
		isPrimalOrb: true,
		num: 535,
		gen: 6,
		isNonstandard: "Past",
	},
	brightpowder: {
		name: "Bright Powder",
		itemClass: ['statboost'],
		shortDesc: "1.1x Evasion.",
		fling: { basePower: 10, },
		onModifyAccuracyPriority: -2,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('brightpowder - decreasing accuracy');
			return this.chainModify([3686, 4096]);
		},
		num: 213,
		gen: 2,
		isNonstandard: "Past",
	},
	deepseascale: {
		name: "Deep Sea Scale",
		itemClass: ['species', 'statboost'],
		shortDesc: "If held by Clamperl, its Sp Def is doubled.",
		fling: { basePower: 30, },
		onModifySpDPriority: 2,
		onModifySpD(spd, pokemon) { if (pokemon.baseSpecies.name === 'Clamperl') { return this.chainModify(2); } },
		itemUser: ["Clamperl"],
		num: 227,
		gen: 3,
		isNonstandard: "Past",
	},
	deepseatooth: {
		name: "Deep Sea Tooth",
		itemClass: ['species', 'statboost'],
		shortDesc: "If held by Clamperl, its Sp Atk is doubled.",
		fling: { basePower: 90, },
		onModifySpAPriority: 1,
		onModifySpA(spa, pokemon) { if (pokemon.baseSpecies.name === 'Clamperl') { return this.chainModify(2); } },
		itemUser: ["Clamperl"],
		num: 226,
		gen: 3,
		isNonstandard: "Past",
	},
	leek: {
		name: "Leek",
		itemClass: ['species', 'statboost'],
		shortDesc: "If held by Farfetch'd or Sirfetch'd, its critical hit ratio is raised 2 stages.",
		fling: { basePower: 60, },
		onModifyCritRatio(critRatio, user) { if (["farfetchd", "sirfetchd"].includes(this.toID(user.baseSpecies.baseSpecies))) { return critRatio + 2; } },
		itemUser: ["Farfetch\u2019d", "Farfetch\u2019d-Galar", "Sirfetch\u2019d"],
		num: 259,
		gen: 8,
		isNonstandard: "Past",
	},
	luckypunch: {
		name: "Lucky Punch",
		itemClass: ['species', 'statboost'],
		shortDesc: "If held by Chansey, its critical hit ratio is raised 2 stages.",
		fling: { basePower: 40, },
		onModifyCritRatio(critRatio, user) { if (user.baseSpecies.name === 'Chansey') { return critRatio + 2; } },
		itemUser: ["Chansey"],
		num: 256,
		gen: 2,
		isNonstandard: "Past",
	},
	mail: {
		name: "Mail",
		onTakeItem(item, source) {
			if (!this.activeMove) return false;
			if (this.activeMove.id !== 'knockoff' && this.activeMove.id !== 'thief' && this.activeMove.id !== 'covet') return false;
		},
		num: 137,
		gen: 2,
		shortDesc: "Cannot be stolen or knocked off",
		isNonstandard: "Past",
	},
	redorb: {
		name: "Red Orb",
		itemClass: ['species'],
		shortDesc: "If held by Groudon, this item triggers its Primal Reversion.",
		onSwitchInPriority: -1,
		onSwitchIn(pokemon) { if (pokemon.isActive && pokemon.baseSpecies.name === 'Groudon' && !pokemon.transformed) { pokemon.formeChange('Groudon-Primal', this.effect, true); } },
		onTakeItem(item, source) { if (source.baseSpecies.baseSpecies === 'Groudon') return false;
			return true;
		},
		itemUser: ["Groudon"],
		isPrimalOrb: true,
		num: 534,
		gen: 6,
		isNonstandard: "Past",
	},
	sachet: {
		name: "Sachet",
		itemClass: ['tradeevo'],
		shortDesc: "Evolves Spritzee into Aromatisse when traded.",
		fling: { basePower: 80, },
		num: 647,
		gen: 6,
		isNonstandard: "Past",
	},
	stick: {
		name: "Stick",
		itemClass: ['species', 'statboost'],
		shortDesc: "If held by Farfetch'd, its critical hit ratio is raised 2 stages.",
		fling: { basePower: 60, },
		onModifyCritRatio(critRatio, user) { if (this.toID(user.baseSpecies.baseSpecies) === 'farfetchd') { return critRatio + 2; } },
		itemUser: ["Farfetch\u2019d"],
		num: 259,
		gen: 2,
		isNonstandard: "Past",
	},
	whippeddream: {
		name: "Whipped Dream",
		itemClass: ['tradeevo'],
		shortDesc: "Evolves Swirlix into Slurpuff when traded.",
		fling: { basePower: 80, },
		num: 646,
		gen: 6,
		isNonstandard: "Past",
	},
	figyberry: {
		name: "Figy Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'healing'],
		shortDesc: "If HP≤1/3(or 2/3 with Gluttony), Heals 1/3HP; confuses if holder is Dark, Fairy, Grass, or Psychic type. Fragile; if broken, Heals 1/4HP. Belch Effect: target heals 1/16HP. 1 time use.",
		isBerry: true,
		belch: { effect: function(target) { target.heal(target.maxhp / 16); }, },
        isFragile: true,
        onFragileBreak(pokemon) { this.heal(pokemon.maxhp / 4, pokemon); },
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 3 || (pokemon.hp <= pokemon.maxhp * 2 / 3 &&
				((pokemon.ability1 === 'gluttony' && pokemon.abilityState1.gluttony) ||
				(pokemon.ability2 === 'gluttony' && pokemon.abilityState2.gluttony)))) {
				pokemon.eatItem();
			}
		},
		onTryEatItem(item, pokemon) { if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 3)) return false; },
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 3);
			const types = pokemon.getTypes();
			if (types.includes('Dark') || types.includes('Fairy') || types.includes('Grass') || types.includes('Psychic')) { pokemon.addVolatile('confusion'); }
		},
		num: 159,
		gen: 3,
		isNonstandard: "Past",
	},
	iapapaberry: {
		name: "Iapapa Berry",
		itemClass: ['fragile', 'berry', 'consumable', 'healing'],
		shortDesc: "If HP≤1/3(or 2/3 with Gluttony), Heals 1/3HP; confuses if holder is Electric, Fairy, Ghost, or Psychic type. Fragile; if broken, Heals 1/4HP. Belch Effect: target heals 1/16HP. 1 time use.",
		isBerry: true,
		belch: { effect: function(target) { target.heal(target.maxhp / 16); }, },
        isFragile: true,
        onFragileBreak(pokemon) { this.heal(pokemon.maxhp / 4, pokemon); },
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 3 || (pokemon.hp <= pokemon.maxhp * 2 / 3 &&
				((pokemon.ability1 === 'gluttony' && pokemon.abilityState1.gluttony) ||
				(pokemon.ability2 === 'gluttony' && pokemon.abilityState2.gluttony)))) {
				pokemon.eatItem();
			}
		},
		onTryEatItem(item, pokemon) { if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 3)) return false; },
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 3);
			const types = pokemon.getTypes();
			if (types.includes('Electric') || types.includes('Fairy') || types.includes('Ghost') || types.includes('Psychic')) { pokemon.addVolatile('confusion'); }
		},
		num: 163,
		gen: 3,
		isNonstandard: "Past",
	},
	magoberry: {
		name: "Mago Berry",
		itemClass: ['berry', 'consumable', 'healing'],
		shortDesc: "If HP≤1/4(or 1/2 with Gluttony), Heals 1/3HP; Confuses if holder has a -Speed nature.",
		isBerry: true,
		belch: { basePower: 35 },
		onUpdate(pokemon) { if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && ((pokemon.ability1 === 'gluttony' && pokemon.abilityState1.gluttony) || (pokemon.ability2 === 'gluttony' && pokemon.abilityState2.gluttony)))) { pokemon.eatItem(); } },
		onTryEatItem(item, pokemon) { if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 3)) return false; },
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 3);
			if (pokemon.getNature().minus === 'spe') { pokemon.addVolatile('confusion'); }
		},
		num: 161,
		gen: 3,
		isNonstandard: "Past",
	},
	wikiberry: {
		name: "Wiki Berry",
		itemClass: ['berry', 'consumable', 'healing'],
		shortDesc: "If HP≤1/4(or 1/2 with Gluttony), Heals 1/3HP; confuses if -Sp Atk Nature. 1 time use.",
		isBerry: true,
		belch: { },
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
				((pokemon.ability1 === 'gluttony' && pokemon.abilityState1.gluttony) ||
				(pokemon.ability2 === 'gluttony' && pokemon.abilityState2.gluttony)))) {
				pokemon.eatItem();
			}
		},
		onTryEatItem(item, pokemon) { if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 3)) return false; },
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 3);
			if (pokemon.getNature().minus === 'spa') { pokemon.addVolatile('confusion'); }
		},
		num: 160,
		gen: 3,
		isNonstandard: "Past",
	},
	//region Gen 2 items
	berserkgene: {
		name: "Berserk Gene",
		onUpdate(pokemon) { if (pokemon.useItem()) { pokemon.addVolatile('confusion'); } },
		boosts: { atk: 2, },
		num: 0,
		gen: 2,
		isNonstandard: "Past",
	},
	berry: {
		name: "Berry",
		itemClass: ['berry'],
		isBerry: true,
		onResidualOrder: 10,
		onResidual(pokemon) { if (pokemon.hp <= pokemon.maxhp / 2) { pokemon.eatItem(); } },
		onTryEatItem(item, pokemon) { if (!this.runEvent('TryHeal', pokemon, null, this.effect, 10)) return false; },
		onEat(pokemon) { this.heal(10); },
		num: 155,
		gen: 2,
		isNonstandard: "Past",
	},
	bitterberry: {
		name: "Bitter Berry",
		itemClass: ['berry'],
		isBerry: true,
		onUpdate(pokemon) { if (pokemon.volatiles['confusion']) { pokemon.eatItem(); } },
		onEat(pokemon) { pokemon.removeVolatile('confusion'); },
		num: 156,
		gen: 2,
		isNonstandard: "Past",
	},
	burntberry: {
		name: "Burnt Berry",
		itemClass: ['berry'],
		isBerry: true,
		onUpdate(pokemon) { if (pokemon.status === 'frz') { pokemon.eatItem(); } },
		onEat(pokemon) { if (pokemon.status === 'frz') { pokemon.cureStatus(); } },
		num: 153,
		gen: 2,
		isNonstandard: "Past",
	},
	goldberry: {
		name: "Gold Berry",
		itemClass: ['berry'],
		isBerry: true,
		onResidualOrder: 10,
		onResidual(pokemon) { if (pokemon.hp <= pokemon.maxhp / 2) {  pokemon.eatItem(); } },
		onTryEatItem(item, pokemon) { if (!this.runEvent('TryHeal', pokemon, null, this.effect, 30)) return false; },
		onEat(pokemon) { this.heal(30); },
		num: 158,
		gen: 2,
		isNonstandard: "Past",
	},
	iceberry: {
		name: "Ice Berry",
		itemClass: ['berry'],
		isBerry: true,
		onUpdate(pokemon) { if (pokemon.status === 'brn') { pokemon.eatItem(); } },
		onEat(pokemon) { if (pokemon.status === 'brn') { pokemon.cureStatus(); } },
		num: 152,
		gen: 2,
		isNonstandard: "Past",
	},
	mintberry: {
		name: "Mint Berry",
		itemClass: ['berry'],
		isBerry: true,
		onUpdate(pokemon) { if (pokemon.status === 'slp') { pokemon.eatItem(); } },
		onEat(pokemon) { if (pokemon.status === 'slp') { pokemon.cureStatus(); } },
		num: 150,
		gen: 2,
		isNonstandard: "Past",
	},
	miracleberry: {
		name: "Miracle Berry",
		itemClass: ['berry'],
		isBerry: true,
		onUpdate(pokemon) { if (pokemon.status || pokemon.volatiles['confusion']) { pokemon.eatItem(); } },
		onEat(pokemon) {
			pokemon.cureStatus();
			pokemon.removeVolatile('confusion');
		},
		num: 157,
		gen: 2,
		isNonstandard: "Past",
	},
	mysteryberry: {
		name: "Mystery Berry",
		itemClass: ['berry'],
		isBerry: true,
		onUpdate(pokemon) {
			if (!pokemon.hp) return;
			const moveSlot = pokemon.lastMove && pokemon.getMoveData(pokemon.lastMove.id);
			if (moveSlot && moveSlot.pp === 0) {
				pokemon.addVolatile('leppaberry');
				pokemon.volatiles['leppaberry'].moveSlot = moveSlot;
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			let moveSlot;
			if (pokemon.volatiles['leppaberry']) {
				moveSlot = pokemon.volatiles['leppaberry'].moveSlot;
				pokemon.removeVolatile('leppaberry');
			} else {
				let pp = 99;
				for (const possibleMoveSlot of pokemon.moveSlots) {
					if (possibleMoveSlot.pp < pp) {
						moveSlot = possibleMoveSlot;
						pp = moveSlot.pp;
					}
				}
			}
			moveSlot.pp += 5;
			if (moveSlot.pp > moveSlot.maxpp) moveSlot.pp = moveSlot.maxpp;
			this.add('-activate', pokemon, 'item: Mystery Berry', moveSlot.move);
		},
		num: 154,
		gen: 2,
		isNonstandard: "Past",
	},
	pinkbow: {
		name: "Pink Bow",
		onBasePower(basePower, user, target, move) { if (move.type === 'Normal') { return basePower * 1.1; } },
		num: 251,
		gen: 2,
		isNonstandard: "Past",
	},
	polkadotbow: {
		name: "Polkadot Bow",
		onBasePower(basePower, user, target, move) { if (move.type === 'Normal') { return basePower * 1.1; } },
		num: 251,
		gen: 2,
		isNonstandard: "Past",
	},
	przcureberry: {
		name: "PRZ Cure Berry",
		itemClass: ['berry'],
		isBerry: true,
		onUpdate(pokemon) { if (pokemon.status === 'par') { pokemon.eatItem(); } },
		onEat(pokemon) { if (pokemon.status === 'par') { pokemon.cureStatus(); } },
		num: 149,
		gen: 2,
		isNonstandard: "Past",
	},
	psncureberry: {
		name: "PSN Cure Berry",
		itemClass: ['berry'],
		isBerry: true,
		onUpdate(pokemon) { if (pokemon.status === 'psn' || pokemon.status === 'tox') { pokemon.eatItem(); } },
		onEat(pokemon) { if (pokemon.status === 'psn' || pokemon.status === 'tox') { pokemon.cureStatus(); } },
		num: 151,
		gen: 2,
		isNonstandard: "Past",
	},
};

