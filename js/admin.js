// ====== COMPLETE ADMIN PANEL SYSTEM - admin.js ======
// Replace your current admin.js with this complete working version

document.addEventListener('DOMContentLoaded', function() {
    console.log('🛠️ Admin panel initializing...');
    initializeAdminPanel();
});

function initializeAdminPanel() {
    setupTabNavigation();
    renderSubjectForm();
    renderSubjectsList();
    setupFormHandling();
    setupExportButton();
    console.log('✅ Admin panel ready!');
}

// TAB NAVIGATION
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.nav-item');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active to clicked tab
            this.classList.add('active');
            const targetPanel = document.getElementById(this.dataset.tab + '-panel');
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// SUBJECT FORM RENDERING
function renderSubjectForm() {
    const formContainer = document.querySelector('.add-subject-form');
    if (!formContainer) return;

    formContainer.innerHTML = `
        <h2>🎓 Add New Subject</h2>
        <form id="subjectForm">
            <div class="form-group">
                <label>Subject Title:</label>
                <input type="text" id="subjectTitle" placeholder="e.g., Advanced Web Development" required>
            </div>
            
            <div class="form-group">
                <label>Track:</label>
                <select id="subjectTrack" required>
                    <option value="">Select Track</option>
                    <option value="core">Core Curriculum</option>
                    <option value="remote_careers">Remote Career Specializations</option>
                    <option value="electives">Electives</option>
                    <option value="capstone">Capstone</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Duration:</label>
                <input type="text" id="subjectDuration" placeholder="e.g., 6 hours" required>
            </div>
            
            <div class="form-group">
                <label>Assessment:</label>
                <input type="text" id="subjectAssessment" placeholder="e.g., Portfolio Project" required>
            </div>
            
            <div class="form-group">
                <label>Description:</label>
                <textarea id="subjectDescription" placeholder="Brief description of the subject..." required rows="3"></textarea>
            </div>
            
            <div class="form-group">
                <label>Materials (optional):</label>
                <input type="text" id="subjectMaterials" placeholder="e.g., study-guide.pdf, video-tutorial.mp4">
                <small>Separate multiple materials with commas</small>
            </div>
            
            <button type="submit" class="btn-primary">Add Subject</button>
        </form>
    `;
}

// FORM HANDLING
function setupFormHandling() {
    document.addEventListener('submit', function(e) {
        if (e.target.id === 'subjectForm') {
            e.preventDefault();
            handleAddSubject();
        }
    });
}

function handleAddSubject() {
    // Get form values
    const title = document.getElementById('subjectTitle').value.trim();
    const track = document.getElementById('subjectTrack').value;
    const duration = document.getElementById('subjectDuration').value.trim();
    const assessment = document.getElementById('subjectAssessment').value.trim();
    const description = document.getElementById('subjectDescription').value.trim();
    const materialsText = document.getElementById('subjectMaterials').value.trim();

    // Validation
    if (!title || !track || !duration || !assessment || !description) {
        alert('Please fill in all required fields');
        return;
    }

    // Process materials
    const materials = materialsText ? materialsText.split(',').map(m => m.trim()).filter(m => m) : [];

    // Create new subject
    const newSubject = {
        id: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        title: title,
        track: track,
        duration: duration,
        assessment: assessment,
        description: description,
        materials: materials
    };

    // Add to curriculum
    addSubjectToCurriculum(newSubject);

    // Reset form
    document.getElementById('subjectForm').reset();

    // Refresh subjects list
    renderSubjectsList();

    // Success message
    alert(`✅ Subject "${title}" added successfully!`);
}

// CURRICULUM MANAGEMENT
function getCurriculum() {
    const stored = localStorage.getItem('pmerit_admin_curriculum');
    if (stored) {
        return JSON.parse(stored);
    }
    
    // Return default curriculum if none stored
    if (window.AVAILABLE_SUBJECTS) {
        return [...window.AVAILABLE_SUBJECTS];
    }
    
    return [];
}

function saveCurriculum(subjects) {
    localStorage.setItem('pmerit_admin_curriculum', JSON.stringify(subjects));
    
    // Also update global AVAILABLE_SUBJECTS if it exists
    if (window.AVAILABLE_SUBJECTS) {
        window.AVAILABLE_SUBJECTS.length = 0;
        window.AVAILABLE_SUBJECTS.push(...subjects);
    }
}

function addSubjectToCurriculum(newSubject) {
    const curriculum = getCurriculum();
    curriculum.push(newSubject);
    saveCurriculum(curriculum);
}

