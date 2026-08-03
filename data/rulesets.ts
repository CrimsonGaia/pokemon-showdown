// Note: These are the rules that formats use
import type { Learnset } from "../sim/dex-species";
// The list of formats is stored in config/formats.js
export const Rulesets: import('../sim/dex-formats').FormatDataTable = {
	// Rulesets
	standardag: {
		effectType: 'ValidatorRule',
		name: 'Standard AG',
		desc: "The minimal ruleset for Anything Goes",
		ruleset: ['Obtainable', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Endless Battle Clause',],
	},
	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		desc: "The standard ruleset for all official Smogon singles tiers (Ubers, OU, etc.)",
		ruleset: [
			'Standard AG',
			'Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 
		],
	},
	standardnext: {
		effectType: 'ValidatorRule',
		name: 'Standard NEXT',
		desc: "The standard ruleset for the NEXT mod",
		ruleset: ['+Unreleased', 'Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'HP Percentage Mod', 'Cancel Mod',],
		banlist: ['Soul Dew'],
	},
	flatrules: {
		effectType: 'ValidatorRule',
		name: 'Flat Rules',
		desc: "The in-game Flat Rules: Adjust Level Down 50, Species Clause, Item Clause = 1, -Mythical, -Restricted Legendary, Bring 6 Pick 3-6 depending on game type.",
		ruleset: ['Obtainable', 'Team Preview', 'Species Clause', 'Nickname Clause', 'Item Clause = 1', 'Adjust Level Down = 50', 'Picked Team Size = Auto', 'Cancel Mod'],
		banlist: ['Mythical', 'Restricted Legendary', 'Greninja-Bond'],
	},
	limittworestricted: {
		effectType: 'ValidatorRule',
		name: 'Limit Two Restricted',
		desc: "Limit two restricted Pokémon (flagged with * in the rules list)",
		onValidateTeam(team) {
			const restrictedSpecies = [];
			for (const set of team) {
				const species = this.dex.species.get(set.species);
				if (this.ruleTable.isRestrictedSpecies(species)) restrictedSpecies.push(species.name);
			}
			if (restrictedSpecies.length > 2) { return [`You can only use up to two restricted Pok\u00E9mon (you have: ${restrictedSpecies.join(', ')})`]; }
		},
	},
	limitonerestricted: {
		effectType: 'ValidatorRule',
		name: 'Limit One Restricted',
		desc: "Limit one restricted Pokémon (flagged with * in the rules list)",
		onValidateTeam(team) {
			const restrictedSpecies = [];
			for (const set of team) {
				const species = this.dex.species.get(set.species);
				if (this.ruleTable.isRestrictedSpecies(species)) restrictedSpecies.push(species.name);
			}
			if (restrictedSpecies.length > 1) { return [`You can only use one restricted Pok\u00E9mon (you have: ${restrictedSpecies.join(', ')})`]; }
		},
	},
	standarddoubles: {
		effectType: 'ValidatorRule',
		name: 'Standard Doubles',
		desc: "The standard ruleset for all official Smogon doubles tiers",
		ruleset: [
			'Standard AG',
			'Species Clause', 'Nickname Clause', 'Gravity Sleep Clause',
		],
	},
	standardoms: {
		effectType: 'ValidatorRule',
		name: 'Standard OMs',
		desc: "The standard ruleset for all Smogon OMs (Almost Any Ability, STABmons, etc.)",
		ruleset: [
			'Standard AG',
			'Species Clause', 'Nickname Clause'
		],
	},
	standardnatdex: {
		effectType: 'ValidatorRule',
		name: 'Standard NatDex',
		desc: "The standard ruleset for all National Dex tiers",
		ruleset: [
			'Standard AG', 'NatDex Mod',
			'Species Clause', 'Nickname Clause', 'Sleep Clause Mod',
		],
	},
	standarddraft: {
		effectType: 'ValidatorRule',
		name: 'Standard Draft',
		desc: "The custom Draft League ruleset",
		ruleset: ['Obtainable', 'Nickname Clause', '+Unreleased', '+CAP', 'Sketch Post-Gen 7 Moves', 'Team Preview', 'Sleep Clause Mod', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod',],
		// timer: {starting: 60 * 60, grace: 0, addPerTurn: 10, maxPerTurn: 100, timeoutAutoChoose: true},
	},
	obtainable: {
		effectType: 'ValidatorRule',
		name: 'Obtainable',
		desc: "Makes sure the team is possible to obtain in-game.",
		ruleset: ['Obtainable Moves', 'Obtainable Abilities', 'Obtainable Formes', 'EV Limit = Auto', 'Obtainable Misc'],
		banlist: ['Unreleased', 'Unobtainable', 'Nonexistent'],
		// Mostly hardcoded in team-validator.ts
		onValidateTeam(team, format) {
			let kyuremCount = 0;
			let necrozmaDMCount = 0;
			let necrozmaDWCount = 0;
			let calyrexCount = 0;
			for (const set of team) {
				if (set.species === 'Kyurem-White' || set.species === 'Kyurem-Black') {
					if (kyuremCount > 0) {
						return [
							`You cannot have more than one Kyurem-Black/Kyurem-White.`,
							`(It's untradeable and you can only make one with the DNA Splicers.)`,
						];
					}
					kyuremCount++;
				}
				if (set.species === 'Necrozma-Dusk-Mane') {
					if (necrozmaDMCount > 0) {
						return [
							`You cannot have more than one Necrozma-Dusk-Mane`,
							`(It's untradeable and you can only make one with the N-Solarizer.)`,
						];
					}
					necrozmaDMCount++;
				}
				if (set.species === 'Necrozma-Dawn-Wings') {
					if (necrozmaDWCount > 0) {
						return [
							`You cannot have more than one Necrozma-Dawn-Wings`,
							`(It's untradeable and you can only make one with the N-Lunarizer.)`,
						];
					}
					necrozmaDWCount++;
				}
				if (set.species === 'Calyrex-Ice' || set.species === 'Calyrex-Shadow') {
					if (calyrexCount > 0) {
						return [
							`You cannot have more than one Calyrex-Ice/Calyrex-Shadow.`,
							`(It's untradeable and you can only make one with the Reins of Unity.)`,
						];
					}
					calyrexCount++;
				}
			}
			return [];
		},
	},
	obtainablemoves: {
		effectType: 'ValidatorRule',
		name: 'Obtainable Moves',
		desc: "Makes sure moves are learnable by the species.",
		// Hardcoded in team-validator.ts
	},
	obtainableabilities: {
		effectType: 'ValidatorRule',
		name: 'Obtainable Abilities',
		desc: "Makes sure abilities match the species.",
		// Hardcoded in team-validator.ts
	},
	obtainableformes: {
		effectType: 'ValidatorRule',
		name: 'Obtainable Formes',
		desc: "Makes sure in-battle formes only appear in-battle.",
		// Hardcoded in team-validator.ts
	},
	obtainablemisc: {
		effectType: 'ValidatorRule',
		name: 'Obtainable Misc',
		desc: "Validate all obtainability things that aren't moves/abilities (Hidden Power type, gender, IVs, events, duplicate moves).",
		// Mostly hardcoded in team-validator.ts
		onChangeSet(set) {
			const species = this.dex.species.get(set.species);
			// limit one of each move
			// repealing this will not actually let you USE multiple moves, because of a cart bug:
			// https://twitter.com/DaWoblefet/status/1396217830006132737
			if (set.moves) {
				const hasMove: { [k: string]: true } = {};
				for (const moveId of set.moves) {
					const move = this.dex.moves.get(moveId);
					const moveid = move.id;
					if (hasMove[moveid]) return [`${species.baseSpecies} has multiple copies of ${move.name}.`];
					if (moveid) hasMove[moveid] = true;
				}
			}
		},
	},
	paldeapokedex: {
		effectType: 'ValidatorRule',
		name: 'Paldea Pokedex',
		desc: "Only allows Pok&eacute;mon native to the Paldea region (SV)",
		banlist: [
			'Arcanine-Hisui', 'Avalugg-Hisui', 'Basculin-White-Striped', 'Braviary-Hisui', 'Diglett-Alola', 'Dugtrio-Alola', 'Electrode-Hisui', 'Gimmighoul-Roaming',
			'Goodra-Hisui', 'Grimer-Alola', 'Growlithe-Hisui', 'Lilligant-Hisui', 'Meowth-Alola', 'Meowth-Galar', 'Muk-Alola', 'Persian-Alola', 'Qwilfish-Hisui',
			'Raichu-Alola', 'Sliggoo-Hisui', 'Slowbro-Galar', 'Slowking-Galar', 'Slowpoke-Galar', 'Sneasel-Hisui', 'Voltorb-Hisui', 'Tauros-Base', 'Wooper-Base',
			'Zorua-Hisui', 'Zoroark-Hisui',
		],
		onValidateSet(set, format) {
			const paldeaDex = ["Sprigatito", "Floragato", "Meowscarada", "Fuecoco", "Crocalor", "Skeledirge", "Quaxly", "Quaxwell", "Quaquaval", "Lechonk", "Oinkologne", "Tarountula", "Spidops", "Nymble", "Lokix", "Hoppip", "Skiploom", "Jumpluff", "Fletchling", "Fletchinder", "Talonflame", "Pawmi", "Pawmo", "Pawmot", "Houndour", "Houndoom", "Yungoos", "Gumshoos", "Skwovet", "Greedent", "Sunkern", "Sunflora", "Kricketot", "Kricketune", "Scatterbug", "Spewpa", "Vivillon", "Combee", "Vespiquen", "Rookidee", "Corvisquire", "Corviknight", "Happiny", "Chansey", "Blissey", "Azurill", "Marill", "Azumarill", "Surskit", "Masquerain", "Buizel", "Floatzel", "Wooper", "Clodsire", "Psyduck", "Golduck", "Chewtle", "Drednaw", "Igglybuff", "Jigglypuff", "Wigglytuff", "Ralts", "Kirlia", "Gardevoir", "Gallade", "Drowzee", "Hypno", "Gastly", "Haunter", "Gengar", "Tandemaus", "Maushold", "Pichu", "Pikachu", "Raichu", "Fidough", "Dachsbun", "Slakoth", "Vigoroth", "Slaking", "Bounsweet", "Steenee", "Tsareena", "Smoliv", "Dolliv", "Arboliva", "Bonsly", "Sudowoodo", "Rockruff", "Lycanroc", "Rolycoly", "Carkol", "Coalossal", "Shinx", "Luxio", "Luxray", "Starly", "Staravia", "Staraptor", "Oricorio", "Mareep", "Flaaffy", "Ampharos", "Petilil", "Lilligant", "Shroomish", "Breloom", "Applin", "Flapple", "Appletun", "Spoink", "Grumpig", "Squawkabilly", "Misdreavus", "Mismagius", "Makuhita", "Hariyama", "Crabrawler", "Crabominable", "Salandit", "Salazzle", "Phanpy", "Donphan", "Cufant", "Copperajah", "Gible", "Gabite", "Garchomp", "Nacli", "Naclstack", "Garganacl", "Wingull", "Pelipper", "Magikarp", "Gyarados", "Arrokuda", "Barraskewda", "Basculin", "Gulpin", "Swalot", "Meowth", "Persian", "Drifloon", "Drifblim", "Flabe\u0301be\u0301", "Floette", "Florges", "Diglett", "Dugtrio", "Torkoal", "Numel", "Camerupt", "Bronzor", "Bronzong", "Axew", "Fraxure", "Haxorus", "Mankey", "Primeape", "Annihilape", "Meditite", "Medicham", "Riolu", "Lucario", "Charcadet", "Armarouge", "Ceruledge", "Barboach", "Whiscash", "Tadbulb", "Bellibolt", "Goomy", "Sliggoo", "Goodra", "Croagunk", "Toxicroak", "Wattrel", "Kilowattrel", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Sylveon", "Dunsparce", "Dudunsparce", "Deerling", "Sawsbuck", "Girafarig", "Farigiraf", "Grimer", "Muk", "Maschiff", "Mabosstiff", "Toxel", "Toxtricity", "Dedenne", "Pachirisu", "Shroodle", "Grafaiai", "Stantler", "Foongus", "Amoonguss", "Voltorb", "Electrode", "Magnemite", "Magneton", "Magnezone", "Ditto", "Growlithe", "Arcanine", "Teddiursa", "Ursaring", "Zangoose", "Seviper", "Swablu", "Altaria", "Skiddo", "Gogoat", "Tauros", "Litleo", "Pyroar", "Stunky", "Skuntank", "Zorua", "Zoroark", "Sneasel", "Weavile", "Murkrow", "Honchkrow", "Gothita", "Gothorita", "Gothitelle", "Sinistea", "Polteageist", "Mimikyu", "Klefki", "Indeedee", "Bramblin", "Brambleghast", "Toedscool", "Toedscruel", "Tropius", "Fomantis", "Lurantis", "Klawf", "Capsakid", "Scovillain", "Cacnea", "Cacturne", "Rellor", "Rabsca", "Venonat", "Venomoth", "Pineco", "Forretress", "Scyther", "Scizor", "Heracross", "Flittle", "Espathra", "Hippopotas", "Hippowdon", "Sandile", "Krokorok", "Krookodile", "Silicobra", "Sandaconda", "Mudbray", "Mudsdale", "Larvesta", "Volcarona", "Bagon", "Shelgon", "Salamence", "Tinkatink", "Tinkatuff", "Tinkaton", "Hatenna", "Hattrem", "Hatterene", "Impidimp", "Morgrem", "Grimmsnarl", "Wiglett", "Wugtrio", "Bombirdier", "Finizen", "Palafin", "Varoom", "Revavroom", "Cyclizar", "Orthworm", "Sableye", "Shuppet", "Banette", "Falinks", "Hawlucha", "Spiritomb", "Noibat", "Noivern", "Dreepy", "Drakloak", "Dragapult", "Glimmet", "Glimmora", "Rotom", "Greavard", "Houndstone", "Oranguru", "Passimian", "Komala", "Larvitar", "Pupitar", "Tyranitar", "Stonjourner", "Eiscue", "Pincurchin", "Sandygast", "Palossand", "Slowpoke", "Slowbro", "Slowking", "Shellos", "Gastrodon", "Shellder", "Cloyster", "Qwilfish", "Luvdisc", "Finneon", "Lumineon", "Bruxish", "Alomomola", "Skrelp", "Dragalge", "Clauncher", "Clawitzer", "Tynamo", "Eelektrik", "Eelektross", "Mareanie", "Toxapex", "Flamigo", "Dratini", "Dragonair", "Dragonite", "Snom", "Frosmoth", "Snover", "Abomasnow", "Delibird", "Cubchoo", "Beartic", "Snorunt", "Glalie", "Froslass", "Cryogonal", "Cetoddle", "Cetitan", "Bergmite", "Avalugg", "Rufflet", "Braviary", "Pawniard", "Bisharp", "Kingambit", "Deino", "Zweilous", "Hydreigon", "Veluza", "Dondozo", "Tatsugiri", "Great Tusk", "Scream Tail", "Brute Bonnet", "Flutter Mane", "Slither Wing", "Sandy Shocks", "Iron Treads", "Iron Bundle", "Iron Hands", "Iron Jugulis", "Iron Moth", "Iron Thorns", "Frigibax", "Arctibax", "Baxcalibur", "Gimmighoul", "Gholdengo", "Wo-Chien", "Chien-Pao", "Ting-Lu", "Chi-Yu", "Roaring Moon", "Iron Valiant", "Koraidon", "Miraidon",];
			const species = this.dex.species.get(set.species || set.name);
			if (!paldeaDex.includes(species.baseSpecies) && !paldeaDex.includes(species.name) && !this.ruleTable.has('+' + species.id)) { return [`${species.baseSpecies} is not in the Paldea Pokédex.`]; }
		},
	},
	kitakamipokedex: {
		effectType: 'ValidatorRule',
		name: 'Kitakami Pokedex',
		desc: "Only allows Pok&eacute;mon native to the Kitakami region (SV DLC1)",
		banlist: [
			'Wooper-Paldea', 'Raichu-Alola', 'Vulpix-Alola', 'Ninetales-Alola', 'Growlithe-Hisui', 'Arcanine-Hisui',
			'Geodude-Alola', 'Graveler-Alola', 'Golem-Alola', 'Sandshrew-Alola', 'Sandslash-Alola', 'Weezing-Galar',
			'Sneasel-Hisui', 'Sliggoo-Hisui', 'Goodra-Hisui', 'Basculin-Red-Striped', 'Basculin-Blue-Striped', 'Ursaluna-Base',
		],
		onValidateSet(set, format) {
			const kitakamiDex = ["Spinarak", "Ariados", "Yanma", "Yanmega", "Wooper", "Quagsire", "Poochyena", "Mightyena", "Volbeat", "Illumise", "Corphish", "Crawdaunt", "Sewaddle", "Swadloon", "Leavanny", "Cutiefly", "Ribombee", "Ekans", "Arbok", "Pichu", "Pikachu", "Raichu", "Bellsprout", "Weepinbell", "Victreebel", "Sentret", "Furret", "Starly", "Staravia", "Staraptor", "Fomantis", "Lurantis", "Applin", "Flapple", "Appletun", "Dipplin", "Vulpix", "Ninetales", "Poliwag", "Poliwhirl", "Poliwrath", "Politoed", "Magikarp", "Gyarados", "Hoothoot", "Noctowl", "Aipom", "Ambipom", "Heracross", "Swinub", "Piloswine", "Mamoswine", "Stantler", "Seedot", "Nuzleaf", "Shiftry", "Ralts", "Kirlia", "Gardevoir", "Gallade", "Kricketot", "Kricketune", "Pachirisu", "Riolu", "Lucario", "Petilil", "Lilligant", "Phantump", "Trevenant", "Rockruff", "Lycanroc", "Skwovet", "Greedent", "Toedscool", "Toedscruel", "Poltchageist", "Sinistcha", "Growlithe", "Arcanine", "Geodude", "Graveler", "Golem", "Bonsly", "Sudowoodo", "Timburr", "Gurdurr", "Conkeldurr", "Noibat", "Noivern", "Arrokuda", "Barraskewda", "Hatenna", "Hattrem", "Hatterene", "Morpeko", "Orthworm", "Tandemaus", "Maushold", "Mankey", "Primeape", "Annihilape", "Munchlax", "Snorlax", "Lotad", "Lombre", "Ludicolo", "Nosepass", "Probopass", "Shinx", "Luxio", "Luxray", "Grubbin", "Charjabug", "Vikavolt", "Oricorio", "Sandshrew", "Sandslash", "Gastly", "Haunter", "Gengar", "Gligar", "Gliscor", "Houndour", "Houndoom", "Spoink", "Grumpig", "Vullaby", "Mandibuzz", "Mudbray", "Mudsdale", "Jangmo-o", "Hakamo-o", "Kommo-o", "Bombirdier", "Koffing", "Weezing", "Mienfoo", "Mienshao", "Duskull", "Dusclops", "Dusknoir", "Chingling", "Chimecho", "Slugma", "Magcargo", "Litwick", "Lampent", "Chandelure", "Surskit", "Masquerain", "Cleffa", "Clefairy", "Clefable", "Bronzor", "Bronzong", "Glimmet", "Glimmora", "Feebas", "Milotic", "Dunsparce", "Dudunsparce", "Barboach", "Whiscash", "Gible", "Gabite", "Garchomp", "Carbink", "Salandit", "Salazzle", "Sneasel", "Weavile", "Snorunt", "Glalie", "Froslass", "Tynamo", "Eelektrik", "Eelektross", "Goomy", "Sliggoo", "Goodra", "Ducklett", "Swanna", "Chewtle", "Drednaw", "Cramorant", "Pawniard", "Bisharp", "Kingambit", "Mimikyu", "Impidimp", "Morgrem", "Grimmsnarl", "Indeedee", "Basculin", "Basculegion", "Ursaluna", "Okidogi", "Munkidori", "Fezandipiti", "Ogerpon",];
			const species = this.dex.species.get(set.species || set.name);
			if (!kitakamiDex.includes(species.baseSpecies) && !kitakamiDex.includes(species.name) && !this.ruleTable.has('+' + species.id)) { return [`${species.baseSpecies} is not in the Kitakami Pokédex.`]; }
		},
	},
	blueberrypokedex: {
		effectType: 'ValidatorRule',
		name: 'Blueberry Pokedex',
		desc: "Only allows Pok&eacute;mon native to the Blueberry Academy (SV DLC2)",
		banlist: [
			'Diglett-Base', 'Dugtrio-Base', 'Grimer-Base', 'Muk-Base', 'Slowpoke-Base', 'Slowbro-Base', 'Slowking-Base',
			'Geodude-Base', 'Graveler-Base', 'Golem-Base', 'Qwilfish-Base', 'Sandshrew-Base', 'Sandslash-Base',
			'Vulpix-Base', 'Ninetales-Base', 'Typhlosion-Hisui', 'Samurott-Hisui', 'Greninja-Bond', 'Decidueye-Hisui',
		],
		onValidateSet(set, format) {
			const blueberryDex = ["Doduo", "Dodrio", "Exeggcute", "Exeggutor", "Rhyhorn", "Rhydon", "Rhyperior", "Venonat", "Venomoth", "Elekid", "Electabuzz", "Electivire", "Magby", "Magmar", "Magmortar", "Happiny", "Chansey", "Blissey", "Scyther", "Scizor", "Kleavor", "Tauros", "Blitzle", "Zebstrika", "Girafarig", "Farigiraf", "Sandile", "Krokorok", "Krookodile", "Rellor", "Rabsca", "Rufflet", "Braviary", "Vullaby", "Mandibuzz", "Litleo", "Pyroar", "Deerling", "Sawsbuck", "Smeargle", "Rotom", "Milcery", "Alcremie", "Trapinch", "Vibrava", "Flygon", "Pikipek", "Trumbeak", "Toucannon", "Tentacool", "Tentacruel", "Horsea", "Seadra", "Kingdra", "Bruxish", "Cottonee", "Whimsicott", "Comfey", "Slakoth", "Vigoroth", "Slaking", "Oddish", "Gloom", "Vileplume", "Bellossom", "Diglett", "Dugtrio", "Grimer", "Muk", "Zangoose", "Seviper", "Crabrawler", "Crabominable", "Oricorio", "Slowpoke", "Slowbro", "Slowking", "Chinchou", "Lanturn", "Inkay", "Malamar", "Luvdisc", "Finneon", "Lumineon", "Alomomola", "Torkoal", "Fletchling", "Fletchinder", "Talonflame", "Dewpider", "Araquanid", "Tyrogue", "Hitmonlee", "Hitmonchan", "Hitmontop", "Geodude", "Graveler", "Golem", "Drilbur", "Excadrill", "Gothita", "Gothorita", "Gothitelle", "Espurr", "Meowstic", "Minior", "Cranidos", "Rampardos", "Shieldon", "Bastiodon", "Minccino", "Cinccino", "Skarmory", "Swablu", "Altaria", "Magnemite", "Magneton", "Magnezone", "Plusle", "Minun", "Scraggy", "Scrafty", "Golett", "Golurk", "Numel", "Camerupt", "Sinistea", "Polteageist", "Porygon", "Porygon2", "Porygon-Z", "Joltik", "Galvantula", "Tynamo", "Eelektrik", "Eelektross", "Beldum", "Metang", "Metagross", "Axew", "Fraxure", "Haxorus", "Seel", "Dewgong", "Lapras", "Qwilfish", "Overqwil", "Solosis", "Duosion", "Reuniclus", "Snubbull", "Granbull", "Cubchoo", "Beartic", "Sandshrew", "Sandslash", "Vulpix", "Ninetales", "Snover", "Abomasnow", "Duraludon", "Archaludon", "Hydrapple", "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise", "Chikorita", "Bayleef", "Meganium", "Cyndaquil", "Quilava", "Typhlosion", "Totodile", "Croconaw", "Feraligatr", "Treecko", "Grovyle", "Sceptile", "Torchic", "Combusken", "Blaziken", "Mudkip", "Marshtomp", "Swampert", "Turtwig", "Grotle", "Torterra", "Chimchar", "Monferno", "Infernape", "Piplup", "Prinplup", "Empoleon", "Snivy", "Servine", "Serperior", "Tepig", "Pignite", "Emboar", "Oshawott", "Dewott", "Samurott", "Chespin", "Quilladin", "Chesnaught", "Fennekin", "Braixen", "Delphox", "Froakie", "Frogadier", "Greninja", "Rowlet", "Dartrix", "Decidueye", "Litten", "Torracat", "Incineroar", "Popplio", "Brionne", "Primarina", "Grookey", "Thwackey", "Rillaboom", "Scorbunny", "Raboot", "Cinderace", "Sobble", "Drizzile", "Inteleon", "Gouging Fire", "Raging Bolt", "Iron Crown", "Iron Boulder", "Terapagos", "Walking Wake", "Iron Leaves",];
			const species = this.dex.species.get(set.species || set.name);
			if (!blueberryDex.includes(species.baseSpecies) && !blueberryDex.includes(species.name) && !this.ruleTable.has('+' + species.id)) { return [`${species.baseSpecies} is not in the Blueberry Pokédex.`]; }
		},
	},
	potd: {
		effectType: 'Rule',
		name: 'PotD',
		desc: "Forces the Pokemon of the Day onto every random team.",
		onBegin() { if (global.Config?.potd) { this.add('rule', "Pokemon of the Day: " + this.dex.species.get(Config.potd).name); } },
	},
	//region forced rules
	forcemonotype: {
		effectType: 'ValidatorRule',
		name: 'Force Monotype',
		desc: `Forces all teams to have the same type. Usage: Force Monotype = [Type], e.g. "Force Monotype = Water"`,
		hasValue: true,
		onValidateRule(value) {
			const type = this.dex.types.get(value);
			if (!type.exists) throw new Error(`Misspelled type "${value}"`);
			// Temporary hardcode until types support generations
			if ((['Dark', 'Steel'].includes(type.name) && this.dex.gen < 2) || (type.name === 'Fairy' && this.dex.gen < 6)) { throw new Error(`Invalid type "${type.name}" in Generation ${this.dex.gen}`); }
			if (type.name === 'Stellar') { throw new Error(`There are no Stellar-type Pok\u00e9mon.`); }
			return type.name;
		},
		onValidateSet(set) {
			const species = this.dex.species.get(set.species);
			const type = this.dex.types.get(this.ruleTable.valueRules.get('forcemonotype')!);
			if (!species.types.map(this.toID).includes(type.id)) { return [`${set.species} must have ${type.name} type.`]; }
		},
	},
	forceselect: {
		effectType: 'ValidatorRule',
		name: 'Force Select',
		desc: `Forces a Pokemon to be on the team and selected at Team Preview. Usage: Force Select = [Pokemon], e.g. "Force Select = Magikarp"`,
		hasValue: true,
		onValidateRule(value) { if (!this.dex.species.get(value).exists) throw new Error(`Misspelled Pokemon "${value}"`); },
		onValidateTeam(team) {
			const species = this.dex.species.get(this.ruleTable.valueRules.get('forceselect'));
			if (!team.some(set => set.species === species.name)) { return [`Your team must contain ${species.name}.`]; }
		},
		onChooseTeam(positions, pokemon, autoChoose) {
			const species = this.dex.species.get(this.ruleTable.valueRules.get('forceselect'));
			const speciesIndex = pokemon.findIndex(p => p.species.name === species.name);
			if (autoChoose) {
				positions = [speciesIndex];
				for (let i = 0; i < pokemon.length; i++) { if (i !== speciesIndex) positions.push(i); }
				return positions;
			}
			if (!positions.includes(speciesIndex)) { return `You must bring ${species.name} to the battle.`; }
		},
	},
	evlimits: {
		effectType: 'ValidatorRule',
		name: 'EV Limits',
		desc: "Require EVs to be in specific ranges, such as: \"EV Limits = Atk 0-124 / Def 100-252\"",
		hasValue: true,
		onValidateRule(value) {
			if (!value) throw new Error(`To remove EV limits, use "! EV Limits"`);
			const slashedParts = value.split('/');
			const UINT_REGEX = /^[0-9]{1,4}$/;
			return slashedParts.map(slashedPart => {
				const parts = slashedPart.replace('-', ' - ').replace(/ +/g, ' ').trim().split(' ');
				const [stat, low, hyphen, high] = parts;
				if (parts.length !== 4 || !UINT_REGEX.test(low) || hyphen !== '-' || !UINT_REGEX.test(high)) { throw new Error(`EV limits should be in the format "EV Limits = Atk 0-124 / Def 100-252"`); }
				const statid = this.dex.toID(stat) as StatID;
				if (!this.dex.stats.ids().includes(statid)) { throw new Error(`Unrecognized stat name "${stat}" in "${value}"`); }
				return `${statid} ${low}-${high}`;
			}).join(' / ');
		},
		onValidateSet(set) {
			const limits = this.ruleTable.valueRules.get('evlimits')!;
			const problems = [];
			for (const limit of limits.split(' / ')) {
				const [statid, range] = limit.split(' ') as [StatID, string];
				const [low, high] = range.split('-').map(num => parseInt(num));
				const ev = set.evs[statid];
				if (ev < low || ev > high) { problems.push(`${set.name || set.species}'s ${this.dex.stats.names[statid]} EV (${ev}) must be ${low}-${high}`); }
			}
			return problems;
		},
	},
	teampreview: {
		effectType: 'Rule',
		name: 'Team Preview',
		desc: "Allows each player to see the Pok&eacute;mon on their opponent's team before they choose their lead Pok&eacute;mon",
		onBegin() { if (this.ruleTable.has(`teratypepreview`)) { this.add('rule', 'Tera Type Preview: Tera Types are shown at Team Preview'); } },
		onTeamPreview() {
			this.add('clearpoke');
			for (const pokemon of this.getAllPokemon()) {
				let details = pokemon.details.replace(', shiny', '').replace(/(Zacian|Zamazenta)(?!-Crowned)/g, '$1-*'); // Hacked-in Crowned formes will be revealed
				if (!this.ruleTable.has('speciesrevealclause')) { details = details.replace(/(Greninja|Gourgeist|Pumpkaboo|Xerneas|Silvally|Urshifu|Dudunsparce)(-[a-zA-Z?-]+)?/g, '$1-*'); }
				this.add('poke', pokemon.side.id, details, '');
			}
			if (this.ruleTable.has(`teratypepreview`)) {
				for (const side of this.sides) {
					let buf = ``;
					for (const pokemon of side.pokemon) {
						buf += buf ? ` / ` : `raw|${side.name}'s Tera Types:<br />`;
						buf += `<psicon pokemon="${pokemon.species.id}" /><psicon type="${pokemon.teraType}" />`;
					}
					this.add(`${buf}`);
				}
			}
			this.makeRequest('teampreview');
		},
	},
	teratypepreview: {
		effectType: 'Rule',
		name: 'Tera Type Preview',
		desc: "Allows each player to see the Tera Type of the Pok&eacute;mon on their opponent's team before they choose their lead Pok&eacute;mon",
		onValidateRule() { if (!this.ruleTable.has('teampreview')) { throw new Error(`The "Tera Type Preview" rule${this.ruleTable.blame('teratypepreview')} requires Team Preview.`); } },
		// implemented in team preview
	},
	timerstarting: { // hardcoded in server/room-battle.ts
		effectType: 'Rule',
		name: 'Timer Starting',
		desc: "Amount of time given at the start of the battle in seconds",
		hasValue: 'positive-integer',
	},
	dctimer: { // hardcoded in server/room-battle.ts
		effectType: 'Rule',
		name: 'DC Timer',
		desc: "Enables or disables the disconnection timer",
	},
	dctimerbank: { // hardcoded in server/room-battle.ts
		effectType: 'Rule',
		name: 'DC Timer Bank',
		desc: "Enables or disables the disconnection timer bank",
	},
	timergrace: { // hardcoded in server/room-battle.ts
		effectType: 'Rule',
		name: 'Timer Grace',
		desc: "Grace period between timer activation and when total time starts ticking down.",
		hasValue: 'positive-integer',
	},
	timeraddperturn: { // hardcoded in server/room-battle.ts
		effectType: 'Rule',
		name: 'Timer Add Per Turn',
		desc: "Amount of additional time given per turn in seconds",
		hasValue: 'integer',
	},
	timermaxperturn: { // hardcoded in server/room-battle.ts
		effectType: 'Rule',
		name: 'Timer Max Per Turn',
		desc: "Maximum amount of time allowed per turn in seconds",
		hasValue: 'positive-integer',
	},
	timermaxfirstturn: { // hardcoded in server/room-battle.ts
		effectType: 'Rule',
		name: 'Timer Max First Turn',
		desc: "Maximum amount of time allowed for the first turn in seconds",
		hasValue: 'positive-integer',
	},
	timeoutautochoose: { // hardcoded in server/room-battle.ts
		effectType: 'Rule',
		name: 'Timeout Auto Choose',
		desc: "Enables or disables automatic selection of moves when a player times out",
	},
	timeraccelerate: { // hardcoded in server/room-battle.ts
		effectType: 'Rule',
		name: 'Timer Accelerate',
		desc: "Enables or disables timer acceleration",
	},
	vgctimer: {
		effectType: 'Rule',
		name: 'VGC Timer',
		desc: "VGC's timer: 90 second Team Preview, 7 minutes Your Time, 1 minute per turn",
		ruleset: [
			'Timer Starting = 420', 'Timer Grace = 90',
			'Timer Add Per Turn = 0', 'Timer Max Per Turn = 55', 'Timer Max First Turn = 90',
			'Timeout Auto Choose', 'DC Timer Bank',
		],
	},
	speciesclause: {
		effectType: 'ValidatorRule',
		name: 'Species Clause',
		desc: "Prevents teams from having more than one Pok&eacute;mon from the same species",
		onBegin() { this.add('rule', 'Species Clause: Limit one of each Pokémon'); },
		onValidateTeam(team, format) {
			const speciesTable = new Set<number>();
			for (const set of team) {
				const species = this.dex.species.get(set.species);
				if (speciesTable.has(species.num)) { return [`You are limited to one of each Pokémon by Species Clause.`, `(You have more than one ${species.baseSpecies})`]; }
				speciesTable.add(species.num);
			}
		},
	},
	nicknameclause: { // Illegality of impersonation of other species is hardcoded in team-validator.js, so we are done.
		effectType: 'ValidatorRule',
		name: 'Nickname Clause',
		desc: "Prevents teams from having more than one Pok&eacute;mon with the same nickname",
		onValidateTeam(team, format) {
			const nameTable = new Set<string>();
			for (const set of team) {
				const name = set.name;
				if (name) {
					if (name === this.dex.species.get(set.species).baseSpecies) continue;
					if (nameTable.has(name)) { return [`Your Pokémon must have different nicknames.`, `(You have more than one ${name})`]; }
					nameTable.add(name);
				}
			}
		},
	},
	itemclause: {
		effectType: 'ValidatorRule',
		name: 'Item Clause',
		desc: "Prevents teams from having more than one Pok&eacute;mon with the same item",
		hasValue: 'positive-integer',
		onBegin() { this.add('rule', `Item Clause: Limit ${this.ruleTable.valueRules.get('itemclause') || 1} of each item`); },
		onValidateRule(value) {
			const num = Number(value);
			if (num < 1 || num > this.ruleTable.maxTeamSize) { throw new Error(`Item Clause must be between 1 and ${this.ruleTable.maxTeamSize}.`); }
			return value;
		},
		onValidateTeam(team) {
			const itemTable = new this.dex.Multiset<string>();
			for (const set of team) {
				const item = this.toID(set.item);
				if (!item) continue;
				itemTable.add(item);
			}
			const itemLimit = Number(this.ruleTable.valueRules.get('itemclause') || 1);
			for (const [itemid, num] of itemTable) {
				if (num <= itemLimit) continue;
				return [
					`You are limited to ${itemLimit} of each item by Item Clause.`,
					`(You have more than ${itemLimit} ${this.dex.items.get(itemid).name})`,
				];
			}
		},
	},
	endlessbattleclause: {
		effectType: 'Rule',
		name: 'Endless Battle Clause',
		desc: "Prevents players from forcing a battle which their opponent cannot end except by forfeit",
		// implemented in sim/battle.js, see https://dex.pokemonshowdown.com/articles/battlerules#endlessbattleclause for the specification.
		onBegin() { this.add('rule', 'Endless Battle Clause: Forcing endless battles is banned'); },
	},
	notfullyevolved: {
		effectType: 'ValidatorRule',
		name: 'Not Fully Evolved',
		desc: "Bans Pok&eacute;mon that are fully evolved or can't evolve",
		onValidateSet(set) {
			const species = this.dex.species.get(set.species);
			if (!species.nfe) { return [set.species + " cannot evolve."]; }
		},
	},
	hppercentagemod: {
		effectType: 'Rule',
		name: 'HP Percentage Mod',
		desc: "Shows the HP of Pok&eacute;mon in percentages",
		onBegin() {
			this.add('rule', 'HP Percentage Mod: HP is shown in percentages');
			this.reportPercentages = true;
		},
	},
	exacthpmod: {
		effectType: 'Rule',
		name: 'Exact HP Mod',
		desc: "Shows the exact HP of all Pok&eacute;mon",
		onBegin() {
			this.add('rule', 'Exact HP Mod: Exact HP is shown');
			this.reportExactHP = true;
		},
	},
	cancelmod: {
		effectType: 'Rule',
		name: 'Cancel Mod',
		desc: "Allows players to change their own choices before their opponents make one",
		onBegin() { this.supportCancel = true; },
	},
	switchpriorityclausemod: {
		effectType: 'Rule',
		name: 'Switch Priority Clause Mod',
		desc: "Makes a faster Pokémon switch first when double-switching, unlike in Emerald link battles, where player 1's Pokémon would switch first",
		onBegin() { this.add('rule', 'Switch Priority Clause Mod: Faster Pokémon switch first'); },
	},
	desyncclausemod: {
		effectType: 'Rule',
		name: 'Desync Clause Mod',
		desc: 'If a desync would happen, the move fails instead. This rule currently covers Bide, Counter, and Psywave.',
		onBegin() { this.add('rule', 'Desync Clause Mod: Desyncs changed to move failure.'); },
		// Hardcoded in gen1/moves.ts
		// Can't be disabled (no precedent for how else to handle desyncs)
	},
	deoxyscamouflageclause: {
		effectType: 'Rule',
		name: 'Deoxys Camouflage Clause',
		desc: "Reveals the Deoxys forme when it is sent in battle.",
		// Hardcoded into effect, cannot be disabled.
		onBegin() { this.add('rule', 'Deoxys Camouflage Clause: Reveals the Deoxys forme when it is sent in battle.'); },
	},
	sametypeclause: {
		effectType: 'ValidatorRule',
		name: 'Same Type Clause',
		desc: "Forces all Pok&eacute;mon on a team to share a type with each other",
		onBegin() {
			this.add('rule', 'Same Type Clause: Pokémon in a team must share a type');
		},
		onValidateTeam(team) {
			let typeTable: string[] = [];
			for (const [i, set] of team.entries()) {
				let species = this.dex.species.get(set.species);
				if (!species.types) return [`Invalid pokemon ${set.name || set.species}`];
				if (i === 0) { typeTable = species.types; } 
				else { typeTable = typeTable.filter(type => species.types.includes(type)); }
				const item = this.dex.items.get(set.item);
				if (item.megaStone?.[species.name]) {
					species = this.dex.species.get(item.megaStone[species.name]);
					typeTable = typeTable.filter(type => species.types.includes(type));
				}
				if (item.id === "ultranecroziumz" && species.baseSpecies === "Necrozma") {
					species = this.dex.species.get("Necrozma-Ultra");
					typeTable = typeTable.filter(type => species.types.includes(type));
				}
				if (!typeTable.length) return [`Your team must share a type.`];
			}
			for (const set of team) { if (this.gen === 9 && set.teraType && !typeTable.includes(set.teraType) && this.ruleTable.has(`enforcesameteratype`)) { return [`${set.species}'s Tera Type must match the team's type.`]; } }
		},
	},
	enforcesameteratype: { // implemented in sametypeclause
		effectType: 'ValidatorRule',
		name: 'Enforce Same Tera Type',
		desc: "Forces Pok&eacute;mon to have a Tera Type matching one of their original types.",
	},
	megarayquazaclause: {
		effectType: 'Rule',
		name: 'Mega Rayquaza Clause',
		desc: "Prevents Rayquaza from mega evolving",
		onBegin() {
			this.add('rule', 'Mega Rayquaza Clause: You cannot mega evolve Rayquaza');
			for (const pokemon of this.getAllPokemon()) {
				if (pokemon.species.id === 'rayquaza') {
					pokemon.canMegaEvo = null;
					// ability to terastal was determined before the clause activated, causing incorrect behavior
					if (!this.ruleTable.has('terastalclause')) { pokemon.canTerastallize = this.actions.canTerastallize(pokemon); }
				}
			}
		},
	},
	terastalclause: {
		effectType: 'Rule',
		name: 'Terastal Clause',
		desc: "Prevents Pok&eacute;mon from Terastallizing",
		onBegin() {
			for (const pokemon of this.getAllPokemon()) { pokemon.canTerastallize = null; }
			this.add('rule', 'Terastal Clause: You cannot Terastallize');
		},
	},
	//region inverse
	inversemod: {
		effectType: 'Rule',
		name: 'Inverse Mod',
		desc: "The mod for Inverse Battle which inverts the type effectiveness chart; weaknesses become resistances, while resistances and immunities become weaknesses",
		onNegateImmunity: false,
		onBegin() { this.add('rule', 'Inverse Mod: Weaknesses become resistances, while resistances and immunities become weaknesses.'); },
		onEffectivenessPriority: 1,
		onEffectiveness(typeMod, target, type, move) {
			if (move && !this.dex.getImmunity(move, type)) return 1;
			if (typeMod) return -typeMod; // Ignore normal effectiveness, prevents bug with Tera Shell
		},
	},
	nfeclause: {
		effectType: 'ValidatorRule',
		name: 'NFE Clause',
		desc: "Bans all NFE Pokemon",
		onValidateSet(set) {
			const species = this.dex.species.get(set.species || set.name);
			if (species.nfe) {
				if (this.ruleTable.has(`+pokemon:${species.id}`)) return;
				return [`${set.species} is banned due to NFE Clause.`];
			}
		},
	},
	formeclause: {
		effectType: 'ValidatorRule',
		name: 'Forme Clause',
		desc: "Prevents teams from having more than one Pok&eacute;mon of the same forme",
		onBegin() { this.add('rule', 'Forme Clause: Limit one of each forme of a Pokémon'); },
		onValidateTeam(team) {
			const formeTable = new Set<string>();
			for (const set of team) {
				let species = this.dex.species.get(set.species);
				if (species.name !== species.baseSpecies) {
					const baseSpecies = this.dex.species.get(species.baseSpecies);
					if ( species.types.join('/') === baseSpecies.types.join('/') && Object.values(species.baseStats).join('/') === Object.values(baseSpecies.baseStats).join('/')) { species = baseSpecies; }
				}
				if (formeTable.has(species.name)) {
					return [
						`You are limited to one of each forme of a Pokémon by Forme Clause.`,
						`(You have more than one of ${species.name})`,
					];
				}
				formeTable.add(species.name);
			}
		},
	},
	teamtypepreview: {
		effectType: 'Rule',
		name: 'Team Type Preview',
		desc: "Allows each player to see the Pok&eacute;mon on their opponent's team and those Pok&eacute;mon's types before they choose their lead Pok&eacute;mon",
		onTeamPreview() {
			this.add('clearpoke');
			for (const side of this.sides) {
				for (const pokemon of side.pokemon) {
					const details = pokemon.details.replace(', shiny', '').replace(/(Arceus|Greninja|Gourgeist|Pumpkaboo|Silvally|Urshifu)(-[a-zA-Z?-]+)?/g, '$1-*');
					this.add('poke', pokemon.side.id, details, '');
				}
				let buf = 'raw|';
				for (const pokemon of side.pokemon) {
					if (!buf.endsWith('|')) buf += '/</span>&#8203;';
					buf += `<span style="white-space:nowrap"><psicon pokemon="${pokemon.species.id}" />`;
					for (const type of pokemon.species.types) { buf += `<psicon type="${type}" /> `; }
				}
				this.add(`${buf}</span>`);
			}
			this.makeRequest('teampreview');
		},
	},
	pickedteamsize: { // hardcoded in sim/side and sim/battle
		effectType: 'Rule',
		name: 'Picked Team Size',
		desc: "Team size (number of pokemon) that can be brought out of Team Preview",
		hasValue: 'positive-integer',
	},
	minteamsize: { // hardcoded in sim/team-validator
		effectType: 'ValidatorRule',
		name: "Min Team Size",
		desc: "Minimum team size (number of pokemon) that can be brought into Team Preview (or into the battle, in formats without Team Preview)",
		hasValue: 'positive-integer',
	},
	evlimit: { // hardcoded in sim/team-validator
		effectType: 'ValidatorRule',
		name: "EV Limit",
		desc: "Maximum total EVs on each pokemon.",
		hasValue: 'integer',
	},
	maxteamsize: { // hardcoded in sim/team-validator
		effectType: 'ValidatorRule',
		name: "Max Team Size",
		desc: "Maximum team size (number of pokemon) that can be brought into Team Preview (or into the battle, in formats without Team Preview)",
		hasValue: 'positive-integer',
	},
	maxmovecount: { // hardcoded in sim/team-validator
		effectType: 'ValidatorRule',
		name: "Max Move Count",
		desc: "Max number of moves allowed on a single pokemon (defaults to 4 in a normal game)",
		hasValue: 'positive-integer',
	},
	minlevel: { // hardcoded in sim/team-validator
		effectType: 'ValidatorRule',
		name: 'Min Level',
		desc: "Minimum level of brought Pokémon",
		hasValue: 'positive-integer',
	},
	maxlevel: { // hardcoded in sim/team-validator
		effectType: 'ValidatorRule',
		name: 'Max Level',
		desc: "Maximum level of brought Pokémon (if you're using both this and Adjust Level, this will control what level moves you have access to)",
		hasValue: 'positive-integer',
	},
	defaultlevel: { // hardcoded in sim/team-validator
		effectType: 'ValidatorRule',
		name: 'Default Level',
		desc: "Default level of brought Pokémon (normally should be equal to Max Level, except Custom Games have a very high max level but still default to 100)",
		hasValue: 'positive-integer',
	},
	adjustlevel: { // hardcoded in sim/team-validator
		effectType: 'ValidatorRule',
		name: 'Adjust Level',
		desc: "All Pokémon will be set to exactly this level (but unlike Max Level and Min Level, it will still be able to learn moves from above this level) (when using this, Max Level is the level of the pokemon before it's level-adjusted down)",
		hasValue: 'positive-integer',
		mutuallyExclusiveWith: 'adjustleveldown',
	},
	adjustleveldown: { // hardcoded in sim/team-validator
		effectType: 'ValidatorRule',
		name: 'Adjust Level Down',
		desc: "Any Pokémon above this level will be set to this level (but unlike Max Level, it will still be able to learn moves from above this level)",
		hasValue: 'positive-integer',
		mutuallyExclusiveWith: 'adjustlevel',
	},
	nc2000movelegality: { // Implemented in mods/gen2/rulesets.ts
		effectType: 'ValidatorRule',
		name: "NC 2000 Move Legality",
		desc: "Prevents Pok\u00e9mon from having moves that would only be obtainable in Pok\u00e9mon Crystal.",
	},
	nc1997movelegality: { // Implemented in mods/gen1jpn/rulesets.ts
		effectType: 'ValidatorRule',
		name: "NC 1997 Move Legality",
		desc: "Bans move combinations on Pok\u00e9mon that weren't legal in NC 1997.",
	},
	godlygiftmod: {
		effectType: 'Rule',
		name: "Godly Gift Mod",
		onValidateTeam(team) {
			const gods = new Set<string>();
			for (const set of team) {
				let species = this.dex.species.get(set.species);
				if (typeof species.battleOnly === 'string') species = this.dex.species.get(species.battleOnly);
				if ((species.baseSpecies === 'Zamazenta' && this.toID(set.item) === 'rustedshield') || (species.baseSpecies === 'Zacian' && this.toID(set.item) === 'rustedsword')) { species = this.dex.species.get(`${species.baseSpecies}-Crowned`); }
				if (set.item) {
					const item = this.dex.items.get(set.item);
					if (item.megaStone?.[species.name]) { species = this.dex.species.get(item.megaStone[species.name]); }
				}
				if (this.ruleTable.isRestrictedSpecies(species) || (this.ruleTable.isRestricted('ability:powerconstruct') && this.toID(set.ability) === 'powerconstruct')) { gods.add(species.name); }
			}
			if (gods.size > 1) { return [`You have too many Gods.`, `(${Array.from(gods).join(', ')} are Gods.)`]; }
		},
		onModifySpeciesPriority: 3,
		onModifySpecies(species, target, source) {
			if (source || !target?.side) return;
			const god = target.side.team.find(set => {
				let godSpecies = this.dex.species.get(set.species);
				if (this.toID(set.ability) === 'powerconstruct' && this.ruleTable.isRestricted('ability:powerconstruct')) { return true; }
				if (set.item) {
					const item = this.dex.items.get(set.item);
					if (item.megaStone?.[set.species]) { godSpecies = this.dex.species.get(item.megaStone[set.species]); }
					if (["Zacian", "Zamazenta"].includes(godSpecies.baseSpecies) && item.id.startsWith('rusted')) { godSpecies = this.dex.species.get(set.species + "-Crowned"); }
				}
				const isGod = this.ruleTable.isRestrictedSpecies(godSpecies);
				return isGod;
			}) || target.side.team[0];
			const stat = Dex.stats.ids()[target.side.team.indexOf(target.set)];
			const newSpecies = this.dex.deepClone(species);
			let godSpecies = this.dex.species.get(god.species);
			if (typeof godSpecies.battleOnly === 'string') {
				godSpecies = this.dex.species.get(godSpecies.battleOnly);
			}
			newSpecies.bst -= newSpecies.baseStats[stat];
			newSpecies.baseStats[stat] = godSpecies.baseStats[stat];
			if (this.gen === 1 && (stat === 'spa' || stat === 'spd')) { newSpecies.baseStats['spa'] = newSpecies.baseStats['spd'] = godSpecies.baseStats[stat]; }
			newSpecies.bst += newSpecies.baseStats[stat];
			return newSpecies;
		},
	},
	hackmonsformelegality: {
		effectType: 'ValidatorRule',
		name: "Hackmons Forme Legality",
		desc: `Enforces proper forme legality for hackmons-based metagames.`,
		banlist: ['CAP', 'Future'],
		onChangeSet(set, format, setHas, teamHas) {
			let species = this.dex.species.get(set.species);
			if ((species.natDexTier === 'Illegal' || species.forme.includes('Totem')) && !['Eevee-Starter', 'Floette-Eternal', 'Greninja-Ash', 'Pikachu-Starter', 'Xerneas-Neutral'].includes(species.name) && !this.ruleTable.has(`+pokemon:${species.id}`)) { return [`${species.name} is illegal.`]; }
			const problemPokemon = this.dex.species.all().filter(s => ((s.name === 'Xerneas' || s.battleOnly || s.forme === 'Eternamax') && !(s.isMega || s.isPrimal || ['Greninja-Ash', 'Necrozma-Ultra'].includes(s.name)) && !(this.ruleTable.has(`+pokemon:${s.id}`) || this.ruleTable.has(`+basepokemon:${this.toID(s.baseSpecies)}`))));
			if (problemPokemon.includes(species)) {
				if (species.requiredItem && this.toID(set.item) !== this.toID(species.requiredItem)) { return [`${set.name ? `${set.name} (${species.name})` : species.name} is required to hold ${species.requiredItem}.`]; }
				if (species.requiredMove && !set.moves.map(this.toID).includes(this.toID(species.requiredMove))) { return [`${set.name ? `${set.name} (${species.name})` : species.name} is required to have ${species.requiredMove}.`]; }
				set.species = (species.id === 'xerneas' ? 'Xerneas-Neutral' : species.id === 'zygardecomplete' ? 'Zygarde' : species.battleOnly) as string;
				species = this.dex.species.get(set.species);
			}
			for (const moveid of set.moves) {
				const move = this.dex.moves.get(moveid);
				if (move.isNonstandard && move.isNonstandard !== 'Unobtainable' && !this.ruleTable.has(`+move:${move.id}`)) { return [`${move.name} is illegal.`]; }
			}
			const item = this.dex.items.get(set.item);
			if (item.isNonstandard && item.isNonstandard !== 'Unobtainable' && !this.ruleTable.has(`+item:${item.id}`)) { return [`${item.name} is illegal.`]; }
			if (species.baseSpecies === 'Xerneas' && this.toID(set.ability) !== 'fairyaura') { return [`${set.name ? `${set.name} (${species.name})` : species.name} is ability-locked into Fairy Aura.`]; }
		},
	},
	speciesrevealclause: {
		effectType: 'Rule',
		name: 'Species Reveal Clause',
		desc: "Reveals a Pok&eacute;mon's true species in hackmons-based metagames.",
		// Hardcoded into effect, cannot be disabled, ties into team preview
		onBegin() { this.add('rule', 'Species Reveal Clause: Reveals a Pok\u00e9mon\'s true species in hackmons-based metagames.'); },
	},
	bestof: {
		effectType: 'ValidatorRule',
		name: 'Best Of',
		desc: "Allows players to define a best-of series where the winner of the series is the winner of the majority of games.",
		hasValue: 'positive-integer',
		onValidateRule(value) {
			const num = Number(value);
			if (num > 9 || num < 3 || num % 2 !== 1) { throw new Error("Series length must be an odd number between three and nine (inclusive)."); }
			if (!['singles', 'doubles'].includes(this.format.gameType)) { throw new Error("Only single and doubles battles can be a Best-of series."); }
			return value;
		},
	},
	illusionlevelmod: {
		effectType: 'Rule',
		name: "Illusion Level Mod",
		desc: `Changes the Illusion ability to disguise the Pok&eacute;mon's level instead of leaking it.`,
		onBegin() { this.add('rule', "Illusion Level Mod: Illusion disguises the Pok\u00e9mon's true level"); },
		// Implemented in Pokemon#getDetails
	},
	twisteddimensionmod: {
		effectType: 'Rule',
		name: "Twisted Dimension Mod",
		desc: `The effects of Trick Room are always active, using Trick Room reverts the field to normal for 5 turns.`,
		// implemented in Pokemon#getActionSpeed()
	},
	mixandmegaoldaggronite: {
		effectType: 'Rule',
		name: "Mix and Mega Old Aggronite",
		desc: `Causes Aggronite to no longer give the Steel type in Mix and Mega.`,
		// implemented in mods/mixandmega/scripts.ts
	},
	datapreview: {
		effectType: 'Rule',
		name: 'Data Preview',
		desc: 'When a new Pokémon switches in for the first time, information about its types, stats and Abilities is displayed to both players.',
		onSwitchIn(pokemon) {
			const species = pokemon.illusion?.species || pokemon.species;
			const gen = this.gen;
			if (pokemon.illusion) { pokemon.m.revealed = false; }
			// Recreation of Chat.getDataPokemonHTML
			let buf = '<li class="result">';
			buf += `<span class="col numcol">${species.tier}</span> `;
			buf += `<span class="col iconcol"><psicon pokemon="${species.id}"/></span> `;
			buf += `<span class="col pokemonnamecol" style="white-space:nowrap"><a href="https://${Config.routes.dex}/pokemon/${species.id}" target="_blank">${species.name}</a></span> `;
			buf += '<span class="col typecol">';
			if (species.types) { for (const type of species.types) { buf += `<img src="https://${Config.routes.client}/sprites/types/${type}.png" alt="${type}" height="14" width="32">`; } }
			buf += '</span> ';
			if (gen >= 3) {
				buf += '<span style="float:left;min-height:26px">';
				if (species.abilities['1'] && (gen >= 4 || Dex.abilities.get(species.abilities['1']).gen === 3)) { buf += `<span class="col twoabilitycol">${species.abilities['0']}<br />${species.abilities['1']}</span>`; } 
				else { buf += `<span class="col abilitycol">${species.abilities['0']}</span>`; }
				if (species.abilities['H'] && species.abilities['S']) { buf += `<span class="col twoabilitycol${species.unreleasedHidden ? ' unreleasedhacol' : ''}"><em>${species.abilities['H']}<br />(${species.abilities['S']})</em></span>`; } 
				else if (species.abilities['H']) { buf += `<span class="col abilitycol${species.unreleasedHidden ? ' unreleasedhacol' : ''}"><em>${species.abilities['H']}</em></span>`; } 
				else if (species.abilities['S']) { buf += `<span class="col abilitycol"><em>(${species.abilities['S']})</em></span>`; } // special case for Zygarde
				else { buf += '<span class="col abilitycol"></span>'; }
				buf += '</span>';
			}
			buf += '<span style="float:left;min-height:26px">';
			buf += `<span class="col statcol"><em>HP</em><br />${species.baseStats.hp}</span> `;
			buf += `<span class="col statcol"><em>Atk</em><br />${species.baseStats.atk}</span> `;
			buf += `<span class="col statcol"><em>Def</em><br />${species.baseStats.def}</span> `;
			if (gen <= 1) { buf += `<span class="col statcol"><em>Spc</em><br />${species.baseStats.spa}</span> `; } 
			else {
				buf += `<span class="col statcol"><em>SpA</em><br />${species.baseStats.spa}</span> `;
				buf += `<span class="col statcol"><em>SpD</em><br />${species.baseStats.spd}</span> `;
			}
			buf += `<span class="col statcol"><em>Spe</em><br />${species.baseStats.spe}</span> `;
			buf += `<span class="col bstcol"><em>BST<br />${species.bst}</em></span> `;
			buf += '</span>';
			buf += '</li>';
			buf = `<div class="message"><ul class="utilichart">${buf}<li style="clear:both"></li></ul></div>`;
			this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
			this.add(`raw|${buf}`);
		},
		onDamagingHit(damage, target, source, move) {
			if (target.hasAbility('illusion') && !target.m.revealed) {
				const species = target.species;
				const gen = this.gen;
				// Recreation of Chat.getDataPokemonHTML
				let buf = '<li class="result">';
				buf += `<span class="col numcol">${species.tier}</span> `;
				buf += `<span class="col iconcol"><psicon pokemon="${species.id}"/></span> `;
				buf += `<span class="col pokemonnamecol" style="white-space:nowrap"><a href="https://${Config.routes.dex}/pokemon/${species.id}" target="_blank">${species.name}</a></span> `;
				buf += '<span class="col typecol">';
				if (species.types) { for (const type of species.types) { buf += `<img src="https://${Config.routes.client}/sprites/types/${type}.png" alt="${type}" height="14" width="32">`; } }
				buf += '</span> ';
				if (gen >= 3) {
					buf += '<span style="float:left;min-height:26px">';
					if (species.abilities['1'] && (gen >= 4 || Dex.abilities.get(species.abilities['1']).gen === 3)) { buf += `<span class="col twoabilitycol">${species.abilities['0']}<br />${species.abilities['1']}</span>`; } 
					else { buf += `<span class="col abilitycol">${species.abilities['0']}</span>`; }
					if (species.abilities['H'] && species.abilities['S']) { buf += `<span class="col twoabilitycol${species.unreleasedHidden ? ' unreleasedhacol' : ''}"><em>${species.abilities['H']}<br />(${species.abilities['S']})</em></span>`; } 
					else if (species.abilities['H']) { buf += `<span class="col abilitycol${species.unreleasedHidden ? ' unreleasedhacol' : ''}"><em>${species.abilities['H']}</em></span>`; } 
					else if (species.abilities['S']) { buf += `<span class="col abilitycol"><em>(${species.abilities['S']})</em></span>`; } // special case for Zygarde
					else { buf += '<span class="col abilitycol"></span>'; }
					buf += '</span>';
				}
				buf += '<span style="float:left;min-height:26px">';
				buf += `<span class="col statcol"><em>HP</em><br />${species.baseStats.hp}</span> `;
				buf += `<span class="col statcol"><em>Atk</em><br />${species.baseStats.atk}</span> `;
				buf += `<span class="col statcol"><em>Def</em><br />${species.baseStats.def}</span> `;
				if (gen <= 1) { buf += `<span class="col statcol"><em>Spc</em><br />${species.baseStats.spa}</span> `; } 
				else {
					buf += `<span class="col statcol"><em>SpA</em><br />${species.baseStats.spa}</span> `;
					buf += `<span class="col statcol"><em>SpD</em><br />${species.baseStats.spd}</span> `;
				}
				buf += `<span class="col statcol"><em>Spe</em><br />${species.baseStats.spe}</span> `;
				buf += `<span class="col bstcol"><em>BST<br />${species.bst}</em></span> `;
				buf += '</span>';
				buf += '</li>';
				buf = `<div class="message"><ul class="utilichart">${buf}<li style="clear:both"></li></ul></div>`;
				this.add('-start', target, 'typechange', target.getTypes(true).join('/'), '[silent]');
				this.add(`raw|${buf}`);
				target.m.revealed = true;
			}
		},
	},
	allowtradeback: { // Implemented in team-validator.js
		effectType: 'ValidatorRule',
		name: 'Allow Tradeback',
		desc: "Allows Gen 1 pokemon to have moves from their Gen 2 learnsets",
	},
	lgpenormalrules: { // AVs implemented in TeamValidator#validateStats
		effectType: 'ValidatorRule',
		name: 'LGPE Normal Rules',
		desc: "Tells formats with the 'gen7letsgo' mod to set the level to 50 and all Awakening Values to 0",
		ruleset: ['Adjust Level = 50'],
	},
	mimicglitch: { // Implemented in sim/team-validator.ts
		effectType: 'ValidatorRule',
		name: 'Mimic Glitch',
		desc: "Allows any Pokemon with access to Assist, Copycat, Metronome, Mimic, or Transform to gain access to almost any other move.",
	},
	overflowstatmod: { // Implemented in sim/battle.ts
		effectType: 'Rule',
		name: 'Overflow Stat Mod',
		desc: "Caps stats at 654 after a positive nature, or 655 after a negative nature",
	},
	//#region Indigo Starstorm Rulesets
	minsourcegen: {
		effectType: 'ValidatorRule',
		name: "Min Source Gen",
		desc: "Pokemon must be obtained from this generation or later.",
		hasValue: 'positive-integer',
		onValidateRule(value) {
			const minSourceGen = parseInt(value);
			// console.log(this.ruleTable);
			if (minSourceGen > this.dex.gen) { throw new Error(`Invalid generation ${minSourceGen}${this.ruleTable.blame('minsourcegen')} for a Gen ${this.dex.gen} format (${this.format.name})`); }
		},
	},
	'sketchpostgen7moves': { // Implemented in sim/team-validator.ts
		effectType: 'ValidatorRule',
		name: 'Sketch Post-Gen 7 Moves',
		desc: "Allows Pokémon who learn Sketch to learn any Gen 8+ move (normally, Sketch is not usable in Gen 8 or Gen 9 Pre-DLC2).",
	},
	indigostarstormtimer: { // Timer settings are handled by the client/server
		effectType: 'ValidatorRule',
		name: 'Indigo Starstorm Timer',
		desc: "15 sec Team Preview / 20 min Your Time / 30 sec per turn",
		onBegin() { this.add('rule', 'Indigo Starstorm Timer: 15s Team Preview, 20min Your Time, 30s per turn'); },
	},
	limitrestrictedindigo: {
		effectType: 'ValidatorRule',
		name: 'Limit Restricted Indigo',
		desc: "Limit the combined count of Restricted Legendary, Restricted Mythical, and Restricted Paradox Pokémon on a team (for Indigo Starstorm formats)",
		hasValue: 'positive-integer',
		onBegin() {
			const limit = this.ruleTable.valueRules.get('limitrestrictedindigo');
			this.add('rule', `Limit Restricted Indigo: Up to ${limit} Restricted Pokémon (Legendary/Mythical/Paradox combined)`);
		},
		onValidateRule(value) {
			const num = Number(value);
			if (num < 0 || num > this.ruleTable.maxTeamSize) { throw new Error(`Limit Restricted Indigo must be between 0 and ${this.ruleTable.maxTeamSize}.`); }
			return value;
		},
		onValidateTeam(team) {
			const restrictedPokemon = [];
			for (const set of team) {
				const species = this.dex.species.get(set.species);
				const tags = species.tags || [];
				if (tags.includes('Restricted Legendary') || tags.includes('Restricted Mythical') || tags.includes('Restricted Paradox')) { restrictedPokemon.push(species.name); }
			}
			const limit = Number(this.ruleTable.valueRules.get('limitrestrictedindigo') ?? 0);
			if (restrictedPokemon.length > limit) {
				return [
					`You are limited to ${limit} Restricted Pokémon by Limit Restricted Indigo.`,
					`(You have: ${restrictedPokemon.join(', ')})`,
				];
			}
		},
	},
	indigowhitelistnotransfer: {
		effectType: 'ValidatorRule',
		name: 'Indigo Whitelist No Transfer',
		desc: "Only allows Pokémon that are available in Scarlet/Violet (Paldea, Kitakami, or Blueberry dex) without transfer, or are Indigo Starstorm custom Pokémon",
		onValidateSet(set) {
			const species = this.dex.species.get(set.species || set.name);
			if (species.num >= 10000) return;
			const svDex = [
				// Paldea Dex
				"Sprigatito", "Floragato", "Meowscarada", "Fuecoco", "Crocalor", "Skeledirge", "Quaxly", "Quaxwell", "Quaquaval", "Lechonk", "Oinkologne", "Tarountula", "Spidops", "Nymble", "Lokix", "Hoppip", "Skiploom", "Jumpluff", "Fletchling", "Fletchinder", "Talonflame", "Pawmi", "Pawmo", "Pawmot", "Houndour", "Houndoom", "Yungoos", "Gumshoos", "Skwovet", "Greedent", "Sunkern", "Sunflora", "Kricketot", "Kricketune", "Scatterbug", "Spewpa", "Vivillon", "Combee", "Vespiquen", "Rookidee", "Corvisquire", "Corviknight", "Happiny", "Chansey", "Blissey", "Azurill", "Marill", "Azumarill", "Surskit", "Masquerain", "Buizel", "Floatzel", "Wooper", "Clodsire", "Psyduck", "Golduck", "Chewtle", "Drednaw", "Igglybuff", "Jigglypuff", "Wigglytuff", "Ralts", "Kirlia", "Gardevoir", "Gallade", "Drowzee", "Hypno", "Gastly", "Haunter", "Gengar", "Tandemaus", "Maushold", "Pichu", "Pikachu", "Raichu", "Fidough", "Dachsbun", "Slakoth", "Vigoroth", "Slaking", "Bounsweet", "Steenee", "Tsareena", "Smoliv", "Dolliv", "Arboliva", "Bonsly", "Sudowoodo", "Rockruff", "Lycanroc", "Rolycoly", "Carkol", "Coalossal", "Shinx", "Luxio", "Luxray", "Starly", "Staravia", "Staraptor", "Oricorio", "Mareep", "Flaaffy", "Ampharos", "Petilil", "Lilligant", "Shroomish", "Breloom", "Applin", "Flapple", "Appletun", "Dipplin", "Spoink", "Grumpig", "Squawkabilly", "Misdreavus", "Mismagius", "Makuhita", "Hariyama", "Crabrawler", "Crabominable", "Salandit", "Salazzle", "Phanpy", "Donphan", "Cufant", "Copperajah", "Gible", "Gabite", "Garchomp", "Nacli", "Naclstack", "Garganacl", "Wingull", "Pelipper", "Magikarp", "Gyarados", "Arrokuda", "Barraskewda", "Basculin", "Gulpin", "Swalot", "Meowth", "Persian", "Drifloon", "Drifblim", "Flabébé", "Floette", "Florges", "Diglett", "Dugtrio", "Torkoal", "Numel", "Camerupt", "Bronzor", "Bronzong", "Axew", "Fraxure", "Haxorus", "Mankey", "Primeape", "Annihilape", "Meditite", "Medicham", "Riolu", "Lucario", "Charcadet", "Armarouge", "Ceruledge", "Barboach", "Whiscash", "Tadbulb", "Bellibolt", "Goomy", "Sliggoo", "Goodra", "Croagunk", "Toxicroak", "Wattrel", "Kilowattrel", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Sylveon", "Dunsparce", "Dudunsparce", "Deerling", "Sawsbuck", "Girafarig", "Farigiraf", "Grimer", "Muk", "Maschiff", "Mabosstiff", "Toxel", "Toxtricity", "Dedenne", "Pachirisu", "Shroodle", "Grafaiai", "Stantler", "Foongus", "Amoonguss", "Voltorb", "Electrode", "Magnemite", "Magneton", "Magnezone", "Ditto", "Growlithe", "Arcanine", "Teddiursa", "Ursaring", "Zangoose", "Seviper", "Swablu", "Altaria", "Skiddo", "Gogoat", "Tauros", "Litleo", "Pyroar", "Stunky", "Skuntank", "Zorua", "Zoroark", "Sneasel", "Weavile", "Murkrow", "Honchkrow", "Gothita", "Gothorita", "Gothitelle", "Sinistea", "Polteageist", "Mimikyu", "Klefki", "Indeedee", "Bramblin", "Brambleghast", "Toedscool", "Toedscruel", "Tropius", "Fomantis", "Lurantis", "Klawf", "Capsakid", "Scovillain", "Cacnea", "Cacturne", "Rellor", "Rabsca", "Venonat", "Venomoth", "Pineco", "Forretress", "Scyther", "Scizor", "Kleavor", "Heracross", "Flittle", "Espathra", "Hippopotas", "Hippowdon", "Sandile", "Krokorok", "Krookodile", "Silicobra", "Sandaconda", "Mudbray", "Mudsdale", "Larvesta", "Volcarona", "Bagon", "Shelgon", "Salamence", "Tinkatink", "Tinkatuff", "Tinkaton", "Hatenna", "Hattrem", "Hatterene", "Impidimp", "Morgrem", "Grimmsnarl", "Wiglett", "Wugtrio", "Bombirdier", "Finizen", "Palafin", "Varoom", "Revavroom", "Cyclizar", "Orthworm", "Sableye", "Shuppet", "Banette", "Falinks", "Hawlucha", "Spiritomb", "Noibat", "Noivern", "Dreepy", "Drakloak", "Dragapult", "Glimmet", "Glimmora", "Rotom", "Greavard", "Houndstone", "Oranguru", "Passimian", "Komala", "Larvitar", "Pupitar", "Tyranitar", "Stonjourner", "Eiscue", "Pincurchin", "Sandygast", "Palossand", "Slowpoke", "Slowbro", "Slowking", "Shellos", "Gastrodon", "Shellder", "Cloyster", "Qwilfish", "Luvdisc", "Finneon", "Lumineon", "Bruxish", "Alomomola", "Skrelp", "Dragalge", "Clauncher", "Clawitzer", "Tynamo", "Eelektrik", "Eelektross", "Mareanie", "Toxapex", "Flamigo", "Dratini", "Dragonair", "Dragonite", "Snom", "Frosmoth", "Snover", "Abomasnow", "Delibird", "Cubchoo", "Beartic", "Snorunt", "Glalie", "Froslass", "Cryogonal", "Cetoddle", "Cetitan", "Bergmite", "Avalugg", "Rufflet", "Braviary", "Pawniard", "Bisharp", "Kingambit", "Deino", "Zweilous", "Hydreigon", "Veluza", "Dondozo", "Tatsugiri", "Great Tusk", "Scream Tail", "Brute Bonnet", "Flutter Mane", "Slither Wing", "Sandy Shocks", "Iron Treads", "Iron Bundle", "Iron Hands", "Iron Jugulis", "Iron Moth", "Iron Thorns", "Frigibax", "Arctibax", "Baxcalibur", "Gimmighoul", "Gholdengo", "Wo-Chien", "Chien-Pao", "Ting-Lu", "Chi-Yu", "Roaring Moon", "Iron Valiant", "Koraidon", "Miraidon",
				// Kitakami Dex 
				"Spinarak", "Ariados", "Yanma", "Yanmega", "Quagsire", "Poochyena", "Mightyena", "Volbeat", "Illumise", "Corphish", "Crawdaunt", "Sewaddle", "Swadloon", "Leavanny", "Cutiefly", "Ribombee", "Ekans", "Arbok", "Bellsprout", "Weepinbell", "Victreebel", "Sentret", "Furret", "Aipom", "Ambipom", "Swinub", "Piloswine", "Mamoswine", "Seedot", "Nuzleaf", "Shiftry", "Phantump", "Trevenant", "Timburr", "Gurdurr", "Conkeldurr", "Munchlax", "Snorlax", "Lotad", "Lombre", "Ludicolo", "Nosepass", "Probopass", "Grubbin", "Charjabug", "Vikavolt", "Sandshrew", "Sandslash", "Gligar", "Gliscor", "Vullaby", "Mandibuzz", "Jangmo-o", "Hakamo-o", "Kommo-o", "Koffing", "Weezing", "Mienfoo", "Mienshao", "Duskull", "Dusclops", "Dusknoir", "Chingling", "Chimecho", "Slugma", "Magcargo", "Litwick", "Lampent", "Chandelure", "Cleffa", "Clefairy", "Clefable", "Feebas", "Milotic", "Carbink", "Ducklett", "Swanna", "Cramorant", "Basculegion", "Ursaluna", "Okidogi", "Munkidori", "Fezandipiti", "Ogerpon", "Poltchageist", "Sinistcha", "Overqwil",
				// Blueberry Dex 
				"Doduo", "Dodrio", "Exeggcute", "Exeggutor", "Rhyhorn", "Rhydon", "Rhyperior", "Elekid", "Electabuzz", "Electivire", "Magby", "Magmar", "Magmortar", "Blitzle", "Zebstrika", "Smeargle", "Milcery", "Alcremie", "Trapinch", "Vibrava", "Flygon", "Pikipek", "Trumbeak", "Toucannon", "Tentacool", "Tentacruel", "Horsea", "Seadra", "Kingdra", "Cottonee", "Whimsicott", "Comfey", "Oddish", "Gloom", "Vileplume", "Bellossom", "Inkay", "Malamar", "Dewpider", "Araquanid", "Tyrogue", "Hitmonlee", "Hitmonchan", "Hitmontop", "Geodude", "Graveler", "Golem", "Drilbur", "Excadrill", "Espurr", "Meowstic", "Minior", "Cranidos", "Rampardos", "Shieldon", "Bastiodon", "Minccino", "Cinccino", "Skarmory", "Plusle", "Minun", "Scraggy", "Scrafty", "Golett", "Golurk", "Porygon", "Porygon2", "Porygon-Z", "Joltik", "Galvantula", "Beldum", "Metang", "Metagross", "Seel", "Dewgong", "Lapras", "Solosis", "Duosion", "Reuniclus", "Snubbull", "Granbull", "Vulpix", "Ninetales", "Duraludon", "Archaludon", "Hydrapple", "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise", "Chikorita", "Bayleef", "Meganium", "Cyndaquil", "Quilava", "Typhlosion", "Totodile", "Croconaw", "Feraligatr", "Treecko", "Grovyle", "Sceptile", "Torchic", "Combusken", "Blaziken", "Mudkip", "Marshtomp", "Swampert", "Turtwig", "Grotle", "Torterra", "Chimchar", "Monferno", "Infernape", "Piplup", "Prinplup", "Empoleon", "Snivy", "Servine", "Serperior", "Tepig", "Pignite", "Emboar", "Oshawott", "Dewott", "Samurott", "Chespin", "Quilladin", "Chesnaught", "Fennekin", "Braixen", "Delphox", "Froakie", "Frogadier", "Greninja", "Rowlet", "Dartrix", "Decidueye", "Litten", "Torracat", "Incineroar", "Popplio", "Brionne", "Primarina", "Grookey", "Thwackey", "Rillaboom", "Scorbunny", "Raboot", "Cinderace", "Sobble", "Drizzile", "Inteleon", "Gouging Fire", "Raging Bolt", "Iron Crown", "Iron Boulder", "Terapagos", "Walking Wake", "Iron Leaves",
				// Starstorm Dex new mons
				"Obductit", "Obductrio", "Extraterrestrio", "Miltank-Paldea", "Probovine", "Pareinnha", "Hydranero", 
				// Starstorm Dex returning mons
				"Nidoran-F", "Nidorina", "Nidoqueen", "Nidoran-M", "Nidorino", "Nidoking", "Marowak-Alola", "Staryu", "Starmie", "Smoochum", "Jynx", "Onix", "Steelix", "Mantyke", "Mantine", "Aron", "Lairon", "Aggron", "Lunatone", "Solrock", "Baltoy", "Claydol", "Lileep", "Cradily", "Anorith", "Armaldo", "Budew", "Roselia", "Roserade", "Mr. Mime-Galar", "Mr. Rime", "Carnivine", "Audino", "Venipede", "Whirlipede", "Scolipede", "Yamask", "Yamask-Galar", "Cofagrigus", "Runerigus", "Trubbish", "Garbodor", "Vanillite", "Vanillish", "Vanilluxe", "Emolga", "Karrablast", "Escavalier", "Frillish", "Jellicent", "Ferroseed", "Ferrothorn", "Klink", "Klang", "Klinklang", "Shelmet", "Accelgor", "Genesect", "Binacle", "Barbaracle", "Bunnelby", "Diggersby", "Honedge", "Doublade", "Aegislash", "Heloptile", "Heliolisk", "Drampa", "Wimpod", "Golisopod", "Type Null", "Sylvally", "Blipbug", "Dottler", "Orbeetle", "Wooloo", "Dubwool", "Sizzlipede", "Centiskorch", "Clobbopus", "Grapploct",
			];
			if (!svDex.includes(species.baseSpecies) && !svDex.includes(species.name)) { return [set.species + " is not available in Indigo Starstorm."]; }
		},
		onBegin() { this.add('rule', 'Indigo Whitelist No Transfer: Only Scarlet/Violet and custom Pokémon allowed'); },
	},
	indigostarstormwhitelist: {
		effectType: 'ValidatorRule',
		name: 'Indigo Starstorm Whitelist',
		desc: "Only allows Pokémon that are available in Scarlet/Violet (including HOME transfers) or are Indigo Starstorm custom Pokémon",
		onValidateSet(set) {
			const species = this.dex.species.get(set.species || set.name);
			if (species.num >= 10000 || species.num < 0) return;
			const svDex = [
				"Abomasnow", "Aipom", "Alcremie", "Alomomola", "Altaria", "Ambipom", "Amoonguss", "Ampharos", "Annihilape", "Appletun", "Applin", "Araquanid", "Arbok", "Arboliva", "Arcanine", "Arceus", "Archaludon", "Arctibax", "Ariados", "Armarouge", "Arrokuda", "Articuno", "Avalugg", "Axew", "Azelf", "Azumarill", "Azurill", "Bagon", "Banette", "Barboach", "Barraskewda", "Basculegion", "Basculin", "Bastiodon", "Baxcalibur", "Bayleef", "Beartic", "Beldum", "Bellibolt", "Bellossom", "Bellsprout", "Bergmite", "Bisharp", "Blastoise", "Blaziken", "Blissey", "Blitzle", "Bombirdier", "Bonsly", "Bounsweet", "Braixen", "Brambleghast", "Bramblin", "Braviary", "Breloom", "Brionne", "Bronzong", "Bronzor", "Brute Bonnet", "Bruxish", "Buizel", "Bulbasaur", "Cacnea", "Cacturne", "Calyrex", "Camerupt", "Capsakid", "Carbink", "Carkol", "Ceruledge", "Cetitan", "Cetoddle", "Chandelure", "Chansey", "Charcadet", "Charizard", "Charjabug", "Charmander", "Charmeleon", "Chesnaught", "Chespin", "Chewtle", "Chien-Pao", "Chikorita", "Chimchar", "Chimecho", "Chinchou", "Chingling", "Chi-Yu", "Cinccino", "Cinderace", "Clauncher", "Clawitzer", "Clefable", "Clefairy", "Cleffa", "Clodsire", "Cloyster", "Coalossal", "Cobalion", "Combee", "Combusken", "Comfey", "Conkeldurr", "Copperajah", "Corphish", "Corviknight", "Corvisquire", "Cosmoem", "Cosmog", "Cottonee", "Crabominable", "Crabrawler", "Cramorant", "Cranidos", "Crawdaunt", "Cresselia", "Croagunk", "Crocalor", "Croconaw", "Cryogonal", "Cubchoo", "Cufant", "Cutiefly", "Cyclizar", "Cyndaquil", "Dachsbun", "Darkrai", "Dartrix", "Decidueye", "Dedenne", "Deerling", "Deino", "Delibird", "Delphox", "Deoxys", "Dewgong", "Dewott", "Dewpider", "Dialga", "Diancie", "Diglett", "Dipplin", "Ditto", "Dodrio", "Doduo", "Dolliv", "Dondozo", "Donphan", "Dragalge", "Dragapult", "Dragonair", "Dragonite", "Drakloak", "Dratini", "Drednaw", "Dreepy", "Drifblim", "Drifloon", "Drilbur", "Drizzile", "Drowzee", "Ducklett", "Dudunsparce", "Dugtrio", "Dunsparce", "Duosion", "Duraludon", "Dusclops", "Dusknoir", "Duskull", "Eelektrik", "Eelektross", "Eevee", "Eiscue", "Ekans", "Electabuzz", "Electivire", "Electrode", "Elekid", "Emboar", "Empoleon", "Enamorus", "Entei", "Espathra", "Espeon", "Espurr", "Eternatus", "Excadrill", "Exeggcute", "Exeggutor", "Falinks", "Farigiraf", "Feebas", "Fennekin", "Feraligatr", "Fezandipiti", "Fidough", "Finizen", "Finneon", "Flaaffy", "Flabébé", "Flamigo", "Flapple", "Flareon", "Fletchinder", "Fletchling", "Flittle", "Floatzel", "Floette", "Floragato", "Florges", "Flutter Mane", "Flygon", "Fomantis", "Foongus", "Forretress", "Fraxure", "Frigibax", "Froakie", "Frogadier", "Froslass", "Frosmoth", "Fuecoco", "Furret", "Gabite", "Gallade", "Galvantula", "Garchomp", "Gardevoir", "Garganacl", "Gastly", "Gastrodon", "Gengar", "Geodude", "Gholdengo", "Gible", "Gimmighoul", "Girafarig", "Giratina", "Glaceon", "Glalie", "Glastrier", "Gligar", "Glimmet", "Glimmora", "Gliscor", "Gloom", "Gogoat", "Golduck", "Golem", "Golett", "Golurk", "Goodra", "Goomy", "Gothita", "Gothitelle", "Gothorita", "Gouging Fire", "Grafaiai", "Granbull", "Graveler", "Great Tusk", "Greavard", "Greedent", "Greninja", "Grimer", "Grimmsnarl", "Grookey", "Grotle", "Groudon", "Grovyle", "Growlithe", "Grubbin", "Grumpig", "Gulpin", "Gumshoos", "Gurdurr", "Gyarados", "Hakamo-o", "Happiny", "Hariyama", "Hatenna", "Hatterene", "Hattrem", "Haunter", "Hawlucha", "Haxorus", "Heatran", "Heracross", "Hippopotas", "Hippowdon", "Hitmonchan", "Hitmonlee", "Hitmontop", "Honchkrow", "Ho-Oh", "Hoopa", "Hoothoot", "Hoppip", "Horsea", "Houndoom", "Houndour", "Houndstone", "Hydrapple", "Hydreigon", "Hypno", "Igglybuff", "Illumise", "Impidimp", "Incineroar", "Indeedee", "Infernape", "Inkay", "Inteleon", "Iron Boulder", "Iron Bundle", "Iron Crown", "Iron Hands", "Iron Jugulis", "Iron Leaves", "Iron Moth", "Iron Thorns", "Iron Treads", "Iron Valiant", "Ivysaur", "Jangmo-o", "Jigglypuff", "Jirachi", "Jolteon", "Joltik", "Jumpluff", "Keldeo", "Kilowattrel", "Kingambit", "Kingdra", "Kirlia", "Klawf", "Kleavor", "Klefki", "Koffing", "Komala", "Kommo-o", "Koraidon", "Kricketot", "Kricketune", "Krokorok", "Krookodile", "Kubfu", "Kyogre", "Kyurem", "Lampent", "Landorus", "Lanturn", "Lapras", "Larvesta", "Larvitar", "Latias", "Latios", "Leafeon", "Leavanny", "Lechonk", "Lilligant", "Litleo", "Litten", "Litwick", "Lokix", "Lombre", "Lotad", "Lucario", "Ludicolo", "Lugia", "Lumineon", "Lunala", "Lurantis", "Luvdisc", "Luxio", "Luxray", "Lycanroc", "Mabosstiff", "Magby", "Magcargo", "Magearna", "Magikarp", "Magmar", "Magmortar", "Magnemite", "Magneton", "Magnezone", "Makuhita", "Malamar", "Mamoswine", "Manaphy", "Mandibuzz", "Mankey", "Mareanie", "Mareep", "Marill", "Marshtomp", "Maschiff", "Masquerain", "Maushold", "Medicham", "Meditite", "Meganium", "Meloetta", "Meowscarada", "Meowstic", "Meowth", "Mesprit", "Metagross", "Metang", "Mew", "Mewtwo", "Mienfoo", "Mienshao", "Mightyena", "Milcery", "Milotic", "Mimikyu", "Minccino", "Minior", "Minun", "Miraidon", "Misdreavus", "Mismagius", "Moltres", "Monferno", "Morgrem", "Morpeko", "Mudbray", "Mudkip", "Mudsdale", "Muk", "Munchlax", "Munkidori", "Murkrow", "Nacli", "Naclstack", "Necrozma", "Ninetales", "Noctowl", "Noibat", "Noivern", "Nosepass", "Numel", "Nuzleaf", "Nymble", "Oddish", "Ogerpon", "Oinkologne", "Okidogi", "Oranguru", "Oricorio", "Orthworm", "Oshawott", "Overqwil", "Pachirisu", "Palafin", "Palkia", "Palossand", "Passimian", "Pawmi", "Pawmo", "Pawmot", "Pawniard", "Pecharunt", "Pelipper", "Perrserker", "Persian", "Petilil", "Phanpy", "Phantump", "Phione", "Pichu", "Pignite", "Pikachu", "Pikipek", "Piloswine", "Pincurchin", "Pineco", "Piplup", "Plusle", "Politoed", "Poliwag", "Poliwhirl", "Poliwrath", "Poltchageist", "Polteageist", "Poochyena", "Popplio", "Porygon", "Porygon2", "Porygon-Z", "Primarina", "Primeape", "Prinplup", "Probopass", "Psyduck", "Pupitar", "Pyroar", "Quagsire", "Quaquaval", "Quaxly", "Quaxwell", "Quilava", "Quilladin", "Qwilfish", "Raboot", "Rabsca", "Raging Bolt", "Raichu", "Raikou", "Ralts", "Rampardos", "Rayquaza", "Regice", "Regidrago", "Regieleki", "Regigigas", "Regirock", "Registeel", "Rellor", "Reshiram", "Reuniclus", "Revavroom", "Rhydon", "Rhyhorn", "Rhyperior", "Ribombee", "Rillaboom", "Riolu", "Roaring Moon", "Rockruff", "Rolycoly", "Rookidee", "Rotom", "Rowlet", "Rufflet", "Sableye", "Salamence", "Salandit", "Salazzle", "Samurott", "Sandaconda", "Sandile", "Sandshrew", "Sandslash", "Sandygast", "Sandy Shocks", "Sawsbuck", "Scatterbug", "Sceptile", "Scizor", "Scorbunny", "Scovillain", "Scrafty", "Scraggy", "Scream Tail", "Scyther", "Seadra", "Seedot", "Seel", "Sentret", "Serperior", "Servine", "Seviper", "Sewaddle", "Shaymin", "Shelgon", "Shellder", "Shellos", "Shieldon", "Shiftry", "Shinx", "Shroodle", "Shroomish", "Shuppet", "Silicobra", "Sinistcha", "Sinistea", "Skarmory", "Skeledirge", "Skiddo", "Skiploom", "Skrelp", "Skuntank", "Skwovet", "Slaking", "Slakoth", "Sliggoo", "Slither Wing", "Slowbro", "Slowking", "Slowpoke", "Slugma", "Smeargle", "Smoliv", "Sneasel", "Sneasler", "Snivy", "Snom", "Snorlax", "Snorunt", "Snover", "Snubbull", "Sobble", "Solgaleo", "Solosis", "Spectrier", "Spewpa", "Spidops", "Spinarak", "Spiritomb", "Spoink", "Sprigatito", "Squawkabilly", "Squirtle", "Stantler", "Staraptor", "Staravia", "Starly", "Steenee", "Stonjourner", "Stunky", "Sudowoodo", "Suicune", "Sunflora", "Sunkern", "Surskit", "Swablu", "Swadloon", "Swalot", "Swampert", "Swanna", "Swinub", "Sylveon", "Tadbulb", "Talonflame", "Tandemaus", "Tarountula", "Tatsugiri", "Tauros", "Teddiursa", "Tentacool", "Tentacruel", "Tepig", "Terapagos", "Terrakion", "Thundurus", "Thwackey", "Timburr", "Ting-Lu", "Tinkatink", "Tinkaton", "Tinkatuff", "Toedscool", "Toedscruel", "Torchic", "Torkoal", "Tornadus", "Torracat", "Torterra", "Totodile", "Toucannon", "Toxapex", "Toxel", "Toxicroak", "Toxtricity", "Trapinch", "Treecko", "Trevenant", "Tropius", "Trumbeak", "Tsareena", "Turtwig", "Tynamo", "Typhlosion", "Tyranitar", "Tyrogue", "Umbreon", "Ursaluna", "Ursaring", "Urshifu", "Uxie", "Vaporeon", "Varoom", "Veluza", "Venomoth", "Venonat", "Venusaur", "Vespiquen", "Vibrava", "Victreebel", "Vigoroth", "Vikavolt", "Vileplume", "Virizion", "Vivillon", "Volbeat", "Volcanion", "Volcarona", "Voltorb", "Vullaby", "Vulpix", "Walking Wake", "Wartortle", "Wattrel", "Weavile", "Weepinbell", "Weezing", "Whimsicott", "Whiscash", "Wigglytuff", "Wiglett", "Wingull", "Wo-Chien", "Wooper", "Wugtrio", "Wyrdeer", "Yanma", "Yanmega", "Yungoos", "Zacian", "Zamazenta", "Zangoose", "Zapdos", "Zarude", "Zebstrika", "Zekrom", "Zoroark", "Zorua", "Zweilous",
			// Starstorm Dex additions
				"Obductit", "Obductrio", "Extraterrestrio", "Miltank-Paldea", "Probovine", "Pareinnha", "Hydranero", 
			// Starstorm Dex returning mons
				"Nidoran-F", "Nidorina", "Nidoqueen", "Nidoran-M", "Nidorino", "Nidoking", "Marowak-Alola", "Staryu", "Starmie", "Smoochum", "Jynx", "Onix", "Steelix", "Mantyke", "Mantine", "Aron", "Lairon", "Aggron", "Lunatone", "Solrock", "Baltoy", "Claydol", "Lileep", "Cradily", "Anorith", "Armaldo", "Budew", "Roselia", "Roserade", "Mr. Mime-Galar", "Mr. Rime", "Carnivine", "Audino", "Venipede", "Whirlipede", "Scolipede", "Yamask", "Yamask-Galar", "Cofagrigus", "Runerigus", "Trubbish", "Garbodor", "Vanillite", "Vanillish", "Vanilluxe", "Emolga", "Karrablast", "Escavalier", "Frillish", "Jellicent", "Ferroseed", "Ferrothorn", "Klink", "Klang", "Klinklang", "Shelmet", "Accelgor", "Genesect", "Binacle", "Barbaracle", "Bunnelby", "Diggersby", "Honedge", "Doublade", "Aegislash", "Heloptile", "Heliolisk", "Drampa", "Wimpod", "Golisopod", "Type Null", "Sylvally", "Blipbug", "Dottler", "Orbeetle", "Wooloo", "Dubwool", "Sizzlipede", "Centiskorch", "Clobbopus", "Grapploct",

			];
			if (!svDex.includes(species.baseSpecies) && !svDex.includes(species.name)) { return [set.species + " is not available in Pokémon Scarlet/Violet."]; }
		},
		onBegin() { this.add('rule', 'Indigo Starstorm Whitelist: Only Indigo Starstorm Pokémon allowed (including SV HOME transfers)'); },
	},
	firststageonly: {
		effectType: 'ValidatorRule',
		name: 'First Stage Only',
		desc: "Only allows Pokémon that can evolve and are the first stage in their evolution line",
		onValidateSet(set) {
			const species = this.dex.species.get(set.species || set.name);
			// Exclude CAP Pokémon
			if (species.tags && species.tags.includes('CAP' as any)) { return [set.species + " is not allowed (CAP Pokémon)."]; }
			if (species.prevo && this.dex.species.get(species.prevo).gen <= this.gen) { return [set.species + " isn't the first in its evolution family."]; }
			// Check if species can evolve (has nfe property OR has evos array with entries)
			const canEvolve = species.nfe || (species.evos && species.evos.length > 0);
			if (!canEvolve) { return [set.species + " doesn't have an evolution family."]; }
		},
		onBegin() { this.add('rule', 'First Stage Only: Only first-stage Pokémon that can evolve are allowed'); },
	},
	secondstageonly: {
		effectType: 'ValidatorRule',
		name: 'Second Stage Only',
		desc: "Only allows Pokémon that are second stage and can still evolve further",
		onValidateSet(set) {
			const species = this.dex.species.get(set.species || set.name);
			// Exclude CAP Pokémon
			if (species.tags && species.tags.includes('CAP' as any)) { return [set.species + " is not allowed (CAP Pokémon)."]; }
			// Must have a pre-evolution
			if (!species.prevo || this.dex.species.get(species.prevo).gen > this.gen) { return [set.species + " is not a second stage Pokémon."]; }
			// Must be able to evolve further
			const canEvolve = species.nfe || (species.evos && species.evos.length > 0);
			if (!canEvolve) { return [set.species + " cannot evolve further."]; }
		},
		onBegin() { this.add('rule', 'Second Stage Only: Only second-stage Pokémon that can still evolve are allowed'); },
	},
	allsecondstage: {
		effectType: 'ValidatorRule',
		name: 'All Second Stage',
		desc: "Only allows Pokémon that are second stage (have a pre-evolution)",
		onValidateSet(set) {
			const species = this.dex.species.get(set.species || set.name);
			if (species.tags && species.tags.includes('CAP' as any)) { return [set.species + " is not allowed (CAP Pokémon)."]; }
			if (species.tags) {
				const specialTags = ['Restricted Legendary', 'Mythical', 'Paradox', 'Sub-Legendary'];
				for (const tag of specialTags) { if (species.tags.includes(tag as any)) { return [set.species + " is not allowed (special category: " + tag + ")."]; } }
			}
			if (!species.prevo || this.dex.species.get(species.prevo).gen > this.gen) { return [set.species + " is not a second stage Pokémon."]; }
		},
		onBegin() {
			this.add('rule', 'All Second Stage: Only second-stage Pokémon are allowed');
		},
	},
	allthirdstage: {
		effectType: 'ValidatorRule',
		name: 'All Third Stage',
		desc: "Only allows Pokémon that are third stage (have two pre-evolutions in their line)",
		onValidateSet(set) {
			const species = this.dex.species.get(set.species || set.name);
			// Must have a pre-evolution
			if (!species.prevo) return [set.species + " is not a third stage Pokémon."];
			// That pre-evolution must also have a pre-evolution
			const prevoSpecies = this.dex.species.get(species.prevo);
			if (!prevoSpecies.prevo || prevoSpecies.prevo === species.name) {
				return [set.species + " is not a third stage Pokémon."];
			}
		},
		onBegin() {
			this.add('rule', 'All Third Stage: Only third-stage Pokémon are allowed');
		},
	},
	firstorsecondstage: {
		effectType: 'ValidatorRule',
		name: 'First or Second Stage',
		desc: "Only allows Pokémon that are first or second stage and can still evolve",
		onValidateSet(set) {
			const species = this.dex.species.get(set.species || set.name);
			if (species.tags && species.tags.includes('CAP' as any)) { return [set.species + " is not allowed (CAP Pokémon)."]; }
			// Special exception for Phione
			if (species.name === 'Phione') return;
			// Check if species can evolve (has nfe property OR has evos array with entries)
			const canEvolve = species.nfe || (species.evos && species.evos.length > 0);
			if (!canEvolve) { return [set.species + " cannot evolve further."]; }
		},
		onBegin() {
			this.add('rule', 'First or Second Stage: Only Pokémon that can still evolve are allowed');
		},
	},
	singlestageonly: {
		effectType: 'ValidatorRule',
		name: 'Single Stage Only',
		desc: "Only allows Pokémon that do not evolve and have no pre-evolutions, excluding special categories",
		onValidateSet(set) {
			const species = this.dex.species.get(set.species || set.name);
			// Special exceptions for gender-locked Pokémon that cannot evolve
			// Male Combee and Male Salandit cannot evolve (only females can)
			if ((species.name === 'Combee' || species.name === 'Salandit') && set.gender === 'M') {
				return; // Allow male Combee/Salandit
			}
			// Exclude special categories (Legendary, Mythical, Paradox, Sub-Legendary, CAP)
			if (species.tags) {
				const specialTags = ['Restricted Legendary', 'Mythical', 'Paradox', 'Sub-Legendary', 'CAP'];
				for (const tag of specialTags) {
					if (species.tags.includes(tag as any)) {
						return [set.species + " is not allowed (special category: " + tag + ")."];
					}
				}
			}
			// Must not have a pre-evolution
			if (species.prevo && this.dex.species.get(species.prevo).gen <= this.gen) {
				return [set.species + " is not a single-stage Pokémon (has a pre-evolution)."];
			}
			// Must not be able to evolve (no nfe property and no evos array)
			const canEvolve = species.nfe || (species.evos && species.evos.length > 0);
			if (canEvolve) {
				return [set.species + " is not a single-stage Pokémon (can evolve)."];
			}
		},
		onBegin() {
			this.add('rule', 'Single Stage Only: Only Pokémon that do not evolve are allowed (no special categories)');
		},
	},
	paradoxallowed: {
		effectType: 'ValidatorRule',
		name: 'Paradox Allowed',
		desc: "Allows Paradox Pokémon but excludes Restricted Paradox",
		onValidateSet(set) {
			const species = this.dex.species.get(set.species || set.name);
			// Exclude Restricted Paradox only
			if (species.tags && species.tags.includes('Restricted Paradox' as any)) {
				return [set.species + " is not allowed (Restricted Paradox)."];
			}
		},
		onBegin() {
			this.add('rule', 'Paradox Allowed: Paradox Pokémon allowed except Restricted Paradox');
		},
	},
	limitparadox: {
		effectType: 'ValidatorRule',
		name: 'Limit Paradox',
		desc: "Limit the number of Paradox Pokémon on a team",
		hasValue: 'positive-integer',
		onBegin() {
			const limit = this.ruleTable.valueRules.get('limitparadox');
			this.add('rule', `Limit Paradox: Up to ${limit} Paradox Pokémon per team`);
		},
		onValidateRule(value) {
			const num = Number(value);
			if (num < 0 || num > this.ruleTable.maxTeamSize) {
				throw new Error(`Limit Paradox must be between 0 and ${this.ruleTable.maxTeamSize}.`);
			}
			return value;
		},
		onValidateTeam(team) {
			const paradoxPokemon = [];
			for (const set of team) {
				const species = this.dex.species.get(set.species);
				const tags = species.tags || [];
				if (tags.includes('Paradox' as any)) {
					paradoxPokemon.push(species.name);
				}
			}
			const limit = Number(this.ruleTable.valueRules.get('limitparadox') ?? 0);
			if (paradoxPokemon.length > limit) {
				return [
					`You are limited to ${limit} Paradox Pokémon by Limit Paradox.`,
					`(You have: ${paradoxPokemon.join(', ')})`,
				];
			}
		},
	},
	indigotimer: {
	effectType: 'Rule',
	name: 'Indigo Timer',
	desc: "Indigo Starstorm's timer: 150 second Team Preview, 20 minutes Your Time, 90 seconds per turn",
	ruleset: [
		'Timer Starting = 1200', 'Timer Grace = 150',
		'Timer Add Per Turn = 0', 'Timer Max Per Turn = 90', 'Timer Max First Turn = 150',
		'Timeout Auto Choose', 'DC Timer Bank',
	],
	},
	itemreveal: {
	effectType: 'Rule',
	name: 'Item Reveal',
	desc: "All items are revealed at battle start (but not which Pokémon holds them)",
	onBegin() {
		this.add('rule', 'Item Reveal: All items revealed at start');
		// Collect all items from both sides
		const p1Items: string[] = [];
		const p2Items: string[] = [];
		for (const pokemon of this.sides[0].pokemon) {
			if (pokemon.item) {
				const item = this.dex.items.get(pokemon.item);
				p1Items.push(item.name);
			}
		}
		for (const pokemon of this.sides[1].pokemon) {
			if (pokemon.item) {
				const item = this.dex.items.get(pokemon.item);
				p2Items.push(item.name);
			}
		}
		// Sort items alphabetically for consistency
		p1Items.sort();
		p2Items.sort();
		// Display items for each side
		if (p1Items.length) { this.add('message', `${this.sides[0].name}'s team items: ${p1Items.join(', ')}`); }
		if (p2Items.length) { this.add('message', `${this.sides[1].name}'s team items: ${p2Items.join(', ')}`); }
		},
	},
	freezeclause: {
		effectType: 'ValidatorRule',
		name: 'Freeze Clause',
		desc: "Prevents players from freezing more than one opposing Pokémon at a time",
		// Note: This is typically enforced in battle, not in validation
		// Including it here for format compatibility
	},
	levelclause: {
		effectType: 'ValidatorRule',
		name: 'Level Clause',
		desc: "Requires all Pokémon to be set to a specific level",
		// Note: This is typically handled by the Adjust Level rule
		// Including it here for format compatibility
	},
	teraclause: {
		effectType: 'ValidatorRule',
		name: 'Tera Clause',
		desc: "Limits the use of Terastallization in battle",
		// Note: This restricts terastallization usage
		// Including it here for format compatibility
	},

}