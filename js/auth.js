// js/auth.js
// PMERIT Authentication & Session Management Bridge

const MOCK_USERS = [
  { name: "Test User", email: "test@example.com", password: "password123", verified: true }
];

let authState = {
  isAuthenticated: false,
  user: null,
  sessionToken: null
};

// Utility: get session from localStorage
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

// Utility: save session
function setSession(user) {
  const session = { user, token: "mock-token", time: Date.now() };
  localStorage.setItem('gabriel_session', JSON.stringify(session));
}

// Utility: clear session
function clearSession() {
  localStorage.removeItem('gabriel_session');
}

// Registration Handler (modal form or direct)
function handleRegistration(form) {
  const name = form.fullname.value.trim();
  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;
  if (!name || !email || password.length < 6) {
    alert("Please fill out all fields correctly.");
    return false;
  }
  // Demo: "Save" user in mock DB
  MOCK_USERS.push({ name, email, password, verified: false });

  // Show verification message
  alert(`Welcome, ${name}! Please check your email for a verification link to complete registration.\n\nDemo: Use test@example.com / password123 to test the platform.`);
  // Redirect to sign-in
  window.location.href = "signin.html";
  return true;
}

// Mock Email Verification (demo)
function mockEmailVerification(email) {
  const user = MOCK_USERS.find(u => u.email === email);
  if (user) user.verified = true;
}

// Sign-in Handler
function handleSignInForm(form) {
  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;
  if (!email || !password) {
    showSigninError("Please enter your email and password.");
    return false;
  }
  // Find user in mock DB
  const user = MOCK_USERS.find(u => u.email === email);
  if (!user) {
    showSigninError("No account found for this email.");
    return false;
  }
  if (user.password !== password) {
    showSigninError("Incorrect password. Please try again.");
    return false;
  }
  if (!user.verified) {
    showSigninError("Please verify your email before signing in (demo: use test@example.com).");
    return false;
  }

  // Success! Create session
  setSession({ name: user.name, email: user.email });
  alert(`Welcome back, ${user.name}! Redirecting to your dashboard...`);
  window.location.href = "dashboard.html";
  return true;
}

// Show sign-in error (inline or alert)
function showSigninError(msg) {
  let status = document.getElementById("signinStatus");
  if (status) {
    status.textContent = msg;
    status.style.color = "#ef4444";
  } else {
    alert(msg);
  }
}

// Validate session on protected routes
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
  window.location.href = "index.html";
}

// Expose auth API
window.PMERIT_AUTH = {
  getSession,
  setSession,
  clearSession,
  handleRegistration,
  handleSignInForm,
  validateSessionOrRedirect,
  handleLogout,
  mockEmailVerification,
  authState
};

// Modal registration integration (with components.js)
window.addEventListener('DOMContentLoaded', function() {
  // Handle sign-in.html
  const signinForm = document.querySelector("form");
  if (signinForm && window.location.pathname.endsWith("signin.html")) {
    signinForm.addEventListener("submit", function(e) {
      e.preventDefault();
      window.PMERIT_AUTH.handleSignInForm(signinForm);
    });
  }
  // Handle registration modal (if using components.js)
  const regForm = document.getElementById("registrationForm");
  if (regForm) {
    regForm.addEventListener("submit", function(e) {
      e.preventDefault();
      window.PMERIT_AUTH.handleRegistration(regForm);
    });
  }
  // Handle logout (dashboard or other pages)
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", window.PMERIT_AUTH.handleLogout);
  }
});
