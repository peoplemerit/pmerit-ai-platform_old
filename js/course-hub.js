// ==========================
// PMERIT SUBJECT HUB - CLEAN VERSION
// Mission: Accessible, high-quality education through AI-powered learning
// ==========================

// 1. --- SESSION MANAGEMENT ---
// Utility to get current user from gabriel_session (as per auth.js)
function getCurrentStudentId() {
  const session = localStorage.getItem('gabriel_session');
  if (!session) return null;
  try {
    const data = JSON.parse(session);
    return data.userId || data.email || 'guest';
  } catch (e) { return null; }
}

// ==========================
// DATA STRUCTURES
// ==========================
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

// ==========================
// CART FLOW
// ==========================

// Add subject to cart
function addSubjectToCart(subjectId) {
  const studentId = getCurrentStudentId();
  if (!studentId) {
    alert("Please sign in to add subjects.");
    window.location.href = "signin.html";
    return;
  }
  let cart = JSON.parse(localStorage.getItem('subject_cart_' + studentId) || '[]');
  if (!cart.includes(subjectId)) cart.push(subjectId);
  localStorage.setItem('subject_cart_' + studentId, JSON.stringify(cart));
  showSubjectCartModal();
}

// Show subject cart modal using ComponentManager if available
function showSubjectCartModal() {
  const studentId = getCurrentStudentId();
  let cart = JSON.parse(localStorage.getItem('subject_cart_' + studentId) || '[]');
  let html = `<h2 style="margin-bottom:1rem;">📚 Subject Cart</h2>`;
  if (cart.length) {
    html += '<ul style="margin-bottom:1rem;">' + cart.map(id => {
      const subject = AVAILABLE_SUBJECTS.find(s => s.id === id);
      return subject ? `<li style="margin-bottom:0.5rem;">
        <strong>${subject.title}</strong>
        <button style="margin-left:1rem;" onclick="enrollInSubject('${studentId}', '${id}')">Register</button>
      </li>` : '';
    }).join('') + '</ul>';
  } else {
    html += '<p>No subjects added.</p>';
  }
  html += `<button onclick="closeCartModal()">Close</button>`;

  if (window.pmeritComponentManager) {
    window.pmeritComponentManager.showComponent('generic-modal');
    let modal = document.querySelector('.pmerit-modal');
    if (modal) modal.innerHTML = html;
  } else {
    // fallback: inject into courseCartModal div
    document.getElementById('courseCartModal').innerHTML =
      `<div class="pmerit-modal-container active"><div class="pmerit-modal">${html}</div></div>`;
  }
}

function closeCartModal() {
  if (window.pmeritComponentManager) {
    window.pmeritComponentManager.hideCurrentModal();
  } else {
    document.getElementById('courseCartModal').innerHTML = '';
  }
}

// Enroll in subject
function enrollInSubject(studentId, subjectId) {
  if (!STUDENT_ENROLLMENTS[studentId]) {
    STUDENT_ENROLLMENTS[studentId] = { subjects: [], progress: {} };
  }
  if (!STUDENT_ENROLLMENTS[studentId].subjects.includes(subjectId)) {
    STUDENT_ENROLLMENTS[studentId].subjects.push(subjectId);
    STUDENT_ENROLLMENTS[studentId].progress[subjectId] = 0;
    alert("Enrollment successful! You can now access the subject in your dashboard.");
  } else {
    alert("You're already enrolled in this subject.");
  }
  // Remove from cart
  let cart = JSON.parse(localStorage.getItem('subject_cart_' + studentId) || '[]');
  cart = cart.filter(id => id !== subjectId);
  localStorage.setItem('subject_cart_' + studentId, JSON.stringify(cart));
  closeCartModal();
  // Redirect to dashboard after enrollment
  window.location.href = "dashboard.html";
}

// ==========================
// DASHBOARD RENDERING
// ==========================

