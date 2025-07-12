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
