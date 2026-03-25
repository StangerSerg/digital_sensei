FROM python:3.13-slim
WORKDIR /orchestrator
ENV PYTHONUNBUFFERED=1
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --timeout 100
COPY . .