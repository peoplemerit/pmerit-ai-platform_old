/**
 * PMERIT Gabriel AI - Main Application Logic
 */

// Update connection status
function updateConnectionStatus(message, type) {
    const statusEl = document.getElementById('connection-status');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = `connection-status ${type}`;
    }
    console.log(`📡 Status: ${message} (${type})`);
}

// Add message to chat
function addMessageToChat(message, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    if (sender === 'user') {
        messageDiv.innerHTML = `<strong>You:</strong> ${message}`;
    } else {
        messageDiv.innerHTML = `<strong>Gabriel AI:</strong> ${message}`;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Handle user input
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

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎯 Initializing PMERIT Gabriel AI...');
    
    // Test connection
    const isConnected = await testBackendConnection();
    
    if (isConnected) {
        console.log('✅ Gabriel AI is ready!');
    } else {
        console.log('❌ Gabriel AI connection failed!');
    }
    
    // Set up event listeners
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleUserMessage();
            }
        });
    }
    
    if (sendButton) {
        sendButton.addEventListener('click', handleUserMessage);
    }
    
    console.log('🚀 PMERIT System Ready!');
});
