/**
 * Gabriel AI Educational Platform - API Configuration
 * Local Development Environment with AI Integration
 */

// Environment Configuration
const ENV = {
    development: {
        apiUrl: 'https://gabriel-ai-backend.peoplemerit.workers.dev',
        timeout: 10000
    },
    production: {
        apiUrl: 'https://gabriel-ai-backend.peoplemerit.workers.dev',
        timeout: 15000
    }
};

// Current environment detection
const currentEnv = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'development' : 'production';
const config = ENV[currentEnv];

// API Configuration
const API_CONFIG = {
    baseUrl: config.apiUrl,
    processUrl: `${config.apiUrl}/qa/process`,
    statusUrl: `${config.apiUrl}/ai/status`,
    timeout: config.timeout,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'PMERIT-Gabriel-AI/1.0'
    }
};

console.log(`🚀 Gabriel AI Frontend - ${currentEnv} environment`);
console.log(`📡 API URL: ${API_CONFIG.baseUrl}`);

// Backend Connection Test
async function testBackendConnection() {
    try {
        console.log('🔍 Testing backend connection...');
        const response = await fetch(API_CONFIG.statusUrl, {
            method: 'GET',
            headers: API_CONFIG.headers
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend connected:', data);
            updateConnectionStatus('Connected to AI Educational Services', 'success');
            return true;
        } else {
            console.error('❌ Backend connection failed:', response.status);
            updateConnectionStatus(`Connection Error (${response.status})`, 'error');
            return false;
        }
    } catch (error) {
        console.error('❌ Backend connection error:', error);
        updateConnectionStatus('Connection Error - Check internet', 'error');
        return false;
    }
}

// Send Message to AI
async function sendMessage(message, userId = 'local-dev-user') {
    if (!message.trim()) return;
    
    console.log('📤 Sending message to AI:', message);
    updateConnectionStatus('Gabriel AI is thinking...', 'loading');
    
    try {
        const response = await fetch(API_CONFIG.processUrl, {
            method: 'POST',
            headers: API_CONFIG.headers,
            body: JSON.stringify({
                question: message,
                user_id: userId
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📥 AI response received:', data);
        
        if (data.success) {
            addMessageToChat(data.answer, 'assistant');
            updateConnectionStatus('Connected to AI Educational Services', 'success');
            return data.answer;
        } else {
            throw new Error(data.error || 'Failed to get AI response');
        }
        
    } catch (error) {
        console.error('Error sending message:', error);
        updateConnectionStatus('Connection Error - Please try again', 'error');
        addMessageToChat("I'm having trouble connecting right now. Please try again in a moment.", 'assistant');
        return null;
    }
}

// UI Helper Functions
function updateConnectionStatus(message, type) {
    const statusElement = document.querySelector('.connection-status') || 
                          document.getElementById('connection-status');
    
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `connection-status ${type}`;
    }
    
    console.log(`📡 Status: ${message} (${type})`);
}

function addMessageToChat(message, sender) {
    const messagesContainer = document.getElementById('chat-messages') || 
                              document.querySelector('.chat-messages');
    
    if (!messagesContainer) {
        console.error('❌ Chat messages container not found');
        return;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.style.marginBottom = '1rem';
    messageDiv.style.padding = '1rem';
    messageDiv.style.borderRadius = '10px';
    messageDiv.style.maxWidth = '80%';
    messageDiv.style.wordWrap = 'break-word';
    
    if (sender === 'user') {
        messageDiv.style.backgroundColor = '#667eea';
        messageDiv.style.color = 'white';
        messageDiv.style.marginLeft = 'auto';
        messageDiv.style.marginRight = '0';
        messageDiv.innerHTML = `<strong>You:</strong> ${message}`;
    } else {
        messageDiv.style.backgroundColor = '#f1f3f4';
        messageDiv.style.color = '#333';
        messageDiv.style.marginLeft = '0';
        messageDiv.style.marginRight = 'auto';
        messageDiv.innerHTML = `<strong>Gabriel AI:</strong> ${message}`;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎯 Initializing Gabriel AI Educational Platform...');
    
    // Test backend connection
    const isConnected = await testBackendConnection();
    
    if (isConnected) {
        console.log('✅ Gabriel AI backend is ready!');
    } else {
        console.log('❌ Gabriel AI backend connection failed!');
    }
    
    // Set up chat interface
    setupChatInterface();
});

function setupChatInterface() {
    console.log('🎮 Setting up chat interface...');
    
    // Chat input handler
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleUserMessage();
            }
        });
        console.log('✅ Chat input handler attached');
    } else {
        console.log('⚠️ Chat input not found');
    }
    
    // Send button handler
    const sendButton = document.getElementById('send-button') || 
                       document.querySelector('.send-button');
    if (sendButton) {
        sendButton.addEventListener('click', handleUserMessage);
        console.log('✅ Send button handler attached');
    } else {
        console.log('⚠️ Send button not found');
    }
}

function handleUserMessage() {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        const message = chatInput.value.trim();
        if (message) {
            addMessageToChat(message, 'user');
            sendMessage(message);
            chatInput.value = '';
        }
    }
}

// Export for global use
window.GabrielAI = {
    sendMessage,
    testBackendConnection,
    API_CONFIG,
    addMessageToChat,
    updateConnectionStatus
};

console.log('🚀 Gabriel AI API loaded successfully!');
