// ====================================
// STORAGE.JS - GERENCIAMENTO CENTRAL DE DADOS
// ====================================

// Chaves do localStorage
const STORAGE_KEYS = {
  USERS: 'lab_users',
  RESERVATIONS: 'lab_reservations',
  REAGENTES: 'lab_reagentes',
  VIDRARIAS: 'lab_vidrarias',
  KITS: 'lab_kits'
};

// ====================================
// INICIALIZAÇÃO DOS DADOS
// ====================================

function initializeStorage() {
  // Inicializa usuários se não existirem
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers = [
      { 
        id: 1, 
        nome: 'Prof. Ana Silva', 
        email: 'ana.silva@etec.sp.gov.br', 
        senha: 'ppp',
        tipo: 'Professor' 
      },
      { 
        id: 2, 
        nome: 'Carlos Mendes', 
        email: 'carlos.mendes@etec.sp.gov.br', 
        senha: 'ttt',
        tipo: 'Técnico' 
      },
      { 
        id: 3, 
        nome: 'Prof. Maria Santos', 
        email: 'maria.santos@etec.sp.gov.br', 
        senha: 'ppp',
        tipo: 'Professor' 
      },
      { 
        id: 4, 
        nome: 'João Oliveira', 
        email: 'joao.oliveira@etec.sp.gov.br', 
        senha: 'aaa',
        tipo: 'Administrador' 
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }

  // Inicializa reagentes se não existirem
  if (!localStorage.getItem(STORAGE_KEYS.REAGENTES)) {
    const defaultReagentes = [
      { id: 1, nome: 'Amido Solúvel', quantidade: 500, unidade: 'g', minimo: 100 },
      { id: 2, nome: 'Biftalato de Potássio', quantidade: 500, unidade: 'g', minimo: 100 },
      { id: 3, nome: 'Carbonato de Sódio', quantidade: 400, unidade: 'g', minimo: 100 },
      { id: 4, nome: 'Cloreto de Potássio', quantidade: 500, unidade: 'g', minimo: 100 },
      { id: 5, nome: 'Cloreto de Sódio', quantidade: 700, unidade: 'g', minimo: 100 },
      { id: 6, nome: 'Iodeto de Potássio', quantidade: 350, unidade: 'g', minimo: 100 },
      { id: 7, nome: 'Lauril Sulfato de sódio', quantidade: 200, unidade: 'g', minimo: 50 },
      { id: 8, nome: 'Nitrato de Prata', quantidade: 15, unidade: 'g', minimo: 5 },
      { id: 9, nome: 'Sulfato de Alúminio', quantidade: 500, unidade: 'g', minimo: 100 },
      { id: 10, nome: 'Tiossulfato de Sódio', quantidade: 400, unidade: 'g', minimo: 100 }
    ];
    localStorage.setItem(STORAGE_KEYS.REAGENTES, JSON.stringify(defaultReagentes));
  }

  // Inicializa vidrarias se não existirem
  if (!localStorage.getItem(STORAGE_KEYS.VIDRARIAS)) {
    const defaultVidrarias = [
      { id: 1, nome: 'Béquer 50ml', quantidade: 88, unidade: 'und', minimo: 20 },
      { id: 2, nome: 'Béquer 100ml', quantidade: 48, unidade: 'und', minimo: 15 },
      { id: 3, nome: 'Béquer 250ml', quantidade: 42, unidade: 'und', minimo: 20 },
      { id: 4, nome: 'Béquer 500ml', quantidade: 13, unidade: 'und', minimo: 5 },
      { id: 5, nome: 'Béquer 1000ml', quantidade: 13, unidade: 'und', minimo: 5 },
      { id: 6, nome: 'Béquer 2000ml', quantidade: 3, unidade: 'und', minimo: 2 },
      { id: 7, nome: 'Erlenmyer 50ml', quantidade: 13, unidade: 'und', minimo: 5 },
      { id: 8, nome: 'Erlenmyer 100ml', quantidade: 14, unidade: 'und', minimo: 5 },
      { id: 9, nome: 'Erlenmyer 250ml', quantidade: 39, unidade: 'und', minimo: 15 },
      { id: 10, nome: 'Erlenmyer 500ml', quantidade: 7, unidade: 'und', minimo: 5 },
      { id: 11, nome: 'Erlenmyer 1000ml', quantidade: 10, unidade: 'und', minimo: 5 },
      { id: 12, nome: 'Proveta 10ml', quantidade: 29, unidade: 'und', minimo: 10 },
      { id: 13, nome: 'Proveta 25ml', quantidade: 17, unidade: 'und', minimo: 8 },
      { id: 14, nome: 'Proveta 50ml', quantidade: 19, unidade: 'und', minimo: 8 },
      { id: 15, nome: 'Proveta 100ml', quantidade: 16, unidade: 'und', minimo: 8 },
      { id: 16, nome: 'Proveta 250ml', quantidade: 18, unidade: 'und', minimo: 8 },
      { id: 17, nome: 'Proveta 500ml', quantidade: 5, unidade: 'und', minimo: 3 },
      { id: 18, nome: 'Proveta 1000ml', quantidade: 10, unidade: 'und', minimo: 3 },
      { id: 19, nome: 'Pipeta graduada 1ml', quantidade: 14, unidade: 'und', minimo: 5 },
      { id: 20, nome: 'Pipeta graduada 2ml', quantidade: 17, unidade: 'und', minimo: 5 },
      { id: 21, nome: 'Pipeta graduada 5ml', quantidade: 27, unidade: 'und', minimo: 10 },
      { id: 22, nome: 'Pipeta graduada 10ml', quantidade: 58, unidade: 'und', minimo: 15 },
      { id: 23, nome: 'Pipeta graduada 25ml', quantidade: 11, unidade: 'und', minimo: 5 },
      { id: 24, nome: 'Pipeta volumétrica 2ml', quantidade: 9, unidade: 'und', minimo: 3 },
      { id: 25, nome: 'Pipeta volumétrica 5ml', quantidade: 20, unidade: 'und', minimo: 5 },
      { id: 26, nome: 'Pipeta volumétrica 10ml', quantidade: 35, unidade: 'und', minimo: 10 },
      { id: 27, nome: 'Pipeta volumétrica 20ml', quantidade: 7, unidade: 'und', minimo: 3 },
      { id: 28, nome: 'Pipeta volumétrica 25ml', quantidade: 13, unidade: 'und', minimo: 5 },
      { id: 29, nome: 'Balão volumétrico 10ml', quantidade: 2, unidade: 'und', minimo: 2 },
      { id: 30, nome: 'Balão volumétrico 25ml', quantidade: 19, unidade: 'und', minimo: 8 },
      { id: 31, nome: 'Balão volumétrico 50ml', quantidade: 9, unidade: 'und', minimo: 5 },
      { id: 32, nome: 'Balão volumétrico 100ml', quantidade: 20, unidade: 'und', minimo: 8 },
      { id: 33, nome: 'Balão volumétrico 250ml', quantidade: 16, unidade: 'und', minimo: 8 },
      { id: 34, nome: 'Balão volumétrico 500ml', quantidade: 5, unidade: 'und', minimo: 3 },
      { id: 35, nome: 'Balão volumétrico 1000ml', quantidade: 7, unidade: 'und', minimo: 3 },
      { id: 36, nome: 'Tubo de ensaio', quantidade: 559, unidade: 'und', minimo: 100 },
      { id: 37, nome: 'Tubo Falcon 15ml', quantidade: 99, unidade: 'und', minimo: 30 },
      { id: 38, nome: 'Tubo Falcon 50ml', quantidade: 104, unidade: 'und', minimo: 30 },
      { id: 39, nome: 'Bureta 25ml', quantidade: 0, unidade: 'und', minimo: 5 },
      { id: 40, nome: 'Bureta 50ml', quantidade: 7, unidade: 'und', minimo: 5 },
      { id: 41, nome: 'Funil de vidro', quantidade: 14, unidade: 'und', minimo: 5 },
      { id: 42, nome: 'Funil de separação', quantidade: 15, unidade: 'und', minimo: 5 },
      { id: 43, nome: 'Balão de fundo redondo 250ml', quantidade: 16, unidade: 'und', minimo: 5 },
      { id: 44, nome: 'Balão de fundo redondo 500ml', quantidade: 9, unidade: 'und', minimo: 5 },
      { id: 45, nome: 'Balão de fundo redondo 1000ml', quantidade: 6, unidade: 'und', minimo: 3 },
      { id: 46, nome: 'Condensador', quantidade: 18, unidade: 'und', minimo: 5 },
      { id: 47, nome: 'Cadinho de porcelana', quantidade: 27, unidade: 'und', minimo: 10 },
      { id: 48, nome: 'Cápsula de porcelana', quantidade: 26, unidade: 'und', minimo: 10 },
      { id: 49, nome: 'Vidro de relógio', quantidade: 53, unidade: 'und', minimo: 20 },
      { id: 50, nome: 'Placa de Petri', quantidade: 52, unidade: 'und', minimo: 20 },
      { id: 51, nome: 'Bagueta', quantidade: 8, unidade: 'und', minimo: 5 },
      { id: 52, nome: 'Espátula', quantidade: 14, unidade: 'und', minimo: 5 },
      { id: 53, nome: 'Termômetro', quantidade: 4, unidade: 'und', minimo: 5 },
      { id: 54, nome: 'Papel de filtro (pacote)', quantidade: 8, unidade: 'pacote', minimo: 3 }
    ];
    localStorage.setItem(STORAGE_KEYS.VIDRARIAS, JSON.stringify(defaultVidrarias));
  }

  // Inicializa reservas se não existirem
  if (!localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify([]));
  }

  // Inicializa kits se não existirem
  if (!localStorage.getItem(STORAGE_KEYS.KITS)) {
    localStorage.setItem(STORAGE_KEYS.KITS, JSON.stringify([]));
  }
}

