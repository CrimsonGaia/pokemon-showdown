import { TeamValidatorAsync } from '../team-validator-async';
export const commands: Chat.ChatCommands = {
	async starttestbattle(target, room, user, connection) {
		const [formatName, p1teamRaw, p2teamRaw] = target.split('\t');
		if (!formatName) return this.errorReply(`Usage: /starttestbattle format|p1team|p2team`);
		const format = Dex.formats.get(formatName);
		if (!format.exists) return this.errorReply(`Format "${formatName}" not found.`);
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
			players: [ 
				{ user, team: teams.p1 }, 
				{ user, team: teams.p2 }, 
			],
		});
		if (!battleRoom) return this.errorReply(`Could not create the test battle right now.`);
	},
};