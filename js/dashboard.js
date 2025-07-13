// ====== BROWSER-COMPATIBLE DASHBOARD.JS (No Babel Required) ======
// js/dashboard.js - ES5 Compatible Version

document.addEventListener('DOMContentLoaded', function() {
    // Session validation (ES5 compatible)
    var sessionStr = localStorage.getItem('gabriel_session') || '{}';
    var session = JSON.parse(sessionStr);
    
    if (!session.user || !session.user.email) {
        alert("Please sign in to access your dashboard.");
        window.location.href = "signin.html";
        return;
    }

    var user = session.user;

    // Personalized welcome message
    var welcomeEl = document.getElementById("dashboardWelcome");
    if (welcomeEl) {
        welcomeEl.textContent = "Welcome to PMERIT University Dashboard, " + user.name + "!";
    }

    // Initialize dashboard sections
    initializeEnrolledCourses(user);
    initializeNextLessons(user);
    setupQuickActions();

    console.log("✅ Dashboard loaded for " + user.name + " (" + user.email + ")");
});

function initializeEnrolledCourses(user) {
    var enrolledCoursesGrid = document.getElementById('enrolledCoursesGrid');
    if (!enrolledCoursesGrid) return;

    // Get user's enrolled courses
    var enrollmentsStr = localStorage.getItem('enrollments_' + user.email) || '[]';
    var enrollments = JSON.parse(enrollmentsStr);
    
    if (enrollments.length === 0) {
        enrolledCoursesGrid.innerHTML = 
            '<div class="empty-state" style="text-align: center; padding: 2rem; color: #666;">' +
                '<h3>📚 No courses enrolled yet</h3>' +
                '<p>Start your learning journey by exploring our course catalog!</p>' +
                '<a href="courses.html" class="btn" style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; display: inline-block; margin-top: 1rem;">Browse Courses</a>' +
            '</div>';
        return;
    }

    // Display enrolled courses (ES5 compatible)
    var courseHTML = '<div class="course-grid">';
    for (var i = 0; i < enrollments.length; i++) {
        var courseId = enrollments[i];
        var course = getCourseById(courseId);
        if (!course) continue;
        
        var progress = getProgress(user.email, courseId);
        courseHTML += 
            '<div class="course-card" data-track="' + course.track + '">' +
                '<span class="track-badge">' + getTrackLabel(course.track) + '</span>' +
                '<h3>' + course.title + '</h3>' +
                '<div class="course-info-row">' +
                    '<span class="info-label">Progress:</span> ' + progress + '%' +
                    '<span class="info-label">Duration:</span> ' + course.duration +
                '</div>' +
                '<div class="progress-bar" style="background: #f0f0f0; height: 8px; border-radius: 4px; margin: 0.5rem 0;">' +
                    '<div style="background: #667eea; height: 100%; width: ' + progress + '%; border-radius: 4px;"></div>' +
                '</div>' +
                '<button onclick="continueLesson(\'' + courseId + '\')" class="btn" style="background: #667eea; color: white; border: none; padding: 0.75rem; border-radius: 8px; width: 100%; cursor: pointer;">' +
                    (progress === 0 ? 'Start Course' : 'Continue Learning') +
                '</button>' +
            '</div>';
    }
    courseHTML += '</div>';
    enrolledCoursesGrid.innerHTML = courseHTML;
}

function initializeNextLessons(user) {
    var nextLessonsGrid = document.getElementById('nextLessonsGrid');
    if (!nextLessonsGrid) return;

    var enrollmentsStr = localStorage.getItem('enrollments_' + user.email) || '[]';
    var enrollments = JSON.parse(enrollmentsStr);
    
    if (enrollments.length === 0) {
        nextLessonsGrid.innerHTML = 
            '<div class="empty-state" style="text-align: center; padding: 2rem; color: #666;">' +
                '<h3>🎯 No upcoming lessons</h3>' +
                '<p>Enroll in courses to see your next lessons here!</p>' +
            '</div>';
        return;
    }

    // Show next lessons (ES5 compatible)
    var lessonsHTML = '<div class="course-grid">';
    var maxLessons = Math.min(3, enrollments.length);
    
    for (var i = 0; i < maxLessons; i++) {
        var courseId = enrollments[i];
        var course = getCourseById(courseId);
        if (!course) continue;
        
        var progress = getProgress(user.email, courseId);
        var nextLesson = getNextLesson(progress);
        
        lessonsHTML += 
            '<div class="course-card" data-track="' + course.track + '">' +
                '<span class="track-badge">' + getTrackLabel(course.track) + '</span>' +
                '<h4>Next: ' + course.title + '</h4>' +
                '<div class="course-info-row">' +
                    '<span class="info-label">Lesson:</span> ' + nextLesson +
                    '<span class="info-label">Est. Time:</span> 30 min' +
                '</div>' +
                '<button onclick="continueLesson(\'' + courseId + '\')" class="btn" style="background: #764ba2; color: white; border: none; padding: 0.75rem; border-radius: 8px; width: 100%; cursor: pointer;">' +
                    'Start Lesson' +
                '</button>' +
            '</div>';
    }
    lessonsHTML += '</div>';
    nextLessonsGrid.innerHTML = lessonsHTML;
}

function setupQuickActions() {
    // Course Hub navigation
    var courseHubBtn = document.getElementById("dashboardCourseHub");
    if (courseHubBtn) {
        courseHubBtn.addEventListener("click", function() {
            window.location.href = "courses.html";
        });
    }

    // Profile (coming soon)
    var profileBtn = document.getElementById("dashboardProfile");
    if (profileBtn) {
        profileBtn.addEventListener("click", function() {
            alert("Profile management coming soon! 👤");
        });
    }

    // Settings (coming soon)
    var settingsBtn = document.getElementById("dashboardSettings");
    if (settingsBtn) {
        settingsBtn.addEventListener("click", function() {
            alert("Settings panel coming soon! ⚙️");
        });
    }

    // Logout
    var logoutBtn = document.getElementById("logoutBtn");
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

// Helper functions (ES5 compatible)
function getCourseById(courseId) {
    // Simple fallback courses
    var fallbackCourses = {
        'digital-literacy': { id: 'digital-literacy', title: 'Digital Literacy & Remote Tools', track: 'core', duration: '4 hours' },
        'web-development': { id: 'web-development', title: 'Web Development Fundamentals', track: 'remote_careers', duration: '12 hours' },
        'career-communication': { id: 'career-communication', title: 'Career Communication Skills', track: 'core', duration: '3 hours' }
    };
    
    return fallbackCourses[courseId] || { id: courseId, title: 'Course', track: 'core', duration: '2 hours' };
}

function getTrackLabel(track) {
    var labels = {
        'core': 'Core Curriculum',
        'remote_careers': 'Remote Careers',
        'electives': 'Electives',
        'capstone': 'Capstone'
    };
    return labels[track] || track;
}

function getProgress(email, courseId) {
    var progressStr = localStorage.getItem('progress_' + email + '_' + courseId) || '0';
    var progress = parseInt(progressStr, 10);
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

// Global function for button clicks
window.continueLesson = function(courseId) {
    alert("Starting lesson for " + courseId + ". Virtual classroom coming soon! 🎓");
};

console.log("✅ Dashboard module loaded successfully (ES5 compatible)!");
