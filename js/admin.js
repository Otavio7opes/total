// ====================================
// ADMIN.JS COMPLETO ATUALIZADO
// ====================================

// Tabs
const tabUsuarios = document.getElementById('tabUsuarios');
const tabReagentes = document.getElementById('tabReagentes');
const tabVidrarias = document.getElementById('tabVidrarias');
const contentUsuarios = document.getElementById('contentUsuarios');
const contentReagentes = document.getElementById('contentReagentes');
const contentVidrarias = document.getElementById('contentVidrarias');

// Botões principais
const btnBack = document.getElementById('btnBack');
const btnNovoUsuario = document.getElementById('btnNovoUsuario');
const btnNovoReagente = document.getElementById('btnNovoReagente');
const btnNovaVidraria = document.getElementById('btnNovaVidraria');

// Tabelas
const usuariosTableBody = document.getElementById('usuariosTableBody');
const reagentesTableBody = document.getElementById('reagentesTableBody');
const vidrariasTableBody = document.getElementById('vidrariasTableBody');

// Modal Usuário
const modalUsuario = document.getElementById('modalUsuario');
const modalUsuarioOverlay = document.getElementById('modalUsuarioOverlay');
const btnCloseModalUsuario = document.getElementById('btnCloseModalUsuario');
const modalUsuarioTitle = document.getElementById('modalUsuarioTitle');
const formUsuario = document.getElementById('formUsuario');
const btnCancelUsuario = document.getElementById('btnCancelUsuario');

// Modal Reagente
const modalReagente = document.getElementById('modalReagente');
const modalReagenteOverlay = document.getElementById('modalReagenteOverlay');
const btnCloseModalReagente = document.getElementById('btnCloseModalReagente');
const modalReagenteTitle = document.getElementById('modalReagenteTitle');
const formReagente = document.getElementById('formReagente');
const btnCancelReagente = document.getElementById('btnCancelReagente');

// Modal Vidraria
const modalVidraria = document.getElementById('modalVidraria');
const modalVidrariaOverlay = document.getElementById('modalVidrariaOverlay');
const btnCloseModalVidraria = document.getElementById('btnCloseModalVidraria');
const modalVidrariaTitle = document.getElementById('modalVidrariaTitle');
const formVidraria = document.getElementById('formVidraria');
const btnCancelVidraria = document.getElementById('btnCancelVidraria');

// Modal Confirmar
const modalConfirmar = document.getElementById('modalConfirmar');
const modalConfirmarOverlay = document.getElementById('modalConfirmarOverlay');
const btnCloseModalConfirmar = document.getElementById('btnCloseModalConfirmar');
const confirmMessage = document.getElementById('confirmMessage');
const btnCancelConfirmar = document.getElementById('btnCancelConfirmar');
const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao');

// Toast
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Variáveis de controle
let currentEditUsuarioId = null;
let currentEditReagenteId = null;
let currentEditVidrariaId = null;
let currentDeleteType = null;
let currentDeleteId = null;

// ====================================
// INICIALIZAÇÃO
// ====================================

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = getCurrentUser();
  if (!currentUser || (currentUser.tipo !== 'Administrador' && currentUser.tipo !== 'Técnico')) {
    window.location.href = 'login.html';
    return;
  }
  
  lucide.createIcons();
  
  renderUsuarios();
  renderReagentes();
  renderVidrarias();
  
  // Event Listeners - Tabs
  tabUsuarios.addEventListener('click', () => switchTab('usuarios'));
  tabReagentes.addEventListener('click', () => switchTab('reagentes'));
  tabVidrarias.addEventListener('click', () => switchTab('vidrarias'));
  
  // Event Listeners - Botões principais
  btnBack.addEventListener('click', handleBack);
  btnNovoUsuario.addEventListener('click', openModalNovoUsuario);
  btnNovoReagente.addEventListener('click', openModalNovoReagente);
  btnNovaVidraria.addEventListener('click', openModalNovaVidraria);
  
  // Event Listeners - Modal Usuário
  btnCloseModalUsuario.addEventListener('click', closeModalUsuario);
  modalUsuarioOverlay.addEventListener('click', closeModalUsuario);
  btnCancelUsuario.addEventListener('click', closeModalUsuario);
  formUsuario.addEventListener('submit', handleSubmitUsuario);
  
  // Event Listeners - Modal Reagente
  btnCloseModalReagente.addEventListener('click', closeModalReagente);
  modalReagenteOverlay.addEventListener('click', closeModalReagente);
  btnCancelReagente.addEventListener('click', closeModalReagente);
  formReagente.addEventListener('submit', handleSubmitReagente);
  
  // Event Listeners - Modal Vidraria
  btnCloseModalVidraria.addEventListener('click', closeModalVidraria);
  modalVidrariaOverlay.addEventListener('click', closeModalVidraria);
  btnCancelVidraria.addEventListener('click', closeModalVidraria);
  formVidraria.addEventListener('submit', handleSubmitVidraria);
  
  // Event Listeners - Modal Confirmar
  btnCloseModalConfirmar.addEventListener('click', closeModalConfirmar);
  modalConfirmarOverlay.addEventListener('click', closeModalConfirmar);
  btnCancelConfirmar.addEventListener('click', closeModalConfirmar);
  btnConfirmarExclusao.addEventListener('click', handleConfirmarExclusao);
});

