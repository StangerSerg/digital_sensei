// Элементы DOM
const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendMorningBtn = document.getElementById('sendMorningBtn');
const openReportBtn = document.getElementById('openReportBtn');

// Слайдеры
const energySlider = document.getElementById('energySlider');
const movementSlider = document.getElementById('movementSlider');
const claritySlider = document.getElementById('claritySlider');
const energyValue = document.getElementById('energyValue');
const movementValue = document.getElementById('movementValue');
const clarityValue = document.getElementById('clarityValue');

// Модалка
const modal = document.getElementById('reportModal');
const overlay = document.getElementById('modalOverlay');
const closeBtn = document.querySelector('.close');
const closeModalBtn = document.getElementById('closeModalBtn');
const submitReportBtn = document.getElementById('submitReportBtn');
const reportText = document.getElementById('reportText');
const modalEnergy = document.getElementById('modalEnergy');
const modalMovement = document.getElementById('modalMovement');
const modalClarity = document.getElementById('modalClarity');

// Инициализация слайдеров
function initSliders() {
    const updateEnergy = () => { energyValue.textContent = energySlider.value; };
    const updateMovement = () => { movementValue.textContent = movementSlider.value; };
    const updateClarity = () => { clarityValue.textContent = claritySlider.value; };
    
    energySlider.addEventListener('input', updateEnergy);
    movementSlider.addEventListener('input', updateMovement);
    claritySlider.addEventListener('input', updateClarity);
    
    // Вызвать один раз для отображения начальных значений
    updateEnergy();
    updateMovement();
    updateClarity();
}

// Получить текущие значения метрик
function getCurrentMetrics() {
    return {
        energy: parseInt(energySlider.value),
        movement: parseInt(movementSlider.value),
        clarity: parseInt(claritySlider.value)
    };
}

// Добавить сообщение в чат
function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerHTML = `<div class="bubble">${text}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

// Обновить информацию о пользователе в сайдбаре
function updateUserInfo(rank, streak) {
    if (rank) document.getElementById('rankDisplay').textContent = rank;
    if (streak) document.getElementById('streakDisplay').textContent = streak + ' дней 🔥';
}

// Модалка: открыть
function openReportModal() {
    const metrics = getCurrentMetrics();
    modalEnergy.textContent = metrics.energy;
    modalMovement.textContent = metrics.movement;
    modalClarity.textContent = metrics.clarity;
    
    reportText.value = '';
    
    overlay.style.display = 'block';
    modal.style.display = 'block';
    
    setTimeout(() => reportText.focus(), 100);
}

// Модалка: закрыть
function closeReportModal() {
    overlay.style.display = 'none';
    modal.style.display = 'none';
}

// Инициализация обработчиков UI
function initUI() {
    initSliders();
    
    // Открытие модалки
    openReportBtn.addEventListener('click', openReportModal);
    
    // Закрытие модалки
    closeBtn.addEventListener('click', closeReportModal);
    closeModalBtn.addEventListener('click', closeReportModal);
    overlay.addEventListener('click', closeReportModal);
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeReportModal();
        }
    });
    
    // Enter в поле ввода для утра
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMorningDeclaration();
    });
}