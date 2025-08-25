# Save/Load System Design & Implementation

## Overview
The save/load system will use browser localStorage to persist game state, providing players with continuous progress across sessions. The system will include auto-save, manual save/load, multiple save slots, and data validation.

## Save Data Structure

### Core Save Format
```javascript
const saveData = {
  // Metadata
  version: "1.0.0",
  timestamp: Date.now(),
  saveSlot: 1, // 1-3 for multiple save slots
  playerName: "Player", // Optional custom name
  
  // Player Data
  player: {
    gold: 100,
    energy: 10,
    maxEnergy: 10,
    level: 1,
    experience: 0,
    totalPlayTime: 0, // in seconds
    lastSaveTime: Date.now()
  },
  
  // Party Members (full character data)
  party: [
    {
      id: "unique_id",
      name: "Character Name",
      class: "warrior",
      className: "Warrior",
      icon: "⚔️",
      gender: "female",
      personalityType: "shy-bookworm",
      age: 22,
      backstory: "Full backstory text...",
      goals: "Character goals...",
      fears: "Character fears...",
      quotes: ["Quote 1", "Quote 2", "Quote 3"],
      stats: {
        attack: 12,
        defense: 10,
        magic: 4,
        agility: 6,
        charisma: 6,
        intelligence: 5
      },
      affection: 25,
      level: 1,
      equipment: {
        weapon: null,
        armor: null,
        accessory: null,
        charm: null
      },
      relationshipHistory: [
        {
          date: Date.now(),
          activity: "dinner",
          outcome: "success",
          affectionGain: 5
        }
      ],
      personalMemories: [
        "Remembers our first library date fondly",
        "Mentioned loving ancient magical texts"
      ]
    }
  ],
  
  // Available Characters for Recruitment
  recruitmentPool: [
    // Same structure as party members
  ],
  
  // Inventory Items
  inventory: [
    {
      id: 1,
      name: "Iron Sword",
      type: "weapon",
      icon: "⚔️",
      effect: "+5 Attack",
      rarity: "common",
      value: 50
    }
  ],
  
  // Game Progress Tracking
  gameProgress: {
    dungeonsCompleted: {
      "goblin-caves": 3,
      "haunted-mansion": 1,
      "dragon-lair": 0
    },
    achievementsUnlocked: [
      "first_recruitment",
      "first_date",
      "first_dungeon_clear"
    ],
    totalDatesCompleted: 12,
    totalDungeonsCleared: 4,
    relationshipMilestones: {
      "character_id_1": ["first_date", "became_friends"],
      "character_id_2": ["first_date", "became_friends", "romantic_interest"]
    },
    locationsVisited: ["tavern", "library", "training-grounds"],
    totalGoldEarned: 500,
    totalEnergySpent: 150
  },
  
  // Settings & Preferences
  settings: {
    autoSaveEnabled: true,
    autoSaveInterval: 30, // seconds
    soundEnabled: true,
    musicEnabled: true,
    animationsEnabled: true,
    confirmationDialogs: true
  },
  
  // Current Game State
  currentState: {
    currentLocation: "tavern",
    activeSection: "recruitment",
    lastActivity: "recruited_character",
    energyRegenTimer: Date.now()
  }
}
```

## Implementation Plan

### 1. Core Save/Load Functions

```javascript
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
      showSection(saveData.currentState.activeSection.replace('-section', ''));
      
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

  // Export save data
  exportSave(slotNumber) {
    try {
      const saveKey = this.SAVE_KEY_PREFIX + slotNumber;
      const saveDataString = localStorage.getItem(saveKey);
      
      if (!saveDataString) {
        throw new Error(`No save data found in slot ${slotNumber}`);
      }
      
      // Create downloadable file
      const blob = new Blob([saveDataString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `rpg_dating_save_slot_${slotNumber}_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(url);
      
      this.showSaveNotification('Save exported successfully');
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      this.showSaveNotification('Export failed: ' + error.message, 'error');
      return false;
    }
  }

  // Import save data
  importSave(file, slotNumber) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const saveData = JSON.parse(e.target.result);
          
          if (!this.validateSaveData(saveData)) {
            throw new Error('Invalid save file format');
          }
          
          // Save to specified slot
          const saveKey = this.SAVE_KEY_PREFIX + slotNumber;
          localStorage.setItem(saveKey, JSON.stringify(saveData));
          
          this.showSaveNotification(`Save imported to slot ${slotNumber}`);
          resolve(true);
        } catch (error) {
          console.error('Import failed:', error);
          this.showSaveNotification('Import failed: ' + error.message, 'error');
          reject(error);
        }
      };
      
      reader.onerror = () => {
        const error = new Error('Failed to read file');
        console.error('File read failed:', error);
        this.showSaveNotification('File read failed', 'error');
        reject(error);
      };
      
      reader.readAsText(file);
    });
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
}

