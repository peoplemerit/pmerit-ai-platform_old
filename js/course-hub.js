// ==========================
// PMERIT SUBJECT HUB - ENHANCED VERSION (2024)
// Mission: Accessible, high-quality education through AI-powered learning
// ==========================

// SESSION MANAGEMENT
function getCurrentStudentId() {
  const session = localStorage.getItem('gabriel_session');
  if (!session) return null;
  try {
    const data = JSON.parse(session);
    return data.userId || data.email || 'guest';
  } catch (e) { return null; }
}

// DATA STRUCTURES
const ACADEMIC_TRACKS = {
  core: {
    name: "Core Curriculum",
    required: true,
    subjects: ["digital-literacy", "career-communication", "critical-thinking", "time-management", "freelancing-intro"]
  },
  remote_careers: {
    name: "Remote Career Specializations",
    tracks: ["admin-va", "tech-fundamentals", "content-creation", "data-research", "customer-support"]
  },
  electives: {
    name: "Electives",
    subjects: ["personal-branding", "financial-literacy"]
  }
};

const AVAILABLE_SUBJECTS = [
  // ------------------ CORE CURRICULUM ------------------
  {
    id: "digital-literacy",
    title: "Digital Literacy & Remote Tools",
    track: "core",
    duration: "4 hours",
    assessment: "Quiz + Tool Practice",
    materials: ["google-workspace-guide.pdf", "remote-tools-checklist.pdf"],
    description: "Master essential digital tools for remote work success"
  },
  {
    id: "career-communication",
    title: "Career Communication Skills",
    track: "core",
    duration: "3 hours",
    assessment: "Assignment + AI Review",
    materials: ["communication-strategies.pdf"],
    description: "Develop effective workplace communication skills"
  },
  {
    id: "critical-thinking",
    title: "Critical Thinking & Problem Solving",
    track: "core",
    duration: "5 hours",
    assessment: "Case Study Analysis",
    materials: ["critical-thinking-framework.pdf"],
    description: "Develop analytical skills for complex problem solving"
  },
  {
    id: "time-management",
    title: "Time Management & Productivity",
    track: "core",
    duration: "3 hours",
    assessment: "Personal Productivity Plan",
    materials: ["productivity-tools-guide.pdf"],
    description: "Master time management for remote work success"
  },
  {
    id: "freelancing-intro",
    title: "Introduction to Freelancing Platforms",
    track: "core",
    duration: "3 hours",
    assessment: "Quiz + Profile Setup",
    materials: [],
    description: "Learn how to set up profiles and navigate major freelancing platforms."
  },

  // ------------------ REMOTE CAREER SPECIALIZATIONS ------------------
  {
    id: "calendar-inbox-management",
    title: "Calendar & Inbox Management",
    track: "remote_careers",
    duration: "5 hours",
    assessment: "Practical Tasks",
    materials: [],
    description: "Organize schedules and manage communications for remote teams."
  },
  {
    id: "crm-tools",
    title: "CRM Tools (HubSpot)",
    track: "remote_careers",
    duration: "5 hours",
    assessment: "CRM Simulation",
    materials: [],
    description: "Master customer relationship management using HubSpot."
  },
  {
    id: "html-css-git",
    title: "HTML, CSS, Git, GitHub",
    track: "remote_careers",
    duration: "6 hours",
    assessment: "Code Submission",
    materials: [],
    description: "Learn web basics and version control with Git and GitHub."
  },
  {
    id: "apis-lowcode",
    title: "Intro to APIs & Low-Code Tools",
    track: "remote_careers",
    duration: "6 hours",
    assessment: "App Build Challenge",
    materials: [],
    description: "Build a simple app using APIs and low-code platforms."
  },
  {
    id: "seo-writing",
    title: "SEO Writing Basics",
    track: "remote_careers",
    duration: "5 hours",
    assessment: "Article Draft",
    materials: [],
    description: "Write SEO-friendly articles for online audiences."
  },
  {
    id: "creative-ai-writing",
    title: "Blog & Creative Writing with AI",
    track: "remote_careers",
    duration: "5 hours",
    assessment: "Creative AI Output",
    materials: [],
    description: "Harness AI for creative blog and content writing."
  },
  {
    id: "internet-research",
    title: "Internet Research & Data Sourcing",
    track: "remote_careers",
    duration: "5 hours",
    assessment: "Data Collection Task",
    materials: [],
    description: "Find, collect, and organize data from online sources."
  },
  {
    id: "excel-sql",
    title: "Excel & Basic SQL",
    track: "remote_careers",
    duration: "5 hours",
    assessment: "Spreadsheet Test",
    materials: [],
    description: "Analyze data with spreadsheets and basic SQL queries."
  },
  {
    id: "helpdesk-tools",
    title: "Helpdesk Tools (Zendesk, Intercom)",
    track: "remote_careers",
    duration: "5 hours",
    assessment: "Roleplay Simulation",
    materials: [],
    description: "Support customers using helpdesk software and platforms."
  },
  {
    id: "conflict-resolution",
    title: "Conflict Resolution & Customer Experience",
    track: "remote_careers",
    duration: "5 hours",
    assessment: "Conflict Scenario Response",
    materials: [],
    description: "Handle difficult customer scenarios and resolve conflicts."
  },
  {
    id: "web-development",
    title: "Web Development Fundamentals",
    track: "remote_careers",
    duration: "12 hours",
    assessment: "Portfolio Project",
    materials: ["html-css-guide.pdf", "javascript-basics.pdf"],
    description: "Learn to build modern websites and web applications"
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing Essentials",
    track: "remote_careers",
    duration: "8 hours",
    assessment: "Marketing Campaign",
    materials: ["social-media-strategy.pdf", "seo-fundamentals.pdf"],
    description: "Master online marketing strategies and tools"
  },

  // ------------------ ELECTIVES ------------------
  {
    id: "personal-branding",
    title: "Personal Branding",
    track: "electives",
    duration: "3 hours",
    assessment: "Pitch Presentation",
    materials: [],
    description: "Craft and present your personal brand for remote success."
  },
  {
    id: "financial-literacy",
    title: "Financial Literacy for Freelancers",
    track: "electives",
    duration: "2 hours",
    assessment: "Budget Sheet",
    materials: [],
    description: "Learn budgeting and financial management for freelancers."
  },

  // ------------------ CAPSTONE ------------------
  {
    id: "portfolio-project",
    title: "Portfolio / Client Project",
    track: "capstone",
    duration: "10 hours",
    assessment: "Project Portfolio + Video",
    materials: [],
    description: "Complete a client-ready project and present your work."
  }
];

