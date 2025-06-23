// Baby Fun World - Interactive Baby Game

// Global variables
let score = 0;
let currentGame = null;
let learningIndex = 0;
let backgroundMusic = null;
let isMusicPlaying = false;
let speechSynthesis = window.speechSynthesis;
let speakingVoice = null;

// Global variables for tracking game completion
let colorClickCount = 0;
let shapeClickCount = 0;
let animalClickCount = 0;
let wordClickCount = 0;

// Global variables for tracking achievements
let achievements = {
    firstSteps: false,
    colorMaster: false,
    numberWizard: false,
    alphabetExpert: false,
    shapeFinder: false,
    animalFriend: false
};

// Track game completions
let gameCompletions = {
    alphabet: 0,
    numbers: 0,
    colors: 0,
    shapes: 0,
    animals: 0,
    words: 0
};

// Audio elements
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Learning content for Eric
const learningItems = [
    { emoji: "🐶", title: "Dog", description: "Woof! This is a friendly dog! Dogs are loyal pets." },
    { emoji: "🐱", title: "Cat", description: "Meow! This is a cute cat! Cats like to sleep a lot." },
    { emoji: "🐮", title: "Cow", description: "Moo! This is a big cow! Cows give us milk." },
    { emoji: "🐷", title: "Pig", description: "Oink! This is a pink pig! Pigs are very smart." },
    { emoji: "🐸", title: "Frog", description: "Ribbit! This is a green frog! Frogs can jump high." },
    { emoji: "🦆", title: "Duck", description: "Quack! This is a yellow duck! Ducks love water." },
    { emoji: "🐔", title: "Chicken", description: "Cluck! This is a chicken! Chickens lay eggs." },
    { emoji: "🐑", title: "Sheep", description: "Baa! This is a fluffy sheep! Sheep give us wool." },
    { emoji: "🦁", title: "Lion", description: "Roar! This is a brave lion! Lions are kings of the jungle." },
    { emoji: "🐯", title: "Tiger", description: "Grrr! This is a striped tiger! Tigers are very strong." }
];

// Game configurations for Eric
const games = {
    alphabet: {
        title: "Eric's Alphabet Fun",
        description: "Learn your ABCs! Click on the letters in order.",
        letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    },
    numbers: {
        title: "Eric's Number Counting",
        description: "Count from 1 to 20! Click the numbers in order.",
        numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    },
    colors: {
        title: "Eric's Color Learning",
        description: "Learn all the colors! Click on the matching colors.",
        colors: [
            { name: 'Red', color: '#ff6b6b' },
            { name: 'Blue', color: '#4ecdc4' },
            { name: 'Green', color: '#96ceb4' },
            { name: 'Yellow', color: '#fdcb6e' },
            { name: 'Purple', color: '#a29bfe' },
            { name: 'Orange', color: '#e17055' },
            { name: 'Pink', color: '#fd79a8' },
            { name: 'Brown', color: '#8b4513' }
        ]
    },
    shapes: {
        title: "Eric's Shape Explorer",
        description: "Discover different shapes! Click on the shapes.",
        shapes: [
            { name: 'Circle', symbol: '⭕' },
            { name: 'Square', symbol: '⬜' },
            { name: 'Triangle', symbol: '🔺' },
            { name: 'Star', symbol: '⭐' },
            { name: 'Heart', symbol: '❤️' },
            { name: 'Diamond', symbol: '💎' }
        ]
    },
    animals: {
        title: "Eric's Animal Friends",
        description: "Meet friendly animals! Click on the animals.",
        animals: ['🐶', '🐱', '🐮', '🐷', '🐸', '🦆', '🐔', '🐑', '🦁', '🐯', '🐨', '🐼']
    },
    words: {
        title: "Eric's Word Builder",
        description: "Learn to read simple words! Click on the words.",
        words: ['CAT', 'DOG', 'SUN', 'HAT', 'BAG', 'CAR', 'BALL', 'BOOK', 'TREE', 'HOUSE', 'MAMA', 'DADA']
    }
};

// Writing Section Variables
let currentWritingMode = 'letters';
let currentWritingIndex = 0;
let isDrawing = false;
let isErasing = false;
let drawingHistory = [];
let currentStroke = [];

// Writing content arrays
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const words = ['CAT', 'DOG', 'SUN', 'MOON', 'STAR', 'TREE', 'BOOK', 'BALL', 'CAKE', 'FISH'];

// Canvas context
let canvas, ctx;

// Initialize the application
document.addEventListener("DOMContentLoaded", function() {
    setupEventListeners();
    updateScore();
    setupPlayArea();
    setupAudio();
    setupSpeech();
    showWelcomeMessage();
    
    // Initialize writing section
    initWritingSection();
    
    // Add writing section to navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#writing') {
                showSection('writing');
                initWritingSection();
            }
        });
    });
});

// Setup speech synthesis with better voice selection
function setupSpeech() {
    function loadVoices() {
        const voices = speechSynthesis.getVoices();
        console.log('Available voices:', voices.map(v => v.name));
        
        // Specifically look for a female voice
        speakingVoice = voices.find(voice => 
            voice.lang.includes('en') && 
            (voice.name.toLowerCase().includes('female') || 
             voice.name.toLowerCase().includes('woman') || 
             voice.name.toLowerCase().includes('girl') || 
             voice.name.toLowerCase().includes('samantha') ||
             voice.name.toLowerCase().includes('victoria') ||
             voice.name.toLowerCase().includes('alex') ||
             voice.name.toLowerCase().includes('karen') ||
             voice.name.toLowerCase().includes('zira') ||
             voice.name.toLowerCase().includes('hazel'))
        ) || voices.find(voice => voice.lang.includes('en')) || voices[0];
        
        if (speakingVoice) {
            console.log('Female speech voice loaded:', speakingVoice.name);
        } else {
            console.log('No female voice found, using default voice');
        }
    }
    
    // Load voices immediately if available
    loadVoices();
    
    // Wait for voices to load
    speechSynthesis.onvoiceschanged = loadVoices;
}