// ====================================
// FUNÇÕES DE USUÁRIOS
// ====================================

function getUsers() {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function addUser(userData) {
  const users = getUsers();
  const newUser = {
    id: Date.now(),
    ...userData
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

function updateUser(userId, userData) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...userData };
    saveUsers(users);
    return users[index];
  }
  return null;
}

function deleteUser(userId) {
  const users = getUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  saveUsers(filteredUsers);
}

function authenticateUser(email, senha) {
  const users = getUsers();
  return users.find(u => u.email === email && u.senha === senha);
}

function getCurrentUser() {
  const userStr = sessionStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

function setCurrentUser(user) {
  sessionStorage.setItem('currentUser', JSON.stringify(user));
}

function logoutUser() {
  sessionStorage.removeItem('currentUser');
}

// ====================================
// FUNÇÕES DE REAGENTES
// ====================================

function getReagentes() {
  const reagentes = localStorage.getItem(STORAGE_KEYS.REAGENTES);
  return reagentes ? JSON.parse(reagentes) : [];
}

function saveReagentes(reagentes) {
  localStorage.setItem(STORAGE_KEYS.REAGENTES, JSON.stringify(reagentes));
}

function addReagente(reagenteData) {
  const reagentes = getReagentes();
  const newReagente = {
    id: Date.now(),
    ...reagenteData
  };
  reagentes.push(newReagente);
  saveReagentes(reagentes);
  return newReagente;
}

function updateReagente(reagenteId, reagenteData) {
  const reagentes = getReagentes();
  const index = reagentes.findIndex(r => r.id === reagenteId);
  if (index !== -1) {
    reagentes[index] = { ...reagentes[index], ...reagenteData };
    saveReagentes(reagentes);
    return reagentes[index];
  }
  return null;
}

function deleteReagente(reagenteId) {
  const reagentes = getReagentes();
  const filteredReagentes = reagentes.filter(r => r.id !== reagenteId);
  saveReagentes(filteredReagentes);
}

function updateReagenteQuantity(reagenteNome, quantidadeDelta) {
  const reagentes = getReagentes();
  const reagente = reagentes.find(r => r.nome === reagenteNome);
  if (reagente) {
    reagente.quantidade = Math.max(0, reagente.quantidade + quantidadeDelta);
    saveReagentes(reagentes);
    return reagente;
  }
  return null;
}

// ====================================
// FUNÇÕES DE VIDRARIAS
// ====================================

function getVidrarias() {
  const vidrarias = localStorage.getItem(STORAGE_KEYS.VIDRARIAS);
  return vidrarias ? JSON.parse(vidrarias) : [];
}

function saveVidrarias(vidrarias) {
  localStorage.setItem(STORAGE_KEYS.VIDRARIAS, JSON.stringify(vidrarias));
}

function addVidraria(vidrariaData) {
  const vidrarias = getVidrarias();
  const newVidraria = {
    id: Date.now(),
    ...vidrariaData
  };
  vidrarias.push(newVidraria);
  saveVidrarias(vidrarias);
  return newVidraria;
}

function updateVidraria(vidrariaId, vidrariaData) {
  const vidrarias = getVidrarias();
  const index = vidrarias.findIndex(v => v.id === vidrariaId);
  if (index !== -1) {
    vidrarias[index] = { ...vidrarias[index], ...vidrariaData };
    saveVidrarias(vidrarias);
    return vidrarias[index];
  }
  return null;
}

function deleteVidraria(vidrariaId) {
  const vidrarias = getVidrarias();
  const filteredVidrarias = vidrarias.filter(v => v.id !== vidrariaId);
  saveVidrarias(filteredVidrarias);
}

function updateVidrariaQuantity(vidriaNome, quantidadeDelta) {
  const vidrarias = getVidrarias();
  const vidraria = vidrarias.find(v => v.nome === vidriaNome);
  if (vidraria) {
    vidraria.quantidade = Math.max(0, vidraria.quantidade + quantidadeDelta);
    saveVidrarias(vidrarias);
    return vidraria;
  }
  return null;
}

// ====================================
// FUNÇÃO UNIFICADA PARA ATUALIZAR MATERIAIS
// ====================================

function updateMaterialQuantity(materialNome, quantidadeDelta) {
  // Tenta atualizar em reagentes primeiro
  let material = updateReagenteQuantity(materialNome, quantidadeDelta);
  
  // Se não encontrou em reagentes, tenta em vidrarias
  if (!material) {
    material = updateVidrariaQuantity(materialNome, quantidadeDelta);
  }
  
  return material;
}

// ====================================
// FUNÇÕES DE RESERVAS
// ====================================

function getReservations() {
  const reservations = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
  return reservations ? JSON.parse(reservations) : [];
}

function saveReservations(reservations) {
  localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
}

function addReservation(reservationData) {
  const reservations = getReservations();
  const currentUser = getCurrentUser();
  
  const newReservation = {
    id: Date.now(),
    professorId: currentUser.id,
    professorNome: currentUser.nome,
    status: 'pendente',
    criadoEm: new Date().toISOString(),
    ...reservationData
  };
  
  reservations.push(newReservation);
  saveReservations(reservations);
  
  // Atualiza estoque se a reserva tiver materiais
  if (reservationData.materiais && Array.isArray(reservationData.materiais)) {
    reservationData.materiais.forEach(material => {
      updateMaterialQuantity(material.nome, -material.quantidade);
    });
  }
  
  return newReservation;
}

function updateReservation(reservationId, reservationData) {
  const reservations = getReservations();
  const index = reservations.findIndex(r => r.id === reservationId);
  if (index !== -1) {
    reservations[index] = { ...reservations[index], ...reservationData };
    saveReservations(reservations);
    return reservations[index];
  }
  return null;
}

function deleteReservation(reservationId) {
  const reservations = getReservations();
  const reservation = reservations.find(r => r.id === reservationId);
  
  // Devolve os materiais ao estoque
  if (reservation && reservation.materiais) {
    reservation.materiais.forEach(material => {
      updateMaterialQuantity(material.nome, material.quantidade);
    });
  }
  
  const filteredReservations = reservations.filter(r => r.id !== reservationId);
  saveReservations(filteredReservations);
}

function getReservationsByDate(date) {
  const reservations = getReservations();
  return reservations.filter(r => r.data === date);
}

function getReservationsByProfessor(professorId) {
  const reservations = getReservations();
  return reservations.filter(r => r.professorId === professorId);
}

// ====================================
// FUNÇÕES DE KITS
// ====================================

function getKits() {
  const kits = localStorage.getItem(STORAGE_KEYS.KITS);
  return kits ? JSON.parse(kits) : [];
}

function saveKits(kits) {
  localStorage.setItem(STORAGE_KEYS.KITS, JSON.stringify(kits));
}

function addKit(kitData) {
  const kits = getKits();
  const currentUser = getCurrentUser();
  
  const newKit = {
    id: Date.now(),
    professorId: currentUser.id,
    ...kitData
  };
  
  kits.push(newKit);
  saveKits(kits);
  return newKit;
}

function updateKit(kitId, kitData) {
  const kits = getKits();
  const index = kits.findIndex(k => k.id === kitId);
  if (index !== -1) {
    kits[index] = { ...kits[index], ...kitData };
    saveKits(kits);
    return kits[index];
  }
  return null;
}

function deleteKit(kitId) {
  const kits = getKits();
  const filteredKits = kits.filter(k => k.id !== kitId);
  saveKits(filteredKits);
}

function getKitsByProfessor(professorId) {
  const kits = getKits();
  return kits.filter(k => k.professorId === professorId);
}

// Inicializa o storage quando o script carrega
initializeStorage();