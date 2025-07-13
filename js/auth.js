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
// ====== SAFE INCREMENTAL AUTHENTICATION ADDITION ======
// Add this to your existing code WITHOUT replacing anything

// 1. ADD TO EXISTING js/auth.js (or create if doesn't exist)
// This won't break existing functionality
(function() {
    'use strict';
    
    // Only add if not already defined
    if (!window.PMERIT_SIMPLE_AUTH) {
        window.PMERIT_SIMPLE_AUTH = {
            // Simple demo login for testing
            demoLogin: function() {
                var session = {
                    loggedIn: true,
                    user: {
                        name: 'Demo User',
                        email: 'demo@pmerit.com'
                    },
                    time: Date.now()
                };
                localStorage.setItem('pmerit_demo_session', JSON.stringify(session));
                console.log('✅ Demo login successful');
                return true;
            },
            
            // Check if logged in
            isLoggedIn: function() {
                var session = localStorage.getItem('pmerit_demo_session');
                if (!session) return false;
                try {
                    var data = JSON.parse(session);
                    return data.loggedIn === true;
                } catch (e) {
                    return false;
                }
            },
            
            // Get current user
            getUser: function() {
                if (!this.isLoggedIn()) return null;
                var session = JSON.parse(localStorage.getItem('pmerit_demo_session'));
                return session.user;
            },
            
            // Logout
            logout: function() {
                localStorage.removeItem('pmerit_demo_session');
                console.log('✅ Logged out');
            }
        };
    }
    
    console.log('✅ Simple auth system added (safe mode)');
})();

// 2. ENHANCE START LEARNING BUTTON (Safe Enhancement)
document.addEventListener('DOMContentLoaded', function() {
    // Find the Start Learning button
    var startBtn = document.getElementById('startLearningBtn') || 
                   document.querySelector('a[href*="dashboard"]') ||
                   document.querySelector('.btn-primary');
    
    if (startBtn) {
        // Add click handler without removing existing functionality
        startBtn.addEventListener('click', function(e) {
            // Check if user is logged in
            if (!window.PMERIT_SIMPLE_AUTH.isLoggedIn()) {
                e.preventDefault();
                
                // Simple demo login for testing
                var proceed = confirm('Demo Mode: Would you like to login as Demo User to test the platform?');
                if (proceed) {
                    window.PMERIT_SIMPLE_AUTH.demoLogin();
                    alert('Welcome! Redirecting to your learning dashboard...');
                    // Create dashboard.html redirect
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Please sign in to access your learning dashboard. For demo, use the Sign In button.');
                }
            } else {
                // User is logged in, proceed normally
                window.location.href = 'dashboard.html';
            }
        });
        
        console.log('✅ Start Learning button enhanced');
    }
});

// 3. ENHANCE SIGN IN BUTTON (Safe Enhancement)
document.addEventListener('DOMContentLoaded', function() {
    var signInBtn = document.querySelector('a[href*="signin"]') ||
                    document.querySelector('.btn-signin');
    
    if (signInBtn) {
        signInBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Simple demo sign-in for testing
            var email = prompt('Enter email (try: demo@pmerit.com):');
            var password = prompt('Enter password (try: demo123):');
            
            if (email === 'demo@pmerit.com' && password === 'demo123') {
                window.PMERIT_SIMPLE_AUTH.demoLogin();
                alert('Welcome back, Demo User! Redirecting to dashboard...');
                window.location.href = 'dashboard.html';
            } else if (email && password) {
                // Create session for any user (demo mode)
                var session = {
                    loggedIn: true,
                    user: {
                        name: email.split('@')[0],
                        email: email
                    },
                    time: Date.now()
                };
                localStorage.setItem('pmerit_demo_session', JSON.stringify(session));
                alert('Welcome! Redirecting to dashboard...');
                window.location.href = 'dashboard.html';
            } else {
                alert('For demo: Use demo@pmerit.com / demo123');
            }
        });
        
        console.log('✅ Sign In button enhanced');
    }
});

// 4. DASHBOARD PAGE HANDLER (Create dashboard.html if needed)
if (window.location.pathname.includes('dashboard.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        // Check if user is logged in
        if (!window.PMERIT_SIMPLE_AUTH.isLoggedIn()) {
            alert('Please sign in first');
            window.location.href = 'index.html';
            return;
        }
        
        var user = window.PMERIT_SIMPLE_AUTH.getUser();
        
        // Update welcome message if element exists
        var welcomeEl = document.getElementById('dashboardWelcome') ||
                        document.querySelector('h1');
        
        if (welcomeEl) {
            welcomeEl.textContent = 'Welcome to PMERIT Dashboard, ' + user.name + '!';
        }
        
        console.log('✅ Dashboard loaded for:', user.name);
    });
}

// 5. SAFE GLOBAL FUNCTIONS FOR TESTING
window.testLogin = function() {
    window.PMERIT_SIMPLE_AUTH.demoLogin();
    console.log('Demo login successful - try navigating to dashboard');
};

window.checkAuth = function() {
    var isLoggedIn = window.PMERIT_SIMPLE_AUTH.isLoggedIn();
    var user = window.PMERIT_SIMPLE_AUTH.getUser();
    console.log('Logged in:', isLoggedIn);
    console.log('User:', user);
    return { loggedIn: isLoggedIn, user: user };
};

window.testLogout = function() {
    window.PMERIT_SIMPLE_AUTH.logout();
    console.log('Logged out - refresh page to see changes');
};

console.log('🎯 Safe authentication enhancements loaded!');
console.log('💡 Try: testLogin(), checkAuth(), testLogout()');
