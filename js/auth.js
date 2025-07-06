/**
 * Authentication Module for Gabriel AI
 * Handles user authentication and session management
 */

// Authentication state
let authState = {
    isLoggedIn: false,
    currentUser: null,
    sessionToken: null,
    loginAttempts: 0,
    lastLoginAttempt: null
};

/**
 * Check authentication status on page load
 */
function checkAuthStatus() {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
        try {
            authState.sessionToken = savedToken;
            authState.currentUser = JSON.parse(savedUser);
            authState.isLoggedIn = true;
            
            updateUIForAuthenticatedUser();
            updateStatus('✅ Welcome back!', 'info');
        } catch (error) {
            console.error('Error parsing saved user data:', error);
            clearAuthData();
        }
    }
}

/**
 * Handle user login
 */
async function handleLogin(email, password) {
    if (authState.loginAttempts >= 3) {
        const timeSinceLastAttempt = Date.now() - authState.lastLoginAttempt;
        if (timeSinceLastAttempt < 300000) { // 5 minutes
            addMessageToChat('🔒 Too many login attempts. Please wait 5 minutes before trying again.', 'assistant');
            return false;
        }
        authState.loginAttempts = 0;
    }
    
    try {
        // Simulate authentication (replace with real API call)
        updateStatus('🔐 Authenticating...', 'connecting');
        
        // Demo authentication - replace with real backend call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo purposes, accept any valid email format
        if (isValidEmail(email) && password.length >= 6) {
            const userData = {
                id: 'demo_user_' + Date.now(),
                email: email,
                name: email.split('@')[0],
                joinDate: new Date().toISOString(),
                learningStyle: 'adaptive',
                completedAssessments: [],
                progress: {}
            };
            
            authState.isLoggedIn = true;
            authState.currentUser = userData;
            authState.sessionToken = 'demo_token_' + Date.now();
            authState.loginAttempts = 0;
            
            // Save to localStorage
            localStorage.setItem('authToken', authState.sessionToken);
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            updateUIForAuthenticatedUser();
            updateStatus('✅ Successfully logged in!', 'working');
            
            addMessageToChat(
                `🎉 Welcome to PMERIT, ${userData.name}! I'm excited to continue your learning journey. Based on your profile, I can provide personalized recommendations and track your progress. What would you like to work on today?`,
                'assistant'
            );
            
            return true;
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        authState.loginAttempts++;
        authState.lastLoginAttempt = Date.now();
        
        updateStatus('❌ Login failed', 'error');
        addMessageToChat(
            '🔐 Login failed. Please check your credentials. For demo purposes, use any valid email and a password with at least 6 characters.',
            'assistant'
        );
        
        return false;
    }
}

/**
 * Handle user registration
 */
async function handleRegistration(userData) {
    try {
        updateStatus('📝 Creating account...', 'connecting');
        
        // Validate required fields
        if (!userData.email || !userData.password || !userData.name) {
            throw new Error('Missing required fields');
        }
        
        if (!isValidEmail(userData.email)) {
            throw new Error('Invalid email format');
        }
        
        if (userData.password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }
        
        // Simulate registration (replace with real API call)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const newUser = {
            id: 'user_' + Date.now(),
            email: userData.email,
            name: userData.name,
            joinDate: new Date().toISOString(),
            learningStyle: userData.learningStyle || 'adaptive',
            interests: userData.interests || [],
            completedAssessments: [],
            progress: {}
        };
        
        authState.isLoggedIn = true;
        authState.currentUser = newUser;
        authState.sessionToken = 'token_' + Date.now();
        
        // Save to localStorage
        localStorage.setItem('authToken', authState.sessionToken);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        updateUIForAuthenticatedUser();
        updateStatus('✅ Account created successfully!', 'working');
        
        addMessageToChat(
            `🎉 Welcome to PMERIT, ${newUser.name}! Your account has been created successfully. Let's start with a quick assessment to personalize your learning experience. Would you like to take the Learning Style Assessment first?`,
            'assistant'
        );
        
        return true;
    } catch (error) {
        updateStatus('❌ Registration failed', 'error');
        addMessageToChat(
            `📝 Registration failed: ${error.message}. Please try again with valid information.`,
            'assistant'
        );
        
        return false;
    }
}

