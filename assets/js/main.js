/**
 * Gabriel AI Educational Platform - Main Application Logic
 * Mission: Empowering learning through accessible, high-quality education
 */

// Application Configuration
const APP_CONFIG = {
    name: 'PMERIT - Gabriel AI',
    version: '1.0.0',
    mission: 'Empowering learning through accessible, high-quality education',
    apiEndpoints: {
        production: 'https://gabriel-ai-backend.peoplemerit.workers.dev',
        development: 'http://localhost:8000'
    },
    features: {
        virtualHuman: false,
        voiceInput: true,
        darkMode: true,
        multiLanguage: true
    }
};

// Global Application State
let appState = {
    isAuthenticated: false,
    currentUser: null,
    darkMode: false,
    language: 'en',
    connectionStatus: 'connecting',
    virtualHumanMode: false,
    activePanel: null
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log(`Initializing ${APP_CONFIG.name} v${APP_CONFIG.version}`);
    
    initializeUI();
    setupEventListeners();
    detectUserLocation();
    testBackendConnection();
    loadUserPreferences();
});

/**
 * Initialize User Interface
 */
function initializeUI() {
    updateMissionDisplay();
    setupResponsiveHandlers();
    initializeSidebars();
    updateWordCount();
}

/**
 * Update mission display with current messaging
 */
function updateMissionDisplay() {
    const missionElements = document.querySelectorAll('.mission-subtitle');
    missionElements.forEach(el => {
        el.textContent = APP_CONFIG.mission;
    });
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Sidebar interactions
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', handleSidebarClick);
    });
    
    // Assessment cards
    document.querySelectorAll('.assessment-card').forEach(card => {
        card.addEventListener('click', handleAssessmentClick);
    });
    
    // Settings toggles
    const darkModeToggle = document.getElementById('dark-mode');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleDarkMode);
    }
    
    const ttsToggle = document.getElementById('tts-toggle');
    if (ttsToggle) {
        ttsToggle.addEventListener('change', toggleTextToSpeech);
    }
    
    // Language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', changeLanguage);
    }
    
    // Chat input
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('input', updateWordCount);
        chatInput.addEventListener('keypress', handleKeyPress);
    }
    
    // Mobile responsive handlers
    setupMobileHandlers();
}

/**
 * Handle sidebar item clicks
 */
function handleSidebarClick(event) {
    const item = event.currentTarget;
    const panelType = item.dataset.panel;
    
    // Visual feedback
    document.querySelectorAll('.sidebar-item').forEach(el => {
        el.classList.remove('active');
    });
    item.classList.add('active');
    
    // Handle panel activation
    activatePanel(panelType);
}

/**
 * Activate specific panel functionality
 */
function activatePanel(panelType) {
    appState.activePanel = panelType;
    
    const responses = {
        profile: "👤 Profile panel coming soon! You'll be able to track your learning journey, achievements, and personal goals.",
        settings: "⚙️ Settings panel in development! Customize your learning experience, notification preferences, and accessibility options.",
        assessments: "📋 Assessment center! Take personality tests and skill evaluations to discover your optimal learning path.",
        subjects: "📚 Subject catalog coming soon! Explore our Technology, Business, and Creative learning tracks.",
        progress: "📊 Progress tracking in development! Monitor your learning streaks, completed lessons, and skill development.",
        help: "❓ I'm here to help! Ask me about courses, learning strategies, career guidance, or technical support."
    };
    
    if (responses[panelType]) {
        addMessageToChat(responses[panelType], 'assistant');
    }
}

/**
 * Handle assessment card clicks
 */
function handleAssessmentClick(event) {
    const card = event.currentTarget;
    const assessmentType = card.dataset.assessment || 'general';
    
    startAssessment(assessmentType);
}

/**
 * Start assessment process
 */
