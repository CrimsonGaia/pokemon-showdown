// List of flags and their descriptions can be found in sim/dex-moves.ts

export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	
	
	
	//#region PHYSICAL MOVES
	accelerock: {
		num: 709,
		accuracy: 100,
		basePower: 40,
		type: "Rock",
		category: "Physical",
		name: "Accelerock",
		pp: 20,
		priority: 1,
		critRatio: 5,
		flags: { contact: 1, crash: 1,  protect: 1, metronome: 1, mirror: 1 },
  	    secondary: null,
		target: "normal",
	},
	acrobatics: {
		num: 512,
		accuracy: 100,
		basePower: 55,
		basePowerCallback(pokemon, target, move) {
			if (!pokemon.item) {
				this.debug("BP doubled for no item");
				return move.basePower * 2;
			}
			return move.basePower;
		},
		type: "Flying",
		category: "Physical",
		name: "Acrobatics",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, airborne: 1, distance: 1, protect: 1, metronome: 1, mirror: 1 },
		secondary: null,
		target: "any",
	},
	aerialace: {
		num: 332,
		accuracy: true,
		basePower: 60,
		type: "Flying",
		category: "Physical",
		name: "Aerial Ace",
		pp: 20,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, airborne: 1, slicing: 1, distance: 1, protect: 1, metronome: 1, mirror: 1 },
		secondary: null,
		target: "any",
	},
	aquacutter: {
		num: 895,
		accuracy: 100,
		basePower: 75,
		type: "Water",
		category: "Physical",
		name: "Aqua Cutter",
		pp: 20,
		priority: 0,
		critRatio: 6,
		flags: { slicing: 1, protect: 1, metronome: 1, mirror: 1 },
		secondary: null,
		target: "normal",
	},
	aquajet: {
		num: 453,
		accuracy: 100,
		basePower: 40,
		type: "Water",
		category: "Physical",
		name: "Aqua Jet",
		pp: 20,
		priority: 1,
		critRatio: 2,
		flags: { contact: 1, crash: 1, protect: 1, metronome: 1, mirror: 1 },
		secondary: null,
		target: "normal",
	},
	aquastep: {
		num: 872,
		accuracy: 100,
		basePower: 80,
		type: "Water",
		category: "Physical",
		name: "Aqua Step",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { contact: 1, dance: 1, kick: 1, protect: 1, metronome: 1, mirror: 1 },
		secondary: {chance: 100, self: {boosts: {spe: 1,},},},
		target: "normal",
	},
	aquatail: {
		num: 401,
		accuracy: 90,
		basePower: 90,
		type: "Water",
		category: "Physical",
		name: "Aqua Tail",
		pp: 10,
		priority: 0,
		critRatio: 2,
		flags: { contact: 1, sweep: 1, protect: 1, metronome: 1, mirror: 1 },
		onHit(target, source, move) {
		    if ((target.hasAbility && target.hasAbility('bubblefoam')) || target.status === 'bubbleblight') {
				if (target.addVolatile('tripped')) { this.add('-start', target, 'tripped'); }
				return;
			}
		    const battle = source.battle;
		    const targetAction = battle.queue.willMove(target);
			let targetPriority = 0;
			if (targetAction && targetAction.move) { targetPriority = battle.dex.moves.get(targetAction.move.id).priority || 0; }
			const userMovePriority = move.priority || 0;
			if (targetPriority < userMovePriority) { if (target.addVolatile('tripped')) { this.add('-start', target, 'tripped'); } }
		},
		secondary: null,
		target: "normal",
	},
	armthrust: {
		num: 292,
		accuracy: 100,
		basePower: 30,
		type: "Fighting",
		category: "Physical",
		name: "Arm Thrust",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, metronome: 1, mirror: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
	},
	assurance: {
		num: 372,
		accuracy: 100,
		basePower: 60,
		basePowerCallback(pokemon, target, move) {
			if (target.hurtThisTurn) {
				this.debug('BP doubled on damaged target');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		type: "Dark",
		category: "Physical",
		name: "Assurance",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, protect: 1, metronome: 1, mirror: 1 },
		secondary: null,
		target: "normal",
	},
	astonish: {
		num: 310,
		accuracy: 100,
		basePower: 45,
		type: "Ghost",
		category: "Physical",
		name: "Astonish",
		pp: 15,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, protect: 1, metronome: 1, mirror: 1 },
		secondary: { chance: 40, volatileStatus: 'flinch', },
		target: "normal",
	},
	attackorder: {
		num: 454,
		accuracy: 100,
		basePower: 100,
		type: "Bug",
		category: "Physical",
		name: "Attack Order",
		pp: 15,
		priority: 0,
		critRatio: 8,
		flags: { protect: 1, metronome: 1, mirror: 1 },
		onPrepareHit(target, source, move) {
			// Check if ally is a Bug type
			const ally = source.side.active.find(a => a && a !== source);
			if (ally && ally.hasType('Bug')) {
				// Store the ally's attack stat to use in damage calculation
				source.addVolatile('attackorder');
				source.volatiles['attackorder'].allyAttack = ally.getStat('atk', false, true);
			}
		},
		condition: {
			duration: 1,
			onModifyAtk(atk, pokemon) {
				if (this.effectState.allyAttack) {
					return this.effectState.allyAttack;
				}
			},
		},
		secondary: null,
		target: "normal",
	},
	avalanche: {
		num: 419,
		accuracy: 100,
		basePower: 60,
		basePowerCallback(pokemon, target, move) {
			let bp = move.basePower;
			if (pokemon.battle.field.isWeather('snow')) { bp = 90; }
			const wasHit = pokemon.attackedBy.some(p => p.damage > 0 && p.thisTurn);
			if (wasHit) {
				bp *= 2;
				move.critRatio = 6;
			}
			return bp;
		},
		type: "Ice",
		category: "Physical",
		name: "Avalanche",
		pp: 10,
		priority: -4,
		critRatio: 2,
		flags: { sweep: 1, protect: 1, metronome: 1, mirror: 1 },
        onModifyMove(move, pokemon, target) {
            if (pokemon.battle.field.isWeather('snow')) { move.target = 'allAdjacentFoes'; } 
			else { move.target = 'normal'; }
        },
		onHit(target, source, move) {
		    if ((target.hasAbility && target.hasAbility('bubblefoam')) || target.status === 'bubbleblight') {
				if (target.addVolatile('tripped')) { this.add('-start', target, 'tripped'); }
				return;
			}
		    const battle = source.battle;
		    const targetAction = battle.queue.willMove(target);
			let targetPriority = 0;
			if (targetAction && targetAction.move) { targetPriority = battle.dex.moves.get(targetAction.move.id).priority || 0; }
			const userMovePriority = move.priority || 0;
			if (targetPriority < userMovePriority) { if (target.addVolatile('tripped')) { this.add('-start', target, 'tripped'); } }
		},
		secondary: null,
        target: "normal",
	},
	axekick: {
		num: 853,
		accuracy: 95,
		basePower: 120,
		type: "Fighting",
		category: "Physical",
		name: "Axe Kick",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, crush: 1, kick: 1, protect: 1, metronome: 1, mirror: 1 },
		   self: {volatileStatus: 'spent',},
		   condition: {
			   noCopy: true,
			   onStart(pokemon) {
				   this.add('-singlemove', pokemon, 'Axe Kick', '[silent]');
			   },
			   onAccuracy() {
				   return true;
			   },
			   onSourceModifyDamage() {
				   return this.chainModify(2);
			   },
			   onBeforeMovePriority: 100,
			   onBeforeMove(pokemon) {
				   this.debug('removing Axe Kick drawback before attack');
				   pokemon.removeVolatile('spent');
			   },
		   },
		secondary: { chance: 20, volatileStatus: 'confusion', },
	    target: "normal",
	},
	barbbarrage: {
		num: 839,
		accuracy: 100,
		basePower: 60,
		type: "Poison",
		category: "Physical",
		name: "Barb Barrage",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { pierce: 1, protect: 1, metronome: 1, mirror: 1 },
		pierce3: true,
		onBasePower(basePower, pokemon, target) {
			if (target.status === 'psn' || target.status === 'tox') {
				return this.chainModify(2);
			}
		},
		secondary: { chance: 50, status: 'psn', },
		target: "normal",
	},
	barrage: {
		num: 140,
		accuracy: 90,
		basePower: 28,
		type: "Grass",
		category: "Physical",
		name: "Barrage",
		pp: 15,
		priority: 0,
		critRatio: 4,
		overrideOffensiveStat: 'spa',
		flags: { bomb: 1, bullet: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: 6,
		multiaccuracy: true,
		secondary: null,
		target: "normal",
	},
	beakblast: {
		num: 690,
		accuracy: 100,
		basePower: 100,
		type: "Flying",
		category: "Physical",
		name: "Beak Blast",
		pp: 15,
		priority: -3,
		critRatio: 4,
		flags: { beam: 1, bullet: 1, protect: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1 },
		priorityChargeCallback(pokemon) { pokemon.addVolatile('beakblast'); },
		condition: {
			duration: 1,
			onStart(pokemon) { this.add('-singleturn', pokemon, 'move: Beak Blast'); },
			onHit(target, source, move) { if (this.checkMoveMakesContact(move, source, target)) { source.trySetStatus('brn', target); } },
		},
		// FIXME: onMoveAborted(pokemon) {pokemon.removeVolatile('beakblast')},
		onAfterMove(pokemon) { pokemon.removeVolatile('beakblast'); },
		secondary: null,
		target: "normal",
	},
	beatup: {
		num: 251,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target, move) {
			const ally = move.allies!.shift()!;
			let bp;
			// First hit: use user's actual attack
			if (move.hit === 1) {
				const userAtk = pokemon.getStat('atk', false, true);
				bp = 5 + Math.floor(userAtk / 10);
				this.debug(`BP for ${pokemon.name} (user) hit: ${bp} (ATK: ${userAtk})`);
			}
			// Second hit: use actual attack of the active ally on the field
			else if (move.hit === 2) {
				const activeAlly = pokemon.side.active.find(a => a && a !== pokemon && !a.fainted && !a.status);
				if (activeAlly) {
					const allyAtk = activeAlly.getStat('atk', false, true);
					bp = 5 + Math.floor(allyAtk / 10);
					this.debug(`BP for ${activeAlly.name} (active ally) hit: ${bp} (ATK: ${allyAtk})`);
				} else {
					const setSpecies = this.dex.species.get(ally.set.species);
					bp = 5 + Math.floor(setSpecies.baseStats.atk / 10);
					this.debug(`BP for ${setSpecies.name} hit: ${bp} (base ATK)`);
				}
			}
			// Subsequent hits: use base attack of healthy party members
			else {
				const setSpecies = this.dex.species.get(ally.set.species);
				bp = 5 + Math.floor(setSpecies.baseStats.atk / 10);
				this.debug(`BP for ${setSpecies.name} hit: ${bp} (base ATK)`);
			}
			// Only first hit makes contact
			if (move.hit > 1 && move.flags['contact']) { delete move.flags['contact']; }
			return bp;
		},
		type: "Dark",
		category: "Physical",
		name: "Beat Up",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onModifyMove(move, pokemon) {
			move.allies = pokemon.side.pokemon.filter(ally => ally === pokemon || !ally.fainted && !ally.status);
			move.multihit = move.allies.length;
		},
		secondary: null,
		target: "normal",
	},
	behemothbash: {
		num: 782,
		accuracy: 100,
		basePower: 110,
		type: "Steel",
		category: "Physical",
		name: "Behemoth Bash",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, crash: 1, weapon: 1, failcopycat: 1, failmimic: 1, protect: 1, mirror: 1 },
		secondary: null,
	    target: "normal",
		onEffectiveness(typeMod, target, type) {
		   if (type === 'Steel') return 1;
	   },
   },
	behemothblade: {
		num: 781,
		accuracy: 100,
		basePower: 110,
		type: "Steel",
		category: "Physical",
		name: "Behemoth Blade",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, slicing: 1, weapon: 1, failcopycat: 1, failmimic: 1, protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
	},
	bind: {
		num: 20,
		accuracy: 85,
		basePower: 35,
		type: "Normal",
		category: "Physical",
		name: "Bind",
		pp: 20,
		priority: 0,
		critRatio: 4,
		flags: { binding: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
	},
	bite: {
		num: 44,
		accuracy: 100,
		basePower: 60,
		type: "Dark",
		category: "Physical",
		name: "Bite",
		pp: 25,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, bite: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, volatileStatus: 'flinch', },
		target: "normal",
	},
	bitterblade: {
		num: 891,
		accuracy: 100,
		basePower: 90,
		type: "Fire",
		category: "Physical",
		name: "Bitter Blade",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, drain: 1, slicing: 1, protect: 1, mirror: 1, heal: 1, metronome: 1 },
		drain: [1, 2],
		secondary: null,
		target: "normal",
	},
	blazekick: {
		num: 299,
		accuracy: 90,
		basePower: 85,
		type: "Fire",
		category: "Physical",
		name: "Blaze Kick",
		pp: 10,
		priority: 0,
		critRatio: 7,
		flags: { contact: 1, kick: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 10, status: 'brn', },
		target: "normal",
	},
	blazingtorque: {
		num: 896,
		accuracy: 100,
		basePower: 80,
		type: "Fire",
		category: "Physical",
		name: "Blazing Torque",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { crash: 1, protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1, nosketch: 1,},
		secondary: { chance: 30, status: 'brn', },
		target: "normal",
	},
	bodypress: {
		num: 776,
		accuracy: 100,
		basePower: 80,
		type: "Fighting",
		category: "Physical",
		name: "Body Press",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, crush: 1, protect: 1, mirror: 1 },
		overrideOffensiveStat: 'def',
		secondary: null,
		target: "normal",
	},
	bodyslam: {
		num: 34,
		accuracy: 100,
		basePower: 85,
		type: "Normal",
		category: "Physical",
		name: "Body Slam",
		pp: 15,
		priority: 0,
		critRatio: 3,
		flags: { contact: 1, crush: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: { chance: 30, status: 'par', },
		target: "normal",
	},
	boltstrike: {
		num: 550,
		accuracy: 90,
		basePower: 140,
		type: "Electric",
		category: "Physical",
		name: "Bolt Strike",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, crash: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 25, status: 'par', },
		target: "normal",
	},
	boneclub: {
		num: 125,
		accuracy: 100,
		basePower: 45,
		type: "Ground",
		category: "Physical",
		name: "Bone Club",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { weapon: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, volatileStatus: 'flinch', },
		target: "normal",
	},
	bonerush: {
		num: 198,
		accuracy: 100,
		basePower: 25,
		type: "Ground",
		category: "Physical",
		name: "Bone Rush",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { weapon: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
	},
	bonemerang: {
		num: 155,
		accuracy: 100,
		basePower: 50,
		type: "Ground",
		category: "Physical",
		name: "Bonemerang",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { throw: 1, weapon: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 3],
		secondary: null,
		target: "normal",
	},
	bounce: {
		num: 340,
		accuracy: 95,
		basePower: 105,
		type: "Flying",
		category: "Physical",
		name: "Bounce",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: {contact: 1, airborne: 1, charge: 1, protect: 1, mirror: 1, gravity: 1, distance: 1, metronome: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1,},
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		condition: {
			duration: 2,
			onInvulnerability(target, source, move) {
				if (['gust', 'twister', 'skyuppercut', 'thunder', 'hurricane', 'smackdown', 'thousandarrows'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceBasePower(basePower, target, source, move) {
				if (move.id === 'gust' || move.id === 'twister') {
					return this.chainModify(2);
				}
			},
		},
		secondary: { chance: 30, status: 'par', },
		target: "any",
	},
	branchpoke: {
		num: 785,
		accuracy: 100,
		basePower: 40,
		type: "Grass",
		category: "Physical",
		name: "Branch Poke",
		pp: 40,
		priority: 0,
		critRatio: 2,
		flags: { weapon: 1, protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
	},
	branchstab: {
		num: 1200,
		accuracy: 95,
		basePower: 55,
		type: "Grass",
		category: "Physical",
		name: "Branch Stab",
		pp: 15,
		priority: 0,
		critRatio: 3,
		flags: { weapon: 1, protect: 1, mirror: 1 },
		multihit: 2,
		secondary: null,
		target: "normal",
	},
	bravebird: {
		num: 413,
		accuracy: 100,
		basePower: 120,
		type: "Flying",
		category: "Physical",
		name: "Brave Bird",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, crash: 1, protect: 1, mirror: 1, distance: 1, metronome: 1 },
		recoil: [33, 100],
		secondary: null,
		target: "any",
	},
	breakingswipe: {
		num: 784,
		accuracy: 100,
		basePower: 75,
		type: "Dragon",
		category: "Physical",
		name: "Breaking Swipe",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, sweep: 1, protect: 1, mirror: 1 },
		secondary: { chance: 100, boosts: {atk: -1,}, },
		onHit(target, source, move) {
		    if ((target.hasAbility && target.hasAbility('bubblefoam')) || target.status === 'bubbleblight') {
				if (target.addVolatile('tripped')) { this.add('-start', target, 'tripped'); }
				return;
			}
		    const battle = source.battle;
		    const targetAction = battle.queue.willMove(target);
			let targetPriority = 0;
			if (targetAction && targetAction.move) { targetPriority = battle.dex.moves.get(targetAction.move.id).priority || 0; }
			const userMovePriority = move.priority || 0;
			if (targetPriority < userMovePriority) { if (target.addVolatile('tripped')) { this.add('-start', target, 'tripped'); } }
		},
		target: "allAdjacentFoes",
	},
	brickbreak: {
		num: 280,
		accuracy: 100,
		basePower: 75,
		type: "Fighting",
		category: "Physical",
		name: "Brick Break",
		pp: 15,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onTryHit(pokemon) {
			// will shatter screens through sub, before you hit
			pokemon.side.removeSideCondition('reflect');
			pokemon.side.removeSideCondition('lightscreen');
			pokemon.side.removeSideCondition('auroraveil');
		},
		secondary: null,
		target: "normal",
	},
	brutalswing: {
		num: 693,
		accuracy: 100,
		basePower: 60,
		type: "Dark",
		category: "Physical",
		name: "Brutal Swing",
		pp: 20,
		priority: 0,
		critRatio: 6,
		flags: { contact: 1, spin: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacent",
	},
	bugbite: {
		num: 450,
		accuracy: 100,
		basePower: 60,
		type: "Bug",
		category: "Physical",
		name: "Bug Bite",
		pp: 20,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, bite: 1, protect: 1, mirror: 1, metronome: 1 },
		onHit(target, source, move) {
			const item = target.getItem();
			if (source.hp && item.isBerry && target.takeItem(source)) {
				this.add('-enditem', target, item.name, '[from] stealeat', '[move] Bug Bite', `[of] ${source}`);
				if (this.singleEvent('Eat', item, target.itemState, source, source, move)) {
					this.runEvent('EatItem', source, source, move, item);
					if (item.id === 'leppaberry') target.staleness = 'external';
				}
				if (item.onEat) {
					source.ateBerry = true;
				}
			}
		},
		secondary: null,
		target: "normal",
	},
	bulldoze: {
		num: 523,
		accuracy: 100,
		basePower: 60,
		type: "Ground",
		category: "Physical",
		name: "Bulldoze",
		pp: 20,
		priority: 0,
		critRatio: 3,
		flags: { protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: { chance: 100, boosts: { spe: -1 },},
		target: "allAdjacent",
	},
	bulletpunch: {
		num: 418,
		accuracy: 100,
		basePower: 40,
		type: "Steel",
		category: "Physical",
		name: "Bullet Punch",
		pp: 30,
		priority: 1,
		critRatio: 4,
		flags: { contact: 1, punch: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	bulletseed: {
		num: 331,
		accuracy: 100,
		basePower: 25,
		type: "Grass",
		category: "Physical",
		name: "Bullet Seed",
		pp: 30,
		priority: 0,
		critRatio: 4,
		flags: { bullet: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
	},
	ceaselessedge: {
		num: 845,
		accuracy: 90,
		basePower: 65,
		type: "Dark",
		category: "Physical",
		name: "Ceaseless Edge",
		pp: 15,
		priority: 0,
		critRatio: 5,
		flags: { slicing: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onAfterHit(target, source, move) {
			if (!move.hasSheerForce && source.hp) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('spikes');
				}
			}
		},
		onAfterSubDamage(damage, target, source, move) {
			if (!move.hasSheerForce && source.hp) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('spikes');
				}
			}
		},
		secondary: {}, // Sheer Force-boosted
		target: "normal",
	},
	circlethrow: {
		num: 509,
		accuracy: 95,
		basePower: 60,
		type: "Fighting",
		category: "Physical",
		name: "Circle Throw",
		pp: 15,
		priority: -4,
		critRatio: 4,
		flags: { contact: 1, launch: 1, throw: 1, protect: 1, mirror: 1, metronome: 1, noassist: 1, failcopycat: 1 },
		forceSwitch: true,
		target: "normal",
	},
	closecombat: {
		num: 370,
		accuracy: 100,
		basePower: 110,
		type: "Fighting",
		category: "Physical",
		name: "Close Combat",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {boosts: {def: -1, spd: -1,},},
		secondary: null,
		target: "normal",
	},
	collisioncourse: {
		num: 878,
		accuracy: 100,
		basePower: 100,
		type: "Fighting",
		category: "Physical",
		name: "Collision Course",
		pp: 5,
		priority: 0,
		critRatio: 5,
		flags: { airborne: 1, crash: 1, spin: 1, contact: 1, protect: 1, mirror: 1 },
		onBasePower(basePower, source, target, move) {
			if (target.runEffectiveness(move) > 0) {
				// Placeholder
				this.debug(`collision course super effective buff`);
				return this.chainModify([5461, 4096]);
			}
		},
		secondary: null,
		target: "normal",
	},
	combattorque: {
		num: 899,
		accuracy: 100,
		basePower: 100,
		type: "Fighting",
		category: "Physical",
		name: "Combat Torque",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { crash: 1, protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1, nosketch: 1,},
		secondary: null,
		target: "normal",
	},
	comeuppance: {
		num: 894,
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon) {
			const lastDamagedBy = pokemon.getLastDamagedBy(true);
			if (lastDamagedBy !== undefined) {
				return (lastDamagedBy.damage * 1.5) || 1;
			}
			return 0;
		},
		type: "Dark",
		category: "Physical",
		name: "Comeuppance",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, failmefirst: 1 },
		onTry(source) {
			const lastDamagedBy = source.getLastDamagedBy(true);
			if (!lastDamagedBy?.thisTurn) return false;
		},
		onModifyTarget(targetRelayVar, source, target, move) {
			const lastDamagedBy = source.getLastDamagedBy(true);
			if (lastDamagedBy) {
				targetRelayVar.target = this.getAtSlot(lastDamagedBy.slot);
			}
		},
		secondary: null,
		target: "scripted",
	},
	counter: {
		num: 68,
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon) {
			if (!pokemon.volatiles['counter']) return 0;
			return pokemon.volatiles['counter'].damage || 1;
		},
		type: "Fighting",
		category: "Physical",
		name: "Counter",
		pp: 20,
		priority: -5,
		critRatio: 0,
		flags: { contact: 1, protect: 1, failmefirst: 1, noassist: 1, failcopycat: 1 },
		beforeTurnCallback(pokemon) {
			pokemon.addVolatile('counter');
		},
		onTry(source) {
			if (!source.volatiles['counter']) return false;
			if (source.volatiles['counter'].slot === null) return false;
		},
		condition: {
			duration: 1,
			noCopy: true,
			onStart(target, source, move) {
				this.effectState.slot = null;
				this.effectState.damage = 0;
			},
			onRedirectTargetPriority: -1,
			onRedirectTarget(target, source, source2, move) {
				if (move.id !== 'counter') return;
				if (source !== this.effectState.target || !this.effectState.slot) return;
				return this.getAtSlot(this.effectState.slot);
			},
			onDamagingHit(damage, target, source, move) {
				if (!source.isAlly(target) && this.getCategory(move) === 'Physical') {
					this.effectState.slot = source.getSlot();
					this.effectState.damage = 2 * damage;
				}
			},
		},
		secondary: null,
		target: "scripted",
	},
	covet: {
		num: 343,
		accuracy: 100,
		basePower: 60,
		type: "Normal",
		category: "Physical",
		name: "Covet",
		pp: 25,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, failmefirst: 1, noassist: 1, failcopycat: 1 },
		onAfterHit(target, source, move) {
			if (source.item || source.volatiles['gem']) {
				return;
			}
			const yourItem = target.takeItem(source);
			if (!yourItem) {
				return;
			}
			if (
				!this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem) ||
				!source.setItem(yourItem)
			) {
				target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
				return;
			}
			this.add('-item', source, yourItem, '[from] move: Covet', `[of] ${target}`);
		},
		secondary: null,
		target: "normal",
	},
	crabhammer: {
		num: 152,
		accuracy: 95,
		basePower: 100,
		type: "Water",
		category: "Physical",
		name: "Crabhammer",
		pp: 10,
		priority: 0,
		critRatio: 8,
		flags: { contact: 1, claw: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	crosschop: {
		num: 238,
		accuracy: 85,
		basePower: 100,
		type: "Fighting",
		category: "Physical",
		name: "Cross Chop",
		pp: 5,
		priority: 0,
		critRatio: 8,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	crosspoison: {
		num: 440,
		accuracy: 100,
		basePower: 75,
		type: "Poison",
		category: "Physical",
		name: "Cross Poison",
		pp: 20,
		priority: 0,
		critRatio: 7,
		flags: { contact: 1, slicing: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 10, status: 'psn', },
		onAfterHit(this, source, target, move) {
			if (move.moveHitData && move.moveHitData[target.getSlot()]?.crit && target && !target.status) {
				target.trySetStatus('tox', source, move);
			}
		},
		target: "normal",
	},
	crunch: {
		num: 242,
		accuracy: 100,
		basePower: 80,
		type: "Dark",
		category: "Physical",
		name: "Crunch",
		pp: 15,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, bite: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 20, boosts: { def: -1 }, },
		target: "normal",
	},
	crushclaw: {
		num: 306,
		accuracy: 95,
		basePower: 105,
		type: "Normal",
		category: "Physical",
		name: "Crush Claw",
		pp: 5,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, claw: 1, crush: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 50, boosts: {def: -1,}, },
		target: "normal",
	},
	crushgrip: {
		num: 462,
		accuracy: 100,
		basePower: 0,
		   basePowerCallback(pokemon, target) {
			   const hp = target.hp;
			   const maxHP = target.maxhp;
			   const bp = Math.floor(Math.floor((180 * (100 * Math.floor(hp * 4096 / maxHP)) + 2048 - 1) / 4096) / 100) || 1;
			   this.debug(`BP for ${hp}/${maxHP} HP: ${bp}`);
			   return bp;
		   },
		type: "Normal",
		category: "Physical",
		name: "Crush Grip",
		pp: 5,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, crush: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	darkestlariat: {
		num: 663,
		accuracy: 100,
		basePower: 85,
		type: "Dark",
		category: "Physical",
		name: "Darkest Lariat",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, spin: 1, protect: 1, mirror: 1, metronome: 1 },
		ignoreEvasion: true,
		ignoreDefensive: true,
		secondary: { chance: 20, status: 'fear', },
		target: "normal",
	},
	diamondstorm: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		type: "Rock",
		category: "Physical",
		name: "Diamond Storm",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { magic: 1, protect: 1, mirror: 1 },
		self: {
			chance: 50,
			boosts: {def: 2,},
		},
		secondary: { chance: 100, volatileStatus: 'magicdust', },
		target: "allAdjacentFoes",
	},
	dig: {
		num: 91,
		accuracy: 100,
		basePower: 120,
		type: "Ground",
		category: "Physical",
		name: "Dig",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, charge: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1, },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		condition: {
			duration: 2,
			onImmunity(type, pokemon) {
				if (type === 'sandstorm' || type === 'hail') return false;
			},
			onInvulnerability(target, source, move) {
				if (['earthquake', 'magnitude'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (move.id === 'earthquake' || move.id === 'magnitude') {
					return this.chainModify(2);
				}
			},
		},
		secondary: null,
		target: "normal",
	},
	direclaw: {
		num: 827,
		accuracy: 100,
		basePower: 70,
		type: "Poison",
		category: "Physical",
		name: "Dire Claw",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, claw: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {chance: 39,
			onHit(target, source) {
				const result = this.random(3);
				   if (result === 0) {
					   target.trySetStatus('psn', source);
				   } else if (result === 1) {
					   target.trySetStatus('par', source);
				   } else {
					   target.trySetStatus('drowsy', source);
				   }
			},
		},
		target: "normal",
	},
	dive: {
		num: 291,
		accuracy: 100,
		basePower: 120,
		type: "Water",
		category: "Physical",
		name: "Dive",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { contact: 1, charge: 1, protect: 1, mirror: 1, nonsky: 1, allyanim: 1, metronome: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1, },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			if (attacker.hasAbility('gulpmissile') && attacker.species.name === 'Cramorant' && !attacker.transformed) {
				const forme = attacker.hp <= attacker.maxhp / 2 ? 'cramorantgorging' : 'cramorantgulping';
				attacker.formeChange(forme, move);
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		condition: {
			duration: 2,
			onImmunity(type, pokemon) {
				if (type === 'sandstorm' || type === 'hail') return false;
			},
			onInvulnerability(target, source, move) {
				if (['surf', 'whirlpool'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (move.id === 'surf' || move.id === 'whirlpool') {
					return this.chainModify(2);
				}
			},
		},
		secondary: null,
		target: "normal",
	},
	doubleedge: {
		num: 38,
		accuracy: 100,
		basePower: 120,
		type: "Normal",
		category: "Physical",
		name: "Double-Edge",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, crash: 1, protect: 1, mirror: 1, metronome: 1 },
		recoil: [33, 100],
		secondary: null,
		target: "normal",
	},
	doublehit: {
		num: 458,
		accuracy: 90,
		basePower: 45,
		type: "Normal",
		category: "Physical",
		name: "Double Hit",
		pp: 20,
		priority: 0,
		critRatio: 3,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: 2,
		secondary: null,
		target: "normal",
	},
	doublekick: {
		num: 24,
		accuracy: 95,
		basePower: 48,
		type: "Fighting",
		category: "Physical",
		name: "Double Kick",
		pp: 30,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, kick: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: 2,
		secondary: null,
		target: "normal",
	},
	doubleshock: {
		num: 892,
		accuracy: 100,
		basePower: 140,
		type: "Electric",
		category: "Physical",
		name: "Double Shock",
		pp: 5,
		priority: 0,
		critRatio: 2,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onTryMove(pokemon, target, move) {
			if (pokemon.hasType('Electric')) return;
			this.add('-fail', pokemon, 'move: Double Shock');
			this.attrLastMove('[still]');
			return null;
		},
		self: {
			onHit(pokemon) {
				pokemon.setType(pokemon.getTypes(true).map(type => type === "Electric" ? "???" : type));
				this.add('-start', pokemon, 'typechange', pokemon.getTypes().join('/'), '[from] move: Double Shock');
			},
		},
		secondary: null,
		target: "normal",
	},
	dragonascent: {
		num: 620,
		accuracy: 100,
		basePower: 120,
		type: "Flying",
		type2: "Dragon",
		category: "Physical",
		name: "Dragon Ascent",
		pp: 5,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, airborne: 1, protect: 1, mirror: 1, distance: 1 },
		self: {boosts: {def: -1,spd: -1,},},
		target: "any",
	},
	dragonclaw: {
		num: 337,
		accuracy: 100,
		basePower: 80,
		type: "Dragon",
		category: "Physical",
		name: "Dragon Claw",
		pp: 15,
		priority: 0,
		critRatio: 8,
		flags: { contact: 1, claw: 1, protect: 1, mirror: 1, metronome: 1 },
		secondaries: [
		   { chance: 20, status: 'dragonblight', },
		   { chance: 5, self: { status: 'dragonblight' }, },
	   ],
		target: "normal",
	},
	dragondarts: {
		num: 751,
		accuracy: 100,
		basePower: 45,
		type: "Dragon",
		category: "Physical",
		name: "Dragon Darts",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { protect: 1, pierce: 1, mirror: 1, metronome: 1, noparentalbond: 1 },
		pierce3: true,
		multihit: 2,
		smartTarget: true,
		secondary: null,
		target: "normal",
	},
	dragonhammer: {
		num: 692,
		accuracy: 100,
		basePower: 95,
		type: "Dragon",
		category: "Physical",
		name: "Dragon Hammer",
		pp: 15,
		priority: 0,
		critRatio: 6,
		flags: { crush: 1, weapon: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 40, status: 'dragonblight', },
		target: "normal",
	},
	dragonrush: {
		num: 407,
		accuracy: 85,
		basePower: 115,
		type: "Dragon",
		category: "Physical",
		name: "Dragon Rush",
		pp: 10,
		priority: 0,
		critRatio: 6,
		flags: { contact: 1, airborne: 1, crash: 1, protect: 1, mirror: 1, metronome: 1 },
		secondaries: [
		   { chance: 30, volatileStatus: 'flinch', },
		   { chance: 20, self: { status: 'dragonblight' }, },
	   ],
		target: "normal",
	},
	dragontail: {
		num: 525,
		accuracy: 90,
		basePower: 60,
		type: "Dragon",
		category: "Physical",
		name: "Dragon Tail",
		pp: 10,
		priority: -6,
		critRatio: 5,
		flags: { contact: 1, launch: 1, sweep: 1, protect: 1, mirror: 1, metronome: 1, noassist: 1, failcopycat: 1 },
		forceSwitch: true,
		target: "normal",
		onHit(target, source, move) {
			if ((target.hasAbility && target.hasAbility('bubblefoam')) || target.status === 'bubbleblight') {
				if (target.addVolatile('tripped')) { this.add('-start', target, 'tripped'); }
				return;
			}
			const battle = source.battle;
			const targetAction = battle.queue.willMove(target);
			let targetPriority = 0;
			if (targetAction && targetAction.move) { targetPriority = battle.dex.moves.get(targetAction.move.id).priority || 0; }
			const userMovePriority = move.priority || 0;
			if (targetPriority < userMovePriority) { if (target.addVolatile('tripped')) { this.add('-start', target, 'tripped'); } }
		},
	},
	drainpunch: {
		num: 409,
		accuracy: 100,
		basePower: 75,
		type: "Fighting",
		category: "Physical",
		name: "Drain Punch",
		pp: 10,
		priority: 0,
		critRatio: 2,
		flags: { drain: 1, heal: 1, punch: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		drain: [1, 2],
		secondary: null,
		target: "normal",
	},
	drillpeck: {
		num: 65,
		accuracy: 100,
		basePower: 80,
		type: "Flying",
		category: "Physical",
		name: "Drill Peck",
		pp: 20,
		priority: 0,
		critRatio: 8,
		flags: { contact: 1, pierce: 1, protect: 1, mirror: 1, distance: 1, metronome: 1 },
		pierce2: true,
		secondary: null,
		target: "any",
	},
	drillrun: {
		num: 529,
		accuracy: 95,
		basePower: 80,
		type: "Ground",
		category: "Physical",
		name: "Drill Run",
		pp: 10,
		priority: 0,
		critRatio: 7,
		flags: { contact: 1, pierce: 1, protect: 1, mirror: 1, metronome: 1 },
		pierce2: true,
		secondary: null,
		target: "normal",
	},
	drumbeating: {
		num: 778,
		accuracy: 100,
		basePower: 95,
		type: "Grass",
		category: "Physical",
		name: "Drum Beating",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { protect: 1, mirror: 1 },
		secondary: { chance: 100, boosts: { spe: -1 }, },
		target: "normal",
	},
	dualwingbeat: {
		num: 814,
		accuracy: 90,
		basePower: 50,
		type: "Flying",
		category: "Physical",
		name: "Dual Wingbeat",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { contact: 1, wing: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: 2,
		secondary: null,
		target: "normal",
	},
	dynamicpunch: {
		num: 223,
		accuracy: 20,
		basePower: 100,
		type: "Fighting",
		category: "Physical",
		name: "Dynamic Punch",
		pp: 5,
		priority: 0,
		critRatio: 0,
		flags: { contact: 1, punch: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, volatileStatus: 'confusion', },
		target: "normal",
	},
	earthquake: {
		num: 89,
		accuracy: 100,
		basePower: 100,
		type: "Ground",
		category: "Physical",
		name: "Earthquake",
		pp: 10,
		priority: 0,
		critRatio: 0,
		flags: { sweep: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: null,
		onHit(target, source, move) {
			if ((target.hasAbility && target.hasAbility('bubblefoam')) || target.status === 'bubbleblight') {
				if (target.addVolatile('tripped')) { this.add('-start', target, 'tripped'); }
				return;
			}
			const battle = source.battle;
			const targetAction = battle.queue.willMove(target);
			let targetPriority = 0;
			if (targetAction && targetAction.move) { targetPriority = battle.dex.moves.get(targetAction.move.id).priority || 0; }
			const userMovePriority = move.priority || 0;
			if (targetPriority < userMovePriority) { if (target.addVolatile('tripped')) { this.add('-start', target, 'tripped'); } }
		},
		target: "allAdjacent",
	},
	endeavor: {
		num: 283,
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon, target) {
			return target.getUndynamaxedHP() - pokemon.hp;
		},
		type: "Normal",
		category: "Physical",
		name: "Endeavor",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, noparentalbond: 1 },
		onTryImmunity(target, pokemon) {
			return pokemon.hp < target.hp;
		},
		secondary: null,
		target: "normal",
	},
	explosion: {
		num: 153,
		accuracy: 100,
		basePower: 330,
		type: "Normal",
		category: "Physical",
		name: "Explosion",
		pp: 5,
		priority: 0,
		critRatio: 15,
		flags: { protect: 1, explosive: 1, mirror: 1, metronome: 1, noparentalbond: 1 },
		selfdestruct: "always",
		secondary: null,
		target: "allAdjacent",
	},
	extremespeed: {
		num: 245,
		accuracy: 100,
		basePower: 80,
		type: "Normal",
		category: "Physical",
		name: "Extreme Speed",
		pp: 5,
		priority: 2,
		critRatio: 1,
		flags: { contact: 1, crash: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	facade: {
		num: 263,
		accuracy: 100,
		basePower: 70,
		type: "Normal",
		category: "Physical",
		name: "Facade",
		pp: 20,
		priority: 0,
		critRatio: 2,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onBasePower(basePower, pokemon) {
			if (pokemon.status && pokemon.status !== 'slp') {
				return this.chainModify(2);
			}
		},
		secondary: null,
		target: "normal",
	},
	fakeout: {
		num: 252,
		accuracy: 100,
		basePower: 40,
		type: "Normal",
		category: "Physical",
		name: "Fake Out",
		pp: 10,
		priority: 3,
		critRatio: 2,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onTry(source) { if (source.activeMoveActions > 1) {
				this.hint("Fake Out only works on your first turn out.");
				return false;
			}
		},
		secondary: { chance: 100, volatileStatus: 'flinch', },
		target: "normal",
	},
	falsesurrender: {
		num: 793,
		accuracy: true,
		basePower: 80,
		type: "Dark",
		category: "Physical",
		name: "False Surrender",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, pierce: 1, protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
	    onBasePower(basePower, user, target, move) {
	    	// Check if the user has been targeted by any move this turn
	    	const wasTargeted = user.attackedBy.some(entry => entry.thisTurn);
	    	if (!wasTargeted) {
			    this.debug('False Surrender power doubled and pierce3 (not targeted this turn)');
			   move.pierce3 = true;
			    return this.chainModify(2);
	    	} else {
		       // Ensure pierce3 is not set if the condition is not met
		       if (move.pierce3) delete move.pierce3;
			}
       },
	},
	falseswipe: {
		num: 206,
		accuracy: 100,
		basePower: 100,
		type: "Normal",
		category: "Physical",
		name: "False Swipe",
		pp: 40,
		priority: 0,
		critRatio: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onDamagePriority: -20,
		onDamage(damage, target, source, effect) {
			if (damage >= target.hp) return target.hp - 1;
		},
		secondary: null,
		target: "normal",
	},
	feint: {
		num: 364,
		accuracy: 100,
		basePower: 75,
		type: "Normal",
		category: "Physical",
		name: "Feint",
		pp: 10,
		priority: 2,
		critRatio: 0,
		flags: { pierce: 1, mirror: 1, noassist: 1, failcopycat: 1 },
		breaksProtect: true,
		// Breaking protection implemented in scripts.js
		secondary: null,
		target: "normal",
	},
	fellstinger: {
		num: 565,
		accuracy: 100,
		basePower: 60,
		type: "Bug",
		category: "Physical",
		name: "Fell Stinger",
		pp: 25,
		priority: 0,
		critRatio: 6,
		flags: { contact: 1, aura: 1, pierce: 1, protect: 1, mirror: 1, metronome: 1 },
		pierce2: true,
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) {
				pokemon.setStatus('aura', pokemon, {
					auraAbility: 'fellstinger',
					auraName: 'Fell Stinger',
					auraDuration: 5,
				} as any);
			}
		},
		secondary: null,
		target: "normal",
	},
	firefang: {
		num: 424,
		accuracy: 100,
		basePower: 65,
		type: "Fire",
		category: "Physical",
		name: "Fire Fang",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { bite: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondaries: [
			{ chance: 20, status: 'brn', }, 
			{ chance: 10, volatileStatus: 'flinch', },
		],
		target: "normal",
	},
	firelash: {
		num: 680,
		accuracy: 100,
		basePower: 80,
		type: "Fire",
		category: "Physical",
		name: "Fire Lash",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, sweep: 1, protect: 1, mirror: 1, metronome: 1 },
		secondaries: [
			{ chance: 50, boosts: { def: -1 }, },
			{ chance: 10, status: 'brn', },
		],
		target: "normal",
		overrideOffensiveStat: 'spa',
		onHit(target, source, move) {
			if ((target.hasAbility && target.hasAbility('bubblefoam')) || target.status === 'bubbleblight') {
				if (target.addVolatile('tripped')) {
					this.add('-start', target, 'tripped');
					}
				return;
			}
			const battle = source.battle;
			const targetAction = battle.queue.willMove(target);
			let targetPriority = 0;
			if (targetAction && targetAction.move) {
				targetPriority = battle.dex.moves.get(targetAction.move.id).priority || 0;
				}
			const userMovePriority = move.priority || 0;
			if (targetPriority < userMovePriority) {
				if (target.addVolatile('tripped')) {
					this.add('-start', target, 'tripped');
				}
			}
		},
	},
	firepunch: {
		num: 7,
		accuracy: 100,
		basePower: 75,
		type: "Fire",
		category: "Physical",
		name: "Fire Punch",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		secondary: { chance: 20, status: 'brn', },
		target: "normal",
	},
	firstimpression: {
		num: 660,
		accuracy: 100,
		basePower: 90,
		type: "Bug",
		category: "Physical",
		name: "First Impression",
		pp: 10,
		priority: 4,
		critRatio: 5,
		flags: { contact: 1, crash: 1, protect: 1, mirror: 1, metronome: 1 },
		onTry(source) {
			if (source.activeMoveActions > 1) {
				this.hint("First Impression only works on your first turn out.");
				return false;
			}
		},
		secondary: null,
		target: "normal",
	},
	flail: {
		num: 175,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon) {
			const ratio = Math.max(Math.floor(pokemon.hp * 48 / pokemon.maxhp), 1);
			let bp;
			if (ratio < 2) { bp = 200; } 
			else if (ratio < 5) { bp = 150; } 
			else if (ratio < 10) { bp = 100; } 
			else if (ratio < 17) { bp = 80; } 
			else if (ratio < 33) { bp = 40; } 
			else { bp = 20; }
			this.debug(`BP: ${bp}`);
			return bp;
		},
		type: "Normal",
		category: "Physical",
		name: "Flail",
		pp: 15,
		priority: 0,
		critRatio: 2,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	flamecharge: {
		num: 488,
		accuracy: 95,
		basePower: 45,
		type: "Fire",
		category: "Physical",
		name: "Flame Charge",
		pp: 15,
		priority: 0,
		critRatio: 3,
		flags: { contact: 1, crash: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, self: {boosts: {spe: 1,},}, },
		target: "normal",
	},
	flamewheel: {
		num: 172,
		accuracy: 100,
		basePower: 75,
		type: "Fire",
		category: "Physical",
		name: "Flame Wheel",
		pp: 15,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, spin: 1, protect: 1, mirror: 1, defrost: 1, metronome: 1 },
		secondaries: [
	    	{ chance: 20, status: 'brn', },
			{ chance: 75, self: { boosts: { spe: 1 } }, },
       ],
		target: "normal",
	},
	flareblitz: {
		num: 394,
		accuracy: 100,
		basePower: 120,
		type: "Fire",
		category: "Physical",
		name: "Flare Blitz",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, crash: 1, protect: 1, mirror: 1, defrost: 1, metronome: 1 },
		recoil: [33, 100],
		secondary: { chance: 10, status: 'brn', },
		target: "normal",
	},
	fling: {
		num: 374,
		accuracy: 100,
		basePower: 0,
		type: "Dark",
		category: "Physical",
		name: "Fling",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, throw: 1, mirror: 1, allyanim: 1, metronome: 1, noparentalbond: 1 },
		onPrepareHit(target, source, move) {
			if (source.ignoringItem(true)) return false;
			const item = source.getItem();
			if (!this.singleEvent('TakeItem', item, source.itemState, source, source, move, item)) return false;
			if (!item.fling) return false;
			move.basePower = item.fling.basePower;
			this.debug(`BP: ${move.basePower}`);
			if (item.isBerry) {
				if (source.hasAbility('cudchew')) {
					// Check which ability slot has Cud Chew
					const cudChewSlot = source.ability1 === 'cudchew' ? 1 : 2;
					const abilityStateKey = cudChewSlot === 1 ? 'abilityState1' : 'abilityState2';
					this.singleEvent('EatItem', source.getAbility(cudChewSlot), source[abilityStateKey], source, source, move, item);
				}
				move.onHit = function (foe) {
					if (this.singleEvent('Eat', item, source.itemState, foe, source, move)) {
						this.runEvent('EatItem', foe, source, move, item);
						if (item.id === 'leppaberry') foe.staleness = 'external';
					}
					if (item.onEat) { foe.ateBerry = true; }
				};
			} else if (item.fling.effect) {
				move.onHit = item.fling.effect;
			} else {
				if (!move.secondaries) move.secondaries = [];
				if (item.fling.status) { move.secondaries.push({ status: item.fling.status }); } 
				else if (item.fling.volatileStatus) { move.secondaries.push({ volatileStatus: item.fling.volatileStatus }); }
			}
			source.addVolatile('fling');
		},
		condition: {
		onUpdate(pokemon) {
			const item = pokemon.getItem();
			pokemon.setItem('');
			pokemon.lastItem = item.id;
			pokemon.usedItemThisTurn = true;
			this.add('-enditem', pokemon, item.name, '[from] move: Fling');
			this.runEvent('AfterUseItem', pokemon, null, null, item);
			pokemon.removeVolatile('fling');
			},
		},
		secondary: null,
		target: "normal",
	},
	flipturn: {
		num: 812,
		accuracy: 95,
		basePower: 45,
		type: "Water",
		category: "Physical",
		name: "Flip Turn",
		pp: 20,
		priority: 0,
		critRatio: 1,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		selfSwitch: true,
		secondary: null,
		target: "normal",
	},
	flowertrick: {
		num: 870,
		accuracy: true,
		basePower: 70,
		type: "Grass",
		category: "Physical",
		name: "Flower Trick",
		pp: 10,
		priority: 0,
		critRatio: 15,
		flags: { protect: 1, magic: 1, throw: 1, weapon: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	fly: {
		num: 19,
		accuracy: 95,
		basePower: 130,
		type: "Flying",
		category: "Physical",
		name: "Fly",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, airborne: 1, charge: 1, protect: 1, mirror: 1, gravity: 1, distance: 1, metronome: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1, },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) { return; }
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) { return; }
			attacker.addVolatile('twoturnmove', defender); return null; },
		condition: {
			duration: 2,
			onInvulnerability(target, source, move) {
				if (['gust', 'twister', 'skyuppercut', 'thunder', 'hurricane', 'smackdown', 'thousandarrows'].includes(move.id)) { return; }
				return false;
			},
			onSourceModifyDamage(damage, source, target, move) { if (move.id === 'gust' || move.id === 'twister') { return this.chainModify(2); } },
		},
		secondary: null,
		target: "any",
	},
	flyingpress: {
		num: 560,
		accuracy: 95,
		basePower: 115,
		type: "Fighting",
		type2: "Flying",
		category: "Physical",
		name: "Flying Press",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, airborne: 1, protect: 1, mirror: 1, gravity: 1, distance: 1, nonsky: 1, metronome: 1 },
		secondary: null,
		target: "any",
	},
	focuspunch: {
		num: 264,
		accuracy: 100,
		basePower: 250,
		type: "Fighting",
		category: "Physical",
		name: "Focus Punch",
		pp: 20,
		priority: -3,
		critRatio: 6,
		flags: { contact: 1, protect: 1, punch: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1,},
		priorityChargeCallback(pokemon) { pokemon.addVolatile('focuspunch'); },
		beforeMoveCallback(pokemon) {
			if (pokemon.volatiles['focuspunch']?.lostFocus) {
				this.add('cant', pokemon, 'Focus Punch', 'Focus Punch');
				return true;
			}
		},
		condition: { duration: 1,
			onStart(pokemon) { this.add('-singleturn', pokemon, 'move: Focus Punch'); },
			onHit(pokemon, source, move) { if (move.category !== 'Status') { this.effectState.lostFocus = true; } },
			onTryAddVolatile(status, pokemon) { if (status.id === 'flinch') return null; },
		},
		secondary: null,
		target: "normal",
	},
	forcepalm: {
		num: 395,
		accuracy: 100,
		basePower: 75,
		type: "Fighting",
		category: "Physical",
		name: "Force Palm",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, status: 'par', },
		target: "normal",
	},
	foulplay: {
		num: 492,
		accuracy: 100,
		basePower: 95,
		type: "Dark",
		category: "Physical",
		name: "Foul Play",
		pp: 15,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, magic: 1, protect: 1, mirror: 1, metronome: 1 },
		overrideOffensivePokemon: 'target',
		secondary: null,
		target: "normal",
	},
	freezeshock: {
		num: 553,
		accuracy: 90,
		basePower: 140,
		type: "Ice",
		type2: "Electric",
		category: "Physical",
		name: "Freeze Shock",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, nosleeptalk: 1, failinstruct: 1, cantusetwice: 1 },
		secondaries: [
			{ chance: 30, status: 'par', },
			{ chance: 10, status: 'frz', },
		],
		target: "normal",
	},
	frostblade: {
		num: 4004,
		accuracy: 100,
		basePower: 75,
		type: "Ice",
		category: "Physical",
		name: "Frost Blade",
		pp: 15,
		priority: 0,
		critRatio: 7,
		flags: { slicing: 1, weapon: 1, protect: 1, mirror: 1, metronome: 1 },
		onModifyMove(move, pokemon, target) {
			switch (target?.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.basePower = move.basePower * 0.5;
				break;
			case 'hail':
			case 'snowscape':
				move.basePower = move.basePower * 1.3;
				break;
			}
		},
		secondary: {
			chance: 10,
			status: 'frostbite',
		},
		target: "normal",
	},
	furyattack: {
		num: 31,
		accuracy: 85,
		basePower: 22,
		type: "Normal",
		category: "Physical",
		name: "Fury Attack",
		pp: 20,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, pierce: 1, protect: 1, mirror: 1, metronome: 1 },
		pierce3: true,
		multihit: [2, 5],
		secondary: null,
		target: "normal",
	},
	furycutter: {
		num: 210,
		accuracy: 95,
		basePower: 10,
		basePowerCallback(pokemon) { return Math.min(100, 10 + 6 * pokemon.timesAttacked); },
		type: "Bug",
		category: "Physical",
		name: "Fury Cutter",
		pp: 20,
		priority: 0,
		critRatio: 6,
		flags: { contact: 1, slicing: 1, protect: 1, mirror: 1, metronome: 1  },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
	},
	furyswipes: {
		num: 154,
		accuracy: 90,
		basePower: 22,
		type: "Normal",
		category: "Physical",
		name: "Fury Swipes",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, claw: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
	},
	fusionbolt: {
		num: 559,
		accuracy: 100,
		basePower: 100,
		type: "Electric",
		category: "Physical",
		name: "Fusion Bolt",
		pp: 5,
		priority: 0,
		critRatio: 8,
		flags: { throw: 1, protect: 1, mirror: 1, metronome: 1 },
		onModifyMove(move, pokemon) {
			if (this.lastSuccessfulMoveThisTurn === 'fusionflare') {
				move.type2 = 'Fire';
				(move as any).fusionMode = true;
			} else if (this.getAllActive().some(p => p.hasAbility('turboblaze'))) {
				move.type2 = 'Fire';
				(move as any).fusionMode = true;
				(move as any).turboMode = true;
			}
		},
		onBasePower(basePower, pokemon) {
			if (this.lastSuccessfulMoveThisTurn === 'fusionflare') {
				this.debug('double power');
				return this.chainModify(2);
			} else if (this.getAllActive().some(p => p.hasAbility('turboblaze'))) {
				this.debug('turboblaze boost');
				return this.chainModify(1.2);
			}
		},
		secondary: null,
		target: "normal",
	},
	geargrind: {
		num: 544,
		accuracy: 85,
		basePower: 50,
		type: "Steel",
		category: "Physical",
		name: "Gear Grind",
		pp: 15,
		priority: 0,
		critRatio: 6,
		flags: { contact: 1, crush: 1, spin: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: 2,
		secondary: null,
		target: "normal",
	},
	gigaimpact: {
		num: 416,
		accuracy: 90,
		basePower: 200,
		type: "Normal",
		category: "Physical",
		name: "Giga Impact",
		pp: 5,
		priority: 0,
		critRatio: 9,
		flags: { contact: 1, crash: 1, recharge: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {volatileStatus: 'mustrecharge',},
		secondary: null,
		target: "normal",
	},
	gigatonhammer: {
		num: 893,
		accuracy: 100,
		basePower: 160,
		type: "Steel",
		category: "Physical",
		name: "Gigaton Hammer",
		pp: 5,
		priority: 0,
		critRatio: 5,
		flags: { crush: 1, weapon: 1, protect: 1, mirror: 1, metronome: 1, cantusetwice: 1 },
		onEffectiveness(typeMod, target, type) { if (type === 'Steel') return 1; },
		secondary: null,
		target: "normal",
	},
	glaciallance: {
		num: 824,
		accuracy: 90,
		basePower: 120,
		type: "Ice",
		category: "Physical",
		name: "Glacial Lance",
		pp: 5,
		priority: 0,
		critRatio: 2,
		flags: { pierce: 1, protect: 1, mirror: 1 },
		pierce3: true,
		secondary: null,
		target: "allAdjacentFoes",
	},
	glaiverush: {
		num: 862,
		accuracy: 100,
		basePower: 120,
		type: "Dragon",
		category: "Physical",
		name: "Glaive Rush",
		pp: 5,
		priority: 0,
		critRatio: 6,
		flags: { contact: 1, crash: 1, slicing: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {volatileStatus: 'spent',},
		condition: {
			noCopy: true,
			onStart(pokemon) { this.add('-singlemove', pokemon, 'Glaive Rush', '[silent]'); },
			onAccuracy() { return true; },
			onSourceModifyDamage() { return this.chainModify(2); },
			onBeforeMovePriority: 100,
			onBeforeMove(pokemon) {
				this.debug('removing Glaive Rush drawback before attack');
				pokemon.removeVolatile('spent');
		   },
		},
		secondaries: [
		   { chance: 10, status: 'dragonblight', },
		   { chance: 10, self: { status: 'dragonblight' }, },
	   ],
		target: "normal",
	},
	grassyglide: {
		num: 803,
		accuracy: 100,
		basePower: 55,
		type: "Grass",
		category: "Physical",
		name: "Grassy Glide",
		pp: 20,
		priority: 0,
		critRatio: 3,
		flags: { contact: 1, crash: 1, protect: 1, mirror: 1, metronome: 1 },
		onModifyPriority(priority, source, target, move) { if (this.field.isTerrain('grassyterrain') && source.isGrounded()) { return priority + 1; } },
		secondary: null,
		target: "normal",
	},
	gravapple: {
		num: 788,
		accuracy: 100,
		basePower: 80,
		type: "Grass",
		category: "Physical",
		name: "Grav Apple",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1 },
		onBasePower(basePower) { if (this.field.getPseudoWeather('gravity')) { return this.chainModify(1.5); } },
		secondary: { chance: 100, boosts: {def: -1,}, },
		target: "normal",
	},
	gunkshot: {
		num: 441,
		accuracy: 85,
		basePower: 120,
		type: "Poison",
		category: "Physical",
		name: "Gunk Shot",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { throw: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, status: 'psn', },
		target: "normal",
	},
	gyroball: {
		num: 360,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			let power = Math.floor(25 * target.getStat('spe') / pokemon.getStat('spe')) + 1;
			if (!isFinite(power)) power = 1;
			if (power > 150) power = 150;
			this.debug(`BP: ${power}`);
			return power;
		},
		type: "Steel",
		category: "Physical",
		name: "Gyro Ball",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, spin: 1, protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: null,
		target: "normal",
	},
	hammerarm: {
		num: 359,
		accuracy: 95,
		basePower: 105,
		type: "Fighting",
		category: "Physical",
		name: "Hammer Arm",
		pp: 10,
		priority: 0,
		critRatio: 6,
		flags: { contact: 1, crush: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		self: {boosts: {spe: -1,},},
		secondary: null,
		target: "normal",
	},
	hardpress: {
		num: 912,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			const hp = target.hp;
			const maxHP = target.maxhp;
			const bp = Math.floor(Math.floor((100 * (100 * Math.floor(hp * 4096 / maxHP)) + 2048 - 1) / 4096) / 100) || 1;
			this.debug(`BP for ${hp}/${maxHP} HP: ${bp}`);
			return bp;
		},
		type: "Steel",
		category: "Physical",
		name: "Hard Press",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { crush: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	headbutt: {
		num: 29,
		accuracy: 100,
		basePower: 70,
		type: "Normal",
		category: "Physical",
		name: "Headbutt",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { crash: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, volatileStatus: 'flinch', },
		target: "normal",
	},
	headcharge: {
		num: 543,
		accuracy: 100,
		basePower: 120,
		type: "Normal",
		category: "Physical",
		name: "Head Charge",
		pp: 15,
		priority: 0,
		critRatio: 6,
		flags: { crash: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		recoil: [1, 4],
		secondary: null,
		target: "normal",
	},
	headlongrush: {
		num: 838,
		accuracy: 100,
		basePower: 120,
		type: "Ground",
		category: "Physical",
		name: "Headlong Rush",
		pp: 5,
		priority: 0,
		critRatio: 3,
		flags: { contact: 1, crash: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {boosts: {def: -1, spd: -1,},},
		secondary: null,
		target: "normal",
	},
	headsmash: {
		num: 457,
		accuracy: 90,
		basePower: 150,
		type: "Rock",
		category: "Physical",
		name: "Head Smash",
		pp: 5,
		priority: 0,
		critRatio: 6,
		flags: { contact: 1, crash: 1, protect: 1, mirror: 1, metronome: 1 },
		recoil: [1, 2],
		secondary: null,
		target: "normal",
	},
	heatcrash: {
		num: 535,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			const targetWeight = target.getWeight();
			const pokemonWeight = pokemon.getWeight();
			let bp;
			if (pokemonWeight >= targetWeight * 5) { bp = 120; } 
			else if (pokemonWeight >= targetWeight * 4) { bp = 100; } 
			else if (pokemonWeight >= targetWeight * 3) { bp = 80; } 
			else if (pokemonWeight >= targetWeight * 2) { bp = 60; } 
			else { bp = 40; }
			this.debug(`BP: ${bp}`);
			return bp;
		},
		type: "Fire",
		category: "Physical",
		name: "Heat Crash",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, crash: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		onTryHit(target, pokemon, move) {
			if (target.volatiles['dynamax']) {
				this.add('-fail', pokemon, 'Dynamax');
				this.attrLastMove('[still]');
				return null;
			}
		},
		secondary: null,
		target: "normal",
	},
	heavyslam: {
		num: 484,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			const targetWeight = target.getWeight();
			const pokemonWeight = pokemon.getWeight();
			let bp;
			if (pokemonWeight >= targetWeight * 5) { bp = 120; } 
			else if (pokemonWeight >= targetWeight * 4) { bp = 100; } 
			else if (pokemonWeight >= targetWeight * 3) { bp = 80; } 
			else if (pokemonWeight >= targetWeight * 2) { bp = 60; } 
			else { bp = 40; }
			this.debug(`BP: ${bp}`);
			return bp;
		},
		type: "Steel",
		category: "Physical",
		name: "Heavy Slam",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, crush: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		onTryHit(target, pokemon, move) {
			if (target.volatiles['dynamax']) {
				this.add('-fail', pokemon, 'Dynamax');
				this.attrLastMove('[still]');
				return null;
			}
		},
		secondary: null,
		target: "normal",
	},
	highhorsepower: {
		num: 667,
		accuracy: 95,
		basePower: 95,
		type: "Ground",
		category: "Physical",
		name: "High Horsepower",
		pp: 10,
		priority: 0,
		critRatio: 1,
		flags: { contact: 1, kick: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	highjumpkick: {
		num: 136,
		accuracy: 90,
		basePower: 130,
		type: "Fighting",
		category: "Physical",
		name: "High Jump Kick",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, airborne: 1, crash: 1, kick: 1, protect: 1, mirror: 1, gravity: 1, metronome: 1 },
		hasCrashDamage: true,
		onMoveFail(target, source, move) { this.damage(Math.floor(source.baseMaxhp / 3), source, source, this.dex.conditions.get('High Jump Kick')); },
		secondary: null,
		target: "normal",
	},
	holdback: {
		num: 610,
		accuracy: 100,
		basePower: 100,
		type: "Normal",
		category: "Physical",
		isNonstandard: "Unobtainable",
		name: "Hold Back",
		pp: 40,
		priority: 0,
		critRatio: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onDamagePriority: -20,
		onDamage(damage, target, source, effect) { if (damage >= target.hp) return target.hp - 1; },
		secondary: null,
		target: "normal",
	},
	hornattack: {
		num: 30,
		accuracy: 100,
		basePower: 65,
		type: "Normal",
		category: "Physical",
		name: "Horn Attack",
		pp: 25,
		priority: 0,
		critRatio: 3,
		flags: { contact: 1, pierce: 1, protect: 1, mirror: 1, metronome: 1 },
		pierce2: true,
		secondary: null,
		target: "normal",
	},
	hornleech: {
		num: 532,
		accuracy: 100,
		basePower: 75,
		type: "Grass",
		category: "Physical",
		name: "Horn Leech",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, drain: 1, heal: 1, protect: 1, mirror: 1, metronome: 1 },
		drain: [1, 2],
		secondary: null,
		target: "normal",
	},
	hyperdrill: {
		num: 887,
		accuracy: 100,
		basePower: 100,
		type: "Normal",
		category: "Physical",
		name: "Hyper Drill",
		pp: 5,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, pierce: 1, spin: 1, bypasssub: 1, mirror: 1 },
		breaksProtect: true,
		secondary: null,
		target: "normal",
	},
	hyperspacefury: {
		num: 621,
		accuracy: true,
		basePower: 100,
		type: "Dark",
		category: "Physical",
		name: "Hyperspace Fury",
		pp: 5,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, pierce: 1, mirror: 1, bypasssub: 1, nosketch: 1 },
		breaksProtect: true,
		onTry(source) {
			if (source.species.name === 'Hoopa-Unbound') { return; }
			this.hint("Only a Pokemon whose form is Hoopa Unbound can use this move.");
			if (source.species.name === 'Hoopa') {
				this.attrLastMove('[still]');
				this.add('-fail', source, 'move: Hyperspace Fury', '[forme]');
				return null;
			}
			this.attrLastMove('[still]');
			this.add('-fail', source, 'move: Hyperspace Fury');
			return null;
		},
		self: {boosts: {def: -1,},},
		secondary: null,
		target: "normal",
	},
	icefang: {
		num: 423,
		accuracy: 95,
		basePower: 65,
		type: "Ice",
		category: "Physical",
		name: "Ice Fang",
		pp: 15,
		priority: 0,
		critRatio: 5,
		flags: { bite: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondaries: [
			{ chance: 20, status: 'frostbite', }, 
			{ chance: 10, volatileStatus: 'flinch', },
		],
		target: "normal",
	},
	icehammer: {
		num: 665,
		accuracy: 100,
		basePower: 105,
		type: "Ice",
		category: "Physical",
		name: "Ice Hammer",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { crush: 1, weapon: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		self: {boosts: {spe: -1,},},
		secondary: null,
		target: "normal",
	},
	icepunch: {
		num: 8,
		accuracy: 100,
		basePower: 75,
		type: "Ice",
		category: "Physical",
		name: "Ice Punch",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { punch: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 20, status: 'frostbite', },
		target: "normal",
	},
	iceshard: {
		num: 420,
		accuracy: 100,
		basePower: 40,
		type: "Ice",
		category: "Physical",
		name: "Ice Shard",
		pp: 30,
		priority: 1,
		critRatio: 3,
		flags: { throw: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	icespinner: {
		num: 861,
		accuracy: 100,
		basePower: 80,
		type: "Ice",
		category: "Physical",
		name: "Ice Spinner",
		pp: 15,
		priority: 0,
		critRatio: 2,
		flags: { contact: 1, spin: 1, protect: 1, mirror: 1, metronome: 1 },
		onAfterHit(target, source) { if (source.hp) { this.field.clearTerrain(); } },
		onAfterSubDamage(damage, target, source) { if (source.hp) { this.field.clearTerrain(); } },
		secondary: null,
		target: "normal",
	},
	iciclecrash: {
		num: 556,
		accuracy: 85,
		basePower: 85,
		type: "Ice",
		category: "Physical",
		name: "Icicle Crash",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, volatileStatus: 'flinch', },
		target: "normal",
	},
	iciclespear: {
		num: 333,
		accuracy: 95,
		basePower: 25,
		type: "Ice",
		category: "Physical",
		name: "Icicle Spear",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { pierce: 1, throw: 1, protect: 1, mirror: 1, metronome: 1 },
		pierce3: true,
		multihit: [2, 5],
		secondary: null,
		target: "normal",
	},
	ironhead: {
		num: 442,
		accuracy: 100,
		basePower: 80,
		type: "Steel",
		category: "Physical",
		name: "Iron Head",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, volatileStatus: 'flinch', },
		target: "normal",
	},
	irontail: {
		num: 231,
		accuracy: 75,
		basePower: 100,
		type: "Steel",
		category: "Physical",
		name: "Iron Tail",
		pp: 15,
		priority: -1,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, boosts: {def: -1,}, },
		target: "normal",
	},
	ivycudgel: {
		num: 904,
		accuracy: 100,
		basePower: 100,
		type: "Grass",
		category: "Physical",
		name: "Ivy Cudgel",
		pp: 10,
		priority: 0,
		critRatio: 6,
		flags: { weapon: 1, protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, source, move) { if (move.type !== "Grass") { this.attrLastMove('[anim] Ivy Cudgel ' + move.type); } },
		onModifyType(move, pokemon) {
			switch (pokemon.species.name) {
			case 'Ogerpon-Wellspring': case 'Ogerpon-Wellspring-Tera':
				move.type = 'Water';
				break;
			case 'Ogerpon-Hearthflame': case 'Ogerpon-Hearthflame-Tera':
				move.type = 'Fire';
				break;
			case 'Ogerpon-Cornerstone': case 'Ogerpon-Cornerstone-Tera':
				move.type = 'Rock';
				break;
			}
		},
		secondary: null,
		target: "normal",
	},
	jawlock: {
		num: 746,
		accuracy: 100,
		basePower: 85,
		type: "Dark",
		category: "Physical",
		name: "Jaw Lock",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		onHit(target, source, move) {
			source.addVolatile('trapped', target, move, 'trapper');
			target.addVolatile('trapped', source, move, 'trapper');
			target.addVolatile('bind', source, move);
		},
		secondary: null,
		target: "normal",
	},
	jetpunch: {
		num: 857,
		accuracy: 100,
		basePower: 60,
		type: "Water",
		category: "Physical",
		name: "Jet Punch",
		pp: 15,
		priority: 1,
		critRatio: 2,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1 },
		secondary: null,
		target: "normal",
	},
	jumpkick: {
		num: 26,
		accuracy: 95,
		basePower: 100,
		type: "Fighting",
		category: "Physical",
		name: "Jump Kick",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, airborne: 1, crash: 1, kick: 1, protect: 1, mirror: 1, gravity: 1, metronome: 1 },
		hasCrashDamage: true,
		onMoveFail(target, source, move) { this.damage(Math.floor(source.baseMaxhp / 8), source, source, this.dex.conditions.get('Jump Kick')); },
		secondary: null,
		target: "normal",
	},
	knockoff: {
		num: 282,
		accuracy: 100,
		basePower: 45,
		type: "Dark",
		category: "Physical",
		name: "Knock Off",
		pp: 20,
		priority: 0,
		critRatio: 2,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onBasePower(basePower, source, target, move) {
			const item = target.getItem();
			if (!this.singleEvent('TakeItem', item, target.itemState, target, target, move, item)) return;
			if (item.id) {
				return this.chainModify(1.5);
			}
		},
		onAfterHit(target, source) {
			if (source.hp) {
				const item = target.takeItem();
				if (item) {
					this.add('-enditem', target, item.name, '[from] move: Knock Off', `[of] ${source}`);
				}
			}
		},
		secondary: null,
		target: "normal",
	},
	kowtowcleave: {
		num: 869,
		accuracy: true,
		basePower: 85,
		type: "Dark",
		category: "Physical",
		name: "Kowtow Cleave",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, slicing: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	lashout: {
		num: 808,
		accuracy: 100,
		basePower: 75,
		type: "Dark",
		category: "Physical",
		name: "Lash Out",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onBasePower(basePower, source) {
			if (source.statsLoweredThisTurn) {
				this.debug('lashout buff');
				return this.chainModify(2);
			}
		},
		secondary: null,
		target: "normal",
	},
	lastresort: {
		num: 387,
		accuracy: 100,
		basePower: 140,
		type: "Normal",
		category: "Physical",
		name: "Last Resort",
		pp: 5,
		priority: 0,
		critRatio: 3,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onTry(source) {
			if (source.moveSlots.length < 2) return false; // Last Resort fails unless the user knows at least 2 moves
			let hasLastResort = false; // User must actually have Last Resort for it to succeed
			for (const moveSlot of source.moveSlots) {
				if (moveSlot.id === 'lastresort') {
					hasLastResort = true;
					continue;
				}
				if (!moveSlot.used) return false;
			}
			return hasLastResort;
		},
		secondary: null,
		target: "normal",
	},
	lastrespects: {
		num: 854,
		accuracy: 90,
		basePower: 50,
		basePowerCallback(pokemon, target, move) { return 50 + 50 * pokemon.side.totalFainted; },
		type: "Ghost",
		category: "Physical",
		name: "Last Respects",
		pp: 10,
		priority: 0,
		critRatio: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	leafage: {
		num: 670,
		accuracy: 100,
		basePower: 40,
		type: "Grass",
		category: "Physical",
		name: "Leafage",
		pp: 40,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	leafblade: {
		num: 348,
		accuracy: 100,
		basePower: 90,
		type: "Grass",
		category: "Physical",
		name: "Leaf Blade",
		pp: 15,
		priority: 0,
		critRatio: 7,
		flags: { slicing: 1, weapon: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	leechlife: {
		num: 141,
		accuracy: 100,
		basePower: 80,
		type: "Bug",
		category: "Physical",
		name: "Leech Life",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, drain: 1, heal: 1, protect: 1, mirror: 1, metronome: 1 },
		drain: [1, 2],
		secondary: null,
		target: "normal",
	},
	lick: {
		num: 122,
		accuracy: 100,
		basePower: 75,
		type: "Ghost",
		category: "Physical",
		name: "Lick",
		pp: 30,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
	},
	liquidation: {
		num: 710,
		accuracy: 100,
		basePower: 85,
		type: "Water",
		category: "Physical",
		name: "Liquidation",
		pp: 10,
		priority: 0,
		critRatio: 2,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 20, boosts: {def: -1,}, },
		target: "normal",
	},
	lowkick: {
		num: 67,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			const targetWeight = target.getWeight();
			let bp;
			if (targetWeight >= 2000) 
				{ bp = 120; } 
			else if (targetWeight >= 1000) 
				{ bp = 100; } 
			else if (targetWeight >= 500) 
				{ bp = 80; } 
			else if (targetWeight >= 250) 
				{ bp = 60; } 
			else if (targetWeight >= 100) 
				{ bp = 40; } 
			else { bp = 20; }
			this.debug(`BP: ${bp}`);
			return bp;
		},
		type: "Fighting",
		category: "Physical",
		name: "Low Kick",
		pp: 20,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, kick: 1, protect: 1, mirror: 1, metronome: 1 },
		onTryHit(target, pokemon, move) {
			if (target.volatiles['dynamax']) {
				this.add('-fail', pokemon, 'Dynamax');
				this.attrLastMove('[still]');
				return null;
			}
		},
		secondary: null,
		target: "normal",
	},
	lowsweep: {
		num: 490,
		accuracy: 100,
		basePower: 65,
		type: "Fighting",
		category: "Physical",
		name: "Low Sweep",
		pp: 10,
		priority: -1,
		critRatio: 4,
		flags: { contact: 1, kick: 1, sweep: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, boosts: { spe: -1 }, },
		target: "allAdjacentFoes",
		onHit(target, source, move) {
			if ((target.hasAbility && target.hasAbility('bubblefoam')) || target.status === 'bubbleblight') {
				if (target.addVolatile('tripped')) { this.add('-start', target, 'tripped'); }
				return;
				}
			const battle = source.battle;
			const targetAction = battle.queue.willMove(target);
			let targetPriority = 0;
			if (targetAction && targetAction.move) { targetPriority = battle.dex.moves.get(targetAction.move.id).priority || 0; }
			const userMovePriority = move.priority || 0;
			if (targetPriority < userMovePriority) { if (target.addVolatile('tripped')) { this.add('-start', target, 'tripped'); } }
		},
	},
	lunge: {
		num: 679,
		accuracy: 100,
		basePower: 80,
		type: "Bug",
		category: "Physical",
		name: "Lunge",
		pp: 15,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, boosts: {atk: -1,}, },
		target: "normal",
	},
	machpunch: {
		num: 183,
		accuracy: 100,
		basePower: 40,
		type: "Fighting",
		category: "Physical",
		name: "Mach Punch",
		pp: 30,
		priority: 1,
		critRatio: 4,
		flags: {  punch: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	magicaltorque: {
		num: 900,
		accuracy: 100,
		basePower: 80,
		type: "Fairy",
		category: "Physical",
		name: "Magical Torque",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { crash: 1, magic: 1, protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1, nosketch: 1, },
		secondary: null,
		onHit(target, source, move) {
			target.addVolatile('allure', source, move);
			target.addVolatile('magicdust', source, move);
		},
		target: "normal",
	},
	megahorn: {
		num: 224,
		accuracy: 85,
		basePower: 130,
		type: "Bug",
		category: "Physical",
		name: "Megahorn",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, crash: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	megakick: {
		num: 25,
		accuracy: 85,
		basePower: 120,
		type: "Normal",
		category: "Physical",
		name: "Mega Kick",
		pp: 5,
		priority: 0,
		critRatio: 3,
		flags: { contact: 1, kick: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 20, volatileStatus: 'flinch', },
		target: "normal",
	},
	megapunch: {
		num: 5,
		accuracy: 90,
		basePower: 120,
		type: "Normal",
		category: "Physical",
		name: "Mega Punch",
		pp: 5,
		priority: 0,
		critRatio: 3,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		onHit(target, source, move) 
			{ if (target.volatiles['twoturnmove']) {
				target.addVolatile('confusion');
				target.removeVolatile('twoturnmove');
				this.add('-message', `${target.name}'s focus was broken!`);
	   		}
	   },
	},
	metalburst: {
		num: 368,
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon) {
			const lastDamagedBy = pokemon.getLastDamagedBy(true);
			if (lastDamagedBy !== undefined) { return (lastDamagedBy.damage * 1.5) || 1; }
			return 0;
		},
		type: "Steel",
		category: "Physical",
		name: "Metal Burst",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1, failmefirst: 1 },
		onTry(source) {
			const lastDamagedBy = source.getLastDamagedBy(true);
			if (!lastDamagedBy?.thisTurn) return false;
		},
		onModifyTarget(targetRelayVar, source, target, move) {
			const lastDamagedBy = source.getLastDamagedBy(true);
			if (lastDamagedBy) { targetRelayVar.target = this.getAtSlot(lastDamagedBy.slot); }
		},
		secondary: null,
		target: "scripted",
	},
	metalclaw: {
		num: 232,
		accuracy: 100,
		basePower: 65,
		type: "Steel",
		category: "Physical",
		name: "Metal Claw",
		pp: 35,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, claw: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 20, self: {boosts: {atk: 1,},}, },
		target: "normal",
	},
	meteormash: {
		num: 309,
		accuracy: 90,
		basePower: 100,
		type: "Steel",
		category: "Physical",
		name: "Meteor Mash",
		pp: 10,
		priority: 0,
		critRatio: 6,
		flags: { punch: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 20, self: {boosts: {atk: 1,},}, },
		target: "normal",
	},
	mightycleave: {
		num: 910,
		accuracy: 100,
		basePower: 105,
		type: "Rock",
		category: "Physical",
		name: "Mighty Cleave",
		pp: 5,
		priority: 0,
		critRatio: 6,
		flags: { contact: 1, pierce: 1, slicing: 1, mirror: 1, metronome: 1 },
		pierce1: true,
		secondary: null,
		target: "normal",
	},
	mortalspin: {
		num: 866,
		accuracy: 100,
		basePower: 70,
		type: "Poison",
		category: "Physical",
		name: "Mortal Spin",
		pp: 15,
		priority: 0,
		critRatio: 3,
		flags: { contact: 1, spin: 1, protect: 1, mirror: 1, metronome: 1 },
		onAfterHit(target, pokemon, move) {
			if (!move.hasSheerForce) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Mortal Spin', `[of] ${pokemon}`);
				}
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'steelspikes'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) { this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Mortal Spin', `[of] ${pokemon}`); }
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) { pokemon.removeVolatile('partiallytrapped'); }
			}
		},
		onAfterSubDamage(damage, target, pokemon, move) {
			if (!move.hasSheerForce) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) { this.add('-end', pokemon, 'Leech Seed', '[from] move: Mortal Spin', `[of] ${pokemon}`); }
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'steelspikes'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) { this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Mortal Spin', `[of] ${pokemon}`); }
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) { pokemon.removeVolatile('partiallytrapped'); }
			}
		},
		secondary: { chance: 100, status: 'tox', },
		target: "allAdjacentFoes",
	},
	mountaingale: {
		num: 836,
		accuracy: 90,
		basePower: 110,
		type: "Ice",
		category: "Physical",
		name: "Mountain Gale",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, volatileStatus: 'flinch', },
		target: "normal",
	},
	needlearm: {
		num: 302,
		accuracy: 100,
		basePower: 60,
		type: "Grass",
		category: "Physical",
		name: "Needle Arm",
		pp: 15,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, pierce: 1, protect: 1, mirror: 1, metronome: 1 },
		pierce3: true,
		secondary: { chance: 100, volatileStatus: 'needles', },
		condition: {
			noCopy: true,
			onStart(pokemon) {
				if (!this.effectState.count) {
					this.effectState.count = 1;
					this.add('-start', pokemon, 'Needles');
			   } else if (this.effectState.count < 2) {
					this.effectState.count++;
					this.add('-start', pokemon, 'Needles', '[stack]');
				}
			},
			onResidualOrder: 13,
			onResidual(pokemon) {
				if (pokemon.battle.field.getPseudoWeather('timebreak')) return;
				if (this.field.getPseudoWeather('timebreak')) return;
				const stacks = this.effectState.count || 1;
				if (stacks === 2) { this.damage(pokemon.baseMaxhp / 5); } 
				else { this.damage(pokemon.baseMaxhp / 10); }
			},
			onEnd(pokemon) { this.add('-end', pokemon, 'Needles'); },
		},
		target: "normal",
	},
	nightslash: {
		num: 400,
		accuracy: 100,
		basePower: 75,
		type: "Dark",
		category: "Physical",
		name: "Night Slash",
		pp: 15,
		priority: 0,
		critRatio: 8,
		flags: { slicing: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 10, status: 'fear', },
		target: "normal",
	},
	noxioustorque: {
		num: 898,
		accuracy: 100,
		basePower: 80,
		type: "Poison",
		category: "Physical",
		name: "Noxious Torque",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { crash: 1, protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1, nosketch: 1,},
		onHit(target, source, move) { source.battle.field.setTerrain('toxicterrain'); },
		target: "normal",
	},
	nuzzle: {
		num: 609,
		accuracy: 100,
		basePower: 20,
		type: "Electric",
		category: "Physical",
		name: "Nuzzle",
		pp: 20,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, status: 'par', },
		target: "normal",
	},
	orderup: {
		num: 856,
		accuracy: 100,
		basePower: 80,
		type: "Dragon",
		category: "Physical",
		name: "Order Up",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1 },
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!pokemon.volatiles['commanded']) return;
			const tatsugiri = pokemon.volatiles['commanded'].source;
			if (tatsugiri.baseSpecies.baseSpecies !== 'Tatsugiri') return; // Should never happen
			switch (tatsugiri.baseSpecies.forme) {
			case 'Droopy':
				this.boost({ def: 1 }, pokemon, pokemon);
				break;
			case 'Stretchy':
				this.boost({ spe: 1 }, pokemon, pokemon);
				break;
			default:
				this.boost({ atk: 1 }, pokemon, pokemon);
				break;
			}
		},
		secondary: null,
		hasSheerForce: true,
		target: "normal",
	},
	outrage: {
		num: 200,
		accuracy: 100,
		basePower: 120,
		type: "Dragon",
		category: "Physical",
		name: "Outrage",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, crash:1, protect: 1, mirror: 1, metronome: 1, failinstruct: 1 },
		self: {volatileStatus: 'lockedmove',},
		secondary: { chance: 10, self: { status: 'dragonblight' }, },
		target: "randomNormal",
	},
	payback: {
		num: 371,
		accuracy: 100,
		basePower: 50,
		basePowerCallback(pokemon, target, move) {
			if (target.newlySwitched || this.queue.willMove(target)) {
				this.debug('Payback NOT boosted');
				return move.basePower;
			}
			this.debug('Payback damage boost');
			return move.basePower * 2;
		},
		type: "Dark",
		category: "Physical",
		name: "Payback",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, magic: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	payday: {
		num: 6,
		accuracy: 100,
		basePower: 120,
		type: "Normal",
		category: "Physical",
		name: "Pay Day",
		pp: 5,
		priority: 0,
		critRatio: 3,
		flags: { throw: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, self: { boosts: { atk: -1 } }, },		
		target: "allAdjacentFoes",
	},
	peck: {
		num: 64,
		accuracy: 100,
		basePower: 50,
		type: "Flying",
		category: "Physical",
		name: "Peck",
		pp: 35,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, pierce: 1, protect: 1, mirror: 1, distance: 1, metronome: 1 },
		pierce3: true,
		secondary: { chance: 20, boosts: { def: -1 }, },
		target: "any",
	},
	petalblizzard: {
		num: 572,
		accuracy: 95,
		basePower: 110,
		type: "Grass",
		category: "Physical",
		name: "Petal Blizzard",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1, wind: 1 },
		secondary: null,
		target: "allAdjacent",
	},
	phantomforce: {
		num: 566,
		accuracy: 100,
		basePower: 115,
		type: "Ghost",
		category: "Physical",
		name: "Phantom Force",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, charge: 1, mirror: 1, metronome: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1 },
		breaksProtect: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) { return; }
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) { return; }
			attacker.addVolatile('twoturnmove', defender);
				return null;
		},
		condition: {
			duration: 2,
			onInvulnerability: false,
		},
		secondary: null,
		target: "normal",
	},
	pinmissile: {
		num: 42,
		accuracy: 95,
		basePower: 25,
		type: "Bug",
		category: "Physical",
		name: "Pin Missile",
		pp: 20,
		priority: 0,
		critRatio: 5,
		flags: { pierce: 1, protect: 1, mirror: 1, metronome: 1 },
		pierce3: true,
		multihit: [2, 5],
		secondary: null,
		target: "normal",
	},
	playrough: {
		num: 583,
		accuracy: 85,
		basePower: 95,
		type: "Fairy",
		category: "Physical",
		name: "Play Rough",
		pp: 10,
		priority: 0,
		critRatio: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 20, boosts: {atk: -1,}, },
		target: "normal",
	},
	pluck: {
		num: 365,
		accuracy: 100,
		basePower: 60,
		type: "Flying",
		category: "Physical",
		name: "Pluck",
		pp: 20,
		priority: 0,
		critRatio: 1,
		flags: { contact: 1, protect: 1, mirror: 1, distance: 1, metronome: 1 },
		onHit(target, source, move) {
			const item = target.getItem();
			if (source.hp && item.isBerry && target.takeItem(source)) {
				this.add('-enditem', target, item.name, '[from] stealeat', '[move] Pluck', `[of] ${source}`);
				if (this.singleEvent('Eat', item, target.itemState, source, source, move)) {
					this.runEvent('EatItem', source, source, move, item);
					if (item.id === 'leppaberry') target.staleness = 'external';
				}
				if (item.onEat) { source.ateBerry = true; }
			}
		},
		secondary: null,
		target: "any",
	},
	poisonfang: {
		num: 305,
		accuracy: 100,
		basePower: 65,
		type: "Poison",
		category: "Physical",
		name: "Poison Fang",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		secondary: { chance: 50, status: 'tox', },
		target: "normal",
	},
	poisonjab: {
		num: 398,
		accuracy: 100,
		basePower: 80,
		type: "Poison",
		category: "Physical",
		name: "Poison Jab",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, pierce: 1, protect: 1, mirror: 1, metronome: 1 },
		pierce3: true, 
		secondary: { chance: 20, status: 'psn', },
		target: "normal",
	},
	poisonsting: {
		num: 40,
		accuracy: 100,
		basePower: 35,
		type: "Poison",
		category: "Physical",
		name: "Poison Sting",
		pp: 30,
		priority: 0,
		critRatio: 1,
		flags: { pierce: 1, protect: 1, mirror: 1, metronome: 1 },
		pierce3: true,
		secondary: { chance: 50, status: 'psn', },
		target: "normal",
	},
	poisontail: {
		num: 342,
		accuracy: 100,
		basePower: 60,
		type: "Poison",
		category: "Physical",
		name: "Poison Tail",
		pp: 25,
		priority: -1,
		critRatio: 7,
		flags: { contact: 1, sweep: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 10, status: 'psn', },
		onHit(target, source, move) {
			if ((target.hasAbility && target.hasAbility('bubblefoam')) || target.status === 'bubbleblight') {
				if (target.addVolatile('tripped')) { this.add('-start', target, 'tripped'); }
				return;
			}
			const battle = source.battle;
			const targetAction = battle.queue.willMove(target);
			let targetPriority = 0;
			if (targetAction && targetAction.move) { targetPriority = battle.dex.moves.get(targetAction.move.id).priority || 0; }
			const userMovePriority = move.priority || 0;
			if (targetPriority < userMovePriority) { if (target.addVolatile('tripped')) { this.add('-start', target, 'tripped'); } }
		},
		onAfterHit(this, source, target, move) { if (move.moveHitData && move.moveHitData[target.getSlot()]?.crit && target && !target.status) { target.trySetStatus('tox', source, move); } },
		target: "allAdjacentFoes",
	},
	poltergeist: {
		num: 809,
		accuracy: 90,
		basePower: 110,
		basePowerCallback(source, target, move) {
			if (source.isAlly(target)) return 35;
			return move.basePower;
		},
		type: "Ghost",
		category: "Physical",
		name: "Poltergeist",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { weapon: 1, protect: 1, mirror: 1, metronome: 1 },
		onTry(source, target) { return !!target.item; },
		onTryHit(target, source, move) { this.add('-activate', target, 'move: Poltergeist', this.dex.items.get(target.item).name); },
		onAfterHit(this, source, target) {
			const item = target.getItem();
			if (item && item.isFragile) {
				target.setItem('');
				this.add('-enditem', target, item.name, '[from] move: Poltergeist');
			}
		},
		ignoreImmunity: {Normal: true},
		secondary: null,
		target: "normal",
	},
	populationbomb: {
		num: 860,
		accuracy: 90,
		basePower: 20,
		type: "Normal",
		category: "Physical",
		name: "Population Bomb",
		pp: 10,
		priority: 0,
		critRatio: 2,
		flags: { throw: 1, contact: 1, protect: 1, mirror: 1 },
		multihit: 10,
		multiaccuracy: true,
		secondary: null,
		target: "normal",
	},
	pounce: {
		num: 884,
		accuracy: 100,
		basePower: 50,
		type: "Bug",
		category: "Physical",
		name: "Pounce",
		pp: 20,
		priority: 0,
		critRatio: 4,
		flags: { airborne: 1, contact: 1, protect: 1, mirror: 1 },
		secondary: { chance: 100, boosts: { spe: -1 }, },
		target: "normal",
	},
	pound: {
		num: 1,
		accuracy: 100,
		basePower: 40,
		type: "Normal",
		category: "Physical",
		name: "Pound",
		pp: 35,
		priority: 0,
		critRatio: 2,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	powertrip: {
		num: 681,
		accuracy: 100,
		basePower: 20,
		basePowerCallback(pokemon, target, move) {
			const bp = move.basePower + 20 * pokemon.positiveBoosts();
			this.debug(`BP: ${bp}`);
			return bp;
		},
		type: "Dark",
		category: "Physical",
		name: "Power Trip",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { magic: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	powerwhip: {
		num: 438,
		accuracy: 85,
		basePower: 120,
		type: "Grass",
		category: "Physical",
		name: "Power Whip",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	precipiceblades: {
		num: 619,
		accuracy: 85,
		basePower: 120,
		type: "Ground",
		category: "Physical",
		name: "Precipice Blades",
		pp: 10,
		priority: 0,
		critRatio: 6,
		flags: { pierce: 1, protect: 1, mirror: 1, nonsky: 1 },
		pierce3: true,
		target: "allAdjacentFoes",
	},
	present: {
		num: 217,
		accuracy: 90,
		basePower: 0,
		type: "Normal",
		category: "Physical",
		name: "Present",
		pp: 15,
		priority: 0,
		critRatio: 0,
		flags: { throw: 1, protect: 1, mirror: 1, metronome: 1 },
		onModifyMove(move, pokemon, target) {
			const rand = this.random(10);
			if (rand < 2) 
				{
				move.heal = [1, 4];
				move.infiltrates = true;
			} 
			else if (rand < 6) 
				{ move.basePower = 40; } 
			else if (rand < 9) 
				{ move.basePower = 80; } 
			else 
				{ move.basePower = 120; }
		},
		secondary: null,
		target: "normal",
	},
	psyblade: {
		num: 875,
		accuracy: 100,
		basePower: 95,
		type: "Psychic",
		category: "Physical",
		name: "Psyblade",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		secondary: null,
		onBasePower(basePower, source, target, move) {
			if (
				this.field.isTerrain('electricterrain') ||
				this.field.isTerrain('grassyterrain') ||
				this.field.isTerrain('psychicterrain')
			) {
				this.debug('psyblade terrain boost');
				return 120;
			}
		},
		target: "normal",
	},
	psychicfangs: {
		num: 706,
		accuracy: 100,
		basePower: 85,
		type: "Psychic",
		category: "Physical",
		name: "Psychic Fangs",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { bite: 1, protect: 1, mirror: 1, metronome: 1 },
		onTryHit(pokemon) {
			// will shatter screens through sub, before you hit
			pokemon.side.removeSideCondition('reflect');
			pokemon.side.removeSideCondition('lightscreen');
			pokemon.side.removeSideCondition('auroraveil');
		},
		secondary: null,
		target: "normal",
	},
	psychocut: {
		num: 427,
		accuracy: 100,
		basePower: 70,
		type: "Psychic",
		category: "Physical",
		name: "Psycho Cut",
		pp: 20,
		priority: 0,
		critRatio: 4,
		flags: { slicing: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	psyshieldbash: {
		num: 828,
		accuracy: 95,
		basePower: 85,
		type: "Psychic",
		category: "Physical",
		name: "Psyshield Bash",
		pp: 10,
		priority: 0,
		critRatio: 2,
		flags: { contact: 1, crash: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, self: {boosts: {def: 1,spd: 1,},}, },
		target: "normal",
	},
	pursuit: {
		num: 228,
		accuracy: 100,
		basePower: 40,
		basePowerCallback(pokemon, target, move) {
			// You can't get here unless the pursuit succeeds
			if (target.beingCalledBack || target.switchFlag) {
				this.debug('Pursuit damage boost');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		type: "Dark",
		category: "Physical",
		name: "Pursuit",
		pp: 20,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		beforeTurnCallback(pokemon) {
			for (const side of this.sides) {
				if (side.hasAlly(pokemon)) continue;
				side.addSideCondition('pursuit', pokemon);
				const data = side.getSideConditionData('pursuit');
				if (!data.sources) { data.sources = []; }
				data.sources.push(pokemon);
			}
		},
		onModifyMove(move, source, target) { if (target?.beingCalledBack || target?.switchFlag) move.accuracy = true; },
		onTryHit(target, pokemon) { target.side.removeSideCondition('pursuit'); },
		condition: {
			duration: 1,
			onBeforeSwitchOut(pokemon) {
				this.debug('Pursuit start');
				let alreadyAdded = false;
				pokemon.removeVolatile('destinybond');
				for (const source of this.effectState.sources) {
					if (!source.isAdjacent(pokemon) || !this.queue.cancelMove(source) || !source.hp) continue;
					if (!alreadyAdded) {
						this.add('-activate', pokemon, 'move: Pursuit');
						alreadyAdded = true;
					}
					// Run through each action in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
					// If it is, then Mega Evolve before moving.
					if (source.canMegaEvo || source.canUltraBurst || source.canTerastallize) {
						for (const [actionIndex, action] of this.queue.entries()) {
							if (action.pokemon === source) {
								if (action.choice === 'megaEvo') { this.actions.runMegaEvo(source); } 
								else if (action.choice === 'terastallize') { this.actions.terastallize(source); } 
								else { continue; }
								this.queue.list.splice(actionIndex, 1);
								break;
							}
						}
					}
					this.actions.runMove('pursuit', source, source.getLocOf(pokemon));
				}
			},
		},
		secondary: null,
		target: "normal",
	},
	pyroball: {
		num: 780,
		accuracy: 90,
		basePower: 120,
		type: "Fire",
		category: "Physical",
		name: "Pyro Ball",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { kick: 1, weapon: 1, protect: 1, mirror: 1, defrost: 1, bullet: 1 },
		secondary: { chance: 10, status: 'brn', },
		target: "normal",
	},
	quickattack: {
		num: 98,
		accuracy: 100,
		basePower: 40,
		type: "Normal",
		category: "Physical",
		name: "Quick Attack",
		pp: 30,
		priority: 1,
		critRatio: 3,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	ragefist: {
		num: 889,
		accuracy: 100,
		basePower: 50,
		basePowerCallback(pokemon) { return Math.min(350, 50 + 25 * pokemon.timesAttacked); },
		type: "Ghost",
		category: "Physical",
		name: "Rage Fist",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1 },
		secondary: null,
		target: "normal",
	},
	ragingbull: {
		num: 873,
		accuracy: 100,
		basePower: 115,
		type: "Normal",
		category: "Physical",
		name: "Raging Bull",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { aura: 1, crash: 1, contact: 1, protect: 1, mirror: 1 },
		onTryHit(pokemon) {
			// will shatter screens through sub, before you hit
			pokemon.side.removeSideCondition('reflect');
			pokemon.side.removeSideCondition('lightscreen');
			pokemon.side.removeSideCondition('auroraveil');
		},
		onModifyType(move, pokemon) {
			switch (pokemon.species.name) {
			case 'Tauros-Paldea-Combat':
				move.type = 'Fighting';
				break;
			case 'Tauros-Paldea-Blaze':
				move.type = 'Fire';
				break;
			case 'Tauros-Paldea-Aqua':
				move.type = 'Water';
				break;
			}
		},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			pokemon.setStatus('aura', pokemon, {
				auraAbility: 'ragingbull',
				auraName: 'Raging Bull',
				auraDuration: 2,
			} as any);
		},
		secondary: null,
		target: "normal",
	},
	ragingfury: {
		num: 833,
		accuracy: 100,
		basePower: 120,
		type: "Fire",
		category: "Physical",
		name: "Raging Fury",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { crash: 1, protect: 1, mirror: 1 },
		self: {volatileStatus: 'lockedmove',},
		secondary: null,
		target: "randomNormal",
	},
	rapidspin: {
		num: 229,
		accuracy: 100,
		basePower: 50,
		type: "Normal",
		category: "Physical",
		name: "Rapid Spin",
		pp: 40,
		priority: 0,
		critRatio: 1,
		flags: { contact: 1, spin: 1, protect: 1, mirror: 1, metronome: 1 },
		onAfterHit(target, pokemon, move) {
			if (!move.hasSheerForce) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) { this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', `[of] ${pokemon}`); }
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'steelspikes'];
				for (const condition of sideConditions) { if (pokemon.hp && pokemon.side.removeSideCondition(condition)) { this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', `[of] ${pokemon}`); } }
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) { pokemon.removeVolatile('partiallytrapped'); }
			}
		},
		onAfterSubDamage(damage, target, pokemon, move) {
			if (!move.hasSheerForce) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) { this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', `[of] ${pokemon}`); }
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'steelspikes'];
				for (const condition of sideConditions) { if (pokemon.hp && pokemon.side.removeSideCondition(condition)) { this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', `[of] ${pokemon}`); } }
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) { pokemon.removeVolatile('partiallytrapped'); }
			}
		},
		secondary: { chance: 100, self: {boosts: {spe: 1,},}, },
		target: "normal",
	},
	razorleaf: {
		num: 75,
		accuracy: 95,
		basePower: 80,
		type: "Grass",
		category: "Physical",
		name: "Razor Leaf",
		pp: 15,
		priority: 0,
		critRatio: 7,
		flags: { slicing: 1, throw: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacentFoes",
		overrideOffensiveStat: 'spa',
	},
	razorshell: {
		num: 534,
		accuracy: 95,
		basePower: 85,
		type: "Water",
		category: "Physical",
		name: "Razor Shell",
		pp: 10,
		priority: 0,
		critRatio: 7,
		flags: { weapon: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		secondary: { chance: 50, boosts: {def: -1,}, },
		target: "normal",
	},
	retaliate: {
		num: 514,
		accuracy: 100,
		basePower: 70,
		type: "Normal",
		category: "Physical",
		name: "Retaliate",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onBasePower(basePower, pokemon) {
			let boosted = false;
			if (pokemon.side.faintedLastTurn) {
				this.debug('Boosted for a faint last turn');
				boosted = true;
			}
			if (pokemon.statsLoweredThisTurn) {
				this.debug('Boosted for stats lowered this turn');
				boosted = true;
			}
			if (boosted) { this.chainModify(2); }
			if (pokemon.status === 'fear') {
				this.debug('Boosted for fear status');
				this.chainModify(2);
			}
		},
		secondary: null,
		target: "normal",
	},
	reversal: {
		num: 179,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon) {
			const ratio = Math.max(Math.floor(pokemon.hp * 48 / pokemon.maxhp), 1);
			let bp;
			if (ratio < 2) 
				{ bp = 200; } 
			else if (ratio < 5) 
				{ bp = 150; } 
			else if (ratio < 10) 
				{ bp = 100; } 
			else if (ratio < 17) 
				{ bp = 80; } 
			else if (ratio < 33) 
				{ bp = 40; } 
			else 
				{ bp = 20; }
			this.debug(`BP: ${bp}`);
			return bp;
		},
		type: "Fighting",
		category: "Physical",
		name: "Reversal",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	rockblast: {
		num: 350,
		accuracy: 95,
		basePower: 25,
		type: "Rock",
		category: "Physical",
		name: "Rock Blast",
		pp: 10,
		priority: 0,
		critRatio: 6,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
	},
	rockslide: {
		num: 157,
		accuracy: 90,
		basePower: 75,
		type: "Rock",
		category: "Physical",
		name: "Rock Slide",
		pp: 15,
		priority: 0,
		critRatio: 6,
		flags: { crush: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, volatileStatus: 'flinch', },
		target: "allAdjacentFoes",
	},
	rocksmash: {
		num: 249,
		accuracy: 100,
		basePower: 40,
		type: "Fighting",
		category: "Physical",
		name: "Rock Smash",
		pp: 15,
		priority: 0,
		critRatio: 8,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 75, boosts: {def: -1,}, },
		target: "normal",
	},
	rockthrow: {
		num: 88,
		accuracy: 90,
		basePower: 60,
		type: "Rock",
		category: "Physical",
		name: "Rock Throw",
		pp: 15,
		priority: 0,
		critRatio: 6,
		flags: { throw: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		onBasePower(basePower, source, target, move) {
		   // Double power and become spread if all opposing Pokémon are airborne
		   const foeActive = source.side.foe.active.filter(p => !p.fainted);
			if (foeActive.length && foeActive.every(p => !p.isGrounded())) {
			   this.debug('Rock Throw airborne boost');
				(move as any).airborneSpread = true;
				return this.chainModify(2);
			}
		},
		onTry(source, target, move) { if ((move as any).airborneSpread) { move.target = 'allAdjacentFoes'; } },
	},
	rocktomb: {
		num: 317,
		accuracy: 85,
		basePower: 60,
		type: "Rock",
		category: "Physical",
		name: "Rock Tomb",
		pp: 15,
		priority: 0,
		critRatio: 6,
		flags: { binding: 1, crush: 1, protect: 1, mirror: 1, metronome: 1 },
		secondaries: [
		   { chance: 100, boosts: { spe: -1 }, },
		   { chance: 100, volatileStatus: 'partiallytrapped', },
	   ],
		target: "normal",
	},
	rockwrecker: {
		num: 439,
		accuracy: 90,
		basePower: 150,
		type: "Rock",
		category: "Physical",
		name: "Rock Wrecker",
		pp: 5,
		priority: 0,
		critRatio: 6,
		flags: { protect: 1, bullet: 1, mirror: 1, metronome: 1, cantusetwice: 1 },
		secondary: null,
		target: "normal",
	},
	rollout: {
		num: 205,
		accuracy: 90,
		basePower: 30,
		basePowerCallback(pokemon, target, move) {
			let bp = move.basePower;
			const rolloutData = pokemon.volatiles['rollout'];
			if (rolloutData?.hitCount) { bp *= 2 ** rolloutData.contactHitCount; }
			if (rolloutData && pokemon.status !== 'slp') {
				rolloutData.hitCount++;
				rolloutData.contactHitCount++;
				if (rolloutData.hitCount < 5) { rolloutData.duration = 2; }
			}
			if (pokemon.volatiles['defensecurl']) { bp *= 2; }
			this.debug(`BP: ${bp}`);
			return bp;
		},
		type: "Rock",
		category: "Physical",
		name: "Rollout",
		pp: 20,
		priority: 0,
		critRatio: 6,
		flags: { spin: 1, contact: 1, protect: 1, mirror: 1, metronome: 1, failinstruct: 1, noparentalbond: 1 },
		onModifyMove(move, pokemon, target) {
			if (pokemon.volatiles['rollout'] || pokemon.status === 'slp' || !target) return;
			pokemon.addVolatile('rollout');
			if (move.sourceEffect) pokemon.lastMoveTargetLoc = pokemon.getLocOf(target);
		},
		onAfterMove(source, target, move) {
			const rolloutData = source.volatiles["rollout"];
			if (
				rolloutData &&
				rolloutData.hitCount === 5 &&
				rolloutData.contactHitCount < 5
				// this conditions can only be met in gen7 and gen8dlc1
				// see `disguise` and `iceface` abilities in the resp mod folders
			) {
				source.addVolatile("rolloutstorage");
				source.volatiles["rolloutstorage"].contactHitCount =
					rolloutData.contactHitCount;
			}
		},
		condition: {
			duration: 1,
			onLockMove: 'rollout',
			onStart() {
				this.effectState.hitCount = 0;
				this.effectState.contactHitCount = 0;
			},
			onResidual(target) {
					// Pause residual effect if timebreak is active
					if (target.battle.field.getPseudoWeather('timebreak')) return;
				if (target.lastMove && target.lastMove.id === 'struggle') {
					// don't lock
					delete target.volatiles['rollout'];
				}
			},
		},
		secondary: null,
		target: "normal",
	},
	roundhousekick: {
		num: -1003,
		accuracy: true,
		basePower: 90,
		type: "Fighting",
		category: "Physical",
		name: "Roundhouse Kick",
		pp: 15,
		priority: -5,
		critRatio: 6,
		flags: { contact: 1, kick: 1, protect: 1, mirror: 1, metronome: 1, cantusetwice: 1 },
		onTryMove(source, target, move) {
			source.addVolatile('roundhousekick');
		},
		onAfterMove(source, target, move) {
			source.removeVolatile('roundhousekick');
		},
		secondary: null,
		target: "normal",
		contestType: "Cool",
	},
	roundhousekickcounter: {
		num: -1004,
		accuracy: true,
		basePower: 90,
		type: "Fighting",
		category: "Physical",
		name: "Roundhouse Kick",
		pp: 15,
		priority: 0,
		critRatio: 6,
		flags: { contact: 1, kick: 1 },
		secondary: null,
		target: "normal",
	},
	sacredfire: {
		num: 221,
		accuracy: 95,
		basePower: 100,
		type: "Fire",
		category: "Physical",
		name: "Sacred Fire",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, defrost: 1, metronome: 1 },
		secondary: { chance: 50, status: 'brn',  },
		target: "normal",
	},
	sacredsword: {
		num: 533,
		accuracy: 100,
		basePower: 90,
		type: "Fighting",
		category: "Physical",
		name: "Sacred Sword",
		pp: 15,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		ignoreEvasion: true,
		ignoreDefensive: true,
		onHit(target, source) { if (target.status === 'fear') target.cureStatus(); },
		secondary: null,
		target: "normal",
	},
	saltcure: {
		num: 864,
		accuracy: 100,
		basePower: 40,
		type: "Rock",
		category: "Physical",
		name: "Salt Cure",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1 },
		condition: {
			noCopy: true,
			onStart(pokemon) { this.add('-start', pokemon, 'Salt Cure');},
			onResidualOrder: 13,
			onResidual(pokemon) { this.damage(pokemon.baseMaxhp / (pokemon.hasType(['Water', 'Steel']) ? 4 : 8)); },
			onEnd(pokemon) { this.add('-end', pokemon, 'Salt Cure'); },
		},
		   secondary: { chance: 100, volatileStatus: 'saltcure', },
		   onEffectiveness(typeMod, target, type) {
			   if (type === 'Ghost') { return 1; }
		   },
		   onAfterHit(target, source, move) {
			   if (target.hasType('Ghost') && target.side.active.length > 1 && !target.forceSwitchFlag && !target.fainted) { target.forceSwitchFlag = true; }
		   },
		target: "normal",
	},
	sandtomb: {
		num: 328,
		accuracy: 90,
		basePower: 55,
		type: "Ground",
		category: "Physical",
		name: "Sand Tomb",
		pp: 15,
		priority: 0,
		critRatio: 1,
		flags: { binding: 1, protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
	},
	scaleshot: {
		num: 799,
		accuracy: 90,
		basePower: 25,
		type: "Dragon",
		category: "Physical",
		name: "Scale Shot",
		pp: 20,
		priority: 0,
		critRatio: 5,
		flags: { throw: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		selfBoost: {boosts: {def: -1,spe: 1,},},
		secondary: null,
		target: "normal",
	},
	scratch: {
		num: 10,
		accuracy: 100,
		basePower: 40,
		type: "Normal",
		category: "Physical",
		name: "Scratch",
		pp: 35,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, claw: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	seedbomb: {
		num: 402,
		accuracy: 100,
		basePower: 80,
		type: "Grass",
		category: "Physical",
		name: "Seed Bomb",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { bomb: 1, throw: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	seismictoss: {
		num: 69,
		accuracy: 100,
		basePower: 0,
		damage: 'level',
		type: "Fighting",
		category: "Physical",
		name: "Seismic Toss",
		pp: 20,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, launch: 1, throw: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	selfdestruct: {
		num: 120,
		accuracy: 100,
		basePower: 400,
		type: "Normal",
		category: "Physical",
		name: "Self-Destruct",
		pp: 5,
		priority: 0,
		critRatio: 15,
		flags: { explosive: 1, protect: 1, mirror: 1, metronome: 1, noparentalbond: 1 },
		selfdestruct: "always",
		secondary: null,
		target: "allAdjacent",
	},
	shadowbone: {
		num: 708,
		accuracy: 100,
		basePower: 85,
		type: "Ghost",
		category: "Physical",
		name: "Shadow Bone",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { shadow: 1, weapon: 1, protect: 1, mirror: 1, metronome: 1 },
		secondaries: [
			{ chance: 20, boosts: { def: -1 }, },
		    { chance: 30, volatileStatus: 'curse', },
	   ],
		target: "normal",
	},
	shadowclaw: {
		num: 421,
		accuracy: 100,
		basePower: 65,
		type: "Ghost",
		category: "Physical",
		name: "Shadow Claw",
		pp: 15,
		priority: 0,
		critRatio: 7,
		flags: { claw: 1, shadow: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, status: 'fear' },
		target: "normal",
	},
	shadowforce: {
		num: 467,
		accuracy: 100,
		basePower: 140,
		type: "Ghost",
		category: "Physical",
		name: "Shadow Force",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { shadow: 1, charge: 1, mirror: 1, metronome: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1 },
		breaksProtect: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) { return; }
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) { return;}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		condition: {
			duration: 2,
			onInvulnerability: false,
		},
		secondary: { chance: 10, volatileStatus: 'curse' },
		target: "normal",
	},
	shadowpunch: {
		num: 325,
		accuracy: true,
		basePower: 75,
		type: "Ghost",
		category: "Physical",
		name: "Shadow Punch",
		pp: 20,
		priority: 0,
		critRatio: 3,
		flags: { shadow: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		secondary: { chance: 20, volatileStatus: 'curse' },
		target: "normal",
	},
	shadowsneak: {
		num: 425,
		accuracy: 100,
		basePower: 40,
		type: "Ghost",
		category: "Physical",
		name: "Shadow Sneak",
		pp: 30,
		priority: 1,
		critRatio: 2,
		flags: { shadow: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 20, status: 'fear' },
		target: "normal",
	},
	skittersmack: {
		num: 806,
		accuracy: 100,
		basePower: 70,
		type: "Bug",
		category: "Physical",
		name: "Skitter Smack",
		pp: 15,
		priority: 0,
		critRatio: 3,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, boosts: {spa: -1,}, },
		target: "normal",
	},
	skyattack: {
		num: 143,
		accuracy: 90,
		basePower: 140,
		type: "Flying",
		category: "Physical",
		name: "Sky Attack",
		pp: 5,
		priority: 0,
		critRatio: 7,
		flags: { charge: 1, protect: 1, mirror: 1, distance: 1, metronome: 1, nosleeptalk: 1, failinstruct: 1 },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) { return; }
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) { return; }
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		secondary: { chance: 30, volatileStatus: 'flinch', },
		target: "any",
	},
	skydrop: {
		num: 507,
		accuracy: 100,
		basePower: 60,
		type: "Flying",
		category: "Physical",
		name: "Sky Drop",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, airborne: 1, charge: 1, protect: 1, mirror: 1, gravity: 1, distance: 1, metronome: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1,},
		onModifyMove(move, source) {
			if (!source.volatiles['skydrop']) {
				move.accuracy = true;
				delete move.flags['contact'];
			}
		},
		onMoveFail(target, source) {
			if (source.volatiles['twoturnmove'] && source.volatiles['twoturnmove'].duration === 1) {
				source.removeVolatile('skydrop');
				source.removeVolatile('twoturnmove');
				if (target === this.effectState.target) { this.add('-end', target, 'Sky Drop', '[interrupt]'); }
			}
		},
		onTry(source, target) { return !target.fainted;},
		onTryHit(target, source, move) {
			if (source.removeVolatile(move.id)) {
				if (target !== source.volatiles['twoturnmove'].source) return false;
				if (target.hasType('Flying')) {
					this.add('-immune', target);
					return null;
				}
			} else {
				if (target.volatiles['substitute'] || target.isAlly(source)) { return false; }
				if (target.getWeight() >= 2000) {
					this.add('-fail', target, 'move: Sky Drop', '[heavy]');
					return null;
				}
				this.add('-prepare', source, move.name, target);
				source.addVolatile('twoturnmove', target);
				return null;
			}
		},
		onHit(target, source) { if (target.hp) this.add('-end', target, 'Sky Drop'); },
		condition: {
			duration: 2,
			onAnyDragOut(pokemon) { if (pokemon === this.effectState.target || pokemon === this.effectState.source) return false; },
			onFoeTrapPokemonPriority: -15,
			onFoeTrapPokemon(defender) {
			if (defender !== this.effectState.source) return;
			defender.trapped = true;
		},
		onFoeBeforeMovePriority: 12,
		onFoeBeforeMove(attacker, defender, move) {
			if (attacker === this.effectState.source) {
				attacker.activeMoveActions--;
				this.debug('Sky drop nullifying.');
				return null;
			}
		},
		onRedirectTargetPriority: 99,
		onRedirectTarget(target, source, source2) {
			if (source !== this.effectState.target) return;
			if (this.effectState.source.fainted) return;
			return this.effectState.source;
		},
		onAnyInvulnerability(target, source, move) {
			if (target !== this.effectState.target && target !== this.effectState.source) { return; }
			if (source === this.effectState.target && target === this.effectState.source) { return; }
			if (['gust', 'twister', 'skyuppercut', 'thunder', 'hurricane', 'smackdown', 'thousandarrows'].includes(move.id)) { return; }
			return false;
		},
		onAnyBasePower(basePower, target, source, move) {
			if (target !== this.effectState.target && target !== this.effectState.source) { return; }
			if (source === this.effectState.target && target === this.effectState.source) { return; }
			if (move.id === 'gust' || move.id === 'twister') {
				this.debug('BP doubled on midair target');
				return this.chainModify(2);
			}
		},
		onFaint(target) { if (target.volatiles['skydrop'] && target.volatiles['twoturnmove'].source) { this.add('-end', target.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]'); } },
		},
		secondary: null,
		target: "any",
	},
	slam: {
		num: 21,
		accuracy: 75,
		basePower: 80,
		type: "Normal",
		category: "Physical",
		name: "Slam",
		pp: 20,
		priority: 0,
		critRatio: 3,
		flags: { contact: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	slash: {
		num: 163,
		accuracy: 100,
		basePower: 77,
		type: "Normal",
		category: "Physical",
		name: "Slash",
		pp: 20,
		priority: 0,
		critRatio: 7,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		secondary: null,
		target: "normal",
	},
	smackdown: {
		num: 479,
		accuracy: 100,
		basePower: 60,
		type: "Rock",
		category: "Physical",
		name: "Smack Down",
		pp: 15,
		priority: 0,
		critRatio: 5,
		flags: { protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		volatileStatus: 'smackdown',
		condition: {
			noCopy: true,
			onStart(pokemon) {
				let applies = false;
				if (pokemon.hasType('Flying') || pokemon.hasAbility('levitate')) applies = true;
				if (pokemon.hasItem('ironball') || pokemon.volatiles['ingrain'] ||
					this.field.getPseudoWeather('gravity')) applies = false;
				if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
					applies = true;
					this.queue.cancelMove(pokemon);
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
				if (!applies) return false;
				this.add('-start', pokemon, 'Smack Down');
			},
			onRestart(pokemon) {
				if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
					this.queue.cancelMove(pokemon);
					pokemon.removeVolatile('twoturnmove');
					this.add('-start', pokemon, 'Smack Down');
				}
			}, // groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
		},
		secondary: null,
		target: "normal",
	},
	smartstrike: {
		num: 684,
		accuracy: true,
		basePower: 70,
		type: "Steel",
		category: "Physical",
		name: "Smart Strike",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	solarblade: {
		num: 669,
		accuracy: 100,
		basePower: 125,
		type: "Grass",
		category: "Physical",
		name: "Solar Blade",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { contact: 1, light: 1, slicing: 1, solar: 1, charge: 1, protect: 1, mirror: 1, metronome: 1, nosleeptalk: 1, failinstruct: 1 },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) { return; }
			this.add('-prepare', attacker, move.name);
			if (['sunnyday', 'desolateland'].includes(attacker.effectiveWeather())) {
				this.attrLastMove('[still]');
				this.addMove('-anim', attacker, move.name, defender);
				return;
			}
			if (!this.runEvent('ChargeMove', attacker, defender, move)) { return; }
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		onBasePower(basePower, pokemon, target) {
			const weakWeathers = ['raindance', 'primordialsea', 'sandstorm', 'hail', 'snowscape'];
			if (weakWeathers.includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
		secondary: null,
		target: "normal",
	},
	spark: {
		num: 209,
		accuracy: 100,
		basePower: 65,
		type: "Electric",
		category: "Physical",
		name: "Spark",
		pp: 20,
		priority: 0,
		critRatio: 4,
		flags: { crash: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, status: 'par', },
		target: "normal",
	},
	spinout: {
		num: 859,
		accuracy: 100,
		basePower: 100,
		type: "Steel",
		category: "Physical",
		name: "Spin Out",
		pp: 5,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, spin: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {boosts: {spe: -1,},},
		secondary: null,
		target: "normal",
	},
	spiritbreak: {
		num: 789,
		accuracy: 100,
		basePower: 75,
		type: "Fairy",
		category: "Physical",
		name: "Spirit Break",
		pp: 15,
		priority: 0,
		critRatio: 3,
		flags: { contact: 1, aura: 1, protect: 1, mirror: 1 },
		secondary: { chance: 100, boosts: {spa: -1,}, },
		target: "normal",
	},
	spiritshackle: {
		num: 662,
		accuracy: 100,
		basePower: 95,
		type: "Ghost",
		category: "Physical",
		name: "Spirit Shackle",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { pierce: 1, shadow: 1, protect: 1, mirror: 1, metronome: 1 },
		pierce3: true,
		   secondaries: [
			   { chance: 100, onHit(target, source, move) { if (source.isActive) target.addVolatile('trapped', source, move, 'trapper'); }, },
			   { chance: 10, volatileStatus: 'curse', },
		   ],
		target: "normal",
	},
	steamroller: {
		num: 537,
		accuracy: 100,
		basePower: 85,
		type: "Bug",
		category: "Physical",
		name: "Steamroller",
		pp: 15,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, crush: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, volatileStatus: 'flinch', },
		target: "normal",
	},
	steelroller: {
		num: 798,
		accuracy: 100,
		basePower: 85,
		type: "Steel",
		category: "Physical",
		name: "Steel Roller",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, crush: 1, spin: 1, protect: 1, mirror: 1, metronome: 1 },
		onHit() { this.field.clearTerrain(); },
		onAfterSubDamage() { this.field.clearTerrain(); },
		secondary: null,
		target: "normal",
	},
	steelwing: {
		num: 211,
		accuracy: 90,
		basePower: 70,
		type: "Steel",
		category: "Physical",
		name: "Steel Wing",
		pp: 25,
		priority: 0,
		critRatio: 4,
		flags: { wing: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 20, self: {boosts: {def: 1,},}, },
		target: "normal",
	},
	stomp: {
		num: 23,
		accuracy: 100,
		basePower: 65,
		type: "Normal",
		category: "Physical",
		name: "Stomp",
		pp: 20,
		priority: 0,
		critRatio: 7,
		flags: { contact: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: { chance: 30, volatileStatus: 'flinch', },
		target: "normal",
	},
	stompingtantrum: {
		num: 707,
		accuracy: 100,
		basePower: 75,
		basePowerCallback(pokemon, target, move) {
			if (pokemon.moveLastTurnResult === false) {
				this.debug('doubling Stomping Tantrum BP due to previous move failure');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		type: "Ground",
		category: "Physical",
		name: "Stomping Tantrum",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, kick: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	stoneaxe: {
		num: 830,
		accuracy: 90,
		basePower: 65,
		type: "Rock",
		category: "Physical",
		name: "Stone Axe",
		pp: 15,
		priority: 0,
		critRatio: 6,
		flags: { slicing: 1, weapon: 1, protect: 1, mirror: 1, metronome: 1 },
		onAfterHit(target, source, move) { if (!move.hasSheerForce && source.hp) { for (const side of source.side.foeSidesWithConditions()) { side.addSideCondition('stealthrock'); } } },
		onAfterSubDamage(damage, target, source, move) { if (!move.hasSheerForce && source.hp) { for (const side of source.side.foeSidesWithConditions()) { side.addSideCondition('stealthrock'); } } },
		secondary: {}, // Sheer Force-boosted
		target: "normal",
	},
	stoneedge: {
		num: 444,
		accuracy: 80,
		basePower: 100,
		type: "Rock",
		category: "Physical",
		name: "Stone Edge",
		pp: 5,
		priority: 0,
		critRatio: 8,
		flags: { launch: 1, pierce: 1, protect: 1, mirror: 1, metronome: 1 },
		pierce2: true,
		secondary: null,
		target: "normal",
	},
	strength: {
		num: 70,
		accuracy: 100,
		basePower: 80,
		type: "Normal",
		category: "Physical",
		name: "Strength",
		pp: 15,
		priority: 0,
		critRatio: 2,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onTryHit(pokemon) {
			// will shatter screens through sub, before you hit
			let brokeScreen = false;
			if (pokemon.side.sideConditions['reflect']) {
				pokemon.side.removeSideCondition('reflect');
				brokeScreen = true;
			}
			if (pokemon.side.sideConditions['lightscreen']) {
				pokemon.side.removeSideCondition('lightscreen');
				brokeScreen = true;
			}
			if (pokemon.side.sideConditions['auroraveil']) {
				pokemon.side.removeSideCondition('auroraveil');
				brokeScreen = true;
			}
			if (brokeScreen) {
				this.boost({atk: 1}, pokemon, pokemon, null, true);
			}
		},
		
		secondary: null,
		target: "normal",
	},
	struggle: {
		num: 165,
		accuracy: true,
		basePower: 15,
		type: "Banal",
		category: "Physical",
		name: "Struggle",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		critRatio: 0,
		flags: { contact: 1, protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1, nosketch: 1,},
		onModifyMove(move, pokemon, target) {
			this.add('-activate', pokemon, 'move: Struggle');
		},
		struggleRecoil: true,
		secondary: null,
		target: "randomNormal",
	},
	suckerpunch: {
		num: 389,
		accuracy: 100,
		basePower: 70,
		type: "Dark",
		category: "Physical",
		name: "Sucker Punch",
		pp: 5,
		priority: 1,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onTry(source, target) {
			const action = this.queue.willMove(target);
			const move = action?.choice === 'move' ? action.move : null;
			if (!move || (move.category === 'Status' && move.id !== 'mefirst') || target.volatiles['mustrecharge']) { return false; }
		},
		secondary: null,
		target: "normal",
	},
	sunsteelstrike: {
		num: 713,
		accuracy: 100,
		basePower: 100,
		type: "Steel",
		category: "Physical",
		name: "Sunsteel Strike",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, solar: 1, protect: 1, mirror: 1 },
		ignoreAbility: true,
		secondary: null,
		target: "normal",
	},
	supercellslam: {
		num: 916,
		accuracy: 95,
		basePower: 110,
		type: "Electric",
		category: "Physical",
		name: "Supercell Slam",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, airborne: 1, crash: 1, kick: 1, protect: 1, mirror: 1, metronome: 1 },
		hasCrashDamage: true,
		   onMoveFail(target, source, move) {
			   this.damage(Math.floor(source.baseMaxhp / 6), source, source, this.dex.conditions.get('Supercell Slam'));
			   if (source.hasType('Electric')) {
				   source.setType(source.getTypes(true).map(type => type === "Electric" ? "???" : type));
				   this.add('-start', source, 'typechange', source.getTypes().join('/'), '[from] move: Supercell Slam');
			   }
		   },
		secondary: null,
		target: "normal",
	},
	superfang: {
		num: 162,
		accuracy: 90,
		basePower: 0,
		damageCallback(pokemon, target) { return this.clampIntRange(target.getUndynamaxedHP() / 2, 1); },
		type: "Normal",
		category: "Physical",
		name: "Super Fang",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	superpower: {
		num: 276,
		accuracy: 100,
		basePower: 120,
		type: "Fighting",
		category: "Physical",
		name: "Superpower",
		pp: 5,
		priority: 0,
		critRatio: 6,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {boosts: {atk: -1, def: -1,},},
		secondary: null,
		target: "normal",
	},
	surgingstrikes: {
		num: 818,
		accuracy: 100,
		basePower: 25,
		type: "Water",
		category: "Physical",
		name: "Surging Strikes",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1 },
		willCrit: true,
		multihit: 3,
		secondary: null,
		target: "normal",
	},
	tackle: {
		num: 33,
		accuracy: 100,
		basePower: 40,
		type: "Normal",
		category: "Physical",
		name: "Tackle",
		pp: 35,
		priority: 0,
		critRatio: 1,
		flags: { crash: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	tailslap: {
		num: 541,
		accuracy: 90,
		basePower: 25,
		type: "Normal",
		category: "Physical",
		name: "Tail Slap",
		pp: 10,
		priority: 0,
		critRatio: 1,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
	},
	takedown: {
		num: 36,
		accuracy: 85,
		basePower: 90,
		type: "Normal",
		category: "Physical",
		name: "Take Down",
		pp: 20,
		priority: 0,
		critRatio: 3,
		flags: { crash: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		recoil: [1, 4],
		secondary: null,
		target: "normal",
	},
	temperflare: {
		num: 915,
		accuracy: 100,
		basePower: 75,
		basePowerCallback(pokemon, target, move) {
			if (pokemon.moveLastTurnResult === false) {
				this.debug('doubling Temper Flare BP due to previous move failure');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		type: "Fire",
		category: "Physical",
		name: "Temper Flare",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { crash: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	thief: {
		num: 168,
		accuracy: 100,
		basePower: 60,
		type: "Dark",
		category: "Physical",
		name: "Thief",
		pp: 25,
		priority: 0,
		critRatio: 2,
		flags: { contact: 1, protect: 1, mirror: 1, failmefirst: 1, noassist: 1, failcopycat: 1 },
		onAfterHit(target, source, move) {
			if (source.item || source.volatiles['gem']) { return; }
			const yourItem = target.takeItem(source);
			if (!yourItem) { return; }
			if (!this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem) ||
				!source.setItem(yourItem)) {
				target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
				return;
			}
			this.add('-enditem', target, yourItem, '[silent]', '[from] move: Thief', `[of] ${source}`);
			this.add('-item', source, yourItem, '[from] move: Thief', `[of] ${target}`);
		},
		secondary: null,
		target: "normal",
	},
	thrash: {
		num: 37,
		accuracy: 100,
		basePower: 125,
		type: "Normal",
		category: "Physical",
		name: "Thrash",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { kick: 1, punch: 1, contact: 1, protect: 1, mirror: 1, metronome: 1, failinstruct: 1 },
		self: {volatileStatus: 'lockedmove',},
		secondary: null,
		target: "randomNormal",
	},
	throatchop: {
		num: 675,
		accuracy: 100,
		basePower: 80,
		type: "Dark",
		category: "Physical",
		name: "Throat Chop",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		condition: {
			duration: 2,
			onStart(target) { this.add('-start', target, 'Throat Chop', '[silent]'); },
			onDisableMove(pokemon) { for (const moveSlot of pokemon.moveSlots) { if (this.dex.moves.get(moveSlot.id).flags['sound']) { pokemon.disableMove(moveSlot.id); } } },
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
				if (pokemon.battle.field.getPseudoWeather('timebreak')) return;
				if (target.battle.field.getPseudoWeather('timebreak')) return;
				if (!move.isZ && !move.isMax && move.flags['sound']) {
					this.add('cant', pokemon, 'move: Throat Chop');
					return false;
				}
			},
			onModifyMove(move, pokemon, target) {
				if (!move.isZ && !move.isMax && move.flags['sound']) {
					this.add('cant', pokemon, 'move: Throat Chop');
					return false;
				}
			},
			onResidualOrder: 22,
			onEnd(target) {
				if (target.battle.field.getPseudoWeather('timebreak')) return;
				this.add('-end', target, 'Throat Chop', '[silent]');
			},
		},
		secondary: {chance: 100, onHit(target) { target.addVolatile('throatchop'); }, },
		target: "normal",
	},
	thunderfang: {
		num: 422,
		accuracy: 95,
		basePower: 65,
		type: "Electric",
		category: "Physical",
		name: "Thunder Fang",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { bite: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondaries: [
			{ chance: 20, status: 'par', }, 
			{ chance: 10, volatileStatus: 'flinch', },
		],
		target: "normal",
	},
	thunderouskick: {
		num: 823,
		accuracy: 100,
		basePower: 110,
		type: "Fighting",
		type2: "Electric",
		category: "Physical",
		name: "Thunderous Kick",
		pp: 10,
		priority: 0,
		critRatio: 6,
		flags: { contact: 1, kick: 1, protect: 1, mirror: 1 },
		secondary: { chance: 100, boosts: {def: -1,}, },
		target: "normal",
	},
	thunderpunch: {
		num: 9,
		accuracy: 100,
		basePower: 75,
		type: "Electric",
		category: "Physical",
		name: "Thunder Punch",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { punch: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 10, status: 'par', },
		target: "normal",
	},
	trailblaze: {
		num: 885,
		accuracy: 100,
		basePower: 50,
		type: "Grass",
		category: "Physical",
		name: "Trailblaze",
		pp: 20,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1 },
		secondary: { chance: 100, self: {boosts: {spe: 1,},}, },
		target: "normal",
	},
	triplearrows: {
		num: 843,
		accuracy: 100,
		basePower: 95,
		type: "Fighting",
		category: "Physical",
		name: "Triple Arrows",
		pp: 10,
		priority: 0,
		critRatio: 7,
		flags: { protect: 1, kick: 1, pierce: 1,  mirror: 1, metronome: 1 },
		pierce1: true,
		secondary: { chance: 50, boosts: {def: -1,}, },
		target: "normal",
	},
	tripleaxel: {
		num: 813,
		accuracy: 90,
		basePower: 20,
		basePowerCallback(pokemon, target, move) { return 20 * move.hit; },
		type: "Ice",
		category: "Physical",
		name: "Triple Axel",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, kick: 1, spin: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: 3,
		multiaccuracy: true,
		secondary: null,
		target: "normal",
	},
	tripledive: {
		num: 865,
		accuracy: 95,
		basePower: 45,
		type: "Water",
		category: "Physical",
		name: "Triple Dive",
		pp: 10,
		priority: 0,
		critRatio: 2,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: 3,
		secondary: null,
		target: "normal",
	},
	triplekick: {
		num: 167,
		accuracy: 90,
		basePower: 33,
		basePowerCallback(pokemon, target, move) { return 40 * move.hit; },
		type: "Fighting",
		category: "Physical",
		name: "Triple Kick",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { contact: 1, kick: 1, spin: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: 3,
		smartTarget: true,
		multiaccuracy: true,
		secondary: null,
		target: "normal",
	},
	tropkick: {
		num: 688,
		accuracy: 100,
		basePower: 85,
		type: "Grass",
		category: "Physical",
		name: "Trop Kick",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, kick: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, boosts: {atk: -1,}, },
		target: "normal",
	},
	twineedle: {
		num: 41,
		accuracy: 100,
		basePower: 35,
		type: "Bug",
		category: "Physical",
		name: "Twineedle",
		pp: 20,
		priority: 0,
		critRatio: 6,
		flags: { pierce: 1,protect: 1, mirror: 1, metronome: 1 },
		pierce1: true,
		multihit: 2,
		secondary: { chance: 20, status: 'psn', },
		target: "normal",
	},
	uturn: {
		num: 369,
		accuracy: 100,
		basePower: 60,
		type: "Bug",
		category: "Physical",
		name: "U-turn",
		pp: 20,
		priority: 0,
		critRatio: 3,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		selfSwitch: true,
		secondary: null,
		target: "normal",
	},
	upperhand: {
		num: 918,
		accuracy: 100,
		basePower: 65,
		type: "Fighting",
		category: "Physical",
		name: "Upper Hand",
		pp: 25,
		priority: 3,
		critRatio: 6,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onTry(source, target) {
			const action = this.queue.willMove(target);
			const move = action?.choice === 'move' ? action.move : null;
			if (!move || move.priority <= 0.1 || move.category === 'Status') { return false; }
		},
		secondary: { chance: 100, volatileStatus: 'flinch', },
		target: "normal",
	},
	vcreate: {
		num: 557,
		accuracy: 95,
		basePower: 180,
		type: "Fire",
		category: "Physical",
		name: "V-create",
		pp: 5,
		priority: 0,
		critRatio: 5,
		flags: { crash: 1, contact: 1, protect: 1, mirror: 1, cantusetwice: 1, },
		self: {boosts: {spe: -1, def: -1, spd: -1,},},
		onAfterMoveSecondarySelf(source, target, move) {
			if (target.volatiles['protect'] || target.volatiles['banefulbunker'] || target.volatiles['kingsshield'] || 
			    target.volatiles['spikyshield'] || target.volatiles['burningbulwark'] || target.volatiles['silktrap'] ||
			    target.volatiles['obstruct']) { this.boost({spe: -1, def: -1, spd: -1}, source, source, move); }
		},
		secondary: null,
		target: "normal",
	},
	vinewhip: {
		num: 22,
		accuracy: 100,
		basePower: 55,
		type: "Grass",
		category: "Physical",
		name: "Vine Whip",
		pp: 25,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
        onBasePower(basePower, pokemon) { if (pokemon.hasAbility && pokemon.hasAbility('overgrow')) { return this.chainModify(2); } },
		target: "normal",
	},
	vitalthrow: {
		num: 233,
		accuracy: true,
		basePower: 0,
		basePowerCallback(pokemon, target, move) {
		const targetWeight = target.getWeight();
				let bp;
				if (targetWeight >= 200) 
					{ bp = 35; } 
				else if (targetWeight >= 100) 
					{ bp = 50; } 
				else if (targetWeight >= 50) 
					{ bp = 75; } 
				else if (targetWeight >= 25) 
					{ bp = 95; } 
				else if (targetWeight >= 10) 
					{ bp = 120; } 
				else if (targetWeight >= 0.1) 
					{ bp = 150; } 
				else { bp = 0; }
				this.debug(`BP: ${bp}`);
				return bp;
			},
		type: "Fighting",
		category: "Physical",
		name: "Vital Throw",
		pp: 10,
		priority: -1,
		critRatio: 4,
		flags: { contact: 1, launch: 1, throw: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	visegrip: {
		num: 11,
		accuracy: 100,
		basePower: 55,
		type: "Normal",
		category: "Physical",
		name: "Vise Grip",
		pp: 30,
		priority: 0,
		critRatio: 4,
		flags: { crush: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	volttackle: {
		num: 344,
		accuracy: 100,
		basePower: 120,
		type: "Electric",
		category: "Physical",
		name: "Volt Tackle",
		pp: 15,
		priority: 0,
		critRatio: 5,
		flags: { crash: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		recoil: [25, 100],
		secondary: { chance: 20, status: 'par', },
		target: "normal",
	},
	waterfall: {
		num: 127,
		accuracy: 100,
		basePower: 80,
		type: "Water",
		category: "Physical",
		name: "Waterfall",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { crash: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, volatileStatus: 'flinch', },
		target: "normal",
	},
	wavecrash: {
		num: 834,
		accuracy: 100,
		basePower: 120,
		type: "Water",
		category: "Physical",
		name: "Wave Crash",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { crash: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		recoil: [33, 100],
		secondary: null,
		target: "normal",
	},
	wickedblow: {
		num: 817,
		accuracy: 100,
		basePower: 75,
		type: "Dark",
		category: "Physical",
		name: "Wicked Blow",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1 },
		willCrit: true,
		secondary: null,
		target: "normal",
	},
	wickedtorque: {
		num: 897,
		accuracy: 100,
		basePower: 80,
		type: "Dark",
		category: "Physical",
		name: "Wicked Torque",
		pp: 10,
		priority: 0,
		critRatio: 6,
		flags: { crash: 1, protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1, nosketch: 1,},
		secondary: { chance: 30, status: 'fear' },
		target: "normal",
	},
	wildcharge: {
		num: 528,
		accuracy: 100,
		basePower: 105,
		type: "Electric",
		category: "Physical",
		name: "Wild Charge",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, crash: 1, protect: 1, mirror: 1, metronome: 1 },
		recoil: [1, 4],
		secondary: null,
		target: "normal",
	},
	wingattack: {
		num: 17,
		accuracy: 100,
		basePower: 60,
		type: "Flying",
		category: "Physical",
		name: "Wing Attack",
		pp: 35,
		priority: 0,
		critRatio: 0,
		flags: { wing: 1, contact: 1, protect: 1, mirror: 1, distance: 1, metronome: 1 },
		secondary: null,
		target: "any",
	},
	woodhammer: {
		num: 452,
		accuracy: 100,
		basePower: 120,
		type: "Grass",
		category: "Physical",
		name: "Wood Hammer",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, crush: 1, weapon: 1, protect: 1, mirror: 1, metronome: 1 },
		recoil: [33, 100],
		secondary: null,
		target: "normal",
	},
	wrap: {
		num: 35,
		accuracy: 90,
		basePower: 45,
		type: "Normal",
		category: "Physical",
		name: "Wrap",
		pp: 20,
		priority: 0,
		critRatio: 0,
		flags: { binding: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
	},
	xscissor: {
		num: 404,
		accuracy: 100,
		basePower: 80,
		type: "Bug",
		category: "Physical",
		name: "X-Scissor",
		pp: 15,
		priority: 0,
		critRatio: 8,
		flags: { slicing: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	zenheadbutt: {
		num: 428,
		accuracy: 90,
		basePower: 80,
		type: "Psychic",
		category: "Physical",
		name: "Zen Headbutt",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { crash: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 20, volatileStatus: 'flinch', },
		target: "normal",
	},
	zingzap: {
		num: 716,
		accuracy: 100,
		basePower: 95,
		type: "Electric",
		category: "Physical",
		name: "Zing Zap",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 70, volatileStatus: 'flinch', },
		target: "normal",
	},

	//#region SPECIAL MOVES
	// ==================================================================
	absorb: {
		num: 71,
		accuracy: 100,
		basePower: 35,
		type: "Grass",
		category: "Special",
		name: "Absorb",
		pp: 25,
		priority: 0,
		critRatio: 1,
		flags: { drain: 1, heal: 1, protect: 1, mirror: 1, metronome: 1 },
		drain: [1, 2],
		secondary: null,
		target: "normal",
	},
	acid: {
		num: 51,
		accuracy: 100,
		basePower: 40,
		type: "Poison",
		category: "Special",
		name: "Acid",
		pp: 30,
		priority: 0,
		critRatio: 3,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 20, boosts: {spd: -1,}, },
		target: "allAdjacentFoes",
	},
	acidspray: {
		num: 491,
		accuracy: 100,
		basePower: 40,
		type: "Poison",
		category: "Special",
		name: "Acid Spray",
		pp: 20,
		priority: 0,
		critRatio: 3,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: { chance: 100, boosts: {spd: -2,},  },
		target: "normal",
	},
	aeroblast: {
		num: 177,
		accuracy: 95,
		basePower: 110,
		type: "Flying",
		category: "Special",
		name: "Aeroblast",
		pp: 5,
		priority: 0,
		critRatio: 8,
		flags: { wind: 1, protect: 1, mirror: 1, distance: 1, metronome: 1 },
		secondary: null,
		target: "any",
	},
	aircutter: {
		num: 314,
		accuracy: 95,
		basePower: 75,
		type: "Flying",
		category: "Special",
		name: "Air Cutter",
		pp: 25,
		priority: 0,
		critRatio: 7,
		flags: { slicing: 1, wind: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacentFoes",
	},
	airslash: {
		num: 403,
		accuracy: 95,
		basePower: 85,
		type: "Flying",
		category: "Special",
		name: "Air Slash",
		pp: 15,
		priority: 0,
		critRatio: 5,
		flags: { slicing: 1, wind: 1, protect: 1, mirror: 1, distance: 1, metronome: 1 },
		secondary: { chance: 20, volatileStatus: 'flinch', },
		target: "any",
	},
	alluringvoice: {
		num: 914,
		accuracy: 100,
		basePower: 80,
		type: "Fairy",
		category: "Special",
		name: "Alluring Voice",
		pp: 10,
		priority: 0,
		critRatio: 1,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		secondary: { chance: 100, volatileStatus: 'allured', },
		target: "normal",
	},
	ancientpower: {
		num: 246,
		accuracy: 100,
		basePower: 70,
		type: "Rock",
		category: "Special",
		name: "Ancient Power",
		pp: 5,
		priority: 0,
		critRatio: 6,
		flags: { magic: 1, protect: 1, mirror: 1, metronome: 1 },
        overrideDefensiveStat: 'def',
		secondary: { chance: 10, boosts: {atk: -1, def: -1, spa: -1, spd: -1, spe: -1,}, },
		target: "allAdjacentFoes",
	},
	appleacid: {
		num: 787,
		accuracy: 100,
		basePower: 80,
		type: "Grass",
		category: "Special",
		name: "Apple Acid",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1 },
		secondary: { chance: 100, boosts: {spd: -1,}, },
		target: "normal",
	},
	armorcannon: {
		num: 890,
		accuracy: 100,
		basePower: 120,
		type: "Fire",
		category: "Special",
		name: "Armor Cannon",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { explosive: 1, protect: 1, mirror: 1 },
		self: {boosts: {def: -1, spd: -1,},},
		secondary: null,
		target: "normal",
	},
	astralbarrage: {
		num: 825,
		accuracy: 90,
		basePower: 120,
		type: "Ghost",
		category: "Special",
		name: "Astral Barrage",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { aura: 1, protect: 1, mirror: 1 },
		secondary: { chance: 10, status: 'fear' },
		target: "allAdjacentFoes",
	},
	aurasphere: {
		num: 396,
		accuracy: true,
		basePower: 85,
		type: "Fighting",
		category: "Special",
		name: "Aura Sphere",
		pp: 20,
		priority: 0,
		critRatio: 5,
		flags: { aura: 1, bullet: 1, pulse: 1,protect: 1, mirror: 1, distance: 1, metronome: 1, },
		secondary: null,
        onBasePower(basePower, pokemon, target, move) { if (target.status === 'aura' || target.volatiles['aura']) { return this.chainModify(1.5); } },
		target: "any",
	},
	aurawheel: {
		num: 783,
		accuracy: 100,
		basePower: 110,
		type: "Electric",
		category: "Special",
		name: "Aura Wheel",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { aura: 1, spin: 1, protect: 1, mirror: 1 },
		onTry(source) {
			if (source.species.baseSpecies === 'Morpeko') { return; }
			this.attrLastMove('[still]');
			this.add('-fail', source, 'move: Aura Wheel');
			this.hint("Only a Pokemon whose form is Morpeko or Morpeko-Hangry can use this move.");
			return null;
		},
		onBasePower(basePower, pokemon, target, move) { if (target.status === 'aura' || target.volatiles['aura']) { return this.chainModify(1.5); } },
		onModifyType(move, pokemon) {
			if (pokemon.species.name === 'Morpeko-Hangry') {
				move.type = 'Dark';
                move.category = 'Physical';
			} else {
				move.type = 'Electric';
                move.category = 'Special';
			}
		},
		onModifyMove(move, pokemon) {
			if (pokemon.species.name === 'Morpeko-Hangry') { move.secondary = { chance: 10, status: 'fear', self: {boosts: {spe: 1,},}, }; } 
			else { move.secondary = { chance: 10, status: 'par', self: {boosts: {spe: 1,},}, }; }
		},
		target: "normal",
	},
	aurorabeam: {
		num: 62,
		accuracy: 100,
		basePower: 65,
		type: "Ice",
		category: "Special",
		name: "Aurora Beam",
		pp: 20,
		priority: 0,
		critRatio: 3,
		flags: { beam: 1, light: 1, protect: 1, mirror: 1, metronome: 1 },
		secondaries: [
			{ chance: 30, boosts: { atk: -1 }, },
			{ chance: 30, boosts: { spa: -1 }, },
		],
        onBasePower(basePower, pokemon, target, move) { if (this.field.isWeather(['hail', 'snow'])) { return this.chainModify(1.5); } },
		target: "normal",
	},
	belch: {
		num: 562,
		accuracy: 90,
		basePower: 120,
		type: "Poison",
		category: "Special",
		name: "Belch",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { breath: 1, protect: 1, bypasssub: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		onDisableMove(pokemon) {
			const item = pokemon.getItem();
			if (!pokemon.ateBerry && (!item || !item.isBerry)) pokemon.disableMove('belch');
		},
		onTry(source, target, move) {
			const item = source.getItem();
			if (item && item.isBerry) {
				if (source.useItem()) { return; }
				if (!source.ateBerry) {
					this.add('cant', source, 'item: ' + item.name, '[from] move: Belch');
					return false;
				}
			}
			return;
		},
		onHit(target, source, move) {
			const item = source.getItem();
			if (item && item.belch) {
				const belch = item.belch;
				if (belch.status) {
					const chance = belch.chance ?? 100;
					if (this.randomChance(chance, 100)) { target.trySetStatus(belch.status, source, move); }
				}
				if (belch.volatileStatus) {
					const chance = belch.chance ?? 100;
					if (this.randomChance(chance, 100)) { target.addVolatile(belch.volatileStatus, source, move); }
				}
				if (typeof belch.effect === 'function') { belch.effect.call(this, target, source, move); }
			}
		},
		secondary: null,
		target: "normal",
	},
	bittermalice: {
		num: 841,
		accuracy: 100,
		basePower: 80,
		type: "Ghost",
		category: "Special",
		name: "Bitter Malice",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondaries: [
			{ chance: 100, boosts: { atk: -1 }, },
			{ chance: 30, volatileStatus: 'curse', },
		],
		onBasePower(basePower, attacker, defender, move) { if (defender.volatiles['curse']) { return this.chainModify(2); } },
		target: "normal",
	},
	blastburn: {
		num: 307,
		accuracy: 90,
		basePower: 150,
		type: "Fire",
		category: "Special",
		name: "Blast Burn",
		pp: 5,
		priority: 0,
		critRatio: 5,
		flags: { recharge: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {volatileStatus: 'mustrecharge',},
		secondary: null,
		target: "normal",
	},
	bleakwindstorm: {
		num: 846,
		accuracy: 80,
		basePower: 100,
		type: "Flying",
		category: "Special",
		name: "Bleakwind Storm",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { magic: 1, wind: 1, protect: 1, mirror: 1, metronome: 1 },
		onModifyMove(move, pokemon, target) { if (target && ['raindance', 'primordialsea', 'turbulentwinds'].includes(target.effectiveWeather())) { move.accuracy = true; } },
		secondary: { chance: 30, boosts: {spe: -1,}, },
		target: "allAdjacentFoes",
	},
	blizzard: {
		num: 59,
		accuracy: 70,
		basePower: 110,
		type: "Ice",
		category: "Special",
		name: "Blizzard",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { wind: 1, protect: 1, mirror: 1, metronome: 1 },
		onModifyMove(move, pokemon, target) {
			switch (target?.effectiveWeather()) {
			case 'hail':
			case 'snowscape':
				move.accuracy = true;
				break;
			case 'sandstorm':
			case 'sunnyday':
			case 'desolateland':
			case 'turbulentwinds':
			case 'deltastream':
				move.accuracy = 50;
				break;
			}
		},
		secondary: { chance: 10, status: 'frz', },
		target: "allAdjacentFoes",
	},
	bloodmoon: {
		num: 901,
		accuracy: 100,
		basePower: 140,
		type: "Normal",
		category: "Special",
		name: "Blood Moon",
		pp: 5,
		priority: 0,
		critRatio: 1,
		flags: { beam: 1, lunar: 1, protect: 1, mirror: 1, metronome: 1, cantusetwice: 1 },
		secondary: null,
		target: "normal",
	},
	blueflare: {
		num: 551,
		accuracy: 90,
		basePower: 140,
		type: "Fire",
		category: "Special",
		name: "Blue Flare",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { beam: 1, breath: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 20, status: 'brn', },
		target: "normal",
	},
	boomburst: {
		num: 586,
		accuracy: 100,
		basePower: 140,
		type: "Normal",
		category: "Special",
		name: "Boomburst",
		pp: 10,
		priority: 0,
		critRatio: 2,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacent",
	},
	brine: {
		num: 362,
		accuracy: 100,
		basePower: 55,
		type: "Water",
		category: "Special",
		name: "Brine",
		pp: 10,
		priority: 0,
		critRatio: 1,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onBasePower(basePower, pokemon, target) { if (target.hp * 2 <= target.maxhp) { return this.chainModify(2); } },
		secondary: { chance: 50, volatileStatus: 'saltcure', },
		onHit(target, source, move) {
			target.setType('Water');
			this.add('-start', target, 'typechange', 'Water', '[from] move: Brine');
		},
		target: "normal",
	},
	bubble: {
		num: 145,
		accuracy: 85,
		basePower: 40,
		type: "Water",
		category: "Special",
		name: "Bubble",
		pp: 30,
		priority: 0,
		critRatio: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, status: 'bubbleblight', },
		target: "allAdjacentFoes",
	},
	bubblebeam: {
		num: 61,
		accuracy: 100,
		basePower: 65,
		type: "Water",
		category: "Special",
		name: "Bubble Beam",
		pp: 20,
		priority: 0,
		critRatio: 0,
		flags: { beam: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 70, status: 'bubbleblight', },
		target: "normal",
	},
	bugbuzz: {
		num: 405,
		accuracy: 100,
		basePower: 90,
		type: "Bug",
		category: "Special",
		name: "Bug Buzz",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		secondary: { chance: 20, boosts: {spd: -1,}, },
		target: "normal",
	},
	burningjealousy: {
		num: 807,
		accuracy: 100,
		basePower: 70,
		type: "Fire",
		category: "Special",
		name: "Burning Jealousy",
		pp: 5,
		priority: 0,
		critRatio: 5,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, onHit(target, source, move) { if (target?.statsRaisedThisTurn) { target.trySetStatus('brn', source, move); } }, },
		target: "allAdjacentFoes",
	},
	burnup: {
		num: 682,
		accuracy: 100,
		basePower: 130,
		type: "Fire",
		category: "Special",
		name: "Burn Up",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, defrost: 1, metronome: 1 },
		onTryMove(pokemon, target, move) {
			if (pokemon.hasType('Fire')) return;
			this.add('-fail', pokemon, 'move: Burn Up');
			this.attrLastMove('[still]');
			return null;
		},
		self: {
			onHit(pokemon) {
				pokemon.setType(pokemon.getTypes(true).map(type => type === "Fire" ? "???" : type));
				this.add('-start', pokemon, 'typechange', pokemon.getTypes().join('/'), '[from] move: Burn Up');
			},
		},
		secondary: null,
		target: "normal",
	},
	chargebeam: {
		num: 451,
		accuracy: 90,
		basePower: 60,
		type: "Electric",
		category: "Special",
		name: "Charge Beam",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { beam: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 70, self: {boosts: {spa: 1,},}, },
		onAfterMoveSecondarySelf(pokemon, target, move) { if (move && move.name === 'Charge Beam' && pokemon.boosts.spa > (pokemon.boosts.spa - 1)) { pokemon.addVolatile('charge'); } },
		target: "normal",
	},
	chillingwater: {
		num: 886,
		accuracy: 100,
		basePower: 50,
		type: "Water",
		category: "Special",
		name: "Chilling Water",
		pp: 15,
		priority: 0,
		critRatio: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: { chance: 100, boosts: {atk: -1,}, },
		onAfterMove(source, target, move) {
			if (source.fainted || !move.hitTargets || move.hasSheerForce) {
				// make sure the volatiles are cleared
				for (const pokemon of this.getAllActive()) delete pokemon.volatiles['sparklingaria'];
				return;
			}
			const numberTargets = move.hitTargets.length;
			for (const pokemon of move.hitTargets) {
				// bypasses Shield Dust when hitting multiple targets
				if (pokemon !== source && pokemon.isActive && (pokemon.removeVolatile('sparklingaria') || numberTargets > 1) &&
					pokemon.status === 'brn') { pokemon.cureStatus(); }
			}
		},
		target: "normal",
	},
	chloroblast: {
		num: 835,
		accuracy: 100,
		basePower: 150,
		type: "Grass",
		category: "Special",
		name: "Chloroblast",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { beam: 1, solar: 1, protect: 1, mirror: 1, metronome: 1 },
		onTryMove(pokemon, target, move) {
			if (pokemon.hasType('Grass')) return;
			this.add('-fail', pokemon, 'move: Chloroblast');
			this.attrLastMove('[still]');
			return null;
		},
		self: {
			onHit(pokemon) {
				pokemon.setType(pokemon.getTypes(true).map(type => type === "Grass" ? "???" : type));
				this.add('-start', pokemon, 'typechange', pokemon.getTypes().join('/'), '[from] move: Chloroblast');
			},
		},
		secondary: null,
		target: "normal",
	},
	clangingscales: {
		num: 691,
		accuracy: 100,
		basePower: 110,
		type: "Dragon",
		category: "Special",
		name: "Clanging Scales",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		selfBoost: { boosts: {def: -1,} },
		secondary: null,
		target: "allAdjacentFoes",
	},
	clearsmog: {
		num: 499,
		accuracy: true,
		basePower: 50,
		type: "Poison",
		category: "Special",
		name: "Clear Smog",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onHit(target) {
			target.clearBoosts();
			this.add('-clearboost', target);
		},
		secondary: null,
		target: "normal",
	},
	confusion: {
		num: 93,
		accuracy: 100,
		basePower: 50,
		type: "Psychic",
		category: "Special",
		name: "Confusion",
		pp: 25,
		priority: 0,
		critRatio: 2,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 10, volatileStatus: 'confusion', },
		target: "normal",
	},
	corrosivegas: {
		num: 810,
		accuracy: 100,
		basePower: 50,
		type: "Poison",
		category: "Special",
		name: "Corrosive Gas",
		pp: 10,
		priority: 0,
		critRatio: 2,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onHit(target, source) {
			const item = target.takeItem(source);
			if (item) { this.add('-enditem', target, item.name, '[from] move: Corrosive Gas', `[of] ${source}`); }
		},
		secondary: null,
		target: "normal",
	},
	corrosiveshot: {
		num: 4001,
		accuracy: 100,
		basePower: 75,
		type: "Poison",
		category: "Special",
		name: "Sludge Bomb",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondaries: [
			{ chance: 10, status: 'psn', },
			{ chance: 20, boosts: { spd: -1 }, },
		],
		onEffectiveness(typeMod, target, type) { if (type === 'Steel') return 1; },
		target: "normal",
	},

	darkpulse: {
		num: 399,
		accuracy: 100,
		basePower: 80,
		type: "Dark",
		category: "Special",
		name: "Dark Pulse",
		pp: 15,
		priority: 0,
		critRatio: 5,
		flags: { pulse: 1, protect: 1, mirror: 1, distance: 1, metronome: 1 },
		secondary: { chance: 20, volatileStatus: 'flinch', },
		target: "any",
	},
	dazzlinggleam: {
		num: 605,
		accuracy: 100,
		basePower: 80,
		type: "Fairy",
		category: "Special",
		name: "Dazzling Gleam",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { light: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacentFoes",
	},
	disarmingvoice: {
		num: 574,
		accuracy: true,
		basePower: 40,
		type: "Fairy",
		category: "Special",
		name: "Disarming Voice",
		pp: 15,
		priority: 0,
		critRatio: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		secondary: { chance: 80, boosts: { atk: -1 } },
		target: "allAdjacentFoes",
	},
	discharge: {
		num: 435,
		accuracy: 100,
		basePower: 80,
		type: "Electric",
		category: "Special",
		name: "Discharge",
		pp: 15,
		priority: 0,
		critRatio: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, status: 'par', },
		target: "allAdjacent",
	},
	doomdesire: {
		num: 353,
		accuracy: 100,
		basePower: 160,
		type: "Steel",
		category: "Special",
		name: "Doom Desire",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { light: 1, metronome: 1, futuremove: 1 },
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				move: 'doomdesire',
				source,
				moveData: {
					id: 'doomdesire',
					name: "Doom Desire",
					accuracy: 100,
					basePower: 160,
					category: "Special",
					priority: 0,
					flags: { light: 1, metronome: 1, futuremove: 1 },
					effectType: 'Move',
					type: 'Steel',
				},
			});
			this.add('-start', source, 'Doom Desire');
			return this.NOT_FAIL;
		},
		secondary: null,
		target: "normal",
	},
	dracometeor: {
		num: 434,
		accuracy: 90,
		basePower: 130,
		onBasePower(basePower, pokemon, target, move) { if (pokemon.battle.field.getPseudoWeather('gravity')) { return this.chainModify(1.2); } },
		type: "Dragon",
		category: "Special",
		name: "Draco Meteor",
		pp: 5,
		priority: 0,
		critRatio: 5,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		self: {boosts: {spa: -2,},},
		secondary: null,
		target: "normal",
	},
	dragonbreath: {
		num: 225,
		accuracy: 100,
		basePower: 65,
		type: "Dragon",
		category: "Special",
		name: "Dragon Breath",
		pp: 20,
		priority: 0,
		critRatio: 7,
		flags: { breath: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 80, status: 'dragonblight', },
		target: "normal",
	},
	dragonenergy: {
		num: 820,
		accuracy: 100,
		basePower: 150,
		basePowerCallback(pokemon, target, move) {
			const bp = move.basePower * pokemon.hp / pokemon.maxhp;
			this.debug(`BP: ${bp}`);
			return bp;
		},
		type: "Dragon",
		category: "Special",
		name: "Dragon Energy",
		pp: 5,
		priority: 0,
		critRatio: 5,
		flags: { light: 1, protect: 1, mirror: 1 },
		secondary: { chance: 10, status: 'dragonblight', },
		target: "allAdjacentFoes",
	},
	dragonpulse: {
		num: 406,
		accuracy: 100,
		basePower: 85,
		type: "Dragon",
		category: "Special",
		name: "Dragon Pulse",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { beam: 1, pulse: 1, protect: 1, mirror: 1, distance: 1, metronome: 1 },
		secondary: { chance: 20, status: 'dragonblight', },
		target: "any",
	},
	dragonrage: {
		num: 82,
		accuracy: 100,
		basePower: 0,
		damage: 40,
		type: "Dragon",
		category: "Special",
		name: "Dragon Rage",
		pp: 10,
		priority: 0,
		flags: { aura: 1, breath: 1, protect: 1, mirror: 1, metronome: 1 },
		onAfterMoveSecondarySelf(pokemon, target, move) {
			pokemon.setStatus('aura', pokemon, {
				auraAbility: 'dragonsfury',
				auraName: "Dragon's Fury",
				auraDuration: 2,
			} as any);
		},
		secondary: null,
		target: "normal",
	},
	drainingkiss: {
		num: 577,
		accuracy: 100,
		basePower: 50,
		type: "Fairy",
		category: "Special",
		name: "Draining Kiss",
		pp: 10,
		priority: 0,
		critRatio: 1,
		flags: { drain: 1, heal: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		drain: [3, 4],
		secondary: null,
		target: "normal",
	},
	dreameater: {
		num: 138,
		accuracy: 100,
		basePower: 100,
		type: "Psychic",
		category: "Special",
		name: "Dream Eater",
		pp: 15,
		priority: 0,
		critRatio: 0,
		flags: { protect: 1, mirror: 1, heal: 1, metronome: 1 },
		drain: [1, 2],
		onTryImmunity(target) { return target.status === 'slp' || target.hasAbility('comatose'); },
		secondary: null,
		target: "normal",
	},
	dynamaxcannon: {
		num: 744,
		accuracy: 100,
		basePower: 100,
		type: "Dragon",
		category: "Special",
		name: "Dynamax Cannon",
		pp: 5,
		priority: 0,
		critRatio: 5,
		flags: { beam: 1, breath: 1, light: 1, protect: 1, failencore: 1, nosleeptalk: 1, failcopycat: 1, failmimic: 1, failinstruct: 1, noparentalbond: 1 },
		secondary: { chance: 10, status: 'dragonblight', },
		target: "normal",
	},
	earthpower: {
		num: 414,
		accuracy: 100,
		basePower: 90,
		type: "Ground",
		category: "Special",
		name: "Earth Power",
		pp: 10,
		priority: 0,
		critRatio: 2,
		flags: { explosive: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: { chance: 10, boosts: {spd: -1,}, },
		target: "normal",
	},
	echoedvoice: {
		num: 497,
		accuracy: 100,
		basePower: 40,
		basePowerCallback(pokemon, target, move) {
			let bp = move.basePower;
			if (this.field.pseudoWeather.echoedvoice) { bp = move.basePower * this.field.pseudoWeather.echoedvoice.multiplier; }
			this.debug(`BP: ${move.basePower}`);
			return bp;
		},
		type: "Normal",
		category: "Special",
		name: "Echoed Voice",
		pp: 15,
		priority: 0,
		critRatio: 2,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		onTryMove() { this.field.addPseudoWeather('echoedvoice'); },
		condition: {
			duration: 2,
			onFieldStart() { this.effectState.multiplier = 1; },
			onFieldRestart() {
				if (this.effectState.duration !== 2) {
					this.effectState.duration = 2;
					if (this.effectState.multiplier < 5) { this.effectState.multiplier++; }
				}
			},
		},
		secondary: null,
		target: "normal",
	},
	eeriespell: {
		num: 826,
		accuracy: 100,
		basePower: 90,
		type: "Psychic",
		category: "Special",
		name: "Eerie Spell",
		pp: 5,
		priority: 0,
		critRatio: 1,
		flags: { magic: 1, sound: 1, protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		secondaries: [
			{ chance: 100, volatileStatus: 'eeriespellpp', },
			{ chance: 100, volatileStatus: 'eeriespelltrap',},
		],
		target: "normal",
	},
	eggbomb: {
		num: 121,
		accuracy: 95,
		basePower: 100,
		type: "Grass",
		category: "Special",
		name: "Egg Bomb",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { bomb: 1, protect: 1, mirror: 1, metronome: 1,  },
		secondary: null,
		target: "normal",
	},
	electroball: {
		num: 486,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			let ratio = Math.floor(pokemon.getStat('spe') / target.getStat('spe'));
			if (!isFinite(ratio)) ratio = 0;
			const bp = [40, 60, 80, 120, 150][Math.min(ratio, 4)];
			this.debug(`BP: ${bp}`);
			return bp;
		},
		type: "Electric",
		category: "Special",
		name: "Electro Ball",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { bomb: 1, throw: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	electrodrift: {
		num: 879,
		accuracy: 100,
		basePower: 100,
		type: "Electric",
		category: "Special",
		name: "Electro Drift",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { airborne: 1, crash: 1, spin: 1, contact: 1, protect: 1, mirror: 1 },
		onBasePower(basePower, source, target, move) {
			if (target.runEffectiveness(move) > 0) {
				this.debug(`electro drift super effective buff`);
				return this.chainModify([5461, 4096]);
			}
		},
		secondary: null,
		target: "normal",
	},
	electroshot: {
		num: 905,
		accuracy: 100,
		basePower: 130,
		type: "Electric",
		category: "Special",
		name: "Electro Shot",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { beam: 1, breath: 1, charge: 1, protect: 1, mirror: 1, metronome: 1 },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) { return; }
			this.add('-prepare', attacker, move.name);
			this.boost({ spa: 1 }, attacker, attacker, move);
			if (['raindance', 'primordialsea'].includes(attacker.effectiveWeather())) {
				this.attrLastMove('[still]');
				this.addMove('-anim', attacker, move.name, defender);
				return;
			}
			if (!this.runEvent('ChargeMove', attacker, defender, move)) { return; }
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		secondary: null,
		hasSheerForce: true,
		target: "normal",
	},
	electroweb: {
		num: 527,
		accuracy: 95,
		basePower: 55,
		type: "Electric",
		category: "Special",
		name: "Electroweb",
		pp: 15,
		priority: 0,
		critRatio: 2,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, boosts: {spe: -1,}, },
		target: "allAdjacentFoes",
	},
	ember: {
		num: 52,
		accuracy: 100,
		basePower: 40,
		type: "Fire",
		category: "Special",
		name: "Ember",
		pp: 25,
		priority: 0,
		critRatio: 2,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 10, status: 'brn',},
		target: "normal",
	},
	energyball: {
		num: 412,
		accuracy: 100,
		basePower: 90,
		type: "Grass",
		category: "Special",
		name: "Energy Ball",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: { chance: 20, boosts: {spd: -1,}, },
		target: "normal",
	},
	eruption: {
		num: 284,
		accuracy: 100,
		basePower: 150,
		basePowerCallback(pokemon, target, move) {
			const bp = move.basePower * pokemon.hp / pokemon.maxhp;
			this.debug(`BP: ${bp}`);
			return bp;
		},
		type: "Fire",
		category: "Special",
		name: "Eruption",
		pp: 5,
		priority: 0,
		critRatio: 5,
		flags: { explosive: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacentFoes",
	},
	esperwing: {
		num: 840,
		accuracy: 100,
		basePower: 80,
		type: "Psychic",
		category: "Special",
		name: "Esper Wing",
		pp: 10,
		priority: 0,
		critRatio: 6,
		flags: { aura: 1, slicing: 1, wing: 1, protect: 1, mirror: 1, metronome: 1 },
		onAfterMoveSecondarySelf(pokemon, target, move) {
			// Grant Esper Wing aura
			pokemon.setStatus('aura', pokemon, {
				auraAbility: 'esperwing',
				auraName: 'Esper Wing',
				auraDuration: 2,
			} as any);
			
			// If move scored a critical hit, boost speed
			if (target && target.getMoveHitData(move).crit) {
				this.boost({ spe: 1 }, pokemon, pokemon, move);
			}
			
			// Set Psychic Terrain for 2 turns if not already active
			if (!this.field.isTerrain('psychicterrain')) {
				this.field.setTerrain('psychicterrain');
				this.field.terrainState.duration = 2;
			}
		},
		secondary: null,
		target: "normal",
	},
	expandingforce: {
		num: 797,
		accuracy: 100,
		basePower: 80,
		type: "Psychic",
		category: "Special",
		name: "Expanding Force",
		pp: 5,
		priority: 0,
		critRatio: 2,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onBasePower(basePower, source) {
			if (this.field.isTerrain('psychicterrain') && source.isGrounded()) {
				this.debug('terrain buff');
				return this.chainModify(1.5);
			}
		},
		onModifyMove(move, source, target) { if (this.field.isTerrain('psychicterrain') && source.isGrounded()) { move.target = 'allAdjacentFoes'; } },
		secondary: null,
		target: "normal",
	},
	extrasensory: {
		num: 326,
		accuracy: 100,
		basePower: 80,
		type: "Psychic",
		category: "Special",
		name: "Extrasensory",
		pp: 20,
		priority: 0,
		critRatio: 1,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 70,
			onHit(target, source, move) {
				if (target.hasType('Dragon')) { target.setStatus('dragonblight', source); }
				else if (target.hasType('Electric')) { target.setStatus('par', source); }
				else if (target.hasType('Fighting')) {
					target.setStatus('aura', target, {
						auraAbility: 'migraine',
						auraName: 'Migraine',
						auraDuration: 7,
					} as any);
				}
				else if (target.hasType('Fire')) { target.setStatus('brn', source); }
				else if (target.hasType('Ghost')) { target.addVolatile('curse', source); }
				else if (target.hasType('Ice')) { target.setStatus('frostbite', source); }
				else if (target.hasType('Normal')) { target.setStatus('drowsy', source); }
				else if (target.hasType('Poison')) { target.setStatus('psn', source); }
				else if (target.hasType('Psychic')) { target.addVolatile('confusion', source); }
			},
		},
	target: "normal",
},
	fairywind: {
		num: 584,
		accuracy: 100,
		basePower: 55,
		type: "Fairy",
		category: "Special",
		name: "Fairy Wind",
		pp: 30,
		priority: 0,
		critRatio: 0,
		flags: { magic: 1, wind: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, volatileStatus: 'magicdust', },
		target: "normal",
	},
	ficklebeam: {
		num: 907,
		accuracy: 100,
		basePower: 50,
		type: "Dragon",
		category: "Special",
		name: "Fickle Beam",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { beam: 1, protect: 1, mirror: 1, metronome: 1 },
		secondaries: [
			{ chance: 10, status: 'dragonblight', },
			{ chance: 1, self: { status: 'dragonblight' }, },
		],
		target: "normal",
		multihit: [1, 7],
		basePowerCallback(pokemon, target, move) {
			if (!move.hit) move.hit = 1;
			if (move.hit === 1) return 50;
			if (move.hit >= 2 && move.hit <= 6) return 15;
			if (move.hit === 7) return 110;
			return 15;
		},
        onHit(target, pokemon, move) {
            // Only apply animation and activation on the last hit
            if (move.hit === 7) {
                this.attrLastMove('[anim] Fickle Beam All Out');
                this.add('-activate', pokemon, 'move: Fickle Beam');
            }
        },
	},
	fierydance: {
		num: 552,
		accuracy: 100,
		basePower: 80,
		type: "Fire",
		category: "Special",
		name: "Fiery Dance",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { protect: 1, mirror: 1, dance: 1, metronome: 1 },
		secondary: { chance: 50, self: {boosts: {spa: 1,},}, },
		target: "normal",
	},
	fierywrath: {
		num: 822,
		accuracy: 100,
		basePower: 90,
		type: "Dark",
		type2: "Fire",
		category: "Special",
		name: "Fiery Wrath",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { aura: 1, protect: 1, mirror: 1 },
		secondary: { chance: 20, volatileStatus: 'flinch', },
        onHit(target, source, move) {
            if (target.status === 'aura') {
                target.cureStatus();
                target.trySetStatus('brn', source, move);
                this.add('-activate', target, 'move: Fiery Wrath', '[breakAura]');
            }
        },
		target: "allAdjacentFoes",
	},
	finalgambit: {
		num: 515,
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon) {
			const damage = pokemon.hp;
			pokemon.faint();
			return damage;
		},
		selfdestruct: "ifHit",
		type: "Fighting",
		category: "Special",
		name: "Final Gambit",
		pp: 5,
		priority: 0,
		flags: { protect: 1, metronome: 1, noparentalbond: 1 },
		secondary: null,
		target: "normal",
	},
	fireblast: {
		num: 126,
		accuracy: 85,
		basePower: 115,
		type: "Fire",
		category: "Special",
		name: "Fire Blast",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 10, status: 'brn', },
		target: "normal",
	},
	firepledge: {
		num: 519,
		accuracy: 100,
		basePower: 80,
		basePowerCallback(target, source, move) {
			if (['grasspledge', 'waterpledge'].includes(move.sourceEffect)) {
				this.add('-combine');
				return 150;
			}
			return move.basePower;
		},
		type: "Fire",
		category: "Special",
		name: "Fire Pledge",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, nonsky: 1, metronome: 1, pledgecombo: 1 },
		onPrepareHit(target, source, move) {
			for (const action of this.queue.list as MoveAction[]) {
				if (
					!action.move || !action.pokemon?.isActive ||
					action.pokemon.fainted || action.maxMove || action.zmove
				) {
					continue;
				}
				if (action.pokemon.isAlly(source) && ['grasspledge', 'waterpledge'].includes(action.move.id)) {
					this.queue.prioritizeAction(action, move);
					this.add('-waiting', source, action.pokemon);
					return null;
				}
			}
		},
		onModifyMove(move) {
			if (move.sourceEffect === 'waterpledge') {
				move.type = 'Water';
				move.forceSTAB = true;
				move.self = { sideCondition: 'waterpledge' };
			}
			if (move.sourceEffect === 'grasspledge') {
				move.type = 'Fire';
				move.forceSTAB = true;
				move.sideCondition = 'SeaofFire';
			}
		},
		condition: {
			duration: 4,
			onSideStart(targetSide) { this.add('-sidestart', targetSide, 'SeaofFire'); },
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(pokemon) { if (!pokemon.hasType('Fire')) this.damage(pokemon.baseMaxhp / 8, pokemon); },
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 8,
			onSideEnd(targetSide) { this.add('-sideend', targetSide, 'SeaofFire'); },
		},
		secondary: null,
		target: "normal",
	},
	firespin: {
		num: 83,
		accuracy: 95,
		basePower: 45,
		type: "Fire",
		category: "Special",
		name: "Fire Spin",
		pp: 15,
		priority: 0,
		critRatio: 2,
		flags: { binding: 1, spin: 1, protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'firespin',
		condition: {
			duration: 5,
			durationCallback(target, source) {
				if (source?.hasItem('gripclaw')) return 8;
				return this.random(5, 7);
			},
			onStart(pokemon, source) {
				this.add('-activate', pokemon, 'move: Fire Spin', `[of] ${source}`);
				this.effectState.boundDivisor = source.hasItem('bindingband') ? 6 : 8;
			},
			onResidualOrder: 13,
			onResidual(pokemon) {
				const source = this.effectState.source;
				if (source && (!source.isActive || source.hp <= 0 || !source.activeTurns)) {
					delete pokemon.volatiles['firespin'];
					this.add('-end', pokemon, 'Fire Spin', '[partiallytrapped]', '[silent]');
					return;
				}
				this.damage(pokemon.baseMaxhp / this.effectState.boundDivisor);
				if (this.randomChance(1, 10)) { pokemon.trySetStatus('brn', source); }
			},
			onEnd(pokemon) { this.add('-end', pokemon, 'Fire Spin', '[partiallytrapped]'); },
			onTrapPokemon(pokemon) { if (this.effectState.source?.isActive) pokemon.tryTrap(); },
		},
		secondary: { chance: 10, status: 'brn', },
		target: "normal",
	},
	flameburst: {
		num: 481,
		accuracy: 100,
		basePower: 85,
		type: "Fire",
		category: "Special",
		name: "Flame Burst",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onHit(target, source, move) {
			for (const ally of target.adjacentAllies()) {
				const typeMod = this.dex.getEffectiveness('Fire', ally);
				let damageRatio;
				if (typeMod === 2) damageRatio = 4; 
				else if (typeMod === 1) damageRatio = 8; 
				else if (typeMod === 0) damageRatio = 12; 
				else if (typeMod === -1) damageRatio = 16; 
				else damageRatio = 24; 
				this.damage(ally.baseMaxhp / damageRatio, ally, source, this.dex.conditions.get('Flame Burst'));
			}
			const terrain = this.field.getTerrain();
			if (terrain && (terrain.id === 'grassyterrain' || terrain.id === 'toxicterrain')) {
				const terrainName = terrain.id === 'grassyterrain' ? 'Grassy Terrain' : 'Toxic Terrain';
				this.add('-message', `The ${terrainName} was engulfed in flames!`);
				this.field.addPseudoWeather('seaoffire');
				if (terrain.id === 'grassyterrain') { this.field.clearTerrain(); }
			}
		},
		onAfterSubDamage(damage, target, source, move) {
			for (const ally of target.adjacentAllies()) {
				const typeMod = this.dex.getEffectiveness('Fire', ally);
				let damageRatio;
				if (typeMod === 2) damageRatio = 4; 
				else if (typeMod === 1) damageRatio = 8; 
				else if (typeMod === 0) damageRatio = 12; 
				else if (typeMod === -1) damageRatio = 16; 
				else damageRatio = 24; 
				this.damage(ally.baseMaxhp / damageRatio, ally, source, this.dex.conditions.get('Flame Burst'));
			}
			const terrain = this.field.getTerrain();
			if (terrain && (terrain.id === 'grassyterrain' || terrain.id === 'toxicterrain')) {
				const terrainName = terrain.id === 'grassyterrain' ? 'Grassy Terrain' : 'Toxic Terrain';
				this.add('-message', `The ${terrainName} was engulfed in flames!`);
				this.field.addPseudoWeather('seaoffire');
				if (terrain.id === 'grassyterrain') { this.field.clearTerrain(); }
			}
		},
		secondary: null,
		target: "normal",
	},
	flamethrower: {
		num: 53,
		accuracy: 100,
		basePower: 90,
		type: "Fire",
		category: "Special",
		name: "Flamethrower",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { breath: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 10, status: 'brn', },
		target: "normal",
	},
	flashcannon: {
		num: 430,
		accuracy: 100,
		basePower: 80,
		type: "Steel",
		category: "Special",
		name: "Flash Cannon",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { light: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 10, boosts: {spd: -1,}, },
		target: "normal",
	},
	fleurcannon: {
		num: 705,
		accuracy: 90,
		basePower: 130,
		type: "Fairy",
		category: "Special",
		name: "Fleur Cannon",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { beam: 1, light: 1, protect: 1, mirror: 1 },
		self: {boosts: {spa: -2,},},
		secondary: null,
		target: "normal",
	},
	focusblast: {
		num: 411,
		accuracy: 75,
		basePower: 120,
		type: "Fighting",
		category: "Special",
		name: "Focus Blast",
		pp: 5,
		priority: 0,
		critRatio: 6,
		flags: { aura: 1, bullet: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, boosts: {spd: -1,}, },
		target: "normal",
	},
	freezedry: {
		num: 573,
		accuracy: 100,
		basePower: 65,
		type: "Ice",
		category: "Special",
		name: "Freeze-Dry",
		pp: 15,
		priority: 0,
		critRatio: 3,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onEffectiveness(typeMod, target, type) { if (type === 'Water') return 1; },
		secondary: { chance: 10, status: 'frz', },
		target: "normal",
	},
	freezingglare: {
		num: 821,
		accuracy: 100,
		basePower: 110,
		type: "Psychic",
		type2: "Ice",
		category: "Special",
		name: "Freezing Glare",
		pp: 10,
		priority: 0,
		critRatio: 2,
		flags: { beam: 1, light: 1, protect: 1, mirror: 1 },
		secondaries: [
			{ chance: 10, status: 'frz', },
			{ chance: 30, status: 'frostbite', }
		],
		target: "normal",

	},
	frostbreath: {
		num: 524,
		accuracy: 95,
		basePower: 55,
		type: "Ice",
		category: "Special",
		name: "Frost Breath",
		pp: 10,
		priority: 0,
		critRatio: 10,
		flags: { breath: 1, protect: 1, mirror: 1, metronome: 1 },
		willCrit: true,
        secondary: { chance: 50, status: 'frostbite', },
		target: "normal",
	},
	fusionflare: {
		num: 558,
		accuracy: 100,
		basePower: 100,
		type: "Fire",
		category: "Special",
		name: "Fusion Flare",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { bomb: 1, explosive: 1, protect: 1, mirror: 1, defrost: 1, metronome: 1 },
		onModifyMove(move, pokemon) {
			if (this.lastSuccessfulMoveThisTurn === 'fusionbolt') {
				move.type2 = 'Electric';
				(move as any).fusionMode = true;
			} else if (this.getAllActive().some(p => p.hasAbility('teravolt'))) {
				move.type2 = 'Electric';
				(move as any).fusionMode = true;
				(move as any).teravoltMode = true;
			}
		},
		onBasePower(basePower, pokemon) {
			if (this.lastSuccessfulMoveThisTurn === 'fusionbolt') {
				this.debug('double power');
				return this.chainModify(2);
			} else if (this.getAllActive().some(p => p.hasAbility('teravolt'))) {
				this.debug('teravolt boost');
				return this.chainModify(1.2);
			}
		},
		secondary: null,
		target: "normal",
	},
	futuresight: {
		num: 248,
		accuracy: 100,
		basePower: 140,
		type: "Psychic",
		category: "Special",
		name: "Future Sight",
		pp: 10,
		priority: 0,
		critRatio: 1,
		flags: { allyanim: 1, metronome: 1, futuremove: 1 },
		ignoreImmunity: true,
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				move: 'futuresight',
				source,
				moveData: {
					id: 'futuresight',
					name: "Future Sight",
					accuracy: 100,
					basePower: 140,
					category: "Special",
					priority: 0,
					critRatio: 1,
					flags: { allyanim: 1, metronome: 1, futuremove: 1 },
					ignoreImmunity: false,
					effectType: 'Move',
					type: 'Psychic',
				},
			});
			this.add('-start', source, 'move: Future Sight');
			return this.NOT_FAIL;
		},
		secondary: null,
		target: "normal",
	},
	gigadrain: {
		num: 202,
		accuracy: 100,
		basePower: 75,
		type: "Grass",
		category: "Special",
		name: "Giga Drain",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { drain: 1, heal: 1, protect: 1, mirror: 1, metronome: 1 },
		drain: [1, 2],
		secondary: null,
		target: "normal",
	},
	glaciate: {
		num: 549,
		accuracy: 95,
		basePower: 95,
		type: "Ice",
		category: "Special",
		name: "Glaciate",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, boosts: {spe: -1,}, },
		target: "allAdjacentFoes",
	},
	grassknot: {
		num: 447,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			const targetWeight = target.getWeight();
			let bp;
			if (targetWeight >= 2000) 
				{ bp = 120; } 
			else if (targetWeight >= 1000) 
				{ bp = 100; } 
			else if (targetWeight >= 500) 
				{ bp = 80; } 
			else if (targetWeight >= 250) 
				{ bp = 60; } 
			else if (targetWeight >= 100) 
				{ bp = 40; } 
			else { bp = 20; }
			this.debug(`BP: ${bp}`);
			return bp;
		},
		type: "Grass",
		category: "Special",
		name: "Grass Knot",
		pp: 20,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		onTryHit(target, source, move) {
			if (target.volatiles['dynamax']) {
				this.add('-fail', source, 'move: Grass Knot', '[from] Dynamax');
				this.attrLastMove('[still]');
				return null;
			}
		},
		secondary: null,
		target: "normal",
	},
	gust: {
		num: 16,
		accuracy: 100,
		basePower: 40,
		type: "Flying",
		category: "Special",
		name: "Gust",
		pp: 35,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, wind: 1 },
		secondary: null,
		target: "any",
	},
	heatwave: {
		num: 257,
		accuracy: 90,
		basePower: 95,
		type: "Fire",
		category: "Special",
		name: "Heat Wave",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { breath: 1, wind: 1, protect: 1, mirror: 1, metronome: 1 },
		onModifyMove(move, pokemon, target) {
			switch (target?.effectiveWeather()) {
			case 'sandstorm':
			case 'sunnyday':
			case 'desolateland':
				move.accuracy = true;
				break;
			case 'hail':
			case 'snowscape':
			case 'turbulentwinds':
			case 'deltastream':
				move.accuracy = 65;
				break;
			}
		},
		secondary: { chance: 10, status: 'brn', },
		target: "allAdjacentFoes",
	},
	hex: {
		num: 506,
		accuracy: 100,
		basePower: 65,
		basePowerCallback(pokemon, target, move) {
			if (target.status || target.hasAbility('comatose')) {
				this.debug('BP doubled from status condition');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		type: "Ghost",
		category: "Special",
		name: "Hex",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { magic: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	hurricane: {
		num: 542,
		accuracy: 70,
		basePower: 110,
		type: "Flying",
		category: "Special",
		name: "Hurricane",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { wind: 1, protect: 1, mirror: 1, distance: 1, metronome: 1 },
		onModifyMove(move, pokemon, target) {
			switch (target?.effectiveWeather()) {
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'turbulentwinds':
			case 'deltastream':
				move.accuracy = true;
				break;
			case 'snowscape':
			case 'sunnyday':
			case 'desolateland':
				move.accuracy = 50;
				break;
			}
		},
		secondary: { chance: 30, volatileStatus: 'confusion', },
		target: "any",
	},
	hydropump: {
		num: 56,
		accuracy: 80,
		basePower: 110,
		type: "Water",
		category: "Special",
		name: "Hydro Pump",
		pp: 5,
		priority: 0,
		critRatio: 3,
		flags: { beam: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	hydrosteam: {
		num: 876,
		accuracy: 100,
		basePower: 80,
		type: "Water",
		category: "Special",
		name: "Hydro Steam",
		pp: 15,
		priority: 0,
		critRatio: 1,
		flags: { beam: 1, protect: 1, mirror: 1, defrost: 1, metronome: 1 },
		// Damage boost in Sun applied in conditions.ts
		thawsTarget: true,
		secondary: null,
		target: "normal",

	},
	hyperbeam: {
		num: 63,
		accuracy: 90,
		basePower: 150,
		type: "Normal",
		category: "Special",
		name: "Hyper Beam",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { beam: 1, light: 1, cantusetwice: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	hyperspacehole: {
		num: 593,
		accuracy: true,
		basePower: 90,
		type: "Psychic",
		category: "Special",
		name: "Hyperspace Hole",
		pp: 5,
		priority: 0,
		critRatio: 2,
		flags: { magic: 1, mirror: 1, bypasssub: 1 },
		breaksProtect: true,
		secondary: null,
		target: "normal",
	},
	hypervoice: {
		num: 304,
		accuracy: 100,
		basePower: 90,
		type: "Normal",
		category: "Special",
		name: "Hyper Voice",
		pp: 10,
		priority: 0,
		critRatio: 2,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacentFoes",
	},
	icebeam: {
		num: 58,
		accuracy: 100,
		basePower: 90,
		type: "Ice",
		category: "Special",
		name: "Ice Beam",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { beam : 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 20, status: 'frostbite', },
		target: "normal",
	},
	iceburn: {
		num: 554,
		accuracy: 90,
		basePower: 140,
		type: "Ice",
		type2: "Fire",
		category: "Special",
		name: "Ice Burn",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { cantusetwice: 1, protect: 1, mirror: 1, nosleeptalk: 1, failinstruct: 1 },
		secondaries: [
			{ chance: 30, status: 'brn', },
			{ chance: 30, status: 'frostbite', },
		],
		target: "normal",
	},
	icywind: {
		num: 196,
		accuracy: 95,
		basePower: 55,
		type: "Ice",
		category: "Special",
		name: "Icy Wind",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1, wind: 1 },
		secondary: { chance: 100, boosts: {spe: -1,}, },
		target: "allAdjacentFoes",
	},
	incinerate: {
		num: 510,
		accuracy: 100,
		basePower: 80,
		type: "Fire",
		category: "Special",
		name: "Incinerate",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onHit(pokemon, source) {
			const item = pokemon.getItem();
			if ((item.isBerry || item.isGem) && pokemon.takeItem(source)) { this.add('-enditem', pokemon, item.name, '[from] move: Incinerate'); }
		},
		secondary: null,
		target: "allAdjacentFoes",
	},
	infernalparade: {
		num: 844,
		accuracy: 100,
		basePower: 60,
		basePowerCallback(pokemon, target, move) {
			if (target.status || target.hasAbility('comatose')) return move.basePower * 2;
			return move.basePower;
		},
		type: "Ghost",
		type2: "Fire",
		category: "Special",
		name: "Infernal Parade",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { aura: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 50, status: 'brn', },
		target: "normal",

	},
	inferno: {
		num: 517,
		accuracy: 70,
		basePower: 100,
		type: "Fire",
		category: "Special",
		name: "Inferno",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		self: {boosts: {spa: -1,},},
		secondary: { chance: 100, status: 'brn', },
		target: "normal",
	},
	infestation: {
		num: 611,
		accuracy: 100,
		basePower: 20,
		type: "Bug",
		category: "Special",
		name: "Infestation",
		pp: 20,
		priority: 0,
		critRatio: 5,
		flags: { binding: 1, contact: 1, protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
	},
	judgement: {
		num: 449,
		accuracy: 100,
		basePower: 100,
		type: "Normal",
		category: "Special",
		name: "Judgment",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { light: 1, protect: 1, mirror: 1, metronome: 1 },
		onModifyType(move, pokemon) {
			if (pokemon.ignoringItem()) return;
			const item = pokemon.getItem();
			if (item.id && item.onPlate && !item.zMove) { move.type = item.onPlate; }
		},
		onModifyMove(move, pokemon) {
			if (move.type === 'Bug' || move.type === 'Dark' || move.type === 'Dragon' || move.type === 'Rock') { move.critRatio = (move.critRatio || 1) + 1; } 
			else if (move.type === 'Ground' || move.type === 'Normal' || move.type === 'Psychic' || move.type === 'Rock') { move.critRatio = (move.critRatio || 1) + 1; }
		},
		secondary: null,
		target: "normal",
	},
	kinesis: {
		num: 134,
		accuracy: 95,
		basePower: 95,
		type: "Psychic",
		category: "Special",
		name: "Kinesis",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		onEffectiveness(typeMod, target, type) { if (type === 'Steel') return 1; },
		secondary: null,
		target: "normal",
	},
	lavaplume: {
		num: 436,
		accuracy: 100,
		basePower: 80,
		type: "Fire",
		category: "Special",
		name: "Lava Plume",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, status: 'brn', },
		target: "allAdjacent",
	},
	leafstorm: {
		num: 437,
		accuracy: 90,
		basePower: 130,
		type: "Grass",
		category: "Special",
		name: "Leaf Storm",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { wind: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {boosts: {spa: -2,},},
		secondary: null,
		target: "normal",
	},
	luminacrash: {
		num: 855,
		accuracy: 100,
		basePower: 80,
		type: "Psychic",
		category: "Special",
		name: "Lumina Crash",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { light: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, boosts: {spd: -2,}, },
		target: "normal",

	},
	lusterpurge: {
		num: 295,
		accuracy: 100,
		basePower: 95,
		type: "Psychic",
		category: "Special",
		name: "Luster Purge",
		pp: 5,
		priority: 0,
		critRatio: 3,
		flags: { light: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 50, boosts: {spd: -1,}, },
		target: "normal",
	},
	magicalleaf: {
		num: 345,
		accuracy: true,
		basePower: 85,
		type: "Grass",
		category: "Special",
		name: "Magical Leaf",
		pp: 20,
		priority: 0,
		critRatio: 5,
		flags: { magic: 1, slicing: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacentFoes",
	},
	magmastorm: {
		num: 463,
		accuracy: 75,
		basePower: 100,
		type: "Fire",
		category: "Special",
		name: "Magma Storm",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { binding: 1, protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
	},
	magnetbomb: {
		num: 443,
		accuracy: true,
		basePower: 60,
		type: "Steel",
		category: "Special",
		name: "Magnet Bomb",
		pp: 20,
		priority: 0,
		critRatio: 4,
		flags: { bomb: 1, explosive: 1, protect: 1, mirror: 1, metronome: 1, },
		onEffectiveness(typeMod, target, type) { if (type === 'Electric') return 1; },
		secondary: null,
		target: "normal",
	},
	makeitrain: {
		num: 874,
		accuracy: 100,
		basePower: 110,
		type: "Steel",
		category: "Special",
		name: "Make It Rain",
		pp: 5,
		priority: 0,
		critRatio: 1,
		flags: { throw: 1, protect: 1, mirror: 1 },
		self: {boosts: {spa: -1,},},
		secondary: null,
		target: "allAdjacentFoes",
	},
	malignantchain: {
		num: 919,
		accuracy: 100,
		basePower: 100,
		type: "Poison",
		category: "Special",
		name: "Malignant Chain",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { binding: 1, weapon: 1, protect: 1, mirror: 1, metronome: 1 },
		secondaries: [
			{ chance: 50, status: 'tox',
                onHit(target, source, move) {
                    if (target.setAbility) {
                        target.setAbility('toxicchain');
                        this.add('-ability', target, 'Toxic Chain');
                    }
                },
			},
			{
			chance: 100,
			volatileStatus: 'partiallytrapped',
			}
		],
		target: "normal",

	},
	matchagotcha: {
		num: 902,
		accuracy: 90,
		basePower: 80,
		type: "Grass",
		category: "Special",
		name: "Matcha Gotcha",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { drain: 1, heal: 1, protect: 1, mirror: 1, defrost: 1, metronome: 1 },
		drain: [1, 2],
		thawsTarget: true,
		secondary: { chance: 20, status: 'brn', },
		target: "allAdjacentFoes",

	},
	megadrain: {
		num: 72,
		accuracy: 100,
		basePower: 45,
		type: "Grass",
		category: "Special",
		name: "Mega Drain",
		pp: 30,
		priority: 0,
		critRatio: 4,
		flags: { drain: 1, heal: 1, protect: 1, mirror: 1, metronome: 1 },
		drain: [1, 2],
		secondary: null,
		target: "normal",
	},
	meteorbeam: {
		num: 800,
		accuracy: 90,
		basePower: 120,
		type: "Rock",
		category: "Special",
		name: "Meteor Beam",
		pp: 10,
		priority: 0,
		critRatio: 6,
		flags: { beam: 1, light: 1, charge: 1, protect: 1, mirror: 1, metronome: 1 },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) { return; }
			this.add('-prepare', attacker, move.name);
			this.boost({ spa: 1 }, attacker, attacker, move);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) { return; }
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		secondary: null,
		target: "normal",

	},
	mistball: {
		num: 296,
		accuracy: 100,
		basePower: 95,
		type: "Fairy",
		category: "Special",
		name: "Mist Ball",
		pp: 5,
		priority: 0,
		critRatio: 3,
		flags: { magic: 1,protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: { chance: 50, boosts: {spa: -1,}, },
		target: "normal",
	},
	mistyexplosion: {
		num: 802,
		accuracy: 100,
		basePower: 270,
		type: "Fairy",
		category: "Special",
		name: "Misty Explosion",
		pp: 5,
		priority: 0,
		critRatio: 12,
		flags: { explosive: 1,protect: 1, mirror: 1, metronome: 1 },
		selfdestruct: "always",
		onBasePower(basePower, source) {
			if (this.field.isTerrain('mistyterrain') && source.isGrounded()) {
				this.debug('misty terrain boost');
				return this.chainModify(1.5);
			}
		},
		secondary: null,
		target: "allAdjacent",

	},
	moonblast: {
		num: 585,
		accuracy: 100,
		basePower: 95,
		type: "Fairy",
		category: "Special",
		name: "Moonblast",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { lunar: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, boosts: {spa: -1,}, },
		target: "normal",
	},
	moongeistbeam: {
		num: 714,
		accuracy: 100,
		basePower: 100,
		type: "Ghost",
		category: "Special",
		name: "Moongeist Beam",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { beam: 1, light: 1, protect: 1, mirror: 1 },
		ignoreAbility: true,
		secondary: null,
		target: "normal",
	},
	muddywater: {
		num: 330,
		accuracy: 85,
		basePower: 100,
		type: "Water",
		type2: "Ground",
		category: "Special",
		name: "Muddy Water",
		pp: 10,
		priority: 0,
		critRatio: 0,
		flags: { protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: { chance: 30, boosts: {accuracy: -1,}, },
		target: "allAdjacentFoes",
	},
	mudshot: {
		num: 341,
		accuracy: 95,
		basePower: 70,
		type: "Ground",
		type2: "Water",
		category: "Special",
		name: "Mud Shot",
		pp: 15,
		priority: 0,
		critRatio: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, boosts: {spe: -1,}, },
		target: "normal",
	},
	mudslap: {
		num: 189,
		accuracy: 85,
		basePower: 45,
		type: "Ground",
		type2: "Water",
		category: "Special",
		name: "Mud-Slap",
		pp: 10,
		priority: 0,
		critRatio: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, boosts: {accuracy: -1,}, },
		target: "normal",
	},
	mudslide: {
		num: 330,
		accuracy: 90,
		basePower: 85,
		type: "Water",
		type2: "Ground",
		category: "Special",
		name: "Muddy Water",
		pp: 10,
		priority: 0,
		critRatio: 0,
		flags: { sweep: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		onEffectiveness(typeMod, target, type) { if (type === 'Grass') return 1; },
		secondary: { chance: 30, boosts: {accuracy: -1,}, },
		onHit(target, source, move) {
			   
			   const battle = source.battle;
			   const targetAction = battle.queue.willMove(target);
			   let targetPriority = 0;
			   if (targetAction && targetAction.move) { targetPriority = battle.dex.moves.get(targetAction.move.id).priority || 0; }
			   const userMovePriority = move.priority || 0;
			   if (targetPriority < userMovePriority) { if (target.addVolatile('tripped')) { this.add('-start', target, 'tripped'); } }
		   },
		target: "allAdjacentFoes",
	},
	mysticalfire: {
		num: 595,
		accuracy: 100,
		basePower: 75,
		type: "Fire",
		category: "Special",
		name: "Mystical Fire",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { magic: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, boosts: {spa: -1,}, },
		target: "normal",
	},
	mysticalpower: {
		num: 832,
		accuracy: 100,
		basePower: 90,
		type: "Psychic",
		category: "Special",
		name: "Mystical Power",
		pp: 10,
		priority: 0,
		critRatio: 2,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, self: {boosts: {spa: 1,},}, },
		target: "normal",

	},
	nightdaze: {
		num: 539,
		accuracy: 100,
		basePower: 90,
		type: "Dark",
		category: "Special",
		name: "Night Daze",
		pp: 10,
		priority: 0,
		critRatio: 6,
		flags: { pulse: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 20, status: 'fear' },
		onHit(target, source, move) { target.addVolatile('nightdaze'); },
		target: "normal",
	},
	nightshade: {
		num: 101,
		accuracy: 100,
		basePower: 0,
		damage: 'level',
		type: "Ghost",
		category: "Special",
		name: "Night Shade",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	originpulse: {
		num: 618,
		accuracy: 85,
		basePower: 110,
		type: "Water",
		category: "Special",
		name: "Origin Pulse",
		pp: 10,
		priority: 0,
		critRatio: 2,
		flags: { protect: 1, mirror: 1, pulse: 1 },
		target: "allAdjacentFoes",
	},
	overdrive: {
		num: 786,
		accuracy: 100,
		basePower: 95,
		type: "Electric",
		category: "Special",
		name: "Overdrive",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		secondary: null,
		target: "allAdjacentFoes",

	},
	overheat: {
		num: 315,
		accuracy: 90,
		basePower: 130,
		type: "Fire",
		category: "Special",
		name: "Overheat",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		self: {boosts: {spa: -2,},},
		secondary: null,
		target: "normal",
	},
	paraboliccharge: {
		num: 570,
		accuracy: 100,
		basePower: 45,
		type: "Electric",
		category: "Special",
		name: "Parabolic Charge",
		pp: 20,
		priority: 0,
		critRatio: 4,
		flags: { drain: 1, heal: 1, protect: 1, mirror: 1, metronome: 1 },
		drain: [1, 2],
		secondary: null,
		target: "allAdjacent",
	},
	petaldance: {
		num: 80,
		accuracy: 100,
		basePower: 130,
		type: "Grass",
		category: "Special",
		name: "Petal Dance",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, protect: 1, mirror: 1, dance: 1, metronome: 1, failinstruct: 1 },
		self: {volatileStatus: 'lockedmove',},
		secondary: null,
		target: "randomNormal",
	},
	photongeyser: {
		num: 722,
		accuracy: 100,
		basePower: 100,
		type: "Psychic",
		category: "Special",
		name: "Photon Geyser",
		pp: 5,
		priority: 0,
		critRatio: 3,
		flags: { light: 1, protect: 1, mirror: 1 },
		onModifyMove(move, pokemon) { if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical'; },
		ignoreAbility: true,
		secondary: null,
		target: "normal",
	},
	pollenpuff: {
		num: 676,
		accuracy: 100,
		basePower: 90,
		type: "Bug",
		category: "Special",
		name: "Pollen Puff",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, allyanim: 1, metronome: 1, bullet: 1 },
		onTryHit(target, source, move) {
			if (source.isAlly(target)) {
				move.basePower = 0;
				move.infiltrates = true;
			}
		},
		onTryMove(source, target, move) {
			if (source.isAlly(target) && source.volatiles['healblock']) {
				this.attrLastMove('[still]');
				this.add('cant', source, 'move: Heal Block', move);
				return false;
			}
		},
		onHit(target, source, move) { if (source.isAlly(target)) { if (!this.heal(Math.floor(target.baseMaxhp * 0.5))) { return this.NOT_FAIL; } } },
		secondary: null,
		target: "normal",
	},
	powdersnow: {
		num: 181,
		accuracy: 100,
		basePower: 40,
		type: "Ice",
		category: "Special",
		name: "Powder Snow",
		pp: 25,
		priority: 0,
		critRatio: 1,
		flags: { powder: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 50, status: 'frostbite',
		},
		target: "allAdjacentFoes",
	},
	powergem: {
		num: 408,
		accuracy: 100,
		basePower: 80,
		type: "Rock",
		category: "Special",
		name: "Power Gem",
		pp: 20,
		priority: 0,
		critRatio: 6,
		flags: { beam: 1, light: 1, magic: 1, protect: 1, mirror: 1, metronome: 1 },
        secondary: { chance: 10, self: {boosts: {spa: 1,},}, },
		target: "normal",
	},
	prismaticlaser: {
		num: 711,
		accuracy: 100,
		basePower: 160,
		type: "Psychic",
		category: "Special",
		name: "Prismatic Laser",
		pp: 5,
		priority: 0,
		critRatio: 3,
		flags: { light: 1, cantusetwice: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	psybeam: {
		num: 60,
		accuracy: 100,
		basePower: 85,
		type: "Psychic",
		category: "Special",
		name: "Psybeam",
		pp: 20,
		priority: 0,
		critRatio: 1,
		flags: { beam: 1, light: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 20, volatileStatus: 'confusion', },
		target: "normal",
	},
	psychic: {
		num: 94,
		accuracy: 100,
		basePower: 90,
		type: "Psychic",
		category: "Special",
		name: "Psychic",
		pp: 10,
		priority: 0,
		critRatio: 1,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 10, boosts: {spd: -1,}, },
		target: "normal",
	},
	psychicnoise: {
		num: 917,
		accuracy: 100,
		basePower: 75,
		type: "Psychic",
		category: "Special",
		name: "Psychic Noise",
		pp: 10,
		priority: 0,
		critRatio: 1,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		secondary: { chance: 100, volatileStatus: 'healblock', },
		target: "normal",

	},
	psychoboost: {
		num: 354,
		accuracy: 90,
		basePower: 140,
		type: "Psychic",
		category: "Special",
		name: "Psycho Boost",
		pp: 5,
		priority: 0,
		critRatio: 2,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		self: {boosts: {spa: -2,},},
		secondary: null,
		target: "normal",
	},
	psyshock: {
		num: 473,
		accuracy: 100,
		basePower: 80,
		type: "Psychic",
		category: "Special",
		overrideDefensiveStat: 'def',
		name: "Psyshock",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	psystrike: {
		num: 540,
		accuracy: 100,
		basePower: 110,
		type: "Psychic",
		category: "Special",
		overrideDefensiveStat: 'def',
		name: "Psystrike",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { protect: 1, mirror: 1, metronome: 1 },
        secondary: { chance: 20, boosts: {def: -1,}, },
		target: "normal",
	},
	relicsong: {
		num: 547,
		accuracy: 100,
		basePower: 140,
		type: "Normal",
		category: "Special",
		name: "Relic Song",
		pp: 10,
		priority: 0,
		critRatio: 1,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		secondary: { chance: 100, status: 'drowsy', },
		onHit(target, pokemon, move) { if (pokemon.baseSpecies.baseSpecies === 'Meloetta' && !pokemon.transformed) { move.willChangeForme = true; } },
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (move.willChangeForme) {
				const meloettaForme = pokemon.species.id === 'meloettapirouette' ? '' : '-Pirouette';
				pokemon.formeChange('Meloetta' + meloettaForme, this.effect, false, '0', '[msg]');
			}
		},
		target: "allAdjacentFoes",
	},
	revelationdance: {
		num: 686,
		accuracy: 100,
		basePower: 90,
		type: "Normal",
		category: "Special",
		name: "Revelation Dance",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, dance: 1, metronome: 1 },
		onModifyType(move, pokemon) {
			const types = pokemon.getTypes();
			let type = types[0];
			if (type === 'Bird') type = '???';
			if (type === '???' && types[1]) type = types[1];
			move.type = type;
		},
		onModifyMove(move, pokemon) {
			if (pokemon.hasType(['Bug', 'Dark', 'Dragon', 'Rock'])) { move.critRatio = (move.critRatio || 1) + 1; } 
			else if (pokemon.hasType(['Ground', 'Normal', 'Psychic', 'Water'])) { move.critRatio = Math.max((move.critRatio || 1) - 1, 0); }
		},
		secondary: null,
		target: "normal",
	},
	risingvoltage: {
		num: 804,
		accuracy: 100,
		basePower: 70,
		basePowerCallback(source, target, move) {
			if (this.field.isTerrain('electricterrain') && target.isGrounded()) {
				if (!source.isAlly(target)) this.hint(`${move.name}'s BP doubled on grounded target.`);
				return move.basePower * 2;
			}
			return move.basePower;
		},
		type: "Electric",
		category: "Special",
		name: "Rising Voltage",
		pp: 20,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	roaroftime: {
		num: 459,
		accuracy: 90,
		basePower: 150,
		type: "Dragon",
		category: "Special",
		name: "Roar of Time",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { beam: 1, sound: 1, cantusetwice: 1, protect: 1, mirror: 1, metronome: 1 },
		pseudoWeather: 'trickroom',
		condition: {
			duration: 2,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Trick Room');
					return 4;
				}
				return 2;
			},
			onFieldStart(target, source) {
				if (source?.hasAbility('persistent')) { this.add('-fieldstart', 'move: Trick Room', `[of] ${source}`, '[persistent]'); } 
				else { this.add('-fieldstart', 'move: Trick Room', `[of] ${source}`);}
			},
			onFieldRestart(target, source) { this.field.removePseudoWeather('trickroom'); },
			// Speed modification is changed in Pokemon.getActionSpeed() in sim/pokemon.js
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 1,
			onFieldEnd() { this.add('-fieldend', 'move: Trick Room'); },
		},
		secondary: null,
		target: "normal",
	},
	rootburst: {
		num: 4002,
		accuracy: 100,
		basePower: 75,
		type: "Grass",
		category: "Special",
		name: "Rootburst",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		onEffectiveness(typeMod, target, type) { if (type === 'Steel') { return 1; } },
		onPrepareHit(target, source, move) { this.attrLastMove('[anim] Frenzy Plant'); },
		target: "normal",
	},
	ruination: {
		num: 877,
		accuracy: 90,
		basePower: 0,
		damageCallback(pokemon, target) { return this.clampIntRange(Math.floor(target.getUndynamaxedHP() / 2), 1); },
		type: "Dark",
		category: "Special",
		name: "Ruination",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
	},
	sandsearstorm: {
		num: 848,
		accuracy: 80,
		basePower: 100,
		type: "Ground",
		category: "Special",
		name: "Sandsear Storm",
		pp: 10,
		priority: 0,
		critRatio: 2,
		flags: { magic: 1, wind: 1, protect: 1, mirror: 1, metronome: 1, },
		onModifyMove(move, pokemon, target) { if (target && ['raindance', 'primordialsea', 'sandstorm'].includes(target.effectiveWeather())) { move.accuracy = true; } },
		secondary: { chance: 20, status: 'brn', },
		target: "allAdjacentFoes",

	},
	scald: {
		num: 503,
		accuracy: 100,
		basePower: 45,
		type: "Water",
		category: "Special",
		name: "Scald",
		pp: 15,
		priority: 0,
		critRatio: 2,
		flags: { beam: 1, protect: 1, mirror: 1, defrost: 1, metronome: 1 },
		thawsTarget: true,
		secondary: { chance: 30, status: 'brn', },
		onEffectiveness(typeMod, target, type) { if (type === 'Ice') return 1; },
		target: "normal",
	},
	scorchingsands: {
		num: 815,
		accuracy: 90,
		basePower: 80,
		type: "Ground",
		category: "Special",
		name: "Scorching Sands",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { protect: 1, mirror: 1, defrost: 1, metronome: 1 },
		thawsTarget: true,
		secondary: { chance: 30, status: 'brn', },
		target: "normal",

	},
	secretsword: {
		num: 548,
		accuracy: 100,
		basePower: 85,
		type: "Fighting",
		category: "Special",
		overrideDefensiveStat: 'def',
		name: "Secret Sword",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { protect: 1, mirror: 1, slicing: 1 },
		secondary: null,
		target: "normal",
	},
	seedflare: {
		num: 465,
		accuracy: 85,
		basePower: 120,
		type: "Grass",
		category: "Special",
		name: "Seed Flare",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { explosive: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 40, boosts: {spd: -2,}, },
		target: "normal",
	},
	shadowball: {
		num: 247,
		accuracy: 100,
		basePower: 80,
		type: "Ghost",
		category: "Special",
		name: "Shadow Ball",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { bullet: 1, shadow: 1, protect: 1, mirror: 1, metronome: 1, },
		secondary: { chance: 20, boosts: {spd: -1,}, },
		target: "normal",
	},
	shellsidearm: {
		num: 801,
		accuracy: 100,
		basePower: 110,
		type: "Poison",
		category: "Special",
		name: "Shell Side Arm",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { weapon: 1, protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, source, move) { if (!source.isAlly(target)) { this.attrLastMove('[anim] Shell Side Arm ' + move.category); } },
		onModifyMove(move, pokemon, target) {
			if (!target) return;
			const atk = pokemon.getStat('atk', false, true);
			const spa = pokemon.getStat('spa', false, true);
			const def = target.getStat('def', false, true);
			const spd = target.getStat('spd', false, true);
			const physical = Math.floor(Math.floor(Math.floor(Math.floor(2 * pokemon.level / 5 + 2) * 90 * atk) / def) / 50);
			const special = Math.floor(Math.floor(Math.floor(Math.floor(2 * pokemon.level / 5 + 2) * 90 * spa) / spd) / 50);
			if (physical > special || (physical === special && this.randomChance(1, 2))) {
				move.category = 'Physical';
				move.flags.contact = 1;
			}
		},
		onHit(target, source, move) { if (!source.isAlly(target)) this.hint(move.category + " Shell Side Arm"); },	// Shell Side Arm normally reveals its category via animation on cart, but doesn't play either custom animation against allies
		onAfterSubDamage(damage, target, source, move) { if (!source.isAlly(target)) this.hint(move.category + " Shell Side Arm"); },
		secondary: { chance: 20, status: 'psn',  },
		target: "normal",

	},
	shockwave: {
		num: 351,
		accuracy: true,
		basePower: 60,
		type: "Electric",
		category: "Special",
		name: "Shock Wave",
		pp: 20,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onBasePower(basePower, pokemon) { if (pokemon.volatiles['charge']) { return this.chainModify(1.77); } },
		secondary: null,
		target: "normal",
	},
	shortcircuit: {
		num: 4003,
		accuracy: 100,
		basePower: 120,
		type: "Electric",
		category: "Special",
		name: "Short Circuit",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { contact: 1, crash: 1, protect: 1, mirror: 1, metronome: 1 },
		recoil: [1, 4],
		onTry(source, target, move) {
			if (!source.hasType('Electric')) {
				this.add('-fail', source, 'move: Short Circuit');
				return false;
			}
		},
		onPrepareHit(target, source, move) { this.attrLastMove('[anim] Wild Charge'); },
		onEffectiveness(typeMod, target, type) { if (type === 'Electric') { return 1; } },
		onHit(target, source, move) {
			if (target.hasType('Electric') || target.hasType('Steel')) {
				if (target.hasType('Electric')) {
					target.setType(target.getTypes(true).filter(t => t !== 'Electric'));
					this.add('-message', `${target.name} short circuited, losing their Electric type!`);
				}
				if (source.hasType('Electric')) {
					source.setType(source.getTypes(true).filter(t => t !== 'Electric'));
					this.add('-message', `${source.name} short circuited, losing their Electric type!`);
				}
			}
		},
		secondary: null,
		target: "normal",
	},
	signalbeam: {
		num: 324,
		accuracy: 100,
		basePower: 82,
		type: "Bug",
		category: "Special",
		name: "Signal Beam",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { beam: 1, light: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 10, volatileStatus: 'confusion', },
		onHit(target, source, move) {
			if (target.status === 'aura' && target.statusState && target.statusState.duration) {
				target.statusState.duration = Math.ceil(target.statusState.duration / 2);
				this.add('-message', `${target.name}'s aura was disrupted by Signal Beam!`);
			}
		},
		target: "normal",
	},
	sludge: {
		num: 124,
		accuracy: 100,
		basePower: 65,
		type: "Poison",
		category: "Special",
		name: "Sludge",
		pp: 20,
		priority: 0,
		critRatio: 3,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, status: 'psn', },
		target: "normal",
	},
	sludgebomb: {
		num: 188,
		accuracy: 100,
		basePower: 90,
		type: "Poison",
		category: "Special",
		name: "Sludge Bomb",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { bomb: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, status: 'psn', },
		target: "normal",
	},
	sludgewave: {
		num: 482,
		accuracy: 100,
		basePower: 95,
		type: "Poison",
		category: "Special",
		name: "Sludge Wave",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { pulse: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 10, status: 'psn', },
		target: "allAdjacent",
	},
	smog: {
		num: 123,
		accuracy: 90,
		basePower: 40,
		type: "Poison",
		category: "Special",
		name: "Smog",
		pp: 20,
		priority: 0,
		critRatio: 3,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 40, status: 'psn', },
		target: "allAdjacentFoes",
	},
	snarl: {
		num: 555,
		accuracy: 95,
		basePower: 55,
		type: "Dark",
		category: "Special",
		name: "Snarl",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		secondary: { chance: 100, boosts: {spa: -1,}, },
		target: "allAdjacentFoes",
	},
	snipeshot: {
		num: 745,
		accuracy: 100,
		basePower: 95,
		type: "Water",
		category: "Special",
		name: "Snipe Shot",
		pp: 15,
		priority: 0,
		critRatio: 9,
		flags: { pierce: 1, protect: 1, mirror: 1, metronome: 1 },
		pierce2: true,
		tracksTarget: true,
		secondary: null,
		target: "normal",

	},
	snore: {
		num: 173,
		accuracy: 100,
		basePower: 135,
		type: "Normal",
		category: "Special",
		name: "Snore",
		pp: 15,
		priority: 0,
		critRatio: 1,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		sleepUsable: true,
		onTry(source) { return source.status === 'slp' || source.hasAbility('comatose'); },
		secondary: { chance: 30, volatileStatus: 'flinch', },
		target: "normal",
	},
	solarbeam: {
		num: 76,
		accuracy: 100,
		basePower: 120,
		type: "Grass",
		category: "Special",
		name: "Solar Beam",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { beam: 1, light: 1, solar: 1, charge: 1, protect: 1, mirror: 1, metronome: 1, nosleeptalk: 1, failinstruct: 1 },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) { return; }
			this.add('-prepare', attacker, move.name);
			if (['sunnyday', 'desolateland'].includes(attacker.effectiveWeather())) {
				this.attrLastMove('[still]');
				this.addMove('-anim', attacker, move.name, defender);
				return;
			}
			if (!this.runEvent('ChargeMove', attacker, defender, move)) { return; }
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		onBasePower(basePower, pokemon, target) {
			const weakWeathers = ['raindance', 'primordialsea', 'sandstorm', 'hail', 'snowscape'];
			if (weakWeathers.includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
		secondary: null,
		target: "normal",
	},
	spacialrend: {
		num: 460,
		accuracy: 65,
		basePower: 100,
		type: "Dragon",
		category: "Special",
		name: "Spacial Rend",
		pp: 5,
		priority: 0,
		critRatio: 11,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onAfterMove(source, target, move) {
			if (!move.hasSheerForce && source.side.foe) {
				const foeSide = source.side.foe;
				const foeActive = foeSide.active.filter(p => p && !p.fainted);
				if (foeActive.length === 2) {
					const [pos1, pos2] = foeActive.map(p => p.position);
					this.swapPosition(foeActive[0], pos2);
					this.swapPosition(foeActive[1], pos1);
					this.add('-message', `The tear in space swapped ${foeActive[0].name} and ${foeActive[1].name}'s positions!`);
				}
			}
		},
		secondary: null,
		target: "normal",
	},
	sparklingaria: {
		num: 664,
		accuracy: 100,
		basePower: 90,
		type: "Water",
		type2: "Fairy",
		category: "Special",
		name: "Sparkling Aria",
		pp: 10,
		priority: 0,
		critRatio: 0,
		flags: { magic: 1, sound: 1, protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		secondary: { chance: 100, volatileStatus: 'sparklingaria', },
		onAfterMove(source, target, move) {
			if (source.fainted || !move.hitTargets || move.hasSheerForce) {
				// make sure the volatiles are cleared
				for (const pokemon of this.getAllActive()) delete pokemon.volatiles['sparklingaria'];
				return;
			}
			const numberTargets = move.hitTargets.length;
			for (const pokemon of move.hitTargets) {
				// bypasses Shield Dust when hitting multiple targets
				if (pokemon !== source && pokemon.isActive && (pokemon.removeVolatile('sparklingaria') || numberTargets > 1) &&
					pokemon.status === 'brn') { pokemon.cureStatus(); }
			}
		},
		target: "allAdjacent",
	},
	spicyextract: {
		num: 858,
		accuracy: 100,
		basePower: 60,
		type: "Grass",
		type2: "Fire",
		category: "Special",
		name: "Spicy Extract",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		secondaries: [
        	{ chance: 20, status: 'brn', },
			{ chance: 100, boosts: { atk: -1, spd: -2 }, },
		],
		target: "normal",

	},
	spitup: {
		num: 255,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon) {
			if (!pokemon.volatiles['stockpile']?.layers) return false;
			return pokemon.volatiles['stockpile'].layers * 100;
		},
		type: "Normal",
		category: "Special",
		name: "Spit Up",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { protect: 1, metronome: 1 },
		onTry(source) {
			return !!source.volatiles['stockpile'];
		},
		onAfterMove(pokemon) {
			if (pokemon.volatiles['stockpile']?.layers) {
				pokemon.volatiles['stockpile'].layers--;
				if (pokemon.volatiles['stockpile'].layers <= 0) { pokemon.removeVolatile('stockpile'); }
			}
		},
		secondary: null,
		target: "normal",
	},
	springtidestorm: {
		num: 831,
		accuracy: 80,
		onTryHit(target, source, move) { if (this.field.isTerrain('mistyterrain') || this.field.pseudoWeather['turbulentwinds']) { move.accuracy = true; } },
		basePower: 100,
		type: "Fairy",
		category: "Special",
		name: "Springtide Storm",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { magic: 1, wind: 1, protect: 1, mirror: 1 },
		secondary: { chance: 30, boosts: {atk: -1,}, },
		target: "allAdjacentFoes",
	},
	steameruption: {
		num: 592,
		accuracy: 95,
		basePower: 110,
		type: "Water",
		type2: "Fire",
		category: "Special",
		name: "Steam Eruption",
		pp: 5,
		priority: 0,
		critRatio: 3,
		flags: { beam: 1, protect: 1, mirror: 1, defrost: 1 },
		thawsTarget: true,
		secondary: { chance: 30, status: 'brn', },
		target: "normal",
	},
	steelbeam: {
		num: 796,
		accuracy: 95,
		basePower: 140,
		type: "Steel",
		category: "Special",
		name: "Steel Beam",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { beam: 1, protect: 1, mirror: 1 },
		mindBlownRecoil: true,
		onAfterMove(pokemon, target, move) {
			if (move.mindBlownRecoil && !move.multihit) {
				const hpBeforeRecoil = pokemon.hp;
				this.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get('Steel Beam'), true);
				if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) { this.runEvent('EmergencyExit', pokemon, pokemon); }
			}
		},
		secondary: null,
		target: "normal",
	},
	storedpower: {
		num: 500,
		accuracy: 100,
		basePower: 20,
		basePowerCallback(pokemon, target, move) {
			const bp = move.basePower + 20 * pokemon.positiveBoosts();
			this.debug(`BP: ${bp}`);
			return bp;
		},
		type: "Psychic",
		category: "Special",
		name: "Stored Power",
		pp: 10,
		priority: 0,
		critRatio: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	strangesteam: {
		num: 790,
		accuracy: 95,
		basePower: 90,
		type: "Fairy",
		category: "Special",
		name: "Strange Steam",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { breath: 1, magic: 1, protect: 1, mirror: 1 },
		secondaries: [
			{ chance: 20, volatileStatus: 'confusion', },
			{ chance: 100, volatileStatus: 'magicdust', },
		],
		target: "normal",
	},
	strugglebug: {
		num: 522,
		accuracy: 100,
		basePower: 60,
		type: "Bug",
		category: "Special",
		name: "Struggle Bug",
		pp: 20,
		priority: 0,
		critRatio: 5,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, boosts: {spa: -1,}, },
		target: "allAdjacentFoes",
	},
	surf: {
		num: 57,
		accuracy: 100,
		basePower: 95,
		type: "Water",
		category: "Special",
		name: "Surf",
		pp: 15,
		priority: 0,
		critRatio: 2,
		flags: { sweep: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: null,
		onHit(target, source, move) {
			if ((target.hasAbility && target.hasAbility('bubblefoam')) || target.status === 'bubbleblight') {
				if (target.addVolatile('tripped')) { this.add('-start', target, 'tripped'); }
				return;
				}
			const battle = source.battle;
			const targetAction = battle.queue.willMove(target);
			let targetPriority = 0;
			if (targetAction && targetAction.move) { targetPriority = battle.dex.moves.get(targetAction.move.id).priority || 0; }
			const userMovePriority = move.priority || 0;
			if (targetPriority < userMovePriority) { if (target.addVolatile('tripped')) { this.add('-start', target, 'tripped'); } }
		},
		target: "allAdjacent",
        onModifyType(move, pokemon, target) { if (pokemon.battle.field.isTerrain('toxicterrain')) { move.type2 = 'Poison'; } },
	},
	swift: {
		num: 129,
		accuracy: true,
		basePower: 60,
		type: "Normal",
		category: "Special",
		name: "Swift",
		pp: 20,
		priority: 3,
		critRatio: 2,
		flags: { magic: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacentFoes",
	},
	syrupbomb: {
		num: 903,
		accuracy: 85,
		basePower: 85,
		type: "Grass",
		category: "Special",
		name: "Syrup Bomb",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { bomb: 1, protect: 1, mirror: 1, metronome: 1 },
		condition: {
			noCopy: true,
			duration: 4,
			onStart(pokemon) { this.add('-start', pokemon, 'Syrup Bomb'); },
			onUpdate(pokemon) { if (this.effectState.source && !this.effectState.source.isActive) { pokemon.removeVolatile('syrupbomb'); } },
			onResidualOrder: 14,
			onResidual(pokemon) { this.boost({ spe: -1 }, pokemon, this.effectState.source); },
			onEnd(pokemon) { this.add('-end', pokemon, 'Syrup Bomb', '[silent]'); },
		},
		secondary: { chance: 100, volatileStatus: 'syrupbomb', },
		target: "normal",

	},
	tachyoncutter: {
		num: 911,
		accuracy: true,
		basePower: 50,
		type: "Steel",
		category: "Special",
		name: "Tachyon Cutter",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		multihit: 2,
		secondary: null,
		target: "normal",
	},
	terablast: {
		num: 851,
		accuracy: 100,
		basePower: 60,
		basePowerCallback(pokemon, target, move) {
			if (pokemon.terastallized === 'Stellar') { return 80; }
			return move.basePower;
		},
		type: "banal",
		category: "Special",
		name: "Tera Blast",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { protect: 1, mirror: 1, metronome: 1, mustpressure: 1 },
		onPrepareHit(target, source, move) { if (source.terastallized) { this.attrLastMove('[anim] Tera Blast ' + source.teraType); } },
		onModifyType(move, pokemon, target) { if (pokemon.terastallized) { move.type = pokemon.teraType; } },
		onModifyMove(move, pokemon) {
			if (pokemon.terastallized && pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) { move.category = 'Physical'; }
			if (pokemon.terastallized) {
			const typeFlags: {[key: string]: string[]} = {
				'Dark': ['aura'],
				'Dragon': ['breath'],
				'Fairy': ['explosive'],
				'Fighting': ['punch'],
				'Fire': ['breath'],
				'Flying': ['wind'],
				'Grass': ['beam', 'light'],
				'Ground': ['explosive'],
				'Normal': ['beam', 'light'],
			};
			const flags = typeFlags[pokemon.teraType];
			if (flags) { for (const flag of flags) { (move.flags as any)[flag] = 1; } }
			}
			if (pokemon.hasType(['Bug', 'Dark', 'Dragon', 'Rock', 'Stellar'])) { move.critRatio = 5; } 
			else if (pokemon.hasType(['Ground', 'Normal', 'Psychic', 'Water', 'banal'])) { move.critRatio = 3; }
			else { move.critRatio = 4; }
		},
		secondary: null,
		target: "normal",

	},
	terastarstorm: {
		num: 906,
		accuracy: 100,
		basePower: 130,
		type: "Stellar",
		category: "Special",
		name: "Tera Starstorm",
		pp: 5,
		priority: 0,
		critRatio: 5,
		flags: { protect: 1, mirror: 1, noassist: 1, failcopycat: 1, failmimic: 1, nosketch: 1 },
		onModifyType(move, pokemon) { if (pokemon.species.name === 'Terapagos-Stellar') { if (pokemon.terastallized && pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) { move.category = 'Physical'; } } },
		onModifyMove(move, pokemon) { if (pokemon.species.name === 'Terapagos-Stellar') { move.target = 'allAdjacentFoes'; } },
		secondary: null,
		target: "normal",

	},
	terrainpulse: {
		num: 805,
		accuracy: 100,
		basePower: 50,
		type: "Normal",
		category: "Special",
		name: "Terrain Pulse",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { beam: 1, pulse: 1, protect: 1, mirror: 1, metronome: 1 },
		onModifyType(move, pokemon) {
			if (!pokemon.isGrounded()) return;
			switch (this.field.terrain) {
			case 'electricterrain':
				move.type = 'Electric';
				break;
			case 'grassyterrain':
				move.type = 'Grass';
				break;
			case 'mistyterrain':
				move.type = 'Fairy';
				break;
			case 'psychicterrain':
				move.type = 'Psychic';
				break;
			case 'toxicterrain':
				move.type = 'Poison';
				break;
			}
		},
		onModifyMove(move, pokemon) {
			if (this.field.terrain && pokemon.isGrounded()) {
				move.basePower *= 2;
				this.debug('BP doubled in Terrain');
			}
		},
		secondary: null,
		target: "normal",
	},
	thunder: {
		num: 87,
		accuracy: 70,
		basePower: 110,
		type: "Electric",
		category: "Special",
		name: "Thunder",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onModifyMove(move, pokemon, target) {
			switch (target?.effectiveWeather()) {
			case 'raindance':
			case 'primordialsea':
			case 'hail':
				move.accuracy = true;
				break;
			case 'sandstorm':
			case 'sunnyday':
			case 'desolateland':
				move.accuracy = 50;
				break;
			}
		},
		secondary: { chance: 30, status: 'par', },
		target: "normal",
	},
	thunderbolt: {
		num: 85,
		accuracy: 100,
		basePower: 90,
		type: "Electric",
		category: "Special",
		name: "Thunderbolt",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 10, status: 'par', },
		target: "normal",
	},
	thundercage: {
		num: 819,
		accuracy: 90,
		basePower: 80,
		type: "Electric",
		category: "Special",
		name: "Thunder Cage",
		pp: 15,
		priority: 0,
		critRatio: 4,
		flags: { binding: 1, protect: 1, mirror: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: { chance: 100, boosts: {spe: -1,}, },
		target: "normal",

	},
	thunderclap: {
		num: 909,
		accuracy: 100,
		basePower: 70,
		type: "Electric",
		category: "Special",
		name: "Thunderclap",
		pp: 5,
		priority: 2,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTry(source, target) {
			const action = this.queue.willMove(target);
			const move = action?.choice === 'move' ? action.move : null;
			if (!move || (move.category === 'Status' && move.id !== 'mefirst') || target.volatiles['mustrecharge']) { return false; }
		},
		secondary: null,
		target: "normal",
	},
	thundershock: {
		num: 84,
		accuracy: 100,
		basePower: 40,
		type: "Electric",
		category: "Special",
		name: "Thunder Shock",
		pp: 30,
		priority: 0,
		critRatio: 4,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 10, status: 'par', },
		target: "normal",
	},
	torchsong: {
		num: 871,
		accuracy: 100,
		basePower: 80,
		type: "Fire",
		category: "Special",
		name: "Torch Song",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { aura: 1, sound: 1, protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		secondary: { chance: 100, self: {boosts: {spa: 1,},}, },
		target: "normal",
	},
	triattack: {
		num: 161,
		accuracy: 100,
		basePower: 33,
		type: "Normal",
		category: "Special",
		name: "Tri Attack",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { magic: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: 3,
		onModifyType(move, pokemon) {
			if (move.hit === 1) { move.type = 'Ice'; } 
			else if (move.hit === 2) { move.type = 'Fire'; } 
			else if (move.hit === 3) { move.type = 'Electric'; }
		},
		secondary: {
			chance: 10,
			onHit(target, source, move) {
				if (move.hit === 1) { target.trySetStatus('frostbite', source); } 
				else if (move.hit === 2) { target.trySetStatus('brn', source); } 
				else if (move.hit === 3) { target.trySetStatus('par', source); }
			},
		},
		target: "normal",
	},
	twinbeam: {
		num: 888,
		accuracy: 100,
		basePower: 52,
		type: "Psychic",
		category: "Special",
		name: "Twin Beam",
		pp: 10,
		priority: 0,
		critRatio: 2,
		flags: { beam: 1, light: 1, protect: 1, mirror: 1 },
		multihit: 2,
		secondary: null,
		target: "normal",
	},
	twister: {
		num: 239,
		accuracy: 70,
		basePower: 90,
		type: "Dragon",
		category: "Special",
		name: "Twister",
		pp: 20,
		priority: 0,
		critRatio: 5,
		flags: { protect: 1, mirror: 1, metronome: 1, wind: 1 },
		onModifyMove(move, pokemon, target) {
			switch (target?.effectiveWeather()) {
			case 'raindance':
			case 'primordialsea':
			case 'turbulentwinds':
			case 'deltastream':
				move.accuracy = true;
				break;
			case 'hail':
			case 'sunnyday':
			case 'desolateland':
				move.accuracy = 50;
				break;
			}
		},
		secondary: { chance: 20, volatileStatus: 'flinch', },
		target: "allAdjacentFoes",
	},
	uproar: {
		num: 253,
		accuracy: 100,
		basePower: 70,
		type: "Normal",
		category: "Special",
		name: "Uproar",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1, nosleeptalk: 1, failinstruct: 1 },
		self: {volatileStatus: 'uproar',},
		onBasePower(basePower, pokemon) {
			const uproar = pokemon.volatiles['uproar'];
			if (uproar && uproar.duration) {
				const turnsActive = 4 - uproar.duration;
				if (turnsActive === 1) { return this.chainModify(1.5); } 
				else if (turnsActive === 2) { return this.chainModify(2); }
			}
		},
		onTryHit(target) {
			const activeTeam = target.side.activeTeam();
			const foeActiveTeam = target.side.foe.activeTeam();
			for (const [i, allyActive] of activeTeam.entries()) {
				if (allyActive && allyActive.status === 'slp') allyActive.cureStatus();
				const foeActive = foeActiveTeam[i];
				if (foeActive && foeActive.status === 'slp') foeActive.cureStatus();
			}
		},
		condition: {
			duration: 3,
			onStart(target) { this.add('-start', target, 'Uproar'); },
			onResidual(target) {
				if (target.volatiles['throatchop']) {
					target.removeVolatile('uproar');
					return;
				}
				if (target.lastMove && target.lastMove.id === 'struggle') { delete target.volatiles['uproar']; }
				this.add('-start', target, 'Uproar', '[upkeep]');
			},
			onResidualOrder: 28,
			onResidualSubOrder: 1,
			onEnd(target) { this.add('-end', target, 'Uproar'); },
			onLockMove: 'uproar',
			onAnySetStatus(status, pokemon) {
				if (status.id === 'slp') {
					if (pokemon === this.effectState.target) { this.add('-fail', pokemon, 'slp', '[from] Uproar', '[msg]'); } 
					else { this.add('-fail', pokemon, 'slp', '[from] Uproar'); }
					return null;
				}
			},
		},
		secondary: null,
		target: "allAdjacentFoes",
	},
	vacuumwave: {
		num: 410,
		accuracy: 100,
		basePower: 40,
		type: "Fighting",
		category: "Special",
		name: "Vacuum Wave",
		pp: 30,
		priority: 1,
		critRatio: 4,
		flags: { pulse: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			onHit(target, source, move) { if (target.hasType('Flying')) { target.addVolatile('smackdown'); } },
		},
		target: "normal",
	},
	venoshock: {
		num: 474,
		accuracy: 100,
		basePower: 65,
		type: "Poison",
		category: "Special",
		name: "Venoshock",
		pp: 10,
		priority: 0,
		critRatio: 5,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onBasePower(basePower, pokemon, target) { if (target.status === 'psn' || target.status === 'tox') { return this.chainModify(2); } },
		secondary: null,
		target: "normal",
	},
	voltswitch: {
		num: 521,
		accuracy: 100,
		basePower: 70,
		type: "Electric",
		category: "Special",
		name: "Volt Switch",
		pp: 20,
		priority: 0,
		critRatio: 3,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		selfSwitch: true,
		secondary: null,
		target: "normal",
	},
	watergun: {
		num: 55,
		accuracy: 100,
		basePower: 40,
		type: "Water",
		category: "Special",
		name: "Water Gun",
		pp: 25,
		priority: 0,
		critRatio: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	
	waterpulse: {
		num: 352,
		accuracy: 100,
		basePower: 60,
		type: "Water",
		category: "Special",
		name: "Water Pulse",
		pp: 20,
		priority: 0,
		critRatio: 1,
		flags: { pulse: 1, protect: 1, mirror: 1, distance: 1, metronome: 1},
		secondary: { chance: 20, volatileStatus: 'confusion', },
		target: "any",
	},
	watershuriken: {
		num: 594,
		accuracy: 100,
		basePower: 25,
		basePowerCallback(pokemon, target, move) {
			if (pokemon.species.name === 'Greninja-Ash' && pokemon.hasAbility('battlebond') && !pokemon.transformed) { return move.basePower + 5; }
			return move.basePower;
		},
		type: "Water",
		category: "Special",
		name: "Water Shuriken",
		pp: 20,
		priority: 1,
		critRatio: 7,
		flags: { throw: 1, weapon: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: [3, 4],
		secondary: null,
		target: "normal",
	},
	waterspout: {
		num: 323,
		accuracy: 100,
		basePower: 150,
		basePowerCallback(pokemon, target, move) {
			const bp = move.basePower * pokemon.hp / pokemon.maxhp;
			this.debug(`BP: ${bp}`);
			return bp;
		},
		type: "Water",
		category: "Special",
		name: "Water Spout",
		pp: 5,
		priority: 0,
		critRatio: 1,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacentFoes",
	},
	weatherball: {
		num: 311,
		accuracy: 100,
		basePower: 50,
		type: "Normal",
		category: "Special",
		name: "Weather Ball",
		pp: 10,
		priority: 0,
		critRatio: 3,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		onModifyType(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.type = 'Fire';
				break;
			case 'raindance':
			case 'primordialsea':
				move.type = 'Water';
				break;
			case 'sandstorm':
				move.type = 'Rock';
				break;
			case 'hail':
			case 'snowscape':
				move.type = 'Ice';
				break;
			case 'turbulentwinds':
				move.type = 'Flying';
				break;
			}
		},
		onModifyMove(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.basePower *= 2;
				break;
			case 'raindance':
			case 'primordialsea':
				move.basePower *= 2;
				break;
			case 'sandstorm':
				move.basePower *= 2;
				break;
			case 'hail':
			case 'snowscape':
				move.basePower *= 2;
				break;
			}
			this.debug(`BP: ${move.basePower}`);
		},
		secondary: null,
		target: "normal",
	},
	whirlpool: {
		num: 250,
		accuracy: 90,
		basePower: 35,
		type: "Water",
		category: "Special",
		name: "Whirlpool",
		pp: 15,
		priority: 0,
		critRatio: 2,
		flags: { binding: 1, sweep: 1, protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: null,
		onHit(target, source, move) {
		    if ((target.hasAbility && target.hasAbility('bubblefoam')) || target.status === 'bubbleblight') {
				if (target.addVolatile('tripped')) { this.add('-start', target, 'tripped'); }
				return;
			}
		    const battle = source.battle;
		    const targetAction = battle.queue.willMove(target);
			let targetPriority = 0;
			if (targetAction && targetAction.move) { targetPriority = battle.dex.moves.get(targetAction.move.id).priority || 0; }
			const userMovePriority = move.priority || 0;
			if (targetPriority < userMovePriority) { if (target.addVolatile('tripped')) { this.add('-start', target, 'tripped'); } }
			// Sucked into the whirlpool - unable to act (Water types and Swift Swim users are immune)
			if (!target.hasType('Water') && !target.hasAbility('swiftswim')) {
				target.addVolatile('whirlpoolsuction');
				this.add('-message', `${target.name} was swept into the vortex!`);
			}
		},
		condition: {
			name: 'whirlpoolsuction',
			duration: 1,
			onBeforeMovePriority: 8,
			onBeforeMove(this: Battle, pokemon: Pokemon) {
				if (pokemon.volatiles['partiallytrapped']) {
					this.add('-message', `${pokemon.name} is swirling around the vortex.`);
					this.add('cant', pokemon, 'whirlpoolsuction');
					return false;
				} else { pokemon.removeVolatile('whirlpoolsuction'); }
			},
		},
		target: "allAdjacentFoes",
	},
	wildboltstorm: {
		num: 847,
		accuracy: 80,
		basePower: 100,
		type: "Electric",
		category: "Special",
		name: "Wildbolt Storm",
		pp: 10,
		priority: 0,
		critRatio: 4,
		flags: { magic: 1, protect: 1, mirror: 1, metronome: 1, wind: 1 },
		onModifyMove(move, pokemon, target) {
			if (target && ['raindance', 'primordialsea'].includes(target.effectiveWeather())) { move.accuracy = true; }
			if (this.field.isTerrain('electricterrain')) { move.accuracy = true; }
		},
		secondary: { chance: 20, status: 'par', },
		target: "allAdjacentFoes",

	},
	zapcannon: {
		num: 192,
		accuracy: 70,
		basePower: 120,
		type: "Electric",
		category: "Special",
		name: "Zap Cannon",
		pp: 5,
		priority: 0,
		critRatio: 4,
		flags: { bullet: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 50, status: 'par', },
		target: "normal",
	},

	//#region STATUS MOVES
	acidarmor: {
		num: 151,
		accuracy: true,
		basePower: 0,
		type: "Poison",
		category: "Status",
		name: "Acid Armor",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {def: 2,},
		secondary: null,
		target: "self",
	},
	acupressure: {
		num: 367,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Acupressure",
		pp: 30,
		priority: 0,
		flags: { metronome: 1 },
		onHit(target) {
			const stats: BoostID[] = [];
			let stat: BoostID;
			for (stat in target.boosts) {
				if (target.boosts[stat] < 6) { stats.push(stat); }
			}
			if (stats.length) {
				const randomStat = this.sample(stats);
				const boost: SparseBoostsTable = {};
				boost[randomStat] = 2;
				this.boost(boost);
			} else { return false; }
		},
		secondary: null,
		target: "adjacentAllyOrSelf",
	},
	afteryou: {
		num: 495,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "After You",
		pp: 15,
		priority: 0,
		flags: { bypasssub: 1, allyanim: 1 },
		onHit(target) {
			if (this.activePerHalf === 1) return false; // fails in singles
			const action = this.queue.willMove(target);
			if (action) {
				this.queue.prioritizeAction(action);
				this.add('-activate', target, 'move: After You');
			} else { return false; }
		},
		secondary: null,
		target: "normal",
	},
	agility: {
		num: 97,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Agility",
		pp: 30,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {spe: 2,},
		secondary: null,
		target: "self",
	},
	allyswitch: {
		num: 502,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Ally Switch",
		pp: 15,
		priority: 2,
		flags: { metronome: 1 },
		onPrepareHit(pokemon) { return pokemon.addVolatile('allyswitch'); },
		onHit(pokemon) {
			let success = true;
			// Fail in formats where you don't control allies
			if (this.format.gameType !== 'doubles' && this.format.gameType !== 'triples') success = false;
			// Fail in triples if the Pokemon is in the middle
			if (pokemon.side.active.length === 3 && pokemon.position === 1) success = false;
			const newPosition = (pokemon.position === 0 ? pokemon.side.active.length - 1 : 0);
			if (!pokemon.side.active[newPosition]) success = false;
			if (pokemon.side.active[newPosition].fainted) success = false;
			if (!success) {
				this.add('-fail', pokemon, 'move: Ally Switch');
				this.attrLastMove('[still]');
				return this.NOT_FAIL;
			}
			this.swapPosition(pokemon, newPosition, '[from] move: Ally Switch');
		},
		condition: {
			duration: 2,
			counterMax: 729,
			onStart() { this.effectState.counter = 3; },
			onRestart(pokemon) {
				// this.effectState.counter should never be undefined here.
				// However, just in case, use 1 if it is undefined.
				const counter = this.effectState.counter || 1;
				this.debug(`Ally Switch success chance: ${Math.round(100 / counter)}%`);
				const success = this.randomChance(1, counter);
				if (!success) {
					delete pokemon.volatiles['allyswitch'];
					return false;
				}
				if (this.effectState.counter < (this.effect as Condition).counterMax!) { this.effectState.counter *= 3; }
				this.effectState.duration = 2;
			},
		},
		secondary: null,
		target: "self",
	},
	amnesia: {
		num: 133,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Amnesia",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {spd: 2,},
		secondary: null,
		target: "self",
	},
	aquaring: {
		num: 392,
		accuracy: true,
		basePower: 0,
		type: "Water",
		category: "Status",
		name: "Aqua Ring",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		volatileStatus: 'aquaring',
		condition: {
			onStart(pokemon) { this.add('-start', pokemon, 'Aqua Ring'); },
			onResidualOrder: 6,
			onResidual(pokemon) { this.heal(pokemon.baseMaxhp / 16); },
		},
		secondary: null,
		target: "self",
	},
	aromatherapy: {
		num: 312,
		accuracy: true,
		basePower: 0,
		type: "Grass",
		category: "Status",
		name: "Aromatherapy",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, distance: 1, metronome: 1 },
		onHit(target, source, move) {
			this.add('-activate', source, 'move: Aromatherapy');
			let success = false;
			const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally !== source && !this.suppressingAbility(ally)) {
					if (ally.hasAbility('sapsipper')) {
						this.add('-immune', ally, '[from] ability: Sap Sipper');
						continue;
					}
					if (ally.hasAbility('goodasgold')) {
						this.add('-immune', ally, '[from] ability: Good as Gold');
						continue;
					}
					if (ally.volatiles['substitute'] && !move.infiltrates) continue;
				}
				if (ally.cureStatus()) success = true;
			}
			return success;
		},
		target: "allyTeam",
	},
	aromaticmist: {
	num: 597,
	accuracy: true,
	basePower: 0,
	type: "Fairy",
	category: "Status",
	name: "Aromatic Mist",
	pp: 20,
	priority: 0,
	flags: { bypasssub: 1, metronome: 1 },
	onHit(target, source, move) {
	    this.boost({spd: 1}, target, source, move);
	    this.boost({spd: 1}, source, source, move);
		if (this.field.isTerrain('mistyterrain')) {
			const terrain = this.field.getPseudoWeather('mistyterrain');
			if (terrain && terrain.duration) {
				terrain.duration += 2;
				this.add('-message', `Misty Terrain's duration was extended by 2 turns!`);
			}
		}
	},
	secondary: null,
	target: "adjacentAlly",
	},
	attract: {
		num: 213,
		accuracy: 100,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Attract",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		volatileStatus: 'attract',
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(pokemon, source, effect) {
				if (!(pokemon.gender === 'M' && source.gender === 'F') && !(pokemon.gender === 'F' && source.gender === 'M')) {
					this.debug('incompatible gender');
					return false;
				}
				if (!this.runEvent('Attract', pokemon, source)) {
					this.debug('Attract event failed');
					return false;
				}

				if (effect.name === 'Cute Charm') { this.add('-start', pokemon, 'Attract', '[from] ability: Cute Charm', `[of] ${source}`); } 
				else if (effect.name === 'Destiny Knot') { this.add('-start', pokemon, 'Attract', '[from] item: Destiny Knot', `[of] ${source}`); } 
				else { this.add('-start', pokemon, 'Attract'); }
			},
			onUpdate(pokemon) {
				if (this.effectState.source && !this.effectState.source.isActive && pokemon.volatiles['attract']) {
					this.debug(`Removing Attract volatile on ${pokemon}`);
					pokemon.removeVolatile('attract');
				}
			},
			onBeforeMovePriority: 2,
			onBeforeMove(pokemon, target, move) {
				this.add('-activate', pokemon, 'move: Attract', '[of] ' + this.effectState.source);
				if (this.randomChance(1, 2)) {
					this.add('cant', pokemon, 'Attract');
					return false;
				}
			},
			onEnd(pokemon) { this.add('-end', pokemon, 'Attract', '[silent]'); },
		},
		onTryImmunity(target, source) { return (target.gender === 'M' && source.gender === 'F') || (target.gender === 'F' && source.gender === 'M'); },
		secondary: null,
		target: "normal",
	},
	auroraveil: {
		num: 694,
		accuracy: true,
		basePower: 0,
		type: "Ice",
		category: "Status",
		name: "Aurora Veil",
		pp: 20,
		priority: 0,
		flags: { light: 1, snatch: 1, metronome: 1 },
		sideCondition: 'auroraveil',
		onTry() { return this.field.isWeather(['hail', 'snowscape']); },
		condition: {
			duration: 5,
			durationCallback(target, source, effect) { if (source?.hasItem('lightclay')) { return 8; }
				return 5;
			},
			onAnyModifyDamage(damage, source, target, move) {
				if (target !== source && this.effectState.target.hasAlly(target)) {
					if ((target.side.getSideCondition('reflect') && this.getCategory(move) === 'Physical') ||
						(target.side.getSideCondition('lightscreen') && this.getCategory(move) === 'Special')) {
						return;
					}
					if (!target.getMoveHitData(move).crit && !move.infiltrates) {
						this.debug('Aurora Veil weaken');
						if (this.activePerHalf > 1) return this.chainModify([2732, 4096]);
						return this.chainModify(0.5);
					}
				}
			},
			onSideStart(side) { this.add('-sidestart', side, 'move: Aurora Veil'); },
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 10,
			onSideEnd(side) { this.add('-sideend', side, 'move: Aurora Veil'); },
		},
		secondary: null,
		target: "allySide",
	},
	autotomize: {
		num: 475,
		accuracy: true,
		basePower: 0,
		type: "Steel",
		category: "Status",
		name: "Autotomize",
		pp: 15,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onTryHit(pokemon) {
			const hasContrary = pokemon.hasAbility('contrary');
			if ((!hasContrary && pokemon.boosts.spe === 6) || (hasContrary && pokemon.boosts.spe === -6)) { return false; }
		},
		boosts: {spe: 2,},
		onHit(pokemon) {
			if (pokemon.weighthg > 1) {
				pokemon.weighthg = Math.max(1, pokemon.weighthg - 1000);
				this.add('-start', pokemon, 'Autotomize');
			}
		},
		secondary: null,
		target: "self",
	},
	babydolleyes: {
		num: 608,
		accuracy: 100,
		basePower: 0,
		type: "Fairy",
		category: "Status",
		name: "Baby-Doll Eyes",
		pp: 30,
		priority: 1,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		boosts: {atk: -1,},
		secondary: null,
		target: "normal",
	},
	banefulbunker: {
		num: 661,
		accuracy: true,
		basePower: 0,
		type: "Poison",
		category: "Status",
		name: "Baneful Bunker",
		pp: 10,
		priority: 4,
		flags: { noassist: 1, failcopycat: 1 },
		stallingMove: true,
		volatileStatus: 'banefulbunker',
		onPrepareHit(pokemon) { return !!this.queue.willAct() && this.runEvent('StallMove', pokemon); },
		onHit(pokemon) { pokemon.addVolatile('stall'); },
		condition: {
			duration: 1,
			onStart(target) { this.add('-singleturn', target, 'move: Protect'); },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) { move.smartTarget = false; } 
				else { this.add('-activate', target, 'move: Protect'); }
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) { if (source.volatiles['lockedmove'].duration === 2) { delete source.volatiles['lockedmove']; } }
				if (this.checkMoveMakesContact(move, source, target)) { source.trySetStatus('psn', target); }
				return this.NOT_FAIL;
			},
			onHit(target, source, move) { if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) { source.trySetStatus('psn', target); } },
		},
		secondary: null,
		target: "self",
	},
	batonpass: {
		num: 226,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Baton Pass",
		pp: 40,
		priority: 0,
		flags: { metronome: 1 },
		onHit(target) {
			if (!this.canSwitch(target.side) || target.volatiles['commanded']) {
				this.attrLastMove('[still]');
				this.add('-fail', target);
				return this.NOT_FAIL;
			}
		},
		self: { onHit(source) { source.skipBeforeSwitchOutEventFlag = true; }, },
		selfSwitch: 'copyvolatile',
		secondary: null,
		target: "self",
	},
	bellydrum: {
		num: 187,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Belly Drum",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onHit(target) {
			if (target.hp <= target.maxhp / 2 || target.boosts.atk >= 6 || target.maxhp === 1) { // Shedinja clause
				return false;
			}
			this.directDamage(target.maxhp / 2);
			this.boost({ atk: 12 }, target);
		},
		secondary: null,
		target: "self",
	},
	block: {
		num: 335,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Block",
		pp: 5,
		priority: 0,
		flags: { reflectable: 1, mirror: 1, metronome: 1 },
		onHit(target, source, move) { return target.addVolatile('trapped', source, move, 'trapper'); },
		secondary: null,
		target: "normal",
	},
	bulkup: {
		num: 339,
		accuracy: true,
		basePower: 0,
		type: "Fighting",
		category: "Status",
		name: "Bulk Up",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {atk: 1, def: 1,},
		secondary: null,
		target: "self",
	},
	burningbulwark: {
		num: 908,
		accuracy: true,
		basePower: 0,
		type: "Fire",
		category: "Status",
		name: "Burning Bulwark",
		pp: 10,
		priority: 4,
		flags: { metronome: 1, noassist: 1, failcopycat: 1 },
		stallingMove: true,
		volatileStatus: 'burningbulwark',
		onPrepareHit(pokemon) { return !!this.queue.willAct() && this.runEvent('StallMove', pokemon); },
		onHit(pokemon) { pokemon.addVolatile('stall'); },
		condition: {
			duration: 1,
			onStart(target) { this.add('-singleturn', target, 'move: Protect'); },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) { move.smartTarget = false; } 
				else { this.add('-activate', target, 'move: Protect'); }
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) { if (source.volatiles['lockedmove'].duration === 2) { delete source.volatiles['lockedmove']; } }
				if (this.checkMoveMakesContact(move, source, target)) { source.trySetStatus('brn', target); }
				return this.NOT_FAIL;
			},
			onHit(target, source, move) { if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) { source.trySetStatus('brn', target); } },
		},
		secondary: null,
		target: "self",

	},
	calmmind: {
		num: 347,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Calm Mind",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {spa: 1, spd: 1,},
		secondary: null,
		target: "self",
	},
	caltrops: {
		num: 4000,
		accuracy: true,
		basePower: 0,
		type: "Steel",
		category: "Status",
		name: "Caltrops",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, metronome: 1, mustpressure: 1 },
		sideCondition: 'steelspikes',
		condition: {
			onSideStart(side) { this.add('-sidestart', side, 'move: Caltrops'); },
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) return;
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('caltrops')), -6, 6);
				this.damage(pokemon.maxhp * (2 ** typeMod) / 8);
			},
		},
		secondary: null,
		target: "foeSide",
	},
	celebrate: {
		num: 606,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Celebrate",
		pp: 40,
		priority: 0,
		flags: { nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		onTryHit(target, source) { this.add('-activate', target, 'move: Celebrate'); },
		secondary: null,
		target: "self",
		zMove: { boost: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 } },
	},
	charge: {
		num: 268,
		accuracy: true,
		basePower: 0,
		type: "Electric",
		category: "Status",
		name: "Charge",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		volatileStatus: 'charge',
		condition: {
			onStart(pokemon, source, effect) { if (effect && ['Electromorphosis', 'Wind Power'].includes(effect.name)) { this.add('-start', pokemon, 'Charge', this.activeMove!.name, '[from] ability: ' + effect.name); } 
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
			onMoveAborted(pokemon, target, move) { if (move.type === 'Electric' && move.id !== 'charge') { pokemon.removeVolatile('charge'); } },
			onAfterMove(pokemon, target, move) { if (move.type === 'Electric' && move.id !== 'charge') { pokemon.removeVolatile('charge'); } },
			onEnd(pokemon) { this.add('-end', pokemon, 'Charge', '[silent]'); },
		},
		boosts: {spd: 1,},
		secondary: null,
		target: "self",
	},
	charm: {
		num: 204,
		accuracy: 100,
		basePower: 0,
		type: "Fairy",
		category: "Status",
		name: "Charm",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		boosts: {atk: -2,},
		secondary: null,
		target: "normal",
	},
	chillyreception: {
		num: 881,
		accuracy: true,
		basePower: 0,
		type: "Ice",
		category: "Status",
		name: "Chilly Reception",
		pp: 10,
		priority: 0,
		flags: {},
		priorityChargeCallback(source) { source.addVolatile('chillyreception'); },
		weather: 'snowscape',
		selfSwitch: true,
		secondary: null,
		condition: {
			duration: 1,
			onBeforeMovePriority: 100,
			onBeforeMove(source, target, move) {
				if (move.id !== 'chillyreception') return;
				this.add('-prepare', source, 'Chilly Reception', '[premajor]');
			},
		},
		target: "all",

	},
	clangoroussoul: {
		num: 775,
		accuracy: 100,
		basePower: 0,
		type: "Dragon",
		category: "Status",
		name: "Clangorous Soul",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, sound: 1, dance: 1 },
		onTry(source) { if (source.hp <= (source.maxhp * 33 / 100) || source.maxhp === 1) return false; },
		onTryHit(pokemon, target, move) {
			if (!this.boost(move.boosts!)) return null;
			delete move.boosts;
		},
		onHit(pokemon) { this.directDamage(pokemon.maxhp * 33 / 100); },
		boosts: {atk: 1, def: 1, spa: 1, spd: 1, spe: 1,},
		secondary: null,
		target: "self",

	},
	coaching: {
		num: 811,
		accuracy: true,
		basePower: 0,
		type: "Fighting",
		category: "Status",
		name: "Coaching",
		pp: 10,
		priority: 0,
		flags: { bypasssub: 1, allyanim: 1, metronome: 1 },
		secondary: null,
		boosts: {atk: 1, def: 1,},
		target: "adjacentAlly",

	},
	coil: {
		num: 489,
		accuracy: true,
		basePower: 0,
		type: "Poison",
		category: "Status",
		name: "Coil",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {atk: 1, def: 1, accuracy: 1,},
		secondary: null,
		target: "self",
	},
	confide: {
		num: 590,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Confide",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		boosts: {spa: -1,},
		secondary: null,
		target: "normal",
	},
	confuseray: {
		num: 109,
		accuracy: 100,
		basePower: 0,
		type: "Ghost",
		category: "Status",
		name: "Confuse Ray",
		pp: 10,
		priority: 0,
		flags: { light: 1, protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'confusion',
		secondary: null,
		target: "normal",
	},
	conversion: {
		num: 160,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Conversion",
		pp: 30,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onHit(target) {
			const type = this.dex.moves.get(target.moveSlots[0].id).type;
			if (target.hasType(type) || !target.setType(type)) return false;
			this.add('-start', target, 'typechange', type);
		},
		secondary: null,
		target: "self",
	},
	conversion2: {
		num: 176,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Conversion 2",
		pp: 30,
		priority: 0,
		flags: { bypasssub: 1, metronome: 1 },
		onHit(target, source) {
			if (!target.lastMoveUsed) { return false; }
			const possibleTypes = [];
			const attackType = target.lastMoveUsed.type;
			for (const typeName of this.dex.types.names()) {
				if (source.hasType(typeName)) continue;
				const typeCheck = this.dex.types.get(typeName).damageTaken[attackType];
				if (typeCheck === 2 || typeCheck === 3) { possibleTypes.push(typeName); }
			}
			if (!possibleTypes.length) { return false;
			}
			const randomType = this.sample(possibleTypes);

			if (!source.setType(randomType)) return false;
			this.add('-start', source, 'typechange', randomType);
		},
		secondary: null,
		target: "normal",
	},
	copycat: {
		num: 383,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Copycat",
		pp: 20,
		priority: 0,
		flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		onHit(pokemon) {
			let move: Move | ActiveMove | null = this.lastMove;
			if (!move) return;
			if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
			if (move.flags['failcopycat'] || move.isZ || move.isMax) { return false; }
			this.actions.useMove(move.id, pokemon);
		},
		callsMove: true,
		secondary: null,
		target: "self",
	},
	cosmicpower: {
		num: 322,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Cosmic Power",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {def: 1, spd: 1,},
		secondary: null,
		target: "self",
	},
	cottonguard: {
		num: 538,
		accuracy: true,
		basePower: 0,
		type: "Grass",
		category: "Status",
		name: "Cotton Guard",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {def: 3,},
		secondary: null,
		target: "self",
	},
	cottonspore: {
		num: 178,
		accuracy: 100,
		basePower: 0,
		type: "Grass",
		category: "Status",
		name: "Cotton Spore",
		pp: 40,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1, powder: 1 },
		boosts: {spe: -2,},
		secondary: null,
		target: "allAdjacentFoes",
	},
	courtchange: {
		num: 756,
		accuracy: 100,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Court Change",
		pp: 10,
		priority: 0,
		flags: { mirror: 1, metronome: 1 },
		onHitField(target, source) { const sideConditions = [ 'mist', 'lightscreen', 'reflect', 'spikes', 'safeguard', 'tailwind', 'toxicspikes', 'stealthrock', 'waterpledge', 'firepledge', 'grasspledge', 'stickyweb', 'auroraveil', 'luckychant', 'steelspikes', 'gmaxcannonade', 'gmaxvinelash', 'gmaxwildfire', 'gmaxvolcalith', ];
			let success = false;
			if (this.gameType === "freeforall") {
				// the list of all sides in clockwise order
				const sides = [this.sides[0], this.sides[3]!, this.sides[1], this.sides[2]!];
				const temp: { [k: number]: typeof source.side.sideConditions } = { 0: {}, 1: {}, 2: {}, 3: {} };
				for (const side of sides) {
					for (const id in side.sideConditions) {
						if (!sideConditions.includes(id)) continue;
						temp[side.n][id] = side.sideConditions[id];
						delete side.sideConditions[id];
						success = true;
					}
				}
				for (let i = 0; i < 4; i++) {
					const sourceSideConditions = temp[sides[i].n];
					const targetSide = sides[(i + 1) % 4]; // the next side in rotation
					for (const id in sourceSideConditions) {
						targetSide.sideConditions[id] = sourceSideConditions[id];
						targetSide.sideConditions[id].target = targetSide;
					}
				}
			} else {
				const sourceSideConditions = source.side.sideConditions;
				const targetSideConditions = source.side.foe.sideConditions;
				const sourceTemp: typeof sourceSideConditions = {};
				const targetTemp: typeof targetSideConditions = {};
				for (const id in sourceSideConditions) {
					if (!sideConditions.includes(id)) continue;
					sourceTemp[id] = sourceSideConditions[id];
					delete sourceSideConditions[id];
					success = true;
				}
				for (const id in targetSideConditions) {
					if (!sideConditions.includes(id)) continue;
					targetTemp[id] = targetSideConditions[id];
					delete targetSideConditions[id];
					success = true;
				}
				for (const id in sourceTemp) {
					targetSideConditions[id] = sourceTemp[id];
					targetSideConditions[id].target = source.side.foe;
				}
				for (const id in targetTemp) {
					sourceSideConditions[id] = targetTemp[id];
					sourceSideConditions[id].target = source.side;
				}
			}
			if (!success) return false;
			this.add('-swapsideconditions');
			this.add('-activate', source, 'move: Court Change');
		},
		secondary: null,
		target: "all",

	},
	curse: {
		num: 174,
		accuracy: true,
		basePower: 0,
		type: "Ghost",
		category: "Status",
		name: "Curse",
		pp: 10,
		priority: 0,
		flags: { magic: 1, bypasssub: 1, metronome: 1 },
		volatileStatus: 'curse',
		onModifyMove(move, source, target) {
			if (!source.hasType('Ghost')) { move.target = move.nonGhostTarget!; } 
			else if (source.isAlly(target)) { move.target = 'randomNormal'; }
		},
		onTryHit(target, source, move) {
			if (!source.hasType('Ghost')) {
				delete move.volatileStatus;
				delete move.onHit;
				move.self = { boosts: { spe: -1, atk: 1, def: 1 } };
			} else if (move.volatileStatus && target.volatiles['curse']) { return false; }
		},
		onHit(target, source) { this.directDamage(source.maxhp / 4, source, source); },
		condition: {
			onStart(pokemon, source) { this.add('-start', pokemon, 'Curse', `[of] ${source}`); },
			onResidualOrder: 12,
			onResidual(pokemon) { this.damage(pokemon.baseMaxhp / 4); },
		},
		secondary: null,
		target: "normal",
		nonGhostTarget: "self",
	},
	darkvoid: {
		num: 464,
		accuracy: 85,
		basePower: 0,
		type: "Dark",
		category: "Status",
		name: "Dark Void",
		pp: 10,
		priority: 0,
		flags: { shadow: 1, protect: 1, reflectable: 1, mirror: 1, metronome: 1, nosketch: 1 },
		status: 'drowsy',
		onHit(target, source, move) {
			if (target.status === 'drowsy' && target.statusState.time) {
				const wasAtMinimum = target.statusState.time === target.statusState.startTime;
				target.statusState.time--;
				if (wasAtMinimum || target.statusState.time <= 0) {
					this.add('-message', `${target.name} fell asleep immediately!`);
					target.cureStatus();
					target.setStatus('slp');
				} else { this.add('-message', `${target.name}'s drowsiness is worsening!`);}
			}
		},
		secondary: null,
		target: "allAdjacentFoes",
	},
	decorate: {
		num: 777,
		accuracy: true,
		basePower: 0,
		type: "Fairy",
		category: "Status",
		name: "Decorate",
		pp: 15,
		priority: 0,
		flags: { allyanim: 1 },
		secondary: null,
		boosts: {atk: 2, spa: 2,},
		target: "normal",

	},
	defendorder: {
		num: 455,
		accuracy: true,
		basePower: 0,
		type: "Bug",
		category: "Status",
		name: "Defend Order",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		stallingMove: true,
		volatileStatus: 'protect',
		onModifyPriority(priority, source, target, move) { return priority + 0.1; },
		onPrepareHit(pokemon) { return !!this.queue.willAct() && this.runEvent('StallMove', pokemon); },
		onHit(pokemon) { pokemon.addVolatile('stall'); },
		boosts: {def: 1, spd: 1,},
		condition: {
			duration: 1,
			onStart(target) { this.add('-singleturn', target, 'Protect'); },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (move.smartTarget) { move.smartTarget = false;} 
				else { this.add('-activate', target, 'move: Protect');}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) { if (source.volatiles['lockedmove'].duration === 2) { delete source.volatiles['lockedmove']; } }
				return this.NOT_FAIL;
			},
		},
		secondary: null,
		target: "self",
	},
	defensecurl: {
		num: 111,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Defense Curl",
		pp: 40,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {def: 1,},
		volatileStatus: 'defensecurl',
		condition: {
			noCopy: true,
			onRestart: () => null,
		},
		secondary: null,
		target: "self",
	},
	defog: {
		num: 432,
		accuracy: true,
		basePower: 0,
		type: "Flying",
		category: "Status",
		name: "Defog",
		pp: 15,
		priority: 0,
		flags: { wind: 1, protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		onHit(target, source, move) {
			let success = false;
			if (!target.volatiles['substitute'] || move.infiltrates) success = !!this.boost({ evasion: -1 });
			const removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'steelspikes'];
			const removeTarget = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', ...removeAll];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.dex.conditions.get(targetCondition).name, '[from] move: Defog', `[of] ${source}`);
					success = true;
				}
			}
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Defog', `[of] ${source}`);
					success = true;
				}
			}
			this.field.clearTerrain();
			return success;
		},
		secondary: null,
		target: "all",
	},
	destinybond: {
		num: 194,
		accuracy: true,
		basePower: 0,
		type: "Ghost",
		category: "Status",
		name: "Destiny Bond",
		pp: 5,
		priority: 0,
		flags: { bypasssub: 1, noassist: 1, failcopycat: 1 },
		volatileStatus: 'destinybond',
		onPrepareHit(pokemon) { return !pokemon.removeVolatile('destinybond'); },
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(pokemon) { this.add('-singlemove', pokemon, 'Destiny Bond'); },
			onFaint(target, source, effect) {
				if (!source || !effect || target.isAlly(source)) return;
				if (effect.effectType === 'Move' && !effect.flags['futuremove']) {
					if (source.volatiles['dynamax']) {
						this.add('-hint', "Dynamaxed Pokémon are immune to Destiny Bond.");
						return;
					}
					this.add('-activate', target, 'move: Destiny Bond');
					source.faint();
				}
			},
			onBeforeMovePriority: -1,
			onBeforeMove(pokemon, target, move) {
				if (move.id === 'destinybond') return;
				this.debug('removing Destiny Bond before attack');
				pokemon.removeVolatile('destinybond');
			},
			onMoveAborted(pokemon, target, move) { pokemon.removeVolatile('destinybond'); },
		},
		secondary: null,
		target: "self",
	},
	detect: {
		num: 197,
		accuracy: true,
		basePower: 0,
		type: "Fighting",
		category: "Status",
		name: "Detect",
		pp: 5,
		priority: 4,
		flags: { noassist: 1, failcopycat: 1 },
		stallingMove: true,
		volatileStatus: 'protect',
		onPrepareHit(pokemon) { return !!this.queue.willAct() && this.runEvent('StallMove', pokemon); },
		onHit(pokemon) { pokemon.addVolatile('stall'); },
		secondary: null,
		target: "self",
	},
	disable: {
		num: 50,
		accuracy: 100,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Disable",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		volatileStatus: 'disable',
		onTryHit(target) { if (!target.lastMove || target.lastMove.isZ || target.lastMove.isMax || target.lastMove.id === 'struggle') { return false; } },
		condition: {
			duration: 5,
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(pokemon, source, effect) {
				// The target hasn't taken its turn, or Cursed Body activated and the move was not used through Dancer or Instruct
				if ( this.queue.willMove(pokemon) || (pokemon === this.activePokemon && this.activeMove && !this.activeMove.isExternal) ) 
				{ this.effectState.duration!--; }
				if (!pokemon.lastMove) {
					this.debug(`Pokemon hasn't moved yet`);
					return false;
				}
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id === pokemon.lastMove.id) {
						if (!moveSlot.pp) {
							this.debug('Move out of PP');
							return false;
						}
					}
				}
				if (effect.effectType === 'Ability') { this.add('-start', pokemon, 'Disable', pokemon.lastMove.name, '[from] ability: ' + effect.name, `[of] ${source}`); } 
				else { this.add('-start', pokemon, 'Disable', pokemon.lastMove.name); }
				this.effectState.move = pokemon.lastMove.id;
			},
			onResidualOrder: 17,
			onEnd(pokemon) { this.add('-end', pokemon, 'Disable'); },
			onBeforeMovePriority: 7,
			onBeforeMove(attacker, defender, move) {
				if (!move.isZ && move.id === this.effectState.move) {
					this.add('cant', attacker, 'Disable', move);
					return false;
				}
			},
			onDisableMove(pokemon) { for (const moveSlot of pokemon.moveSlots) { if (moveSlot.id === this.effectState.move) { pokemon.disableMove(moveSlot.id); } } },
		},
		secondary: null,
		target: "normal",
	},
	doodle: {
		num: 867,
		accuracy: 100,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Doodle",
		pp: 10,
		priority: 0,
		flags: {},
		onHit(target, source, move) {
			let success: boolean | null = false;
			if (!target.getAbility().flags['failroleplay']) {
				for (const pokemon of source.alliesAndSelf()) {
					if ((pokemon.ability1 === target.ability1 && pokemon.ability2 === target.ability2) || pokemon.getAbility().flags['cantsuppress']) continue;
					const oldAbility = pokemon.setAbility(target.ability1, null, move, false, false, 1);
					if (target.ability2) pokemon.setAbility(target.ability2, null, move, false, false, 2);
					if (oldAbility) { 
						success = true;
						// Copy target's status
						if (target.status && !pokemon.status) { pokemon.setStatus(target.status, source, move); }
						// Copy target's stat changes
						let i: BoostID;
						for (i in target.boosts) { pokemon.boosts[i] = target.boosts[i]; }
						this.add('-copyboost', pokemon, target, '[from] move: Doodle');
						// Copy target's volatiles
						for (const volatile in target.volatiles) {
							if (target.volatiles[volatile].noCopy) continue;
							pokemon.addVolatile(volatile);
							if (pokemon.volatiles[volatile]) { Object.assign(pokemon.volatiles[volatile], target.volatiles[volatile]); } // Copy volatile state data if applicable
						}
					} 
					else if (!success && oldAbility === null) { success = null; }
				}
			}
			if (!success) {
				if (success === false) { this.add('-fail', source); }
				this.attrLastMove('[still]');
				return this.NOT_FAIL;
			}
		},
		secondary: null,
		target: "normal",
	},
	doubleteam: {
		num: 104,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Double Team",
		pp: 15,
		priority: -1,
		flags: { snatch: 1, metronome: 1 },
		boosts: {spe: 2,},
		volatileStatus: 'doubleteam',
		condition: {
			duration: 2,
			onStart(pokemon) { this.add('-start', pokemon, 'Double Team'); },
			onPrepareHit(source, target, move) {
				if (move.category === 'Status' || move.multihit || move.flags['charge'] || move.flags['futuremove'] || move.spreadHit || move.isZ || move.isMax) return;
				move.multihit = 2;
				move.multihitType = 'doubleteam';
			},
			onEnd(pokemon) { this.add('-end', pokemon, 'Double Team'); },
		},
		secondary: null,
		target: "self",
	},
	dragoncheer: {
		num: 913,
		accuracy: true,
		basePower: 0,
		type: "Dragon",
		category: "Status",
		name: "Dragon Cheer",
		pp: 15,
		priority: 0,
		flags: { bypasssub: 1, allyanim: 1, metronome: 1 },
		volatileStatus: 'dragoncheer',
		condition: {
			onStart(target, source, effect) {
				if (effect && (['costar', 'imposter', 'psychup', 'transform'].includes(effect.id))) { this.add('-start', target, 'move: Dragon Cheer', '[silent]'); } 
				else { this.add('-start', target, 'move: Dragon Cheer'); }
				// Store at the start because the boost doesn't change if a Pokemon
				// Terastallizes into Dragon while having this volatile
				// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9894139
				this.effectState.hasDragonType = target.hasType("Dragon");
			},
			onModifyCritRatio(critRatio, source) { return critRatio + (this.effectState.hasDragonType ? 2 : 1); },
		},
		secondary: null,
		target: "adjacentAlly",

	},
	dragondance: {
		num: 349,
		accuracy: true,
		basePower: 0,
		type: "Dragon",
		category: "Status",
		name: "Dragon Dance",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, dance: 1, metronome: 1 },
		boosts: {atk: 1, spe: 1,},
		secondary: null,
		target: "self",
	},
	eerieimpulse: {
		num: 598,
		accuracy: 100,
		basePower: 0,
		type: "Electric",
		category: "Status",
		name: "Eerie Impulse",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		boosts: {spa: -2,},
		secondary: null,
		target: "normal",
	},
	electricterrain: {
		num: 604,
		accuracy: true,
		basePower: 0,
		type: "Electric",
		category: "Status",
		name: "Electric Terrain",
		pp: 10,
		priority: 0,
		flags: { nonsky: 1, metronome: 1 },
		terrain: 'electricterrain',
		condition: {
			effectType: 'Terrain',
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) { return 8; }
				return 5;
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
			},
			onFieldStart(field, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Electric Terrain', '[from] ability: ' + effect.name, `[of] ${source}`);
				} else { this.add('-fieldstart', 'move: Electric Terrain'); }
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() { this.add('-fieldend', 'move: Electric Terrain'); },
		},
		secondary: null,
		target: "all",
	},
	embargo: {
		num: 373,
		accuracy: 100,
		basePower: 0,
		type: "Dark",
		category: "Status",
		name: "Embargo",
		pp: 15,
		priority: 0,
		flags: { magic: 1, protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'embargo',
		condition: {
			duration: 5,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Embargo');
				this.singleEvent('End', pokemon.getItem(), pokemon.itemState, pokemon);
			},
			// Item suppression implemented in Pokemon.ignoringItem() within sim/pokemon.js
			onResidualOrder: 21,
			onEnd(pokemon) { this.add('-end', pokemon, 'Embargo'); },
		},
		secondary: null,
		target: "normal",
	},
	encore: {
		num: 227,
		accuracy: 100,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Encore",
		pp: 5,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1, failencore: 1 },
		volatileStatus: 'encore',
		condition: {
			duration: 3,
			noCopy: true, // doesn't get copied by Z-Baton Pass
			onStart(target) {
				let move: Move | ActiveMove | null = target.lastMove;
				if (!move || target.volatiles['dynamax']) return false;
				if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
				const moveSlot = target.getMoveData(move.id);
				if (move.isZ || move.flags['failencore'] || !moveSlot || moveSlot.pp <= 0) {
					// it failed
					return false;
				}
				this.effectState.move = move.id;
				this.add('-start', target, 'Encore');
				if (!this.queue.willMove(target)) { this.effectState.duration!++; }
			},
			onOverrideAction(pokemon, target, move) { if (move.id !== this.effectState.move) return this.effectState.move; },
			onResidualOrder: 16,
			onResidual(target) {
				const moveSlot = target.getMoveData(this.effectState.move);
				if (!moveSlot || moveSlot.pp <= 0) { target.removeVolatile('encore'); }
			},
			onEnd(target) {
				this.add('-end', target, 'Encore');
			},
			onDisableMove(pokemon) {
				if (!this.effectState.move || !pokemon.hasMove(this.effectState.move)) { return; }
				for (const moveSlot of pokemon.moveSlots) { if (moveSlot.id !== this.effectState.move) { pokemon.disableMove(moveSlot.id); } }
			},
		},
		secondary: null,
		target: "normal",
	},
	endure: {
		num: 203,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Endure",
		pp: 10,
		priority: 4,
		flags: { noassist: 1, failcopycat: 1 },
		stallingMove: true,
		volatileStatus: 'endure',
		onPrepareHit(pokemon) { return !!this.queue.willAct() && this.runEvent('StallMove', pokemon); },
		onHit(pokemon) { pokemon.addVolatile('stall'); },
		condition: {
			duration: 1,
			onStart(target) { this.add('-singleturn', target, 'move: Endure'); },
			onDamagePriority: -10,
			onDamage(damage, target, source, effect) {
				if (effect?.effectType === 'Move' && damage >= target.hp) {
					this.add('-activate', target, 'move: Endure');
					return target.hp - 1;
				}
			},
		},
		secondary: null,
		target: "self",
	},
	entrainment: {
		num: 494,
		accuracy: 100,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Entrainment",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onTryHit(target, source) {
			if (target === source || target.volatiles['dynamax']) return false;
			if (
				(target.ability1 === source.ability1 && target.ability2 === source.ability2) ||
				target.getAbility().flags['cantsuppress'] || target.hasAbility('truant') ||
				source.getAbility().flags['noentrain']
			) { return false; }
		},
		onHit(target, source) {
			const oldAbility = target.setAbility(source.ability1, source, undefined, false, false, 1);
			if (source.ability2) target.setAbility(source.ability2, source, undefined, false, false, 2);
			if (!oldAbility) return oldAbility as false | null;
			if (!target.isAlly(source)) target.volatileStaleness = 'external';
		},
		secondary: null,
		target: "normal",
	},
	fairylock: {
		num: 587,
		accuracy: true,
		basePower: 0,
		type: "Fairy",
		category: "Status",
		name: "Fairy Lock",
		pp: 10,
		priority: 0,
		flags: { magic: 1, mirror: 1, bypasssub: 1, metronome: 1, reflectable: 1 },
		sideCondition: 'fairylock',
		condition: {
			duration: 3,
			onSideStart(side) {
				this.add('-sidestart', side, 'Fairy Lock');
			},
			onTrapPokemon(pokemon) {
				if (!pokemon.volatiles['fairylockfree']) {
					pokemon.tryTrap();
				}
			},
			onEffectiveness(typeMod, target, type, move) { if (target && target.side && target.side.getSideCondition('fairylock')) { if (typeMod < 0 && target.hasType(['Dark', 'Dragon', 'Ghost'])) { return 0; }  } },
			onTryMove(pokemon, target, move) {
				if (pokemon.side.getSideCondition('fairylock') && !pokemon.volatiles['fairylockfree']) {
					if (move.flags['airborne'] || move.flags['dance'] || move.flags['magic'] || move.flags['wing']) {
						this.add('-fail', pokemon, move.name, '[from] Fairy Lock');
						return false;
					}
				}
			},
			onAfterMove(pokemon, target, move) {
				if (move.flags['spin'] && pokemon.side.getSideCondition('fairylock') && !pokemon.volatiles['fairylockfree']) {
					pokemon.addVolatile('fairylockfree');
					this.add('-message', `${pokemon.name} freed itself from the magic chains.`);
				}
			},
			onResidualOrder: 10,
			onResidual(pokemon) { if (!pokemon.volatiles['fairylockfree']) { if (pokemon.hasType(['Dark', 'Dragon', 'Ghost'])) { this.damage(pokemon.baseMaxhp / 12, pokemon); } } },
			onSideResidualOrder: 26,
			onSideResidual(side) {
				const freePokemon = side.active.find((p: Pokemon) => p && p.volatiles['fairylockfree']);
				if (freePokemon) {
					const allies = side.active.filter((p: Pokemon) => p && p !== freePokemon && !p.fainted);
					if (allies.length > 0) { this.add('-message', `${freePokemon.name} unshackled their ally ${allies[0].name}.`); }
					side.removeSideCondition('fairylock');
				}
			},
			onSideEnd(side) {
				this.add('-sideend', side, 'Fairy Lock');
				for (const pokemon of side.pokemon) { pokemon.removeVolatile('fairylockfree'); }
			},
		},
		secondary: null,
		target: "foeSide",
	},
	faketears: {
		num: 313,
		accuracy: 100,
		basePower: 0,
		type: "Dark",
		category: "Status",
		name: "Fake Tears",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		boosts: {spd: -2,},
		secondary: null,
		target: "normal",
	},
	featherdance: {
		num: 297,
		accuracy: 100,
		basePower: 0,
		type: "Flying",
		category: "Status",
		name: "Feather Dance",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, dance: 1, allyanim: 1, metronome: 1 },
		boosts: {atk: -2,},
		secondary: null,
		target: "normal",
	},
	filletaway: {
		num: 868,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Fillet Away",
		pp: 10,
		priority: 0,
		flags: { snatch: 1 },
		onTry(source) { if (source.hp <= source.maxhp / 4 || source.maxhp === 1) return false; },
		onTryHit(pokemon, target, move) {
			if (!this.boost(move.boosts!)) return null;
			delete move.boosts;
		},
		onHit(pokemon) { this.directDamage(pokemon.maxhp / 4); },
		boosts: {atk: 2,spa: 2,spe: 2,},
		secondary: null,
		target: "self",
	},
	flatter: {
		num: 260,
		accuracy: 100,
		basePower: 0,
		type: "Dark",
		category: "Status",
		name: "Flatter",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		volatileStatus: 'confusion',
		boosts: {spa: 1,},
		secondary: null,
		target: "normal",
	},
	floralhealing: {
		num: 666,
		accuracy: true,
		basePower: 0,
		type: "Fairy",
		category: "Status",
		name: "Floral Healing",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, heal: 1, allyanim: 1, metronome: 1 },
		onHit(target, source) {
			let success = false;
			if (this.field.isTerrain('grassyterrain')) { success = !!this.heal(this.modify(target.baseMaxhp, 0.667)); } 
			else { success = !!this.heal(Math.ceil(target.baseMaxhp * 0.5)); }
			if (success && !target.isAlly(source)) { target.staleness = 'external'; }
			if (!success) {
				this.add('-fail', target, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
		secondary: null,
		target: "normal",
	},
	flowershield: {
		num: 579,
		accuracy: true,
		basePower: 0,
		type: "Fairy",
		category: "Status",
		name: "Flower Shield",
		pp: 10,
		priority: 0,
		flags: { distance: 1, metronome: 1 },
		onHitSide(side, source, move) {
			const targets = side.active.filter(ally => ally && !ally.fainted);
			let success = false;
			for (const target of targets) {
				const defBoost = target.hasType('Grass') ? 2 : 1;
				success = this.boost({ def: defBoost }, target, source, move) || success;
			}
			return success;
		},
		secondary: null,
		target: "allySide",
	},
	focusenergy: {
		num: 116,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Focus Energy",
		pp: 30,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		volatileStatus: 'focusenergy',
		condition: {
			onStart(target, source, effect) {
				if (effect?.id === 'zpower') { this.add('-start', target, 'move: Focus Energy', '[zeffect]'); } 
				else if (effect && (['costar', 'imposter', 'psychup', 'transform'].includes(effect.id))) { this.add('-start', target, 'move: Focus Energy', '[silent]'); } 
				else { this.add('-start', target, 'move: Focus Energy'); }
			},
			onModifyCritRatio(critRatio) { return critRatio + 2; },
			// Immunity to flinch and tripped
			onTryAddVolatile(status, pokemon) {
				if (status.id === 'flinch' || status.id === 'tripped') return null;
			},
			// Prevent charge/focus moves from being interrupted
			onHit(target, source, move) {
				if (target.volatiles['focuspunch'] || target.volatiles['beakblast'] || 
					target.volatiles['shelltrap'] || target.volatiles['twoturnmove']) {
					return null;
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Focus Energy');
			},
		},
		secondary: null,
		target: "self",
	},
	followme: {
		num: 266,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Follow Me",
		pp: 20,
		priority: 2,
		flags: { noassist: 1, failcopycat: 1 },
		volatileStatus: 'followme',
		onTry(source) { return this.activePerHalf > 1; },
		condition: {
			duration: 1,
			onStart(target, source, effect) {
				if (effect?.id === 'zpower') { this.add('-singleturn', target, 'move: Follow Me', '[zeffect]'); } 
				else { this.add('-singleturn', target, 'move: Follow Me'); }
			},
			onFoeRedirectTargetPriority: 1,
			onFoeRedirectTarget(target, source, source2, move) {
				if (!this.effectState.target.isSkyDropped() && this.validTarget(this.effectState.target, source, move.target)) {
					if (move.smartTarget) move.smartTarget = false;
					this.debug("Follow Me redirected target of move");
					return this.effectState.target;
				}
			},
		},
		secondary: null,
		target: "self",
	},
	forestscurse: {
		num: 571,
		accuracy: 100,
		basePower: 0,
		type: "Grass",
		category: "Status",
		name: "Forest's Curse",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onHit(target) {
			if (target.hasType('Grass')) return false;
			if (!target.addType('Grass')) return false;
			this.add('-start', target, 'typeadd', 'Grass', '[from] move: Forest\'s Curse');
		},
		secondary: null,
		target: "normal",
	},
	gastroacid: {
		num: 380,
		accuracy: 100,
		basePower: 0,
		type: "Poison",
		category: "Status",
		name: "Gastro Acid",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		volatileStatus: 'gastroacid',
		onTryHit(target) {
			if (target.getAbility().flags['cantsuppress']) { return false; }
			if (target.hasItem('Ability Shield')) {
				this.add('-block', target, 'item: Ability Shield');
				return null;
			}
		},
		condition: {
			// Ability suppression implemented in Pokemon.ignoringAbility() within sim/pokemon.ts
			onStart(pokemon) {
				if (pokemon.hasItem('Ability Shield')) return false;
				this.add('-endability', pokemon);
				this.singleEvent('End', pokemon.getAbility(1), pokemon.abilityState1, pokemon, pokemon, 'gastroacid');
				this.singleEvent('End', pokemon.getAbility(2), pokemon.abilityState2, pokemon, pokemon, 'gastroacid');
			},
			onCopy(pokemon) { if (pokemon.getAbility().flags['cantsuppress']) pokemon.removeVolatile('gastroacid'); },
		},
		secondary: null,
		target: "normal",
	},
	glare: {
		num: 137,
		accuracy: 100,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Glare",
		pp: 30,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		status: 'par',
		secondary: null,
		target: "normal",
	},
	grassyterrain: {
		num: 580,
		accuracy: true,
		basePower: 0,
		type: "Grass",
		category: "Status",
		name: "Grassy Terrain",
		pp: 10,
		priority: 0,
		flags: { nonsky: 1, metronome: 1 },
		terrain: 'grassyterrain',
		condition: {
			effectType: 'Terrain',
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) { return 8; }
				return 5;
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				const weakenedMoves = ['earthquake', 'bulldoze', 'magnitude'];
				if (weakenedMoves.includes(move.id) && defender.isGrounded() && !defender.isSemiInvulnerable()) {
					this.debug('move weakened by grassy terrain');
					return this.chainModify(0.5);
				}
				if (move.type === 'Grass' && attacker.isGrounded()) {
					this.debug('grassy terrain boost');
					return this.chainModify([5325, 4096]);
				}
			},
			onFieldStart(field, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Grassy Terrain', '[from] ability: ' + effect.name, `[of] ${source}`);
				} else { this.add('-fieldstart', 'move: Grassy Terrain'); }
			},
			onResidualOrder: 5,
			onResidualSubOrder: 2,
			onResidual(pokemon) {
				if (pokemon.isGrounded() && !pokemon.isSemiInvulnerable()) { this.heal(pokemon.baseMaxhp / 16, pokemon, pokemon); } 
				else { this.debug(`Pokemon semi-invuln or not grounded; Grassy Terrain skipped`); }
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() { this.add('-fieldend', 'move: Grassy Terrain'); },
		},
		secondary: null,
		target: "all",
	},
	grasswhistle: {
		num: 320,
		accuracy: 70,
		basePower: 0,
		type: "Grass",
		category: "Status",
		name: "Grass Whistle",
		pp: 15,
		priority: 0,
		flags: { sound: 1, weapon: 1, protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		status: 'drowsy',
		onTryHit(target, source, move) {
			if (target.hasType('Grass')) {
				this.add('-immune', target, '[from] type: Grass');
				return null;
			}
		},
		secondary: null,
		target: "allAdjacent",
	},
	gravity: {
		num: 356,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Gravity",
		pp: 5,
		priority: 0,
		flags: { nonsky: 1, metronome: 1 },
		pseudoWeather: 'gravity',
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Gravity');
					return 7;
				}
				return 5;
			},
			onFieldStart(target, source) {
				if (source?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Gravity', '[persistent]');
				} else { this.add('-fieldstart', 'move: Gravity'); }
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
			onModifyAccuracy(accuracy) {
				if (typeof accuracy !== 'number') return;
				return this.chainModify([6840, 4096]);
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.moves.get(moveSlot.id).flags['gravity']) { pokemon.disableMove(moveSlot.id); }
				}
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
				if (move.flags['gravity'] && !move.isZ) {
					this.add('cant', pokemon, 'move: Gravity', move);
					return false;
				}
			},
			onModifyMove(move, pokemon, target) {
				if (move.flags['gravity'] && !move.isZ) {
					this.add('cant', pokemon, 'move: Gravity', move);
					return false;
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 2,
			onFieldEnd() { this.add('-fieldend', 'move: Gravity'); },
		},
		secondary: null,
		target: "all",
	},
	growl: {
		num: 45,
		accuracy: 100,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Growl",
		pp: 40,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		boosts: {atk: -1,},
		secondary: null,
		target: "allAdjacentFoes",
	},
	growth: {
		num: 74,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Growth",
		pp: 20,
		priority: 0,
		flags: { solar: 1, snatch: 1, metronome: 1 },
		onModifyMove(move, pokemon) { if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) move.boosts = { atk: 2, spa: 2 }; },
		boosts: {atk: 1, spa: 1,},
		secondary: null,
		target: "self",
	},
	guardsplit: {
		num: 470,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Guard Split",
		pp: 10,
		priority: 0,
		flags: { protect: 1, allyanim: 1, metronome: 1 },
		onHit(target, source) {
			const newdef = Math.floor((target.storedStats.def + source.storedStats.def) / 2);
			target.storedStats.def = newdef;
			source.storedStats.def = newdef;
			const newspd = Math.floor((target.storedStats.spd + source.storedStats.spd) / 2);
			target.storedStats.spd = newspd;
			source.storedStats.spd = newspd;
			this.add('-activate', source, 'move: Guard Split', `[of] ${target}`);
		},
		secondary: null,
		target: "normal",
	},
	guardswap: {
		num: 385,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Guard Swap",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, bypasssub: 1, allyanim: 1, metronome: 1 },
		onHit(target, source) {
			const targetBoosts: SparseBoostsTable = {};
			const sourceBoosts: SparseBoostsTable = {};
			const defSpd: BoostID[] = ['def', 'spd'];
			for (const stat of defSpd) {
				targetBoosts[stat] = target.boosts[stat];
				sourceBoosts[stat] = source.boosts[stat];
			}
			source.setBoost(targetBoosts);
			target.setBoost(sourceBoosts);
			this.add('-swapboost', source, target, 'def, spd', '[from] move: Guard Swap');
		},
		secondary: null,
		target: "normal",
	},
	hail: {
		num: 258,
		accuracy: true,
		basePower: 0,
		type: "Ice",
		category: "Status",
		name: "Hail",
		pp: 10,
		priority: 0,
		flags: { metronome: 1 },
		weather: 'hail',
		secondary: null,
		target: "all",
	},
	happyhour: {
		num: 603,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Happy Hour",
		pp: 30,
		priority: 0,
		flags: { metronome: 1 },
		onTryHit(target, source) { this.add('-activate', target, 'move: Happy Hour'); },
		secondary: null,
		target: "allySide",
		zMove: { boost: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 } },
	},
	harden: {
		num: 106,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Harden",
		pp: 30,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {def: 1,},
		volatileStatus: 'harden',
		condition: {
			onStart(target) { this.add('-start', target, 'move: Harden'); },
			onSourceModifyDamage(damage, source, target, move) {
				if (move.flags['sweep']) { return this.chainModify(2); }
				if (move.flags['claw'] || move.flags['crush'] || move.flags['explosive'] || move.flags['kick'] || move.flags['punch'] || move.flags['slicing']|| move.flags['throw']|| move.flags['weapon']) 
					{ return this.chainModify(0.5); }
			},
			onTryBoost(boost, target, source, effect) { if (effect && effect.id === 'feint') { return null; } },
			onModifyMove(move, source, target) { if (move.infiltrates) { delete move.infiltrates; } },
			onEnd(target) { this.add('-end', target, 'move: Harden'); },
		},
		secondary: null,
		target: "self",
	},
	haze: {
		num: 114,
		accuracy: true,
		basePower: 0,
		type: "Ice",
		category: "Status",
		name: "Haze",
		pp: 30,
		priority: 0,
		flags: { bypasssub: 1, metronome: 1 },
		onHitField() {
			this.add('-clearallboost');
			for (const pokemon of this.getAllActive()) { pokemon.clearBoosts(); }
		},
		secondary: null,
		target: "all",
	},
	healbell: {
		num: 215,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Heal Bell",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, sound: 1, distance: 1, bypasssub: 1, metronome: 1 },
		onHit(target, source) {
			this.add('-activate', source, 'move: Heal Bell');
			let success = false;
			const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally !== source && !this.suppressingAbility(ally)) {
					if (ally.hasAbility('soundproof')) {
						this.add('-immune', ally, '[from] ability: Soundproof');
						continue;
					}
					if (ally.hasAbility('goodasgold')) {
						this.add('-immune', ally, '[from] ability: Good as Gold');
						continue;
					}
				}
				if (ally.cureStatus()) success = true;
			}
			return success;
		},
		target: "allyTeam",
	},
	healingwish: {
		num: 361,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Healing Wish",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		onTryHit(source) {
			if (!this.canSwitch(source.side)) {
				this.attrLastMove('[still]');
				this.add('-fail', source);
				return this.NOT_FAIL;
			}
		},
		selfdestruct: "ifHit",
		slotCondition: 'healingwish',
		condition: {
			onSwitchIn(target) { this.singleEvent('Swap', this.effect, this.effectState, target); },
			onSwap(target) {
				if (!target.fainted && (target.hp < target.maxhp || target.status)) {
					target.heal(target.maxhp);
					target.clearStatus();
					this.add('-heal', target, target.getHealth, '[from] move: Healing Wish');
					target.side.removeSlotCondition(target, 'healingwish');
				}
			},
		},
		secondary: null,
		target: "self",
	},
	healblock: {
		num: 377,
		accuracy: 100,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Heal Block",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'healblock',
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (effect?.name === "Psychic Noise") { return 2; }
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Heal Block');
					return 7;
				}
				return 5;
			},
			onStart(pokemon, source) {
				this.add('-start', pokemon, 'move: Heal Block');
				source.moveThisTurnResult = true;
			},
			onDisableMove(pokemon) { for (const moveSlot of pokemon.moveSlots) { if (this.dex.moves.get(moveSlot.id).flags['heal']) { pokemon.disableMove(moveSlot.id); } } },
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
				if (move.flags['heal'] && !move.isZ && !move.isMax) {
					this.add('cant', pokemon, 'move: Heal Block', move);
					return false;
				}
			},
			onModifyMove(move, pokemon, target) {
				if (move.flags['heal'] && !move.isZ && !move.isMax) {
					this.add('cant', pokemon, 'move: Heal Block', move);
					return false;
				}
			},
			onResidualOrder: 20,
			onEnd(pokemon) { this.add('-end', pokemon, 'move: Heal Block'); },
			onTryHeal(damage, target, source, effect) {
				if (effect && (effect.id === 'zpower' || (effect as Move).isZ)) return damage;
				if (source && target !== source && target.hp !== target.maxhp && effect.name === "Pollen Puff") {
					this.attrLastMove('[still]');
					// FIXME: Wrong error message, correct one not supported yet
					this.add('cant', source, 'move: Heal Block', effect);
					return null;
				}
				return false;
			},
			onRestart(target, source, effect) {
				if (effect?.name === 'Psychic Noise') return;
				this.add('-fail', target, 'move: Heal Block'); // Succeeds to supress downstream messages
				if (!source.moveThisTurnResult) { source.moveThisTurnResult = false; }
			},
		},
		secondary: null,
		target: "allAdjacentFoes",	
	},
	healorder: {
		num: 456,
		accuracy: true,
		basePower: 0,
		type: "Bug",
		category: "Status",
		name: "Heal Order",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		heal: [1, 2],
		secondary: null,
		target: "self",
	},
	healpulse: {
		num: 505,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Heal Pulse",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, distance: 1, heal: 1, allyanim: 1, metronome: 1, pulse: 1 },
		onHit(target, source) {
			let success = false;
			if (source.hasAbility('megalauncher')) { success = !!this.heal(this.modify(target.baseMaxhp, 0.75)); } 
			else { success = !!this.heal(Math.ceil(target.baseMaxhp * 0.5)); }
			if (success && !target.isAlly(source)) { target.staleness = 'external'; }
			if (!success) {
				this.add('-fail', target, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
		secondary: null,
		target: "any",
	},
	heartswap: {
		num: 391,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Heart Swap",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, bypasssub: 1, allyanim: 1, metronome: 1 },
		onHit(target, source) {
			const targetBoosts: SparseBoostsTable = {};
			const sourceBoosts: SparseBoostsTable = {};
			let i: BoostID;
			for (i in target.boosts) {
				targetBoosts[i] = target.boosts[i];
				sourceBoosts[i] = source.boosts[i];
			}
			target.setBoost(sourceBoosts);
			source.setBoost(targetBoosts);
			this.add('-swapboost', source, target, '[from] move: Heart Swap');
		},
		secondary: null,
		target: "normal",
	},
	helpinghand: {
		num: 270,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Helping Hand",
		pp: 20,
		priority: 5,
		flags: { bypasssub: 1, noassist: 1, failcopycat: 1 },
		volatileStatus: 'helpinghand',
		onTryHit(target) { if (!target.newlySwitched && !this.queue.willMove(target)) return false; },
		condition: {
			duration: 1,
			onStart(target, source) {
				this.effectState.multiplier = 1.5;
				this.add('-singleturn', target, 'Helping Hand', `[of] ${source}`);
			},
			onRestart(target, source) {
				this.effectState.multiplier *= 1.5;
				this.add('-singleturn', target, 'Helping Hand', `[of] ${source}`);
			},
			onBasePowerPriority: 10,
			onBasePower(basePower) {
				this.debug('Boosting from Helping Hand: ' + this.effectState.multiplier);
				return this.chainModify(this.effectState.multiplier);
			},
		},
		secondary: null,
		target: "adjacentAlly",
	},
	holdhands: {
		num: 607,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		isNonstandard: "Unobtainable",
		name: "Hold Hands",
		pp: 40,
		priority: 0,
		flags: { bypasssub: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		secondary: null,
		target: "adjacentAlly",
	},
	honeclaws: {
		num: 468,
		accuracy: true,
		basePower: 0,
		type: "Dark",
		category: "Status",
		name: "Hone Claws",
		pp: 15,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {atk: 1, accuracy: 1,},
		secondary: null,
		target: "self",
	},
	howl: {
		num: 336,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Howl",
		pp: 40,
		priority: 0,
		flags: { snatch: 1, sound: 1, metronome: 1 },
		boosts: {atk: 1,},
		secondary: null,
		target: "allies",
	},
	hypnosis: {
		num: 95,
		accuracy: 80,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Hypnosis",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		status: 'drowsy',
		secondary: null,
		target: "normal",
	},
	imprison: {
		num: 286,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Imprison",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, bypasssub: 1, metronome: 1, mustpressure: 1 },
		volatileStatus: 'imprison',
		condition: {
			noCopy: true,
			onStart(target) { this.add('-start', target, 'move: Imprison'); },
			onFoeDisableMove(pokemon) {
				for (const moveSlot of this.effectState.source.moveSlots) {
					if (moveSlot.id === 'struggle') continue;
					pokemon.disableMove(moveSlot.id, true);
				}
				pokemon.maybeDisabled = true;
			},
			onFoeBeforeMovePriority: 4,
			onFoeBeforeMove(attacker, defender, move) {
				if (move.id !== 'struggle' && this.effectState.source.hasMove(move.id) && !move.isZ && !move.isMax) {
					this.add('cant', attacker, 'move: Imprison', move);
					return false;
				}
			},
		},
		secondary: null,
		target: "self",
	},
	ingrain: {
		num: 275,
		accuracy: true,
		basePower: 0,
		type: "Grass",
		category: "Status",
		name: "Ingrain",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, nonsky: 1, metronome: 1 },
		volatileStatus: 'ingrain',
		condition: {
			onStart(pokemon) { this.add('-start', pokemon, 'move: Ingrain'); },
			onResidualOrder: 7,
			onResidual(pokemon) { this.heal(pokemon.baseMaxhp / 16); },
			onTrapPokemon(pokemon) { pokemon.tryTrap(); },
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
			onDragOut(pokemon) {
				this.add('-activate', pokemon, 'move: Ingrain');
				return null;
			},
		},
		secondary: null,
		target: "self",
	},
	instruct: {
		num: 689,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Instruct",
		pp: 15,
		priority: 0,
		flags: { protect: 1, bypasssub: 1, allyanim: 1, failinstruct: 1 },
		onHit(target, source) {
			if (!target.lastMove || target.volatiles['dynamax']) return false;
			const lastMove = target.lastMove;
			const moveSlot = target.getMoveData(lastMove.id);
			if (
				lastMove.flags['failinstruct'] || lastMove.isZ || lastMove.isMax ||
				lastMove.flags['charge'] || lastMove.flags['recharge'] ||
				target.volatiles['beakblast'] || target.volatiles['focuspunch'] || target.volatiles['shelltrap'] ||
				(moveSlot && moveSlot.pp <= 0)
			) { return false;}
			this.add('-singleturn', target, 'move: Instruct', `[of] ${source}`);
			this.queue.prioritizeAction(this.queue.resolveAction({
				choice: 'move',
				pokemon: target,
				moveid: target.lastMove.id,
				targetLoc: target.lastMoveTargetLoc!,
			})[0] as MoveAction);
		},
		secondary: null,
		target: "normal",
	},
	irondefense: {
		num: 334,
		accuracy: true,
		basePower: 0,
		type: "Steel",
		category: "Status",
		name: "Iron Defense",
		pp: 15,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {def: 2,},
		secondary: null,
		target: "self",
	},
	junglehealing: {
		num: 816,
		accuracy: true,
		basePower: 0,
		type: "Grass",
		category: "Status",
		name: "Jungle Healing",
		pp: 10,
		priority: 0,
		flags: { heal: 1, bypasssub: 1, allyanim: 1 },
		onHit(pokemon) {
			const success = !!this.heal(this.modify(pokemon.maxhp, 0.25));
			return pokemon.cureStatus() || success;
		},
		secondary: null,
		target: "allies",

	},
	leechseed: {
		num: 73,
		accuracy: 100,
		basePower: 0,
		type: "Grass",
		category: "Status",
		name: "Leech Seed",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'leechseed',
		condition: {
			onStart(target) { this.add('-start', target, 'move: Leech Seed'); },
			onResidualOrder: 8,
			onResidual(pokemon) {
				const target = this.getAtSlot(pokemon.volatiles['leechseed'].sourceSlot);
				if (!target || target.fainted || target.hp <= 0) {
					this.debug('Nothing to leech into');
					return;
				}
				const damage = this.damage(pokemon.baseMaxhp / 8, pokemon, target);
				if (damage) { this.heal(damage, target, pokemon); }
			},
		},
		onTryImmunity(target) { return !target.hasType('Grass'); },
		secondary: null,
		target: "normal",
	},
	leer: {
		num: 43,
		accuracy: 100,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Leer",
		pp: 30,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		boosts: {def: -1,},
		secondary: null,
		target: "allAdjacentFoes",
	},
	lifedew: {
		num: 791,
		accuracy: true,
		basePower: 0,
		type: "Water",
		category: "Status",
		name: "Life Dew",
		pp: 10,
		priority: 0,
		flags: { magic: 1, snatch: 1, heal: 1, bypasssub: 1 },
		onHit(target, source, move) {
			if (target.status === 'brn') {
				target.cureStatus();
				this.add('-curestatus', target, 'brn', '[from] move: Life Dew');
			}
		},
		heal: [1, 4],
		secondary: null,
		target: "allies",

	},
	lightscreen: {
		num: 113,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Light Screen",
		pp: 30,
		priority: 0,
		flags: { light: 1, snatch: 1, metronome: 1 },
		sideCondition: 'lightscreen',
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasItem('lightclay')) {
					return 8;
				}
				return 5;
			},
			onAnyModifyDamage(damage, source, target, move) {
				if (target !== source && this.effectState.target.hasAlly(target) && this.getCategory(move) === 'Special') {
					if (!target.getMoveHitData(move).crit && !move.infiltrates) {
						this.debug('Light Screen weaken');
						if (this.activePerHalf > 1) return this.chainModify([2732, 4096]);
						return this.chainModify(0.5);
					}
				}
			},
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Light Screen');
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 2,
			onSideEnd(side) {
				this.add('-sideend', side, 'move: Light Screen');
			},
		},
		secondary: null,
		target: "allySide",
	},
	lockon: {
		num: 199,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Lock-On",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTryHit(target, source) {
			if (source.volatiles['lockon']) return false;
		},
		onHit(target, source) {
			source.addVolatile('lockon', target);
			this.add('-activate', source, 'move: Lock-On', `[of] ${target}`);
		},
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			duration: 2,
			onSourceInvulnerabilityPriority: 1,
			onSourceInvulnerability(target, source, move) {
				if (move && source === this.effectState.target && target === this.effectState.source) return 0;
			},
			onSourceAccuracy(accuracy, target, source, move) {
				if (move && source === this.effectState.target && target === this.effectState.source) return true;
			},
		},
		secondary: null,
		target: "normal",
	},
	lovelykiss: {
		num: 142,
		accuracy: 85,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Lovely Kiss",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		status: 'drowsy',
		secondary: null,
		target: "normal",
	},
	lunarblessing: {
		num: 849,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Lunar Blessing",
		pp: 5,
		priority: 0,
		flags: { light: 1, lunar: 1, snatch: 1, heal: 1, metronome: 1 },
		onHit(pokemon) {
			const success = !!this.heal(this.modify(pokemon.maxhp, 0.25));
			return pokemon.cureStatus() || success;
		},
		secondary: null,
		target: "allies",

	},
	lunardance: {
		num: 461,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Lunar Dance",
		pp: 10,
		priority: 0,
		flags: { lunar: 1, snatch: 1, dance: 1, heal: 1, metronome: 1 },
		onTryHit(source) {
			if (!this.canSwitch(source.side)) {
				this.attrLastMove('[still]');
				this.add('-fail', source);
				return this.NOT_FAIL;
			}
		},
		selfdestruct: "ifHit",
		slotCondition: 'lunardance',
		condition: {
			onSwitchIn(target) {
				this.singleEvent('Swap', this.effect, this.effectState, target);
			},
			onSwap(target) {
				if (
					!target.fainted && (
						target.hp < target.maxhp ||
						target.status ||
						target.moveSlots.some(moveSlot => moveSlot.pp < moveSlot.maxpp)
					)
				) {
					target.heal(target.maxhp);
					target.clearStatus();
					for (const moveSlot of target.moveSlots) {
						moveSlot.pp = moveSlot.maxpp;
					}
					this.add('-heal', target, target.getHealth, '[from] move: Lunar Dance');
					target.side.removeSlotCondition(target, 'lunardance');
				}
			},
		},
		secondary: null,
		target: "self",
	},
	magiccoat: {
		num: 277,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Magic Coat",
		pp: 15,
		priority: 4,
		flags: { light: 1, magic: 1, metronome: 1 },
		volatileStatus: 'magiccoat',
		condition: {
			duration: 1,
			onStart(target, source, effect) {
				this.add('-singleturn', target, 'move: Magic Coat');
				if (effect?.effectType === 'Move') { this.effectState.pranksterBoosted = effect.pranksterBoosted; }
			},
			onTryHitPriority: 2,
			onTryHit(target, source, move) {
				if (target === source || move.hasBounced || (!move.flags['reflectable'] && !move.flags['light']) || target.isSemiInvulnerable()) { return; }
				const newMove = this.dex.getActiveMove(move.id);
				// Magic Coat's effect trumps immunity breaking effects: ignore them when reflecting
				newMove.ignoreImmunityBreaking = true;
			},
			onAllyTryHitSide(target, source, move) {
				if (target.isAlly(source) || move.hasBounced || !move.flags['reflectable'] && !move.flags['light'] || target.isSemiInvulnerable()) { return; }
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				newMove.pranksterBoosted = false;
				this.actions.useMove(newMove, this.effectState.target, { target: source });
				move.hasBounced = true; // only bounce once in free-for-all battles
				return null;
			},
		},
		secondary: null,
		target: "self",
	},
	magicpowder: {
		num: 750,
		accuracy: 100,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Magic Powder",
		pp: 20,
		priority: 0,
		flags: { magic: 1, protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1, powder: 1 },
		onHit(target) {
			if (target.getTypes().join() === 'Psychic' || !target.setType('Psychic')) return false;
			this.add('-start', target, 'typechange', 'Psychic');
		},
		secondary: null,
		target: "normal",

	},
	magicroom: {
		num: 478,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Magic Room",
		pp: 10,
		priority: 0,
		flags: { mirror: 1, metronome: 1 },
		pseudoWeather: 'magicroom',
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Magic Room');
					return 7;
				}
				return 5;
			},
			onFieldStart(target, source) {
				if (source?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Magic Room', `[of] ${source}`, '[persistent]');
				} else {
					this.add('-fieldstart', 'move: Magic Room', `[of] ${source}`);
				}
				for (const mon of this.getAllActive()) {
					this.singleEvent('End', mon.getItem(), mon.itemState, mon);
				}
			},
			onFieldRestart(target, source) {
				this.field.removePseudoWeather('magicroom');
			},
			// Item suppression implemented in Pokemon.ignoringItem() within sim/pokemon.js
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 6,
			onFieldEnd() {
				this.add('-fieldend', 'move: Magic Room', '[of] ' + this.effectState.source);
			},
		},
		secondary: null,
		target: "all",
	},
	magneticflux: {
		num: 602,
		accuracy: true,
		basePower: 0,
		type: "Electric",
		category: "Status",
		name: "Magnetic Flux",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, distance: 1, bypasssub: 1, metronome: 1 },
		onHitSide(side, source, move) {
			const targets = side.allies().filter(ally => (
				ally.hasAbility(['plus', 'minus']) &&
				(!ally.volatiles['maxguard'] || this.runEvent('TryHit', ally, source, move))
			));
			if (!targets.length) return false;

			let didSomething = false;
			for (const target of targets) {
				didSomething = this.boost({ def: 1, spd: 1 }, target, source, move, false, true) || didSomething;
			}
			return didSomething;
		},
		secondary: null,
		target: "allySide",
	},
	magnetrise: {
		num: 393,
		accuracy: true,
		basePower: 0,
		type: "Electric",
		category: "Status",
		name: "Magnet Rise",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, gravity: 1, metronome: 1 },
		volatileStatus: 'magnetrise',
		onTry(source, target, move) {
			if (target.volatiles['smackdown'] || target.volatiles['ingrain']) return false;

			// Additional Gravity check for Z-move variant
			if (this.field.getPseudoWeather('Gravity')) {
				this.add('cant', source, 'move: Gravity', move);
				return null;
			}
		},
		condition: {
			duration: 5,
			onStart(target) {
				this.add('-start', target, 'Magnet Rise');
			},
			onImmunity(type) {
				if (type === 'Ground') return false;
			},
			onResidualOrder: 18,
			onEnd(target) {
				this.add('-end', target, 'Magnet Rise');
			},
		},
		secondary: null,
		target: "self",
	},
	matblock: {
		num: 561,
		accuracy: true,
		basePower: 0,
		type: "Fighting",
		category: "Status",
		name: "Mat Block",
		pp: 5,
		priority: 0,
		flags: { cantusetwice: 1, snatch: 1, nonsky: 1, noassist: 1, failcopycat: 1 },
		stallingMove: true,
		sideCondition: 'matblock',
		condition: {
			duration: 1,
			onSideStart(target, source) { this.add('-singleturn', source, 'Mat Block'); },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move && (move.target === 'self' || move.category === 'Status')) return;
				this.add('-activate', target, 'move: Mat Block', move.name);
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) { if (source.volatiles['lockedmove'].duration === 2) { delete source.volatiles['lockedmove']; } }
				return this.NOT_FAIL;
			},
		},
		secondary: null,
		target: "allySide",
	},
	meanlook: {
		num: 212,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Mean Look",
		pp: 5,
		priority: 0,
		flags: { reflectable: 1, mirror: 1, metronome: 1 },
		onHit(target, source, move) {
			return target.addVolatile('trapped', source, move, 'trapper');
		},
		secondary: null,
		target: "normal",
	},
	meditate: {
		num: 96,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Meditate",
		pp: 20,
		priority: 5,
		flags: { snatch: 1, metronome: 1 },
		boosts: {atk: 1,},
		self: { volatileStatus: 'meditate', },
		condition: {
			duration: 1,
			onStart(target, source, effect) {
				this.add('-singleturn', target, 'move: Meditate');
				this.effectState.wasHit = false;
			},
			onModifyAccuracyPriority: -1,
			onModifyAccuracy(accuracy, target, source, move) {
				if (move.category === 'Status') return;
				this.debug('Meditate - decreasing accuracy');
				return this.chainModify([5, 10]); // 50% accuracy (multiply attacker's accuracy by 0.5)
			},
			onHit(target, source, move) {
				if (move?.category !== 'Status') {
					this.effectState.wasHit = true;
					target.removeVolatile('meditate');
				}
			},
			onEnd(target) {
				if (!this.effectState.wasHit) {
					this.boost({atk: 1}, target, target);
					target.addVolatile('focusenergy');
					this.add('-start', target, 'move: Focus Energy', '[from] move: Meditate');
				}
			},
		},
		secondary: null,
		target: "self",
	},
	mefirst: {
		num: 382,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Me First",
		pp: 20,
		priority: 0,
		flags: { protect: 1, bypasssub: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1, },
		onTryHit(target, pokemon) {
			const action = this.queue.willMove(target);
			if (!action) return false;
			const move = this.dex.getActiveMove(action.move.id);
			if (action.zmove || move.isZ || move.isMax) return false;
			if (target.volatiles['mustrecharge']) return false;
			if (move.category === 'Status' || move.flags['failmefirst']) return false;
			pokemon.addVolatile('mefirst');
			this.actions.useMove(move, pokemon, { target });
			return null;
		},
		condition: {
			duration: 1,
			onBasePowerPriority: 12,
			onBasePower(basePower) { return this.chainModify(1.5); },
		},
		callsMove: true,
		secondary: null,
		target: "adjacentFoe",
	},
	memento: {
		num: 262,
		accuracy: 100,
		basePower: 0,
		type: "Dark",
		category: "Status",
		name: "Memento",
		pp: 10,
		priority: 0,
		flags: { magic: 1, protect: 1, mirror: 1, metronome: 1 },
		boosts: {atk: -2, spa: -2,},
		selfdestruct: "ifHit",
		secondary: null,
		target: "normal",
	},
	metalsound: {
		num: 319,
		accuracy: 85,
		basePower: 0,
		type: "Steel",
		category: "Status",
		name: "Metal Sound",
		pp: 40,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, allyanim: 1, metronome: 1 },
		boosts: {spd: -2,},
		secondary: null,
		target: "normal",
	},
	metronome: {
		num: 118,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Metronome",
		pp: 10,
		priority: 0,
		flags: { magic: 1, failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		onHit(pokemon) {
			const moves = this.dex.moves.all().filter(move => (
				(!move.isNonstandard || move.isNonstandard === 'Unobtainable') &&
				move.flags['metronome']
			));
			let randomMove = '';
			if (moves.length) {
				moves.sort((a, b) => a.num - b.num);
				randomMove = this.sample(moves).id;
			}
			if (!randomMove) return false;
			const move = this.dex.getActiveMove(randomMove);
			move.flags['magic'] = 1;
			this.actions.useMove(move, pokemon);
		},
		callsMove: true,
		secondary: null,
		target: "self",
	},
	milkdrink: {
		num: 208,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Milk Drink",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		heal: [1, 2],
		secondary: null,
		target: "self",
	},
	mimic: {
		num: 102,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Mimic",
		pp: 10,
		priority: 0,
		flags: {
			protect: 1, bypasssub: 1, allyanim: 1,
			failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1,
		},
		onHit(target, source) {
			const move = target.lastMove;
			if (source.transformed || !move || move.flags['failmimic'] || source.moves.includes(move.id)) {
				return false;
			}
			if (move.isZ || move.isMax) return false;
			const mimicIndex = source.moves.indexOf('mimic');
			if (mimicIndex < 0) return false;

			source.moveSlots[mimicIndex] = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
				virtual: true,
			};
			this.add('-start', source, 'Mimic', move.name);
		},
		secondary: null,
		target: "normal",
	},
	minimize: {
		num: 107,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Minimize",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		volatileStatus: 'minimize',
		condition: {
			noCopy: true,
			onRestart: () => null,
			onSourceModifyDamage(damage, source, target, move) {
				const boostedMoves = [
					'stomp', 'steamroller', 'bodyslam', 'flyingpress', 'dragonrush', 'heatcrash', 'heavyslam', 'maliciousmoonsault', 'supercellslam',
				];
				if (boostedMoves.includes(move.id)) {
					return this.chainModify(2);
				}
			},
			onAccuracy(accuracy, target, source, move) {
				const boostedMoves = [
					'stomp', 'steamroller', 'bodyslam', 'flyingpress', 'dragonrush', 'heatcrash', 'heavyslam', 'maliciousmoonsault', 'supercellslam',
				];
				if (boostedMoves.includes(move.id)) {
					return true;
				}
				return accuracy;
			},
		},
		boosts: {evasion: 2,},
		secondary: null,
		target: "self",
	},
	mirrorcoat: {
		num: 243,
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon) {
			if (!pokemon.volatiles['mirrorcoat']) return 0;
			return pokemon.volatiles['mirrorcoat'].damage || 1;
		},
		type: "Psychic",
		category: "Status",
		name: "Mirror Coat",
		pp: 20,
		priority: -5,
		flags: { light: 1, protect: 1, failmefirst: 1, noassist: 1 },
		beforeTurnCallback(pokemon) { pokemon.addVolatile('mirrorcoat'); },
		onTry(source) {
			if (!source.volatiles['mirrorcoat']) return false;
			if (source.volatiles['mirrorcoat'].slot === null) return false;
		},
		condition: {
			duration: 1,
			noCopy: true,
			onStart(target, source, move) {
				this.effectState.slot = null;
				this.effectState.damage = 0;
			},
			onRedirectTargetPriority: -1,
			onRedirectTarget(target, source, source2, move) {
				if (move.id !== 'mirrorcoat') return;
				if (source !== this.effectState.target || !this.effectState.slot) return;
				return this.getAtSlot(this.effectState.slot);
			},
			onDamagingHit(damage, target, source, move) {
				if (!source.isAlly(target) && (this.getCategory(move) === 'Special' || move.flags['light'])) {
					this.effectState.slot = source.getSlot();
					this.effectState.damage = 2 * damage;
				}
			},
		},
		secondary: null,
		target: "scripted",
	},
	mirrorshield: {
		num: 4003,
		accuracy: true,
		basePower: 0,
		type: "Ice",
		category: "Status",
		name: "Mirror Shield",
		pp: 10,
		priority: 4,
		flags: { noassist: 1, failcopycat: 1 },
		stallingMove: true,
		volatileStatus: 'mirrorshield',
		onPrepareHit(pokemon) { return !!this.queue.willAct() && this.runEvent('StallMove', pokemon); },
		onHit(pokemon) { pokemon.addVolatile('stall'); },
		condition: {
			duration: 1,
			onStart(target) { this.add('-singleturn', target, 'Mirror Shield'); },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.flags['beam'] || move.flags['light']) {
					this.add('-activate', target, 'move: Mirror Shield');
					const newMove = this.dex.getActiveMove(move.id);
					newMove.hasBounced = true;
					newMove.pranksterBoosted = false;
					this.actions.useMove(newMove, target, { target: source });
					const lockedmove = source.getVolatile('lockedmove');
					if (lockedmove) { if (source.volatiles['lockedmove'].duration === 2) { delete source.volatiles['lockedmove']; } }
					return this.NOT_FAIL;
				}
				if (move.smartTarget) { move.smartTarget = false; } 
				else { this.add('-activate', target, 'move: Mirror Shield'); }
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) { if (source.volatiles['lockedmove'].duration === 2) { delete source.volatiles['lockedmove']; } }
				return this.NOT_FAIL;
			},
		},
		secondary: null,
		target: "self",
	},
	mist: {
		num: 54,
		accuracy: true,
		basePower: 0,
		type: "Ice",
		category: "Status",
		name: "Mist",
		pp: 30,
		priority: 0,
		flags: { magic: 1, snatch: 1, metronome: 1 },
		sideCondition: 'mist',
		condition: {
			duration: 5,
			onTryBoost(boost, target, source, effect) {
				if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
				if (source && target !== source) {
					let showMsg = false;
					let i: BoostID;
					for (i in boost) {
						if (boost[i]! < 0) {
							delete boost[i];
							showMsg = true;
						}
					}
					if (showMsg && !(effect as ActiveMove).secondaries) {
						this.add('-activate', target, 'move: Mist');
					}
				}
			},
			onSideStart(side) {
				this.add('-sidestart', side, 'Mist');
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 4,
			onSideEnd(side) {
				this.add('-sideend', side, 'Mist');
			},
		},
		secondary: null,
		target: "allySide",
	},
	mistyterrain: {
		num: 581,
		accuracy: true,
		basePower: 0,
		type: "Fairy",
		category: "Status",
		name: "Misty Terrain",
		pp: 10,
		priority: 0,
		flags: { nonsky: 1, metronome: 1 },
		terrain: 'mistyterrain',
		condition: {
			effectType: 'Terrain',
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onSetStatus(status, target, source, effect) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (effect && ((effect as Move).status || effect.id === 'yawn')) {
					this.add('-activate', target, 'move: Misty Terrain');
				}
				return false;
			},
			onTryAddVolatile(status, target, source, effect) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (status.id === 'confusion') {
					if (effect.effectType === 'Move' && !effect.secondaries) this.add('-activate', target, 'move: Misty Terrain');
					return null;
				}
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Dragon' && defender.isGrounded() && !defender.isSemiInvulnerable()) {
					this.debug('misty terrain weaken');
					return this.chainModify(0.5);
				}
			},
			onFieldStart(field, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Misty Terrain', '[from] ability: ' + effect.name, `[of] ${source}`);
				} else {
					this.add('-fieldstart', 'move: Misty Terrain');
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'Misty Terrain');
			},
		},
		secondary: null,
		target: "all",
	},
	moonlight: {
		num: 236,
		accuracy: true,
		basePower: 0,
		type: "Fairy",
		category: "Status",
		name: "Moonlight",
		pp: 5,
		priority: 0,
		flags: { light: 1, lunar: 1, snatch: 1, heal: 1, metronome: 1 },
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
			case 'snowscape':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
		secondary: null,
		target: "self",
	},
	morningsun: {
		num: 234,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Morning Sun",
		pp: 5,
		priority: 0,
		flags: { light: 1, solar: 1, snatch: 1, heal: 1, metronome: 1 },
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
			case 'snowscape':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
		secondary: null,
		target: "self",
	},
	nastyplot: {
		num: 417,
		accuracy: true,
		basePower: 0,
		type: "Dark",
		category: "Status",
		name: "Nasty Plot",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {spa: 2,},
		secondary: null,
		target: "self",
	},
	naturepower: {
		num: 267,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		isNonstandard: "Past",
		name: "Nature Power",
		pp: 20,
		priority: 0,
		flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		onTryHit(target, pokemon) {
			let move = 'triattack';
			if (this.field.isTerrain('electricterrain')) 
				{ move = 'thunderbolt'; } 
			else if (this.field.isTerrain('grassyterrain')) 
				{ move = 'energyball'; } 
			else if (this.field.isTerrain('mistyterrain')) 
				{ move = 'moonblast'; } 
			else if (this.field.isTerrain('psychicterrain')) 
				{ move = 'psychic'; }
			else if (this.field.isTerrain('toxicterrain')) 
				{ move = 'poison'; }
			this.actions.useMove(move, pokemon, { target });
			return null;
		},
		callsMove: true,
		secondary: null,
		target: "normal",
	},
	nightmare: {
		num: 171,
		accuracy: true,
		basePower: 0,
		type: "Ghost",
		category: "Status",
		name: "Nightmare",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTryHit(target) {
			if (target.status === 'drowsy') {
				target.cureStatus();
				target.setStatus('slp');
			}
		},
		volatileStatus: 'nightmare',
		condition: {
			noCopy: true,
			onStart(pokemon) {
				if (pokemon.status !== 'slp' && !pokemon.hasAbility('comatose')) { return false; }
				this.add('-start', pokemon, 'Nightmare');
			},
			onResidualOrder: 11,
			onResidual(pokemon) { this.damage(pokemon.baseMaxhp / 4); },
			onEnd(pokemon) { if (pokemon.status !== 'slp' && !pokemon.hasAbility('comatose')) { pokemon.trySetStatus('fear', pokemon); } },
		},
		secondary: null,
		target: "allAdjacent",
	},
	nobleroar: {
		num: 568,
		accuracy: 100,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Noble Roar",
		pp: 30,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		boosts: {atk: -1,spa: -1,},
		secondary: null,
		target: "normal",
	},
	noretreat: {
		num: 748,
		accuracy: true,
		basePower: 0,
		type: "Fighting",
		category: "Status",
		name: "No Retreat",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		volatileStatus: 'noretreat',
		onTry(source, target, move) {
			if (source.volatiles['noretreat']) return false;
			if (source.volatiles['trapped']) {
				delete move.volatileStatus;
			}
		},
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: No Retreat');
			},
			onTrapPokemon(pokemon) {
				pokemon.tryTrap();
			},
		},
		boosts: {atk: 1, def: 1, spa: 1, spd: 1, spe: 1,},
		secondary: null,
		target: "self",
	},
	painsplit: {
		num: 220,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Pain Split",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onHit(target, pokemon) {
			const targetHP = target.getUndynamaxedHP();
			const averagehp = Math.floor((targetHP + pokemon.hp) / 2) || 1;
			const targetChange = targetHP - averagehp;
			target.sethp(target.hp - targetChange);
			this.add('-sethp', target, target.getHealth, '[from] move: Pain Split', '[silent]');
			pokemon.sethp(averagehp);
			this.add('-sethp', pokemon, pokemon.getHealth, '[from] move: Pain Split');
		},
		secondary: null,
		target: "normal",
	},
	partingshot: {
		num: 575,
		accuracy: 100,
		basePower: 0,
		type: "Dark",
		category: "Status",
		name: "Parting Shot",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		onHit(target, source, move) {
			const success = this.boost({ atk: -1, spa: -1 }, target, source);
			if (!success && !target.hasAbility('mirrorarmor')) {
				delete move.selfSwitch;
			}
		},
		selfSwitch: true,
		secondary: null,
		target: "normal",
	},
	perishsong: {
		num: 195,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Perish Song",
		pp: 5,
		priority: 0,
		flags: { sound: 1, distance: 1, bypasssub: 1, metronome: 1 },
		onHitField(target, source, move) {
			let result = false;
			let message = false;
			for (const pokemon of this.getAllActive()) {
				if (this.runEvent('Invulnerability', pokemon, source, move) === false) {
					this.add('-miss', source, pokemon);
					result = true;
				} else if (this.runEvent('TryHit', pokemon, source, move) === null) {
					result = true;
				} else if (!pokemon.volatiles['perishsong']) {
					pokemon.addVolatile('perishsong');
					this.add('-start', pokemon, 'perish3', '[silent]');
					result = true;
					message = true;
				}
			}
			if (!result) return false;
			if (message) this.add('-fieldactivate', 'move: Perish Song');
		},
		condition: {
			duration: 4,
			onEnd(target) {
				this.add('-start', target, 'perish0');
				target.faint();
			},
			onResidualOrder: 24,
			onResidual(pokemon) {
				const duration = pokemon.volatiles['perishsong'].duration;
				this.add('-start', pokemon, `perish${duration}`);
			},
		},
		secondary: null,
		target: "all",
	},
	playnice: {
		num: 589,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Play Nice",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		boosts: {atk: -1,},
		secondary: null,
		target: "normal",
	},
	poisongas: {
		num: 139,
		accuracy: 90,
		basePower: 0,
		type: "Poison",
		category: "Status",
		name: "Poison Gas",
		pp: 40,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		status: 'psn',
		secondary: null,
		target: "allAdjacentFoes",
	},
	poisonpowder: {
		num: 77,
		accuracy: 100,
		basePower: 0,
		type: "Poison",
		category: "Status",
		name: "Poison Powder",
		pp: 35,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1, powder: 1 },
		status: 'psn',
		secondary: null,
		target: "normal",
	},
	powershift: {
		num: 829,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		isNonstandard: "Unobtainable",
		name: "Power Shift",
		pp: 10,
		priority: 0,
		flags: { snatch: 1 },
		volatileStatus: 'powershift',
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Power Shift');
				const newatk = pokemon.storedStats.def;
				const newdef = pokemon.storedStats.atk;
				pokemon.storedStats.atk = newatk;
				pokemon.storedStats.def = newdef;
			},
			onCopy(pokemon) {
				const newatk = pokemon.storedStats.def;
				const newdef = pokemon.storedStats.atk;
				pokemon.storedStats.atk = newatk;
				pokemon.storedStats.def = newdef;
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Power Shift');
				const newatk = pokemon.storedStats.def;
				const newdef = pokemon.storedStats.atk;
				pokemon.storedStats.atk = newatk;
				pokemon.storedStats.def = newdef;
			},
			onRestart(pokemon) {
				pokemon.removeVolatile('Power Shift');
			},
		},
		secondary: null,
		target: "self",

	},
	powersplit: {
		num: 471,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Power Split",
		pp: 10,
		priority: 0,
		flags: { protect: 1, allyanim: 1, metronome: 1 },
		onHit(target, source) {
			const newatk = Math.floor((target.storedStats.atk + source.storedStats.atk) / 2);
			target.storedStats.atk = newatk;
			source.storedStats.atk = newatk;
			const newspa = Math.floor((target.storedStats.spa + source.storedStats.spa) / 2);
			target.storedStats.spa = newspa;
			source.storedStats.spa = newspa;
			this.add('-activate', source, 'move: Power Split', `[of] ${target}`);
		},
		secondary: null,
		target: "normal",
	},
	powerswap: {
		num: 384,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Power Swap",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, bypasssub: 1, allyanim: 1, metronome: 1 },
		onHit(target, source) {
			const targetBoosts: SparseBoostsTable = {};
			const sourceBoosts: SparseBoostsTable = {};
			const atkSpa: BoostID[] = ['atk', 'spa'];
			for (const stat of atkSpa) {
				targetBoosts[stat] = target.boosts[stat];
				sourceBoosts[stat] = source.boosts[stat];
			}
			source.setBoost(targetBoosts);
			target.setBoost(sourceBoosts);
			this.add('-swapboost', source, target, 'atk, spa', '[from] move: Power Swap');
		},
		secondary: null,
		target: "normal",
	},
	powertrick: {
		num: 379,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Power Trick",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		volatileStatus: 'powertrick',
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Power Trick');
				const newatk = pokemon.storedStats.def;
				const newdef = pokemon.storedStats.atk;
				pokemon.storedStats.atk = newatk;
				pokemon.storedStats.def = newdef;
			},
			onCopy(pokemon) {
				const newatk = pokemon.storedStats.def;
				const newdef = pokemon.storedStats.atk;
				pokemon.storedStats.atk = newatk;
				pokemon.storedStats.def = newdef;
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Power Trick');
				const newatk = pokemon.storedStats.def;
				const newdef = pokemon.storedStats.atk;
				pokemon.storedStats.atk = newatk;
				pokemon.storedStats.def = newdef;
			},
			onRestart(pokemon) { pokemon.removeVolatile('Power Trick'); },
		},
		secondary: null,
		target: "self",
	},
	protect: {
		num: 182,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Protect",
		pp: 10,
		priority: 4,
		flags: { noassist: 1, failcopycat: 1 },
		stallingMove: true,
		volatileStatus: 'protect',
		onPrepareHit(pokemon) { return !!this.queue.willAct() && this.runEvent('StallMove', pokemon); },
		onHit(pokemon) { pokemon.addVolatile('stall'); },
		condition: {
			duration: 1,
			onStart(target) { this.add('-singleturn', target, 'Protect'); },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) { move.smartTarget = false; } 
				else { this.add('-activate', target, 'move: Protect'); }
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) { if (source.volatiles['lockedmove'].duration === 2) { delete source.volatiles['lockedmove']; } }
				return this.NOT_FAIL;
			},
		},
		secondary: null,
		target: "self",
	},
	psychicterrain: {
		num: 678,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Psychic Terrain",
		pp: 10,
		priority: 0,
		flags: { nonsky: 1, metronome: 1 },
		terrain: 'psychicterrain',
		condition: {
			effectType: 'Terrain',
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) { return 8; }
				return 5;
			},
			onTryHitPriority: 4,
			onTryHit(target, source, effect) {
				if (effect && (effect.priority <= 0.1 || effect.target === 'self')) { return; }
				if (target.isSemiInvulnerable() || target.isAlly(source)) return;
				if (!target.isGrounded()) {
					const baseMove = this.dex.moves.get(effect.id);
					if (baseMove.priority > 0) { this.hint("Psychic Terrain doesn't affect Pokémon immune to Ground."); }
					return;
				}
				this.add('-activate', target, 'move: Psychic Terrain');
				return null;
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Psychic' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('psychic terrain boost');
					return this.chainModify([5325, 4096]);
				}
			},
			onFieldStart(field, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Psychic Terrain', '[from] ability: ' + effect.name, `[of] ${source}`);
				} else { this.add('-fieldstart', 'move: Psychic Terrain'); }
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() { this.add('-fieldend', 'move: Psychic Terrain'); },
		},
		secondary: null,
		target: "all",
	},
	psychoshift: {
		num: 375,
		accuracy: 100,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Psycho Shift",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTryHit(target, source, move) {
			if (!source.status && !Object.keys(source.volatiles).length) return false;
			if (source.status) move.status = source.status;
			// Transfer all volatile statuses except those that shouldn't be copied
			const excludedVolatiles = [ "substitute", "stall", "protect", "mirrorshield", "matblock", "maxguard", "banefulbunker", "kingsshield", "spikyshield" ];
			for (const v in source.volatiles) {
				if (!excludedVolatiles.includes(v)) {
					target.addVolatile(v);
					source.removeVolatile(v);
				}
			}
		},
		self: { onHit(pokemon) { pokemon.cureStatus(); }, },
		secondary: null,
		target: "normal",
	},
	psychup: {
		num: 244,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Psych Up",
		pp: 10,
		priority: 0,
		flags: { bypasssub: 1, allyanim: 1, metronome: 1 },
		onHit(target, source) {
			let i: BoostID;
			for (i in target.boosts) { source.boosts[i] = target.boosts[i]; }

			const volatilesToCopy = ['dragoncheer', 'focusenergy', 'gmaxchistrike', 'laserfocus'];
			// we need to remove all crit stage volatiles first; otherwise copying e.g. dragoncheer onto a mon with focusenergy
			// will crash the server (since addVolatile fails due to overlap, leaving the source mon with no hasDragonType to set)
			for (const volatile of volatilesToCopy) source.removeVolatile(volatile);
			for (const volatile of volatilesToCopy) {
				if (target.volatiles[volatile]) {
					source.addVolatile(volatile);
					if (volatile === 'gmaxchistrike') source.volatiles[volatile].layers = target.volatiles[volatile].layers;
					if (volatile === 'dragoncheer') source.volatiles[volatile].hasDragonType = target.volatiles[volatile].hasDragonType;
				}
			}
			this.add('-copyboost', source, target, '[from] move: Psych Up');
		},
		secondary: null,
		target: "normal",
	},
	quash: {
		num: 511,
		accuracy: 100,
		basePower: 0,
		type: "Dark",
		category: "Status",
		name: "Quash",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onHit(target) {
			if (this.activePerHalf === 1) return false; // fails in singles
			const action = this.queue.willMove(target);
			if (!action) return false;
			action.order = 201;
			this.add('-activate', target, 'move: Quash');
		},
		secondary: null,
		target: "normal",
	},
	quickguard: {
		num: 501,
		accuracy: true,
		basePower: 0,
		type: "Fighting",
		category: "Status",
		name: "Quick Guard",
		pp: 15,
		priority: 3,
		flags: { snatch: 1 },
		sideCondition: 'quickguard',
		onTry() { return !!this.queue.willAct(); },
		onHitSide(side, source) { source.addVolatile('stall'); },
		condition: {
			duration: 1,
			onSideStart(target, source) { this.add('-singleturn', source, 'Quick Guard'); },
			onTryHitPriority: 4,
			onTryHit(target, source, move) {
				// Quick Guard blocks moves with positive priority, even those given increased priority by Prankster or Gale Wings.
				// (e.g. it blocks 0 priority moves boosted by Prankster or Gale Wings; Quick Claw/Custap Berry do not count)
				if (move.priority <= 0.1) return;
				if (!move.flags['protect']) {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				this.add('-activate', target, 'move: Quick Guard');
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					if (source.volatiles['lockedmove'].duration === 2) { delete source.volatiles['lockedmove']; }
				}
				return this.NOT_FAIL;
			},
		},
		secondary: null,
		target: "allySide",
	},
	quiverdance: {
		num: 483,
		accuracy: true,
		basePower: 0,
		type: "Bug",
		category: "Status",
		name: "Quiver Dance",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, dance: 1, metronome: 1 },
		boosts: {spa: 1, spd: 1, spe: 1,},
		secondary: null,
		target: "self",
	},
	ragepowder: {
		num: 476,
		accuracy: true,
		basePower: 0,
		type: "Bug",
		category: "Status",
		name: "Rage Powder",
		pp: 20,
		priority: 2,
		flags: { noassist: 1, failcopycat: 1, powder: 1 },
		volatileStatus: 'ragepowder',
		onTry(source) { return this.activePerHalf > 1; },
		condition: {
			duration: 1,
			onStart(pokemon) { this.add('-singleturn', pokemon, 'move: Rage Powder'); },
			onFoeRedirectTargetPriority: 1,
			onFoeRedirectTarget(target, source, source2, move) {
				const ragePowderUser = this.effectState.target;
				if (ragePowderUser.isSkyDropped()) return;
				if (source.runStatusImmunity('powder') && this.validTarget(ragePowderUser, source, move.target)) {
					if (move.smartTarget) move.smartTarget = false;
					this.debug("Rage Powder redirected target of move");
					return ragePowderUser;
				}
			},
		},
		secondary: null,
		target: "self",
	},
	raindance: {
		num: 240,
		accuracy: true,
		basePower: 0,
		type: "Water",
		category: "Status",
		name: "Rain Dance",
		pp: 5,
		priority: 0,
		flags: { metronome: 1 },
		weather: 'RainDance',
		secondary: null,
		target: "all",
	},
	recover: {
		num: 105,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Recover",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		heal: [1, 2],
		secondary: null,
		target: "self",
	},
	reaperseal: {
		num: 4004,
		accuracy: true,
		basePower: 0,
		type: "Ghost",
		category: "Status",
		name: "Reaper Seal",
		pp: 10,
		priority: 0,
		flags: { aura: 1, binding: 1, magic: 1, protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		onHit(target, source, move) {
			this.directDamage(source.hp, source, source);
			this.boost({atk: -1, def: -1, spa: -1, spd: -1, spe: -1}, target, source, move);
			target.addVolatile('partiallytrapped', source, move);
		},
		condition: {
			duration: 3,
			onStart(pokemon, source) { this.add('-activate', pokemon, 'move: Reaper Seal', '[of] ' + source); },
			onResidualOrder: 13,
			onEnd(pokemon) { this.add('-end', pokemon, 'Reaper Seal', '[partiallytrapped]'); },
			onTrapPokemon(pokemon) { pokemon.tryTrap(); },
		},
		secondary: null,
		target: "normal",
	},
	recycle: {
		num: 278,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Recycle",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onHit(pokemon, source, move) {
			if (pokemon.item || !pokemon.lastItem) return false;
			const item = pokemon.lastItem;
			pokemon.lastItem = '';
			this.add('-item', pokemon, this.dex.items.get(item), '[from] move: Recycle');
			pokemon.setItem(item, source, move);
		},
		secondary: null,
		target: "self",
	},
	reflect: {
		num: 115,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Reflect",
		pp: 20,
		priority: 0,
		flags: { light: 1, snatch: 1, metronome: 1 },
		sideCondition: 'reflect',
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasItem('lightclay')) { return 8; }
				return 5;
			},
			onAnyModifyDamage(damage, source, target, move) {
				if (target !== source && this.effectState.target.hasAlly(target) && this.getCategory(move) === 'Physical') {
					if (!target.getMoveHitData(move).crit && !move.infiltrates) {
						this.debug('Reflect weaken');
						if (this.activePerHalf > 1) return this.chainModify([2732, 4096]);
						return this.chainModify(0.5);
					}
				}
			},
			onSideStart(side) { this.add('-sidestart', side, 'Reflect'); },
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 1,
			onSideEnd(side) { this.add('-sideend', side, 'Reflect'); },
		},
		secondary: null,
		target: "allySide",
	},
	reflecttype: {
		num: 513,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Reflect Type",
		pp: 15,
		priority: 0,
		flags: { protect: 1, bypasssub: 1, allyanim: 1, metronome: 1 },
		onHit(target, source) {
			if (source.species && (source.species.num === 493 || source.species.num === 773)) return false;
			if (source.terastallized) return false;
			const oldApparentType = source.apparentType;
			let newBaseTypes = target.getTypes(true).filter(type => type !== '???');
			if (!newBaseTypes.length) {
				if (target.addedType) { newBaseTypes = ['Normal']; }
				else { return false; }
			}
			this.add('-start', source, 'typechange', '[from] move: Reflect Type', `[of] ${target}`);
			source.setType(newBaseTypes);
			source.addedType = target.addedType;
			source.knownType = target.isAlly(source) && target.knownType;
			if (!source.knownType) source.apparentType = oldApparentType;
		},
		secondary: null,
		target: "normal",
	},
	refresh: {
		num: 287,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Refresh",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onHit(pokemon) {
			if (['', 'slp', 'frz'].includes(pokemon.status)) return false;
			pokemon.cureStatus();
		},
		secondary: null,
		target: "self",
	},
	rest: {
		num: 156,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Rest",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		onTry(source, target, move) {
			if (move && move.name === 'Sleep Talk') {
				return true;
			}
			if (source.status === 'slp' || source.hasAbility('comatose')) return false;
			if (source.hp === source.maxhp) {
				this.add('-fail', source, 'heal');
				return null;
			}
			if (source.hasAbility('insomnia')) {
				this.add('-fail', source, '[from] ability: Insomnia', `[of] ${source}`);
				return null;
			}
			if (source.hasAbility('vitalspirit')) {
				this.add('-fail', source, '[from] ability: Vital Spirit', `[of] ${source}`);
				return null;
			}
		},
		onHit(target, source, move) {
			const result = target.setStatus('slp', source, move);
			if (!result) return result;
			target.statusState.time = 3;
			target.statusState.startTime = 3;
			this.heal(target.maxhp);
		},
		secondary: null,
		target: "self",
	},
	revivalblessing: {
		num: 863,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Revival Blessing",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		flags: { heal: 1, nosketch: 1 },
		onTryHit(source) { if (!source.side.pokemon.filter(ally => ally.fainted).length) { return false; } },
		slotCondition: 'revivalblessing',
		// No this not a real switchout move
		// This is needed to trigger a switch protocol to choose a fainted party member
		// Feel free to refactor
		selfSwitch: true,
		condition: { duration: 1, }, // reviving implemented in side.ts, kind of
		secondary: null,
		target: "self",

	},
	roar: {
		num: 46,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Roar",
		pp: 20,
		priority: -6,
		flags: { launch: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, allyanim: 1, metronome: 1, noassist: 1, failcopycat: 1 },
		forceSwitch: true,
		secondary: null,
		target: "normal",
	},
	rockpolish: {
		num: 397,
		accuracy: true,
		basePower: 0,
		type: "Rock",
		category: "Status",
		name: "Rock Polish",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {spe: 2,},
		secondary: null,
		target: "self",
	},
	roleplay: {
		num: 272,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Role Play",
		pp: 10,
		priority: 0,
		flags: { bypasssub: 1, allyanim: 1, metronome: 1 },
		onTryHit(target, source) {
			if (target.ability1 === source.ability1 && target.ability2 === source.ability2) return false;
			if (target.getAbility().flags['failroleplay'] || source.getAbility().flags['cantsuppress']) return false;
		},
		onHit(target, source) {
			const oldAbility = source.setAbility(target.ability1, target, undefined, false, false, 1);
			if (target.ability2) source.setAbility(target.ability2, target, undefined, false, false, 2);
			if (!oldAbility) return oldAbility as false | null;
		},
		secondary: null,
		target: "normal",
	},
	roost: {
		num: 355,
		accuracy: true,
		basePower: 0,
		type: "Flying",
		category: "Status",
		name: "Roost",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		heal: [1, 2],
		self: {volatileStatus: 'roost',},
		condition: {
			duration: 1,
			onResidualOrder: 25,
			onStart(target) {
				if (target.terastallized) {
					if (target.hasType('Flying')) { this.add('-hint', "If a Terastallized Pokemon uses Roost, it remains Flying-type."); }
					return false;
				}
				this.add('-singleturn', target, 'move: Roost');
			},
			onTypePriority: -1,
			onType(types, pokemon) {
				this.effectState.typeWas = types;
				return types.filter(type => type !== 'Flying');
			},
		},
		secondary: null,
		target: "self",
	},
	safeguard: {
		num: 219,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Safeguard",
		pp: 25,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		sideCondition: 'safeguard',
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Safeguard');
					return 7;
				}
				return 5;
			},
			onSetStatus(status, target, source, effect) {
				if (!effect || !source) return;
				if (effect.id === 'yawn') return;
				if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
				if (target !== source) {
					this.debug('interrupting setStatus');
					if (effect.name === 'Synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) { this.add('-activate', target, 'move: Safeguard'); }
					return null;
				}
			},
			onTryAddVolatile(status, target, source, effect) {
				if (!effect || !source) return;
				if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
				if ((status.id === 'confusion' || status.id === 'yawn') && target !== source) {
					if (effect.effectType === 'Move' && !effect.secondaries) this.add('-activate', target, 'move: Safeguard');
					return null;
				}
			},
			onSideStart(side, source) {
				if (source?.hasAbility('persistent')) { this.add('-sidestart', side, 'Safeguard', '[persistent]'); } 
				else { this.add('-sidestart', side, 'Safeguard'); }
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 3,
			onSideEnd(side) { this.add('-sideend', side, 'Safeguard'); },
		},
		secondary: null,
		target: "allySide",
	},
	sandattack: {
		num: 28,
		accuracy: 70,
		basePower: 0,
		type: "Ground",
		category: "Status",
		name: "Sand Attack",
		pp: 15,
		priority: 0,
		flags: { throw: 1, protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		boosts: {accuracy: -1,},
		secondary: null,
		target: "normal",
	},
	sandstorm: {
		num: 201,
		accuracy: true,
		basePower: 0,
		type: "Rock",
		category: "Status",
		name: "Sandstorm",
		pp: 10,
		priority: 0,
		flags: { metronome: 1, wind: 1 },
		weather: 'Sandstorm',
		secondary: null,
		target: "all",
	},
	scaryface: {
		num: 184,
		accuracy: 90,
		basePower: 0,
		type: "Dark",
		category: "Status",
		name: "Scary Face",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		status: 'fear',
		secondary: null,
		target: "normal",
	},
	screech: {
		num: 103,
		accuracy: 85,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Screech",
		pp: 40,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, allyanim: 1, metronome: 1 },
		boosts: {def: -2,},
		secondary: null,
		target: "normal",
	},
	sharpen: {
		num: 159,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Sharpen",
		pp: 30,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {atk: 1, accuracy: 1},
		self: { volatileStatus: 'sharpen',  },
		onHit(target, source, move) { source.addVolatile('focusenergy'); },
		condition: {
			noCopy: true,
			onStart(pokemon) { this.add('-start', pokemon, 'Sharpen'); },
			onBasePowerPriority: 8,
			onBasePower(basePower, attacker, defender, move) {
				// 20% boost for claw, slicing, and weapon moves
				if (move.flags['claw'] || move.flags['slicing'] || move.flags['weapon']) {
					this.debug('Sharpen boost');
					return this.chainModify([4915, 4096]); // 1.2x boost
				}
			},
		},
		secondary: null,
		target: "self",
	},
	shedtail: {
		num: 880,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Shed Tail",
		pp: 10,
		priority: 0,
		flags: {},
		volatileStatus: 'substitute',
		onTryHit(source) {
			if (!this.canSwitch(source.side) || source.volatiles['commanded']) {
				this.add('-fail', source);
				return this.NOT_FAIL;
			}
			if (source.volatiles['substitute']) {
				this.add('-fail', source, 'move: Shed Tail');
				return this.NOT_FAIL;
			}
			if (source.hp <= Math.ceil(source.maxhp / 2)) {
				this.add('-fail', source, 'move: Shed Tail', '[weak]');
				return this.NOT_FAIL;
			}
		},
		onHit(target) { this.directDamage(Math.ceil(target.maxhp / 2)); },
		self: { onHit(source) { source.skipBeforeSwitchOutEventFlag = true; }, },
		selfSwitch: 'shedtail',
		secondary: null,
		target: "self",
	},
	shellsmash: {
		num: 504,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Shell Smash",
		pp: 15,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {def: -1, spd: -1, atk: 2, spa: 2, spe: 2,},
		secondary: null,
		target: "self",
	},
	shelter: {
		num: 842,
		accuracy: true,
		basePower: 0,
		type: "Steel",
		category: "Status",
		name: "Shelter",
		pp: 30,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {def: 2,},
		self: {
			volatileStatus: 'shelter',
		},
		condition: {
			noCopy: true,
			onStart(pokemon) { this.add('-start', pokemon, 'Shelter'); },
			onCriticalHit: false, // Immune to critical hits
			onTryBoost(boost, target, source, effect) { if (effect && effect.id === 'feint') { return null; } },
			onModifyMove(move, source, target) { if (move.infiltrates) { delete move.infiltrates; } },
		},
		secondary: null,
		target: "self",
	},
	shiftgear: {
		num: 508,
		accuracy: true,
		basePower: 0,
		type: "Steel",
		category: "Status",
		name: "Shift Gear",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {spe: 2, atk: 1,},
		secondary: null,
		target: "self",
	},
	shoreup: {
		num: 659,
		accuracy: true,
		basePower: 0,
		type: "Ground",
		category: "Status",
		name: "Shore Up",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		onHit(pokemon) {
			let factor = 0.5;
			if (this.field.isWeather('sandstorm')) { factor = 0.667; }
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
		secondary: null,
		target: "self",
	},
	silktrap: {
		num: 852,
		accuracy: true,
		basePower: 0,
		type: "Bug",
		category: "Status",
		name: "Silk Trap",
		pp: 10,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'silktrap',
		onPrepareHit(pokemon) { return !!this.queue.willAct() && this.runEvent('StallMove', pokemon); },
		onHit(pokemon) { pokemon.addVolatile('stall'); },
		condition: {
			duration: 1,
			onStart(target) { this.add('-singleturn', target, 'Protect'); },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) {
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) { move.smartTarget = false; } 
				else { this.add('-activate', target, 'move: Protect'); }
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) { if (source.volatiles['lockedmove'].duration === 2) { delete source.volatiles['lockedmove']; } }
				if (this.checkMoveMakesContact(move, source, target)) { this.boost({ spe: -1 }, source, target, this.dex.getActiveMove("Silk Trap")); }
				return this.NOT_FAIL;
			},
			onHit(target, source, move) { if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) { this.boost({ spe: -1 }, source, target, this.dex.getActiveMove("Silk Trap")); } },
		},
		target: "self",

	},
	simplebeam: {
		num: 493,
		accuracy: 100,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Simple Beam",
		pp: 15,
		priority: 0,
		flags: { beam: 1, protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onTryHit(target) { if (target.getAbility().flags['cantsuppress'] || target.hasAbility('simple') || target.hasAbility('truant')) { return false; } },
		onHit(target, source) {
			const oldAbility = target.setAbility('simple');
			if (!oldAbility) return oldAbility as false | null;
		},
		secondary: null,
		target: "normal",
	},
	sing: {
		num: 47,
		accuracy: 55,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Sing",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		status: 'slp',
		secondary: null,
		target: "normal",
	},
	sketch: {
		num: 166,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Sketch",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		flags: { bypasssub: 1, allyanim: 1, failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1, nosketch: 1, },
		onHit(target, source) {
			const move = target.lastMove;
			if (source.transformed || !move || source.moves.includes(move.id)) return false;
			if (move.flags['nosketch'] || move.isZ || move.isMax) return false;
			const sketchIndex = source.moves.indexOf('sketch');
			if (sketchIndex < 0) return false;
			const sketchedMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
			};
			source.moveSlots[sketchIndex] = sketchedMove;
			source.baseMoveSlots[sketchIndex] = sketchedMove;
			this.add('-activate', source, 'move: Sketch', move.name);
		},
		secondary: null,
		target: "normal",
	},
	skillswap: {
		num: 285,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Skill Swap",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, bypasssub: 1, allyanim: 1, metronome: 1 },
		onTryHit(target, source) {
			const targetAbility = target.getAbility();
			const sourceAbility = source.getAbility();
			if (sourceAbility.flags['failskillswap'] || targetAbility.flags['failskillswap'] || target.volatiles['dynamax']) { return false; }
			const sourceCanBeSet = this.runEvent('SetAbility', source, source, this.effect, targetAbility);
			if (!sourceCanBeSet) return sourceCanBeSet;
			const targetCanBeSet = this.runEvent('SetAbility', target, source, this.effect, sourceAbility);
			if (!targetCanBeSet) return targetCanBeSet;
		},
		onHit(target, source, move) {
			const targetAbility1 = target.getAbility(1);
			const targetAbility2 = target.getAbility(2);
			const sourceAbility1 = source.getAbility(1);
			const sourceAbility2 = source.getAbility(2);
			if (target.isAlly(source)) { this.add('-activate', source, 'move: Skill Swap', '', '', `[of] ${target}`); } 
			else { this.add('-activate', source, 'move: Skill Swap', targetAbility1, sourceAbility1, `[of] ${target}`); }
			// End both abilities for both Pokemon
			this.singleEvent('End', sourceAbility1, source.abilityState1, source);
			this.singleEvent('End', sourceAbility2, source.abilityState2, source);
			this.singleEvent('End', targetAbility1, target.abilityState1, target);
			this.singleEvent('End', targetAbility2, target.abilityState2, target);
			// Swap abilities
			source.ability1 = targetAbility1.id;
			source.ability2 = targetAbility2.id;
			target.ability1 = sourceAbility1.id;
			target.ability2 = sourceAbility2.id;
			// Reinitialize ability states
			source.abilityState1 = this.initEffectState({ id: source.ability1, target: source });
			source.abilityState2 = this.initEffectState({ id: source.ability2, target: source });
			target.abilityState1 = this.initEffectState({ id: target.ability1, target });
			target.abilityState2 = this.initEffectState({ id: target.ability2, target });
			source.volatileStaleness = undefined;
			if (!target.isAlly(source)) target.volatileStaleness = 'external';
			// Start swapped abilities
			this.singleEvent('Start', targetAbility1, source.abilityState1, source);
			this.singleEvent('Start', targetAbility2, source.abilityState2, source);
			this.singleEvent('Start', sourceAbility1, target.abilityState1, target);
			this.singleEvent('Start', sourceAbility2, target.abilityState2, target);
		},
		secondary: null,
		target: "normal",
	},
	slackoff: {
		num: 303,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Slack Off",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		heal: [1, 2],
		secondary: null,
		target: "self",
	},
	sleeppowder: {
		num: 79,
		accuracy: 75,
		basePower: 0,
		type: "Grass",
		category: "Status",
		name: "Sleep Powder",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1, powder: 1 },
		status: 'slp',
		secondary: null,
		target: "normal",
	},
	sleeptalk: {
		num: 214,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Sleep Talk",
		pp: 10,
		priority: 0,
		flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		sleepUsable: true,
		onTry(source) { return source.status === 'slp' || source.hasAbility('comatose'); },
		onHit(pokemon) {
			const moves = [];
			for (const moveSlot of pokemon.moveSlots) {
				const moveid = moveSlot.id;
				if (!moveid) continue;
				const move = this.dex.moves.get(moveid);
				if (move.flags['nosleeptalk'] || move.flags['charge'] || (move.isZ && move.basePower !== 1) || move.isMax) { continue; }
				moves.push(moveid);
			}
			let randomMove = '';
			if (moves.length) randomMove = this.sample(moves);
			if (!randomMove) { return false; }
			this.actions.useMove(randomMove, pokemon);
		},
		callsMove: true,
		secondary: null,
		target: "self",
	},
	smokescreen: {
		num: 108,
		accuracy: 100,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Smokescreen",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		boosts: {accuracy: -1,},
		secondary: null,
		target: "normal",
	},
	snatch: {
		num: 289,
		accuracy: true,
		basePower: 0,
		type: "Dark",
		category: "Status",
		name: "Snatch",
		pp: 10,
		priority: 4,
		flags: { bypasssub: 1, mustpressure: 1, noassist: 1, failcopycat: 1 },
		volatileStatus: 'snatch',
		condition: {
			duration: 1,
			onStart(pokemon) { this.add('-singleturn', pokemon, 'Snatch'); },
			onAnyPrepareHitPriority: -1,
			onAnyPrepareHit(source, target, move) {
				const snatchUser = this.effectState.source;
				if (snatchUser.isSkyDropped()) return;
				if (!move || move.isZ || move.isMax || !move.flags['snatch'] || move.sourceEffect === 'snatch') { return; }
				snatchUser.removeVolatile('snatch');
				this.add('-activate', snatchUser, 'move: Snatch', `[of] ${source}`);
				this.actions.useMove(move.id, snatchUser);
				return null;
			},
		},
		secondary: null,
		target: "self",
	},
	snowscape: {
		num: 883,
		accuracy: true,
		basePower: 0,
		type: "Ice",
		category: "Status",
		name: "Snowscape",
		pp: 10,
		priority: 0,
		flags: {},
		weather: 'snowscape',
		secondary: null,
		target: "all",

	},
	soak: {
		num: 487,
		accuracy: 100,
		basePower: 0,
		type: "Water",
		category: "Status",
		name: "Soak",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onHit(target) {
			if (target.getTypes().join() === 'Water' || !target.setType('Water')) {
				// Soak should animate even when it fails.
				// Returning false would suppress the animation.
				this.add('-fail', target);
				return null;
			}
			this.add('-start', target, 'typechange', 'Water');
		},
		secondary: null,
		target: "normal",
	},
	softboiled: {
		num: 135,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Soft-Boiled",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		heal: [1, 2],
		secondary: null,
		target: "self",
	},
	speedswap: {
		num: 683,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Speed Swap",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, bypasssub: 1, allyanim: 1, metronome: 1 },
		onHit(target, source) {
			const targetSpe = target.storedStats.spe;
			target.storedStats.spe = source.storedStats.spe;
			source.storedStats.spe = targetSpe;
			this.add('-activate', source, 'move: Speed Swap', `[of] ${target}`);
		},
		secondary: null,
		target: "normal",
	},
	spikes: {
		num: 191,
		accuracy: true,
		basePower: 0,
		type: "Ground",
		category: "Status",
		name: "Spikes",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, nonsky: 1, metronome: 1, mustpressure: 1 },
		sideCondition: 'spikes',
		condition: {
			onSideStart(side) {
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 3) return false;
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers++;
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) return;
				const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
				this.damage(damageAmounts[this.effectState.layers] * pokemon.maxhp / 24);
			},
		},
		secondary: null,
		target: "foeSide",
	},
	spikyshield: {
		num: 596,
		accuracy: true,
		basePower: 0,
		type: "Grass",
		category: "Status",
		name: "Spiky Shield",
		pp: 10,
		priority: 4,
		flags: { noassist: 1, failcopycat: 1 },
		stallingMove: true,
		volatileStatus: 'spikyshield',
		onPrepareHit(pokemon) { return !!this.queue.willAct() && this.runEvent('StallMove', pokemon); },
		onHit(pokemon) { pokemon.addVolatile('stall'); },
		condition: {
			duration: 1,
			onStart(target) { this.add('-singleturn', target, 'move: Protect'); },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) { move.smartTarget = false; } 
				else { this.add('-activate', target, 'move: Protect'); }
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) { if (source.volatiles['lockedmove'].duration === 2) { delete source.volatiles['lockedmove']; } }
				if (this.checkMoveMakesContact(move, source, target)) { this.damage(source.baseMaxhp / 8, source, target); }
				return this.NOT_FAIL;
			},
			onHit(target, source, move) { if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) { this.damage(source.baseMaxhp / 8, source, target); } },
		},
		secondary: null,
		target: "self",
	},
	spite: {
		num: 180,
		accuracy: 100,
		basePower: 0,
		type: "Ghost",
		category: "Status",
		name: "Spite",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		onHit(target) {
			let move: Move | ActiveMove | null = target.lastMove;
			if (!move || move.isZ) return false;
			if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
			const ppDeducted = target.deductPP(move.id, 4);
			if (!ppDeducted) return false;
			this.add("-activate", target, 'move: Spite', move.name, ppDeducted);
		},
		secondary: null,
		target: "normal",
	},
	splash: {
		num: 150,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Splash",
		pp: 40,
		priority: 0,
		flags: { gravity: 1, metronome: 1 },
		onTry(source, target, move) {
			if (this.field.getPseudoWeather('Gravity')) {
				this.add('cant', source, 'move: Gravity', move);
				return null;
			}
		},
		onTryHit(target, source) { this.add('-nothing'); },
		secondary: null,
		target: "self",
	},
	spore: {
		num: 147,
		accuracy: 100,
		basePower: 0,
		type: "Grass",
		category: "Status",
		name: "Spore",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1, powder: 1 },
		status: 'slp',
		secondary: null,
		target: "normal",
	},
	stealthrock: {
		num: 446,
		accuracy: true,
		basePower: 0,
		type: "Rock",
		category: "Status",
		name: "Stealth Rock",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, metronome: 1, mustpressure: 1 },
		sideCondition: 'stealthrock',
		condition: {
			onSideStart(side) { this.add('-sidestart', side, 'move: Stealth Rock'); },
			onSwitchIn(pokemon) {
				if (pokemon.hasItem('heavydutyboots')) return;
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
				this.damage(pokemon.maxhp * (2 ** typeMod) / 8);
			},
		},
		secondary: null,
		target: "foeSide",
	},
	stickyweb: {
		num: 564,
		accuracy: true,
		basePower: 0,
		type: "Bug",
		category: "Status",
		name: "Sticky Web",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, metronome: 1 },
		sideCondition: 'stickyweb',
		condition: {
			onSideStart(side) { this.add('-sidestart', side, 'move: Sticky Web'); },
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) return;
				this.add('-activate', pokemon, 'move: Sticky Web');
				this.boost({ spe: -1 }, pokemon, pokemon.side.foe.active[0], this.dex.getActiveMove('stickyweb'));
			},
		},
		secondary: null,
		target: "foeSide",
	},
	stockpile: {
		num: 254,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Stockpile",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onTry(source) { if (source.volatiles['stockpile'] && source.volatiles['stockpile'].layers >= 6) return false; },
		volatileStatus: 'stockpile',
		condition: {
			noCopy: true,
			onStart(target) {
				this.effectState.layers = 1;
				this.effectState.def = 0;
				this.effectState.spd = 0;
				this.add('-start', target, 'stockpile' + this.effectState.layers);
				const [curDef, curSpD] = [target.boosts.def, target.boosts.spd];
				this.boost({ def: 1, spd: 1 }, target, target);
				if (curDef !== target.boosts.def) this.effectState.def--;
				if (curSpD !== target.boosts.spd) this.effectState.spd--;
			},
			onRestart(target) {
				if (this.effectState.layers >= 6) return false;
				this.effectState.layers++;
				this.add('-start', target, 'stockpile' + this.effectState.layers);
				const curDef = target.boosts.def;
				const curSpD = target.boosts.spd;
				this.boost({ def: 1, spd: 1 }, target, target);
				if (curDef !== target.boosts.def) this.effectState.def--;
				if (curSpD !== target.boosts.spd) this.effectState.spd--;
			},
			onEnd(target) {
				if (this.effectState.def || this.effectState.spd) {
					const boosts: SparseBoostsTable = {};
					if (this.effectState.def) boosts.def = this.effectState.def;
					if (this.effectState.spd) boosts.spd = this.effectState.spd;
					this.boost(boosts, target, target);
				}
				this.add('-end', target, 'Stockpile');
				if (this.effectState.def !== this.effectState.layers * -1 || this.effectState.spd !== this.effectState.layers * -1) {
					this.hint("In Gen 7, Stockpile keeps track of how many times it successfully altered each stat individually.");
				}
			},
		},
		secondary: null,
		target: "self",
	},
	strengthsap: {
		num: 668,
		accuracy: 100,
		basePower: 0,
		type: "Grass",
		category: "Status",
		name: "Strength Sap",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, heal: 1, metronome: 1 },
		onHit(target, source) {
			if (target.boosts.atk === -6) return false;
			const atk = target.getStat('atk', false, true);
			const success = this.boost({ atk: -1 }, target, source, null, false, true);
			return !!(this.heal(atk, source, target) || success);
		},
		secondary: null,
		target: "normal",
	},
	stringshot: {
		num: 81,
		accuracy: 95,
		basePower: 0,
		type: "Bug",
		category: "Status",
		name: "String Shot",
		pp: 40,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		boosts: {spe: -2,},
		secondary: null,
		target: "allAdjacentFoes",
	},
	stuffcheeks: {
		num: 747,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Stuff Cheeks",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onDisableMove(pokemon) { if (!pokemon.getItem().isBerry) pokemon.disableMove('stuffcheeks'); },
		onTry(source) { return source.getItem().isBerry; },
		onHit(pokemon) {
			if (!this.boost({ def: 2 })) return null;
			pokemon.eatItem(true);
		},
		secondary: null,
		target: "self",

	},
	stunspore: {
		num: 78,
		accuracy: 85,
		basePower: 0,
		type: "Grass",
		category: "Status",
		name: "Stun Spore",
		pp: 30,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1, powder: 1 },
		status: 'par',
		secondary: null,
		target: "normal",
	},
	substitute: {
		num: 164,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Substitute",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, nonsky: 1, metronome: 1 },
		volatileStatus: 'substitute',
		onTryHit(source) {
			if (source.volatiles['substitute']) {
				this.add('-fail', source, 'move: Substitute');
				return this.NOT_FAIL;
			}
			if (source.hp <= source.maxhp / 4 || source.maxhp === 1) { // Shedinja clause
				this.add('-fail', source, 'move: Substitute', '[weak]');
				return this.NOT_FAIL;
			}
		},
		onHit(target) { this.directDamage(target.maxhp / 4); },
		condition: {
			onStart(target, source, effect) {
				if (effect?.id === 'shedtail') { this.add('-start', target, 'Substitute', '[from] move: Shed Tail'); } 
				else { this.add('-start', target, 'Substitute'); }
				this.effectState.hp = Math.floor(target.maxhp / 4);
				if (target.volatiles['partiallytrapped']) {
					this.add('-end', target, target.volatiles['partiallytrapped'].sourceEffect, '[partiallytrapped]', '[silent]');
					delete target.volatiles['partiallytrapped'];
				}
			},
			onTryPrimaryHitPriority: -1,
			onTryPrimaryHit(target, source, move) {
				if (target === source || move.flags['bypasssub'] || move.infiltrates) { return; }
				let damage = this.actions.getDamage(source, target, move);
				if (!damage && damage !== 0) {
					this.add('-fail', source);
					this.attrLastMove('[still]');
					return null;
				}
				if (damage > target.volatiles['substitute'].hp) { damage = target.volatiles['substitute'].hp as number; }
				target.volatiles['substitute'].hp -= damage;
				source.lastDamage = damage;
				if (target.volatiles['substitute'].hp <= 0) {
					if (move.ohko) this.add('-ohko');
					target.removeVolatile('substitute');
				} else { this.add('-activate', target, 'move: Substitute', '[damage]'); }
				if (move.recoil || move.id === 'chloroblast') { this.damage(this.actions.calcRecoilDamage(damage, move, source), source, target, 'recoil'); }
				if (move.drain) { this.heal(Math.ceil(damage * move.drain[0] / move.drain[1]), source, target, 'drain'); }
				this.singleEvent('AfterSubDamage', move, null, target, source, move, damage);
				this.runEvent('AfterSubDamage', target, source, move, damage);
				return this.HIT_SUBSTITUTE;
			},
			onEnd(target) { this.add('-end', target, 'Substitute'); },
		},
		secondary: null,
		target: "self",
	},
	sunnyday: {
		num: 241,
		accuracy: true,
		basePower: 0,
		type: "Fire",
		category: "Status",
		name: "Sunny Day",
		pp: 5,
		priority: 0,
		flags: { light: 1, solar: 1, metronome: 1 },
		weather: 'sunnyday',
		secondary: null,
		target: "all",
	},
	supersonic: {
		num: 48,
		accuracy: 55,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Supersonic",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		volatileStatus: 'confusion',
		secondary: null,
		target: "normal",
	},
	swagger: {
		num: 207,
		accuracy: 85,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Swagger",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		volatileStatus: 'confusion',
		boosts: {atk: 2,},
		secondary: null,
		target: "normal",
	},
	swallow: {
		num: 256,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Swallow",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		onTry(source, target, move) {
			if (move.sourceEffect === 'snatch') return;
			return !!source.volatiles['stockpile'];
		},
		onHit(pokemon) {
			const layers = pokemon.volatiles['stockpile']?.layers || 1;
			const healAmount = [0.25, 0.5, 1];
			const success = !!this.heal(this.modify(pokemon.maxhp, healAmount[layers - 1]));
			if (!success) this.add('-fail', pokemon, 'heal');
			// Only reduce stockpile by 1 layer instead of removing completely
			if (pokemon.volatiles['stockpile']) {
				pokemon.volatiles['stockpile'].layers--;
				if (pokemon.volatiles['stockpile'].layers <= 0) {
					pokemon.removeVolatile('stockpile');
				} else {
					this.add('-end', pokemon, 'stockpile' + (pokemon.volatiles['stockpile'].layers + 1));
					this.add('-start', pokemon, 'stockpile' + pokemon.volatiles['stockpile'].layers);
					// Adjust stat boost tracking
					if (pokemon.volatiles['stockpile'].def) pokemon.volatiles['stockpile'].def++;
					if (pokemon.volatiles['stockpile'].spd) pokemon.volatiles['stockpile'].spd++;
				}
			}
			return success || this.NOT_FAIL;
		},
		secondary: null,
		target: "self",
	},
	sweetkiss: {
		num: 186,
		accuracy: 75,
		basePower: 0,
		type: "Fairy",
		category: "Status",
		name: "Sweet Kiss",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'confusion',
		secondary: null,
		target: "normal",
	},
	sweetscent: {
		num: 230,
		accuracy: 100,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Sweet Scent",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		boosts: {evasion: -2,},
		secondary: null,
		target: "allAdjacentFoes",
	},
	switcheroo: {
		num: 415,
		accuracy: 100,
		basePower: 0,
		type: "Dark",
		category: "Status",
		name: "Switcheroo",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, allyanim: 1, noassist: 1, failcopycat: 1 },
		onTryImmunity(target) { return !target.hasAbility('stickyhold'); },
		onHit(target, source, move) {
			const yourItem = target.takeItem(source);
			const myItem = source.takeItem();
			if (target.item || source.item || (!yourItem && !myItem)) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
				return false;
			}
			if (
				(myItem && !this.singleEvent('TakeItem', myItem, source.itemState, target, source, move, myItem)) ||
				(yourItem && !this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem))
			) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
				return false;
			}
			this.add('-activate', source, 'move: Trick', `[of] ${target}`);
			if (myItem) {
				target.setItem(myItem);
				this.add('-item', target, myItem, '[from] move: Switcheroo');
			} else { this.add('-enditem', target, yourItem, '[silent]', '[from] move: Switcheroo'); }
			if (yourItem) {
				source.setItem(yourItem);
				this.add('-item', source, yourItem, '[from] move: Switcheroo');
			} else { this.add('-enditem', source, myItem, '[silent]', '[from] move: Switcheroo'); }
		},
		secondary: null,
		target: "normal",
	},
	swordsdance: {
		num: 14,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Swords Dance",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, dance: 1, metronome: 1 },
		boosts: {atk: 2,},
		secondary: null,
		target: "self",
	},
	synthesis: {
		num: 235,
		accuracy: true,
		basePower: 0,
		type: "Grass",
		category: "Status",
		name: "Synthesis",
		pp: 5,
		priority: 0,
		flags: { solar: 1, snatch: 1, heal: 1, metronome: 1 },
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
			case 'snowscape':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
		secondary: null,
		target: "self",
	},
	tailglow: {
		num: 294,
		accuracy: true,
		basePower: 0,
		type: "Bug",
		category: "Status",
		name: "Tail Glow",
		pp: 20,
		priority: 0,
		flags: { light: 1, snatch: 1, metronome: 1 },
		boosts: {spa: 3,},
		secondary: null,
		target: "self",
	},
	tailwhip: {
		num: 39,
		accuracy: 100,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Tail Whip",
		pp: 30,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		boosts: {def: -1,},
		secondary: null,
		target: "allAdjacentFoes",
	},
	tailwind: {
		num: 366,
		accuracy: true,
		basePower: 0,
		type: "Flying",
		category: "Status",
		name: "Tailwind",
		pp: 15,
		priority: 0,
		flags: { snatch: 1, metronome: 1, wind: 1 },
		sideCondition: 'tailwind',
		condition: {
			duration: 4,
			durationCallback(target, source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Tailwind');
					return 6;
				}
				return 4;
			},
			onSideStart(side, source) {
				if (source?.hasAbility('persistent')) { this.add('-sidestart', side, 'move: Tailwind', '[persistent]'); } 
				else { this.add('-sidestart', side, 'move: Tailwind'); }
			},
			onModifySpe(spe, pokemon) { return this.chainModify(2); },
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 5,
			onSideEnd(side) { this.add('-sideend', side, 'move: Tailwind'); },
		},
		secondary: null,
		target: "allySide",
	},
	takeheart: {
		num: 850,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Take Heart",
		pp: 15,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onHit(pokemon) {
			const success = !!this.boost({ spa: 1, spd: 1 });
			return pokemon.cureStatus() || success;
		},
		secondary: null,
		target: "self",

	},
	tarshot: {
		num: 749,
		accuracy: 100,
		basePower: 0,
		type: "Rock",
		category: "Status",
		name: "Tar Shot",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'tarshot',
		condition: {
			onStart(pokemon) {
				if (pokemon.terastallized) return false;
				this.add('-start', pokemon, 'Tar Shot');
			},
			onEffectivenessPriority: -2,
			onEffectiveness(typeMod, target, type, move) {
				if (move.type !== 'Fire') return;
				if (!target) return;
				if (type !== target.getTypes()[0]) return;
				return typeMod + 1;
			},
		},
		boosts: {spe: -1,},
		secondary: null,
		target: "normal",
	},
	taunt: {
		num: 269,
		accuracy: 100,
		basePower: 0,
		type: "Dark",
		category: "Status",
		name: "Taunt",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		volatileStatus: 'taunt',
		condition: {
			duration: 3,
			onStart(target) {
				if (target.activeTurns && !this.queue.willMove(target)) { this.effectState.duration!++; }
				this.add('-start', target, 'move: Taunt');
			},
			onResidualOrder: 15,
			onEnd(target) {
				this.add('-end', target, 'move: Taunt');
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					const move = this.dex.moves.get(moveSlot.id);
					if (move.category === 'Status' && move.id !== 'mefirst') { pokemon.disableMove(moveSlot.id); }
				}
			},
			onBeforeMovePriority: 5,
			onBeforeMove(attacker, defender, move) {
				if (!move.isZ && !move.isMax && move.category === 'Status' && move.id !== 'mefirst') {
					this.add('cant', attacker, 'move: Taunt', move);
					return false;
				}
			},
		},
		secondary: null,
		target: "normal",
	},
	tearfullook: {
		num: 715,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Tearful Look",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, mirror: 1, metronome: 1 },
		boosts: {atk: -1, spa: -1,},
		secondary: null,
		target: "normal",
	},
	teatime: {
		num: 752,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Teatime",
		pp: 10,
		priority: 0,
		flags: { bypasssub: 1, metronome: 1 },
		onHitField(target, source, move) {
			const targets: Pokemon[] = [];
			for (const pokemon of this.getAllActive()) {
				if (this.runEvent('Invulnerability', pokemon, source, move) === false) { this.add('-miss', source, pokemon); } 
				else if (this.runEvent('TryHit', pokemon, source, move) && pokemon.getItem().isBerry) { targets.push(pokemon); }
			}
			this.add('-fieldactivate', 'move: Teatime');
			if (!targets.length) {
				this.add('-fail', source, 'move: Teatime');
				this.attrLastMove('[still]');
				return this.NOT_FAIL;
			}
			for (const pokemon of targets) { pokemon.eatItem(true); }
		},
		secondary: null,
		target: "all",

	},
	teeterdance: {
		num: 298,
		accuracy: 100,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Teeter Dance",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, dance: 1, metronome: 1 },
		volatileStatus: 'confusion',
		secondary: null,
		target: "allAdjacent",
	},
	telekinesis: {
		num: 477,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Telekinesis",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, gravity: 1, allyanim: 1, metronome: 1 },
		volatileStatus: 'telekinesis',
		onTryHit(target, source, move) {
			// Additional Gravity check for Z-move variant
			if (this.field.getPseudoWeather('Gravity')) {
				this.attrLastMove('[still]');
				this.add('cant', source, 'move: Gravity', move);
				return null;
			}
		},
		onModifyMove(move, source, target) {
			if (target && source.isAlly(target)) {
				move.target = 'allySide';
			} else {
				move.target = 'allAdjacentFoes';
			}
		},
		onAfterMove(source, target, move) {
			const terrain = this.field.getTerrain();
			if (terrain && terrain.id === 'psychicterrain') {
				(terrain as any).boostedpsyparticle = true;
				this.add('-fieldactivate', 'Psychic Terrain particles boosted');
			}
		},
		condition: {
			duration: 4,
			onStart(target) {
				if (['Diglett', 'Dugtrio', 'Palossand', 'Sandygast'].includes(target.baseSpecies.baseSpecies) ||
					target.baseSpecies.name === 'Gengar-Mega') {
					this.add('-immune', target);
					return null;
				}
				if (target.volatiles['smackdown'] || target.volatiles['ingrain']) return false;
				this.add('-start', target, 'Telekinesis');
			},
			onAccuracyPriority: -1,
			onAccuracy(accuracy, target, source, move) { if (move && !move.ohko) return true; },
			onImmunity(type) { if (type === 'Ground') return false; },
			onUpdate(pokemon) {
				if (pokemon.baseSpecies.name === 'Gengar-Mega') {
					delete pokemon.volatiles['telekinesis'];
					this.add('-end', pokemon, 'Telekinesis', '[silent]');
				}
			},
			onResidualOrder: 19,
			onEnd(target) { this.add('-end', target, 'Telekinesis'); },
		},
		secondary: null,
		target: "normal",
	},
	teleport: {
		num: 100,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Teleport",
		pp: 20,
		priority: -6,
		flags: { metronome: 1 },
		onTry(source) { return !!this.canSwitch(source.side); },
		selfSwitch: true,
		secondary: null,
		target: "self",
	},
	thunderwave: {
		num: 86,
		accuracy: 90,
		basePower: 0,
		type: "Electric",
		category: "Status",
		name: "Thunder Wave",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		status: 'par',
		ignoreImmunity: false,
		secondary: null,
		target: "normal",
	},
	tickle: {
		num: 321,
		accuracy: 100,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Tickle",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		boosts: {atk: -1, def: -1,},
		secondary: null,
		target: "normal",
	},
	tidyup: {
		num: 882,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Tidy Up",
		pp: 10,
		priority: 0,
		flags: {},
		onHit(pokemon) {
			let success = false;
			for (const active of this.getAllActive()) { if (active.removeVolatile('substitute')) success = true; }
			const removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'steelspikes'];
			const sides = [pokemon.side, ...pokemon.side.foeSidesWithConditions()];
			for (const side of sides) {
				for (const sideCondition of removeAll) {
					if (side.removeSideCondition(sideCondition)) {
						this.add('-sideend', side, this.dex.conditions.get(sideCondition).name);
						success = true;
					}
				}
			}
			if (success) this.add('-activate', pokemon, 'move: Tidy Up');
			return !!this.boost({ atk: 1, spe: 1 }, pokemon, pokemon, null, false, true) || success;
		},
		secondary: null,
		target: "self",

	},
	topsyturvy: {
		num: 576,
		accuracy: true,
		basePower: 0,
		type: "Dark",
		category: "Status",
		name: "Topsy-Turvy",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onHit(target) {
			let success = false;
			let i: BoostID;
			for (i in target.boosts) {
				if (target.boosts[i] === 0) continue;
				target.boosts[i] = -target.boosts[i];
				success = true;
			}
			if (!success) return false;
			this.add('-invertboost', target, '[from] move: Topsy-Turvy');
		},
		secondary: null,
		target: "normal",
	},
	torment: {
		num: 259,
		accuracy: 100,
		basePower: 0,
		type: "Dark",
		category: "Status",
		name: "Torment",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		volatileStatus: 'torment',
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
				if (pokemon.volatiles['dynamax']) {
					delete pokemon.volatiles['torment'];
					return false;
				}
				if (effect?.id === 'gmaxmeltdown') this.effectState.duration = 3;
				this.add('-start', pokemon, 'Torment');
			},
			onEnd(pokemon) { this.add('-end', pokemon, 'Torment'); },
			onDisableMove(pokemon) { if (pokemon.lastMove && pokemon.lastMove.id !== 'struggle') pokemon.disableMove(pokemon.lastMove.id); },
		},
		secondary: null,
		target: "normal",
	},
	toxic: {
		num: 92,
		accuracy: 90,
		basePower: 0,
		type: "Poison",
		category: "Status",
		name: "Toxic",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		// No Guard-like effect for Poison-type users implemented in Scripts#tryMoveHit
		status: 'tox',
		secondary: null,
		target: "normal",
	},
	toxicspikes: {
		num: 390,
		accuracy: true,
		basePower: 0,
		type: "Poison",
		category: "Status",
		name: "Toxic Spikes",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, nonsky: 1, metronome: 1, mustpressure: 1 },
		sideCondition: 'toxicspikes',
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 2) return false;
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectState.layers++;
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded()) return;
				if (pokemon.hasType('Poison')) {
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', `[of] ${pokemon}`);
					pokemon.side.removeSideCondition('toxicspikes');
				} else if (pokemon.hasType('Steel') || pokemon.hasItem('heavydutyboots')) {
				} else if (this.effectState.layers >= 2) { pokemon.trySetStatus('tox', pokemon.side.foe.active[0]); } 
				else { pokemon.trySetStatus('psn', pokemon.side.foe.active[0]); }
			},
		},
		secondary: null,
		target: "foeSide",
	},
	toxicthread: {
		num: 672,
		accuracy: true,
		basePower: 0,
		type: "Poison",
		category: "Status",
		name: "Toxic Thread",
		pp: 5,
		priority: 0,
		flags: { reflectable: 1, nonsky: 1, metronome: 1 },
		sideCondition: 'toxicthread',
		condition: {
			onSideStart(side) { this.add('-sidestart', side, 'move: Toxic Thread'); },
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded()) return;
				this.boost({spe: -1}, pokemon, pokemon.side.foe.active[0], this.dex.getActiveMove('toxicthread'));
				if (pokemon.hasType('Poison') || pokemon.hasType('Steel')) return;
				if (this.field.isTerrain('toxicterrain')) { pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
				} else { pokemon.trySetStatus('psn', pokemon.side.foe.active[0]); }
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 11,
		},
		secondary: null,
		target: "foeSide",
	},
	transform: {
		num: 144,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Transform",
		pp: 10,
		priority: 0,
		flags: { allyanim: 1, failencore: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		onHit(target, pokemon) { if (!pokemon.transformInto(target)) { return false; } },
		secondary: null,
		target: "normal",
	},
	trick: {
		num: 271,
		accuracy: 100,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Trick",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, allyanim: 1, noassist: 1, failcopycat: 1 },
		onTryImmunity(target) { return !target.hasAbility('stickyhold'); },
		onHit(target, source, move) {
			const yourItem = target.takeItem(source);
			const myItem = source.takeItem();
			if (target.item || source.item || (!yourItem && !myItem)) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
				return false;
			}
			if (
				(myItem && !this.singleEvent('TakeItem', myItem, source.itemState, target, source, move, myItem)) ||
				(yourItem && !this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem))
			) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
				return false;
			}
			this.add('-activate', source, 'move: Trick', `[of] ${target}`);
			if (myItem) {
				target.setItem(myItem);
				this.add('-item', target, myItem, '[from] move: Trick');
			} else { this.add('-enditem', target, yourItem, '[silent]', '[from] move: Trick'); }
			if (yourItem) {
				source.setItem(yourItem);
				this.add('-item', source, yourItem, '[from] move: Trick');
			} else { this.add('-enditem', source, myItem, '[silent]', '[from] move: Trick'); }
		},
		secondary: null,
		target: "normal",
	},
	trickroom: {
		num: 433,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Trick Room",
		pp: 5,
		priority: -7,
		flags: { mirror: 1, metronome: 1 },
		pseudoWeather: 'trickroom',
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Trick Room');
					return 7;
				}
				return 5;
			},
			onFieldStart(target, source) {
				if (source?.hasAbility('persistent')) { this.add('-fieldstart', 'move: Trick Room', `[of] ${source}`, '[persistent]'); } 
				else { this.add('-fieldstart', 'move: Trick Room', `[of] ${source}`); }
			},
			onFieldRestart(target, source) { this.field.removePseudoWeather('trickroom'); },
			// Speed modification is changed in Pokemon.getActionSpeed() in sim/pokemon.js
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 1,
			onFieldEnd() { this.add('-fieldend', 'move: Trick Room'); },
		},
		secondary: null,
		target: "all",
	},
	victorydance: {
		num: 837,
		accuracy: true,
		basePower: 0,
		type: "Fighting",
		category: "Status",
		name: "Victory Dance",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, dance: 1, metronome: 1 },
		boosts: {atk: 1, def: 1, spe: 1,},
		secondary: null,
		target: "self",
	},
	whirlwind: {
		num: 18,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Whirlwind",
		pp: 20,
		priority: -6,
		flags: { launch: 1, wind: 1, reflectable: 1, mirror: 1, bypasssub: 1, allyanim: 1, metronome: 1, noassist: 1, failcopycat: 1 },
		forceSwitch: true,
		secondary: null,
		target: "normal",
	},
	wideguard: {
		num: 469,
		accuracy: true,
		basePower: 0,
		type: "Rock",
		category: "Status",
		name: "Wide Guard",
		pp: 10,
		priority: 3,
		flags: { snatch: 1 },
		sideCondition: 'wideguard',
		onTry() { return !!this.queue.willAct(); },
		onHitSide(side, source) { source.addVolatile('stall'); },
		condition: {
			duration: 1,
			onSideStart(target, source) { this.add('-singleturn', source, 'Wide Guard'); },
			onTryHitPriority: 4,
			onTryHit(target, source, move) {
				// Wide Guard blocks all spread moves
				if (move?.target !== 'allAdjacent' && move.target !== 'allAdjacentFoes') { return; }
				if (move.isZ || move.isMax) {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				this.add('-activate', target, 'move: Wide Guard');
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) { if (source.volatiles['lockedmove'].duration === 2) { delete source.volatiles['lockedmove']; } }
				return this.NOT_FAIL;
			},
		},
		secondary: null,
		target: "allySide",
	},
	willowisp: {
		num: 261,
		accuracy: 85,
		basePower: 0,
		type: "Fire",
		category: "Status",
		name: "Will-O-Wisp",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		status: 'brn',
		secondary: null,
		target: "normal",
	},
	wish: {
		num: 273,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Wish",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		slotCondition: 'Wish',
		condition: {
			onStart(pokemon, source) {
				this.effectState.hp = source.maxhp / 2;
				this.effectState.startingTurn = this.getOverflowedTurnCount();
				if (this.effectState.startingTurn === 255) { this.hint(`In Gen 8+, Wish will never resolve when used on the ${this.turn}th turn.`); }
			},
			onResidualOrder: 4,
			onResidual(target: Pokemon) {
					// Pause residual effect if timebreak is active
					if (target.battle.field.getPseudoWeather('timebreak')) return;
				if (this.getOverflowedTurnCount() <= this.effectState.startingTurn) return;
				target.side.removeSlotCondition(this.getAtSlot(this.effectState.sourceSlot), 'wish');
			},
			onEnd(target) {
				if (target && !target.fainted) {
					const damage = this.heal(this.effectState.hp, target, target);
					if (damage) { this.add('-heal', target, target.getHealth, '[from] move: Wish', '[wisher] ' + this.effectState.source.name); }
				}
			},
		},
		secondary: null,
		target: "self",
	},
	withdraw: {
		num: 110,
		accuracy: true,
		basePower: 0,
		type: "Water",
		category: "Status",
		name: "Withdraw",
		pp: 40,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {def: 1,},
		secondary: null,
		target: "self",
	},
	wonderroom: {
		num: 472,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		name: "Wonder Room",
		pp: 10,
		priority: 0,
		flags: { mirror: 1, metronome: 1 },
		pseudoWeather: 'wonderroom',
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Wonder Room');
					return 7;
				}
				return 5;
			},
			onModifyMove(move, source, target) {
				// This code is for moves that use defensive stats as the attacking stat; see below for most of the implementation
				if (!move.overrideOffensiveStat) return;
				const statAndBoosts = move.overrideOffensiveStat;
				if (!['def', 'spd'].includes(statAndBoosts)) return;
				move.overrideOffensiveStat = statAndBoosts === 'def' ? 'spd' : 'def';
				this.hint(`${move.name} uses ${statAndBoosts === 'def' ? '' : 'Sp. '}Def boosts when Wonder Room is active.`);
			},
			onFieldStart(field, source) {
				if (source?.hasAbility('persistent')) { this.add('-fieldstart', 'move: Wonder Room', `[of] ${source}`, '[persistent]'); } 
				else { this.add('-fieldstart', 'move: Wonder Room', `[of] ${source}`); }
			},
			onFieldRestart(target, source) { this.field.removePseudoWeather('wonderroom'); },
			// Swapping defenses partially implemented in sim/pokemon.js:Pokemon#calculateStat and Pokemon#getStat
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 5,
			onFieldEnd() { this.add('-fieldend', 'move: Wonder Room'); },
		},
		secondary: null,
		target: "all",
	},
	workup: {
		num: 526,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Work Up",
		pp: 30,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {atk: 1, spa: 1,},
		secondary: null,
		target: "self",
	},
	worryseed: {
		num: 388,
		accuracy: 100,
		basePower: 0,
		type: "Grass",
		category: "Status",
		name: "Worry Seed",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onTryImmunity(target) {
			// Truant and Insomnia have special treatment; they fail before
			// checking accuracy and will double Stomping Tantrum's BP
			if (target.hasAbility('truant') || target.hasAbility('insomnia')) { return false; }
		},
		onTryHit(target) {
			if (target.getAbility().flags['cantsuppress']) { return false; }
		},
		onHit(target, source) {
			const oldAbility = target.setAbility('insomnia');
			if (!oldAbility) return oldAbility as false | null;
			if (target.status === 'slp') target.cureStatus();
		},
		secondary: null,
		target: "normal",
	},
	yawn: {
		num: 281,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		name: "Yawn",
		pp: 10,
		priority: 0,
		flags: { breath: 1, protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'yawn',
		onTryHit(target) { if (target.status || !target.runStatusImmunity('slp')) { return false; } },
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			duration: 2,
			onStart(target, source) { this.add('-start', target, 'move: Yawn', `[of] ${source}`); },
			onResidualOrder: 23,
			onEnd(target) {
				this.add('-end', target, 'move: Yawn', '[silent]');
				target.trySetStatus('slp', this.effectState.source);
			},
		},
		secondary: null,
		target: "normal",
	},

	//#region MAX MOVES
	maxwyrmwind: {
		num: 768,
		accuracy: true,
		basePower: 10,
		type: "Dragon",
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Wyrmwind",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (const pokemon of source.foes()) { this.boost({ atk: -1 }, pokemon); }
			},
		},
		target: "adjacentFoe",
	},
	maxstrike: {
		num: 760,
		accuracy: true,
		basePower: 10,
		type: "Normal",
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Strike",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (const pokemon of source.foes()) { this.boost({ spe: -1 }, pokemon); }
			},
		},
		target: "adjacentFoe",
	},
	maxsteelspike: {
		num: 774,
		accuracy: true,
		basePower: 10,
		type: "Steel",
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Steelspike",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (const pokemon of source.alliesAndSelf()) { this.boost({ def: 1 }, pokemon); }
			},
		},
		target: "adjacentFoe",
	},
	maxstarfall: {
		num: 767,
		accuracy: true,
		basePower: 10,
		type: "Fairy",
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Starfall",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setTerrain('mistyterrain');
			},
		},
		target: "adjacentFoe",
	},
	maxrockfall: {
		num: 770,
		accuracy: true,
		basePower: 10,
		type: "Rock",
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Rockfall",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setWeather('sandstorm');
			},
		},
		target: "adjacentFoe",
	},
	maxquake: {
		num: 771,
		accuracy: true,
		basePower: 10,
		type: "Ground",
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Quake",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (const pokemon of source.alliesAndSelf()) { this.boost({ spd: 1 }, pokemon); }
			},
		},
		target: "adjacentFoe",
	},
	maxphantasm: {
		num: 762,
		accuracy: true,
		basePower: 10,
		type: "Ghost",
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Phantasm",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (const pokemon of source.foes()) { this.boost({ def: -1 }, pokemon); }
			},
		},
		target: "adjacentFoe",
	},
	maxovergrowth: {
		num: 773,
		accuracy: true,
		basePower: 10,
		type: "Grass",
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Overgrowth",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setTerrain('grassyterrain');
			},
		},
		target: "adjacentFoe",
	},
	maxooze: {
		num: 764,
		accuracy: true,
		basePower: 10,
		type: "Poison",
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Ooze",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (const pokemon of source.alliesAndSelf()) { this.boost({ spa: 1 }, pokemon); }
			},
		},
		target: "adjacentFoe",
	},
	maxmindstorm: {
		num: 769,
		accuracy: true,
		basePower: 10,
		type: "Psychic",
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Mindstorm",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setTerrain('psychicterrain');
			},
		},
		target: "adjacentFoe",
	},
	maxlightning: {
		num: 759,
		accuracy: true,
		basePower: 10,
		type: "Electric",
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Lightning",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setTerrain('electricterrain');
			},
		},
		target: "adjacentFoe",
	},
	maxknuckle: {
		num: 761,
		accuracy: true,
		basePower: 10,
		type: "Fighting",
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Knuckle",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (const pokemon of source.alliesAndSelf()) { this.boost({ atk: 1 }, pokemon); }
			},
		},
		target: "adjacentFoe",
	},
	maxhailstorm: {
		num: 763,
		accuracy: true,
		basePower: 10,
		type: "Ice",
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Hailstorm",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setWeather('hail');
			},
		},
		target: "adjacentFoe",
	},
	maxguard: {
		num: 743,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		isNonstandard: "Past",
		name: "Max Guard",
		pp: 10,
		priority: 4,
		flags: {},
		isMax: true,
		stallingMove: true,
		volatileStatus: 'maxguard',
		onPrepareHit(pokemon) { return !!this.queue.willAct() && this.runEvent('StallMove', pokemon); },
		onHit(pokemon) { pokemon.addVolatile('stall'); },
		condition: {
			duration: 1,
			onStart(target) { this.add('-singleturn', target, 'Max Guard'); },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				const bypassesMaxGuard = [ 'acupressure', 'afteryou', 'allyswitch', 'aromatherapy', 'aromaticmist', 'coaching', 'confide', 'copycat', 'curse', 'decorate', 'doomdesire', 'feint', 'futuresight', 'gmaxoneblow', 'gmaxrapidflow', 'healbell', 'holdhands', 'howl', 'junglehealing', 'lifedew', 'meanlook', 'perishsong', 'playnice', 'powertrick', 'roar', 'roleplay', 'tearfullook', ];
				if (bypassesMaxGuard.includes(move.id)) return;
				if (move.smartTarget) { move.smartTarget = false;
				} 
				else { this.add('-activate', target, 'move: Max Guard'); }
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) { if (source.volatiles['lockedmove'].duration === 2) { delete source.volatiles['lockedmove']; } } // Outrage counter is reset
				return this.NOT_FAIL;
			},
		},
		secondary: null,
		target: "self",
	},
	maxgeyser: {
		num: 765,
		accuracy: true,
		basePower: 10,
		type: "Water",
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Geyser",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setWeather('raindance');
			},
		},
		target: "adjacentFoe",
	},
	maxflutterby: {
		num: 758,
		accuracy: true,
		basePower: 10,
		type: "Bug",
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Flutterby",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (const pokemon of source.foes()) { this.boost({ spa: -1 }, pokemon); }
			},
		},
		target: "adjacentFoe",
	},
	maxflare: {
		num: 757,
		accuracy: true,
		basePower: 100,
		type: "Fire",
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Flare",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setWeather('sunnyday');
			},
		},
		target: "adjacentFoe",
	},
	maxdarkness: {
		num: 772,
		accuracy: true,
		basePower: 10,
		type: "Dark",
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Darkness",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (const pokemon of source.foes()) { this.boost({ spd: -1 }, pokemon); }
			},
		},
		target: "adjacentFoe",
	},
	maxairstream: {
		num: 766,
		accuracy: true,
		basePower: 10,
		type: "Flying",
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Airstream",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (const pokemon of source.alliesAndSelf()) { this.boost({ spe: 1 }, pokemon); }
			},
		},
		target: "adjacentFoe",
	},

	//#region G-MAX MOVES
	gmaxbefuddle: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Bug",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Befuddle",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Butterfree",
		self: {
			onHit(source) {
				for (const pokemon of source.foes()) {
					const result = this.random(3);
					if (result === 0) { pokemon.trySetStatus('slp', source); } 
					else if (result === 1) { pokemon.trySetStatus('par', source); } 
					else { pokemon.trySetStatus('psn', source); }
				}
			},
		},
		target: "adjacentFoe",
	},
	gmaxcannonade: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Water",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Cannonade",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: "Blastoise",
		self: {
			onHit(source) {
				for (const side of source.side.foeSidesWithConditions()) { side.addSideCondition('gmaxcannonade'); }
			},
		},
		condition: {
			duration: 4,
			onSideStart(targetSide) { this.add('-sidestart', targetSide, 'G-Max Cannonade'); },
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(target) { if (!target.hasType('Water')) this.damage(target.baseMaxhp / 6, target); },
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 11,
			onSideEnd(targetSide) { this.add('-sideend', targetSide, 'G-Max Cannonade'); },
		},
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxcentiferno: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Fire",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Centiferno",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Centiskorch",
		self: {
			onHit(source) {
				for (const pokemon of source.foes()) { pokemon.addVolatile('partiallytrapped', source, this.dex.getActiveMove('G-Max Centiferno')); }
			},
		},
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxchistrike: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Fighting",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Chi Strike",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Machamp",
		self: {
			onHit(source) {
				for (const pokemon of source.alliesAndSelf()) { pokemon.addVolatile('gmaxchistrike'); }
			},
		},
		condition: {
			noCopy: true,
			onStart(target, source, effect) {
				this.effectState.layers = 1;
				if (!['costar', 'imposter', 'psychup', 'transform'].includes(effect?.id)) { this.add('-start', target, 'move: G-Max Chi Strike'); }
			},
			onRestart(target, source, effect) {
				if (this.effectState.layers >= 3) return false;
				this.effectState.layers++;
				if (!['costar', 'imposter', 'psychup', 'transform'].includes(effect?.id)) { this.add('-start', target, 'move: G-Max Chi Strike'); }
			},
			onModifyCritRatio(critRatio) { return critRatio + this.effectState.layers; },
		},
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxgoldrush: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Normal",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Gold Rush",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Meowth",
		self: { onHit(source) { for (const pokemon of source.foes()) { pokemon.addVolatile('confusion'); } }, },
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxfoamburst: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Water",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Foam Burst",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Kingler",
		self: { onHit(source) { for (const pokemon of source.foes()) { this.boost({ spe: -2 }, pokemon); } }, },
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxfireball: {
		num: 1000,
		accuracy: true,
		basePower: 160,
		type: "Fire",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Fireball",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Cinderace",
		ignoreAbility: true,
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxfinale: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Fairy",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Finale",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Alcremie",
		self: {
			onHit(target, source, move) { for (const pokemon of source.alliesAndSelf()) { this.heal(pokemon.maxhp / 6, pokemon, source, move); } },
		},
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxdrumsolo: {
		num: 1000,
		accuracy: true,
		basePower: 160,
		type: "Grass",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Drum Solo",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Rillaboom",
		ignoreAbility: true,
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxdepletion: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Dragon",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Depletion",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Duraludon",
		self: {
			onHit(source) {
				for (const pokemon of source.foes()) {
					let move: Move | ActiveMove | null = pokemon.lastMove;
					if (!move || move.isZ) continue;
					if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
					const ppDeducted = pokemon.deductPP(move.id, 2);
					if (ppDeducted) {
						this.add("-activate", pokemon, 'move: G-Max Depletion', move.name, ppDeducted);
						// Don't return here because returning early doesn't trigger
						// activation text for the second Pokemon in doubles
					}
				}
			},
		},
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxcuddle: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Normal",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Cuddle",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Eevee",
		self: { onHit(source) { for (const pokemon of source.foes()) { pokemon.addVolatile('attract'); } }, },
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxwindrage: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Flying",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Wind Rage",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: "Corviknight",
		self: {
			onHit(source) {
				let success = false;
				const removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'steelspikes'];
				const removeTarget = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', ...removeAll];
				for (const targetCondition of removeTarget) {
					if (source.side.foe.removeSideCondition(targetCondition)) {
						if (!removeAll.includes(targetCondition)) continue;
						this.add('-sideend', source.side.foe, this.dex.conditions.get(targetCondition).name, '[from] move: G-Max Wind Rage', `[of] ${source}`);
						success = true;
					}
				}
				for (const sideCondition of removeAll) {
					if (source.side.removeSideCondition(sideCondition)) {
						this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: G-Max Wind Rage', `[of] ${source}`);
						success = true;
					}
				}
				this.field.clearTerrain();
				return success;
			},
		},
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxwildfire: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Fire",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Wildfire",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: "Charizard",
		self: { onHit(source) { for (const side of source.side.foeSidesWithConditions()) { side.addSideCondition('gmaxwildfire'); } }, },
		condition: {
			duration: 4,
			onSideStart(targetSide) { this.add('-sidestart', targetSide, 'G-Max Wildfire'); },
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(target) { if (!target.hasType('Fire')) this.damage(target.baseMaxhp / 6, target); },
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 11,
			onSideEnd(targetSide) { this.add('-sideend', targetSide, 'G-Max Wildfire'); },
		},
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxvoltcrash: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Electric",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Volt Crash",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: "Pikachu",
		self: { onHit(source) { for (const pokemon of source.foes()) { pokemon.trySetStatus('par', source); } }, },
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxvolcalith: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Rock",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Volcalith",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: "Coalossal",
		self: { onHit(source) { for (const side of source.side.foeSidesWithConditions()) { side.addSideCondition('gmaxvolcalith'); } }, },
		condition: {
			duration: 4,
			onSideStart(targetSide) { this.add('-sidestart', targetSide, 'G-Max Volcalith'); },
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(target) { if (!target.hasType('Rock')) this.damage(target.baseMaxhp / 6, target); },
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 11,
			onSideEnd(targetSide) { this.add('-sideend', targetSide, 'G-Max Volcalith'); },
		},
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxvinelash: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Grass",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Vine Lash",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: "Venusaur",
		self: { onHit(source) { for (const side of source.side.foeSidesWithConditions()) { side.addSideCondition('gmaxvinelash'); } }, },
		condition: {
			duration: 4,
			onSideStart(targetSide) { this.add('-sidestart', targetSide, 'G-Max Vine Lash'); },
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(target) { if (!target.hasType('Grass')) this.damage(target.baseMaxhp / 6, target); },
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 11,
			onSideEnd(targetSide) { this.add('-sideend', targetSide, 'G-Max Vine Lash'); },
		},
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxterror: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Ghost",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Terror",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: "Gengar",
		self: { onHit(source) { for (const pokemon of source.foes()) { pokemon.addVolatile('trapped', source, null, 'trapper'); } }, },
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxtartness: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Grass",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Tartness",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: "Flapple",
		self: { onHit(source) { for (const pokemon of source.foes()) { this.boost({ evasion: -1 }, pokemon); } }, },
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxsweetness: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Grass",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Sweetness",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: "Appletun",
		self: { onHit(source) { for (const ally of source.side.pokemon) { ally.cureStatus(); } }, },
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxstunshock: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Electric",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Stun Shock",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: "Toxtricity",
		self: {
			onHit(source) {
				for (const pokemon of source.foes()) {
					const result = this.random(2);
					if (result === 0) { pokemon.trySetStatus('par', source);
					} else { pokemon.trySetStatus('psn', source); }
				}
			},
		},
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxstonesurge: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Water",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Stonesurge",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Drednaw",
		self: { onHit(source) { for (const side of source.side.foeSidesWithConditions()) { side.addSideCondition('stealthrock'); } }, },
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxsteelsurge: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Steel",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Steelsurge",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Copperajah",
		self: { onHit(source) { for (const side of source.side.foeSidesWithConditions()) { side.addSideCondition('steelspikes'); } }, },
		condition: {
			onSideStart(side) { this.add('-sidestart', side, 'move: G-Max Steelsurge'); },
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) return;
				// Ice Face and Disguise correctly get typed damage from Stealth Rock
				// because Stealth Rock bypasses Substitute.
				// They don't get typed damage from Steelsurge because Steelsurge doesn't,
				// so we're going to test the damage of a Steel-type Stealth Rock instead.
				const steelHazard = this.dex.getActiveMove('Stealth Rock');
				steelHazard.type = 'Steel';
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(steelHazard), -6, 6);
				this.damage(pokemon.maxhp * (2 ** typeMod) / 8);
			},
		},
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxsnooze: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Dark",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Snooze",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Grimmsnarl",
		onHit(target) {
			if (target.status || !target.runStatusImmunity('slp')) return;
			if (this.randomChance(1, 2)) return;
			target.addVolatile('yawn');
		},
		onAfterSubDamage(damage, target) {
			if (target.status || !target.runStatusImmunity('slp')) return;
			if (this.randomChance(1, 2)) return;
			target.addVolatile('yawn');
		},
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxsmite: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Fairy",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Smite",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Hatterene",
		self: { onHit(source) { for (const pokemon of source.foes()) { pokemon.addVolatile('confusion', source); } },
		},
		secondary: null,
		target: "adjacentFoe",
	},
	gmaxsandblast: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		type: "Ground",
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Sandblast",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Sandaconda",
		self: { onHit(source) { for (const pokemon of source.foes()) { pokemon.addVolatile('partiallytrapped', source, this.dex.getActiveMove('G-Max Sandblast')); } }, },
		secondary: null,
		target: "adjacentFoe",
	},
	
	//#region Z-MOVES
	"10000000voltthunderbolt": {
		num: 719,
		accuracy: true,
		basePower: 195,
		type: "Electric",
		category: "Special",
		isNonstandard: "Past",
		name: "10,000,000 Volt Thunderbolt",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "pikashuniumz",
		critRatio: 3,
		secondary: null,
		target: "normal",
	},
	aciddownpour: {
		num: 628,
		accuracy: true,
		basePower: 1,
		type: "Poison",
		category: "Physical",
		isNonstandard: "Past",
		name: "Acid Downpour",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "poisoniumz",
		secondary: null,
		target: "normal",
	},
	alloutpummeling: {
		num: 624,
		accuracy: true,
		basePower: 1,
		type: "Fighting",
		category: "Physical",
		isNonstandard: "Past",
		name: "All-Out Pummeling",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "fightiniumz",
		secondary: null,
		target: "normal",
	},
	blackholeeclipse: {
		num: 654,
		accuracy: true,
		basePower: 1,
		type: "Dark",
		category: "Physical",
		isNonstandard: "Past",
		name: "Black Hole Eclipse",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "darkiniumz",
		secondary: null,
		target: "normal",
	},
	bloomdoom: {
		num: 644,
		accuracy: true,
		basePower: 1,
		type: "Grass",
		category: "Physical",
		isNonstandard: "Past",
		name: "Bloom Doom",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "grassiumz",
		secondary: null,
		target: "normal",
	},
	breakneckblitz: {
		num: 622,
		accuracy: true,
		basePower: 1,
		type: "Normal",
		category: "Physical",
		isNonstandard: "Past",
		name: "Breakneck Blitz",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "normaliumz",
		secondary: null,
		target: "normal",
	},
	catastropika: {
		num: 658,
		accuracy: true,
		basePower: 210,
		type: "Electric",
		category: "Physical",
		isNonstandard: "Past",
		name: "Catastropika",
		pp: 1,
		priority: 0,
		flags: { contact: 1 },
		isZ: "pikaniumz",
		secondary: null,
		target: "normal",
	},
	clangoroussoulblaze: {
		num: 728,
		accuracy: true,
		basePower: 185,
		type: "Dragon",
		category: "Special",
		isNonstandard: "Past",
		name: "Clangorous Soulblaze",
		pp: 1,
		priority: 0,
		flags: { sound: 1, bypasssub: 1 }, selfBoost: { boosts: {atk: 1, def: 1, spa: 1, spd: 1, spe: 1,}, },
		secondary: {},// Sheer Force negates the selfBoost even though it is not secondary
		target: "allAdjacentFoes",
	},
	continentalcrush: {
		num: 632,
		accuracy: true,
		basePower: 1,
		type: "Rock",
		category: "Physical",
		isNonstandard: "Past",
		name: "Continental Crush",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "rockiumz",
		secondary: null,
		target: "normal",
	},
	corkscrewcrash: {
		num: 638,
		accuracy: true,
		basePower: 1,
		type: "Steel",
		category: "Physical",
		isNonstandard: "Past",
		name: "Corkscrew Crash",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "steeliumz",
		secondary: null,
		target: "normal",
	},
	devastatingdrake: {
		num: 652,
		accuracy: true,
		basePower: 1,
		type: "Dragon",
		category: "Physical",
		isNonstandard: "Past",
		name: "Devastating Drake",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "dragoniumz",
		secondary: null,
		target: "normal",
	},
	extremeevoboost: {
		num: 702,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		isNonstandard: "Past",
		name: "Extreme Evoboost",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "eeviumz",
		boosts: {atk: 2, def: 2, spa: 2, spd: 2, spe: 2,},
		secondary: null,
		target: "self",
	},
	genesissupernova: {
		num: 703,
		accuracy: true,
		basePower: 185,
		type: "Psychic",
		category: "Special",
		isNonstandard: "Past",
		name: "Genesis Supernova",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "mewniumz",
		secondary: {
			chance: 100,
			self: { onHit() { this.field.setTerrain('psychicterrain'); }, },
		},
		target: "normal",
	},
	gigavolthavoc: {
		num: 646,
		accuracy: true,
		basePower: 1,
		type: "Electric",
		category: "Physical",
		isNonstandard: "Past",
		name: "Gigavolt Havoc",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "electriumz",
		secondary: null,
		target: "normal",
	},
	guardianofalola: {
		num: 698,
		accuracy: true,
		basePower: 0,
		damageCallback(pokemon, target) {
			const hp75 = Math.floor(target.getUndynamaxedHP() * 3 / 4);
			if (
				target.volatiles['protect'] || target.volatiles['banefulbunker'] || target.volatiles['kingsshield'] ||
				target.volatiles['spikyshield'] || target.side.getSideCondition('matblock')
			) {
				this.add('-zbroken', target);
				return this.clampIntRange(Math.ceil(hp75 / 4 - 0.5), 1);
			}
			return this.clampIntRange(hp75, 1);
		},
		type: "Fairy",
		category: "Special",
		isNonstandard: "Past",
		name: "Guardian of Alola",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "tapuniumz",
		secondary: null,
		target: "normal",
	},
	hydrovortex: {
		num: 642,
		accuracy: true,
		basePower: 1,
		type: "Water",
		category: "Physical",
		isNonstandard: "Past",
		name: "Hydro Vortex",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "wateriumz",
		secondary: null,
		target: "normal",
	},
	infernooverdrive: {
		num: 640,
		accuracy: true,
		basePower: 1,
		type: "Fire",
		category: "Physical",
		isNonstandard: "Past",
		name: "Inferno Overdrive",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "firiumz",
		secondary: null,
		target: "normal",
	},
	letssnuggleforever: {
		num: 726,
		accuracy: true,
		basePower: 190,
		type: "Fairy",
		category: "Physical",
		isNonstandard: "Past",
		name: "Let's Snuggle Forever",
		pp: 1,
		priority: 0,
		flags: { contact: 1 },
		isZ: "mimikiumz",
		secondary: null,
		target: "normal",
	},
	lightthatburnsthesky: {
		num: 723,
		accuracy: true,
		basePower: 200,
		type: "Psychic",
		category: "Special",
		isNonstandard: "Past",
		name: "Light That Burns the Sky",
		pp: 1,
		priority: 0,
		flags: {},
		onModifyMove(move, pokemon) { if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical'; },
		ignoreAbility: true,
		isZ: "ultranecroziumz",
		secondary: null,
		target: "normal",
	},
	maliciousmoonsault: {
		num: 696,
		accuracy: true,
		basePower: 180,
		type: "Dark",
		category: "Physical",
		isNonstandard: "Past",
		name: "Malicious Moonsault",
		pp: 1,
		priority: 0,
		flags: { contact: 1 },
		isZ: "inciniumz",
		secondary: null,
		target: "normal",
	},
	menacingmoonrazemaelstrom: {
		num: 725,
		accuracy: true,
		basePower: 200,
		type: "Ghost",
		category: "Special",
		isNonstandard: "Past",
		name: "Menacing Moonraze Maelstrom",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "lunaliumz",
		ignoreAbility: true,
		secondary: null,
		target: "normal",
	},
	neverendingnightmare: {
		num: 636,
		accuracy: true,
		basePower: 1,
		type: "Ghost",
		category: "Physical",
		isNonstandard: "Past",
		name: "Never-Ending Nightmare",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "ghostiumz",
		secondary: null,
		target: "normal",
	},
	oceanicoperetta: {
		num: 697,
		accuracy: true,
		basePower: 195,
		type: "Water",
		category: "Special",
		isNonstandard: "Past",
		name: "Oceanic Operetta",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "primariumz",
		secondary: null,
		target: "normal",
	},
	pulverizingpancake: {
		num: 701,
		accuracy: true,
		basePower: 210,
		type: "Normal",
		category: "Physical",
		isNonstandard: "Past",
		name: "Pulverizing Pancake",
		pp: 1,
		priority: 0,
		flags: { contact: 1 },
		isZ: "snorliumz",
		secondary: null,
		target: "normal",
	},
	savagespinout: {
		num: 634,
		accuracy: true,
		basePower: 1,
		type: "Bug",
		category: "Physical",
		isNonstandard: "Past",
		name: "Savage Spin-Out",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "buginiumz",
		secondary: null,
		target: "normal",
	},
	searingsunrazesmash: {
		num: 724,
		accuracy: true,
		basePower: 200,
		type: "Steel",
		category: "Physical",
		isNonstandard: "Past",
		name: "Searing Sunraze Smash",
		pp: 1,
		priority: 0,
		flags: { contact: 1 },
		isZ: "solganiumz",
		ignoreAbility: true,
		secondary: null,
		target: "normal",
	},
	shatteredpsyche: {
		num: 648,
		accuracy: true,
		basePower: 1,
		type: "Psychic",
		category: "Physical",
		isNonstandard: "Past",
		name: "Shattered Psyche",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "psychiumz",
		secondary: null,
		target: "normal",
	},
	sinisterarrowraid: {
		num: 695,
		accuracy: true,
		basePower: 180,
		type: "Ghost",
		category: "Physical",
		isNonstandard: "Past",
		name: "Sinister Arrow Raid",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "decidiumz",
		secondary: null,
		target: "normal",
	},
	soulstealing7starstrike: {
		num: 699,
		accuracy: true,
		basePower: 195,
		type: "Ghost",
		category: "Physical",
		isNonstandard: "Past",
		name: "Soul-Stealing 7-Star Strike",
		pp: 1,
		priority: 0,
		flags: { contact: 1 },
		isZ: "marshadiumz",
		secondary: null,
		target: "normal",
	},
	splinteredstormshards: {
		num: 727,
		accuracy: true,
		basePower: 190,
		type: "Rock",
		category: "Physical",
		isNonstandard: "Past",
		name: "Splintered Stormshards",
		pp: 1,
		priority: 0,
		flags: {},
		onHit() { this.field.clearTerrain(); },
		onAfterSubDamage() { this.field.clearTerrain(); },
		isZ: "lycaniumz",
		secondary: null,
		target: "normal",
	},
	stokedsparksurfer: {
		num: 700,
		accuracy: true,
		basePower: 175,
		type: "Electric",
		category: "Special",
		isNonstandard: "Past",
		name: "Stoked Sparksurfer",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "aloraichiumz",
		secondary: {
			chance: 100,
			status: 'par',
		},
		target: "normal",
	},
	subzeroslammer: {
		num: 650,
		accuracy: true,
		basePower: 1,
		type: "Ice",
		category: "Physical",
		isNonstandard: "Past",
		name: "Subzero Slammer",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "iciumz",
		secondary: null,
		target: "normal",
	},
	supersonicskystrike: {
		num: 626,
		accuracy: true,
		basePower: 1,
		type: "Flying",
		category: "Physical",
		isNonstandard: "Past",
		name: "Supersonic Skystrike",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "flyiniumz",
		secondary: null,
		target: "normal",
	},
	tectonicrage: {
		num: 630,
		accuracy: true,
		basePower: 1,
		type: "Ground",
		category: "Physical",
		isNonstandard: "Past",
		name: "Tectonic Rage",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "groundiumz",
		secondary: null,
		target: "normal",
	},
	twinkletackle: {
		num: 656,
		accuracy: true,
		basePower: 1,
		type: "Fairy",
		category: "Physical",
		isNonstandard: "Past",
		name: "Twinkle Tackle",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "fairiumz",
		secondary: null,
		target: "normal",
	},

	//#region PAST GEN MOVES
	anchorshot: {
		num: 677,
		accuracy: 100,
		basePower: 80,
		type: "Steel",
		category: "Physical",
		isNonstandard: "Past",
		name: "Anchor Shot",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 100, onHit(target, source, move) { if (source.isActive) target.addVolatile('trapped', source, move, 'trapper'); } },
		target: "normal",
	},
	chipaway: {
		num: 498,
		accuracy: 100,
		basePower: 70,
		type: "Normal",
		category: "Physical",
		isNonstandard: "Past",
		name: "Chip Away",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		ignoreDefensive: true,
		ignoreEvasion: true,
		secondary: null,
		target: "normal",
	},
	clamp: {
		num: 128,
		accuracy: 85,
		basePower: 35,
		type: "Water",
		category: "Physical",
		isNonstandard: "Past",
		name: "Clamp",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
	},
	cometpunch: {
		num: 4,
		accuracy: 85,
		basePower: 18,
		type: "Normal",
		category: "Physical",
		isNonstandard: "Past",
		name: "Comet Punch",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
	},
	constrict: {
		num: 132,
		accuracy: 100,
		basePower: 10,
		type: "Normal",
		category: "Physical",
		isNonstandard: "Past",
		name: "Constrict",
		pp: 35,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 10, boosts: {spe: -1,}, },
		target: "normal",
	},
	dizzypunch: {
		num: 146,
		accuracy: 100,
		basePower: 70,
		type: "Normal",
		category: "Physical",
		isNonstandard: "Past",
		name: "Dizzy Punch",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		secondary: { chance: 20, volatileStatus: 'confusion', },
		target: "normal",
	},
	doubleironbash: {
		num: 742,
		accuracy: 100,
		basePower: 60,
		type: "Steel",
		category: "Physical",
		isNonstandard: "Past",
		name: "Double Iron Bash",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1 },
		multihit: 2,
		secondary: { chance: 30, volatileStatus: 'flinch', },
		target: "normal",
	},
	doubleslap: {
		num: 3,
		accuracy: 85,
		basePower: 15,
		type: "Normal",
		category: "Physical",
		isNonstandard: "Past",
		name: "Double Slap",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
	},
	dualchop: {
		num: 530,
		accuracy: 90,
		basePower: 40,
		type: "Dragon",
		category: "Physical",
		isNonstandard: "Past",
		name: "Dual Chop",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: 2,
		secondary: null,
		target: "normal",
	},
	feintattack: {
		num: 185,
		accuracy: true,
		basePower: 60,
		type: "Dark",
		category: "Physical",
		isNonstandard: "Past",
		name: "Feint Attack",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	fishiousrend: {
		num: 755,
		accuracy: 100,
		basePower: 85,
		basePowerCallback(pokemon, target, move) {
			if (target.newlySwitched || this.queue.willMove(target)) {
				this.debug('Fishious Rend damage boost');
				return move.basePower * 2;
			}
			this.debug('Fishious Rend NOT boosted');
			return move.basePower;
		},
		type: "Water",
		category: "Physical",
		isNonstandard: "Past",
		name: "Fishious Rend",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		secondary: null,
		target: "normal",

	},
	frustration: {
		num: 218,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon) { return Math.floor(((255 - pokemon.happiness) * 10) / 25) || 1; },
		type: "Normal",
		category: "Physical",
		isNonstandard: "Past",
		name: "Frustration",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	heartstamp: {
		num: 531,
		accuracy: 100,
		basePower: 60,
		type: "Psychic",
		category: "Physical",
		isNonstandard: "Past",
		name: "Heart Stamp",
		pp: 25,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, volatileStatus: 'flinch', },
		target: "normal",
	},
	hyperfang: {
		num: 158,
		accuracy: 90,
		basePower: 80,
		type: "Normal",
		category: "Physical",
		isNonstandard: "Past",
		name: "Hyper Fang",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		secondary: { chance: 10, volatileStatus: 'flinch', },
		target: "normal",
	},
	iceball: {
		num: 301,
		accuracy: 90,
		basePower: 30,
		basePowerCallback(pokemon, target, move) {
			let bp = move.basePower;
			const iceballData = pokemon.volatiles['iceball'];
			if (iceballData?.hitCount) { bp *= 2 ** iceballData.contactHitCount; }
			if (iceballData && pokemon.status !== 'slp') {
				iceballData.hitCount++;
				iceballData.contactHitCount++;
				if (iceballData.hitCount < 5) { iceballData.duration = 2; }
			}
			if (pokemon.volatiles['defensecurl']) { bp *= 2; }
			this.debug(`BP: ${bp}`);
			return bp;
		},
		type: "Ice",
		category: "Physical",
		isNonstandard: "Past",
		name: "Ice Ball",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, failinstruct: 1, bullet: 1, noparentalbond: 1 },
		onModifyMove(move, pokemon, target) {
			if (pokemon.volatiles['iceball'] || pokemon.status === 'slp' || !target) return;
			pokemon.addVolatile('iceball');
			if (move.sourceEffect) pokemon.lastMoveTargetLoc = pokemon.getLocOf(target);
		},
		onAfterMove(source, target, move) {
			const iceballData = source.volatiles["iceball"];
			if (
				iceballData &&
				iceballData.hitCount === 5 &&
				iceballData.contactHitCount < 5
				// this conditions can only be met in gen7 and gen8dlc1
				// see `disguise` and `iceface` abilities in the resp mod folders
			) {
				source.addVolatile("rolloutstorage");
				source.volatiles["rolloutstorage"].contactHitCount =
				iceballData.contactHitCount;
			}
		},

		condition: {
			duration: 1,
			onLockMove: 'iceball',
			onStart() {
				this.effectState.hitCount = 0;
				this.effectState.contactHitCount = 0;
			},
			onResidual(target) {
				if (target.lastMove && target.lastMove.id === 'struggle') {
					// don't lock
					delete target.volatiles['iceball'];
				}
			},
		},
		secondary: null,
		target: "normal",
	},
	karatechop: {
		num: 2,
		accuracy: 100,
		basePower: 50,
		type: "Fighting",
		category: "Physical",
		isNonstandard: "Past",
		name: "Karate Chop",
		pp: 25,
		priority: 0,
		flags: { contact: 1, crash: 1, protect: 1, mirror: 1, metronome: 1 },
		critRatio: 2,
		secondary: null,
		target: "normal",
	},
	landswrath: {
		num: 616,
		accuracy: 100,
		basePower: 90,
		type: "Ground",
		category: "Physical",
		isNonstandard: "Past",
		name: "Land's Wrath",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacentFoes",
	},
	meteorassault: {
		num: 794,
		accuracy: 100,
		basePower: 150,
		type: "Fighting",
		category: "Physical",
		isNonstandard: "Past",
		name: "Meteor Assault",
		pp: 5,
		priority: 0,
		flags: { recharge: 1, protect: 1, mirror: 1, failinstruct: 1 },
		self: {volatileStatus: 'mustrecharge',},
		secondary: null,
		target: "normal",

	},
	multiattack: {
		num: 718,
		accuracy: 100,
		basePower: 120,
		type: "Normal",
		category: "Physical",
		isNonstandard: "Past",
		name: "Multi-Attack",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onModifyType(move, pokemon) {
			if (pokemon.ignoringItem()) return;
			move.type = this.runEvent('Memory', pokemon, null, move, 'Normal');
		},
		secondary: null,
		target: "normal",
	},
	naturalgift: {
		num: 363,
		accuracy: 100,
		basePower: 0,
		type: "Normal",
		category: "Physical",
		isNonstandard: "Past",
		name: "Natural Gift",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onModifyType(move, pokemon) {
			if (pokemon.ignoringItem()) return;
			const item = pokemon.getItem();
			if (!item.naturalGift) return;
			move.type = item.naturalGift.type;
		},
		onPrepareHit(target, pokemon, move) {
			if (pokemon.ignoringItem()) return false;
			const item = pokemon.getItem();
			if (!item.naturalGift) return false;
			move.basePower = item.naturalGift.basePower;
			this.debug(`BP: ${move.basePower}`);
			pokemon.setItem('');
			pokemon.lastItem = item.id;
			pokemon.usedItemThisTurn = true;
			this.runEvent('AfterUseItem', pokemon, null, null, item);
		},
		secondary: null,
		target: "normal",
	},
	plasmafists: {
		num: 721,
		accuracy: 100,
		basePower: 100,
		type: "Electric",
		category: "Physical",
		isNonstandard: "Past",
		name: "Plasma Fists",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1 },
		pseudoWeather: 'iondeluge',
		secondary: null,
		target: "normal",
	},
	punishment: {
		num: 386,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			let power = 60 + 20 * target.positiveBoosts();
			if (power > 200) power = 200;
			this.debug(`BP: ${power}`);
			return power;
		},
		type: "Dark",
		category: "Physical",
		isNonstandard: "Past",
		name: "Punishment",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	rage: {
		num: 99,
		accuracy: 100,
		basePower: 20,
		type: "Normal",
		category: "Physical",
		isNonstandard: "Past",
		name: "Rage",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {volatileStatus: 'rage',},
		condition: {
			onStart(pokemon) { this.add('-singlemove', pokemon, 'Rage'); },
			onHit(target, source, move) { if (target !== source && move.category !== 'Status') { this.boost({ atk: 1 }); } },
			onBeforeMovePriority: 100,
			onBeforeMove(pokemon) {
				this.debug('removing Rage before attack');
				pokemon.removeVolatile('rage');
			},
		},
		secondary: null,
		target: "normal",
	},
	return: {
		num: 216,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon) { return Math.floor((pokemon.happiness * 10) / 25) || 1; },
		type: "Normal",
		category: "Physical",
		isNonstandard: "Past",
		name: "Return",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	revenge: {
		num: 279,
		accuracy: 100,
		basePower: 60,
		basePowerCallback(pokemon, target, move) {
			const damagedByTarget = pokemon.attackedBy.some( p => p.source === target && p.damage > 0 && p.thisTurn );
			if (damagedByTarget) {
				this.debug(`BP doubled for getting hit by ${target}`);
				return move.basePower * 2;
			}
			return move.basePower;
		},
		type: "Fighting",
		category: "Physical",
		isNonstandard: "Past",
		name: "Revenge",
		pp: 10,
		priority: -4,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	rollingkick: {
		num: 27,
		accuracy: 85,
		basePower: 60,
		type: "Fighting",
		category: "Physical",
		isNonstandard: "Past",
		name: "Rolling Kick",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, volatileStatus: 'flinch', },
		target: "normal",
	},
	
	secretpower: {
		num: 290,
		accuracy: 100,
		basePower: 70,
		type: "Normal",
		category: "Physical",
		isNonstandard: "Past",
		name: "Secret Power",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onModifyMove(move, pokemon) {
			if (this.field.isTerrain('')) return;
		move.secondaries = [];
			if (this.field.isTerrain('electricterrain')) { move.secondaries.push({ chance: 30, status: 'par', }); } 
			else if (this.field.isTerrain('grassyterrain')) { move.secondaries.push({ chance: 30, status: 'slp', }); } 
			else if (this.field.isTerrain('mistyterrain')) { move.secondaries.push({ chance: 30, boosts: {spa: -1,},}); } 
			else if (this.field.isTerrain('psychicterrain')) { move.secondaries.push({ chance: 30, boosts: { spe: -1, }, }); }
		},
		secondary: { chance: 30, status: 'par', },
		target: "normal",
	},
	
	skullbash: {
		num: 130,
		accuracy: 100,
		basePower: 130,
		type: "Normal",
		category: "Physical",
		isNonstandard: "Past",
		name: "Skull Bash",
		pp: 10,
		priority: 0,
		flags: { contact: 1, charge: 1, protect: 1, mirror: 1, metronome: 1, nosleeptalk: 1, failinstruct: 1 },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) { return; }
			this.add('-prepare', attacker, move.name);
			this.boost({ def: 1 }, attacker, attacker, move);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) { return; }
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		secondary: null,
		target: "normal",
	},
	skyuppercut: {
		num: 327,
		accuracy: 90,
		basePower: 85,
		type: "Fighting",
		category: "Physical",
		isNonstandard: "Past",
		name: "Sky Uppercut",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	smellingsalts: {
		num: 265,
		accuracy: 100,
		basePower: 70,
		basePowerCallback(pokemon, target, move) {
			if (target.status === 'par') {
				this.debug('BP doubled on paralyzed target');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		type: "Normal",
		category: "Physical",
		isNonstandard: "Past",
		name: "Smelling Salts",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onHit(target) { if (target.status === 'par') target.cureStatus(); },
		secondary: null,
		target: "normal",
	},
	snaptrap: {
		num: 779,
		accuracy: 100,
		basePower: 35,
		type: "Grass",
		category: "Physical",
		isNonstandard: "Past",
		name: "Snap Trap",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",

	},
	spectralthief: {
		num: 712,
		accuracy: 100,
		basePower: 90,
		type: "Ghost",
		category: "Physical",
		isNonstandard: "Past",
		name: "Spectral Thief",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, bypasssub: 1 },
		stealsBoosts: true,
		// Boost stealing implemented in scripts.js
		secondary: null,
		target: "normal",
	},
	spikecannon: {
		num: 131,
		accuracy: 100,
		basePower: 20,
		type: "Normal",
		category: "Physical",
		isNonstandard: "Past",
		name: "Spike Cannon",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
	},
	stormthrow: {
		num: 480,
		accuracy: 100,
		basePower: 60,
		type: "Fighting",
		category: "Physical",
		isNonstandard: "Past",
		name: "Storm Throw",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		willCrit: true,
		secondary: null,
		target: "normal",
	},
	submission: {
		num: 66,
		accuracy: 80,
		basePower: 80,
		type: "Fighting",
		category: "Physical",
		isNonstandard: "Past",
		name: "Submission",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		recoil: [1, 4],
		secondary: null,
		target: "normal",
	},
	thousandarrows: {
		num: 614,
		accuracy: 100,
		basePower: 90,
		type: "Ground",
		category: "Physical",
		isNonstandard: "Past",
		name: "Thousand Arrows",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, nonsky: 1 },
		onEffectiveness(typeMod, target, type, move) {
			if (move.type !== 'Ground') return;
			if (!target) return; // avoid crashing when called from a chat plugin
			// ignore effectiveness if the target is Flying type and immune to Ground
			if (!target.runImmunity('Ground')) { if (target.hasType('Flying')) return 0; }
		},
		volatileStatus: 'smackdown',
		ignoreImmunity: { 'Ground': true },
		secondary: null,
		target: "allAdjacentFoes",
	},
	thousandwaves: {
		num: 615,
		accuracy: 100,
		basePower: 90,
		type: "Ground",
		category: "Physical",
		isNonstandard: "Past",
		name: "Thousand Waves",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, nonsky: 1 },
		onHit(target, source, move) { if (source.isActive) target.addVolatile('trapped', source, move, 'trapper'); },
		secondary: null,
		target: "allAdjacentFoes",
	},
	wakeupslap: {
		num: 358,
		accuracy: 100,
		basePower: 70,
		basePowerCallback(pokemon, target, move) {
			if (target.status === 'slp' || target.hasAbility('comatose')) {
				this.debug('BP doubled on sleeping target');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		type: "Fighting",
		category: "Physical",
		isNonstandard: "Past",
		name: "Wake-Up Slap",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onHit(target) { if (target.status === 'slp') target.cureStatus(); },
		secondary: null,
		target: "normal",
	},
	
	chatter: {
		num: 448,
		accuracy: 100,
		basePower: 65,
		type: "Flying",
		category: "Special",
		isNonstandard: "Past",
		name: "Chatter",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, distance: 1, bypasssub: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1, },
		secondary: { chance: 100, volatileStatus: 'confusion', },
		target: "any",
	},
	coreenforcer: {
		num: 687,
		accuracy: 100,
		basePower: 100,
		type: "Dragon",
		category: "Special",
		isNonstandard: "Past",
		name: "Core Enforcer",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onHit(target) {
			if (target.getAbility().flags['cantsuppress']) return;
			if (target.newlySwitched || this.queue.willMove(target)) return;
			target.addVolatile('gastroacid');
		},
		onAfterSubDamage(damage, target) {
			if (target.getAbility().flags['cantsuppress']) return;
			if (target.newlySwitched || this.queue.willMove(target)) return;
			target.addVolatile('gastroacid');
		},
		secondary: null,
		target: "allAdjacentFoes",
	},
	eternabeam: {
		num: 795,
		accuracy: 90,
		basePower: 160,
		type: "Dragon",
		category: "Special",
		isNonstandard: "Past",
		name: "Eternabeam",
		pp: 5,
		priority: 0,
		flags: { recharge: 1, protect: 1, mirror: 1 },
		self: {volatileStatus: 'mustrecharge',},
		secondary: null,
		target: "normal",

	},
	leaftornado: {
		num: 536,
		accuracy: 90,
		basePower: 65,
		type: "Grass",
		category: "Special",
		isNonstandard: "Past",
		name: "Leaf Tornado",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 50, boosts: {accuracy: -1,}, },
		target: "normal",
	},
	lightofruin: {
		num: 617,
		accuracy: 90,
		basePower: 140,
		type: "Fairy",
		category: "Special",
		isNonstandard: "Past",
		name: "Light of Ruin",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		recoil: [1, 2],
		secondary: null,
		target: "normal",
	},
	mindblown: {
		num: 720,
		accuracy: 100,
		basePower: 150,
		type: "Fire",
		category: "Special",
		isNonstandard: "Past",
		name: "Mind Blown",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		mindBlownRecoil: true,
		onAfterMove(pokemon, target, move) {
			if (move.mindBlownRecoil && !move.multihit) {
				const hpBeforeRecoil = pokemon.hp;
				this.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get('Mind Blown'), true);
				if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) { this.runEvent('EmergencyExit', pokemon, pokemon); }
			}
		},
		secondary: null,
		target: "allAdjacent",
	},
	mirrorshot: {
		num: 429,
		accuracy: 85,
		basePower: 65,
		type: "Steel",
		category: "Special",
		isNonstandard: "Past",
		name: "Mirror Shot",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 30, boosts: {accuracy: -1,}, },
		target: "normal",
	},
	mudbomb: {
		num: 426,
		accuracy: 85,
		basePower: 65,
		type: "Ground",
		category: "Special",
		isNonstandard: "Past",
		name: "Mud Bomb",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: { chance: 30, boosts: {accuracy: -1,}, },
		target: "normal",
	},
	naturesmadness: {
		num: 717,
		accuracy: 90,
		basePower: 0,
		damageCallback(pokemon, target) { return this.clampIntRange(Math.floor(target.getUndynamaxedHP() / 2), 1); },
		type: "Fairy",
		category: "Special",
		isNonstandard: "Past",
		name: "Nature's Madness",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
	},
	oblivionwing: {
		num: 613,
		accuracy: 100,
		basePower: 80,
		type: "Flying",
		category: "Special",
		isNonstandard: "Past",
		name: "Oblivion Wing",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, heal: 1, metronome: 1 },
		drain: [3, 4],
		secondary: null,
		target: "any",
	},
	octazooka: {
		num: 190,
		accuracy: 85,
		basePower: 65,
		type: "Water",
		category: "Special",
		isNonstandard: "Past",
		name: "Octazooka",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: { chance: 50, boosts: {accuracy: -1,}, },
		target: "normal",
	},
	ominouswind: {
		num: 466,
		accuracy: 100,
		basePower: 60,
		type: "Ghost",
		category: "Special",
		isNonstandard: "Past",
		name: "Ominous Wind",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 10, self: {boosts: {atk: 1, def: 1, spa: 1, spd: 1, spe: 1,},}, },
		target: "normal",
	},
	psywave: {
		num: 149,
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon) { return (this.random(50, 151) * pokemon.level) / 100; },
		type: "Psychic",
		category: "Special",
		isNonstandard: "Past",
		name: "Psywave",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	razorwind: {
		num: 13,
		accuracy: 100,
		basePower: 80,
		type: "Normal",
		category: "Special",
		isNonstandard: "Past",
		name: "Razor Wind",
		pp: 10,
		priority: 0,
		flags: { charge: 1, protect: 1, mirror: 1, metronome: 1, nosleeptalk: 1, failinstruct: 1 },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) { return; }
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) { return; }
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		critRatio: 2,
		secondary: null,
		target: "allAdjacentFoes",
	},
	searingshot: {
		num: 545,
		accuracy: 100,
		basePower: 100,
		type: "Fire",
		category: "Special",
		isNonstandard: "Past",
		name: "Searing Shot",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: { chance: 30, status: 'brn', },
		target: "allAdjacent",
	},
	shelltrap: {
		num: 704,
		accuracy: 100,
		basePower: 150,
		type: "Fire",
		category: "Special",
		isNonstandard: "Past",
		name: "Shell Trap",
		pp: 5,
		priority: -3,
		flags: { protect: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1 },
		priorityChargeCallback(pokemon) { pokemon.addVolatile('shelltrap'); },
		onTryMove(pokemon) {
			if (!pokemon.volatiles['shelltrap']?.gotHit) {
				this.attrLastMove('[still]');
				this.add('cant', pokemon, 'Shell Trap', 'Shell Trap');
				return null;
			}
		},
		condition: {
			duration: 1,
			onStart(pokemon) { this.add('-singleturn', pokemon, 'move: Shell Trap'); },
			onHit(pokemon, source, move) {
				if (!pokemon.isAlly(source) && move.category === 'Physical') {
					this.effectState.gotHit = true;
					const action = this.queue.willMove(pokemon);
					if (action) { this.queue.prioritizeAction(action); }
				}
			},
		},
		secondary: null,
		target: "allAdjacentFoes",
	},
	silverwind: {
		num: 318,
		accuracy: 100,
		basePower: 60,
		type: "Bug",
		category: "Special",
		isNonstandard: "Past",
		name: "Silver Wind",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: { chance: 10, self: {boosts: {atk: 1, def: 1, spa: 1, spd: 1, spe: 1,},}, },
		target: "normal",
	},
	sonicboom: {
		num: 49,
		accuracy: 90,
		basePower: 0,
		damage: 20,
		type: "Normal",
		category: "Special",
		isNonstandard: "Past",
		name: "Sonic Boom",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	synchronoise: {
		num: 485,
		accuracy: 100,
		basePower: 120,
		type: "Psychic",
		category: "Special",
		isNonstandard: "Past",
		name: "Synchronoise",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTryImmunity(target, source) { return target.hasType(source.getTypes()); },
		secondary: null,
		target: "allAdjacent",
	},
	technoblast: {
		num: 546,
		accuracy: 100,
		basePower: 120,
		type: "Normal",
		category: "Special",
		isNonstandard: "Past",
		name: "Techno Blast",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onModifyType(move, pokemon) {
			if (pokemon.ignoringItem()) return;
			move.type = this.runEvent('Drive', pokemon, null, move, 'Normal');
		},
		secondary: null,
		target: "normal",
	},
	trumpcard: {
		num: 376,
		accuracy: true,
		basePower: 0,
		basePowerCallback(source, target, move) {
			const callerMoveId = move.sourceEffect || move.id;
			const moveSlot = callerMoveId === 'instruct' ? source.getMoveData(move.id) : source.getMoveData(callerMoveId);
			let bp;
			if (!moveSlot) { bp = 40; } 
			else {
				switch (moveSlot.pp) {
				case 0:
					bp = 200;
					break;
				case 1:
					bp = 80;
					break;
				case 2:
					bp = 60;
					break;
				case 3:
					bp = 50;
					break;
				default:
					bp = 40;
					break;
				}
			}

			this.debug(`BP: ${bp}`);
			return bp;
		},
		type: "Normal",
		category: "Special",
		isNonstandard: "Past",
		name: "Trump Card",
		pp: 5,
		noPPBoosts: true,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	wringout: {
		num: 378,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target, move) {
			const hp = target.hp;
			const maxHP = target.maxhp;
			const bp = Math.floor(Math.floor((120 * (100 * Math.floor(hp * 4096 / maxHP)) + 2048 - 1) / 4096) / 100) || 1;
			this.debug(`BP for ${hp}/${maxHP} HP: ${bp}`);
			return bp;
		},
		type: "Normal",
		category: "Special",
		isNonstandard: "Past",
		name: "Wring Out",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
	},
	assist: {
		num: 274,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		isNonstandard: "Past",
		name: "Assist",
		pp: 20,
		priority: 0,
		flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		onHit(target) {
			const moves = [];
			for (const pokemon of target.side.pokemon) {
				if (pokemon === target) continue;
				for (const moveSlot of pokemon.moveSlots) {
					const moveid = moveSlot.id;
					const move = this.dex.moves.get(moveid);
					if (move.flags['noassist'] || move.isZ || move.isMax) { continue; }
					moves.push(moveid);
				}
			}
			let randomMove = '';
			if (moves.length) randomMove = this.sample(moves);
			if (!randomMove) { return false; }
			this.actions.useMove(randomMove, target);
		},
		callsMove: true,
		secondary: null,
		target: "self",
	},
	barrier: {
		num: 112,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		isNonstandard: "Past",
		name: "Barrier",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {def: 2,},
		secondary: null,
		target: "self",
	},
	bestow: {
		num: 516,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		isNonstandard: "Past",
		name: "Bestow",
		pp: 15,
		priority: 0,
		flags: { mirror: 1, bypasssub: 1, allyanim: 1, noassist: 1, failcopycat: 1 },
		onHit(target, source, move) {
			if (target.item) { return false; }
			const myItem = source.takeItem();
			if (!myItem) return false;
			if (!this.singleEvent('TakeItem', myItem, source.itemState, target, source, move, myItem) || !target.setItem(myItem)) {
				source.item = myItem.id;
				return false;
			}
			this.add('-item', target, myItem.name, '[from] move: Bestow', `[of] ${source}`);
		},
		secondary: null,
		target: "normal",
	},
	camouflage: {
		num: 293,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		isNonstandard: "Past",
		name: "Camouflage",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onHit(target) {
			let newType = 'Normal';
			if (this.field.isTerrain('electricterrain')) { newType = 'Electric'; } 
			else if (this.field.isTerrain('grassyterrain')) { newType = 'Grass'; } 
			else if (this.field.isTerrain('mistyterrain')) { newType = 'Fairy'; } 
			else if (this.field.isTerrain('psychicterrain')) { newType = 'Psychic'; }
			if (target.getTypes().join() === newType || !target.setType(newType)) return false;
			this.add('-start', target, 'typechange', newType);
		},
		secondary: null,
		target: "self",
	},
	captivate: {
		num: 445,
		accuracy: 100,
		basePower: 0,
		type: "Normal",
		category: "Status",
		isNonstandard: "Past",
		name: "Captivate",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		onTryImmunity(pokemon, source) { return (pokemon.gender === 'M' && source.gender === 'F') || (pokemon.gender === 'F' && source.gender === 'M'); },
		boosts: {spa: -2,},
		secondary: null,
		target: "allAdjacentFoes",
	},
	craftyshield: {
		num: 578,
		accuracy: true,
		basePower: 0,
		type: "Fairy",
		category: "Status",
		isNonstandard: "Past",
		name: "Crafty Shield",
		pp: 10,
		priority: 3,
		flags: {},
		sideCondition: 'craftyshield',
		onTry() { return !!this.queue.willAct(); },
		condition: {
			duration: 1,
			onSideStart(target, source) { this.add('-singleturn', source, 'Crafty Shield'); },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (['self', 'all'].includes(move.target) || move.category !== 'Status') return;
				this.add('-activate', target, 'move: Crafty Shield');
				return this.NOT_FAIL;
			},
		},
		secondary: null,
		target: "allySide",
	},
	flash: {
		num: 148,
		accuracy: 100,
		basePower: 0,
		type: "Normal",
		category: "Status",
		isNonstandard: "Past",
		name: "Flash",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		boosts: {accuracy: -1,},
		secondary: null,
		target: "normal",
	},
	foresight: {
		num: 193,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		isNonstandard: "Past",
		name: "Foresight",
		pp: 40,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		volatileStatus: 'foresight',
		onTryHit(target) { if (target.volatiles['miracleeye']) return false; },
		condition: {
			noCopy: true,
			onStart(pokemon) { this.add('-start', pokemon, 'Foresight'); },
			onNegateImmunity(pokemon, type) { if (pokemon.hasType('Ghost') && ['Normal', 'Fighting'].includes(type)) return false; },
			onModifyBoost(boosts) { if (boosts.evasion && boosts.evasion > 0) { boosts.evasion = 0; } },
		},
		secondary: null,
		target: "normal",
	},
	gearup: {
		num: 674,
		accuracy: true,
		basePower: 0,
		type: "Steel",
		category: "Status",
		isNonstandard: "Past",
		name: "Gear Up",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, bypasssub: 1, metronome: 1 },
		onHitSide(side, source, move) {
			const targets = side.allies().filter(target => (target.hasAbility(['plus', 'minus']) && (!target.volatiles['maxguard'] || this.runEvent('TryHit', target, source, move))));
			if (!targets.length) return false;
			let didSomething = false;
			for (const target of targets) { didSomething = this.boost({ atk: 1, spa: 1 }, target, source, move, false, true) || didSomething; }
			return didSomething;
		},
		secondary: null,
		target: "allySide",
	},
	geomancy: {
		num: 601,
		accuracy: true,
		basePower: 0,
		type: "Fairy",
		category: "Status",
		isNonstandard: "Past",
		name: "Geomancy",
		pp: 10,
		priority: 0,
		flags: { charge: 1, nonsky: 1, metronome: 1, nosleeptalk: 1, failinstruct: 1 },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) { return; }
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) { return; }
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		boosts: {spa: 2, spd: 2, spe: 2,},
		secondary: null,
		target: "self",
	},
	grudge: {
		num: 288,
		accuracy: true,
		basePower: 0,
		type: "Ghost",
		category: "Status",
		isNonstandard: "Past",
		name: "Grudge",
		pp: 5,
		priority: 0,
		flags: { bypasssub: 1, metronome: 1 },
		volatileStatus: 'grudge',
		condition: {
			onStart(pokemon) { this.add('-singlemove', pokemon, 'Grudge'); },
			onFaint(target, source, effect) {
				if (!source || source.fainted || !effect) return;
				if (effect.effectType === 'Move' && !effect.flags['futuremove'] && source.lastMove) {
					let move: Move = source.lastMove;
					if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
					for (const moveSlot of source.moveSlots) {
						if (moveSlot.id === move.id) {
							moveSlot.pp = 0;
							this.add('-activate', source, 'move: Grudge', move.name);
						}
					}
				}
			},
			onBeforeMovePriority: 100,
			onBeforeMove(pokemon) {
				this.debug('removing Grudge before attack');
				pokemon.removeVolatile('grudge');
			},
		},
		secondary: null,
		target: "self",
	},
	iondeluge: {
		num: 569,
		accuracy: true,
		basePower: 0,
		type: "Electric",
		category: "Status",
		isNonstandard: "Past",
		name: "Ion Deluge",
		pp: 25,
		priority: 1,
		flags: { metronome: 1 },
		pseudoWeather: 'iondeluge',
		condition: {
			duration: 1,
			onFieldStart(target, source, sourceEffect) {
				this.add('-fieldactivate', 'move: Ion Deluge');
				this.hint(`Normal-type moves become Electric-type after using ${sourceEffect}.`);
			},
			onModifyTypePriority: -2,
			onModifyType(move) {
				if (move.type === 'Normal') {
					move.type = 'Electric';
					this.debug(move.name + "'s type changed to Electric");
				}
			},
		},
		secondary: null,
		target: "all",
	},
	kingsshield: {
		num: 588,
		accuracy: true,
		basePower: 0,
		type: "Steel",
		category: "Status",
		isNonstandard: "Past",
		name: "King's Shield",
		pp: 10,
		priority: 4,
		flags: { noassist: 1, failcopycat: 1, failinstruct: 1 },
		stallingMove: true,
		volatileStatus: 'kingsshield',
		onPrepareHit(pokemon) { return !!this.queue.willAct() && this.runEvent('StallMove', pokemon); },
		onHit(pokemon) { pokemon.addVolatile('stall'); },
		condition: {
			duration: 1,
			onStart(target) { this.add('-singleturn', target, 'Protect'); },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) { move.smartTarget = false; } 
				else { this.add('-activate', target, 'move: Protect'); }
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) { delete source.volatiles['lockedmove']; }
				}
				if (this.checkMoveMakesContact(move, source, target)) { this.boost({ atk: -1 }, source, target, this.dex.getActiveMove("King's Shield")); }
				return this.NOT_FAIL;
			},
			onHit(target, source, move) { if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) { this.boost({ atk: -1 }, source, target, this.dex.getActiveMove("King's Shield")); } },
		},
		secondary: null,
		target: "self",
	},
	laserfocus: {
		num: 673,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		isNonstandard: "Past",
		name: "Laser Focus",
		pp: 30,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		volatileStatus: 'laserfocus',
		condition: {
			duration: 2,
			onStart(pokemon, source, effect) {
				if (effect && (['costar', 'imposter', 'psychup', 'transform'].includes(effect.id))) { this.add('-start', pokemon, 'move: Laser Focus', '[silent]'); } 
				else { this.add('-start', pokemon, 'move: Laser Focus'); }
			},
			onRestart(pokemon) {
				this.effectState.duration = 2;
				this.add('-start', pokemon, 'move: Laser Focus');
			},
			onModifyCritRatio(critRatio) { return 5; },
			onEnd(pokemon) { this.add('-end', pokemon, 'move: Laser Focus', '[silent]'); },
		},
		secondary: null,
		target: "self",
	},
	luckychant: {
		num: 381,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		isNonstandard: "Past",
		name: "Lucky Chant",
		pp: 30,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		sideCondition: 'luckychant',
		condition: {
			duration: 5,
			onSideStart(side) { this.add('-sidestart', side, 'move: Lucky Chant'); }, // "The Lucky Chant shielded [side.name]'s team from critical hits!"
			onCriticalHit: false,
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 6,
			onSideEnd(side) { this.add('-sideend', side, 'move: Lucky Chant');  }, // "[side.name]'s team's Lucky Chant wore off!"
		},
		secondary: null,
		target: "allySide",
	},
	mindreader: {
		num: 170,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		isNonstandard: "Past",
		name: "Mind Reader",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTryHit(target, source) { if (source.volatiles['lockon']) return false; },
		onHit(target, source) {
			source.addVolatile('lockon', target);
			this.add('-activate', source, 'move: Mind Reader', `[of] ${target}`);
		},
		secondary: null,
		target: "normal",
	},
	miracleeye: {
		num: 357,
		accuracy: true,
		basePower: 0,
		type: "Psychic",
		category: "Status",
		isNonstandard: "Past",
		name: "Miracle Eye",
		pp: 40,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		volatileStatus: 'miracleeye',
		onTryHit(target) { if (target.volatiles['foresight']) return false; },
		condition: {
			noCopy: true,
			onStart(pokemon) { this.add('-start', pokemon, 'Miracle Eye'); },
			onNegateImmunity(pokemon, type) { if (pokemon.hasType('Dark') && type === 'Psychic') return false; },
			onModifyBoost(boosts) { if (boosts.evasion && boosts.evasion > 0) { boosts.evasion = 0; } },
		},
		secondary: null,
		target: "normal",
	},
	mirrormove: {
		num: 119,
		accuracy: true,
		basePower: 0,
		type: "Flying",
		category: "Status",
		isNonstandard: "Past",
		name: "Mirror Move",
		pp: 20,
		priority: 0,
		flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		onTryHit(target, pokemon) {
			const move = target.lastMove;
			if (!move?.flags['mirror'] || move.isZ || move.isMax) { return false; }
			this.actions.useMove(move.id, pokemon, { target });
			return null;
		},
		callsMove: true,
		secondary: null,
		target: "normal",
	},
	mudsport: {
		num: 300,
		accuracy: true,
		basePower: 0,
		type: "Ground",
		category: "Status",
		isNonstandard: "Past",
		name: "Mud Sport",
		pp: 15,
		priority: 0,
		flags: { nonsky: 1, metronome: 1 },
		pseudoWeather: 'mudsport',
		condition: {
			duration: 5,
			onFieldStart(field, source) { this.add('-fieldstart', 'move: Mud Sport', `[of] ${source}`); },
			onBasePowerPriority: 1,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Electric') {
					this.debug('mud sport weaken');
					return this.chainModify([1352, 4096]);
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 4,
			onFieldEnd() { this.add('-fieldend', 'move: Mud Sport'); },
		},
		secondary: null,
		target: "all",
	},
	
	obstruct: {
		num: 792,
		accuracy: 100,
		basePower: 0,
		type: "Dark",
		category: "Status",
		isNonstandard: "Past",
		name: "Obstruct",
		pp: 10,
		priority: 4,
		flags: { failinstruct: 1 },
		stallingMove: true,
		volatileStatus: 'obstruct',
		onPrepareHit(pokemon) { return !!this.queue.willAct() && this.runEvent('StallMove', pokemon); },
		onHit(pokemon) { pokemon.addVolatile('stall'); },
		condition: {
			duration: 1,
			onStart(target) { this.add('-singleturn', target, 'Protect'); },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) { move.smartTarget = false; } 
				else { this.add('-activate', target, 'move: Protect'); }
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) { delete source.volatiles['lockedmove']; } }
				if (this.checkMoveMakesContact(move, source, target)) { this.boost({ def: -2 }, source, target, this.dex.getActiveMove("Obstruct")); }
				return this.NOT_FAIL;
			},
			onHit(target, source, move) { if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) { this.boost({ def: -2 }, source, target, this.dex.getActiveMove("Obstruct")); } },
		},
		secondary: null,
		target: "self",

	},
	octolock: {
		num: 753,
		accuracy: 100,
		basePower: 0,
		type: "Fighting",
		category: "Status",
		isNonstandard: "Past",
		name: "Octolock",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTryImmunity(target) { return this.dex.getImmunity('trapped', target); },
		volatileStatus: 'octolock',
		condition: {
			onStart(pokemon, source) { this.add('-start', pokemon, 'move: Octolock', `[of] ${source}`); },
			onResidualOrder: 14,
			onResidual(pokemon) {
				const source = this.effectState.source;
				if (source && (!source.isActive || source.hp <= 0 || !source.activeTurns)) {
					delete pokemon.volatiles['octolock'];
					this.add('-end', pokemon, 'Octolock', '[partiallytrapped]', '[silent]');
					return;
				}
				this.boost({ def: -1, spd: -1 }, pokemon, source, this.dex.getActiveMove('octolock'));
			},
			onTrapPokemon(pokemon) { if (this.effectState.source?.isActive) pokemon.tryTrap(); },
		},
		secondary: null,
		target: "normal",

	},
	odorsleuth: {
		num: 316,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		isNonstandard: "Past",
		name: "Odor Sleuth",
		pp: 40,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, allyanim: 1, metronome: 1 },
		volatileStatus: 'foresight',
		onTryHit(target) { if (target.volatiles['miracleeye']) return false; },
		secondary: null,
		target: "normal",
	},
	powder: {
		num: 600,
		accuracy: 100,
		basePower: 0,
		type: "Bug",
		category: "Status",
		isNonstandard: "Past",
		name: "Powder",
		pp: 20,
		priority: 1,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1, powder: 1 },
		volatileStatus: 'powder',
		condition: {
			duration: 1,
			onStart(target) { this.add('-singleturn', target, 'Powder'); },
			onTryMovePriority: -1,
			onTryMove(pokemon, target, move) {
				if (move.type === 'Fire') {
					this.add('-activate', pokemon, 'move: Powder');
					this.damage(this.clampIntRange(Math.round(pokemon.maxhp / 4), 1));
					this.attrLastMove('[still]');
					return false;
				}
			},
		},
		secondary: null,
		target: "normal",
	},
	purify: {
		num: 685,
		accuracy: true,
		basePower: 0,
		type: "Poison",
		category: "Status",
		isNonstandard: "Past",
		name: "Purify",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, heal: 1, metronome: 1 },
		onHit(target, source) {
			if (!target.cureStatus()) {
				this.add('-fail', source);
				this.attrLastMove('[still]');
				return this.NOT_FAIL;
			}
			this.heal(Math.ceil(source.maxhp * 0.5), source);
		},
		secondary: null,
		target: "normal",
	},
	rototiller: {
		num: 563,
		accuracy: true,
		basePower: 0,
		type: "Ground",
		category: "Status",
		isNonstandard: "Past",
		name: "Rototiller",
		pp: 10,
		priority: 0,
		flags: { distance: 1, nonsky: 1, metronome: 1 },
		onHitField(target, source) {
			const targets: Pokemon[] = [];
			let anyAirborne = false;
			for (const pokemon of this.getAllActive()) {
				if (!pokemon.runImmunity('Ground')) {
					this.add('-immune', pokemon);
					anyAirborne = true;
					continue;
				}
				if (pokemon.hasType('Grass')) { targets.push(pokemon); } // This move affects every grounded Grass-type Pokemon in play.
			}
			if (!targets.length && !anyAirborne) return false; // Fails when there are no grounded Grass types or airborne Pokemon
			for (const pokemon of targets) { this.boost({ atk: 1, spa: 1 }, pokemon, source); }
		},
		secondary: null,
		target: "all",
	},
	spiderweb: {
		num: 169,
		accuracy: true,
		basePower: 0,
		type: "Bug",
		category: "Status",
		isNonstandard: "Past",
		name: "Spider Web",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		onHit(target, source, move) { return target.addVolatile('trapped', source, move, 'trapper'); },
		secondary: null,
		target: "normal",
	},
	spotlight: {
		num: 671,
		accuracy: true,
		basePower: 0,
		type: "Normal",
		category: "Status",
		isNonstandard: "Past",
		name: "Spotlight",
		pp: 15,
		priority: 3,
		flags: { protect: 1, reflectable: 1, allyanim: 1, noassist: 1, failcopycat: 1 },
		volatileStatus: 'spotlight',
		onTryHit(target) { if (this.activePerHalf === 1) return false; },
		condition: {
			duration: 1,
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(pokemon) { this.add('-singleturn', pokemon, 'move: Spotlight'); },
			onFoeRedirectTargetPriority: 2,
			onFoeRedirectTarget(target, source, source2, move) {
				if (this.validTarget(this.effectState.target, source, move.target)) {
					this.debug("Spotlight redirected target of move");
					return this.effectState.target;
				}
			},
		},
		secondary: null,
		target: "normal",
	},
	trickortreat: {
		num: 567,
		accuracy: 100,
		basePower: 0,
		type: "Ghost",
		category: "Status",
		isNonstandard: "Past",
		name: "Trick-or-Treat",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onHit(target) {
			if (target.hasType('Ghost')) return false;
			if (!target.addType('Ghost')) return false;
			this.add('-start', target, 'typeadd', 'Ghost', '[from] move: Trick-or-Treat');
			if (target.side.active.length === 2 && target.position === 1) {
				// Curse Glitch
				const action = this.queue.willMove(target);
				if (action && action.move.id === 'curse') { action.targetLoc = -1; }
			}
		},
		secondary: null,
		target: "normal",
	},
	venomdrench: {
		num: 599,
		accuracy: 100,
		basePower: 0,
		type: "Poison",
		category: "Status",
		isNonstandard: "Past",
		name: "Venom Drench",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		onHit(target, source, move) {
			if (target.status === 'psn' || target.status === 'tox') { return !!this.boost({ atk: -1, spa: -1, spe: -1 }, target, source, move); }
			return false;
		},
		secondary: null,
		target: "allAdjacentFoes",
	},
	watersport: {
		num: 346,
		accuracy: true,
		basePower: 0,
		type: "Water",
		category: "Status",
		isNonstandard: "Past",
		name: "Water Sport",
		pp: 15,
		priority: 0,
		flags: { nonsky: 1, metronome: 1 },
		pseudoWeather: 'watersport',
		condition: {
			duration: 5,
			onFieldStart(field, source) { this.add('-fieldstart', 'move: Water Sport', `[of] ${source}`); },
			onBasePowerPriority: 1,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('water sport weaken');
					return this.chainModify([1352, 4096]);
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 3,
			onFieldEnd() { this.add('-fieldend', 'move: Water Sport'); },
		},
		secondary: null,
		target: "all",
	},
};