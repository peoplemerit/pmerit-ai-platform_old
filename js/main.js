let isConnected = false;
let isMobile = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 Gabriel AI Educational Platform - Initializing...');
    
    detectMobile();
    initializeMobileToggles();
    initializeActionItems();
    initializeAssessments();
    updateConnectionStatus();
    
    console.log('✅ Platform initialized successfully!');
});

function detectMobile() {
    isMobile = window.innerWidth <= 768;
    
    window.addEventListener('resize', function() {
        const wasMobile = isMobile;
        isMobile = window.innerWidth <= 768;
        
        if (wasMobile && !isMobile) {
            resetSidebarStates();
        }
    });
}

function resetSidebarStates() {
    const leftSidebar = document.getElementById('leftSidebar');
    const rightSidebar = document.getElementById('rightSidebar');
    
    if (leftSidebar) {
        leftSidebar.classList.remove('expanded');
        updateToggleText('leftToggle', false);
    }
    
    if (rightSidebar) {
        rightSidebar.classList.remove('expanded');
        updateToggleText('rightToggle', false);
    }
}

function initializeMobileToggles() {
    const leftToggle = document.getElementById('leftToggle');
    const rightToggle = document.getElementById('rightToggle');
    const leftSidebar = document.getElementById('leftSidebar');
    const rightSidebar = document.getElementById('rightSidebar');
    
    if (leftToggle && leftSidebar) {
        leftToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (isMobile) {
                const isExpanded = leftSidebar.classList.contains('expanded');
                
                if (isExpanded) {
                    leftSidebar.classList.remove('expanded');
                } else {
                    leftSidebar.classList.add('expanded');
                    if (rightSidebar) rightSidebar.classList.remove('expanded');
                    updateToggleText('rightToggle', false);
                }
                
                updateToggleText('leftToggle', !isExpanded);
            }
        });
    }
    
    if (rightToggle && rightSidebar) {
        rightToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (isMobile) {
                const isExpanded = rightSidebar.classList.contains('expanded');
                
                if (isExpanded) {
                    rightSidebar.classList.remove('expanded');
                } else {
                    rightSidebar.classList.add('expanded');
                    if (leftSidebar) leftSidebar.classList.remove('expanded');
                    updateToggleText('leftToggle', false);
                }
                
                updateToggleText('rightToggle', !isExpanded);
            }
        });
    }
    
    document.addEventListener('click', function(e) {
        if (isMobile) {
            const clickedInSidebar = e.target.closest('.sidebar-left') || e.target.closest('.sidebar-right');
            
            if (!clickedInSidebar) {
                if (leftSidebar) {
                    leftSidebar.classList.remove('expanded');
                    updateToggleText('leftToggle', false);
                }
                if (rightSidebar) {
                    rightSidebar.classList.remove('expanded');
                    updateToggleText('rightToggle', false);
                }
            }
        }
    });
    
    console.log('📱 Mobile sidebar toggles initialized');
}

function updateToggleText(toggleId, isExpanded) {
    const toggle = document.getElementById(toggleId);
    if (!toggle) return;
    
    if (toggleId === 'leftToggle') {
        toggle.textContent = isExpanded ? 
            '📱 Quick Actions - Tap to collapse ▲' : 
            '📱 Quick Actions - Tap to expand ▼';
    } else if (toggleId === 'rightToggle') {
        toggle.textContent = isExpanded ? 
            '🧠 Assessments - Tap to collapse ▲' : 
            '🧠 Assessments - Tap to expand ▼';
    }
}

function initializeActionItems() {
    const actionItems = document.querySelectorAll('.action-item');
    
    actionItems.forEach(item => {
        item.addEventListener('click', function() {
            const action = this.dataset.action;
            handleActionClick(action);
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    console.log('✅ Action items initialized');
}

function handleActionClick(action) {
    const responses = {
        'text-to-speech': '🎧 Text-to-speech feature is coming soon! This will help make our platform more accessible.',
        'dark-mode': '🌙 Dark mode is in development! We\'re designing a beautiful dark theme for comfortable learning.',
        'my-profile': '👤 Profile features are being developed! You\'ll be able to track your progress and achievements.',
        'settings': '⚙️ Settings panel is coming soon! You\'ll be able to customize your learning experience.',
        'assessments': '📋 Great choice! Our assessments help personalize your learning journey. Check out the assessment cards!',
        'subjects': '📚 Subject catalog is being built! We\'ll have comprehensive courses in Technology, Business, and Creative fields.',
        'progress': '📊 Progress tracking is in development! You\'ll be able to see your learning achievements and milestones.',
        'help': '❓ I\'m here to help! Feel free to ask me any questions about courses, learning paths, or platform features.'
    };
    
    const message = responses[action] || `✨ ${action} feature is coming soon! Thank you for your interest.`;
    
    if (window.chatModule && window.chatModule.addMessage) {
        window.chatModule.addMessage('ai', message);
    } else {
        console.log('Action clicked:', action, '-', message);
    }
}

function initializeAssessments() {
    const assessmentCards = document.querySelectorAll('.assessment-card');
    
    assessmentCards.forEach(card => {
        card.addEventListener('click', function() {
            const assessment = this.dataset.assessment;
            handleAssessmentClick(assessment);
            
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    console.log('✅ Assessment cards initialized');
}

function handleAssessmentClick(assessmentType) {
    const responses = {
        'learning-style': '🎯 Excellent! The Learning Style Assessment will help us understand how you learn best - whether you\'re a visual, auditory, or kinesthetic learner. This assessment is being finalized and will be available soon. In the meantime, tell me: do you prefer learning through videos, reading, or hands-on practice?',
        'interest-profiler': '💡 Perfect choice! The Interest Profiler will help identify subjects and career fields that match your natural interests and passions. This comprehensive assessment is in development. For now, what subjects or activities do you find most engaging? Technology, business, creative arts, or something else?'
    };
    
    const message = responses[assessmentType] || `✨ ${assessmentType} assessment is being developed! Thank you for your interest in personalized learning.`;
    
    if (window.chatModule && window.chatModule.addMessage) {
        window.chatModule.addMessage('ai', message);
    } else {
        console.log('Assessment clicked:', assessmentType, '-', message);
    }
}

function updateConnectionStatus() {
    const statusElement = document.querySelector('.status-connected');
    
    setTimeout(() => {
        isConnected = true;
        if (statusElement) {
            statusElement.textContent = '✅ Connected to Educational Services';
            statusElement.style.color = '#16a34a';
        }
        console.log('✅ Connected to educational services');
    }, 2000);
}

window.mainModule = {
    handleActionClick,
    handleAssessmentClick,
    updateConnectionStatus,
    isMobile: () => isMobile
};

console.log('📚 Gabriel AI Main Module - Ready!');
