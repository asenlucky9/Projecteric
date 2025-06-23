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
let totalColorsInGame = 0;

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
    words: 0,
    people: 0
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
    },
    people: {
        title: "Eric's People Friends",
        description: "Learn about men, women, boys, and girls!",
        people: ['👨', '👩', '👦', '👧']
    }
};

// Writing Section Variables - Enhanced for Kids
let currentLetter = 0;
let currentMode = 'letters';
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let drawingHistory = [];
let currentStep = 0;

// Writing content arrays - Enhanced for Eric
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const shapes = ['●', '■', '▲', '◆', '★', '♥', '♦', '♣', '♠', '☺'];

// Canvas context
let canvas, ctx;

// People identification game data
const peopleData = [
    {
        type: 'man',
        emoji: '👨',
        word: 'Man',
        description: 'This is a man. He is an adult male.',
        examples: ['Daddy', 'Uncle', 'Grandpa', 'Teacher']
    },
    {
        type: 'woman',
        emoji: '👩',
        word: 'Woman',
        description: 'This is a woman. She is an adult female.',
        examples: ['Mummy', 'Auntie', 'Grandma', 'Teacher']
    },
    {
        type: 'boy',
        emoji: '👦',
        word: 'Boy',
        description: 'This is a boy. He is a young male child.',
        examples: ['Eric', 'Brother', 'Friend', 'Student']
    },
    {
        type: 'girl',
        emoji: '👧',
        word: 'Girl',
        description: 'This is a girl. She is a young female child.',
        examples: ['Sister', 'Friend', 'Student', 'Cousin']
    }
];

let currentPeopleIndex = 0;
let peopleScore = 0;

// Eric's birthday information
const ericBirthday = {
    day: 28,
    month: 7, // July
    year: 2021,
    name: "Eric Uyiosa"
};

// Live birthday reminder system
let birthdayReminderInterval;

function startBirthdayReminder() {
    // Clear any existing interval
    if (birthdayReminderInterval) {
        clearInterval(birthdayReminderInterval);
    }
    
    // Update birthday reminder every minute
    birthdayReminderInterval = setInterval(() => {
        updateBirthdayReminder();
    }, 60000); // Update every minute
    
    // Initial update
    updateBirthdayReminder();
}

function updateBirthdayReminder() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    const currentYear = today.getFullYear();
    
    // Calculate next birthday
    let nextBirthday = new Date(currentYear, ericBirthday.month - 1, ericBirthday.day);
    
    // If birthday has passed this year, calculate for next year
    if (today > nextBirthday) {
        nextBirthday = new Date(currentYear + 1, ericBirthday.month - 1, ericBirthday.day);
    }
    
    const timeUntilBirthday = nextBirthday - today;
    const daysUntilBirthday = Math.ceil(timeUntilBirthday / (1000 * 60 * 60 * 24));
    const hoursUntilBirthday = Math.ceil((timeUntilBirthday % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    // Update birthday info display
    const birthdayInfo = document.getElementById('birthday-info');
    if (birthdayInfo) {
        const birthdayText = birthdayInfo.querySelector('.birthday-text');
        
        if (currentMonth === ericBirthday.month && currentDay === ericBirthday.day) {
            // It's Eric's birthday!
            birthdayText.textContent = "🎂 Happy Birthday, Eric! You are 4 years old today! 🎂";
            birthdayInfo.className = 'birthday-info birthday-today';
            
            // Show live birthday countdown
            const now = new Date();
            const birthdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const birthdayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            const timeInBirthday = now - birthdayStart;
            const totalBirthdayTime = birthdayEnd - birthdayStart;
            const birthdayProgress = Math.floor((timeInBirthday / totalBirthdayTime) * 100);
            
            birthdayText.innerHTML = `🎂 Happy Birthday, Eric! You are 4 years old today! 🎂<br><small>Birthday Progress: ${birthdayProgress}% complete</small>`;
            
        } else if (daysUntilBirthday <= 7 && daysUntilBirthday > 0) {
            // Birthday week countdown
            birthdayText.innerHTML = `🎂 Eric's birthday is in ${daysUntilBirthday} days and ${hoursUntilBirthday} hours! 🎂<br><small>${Math.floor((7 - daysUntilBirthday) / 7 * 100)}% to birthday week!</small>`;
            birthdayInfo.className = 'birthday-info birthday-week';
            
        } else if (currentMonth === ericBirthday.month) {
            // Birthday month
            birthdayText.innerHTML = `🎂 It's Eric's birthday month! July is special! 🎂<br><small>${daysUntilBirthday} days until birthday!</small>`;
            birthdayInfo.className = 'birthday-info birthday-month';
            
        } else {
            // Regular countdown
            birthdayText.innerHTML = `🎂 Born: July 28, 2021 🎂<br><small>${daysUntilBirthday} days until next birthday!</small>`;
            birthdayInfo.className = 'birthday-info';
        }
    }
    
    // Show special notifications for important milestones
    if (daysUntilBirthday === 1 && hoursUntilBirthday <= 12) {
        showNotification(`🎂 Eric's birthday is tomorrow! Get ready to celebrate! 🎉`);
        speakText("Eric, your birthday is tomorrow! Get ready for a wonderful celebration!");
    } else if (daysUntilBirthday === 7) {
        showNotification(`🎂 Eric's birthday week starts today! 🎉`);
        speakText("Eric, your birthday week starts today! It's going to be special!");
    }
}

// Enhanced birthday check with live reminder
function checkBirthday() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    
    // Start live birthday reminder
    startBirthdayReminder();
    
    // Check if it's Eric's birthday month (July)
    if (currentMonth === ericBirthday.month) {
        if (currentDay === ericBirthday.day) {
            // It's Eric's birthday!
            showBirthdayCelebration();
            return 'birthday';
        } else if (currentDay >= ericBirthday.day - 7 && currentDay <= ericBirthday.day + 7) {
            // It's birthday week
            showBirthdayCountdown();
            return 'birthday-week';
        } else {
            // It's birthday month
            showBirthdayMonth();
            return 'birthday-month';
        }
    }
    return 'normal';
}

// Show birthday celebration
function showBirthdayCelebration() {
    // Create birthday overlay
    const birthdayOverlay = document.createElement('div');
    birthdayOverlay.className = 'birthday-overlay';
    birthdayOverlay.innerHTML = `
        <div class="birthday-content">
            <div class="birthday-cake">🎂</div>
            <h1 class="birthday-title">Happy Birthday, Eric! 🎉</h1>
            <p class="birthday-message">You are 4 years old today! 🎈</p>
            <div class="birthday-balloons">
                🎈🎈🎈🎈🎈🎈🎈🎈
            </div>
            <div class="birthday-gifts">
                🎁🎁🎁🎁
            </div>
            <button class="birthday-button" onclick="startBirthdayParty()">
                🎊 Start Birthday Party! 🎊
            </button>
        </div>
    `;
    
    document.body.appendChild(birthdayOverlay);
    
    // Play birthday music and sounds
    playSound('complete');
    playSound('baby_laugh');
    speakText("Happy Birthday, Eric! You are 4 years old today! Let's celebrate!");
    
    // Trigger lots of confetti
    for (let i = 0; i < 10; i++) {
        setTimeout(() => triggerConfetti(), i * 200);
    }
}