function startAssessment(type) {
    const assessmentInfo = {
        'learning-style': {
            title: 'Learning Style Assessment',
            description: 'Discover how you learn best - visual, auditory, kinesthetic, or reading/writing preferences.',
            duration: '5-8 minutes'
        },
        'interest-profiler': {
            title: 'Interest Profiler',
            description: 'Explore subjects and career fields that align with your natural interests and curiosity.',
            duration: '8-12 minutes'
        },
        'skill-evaluation': {
            title: 'Skills Evaluation',
            description: 'Assess your current abilities across different domains and identify growth opportunities.',
            duration: '10-15 minutes'
        },
        'goal-setting': {
            title: 'Goal Setting Workshop',
            description: 'Define clear, achievable academic and personal development objectives.',
            duration: '15-20 minutes'
        }
    };
    
    const info = assessmentInfo[type] || assessmentInfo['learning-style'];
    
    addMessageToChat(
        `🎯 Starting ${info.title}!\n\n${info.description}\n\nEstimated time: ${info.duration}\n\nThis assessment system is currently being finalized. For now, I can guide you through some questions to help identify your learning preferences. What type of activities do you find most engaging?`,
        'assistant'
    );
}

/**
 * Toggle dark mode
 */
function toggleDarkMode(event) {
    appState.darkMode = event.target.checked;
    document.body.classList.toggle('dark-mode', appState.darkMode);
    
    // Save preference
    localStorage.setItem('darkMode', appState.darkMode);
    
    updateStatus('🌙 Dark mode ' + (appState.darkMode ? 'enabled' : 'disabled'), 'info');
}

/**
 * Toggle text-to-speech
 */
function toggleTextToSpeech(event) {
    const enabled = event.target.checked;
    
    if (enabled && !('speechSynthesis' in window)) {
        event.target.checked = false;
        addMessageToChat('🔊 Text-to-speech is not supported in your browser. Try using Chrome, Edge, or Safari.', 'assistant');
        return;
    }
    
    appState.textToSpeech = enabled;
    localStorage.setItem('textToSpeech', enabled);
    
    updateStatus('🔊 Text-to-speech ' + (enabled ? 'enabled' : 'disabled'), 'info');
}

/**
 * Change language
 */
function changeLanguage(event) {
    const newLanguage = event.target.value;
    appState.language = newLanguage;
    
    // Update UI language (placeholder for future implementation)
    updateStatus(`🌍 Language changed to ${getLanguageName(newLanguage)}`, 'info');
    
    localStorage.setItem('language', newLanguage);
}

/**
 * Get language display name
 */
function getLanguageName(code) {
    const languages = {
        'en': 'English',
        'yo': 'Yoruba',
        'ig': 'Igbo',
        'ha': 'Hausa'
    };
    return languages[code] || 'English';
}

/**
 * Update word count
 */
function updateWordCount() {
    const input = document.getElementById('chat-input');
    const counter = document.querySelector('.word-count');
    
    if (input && counter) {
        const count = input.value.length;
        counter.textContent = `${count}/1000`;
        
        if (count > 900) {
            counter.style.color = 'var(--error-color)';
        } else if (count > 700) {
            counter.style.color = 'var(--warning-color)';
        } else {
            counter.style.color = 'var(--text-secondary)';
        }
    }
}

/**
 * Handle key press events
 */
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

/**
 * Setup mobile-specific handlers
 */
function setupMobileHandlers() {
    if (window.innerWidth <= 768) {
        // Make sidebars collapsible on mobile
        const leftSidebar = document.querySelector('.sidebar-left');
        const rightSidebar = document.querySelector('.sidebar-right');
        
        if (leftSidebar) {
            leftSidebar.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.toggle('expanded');
                }
            });
        }
        
        if (rightSidebar) {
            rightSidebar.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.toggle('expanded');
                }
            });
        }
    }
}

/**
 * Setup responsive handlers
 */
function setupResponsiveHandlers() {
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            handleResize();
        }, 250);
    });
}

/**
 * Handle window resize
 */
function handleResize() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile && !document.body.classList.contains('mobile-layout')) {
        document.body.classList.add('mobile-layout');
        setupMobileHandlers();
    } else if (!isMobile && document.body.classList.contains('mobile-layout')) {
        document.body.classList.remove('mobile-layout');
    }
}

/**
 * Initialize sidebars
 */
function initializeSidebars() {
    // Set default active states
    const defaultActive = document.querySelector('.sidebar-item[data-panel="help"]');
    if (defaultActive) {
        defaultActive.classList.add('active');
    }
}

/**
 * Detect user location for geo-aware features
 */
function detectUserLocation() {
    // Simple IP-based detection (placeholder)
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const country = data.country_name;
            const isAfrica = ['Nigeria', 'Ghana', 'Kenya', 'South Africa'].includes(country);
            
            updateGeoAwareElements(isAfrica);
        })
        .catch(() => {
            // Default to global layout
            updateGeoAwareElements(false);
        });
}

