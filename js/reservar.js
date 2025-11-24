// ====================================
// DADOS SIMULADOS
// ====================================

let kitsDisponiveis = [
  { id: 1, nome: 'Kit Ácidos e Bases' },
  { id: 2, nome: 'Kit Vidrarias Básicas' },
  { id: 3, nome: 'Kit Titulação' },
  { id: 4, nome: 'Kit Microscopia' }
];

// ====================================
// ELEMENTOS DO DOM
// ====================================

const formReserva = document.getElementById('formReserva');
const laboratorioSelect = document.getElementById('laboratorio');
const dataInput = document.getElementById('data');
const horarioInicioInput = document.getElementById('horarioInicio');
const horarioFimInput = document.getElementById('horarioFim');
const kitSelect = document.getElementById('kit');
const observacoesTextarea = document.getElementById('observacoes');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// ====================================
// INICIALIZAÇÃO
// ====================================

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  
  // Define data mínima como hoje
  const hoje = new Date().toISOString().split('T')[0];
  dataInput.min = hoje;
  
  // Carrega os kits
  loadKits();
  
  // Event Listeners
  formReserva.addEventListener('submit', handleSubmitReserva);
  kitSelect.addEventListener('change', handleKitChange);
});

// ====================================
// CARREGAR KITS
// ====================================

function loadKits() {
  // Limpa e adiciona a opção padrão
  kitSelect.innerHTML = '<option value="">Escolha um kit</option>';
  kitSelect.innerHTML += '<option value="novo">+ Criar Novo Kit</option>';
  
  // Adiciona os kits disponíveis
  kitsDisponiveis.forEach(kit => {
    const option = document.createElement('option');
    option.value = kit.id;
    option.textContent = kit.nome;
    kitSelect.appendChild(option);
  });
}

// ====================================
// HANDLER DE MUDANÇA DE KIT
// ====================================

function handleKitChange(e) {
  if (e.target.value === 'novo') {
    // Redireciona para a página de kits
    if (confirm('Você será redirecionado para criar um novo kit. Deseja continuar?')) {
      window.location.href = 'kits.html';
    } else {
      kitSelect.value = '';
    }
  }
}

// ====================================
// VALIDAÇÕES
// ====================================

function validarFormulario() {
  const errors = [];
  
  // Valida laboratório
  if (!laboratorioSelect.value) {
    errors.push('Selecione um laboratório');
  }
  
  // Valida data
  if (!dataInput.value) {
    errors.push('Selecione uma data');
  } else {
    const dataSelecionada = new Date(dataInput.value);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    if (dataSelecionada < hoje) {
      errors.push('A data não pode ser no passado');
    }
  }
  
  // Valida horários
  if (!horarioInicioInput.value) {
    errors.push('Informe o horário de início');
  }
  
  if (!horarioFimInput.value) {
    errors.push('Informe o horário de fim');
  }
  
  if (horarioInicioInput.value && horarioFimInput.value) {
    const [horaInicio, minutoInicio] = horarioInicioInput.value.split(':').map(Number);
    const [horaFim, minutoFim] = horarioFimInput.value.split(':').map(Number);
    
    const minutosInicio = horaInicio * 60 + minutoInicio;
    const minutosFim = horaFim * 60 + minutoFim;
    
    if (minutosFim <= minutosInicio) {
      errors.push('O horário de fim deve ser posterior ao horário de início');
    }
    
    if (minutosFim - minutosInicio < 60) {
      errors.push('A reserva deve ter no mínimo 1 hora de duração');
    }
  }
  
  // Valida kit
  if (!kitSelect.value || kitSelect.value === 'novo') {
    errors.push('Selecione um kit');
  }
  
  return errors;
}

// ====================================
// ENVIAR RESERVA
// ====================================

function handleSubmitReserva(e) {
  e.preventDefault();
  
  // Valida o formulário
  const errors = validarFormulario();
  
  if (errors.length > 0) {
    alert('Erro no formulário:\n\n' + errors.join('\n'));
    return;
  }
  
  // Coleta os dados
  const reservaData = {
    laboratorio_id: laboratorioSelect.value,
    data: dataInput.value,
    horario_inicio: horarioInicioInput.value,
    horario_fim: horarioFimInput.value,
    kit_id: kitSelect.value,
    observacoes: observacoesTextarea.value,
    professor_id: 1 // Simulado - viria da sessão
  };
  
  // Simula envio para API
  console.log('Enviando reserva:', reservaData);
  
  // Em produção, você faria:
  /*
  fetch('/api/reservas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reservaData)
  })
  .then(response => response.json())
  .then(data => {
    showToast('Reserva realizada com sucesso!');
    setTimeout(() => {
      window.location.href = 'calendario.html';
    }, 2000);
  })
  .catch(error => {
    alert('Erro ao realizar reserva: ' + error.message);
  });
  */
  
  // Simulação
  showToast('Reserva realizada com sucesso!');
  
  setTimeout(() => {
    window.location.href = 'calendario.html';
  }, 2000);
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
  
  // Re-cria os ícones
  lucide.createIcons();
}

// ====================================
// UTILITÁRIOS
// ====================================

// Formata data para exibição
function formatarData(dateString) {
  const [ano, mes, dia] = dateString.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Verifica disponibilidade (simulado)
function verificarDisponibilidade() {
  const laboratorio = laboratorioSelect.value;
  const data = dataInput.value;
  const horarioInicio = horarioInicioInput.value;
  const horarioFim = horarioFimInput.value;
  
  if (laboratorio && data && horarioInicio && horarioFim) {
    // Em produção, faria uma chamada à API:
    /*
    fetch(`/api/disponibilidade?lab=${laboratorio}&data=${data}&inicio=${horarioInicio}&fim=${horarioFim}`)
      .then(response => response.json())
      .then(data => {
        if (!data.disponivel) {
          alert('Este horário já está reservado!');
        }
      });
    */
    console.log('Verificando disponibilidade...', { laboratorio, data, horarioInicio, horarioFim });
  }
}

// Adiciona listener para verificar disponibilidade ao mudar campos
dataInput.addEventListener('change', verificarDisponibilidade);
horarioInicioInput.addEventListener('change', verificarDisponibilidade);
horarioFimInput.addEventListener('change', verificarDisponibilidade);