function deleteSubjectFromCurriculum(index) {
    const curriculum = getCurriculum();
    if (confirm(`Are you sure you want to delete "${curriculum[index].title}"?`)) {
        curriculum.splice(index, 1);
        saveCurriculum(curriculum);
        renderSubjectsList();
    }
}

// SUBJECTS LIST RENDERING
function renderSubjectsList() {
    const container = document.querySelector('.subjects-grid');
    if (!container) return;

    const curriculum = getCurriculum();
    
    if (curriculum.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>📚 No subjects yet</h3>
                <p>Add your first subject using the form above</p>
            </div>
        `;
        return;
    }

    container.innerHTML = curriculum.map((subject, index) => `
        <div class="admin-subject-card" data-track="${subject.track}">
            <div class="subject-header">
                <span class="track-badge track-${subject.track}">${getTrackLabel(subject.track)}</span>
                <h4>${subject.title}</h4>
            </div>
            <div class="subject-details">
                <p><strong>Duration:</strong> ${subject.duration}</p>
                <p><strong>Assessment:</strong> ${subject.assessment}</p>
                <p><strong>Description:</strong> ${subject.description}</p>
                ${subject.materials.length > 0 ? `<p><strong>Materials:</strong> ${subject.materials.join(', ')}</p>` : ''}
            </div>
            <div class="subject-actions">
                <button class="btn-edit" onclick="editSubject(${index})">✏️ Edit</button>
                <button class="btn-delete" onclick="deleteSubject(${index})">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

// HELPER FUNCTIONS
function getTrackLabel(track) {
    const labels = {
        'core': 'Core Curriculum',
        'remote_careers': 'Remote Careers',
        'electives': 'Electives',
        'capstone': 'Capstone'
    };
    return labels[track] || track;
}

// EXPORT FUNCTIONALITY
function setupExportButton() {
    const subjectsPanel = document.getElementById('subjects-panel');
    if (subjectsPanel) {
        const exportButton = document.createElement('button');
        exportButton.className = 'btn-export';
        exportButton.innerHTML = '📥 Export Curriculum';
        exportButton.onclick = exportCurriculum;
        subjectsPanel.appendChild(exportButton);
    }
}

function exportCurriculum() {
    const curriculum = getCurriculum();
    const dataStr = JSON.stringify(curriculum, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'pmerit_curriculum.json';
    link.click();
    
    alert('✅ Curriculum exported successfully!');
}

// GLOBAL FUNCTIONS (for onclick handlers)
window.editSubject = function(index) {
    const curriculum = getCurriculum();
    const subject = curriculum[index];
    
    // Populate form with subject data
    document.getElementById('subjectTitle').value = subject.title;
    document.getElementById('subjectTrack').value = subject.track;
    document.getElementById('subjectDuration').value = subject.duration;
    document.getElementById('subjectAssessment').value = subject.assessment;
    document.getElementById('subjectDescription').value = subject.description;
    document.getElementById('subjectMaterials').value = subject.materials.join(', ');
    
    // Change form to edit mode
    const form = document.getElementById('subjectForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Update Subject';
    submitBtn.onclick = function(e) {
        e.preventDefault();
        updateSubject(index);
    };
    
    // Scroll to form
    document.querySelector('.add-subject-form').scrollIntoView({behavior: 'smooth'});
};

window.deleteSubject = function(index) {
    deleteSubjectFromCurriculum(index);
};

function updateSubject(index) {
    // Get form values
    const title = document.getElementById('subjectTitle').value.trim();
    const track = document.getElementById('subjectTrack').value;
    const duration = document.getElementById('subjectDuration').value.trim();
    const assessment = document.getElementById('subjectAssessment').value.trim();
    const description = document.getElementById('subjectDescription').value.trim();
    const materialsText = document.getElementById('subjectMaterials').value.trim();

    // Validation
    if (!title || !track || !duration || !assessment || !description) {
        alert('Please fill in all required fields');
        return;
    }

    // Process materials
    const materials = materialsText ? materialsText.split(',').map(m => m.trim()).filter(m => m) : [];

    // Update subject
    const curriculum = getCurriculum();
    curriculum[index] = {
        id: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        title: title,
        track: track,
        duration: duration,
        assessment: assessment,
        description: description,
        materials: materials
    };

    saveCurriculum(curriculum);

    // Reset form
    document.getElementById('subjectForm').reset();
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Add Subject';
    submitBtn.onclick = null;

    // Refresh list
    renderSubjectsList();

    alert(`✅ Subject "${title}" updated successfully!`);
}

console.log('🛠️ Complete Admin Panel System - Ready!');
