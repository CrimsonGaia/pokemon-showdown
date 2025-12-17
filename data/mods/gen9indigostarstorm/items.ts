export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {




	
// #region Berries
	apicotberry: {
		name: "Apicot Berry",
		spritenum: 10,
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { this.boost({ spd: 1 }, pokemon);  },
		naturalGift: {
			basePower: 100,
			type: "Ground",
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp * 2 / 3 || (pokemon.hp <= pokemon.maxhp &&
				((pokemon.ability1 === 'gluttony' && pokemon.abilityState1.gluttony) ||
				(pokemon.ability2 === 'gluttony' && pokemon.abilityState2.gluttony)))) { pokemon.eatItem(); }
		},
		onEat(pokemon) { this.boost({ spd: 1 }); },
		num: 205,
		gen: 3,
	},
	aspearberry: {
		name: "Aspear Berry",
		spritenum: 13,
		isBerry: true,
		belch: { effect: function(target) { if (target.status === 'frz') { target.cureStatus(); } }, },
		naturalGift: {
			basePower: 60,
			type: "Ice",
		},
		onUpdate(pokemon) { if (pokemon.status === 'frz') { pokemon.eatItem(); } },
		onEat(pokemon) { if (pokemon.status === 'frz') { pokemon.cureStatus(); } },
		num: 199,
		gen: 4,
	},
	babiriberry: {
		name: "Babiri Berry",
		spritenum: 17,
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
		naturalGift: {
		basePower: 80,
		type: "Steel",
		},
		onSourceModifyDamage(damage, source, target, move) {
				if (move.type === 'Steel' && target.getMoveHitData(move).typeMod > 0) {
					const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
					if (hitSub) return;
					if (!target.itemState?.chargeditem) {
						if (target.itemState) target.itemState.chargeditem = true;
						this.add('-message', `${target.name}'s Babiri Berry absorbed the blow! ${target.name}'s Babiri Berry is surging with metallic energy!`);
						return this.chainModify(0.5);
					}
					if (target.eatItem()) {
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
	belueberry: {
		name: "Belue Berry",
		spritenum: 21,
		isBerry: true,
		isFragile: true,
		belch: {
			volatileStatus: 'attract',
			chance: 20,
		},
		naturalGift: {
			basePower: 100,
			type: "Electric",
		},
		onEat: false,
		num: 183,
		gen: 3,
	},
	blukberry: {
		name: "Bluk Berry",
		spritenum: 44,
		isBerry: true,
		isFragile: true,
		naturalGift: {
			basePower: 90,
			type: "Fire",
		},
		onEat: false,
		num: 165,
		gen: 3,
		isNonstandard: "Past",
	},
	chartiberry: {
		name: "Charti Berry",
		spritenum: 62,
		isBerry: true,
		isMildlyFragile: true,
		onMildlyFragileBreak(pokemon) {
			if (pokemon.itemState && pokemon.itemState.chargeditem) {
				pokemon.side.addSideCondition('stealrocks', pokemon);
				pokemon.side.foe.addSideCondition('stealrocks', pokemon);
				delete pokemon.itemState.chargeditem;
				this.add('-message', `${pokemon.name}'s Charti Berry returned to normal.`);
			}
		},
		belch: {
			basePower: 130,
			volatileStatus: 'flinch',
			chance: 20,
		},
		naturalGift: {
			basePower: 80,
			type: "Rock",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Rock' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (target.itemState) target.itemState.chargeditem = true;
					this.add('-message', `The force was absorbed by the core of ${target.name}'s Charti Berry! ${target.name}'s Charti Berry is surging with crystalline energy!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
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
	cheriberry: {
		name: "Cheri Berry",
		spritenum: 63,
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { if (pokemon.status === 'par') { pokemon.cureStatus(); } },
		belch: { effect: function(target) { if (target.status === 'par') { target.cureStatus(); } }, },
		naturalGift: {
			basePower: 80,
			type: "Fire",
		},
		onUpdate(pokemon) { if (pokemon.status === 'par') { pokemon.eatItem(); } },
		onEat(pokemon) { if (pokemon.status === 'par') { pokemon.cureStatus(); } },
		num: 149,
		gen: 3,
	},
	chestoberry: {
		name: "Chesto Berry",
		spritenum: 65,
		isBerry: true,
		belch: {
			effect: function(target) { if (target.status === 'slp'  || target.status === 'drowsy') { target.cureStatus(); } },
		},
		naturalGift: {
			basePower: 80,
			type: "Water",
		},
		   onUpdate(pokemon) { if (pokemon.status === 'slp' || pokemon.status === 'drowsy') { pokemon.eatItem(); } },
		   onEat(pokemon) { if (pokemon.status === 'slp' || pokemon.status === 'drowsy') { pokemon.cureStatus(); } },
		num: 150,
		gen: 3,
	},
	chilanberry: {
		name: "Chilan Berry",
		spritenum: 66,
		isBerry: true,
		isFragile: true,
		belch: { basePower: 140 },
		naturalGift: {
			basePower: 80,
			type: "Normal",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (
				move.type === 'Normal' &&
				(!target.volatiles['substitute'] || move.flags['bypasssub'] || (move.infiltrates && this.gen >= 6))
			) {
				if (target.eatItem()) {
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
		spritenum: 71,
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) {
			pokemon.trySetStatus('brn');
			if (pokemon.itemState && pokemon.itemState.chargeditem) { pokemon.addVolatile('focusenergy'); }
		},
		belch: {
			status: 'brn',
			chance: 10,
		},
		naturalGift: {
			basePower: 80,
			type: "Fighting",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Fighting' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (target.itemState) target.itemState.chargeditem = true;
					this.add('-message', `${target.name}'s Chople Berry absorbed the blow! ${target.name}'s Chople Berry is surging with fighting spirit!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
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
		spritenum: 76,
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { if (pokemon.itemState && pokemon.itemState.chargeditem) { pokemon.addVolatile('windburst'); } },
		naturalGift: {
			basePower: 80,
			type: "Flying",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Flying' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (target.itemState) target.itemState.chargeditem = true;
					this.add('-message', `You can feel the winds surging around ${target.name}'s Coba Berry!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
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
		spritenum: 78,
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
		naturalGift: {
			basePower: 80,
			type: "Dark",
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
						if (target.itemState) target.itemState.chargeditem = true;
						this.add('-message', `${target.name}'s Colbur Berry absorbed the blow! ${target.name}'s Colbur Berry is surging with malicious intent!`);
						return this.chainModify(0.5);
					}
					if (target.eatItem()) {
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
	cornnberry: {
		name: "Cornn Berry",
		spritenum: 81,
		isBerry: true,
		naturalGift: {
			basePower: 90,
			type: "Bug",
		},
		onEat: false,
		num: 175,
		gen: 3,
		isNonstandard: "Past",
	},
	custapberry: {
		name: "Custap Berry",
		spritenum: 86,
		isBerry: true,
		belch: { effect: function(target) { target.addVolatile('lagging'); }, },
		naturalGift: {
			basePower: 100,
			type: "Ghost",
		},
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
	durinberry: {
		name: "Durin Berry",
		spritenum: 114,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Water",
		},
		onEat: false,
		num: 182,
		gen: 3,
		isNonstandard: "Past",
	},
	figyberry: {
		name: "Figy Berry",
		spritenum: 140,
		isBerry: true,
		belch: { effect: function(target) { target.heal(target.maxhp / 16); }, },
        isFragile: true,
        onFragileBreak(pokemon) { this.heal(pokemon.maxhp / 4, pokemon); },
		naturalGift: {
			basePower: 80,
			type: "Bug",
		},
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
	},
	ganlonberry: {
		name: "Ganlon Berry",
		spritenum: 158,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Ice",
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
				((pokemon.ability1 === 'gluttony' && pokemon.abilityState1.gluttony) ||
				(pokemon.ability2 === 'gluttony' && pokemon.abilityState2.gluttony)))) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) { this.boost({ def: 1 }); },
		num: 202,
		gen: 3,
	},
	grepaberry: {
		name: "Grepa Berry",
		spritenum: 178,
		isBerry: true,
		isFragile: true,
		naturalGift: {
			basePower: 90,
			type: "Flying",
		},
		onEat: false,
		num: 173,
		gen: 3,
	},
	habanberry: {
		name: "Haban Berry",
		spritenum: 185,
		isBerry: true,
		isMildlyFragile: true,
		onMildlyFragileBreak(pokemon) {
			if (pokemon.itemState && pokemon.itemState.chargeditem) {
			pokemon.trySetStatus('dragonblight');
			delete pokemon.itemState.chargeditem;
			this.add('-message', `${pokemon.name}'s Haban Berry returned to normal.`);
			}
		},
		belch: {
			effect: function(target) { if (this.randomChance(30, 100)) { target.trySetStatus('dragonblight'); } },
		},
		naturalGift: {
			basePower: 80,
			type: "Dragon",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Dragon' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (target.itemState) target.itemState.chargeditem = true;
					this.add('-message', `You can feel the draconic energy radiating from ${target.name}'s Haban Berry!`);
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat(pokemon) { if (pokemon.itemState && pokemon.itemState.chargeditem) { this.heal(75, pokemon); } },
		num: 197,
		gen: 4,
	},
	hondewberry: {
		name: "Hondew Berry",
		spritenum: 213,
		isBerry: true,
		naturalGift: {
			basePower: 90,
			type: "Ground",
		},
		onEat: false,
		num: 172,
		gen: 3,
	},
	iapapaberry: {
		name: "Iapapa Berry",
		spritenum: 217,
		isBerry: true,
		belch: { effect: function(target) { target.heal(target.maxhp / 16); }, },
        isFragile: true,
        onFragileBreak(pokemon) { this.heal(pokemon.maxhp / 4, pokemon); },
		naturalGift: {
			basePower: 80,
			type: "Dark",
		},
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
	},
	jabocaberry: {
		name: "Jaboca Berry",
		spritenum: 230,
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { this.damage(pokemon.maxhp / 10, pokemon); },
		belch: {
			status: 'dragonblight',
			chance: 20,
		},
		naturalGift: {
			basePower: 100,
			type: "Dragon",
		},
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical' && source.hp && source.isActive && !(source.ability1 === 'magicguard' || source.ability2 === 'magicguard')) { if (target.eatItem()) { this.damage(damage, source, target, null); } }
		},
		onEat() { },
		num: 211,
		gen: 4,
	},
	kasibberry: {
		name: "Kasib Berry",
		spritenum: 233,
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
			pokemon.addVolatile('focusenergy');
			if (pokemon.itemState && pokemon.itemState.chargeditem) {
				// Temporarily disable curse immunity
				pokemon.m.kasibBerryCurseImmunityDisabled = true;
				pokemon.trySetStatus('curse');
				// Re-enable immunity after infliction
				pokemon.m.kasibBerryCurseImmunityDisabled = false;
				delete pokemon.itemState.chargeditem;
				this.add('-message', `The trapped spirits were released from ${pokemon.name}'s Kasib Berry.`);
			
			}
		},
		naturalGift: {
			basePower: 80,
			type: "Ghost",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Ghost' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (target.itemState) target.itemState.chargeditem = true;
					this.add('-message', `You can see the spectral wisps emanating from ${target.name}'s Kasib Berry!`);
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat(pokemon) {
			if (pokemon.itemState && pokemon.itemState.chargeditem) {
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
		spritenum: 234,
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
		naturalGift: {
			basePower: 80,
			type: "Poison",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Poison' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (target.itemState) target.itemState.chargeditem = true;
					this.add('-message', `${target.name}'s Kebia Berry absorbed the blow! ${target.name}'s Kebia Berry is bubbling with toxic particles!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
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
	keeberry: {
		name: "Kee Berry",
		spritenum: 593,
		isBerry: true,
		belch: {
			status: 'tox',
			chance: 30,
		},
		naturalGift: {
			basePower: 100,
			type: "Fairy",
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
	kelpsyberry: {
		name: "Kelpsy Berry",
		spritenum: 235,
		isBerry: true,
		belch: {},
		naturalGift: {
			basePower: 90,
			type: "Fighting",
		},
		onEat: false,
		num: 170,
		gen: 3,
	},
	lansatberry: {
		name: "Lansat Berry",
		spritenum: 238,
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { pokemon.addVolatile('focusenergy'); },
		belch: { effect(target, source, move) { target.addVolatile('focusenergy', source, move); }, },
		naturalGift: {
			basePower: 100,
			type: "Flying",
		},
		   onUpdate(pokemon) {
			   // Passive: always grant luckeffect while holding
			   if (!pokemon.volatiles['luckeffect']) { pokemon.addVolatile('luckeffect'); }
			   if (pokemon.hp <= (pokemon.maxhp * 2) / 3 || (pokemon.hp <= pokemon.maxhp &&
				   ((pokemon.ability1 === 'gluttony' && pokemon.abilityState1.gluttony) ||
				(pokemon.ability2 === 'gluttony' && pokemon.abilityState2.gluttony)))) { pokemon.eatItem(); }
		   },
		onEat(pokemon) {
		   pokemon.addVolatile('focusenergy');
		   pokemon.addVolatile('rainboweffect');
		},
		   num: 206,
		   gen: 3,
	},
	leppaberry: {
		name: "Leppa Berry",
		spritenum: 244,
		isBerry: true,
		isFragile: true,
		naturalGift: {
			basePower: 80,
			type: "Fighting",
		},
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
	liechiberry: {
		name: "Liechi Berry",
		spritenum: 248,
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { this.boost({ atk: 1 }, pokemon); },
		naturalGift: {
			basePower: 100,
			type: "Grass",
		},
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
	lumberry: {
		name: "Lum Berry",
		spritenum: 262,
		isBerry: true,
		isFragile: true,
		naturalGift: {
			basePower: 80,
			type: "Flying",
		},
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
	magoberry: {
		name: "Mago Berry",
		spritenum: 274,
		isBerry: true,
		   belch: { basePower: 35 },
		naturalGift: {
			basePower: 80,
			type: "Ghost",
		},
		onUpdate(pokemon) { if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && ((pokemon.ability1 === 'gluttony' && pokemon.abilityState1.gluttony) || (pokemon.ability2 === 'gluttony' && pokemon.abilityState2.gluttony)))) { pokemon.eatItem(); } },
		onTryEatItem(item, pokemon) { if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 3)) return false; },
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 3);
			if (pokemon.getNature().minus === 'spe') { pokemon.addVolatile('confusion'); }
		},
		num: 161,
		gen: 3,
	},
	magostberry: {
		name: "Magost Berry",
		spritenum: 275,
		isBerry: true,
		isFragile: true,
		belch: {},
		naturalGift: {
			basePower: 90,
			type: "Rock",
		},
		onEat: false,
		num: 176,
		gen: 3,
		isNonstandard: "Past",
	},
	marangaberry: {
		name: "Maranga Berry",
		spritenum: 597,
		isBerry: true,
		belch: { },
		naturalGift: {
			basePower: 100,
			type: "Dark",
		},
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
	micleberry: {
		name: "Micle Berry",
		spritenum: 290,
		isBerry: true,
		isFragile: true,
		belch: { },
		naturalGift: {
			basePower: 100,
			type: "Rock",
		},
		onResidual(pokemon) { if (pokemon.hp <= pokemon.maxhp / 2 || (pokemon.hp <= pokemon.maxhp && ((pokemon.ability1 === 'gluttony' && pokemon.abilityState1.gluttony) || (pokemon.ability2 === 'gluttony' && pokemon.abilityState2.gluttony)))) { pokemon.eatItem(); } },
		onEat(pokemon) {
			this.heal(75, pokemon);
			this.boost({accuracy: 3}, pokemon);
			pokemon.addVolatile('micleberry');
		},
		onFragileBreak(pokemon) {
			this.heal(75, pokemon);
			this.boost({accuracy: 3}, pokemon);
			pokemon.addVolatile('micleberry');
		},
		condition: {
			noCopy: true,
			onModifyCritRatio(critRatio) { return critRatio + 3; },
		},
		num: 209,
		gen: 4,
	},
	nanabberry: {
		name: "Nanab Berry",
		spritenum: 302,
		isBerry: true,
		isFragile: true,
		belch: { },
		naturalGift: {
			basePower: 90,
			type: "Water",
		},
		onEat: false,
		num: 166,
		gen: 3,
		isNonstandard: "Past",
	},
	nomelberry: {
		name: "Nomel Berry",
		spritenum: 306,
		isBerry: true,
		belch: { },
		naturalGift: {
			basePower: 90,
			type: "Dragon",
		},
		onEat: false,
		num: 178,
		gen: 3,
		isNonstandard: "Past",
	},
	occaberry: {
		name: "Occa Berry",
		spritenum: 311,
		isBerry: true,
		isMildlyFragile: true,
		onMildlyFragileBreak(pokemon) {
			pokemon.trySetStatus('brn');
			if (pokemon.itemState && pokemon.itemState.chargeditem) {
				if (pokemon.side && pokemon.side.foe) {
					pokemon.side.addSideCondition('SeaofFire', pokemon);
					pokemon.side.foe.addSideCondition('SeaofFire', pokemon);
					pokemon.battle.effectState.SeaofFireTurns = 2;
					this.add('-message', `The flames burst out ${pokemon.name}'s Kasib Berry. The battlefield is engulfed in a Sea of Fire!`);
				}
				delete pokemon.itemState.chargeditem;
			}
		},
		belch: {
			status: 'brn',
			chance: 20,
		},
		naturalGift: {
			basePower: 80,
			type: "Fire",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Fire' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (target.itemState) target.itemState.chargeditem = true;
					this.add('-message', `${target.name}'s Occa Berry absorbed thermal energy! ${target.name}'s Occa Berry is radiating heat!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
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
	oranberry: {
		name: "Oran Berry",
		spritenum: 319,
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { this.heal(25, pokemon); },
		belch: {
			status: 'psn',
			chance: 75,
			effect(target, source, move) { if (target && target.hp > 0) target.heal(10); }, },
		naturalGift: {
			basePower: 80,
			type: "Poison",
		},
		onUpdate(pokemon) { if (pokemon.hp <= pokemon.maxhp / 2) { pokemon.eatItem(); } },
		onTryEatItem(item, pokemon) { if (!this.runEvent('TryHeal', pokemon, null, this.effect, 50)) return false; },
		onEat(pokemon) { this.heal(50); },
		num: 155,
		gen: 3,
	},
	pamtreberry: {
		name: "Pamtre Berry",
		spritenum: 323,
		isBerry: true,
		belch: { },
		naturalGift: {
			basePower: 90,
			type: "Steel",
		},
		onEat: false,
		num: 180,
		gen: 3,
		isNonstandard: "Past",
	},
	passhoberry: {
		name: "Passho Berry",
		spritenum: 329,
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) {
			if (pokemon.status === 'brn') pokemon.cureStatus();
			if (pokemon.itemState && pokemon.itemState.chargeditem) { pokemon.addVolatile('aquaring'); }
		},
		belch: { effect: function(target) { if (target.status === 'brn') target.cureStatus(); }, },
		naturalGift: {
			basePower: 80,
			type: "Water",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Water' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (target.itemState) target.itemState.chargeditem = true;
					this.add('-message', `${target.name}'s Passho Berry absorbed the flow! ${target.name}'s Passho Berry is swirling with aqueous energy!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
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
		spritenum: 330,
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) {
			   // Same effect as onEat
			   const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			   if (target) {  pokemon.transformInto(target, this.dex.abilities.get('imposter')); }
		   },
		naturalGift: {
			basePower: 80,
			type: "Psychic",
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
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		   onEat(pokemon) {
			   // Heal 75 HP when eaten
			   this.heal(75, pokemon);
			   // Try to transform into the opposing active Pokemon, like Imposter
			   const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			   if (target) { pokemon.transformInto(target, this.dex.abilities.get('imposter')); }
		   },
		num: 193,
		gen: 4,
	},
	pechaberry: {
		name: "Pecha Berry",
		spritenum: 333,
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { if (pokemon.status === 'psn' || pokemon.status === 'tox') pokemon.cureStatus(); },
		belch: { effect: function(target) { if (target.status === 'psn' || target.status === 'tox') { target.cureStatus(); } }, },
		naturalGift: {
			basePower: 80,
			type: "Electric",
		},
		onUpdate(pokemon) { if (pokemon.status === 'psn' || pokemon.status === 'tox') { pokemon.eatItem(); } },
		onEat(pokemon) { if (pokemon.status === 'psn' || pokemon.status === 'tox') { pokemon.cureStatus(); } },
		num: 151,
		gen: 3,
	},
	persimberry: {
		name: "Persim Berry",
		spritenum: 334,
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { if (pokemon.volatiles['confusion']) pokemon.removeVolatile('confusion'); },
		belch: { effect(target) { if (target && target.volatiles['confusion']) { target.removeVolatile('confusion'); } }, },
		naturalGift: {
			basePower: 80,
			type: "Ground",
		},
		onUpdate(pokemon) { if (pokemon.volatiles['confusion']) { pokemon.eatItem(); } },
		onEat(pokemon) { pokemon.removeVolatile('confusion'); },
		num: 156,
		gen: 3,
	},
	petayaberry: {
		name: "Petaya Berry",
		spritenum: 335,
		isBerry: true,
		belch: { },
		naturalGift: {
			basePower: 100,
			type: "Poison",
		},
		onUpdate(pokemon) { if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && ((pokemon.ability1 === 'gluttony' && pokemon.abilityState1.gluttony) || (pokemon.ability2 === 'gluttony' && pokemon.abilityState2.gluttony)))) { pokemon.eatItem(); } },
		onEat(pokemon) { this.boost({ spa: 1 }); },
		num: 204,
		gen: 3,
	},
	pinapberry: {
		name: "Pinap Berry",
		spritenum: 337,
		isBerry: true,
		belch: { },
		naturalGift: {
			basePower: 90,
			type: "Grass",
		},
		onEat: false,
		num: 168,
		gen: 3,
		isNonstandard: "Past",
	},
	pomegberry: {
		name: "Pomeg Berry",
		spritenum: 351,
		isBerry: true,
		isFragile: true,
		belch: { },
		naturalGift: {
			basePower: 90,
			type: "Ice",
		},
		onEat: false,
		num: 169,
		gen: 3,
	},
	qualotberry: {
		name: "Qualot Berry",
		spritenum: 371,
		isBerry: true,
		belch: { },
		naturalGift: {
			basePower: 90,
			type: "Poison",
		},
		onEat: false,
		num: 171,
		gen: 3,
	},
	rabutaberry: {
		name: "Rabuta Berry",
		spritenum: 375,
		isBerry: true,
		belch: { },
		naturalGift: {
			basePower: 90,
			type: "Ghost",
		},
		onEat: false,
		num: 177,
		gen: 3,
		isNonstandard: "Past",
	},
	rawstberry: {
		name: "Rawst Berry",
		spritenum: 381,
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { if (pokemon.status === 'brn') pokemon.cureStatus(); },
		belch: { effect: function(target) { if (target.status === 'brn') { target.cureStatus(); } }, },
		naturalGift: {
			basePower: 80,
			type: "Grass",
		},
		onUpdate(pokemon) { if (pokemon.status === 'brn') { pokemon.eatItem(); } },
		onEat(pokemon) { if (pokemon.status === 'brn') { pokemon.cureStatus(); } },
		num: 152,
		gen: 3,
	},
	razzberry: {
		name: "Razz Berry",
		spritenum: 384,
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { if (pokemon.status === 'dragonblight') pokemon.cureStatus(); },
		belch: { effect: function(target) { if (target.status === 'dragonblight') { target.cureStatus(); } }, },
		naturalGift: {
			basePower: 80,
			type: "Steel",
		},
		onUpdate(pokemon) { if (pokemon.status === 'dragonblight') { pokemon.eatItem(); } },
		onEat(pokemon) { if (pokemon.status === 'dragonblight') { pokemon.cureStatus(); } },
		num: 164,
		gen: 3,
	},
	rindoberry: {
		name: "Rindo Berry",
		spritenum: 409,
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
		naturalGift: {
			basePower: 80,
			type: "Grass",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Grass' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (target.itemState) target.itemState.chargeditem = true;
					this.add('-message', `${target.name}'s Rindo Berry absorbed the blow! ${target.name}'s Rindo Berry is glowing with life energy!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
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
		spritenum: 603,
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
		naturalGift: {
			basePower: 80,
			type: "Fairy",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Fairy' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (target.itemState) target.itemState.chargeditem = true;
					this.add('-message', `${target.name}'s Roseli Berry absorbed the spell! ${target.name}'s Roseli Berry is swirling with magical energy!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
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
	rowapberry: {
		name: "Rowap Berry",
		spritenum: 420,
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) {
			// Remove grounded hazards from the user's side
		   const hazards = ['spikes', 'toxicspikes', 'stickyweb', 'steelspikes'];
		   for (const hazard of hazards) { if (pokemon.side.removeSideCondition(hazard)) { this.add('-message', `Rowap pods broke loose and spun the ${this.dex.conditions.get(hazard).name} away!`); } }
	   },
		belch: { effect(target) { if (target && target.status === 'aura') { target.cureStatus(); } }, },
		naturalGift: {
			basePower: 100,
			type: "Dark",
		},
		   onDamagingHit(damage, target, source, move) {
			   if (move.category === 'Special' && source.hp && source.isActive && !(source.ability1 === 'magicguard' || source.ability2 === 'magicguard')) {
				   if (target.eatItem()) {
					   // Reflect the damage dealt back to the attacker
					   this.damage(damage, source, target, null);
					   // Boost the holder's Sp. Def by 1
					   this.boost({spd: 1}, target);
				   }
			   }
		   },
		onEat() { },
		num: 212,
		gen: 4,
	},
	salacberry: {
		name: "Salac Berry",
		spritenum: 426,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Fighting",
		},
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
	shucaberry: {
		name: "Shuca Berry",
		spritenum: 443,
		isBerry: true,
		isFragile: true,
		naturalGift: {
			basePower: 80,
			type: "Ground",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Ground' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (target.itemState) target.itemState.chargeditem = true;
					this.add('-message', `${target.name}'s Shuca Berry absorbed the blow! ${target.name}'s Shuca Berry is shaking with terrestrial energy!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
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
	sitrusberry: {
		name: "Sitrus Berry",
		spritenum: 448,
		isBerry: true,
		isFragile: true,
		belch: { effect: function(target) { target.heal(target.maxhp / 24); }, },
        onFragileBreak(pokemon) { this.heal(pokemon.maxhp / 8, pokemon); },
		naturalGift: {
			basePower: 80,
			type: "Psychic",
		},
		onUpdate(pokemon) { if (pokemon.hp <= pokemon.maxhp / 2) { pokemon.eatItem(); } },
		onTryEatItem(item, pokemon) { if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 4)) return false; },
		onEat(pokemon) { this.heal(pokemon.baseMaxhp / 4); },
		num: 158,
		gen: 3,
	},
	spelonberry: {
		name: "Spelon Berry",
		spritenum: 462,
		isBerry: true,
		isFragile: true,
		onFragileBreak(pokemon) { pokemon.trySetStatus('brn'); },
		naturalGift: {
		   basePower: 90,
		   type: "Dark",
		},
	   belch: {
		   effect(target, source, move) {
			   if (this.randomChance(30, 100)) { target.trySetStatus('brn', source, move); }
			   // Only apply Poison/Fire type the first time after consumption
			   if (move && move.type === 'Poison' && source && !source.volatiles['spelonberrybelch']) {
				   move.type = 'Poison/Fire';
				   this.add('-activate', source, 'item: Spelon Berry', '[dualtype]', 'Poison/Fire');
				   source.addVolatile('spelonberrybelch');
              // Override onImmunity to ignore Steel's Poison immunity
					const origOnTryImmunity = move.onTryImmunity;
					move.onTryImmunity = function(target, source, move_) {
						// Only override for Poison type moves, Steel targets, and spelonberrybelch volatile
						if (move_ && move_.type === 'Poison' && target.hasType && target.hasType('Steel') && target.volatiles['spelonberrybelch']) { return false; } // Ignore Steel's Poison immunity
						if (typeof origOnTryImmunity === 'function') { return origOnTryImmunity.call(this, target, source, move_); }
						return undefined;
					};
				}
		   },
	   },
 		onEat: false,
		num: 179,
		gen: 3,
	},
	starfberry: {
		name: "Starf Berry",
		spritenum: 472,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Psychic",
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
				((pokemon.ability1 === 'gluttony' && pokemon.abilityState1.gluttony) ||
				(pokemon.ability2 === 'gluttony' && pokemon.abilityState2.gluttony)))) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			const stats: BoostID[] = [];
			let stat: BoostID;
			for (stat in pokemon.boosts) { if (stat !== 'accuracy' && stat !== 'evasion' && pokemon.boosts[stat] < 6) { stats.push(stat); } }
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
	tamatoberry: {
		name: "Tamato Berry",
		spritenum: 486,
		isBerry: true,
		isFragile: true,
		naturalGift: {
			basePower: 90,
			type: "Psychic",
		},
		onEat: false,
		num: 174,
		gen: 3,
	},
	tangaberry: {
		name: "Tanga Berry",
		spritenum: 487,
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
		naturalGift: {
			basePower: 80,
			type: "Bug",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Bug' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (!target.itemState?.chargeditem) {
					if (target.itemState) target.itemState.chargeditem = true;
					this.add('-message', `${target.name}'s Tanga Berry absorbed the blow! ${target.name}'s Tanga Berry is swarming with energy!`);
					return this.chainModify(0.5);
				}
				if (target.eatItem()) {
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
		spritenum: 526,
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
		naturalGift: {
			basePower: 80,
			type: "Electric",
		},
		   onSourceModifyDamage(damage, source, target, move) {
			   if (move.type === 'Electric' && target.getMoveHitData(move).typeMod > 0) {
				   const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				   if (hitSub) return;
				   if (!target.itemState?.chargeditem) {
					   if (target.itemState) target.itemState.chargeditem = true;
					   this.add('-message', `${target.name}'s Wacan Berry absorbed the shock! ${target.name}'s Wacan Berry is surging with electricity!`);
					   return 0;
				   }
				   if (target.eatItem()) {
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
	watmelberry: {
		name: "Watmel Berry",
		spritenum: 530,
		isBerry: true,
		isFragile: true,
		belch: { },
		naturalGift: {
			basePower: 100,
			type: "Fire",
		},
		onEat: false,
		num: 181,
		gen: 3,
		isNonstandard: "Past",
	},
	wepearberry: {
		name: "Wepear Berry",
		spritenum: 533,
		isBerry: true,
		belch: { },
		naturalGift: {
			basePower: 90,
			type: "Electric",
		},
		onEat: false,
		num: 167,
		gen: 3,
		isNonstandard: "Past",
	},
	wikiberry: {
		name: "Wiki Berry",
		spritenum: 538,
		isBerry: true,
		belch: { },
		naturalGift: {
			basePower: 80,
			type: "Rock",
		},
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
	},
	yacheberry: {
		name: "Yache Berry",
		spritenum: 567,
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
		naturalGift: {
			basePower: 80,
			type: "Ice",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Ice' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				   if (!target.itemState?.chargeditem) {
					   if (target.itemState) target.itemState.chargeditem = true;
					   this.add('-message', `${target.name}'s Yache Berry absorbed the cold! ${target.name}'s Yache Berry is surging with icy energy!`);
					   return this.chainModify(0.5);
				   }
				if (target.eatItem()) {
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
// #region Battle Items
	abilityshield: {
		name: "Ability Shield",
		spritenum: 746,
		fling: { basePower: 30, },
		ignoreKlutz: true,
		onTryBoost(boost, target, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				let blocked = false;
				for (const stat in boost) { if (boost[stat as BoostID]! < 0) { blocked = true; } }
				if (blocked) { this.add('-block', target, 'item: Ability Shield');
					return null;
				}
			}
		},
		onTryAddVolatile(status, pokemon, source, effect) { if (effect && effect.effectType === 'Ability') { this.add('-block', pokemon, 'item: Ability Shield');
			return null;
			}
		},
		// Prevents damage modifiers from opponent abilities
		onSourceModifyDamage(damage, source, target, move) { if (source && source !== target && source.ability1 && source.ability2) { return damage; } },
		onTryHit(target, source, move) { // Immunity to protection breaking effects
			if (move && (move.breaksProtect || move.flags['bypasssub'] || move.flags['pierce'] || move.pierce1 || move.pierce2 || move.pierce3 || source.hasAbility('infiltrator'))) {
				this.add('-block', target, 'item: Ability Shield');
				return null;
			}
		},
		num: 1881,
		gen: 9,
	},
	absorbbulb: {
		name: "Absorb Bulb",
		spritenum: 2,
		fling: { basePower: 30, },
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) { if (move.flags['drain']) { return this.chainModify([6144, 4096]);  } },
		onEffectiveness(typeMod, target, type, move) { if (type === 'Water') { return 0; } },
		onDamagingHit(damage, target, source, move) { if (move.type === 'Water') { 
			this.heal(target.baseMaxhp / 8, target);
			this.add('-message', `${target.name}'s Absorb Bulb absorbed the flow! ${target.name}'s Absorb Bulb is swirling with aqueous energy!`);
			if (!this.effectState.absorbCount) this.effectState.absorbCount = 0;
			this.effectState.absorbCount++;
			if (this.effectState.absorbCount >= 2) { // After absorbing 2 moves, burst and grant aqua ring
				target.addVolatile('aquaring');
				this.add('-message', `${target.name}'s Absorb Bulb burst! ${target.name} is surrounded by a veil of water!`);
				target.useItem();
			}
		} },
		num: 545,
		gen: 5,
	},
	airballoon: {
		name: "Air Balloon",
		spritenum: 541,
		onAfterMoveSecondary(target, source, move) {
			if (target.volatiles['airballoon'] && move && move.flags['contact']) { target.item = '';
				this.clearEffectState(target.itemState);
				this.runEvent('AfterUseItem', target, null, null, this.dex.items.get('airballoon'));
			}
		},
		num: 541,
		gen: 5,
	},
	bigroot: {
		name: "Big Root",
		spritenum: 29,
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
		spritenum: 31,
		fling: { basePower: 30, },
		num: 544,
		gen: 5,
		onModifyDamage(damage, source, target, move) { if (move.flags['binding']) { return this.chainModify(1.2); } },
	},
	blacksludge: {
		name: "Black Sludge",
		spritenum: 34,
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
		spritenum: 716,
		fling: { basePower: 80, },
		num: 1121,
		gen: 8,
	},
	boosterenergy: {
		name: "Booster Energy",
		spritenum: 745,
		fling: { basePower: 30, },
		onSwitchInPriority: -2,
		onStart(pokemon) { this.effectState.started = true; ((this.effect as any).onUpdate as (p: Pokemon) => void).call(this, pokemon); },
		onUpdate(pokemon) {
			if (!this.effectState.started || pokemon.transformed) return;
			if ((pokemon.ability1 === 'protosynthesis' || pokemon.ability2 === 'protosynthesis') && !this.field.isWeather('sunnyday') && pokemon.useItem()) { pokemon.addVolatile('protosynthesis'); }
			if ((pokemon.ability1 === 'quarkdrive' || pokemon.ability2 === 'quarkdrive') && !this.field.isTerrain('electricterrain') && pokemon.useItem()) { pokemon.addVolatile('quarkdrive'); }
		},
		onTakeItem(item, source) { if (source.baseSpecies.tags.includes("Paradox")) return false;
			return true;
		},
		num: 1880,
		gen: 9,
	},
	brightpowder: {
		name: "Bright Powder",
		spritenum: 51,
		fling: { basePower: 10, },
		onModifyAccuracyPriority: -2,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('brightpowder - decreasing accuracy');
			return this.chainModify([3686, 4096]);
		},
		num: 213,
		gen: 2,
	},
	cellbattery: {
		name: "Cell Battery",
		spritenum: 60,
		fling: { basePower: 30, },
		onResidual(pokemon) {
			if (pokemon.item === 'cellbattery' && pokemon.itemState && pokemon.itemState.charged && !pokemon.volatiles['charged']) {
				pokemon.addVolatile('charged');
				pokemon.itemState.charged = false;
				this.add('-message', `${pokemon.name} absorbed the Cell Battery's charge!`);
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Electric') { // Check if the item itself is charged (stored in itemState)
				if (target.itemState && target.itemState.charged) { // Battery explodes - 40 BP Electric explosion to all Pokemon
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
				} else { // First hit - boost stats, give user charge volatile, and charge the item
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
		spritenum: 68,
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
		num: 220,
		gen: 3,
	},
	choicescarf: {
		name: "Choice Scarf",
		spritenum: 69,
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
		num: 287,
		gen: 4,
	},
	choicespecs: {
		name: "Choice Specs",
		spritenum: 70,
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
	},
	clearamulet: {
		name: "Clear Amulet",
		spritenum: 747,
		fling: { basePower: 30, },
		onTryBoostPriority: 1,
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			let i: BoostID;
			for (i in boost) { if (boost[i]! < 0) { delete boost[i]; showMsg = true; } }
			if (showMsg && !(effect as ActiveMove).secondaries && effect.id !== 'octolock') { this.add('-fail', target, 'unboost', '[from] item: Clear Amulet', `[of] ${target}`); } 
		},
		num: 1882,
		gen: 9,
	},
	covertcloak: {
		name: "Covert Cloak",
		spritenum: 750,
		fling: { basePower: 30, },
		onModifySecondaries(secondaries) {
			this.debug('Covert Cloak prevent secondary');
			return secondaries.filter(effect => !!effect.self);
		},
		num: 1885,
		gen: 9,
	},
	destinyknot: {
		name: "Destiny Knot",
		spritenum: 95,
		fling: { basePower: 10, },
		onAttractPriority: -100,
		onAttract(target, source) {
			this.debug(`attract intercepted: ${target} from ${source}`);
			if (!source || source === target) return;
			if (!source.volatiles['attract']) source.addVolatile('attract', target);
		},
		num: 280,
		gen: 4,
	},
	ejectbutton: {
		name: "Eject Button",
		spritenum: 118,
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
		spritenum: 714,
		fling: { basePower: 50, },
		onAfterBoost(boost, pokemon) {
			if (this.effectState.eject || this.activeMove?.id === 'partingshot') return;
			let i: BoostID;
			for (i in boost) { if (boost[i]! < 0) { this.effectState.eject = true;
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
		num: 1119,
		gen: 8,
	},
	eviolite: {
		name: "Eviolite",
		spritenum: 130,
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
		spritenum: 132,
		fling: { basePower: 10, },
		onModifyDamage(damage, source, target, move) { if (move && target.getMoveHitData(move).typeMod > 0) { return this.chainModify([5325, 4096]); } },
		num: 268,
		gen: 4,
	},
	flameorb: {
		name: "Flame Orb",
		spritenum: 145,
		fling: {
			basePower: 30,
			status: 'brn',
		},
		onResidualOrder: 28,
		onResidualSubOrder: 3,
		onResidual(pokemon) { pokemon.trySetStatus('brn', pokemon); },
		num: 273,
		gen: 4,
	},
	floatstone: {
		name: "Float Stone",
		spritenum: 147,
		fling: { basePower: 30, },
		onModifyWeight(weighthg) { return this.trunc(weighthg / 2); },
		onModifySpe(spe) { return this.chainModify(1.2); },
		onSourceModifyDamage(damage, source, target, move) { if (move.flags['crash'] || move.flags['launch']) { return this.chainModify(1.2); } },
		num: 539,
		gen: 5,
	},
	focusband: {
		name: "Focus Band",
		spritenum: 150,
		fling: { basePower: 10, },
		onDamagePriority: -40,
		onDamage(damage, target, source, effect) {
			if (this.randomChance(1, 10) && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add("-activate", target, "item: Focus Band");
				return target.hp - 1;
			}
		},
		num: 230,
		gen: 2,
	},
	focussash: {
		name: "Focus Sash",
		spritenum: 151,
		fling: { basePower: 10, },
		onDamagePriority: -40,
		onDamage(damage, target, source, effect) { if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') { if (target.useItem()) { return target.hp - 1; } } },
		num: 275,
		gen: 4,
	},
	gripclaw: {
		name: "Grip Claw",
		spritenum: 179,
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
		spritenum: 715,
		fling: { basePower: 80, },
		num: 1120,
		gen: 8,
	},
	laggingtail: {
		name: "Lagging Tail",
		spritenum: 237,
		fling: { basePower: 10, },
		onFractionalPriority: -0.1,
		num: 279,
		gen: 4,
	},
	leftovers: {
		name: "Leftovers",
		spritenum: 242,
		fling: { basePower: 10, },
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) { this.heal(pokemon.baseMaxhp / 16); },
		num: 234,
		gen: 2,
	},
	lifeorb: {
		name: "Life Orb",
		spritenum: 249,
		fling: { basePower: 30, },
		onModifyDamage(damage, source, target, move) { return this.chainModify([5324, 4096]); },
		onAfterMoveSecondarySelf(source, target, move) { if (source && source !== target && move && move.category !== 'Status' && !source.forceSwitchFlag) { this.damage(source.baseMaxhp / 10, source, source, this.dex.items.get('lifeorb')); } },
		num: 270,
		gen: 4,
	},
	ironball: { // airborneness negation implemented in sim/pokemon.js:Pokemon#isGrounded
		name: "Iron Ball",
		spritenum: 224,
		fling: { basePower: 130, },
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
	lightclay: { // implemented in the corresponding thing
		name: "Light Clay",
		spritenum: 252,
		fling: { basePower: 30, },
		num: 269,
		gen: 4,
	},
	loadeddice: { // partially implemented in sim/battle-actions.ts:BattleActions#hitStepMoveHitLoop
		name: "Loaded Dice",
		spritenum: 751,
		fling: { basePower: 30, },
		onModifyMove(move) { if (move.multiaccuracy) { delete move.multiaccuracy; } },
		num: 1886,
		gen: 9,
	},
	luminousmoss: {
		name: "Luminous Moss",
		spritenum: 595,
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
		spritenum: 285,
		fling: {
			basePower: 10,
			effect(pokemon) {
				const conditions = ['attract', 'taunt', 'encore', 'torment', 'disable', 'healblock'];
				for (const firstCondition of conditions) {
					if (pokemon.volatiles[firstCondition]) { for (const secondCondition of conditions) {
							pokemon.removeVolatile(secondCondition);
							if (firstCondition === 'attract' && secondCondition === 'attract') { this.add('-end', pokemon, 'move: Attract', '[from] item: Mental Herb'); }
						} return;
					}
				}
			},
		},
		onUpdate(pokemon) {
			const conditions = ['attract', 'taunt', 'encore', 'torment', 'disable', 'healblock'];
			for (const firstCondition of conditions) {
				if (pokemon.volatiles[firstCondition]) {
					if (!pokemon.useItem()) return;
					for (const secondCondition of conditions) { pokemon.removeVolatile(secondCondition);
					if (firstCondition === 'attract' && secondCondition === 'attract') { this.add('-end', pokemon, 'move: Attract', '[from] item: Mental Herb'); }
					} return;
				}
			}
		},
		num: 219,
		gen: 3,
	},
	metronome: {
		name: "Metronome",
		spritenum: 289,
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
				if (this.effectState.lastMove === move.id) {
					this.effectState.numConsecutive++;
				} else {
					this.effectState.numConsecutive = 1;
				}
				this.effectState.lastMove = move.id;
			},
			onModifyDamage(damage, source, target, move) {
				// 30% stacking bonus per consecutive use, max 5x (2.5x = 1 + 0.3 * 5 consecutive uses)
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
		spritenum: 748,
		fling: { basePower: 30, },
		onFoeAfterBoost(boost, target, source, effect) {
			if (effect?.name === 'Opportunist' || effect?.name === 'Mirror Herb') return;
			if (!this.effectState.boosts) this.effectState.boosts = {} as SparseBoostsTable;
			const boostPlus = this.effectState.boosts;
			let i: BoostID;
			for (i in boost) { if (boost[i]! > 0) { boostPlus[i] = (boostPlus[i] || 0) + boost[i]!;
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
		spritenum: 297,
		fling: { basePower: 10, },
		onBasePowerPriority: 16,
		onBasePower(basePower, user, target, move) { if (move.category === 'Physical') { return this.chainModify([4505, 4096]); } },
		num: 266,
		gen: 4,
	},
	powerherb: {
		onChargeMove(pokemon, target, move) {
			if (pokemon.useItem()) {
				this.debug('power herb - remove charge turn for ' + move.id);
				this.attrLastMove('[still]');
				this.addMove('-anim', pokemon, move.name, target);
				return false; // skip charge turn
			}
		},
		name: "Power Herb",
		spritenum: 358,
		fling: { basePower: 10, },
		num: 271,
		gen: 4,
	},
	protectivepads: { // protective effect handled in Battle#checkMoveMakesContact
		name: "Protective Pads",
		spritenum: 663,
		fling: { basePower: 30, },
		onDamagePriority: -40,
		onDamage(damage, target, source, effect) { if (effect && (effect.id === 'recoil' || effect.id === 'crash')) { return Math.ceil(damage * 0.5); } },
		onTryHit(target, source, move) { if (move && (move.breaksProtect || move.flags['bypasssub'] || move.flags['pierce'])) { 
				this.add('-block', target, 'item: Protective Pads');
				return null;
			}
		},
		num: 880,
		gen: 7,
	},
	punchingglove: {
		name: "Punching Glove",
		spritenum: 749,
		fling: { basePower: 30, },
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) { if (move.flags['punch']) { 
			this.debug('Punching Glove boost');
			return this.chainModify(1.2);
			}
		},
		onModifyMovePriority: 1,
		onModifyMove(move) { if (move.flags['punch']) delete move.flags['contact']; },
		onSourceModifyDamage(damage, source, target, move) { if (move.flags['punch']) { return this.chainModify(0.5); } },
		onTryHit(target, source, move) { if (move && (move.breaksProtect || move.flags['bypasssub'] || move.flags['pierce'])) { 
			this.add('-block', target, 'item: Punching Glove');
			return null;
			}
		},
		num: 1884,
		gen: 9,
	},
	quickclaw: {
		onFractionalPriorityPriority: -2,
		onFractionalPriority(priority, pokemon, target, move) {
			if (move.category === "Status" && (pokemon.ability1 === "myceliummight" || pokemon.ability2 === "myceliummight")) return;
			if (priority <= 0 && this.randomChance(1, 5)) { this.add('-activate', pokemon, 'item: Quick Claw');
				return 0.1;
			}
		},
		name: "Quick Claw",
		spritenum: 373,
		fling: { basePower: 80, },
		num: 217,
		gen: 2,
	},
	redcard: {
		name: "Red Card",
		spritenum: 387,
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
		spritenum: 410,
		fling: { basePower: 10, },
		onNegateImmunity: false,
		num: 543,
		gen: 5,
	},
	rockyhelmet: {
		name: "Rocky Helmet",
		spritenum: 417,
		fling: { basePower: 60, },
		onDamagingHitOrder: 2,
		onDamagingHit(damage, target, source, move) { if (this.checkMoveMakesContact(move, source, target)) { this.damage(source.baseMaxhp / 6, source, target); } },
		num: 540,
		gen: 5,
	},
	roomservice: {
		name: "Room Service",
		spritenum: 717,
		fling: { basePower: 100, },
		onFractionalPriorityPriority: -2,
		onFractionalPriority(priority, pokemon) { // Under Trick Room, Magic Room, or Wonder Room: moves first in priority bracket, moves last otherwise
			const hasRoom = this.field.getPseudoWeather('trickroom') || this.field.getPseudoWeather('magicroom') || this.field.getPseudoWeather('wonderroom');
			if (hasRoom) { return 0.1; } 
			else { return -0.1;  }
		},
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) { const hasRoom = this.field.getPseudoWeather('trickroom') || this.field.getPseudoWeather('magicroom') || this.field.getPseudoWeather('wonderroom');
			if (hasRoom) { const ally = pokemon.side.active.find(p => p && p !== pokemon && p.hp);
			if (ally) {
				this.heal(ally.baseMaxhp / 16, ally);
				this.add('-activate', pokemon, 'item: Room Service');
			} }
		},
		num: 1122,
		gen: 8,
	},
	safetygoggles: {
		name: "Safety Goggles",
		spritenum: 604,
		fling: { basePower: 80, },
		onImmunity(type, pokemon) { if (type === 'sandstorm' || type === 'hail' || type === 'powder') return false; },
		onTryHit(pokemon, source, move) { if (move.flags['powder'] && pokemon !== source && this.dex.getImmunity('powder', pokemon)) { this.add('-activate', pokemon, 'item: Safety Goggles', move.name);
			return null;
			}
		},
		num: 650,
		gen: 6,
	},
	scopelens: {
		name: "Scope Lens",
		spritenum: 429,
		fling: { basePower: 30, },
		onModifyCritRatio(critRatio) { return critRatio + 1; },
		num: 232,
		gen: 2,
	},
	shedshell: {
		name: "Shed Shell",
		spritenum: 437,
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
		spritenum: 438,
		fling: { basePower: 30, },
		onAfterMoveSecondarySelfPriority: -1,
		onAfterMoveSecondarySelf(pokemon, target, move) { if (move.totalDamage && !pokemon.forceSwitchFlag) { this.heal(move.totalDamage / 8, pokemon); } },
		num: 253,
		gen: 3,
	},
	stickybarb: {
		name: "Sticky Barb",
		spritenum: 476,
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
		spritenum: 713,
		fling: { basePower: 30, },
		onAfterMoveSecondarySelf(target, source, move) { if (move.flags['sound']) { target.useItem(); } },
		boosts: { spa: 1, },
		num: 1118,
		gen: 8,
	},
	toxicorb: {
		name: "Toxic Orb",
		spritenum: 515,
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
		spritenum: 718,
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
		spritenum: 609,
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
		spritenum: 535,
		fling: {
			basePower: 10,
			effect(pokemon) {
				let activate = false;
				const boosts: SparseBoostsTable = {};
				let i: BoostID;
				for (i in pokemon.boosts) {
					if (pokemon.boosts[i] < 0) {
						activate = true;
						boosts[i] = 0;
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
			let i: BoostID;
			for (i in pokemon.boosts) {
				if (pokemon.boosts[i] < 0) {
					ready = true;
					this.effectState.boosts[i] = 0;
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
		spritenum: 537,
		fling: { basePower: 10, },
		onSourceModifyAccuracyPriority: -2,
		onSourceModifyAccuracy(accuracy) { if (typeof accuracy === 'number') { return this.chainModify([4505, 4096]); } },
		num: 265,
		gen: 4,
	},
	wiseglasses: {
		name: "Wise Glasses",
		spritenum: 539,
		fling: { basePower: 10, },
		onBasePowerPriority: 16,
		onBasePower(basePower, user, target, move) { if (move.category === 'Special') { return this.chainModify([4505, 4096]); } },
		num: 267,
		gen: 4,
	},
	zoomlens: {
		name: "Zoom Lens",
		spritenum: 574,
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
	// #region Weather Items
	damprock: {
		name: "Damp Rock",
		spritenum: 88,
		fling: { basePower: 60, },
		num: 285,
		gen: 4,
	},
	heatrock: {
		name: "Heat Rock",
		spritenum: 193,
		fling: { basePower: 60, },
		num: 284,
		gen: 4,
	},
	icyrock: {
		name: "Icy Rock",
		spritenum: 221,
		fling: { basePower: 40, },
		num: 282,
		gen: 4,
	},
	smoothrock: {
		name: "Smooth Rock",
		spritenum: 453,
		fling: {
			basePower: 10,
		},
		num: 283,
		gen: 4,
	},
	









	// #region Terrain Seeds + TE
	terrainextender: { // implemented in conditions.t9ol
		name: "Terrain Extender",
		spritenum: 662,
		fling: { basePower: 60, },
		isFragile: true,
		onFragileBreak() { },
		num: 879,
		gen: 7,
	},
	electricseed: {
		name: "Electric Seed",
		spritenum: 664,
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
		spritenum: 667,
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
		spritenum: 666,
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
		spritenum: 665,
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
		spritenum: 0,
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
		spritenum: 741,
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
		spritenum: 4,
		fling: { basePower: 60, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (user.baseSpecies.num === 483 && (move.type === 'Steel' || move.type === 'Dragon')) { 
			return this.chainModify([5529, 4096]); } },
		num: 135,
		gen: 4,
	},
	cornerstonemask: {
		name: "Cornerstone Mask",
		spritenum: 758,
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
		spritenum: 743,
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
		spritenum: 180,
		fling: { basePower: 60, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (user.baseSpecies.num === 487 && (move.type === 'Ghost' || move.type === 'Dragon')) { return this.chainModify([5529, 4096]); } },
		itemUser: ["Giratina"],
		num: 112,
		gen: 4,
	},
	hearthflamemask: {
		name: "Hearthflame Mask",
		spritenum: 760,
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
		spritenum: 742,
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
		spritenum: 265,
		fling: { basePower: 60, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (user.baseSpecies.num === 484 && (move.type === 'Water' || move.type === 'Dragon')) { return this.chainModify([5529, 4096]); } },
		itemUser: ["Palkia"],
		num: 136,
		gen: 4,
	},
	lightball: {
		name: "Light Ball",
		spritenum: 251,
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
	rustedshield: {
		name: "Rusted Shield",
		spritenum: 699,
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 889) || pokemon.baseSpecies.num === 889) { return false; }
			return true;
		},
		itemUser: ["Zamazenta-Crowned"],
		num: 1104,
		gen: 8,
	},
	rustedsword: {
		name: "Rusted Sword",
		spritenum: 698,
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 888) || pokemon.baseSpecies.num === 888) { return false; }
			return true;
		},
		itemUser: ["Zacian-Crowned"],
		num: 1103,
		gen: 8,
	},
	souldew: {
		name: "Soul Dew",
		spritenum: 459,
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
	wellspringmask: {
		name: "Wellspring Mask",
		spritenum: 759,
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





	blueorb: {
		name: "Blue Orb",
		spritenum: 41,
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
	leek: {
		name: "Leek",
		fling: { basePower: 60, },
		spritenum: 475,
		onModifyCritRatio(critRatio, user) { if (["farfetchd", "sirfetchd"].includes(this.toID(user.baseSpecies.baseSpecies))) { return critRatio + 2; } },
		itemUser: ["Farfetch\u2019d", "Farfetch\u2019d-Galar", "Sirfetch\u2019d"],
		num: 259,
		gen: 8,
		isNonstandard: "Past",
	},
	luckypunch: {
		name: "Lucky Punch",
		spritenum: 261,
		fling: { basePower: 40, },
		onModifyCritRatio(critRatio, user) { if (user.baseSpecies.name === 'Chansey') { return critRatio + 2; } },
		itemUser: ["Chansey"],
		num: 256,
		gen: 2,
		isNonstandard: "Past",
	},
	deepseascale: {
		name: "Deep Sea Scale",
		spritenum: 93,
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
		spritenum: 94,
		fling: { basePower: 90, },
		onModifySpAPriority: 1,
		onModifySpA(spa, pokemon) { if (pokemon.baseSpecies.name === 'Clamperl') { return this.chainModify(2); } },
		itemUser: ["Clamperl"],
		num: 226,
		gen: 3,
		isNonstandard: "Past",
	},
	redorb: {
		name: "Red Orb",
		spritenum: 390,
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
	stick: {
		name: "Stick",
		fling: { basePower: 60, },
		spritenum: 475,
		onModifyCritRatio(critRatio, user) { if (this.toID(user.baseSpecies.baseSpecies) === 'farfetchd') { return critRatio + 2; } },
		itemUser: ["Farfetch\u2019d"],
		num: 259,
		gen: 2,
		isNonstandard: "Past",
	},
	thickclub: {
		name: "Thick Club",
		spritenum: 491,
		fling: { basePower: 90, },
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) { if (pokemon.baseSpecies.baseSpecies === 'Cubone' || pokemon.baseSpecies.baseSpecies === 'Marowak') { return this.chainModify(2); } },
		itemUser: ["Marowak", "Marowak-Alola", "Marowak-Alola-Totem", "Cubone"],
		num: 258,
		gen: 2,
		isNonstandard: "Past",
	},

	// #region Evolution Stones
	dawnstone: {
		name: "Dawn Stone",
		spritenum: 92,
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
		spritenum: 116,
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
		spritenum: 142,
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
		spritenum: 693,
		fling: { basePower: 30, },
		onStart(pokemon) {
			if (!pokemon.itemState) pokemon.itemState = {id: '', effectOrder: 0};
			pokemon.itemState.charge = 0;
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Ice' && user.itemState && user.itemState.charge === 0) { return this.chainModify([4915, 4096]); } },
		onSourceModifyDamage(damage, source, target, move) { if (move.type === 'Fire' && target.itemState && target.itemState.charge === 0) { return this.chainModify(0.8); } },
		onUpdate(pokemon) {
			if (this.field.isWeather(['sunnyday', 'desolateland']) || this.field.isTerrain('seaoffire')) {
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
		spritenum: 241,
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
		spritenum: 295,
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
		spritenum: 439,
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
		spritenum: 480,
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
					} else {
						return this.chainModify([4915, 4096]);
					}
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
		spritenum: 492,
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
		spritenum: 529,
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
	spritenum: 753,
	fling: { basePower: 30, },
	num: 2344,
	gen: 9,
	},
	berryjuice: {
		name: "Berry Juice",
		spritenum: 22,
		fling: { basePower: 30, },
		onUpdate(pokemon) { if (pokemon.hp <= pokemon.maxhp / 2) { if (this.runEvent('TryHeal', pokemon, null, this.effect, 20) && pokemon.useItem()) { this.heal(20); } } },
		num: 43,
		gen: 2,
		isNonstandard: "Past",
	},
	chippedpot: {
		name: "Chipped Pot",
		spritenum: 720,
		fling: { basePower: 80, },
		num: 1254,
		gen: 8,
	},
	crackedpot: {
		name: "Cracked Pot",
		spritenum: 719,
		fling: { basePower: 80, },
		num: 1253,
		gen: 8,
	},
	galaricacuff: {
		name: "Galarica Cuff",
		spritenum: 739,
		fling: { basePower: 30, },
		num: 1582,
		gen: 8,
	},
	galaricawreath: {
		name: "Galarica Wreath",
		spritenum: 740,
		fling: { basePower: 30, },
		num: 1592,
		gen: 8,
	},
	maliciousarmor: {
		name: "Malicious Armor",
		spritenum: 744,
		fling: { basePower: 30, },
		num: 1861,
		gen: 9,
	},
	masterpieceteacup: {
		name: "Masterpiece Teacup",
		spritenum: 757,
		fling: { basePower: 80, },
		num: 2404,
		gen: 9,
	},
	metalalloy: {
		name: "Metal Alloy",
		spritenum: 761,
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
		spritenum: 711,
		fling: { basePower: 30, },
		num: 1116,
		gen: 8,
	},
	syrupyapple: {
		name: "Syrupy Apple",
		spritenum: 755,
		fling: { basePower: 30, },
		num: 2402,
		gen: 9,
	},
	tartapple: {
		name: "Tart Apple",
		spritenum: 712,
		fling: { basePower: 30, },
		num: 1117,
		gen: 8,
	},
	unremarkableteacup: {
		name: "Unremarkable Teacup",
		spritenum: 756,
		fling: { basePower: 80, },
		num: 2403,
		gen: 9,
	},
// #region Held Evolution Items
	dragonscale: {
		name: "Dragon Scale",
		spritenum: 108,
		fling: { basePower: 30, },
		num: 235,
		gen: 2,
	},
	dubiousdisc: {
		name: "Dubious Disc",
		spritenum: 113,
		fling: { basePower: 50, },
		num: 324,
		gen: 4,
	},
	electirizer: {
		name: "Electirizer",
		spritenum: 119,
		fling: { basePower: 80, },
		num: 322,
		gen: 4,
	},
	kingsrock: {
		name: "King's Rock",
		spritenum: 236,
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
		spritenum: 272,
		fling: { basePower: 80, },
		num: 323,
		gen: 4,
	},
	ovalstone: {
		name: "Oval Stone",
		spritenum: 321,
		fling: { basePower: 80, },
		num: 110,
		gen: 4,
	},
	prismscale: {
		name: "Prism Scale",
		spritenum: 365,
		fling: { basePower: 30, },
		onModifyCritRatio(critRatio) { return critRatio + 2; },
		num: 537,
		gen: 5,
	},
	protector: {
		name: "Protector",
		spritenum: 367,
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
		spritenum: 382,
		fling: { basePower: 80,},
		onModifyCritRatio(critRatio) { return critRatio + 1; },
		num: 326,
		gen: 4,
	},
	razorfang: {
		name: "Razor Fang",
		spritenum: 383,
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
		spritenum: 385,
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
	sachet: {
		name: "Sachet",
		spritenum: 691,
		fling: { basePower: 80, },
		num: 647,
		gen: 6,
		isNonstandard: "Past",
	},
	upgrade: {
		name: "Up-Grade",
		spritenum: 523,
		fling: { basePower: 30, },
		num: 252,
		gen: 2,
	},
	whippeddream: {
		name: "Whipped Dream",
		spritenum: 692,
		fling: { basePower: 80, },
		num: 646,
		gen: 6,
		isNonstandard: "Past",
	},
	// #region Type Boosting Items
	blackbelt: {
		name: "Black Belt",
		spritenum: 32,
		fling: { basePower: 30, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move && (move.type === 'Fighting' || move.flags['punch'] || move.flags['kick'] || move.flags['sweep'] || move.flags['throw'])) {
			return this.chainModify([4915, 4096]);
		}
		},
		num: 241,
		gen: 2,
	},
	blackglasses: {
		name: "Black Glasses",
		spritenum: 35,
		fling: { basePower: 30, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move && (move.type === 'Dark' || move.flags['aura'])) { return this.chainModify([4915, 4096]); } },
		onSourceModifyDamage(damage, source, target, move) { if (move.flags['light']) { return this.chainModify(0.8); } },
		num: 240,
		gen: 2,
	},
	charcoal: {
		name: "Charcoal",
		spritenum: 61,
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
		spritenum: 106,
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
		spritenum: 754,
		fling: { basePower: 10, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move && (move.type === 'Fairy' || move.flags['wind'])) { return this.chainModify([4915, 4096]); } },
		num: 2401,
		gen: 9,
	},
	hardstone: {
		name: "Hard Stone",
		spritenum: 187,
		fling: { basePower: 100, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move && (move.type === 'Rock'|| move.flags['throw'])) { return this.chainModify([4915, 4096]); } },
		num: 238,
		gen: 2,
	},
	magnet: {
		name: "Magnet",
		spritenum: 273,
		fling: { basePower: 30, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Electric') { return this.chainModify([4915, 4096]); } },
		onRedirectTarget(target, source, source2, move) { if (move && (move.type === 'Electric' || move.type === 'Steel') && source !== target) { return target; } },
		num: 242,
		gen: 2,
	},
	metalcoat: {
		name: "Metal Coat",
		spritenum: 286,
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
		fling: { basePower: 30, },
		spritenum: 292,
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
		spritenum: 300,
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
		spritenum: 305,
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
		spritenum: 343,
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
		spritenum: 436,
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
		spritenum: 444,
		fling: { basePower: 10, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Normal' || !move.secondary) { return this.chainModify([4915, 4096]); } },
		onModifyMove(move, pokemon) { if (move.flags['binding']) { move.damage = 1/7; } },
		num: 251,
		gen: 3,
	},
	silverpowder: {
		name: "Silver Powder",
		spritenum: 447,
		fling: { basePower: 10, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Bug') { return this.chainModify([4915, 4096]); } },
		onSourceModifyDamage(damage, target, source, move) { if (target.hasType('Dark') || target.hasType('Fairy') || target.hasType('Ghost')) { return this.chainModify(1.1); } },
		onDamagingHit(damage, target, source, move) { if (move.flags['light']) { return this.chainModify(0.8); } },
		num: 222,
		gen: 2,
	},
	softsand: {
		name: "Soft Sand",
		spritenum: 456,
		fling: { basePower: 10, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Ground') { return this.chainModify([4915, 4096]); } },
		onSourceModifyDamage(damage, source, target, move) { if (move.type === 'Water') { return this.chainModify(0.7); } },
		num: 237,
		gen: 2,
	},
	spelltag: {
		name: "Spell Tag",
		spritenum: 461,
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
		spritenum: 606,
		fling: { basePower: 30, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Ice' || move.flags['throw']) {
				let modifier = 1.2;
				if (this.field.isWeather('snow') && move.type === 'Ice'|| move.flags['throw']) { modifier = 1.5; }
				return this.chainModify(modifier);
			}
		},
		onUpdate(pokemon) { if (this.field.isWeather('sunnyday') || this.field.isWeather('desolateland')) { pokemon.setItem(''); } },
		num: 649,
		gen: 6,
	},
	twistedspoon: {
		name: "Twisted Spoon",
		spritenum: 520,
		fling: { basePower: 30, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Psychic' || move.flags['beam'] || move.flags['pulse']) { return this.chainModify([4915, 4096]); } },
		onSourceModifyDamage(damage, source, target, move) { if (target.hasType('Steel')) { return this.chainModify([4915, 4096]); } },
		num: 248,
		gen: 2,
	},
	// #region Type Plates
	dracoplate: {
		name: "Draco Plate",
		spritenum: 105,
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
		spritenum: 110,
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
		spritenum: 117,
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
		spritenum: 143,
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
		spritenum: 146,
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
		spritenum: 220,
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
		spritenum: 223,
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
		spritenum: 225,
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
		spritenum: 282,
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
		spritenum: 291,
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
		spritenum: 610,
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
		spritenum: 450,
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
		spritenum: 463,
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
		spritenum: 464,
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
		spritenum: 477,
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
		spritenum: 516,
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
		spritenum: 572,
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
		spritenum: 661,
		num: 851,
		gen: 7,
		isPokeball: true,
	},
	cherishball: {
		name: "Cherish Ball",
		spritenum: 64,
		num: 16,
		gen: 4,
		isPokeball: true,
		isNonstandard: "Unobtainable",
	},
	diveball: {
		name: "Dive Ball",
		spritenum: 101,
		num: 7,
		gen: 3,
		isPokeball: true,
	},	
	dreamball: {
		name: "Dream Ball",
		spritenum: 111,
		num: 576,
		gen: 5,
		isPokeball: true,
	},
	duskball: {
		name: "Dusk Ball",
		spritenum: 115,
		num: 13,
		gen: 4,
		isPokeball: true,
	},
	fastball: {
		name: "Fast Ball",
		spritenum: 137,
		num: 492,
		gen: 2,
		isPokeball: true,
	},
	friendball: {
		name: "Friend Ball",
		spritenum: 153,
		num: 497,
		gen: 2,
		isPokeball: true,
	},
	greatball: {
		name: "Great Ball",
		spritenum: 174,
		num: 3,
		gen: 1,
		isPokeball: true,
	},
	healball: {
		name: "Heal Ball",
		spritenum: 188,
		num: 14,
		gen: 4,
		isPokeball: true,
	},
	heavyball: {
		name: "Heavy Ball",
		spritenum: 194,
		num: 495,
		gen: 2,
		isPokeball: true,
	},
	levelball: {
		name: "Level Ball",
		spritenum: 246,
		num: 493,
		gen: 2,
		isPokeball: true,
	},
	loveball: {
		name: "Love Ball",
		spritenum: 258,
		num: 496,
		gen: 2,
		isPokeball: true,
	},
	lureball: {
		name: "Lure Ball",
		spritenum: 264,
		num: 494,
		gen: 2,
		isPokeball: true,
	},
	luxuryball: {
		name: "Luxury Ball",
		spritenum: 266,
		num: 11,
		gen: 3,
		isPokeball: true,
	},
	masterball: {
		name: "Master Ball",
		spritenum: 276,
		num: 1,
		gen: 1,
		isPokeball: true,
	},
	moonball: {
		name: "Moon Ball",
		spritenum: 294,
		num: 498,
		gen: 2,
		isPokeball: true,
	},
	nestball: {
		name: "Nest Ball",
		spritenum: 303,
		num: 8,
		gen: 3,
		isPokeball: true,
	},
	netball: {
		name: "Net Ball",
		spritenum: 304,
		num: 6,
		gen: 3,
		isPokeball: true,
	},
	parkball: {
		name: "Park Ball",
		spritenum: 325,
		num: 500,
		gen: 4,
		isPokeball: true,
		isNonstandard: "Unobtainable",
	},
	pokeball: {
		name: "Poke Ball",
		spritenum: 345,
		num: 4,
		gen: 1,
		isPokeball: true,
	},
	premierball: {
		name: "Premier Ball",
		spritenum: 363,
		num: 12,
		gen: 3,
		isPokeball: true,
	},
	quickball: {
		name: "Quick Ball",
		spritenum: 372,
		num: 15,
		gen: 4,
		isPokeball: true,
	},
	repeatball: {
		name: "Repeat Ball",
		spritenum: 401,
		num: 9,
		gen: 3,
		isPokeball: true,
	},
	safariball: {
		name: "Safari Ball",
		spritenum: 425,
		num: 5,
		gen: 1,
		isPokeball: true,
	},
	sportball: {
		name: "Sport Ball",
		spritenum: 465,
		num: 499,
		gen: 2,
		isPokeball: true,
	},
	strangeball: {
		name: "Strange Ball",
		spritenum: 308,
		num: 1785,
		gen: 8,
		isPokeball: true,
		isNonstandard: "Unobtainable",
	},
	timerball: {
		name: "Timer Ball",
		spritenum: 494,
		num: 10,
		gen: 3,
		isPokeball: true,
	},
	ultraball: {
		name: "Ultra Ball",
		spritenum: 521,
		num: 2,
		gen: 1,
		isPokeball: true,
	},
// #region Silvally Memories
	bugmemory: {
		name: "Bug Memory",
		spritenum: 673,
		onMemory: 'Bug',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Bug",
		itemUser: ["Silvally-Bug"],
		num: 909,
		gen: 7,
		isNonstandard: "Past",
	},
	darkmemory: {
		name: "Dark Memory",
		spritenum: 683,
		onMemory: 'Dark',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Dark",
		itemUser: ["Silvally-Dark"],
		num: 919,
		gen: 7,
		isNonstandard: "Past",
	},
	dragonmemory: {
		name: "Dragon Memory",
		spritenum: 682,
		onMemory: 'Dragon',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Dragon",
		itemUser: ["Silvally-Dragon"],
		num: 918,
		gen: 7,
		isNonstandard: "Past",
	},
	electricmemory: {
		name: "Electric Memory",
		spritenum: 679,
		onMemory: 'Electric',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Electric",
		itemUser: ["Silvally-Electric"],
		num: 915,
		gen: 7,
		isNonstandard: "Past",
	},
	fairymemory: {
		name: "Fairy Memory",
		spritenum: 684,
		onMemory: 'Fairy',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Fairy",
		itemUser: ["Silvally-Fairy"],
		num: 920,
		gen: 7,
		isNonstandard: "Past",
	},
	fightingmemory: {
		name: "Fighting Memory",
		spritenum: 668,
		onMemory: 'Fighting',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Fighting",
		itemUser: ["Silvally-Fighting"],
		num: 904,
		gen: 7,
		isNonstandard: "Past",
	},
	firememory: {
		name: "Fire Memory",
		spritenum: 676,
		onMemory: 'Fire',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Fire",
		itemUser: ["Silvally-Fire"],
		num: 912,
		gen: 7,
		isNonstandard: "Past",
	},
	flyingmemory: {
		name: "Flying Memory",
		spritenum: 669,
		onMemory: 'Flying',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Flying",
		itemUser: ["Silvally-Flying"],
		num: 905,
		gen: 7,
		isNonstandard: "Past",
	},
	ghostmemory: {
		name: "Ghost Memory",
		spritenum: 674,
		onMemory: 'Ghost',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Ghost",
		itemUser: ["Silvally-Ghost"],
		num: 910,
		gen: 7,
		isNonstandard: "Past",
	},
	grassmemory: {
		name: "Grass Memory",
		spritenum: 678,
		onMemory: 'Grass',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false }
			return true;
		},
		forcedForme: "Silvally-Grass",
		itemUser: ["Silvally-Grass"],
		num: 914,
		gen: 7,
		isNonstandard: "Past",
	},
	groundmemory: {
		name: "Ground Memory",
		spritenum: 671,
		onMemory: 'Ground',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Ground",
		itemUser: ["Silvally-Ground"],
		num: 907,
		gen: 7,
		isNonstandard: "Past",
	},
	icememory: {
		name: "Ice Memory",
		spritenum: 681,
		onMemory: 'Ice',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Ice",
		itemUser: ["Silvally-Ice"],
		num: 917,
		gen: 7,
		isNonstandard: "Past",
	},
	poisonmemory: {
		name: "Poison Memory",
		spritenum: 670,
		onMemory: 'Poison',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Poison",
		itemUser: ["Silvally-Poison"],
		num: 906,
		gen: 7,
		isNonstandard: "Past",
	},
	psychicmemory: {
		name: "Psychic Memory",
		spritenum: 680,
		onMemory: 'Psychic',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Psychic",
		itemUser: ["Silvally-Psychic"],
		num: 916,
		gen: 7,
		isNonstandard: "Past",
	},
	rockmemory: {
		name: "Rock Memory",
		spritenum: 672,
		onMemory: 'Rock',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Rock",
		itemUser: ["Silvally-Rock"],
		num: 908,
		gen: 7,
		isNonstandard: "Past",
	},
	steelmemory: {
		name: "Steel Memory",
		spritenum: 675,
		onMemory: 'Steel',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Steel",
		itemUser: ["Silvally-Steel"],
		num: 911,
		gen: 7,
		isNonstandard: "Past",
	},
	watermemory: {
		name: "Water Memory",
		spritenum: 677,
		onMemory: 'Water',
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) { return false; }
			return true;
		},
		forcedForme: "Silvally-Water",
		itemUser: ["Silvally-Water"],
		num: 913,
		gen: 7,
		isNonstandard: "Past",
	},
// #region Genesect Drives
	burndrive: {
		name: "Burn Drive",
		spritenum: 54,
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) { return false; }
			return true;
		},
		onDrive: 'Fire',
		forcedForme: "Genesect-Burn",
		itemUser: ["Genesect-Burn"],
		num: 118,
		gen: 5,
		isNonstandard: "Past",
	},
	chilldrive: {
		name: "Chill Drive",
		spritenum: 67,
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) { return false; }
			return true;
		},
		onDrive: 'Ice',
		forcedForme: "Genesect-Chill",
		itemUser: ["Genesect-Chill"],
		num: 119,
		gen: 5,
		isNonstandard: "Past",
	},
	dousedrive: {
		name: "Douse Drive",
		spritenum: 103,
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) { return false; }
			return true;
		},
		onDrive: 'Water',
		forcedForme: "Genesect-Douse",
		itemUser: ["Genesect-Douse"],
		num: 116,
		gen: 5,
		isNonstandard: "Past",
	},
	shockdrive: {
		name: "Shock Drive",
		spritenum: 442,
		onTakeItem(item, pokemon, source) { if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) { return false; }
			return true;
		},
		onDrive: 'Electric',
		forcedForme: "Genesect-Shock",
		itemUser: ["Genesect-Shock"],
		num: 117,
		gen: 5,
		isNonstandard: "Past",
	},
	// #region Incense
	fullincense: {
		name: "Full Incense",
		spritenum: 155,
		fling: { basePower: 10, },
		onFractionalPriority: -0.1,
		num: 316,
		gen: 4,
		isNonstandard: "Past",
	},
	laxincense: {
		name: "Lax Incense",
		spritenum: 240,
		fling: { basePower: 10, },
		onModifyAccuracyPriority: -2,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('lax incense - decreasing accuracy');
			return this.chainModify([3686, 4096]);
		},
		num: 255,
		gen: 3,
		isNonstandard: "Past",
	},
	oddincense: {
		name: "Odd Incense",
		spritenum: 312,
		fling: { basePower: 10, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Psychic') { return this.chainModify([4915, 4096]); } },
		num: 314,
		gen: 4,
		isNonstandard: "Past",
	},
	rockincense: {
		name: "Rock Incense",
		spritenum: 416,
		fling: { basePower: 10, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Rock') { return this.chainModify([4915, 4096]); } },
		num: 315,
		gen: 4,
		isNonstandard: "Past",
	},
	roseincense: {
		name: "Rose Incense",
		spritenum: 419,
		fling: { basePower: 10, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Grass') { return this.chainModify([4915, 4096]); } },
		num: 318,
		gen: 4,
		isNonstandard: "Past",
	},
	seaincense: {
		name: "Sea Incense",
		spritenum: 430,
		fling: { basePower: 10, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move && move.type === 'Water') { return this.chainModify([4915, 4096]); } },
		num: 254,
		gen: 3,
		isNonstandard: "Past",
	},
	waveincense: {
		name: "Wave Incense",
		spritenum: 531,
		fling: { basePower: 10, },
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) { if (move.type === 'Water') { return this.chainModify([4915, 4096]); } },
		num: 317,
		gen: 4,
		isNonstandard: "Past",
	},
	// #region EV Training Items
	poweranklet: {
		name: "Power Anklet",
		spritenum: 354,
		ignoreKlutz: true,
		fling: { basePower: 70, },
		onModifySpe(spe) { return this.chainModify(0.5); },
		num: 293,
		gen: 4,
	},
	powerband: {
		name: "Power Band",
		spritenum: 355,
		ignoreKlutz: true,
		fling: { basePower: 70, },
		onModifySpe(spe) { return this.chainModify(0.5); },
		num: 292,
		gen: 4,
	},
	powerbelt: {
		name: "Power Belt",
		spritenum: 356,
		ignoreKlutz: true,
		fling: { basePower: 70, },
		onModifySpe(spe) { return this.chainModify(0.5); },
		num: 290,
		gen: 4,
	},
	powerbracer: {
		name: "Power Bracer",
		spritenum: 357,
		ignoreKlutz: true,
		fling: { basePower: 70, },
		onModifySpe(spe) { return this.chainModify(0.5); },
		num: 289,
		gen: 4,
	},
	powerlens: {
		name: "Power Lens",
		spritenum: 359,
		ignoreKlutz: true,
		fling: { basePower: 70, },
		onModifySpe(spe) { return this.chainModify(0.5); },
		num: 291,
		gen: 4,
	},
	powerweight: {
		name: "Power Weight",
		spritenum: 360,
		ignoreKlutz: true,
		fling: { basePower: 70, },
		onModifySpe(spe) { return this.chainModify(0.5); },
		num: 294,
		gen: 4,
	},
	// #region Useless Items
	bignugget: {
		name: "Big Nugget",
		spritenum: 27,
		fling: { basePower: 130, },
		num: 581,
		gen: 5,
	},
	bottlecap: {
		name: "Bottle Cap",
		spritenum: 696,
		fling: { basePower: 30, },
		num: 795,
		gen: 7,
	},
	goldbottlecap: {
		name: "Gold Bottle Cap",
		spritenum: 697,
		fling: { basePower: 30, },
		num: 796,
		gen: 7,
	},
	mail: {
		name: "Mail",
		spritenum: 403,
		onTakeItem(item, source) {
			if (!this.activeMove) return false;
			if (this.activeMove.id !== 'knockoff' && this.activeMove.id !== 'thief' && this.activeMove.id !== 'covet') return false;
		},
		num: 137,
		gen: 2,
		isNonstandard: "Past",
	},
	prettyfeather: {
		name: "Pretty Feather",
		spritenum: 1,
		fling: { basePower: 20, },
		num: 571,
		gen: 5,
	},
	rarebone: {
		name: "Rare Bone",
		spritenum: 379,
		fling: { basePower: 100, },
		num: 106,
		gen: 4,
	},
	// #region Mega Stones
	aerodactylite: {
		name: "Aerodactylite",
		spritenum: 577,
		megaStone: "Aerodactyl-Mega",
		megaEvolves: "Aerodactyl",
		itemUser: ["Aerodactyl"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 672,
		gen: 6,
		isNonstandard: "Past",
	},
	aggronite: {
		name: "Aggronite",
		spritenum: 578,
		megaStone: "Aggron-Mega",
		megaEvolves: "Aggron",
		itemUser: ["Aggron"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 667,
		gen: 6,
		isNonstandard: "Past",
	},
	alakazite: {
		name: "Alakazite",
		spritenum: 579,
		megaStone: "Alakazam-Mega",
		megaEvolves: "Alakazam",
		itemUser: ["Alakazam"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 679,
		gen: 6,
		isNonstandard: "Past",
	},
	altarianite: {
		name: "Altarianite",
		spritenum: 615,
		megaStone: "Altaria-Mega",
		megaEvolves: "Altaria",
		itemUser: ["Altaria"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 755,
		gen: 6,
		isNonstandard: "Past",
	},
	ampharosite: {
		name: "Ampharosite",
		spritenum: 580,
		megaStone: "Ampharos-Mega",
		megaEvolves: "Ampharos",
		itemUser: ["Ampharos"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 658,
		gen: 6,
		isNonstandard: "Past",
	},
	audinite: {
		name: "Audinite",
		spritenum: 617,
		megaStone: "Audino-Mega",
		megaEvolves: "Audino",
		itemUser: ["Audino"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 757,
		gen: 6,
		isNonstandard: "Past",
	},
	banettite: {
		name: "Banettite",
		spritenum: 582,
		megaStone: "Banette-Mega",
		megaEvolves: "Banette",
		itemUser: ["Banette"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 668,
		gen: 6,
		isNonstandard: "Past",
	},
   barbaracite: {
       name: "Barbaracite",
       spritenum: 564,
       megaStone: "Barbaracle-Mega",
       megaEvolves: "Barbaracle",
       itemUser: ["Barbaracle"],
       onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
           return true;
       },
       num: 2581,
       gen: 9,
       isNonstandard: "Future",
   },
   beedrillite: {
       name: "Beedrillite",
       spritenum: 628,
       megaStone: "Beedrill-Mega",
       megaEvolves: "Beedrill",
       itemUser: ["Beedrill"],
       onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
           return true;
       },
       num: 770,
       gen: 6,
       isNonstandard: "Past",
   },
   blastoisinite: {
       name: "Blastoisinite",
       spritenum: 583,
       megaStone: "Blastoise-Mega",
       megaEvolves: "Blastoise",
       itemUser: ["Blastoise"],
       onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
           return true;
       },
       num: 661,
       gen: 6,
       isNonstandard: "Past",
   },
   blazikenite: {
       name: "Blazikenite",
       spritenum: 584,
       megaStone: "Blaziken-Mega",
       megaEvolves: "Blaziken",
       itemUser: ["Blaziken"],
       onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
           return true;
       },
       num: 664,
       gen: 6,
       isNonstandard: "Past",
   },
   cameruptite: {
       name: "Cameruptite",
       spritenum: 625,
       megaStone: "Camerupt-Mega",
       megaEvolves: "Camerupt",
       itemUser: ["Camerupt"],
       onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
           return true;
       },
       num: 767,
       gen: 6,
       isNonstandard: "Past",
   },
   chandelurite: {
       name: "Chandelurite",
       spritenum: 557,
       megaStone: "Chandelure-Mega",
       megaEvolves: "Chandelure",
       itemUser: ["Chandelure"],
       onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
           return true;
       },
       num: 2574,
       gen: 9,
       isNonstandard: "Future",
   },
   charizarditex: {
       name: "Charizardite X",
       spritenum: 585,
       megaStone: "Charizard-Mega-X",
       megaEvolves: "Charizard",
       itemUser: ["Charizard"],
       onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
           return true;
       },
       num: 660,
       gen: 6,
       isNonstandard: "Past",
   },
   charizarditey: {
       name: "Charizardite Y",
       spritenum: 586,
       megaStone: "Charizard-Mega-Y",
       megaEvolves: "Charizard",
       itemUser: ["Charizard"],
       onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
           return true;
       },
       num: 678,
       gen: 6,
       isNonstandard: "Past",
   },
   chesnaughtite: {
       name: "Chesnaughtite",
       spritenum: 558,
       megaStone: "Chesnaught-Mega",
       megaEvolves: "Chesnaught",
       itemUser: ["Chesnaught"],
       onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
           return true;
       },
       num: 2575,
       gen: 9,
       isNonstandard: "Future",
   },
   clefablite: {
		name: "Clefablite",
		spritenum: 544,
		megaStone: "Clefable-Mega",
		megaEvolves: "Clefable",
		itemUser: ["Clefable"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2559,
		gen: 9,
		isNonstandard: "Future",
	},
	delphoxite: {
		name: "Delphoxite",
		spritenum: 559,
		megaStone: "Delphox-Mega",
		megaEvolves: "Delphox",
		itemUser: ["Delphox"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2576,
		gen: 9,
		isNonstandard: "Future",
	},
	diancite: {
		name: "Diancite",
		spritenum: 624,
		megaStone: "Diancie-Mega",
		megaEvolves: "Diancie",
		itemUser: ["Diancie"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 764,
		gen: 6,
		isNonstandard: "Past",
	},
	dragalgite: {
		name: "Dragalgite",
		spritenum: 565,
		megaStone: "Dragalge-Mega",
		megaEvolves: "Dragalge",
		itemUser: ["Dragalge"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2582,
		gen: 9,
		isNonstandard: "Future",
	},
	dragoninite: {
		name: "Dragoninite",
		spritenum: 547,
		megaStone: "Dragonite-Mega",
		megaEvolves: "Dragonite",
		itemUser: ["Dragonite"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2562,
		gen: 9,
		isNonstandard: "Future",
	},
	drampanite: {
		name: "Drampanite",
		spritenum: 569,
		megaStone: "Drampa-Mega",
		megaEvolves: "Drampa",
		itemUser: ["Drampa"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2585,
		gen: 9,
		isNonstandard: "Future",
	},
	eelektrossite: {
		name: "Eelektrossite",
		spritenum: 556,
		megaStone: "Eelektross-Mega",
		megaEvolves: "Eelektross",
		itemUser: ["Eelektross"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2573,
		gen: 9,
		isNonstandard: "Future",
	},
	emboarite: {
		name: "Emboarite",
		spritenum: 552,
		megaStone: "Emboar-Mega",
		megaEvolves: "Emboar",
		itemUser: ["Emboar"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2569,
		gen: 9,
		isNonstandard: "Future",
	},
	excadrite: {
		name: "Excadrite",
		spritenum: 553,
		megaStone: "Excadrill-Mega",
		megaEvolves: "Excadrill",
		itemUser: ["Excadrill"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2570,
		gen: 9,
		isNonstandard: "Future",
	},
	falinksite: {
		name: "Falinksite",
		spritenum: 570,
		megaStone: "Falinks-Mega",
		megaEvolves: "Falinks",
		itemUser: ["Falinks"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2586,
		gen: 9,
		isNonstandard: "Future",
	},
	feraligite: {
		name: "Feraligite",
		spritenum: 549,
		megaStone: "Feraligatr-Mega",
		megaEvolves: "Feraligatr",
		itemUser: ["Feraligatr"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2564,
		gen: 9,
		isNonstandard: "Future",
	},
	floettite: {
		name: "Floettite",
		spritenum: 562,
		megaStone: "Floette-Mega",
		megaEvolves: "Floette-Eternal",
		itemUser: ["Floette-Eternal"],
		onTakeItem(item, source) { if ([item.megaEvolves, item.megaStone].includes(source.baseSpecies.name)) return false;
			return true;
		},
		num: 2579,
		gen: 9,
		isNonstandard: "Future",
	},
	froslassite: {
		name: "Froslassite",
		spritenum: 551,
		megaStone: "Froslass-Mega",
		megaEvolves: "Froslass",
		itemUser: ["Froslass"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2566,
		gen: 9,
		isNonstandard: "Future",
	},
	galladite: {
		name: "Galladite",
		spritenum: 616,
		megaStone: "Gallade-Mega",
		megaEvolves: "Gallade",
		itemUser: ["Gallade"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 756,
		gen: 6,
		isNonstandard: "Past",
	},
	garchompite: {
		name: "Garchompite",
		spritenum: 573,
		megaStone: "Garchomp-Mega",
		megaEvolves: "Garchomp",
		itemUser: ["Garchomp"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 683,
		gen: 6,
		isNonstandard: "Past",
	},
	gardevoirite: {
		name: "Gardevoirite",
		spritenum: 587,
		megaStone: "Gardevoir-Mega",
		megaEvolves: "Gardevoir",
		itemUser: ["Gardevoir"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 657,
		gen: 6,
		isNonstandard: "Past",
	},
	gengarite: {
		name: "Gengarite",
		spritenum: 588,
		megaStone: "Gengar-Mega",
		megaEvolves: "Gengar",
		itemUser: ["Gengar"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 656,
		gen: 6,
		isNonstandard: "Past",
	},
	glalitite: {
		name: "Glalitite",
		spritenum: 623,
		megaStone: "Glalie-Mega",
		megaEvolves: "Glalie",
		itemUser: ["Glalie"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 763,
		gen: 6,
		isNonstandard: "Past",
	},
	greninjite: { // TODO: Figure out if this works on Greninja-Bond
		name: "Greninjite",
		spritenum: 560,
		megaStone: "Greninja-Mega",
		megaEvolves: "Greninja",
		itemUser: ["Greninja"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2577,
		gen: 9,
		isNonstandard: "Future",
	},
	gyaradosite: {
		name: "Gyaradosite",
		spritenum: 589,
		megaStone: "Gyarados-Mega",
		megaEvolves: "Gyarados",
		itemUser: ["Gyarados"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 676,
		gen: 6,
		isNonstandard: "Past",
	},
	hawluchanite: {
		name: "Hawluchanite",
		spritenum: 566,
		megaStone: "Hawlucha-Mega",
		megaEvolves: "Hawlucha",
		itemUser: ["Hawlucha"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2583,
		gen: 9,
		isNonstandard: "Future",
	},
	heracronite: {
		name: "Heracronite",
		spritenum: 590,
		megaStone: "Heracross-Mega",
		megaEvolves: "Heracross",
		itemUser: ["Heracross"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 680,
		gen: 6,
		isNonstandard: "Past",
	},
	houndoominite: {
		name: "Houndoominite",
		spritenum: 591,
		megaStone: "Houndoom-Mega",
		megaEvolves: "Houndoom",
		itemUser: ["Houndoom"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 666,
		gen: 6,
		isNonstandard: "Past",
	},
	kangaskhanite: {
		name: "Kangaskhanite",
		spritenum: 592,
		megaStone: "Kangaskhan-Mega",
		megaEvolves: "Kangaskhan",
		itemUser: ["Kangaskhan"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 675,
		gen: 6,
		isNonstandard: "Past",
	},
	latiasite: {
		name: "Latiasite",
		spritenum: 629,
		megaStone: "Latias-Mega",
		megaEvolves: "Latias",
		itemUser: ["Latias"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 684,
		gen: 6,
		isNonstandard: "Past",
	},
	latiosite: {
		name: "Latiosite",
		spritenum: 630,
		megaStone: "Latios-Mega",
		megaEvolves: "Latios",
		itemUser: ["Latios"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 685,
		gen: 6,
		isNonstandard: "Past",
	},
	lopunnite: {
		name: "Lopunnite",
		spritenum: 626,
		megaStone: "Lopunny-Mega",
		megaEvolves: "Lopunny",
		itemUser: ["Lopunny"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 768,
		gen: 6,
		isNonstandard: "Past",
	},
	lucarionite: {
		name: "Lucarionite",
		spritenum: 594,
		megaStone: "Lucario-Mega",
		megaEvolves: "Lucario",
		itemUser: ["Lucario"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 673,
		gen: 6,
		isNonstandard: "Past",
	},
	malamarite: {
		name: "Malamarite",
		spritenum: 563,
		megaStone: "Malamar-Mega",
		megaEvolves: "Malamar",
		itemUser: ["Malamar"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2580,
		gen: 9,
		isNonstandard: "Future",
	},
	manectite: {
		name: "Manectite",
		spritenum: 596,
		megaStone: "Manectric-Mega",
		megaEvolves: "Manectric",
		itemUser: ["Manectric"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 682,
		gen: 6,
		isNonstandard: "Past",
	},
	mawilite: {
		name: "Mawilite",
		spritenum: 598,
		megaStone: "Mawile-Mega",
		megaEvolves: "Mawile",
		itemUser: ["Mawile"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 681,
		gen: 6,
		isNonstandard: "Past",
	},
	medichamite: {
		name: "Medichamite",
		spritenum: 599,
		megaStone: "Medicham-Mega",
		megaEvolves: "Medicham",
		itemUser: ["Medicham"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 665,
		gen: 6,
		isNonstandard: "Past",
	},
	meganiumite: {
		name: "Meganiumite",
		spritenum: 548,
		megaStone: "Meganium-Mega",
		megaEvolves: "Meganium",
		itemUser: ["Meganium"],
		onTakeItem(item, source) {if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2563,
		gen: 9,
		isNonstandard: "Future",
	},
	metagrossite: {
		name: "Metagrossite",
		spritenum: 618,
		megaStone: "Metagross-Mega",
		megaEvolves: "Metagross",
		itemUser: ["Metagross"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 758,
		gen: 6,
		isNonstandard: "Past",
	},
	mewtwonitex: {
		name: "Mewtwonite X",
		spritenum: 600,
		megaStone: "Mewtwo-Mega-X",
		megaEvolves: "Mewtwo",
		itemUser: ["Mewtwo"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 662,
		gen: 6,
		isNonstandard: "Past",
	},
	mewtwonitey: {
		name: "Mewtwonite Y",
		spritenum: 601,
		megaStone: "Mewtwo-Mega-Y",
		megaEvolves: "Mewtwo",
		itemUser: ["Mewtwo"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 663,
		gen: 6,
		isNonstandard: "Past",
	},
	pidgeotite: {
		name: "Pidgeotite",
		spritenum: 622,
		megaStone: "Pidgeot-Mega",
		megaEvolves: "Pidgeot",
		itemUser: ["Pidgeot"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 762,
		gen: 6,
		isNonstandard: "Past",
	},
	pinsirite: {
		name: "Pinsirite",
		spritenum: 602,
		megaStone: "Pinsir-Mega",
		megaEvolves: "Pinsir",
		itemUser: ["Pinsir"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 671,
		gen: 6,
		isNonstandard: "Past",
	},
	pyroarite: {
		name: "Pyroarite",
		spritenum: 561,
		megaStone: "Pyroar-Mega",
		megaEvolves: "Pyroar",
		itemUser: ["Pyroar"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2578,
		gen: 9,
		isNonstandard: "Future",
	},
	sablenite: {
		name: "Sablenite",
		spritenum: 614,
		megaStone: "Sableye-Mega",
		megaEvolves: "Sableye",
		itemUser: ["Sableye"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 754,
		gen: 6,
		isNonstandard: "Past",
	},
	salamencite: {
		name: "Salamencite",
		spritenum: 627,
		megaStone: "Salamence-Mega",
		megaEvolves: "Salamence",
		itemUser: ["Salamence"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 769,
		gen: 6,
		isNonstandard: "Past",
	},
	sceptilite: {
		name: "Sceptilite",
		spritenum: 613,
		megaStone: "Sceptile-Mega",
		megaEvolves: "Sceptile",
		itemUser: ["Sceptile"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 753,
		gen: 6,
		isNonstandard: "Past",
	},
	scizorite: {
		name: "Scizorite",
		spritenum: 605,
		megaStone: "Scizor-Mega",
		megaEvolves: "Scizor",
		itemUser: ["Scizor"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 670,
		gen: 6,
		isNonstandard: "Past",
	},
	scolipite: {
		name: "Scolipite",
		spritenum: 554,
		megaStone: "Scolipede-Mega",
		megaEvolves: "Scolipede",
		itemUser: ["Scolipede"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2571,
		gen: 9,
		isNonstandard: "Future",
	},
	scraftinite: {
		name: "Scraftinite",
		spritenum: 555,
		megaStone: "Scrafty-Mega",
		megaEvolves: "Scrafty",
		itemUser: ["Scrafty"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2572,
		gen: 9,
		isNonstandard: "Future",
	},
	sharpedonite: {
		name: "Sharpedonite",
		spritenum: 619,
		megaStone: "Sharpedo-Mega",
		megaEvolves: "Sharpedo",
		itemUser: ["Sharpedo"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 759,
		gen: 6,
		isNonstandard: "Past",
	},
	skarmorite: {
		name: "Skarmorite",
		spritenum: 550,
		megaStone: "Skarmory-Mega",
		megaEvolves: "Skarmory",
		itemUser: ["Skarmory"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2565,
		gen: 9,
		isNonstandard: "Future",
	},
	slowbronite: {
		name: "Slowbronite",
		spritenum: 620,
		megaStone: "Slowbro-Mega",
		megaEvolves: "Slowbro",
		itemUser: ["Slowbro"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 760,
		gen: 6,
		isNonstandard: "Past",
	},
	starminite: {
		name: "Starminite",
		spritenum: 546,
		megaStone: "Starmie-Mega",
		megaEvolves: "Starmie",
		itemUser: ["Starmie"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2561,
		gen: 9,
		isNonstandard: "Future",
	},
	steelixite: {
		name: "Steelixite",
		spritenum: 621,
		megaStone: "Steelix-Mega",
		megaEvolves: "Steelix",
		itemUser: ["Steelix"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 761,
		gen: 6,
		isNonstandard: "Past",
	},
	swampertite: {
		name: "Swampertite",
		spritenum: 612,
		megaStone: "Swampert-Mega",
		megaEvolves: "Swampert",
		itemUser: ["Swampert"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 752,
		gen: 6,
		isNonstandard: "Past",
	},
	tyranitarite: {
		name: "Tyranitarite",
		spritenum: 607,
		megaStone: "Tyranitar-Mega",
		megaEvolves: "Tyranitar",
		itemUser: ["Tyranitar"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 669,
		gen: 6,
		isNonstandard: "Past",
	},
	venusaurite: {
		name: "Venusaurite",
		spritenum: 608,
		megaStone: "Venusaur-Mega",
		megaEvolves: "Venusaur",
		itemUser: ["Venusaur"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 659,
		gen: 6,
		isNonstandard: "Past",
	},
	victreebelite: {
		name: "Victreebelite",
		spritenum: 545,
		megaStone: "Victreebel-Mega",
		megaEvolves: "Victreebel",
		itemUser: ["Victreebel"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2560,
		gen: 9,
		isNonstandard: "Future",
	},
	zygardite: {
		name: "Zygardite",
		spritenum: 568,
		megaStone: "Zygarde-Mega",
		megaEvolves: "Zygarde-Complete",
		itemUser: ["Zygarde-Complete"],
		onTakeItem(item, source) { if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2584,
		gen: 9,
		isNonstandard: "Future",
	},
	// #region Fossils
	armorfossil: {
		name: "Armor Fossil",
		spritenum: 12,
		fling: { basePower: 100, },
		num: 104,
		gen: 4,
		isNonstandard: "Past",
	},
	clawfossil: {
		name: "Claw Fossil",
		spritenum: 72,
		fling: { basePower: 100, },
		num: 100,
		gen: 3,
		isNonstandard: "Past",
	},
	coverfossil: {
		name: "Cover Fossil",
		spritenum: 85,
		fling: { basePower: 100, },
		num: 572,
		gen: 5,
		isNonstandard: "Past",
	},
	domefossil: {
		name: "Dome Fossil",
		spritenum: 102,
		fling: { basePower: 100, },
		num: 102,
		gen: 3,
		isNonstandard: "Past",
	},
	fossilizedbird: {
		name: "Fossilized Bird",
		spritenum: 700,
		fling: { basePower: 100, },
		num: 1105,
		gen: 8,
		isNonstandard: "Past",
	},
	fossilizeddino: {
		name: "Fossilized Dino",
		spritenum: 703,
		fling: { basePower: 100, },
		num: 1108,
		gen: 8,
		isNonstandard: "Past",
	},
	fossilizeddrake: {
		name: "Fossilized Drake",
		spritenum: 702,
		fling: { basePower: 100, },
		num: 1107,
		gen: 8,
		isNonstandard: "Past",
	},
	fossilizedfish: {
		name: "Fossilized Fish",
		spritenum: 701,
		fling: { basePower: 100, },
		num: 1106,
		gen: 8,
		isNonstandard: "Past",
	},
	helixfossil: {
		name: "Helix Fossil",
		spritenum: 195,
		fling: { basePower: 100, },
		num: 101,
		gen: 3,
		isNonstandard: "Past",
	},
	jawfossil: {
		name: "Jaw Fossil",
		spritenum: 694,
		fling: { basePower: 100, },
		num: 710,
		gen: 6,
		isNonstandard: "Past",
	},
	oldamber: {
		name: "Old Amber",
		spritenum: 314,
		fling: { basePower: 100, },
		num: 103,
		gen: 3,
		isNonstandard: "Past",
	},
	plumefossil: {
		name: "Plume Fossil",
		spritenum: 339,
		fling: { basePower: 100, },
		num: 573,
		gen: 5,
		isNonstandard: "Past",
	},
	rootfossil: {
		name: "Root Fossil",
		spritenum: 418,
		fling: { basePower: 100, },
		num: 99,
		gen: 3,
		isNonstandard: "Past",
	},
	sailfossil: {
		name: "Sail Fossil",
		spritenum: 695,
		fling: { basePower: 100, },
		num: 711,
		gen: 6,
		isNonstandard: "Past",
	},
	skullfossil: {
		name: "Skull Fossil",
		spritenum: 449,
		fling: { basePower: 100, },
		num: 105,
		gen: 4,
		isNonstandard: "Past",
	},
};