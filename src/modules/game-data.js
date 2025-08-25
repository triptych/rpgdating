/**
 * Game Data Module
 * Contains all static game data like character classes, locations, activities, etc.
 */

// Character Classes and their base stats
export const characterClasses = {
    warrior: { name: 'Warrior', icon: '⚔️', baseStats: { attack: 12, defense: 10, magic: 4, agility: 6, charisma: 6, intelligence: 5 } },
    mage: { name: 'Mage', icon: '🔮', baseStats: { attack: 5, defense: 4, magic: 15, agility: 7, charisma: 8, intelligence: 12 } },
    rogue: { name: 'Rogue', icon: '🗡️', baseStats: { attack: 10, defense: 6, magic: 5, agility: 14, charisma: 9, intelligence: 8 } },
    cleric: { name: 'Cleric', icon: '✨', baseStats: { attack: 7, defense: 8, magic: 12, agility: 5, charisma: 12, intelligence: 9 } },
    archer: { name: 'Archer', icon: '🏹', baseStats: { attack: 11, defense: 6, magic: 6, agility: 12, charisma: 7, intelligence: 7 } },
    bard: { name: 'Bard', icon: '🎵', baseStats: { attack: 6, defense: 5, magic: 9, agility: 8, charisma: 15, intelligence: 10 } }
};

// Recruitment locations and their character preferences
export const locations = {
    tavern: { name: 'Tavern', classes: ['warrior', 'rogue', 'bard'] },
    library: { name: 'Library', classes: ['mage', 'cleric'] },
    'training-grounds': { name: 'Training Grounds', classes: ['warrior', 'archer'] },
    temple: { name: 'Temple', classes: ['cleric', 'mage'] },
    forest: { name: 'Forest', classes: ['archer', 'rogue'] },
    market: { name: 'Market', classes: ['bard', 'rogue'] }
};

// Dating activities and their effects
export const datingActivities = [
    { id: 'dinner', name: 'Fancy Dinner', icon: '🍽️', cost: 20, energyCost: 1, boosts: { charisma: 2, attack: 1 } },
    { id: 'training', name: 'Sparring Practice', icon: '⚔️', cost: 10, energyCost: 2, boosts: { attack: 3, defense: 1 } },
    { id: 'library', name: 'Study Together', icon: '📚', cost: 5, energyCost: 1, boosts: { intelligence: 3, magic: 2 } },
    { id: 'adventure', name: 'Mini Adventure', icon: '🗺️', cost: 15, energyCost: 2, boosts: { agility: 2, attack: 1, charisma: 1 } },
    { id: 'shopping', name: 'Shopping Spree', icon: '🛍️', cost: 25, energyCost: 1, boosts: { charisma: 2, intelligence: 1 } },
    { id: 'picnic', name: 'Romantic Picnic', icon: '🧺', cost: 12, energyCost: 1, boosts: { charisma: 3, defense: 1 } }
];