// Show birthday countdown
function showBirthdayCountdown() {
    const today = new Date();
    const birthday = new Date(today.getFullYear(), ericBirthday.month - 1, ericBirthday.day);
    const daysUntilBirthday = Math.ceil((birthday - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilBirthday > 0) {
        showNotification(`🎂 Eric's birthday is in ${daysUntilBirthday} days! 🎉`);
        speakText(`Eric, your birthday is coming soon! In ${daysUntilBirthday} days!`);
    } else {
        showNotification(`🎂 Eric's birthday was ${Math.abs(daysUntilBirthday)} days ago! 🎉`);
        speakText(`Eric, we celebrated your birthday recently!`);
    }
}

// Show birthday month celebration
function showBirthdayMonth() {
    showNotification(`🎂 It's Eric's birthday month! July is special! 🎉`);
    speakText("Eric, it's your birthday month! July is special for you!");
}

// Start birthday party
function startBirthdayParty() {
    // Remove birthday overlay
    const overlay = document.querySelector('.birthday-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    // Start special birthday activities
    triggerConfetti();
    playSound('complete');
    playSound('baby_laugh');
    
    // Show birthday message
    showNotification("🎊 Let's have a birthday party, Eric! 🎊");
    speakText("Let's have a wonderful birthday party! You can play all your favorite games!");
    
    // Add extra points for birthday
    addScore(100);
    
    // Unlock birthday achievement
    unlockAchievement('birthday_2024', 'Birthday Boy! 🎂', 'Eric celebrated his 4th birthday!');
    
    // Show special birthday tip
    setTimeout(() => {
        showNotification("🎂 Happy 4th Birthday, Eric! You're growing so big and smart! 🎂");
        speakText("Happy Birthday, Eric! You are four years old now! You're growing so big and smart!");
    }, 2000);
}

// Initialize the application
document.addEventListener("DOMContentLoaded", function() {
    setupEventListeners();
    updateScore();
    setupPlayArea();
    setupAudio();
    setupSpeech();
    showWelcomeMessage();
    
    // Check for Eric's birthday and start live reminder
    checkBirthday();
    startBirthdayReminder();
    
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
    
    if (document.getElementById('storybook-container')) {
        initializeStorybook();
    }
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
function speakText(text, rate = 0.8, pitch = 1.2, onWordBoundary) {
    if (speechSynthesis) {
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        if (speakingVoice) {
            utterance.voice = speakingVoice;
        }
        
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = 0.9;
        utterance.lang = 'en-US';
        
        utterance.onboundary = (event) => {
            if (event.name === 'word' && onWordBoundary) {
                const word = text.substring(event.charIndex, text.indexOf(' ', event.charIndex));
                onWordBoundary(word);
            }
        };

        utterance.onend = () => {
            // Reset text when speech is finished
            const textElement = document.getElementById(`story-text-${currentPage}`);
            if(textElement) textElement.innerHTML = stories.spaceAdventure.pages[currentPage].text;
        };
        
        utterance.onerror = (event) => console.log('Speech error:', event.error);
        
        try {
            speechSynthesis.speak(utterance);
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
    // Initialize mobile enhancements
    setupMobileEnhancements();
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            playSound('click');
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });

    // When the logo is clicked, show the main page and scroll to top
    document.querySelector('.nav-logo').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('hero'); // 'hero' will trigger the main view and scroll to top
    });

    // Also make the logo text clickable
    document.querySelector('.logo-text').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('hero');
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

// Setup play area for bubble creation (mobile-optimized)
function setupPlayArea() {
    setupMobilePlayArea();
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
    document.getElementById("game-title").textContent = games[gameType].title;
    document.getElementById("game-modal").style.display = "block";
    
    const gameArea = document.getElementById("game-area");
    
    // Check if it's Eric's birthday month and playing colors
    const isBirthdayMonth = checkBirthday() === 'birthday-month' || checkBirthday() === 'birthday-week' || checkBirthday() === 'birthday';
    
    switch(gameType) {
        case 'alphabet':
            createAlphabetGame(gameArea);
            break;
        case 'numbers':
            createNumberGame(gameArea);
            break;
        case 'colors':
            if (isBirthdayMonth) {
                createBirthdayColorGame(gameArea);
            } else {
                createColorGame(gameArea);
            }
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
        case 'people':
            showPeopleGame();
            return; // Don't continue with normal game setup
        default:
            gameArea.innerHTML = '<p>Game not found!</p>';
    }
    
    // Reset click counters
    colorClickCount = 0;
    shapeClickCount = 0;
    animalClickCount = 0;
    wordClickCount = 0;
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
    // Use all colors and shuffle them
    const allColors = [...games.colors.colors].sort(() => Math.random() - 0.5);
    
    gameArea.innerHTML = `
        <div class="game-instructions">
            <h4 class="game-title-pro">Eric, can you find the colors? 🎨</h4>
            <p class="game-subtitle-pro">Click on a color to hear its name!</p>
        </div>
        <div class="game-grid color-grid-pro">
            ${allColors.map(colorObj => `
                <div class="game-item-pro color-item-pro" 
                     onclick="learnColor(this, '${colorObj.name}', '${colorObj.color}')"
                     title="Click to learn this color"
                     data-color-name="${colorObj.name}">
                     <div class="color-swatch-pro" style="background-color: ${colorObj.color};"></div>
                     <span class="color-name-pro">${colorObj.name}</span>
                </div>
            `).join('')}
        </div>
    `;
    speakText("Eric, let's learn the colors! Click on a color to hear its name!");
    
    // Reset the click counter
    colorClickCount = 0;
    // Set the total number of colors for completion check
    totalColorsInGame = allColors.length;
}

// Learn color function
function learnColor(element, colorName, colorValue) {
    addScore(10);
    playSound('color');
    playSound('baby_coo');
    speakText(`This is ${colorName}`);
    showNotification(`Great job, Eric! This is ${colorName}! 🎨`);

    // Add an animation to the clicked card
    element.classList.add('clicked');
    setTimeout(() => {
        element.classList.remove('clicked');
    }, 1000);
    
    colorClickCount++;
    if (colorClickCount >= totalColorsInGame) {
        setTimeout(() => {
            playSound('baby_laugh');
            speakText("Wow, Eric! You found all the colors! You are so smart!");
            showNotification("Wow! You learned all the colors! 🎉");
            colorClickCount = 0;
            triggerConfetti();
        }, 1000);
    }
}

// Create special birthday color game
function createBirthdayColorGame(gameArea) {
    // This will now also use the professional style
    const birthdayColors = [
        { name: 'Sparkle Pink', color: '#ff6b9d' },
        { name: 'Royal Purple', color: '#667eea' },
        { name: 'Gleaming Gold', color: '#ffd700' },
        { name: 'Sky Blue', color: '#4ecdc4' },
        { name: 'Cherry Red', color: '#ff4757' },
        { name: 'Sunny Yellow', color: '#ffa502' }
    ];
    
    gameArea.innerHTML = `
        <div class="game-instructions">
            <h4 class="game-title-pro">🎂 Eric's Birthday Colors! 🎨</h4>
            <p class="game-subtitle-pro">Click on the special birthday colors!</p>
        </div>
        <div class="game-grid color-grid-pro birthday-colors">
            ${birthdayColors.map(colorObj => `
                <div class="game-item-pro color-item-pro birthday-color" 
                     onclick="learnBirthdayColor(this, '${colorObj.name}', '${colorObj.color}')"
                     title="Click to learn this birthday color"
                     data-color-name="${colorObj.name}">
                     <div class="color-swatch-pro" style="background-color: ${colorObj.color};"></div>
                     <span class="color-name-pro">${colorObj.name}</span>
                    <div class="birthday-sparkle">✨</div>
                </div>
            `).join('')}
        </div>
    `;
    speakText("Happy Birthday, Eric! Let's learn these special birthday colors!");
    
    colorClickCount = 0;
    totalColorsInGame = birthdayColors.length;
}

// Learn birthday color function
function learnBirthdayColor(element, colorName, colorValue) {
    addScore(15); // Extra points for birthday
    playSound('color');
    playSound('baby_laugh');
    speakText(`${colorName}, what a beautiful birthday color!`);
    showNotification(`🎂 ${colorName}! Happy Birthday, Eric! 🎨`);
    
    // Add an animation to the clicked card
    element.classList.add('clicked');
    setTimeout(() => {
        element.classList.remove('clicked');
    }, 1000);
    
    colorClickCount++;
    if (colorClickCount >= totalColorsInGame) {
        setTimeout(() => {
            playSound('baby_laugh');
            speakText("Happy Birthday, Eric! You learned all the special colors!");
            showNotification("🎂 Happy Birthday! You're a color master! 🎨");
            colorClickCount = 0;
            triggerConfetti();
        }, 1000);
    }
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

// Create people identification game
function showPeopleGame() {
    currentPeopleIndex = 0;
    peopleScore = 0;
    
    document.getElementById("game-title").textContent = "People Friends";
    document.getElementById("game-modal").style.display = "block";
    
    const gameArea = document.getElementById("game-area");
    gameArea.innerHTML = `
        <div class="game-instructions">
            <h4>Eric, learn about people! Click on the people to learn! 👥</h4>
        </div>
        <div class="people-game-container">
            <div class="people-display">
                <div class="people-emoji" id="people-emoji">👨</div>
                <div class="people-word" id="people-word">Man</div>
                <div class="people-description" id="people-description">This is a man. He is an adult male.</div>
            </div>
            <div class="people-examples">
                <h5>Examples:</h5>
                <div class="examples-list" id="examples-list">
                    <span class="example-item">Daddy</span>
                    <span class="example-item">Uncle</span>
                    <span class="example-item">Grandpa</span>
                    <span class="example-item">Teacher</span>
                </div>
            </div>
            <div class="people-navigation">
                <button class="nav-btn prev-btn" onclick="previousPeople()" disabled>
                    <span>⬅️ Previous</span>
                </button>
                <button class="nav-btn next-btn" onclick="nextPeople()">
                    <span>Next ➡️</span>
                </button>
            </div>
            <div class="people-progress">
                <span id="people-progress">1 of 4</span>
            </div>
        </div>
    `;
    
    updatePeopleDisplay();
    speakText("Let's learn about people! This is a man.");
}

// Update people display
function updatePeopleDisplay() {
    const currentPerson = peopleData[currentPeopleIndex];
    
    document.getElementById('people-emoji').textContent = currentPerson.emoji;
    document.getElementById('people-word').textContent = currentPerson.word;
    document.getElementById('people-description').textContent = currentPerson.description;
    
    const examplesList = document.getElementById('examples-list');
    examplesList.innerHTML = currentPerson.examples.map(example => 
        `<span class="example-item">${example}</span>`
    ).join('');
    
    document.getElementById('people-progress').textContent = `${currentPeopleIndex + 1} of ${peopleData.length}`;
    
    // Update navigation buttons
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    prevBtn.disabled = currentPeopleIndex === 0;
    nextBtn.disabled = currentPeopleIndex === peopleData.length - 1;
    
    // Special message for Eric
    if (currentPerson.type === 'boy') {
        document.getElementById('people-description').textContent = 
            "This is a boy. He is a young male child. Just like you, Eric!";
    }
    
    // Special message for Mummy
    if (currentPerson.type === 'woman') {
        document.getElementById('people-description').textContent = 
            "This is a woman. She is an adult female. Like your Mummy T & E!";
    }
}

// Navigate to previous person
function previousPeople() {
    if (currentPeopleIndex > 0) {
        currentPeopleIndex--;
        updatePeopleDisplay();
        addScore(5);
        playSound('baby_coo');
        speakText(peopleData[currentPeopleIndex].description);
    }
}

// Navigate to next person
function nextPeople() {
    if (currentPeopleIndex < peopleData.length - 1) {
        currentPeopleIndex++;
        updatePeopleDisplay();
        addScore(5);
        playSound('baby_giggle');
        speakText(peopleData[currentPeopleIndex].description);
    } else {
        // Game completed
        addScore(20);
        playSound('complete');
        playSound('baby_laugh');
        speakText("Great job learning about people, Eric! You know about men, women, boys, and girls!");
        showNotification("Excellent! You've learned about all the people!");
        triggerConfetti();
        
        // Update game completion
        updateGameCompletion('people');
        
        // Close game after celebration
        setTimeout(() => {
            closeGame();
        }, 3000);
    }
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
    
    const notificationStyle = document.createElement("style");
    notificationStyle.textContent = `
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
    document.head.appendChild(notificationStyle);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = "slideOut 0.5s ease forwards";
        notificationStyle.textContent += `
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
const animationStyle = document.createElement('style');
animationStyle.textContent = `
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
document.head.appendChild(animationStyle);

// Initialize writing section
function initWritingSection() {
    try {
        const canvas = document.getElementById('writing-canvas');
        if (!canvas) {
            console.error('Writing canvas not found');
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Could not get canvas context');
            return;
        }

        // Enhanced canvas setup for responsive design
        setupResponsiveCanvas(canvas, ctx);

        // Enhanced drawing settings for kids - thicker lines, fun colors
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = getLineWidth(); // Responsive line width
        ctx.strokeStyle = '#ff6b9d'; // Fun pink color

        // Initialize overlay with better positioning
        updateCanvasOverlay();

        // Enhanced event listeners for better touch support
        setupCanvasEventListeners(canvas);

        // Initialize all writing controls
        initWritingControls();
        
        // Update progress and achievements
        updateWritingProgress();
        updateWritingAchievements();
        
        console.log('Writing section initialized successfully for Eric!');
        
    } catch (error) {
        console.error('Error initializing writing section:', error);
    }
}

function setupResponsiveCanvas(canvas, ctx) {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size for high DPI displays
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    // Store canvas reference
    window.writingCanvas = canvas;
    window.writingCtx = ctx;
}

function getLineWidth() {
    // Responsive line width based on screen size
    const screenWidth = window.innerWidth;
    if (screenWidth < 480) return 6; // Phone
    if (screenWidth < 768) return 8; // Tablet
    if (screenWidth < 1200) return 10; // Small desktop
    return 12; // Large desktop
}

function setupCanvasEventListeners(canvas) {
    // Mouse events for desktop
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Enhanced touch events for mobile devices
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Click to start drawing (hide overlay)
    canvas.addEventListener('click', () => {
        if (canvas.querySelector('.canvas-overlay')) {
            hideOverlay();
        }
    });

    // Prevent context menu on right click
    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

function initWritingControls() {
    // Initialize mode buttons
    initModeButtons();
    
    // Initialize tool buttons
    initToolButtons();
    
    // Initialize example buttons
    initExampleButtons();
    
    // Initialize navigation
    initWritingNavigation();
    
    // Set initial mode
    setWritingMode('letters');
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    startDrawing({ clientX: x, clientY: y });
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    draw({ clientX: x, clientY: y });
}

function handleTouchEnd(e) {
    e.preventDefault();
    stopDrawing();
}

function startDrawing(e) {
    isDrawing = true;
    const canvas = document.getElementById('writing-canvas');
    const rect = canvas.getBoundingClientRect();
    
    // Get coordinates based on device type
    const coords = getEventCoordinates(e, rect);
    lastX = coords.x;
    lastY = coords.y;
    
    // Hide overlay when user starts drawing
    hideOverlay();
    
    // Play drawing sound
    playSound('draw');
    
    // Add visual feedback
    addDrawingFeedback(canvas, coords.x, coords.y);
}

function draw(e) {
    if (!isDrawing) return;
    
    const canvas = document.getElementById('writing-canvas');
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Get coordinates based on device type
    const coords = getEventCoordinates(e, rect);
    const currentX = coords.x;
    const currentY = coords.y;
    
    // Enhanced drawing with smooth curves
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    
    // Add some thickness variation for more natural drawing
    const distance = Math.sqrt(Math.pow(currentX - lastX, 2) + Math.pow(currentY - lastY, 2));
    if (distance > 5) {
        ctx.lineWidth = Math.max(getLineWidth() - 2, 3);
    } else {
        ctx.lineWidth = getLineWidth();
    }
    
    lastX = currentX;
    lastY = currentY;
    
    // Store drawing history for undo
    drawingHistory.push({
        x: currentX,
        y: currentY,
        timestamp: Date.now(),
        lineWidth: ctx.lineWidth
    });
    
    // Add drawing particles for fun
    if (Math.random() > 0.8) {
        addDrawingParticle(canvas, currentX, currentY);
    }
}

function stopDrawing() {
    if (!isDrawing) return;
    
    isDrawing = false;
    
    // Play completion sound
    playSound('complete');
    
    // Check if drawing is complete enough
    setTimeout(() => {
        checkDrawingProgress();
    }, 500);
    
    // Remove drawing feedback
    removeDrawingFeedback();
}

function hideOverlay() {
    const overlay = document.querySelector('.canvas-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }
}

function showOverlay() {
    const overlay = document.querySelector('.canvas-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
    }
}

function updateCanvasOverlay() {
    const overlay = document.querySelector('.canvas-overlay');
    if (!overlay) return;
    
    const guide = overlay.querySelector('.trace-guide');
    if (!guide) return;
    
    let currentItem = '';
    let instruction = '';
    
    switch (currentMode) {
        case 'letters':
            currentItem = letters[currentLetter];
            instruction = `Trace the letter ${currentItem}`;
            break;
        case 'numbers':
            currentItem = numbers[currentLetter];
            instruction = `Trace the number ${currentItem}`;
            break;
        case 'shapes':
            currentItem = shapes[currentLetter];
            instruction = `Trace the shape ${currentItem}`;
            break;
    }
    
    const letterGuide = guide.querySelector('.letter-guide');
    const instructionText = guide.querySelector('.instruction-text');
    
    if (letterGuide) letterGuide.textContent = currentItem;
    if (instructionText) instructionText.textContent = instruction;
}

function initModeButtons() {
    const modeButtons = document.querySelectorAll('.mode-button');
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mode = button.dataset.mode;
            if (mode) {
                setWritingMode(mode);
            }
        });
    });
}

function setWritingMode(mode) {
    currentMode = mode;
    currentLetter = 0;
    currentStep = 0;
    
    // Update active button
    document.querySelectorAll('.mode-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
    
    // Clear canvas
    clearCanvas();
    
    // Update overlay
    updateCanvasOverlay();
    
    // Update progress
    updateWritingProgress();
    
    // Play mode change sound
    playSound('mode');
}

function initToolButtons() {
    const clearBtn = document.querySelector('.tool-button[data-action="clear"]');
    const undoBtn = document.querySelector('.tool-button[data-action="undo"]');
    const nextBtn = document.querySelector('.tool-button[data-action="next"]');
    const prevBtn = document.querySelector('.tool-button[data-action="prev"]');
    
    if (clearBtn) clearBtn.addEventListener('click', clearCanvas);
    if (undoBtn) undoBtn.addEventListener('click', undoLastStroke);
    if (nextBtn) nextBtn.addEventListener('click', nextItem);
    if (prevBtn) prevBtn.addEventListener('click', prevItem);
}

function clearCanvas() {
    const canvas = document.getElementById('writing-canvas');
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.clearRect(0, 0, rect.width, rect.height);
    drawingHistory = [];
    
    // Show overlay again
    showOverlay();
    
    // Play clear sound
    playSound('clear');
}

function undoLastStroke() {
    if (drawingHistory.length === 0) return;
    
    const canvas = document.getElementById('writing-canvas');
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Remove last stroke
    drawingHistory.pop();
    
    // Redraw remaining strokes
    redrawHistory();
    
    // Play undo sound
    playSound('undo');
}

function redrawHistory() {
    if (drawingHistory.length === 0) return;
    
    const canvas = document.getElementById('writing-canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.moveTo(drawingHistory[0].x, drawingHistory[0].y);
    
    for (let i = 1; i < drawingHistory.length; i++) {
        ctx.lineTo(drawingHistory[i].x, drawingHistory[i].y);
    }
    
    ctx.stroke();
}

function nextItem() {
    const maxItems = getMaxItems();
    if (currentLetter < maxItems - 1) {
        currentLetter++;
        currentStep = 0;
        clearCanvas();
        updateCanvasOverlay();
        updateWritingProgress();
        playSound('next');
    } else {
        // Completed all items
        showCompletionMessage();
    }
}

function prevItem() {
    if (currentLetter > 0) {
        currentLetter--;
        currentStep = 0;
        clearCanvas();
        updateCanvasOverlay();
        updateWritingProgress();
        playSound('prev');
    }
}

function getMaxItems() {
    switch (currentMode) {
        case 'letters': return letters.length;
        case 'numbers': return numbers.length;
        case 'shapes': return shapes.length;
        default: return letters.length;
    }
}

function getCurrentItem() {
    switch (currentMode) {
        case 'letters': return letters[currentLetter];
        case 'numbers': return numbers[currentLetter];
        case 'shapes': return shapes[currentLetter];
        default: return letters[currentLetter];
    }
}

function initExampleButtons() {
    const exampleItems = document.querySelectorAll('.example-item');
    exampleItems.forEach(item => {
        item.addEventListener('click', () => {
            const letter = item.textContent.trim();
            selectExample(letter);
        });
    });
}

function selectExample(letter) {
    // Remove previous selection
    document.querySelectorAll('.example-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Find and select the clicked item
    document.querySelectorAll('.example-item').forEach(item => {
        if (item.textContent.trim() === letter) {
            item.classList.add('selected');
        }
    });
    
    // Update current letter based on mode
    const items = currentMode === 'letters' ? letters : 
                  currentMode === 'numbers' ? numbers : shapes;
    
    const index = items.indexOf(letter);
    if (index !== -1) {
        currentLetter = index;
        currentStep = 0;
        clearCanvas();
        updateCanvasOverlay();
        updateWritingProgress();
        playSound('select');
    }
}

function initWritingNavigation() {
    const prevBtn = document.querySelector('.nav-button[data-action="prev"]');
    const nextBtn = document.querySelector('.nav-button[data-action="next"]');
    const practiceBtn = document.querySelector('.nav-button[data-action="practice"]');
    
    if (prevBtn) prevBtn.addEventListener('click', prevItem);
    if (nextBtn) nextBtn.addEventListener('click', nextItem);
    if (practiceBtn) practiceBtn.addEventListener('click', startPracticeMode);
    
    // Update button states
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const prevBtn = document.querySelector('.nav-button[data-action="prev"]');
    const nextBtn = document.querySelector('.nav-button[data-action="next"]');
    
    if (prevBtn) {
        prevBtn.disabled = currentLetter === 0;
    }
    
    if (nextBtn) {
        const maxItems = getMaxItems();
        nextBtn.disabled = currentLetter >= maxItems - 1;
    }
}

function updateWritingProgress() {
    const progressElement = document.querySelector('.practice-progress');
    if (!progressElement) return;
    
    const maxItems = getMaxItems();
    const progress = Math.round(((currentLetter + 1) / maxItems) * 100);
    const currentItem = getCurrentItem();
    
    progressElement.textContent = `${currentItem} - ${progress}% Complete`;
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update achievements
    updateWritingAchievements();
}

function checkDrawingProgress() {
    // Simple progress check based on drawing history length
    if (drawingHistory.length > 10) {
        currentStep++;
        if (currentStep >= 3) { // 3 steps to complete
            showProgressMessage();
        }
    }
}

function showProgressMessage() {
    const messages = [
        "Great job! Keep going! 🎉",
        "You're doing amazing! ⭐",
        "Almost there! 🌟",
        "Perfect! You've got this! 🏆"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showNotification(randomMessage, 'success');
}

function showCompletionMessage() {
    const message = `Congratulations! You've completed all ${currentMode}! 🎉🎊`;
    showNotification(message, 'success');
    
    // Unlock achievement
    unlockAchievement('writing-master');
}

function updateWritingAchievements() {
    const achievements = [
        { id: 'first-letter', condition: currentLetter >= 0, text: 'First Letter Written', icon: '✏️' },
        { id: 'halfway', condition: currentLetter >= Math.floor(getMaxItems() / 2), text: 'Halfway There!', icon: '🎯' },
        { id: 'almost-done', condition: currentLetter >= getMaxItems() - 3, text: 'Almost Done!', icon: '🏁' },
        { id: 'writing-master', condition: currentLetter >= getMaxItems() - 1, text: 'Writing Master!', icon: '👑' }
    ];
    
    achievements.forEach(achievement => {
        const element = document.querySelector(`[data-achievement="${achievement.id}"]`);
        if (element && achievement.condition) {
            element.classList.add('unlocked');
            const icon = element.querySelector('.achievement-icon');
            const text = element.querySelector('.achievement-text');
            if (icon) icon.textContent = achievement.icon;
            if (text) text.textContent = achievement.text;
        }
    });
}

function startPracticeMode() {
    // Randomize the order for practice
    const items = currentMode === 'letters' ? [...letters] : 
                  currentMode === 'numbers' ? [...numbers] : [...shapes];
    
    // Shuffle array
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
    
    // Set to first shuffled item
    const firstItem = items[0];
    const originalItems = currentMode === 'letters' ? letters : 
                         currentMode === 'numbers' ? numbers : shapes;
    currentLetter = originalItems.indexOf(firstItem);
    
    clearCanvas();
    updateCanvasOverlay();
    updateWritingProgress();
    
    showNotification('Practice mode started! Try to write each item quickly! 🚀', 'info');
    playSound('practice');
}

// Enhanced sound effects for writing
function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    let frequency = 440;
    let duration = 0.1;
    
    switch (type) {
        case 'draw':
            frequency = 800;
            duration = 0.05;
            break;
        case 'complete':
            frequency = 1200;
            duration = 0.2;
            break;
        case 'clear':
            frequency = 300;
            duration = 0.15;
            break;
        case 'undo':
            frequency = 200;
            duration = 0.1;
            break;
        case 'next':
            frequency = 600;
            duration = 0.15;
            break;
        case 'prev':
            frequency = 400;
            duration = 0.15;
            break;
        case 'mode':
            frequency = 1000;
            duration = 0.2;
            break;
        case 'select':
            frequency = 700;
            duration = 0.1;
            break;
        case 'practice':
            frequency = 900;
            duration = 0.3;
            break;
    }
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: bold;
        font-size: 1.1rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize writing section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize writing section when writing tab is clicked
    const writingTab = document.querySelector('a[href="#writing"]');
    if (writingTab) {
        writingTab.addEventListener('click', () => {
            setTimeout(initWritingSection, 100);
        });
    }
    
    // Also initialize if we're already on the writing section
    if (window.location.hash === '#writing') {
        setTimeout(initWritingSection, 100);
    }
});

// Handle window resize for responsive canvas
window.addEventListener('resize', () => {
    const canvas = document.getElementById('writing-canvas');
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        
        // Redraw history if any
        if (drawingHistory.length > 0) {
            redrawHistory();
        }
    }
});

function getEventCoordinates(e, rect) {
    let x, y;
    
    if (e.touches && e.touches[0]) {
        // Touch event
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    } else {
        // Mouse event
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    }
    
    return { x, y };
}

function addDrawingFeedback(canvas, x, y) {
    // Add a small glow effect where drawing starts
    const feedback = document.createElement('div');
    feedback.className = 'drawing-feedback';
    feedback.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(255, 107, 157, 0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: drawingPulse 0.3s ease-out;
    `;
    
    canvas.parentElement.appendChild(feedback);
    
    setTimeout(() => {
        if (feedback.parentElement) {
            feedback.parentElement.removeChild(feedback);
        }
    }, 300);
}

function removeDrawingFeedback() {
    const feedbacks = document.querySelectorAll('.drawing-feedback');
    feedbacks.forEach(feedback => {
        if (feedback.parentElement) {
            feedback.parentElement.removeChild(feedback);
        }
    });
}

function addDrawingParticle(canvas, x, y) {
    const particle = document.createElement('div');
    particle.className = 'drawing-particle';
    particle.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: #ff6b9d;
        border-radius: 50%;
        pointer-events: none;
        z-index: 999;
        animation: particleFloat 1s ease-out forwards;
    `;
    
    canvas.parentElement.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentElement) {
            particle.parentElement.removeChild(particle);
        }
    }, 1000);
}

