# Verdant Echo

A Stardew Valley-inspired farming RPG for mobile web browsers.

---

## GOAL

Build a complete farming RPG that runs in any mobile browser. Simple pixel graphics, deep progression systems, offline play after first load.

**Core Pillars:**
- Meaningful progression - every action feeds long-term goals
- Player freedom - multiple valid strategies, no forced path
- Living world - NPC schedules, seasonal changes, reactive ecosystem
- Mobile first - touch controls, short sessions, save anywhere

**Scope:**
- Core farming loop (plant, water, harvest, sell)
- 4 seasons with distinct crops, forageables, fish
- 12 NPCs with schedules, heart events, gift preferences
- 5 skills (farming, mining, foraging, fishing, combat) with 10 levels each
- Mining with 120 floors, combat, resources
- Fishing minigame
- Crafting system
- Relationship/marriage system
- Home upgrades and farm buildings
- 4 festival events per year

**Out of Scope:** Multiplayer, mod support, mobile app wrapper

---

## ARCHITECTURE

**Tech Stack:**
- Phaser 3.70 - Game engine
- Dexie 3.2 - IndexedDB wrapper for saves
- Redux + Immer - State management
- Howler - Audio
- Vite - Build tool
- TypeScript - Type safety

**State Management:**
Hybrid Redux (persistent) + Phaser (runtime).

Redux Store Structure:
```
player: {
  name, farmName,
  stats: { health, stamina, money },
  skills: { farming, mining, foraging, fishing, combat: { level (1-10), xp, profession } },
  inventory: { capacity (12-36), slots: [{ itemId, quantity, quality (0-3), metadata }] },
  tools: { hoe, wateringCan, pickaxe, axe, scythe, fishingRod: { type, upgradeLevel (0-4) } },
  relationships: { [npcId]: { hearts (0-10), points, status, giftsThisWeek, talkedToday } },
  unlocks: { buildings, recipes, areas, eventsSeen }
}
world: {
  time: { year, season (spring/summer/fall/winter), day (1-28), hour (6-26), minute (0-50) },
  weather: { today, tomorrow, rngSeed },
  farm: { name, layout, buildings, tiles },
  mine: { currentFloor (1-120), floorsGenerated, elevatorUnlocks },
  shippingBin: [{ itemId, quantity, quality }]
}
meta: { saveSlot, playTime, lastPlayed, version }
```

**Scene Architecture:**
- BootScene - Essential preload, loading bar
- PreloadScene - Full asset load, init Redux from IndexedDB
- FarmScene - Primary gameplay, farming interactions
- TownScene - NPCs, shops, dialogue
- MineScene - Combat, mining, procedural floors
- FishingScene - Minigame overlay
- UIScene - Persistent UI (inventory, clock, money), runs parallel

**Time System:**
- 10-minute game ticks, 7 seconds real time per tick
- 6am to 2am (20 hours = 14 minutes real time per day)
- 28 days per season, 4 seasons per year
- Sunset varies: spring 6pm, summer 8pm, fall 5pm, winter 4pm
- Pass out at 2am if not in bed

**IndexedDB Schema:**
- saves: slot info, metadata
- saveData: compressed full state
- settings: preferences
- unlocks: cross-save unlocks
- achievements

---

## DATA

