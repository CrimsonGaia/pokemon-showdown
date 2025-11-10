// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts
/*
If you want to add custom formats, create a file in this folder named: "custom-formats.ts"

Paste the following code into the file and add your desired formats and their sections between the brackets:
--------------------------------------------------------------------------------
// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts

export const Formats: FormatList = [
];
--------------------------------------------------------------------------------

If you specify a section that already exists, your format will be added to the bottom of that section.
New sections will be added to the bottom of the specified column.
The column value will be ignored for repeat sections.
*/

export const Formats: import('../sim/dex-formats').FormatList = [

	//#region S/V SINGLES

	{
		section: "S/V Singles",
	},
	{
		name: "[Gen 9] Random Battle",
		desc: `Randomized teams of Pok&eacute;mon with sets that are generated to be competitively viable.`,
		mod: 'gen9',
		team: 'random',
		bestOfDefault: true,
		ruleset: ['PotD', 'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod'],
	},
	{
		name: "[Gen 9] Unrated Random Battle",
		mod: 'gen9',
		team: 'random',
		challengeShow: false,
		rated: false,
		ruleset: ['Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod'],
	},
	{
		name: "[Gen 9] Free-For-All Random Battle",
		mod: 'gen9',
		team: 'randomFFA',
		gameType: 'freeforall',
		tournamentShow: false,
		rated: false,
		ruleset: ['Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod'],
	},
	{
		name: "[Gen 9] Random Battle (Blitz)",
		mod: 'gen9',
		team: 'random',
		bestOfDefault: true,
		ruleset: ['[Gen 9] Random Battle', 'Blitz'],
	},
	{
		name: "[Gen 9] Multi Random Battle",
		mod: 'gen9',
		team: 'random',
		gameType: 'multi',
		searchShow: false,
		tournamentShow: false,
		rated: false,
		ruleset: [
			'Max Team Size = 3',
			'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod',
		],
	},
	{
		name: "[Gen 9] OU",
		mod: 'gen9',
		ruleset: ['Standard', 'Evasion Abilities Clause', 'Sleep Moves Clause', '!Sleep Clause Mod'],
		banlist: ['Uber', 'AG', 'Arena Trap', 'Moody', 'Shadow Tag', 'King\'s Rock', 'Razor Fang', 'Baton Pass', 'Last Respects', 'Shed Tail'],
	},
	{
		name: "[Gen 9] Ubers",
		mod: 'gen9',
		ruleset: ['Standard'],
		banlist: ['AG', 'Moody', 'King\'s Rock', 'Razor Fang', 'Baton Pass', 'Last Respects'],
	},
	{
		name: "[Gen 9] UU",
		mod: 'gen9',
		ruleset: ['[Gen 9] OU'],
		banlist: ['OU', 'UUBL'],
	},
	{
		name: "[Gen 9] RU",
		mod: 'gen9',
		ruleset: ['[Gen 9] UU'],
		banlist: ['UU', 'RUBL', 'Light Clay'],
	},
	{
		name: "[Gen 9] NU",
		mod: 'gen9',
		ruleset: ['[Gen 9] RU'],
		banlist: ['RU', 'NUBL', 'Drought', 'Quick Claw'],
	},
	{
		name: "[Gen 9] PU",
		mod: 'gen9',
		ruleset: ['[Gen 9] NU'],
		banlist: ['NU', 'PUBL', 'Damp Rock'],
	},
	{
		name: "[Gen 9] LC",
		mod: 'gen9',
		ruleset: ['Little Cup', 'Standard'],
		banlist: [
			'Aipom', 'Basculin-White-Striped', 'Cutiefly', 'Diglett-Base', 'Dunsparce', 'Duraludon', 'Flittle', 'Gastly', 'Girafarig', 'Gligar',
			'Magby', 'Meditite', 'Misdreavus', 'Murkrow', 'Porygon', 'Qwilfish-Hisui', 'Rufflet', 'Scraggy', 'Scyther', 'Sneasel', 'Sneasel-Hisui',
			'Snivy', 'Stantler', 'Torchic', 'Voltorb-Hisui', 'Vulpix', 'Vulpix-Alola', 'Yanma', 'Moody', 'Heat Rock', 'Baton Pass', 'Sticky Web',
		],
	},
	{
		name: "[Gen 9] Monotype",
		mod: 'gen9',
		ruleset: ['Standard', 'Evasion Abilities Clause', 'Same Type Clause', 'Terastal Clause'],
		banlist: [
			'Annihilape', 'Arceus', 'Baxcalibur', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Blaziken', 'Deoxys-Normal', 'Deoxys-Attack',
			'Dialga', 'Dialga-Origin', 'Espathra', 'Eternatus', 'Giratina', 'Giratina-Origin', 'Gouging Fire', 'Groudon', 'Ho-Oh', 'Iron Bundle', 'Kingambit',
			'Koraidon', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Lunala', 'Magearna', 'Mewtwo', 'Miraidon', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane',
			'Palafin', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Solgaleo', 'Ursaluna-Bloodmoon', 'Urshifu-Single-Strike', 'Zacian',
			'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom', 'Moody', 'Shadow Tag', 'Booster Energy', 'Damp Rock', 'Focus Band', 'King\'s Rock',
			'Quick Claw', 'Razor Fang', 'Smooth Rock', 'Baton Pass', 'Last Respects', 'Shed Tail',
		],
	},
	{
		name: "[Gen 9] CAP",
		desc: "The Create-A-Pok&eacute;mon project is a community dedicated to exploring and understanding the competitive Pok&eacute;mon metagame by designing, creating, and playtesting new Pok&eacute;mon concepts.",
		mod: 'gen9',
		ruleset: ['[Gen 9] OU', '+CAP'],
		banlist: ['Crucibellite', 'Rage Fist'],
	},
	{
		name: "[Gen 9] BSS Reg I",
		mod: 'gen9',
		searchShow: false,
		bestOfDefault: true,
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 9', 'VGC Timer', 'Limit Two Restricted'],
		restricted: ['Restricted Legendary'],
	},
	{
		name: "[Gen 9] BSS Reg J",
		mod: 'gen9',
		bestOfDefault: true,
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 9', 'VGC Timer', 'Limit Two Restricted'],
		restricted: ['Restricted Legendary', 'Mythical'],
	},
	{
		name: "[Gen 9] Custom Game",
		mod: 'gen9',
		searchShow: false,
		debug: true,
		battle: { trunc: Math.trunc },
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},

	//#endregion

	//#region S/V DOUBLES

	{
		section: "S/V Doubles",
	},
	{
		name: "[Gen 9] Random Doubles Battle",
		mod: 'gen9',
		gameType: 'doubles',
		team: 'random',
		bestOfDefault: true,
		ruleset: ['PotD', 'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Illusion Level Mod', 'Sleep Clause Mod'],
	},
	{
		name: "[Gen 9] Doubles OU",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard Doubles', 'Evasion Abilities Clause'],
		banlist: ['DUber', 'Shadow Tag', 'Commander'],
	},
	{
		name: "[Gen 9] Doubles Ubers",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard Doubles', '!Gravity Sleep Clause'],
	},
	{
		name: "[Gen 9] Doubles UU",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['[Gen 9] Doubles OU'],
		banlist: ['DOU', 'DBL'],
	},
	{
		name: "[Gen 9] Doubles LC",
		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Standard Doubles', 'Little Cup', 'Sleep Clause Mod'],
		banlist: [
			'Basculin-White-Striped', 'Dunsparce', 'Duraludon', 'Girafarig', 'Gligar', 'Misdreavus', 'Murkrow', 'Qwilfish-Hisui', 'Scyther', 'Sneasel', 'Sneasel-Hisui',
			'Stantler', 'Vulpix', 'Vulpix-Alola', 'Yanma',
		],
	},
	{
		name: "[Gen 9] VGC 2023 Reg C",
		mod: 'gen9predlc',
		gameType: 'doubles',
		searchShow: false,
		bestOfDefault: true,
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 9', 'VGC Timer', 'Open Team Sheets', 'Paldea Pokedex'],
	},
	{
		name: "[Gen 9] VGC 2023 Reg D",
		mod: 'gen9predlc',
		gameType: 'doubles',
		searchShow: false,
		bestOfDefault: true,
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 9', 'VGC Timer', 'Open Team Sheets'],
		banlist: ['Walking Wake', 'Iron Leaves'],
	},
	{
		name: "[Gen 9] VGC 2024 Reg G",
		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		bestOfDefault: true,
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 9', 'VGC Timer', 'Open Team Sheets', 'Limit One Restricted'],
		restricted: ['Restricted Legendary'],
	},
	{
		name: "[Gen 9] VGC 2025 Reg H",
		mod: 'gen9',
		gameType: 'doubles',
		bestOfDefault: true,
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 9', 'VGC Timer', 'Open Team Sheets'],
		banlist: ['Sub-Legendary', 'Paradox', 'Gouging Fire', 'Iron Boulder', 'Iron Crown', 'Raging Bolt'],
	},
	{
		name: "[Gen 9] VGC 2025 Reg H (Bo3)",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 9', 'VGC Timer', 'Force Open Team Sheets', 'Best of = 3'],
		banlist: ['Sub-Legendary', 'Paradox', 'Gouging Fire', 'Iron Boulder', 'Iron Crown', 'Raging Bolt'],
	},
	{
		name: "[Gen 9] VGC 2025 Reg I",
		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		bestOfDefault: true,
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 9', 'VGC Timer', 'Open Team Sheets', 'Limit Two Restricted'],
		restricted: ['Restricted Legendary'],
	},
	{
		name: "[Gen 9] VGC 2025 Reg J",
		mod: 'gen9',
		gameType: 'doubles',
		bestOfDefault: true,
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 9', 'VGC Timer', 'Limit Two Restricted'],
		restricted: ['Restricted Legendary', 'Mythical'],
	},
	{
		name: "[Gen 9] VGC 2025 Reg J (Bo3)",
		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 9', 'VGC Timer', 'Force Open Team Sheets', 'Best of = 3', 'Limit Two Restricted'],
		restricted: ['Restricted Legendary', 'Mythical'],
	},
	{
		name: "[Gen 9] Doubles Custom Game",
		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		battle: { trunc: Math.trunc },
		debug: true,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},

	// S/V Doubles
	///////////////////////////////////////////////////////////////////

	//#region UNOFFICIAL METAGAMES

	{
		section: "Unofficial Metagames",
	},
	{
		name: "[Gen 9] 1v1",
		desc: `Bring three Pok&eacute;mon to Team Preview and choose one to battle.`,
		mod: 'gen9',
		ruleset: [
			'Picked Team Size = 1', 'Max Team Size = 3',
			'Standard', 'Terastal Clause', 'Sleep Moves Clause', 'Accuracy Moves Clause', '!Sleep Clause Mod',
		],
		banlist: [
			'Arceus', 'Archaludon', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Cinderace', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Dialga',
			'Dialga-Origin', 'Dragonite', 'Eternatus', 'Flutter Mane', 'Gholdengo', 'Giratina', 'Giratina-Origin', 'Gouging Fire', 'Groudon', 'Ho-Oh', 'Jirachi',
			'Koraidon', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Lunala', 'Magearna', 'Meloetta', 'Mew', 'Mewtwo', 'Mimikyu', 'Miraidon', 'Necrozma',
			'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Ogerpon-Cornerstone', 'Ogerpon-Hearthflame', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Regidrago', 'Reshiram',
			'Scream Tail', 'Shaymin-Sky', 'Snorlax', 'Solgaleo', 'Terapagos', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom', 'Moody',
			'Focus Band', 'Focus Sash', 'King\'s Rock', 'Razor Fang', 'Quick Claw', 'Perish Song',
		],
	},
	{
		name: "[Gen 9] 2v2 Doubles",
		desc: `Double battle where you bring four Pok&eacute;mon to Team Preview and choose only two.`,
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: [
			'Picked Team Size = 2', 'Max Team Size = 4',
			'Standard Doubles', 'Accuracy Moves Clause', 'Terastal Clause', 'Sleep Clause Mod', 'Evasion Items Clause',
		],
		banlist: [
			'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Deoxys-Attack', 'Dialga', 'Dialga-Origin', 'Eternatus', 'Giratina', 'Giratina-Origin', 'Groudon',
			'Ho-Oh', 'Koraidon', 'Kyogre', 'Kyurem-White', 'Lugia', 'Lunala', 'Magearna', 'Mewtwo', 'Miraidon', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia',
			'Palkia-Origin', 'Rayquaza', 'Reshiram', 'Solgaleo', 'Urshifu', 'Urshifu-Rapid-Strike', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned',
			'Zekrom', 'Commander', 'Moody', 'Focus Sash', 'King\'s Rock', 'Razor Fang', 'Ally Switch', 'Final Gambit', 'Perish Song', 'Swagger',
		],
	},
	{
		name: "[Gen 9] Anything Goes",
		mod: 'gen9',
		ruleset: ['Standard AG'],
	},
	{
		name: "[Gen 9] Ubers UU",
		mod: 'gen9',
		searchShow: false,
		ruleset: ['[Gen 9] Ubers'],
		banlist: [
			// Ubers OU
			'Arceus-Normal', 'Arceus-Fairy', 'Arceus-Ghost', 'Arceus-Ground', 'Arceus-Water', 'Calyrex-Ice', 'Chien-Pao', 'Deoxys-Attack', 'Deoxys-Speed', 'Ditto',
			'Dondozo', 'Eternatus', 'Flutter Mane', 'Giratina', 'Giratina-Origin', 'Glimmora', 'Gliscor', 'Grimmsnarl', 'Groudon', 'Hatterene', 'Ho-Oh', 'Kingambit',
			'Koraidon', 'Kyogre', 'Kyurem-Black', 'Landorus-Therian', 'Lunala', 'Necrozma-Dusk-Mane', 'Rayquaza', 'Regieleki', 'Ribombee', 'Skeledirge', 'Terapagos',
			'Ting-Lu', 'Zacian-Crowned',
			// Ubers UUBL + Lunala, Arceus-Ghost, Arceus-Water
			'Arceus-Dragon', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Steel', 'Necrozma-Dawn-Wings', 'Shaymin-Sky', 'Spectrier', 'Zacian', 'Zekrom',
		],
	},
	{
		name: "[Gen 9] ZU",
		mod: 'gen9',
		ruleset: ['[Gen 9] PU'],
		banlist: ['PU', 'ZUBL', 'Unburden', 'Heat Rock'],
	},
	{
		name: "[Gen 9] Free-For-All",
		mod: 'gen9',
		gameType: 'freeforall',
		rated: false,
		tournamentShow: false,
		ruleset: ['Standard', 'Sleep Moves Clause', '!Sleep Clause Mod', '!Evasion Items Clause'],
		banlist: [
			'Annihilape', 'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Darkrai', 'Deoxys-Normal', 'Deoxys-Attack', 'Dialga', 'Dialga-Origin',
			'Dondozo', 'Eternatus', 'Flutter Mane', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Hoopa-Unbound', 'Iron Bundle', 'Koraidon', 'Kyogre', 'Kyurem-White',
			'Landorus-Incarnate', 'Lugia', 'Lunala', 'Magearna', 'Mewtwo', 'Miraidon', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Ogerpon-Hearthflame', 'Palkia',
			'Palkia-Origin', 'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Solgaleo', 'Spectrier', 'Terapagos', 'Ursaluna', 'Ursaluna-Bloodmoon', 'Urshifu', 'Urshifu-Rapid-Strike',
			'Zacian', 'Zacian-Crowned', 'Zekrom', 'Moody', 'Shadow Tag', 'Toxic Chain', 'Toxic Debris', 'Aromatic Mist', 'Baton Pass', 'Coaching',
			'Court Change', 'Decorate', 'Dragon Cheer', 'Final Gambit', 'Flatter', 'Fling', 'Floral Healing', 'Follow Me', 'Heal Pulse', 'Heart Swap', 'Last Respects',
			'Malignant Chain', 'Poison Fang', 'Rage Powder', 'Skill Swap', 'Spicy Extract', 'Swagger', 'Toxic', 'Toxic Spikes',
		],
	},
	{
		name: "[Gen 9] LC UU",
		mod: 'gen9',
		searchShow: false,
		ruleset: ['[Gen 9] LC'],
		banlist: [
			'Chinchou', 'Diglett-Alola', 'Elekid', 'Foongus', 'Glimmet', 'Gothita', 'Grookey', 'Growlithe-Hisui', 'Larvesta', 'Mareanie', 'Mienfoo',
			'Mudbray', 'Munchlax', 'Pawniard', 'Sandshrew-Alola', 'Shellder', 'Shellos', 'Shroodle', 'Snover', 'Stunky', 'Timburr', 'Tinkatink',
			'Toedscool', 'Trapinch', 'Vullaby', 'Wingull', 'Zorua-Hisui',
			// LC UUBL
			'Deerling', 'Minccino',
		],
	},
	{
		name: "[Gen 9] NFE",
		desc: `Only Pok&eacute;mon that can evolve are allowed.`,
		mod: 'gen9',
		searchShow: false,
		ruleset: ['Standard OMs', 'Not Fully Evolved', 'Sleep Moves Clause', 'Terastal Clause'],
		banlist: [
			'Basculin-White-Striped', 'Bisharp', 'Chansey', 'Combusken', 'Dipplin', 'Duraludon', 'Electabuzz', 'Gligar', 'Gurdurr',
			'Haunter', 'Magmar', 'Magneton', 'Misdreavus', 'Porygon2', 'Primeape', 'Qwilfish-Hisui', 'Rhydon', 'Scyther', 'Sneasel',
			'Sneasel-Hisui', 'Ursaring', 'Vigoroth', 'Vulpix-Base', 'Arena Trap', 'Magnet Pull', 'Moody', 'Shadow Tag', 'Baton Pass',
		],
	},

	//#endregion

	//#region DRAFT

	{
		section: "Draft",
		column: 1,
	},
	{
		name: "[Gen 9] Draft",
		mod: 'gen9',
		searchShow: false,
		teraPreviewDefault: true,
		ruleset: ['Standard Draft', 'Min Source Gen = 9'],
	},
	{
		name: "[Gen 9] 6v6 Doubles Draft",
		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		teraPreviewDefault: true,
		ruleset: ['Standard Draft', '!Sleep Clause Mod', '!Evasion Clause', 'Min Source Gen = 9'],
	},
	{
		name: "[Gen 9] 4v4 Doubles Draft",
		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		bestOfDefault: true,
		teraPreviewDefault: true,
		ruleset: ['Standard Draft', 'Item Clause = 1', 'VGC Timer', '!Sleep Clause Mod', '!OHKO Clause', '!Evasion Clause', 'Adjust Level = 50', 'Picked Team Size = 4', 'Min Source Gen = 9'],
	},
	{
		name: "[Gen 9] NatDex Draft",
		mod: 'gen9',
		searchShow: false,
		teraPreviewDefault: true,
		ruleset: ['Standard Draft', '+Unobtainable', '+Past', 'Min Source Gen = 1'],
	},
	{
		name: "[Gen 9] NatDex 6v6 Doubles Draft",
		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		teraPreviewDefault: true,
		ruleset: ['[Gen 9] 6v6 Doubles Draft', '+Unobtainable', '+Past', '!! Min Source Gen = 3'],
	},
	{
		name: "[Gen 9] NatDex LC Draft",
		mod: 'gen9',
		searchShow: false,
		teraPreviewDefault: true,
		ruleset: ['[Gen 9] NatDex Draft', 'Item Clause = 2', 'Little Cup'],
		banlist: ['Dragon Rage', 'Sonic Boom'],
	},
	{
		name: "[Gen 8] Draft",
		mod: 'gen8',
		searchShow: false,
		ruleset: ['Standard Draft', 'Dynamax Clause'],
	},
	{
		name: "[Gen 8] NatDex Draft",
		mod: 'gen8',
		searchShow: false,
		ruleset: ['Standard Draft', 'NatDex Mod', 'Dynamax Clause'],
	},
	{
		name: "[Gen 8] NatDex 4v4 Doubles Draft",
		mod: 'gen8',
		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Standard Draft', 'Item Clause = 1', 'NatDex Mod', '!Sleep Clause Mod', '!OHKO Clause', '!Evasion Moves Clause', 'Adjust Level = 50', 'Picked Team Size = 4'],
	},
	{
		name: "[Gen 7] Draft",
		mod: 'gen7',
		searchShow: false,
		ruleset: ['Standard Draft', '+LGPE'],
	},
	{
		name: "[Gen 6] Draft",
		mod: 'gen6',
		searchShow: false,
		ruleset: ['Standard Draft', 'Moody Clause', 'Swagger Clause'],
		banlist: ['Soul Dew'],
	},
	{
		name: "[Gen 5] Draft",
		mod: 'gen5',
		searchShow: false,
		ruleset: ['Standard Draft', '-Unreleased', 'Moody Clause', 'Swagger Clause', 'DryPass Clause', 'Gems Clause', 'Sleep Moves Clause'],
		banlist: ['King\'s Rock', 'Quick Claw', 'Soul Dew', 'Assist', 'Drizzle ++ Swift Swim', 'Drought ++ Chlorophyll', 'Sand Stream ++ Sand Rush', 'Landorus + Sheer Force', 'Excadrill + Sand Rush'],
	},
	{
		name: "[Gen 4] Draft",
		mod: 'gen4',
		searchShow: false,
		ruleset: ['Standard Draft', 'Swagger Clause', 'DryPass Clause', 'Sleep Moves Clause', '!Team Preview', '!Evasion Abilities Clause'],
		banlist: ['King\'s Rock', 'Quick Claw', 'Assist', 'Sand Stream ++ Sand Veil', 'Snow Warning ++ Snow Cloak'],
	},
	{
		name: "[Gen 3] Draft",
		mod: 'gen3',
		searchShow: false,
		ruleset: ['Standard Draft'],
	},

	//#endregion

	//#region OM OF THE MONTH

	{
		section: "OM of the Month",
		column: 2,
	},
	{
		name: "[Gen 9] Pokebilities",
		desc: `Pok&eacute;mon have all of their released abilities simultaneously.`,
		mod: 'pokebilities',
		// searchShow: false,
		ruleset: ['Standard OMs', 'Sleep Moves Clause'],
		banlist: [
			// Pokemon
			'Arceus', 'Annihilape', 'Archaludon', 'Basculegion', 'Basculegion-F', 'Baxcalibur', 'Braviary-Hisui', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Conkeldurr',
			'Deoxys-Normal', 'Deoxys-Attack', 'Dialga', 'Dialga-Origin', 'Espathra', 'Eternatus', 'Excadrill', 'Flutter Mane', 'Giratina', 'Giratina-Origin', 'Gouging Fire', 'Groudon',
			'Ho-Oh', 'Iron Bundle', 'Koraidon', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Landorus-Incarnate', 'Lugia', 'Lunala', 'Magearna', 'Miraidon', 'Mewtwo', 'Necrozma-Dusk-Mane',
			'Necrozma-Dawn-Wings', 'Ogerpon-Hearthflame', 'Palafin', 'Palkia', 'Palkia-Origin', 'Porygon-Z', 'Rayquaza', 'Regieleki', 'Reshiram', 'Roaring Moon', 'Shaymin-Sky', 'Sneasler',
			'Solgaleo', 'Spectrier', 'Terapagos', 'Ursaluna-Bloodmoon', 'Urshifu-Single-Strike', 'Urshifu-Rapid-Strike', 'Volcarona', 'Zacian', 'Zacian-Crowned', 'Zamazenta-Crowned',
			'Zekrom', 'Arena Trap', 'Moody', 'Shadow Tag', 'Bright Powder', 'Damp Rock', 'Icy Rock', 'King\'s Rock', 'Razor Fang', 'Smooth Rock', 'Baton Pass', 'Shed Tail', 'Last Respects',
		],
		onValidateSet(set) {
			const species = this.dex.species.get(set.species);
			const unSeenAbilities = Object.keys(species.abilities)
				.filter(key => key !== 'S' && (key !== 'H' || !species.unreleasedHidden))
				.map(key => species.abilities[key as "0" | "1" | "H" | "S"])
				.filter(ability => ability !== set.ability);
			if (unSeenAbilities.length && this.toID(set.ability) !== this.toID(species.abilities['S'])) {
				for (const abilityName of unSeenAbilities) {
					const banReason = this.ruleTable.check('ability:' + this.toID(abilityName));
					if (banReason) {
						return [`${set.name}'s ability ${abilityName} is ${banReason}.`];
					}
				}
			}
		},
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				if (pokemon.ability === this.toID(pokemon.species.abilities['S'])) {
					continue;
				}
				pokemon.m.innates = Object.keys(pokemon.species.abilities)
					.filter(key => key !== 'S' && (key !== 'H' || !pokemon.species.unreleasedHidden))
					.map(key => this.toID(pokemon.species.abilities[key as "0" | "1" | "H" | "S"]))
					.filter(ability => ability !== pokemon.ability);
			}
		},
		onBeforeSwitchIn(pokemon) {
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (pokemon.hasAbility(innate)) continue;
					const effect = 'ability:' + this.toID(innate);
					pokemon.volatiles[effect] = this.initEffectState({ id: effect, target: pokemon });
				}
			}
		},
		onSwitchOut(pokemon) {
			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				pokemon.removeVolatile(innate);
			}
		},
		onFaint(pokemon) {
			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				const innateEffect = this.dex.conditions.get(innate) as Effect;
				this.singleEvent('End', innateEffect, null, pokemon);
			}
		},
		onAfterMega(pokemon) {
			for (const innate of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				pokemon.removeVolatile(innate);
			}
			pokemon.m.innates = undefined;
		},
	},
	{
		name: "[Gen 9] Tera Override",
		desc: `Any moves/items/abilities with mechanics relating to a specific type get that type replaced with the user's Tera type.`,
		mod: 'teraoverride',
		ruleset: ['Standard OMs', 'Evasion Abilities Clause', 'Evasion Items Clause', 'Tera Type Preview'],
		banlist: [
			'Annihilape', 'Arceus', 'Archaludon', 'Baxcalibur', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Deoxys-Attack', 'Deoxys-Normal', 'Dialga', 'Dialga-Origin', 'Espathra',
			'Eternatus', 'Flutter Mane', 'Giratina', 'Giratina-Origin', 'Groudon', 'Hawlucha', 'Ho-Oh', 'Iron Bundle', 'Koraidon', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Landorus-Incarnate',
			'Lugia', 'Lunala', 'Magearna', 'Mewtwo', 'Miraidon', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Ninetales-Alola', 'Ogerpon-Hearthflame', 'Palafin', 'Palkia', 'Palkia-Origin',
			'Rayquaza', 'Regieleki', 'Reshiram', 'Roaring Moon', 'Shaymin-Sky', 'Sneasler', 'Solgaleo', 'Spectrier', 'Terapagos', 'Ursaluna-Bloodmoon', 'Urshifu', 'Urshifu-Rapid-Strike',
			'Volcarona', 'Zacian', 'Zacian-Crowned', 'Zamazenta-Crowned', 'Zekrom', 'Arena Trap', 'Magnet Pull', 'Moody', 'Shadow Tag', 'Focus Band', 'King\'s Rock', 'Razor Fang', 'Quick Claw',
			'Baton Pass', 'Last Respects', 'Shed Tail', 'Weather Ball',
		],
		onSwitchIn(pokemon) {
			this.add('-start', pokemon, pokemon.teraType, '[silent]');
		},
	},

	//#endregion

	//#region OTHER METAGAMES

	{
		section: "Other Metagames",
		column: 2,
	},
	{
		name: "[Gen 9] Godly Gift",
		desc: `Each Pok&eacute;mon receives one base stat from a God (Restricted Pok&eacute;mon) depending on its position in the team. If there is no restricted Pok&eacute;mon, it uses the Pok&eacute;mon in the first slot.`,
		mod: 'gen9',
		ruleset: ['Standard OMs', 'Evasion Abilities Clause', 'Evasion Items Clause', 'Sleep Moves Clause', 'Godly Gift Mod'],
		banlist: [
			'Blissey', 'Calyrex-Shadow', 'Chansey', 'Deoxys-Attack', 'Koraidon', 'Kyurem-Black', 'Miraidon', 'Arena Trap', 'Gale Wings', 'Huge Power', 'Moody', 'Pure Power', 'Shadow Tag',
			'Swift Swim', 'Focus Band', 'King\'s Rock', 'Quick Claw', 'Razor Fang', 'Baton Pass', 'Last Respects', 'Shed Tail',
		],
		restricted: [
			'Alomomola', 'Annihilape', 'Araquanid', 'Arceus', 'Baxcalibur', 'Calyrex-Ice', 'Chien-Pao', 'Chi-Yu', 'Crawdaunt', 'Deoxys-Normal', 'Deoxys-Speed', 'Dialga', 'Dialga-Origin', 'Dragapult',
			'Espathra', 'Eternatus', 'Flutter Mane', 'Giratina', 'Giratina-Origin', 'Gliscor', 'Gouging Fire', 'Groudon', 'Hawlucha', 'Ho-Oh', 'Iron Bundle', 'Iron Hands', 'Kingambit', 'Kyogre',
			'Kyurem', 'Kyurem-White', 'Lugia', 'Lunala', 'Magearna', 'Mewtwo', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Ogerpon-Hearthflame', 'Palafin', 'Palkia', 'Palkia-Origin', 'Raging Bolt',
			'Rayquaza', 'Regieleki', 'Reshiram', 'Serperior', 'Shaymin-Sky', 'Smeargle', 'Solgaleo', 'Spectrier', 'Terapagos', 'Toxapex', 'Ursaluna', 'Ursaluna-Bloodmoon', 'Volcarona', 'Zacian',
			'Zacian-Crowned', 'Zamazenta-Crowned', 'Zekrom',
		],
	},
	{
		name: "[Gen 9] Shared Power",
		desc: `Once a Pok&eacute;mon switches in, its ability is shared with the rest of the team.`,
		mod: 'sharedpower',
		ruleset: ['Standard OMs', 'Evasion Abilities Clause', 'Evasion Items Clause', 'Sleep Moves Clause'],
		banlist: [
			'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Conkeldurr', 'Deoxys-Attack', 'Eternatus', 'Greninja', 'Kingambit', 'Kyogre', 'Kyurem-Black',
			'Kyurem-White', 'Koraidon', 'Lunala', 'Magearna', 'Mewtwo', 'Miraidon', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Ogerpon-Hearthflame', 'Palafin', 'Rayquaza',
			'Regieleki', 'Reshiram', 'Rillaboom', 'Scizor', 'Shaymin-Sky', 'Spectrier', 'Sneasler', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom',
			'Arena Trap', 'Moody', 'Neutralizing Gas', 'Shadow Tag', 'Speed Boost', 'Stench', 'Swift Swim', 'King\'s Rock', 'Leppa Berry', 'Razor Fang', 'Starf Berry',
			'Baton Pass', 'Extreme Speed', 'Last Respects',
		],
		unbanlist: ['Arceus-Bug', 'Arceus-Dragon', 'Arceus-Fire', 'Arceus-Ice'],
		restricted: [
			'Armor Tail', 'Chlorophyll', 'Comatose', 'Contrary', 'Dazzling', 'Fur Coat', 'Gale Wings', 'Good as Gold', 'Huge Power', 'Ice Scales', 'Illusion', 'Imposter',
			'Magic Bounce', 'Magic Guard', 'Magnet Pull', 'Mold Breaker', 'Multiscale', 'Poison Heal', 'Prankster', 'Protosynthesis', 'Psychic Surge', 'Pure Power',
			'Quark Drive', 'Queenly Majesty', 'Quick Draw', 'Quick Feet', 'Regenerator', 'Sand Rush', 'Simple', 'Slush Rush', 'Stakeout', 'Stamina', 'Sturdy',
			'Surge Surfer', 'Technician', 'Tinted Lens', 'Triage', 'Unaware', 'Unburden', 'Water Bubble',
		],
		onValidateRule() {
			if (this.format.gameType !== 'singles') {
				throw new Error(`Shared Power currently does not support ${this.format.gameType} battles.`);
			}
		},
		getSharedPower(pokemon) {
			const sharedPower = new Set<string>();
			for (const ally of pokemon.side.pokemon) {
				if (pokemon.battle.ruleTable.isRestricted(`ability:${ally.baseAbility}`)) continue;
				if (ally.previouslySwitchedIn > 0) {
					if (pokemon.battle.dex.currentMod !== 'sharedpower' && ['trace', 'mirrorarmor'].includes(ally.baseAbility)) {
						sharedPower.add('noability');
						continue;
					}
					sharedPower.add(ally.baseAbility);
				}
			}
			sharedPower.delete(pokemon.baseAbility);
			return sharedPower;
		},
		onBeforeSwitchIn(pokemon) {
			let format = this.format;
			if (!format.getSharedPower) format = this.dex.formats.get('gen9sharedpower');
			for (const ability of format.getSharedPower!(pokemon)) {
				const effect = 'ability:' + this.toID(ability);
				pokemon.volatiles[effect] = this.initEffectState({ id: effect, target: pokemon });
				if (!pokemon.m.abils) pokemon.m.abils = [];
				if (!pokemon.m.abils.includes(effect)) pokemon.m.abils.push(effect);
			}
		},
	},
	{
		name: "[Gen 7] Pure Hackmons",
		desc: `Anything that can be hacked in-game and is usable in local battles is allowed.`,
		mod: 'gen7',
		ruleset: ['-Nonexistent', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Endless Battle Clause'],
	},

	//#endregion

	//#region CHALLENGEABLE OMS

	{
		section: "Challengeable OMs",
		column: 2,
	},
	{
		name: "[Gen 9] Battlefields",
		desc: `Any field condition with a set duration becomes permanent once triggered unless directly replaced, removed, or reversed. Namely, this impacts screens, weathers, terrains, room effects, gravity, and side conditions like Tailwind and Safeguard.`,
		mod: 'gen9',
		searchShow: false,
		ruleset: ['Standard OMs', 'Sleep Moves Clause', 'Evasion Abilities Clause'],
		banlist: [
			'Annihilape', 'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Deoxys-Attack', 'Deoxys-Normal', 'Dialga', 'Dialga-Origin', 'Espathra',
			'Eternatus', 'Flutter Mane', 'Gholdengo', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Koraidon', 'Kyogre', 'Kyurem-Black', 'Kyurem-White',
			'Landorus-Incarnate', 'Lugia', 'Lunala', 'Magearna', 'Mewtwo', 'Miraidon', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Ogerpon-Hearthflame', 'Palafin',
			'Palkia', 'Palkia-Origin', 'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Sneasler', 'Spectrier', 'Terapagos', 'Urshifu', 'Urshifu-Rapid-Strike', 'Zacian',
			'Zacian-Crowned', 'Zamazenta-Crowned', 'Zekrom', 'Arena Trap', 'Moody', 'Shadow Tag', 'King\'s Rock', 'Razor Fang', 'Aurora Veil', 'Baton Pass', 'Fairy Lock',
			'Last Respects', 'Light Screen', 'Quick Guard', 'Reflect', 'Shed Tail', 'Tailwind', 'Trick Room',
		],
		onWeatherChange() {
			this.field.weatherState.duration = 0;
		},
		onTerrainChange() {
			this.field.terrainState.duration = 0;
		},
		onPseudoWeatherChange(target, source, pseudoWeather) {
			this.field.pseudoWeather[pseudoWeather.id].duration = 0;
		},
		onSideConditionStart(side, source, sideCondition) {
			side.sideConditions[sideCondition.id].duration = 0;
		},
	},
	{
		name: "[Gen 9] Convergence",
		desc: `Allows all Pok&eacute;mon that have identical types to share moves and abilities.`,
		mod: 'gen9',
		searchShow: false,
		ruleset: ['Standard OMs', 'Sleep Clause Mod', 'Convergence Legality', 'Terastal Clause', '!Obtainable Abilities'],
		banlist: [
			'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Darkrai', 'Deoxys-Normal', 'Deoxys-Attack', 'Deoxys-Speed', 'Dialga', 'Dialga-Origin',
			'Dondozo', 'Eternatus', 'Flutter Mane', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-oh', 'Inteleon', 'Iron Bundle', 'Iron Hands', 'Koraidon', 'Kyogre',
			'Kyurem-Black', 'Kyurem-White', 'Landorus-Incarnate', 'Lilligant-Hisui', 'Lugia', 'Lunala', 'Magearna', 'Manaphy', 'Mewtwo', 'Miraidon', 'Necrozma-Dawn-Wings',
			'Necrozma-Dusk-Mane', 'Ogerpon-Hearthflame', 'Palafin', 'Palkia', 'Palkia-Origin', 'Primarina', 'Rayquaza', 'Regieleki', 'Regigigas', 'Reshiram', 'Shaymin-Sky',
			'Solgaleo', 'Slaking', 'Smeargle', 'Spectrier', 'Urshifu-Single-Strike', 'Urshifu-Rapid-Strike', 'Walking Wake', 'Zacian', 'Zacian-Crowned', 'Zamazenta',
			'Zamazenta-Crowned', 'Zekrom', 'Arena Trap', 'Comatose', 'Contrary', 'Drizzle', 'Imposter', 'Moody', 'Pure Power', 'Shadow Tag', 'Speed Boost', 'Unburden',
			'Heat Rock', 'King\'s Rock', 'Light Clay', 'Razor Fang', 'Baton Pass', 'Boomburst', 'Extreme Speed', 'Last Respects', 'Population Bomb', 'Quiver Dance',
			'Rage Fist', 'Shed Tail', 'Shell Smash', 'Spore', 'Transform',
		],
	},
	{
		name: "[Gen 9] Fervent Impersonation",
		desc: `Nickname a Pok&eacute;mon after another Pok&eacute;mon that it shares a moveset with, and it will transform into the Pok&eacute;mon it's nicknamed after once it drops to or below 50% health.`,
		mod: 'gen9',
		searchShow: false,
		ruleset: ['Standard OMs', 'Sleep Moves Clause', 'Fervent Impersonation Mod', '!Nickname Clause'],
		banlist: ['Arena Trap', 'Moody', 'Shadow Tag', 'King\'s Rock', 'Razor Fang', 'Baton Pass', 'Dire Claw', 'Shed Tail', 'Last Respects'],
		restricted: [
			'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Deoxys-Normal', 'Deoxys-Attack', 'Dialga', 'Dialga-Origin', 'Espathra', 'Eternatus',
			'Flutter Mane', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Koraidon', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Lunala', 'Magearna',
			'Mewtwo', 'Miraidon', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palafin', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Regieleki', 'Reshiram', 'Shaymin-Sky',
			'Solgaleo', 'Terapagos', 'Urshifu-Single-Strike', 'Zacian', 'Zacian-Crowned', 'Zamazenta-Crowned', 'Zekrom',
		],
		// Implemented the mechanics as a Rule because I'm too lazy to make battles read base format for `onResidual` at the moment
	},
	{
		name: "[Gen 9] Formemons",
		desc: `Alternate formes of existing Pokemon can be used directly without required items/moves.`,
		mod: 'gen9',
		searchShow: false,
		ruleset: [
			'Standard AG', '!Obtainable Formes', '+Past', '+LGPE', 'Evasion Clause', 'Forme Clause', 'OHKO Clause', 'Overflow Stat Mod',
			'Sleep Moves Clause', 'Species Reveal Clause', 'Hackmons Forme Legality', 'Mega Rayquaza Clause',
		],
		banlist: ['Calyrex-Shadow', 'Gengar-Mega', 'Miraidon', 'Moody', 'King\'s Rock', 'Razor Fang', 'Baton Pass'],
		onValidateSet(set, format, setHas, teamHas) {
			const species = this.dex.species.get(set.species);
			if (this.dex.species.get(species.baseSpecies).isNonstandard) return [`${species.name} does not exist in Gen 9.`];
		},
	},
	{
		name: "[Gen 9] Inverse",
		desc: `The type chart is inverted; weaknesses become resistances, while resistances and immunities become weaknesses.`,
		mod: 'gen9',
		searchShow: false,
		ruleset: ['Standard OMs', 'Sleep Moves Clause', 'Inverse Mod', 'Terastal Clause'],
		banlist: [
			'Arceus', 'Baxcalibur', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chien-Pao', 'Deoxys-Attack', 'Deoxys-Normal', 'Deoxys-Speed', 'Espathra', 'Eternatus', 'Flutter Mane',
			'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Indeedee', 'Indeedee-F', 'Koraidon', 'Kyogre', 'Kyurem', 'Kyurem-Black', 'Kyurem-White', 'Lunala', 'Maushold', 'Mewtwo',
			'Miraidon', 'Necrozma-Dawn-Wings', 'Palafin', 'Palkia', 'Palkia-Origin', 'Porygon-Z', 'Rayquaza', 'Regidrago', 'Regieleki', 'Reshiram', 'Rillaboom', 'Shaymin-Sky',
			'Spectrier', 'Ursaluna', 'Ursaluna-Bloodmoon', 'Zacian', 'Zacian-Crowned', 'Zamazenta-Hero', 'Zekrom', 'Arena Trap', 'Moody', 'Shadow Tag', 'King\'s Rock', 'Light Clay',
			'Baton Pass', 'Last Respects', 'Shed Tail',
		],
	},
	{
		name: "[Gen 9] Pure Hackmons",
		desc: `Anything directly hackable onto a set (EVs, IVs, forme, ability, item, and move) and is usable in local battles is allowed.`,
		mod: 'gen9',
		searchShow: false,
		ruleset: ['Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Hackmons Forme Legality', 'Species Reveal Clause', 'Endless Battle Clause'],
	},
	{
		name: "[Gen 9] Relay Race",
		desc: `The effects of the move Baton Pass are triggered upon manually withdrawing a Pok&eacute;mon from battle.`,
		mod: 'gen9',
		searchShow: false,
		ruleset: ['Standard OMs', 'Sleep Moves Clause', 'Terastal Clause'],
		banlist: [
			'Annihilape', 'Arceus', 'Archaludon', 'Baxcalibur', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chien-Pao', 'Chi-Yu', 'Deoxys-Attack', 'Deoxys-Normal', 'Dialga',
			'Dialga-Origin', 'Enamorus-Incarnate', 'Eternatus', 'Flutter Mane', 'Giratina', 'Giratina-Origin', 'Gouging Fire', 'Groudon', 'Ho-Oh', 'Iron Bundle',
			'Koraidon', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Landorus-Incarnate', 'Lugia', 'Lunala', 'Magearna', 'Mewtwo', 'Miraidon', 'Necrozma-Dawn-Wings',
			'Necrozma-Dusk-Mane', 'Ogerpon-Hearthflame', 'Ogerpon-Wellspring', 'Palafin', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Sneasler',
			'Solgaleo', 'Skeledirge', 'Spectrier', 'Ursaluna-Bloodmoon', 'Urshifu', 'Urshifu-Rapid-Strike', 'Zacian', 'Zacian-Crowned', 'Zamazenta-Crowned', 'Zekrom',
			'Arena Trap', 'Moody', 'Sand Veil', 'Shadow Tag', 'Snow Cloak', 'Speed Boost', 'Bright Powder', 'King\'s Rock', 'Razor Fang', 'Clangorous Soul',
			'Last Respects', 'Mud-Slap', 'Muddy Water', 'Night Daze', 'No Retreat', 'Perish Song', 'Sand Attack', 'Shell Smash', 'Smokescreen', 'Quiver Dance', 'Victory Dance',
		],
		actions: {
			switchIn(pokemon, pos, sourceEffect, isDrag) {
				if (!pokemon || pokemon.isActive) {
					this.battle.hint("A switch failed because the Pokémon trying to switch in is already in.");
					return false;
				}

				const side = pokemon.side;
				if (pos >= side.active.length) {
					throw new Error(`Invalid switch position ${pos} / ${side.active.length}`);
				}
				const oldActive = side.active[pos];
				const unfaintedActive = oldActive?.hp ? oldActive : null;
				if (unfaintedActive) {
					oldActive.beingCalledBack = true;
					let switchCopyFlag: 'copyvolatile' | 'shedtail' | boolean = false;
					if (sourceEffect && typeof (sourceEffect as Move).selfSwitch) {
						if (typeof (sourceEffect as Move).selfSwitch === 'string') {
							switchCopyFlag = (sourceEffect as Move).selfSwitch!;
						}
					} else {
						if (!isDrag && !sourceEffect) switchCopyFlag = 'copyvolatile';
					}
					if (!oldActive.skipBeforeSwitchOutEventFlag && !isDrag) {
						this.battle.runEvent('BeforeSwitchOut', oldActive);
						if (this.battle.gen >= 5) {
							this.battle.eachEvent('Update');
						}
					}
					oldActive.skipBeforeSwitchOutEventFlag = false;
					if (!this.battle.runEvent('SwitchOut', oldActive)) {
						// Warning: DO NOT interrupt a switch-out if you just want to trap a pokemon.
						// To trap a pokemon and prevent it from switching out, (e.g. Mean Look, Magnet Pull)
						// use the 'trapped' flag instead.

						// Note: Nothing in the real games can interrupt a switch-out (except Pursuit KOing,
						// which is handled elsewhere); this is just for custom formats.
						return false;
					}
					if (!oldActive.hp) {
						// a pokemon fainted from Pursuit before it could switch
						return 'pursuitfaint';
					}

					// will definitely switch out at this point

					oldActive.illusion = null;
					this.battle.singleEvent('End', oldActive.getAbility(), oldActive.abilityState, oldActive);
					this.battle.singleEvent('End', oldActive.getItem(), oldActive.itemState, oldActive);

					// if a pokemon is forced out by Whirlwind/etc or Eject Button/Pack, it can't use its chosen move
					this.battle.queue.cancelAction(oldActive);

					let newMove = null;
					if (this.battle.gen === 4 && sourceEffect) {
						newMove = oldActive.lastMove;
					}
					if (switchCopyFlag) {
						pokemon.copyVolatileFrom(oldActive, switchCopyFlag);
					}
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
				for (const moveSlot of pokemon.moveSlots) {
					moveSlot.used = false;
				}
				pokemon.abilityState = this.battle.initEffectState({ id: pokemon.ability, target: pokemon });
				pokemon.itemState = this.battle.initEffectState({ id: pokemon.item, target: pokemon });
				this.battle.runEvent('BeforeSwitchIn', pokemon);
				if (sourceEffect) {
					this.battle.add(isDrag ? 'drag' : 'switch', pokemon, pokemon.getFullDetails, `[from] ${sourceEffect}`);
				} else {
					this.battle.add(isDrag ? 'drag' : 'switch', pokemon, pokemon.getFullDetails);
				}
				if (isDrag && this.battle.gen === 2) pokemon.draggedIn = this.battle.turn;
				pokemon.previouslySwitchedIn++;

				if (isDrag && this.battle.gen >= 5) {
					// runSwitch happens immediately so that Mold Breaker can make hazards bypass Clear Body and Levitate
					this.runSwitch(pokemon);
				} else {
					this.battle.queue.insertChoice({ choice: 'runSwitch', pokemon });
				}

				return true;
			},
		},
	},
	{
		name: "[Gen 9] The Card Game",
		desc: `The type chart is simplified based off of the Pok&eacute;mon Trading Card Game.`,
		mod: 'thecardgame',
		searchShow: false,
		ruleset: ['Standard OMs', 'Sleep Moves Clause', 'Evasion Abilities Clause', 'Evasion Items Clause', 'Terastal Clause'],
		banlist: [
			'Annihilape', 'Arceus', 'Baxcalibur', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Deoxys-Normal', 'Deoxys-Attack', 'Dialga', 'Dialga-Origin',
			'Dragapult', 'Dragonite', 'Dudunsparce', 'Eternatus', 'Garchomp', 'Giratina', 'Giratina-Origin', 'Gouging Fire', 'Groudon', 'Haxorus', 'Ho-Oh', 'Hydreigon',
			'Iron Valiant', 'Kommo-o', 'Koraidon', 'Kyogre', 'Kyurem', 'Kyurem-Black', 'Kyurem-White', 'Landorus-Incarnate', 'Latias', 'Latios', 'Lugia', 'Lunala',
			'Mewtwo', 'Miraidon', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Noivern', 'Ogerpon-Hearthflame', 'Palafin', 'Palkia', 'Palkia-Origin', 'Raging Bolt',
			'Rayquaza', 'Regidrago', 'Regieleki', 'Reshiram', 'Roaring Moon', 'Salamence', 'Shaymin-Sky', 'Solgaleo', 'Ursaluna', 'Ursaluna-Bloodmoon', 'Urshifu-Single-Strike',
			'Walking Wake', 'Zacian', 'Zacian-Crowned', 'Zekrom', 'Arena Trap', 'Moody', 'Shadow Tag', 'Baton Pass', 'Last Respects', 'Shed Tail',
		],
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.hpType = pokemon.hpType.replace(/(Ghost|Fairy)/g, 'Psychic')
					.replace(/Bug/g, 'Grass')
					.replace(/Ice/g, 'Water')
					.replace(/(Rock|Ground)/g, 'Fighting')
					.replace(/Flying/g, 'Normal')
					.replace(/Poison/g, 'Dark');
				pokemon.teraType = pokemon.teraType.replace(/(Ghost|Fairy)/g, 'Psychic')
					.replace(/Bug/g, 'Grass')
					.replace(/Ice/g, 'Water')
					.replace(/(Rock|Ground)/g, 'Fighting')
					.replace(/Flying/g, 'Normal')
					.replace(/Poison/g, 'Dark');
			}
		},
		onSwitchIn(pokemon) {
			this.add('-start', pokemon, 'typechange', (pokemon.illusion || pokemon).getTypes(true).join('/'), '[silent]');
			pokemon.apparentType = pokemon.getTypes(true).join('/');
		},
		onAfterMega(pokemon) {
			this.add('-start', pokemon, 'typechange', (pokemon.illusion || pokemon).getTypes(true).join('/'), '[silent]');
			pokemon.apparentType = pokemon.getTypes(true).join('/');
		},
	},
	{
		name: "[Gen 9] Triples",
		mod: 'gen9',
		gameType: 'triples',
		searchShow: false,
		ruleset: ['Standard Doubles', 'Evasion Abilities Clause'],
		banlist: [
			'Annihilape', 'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Darkrai', 'Dialga', 'Dialga-Origin', 'Eternatus', 'Flutter Mane', 'Giratina', 'Giratina-Origin',
			'Groudon', 'Ho-Oh', 'Indeedee-M', 'Indeedee-F', 'Koraidon', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Lunala', 'Magearna', 'Mewtwo', 'Miraidon',
			'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Reshiram', 'Solgaleo', 'Terapagos', 'Urshifu', 'Urshifu-Rapid-Strike',
			'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom', 'Moody', 'Shadow Tag', 'Bright Powder', 'King\'s Rock', 'Razor Fang',
		],
	},
	{
		name: "[Gen 9] Type Split",
		desc: `The Physical/Special split is reverted; All non-Status moves are Physical or Special depending on their type, no exceptions.`,
		mod: 'gen9',
		searchShow: false,
		ruleset: ['Standard OMs', 'Sleep Moves Clause', 'Evasion Abilities Clause'],
		banlist: [
			'Annihilape', 'Arceus', 'Archaludon', 'Calyrex-Shadow', 'Chi-Yu', 'Darkrai', 'Deoxys-Normal', 'Deoxys-Attack', 'Dialga', 'Dialga-Origin', 'Espathra',
			'Eternatus', 'Flutter Mane', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Iron Bundle', 'Koraidon', 'Kyogre', 'Kyurem-White', 'Landorus-Incarnate',
			'Lugia', 'Lunala', 'Magearna', 'Mewtwo', 'Miraidon', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Regieleki',
			'Reshiram', 'Shaymin-Sky', 'Sneasler', 'Solgaleo', 'Terapagos', 'Volcarona', 'Zacian-Crowned', 'Zamazenta-Crowned', 'Arena Trap', 'Moody', 'Shadow Tag',
			'Bright Powder', 'Damp Rock', 'King\'s Rock', 'Razor Fang', 'Baton Pass', 'Last Respects', 'Shed Tail',
		],
		onModifyMovePriority: -1000,
		onModifyMove(move, pokemon, target) {
			if (move.category === 'Status') return;
			const specialTypes = ['Dark', 'Dragon', 'Electric', 'Fairy', 'Fire', 'Grass', 'Ice', 'Psychic', 'Water'];
			if (specialTypes.includes(move.type)) {
				move.category = 'Special';
			} else if (move.type === 'Stellar') {
				move.category = pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true) ? 'Physical' : 'Special';
			} else {
				move.category = 'Physical';
			}
		},
	},

	//#endregion

	//#region NATIONAL DEX

	{
		section: "National Dex",
	},
	{
		name: "[Gen 9] National Dex",
		mod: 'gen9',
		ruleset: ['Standard NatDex', 'Terastal Clause'],
		banlist: [
			'ND Uber', 'ND AG', 'Arena Trap', 'Moody', 'Power Construct', 'Shadow Tag', 'King\'s Rock',
			'Quick Claw', 'Razor Fang', 'Assist', 'Baton Pass', 'Last Respects', 'Shed Tail',
		],
	},
	{
		name: "[Gen 8] National Dex",
		mod: 'gen8',
		ruleset: ['Standard NatDex', 'Dynamax Clause'],
		banlist: ['ND Uber', 'Arena Trap', 'Moody', 'Power Construct', 'Shadow Tag', 'King\'s Rock', 'Razor Fang', 'Quick Claw', 'Baton Pass'],
	},
	{
		section: "National Dex Other Tiers",
	},
	{
		name: "[Gen 9] National Dex 35 Pokes",
		desc: `Only 35 Pok&eacute;mon are legal.`,
		mod: 'gen9',
		// searchShow: false,
		ruleset: [
			'Standard NatDex',
			'!Species Clause', 'Forme Clause', 'Terastal Clause', 'DryPass Clause', 'Z-Move Clause', 'Mega Rayquaza Clause',
		],
		banlist: [
			'ND Uber', 'ND AG', 'ND OU', 'ND UUBL', 'ND UU', 'ND RUBL', 'ND RU', 'ND NFE', 'ND LC',
			'Battle Bond', 'Moody', 'Power Construct', 'Shadow Tag', 'Tangled Feet', 'Berserk Gene', 'King\'s Rock', 'Quick Claw', 'Razor Fang',
			'Last Respects', 'Shed Tail', 'Baton Pass + Contrary', 'Baton Pass + Rapid Spin',
		],
		unbanlist: [
			'Ambipom', 'Armarouge', 'Articuno-Base', 'Basculegion-F', 'Bibarel', 'Copperajah', 'Corviknight', 'Crobat', 'Dudunsparce', 'Dugtrio-Alola', 'Farigiraf',
			'Floatzel', 'Froslass-Base', 'Golem-Alola', 'Hippowdon', 'Magmortar', 'Meganium-Base', 'Moltres-Base', 'Muk-Alola', 'Munkidori', 'Nidoking', 'Ninjask',
			'Orthworm', 'Perrserker', 'Porygon-Z', 'Pyukumuku', 'Sandslash-Base', 'Sigilyph', 'Simisear', 'Sirfetch’d', 'Steelix-Base', 'Tauros-Base', 'Tauros-Paldea-Aqua',
			'Weezing-Galar', 'Zoroark-Base',
		],
		// Stupid hardcode
		onValidateSet(set, format, setHas, teamHas) {
			if (set.item) {
				const item = this.dex.items.get(set.item);
				if (item.megaEvolves && !(this.ruleTable.has(`+item:${item.id}`) || this.ruleTable.has(`+pokemontag:mega`))) {
					return [`Mega Evolution is banned.`];
				}
			}
			const species = this.dex.species.get(set.species);
			if (set.moves.map(x => this.toID(this.dex.moves.get(x).realMove) || x).includes('hiddenpower') &&
				species.baseSpecies !== 'Unown' && !this.ruleTable.has(`+move:hiddenpower`)) {
				return [`Hidden Power is banned.`];
			}
		},
	},
	{
		name: "[Gen 9] National Dex Ubers",
		mod: 'gen9',
		ruleset: ['Standard NatDex', '!Evasion Clause', 'Evasion Moves Clause', 'Evasion Items Clause', 'Mega Rayquaza Clause'],
		banlist: ['ND AG', 'Shedinja', 'Assist', 'Baton Pass'],
	},
	{
		name: "[Gen 9] National Dex UU",
		mod: 'gen9',
		ruleset: ['[Gen 9] National Dex'],
		banlist: ['ND OU', 'ND UUBL', 'Drizzle', 'Drought', 'Light Clay'],
	},
	{
		name: "[Gen 9] National Dex RU",
		mod: 'gen9',
		searchShow: false,
		ruleset: ['[Gen 9] National Dex UU'],
		banlist: ['ND UU', 'ND RUBL', 'Slowbro-Base + Slowbronite'],
	},
	{
		name: "[Gen 9] National Dex LC",
		mod: 'gen9',
		searchShow: false,
		ruleset: ['Standard NatDex', 'Little Cup'],
		banlist: [
			'Aipom', 'Basculin-White-Striped', 'Clamperl', 'Corsola-Galar', 'Cutiefly', 'Drifloon', 'Dunsparce', 'Duraludon', 'Flittle', 'Girafarig',
			'Gligar', 'Meditite', 'Misdreavus', 'Murkrow', 'Porygon', 'Qwilfish-Hisui', 'Rufflet', 'Scraggy', 'Scyther', 'Sneasel', 'Sneasel-Hisui',
			'Stantler', 'Swirlix', 'Tangela', 'Voltorb-Hisui', 'Woobat', 'Yanma', 'Zigzagoon-Base', 'Chlorophyll', 'Moody', 'Eevium Z', 'King\'s Rock',
			'Quick Claw', 'Razor Fang', 'Assist', 'Aurora Veil', 'Baton Pass', 'Dragon Rage', 'Sonic Boom', 'Sticky Web',
		],
	},
	{
		name: "[Gen 9] National Dex Monotype",
		mod: 'gen9',
		ruleset: ['Standard NatDex', 'Same Type Clause', 'Terastal Clause'],
		banlist: [
			'Annihilape', 'Arceus', 'Baxcalibur', 'Blastoise-Mega', 'Blaziken', 'Blaziken-Mega', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Darkrai',
			'Deoxys-Normal', 'Deoxys-Attack', 'Dialga', 'Dracovish', 'Dragapult', 'Espathra', 'Eternatus', 'Flutter Mane', 'Genesect', 'Gengar-Mega', 'Giratina',
			'Giratina-Origin', 'Gouging Fire', 'Groudon', 'Ho-Oh', 'Hoopa-Unbound', 'Iron Bundle', 'Kangaskhan-Mega', 'Kartana', 'Kingambit', 'Koraidon', 'Kyogre',
			'Kyurem-Black', 'Kyurem-White', 'Lucario-Mega', 'Lugia', 'Lunala', 'Magearna', 'Marshadow', 'Mawile-Mega', 'Medicham-Mega', 'Metagross-Mega', 'Mewtwo',
			'Miraidon', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Ogerpon-Hearthflame', 'Palafin', 'Palkia', 'Pheromosa', 'Rayquaza', 'Reshiram',
			'Salamence-Mega', 'Shaymin-Sky', 'Solgaleo', 'Spectrier', 'Ursaluna-Bloodmoon', 'Urshifu-Single-Strike', 'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned',
			'Zamazenta', 'Zamazenta-Crowned', 'Zekrom', 'Zygarde-50%', 'Zygarde-Complete', 'Moody', 'Shadow Tag', 'Power Construct', 'Booster Energy', 'Damp Rock',
			'Focus Band', 'Icy Rock', 'King\'s Rock', 'Leppa Berry', 'Quick Claw', 'Razor Fang', 'Smooth Rock', 'Terrain Extender', 'Baton Pass',
			'Last Respects', 'Shed Tail',
		],
	},
	{
		name: "[Gen 9] National Dex Doubles",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard Doubles', 'NatDex Mod', 'Evasion Abilities Clause'],
		banlist: [
			'Annihilape', 'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Dialga', 'Dialga-Origin', 'Eternatus', 'Genesect', 'Gengar-Mega', 'Giratina', 'Giratina-Origin',
			'Groudon', 'Ho-Oh', 'Koraidon', 'Kyogre', 'Kyurem-White', 'Lugia', 'Lunala', 'Magearna', 'Melmetal', 'Metagross-Mega', 'Mewtwo', 'Miraidon', 'Necrozma-Dawn-Wings',
			'Necrozma-Dusk-Mane', 'Necrozma-Ultra', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Reshiram', 'Shedinja', 'Solgaleo', 'Stakataka', 'Terapagos', 'Urshifu',
			'Urshifu-Rapid-Strike', 'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom', 'Zygarde-50%', 'Zygarde-Complete',
			'Commander', 'Power Construct', 'Shadow Tag', 'Eevium Z', 'Assist', 'Coaching', 'Dark Void', 'Swagger',
		],
	},
	{
		name: "[Gen 9] National Dex Doubles Ubers",
		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Standard Doubles', 'NatDex Mod', '!Gravity Sleep Clause'],
		banlist: ['Shedinja', 'Assist'],
	},
	{
		name: "[Gen 9] National Dex Ubers UU",
		mod: 'gen9',
		searchShow: false,
		ruleset: ['[Gen 9] National Dex Ubers'],
		banlist: [
			'Arceus-Normal', 'Arceus-Dark', 'Arceus-Ground', 'Calyrex-Ice', 'Chansey', 'Deoxys-Attack', 'Deoxys-Speed', 'Ditto', 'Dondozo', 'Eternatus', 'Giratina-Origin', 'Groudon-Primal',
			'Hatterene', 'Ho-Oh', 'Kyogre-Primal', 'Lunala', 'Marshadow', 'Melmetal', 'Mewtwo-Mega-Y', 'Necrozma-Dusk-Mane', 'Necrozma-Ultra', 'Salamence-Mega', 'Smeargle', 'Yveltal',
			'Zacian-Crowned', 'Zygarde-50%',
			// UUBL
			'Arceus-Dragon', 'Arceus-Fairy', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Water', 'Blaziken-Mega', 'Chi-Yu', 'Chien-Pao', 'Dracovish', 'Flutter Mane', 'Groudon',
			'Kyogre', 'Kyurem-Black', 'Rayquaza', 'Shaymin-Sky', 'Zacian', 'Zekrom', 'Power Construct', 'Light Clay', 'Ultranecrozium Z', 'Last Respects',
		],
	},
	{
		name: "[Gen 9] National Dex 1v1",
		mod: 'gen9',
		searchShow: false,
		ruleset: ['Standard AG', 'NatDex Mod', 'Nickname Clause', 'Evasion Moves Clause', 'OHKO Clause', 'Species Clause', 'Sleep Moves Clause', 'Terastal Clause', 'Accuracy Moves Clause', 'Picked Team Size = 1', 'Max Team Size = 3'],
		banlist: [
			'Arceus', 'Archaludon', 'Blastoise-Mega', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Deoxys-Normal', 'Deoxys-Attack', 'Deoxys-Defense', 'Dialga', 'Dialga-Origin', 'Dragonite',
			'Eternatus', 'Flutter Mane', 'Giratina', 'Giratina-Origin', 'Gouging Fire', 'Groudon', 'Ho-Oh', 'Jirachi', 'Kangaskhan-Mega', 'Koraidon', 'Kyogre', 'Kyurem-Black', 'Kyurem-White',
			'Lugia', 'Lunala', 'Marshadow', 'Melmetal', 'Metagross-Mega', 'Mew', 'Mewtwo', 'Mimikyu', 'Miraidon', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Ogerpon-Cornerstone', 'Palkia',
			'Palkia-Origin', 'Rayquaza', 'Reshiram', 'Salamence-Mega', 'Shaymin-Sky', 'Snorlax', 'Solgaleo', 'Terapagos', 'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta',
			'Zamazenta-Crowned', 'Zekrom', 'Moody', 'Focus Band', 'Focus Sash', 'Fightinium Z + Detect', 'Perish Song',
		],
	},
	{
		name: "[Gen 9] National Dex AG",
		mod: 'gen9',
		searchShow: false,
		ruleset: ['Standard AG', 'NatDex Mod'],
	},
	{
		name: "[Gen 9] National Dex AAA",
		desc: `Pok&eacute;mon have access to almost any ability.`,
		mod: 'gen9',
		searchShow: false,
		ruleset: ['Standard NatDex', '!Obtainable Abilities', 'Ability Clause = 2', '!Sleep Clause Mod', 'Sleep Moves Clause', 'Terastal Clause'],
		banlist: [
			'Alakazam-Mega', 'Annihilape', 'Arceus', 'Archeops', 'Baxcalibur', 'Blacephalon', 'Blastoise-Mega', 'Blaziken-Mega', 'Calyrex-Ice', 'Calyrex-Shadow', 'Ceruledge', 'Chien-Pao', 'Darkrai', 'Deoxys-Attack',
			'Deoxys-Normal', 'Dialga', 'Dialga-Origin', 'Dracovish', 'Dragapult', 'Enamorus-Incarnate', 'Eternatus', 'Flutter Mane', 'Gengar-Mega', 'Giratina', 'Giratina-Origin', 'Gouging Fire', 'Groudon', 'Ho-Oh',
			'Hoopa-Unbound', 'Iron Boulder', 'Iron Bundle', 'Iron Valiant', 'Kangaskhan-Mega', 'Kartana', 'Keldeo', 'Kingambit', 'Koraidon', 'Kyogre', 'Kyurem', 'Kyurem-Black', 'Kyurem-White', 'Lucario-Mega', 'Lugia',
			'Lunala', 'Magearna', 'Marshadow', 'Melmetal', 'Mewtwo', 'Miraidon', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Noivern', 'Palkia', 'Palkia-Origin', 'Pheromosa', 'Raging Bolt', 'Rayquaza',
			'Regigigas', 'Reshiram', 'Salamence-Mega', 'Shaymin-Sky', 'Shedinja', 'Slaking', 'Sneasler', 'Solgaleo', 'Spectrier', 'Urshifu', 'Urshifu-Rapid-Strike', 'Weavile', 'Xerneas', 'Xurkitree', 'Yveltal', 'Zacian',
			'Zacian-Crowned', 'Zekrom', 'Zeraora', 'Zygarde-50%', 'Arena Trap', 'Comatose', 'Contrary', 'Fur Coat', 'Good as Gold', 'Gorilla Tactics', 'Huge Power', 'Ice Scales', 'Illusion', 'Imposter', 'Innards Out',
			'Intrepid Sword', 'Magic Bounce', 'Magnet Pull', 'Moody', 'Neutralizing Gas', 'Orichalcum Pulse', 'Parental Bond', 'Poison Heal', 'Pure Power', 'Shadow Tag', 'Simple', 'Speed Boost', 'Stakeout', 'Triage',
			'Unburden', 'Water Bubble', 'Wonder Guard', 'King\'s Rock', 'Light Clay', 'Assist', 'Baton Pass', 'Electrify', 'Last Respects', 'Shed Tail',
		],
	},
	{
		name: "[Gen 9] National Dex BH",
		desc: `Balanced Hackmons with National Dex elements mixed in.`,
		mod: 'gen9',
		searchShow: false,
		ruleset: [
			'Standard AG', 'NatDex Mod', '!Obtainable',
			'Forme Clause', 'Sleep Moves Clause', 'Ability Clause = 2', 'OHKO Clause', 'Evasion Moves Clause', 'Dynamax Clause', 'CFZ Clause', 'Terastal Clause',
		],
		banlist: [
			'Cramorant-Gorging', 'Calyrex-Shadow', 'Darmanitan-Galar-Zen', 'Eternatus-Eternamax', 'Greninja-Ash', 'Groudon-Primal', 'Rayquaza-Mega', 'Shedinja', 'Terapagos-Stellar', 'Arena Trap',
			'Contrary', 'Gorilla Tactics', 'Hadron Engine', 'Huge Power', 'Illusion', 'Innards Out', 'Magnet Pull', 'Moody', 'Neutralizing Gas', 'Orichalcum Pulse', 'Parental Bond', 'Pure Power',
			'Shadow Tag', 'Stakeout', 'Water Bubble', 'Wonder Guard', 'Gengarite', 'Berserk Gene', 'Belly Drum', 'Bolt Beak', 'Ceaseless Edge', 'Chatter', 'Double Iron Bash', 'Electrify', 'Imprison',
			'Last Respects', 'Octolock', 'Rage Fist', 'Revival Blessing', 'Shed Tail', 'Shell Smash', 'Sleep Talk',
		],
		restricted: ['Arceus'],
		onValidateTeam(team, format) {
			// baseSpecies:count
			const restrictedPokemonCount = new this.dex.Multiset<string>();
			for (const set of team) {
				const species = this.dex.species.get(set.species);
				if (!this.ruleTable.isRestrictedSpecies(species)) continue;
				restrictedPokemonCount.add(species.baseSpecies);
			}
			for (const [baseSpecies, count] of restrictedPokemonCount) {
				if (count > 1) {
					return [
						`You are limited to one ${baseSpecies} forme.`,
						`(You have ${count} ${baseSpecies} forme${count === 1 ? '' : 's'}.)`,
					];
				}
			}
		},
	},
	{
		name: "[Gen 9] National Dex Godly Gift",
		desc: `Each Pok&eacute;mon receives one base stat from a God (Restricted Pok&eacute;mon) depending on its position in the team. If there is no restricted Pok&eacute;mon, it uses the Pok&eacute;mon in the first slot.`,
		mod: 'gen9',
		searchShow: false,
		ruleset: ['Standard NatDex', 'Terastal Clause', '!Sleep Clause Mod', 'Sleep Moves Clause', 'Godly Gift Mod', 'Mega Rayquaza Clause'],
		banlist: [
			'Blissey', 'Calyrex-Shadow', 'Chansey', 'Deoxys-Attack', 'Groudon-Primal', 'Koraidon', 'Miraidon', 'Shuckle', 'Xerneas',
			'Arena Trap', 'Huge Power', 'Moody', 'Pure Power', 'Shadow Tag', 'Swift Swim', 'King\'s Rock', 'Quick Claw', 'Assist',
			'Baton Pass', 'Last Respects', 'Shed Tail',
		],
		restricted: [
			'Arceus', 'Blastoise-Mega', 'Blaziken-Mega', 'Calyrex-Ice', 'Chi-Yu', 'Chien-Pao', 'Darmanitan-Galar', 'Deoxys-Normal', 'Deoxys-Defense', 'Deoxys-Speed', 'Dialga', 'Dialga-Origin', 'Dracovish',
			'Dragapult', 'Espathra', 'Eternatus', 'Flutter Mane', 'Genesect', 'Gengar Mega', 'Giratina', 'Giratina-Origin', 'Groudon', 'Hawlucha', 'Ho-Oh', 'Iron Bundle', 'Kangaskhan-Mega', 'Kingambit',
			'Kyogre', 'Kyogre-Primal', 'Kyurem-Black', 'Kyurem-White', 'Lucario-Mega', 'Lugia', 'Lunala', 'Magearna', 'Marowak-Alola', 'Marshadow', 'Mawile-Mega', 'Medicham-Mega', 'Melmetal', 'Metagross-Mega',
			'Mewtwo', 'Mewtwo-Mega-X', 'Mewtwo-Mega-Y', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Palkia-Origin', 'Pheromosa', 'Pikachu', 'Rayquaza', 'Reshiram', 'Sableye-Mega',
			'Salamence-Mega', 'Serperior', 'Shaymin-Sky', 'Smeargle', 'Solgaleo', 'Spectrier', 'Swellow', 'Toxapex', 'Ursaluna', 'Ursaluna-Bloodmoon', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta-Crowned',
			'Zekrom', 'Power Construct',
		],
	},
	{
		name: "[Gen 9] National Dex STABmons",
		mod: 'gen9',
		searchShow: false,
		ruleset: ['Standard NatDex', 'STABmons Move Legality', '!Sleep Clause Mod', 'Sleep Moves Clause', 'Terastal Clause'],
		banlist: [
			'Araquanid', 'Arceus', 'Azumarill', 'Baxcalibur', 'Blastoise-Mega', 'Blaziken-Mega', 'Basculegion', 'Basculegion-F', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao',
			'Cloyster', 'Darkrai', 'Darmanitan-Galar', 'Deoxys-Attack', 'Deoxys-Normal', 'Dialga', 'Dialga-Origin', 'Dracovish', 'Dragapult', 'Dragonite', 'Enamorus-Incarnate', 'Espathra',
			'Eternatus', 'Flutter Mane', 'Garchomp', 'Gengar-Mega', 'Genesect', 'Giratina', 'Giratina-Origin', 'Groudon', 'Gouging Fire', 'Ho-Oh', 'Iron Bundle', 'Kangaskhan-Mega',
			'Kartana', 'Koraidon', 'Komala', 'Kyogre', 'Kyurem', 'Kyurem-Black', 'Kyurem-White', 'Landorus-Incarnate', 'Lilligant-Hisui', 'Lucario-Mega', 'Lugia', 'Lunala', 'Magearna',
			'Manaphy', 'Marshadow', 'Metagross-Mega', 'Mewtwo', 'Miraidon', 'Naganadel', 'Necrozma-Dusk-Mane', 'Necrozma-Dawn-Wings', 'Ogerpon-Hearthflame', 'Ogerpon-Wellspring', 'Palkia',
			'Palkia-Origin', 'Porygon-Z', 'Pheromosa', 'Rayquaza', 'Reshiram', 'Salamence-Mega', 'Shaymin-Sky', 'Silvally', 'Solgaleo', 'Spectrier', 'Tapu Koko', 'Tapu Lele', 'Terapagos',
			'Ursaluna-Bloodmoon', 'Urshifu-Single-Strike', 'Walking Wake', 'Xerneas', 'Xurkitree', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta-Crowned', 'Zekrom', 'Zoroark-Hisui',
			'Zygarde-50%', 'Arena Trap', 'Moody', 'Shadow Tag', 'Power Construct', 'Damp Rock', 'King\'s Rock', 'Quick Claw', 'Razor Fang', 'Assist', 'Baton Pass', 'Last Respects',
			'Shed Tail', 'Wicked Blow', 'Wicked Torque',
		],
		restricted: [
			'Astral Barrage', 'Belly Drum', 'Bolt Beak', 'Chatter', 'Clangorous Soul', 'Dire Claw', 'Double Iron Bash', 'Dragon Energy', 'Electrify', 'Extreme Speed',
			'Fillet Away', 'Final Gambit', 'Fishious Rend', 'Geomancy', 'Gigaton Hammer', 'No Retreat', 'Rage Fist', 'Revival Blessing', 'Shell Smash', 'Shift Gear', 'Thousand Arrows',
			'Trick-or-Treat', 'Triple Arrows', 'V-create', 'Victory Dance',
		],
	},
	{
		name: "[Gen 8] National Dex UU",
		mod: 'gen8',
		searchShow: false,
		ruleset: ['[Gen 8] National Dex'],
		banlist: ['ND OU', 'ND UUBL', 'Drizzle', 'Drought', 'Light Clay', 'Slowbronite'],
	},
	{
		name: "[Gen 8] National Dex RU",
		mod: 'gen8',
		searchShow: false,
		ruleset: ['[Gen 8] National Dex UU'],
		banlist: ['ND UU', 'ND RUBL'],
	},
	{
		name: "[Gen 8] National Dex Doubles",
		mod: 'gen8',
		searchShow: false,
		gameType: 'doubles',
		ruleset: ['Standard Doubles', 'NatDex Mod', 'Evasion Abilities Clause'],
		banlist: [
			'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Charizard', 'Dialga', 'Eternatus', 'Gengar-Mega', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White',
			'Lugia', 'Lunala', 'Magearna', 'Melmetal', 'Mewtwo', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Rayquaza', 'Regieleki', 'Reshiram', 'Solgaleo', 'Venusaur',
			'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom', 'Zygarde-Complete', 'Power Construct', 'Shadow Tag', 'Weakness Policy',
			'Ally Switch', 'Beat Up', 'Coaching', 'Dark Void', 'Guard Split', 'Swagger',
		],
	},
	{
		name: "[Gen 8] National Dex Monotype",
		mod: 'gen8',
		searchShow: false,
		ruleset: ['Standard NatDex', 'Same Type Clause', '!Evasion Clause', 'Evasion Moves Clause', 'Evasion Items Clause', 'Dynamax Clause'],
		banlist: [
			'Arceus', 'Blastoise-Mega', 'Blaziken', 'Blaziken-Mega', 'Calyrex-Ice', 'Calyrex-Shadow', 'Darkrai', 'Deoxys-Normal', 'Deoxys-Attack', 'Dialga', 'Dracovish', 'Dragapult',
			'Eternatus', 'Genesect', 'Gengar-Mega', 'Giratina', 'Giratina-Origin', 'Greninja-Bond', 'Greninja-Ash', 'Groudon', 'Ho-Oh', 'Hoopa-Unbound', 'Kangaskhan-Mega', 'Kartana',
			'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lucario-Mega', 'Lugia', 'Lunala', 'Magearna', 'Marshadow', 'Mawile-Mega', 'Medicham-Mega', 'Metagross-Mega', 'Mewtwo', 'Moltres-Galar',
			'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Pheromosa', 'Rayquaza', 'Reshiram', 'Salamence-Mega', 'Shaymin-Sky', 'Solgaleo', 'Spectrier',
			'Urshifu-Single-Strike', 'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom', 'Zygarde-50%', 'Zygarde-Complete', 'Battle Bond',
			'Power Construct', 'Moody', 'Shadow Tag', 'Damp Rock', 'Focus Band', 'King\'s Rock', 'Quick Claw', 'Razor Fang', 'Smooth Rock', 'Terrain Extender', 'Baton Pass',
		],
	},
	{
		name: "[Gen 8 DLC 1] National Dex AG",
		mod: 'gen8dlc1',
		searchShow: false,
		ruleset: ['Standard AG', 'NatDex Mod'],
	},

	//#endregion
];
