// ====================================
// KITS.JS ATUALIZADO COM SELEÇÃO DE ESTOQUE
// ====================================

let currentEditKitId = null;
let currentDeleteKitId = null;
let currentKitItems = [];

const kitsGrid = document.getElementById('kitsGrid');
const searchKit = document.getElementById('searchKit');
const btnNovoKit = document.getElementById('btnNovoKit');

// Modal Kit
const modalKit = document.getElementById('modalKit');
const modalKitOverlay = document.getElementById('modalKitOverlay');
const btnCloseModalKit = document.getElementById('btnCloseModalKit');
const modalKitTitle = document.getElementById('modalKitTitle');
const formKit = document.getElementById('formKit');
const btnCancelKit = document.getElementById('btnCancelKit');
const kitNomeInput = document.getElementById('kitNome');
const kitDescricaoTextarea = document.getElementById('kitDescricao');

// Adicionar Itens
const itemTipoSelect = document.getElementById('itemTipo');
const itemNomeSelect = document.getElementById('itemNome');
const itemQuantidadeInput = document.getElementById('itemQuantidade');
const btnAddItem = document.getElementById('btnAddItem');
const itensList = document.getElementById('itensList');

// Modal View
const modalViewKit = document.getElementById('modalViewKit');
const modalViewKitOverlay = document.getElementById('modalViewKitOverlay');
const btnCloseModalViewKit = document.getElementById('btnCloseModalViewKit');
const btnCloseView = document.getElementById('btnCloseView');
const viewKitTitle = document.getElementById('viewKitTitle');
const viewKitDescription = document.getElementById('viewKitDescription');
const viewItensList = document.getElementById('viewItensList');

// Modal Confirmar
const modalConfirmar = document.getElementById('modalConfirmar');
const modalConfirmarOverlay = document.getElementById('modalConfirmarOverlay');
const btnCloseModalConfirmar = document.getElementById('btnCloseModalConfirmar');
const btnCancelConfirmar = document.getElementById('btnCancelConfirmar');
const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao');
const confirmMessage = document.getElementById('confirmMessage');

// Toast
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// ====================================
// INICIALIZAÇÃO
// ====================================

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.tipo !== 'Professor') {
    window.location.href = 'login.html';
    return;
  }
  
  lucide.createIcons();
  renderKits();
  
  btnNovoKit.addEventListener('click', openModalNovoKit);
  btnCloseModalKit.addEventListener('click', closeModalKit);
  modalKitOverlay.addEventListener('click', closeModalKit);
  btnCancelKit.addEventListener('click', closeModalKit);
  formKit.addEventListener('submit', handleSubmitKit);
  btnAddItem.addEventListener('click', handleAddItem);
  searchKit.addEventListener('input', handleSearch);
  
  // Atualiza lista de materiais quando tipo muda
  itemTipoSelect.addEventListener('change', updateMaterialOptions);
  
  btnCloseModalViewKit.addEventListener('click', closeModalViewKit);
  modalViewKitOverlay.addEventListener('click', closeModalViewKit);
  btnCloseView.addEventListener('click', closeModalViewKit);
  
  btnCloseModalConfirmar.addEventListener('click', closeModalConfirmar);
  modalConfirmarOverlay.addEventListener('click', closeModalConfirmar);
  btnCancelConfirmar.addEventListener('click', closeModalConfirmar);
  btnConfirmarExclusao.addEventListener('click', handleConfirmarExclusao);
});

// ====================================
// ATUALIZAR OPÇÕES DE MATERIAIS
// ====================================

