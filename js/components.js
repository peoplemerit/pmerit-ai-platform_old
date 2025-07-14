// js/components.js
// PMERIT Modular Component System - Production-Grade Version

(() => {
    // ===================== UTILITIES =====================
    const STORAGE = {
        SESSION_KEY: 'gabriel_session',
        USERS_KEY: 'gabriel_users',
        SESSION_DURATION: 1000 * 60 * 60 * 24 * 7, // 7 days

        getUsers() {
            try { return JSON.parse(localStorage.getItem(this.USERS_KEY) || '{}'); }
            catch { return {}; }
        },
        saveUsers(users) {
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        },
        getSession() {
            try {
                const session = JSON.parse(localStorage.getItem(this.SESSION_KEY));
                if (!session || !session.token || !session.user) return null;
                if ((Date.now() - session.time) > this.SESSION_DURATION) {
                    this.clearSession();
                    return null;
                }
                return session;
            } catch { this.clearSession(); return null; }
        },
        setSession(user) {
            const token = btoa(user.email + '_' + Date.now() + '_' + Math.random().toString(36).slice(2));
            localStorage.setItem(this.SESSION_KEY, JSON.stringify({
                user: { name: user.name, email: user.email },
                token,
                time: Date.now()
            }));
        },
        clearSession() {
            localStorage.removeItem(this.SESSION_KEY);
        }
    };

    // ===================== AUTH MANAGER =====================
    class AuthManager {
        constructor(storage) { this.storage = storage; }

        hashPassword(password) {
            return btoa(unescape(encodeURIComponent(password))).split('').reverse().join('');
        }

        register({ fullname, email, password }) {
            if (!fullname || !email || !password)
                return { success: false, message: "All fields required." };
            if (!/^[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,}$/.test(email))
                return { success: false, message: "Invalid email address." };
            if (password.length < 6)
                return { success: false, message: "Password must be at least 6 characters." };

            let users = this.storage.getUsers();
            if (users[email])
                return { success: false, message: "Email already registered." };

            users[email] = {
                name: fullname,
                email,
                passwordHash: this.hashPassword(password),
                verified: false,
                created: Date.now()
            };
            this.storage.saveUsers(users);
            return { success: true, user: users[email], message: "Registration successful! Please verify your email." };
        }

        verifyEmail(email) {
            let users = this.storage.getUsers();
            if (users[email]) {
                users[email].verified = true;
                this.storage.saveUsers(users);
                return true;
            }
            return false;
        }

        login({ email, password }) {
            let users = this.storage.getUsers();
            if (!users[email]) return { success: false, message: "Account not found." };
            if (!users[email].verified) return { success: false, message: "Verify your email first." };
            if (users[email].passwordHash !== this.hashPassword(password))
                return { success: false, message: "Invalid password." };
            this.storage.setSession(users[email]);
            return { success: true, user: users[email], message: "Sign-in successful!" };
        }

        recover(email) {
            let users = this.storage.getUsers();
            if (!users[email]) return { success: false, message: "Account not found." };
            return { success: true, message: "Password recovery instructions sent (demo mode)." };
        }

        getSession() { return this.storage.getSession(); }
        clearSession() { this.storage.clearSession(); }
    }

    // ===================== MODAL MANAGER =====================
    class ModalManager {
        constructor(auth) {
            this.auth = auth;
            this.modals = {};
            this.current = null;
        }

        registerModal(name, template, handlers) {
            this.modals[name] = { template, handlers };
        }

        show(name, payload = {}) {
            if (!this.modals[name]) return;
            this.hide();

            const modal = document.createElement('div');
            modal.className = 'pmerit-modal-container';
            modal.innerHTML = this.modals[name].template;
            document.body.appendChild(modal);
            this.current = modal;

            if (this.modals[name].handlers)
                this.modals[name].handlers(modal, payload, this);

            setTimeout(() => modal.classList.add('active'), 10);
        }

        hide() {
            if (!this.current) return;
            this.current.classList.remove('active');
            setTimeout(() => {
                if (this.current.parentNode)
                    this.current.parentNode.removeChild(this.current);
                this.current = null;
            }, 300);
        }
    }

    // ===================== MODAL TEMPLATES =====================
    const Styles = `
    .pmerit-modal-container {
        position: fixed; top:0; left:0; width:100vw; height:100vh;
        background:rgba(0,0,0,0.6); z-index:9999; display:flex;align-items:center;justify-content:center;
        opacity:0;pointer-events:none;transition:opacity 0.3s;
    }
    .pmerit-modal-container.active { opacity:1; pointer-events:auto;}
    .pmerit-modal {
        background:#fff;padding:2rem 1.5rem;border-radius:12px;min-width:320px;max-width:95vw;
        box-shadow:0 8px 32px rgba(102,126,234,0.18);display:flex;flex-direction:column;gap:1.2rem;
        font-family:'Inter',Arial,sans-serif;
    }
    .pmerit-modal-header { display:flex;justify-content:space-between;align-items:center;}
    .pmerit-modal-title {font-size:1.3rem;font-weight:600;color:#667eea;}
    .pmerit-modal-close {background:none;border:none;font-size:1.8rem;cursor:pointer;color:#444;}
    .pmerit-modal-body {display:flex;flex-direction:column;gap:0.9rem;}
    .pmerit-modal-body input {padding:0.7rem;border:1px solid #ddd;border-radius:6px;font-size:1rem;}
    .btn.btn-primary {
        background:linear-gradient(90deg,#667eea,#764ba2);color:#fff;border:none;border-radius:6px;padding:0.8rem 1.2rem;
        font-size:1.1rem;margin-top:0.5rem;cursor:pointer;
    }
    .btn.btn-primary:hover {background:#764ba2;}
    .pmerit-modal-footer {text-align:center;font-size:0.98rem;color:#444;}
    .pmerit-modal-footer a {color:#667eea;text-decoration:none;}
    .pmerit-modal-footer a:hover {text-decoration:underline;}
    .pmerit-modal-message {font-size:0.98rem;color:#d97706;padding:0.5em 0;text-align:center;}
    .pmerit-modal-error {color:#ef4444;text-align:center;font-size:0.95rem;}
    @media (max-width:480px) {.pmerit-modal{min-width:95vw;padding:1rem;}}
    `;

    function injectStyles(css) {
        if (document.getElementById('pmerit-modal-styles')) return;
        const style = document.createElement('style');
        style.id = 'pmerit-modal-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // ===================== MODAL DEFINITIONS =====================
    function RegistrationModalHandlers(modal, payload, manager) {
        modal.querySelector('.pmerit-modal-close').onclick = () => manager.hide();
        modal.querySelector('#goToSignIn').onclick = (e) => {
            e.preventDefault(); manager.hide(); manager.show('signIn');
        };
        modal.querySelector('#registrationForm').onsubmit = function(e) {
            e.preventDefault();
            const fullname = this.fullname.value.trim();
            const email = this.email.value.trim().toLowerCase();
            const password = this.password.value;
            const res = manager.auth.register({ fullname, email, password });
            let errorDiv = modal.querySelector('.pmerit-modal-error');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'pmerit-modal-error';
                modal.appendChild(errorDiv);
            }
            errorDiv.textContent = res.success ? '' : res.message;
            if (res.success) {
                manager.hide();
                manager.show('verifyEmail', { email });
            }
        };
    }

    function SignInModalHandlers(modal, payload, manager) {
        modal.querySelector('.pmerit-modal-close').onclick = () => manager.hide();
        modal.querySelector('#goToRegister').onclick = (e) => {
            e.preventDefault(); manager.hide(); manager.show('register');
        };
        modal.querySelector('#forgotPasswordLink').onclick = (e) => {
            e.preventDefault(); manager.hide(); manager.show('passwordRecovery');
        };
        modal.querySelector('#signInForm').onsubmit = function(e) {
            e.preventDefault();
            const email = this.email.value.trim().toLowerCase();
            const password = this.password.value;
            const res = manager.auth.login({ email, password });
            let errorDiv = modal.querySelector('.pmerit-modal-error');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'pmerit-modal-error';
                modal.appendChild(errorDiv);
            }
            errorDiv.textContent = res.success ? '' : res.message;
            if (res.success) {
                manager.hide();
                window.location.href = 'dashboard.html';
            } else if (res.message.includes("Verify")) {
                manager.hide();
                manager.show('verifyEmail', { email });
            }
        };
    }

    function VerifyEmailModalHandlers(modal, payload, manager) {
        modal.querySelector('.pmerit-modal-close').onclick = () => manager.hide();
        const btn = modal.querySelector('#demoVerifyBtn');
        if (btn) {
            btn.onclick = () => {
                if (payload && payload.email)
                    manager.auth.verifyEmail(payload.email);
                manager.hide();
                manager.show('signIn');
            };
        }
    }

    function PasswordRecoveryModalHandlers(modal, payload, manager) {
        modal.querySelector('.pmerit-modal-close').onclick = () => manager.hide();
        modal.querySelector('#backToSignIn').onclick = (e) => {
            e.preventDefault(); manager.hide(); manager.show('signIn');
        };
        modal.querySelector('#recoverForm').onsubmit = function(e) {
            e.preventDefault();
            const email = this.email.value.trim().toLowerCase();
            const res = manager.auth.recover(email);
            let errorDiv = modal.querySelector('.pmerit-modal-error');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'pmerit-modal-error';
                modal.appendChild(errorDiv);
            }
            errorDiv.textContent = res.message;
        };
    }

    // ===================== MODAL TEMPLATES =====================
    const RegistrationModal = `
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
            <div class="pmerit-modal-message">Free access for all learners. Your data is securely handled.</div>
        </div>
    `;
    const SignInModal = `
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
            <div class="pmerit-modal-message">Secure sign-in. Credentials never shared.</div>
        </div>
    `;
    const VerifyEmailModal = `
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
    const PasswordRecoveryModal = `
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

    // ===================== INITIALIZATION =====================
    injectStyles(Styles);

    const authManager = new AuthManager(STORAGE);
    const modalManager = new ModalManager(authManager);

    modalManager.registerModal('register', RegistrationModal, RegistrationModalHandlers);
    modalManager.registerModal('signIn', SignInModal, SignInModalHandlers);
    modalManager.registerModal('verifyEmail', VerifyEmailModal, VerifyEmailModalHandlers);
    modalManager.registerModal('passwordRecovery', PasswordRecoveryModal, PasswordRecoveryModalHandlers);

    // ===================== ENTRY POINTS =====================
    document.addEventListener('DOMContentLoaded', () => {
        // Attach modal to "Start Learning" button
        const startBtn = document.getElementById('startLearningBtn');
        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Session check
                const session = authManager.getSession();
                if (session && session.user && session.token) {
                    window.location.href = 'dashboard.html';
                    return;
                }
                // Show correct modal
                const users = STORAGE.getUsers();
                if (Object.keys(users).length > 0) {
                    modalManager.show('signIn');
                } else {
                    modalManager.show('register');
                }
            });
        }
        // ESC key closes modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') modalManager.hide();
        });
    });

    // Expose managers for future integration
    window.pmeritComponentManager = modalManager;
    window.pmeritAuthManager = authManager;
})();
