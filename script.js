// Game state
let player1Life = 40;
let player2Life = 40;
let player3Life = 40;
let player4Life = 40;
let startingLife = 40;
let currentPlayerCount = 4;
let currentMonarch = null; // Tracks which player is the monarch
let currentInitiative = null; // Tracks which player has the initiative
let ascendedPlayers = new Set(); // Tracks which players have ascended

// Counter states
let player1Poison = 0;
let player2Poison = 0;
let player3Poison = 0;
let player4Poison = 0;

let player1Energy = 0;
let player2Energy = 0;
let player3Energy = 0;
let player4Energy = 0;

let player1Experience = 0;
let player2Experience = 0;
let player3Experience = 0;
let player4Experience = 0;

let player1Storm = 0;
let player2Storm = 0;
let player3Storm = 0;
let player4Storm = 0;

// Token tracking state
let player1Tokens = [];
let player2Tokens = [];
let player3Tokens = [];
let player4Tokens = [];

// Commander tax state
let player1Tax = 0;
let player2Tax = 0;
let player3Tax = 0;
let player4Tax = 0;

// Initialize commander damage state
function initializeCommanderDamage() {
    let damage = {};
    for (let toPlayer = 1; toPlayer <= 4; toPlayer++) {
        damage[toPlayer] = {};
        for (let fromPlayer = 1; fromPlayer <= 4; fromPlayer++) {
            if (fromPlayer !== toPlayer) {
                damage[toPlayer][fromPlayer] = 0;
            }
        }
    }
    return damage;
}

// Get total commander damage received by a player
function getTotalCommanderDamage(player) {
    if (!commanderDamage[player]) return 0;
    return Object.values(commanderDamage[player]).reduce((sum, damage) => sum + (damage || 0), 0);
}

// Commander damage state
let commanderDamage = initializeCommanderDamage();

// Player names
let player1Name = "Player 1";
let player2Name = "Player 2";
let player3Name = "Player 3";
let player4Name = "Player 4";

// DOM elements
const life1Element = document.getElementById('life1');
const life2Element = document.getElementById('life2');
const life3Element = document.getElementById('life3');
const life4Element = document.getElementById('life4');
const startingLifeInput = document.getElementById('startingLife');
const playerCountSelect = document.getElementById('playerCount');
const gameBoard = document.getElementById('gameBoard');
const historyContent = document.getElementById('historyContent');

// Commander damage elements
const commanderDamage1Element = document.getElementById('commanderDamage1');
const commanderDamage2Element = document.getElementById('commanderDamage2');
const commanderDamage3Element = document.getElementById('commanderDamage3');
const commanderDamage4Element = document.getElementById('commanderDamage4');

// Player name elements
const playerName1Element = document.getElementById('playerName1');
const playerName2Element = document.getElementById('playerName2');
const playerName3Element = document.getElementById('playerName3');
const playerName4Element = document.getElementById('playerName4');

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
    updateCommanderDamageDisplay();
    
    // Initialize sound manager
    soundManager.init();
    
    // Add click sound to all buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            soundManager.play('click');
        });
    });
    
    // Add input validation
    startingLifeInput.addEventListener('input', function() {
        const value = parseInt(this.value);
        if (value < 1) this.value = 1;
        if (value > 999) this.value = 999;
    });
    
    // Initialize player names
    updatePlayerNameDisplay();
    
    // Initialize tax displays to hidden
    for (let i = 1; i <= 4; i++) {
        const taxDisplay = document.getElementById(`taxDisplay${i}`);
        if (taxDisplay) {
            taxDisplay.classList.add('hidden');
        }
    }
    
    // Initialize token displays
    for (let i = 1; i <= 4; i++) {
        updateTokenDisplay(i);
    }
    
    // Add initial history entry
    addHistoryEntry('Game Started', 'All players set to 40 life', 'reset');
});

// Add history entry
function addHistoryEntry(time, text, type = 'default') {
    const historyItem = document.createElement('div');
    historyItem.className = `history-item ${type}`;
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'history-time';
    timeSpan.textContent = time;
    
    const textSpan = document.createElement('span');
    textSpan.className = 'history-text';
    textSpan.textContent = text;
    
    // Add the spans to the history item
    historyItem.appendChild(timeSpan);
    historyItem.appendChild(textSpan);
    
    // Add the history item to the content
    historyContent.insertBefore(historyItem, historyContent.firstChild);
    
    // Limit history to 50 entries
    const historyItems = historyContent.querySelectorAll('.history-item');
    if (historyItems.length > 50) {
        historyContent.removeChild(historyItems[historyItems.length - 1]);
    }
}

// Get current time string
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// Clear history
function clearHistory() {
    historyContent.innerHTML = '';
    addHistoryEntry('History Cleared', 'Game history has been cleared', 'reset');
}

// Update player name
function updatePlayerName(player) {
    const nameElement = getPlayerNameElement(player);
    if (!nameElement) return;
    
    let newName = nameElement.value.trim();
    // Enforce 16 character limit
    if (newName.length > 16) {
        newName = newName.substring(0, 16);
    }
    
    if (newName === '') {
        // If empty, reset to default
        newName = `Player ${player}`;
    }
    
    // Update input value and state
    nameElement.value = newName;
    setPlayerName(player, newName);
}

// Set player name in state
function setPlayerName(player, name) {
    switch(player) {
        case 1:
            player1Name = name;
            break;
        case 2:
            player2Name = name;
            break;
        case 3:
            player3Name = name;
            break;
        case 4:
            player4Name = name;
            break;
    }
    // Update commander damage display to refresh player names
    updateCommanderDamageDisplay();
}

// Get player name element by player number
function getPlayerNameElement(player) {
    switch(player) {
        case 1: return playerName1Element;
        case 2: return playerName2Element;
        case 3: return playerName3Element;
        case 4: return playerName4Element;
        default: return null;
    }
}

// Update player name display
function updatePlayerNameDisplay() {
    playerName1Element.value = player1Name;
    playerName2Element.value = player2Name;
    playerName3Element.value = player3Name;
    playerName4Element.value = player4Name;
}

// Change player count
function changePlayerCount() {
    const newPlayerCount = parseInt(playerCountSelect.value);
    currentPlayerCount = newPlayerCount;
    
    // Clear any player selection
    clearPlayerSelection();
    
    // Update grid layout
    gameBoard.className = 'game-board';
    if (newPlayerCount === 3) {
        gameBoard.classList.add('three-players');
    } else if (newPlayerCount === 4) {
        gameBoard.classList.add('four-players');
    }
    
    // Show/hide players
    for (let i = 1; i <= 4; i++) {
        const playerSection = document.getElementById(`player${i}`);
        if (i <= newPlayerCount) {
            playerSection.classList.remove('hidden');
        } else {
            playerSection.classList.add('hidden');
        }
    }
    
    // Reset all players to starting life
    resetAll();
    
    // Add history entry
    addHistoryEntry(getCurrentTime(), `Changed to ${newPlayerCount} players`, 'reset');
}

// Change life total for a player
function changeLife(player, amount) {
    const oldLife = getPlayerLife(player);
    
    switch(player) {
        case 1:
            player1Life += amount;
            if (player1Life < 0) player1Life = 0;
            break;
        case 2:
            player2Life += amount;
            if (player2Life < 0) player2Life = 0;
            break;
        case 3:
            player3Life += amount;
            if (player3Life < 0) player3Life = 0;
            break;
        case 4:
            player4Life += amount;
            if (player4Life < 0) player4Life = 0;
            break;
    }
    
    updateDisplay();
    addLifeChangeEffect(player, amount);
    soundManager.playLifeChange(amount);
    
    // Add history entry
    const playerName = getPlayerName(player);
    const newLife = getPlayerLife(player);
    const changeText = amount > 0 ? `+${amount}` : amount.toString();
    const historyType = amount > 0 ? 'life-change' : 'life-change negative';
    addHistoryEntry(getCurrentTime(), `${playerName}: ${oldLife} → ${newLife} (${changeText})`, historyType);
}

