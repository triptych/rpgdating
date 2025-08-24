/**
 * Main Game Module
 * Refactored to use ES6 modules and the new character selector component
 */

import { gameState, updateGameState, resetGameState } from './modules/game-state.js';
import { 
    characterClasses, 
    locations, 
    datingActivities, 
    dungeonAreas, 
    passiveActivities, 
    storeItems, 
    relationshipLevels, 
    characterNames, 
    personalityTypes, 
    personalityCompatibility 
} from './modules/game-data.js';

// Character selector components
let recruitmentSelector, partySelector, datingSelector;

// Initialize the game
function initGame() {
    setupCharacterSelectors();
    generateRecruitmentPool();
    updateUI();
    showSection('recruitment');
}

// Setup character selector components
function setupCharacterSelectors() {
    recruitmentSelector = document.getElementById('recruitment-character-selector');
    partySelector = document.getElementById('party-character-selector');
    datingSelector = document.getElementById('dating-character-selector');

    // Setup event listeners for character selectors
    if (recruitmentSelector) {
        recruitmentSelector.onCharacterAction = (action, character) => {
            if (action === 'recruit') {
                recruitCharacter(character.id);
            }
        };
        recruitmentSelector.onCharacterSelect = (character) => {
            showCharacterDetails(character);
        };
    }

    if (partySelector) {
        partySelector.onCharacterSelect = (character) => {
            showCharacterDetails(character);
        };
    }

    if (datingSelector) {
        datingSelector.addEventListener('character-selected', (e) => {
            updateDatingActivities();
        });
        datingSelector.onCharacterSelect = (character) => {
            showCharacterDetails(character);
        };
    }
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
        'store': 4,
        'activities': 5,
        'inventory': 6
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
        case 'store':
            showStoreTab('buy');
            break;
        case 'activities':
            updateActivitiesSection();
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
    
    // Update food display if element exists
    const foodElement = document.getElementById('player-food');
    if (foodElement) {
        foodElement.textContent = gameState.player.food || 0;
    }
}

function updateRecruitmentPool() {
    const location = document.getElementById('recruitment-location').value;
    if (location !== gameState.currentLocation) {
        gameState.currentLocation = location;
        generateRecruitmentPool();
    }
    
    if (recruitmentSelector) {
        recruitmentSelector.setCharacters(gameState.recruitmentPool);
    }
}

async function recruitCharacter(characterId) {
    if (gameState.party.length >= 4) {
        await showAlert('Your party is full! (Maximum 4 members)', 'warning');
        return;
    }
    
    if (gameState.player.gold < 50) {
        await showAlert('Not enough gold to recruit this character!', 'error');
        return;
    }
    
    const character = gameState.recruitmentPool.find(c => c.id == characterId);
    if (character) {
        gameState.player.gold -= 50;
        gameState.party.push(character);
        gameState.recruitmentPool = gameState.recruitmentPool.filter(c => c.id != characterId);
        
        updateUI();
        updateRecruitmentPool();
        updatePartyDisplay();
        updateDatingSection();
        
        await showAlert(`${character.name} has joined your party!`, 'success');
    }
}

function updatePartyDisplay() {
    if (partySelector) {
        partySelector.setCharacters(gameState.party);
    }
}

function updateDatingSection() {
    if (datingSelector) {
        datingSelector.setCharacters(gameState.party);
    }
    updateDatingActivities();
}