**Crops:**
| Name | Season | Days | Regrows | Base Price | Seeds |
|------|--------|------|---------|------------|-------|
| Parsnip | Spring | 4 | No | 35 | 20 |
| Cauliflower | Spring | 12 | No | 175 | 80 |
| Green Bean | Spring | 10 | Yes (3) | 40 | 60 |
| Potato | Spring | 6 | No | 80 | 50 |
| Tulip | Spring | 6 | No | 30 | 20 |
| Kale | Spring | 6 | No | 110 | 70 |
| Blue Jazz | Spring | 7 | No | 50 | 30 |
| Strawberry | Spring | 8 | Yes (4) | 120 | 100 |
| Rhubarb | Spring | 13 | No | 220 | 100 |
| Coffee Bean | Spring/Summer | 10 | Yes (2) | 15 | 2500 |
| Garlic | Spring | 4 | No | 60 | 40 |
| Rice | Spring | 6-8* | No | 30 | 40 |
| Melon | Summer | 12 | No | 250 | 80 |
| Tomato | Summer | 11 | Yes (4) | 60 | 50 |
| Hot Pepper | Summer | 5 | Yes (3) | 40 | 40 |
| Blueberry | Summer | 13 | Yes (4) | 50 | 80 |
| Starfruit | Summer | 13 | No | 750 | 400 |
| Corn | Summer/Fall | 14 | Yes (4) | 50 | 150 |
| Radish | Summer | 6 | No | 90 | 40 |
| Poppy | Summer | 7 | No | 140 | 100 |
| Spangle | Summer | 8 | No | 90 | 50 |
| Hops | Summer | 11 | Yes | 25 | 60 |
| Wheat | Summer/Fall | 4 | No | 25 | 10 |
| Amaranth | Fall | 7 | No | 150 | 70 |
| Cranberries | Fall | 7 | Yes (5) | 75 | 240 |
| Eggplant | Fall | 5 | Yes (5) | 60 | 20 |
| Pumpkin | Fall | 13 | No | 320 | 100 |
| Yam | Fall | 10 | No | 160 | 60 |
| Bok Choy | Fall | 4 | No | 80 | 50 |
| Fairy Rose | Fall | 12 | No | 290 | 200 |
| Sunflower | Fall | 8 | No | 80 | 200 |
| Artichoke | Fall | 8 | No | 160 | 30 |
| Beet | Fall | 6 | No | 100 | 20 |
| Ancient Fruit | Spring/Summer/Fall | 28 | Yes (7) | 550 | N/A |
| Sweet Gem Berry | Fall | 24 | No | 3000 | 1000 |

*Rice grows faster in water

**Forageables by Season:**
Spring: Wild Horseradish, Daffodil, Leek, Dandelion, Spring Onion, Morel, Common Mushroom
Summer: Spice Berry, Grape, Sweet Pea, Red Mushroom, Fiddlehead Fern
Fall: Wild Plum, Hazelnut, Blackberry, Chanterelle, Common Mushroom, Red Mushroom, Purple Mushroom
Winter: Winter Root, Crystal Fruit, Snow Yam, Crocus, Holly

**Fish by Season/Location:**
Ocean (all seasons): Sardine, Tuna, Red Snapper, Tilapia, Albacore
Ocean (spring/summer): Flounder, Halibut, Pufferfish, Octopus, Super Cucumber
Ocean (fall/winter): Sea Cucumber, Squid, Sea Urchin
River (all): Sunfish, Catfish, Shad, Tiger Trout, Largemouth Bass
River (spring): Chub, Bream
River (summer): Dorado, Rainbow Trout
River (fall): Salmon, Walleye
River (winter): Lingcod, Perch, Pike
Mountain Lake: Carp, Sturgeon, Largemouth Bass, Midnight Carp
Mines: Stonefish, Ice Pip, Lava Eel
Night Market: Midnight Squid, Spook Fish, Blobfish
Legendary: Legend (spring/mountain lake), Crimsonfish (summer/ocean), Angler (fall/river), Glacierfish (winter/river), Mutant Carp (sewers)

