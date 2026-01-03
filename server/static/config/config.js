/** @type {import('../play.pokemonshowdown.com/src/client-main').PSConfig} */
var Config = Config || {};

/* version */ Config.version = "0";

Config.bannedHosts = ['cool.jit.su', 'pokeball-nixonserver.rhcloud.com'];

Config.whitelist = [
	'wikipedia.org',

	// The full list is maintained outside of this repository so changes to it
	// don't clutter the commit log. Feel free to copy our list for your own
	// purposes; it's here: https://play.pokemonshowdown.com/config/config.js

	// If you would like to change our list, simply message Zarel on Smogon or
	// Discord.
];

// `defaultserver` specifies the server to use when the domain name in the
// address bar is `Config.routes.client`.
Config.defaultserver = {
	id: 'showdown',
	host: 'localhost',
	port: 8000,
	httpport: 8000,
	altport: 8000,
	registered: true
};

Config.roomsFirstOpenScript = function () {
};

Config.customcolors = {
	'zarel': 'aeo',
	'crimson gaia' : 'aeo'
};
/*** Begin automatically generated configuration ***/
Config.version = "0.11.2 (bab610bf/adb6b7fc)";

Config.routes = {
	root: 'localhost:8000',
	client: 'localhost:8000',
	dex: 'localhost:8000',
	replays: 'localhost:8000',
	users: 'localhost:8000/users',
	teams: 'localhost:8000/teams',
};
/*** End automatically generated configuration ***/
