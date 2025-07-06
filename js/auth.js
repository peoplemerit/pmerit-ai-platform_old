/**
 * Gabriel AI Educational Platform - Authentication Module
 * Handles user authentication and session management
 */

// Authentication state
let authState = {
    isAuthenticated: false,
    user: null,
    sessionToken: null
};

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

/**
 * Authentication Initialization
 */
function initializeAuth() {
    // Check for existing session
    checkExistingSession();
    
    // Initialize auth buttons
    initializeAuthButtons();
    
    console.log('🔐 Authentication module initialized');
}

/**
 * Check for Existing Session
 */
function checkExistingSession() {
    // For now, this is a placeholder
    // In a real implementation, you would check localStorage/sessionStorage
    // or make an API call to verify an existing session
    
    const savedSession = localStorage.getItem('gabriel_session');
    if (savedSession) {
        try {
            const sessionData = JSON.parse(savedSession);
            // Validate session data here
            console.log('📱 Found existing session data');
        } catch (e) {
            console.log('⚠️ Invalid session data found, clearing...');
            localStorage.removeItem('gabriel_session');
        }
    }
}

/**
 * Initialize Authentication Buttons
 */
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

/**
 * Handle Sign In
 */
function handleSignIn() {
    // For now, show a placeholder message
    // In a real implementation, this would open a login modal or redirect to login page
    
    if (window.chatModule && window.chatModule.addMessage) {
        window.chatModule.addMessage('ai', '🔐 Sign in functionality is coming soon! We\'re building a secure authentication system. For now, you can explore our educational content and assessments without signing in.');
    } else {
        alert('Sign in functionality coming soon!');
    }
    
    console.log('🔐 Sign in clicked');
}

/**
 * Handle Start Learning
 */
function handleStartLearning() {
    // For now, show an encouraging message
    // In a real implementation, this might start an onboarding flow
    
    if (window.chatModule && window.chatModule.addMessage) {
        window.chatModule.addMessage('ai', '🚀 Welcome to your learning journey! I\'m excited to help you discover your potential. Let\'s start by understanding your interests and goals. What would you like to learn about? You can also try our assessments in the right sidebar to get personalized recommendations!');
    } else {
        console.log('🚀 Start learning clicked');
    }
    
    // Scroll to chat to focus attention
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
        chatContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Placeholder Authentication Functions
 */
function login(email, password) {
    // Placeholder for login functionality
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate login
            authState.isAuthenticated = true;
            authState.user = { email: email, name: 'Student' };
            authState.sessionToken = 'placeholder_token';
            
            resolve(authState.user);
        }, 1000);
    });
}

function logout() {
    // Clear authentication state
    authState.isAuthenticated = false;
    authState.user = null;
    authState.sessionToken = null;
    
    // Clear any stored session data
    localStorage.removeItem('gabriel_session');
    
    console.log('🔐 User logged out');
}

function isAuthenticated() {
    return authState.isAuthenticated;
}

function getCurrentUser() {
    return authState.user;
}

// Export authentication functions
window.authModule = {
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    handleSignIn,
    handleStartLearning
};

console.log('🔐 Gabriel AI Auth Module - Ready!');

// Enhanced authentication functions for main page integration
function enhanceMainPageAuth() {
    const signInBtns = document.querySelectorAll('.btn-login');
    const startLearningBtns = document.querySelectorAll('.btn-register');
    
    // Update sign in buttons
    signInBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'signin.html';
        });
    });
    
    // Update start learning buttons
    startLearningBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if already authenticated
            const isAuthenticated = localStorage.getItem('isAuthenticated');
            if (isAuthenticated) {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'signin.html';
            }
        });
    });
    
    // Update header for authenticated users
    checkAndUpdateHeader();
}

function checkAndUpdateHeader() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userName = localStorage.getItem('userName');
    
    if (isAuthenticated && userName) {
        // Update navigation for authenticated users
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            navActions.innerHTML = `
                <button class="btn btn-pricing" onclick="window.location.href='dashboard.html'">📊 Dashboard</button>
                <span style="color: white; font-weight: 600;">Welcome, ${userName}!</span>
                <button class="btn btn-login" onclick="logout()">Logout</button>
            `;
        }
    }
}

function logout() {
    // Clear authentication data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    
    // Refresh page to update UI
    window.location.reload();
}

// Initialize enhanced auth when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        enhanceMainPageAuth();
    }
});
