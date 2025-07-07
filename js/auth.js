let authState = {
    isAuthenticated: false,
    user: null,
    sessionToken: null
};

document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    checkExistingSession();
    initializeAuthButtons();
    console.log('🔐 Authentication module initialized');
}

function checkExistingSession() {
    const savedSession = localStorage.getItem('gabriel_session');
    if (savedSession) {
        try {
            const sessionData = JSON.parse(savedSession);
            console.log('📱 Found existing session data');
        } catch (e) {
            console.log('⚠️ Invalid session data found, clearing...');
            localStorage.removeItem('gabriel_session');
        }
    }
}

function initializeAuthButtons() {
    const signInBtn = document.querySelector('.btn-signin');
    const startLearningBtn = document.querySelector('.btn-primary');
    
    if (signInBtn) {
        signInBtn.addEventListener('click', handleSignIn);
    }
    
    if (startLearningBtn) {
        startLearningBtn.addEventListener('click', handleStartLearning);
    }
}

function handleSignIn() {
    if (window.chatModule && window.chatModule.addMessage) {
        window.chatModule.addMessage('ai', '🔐 Sign in functionality is coming soon! We\'re building a secure authentication system. For now, you can explore our educational content and assessments without signing in.');
    } else {
        alert('Sign in functionality coming soon!');
    }
    
    console.log('🔐 Sign in clicked');
}

function handleStartLearning() {
    if (window.chatModule && window.chatModule.addMessage) {
        window.chatModule.addMessage('ai', '🚀 Welcome to your learning journey! I\'m excited to help you discover your potential. Let\'s start by understanding your interests and goals. What would you like to learn about? You can also try our assessments in the right sidebar to get personalized recommendations!');
    } else {
        console.log('🚀 Start learning clicked');
    }
    
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
        chatContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

window.authModule = {
    handleSignIn,
    handleStartLearning
};

console.log('🔐 Gabriel AI Auth Module - Ready!');
