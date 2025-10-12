FROM python:3.10

WORKDIR /app

COPY backend/requirements.txt /app/requirements.txt
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r /app/requirements.txt
RUN pip install uvicorn

COPY backend/ /app

ARG PORT
ENV PORT=$PORT

CMD ["sh", "-c", "echo Using PORT=$PORT && uvicorn app:app --host 0.0.0.0 --port $PORT"]