// ====================================
// FUNÇÕES DE TABS
// ====================================

function switchTab(tab) {
  // Remove active de todos
  tabUsuarios.classList.remove('active');
  tabReagentes.classList.remove('active');
  tabVidrarias.classList.remove('active');
  contentUsuarios.classList.remove('active');
  contentReagentes.classList.remove('active');
  contentVidrarias.classList.remove('active');
  
  // Adiciona active no selecionado
  if (tab === 'usuarios') {
    tabUsuarios.classList.add('active');
    contentUsuarios.classList.add('active');
  } else if (tab === 'reagentes') {
    tabReagentes.classList.add('active');
    contentReagentes.classList.add('active');
  } else if (tab === 'vidrarias') {
    tabVidrarias.classList.add('active');
    contentVidrarias.classList.add('active');
  }
}

// ====================================
// RENDERIZAÇÃO - USUÁRIOS
// ====================================

function renderUsuarios() {
  const usuarios = getUsers();
  
  if (usuarios.length === 0) {
    usuariosTableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--color-gray-500);">
          Nenhum usuário cadastrado.
        </td>
      </tr>
    `;
    return;
  }
  
  usuariosTableBody.innerHTML = usuarios.map(usuario => `
    <tr>
      <td><strong>${usuario.nome}</strong></td>
      <td>${usuario.email}</td>
      <td>${usuario.senha}</td>
      <td>
        <span class="badge badge-${usuario.tipo.toLowerCase()}">
          ${usuario.tipo}
        </span>
      </td>
      <td class="text-right">
        <div class="table-actions">
          <button class="btn-icon btn-edit" onclick="openModalEditUsuario(${usuario.id})" title="Editar">
            <i data-lucide="edit-2"></i>
          </button>
          <button class="btn-icon btn-delete" onclick="openModalDeleteUsuario(${usuario.id})" title="Excluir">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  
  lucide.createIcons();
}

// ====================================
// RENDERIZAÇÃO - REAGENTES
// ====================================