// Update life from input field
function updateLifeFromInput(player) {
    const lifeElement = getLifeElement(player);
    if (!lifeElement) return;
    
    const newLife = parseInt(lifeElement.value);
    if (isNaN(newLife)) {
        // If invalid input, reset to current life
        lifeElement.value = getPlayerLife(player);
        return;
    }
    
    const oldLife = getPlayerLife(player);
    
    // Update the life value
    setPlayerLife(player, newLife);
    updateLifeDisplayStyle(player, newLife);
    
    // Add history entry if life actually changed
    if (oldLife !== newLife) {
        const playerName = getPlayerName(player);
        const change = newLife - oldLife;
        const changeText = change > 0 ? `+${change}` : change.toString();
        const historyType = change > 0 ? 'life-change' : 'life-change negative';
        addHistoryEntry(getCurrentTime(), `${playerName}: ${oldLife} → ${newLife} (${changeText})`, historyType);
    }
}

// Validate life input when field loses focus
function validateLifeInput(player) {
    const lifeElement = getLifeElement(player);
    if (!lifeElement) return;
    
    let value = parseInt(lifeElement.value);
    
    // Ensure value is within valid range
    if (isNaN(value) || value < 0) {
        value = 0;
    } else if (value > 999) {
        value = 999;
    }
    
    // Update both the input field and the state
    lifeElement.value = value;
    setPlayerLife(player, value);
    updateLifeDisplayStyle(player, value);
}

// Get player life by player number
function getPlayerLife(player) {
    switch(player) {
        case 1: return player1Life;
        case 2: return player2Life;
        case 3: return player3Life;
        case 4: return player4Life;
        default: return 0;
    }
}

// Get player name by player number
function getPlayerName(player) {
    switch(player) {
        case 1: return player1Name;
        case 2: return player2Name;
        case 3: return player3Name;
        case 4: return player4Name;
        default: return `Player ${player}`;
    }
}

// Set player life by player number
function setPlayerLife(player, life) {
    switch(player) {
        case 1:
            player1Life = life;
            break;
        case 2:
            player2Life = life;
            break;
        case 3:
            player3Life = life;
            break;
        case 4:
            player4Life = life;
            break;
    }
}

// Toggle commander damage menu
function toggleCommanderDamageMenu(player) {
    const menu = document.getElementById(`commanderDamageMenu${player}`);
    const toggle = menu.parentElement.querySelector('.commander-damage-toggle');
    
    if (menu.classList.contains('active')) {
        menu.classList.remove('active');
        toggle.textContent = '⌄';
    } else {
        menu.classList.add('active');
        toggle.textContent = '⌃';
    }
}

// Change commander damage for a player
function changeCommanderDamage(toPlayer, fromPlayer, amount) {
    const oldDamage = commanderDamage[toPlayer][fromPlayer] || 0;
    const newDamage = Math.max(0, oldDamage + amount);
    
    // Initialize the object structure if it doesn't exist
    if (!commanderDamage[toPlayer]) {
        commanderDamage[toPlayer] = {};
    }
    commanderDamage[toPlayer][fromPlayer] = newDamage;
    
    updateCommanderDamageDisplay();
    addCommanderDamageEffect(toPlayer, amount);
    soundManager.play('commander');
    
    // Add history entry
    const toPlayerName = getPlayerName(toPlayer);
    const fromPlayerName = getPlayerName(fromPlayer);
    const changeText = amount > 0 ? `+${amount}` : amount.toString();
    addHistoryEntry(getCurrentTime(), `${fromPlayerName} → ${toPlayerName} Commander: ${oldDamage} → ${newDamage} (${changeText})`, 'commander-damage');
}

// Get player commander damage by player number
function getPlayerCommanderDamage(player) {
    if (!commanderDamage[player]) return 0;
    return Object.values(commanderDamage[player]).reduce((sum, damage) => sum + (damage || 0), 0);
}

// Reset life for a specific player
function resetLife(player) {
    const oldLife = getPlayerLife(player);
    
    switch(player) {
        case 1:
            player1Life = startingLife;
            break;
        case 2:
            player2Life = startingLife;
            break;
        case 3:
            player3Life = startingLife;
            break;
        case 4:
            player4Life = startingLife;
            break;
    }
    
    updateDisplay();
    addResetEffect(player);
    resetPoison(player);
    resetTax(player);
    resetTokens(player);
    soundManager.play('reset');
    
    // Add history entry
    const playerName = getPlayerName(player);
    addHistoryEntry(getCurrentTime(), `${playerName} life reset: ${oldLife} → ${startingLife}`, 'reset');
}

// Reset commander damage for a specific player
function resetCommanderDamage(player) {
    const oldDamage = getPlayerCommanderDamage(player);
    
    // Reset all commander damage for this player
    if (!commanderDamage[player]) {
        commanderDamage[player] = {};
    }
    for (let fromPlayer = 1; fromPlayer <= 4; fromPlayer++) {
        if (fromPlayer !== player) {
            commanderDamage[player][fromPlayer] = 0;
        }
    }
    
    updateCommanderDamageDisplay();
    addCommanderDamageResetEffect(player);
    
    // Add history entry
    const playerName = getPlayerName(player);
    addHistoryEntry(getCurrentTime(), `${playerName} commander damage reset: ${oldDamage} → 0`, 'reset');
}

// Change commander tax for a player
function changeTax(player, amount) {
    let taxCount;
    const menuDisplay = document.getElementById(`taxMenu${player}`);
    const taxDisplayContainer = document.getElementById(`taxDisplay${player}`);
    const taxDisplay = taxDisplayContainer.querySelector('.tax-value');
    const playerName = getPlayerName(player);

    // Get current tax count
    switch(player) {
        case 1: taxCount = player1Tax; break;
        case 2: taxCount = player2Tax; break;
        case 3: taxCount = player3Tax; break;
        case 4: taxCount = player4Tax; break;
        default: return;
    }

    // Double the amount for commander tax
    const adjustedAmount = amount * 2;

    // Calculate new tax count (can't go below 0)
    const newCount = Math.max(0, taxCount + adjustedAmount);

    // Update tax count
    switch(player) {
        case 1: player1Tax = newCount; break;
        case 2: player2Tax = newCount; break;
        case 3: player3Tax = newCount; break;
        case 4: player4Tax = newCount; break;
    }

    // Update both displays
    menuDisplay.textContent = newCount;
    taxDisplay.textContent = newCount;

    // Show/hide tax display based on count
    if (newCount > 0) {
        taxDisplayContainer.classList.remove('hidden');
    } else {
        taxDisplayContainer.classList.add('hidden');
    }

    // Update token bubble positioning
    updateTokenBubble(player);

    // Add to history
    const changeText = adjustedAmount > 0 ? `+${adjustedAmount}` : adjustedAmount;
    addHistoryEntry(getCurrentTime(), `${playerName} commander tax: ${taxCount} → ${newCount} (${changeText})`, 'tax');
}

// Reset commander tax for a player
function resetTax(player) {
    const menuDisplay = document.getElementById(`taxMenu${player}`);
    const taxDisplayContainer = document.getElementById(`taxDisplay${player}`);
    const taxDisplay = taxDisplayContainer.querySelector('.tax-value');
    const playerName = getPlayerName(player);

    // Get current tax count for history
    let oldCount;
    switch(player) {
        case 1: oldCount = player1Tax; player1Tax = 0; break;
        case 2: oldCount = player2Tax; player2Tax = 0; break;
        case 3: oldCount = player3Tax; player3Tax = 0; break;
        case 4: oldCount = player4Tax; player4Tax = 0; break;
    }

    // Update both displays
    menuDisplay.textContent = '0';
    taxDisplay.textContent = '0';
    taxDisplayContainer.classList.add('hidden');

    // Update token bubble positioning
    updateTokenBubble(player);

    // Add to history if there was tax
    if (oldCount > 0) {
        addHistoryEntry(getCurrentTime(), `${playerName} commander tax reset: ${oldCount} → 0`, 'reset');
    }
}

