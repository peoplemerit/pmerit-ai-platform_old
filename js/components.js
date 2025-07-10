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

    async init() {
        if (this.initialized) return;
        
        console.log('🏗️ Initializing Component Manager...');
        
        // Register all available components
        this.registerComponents();
        
        // Initialize event listeners
        this.initializeEventListeners();
        
        this.initialized = true;
        console.log('✅ Component Manager initialized successfully');
    }

    registerComponents() {
        // Registration Modal Component
        this.components.set('registration-modal', {
            name: 'Registration Modal',
            template: this.getRegistrationModalTemplate(),
            styles: this.getRegistrationModalStyles(),
            handlers: this.getRegistrationModalHandlers()
        });

        console.log(`📦 Registered ${this.components.size} components`);
    }

    initializeEventListeners() {
        // Listen for Start Learning button
        const startLearningBtn = document.querySelector('a[href="dashboard.html"]');
        if (startLearningBtn) {
            startLearningBtn.href = '#';
            startLearningBtn.id = 'startLearningBtn';
            startLearningBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showComponent('registration-modal');
                console.log('🚀 Start Learning clicked - loading registration modal');
            });
            console.log('✅ Start Learning button configured for component system');
        }

        // Global escape key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.hideCurrentModal();
            }
        });
    }

    async showComponent(componentName) {
        const component = this.components.get(componentName);
        if (!component) {
            console.error(`❌ Component not found: ${componentName}`);
            return;
        }

        console.log(`📱 Loading component: ${component.name}`);

        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.id = `${componentName}-container`;
        modalContainer.innerHTML = component.template;

        // Add styles if not already added
        this.addComponentStyles(componentName, component.styles);

        // Add to DOM
        document.body.appendChild(modalContainer);
        this.currentModal = modalContainer;

        // Initialize component handlers
        if (component.handlers) {
            component.handlers.call(this, modalContainer);
        }

        // Show with animation
        requestAnimationFrame(() => {
            modalContainer.classList.add('active');
        });

        console.log(`✅ Component loaded: ${component.name}`);
    }

    hideCurrentModal() {
        if (!this.currentModal) return;

        this.currentModal.classList.remove('active');
        
        setTimeout(() => {
            if (this.currentModal && this.currentModal.parentNode) {
                this.currentModal.parentNode.removeChild(this.currentModal);
            }
            this.currentModal = null;
        }, 300);

        console.log('🔄 Modal hidden');
    }

    addComponentStyles(componentName, styles) {
        const styleId = `${componentName}-styles`;
        if (document.getElementById(styleId)) return;

        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    getRegistrationModalTemplate() {
        return `
        <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div class="modal-container">
                <!-- Step 1: Role Selection -->
                <div class="modal-step" id="roleSelection">
                    <div class="modal-header">
                        <h2 id="modal-title">🎓 Join PMERIT</h2>
                        <p>Choose your path to accessible, high-quality education</p>
                        <button class="modal-close" aria-label="Close modal">&times;</button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="role-selection">
                            <div class="role-card" data-role="student">
                                <div class="role-icon">👨‍🎓</div>
                                <h3>I'm a Student</h3>
                                <p>Ready to learn new skills and advance my career through accessible education</p>
                                <div class="role-features">
                                    <span class="feature">📚 Access to all courses</span>
                                    <span class="feature">🎯 Personalized learning paths</span>
                                    <span class="feature">🤖 AI-powered guidance</span>
                                </div>
                            </div>
                            
                            <div class="role-card" data-role="educator">
                                <div class="role-icon">👩‍🏫</div>
                                <h3>I'm an Educator</h3>
                                <p>Passionate about teaching and helping others achieve their learning goals</p>
                                <div class="role-features">
                                    <span class="feature">📖 Course creation tools</span>
                                    <span class="feature">📊 Student analytics</span>
                                    <span class="feature">🌍 Global reach</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 2: Registration Form -->
                <div class="modal-step" id="registrationForm" style="display: none;">
                    <div class="modal-header">
                        <button class="back-button" aria-label="Go back">←</button>
                        <h2>Create Your Account</h2>
                        <p>Start your learning journey - First attempt always free!</p>
                        <button class="modal-close" aria-label="Close modal">&times;</button>
                    </div>
                    
                    <div class="modal-body">
                        <form id="registrationFormElement" novalidate>
                            <div class="form-group">
                                <label for="fullName">Full Name <span class="required">*</span></label>
                                <input type="text" id="fullName" name="fullName" required minlength="2" maxlength="80" 
                                       placeholder="Enter your full legal name">
                                <span class="form-error" id="fullNameError"></span>
                            </div>

                            <div class="form-group">
                                <label for="email">Email Address <span class="required">*</span></label>
                                <input type="email" id="email" name="email" required 
                                       placeholder="Enter your email address">
                                <span class="form-error" id="emailError"></span>
                            </div>

                            <div class="form-group">
                                <label for="learningGoals">What do you hope to achieve? <span class="required">*</span></label>
                                <textarea id="learningGoals" name="learningGoals" required maxlength="200" 
                                          placeholder="Describe your learning goals and what you hope to accomplish..."
                                          rows="3"></textarea>
                                <div class="char-counter">
                                    <span id="goalsCharCount">0</span>/200
                                </div>
                                <span class="form-error" id="learningGoalsError"></span>
                            </div>

                            <div class="form-group">
                                <label for="careerAssessment">Have you taken a career assessment before?</label>
                                <select id="careerAssessment" name="careerAssessment">
                                    <option value="">Select an option</option>
                                    <option value="yes">Yes, I have</option>
                                    <option value="no">No, I haven't</option>
                                    <option value="unsure">I'm not sure</option>
                                </select>
                                <div class="assessment-prompt" id="assessmentPrompt" style="display: none;">
                                    <p>📋 Great! We recommend starting with our free career assessment to personalize your learning experience.</p>
                                </div>
                            </div>

                            <div class="privacy-notice">
                                <p><strong>🔒 Your Privacy Matters:</strong> We collect only essential information to personalize your learning experience. Your data is never shared and you control your privacy settings.</p>
                            </div>

                            <button type="submit" class="submit-button" id="createAccountBtn">
                                <span class="button-text">Create My Account</span>
                                <span class="button-loader" style="display: none;">Creating...</span>
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Step 3: Success Message -->
                <div class="modal-step" id="successMessage" style="display: none;">
                    <div class="modal-header">
                        <h2>🎉 Welcome to PMERIT!</h2>
                        <p>Your account has been created successfully</p>
                    </div>
                    
                    <div class="modal-body">
                        <div class="success-content">
                            <div class="success-icon">✅</div>
                            <h3>Registration Successful!</h3>
                            <p>We've sent a confirmation email to <strong id="confirmedEmail"></strong></p>
                            
                            <div class="next-steps">
                                <h4>What's Next?</h4>
                                <div class="step-item">
                                    <span class="step-number">1</span>
                                    <span class="step-text">Check your email and verify your account</span>
                                </div>
                                <div class="step-item">
                                    <span class="step-number">2</span>
                                    <span class="step-text">Complete your learning profile</span>
                                </div>
                                <div class="step-item">
                                    <span class="step-number">3</span>
                                    <span class="step-text">Start your first course for free!</span>
                                </div>
                            </div>
                            
                            <div class="action-buttons">
                                <button class="btn-primary" id="getStartedBtn">Get Started</button>
                                <button class="btn-secondary" id="resendEmailBtn">Resend Email</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    getRegistrationModalStyles() {
        return `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            padding: 1rem;
        }

        .modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .modal-container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            transform: scale(0.9) translateY(20px);
            transition: transform 0.3s ease;
        }

        .modal-overlay.active .modal-container {
            transform: scale(1) translateY(0);
        }

        .modal-header {
            padding: 2rem 2rem 1rem;
            border-bottom: 1px solid #e9ecef;
            position: relative;
            text-align: center;
        }

        .modal-header h2 {
            color: #667eea;
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
            font-weight: 700;
        }

        .modal-header p {
            color: #666;
            font-size: 0.95rem;
            margin: 0;
        }

        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #999;
            cursor: pointer;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        }

        .modal-close:hover {
            background: #f0f0f0;
            color: #333;
        }

        .back-button {
            position: absolute;
            top: 1rem;
            left: 1rem;
            background: none;
            border: none;
            font-size: 1.2rem;
            color: #667eea;
            cursor: pointer;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        }

        .back-button:hover {
            background: rgba(102, 126, 234, 0.1);
        }

        .modal-body {
            padding: 1.5rem 2rem 2rem;
        }

        .role-selection {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
        }

        .role-card {
            border: 2px solid #e9ecef;
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: #fafafa;
        }

        .role-card:hover {
            border-color: #667eea;
            background: rgba(102, 126, 234, 0.05);
            transform: translateY(-2px);
        }

        .role-card.selected {
            border-color: #667eea;
            background: rgba(102, 126, 234, 0.1);
        }

        .role-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        .role-card h3 {
            color: #333;
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
        }

        .role-card p {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 1rem;
            line-height: 1.4;
        }

        .role-features {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .feature {
            font-size: 0.8rem;
            color: #667eea;
            font-weight: 500;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #333;
            font-size: 0.9rem;
        }

        .required {
            color: #e74c3c;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 0.9rem;
            transition: border-color 0.2s ease;
            font-family: inherit;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group textarea {
            resize: vertical;
            min-height: 80px;
        }

        .char-counter {
            text-align: right;
            font-size: 0.8rem;
            color: #999;
            margin-top: 0.25rem;
        }

        .form-error {
            display: block;
            color: #e74c3c;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        .form-error.show {
            opacity: 1;
        }

        .assessment-prompt {
            margin-top: 0.75rem;
            padding: 1rem;
            background: rgba(102, 126, 234, 0.05);
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }

        .assessment-prompt p {
            margin: 0;
            font-size: 0.85rem;
            color: #667eea;
        }

        .privacy-notice {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid #28a745;
            margin-bottom: 1.5rem;
        }

        .privacy-notice p {
            margin: 0;
            font-size: 0.85rem;
            color: #333;
            line-height: 1.4;
        }

        .submit-button {
            width: 100%;
            padding: 0.875rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
        }

        .submit-button:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .submit-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }

        .button-loader {
            display: none;
        }

        .submit-button.loading .button-text {
            display: none;
        }

        .submit-button.loading .button-loader {
            display: inline;
        }

        .success-content {
            text-align: center;
        }

        .success-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }

        .success-content h3 {
            color: #28a745;
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }

        .next-steps {
            margin: 2rem 0;
            text-align: left;
        }

        .next-steps h4 {
            color: #333;
            margin-bottom: 1rem;
            text-align: center;
        }

        .step-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 0.75rem;
        }

        .step-number {
            background: #667eea;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: 600;
            flex-shrink: 0;
        }

        .action-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
        }

        .btn-primary, .btn-secondary {
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
        }

        .btn-primary {
            background: #667eea;
            color: white;
        }

        .btn-primary:hover {
            background: #5a6fd8;
            transform: translateY(-1px);
        }

        .btn-secondary {
            background: transparent;
            color: #667eea;
            border: 2px solid #667eea;
        }

        .btn-secondary:hover {
            background: #667eea;
            color: white;
        }

        @media (max-width: 768px) {
            .modal-container {
                margin: 1rem;
                max-height: 95vh;
            }

            .modal-header {
                padding: 1.5rem 1.5rem 1rem;
            }

            .modal-body {
                padding: 1rem 1.5rem 1.5rem;
            }

            .role-selection {
                grid-template-columns: 1fr;
                gap: 1rem;
            }

            .role-card {
                padding: 1.25rem;
            }

            .action-buttons {
                flex-direction: column;
            }
        }`;
    }

    getRegistrationModalHandlers() {
        return function(modalContainer) {
            const roleSelection = modalContainer.querySelector('#roleSelection');
            const registrationForm = modalContainer.querySelector('#registrationForm');
            const successMessage = modalContainer.querySelector('#successMessage');
            const roleCards = modalContainer.querySelectorAll('.role-card');
            const backButton = modalContainer.querySelector('.back-button');
            const closeButtons = modalContainer.querySelectorAll('.modal-close');
            const form = modalContainer.querySelector('#registrationFormElement');
            const learningGoalsTextarea = modalContainer.querySelector('#learningGoals');
            const charCounter = modalContainer.querySelector('#goalsCharCount');
            const careerAssessmentSelect = modalContainer.querySelector('#careerAssessment');
            const assessmentPrompt = modalContainer.querySelector('#assessmentPrompt');

            let selectedRole = null;

            // Handle role selection
            roleCards.forEach(card => {
                card.addEventListener('click', () => {
                    // Remove previous selection
                    roleCards.forEach(c => c.classList.remove('selected'));
                    
                    // Select current card
                    card.classList.add('selected');
                    selectedRole = card.dataset.role;
                    
                    // Proceed to form after short delay
                    setTimeout(() => {
                        roleSelection.style.display = 'none';
                        registrationForm.style.display = 'block';
                    }, 300);
                });
            });

            // Handle back button
            if (backButton) {
                backButton.addEventListener('click', () => {
                    registrationForm.style.display = 'none';
                    roleSelection.style.display = 'block';
                });
            }

            // Handle close buttons
            closeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.hideCurrentModal();
                });
            });

            // Handle modal overlay click
            modalContainer.parentElement.addEventListener('click', (e) => {
                if (e.target === modalContainer.parentElement) {
                    this.hideCurrentModal();
                }
            });

            // Character counter
            if (learningGoalsTextarea && charCounter) {
                learningGoalsTextarea.addEventListener('input', () => {
                    const count = learningGoalsTextarea.value.length;
                    charCounter.textContent = count;
                    
                    if (count > 180) {
                        charCounter.style.color = '#e74c3c';
                    } else if (count > 150) {
                        charCounter.style.color = '#f39c12';
                    } else {
                        charCounter.style.color = '#999';
                    }
                });
            }

            // Career assessment prompt
            if (careerAssessmentSelect && assessmentPrompt) {
                careerAssessmentSelect.addEventListener('change', () => {
                    if (careerAssessmentSelect.value === 'no') {
                        assessmentPrompt.style.display = 'block';
                    } else {
                        assessmentPrompt.style.display = 'none';
                    }
                });
            }

            // Form submission
            if (form) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    if (this.validateForm(form)) {
                        await this.submitRegistration(form, selectedRole, registrationForm, successMessage);
                    }
                });
            }

            // Success actions
            const getStartedBtn = modalContainer.querySelector('#getStartedBtn');
            const resendEmailBtn = modalContainer.querySelector('#resendEmailBtn');

            if (getStartedBtn) {
                getStartedBtn.addEventListener('click', () => {
                    this.hideCurrentModal();
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                });
            }

            if (resendEmailBtn) {
                resendEmailBtn.addEventListener('click', () => {
                    console.log('📧 Resending confirmation email...');
                    // Implementation for resending email
                });
            }
        };
    }

    validateForm(form) {
        const formData = new FormData(form);
        let isValid = true;

        // Validate full name
        const fullName = formData.get('fullName').trim();
        if (fullName.length < 2 || fullName.length > 80) {
            this.showError('fullNameError', 'Name must be between 2 and 80 characters');
            isValid = false;
        } else {
            this.hideError('fullNameError');
        }

        // Validate email
        const email = formData.get('email').trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError('emailError', 'Please enter a valid email address');
            isValid = false;
        } else {
            this.hideError('emailError');
        }

        // Validate learning goals
        const learningGoals = formData.get('learningGoals').trim();
        if (learningGoals.length < 10) {
            this.showError('learningGoalsError', 'Please provide more details about your goals (at least 10 characters)');
            isValid = false;
        } else {
            this.hideError('learningGoalsError');
        }

        return isValid;
    }

    showError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    hideError(errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    async submitRegistration(form, selectedRole, registrationForm, successMessage) {
        const submitButton = form.querySelector('#createAccountBtn');
        const formData = new FormData(form);
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        try {
            // BACKEND INTEGRATION PLACEHOLDER
            // In real implementation, this would be:
            /*
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: formData.get('fullName'),
                    email: formData.get('email'),
                    learningGoals: formData.get('learningGoals'),
                    careerAssessment: formData.get('careerAssessment'),
                    role: selectedRole
                })
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            */

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success
            const email = formData.get('email');
            document.getElementById('confirmedEmail').textContent = email;
            
            registrationForm.style.display = 'none';
            successMessage.style.display = 'block';

            console.log('✅ Registration successful');

        } catch (error) {
            console.error('❌ Registration failed:', error);
            alert('Registration failed. Please try again.');
        } finally {
            // Reset button state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }
}

// Initialize component manager when DOM is ready
let componentManager;

document.addEventListener('DOMContentLoaded', async () => {
    componentManager = new ComponentManager();
    await componentManager.init();
});

// Export for global access
window.ComponentManager = ComponentManager;
window.componentManager = componentManager;
