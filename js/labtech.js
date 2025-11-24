// ====================================
// DADOS INICIAIS (Simulação de Backend)
// ====================================

let reservas = [
  {
    id: 1,
    professor: 'Prof. Ana Silva',
    data: '23/08/2025',
    horario: '10:00 - 12:00',
    laboratorio: 'Laboratório 3',
    materiais: [
      { nome: 'Béquer 50ml', checked: false },
      { nome: 'Ácido clorídrico', checked: false },
      { nome: 'Pipeta', checked: false },
      { nome: 'Erlenmyer 250ml', checked: false }
    ],
    status: 'pendente' // pendente, confirmado, problema
  },
  {
    id: 2,
    professor: 'Prof. Carlos Mendes',
    data: '24/08/2025',
    horario: '14:00 - 16:00',
    laboratorio: 'Laboratório 1',
    materiais: [
      { nome: 'Tubo de ensaio', checked: false },
      { nome: 'Hidróxido de sódio', checked: false },
      { nome: 'Pipeta', checked: false },
      { nome: 'Proveta 100ml', checked: false }
    ],
    status: 'pendente'
  },
  {
    id: 3,
    professor: 'Prof. Maria Santos',
    data: '25/08/2025',
    horario: '08:00 - 10:00',
    laboratorio: 'Laboratório 2',
    materiais: [
      { nome: 'Béquer 50ml', checked: false },
      { nome: 'Balança analítica', checked: false },
      { nome: 'Espátula', checked: false },
      { nome: 'Papel de filtro', checked: false }
    ],
    status: 'pendente'
  }
];

let estoque = [
  { id: 1, nome: 'Béquer 50ml', quantidade: 45, unidade: 'unidade', minimo: 20 },
  { id: 2, nome: 'Ácido Clorídrico', quantidade: 15, unidade: 'litro', minimo: 10 },
  { id: 3, nome: 'Pipeta', quantidade: 30, unidade: 'unidade', minimo: 15 },
  { id: 4, nome: 'Erlenmyer 250ml', quantidade: 25, unidade: 'unidade', minimo: 10 },
  { id: 5, nome: 'Tubo de ensaio', quantidade: 80, unidade: 'unidade', minimo: 40 },
  { id: 6, nome: 'Hidróxido de sódio', quantidade: 8, unidade: 'quilograma', minimo: 5 },
  { id: 7, nome: 'Proveta 100ml', quantidade: 18, unidade: 'unidade', minimo: 10 },
  { id: 8, nome: 'Balança analítica', quantidade: 6, unidade: 'unidade', minimo: 3 },
  { id: 9, nome: 'Espátula', quantidade: 35, unidade: 'unidade', minimo: 20 },
  { id: 10, nome: 'Papel de filtro', quantidade: 100, unidade: 'folha', minimo: 50 }
];

// ====================================
// ELEMENTOS DO DOM
// ====================================

const reservationsList = document.getElementById('reservationsList');
const btnLogout = document.getElementById('btnLogout');
const btnAdjustStock = document.getElementById('btnAdjustStock');

// Modal Problema
const modalProblema = document.getElementById('modalProblema');
const modalProblemaOverlay = document.getElementById('modalProblemaOverlay');
const btnCloseModalProblema = document.getElementById('btnCloseModalProblema');
const formProblema = document.getElementById('formProblema');
const btnCancelProblema = document.getElementById('btnCancelProblema');

// Modal Estoque
const modalEstoque = document.getElementById('modalEstoque');
const modalEstoqueOverlay = document.getElementById('modalEstoqueOverlay');
const btnCloseModalEstoque = document.getElementById('btnCloseModalEstoque');
const searchEstoque = document.getElementById('searchEstoque');
const estoqueList = document.getElementById('estoqueList');

// Modal Editar Quantidade
const modalEditarQuantidade = document.getElementById('modalEditarQuantidade');
const modalEditarQuantidadeOverlay = document.getElementById('modalEditarQuantidadeOverlay');
const btnCloseModalEditarQuantidade = document.getElementById('btnCloseModalEditarQuantidade');
const formEditarQuantidade = document.getElementById('formEditarQuantidade');
const btnCancelEditarQuantidade = document.getElementById('btnCancelEditarQuantidade');
const inputNovaQuantidade = document.getElementById('inputNovaQuantidade');
const btnDiminuir = document.getElementById('btnDiminuir');
const btnAumentar = document.getElementById('btnAumentar');
const labelMaterialNome = document.getElementById('labelMaterialNome');

