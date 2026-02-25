FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1


# RUN apt-get update && apt-get install -y \
#     gcc \
#     python3-dev \
#     libpq-dev \
#     && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
