/**
 * Gabriel AI Educational Platform - Chat Module
 * Handles message sending, receiving, and educational conversations
 */

// Chat state
let chatState = {
    isInitialized: false,
    conversationHistory: [],
    isTyping: false
};

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeChat();
});

/**
 * Chat Initialization
 */
function initializeChat() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');

    if (!chatInput || !sendButton || !chatMessages) {
        console.warn('⚠️ Chat elements not found');
        return;
    }

    // Send message on button click
    sendButton.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Character counter
    chatInput.addEventListener('input', updateCharacterCount);
    
    chatState.isInitialized = true;
    console.log('✅ Chat system initialized');
}

/**
 * Send Message
 */
function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message || chatState.isTyping) return;
    
    // Add user message to chat
    addMessage('user', message);
    
    // Clear input
    chatInput.value = '';
    updateCharacterCount();
    
    // Save to history
    chatState.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date()
    });
    
    // Show typing indicator and generate response
    showTypingIndicator();
    
    setTimeout(() => {
        const response = generateEducationalResponse(message);
        hideTypingIndicator();
        addMessage('ai', response);
        
        // Save AI response to history
        chatState.conversationHistory.push({
            role: 'ai',
            content: response,
            timestamp: new Date()
        });
    }, 1500 + Math.random() * 1000); // Variable response time
}

/**
 * Add Message to Chat
 */
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
    
    // Auto-scroll to bottom
    scrollToBottom();
}

/**
 * Educational Response Generator
 */
function generateEducationalResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Educational topics and responses
    if (message.includes('course') || message.includes('learn') || message.includes('study')) {
        return `🎓 I'd love to help you explore learning opportunities! We offer courses in Technology (Web Development, Data Science, AI), Business (Entrepreneurship, Digital Marketing), and Creative fields (Design, Content Creation). What area interests you most? I can guide you toward the perfect learning path for your goals.`;
    }
    
    if (message.includes('career') || message.includes('job') || message.includes('work')) {
        return `💼 Great question about career development! Our mission is to empower you with valuable skills that open doors to opportunities. Rather than promising specific outcomes, I focus on helping you build strong foundations in technology, business, or creative fields. What skills would you like to develop? Let's create a learning plan that aligns with your interests and goals.`;
    }
    
    if (message.includes('skill') || message.includes('ability') || message.includes('talent')) {
        return `🌟 Discovering and developing your skills is exciting! Everyone has unique strengths and potential. I can help you identify your learning style, explore different subjects, and build expertise step by step. Would you like to start with a learning style assessment or explore specific skill areas?`;
    }
    
    if (message.includes('assessment') || message.includes('test') || message.includes('evaluate')) {
        return `📊 Our assessments are designed to help you understand yourself better as a learner! We offer personality assessments, learning style evaluations, and interest profilers. These tools help us personalize your educational journey. Which type of assessment interests you most?`;
    }
    
    if (message.includes('technology') || message.includes('coding') || message.includes('programming')) {
        return `💻 Technology skills are incredibly valuable in today's world! We offer comprehensive courses in web development, data science, artificial intelligence, and more. Our approach focuses on practical, hands-on learning that builds real expertise. Would you like to start with programming fundamentals or explore a specific technology area?`;
    }
    
    if (message.includes('business') || message.includes('entrepreneur') || message.includes('startup')) {
        return `🚀 Entrepreneurship and business skills can transform your future! Our business track covers digital marketing, e-commerce, financial literacy, and startup fundamentals. We focus on practical skills that help you create value and opportunities. What aspect of business interests you most?`;
    }
    
    if (message.includes('creative') || message.includes('design') || message.includes('art')) {
        return `🎨 Creativity is a powerful force for personal and professional growth! Our creative track includes graphic design, content creation, digital marketing, and multimedia production. These skills are highly valued across many industries. What type of creative work excites you?`;
    }
    
    if (message.includes('help') || message.includes('support') || message.includes('guidance')) {
        return `🤝 I'm here to provide personalized educational guidance! I can help you explore courses, understand your learning style, set educational goals, and create a customized learning path. Think of me as your educational companion, here to support your growth journey. What would you like to explore first?`;
    }
    
    if (message.includes('free') || message.includes('cost') || message.includes('price')) {
        return `💝 Education should be accessible to everyone! We're committed to providing high-quality learning opportunities. Many of our foundational courses and assessments are available at no cost, especially for learners in underserved communities. Our mission is to break down barriers to education. What subjects would you like to explore?`;
    }
    
    if (message.includes('time') || message.includes('schedule') || message.includes('pace')) {
        return `⏰ Learning should fit your life, not the other way around! Our platform is designed for flexible, self-paced learning. Whether you have 30 minutes a day or several hours, we can create a learning schedule that works for you. Consistency matters more than intensity. How much time would you like to dedicate to learning each week?`;
    }
    
    if (message.includes('goal') || message.includes('objective') || message.includes('aim')) {
        return `🎯 Setting clear learning goals is crucial for success! I can help you define both short-term objectives (like completing a course) and long-term aspirations (like changing careers or starting a business). Goals give direction to your learning journey. What would you like to achieve through education?`;
    }
    
    // Default educational response
    return `🎓 Thank you for your question! I'm Gabriel AI, your educational guide at PMERIT. Our mission is to provide accessible, high-quality education that empowers learners to discover their potential. I'm here to help you explore courses, understand your learning style, and create a personalized educational journey. What would you like to learn about today? Feel free to ask about our Technology, Business, or Creative tracks!`;
}