// Enhanced speak text function with better error handling
function speakText(text, rate = 0.8, pitch = 1.2) {
    if (speechSynthesis) {
        // Stop any current speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        if (speakingVoice) {
            utterance.voice = speakingVoice;
        }
        
        utterance.rate = rate; // Slightly slower for children
        utterance.pitch = pitch; // Slightly higher pitch for children
        utterance.volume = 0.9;
        utterance.lang = 'en-US';
        
        // Add error handling
        utterance.onerror = function(event) {
            console.log('Speech error:', event.error);
        };
        
        utterance.onend = function() {
            console.log('Speech finished:', text);
        };
        
        try {
            speechSynthesis.speak(utterance);
            console.log('Speaking:', text);
        } catch (error) {
            console.log('Speech synthesis error:', error);
        }
    }
}

// Setup audio system with baby sounds
function setupAudio() {
    // Create audio elements
    createAudioElements();
    
    // Add music control button to navbar
    addMusicControl();
    
    // Start background music after user interaction
    document.addEventListener('click', function() {
        if (!isMusicPlaying) {
            startBackgroundMusic();
        }
    }, { once: true });
}

// Create audio elements with baby sounds
function createAudioElements() {
    // Background music
    backgroundMusic = new Audio();
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    
    // Create audio elements for different sounds including baby sounds
    const sounds = {
        'success': createTone(523.25, 0.3, 'sine'), // C5
        'error': createTone(220, 0.2, 'square'), // A3
        'bubble': createTone(659.25, 0.1, 'triangle'), // E5
        'click': createTone(440, 0.1, 'sine'), // A4
        'complete': createChord([523.25, 659.25, 783.99], 0.5), // C major chord
        'animal': createTone(330, 0.3, 'sawtooth'), // E4
        'number': createTone(392, 0.2, 'sine'), // G4
        'letter': createTone(493.88, 0.2, 'sine'), // B4
        'color': createTone(587.33, 0.2, 'sine'), // D5
        'shape': createTone(415.30, 0.2, 'sine'), // Ab4
        'word': createTone(349.23, 0.2, 'sine'), // F4
        'score': createTone(659.25, 0.1, 'sine'), // E5
        'welcome': createChord([523.25, 659.25, 783.99, 1046.50], 0.8), // C major 7th
        'baby_laugh': createBabyLaugh(),
        'baby_giggle': createBabyGiggle(),
        'baby_coo': createBabyCoo(),
        'baby_squeal': createBabySqueal()
    };
    
    window.gameSounds = sounds;
}

// Create baby laugh sound
function createBabyLaugh() {
    return function() {
        const frequencies = [440, 523.25, 659.25, 440, 523.25];
        const durations = [0.2, 0.2, 0.3, 0.2, 0.2];
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + durations[index]);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + durations[index]);
            }, index * 200);
        });
    };
}

// Create baby giggle sound
function createBabyGiggle() {
    return function() {
        const frequencies = [330, 392, 440, 330, 392];
        const durations = [0.15, 0.15, 0.2, 0.15, 0.15];
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = 'triangle';
                
                gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + durations[index]);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + durations[index]);
            }, index * 150);
        });
    };
}

// Create baby coo sound
function createBabyCoo() {
    return function() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(330, audioContext.currentTime + 0.5);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    };
}

// Create baby squeal sound
function createBabySqueal() {
    return function() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.3);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    };
}

