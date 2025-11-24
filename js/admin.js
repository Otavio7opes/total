// ====================================
// DADOS INICIAIS (Simulação de Backend)
// ====================================

let usuarios = [
  { id: 1, nome: 'Prof. Ana Silva', email: 'ana.silva@etec.sp.gov.br', tipo: 'Professor' },
  { id: 2, nome: 'Carlos Mendes', email: 'carlos.mendes@etec.sp.gov.br', tipo: 'Técnico' },
  { id: 3, nome: 'Prof. Maria Santos', email: 'maria.santos@etec.sp.gov.br', tipo: 'Professor' },
  { id: 4, nome: 'João Oliveira', email: 'joao.oliveira@etec.sp.gov.br', tipo: 'Administrador' }
];

let materiais = [
  { id: 1, nome: 'Béquer 50ml', quantidade: 45, unidade: 'unidade', minimo: 20 },
  { id: 2, nome: 'Ácido Clorídrico', quantidade: 15, unidade: 'litro', minimo: 10 },
  { id: 3, nome: 'Pipeta', quantidade: 30, unidade: 'unidade', minimo: 15 },
  { id: 4, nome: 'Erlenmyer 250ml', quantidade: 25, unidade: 'unidade', minimo: 10 },
  { id: 5, nome: 'Tubo de ensaio', quantidade: 80, unidade: 'unidade', minimo: 40 },
  { id: 6, nome: 'Hidróxido de sódio', quantidade: 8, unidade: 'quilograma', minimo: 15 },
  { id: 7, nome: 'Proveta 100ml', quantidade: 18, unidade: 'unidade', minimo: 10 },
  { id: 8, nome: 'Balança analítica', quantidade: 6, unidade: 'unidade', minimo: 3 },
  { id: 9, nome: 'Espátula', quantidade: 35, unidade: 'unidade', minimo: 20 },
  { id: 10, nome: 'Papel de filtro', quantidade: 100, unidade: 'folha', minimo: 50 }
];

// ====================================
// ELEMENTOS DO DOM
// ====================================

// Tabs
const tabUsuarios = document.getElementById('tabUsuarios');
const tabMateriais = document.getElementById('tabMateriais');
const contentUsuarios = document.getElementById('contentUsuarios');
const contentMateriais = document.getElementById('contentMateriais');

// Botões principais
const btnLogout = document.getElementById('btnLogout');
const btnNovoUsuario = document.getElementById('btnNovoUsuario');
const btnNovoMaterial = document.getElementById('btnNovoMaterial');

// Tabelas
const usuariosTableBody = document.getElementById('usuariosTableBody');
const materiaisTableBody = document.getElementById('materiaisTableBody');

// Modal Usuário
const modalUsuario = document.getElementById('modalUsuario');
const modalUsuarioOverlay = document.getElementById('modalUsuarioOverlay');
const btnCloseModalUsuario = document.getElementById('btnCloseModalUsuario');
const modalUsuarioTitle = document.getElementById('modalUsuarioTitle');
const formUsuario = document.getElementById('formUsuario');
const btnCancelUsuario = document.getElementById('btnCancelUsuario');

// Modal Material
const modalMaterial = document.getElementById('modalMaterial');
const modalMaterialOverlay = document.getElementById('modalMaterialOverlay');
const btnCloseModalMaterial = document.getElementById('btnCloseModalMaterial');
const modalMaterialTitle = document.getElementById('modalMaterialTitle');
const formMaterial = document.getElementById('formMaterial');
const btnCancelMaterial = document.getElementById('btnCancelMaterial');

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
let currentEditMaterialId = null;
let currentDeleteType = null;
let currentDeleteId = null;

// ====================================
// INICIALIZAÇÃO
// ====================================

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa os ícones Lucide
  lucide.createIcons();
  
  // Renderiza os dados iniciais
  renderUsuarios();
  renderMateriais();
  
  // Event Listeners - Tabs
  tabUsuarios.addEventListener('click', () => switchTab('usuarios'));
  tabMateriais.addEventListener('click', () => switchTab('materiais'));
  
  // Event Listeners - Botões principais
  btnLogout.addEventListener('click', handleLogout);
  btnNovoUsuario.addEventListener('click', openModalNovoUsuario);
  btnNovoMaterial.addEventListener('click', openModalNovoMaterial);
  
  // Event Listeners - Modal Usuário
  btnCloseModalUsuario.addEventListener('click', closeModalUsuario);
  modalUsuarioOverlay.addEventListener('click', closeModalUsuario);
  btnCancelUsuario.addEventListener('click', closeModalUsuario);
  formUsuario.addEventListener('submit', handleSubmitUsuario);
  
  // Event Listeners - Modal Material
  btnCloseModalMaterial.addEventListener('click', closeModalMaterial);
  modalMaterialOverlay.addEventListener('click', closeModalMaterial);
  btnCancelMaterial.addEventListener('click', closeModalMaterial);
  formMaterial.addEventListener('submit', handleSubmitMaterial);
  
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
  if (tab === 'usuarios') {
    tabUsuarios.classList.add('active');
    tabMateriais.classList.remove('active');
    contentUsuarios.classList.add('active');
    contentMateriais.classList.remove('active');
  } else {
    tabMateriais.classList.add('active');
    tabUsuarios.classList.remove('active');
    contentMateriais.classList.add('active');
    contentUsuarios.classList.remove('active');
  }
}

// ====================================
// RENDERIZAÇÃO - USUÁRIOS
// ====================================

