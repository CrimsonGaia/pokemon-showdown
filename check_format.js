const Dex = require('./dist/sim/dex').Dex;

// Get the Reg Set γ format
const format = Dex.formats.get('gen9indigostarstormregsetγdoubles');

console.log('Format:', format.name);
console.log('\nChecking what pokemon are legal...\n');

// Get all pokemon in Gen 9
const allPokemon = [];
for (const id in Dex.data.Pokedex) {
    const species = Dex.species.get(id);
    if (!species.exists) continue;
    allPokemon.push(species.name);
}

console.log(`Total pokemon in dex: ${allPokemon.length}`);

// Create a validator for this format
const validator = Dex.formats.getRuleTable(format);

// Check which pokemon are legal
const legalPokemon = [];
for (const pokemon of allPokemon) {
    const species = Dex.species.get(pokemon);
    
    // Check if it's legal in this format
    const problems = validator.check('pokemon:' + species.id);
    if (!problems || problems.length === 0) {
        legalPokemon.push(pokemon);
    }
}

console.log(`\nLegal pokemon in ${format.name}: ${legalPokemon.length}`);
console.log('\nLegal pokemon:');
legalPokemon.sort().forEach(p => console.log(`  ${p}`));
