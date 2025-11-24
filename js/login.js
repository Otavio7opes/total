// ====================================
// CREDENCIAIS
// ====================================
const credentials = {
  professor: {
    email: 'maria@professor.com',
    password: 'ppp',
    redirect: 'professor.html'
  },
  admin: {
    email: 'john@admin.com',
    password: 'aaa',
    showMenu: true
  }
};

// ====================================
// ELEMENTOS DO DOM
// ====================================
const formLogin = document.getElementById('formLogin');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginForm = document.getElementById('loginForm');
const adminMenu = document.getElementById('adminMenu');
const btnBackToLogin = document.getElementById('btnBackToLogin');

// Alert Modal
const alertModal = document.getElementById('alertModal');
const alertOverlay = document.getElementById('alertOverlay');
const alertMessage = document.getElementById('alertMessage');
const btnAlertOk = document.getElementById('btnAlertOk');

// ====================================
// INICIALIZAÇÃO
// ====================================
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  
  // Verifica se deve mostrar admin menu (voltar de admin.html ou labtech.html)
  if (window.location.hash === '#admin') {
    showAdminMenu();
    window.history.replaceState(null, null, ' ');
  }
  
  // Event Listeners
  if (formLogin) {
    formLogin.addEventListener('submit', handleLogin);
  }
  
  if (btnBackToLogin) {
    btnBackToLogin.addEventListener('click', showLoginForm);
  }
  
  // Alert Modal Listeners
  if (btnAlertOk) {
    btnAlertOk.addEventListener('click', closeAlert);
  }
  
  if (alertOverlay) {
    alertOverlay.addEventListener('click', closeAlert);
  }
});

// ====================================
// CUSTOM ALERT
// ====================================
function showAlert(message) {
  if (alertMessage && alertModal) {
    alertMessage.textContent = message;
    alertModal.classList.add('active');
    setTimeout(() => {
      lucide.createIcons();
    }, 10);
  }
}

function closeAlert() {
  if (alertModal) {
    alertModal.classList.remove('active');
  }
}

// ====================================
// HANDLE LOGIN
// ====================================
function handleLogin(e) {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  
  // Verifica professor
  if (email === credentials.professor.email && password === credentials.professor.password) {
    window.location.href = credentials.professor.redirect;
    return;
  }
  
  // Verifica admin
  if (email === credentials.admin.email && password === credentials.admin.password) {
    showAdminMenu();
    return;
  }
  
  // Credenciais inválidas
  showAlert('Login not found, please try again.');
  passwordInput.value = '';
  setTimeout(() => {
    passwordInput.focus();
  }, 100);
}

// ====================================
// MOSTRAR MENU ADMIN
// ====================================
function showAdminMenu() {
  if (loginForm && adminMenu) {
    loginForm.style.display = 'none';
    adminMenu.classList.add('active');
    setTimeout(() => {
      lucide.createIcons();
    }, 10);
  }
}

// ====================================
// VOLTAR AO LOGIN
// ====================================
function showLoginForm() {
  if (adminMenu && loginForm) {
    adminMenu.classList.remove('active');
    loginForm.style.display = 'block';
    emailInput.value = '';
    passwordInput.value = '';
    setTimeout(() => {
      lucide.createIcons();
    }, 10);
  }
}

// ====================================
// PREVENIR FECHAR MODAL AO CLICAR NO CONTEÚDO
// ====================================
const alertContent = document.querySelector('.alert-content');
if (alertContent) {
  alertContent.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}