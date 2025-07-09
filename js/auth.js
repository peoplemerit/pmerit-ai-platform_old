let authState = {
    isAuthenticated: false,
    user: null,
    sessionToken: null
};

document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    checkExistingSession();
    initializeAuthButtons();
    console.log('🔐 Authentication module initialized');
}

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
    const startLearningBtn = document.querySelector('.btn-primary');
    
    if (signInBtn) {
        signInBtn.addEventListener('click', handleSignIn);
    }
    
    if (startLearningBtn) {
        startLearningBtn.addEventListener('click', handleStartLearning);
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
    if (window.chatModule && window.chatModule.addMessage) {
        window.chatModule.addMessage('ai', '🚀 Welcome to your learning journey! I\'m excited to help you discover your potential. Let\'s start by understanding your interests and goals. What would you like to learn about? You can also try our assessments in the right sidebar to get personalized recommendations!');
    } else {
        console.log('🚀 Start learning clicked');
    }
    
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
        chatContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

window.authModule = {
    handleSignIn,
    handleStartLearning
};

console.log('🔐 Gabriel AI Auth Module - Ready!');
<!-- 3. ADD THIS JAVASCRIPT TO js/auth.js OR js/main.js -->
<script>
/**
 * PMERIT User Registration System
 * Handles modal display, form validation, and submission
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeRegistrationModal();
});

function initializeRegistrationModal() {
    const modal = document.getElementById('signupModal');
    const form = document.getElementById('signupForm');
    const closeBtn = document.getElementById('closeSignup');
    const startLearningBtn = document.querySelector('.btn-primary'); // Adjust selector as needed
    
    // Character counter for intent textarea
    const intentTextarea = document.getElementById('userIntent');
    const charCounter = document.querySelector('.char-counter');
    
    // Career assessment dropdown
    const careerSelect = document.getElementById('careerAssessment');
    const assessmentPrompt = document.getElementById('assessmentPrompt');
    const assessmentLink = document.getElementById('takeAssessmentLink');

    // Modal state elements
    const formState = form.parentElement;
    const loadingState = document.getElementById('registrationLoading');
    const successState = document.getElementById('registrationSuccess');
    const errorState = document.getElementById('registrationError');

    // Event Listeners
    if (startLearningBtn) {
        startLearningBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showModal();
        });
    }

    closeBtn.addEventListener('click', hideModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });

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
            // Trigger assessment modal or navigate to assessment
            triggerCareerAssessment();
        });
    }

    // Form submission
    form.addEventListener('submit', handleRegistrationSubmit);

    // Success modal close
    document.getElementById('closeSuccessModal')?.addEventListener('click', hideModal);
    
    // Retry registration
    document.getElementById('retryRegistration')?.addEventListener('click', showFormState);

    console.log('✅ Registration modal initialized');

    // Helper Functions
    function showModal() {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        
        // Focus first input for accessibility
        setTimeout(() => {
            document.getElementById('userName')?.focus();
        }, 300);
    }

    function hideModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetForm();
    }

    function resetForm() {
        form.reset();
        updateCharCounter();
        assessmentPrompt.style.display = 'none';
        showFormState();
    }

    function showFormState() {
        formState.style.display = 'block';
        loadingState.style.display = 'none';
        successState.style.display = 'none';
        errorState.style.display = 'none';
    }

    function showLoadingState() {
        formState.style.display = 'none';
        loadingState.style.display = 'block';
        successState.style.display = 'none';
        errorState.style.display = 'none';
    }

    function showSuccessState() {
        formState.style.display = 'none';
        loadingState.style.display = 'none';
        successState.style.display = 'block';
        errorState.style.display = 'none';
    }

    function showErrorState(message = 'Registration failed. Please try again.') {
        formState.style.display = 'none';
        loadingState.style.display = 'none';
        successState.style.display = 'none';
        errorState.style.display = 'block';
        document.getElementById('errorMessage').textContent = message;
    }

    function updateCharCounter() {
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
        if (careerSelect.value === 'no') {
            assessmentPrompt.style.display = 'block';
        } else {
            assessmentPrompt.style.display = 'none';
        }
    }

    function triggerCareerAssessment() {
        // Hide registration modal
        hideModal();
        
        // Trigger career assessment (integrate with existing assessment system)
        // This should open the assessment modal or navigate to assessment page
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
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            intent: formData.get('intent').trim(),
            career_assessment: formData.get('career_assessment'),
            timestamp: new Date().toISOString()
        };

        // Basic validation
        if (!validateFormData(data)) {
            return;
        }

        showLoadingState();

        try {
            // BACKEND INTEGRATION PLACEHOLDER
            // Replace with your actual API endpoint
            const response = await submitRegistration(data);
            
            if (response.success) {
                showSuccessState();
                
                // Optional: Track registration event
                console.log('✅ User registered successfully:', data.email);
                
                // Optional: Send to analytics
                if (window.gtag) {
                    gtag('event', 'sign_up', {
                        method: 'PMERIT_registration'
                    });
                }
                
            } else {
                showErrorState(response.message || 'Registration failed. Please try again.');
            }
            
        } catch (error) {
            console.error('Registration error:', error);
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
        // BACKEND INTEGRATION PLACEHOLDER
        // This is where you'll integrate with your actual backend
        
        /* Example implementation:
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        return await response.json();
        */
        
        // Mock response for testing
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate success/failure
                const isSuccess = Math.random() > 0.1; // 90% success rate for testing
                
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
            }, 2000); // Simulate network delay
        });
    }
}

// Export for other modules if needed
window.registrationModule = {
    showRegistrationModal: function() {
        document.getElementById('signupModal').style.display = 'flex';
    }
};

console.log('🔐 PMERIT Registration System - Ready!');
</script>
