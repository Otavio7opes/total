// ====================================
// DADOS SIMULADOS
// ====================================

let kits = [
  {
    id: 1,
    nome: 'Kit Ácidos e Bases',
    descricao: 'Experimentos de pH e neutralização',
    itens: [
      { tipo: 'Reagente', nome: 'Ácido Clorídrico', quantidade: 2 },
      { tipo: 'Reagente', nome: 'Hidróxido de Sódio', quantidade: 2 },
      { tipo: 'Vidraria', nome: 'Béquer 50ml', quantidade: 4 },
      { tipo: 'Vidraria', nome: 'Pipeta', quantidade: 4 }
    ]
  },
  {
    id: 2,
    nome: 'Kit Vidrarias Básicas',
    descricao: 'Conjunto essencial de vidrarias',
    itens: [
      { tipo: 'Vidraria', nome: 'Erlenmyer 250ml', quantidade: 6 },
      { tipo: 'Vidraria', nome: 'Proveta 100ml', quantidade: 4 },
      { tipo: 'Vidraria', nome: 'Tubo de ensaio', quantidade: 12 }
    ]
  },
  {
    id: 3,
    nome: 'Kit Titulação',
    descricao: 'Para experimentos de titulação',
    itens: [
      { tipo: 'Vidraria', nome: 'Bureta', quantidade: 2 },
      { tipo: 'Reagente', nome: 'Indicador Fenolftaleína', quantidade: 1 },
      { tipo: 'Vidraria', nome: 'Erlenmyer 125ml', quantidade: 4 }
    ]
  }
];

let currentEditKitId = null;
let currentDeleteKitId = null;
let currentKitItems = [];

// ====================================
// ELEMENTOS DO DOM
// ====================================

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
const itemNomeInput = document.getElementById('itemNome');
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
  lucide.createIcons();
  renderKits();
  
  // Event Listeners
  btnNovoKit.addEventListener('click', openModalNovoKit);
  btnCloseModalKit.addEventListener('click', closeModalKit);
  modalKitOverlay.addEventListener('click', closeModalKit);
  btnCancelKit.addEventListener('click', closeModalKit);
  formKit.addEventListener('submit', handleSubmitKit);
  btnAddItem.addEventListener('click', handleAddItem);
  searchKit.addEventListener('input', handleSearch);
  
  // Modal View
  btnCloseModalViewKit.addEventListener('click', closeModalViewKit);
  modalViewKitOverlay.addEventListener('click', closeModalViewKit);
  btnCloseView.addEventListener('click', closeModalViewKit);
  
  // Modal Confirmar
  btnCloseModalConfirmar.addEventListener('click', closeModalConfirmar);
  modalConfirmarOverlay.addEventListener('click', closeModalConfirmar);
  btnCancelConfirmar.addEventListener('click', closeModalConfirmar);
  btnConfirmarExclusao.addEventListener('click', handleConfirmarExclusao);
});

// ====================================
// RENDERIZAR KITS
// ====================================

function renderKits(filteredKits = kits) {
  if (filteredKits.length === 0) {
    kitsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--color-gray-500);">
        <i data-lucide="package" style="width: 64px; height: 64px; margin-bottom: 1rem;"></i>
        <p>Nenhum kit encontrado.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }
  
  kitsGrid.innerHTML = filteredKits.map(kit => `
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
  const filtered = kits.filter(kit => 
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
  const nome = itemNomeInput.value.trim();
  const quantidade = parseInt(itemQuantidadeInput.value);
  
  if (!tipo || !nome || !quantidade || quantidade <= 0) {
    alert('Preencha todos os campos do item');
    return;
  }
  
  currentKitItems.push({ tipo, nome, quantidade });
  
  // Limpa os campos
  itemTipoSelect.value = '';
  itemNomeInput.value = '';
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
    // Editar kit existente
    const index = kits.findIndex(k => k.id === currentEditKitId);
    if (index !== -1) {
      kits[index] = {
        ...kits[index],
        nome,
        descricao,
        itens: [...currentKitItems]
      };
      showToast('Kit atualizado com sucesso!');
    }
  } else {
    // Criar novo kit
    const novoKit = {
      id: Date.now(),
      nome,
      descricao,
      itens: [...currentKitItems]
    };
    kits.push(novoKit);
    showToast('Kit criado com sucesso!');
  }
  
  closeModalKit();
  renderKits();
  
  // Em produção, você faria:
  /*
  fetch('/api/kits', {
    method: currentEditKitId ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, descricao, itens: currentKitItems })
  })
  .then(response => response.json())
  .then(data => {
    showToast(currentEditKitId ? 'Kit atualizado!' : 'Kit criado!');
    loadKits(); // Recarrega da API
  });
  */
}

// ====================================
// VISUALIZAR KIT
// ====================================

function openModalViewKit(id) {
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
  kits = kits.filter(k => k.id !== currentDeleteKitId);
  closeModalConfirmar();
  renderKits();
  showToast('Kit excluído com sucesso!');
  
  // Em produção:
  /*
  fetch(`/api/kits/${currentDeleteKitId}`, { method: 'DELETE' })
    .then(() => {
      showToast('Kit excluído!');
      loadKits();
    });
  */
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

// ====================================
// PREVENIR FECHAR MODAL AO CLICAR NO CONTEÚDO
// ====================================

document.querySelectorAll('.modal-content').forEach(content => {
  content.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});