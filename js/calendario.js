// ====================================
// DADOS SIMULADOS
// ====================================

const reservasExistentes = [
  {
    id: 1,
    data: '2025-11-15',
    horario: '10:00 - 12:00',
    professor: 'Prof. João Silva',
    laboratorio: 'Laboratório 3',
    kit: 'Kit Ácidos e Bases'
  },
  {
    id: 2,
    data: '2025-11-20',
    horario: '14:00 - 16:00',
    professor: 'Prof. Maria Santos',
    laboratorio: 'Laboratório 1',
    kit: 'Kit Vidrarias'
  }
];

const kitsDisponiveis = [
  { id: 1, nome: 'Kit Ácidos e Bases' },
  { id: 2, nome: 'Kit Vidrarias Básicas' },
  { id: 3, nome: 'Kit Titulação' },
  { id: 4, nome: 'Kit Microscopia' }
];

// ====================================
// VARIÁVEIS GLOBAIS
// ====================================

let currentDate = new Date();
let selectedDate = null;

const monthYearElement = document.getElementById('monthYear');
const datesGridElement = document.getElementById('datesGrid');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dayPanel = document.getElementById('dayPanel');
const panelTitle = document.getElementById('panelTitle');
const btnClosePanel = document.getElementById('btnClosePanel');
const existingReservations = document.getElementById('existingReservations');
const btnNovaReserva = document.getElementById('btnNovaReserva');
const reservationFormContainer = document.getElementById('reservationFormContainer');
const formReserva = document.getElementById('formReserva');
const btnCancelarReserva = document.getElementById('btnCancelarReserva');
const kitSelect = document.getElementById('kit');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// ====================================
// INICIALIZAÇÃO
// ====================================

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  updateCalendar();
  loadKits();
  
  prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
  });
  
  nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
  });
  
  btnClosePanel.addEventListener('click', closePanel);
  btnNovaReserva.addEventListener('click', showReservationForm);
  btnCancelarReserva.addEventListener('click', hideReservationForm);
  formReserva.addEventListener('submit', handleSubmitReserva);
});

// ====================================
// CALENDÁRIO
// ====================================

function updateCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  monthYearElement.textContent = `${monthNames[month]} ${year}`;
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const firstDayIndex = firstDay.getDay();
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  
  let datesHTML = '';
  
  // Dias do mês anterior
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    datesHTML += `<div class="date-cell inactive">${day}</div>`;
  }
  
  // Dias do mês atual
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = formatDate(date);
    
    let classes = 'date-cell';
    
    if (date.toDateString() === today.toDateString()) {
      classes += ' today';
    }
    
    if (hasReservation(dateString)) {
      classes += ' reserved';
    }
    
    if (selectedDate === dateString) {
      classes += ' selected';
    }
    
    datesHTML += `<div class="${classes}" onclick="selectDate('${dateString}')">${day}</div>`;
  }
  
  // Dias do próximo mês
  const remainingCells = 42 - (firstDayIndex + daysInMonth);
  for (let day = 1; day <= remainingCells; day++) {
    datesHTML += `<div class="date-cell inactive">${day}</div>`;
  }
  
  datesGridElement.innerHTML = datesHTML;
  lucide.createIcons();
}

function selectDate(dateString) {
  selectedDate = dateString;
  updateCalendar();
  showDayPanel(dateString);
}

function hasReservation(dateString) {
  return reservasExistentes.some(r => r.data === dateString);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateBR(dateString) {
  const [year, month, day] = dateString.split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR', { 
    weekday: 'long',
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
}

// ====================================
// PAINEL DO DIA
// ====================================

function showDayPanel(dateString) {
  const reservas = reservasExistentes.filter(r => r.data === dateString);
  
  panelTitle.textContent = formatDateBR(dateString);
  
  if (reservas.length === 0) {
    existingReservations.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--color-gray-500); background: var(--color-gray-50); border-radius: 8px;">
        <i data-lucide="calendar-x" style="width: 48px; height: 48px; margin-bottom: 1rem;"></i>
        <p>Nenhuma reserva para esta data.</p>
      </div>
    `;
  } else {
    existingReservations.innerHTML = reservas.map(reserva => `
      <div class="reservation-item">
        <div class="reservation-header">
          <div>
            <div class="reservation-title">${reserva.professor}</div>
            <div class="reservation-lab">
              <i data-lucide="flask-conical"></i>
              ${reserva.laboratorio}
            </div>
          </div>
          <div class="reservation-time">
            <i data-lucide="clock"></i>
            ${reserva.horario}
          </div>
        </div>
        <div class="reservation-kit">
          <i data-lucide="package"></i>
          ${reserva.kit}
        </div>
      </div>
    `).join('');
  }
  
  // Preenche a data no formulário
  document.getElementById('horarioInicio').value = '';
  document.getElementById('horarioFim').value = '';
  document.getElementById('laboratorio').value = '';
  document.getElementById('observacoes').value = '';
  
  hideReservationForm();
  dayPanel.style.display = 'block';
  lucide.createIcons();
  
  // Scroll suave até o painel
  setTimeout(() => {
    dayPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

function closePanel() {
  dayPanel.style.display = 'none';
  selectedDate = null;
  updateCalendar();
}

// ====================================
// FORMULÁRIO DE RESERVA
// ====================================

function showReservationForm() {
  reservationFormContainer.style.display = 'block';
  btnNovaReserva.style.display = 'none';
  
  setTimeout(() => {
    reservationFormContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

function hideReservationForm() {
  reservationFormContainer.style.display = 'none';
  btnNovaReserva.style.display = 'block';
  formReserva.reset();
}

function loadKits() {
  kitSelect.innerHTML = '<option value="">Escolha um kit</option>';
  kitsDisponiveis.forEach(kit => {
    const option = document.createElement('option');
    option.value = kit.id;
    option.textContent = kit.nome;
    kitSelect.appendChild(option);
  });
}

function handleSubmitReserva(e) {
  e.preventDefault();
  
  const reservaData = {
    laboratorio_id: document.getElementById('laboratorio').value,
    data: selectedDate,
    horario_inicio: document.getElementById('horarioInicio').value,
    horario_fim: document.getElementById('horarioFim').value,
    kit_id: document.getElementById('kit').value,
    observacoes: document.getElementById('observacoes').value,
    professor_id: 1
  };
  
  // Validações
  const horarioInicio = reservaData.horario_inicio.split(':');
  const horarioFim = reservaData.horario_fim.split(':');
  const minutosInicio = parseInt(horarioInicio[0]) * 60 + parseInt(horarioInicio[1]);
  const minutosFim = parseInt(horarioFim[0]) * 60 + parseInt(horarioFim[1]);
  
  if (minutosFim <= minutosInicio) {
    alert('O horário de fim deve ser posterior ao horário de início');
    return;
  }
  
  if (minutosFim - minutosInicio < 60) {
    alert('A reserva deve ter no mínimo 1 hora de duração');
    return;
  }
  
  console.log('Enviando reserva:', reservaData);
  
  // Simula sucesso
  const kitNome = kitsDisponiveis.find(k => k.id == reservaData.kit_id)?.nome || 'Kit';
  reservasExistentes.push({
    id: Date.now(),
    data: reservaData.data,
    horario: `${reservaData.horario_inicio} - ${reservaData.horario_fim}`,
    professor: 'Você',
    laboratorio: `Laboratório ${reservaData.laboratorio_id}`,
    kit: kitNome
  });
  
  showToast('Reserva realizada com sucesso!');
  updateCalendar();
  showDayPanel(selectedDate);
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