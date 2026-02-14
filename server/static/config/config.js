/** @type {import('../play.pokemonshowdown.com/src/client-main').PSConfig} */
var Config = Config || {};

/* version */ Config.version = "0";

Config.bannedHosts = ['cool.jit.su', 'pokeball-nixonserver.rhcloud.com'];

Config.whitelist = [
	'wikipedia.org',
];

// Single-server, same-origin setup.
// This makes the client use whatever host/port it was loaded from.
const ORIGIN_HOST = location.hostname;
const ORIGIN_PORT = location.port ? Number(location.port) : (location.protocol === 'https:' ? 443 : 80);

Config.defaultserver = {
	id: 'server',
	host: ORIGIN_HOST,
	port: ORIGIN_PORT,
	httpport: ORIGIN_PORT,
	altport: ORIGIN_PORT,
	registered: true,
};

Config.servers = Config.servers || {};
Config.servers.server = Config.defaultserver;

// Optional: make the "auto" chooser always pick this
Config.servers.public = Config.defaultserver;

Config.roomsFirstOpenScript = function () {};

Config.customcolors = {
	'zarel': 'aeo',
	'crimson gaia': 'aeo',
};

/*** Begin automatically generated configuration ***/
Config.version = "0.11.2 (2f9254d2/adb6b7fc)";

// Make the client treat your current host as the "client" route,
// so any host-based routing logic lines up.
Config.routes = {
	root: location.host,
	client: location.host,
	dex: 'dex.pokemonshowdown.com',
	replays: 'replay.pokemonshowdown.com',
	users: 'insecure.psim.us/users',
	teams: 'insecure.psim.us',
};