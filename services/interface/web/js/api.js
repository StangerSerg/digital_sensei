const API_BASE = 'http://localhost:8000/api/v1/web';

// Данные пользователя одним запросом
async function fetchDashboard(userId) {
    try {
        const response = await fetch(`${API_BASE}/user/${userId}/dashboard`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        return null;
    }
}

// Отправить утреннюю декларацию (API)
async function apiSendMorning(userId, declaration) {
    try {
        const response = await fetch(`${API_BASE}/morning`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, declaration })
        });
        return await response.json();
    } catch (error) {
        console.error('Ошибка отправки декларации:', error);
        return { reply: '⚠️ Ошибка связи с сервером' };
    }
}

// Отправить вечерний отчёт (API)
async function apiSendEvening(userId, report, metrics) {
    try {
        const response = await fetch(`${API_BASE}/evening`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, report, metrics })
        });
        return await response.json();
    } catch (error) {
        console.error('Ошибка отправки отчёта:', error);
        return { reply: '⚠️ Ошибка связи с сервером' };
    }
}
