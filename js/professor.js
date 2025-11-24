// ====================================
// INICIALIZAÇÃO
// ====================================

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa os ícones Lucide
  lucide.createIcons();
  
  // Event Listeners
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', handleLogout);
  }
  
  // Adiciona animação nos cards
  animateCards();
});

// ====================================
// FUNÇÕES
// ====================================

function handleLogout() {
  if (confirm('Deseja realmente sair do sistema?')) {
    // Aqui você redirecionaria para a página de login
    window.location.href = 'login.html';
  }
}

function animateCards() {
  const cards = document.querySelectorAll('.action-card');
  
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 * (index + 1));
  });
}

// ====================================
// NAVEGAÇÃO (opcional - para SPA)
// ====================================

function navigateTo(page) {
  window.location.href = page;
}