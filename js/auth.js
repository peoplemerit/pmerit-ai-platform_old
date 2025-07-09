/**
 * PMERIT Authentication System - FIXED VERSION
 * Handles sign-in, registration modal, and user authentication
 */

let authState = {
    isAuthenticated: false,
    user: null,
    sessionToken: null
};

document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    initializeRegistrationModal(); // Add registration modal initialization
});

function initializeAuth() {
    checkExistingSession();
    initializeAuthButtons();
    console.log('🔐 Authentication module initialized');
}

function initializeRegistrationModal() {
    // FIXED: Use correct ID selector instead of class
    const startLearningBtn = document.getElementById('startLearningBtn');
    const modal = document.getElementById('signupModal');
    const form = document.getElementById('signupForm');
    const closeBtn = document.getElementById('closeSignup');
    
    // Check if required elements exist
    if (!startLearningBtn) {
        console.error('❌ Start Learning button not found! Check if ID="startLearningBtn" exists');
        return;
    }
    
    if (!modal) {
        console.error('❌ Registration modal not found! Check if signupModal HTML was added');
        return;
    }

    // Character counter for intent textarea
    const intentTextarea = document.getElementById('userIntent');
    const charCounter = document.querySelector('.char-counter');
    
    // Career assessment dropdown
    const careerSelect = document.getElementById('careerAssessment');
    const assessmentPrompt = document.getElementById('assessmentPrompt');
    const assessmentLink = document.getElementById('takeAssessmentLink');

    // Modal state elements
    const formState = form?.parentElement;
    const loadingState = document.getElementById('registrationLoading');
    const successState = document.getElementById('registrationSuccess');
    const errorState = document.getElementById('registrationError');

    // FIXED: Attach event listener to correct button
    startLearningBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🚀 Start Learning button clicked - showing modal');
        showModal();
    });

    // Close modal handlers
    if (closeBtn) {
        closeBtn.addEventListener('click', hideModal);
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideModal();
            }
        });
    }

    // Character counter
    if (intentTextarea && charCounter) {
        intentTextarea.addEventListener('input', updateCharCounter);
    }

    // Career assessment handling
    if (careerSelect && assessmentPrompt) {
        careerSelect.addEventListener('change', handleCareerAssessmentChange);
    }

    if (assessmentLink) {
        assessmentLink.addEventListener('click', function(e) {
            e.preventDefault();
            triggerCareerAssessment();
        });
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', handleRegistrationSubmit);
    }

    // Success modal close
    const closeSuccessBtn = document.getElementById('closeSuccessModal');
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', hideModal);
    }
    
    // Retry registration
    const retryBtn = document.getElementById('retryRegistration');
    if (retryBtn) {
        retryBtn.addEventListener('click', showFormState);
    }

    console.log('✅ Registration modal initialized successfully');

    // Helper Functions
    function showModal() {
        console.log('📋 Showing registration modal');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus first input for accessibility
        setTimeout(() => {
            const firstInput = document.getElementById('userName');
            if (firstInput) {
                firstInput.focus();
            }
        }, 300);
    }

    function hideModal() {
        console.log('❌ Hiding registration modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetForm();
    }

    function resetForm() {
        if (form) {
            form.reset();
        }
        if (updateCharCounter) {
            updateCharCounter();
        }
        if (assessmentPrompt) {
            assessmentPrompt.style.display = 'none';
        }
        showFormState();
    }

    function showFormState() {
        if (formState) formState.style.display = 'block';
        if (loadingState) loadingState.style.display = 'none';
        if (successState) successState.style.display = 'none';
        if (errorState) errorState.style.display = 'none';
    }

    function showLoadingState() {
        if (formState) formState.style.display = 'none';
        if (loadingState) loadingState.style.display = 'block';
        if (successState) successState.style.display = 'none';
        if (errorState) errorState.style.display = 'none';
    }

    function showSuccessState() {
        if (formState) formState.style.display = 'none';
        if (loadingState) loadingState.style.display = 'none';
        if (successState) successState.style.display = 'block';
        if (errorState) errorState.style.display = 'none';
    }

    function showErrorState(message = 'Registration failed. Please try again.') {
        if (formState) formState.style.display = 'none';
        if (loadingState) loadingState.style.display = 'none';
        if (successState) successState.style.display = 'none';
        if (errorState) errorState.style.display = 'block';
        
        const errorMsg = document.getElementById('errorMessage');
        if (errorMsg) {
            errorMsg.textContent = message;
        }
    }

    function updateCharCounter() {
        if (!intentTextarea || !charCounter) return;
        
        const count = intentTextarea.value.length;
        charCounter.textContent = `${count}/200`;
        
        charCounter.className = 'char-counter';
        if (count > 180) {
            charCounter.classList.add('danger');
        } else if (count > 160) {
            charCounter.classList.add('warning');
        }
    }

    function handleCareerAssessmentChange() {
        if (!careerSelect || !assessmentPrompt) return;
        
        if (careerSelect.value === 'no') {
            assessmentPrompt.style.display = 'block';
        } else {
            assessmentPrompt.style.display = 'none';
        }
    }

    function triggerCareerAssessment() {
        hideModal();
        
        // Trigger career assessment
        if (window.mainModule && window.mainModule.handleActionClick) {
            window.mainModule.handleActionClick('assessments');
        } else {
            // Fallback: scroll to assessment section
            const assessmentSection = document.querySelector('.assessment-cards');
            if (assessmentSection) {
                assessmentSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    async function handleRegistrationSubmit(e) {
        e.preventDefault();
        console.log('📝 Processing registration form submission');
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name')?.trim() || '',
            email: formData.get('email')?.trim() || '',
            intent: formData.get('intent')?.trim() || '',
            career_assessment: formData.get('career_assessment') || '',
            timestamp: new Date().toISOString()
        };

        console.log('📊 Registration data:', data);

        // Basic validation
        if (!validateFormData(data)) {
            return;
        }

        showLoadingState();

        try {
            const response = await submitRegistration(data);
            
            if (response.success) {
                console.log('✅ Registration successful');
                showSuccessState();
                
                // Optional: Track registration event
                if (window.gtag) {
                    gtag('event', 'sign_up', {
                        method: 'PMERIT_registration'
                    });
                }
                
            } else {
                console.log('❌ Registration failed:', response.message);
                showErrorState(response.message || 'Registration failed. Please try again.');
            }
            
        } catch (error) {
            console.error('💥 Registration error:', error);
            showErrorState('Network error. Please check your connection and try again.');
        }
    }

    function validateFormData(data) {
        if (data.name.length < 2) {
            alert('Please enter your full legal name (minimum 2 characters)');
            return false;
        }
        
        if (!data.email.includes('@')) {
            alert('Please enter a valid email address');
            return false;
        }
        
        if (data.intent.length < 10) {
            alert('Please provide more detail about your learning goals (minimum 10 characters)');
            return false;
        }
        
        if (!data.career_assessment) {
            alert('Please indicate whether you have taken the career assessment');
            return false;
        }
        
        return true;
    }

    async function submitRegistration(data) {
        // MOCK IMPLEMENTATION - Replace with your actual backend
        console.log('🔄 Submitting registration (mock implementation)');
        
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate success/failure
                const isSuccess = Math.random() > 0.2; // 80% success rate for testing
                
                if (isSuccess) {
                    resolve({
                        success: true,
                        message: 'Registration successful! Please check your email.',
                        user_id: 'mock_' + Date.now()
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Email already exists. Please use a different email or sign in.'
                    });
                }
            }, 2000);
        });
    }
}

