# RecipeHub — React + Express + MySQL

## Stack
- Frontend: React + Vite
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
Open the Vite URL shown in the terminal (normally http://localhost:5173).

## Notes
- Set `SPOONACULAR_KEY` in `backend/.env` to enable external recipe search. Without it, you can still register, log in, and create your own recipes.
- Do not commit `.env` or share your JWT secret.
- This is a development starter; add production hardening, rate limiting, and stronger image storage before deployment.

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
        ├── App.jsx                # layout + picks the current page
        ├── pages/                 # HomePage, LoginPage, AddRecipePage, DishPage,
        │                          # RecipePage, CollectionsPage, MyRecipesPage
        ├── components/            # Header, Hero, Footer, Notice, RecipeCard,
        │                          # RecipeGrid, RecipeForm, AuthForm, ReviewSection...
        ├── context/               # AuthContext (user), AppContext (navigation, notices)
        ├── api/                   # one file per backend resource (fetch calls)
        ├── utils/                 # localStorage helpers
        └── constants.js
```

### Adding a new backend feature
1. Write the handler in `controllers/xxx.controller.js`
2. Register the URL in `routes/xxx.routes.js`
3. Mount the router in `routes/index.js`