// Dungeon Areas with specialized loot
export const dungeonAreas = {
    'goblin-caves': {
        name: 'Goblin Caves',
        icon: '🟢',
        difficulty: 1,
        energyCost: 2,
        enemies: ['Goblin Scout', 'Goblin Warrior'],
        rewards: { gold: [15, 25], experience: [30, 50] },
        lootSpecialty: 'gold',
        lootTable: [
            { name: 'Goblin Coin Pouch', type: 'treasure', icon: '💰', effect: '+50 Gold', rarity: 'common', value: 50, weight: 0.4 },
            { name: 'Rusty Dagger', type: 'weapon', icon: '🗡️', effect: '+3 Attack', rarity: 'common', value: 25, weight: 0.3 },
            { name: 'Tattered Cloak', type: 'armor', icon: '🧥', effect: '+2 Defense', rarity: 'common', value: 20, weight: 0.2 },
            { name: 'Gold Nugget', type: 'treasure', icon: '✨', effect: '+100 Gold', rarity: 'uncommon', value: 100, weight: 0.1 }
        ]
    },
    'ancient-armory': {
        name: 'Ancient Armory',
        icon: '⚔️',
        difficulty: 2,
        energyCost: 3,
        enemies: ['Animated Sword', 'Guardian Construct'],
        rewards: { gold: [25, 40], experience: [60, 90] },
        lootSpecialty: 'weapons',
        lootTable: [
            { name: 'Steel Sword', type: 'weapon', icon: '⚔️', effect: '+8 Attack', rarity: 'common', value: 80, weight: 0.3 },
            { name: 'Battle Axe', type: 'weapon', icon: '🪓', effect: '+10 Attack, -2 Agility', rarity: 'common', value: 90, weight: 0.25 },
            { name: 'Enchanted Blade', type: 'weapon', icon: '✨', effect: '+12 Attack, +3 Magic', rarity: 'uncommon', value: 150, weight: 0.15 },
            { name: 'Masterwork Bow', type: 'weapon', icon: '🏹', effect: '+9 Attack, +4 Agility', rarity: 'uncommon', value: 120, weight: 0.2 },
            { name: 'Legendary Sword', type: 'weapon', icon: '🗡️', effect: '+15 Attack, +5 Charisma', rarity: 'rare', value: 300, weight: 0.1 }
        ]
    },
    'crystal-caverns': {
        name: 'Crystal Caverns',
        icon: '💎',
        difficulty: 2,
        energyCost: 3,
        enemies: ['Crystal Golem', 'Gem Spider'],
        rewards: { gold: [30, 50], experience: [70, 100] },
        lootSpecialty: 'magic',
        lootTable: [
            { name: 'Magic Crystal', type: 'consumable', icon: '💎', effect: '+5 Magic permanently', rarity: 'uncommon', value: 100, weight: 0.2 },
            { name: 'Mana Potion', type: 'consumable', icon: '🧪', effect: '+30 MP', rarity: 'common', value: 25, weight: 0.3 },
            { name: 'Crystal Staff', type: 'weapon', icon: '🔮', effect: '+6 Attack, +8 Magic', rarity: 'uncommon', value: 140, weight: 0.2 },
            { name: 'Enchanted Robes', type: 'armor', icon: '👘', effect: '+3 Defense, +6 Magic', rarity: 'uncommon', value: 110, weight: 0.15 },
            { name: 'Arcane Tome', type: 'consumable', icon: '📜', effect: '+3 Intelligence permanently', rarity: 'rare', value: 200, weight: 0.15 }
        ]
    },
    'iron-fortress': {
        name: 'Iron Fortress',
        icon: '🛡️',
        difficulty: 3,
        energyCost: 4,
        enemies: ['Iron Guardian', 'Fortress Knight'],
        rewards: { gold: [40, 70], experience: [100, 150] },
        lootSpecialty: 'armor',
        lootTable: [
            { name: 'Iron Armor', type: 'armor', icon: '🛡️', effect: '+8 Defense', rarity: 'common', value: 100, weight: 0.3 },
            { name: 'Knight\'s Helm', type: 'armor', icon: '⛑️', effect: '+5 Defense, +2 Charisma', rarity: 'common', value: 80, weight: 0.25 },
            { name: 'Fortress Shield', type: 'armor', icon: '🛡️', effect: '+12 Defense, +3 Attack', rarity: 'uncommon', value: 180, weight: 0.2 },
            { name: 'Plate Mail', type: 'armor', icon: '🦾', effect: '+15 Defense, -3 Agility', rarity: 'uncommon', value: 200, weight: 0.15 },
            { name: 'Legendary Armor', type: 'armor', icon: '✨', effect: '+20 Defense, +5 All Stats', rarity: 'rare', value: 500, weight: 0.1 }
        ]
    },
    'shadow-realm': {
        name: 'Shadow Realm',
        icon: '🌑',
        difficulty: 4,
        energyCost: 5,
        enemies: ['Shadow Wraith', 'Void Walker'],
        rewards: { gold: [60, 100], experience: [150, 250] },
        lootSpecialty: 'rare',
        lootTable: [
            { name: 'Shadow Essence', type: 'consumable', icon: '🌫️', effect: '+4 All Stats permanently', rarity: 'rare', value: 300, weight: 0.2 },
            { name: 'Void Blade', type: 'weapon', icon: '⚫', effect: '+18 Attack, +8 Magic', rarity: 'rare', value: 400, weight: 0.15 },
            { name: 'Cloak of Shadows', type: 'armor', icon: '🖤', effect: '+10 Defense, +12 Agility', rarity: 'rare', value: 350, weight: 0.15 },
            { name: 'Dark Grimoire', type: 'consumable', icon: '📖', effect: '+8 Magic, +5 Intelligence permanently', rarity: 'epic', value: 600, weight: 0.1 },
            { name: 'Ring of Power', type: 'accessory', icon: '💍', effect: '+10 All Stats', rarity: 'epic', value: 1000, weight: 0.05 }
        ]
    },
    'treasure-vault': {
        name: 'Ancient Treasure Vault',
        icon: '💰',
        difficulty: 3,
        energyCost: 4,
        enemies: ['Treasure Guardian', 'Mimic Chest'],
        rewards: { gold: [80, 150], experience: [120, 180] },
        lootSpecialty: 'gold',
        lootTable: [
            { name: 'Gold Bars', type: 'treasure', icon: '🟨', effect: '+200 Gold', rarity: 'uncommon', value: 200, weight: 0.3 },
            { name: 'Jeweled Crown', type: 'treasure', icon: '👑', effect: '+500 Gold', rarity: 'rare', value: 500, weight: 0.15 },
            { name: 'Ancient Coins', type: 'treasure', icon: '🪙', effect: '+100 Gold', rarity: 'common', value: 100, weight: 0.35 },
            { name: 'Diamond Ring', type: 'accessory', icon: '💎', effect: '+5 Charisma, +3 All Stats', rarity: 'rare', value: 400, weight: 0.1 },
            { name: 'Merchant\'s Blessing', type: 'consumable', icon: '✨', effect: 'Double gold from next 5 dungeons', rarity: 'epic', value: 300, weight: 0.1 }
        ]
    }
};

