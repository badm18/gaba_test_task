# Promo Codes REST API

REST API для системы промокодов. NestJS + TypeScript + PostgreSQL + Sequelize.

## Запуск

```bash
cp .env.example .env
npm install
docker-compose up --build -d
make db-migrate 
или если не получается - docker compose exec app npx sequelize-cli db:migrate
```

Приложение будет доступно на `http://localhost:3000`.