// Toast
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// ====================================
// INICIALIZAÇÃO
// ====================================

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa os ícones Lucide
  lucide.createIcons();
  
  // Renderiza as reservas
  renderReservations();
  
  // Event Listeners
  btnLogout.addEventListener('click', handleLogout);
  btnAdjustStock.addEventListener('click', openModalEstoque);
  
  // Modal Problema
  btnCloseModalProblema.addEventListener('click', closeModalProblema);
  modalProblemaOverlay.addEventListener('click', closeModalProblema);
  btnCancelProblema.addEventListener('click', closeModalProblema);
  formProblema.addEventListener('submit', handleSubmitProblema);
  
  // Modal Estoque
  btnCloseModalEstoque.addEventListener('click', closeModalEstoque);
  modalEstoqueOverlay.addEventListener('click', closeModalEstoque);
  searchEstoque.addEventListener('input', handleSearchEstoque);
  
  // Modal Editar Quantidade
  btnCloseModalEditarQuantidade.addEventListener('click', closeModalEditarQuantidade);
  modalEditarQuantidadeOverlay.addEventListener('click', closeModalEditarQuantidade);
  btnCancelEditarQuantidade.addEventListener('click', closeModalEditarQuantidade);
  formEditarQuantidade.addEventListener('submit', handleSubmitEditarQuantidade);
  btnDiminuir.addEventListener('click', () => adjustQuantidade(-1));
  btnAumentar.addEventListener('click', () => adjustQuantidade(1));
});

// ====================================
// FUNÇÕES DE RENDERIZAÇÃO
// ====================================

