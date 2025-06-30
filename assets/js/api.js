/**
 * Chat Functionality for Gabriel AI
 * Handles message sending, receiving, and educational conversations
 */

// Chat state
let chatState = {
    isConnected: false,
    currentEndpoint: null,
    messageHistory: [],
    isTyping: false,
    conversationContext: []
};

/**
 * Test backend connection and set up API endpoint
 */
async function testBackendConnection() {
    updateStatus('🔄 Connecting to educational services...', 'connecting');
    
    const endpoints = [
        APP_CONFIG.apiEndpoints.production,
        APP_CONFIG.apiEndpoints.development
    ];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`Testing connection to: ${endpoint}`);
            
            const response = await fetch(`${endpoint}/qa/process`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    question: 'Connection test',
                    context: 'system_check'
                }),
                timeout: 5000
            });
            
            if (response.ok) {
                chatState.isConnected = true;
                chatState.currentEndpoint = endpoint;
                appState.connectionStatus = 'connected';
                
                const endpointType = endpoint.includes('localhost') ? 'Local' : 'Cloud';
                updateStatus(`✅ Connected to ${endpointType} Educational Services`, 'working');
                
                console.log(`✅ Successfully connected to ${endpointType} backend`);
                
                // Send welcome message confirming connection
                setTimeout(() => {
                    addMessageToChat(
                        `🎓 Educational services are online! I'm ready to help you explore learning opportunities, discover your strengths, and guide your educational journey. What would you like to learn about today?`,
                        'assistant'
                    );
                }, 1000);
                
                return;
            }
        } catch (error) {
            console.log(`❌ Failed to connect to ${endpoint}:`, error.message);
        }
    }
    
    // All endpoints failed - use demo mode
    chatState.isConnected = false;
    appState.connectionStatus = 'offline';
    updateStatus('📚 Demo Mode - Educational guidance available', 'info');
    
    setTimeout(() => {
        addMessageToChat(
            `📚 Welcome to PMERIT! I'm in demo mode while educational services are being optimized. I can still help you explore our learning approach, discuss educational strategies, and guide you toward your goals. What interests you most about learning?`,
            'assistant'
        );
    }, 1000);
}

/**
 * Send message to AI backend or provide demo response
 */
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Validate message length
    if (message.length > 1000) {
        updateStatus('❌ Message too long (max 1000 characters)', 'error');
        return;
    }
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    input.value = '';
    updateWordCount();
    
    // Store message in history
    chatState.messageHistory.push({ role: 'user', content: message });
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        let aiResponse;
        
        if (chatState.isConnected && chatState.currentEndpoint) {
            // Try backend connection
            aiResponse = await getAIResponse(message);
        } else {
            // Use demo mode
            aiResponse = getDemoResponse(message);
        }
        
        // Hide typing indicator
        hideTypingIndicator();
        
        // Add AI response
        addMessageToChat(aiResponse, 'assistant');
        
        // Store AI response in history
        chatState.messageHistory.push({ role: 'assistant', content: aiResponse });
        
        // Text-to-speech if enabled
        if (appState.textToSpeech) {
            speakMessage(aiResponse);
        }
        
    } catch (error) {
        hideTypingIndicator();
        console.error('Chat error:', error);
        
        // Fallback to demo response
        const fallbackResponse = getDemoResponse(message);
        addMessageToChat(fallbackResponse, 'assistant');
        
        updateStatus('⚠️ Using offline mode', 'warning');
    }
}

/**
 * Get AI response from backend
 */