/**
 * Typing Indicator
 */
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

/**
 * Character Counter
 */
function updateCharacterCount() {
    const chatInput = document.getElementById('chatInput');
    const charCountElement = document.querySelector('.char-count');
    
    if (chatInput && charCountElement) {
        const count = chatInput.value.length;
        charCountElement.textContent = `${count}/1000`;
        
        // Change styling based on character count
        charCountElement.className = 'char-count';
        if (count > 900) {
            charCountElement.classList.add('danger');
        } else if (count > 800) {
            charCountElement.classList.add('warning');
        }
    }
}

/**
 * Utility Functions
 */
function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
        chatState.conversationHistory = [];
    }
}

// Export chat module functions
window.chatModule = {
    addMessage,
    sendMessage,
    clearChat,
    generateEducationalResponse,
    conversationHistory: () => chatState.conversationHistory
};

console.log('💬 Gabriel AI Chat Module - Ready!');

// Enhanced chat functionality with backend integration
async function sendMessageWithBackend() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message || chatState.isTyping) return;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    
    // Clear input
    input.value = '';
    updateWordCount();
    
    // Save to history
    chatState.messageHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date()
    });
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Try backend API first
        const isConnected = await checkBackendConnection();
        let response;
        
        if (isConnected) {
            // Use backend API
            const apiResponse = await API.chat.sendMessage(message, chatState.conversationContext);
            response = apiResponse.answer || apiResponse.response || generateEducationalResponse(message);
        } else {
            // Fallback to local responses
            response = generateEducationalResponse(message);
        }
        
        hideTypingIndicator();
        addMessageToChat(response, 'assistant');
        
        // Save AI response to history
        chatState.messageHistory.push({
            role: 'assistant',
            content: response,
            timestamp: new Date()
        });
        
        // Update conversation context
        chatState.conversationContext.push({
            user: message,
            assistant: response
        });
        
    } catch (error) {
        console.error('Chat error:', error);
        hideTypingIndicator();
        
        // Fallback to local response
        const fallbackResponse = generateEducationalResponse(message);
        addMessageToChat(fallbackResponse, 'assistant');
    }
}

// Override the original sendMessage function
if (typeof sendMessage !== 'undefined') {
    window.originalSendMessage = sendMessage;
    window.sendMessage = sendMessageWithBackend;
}
