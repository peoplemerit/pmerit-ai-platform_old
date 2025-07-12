// ====== COMPLETE SOLUTION 2: js/auth.js - Enhanced with Working Sign-in ======
// Replace your current js/auth.js with this complete version

// js/auth.js - PMERIT Complete Authentication System

// Mock users for demo (includes test account)
const DEMO_USERS = [
    { name: "Test User", email: "test@example.com", password: "password123", verified: true },
    { name: "Demo Student", email: "demo@pmerit.com", password: "demo123", verified: true }
];

let authState = {
    isAuthenticated: false,
    user: null,
    sessionToken: null
};

// Utility Functions
function getSession() {
    const session = localStorage.getItem('gabriel_session');
    if (!session) return null;
    try {
        return JSON.parse(session);
    } catch (e) {
        localStorage.removeItem('gabriel_session');
        return null;
    }
}

function setSession(user) {
    const session = { user, token: "mock-token", time: Date.now() };
    localStorage.setItem('gabriel_session', JSON.stringify(session));
    authState.isAuthenticated = true;
    authState.user = user;
}

function clearSession() {
    localStorage.removeItem('gabriel_session');
    localStorage.removeItem('gabriel_user');
    authState.isAuthenticated = false;
    authState.user = null;
}

// Sign-in Handler - COMPLETE WORKING VERSION
function handleSignIn(email, password) {
    // Check demo users first
    let user = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    // If not found in demo, check localStorage registered users
    if (!user) {
        const storedUser = JSON.parse(localStorage.getItem('gabriel_user') || '{}');
        if (storedUser.email === email && storedUser.password === password) {
            user = storedUser;
        }
    }

    if (!user) {
        return { success: false, message: "Invalid email or password. Try test@example.com / password123" };
    }

    if (!user.verified) {
        return { success: false, message: "Please verify your email first." };
    }

    // Success - create session and redirect
    setSession({ name: user.name, email: user.email });
    return { success: true, message: `Welcome back, ${user.name}!`, user: user };
}

// Session validation for protected pages
function validateSessionOrRedirect() {
    const session = getSession();
    if (!session || !session.user) {
        window.location.href = "signin.html";
        return false;
    }
    authState.isAuthenticated = true;
    authState.user = session.user;
    return true;
}

// Logout handler
function handleLogout() {
    clearSession();
    alert("Logged out successfully!");
    window.location.href = "index.html";
}

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if on sign-in page
    if (window.location.pathname.endsWith("signin.html")) {
        const signinForm = document.querySelector('form');
        if (signinForm) {
            signinForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = signinForm.querySelector('#email').value.trim().toLowerCase();
                const password = signinForm.querySelector('#password').value;
                
                const result = handleSignIn(email, password);
                
                if (result.success) {
                    alert(result.message + " Redirecting to dashboard...");
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    alert(result.message);
                }
            });
        }
    }

    // Handle logout buttons
    const logoutBtns = document.querySelectorAll('#logoutBtn, .logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });

    // Auto-redirect if already logged in (for sign-in page)
    if (window.location.pathname.endsWith("signin.html")) {
        const session = getSession();
        if (session && session.user) {
            window.location.href = "dashboard.html";
        }
    }
});

// Global API
window.PMERIT_AUTH = {
    getSession,
    setSession,
    clearSession,
    handleSignIn,
    validateSessionOrRedirect,
    handleLogout,
    authState
};