async function getAIResponse(message) {
    const requestData = {
        question: message,
        context: chatState.conversationContext.slice(-5), // Last 5 exchanges for context
        user_preferences: {
            language: appState.language,
            learning_style: appState.learningStyle || 'adaptive'
        }
    };
    
    const response = await fetch(`${chatState.currentEndpoint}/qa/process`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}`);
    }
    
    const data = await response.json();
    
    // Update conversation context
    chatState.conversationContext.push({
        user: message,
        assistant: data.answer || data.response
    });
    
    return data.answer || data.response || 'I apologize, but I didn\'t receive a proper response. Could you try rephrasing your question?';
}

/**
 * Generate educational demo responses
 */
function getDemoResponse(message) {
    const msg = message.toLowerCase();
    
    // Learning and education focused responses
    if (msg.includes('learn') || msg.includes('study') || msg.includes('education')) {
        return `🎓 Excellent question about learning! At PMERIT, we believe education should be:\n\n✨ **Accessible** - Available to everyone, regardless of background\n🎯 **Personalized** - Adapted to your unique learning style\n🚀 **Practical** - Focused on skills you can apply immediately\n\nWe offer guidance in Technology, Business, and Creative fields. What area interests you most, or would you like to take a quick assessment to discover your ideal learning path?`;
    }
    
    if (msg.includes('course') || msg.includes('subject') || msg.includes('topic')) {
        return `📚 Our learning tracks are designed to build real-world capabilities:\n\n🚀 **Technology Track**: Web development, cloud computing, data analysis\n💼 **Business Track**: Project management, digital skills, entrepreneurship\n🎨 **Creative Track**: Design, content creation, digital marketing\n\nEach track includes interactive projects and community support. Which area aligns with your interests or career goals?`;
    }
    
    if (msg.includes('career') || msg.includes('job') || msg.includes('work') || msg.includes('opportunity')) {
        return `💼 Education opens doors to countless opportunities! Rather than promising specific salaries, we focus on:\n\n🎯 **Skill Development** - Building capabilities that employers value\n🌐 **Remote Work Readiness** - Preparing you for location-independent careers\n🤝 **Professional Networks** - Connecting you with mentors and peers\n📈 **Continuous Growth** - Lifelong learning strategies\n\nWhat type of work environment or role interests you most?`;
    }
    
    if (msg.includes('assess') || msg.includes('test') || msg.includes('personality') || msg.includes('skill')) {
        return `🧠 Assessments help us understand how you learn best! Our evaluations include:\n\n🎯 **Learning Style Assessment** - Visual, auditory, kinesthetic preferences\n💡 **Interest Profiler** - Subjects that naturally engage you\n⚡ **Skills Evaluation** - Current abilities and growth areas\n🚀 **Goal Setting Workshop** - Defining your educational objectives\n\nThese tools help create a personalized learning journey. Which assessment interests you most?`;
    }
    
    if (msg.includes('help') || msg.includes('support') || msg.includes('guidance')) {
        return `🤝 I'm here to support your educational journey! I can help with:\n\n📋 **Learning Path Guidance** - Finding the right courses for your goals\n🎯 **Study Strategies** - Effective learning techniques and time management\n💡 **Skill Assessment** - Identifying strengths and areas for improvement\n🌟 **Motivation Support** - Staying engaged and overcoming challenges\n🔗 **Resource Recommendations** - Additional materials and tools\n\nWhat specific aspect of learning would you like guidance on?`;
    }
    
    if (msg.includes('mission') || msg.includes('about') || msg.includes('pmerit')) {
        return `🌟 **PMERIT's Mission**: ${APP_CONFIG.mission}\n\nWe're committed to breaking down barriers that limit educational access. Through innovative technology and personalized guidance, we help learners:\n\n✨ Discover their unique potential\n🎯 Develop practical, valuable skills\n🚀 Create their own opportunities\n🤝 Build supportive learning communities\n\nEducation isn't about quick promises - it's about empowering you with knowledge, confidence, and the tools to shape your own future. How can we support your learning goals?`;
    }
    
    if (msg.includes('cost') || msg.includes('price') || msg.includes('free') || msg.includes('money')) {
        return `💝 Education should never be limited by financial barriers! Our approach:\n\n🆓 **Core Learning** - Fundamental courses and guidance available to all\n🌍 **Community Support** - Peer networks and collaborative learning\n🎓 **Skill-Based Progress** - Focus on competency, not payment\n✨ **Opportunity Access** - Connections to internships and projects\n\nOur mission is empowerment through knowledge, not profit. What learning goals can we help you achieve, regardless of your current financial situation?`;
    }
    
    if (msg.includes('time') || msg.includes('schedule') || msg.includes('pace')) {
        return `⏰ Learning fits into YOUR life! Our flexible approach includes:\n\n🎯 **Self-Paced Learning** - Study when it works for you\n📱 **Micro-Learning** - Short, focused sessions that fit busy schedules\n🔄 **Adaptive Scheduling** - Adjusting to your commitments\n📊 **Progress Tracking** - Celebrating small wins along the way\n\nWhether you have 15 minutes or 2 hours, we can design a learning approach that works. What's your current schedule like?`;
    }
    
    if (msg.includes('motivation') || msg.includes('confidence') || msg.includes('difficult') || msg.includes('struggle')) {
        return `💪 Every learner faces challenges - that's part of growth! Remember:\n\n🌱 **Progress over Perfection** - Small steps lead to big changes\n🤝 **Community Support** - You're not learning alone\n🎯 **Personalized Approach** - Learning that fits YOUR style\n✨ **Celebrating Wins** - Acknowledging every achievement\n\nEducation is a journey, not a race. What specific learning challenge can we work through together?`;
    }
    
    // Default educational response
    return `🎓 That's a thoughtful question! I'm here to help you navigate your educational journey. Whether you're interested in:\n\n📚 Exploring new subjects and skills\n🎯 Finding your optimal learning style\n🚀 Setting and achieving educational goals\n🤝 Connecting with learning communities\n💡 Developing problem-solving abilities\n\nI can provide guidance tailored to your interests and needs. What aspect of learning would you like to explore together?`;
}

