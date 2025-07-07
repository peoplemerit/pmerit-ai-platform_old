let chatState = {
    isInitialized: false,
    conversationHistory: [],
    isTyping: false
};

document.addEventListener('DOMContentLoaded', function() {
    initializeChat();
});

function initializeChat() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');

    if (!chatInput || !sendButton || !chatMessages) {
        console.warn('⚠️ Chat elements not found');
        return;
    }

    sendButton.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    chatInput.addEventListener('input', updateCharacterCount);
    
    chatState.isInitialized = true;
    console.log('✅ Chat system initialized');
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message || chatState.isTyping) return;
    
    addMessage('user', message);
    
    chatInput.value = '';
    updateCharacterCount();
    
    chatState.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date()
    });
    
    showTypingIndicator();
    
    setTimeout(() => {
        const response = generateEducationalResponse(message);
        hideTypingIndicator();
        addMessage('ai', response);
        
        chatState.conversationHistory.push({
            role: 'ai',
            content: response,
            timestamp: new Date()
        });
    }, 1500 + Math.random() * 1000);
}

function addMessage(role, content) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    if (role === 'ai') {
        messageContent.innerHTML = `<strong>Gabriel AI:</strong> ${content}`;
    } else {
        messageContent.innerHTML = `<strong>You:</strong> ${content}`;
    }
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    scrollToBottom();
}

function generateEducationalResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('course') || message.includes('learn') || message.includes('study')) {
        return `🎓 I'd love to help you explore learning opportunities! We offer courses in Technology (Web Development, Data Science, AI), Business (Entrepreneurship, Digital Marketing), and Creative fields (Design, Content Creation). What area interests you most? I can guide you toward the perfect learning path for your goals.`;
    }
    
    if (message.includes('career') || message.includes('job') || message.includes('work')) {
        return `💼 Great question about career development! Our mission is to empower you with valuable skills that open doors to opportunities. Rather than promising specific outcomes, I focus on helping you build strong foundations in technology, business, or creative fields. What skills would you like to develop? Let's create a learning plan that aligns with your interests and goals.`;
    }
    
    if (message.includes('help') || message.includes('support') || message.includes('guidance')) {
        return `🤝 I'm here to provide personalized educational guidance! I can help you explore courses, understand your learning style, set educational goals, and create a customized learning path. Think of me as your educational companion, here to support your growth journey. What would you like to explore first?`;
    }
    
    return `🎓 Thank you for your question! I'm Gabriel AI, your educational guide at PMERIT. Our mission is to provide accessible, high-quality education that empowers learners to discover their potential. I'm here to help you explore courses, understand your learning style, and create a personalized educational journey. What would you like to learn about today? Feel free to ask about our Technology, Business, or Creative tracks!`;
}

function showTypingIndicator() {
    if (chatState.isTyping) return;
    
    chatState.isTyping = true;
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = '<strong>Gabriel AI:</strong> <span class="typing-dots">●●●</span>';
    
    typingDiv.appendChild(messageContent);
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    chatState.isTyping = false;
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function updateCharacterCount() {
    const chatInput = document.getElementById('chatInput');
    const charCountElement = document.querySelector('.char-count');
    
    if (chatInput && charCountElement) {
        const count = chatInput.value.length;
        charCountElement.textContent = `${count}/1000`;
        
        charCountElement.className = 'char-count';
        if (count > 900) {
            charCountElement.classList.add('danger');
        } else if (count > 800) {
            charCountElement.classList.add('warning');
        }
    }
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

window.chatModule = {
    addMessage,
    sendMessage,
    generateEducationalResponse,
    conversationHistory: () => chatState.conversationHistory
};

console.log('💬 Gabriel AI Chat Module - Ready!');