// Reset all players
function resetAll() {
    const oldLives = [player1Life, player2Life, player3Life, player4Life];
    
    // Clear any player selection
    clearPlayerSelection();
    
    // Reset life totals
    player1Life = startingLife;
    player2Life = startingLife;
    player3Life = startingLife;
    player4Life = startingLife;
    updateDisplay();
    addResetAllEffect();
    
    // Reset all counters, commander tax, and tokens
    for (let i = 1; i <= 4; i++) {
        resetPoison(i);
        resetEnergy(i);
        resetExperience(i);
        resetStorm(i);
        resetTax(i);
        resetTokens(i);
    }

    // Reset monarch status if there is one
    if (currentMonarch !== null) {
        const oldButton = document.getElementById(`monarchBtn${currentMonarch}`);
        const oldCrown = document.getElementById(`crown${currentMonarch}`);
        oldButton.classList.remove('active');
        oldButton.textContent = 'Claim Monarchy';
        oldCrown.classList.add('hidden');
        currentMonarch = null;
    }

    // Reset initiative status if there is one
    if (currentInitiative !== null) {
        const oldButton = document.getElementById(`initiativeBtn${currentInitiative}`);
        const oldIndicator = document.getElementById(`initiative${currentInitiative}`);
        oldButton.classList.remove('active');
        oldButton.textContent = 'Take Initiative';
        oldIndicator.classList.add('hidden');
        currentInitiative = null;
    }

    // Reset ascend status for all players
    ascendedPlayers.forEach(player => {
        const button = document.getElementById(`ascendBtn${player}`);
        const indicator = document.getElementById(`ascend${player}`);
        button.classList.remove('active');
        button.textContent = 'Ascend';
        indicator.classList.add('hidden');
    });
    ascendedPlayers.clear();
    
    // Add history entry
    addHistoryEntry(getCurrentTime(), `All players reset to ${startingLife} life and all status effects cleared`, 'reset');
}

// Reset all commander damage
function resetAllCommanderDamage() {
    // Initialize new commander damage state
    commanderDamage = initializeCommanderDamage();
    updateCommanderDamageDisplay();
    addCommanderDamageResetAllEffect();
    
    // Add history entry
    addHistoryEntry(getCurrentTime(), 'All commander damage reset to 0', 'reset');
}

// Set starting life for new games
function setStartingLife() {
    const newStartingLife = parseInt(startingLifeInput.value);
    if (newStartingLife >= 1 && newStartingLife <= 999) {
        const oldStartingLife = startingLife;
        startingLife = newStartingLife;
        
        // Add history entry
        addHistoryEntry(getCurrentTime(), `Starting life changed: ${oldStartingLife} → ${newStartingLife}`, 'reset');
        
        // Optionally reset all players to new starting life
        if (confirm('Reset all players to the new starting life?')) {
            resetAll();
        }
    } else {
        alert('Please enter a valid starting life total (1-999)');
        startingLifeInput.value = startingLife;
    }
}

// Update the display
function updateDisplay() {
    life1Element.value = player1Life;
    life2Element.value = player2Life;
    life3Element.value = player3Life;
    life4Element.value = player4Life;
    
    // Add visual feedback for low life
    updateLifeDisplayStyle(1, player1Life);
    updateLifeDisplayStyle(2, player2Life);
    updateLifeDisplayStyle(3, player3Life);
    updateLifeDisplayStyle(4, player4Life);
}

// Update commander damage display
function updateCommanderDamageDisplay() {
    // First update all player name labels
    for (let player = 1; player <= 4; player++) {
        // Update this player's name in all other players' menus
        for (let otherPlayer = 1; otherPlayer <= 4; otherPlayer++) {
            if (otherPlayer === player) continue; // Skip self

            // Update name in other player's menu (where this player deals damage)
            const labelInOtherMenu = document.getElementById(`commanderDamageLabel${otherPlayer}-${player}`);
            if (labelInOtherMenu) {
                labelInOtherMenu.textContent = getPlayerName(player);
            }
        }
    }

    // Then update all damage counters and summaries
    for (let toPlayer = 1; toPlayer <= 4; toPlayer++) {
        for (let fromPlayer = 1; fromPlayer <= 4; fromPlayer++) {
            if (fromPlayer === toPlayer) continue; // Skip self

            // Update damage counter
            const damage = commanderDamage[toPlayer][fromPlayer] || 0;
            const element = document.getElementById(`commanderDamage${toPlayer}-${fromPlayer}`);
            if (element) {
                element.textContent = damage;
            }
        }
        
        // Add visual feedback for commander damage
        updateCommanderDamageStyle(toPlayer, getTotalCommanderDamage(toPlayer));
    }
}

// Update life display styling based on life total
function updateLifeDisplayStyle(player, life) {
    const lifeElement = getLifeElement(player);
    if (!lifeElement) return;
    
    const lifeDisplay = lifeElement.parentElement;
    
    // Remove existing classes
    lifeDisplay.classList.remove('life-high', 'life-low', 'life-critical', 'life-negative');
    
    // Add appropriate class based on life total
    if (life <= 0) {
        lifeDisplay.classList.add('life-negative');
    } else if (life <= 5) {
        lifeDisplay.classList.add('life-critical');
    } else if (life <= 10) {
        lifeDisplay.classList.add('life-low');
    } else {
        lifeDisplay.classList.add('life-high');
    }
}

// Update commander damage styling based on damage total
function updateCommanderDamageStyle(player, damage) {
    // Update individual damage counters
    for (const fromPlayer in commanderDamage[player]) {
        const damage = commanderDamage[player][fromPlayer];
        const element = document.getElementById(`commanderDamage${player}-${fromPlayer}`);
        if (element) {
            element.classList.remove('commander-damage-high', 'commander-damage-critical');
            if (damage >= 21) {
                element.classList.add('commander-damage-critical');
            } else if (damage >= 15) {
                element.classList.add('commander-damage-high');
            }
        }
    }
}

// Get life element by player number
function getLifeElement(player) {
    switch(player) {
        case 1: return life1Element;
        case 2: return life2Element;
        case 3: return life3Element;
        case 4: return life4Element;
        default: return null;
    }
}

// Get commander damage element by player number
function getCommanderDamageElement(player) {
    switch(player) {
        case 1: return commanderDamage1Element;
        case 2: return commanderDamage2Element;
        case 3: return commanderDamage3Element;
        case 4: return commanderDamage4Element;
        default: return null;
    }
}

// Add visual effect when life changes
function addLifeChangeEffect(player, amount) {
    const lifeElement = getLifeElement(player);
    if (!lifeElement) return;
    
    const lifeCircle = lifeElement.parentElement; // This is the life-total-circle
    
    // Create temporary effect element
    const effect = document.createElement('div');
    effect.className = `life-effect ${amount > 0 ? 'positive' : 'negative'}`;
    effect.textContent = amount > 0 ? `+${amount}` : amount;
    
    // Append to the life circle for precise positioning
    lifeCircle.appendChild(effect);
    
    // Remove effect after animation
    setTimeout(() => {
        if (effect.parentElement) {
            effect.parentElement.removeChild(effect);
        }
    }, 1000);
}

// Add visual effect when commander damage changes
function addCommanderDamageEffect(player, amount) {
    const damageElement = getCommanderDamageElement(player);
    if (!damageElement) return;
    
    const playerSection = document.getElementById(`player${player}`);
    
    // Create temporary effect element
    const effect = document.createElement('div');
    effect.className = `commander-damage-effect ${amount > 0 ? 'positive' : 'negative'}`;
    effect.textContent = amount > 0 ? `+${amount}` : amount;
    
    playerSection.appendChild(effect);
    
    // Remove effect after animation
    setTimeout(() => {
        if (effect.parentElement) {
            effect.parentElement.removeChild(effect);
        }
    }, 1000);
}

