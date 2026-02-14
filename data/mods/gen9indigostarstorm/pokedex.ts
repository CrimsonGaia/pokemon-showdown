import type {SpeciesDataTable} from '../../../sim/dex-species';
import {Pokedex as Pokedex12} from './pokedex-gen1-2';
import {Pokedex as Pokedex34} from './pokedex-gen3-4';
import {Pokedex as Pokedex56} from './pokedex-gen5-6';
import {Pokedex as Pokedex78} from './pokedex-gen7-8';
import {Pokedex as Pokedex9} from './pokedex-gen9';

export const Pokedex: SpeciesDataTable = {
	...Pokedex12,
	...Pokedex34,
	...Pokedex56,
	...Pokedex78,
	...Pokedex9,
};