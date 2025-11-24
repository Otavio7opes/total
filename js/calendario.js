// ====================================
// CALENDARIO.JS ATUALIZADO
// ====================================

// IMPORTANTE: Certifique-se de incluir storage.js antes deste arquivo no HTML

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
  // Verifica se o usuário está logado
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.tipo !== 'Professor') {
    window.location.href = 'login.html';
    return;
  }
  
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
  const reservas = getReservationsByDate(dateString);
  return reservas.length > 0;
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
  const reservas = getReservationsByDate(dateString);
  
  panelTitle.textContent = formatDateBR(dateString);
  
  if (reservas.length === 0) {
    existingReservations.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--color-gray-500); background: var(--color-gray-50); border-radius: 8px;">
        <i data-lucide="calendar-x" style="width: 48px; height: 48px; margin-bottom: 1rem;"></i>
        <p>Nenhuma reserva para esta data.</p>
      </div>
    `;
  } else {
    existingReservations.innerHTML = reservas.map(reserva => {
      const kit = getKits().find(k => k.id == reserva.kitId);
      const kitNome = kit ? kit.nome : 'Kit não encontrado';
      
      return `
        <div class="reservation-item">
          <div class="reservation-header">
            <div>
              <div class="reservation-title">${reserva.professorNome}</div>
              <div class="reservation-lab">
                <i data-lucide="flask-conical"></i>
                Laboratório ${reserva.laboratorioId}
              </div>
            </div>
            <div class="reservation-time">
              <i data-lucide="clock"></i>
              ${reserva.horarioInicio} - ${reserva.horarioFim}
            </div>
          </div>
          <div class="reservation-kit">
            <i data-lucide="package"></i>
            ${kitNome}
          </div>
          ${reserva.observacoes ? `<div style="margin-top: 0.5rem; color: var(--color-gray-600); font-size: 0.875rem;">${reserva.observacoes}</div>` : ''}
        </div>
      `;
    }).join('');
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
  const currentUser = getCurrentUser();
  const kits = getKitsByProfessor(currentUser.id);
  
  kitSelect.innerHTML = '<option value="">Escolha um kit</option>';
  kits.forEach(kit => {
    const option = document.createElement('option');
    option.value = kit.id;
    option.textContent = kit.nome;
    kitSelect.appendChild(option);
  });
}

function handleSubmitReserva(e) {
  e.preventDefault();
  
  const laboratorioId = document.getElementById('laboratorio').value;
  const horarioInicio = document.getElementById('horarioInicio').value;
  const horarioFim = document.getElementById('horarioFim').value;
  const kitId = document.getElementById('kit').value;
  const observacoes = document.getElementById('observacoes').value;
  
  // Validações
  const minutosInicio = convertTimeToMinutes(horarioInicio);
  const minutosFim = convertTimeToMinutes(horarioFim);
  
  if (minutosFim <= minutosInicio) {
    alert('O horário de fim deve ser posterior ao horário de início');
    return;
  }
  
  if (minutosFim - minutosInicio < 60) {
    alert('A reserva deve ter no mínimo 1 hora de duração');
    return;
  }
  
  // Busca os materiais do kit
  const kit = getKits().find(k => k.id == kitId);
  const materiais = kit ? kit.itens.map(item => ({
    nome: item.nome,
    quantidade: item.quantidade,
    checked: false
  })) : [];
  
  // Cria a reserva
  const reservaData = {
    laboratorioId,
    data: selectedDate,
    horarioInicio,
    horarioFim,
    kitId,
    observacoes,
    materiais
  };
  
  addReservation(reservaData);
  
  showToast('Reserva realizada com sucesso!');
  updateCalendar();
  showDayPanel(selectedDate);
}

function convertTimeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
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