// Enhanced window resize handler for responsive writing section
window.addEventListener('resize', () => {
    const canvas = document.getElementById('writing-canvas');
    if (canvas && canvas.getContext) {
        // Re-setup canvas for new size
        setupResponsiveCanvas(canvas, canvas.getContext('2d'));
        
        // Update line width for new screen size
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = getLineWidth();
        
        // Redraw history if any
        if (drawingHistory.length > 0) {
            redrawHistory();
        }
        
        // Update overlay positioning
        updateCanvasOverlay();
    }
    
    // Update responsive elements
    updateResponsiveElements();
});

function updateResponsiveElements() {
    // Update button sizes for touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const buttons = document.querySelectorAll('.mode-button, .tool-button, .nav-button');
    
    buttons.forEach(button => {
        if (isTouchDevice) {
            button.style.minHeight = '48px';
            button.style.minWidth = '48px';
        } else {
            button.style.minHeight = '';
            button.style.minWidth = '';
        }
    });
    
    // Update example items for touch devices
    const exampleItems = document.querySelectorAll('.example-item');
    exampleItems.forEach(item => {
        if (isTouchDevice) {
            item.style.minHeight = '60px';
            item.style.minWidth = '60px';
        } else {
            item.style.minHeight = '';
            item.style.minWidth = '';
        }
    });
}

