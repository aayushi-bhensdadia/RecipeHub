import app from './app.js';
import { env } from './config/env.js';
import { initializeDatabase } from './config/initDb.js';

try {
  await initializeDatabase();
  app.listen(env.port, () =>
    console.log(`RecipeHub API running at http://localhost:${env.port}`)
  );
} catch (error) {
  console.error('Failed to start server:', error.message);
  process.exit(1);
}
