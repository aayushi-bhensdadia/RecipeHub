import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { fail } from '../utils/httpError.js';
import { makeToken } from '../utils/token.js';
import { publicUser } from '../utils/serializers.js';

export async function register(req, res) {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!name || !/^\S+@\S+\.\S+$/.test(email) || password.length < 6) {
    throw fail(400, 'Name, valid email and 6+ character password are required');
  }

  const [existing] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
  if (existing.length) throw fail(409, 'Email already registered');

  const [result] = await pool.query(
    'INSERT INTO users(name,email,pass,created) VALUES(?,?,?,?)',
    [name, email, await bcrypt.hash(password, 10), Date.now()]
  );

  const user = { id: result.insertId, name, email, created: Date.now() };
  res.status(201).json({ token: makeToken(user), user: publicUser(user) });
}

export async function login(req, res) {
  const email = String(req.body.email || '').trim().toLowerCase();
  const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);

  if (
    !rows.length ||
    !(await bcrypt.compare(String(req.body.password || ''), rows[0].pass))
  ) {
    throw fail(401, 'Wrong email or password');
  }

  res.json({ token: makeToken(rows[0]), user: publicUser(rows[0]) });
}