// Enhanced initialization for writing section
document.addEventListener('DOMContentLoaded', () => {
    // Initialize writing section when writing tab is clicked
    const writingTab = document.querySelector('a[href="#writing"]');
    if (writingTab) {
        writingTab.addEventListener('click', () => {
            setTimeout(() => {
                initWritingSection();
                updateResponsiveElements();
            }, 100);
        });
    }
    
    // Also initialize if we're already on the writing section
    if (window.location.hash === '#writing') {
        setTimeout(() => {
            initWritingSection();
            updateResponsiveElements();
        }, 100);
    }
    
    // Initialize responsive elements on page load
    updateResponsiveElements();
});

// Enhanced touch detection and optimization
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Optimize canvas for touch devices
function optimizeCanvasForTouch(canvas) {
    if (isTouchDevice()) {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        canvas.addEventListener('touchend', (event) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Prevent scrolling when drawing
        canvas.addEventListener('touchmove', (event) => {
            if (isDrawing) {
                event.preventDefault();
            }
        }, { passive: false });
    }
}

// Enhanced canvas setup with touch optimization
function setupResponsiveCanvas(canvas, ctx) {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size for high DPI displays
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    // Store canvas reference
    window.writingCanvas = canvas;
    window.writingCtx = ctx;
    
    // Optimize for touch devices
    optimizeCanvasForTouch(canvas);
    
    // Set initial drawing properties
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = getLineWidth();
    ctx.strokeStyle = '#ff6b9d';
}

// Enhanced line width calculation with device detection
function getLineWidth() {
    const screenWidth = window.innerWidth;
    const isTouch = isTouchDevice();
    
    if (isTouch) {
        // Thicker lines for touch devices
        if (screenWidth < 480) return 8; // Phone
        if (screenWidth < 768) return 10; // Tablet
        if (screenWidth < 1200) return 12; // Small desktop
        return 14; // Large desktop
    } else {
        // Standard lines for mouse devices
        if (screenWidth < 480) return 6; // Phone
        if (screenWidth < 768) return 8; // Tablet
        if (screenWidth < 1200) return 10; // Small desktop
        return 12; // Large desktop
    }
}

// Device Mode Management System
let currentDeviceMode = 'web'; // 'phone', 'tablet', 'web'
let deviceModeInitialized = false;

// Device mode detection and management
function detectDeviceMode() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const isTouch = isTouchDevice();
    const pixelRatio = window.devicePixelRatio || 1;
    
    // Enhanced device detection
    if (screenWidth < 480 || (screenWidth < 768 && screenHeight < 600)) {
        return 'phone';
    } else if (screenWidth < 1024 || (screenWidth < 1200 && isTouch)) {
        return 'tablet';
    } else {
        return 'web';
    }
}