// Add music control button
function addMusicControl() {
    const navbar = document.querySelector('.navbar');
    const musicBtn = document.createElement('button');
    musicBtn.innerHTML = '<i class="fas fa-music"></i>';
    musicBtn.className = 'music-control';
    musicBtn.title = 'Toggle Music';
    musicBtn.onclick = toggleMusic;
    
    // Style the button
    musicBtn.style.cssText = `
        background: linear-gradient(45deg, #ff6b9d, #ff8fab);
        color: white;
        border: none;
        padding: 0.5rem;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        margin-left: 1rem;
        transition: all 0.3s ease;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    musicBtn.addEventListener('mouseenter', () => {
        musicBtn.style.transform = 'scale(1.1)';
    });
    
    musicBtn.addEventListener('mouseleave', () => {
        musicBtn.style.transform = 'scale(1)';
    });
    
    navbar.appendChild(musicBtn);
}

// Start background music
function startBackgroundMusic() {
    if (backgroundMusic && !isMusicPlaying) {
        // Create a simple happy melody using Web Audio API
        const melody = [
            { note: 523.25, duration: 0.5 }, // C5
            { note: 659.25, duration: 0.5 }, // E5
            { note: 783.99, duration: 0.5 }, // G5
            { note: 1046.50, duration: 0.5 }, // C6
            { note: 783.99, duration: 0.5 }, // G5
            { note: 659.25, duration: 0.5 }, // E5
            { note: 523.25, duration: 1.0 }  // C5
        ];
        
        playMelody(melody);
        isMusicPlaying = true;
        
        // Update music button
        const musicBtn = document.querySelector('.music-control i');
        if (musicBtn) {
            musicBtn.className = 'fas fa-volume-mute';
        }
    }
}

// Play melody
function playMelody(melody) {
    let time = audioContext.currentTime;
    
    melody.forEach((note, index) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(note.note, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + note.duration);
        }, index * note.duration * 1000);
    });
    
    // Repeat melody
    setTimeout(() => {
        if (isMusicPlaying) {
            playMelody(melody);
        }
    }, melody.reduce((total, note) => total + note.duration, 0) * 1000);
}

// Toggle music
function toggleMusic() {
    if (isMusicPlaying) {
        isMusicPlaying = false;
        const musicBtn = document.querySelector('.music-control i');
        if (musicBtn) {
            musicBtn.className = 'fas fa-music';
        }
        showNotification("Music paused! 🎵");
    } else {
        isMusicPlaying = true;
        const musicBtn = document.querySelector('.music-control i');
        if (musicBtn) {
            musicBtn.className = 'fas fa-volume-mute';
        }
        startBackgroundMusic();
        showNotification("Music playing! 🎵");
    }
}

// Play sound effect with baby sounds
function playSound(soundName) {
    if (window.gameSounds && window.gameSounds[soundName]) {
        window.gameSounds[soundName]();
    }
}

// Show welcome message for Eric
function showWelcomeMessage() {
    setTimeout(() => {
        showNotification("Welcome Eric Uyiosa! Mummy T & E loves you! 🌟");
        playSound('welcome');
        playSound('baby_laugh');
        speakText("Welcome Eric! Thank you Eric, you are doing well! Let's learn and have fun together!");
    }, 1000);
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            playSound('click');
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Baby character interactions
    document.querySelectorAll(".baby").forEach(baby => {
        baby.addEventListener("click", function() {
            this.style.transform = "scale(1.5) rotate(20deg)";
            addScore(5);
            playSound('animal');
            playSound('baby_squeal');
            
            // Random encouraging messages for Eric
            const messages = [
                "Great job, Eric!",
                "You're doing amazing, Eric!",
                "Wonderful clicking, Eric!",
                "You're so smart, Eric!",
                "Keep going, Eric!",
                "Fantastic work, Eric!",
                "You're learning so well, Eric!",
                "Excellent, Eric!"
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            speakText(randomMessage);
            showNotification("Great job, Eric! 🌟");
            setTimeout(() => {
                this.style.transform = "";
            }, 500);
        });
    });

    // Floating toy interactions
    document.querySelectorAll(".floating-toy").forEach(toy => {
        toy.addEventListener("click", function() {
            this.style.transform = "scale(1.5) rotate(20deg)";
            addScore(3);
            playSound('baby_giggle');
            
            const toyMessages = [
                "Fun toy, Eric!",
                "You found a toy!",
                "Great discovery, Eric!",
                "What a fun toy!",
                "You're playing well, Eric!"
            ];
            const randomToyMessage = toyMessages[Math.floor(Math.random() * toyMessages.length)];
            speakText(randomToyMessage);
            showNotification("Fun toy! 🧸");
            setTimeout(() => {
                this.style.transform = "";
            }, 500);
        });
    });

    // Character interactions
    document.querySelectorAll(".character").forEach(character => {
        character.addEventListener("click", function() {
            this.style.transform = "scale(1.3) rotate(15deg)";
            addScore(2);
            playSound('animal');
            playSound('baby_coo');
            
            const characterMessages = [
                "Hello animal friend!",
                "Nice to meet you!",
                "What a cute animal!",
                "You're friendly!",
                "Hello there!"
            ];
            const randomCharacterMessage = characterMessages[Math.floor(Math.random() * characterMessages.length)];
            speakText(randomCharacterMessage);
            showNotification("Hello animal friend! 🐾");
            setTimeout(() => {
                this.style.transform = "";
            }, 500);
        });
    });

    // Close modal when clicking outside
    window.addEventListener("click", function(event) {
        const gameModal = document.getElementById("game-modal");
        if (event.target === gameModal) {
            closeGame();
        }
    });
}

// Setup play area for bubble creation
function setupPlayArea() {
    const playArea = document.getElementById("play-area");
    if (playArea) {
        playArea.addEventListener("click", function(e) {
            createBubble(e.clientX, e.clientY);
        });
    }
}

// Create bubble at click position
function createBubble(x, y) {
    const playArea = document.getElementById("play-area");
    const rect = playArea.getBoundingClientRect();
    const bubbleX = x - rect.left;
    const bubbleY = y - rect.top;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    
    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#fdcb6e", "#e17055", "#fd79a8", "#a29bfe"];
    const colorNames = ["Red", "Blue", "Green", "Yellow", "Orange", "Pink", "Purple"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomColorName = colorNames[Math.floor(Math.random() * colorNames.length)];
    const size = Math.random() * 50 + 30;
    
    bubble.style.left = bubbleX + "px";
    bubble.style.top = bubbleY + "px";
    bubble.style.width = size + "px";
    bubble.style.height = size + "px";
    bubble.style.backgroundColor = randomColor;
    
    playArea.appendChild(bubble);
    addScore(1);
    playSound('bubble');
    playSound('baby_coo');
    
    // Speak the color name when bubble is created
    speakText(`Pop! A ${randomColorName} bubble!`);
    
    setTimeout(() => {
        if (bubble.parentNode) {
            bubble.parentNode.removeChild(bubble);
        }
    }, 4000);
}

// Start game function
function startGame() {
    document.getElementById("games").scrollIntoView({ 
        behavior: "smooth" 
    });
    playSound('click');
    playSound('baby_giggle');
    speakText("Thank you Eric, you are doing well! Let's learn, Eric!");
    showNotification("Let's learn, Eric! 🎮");
    
    // Show educational tip after a delay
    setTimeout(() => {
        showEducationalTip();
    }, 3000);
}

// Play specific game
function playGame(gameType) {
    currentGame = gameType;
    const game = games[gameType];
    
    document.getElementById("game-title").textContent = game.title;
    document.getElementById("game-modal").style.display = "block";
    
    const gameArea = document.getElementById("game-area");
    gameArea.innerHTML = "";
    
    switch(gameType) {
        case 'alphabet':
            createAlphabetGame(gameArea);
            break;
        case 'numbers':
            createNumberGame(gameArea);
            break;
        case 'colors':
            createColorGame(gameArea);
            break;
        case 'shapes':
            createShapeGame(gameArea);
            break;
        case 'animals':
            createAnimalGame(gameArea);
            break;
        case 'words':
            createWordGame(gameArea);
            break;
    }
    
    playSound('click');
    playSound('baby_coo');
    speakText(`Let's play the ${gameType} game!`);
    
    // Show game-specific educational tip
    setTimeout(() => {
        const gameTips = {
            'alphabet': "Letters make words, and words make stories! Keep learning, Eric!",
            'numbers': "Numbers help us count everything! You're doing great, Eric!",
            'colors': "Colors make our world beautiful! What's your favorite color, Eric?",
            'shapes': "Shapes are everywhere! Look for circles, squares, and triangles!",
            'animals': "Animals are amazing! Each one is special and unique!",
            'words': "Reading words is like solving a puzzle! You're getting so good at it!"
        };
        
        if (gameTips[gameType]) {
            speakText(gameTips[gameType]);
            showNotification(gameTips[gameType]);
        }
    }, 2000);
}

