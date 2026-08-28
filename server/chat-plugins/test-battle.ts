import { TeamValidatorAsync } from '../team-validator-async';
import { TestBattle } from '../room-battle-test';
export const commands: Chat.ChatCommands = {
	async starttestbattle(target, room, user, connection) {
		const [formatName, bestOfRaw, p1teamRaw, p2teamRaw] = target.split('\t');
		if (!formatName) return this.errorReply(`Usage: /starttestbattle format|bestof|p1team|p2team`);
		const format = Dex.formats.get(formatName);
		if (!format.exists) return this.errorReply(`Format "${formatName}" not found.`);
		const bestOfNum = parseInt(bestOfRaw, 10);
		const bestOf: 1 | 3 | 5 = (bestOfNum === 3 || bestOfNum === 5) ? bestOfNum : 1;
		const teams = { p1: '', p2: '' };
		if (!format.team) {
			const validator = TeamValidatorAsync.get(format.id);
			for (const slot of ['p1', 'p2'] as const) {
				const raw = slot === 'p1' ? p1teamRaw : p2teamRaw;
				if (!raw) return this.errorReply(`Missing a team for ${slot}.`);
				const result = await validator.validateTeam(raw, { user: user.id });
				if (result.charAt(0) !== '1') return this.errorReply(`Your ${slot} team was rejected:\n${result.slice(1)}`);
				teams[slot] = result.slice(1);
			}
		}
		const battleRoom = Rooms.createTestBattle({
			format: format.id,
			bestOf,
			players: [ 
				{ user, team: teams.p1 }, 
				{ user, team: teams.p2 }, 
			],
		} as any);
		if (!battleRoom) return this.errorReply(`Could not create the test battle right now.`);
	},
	runback(target, room, user) {
		if (!(room?.game instanceof TestBattle)) return this.errorReply(`This isn't a test battle.`);
		const game = room.game;
		const n = parseInt(target, 10);
		if (n !== 3 && n !== 5) return this.errorReply(`Usage: /runback 3 or /runback 5`);
		if (!game.setDecided()) return this.errorReply(`The current set isn't finished yet.`);
		if (!game.runback(n)) return this.errorReply(`Can't runback to a best-of-${n} from a best-of-${game.bestOf}.`);
		room.add(`|html|<div class="infobox">The set was extended to a best-of-${n}!</div>`).update();
	},
};