const STUDENT_ENROLLMENTS = {}; // { studentId: { subjects: [], progress: {} } }
const SUBJECT_MATERIALS = {
  "digital-literacy": ["google-workspace-guide.pdf", "remote-tools-checklist.pdf"],
  "career-communication": ["communication-strategies.pdf"],
  "critical-thinking": ["critical-thinking-framework.pdf"],
  "time-management": ["productivity-tools-guide.pdf"],
  "web-development": ["html-css-guide.pdf", "javascript-basics.pdf"],
  "digital-marketing": ["social-media-strategy.pdf", "seo-fundamentals.pdf"]
};

// CART FLOW
// ====== COMPLETE SOLUTION 5: js/course-hub.js Integration Fix ======
// ====== BROWSER-COMPATIBLE COURSE-HUB.JS INTEGRATION ======
// Enhanced Cart Protection & Enrollment (ES5 Compatible)

// Enhanced Cart Protection with Complete Authentication Integration (ES5)
function addSubjectToCart(subjectId) {
    // Check authentication using the new auth system (ES5 compatible)
    var sessionStr = localStorage.getItem('gabriel_session') || '{}';
    var session = JSON.parse(sessionStr);
    
    if (!session.user || !session.user.email) {
        alert("Please sign in to add subjects to your cart.");
        window.location.href = "signin.html";
        return;
    }

    var studentId = session.user.email;
    
    // Button loading state (ES5 compatible)
    var btn = document.querySelector('button[data-subject-id="' + subjectId + '"]');
    if (btn) {
        btn.classList.add('loading');
        btn.disabled = true;
        btn.textContent = 'Adding...';
        
        setTimeout(function() {
            btn.classList.remove('loading');
            btn.disabled = false;
            btn.textContent = 'Added to Cart ✓';
            
            // Reset button after 2 seconds
            setTimeout(function() {
                btn.textContent = 'Add Subject to Cart';
            }, 2000);
        }, 1200);
    }

    // Get or create cart for this user (ES5 compatible)
    var cartStr = localStorage.getItem('subject_cart_' + studentId) || '[]';
    var cart = JSON.parse(cartStr);
    
    // Check if already in cart
    if (cart.indexOf(subjectId) !== -1) {
        alert("This subject is already in your cart!");
        return;
    }
    
    // Add to cart
    cart.push(subjectId);
    localStorage.setItem('subject_cart_' + studentId, JSON.stringify(cart));
    
    // Show success and cart modal
    console.log("✅ Added " + subjectId + " to cart for " + session.user.name);
    showSubjectCartModal();
}

