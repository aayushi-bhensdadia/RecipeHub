import { pool } from '../config/db.js';
import { fail } from '../utils/httpError.js';
import { validRid } from '../utils/validators.js';

export async function listCollections(req, res) {
  if (req.query.light) {
    const [rows] = await pool.query('SELECT kind,rid FROM collections WHERE uid=?', [req.uid]);
    return res.json(rows);
  }

  const [rows] = await pool.query(
    `SELECT c.kind,c.rid,COALESCE(r.title,c.title) AS title,
    CASE WHEN r.img LIKE 'data:%' THEN CONCAT('/api/recipes/',r.id,'/image') ELSE COALESCE(r.img,c.img) END AS img
    FROM collections c LEFT JOIN recipes r ON c.rid=CONCAT('u_',r.id) WHERE c.uid=? ORDER BY c.created DESC`,
    [req.uid]
  );
  res.json(rows);
}

// Adds the item if it isn't saved yet, removes it if it is.
export async function toggleCollection(req, res) {
  const kind = req.params.kind;
  const { rid, title = '', img = '' } = req.body;

  if (!['fav', 'bookmark'].includes(kind) || !validRid(String(rid))) {
    throw fail(400, 'Bad request');
  }

  const [rows] = await pool.query(
    'SELECT 1 FROM collections WHERE uid=? AND kind=? AND rid=?',
    [req.uid, kind, rid]
  );

  if (rows.length) {
    await pool.query('DELETE FROM collections WHERE uid=? AND kind=? AND rid=?', [req.uid, kind, rid]);
  } else {
    await pool.query(
      'INSERT INTO collections(uid,kind,rid,title,img,created) VALUES(?,?,?,?,?,?)',
      [
        req.uid, kind, rid,
        String(title).slice(0, 200),
        String(img).startsWith('data:') ? '' : String(img).slice(0, 1000),
        Date.now(),
      ]
    );
  }
  res.json({ on: !rows.length });
}
