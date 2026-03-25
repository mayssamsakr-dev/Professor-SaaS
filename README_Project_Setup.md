
# Project Setup Guide

## Requirements

### Node.js
Version: 20 LTS
https://nodejs.org/en/download

Verify:
node -v
npm -v

### PostgreSQL
Version: 14+
https://www.postgresql.org/download/

### Git
https://git-scm.com/downloads

---

## Clone repository

git clone REPOSITORY_URL
cd Professor-SaaS

---

## Backend setup

cd professor-backend
npm install

Create database:
professor_saas

Create file:
professor-backend/.env

Content:

DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/professor_saas
JWT_SECRET=dev_secret_123

Run migrations:

npx prisma migrate dev

Seed data:

npx ts-node prisma/seed.ts

Run backend:

npm run start:dev

Backend URL:
http://localhost:3000

---

## Frontend setup

cd professor-frontend
npm install

Run frontend:

npm run dev

Frontend URL:
http://localhost:5173

---

## Tech stack

Backend:
NestJS 11
Prisma 6
PostgreSQL

Frontend:
React 19
Vite 8
Ant Design
Axios

---

## Useful commands

Run backend:
npm run start:dev

Run frontend:
npm run dev

Generate prisma client:
npx prisma generate

Apply migrations:
npx prisma migrate dev

Seed database:
npx ts-node prisma/seed.ts
