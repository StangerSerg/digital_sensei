const API = (() => {
    const BASE_URL = "http://localhost:8000/api/v1/web";

    // Утренняя декларация
    async function sendMorning(userId, declaration) {
        const response = await fetch(`${BASE_URL}/morning`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                declaration: declaration
            })
        });
        return await response.json();
    }

    // Вечерний отчёт
    async function sendEvening(userId, report, metrics) {
        const response = await fetch(`${BASE_URL}/evening`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                report: report,
                metrics: metrics
            })
        });
        return await response.json();
    }

    // Получить статистику пользователя
    async function getUserStats(userId) {
        const response = await fetch(`${BASE_URL}/user/${userId}/stats`);
        return await response.json();
    }

    // Публичный API
    return {
        sendMorning,
        sendEvening,
        getUserStats
    };
})();