function renderUsuarios() {
  if (usuarios.length === 0) {
    usuariosTableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 2rem; color: var(--color-gray-500);">
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
// RENDERIZAÇÃO - MATERIAIS
// ====================================

function renderMateriais() {
  if (materiais.length === 0) {
    materiaisTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem; color: var(--color-gray-500);">
          Nenhum material cadastrado.
        </td>
      </tr>
    `;
    return;
  }
  
  materiaisTableBody.innerHTML = materiais.map(material => {
    const isLow = material.quantidade <= material.minimo;
    const badgeClass = isLow ? 'badge-low' : 'badge-ok';
    const badgeText = isLow ? 'Baixo' : 'OK';
    const badgeIcon = isLow ? 'alert-circle' : 'check-circle';
    
    return `
      <tr>
        <td><strong>${material.nome}</strong></td>
        <td class="text-center">${material.quantidade}</td>
        <td class="text-center">${material.unidade}</td>
        <td class="text-center">${material.minimo}</td>
        <td class="text-center">
          <span class="badge ${badgeClass}">
            <i data-lucide="${badgeIcon}"></i>
            ${badgeText}
          </span>
        </td>
        <td class="text-right">
          <div class="table-actions">
            <button class="btn-icon btn-edit" onclick="openModalEditMaterial(${material.id})" title="Editar">
              <i data-lucide="edit-2"></i>
            </button>
            <button class="btn-icon btn-delete" onclick="openModalDeleteMaterial(${material.id})" title="Excluir">
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
  modalUsuario.classList.add('active');
}

function openModalEditUsuario(id) {
  currentEditUsuarioId = id;
  const usuario = usuarios.find(u => u.id === id);
  
  if (usuario) {
    modalUsuarioTitle.textContent = 'Editar Usuário';
    document.getElementById('usuarioNome').value = usuario.nome;
    document.getElementById('usuarioEmail').value = usuario.email;
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
  const tipo = document.getElementById('usuarioTipo').value;
  
  if (currentEditUsuarioId) {
    // Editar usuário existente
    const index = usuarios.findIndex(u => u.id === currentEditUsuarioId);
    if (index !== -1) {
      usuarios[index] = { ...usuarios[index], nome, email, tipo };
      showToast('Usuário atualizado com sucesso!');
    }
  } else {
    // Criar novo usuário
    const novoUsuario = {
      id: Date.now(),
      nome,
      email,
      tipo
    };
    usuarios.push(novoUsuario);
    showToast('Usuário cadastrado com sucesso!');
  }
  
  closeModalUsuario();
  renderUsuarios();
}

// ====================================
// MODAL MATERIAL - FUNÇÕES
// ====================================

function openModalNovoMaterial() {
  currentEditMaterialId = null;
  modalMaterialTitle.textContent = 'Novo Material';
  formMaterial.reset();
  modalMaterial.classList.add('active');
}

function openModalEditMaterial(id) {
  currentEditMaterialId = id;
  const material = materiais.find(m => m.id === id);
  
  if (material) {
    modalMaterialTitle.textContent = 'Editar Material';
    document.getElementById('materialNome').value = material.nome;
    document.getElementById('materialQuantidade').value = material.quantidade;
    document.getElementById('materialMinimo').value = material.minimo;
    document.getElementById('materialUnidade').value = material.unidade;
    modalMaterial.classList.add('active');
  }
}

function closeModalMaterial() {
  modalMaterial.classList.remove('active');
  formMaterial.reset();
  currentEditMaterialId = null;
}

function handleSubmitMaterial(e) {
  e.preventDefault();
  
  const nome = document.getElementById('materialNome').value;
  const quantidade = parseInt(document.getElementById('materialQuantidade').value);
  const minimo = parseInt(document.getElementById('materialMinimo').value);
  const unidade = document.getElementById('materialUnidade').value;
  
  if (currentEditMaterialId) {
    // Editar material existente
    const index = materiais.findIndex(m => m.id === currentEditMaterialId);
    if (index !== -1) {
      materiais[index] = { ...materiais[index], nome, quantidade, minimo, unidade };
      showToast('Material atualizado com sucesso!');
    }
  } else {
    // Criar novo material
    const novoMaterial = {
      id: Date.now(),
      nome,
      quantidade,
      minimo,
      unidade
    };
    materiais.push(novoMaterial);
    showToast('Material cadastrado com sucesso!');
  }
  
  closeModalMaterial();
  renderMateriais();
}

// ====================================
// MODAL CONFIRMAR - FUNÇÕES
// ====================================

function openModalDeleteUsuario(id) {
  const usuario = usuarios.find(u => u.id === id);
  if (usuario) {
    currentDeleteType = 'usuario';
    currentDeleteId = id;
    confirmMessage.textContent = `Tem certeza que deseja excluir o usuário "${usuario.nome}"? Esta ação não pode ser desfeita.`;
    modalConfirmar.classList.add('active');
  }
}

function openModalDeleteMaterial(id) {
  const material = materiais.find(m => m.id === id);
  if (material) {
    currentDeleteType = 'material';
    currentDeleteId = id;
    confirmMessage.textContent = `Tem certeza que deseja excluir o material "${material.nome}"? Esta ação não pode ser desfeita.`;
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
    usuarios = usuarios.filter(u => u.id !== currentDeleteId);
    renderUsuarios();
    showToast('Usuário excluído com sucesso!');
  } else if (currentDeleteType === 'material') {
    materiais = materiais.filter(m => m.id !== currentDeleteId);
    renderMateriais();
    showToast('Material excluído com sucesso!');
  }
  
  closeModalConfirmar();
}

// ====================================
// LOGOUT
// ====================================

function handleLogout() {
  if (confirm('Deseja realmente sair do sistema?')) {
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