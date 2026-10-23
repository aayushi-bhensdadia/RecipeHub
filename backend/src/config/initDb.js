import { pool } from './db.js';

// Creates all tables on startup if they don't exist yet.
export async function initializeDatabase() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS users (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(120) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE, pass VARCHAR(255) NOT NULL,
      created BIGINT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS recipes (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, uid BIGINT UNSIGNED NOT NULL,
      dish VARCHAR(200) NOT NULL, dish_key VARCHAR(220) NOT NULL, title VARCHAR(250) NOT NULL,
      img MEDIUMTEXT, time INT NULL, servings INT NULL, ing JSON NOT NULL, steps JSON NOT NULL,
      created BIGINT NOT NULL, INDEX idx_dish(dish_key),
      CONSTRAINT fk_recipe_user FOREIGN KEY(uid) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS reviews (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, rid VARCHAR(40) NOT NULL,
      uid BIGINT UNSIGNED NOT NULL, rating TINYINT NOT NULL, text VARCHAR(1000) DEFAULT '',
      date BIGINT NOT NULL, UNIQUE KEY uq_review(rid,uid), INDEX idx_review_rid(rid),
      CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5),
      CONSTRAINT fk_review_user FOREIGN KEY(uid) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS collections (
      uid BIGINT UNSIGNED NOT NULL, kind ENUM('fav','bookmark') NOT NULL, rid VARCHAR(40) NOT NULL,
      title VARCHAR(200), img VARCHAR(1000), created BIGINT NOT NULL,
      PRIMARY KEY(uid,kind,rid),
      CONSTRAINT fk_collection_user FOREIGN KEY(uid) REFERENCES users(id) ON DELETE CASCADE
    )`,
  ];
  for (const sql of statements) await pool.query(sql);
}