// Add visual effect when resetting
function addResetEffect(player) {
    const playerSection = document.getElementById(`player${player}`);
    if (!playerSection) return;
    
    playerSection.style.animation = 'resetPulse 0.5s ease-in-out';
    
    setTimeout(() => {
        playerSection.style.animation = '';
    }, 500);
}

// Add visual effect when resetting commander damage
function addCommanderDamageResetEffect(player) {
    const playerSection = document.getElementById(`player${player}`);
    if (!playerSection) return;
    
    const commanderSection = playerSection.querySelector('.commander-damage-section');
    if (commanderSection) {
        commanderSection.style.animation = 'resetPulse 0.5s ease-in-out';
        
        setTimeout(() => {
            commanderSection.style.animation = '';
        }, 500);
    }
}

// Add visual effect when resetting all
function addResetAllEffect() {
    const playerSections = document.querySelectorAll('.player-section:not(.hidden)');
    playerSections.forEach(section => {
        section.style.animation = 'resetPulse 0.5s ease-in-out';
    });
    
    setTimeout(() => {
        playerSections.forEach(section => {
            section.style.animation = '';
        });
    }, 500);
}

// Add visual effect when resetting all commander damage
function addCommanderDamageResetAllEffect() {
    const commanderSections = document.querySelectorAll('.commander-damage-section');
    commanderSections.forEach(section => {
        section.style.animation = 'resetPulse 0.5s ease-in-out';
    });
    
    setTimeout(() => {
        commanderSections.forEach(section => {
            section.style.animation = '';
        });
    }, 500);
}



// Toggle side menu
function toggleMenu(player) {
    const menu = document.getElementById(`menu${player}`);
    const allMenus = document.querySelectorAll('.side-menu');
    
    // Close all other menus
    allMenus.forEach(m => {
        if (m !== menu && m.classList.contains('active')) {
            m.classList.remove('active');
        }
    });

    // Toggle this menu
    menu.classList.toggle('active');
}

// Toggle monarch status
function toggleMonarch(player) {
    const button = document.getElementById(`monarchBtn${player}`);
    const crown = document.getElementById(`crown${player}`);
    const playerName = getPlayerName(player);
    
    // If this player is already the monarch, remove the status
    if (currentMonarch === player) {
        currentMonarch = null;
        button.classList.remove('active');
        button.textContent = 'Claim Monarchy';
        crown.classList.add('hidden');
        soundManager.play('monarch');
        addHistoryEntry(getCurrentTime(), `${playerName} lost the Monarchy`, 'monarch');
    } else {
        // Remove monarch status from previous monarch
        if (currentMonarch !== null) {
            const oldButton = document.getElementById(`monarchBtn${currentMonarch}`);
            const oldCrown = document.getElementById(`crown${currentMonarch}`);
            const oldPlayerName = getPlayerName(currentMonarch);
            oldButton.classList.remove('active');
            oldButton.textContent = 'Claim Monarchy';
            oldCrown.classList.add('hidden');
            addHistoryEntry(getCurrentTime(), `${oldPlayerName} lost the Monarchy`, 'monarch');
        }
        
        // Set new monarch
        currentMonarch = player;
        button.classList.add('active');
        button.textContent = 'Current Monarch';
        crown.classList.remove('hidden');
        soundManager.play('monarch');
        addHistoryEntry(getCurrentTime(), `${playerName} became the Monarch`, 'monarch');
    }
    
    // Close the menu
    toggleMenu(player);
}

// Toggle initiative status
function toggleInitiative(player) {
    const button = document.getElementById(`initiativeBtn${player}`);
    const indicator = document.getElementById(`initiative${player}`);
    const playerName = getPlayerName(player);
    
    // If this player already has initiative, remove it
    if (currentInitiative === player) {
        currentInitiative = null;
        button.classList.remove('active');
        button.textContent = 'Take Initiative';
        indicator.classList.add('hidden');
        soundManager.play('initiative');
        addHistoryEntry(getCurrentTime(), `${playerName} lost the Initiative`, 'initiative');
    } else {
        // Remove initiative from previous player
        if (currentInitiative !== null) {
            const oldButton = document.getElementById(`initiativeBtn${currentInitiative}`);
            const oldIndicator = document.getElementById(`initiative${currentInitiative}`);
            const oldPlayerName = getPlayerName(currentInitiative);
            oldButton.classList.remove('active');
            oldButton.textContent = 'Take Initiative';
            oldIndicator.classList.add('hidden');
            addHistoryEntry(getCurrentTime(), `${oldPlayerName} lost the Initiative`, 'initiative');
        }
        
        // Set new initiative
        currentInitiative = player;
        button.classList.add('active');
        button.textContent = 'Have Initiative';
        indicator.classList.remove('hidden');
        soundManager.play('initiative');
        addHistoryEntry(getCurrentTime(), `${playerName} took the Initiative`, 'initiative');
    }
    
    // Close the menu
    toggleMenu(player);
}

// Toggle ascend status
function toggleAscend(player) {
    const button = document.getElementById(`ascendBtn${player}`);
    const indicator = document.getElementById(`ascend${player}`);
    const playerName = getPlayerName(player);
    
    // Toggle ascended status for this player
    if (ascendedPlayers.has(player)) {
        ascendedPlayers.delete(player);
        button.classList.remove('active');
        button.textContent = 'Ascend';
        indicator.classList.add('hidden');
        soundManager.play('ascend');
        addHistoryEntry(getCurrentTime(), `${playerName} is no longer Ascended`, 'ascend');
    } else {
        ascendedPlayers.add(player);
        button.classList.add('active');
        button.textContent = 'Ascended';
        indicator.classList.remove('hidden');
        soundManager.play('ascend');
        addHistoryEntry(getCurrentTime(), `${playerName} has Ascended`, 'ascend');
    }
    
    // Close the menu
    toggleMenu(player);
}

// Change poison counters for a player
function changePoison(player, amount) {
    let poisonCount;
    const menuDisplay = document.getElementById(`poisonMenu${player}`);
    const poisonDisplay = document.getElementById(`poison${player}`);
    const playerName = getPlayerName(player);

    // Get current poison count
    switch(player) {
        case 1: poisonCount = player1Poison; break;
        case 2: poisonCount = player2Poison; break;
        case 3: poisonCount = player3Poison; break;
        case 4: poisonCount = player4Poison; break;
        default: return;
    }

    // Calculate new poison count (can't go below 0)
    const newCount = Math.max(0, poisonCount + amount);

    // Update poison count
    switch(player) {
        case 1: player1Poison = newCount; break;
        case 2: player2Poison = newCount; break;
        case 3: player3Poison = newCount; break;
        case 4: player4Poison = newCount; break;
    }

    // Update displays
    menuDisplay.textContent = newCount;
    poisonDisplay.querySelector('.poison-value').textContent = newCount;
    
    // Show/hide poison display based on count
    if (newCount > 0) {
        poisonDisplay.classList.remove('hidden');
    } else {
        poisonDisplay.classList.add('hidden');
    }

    // Update token bubble positioning
    updateTokenBubble(player);

    // Play sound effect
    soundManager.play('poison');

    // Add to history
    const changeText = amount > 0 ? `+${amount}` : amount;
    addHistoryEntry(getCurrentTime(), `${playerName} poison counters: ${poisonCount} → ${newCount} (${changeText})`, 'poison');
}

