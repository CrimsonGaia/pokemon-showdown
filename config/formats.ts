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

	//#region IS FORMATS

	{
		section: "ISL Formats",
	},
	{
		name: "[Gen 9] ISL Regulation Set α (Baby League) Doubles",
		mod: 'gen9indigostarstorm',
		gameType: 'doubles',
		desc: `Indigo Starstorm League Regulation Set α: First-stage Pokémon only (289 Pokémon). Includes not-fully-evolved legendaries (Cosmog, Kubfu). Level 20, Bring 10 Pick 6.`,
		ruleset: [
			'Indigo Starstorm Timer', 'Indigo Starstorm Whitelist', 'First Stage Only', 'Obtainable', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod',
			'Species Clause', 'Nickname Clause', 'Item Clause', 'OHKO Clause', 'Endless Battle Clause', 'Sleep Clause',
			'Max Team Size = 10', 'Picked Team Size = 6', 'Adjust Level = 20',
		],
		unbanlist: ['Cosmog', 'Kubfu', 'Type: Null', 'Poipole'],
	},
	{
		name: "[Gen 9] ISL Regulation Set Δ (NFE League) Doubles",
		mod: 'gen9indigostarstorm',
		gameType: 'doubles',
		desc: `Indigo Starstorm League Regulation Set Δ: First-stage and second-stage Pokémon that can still evolve (380 Pokémon). Includes Cosmog, Cosmoem, Kubfu. Excludes fully evolved 2nd stage. Level 30, Bring 10 Pick 6.`,
		ruleset: [
			'Indigo Starstorm Timer', 'Indigo Starstorm Whitelist', 'First or Second Stage', 'Obtainable', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod',
			'Species Clause', 'Nickname Clause', 'Item Clause', 'OHKO Clause', 'Endless Battle Clause', 'Sleep Clause',
			'Max Team Size = 10', 'Picked Team Size = 6', 'Adjust Level = 30',
		],
		unbanlist: ['Cosmog', 'Cosmoem', 'Kubfu', 'Type: Null', 'Poipole'],
	},
	{
		name: "[Gen 9] ISL Regulation Set ι (Single-Stage Only League) Doubles",
		mod: 'gen9indigostarstorm',
		gameType: 'doubles',
		desc: `Indigo Starstorm League Regulation Set ι: Single-stage Pokémon only (52 Pokémon) - those that don't evolve and have no pre-evolutions. Examples: Ditto, Heracross, Skarmory, Rotom. Level 40, Bring 10 Pick 6.`,
		ruleset: [
			'Indigo Starstorm Timer', 'Indigo Starstorm Whitelist', 'Single Stage Only', 'Obtainable', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod',
			'Species Clause', 'Nickname Clause', 'Item Clause', 'OHKO Clause', 'Endless Battle Clause', 'Sleep Clause',
			'Max Team Size = 10', 'Picked Team Size = 6', 'Adjust Level = 40',
		],
	},
	{
		name: "[Gen 9] ISL Regulation Set β (2nd stage League) Doubles",
		mod: 'gen9indigostarstorm',
		gameType: 'doubles',
		desc: `Indigo Starstorm League Regulation Set β: First-stage, ALL second-stage (including fully evolved like Arbok, Houndoom), and single-stage Pokémon (545 Pokémon). Includes Cosmog, Cosmoem, Kubfu. Bans all 3rd stage and special categories. Level 50, Bring 10 Pick 6.`,
		ruleset: [
			'Indigo Starstorm Timer', 'Indigo Starstorm Whitelist', 'Obtainable', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod',
			'Species Clause', 'Nickname Clause', 'Item Clause', 'OHKO Clause', 'Endless Battle Clause', 'Sleep Clause',
			'Max Team Size = 10', 'Picked Team Size = 6', 'Adjust Level = 50',
		],
		banlist: ['All Third Stage', 'Legendary', 'Mythical', 'Restricted Legendary', 'Restricted Mythical', 'Paradox', 'Restricted Paradox'],
		unbanlist: ['Cosmog', 'Cosmoem', 'Kubfu', 'Type: Null', 'Poipole'],
	},
	{
		name: "[Gen 9] ISL Regulation Set ζ (Beta + Paradox League) Doubles",
		mod: 'gen9indigostarstorm',
		gameType: 'doubles',
		desc: `Indigo Starstorm League Regulation Set ζ: All Beta Pokémon plus non-Restricted Paradox (655 Pokémon). Limit 3 Paradox per team. Still bans 3rd stage, Legendary, Mythical, and Restricted Paradox. Level 60, Bring 10 Pick 6.`,
		ruleset: [
			'Indigo Starstorm Timer', 'Indigo Starstorm Whitelist', 'Paradox Allowed', 'Limit Paradox = 3', 'Obtainable', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod',
			'Species Clause', 'Nickname Clause', 'Item Clause', 'OHKO Clause', 'Endless Battle Clause', 'Sleep Clause',
			'Max Team Size = 10', 'Picked Team Size = 6', 'Adjust Level = 60',
		],
		banlist: ['All Third Stage', 'Legendary', 'Mythical', 'Restricted Legendary', 'Restricted Mythical'],
	},
	{
		name: "[Gen 9] ISL Regulation Set γ (3rd stage League) Doubles",
		mod: 'gen9indigostarstorm',
		gameType: 'doubles',
		desc: `Indigo Starstorm League Regulation Set γ: Full non-Restricted metagame (635 Pokémon). All evolution stages including 3rd stage (Venusaur, Charizard, Dragonite, etc.). Bans Restricted Legendary, Restricted Mythical, and Restricted Paradox. Level 70, Bring 10 Pick 6.`,
		ruleset: [
			'Indigo Starstorm Timer', 'Indigo Starstorm Whitelist', 'Paradox Allowed', 'Obtainable', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod',
			'Species Clause', 'Nickname Clause', 'Item Clause', 'OHKO Clause', 'Endless Battle Clause', 'Sleep Clause',
			'Max Team Size = 10', 'Picked Team Size = 6', 'Adjust Level = 70',
		],
	},
	{
		name: "[Gen 9] ISL Regulation Set Θ (no restricted Special League) Doubles",
		mod: 'gen9indigostarstorm',
		gameType: 'doubles',
		desc: `Indigo Starstorm League Regulation Set Θ: All Gamma Pokémon plus regular Legendary, Mythical, and Paradox (705 Pokémon). Includes Articuno, Zapdos, Moltres, Raikou, Entei, Suicune, Mew, Celebi, etc. Bans Restricted categories. Level 80, Bring 10 Pick 6.`,
		ruleset: [
			'Indigo Starstorm Timer', 'Indigo Starstorm Whitelist', 'Paradox Allowed', 'Obtainable', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod',
			'Species Clause', 'Nickname Clause', 'Item Clause', 'OHKO Clause', 'Endless Battle Clause', 'Sleep Clause',
			'Max Team Size = 10', 'Picked Team Size = 6', 'Adjust Level = 80',
		],
		banlist: ['Restricted Legendary', 'Restricted Mythical'],
		unbanlist: ['Legendary', 'Mythical', 'Paradox'],
	},
	{
		name: "[Gen 9] ISL Regulation Set ε (Restricted Paradox League) Doubles",
		mod: 'gen9indigostarstorm',
		gameType: 'doubles',
		desc: `Indigo Starstorm League Regulation Set ε: All Gamma Pokémon plus all 12 Restricted Paradox (709 Pokémon). Allows Flutter Mane, Iron Bundle, Roaring Moon, Iron Valiant, Koraidon, Miraidon, and DLC Paradox. Bans Restricted Legendary/Mythical. Level 90, Bring 10 Pick 6.`,
		ruleset: [
			'Indigo Starstorm Timer', 'Indigo Starstorm Whitelist', 'Paradox Allowed', 'Obtainable', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod',
			'Species Clause', 'Nickname Clause', 'Item Clause', 'OHKO Clause', 'Endless Battle Clause', 'Sleep Clause',
			'Max Team Size = 10', 'Picked Team Size = 6', 'Adjust Level = 90',
		],
		unbanlist: [
			'Flutter Mane', 'Iron Bundle', 'Roaring Moon', 'Iron Valiant', 'Koraidon', 'Miraidon', 'Walking Wake', 'Iron Leaves',
			'Gouging Fire', 'Raging Bolt', 'Iron Boulder', 'Iron Crown',
		],
	},
	{
		name: "[Gen 9] ISL Regulation Set λ (One Restricted Legend/Paradox League) Doubles",
		mod: 'gen9indigostarstorm',
		gameType: 'doubles',
		desc: `Indigo Starstorm League Regulation Set λ: All non-Mythical Pokémon (717 Pokémon). Allows up to 1 Restricted Legendary or Restricted Paradox per team (Mewtwo, Lugia, Kyogre, Dialga, Zacian, Koraidon, etc.). Bans all Mythical. Level 100, Bring 10 Pick 6.`,
		ruleset: [
			'Indigo Starstorm Timer', 'Indigo Starstorm Whitelist', 'Limit Restricted Indigo = 1', 'Obtainable', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod',
			'Species Clause', 'Nickname Clause', 'Item Clause', 'OHKO Clause', 'Endless Battle Clause', 'Sleep Clause',
			'Max Team Size = 10', 'Picked Team Size = 6', 'Adjust Level = 100',
		],
		banlist: ['Restricted Mythical', 'Mythical'],
		unbanlist: ['Legendary', 'Paradox', 'Restricted Legendary', 'Restricted Paradox'],
	},
	{
		name: "[Gen 9] ISL Regulation Set ψ (Two Restricted Legend/Paradox League) Doubles",
		mod: 'gen9indigostarstorm',
		gameType: 'doubles',
		desc: `Indigo Starstorm League Regulation Set ψ: Same as Lambda (717 Pokémon) but allows up to 2 Restricted Legendary or Restricted Paradox per team. The most powerful ISL format. Bans all Mythical. Level 100, Bring 10 Pick 6.`,
		ruleset: [
			'Indigo Starstorm Timer', 'Indigo Starstorm Whitelist', 'Limit Restricted Indigo = 2', 'Obtainable', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod',
			'Species Clause', 'Nickname Clause', 'Item Clause', 'OHKO Clause', 'Endless Battle Clause', 'Sleep Clause',
			'Max Team Size = 10', 'Picked Team Size = 6', 'Adjust Level = 100',
		],
		banlist: ['Restricted Mythical', 'Mythical'],
		unbanlist: ['Legendary', 'Paradox', 'Restricted Legendary', 'Restricted Paradox'],
	},
	{
		name: "[Gen 9] ISL Regulation Set ν (One Restricted + Mythical) Doubles",
		mod: 'gen9indigostarstorm',
		gameType: 'doubles',
		desc: `Indigo Starstorm League Regulation Set ν: Like Lambda but allows all Mythical Pokémon (733 Pokémon). Allows up to 1 Restricted (Legendary, Paradox, or Mythical) per team. Includes Mew, Celebi, Jirachi, Deoxys, Darkrai, Shaymin, and all other Mythical. Level 100, Bring 10 Pick 6.`,
		ruleset: [
			'Indigo Starstorm Timer', 'Indigo Starstorm Whitelist', 'Limit Restricted Indigo = 1', 'Obtainable', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod',
			'Species Clause', 'Nickname Clause', 'Item Clause', 'OHKO Clause', 'Endless Battle Clause', 'Sleep Clause',
			'Max Team Size = 10', 'Picked Team Size = 6', 'Adjust Level = 100',
		],
		unbanlist: ['Legendary', 'Mythical', 'Paradox', 'Restricted Legendary', 'Restricted Paradox', 'Restricted Mythical'],
	},
	{
		name: "[Gen 9] ISL Regulation Set φ (Two Restricted + Mythical) Doubles",
		mod: 'gen9indigostarstorm',
		gameType: 'doubles',
		desc: `Indigo Starstorm League Regulation Set φ: Like Psi but allows all Mythical Pokémon (733 Pokémon). Allows up to 2 Restricted (Legendary, Paradox, or Mythical) per team. The ultimate ISL format with complete freedom. Includes all Mythical including Restricted ones. Level 100, Bring 10 Pick 6.`,
		ruleset: [
			'Indigo Starstorm Timer', 'Indigo Starstorm Whitelist', 'Limit Restricted Indigo = 2', 'Obtainable', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod',
			'Species Clause', 'Nickname Clause', 'Item Clause', 'OHKO Clause', 'Endless Battle Clause', 'Sleep Clause',
			'Max Team Size = 10', 'Picked Team Size = 6', 'Adjust Level = 100',
		],
		unbanlist: ['Legendary', 'Mythical', 'Paradox', 'Restricted Legendary', 'Restricted Paradox', 'Restricted Mythical'],
	},
	//region IS CUSTOM GAMES
	{
		section: "IS Custom Game",
	},
	{
		name: "[Gen 9] Indigo Starstorm Singles",
		mod: 'gen9indigostarstorm',
		desc: `Singles format for the Indigo Starstorm mod with custom clauses.`,
		ruleset: [
			'Indigo Starstorm Timer', 'Item Reveal', 'Obtainable', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod',
			'Freeze Clause', 'Item Clause', 'Level Clause', 'Species Clause', 'Tera Clause', 'OHKO Clause', 'Endless Battle Clause', 'Sleep Clause',
		],
	},
	{
		name: "[Gen 9] Indigo Starstorm Doubles",
		mod: 'gen9indigostarstorm',
		gameType: 'doubles',
		desc: `Doubles format for the Indigo Starstorm mod with custom clauses.`,
		ruleset: [
			'Indigo Starstorm Timer', 'Item Reveal', 'Obtainable', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod',
			'Freeze Clause', 'Item Clause', 'Level Clause', 'Species Clause', 'Tera Clause', 'OHKO Clause', 'Endless Battle Clause', 'Sleep Clause',
		],
	},
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
];