// Initialize save system
const saveSystem = new SaveSystem();
```

### 2. UI Components

#### Save/Load Menu HTML
```html
<!-- Add to index.html -->
<div id="save-load-modal" class="modal">
  <div class="modal-content save-load-content">
    <span class="close" onclick="closeSaveLoadModal()">&times;</span>
    <h3>Save & Load Game</h3>
    
    <div class="save-load-tabs">
      <button class="tab-btn active" onclick="showSaveLoadTab('save')">Save Game</button>
      <button class="tab-btn" onclick="showSaveLoadTab('load')">Load Game</button>
      <button class="tab-btn" onclick="showSaveLoadTab('manage')">Manage Saves</button>
    </div>
    
    <!-- Save Tab -->
    <div id="save-tab" class="save-load-tab active">
      <h4>Save to Slot:</h4>
      <div class="save-slots">
        <div class="save-slot" onclick="saveToSlot(1)">
          <div class="slot-number">Slot 1</div>
          <div class="slot-info" id="save-slot-1-info">Empty</div>
          <button class="save-btn">Save Here</button>
        </div>
        <div class="save-slot" onclick="saveToSlot(2)">
          <div class="slot-number">Slot 2</div>
          <div class="slot-info" id="save-slot-2-info">Empty</div>
          <button class="save-btn">Save Here</button>
        </div>
        <div class="save-slot" onclick="saveToSlot(3)">
          <div class="slot-number">Slot 3</div>
          <div class="slot-info" id="save-slot-3-info">Empty</div>
          <button class="save-btn">Save Here</button>
        </div>
      </div>
    </div>
    
    <!-- Load Tab -->
    <div id="load-tab" class="save-load-tab">
      <h4>Load from Slot:</h4>
      <div class="save-slots">
        <div class="save-slot" onclick="loadFromSlot(1)">
          <div class="slot-number">Slot 1</div>
          <div class="slot-info" id="load-slot-1-info">Empty</div>
          <button class="load-btn" disabled>Load Game</button>
        </div>
        <div class="save-slot" onclick="loadFromSlot(2)">
          <div class="slot-number">Slot 2</div>
          <div class="slot-info" id="load-slot-2-info">Empty</div>
          <button class="load-btn" disabled>Load Game</button>
        </div>
        <div class="save-slot" onclick="loadFromSlot(3)">
          <div class="slot-number">Slot 3</div>
          <div class="slot-info" id="load-slot-3-info">Empty</div>
          <button class="load-btn" disabled>Load Game</button>
        </div>
      </div>
    </div>
    
    <!-- Manage Tab -->
    <div id="manage-tab" class="save-load-tab">
      <h4>Manage Save Files:</h4>
      <div class="manage-options">
        <div class="manage-section">
          <h5>Export/Import</h5>
          <button onclick="exportSave()">Export Save</button>
          <input type="file" id="import-file" accept=".json" style="display: none;" onchange="importSave(this)">
          <button onclick="document.getElementById('import-file').click()">Import Save</button>
        </div>
        <div class="manage-section">
          <h5>Settings</h5>
          <label>
            <input type="checkbox" id="auto-save-enabled" checked onchange="toggleAutoSave(this)">
            Auto-save enabled
          </label>
          <label>
            Auto-save interval:
            <select id="auto-save-interval" onchange="setAutoSaveInterval(this)">
              <option value="15">15 seconds</option>
              <option value="30" selected>30 seconds</option>
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
            </select>
          </label>
        </div>
        <div class="manage-section">
          <h5>Danger Zone</h5>
          <button class="danger-btn" onclick="resetGame()">Reset Game</button>
          <button class="danger-btn" onclick="clearAllSaves()">Clear All Saves</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Auto-save indicator -->
