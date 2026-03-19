const USER_ID = 1; // потом будет авторизация

// Загрузить все данные при старте
async function loadDashboard() {
    const data = await fetchDashboard(USER_ID);
    if (!data) return;
    
    // Основная информация
    const rankDisplay = document.getElementById('rankDisplay');
    const streakDisplay = document.getElementById('streakDisplay');
    const totalDaysDisplay = document.getElementById('totalDaysDisplay');
    
    if (rankDisplay) rankDisplay.textContent = data.user.rank;
    if (streakDisplay) streakDisplay.textContent = data.user.streak + ' дней 🔥';
    if (totalDaysDisplay) totalDaysDisplay.textContent = data.user.total_days + ' дней';
    
    // Метрики
    if (data.bushido) renderBushidoMetrics(data.bushido);
    if (data.sword) renderSwordMetrics(data.sword);
    
    // Метрики качества (если есть на сегодня)
    if (data.quality) {
        const energySlider = document.getElementById('energySlider');
        const movementSlider = document.getElementById('movementSlider');
        const claritySlider = document.getElementById('claritySlider');
        const energyValue = document.getElementById('energyValue');
        const movementValue = document.getElementById('movementValue');
        const clarityValue = document.getElementById('clarityValue');
        
        if (energySlider) energySlider.value = data.quality.energy;
        if (movementSlider) movementSlider.value = data.quality.movement;
        if (claritySlider) claritySlider.value = data.quality.clarity;
        
        if (energyValue) energyValue.textContent = data.quality.energy;
        if (movementValue) movementValue.textContent = data.quality.movement;
        if (clarityValue) clarityValue.textContent = data.quality.clarity;
    }
    
    // Рекомендации
    if (data.recommendations) {
        renderRecommendations(data.recommendations);
    }
}

// Утренняя декларация (обработчик)
async function sendMorningDeclaration() {
    const messageInput = document.getElementById('messageInput');
    if (!messageInput) return;
    
    const text = messageInput.value.trim();
    if (!text) return;
    
    addMessage(text, 'user');
    messageInput.value = '';
    
    const response = await apiSendMorning(USER_ID, text);
    addMessage(response.reply, 'bot');
}

// Вечерний отчёт (обработчик)
async function submitEveningReport() {
    const reportText = document.getElementById('reportText');
    if (!reportText) return;
    
    const text = reportText.value.trim();
    const metrics = getCurrentMetrics();
    const finalReport = text || "Отчёт без комментариев";
    
    addMessage(`📊 Отчёт с метриками: ⚡${metrics.energy} 🏃${metrics.movement} 👁️${metrics.clarity}`, 'user');
    if (text) {
        addMessage(`📝 "${text}"`, 'user');
    }
    
    closeReportModal();
    
    const response = await apiSendEvening(USER_ID, finalReport, metrics);
    addMessage(response.reply, 'bot');
    
    // Обновить данные после отчёта
    setTimeout(loadDashboard, 1000);
}

// Приветствие
const GREETING = '🏯 <b>ЗВОН КОЛОКОЛА</b> 🏯<br><br>' +
    'Ты стоишь на пороге круглого зала. В центре — два сенсея.<br><br>' +
    '<b>Сенсей-Стратег:</b> "Новый ученик... Карты уже готовы показать твой путь."<br>' +
    '<b>Сенсей-Строгий:</b> (кладёт руку на меч) "Говори свою цель. Без воды."';

// Для доступа из UI
window.sendMorningDeclaration = sendMorningDeclaration;
window.submitEveningReport = submitEveningReport;

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    
    // Проверяем, что функции загружены
    if (typeof initUI === 'function') {
        initUI();
    } else {
        console.error('initUI not found');
    }
    
    loadDashboard();
    addMessage(GREETING, 'bot');
});
