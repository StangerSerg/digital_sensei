import numpy as np
from typing import List, Tuple, Optional, Dict
from dataclasses import dataclass
import warnings

@dataclass
class RegressionResult:
    """Результат регрессии с метриками качества"""
    slope: float           # коэффициент наклона
    intercept: float       # свободный член
    r2_score: float        # качество аппроксимации (0-1)
    mse: float             # средняя квадратичная ошибка
    forecast: float        # прогноз на следующий день
    confidence: str        # "high"/"medium"/"low"

class RobustRegressor:
    """
    Регрессор для метрик Digital Sensei.
    Умеет: линейную, логарифмическую, с регуляризацией.
    """
    
    def __init__(self, method: str = 'linear', alpha: float = 0.1):
        """
        method: 'linear' или 'log'
        alpha: сила регуляризации (Ridge)
        """
        self.method = method
        self.alpha = alpha
        self.coef_ = None
        self.intercept_ = None
    
    def fit(self, x: List[float], y: List[float]) -> 'RobustRegressor':
        """Обучение с регуляризацией (Ridge regression)"""
        X = np.array(x).reshape(-1, 1)
        Y = np.array(y)
        
        # Добавляем регуляризацию (численно стабильно)
        n = len(x)
        X_with_bias = np.c_[X, np.ones(n)]
        
        # Ridge regression: (X^T X + αI)^(-1) X^T y
        I = np.eye(X_with_bias.shape[1])
        I[-1, -1] = 0  # не регуляризуем intercept
        
        try:
            A = X_with_bias.T @ X_with_bias + self.alpha * I
            b = X_with_bias.T @ Y
            theta = np.linalg.solve(A, b)  # solve лучше чем inv
            
            self.coef_ = theta[0]
            self.intercept_ = theta[1]
            return self
            
        except np.linalg.LinAlgError:
            warnings.warn("Матрица вырождена, использую псевдообратную")
            theta = np.linalg.pinv(X_with_bias) @ Y
            self.coef_ = theta[0]
            self.intercept_ = theta[1]
            return self
    
    def predict(self, x: List[float]) -> np.ndarray:
        """Предсказание"""
        if self.coef_ is None:
            raise ValueError("Сначала обучи модель")
        
        X = np.array(x)
        if self.method == 'linear':
            return self.coef_ * X + self.intercept_
        elif self.method == 'log':
            # Для логарифмической: a * log(x+1) + b
            return self.coef_ * np.log(X + 1) + self.intercept_
    
    def score(self, x: List[float], y: List[float]) -> float:
        """R² коэффициент детерминации"""
        y_pred = self.predict(x)
        y_true = np.array(y)
        
        ss_res = np.sum((y_true - y_pred) ** 2)
        ss_tot = np.sum((y_true - np.mean(y_true)) ** 2)
        
        if ss_tot == 0:
            return 1.0
        return 1 - (ss_res / ss_tot)
    
    def analyze_trend(self, x: List[float], y: List[float]) -> RegressionResult:
        """Полный анализ тренда"""
        self.fit(x, y)
        y_pred = self.predict(x)
        
        # Метрики качества
        mse = np.mean((np.array(y) - y_pred) ** 2)
        r2 = self.score(x, y)
        
        # Прогноз на следующий день
        next_x = len(x)  # следующий день (индексация с 0)
        forecast = float(self.predict([next_x])[0])
        
        # Уверенность на основе R² и количества точек
        if len(x) < 5:
            confidence = "low"
        elif r2 > 0.8:
            confidence = "high"
        elif r2 > 0.5:
            confidence = "medium"
        else:
            confidence = "low"
        
        return RegressionResult(
            slope=float(self.coef_),
            intercept=float(self.intercept_),
            r2_score=float(r2),
            mse=float(mse),
            forecast=forecast,
            confidence=confidence
        )


def logarithmic_regressor(x: List[float], y: List[float]) -> Optional[RegressionResult]:
    """Логарифмическая регрессия для метрик с насыщением"""
    reg = RobustRegressor(method='log', alpha=0.01)
    return reg.analyze_trend(x, y)
