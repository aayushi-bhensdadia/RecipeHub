import { pool } from '../config/db.js';
import { verifyToken } from '../utils/token.js';

// Requires "Authorization: Bearer <token>". Sets req.uid on success.
export async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const payload = verifyToken(header.replace(/^Bearer\s+/i, ''));
    const [rows] = await pool.query('SELECT id FROM users WHERE id=?', [payload.id]);
    if (!rows.length) return res.status(401).json({ error: 'Please login' });
    req.uid = Number(payload.id);
    next();
  } catch {
    return res.status(401).json({ error: 'Please login' });
  }
}
