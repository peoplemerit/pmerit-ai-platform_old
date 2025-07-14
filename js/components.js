/**
 * PMERIT Modular Component System - Real Authentication Upgrade
 * Handles dynamic loading and rendering of UI components
 * Production-ready authentication: registration, sign-in, session routing
 */

class AuthenticationManager {
    constructor() {
        this.SESSION_KEY = 'gabriel_session';
        this.USERS_KEY = 'gabriel_users';
        this.SESSION_DURATION = 1000 * 60 * 60 * 24 * 7; // 7 days
    }

    // UTILITIES
    hashPassword(password) {
        // Simulate hashing (frontend only - replace with real hash server-side)
        return btoa(unescape(encodeURIComponent(password))).split('').reverse().join('');
    }

    generateToken(email) {
        // Simulate secure token (replace with server-side JWT in production)
        return btoa(email + '_' + Date.now() + '_' + Math.random().toString(36).slice(2));
    }

    getUsers() {
        let raw = localStorage.getItem(this.USERS_KEY) || '{}';
        try { return JSON.parse(raw); } catch (e) { return {}; }
    }

    saveUsers(users) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    getSession() {
        let raw = localStorage.getItem(this.SESSION_KEY);
        if (!raw) return null;
        try {
            const session = JSON.parse(raw);
            if (!session || !session.token || !session.user) return null;
            // Expire after duration
            if ((Date.now() - session.time) > this.SESSION_DURATION) {
                this.clearSession();
                return null;
            }
            return session;
        } catch (e) { this.clearSession(); return null; }
    }

    setSession(user) {
        const token = this.generateToken(user.email);
        localStorage.setItem(this.SESSION_KEY, JSON.stringify({
            user: { name: user.name, email: user.email },
            token,
            time: Date.now()
        }));
    }

    clearSession() {
        localStorage.removeItem(this.SESSION_KEY);
    }

    // ROUTING LOGIC
    checkAuthenticationStatus() {
    console.log('🔍 [Auth] Checking authentication status...');

    // 1. Clear any current modal to avoid stacking
    if (this.currentModal) {
        console.log('🧹 [Auth] Hiding existing modal...');
        this.hideCurrentModal(true);
    }

    // 2. Try to get session and handle parse errors
    let session = null;
    try {
        session = this.getSession();
        console.log('[Auth] Session:', session);
    } catch (e) {
        console.error('❌ [Auth] Error parsing session:', e);
        session = null;
    }

    // 3. Check if session is valid (user + token)
    if (session && session.user && session.token) {
        console.log('✅ [Auth] Valid session found; redirecting to dashboard.');
        window.location.href = 'dashboard.html';
        return;
    }

    // 4. Try to get users and handle parse errors
    let users = {};
    try {
        users = this.getUsers();
        console.log('[Auth] Users:', users);
    } catch (e) {
        console.error('❌ [Auth] Error parsing users:', e);
        users = {};
    }

    // 5. Decide which modal to show, with debug
    const userCount = Object.keys(users).length;
    console.log(`[Auth] User count: ${userCount}`);

    if (userCount > 0) {
        console.log('🔑 [Auth] Users exist; showing sign-in modal.');
        this.showComponent('sign-in-modal');
    } else {
        console.log('🎯 [Auth] No users; showing registration modal.');
        this.showComponent('registration-modal');
    }

    // 6. Confirm modal is actually shown, after a short delay
    setTimeout(() => {
        const modalVisible = !!this.currentModal;
        console.log(`[Auth] Modal visible after showComponent: ${modalVisible}`);
        if (!modalVisible) {
            console.warn('[Auth] Modal disappeared unexpectedly after showComponent!');
        }
    }, 350);
}

    // USER REGISTRATION
    registerUser({ fullname, email, password }) {
        // Validation
        if (!fullname || !email || !password) return { success: false, message: "All fields are required." };
        if (!/^[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,}$/.test(email)) return { success: false, message: "Please enter a valid email address." };
        if (password.length < 6) return { success: false, message: "Password must be at least 6 characters." };

        let users = this.getUsers();
        if (users[email]) return { success: false, message: "Email already registered. Please sign in." };

        // Simulate email verification (frontend only)
        users[email] = {
            name: fullname,
            email,
            passwordHash: this.hashPassword(password),
            verified: false,
            created: Date.now()
        };
        this.saveUsers(users);

        // Show verification message (no real email sent in frontend)
        return { success: true, user: users[email], message: "Registration successful! Please check your email to verify your account (demo mode: click verification link)." };
    }