function setDeviceMode(mode) {
    if (currentDeviceMode === mode) return;
    
    currentDeviceMode = mode;
    document.body.setAttribute('data-device-mode', mode);
    
    // Apply device-specific optimizations
    applyDeviceModeOptimizations(mode);
    
    // Update UI elements
    updateDeviceModeUI();
    
    // Reinitialize components for new mode
    reinitializeForDeviceMode(mode);
    
    console.log(`Device mode changed to: ${mode}`);
}

function applyDeviceModeOptimizations(mode) {
    const body = document.body;
    
    // Remove previous mode classes
    body.classList.remove('phone-mode', 'tablet-mode', 'web-mode');
    
    // Add current mode class
    body.classList.add(`${mode}-mode`);
    
    // Apply mode-specific settings
    switch (mode) {
        case 'phone':
            applyPhoneOptimizations();
            break;
        case 'tablet':
            applyTabletOptimizations();
            break;
        case 'web':
            applyWebOptimizations();
            break;
    }
}

function applyPhoneOptimizations() {
    // Phone-specific optimizations
    document.documentElement.style.setProperty('--touch-target-size', '48px');
    document.documentElement.style.setProperty('--font-size-base', '14px');
    document.documentElement.style.setProperty('--spacing-unit', '0.5rem');
    document.documentElement.style.setProperty('--border-radius', '8px');
    
    // Enable touch-friendly interactions
    enableTouchOptimizations();
    
    // Optimize for portrait orientation
    optimizeForPortrait();
}

