// ====== COMPLETE AUTHENTICATION SYSTEM - auth.js ======
// Replace your current auth.js with this complete version

let authState = {
    isAuthenticated: false,
    user: null,
    sessionToken: null
};

// Mock user database for testing
const mockUsers = [
    {
        id: 'user_001',
        name: 'Idowu',
        email: 'test@example.com',
        password: 'password123',
        verified: true
    }
];

document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    checkExistingSession();
    initializeAuthButtons();
    setupSignInForm();
    setupRegistrationForm();
    console.log('🔐 Complete authentication system initialized');
}

function checkExistingSession() {
    const savedSession = localStorage.getItem('gabriel_session');
    if (savedSession) {
        try {
            const sessionData = JSON.parse(savedSession);
            if (sessionData.verified) {
                authState.isAuthenticated = true;
                authState.user = sessionData;
                console.log('✅ Valid session found:', sessionData.name);
                
                // If on sign-in page and authenticated, redirect to dashboard
                if (window.location.pathname.includes('signin.html')) {
                    window.location.href = 'dashboard.html';
                }
            }
        } catch (e) {
            console.log('⚠️ Invalid session data, clearing...');
            localStorage.removeItem('gabriel_session');
        }
    }
}

// REGISTRATION SYSTEM
function setupRegistrationForm() {
    // Enhanced registration modal integration
    if (window.pmeritComponentManager) {
        const originalHandlers = window.pmeritComponentManager.components.get('registration-modal')?.handlers;
        
        window.pmeritComponentManager.components.set('registration-modal', {
            name: 'Registration Modal',
            template: getEnhancedRegistrationTemplate(),
            styles: getEnhancedRegistrationStyles(),
            handlers: function(modalContainer) {
                // Close button
                modalContainer.querySelector('.pmerit-modal-close').addEventListener('click', () => {
                    window.pmeritComponentManager.hideCurrentModal();
                });

                // Enhanced form handler
                const form = modalContainer.querySelector('#registrationForm');
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    handleRegistration(form);
                });
            }
        });
    }
}

function handleRegistration(form) {
    const fullname = form.fullname.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!fullname || !email || password.length < 6) {
        alert('Please fill out all fields correctly.');
        return;
    }

    // Create new user account
    const newUser = {
        id: 'user_' + Date.now(),
        name: fullname,
        email: email,
        password: password,
        verified: false,
        registrationDate: new Date().toISOString()
    };

    // Add to mock database
    mockUsers.push(newUser);

    // Store pending verification
    localStorage.setItem('pending_verification', JSON.stringify(newUser));

    // Enhanced success message
    alert(`Welcome, ${fullname}! 

🎓 Registration Successful!

📧 Please check your email (${email}) for a verification link to complete your registration and access your PMERIT dashboard.

For DEMO purposes, you can sign in directly with:
📧 Email: test@example.com
🔒 Password: password123`);

    // Close modal and redirect to sign-in
    if (window.pmeritComponentManager) {
        window.pmeritComponentManager.hideCurrentModal();
    }
    
    // Redirect to sign-in page after 2 seconds
    setTimeout(() => {
        window.location.href = 'signin.html';
    }, 2000);
}

// SIGN-IN SYSTEM
function setupSignInForm() {
    // Only run on sign-in page
    if (!window.location.pathname.includes('signin.html')) return;

    const signInForm = document.querySelector('form');
    if (signInForm) {
        signInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignIn();
        });
    }
}

