let authState = {
    isLoggedIn: false,
    currentUser: null,
    sessionToken: null
};

function showLogin() {
    console.log('Login functionality coming soon!');
    updateStatus('🔐 Login system in development', 'info');
    
    if (typeof addMessageToChat === 'function') {
        addMessageToChat(
            '🔐 User authentication system is being developed! For now, you can explore all our educational features without an account. Full user profiles and progress tracking will be available soon.',
            'assistant'
        );
    }
}

function showRegister() {
    console.log('Registration functionality coming soon!');
    updateStatus('📝 Registration system in development', 'info');
    
    if (typeof addMessageToChat === 'function') {
        addMessageToChat(
            '📝 User registration is coming soon! Currently, you can explore our learning platform, take assessments, and chat with Gabriel AI without creating an account. We\'re building a comprehensive user system with progress tracking and personalized learning paths.',
            'assistant'
        );
    }
}

async function handleLogin(credentials) {
    console.log('Login attempt:', credentials);
    return { success: false, message: 'Authentication system in development' };
}

async function handleRegistration(userData) {
    console.log('Registration attempt:', userData);
    return { success: false, message: 'Registration system in development' };
}

function checkAuthStatus() {
    const token = localStorage.getItem('auth_token');
    if (token) {
        authState.sessionToken = token;
        authState.isLoggedIn = true;
    }
    
    return authState.isLoggedIn;
}

function logout() {
    authState.isLoggedIn = false;
    authState.currentUser = null;
    authState.sessionToken = null;
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    updateStatus('👋 Logged out successfully', 'info');
}

document.addEventListener('DOMContent 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.avatar-icon {
    font-size: 2rem;
    color: white;
}

.quick-actions {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    cursor: pointer;
}

.sidebar-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
}

.sidebar-item {
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 10px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.sidebar-item:hover {
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102,126,234,0.2);
}

.sidebar-item.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.sidebar-item .icon {
    font-size: 1.2rem;
}

.sidebar-item .label {
    font-size: 0.8rem;
    font-weight: 600;
}

.chat-container {
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(10px);
    border-radius: var(--border-radius);
    box-shadow: var(--card-shadow);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.chat-header {
    background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1));
    padding: 2rem;
    text-align: center;
    border-bottom: 1px solid #e9ecef;
}

.chat-header h1 {
    font-size: 2rem;
    font-weight: bold;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

.chat-header p {
    color: var(--text-secondary);
    font-size: 1rem;
}

.chat-messages {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    background: #fafafa;
    min-height: 300px;
}

.chat-input-area {
    padding: 1rem 1.5rem;
    background: white;
    border-top: 1px solid #e9ecef;
    display: flex;
    gap: 1rem;
    align-items: center;
}

.chat-input {
    flex: 1;
    padding: 1rem;
    border: 2px solid #e9ecef;
    border-radius: 25px;
    outline: none;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.chat-input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
}

.send-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: all 0.3s ease;
}

.send-btn:hover {
    background: var(--secondary-color);
    transform: scale(1.05);
}

.chat-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-top: 1px solid #f0f0f0;
    background: white;
}

.control-btn {
    background: none;
    border: 1px solid #e9ecef;
    border-radius: 20px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.3s ease;
    color: var(--text-secondary);
}

.control-btn:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    background: rgba(102,126,234,0.05);
}

.word-count {
    font-size: 0.8rem;
    color: var(--text-secondary);
}

.panel-header {
    margin-bottom: 1.5rem;
    text-align: center;
}

.panel-header h3 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

.panel-header p {
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.assessment-cards {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.assessment-card {
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 1.2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
}

.assessment-card:hover {
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102,126,234,0.15);
}

.card-icon {
    font-size: 2rem;
    margin-bottom: 0.8rem;
}

.assessment-card h4 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
    font-size: 1rem;
}

.assessment-card p {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 0.8rem;
    line-height: 1.4;
}

.card-action {
    font-size: 0.8rem;
    color: var(--primary-color);
    font-weight: 600;
}

.status-indicator {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--warning-color);
    color: white;
    padding: 10px 20px;
    border-radius: 25px;
    font-size: 0.9rem;
    box-shadow: 0 4px 15px rgba(255,152,0,0.3);
    z-index: 1001;
    transition: all 0.3s ease;
}

.status-indicator.working {
    background: var(--success-color);
}

.status-indicator.connecting {
    background: var(--warning-color);
}

.status-indicator.error {
    background: var(--error-color);
}

.message {
    margin-bottom: 1.5rem;
    display: flex;
    animation: fadeInUp 0.3s ease;
}

.message.user {
    justify-content: flex-end;
}

.message.assistant {
    justify-content: flex-start;
}

.message-content {
    background: white;
    padding: 1rem 1.2rem;
    border-radius: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    max-width: 80%;
    font-size: 0.95rem;
    line-height: 1.5;
}

.message.user .message-content {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

body.dark-mode {
    --text-primary: #e0e0e0;
    --text-secondary: #b0b0b0;
    --bg-light: #2c3e50;
}

body.dark-mode .sidebar,
body.dark-mode .right-sidebar,
body.dark-mode .chat-container {
    background: rgba(44,62,80,0.95);
    color: var(--text-primary);
}

body.dark-mode .sidebar-item,
body.dark-mode .assessment-card {
    background: #34495e;
    border-color: #4a5f7a;
}