function applyTabletOptimizations() {
    // Tablet-specific optimizations
    document.documentElement.style.setProperty('--touch-target-size', '44px');
    document.documentElement.style.setProperty('--font-size-base', '16px');
    document.documentElement.style.setProperty('--spacing-unit', '0.75rem');
    document.documentElement.style.setProperty('--border-radius', '12px');
    
    // Enable touch-friendly interactions
    enableTouchOptimizations();
    
    // Support both orientations
    supportBothOrientations();
}

function applyWebOptimizations() {
    // Web-specific optimizations
    document.documentElement.style.setProperty('--touch-target-size', '32px');
    document.documentElement.style.setProperty('--font-size-base', '18px');
    document.documentElement.style.setProperty('--spacing-unit', '1rem');
    document.documentElement.style.setProperty('--border-radius', '16px');
    
    // Enable mouse-friendly interactions
    enableMouseOptimizations();
    
    // Optimize for desktop
    optimizeForDesktop();
}

function enableTouchOptimizations() {
    // Add touch-friendly styles
    document.body.classList.add('touch-optimized');
    document.body.classList.remove('mouse-optimized');
    
    // Increase touch targets
    const touchElements = document.querySelectorAll('button, .nav-item, .game-item, .example-item');
    touchElements.forEach(element => {
        element.style.minHeight = 'var(--touch-target-size)';
        element.style.minWidth = 'var(--touch-target-size)';
    });
}

function enableMouseOptimizations() {
    // Add mouse-friendly styles
    document.body.classList.add('mouse-optimized');
    document.body.classList.remove('touch-optimized');
    
    // Standard touch targets
    const touchElements = document.querySelectorAll('button, .nav-item, .game-item, .example-item');
    touchElements.forEach(element => {
        element.style.minHeight = '';
        element.style.minWidth = '';
    });
}

function optimizeForPortrait() {
    // Phone portrait optimizations
    const gameArea = document.querySelector('.game-area');
    if (gameArea) {
        gameArea.style.flexDirection = 'column';
        gameArea.style.gap = '1rem';
    }
    
    // Stack navigation vertically
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.style.flexDirection = 'column';
        nav.style.width = '100%';
    }
}

function supportBothOrientations() {
    // Tablet orientation support
    const gameArea = document.querySelector('.game-area');
    if (gameArea) {
        gameArea.style.flexDirection = 'row';
        gameArea.style.gap = '1.5rem';
    }
    
    // Flexible navigation
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.style.flexDirection = 'row';
        nav.style.flexWrap = 'wrap';
    }
}

function optimizeForDesktop() {
    // Desktop optimizations
    const gameArea = document.querySelector('.game-area');
    if (gameArea) {
        gameArea.style.flexDirection = 'row';
        gameArea.style.gap = '2rem';
    }
    
    // Horizontal navigation
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.style.flexDirection = 'row';
        nav.style.flexWrap = 'nowrap';
    }
}

function updateDeviceModeUI() {
    // Update device mode indicator
    const modeIndicator = document.getElementById('device-mode-indicator');
    if (modeIndicator) {
        modeIndicator.textContent = currentDeviceMode.toUpperCase();
        modeIndicator.className = `device-mode-indicator ${currentDeviceMode}-mode`;
    }
    
    // Update responsive elements
    updateResponsiveElements();
    
    // Update game layouts
    updateGameLayouts();
}

function updateGameLayouts() {
    // Update game layouts based on device mode
    const games = ['alphabet', 'numbers', 'colors', 'shapes', 'animals', 'words', 'people'];
    
    games.forEach(gameType => {
        const gameContainer = document.querySelector(`.${gameType}-game`);
        if (gameContainer) {
            gameContainer.setAttribute('data-device-mode', currentDeviceMode);
        }
    });
    
    // Update writing section layout
    const writingSection = document.querySelector('.writing');
    if (writingSection) {
        writingSection.setAttribute('data-device-mode', currentDeviceMode);
    }
}

function reinitializeForDeviceMode(mode) {
    // Reinitialize components for new device mode
    switch (mode) {
        case 'phone':
            initializePhoneMode();
            break;
        case 'tablet':
            initializeTabletMode();
            break;
        case 'web':
            initializeWebMode();
            break;
    }
    
    // Reinitialize writing section if active
    if (window.location.hash === '#writing') {
        setTimeout(() => {
            initWritingSection();
        }, 100);
    }
}

function initializePhoneMode() {
    // Phone-specific initializations
    console.log('Initializing phone mode...');
    
    // Enable swipe gestures
    enableSwipeGestures();
    
    // Optimize for single-handed use
    optimizeForSingleHand();
    
    // Enable vibration feedback
    enableVibrationFeedback();
}

function initializeTabletMode() {
    // Tablet-specific initializations
    console.log('Initializing tablet mode...');
    
    // Enable multi-touch gestures
    enableMultiTouchGestures();
    
    // Optimize for two-handed use
    optimizeForTwoHands();
    
    // Enable pen support
    enablePenSupport();
}

function initializeWebMode() {
    // Web-specific initializations
    console.log('Initializing web mode...');
    
    // Enable keyboard shortcuts
    enableKeyboardShortcuts();
    
    // Optimize for mouse interaction
    optimizeForMouseInteraction();
    
    // Enable right-click context menus
    enableContextMenus();
}

function enableSwipeGestures() {
    // Add swipe gesture support for phone
    let startX, startY, endX, endY;
    
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (diffX > 50) {
                // Swipe left - next
                handleSwipeLeft();
            } else if (diffX < -50) {
                // Swipe right - previous
                handleSwipeRight();
            }
        } else {
            // Vertical swipe
            if (diffY > 50) {
                // Swipe up - menu
                handleSwipeUp();
            } else if (diffY < -50) {
                // Swipe down - close
                handleSwipeDown();
            }
        }
    });
}

function enableMultiTouchGestures() {
    // Add multi-touch gesture support for tablet
    let initialDistance = 0;
    
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            initialDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    });
    
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            const currentDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            
            const scale = currentDistance / initialDistance;
            handlePinchZoom(scale);
        }
    });
}

function enableKeyboardShortcuts() {
    // Add keyboard shortcuts for web
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    navigateToSection('alphabet');
                    break;
                case '2':
                    e.preventDefault();
                    navigateToSection('numbers');
                    break;
                case '3':
                    e.preventDefault();
                    navigateToSection('colors');
                    break;
                case '4':
                    e.preventDefault();
                    navigateToSection('shapes');
                    break;
                case '5':
                    e.preventDefault();
                    navigateToSection('animals');
                    break;
                case '6':
                    e.preventDefault();
                    navigateToSection('words');
                    break;
                case '7':
                    e.preventDefault();
                    navigateToSection('people');
                    break;
                case '8':
                    e.preventDefault();
                    navigateToSection('writing');
                    break;
                case '9':
                    e.preventDefault();
                    navigateToSection('story');
                    break;
                case '0':
                    e.preventDefault();
                    navigateToSection('play');
                    break;
            }
        }
    });
}

// Swipe gesture handlers
function handleSwipeLeft() {
    // Navigate to next item
    if (currentGame) {
        nextLearning();
    }
}

function handleSwipeRight() {
    // Navigate to previous item
    if (currentGame) {
        // Previous logic would go here
    }
}

function handleSwipeUp() {
    // Open menu or show options
    showQuickMenu();
}

function handleSwipeDown() {
    // Close current game or go back
    if (currentGame) {
        closeGame();
    }
}

function handlePinchZoom(scale) {
    // Handle pinch zoom for tablet
    const gameArea = document.querySelector('.game-area');
    if (gameArea) {
        gameArea.style.transform = `scale(${Math.min(Math.max(scale, 0.5), 2)})`;
    }
}

