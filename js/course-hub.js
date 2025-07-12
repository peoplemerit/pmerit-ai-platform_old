// ==========================
// PMERIT Course Hub Updates
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
const CURRICULUM_TRACKS = {
  core: {
    name: "Core Curriculum",
    required: true,
    courses: ["digital-literacy", "career-communication", "critical-thinking", "time-management", "freelancing-intro"]
  },
  remote_careers: {
    name: "Remote Career Specializations",
    tracks: ["admin-va", "tech-fundamentals", "content-creation", "data-research", "customer-support"]
  },
  electives: {
    name: "Electives",
    courses: ["personal-branding", "financial-literacy"]
  }
};

const SAMPLE_COURSES = [
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
  // ... more courses
];

const STUDENT_ENROLLMENTS = {}; // { studentId: { courses: [], progress: {} } }
const COURSE_MATERIALS = {
  "digital-literacy": ["google-workspace-guide.pdf", "remote-tools-checklist.pdf"],
  "career-communication": ["communication-strategies.pdf"]
};

// ==========================
// CART FLOW
// ==========================

// Add course to cart
function addCourseToCart(courseId) {
  const studentId = getCurrentStudentId();
  if (!studentId) {
    alert("Please sign in to add courses.");
    window.location.href = "signin.html";
    return;
  }
  let cart = JSON.parse(localStorage.getItem('course_cart_' + studentId) || '[]');
  if (!cart.includes(courseId)) cart.push(courseId);
  localStorage.setItem('course_cart_' + studentId, JSON.stringify(cart));
  showCourseCartModal();
}