function updateDashboard(studentId) {
  // Enrolled Subjects
  const enrolledSubjectsGrid = document.getElementById('enrolledCoursesGrid');
  if (enrolledSubjectsGrid) {
    const enrolled = STUDENT_ENROLLMENTS[studentId]?.subjects || [];
    if (enrolled.length === 0) {
      enrolledSubjectsGrid.innerHTML = "<p>No subjects enrolled yet. <a href='courses.html'>Browse Subject Catalog</a></p>";
    } else {
      enrolledSubjectsGrid.innerHTML = enrolled.map(subjectId => {
        const subject = AVAILABLE_SUBJECTS.find(s => s.id === subjectId);
        if (!subject) return '';
        const progress = STUDENT_ENROLLMENTS[studentId].progress[subjectId] || 0;
        return `<div class="course-card">
          <h3>${subject.title}</h3>
          <div><strong>Track:</strong> ${ACADEMIC_TRACKS[subject.track]?.name || subject.track}</div>
          <div><strong>Progress:</strong> ${progress}%</div>
          <div><strong>Duration:</strong> ${subject.duration}</div>
          <button onclick="launchAIClassroom('${subjectId}')">Start AI Class</button>
        </div>`;
      }).join('');
    }
  }
  
  // Next Lessons (simple demo: list first lesson of each enrolled subject)
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
        return `<div class="course-card">
          <h4>Next: ${subject.title}</h4>
          <div><strong>Lesson:</strong> ${nextLesson}</div>
          <div><strong>Estimated Time:</strong> 30 minutes</div>
          <button onclick="launchAIClassroom('${subjectId}')">Continue Learning</button>
        </div>`;
      }).join('');
    }
  }
}

// ==========================
// ADMIN PANEL: SUBJECT CREATION
// ==========================
function addSubjectFromForm(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  // Handle materials (files)
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
    <div class="course-card">
      <h3>${s.title}</h3>
      <div><strong>Track:</strong> ${ACADEMIC_TRACKS[s.track]?.name || s.track}</div>
      <div><strong>Duration:</strong> ${s.duration}</div>
      <div><strong>Assessment:</strong> ${s.assessment}</div>
      <div><strong>Materials:</strong> ${s.materials.map(m => `<span>${m}</span>`).join(', ')}</div>
      <p>${s.description}</p>
    </div>
  `).join('');
}

// ==========================
// PAGE INTEGRATION & NAVIGATION
// ==========================

function launchAIClassroom(subjectId) {
  // Store current subject in session for classroom
  const session = JSON.parse(localStorage.getItem('gabriel_session') || '{}');
  session.currentSubject = subjectId;
  localStorage.setItem('gabriel_session', JSON.stringify(session));
  
  window.location.href = `classroom.html?subject=${subjectId}`;
}

// ==========================
// INIT CODE FOR EACH PAGE
// ==========================
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
      // Redirect to sign in if not authenticated
      window.location.href = 'signin.html';
    }
  }
  
  // Admin Panel
  const addSubjectForm = document.getElementById('addCourseForm');
  if (addSubjectForm) {
    addSubjectForm.addEventListener('submit', addSubjectFromForm);
    renderAdminSubjectList();
  }

  // Register generic modal with ComponentManager if available
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

// Render subject cards for catalog page
function renderSubjectCards() {
  const track = document.getElementById('trackFilter')?.value || '';
  const search = document.getElementById('searchInput')?.value?.toLowerCase() || '';
  
  let subjects = AVAILABLE_SUBJECTS.filter(subject =>
    (!track || subject.track === track) &&
    (!search || subject.title.toLowerCase().includes(search) || subject.description.toLowerCase().includes(search))
  );
  
  const cardsHtml = subjects.map(subject => `
    <div class="course-card">
      <h3>${subject.title}</h3>
      <div><b>Track:</b> ${ACADEMIC_TRACKS[subject.track]?.name || subject.track}</div>
      <div><b>Duration:</b> ${subject.duration}</div>
      <div><b>Assessment:</b> ${subject.assessment}</div>
      <div><b>Materials:</b> ${subject.materials.map(m => `<a href="materials/${m}" target="_blank">${m}</a>`).join(', ')}</div>
      <p>${subject.description}</p>
      <button onclick="addSubjectToCart('${subject.id}')">Add Subject to Cart</button>
    </div>
  `).join('');
  
  const courseCards = document.getElementById('courseCards');
  if (courseCards) {
    courseCards.innerHTML = `<div class="course-grid">${cardsHtml}</div>`;
  }
}

// ==========================
// EXPORTS FOR OTHER MODULES
// ==========================
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
