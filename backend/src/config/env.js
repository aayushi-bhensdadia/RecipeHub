import dotenv from 'dotenv';

// Load .env once, before anything else reads process.env
dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5000',
  jwtSecret: process.env.JWT_SECRET || 'development-only-change-this-secret',
  spoonacularKey: process.env.SPOONACULAR_KEY,
  db: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'recipehub',
  },
};
