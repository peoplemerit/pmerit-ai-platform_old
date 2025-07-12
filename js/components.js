/**
 * PMERIT Modular Component System
 * File: js/components.js
 * Handles dynamic loading and rendering of UI components
 */

class ComponentManager {
    constructor() {
        this.components = new Map();
        this.initialized = false;
        this.currentModal = null;
    }

    init() {
        if (this.initialized) return;

        // Register components
        this.registerComponents();

        // Setup event listeners
        this.initializeEventListeners();

        this.initialized = true;
        console.log('✅ Component Manager initialized');
    }

    registerComponents() {
        // Registration Modal Component
        this.components.set('registration-modal', {
            name: 'Registration Modal',
            template: this.getRegistrationModalTemplate(),
            styles: this.getRegistrationModalStyles(),
            handlers: this.getRegistrationModalHandlers()
        });
        // Register more components here as needed
    }

    initializeEventListeners() {
        // "Start Learning" button triggers registration modal
        const startLearningBtn = document.getElementById('startLearningBtn');
        if (startLearningBtn) {
            startLearningBtn.href = '#';
            startLearningBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showComponent('registration-modal');
            });
        }

        // ESC key closes modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.hideCurrentModal();
            }
        });
    }

    showComponent(componentName) {
        const component = this.components.get(componentName);
        if (!component) {
            console.error(`Component not found: ${componentName}`);
            return;
        }

        // Remove any open modal
        this.hideCurrentModal(true);

        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.id = `${componentName}-container`;
        modalContainer.innerHTML = component.template;
        modalContainer.classList.add('pmerit-modal-container');

        // Add styles to head (if not already)
        this.addComponentStyles(componentName, component.styles);

        // Add to DOM
        document.body.appendChild(modalContainer);
        this.currentModal = modalContainer;

        // Attach component-specific handlers
        if (component.handlers) {
            component.handlers.call(this, modalContainer);
        }

        // Animate modal in
        requestAnimationFrame(() => {
            modalContainer.classList.add('active');
        });
    }

    hideCurrentModal(immediate = false) {
        if (!this.currentModal) return;

        this.currentModal.classList.remove('active');
        const modalToRemove = this.currentModal;
        this.currentModal = null;

        // Remove from DOM after animation or immediately
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

    // ===================== Registration Modal =====================

    getRegistrationModalTemplate() {
        return `
        <div class="pmerit-modal">
            <div class="pmerit-modal-header">
                <span class="pmerit-modal-title">Sign Up to Start Learning</span>
                <button class="pmerit-modal-close" aria-label="Close">&times;</button>
            </div>
            <form class="pmerit-modal-body" id="registrationForm">
                <input type="text" name="fullname" placeholder="Full Name" required />
                <input type="email" name="email" placeholder="Email Address" required />
                <input type="password" name="password" placeholder="Password" required minlength="6" />
                <button type="submit" class="btn btn-primary">Create Account</button>
            </form>
            <div class="pmerit-modal-footer">
                <span>Already have an account? <a href="signin.html">Sign In</a></span>
            </div>
        </div>
        `;
    }

    getRegistrationModalStyles() {
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
        .pmerit-modal-title { font-size: 1.3rem; font-weight: 600; }
        .pmerit-modal-close {
            background: none; border: none; font-size: 1.8rem; line-height: 1; cursor: pointer;
            color: #444;
        }
        .pmerit-modal-body { display: flex; flex-direction: column; gap: 0.9rem; }
        .pmerit-modal-body input {
            padding: 0.7rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;
        }
        .btn.btn-primary {
            background: #0a7cff; color: #fff; border: none; border-radius: 6px; padding: 0.8rem 1.2rem;
            font-size: 1.1rem; margin-top: 0.5rem; cursor: pointer;
        }
        .btn.btn-primary:hover { background: #085bb5; }
        .pmerit-modal-footer { text-align: center; font-size: 0.98rem; color: #444; }
        .pmerit-modal-footer a { color: #0a7cff; text-decoration: none;}
        .pmerit-modal-footer a:hover { text-decoration: underline;}
        `;
    }

// ====== COMPLETE SOLUTION 1: js/components.js Registration Fix ======
// Replace the getRegistrationModalHandlers() function

getRegistrationModalHandlers() {
    return function(modalContainer) {
        // Close button
        modalContainer.querySelector('.pmerit-modal-close').addEventListener('click', () => {
            this.hideCurrentModal();
        });

        // Registration form handler - COMPLETE SOLUTION
        const form = modalContainer.querySelector('#registrationForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullname = form.fullname.value.trim();
            const email = form.email.value.trim().toLowerCase();
            const password = form.password.value;

            if (!fullname || !email || password.length < 6) {
                alert('Please fill out all fields correctly.');
                return;
            }

            // Save user to localStorage (demo/frontend)
            const user = { name: fullname, email, password, verified: true };
            localStorage.setItem('gabriel_user', JSON.stringify(user));
            
            // Create session immediately
            const session = { 
                user: { name: fullname, email }, 
                token: "mock-token", 
                time: Date.now() 
            };
            localStorage.setItem('gabriel_session', JSON.stringify(session));

            // Success message and redirect
            alert(`Welcome, ${fullname}! Registration successful. Redirecting to your dashboard...`);
            this.hideCurrentModal();
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        });
    };
}

// Initialize the component manager on DOM load
window.addEventListener('DOMContentLoaded', () => {
    if (!window.pmeritComponentManager) {
        window.pmeritComponentManager = new ComponentManager();
        window.pmeritComponentManager.init();
    }
});