**NPCs (12):**
| Name | Home | Schedule Pattern | Loves | Likes | Hates |
|------|------|------------------|-------|-------|-------|
| Abigail | Pierre's Store | Wanders, plays flute, goes to mines | Amethyst, Banana Pudding, Blackberry Cobbler, Chocolate Cake, Pufferfish, Pumpkin, Spicy Eel | Quartz | Clay, Holly |
| Alex | 1 River Road | Gym, dog, beach | Complete Breakfast, Salmon Dinner, Jack Be Nimble Jack Be Thick | Eggs, Milk | Holly, Quartz |
| Elliott | Beach Cabin | Writing, beach walks | Crab Cakes, Duck Feather, Lobster, Pomegranate, Squid Ink, Tom Kha Soup | Squid, Octopus | Amaranth, Quartz |
| Emily | 2 Willow Lane | Sewing, bar work | Amethyst, Aquamarine, Cloth, Emerald, Jade, Ruby, Survival Burger, Topaz, Wool | Daffodil, Quartz | Fish, Spring Onion |
| Haley | 2 Willow Lane | Photography, mall | Coconut, Fruit Salad, Pink Cake, Sunflower | Daffodil, Quartz | Clay, Prismatic Shard |
| Harvey | Medical Clinic | Doctor, radio, dancing | Coffee, Pickles, Super Meal, Truffle Oil, Wine | Daffodil, Quartz | Coral, Nautilus Shell |
| Leah | Cottage (woods) | Art, foraging | Goat Cheese, Poppyseed Muffin, Salad, Stir Fry, Truffle, Vegetable Medley | Daffodil, Quartz | Bread, Pizza |
| Maru | Carpenter's Shop | Robotics, science, nurse | Battery Pack, Cauliflower, Cheese Cauliflower, Diamond, Gold Bar, Iridium Bar, Miner's Treat, Pepper Poppers, Radioactive Bar, Rhubarb Pie, Strawberry | Copper Bar, Iron Bar | Holly, Honey, Pickles, Snow Yam, Truffle |
| Penny | Trailer | Reading, teaching, cleaning | Diamond, Emerald, Melon, Poppy, Poppyseed Muffin, Red Plate, Roots Platter, Sandfish, Tom Kha Soup | Dandelion, Leek | Beer, Holly, Hops, Wine |
| Sam | 1 Willow Lane | Music, skateboarding | Cactus Fruit, Maple Bar, Pizza, Tigerseye | Joja Cola | Coal, Copper Bar, Duck Mayonnaise, Gold Bar, Gold Ore, Iridium Bar, Iridium Ore, Iron Bar, Mayonnaise, Pickles, Refined Quartz |
| Sebastian | Carpenter's Shop | Programming, comics, motorcycles | Frozen Tear, Obsidian, Pumpkin Soup, Sashimi, Void Egg | Quartz | Clay, Complete Breakfast, Farmer's Lunch, Omelet |
| Shane | Marnie's Ranch | Drinking, chickens, video games | Beer, Hot Pepper, Pepper Poppers, Pizza | Eggs, Milk | Pickles, Quartz |

**Tools & Upgrades:**
| Tool | Copper (1) | Steel (2) | Gold (3) | Iridium (4) |
|------|------------|-----------|----------|-------------|
| Hoe | 5x1 area | 3x1 area | 5x2 area | 6x3 area |
| Pickaxe | Can break big rocks | Can break boulders | Faster | Fastest |
| Axe | Can break large stumps | Can break logs | Faster | Fastest |
| Watering Can | 5 tiles | 9 tiles (3x3) | 18 tiles | 54 tiles (6x9) |

**Skills & Professions:**
Farming (crops harvested): Level 5 - Rancher (animal products +20%) or Tiller (crops +10%). Level 10 - Rancher→Coopmaster (coop animals faster friendship) or Shepherd (barn animals faster). Tiller→Artisan (artisan goods +40%) or Agriculturalist (crops grow 10% faster).

Mining (rocks broken): Level 5 - Miner (+1 ore per vein) or Geologist (gems chance double). Level 10 - Miner→Blacksmith (bars +50% value) or Prospector (coal chance double). Geologist→Excavator (geode chance double) or Gemologist (gems +30% value).

Foraging (forageables picked, trees chopped): Level 5 - Forester (wood +25%) or Gatherer (chance double forage). Level 10 - Forester→Lumberjack (all trees drop hardwood) or Tapper (syrup +25%). Gatherer→Botanist (forage always highest quality) or Tracker (location arrows for forage).

Fishing (fish caught): Level 5 - Fisher (fish +25% value) or Trapper (resources for crab pots -50%). Level 10 - Fisher→Angler (fish +50% value) or Pirate (treasure chance double). Trapper→Mariner (crab pots no trash) or Luremaster (crab pots no bait).

Combat (monsters killed): Level 5 - Fighter (damage +10, hp +15) or Scout (crit chance +50%). Level 10 - Fighter→Brute (damage +15%) or Defender (hp +25). Scout→Acrobat (cooldown -50%) or Desperado (crit deadly).