function showQuickMenu() {
    // Show quick access menu for phone
    const quickMenu = document.createElement('div');
    quickMenu.className = 'quick-menu phone-mode';
    quickMenu.innerHTML = `
        <div class="quick-menu-content">
            <h3>Quick Menu</h3>
            <div class="quick-menu-items">
                <button onclick="navigateToSection('alphabet')">ABC</button>
                <button onclick="navigateToSection('numbers')">123</button>
                <button onclick="navigateToSection('colors')">🎨</button>
                <button onclick="navigateToSection('shapes')">🔷</button>
                <button onclick="navigateToSection('animals')">🐾</button>
                <button onclick="navigateToSection('writing')">✏️</button>
            </div>
            <button class="close-menu" onclick="closeQuickMenu()">✕</button>
        </div>
    `;
    
    document.body.appendChild(quickMenu);
    
    // Animate in
    setTimeout(() => {
        quickMenu.classList.add('show');
    }, 10);
}

function closeQuickMenu() {
    const quickMenu = document.querySelector('.quick-menu');
    if (quickMenu) {
        quickMenu.classList.remove('show');
        setTimeout(() => {
            if (quickMenu.parentElement) {
                quickMenu.parentElement.removeChild(quickMenu);
            }
        }, 300);
    }
}

function navigateToSection(section) {
    // Navigate to specific section
    const sectionElement = document.querySelector(`#${section}`);
    if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' });
        
        // Update active navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const navItem = document.querySelector(`[href="#${section}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }
    }
}

// Device mode change detection
function handleDeviceModeChange() {
    const newMode = detectDeviceMode();
    if (newMode !== currentDeviceMode) {
        setDeviceMode(newMode);
    }
}

// Initialize device mode system
function initializeDeviceModeSystem() {
    if (deviceModeInitialized) return;
    
    // Set initial device mode
    const initialMode = detectDeviceMode();
    setDeviceMode(initialMode);
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(handleDeviceModeChange, 100);
    });
    
    // Listen for window resize
    window.addEventListener('resize', () => {
        handleDeviceModeChange();
    });
    
    deviceModeInitialized = true;
    console.log('Device mode system initialized');
}

// Enhanced touch detection and optimization
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Helper functions for device mode optimization
function optimizeForSingleHand() {
    // Optimize UI for single-handed phone use
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.style.position = 'fixed';
        nav.style.bottom = '0';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.zIndex = '1000';
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
        nav.style.borderTop = '1px solid rgba(0, 0, 0, 0.1)';
    }
}

function optimizeForTwoHands() {
    // Optimize UI for two-handed tablet use
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.style.position = 'static';
        nav.style.background = 'transparent';
        nav.style.backdropFilter = 'none';
        nav.style.borderTop = 'none';
    }
}

function enableVibrationFeedback() {
    // Enable vibration feedback for phone
    if ('vibrate' in navigator) {
        // Add vibration to button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .nav-item, .game-item')) {
                navigator.vibrate(50);
            }
        });
    }
}

function enablePenSupport() {
    // Enable pen/stylus support for tablet
    document.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'pen') {
            document.body.classList.add('pen-mode');
        }
    });
    
    document.addEventListener('pointerup', () => {
        document.body.classList.remove('pen-mode');
    });
}

function optimizeForMouseInteraction() {
    // Optimize for mouse interaction on desktop
    document.addEventListener('mouseenter', (e) => {
        if (e.target.matches('.game-item, .nav-item')) {
            e.target.style.transform = 'scale(1.05)';
        }
    });
    
    document.addEventListener('mouseleave', (e) => {
        if (e.target.matches('.game-item, .nav-item')) {
            e.target.style.transform = 'scale(1)';
        }
    });
}

function enableContextMenus() {
    // Enable right-click context menus for desktop
    document.addEventListener('contextmenu', (e) => {
        if (e.target.matches('.game-item')) {
            e.preventDefault();
            showContextMenu(e);
        }
    });
}

function showContextMenu(e) {
    // Show context menu for desktop
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.innerHTML = `
        <div class="context-menu-content">
            <button onclick="restartGame()">Restart</button>
            <button onclick="showHelp()">Help</button>
            <button onclick="closeContextMenu()">Close</button>
        </div>
    `;
    
    contextMenu.style.position = 'fixed';
    contextMenu.style.left = e.clientX + 'px';
    contextMenu.style.top = e.clientY + 'px';
    contextMenu.style.zIndex = '10000';
    
    document.body.appendChild(contextMenu);
    
    // Close on click outside
    document.addEventListener('click', closeContextMenu, { once: true });
}

function closeContextMenu() {
    const contextMenu = document.querySelector('.context-menu');
    if (contextMenu) {
        contextMenu.remove();
    }
}

function showHelp() {
    // Show help modal
    const helpModal = document.createElement('div');
    helpModal.className = 'help-modal';
    helpModal.innerHTML = `
        <div class="help-content">
            <h2>How to Play</h2>
            <div class="help-section">
                <h3>Phone Mode</h3>
                <p>• Swipe left/right to navigate</p>
                <p>• Swipe up for quick menu</p>
                <p>• Tap to interact</p>
            </div>
            <div class="help-section">
                <h3>Tablet Mode</h3>
                <p>• Pinch to zoom</p>
                <p>• Use pen/stylus for writing</p>
                <p>• Multi-touch gestures</p>
            </div>
            <div class="help-section">
                <h3>Web Mode</h3>
                <p>• Use keyboard shortcuts (Ctrl+1-0)</p>
                <p>• Right-click for options</p>
                <p>• Mouse hover effects</p>
            </div>
            <button onclick="closeHelp()">Got it!</button>
        </div>
    `;
    
    document.body.appendChild(helpModal);
    
    setTimeout(() => {
        helpModal.classList.add('show');
    }, 10);
}

function closeHelp() {
    const helpModal = document.querySelector('.help-modal');
    if (helpModal) {
        helpModal.classList.remove('show');
        setTimeout(() => {
            if (helpModal.parentElement) {
                helpModal.parentElement.removeChild(helpModal);
            }
        }, 300);
    }
}

function addDeviceModeIndicator() {
    // Add device mode indicator to the page
    const indicator = document.createElement('div');
    indicator.id = 'device-mode-indicator';
    indicator.className = `device-mode-indicator ${currentDeviceMode}-mode`;
    indicator.textContent = currentDeviceMode.toUpperCase();
    indicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 12px;
        font-weight: bold;
        z-index: 10000;
        pointer-events: none;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(indicator);
    
    // Hide indicator after 3 seconds
    setTimeout(() => {
        indicator.style.opacity = '0';
        setTimeout(() => {
            if (indicator.parentElement) {
                indicator.parentElement.removeChild(indicator);
            }
        }, 300);
    }, 3000);
}

// Welcome Overlay Logic
function showWelcomeOverlay() {
  document.body.classList.add('welcome-active');
  document.getElementById('welcome-overlay').style.display = 'flex';
  // Optional: Play greeting sound or voice
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance("Welcome to Eric's Learning Adventure! Please click Eric's picture to enter.");
    utter.rate = 1.05;
    utter.pitch = 1.1;
    window.speechSynthesis.speak(utter);
  }
}

function hideWelcomeOverlay() {
  document.body.classList.remove('welcome-active');
  document.getElementById('welcome-overlay').style.display = 'none';
  localStorage.setItem('ericAppEntered', 'yes');
}

// Profile Picture Management System
let profileImageData = null;

function initializeProfilePicture() {
    const profilePicture = document.querySelector('.profile-picture');
    if (profilePicture) {
        profilePicture.addEventListener('click', showProfileUploadModal);
        
        // Load saved profile picture from localStorage
        loadProfilePicture();
    }
}