// Show course cart modal using ComponentManager if available
function showCourseCartModal() {
  const studentId = getCurrentStudentId();
  let cart = JSON.parse(localStorage.getItem('course_cart_' + studentId) || '[]');
  let html = `<h2 style="margin-bottom:1rem;">📚 Subject Cart</h2>`;
  if (cart.length) {
    html += '<ul style="margin-bottom:1rem;">' + cart.map(id => {
      const course = SAMPLE_COURSES.find(c => c.id === id);
      return course ? `<li style="margin-bottom:0.5rem;">
        <strong>${course.title}</strong>
        <button style="margin-left:1rem;" onclick="enrollInCourse('${studentId}', '${id}')">Register</button>
      </li>` : '';
    }).join('') + '</ul>';
  } else {
    html += '<p>No courses added.</p>';
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

// Enroll in course
function enrollInCourse(studentId, courseId) {
  if (!STUDENT_ENROLLMENTS[studentId]) {
    STUDENT_ENROLLMENTS[studentId] = { courses: [], progress: {} };
  }
  if (!STUDENT_ENROLLMENTS[studentId].courses.includes(courseId)) {
    STUDENT_ENROLLMENTS[studentId].courses.push(courseId);
    STUDENT_ENROLLMENTS[studentId].progress[courseId] = 0;
    alert("Enrollment successful! You can now access the course in your dashboard.");
  } else {
    alert("You're already enrolled in this course.");
  }
  // Remove from cart
  let cart = JSON.parse(localStorage.getItem('course_cart_' + studentId) || '[]');
  cart = cart.filter(id => id !== courseId);
  localStorage.setItem('course_cart_' + studentId, JSON.stringify(cart));
  closeCartModal();
  // Redirect to dashboard after enrollment
  window.location.href = "dashboard.html";
}

// ==========================
// DASHBOARD RENDERING
// ==========================

function updateDashboard(studentId) {
  // Enrolled Courses
  const enrolledCoursesGrid = document.getElementById('enrolledCoursesGrid');
  if (enrolledCoursesGrid) {
    const enrolled = STUDENT_ENROLLMENTS[studentId]?.courses || [];
    if (enrolled.length === 0) {
      enrolledCoursesGrid.innerHTML = "<p>No courses enrolled yet.</p>";
    } else {
      enrolledCoursesGrid.innerHTML = enrolled.map(courseId => {
        const course = SAMPLE_COURSES.find(c => c.id === courseId);
        if (!course) return '';
        const progress = STUDENT_ENROLLMENTS[studentId].progress[courseId] || 0;
        return `<div class="course-card">
          <h3>${course.title}</h3>
          <div>Progress: ${progress}%</div>
          <button onclick="launchAIClass('${courseId}')">Start AI Class</button>
        </div>`;
      }).join('');
    }
  }
  // Next Lessons (simple demo: list first lesson of each enrolled course)
  const nextLessonsGrid = document.getElementById('nextLessonsGrid');
  if (nextLessonsGrid) {
    const enrolled = STUDENT_ENROLLMENTS[studentId]?.courses || [];
    if (enrolled.length === 0) {
      nextLessonsGrid.innerHTML = "<p>No lessons scheduled yet.</p>";
    } else {
      nextLessonsGrid.innerHTML = enrolled.map(courseId => {
        const course = SAMPLE_COURSES.find(c => c.id === courseId);
        if (!course) return '';
        return `<div class="course-card">
          <h4>Next Lesson for ${course.title}</h4>
          <div>Lesson 1: Introduction</div>
          <button onclick="launchAIClass('${courseId}')">Continue</button>
        </div>`;
      }).join('');
    }
  }
}

// ==========================
// ADMIN PANEL: COURSE CREATION
// ==========================
function addCourseFromForm(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  // Handle materials (files)
  let materials = [];
  if (form.materials && form.materials.files) {
    materials = Array.from(form.materials.files).map(file => file.name);
  }
  SAMPLE_COURSES.push({
    id: data.title.replace(/\s+/g, '-').toLowerCase(),
    title: data.title,
    track: data.track,
    duration: data.duration,
    assessment: data.assessment,
    materials: materials,
    description: data.description
  });
  renderAdminCourseList();
  form.reset();
}

function renderAdminCourseList() {
  const adminCourseList = document.getElementById('adminCourseList');
  if (!adminCourseList) return;
  adminCourseList.innerHTML = SAMPLE_COURSES.map(c => `
    <div class="course-card">
      <h3>${c.title}</h3>
      <div>Track: ${CURRICULUM_TRACKS[c.track]?.name || c.track}</div>
      <div>Duration: ${c.duration}</div>
      <div>Assessment: ${c.assessment}</div>
      <div>Materials: ${c.materials.map(m => `<span>${m}</span>`).join(', ')}</div>
      <p>${c.description}</p>
    </div>
  `).join('');
}

// ==========================
// PAGE INTEGRATION & NAVIGATION
// ==========================

function launchAIClass(courseId) {
  window.location.href = `classroom.html?course=${courseId}`;
}

// ==========================
// INIT CODE FOR EACH PAGE
// ==========================
document.addEventListener('DOMContentLoaded', function() {
  // Courses Page
  if (document.getElementById('courseCards')) {
    renderCourseCards();
    document.getElementById('trackFilter').addEventListener('change', renderCourseCards);
    document.getElementById('searchInput').addEventListener('input', renderCourseCards);
  }
  // Dashboard Page
  if (document.getElementById('enrolledCoursesGrid')) {
    const studentId = getCurrentStudentId();
    updateDashboard(studentId);
  }
  // Admin Panel
  const addCourseForm = document.getElementById('addCourseForm');
  if (addCourseForm) {
    addCourseForm.addEventListener('submit', addCourseFromForm);
    renderAdminCourseList();
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

// Render course cards for catalog page
function renderCourseCards() {
  const track = document.getElementById('trackFilter').value;
  const search = document.getElementById('searchInput').value.toLowerCase();
  let courses = SAMPLE_COURSES.filter(course =>
    (!track || course.track === track) &&
    (!search || course.title.toLowerCase().includes(search))
  );
  const cardsHtml = courses.map(course => `
    <div class="course-card">
      <h3>${course.title}</h3>
      <div><b>Track:</b> ${CURRICULUM_TRACKS[course.track]?.name || course.track}</div>
      <div><b>Duration:</b> ${course.duration}</div>
      <div><b>Assessment:</b> ${course.assessment}</div>
      <div><b>Materials:</b> ${course.materials.map(m => `<a href="materials/${m}" target="_blank">${m}</a>`).join(', ')}</div>
      <p>${course.description}</p>
      <button onclick="addCourseToCart('${course.id}')">Add Subject to Cart</button>
    </div>
  `).join('');
  document.getElementById('courseCards').innerHTML = `<div class="course-grid">${cardsHtml}</div>`;
}

// ==========================
// EXPORTS FOR OTHER MODULES
// ==========================
window.PMERIT_COURSE_HUB = {
  addCourseToCart,
  enrollInCourse,
  getCurrentStudentId,
  updateDashboard,
  launchAIClass,
  showCourseCartModal
};