// Reset poison counters when resetting a player
function resetPoison(player) {
    const menuDisplay = document.getElementById(`poisonMenu${player}`);
    const poisonDisplay = document.getElementById(`poison${player}`);
    const playerName = getPlayerName(player);

    // Get current poison count for history
    let oldCount;
    switch(player) {
        case 1: oldCount = player1Poison; player1Poison = 0; break;
        case 2: oldCount = player2Poison; player2Poison = 0; break;
        case 3: oldCount = player3Poison; player3Poison = 0; break;
        case 4: oldCount = player4Poison; player4Poison = 0; break;
    }

    // Update displays
    menuDisplay.textContent = '0';
    poisonDisplay.classList.add('hidden');

    // Update token bubble positioning
    updateTokenBubble(player);

    // Add to history if there were poison counters
    if (oldCount > 0) {
        addHistoryEntry(getCurrentTime(), `${playerName} poison counters reset: ${oldCount} → 0`, 'reset');
    }
}

// Random player selection
let isSelecting = false;

function selectRandomPlayer() {
    if (isSelecting) return;
    
    const button = document.querySelector('.btn-random-select');
    button.disabled = true;
    isSelecting = true;

    // Remove any previous selection
    clearPlayerSelection();

    // Get all visible player sections
    const playerSections = Array.from(document.querySelectorAll('.player-section:not(.hidden)'));
    const playerCount = playerSections.length;

    // Create banners for all players if they don't exist
    playerSections.forEach(section => {
        if (!section.querySelector('.selected-player-banner')) {
            const banner = document.createElement('div');
            banner.className = 'selected-player-banner';
            banner.textContent = 'Goes First! 🎉';
            section.appendChild(banner);
        }
    });

    // Play selection sound
    soundManager.play('playerSelect');

    // Roulette animation
    let currentIndex = 0;
    const rouletteSpeed = 100; // Initial speed in milliseconds
    const rouletteTime = 3000; // Total time for roulette in milliseconds
    const startTime = Date.now();

    function roulette() {
        // Remove selecting class from all sections
        playerSections.forEach(section => section.classList.remove('selecting'));
        
        // Add selecting class to current section
        playerSections[currentIndex].classList.add('selecting');
        
        // Play click sound for each highlight
        soundManager.play('click');
        
        // Calculate next interval based on elapsed time
        const elapsedTime = Date.now() - startTime;
        const progress = elapsedTime / rouletteTime;
        
        if (progress < 1) {
            // Increase interval as we progress (slowing down effect)
            const nextInterval = rouletteSpeed + (progress * 200);
            currentIndex = (currentIndex + 1) % playerCount;
            setTimeout(roulette, nextInterval);
        } else {
            // Final selection
            const randomIndex = Math.floor(Math.random() * playerCount);
            const selectedSection = playerSections[randomIndex];
            
            // Remove selecting class from all sections
            playerSections.forEach(section => section.classList.remove('selecting'));
            
            // Add selected class and show banner
            selectedSection.classList.add('selected');
            const banner = selectedSection.querySelector('.selected-player-banner');
            banner.classList.add('show');

            // Get the position of the selected player section for confetti
            const rect = selectedSection.getBoundingClientRect();
            const centerX = (rect.left + rect.right) / 2;
            const centerY = (rect.top + rect.bottom) / 2;

            // Create confetti burst effect
            const count = 200;
            const defaults = {
                origin: { 
                    x: centerX / window.innerWidth, 
                    y: centerY / window.innerHeight 
                },
                spread: 360,
                ticks: 100,
                gravity: 0.8,
                decay: 0.94,
                startVelocity: 30,
                shapes: ['star', 'circle'],
                colors: ['#8b5cf6', '#6d28d9', '#4c1d95', '#fbbf24', '#f59e0b']
            };

            function shoot() {
                confetti({
                    ...defaults,
                    particleCount: count / 4,
                    scalar: 1.2,
                    shapes: ['star']
                });

                confetti({
                    ...defaults,
                    particleCount: count / 4,
                    scalar: 0.75,
                    shapes: ['circle']
                });
            }

            setTimeout(shoot, 0);
            setTimeout(shoot, 100);
            setTimeout(shoot, 200);
            
            // Play celebration sounds
            soundManager.play('celebrate');
            setTimeout(() => soundManager.play('playerSelect'), 500);
            
            // Add to history
            const playerName = getPlayerName(randomIndex + 1);
            addHistoryEntry(getCurrentTime(), `${playerName} was randomly selected to go first! 🎲`, 'reset');
            
            // Re-enable button
            button.disabled = false;
            isSelecting = false;

            // Hide banner and remove selection after 10 seconds
            setTimeout(() => {
                banner.classList.remove('show');
                selectedSection.classList.remove('selected');
            }, 10000);
        }
    }

    // Start the roulette
    roulette();
}

function clearPlayerSelection() {
    const playerSections = document.querySelectorAll('.player-section');
    playerSections.forEach(section => {
        section.classList.remove('selecting', 'selected');
        const banner = section.querySelector('.selected-player-banner');
        if (banner) {
            banner.classList.remove('show');
        }
    });
}

// Toggle sound effects
function toggleSound() {
    const enabled = soundManager.toggleSound();
    const button = document.getElementById('soundToggle');
    if (enabled) {
        button.textContent = '🔊 Sound: On';
        button.classList.remove('muted');
    } else {
        button.textContent = '🔈 Sound: Off';
        button.classList.add('muted');
    }
}

// Roll dice
function rollDice(sides) {
    const diceElement = document.getElementById('mainDice');
    if (!diceElement || diceElement.classList.contains('rolling')) return;

    // Add rolling animation class
    diceElement.classList.add('rolling');
    
    // Clear previous number
    diceElement.textContent = '';
    
    // Play dice roll sound
    soundManager.play('click');
    
    // Generate random number after animation
    setTimeout(() => {
        const result = Math.floor(Math.random() * sides) + 1;
        diceElement.textContent = result;
        diceElement.classList.remove('rolling');
        
        // Add to history
        addHistoryEntry(getCurrentTime(), `Rolled d${sides}: ${result}`, 'dice');
    }, 1000);
}

// Change energy counters for a player
function changeEnergy(player, amount) {
    let energyCount;
    const menuDisplay = document.getElementById(`energyMenu${player}`);
    const energyDisplay = document.getElementById(`energy${player}`);
    const playerName = getPlayerName(player);

    // Get current energy count
    switch(player) {
        case 1: energyCount = player1Energy; break;
        case 2: energyCount = player2Energy; break;
        case 3: energyCount = player3Energy; break;
        case 4: energyCount = player4Energy; break;
        default: return;
    }

    // Calculate new energy count (can't go below 0)
    const newCount = Math.max(0, energyCount + amount);

    // Update energy count
    switch(player) {
        case 1: player1Energy = newCount; break;
        case 2: player2Energy = newCount; break;
        case 3: player3Energy = newCount; break;
        case 4: player4Energy = newCount; break;
    }

    // Update displays
    menuDisplay.textContent = newCount;
    energyDisplay.querySelector('.energy-value').textContent = newCount;
    
    // Show/hide energy display based on count
    if (newCount > 0) {
        energyDisplay.classList.remove('hidden');
    } else {
        energyDisplay.classList.add('hidden');
    }

    // Update token bubble positioning
    updateTokenBubble(player);

    // Play sound effect
    soundManager.play('counter');

    // Add to history
    const changeText = amount > 0 ? `+${amount}` : amount;
    addHistoryEntry(getCurrentTime(), `${playerName} energy counters: ${energyCount} → ${newCount} (${changeText})`, 'energy');
}