// Enhanced Cart Modal with Enrollment (ES5 Compatible)
function showSubjectCartModal() {
    var sessionStr = localStorage.getItem('gabriel_session') || '{}';
    var session = JSON.parse(sessionStr);
    if (!session.user) return;
    
    var studentId = session.user.email;
    var cartStr = localStorage.getItem('subject_cart_' + studentId) || '[]';
    var cart = JSON.parse(cartStr);
    
    var html = '<div style="max-width: 500px;">' +
        '<h2 style="margin-bottom: 1rem; color: #667eea;">📚 Your Subject Cart</h2>';
    
    if (cart.length === 0) {
        html += '<div style="text-align: center; padding: 2rem; color: #666;">' +
            '<p>Your cart is empty.</p>' +
            '<button onclick="closeCartModal()" style="background: #667eea; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; margin-top: 1rem;">Continue Browsing</button>' +
            '</div>';
    } else {
        html += '<div style="margin-bottom: 1.5rem;">';
        
        // ES5 compatible cart display
        for (var i = 0; i < cart.length; i++) {
            var subjectId = cart[i];
            var subject = getSubjectById(subjectId);
            if (subject) {
                html += '<div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem; background: white;">' +
                    '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                        '<div>' +
                            '<h4 style="margin: 0 0 0.25rem 0; color: #333;">' + subject.title + '</h4>' +
                            '<p style="margin: 0; font-size: 0.85rem; color: #666;">' + subject.track + ' • ' + subject.duration + '</p>' +
                        '</div>' +
                        '<div style="display: flex; gap: 0.5rem;">' +
                            '<button onclick="enrollInSubject(\'' + studentId + '\', \'' + subjectId + '\')" ' +
                                'style="background: #22c55e; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">' +
                                'Enroll FREE' +
                            '</button>' +
                            '<button onclick="removeFromCart(\'' + studentId + '\', \'' + subjectId + '\')" ' +
                                'style="background: #ef4444; color: white; border: none; padding: 0.5rem 0.75rem; border-radius: 6px; cursor: pointer;">' +
                                '×' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            }
        }
        
        html += '</div>';
        
        html += '<div style="text-align: center; padding-top: 1rem; border-top: 1px solid #e5e7eb;">' +
            '<button onclick="enrollInAllCartItems(\'' + studentId + '\')" ' +
                'style="background: #667eea; color: white; border: none; padding: 0.75rem 2rem; border-radius: 8px; cursor: pointer; font-size: 1rem; margin-right: 0.5rem;">' +
                'Enroll in All (FREE)' +
            '</button>' +
            '<button onclick="closeCartModal()" ' +
                'style="background: #6b7280; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">' +
                'Continue Browsing' +
            '</button>' +
        '</div>';
    }
    
    html += '</div>';

    // Show modal (ES5 compatible fallback)
    document.body.insertAdjacentHTML('beforeend', 
        '<div id="cartModal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem;">' +
            '<div style="background: white; border-radius: 12px; padding: 2rem; max-width: 90vw; max-height: 85vh; overflow-y: auto;">' +
                html +
            '</div>' +
        '</div>'
    );
}