function renderReservations() {
  if (reservas.length === 0) {
    reservationsList.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--color-gray-500);">
        <p>Nenhuma reserva encontrada.</p>
      </div>
    `;
    return;
  }
  
  reservationsList.innerHTML = reservas.map(reserva => {
    const statusHTML = getStatusHTML(reserva);
    const actionsHTML = getActionsHTML(reserva);
    
    return `
      <div class="reservation-card" data-id="${reserva.id}">
        <div class="reservation-header">
          <div class="reservation-info">
            <h3>${reserva.professor}</h3>
            <div class="reservation-details">
              <div class="detail-item">
                <i data-lucide="calendar"></i>
                <span>${reserva.data}</span>
              </div>
              <div class="detail-item">
                <i data-lucide="clock"></i>
                <span>${reserva.horario}</span>
              </div>
              <div class="detail-item reservation-lab">
                <i data-lucide="flask-conical"></i>
                <span>${reserva.laboratorio}</span>
              </div>
            </div>
          </div>
          <div class="reservation-actions">
            ${actionsHTML}
          </div>
        </div>
        
        <div class="materials-section">
          <h4 class="materials-title">Materiais Solicitados:</h4>
          <div class="materials-grid">
            ${reserva.materiais.map((material, index) => `
              <div class="material-item">
                <input 
                  type="checkbox" 
                  id="material-${reserva.id}-${index}" 
                  class="material-checkbox"
                  ${material.checked ? 'checked' : ''}
                  ${reserva.status !== 'pendente' ? 'disabled' : ''}
                  onchange="handleMaterialCheck(${reserva.id}, ${index})"
                >
                <label for="material-${reserva.id}-${index}" class="material-label">
                  ${material.nome}
                </label>
              </div>
            `).join('')}
          </div>
        </div>
        ${statusHTML}
      </div>
    `;
  }).join('');
  
  // Re-inicializa os ícones Lucide
  lucide.createIcons();
}

function getStatusHTML(reserva) {
  if (reserva.status === 'confirmado') {
    return `
      <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--color-gray-200);">
        <span class="status-badge status-confirmed">
          <i data-lucide="check-circle"></i>
          Separação Confirmada
        </span>
      </div>
    `;
  } else if (reserva.status === 'problema') {
    return `
      <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--color-gray-200);">
        <span class="status-badge status-problem">
          <i data-lucide="alert-circle"></i>
          Problema Relatado
        </span>
      </div>
    `;
  }
  return '';
}

function getActionsHTML(reserva) {
  if (reserva.status === 'pendente') {
    return `
      <button class="btn-primary btn-success" onclick="handleConfirmarSeparacao(${reserva.id})">
        <i data-lucide="check"></i>
        Confirmar Separação
      </button>
      <button class="btn-secondary" onclick="openModalProblema(${reserva.id})">
        Relatar Perda/Quebra
      </button>
    `;
  }
  return '';
}

function renderEstoque(filteredEstoque = estoque) {
  if (filteredEstoque.length === 0) {
    estoqueList.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--color-gray-500);">
        <p>Nenhum material encontrado.</p>
      </div>
    `;
    return;
  }
  
  estoqueList.innerHTML = filteredEstoque.map(item => {
    const isLow = item.quantidade <= item.minimo;
    const badgeClass = isLow ? 'low' : 'ok';
    const badgeText = isLow ? 'Baixo' : 'OK';
    
    return `
      <div class="estoque-item">
        <div class="estoque-info">
          <div class="estoque-name">${item.nome}</div>
          <div class="estoque-details">
            <span>Mínimo: ${item.minimo} ${item.unidade}</span>
          </div>
        </div>
        <div class="estoque-quantity">
          <span class="quantity-value">${item.quantidade}</span>
          <span class="quantity-badge ${badgeClass}">
            ${isLow ? '<i data-lucide="alert-circle"></i>' : '<i data-lucide="check-circle"></i>'}
            ${badgeText}
          </span>
          <button class="btn-edit-quantity" onclick="openModalEditarQuantidade(${item.id})">
            <i data-lucide="edit-2"></i>
            Editar
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  lucide.createIcons();
}

// ====================================
// HANDLERS - RESERVAS
// ====================================

function handleMaterialCheck(reservaId, materialIndex) {
  const reserva = reservas.find(r => r.id === reservaId);
  if (reserva) {
    reserva.materiais[materialIndex].checked = !reserva.materiais[materialIndex].checked;
  }
}

function handleConfirmarSeparacao(reservaId) {
  const reserva = reservas.find(r => r.id === reservaId);
  if (reserva) {
    reserva.status = 'confirmado';
    renderReservations();
    showToast('Separação confirmada com sucesso!');
  }
}

// ====================================
// MODAL PROBLEMA
// ====================================

let currentProblemaReservaId = null;

function openModalProblema(reservaId) {
  currentProblemaReservaId = reservaId;
  const reserva = reservas.find(r => r.id === reservaId);
  
  if (reserva) {
    document.getElementById('problemaReserva').value = `${reserva.professor} - ${reserva.laboratorio}`;
    
    // Preenche o select de materiais
    const selectMaterial = document.getElementById('problemaMaterial');
    selectMaterial.innerHTML = '<option value="">Selecione o material</option>' +
      reserva.materiais.map(m => `<option value="${m.nome}">${m.nome}</option>`).join('');
    
    modalProblema.classList.add('active');
  }
}

function closeModalProblema() {
  modalProblema.classList.remove('active');
  formProblema.reset();
  currentProblemaReservaId = null;
}

function handleSubmitProblema(e) {
  e.preventDefault();
  
  const material = document.getElementById('problemaMaterial').value;
  const tipo = document.getElementById('problemaTipo').value;
  const quantidade = document.getElementById('problemaQuantidade').value;
  const observacao = document.getElementById('problemaObservacao').value;
  
  // Atualiza o status da reserva
  const reserva = reservas.find(r => r.id === currentProblemaReservaId);
  if (reserva) {
    reserva.status = 'problema';
  }
  
  // Atualiza o estoque (simula a redução)
  const itemEstoque = estoque.find(e => e.nome === material);
  if (itemEstoque && (tipo === 'quebra' || tipo === 'perda')) {
    itemEstoque.quantidade = Math.max(0, itemEstoque.quantidade - parseInt(quantidade));
  }
  
  closeModalProblema();
  renderReservations();
  showToast(`Problema registrado: ${tipo} de ${quantidade}x ${material}`);
}

// ====================================
// MODAL ESTOQUE
// ====================================

function openModalEstoque() {
  renderEstoque();
  modalEstoque.classList.add('active');
}

function closeModalEstoque() {
  modalEstoque.classList.remove('active');
  searchEstoque.value = '';
}

function handleSearchEstoque(e) {
  const searchTerm = e.target.value.toLowerCase();
  const filtered = estoque.filter(item => 
    item.nome.toLowerCase().includes(searchTerm)
  );
  renderEstoque(filtered);
}

// ====================================
// MODAL EDITAR QUANTIDADE
// ====================================

let currentEditMaterialId = null;

function openModalEditarQuantidade(materialId) {
  currentEditMaterialId = materialId;
  const material = estoque.find(m => m.id === materialId);
  
  if (material) {
    labelMaterialNome.textContent = material.nome;
    inputNovaQuantidade.value = material.quantidade;
    document.getElementById('motivoAjuste').value = '';
    modalEditarQuantidade.classList.add('active');
  }
}

function closeModalEditarQuantidade() {
  modalEditarQuantidade.classList.remove('active');
  formEditarQuantidade.reset();
  currentEditMaterialId = null;
}

function adjustQuantidade(delta) {
  const currentValue = parseInt(inputNovaQuantidade.value) || 0;
  const newValue = Math.max(0, currentValue + delta);
  inputNovaQuantidade.value = newValue;
}

function handleSubmitEditarQuantidade(e) {
  e.preventDefault();
  
  const novaQuantidade = parseInt(inputNovaQuantidade.value);
  const motivo = document.getElementById('motivoAjuste').value;
  
  const material = estoque.find(m => m.id === currentEditMaterialId);
  if (material) {
    const quantidadeAnterior = material.quantidade;
    material.quantidade = novaQuantidade;
    
    closeModalEditarQuantidade();
    renderEstoque();
    
    const diff = novaQuantidade - quantidadeAnterior;
    const diffText = diff > 0 ? `+${diff}` : diff;
    showToast(`${material.nome}: ${diffText} ${material.unidade} (${motivo})`);
  }
}

// ====================================
// LOGOUT
// ====================================

function handleLogout() {
  if (confirm('Deseja realmente sair do sistema?')) {
    // Aqui você redirecionaria para a página de login
    window.location.href = 'login.html';
  }
}

// ====================================
// TOAST NOTIFICATION
// ====================================

function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ====================================
// UTILITÁRIOS
// ====================================

// Previne que o modal feche ao clicar no conteúdo
document.querySelectorAll('.modal-content').forEach(content => {
  content.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});