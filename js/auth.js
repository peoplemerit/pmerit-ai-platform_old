// ====== BROWSER-COMPATIBLE AUTH.JS (No Babel Required) ======
// js/auth.js - PMERIT Authentication System (ES5 Compatible)

// Mock users for demo
var DEMO_USERS = [
    { name: "Test User", email: "test@example.com", password: "password123", verified: true },
    { name: "Demo Student", email: "demo@pmerit.com", password: "demo123", verified: true }
];

var authState = {
    isAuthenticated: false,
    user: null,
    sessionToken: null
};

// Utility Functions (ES5 Compatible)
function getSession() {
    var session = localStorage.getItem('gabriel_session');
    if (!session) return null;
    try {
        return JSON.parse(session);
    } catch (e) {
        localStorage.removeItem('gabriel_session');
        return null;
    }
}

function setSession(user) {
    var session = { user: user, token: "mock-token", time: Date.now() };
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

// Sign-in Handler (ES5 Compatible)
function handleSignIn(email, password) {
    // Check demo users first
    var user = null;
    for (var i = 0; i < DEMO_USERS.length; i++) {
        if (DEMO_USERS[i].email === email && DEMO_USERS[i].password === password) {
            user = DEMO_USERS[i];
            break;
        }
    }
    
    // If not found in demo, check localStorage
    if (!user) {
        var storedUserStr = localStorage.getItem('gabriel_user') || '{}';
        var storedUser = JSON.parse(storedUserStr);
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

    // Success - create session
    setSession({ name: user.name, email: user.email });
    return { success: true, message: "Welcome back, " + user.name + "!", user: user };
}

// Session validation
function validateSessionOrRedirect() {
    var session = getSession();
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

// Auto-initialize (ES5 Compatible)
document.addEventListener('DOMContentLoaded', function() {
    // Sign-in page handler
    if (window.location.pathname.indexOf("signin.html") !== -1) {
        var signinForm = document.querySelector('form');
        if (signinForm) {
            signinForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var email = signinForm.querySelector('#email').value.toLowerCase().trim();
                var password = signinForm.querySelector('#password').value;
                
                var result = handleSignIn(email, password);
                
                if (result.success) {
                    alert(result.message + " Redirecting to dashboard...");
                    setTimeout(function() {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    alert(result.message);
                }
            });
        }
    }

    // Handle logout buttons
    var logoutBtns = document.querySelectorAll('#logoutBtn, .logout-btn');
    for (var i = 0; i < logoutBtns.length; i++) {
        logoutBtns[i].addEventListener('click', handleLogout);
    }

    // Auto-redirect if already logged in
    if (window.location.pathname.indexOf("signin.html") !== -1) {
        var session = getSession();
        if (session && session.user) {
            window.location.href = "dashboard.html";
        }
    }
});

// Global API
window.PMERIT_AUTH = {
    getSession: getSession,
    setSession: setSession,
    clearSession: clearSession,
    handleSignIn: handleSignIn,
    validateSessionOrRedirect: validateSessionOrRedirect,
    handleLogout: handleLogout,
    authState: authState
};
