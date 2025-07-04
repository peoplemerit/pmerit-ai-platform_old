/**
 * PMERIT Gabriel AI - API Configuration
 * Working with existing modular structure
 */

// API Configuration
const API_CONFIG = {
    baseUrl: 'https://gabriel-ai-backend.peoplemerit.workers.dev',
    processUrl: 'https://gabriel-ai-backend.peoplemerit.workers.dev/qa/process',
    statusUrl: 'https://gabriel-ai-backend.peoplemerit.workers.dev/ai/status',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

console.log('🚀 Gabriel AI API loaded:', API_CONFIG.baseUrl);

// Test backend connection
async function testBackendConnection() {
    try {
        console.log('🔍 Testing Gabriel AI connection...');
        const response = await fetch(API_CONFIG.statusUrl, {
            method: 'GET',
            headers: API_CONFIG.headers
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Gabriel AI connected:', data);
            updateConnectionStatus('Connected to Gabriel AI Educational Services', 'success');
            return true;
        } else {
            console.error('❌ Connection failed:', response.status);
            updateConnectionStatus('Connection Error - Please try again', 'error');
            return false;
        }
    } catch (error) {
        console.error('❌ Connection error:', error);
        updateConnectionStatus('Connection Error - Check internet', 'error');
        return false;
    }
}

// Send message to AI
async function sendMessage(message, userId = 'pmerit_user') {
    if (!message.trim()) return;
    
    console.log('📤 Sending to Gabriel AI:', message);
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
        console.log('📥 Gabriel AI response:', data);
        
        if (data.success) {
            addMessageToChat(data.answer, 'assistant');
            updateConnectionStatus('Connected to Gabriel AI Educational Services', 'success');
            return data.answer;
        } else {
            throw new Error(data.error || 'Failed to get response');
        }
        
    } catch (error) {
        console.error('❌ Send message error:', error);
        updateConnectionStatus('Connection Error - Please try again', 'error');
        addMessageToChat("I'm having trouble connecting right now. Please try again.", 'assistant');
        return null;
    }
}

// Export for global use
window.GabrielAI = { sendMessage, testBackendConnection, API_CONFIG };