// Original auth functions (keep these)
function checkExistingSession() {
    const savedSession = localStorage.getItem('gabriel_session');
    if (savedSession) {
        try {
            const sessionData = JSON.parse(savedSession);
            console.log('📱 Found existing session data');
        } catch (e) {
            console.log('⚠️ Invalid session data found, clearing...');
            localStorage.removeItem('gabriel_session');
        }
    }
}

function initializeAuthButtons() {
    const signInBtn = document.querySelector('.btn-signin');
    
    if (signInBtn) {
        signInBtn.addEventListener('click', handleSignIn);
    }
}

function handleSignIn() {
    if (window.chatModule && window.chatModule.addMessage) {
        window.chatModule.addMessage('ai', '🔐 Sign in functionality is coming soon! We\'re building a secure authentication system. For now, you can explore our educational content and assessments without signing in.');
    } else {
        alert('Sign in functionality coming soon!');
    }
    
    console.log('🔐 Sign in clicked');
}

function handleStartLearning() {
    // This function is now replaced by the modal system
    console.log('🚀 Start learning - opening registration modal');
    
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Export functions for other modules
window.authModule = {
    handleSignIn,
    handleStartLearning,
    showRegistrationModal: function() {
        const modal = document.getElementById('signupModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }
};

console.log('🔐 PMERIT Authentication System - Ready!');
