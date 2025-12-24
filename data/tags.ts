interface TagData {
	name: string;
	desc?: string;
	speciesFilter?: (species: Species) => boolean;
	moveFilter?: (move: Move) => boolean;
	genericFilter?: (thing: Species | Move | Item | Ability) => boolean;
	speciesNumCol?: (species: Species) => number;
	moveNumCol?: (move: Move) => number;
	genericNumCol?: (thing: Species | Move | Item | Ability) => number;
}

export const Tags: { [id: IDEntry]: TagData } = {
	// Categories
	// ----------
	physical: {
		name: "Physical",
		desc: "Move deals damage with the Attack and Defense stats.",
		moveFilter: move => move.category === 'Physical',
	},
	special: {
		name: "Special",
		desc: "Move deals damage with the Special Attack and Special Defense stats.",
		moveFilter: move => move.category === 'Special',
	},
	status: {
		name: "Status",
		desc: "Move does not deal damage.",
		moveFilter: move => move.category === 'Status',
	},

	// Pokemon tags
	// ------------
	mega: {
		name: "Mega",
		speciesFilter: species => !!species.isMega,
	},
	powerhouse: {
		name: "Powerhouse",
		speciesFilter: species => species.tags.includes("Powerhouse"),
	},
	legendary: {
		name: "Legendary",
		speciesFilter: species => species.tags.includes("Legendary"),
	},
	restrictedlegendary: {
		name: "Restricted Legendary",
		speciesFilter: species => species.tags.includes("Restricted Legendary"),
	},
	mythical: {
		name: "Mythical",
		speciesFilter: species => species.tags.includes("Mythical"),
	},
	restrictedmythical: {
		name: "Restricted Mythical",
		speciesFilter: species => species.tags.includes("Restricted Mythical"),
	},
	paradox: {
		name: "Paradox",
		speciesFilter: species => species.tags.includes("Paradox"),
	},
	restrictedparadox: {
		name: "Restricted Paradox",
		speciesFilter: species => species.tags.includes("Restricted Paradox"),
	},

	// Move tags
	// ---------
	zmove: {
		name: "Z-Move",
		moveFilter: move => !!move.isZ,
	},
	maxmove: {
		name: "Max Move",
		moveFilter: move => !!move.isMax,
	},
	contact: {
		name: "Contact",
		desc: "Affected by a variety of moves, abilities, and items. Moves affected by contact moves include: Spiky Shield, King's Shield. Abilities affected by contact moves include: Iron Barbs, Rough Skin, Gooey, Flame Body, Static, Tough Claws. Items affected by contact moves include: Rocky Helmet, Sticky Barb.",
		moveFilter: move => 'contact' in move.flags,
	},
	binding: {
		name: "Binding",
		desc: "Move traps and damages the target for multiple turns.",
		moveFilter: move => 'bind' in move.flags,
	},
	bite: {
		name: "Bite",
		desc: "Boosted 1.5x by Strong Jaw.",
		moveFilter: move => 'bite' in move.flags,
	},
	bomb: {
		name: "Bomb",
		desc: "Move is a bomb-based attack.",
		moveFilter: move => 'bomb' in move.flags,
	},
	bullet: {
		name: "Bullet",
		desc: "Doesn't affect Bulletproof Pokémon.",
		moveFilter: move => 'bullet' in move.flags,
	},
	drain: {
		name: "Drain",
		desc: "Move drains HP from the target.",
		moveFilter: move => 'drain' in move.flags,
	},
	explosive: {
		name: "Explosive",
		desc: "Move causes an explosion.",
		moveFilter: move => 'explosive' in move.flags,
	},
	fist: {
		name: "Fist",
		desc: "Boosted 1.2x by Iron Fist.",
		moveFilter: move => 'punch' in move.flags,
	},
	powder: {
		name: "Powder",
		desc: "Doesn't affect Grass-type Pokémon, Overcoat Pokémon, or Safety Goggles holders.",
		moveFilter: move => 'powder' in move.flags,
	},
	pulse: {
		name: "Pulse",
		desc: "Boosted 1.5x by Mega Launcher.",
		moveFilter: move => 'pulse' in move.flags,
	},
	slicing: {
		name: "Slicing",
		desc: "Boosted 1.5x by Sharpness.",
		moveFilter: move => 'slicing' in move.flags,
	},
	sound: {
		name: "Sound",
		desc: "Doesn't affect Soundproof Pokémon. (All sound moves also bypass Substitute.)",
		moveFilter: move => 'sound' in move.flags,
	},
	wind: {
		name: "Wind",
		desc: "Activates Wind Power and Wind Rider abilities.",
		moveFilter: move => 'wind' in move.flags,
	},


	airborne: {
		name: "Airborne",
		desc: "Move is executed while airborne.",
		moveFilter: move => 'airborne' in move.flags,
	},
	aura: {
		name: "Aura",
		desc: "Move is an aura-based attack.",
		moveFilter: move => 'aura' in move.flags,
	},
	beam: {
		name: "Beam",
		desc: "Move is a beam-based attack.",
		moveFilter: move => 'beam' in move.flags,
	},
	breath: {
		name: "Breath",
		desc: "Move is a breath-based attack.",
		moveFilter: move => 'breath' in move.flags,
	},
	claw: {
		name: "Claw",
		desc: "Move is a claw-based attack.",
		moveFilter: move => 'claw' in move.flags,
	},
	crush: {
		name: "Crush",
		desc: "Move is a crushing attack.",
		moveFilter: move => 'crush' in move.flags,
	},
	kick: {
		name: "Kick",
		desc: "Move is a kicking attack.",
		moveFilter: move => 'kick' in move.flags,
	},
	launch: {
		name: "Launch",
		desc: "Move launches the user or projectiles.",
		moveFilter: move => 'launch' in move.flags,
	},
	light: {
		name: "Light",
		desc: "Move is a light-based attack.",
		moveFilter: move => 'light' in move.flags,
	},
	lunar: {
		name: "Lunar",
		desc: "Move is a lunar/moon-based attack.",
		moveFilter: move => 'lunar' in move.flags,
	},
	magic: {
		name: "Magic",
		desc: "Move is a magic-based attack.",
		moveFilter: move => 'magic' in move.flags,
	},
	pierce: {
		name: "Pierce",
		desc: "Move is a piercing attack.",
		moveFilter: move => 'pierce' in move.flags,
	},
	shadow: {
		name: "Shadow",
		desc: "Move is a shadow-based attack.",
		moveFilter: move => 'shadow' in move.flags,
	},
	solar: {
		name: "Solar",
		desc: "Move is a solar/sun-based attack.",
		moveFilter: move => 'solar' in move.flags,
	},
	spin: {
		name: "Spin",
		desc: "Move involves spinning.",
		moveFilter: move => 'spin' in move.flags,
	},
	sweep: {
		name: "Sweep",
		desc: "Move is a sweeping attack.",
		moveFilter: move => 'sweep' in move.flags,
	},
	throw: {
		name: "Throw",
		desc: "Move involves throwing.",
		moveFilter: move => 'throw' in move.flags,
	},
	weapon: {
		name: "Weapon",
		desc: "Move uses a weapon.",
		moveFilter: move => 'weapon' in move.flags,
	},
	wing: {
		name: "Wing",
		desc: "Move is a wing-based attack.",
		moveFilter: move => 'wing' in move.flags,
	},

	bypassprotect: {
		name: "Bypass Protect",
		desc: "Bypasses Protect, Detect, King's Shield, and Spiky Shield.",
		moveFilter: move => move.target !== 'self' && !('protect' in move.flags),
	},
	nonreflectable: {
		name: "Nonreflectable",
		desc: "Can't be bounced by Magic Coat or Magic Bounce.",
		moveFilter: move => move.target !== 'self' && move.category === 'Status' && !('reflectable' in move.flags),
	},
	nonmirror: {
		name: "Nonmirror",
		desc: "Can't be copied by Mirror Move.",
		moveFilter: move => move.target !== 'self' && !('mirror' in move.flags),
	},
	nonsnatchable: {
		name: "Nonsnatchable",
		desc: "Can't be copied by Snatch.",
		moveFilter: move => ['allyTeam', 'self', 'adjacentAllyOrSelf'].includes(move.target) && !('snatch' in move.flags),
	},
	bypasssubstitute: {
		name: "Bypass Substitute",
		desc: "Bypasses but does not break a Substitute.",
		moveFilter: move => 'bypasssub' in move.flags,
	},
	gmaxmove: {
		name: "G-Max Move",
		moveFilter: move => typeof move.isMax === 'string',
	},

	// Tiers
	// -----
	uber: {
		name: "Uber",
		speciesFilter: species => species.tier === 'Uber' || species.tier === '(Uber)' || species.tier === 'AG',
	},
	ou: {
		name: "OU",
		speciesFilter: species => species.tier === 'OU' || species.tier === '(OU)',
	},
	uubl: {
		name: "UUBL",
		speciesFilter: species => species.tier === 'UUBL',
	},
	uu: {
		name: "UU",
		speciesFilter: species => species.tier === 'UU',
	},
	rubl: {
		name: "RUBL",
		speciesFilter: species => species.tier === 'RUBL',
	},
	ru: {
		name: "RU",
		speciesFilter: species => species.tier === 'RU',
	},
	nubl: {
		name: "NUBL",
		speciesFilter: species => species.tier === 'NUBL',
	},
	nu: {
		name: "NU",
		speciesFilter: species => species.tier === 'NU',
	},
	publ: {
		name: "PUBL",
		speciesFilter: species => species.tier === 'PUBL',
	},
	pu: {
		name: "PU",
		speciesFilter: species => species.tier === 'PU' || species.tier === '(NU)',
	},
	zubl: {
		name: "ZUBL",
		speciesFilter: species => species.tier === 'ZUBL',
	},
	zu: {
		name: "ZU",
		speciesFilter: species => species.tier === '(PU)' || species.tier === 'ZU',
	},
	nfe: {
		name: "NFE",
		speciesFilter: species => species.tier === 'NFE',
	},
	lc: {
		name: "LC",
		speciesFilter: species => species.doublesTier === 'LC',
	},
	captier: {
		name: "CAP Tier",
		speciesFilter: species => species.isNonstandard === 'CAP',
	},
	caplc: {
		name: "CAP LC",
		speciesFilter: species => species.tier === 'CAP LC',
	},
	capnfe: {
		name: "CAP NFE",
		speciesFilter: species => species.tier === 'CAP NFE',
	},
	ag: {
		name: "AG",
		speciesFilter: species => species.tier === 'AG',
	},

	// Doubles tiers
	// -------------
	duber: {
		name: "DUber",
		speciesFilter: species => species.doublesTier === 'DUber' || species.doublesTier === '(DUber)',
	},
	dou: {
		name: "DOU",
		speciesFilter: species => species.doublesTier === 'DOU' || species.doublesTier === '(DOU)',
	},
	dbl: {
		name: "DBL",
		speciesFilter: species => species.doublesTier === 'DBL',
	},
	duu: {
		name: "DUU",
		speciesFilter: species => species.doublesTier === 'DUU',
	},
	dnu: {
		name: "DNU",
		speciesFilter: species => species.doublesTier === '(DUU)',
	},

	// Nat Dex tiers
	// -------------
	ndag: {
		name: "ND AG",
		speciesFilter: species => species.natDexTier === 'AG',
	},
	nduber: {
		name: "ND Uber",
		speciesFilter: species => species.natDexTier === 'Uber' || species.natDexTier === '(Uber)',
	},
	ndou: {
		name: "ND OU",
		speciesFilter: species => species.natDexTier === 'OU' || species.natDexTier === '(OU)',
	},
	nduubl: {
		name: "ND UUBL",
		speciesFilter: species => species.natDexTier === 'UUBL',
	},
	nduu: {
		name: "ND UU",
		speciesFilter: species => species.natDexTier === 'UU',
	},
	ndrubl: {
		name: "ND RUBL",
		speciesFilter: species => species.natDexTier === 'RUBL',
	},
	ndru: {
		name: "ND RU",
		speciesFilter: species => species.natDexTier === 'RU',
	},
	ndnfe: {
		name: "ND NFE",
		speciesFilter: species => species.natDexTier === 'NFE',
	},
	ndlc: {
		name: "ND LC",
		speciesFilter: species => species.natDexTier === 'LC',
	},

	// Legality tags
	past: {
		name: "Past",
		genericFilter: thing => thing.isNonstandard === 'Past',
	},
	future: {
		name: "Future",
		genericFilter: thing => thing.isNonstandard === 'Future',
	},
	lgpe: {
		name: "LGPE",
		genericFilter: thing => thing.isNonstandard === 'LGPE',
	},
	unobtainable: {
		name: "Unobtainable",
		genericFilter: thing => thing.isNonstandard === 'Unobtainable',
	},
	cap: {
		name: "CAP",
		speciesFilter: thing => thing.isNonstandard === 'CAP',
	},
	custom: {
		name: "Custom",
		genericFilter: thing => thing.isNonstandard === 'Custom',
	},
	nonexistent: {
		name: "Nonexistent",
		genericFilter: thing => !!thing.isNonstandard && thing.isNonstandard !== 'Unobtainable',
	},

	// filter columns
	// --------------
	introducedgen: {
		name: "Introduced Gen",
		genericNumCol: thing => thing.gen,
	},

	height: {
		name: "Height",
		speciesNumCol: species => species.heightm,
	},
	weight: {
		name: "Weight",
		speciesNumCol: species => species.weightkg,
	},
	hp: {
		name: "HP",
		desc: "Hit Points",
		speciesNumCol: species => species.baseStats.hp,
	},
	atk: {
		name: "Atk",
		desc: "Attack",
		speciesNumCol: species => species.baseStats.atk,
	},
	def: {
		name: "Def",
		desc: "Defense",
		speciesNumCol: species => species.baseStats.def,
	},
	spa: {
		name: "SpA",
		desc: "Special Attack",
		speciesNumCol: species => species.baseStats.spa,
	},
	spd: {
		name: "SpD",
		desc: "Special Defense",
		speciesNumCol: species => species.baseStats.spd,
	},
	spe: {
		name: "Spe",
		desc: "Speed",
		speciesNumCol: species => species.baseStats.spe,
	},
	bst: {
		name: "BST",
		desc: "Base Stat Total",
		speciesNumCol: species => species.bst,
	},

	basepower: {
		name: "Base Power",
		moveNumCol: move => move.basePower,
	},
	priority: {
		name: "Priority",
		moveNumCol: move => move.priority,
	},
	accuracy: {
		name: "Accuracy",
		moveNumCol: move => move.accuracy === true ? 101 : move.accuracy,
	},
	maxpp: {
		name: "Max PP",
		moveNumCol: move => move.pp,
	},
};