// Passive Activities for party members
export const passiveActivities = {
    'mining': {
        name: 'Mining',
        icon: '⛏️',
        description: 'Gather precious metals and gems',
        duration: 3600000, // 1 hour in milliseconds
        rewards: { gold: [10, 25], items: ['Iron Ore', 'Silver Nugget', 'Gem Fragment'] },
        requiredStats: { attack: 5 },
        energyCost: 0
    },
    'farming': {
        name: 'Farming',
        icon: '🌾',
        description: 'Grow food and herbs',
        duration: 7200000, // 2 hours
        rewards: { food: [5, 15], items: ['Fresh Bread', 'Healing Herbs', 'Magic Berries'] },
        requiredStats: { intelligence: 3 },
        energyCost: 0
    },
    'crafting': {
        name: 'Crafting',
        icon: '🔨',
        description: 'Create useful items and equipment',
        duration: 5400000, // 1.5 hours
        rewards: { gold: [15, 30], items: ['Crafted Potion', 'Simple Weapon', 'Basic Armor'] },
        requiredStats: { intelligence: 7, attack: 3 },
        energyCost: 0
    },
    'trading': {
        name: 'Trading',
        icon: '💼',
        description: 'Buy and sell goods for profit',
        duration: 1800000, // 30 minutes
        rewards: { gold: [20, 40] },
        requiredStats: { charisma: 8 },
        energyCost: 0
    },
    'studying': {
        name: 'Studying',
        icon: '📚',
        description: 'Research magic and gain knowledge',
        duration: 4800000, // 80 minutes
        rewards: { experience: [50, 100], items: ['Spell Scroll', 'Knowledge Tome'] },
        requiredStats: { intelligence: 10 },
        energyCost: 0
    },
    'guard-duty': {
        name: 'Guard Duty',
        icon: '🛡️',
        description: 'Protect the town and earn steady income',
        duration: 10800000, // 3 hours
        rewards: { gold: [30, 50], experience: [30, 60] },
        requiredStats: { defense: 8, attack: 6 },
        energyCost: 0
    }
};

