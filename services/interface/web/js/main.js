document.addEventListener('DOMContentLoaded', () => {
    // Константы
    const USER_ID = 1; // временно, потом будет авторизация

    // Элементы
    const messageInput = document.getElementById('messageInput');
    const sendMorningBtn = document.getElementById('sendMorningBtn');
    const openReportBtn = document.getElementById('openReportBtn');

    // Инициализация модулей
    Metrics.init();

    // Приветствие
    UI.addMessage(
        '🏯 <b>ЗВОН КОЛОКОЛА</b> 🏯<br><br>' +
        'Ты стоишь на пороге круглого зала. В центре — два сенсея.<br><br>' +
        '<b>Сенсей-Стратег:</b> "Новый ученик... Карты уже готовы показать твой путь."<br>' +
        '<b>Сенсей-Строгий:</b> (кладёт руку на меч) "Говори свою цель. Без воды."',
        'bot'
    );

    // Утренняя декларация
    sendMorningBtn.addEventListener('click', async () => {
        const text = messageInput.value.trim();
        if (!text) return;

        UI.addMessage(text, 'user');
        messageInput.value = '';

        try {
            const data = await API.sendMorning(USER_ID, text);
            UI.addMessage(data.reply, 'bot');
            UI.updateUserInfo(data.rank, data.streak);
        } catch (error) {
            UI.showError('Ошибка связи с сервером');
        }
    });

    // Открыть модалку вечернего отчёта
    openReportBtn.addEventListener('click', () => {
        // тут логика открытия модалки
        Modal.open(Metrics.getCurrent());
    });

    // Enter отправляет сообщение
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMorningBtn.click();
    });
});