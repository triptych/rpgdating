/**
 * Game State Management Module
 * Handles the core game state and data structures
 */

// Game State
export let gameState = {
    player: {
        gold: 100,
        energy: 10,
        maxEnergy: 10,
        level: 1,
        experience: 0,
        totalPlayTime: 0,
        lastSaveTime: Date.now(),
        food: 20
    },
    party: [],
    inventory: [
        { id: 1, name: 'Iron Sword', type: 'weapon', icon: '⚔️', effect: '+5 Attack', rarity: 'common', value: 50 },
        { id: 2, name: 'Health Potion', type: 'consumable', icon: '🧪', effect: '+20 HP', rarity: 'common', value: 15 },
        { id: 3, name: 'Leather Armor', type: 'armor', icon: '🛡️', effect: '+3 Defense', rarity: 'common', value: 30 }
    ],
    recruitmentPool: [],
    currentLocation: 'tavern',
    dungeonProgress: {},
    passiveActivities: {}, // Track ongoing passive activities
    gameProgress: {
        dungeonsCompleted: {},
        achievementsUnlocked: [],
        totalDatesCompleted: 0,
        totalDungeonsCleared: 0,
        relationshipMilestones: {},
        locationsVisited: ['tavern'],
        totalGoldEarned: 0,
        totalEnergySpent: 0
    },
    settings: {
        autoSaveEnabled: true,
        autoSaveInterval: 30,
        soundEnabled: true,
        musicEnabled: true,
        animationsEnabled: true,
        confirmationDialogs: true
    },
    lastActivity: 'game_start'
};

// Update game state (for loading saves)
export function updateGameState(newState) {
    Object.assign(gameState, newState);
}

// Reset game state to initial values
export function resetGameState() {
    gameState.player = {
        gold: 100,
        energy: 10,
        maxEnergy: 10,
        level: 1,
        experience: 0,
        totalPlayTime: 0,
        lastSaveTime: Date.now(),
        food: 20
    };
    gameState.party = [];
    gameState.inventory = [
        { id: 1, name: 'Iron Sword', type: 'weapon', icon: '⚔️', effect: '+5 Attack', rarity: 'common', value: 50 },
        { id: 2, name: 'Health Potion', type: 'consumable', icon: '🧪', effect: '+20 HP', rarity: 'common', value: 15 },
        { id: 3, name: 'Leather Armor', type: 'armor', icon: '🛡️', effect: '+3 Defense', rarity: 'common', value: 30 }
    ];
    gameState.recruitmentPool = [];
    gameState.currentLocation = 'tavern';
    gameState.dungeonProgress = {};
    gameState.passiveActivities = {};
    gameState.gameProgress = {
        dungeonsCompleted: {},
        achievementsUnlocked: [],
        totalDatesCompleted: 0,
        totalDungeonsCleared: 0,
        relationshipMilestones: {},
        locationsVisited: ['tavern'],
        totalGoldEarned: 0,
        totalEnergySpent: 0
    };
    gameState.settings = {
        autoSaveEnabled: true,
        autoSaveInterval: 30,
        soundEnabled: true,
        musicEnabled: true,
        animationsEnabled: true,
        confirmationDialogs: true
    };
    gameState.lastActivity = 'game_start';
}