<div id="auto-save-indicator" class="auto-save-indicator">
  <span class="save-icon">💾</span>
  <span class="save-text">Auto-saved</span>
</div>
```

#### CSS Styles
```css
/* Add to styles.css */
.save-load-content {
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.save-load-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 2px solid #34495e;
}

.tab-btn {
  flex: 1;
  padding: 10px;
  background: #7f8c8d;
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}

.tab-btn.active {
  background: #3498db;
}

.tab-btn:hover {
  background: #2980b9;
}

.save-load-tab {
  display: none;
}

.save-load-tab.active {
  display: block;
}

.save-slots {
  display: grid;
  gap: 15px;
}

.save-slot {
  border: 2px solid #34495e;
  border-radius: 8px;
  padding: 15px;
  background: #ecf0f1;
  cursor: pointer;
  transition: all 0.3s;
}

.save-slot:hover {
  border-color: #3498db;
  background: #d5dbdb;
}

.slot-number {
  font-weight: bold;
  font-size: 1.2em;
  color: #2c3e50;
  margin-bottom: 5px;
}

.slot-info {
  color: #7f8c8d;
  font-size: 0.9em;
  margin-bottom: 10px;
  min-height: 60px;
}

.save-btn, .load-btn {
  background: #27ae60;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.save-btn:hover {
  background: #229954;
}

.load-btn {
  background: #3498db;
}

.load-btn:hover {
  background: #2980b9;
}

.load-btn:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.manage-options {
  display: grid;
  gap: 20px;
}

.manage-section {
  border: 1px solid #bdc3c7;
  border-radius: 5px;
  padding: 15px;
}

.manage-section h5 {
  margin-top: 0;
  color: #2c3e50;
}

.manage-section label {
  display: block;
  margin: 10px 0;
}

.danger-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  transition: background 0.3s;
}

.danger-btn:hover {
  background: #c0392b;
}

.auto-save-indicator {
  position: fixed;
  top: 10px;
  left: 10px;
  background: rgba(39, 174, 96, 0.9);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8em;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 1000;
}

.auto-save-indicator.show {
  opacity: 1;
}

.save-notification {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
```

### 3. Integration Points

#### Add Save/Load Button to Main UI
```html
<!-- Add to game header in index.html -->
<div class="game-controls">
  <button class="control-btn" onclick="openSaveLoadModal()">💾 Save/Load</button>
  <button class="control-btn" onclick="saveSystem.saveGame(1)">💾 Quick Save</button>
</div>
```

#### Initialize on Game Start
```javascript
// Add to game.js initialization
document.addEventListener('DOMContentLoaded', function() {
  // Initialize save system
  saveSystem.init();
  
  // Initialize game
  initGame();
});
```

## Testing Strategy

### 1. Save/Load Functionality Tests
- Save game in different states (empty party, full party, various gold amounts)
- Load game and verify all data is restored correctly
- Test auto-save functionality
- Test save slot management (save, load, delete)

### 2. Data Integrity Tests
- Test with corrupted save data
- Test version compatibility
- Test localStorage quota limits
- Test save/load with special characters in names

### 3. Edge Cases
- Save/load with empty recruitment pool
- Save/load during dungeon exploration
- Save/load with maximum affection levels
- Import/export functionality

### 4. Performance Tests
- Large save files (full party, large inventory)
- Frequent auto-saves
- Multiple save slots

## Migration Strategy

### Version Compatibility
```javascript
// Handle save version migrations
migrateeSaveData(saveData) {
  const currentVersion = saveData.version || '0.0.0';
  
  if (currentVersion < '1.0.0') {
    // Add new fields introduced in v1.0.0
    saveData.gameProgress = saveData.gameProgress || {};
    saveData.settings = saveData.settings || {};
  }
  
  if (currentVersion < '1.1.0') {
    // Future migration logic
  }
  
  saveData.version = this.SAVE_VERSION;
  return saveData;
}
```

This comprehensive save/load system will provide players with reliable progress persistence, multiple save slots, and advanced features like import/export functionality.