// Reset energy counters when resetting a player
function resetEnergy(player) {
    const menuDisplay = document.getElementById(`energyMenu${player}`);
    const energyDisplay = document.getElementById(`energy${player}`);
    const playerName = getPlayerName(player);

    // Get current energy count for history
    let oldCount;
    switch(player) {
        case 1: oldCount = player1Energy; player1Energy = 0; break;
        case 2: oldCount = player2Energy; player2Energy = 0; break;
        case 3: oldCount = player3Energy; player3Energy = 0; break;
        case 4: oldCount = player4Energy; player4Energy = 0; break;
    }

    // Update displays
    menuDisplay.textContent = '0';
    energyDisplay.classList.add('hidden');

    // Update token bubble positioning
    updateTokenBubble(player);

    // Add to history if there were energy counters
    if (oldCount > 0) {
        addHistoryEntry(getCurrentTime(), `${playerName} energy counters reset: ${oldCount} → 0`, 'reset');
    }
}

// Change experience counters for a player
function changeExperience(player, amount) {
    let experienceCount;
    const menuDisplay = document.getElementById(`experienceMenu${player}`);
    const experienceDisplay = document.getElementById(`experience${player}`);
    const playerName = getPlayerName(player);

    // Get current experience count
    switch(player) {
        case 1: experienceCount = player1Experience; break;
        case 2: experienceCount = player2Experience; break;
        case 3: experienceCount = player3Experience; break;
        case 4: experienceCount = player4Experience; break;
        default: return;
    }

    // Calculate new experience count (can't go below 0)
    const newCount = Math.max(0, experienceCount + amount);

    // Update experience count
    switch(player) {
        case 1: player1Experience = newCount; break;
        case 2: player2Experience = newCount; break;
        case 3: player3Experience = newCount; break;
        case 4: player4Experience = newCount; break;
    }

    // Update displays
    menuDisplay.textContent = newCount;
    experienceDisplay.querySelector('.experience-value').textContent = newCount;
    
    // Show/hide experience display based on count
    if (newCount > 0) {
        experienceDisplay.classList.remove('hidden');
    } else {
        experienceDisplay.classList.add('hidden');
    }

    // Update token bubble positioning
    updateTokenBubble(player);

    // Play sound effect
    soundManager.play('counter');

    // Add to history
    const changeText = amount > 0 ? `+${amount}` : amount;
    addHistoryEntry(getCurrentTime(), `${playerName} experience counters: ${experienceCount} → ${newCount} (${changeText})`, 'experience');
}

// Reset experience counters when resetting a player
function resetExperience(player) {
    const menuDisplay = document.getElementById(`experienceMenu${player}`);
    const experienceDisplay = document.getElementById(`experience${player}`);
    const playerName = getPlayerName(player);

    // Get current experience count for history
    let oldCount;
    switch(player) {
        case 1: oldCount = player1Experience; player1Experience = 0; break;
        case 2: oldCount = player2Experience; player2Experience = 0; break;
        case 3: oldCount = player3Experience; player3Experience = 0; break;
        case 4: oldCount = player4Experience; player4Experience = 0; break;
    }

    // Update displays
    menuDisplay.textContent = '0';
    experienceDisplay.classList.add('hidden');

    // Update token bubble positioning
    updateTokenBubble(player);

    // Add to history if there were experience counters
    if (oldCount > 0) {
        addHistoryEntry(getCurrentTime(), `${playerName} experience counters reset: ${oldCount} → 0`, 'reset');
    }
}

// Change storm counters for a player
function changeStorm(player, amount) {
    let stormCount;
    const menuDisplay = document.getElementById(`stormMenu${player}`);
    const stormDisplay = document.getElementById(`storm${player}`);
    const playerName = getPlayerName(player);

    // Get current storm count
    switch(player) {
        case 1: stormCount = player1Storm; break;
        case 2: stormCount = player2Storm; break;
        case 3: stormCount = player3Storm; break;
        case 4: stormCount = player4Storm; break;
        default: return;
    }

    // Calculate new storm count (can't go below 0)
    const newCount = Math.max(0, stormCount + amount);

    // Update storm count
    switch(player) {
        case 1: player1Storm = newCount; break;
        case 2: player2Storm = newCount; break;
        case 3: player3Storm = newCount; break;
        case 4: player4Storm = newCount; break;
    }

    // Update displays
    menuDisplay.textContent = newCount;
    stormDisplay.querySelector('.storm-value').textContent = newCount;
    
    // Show/hide storm display based on count
    if (newCount > 0) {
        stormDisplay.classList.remove('hidden');
    } else {
        stormDisplay.classList.add('hidden');
    }

    // Update token bubble positioning
    updateTokenBubble(player);

    // Play sound effect
    soundManager.play('counter');

    // Add to history
    const changeText = amount > 0 ? `+${amount}` : amount;
    addHistoryEntry(getCurrentTime(), `${playerName} storm count: ${stormCount} → ${newCount} (${changeText})`, 'storm');
}

// Reset storm counters when resetting a player
function resetStorm(player) {
    const menuDisplay = document.getElementById(`stormMenu${player}`);
    const stormDisplay = document.getElementById(`storm${player}`);
    const playerName = getPlayerName(player);

    // Get current storm count for history
    let oldCount;
    switch(player) {
        case 1: oldCount = player1Storm; player1Storm = 0; break;
        case 2: oldCount = player2Storm; player2Storm = 0; break;
        case 3: oldCount = player3Storm; player3Storm = 0; break;
        case 4: oldCount = player4Storm; player4Storm = 0; break;
    }

    // Update displays
    menuDisplay.textContent = '0';
    stormDisplay.classList.add('hidden');

    // Update token bubble positioning
    updateTokenBubble(player);

    // Add to history if there were storm counters
    if (oldCount > 0) {
        addHistoryEntry(getCurrentTime(), `${playerName} storm count reset: ${oldCount} → 0`, 'reset');
    }
}

// Custom Token Management Functions

// Get player tokens by player number
function getPlayerTokens(player) {
    switch(player) {
        case 1: return player1Tokens;
        case 2: return player2Tokens;
        case 3: return player3Tokens;
        case 4: return player4Tokens;
        default: return [];
    }
}

// Set player tokens by player number
function setPlayerTokens(player, tokens) {
    switch(player) {
        case 1: player1Tokens = tokens; break;
        case 2: player2Tokens = tokens; break;
        case 3: player3Tokens = tokens; break;
        case 4: player4Tokens = tokens; break;
    }
}

// Add or update a token for a player
function addOrUpdateToken(player, tokenName, quantity) {
    const tokens = getPlayerTokens(player);
    const existingTokenIndex = tokens.findIndex(token => token.name.toLowerCase() === tokenName.toLowerCase());
    
    if (existingTokenIndex !== -1) {
        // Update existing token
        const oldQuantity = tokens[existingTokenIndex].quantity;
        tokens[existingTokenIndex].quantity = quantity;
        updateTokenDisplay(player);
        
        // Add to history
        const playerName = getPlayerName(player);
        addHistoryEntry(getCurrentTime(), `${playerName} updated ${tokenName}: ${oldQuantity} → ${quantity}`, 'token');
    } else {
        // Add new token
        const newToken = {
            id: Date.now() + Math.random(), // Simple unique ID
            name: tokenName,
            quantity: quantity,
            icon: getTokenIcon(tokenName)
        };
        tokens.push(newToken);
        updateTokenDisplay(player);
        
        // Add to history
        const playerName = getPlayerName(player);
        addHistoryEntry(getCurrentTime(), `${playerName} added ${quantity}x ${tokenName}`, 'token');
    }
    
    soundManager.play('counter');
}

// Remove a token for a player
function removeToken(player, tokenId) {
    const tokens = getPlayerTokens(player);
    const tokenIndex = tokens.findIndex(token => token.id === tokenId);
    
    if (tokenIndex !== -1) {
        const removedToken = tokens[tokenIndex];
        tokens.splice(tokenIndex, 1);
        updateTokenDisplay(player);
        
        // Add to history
        const playerName = getPlayerName(player);
        addHistoryEntry(getCurrentTime(), `${playerName} removed ${removedToken.quantity}x ${removedToken.name}`, 'token');
        
        soundManager.play('click');
    }
}

