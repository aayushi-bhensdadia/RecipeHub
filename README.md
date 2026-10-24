# RecipeHub — React + Express + MySQL

## Stack
- Frontend: React + Vite + React Router + Tailwind CSS v4
- Backend: Node.js + Express
- Database: MySQL 8+
- Authentication: JWT + bcrypt
- Recipe search: optional Spoonacular API

## Requirements
Install Node.js 18+ and MySQL 8+.

## 1. Create the database
Open MySQL Workbench or the MySQL terminal and run:
```sql
CREATE DATABASE recipehub;
```
The backend creates the tables automatically when it starts.

## 2. Configure the backend
```bash
cd backend
npm install
```
Copy `.env.example` to `.env` and set your MySQL username/password and a strong JWT secret.
On Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

## 3. Configure the frontend
Open another terminal:
```bash
cd frontend
npm install
```

## 4. Run
Terminal 1:
```bash
cd backend
npm run dev
```
Terminal 2:
```bash
cd frontend
npm run dev
```
Open http://localhost:5000 (the Vite dev server runs on port 5000).

## Project structure

```
RecipeHub/
├── backend/
│   └── src/
│       ├── server.js              # starts the app (DB init + listen)
│       ├── app.js                 # Express app: middleware + routes
│       ├── config/                # env.js, db.js (pool), initDb.js (tables)
│       ├── routes/                # URL -> controller mapping (one file per resource)
│       ├── controllers/           # request handling + SQL queries
│       ├── middleware/            # auth.js, errorHandler.js
│       ├── services/              # spoonacular.service.js (external API)
│       └── utils/                 # small helpers (slug, token, validators...)
└── frontend/
    └── src/
        ├── main.jsx               # entry point: providers + render
        ├── App.jsx                # layout + all routes (URL -> page)
        ├── routes.js              # every URL path in one place
        ├── styles.js              # shared Tailwind class strings
        ├── pages/                 # HomePage, LoginPage, AddRecipePage, DishPage,
        │                          # RecipePage, CollectionsPage, MyRecipesPage
        ├── components/            # Header, Hero, Footer, Notice, RecipeCard,
        │                          # RecipeGrid, RecipeForm, AuthForm, ReviewSection...
        ├── context/               # AuthContext (user), AppContext (notices, loading)
        ├── api/                   # one file per backend resource (fetch calls)
        ├── utils/                 # localStorage helpers
        └── constants.js
```