// Store items for buying/selling
export const storeItems = {
    weapons: [
        { name: 'Iron Sword', type: 'weapon', icon: '⚔️', effect: '+5 Attack', rarity: 'common', buyPrice: 75, sellPrice: 50 },
        { name: 'Steel Blade', type: 'weapon', icon: '🗡️', effect: '+8 Attack', rarity: 'common', buyPrice: 120, sellPrice: 80 },
        { name: 'Magic Staff', type: 'weapon', icon: '🔮', effect: '+4 Attack, +6 Magic', rarity: 'uncommon', buyPrice: 200, sellPrice: 140 },
        { name: 'War Hammer', type: 'weapon', icon: '🔨', effect: '+12 Attack, -2 Agility', rarity: 'uncommon', buyPrice: 180, sellPrice: 120 }
    ],
    armor: [
        { name: 'Leather Armor', type: 'armor', icon: '🛡️', effect: '+3 Defense', rarity: 'common', buyPrice: 45, sellPrice: 30 },
        { name: 'Chain Mail', type: 'armor', icon: '⛓️', effect: '+6 Defense', rarity: 'common', buyPrice: 90, sellPrice: 60 },
        { name: 'Plate Armor', type: 'armor', icon: '🦾', effect: '+10 Defense, -1 Agility', rarity: 'uncommon', buyPrice: 150, sellPrice: 100 },
        { name: 'Magic Robes', type: 'armor', icon: '👘', effect: '+4 Defense, +5 Magic', rarity: 'uncommon', buyPrice: 130, sellPrice: 90 }
    ],
    consumables: [
        { name: 'Health Potion', type: 'consumable', icon: '🧪', effect: '+20 HP', rarity: 'common', buyPrice: 25, sellPrice: 15 },
        { name: 'Mana Potion', type: 'consumable', icon: '💙', effect: '+15 MP', rarity: 'common', buyPrice: 20, sellPrice: 12 },
        { name: 'Energy Drink', type: 'consumable', icon: '⚡', effect: '+2 Energy', rarity: 'common', buyPrice: 30, sellPrice: 20 },
        { name: 'Stat Boost Elixir', type: 'consumable', icon: '✨', effect: '+2 Random Stat permanently', rarity: 'rare', buyPrice: 500, sellPrice: 300 }
    ],
    food: [
        { name: 'Bread', type: 'food', icon: '🍞', effect: 'Restores 5 HP', rarity: 'common', buyPrice: 5, sellPrice: 2 },
        { name: 'Cheese', type: 'food', icon: '🧀', effect: 'Restores 8 HP', rarity: 'common', buyPrice: 8, sellPrice: 4 },
        { name: 'Cooked Meat', type: 'food', icon: '🍖', effect: 'Restores 15 HP', rarity: 'common', buyPrice: 15, sellPrice: 8 },
        { name: 'Magic Fruit', type: 'food', icon: '🍎', effect: 'Restores 10 HP, +1 MP', rarity: 'uncommon', buyPrice: 25, sellPrice: 15 }
    ]
};

// Relationship levels
export const relationshipLevels = [
    { name: 'Stranger', minAffection: 0, statBonus: 0 },
    { name: 'Acquaintance', minAffection: 10, statBonus: 1 },
    { name: 'Friend', minAffection: 25, statBonus: 2 },
    { name: 'Close Friend', minAffection: 50, statBonus: 3 },
    { name: 'Romantic Interest', minAffection: 80, statBonus: 4 },
    { name: 'Partner', minAffection: 120, statBonus: 5 },
    { name: 'Soulmate', minAffection: 200, statBonus: 6 }
];

// Character name pools
export const characterNames = {
    male: ['Aiden', 'Blake', 'Connor', 'Derek', 'Ethan', 'Felix', 'Gabriel', 'Hunter', 'Ivan', 'Jasper', 'Marcus', 'Kieran', 'Aldric', 'Gareth', 'Thomas', 'Galahad', 'Dante', 'Maximilian', 'Jasper', 'Thane'],
    female: ['Aria', 'Bella', 'Clara', 'Diana', 'Emma', 'Fiona', 'Grace', 'Hazel', 'Iris', 'Luna', 'Elara', 'Zara', 'Raven', 'Sunny', 'Lydia', 'Isabella', 'Seraphina', 'Aurora', 'Willow', 'Victoria']
};