// Change token quantity
function changeTokenQuantity(player, tokenId, change) {
    const tokens = getPlayerTokens(player);
    const token = tokens.find(t => t.id === tokenId);
    
    if (token) {
        const oldQuantity = token.quantity;
        token.quantity = Math.max(0, token.quantity + change);
        
        // Remove token if quantity reaches 0
        if (token.quantity === 0) {
            removeToken(player, tokenId);
            return;
        }
        
        updateTokenDisplay(player);
        
        // Add to history
        const playerName = getPlayerName(player);
        const changeText = change > 0 ? `+${change}` : change.toString();
        addHistoryEntry(getCurrentTime(), `${playerName} ${token.name}: ${oldQuantity} → ${token.quantity} (${changeText})`, 'token');
        
        soundManager.play('counter');
    }
}

// Get appropriate icon for token type
function getTokenIcon(tokenName) {
    const name = tokenName.toLowerCase();
    
    // Common token type mappings
    const iconMap = {
        'treasure': '🪙',
        'food': '🍖',
        'clue': '🔍',
        'blood': '🩸',
        'spirit': '👻',
        'soldier': '🛡️',
        'zombie': '🧟',
        'goblin': '👹',
        'elf': '🧝',
        'beast': '🐺',
        'dragon': '🐉',
        'angel': '😇',
        'demon': '😈',
        'artifact': '⚙️',
        'energy': '⚡',
        'poison': '☠️',
        'acorn': '🌰',
        'rad': '☢️',
        'ticket': '🎫',
        'powerstone': '💎'
    };
    
    // Check for partial matches
    for (const [key, icon] of Object.entries(iconMap)) {
        if (name.includes(key)) {
            return icon;
        }
    }
    
    return '🎯'; // Default icon
}

// Update token display for a player
function updateTokenDisplay(player) {
    const tokenContainer = document.getElementById(`tokenList${player}`);
    const tokenSection = document.getElementById(`tokenSection${player}`);
    const emptyState = document.getElementById(`tokenEmpty${player}`);
    
    if (!tokenContainer || !tokenSection || !emptyState) return;
    
    const tokens = getPlayerTokens(player);
    
    // Clear existing display
    tokenContainer.innerHTML = '';
    
    if (tokens.length === 0) {
        emptyState.style.display = 'block';
        updateTokenBubble(player);
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Render each token
    tokens.forEach(token => {
        const tokenElement = document.createElement('div');
        tokenElement.className = 'token-item';
        tokenElement.innerHTML = `
            <div class="token-info">
                <span class="token-icon">${token.icon}</span>
                <span class="token-text">${token.quantity}x ${token.name}</span>
            </div>
            <div class="token-controls">
                <button class="btn-token-decrease" onclick="changeTokenQuantity(${player}, ${token.id}, -1)" title="Decrease">-</button>
                <button class="btn-token-increase" onclick="changeTokenQuantity(${player}, ${token.id}, 1)" title="Increase">+</button>
                <button class="btn-token-edit" onclick="editToken(${player}, ${token.id})" title="Edit">✏️</button>
                <button class="btn-token-remove" onclick="removeToken(${player}, ${token.id})" title="Remove">🗑️</button>
            </div>
        `;
        tokenContainer.appendChild(tokenElement);
    });
    
    // Update the token bubble display
    updateTokenBubble(player);
}

// Toggle token section for a player
function toggleTokenSection(player) {
    const tokenMenu = document.getElementById(`tokenMenu${player}`);
    const toggle = document.querySelector(`#tokenSection${player} .token-section-toggle`);
    
    if (tokenMenu.classList.contains('active')) {
        tokenMenu.classList.remove('active');
        toggle.textContent = '⌄';
    } else {
        tokenMenu.classList.add('active');
        toggle.textContent = '⌃';
    }
    
    soundManager.play('click');
}

// Show token add modal
function showTokenModal(player) {
    const modal = document.getElementById('tokenModal');
    const playerNameSpan = document.getElementById('tokenModalPlayerName');
    const tokenNameInput = document.getElementById('tokenNameInput');
    const tokenQuantityInput = document.getElementById('tokenQuantityInput');
    
    // Set player context
    modal.dataset.player = player;
    playerNameSpan.textContent = getPlayerName(player);
    
    // Reset form
    tokenNameInput.value = '';
    tokenQuantityInput.value = '1';
    
    // Show modal
    modal.classList.add('active');
    tokenNameInput.focus();
    
    soundManager.play('click');
}

// Hide token modal
function hideTokenModal() {
    const modal = document.getElementById('tokenModal');
    modal.classList.remove('active');
    soundManager.play('click');
}

// Submit new token
function submitToken() {
    const modal = document.getElementById('tokenModal');
    const player = parseInt(modal.dataset.player);
    const tokenName = document.getElementById('tokenNameInput').value.trim();
    const tokenQuantity = parseInt(document.getElementById('tokenQuantityInput').value);
    
    // Validation
    if (!tokenName) {
        alert('Please enter a token name');
        return;
    }
    
    if (isNaN(tokenQuantity) || tokenQuantity < 1) {
        alert('Please enter a valid quantity (1 or more)');
        return;
    }
    
    if (tokenName.length > 30) {
        alert('Token name must be 30 characters or less');
        return;
    }
    
    // Add the token
    addOrUpdateToken(player, tokenName, tokenQuantity);
    
    // Hide modal
    hideTokenModal();
}

// Edit existing token
function editToken(player, tokenId) {
    const tokens = getPlayerTokens(player);
    const token = tokens.find(t => t.id === tokenId);
    
    if (!token) return;
    
    const modal = document.getElementById('tokenModal');
    const playerNameSpan = document.getElementById('tokenModalPlayerName');
    const tokenNameInput = document.getElementById('tokenNameInput');
    const tokenQuantityInput = document.getElementById('tokenQuantityInput');
    
    // Set player context and current values
    modal.dataset.player = player;
    modal.dataset.editingTokenId = tokenId;
    playerNameSpan.textContent = getPlayerName(player);
    tokenNameInput.value = token.name;
    tokenQuantityInput.value = token.quantity;
    
    // Show modal
    modal.classList.add('active');
    tokenNameInput.focus();
    tokenNameInput.select();
    
    soundManager.play('click');
}

// Submit edited token
function submitEditedToken() {
    const modal = document.getElementById('tokenModal');
    const player = parseInt(modal.dataset.player);
    const tokenId = parseFloat(modal.dataset.editingTokenId);
    const tokenName = document.getElementById('tokenNameInput').value.trim();
    const tokenQuantity = parseInt(document.getElementById('tokenQuantityInput').value);
    
    // Validation
    if (!tokenName) {
        alert('Please enter a token name');
        return;
    }
    
    if (isNaN(tokenQuantity) || tokenQuantity < 1) {
        alert('Please enter a valid quantity (1 or more)');
        return;
    }
    
    if (tokenName.length > 30) {
        alert('Token name must be 30 characters or less');
        return;
    }
    
    // Update the token
    const tokens = getPlayerTokens(player);
    const token = tokens.find(t => t.id === tokenId);
    
    if (token) {
        const oldName = token.name;
        const oldQuantity = token.quantity;
        
        token.name = tokenName;
        token.quantity = tokenQuantity;
        token.icon = getTokenIcon(tokenName);
        
        updateTokenDisplay(player);
        
        // Add to history
        const playerName = getPlayerName(player);
        if (oldName !== tokenName || oldQuantity !== tokenQuantity) {
            addHistoryEntry(getCurrentTime(), `${playerName} edited token: ${oldQuantity}x ${oldName} → ${tokenQuantity}x ${tokenName}`, 'token');
        }
        
        soundManager.play('counter');
    }
    
    // Clear editing state and hide modal
    delete modal.dataset.editingTokenId;
    hideTokenModal();
}

// Reset all tokens for a player
function resetTokens(player) {
    const tokens = getPlayerTokens(player);
    const tokenCount = tokens.length;
    
    if (tokenCount === 0) return;
    
    setPlayerTokens(player, []);
    updateTokenDisplay(player);
    
    // Add to history
    const playerName = getPlayerName(player);
    addHistoryEntry(getCurrentTime(), `${playerName} cleared all tokens (${tokenCount} removed)`, 'reset');
    
    soundManager.play('reset');
}

// Submit token from modal (handles both add and edit)
function submitTokenFromModal() {
    const modal = document.getElementById('tokenModal');
    
    // Check if we're editing an existing token
    if (modal.dataset.editingTokenId) {
        submitEditedToken();
    } else {
        submitToken();
    }
}

// Update token bubble display for a player
function updateTokenBubble(player) {
    const tokenBubbleLeft = document.getElementById(`tokenDisplay${player}`);
    const rightContainer = document.getElementById(`counterBubblesRight${player}`);
    
    if (!tokenBubbleLeft || !rightContainer) return;
    
    const tokens = getPlayerTokens(player);
    
    if (tokens.length === 0) {
        tokenBubbleLeft.classList.add('hidden');
        rightContainer.classList.add('hidden');
        // Clear any existing individual token bubbles in right container
        clearIndividualTokenBubbles(player);
        return;
    }
    
    // Count visible counters in the left column (excluding tokens)
    const leftCounters = [
        document.getElementById(`taxDisplay${player}`),
        document.getElementById(`poison${player}`),
        document.getElementById(`experience${player}`),
        document.getElementById(`energy${player}`),
        document.getElementById(`storm${player}`)
    ];
    
    const visibleLeftCounters = leftCounters.filter(counter => 
        counter && !counter.classList.contains('hidden')
    ).length;
    
    // Determine if tokens should overflow to right column
    const shouldOverflow = visibleLeftCounters >= 5;
    
    if (shouldOverflow) {
        // Hide left token bubble, show individual token bubbles in right container
        tokenBubbleLeft.classList.add('hidden');
        rightContainer.classList.remove('hidden');
        
        // Create individual bubbles for each token type in right container
        createIndividualTokenBubbles(player, tokens);
    } else {
        // Show combined token bubble in left column
        tokenBubbleLeft.classList.remove('hidden');
        rightContainer.classList.add('hidden');
        clearIndividualTokenBubbles(player);
        
        // Calculate total token count for left bubble
        const totalCount = tokens.reduce((sum, token) => sum + token.quantity, 0);
        
        // Determine which icon to show (most common token type, or generic if tied)
        let displayIcon = '🎯'; // Default icon
        
        if (tokens.length === 1) {
            // Single token type - use its icon
            displayIcon = tokens[0].icon;
        } else {
            // Multiple token types - find the most common, or use generic icon
            const tokenCounts = {};
            tokens.forEach(token => {
                tokenCounts[token.icon] = (tokenCounts[token.icon] || 0) + token.quantity;
            });
            
            const sortedIcons = Object.entries(tokenCounts).sort((a, b) => b[1] - a[1]);
            
            // If there's a clear winner (more than others), use that icon
            if (sortedIcons.length > 1 && sortedIcons[0][1] > sortedIcons[1][1]) {
                displayIcon = sortedIcons[0][0];
            }
            // Otherwise keep the generic token icon for mixed collections
        }
        
        // Update left bubble display
        const tokenIconLeft = tokenBubbleLeft.querySelector('.token-icon');
        const tokenValueLeft = tokenBubbleLeft.querySelector('.token-value');
        if (tokenIconLeft && tokenValueLeft) {
            tokenIconLeft.textContent = displayIcon;
            tokenValueLeft.textContent = totalCount;
        }
    }
}

// Clear individual token bubbles from right container
function clearIndividualTokenBubbles(player) {
    const rightContainer = document.getElementById(`counterBubblesRight${player}`);
    if (!rightContainer) return;
    
    // Remove all dynamically created token bubbles
    const dynamicBubbles = rightContainer.querySelectorAll('.token-bubble-individual');
    dynamicBubbles.forEach(bubble => bubble.remove());
}

// Create individual token bubbles in right container
function createIndividualTokenBubbles(player, tokens) {
    clearIndividualTokenBubbles(player);
    const rightContainer = document.getElementById(`counterBubblesRight${player}`);
    if (!rightContainer) return;
    
    tokens.forEach((token, index) => {
        const bubble = document.createElement('div');
        bubble.className = 'token-bubble-individual token-display';
        bubble.innerHTML = `
            <span class="token-icon">${token.icon}</span>
            <span class="token-value">${token.quantity}</span>
        `;
        
        // Add click handlers for increment/decrement
        bubble.onclick = (e) => {
            e.preventDefault();
            if (e.ctrlKey || e.metaKey) {
                // Ctrl/Cmd + click to decrement
                changeTokenQuantity(player, token.id, -1);
            } else {
                // Regular click to increment
                changeTokenQuantity(player, token.id, 1);
            }
        };
        
        // Add right-click for editing
        bubble.oncontextmenu = (e) => {
            e.preventDefault();
            editToken(player, token.id);
        };
        
        rightContainer.appendChild(bubble);
    });
}

// Handle Enter key in token modal
function handleTokenModalKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        submitTokenFromModal();
    } else if (event.key === 'Escape') {
        event.preventDefault();
        hideTokenModal();
    }
}