// Create alphabet learning game
function createAlphabetGame(gameArea) {
    const shuffledLetters = [...games.alphabet.letters].sort(() => Math.random() - 0.5);
    const selectedLetters = shuffledLetters.slice(0, 8);
    
    gameArea.innerHTML = `
        <div class="game-instructions">
            <h4>Eric, click on the letters in alphabetical order! 🔤</h4>
        </div>
        <div class="game-grid">
            ${selectedLetters.map(letter => `
                <div class="game-item alphabet-item" onclick="checkAlphabetOrder('${letter}')">
                    ${letter}
                </div>
            `).join('')}
        </div>
        <div style="text-align: center; margin-top: 1rem;">
            <p>Next letter: <span id="next-letter" style="font-size: 2rem; color: #ff6b9d; font-weight: bold;">A</span></p>
        </div>
    `;
    
    window.currentAlphabetIndex = 0;
    window.selectedLetters = selectedLetters.sort();
    updateNextLetter();
    speakText("Click on the letters in alphabetical order!");
}

// Create number counting game
function createNumberGame(gameArea) {
    const shuffledNumbers = [...games.numbers.numbers].sort(() => Math.random() - 0.5);
    const selectedNumbers = shuffledNumbers.slice(0, 8);
    
    gameArea.innerHTML = `
        <div class="game-instructions">
            <h4>Eric, count from 1 to 20! Click the numbers in order! 🔢</h4>
        </div>
        <div class="game-grid">
            ${selectedNumbers.map(num => `
                <div class="game-item number-item" onclick="checkNumberOrder(${num})">
                    ${num}
                </div>
            `).join('')}
        </div>
        <div style="text-align: center; margin-top: 1rem;">
            <p>Next number: <span id="next-number" style="font-size: 2rem; color: #ff6b9d; font-weight: bold;">1</span></p>
        </div>
    `;
    
    window.currentNumberIndex = 0;
    window.selectedNumbers = selectedNumbers.sort((a, b) => a - b);
    updateNextNumber();
    speakText("Count the numbers in order!");
}

// Create color learning game
function createColorGame(gameArea) {
    const shuffledColors = [...games.colors.colors].sort(() => Math.random() - 0.5);
    const selectedColors = shuffledColors.slice(0, 6);
    
    gameArea.innerHTML = `
        <div class="game-instructions">
            <h4>Eric, learn the colors! Click on the colors! 🎨</h4>
        </div>
        <div class="game-grid">
            ${selectedColors.map(colorObj => `
                <div class="game-item color-item" 
                     style="background-color: ${colorObj.color}" 
                     onclick="learnColor('${colorObj.name}', '${colorObj.color}')"
                     title="${colorObj.name}">
                </div>
            `).join('')}
        </div>
    `;
    speakText("Click on the colors to learn their names!");
}

// Create shape learning game
function createShapeGame(gameArea) {
    const shuffledShapes = [...games.shapes.shapes].sort(() => Math.random() - 0.5);
    const selectedShapes = shuffledShapes.slice(0, 6);
    
    gameArea.innerHTML = `
        <div class="game-instructions">
            <h4>Eric, discover different shapes! Click on the shapes! ⭐</h4>
        </div>
        <div class="game-grid">
            ${selectedShapes.map(shapeObj => `
                <div class="game-item shape-item" onclick="learnShape('${shapeObj.name}')">
                    <span style="font-size: 2.5rem;">${shapeObj.symbol}</span>
                </div>
            `).join('')}
        </div>
    `;
    speakText("Click on the shapes to learn their names!");
}

// Create animal learning game
function createAnimalGame(gameArea) {
    const shuffledAnimals = [...games.animals.animals].sort(() => Math.random() - 0.5);
    const selectedAnimals = shuffledAnimals.slice(0, 8);
    
    gameArea.innerHTML = `
        <div class="game-instructions">
            <h4>Eric, meet friendly animals! Click on the animals! 🐾</h4>
        </div>
        <div class="game-grid">
            ${selectedAnimals.map(animal => `
                <div class="game-item animal-item" onclick="learnAnimal('${animal}')">
                    <span style="font-size: 3rem;">${animal}</span>
                </div>
            `).join('')}
        </div>
    `;
    speakText("Click on the animals to learn their names!");
}

// Create word building game
function createWordGame(gameArea) {
    const shuffledWords = [...games.words.words].sort(() => Math.random() - 0.5);
    const selectedWords = shuffledWords.slice(0, 6);
    
    gameArea.innerHTML = `
        <div class="game-instructions">
            <h4>Eric, learn to read simple words! Click on the words! 📚</h4>
        </div>
        <div class="game-grid">
            ${selectedWords.map(word => `
                <div class="game-item word-item" onclick="learnWord('${word}')">
                    ${word}
                </div>
            `).join('')}
        </div>
    `;
    speakText("Click on the words to learn how to read them!");
}

// Game interaction functions
function checkAlphabetOrder(letter) {
    const expectedLetter = window.selectedLetters[window.currentAlphabetIndex];
    if (letter === expectedLetter) {
        addScore(10);
        playSound('letter');
        playSound('baby_giggle');
        speakText(`Letter ${letter}`);
        showNotification(`Great job, Eric! You found ${letter}! 🔤`);
        window.currentAlphabetIndex++;
        updateNextLetter();
        
        if (window.currentAlphabetIndex >= window.selectedLetters.length) {
            playSound('complete');
            playSound('baby_laugh');
            speakText("Thank you Eric, you are doing well! Excellent! You completed the alphabet game!");
            showNotification("Thank you Eric, you are doing well! 🎉");
            setTimeout(closeGame, 3000);
        }
    } else {
        playSound('error');
        speakText(`Try again! Look for letter ${expectedLetter}`);
        showNotification(`Try again, Eric! Look for ${expectedLetter}! 💪`);
    }
}

