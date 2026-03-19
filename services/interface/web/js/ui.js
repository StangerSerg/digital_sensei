const UI = (() => {
    const messagesContainer = document.getElementById('messages');

    // Добавить сообщение в чат
    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        div.innerHTML = `<div class="bubble">${text}</div>`;
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Обновить ранг и серию
    function updateUserInfo(rank, streak) {
        if (rank) document.getElementById('rankDisplay').textContent = rank;
        if (streak) document.getElementById('streakDisplay').textContent = streak + ' дней 🔥';
    }

    // Показать ошибку
    function showError(message) {
        addMessage(`⚠️ ${message}`, 'bot');
    }

    return {
        addMessage,
        updateUserInfo,
        showError
    };
})();