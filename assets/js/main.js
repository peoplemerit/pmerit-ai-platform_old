/**
 * PMERIT Gabriel AI - Working Main Configuration
 */

// API Configuration
const API_CONFIG = {
    baseUrl: 'https://gabriel-ai-backend.peoplemerit.workers.dev',
    processUrl: 'https://gabriel-ai-backend.peoplemerit.workers.dev/qa/process',
    statusUrl: 'https://gabriel-ai-backend.peoplemerit.workers.dev/ai/status'
};

console.log('🚀 Gabriel AI Loading...', API_CONFIG.baseUrl);

// Simple message handler
async function sendMessage(message) {
    if (!message.trim()) return;
    
    console.log('📤 Sending:', message);
    
    try {
        const response = await fetch(API_CONFIG.processUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: message,
                user_id: 'pmerit_user'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Response:', data);
            updateConnectionStatus('Connected to Educational Services', 'success');
            return data.answer;
        } else {
            console.error('❌ Error:', response.status);
            updateConnectionStatus('Connection Error', 'error');
        }
    } catch (error) {
        console.error('❌ Fetch Error:', error);
        updateConnectionStatus('Connection Error', 'error');
    }
}

// Update connection status
function updateConnectionStatus(message, type) {
    const statusEl = document.querySelector('.connection-status');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = `connection-status ${type}`;
    }
    console.log(`📡 ${message}`);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 PMERIT Gabriel AI Initialized');
    updateConnectionStatus('Connected to Educational Services', 'success');
});

// Export for global use
window.GabrielAI = { sendMessage, API_CONFIG };