/**
 * Add message to chat interface
 */
function addMessageToChat(message, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    if (sender === 'user') {
        messageContent.innerHTML = `<strong>You:</strong> ${escapeHtml(message)}`;
    } else {
        // Process markdown-style formatting for assistant messages
        const formattedMessage = formatAssistantMessage(message);
        messageContent.innerHTML = `<strong>Gabriel AI:</strong> ${formattedMessage}`;
    }
    
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add animation
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    
    requestAnimationFrame(() => {
        messageDiv.style.transition = 'all 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    });
}

/**
 * Format assistant messages with basic markdown support
 */
function formatAssistantMessage(message) {
    return escapeHtml(message)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    if (document.querySelector('.typing-indicator')) return;
    
    chatState.isTyping = true;
    const messagesContainer = document.getElementById('chat-messages');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = `
        <span>Gabriel AI is thinking</span>
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Hide typing indicator
 */
function hideTypingIndicator() {
    chatState.isTyping = false;
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * Text-to-speech functionality
 */
function speakMessage(message) {
    if (!('speechSynthesis' in window)) return;
    
    // Clean message for speech (remove formatting)
    const cleanMessage = message
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/🎓|📚|🚀|💼|🎨|🎯|✨|🤝|💡|📊|⚡|🌟|💝|🆓|🌍|⏰|📱|🔄|💪|🌱/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanMessage);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    // Use appropriate voice for language
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
        voice.lang.startsWith(appState.language) && voice.name.includes('Female')
    ) || voices.find(voice => voice.lang.startsWith('en'));
    
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }
    
    speechSynthesis.speak(utterance);
}

/**
 * Clear chat history
 */
function clearChat() {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML = '';
    chatState.messageHistory = [];
    chatState.conversationContext = [];
    
    // Add welcome message
    addMessageToChat(
        'Chat cleared! How can I help you with your learning journey today?',
        'assistant'
    );
}

/**
 * Export chat history
 */
function exportChatHistory() {
    const chatData = {
        timestamp: new Date().toISOString(),
        messages: chatState.messageHistory,
        userPreferences: {
            language: appState.language,
            darkMode: appState.darkMode
        }
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `pmerit-chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    updateStatus('💾 Chat history exported', 'info');
}

// Initialize chat system
document.addEventListener('DOMContentLoaded', function() {
    // Initialize chat connection
    testBackendConnection();
    
    // Add initial welcome based on time of day
    const hour = new Date().getHours();
    let greeting = '🌟 Welcome to PMERIT!';
    
    if (hour < 12) {
        greeting = '🌅 Good morning! Welcome to PMERIT!';
    } else if (hour < 17) {
        greeting = '☀️ Good afternoon! Welcome to PMERIT!';
    } else {
        greeting = '🌙 Good evening! Welcome to PMERIT!';
    }
    
    setTimeout(() => {
        if (document.getElementById('chat-messages').children.length === 0) {
            addMessageToChat(
                `${greeting} I'm Gabriel, your AI learning guide. I'm here to help you discover educational opportunities and develop your potential. What would you like to explore today?`,
                'assistant'
            );
        }
    }, 2000);
});

// Export functions for global access
window.sendMessage = sendMessage;
window.addMessageToChat = addMessageToChat;
window.testBackendConnection = testBackendConnection;
window.clearChat = clearChat;
window.exportChatHistory = exportChatHistory;
