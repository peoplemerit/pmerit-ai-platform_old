// js/dashboard.js
// PMERIT Personalized Dashboard Manager

document.addEventListener('DOMContentLoaded', function() {
  // Validate session
  const session = window.PMERIT_AUTH.getSession();
  if (!session || !session.user) {
    window.location.href = "signin.html";
    return;
  }
  const user = session.user;

  // Welcome message
  const welcomeEl = document.getElementById("dashboardWelcome");
  if (welcomeEl) {
    welcomeEl.textContent = `Welcome to PMERIT University Dashboard, ${user.name}!`;
  }

  // Enrolled courses
  const enrolledCoursesGrid = document.getElementById('enrolledCoursesGrid');
  if (enrolledCoursesGrid && window.PMERIT_SUBJECT_HUB) {
    // Load enrolled subjects from course-hub.js
    const studentId = user.email;
    window.PMERIT_SUBJECT_HUB.updateDashboard(studentId);
  }

  // Next lessons
  const nextLessonsGrid = document.getElementById('nextLessonsGrid');
  if (nextLessonsGrid && window.PMERIT_SUBJECT_HUB) {
    const studentId = user.email;
    window.PMERIT_SUBJECT_HUB.updateDashboard(studentId);
  }

  // Quick actions
  document.getElementById("dashboardCourseHub")?.addEventListener("click", function() {
    window.location.href = "courses.html";
  });
  document.getElementById("dashboardProfile")?.addEventListener("click", function() {
    alert("Profile features coming soon!");
  });
  document.getElementById("dashboardSettings")?.addEventListener("click", function() {
    alert("Settings features coming soon!");
  });
  document.getElementById("logoutBtn")?.addEventListener("click", window.PMERIT_AUTH.handleLogout);
});