// Enroll in single subject (ES5 Compatible)
function enrollInSubject(studentId, subjectId) {
    var sessionStr = localStorage.getItem('gabriel_session') || '{}';
    var session = JSON.parse(sessionStr);
    
    // Get current enrollments
    var enrollmentsStr = localStorage.getItem('enrollments_' + studentId) || '[]';
    var enrollments = JSON.parse(enrollmentsStr);
    
    // Check if already enrolled
    if (enrollments.indexOf(subjectId) !== -1) {
        alert("You're already enrolled in this subject!");
        return;
    }
    
    // Add to enrollments
    enrollments.push(subjectId);
    localStorage.setItem('enrollments_' + studentId, JSON.stringify(enrollments));
    
    // Initialize progress
    localStorage.setItem('progress_' + studentId + '_' + subjectId, '0');
    
    // Remove from cart
    var cartStr = localStorage.getItem('subject_cart_' + studentId) || '[]';
    var cart = JSON.parse(cartStr);
    var newCart = [];
    
    // ES5 compatible filter
    for (var i = 0; i < cart.length; i++) {
        if (cart[i] !== subjectId) {
            newCart.push(cart[i]);
        }
    }
    localStorage.setItem('subject_cart_' + studentId, JSON.stringify(newCart));
    
    // Get subject name for success message
    var subject = getSubjectById(subjectId);
    var subjectName = subject ? subject.title : 'the subject';
    
    alert("🎉 Enrollment successful! You're now enrolled in \"" + subjectName + "\". Check your dashboard to start learning!");
    
    // Refresh cart modal or close if empty
    if (newCart.length === 0) {
        closeCartModal();
        // Optionally redirect to dashboard
        if (confirm("Would you like to go to your dashboard to start learning?")) {
            window.location.href = "dashboard.html";
        }
    } else {
        showSubjectCartModal(); // Refresh modal
    }
    
    console.log("✅ " + session.user.name + " enrolled in " + subjectId);
}

// Enroll in all cart items (ES5 Compatible)
function enrollInAllCartItems(studentId) {
    var cartStr = localStorage.getItem('subject_cart_' + studentId) || '[]';
    var cart = JSON.parse(cartStr);
    
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    var enrollmentsStr = localStorage.getItem('enrollments_' + studentId) || '[]';
    var enrollments = JSON.parse(enrollmentsStr);
    var newEnrollments = 0;
    
    // ES5 compatible enrollment loop
    for (var i = 0; i < cart.length; i++) {
        var subjectId = cart[i];
        if (enrollments.indexOf(subjectId) === -1) {
            enrollments.push(subjectId);
            localStorage.setItem('progress_' + studentId + '_' + subjectId, '0');
            newEnrollments++;
        }
    }
    
    // Save enrollments
    localStorage.setItem('enrollments_' + studentId, JSON.stringify(enrollments));
    
    // Clear cart
    localStorage.setItem('subject_cart_' + studentId, '[]');
    
    closeCartModal();
    
    if (newEnrollments > 0) {
        var message = "🎉 Excellent! You've enrolled in " + newEnrollments + " subject" + (newEnrollments > 1 ? 's' : '') + ". Check your dashboard to start learning!";
        alert(message);
        if (confirm("Would you like to go to your dashboard now?")) {
            window.location.href = "dashboard.html";
        }
    } else {
        alert("You're already enrolled in all these subjects!");
    }
}

// Remove from cart (ES5 Compatible)
function removeFromCart(studentId, subjectId) {
    var cartStr = localStorage.getItem('subject_cart_' + studentId) || '[]';
    var cart = JSON.parse(cartStr);
    var newCart = [];
    
    // ES5 compatible filter
    for (var i = 0; i < cart.length; i++) {
        if (cart[i] !== subjectId) {
            newCart.push(cart[i]);
        }
    }
    localStorage.setItem('subject_cart_' + studentId, JSON.stringify(newCart));
    
    // Refresh modal
    showSubjectCartModal();
}

// Close cart modal (ES5 Compatible)
function closeCartModal() {
    var modal = document.getElementById('cartModal');
    if (modal) {
        modal.remove();
    }
}