/**
 * Update geo-aware UI elements
 */
function updateGeoAwareElements(isAfrica) {
    const donateButtons = document.querySelectorAll('.geo-aware[data-geo="africa"]');
    const pricingButtons = document.querySelectorAll('.geo-aware[data-geo="global"]');
    
    donateButtons.forEach(btn => {
        btn.style.display = isAfrica ? 'inline-block' : 'none';
    });
    
    pricingButtons.forEach(btn => {
        btn.style.display = isAfrica ? 'none' : 'inline-block';
    });
}

/**
 * Load user preferences from localStorage
 */
function loadUserPreferences() {
    // Dark mode
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        document.getElementById('dark-mode').checked = true;
        toggleDarkMode({ target: { checked: true } });
    }
    
    // Language
    const savedLanguage = localStorage.getItem('language') || 'en';
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = savedLanguage;
        appState.language = savedLanguage;
    }
    
    // Text-to-speech
    const savedTTS = localStorage.getItem('textToSpeech') === 'true';
    if (savedTTS) {
        document.getElementById('tts-toggle').checked = true;
        appState.textToSpeech = true;
    }
}

/**
 * Toggle virtual human mode
 */
function toggleVirtualHuman() {
    appState.virtualHumanMode = !appState.virtualHumanMode;
    
    const modeBtn = document.querySelector('.mode-toggle');
    if (modeBtn) {
        modeBtn.textContent = appState.virtualHumanMode ? 
            '💬 Text Mode' : '🎭 Virtual Human Mode';
    }
    
    updateStatus(
        `🎭 Virtual Human Mode ${appState.virtualHumanMode ? 'enabled' : 'disabled'}`, 
        'info'
    );
    
    addMessageToChat(
        appState.virtualHumanMode ? 
            '🎭 Virtual Human Mode activated! 3D avatar interactions are being developed. For now, enjoy enhanced conversational responses!' :
            '💬 Switched back to text mode. Virtual Human Mode will be available soon with full 3D avatar support!',
        'assistant'
    );
}

/**
 * Show mission information
 */
function showMissionInfo() {
    const missionMessage = `
📖 **Our Mission at PMERIT**

${APP_CONFIG.mission}

We believe that education should never be limited by geographical location, financial resources, or traditional barriers. Through innovative technology and AI-powered guidance, we're creating pathways for learners everywhere to:

✨ **Discover** their unique talents and interests
🎯 **Develop** practical skills through interactive learning
🚀 **Transform** their lives through knowledge and opportunity

**Our Approach:**
• Self-paced learning tailored to your schedule
• AI-guided tutoring and personalized support  
• Skill development through hands-on projects
• Community-driven growth and collaboration

Education is not about promises of quick wealth - it's about empowering you with knowledge, skills, and confidence to create your own opportunities and build a meaningful future.

How can I help you start or continue your learning journey today?
    `;
    
    addMessageToChat(missionMessage, 'assistant');
}

/**
 * Voice input functionality
 */
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        addMessageToChat('🎤 Voice input is not supported in your browser. Try using Chrome or Edge.', 'assistant');
        return;
    }
    
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = appState.language === 'en' ? 'en-US' : appState.language;
    
    recognition.onstart = function() {
        updateStatus('🎤 Listening...', 'info');
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('chat-input').value = transcript;
        updateWordCount();
        updateStatus('✅ Voice input complete', 'working');
    };
    
    recognition.onerror = function(event) {
        updateStatus('❌ Voice input failed', 'error');
    };
    
    recognition.start();
}

/**
 * Utility function to update status indicator
 */
function updateStatus(message, type) {
    const indicator = document.getElementById('status-indicator');
    if (indicator) {
        indicator.textContent = message;
        indicator.className = `status-indicator ${type}`;
        
        // Auto-hide after 3 seconds for non-critical messages
        if (type === 'info' || type === 'working') {
            setTimeout(() => {
                if (indicator.textContent === message) {
                    indicator.style.opacity = '0.7';
                }
            }, 3000);
        }
    }
}

// Export functions for use in other modules
window.APP_CONFIG = APP_CONFIG;
window.appState = appState;
window.toggleVirtualHuman = toggleVirtualHuman;
window.showMissionInfo = showMissionInfo;
window.startVoiceInput = startVoiceInput;
window.startAssessment = startAssessment;
