# Docker Development Guide

## Prerequisites
- Docker Desktop installed
- Docker Compose installed

## Quick Start

### 1. Start all services
```bash
docker-compose up --build
```

This will start:
- MongoDB on port 27017
- Backend API on port 5000

### 2. Seed admin user
In a new terminal:
```bash
docker exec -it utkarsh-backend npm run seed
```

### 3. Start frontend (separate terminal)
```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at http://localhost:5173

## Useful Commands

### View logs
```bash
docker-compose logs -f
```

### Stop services
```bash
docker-compose down
```

### Remove volumes (clean database)
```bash
docker-compose down -v
```

### Rebuild after code changes
```bash
docker-compose up --build
```

## Accessing Services

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017/utkarsh

## Troubleshooting

### Port already in use
If port 5000 or 27017 is already in use, stop the conflicting service or change ports in docker-compose.yml

### Database connection issues
Ensure MongoDB container is running:
```bash
docker ps
```

### Backend not starting
Check logs:
```bash
docker-compose logs backend
```