function handleSignIn() {
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    
    if (!emailInput || !passwordInput) {
        alert('Sign-in form not found');
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Find user in mock database
    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (!user) {
        alert('❌ Invalid email or password. \n\nFor DEMO, use:\n📧 test@example.com\n🔒 password123');
        return;
    }

    if (!user.verified) {
        alert('📧 Please verify your email first. Check your inbox for the verification link.');
        return;
    }

    // Create session
    const session = {
        userId: user.id,
        email: user.email,
        name: user.name,
        verified: true,
        loginTime: new Date().toISOString()
    };

    // Store session
    localStorage.setItem('gabriel_session', JSON.stringify(session));
    authState.isAuthenticated = true;
    authState.user = session;

    // Success message and redirect
    alert(`🎓 Welcome back, ${user.name}!\n\nSign-in successful! Redirecting to your PMERIT dashboard...`);

    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// DASHBOARD INITIALIZATION
function initializeDashboard() {
    if (!window.location.pathname.includes('dashboard.html')) return;

    const session = localStorage.getItem('gabriel_session');
    if (!session) {
        alert('Please sign in to access your dashboard');
        window.location.href = 'signin.html';
        return;
    }

    const user = JSON.parse(session);
    
    // Update dashboard welcome
    const welcomeElement = document.querySelector('h1');
    if (welcomeElement) {
        welcomeElement.textContent = `Welcome to PMERIT University Dashboard, ${user.name}!`;
    }

    // Add dashboard header if missing
    if (!document.querySelector('.dashboard-welcome')) {
        const container = document.querySelector('.container');
        if (container) {
            const welcomeDiv = document.createElement('div');
            welcomeDiv.className = 'dashboard-welcome';
            welcomeDiv.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 2rem;
                border-radius: 15px;
                margin-bottom: 2rem;
                text-align: center;
            `;
            welcomeDiv.innerHTML = `
                <h1>🎓 Welcome to PMERIT University Dashboard, ${user.name}!</h1>
                <p>Your personalized learning journey starts here</p>
            `;
            container.insertBefore(welcomeDiv, container.firstChild);
        }
    }
}

// CART PROTECTION
function checkAuthForCart() {
    const session = localStorage.getItem('gabriel_session');
    if (!session) {
        alert('Please sign in to add subjects to your cart.');
        window.location.href = 'signin.html';
        return false;
    }
    return true;
}

// ENHANCED REGISTRATION TEMPLATE
function getEnhancedRegistrationTemplate() {
    return `
    <div class="pmerit-modal">
        <div class="pmerit-modal-header">
            <span class="pmerit-modal-title">🎓 Join PMERIT University</span>
            <button class="pmerit-modal-close" aria-label="Close">&times;</button>
        </div>
        <form class="pmerit-modal-body" id="registrationForm">
            <div class="welcome-text">
                <p>Start your journey to breaking poverty cycles through education!</p>
            </div>
            <input type="text" name="fullname" placeholder="Full Name" required />
            <input type="email" name="email" placeholder="Email Address" required />
            <input type="password" name="password" placeholder="Password (min 6 characters)" required minlength="6" />
            <button type="submit" class="btn btn-primary">Create Account & Start Learning</button>
        </form>
        <div class="pmerit-modal-footer">
            <span>Already have an account? <a href="signin.html">Sign In</a></span>
            <small>Demo: Use test@example.com / password123 to test the platform</small>
        </div>
    </div>
    `;
}

function getEnhancedRegistrationStyles() {
    return `
    .pmerit-modal-container {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.65); z-index: 9999; display: flex; align-items: center; justify-content: center;
        opacity: 0; pointer-events: none; transition: opacity 0.3s;
    }
    .pmerit-modal-container.active { opacity: 1; pointer-events: auto; }
    .pmerit-modal {
        background: #fff; padding: 2rem 1.5rem; border-radius: 12px; min-width: 320px; max-width: 90vw;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        display: flex; flex-direction: column; gap: 1rem;
        animation: pmerit-modal-in 0.3s;
    }
    @keyframes pmerit-modal-in {
        from { transform: translateY(-40px) scale(0.95); opacity: 0; }
        to   { transform: none; opacity: 1; }
    }
    .pmerit-modal-header { display: flex; justify-content: space-between; align-items: center; }
    .pmerit-modal-title { font-size: 1.3rem; font-weight: 600; color: #667eea; }
    .pmerit-modal-close {
        background: none; border: none; font-size: 1.8rem; line-height: 1; cursor: pointer;
        color: #444;
    }
    .welcome-text { text-align: center; color: #666; margin-bottom: 1rem; }
    .pmerit-modal-body { display: flex; flex-direction: column; gap: 0.9rem; }
    .pmerit-modal-body input {
        padding: 0.7rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;
    }
    .btn.btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; border: none; border-radius: 6px; padding: 0.8rem 1.2rem;
        font-size: 1.1rem; margin-top: 0.5rem; cursor: pointer;
    }
    .btn.btn-primary:hover { transform: translateY(-1px); }
    .pmerit-modal-footer { text-align: center; font-size: 0.9rem; color: #444; }
    .pmerit-modal-footer a { color: #667eea; text-decoration: none;}
    .pmerit-modal-footer a:hover { text-decoration: underline;}
    .pmerit-modal-footer small { display: block; margin-top: 0.5rem; color: #888; font-size: 0.8rem; }
    `;
}

// INITIALIZE DASHBOARD ON LOAD
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

// EXPORT FUNCTIONS
window.authModule = {
    checkAuthForCart,
    handleSignIn,
    handleRegistration,
    initializeDashboard
};

// Make cart protection globally available
window.checkAuthForCart = checkAuthForCart;

console.log('🔐 Complete Gabriel AI Auth System - Ready!');
