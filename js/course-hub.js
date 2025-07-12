// Curriculum Tracks
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

// Sample Course List
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
  // ...add more courses as needed
];

// Student Enrollments
const STUDENT_ENROLLMENTS = {
  // Example: 'studentId': { courses: [courseId], progress: { courseId: percentComplete } }
};

// Course Materials
const COURSE_MATERIALS = {
  "digital-literacy": ["google-workspace-guide.pdf", "remote-tools-checklist.pdf"],
  "career-communication": ["communication-strategies.pdf"]
  // etc.
};

// Learning Paths
const LEARNING_PATHS = [
  {
    id: "remote-work-starter",
    name: "Remote Work Starter Path",
    courses: ["digital-literacy", "career-communication", "time-management"],
    prerequisites: []
  }
  // ...add more learning paths if needed
];
// Add course to cart (selection before registering)
function addCourseToCart(courseId) {
  let cart = JSON.parse(localStorage.getItem('course_cart') || '[]');
  if (!cart.includes(courseId)) cart.push(courseId);
  localStorage.setItem('course_cart', JSON.stringify(cart));
  showCourseCartModal();
}

// Enroll in course (move from cart to enrollments)
function enrollInCourse(studentId, courseId) {
  if (!STUDENT_ENROLLMENTS[studentId]) {
    STUDENT_ENROLLMENTS[studentId] = { courses: [], progress: {} };
  }
  if (!STUDENT_ENROLLMENTS[studentId].courses.includes(courseId)) {
    STUDENT_ENROLLMENTS[studentId].courses.push(courseId);
    STUDENT_ENROLLMENTS[studentId].progress[courseId] = 0;
  }
  // Remove from cart
  let cart = JSON.parse(localStorage.getItem('course_cart') || '[]');
  cart = cart.filter(id => id !== courseId);
  localStorage.setItem('course_cart', JSON.stringify(cart));
  updateDashboard(studentId);
}

// Get student courses (for dashboard)
function getStudentCourses(studentId) {
  return STUDENT_ENROLLMENTS[studentId] ? STUDENT_ENROLLMENTS[studentId].courses : [];
}

// Launch AI Class (redirect to classroom.html)
function launchAIClass(courseId) {
  window.location.href = `classroom.html?course=${courseId}`;
}

// Upload course material (admin)
function uploadCourseMaterial(courseId, file) {
  if (!COURSE_MATERIALS[courseId]) COURSE_MATERIALS[courseId] = [];
  COURSE_MATERIALS[courseId].push(file.name);
  // Actual file upload logic would go here (backend integration)
}

// Show course cart modal (using components.js modal pattern)
function showCourseCartModal() {
  const cart = JSON.parse(localStorage.getItem('course_cart') || '[]');
  let html = `<div class="pmerit-modal"><h2>🛒 Course Cart</h2>`;
  html += cart.length ? '<ul>' + cart.map(id => {
    const course = SAMPLE_COURSES.find(c => c.id === id);
    return `<li>${course.title} <button onclick="enrollInCourse('demoStudent', '${id}')">Register</button></li>`;
  }).join('') + '</ul>' : '<p>No courses added.</p>';
  html += `<button onclick="document.getElementById('courseCartModal').innerHTML=''">Close</button></div>`;
  document.getElementById('courseCartModal').innerHTML = html;
}
document.addEventListener('DOMContentLoaded', function() {
  // Render course cards
  const courseCards = document.getElementById('courseCards');
  if (courseCards) {
    renderCourseCards();
    document.getElementById('trackFilter').addEventListener('change', renderCourseCards);
    document.getElementById('searchInput').addEventListener('input', renderCourseCards);
  }
});

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
      <div><b>Materials:</b> ${course.materials.map(m => `<a href="materials/${m}">${m}</a>`).join(', ')}</div>
      <p>${course.description}</p>
      <button onclick="addCourseToCart('${course.id}')">Add to Cart</button>
    </div>
  `).join('');
  document.getElementById('courseCards').innerHTML = `<div class="course-grid">${cardsHtml}</div>`;
}