function showProfileUploadModal() {
    const modal = document.createElement('div');
    modal.className = 'profile-upload-modal';
    modal.innerHTML = `
        <div class="profile-upload-content">
            <h3>Update Eric's Profile Picture</h3>
            <p>Choose a photo of Eric to personalize his learning adventure!</p>
            
            <input type="file" id="profile-upload" accept="image/*" onchange="previewProfileImage(event)">
            <label for="profile-upload">📷 Choose Photo</label>
            
            <div class="profile-preview" id="profile-preview">
                <img id="preview-image" src="" alt="Preview">
            </div>
            
            <div class="upload-buttons">
                <button onclick="saveProfilePicture()" id="save-btn" disabled>Save Picture</button>
                <button onclick="closeProfileUploadModal()" class="cancel">Cancel</button>
            </div>
            
            <div class="upload-tips">
                <p><strong>Tips:</strong></p>
                <ul>
                    <li>Use a clear, front-facing photo</li>
                    <li>Square photos work best</li>
                    <li>Make sure Eric's face is well-lit</li>
                    <li>Keep file size under 5MB</li>
                </ul>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeProfileUploadModal();
        }
    });
}

function previewProfileImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('File too large! Please choose a smaller image (under 5MB).', 'error');
        return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('preview-image');
        const previewContainer = document.getElementById('profile-preview');
        const saveBtn = document.getElementById('save-btn');
        
        preview.src = e.target.result;
        previewContainer.classList.add('show');
        saveBtn.disabled = false;
        
        // Store image data
        profileImageData = e.target.result;
        
        // Play success sound
        playSound('select');
    };
    
    reader.readAsDataURL(file);
}

function saveProfilePicture() {
    if (!profileImageData) return;
    
    // Save to localStorage
    try {
        localStorage.setItem('ericProfilePicture', profileImageData);
        
        // Update the profile picture
        const profilePic = document.getElementById('eric-profile-pic');
        if (profilePic) {
            profilePic.src = profileImageData;
        }
        
        // Show success message
        showNotification('Profile picture updated! Eric looks great! 🎉', 'success');
        
        // Play success sound
        playSound('complete');
        
        // Close modal
        closeProfileUploadModal();
        
        // Add celebration effect
        addProfileCelebration();
        
    } catch (error) {
        showNotification('Could not save profile picture. Please try again.', 'error');
        console.error('Error saving profile picture:', error);
    }
}

function loadProfilePicture() {
    try {
        const savedImage = localStorage.getItem('ericProfilePicture');
        if (savedImage) {
            const profilePic = document.getElementById('eric-profile-pic');
            if (profilePic) {
                profilePic.src = savedImage;
            }
        }
    } catch (error) {
        console.error('Error loading profile picture:', error);
    }
}

function closeProfileUploadModal() {
    const modal = document.querySelector('.profile-upload-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentElement) {
                modal.parentElement.removeChild(modal);
            }
        }, 300);
    }
    
    // Reset form
    profileImageData = null;
    const fileInput = document.getElementById('profile-upload');
    if (fileInput) {
        fileInput.value = '';
    }
}

function addProfileCelebration() {
    // Add confetti effect
    triggerConfetti();
    
    // Add profile picture celebration animation
    const profilePic = document.querySelector('.profile-picture');
    if (profilePic) {
        profilePic.style.animation = 'profileCelebration 1s ease-in-out';
        setTimeout(() => {
            profilePic.style.animation = 'profileFloat 3s ease-in-out infinite';
        }, 1000);
    }
}

// Add celebration animation to CSS
const profileStyle = document.createElement('style');
profileStyle.textContent = `
    @keyframes profileCelebration {
        0% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.2) rotate(5deg); }
        50% { transform: scale(1.1) rotate(-5deg); }
        75% { transform: scale(1.15) rotate(3deg); }
        100% { transform: scale(1) rotate(0deg); }
    }
    
    .upload-tips {
        margin-top: 1.5rem;
        text-align: left;
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 10px;
        border-left: 4px solid #667eea;
    }
    
    .upload-tips p {
        margin: 0 0 0.5rem 0;
        font-weight: bold;
        color: #333;
    }
    
    .upload-tips ul {
        margin: 0;
        padding-left: 1.5rem;
    }
    
    .upload-tips li {
        margin: 0.3rem 0;
        color: #666;
        font-size: 0.9rem;
    }
    
    .upload-buttons {
        margin-top: 1.5rem;
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .upload-buttons button {
        min-width: 100px;
    }
    
    .upload-buttons button:disabled {
        background: #6c757d;
        cursor: not-allowed;
        transform: none;
    }
    
    .upload-buttons button:disabled:hover {
        background: #6c757d;
        transform: none;
    }
`;
document.head.appendChild(profileStyle);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing welcome overlay...');
  
  // Welcome Overlay Logic - Check first
  if (!localStorage.getItem('ericAppEntered')) {
    console.log('First visit, showing welcome overlay');
    showWelcomeOverlay();
  } else {
    console.log('Returning user, hiding welcome overlay');
    hideWelcomeOverlay();
    // Show Home section by default
    showSection('hero');
  }
  
  // Add click event to welcome overlay picture
  const welcomePic = document.querySelector('.welcome-profile-pic');
  if (welcomePic) {
    console.log('Adding click event to welcome picture');
    welcomePic.addEventListener('click', function() {
      console.log('Welcome pic clicked!');
      hideWelcomeOverlay();
      // Show Home section after entering
      showSection('hero');
    });
  }
  
  // Add click event to welcome enter button
  const enterBtn = document.querySelector('.welcome-enter-btn');
  if (enterBtn) {
    console.log('Adding click event to enter button');
    enterBtn.addEventListener('click', function() {
      console.log('Enter button clicked!');
      hideWelcomeOverlay();
      // Show Home section after entering
      showSection('hero');
    });
  }
  
  // Add click event to main profile picture
  const profilePic = document.querySelector('.profile-picture');
  if (profilePic) {
    console.log('Adding click event to main profile picture');
    profilePic.addEventListener('click', function() {
      console.log('Profile pic clicked!');
      if (document.body.classList.contains('welcome-active')) {
        hideWelcomeOverlay();
        // Show Home section after entering
        showSection('hero');
      }
    });
  }
  
  // Initialize device mode system
  initializeDeviceModeSystem();
  
  // Setup event listeners for navigation and interactions
  setupEventListeners();
  
  // Initialize profile picture
  initializeProfilePicture();
  
  // Initialize writing section when writing tab is clicked
  const writingTab = document.querySelector('a[href="#writing"]');
  if (writingTab) {
    writingTab.addEventListener('click', () => {
      setTimeout(() => {
        initWritingSection();
        updateResponsiveElements();
      }, 100);
    });
  }
  
  // Also initialize if we're already on the writing section
  if (window.location.hash === '#writing') {
    setTimeout(() => {
      initWritingSection();
      updateResponsiveElements();
    }, 100);
  }
  
  // Initialize responsive elements on page load
  updateResponsiveElements();
  
  // Add device mode indicator to the page
  addDeviceModeIndicator();
});

// Setup mobile enhancements
function setupMobileEnhancements() {
    // Add touch-friendly interactions for mobile devices
    if ('ontouchstart' in window) {
        // Add touch feedback to interactive elements
        document.querySelectorAll('.game-card, .nav-link, .character, .baby').forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            element.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });
        
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
}

// Setup mobile play area
function setupMobilePlayArea() {
    const playArea = document.getElementById("play-area");
    if (playArea) {
        // Add touch events for mobile bubble creation
        playArea.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const touch = e.touches[0];
            createBubble(touch.clientX, touch.clientY);
        });
        
        // Also keep mouse events for desktop
        playArea.addEventListener('click', function(e) {
            createBubble(e.clientX, e.clientY);
        });
    }
}

// Show section function for navigation
function showSection(sectionId) {
    console.log('Showing section:', sectionId);
    
    // Hide all sections first
    const allSections = document.querySelectorAll('section, .hero, .games, .learning, .writing, .play-area, .achievements, .story-time-section');
    allSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the requested section
    const targetSection = document.getElementById(sectionId) || document.querySelector(`.${sectionId}`);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.scrollIntoView({ behavior: 'smooth' });
        
        // Update active navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Special handling for writing section
        if (sectionId === 'writing') {
            setTimeout(() => {
                initWritingSection();
                updateResponsiveElements();
            }, 100);
        }
        
        // Play sound and show notification
        playSound('click');
        speakText(`Welcome to ${sectionId}!`);
        
    } else {
        console.error('Section not found:', sectionId);
        // Fallback to home section
        showSection('hero');
    }
}

// Setup event listeners