function checkNumberOrder(number) {
    const expectedNumber = window.selectedNumbers[window.currentNumberIndex];
    if (number === expectedNumber) {
        addScore(10);
        playSound('number');
        playSound('baby_giggle');
        speakText(`Number ${number}`);
        showNotification(`Perfect counting, Eric! You found ${number}! 🔢`);
        window.currentNumberIndex++;
        updateNextNumber();
        
        if (window.currentNumberIndex >= window.selectedNumbers.length) {
            playSound('complete');
            playSound('baby_laugh');
            speakText("Thank you Eric, you are doing well! Amazing! You completed the counting game!");
            showNotification("Thank you Eric, you are doing well! 🎉");
            setTimeout(closeGame, 3000);
        }
    } else {
        playSound('error');
        speakText(`Try again! Look for number ${expectedNumber}`);
        showNotification(`Try again, Eric! Look for ${expectedNumber}! 💪`);
    }
}

function learnColor(colorName, colorValue) {
    addScore(10);
    playSound('color');
    playSound('baby_coo');
    speakText(`This is ${colorName}`);
    showNotification(`Great job, Eric! This is ${colorName}! 🎨`);
    
    colorClickCount++;
    if (colorClickCount >= 6) { // Assuming 6 colors per game
        setTimeout(() => {
            playSound('baby_laugh');
            speakText("Thank you Eric, you are doing well! You learned all the colors!");
            showNotification("Thank you Eric, you are doing well! 🎨");
            colorClickCount = 0;
        }, 1000);
    }
}

function learnShape(shapeName) {
    addScore(10);
    playSound('shape');
    playSound('baby_coo');
    speakText(`This is a ${shapeName}`);
    showNotification(`Excellent, Eric! This is a ${shapeName}! ⭐`);
    
    shapeClickCount++;
    if (shapeClickCount >= 6) { // Assuming 6 shapes per game
        setTimeout(() => {
            playSound('baby_laugh');
            speakText("Thank you Eric, you are doing well! You learned all the shapes!");
            showNotification("Thank you Eric, you are doing well! ⭐");
            shapeClickCount = 0;
        }, 1000);
    }
}

function learnAnimal(animal) {
    addScore(10);
    playSound('animal');
    playSound('baby_squeal');
    const animalNames = {
        '🐶': 'Dog', '🐱': 'Cat', '🐮': 'Cow', '🐷': 'Pig', '🐸': 'Frog', '🦆': 'Duck',
        '🐔': 'Chicken', '🐑': 'Sheep', '🦁': 'Lion', '🐯': 'Tiger', '🐨': 'Koala', '🐼': 'Panda'
    };
    const animalName = animalNames[animal] || 'Animal';
    speakText(`This is a ${animalName}`);
    showNotification(`Wonderful, Eric! This is a ${animalName}! 🐾`);
    
    animalClickCount++;
    if (animalClickCount >= 8) { // Assuming 8 animals per game
        setTimeout(() => {
            playSound('baby_laugh');
            speakText("Thank you Eric, you are doing well! You learned all the animals!");
            showNotification("Thank you Eric, you are doing well! 🐾");
            animalClickCount = 0;
        }, 1000);
    }
}

function learnWord(word) {
    addScore(10);
    playSound('word');
    playSound('baby_giggle');
    speakText(`This word is ${word}`);
    showNotification(`Fantastic reading, Eric! This word is "${word}"! 📚`);
    
    wordClickCount++;
    if (wordClickCount >= 6) { // Assuming 6 words per game
        setTimeout(() => {
            playSound('baby_laugh');
            speakText("Thank you Eric, you are doing well! You learned all the words!");
            showNotification("Thank you Eric, you are doing well! 📚");
            wordClickCount = 0;
        }, 1000);
    }
}

// Helper functions
function updateNextLetter() {
    if (window.currentAlphabetIndex < window.selectedLetters.length) {
        document.getElementById('next-letter').textContent = window.selectedLetters[window.currentAlphabetIndex];
    }
}

function updateNextNumber() {
    if (window.currentNumberIndex < window.selectedNumbers.length) {
        document.getElementById('next-number').textContent = window.selectedNumbers[window.currentNumberIndex];
    }
}

// Next learning item
function nextLearning() {
    learningIndex = (learningIndex + 1) % learningItems.length;
    const item = learningItems[learningIndex];
    
    document.getElementById("learning-emoji").textContent = item.emoji;
    document.getElementById("learning-title").textContent = item.title;
    document.getElementById("learning-description").textContent = item.description;
    
    addScore(5);
    playSound('animal');
    playSound('baby_giggle');
    
    // More engaging speech for learning
    const learningMessages = [
        `This is a ${item.title}. ${item.description}`,
        `Look, Eric! It's a ${item.title}! ${item.description}`,
        `Can you see the ${item.title}, Eric? ${item.description}`,
        `What's this, Eric? It's a ${item.title}! ${item.description}`,
        `Let's learn about the ${item.title}, Eric! ${item.description}`
    ];
    const randomLearningMessage = learningMessages[Math.floor(Math.random() * learningMessages.length)];
    speakText(randomLearningMessage);
    showNotification(`Great learning, Eric! You learned about ${item.title}! 📚`);
}