/**
 * Handle user logout
 */
function handleLogout() {
    authState.isLoggedIn = false;
    authState.currentUser = null;
    authState.sessionToken = null;
    
    clearAuthData();
    updateUIForGuestUser();
    updateStatus('👋 Logged out successfully', 'info');
    
    addMessageToChat(
        '👋 You have been logged out. Thank you for using PMERIT! You can continue exploring our educational resources as a guest, or sign back in anytime to access your personalized learning journey.',
        'assistant'
    );
}

/**
 * Clear authentication data
 */
function clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
}

/**
 * Update UI for authenticated user
 */
function updateUIForAuthenticatedUser() {
    const loginBtns = document.querySelectorAll('.btn-login');
    const registerBtns = document.querySelectorAll('.btn-register');
    
    loginBtns.forEach(btn => {
        btn.textContent = '👤 Profile';
        btn.onclick = showUserProfile;
    });
    
    registerBtns.forEach(btn => {
        btn.textContent = '🚪 Logout';
        btn.onclick = handleLogout;
    });
    
    // Update sidebar with user info if avatar section exists
    const avatarSection = document.querySelector('.sidebar-header h3');
    if (avatarSection && authState.currentUser) {
        avatarSection.textContent = authState.currentUser.name;
    }
}

/**
 * Update UI for guest user
 */
function updateUIForGuestUser() {
    const loginBtns = document.querySelectorAll('.btn-login');
    const registerBtns = document.querySelectorAll('.btn-register');
    
    loginBtns.forEach(btn => {
        btn.textContent = 'Sign In';
        btn.onclick = showLogin;
    });
    
    registerBtns.forEach(btn => {
        btn.textContent = 'Start Learning';
        btn.onclick = showRegister;
    });
    
    // Reset sidebar
    const avatarSection = document.querySelector('.sidebar-header h3');
    if (avatarSection) {
        avatarSection.textContent = 'Gabriel AI';
    }
}

/**
 * Show user profile
 */
function showUserProfile() {
    if (!authState.currentUser) {
        showLogin();
        return;
    }
    
    const user = authState.currentUser;
    const profileMessage = `
👤 **Your Profile**

📧 **Email**: ${user.email}
👤 **Name**: ${user.name}
📅 **Member Since**: ${new Date(user.joinDate).toLocaleDateString()}
🎯 **Learning Style**: ${user.learningStyle}
📋 **Assessments Completed**: ${user.completedAssessments.length}

**Learning Progress:**
${Object.keys(user.progress).length > 0 ? 
    Object.entries(user.progress).map(([subject, progress]) => 
        `• ${subject}: ${progress}%`
    ).join('\n') : 
    '• No progress tracked yet - start learning to see your achievements!'}

Would you like to update your profile, take more assessments, or continue learning?
    `;
    
    addMessageToChat(profileMessage, 'assistant');
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show login form (demo implementation)
 */
function showLogin() {
    addMessageToChat(
        '🔐 **Demo Login System**\n\nFor demonstration purposes, enter any valid email address and a password with at least 6 characters to log in.\n\nExample:\n• Email: demo@example.com\n• Password: password123\n\nFull authentication system is being developed for production!',
        'assistant'
    );
}

/**
 * Show registration form (demo implementation)
 */
function showRegister() {
    addMessageToChat(
        '📝 **Demo Registration System**\n\nTo register for the demo:\n1. Use any valid email format\n2. Choose a password with at least 6 characters\n3. Provide your name\n\nExample:\n• Email: yourname@example.com\n• Password: mypassword\n• Name: Your Name\n\nComplete registration system with email verification is coming soon!',
        'assistant'
    );
}

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
});

// Export functions for global access
window.authState = authState;
window.handleLogin = handleLogin;
window.handleRegistration = handleRegistration;
window.handleLogout = handleLogout;
window.showUserProfile = showUserProfile;
window.checkAuthStatus = checkAuthStatus;