**Crafting Categories:**
Farming: Scarecrow, Sprinkler, Quality Sprinkler, Iridium Sprinkler, Bee House, Keg, Preserves Jar, Cheese Press, Mayonnaise Machine, Loom, Oil Maker, Seed Maker, Crystalarium, Recycling Machine

Artisan: Keg (wine, juice, beer, pale ale, mead, coffee), Preserves Jar (jelly, pickles), Cheese Press (cheese), Mayonnaise Machine (mayo), Loom (cloth), Oil Maker (oil, truffle oil)

Lighting: Torch, Campfire, Wooden Brazier, Stone Brazier, Gold Brazier, Carved Brazier, Stump Brazier, Barrel Brazier, Skull Brazier, Marble Brazier, Wood Lamp-post, Iron Lamp-post

Refining: Charcoal Kiln, Furnace, Heavy Tapper, Lightning Rod, Recycling Machine, Seed Maker, Slime Egg-Press, Slime Incubator, Solar Panel, Ostrich Incubator, Geode Crusher

Fishing: Spinner, Dressed Spinner, Warped Spinner, Magnet, Trap Bobber, Cork Bobber, Lead Bobber, Treasure Hunter, Barbed Hook, Curiosity Lure, Quality Bobber

Explosives: Cherry Bomb, Bomb, Mega Bomb

Fences: Gate, Wood Fence, Stone Fence, Iron Fence, Hardwood Fence

Storage: Chest, Stone Chest, Junimo Chest, Mini-Fridge, Wood Sign, Stone Sign, Dark Sign

Furniture: various decorative items

**Mine Floors:**
1-40: Copper ore, green slimes, bugs, grubs
40-80: Iron ore, frost slimes, skeletons, ghosts, bats
80-120: Gold ore, lava slimes, serpents, purple slimes, metal heads
Special: Floor 20 (ghost), Floor 60 (mummy), Floor 100 (serpent), Floor 120 (treasure chest with Skull Key)

Ores: Stone (common), Copper (1-39), Iron (40-79), Gold (80-120), Iridium (rare all floors), Coal, Geodes

Monsters: Green Slime, Frost Jelly, Red Sludge, Purple Sludge, Yellow Slime, Black Slime, Copper Slime, Iron Slime, Tiger Slime, Bat, Frost Bat, Lava Bat, Iridium Bat, Bug, Cave Fly, Grub, Mutant Grub, Mutant Fly, Rock Crab, Lava Crab, Iridium Crab, Duggy, Magma Duggy, Ghost, Carbon Ghost, Mummy, Serpent, Royal Serpent, Pepper Rex, Skeleton, Skeleton Mage, Metal Head, Hot Head, Shadow Brute, Shadow Shaman, Shadow Sniper, Squid Kid

**Festival Events:**
Egg Festival (Spring 13): Egg hunt, Strawberry seeds for sale
Flower Dance (Spring 24): Dance with NPCs, friendship boost
Luau (Summer 11): Potluck soup, governor judges
Dance of the Moonlight Jellies (Summer 28): Watch jellies, friendship boost
Stardew Valley Fair (Fall 16): Grange display, minigames, Star Tokens
Spirit's Eve (Fall 27): Haunted maze, Golden Pumpkin
Festival of Ice (Winter 8): Ice fishing contest
Feast of the Winter Star (Winter 25): Gift exchange, secret Santa

