// ====================================
// LABTECH.JS ATUALIZADO
// ====================================

// IMPORTANTE: Certifique-se de incluir storage.js antes deste arquivo no HTML

// ====================================
// ELEMENTOS DO DOM
// ====================================

const reservationsList = document.getElementById('reservationsList');
const btnBack = document.getElementById('btnBack');
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
  // Verifica se o usuário está logado
  const currentUser = getCurrentUser();
  if (!currentUser || (currentUser.tipo !== 'Administrador' && currentUser.tipo !== 'Técnico')) {
    window.location.href = 'login.html';
    return;
  }
  
  lucide.createIcons();
  renderReservations();
  
  btnBack.addEventListener('click', handleBack);
  btnAdjustStock.addEventListener('click', openModalEstoque);
  
  btnCloseModalProblema.addEventListener('click', closeModalProblema);
  modalProblemaOverlay.addEventListener('click', closeModalProblema);
  btnCancelProblema.addEventListener('click', closeModalProblema);
  formProblema.addEventListener('submit', handleSubmitProblema);
  
  btnCloseModalEstoque.addEventListener('click', closeModalEstoque);
  modalEstoqueOverlay.addEventListener('click', closeModalEstoque);
  searchEstoque.addEventListener('input', handleSearchEstoque);
  
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
  const reservas = getReservations().filter(r => r.status === 'pendente');
  
  if (reservas.length === 0) {
    reservationsList.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--color-gray-500);">
        <p>Nenhuma reserva pendente encontrada.</p>
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
            <h3>${reserva.professorNome}</h3>
            <div class="reservation-details">
              <div class="detail-item">
                <i data-lucide="calendar"></i>
                <span>${formatDateBR(reserva.data)}</span>
              </div>
              <div class="detail-item">
                <i data-lucide="clock"></i>
                <span>${reserva.horarioInicio} - ${reserva.horarioFim}</span>
              </div>
              <div class="detail-item reservation-lab">
                <i data-lucide="flask-conical"></i>
                <span>Laboratório ${reserva.laboratorioId}</span>
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
                  ${material.nome} (${material.quantidade})
                </label>
              </div>
            `).join('')}
          </div>
        </div>
        ${statusHTML}
      </div>
    `;
  }).join('');
  
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
      <button class="btn-danger" onclick="handleDeleteReservation(${reserva.id})" style="margin-left: 0.5rem;">
        <i data-lucide="trash-2"></i>
        Excluir Reserva
      </button>
    `;
  }
  return '';
}

function renderEstoque(filteredEstoque = null) {
  const estoque = filteredEstoque || getMaterials();
  
  if (estoque.length === 0) {
    estoqueList.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--color-gray-500);">
        <p>Nenhum material encontrado.</p>
      </div>
    `;
    return;
  }
  
  estoqueList.innerHTML = estoque.map(item => {
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
  const reservas = getReservations();
  const reserva = reservas.find(r => r.id === reservaId);
  if (reserva) {
    reserva.materiais[materialIndex].checked = !reserva.materiais[materialIndex].checked;
    saveReservations(reservas);
  }
}

function handleConfirmarSeparacao(reservaId) {
  updateReservation(reservaId, { status: 'confirmado' });
  renderReservations();
  showToast('Separação confirmada com sucesso!');
}

// Adicione esta função após handleConfirmarSeparacao
function handleDeleteReservation(reservaId) {
  if (confirm('Tem certeza que deseja excluir esta reserva? Os materiais serão devolvidos ao estoque.')) {
    deleteReservation(reservaId);
    renderReservations();
    showToast('Reserva excluída com sucesso!');
  }
}

// ====================================
// MODAL PROBLEMA
// ====================================

let currentProblemaReservaId = null;

function openModalProblema(reservaId) {
  currentProblemaReservaId = reservaId;
  const reservas = getReservations();
  const reserva = reservas.find(r => r.id === reservaId);
  
  if (reserva) {
    document.getElementById('problemaReserva').value = `${reserva.professorNome} - Laboratório ${reserva.laboratorioId}`;
    
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
  const quantidade = parseInt(document.getElementById('problemaQuantidade').value);
  
  updateReservation(currentProblemaReservaId, { status: 'problema' });
  
  if (tipo === 'quebra' || tipo === 'perda') {
    updateMaterialQuantity(material, -quantidade);
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
  const estoque = getMaterials();
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
  const materiais = getMaterials();
  const material = materiais.find(m => m.id === materialId);
  
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
  
  const materiais = getMaterials();
  const material = materiais.find(m => m.id === currentEditMaterialId);
  
  if (material) {
    const quantidadeAnterior = material.quantidade;
    updateMaterial(currentEditMaterialId, { quantidade: novaQuantidade });
    
    closeModalEditarQuantidade();
    renderEstoque();
    
    const diff = novaQuantidade - quantidadeAnterior;
    const diffText = diff > 0 ? `+${diff}` : diff;
    showToast(`${material.nome}: ${diffText} ${material.unidade} (${motivo})`);
  }
}

// ====================================
// UTILITÁRIOS
// ====================================

function formatDateBR(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

// ====================================
// VOLTAR
// ====================================

function handleBack() {
  window.location.href = 'login.html#admin';
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

document.querySelectorAll('.modal-content').forEach(content => {
  content.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});