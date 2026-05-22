const loginForm = document.getElementById('login-form');
const adminFeedback = document.getElementById('admin-feedback');
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const logoutButton = document.getElementById('logout-button');

function showDashboard(user) {
  if (authSection) authSection.classList.add('hidden');
  if (dashboardSection) dashboardSection.classList.remove('hidden');
}

function showLogin() {
  if (dashboardSection) dashboardSection.classList.add('hidden');
  if (authSection) authSection.classList.remove('hidden');
}

if (window.auth) {
  auth.onAuthStateChanged(user => {
    if (user) {
      showDashboard(user);
    } else {
      showLogin();
    }
  });
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('admin-email').value.trim();
  const password = document.getElementById('admin-password').value;

  if (!email || !password) {
    adminFeedback.textContent = 'Please enter both email and password.';
    return;
  }

  try {
    await auth.signInWithEmailAndPassword(email, password);
    adminFeedback.textContent = 'Signed in successfully.';
  } catch (error) {
    adminFeedback.textContent = 'Login failed. Please check your credentials.';
    console.error('Admin login failed', error);
  }
}

function handleLogout() {
  auth.signOut();
}

if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}
if (logoutButton) {
  logoutButton.addEventListener('click', handleLogout);
}