**Buildings:**
| Building | Cost | Materials | Purpose |
|----------|------|-----------|---------|
| Silo | 100g | 100 Stone, 10 Clay, 5 Copper Bar | Store hay (240 max) |
| Coop | 4000g | 300 Wood, 100 Stone | House 4 chickens/ducks |
| Big Coop | 10000g | 400 Wood, 150 Stone | House 8, incubator, rabbits |
| Deluxe Coop | 20000g | 500 Wood, 200 Stone | House 12, autograbber |
| Barn | 6000g | 350 Wood, 150 Stone | House 4 cows/goats |
| Big Barn | 12000g | 450 Wood, 200 Stone | House 8, goats, sheep, pigs |
| Deluxe Barn | 25000g | 550 Wood, 300 Stone | House 12, autograbber |
| Well | 1000g | 75 Stone | Water source |
| Shed | 15000g | 300 Wood | Storage/work area |
| Big Shed | 20000g | 550 Wood, 300 Stone | 2x size |
| Mill | 2500g | 50 Stone, 150 Wood, 4 Cloth | Process wheat/beet to sugar/flour |
| Fish Pond | 5000g | 200 Stone, 5 Seaweed, 5 Green Algae | Raise fish, produce roe/items |
| Stable | 10000g | 100 Hardwood, 50 Iron Bar | Horse mount |
| Slime Hutch | 10000g | 500 Stone, 10 Refined Quartz, 1 Iridium Bar | Raise slimes, slime balls |
| Obelisk (Earth) | 500000g | 10 Iridium Bar, 10 Truffle | Warp to mountains |
| Obelisk (Water) | 500000g | 5 Iridium Bar, 10 Clam, 10 Coral | Warp to beach |
| Obelisk (Desert) | 1000000g | 20 Iridium Bar, 10 Cactus Fruit, 10 Coconut | Warp to desert |
| Gold Clock | 10000000g | N/A | Stop debris on farm |

**Home Upgrades:**
Upgrade 1 (10000g, 450 Wood): Kitchen, bedroom expansion
Upgrade 2 (50000g, 150 Hardwood): Nursery, two extra rooms
Upgrade 3 (100000g): Cellar (aging barrels)

**Animals:**
Coop: Chicken (white/brown/blue), Duck, Rabbit, Dinosaur
Barn: Cow (white/brown), Goat, Sheep, Pig
Other: Horse

Products:
- Chicken: Egg (every day), Large Egg (happy chickens)
- Duck: Egg (every other day), Feather (random)
- Rabbit: Wool (every 4 days), Rabbit's Foot (rare)
- Dinosaur: Dinosaur Egg (random)
- Cow: Milk (every day), Large Milk (happy)
- Goat: Goat Milk (every other day), Large Goat Milk
- Sheep: Wool (every 3 days)
- Pig: Truffle (outside, not winter, random)

**Artisan Goods:**
| Input | Machine | Output | Time | Value Multiplier |
|-------|---------|--------|------|------------------|
| Vegetable | Preserves Jar | Pickles | 2-3 days | 2x + 50g |
| Fruit | Preserves Jar | Jelly | 2-3 days | 2x + 50g |
| Milk | Cheese Press | Cheese | 3.3 hours | 2x |
| Large Milk | Cheese Press | Gold Cheese | 3.3 hours | 2.25x |
| Goat Milk | Cheese Press | Goat Cheese | 3.3 hours | 2x |
| Large Goat Milk | Cheese Press | Gold Goat Cheese | 3.3 hours | 2.25x |
| Egg | Mayonnaise Machine | Mayonnaise | 3 hours | 1.9x |
| Large Egg | Mayonnaise Machine | Gold Mayo | 3 hours | 1.9x + 100g |
| Duck Egg | Mayonnaise Machine | Duck Mayonnaise | 3 hours | 2x |
| Void Egg | Mayonnaise Machine | Void Mayonnaise | 3 hours | 2.7x |
| Dinosaur Egg | Mayonnaise Machine | Dinosaur Mayo | 3 hours | 2.8x |
| Wool | Loom | Cloth | 4 hours | 2x |
| Truffle | Oil Maker | Truffle Oil | 6 hours | 2.85x |
| Corn/Oil | Oil Maker | Oil | 6 hours | 1.5x |
| Sunflower | Oil Maker | Oil | 1 hour | 1.5x |
| Wheat | Mill | Flour | Instant | 1.5x |
| Beet | Mill | Sugar | Instant | 1.5x |
| Hops | Keg | Pale Ale | 1-2 days | 3x |
| Wheat | Keg | Beer | 1-2 days | 2.5x |
| Coffee Bean | Keg | Coffee | 2 hours | 3x |
| Tea Leaves | Keg | Green Tea | 3 hours | 3x |
| Honey | Keg | Mead | 10 hours | 2x + honey value |
| Any Fruit | Keg | Wine | 7 days | 3x |
| Any Vegetable | Keg | Juice | 4 days | 2.25x |
| Roe | Preserves Jar | Aged Roe | 2-3 days | 2x |
| Sturgeon Roe | Preserves Jar | Caviar | 2-3 days | 2x + 200g |

