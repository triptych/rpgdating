/**
 * Character Selector Web Component
 * A reusable component for displaying and selecting characters in a grid layout
 */
class CharacterSelector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.characters = [];
        this.selectedCharacter = null;
        this.mode = 'select'; // 'select', 'display', 'recruit'
        this.maxSelection = 1;
        this.onCharacterSelect = null;
        this.onCharacterAction = null;
    }

    static get observedAttributes() {
        return ['mode', 'max-selection', 'title'];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'mode') this.mode = newValue;
            if (name === 'max-selection') this.maxSelection = parseInt(newValue) || 1;
            this.render();
        }
    }

    setCharacters(characters) {
        this.characters = characters || [];
        this.render();
    }

    setSelectedCharacter(characterId) {
        this.selectedCharacter = characterId;
        this.updateSelection();
    }

    getSelectedCharacter() {
        return this.selectedCharacter;
    }

    render() {
        const title = this.getAttribute('title') || 'Characters';
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }

                .character-selector-container {
                    background: white;
                    border-radius: 10px;
                    padding: 1rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .selector-title {
                    color: #2c3e50;
                    margin-bottom: 1rem;
                    font-size: 1.2rem;
                    font-weight: bold;
                }

                .character-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 1rem;
                }

                .character-card {
                    background: white;
                    border: 2px solid #e0e0e0;
                    border-radius: 10px;
                    padding: 1rem;
                    text-align: center;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s, border-color 0.2s;
                    cursor: pointer;
                    position: relative;
                }

                .character-card:hover {
                    transform: translateY(-2px);
                    border-color: #3498db;
                }

                .character-card.selected {
                    border-color: #e74c3c;
                    background: #fdf2f2;
                }

                .character-avatar {
                    font-size: 3rem;
                    margin-bottom: 0.5rem;
                }

                .character-name {
                    font-weight: bold;
                    font-size: 1.1rem;
                    margin-bottom: 0.5rem;
                    color: #2c3e50;
                }

                .character-class {
                    color: #7f8c8d;
                    margin-bottom: 0.5rem;
                }

                .character-stats {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.25rem;
                    font-size: 0.9rem;
                    margin: 0.5rem 0;
                }

                .stat-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.2rem 0.5rem;
                    background: #f8f9fa;
                    border-radius: 4px;
                }

                .relationship-level {
                    background: #ffeaa7;
                    padding: 0.25rem 0.5rem;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    margin: 0.5rem 0;
                    display: inline-block;
                }

                .character-actions {
                    margin-top: 0.5rem;
                    display: flex;
                    gap: 0.5rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .action-btn {
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: background-color 0.3s;
                }

                .action-btn:hover {
                    background: #2980b9;
                }

                .action-btn:disabled {
                    background: #bdc3c7;
                    cursor: not-allowed;
                }

                .action-btn.recruit {
                    background: #27ae60;
                }

                .action-btn.recruit:hover {
                    background: #229954;
                }

                .empty-state {
                    text-align: center;
                    color: #7f8c8d;
                    font-style: italic;
                    padding: 2rem;
                }

                .selected-indicator {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: #e74c3c;
                    color: white;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    font-weight: bold;
                }

                @media (max-width: 768px) {
                    .character-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>

            <div class="character-selector-container">
                <div class="selector-title">${title}</div>
                <div class="character-grid" id="character-grid">
                    ${this.renderCharacters()}
                </div>
            </div>
        `;
    }

    renderCharacters() {
        if (!this.characters || this.characters.length === 0) {
            return '<div class="empty-state">No characters available</div>';
        }

        return this.characters.map(character => this.renderCharacterCard(character)).join('');
    }

    renderCharacterCard(character) {
        const isSelected = this.selectedCharacter === character.id;
        const relationship = this.getRelationshipLevel(character.affection || 0);
        
        return `
            <div class="character-card ${isSelected ? 'selected' : ''}" data-character-id="${character.id}">
                ${isSelected ? '<div class="selected-indicator">✓</div>' : ''}
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
                ${character.affection !== undefined ? `<div class="relationship-level">${relationship.name} (${character.affection})</div>` : ''}
                ${this.renderCharacterActions(character)}
            </div>
        `;
    }

    renderCharacterActions(character) {
        if (this.mode === 'display') {
            return '';
        }

        if (this.mode === 'recruit') {
            return `
                <div class="character-actions">
                    <button class="action-btn recruit" data-action="recruit" data-character-id="${character.id}">
                        Recruit (50 Gold)
                    </button>
                </div>
            `;
        }

        if (this.mode === 'select') {
            return `
                <div class="character-actions">
                    <button class="action-btn" data-action="select" data-character-id="${character.id}">
                        ${this.selectedCharacter === character.id ? 'Selected' : 'Select'}
                    </button>
                </div>
            `;
        }

        return '';
    }

    setupEventListeners() {
        this.shadowRoot.addEventListener('click', (e) => {
            const characterCard = e.target.closest('.character-card');
            const actionBtn = e.target.closest('.action-btn');
            
            if (actionBtn) {
                e.stopPropagation();
                const action = actionBtn.dataset.action;
                const characterId = actionBtn.dataset.characterId;
                const character = this.characters.find(c => c.id == characterId);
                
                if (this.onCharacterAction) {
                    this.onCharacterAction(action, character);
                }
                
                if (action === 'select') {
                    this.handleCharacterSelection(characterId);
                }
            } else if (characterCard) {
                const characterId = characterCard.dataset.characterId;
                const character = this.characters.find(c => c.id == characterId);
                
                if (this.mode === 'select') {
                    this.handleCharacterSelection(characterId);
                }
                
                if (this.onCharacterSelect) {
                    this.onCharacterSelect(character);
                }
            }
        });
    }

    handleCharacterSelection(characterId) {
        if (this.mode !== 'select') return;
        
        this.selectedCharacter = characterId;
        this.updateSelection();
        
        // Dispatch custom event
        this.dispatchEvent(new CustomEvent('character-selected', {
            detail: { 
                characterId: characterId,
                character: this.characters.find(c => c.id == characterId)
            },
            bubbles: true
        }));
    }

    updateSelection() {
        const cards = this.shadowRoot.querySelectorAll('.character-card');
        cards.forEach(card => {
            const characterId = card.dataset.characterId;
            const isSelected = this.selectedCharacter === characterId;
            
            card.classList.toggle('selected', isSelected);
            
            const indicator = card.querySelector('.selected-indicator');
            if (isSelected && !indicator) {
                card.insertAdjacentHTML('afterbegin', '<div class="selected-indicator">✓</div>');
            } else if (!isSelected && indicator) {
                indicator.remove();
            }
            
            const selectBtn = card.querySelector('[data-action="select"]');
            if (selectBtn) {
                selectBtn.textContent = isSelected ? 'Selected' : 'Select';
            }
        });
    }

    getRelationshipLevel(affection) {
        const relationshipLevels = [
            { name: 'Stranger', minAffection: 0, statBonus: 0 },
            { name: 'Acquaintance', minAffection: 10, statBonus: 1 },
            { name: 'Friend', minAffection: 25, statBonus: 2 },
            { name: 'Close Friend', minAffection: 50, statBonus: 3 },
            { name: 'Romantic Interest', minAffection: 80, statBonus: 4 },
            { name: 'Partner', minAffection: 120, statBonus: 5 },
            { name: 'Soulmate', minAffection: 200, statBonus: 6 }
        ];

        for (let i = relationshipLevels.length - 1; i >= 0; i--) {
            if (affection >= relationshipLevels[i].minAffection) {
                return relationshipLevels[i];
            }
        }
        return relationshipLevels[0];
    }
}

// Register the custom element
customElements.define('character-selector', CharacterSelector);

export default CharacterSelector;
