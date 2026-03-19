const API_BASE = 'http://localhost:8000/api/v1/web';  // внешний префикс

// Получить данные пользователя при загрузке
async function fetchUserData(userId) {
    try {
        const response = await fetch(`${API_BASE}/user/${userId}/stats`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
        return null;
    }
}

// Отправить утреннюю декларацию
async function sendMorningDeclaration(userId, declaration) {
    try {
        const response = await fetch(`${API_BASE}/morning`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, declaration })
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Ошибка отправки декларации:', error);
        return { reply: '⚠️ Ошибка связи с сервером' };
    }
}

// Отправить вечерний отчёт
async function sendEveningReport(userId, report, metrics) {
    try {
        const response = await fetch(`${API_BASE}/evening`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                report,
                metrics
            })
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Ошибка отправки отчёта:', error);
        return { reply: '⚠️ Ошибка связи с сервером' };
    }
}