// Toggle settings menu
function toggleSettings() {
    const settingsMenu = document.getElementById('settingsMenu');
    settingsMenu.classList.toggle('active');
    soundManager.play('click');
}

// Export functions to global scope for HTML event handlers
window.toggleSound = toggleSound;
window.changeLife = changeLife;
window.resetLife = resetLife;
window.resetAll = resetAll;
window.setStartingLife = setStartingLife;
window.changePlayerCount = changePlayerCount;
window.updatePlayerName = updatePlayerName;
window.changeCommanderDamage = changeCommanderDamage;
window.resetCommanderDamage = resetCommanderDamage;
window.resetAllCommanderDamage = resetAllCommanderDamage;
window.updateLifeFromInput = updateLifeFromInput;
window.validateLifeInput = validateLifeInput;
window.clearHistory = clearHistory;
window.addHistoryEntry = addHistoryEntry;
window.toggleMenu = toggleMenu;
window.toggleMonarch = toggleMonarch;
window.toggleInitiative = toggleInitiative;
window.toggleAscend = toggleAscend;
window.changePoison = changePoison;
window.resetPoison = resetPoison;
window.selectRandomPlayer = selectRandomPlayer;
window.clearPlayerSelection = clearPlayerSelection;
window.changeTax = changeTax;
window.resetTax = resetTax;
window.rollDice = rollDice;
window.changeEnergy = changeEnergy;
window.resetEnergy = resetEnergy;
window.changeExperience = changeExperience;
window.resetExperience = resetExperience;
window.changeStorm = changeStorm;
window.resetStorm = resetStorm;
window.toggleSettings = toggleSettings;
window.toggleCommanderDamageMenu = toggleCommanderDamageMenu;
window.getPlayerTokens = getPlayerTokens;
window.addOrUpdateToken = addOrUpdateToken;
window.removeToken = removeToken;
window.changeTokenQuantity = changeTokenQuantity;
window.updateTokenDisplay = updateTokenDisplay;
window.toggleTokenSection = toggleTokenSection;
window.showTokenModal = showTokenModal;
window.hideTokenModal = hideTokenModal;
window.submitToken = submitToken;
window.editToken = editToken;
window.submitEditedToken = submitEditedToken;
window.resetTokens = resetTokens;
window.submitTokenFromModal = submitTokenFromModal;
window.handleTokenModalKeydown = handleTokenModalKeydown;
window.updateTokenBubble = updateTokenBubble;
window.clearIndividualTokenBubbles = clearIndividualTokenBubbles;
window.createIndividualTokenBubbles = createIndividualTokenBubbles; 