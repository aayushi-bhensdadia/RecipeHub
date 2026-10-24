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

## Page URLs
| URL | Page | Login needed |
|---|---|---|
| `/` | Home (`/?q=pasta` = search) | no |
| `/login`, `/register` | Login / Register | no |
| `/dish/:key` | All versions of a dish, e.g. `/dish/paneer%20butter%20masala` | no |
| `/recipe/:id` | Community recipe | no |
| `/online/:id` | Online (Spoonacular) recipe | no |
| `/add` | Share a recipe | yes |
| `/saved` | Saved recipes | yes |
| `/my-recipes` | My recipes | yes |
| `/recipe/:id/edit` | Edit recipe (uses **PATCH**) | yes (author only) |

Unknown URLs show a 404 page. Logged-out visitors opening a login-only URL are sent to `/login` and returned afterwards.

## PATCH method
`PATCH /api/recipes/:id` updates only the fields sent in the body (PUT replaces the whole recipe).
The frontend uses it on the Edit page (`EditRecipePage.jsx` -> `patchRecipe()` in `api/recipes.js`).

### Notes
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

### Adding a new backend feature
1. Write the handler in `controllers/xxx.controller.js`
2. Register the URL in `routes/xxx.routes.js`
3. Mount the router in `routes/index.js`
