/**
 * PMERIT Gabriel AI - Main Application
 */

// Configuration
const CONFIG = {
    API_BASE_URL: 'https://gabriel-ai-backend.peoplemerit.workers.dev',
    CHAT_DELAY: 1000,
    MAX_MESSAGE_LENGTH: 1000
};

// Application State
let isAuthenticated = false;
let currentUser = null;
let chatHistory = [];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 PMERIT Gabriel AI Platform Loaded');
    
    initializeChat();
    initializeSidebar();
    initializeAssessments();
    displayWelcomeMessage();
});

// Chat System
function initializeChat() {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message || message.length > CONFIG.MAX_MESSAGE_LENGTH) {
        return;
    }
    
    // Add user message
    addMessageToChat(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        await new Promise(resolve => setTimeout(resolve, CONFIG.CHAT_DELAY));
        const response = generateResponse(message);
        
        hideTypingIndicator();
        addMessageToChat(response, 'assistant');
        
        chatHistory.push({ user: message, assistant: response, timestamp: new Date() });
        
    } catch (error) {
        console.error('Chat error:', error);
        hideTypingIndicator();
        addMessageToChat("I'm having trouble right now. Please try again in a moment.", 'assistant');
    }
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender} fade-in`;
    
    if (sender === 'user') {
        messageDiv.innerHTML = `<strong>You:</strong> ${message}`;
    } else {
        messageDiv.innerHTML = `<strong>Gabriel AI:</strong> ${message}`;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateResponse(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('course') || msg.includes('learn') || msg.includes('study')) {
        return "🎓 I can help you explore our educational tracks! We offer Technology (Web Development, Programming), Business (Excel, Project Management), and Creative (Design, Content Creation) paths. Each track is designed to help you earn $2,000-$5,000+ monthly through remote work. Which area interests you most?";
    }
    
    if (msg.includes('programming') || msg.includes('coding') || msg.includes('web development')) {
        return "💻 Our Technology track is perfect for you! We start with HTML, CSS, and JavaScript fundamentals, then progress to React, Node.js, and cloud technologies. Many of our graduates are now earning $3,000-$8,000 monthly as remote developers. Would you like to take our free programming aptitude assessment?";
    }
    
    if (msg.includes('business') || msg.includes('excel') || msg.includes('project management')) {
        return "📊 Excellent choice! Our Business track covers Excel mastery, project management (PMP certification), and data analysis. These skills are in high demand globally. Our business track graduates typically start at $2,500-$5,000 monthly in remote positions. Shall we start with an Excel skills assessment?";
    }
    
    if (msg.includes('design') || msg.includes('creative') || msg.includes('marketing')) {
        return "🎨 The Creative track is amazing for visual learners! We cover graphic design (Photoshop, Canva), UI/UX design, and digital marketing. Creative professionals can earn $2,000-$6,000 monthly through freelance work and remote positions. Want to explore your creative potential with our design aptitude test?";
    }
    
    if (msg.includes('salary') || msg.includes('money') || msg.includes('earn') || msg.includes('income')) {
        return "💰 Our graduates achieve impressive results:\n• Technology Track: $25,000-$100,000+ annually\n• Business Track: $20,000-$80,000+ annually\n• Creative Track: $15,000-$60,000+ annually\n\nThese are remote positions accessible from anywhere! Your location doesn't limit your earning potential. Ready to start your transformation?";
    }
    
    const responses = [
        "I'm Gabriel AI, your educational guide! I'm here to help you discover courses, assess your skills, and plan your path to financial independence through education. What would you like to explore?",
        "Welcome to PMERIT! Our mission is transforming lives through accessible, high-quality education. I can help you find the perfect learning path based on your interests and goals. What's your dream career?",
        "Great question! I'm designed to help learners like you navigate educational opportunities and career transitions. Every day, people just like you are building new skills and creating better futures. How can I help you start your journey?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<strong>Gabriel AI:</strong> <span class="loading"></span> Thinking...';
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function displayWelcomeMessage() {
    setTimeout(() => {
        addMessageToChat("Welcome to PMERIT! I'm Gabriel AI, your educational guide. Our mission is to help you break the cycle of poverty through accessible, high-quality education that opens doors to global remote opportunities. How can I help you start your transformation today?", 'assistant');
    }, 1000);
}

// Sidebar Functions
function initializeSidebar() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            sidebarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const text = this.textContent.trim();
            handleSidebarAction(text);
        });
    });
}

function handleSidebarAction(action) {
    if (action.includes('Profile')) {
        addMessageToChat("Please sign up or log in to access your profile. Click the 'Start Learning' button in the header to get started!", 'assistant');
    } else if (action.includes('Courses')) {
        addMessageToChat("📚 Our course catalog includes:\n\n🚀 **Technology Track**: Web Development → Programming → Cloud Computing\n💼 **Business Track**: Excel Mastery → Project Management → Data Analysis\n🎨 **Creative Track**: Design → Content Creation → Digital Marketing\n\nWhich track interests you most?", 'assistant');
    } else if (action.includes('Tests')) {
        addMessageToChat("🧠 Ready to discover your potential? We offer several assessments:\n\n• **Personality Test**: Find your ideal career match\n• **Skills Assessment**: Evaluate your current abilities\n• **Learning Style Test**: Optimize your study approach\n\nWhich assessment would you like to take first?", 'assistant');
    } else if (action.includes('Progress')) {
        addMessageToChat("Sign up to start tracking your learning progress! We'll monitor your achievements, certificates, and career milestones.", 'assistant');
    } else if (action.includes('Settings')) {
        addMessageToChat("⚙️ Settings available:\n• Language preferences\n• Notification settings\n• Learning reminders\n• Progress tracking\n\nSign up to access full customization options!", 'assistant');
    } else if (action.includes('Help')) {
        addMessageToChat("❓ I'm here to help! You can ask me about:\n\n• Course information and career paths\n• Skills assessments and personality tests\n• Remote work opportunities\n• Success stories from our graduates\n• Technical support\n\nWhat specific help do you need?", 'assistant');
    }
}

// Assessment Functions
function initializeAssessments() {
    const assessmentCards = document.querySelectorAll('.assessment-card');
    
    assessmentCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            startAssessment(title);
        });
    });
}

function startAssessment(testType) {
    let message = "Assessment starting! This will help us personalize your PMERIT experience.";
    
    if (testType.includes('16 Personalities')) {
        message = "🧠 Starting Personality Assessment! This will help us understand your learning style and ideal career matches. The test takes about 10-15 minutes. Ready to discover your potential?";
    } else if (testType.includes('Skills')) {
        message = "📊 Skills Assessment initiated! We'll evaluate your current abilities across technology, business, and creative domains. This helps us recommend the perfect learning path for you.";
    }
    
    addMessageToChat(message, 'assistant');
    
    setTimeout(() => {
        addMessageToChat("To access our full assessment suite, please sign up for your free PMERIT account. Click 'Start Learning' in the header to begin!", 'assistant');
    }, 2000);
}

console.log('✅ Gabriel AI Platform Main Module Initialized');