// Add educational tips and facts
function showEducationalTip() {
    const tips = [
        "Did you know? Learning colors helps your brain grow! 🧠",
        "Counting numbers makes you super smart, Eric! 🔢",
        "Reading letters is the first step to reading books! 📖",
        "Shapes are everywhere around us! Look around, Eric! 👀",
        "Animals are our friends! We should be kind to them! 🐾",
        "Words help us talk to each other! Keep learning, Eric! 💬",
        "Learning is fun! You're doing amazing, Eric! ⭐",
        "Every day you learn something new! You're growing so fast! 🌱"
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    showNotification(randomTip);
    speakText(randomTip);
}

// Game control functions
function closeGame() {
    document.getElementById("game-modal").style.display = "none";
    currentGame = null;
    playSound('click');
    speakText("Game closed!");
}

function restartGame() {
    if (currentGame) {
        playSound('click');
        speakText("Let's try again!");
        playGame(currentGame);
    }
}

// Score functions
function addScore(points) {
    score += points;
    updateScore();
    playSound('score');
    
    // Check for achievements
    checkAchievements();
    
    // Educational rewards at certain score milestones
    if (score === 50) {
        setTimeout(() => {
            speakText("Wow Eric! You earned 50 points! You're becoming a learning superstar!");
            showNotification("50 points! You're a learning superstar! 🌟");
            playSound('baby_laugh');
        }, 500);
    } else if (score === 100) {
        setTimeout(() => {
            speakText("Amazing Eric! 100 points! You're so smart and clever!");
            showNotification("100 points! You're so smart! 🧠");
            playSound('baby_laugh');
        }, 500);
    } else if (score === 200) {
        setTimeout(() => {
            speakText("Incredible Eric! 200 points! You're a learning champion!");
            showNotification("200 points! Learning champion! 🏆");
            playSound('baby_laugh');
        }, 500);
    }
    
    if (points > 5) {
        speakText(`Great job! You earned ${points} points!`);
    }
}

function updateScore() {
    document.getElementById("score").textContent = score;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement("div");
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, #ff6b9d, #ff8fab);
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        box-shadow: 0 8px 25px rgba(255, 107, 157, 0.4);
        z-index: 3000;
        font-weight: bold;
        font-size: 1.1rem;
        animation: slideIn 0.5s ease;
        max-width: 300px;
        text-align: center;
    `;
    notification.textContent = message;
    
    const style = document.createElement("style");
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = "slideOut 0.5s ease forwards";
        style.textContent += `
            @keyframes slideOut {
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
    }, 2500);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
        if (style.parentNode) {
            style.parentNode.removeChild(style);
        }
    }, 3000);
}

// Create a simple tone
function createTone(frequency, duration, type = 'sine') {
    return function() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    };
}

// Create a chord
function createChord(frequencies, duration) {
    return function() {
        frequencies.forEach(freq => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        });
    };
}

// Check and unlock achievements
function checkAchievements() {
    // First Steps - Complete any game
    if (!achievements.firstSteps && Object.values(gameCompletions).some(count => count > 0)) {
        unlockAchievement('firstSteps', 'First Steps', 'Complete your first game');
    }
    
    // Color Master - Complete color game
    if (!achievements.colorMaster && gameCompletions.colors >= 1) {
        unlockAchievement('colorMaster', 'Color Master', 'Learn all colors');
    }
    
    // Number Wizard - Complete number game
    if (!achievements.numberWizard && gameCompletions.numbers >= 1) {
        unlockAchievement('numberWizard', 'Number Wizard', 'Count to 20');
    }
    
    // Alphabet Expert - Complete alphabet game
    if (!achievements.alphabetExpert && gameCompletions.alphabet >= 1) {
        unlockAchievement('alphabetExpert', 'Alphabet Expert', 'Know your ABCs');
    }
    
    // Shape Finder - Complete shape game
    if (!achievements.shapeFinder && gameCompletions.shapes >= 1) {
        unlockAchievement('shapeFinder', 'Shape Finder', 'Discover all shapes');
    }
    
    // Animal Friend - Complete animal game
    if (!achievements.animalFriend && gameCompletions.animals >= 1) {
        unlockAchievement('animalFriend', 'Animal Friend', 'Meet all animals');
    }
}

// Unlock achievement
function unlockAchievement(achievementId, title, description) {
    achievements[achievementId] = true;
    
    // Update UI
    const achievementElement = document.getElementById(achievementId);
    if (achievementElement) {
        achievementElement.textContent = '✅';
        achievementElement.classList.add('unlocked');
    }
    
    // Show celebration
    playSound('complete');
    playSound('baby_laugh');
    speakText(`Congratulations Eric! You unlocked the ${title} achievement! ${description}`);
    showNotification(`🏆 Achievement Unlocked: ${title}! 🎉`);
    
    // Add bonus points
    addScore(25);
}

// Update game completion tracking
function updateGameCompletion(gameType) {
    gameCompletions[gameType]++;
    
    // Update progress bars
    const progressFill = document.querySelector(`[onclick="playGame('${gameType}')"] .progress-fill`);
    const progressText = document.querySelector(`[onclick="playGame('${gameType}')"] .progress-text`);
    
    if (progressFill && progressText) {
        const progress = Math.min((gameCompletions[gameType] / 1) * 100, 100);
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}% Complete`;
    }
}

// Fun Activities Functions
function triggerConfetti() {
    playSound('baby_laugh');
    speakText("Yay! Let's celebrate, Eric!");
    showNotification("🎉 Celebration time! 🎉");
    
    // Create confetti pieces
    const colors = ['#ff6b9d', '#4ecdc4', '#45b7d1', '#96ceb4', '#fdcb6e', '#e17055', '#fd79a8', '#a29bfe'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3000);
        }, i * 50);
    }
}

function openSurpriseBox() {
    playSound('baby_squeal');
    speakText("Surprise! You found a special gift, Eric!");
    showNotification("🎁 Surprise! You're amazing, Eric! 🎁");
    
    const surprises = [
        "🌟 You're a superstar!",
        "🎈 You're so smart!",
        "🎨 You're creative!",
        "🏆 You're a champion!",
        "💫 You're magical!",
        "🎪 You're fun!",
        "🧸 You're special!",
        "🎵 You're musical!"
    ];
    
    const randomSurprise = surprises[Math.floor(Math.random() * surprises.length)];
    setTimeout(() => {
        speakText(randomSurprise);
        showNotification(randomSurprise);
        addScore(15);
    }, 1000);
    
    triggerConfetti();
}

function playDrum() {
    playSound('baby_giggle');
    speakText("Boom boom! Let's make music, Eric!");
    showNotification("🥁 Boom boom! Music time! 🥁");
    
    // Create drum beat sounds
    const drumBeats = [
        createTone(200, 0.2, 'square'),
        createTone(150, 0.3, 'sawtooth'),
        createTone(250, 0.1, 'triangle')
    ];
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            drumBeats[Math.floor(Math.random() * drumBeats.length)]();
        }, i * 300);
    }
    
    addScore(10);
}

function makeRainbow() {
    playSound('baby_coo');
    speakText("Look at the beautiful rainbow, Eric!");
    showNotification("🌈 Beautiful rainbow for you! 🌈");
    
    // Create rainbow effect
    const rainbowColors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
    
    for (let i = 0; i < 7; i++) {
        setTimeout(() => {
            const rainbow = document.createElement('div');
            rainbow.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: ${(i + 1) * 50}px;
                height: ${(i + 1) * 30}px;
                background: ${rainbowColors[i]};
                border-radius: 50%;
                z-index: 9998;
                opacity: 0.7;
                animation: rainbowPulse 2s ease-out forwards;
            `;
            document.body.appendChild(rainbow);
            
            setTimeout(() => {
                if (rainbow.parentNode) {
                    rainbow.parentNode.removeChild(rainbow);
                }
            }, 2000);
        }, i * 200);
    }
    
    addScore(10);
}

