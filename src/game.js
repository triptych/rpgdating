// Game State
let gameState = {
    player: {
        gold: 100,
        energy: 10,
        maxEnergy: 10,
        level: 1,
        experience: 0,
        totalPlayTime: 0,
        lastSaveTime: Date.now()
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

// Character Classes and their base stats
const characterClasses = {
    warrior: { name: 'Warrior', icon: '⚔️', baseStats: { attack: 12, defense: 10, magic: 4, agility: 6, charisma: 6, intelligence: 5 } },
    mage: { name: 'Mage', icon: '🔮', baseStats: { attack: 5, defense: 4, magic: 15, agility: 7, charisma: 8, intelligence: 12 } },
    rogue: { name: 'Rogue', icon: '🗡️', baseStats: { attack: 10, defense: 6, magic: 5, agility: 14, charisma: 9, intelligence: 8 } },
    cleric: { name: 'Cleric', icon: '✨', baseStats: { attack: 7, defense: 8, magic: 12, agility: 5, charisma: 12, intelligence: 9 } },
    archer: { name: 'Archer', icon: '🏹', baseStats: { attack: 11, defense: 6, magic: 6, agility: 12, charisma: 7, intelligence: 7 } },
    bard: { name: 'Bard', icon: '🎵', baseStats: { attack: 6, defense: 5, magic: 9, agility: 8, charisma: 15, intelligence: 10 } }
};

// Recruitment locations and their character preferences
const locations = {
    tavern: { name: 'Tavern', classes: ['warrior', 'rogue', 'bard'] },
    library: { name: 'Library', classes: ['mage', 'cleric'] },
    'training-grounds': { name: 'Training Grounds', classes: ['warrior', 'archer'] },
    temple: { name: 'Temple', classes: ['cleric', 'mage'] },
    forest: { name: 'Forest', classes: ['archer', 'rogue'] },
    market: { name: 'Market', classes: ['bard', 'rogue'] }
};

// Dating activities and their effects
const datingActivities = [
    { id: 'dinner', name: 'Fancy Dinner', icon: '🍽️', cost: 20, energyCost: 1, boosts: { charisma: 2, attack: 1 } },
    { id: 'training', name: 'Sparring Practice', icon: '⚔️', cost: 10, energyCost: 2, boosts: { attack: 3, defense: 1 } },
    { id: 'library', name: 'Study Together', icon: '📚', cost: 5, energyCost: 1, boosts: { intelligence: 3, magic: 2 } },
    { id: 'adventure', name: 'Mini Adventure', icon: '🗺️', cost: 15, energyCost: 2, boosts: { agility: 2, attack: 1, charisma: 1 } },
    { id: 'shopping', name: 'Shopping Spree', icon: '🛍️', cost: 25, energyCost: 1, boosts: { charisma: 2, intelligence: 1 } },
    { id: 'picnic', name: 'Romantic Picnic', icon: '🧺', cost: 12, energyCost: 1, boosts: { charisma: 3, defense: 1 } }
];

// Relationship levels
const relationshipLevels = [
    { name: 'Stranger', minAffection: 0, statBonus: 0 },
    { name: 'Acquaintance', minAffection: 10, statBonus: 1 },
    { name: 'Friend', minAffection: 25, statBonus: 2 },
    { name: 'Close Friend', minAffection: 50, statBonus: 3 },
    { name: 'Romantic Interest', minAffection: 80, statBonus: 4 },
    { name: 'Partner', minAffection: 120, statBonus: 5 },
    { name: 'Soulmate', minAffection: 200, statBonus: 6 }
];

// Character name pools
const characterNames = {
    male: ['Aiden', 'Blake', 'Connor', 'Derek', 'Ethan', 'Felix', 'Gabriel', 'Hunter', 'Ivan', 'Jasper', 'Marcus', 'Kieran', 'Aldric', 'Gareth', 'Thomas', 'Galahad', 'Dante', 'Maximilian', 'Jasper', 'Thane'],
    female: ['Aria', 'Bella', 'Clara', 'Diana', 'Emma', 'Fiona', 'Grace', 'Hazel', 'Iris', 'Luna', 'Elara', 'Zara', 'Raven', 'Sunny', 'Lydia', 'Isabella', 'Seraphina', 'Aurora', 'Willow', 'Victoria']
};

// Personality Types System
const personalityTypes = {
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
const personalityCompatibility = {
    'shy-bookworm': { 'serious-scholar': 2, 'gentle-healer': 1, 'noble-protector': 1 },
    'bold-adventurer': { 'mischievous-trickster': 2, 'free-spirit': 2, 'ambitious-leader': 1 },
    'mysterious-loner': { 'serious-scholar': 1, 'shy-bookworm': 1, 'noble-protector': -1 },
    'cheerful-optimist': { 'gentle-healer': 2, 'noble-protector': 1, 'shy-bookworm': 1 },
    'serious-scholar': { 'shy-bookworm': 2, 'mysterious-loner': 1, 'ambitious-leader': 1 },
    'flirtatious-charmer': { 'bold-adventurer': 1, 'mischievous-trickster': 1, 'ambitious-leader': 2 }
};

// Initialize the game
function initGame() {
    generateRecruitmentPool();
    updateUI();
    showSection('recruitment');
}

// Generate random characters for recruitment
function generateRecruitmentPool() {
    gameState.recruitmentPool = [];
    const location = locations[gameState.currentLocation];
    
    for (let i = 0; i < 6; i++) {
        const randomClass = location.classes[Math.floor(Math.random() * location.classes.length)];
        const character = generateCharacter(randomClass);
        gameState.recruitmentPool.push(character);
    }
}

// Generate a random character with personality
function generateCharacter(className) {
    const characterClass = characterClasses[className];
    const gender = Math.random() < 0.5 ? 'male' : 'female';
    const names = characterNames[gender];
    const name = names[Math.floor(Math.random() * names.length)];
    
    // Select random personality type
    const personalityKeys = Object.keys(personalityTypes);
    const personalityType = personalityKeys[Math.floor(Math.random() * personalityKeys.length)];
    const personality = personalityTypes[personalityType];
    
    // Add some randomness to base stats
    const stats = {};
    Object.keys(characterClass.baseStats).forEach(stat => {
        const variation = Math.floor(Math.random() * 5) - 2; // -2 to +2
        stats[stat] = Math.max(1, characterClass.baseStats[stat] + variation);
    });
    
    // Generate age between 18-35
    const age = Math.floor(Math.random() * 18) + 18;
    
    // Select random backstory and quotes
    const backstory = personality.backstoryTemplates[Math.floor(Math.random() * personality.backstoryTemplates.length)];
    const favoriteQuote = personality.quotes[Math.floor(Math.random() * personality.quotes.length)];
    
    // Generate goals and fears based on personality
    const goals = generatePersonalityGoals(personalityType);
    const fears = generatePersonalityFears(personalityType);
    
    return {
        id: Date.now() + Math.random(),
        name: name,
        class: className,
        className: characterClass.name,
        icon: characterClass.icon,
        gender: gender,
        age: age,
        personalityType: personalityType,
        personalityName: personality.name,
        traits: [...personality.traits],
        backstory: backstory,
        goals: goals,
        fears: fears,
        favoriteQuote: favoriteQuote,
        preferredActivities: [...personality.preferredActivities],
        dislikedActivities: [...personality.dislikedActivities],
        giftPreferences: {...personality.giftPreferences},
        stats: stats,
        affection: 0,
        level: 1,
        equipment: {},
        relationshipHistory: [],
        personalMemories: []
    };
}

// Generate personality-specific goals
function generatePersonalityGoals(personalityType) {
    const goalTemplates = {
        'shy-bookworm': [
            "Discover ancient magical knowledge",
            "Find someone who appreciates intellect over appearance",
            "Overcome social anxiety through meaningful connections"
        ],
        'bold-adventurer': [
            "Explore uncharted territories",
            "Find worthy companions for epic quests",
            "Prove courage in the face of legendary challenges"
        ],
        'mysterious-loner': [
            "Atone for past mistakes",
            "Find someone who accepts their dark history",
            "Master their dangerous abilities for good"
        ],
        'cheerful-optimist': [
            "Bring happiness to everyone they meet",
            "Help others find their inner light",
            "Spread hope in dark times"
        ],
        'serious-scholar': [
            "Advance knowledge for the betterment of all",
            "Find practical applications for theoretical research",
            "Bridge the gap between wisdom and action"
        ],
        'flirtatious-charmer': [
            "Find genuine love beyond surface attraction",
            "Use their influence for positive change",
            "Prove they're more than just a pretty face"
        ]
    };
    
    const templates = goalTemplates[personalityType] || ["Live life to the fullest"];
    return templates[Math.floor(Math.random() * templates.length)];
}

// Generate personality-specific fears
function generatePersonalityFears(personalityType) {
    const fearTemplates = {
        'shy-bookworm': [
            "Being judged for their awkwardness",
            "Public speaking or being center of attention",
            "Disappointing their mentors or loved ones"
        ],
        'bold-adventurer': [
            "Being trapped in routine or boredom",
            "Losing their freedom to explore",
            "Failing their team in crucial moments"
        ],
        'mysterious-loner': [
            "Their past catching up with them",
            "Being betrayed again by someone they trust",
            "Hurting innocent people with their power"
        ],
        'cheerful-optimist': [
            "Seeing others suffer without being able to help",
            "Losing their natural optimism",
            "Being unable to make someone smile"
        ],
        'serious-scholar': [
            "Being wrong about important research",
            "Intellectual stagnation or ignorance",
            "Misinterpreting crucial information"
        ],
        'flirtatious-charmer': [
            "Being loved only for their looks",
            "Growing old alone and forgotten",
            "Being seen as shallow or manipulative"
        ]
    };
    
    const templates = fearTemplates[personalityType] || ["Being forgotten"];
    return templates[Math.floor(Math.random() * templates.length)];
}

// Get relationship level based on affection
function getRelationshipLevel(affection) {
    for (let i = relationshipLevels.length - 1; i >= 0; i--) {
        if (affection >= relationshipLevels[i].minAffection) {
            return relationshipLevels[i];
        }
    }
    return relationshipLevels[0];
}

// UI Functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.game-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`${sectionName}-section`).classList.add('active');
    
    // Add active class to corresponding nav button
    const navButtons = document.querySelectorAll('.nav-btn');
    const sectionMap = {
        'recruitment': 0,
        'party': 1,
        'dating': 2,
        'dungeon': 3,
        'inventory': 4
    };
    
    if (sectionMap.hasOwnProperty(sectionName) && navButtons[sectionMap[sectionName]]) {
        navButtons[sectionMap[sectionName]].classList.add('active');
    }
    
    // Update section content
    switch(sectionName) {
        case 'recruitment':
            updateRecruitmentPool();
            break;
        case 'party':
            updatePartyDisplay();
            break;
        case 'dating':
            updateDatingSection();
            break;
        case 'dungeon':
            updateDungeonSection();
            break;
        case 'inventory':
            updateInventoryDisplay();
            break;
    }
}

function updateUI() {
    document.getElementById('player-gold').textContent = gameState.player.gold;
    document.getElementById('player-energy').textContent = `${gameState.player.energy}/${gameState.player.maxEnergy}`;
    document.getElementById('player-level').textContent = gameState.player.level;
}

function updateRecruitmentPool() {
    const location = document.getElementById('recruitment-location').value;
    if (location !== gameState.currentLocation) {
        gameState.currentLocation = location;
        generateRecruitmentPool();
    }
    
    const poolContainer = document.getElementById('recruitment-pool');
    poolContainer.innerHTML = '';
    
    gameState.recruitmentPool.forEach(character => {
        const characterCard = createCharacterCard(character, true);
        poolContainer.appendChild(characterCard);
    });
}

function createCharacterCard(character, isRecruitable = false) {
    const card = document.createElement('div');
    card.className = 'character-card';
    card.onclick = () => showCharacterDetails(character);
    
    const relationship = getRelationshipLevel(character.affection);
    
    card.innerHTML = `
        <div class="character-avatar">${character.icon}</div>
        <div class="character-name">${character.name}</div>
        <div class="character-class">${character.className}</div>
        <div class="character-stats">
            <div class="stat-item"><span>ATK:</span><span>${character.stats.attack}</span></div>
            <div class="stat-item"><span>DEF:</span><span>${character.stats.defense}</span></div>
            <div class="stat-item"><span>MAG:</span><span>${character.stats.magic}</span></div>
            <div class="stat-item"><span>AGI:</span><span>${character.stats.agility}</span></div>
            <div class="stat-item"><span>CHA:</span><span>${character.stats.charisma}</span></div>
            <div class="stat-item"><span>INT:</span><span>${character.stats.intelligence}</span></div>
        </div>
        ${!isRecruitable ? `<div class="relationship-level">${relationship.name} (${character.affection})</div>` : ''}
        ${isRecruitable ? 
            `<button class="recruit-btn" onclick="recruitCharacter('${character.id}')" ${gameState.party.length >= 4 || gameState.player.gold < 50 ? 'disabled' : ''}>
                Recruit (50 Gold)
            </button>` : ''
        }
    `;
    
    return card;
}

function recruitCharacter(characterId) {
    if (gameState.party.length >= 4) {
        alert('Your party is full! (Maximum 4 members)');
        return;
    }
    
    if (gameState.player.gold < 50) {
        alert('Not enough gold to recruit this character!');
        return;
    }
    
    const character = gameState.recruitmentPool.find(c => c.id == characterId);
    if (character) {
        gameState.player.gold -= 50;
        gameState.party.push(character);
        gameState.recruitmentPool = gameState.recruitmentPool.filter(c => c.id != characterId);
        
        updateUI();
        updateRecruitmentPool();
        
        alert(`${character.name} has joined your party!`);
    }
}

function updatePartyDisplay() {
    const partyContainer = document.getElementById('party-members');
    partyContainer.innerHTML = '';
    
    if (gameState.party.length === 0) {
        partyContainer.innerHTML = '<p>No party members yet. Visit the Recruitment section to find companions!</p>';
        return;
    }
    
    gameState.party.forEach(character => {
        const characterCard = createCharacterCard(character, false);
        partyContainer.appendChild(characterCard);
    });
}

function updateDatingSection() {
    const partnerSelect = document.getElementById('dating-partner');
    partnerSelect.innerHTML = '<option value="">Select a party member</option>';
    
    gameState.party.forEach(character => {
        const option = document.createElement('option');
        option.value = character.id;
        option.textContent = `${character.name} (${character.className})`;
        partnerSelect.appendChild(option);
    });
    
    updateDatingActivities();
}

function updateDatingActivities() {
    const activitiesContainer = document.getElementById('dating-activities');
    activitiesContainer.innerHTML = '';
    
    const selectedPartnerId = document.getElementById('dating-partner').value;
    if (!selectedPartnerId) {
        activitiesContainer.innerHTML = '<p>Select a party member to see available dating activities.</p>';
        return;
    }
    
    datingActivities.forEach(activity => {
        const activityCard = document.createElement('div');
        activityCard.className = 'activity-card';
        activityCard.onclick = () => startDatingActivity(selectedPartnerId, activity.id);
        
        const boostText = Object.entries(activity.boosts)
            .map(([stat, boost]) => `+${boost} ${stat.toUpperCase()}`)
            .join(', ');
        
        activityCard.innerHTML = `
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-name">${activity.name}</div>
            <div class="activity-cost">💰 ${activity.cost} Gold | ⚡ ${activity.energyCost} Energy</div>
            <div class="activity-boost">${boostText}</div>
        `;
        
        if (gameState.player.gold < activity.cost || gameState.player.energy < activity.energyCost) {
            activityCard.style.opacity = '0.5';
            activityCard.style.cursor = 'not-allowed';
        }
        
        activitiesContainer.appendChild(activityCard);
    });
}

function startDatingActivity(partnerId, activityId) {
    const partner = gameState.party.find(c => c.id == partnerId);
    const activity = datingActivities.find(a => a.id === activityId);
    
    if (!partner || !activity) return;
    
    if (gameState.player.gold < activity.cost) {
        alert('Not enough gold for this activity!');
        return;
    }
    
    if (gameState.player.energy < activity.energyCost) {
        alert('Not enough energy for this activity!');
        return;
    }
    
    // Deduct costs
    gameState.player.gold -= activity.cost;
    gameState.player.energy -= activity.energyCost;
    
    // Apply stat boosts
    Object.entries(activity.boosts).forEach(([stat, boost]) => {
        partner.stats[stat] += boost;
    });
    
    // Increase affection
    const affectionGain = Math.floor(Math.random() * 5) + 3; // 3-7 affection
    partner.affection += affectionGain;
    
    updateUI();
    updateDatingActivities();
    
    alert(`${partner.name} enjoyed the ${activity.name}! Affection increased by ${affectionGain}.`);
}

function updateDungeonSection() {
    const partyContainer = document.getElementById('dungeon-party');
    partyContainer.innerHTML = '';
    
    if (gameState.party.length === 0) {
        partyContainer.innerHTML = '<p>You need party members to explore dungeons!</p>';
        return;
    }
    
    gameState.party.forEach(character => {
        const slot = document.createElement('div');
        slot.className = 'formation-slot filled';
        slot.innerHTML = `
            <div>
                <div style="font-size: 2rem;">${character.icon}</div>
                <div style="font-size: 0.9rem;">${character.name}</div>
                <div style="font-size: 0.8rem;">Lvl ${character.level}</div>
            </div>
        `;
        partyContainer.appendChild(slot);
    });
    
    // Fill empty slots
    for (let i = gameState.party.length; i < 4; i++) {
        const slot = document.createElement('div');
        slot.className = 'formation-slot';
        slot.innerHTML = '<div style="color: #bdc3c7;">Empty Slot</div>';
        partyContainer.appendChild(slot);
    }
}

function startDungeon() {
    if (gameState.party.length === 0) {
        alert('You need at least one party member to enter a dungeon!');
        return;
    }
    
    if (gameState.player.energy < 3) {
        alert('You need at least 3 energy to enter a dungeon!');
        return;
    }
    
    const dungeonType = document.getElementById('dungeon-choice').value;
    
    // Deduct energy
    gameState.player.energy -= 3;
    updateUI();
    
    // Start battle simulation
    simulateDungeonBattle(dungeonType);
}

function simulateDungeonBattle(dungeonType) {
    const dungeons = {
        'goblin-caves': { name: 'Goblin Caves', difficulty: 1, enemies: ['Goblin', 'Goblin Warrior'], rewards: { gold: 30, experience: 50 } },
        'haunted-mansion': { name: 'Haunted Mansion', difficulty: 2, enemies: ['Ghost', 'Skeleton'], rewards: { gold: 60, experience: 100 } },
        'dragon-lair': { name: "Dragon's Lair", difficulty: 3, enemies: ['Dragon Minion', 'Young Dragon'], rewards: { gold: 120, experience: 200 } }
    };
    
    const dungeon = dungeons[dungeonType];
    
    // Calculate party strength
    let partyStrength = 0;
    gameState.party.forEach(character => {
        const relationship = getRelationshipLevel(character.affection);
        const bonus = relationship.statBonus;
        partyStrength += character.stats.attack + character.stats.defense + character.stats.magic + bonus * 3;
    });
    
    const requiredStrength = dungeon.difficulty * 40;
    const success = partyStrength >= requiredStrength * 0.8; // 80% threshold for success
    
    // Show battle modal
    showBattleResult(dungeon, success, partyStrength, requiredStrength);
}

function showBattleResult(dungeon, success, partyStrength, requiredStrength) {
    const modal = document.getElementById('battle-modal');
    const battleArea = document.getElementById('battle-area');
    
    if (success) {
        gameState.player.gold += dungeon.rewards.gold;
        gameState.party.forEach(character => {
            character.level += Math.floor(dungeon.rewards.experience / 100);
        });
        
        battleArea.innerHTML = `
            <h3>Victory!</h3>
            <p>Your party successfully conquered the ${dungeon.name}!</p>
            <div class="battle-participants">
                <div class="battle-party">
                    <h4>Your Party (Strength: ${partyStrength})</h4>
                    ${gameState.party.map(c => `<div>${c.icon} ${c.name}</div>`).join('')}
                </div>
                <div class="battle-enemies">
                    <h4>Enemies Defeated</h4>
                    ${dungeon.enemies.map(e => `<div>💀 ${e}</div>`).join('')}
                </div>
            </div>
            <div class="battle-log">
                <div>🎉 Victory achieved!</div>
                <div>💰 +${dungeon.rewards.gold} Gold</div>
                <div>⭐ +${dungeon.rewards.experience} Experience</div>
                <div>📈 Party members leveled up!</div>
            </div>
            <button class="battle-btn" onclick="closeBattleModal()">Continue</button>
        `;
    } else {
        battleArea.innerHTML = `
            <h3>Defeat...</h3>
            <p>Your party was not strong enough for the ${dungeon.name}.</p>
            <div class="battle-participants">
                <div class="battle-party">
                    <h4>Your Party (Strength: ${partyStrength})</h4>
                    ${gameState.party.map(c => `<div>${c.icon} ${c.name}</div>`).join('')}
                </div>
                <div class="battle-enemies">
                    <h4>Enemies (Required: ${requiredStrength})</h4>
                    ${dungeon.enemies.map(e => `<div>💀 ${e}</div>`).join('')}
                </div>
            </div>
            <div class="battle-log">
                <div>💔 Your party was defeated...</div>
                <div>💡 Try dating your party members to boost their stats!</div>
                <div>📈 Stronger relationships = Better combat performance</div>
            </div>
            <button class="battle-btn" onclick="closeBattleModal()">Retreat</button>
        `;
    }
    
    modal.style.display = 'block';
}

function closeBattleModal() {
    document.getElementById('battle-modal').style.display = 'none';
    updateUI();
    updateDungeonSection();
}

function updateInventoryDisplay() {
    const inventoryGrid = document.getElementById('inventory-grid');
    inventoryGrid.innerHTML = '';
    
    if (gameState.inventory.length === 0) {
        inventoryGrid.innerHTML = '<p>Your inventory is empty.</p>';
        return;
    }
    
    gameState.inventory.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        
        itemCard.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div class="item-name">${item.name}</div>
            <div class="item-type">${item.type}</div>
            <div class="item-effect">${item.effect}</div>
        `;
        
        inventoryGrid.appendChild(itemCard);
    });
}

function showCharacterDetails(character) {
    const modal = document.getElementById('character-modal');
    const detailsContainer = document.getElementById('character-details');
    
    const relationship = getRelationshipLevel(character.affection);
    
    // Check if character has new personality system data
    const hasPersonality = character.personalityType && character.personalityName;
    
    detailsContainer.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">${character.icon}</div>
            <h2>${character.name}</h2>
            <h3>${character.className}${character.age ? `, Age ${character.age}` : ''}</h3>
            <div class="relationship-level" style="margin: 1rem 0;">${relationship.name} (${character.affection} affection)</div>
            ${hasPersonality ? `<div class="personality-type" style="background: #e8f4fd; padding: 0.5rem; border-radius: 5px; margin: 0.5rem 0; color: #2c3e50;"><strong>Personality:</strong> ${character.personalityName}</div>` : ''}
        </div>
        
        ${hasPersonality ? `
        <div class="character-profile-tabs" style="margin: 1rem 0;">
            <button class="profile-tab-btn active" onclick="showProfileTab('stats', '${character.id}')">Stats</button>
            <button class="profile-tab-btn" onclick="showProfileTab('personality', '${character.id}')">Personality</button>
            <button class="profile-tab-btn" onclick="showProfileTab('backstory', '${character.id}')">Background</button>
        </div>
        
        <div id="profile-stats-${character.id}" class="profile-tab-content active">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin: 1rem 0;">
                <div class="stat-item"><strong>Attack:</strong> ${character.stats.attack + relationship.statBonus}</div>
                <div class="stat-item"><strong>Defense:</strong> ${character.stats.defense + relationship.statBonus}</div>
                <div class="stat-item"><strong>Magic:</strong> ${character.stats.magic + relationship.statBonus}</div>
                <div class="stat-item"><strong>Agility:</strong> ${character.stats.agility + relationship.statBonus}</div>
                <div class="stat-item"><strong>Charisma:</strong> ${character.stats.charisma + relationship.statBonus}</div>
                <div class="stat-item"><strong>Intelligence:</strong> ${character.stats.intelligence + relationship.statBonus}</div>
            </div>
            <p style="margin-top: 1rem; font-style: italic;">
                ${relationship.statBonus > 0 ? `All stats boosted by +${relationship.statBonus} due to relationship level!` : 'Improve your relationship to unlock stat bonuses!'}
            </p>
        </div>
        
        <div id="profile-personality-${character.id}" class="profile-tab-content">
            <div class="personality-info">
                <div class="info-section">
                    <h4>Traits</h4>
                    <div class="traits-list">
                        ${character.traits ? character.traits.map(trait => `<span class="trait-tag">${trait}</span>`).join('') : 'Unknown'}
                    </div>
                </div>
                
                <div class="info-section">
                    <h4>Preferred Activities</h4>
                    <p>${character.preferredActivities ? character.preferredActivities.map(activity => activity.charAt(0).toUpperCase() + activity.slice(1)).join(', ') : 'Unknown'}</p>
                </div>
                
                <div class="info-section">
                    <h4>Dislikes</h4>
                    <p>${character.dislikedActivities ? character.dislikedActivities.map(activity => activity.charAt(0).toUpperCase() + activity.slice(1)).join(', ') : 'Unknown'}</p>
                </div>
                
                ${character.favoriteQuote ? `
                <div class="info-section">
                    <h4>Favorite Quote</h4>
                    <p style="font-style: italic; color: #7f8c8d;">"${character.favoriteQuote}"</p>
                </div>
                ` : ''}
            </div>
        </div>
        
        <div id="profile-backstory-${character.id}" class="profile-tab-content">
            <div class="backstory-info">
                ${character.backstory ? `
                <div class="info-section">
                    <h4>Background</h4>
                    <p>${character.backstory}</p>
                </div>
                ` : ''}
                
                ${character.goals ? `
                <div class="info-section">
                    <h4>Goals</h4>
                    <p>${character.goals}</p>
                </div>
                ` : ''}
                
                ${character.fears ? `
                <div class="info-section">
                    <h4>Fears</h4>
                    <p>${character.fears}</p>
                </div>
                ` : ''}
                
                ${character.relationshipHistory && character.relationshipHistory.length > 0 ? `
                <div class="info-section">
                    <h4>Relationship History</h4>
                    <div class="relationship-history">
                        ${character.relationshipHistory.slice(-3).map(event => `
                            <div class="history-item">
                                <span class="history-activity">${event.activity}</span>
                                <span class="history-outcome ${event.outcome}">${event.outcome}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
        ` : `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin: 1rem 0;">
            <div class="stat-item"><strong>Attack:</strong> ${character.stats.attack + relationship.statBonus}</div>
            <div class="stat-item"><strong>Defense:</strong> ${character.stats.defense + relationship.statBonus}</div>
            <div class="stat-item"><strong>Magic:</strong> ${character.stats.magic + relationship.statBonus}</div>
            <div class="stat-item"><strong>Agility:</strong> ${character.stats.agility + relationship.statBonus}</div>
            <div class="stat-item"><strong>Charisma:</strong> ${character.stats.charisma + relationship.statBonus}</div>
            <div class="stat-item"><strong>Intelligence:</strong> ${character.stats.intelligence + relationship.statBonus}</div>
        </div>
        <p style="margin-top: 1rem; font-style: italic;">
            ${relationship.statBonus > 0 ? `All stats boosted by +${relationship.statBonus} due to relationship level!` : 'Improve your relationship to unlock stat bonuses!'}
        </p>
        `}
    `;
    
    modal.style.display = 'block';
}

// Function to switch between profile tabs
function showProfileTab(tabName, characterId) {
    // Hide all tab contents
    document.querySelectorAll(`[id^="profile-"][id$="-${characterId}"]`).forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.profile-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`profile-${tabName}-${characterId}`).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

function closeModal() {
    document.getElementById('character-modal').style.display = 'none';
}

// Event listener for dating partner selection
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('dating-partner').addEventListener('change', updateDatingActivities);
});

// Energy regeneration (every 30 seconds in real-time)
setInterval(() => {
    if (gameState.player.energy < gameState.player.maxEnergy) {
        gameState.player.energy = Math.min(gameState.player.maxEnergy, gameState.player.energy + 1);
        updateUI();
    }
}, 30000);

// Save System Core Functions
class SaveSystem {
    constructor() {
        this.SAVE_KEY_PREFIX = 'rpg_dating_save_';
        this.SETTINGS_KEY = 'rpg_dating_settings';
        this.MAX_SAVE_SLOTS = 3;
        this.SAVE_VERSION = '1.0.0';
        this.autoSaveInterval = null;
    }

    // Create save data from current game state
    createSaveData(slotNumber = 1) {
        return {
            version: this.SAVE_VERSION,
            timestamp: Date.now(),
            saveSlot: slotNumber,
            playerName: gameState.playerName || "Player",
            player: { ...gameState.player },
            party: gameState.party.map(char => ({ ...char })),
            recruitmentPool: gameState.recruitmentPool.map(char => ({ ...char })),
            inventory: gameState.inventory.map(item => ({ ...item })),
            gameProgress: { ...gameState.gameProgress },
            settings: { ...gameState.settings },
            currentState: {
                currentLocation: gameState.currentLocation,
                activeSection: document.querySelector('.game-section.active')?.id || 'recruitment-section',
                lastActivity: gameState.lastActivity || 'game_start',
                energyRegenTimer: Date.now()
            }
        };
    }

    // Save game to specific slot
    saveGame(slotNumber = 1) {
        try {
            const saveData = this.createSaveData(slotNumber);
            const saveKey = this.SAVE_KEY_PREFIX + slotNumber;
            
            localStorage.setItem(saveKey, JSON.stringify(saveData));
            
            // Update last save time
            gameState.player.lastSaveTime = Date.now();
            
            // Show save confirmation
            this.showSaveNotification(`Game saved to slot ${slotNumber}`);
            
            return true;
        } catch (error) {
            console.error('Save failed:', error);
            this.showSaveNotification('Save failed: ' + error.message, 'error');
            return false;
        }
    }

    // Load game from specific slot
    loadGame(slotNumber = 1) {
        try {
            const saveKey = this.SAVE_KEY_PREFIX + slotNumber;
            const saveDataString = localStorage.getItem(saveKey);
            
            if (!saveDataString) {
                throw new Error(`No save data found in slot ${slotNumber}`);
            }
            
            const saveData = JSON.parse(saveDataString);
            
            // Validate save data
            if (!this.validateSaveData(saveData)) {
                throw new Error('Save data is corrupted or invalid');
            }
            
            // Apply save data to game state
            this.applySaveData(saveData);
            
            // Update UI
            updateUI();
            const sectionName = saveData.currentState?.activeSection?.replace('-section', '') || 'recruitment';
            showSection(sectionName);
            
            this.showSaveNotification(`Game loaded from slot ${slotNumber}`);
            
            return true;
        } catch (error) {
            console.error('Load failed:', error);
            this.showSaveNotification('Load failed: ' + error.message, 'error');
            return false;
        }
    }

    // Validate save data integrity
    validateSaveData(saveData) {
        const requiredFields = ['version', 'timestamp', 'player', 'party', 'inventory'];
        
        for (const field of requiredFields) {
            if (!(field in saveData)) {
                console.error(`Missing required field: ${field}`);
                return false;
            }
        }
        
        // Version compatibility check
        if (saveData.version !== this.SAVE_VERSION) {
            console.warn(`Save version mismatch: ${saveData.version} vs ${this.SAVE_VERSION}`);
            // Could implement migration logic here
        }
        
        // Validate player data
        if (!saveData.player.gold && saveData.player.gold !== 0) return false;
        if (!saveData.player.energy && saveData.player.energy !== 0) return false;
        
        return true;
    }

    // Apply loaded save data to game state
    applySaveData(saveData) {
        // Restore player data
        gameState.player = { ...saveData.player };
        
        // Restore party
        gameState.party = saveData.party.map(char => ({ ...char }));
        
        // Restore recruitment pool
        gameState.recruitmentPool = saveData.recruitmentPool?.map(char => ({ ...char })) || [];
        
        // Restore inventory
        gameState.inventory = saveData.inventory.map(item => ({ ...item }));
        
        // Restore game progress
        gameState.gameProgress = { ...saveData.gameProgress } || {};
        
        // Restore settings
        gameState.settings = { ...saveData.settings } || {};
        
        // Restore current state
        gameState.currentLocation = saveData.currentState?.currentLocation || 'tavern';
        gameState.lastActivity = saveData.currentState?.lastActivity || 'game_start';
        
        // Restore energy regeneration timer
        const timeDiff = Date.now() - (saveData.currentState?.energyRegenTimer || Date.now());
        const energyToRestore = Math.floor(timeDiff / 30000); // 30 seconds per energy
        gameState.player.energy = Math.min(
            gameState.player.maxEnergy,
            gameState.player.energy + energyToRestore
        );
    }

    // Auto-save functionality
    startAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        const interval = (gameState.settings?.autoSaveInterval || 30) * 1000;
        
        this.autoSaveInterval = setInterval(() => {
            if (gameState.settings?.autoSaveEnabled !== false) {
                this.saveGame(1); // Auto-save to slot 1
            }
        }, interval);
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    // Get save slot information
    getSaveSlotInfo(slotNumber) {
        try {
            const saveKey = this.SAVE_KEY_PREFIX + slotNumber;
            const saveDataString = localStorage.getItem(saveKey);
            
            if (!saveDataString) {
                return null;
            }
            
            const saveData = JSON.parse(saveDataString);
            
            return {
                slotNumber: slotNumber,
                playerName: saveData.playerName || "Player",
                level: saveData.player?.level || 1,
                gold: saveData.player?.gold || 0,
                partySize: saveData.party?.length || 0,
                timestamp: saveData.timestamp,
                playTime: saveData.player?.totalPlayTime || 0,
                lastLocation: saveData.currentState?.currentLocation || 'unknown'
            };
        } catch (error) {
            console.error(`Error reading save slot ${slotNumber}:`, error);
            return null;
        }
    }

    // Delete save slot
    deleteSaveSlot(slotNumber) {
        try {
            const saveKey = this.SAVE_KEY_PREFIX + slotNumber;
            localStorage.removeItem(saveKey);
            this.showSaveNotification(`Save slot ${slotNumber} deleted`);
            return true;
        } catch (error) {
            console.error('Delete failed:', error);
            this.showSaveNotification('Delete failed: ' + error.message, 'error');
            return false;
        }
    }

    // Show save/load notifications
    showSaveNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `save-notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Show continue game dialog
    showContinueGameDialog() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        const saveInfo = this.getSaveSlotInfo(1);
        const lastPlayedDate = new Date(saveInfo.timestamp).toLocaleDateString();
        
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Continue Game?</h3>
                <p>Found existing save data:</p>
                <div class="save-info">
                    <div>Player: ${saveInfo.playerName}</div>
                    <div>Level: ${saveInfo.level}</div>
                    <div>Gold: ${saveInfo.gold}</div>
                    <div>Party Members: ${saveInfo.partySize}</div>
                    <div>Last Played: ${lastPlayedDate}</div>
                </div>
                <div class="modal-buttons">
                    <button onclick="saveSystem.loadGame(1); document.body.removeChild(this.closest('.modal'))">Continue</button>
                    <button onclick="document.body.removeChild(this.closest('.modal'))">New Game</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Initialize save system
    init() {
        // Try to load auto-save on game start
        const autoSaveExists = localStorage.getItem(this.SAVE_KEY_PREFIX + '1');
        if (autoSaveExists) {
            // Show option to continue or start new game
            this.showContinueGameDialog();
        }
        
        // Start auto-save
        this.startAutoSave();
        
        // Save on page unload
        window.addEventListener('beforeunload', () => {
            if (gameState.settings?.autoSaveEnabled !== false) {
                this.saveGame(1);
            }
        });
    }
}

// Initialize save system
const saveSystem = new SaveSystem();

// Save/Load UI Functions
function openSaveLoadModal() {
    const modal = document.getElementById('save-load-modal');
    if (modal) {
        modal.style.display = 'block';
        updateSaveSlotInfo();
    }
}

function closeSaveLoadModal() {
    const modal = document.getElementById('save-load-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function showSaveLoadTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.save-load-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to corresponding tab button
    event.target.classList.add('active');
    
    // Update save slot info when switching tabs
    updateSaveSlotInfo();
}

function updateSaveSlotInfo() {
    for (let i = 1; i <= 3; i++) {
        const saveInfo = saveSystem.getSaveSlotInfo(i);
        const saveSlotInfo = document.getElementById(`save-slot-${i}-info`);
        const loadSlotInfo = document.getElementById(`load-slot-${i}-info`);
        const loadBtn = document.querySelector(`#load-tab .save-slot:nth-child(${i}) .load-btn`);
        
        if (saveInfo) {
            const lastPlayedDate = new Date(saveInfo.timestamp).toLocaleDateString();
            const infoText = `Level ${saveInfo.level} | ${saveInfo.gold} Gold | ${saveInfo.partySize} Party | ${lastPlayedDate}`;
            
            if (saveSlotInfo) saveSlotInfo.textContent = infoText;
            if (loadSlotInfo) loadSlotInfo.textContent = infoText;
            if (loadBtn) loadBtn.disabled = false;
        } else {
            if (saveSlotInfo) saveSlotInfo.textContent = 'Empty';
            if (loadSlotInfo) loadSlotInfo.textContent = 'Empty';
            if (loadBtn) loadBtn.disabled = true;
        }
    }
}

