import type { PokemonEventMethods, ConditionData } from './dex-conditions';
import { assignMissingFields, BasicEffect, toID } from './dex-data';
import { Utils } from '../lib/utils';
type SparseBoostsTable = import('./dex').Dex.SparseBoostsTable;
interface BelchData {
	basePower?: number;
	status?: string;
	volatileStatus?: string;
	effect?: CommonHandlers['ResultMove'];
	chance?: number; 
}
interface FlingData {
	basePower: number;
	status?: string;
	volatileStatus?: string;
	effect?: CommonHandlers['ResultMove'];
}
export interface ItemData extends Partial<Item>, PokemonEventMethods {
	name: string;
	/** If true, this item is considered fragile and may break/disappear under certain conditions. */
	itemClass?: string[];
	/** If true, this item will break, and may trigger an effect when disturbed. */
	isFragile?: boolean;
	/** If true, this item will trigger its effect when disturbed, but will not break. */
	isMildlyFragile?: boolean;
	onFragileBreak?: (this: Battle, pokemon: Pokemon, source?: Pokemon, effect?: Effect) => void;
	onMildlyFragileBreak?: (this: Battle, pokemon: Pokemon, source?: Pokemon, effect?: Effect) => void;
	onWeaponBreak?: (this: Battle, pokemon: Pokemon) => void;
	forcedGuardAction?: string;
	blocksGuardAction?: boolean;
}
export type ModdedItemData = ItemData | Partial<Omit<ItemData, 'name'>> & {
	inherit: true,
	onCustap?: (this: Battle, pokemon: Pokemon) => void,
};
export interface ItemDataTable { [itemid: IDEntry]: ItemData }
export interface ModdedItemDataTable { [itemid: IDEntry]: ModdedItemData }
export class Item extends BasicEffect implements Readonly<BasicEffect> {
	declare readonly effectType: 'Item';
	/** just controls location on the item spritesheet */
	declare readonly num: number;
	/** If true, this item is considered fragile and may break/disappear under certain conditions. */
	readonly isFragile: boolean;
	/** If true, this item is considered mildly fragile and will trigger its effect when disturbed, but will not break. */
	readonly isMildlyFragile: boolean;
	// Function called when this item breaks due to fragility (not from being eaten or knocked off).
	readonly onFragileBreak?: (this: Battle, pokemon: Pokemon, source?: Pokemon, effect?: Effect) => void;
	// Function called when volatile item is disturbed by poltergeist
	readonly onMildlyFragileBreak?: (this: Battle, pokemon: Pokemon, source?: Pokemon, effect?: Effect) => void;
	// only applies to specific pokemon that hold weapons canonically. Weapon moves are disabled until the weapon is recovered
	readonly onWeaponBreak?: (this: Battle, pokemon: Pokemon) => void;
	// for item dex sorting
	readonly itemClass?: string[];
	// A Move-like object depicting what happens when Fling is used on this item.
	readonly fling?: FlingData;
	// A Move-like object depicting what happens when Belch is used on this item.
	readonly belch?: BelchData;
	// If this is a Drive: The type it turns Techno Blast into. undefined, if not a Drive.
	readonly onDrive?: string;
	// If this is a Memory: The type it turns Multi-Attack into. undefined, if not a Memory.
	readonly onMemory?: string;
	// If this is a mega stone: The name (e.g. Charizard-Mega-X) of the forme this allows transformation into. undefined, if not a mega stone.
	readonly megaStone?: { [megaEvolves: string]: string };
	readonly itemUser?: string[];
	/** Is this item a Berry? */
	readonly isBerry: boolean;
	/** Whether or not this item ignores the Klutz ability. */
	readonly ignoreKlutz: boolean;
	/** The type the holder will change into if it is an Arceus. */
	readonly onPlate?: string;
	/** Is this item a Gem? */
	readonly isGem: boolean;
	/** Is this item a Pokeball? */
	readonly isPokeball: boolean;
	/** Is this item a Red or Blue Orb? */
	readonly isPrimalOrb: boolean;
	declare readonly condition?: ConditionData;
	declare readonly forcedForme?: string;
	declare readonly isChoice?: boolean;
	declare readonly naturalGift?: { basePower: number, type: string };
	declare readonly spritenum?: number;
	declare readonly boosts?: SparseBoostsTable | false;
	declare readonly onEat?: ((this: Battle, pokemon: Pokemon) => void) | false;
	declare readonly onUse?: ((this: Battle, pokemon: Pokemon) => void) | false;
	declare readonly onStart?: (this: Battle, target: Pokemon) => void;
	declare readonly onEnd?: (this: Battle, target: Pokemon) => void;
	declare readonly forcedGuardAction?: string;
	declare readonly blocksGuardAction?: boolean;
	constructor(data: AnyObject) {
		super(data);
		this.fullname = `item: ${this.name}`;
		this.effectType = 'Item';
		this.fling = data.fling || undefined;
		this.onDrive = data.onDrive || undefined;
		this.onMemory = data.onMemory || undefined;
		this.megaStone = data.megaStone || undefined;
		this.itemUser = data.itemUser || undefined;
		this.isBerry = !!data.isBerry;
		this.ignoreKlutz = !!data.ignoreKlutz;
		this.onPlate = data.onPlate || undefined;
		this.isGem = !!data.isGem;
		this.isPokeball = !!data.isPokeball;
		this.isPrimalOrb = !!data.isPrimalOrb;
		this.isFragile = !!data.isFragile;
		this.isMildlyFragile = !!data.isMildlyFragile;
		this.onFragileBreak = data.onFragileBreak;
		this.onMildlyFragileBreak = data.onMildlyFragileBreak;
		this.onWeaponBreak = data.onWeaponBreak;
		this.itemClass = data.itemClass || undefined;
		if (!this.gen) {
			if (this.num >= 1124) { this.gen = 9; } 
			else if (this.num >= 927) { this.gen = 8; } 
			else if (this.num >= 689) { this.gen = 7; } 
			else if (this.num >= 577) { this.gen = 6; } 
			else if (this.num >= 537) { this.gen = 5; } 
			else if (this.num >= 377) { this.gen = 4; } 
			else { this.gen = 3; }
			// Due to difference in gen 2 item numbering, gen 2 items must be specified manually
		}
		if (this.isBerry) this.fling = { basePower: 10 };
		if (this.id.endsWith('plate')) this.fling = { basePower: 90 };
		if (this.onDrive) this.fling = { basePower: 70 };
		if (this.megaStone) this.fling = { basePower: 80 };
		if (this.onMemory) this.fling = { basePower: 50 };
		assignMissingFields(this, data);
	}
}
const EMPTY_ITEM = Utils.deepFreeze(new Item({ name: '', exists: false }));
export class DexItems {
	readonly dex: ModdedDex;
	readonly itemCache = new Map<ID, Item>();
	allCache: readonly Item[] | null = null;
	constructor(dex: ModdedDex) { this.dex = dex; }
	get(name?: string | Item): Item {
		if (name && typeof name !== 'string') return name;
		const id = name ? toID(name.trim()) : '' as ID;
		return this.getByID(id);
	}
	getByID(id: ID): Item {
		if (id === '') return EMPTY_ITEM;
		let item = this.itemCache.get(id);
		if (item) return item;
		if (this.dex.getAlias(id)) {
			item = this.get(this.dex.getAlias(id));
			if (item.exists) { this.itemCache.set(id, item); }
			return item;
		}
		if (id && !this.dex.data.Items[id] && this.dex.data.Items[id + 'berry']) {
			item = this.getByID(id + 'berry' as ID);
			this.itemCache.set(id, item);
			return item;
		}
		if (id && this.dex.data.Items.hasOwnProperty(id)) {
			const itemData = this.dex.data.Items[id] as any;
			const itemTextData = this.dex.getDescs('Items', id, itemData);
			item = new Item({
				name: id,
				...itemData,
				...itemTextData,
			});
			if (item.gen > this.dex.gen) { (item as any).isNonstandard = 'Future'; }
			if (this.dex.parentMod) {
				// If this item is exactly identical to parentMod's item, reuse parentMod's copy
				const parent = this.dex.mod(this.dex.parentMod);
				if (itemData === parent.data.Items[id]) {
					const parentItem = parent.items.getByID(id);
					if (item.isNonstandard === parentItem.isNonstandard && item.desc === parentItem.desc && item.shortDesc === parentItem.shortDesc) { item = parentItem; }
				}
			}
		} else { item = new Item({ name: id, exists: false }); }
		if (item.exists) {
			if (item.isNonstandard === 'Future' || item.isNonstandard === 'Past') { return EMPTY_ITEM; }
			this.itemCache.set(id, this.dex.deepFreeze(item));
		}
		return item;
	}
	all(): readonly Item[] {
		if (this.allCache) return this.allCache;
		const items = [];
		for (const id in this.dex.data.Items) { items.push(this.getByID(id as ID)); }
		this.allCache = Object.freeze(items);
		return this.allCache;
	}
}