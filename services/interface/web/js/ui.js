// Функции работы со слайдерами
function initSliders() {
    const energySlider = document.getElementById('energySlider');
    const movementSlider = document.getElementById('movementSlider');
    const claritySlider = document.getElementById('claritySlider');
    const energyValue = document.getElementById('energyValue');
    const movementValue = document.getElementById('movementValue');
    const clarityValue = document.getElementById('clarityValue');
    
    if (energySlider && energyValue) {
        const updateEnergy = () => { energyValue.textContent = energySlider.value; };
        energySlider.addEventListener('input', updateEnergy);
        updateEnergy();
    }
    
    if (movementSlider && movementValue) {
        const updateMovement = () => { movementValue.textContent = movementSlider.value; };
        movementSlider.addEventListener('input', updateMovement);
        updateMovement();
    }
    
    if (claritySlider && clarityValue) {
        const updateClarity = () => { clarityValue.textContent = claritySlider.value; };
        claritySlider.addEventListener('input', updateClarity);
        updateClarity();
    }
}

// Получить текущие значения метрик
function getCurrentMetrics() {
    const energySlider = document.getElementById('energySlider');
    const movementSlider = document.getElementById('movementSlider');
    const claritySlider = document.getElementById('claritySlider');
    
    return {
        energy: parseInt(energySlider?.value || 7),
        movement: parseInt(movementSlider?.value || 6),
        clarity: parseInt(claritySlider?.value || 8)
    };
}

// Добавить сообщение в чат
function addMessage(text, sender) {
    const messages = document.getElementById('messages');
    if (!messages) return;
    
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerHTML = `<div class="bubble">${text}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

// Обновить информацию о пользователе в сайдбаре
function updateUserInfo(rank, streak) {
    const rankDisplay = document.getElementById('rankDisplay');
    const streakDisplay = document.getElementById('streakDisplay');
    
    if (rank && rankDisplay) rankDisplay.textContent = rank;
    if (streak && streakDisplay) streakDisplay.textContent = streak + ' дней 🔥';
}

// Модалка: открыть
function openReportModal() {
    const modal = document.getElementById('reportModal');
    const overlay = document.getElementById('modalOverlay');
    const modalEnergy = document.getElementById('modalEnergy');
    const modalMovement = document.getElementById('modalMovement');
    const modalClarity = document.getElementById('modalClarity');
    const reportText = document.getElementById('reportText');
    
    if (!modal || !overlay) return;
    
    const metrics = getCurrentMetrics();
    if (modalEnergy) modalEnergy.textContent = metrics.energy;
    if (modalMovement) modalMovement.textContent = metrics.movement;
    if (modalClarity) modalClarity.textContent = metrics.clarity;
    
    if (reportText) reportText.value = '';
    
    overlay.style.display = 'block';
    modal.style.display = 'block';
    
    setTimeout(() => reportText?.focus(), 100);
}

// Модалка: закрыть
function closeReportModal() {
    const modal = document.getElementById('reportModal');
    const overlay = document.getElementById('modalOverlay');
    
    if (overlay) overlay.style.display = 'none';
    if (modal) modal.style.display = 'none';
}

// Инициализация обработчиков UI
function initUI() {
    console.log('initUI started');
    
    initSliders();
    
    // Открытие модалки
    const openReportBtn = document.getElementById('openReportBtn');
    if (openReportBtn) {
        openReportBtn.addEventListener('click', openReportModal);
    }
    
    // Закрытие модалки
    const closeBtn = document.querySelector('.close');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const overlay = document.getElementById('modalOverlay');
    
    if (closeBtn) closeBtn.addEventListener('click', closeReportModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeReportModal);
    if (overlay) overlay.addEventListener('click', closeReportModal);

    // Кнопка отправки отчета в модалке
    const submitReportBtn = document.getElementById('submitReportBtn');
    console.log('submitReportBtn found:', submitReportBtn !== null);
    if (submitReportBtn) {
        submitReportBtn.addEventListener('click', () => {
            console.log('submitReportBtn clicked');
            if (typeof window.submitEveningReport === 'function') {
                window.submitEveningReport();
            } else {
                console.error('window.submitEveningReport is not a function');
            }
        });
    }

    // Enter в поле ввода для утра
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && typeof window.sendMorningDeclaration === 'function') {
                window.sendMorningDeclaration();
            }
        });
    }

    const sendMorningBtn = document.getElementById('sendMorningBtn');
    console.log('sendMorningBtn found:', sendMorningBtn !== null);
    if (sendMorningBtn) {
        sendMorningBtn.addEventListener('click', () => {
            console.log('sendMorningBtn clicked');
            if (typeof window.sendMorningDeclaration === 'function') {
                window.sendMorningDeclaration();
            } else {
                console.error('window.sendMorningDeclaration is not a function');
            }
        });
    }

    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('reportModal');
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeReportModal();
        }
    });
    
    console.log('initUI finished');
}

// Отрисовка метрик Бусидо
function renderBushidoMetrics(bushido) {
    const container = document.getElementById('bushidoMetrics');
    if (!container || !bushido) return;
    
    container.innerHTML = bushido.map(m => {
        const trendClass = m.trend > 0 ? 'trend-up' : m.trend < 0 ? 'trend-down' : 'trend-neutral';
        const trendSymbol = m.trend > 0 ? '↑' : m.trend < 0 ? '↓' : '→';
        
        return `
            <div class="metric-row">
                <span class="metric-name-small">${m.name}</span>
                <span>
                    <span class="metric-value-small">${m.value}</span>
                    <span class="${trendClass}"> ${trendSymbol} ${Math.abs(m.trend).toFixed(1)}</span>
                </span>
            </div>
        `;
    }).join('');
}

// Отрисовка метрик Меча
function renderSwordMetrics(sword) {
    const container = document.getElementById('swordMetrics');
    if (!container || !sword) return;
    
    container.innerHTML = sword.map(m => {
        const trendClass = m.trend > 0 ? 'trend-up' : m.trend < 0 ? 'trend-down' : 'trend-neutral';
        const trendSymbol = m.trend > 0 ? '↑' : m.trend < 0 ? '↓' : '→';
        const fire = m.trend > 5 ? ' 🔥' : '';
        
        return `
            <div class="metric-row">
                <span class="metric-name-small">${m.name}</span>
                <span>
                    <span class="metric-value-small">${m.value}</span>
                    <span class="${trendClass}"> ${trendSymbol} ${Math.abs(m.trend)}${fire}</span>
                </span>
            </div>
        `;
    }).join('');
}

// Отрисовка рекомендаций
function renderRecommendations(recs) {
    const container = document.getElementById('recommendations');
    if (!container || !recs || recs.length === 0) {
        container.innerHTML = ''; // очищаем, если нет рекомендаций
        return;
    }
    
    container.innerHTML = '<h4>📋 СОВЕТЫ СЕНСЕЕВ</h4>' + 
        recs.map(r => `<p>• ${r}</p>`).join('');
}
