// ====================================
// INICIALIZAÇÃO
// ====================================

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa os ícones Lucide
  lucide.createIcons();
  
  // Event Listeners para os cards
  const cardCalendario = document.getElementById('cardCalendario');
  const cardReservar = document.getElementById('cardReservar');
  const cardKits = document.getElementById('cardKits');
  
  if (cardCalendario) {
    cardCalendario.addEventListener('click', () => {
      window.location.href = 'calendario.html';
    });
  }
  
  if (cardReservar) {
    cardReservar.addEventListener('click', () => {
      window.location.href = 'reservar.html';
    });
  }
  
  if (cardKits) {
    cardKits.addEventListener('click', () => {
      window.location.href = 'kits.html';
    });
  }
  
  // Adiciona animação nos cards
  animateCards();
});

// ====================================
// FUNÇÕES
// ====================================

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