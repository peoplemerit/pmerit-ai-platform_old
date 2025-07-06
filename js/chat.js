let chatState = {
    isConnected: false,
    currentEndpoint: null,
    messageHistory: [],
    isTyping: false,
    conversationContext: []
};

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        testBackendConnection();
        displayWelcomeMessage();
    }, 1000);
});

async function testBackendConnection() {
    updateStatus('🔄 Testing educational services...', 'connecting');
    
    const endpoints = [
        APP_CONFIG.apiEndpoints.production,
        APP_CONFIG.apiEndpoints.development
    ];
    
    for (const endpoint of endpoints) {
        try {
            const response = await fetch(`${endpoint}/health`, {
                method: 'GET',
                timeout: 5000
            });
            
            if (response.ok) {
                chatState.isConnected = true;
                chatState.currentEndpoint = endpoint;
                appState.connectionStatus = 'connected';
                
                const endpointType = endpoint.includes('localhost') ? 'Local' : 'Cloud';
                updateStatus(`✅ Connected to ${endpointType} Educational Services`, 'working');
                return;
            }
        } catch (error) {
            console.log(`Connection failed: ${endpoint}`);
        }
    }
    
    chatState.isConnected = false;
    appState.connectionStatus = 'offline';
    updateStatus('📚 Demo Mode - Educational guidance available', 'info');
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message || message.length > 1000) {
        if (message.length > 1000) {
            updateStatus('❌ Message too long (max 1000 characters)', 'error');
        }
        return;
    }
    
    addMessageToChat(message, 'user');
    input.value = '';
    updateWordCount();
    
    chatState.messageHistory.push({ role: 'user', content: message });
    
    showTypingIndicator();
    
    try {
        let aiResponse;
        
        if (chatState.isConnected && chatState.currentEndpoint) {
            aiResponse = await getAIResponse(message);
        } else {
            aiResponse = getDemoResponse(message);
        }
        
        hideTypingIndicator();
        addMessageToChat(aiResponse, 'assistant');
        chatState.messageHistory.push({ role: 'assistant', content: aiResponse });
        
        if (appState.textToSpeech) {
            speakMessage(aiResponse);
        }
        
    } catch (error) {
        hideTypingIndicator();
        console.error('Chat error:', error);
        
        const fallbackResponse = getDemoResponse(message);
        addMessageToChat(fallbackResponse, 'assistant');
        updateStatus('⚠️ Using offline mode', 'warning');
    }
}

