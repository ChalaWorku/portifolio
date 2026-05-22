const projectGrid = document.getElementById('project-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectModal = document.getElementById('project-modal');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalTags = document.getElementById('modal-tags');
const modalDemo = document.getElementById('modal-demo');
const modalGithub = document.getElementById('modal-github');
const modalImage = document.getElementById('modal-image');

const sampleProjects = [
  {
    id: 'project-1',
    title: 'Portfolio Landing Page',
    description: 'Responsive portfolio layout built with HTML, CSS and JavaScript featuring glassmorphism and animations.',
    categories: ['web', 'ui'],
    technologies: ['HTML', 'CSS', 'JavaScript'],
    image: 'assets/images/project-placeholder.svg',
    github: '#',
    demo: '#'
  },
  {
    id: 'project-2',
    title: 'University App Prototype',
    description: 'A Java-based academic tool concept with data selection, form handling, and university resources.',
    categories: ['java'],
    technologies: ['Java', 'OOP'],
    image: 'assets/images/project-placeholder.svg',
    github: '#',
    demo: '#'
  },
  {
    id: 'project-3',
    title: 'UI Design Showcase',
    description: 'Modern UI explorations with interactive components, smooth transitions and polished interface patterns.',
    categories: ['ui', 'web'],
    technologies: ['Figma', 'CSS', 'JavaScript'],
    image: 'assets/images/project-placeholder.svg',
    github: '#',
    demo: '#'
  }
];

let projectList = [...sampleProjects];
let currentFilter = 'all';

function createProjectCard(project) {
  const card = document.createElement('article');
  card.className = 'project-card glass-card fade-up';
  card.dataset.category = project.categories.join(' ');
  card.innerHTML = `
    <img src="${project.image || 'assets/images/project-placeholder.svg'}" alt="${project.title} preview" loading="lazy" />
    <div class="project-content">
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="project-tags">
        ${project.technologies.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
      </div>
      <div class="project-actions">
        <button class="btn btn-secondary" data-project-id="${project.id}">Preview</button>
        <a href="${project.github}" target="_blank" class="btn btn-primary">GitHub</a>
      </div>
    </div>
  `;
  const previewButton = card.querySelector('[data-project-id]');
  previewButton.addEventListener('click', () => openProjectModal(project));
  return card;
}

function renderProjects() {
  if (!projectGrid) return;
  projectGrid.innerHTML = '';
  const projectsToShow = projectList.filter(project => currentFilter === 'all' || project.categories.includes(currentFilter));
  if (!projectsToShow.length) {
    projectGrid.innerHTML = '<p class="no-results">No projects match this category yet.</p>';
    return;
  }
  projectsToShow.forEach(project => projectGrid.appendChild(createProjectCard(project)));
}

function setFilter(filter) {
  currentFilter = filter;
  filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));
  renderProjects();
}

function openProjectModal(project) {
  if (!projectModal) return;
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalImage.src = project.image || 'assets/images/project-placeholder.svg';
  modalDemo.href = project.demo || '#';
  modalGithub.href = project.github || '#';
  modalTags.innerHTML = project.technologies.map(tech => `<span class="project-tag">${tech}</span>`).join('');
  projectModal.classList.add('active');
  projectModal.setAttribute('aria-hidden', 'false');
}

function closeProjectModal() {
  if (!projectModal) return;
  projectModal.classList.remove('active');
  projectModal.setAttribute('aria-hidden', 'true');
}

async function loadProjectsFromFirestore() {
  if (!window.db) {
    renderProjects();
    return;
  }
  try {
    const snapshot = await db.collection('projects').get();
    if (!snapshot.empty) {
      projectList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  } catch (error) {
    console.warn('Firestore projects load failed:', error);
  }
  renderProjects();
}

window.addEventListener('DOMContentLoaded', () => {
  filterButtons.forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter)));
  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (projectModal) projectModal.addEventListener('click', event => {
    if (event.target === projectModal) closeProjectModal();
  });
  renderProjects();
  loadProjectsFromFirestore();
});
