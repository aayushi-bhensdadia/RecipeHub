import { pool } from '../config/db.js';
import { fail } from '../utils/httpError.js';
import { validRid } from '../utils/validators.js';

export async function listReviews(req, res) {
  if (!validRid(req.params.rid)) throw fail(400, 'Bad id');

  const [list] = await pool.query(
    'SELECT v.id,v.uid,v.rating,v.text,v.date,u.name FROM reviews v JOIN users u ON u.id=v.uid WHERE v.rid=? ORDER BY v.date DESC',
    [req.params.rid]
  );
  const avg = list.length
    ? list.reduce((a, b) => a + Number(b.rating), 0) / list.length
    : 0;

  res.json({ list, n: list.length, avg });
}

export async function saveReview(req, res) {
  const rid = req.params.rid;
  const rating = Number(req.body.rating);

  if (!validRid(rid)) throw fail(400, 'Bad id');
  if (!(rating >= 1 && rating <= 5)) throw fail(400, 'Rating must be 1 to 5');

  // Users can't review their own recipes
  if (rid.startsWith('u_')) {
    const [r] = await pool.query('SELECT uid FROM recipes WHERE id=?', [rid.slice(2)]);
    if (!r.length) throw fail(404, 'Recipe not found');
    if (Number(r[0].uid) === req.uid) throw fail(403, 'You cannot review your own recipe');
  }

  await pool.query(
    `INSERT INTO reviews(rid,uid,rating,text,date) VALUES(?,?,?,?,?)
    ON DUPLICATE KEY UPDATE rating=VALUES(rating),text=VALUES(text),date=VALUES(date)`,
    [rid, req.uid, Math.round(rating), String(req.body.text || '').slice(0, 1000), Date.now()]
  );
  res.json({ ok: true });
}

export async function deleteReview(req, res) {
  await pool.query('DELETE FROM reviews WHERE rid=? AND uid=?', [req.params.rid, req.uid]);
  res.json({ ok: true });
}
