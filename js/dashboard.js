// ====== COMPLETE SOLUTION 3: js/dashboard.js - Personalized Dashboard ======
// Create this new file: js/dashboard.js

// js/dashboard.js - PMERIT Personalized Dashboard Manager

document.addEventListener('DOMContentLoaded', function() {
    // Session validation - redirect if not logged in
    const session = JSON.parse(localStorage.getItem('gabriel_session') || '{}');
    if (!session.user || !session.user.email) {
        alert("Please sign in to access your dashboard.");
        window.location.href = "signin.html";
        return;
    }

    const user = session.user;

    // Personalized welcome message
    const welcomeEl = document.getElementById("dashboardWelcome");
    if (welcomeEl) {
        welcomeEl.textContent = `Welcome to PMERIT University Dashboard, ${user.name}!`;
    }

    // Initialize dashboard sections
    initializeEnrolledCourses(user);
    initializeNextLessons(user);
    setupQuickActions();

    console.log(`✅ Dashboard loaded for ${user.name} (${user.email})`);
});

function initializeEnrolledCourses(user) {
    const enrolledCoursesGrid = document.getElementById('enrolledCoursesGrid');
    if (!enrolledCoursesGrid) return;

    // Get user's enrolled courses from localStorage
    const enrollments = JSON.parse(localStorage.getItem(`enrollments_${user.email}`) || '[]');
    
    if (enrollments.length === 0) {
        enrolledCoursesGrid.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 2rem; color: #666;">
                <h3>📚 No courses enrolled yet</h3>
                <p>Start your learning journey by exploring our course catalog!</p>
                <a href="courses.html" class="btn" style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; display: inline-block; margin-top: 1rem;">Browse Courses</a>
            </div>
        `;
        return;
    }

    // Display enrolled courses
    enrolledCoursesGrid.innerHTML = `
        <div class="course-grid">
            ${enrollments.map(courseId => {
                const course = getCourseById(courseId);
                if (!course) return '';
                
                const progress = getProgress(user.email, courseId);
                return `
                    <div class="course-card" data-track="${course.track}">
                        <span class="track-badge">${getTrackLabel(course.track)}</span>
                        <h3>${course.title}</h3>
                        <div class="course-info-row">
                            <span class="info-label">Progress:</span> ${progress}%
                            <span class="info-label">Duration:</span> ${course.duration}
                        </div>
                        <div class="progress-bar" style="background: #f0f0f0; height: 8px; border-radius: 4px; margin: 0.5rem 0;">
                            <div style="background: #667eea; height: 100%; width: ${progress}%; border-radius: 4px;"></div>
                        </div>
                        <button onclick="continueLesson('${courseId}')" class="btn" style="background: #667eea; color: white; border: none; padding: 0.75rem; border-radius: 8px; width: 100%; cursor: pointer;">
                            ${progress === 0 ? 'Start Course' : 'Continue Learning'}
                        </button>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function initializeNextLessons(user) {
    const nextLessonsGrid = document.getElementById('nextLessonsGrid');
    if (!nextLessonsGrid) return;

    const enrollments = JSON.parse(localStorage.getItem(`enrollments_${user.email}`) || '[]');
    
    if (enrollments.length === 0) {
        nextLessonsGrid.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 2rem; color: #666;">
                <h3>🎯 No upcoming lessons</h3>
                <p>Enroll in courses to see your next lessons here!</p>
            </div>
        `;
        return;
    }

    // Show next lessons for enrolled courses
    nextLessonsGrid.innerHTML = `
        <div class="course-grid">
            ${enrollments.slice(0, 3).map(courseId => {
                const course = getCourseById(courseId);
                if (!course) return '';
                
                const progress = getProgress(user.email, courseId);
                const nextLesson = getNextLesson(progress);
                
                return `
                    <div class="course-card" data-track="${course.track}">
                        <span class="track-badge">${getTrackLabel(course.track)}</span>
                        <h4>Next: ${course.title}</h4>
                        <div class="course-info-row">
                            <span class="info-label">Lesson:</span> ${nextLesson}
                            <span class="info-label">Est. Time:</span> 30 min
                        </div>
                        <button onclick="continueLesson('${courseId}')" class="btn" style="background: #764ba2; color: white; border: none; padding: 0.75rem; border-radius: 8px; width: 100%; cursor: pointer;">
                            Start Lesson
                        </button>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function setupQuickActions() {
    // Course Hub navigation
    const courseHubBtn = document.getElementById("dashboardCourseHub");
    if (courseHubBtn) {
        courseHubBtn.addEventListener("click", function() {
            window.location.href = "courses.html";
        });
    }

    // Profile (coming soon)
    const profileBtn = document.getElementById("dashboardProfile");
    if (profileBtn) {
        profileBtn.addEventListener("click", function() {
            alert("Profile management coming soon! 👤");
        });
    }

    // Settings (coming soon)
    const settingsBtn = document.getElementById("dashboardSettings");
    if (settingsBtn) {
        settingsBtn.addEventListener("click", function() {
            alert("Settings panel coming soon! ⚙️");
        });
    }

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            if (window.PMERIT_AUTH && window.PMERIT_AUTH.handleLogout) {
                window.PMERIT_AUTH.handleLogout();
            } else {
                localStorage.removeItem('gabriel_session');
                alert("Logged out successfully!");
                window.location.href = "index.html";
            }
        });
    }
}

// Helper functions
function getCourseById(courseId) {
    // Get from global AVAILABLE_SUBJECTS if available
    if (window.AVAILABLE_SUBJECTS) {
        return window.AVAILABLE_SUBJECTS.find(course => course.id === courseId);
    }
    
    // Fallback course data
    const fallbackCourses = {
        'digital-literacy': { id: 'digital-literacy', title: 'Digital Literacy & Remote Tools', track: 'core', duration: '4 hours' },
        'web-development': { id: 'web-development', title: 'Web Development Fundamentals', track: 'remote_careers', duration: '12 hours' }
    };
    
    return fallbackCourses[courseId] || { id: courseId, title: 'Course', track: 'core', duration: '2 hours' };
}

function getTrackLabel(track) {
    const labels = {
        'core': 'Core Curriculum',
        'remote_careers': 'Remote Careers',
        'electives': 'Electives',
        'capstone': 'Capstone'
    };
    return labels[track] || track;
}

function getProgress(email, courseId) {
    const progress = JSON.parse(localStorage.getItem(`progress_${email}_${courseId}`) || '0');
    return Math.min(100, Math.max(0, progress));
}

function getNextLesson(progress) {
    if (progress === 0) return "Introduction";
    if (progress < 25) return "Lesson 2";
    if (progress < 50) return "Lesson 3";
    if (progress < 75) return "Lesson 4";
    if (progress < 100) return "Final Assessment";
    return "Course Complete";
}

// Global functions for button clicks
window.continueLesson = function(courseId) {
    // For now, just redirect to course hub or show coming soon
    alert(`Starting lesson for ${courseId}. Virtual classroom coming soon! 🎓`);
    // Future: window.location.href = `classroom.html?course=${courseId}`;
};

console.log("✅ Dashboard module loaded successfully!");