// Helper function to get subject by ID (ES5 Compatible)
function getSubjectById(subjectId) {
    // Check if global AVAILABLE_SUBJECTS exists
    if (window.AVAILABLE_SUBJECTS) {
        for (var i = 0; i < window.AVAILABLE_SUBJECTS.length; i++) {
            if (window.AVAILABLE_SUBJECTS[i].id === subjectId) {
                return window.AVAILABLE_SUBJECTS[i];
            }
        }
    }
    
    // Fallback course data
    var fallbackCourses = {
        'digital-literacy': { id: 'digital-literacy', title: 'Digital Literacy & Remote Tools', track: 'core', duration: '4 hours' },
        'web-development': { id: 'web-development', title: 'Web Development Fundamentals', track: 'remote_careers', duration: '12 hours' },
        'career-communication': { id: 'career-communication', title: 'Career Communication Skills', track: 'core', duration: '3 hours' },
        'critical-thinking': { id: 'critical-thinking', title: 'Critical Thinking & Problem Solving', track: 'core', duration: '5 hours' },
        'time-management': { id: 'time-management', title: 'Time Management & Productivity', track: 'core', duration: '3 hours' }
    };
    
    return fallbackCourses[subjectId] || { id: subjectId, title: 'Course', track: 'core', duration: '2 hours' };
}

// Enhanced getCurrentStudentId function (ES5 Compatible)
function getCurrentStudentId() {
    var sessionStr = localStorage.getItem('gabriel_session') || '{}';
    var session = JSON.parse(sessionStr);
    return session.user ? session.user.email : null;
}

// Add authentication check function for cart (ES5 Compatible)
window.checkAuthForCart = function() {
    var sessionStr = localStorage.getItem('gabriel_session') || '{}';
    var session = JSON.parse(sessionStr);
    return session.user && session.user.email;
};

// Make functions globally available
window.enrollInSubject = enrollInSubject;
window.enrollInAllCartItems = enrollInAllCartItems;
window.removeFromCart = removeFromCart;
window.closeCartModal = closeCartModal;

console.log("✅ Enhanced Course Hub with authentication integration loaded (ES5 compatible)!");

// Enhanced getCurrentStudentId function
function getCurrentStudentId() {
    const session = JSON.parse(localStorage.getItem('gabriel_session') || '{}');
    return session.user ? session.user.email : null;
}

// Add authentication check function for cart
window.checkAuthForCart = function() {
    const session = JSON.parse(localStorage.getItem('gabriel_session') || '{}');
    return session.user && session.user.email;
};

console.log("✅ Enhanced Course Hub with authentication integration loaded!");
  // Next Lessons
  const nextLessonsGrid = document.getElementById('nextLessonsGrid');
  if (nextLessonsGrid) {
    const enrolled = STUDENT_ENROLLMENTS[studentId]?.subjects || [];
    if (enrolled.length === 0) {
      nextLessonsGrid.innerHTML = "<p>No lessons scheduled yet.</p>";
    } else {
      nextLessonsGrid.innerHTML = enrolled.map(subjectId => {
        const subject = AVAILABLE_SUBJECTS.find(s => s.id === subjectId);
        if (!subject) return '';
        const progress = STUDENT_ENROLLMENTS[studentId].progress[subjectId] || 0;
        const nextLesson = progress === 0 ? "Introduction" : `Lesson ${Math.floor(progress/10) + 1}`;
        return `
        <div class="course-card" data-track="${subject.track}">
          <span class="track-badge">${ACADEMIC_TRACKS[subject.track]?.name || subject.track}</span>
          <h4>Next: ${subject.title}</h4>
          <div class="course-info-row">
            <span class="info-label">Lesson:</span> ${nextLesson}
            <span class="info-label">Estimated Time:</span> 30 minutes
          </div>
          <button onclick="launchAIClassroom('${subjectId}')">Continue Learning</button>
        </div>`;
      }).join('');
    }
  }
}

// ADMIN PANEL: SUBJECT CREATION
function addSubjectFromForm(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  let materials = [];
  if (form.materials && form.materials.files) {
    materials = Array.from(form.materials.files).map(file => file.name);
  }
  AVAILABLE_SUBJECTS.push({
    id: data.title.replace(/\s+/g, '-').toLowerCase(),
    title: data.title,
    track: data.track,
    duration: data.duration,
    assessment: data.assessment,
    materials: materials,
    description: data.description
  });
  renderAdminSubjectList();
  form.reset();
  alert("Subject added successfully!");
}