function saveToSlot(slotNumber) {
    saveSystem.saveGame(slotNumber);
    updateSaveSlotInfo();
}

function loadFromSlot(slotNumber) {
    if (saveSystem.loadGame(slotNumber)) {
        closeSaveLoadModal();
    }
}

function quickSave() {
    saveSystem.saveGame(1);
}

function toggleAutoSave(checkbox) {
    gameState.settings.autoSaveEnabled = checkbox.checked;
    if (checkbox.checked) {
        saveSystem.startAutoSave();
    } else {
        saveSystem.stopAutoSave();
    }
}

function setAutoSaveInterval(select) {
    gameState.settings.autoSaveInterval = parseInt(select.value);
    saveSystem.startAutoSave(); // Restart with new interval
}

function resetGame() {
    if (confirm('Are you sure you want to reset the game? This will delete all progress!')) {
        // Reset game state to initial values
        gameState = {
            player: {
                gold: 100,
                energy: 10,
                maxEnergy: 10,
                level: 1,
                experience: 0,
                totalPlayTime: 0,
                lastSaveTime: Date.now()
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
        
        // Regenerate recruitment pool and update UI
        generateRecruitmentPool();
        updateUI();
        showSection('recruitment');
        closeSaveLoadModal();
        
        saveSystem.showSaveNotification('Game reset successfully');
    }
}

function clearAllSaves() {
    if (confirm('Are you sure you want to delete all save files? This cannot be undone!')) {
        for (let i = 1; i <= 3; i++) {
            saveSystem.deleteSaveSlot(i);
        }
        updateSaveSlotInfo();
        saveSystem.showSaveNotification('All save files deleted');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize save system first
    saveSystem.init();
    
    // Then initialize game
    initGame();
});