    // EMAIL VERIFICATION SIMULATION
    verifyEmail(email) {
        let users = this.getUsers();
        if (users[email]) {
            users[email].verified = true;
            this.saveUsers(users);
            return true;
        }
        return false;
    }

    // SIGN IN
    signInUser({ email, password }) {
        let users = this.getUsers();
        if (!users[email]) return { success: false, message: "Account not found. Please register." };
        if (!users[email].verified) return { success: false, message: "Please verify your email before signing in." };
        if (users[email].passwordHash !== this.hashPassword(password)) return { success: false, message: "Invalid password. Please try again." };
        // Success
        this.setSession(users[email]);
        return { success: true, user: users[email], message: "Sign-in successful!" };
    }

    // PASSWORD RECOVERY SIMULATION
    recoverPassword(email) {
        let users = this.getUsers();
        if (!users[email]) return { success: false, message: "Account not found." };
        // In real implementation, send recovery email
        return { success: true, message: "Password recovery instructions sent to your email (demo mode)." };
    }
}

// ===================== Component Manager =====================

class ComponentManager {
    constructor() {
        this.components = new Map();
        this.initialized = false;
        this.currentModal = null;
        this.auth = new AuthenticationManager();
    }

    init() {
        if (this.initialized) return;
        this.registerComponents();
        this.initializeEventListeners();
        this.initialized = true;
        console.log('✅ Component Manager initialized');
    }

    registerComponents() {
        // Registration Modal
        this.components.set('registration-modal', {
            name: 'Registration Modal',
            template: this.getRegistrationModalTemplate(),
            styles: this.getModalStyles(),
            handlers: this.getRegistrationModalHandlers()
        });
        // Sign-In Modal
        this.components.set('sign-in-modal', {
            name: 'Sign In Modal',
            template: this.getSignInModalTemplate(),
            styles: this.getModalStyles(),
            handlers: this.getSignInModalHandlers()
        });
        // Email Verification Modal
        this.components.set('email-verification-modal', {
            name: 'Email Verification Modal',
            template: this.getEmailVerificationModalTemplate(),
            styles: this.getModalStyles(),
            handlers: this.getEmailVerificationModalHandlers()
        });
        // Password Recovery Modal
        this.components.set('password-recovery-modal', {
            name: 'Password Recovery Modal',
            template: this.getPasswordRecoveryModalTemplate(),
            styles: this.getModalStyles(),
            handlers: this.getPasswordRecoveryModalHandlers()
        });
    }

