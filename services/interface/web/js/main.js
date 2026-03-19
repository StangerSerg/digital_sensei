// ID пользователя (пока заглушка, потом будет авторизация)
const USER_ID = 1;

// Приветственное сообщение (с атмосферой)
const GREETING = '🏯 <b>ЗВОН КОЛОКОЛА</b> 🏯<br><br>' +
    'Ты стоишь на пороге круглого зала. В центре — два сенсея.<br><br>' +
    '<b>Сенсей-Стратег:</b> "Новый ученик... Карты уже готовы показать твой путь."<br>' +
    '<b>Сенсей-Строгий:</b> (кладёт руку на меч) "Говори свою цель. Без воды."';

// Загрузить данные при старте
async function loadInitialData() {
    const userData = await fetchUserData(USER_ID);
    if (userData) {
        updateUserInfo(userData.rank, userData.streak);
    }
    addMessage(GREETING, 'bot');
}

// Утренняя декларация
async function sendMorningDeclaration() {
    const text = messageInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    messageInput.value = '';

    const response = await sendMorningDeclaration(USER_ID, text);
    addMessage(response.reply, 'bot');

    if (response.rank || response.streak) {
        updateUserInfo(response.rank, response.streak);
    }
}

// Вечерний отчёт
async function submitEveningReport() {
    const text = reportText.value.trim();
    const metrics = getCurrentMetrics();
    const finalReport = text || "Отчёт без комментариев";

    addMessage(`📊 Отчёт с метриками: ⚡${metrics.energy} 🏃${metrics.movement} 👁️${metrics.clarity}`, 'user');
    if (text) {
        addMessage(`📝 "${text}"`, 'user');
    }

    closeReportModal();

    const response = await sendEveningReport(USER_ID, finalReport, metrics);
    addMessage(response.reply, 'bot');

    if (response.rank || response.streak) {
        updateUserInfo(response.rank, response.streak);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем UI
    initUI();

    // Загружаем данные
    loadInitialData();

    // Вешаем обработчики на кнопки
    sendMorningBtn.addEventListener('click', sendMorningDeclaration);
    submitReportBtn.addEventListener('click', submitEveningReport);
});