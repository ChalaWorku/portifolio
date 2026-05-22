const projectForm = document.getElementById('project-form');
const projectFeedback = document.getElementById('project-feedback');
const messagesList = document.getElementById('messages-list');
const projectsList = document.getElementById('projects-list');
let selectedProjectId = null;

function sanitizeInput(value) {
  const div = document.createElement('div');
  div.textContent = value;
  return div.innerHTML;
}

function renderMessages(items) {
  if (!messagesList) return;
  messagesList.innerHTML = items.map(doc => {
    const data = doc.data();
    const createdAt = data.createdAt?.toDate?.()?.toLocaleString() || 'Unknown';
    return `
      <article class="message-item glass-card">
        <h4>${sanitizeInput(data.name || 'Anonymous')}</h4>
        <span>${sanitizeInput(data.email || '')} • ${createdAt}</span>
        <p>${sanitizeInput(data.message || '')}</p>
      </article>
    `;
  }).join('');
}

function renderProjectsList(items) {
  if (!projectsList) return;
  projectsList.innerHTML = items.map(doc => {
    const data = doc.data();
    return `
      <article class="message-item glass-card">
        <h4>${sanitizeInput(data.title || 'Untitled')}</h4>
        <span>${sanitizeInput((data.technologies || []).join(', '))}</span>
        <p>${sanitizeInput(data.description || '')}</p>
        <div class="project-actions">
          <button class="btn btn-secondary" data-edit-id="${doc.id}">Edit</button>
          <button class="btn btn-primary" data-delete-id="${doc.id}">Delete</button>
        </div>
      </article>
    `;
  }).join('');
  projectsList.querySelectorAll('[data-edit-id]').forEach(button => {
    button.addEventListener('click', () => loadProjectForEdit(button.dataset.editId));
  });
  projectsList.querySelectorAll('[data-delete-id]').forEach(button => {
    button.addEventListener('click', () => deleteProject(button.dataset.deleteId));
  });
}

async function loadDashboardData() {
  if (!window.db) return;
  try {
    const projectsSnapshot = await db.collection('projects').get();
    const messagesSnapshot = await db.collection('messages').orderBy('createdAt', 'desc').get();
    const testimonialsSnapshot = await db.collection('testimonials').get();

    document.getElementById('stat-projects').textContent = projectsSnapshot.size;
    document.getElementById('stat-messages').textContent = messagesSnapshot.size;
    document.getElementById('stat-testimonials').textContent = testimonialsSnapshot.size;

    renderMessages(messagesSnapshot.docs);
    renderProjectsList(projectsSnapshot.docs);
  } catch (error) {
    console.error('Dashboard data load failed', error);
  }
}

function clearProjectForm() {
  if (!projectForm) return;
  projectForm.reset();
  selectedProjectId = null;
  projectFeedback.textContent = '';
}

function loadProjectForEdit(projectId) {
  if (!projectForm || !window.db) return;
  db.collection('projects').doc(projectId).get().then(doc => {
    if (!doc.exists) return;
    const data = doc.data();
    projectForm['project-title'].value = data.title || '';
    projectForm['project-description'].value = data.description || '';
    projectForm['project-tech'].value = (data.technologies || []).join(', ');
    projectForm['project-image'].value = data.image || '';
    projectForm['project-demo'].value = data.demo || '';
    projectForm['project-github'].value = data.github || '';
    selectedProjectId = projectId;
    projectFeedback.textContent = 'Editing existing project. Save to update.';
  });
}

async function deleteProject(projectId) {
  if (!window.db) return;
  const confirmed = confirm('Delete this project permanently?');
  if (!confirmed) return;
  try {
    await db.collection('projects').doc(projectId).delete();
    projectFeedback.textContent = 'Project removed successfully.';
    loadDashboardData();
  } catch (error) {
    projectFeedback.textContent = 'Unable to delete project.';
    console.error('Delete project failed', error);
  }
}

async function handleProjectSubmit(event) {
  event.preventDefault();
  if (!projectForm || !window.db) return;

  const title = projectForm['project-title'].value.trim();
  const description = projectForm['project-description'].value.trim();
  const technologies = projectForm['project-tech'].value.split(',').map(item => item.trim()).filter(Boolean);
  const image = projectForm['project-image'].value.trim();
  const demo = projectForm['project-demo'].value.trim();
  const github = projectForm['project-github'].value.trim();

  if (!title || !description || !technologies.length) {
    projectFeedback.textContent = 'Please fill title, description and technologies.';
    return;
  }

  const payload = {
    title: sanitizeInput(title),
    description: sanitizeInput(description),
    technologies,
    image: sanitizeInput(image) || 'assets/images/project-placeholder.svg',
    demo: sanitizeInput(demo) || '#',
    github: sanitizeInput(github) || '#',
    categories: technologies.includes('Java') || technologies.includes('java') ? ['java'] : ['web'],
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    if (selectedProjectId) {
      await db.collection('projects').doc(selectedProjectId).update(payload);
      projectFeedback.textContent = 'Project updated successfully.';
    } else {
      await db.collection('projects').add({ ...payload, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      projectFeedback.textContent = 'Project added successfully.';
    }
    clearProjectForm();
    loadDashboardData();
  } catch (error) {
    projectFeedback.textContent = 'Unable to save the project. Try again later.';
    console.error('Project save failed', error);
  }
}

if (projectForm) {
  projectForm.addEventListener('submit', handleProjectSubmit);
}

window.addEventListener('DOMContentLoaded', () => {
  if (auth && auth.currentUser) {
    loadDashboardData();
  }
  if (window.auth) {
    auth.onAuthStateChanged(user => {
      if (user) loadDashboardData();
    });
  }
});