function updateMaterialOptions() {
  const tipo = itemTipoSelect.value;
  itemNomeSelect.innerHTML = '<option value="">Selecione o material</option>';
  
  if (tipo === 'Reagente') {
    const reagentes = getReagentes();
    reagentes.forEach(reagente => {
      const option = document.createElement('option');
      option.value = reagente.nome;
      option.textContent = `${reagente.nome} (Disponível: ${reagente.quantidade}${reagente.unidade})`;
      itemNomeSelect.appendChild(option);
    });
  } else if (tipo === 'Vidraria') {
    const vidrarias = getVidrarias();
    vidrarias.forEach(vidraria => {
      const option = document.createElement('option');
      option.value = vidraria.nome;
      option.textContent = `${vidraria.nome} (Disponível: ${vidraria.quantidade}${vidraria.unidade})`;
      itemNomeSelect.appendChild(option);
    });
  }
}

// ====================================
// RENDERIZAR KITS
// ====================================

function renderKits(filteredKits = null) {
  const currentUser = getCurrentUser();
  const kits = filteredKits || getKitsByProfessor(currentUser.id);
  
  if (kits.length === 0) {
    kitsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--color-gray-500);">
        <i data-lucide="package" style="width: 64px; height: 64px; margin-bottom: 1rem;"></i>
        <p>Nenhum kit encontrado.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }
  
  kitsGrid.innerHTML = kits.map(kit => `
    <div class="kit-card" onclick="openModalViewKit(${kit.id})">
      <div class="kit-icon">
        <i data-lucide="package"></i>
      </div>
      <h3 class="kit-title">${kit.nome}</h3>
      <p class="kit-description">${kit.descricao || 'Sem descrição'}</p>
      <div class="kit-items-count">
        <i data-lucide="list"></i>
        <span>${kit.itens.length} ${kit.itens.length === 1 ? 'item' : 'itens'}</span>
      </div>
      <div class="kit-actions" onclick="event.stopPropagation()">
        <button class="btn-icon btn-edit" onclick="openModalEditKit(${kit.id})" title="Editar">
          <i data-lucide="edit-2"></i>
        </button>
        <button class="btn-icon btn-delete" onclick="openModalDeleteKit(${kit.id})" title="Excluir">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    </div>
  `).join('');
  
  lucide.createIcons();
}

// ====================================
// BUSCAR KITS
// ====================================

function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const currentUser = getCurrentUser();
  const allKits = getKitsByProfessor(currentUser.id);
  
  const filtered = allKits.filter(kit => 
    kit.nome.toLowerCase().includes(searchTerm) ||
    (kit.descricao && kit.descricao.toLowerCase().includes(searchTerm))
  );
  renderKits(filtered);
}

// ====================================
// MODAL NOVO/EDITAR KIT
// ====================================

function openModalNovoKit() {
  currentEditKitId = null;
  currentKitItems = [];
  modalKitTitle.textContent = 'Novo Kit';
  formKit.reset();
  renderItemsList();
  modalKit.classList.add('active');
}

function openModalEditKit(id) {
  currentEditKitId = id;
  const kits = getKits();
  const kit = kits.find(k => k.id === id);
  
  if (kit) {
    modalKitTitle.textContent = 'Editar Kit';
    kitNomeInput.value = kit.nome;
    kitDescricaoTextarea.value = kit.descricao || '';
    currentKitItems = [...kit.itens];
    renderItemsList();
    modalKit.classList.add('active');
  }
}

function closeModalKit() {
  modalKit.classList.remove('active');
  formKit.reset();
  currentEditKitId = null;
  currentKitItems = [];
}

// ====================================
// ADICIONAR ITEM
// ====================================

function handleAddItem() {
  const tipo = itemTipoSelect.value;
  const nome = itemNomeSelect.value;
  const quantidade = parseFloat(itemQuantidadeInput.value);
  
  if (!tipo || !nome || !quantidade || quantidade <= 0) {
    alert('Preencha todos os campos do item');
    return;
  }
  
  // Verifica disponibilidade no estoque
  let disponivel = 0;
  if (tipo === 'Reagente') {
    const reagente = getReagentes().find(r => r.nome === nome);
    disponivel = reagente ? reagente.quantidade : 0;
  } else if (tipo === 'Vidraria') {
    const vidraria = getVidrarias().find(v => v.nome === nome);
    disponivel = vidraria ? vidraria.quantidade : 0;
  }
  
  if (quantidade > disponivel) {
    alert(`Quantidade solicitada (${quantidade}) excede o disponível em estoque (${disponivel})`);
    return;
  }
  
  currentKitItems.push({ tipo, nome, quantidade });
  
  itemTipoSelect.value = '';
  itemNomeSelect.innerHTML = '<option value="">Selecione o material</option>';
  itemQuantidadeInput.value = '';
  
  renderItemsList();
}

