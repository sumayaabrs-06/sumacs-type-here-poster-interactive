// Configuration
const words = ['LOW', 'TIDE', 'GREAT', 'VIBES'];
const containers = ['#text1', '#text2', '#text3', '#text4'];

// Global variables
let allDots = [];
let dotPositions = [];

// Create dot pattern for each letter
function createDotPattern(letter) {
    const patterns = {
        'L': [
            [1,0,0,0,0],
            [1,0,0,0,0],
            [1,0,0,0,0],
            [1,0,0,0,0],
            [1,0,0,0,0],
            [1,1,1,1,1]
        ],
        'O': [
            [0,1,1,1,0],
            [1,0,0,0,1],
            [1,0,0,0,1],
            [1,0,0,0,1],
            [1,0,0,0,1],
            [0,1,1,1,0]
        ],
        'W': [
            [1,0,0,0,1],
            [1,0,0,0,1],
            [1,0,0,0,1],
            [1,0,1,0,1],
            [1,1,0,1,1],
            [1,0,0,0,1]
        ],
        'T': [
            [1,1,1,1,1],
            [0,0,1,0,0],
            [0,0,1,0,0],
            [0,0,1,0,0],
            [0,0,1,0,0],
            [0,0,1,0,0]
        ],
        'I': [
            [1,1,1,1,1],
            [0,0,1,0,0],
            [0,0,1,0,0],
            [0,0,1,0,0],
            [0,0,1,0,0],
            [1,1,1,1,1]
        ],
        'D': [
            [1,1,1,1,0],
            [1,0,0,0,1],
            [1,0,0,0,1],
            [1,0,0,0,1],
            [1,0,0,0,1],
            [1,1,1,1,0]
        ],
        'E': [
            [1,1,1,1,1],
            [1,0,0,0,0],
            [1,1,1,1,0],
            [1,0,0,0,0],
            [1,0,0,0,0],
            [1,1,1,1,1]
        ],
        'G': [
            [0,1,1,1,0],
            [1,0,0,0,1],
            [1,0,0,0,0],
            [1,0,1,1,1],
            [1,0,0,0,1],
            [0,1,1,1,0]
        ],
        'R': [
            [1,1,1,1,0],
            [1,0,0,0,1],
            [1,1,1,1,0],
            [1,1,0,0,0],
            [1,0,1,0,0],
            [1,0,0,1,1]
        ],
        'A': [
            [0,1,1,1,0],
            [1,0,0,0,1],
            [1,0,0,0,1],
            [1,1,1,1,1],
            [1,0,0,0,1],
            [1,0,0,0,1]
        ],
        'V': [
            [1,0,0,0,1],
            [1,0,0,0,1],
            [1,0,0,0,1],
            [1,0,0,0,1],
            [0,1,0,1,0],
            [0,0,1,0,0]
        ],
        'B': [
            [1,1,1,1,0],
            [1,0,0,0,1],
            [1,1,1,1,0],
            [1,0,0,0,1],
            [1,0,0,0,1],
            [1,1,1,1,0]
        ],
        'S': [
            [0,1,1,1,1],
            [1,0,0,0,0],
            [0,1,1,1,0],
            [0,0,0,0,1],
            [0,0,0,0,1],
            [1,1,1,1,0]
        ]
    };
    
    return patterns[letter] || patterns['O'];
}

// Initialize each word
function initializeWords() {
    words.forEach((word, wordIndex) => {
        const container = document.querySelector(`${containers[wordIndex]} .dot-text`);
        
        word.split('').forEach((letter, letterIndex) => {
            const charContainer = document.createElement('div');
            charContainer.className = 'char-container';
            
            // Create letter element (hidden initially)
            const letterEl = document.createElement('span');
            letterEl.className = 'letter';
            letterEl.textContent = letter;
            letterEl.style.position = 'relative';
            
            // Create dot pattern
            const pattern = createDotPattern(letter);
            const dotContainer = document.createElement('div');
            dotContainer.style.display = 'inline-block';
            dotContainer.style.position = 'relative';
            dotContainer.style.marginRight = '35px';
            
            pattern.forEach((row, rowIndex) => {
                row.forEach((dot, colIndex) => {
                    if (dot) {
                        const dotEl = document.createElement('div');
                        dotEl.className = 'dot';
                        dotEl.style.position = 'absolute';
                        dotEl.style.left = `${colIndex * 14}px`;
                        dotEl.style.top = `${rowIndex * 14}px`;
                        
                        dotContainer.appendChild(dotEl);
                        
                        // Store dot with its screen position for mouse tracking
                        allDots.push(dotEl);
                    }
                });
            });
            
            charContainer.appendChild(dotContainer);
            charContainer.appendChild(letterEl);
            container.appendChild(charContainer);
        });
    });
}

// Calculate dot positions
function calculateDotPositions() {
    dotPositions = [];
    allDots.forEach(dot => {
        const rect = dot.getBoundingClientRect();
        dotPositions.push({
            element: dot,
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        });
    });
}

// Mouse tracking for horizontal expansion effect
function handleMouseMove(e) {
    const mouseX = e.clientX;
    const screenWidth = window.innerWidth;
    const mouseProgress = mouseX / screenWidth; // 0 to 1

    // Update each dot based on its horizontal position relative to mouse
    dotPositions.forEach((dotPos, index) => {
        const dotProgress = dotPos.x / screenWidth; // 0 to 1
        
        let scale = 1;
        
        // Create a gradual expansion zone around the mouse
        const expansionZone = 0.15; // 15% of screen width on each side
        const distance = Math.abs(mouseProgress - dotProgress);
        
        if (distance <= expansionZone) {
            // Dot is within expansion zone
            const proximityFactor = 1 - (distance / expansionZone); // 1 at mouse, 0 at edge
            const baseExpansion = mouseProgress * 12; // Base expansion based on mouse position
            const proximityBonus = proximityFactor * 8; // Extra expansion for proximity
            
            // Add random wave effect when fully expanded
            let randomWave = 0;
            if (baseExpansion > 10) {
                const waveFreq = (index * 0.3) + (Date.now() * 0.002);
                randomWave = Math.sin(waveFreq) * 3 + Math.cos(waveFreq * 1.7) * 2;
            }
            
            scale = 1 + baseExpansion + proximityBonus + randomWave;
            scale = Math.min(scale, 25); // Cap at 25x for more dramatic effect
        } else if (mouseProgress > dotProgress) {
            // Dot is behind mouse but outside expansion zone
            const baseExpansion = mouseProgress * 3; // Gentle expansion for passed dots
            
            // Add subtle random wave for passed dots too
            let randomWave = 0;
            if (baseExpansion > 2) {
                const waveFreq = (index * 0.2) + (Date.now() * 0.001);
                randomWave = Math.sin(waveFreq) * 1.5;
            }
            
            scale = 1 + baseExpansion + randomWave;
            scale = Math.min(scale, 10);
        }
        
        gsap.to(dotPos.element, {
            scale: scale,
            duration: 0.4,
            ease: "power1.out"
        });
    });
}

// Reset animation when mouse leaves
function handleMouseLeave() {
    gsap.to(allDots, {
        scale: 1,
        duration: 0.5,
        ease: "power2.out"
    });
}

// Handle window resize
function handleResize() {
    let resizeTimeout;
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        calculateDotPositions();
    }, 100);
}

// Initialize the application
function init() {
    // Initialize words and dots
    initializeWords();
    
    // Calculate dot positions after DOM is ready
    setTimeout(calculateDotPositions, 100);
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);
    
    // Add initial animation
    gsap.from('.text-container', {
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        delay: 0.5
    });
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);