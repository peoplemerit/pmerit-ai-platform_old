// Curriculum Persistence Helpers
function getCurriculum() {
  const data = localStorage.getItem('pmerit_curriculum');
  if (data) return JSON.parse(data);
  return AVAILABLE_SUBJECTS;
}
function saveCurriculum(subjects) {
  localStorage.setItem('pmerit_curriculum', JSON.stringify(subjects));
}

// Tab Navigation
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(btn.dataset.tab + '-panel').classList.add('active');
  });
});

// Render Subjects
function renderSubjects() {
  const subjects = getCurriculum();
  const grid = document.querySelector('.subjects-grid');
  grid.innerHTML = subjects.map((subject, idx) => `
    <div class="admin-subject-card" style="border-left: 6px solid ${getTrackColor(subject.track)}">
      <strong>${subject.title}</strong>
      <small>${subject.track}</small>
      <span>${subject.duration} • ${subject.assessment}</span>
      <button onclick="editSubject(${idx})">Edit</button>
      <button onclick="deleteSubject(${idx})">Delete</button>
    </div>
  `).join('');
}

// Add/Edit/Delete Logic
function addSubject(subj) {
  let subjects = getCurriculum();
  subjects.push(subj);
  saveCurriculum(subjects);
  renderSubjects();
}
function editSubject(idx) { /* Show edit modal, update subject, save */ }
function deleteSubject(idx) {
  if (confirm('Delete this subject?')) {
    let subjects = getCurriculum();
    subjects.splice(idx, 1);
    saveCurriculum(subjects);
    renderSubjects();
  }
}

// Bulk Upload, Export, Import
function exportCurriculum() {
  const data = JSON.stringify(getCurriculum(), null, 2);
  // Download as .json file
}
function importCurriculum(file) {
  // Parse JSON, validate, saveCurriculum, renderSubjects
}

// Preview, Material Management, Track Management, Analytics: Extend as needed

window.renderSubjects = renderSubjects;
document.addEventListener('DOMContentLoaded', renderSubjects);