function renderReagentes() {
  const reagentes = getReagentes();
  
  if (reagentes.length === 0) {
    reagentesTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem; color: var(--color-gray-500);">
          Nenhum reagente cadastrado.
        </td>
      </tr>
    `;
    return;
  }
  
  reagentesTableBody.innerHTML = reagentes.map(reagente => {
    const isLow = reagente.quantidade <= reagente.minimo;
    const badgeClass = isLow ? 'badge-low' : 'badge-ok';
    const badgeText = isLow ? 'Baixo' : 'OK';
    const badgeIcon = isLow ? 'alert-circle' : 'check-circle';
    
    return `
      <tr>
        <td><strong>${reagente.nome}</strong></td>
        <td class="text-center">${reagente.quantidade}</td>
        <td class="text-center">${reagente.unidade}</td>
        <td class="text-center">${reagente.minimo}</td>
        <td class="text-center">
          <span class="badge ${badgeClass}">
            <i data-lucide="${badgeIcon}"></i>
            ${badgeText}
          </span>
        </td>
        <td class="text-right">
          <div class="table-actions">
            <button class="btn-icon btn-edit" onclick="openModalEditReagente(${reagente.id})" title="Editar">
              <i data-lucide="edit-2"></i>
            </button>
            <button class="btn-icon btn-delete" onclick="openModalDeleteReagente(${reagente.id})" title="Excluir">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
  
  lucide.createIcons();
}

// ====================================
// RENDERIZAÇÃO - VIDRARIAS
// ====================================

function renderVidrarias() {
  const vidrarias = getVidrarias();
  
  if (vidrarias.length === 0) {
    vidrariasTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem; color: var(--color-gray-500);">
          Nenhuma vidraria cadastrada.
        </td>
      </tr>
    `;
    return;
  }
  
  vidrariasTableBody.innerHTML = vidrarias.map(vidraria => {
    const isLow = vidraria.quantidade <= vidraria.minimo;
    const badgeClass = isLow ? 'badge-low' : 'badge-ok';
    const badgeText = isLow ? 'Baixo' : 'OK';
    const badgeIcon = isLow ? 'alert-circle' : 'check-circle';
    
    return `
      <tr>
        <td><strong>${vidraria.nome}</strong></td>
        <td class="text-center">${vidraria.quantidade}</td>
        <td class="text-center">${vidraria.unidade}</td>
        <td class="text-center">${vidraria.minimo}</td>
        <td class="text-center">
          <span class="badge ${badgeClass}">
            <i data-lucide="${badgeIcon}"></i>
            ${badgeText}
          </span>
        </td>
        <td class="text-right">
          <div class="table-actions">
            <button class="btn-icon btn-edit" onclick="openModalEditVidraria(${vidraria.id})" title="Editar">
              <i data-lucide="edit-2"></i>
            </button>
            <button class="btn-icon btn-delete" onclick="openModalDeleteVidraria(${vidraria.id})" title="Excluir">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
  
  lucide.createIcons();
}

// ====================================
// MODAL USUÁRIO - FUNÇÕES
// ====================================

function openModalNovoUsuario() {
  currentEditUsuarioId = null;
  modalUsuarioTitle.textContent = 'Novo Usuário';
  formUsuario.reset();
  document.getElementById('usuarioSenha').disabled = false;
  modalUsuario.classList.add('active');
}

function openModalEditUsuario(id) {
  currentEditUsuarioId = id;
  const usuarios = getUsers();
  const usuario = usuarios.find(u => u.id === id);
  
  if (usuario) {
    modalUsuarioTitle.textContent = 'Editar Usuário';
    document.getElementById('usuarioNome').value = usuario.nome;
    document.getElementById('usuarioEmail').value = usuario.email;
    document.getElementById('usuarioSenha').value = usuario.senha;
    document.getElementById('usuarioTipo').value = usuario.tipo;
    modalUsuario.classList.add('active');
  }
}

function closeModalUsuario() {
  modalUsuario.classList.remove('active');
  formUsuario.reset();
  currentEditUsuarioId = null;
}

function handleSubmitUsuario(e) {
  e.preventDefault();
  
  const nome = document.getElementById('usuarioNome').value;
  const email = document.getElementById('usuarioEmail').value;
  const senha = document.getElementById('usuarioSenha').value;
  const tipo = document.getElementById('usuarioTipo').value;
  
  if (currentEditUsuarioId) {
    updateUser(currentEditUsuarioId, { nome, email, senha, tipo });
    showToast('Usuário atualizado com sucesso!');
  } else {
    addUser({ nome, email, senha, tipo });
    showToast('Usuário cadastrado com sucesso!');
  }
  
  closeModalUsuario();
  renderUsuarios();
}

// ====================================
// MODAL REAGENTE - FUNÇÕES
// ====================================

function openModalNovoReagente() {
  currentEditReagenteId = null;
  modalReagenteTitle.textContent = 'Novo Reagente';
  formReagente.reset();
  modalReagente.classList.add('active');
}

function openModalEditReagente(id) {
  currentEditReagenteId = id;
  const reagentes = getReagentes();
  const reagente = reagentes.find(r => r.id === id);
  
  if (reagente) {
    modalReagenteTitle.textContent = 'Editar Reagente';
    document.getElementById('reagenteNome').value = reagente.nome;
    document.getElementById('reagenteQuantidade').value = reagente.quantidade;
    document.getElementById('reagenteMinimo').value = reagente.minimo;
    document.getElementById('reagenteUnidade').value = reagente.unidade;
    modalReagente.classList.add('active');
  }
}

function closeModalReagente() {
  modalReagente.classList.remove('active');
  formReagente.reset();
  currentEditReagenteId = null;
}

function handleSubmitReagente(e) {
  e.preventDefault();
  
  const nome = document.getElementById('reagenteNome').value;
  const quantidade = parseFloat(document.getElementById('reagenteQuantidade').value);
  const minimo = parseFloat(document.getElementById('reagenteMinimo').value);
  const unidade = document.getElementById('reagenteUnidade').value;
  
  if (currentEditReagenteId) {
    updateReagente(currentEditReagenteId, { nome, quantidade, minimo, unidade });
    showToast('Reagente atualizado com sucesso!');
  } else {
    addReagente({ nome, quantidade, minimo, unidade });
    showToast('Reagente cadastrado com sucesso!');
  }
  
  closeModalReagente();
  renderReagentes();
}

// ====================================
// MODAL VIDRARIA - FUNÇÕES
// ====================================

function openModalNovaVidraria() {
  currentEditVidrariaId = null;
  modalVidrariaTitle.textContent = 'Nova Vidraria';
  formVidraria.reset();
  modalVidraria.classList.add('active');
}

function openModalEditVidraria(id) {
  currentEditVidrariaId = id;
  const vidrarias = getVidrarias();
  const vidraria = vidrarias.find(v => v.id === id);
  
  if (vidraria) {
    modalVidrariaTitle.textContent = 'Editar Vidraria';
    document.getElementById('vidriaNome').value = vidraria.nome;
    document.getElementById('vidrariaQuantidade').value = vidraria.quantidade;
    document.getElementById('vidrariaMinimo').value = vidraria.minimo;
    document.getElementById('vidrariaUnidade').value = vidraria.unidade;
    modalVidraria.classList.add('active');
  }
}

function closeModalVidraria() {
  modalVidraria.classList.remove('active');
  formVidraria.reset();
  currentEditVidrariaId = null;
}

function handleSubmitVidraria(e) {
  e.preventDefault();
  
  const nome = document.getElementById('vidriaNome').value;
  const quantidade = parseInt(document.getElementById('vidrariaQuantidade').value);
  const minimo = parseInt(document.getElementById('vidrariaMinimo').value);
  const unidade = document.getElementById('vidrariaUnidade').value;
  
  if (currentEditVidrariaId) {
    updateVidraria(currentEditVidrariaId, { nome, quantidade, minimo, unidade });
    showToast('Vidraria atualizada com sucesso!');
  } else {
    addVidraria({ nome, quantidade, minimo, unidade });
    showToast('Vidraria cadastrada com sucesso!');
  }
  
  closeModalVidraria();
  renderVidrarias();
}

// ====================================
// MODAL CONFIRMAR - FUNÇÕES
// ====================================

function openModalDeleteUsuario(id) {
  const usuarios = getUsers();
  const usuario = usuarios.find(u => u.id === id);
  if (usuario) {
    currentDeleteType = 'usuario';
    currentDeleteId = id;
    confirmMessage.textContent = `Tem certeza que deseja excluir o usuário "${usuario.nome}"? Esta ação não pode ser desfeita.`;
    modalConfirmar.classList.add('active');
  }
}

function openModalDeleteReagente(id) {
  const reagentes = getReagentes();
  const reagente = reagentes.find(r => r.id === id);
  if (reagente) {
    currentDeleteType = 'reagente';
    currentDeleteId = id;
    confirmMessage.textContent = `Tem certeza que deseja excluir o reagente "${reagente.nome}"? Esta ação não pode ser desfeita.`;
    modalConfirmar.classList.add('active');
  }
}

function openModalDeleteVidraria(id) {
  const vidrarias = getVidrarias();
  const vidraria = vidrarias.find(v => v.id === id);
  if (vidraria) {
    currentDeleteType = 'vidraria';
    currentDeleteId = id;
    confirmMessage.textContent = `Tem certeza que deseja excluir a vidraria "${vidraria.nome}"? Esta ação não pode ser desfeita.`;
    modalConfirmar.classList.add('active');
  }
}

function closeModalConfirmar() {
  modalConfirmar.classList.remove('active');
  currentDeleteType = null;
  currentDeleteId = null;
}

function handleConfirmarExclusao() {
  if (currentDeleteType === 'usuario') {
    deleteUser(currentDeleteId);
    renderUsuarios();
    showToast('Usuário excluído com sucesso!');
  } else if (currentDeleteType === 'reagente') {
    deleteReagente(currentDeleteId);
    renderReagentes();
    showToast('Reagente excluído com sucesso!');
  } else if (currentDeleteType === 'vidraria') {
    deleteVidraria(currentDeleteId);
    renderVidrarias();
    showToast('Vidraria excluída com sucesso!');
  }
  
  closeModalConfirmar();
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