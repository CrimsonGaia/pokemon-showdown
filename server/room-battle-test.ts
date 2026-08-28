/**
 * Test Battle
 * A RoomBattle where one real user can occupy more than one seat (both p1 and p2), for locally testing both sides of a battle.
 * @license MIT
 */
import { RoomBattle, type RoomBattlePlayer, type RoomBattlePlayerOptions, type RoomBattleOptions } from './room-battle';
export class TestBattle extends RoomBattle {
	readonly dualSeat = true;
	/** 1, 3, or 5. Mutable so /runback can retroactively extend a finished set. */
	bestOf: 1 | 3 | 5 = 1;
	wins: { p1: number, p2: number } = { p1: 0, p2: 0 };
	constructor(room: GameRoom, options: RoomBattleOptions) {
		super(room, options);
		const requested = (options as any).bestOf;
		if (requested === 3 || requested === 5) this.bestOf = requested;
	}
	override async end(winnerName: unknown) {
		const winnerid = toID(winnerName);
		if (winnerid === this.p1.id) this.wins.p1++;
		else if (winnerid === this.p2.id) this.wins.p2++;
		await super.end(winnerName);
		if (this.bestOf > 1) {
			const decided = this.setDecided();
			this.room.add(
				`|html|<div class="infobox">Game ${this.gameNumber} result: ${this.wins.p1}-${this.wins.p2}` +
				`${decided ? ` - set won!` : ` - use /runback to continue the set`}</div>`
			).update();
		}
	}
	/** True once one side has clinched the set outright under the current bestOf target. */
	setDecided() {
		const need = Math.floor(this.bestOf / 2) + 1;
		return this.wins.p1 >= need || this.wins.p2 >= need;
	}
	/** Runback: retroactively raise the target (1->3->5) and continue in this same room. */
	runback(newBestOf: 3 | 5) {
		if (newBestOf <= this.bestOf) return false;
		this.bestOf = newBestOf;
		this.startNextGame();
		return true;
	}
	/**
	 * RoomGame.addPlayer keys playerTable by the bare userid and refuses a second registration for the same id. 
	 * Seat-scope the key instead (`p1:userid`, `p2:userid`) so the same real user can hold both seats.
	 */
	override addPlayer(user: User | string | null, playerOpts?: RoomBattlePlayerOptions | null) {
		if (this.playerCap > 0 && this.playerCount >= this.playerCap) return null;
		const realUser = typeof user === 'string' ? null : user;
		const player = this.makePlayer(realUser as User);
		if (!player) return null;
		this.players.push(player);
		if (realUser) {
			this.playerTable[`${player.slot}:${realUser.id}`] = player;
			this.playerCount++;
		}
		const slot = player.slot;
		this[slot] = player;
		if (playerOpts) {
			const options = {
				name: player.name,
				avatar: realUser ? `${realUser.avatar}` : '',
				team: playerOpts.team || undefined,
				rating: Math.round(playerOpts.rating || 0),
			};
			void this.stream.write(`>player ${slot} ${JSON.stringify(options)}`);
			player.hasTeam = true;
		}
		if (realUser) {
			this.room.auth.set(player.id, Users.PLAYER_SYMBOL);
			if (realUser.inRooms.has(this.roomid)) this.onConnect(realUser);
		}
		return player;
	}
	/** Every seat this real user currently holds - usually [p1, p2]. */
	private seatsFor(user: User) { return this.players.filter(p => p.id === user.id); }
	/** Pulls a leading `p1,`/`p2,` off a command and resolves it against this user's seats. */
	private parseSeat(user: User, data: string): { player: RoomBattlePlayer | null, rest: string } {
		const match = /:(p[1-4])$/.exec(data);
		if (!match) return { player: null, rest: data };
		const player = this.playerTable[`${match[1]}:${user.id}`];
		return { player: player || null, rest: data.slice(0, -match[0].length) };
	}
	override choose(user: User, data: string) {
		if (this.frozen) {
			user.popup(`Your battle is currently paused, so you cannot move right now.`);
			return;
		}
		const { player, rest } = this.parseSeat(user, data);
		if (!player) {
			user.popup(`Test battle choices need a seat, e.g. \`/choose p1, move 1\`.`);
			return;
		}
		const [choice, rqid] = rest.split('|', 2);
		const request = player.request;
		if (request.isWait !== false && request.isWait !== true) {
			player.sendRoom(`|error|[Invalid choice] There's nothing to choose`);
			return;
		}
		const allPlayersWait = this.players.every(p => !!p.request.isWait);
		if (allPlayersWait || (rqid && rqid !== `${request.rqid}`)) {
			player.sendRoom(`|error|[Invalid choice] Sorry, too late to make a different move; the next turn has already started`);
			return;
		}
		request.isWait = true;
		request.choice = choice;
		void this.stream.write(`>${player.slot} ${choice}`);
	}
	override undo(user: User, data: string) {
		const { player, rest } = this.parseSeat(user, data);
		if (!player) {
			user.popup(`Test battle choices need a seat, e.g. \`/undo p1\`.`);
			return;
		}
		const [, rqid] = rest.split('|', 2);
		const request = player.request;
		if (request.isWait !== true) {
			player.sendRoom(`|error|[Invalid choice] There's nothing to cancel`);
			return;
		}
		if (rqid && rqid !== `${request.rqid}`) {
			player.sendRoom(`|error|[Invalid choice] Sorry, too late to cancel; the next turn has already started`);
			return;
		}
		request.isWait = false;
		void this.stream.write(`>${player.slot} undo`);
	}
	/**
	 * Only the sideupdate/request path needs to change: it now tags each request with which seat it belongs to, 
	 * since both seats' requests land on the same connection. 
	 * Everything else (turn log, errors, battle end) is genuinely shared and untouched via super.receive.
	 */
	override receive(lines: string[]) {
		if (lines[0] !== 'sideupdate') { super.receive(lines); return; }
		for (const player of this.players) player.wantsTie = false;
		const slot = lines[1] as SideID;
		const player = this[slot];
		if (lines[2].startsWith(`|request|`)) {
			this.rqid++;
			const request = JSON.parse(lines[2].slice(9));
			request.rqid = this.rqid;
			request.seat = slot; // lets a shared connection tell p1's request from p2's
			const requestJSON = JSON.stringify(request);
			this[slot].request = { rqid: this.rqid, request: requestJSON, isWait: request.wait ? 'cantUndo' : false, choice: '', };
			this.requestCount++;
			player?.sendRoom(`|request|${requestJSON}`);
			if (!request.update) this.timer.nextRequest(player);
			return;
		}
		if (lines[2].startsWith(`|error|[Invalid choice]`)) {
			const undoFailed = lines[2].includes(`Can't undo`);
			const request = this[slot].request;
			request.isWait = undoFailed ? 'cantUndo' : false;
			request.choice = '';
		}
		player?.sendRoom(lines[2]);
	}
	override onConnect(user: User, connection: Connection | null = null) {
		const seats = this.seatsFor(user);
		if (!seats.length) return;
		seats[0].updateChannel(connection || user, 0);
		for (const player of seats) {
			const request = player.request;
			if (request.request) {
				let data = `|request|${request.request}`;
				if (request.choice) data += `\n|sentchoice|${request.choice}`;
				(connection || user).sendTo(this.roomid, data);
			}
		}
		if (!this.started) this.sendInviteForm(connection || user);
		if (seats.some(p => !p.active)) this.onJoin(user);
	}
	override onJoin(user: User) {
		for (const player of this.seatsFor(user)) {
			if (!player.active) {
				player.active = true;
				this.timer.checkActivity();
				this.room.add(`|player|${player.slot}|${user.name}|${user.avatar}|`);
				Chat.runHandlers('onBattleJoin', player.slot, user, this.room);
			}
		}
	}
	override forfeit(user: User | string, message = '') {
		const userid = typeof user === 'string' ? toID(user) : user.id;
		const seats = this.players.filter(p => p.id === userid);
		if (!seats.length) return false;
		let forfeited = false;
		for (const player of seats) { if (this.forfeitPlayer(player, message)) forfeited = true; }
		return forfeited;
	}
	override leaveGame(user: User) {
		if (!user) return false;
		if (this.room.rated || this.room.tour) {
			user.popup(`Players can't be swapped out in a ${this.room.tour ? "tournament" : "rated"} battle.`);
			return false;
		}
		const seats = this.players.filter(p => p.id === user.id);
		if (!seats.length) {
			user.popup(`Failed to leave battle - you're not a player.`);
			return false;
		}
		Chat.runHandlers('onBattleLeave', user, this.room);
		for (const player of seats) {
			delete this.playerTable[`${player.slot}:${user.id}`];
			this.playerCount--;
			(player.id as any) = '';
			player.name = `Player ${player.num}`;
		}
		user.games.delete(this.roomid);
		user.updateSearch();
		this.room.update();
		return true;
	}
	/**
	 * Deliberately NOT overridden. RoomGame.setPlayerUser (which the base onRename calls into via updatePlayer) 
	 * writes playerTable[player.id] with a bare userid - that would silently reintroduce the exact key
	 * collision this whole class exists to avoid. Renaming mid-test-battle is a low-value edge case, 
	 * so it's left as a no-op (base onRename's lookups against bare ids just never match here) rather than risk
	 * corrupting the seat-scoped table with a half-correct reimplementation.
	 */
}