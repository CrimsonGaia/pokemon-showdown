import { Dex, toID } from './dex';
const CHOOSABLE_TARGETS = new Set(['normal', 'any', 'adjacentAlly', 'adjacentAllyOrSelf', 'adjacentFoe']);
export class BattleActions {
	battle: Battle;
	dex: ModdedDex;
	constructor(battle: Battle) {
		this.battle = battle;
		this.dex = battle.dex;
		if (this.dex.data.Scripts.actions) Object.assign(this, this.dex.data.Scripts.actions);
		if (battle.format.actions) Object.assign(this, battle.format.actions);
	}
	canUseWeaponMove(pokemon: Pokemon, move: ActiveMove) {
		if (!move.weaponmove) return true;
		if (pokemon.maxWeaponDurability > 0 && pokemon.weaponDurability > 0) return true;
		if (move.weaponmoveCallback?.call(this.battle, pokemon)) return true;
		return false;
	}
	getWeaponMoveDamage(move: ActiveMove, reason: 'hit' | 'protect') {
		if (!move.weaponmove) return 0;
		if (reason === 'protect' && move.weaponDamageOnProtect === false) return 0;
		return move.weaponDamage || 0;
	}
	applyWeaponMoveDamage(pokemon: Pokemon, move: ActiveMove, reason: 'hit' | 'protect') {
		const amount = this.getWeaponMoveDamage(move, reason);
		if (amount <= 0) return 0;
		return pokemon.damageWeapon(amount);
	}
	// #region SWITCH
	switchIn(pokemon: Pokemon, pos: number, sourceEffect: Effect | null = null, isDrag?: boolean) {
		if (!pokemon || pokemon.isActive) {
			this.battle.hint("A switch failed because the Pokémon trying to switch in is already in.");
			return false;
		}
		const side = pokemon.side;
		if (pos >= side.active.length) { throw new Error(`Invalid switch position ${pos} / ${side.active.length}`); }
		const oldActive = side.active[pos];
		const unfaintedActive = oldActive?.hp ? oldActive : null;
		if (unfaintedActive) {
			oldActive.beingCalledBack = true;
			let switchCopyFlag: 'copyvolatile' | 'shedtail' | boolean = false;
			if (sourceEffect && typeof (sourceEffect as Move).selfSwitch === 'string') { switchCopyFlag = (sourceEffect as Move).selfSwitch!; }
			if (!oldActive.skipBeforeSwitchOutEventFlag && !isDrag) {
				this.battle.runEvent('BeforeSwitchOut', oldActive);
				if (this.battle.gen >= 5) { this.battle.eachEvent('Update'); }
			}
			oldActive.skipBeforeSwitchOutEventFlag = false;
			if (!this.battle.runEvent('SwitchOut', oldActive)) {
				// Warning: DO NOT interrupt a switch-out if you just want to trap a pokemon.
				// To trap a pokemon and prevent it from switching out, (e.g. Mean Look, Magnet Pull) use the 'trapped' flag instead.
				// Note: Nothing in the real games can interrupt a switch-out (except Pursuit KOing, which is handled elsewhere); this is just for custom formats.
				return false;
			}
			if (!oldActive.hp) { return 'pursuitfaint'; } // a pokemon fainted from Pursuit before it could switch
			// will definitely switch out at this point
			oldActive.illusion = null;
			this.battle.singleEvent('End', oldActive.getAbility(1), oldActive.abilityState1, oldActive);
			this.battle.singleEvent('End', oldActive.getAbility(2), oldActive.abilityState2, oldActive);
			this.battle.singleEvent('End', oldActive.getItem(), oldActive.itemState, oldActive);
			// if a pokemon is forced out by Whirlwind/etc or Eject Button/Pack, it can't use its chosen move
			this.battle.queue.cancelAction(oldActive);
			let newMove = null;
			if (this.battle.gen === 4 && sourceEffect) { newMove = oldActive.lastMove; }
			if (switchCopyFlag) { pokemon.copyVolatileFrom(oldActive, switchCopyFlag); }
			if (newMove) pokemon.lastMove = newMove;
			oldActive.clearVolatile();
		}
		if (oldActive) {
			oldActive.isActive = false;
			oldActive.isStarted = false;
			oldActive.usedItemThisTurn = false;
			oldActive.statsRaisedThisTurn = false;
			oldActive.statsLoweredThisTurn = false;
			oldActive.position = pokemon.position;
			if (oldActive.fainted) oldActive.status = '';
			pokemon.position = pos;
			side.pokemon[pokemon.position] = pokemon;
			side.pokemon[oldActive.position] = oldActive;
		}
		pokemon.isActive = true;
		side.active[pos] = pokemon;
		pokemon.activeTurns = 0;
		pokemon.activeMoveActions = 0;
		for (const moveSlot of pokemon.moveSlots) { moveSlot.used = false; }
		pokemon.abilityState1 = this.battle.initEffectState({ id: pokemon.ability1, target: pokemon });
		pokemon.abilityState2 = this.battle.initEffectState({ id: pokemon.ability2, target: pokemon });
		pokemon.itemState = this.battle.initEffectState({ id: pokemon.item, target: pokemon });
		this.battle.runEvent('BeforeSwitchIn', pokemon);
		if (sourceEffect) { this.battle.add(isDrag ? 'drag' : 'switch', pokemon, pokemon.getFullDetails, `[from] ${sourceEffect}`); } 
		else { this.battle.add(isDrag ? 'drag' : 'switch', pokemon, pokemon.getFullDetails); }
		if (isDrag && this.battle.gen === 2) pokemon.draggedIn = this.battle.turn;
		pokemon.previouslySwitchedIn++;
		if (isDrag && this.battle.gen >= 5) { this.runSwitch(pokemon); } // runSwitch happens immediately so that Mold Breaker can make hazards bypass Clear Body and Levitate
		else { this.battle.queue.insertChoice({ choice: 'runSwitch', pokemon }); }
		return true;
	}
	dragIn(side: Side, pos: number) {
		const pokemon = this.battle.getRandomSwitchable(side);
		if (!pokemon || pokemon.isActive) return false;
		const oldActive = side.active[pos];
		if (!oldActive) throw new Error(`nothing to drag out`);
		if (!oldActive.hp) return false;
		if (!this.battle.runEvent('DragOut', oldActive)) { return false; }
		if (!this.switchIn(pokemon, pos, null, true)) return false;
		return true;
	}
	runSwitch(pokemon: Pokemon) {
		const switchersIn = [pokemon];
		while (this.battle.queue.peek()?.choice === 'runSwitch') {
			const nextSwitch = this.battle.queue.shift();
			switchersIn.push(nextSwitch!.pokemon!);
		}
		const allActive = this.battle.getAllActive(true);
		this.battle.speedSort(allActive);
		this.battle.speedOrder = allActive.map(a => a.side.n * a.battle.sides.length + a.position);
		this.battle.fieldEvent('SwitchIn', switchersIn);
		for (const poke of switchersIn) {
			if (!poke.hp) continue;
			poke.isStarted = true;
			poke.draggedIn = null;
		}
		return true;
	}
	// #region MOVES
	/**
	 * runMove is the "outside" move caller. It handles deducting PP, flinching, full paralysis, etc. All the stuff up to and including the "POKEMON used MOVE" message.
	 * For details of the difference between runMove and useMove, see useMove's info. externalMove skips LockMove and PP deduction, mostly for use by Dancer.
	 */
	runMove(moveOrMoveName: Move | string, pokemon: Pokemon, targetLoc: number, options?: {
			sourceEffect?: Effect | null, externalMove?: boolean, originalTarget?: Pokemon,
			teraempower?: boolean, // request to spend 1 Tera Charge to empower a Tera move
		}
	) {
		pokemon.activeMoveActions++;
		const externalMove = options?.externalMove;
		const originalTarget = options?.originalTarget;
		let sourceEffect = options?.sourceEffect;
		let target = this.battle.getTarget(pokemon, moveOrMoveName, targetLoc, originalTarget);
		let baseMove = this.dex.getActiveMove(moveOrMoveName);
		const priority = baseMove.priority;
		const pranksterBoosted = baseMove.pranksterBoosted;
		if (baseMove.id !== 'struggle' && !externalMove) {
			const changedMove = this.battle.runEvent('OverrideAction', pokemon, target, baseMove);
			if (changedMove && changedMove !== true) {
				baseMove = this.dex.getActiveMove(changedMove);
				baseMove.priority = priority;
				if (pranksterBoosted) baseMove.pranksterBoosted = pranksterBoosted;
				target = this.battle.getRandomTarget(pokemon, baseMove);
			}
		}
		let move = baseMove;
		if (!this.canUseWeaponMove(pokemon, move)) {
			this.battle.add('-fail', pokemon, 'move: ' + move.name);
			this.battle.attrLastMove('[still]');
			pokemon.moveThisTurnResult = false;
			return;
		}
		move.isExternal = externalMove;
		this.battle.setActiveMove(move, pokemon, target);
		if (this.battle.activeMove && pokemon.volatiles['teraempowered']) { (this.battle.activeMove as any).teraEmpowered = true; }
		/* if (pokemon.moveThisTurn) {
			// THIS IS PURELY A SANITY CHECK
			// DO NOT TAKE ADVANTAGE OF THIS TO PREVENT A POKEMON FROM MOVING;
			// USE this.queue.cancelMove INSTEAD
			this.battle.debug(`${pokemon.id} INCONSISTENT STATE, ALREADY MOVED: ${pokemon.moveThisTurn}`);
			this.battle.clearActiveMove(true);
			return;
		} */
		const willTryMove = this.battle.runEvent('BeforeMove', pokemon, target, move);
		if (!willTryMove) {
			this.battle.runEvent('MoveAborted', pokemon, target, move);
			this.battle.clearActiveMove(true);
			// The event 'BeforeMove' could have returned false or null
			// false indicates that this counts as a move failing for the purpose of calculating Stomping Tantrum's base power
			// null indicates the opposite, as the Pokemon didn't have an option to choose anything
			pokemon.moveThisTurnResult = willTryMove;
			return;
		}
		try {
			// Used exclusively for a hint later
			if (move.flags['cantusetwice'] && pokemon.lastMove?.id === move.id) { pokemon.addVolatile(move.id); }
			if (move.beforeMoveCallback) {
				if (move.beforeMoveCallback.call(this.battle, pokemon, target, move)) {
					this.battle.clearActiveMove(true);
					pokemon.moveThisTurnResult = false;
					return;
				}
			}
			pokemon.lastDamage = 0;
			let lockedMove;
			if (!externalMove) {
				lockedMove = this.battle.runEvent('LockMove', pokemon);
				if (lockedMove === true) lockedMove = false;
				if (!lockedMove) {
					if (!pokemon.deductPP(baseMove, null, target) && (move.id !== 'struggle')) {
						this.battle.add('cant', pokemon, 'nopp', move);
						this.battle.clearActiveMove(true);
						pokemon.moveThisTurnResult = false;
						return;
					}
				} else { sourceEffect = this.dex.conditions.get('lockedmove'); }
				pokemon.moveUsed(move, targetLoc);
			}
			// Dancer Petal Dance hack
			// TODO: implement properly
			const noLock = externalMove && !pokemon.volatiles['lockedmove'];
			const oldActiveMove = move;
			const moveDidSomething = this.useMove(baseMove, pokemon, { target, sourceEffect, } as any);
			this.battle.lastSuccessfulMoveThisTurn = moveDidSomething ? this.battle.activeMove && this.battle.activeMove.id : null;
			if (this.battle.activeMove) move = this.battle.activeMove;
			this.battle.singleEvent('AfterMove', move, null, pokemon, target, move);
			this.battle.runEvent('AfterMove', pokemon, target, move);
			// Guard Action cooldown only decrements when the Pokemon successfully uses a move.
			// This ensures it doesn't decrease when Pokemon are switched out or immobilized by flinch, para, etc.
			if (moveDidSomething && pokemon.guardActionCooldown && pokemon.guardActionCooldown > 0) { pokemon.guardActionCooldown--; }
			if (move.flags['cantusetwice'] && pokemon.removeVolatile(move.id)) { this.battle.add('-hint', `Some effects can force a Pokemon to use ${move.name} again in a row.`); }
			// TODO: Refactor to use BattleQueue#prioritizeAction in onAnyAfterMove handlers
			// Dancer's activation order is completely different from any other event, so it's handled separately
			if (move.flags['dance'] && moveDidSomething && !move.isExternal) {
				const dancers = [];
				for (const currentPoke of this.battle.getAllActive()) {
					if (pokemon === currentPoke) continue;
					if (currentPoke.hasAbility('dancer') && !currentPoke.isSemiInvulnerable()) { dancers.push(currentPoke); }
				}
				// Dancer activates in order of lowest speed stat to highest
				// Note that the speed stat used is after any volatile replacements like Speed Swap,
				// but before any multipliers like Agility or Choice Scarf
				// Ties go to whichever Pokemon has had the ability for the least amount of time
				dancers.sort((a, b) =>
					-(b.storedStats['spe'] - a.storedStats['spe']) ||
					this.battle.getAbilityEffectOrder(b, ['dancer', 'virtualidol']) -
					this.battle.getAbilityEffectOrder(a, ['dancer', 'virtualidol'])
				);
				const targetOf1stDance = this.battle.activeTarget!;
				for (const dancer of dancers) {
					if (this.battle.faintMessages()) break;
					if (dancer.fainted) continue;
					const dancerAbilitySlot =
							dancer.ability1 === 'dancer' ? 1 :
							dancer.ability2 === 'dancer' ? 2 :
							1;
						const dancerAbility = dancer.getAbility(dancerAbilitySlot as 1 | 2);
						this.battle.add('-activate', dancer, 'ability: ' + dancerAbility.name);
						const dancersTarget = !targetOf1stDance.isAlly(dancer) && pokemon.isAlly(dancer) ?
							targetOf1stDance :
							pokemon;
						const dancersTargetLoc = dancer.getLocOf(dancersTarget);
					this.runMove(move.id, dancer, dancersTargetLoc, { sourceEffect: dancerAbility, externalMove: true });
				}
			}
			// Musician works identically to Dancer, but for sound moves
			if (move.flags['sound'] && moveDidSomething && !move.isExternal) {
				const musicians = [];
				for (const currentPoke of this.battle.getAllActive()) {
					if (pokemon === currentPoke) continue;
					if (currentPoke.hasAbility('musician') && !currentPoke.isSemiInvulnerable()) { musicians.push(currentPoke); }
				}
				musicians.sort(
					(a, b) =>
						-(b.storedStats['spe'] - a.storedStats['spe']) ||
						(this.battle.getAbilityEffectOrder(b, ['musician']) - this.battle.getAbilityEffectOrder(a, ['musician']))
				);
				const targetOf1stSound = this.battle.activeTarget!;
				for (const musician of musicians) {
					if (this.battle.faintMessages()) break;
					if (musician.fainted) continue;
					for (const musician of musicians) {
						if (this.battle.faintMessages()) break;
						if (musician.fainted) continue;
						const musicianAbilitySlot =
							musician.ability1 === 'musician' ? 1 :
							musician.ability2 === 'musician' ? 2 :
							1;
						const musicianAbility = musician.getAbility(musicianAbilitySlot as 1 | 2);
						this.battle.add('-activate', musician, 'ability: ' + musicianAbility.name);
						const musiciansTarget = !targetOf1stSound.isAlly(musician) && pokemon.isAlly(musician) ?
							targetOf1stSound :
							pokemon;
						const musiciansTargetLoc = musician.getLocOf(musiciansTarget);
						this.runMove(move.id, musician, musiciansTargetLoc, { sourceEffect: musicianAbility, externalMove: true });
					}
				}
			}
			if (noLock && pokemon.volatiles['lockedmove']) delete pokemon.volatiles['lockedmove'];
			this.battle.faintMessages();
			this.battle.checkWin();
		} finally {}
	}
	/**
	 * useMove is the "inside" move caller. It handles effects of the move itself, but not the idea of using the move.
	 * Most caller effects, like Sleep Talk, Nature Power, Magic Bounce, etc use useMove.
	 * The only ones that use runMove are Instruct, Pursuit, and Dancer.
	 */
	useMove(
		move: Move | string, pokemon: Pokemon, options?: {
			target?: Pokemon | null, sourceEffect?: Effect | null,
			teraempower?: boolean,
		}
	) {
		pokemon.moveThisTurnResult = undefined;
		const oldMoveResult: boolean | null | undefined = pokemon.moveThisTurnResult;
		const moveResult = this.useMoveInner(move, pokemon, options);
		if (oldMoveResult === pokemon.moveThisTurnResult) pokemon.moveThisTurnResult = moveResult;
		return moveResult;
	}
	useMoveInner(moveOrMoveName: Move | string, pokemon: Pokemon, options?: { target?: Pokemon | null, sourceEffect?: Effect | null, teraempower?: boolean, },) {
		let target = options?.target;
		let sourceEffect = options?.sourceEffect;
		if (!sourceEffect && this.battle.effect.id) sourceEffect = this.battle.effect;
		if (sourceEffect && ['instruct', 'custapberry'].includes(sourceEffect.id)) sourceEffect = null;
		let move = this.dex.getActiveMove(moveOrMoveName);
		pokemon.lastMoveUsed = move;
		if (this.battle.activeMove) {
			move.priority = this.battle.activeMove.priority;
			if (!move.hasBounced) move.pranksterBoosted = this.battle.activeMove.pranksterBoosted;
		}
		const baseTarget = move.target;
		let targetRelayVar = { target };
		targetRelayVar = this.battle.runEvent('ModifyTarget', pokemon, target, move, targetRelayVar, true);
		if (targetRelayVar.target !== undefined) target = targetRelayVar.target;
		if (target === undefined) target = this.battle.getRandomTarget(pokemon, move);
		if (move.target === 'self' || move.target === 'allies') { target = pokemon; }
		if (sourceEffect) {
			move.sourceEffect = sourceEffect.id;
			move.ignoreAbility = (sourceEffect as ActiveMove).ignoreAbility;
		}
		let moveResult = false;
		this.battle.setActiveMove(move, pokemon, target);
		if (this.battle.activeMove && pokemon.volatiles['teraempowered']) { (this.battle.activeMove as any).teraEmpowered = true; }
		this.battle.singleEvent('ModifyType', move, null, pokemon, target, move, move);
		this.battle.singleEvent('ModifyMove', move, null, pokemon, target, move, move);
		if (baseTarget !== move.target) { target = this.battle.getRandomTarget(pokemon, move); } // Target changed in ModifyMove, so we must adjust it here. Adjust before the next event so the correct target is passed to the event
		move = this.battle.runEvent('ModifyType', pokemon, target, move, move);
		move = this.battle.runEvent('ModifyMove', pokemon, target, move, move);
		if (baseTarget !== move.target) { target = this.battle.getRandomTarget(pokemon, move); }
		if (!move || pokemon.fainted) { return false; }
		let attrs = '';
		let movename = move.name;
		if (sourceEffect) attrs += `|[from] ${sourceEffect.fullname}`;
		this.battle.addMove('move', pokemon, movename, `${target}${attrs}`);
		if (!target) {
			this.battle.attrLastMove('[notarget]');
			this.battle.add(this.battle.gen >= 5 ? '-fail' : '-notarget', pokemon);
			return false;
		}
		const { targets, pressureTargets } = pokemon.getMoveTargets(move, target);
		if (targets.length) { target = targets[targets.length - 1]; } // in case of redirection
		const callerMoveForPressure = sourceEffect && (sourceEffect as ActiveMove).pp ? sourceEffect as ActiveMove : null;
		if (!sourceEffect || callerMoveForPressure || sourceEffect.id === 'pursuit') {
			let extraPP = 0;
			for (const source of pressureTargets) {
				const ppDrop = this.battle.runEvent('DeductPP', source, pokemon, move);
				if (ppDrop !== true) { extraPP += ppDrop || 0; }
			}
			if (extraPP > 0) { pokemon.deductPP(callerMoveForPressure || moveOrMoveName, extraPP); }
		}
		if (!this.battle.singleEvent('TryMove', move, null, pokemon, target, move) ||
			!this.battle.runEvent('TryMove', pokemon, target, move)) {
			move.mindBlownRecoil = false;
			return false;
		}
		this.battle.singleEvent('UseMoveMessage', move, null, pokemon, target, move);
		if (move.ignoreImmunity === undefined) { move.ignoreImmunity = (move.category === 'Status'); }
		if (this.battle.gen !== 4 && move.selfdestruct === 'always') { this.battle.faint(pokemon, pokemon, move); }
		let damage: number | false | undefined | '' = false;
		if (move.target === 'all' || move.target === 'foeSide' || move.target === 'allySide' || move.target === 'allyTeam') {
			damage = this.tryMoveHit(targets, pokemon, move);
			if (damage === this.battle.NOT_FAIL) pokemon.moveThisTurnResult = null;
			if (damage || damage === 0 || damage === undefined) moveResult = true;
		} else {
			if (!targets.length) {
				this.battle.attrLastMove('[notarget]');
				this.battle.add(this.battle.gen >= 5 ? '-fail' : '-notarget', pokemon);
				return false;
			}
			moveResult = this.trySpreadMoveHit(targets, pokemon, move);
		}
		if (move.selfBoost && moveResult) this.moveHit(pokemon, pokemon, move, move.selfBoost, false, true);
		if (!pokemon.hp) { this.battle.faint(pokemon, pokemon, move);  }
		if (!moveResult) {
			this.battle.singleEvent('MoveFail', move, null, target, pokemon, move);
			return false;
		}
		if (!(move.hasSheerForce && pokemon.hasAbility('sheerforce')) && !move.flags['futuremove']) {
			const originalHp = pokemon.hp;
			this.battle.singleEvent('AfterMoveSecondarySelf', move, null, pokemon, target, move);
			this.battle.runEvent('AfterMoveSecondarySelf', pokemon, target, move);
			if (pokemon && pokemon !== target && move.category !== 'Status') { if (pokemon.hp <= pokemon.maxhp / 2 && originalHp > pokemon.maxhp / 2) { this.battle.runEvent('EmergencyExit', pokemon, pokemon); } }
		}
		return true;
	}
	/** NOTE: includes single-target moves */
	trySpreadMoveHit(targets: Pokemon[], pokemon: Pokemon, move: ActiveMove, notActive?: boolean) {
		if (targets.length > 1 && !move.smartTarget) move.spreadHit = true;
		const moveSteps: ((targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) =>
		(number | boolean | "" | undefined)[] | undefined)[] = [
			// 0. check for semi invulnerability
			this.hitStepInvulnerabilityEvent,
			// 1. run the 'TryHit' event (Protect, Magic Bounce, Volt Absorb, etc.) (this is step 2 in gens 5 & 6, and step 4 in gen 4)
			this.hitStepTryHitEvent,
			// 2. check for type immunity (this is step 1 in gens 4-6)
			this.hitStepTypeImmunity,
			// 3. check for various move-specific immunities
			this.hitStepTryImmunity,
			// 4. check accuracy
			this.hitStepAccuracy,
			// 5. break protection effects
			this.hitStepBreakProtect,
			// 6. steal positive boosts (Spectral Thief)
			this.hitStepStealBoosts,
			// 7. loop that processes each hit of the move (has its own steps per iteration)
			this.hitStepMoveHitLoop,
		];
		if (notActive) this.battle.setActiveMove(move, pokemon, targets[0]);
		const hitResult = this.battle.singleEvent('Try', move, null, pokemon, targets[0], move) &&
			this.battle.singleEvent('PrepareHit', move, {}, targets[0], pokemon, move) &&
			this.battle.runEvent('PrepareHit', pokemon, targets[0], move);
		if (!hitResult) {
			if (hitResult === false) {
				this.battle.add('-fail', pokemon);
				this.battle.attrLastMove('[still]');
			}
			return hitResult === this.battle.NOT_FAIL;
		}
		let atLeastOneFailure = false;
		for (const step of moveSteps) {
			const hitResults: (number | boolean | "" | undefined)[] | undefined = step.call(this, targets, pokemon, move);
			if (!hitResults) continue;
			targets = targets.filter((val, i) => hitResults[i] || hitResults[i] === 0);
			atLeastOneFailure = atLeastOneFailure || hitResults.some(val => val === false);
			if (move.smartTarget && atLeastOneFailure) move.smartTarget = false;
			if (!targets.length) { break; }
		}
		move.hitTargets = targets;
		const moveResult = !!targets.length;
		if (!moveResult && !atLeastOneFailure) pokemon.moveThisTurnResult = null;
		const hitSlot = targets.map(p => p.getSlot());
		if (move.spreadHit) this.battle.attrLastMove('[spread] ' + hitSlot.join(','));
		return moveResult;
	}
	hitStepInvulnerabilityEvent(targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) {
		if (move.id === 'helpinghand') return new Array(targets.length).fill(true);
		const hitResults: boolean[] = [];
		for (const [i, target] of targets.entries()) {
			if (target.volatiles['commanding']) { hitResults[i] = false; } 
			else if (this.battle.gen >= 8 && move.id === 'toxic' && pokemon.hasType('Poison')) { hitResults[i] = true; } 
			else { hitResults[i] = this.battle.runEvent('Invulnerability', target, pokemon, move); }
			if (hitResults[i] === false) {
				if (move.smartTarget) { move.smartTarget = false; } 
				else {
					if (!move.spreadHit) this.battle.attrLastMove('[miss]');
					this.battle.add('-miss', pokemon, target);
				}
			}
		}
		return hitResults;
	}
	hitStepTryHitEvent(targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) {
		const hitResults = this.battle.runEvent('TryHit', targets, pokemon, move);
		if (move.weaponmove && move.weaponDamageOnProtect !== false) { for (let i = 0; i < targets.length; i++) { if (hitResults[i] === false) { this.applyWeaponMoveDamage(pokemon, move, 'protect'); } } }
		if (!hitResults.includes(true) && hitResults.includes(false)) {
			this.battle.add('-fail', pokemon);
			this.battle.attrLastMove('[still]');
		}
		for (let i = 0; i < targets.length; i++) {
			if (hitResults[i] !== this.battle.NOT_FAIL) hitResults[i] = hitResults[i] || false;
			if (hitResults[i] === false) targets[i].tryLightCharge(pokemon, move);
		}
		return hitResults;
	}
	hitStepTypeImmunity(targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) {
		if (move.ignoreImmunity === undefined) { move.ignoreImmunity = (move.category === 'Status'); }
		const hitResults = [];
		for (let i = 0; i < targets.length; i++) {
			hitResults[i] = targets[i].runImmunity(move, !move.smartTarget);
			if (!hitResults[i]) targets[i].tryLightCharge(pokemon, move);
		}
		return hitResults;
	}
	hitStepTryImmunity(targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) {
		const hitResults = [];
		for (const [i, target] of targets.entries()) {
			if (this.battle.gen >= 6 && move.flags['powder'] && target !== pokemon && !this.dex.getImmunity('powder', target)) {
				this.battle.debug('natural powder immunity');
				this.battle.add('-immune', target);
				hitResults[i] = false;
			} else if (!move.ignoreImmunity && !this.battle.singleEvent('TryImmunity', move, {}, target, pokemon, move)) {
				this.battle.add('-immune', target);
				hitResults[i] = false;
			} else if (this.battle.gen >= 7 && move.pranksterBoosted && pokemon.hasAbility('prankster') && !targets[i].isAlly(pokemon) && !this.dex.getImmunity('prankster', target)) {
				this.battle.debug('natural prankster immunity');
				if (target.illusion || !(move.status && !this.dex.getImmunity(move.status, target))) { this.battle.hint("Since gen 7, Dark is immune to Prankster moves."); }
				this.battle.add('-immune', target);
				hitResults[i] = false;
			} else { hitResults[i] = true; }
		}
		return hitResults;
	}
	hitStepAccuracy(targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) {
		const hitResults = [];
		for (const [i, target] of targets.entries()) {
			this.battle.activeTarget = target;
			let accuracy = move.accuracy;
			if (move.ohko) { // bypasses accuracy modifiers
				if (!target.isSemiInvulnerable()) {
					accuracy = 30;
					if (move.ohko === 'Ice' && this.battle.gen >= 7 && !pokemon.hasType('Ice')) { accuracy = 20; }
					if (pokemon.level >= target.level && (move.ohko === true || !target.hasType(move.ohko))) { accuracy += (pokemon.level - target.level); } 
					else {
						this.battle.add('-immune', target, '[ohko]');
						hitResults[i] = false;
						continue;
					}
				}
			} else {
				accuracy = this.battle.runEvent('ModifyAccuracy', target, pokemon, move, accuracy);
				if (accuracy !== true) {
					let boost = 0;
					if (!move.ignoreAccuracy) {
						const boosts = this.battle.runEvent('ModifyBoost', pokemon, null, null, { ...pokemon.boosts });
						boost = this.battle.clampIntRange(boosts['accuracy'], -6, 6);
					}
					if (!move.ignoreEvasion) {
						const boosts = this.battle.runEvent('ModifyBoost', target, null, null, { ...target.boosts });
						boost = this.battle.clampIntRange(boost - boosts['evasion'], -6, 6);
					}
					if (boost > 0) { accuracy = this.battle.trunc(accuracy * (3 + boost) / 3); } 
					else if (boost < 0) { accuracy = this.battle.trunc(accuracy * 3 / (3 - boost)); }
				}
			}
			if ( move.alwaysHit || (move.id === 'toxic' && this.battle.gen >= 8 && pokemon.hasType('Poison')) || (move.target === 'self' && move.category === 'Status' && !target.isSemiInvulnerable()))  { accuracy = true; } 
			else { accuracy = this.battle.runEvent('Accuracy', target, pokemon, move, accuracy); }
			if (accuracy !== true && !this.battle.randomChance(accuracy, 100)) {
				if (move.smartTarget) { move.smartTarget = false; } 
				else {
					if (!move.spreadHit) this.battle.attrLastMove('[miss]');
					this.battle.add('-miss', pokemon, target);
				}
				if (!move.ohko && pokemon.hasItem('blunderpolicy') && pokemon.useItem()) { this.battle.boost({ spe: 2 }, pokemon); }
				hitResults[i] = false;
				continue;
			}
			hitResults[i] = true;
		}
		return hitResults;
	}
	hitStepBreakProtect(targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) {
		if (move.breaksProtect) {
			for (const target of targets) {
				let broke = false;
				for (const effectid of [ 'banefulbunker', 'burningbulwark', 'kingsshield', 'obstruct', 'protect', 'silktrap', 'spikyshield', 'mirrorshield', ]) { if (target.removeVolatile(effectid)) broke = true; }
				if (this.battle.gen >= 6 || !target.isAlly(pokemon)) { for (const effectid of ['craftyshield', 'matblock', 'quickguard', 'wideguard']) { if (target.side.removeSideCondition(effectid)) broke = true; } }
				if (broke) {
					if (move.id === 'feint') { this.battle.add('-activate', target, 'move: Feint'); } 
					else { this.battle.add('-activate', target, `move: ${move.name}`, '[broken]'); }
					if (this.battle.gen >= 6) delete target.volatiles['stall'];
					if (move.pierce) { target.getMoveHitData(move).pierced = move.pierce; } // breaksProtect is still fully removed, but this hit isn't full damage for free
				}
			}
		}
		return undefined;
	}
	hitStepStealBoosts(targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) {
		const target = targets[0]; // hardcoded
		if (move.stealsBoosts) {
			const boosts: SparseBoostsTable = {};
			let stolen = false;
			for (const statName of Object.keys(target.boosts) as BoostID[]) {
				const stage = target.boosts[statName];
				if (stage > 0) {
					boosts[statName] = stage;
					stolen = true;
				}
			}
			if (stolen) {
				this.battle.attrLastMove('[still]');
				this.battle.add('-clearpositiveboost', target, pokemon, 'move: ' + move.name);
				this.battle.boost(boosts, pokemon, pokemon);
				for (const statName of Object.keys(boosts) as BoostID[]) { boosts[statName] = 0; }
				target.setBoost(boosts);
				if (move.id === "spectralthief") { this.battle.addMove('-anim', pokemon, "Spectral Thief", target); }
			}
		}
		return undefined;
	}
	afterMoveSecondaryEvent(targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) {
		// console.log(`${targets}, ${pokemon}, ${move}`)
		if (!(move.hasSheerForce && pokemon.hasAbility('sheerforce'))) {
			this.battle.singleEvent('AfterMoveSecondary', move, null, targets[0], pokemon, move);
			this.battle.runEvent('AfterMoveSecondary', targets, pokemon, move);
		}
		return undefined;
	} /** NOTE: used only for moves that target sides/fields rather than pokemon */
	tryMoveHit(targetOrTargets: Pokemon | Pokemon[], pokemon: Pokemon, move: ActiveMove): number | undefined | false | '' {
		const target = Array.isArray(targetOrTargets) ? targetOrTargets[0] : targetOrTargets;
		const targets = Array.isArray(targetOrTargets) ? targetOrTargets : [target];
		this.battle.setActiveMove(move, pokemon, targets[0]);
		let hitResult = this.battle.singleEvent('Try', move, null, pokemon, target, move) && this.battle.singleEvent('PrepareHit', move, {}, target, pokemon, move) && this.battle.runEvent('PrepareHit', pokemon, target, move);
		if (!hitResult) {
			if (hitResult === false) {
				this.battle.add('-fail', pokemon);
				this.battle.attrLastMove('[still]');
			}
			return false;
		}
		const isFFAHazard = move.target === 'foeSide' && this.battle.gameType === 'freeforall';
		if (move.target === 'all') { hitResult = this.battle.runEvent('TryHitField', target, pokemon, move); } 
		else if (isFFAHazard) {
			const hitResults: any[] = this.battle.runEvent('TryHitSide', targets, pokemon, move);
			if (hitResults.some(result => !result)) {
				if (move.weaponmove && move.weaponDamageOnProtect !== false) { for (const result of hitResults) { if (result === false) this.applyWeaponMoveDamage(pokemon, move, 'protect'); } }
				return false;
			}
			hitResult = true;
		} else { hitResult = this.battle.runEvent('TryHitSide', target, pokemon, move); }
		if (!hitResult) {
			if (hitResult === false) {
				if (move.weaponmove && move.weaponDamageOnProtect !== false) { this.applyWeaponMoveDamage(pokemon, move, 'protect'); }
				this.battle.add('-fail', pokemon);
				this.battle.attrLastMove('[still]');
			}
			return false;
		}
		return this.moveHit(isFFAHazard ? targets : target, pokemon, move);
	}
	hitStepMoveHitLoop(targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) { // Temporary name
		let damage: (number | boolean | undefined)[] = [];
		for (let i = 0; i < targets.length; i++) { damage[i] = 0; }
		move.totalDamage = 0;
		pokemon.lastDamage = 0;
		let targetHits = move.multihit || 1;
		if (Array.isArray(targetHits)) { // yes, it's hardcoded... meh
			if (targetHits[0] === 2 && targetHits[1] === 5) { // 35-35-15-15 out of 100 for 2-3-4-5 hits
				targetHits = this.battle.sample([2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 5, 5, 5]);
				if (targetHits < 4 && pokemon.hasItem('loadeddice')) { targetHits = 5 - this.battle.random(2); }	
			} else { targetHits = this.battle.random(targetHits[0], targetHits[1] + 1); }
		}
		if (targetHits === 10 && pokemon.hasItem('loadeddice')) targetHits -= this.battle.random(7);
		targetHits = Math.floor(targetHits);
		let nullDamage = true;
		let moveDamage: (number | boolean | undefined)[] = [];
		const isSleepUsable = move.sleepUsable || this.dex.moves.get(move.sourceEffect).sleepUsable;
		let targetsCopy: (Pokemon | false | null)[] = targets.slice(0);
		let hit: number;
		for (hit = 1; hit <= targetHits; hit++) {
			if (damage.includes(false)) break;
			if (hit > 1 && pokemon.status === 'slp' && (!isSleepUsable || this.battle.gen === 4)) break;
			if (targets.every(target => !target?.hp)) break;
			move.hit = hit;
			if (move.smartTarget && targets.length > 1) {
				targetsCopy = [targets[hit - 1]];
				damage = [damage[hit - 1]];
			} else { targetsCopy = targets.slice(0); }
			const target = targetsCopy[0]; // some relevant-to-single-target-moves-only things are hardcoded
			if (target && typeof move.smartTarget === 'boolean') { 
				if (hit > 1) { this.battle.addMove('-anim', pokemon, move.name, target); } 
				else { this.battle.retargetLastMove(target); }
			}
			if (target && move.multiaccuracy && hit > 1) { // like this (Triple Kick)
				let accuracy = move.accuracy;
				const boostTable = [1, 4 / 3, 5 / 3, 2, 7 / 3, 8 / 3, 3];
				if (accuracy !== true) {
					if (!move.ignoreAccuracy) {
						const boosts = this.battle.runEvent('ModifyBoost', pokemon, null, null, { ...pokemon.boosts });
						const boost = this.battle.clampIntRange(boosts['accuracy'], -6, 6);
						if (boost > 0) { accuracy *= boostTable[boost]; } 
						else { accuracy /= boostTable[-boost]; }
					}
					if (!move.ignoreEvasion) {
						const boosts = this.battle.runEvent('ModifyBoost', target, null, null, { ...target.boosts });
						const boost = this.battle.clampIntRange(boosts['evasion'], -6, 6);
						if (boost > 0) { accuracy /= boostTable[boost]; } 
						else if (boost < 0) { accuracy *= boostTable[-boost]; }
					}
				}
				accuracy = this.battle.runEvent('ModifyAccuracy', target, pokemon, move, accuracy);
				if (!move.alwaysHit) {
					accuracy = this.battle.runEvent('Accuracy', target, pokemon, move, accuracy);
					if (accuracy !== true && !this.battle.randomChance(accuracy, 100)) break;
				}
			}
			const moveData = move;
			if (!moveData.flags) moveData.flags = {};
			let moveDamageThisHit;
			// Modifies targetsCopy (which is why it's a copy)
			[moveDamageThisHit, targetsCopy] = this.spreadMoveHit(targetsCopy, pokemon, move, moveData);
			// When Dragon Darts targets two different pokemon, targetsCopy is a length 1 array each hit so spreadMoveHit returns a length 1 damage array
			if (move.smartTarget) { moveDamage.push(...moveDamageThisHit); } 
			else { moveDamage = moveDamageThisHit; }
			if (!moveDamage.some(val => val !== false)) break;
			nullDamage = false;
			if (move.weaponmove) { // weapons lose durability each hit
				for (const md of moveDamageThisHit) {
					if (md !== false) {
						this.applyWeaponMoveDamage(pokemon, move, 'hit');
						if (pokemon.maxWeaponDurability > 0 && pokemon.weaponDurability <= 0) break;
					}
				}
			}
			for (const [i, md] of moveDamage.entries()) {
				if (move.smartTarget && i !== hit - 1) continue;
				damage[i] = md === true || !md ? 0 : md;
				if (move.recoil) { //recoil moves store how much would've been dealt had the target not reached 0HP first for recoil purposes
					if (!move.intendedTotalDamage) move.intendedTotalDamage = 0;
					if (typeof md === 'number') { move.intendedTotalDamage += md; }
				}
				// Total damage dealt is accumulated for the purposes of recoil 
				move.totalDamage += damage[i];
			}
			if (move.mindBlownRecoil) {
				const hpBeforeRecoil = pokemon.hp;
				this.battle.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get(move.id), true);
				move.mindBlownRecoil = false;
				if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) { this.battle.runEvent('EmergencyExit', pokemon, pokemon); }
			}
			this.battle.eachEvent('Update');
			if (!pokemon.hp && targets.length === 1) {
				hit++;
				break;
			}
		}
		if (hit === 1) return damage.fill(false); // hit is 1 higher than the actual hit count
		if (nullDamage) damage.fill(false);
		this.battle.faintMessages(false, false, !pokemon.hp);
		if (move.multihit && typeof move.smartTarget !== 'boolean') { this.battle.add('-hitcount', targets[0], hit - 1); }
		if ((move.recoil) && move.totalDamage) {
			const hpBeforeRecoil = pokemon.hp;
			let recoilBase = move.totalDamage;
			if (move.recoil && move.intendedTotalDamage) { recoilBase = move.intendedTotalDamage; }
			this.battle.damage(this.calcRecoilDamage(recoilBase, move, pokemon), pokemon, pokemon, 'recoil');
			if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) { this.battle.runEvent('EmergencyExit', pokemon, pokemon); }
		}
		if (move.struggleRecoil) {
			const hpBeforeRecoil = pokemon.hp;
			let recoilDamage;
			if (this.dex.gen >= 5) { recoilDamage = this.battle.clampIntRange(Math.round(pokemon.baseMaxhp / 4), 1); } 
			else { recoilDamage = this.battle.clampIntRange(this.battle.trunc(pokemon.maxhp / 4), 1); }
			this.battle.directDamage(recoilDamage, pokemon, pokemon, { id: 'strugglerecoil' } as Condition);
			if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) { this.battle.runEvent('EmergencyExit', pokemon, pokemon); }
		}
		if (move.smartTarget) { targetsCopy = targets.slice(0); }
		for (const [i, target] of targetsCopy.entries()) {
			if (target && pokemon !== target) {
				target.gotAttacked(move, moveDamage[i] as number | false | undefined, pokemon);
				if (typeof moveDamage[i] === 'number') { target.timesAttacked += move.smartTarget ? 1 : hit - 1; }
			}
		}
		if (move.ohko && !targets[0].hp) this.battle.add('-ohko');
		if (!damage.some(val => !!val || val === 0)) return damage;
		this.battle.eachEvent('Update');
		this.afterMoveSecondaryEvent(targetsCopy.filter(val => !!val), pokemon, move);
		if (!(move.hasSheerForce && pokemon.hasAbility('sheerforce'))) {
			for (const [i, d] of damage.entries()) { // There are no multihit spread moves, so it's safe to use move.totalDamage for multihit moves
				// The previous check was for `move.multihit`, but that fails for Dragon Darts
				const curDamage = targets.length === 1 ? move.totalDamage : d;
				if (typeof curDamage === 'number' && targets[i].hp) {
					const targetHPBeforeDamage = (targets[i].hurtThisTurn || 0) + curDamage;
					if (targets[i].hp <= targets[i].maxhp / 2 && targetHPBeforeDamage > targets[i].maxhp / 2) { this.battle.runEvent('EmergencyExit', targets[i], pokemon); }
				}
			}
		}
		return damage;
	}
	spreadMoveHit(targets: SpreadMoveTargets, pokemon: Pokemon, moveOrMoveName: ActiveMove, hitEffect?: Dex.HitEffect, isSecondary?: boolean, isSelf?: boolean): [SpreadMoveDamage, SpreadMoveTargets] {
		const target = targets[0];
		let damage: (number | boolean | undefined)[] = [];
		for (let i = 0; i < targets.length; i++) { damage[i] = true; }
		const move = this.dex.getActiveMove(moveOrMoveName);
		let hitResult: boolean | number | null = true;
		let moveData = hitEffect as ActiveMove;
		if (!moveData) moveData = move;
		if (!moveData.flags) moveData.flags = {};
		if (move.target === 'all' && !isSelf) { hitResult = this.battle.singleEvent('TryHitField', moveData, {}, target || null, pokemon, move); } 
		else if ((move.target === 'foeSide' || move.target === 'allySide' || move.target === 'allyTeam') && !isSelf) { hitResult = this.battle.singleEvent('TryHitSide', moveData, {}, target || null, pokemon, move); } 
		else if (target) { hitResult = this.battle.singleEvent('TryHit', moveData, {}, target, pokemon, move); }
		if (!hitResult) {
			if (hitResult === false) {
				if (move.weaponmove && move.weaponDamageOnProtect !== false) { this.applyWeaponMoveDamage(pokemon, move, 'protect'); }
				this.battle.add('-fail', pokemon);
				this.battle.attrLastMove('[still]');
			}
			return [[false], targets];
		}
		if (!isSecondary && !isSelf) { if (move.target !== 'all' && move.target !== 'allyTeam' && move.target !== 'allySide' && move.target !== 'foeSide') { damage = this.tryPrimaryHitEvent(damage, targets, pokemon, move, moveData, isSecondary); } }
		for (let i = 0; i < targets.length; i++) {
			if (damage[i] === this.battle.HIT_SUBSTITUTE) {
				damage[i] = true;
				targets[i] = null;
			}
			if (targets[i] && isSecondary && !moveData.self) { damage[i] = true; }
			if (!damage[i]) targets[i] = false;
		}
		damage = this.getSpreadDamage(damage, targets, pokemon, move, moveData, isSecondary, isSelf);
		for (let i = 0; i < targets.length; i++) { if (damage[i] === false) targets[i] = false; }
		damage = this.battle.spreadDamage(damage, targets, pokemon, move);
		for (let i = 0; i < targets.length; i++) { if (damage[i] === false) targets[i] = false; }
		damage = this.runMoveEffects(damage, targets, pokemon, move, moveData, isSecondary, isSelf);
		for (let i = 0; i < targets.length; i++) { if (!damage[i] && damage[i] !== 0) targets[i] = false; }
		const activeTarget = this.battle.activeTarget;
		if (moveData.self && !move.selfDropped) this.selfDrops(targets, pokemon, move, moveData, isSecondary);
		if (moveData.secondaries) this.secondaries(targets, pokemon, move, moveData, isSelf);
		this.battle.activeTarget = activeTarget;
		if (moveData.forceSwitch) damage = this.forceSwitch(damage, targets, pokemon, move);
		for (let i = 0; i < targets.length; i++) { if (!damage[i] && damage[i] !== 0) targets[i] = false; }
		const damagedTargets: Pokemon[] = [];
		const damagedDamage = [];
		for (const [i, t] of targets.entries()) {
			if (typeof damage[i] === 'number' && t) {
				damagedTargets.push(t);
				damagedDamage.push(damage[i]);
			}
		}
		const pokemonOriginalHP = pokemon.hp;
		if (damagedDamage.length && !isSecondary && !isSelf) {
			this.battle.runEvent('DamagingHit', damagedTargets, pokemon, move, damagedDamage);
			for (const t of damagedTargets) {
				if (move.type === 'Electric' && t.hasType('Electric')) {
					if (!t.volatiles['charged']) {
						t.addVolatile('charged');
						this.battle.add('-start', t, 'charged', '[from] Electric type');
					}
				}
				t.tryLightCharge(pokemon, move);
			}
			if (moveData.onAfterHit) { for (const t of damagedTargets) { this.battle.singleEvent('AfterHit', moveData, {}, t, pokemon, move); } }
			if (pokemon.hp && pokemon.hp <= pokemon.maxhp / 2 && pokemonOriginalHP > pokemon.maxhp / 2) { this.battle.runEvent('EmergencyExit', pokemon); }
		}
		return [damage, targets];
	}
	tryPrimaryHitEvent( damage: SpreadMoveDamage, targets: SpreadMoveTargets, pokemon: Pokemon, move: ActiveMove, moveData: ActiveMove, isSecondary?: boolean): SpreadMoveDamage {
		for (const [i, target] of targets.entries()) {
			if (!target) continue;
			damage[i] = this.battle.runEvent('TryPrimaryHit', target, pokemon, moveData);
		}
		return damage;
	}
	getSpreadDamage( damage: SpreadMoveDamage, targets: SpreadMoveTargets, source: Pokemon, move: ActiveMove, moveData: ActiveMove, isSecondary?: boolean, isSelf?: boolean): SpreadMoveDamage {
		for (const [i, target] of targets.entries()) {
			if (!target) continue;
			this.battle.activeTarget = target;
			damage[i] = undefined;
			const curDamage = this.getDamage(source, target, moveData);
			// getDamage has several possible return values:
			//   a number:
			//     means that much damage is dealt (0 damage still counts as dealing damage for the purposes of things like Static)
			//   false:
			//     gives error message: "But it failed!" and move ends
			//   null:
			//     the move ends, with no message (usually, a custom fail message was already output by an event handler)
			//   undefined:
			//     means no damage is dealt and the move continues
			// basically, these values have the same meanings as they do for event handlers.
			if (curDamage === false || curDamage === null) {
				if (damage[i] === false && !isSecondary && !isSelf) {
					this.battle.add('-fail', source);
					this.battle.attrLastMove('[still]');
				}
				this.battle.debug('damage calculation interrupted');
				damage[i] = false;
				continue;
			}
			damage[i] = curDamage;
		}
		return damage;
	}
	runMoveEffects(damage: SpreadMoveDamage, targets: SpreadMoveTargets, source: Pokemon, move: ActiveMove, moveData: ActiveMove, isSecondary?: boolean, isSelf?: boolean) {
		let didAnything: number | boolean | null | undefined = damage.reduce(this.combineResults);
		for (const [i, target] of targets.entries()) {
			if (target === false) continue;
			let hitResult;
			let didSomething: number | boolean | null | undefined = undefined;
			if (target) {
				if (moveData.boosts && !target.fainted) {
					hitResult = this.battle.boost(moveData.boosts, target, source, move, isSecondary, isSelf);
					didSomething = this.combineResults(didSomething, hitResult);
				}
				if (moveData.heal && !target.fainted) {
					if (target.hp >= target.maxhp) {
						this.battle.add('-fail', target, 'heal');
						this.battle.attrLastMove('[still]');
						damage[i] = this.combineResults(damage[i], false);
						didAnything = this.combineResults(didAnything, null);
						continue;
					}
					const amount = target.baseMaxhp * moveData.heal[0] / moveData.heal[1];
					const d = this.battle.heal((this.battle.gen < 5 ? Math.floor : Math.round)(amount), target, source, move);
					if (!d && d !== 0) {
						if (d !== null) {
							this.battle.add('-fail', source);
							this.battle.attrLastMove('[still]');
						}
						this.battle.debug('heal interrupted');
						damage[i] = this.combineResults(damage[i], false);
						didAnything = this.combineResults(didAnything, null);
						continue;
					}
					didSomething = true;
				}
				if (moveData.status) {
					hitResult = target.trySetStatus(moveData.status, source, moveData.ability ? moveData.ability : move);
					if (!hitResult && move.status) {
						damage[i] = this.combineResults(damage[i], false);
						didAnything = this.combineResults(didAnything, null);
						continue;
					}
					didSomething = this.combineResults(didSomething, hitResult);
				}
				if (moveData.forceStatus) {
					hitResult = target.setStatus(moveData.forceStatus, source, move);
					didSomething = this.combineResults(didSomething, hitResult);
				}
				if (moveData.volatileStatus) {
					hitResult = target.addVolatile(moveData.volatileStatus, source, move);
					didSomething = this.combineResults(didSomething, hitResult);
				}
				if (moveData.sideCondition) {
					hitResult = target.side.addSideCondition(moveData.sideCondition, source, move);
					didSomething = this.combineResults(didSomething, hitResult);
				}
				if (moveData.slotCondition) {
					hitResult = target.side.addSlotCondition(target, moveData.slotCondition, source, move);
					didSomething = this.combineResults(didSomething, hitResult);
				}
				if (moveData.weather) {
					hitResult = this.battle.field.setWeather(moveData.weather, source, move);
					didSomething = this.combineResults(didSomething, hitResult);
				}
				if (moveData.terrain) {
					hitResult = this.battle.field.setTerrain(moveData.terrain, source, move);
					didSomething = this.combineResults(didSomething, hitResult);
				}
				if (moveData.pseudoWeather) { // Room effects: wonderroom, trickroom, magicroom, inverseroom should be mutually exclusive
					const roomTypes = ['wonderroom', 'trickroom', 'magicroom', 'inverseroom'];
					if (roomTypes.includes(moveData.pseudoWeather)) { hitResult = this.battle.field.setRoom(moveData.pseudoWeather, source, move); } 
					else { hitResult = this.battle.field.addPseudoWeather(moveData.pseudoWeather, source, move); }
					didSomething = this.combineResults(didSomething, hitResult);
				}
				if (moveData.forceSwitch) {
					hitResult = !!this.battle.canSwitch(target.side);
					didSomething = this.combineResults(didSomething, hitResult);
				}
				// Hit events
				//   These are like the TryHit events, except we don't need a FieldHit event.
				//   Scroll up for the TryHit event documentation, and just ignore the "Try" part. ;)
				if (move.target === 'all' && !isSelf) {
					if (moveData.onHitField) {
						hitResult = this.battle.singleEvent('HitField', moveData, {}, target, source, move);
						didSomething = this.combineResults(didSomething, hitResult);
					}
				} else if ((move.target === 'foeSide' || move.target === 'allySide') && !isSelf) {
					if (moveData.onHitSide) {
						hitResult = this.battle.singleEvent('HitSide', moveData, {}, target.side, source, move);
						didSomething = this.combineResults(didSomething, hitResult);
					}
				} else {
					if (moveData.onHit) {
						hitResult = this.battle.singleEvent('Hit', moveData, {}, target, source, move);
						didSomething = this.combineResults(didSomething, hitResult);
					}
					if (!isSelf && !isSecondary) { this.battle.runEvent('Hit', target, source, move); }
				}
			}
			if (moveData.selfdestruct === 'ifHit' && damage[i] !== false) { this.battle.faint(source, source, move); }
			if (moveData.selfSwitch) {
				if (this.battle.canSwitch(source.side) && !source.volatiles['commanded']) { didSomething = true; } 
				else { didSomething = this.combineResults(didSomething, false); }
			}
			// Move didn't fail because it didn't try to do anything
			if (didSomething === undefined) didSomething = true;
			damage[i] = this.combineResults(damage[i], didSomething === null ? false : didSomething);
			didAnything = this.combineResults(didAnything, didSomething);
		}
		if (!didAnything && didAnything !== 0 && !moveData.self && !moveData.selfdestruct) {
			if (!isSelf && !isSecondary) {
				if (didAnything === false) {
					this.battle.add('-fail', source);
					this.battle.attrLastMove('[still]');
				}
			}
			this.battle.debug('move failed because it did nothing');
		} else if (move.selfSwitch && source.hp && !source.volatiles['commanded']) { source.switchFlag = move.id; }
		return damage;
	}
	selfDrops(
		targets: SpreadMoveTargets, source: Pokemon,
		move: ActiveMove, moveData: ActiveMove, isSecondary?: boolean
	) {
		for (const target of targets) {
			if (target === false) continue;
			if (moveData.self && !move.selfDropped) {
				if (!isSecondary && moveData.self.boosts) {
					const secondaryRoll = this.battle.random(100);
					if (typeof moveData.self.chance === 'undefined' || secondaryRoll < moveData.self.chance) { this.moveHit(source, source, move, moveData.self, isSecondary, true); }
					if (!move.multihit) move.selfDropped = true;
				} else { this.moveHit(source, source, move, moveData.self, isSecondary, true); }
			}
		}
	}
	secondaries(targets: SpreadMoveTargets, source: Pokemon, move: ActiveMove, moveData: ActiveMove, isSelf?: boolean) {
		if (!moveData.secondaries) return;
		for (const target of targets) {
			if (target === false) continue;
			const secondaries: Dex.SecondaryEffect[] = this.battle.runEvent('ModifySecondaries', target, source, moveData, moveData.secondaries.slice());
			for (const secondary of secondaries) {
				const secondaryRoll = this.battle.random(100);
				// User stat boosts or target stat drops can possibly overflow if it goes beyond 256 in Gen 8 or prior
				const secondaryOverflow = (secondary.boosts || secondary.self) && this.battle.gen <= 8;
				if (typeof secondary.chance === 'undefined' || secondaryRoll < (secondaryOverflow ? secondary.chance % 256 : secondary.chance)) { this.moveHit(target, source, move, secondary, true, isSelf); }
			}
		}
	}
	forceSwitch( damage: SpreadMoveDamage, targets: SpreadMoveTargets, source: Pokemon, move: ActiveMove ) {
		for (const [i, target] of targets.entries()) {
			if (target && target.hp > 0 && source.hp > 0 && this.battle.canSwitch(target.side)) {
				const hitResult = this.battle.runEvent('DragOut', target, source, move);
				if (hitResult) { target.forceSwitchFlag = true; } 
				else if (hitResult === false && move.category === 'Status') {
					this.battle.add('-fail', source);
					this.battle.attrLastMove('[still]');
					damage[i] = false;
				}
			}
		}
		return damage;
	}
	moveHit(targets: Pokemon | null | (Pokemon | null)[], pokemon: Pokemon, moveOrMoveName: ActiveMove, moveData?: Dex.HitEffect, isSecondary?: boolean, isSelf?: boolean): number | undefined | false {
		if (!Array.isArray(targets)) targets = [targets];
		const retVal = this.spreadMoveHit(targets, pokemon, moveOrMoveName, moveData, isSecondary, isSelf)[0][0];
		return retVal === true ? undefined : retVal;
	}
	calcRecoilDamage(damageDealt: number, move: Move, pokemon: Pokemon): number {
		let recoil = Math.round(damageDealt * move.recoil![0] / move.recoil![1]);
		// Halve recoil if the user has the Reckless ability
		if (pokemon.hasAbility && pokemon.hasAbility('reckless')) { recoil = Math.floor(recoil / 2); }
		return this.battle.clampIntRange(recoil, 1);
	}
	targetTypeChoices(targetType: string) { return CHOOSABLE_TARGETS.has(targetType); }
	combineResults<T extends number | boolean | null | '' | undefined,
		U extends number | boolean | null | '' | undefined>( left: T, right: U ): T | U {
		const NOT_FAILURE = 'string';
		const NULL = 'object';
		const resultsPriorities = ['undefined', NOT_FAILURE, NULL, 'boolean', 'number'];
		if (resultsPriorities.indexOf(typeof left) > resultsPriorities.indexOf(typeof right)) { return left; } 
		else if (left && !right && right !== 0) { return left; } 
		else if (typeof left === 'number' && typeof right === 'number') { return (left + right) as T; } 
		else { return right; }
	}
	/**
	 * 0 is a success dealing 0 damage, such as from False Swipe at 1 HP.
	 * Normal PS return value rules apply:
	 * undefined = success, null = silent failure, false = loud failure
	 */
	getDamage(source: Pokemon, target: Pokemon, move: string | number | ActiveMove, suppressMessages = false): number | undefined | null | false {
		if (typeof move === 'string') move = this.dex.getActiveMove(move);
		if (typeof move === 'number') {
			const basePower = move;
			move = new Dex.Move({ basePower, type: '???', category: 'Physical', willCrit: false, }) as ActiveMove;
			move.hit = 0;
		}
		const baseDamageCalc = this.constructor.prototype.getDamage;
		const calculateFusionDamage = () => {
			const originalOverride = (move as any).overrideDefensiveStat;
			try {
				(move as any).overrideDefensiveStat = 'def';
				const damageWithDef = baseDamageCalc.call(this, source, target, move, suppressMessages);
				(move as any).overrideDefensiveStat = 'spd';
				const damageWithSpD = baseDamageCalc.call(this, source, target, move, suppressMessages);
				if (typeof damageWithDef === 'number' && typeof damageWithSpD === 'number') { return Math.floor((damageWithDef + damageWithSpD) / 2); }
				return damageWithDef === false || damageWithSpD === false ?
					false :
					damageWithDef || damageWithSpD;
			} finally {
				if (originalOverride) { (move as any).overrideDefensiveStat = originalOverride; } 
				else { delete (move as any).overrideDefensiveStat; }
			}
		};
		const isFusionMode = (move.id === 'fusionbolt' || move.id === 'fusionflare') && (move as any).fusionMode;
		// Ability Shield: ignore enemy abilities during defensive damage calculation
		if (source && target && source !== target && target.hasItem?.('abilityshield')) {
			const s = source as any;
			const saved = {
				ability: s.ability,
				baseAbility: s.baseAbility,
				ability1: s.ability1,
				ability2: s.ability2,
				abilityState: s.abilityState,
				abilityState1: s.abilityState1,
				abilityState2: s.abilityState2,
			};
			s.ability = 'noability';
			s.baseAbility = 'noability';
			s.ability1 = 'noability';
			s.ability2 = '';
			s.abilityState = this.battle.initEffectState({id: 'noability', target: source});
			s.abilityState1 = s.abilityState;
			delete s.abilityState2;
			try {
				if (isFusionMode) return calculateFusionDamage();
				// @ts-ignore
				return baseDamageCalc.call(this, source, target, move, suppressMessages);
			} finally {
				s.ability = saved.ability;
				s.baseAbility = saved.baseAbility;
				s.ability1 = saved.ability1;
				s.ability2 = saved.ability2;
				s.abilityState = saved.abilityState;
				s.abilityState1 = saved.abilityState1;
				s.abilityState2 = saved.abilityState2;
			}
		}
		if (isFusionMode) return calculateFusionDamage();
		if (!target.runImmunity(move, !suppressMessages)) { return false; }
		if (move.ohko) return this.battle.gen === 3 ? target.hp : target.maxhp;
		if (move.damageCallback) return move.damageCallback.call(this.battle, source, target);
		if (move.damage === 'level') { return source.level; } 
		else if (move.damage) { return move.damage; }
		const category = this.battle.getCategory(move);
		let basePower: number | false | null = move.basePower;
		if (move.basePowerCallback) { basePower = move.basePowerCallback.call(this.battle, source, target, move); }
		if (!basePower) return basePower === 0 ? undefined : basePower;
		basePower = this.battle.clampIntRange(basePower, 1);
		let critMult;
		let critRatio = (move.critRatio || 0) + (source.boosts.crit || 0);
		if (source.m.dragoncheer) { critRatio += source.m.dragoncheer * (source.hasType('Dragon') ? 5 : 2); }
		critRatio = this.battle.runEvent('ModifyCritRatio', source, target, move, critRatio);
		critMult = [96, 64, 48, 24, 16, 12, 8, 6, 4, 3, 2, 1.5, 1.333, 1.2, 1];
		const moveHit = target.getMoveHitData(move);
		moveHit.crit = move.willCrit || false;
		if (move.willCrit === undefined) {	// If critRatio <= 0, never crit
			if (critRatio > 0) { moveHit.crit = this.battle.randomChance(1, critMult[critRatio]); } 
			else { moveHit.crit = false; }
		}
		if (moveHit.crit) { moveHit.crit = this.battle.runEvent('CriticalHit', target, null, move); }
		// happens after crit calculation
		basePower = this.battle.runEvent('BasePower', source, target, move, basePower, true);
		if (!basePower) return 0;
		basePower = this.battle.clampIntRange(basePower, 1);
		const dexMove = this.dex.moves.get(move.id);
		if (source.terastallized && (source.terastallized === 'Stellar' ?
			!source.stellarBoostedTypes.includes(move.type) : source.hasType(move.type)) && basePower < 60 && dexMove.priority <= 0 && !dexMove.multihit &&
			// Hard move.basePower check for moves like Dragon Energy that have variable BP
			!((move.basePower === 0 || move.basePower === 150) && move.basePowerCallback)
		) { basePower = 60; }
		const level = source.level;
		const attacker = move.overrideOffensivePokemon === 'target' ? target : source;
		const defender = move.overrideDefensivePokemon === 'source' ? source : target;
		const isPhysical = move.category === 'Physical';
		let attackStat: StatIDExceptHP = move.overrideOffensiveStat || (isPhysical ? 'atk' : 'spa');
		const defenseStat: StatIDExceptHP = move.overrideDefensiveStat || (isPhysical ? 'def' : 'spd');
		const statTable = { atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe' };
		let atkBoosts = attacker.boosts[attackStat];
		let defBoosts = defender.boosts[defenseStat];
		let ignoreNegativeOffensive = !!move.ignoreNegativeOffensive;
		let ignorePositiveDefensive = !!move.ignorePositiveDefensive;
		if (moveHit.crit) {
			ignoreNegativeOffensive = true;
			ignorePositiveDefensive = true;
		}
		const ignoreOffensive = !!(move.ignoreOffensive || (ignoreNegativeOffensive && atkBoosts < 0));
		const ignoreDefensive = !!(move.ignoreDefensive || (ignorePositiveDefensive && defBoosts > 0));
		if (ignoreOffensive) {
			this.battle.debug('Negating (sp)atk boost/penalty.');
			atkBoosts = 0;
		}
		if (ignoreDefensive) {
			this.battle.debug('Negating (sp)def boost/penalty.');
			defBoosts = 0;
		}
		let attack = attacker.calculateStat(attackStat, atkBoosts, 1, source);
		let defense = defender.calculateStat(defenseStat, defBoosts, 1, target);
		attackStat = (category === 'Physical' ? 'atk' : 'spa');
		// Apply Stat Modifiers
		attack = this.battle.runEvent('Modify' + statTable[attackStat], source, target, move, attack);
		defense = this.battle.runEvent('Modify' + statTable[defenseStat], target, source, move, defense);
		const tr = this.battle.trunc;
		// int(int(int(2 * L / 5 + 2) * A * P / D) / 50);
		const baseDamage = tr(tr(tr(tr(2 * level / 5 + 2) * basePower * attack) / defense) / 50);
		// Calculate damage modifiers separately (order differs between generations)
		return this.modifyDamage(baseDamage, source, target, move, suppressMessages);
	}
	modifyDamage( baseDamage: number, pokemon: Pokemon, target: Pokemon, move: ActiveMove, suppressMessages = false )  {
		const tr = this.battle.trunc;
		if (!move.type) move.type = '???';
		const type = move.type;
		baseDamage += 2;
		if (move.spreadHit) {
			// multi-target modifier (doubles only)
			const spreadModifier = this.battle.gameType === 'freeforall' ? 0.5 : 0.75;
			this.battle.debug(`Spread modifier: ${spreadModifier}`);
			baseDamage = this.battle.modify(baseDamage, spreadModifier);
		} else if (move.multihitType === 'parentalbond' && move.hit > 1) { // Parental Bond modifier
			const bondModifier = 0.25;
			this.battle.debug(`Parental Bond modifier: ${bondModifier}`);
			baseDamage = this.battle.modify(baseDamage, bondModifier);
		} else if (move.multihitType === 'sixminded') {
			// Six Minded modifier
			const sixmindModifier = 0.2;
			this.battle.debug(`Six Minded modifier: ${sixmindModifier}`);
			baseDamage = this.battle.modify(baseDamage, sixmindModifier);
		}
		// weather modifier
		baseDamage = this.battle.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);
		// crit - not a modifier
		const isCrit = target.getMoveHitData(move).crit;
		if (isCrit) { baseDamage = tr(baseDamage * (move.critModifier = 1.5)); }
		// random factor - also not a modifier
		baseDamage = this.battle.randomizer(baseDamage);
		//region STAB
		let stab: number | [number, number] = 1;
		const moveTypes = [move.type];
		if (move.type2 && move.type2 !== move.type) moveTypes.push(move.type2);
		const matches = move.forceSTAB ? moveTypes : moveTypes.filter(t => pokemon.hasType(t) || pokemon.getTypes(false, true).includes(t));
		const isSTAB = matches.length > 0;
		const matchesBoth = moveTypes.length === 2 && matches.length === 2 && moveTypes[0] !== moveTypes[1] && matches[0] !== matches[1];
		if (isSTAB) {
			if (matchesBoth) { stab = 1.7; } 
			else { stab = 1.5; }
		}
		if (pokemon.terastallized === 'Stellar') {
			const originalTypes = pokemon.volatiles['stellaroriginal']?.types || [];
			const isOriginal = moveTypes.some(t => originalTypes.includes(t));
			const isStellar = moveTypes.includes('Stellar');
			const isTerapagos = pokemon.species.name === 'Terapagos-Stellar';
			const stellarOneTime14Forms = ['Glimmora-Mega-Stellar', 'Baxcalibur-Mega-Q-Stellar', 'Baxcalibur-Mega-Y-Stellar',];
			const isOneTime14 = stellarOneTime14Forms.includes(pokemon.species.name);
			if (isOriginal) {
				if (isTerapagos) { stab = 1.4; } 
				else if (!pokemon.stellarBoostedTypes.includes(type)) {
					stab = 1.7;
					pokemon.stellarBoostedTypes.push(type);
				} else { stab = isOneTime14 ? 1.4 : 1.2;  }
			} else if (isStellar) { stab = 1.5; } 
			else if (isTerapagos) { stab = 1.4; } 
			else if (!pokemon.stellarBoostedTypes.includes(type)) {
				stab = isOneTime14 ? 1.4 : 1.2; 
				pokemon.stellarBoostedTypes.push(type);
			}
		}
		stab = this.battle.runEvent('ModifySTAB', pokemon, target, move, stab);
		baseDamage = this.battle.modify(baseDamage, stab);
		//region Affinity/Aversion
		// Type affinity/aversion based on move flags stack additively: each affinity adds +0.1, each aversion adds -0.1
		// Uses original types, not affected by Terastallization
		let flagModifier = 0;
		for (const type of pokemon.getTypes(false, true)) {
			const typeData = this.dex.types.get(type);
			if (!typeData) continue;
			if (typeData.affinity && move.flags) {
				for (const flag in move.flags) {
					if (typeData.affinity[flag] === 5) {
						this.battle.debug(`${type} has affinity with ${flag} flag`);
						flagModifier += 0.1;
					}
				}
			}
			if (typeData.aversion && move.flags) {
				for (const flag in move.flags) {
					if (typeData.aversion[flag] === 6) {
						this.battle.debug(`${type} has aversion to ${flag} flag`);
						flagModifier -= 0.1;
					}
				}
			}
		}
		// Apply the total flag modifier
		if (flagModifier !== 0) {
			const totalMultiplier = 1 + flagModifier;
			this.battle.debug(`Total flag modifier: ${totalMultiplier}x`);
			baseDamage = this.battle.modify(baseDamage, totalMultiplier);
		}
		// types
		let typeMod = target.runEffectiveness(move);
		// Clamp to -6 to 6 range (supports decimal values for flag effectiveness)
		typeMod = Math.max(-6, Math.min(typeMod, 6));
		target.getMoveHitData(move).typeMod = typeMod;
		// Type effectiveness messages
		if (!suppressMessages && typeMod !== 0) {
			switch (typeMod) {
			// Resistance
			case -6:
			case -5.5:
			case -5:
				this.battle.add('-message', "It's ineffective...");
				break;
			case -4:
				this.battle.add('-message', "It's barely effective...");
				break;
			case -3:
				this.battle.add('-message', "It's hardly effective...");
				break;
			case -2:
				this.battle.add('-resisted', target); // "It's not very effective..."
				break;
			case -1.5:
				this.battle.add('-message', "It's mostly effective...");
				break;
			// Weakness
			case 0.5:
				this.battle.add('-message', "It's very effective!");
				break;
			case 1:
				this.battle.add('-supereffective', target); // "It's super effective!"
				break;
			case 1.5:
				this.battle.add('-message', "It's severely effective!");
				break;
			case 2:
				this.battle.add('-message', "It's extremely effective!");
				break;
			default:
				if (typeMod >= 2.5) { this.battle.add('-message', "It's supremely effective!"); }
				break;
			}
		}
		if (typeMod > 0) { // Apply type effectiveness: each full point is 2x, each 0.5 is 1.5x
			const fullSteps = Math.floor(typeMod);
			const halfStep = typeMod % 1 >= 0.5;
			for (let i = 0; i < fullSteps; i++) baseDamage *= 2;
			if (halfStep) baseDamage = tr(baseDamage * 1.5);
		}
		if (typeMod < 0) { // Apply type resistance: each full point is ÷2, each 0.5 is ÷1.5
			const absTypeMod = Math.abs(typeMod);
			const fullSteps = Math.floor(absTypeMod);
			const halfStep = absTypeMod % 1 >= 0.5;
			for (let i = 0; i < fullSteps; i++) baseDamage = tr(baseDamage / 2);
			if (halfStep) baseDamage = tr(baseDamage / 1.5);
		}
		if (isCrit && !suppressMessages) this.battle.add('-crit', target);
		if (pokemon.status === 'brn' && move.category === 'Physical' && !pokemon.hasAbility('guts')) { if (this.battle.gen < 6 || move.id !== 'facade') { baseDamage = this.battle.modify(baseDamage, 0.5); } }
		// Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
		baseDamage = this.battle.runEvent('ModifyDamage', pokemon, target, move, baseDamage);
		const pierced = target.getMoveHitData(move).pierced;
			if (pierced) {
				baseDamage = this.battle.modify(baseDamage, pierced[0] / pierced[1]);
				this.battle.add('-pierce', target, `${pierced[0]}/${pierced[1]}`, `${pierced[0]}/${pierced[1]} of the damage went through.`);
			}
		// Generation 6-7 moves the check for minimum 1 damage after the final modifier
		if (!baseDamage) return 1;
		// ...but 16-bit truncation happens even later, and can truncate to 0
		return tr(baseDamage, 16);
	}
	/**
	 * Confusion damage is unique - most typical modifiers that get run when calculating
	 * damage (e.g. Huge Power, Life Orb, critical hits) don't apply. It also uses a 16-bit
	 * context for its damage, unlike the regular damage formula (though this only comes up for base damage).
	 */
	getConfusionDamage(pokemon: Pokemon, basePower: number) {
		const tr = this.battle.trunc;
		const attack = pokemon.calculateStat('atk', pokemon.boosts['atk']);
		const defense = pokemon.calculateStat('def', pokemon.boosts['def']);
		const level = pokemon.level;
		const baseDamage = tr(tr(tr(tr(2 * level / 5 + 2) * basePower * attack) / defense) / 50) + 2;
		// Damage is 16-bit context in self-hit confusion damage
		let damage = tr(baseDamage, 16);
		damage = this.battle.randomizer(damage);
		return Math.max(1, damage);
	}
	// #region MEGA EVOLUTION
	canMegaEvo(pokemon: Pokemon) {
		const species = pokemon.baseSpecies;
		const altForme = species.otherFormes && this.dex.species.get(species.otherFormes[0]);
		const item = pokemon.getItem();
		// Mega Rayquaza
		if ((this.battle.gen <= 7 || this.battle.ruleTable.has('+pokemontag:past') || this.battle.ruleTable.has('+pokemontag:future')) && altForme?.isMega && altForme?.requiredMove && pokemon.baseMoves.includes(toID(altForme.requiredMove))) { return altForme.name; }
		return null;
	}
	// canUltraBurst is no longer surfaced to the player as a choice — it's used
	// internally by the necrozma light-charge condition (data/conditions.ts) to check eligibility 
	canUltraBurst(pokemon: Pokemon) {
		if (['Necrozma', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane'].includes(pokemon.baseSpecies.name)) { return "Necrozma-Ultra"; }
		return null;
	}
	runMegaEvo(pokemon: Pokemon) {
		const speciesid = pokemon.canMegaEvo;
		if (!speciesid) return false;
		pokemon.formeChange(speciesid, pokemon.getItem(), true);
		// Limit one mega evolution
		for (const ally of pokemon.side.pokemon) { ally.canMegaEvo = false; }
		this.battle.runEvent('AfterMega', pokemon);
		return true;
	}
	// Triggered automatically by Pokemon#tryLightCharge, when necrozma is hit by 3 light moves over a battle
	runUltraBurst(pokemon: Pokemon) {
		const speciesid = this.canUltraBurst(pokemon);
		if (!speciesid) return false;
		pokemon.formeChange(speciesid, pokemon.getItem(), true);
		this.battle.runEvent('AfterMega', pokemon);
		return true;
	}
		/**
	 * Shared eligibility check for all five lettered Megas. A Pokemon is
	 * eligible for letter L if: its held item's `megaStone` dict has an entry
	 * for its base species, that entry's forme name ends in `-Mega` (letter
	 * defaults to X) or `-Mega-<L>`, no Pokemon on the side already has an
	 * active lettered Mega (fainted ones don't count), and the side's Mega
	 * Charge is full. Charge itself never gets touched here — filling and
	 * draining is entirely handled by the per-turn residual logic in battle.ts,
	 * keyed off megaEvoOriginalSpecies/megaEvoLetter.
	 */
	megaLetterTarget(pokemon: Pokemon, letter: 'X' | 'Y' | 'Z' | 'A' | 'Q'): string | null {
		const species = pokemon.baseSpecies;
		const item = pokemon.getItem();
		const targetName = item.megaStone?.[species.baseSpecies];
		if (!targetName) return null;
		const target = this.dex.species.get(targetName);
		if (!target.exists) return null;
		const match = target.name.match(/-Mega(?:-([A-Z]))?$/);
		if (!match) return null;
		const targetLetter = match[1] || 'X';
		if (targetLetter !== letter) return null;
		if (pokemon.side.pokemon.some(p => !p.fainted && (p as any).megaEvoOriginalSpecies)) return null;
		const sideAny = pokemon.side as any;
		const charge = Number(sideAny.megaCharge ?? 0);
		const max = Number(sideAny.megaChargeMax ?? 100);
		if (charge < max) return null;
		return target.name;
	}
	canMegaEvoX(pokemon: Pokemon) { return this.megaLetterTarget(pokemon, 'X'); }
	canMegaEvoY(pokemon: Pokemon) { return this.megaLetterTarget(pokemon, 'Y'); }
	canMegaEvoZ(pokemon: Pokemon) { return this.megaLetterTarget(pokemon, 'Z'); }
	canMegaEvoA(pokemon: Pokemon) { return this.megaLetterTarget(pokemon, 'A'); }
	canMegaEvoQ(pokemon: Pokemon) { return this.megaLetterTarget(pokemon, 'Q'); }
	runMegaLetter(pokemon: Pokemon, letter: 'X' | 'Y' | 'Z' | 'A' | 'Q') {
		const speciesid = this.megaLetterTarget(pokemon, letter);
		if (!speciesid) return false;
		const p = pokemon as any;
		// Capture the pre-Mega species BEFORE formeChange overwrites baseSpecies.
		p.megaEvoOriginalSpecies = pokemon.baseSpecies.name;
		p.megaEvoLetter = letter;
		pokemon.formeChange(speciesid, pokemon.getItem(), true);
		this.battle.runEvent('AfterMega', pokemon);
		return true;
	}
	runMegaEvoX(pokemon: Pokemon) { return this.runMegaLetter(pokemon, 'X'); }
	runMegaEvoY(pokemon: Pokemon) { return this.runMegaLetter(pokemon, 'Y'); }
	runMegaEvoZ(pokemon: Pokemon) { return this.runMegaLetter(pokemon, 'Z'); }
	runMegaEvoA(pokemon: Pokemon) { return this.runMegaLetter(pokemon, 'A'); }
	runMegaEvoQ(pokemon: Pokemon) { return this.runMegaLetter(pokemon, 'Q'); }
	// Called by the turn-tick drain logic in battle.ts when a lettered Mega's
	// charge hits 0. Reverts to the pre-Mega species and frees up the side's
	// "one Mega active at a time" slot.
	revertMegaLetter(pokemon: Pokemon) {
		const p = pokemon as any;
		const originalSpecies = p.megaEvoOriginalSpecies;
		if (!originalSpecies) return;
		const revertEffect = { effectType: 'Status', id: 'megachargedepleted', name: 'Mega Charge' } as Effect;
		pokemon.formeChange(originalSpecies, revertEffect, true, '0', 'Mega Charge depleted');
		p.megaEvoOriginalSpecies = null;
		p.megaEvoLetter = null;
	}
	canTerastallize(pokemon: Pokemon) {
		if (pokemon.canMegaEvo || this.dex.gen !== 9) { return null; }
		return pokemon.teraType;
	}
	terastallize(pokemon: Pokemon) {
		if (pokemon.illusion && ['Ogerpon', 'Terapagos'].includes(pokemon.illusion.species.baseSpecies)) {
			const illusionState =
				(pokemon as any).ability1 === 'illusion' ? (pokemon as any).abilityState1 :
				(pokemon as any).ability2 === 'illusion' ? (pokemon as any).abilityState2 :
				null;
			if (illusionState) { this.battle.singleEvent('End', this.dex.abilities.get('Illusion'), illusionState, pokemon); }
		}
		// Tera Charge: snapshot state so we can un-tera later
		const p: any = pokemon;
		if (!p.preTeraState) {
			p.preTeraState = {
				speciesId: pokemon.species.id,
				baseSpeciesId: pokemon.baseSpecies.id,
				details: pokemon.details,
				types: pokemon.types?.slice ? pokemon.types.slice() : null,
				addedType: pokemon.addedType,
				knownType: pokemon.knownType,
				apparentType: pokemon.apparentType,
			};
		}
		// remember original form so we can revert when charge hits 0
		(pokemon as any).teraOriginalSpecies = pokemon.species.id;
		const type = pokemon.teraType;
		this.battle.add('-terastallize', pokemon, type);
		pokemon.terastallized = type;
		// Reset Tera Shell type tracking when Terastallizing
		if (pokemon.teraShellUsedTypes) {pokemon.teraShellUsedTypes = []; }
		pokemon.addedType = '';
		pokemon.knownType = true;
		pokemon.apparentType = type;
		if (pokemon.species.baseSpecies === 'Ogerpon') {
			const tera = pokemon.species.id === 'ogerpon' ? 'tealtera' : 'tera';
			pokemon.formeChange(pokemon.species.id + tera, null, true);
		}
		if (pokemon.species.name === 'Terapagos-Terastal') { pokemon.formeChange('Terapagos-Stellar', null, true); }
		if (pokemon.species.baseSpecies === 'Morpeko' && !pokemon.transformed && pokemon.baseSpecies.id !== pokemon.species.id )  {
			pokemon.formeRegression = true;
			pokemon.baseSpecies = pokemon.species;
			pokemon.details = pokemon.getUpdatedDetails();
		}
		this.battle.runEvent('AfterTerastallization', pokemon);
	}
	unterastallize(pokemon: Pokemon) {
		if (!pokemon.terastallized) return;
		const prev = pokemon.terastallized;
		// Tell the client to visually revert
		this.battle.add('-unterastallize', pokemon, prev);
		// Core state revert
		pokemon.terastallized = '';
		pokemon.addedType = '';
		pokemon.knownType = true;
		pokemon.apparentType = pokemon.getTypes(false, true).join('/');
		// If you ever Terastallized into a forced form (Ogerpon/Terapagos), revert form if you stored it
		const origSpecies = (pokemon as any).teraOriginalSpecies as string | undefined;
		if (origSpecies && origSpecies !== pokemon.species.id) { pokemon.formeChange(origSpecies, null, true); }
		(pokemon as any).teraOriginalSpecies = undefined;
	}
	/**
	 * Guard Action: a standalone battle action, separate from the moveset, that runs
	 * whichever move is currently equipped in the Pokemon's Guard Action slot
	 * (see Pokemon#getGuardActionMove). Cooldown length comes from the move's own
	 * `guardActionCD`, not a hardcoded constant.
	 * @param pokemon - The Pokemon attempting to use its Guard Action
	 * @returns the Move that would be used, or null if unavailable right now
	 */
	canGuardAction(pokemon: Pokemon): Move | null {
		const guardMove = pokemon.getGuardActionMove();
		if (!guardMove) return null;
		if (pokemon.guardActionCooldown && pokemon.guardActionCooldown > 0) return null;
		if (this.battle.runEvent('CanGuardAction', pokemon) === false) return null;
		return guardMove;
	}
	/**
	 * Execute the Guard Action for a Pokemon, using whichever move is currently
	 * resolved for its Guard Action slot.
	 * @param pokemon - The Pokemon using its Guard Action
	 */
	useGuardAction(pokemon: Pokemon) {
		const guardMove = pokemon.getGuardActionMove();
		if (!guardMove) {
			this.battle.debug('Guard Action move not found');
			return;
		}
		this.useMove(guardMove, pokemon, { sourceEffect: null });
		// Cooldown comes from the move itself; default to 2 if unset for safety.
		pokemon.guardActionCooldown = guardMove.guardActionCD ?? 2;
		this.battle.add('-message', `${pokemon.name} used ${guardMove.name}!`);
	}
}