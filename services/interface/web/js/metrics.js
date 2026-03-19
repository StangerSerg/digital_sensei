const Metrics = (() => {
    const energySlider = document.getElementById('energySlider');
    const movementSlider = document.getElementById('movementSlider');
    const claritySlider = document.getElementById('claritySlider');
    const energyValue = document.getElementById('energyValue');
    const movementValue = document.getElementById('movementValue');
    const clarityValue = document.getElementById('clarityValue');

    // Инициализация слайдеров
    function init() {
        energySlider.addEventListener('input', updateDisplay);
        movementSlider.addEventListener('input', updateDisplay);
        claritySlider.addEventListener('input', updateDisplay);
    }

    // Обновить отображаемые значения
    function updateDisplay() {
        energyValue.textContent = energySlider.value;
        movementValue.textContent = movementSlider.value;
        clarityValue.textContent = claritySlider.value;
    }

    // Получить текущие метрики
    function getCurrent() {
        return {
            energy: parseInt(energySlider.value),
            movement: parseInt(movementSlider.value),
            clarity: parseInt(claritySlider.value)
        };
    }

    return {
        init,
        getCurrent
    };
})();