function renderAdminSubjectList() {
  const adminSubjectList = document.getElementById('adminCourseList');
  if (!adminSubjectList) return;
  adminSubjectList.innerHTML = AVAILABLE_SUBJECTS.map(s => `
    <div class="course-card" data-track="${s.track}">
      <span class="track-badge">${ACADEMIC_TRACKS[s.track]?.name || s.track}</span>
      <h3>${s.title}</h3>
      <div class="course-info-row">
        <span class="info-label">Duration:</span> ${s.duration}
        <span class="info-label">Assessment:</span> ${s.assessment}
        <span class="material-indicator">${s.materials.length} materials</span>
      </div>
      <p>${s.description}</p>
      <div>
        ${s.materials.map(m => `<span class="material-indicator">${m}</span>`).join(' ')}
      </div>
    </div>
  `).join('');
}

// PAGE INTEGRATION & NAVIGATION
function launchAIClassroom(subjectId) {
  const session = JSON.parse(localStorage.getItem('gabriel_session') || '{}');
  session.currentSubject = subjectId;
  localStorage.setItem('gabriel_session', JSON.stringify(session));
  window.location.href = `classroom.html?subject=${subjectId}`;
}

// INIT CODE FOR EACH PAGE
document.addEventListener('DOMContentLoaded', function() {
  // Subject Catalog Page
  if (document.getElementById('courseCards')) {
    renderSubjectCards();
    const trackFilter = document.getElementById('trackFilter');
    const searchInput = document.getElementById('searchInput');
    if (trackFilter) trackFilter.addEventListener('change', renderSubjectCards);
    if (searchInput) searchInput.addEventListener('input', renderSubjectCards);
  }

  // Dashboard Page
  if (document.getElementById('enrolledCoursesGrid')) {
    const studentId = getCurrentStudentId();
    if (studentId) {
      updateDashboard(studentId);
    } else {
      window.location.href = 'signin.html';
    }
  }

  // Admin Panel
  const addSubjectForm = document.getElementById('addCourseForm');
  if (addSubjectForm) {
    addSubjectForm.addEventListener('submit', addSubjectFromForm);
    renderAdminSubjectList();
  }

  // Register generic modal (if needed)
  if (window.pmeritComponentManager && !window.pmeritComponentManager.components.has('generic-modal')) {
    window.pmeritComponentManager.components.set('generic-modal', {
      name: 'Generic Modal',
      template: '<div class="pmerit-modal"></div>',
      styles: `
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
        }
      `,
      handlers: null
    });
  }
});

// SUBJECT CARD RENDERING - ENHANCED
function renderSubjectCards() {
  const track = document.getElementById('trackFilter')?.value || '';
  const search = document.getElementById('searchInput')?.value?.toLowerCase() || '';
  let subjects = AVAILABLE_SUBJECTS.filter(subject =>
    (!track || subject.track === track) &&
    (!search || subject.title.toLowerCase().includes(search) || subject.description.toLowerCase().includes(search))
  );
  const cardsHtml = subjects.map(subject => `
    <div class="course-card" data-track="${subject.track}" tabindex="0" aria-label="${subject.title}">
      <span class="track-badge">${ACADEMIC_TRACKS[subject.track]?.name || subject.track}</span>
      <h3>${subject.title}</h3>
      <div class="course-info-row">
        <span class="info-label">Duration:</span> ${subject.duration}
        <span class="info-label">Assessment:</span> ${subject.assessment}
        <span class="material-indicator">${subject.materials.length} materials</span>
      </div>
      <p>${subject.description}</p>
      <div>
        ${subject.materials.map(m => `<a href="materials/${m}" target="_blank" class="material-indicator" rel="noopener">${m}</a>`).join(' ')}
      </div>
      <button data-subject-id="${subject.id}" onclick="addSubjectToCart('${subject.id}')">Add Subject to Cart</button>
    </div>
  `).join('');
  const courseCards = document.getElementById('courseCards');
  if (courseCards) {
    courseCards.innerHTML = `<div class="course-grid">${cardsHtml}</div>`;
  }
}

// EXPORTS FOR OTHER MODULES
window.PMERIT_SUBJECT_HUB = {
  addSubjectToCart,
  enrollInSubject,
  getCurrentStudentId,
  updateDashboard,
  launchAIClassroom,
  showSubjectCartModal,
  AVAILABLE_SUBJECTS,
  ACADEMIC_TRACKS
};

// Legacy support for existing function names
window.addCourseToCart = addSubjectToCart;
window.enrollInCourse = enrollInSubject;
window.launchAIClass = launchAIClassroom;

// ==========================
// END PMERIT SUBJECT HUB
// ==========================