async function getAIResponse(message) {
    const requestData = {
        question: message,
        context: chatState.conversationContext.slice(-5),
        user_preferences: {
            language: appState.language,
            learning_style: 'adaptive'
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
    
    chatState.conversationContext.push({
        user: message,
        assistant: data.answer || data.response
    });
    
    return data.answer || data.response || 'I apologize, but I didn\'t receive a proper response. Could you try rephrasing your question?';
}

function getDemoResponse(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('learn') || msg.includes('study') || msg.includes('education')) {
        return `🎓 Great question about learning! At PMERIT, we focus on accessible, personalized education that adapts to your unique needs and goals.\n\n✨ **Our Approach:**\n• Self-paced learning that fits your schedule\n• AI-guided tutoring and support\n• Hands-on projects and real-world applications\n• Community learning and peer collaboration\n\nWhat specific area would you like to explore? Technology, Business, or Creative fields?`;
    }
    
    if (msg.includes('course') || msg.includes('subject') || msg.includes('topic')) {
        return `📚 Our learning paths are designed for practical skill development:\n\n🚀 **Technology Track**: Web development, cloud computing, data analysis\n💼 **Business Track**: Project management, digital skills, entrepreneurship\n🎨 **Creative Track**: Design, content creation, digital marketing\n\nEach track includes interactive projects, mentorship, and community support. Which area aligns with your interests?`;
    }
    
    if (msg.includes('career') || msg.includes('job') || msg.includes('opportunity')) {
        return `💼 Education opens doors to opportunities! We focus on:\n\n🎯 **Skill Development** - Building capabilities that create value\n🌐 **Adaptability** - Learning to thrive in changing environments\n🤝 **Professional Growth** - Networking and collaboration skills\n📈 **Continuous Learning** - Staying current with industry trends\n\nRather than promising specific outcomes, we empower you with knowledge and skills. What type of career path interests you?`;
    }
    
    if (msg.includes('assess') || msg.includes('test') || msg.includes('evaluation')) {
        return `🧠 Assessments help personalize your learning journey! Our evaluations include:\n\n🎯 **Learning Style Assessment** - How you absorb information best\n💡 **Interest Profiler** - Subjects that naturally engage you\n⚡ **Skills Evaluation** - Current abilities and growth areas\n🚀 **Goal Setting** - Defining your educational objectives\n\nThese tools help create a learning path tailored to you. Which assessment interests you most?`;
    }
    
    if (msg.includes('help') || msg.includes('support') || msg.includes('guidance')) {
        return `🤝 I'm here to support your educational journey! I can help with:\n\n📋 **Learning Guidance** - Finding courses that match your goals\n🎯 **Study Strategies** - Effective learning techniques\n💡 **Skill Development** - Identifying and building capabilities\n🌟 **Motivation** - Staying engaged and overcoming challenges\n🔗 **Resources** - Additional materials and tools\n\nWhat specific support do you need today?`;
    }
    
    if (msg.includes('mission') || msg.includes('about') || msg.includes('pmerit')) {
        return `🌟 **PMERIT's Mission**: ${APP_CONFIG.mission}\n\nWe're dedicated to breaking down barriers that limit educational access. Through innovative AI and personalized guidance, we help learners:\n\n✨ Discover their unique potential and interests\n🎯 Develop practical, valuable skills\n🚀 Create opportunities for growth and success\n🤝 Build supportive learning communities\n\nEducation is about empowerment through knowledge. How can we support your learning goals?`;
    }
    
    return `🎓 That's a thoughtful question! I'm here to help you navigate your educational journey.\n\nI can assist with:\n📚 Exploring subjects and learning opportunities\n🎯 Finding your optimal learning approach\n🚀 Setting and achieving educational goals\n🤝 Connecting with learning communities\n💡 Developing problem-solving skills\n\nWhat aspect of learning would you like to explore together?`;
}

function addMessageToChat(message, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    if (sender === 'user') {
        messageContent.innerHTML = `<strong>You:</strong> ${escapeHtml(message)}`;
    } else {
        const formattedMessage = formatAssistantMessage(message);
        messageContent.innerHTML = `<strong>Gabriel AI:</strong> ${formattedMessage}`;
    }
    
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function formatAssistantMessage(message) {
    return escapeHtml(message)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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

function hideTypingIndicator() {
    chatState.isTyping = false;
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function displayWelcomeMessage() {
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
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer && messagesContainer.children.length === 0) {
            addMessageToChat(
                `${greeting} I'm Gabriel, your AI learning guide. I'm here to help you discover educational opportunities and develop your potential through accessible, high-quality learning experiences. What would you like to explore today?`,
                'assistant'
            );
        }
    }, 2000);
}

function speakMessage(message) {
    if (!('speechSynthesis' in window)) return;
    
    const cleanMessage = message
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/🎓|📚|🚀|💼|🎨|🎯|✨|🤝|💡|📊|⚡|🌟|💝|🆓|🌍|⏰|📱|🔄|💪|🌱/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanMessage);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
        voice.lang.startsWith(appState.language) && voice.name.includes('Female')
    ) || voices.find(voice => voice.lang.startsWith('en'));
    
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }
    
    speechSynthesis.speak(utterance);
}

window.sendMessage = sendMessage;
window.addMessageToChat = addMessageToChat;
window.testBackendConnection = testBackendConnection;

console.log('✅ Chat functionality loaded');