// Personality Types System
export const personalityTypes = {
    'shy-bookworm': {
        name: 'Shy Bookworm',
        traits: ['introverted', 'studious', 'gentle', 'thoughtful'],
        preferredActivities: ['library', 'picnic'],
        dislikedActivities: ['shopping'],
        compatibleWith: ['serious-scholar', 'gentle-healer', 'noble-protector'],
        giftPreferences: { books: 8, art: 6, flowers: 6, jewelry: 2, weapons: 2, food: 4 },
        backstoryTemplates: [
            "Spent childhood in libraries, dreams of magical discoveries",
            "Former apprentice to a renowned wizard, seeking knowledge",
            "Raised by scholarly monks, curious about the outside world"
        ],
        quotes: [
            "The answers we seek are often hidden in the pages we haven't read yet.",
            "I may stumble over words, but my magic speaks clearly.",
            "Books never judge you for asking too many questions."
        ]
    },
    'bold-adventurer': {
        name: 'Bold Adventurer',
        traits: ['outgoing', 'risk-taker', 'confident', 'energetic'],
        preferredActivities: ['adventure', 'training'],
        dislikedActivities: ['library'],
        compatibleWith: ['mischievous-trickster', 'free-spirit', 'ambitious-leader'],
        giftPreferences: { weapons: 10, food: 6, art: 4, books: 2, flowers: 4, jewelry: 6 },
        backstoryTemplates: [
            "Former scout for a merchant caravan, traveled dangerous territories",
            "Veteran of countless battles, seeks greater adventures",
            "Explorer who thrives on challenge and excitement"
        ],
        quotes: [
            "The horizon calls, and I must answer!",
            "Danger is just adventure wearing a scary mask.",
            "Life's too short for safe choices."
        ]
    },
    'mysterious-loner': {
        name: 'Mysterious Loner',
        traits: ['enigmatic', 'independent', 'observant', 'complex'],
        preferredActivities: ['adventure', 'library'],
        dislikedActivities: ['shopping', 'dinner'],
        compatibleWith: ['shy-bookworm', 'serious-scholar', 'noble-protector'],
        giftPreferences: { art: 10, books: 6, weapons: 4, jewelry: 2, flowers: 3, food: 4 },
        backstoryTemplates: [
            "Former assassin who abandoned dark past but carries its secrets",
            "Practitioner of forbidden magic, exiled and seeking redemption",
            "Wanderer with a mysterious past, slow to trust but deeply loyal"
        ],
        quotes: [
            "The shadows know all secrets, but they keep mine.",
            "Trust is a luxury I can't afford... or can I?",
            "Everyone has darkness within them; I've just made peace with mine."
        ]
    },
    'cheerful-optimist': {
        name: 'Cheerful Optimist',
        traits: ['upbeat', 'supportive', 'encouraging', 'warm'],
        preferredActivities: ['picnic', 'shopping', 'dinner'],
        dislikedActivities: ['training'],
        compatibleWith: ['gentle-healer', 'shy-bookworm', 'noble-protector'],
        giftPreferences: { flowers: 10, food: 10, jewelry: 6, art: 4, books: 4, weapons: 2 },
        backstoryTemplates: [
            "Traveling performer who spreads joy through music and stories",
            "Temple-raised healer who sees calling as spreading hope",
            "Believes everyone has good in them, works to bring out the best"
        ],
        quotes: [
            "Every day is a gift, that's why they call it the present!",
            "A smile is the shortest distance between two hearts.",
            "Even the darkest night will end and the sun will rise."
        ]
    },
    'serious-scholar': {
        name: 'Serious Scholar',
        traits: ['intellectual', 'methodical', 'wise', 'analytical'],
        preferredActivities: ['library', 'training'],
        dislikedActivities: ['shopping', 'picnic'],
        compatibleWith: ['shy-bookworm', 'mysterious-loner', 'ambitious-leader'],
        giftPreferences: { books: 10, art: 6, weapons: 4, food: 4, flowers: 3, jewelry: 2 },
        backstoryTemplates: [
            "Former academy professor who left to conduct field research",
            "Keeper of ancient religious texts, seeks deeper meanings",
            "Brilliant researcher who struggles to connect emotionally"
        ],
        quotes: [
            "Knowledge is power, but wisdom is knowing how to use it.",
            "The universe reveals its secrets to those patient enough to listen.",
            "Theory without practice is sterile; practice without theory is blind."
        ]
    },
    'flirtatious-charmer': {
        name: 'Flirtatious Charmer',
        traits: ['charismatic', 'playful', 'confident', 'socially-adept'],
        preferredActivities: ['dinner', 'shopping', 'picnic'],
        dislikedActivities: ['library', 'training'],
        compatibleWith: ['bold-adventurer', 'mischievous-trickster', 'ambitious-leader'],
        giftPreferences: { jewelry: 10, flowers: 10, art: 6, food: 6, books: 3, weapons: 4 },
        backstoryTemplates: [
            "Court entertainer who mastered the art of charm and persuasion",
            "Former con artist who now seeks to use social skills legitimately",
            "Uses charm to navigate complex situations while hiding insecurities"
        ],
        quotes: [
            "Charm opens doors that force cannot budge.",
            "Beauty fades, but a captivating personality is eternal.",
            "The heart wants what it wants, but the mind should guide the way."
        ]
    }
};

// Personality compatibility bonuses
export const personalityCompatibility = {
    'shy-bookworm': { 'serious-scholar': 2, 'gentle-healer': 1, 'noble-protector': 1 },
    'bold-adventurer': { 'mischievous-trickster': 2, 'free-spirit': 2, 'ambitious-leader': 1 },
    'mysterious-loner': { 'serious-scholar': 1, 'shy-bookworm': 1, 'noble-protector': -1 },
    'cheerful-optimist': { 'gentle-healer': 2, 'noble-protector': 1, 'shy-bookworm': 1 },
    'serious-scholar': { 'shy-bookworm': 2, 'mysterious-loner': 1, 'ambitious-leader': 1 },
    'flirtatious-charmer': { 'bold-adventurer': 1, 'mischievous-trickster': 1, 'ambitious-leader': 2 }
};

