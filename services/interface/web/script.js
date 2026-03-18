// Конфигурация
const API_URL = "http://localhost:8000";
let currentUserId = 1;

// Дождаться загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Элементы
    const energySlider = document.getElementById('energySlider');
    const movementSlider = document.getElementById('movementSlider');
    const claritySlider = document.getElementById('claritySlider');
    const energyValue = document.getElementById('energyValue');
    const movementValue = document.getElementById('movementValue');
    const clarityValue = document.getElementById('clarityValue');

    const messageInput = document.getElementById('messageInput');
    const sendMorningBtn = document.getElementById('sendMorningBtn');
    const openReportBtn = document.getElementById('openReportBtn');
    const messages = document.getElementById('messages');

    // Модалка
    const modal = document.getElementById('reportModal');
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.querySelector('.close');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const submitReportBtn = document.getElementById('submitReportBtn');
    const reportText = document.getElementById('reportText');

    // Метрики в модалке
    const modalEnergy = document.getElementById('modalEnergy');
    const modalMovement = document.getElementById('modalMovement');
    const modalClarity = document.getElementById('modalClarity');

    // Обновление значений слайдеров
    function updateMetricValues() {
        energyValue.textContent = energySlider.value;
        movementValue.textContent = movementSlider.value;
        clarityValue.textContent = claritySlider.value;
    }

    // События слайдеров
    energySlider.addEventListener('input', updateMetricValues);
    movementSlider.addEventListener('input', updateMetricValues);
    claritySlider.addEventListener('input', updateMetricValues);

    // Получить текущие метрики
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

    // Утренняя декларация
    async function sendMorningDeclaration() {
        const text = messageInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        messageInput.value = '';

        try {
            const response = await fetch(`${API_URL}/api/v1/morning`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUserId,
                    declaration: text
                })
            });

            const data = await response.json();
            addMessage(data.reply, 'bot');

            if (data.rank) document.getElementById('rankDisplay').textContent = data.rank;
            if (data.streak) document.getElementById('streakDisplay').textContent = data.streak + ' дней 🔥';

        } catch (error) {
            addMessage('⚠️ Ошибка связи с сервером', 'bot');
        }
    }

    // Открыть модалку
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

    // Закрыть модалку
    function closeReportModal() {
        overlay.style.display = 'none';
        modal.style.display = 'none';
    }

    // Отправить вечерний отчёт
    async function submitEveningReport() {
        const text = reportText.value.trim();
        const metrics = getCurrentMetrics();
        const finalReport = text || "Отчёт без комментариев";

        addMessage(`📊 Отчёт с метриками: ⚡${metrics.energy} 🏃${metrics.movement} 👁️${metrics.clarity}`, 'user');
        if (text) {
            addMessage(`📝 "${text}"`, 'user');
        }

        closeReportModal();

        try {
            const response = await fetch(`${API_URL}/api/v1/evening`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUserId,
                    report: finalReport,
                    metrics: metrics
                })
            });

            const data = await response.json();
            addMessage(data.reply, 'bot');

            if (data.rank) document.getElementById('rankDisplay').textContent = data.rank;
            if (data.streak) document.getElementById('streakDisplay').textContent = data.streak + ' дней 🔥';

        } catch (error) {
            addMessage('⚠️ Ошибка связи с сервером', 'bot');
        }
    }

    // Обработчики событий
    sendMorningBtn.addEventListener('click', sendMorningDeclaration);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMorningDeclaration();
    });

    openReportBtn.addEventListener('click', openReportModal);
    closeBtn.addEventListener('click', closeReportModal);
    closeModalBtn.addEventListener('click', closeReportModal);
    overlay.addEventListener('click', closeReportModal);
    submitReportBtn.addEventListener('click', submitEveningReport);

    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeReportModal();
        }
    });

    // Приветствие
    addMessage(
	    '🏯 *ЗВОН КОЛОКОЛА* 🏯<br><br>' +
	    'Ты стоишь на пороге круглого зала. В центре — два сенсея.<br><br>' +
	    '<b>Сенсей-Стратег:</b> "Новый ученик... Карты уже готовы показать твой путь."<br>' +
	    '<b>Сенсей-Строгий:</b> (кладёт руку на меч) "Говори свою цель. Без воды."',
	    'bot'
	);

});