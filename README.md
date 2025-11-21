# Siscol – Guia de Desenvolvimento

Este README descreve o passo a passo para rodar o ambiente completo, composto por:

* **Siscol (backend)** – API em **Ruby on Rails**, rodando via **Docker**, na porta **3001**.
* **Siscol Web (frontend)** – Aplicação em **React**, rodando localmente via Node.js.

---

# 📌 Pré-requisitos

Antes de começar, você precisa ter instalado:

* **Docker** e **Docker Compose**
* **Node.js (18+)**
* **Yarn** ou **npm**

---

# 🛠️ Backend – SISCOL (Rails via Docker)

## 1. Entre na pasta do backend

```
cd siscol
```

## 2. Suba o container em modo desenvolvimento

```
docker compose up --build
```

Isso irá:

* iniciar o servidor em **[http://localhost:3001](http://localhost:3001)**

## 4. Criar e migrar o banco (SQLite)

Caso seja a primeira vez:

```
docker compose exec app bin/rails db:create
```

```
docker compose exec app bin/rails db:migrate
```

# 💻 Frontend – SISCOL-WEB (React)

## 1. Entre na pasta do frontend

```
cd siscol-web
```

## 2. Instale dependências

```
yarn install
```

Ou:

```
npm install
```

## 3. Rode o projeto

```
yarn dev
```

Ou:

```
npm run dev
```

Frontend disponível em:
[http://localhost:3000](http://localhost:3000) 