function updateDatingActivities() {
    const activitiesContainer = document.getElementById('dating-activities');
    activitiesContainer.innerHTML = '';
    
    const selectedCharacterId = datingSelector ? datingSelector.getSelectedCharacter() : null;
    if (!selectedCharacterId) {
        activitiesContainer.innerHTML = '<p>Select a party member to see available dating activities.</p>';
        return;
    }
    
    datingActivities.forEach(activity => {
        const activityCard = document.createElement('div');
        activityCard.className = 'activity-card';
        activityCard.onclick = () => startDatingActivity(selectedCharacterId, activity.id);
        
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

async function startDatingActivity(partnerId, activityId) {
    const partner = gameState.party.find(c => c.id == partnerId);
    const activity = datingActivities.find(a => a.id === activityId);
    
    if (!partner || !activity) return;
    
    if (gameState.player.gold < activity.cost) {
        await showAlert('Not enough gold for this activity!', 'error');
        return;
    }
    
    if (gameState.player.energy < activity.energyCost) {
        await showAlert('Not enough energy for this activity!', 'error');
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
    updatePartyDisplay(); // Update to show new affection levels
    
    await showAlert(`${partner.name} enjoyed the ${activity.name}! Affection increased by ${affectionGain}.`, 'success');
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

async function startDungeon() {
    if (gameState.party.length === 0) {
        await showAlert('You need at least one party member to enter a dungeon!', 'warning');
        return;
    }
    
    const dungeonType = document.getElementById('dungeon-choice').value;
    const dungeon = dungeonAreas[dungeonType];
    
    if (!dungeon) {
        await showAlert('Invalid dungeon selected!', 'error');
        return;
    }
    
    if (gameState.player.energy < dungeon.energyCost) {
        await showAlert(`You need at least ${dungeon.energyCost} energy to enter this dungeon!`, 'warning');
        return;
    }
    
    // Deduct energy
    gameState.player.energy -= dungeon.energyCost;
    updateUI();
    
    // Start battle simulation
    simulateNewDungeonBattle(dungeonType);
}

function simulateNewDungeonBattle(dungeonType) {
    const dungeon = dungeonAreas[dungeonType];
    
    // Calculate party strength
    let partyStrength = 0;
    gameState.party.forEach(character => {
        const relationship = getRelationshipLevel(character.affection);
        const bonus = relationship.statBonus;
        partyStrength += character.stats.attack + character.stats.defense + character.stats.magic + bonus * 3;
    });
    
    const requiredStrength = dungeon.difficulty * 30;
    const success = partyStrength >= requiredStrength * 0.7; // 70% threshold for success
    
    let rewards = {
        gold: dungeon.rewards.gold[0] + Math.floor(Math.random() * (dungeon.rewards.gold[1] - dungeon.rewards.gold[0] + 1)),
        experience: dungeon.rewards.experience[0] + Math.floor(Math.random() * (dungeon.rewards.experience[1] - dungeon.rewards.experience[0] + 1))
    };
    
    let lootFound = [];
    
    if (success) {
        // Generate loot based on loot table
        const numLootRolls = Math.floor(Math.random() * 3) + 1; // 1-3 items
        for (let i = 0; i < numLootRolls; i++) {
            const loot = generateLoot(dungeon.lootTable);
            if (loot) {
                lootFound.push(loot);
                // Add to inventory
                gameState.inventory.push({
                    id: Date.now() + Math.random(),
                    ...loot
                });
            }
        }
        
        // Apply rewards
        gameState.player.gold += rewards.gold;
        gameState.party.forEach(character => {
            character.level += Math.floor(rewards.experience / 100);
        });
        
        // Track progress
        if (!gameState.gameProgress.dungeonsCompleted[dungeonType]) {
            gameState.gameProgress.dungeonsCompleted[dungeonType] = 0;
        }
        gameState.gameProgress.dungeonsCompleted[dungeonType]++;
        gameState.gameProgress.totalDungeonsCleared++;
    }
    
    // Show battle modal
    showNewBattleResult(dungeon, success, partyStrength, requiredStrength, rewards, lootFound);
}

function generateLoot(lootTable) {
    const roll = Math.random();
    let cumulativeWeight = 0;
    
    for (const item of lootTable) {
        cumulativeWeight += item.weight;
        if (roll <= cumulativeWeight) {
            return { ...item };
        }
    }
    
    return null; // No loot
}

function showNewBattleResult(dungeon, success, partyStrength, requiredStrength, rewards, lootFound) {
    const modal = document.getElementById('battle-modal');
    const battleArea = document.getElementById('battle-area');
    
    if (success) {
        const lootDisplay = lootFound.length > 0 ? 
            `<div class="loot-found">
                <h4>Loot Found:</h4>
                ${lootFound.map(item => `<div class="loot-item">${item.icon} ${item.name} (${item.rarity})</div>`).join('')}
            </div>` : '<div>No special loot found this time.</div>';
        
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
                <div>💰 +${rewards.gold} Gold</div>
                <div>⭐ +${rewards.experience} Experience</div>
                <div>📈 Party members leveled up!</div>
                ${lootDisplay}
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
                <div>🏋️ This dungeon specializes in: ${dungeon.lootSpecialty}</div>
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
    
    gameState.inventory.forEach((item, index) => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        
        // Check if item is equippable
        const isEquippable = item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory';
        
        itemCard.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div class="item-name">${item.name}</div>
            <div class="item-type">${item.type}</div>
            <div class="item-effect">${item.effect}</div>
            ${isEquippable ? `<button class="equip-btn" onclick="showEquipModal(${index})">Equip</button>` : ''}
        `;
        
        inventoryGrid.appendChild(itemCard);
    });
}

// Equipment System Functions
function showEquipModal(itemIndex) {
    const item = gameState.inventory[itemIndex];
    
    if (!item || (item.type !== 'weapon' && item.type !== 'armor' && item.type !== 'accessory')) {
        showAlert('This item cannot be equipped!', 'error');
        return;
    }
    
    // Show modal with party members who can equip this item
    const availableCharacters = [...gameState.party];
    
    // Add player as an option
    const playerCharacter = {
        id: 'player',
        name: 'Player',
        icon: '👤',
        className: 'Player',
        equipment: gameState.player.equipment || {}
    };
    availableCharacters.unshift(playerCharacter);
    
    const characterList = availableCharacters.map(char => {
        const currentEquipped = char.equipment && char.equipment[item.type];
        const currentEquippedText = currentEquipped ? 
            `<div style="font-size: 0.8rem; color: #e74c3c;">Currently: ${currentEquipped.name}</div>` : 
            `<div style="font-size: 0.8rem; color: #7f8c8d;">No ${item.type} equipped</div>`;
        
        return `<div class="assignment-option" onclick="equipItemToCharacter(${itemIndex}, '${char.id}')">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.5rem;">${char.icon}</span>
                <div>
                    <div style="font-weight: bold;">${char.name} (${char.className})</div>
                    ${currentEquippedText}
                </div>
            </div>
        </div>`;
    }).join('');
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="document.body.removeChild(this.closest('.modal'))">&times;</span>
            <h3>Equip ${item.name}</h3>
            <div style="text-align: center; margin: 1rem 0;">
                <div style="font-size: 2rem;">${item.icon}</div>
                <div style="font-weight: bold;">${item.name}</div>
                <div style="color: #7f8c8d;">${item.type}</div>
                <div style="color: #27ae60; margin: 0.5rem 0;">${item.effect}</div>
            </div>
            <div class="character-selection">
                <h4>Select Character:</h4>
                ${characterList}
            </div>
            <button onclick="document.body.removeChild(this.closest('.modal'))" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #95a5a6; color: white; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

async function equipItemToCharacter(itemIndex, characterId) {
    const item = gameState.inventory[itemIndex];
    
    if (!item) return;
    
    let character;
    if (characterId === 'player') {
        character = gameState.player;
        if (!character.equipment) character.equipment = {};
    } else {
        character = gameState.party.find(c => c.id == characterId);
        if (!character) return;
        if (!character.equipment) character.equipment = {};
    }
    
    // Check if character already has an item of this type equipped
    const currentEquipped = character.equipment[item.type];
    
    // Unequip current item if exists
    if (currentEquipped) {
        gameState.inventory.push({
            id: Date.now() + Math.random(),
            ...currentEquipped
        });
    }
    
    // Equip new item
    character.equipment[item.type] = { ...item };
    
    // Remove item from inventory
    gameState.inventory.splice(itemIndex, 1);
    
    // Close modal
    const modal = document.querySelector('.modal');
    if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal);
    }
    
    // Update displays
    updateInventoryDisplay();
    updatePartyDisplay();
    
    const characterName = characterId === 'player' ? 'Player' : character.name;
    await showAlert(`${item.name} equipped to ${characterName}!`, 'success');
}

function unequipItem(characterId, itemType) {
    let character;
    if (characterId === 'player') {
        character = gameState.player;
    } else {
        character = gameState.party.find(c => c.id == characterId);
    }
    
    if (!character || !character.equipment || !character.equipment[itemType]) {
        return;
    }
    
    const item = character.equipment[itemType];
    
    // Add item back to inventory
    gameState.inventory.push({
        id: Date.now() + Math.random(),
        ...item
    });
    
    // Remove from equipment
    delete character.equipment[itemType];
    
    updateInventoryDisplay();
    updatePartyDisplay();
    
    const characterName = characterId === 'player' ? 'Player' : character.name;
    showAlert(`${item.name} unequipped from ${characterName}!`, 'success');
}

// Calculate total stats including equipment bonuses
function calculateTotalStats(character) {
    const baseStats = { ...character.stats };
    const equipment = character.equipment || {};
    
    // Apply equipment bonuses
    Object.values(equipment).forEach(item => {
        if (item.effect) {
            // Parse effect string to extract stat bonuses
            const effectMatch = item.effect.match(/\+(\d+)\s+(\w+)/g);
            if (effectMatch) {
                effectMatch.forEach(match => {
                    const [, bonus, stat] = match.match(/\+(\d+)\s+(\w+)/);
                    const statName = stat.toLowerCase();
                    if (baseStats[statName] !== undefined) {
                        baseStats[statName] += parseInt(bonus);
                    }
                });
            }
        }
    });
    
    return baseStats;
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

// Store Functions
function showStoreTab(tabName) {
    // Hide all store tabs
    document.querySelectorAll('.store-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.store-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    if (tabName === 'buy') {
        showStoreCategory('weapons');
    } else {
        updateSellItems();
    }
}

function showStoreCategory(category) {
    // Remove active class from all category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    const storeItemsContainer = document.getElementById('store-items');
    storeItemsContainer.innerHTML = '';
    
    const items = storeItems[category] || [];
    
    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'store-item-card';
        itemCard.onclick = () => buyItem(item);
        
        itemCard.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div class="item-name">${item.name}</div>
            <div class="item-effect">${item.effect}</div>
            <div class="item-price">💰 ${item.buyPrice} Gold</div>
            <div class="item-rarity ${item.rarity}">${item.rarity}</div>
        `;
        
        if (gameState.player.gold < item.buyPrice) {
            itemCard.style.opacity = '0.5';
            itemCard.style.cursor = 'not-allowed';
        }
        
        storeItemsContainer.appendChild(itemCard);
    });
}

async function buyItem(item) {
    if (gameState.player.gold < item.buyPrice) {
        await showAlert('Not enough gold to buy this item!', 'error');
        return;
    }
    
    gameState.player.gold -= item.buyPrice;
    gameState.inventory.push({
        id: Date.now() + Math.random(),
        name: item.name,
        type: item.type,
        icon: item.icon,
        effect: item.effect,
        rarity: item.rarity,
        value: item.sellPrice
    });
    
    updateUI();
    await showAlert(`Purchased ${item.name} for ${item.buyPrice} gold!`, 'success');
}

function updateSellItems() {
    const sellItemsContainer = document.getElementById('sell-items');
    sellItemsContainer.innerHTML = '';
    
    if (gameState.inventory.length === 0) {
        sellItemsContainer.innerHTML = '<p>No items to sell.</p>';
        return;
    }
    
    gameState.inventory.forEach((item, index) => {
        const itemCard = document.createElement('div');
        itemCard.className = 'store-item-card';
        itemCard.onclick = () => sellItem(index);
        
        const sellPrice = item.value || Math.floor((item.buyPrice || 50) * 0.6);
        
        itemCard.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div class="item-name">${item.name}</div>
            <div class="item-effect">${item.effect}</div>
            <div class="item-price">💰 ${sellPrice} Gold</div>
            <div class="item-rarity ${item.rarity || 'common'}">${item.rarity || 'common'}</div>
        `;
        
        sellItemsContainer.appendChild(itemCard);
    });
}

async function sellItem(itemIndex) {
    const item = gameState.inventory[itemIndex];
    const sellPrice = item.value || Math.floor((item.buyPrice || 50) * 0.6);
    
    const confirmed = await showConfirm(`Sell ${item.name} for ${sellPrice} gold?`);
    if (confirmed) {
        gameState.player.gold += sellPrice;
        gameState.inventory.splice(itemIndex, 1);
        
        updateUI();
        updateSellItems();
        await showAlert(`Sold ${item.name} for ${sellPrice} gold!`, 'success');
    }
}

// Passive Activities Functions
function updateActivitiesSection() {
    updateAvailableActivities();
    updateActiveAssignments();
}

function updateAvailableActivities() {
    const activitiesContainer = document.getElementById('available-activities');
    activitiesContainer.innerHTML = '';
    
    Object.entries(passiveActivities).forEach(([activityId, activity]) => {
        const activityCard = document.createElement('div');
        activityCard.className = 'activity-card';
        
        const duration = Math.floor(activity.duration / 60000); // Convert to minutes
        const rewardText = Object.entries(activity.rewards)
            .map(([type, range]) => {
                if (Array.isArray(range)) {
                    return `${range[0]}-${range[1]} ${type}`;
                }
                return `${range} ${type}`;
            }).join(', ');
        
        const reqText = Object.entries(activity.requiredStats)
            .map(([stat, value]) => `${stat} ${value}+`)
            .join(', ');
        
        activityCard.innerHTML = `
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-name">${activity.name}</div>
            <div class="activity-description">${activity.description}</div>
            <div class="activity-duration">⏱️ ${duration} minutes</div>
            <div class="activity-rewards">Rewards: ${rewardText}</div>
            <div class="activity-requirements">Requires: ${reqText}</div>
            <button class="assign-btn" onclick="showAssignmentModal('${activityId}')">Assign Character</button>
        `;
        
        activitiesContainer.appendChild(activityCard);
    });
}

async function showAssignmentModal(activityId) {
    const activity = passiveActivities[activityId];
    const availableCharacters = gameState.party.filter(character => {
        // Check if character meets requirements
        return Object.entries(activity.requiredStats).every(([stat, required]) => {
            return character.stats[stat] >= required;
        });
    }).filter(character => {
        // Check if character is not already assigned
        return !Object.values(gameState.passiveActivities).some(assignment => 
            assignment.characterId === character.id
        );
    });
    
    if (availableCharacters.length === 0) {
        await showAlert('No available characters meet the requirements for this activity!', 'warning');
        return;
    }
    
    // Create character selection with detailed stats
    const characterList = availableCharacters.map(char => {
        const meetsReqs = Object.entries(activity.requiredStats).map(([stat, required]) => {
            const current = char.stats[stat];
            const meets = current >= required;
            return `<span style="color: ${meets ? '#27ae60' : '#e74c3c'}">${stat}: ${current}/${required}</span>`;
        }).join(', ');
        
        return `<div class="assignment-option" onclick="assignCharacterToActivity('${char.id}', '${activityId}')">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.5rem;">${char.icon}</span>
                <div>
                    <div style="font-weight: bold;">${char.name} (${char.className})</div>
                    <div style="font-size: 0.8rem; color: #7f8c8d;">${meetsReqs}</div>
                </div>
            </div>
        </div>`;
    }).join('');
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="document.body.removeChild(this.closest('.modal'))">&times;</span>
            <h3>Assign Character to ${activity.name}</h3>
            <p>${activity.description}</p>
            <div style="margin: 1rem 0;">
                <strong>Requirements:</strong> ${Object.entries(activity.requiredStats).map(([stat, req]) => `${stat} ${req}+`).join(', ')}
            </div>
            <div style="margin: 1rem 0;">
                <strong>Duration:</strong> ${Math.floor(activity.duration / 60000)} minutes
            </div>
            <div style="margin: 1rem 0;">
                <strong>Rewards:</strong> ${Object.entries(activity.rewards).map(([type, range]) => {
                    if (Array.isArray(range)) {
                        return `${range[0]}-${range[1]} ${type}`;
                    }
                    return `${range.join(', ')} ${type}`;
                }).join(', ')}
            </div>
            <div class="character-selection">
                <h4>Select Character:</h4>
                ${characterList}
            </div>
            <button onclick="document.body.removeChild(this.closest('.modal'))" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #95a5a6; color: white; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

async function assignCharacterToActivity(characterId, activityId) {
    const character = gameState.party.find(c => c.id == characterId);
    const activity = passiveActivities[activityId];
    
    if (!character || !activity) return;
    
    const assignmentId = Date.now() + Math.random();
    gameState.passiveActivities[assignmentId] = {
        characterId: characterId,
        activityId: activityId,
        startTime: Date.now(),
        endTime: Date.now() + activity.duration
    };
    
    // Close modal
    const modal = document.querySelector('.modal');
    if (modal) {
        document.body.removeChild(modal);
    }
    
    updateActiveAssignments();
    updateAvailableActivities();
    
    await showAlert(`${character.name} has been assigned to ${activity.name}!`, 'success');
}

function updateActiveAssignments() {
    const assignmentsContainer = document.getElementById('active-assignments');
    assignmentsContainer.innerHTML = '';
    
    const activeAssignments = Object.entries(gameState.passiveActivities);
    
    if (activeAssignments.length === 0) {
        assignmentsContainer.innerHTML = '<p>No active assignments.</p>';
        return;
    }
    
    activeAssignments.forEach(([assignmentId, assignment]) => {
        const character = gameState.party.find(c => c.id == assignment.characterId);
        const activity = passiveActivities[assignment.activityId];
        
        if (!character || !activity) return;
        
        const now = Date.now();
        const timeRemaining = Math.max(0, assignment.endTime - now);
        const isComplete = timeRemaining === 0;
        
        const assignmentCard = document.createElement('div');
        assignmentCard.className = 'assignment-card';
        
        if (isComplete) {
            assignmentCard.classList.add('complete');
        }
        
        const timeText = isComplete ? 'Complete!' : 
            `${Math.floor(timeRemaining / 60000)}m ${Math.floor((timeRemaining % 60000) / 1000)}s`;
        
        assignmentCard.innerHTML = `
            <div class="assignment-character">${character.icon} ${character.name}</div>
            <div class="assignment-activity">${activity.icon} ${activity.name}</div>
            <div class="assignment-time">${timeText}</div>
            ${isComplete ? 
                `<button class="collect-btn" onclick="collectRewards('${assignmentId}')">Collect Rewards</button>` :
                `<button class="cancel-btn" onclick="cancelAssignment('${assignmentId}')">Cancel</button>`
            }
        `;
        
        assignmentsContainer.appendChild(assignmentCard);
    });
}

async function collectRewards(assignmentId) {
    const assignment = gameState.passiveActivities[assignmentId];
    const activity = passiveActivities[assignment.activityId];
    const character = gameState.party.find(c => c.id == assignment.characterId);
    
    if (!assignment || !activity || !character) return;
    
    let rewardText = [];
    
    // Apply rewards
    Object.entries(activity.rewards).forEach(([type, range]) => {
        if (type === 'gold') {
            const amount = Array.isArray(range) ? 
                range[0] + Math.floor(Math.random() * (range[1] - range[0] + 1)) : range;
            gameState.player.gold += amount;
            rewardText.push(`${amount} gold`);
        } else if (type === 'food') {
            const amount = Array.isArray(range) ? 
                range[0] + Math.floor(Math.random() * (range[1] - range[0] + 1)) : range;
            gameState.player.food = (gameState.player.food || 0) + amount;
            rewardText.push(`${amount} food`);
        } else if (type === 'experience') {
            const amount = Array.isArray(range) ? 
                range[0] + Math.floor(Math.random() * (range[1] - range[0] + 1)) : range;
            character.level += Math.floor(amount / 100);
            rewardText.push(`${amount} experience`);
        } else if (type === 'items') {
            const item = range[Math.floor(Math.random() * range.length)];
            gameState.inventory.push({
                id: Date.now() + Math.random(),
                name: item,
                type: 'material',
                icon: '📦',
                effect: 'Crafting material',
                rarity: 'common',
                value: 10
            });
            rewardText.push(item);
        }
    });
    
    // Remove assignment
    delete gameState.passiveActivities[assignmentId];
    
    updateUI();
    updateActiveAssignments();
    updateAvailableActivities();
    
    await showAlert(`${character.name} completed ${activity.name}! Rewards: ${rewardText.join(', ')}`, 'success');
}

async function cancelAssignment(assignmentId) {
    const confirmed = await showConfirm('Are you sure you want to cancel this assignment?');
    if (confirmed) {
        delete gameState.passiveActivities[assignmentId];
        updateActiveAssignments();
        updateAvailableActivities();
    }
}

// Spontaneous Character Messages System
function generateSpontaneousMessage(character) {
    const relationship = getRelationshipLevel(character.affection);
    const personality = personalityTypes[character.personalityType];
    
    if (!personality) return null;
    
    // Base messages by relationship level
    const messagesByLevel = {
        'Stranger': [
            `${character.name} glances at you briefly before looking away.`,
            `${character.name} nods politely in your direction.`,
            `${character.name} seems focused on their own tasks.`
        ],
        'Acquaintance': [
            `${character.name} gives you a small wave when they see you.`,
            `${character.name} mentions they've been thinking about your last conversation.`,
            `${character.name} asks how your day is going.`
        ],
        'Friend': [
            `${character.name} lights up when they see you approaching.`,
            `${character.name} shares a funny story from their day.`,
            `${character.name} suggests you should spend more time together.`
        ],
        'Close Friend': [
            `${character.name} rushes over to tell you about something exciting that happened.`,
            `${character.name} says they really value your friendship.`,
            `${character.name} asks if you want to grab a meal together later.`
        ],
        'Romantic Interest': [
            `${character.name} blushes slightly when they see you.`,
            `${character.name} mentions they've been looking forward to seeing you.`,
            `${character.name} compliments something about you today.`
        ],
        'Partner': [
            `${character.name} gives you an affectionate smile and takes your hand.`,
            `${character.name} tells you how much you mean to them.`,
            `${character.name} suggests planning something special together.`
        ],
        'Soulmate': [
            `${character.name} looks at you with pure adoration in their eyes.`,
            `${character.name} says they can't imagine life without you.`,
            `${character.name} whispers sweet words of love to you.`
        ]
    };
    
    // Personality-specific message modifiers
    const personalityMessages = {
        'shy-bookworm': {
            'Stranger': [`${character.name} peeks at you from behind a book.`],
            'Friend': [`${character.name} shyly offers to share an interesting book with you.`],
            'Romantic Interest': [`${character.name} nervously fidgets with their book while talking to you.`]
        },
        'bold-adventurer': {
            'Acquaintance': [`${character.name} excitedly tells you about their latest adventure.`],
            'Friend': [`${character.name} invites you to join them on their next quest.`],
            'Partner': [`${character.name} says you're the perfect adventure companion.`]
        },
        'mysterious-loner': {
            'Stranger': [`${character.name} watches you from the shadows.`],
            'Friend': [`${character.name} reveals a small secret about their past.`],
            'Romantic Interest': [`${character.name} says you're the only one who truly understands them.`]
        },
        'cheerful-optimist': {
            'Acquaintance': [`${character.name} brightens everyone's day with their smile.`],
            'Friend': [`${character.name} says you always make them feel better.`],
            'Partner': [`${character.name} tells you that you're their sunshine.`]
        },
        'serious-scholar': {
            'Friend': [`${character.name} shares an interesting fact they learned recently.`],
            'Romantic Interest': [`${character.name} says your intelligence is very attractive.`],
            'Partner': [`${character.name} discusses future plans with scholarly precision.`]
        },
        'flirtatious-charmer': {
            'Acquaintance': [`${character.name} gives you a playful wink.`],
            'Romantic Interest': [`${character.name} flirts with you more seriously than usual.`],
            'Partner': [`${character.name} whispers something that makes you blush.`]
        }
    };
    
    // Goal and fear-based messages (occasional)
    const goalFearMessages = [];
    if (Math.random() < 0.3) { // 30% chance for goal/fear messages
        if (character.goals) {
            goalFearMessages.push(`${character.name} mentions their dream: "${character.goals}"`);
        }
        if (character.fears && relationship.name !== 'Stranger') {
            goalFearMessages.push(`${character.name} quietly confides their fear: "${character.fears}"`);
        }
    }
    
    // Combine all possible messages
    let possibleMessages = [...(messagesByLevel[relationship.name] || [])];
    
    // Add personality-specific messages
    if (personalityMessages[character.personalityType] && personalityMessages[character.personalityType][relationship.name]) {
        possibleMessages.push(...personalityMessages[character.personalityType][relationship.name]);
    }
    
    // Add goal/fear messages
    possibleMessages.push(...goalFearMessages);
    
    // Return random message
    if (possibleMessages.length > 0) {
        return possibleMessages[Math.floor(Math.random() * possibleMessages.length)];
    }
    
    return null;
}

function showSpontaneousMessage(character, message) {
    // Create a small notification that appears and fades
    const notification = document.createElement('div');
    notification.className = 'spontaneous-message';
    notification.innerHTML = `
        <div class="message-character">${character.icon} ${character.name}</div>
        <div class="message-text">${message}</div>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(255, 255, 255, 0.95);
        border: 2px solid #3498db;
        border-radius: 10px;
        padding: 1rem;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Spontaneous message system - triggers randomly
function triggerSpontaneousMessages() {
    if (gameState.party.length === 0) return;
    
    // Random chance for a message (5% per check)
    if (Math.random() < 0.05) {
        const randomCharacter = gameState.party[Math.floor(Math.random() * gameState.party.length)];
        const message = generateSpontaneousMessage(randomCharacter);
        
        if (message) {
            showSpontaneousMessage(randomCharacter, message);
        }
    }
}

// Energy regeneration and spontaneous messages (every 30 seconds in real-time)
setInterval(() => {
    if (gameState.player.energy < gameState.player.maxEnergy) {
        gameState.player.energy = Math.min(gameState.player.maxEnergy, gameState.player.energy + 1);
        updateUI();
    }
    
    // Trigger spontaneous messages
    triggerSpontaneousMessages();
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

async function resetGame() {
    const confirmed = await showConfirm('Are you sure you want to reset the game? This will delete all progress!');
    if (confirmed) {
        resetGameState();
        
        // Regenerate recruitment pool and update UI
        generateRecruitmentPool();
        updateUI();
        showSection('recruitment');
        closeSaveLoadModal();
        
        saveSystem.showSaveNotification('Game reset successfully');
    }
}

async function clearAllSaves() {
    const confirmed = await showConfirm('Are you sure you want to delete all save files? This cannot be undone!');
    if (confirmed) {
        for (let i = 1; i <= 3; i++) {
            saveSystem.deleteSaveSlot(i);
        }
        updateSaveSlotInfo();
        saveSystem.showSaveNotification('All save files deleted');
    }
}

// Custom Dialog System
class CustomDialog {
    constructor() {
        this.dialog = document.getElementById('custom-dialog');
        this.title = document.getElementById('dialog-title');
        this.icon = document.getElementById('dialog-icon');
        this.message = document.getElementById('dialog-message');
        this.confirmBtn = document.getElementById('dialog-confirm');
        this.cancelBtn = document.getElementById('dialog-cancel');
        this.currentResolve = null;
        this.currentReject = null;
    }

    show(options = {}) {
        return new Promise((resolve, reject) => {
            this.currentResolve = resolve;
            this.currentReject = reject;

            // Set dialog content
            this.title.textContent = options.title || 'Notification';
            this.message.textContent = options.message || '';
            
            // Set icon based on type
            const iconMap = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: 'ℹ️',
                question: '❓'
            };
            this.icon.textContent = iconMap[options.type] || 'ℹ️';
            
            // Apply type-specific styling
            this.dialog.className = `custom-dialog ${options.type ? 'dialog-' + options.type : ''}`;
            
            // Configure buttons
            this.confirmBtn.textContent = options.confirmText || 'OK';
            
            if (options.showCancel) {
                this.cancelBtn.style.display = 'inline-block';
                this.cancelBtn.textContent = options.cancelText || 'Cancel';
            } else {
                this.cancelBtn.style.display = 'none';
            }
            
            // Show dialog with animation
            this.dialog.classList.add('show');
            
            // Focus on confirm button
            setTimeout(() => {
                this.confirmBtn.focus();
            }, 100);
        });
    }

    hide() {
        this.dialog.classList.remove('show');
    }

    confirm() {
        this.hide();
        if (this.currentResolve) {
            this.currentResolve(true);
            this.currentResolve = null;
        }
    }

    cancel() {
        this.hide();
        if (this.currentResolve) {
            this.currentResolve(false);
            this.currentResolve = null;
        }
    }
}

// Initialize dialog system
const customDialog = new CustomDialog();

// Dialog helper functions
function showAlert(message, type = 'info', title = null) {
    return customDialog.show({
        title: title || (type === 'error' ? 'Error' : type === 'success' ? 'Success' : type === 'warning' ? 'Warning' : 'Notification'),
        message: message,
        type: type,
        showCancel: false
    });
}

function showConfirm(message, title = 'Confirm') {
    return customDialog.show({
        title: title,
        message: message,
        type: 'question',
        showCancel: true,
        confirmText: 'Yes',
        cancelText: 'No'
    });
}

// Dialog control functions
function confirmCustomDialog() {
    customDialog.confirm();
}

function closeCustomDialog() {
    customDialog.cancel();
}

// Keyboard support for dialog
document.addEventListener('keydown', function(e) {
    if (customDialog.dialog.classList.contains('show')) {
        if (e.key === 'Escape') {
            customDialog.cancel();
        } else if (e.key === 'Enter') {
            customDialog.confirm();
        }
    }
});

// Make functions globally available
window.showSection = showSection;
window.updateRecruitmentPool = updateRecruitmentPool;
window.startDungeon = startDungeon;
window.closeBattleModal = closeBattleModal;
window.closeModal = closeModal;
window.showProfileTab = showProfileTab;
window.showStoreTab = showStoreTab;
window.showStoreCategory = showStoreCategory;
window.showAssignmentModal = showAssignmentModal;
window.assignCharacterToActivity = assignCharacterToActivity;
window.collectRewards = collectRewards;
window.cancelAssignment = cancelAssignment;
window.openSaveLoadModal = openSaveLoadModal;
window.closeSaveLoadModal = closeSaveLoadModal;
window.showSaveLoadTab = showSaveLoadTab;
window.saveToSlot = saveToSlot;
window.loadFromSlot = loadFromSlot;
window.quickSave = quickSave;
window.toggleAutoSave = toggleAutoSave;
window.setAutoSaveInterval = setAutoSaveInterval;
window.resetGame = resetGame;
window.clearAllSaves = clearAllSaves;
window.confirmCustomDialog = confirmCustomDialog;
window.closeCustomDialog = closeCustomDialog;
window.saveSystem = saveSystem;
window.showEquipModal = showEquipModal;
window.equipItemToCharacter = equipItemToCharacter;
window.unequipItem = unequipItem;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize save system first
    saveSystem.init();
    
    // Then initialize game
    initGame();
});