function removeItem(index) {
  currentKitItems.splice(index, 1);
  renderItemsList();
}

function renderItemsList() {
  if (currentKitItems.length === 0) {
    itensList.innerHTML = `
      <div style="text-align: center; padding: 1rem; color: var(--color-gray-500);">
        <p>Nenhum item adicionado ainda</p>
      </div>
    `;
    return;
  }
  
  itensList.innerHTML = currentKitItems.map((item, index) => `
    <div class="item-row">
      <div class="item-info">
        <div class="item-name">${item.nome}</div>
        <div class="item-details">${item.tipo} • Quantidade: ${item.quantidade}</div>
      </div>
      <button type="button" class="btn-remove-item" onclick="removeItem(${index})">
        <i data-lucide="x"></i>
      </button>
    </div>
  `).join('');
  
  lucide.createIcons();
}

// ====================================
// SALVAR KIT
// ====================================

function handleSubmitKit(e) {
  e.preventDefault();
  
  const nome = kitNomeInput.value.trim();
  const descricao = kitDescricaoTextarea.value.trim();
  
  if (!nome) {
    alert('Informe o nome do kit');
    return;
  }
  
  if (currentKitItems.length === 0) {
    alert('Adicione pelo menos um item ao kit');
    return;
  }
  
  if (currentEditKitId) {
    updateKit(currentEditKitId, {
      nome,
      descricao,
      itens: [...currentKitItems]
    });
    showToast('Kit atualizado com sucesso!');
  } else {
    addKit({
      nome,
      descricao,
      itens: [...currentKitItems]
    });
    showToast('Kit criado com sucesso!');
  }
  
  closeModalKit();
  renderKits();
}

// ====================================
// VISUALIZAR KIT
// ====================================

function openModalViewKit(id) {
  const kits = getKits();
  const kit = kits.find(k => k.id === id);
  
  if (kit) {
    viewKitTitle.textContent = kit.nome;
    viewKitDescription.textContent = kit.descricao || 'Sem descrição';
    
    viewItensList.innerHTML = kit.itens.map(item => `
      <div class="view-item">
        <i data-lucide="check"></i>
        <div>
          <strong>${item.nome}</strong>
          <div style="font-size: 0.875rem; color: var(--color-gray-600);">
            ${item.tipo} • Quantidade: ${item.quantidade}
          </div>
        </div>
      </div>
    `).join('');
    
    modalViewKit.classList.add('active');
    lucide.createIcons();
  }
}

function closeModalViewKit() {
  modalViewKit.classList.remove('active');
}

// ====================================
// EXCLUIR KIT
// ====================================

function openModalDeleteKit(id) {
  currentDeleteKitId = id;
  const kits = getKits();
  const kit = kits.find(k => k.id === id);
  
  if (kit) {
    confirmMessage.textContent = `Tem certeza que deseja excluir o kit "${kit.nome}"? Esta ação não pode ser desfeita.`;
    modalConfirmar.classList.add('active');
  }
}

function closeModalConfirmar() {
  modalConfirmar.classList.remove('active');
  currentDeleteKitId = null;
}

function handleConfirmarExclusao() {
  deleteKit(currentDeleteKitId);
  closeModalConfirmar();
  renderKits();
  showToast('Kit excluído com sucesso!');
}

// ====================================
// TOAST
// ====================================

function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
  
  lucide.createIcons();
}

document.querySelectorAll('.modal-content').forEach(content => {
  content.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});