function popBalloons() {
    playSound('baby_squeal');
    speakText("Pop! Pop! Pop! Balloons everywhere, Eric!");
    showNotification("🎈 Pop! Pop! Pop! 🎈");
    
    // Create balloon popping effect
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const balloon = document.createElement('div');
            balloon.style.cssText = `
                position: fixed;
                top: ${Math.random() * 80 + 10}%;
                left: ${Math.random() * 80 + 10}%;
                font-size: 3rem;
                z-index: 9998;
                animation: balloonPop 1s ease-out forwards;
            `;
            balloon.textContent = '🎈';
            document.body.appendChild(balloon);
            
            setTimeout(() => {
                if (balloon.parentNode) {
                    balloon.parentNode.removeChild(balloon);
                }
            }, 1000);
        }, i * 200);
    }
    
    addScore(10);
}

function danceParty() {
    playSound('baby_laugh');
    speakText("Let's dance together, Eric! Shake shake shake!");
    showNotification("💃 Dance party time! Shake it! 💃");
    
    // Create dance party effect
    const danceEmojis = ['💃', '🕺', '🎵', '🎶', '✨', '🌟'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const dancer = document.createElement('div');
            dancer.style.cssText = `
                position: fixed;
                top: ${Math.random() * 80 + 10}%;
                left: ${Math.random() * 80 + 10}%;
                font-size: 2rem;
                z-index: 9998;
                animation: danceMove 2s ease-in-out infinite;
            `;
            dancer.textContent = danceEmojis[Math.floor(Math.random() * danceEmojis.length)];
            document.body.appendChild(dancer);
            
            setTimeout(() => {
                if (dancer.parentNode) {
                    dancer.parentNode.removeChild(dancer);
                }
            }, 4000);
        }, i * 300);
    }
    
    addScore(15);
}

// Add CSS animations for new effects
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbowPulse {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.7; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }
    
    @keyframes balloonPop {
        0% { transform: scale(1) rotate(0deg); opacity: 1; }
        50% { transform: scale(1.5) rotate(180deg); opacity: 0.8; }
        100% { transform: scale(0) rotate(360deg); opacity: 0; }
    }
    
    @keyframes danceMove {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-20px) rotate(10deg); }
        50% { transform: translateY(-10px) rotate(-10deg); }
        75% { transform: translateY(-15px) rotate(5deg); }
    }
`;
document.head.appendChild(style);

// Initialize writing section
function initWritingSection() {
    canvas = document.getElementById('writing-canvas');
    if (canvas) {
        ctx = canvas.getContext('2d');
        setupCanvas();
        loadWritingContent();
        updateWritingProgress();
    }
}

// Setup canvas for drawing
function setupCanvas() {
    if (!canvas || !ctx) return;
    
    // Set canvas size
    canvas.width = 400;
    canvas.height = 300;
    
    // Set default drawing style
    ctx.strokeStyle = '#ff6b9d';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Add event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
    
    // Prevent scrolling on touch
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
}

// Touch event handlers
function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    startDrawing({ clientX: x, clientY: y });
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    draw({ clientX: x, clientY: y });
}

function handleTouchEnd(e) {
    e.preventDefault();
    stopDrawing();
}

// Drawing functions
function startDrawing(e) {
    isDrawing = true;
    currentStroke = [];
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    currentStroke.push({ x, y });
    
    // Play drawing sound
    playBabySound('coo');
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (isErasing) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 20;
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = 4;
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
    currentStroke.push({ x, y });
}

function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        drawingHistory.push([...currentStroke]);
        currentStroke = [];
        
        // Play completion sound
        playBabySound('giggle');
        
        // Check if drawing is good enough
        setTimeout(checkDrawingQuality, 500);
    }
}

// Set writing mode (letters, numbers, words)
function setWritingMode(mode) {
    currentWritingMode = mode;
    currentWritingIndex = 0;
    
    // Update active button
    document.querySelectorAll('.mode-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    
    // Load new content
    loadWritingContent();
    updateWritingProgress();
    
    // Play mode change sound
    playBabySound('squeal');
    
    // Speak the mode
    speakText(`Let's practice writing ${mode}!`);
}

// Load writing content based on current mode
function loadWritingContent() {
    let content, title, examples;
    
    switch (currentWritingMode) {
        case 'letters':
            content = letters;
            title = `Write the Letter: ${letters[currentWritingIndex]}`;
            examples = letters.slice(0, 9);
            break;
        case 'numbers':
            content = numbers;
            title = `Write the Number: ${numbers[currentWritingIndex]}`;
            examples = numbers;
            break;
        case 'words':
            content = words;
            title = `Write the Word: ${words[currentWritingIndex]}`;
            examples = words.slice(0, 9);
            break;
    }
    
    // Update title and guide
    document.getElementById('practice-title').textContent = title;
    document.getElementById('letter-guide').textContent = content[currentWritingIndex];
    
    // Update examples grid
    updateExamplesGrid(examples);
    
    // Clear canvas
    clearCanvas();
}

