// ====== PMERIT ADMIN PANEL - admin.js ======

// --- Constants ---
const CURRICULUM_KEY = 'pmerit_curriculum_v1';

// Use existing global AVAILABLE_SUBJECTS if present, else fallback to localStorage
function getSubjects() {
  const stored = localStorage.getItem(CURRICULUM_KEY);
  if (stored) return JSON.parse(stored);
  if (window.AVAILABLE_SUBJECTS) return [...window.AVAILABLE_SUBJECTS];
  return [];
}

function saveSubjects(subjects) {
  localStorage.setItem(CURRICULUM_KEY, JSON.stringify(subjects));
  // sync with global if present
  if (window.AVAILABLE_SUBJECTS) {
    window.AVAILABLE_SUBJECTS.length = 0;
    window.AVAILABLE_SUBJECTS.push(...subjects);
  }
}

// --- Tab Navigation ---
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
      document.getElementById(btn.dataset.tab + '-panel').classList.add('active');
    });
  });
  renderForm();
  renderSubjects();
});

// --- Form Rendering ---
function renderForm(subject = null, idx = null) {
  const form = document.querySelector('.add-subject-form');
  if (!form) return;

  form.innerHTML = `
    <h2>${subject ? 'Edit Subject' : 'Add New Subject'}</h2>
    <input type="text" name="title" placeholder="Course Title" required value="${subject ? subject.title : ''}">
    <select name="track" required>
      <option value="">Select Track</option>
      <option value="core" ${subject && subject.track === 'core' ? 'selected' : ''}>Core Curriculum</option>
      <option value="remote_careers" ${subject && subject.track === 'remote_careers' ? 'selected' : ''}>Remote Career Specializations</option>
      <option value="electives" ${subject && subject.track === 'electives' ? 'selected' : ''}>Electives</option>
      <option value="capstone" ${subject && subject.track === 'capstone' ? 'selected' : ''}>Capstone</option>
    </select>
    <input type="text" name="duration" placeholder="Duration (e.g. 4 hours)" required value="${subject ? subject.duration : ''}">
    <input type="text" name="assessment" placeholder="Assessment Type" required value="${subject ? subject.assessment : ''}">
    <textarea name="description" placeholder="Course Description" required>${subject ? subject.description : ''}</textarea>
    <input type="file" name="materials" multiple>
    <div class="form-buttons">
      <button type="submit" class="btn-primary">${subject ? 'Update Subject' : 'Add Subject'}</button>
      ${subject ? `<button type="button" class="btn-secondary" id="cancelEdit">Cancel</button>` : ''}
    </div>
  `;

  form.onsubmit = function (e) {
    e.preventDefault();
    const fd = new FormData(form);
    const newSubject = {
      id: fd.get('title').replace(/\s+/g, '-').toLowerCase(),
      title: fd.get('title'),
      track: fd.get('track'),
      duration: fd.get('duration'),
      assessment: fd.get('assessment'),
      description: fd.get('description'),
      materials: []
    };
    if (form.materials && form.materials.files.length > 0) {
      newSubject.materials = Array.from(form.materials.files).map(f => f.name);
    }
    let subjects = getSubjects();
    if (subject && idx !== null) {
      subjects[idx] = newSubject;
    } else {
      subjects.push(newSubject);
    }
    saveSubjects(subjects);
    renderSubjects();
    renderForm(); // reset to Add mode
  };

  if (subject) {
    document.getElementById('cancelEdit').onclick = function () {
      renderForm();
    };
  }
}

// --- CRUD Rendering ---
function renderSubjects() {
  const grid = document.querySelector('.subjects-grid');
  if (!grid) return;
  const subjects = getSubjects();
  if (subjects.length === 0) {
    grid.innerHTML = `<p class="empty-state">No subjects yet. Add your first subject above.</p>`;
    return;
  }
  grid.innerHTML = subjects.map((subj, idx) => `
    <div class="admin-card" data-track="${subj.track}">
      <div class="admin-card-header">
        <span class="admin-badge">${trackLabel(subj.track)}</span>
        <h3>${subj.title}</h3>
      </div>
      <div class="admin-card-body">
        <div><strong>Duration:</strong> ${subj.duration}</div>
        <div><strong>Assessment:</strong> ${subj.assessment}</div>
        <div><strong>Description:</strong> ${subj.description}</div>
        <div><strong>Materials:</strong> ${subj.materials && subj.materials.length ? subj.materials.map(m => `<span class="material-item">${m}</span>`).join(', ') : 'None'}</div>
      </div>
      <div class="admin-card-actions">
        <button class="btn-secondary" onclick="editSubject(${idx})">Edit</button>
        <button class="btn-danger" onclick="deleteSubject(${idx})">Delete</button>
      </div>
    </div>
  `).join('');
}

// --- Edit/Delete Operations ---
window.editSubject = function (idx) {
  const subject = getSubjects()[idx];
  renderForm(subject, idx);
  window.scrollTo({ top: 100, behavior: 'smooth' });
};

window.deleteSubject = function (idx) {
  if (!confirm('Are you sure you want to delete this subject?')) return;
  let subjects = getSubjects();
  subjects.splice(idx, 1);
  saveSubjects(subjects);
  renderSubjects();
  renderForm(); // reset form
};

// --- Track Label Helper ---
function trackLabel(track) {
  switch (track) {
    case 'core': return 'Core Curriculum';
    case 'remote_careers': return 'Remote Careers';
    case 'electives': return 'Elective';
    case 'capstone': return 'Capstone';
    default: return track;
  }
}

// --- Data Export ---
function exportCurriculum() {
  const data = JSON.stringify(getSubjects(), null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pmerit_curriculum.json';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 500);
}

// --- Export Button ---
document.addEventListener('DOMContentLoaded', function () {
  let exportBtn = document.createElement('button');
  exportBtn.textContent = 'Export Curriculum (JSON)';
  exportBtn.className = 'btn-export';
  exportBtn.onclick = exportCurriculum;
  document.querySelector('.tab-panel#subjects-panel').appendChild(exportBtn);
});

// --- Session Management Bridge (For Integration) ---
function setAdminSession(user) {
  localStorage.setItem('gabriel_session', JSON.stringify({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: 'admin',
    verified: true
  }));
}
window.setAdminSession = setAdminSession;

// --- Authentication Success Messaging (Integration) ---
window.showRegistrationSuccess = function (name) {
  alert(`Welcome, ${name}! Please check your email for verification link to complete registration and access your dashboard.`);
};
window.showDashboardWelcome = function (name) {
  alert(`Welcome to PMERIT University Dashboard, ${name}!`);
  window.location.href = 'dashboard.html';
};