Aging in cellar barrels: Wine/Juice/Pale Ale/Beer/Mead/Cheese/Goat Cheese can be aged to Iridium quality (2x value) over 2 seasons.

**Quality System:**
Items have quality levels: Normal (1x), Silver (1.25x), Gold (1.5x), Iridium (2x).
Quality determined by farming skill for crops, foraging skill for forage, fishing skill for fish.

**Energy & Health:**
Player starts with 270 max energy, 100 max health.
Energy used for: tools (2-10 per use), watering (2), fishing (8), eating (-energy gained).
Health lost from: monster hits, falling in mines, passing out.
Sleep restores energy. If pass out (2am), lose 10% money up to 1000g.

**Friendship System:**
NPCs have 10 hearts (250 points each = 2500 max).
Talk: +20 points/day
Gift: +20 (like), +45 (love), -20 (dislike), -40 (hate)
Quest: +150
Birthday gift: 8x multiplier
Two gifts per week max per NPC.

Heart events trigger at 2, 4, 6, 8, 10 hearts (varies by NPC).
Dating at 8 hearts (bouquet), engaged at 10 (mermaid pendant), married next day.

**Quests:**
Help Wanted board: Random fetch/kill/fish quests, 7 days, reward money + friendship.
Special orders: 2 per week, bigger rewards, unique items.
Story quests: Progression unlocks (community center, mine depths, etc.).

**Weather:**
Spring: Sunny, Rainy, Stormy (lightning kills crops if unprotected by lightning rod)
Summer: Sunny, Rainy, Stormy
Fall: Sunny, Rainy, Stormy
Winter: Snowy, Sunny (no rain, crops don't grow outside)

Rain waters crops. Storms can be dangerous but good for battery packs.

**Seasonal Mechanics:**
Crops die at season change unless multi-season (corn, wheat, ancient fruit).
Trees produce fruit in specific seasons.
Forageables change each season.
Fish availability changes.
Festivals occur.

**Economy:**
Pierre's General Store: Seeds, fertilizer, backpack upgrades
JojaMart: Seeds (cheaper with membership), processed goods
Blacksmith: Tool upgrades, geode breaking, ore/ingot sales
Fish Shop: Fishing gear, bait, crab pots
Saloon: Food, recipes, friendship spot
Carpenter: Buildings, house upgrades, furniture
Animal Shop: Animals, supplies
Hospital: Medicine

**Community Center:**
6 rooms, each with bundles to complete:
- Crafts Room: Spring, Summer, Fall, Winter, Construction, Exotic Foraging
- Pantry: Spring, Summer, Fall, Animal, Artisan
- Fish Tank: River, Lake, Ocean, Night Fishing, Crab Pot, Specialty Fish
- Boiler Room: Blacksmith's, Geologist's, Adventurer's
- Bulletin Board: Chef's, Dye, Field Research, Fodder, Enchanter's
- Vault: 2500g, 5000g, 10000g, 25000g bundles

Completing rooms unlocks rewards: bridge repair, greenhouse, bus repair, mine carts, etc.

**Secret Woods:**
North of Cindersap Forest, requires Steel Axe to enter.
Has hardwood stumps (6 per day), Slimes, and the Old Master Cannoli statue (Sweet Gem Berry reward).

**Sewers:**
Unlocked after donating 60 items to museum.
Krobus sells rare items. Mutant Carp legendary fish.

**Desert:**
Unlocked by repairing bus (Community Center or Joja).
Skull Cavern (harder mine), Oasis shop, Calico Desert forageables, Sandfish.

**Qi Challenges:**
Special late-game challenges with unique rewards.

**Controls (Mobile):**
Virtual joystick for movement
Tap to interact/use tool
Tap and hold to use tool repeatedly
Pinch to zoom
UI buttons for: inventory, map, journal, menu
Auto-save on sleep/exit

**Save System:**
3 save slots
Auto-save when sleeping
Manual save from menu
Export/import save file

**Audio:**
Music changes by season, location, time of day
Sound effects for actions, UI, ambience
Separate volume controls

**Accessibility:**
Colorblind modes
Text size options
Screen shake toggle
Auto-pause when app backgrounded