// Update examples grid
function updateExamplesGrid(examples) {
    const grid = document.getElementById('example-grid');
    grid.innerHTML = '';
    
    examples.forEach((item, index) => {
        const exampleItem = document.createElement('div');
        exampleItem.className = 'example-item';
        exampleItem.textContent = item;
        exampleItem.onclick = () => selectExample(item, index);
        
        if (index === currentWritingIndex) {
            exampleItem.classList.add('active');
        }
        
        grid.appendChild(exampleItem);
    });
}

// Select example item
function selectExample(item, index) {
    currentWritingIndex = index;
    loadWritingContent();
    updateWritingProgress();
    
    // Update active example
    document.querySelectorAll('.example-item').forEach(el => {
        el.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Play selection sound
    playBabySound('laugh');
}

// Navigation functions
function nextWritingItem() {
    const maxIndex = getCurrentContent().length - 1;
    if (currentWritingIndex < maxIndex) {
        currentWritingIndex++;
        loadWritingContent();
        updateWritingProgress();
        updateNavigationButtons();
        
        // Play next sound
        playBabySound('coo');
    }
}

function previousWritingItem() {
    if (currentWritingIndex > 0) {
        currentWritingIndex--;
        loadWritingContent();
        updateWritingProgress();
        updateNavigationButtons();
        
        // Play previous sound
        playBabySound('giggle');
    }
}

// Update navigation buttons
function updateNavigationButtons() {
    const maxIndex = getCurrentContent().length - 1;
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    
    prevButton.disabled = currentWritingIndex === 0;
    nextButton.disabled = currentWritingIndex === maxIndex;
}

// Get current content array
function getCurrentContent() {
    switch (currentWritingMode) {
        case 'letters': return letters;
        case 'numbers': return numbers;
        case 'words': return words;
        default: return letters;
    }
}

// Update writing progress
function updateWritingProgress() {
    const content = getCurrentContent();
    const progress = document.getElementById('practice-progress');
    progress.textContent = `${currentWritingIndex + 1}/${content.length}`;
}

// Canvas tools
function clearCanvas() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawingHistory = [];
    
    // Play clear sound
    playBabySound('squeal');
}

function undoStroke() {
    if (drawingHistory.length > 0) {
        drawingHistory.pop();
        redrawCanvas();
        
        // Play undo sound
        playBabySound('giggle');
    }
}

function toggleEraser() {
    isErasing = !isErasing;
    const eraserButton = document.querySelector('.tool-button:last-child');
    
    if (isErasing) {
        eraserButton.classList.add('active');
        canvas.classList.add('erasing');
    } else {
        eraserButton.classList.remove('active');
        canvas.classList.remove('erasing');
    }
    
    // Play tool sound
    playBabySound('coo');
}

// Redraw canvas from history
function redrawCanvas() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawingHistory.forEach(stroke => {
        if (stroke.length > 0) {
            ctx.beginPath();
            ctx.moveTo(stroke[0].x, stroke[0].y);
            
            stroke.forEach(point => {
                ctx.lineTo(point.x, point.y);
            });
            
            ctx.stroke();
        }
    });
}

// Check drawing quality (simple implementation)
function checkDrawingQuality() {
    if (drawingHistory.length > 0) {
        // Simple quality check - if there are strokes, consider it good
        const totalStrokes = drawingHistory.reduce((total, stroke) => total + stroke.length, 0);
        
        if (totalStrokes > 10) {
            // Good drawing
            showWritingSuccess();
            addScore(10);
            
            // Unlock achievements
            checkWritingAchievements();
        }
    }
}

// Show writing success
function showWritingSuccess() {
    // Create success animation
    const successDiv = document.createElement('div');
    successDiv.className = 'writing-success';
    successDiv.innerHTML = `
        <div class="success-content">
            <span class="success-icon">🌟</span>
            <span class="success-text">Great job, Eric!</span>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Remove after animation
    setTimeout(() => {
        document.body.removeChild(successDiv);
    }, 2000);
    
    // Play success sound
    playBabySound('laugh');
    speakText('Excellent writing, Eric!');
}

// Check writing achievements
function checkWritingAchievements() {
    const content = getCurrentContent();
    const progress = currentWritingIndex + 1;
    
    // First letter achievement
    if (progress === 1) {
        unlockAchievement('first-letter');
    }
    
    // Alphabet master achievement
    if (currentWritingMode === 'letters' && progress === letters.length) {
        unlockAchievement('alphabet-master');
    }
    
    // Number writer achievement
    if (currentWritingMode === 'numbers' && progress === numbers.length) {
        unlockAchievement('number-writer');
    }
}

// Unlock writing achievement
function unlockAchievement(achievementId) {
    const achievement = document.getElementById(achievementId);
    if (achievement && !achievement.classList.contains('unlocked')) {
        achievement.classList.add('unlocked');
        achievement.querySelector('.achievement-icon').textContent = '✅';
        
        // Show achievement notification
        showAchievementNotification(achievement.querySelector('.achievement-text').textContent);
        
        // Play achievement sound
        playBabySound('laugh');
        triggerConfetti();
    }
}

// Practice more writing
function practiceWriting() {
    // Randomize the current item for more practice
    const content = getCurrentContent();
    const randomIndex = Math.floor(Math.random() * content.length);
    currentWritingIndex = randomIndex;
    
    loadWritingContent();
    updateWritingProgress();
    updateNavigationButtons();
    
    // Play practice sound
    playBabySound('squeal');
    speakText('Let\'s practice more writing!');
}

// Add CSS for writing success animation
const writingSuccessCSS = `
.writing-success {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    animation: writingSuccessIn 0.5s ease-out;
}

.success-content {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    padding: 2rem 3rem;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.success-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 1rem;
    animation: bounce 1s infinite;
}

.success-text {
    font-size: 1.5rem;
    font-weight: bold;
}

@keyframes writingSuccessIn {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
    }
    100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}
`;

// Add CSS to document
const styleSheet = document.createElement('style');
styleSheet.textContent = writingSuccessCSS;
document.head.appendChild(styleSheet);