    initializeEventListeners() {
        // "Start Learning" button triggers authentication logic
        const startLearningBtn = document.getElementById('startLearningBtn');
        if (startLearningBtn) {
            startLearningBtn.href = '#';
            startLearningBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.auth.checkAuthenticationStatus();
            });
        }
        // ESC key closes modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.hideCurrentModal();
            }
        });
    }

    // MODAL SHOW/HIDE
    showComponent(componentName, payload = {}) {
        const component = this.components.get(componentName);
        if (!component) {
            console.error(`Component not found: ${componentName}`);
            return;
        }
        this.hideCurrentModal(true);
        const modalContainer = document.createElement('div');
        modalContainer.id = `${componentName}-container`;
        modalContainer.innerHTML = component.template;
        modalContainer.classList.add('pmerit-modal-container');
        this.addComponentStyles(componentName, component.styles);
        document.body.appendChild(modalContainer);
        this.currentModal = modalContainer;
        if (component.handlers) component.handlers.call(this, modalContainer, payload);
        requestAnimationFrame(() => {
            modalContainer.classList.add('active');
        });
    }

    hideCurrentModal(immediate = false) {
        if (!this.currentModal) return;
        this.currentModal.classList.remove('active');
        const modalToRemove = this.currentModal;
        this.currentModal = null;
        setTimeout(() => {
            if (modalToRemove.parentNode) {
                modalToRemove.parentNode.removeChild(modalToRemove);
            }
        }, immediate ? 0 : 300);
    }

    addComponentStyles(componentName, styles) {
        const styleId = `${componentName}-styles`;
        if (document.getElementById(styleId)) return;
        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    // ===================== Modal Templates & Handlers =====================

    getModalStyles() {
        // Professional purple theme, mobile-responsive
        return `
        .pmerit-modal-container {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.65); z-index: 9999; display: flex; align-items: center; justify-content: center;
            opacity: 0; pointer-events: none; transition: opacity 0.3s;
        }
        .pmerit-modal-container.active { opacity: 1; pointer-events: auto; }
        .pmerit-modal {
            background: #fff; padding: 2rem 1.5rem; border-radius: 12px; min-width: 320px; max-width: 95vw;
            box-shadow: 0 8px 32px rgba(102,126,234,0.18);
            display: flex; flex-direction: column; gap: 1.2rem;
            animation: pmerit-modal-in 0.3s;
            font-family: 'Inter', Arial, sans-serif;
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
        .pmerit-modal-body { display: flex; flex-direction: column; gap: 0.9rem; }
        .pmerit-modal-body input {
            padding: 0.7rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;
        }
        .btn.btn-primary {
            background: linear-gradient(90deg,#667eea,#764ba2); color: #fff; border: none; border-radius: 6px; padding: 0.8rem 1.2rem;
            font-size: 1.1rem; margin-top: 0.5rem; cursor: pointer;
        }
        .btn.btn-primary:hover { background: #764ba2; }
        .pmerit-modal-footer { text-align: center; font-size: 0.98rem; color: #444; }
        .pmerit-modal-footer a { color: #667eea; text-decoration: none;}
        .pmerit-modal-footer a:hover { text-decoration: underline;}
        .pmerit-modal-message {font-size:0.98rem;color:#d97706;padding:0.5em 0;text-align:center;}
        .pmerit-modal-error {color:#ef4444;text-align:center;font-size:0.95rem;}
        @media (max-width: 480px) {
            .pmerit-modal {min-width:95vw;padding:1rem;}
        }
        `;
    }

    getRegistrationModalTemplate() {
        return `
        <div class="pmerit-modal">
            <div class="pmerit-modal-header">
                <span class="pmerit-modal-title">Sign Up to Start Learning</span>
                <button class="pmerit-modal-close" aria-label="Close">&times;</button>
            </div>
            <form class="pmerit-modal-body" id="registrationForm">
                <input type="text" name="fullname" placeholder="Full Name" required autocomplete="name" />
                <input type="email" name="email" placeholder="Email Address" required autocomplete="email" />
                <input type="password" name="password" placeholder="Password (min 6 chars)" required minlength="6" autocomplete="new-password" />
                <button type="submit" class="btn btn-primary">Create Account</button>
            </form>
            <div class="pmerit-modal-footer">
                Already have an account? <a href="#" id="goToSignIn">Sign In</a>
            </div>
            <div class="pmerit-modal-message">Free access for all learners. Your data is securely handled. <br> Our mission: break poverty cycles through education.</div>
        </div>
        `;
    }

    getSignInModalTemplate() {
        return `
        <div class="pmerit-modal">
            <div class="pmerit-modal-header">
                <span class="pmerit-modal-title">Sign In to PMERIT</span>
                <button class="pmerit-modal-close" aria-label="Close">&times;</button>
            </div>
            <form class="pmerit-modal-body" id="signInForm">
                <input type="email" name="email" placeholder="Email Address" required autocomplete="email" />
                <input type="password" name="password" placeholder="Password" required autocomplete="current-password" />
                <button type="submit" class="btn btn-primary">Sign In</button>
            </form>
            <div class="pmerit-modal-footer">
                <a href="#" id="forgotPasswordLink">Forgot password?</a>
                <br>
                <span>New user? <a href="#" id="goToRegister">Create Account</a></span>
            </div>
            <div class="pmerit-modal-message">Secure sign-in. Credentials never shared. <br> University-standard interface.</div>
        </div>
        `;
    }

    getEmailVerificationModalTemplate() {
        return `
        <div class="pmerit-modal">
            <div class="pmerit-modal-header">
                <span class="pmerit-modal-title">Verify Your Email</span>
                <button class="pmerit-modal-close" aria-label="Close">&times;</button>
            </div>
            <div class="pmerit-modal-body">
                <div class="pmerit-modal-message">
                    Almost there! Please check your email for the verification link.<br>
                    <button class="btn btn-primary" id="demoVerifyBtn">I have verified my email</button>
                </div>
            </div>
        </div>
        `;
    }

    getPasswordRecoveryModalTemplate() {
        return `
        <div class="pmerit-modal">
            <div class="pmerit-modal-header">
                <span class="pmerit-modal-title">Password Recovery</span>
                <button class="pmerit-modal-close" aria-label="Close">&times;</button>
            </div>
            <form class="pmerit-modal-body" id="recoverForm">
                <input type="email" name="email" placeholder="Your Email Address" required autocomplete="email" />
                <button type="submit" class="btn btn-primary">Send Recovery Email</button>
            </form>
            <div class="pmerit-modal-footer">
                <a href="#" id="backToSignIn">Back to Sign In</a>
            </div>
        </div>
        `;
    }

    // HANDLERS
    getRegistrationModalHandlers() {
        const self = this;
        return function(modalContainer) {
            // Close
            modalContainer.querySelector('.pmerit-modal-close').onclick = () => self.hideCurrentModal();
            // Go to Sign In
            modalContainer.querySelector('#goToSignIn').onclick = (e) => {
                e.preventDefault(); self.hideCurrentModal(); self.showComponent('sign-in-modal');
            };
            // Registration submit
            const form = modalContainer.querySelector('#registrationForm');
            form.onsubmit = function(e) {
                e.preventDefault();
                const fullname = form.fullname.value.trim();
                const email = form.email.value.trim().toLowerCase();
                const password = form.password.value;
                const res = self.auth.registerUser({ fullname, email, password });

                // Show error/success
                let errorDiv = modalContainer.querySelector('.pmerit-modal-error');
                if (!errorDiv) {
                    errorDiv = document.createElement('div');
                    errorDiv.className = 'pmerit-modal-error';
                    modalContainer.appendChild(errorDiv);
                }
                errorDiv.textContent = res.success ? '' : res.message;

                if (res.success) {
                    self.hideCurrentModal();
                    self.showComponent('email-verification-modal', { email });
                }
            };
        };
    }

    getSignInModalHandlers() {
        const self = this;
        return function(modalContainer) {
            // Close
            modalContainer.querySelector('.pmerit-modal-close').onclick = () => self.hideCurrentModal();
            // Go to Register
            modalContainer.querySelector('#goToRegister').onclick = (e) => {
                e.preventDefault(); self.hideCurrentModal(); self.showComponent('registration-modal');
            };
            // Forgot password
            modalContainer.querySelector('#forgotPasswordLink').onclick = (e) => {
                e.preventDefault(); self.hideCurrentModal(); self.showComponent('password-recovery-modal');
            };
            // Sign-In submit
            const form = modalContainer.querySelector('#signInForm');
            form.onsubmit = function(e) {
                e.preventDefault();
                const email = form.email.value.trim().toLowerCase();
                const password = form.password.value;
                const res = self.auth.signInUser({ email, password });

                let errorDiv = modalContainer.querySelector('.pmerit-modal-error');
                if (!errorDiv) {
                    errorDiv = document.createElement('div');
                    errorDiv.className = 'pmerit-modal-error';
                    modalContainer.appendChild(errorDiv);
                }
                errorDiv.textContent = res.success ? '' : res.message;

                if (res.success) {
                    self.hideCurrentModal();
                    window.location.href = 'dashboard.html';
                } else if (res.message.includes("verify your email")) {
                    self.hideCurrentModal();
                    self.showComponent('email-verification-modal', { email });
                }
            };
        };
    }

    getEmailVerificationModalHandlers() {
        const self = this;
        return function(modalContainer, payload) {
            // Close
            modalContainer.querySelector('.pmerit-modal-close').onclick = () => self.hideCurrentModal();
            // Demo Verify Button
            const verifyBtn = modalContainer.querySelector('#demoVerifyBtn');
            if (verifyBtn) {
                verifyBtn.onclick = () => {
                    if (payload && payload.email) {
                        self.auth.verifyEmail(payload.email);
                    }
                    self.hideCurrentModal();
                    self.showComponent('sign-in-modal');
                };
            }
        };
    }

    getPasswordRecoveryModalHandlers() {
        const self = this;
        return function(modalContainer) {
            // Close
            modalContainer.querySelector('.pmerit-modal-close').onclick = () => self.hideCurrentModal();
            // Back to Sign In
            modalContainer.querySelector('#backToSignIn').onclick = (e) => {
                e.preventDefault(); self.hideCurrentModal(); self.showComponent('sign-in-modal');
            };
            // Recover submit
            const form = modalContainer.querySelector('#recoverForm');
            form.onsubmit = function(e) {
                e.preventDefault();
                const email = form.email.value.trim().toLowerCase();
                const res = self.auth.recoverPassword(email);

                let errorDiv = modalContainer.querySelector('.pmerit-modal-error');
                if (!errorDiv) {
                    errorDiv = document.createElement('div');
                    errorDiv.className = 'pmerit-modal-error';
                    modalContainer.appendChild(errorDiv);
                }
                errorDiv.textContent = res.success ? res.message : res.message;
            };
        };
    }
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
    if (!window.pmeritComponentManager) {
        window.pmeritComponentManager = new ComponentManager();
        window.pmeritComponentManager.init();
    }
});
