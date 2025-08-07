const Game = {
    // --- CONFIGURATION ---
    config: {
        difficulties: {
            easy:   { moleMinTime: 1000, moleMaxTime: 1800, spawnMinTime: 800, spawnMaxTime: 1600, simultaneousMoles: 1, gameDuration: 60, baseScore: 10 },
            medium: { moleMinTime: 600,  moleMaxTime: 1200, spawnMinTime: 500, spawnMaxTime: 1000, simultaneousMoles: 1, gameDuration: 45, baseScore: 10 },
            hard:   { moleMinTime: 350,  moleMaxTime: 700,  spawnMinTime: 250, spawnMaxTime: 600,  simultaneousMoles: 2, gameDuration: 30, baseScore: 15 }
        },
        boardSizes: {
            '3x3': { rows: 3, cols: 3, className: 'size-3x3' },
            '4x4': { rows: 4, cols: 4, className: 'size-4x4' },
            '5x5': { rows: 5, cols: 5, className: 'size-5x5' }
        },
        moleTypes: [
            { type: 'regular', scoreMultiplier: 1,    probability: 0.70, image: './assets/mole.png', whackedImage: './assets/mole-whacked.png', sound: './assets/smash.mp3' },
            { type: 'bonus',   scoreMultiplier: 3,    probability: 0.20, image: './assets/mole.png', whackedImage: './assets/mole-whacked.png', sound: './assets/smash.mp3' }, // Visually same, higher score
            { type: 'penalty', scoreMultiplier: -2,   probability: 0.10, image: './assets/mole.png', whackedImage: './assets/mole-whacked.png', sound: './assets/smash.mp3' }  // Visually same, negative score
        ],
        defaultDifficulty: 'medium',
        defaultBoardSize: '3x3',
        whackedDisplayMs: 300, // How long whacked mole image stays
        gameTickMs: 1000,
        moleImageFileName: 'mole.png',
        moleWhackedImageFileName: 'mole-whacked.png',
        smashSoundFileName: 'smash.mp3'
    },

    // --- STATE ---
    state: {
        currentScore: 0,
        currentTimeLeft: 0,
        gameTimerId: null,
        moleSpawnerIds: [], // For simultaneous moles
        activeMolesData: new Map(), // Map holeElement -> { moleImage, type, disappearTimeoutId, moleData }
        isPaused: false,
        isGameOver: true,
        selectedDifficultyKey: null,
        selectedBoardSizeKey: null,
        currentDifficultySettings: {},
        currentBoardSettings: {},
        whackSound: null
    },

    // --- DOM ELEMENTS ---
    elements: {
        difficultySelect: null, boardSizeSelect: null, newGameBtn: null,
        pauseBtn: null, restartBtn: null, scoreDisplay: null,
        timeLeftDisplay: null, board: null, cursor: null,
        finalScoreDisplay: null, finalScoreValue: null, playAgainBtn: null,
        gameStatusOverlay: null, statusMessage: null
    },

    // --- INITIALIZATION ---
    init: function() {
        this.cacheDOMElements();
        this.setupEventListeners();
        this.loadSounds();

        this.state.selectedDifficultyKey = this.elements.difficultySelect.value || this.config.defaultDifficulty;
        this.state.selectedBoardSizeKey = this.elements.boardSizeSelect.value || this.config.defaultBoardSize;

        this.applySettings();
        this.updateControlsState(); // Initial state of buttons
        this.elements.cursor.style.display = 'block'; // Show hammer from start
    },

    cacheDOMElements: function() {
        this.elements.difficultySelect = document.getElementById('difficulty');
        this.elements.boardSizeSelect = document.getElementById('boardSize');
        this.elements.newGameBtn = document.getElementById('newGameBtn');
        this.elements.pauseBtn = document.getElementById('pauseBtn');
        this.elements.restartBtn = document.getElementById('restartBtn');
        this.elements.scoreDisplay = document.querySelector('.score span');
        this.elements.timeLeftDisplay = document.querySelector('.countdown span');
        this.elements.board = document.querySelector('.board');
        this.elements.cursor = document.querySelector('.cursor');
        this.elements.finalScoreDisplay = document.querySelector('.final-score-display');
        this.elements.finalScoreValue = document.getElementById('finalScoreValue');
        this.elements.playAgainBtn = document.getElementById('playAgainBtn');
        this.elements.gameStatusOverlay = document.querySelector('.game-status-overlay');
        this.elements.statusMessage = document.getElementById('statusMessage');
    },

    loadSounds: function() {
        this.state.whackSound = new Audio(this.config.moleTypes[0].sound); // Assuming all types use same sound based on previous constraint
    },
    
    setupEventListeners: function() {
        this.elements.newGameBtn.addEventListener('click', () => this.prepareNewGame());
        this.elements.pauseBtn.addEventListener('click', () => this.togglePause());
        this.elements.restartBtn.addEventListener('click', () => this.restartGame());
        this.elements.playAgainBtn.addEventListener('click', () => this.restartGame(true)); // true to hide final score

        this.elements.difficultySelect.addEventListener('change', (e) => {
            this.state.selectedDifficultyKey = e.target.value;
            if (this.state.isGameOver) this.applySettings(); // Apply only if game not running
        });
        this.elements.boardSizeSelect.addEventListener('change', (e) => {
            this.state.selectedBoardSizeKey = e.target.value;
            if (this.state.isGameOver) this.applySettings(); // Apply only if game not running
        });
        
        window.addEventListener("mousemove", (e) => {
            this.elements.cursor.style.top = e.pageY + "px";
            this.elements.cursor.style.left = e.pageX + "px";
        });
        window.addEventListener("mousedown", () => {
            if(!this.state.isGameOver && !this.state.isPaused) this.elements.cursor.classList.add("active");
        });
        window.addEventListener("mouseup", () => {
            this.elements.cursor.classList.remove("active");
        });
    },

    applySettings: function() {
        this.state.currentDifficultySettings = this.config.difficulties[this.state.selectedDifficultyKey];
        this.state.currentBoardSettings = this.config.boardSizes[this.state.selectedBoardSizeKey];
        this.createBoard();
        this.resetGameVisuals();
    },

    createBoard: function() {
        this.elements.board.innerHTML = ''; // Clear existing holes
        const { rows, cols, className } = this.state.currentBoardSettings;
        this.elements.board.className = `board ${className}`; // Apply size-specific class

        const totalHoles = rows * cols;
        for (let i = 0; i < totalHoles; i++) {
            const hole = document.createElement('div');
            hole.classList.add('hole');
            hole.addEventListener('click', (e) => this.tryWhackMole(e.currentTarget));
            this.elements.board.appendChild(hole);
        }
    },
    
    resetGameVisuals: function() {
        this.state.currentScore = 0;
        this.state.currentTimeLeft = this.state.currentDifficultySettings.gameDuration;
        this.updateScoreDisplay();
        this.updateTimeLeftDisplay();
        this.elements.finalScoreDisplay.style.display = 'none';
        this.elements.gameStatusOverlay.style.display = 'none';
    },

    // --- GAME LIFECYCLE ---
    prepareNewGame: function() { // Called by New Game button
        this.endGameCleanup(true); // Full cleanup, ready for new settings
        this.state.selectedDifficultyKey = this.elements.difficultySelect.value;
        this.state.selectedBoardSizeKey = this.elements.boardSizeSelect.value;
        this.applySettings();
        this.startGame();
    },

    startGame: function() {
        if (!this.state.isGameOver) return; // Game already running or paused

        this.state.isGameOver = false;
        this.state.isPaused = false;
        this.resetGameVisuals(); // Resets score and time based on current settings

        this.state.gameTimerId = setInterval(() => this.gameTick(), this.config.gameTickMs);
        
        for(let i=0; i < this.state.currentDifficultySettings.simultaneousMoles; i++) {
            this.scheduleNextMoleSpawn();
        }

        this.updateControlsState();
        this.elements.cursor.style.display = 'block';
        document.body.style.cursor = 'none';
    },
    
    restartGame: function(hideFinalScoreScreen = false) {
        this.endGameCleanup(true); // Full cleanup
        if(hideFinalScoreScreen) this.elements.finalScoreDisplay.style.display = 'none';
        // Settings (difficulty, board size) remain as they were
        this.applySettings(); // Re-create board and reset visuals according to current settings
        this.startGame();
    },

    gameTick: function() {
        this.state.currentTimeLeft--;
        this.updateTimeLeftDisplay();
        if (this.state.currentTimeLeft <= 0) {
            this.gameOver();
        }
    },

    gameOver: function() {
        this.endGameCleanup();
        this.elements.finalScoreValue.textContent = this.state.currentScore;
        this.elements.finalScoreDisplay.style.display = 'block';
        document.body.style.cursor = 'default';
        //this.elements.cursor.style.display = 'none'; // Keep hammer visible or hide
    },
    
    endGameCleanup: function(isFullReset = false) {
        this.state.isGameOver = true;
        clearInterval(this.state.gameTimerId);
        this.state.gameTimerId = null;

        this.state.moleSpawnerIds.forEach(id => clearTimeout(id));
        this.state.moleSpawnerIds = [];

        this.state.activeMolesData.forEach((mole, holeElement) => {
            clearTimeout(mole.disappearTimeoutId);
            if (holeElement.contains(mole.moleImage)) { 
                holeElement.removeChild(mole.moleImage);
            }
        });
        this.state.activeMolesData.clear();
        
        if(isFullReset) { // For New Game / full Restart
            this.elements.gameStatusOverlay.style.display = 'none';
            this.state.isPaused = false;
        }
        this.updateControlsState();
    },

    togglePause: function() {
        if (this.state.isGameOver) return;
        this.state.isPaused = !this.state.isPaused;

        if (this.state.isPaused) {
            clearInterval(this.state.gameTimerId);
            this.state.gameTimerId = null; // Important: clear it so resume doesn't stack
            
            this.state.moleSpawnerIds.forEach(id => clearTimeout(id)); // Pause spawning
            this.state.moleSpawnerIds = []; // Will reschedule on resume

            this.state.activeMolesData.forEach(mole => {
                clearTimeout(mole.disappearTimeoutId);
                mole.remainingTime = mole.disappearTimeoutId ? (mole.disappearAt - Date.now()) : 0; // Store remaining time
            });
            this.elements.statusMessage.textContent = 'Paused';
            this.elements.gameStatusOverlay.style.display = 'flex';
            this.elements.pauseBtn.textContent = 'Resume';
        } else { // Resuming
            // Resume game timer
            if (this.state.currentTimeLeft > 0 && !this.state.gameTimerId) {
                 this.state.gameTimerId = setInterval(() => this.gameTick(), this.config.gameTickMs);
            }

            // Reschedule spawners
             for(let i=0; i < this.state.currentDifficultySettings.simultaneousMoles - this.state.activeMolesData.size; i++) {
                this.scheduleNextMoleSpawn();
            }

            // Resume active moles
            this.state.activeMolesData.forEach(mole => {
                if (mole.remainingTime > 0) {
                    mole.disappearTimeoutId = setTimeout(() => this.removeMole(mole.holeElement, false), mole.remainingTime);
                    mole.disappearAt = Date.now() + mole.remainingTime;
                } else if (!mole.isWhacked) { // If it should have disappeared but didn't (e.g. was whacked during pause visual)
                     this.removeMole(mole.holeElement, false);
                }
            });
            this.elements.gameStatusOverlay.style.display = 'none';
            this.elements.pauseBtn.textContent = 'Pause';
        }
        this.updateControlsState();
    },

    // --- MOLE LOGIC ---
    scheduleNextMoleSpawn: function() {
        if (this.state.isPaused || this.state.isGameOver) return;
        
        const { spawnMinTime, spawnMaxTime } = this.state.currentDifficultySettings;
        const spawnDelay = this.getRandomBetween(spawnMinTime, spawnMaxTime);
        
        const spawnerId = setTimeout(() => {
            this.spawnMole();
            // If game not over and not paused, schedule another one (for this spawner "slot")
            if (!this.state.isGameOver && !this.state.isPaused) {
                 this.scheduleNextMoleSpawn(); // Continuous spawning for this "slot"
            }
        }, spawnDelay);
        this.state.moleSpawnerIds.push(spawnerId);
        // Clean up finished spawnerIds from the array (optional, good practice)
        this.state.moleSpawnerIds = this.state.moleSpawnerIds.filter(id => id !== spawnerId || setTimeout(() => {},0), spawnerId); // Basic cleanup
    },

    spawnMole: function() {
        if (this.state.isPaused || this.state.isGameOver || this.state.activeMolesData.size >= this.state.currentDifficultySettings.simultaneousMoles * 2) { // Limit active moles on screen
             return;
        }

        const availableHoles = Array.from(this.elements.board.children)
                                    .filter(hole => !this.state.activeMolesData.has(hole));
        if (availableHoles.length === 0) return;

        const holeElement = availableHoles[Math.floor(Math.random() * availableHoles.length)];
        const moleData = this.selectMoleType();

        const moleImage = document.createElement('img');
        moleImage.src = moleData.image;
        moleImage.classList.add('mole');
        // moleImage.dataset.type = moleData.type; // Store type if needed for CSS later

        holeElement.appendChild(moleImage);

        const { moleMinTime, moleMaxTime } = this.state.currentDifficultySettings;
        const moleStayDuration = this.getRandomBetween(moleMinTime, moleMaxTime);
        
        const disappearTimeoutId = setTimeout(() => this.removeMole(holeElement, false), moleStayDuration);
        
        this.state.activeMolesData.set(holeElement, { 
            moleImage, 
            moleData, 
            disappearTimeoutId, 
            disappearAt: Date.now() + moleStayDuration,
            isWhacked: false
        });
    },
    
    selectMoleType: function() {
        const rand = Math.random();
        let cumulativeProbability = 0;
        for (const type of this.config.moleTypes) {
            cumulativeProbability += type.probability;
            if (rand <= cumulativeProbability) {
                return type;
            }
        }
        return this.config.moleTypes[0]; // Fallback
    },

    tryWhackMole: function(holeElement) {
        if (this.state.isPaused || this.state.isGameOver) return;

        const moleInfo = this.state.activeMolesData.get(holeElement);
        if (moleInfo && !moleInfo.isWhacked) {
            moleInfo.isWhacked = true; // Mark as whacked
            clearTimeout(moleInfo.disappearTimeoutId); // Stop it from disappearing on its own

            this.state.currentScore += moleInfo.moleData.scoreMultiplier * this.state.currentDifficultySettings.baseScore;
            this.updateScoreDisplay();

            if (this.state.whackSound) this.state.whackSound.play().catch(e => console.warn("Sound play failed:", e));
            
            moleInfo.moleImage.src = moleInfo.moleData.whackedImage;
            
            // Optional visual cue for bonus/penalty
            if (moleInfo.moleData.type === 'bonus') moleInfo.moleImage.classList.add('bonus-flash');
            if (moleInfo.moleData.type === 'penalty') moleInfo.moleImage.classList.add('penalty-flash');


            setTimeout(() => {
                this.removeMole(holeElement, true); // True means it was whacked
                 // Remove flash class after animation (approx 0.5s for flash + display time)
                if (moleInfo.moleImage.classList.contains('bonus-flash')) moleInfo.moleImage.classList.remove('bonus-flash');
                if (moleInfo.moleImage.classList.contains('penalty-flash')) moleInfo.moleImage.classList.remove('penalty-flash');
            }, this.config.whackedDisplayMs);
        }
    },

    removeMole: function(holeElement, wasWhacked) {
        const moleInfo = this.state.activeMolesData.get(holeElement);
        if (moleInfo && holeElement.contains(moleInfo.moleImage)) {
            holeElement.removeChild(moleInfo.moleImage);
        }
        this.state.activeMolesData.delete(holeElement);

        // If not paused and not game over, and this removal potentially opens a slot, try to spawn
        // This is implicitly handled by continuous spawners, but ensures slots are filled if one disappears
        // and a spawner isn't immediately ready.
        if (!this.state.isPaused && !this.state.isGameOver && this.state.activeMolesData.size < this.state.currentDifficultySettings.simultaneousMoles) {
            // Check if any spawner is currently "waiting"
            if (this.state.moleSpawnerIds.length < this.state.currentDifficultySettings.simultaneousMoles) {
                 this.scheduleNextMoleSpawn();
            }
        }
    },

    // --- UI UPDATES & HELPERS ---
    updateScoreDisplay: function() {
        this.elements.scoreDisplay.textContent = this.state.currentScore.toString().padStart(2, '0');
    },
    updateTimeLeftDisplay: function() {
        this.elements.timeLeftDisplay.textContent = this.state.currentTimeLeft.toString().padStart(2, '0');
    },
    updateControlsState: function() {
        const gameCanStart = this.state.isGameOver;
        const gameIsRunning = !this.state.isGameOver && !this.state.isPaused;
        const gameIsPaused = this.state.isPaused;

        this.elements.newGameBtn.disabled = !gameCanStart && !gameIsPaused; // Enable if game over or paused (to start new)
        this.elements.pauseBtn.disabled = this.state.isGameOver;
        this.elements.restartBtn.disabled = this.state.isGameOver; // Can restart if running or paused
        
        this.elements.difficultySelect.disabled = !this.state.isGameOver;
        this.elements.boardSizeSelect.disabled = !this.state.isGameOver;

        if (gameIsPaused) {
            this.elements.pauseBtn.textContent = 'Resume';
        } else {
            this.elements.pauseBtn.textContent = 'Pause';
        }
    },
    getRandomBetween: function(min, max) {
        return Math.random() * (max - min) + min;
    }
};

window.addEventListener('DOMContentLoaded', () => Game.init());