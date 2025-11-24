// ====================================
// LOGIN.JS ATUALIZADO
// ====================================

// IMPORTANTE: Certifique-se de incluir storage.js antes deste arquivo no HTML

// ====================================
// ELEMENTOS DO DOM
// ====================================
const formLogin = document.getElementById('formLogin');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginForm = document.getElementById('loginForm');
const adminMenu = document.getElementById('adminMenu');
const btnBackToLogin = document.getElementById('btnBackToLogin');

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
});

// ====================================
// HANDLE LOGIN
// ====================================
function handleLogin(e) {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  const senha = passwordInput.value;
  
  // Tenta autenticar o usuário
  const user = authenticateUser(email, senha);
  
  if (user) {
    // Salva o usuário na sessão
    setCurrentUser(user);
    
    // Redireciona baseado no tipo de usuário
    if (user.tipo === 'Professor') {
      window.location.href = 'professor.html';
    } else if (user.tipo === 'Administrador' || user.tipo === 'Técnico') {
      showAdminMenu();
    }
  } else {
    // Credenciais inválidas
    alert('E-mail ou senha incorretos. Por favor, tente novamente.');
    passwordInput.value = '';
    setTimeout(() => {
      passwordInput.focus();
    }, 100);
  }
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
    
    // Faz logout do usuário
    logoutUser();
    
    setTimeout(() => {
      lucide.createIcons();
    }, 10);
  }
}