// Gift System - Available gifts for purchase and giving
export const giftItems = {
    books: [
        { name: 'Poetry Collection', icon: '📖', cost: 15, affectionBonus: 5, description: 'Beautiful verses that touch the heart' },
        { name: 'Adventure Novel', icon: '📚', cost: 20, affectionBonus: 6, description: 'Thrilling tales of heroic deeds' },
        { name: 'Magic Tome', icon: '📜', cost: 35, affectionBonus: 8, description: 'Ancient knowledge of mystical arts' },
        { name: 'Rare Manuscript', icon: '📋', cost: 50, affectionBonus: 12, description: 'Priceless historical document' }
    ],
    flowers: [
        { name: 'Wild Flowers', icon: '🌸', cost: 8, affectionBonus: 4, description: 'Simple but heartfelt bouquet' },
        { name: 'Rose Bouquet', icon: '🌹', cost: 18, affectionBonus: 7, description: 'Classic symbol of romance' },
        { name: 'Exotic Orchids', icon: '🌺', cost: 30, affectionBonus: 10, description: 'Rare and beautiful flowers' },
        { name: 'Enchanted Blossoms', icon: '✨', cost: 45, affectionBonus: 15, description: 'Magical flowers that never wilt' }
    ],
    jewelry: [
        { name: 'Simple Ring', icon: '💍', cost: 25, affectionBonus: 6, description: 'Elegant silver band' },
        { name: 'Pearl Necklace', icon: '📿', cost: 40, affectionBonus: 9, description: 'Lustrous pearls from the deep sea' },
        { name: 'Gemstone Earrings', icon: '💎', cost: 60, affectionBonus: 12, description: 'Sparkling precious stones' },
        { name: 'Royal Tiara', icon: '👑', cost: 100, affectionBonus: 20, description: 'Fit for royalty' }
    ],
    art: [
        { name: 'Sketch Portrait', icon: '🖼️', cost: 12, affectionBonus: 5, description: 'Personal charcoal drawing' },
        { name: 'Painted Landscape', icon: '🎨', cost: 28, affectionBonus: 8, description: 'Beautiful scenic artwork' },
        { name: 'Sculpture', icon: '🗿', cost: 45, affectionBonus: 11, description: 'Masterfully carved stone art' },
        { name: 'Magical Painting', icon: '✨', cost: 75, affectionBonus: 18, description: 'Artwork that moves and changes' }
    ],
    food: [
        { name: 'Chocolate Box', icon: '🍫', cost: 10, affectionBonus: 4, description: 'Sweet treats to share' },
        { name: 'Fruit Basket', icon: '🧺', cost: 15, affectionBonus: 5, description: 'Fresh seasonal fruits' },
        { name: 'Gourmet Meal', icon: '🍽️', cost: 25, affectionBonus: 8, description: 'Expertly prepared delicacies' },
        { name: 'Magical Feast', icon: '✨', cost: 50, affectionBonus: 15, description: 'Enchanted food that satisfies any craving' }
    ],
    weapons: [
        { name: 'Training Sword', icon: '🗡️', cost: 20, affectionBonus: 5, description: 'Perfect for practice sessions' },
        { name: 'Decorative Dagger', icon: '🔪', cost: 35, affectionBonus: 7, description: 'Beautiful ceremonial blade' },
        { name: 'Enchanted Weapon', icon: '⚔️', cost: 60, affectionBonus: 10, description: 'Magically enhanced armament' },
        { name: 'Legendary Blade', icon: '✨', cost: 120, affectionBonus: 22, description: 'Weapon of heroes and legends' }
    ]
};

// Gift giving outcomes based on preference match
export const giftOutcomes = {
    perfect: { multiplier: 2.0, message: "Their eyes light up with pure joy! This is exactly what they wanted!" },
    great: { multiplier: 1.5, message: "They smile warmly and seem genuinely pleased with your thoughtful gift." },
    good: { multiplier: 1.2, message: "They appreciate the gesture and thank you kindly." },
    neutral: { multiplier: 1.0, message: "They accept the gift politely, though they seem a bit unsure." },
    poor: { multiplier: 0.7, message: "They try to hide their disappointment but accept it graciously." },
    terrible: { multiplier: 0.3, message: "They look confused and uncomfortable. This clearly wasn't the right choice." }
};
