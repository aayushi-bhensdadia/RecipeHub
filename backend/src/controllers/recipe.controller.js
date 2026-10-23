import { pool } from '../config/db.js';
import { fail } from '../utils/httpError.js';
import { slug } from '../utils/text.js';
import { parseRecipeBody } from '../utils/validators.js';

export async function getRecipe(req, res) {
  const [rows] = await pool.query(
    `SELECT r.*,u.name AS author,
    (SELECT COALESCE(AVG(rating),0) FROM reviews WHERE rid=CONCAT('u_',r.id)) AS avg,
    (SELECT COUNT(*) FROM reviews WHERE rid=CONCAT('u_',r.id)) AS n
    FROM recipes r JOIN users u ON u.id=r.uid WHERE r.id=?`,
    [req.params.id]
  );
  if (!rows.length) throw fail(404, 'Recipe not found');

  const r = rows[0];
  res.json({
    ...r,
    img: String(r.img || '').startsWith('data:') ? `/api/recipes/${r.id}/image` : r.img,
    rid: 'u_' + r.id,
    ing: typeof r.ing === 'string' ? JSON.parse(r.ing) : r.ing,
    steps: typeof r.steps === 'string' ? JSON.parse(r.steps) : r.steps,
  });
}

export async function getRecipeImage(req, res) {
  const [[r]] = await pool.query('SELECT img FROM recipes WHERE id=?', [req.params.id]);
  const m = r && /^data:(image\/[\w+.-]+);base64,(.+)$/.exec(r.img || '');
  if (!m) return res.status(404).end();

  res
    .set('Content-Type', m[1])
    .set('Cache-Control', 'public,max-age=3600')
    .send(Buffer.from(m[2], 'base64'));
}

export async function createRecipe(req, res) {
  const b = parseRecipeBody(req.body);
  const [r] = await pool.query(
    'INSERT INTO recipes(uid,dish,dish_key,title,img,time,servings,ing,steps,created) VALUES(?,?,?,?,?,?,?,?,?,?)',
    [
      req.uid, b.dish, slug(b.dish), b.title, b.img, b.time, b.servings,
      JSON.stringify(b.ing), JSON.stringify(b.steps), Date.now(),
    ]
  );
  res.status(201).json({ id: r.insertId, dishKey: slug(b.dish) });
}

export async function updateRecipe(req, res) {
  const [rows] = await pool.query('SELECT * FROM recipes WHERE id=?', [req.params.id]);
  if (!rows.length) throw fail(404, 'Recipe not found');
  if (Number(rows[0].uid) !== req.uid) throw fail(403, 'Only the author can edit this recipe');

  const b = parseRecipeBody(req.body);
  await pool.query(
    'UPDATE recipes SET dish=?,dish_key=?,title=?,img=?,time=?,servings=?,ing=?,steps=? WHERE id=?',
    [
      b.dish, slug(b.dish), b.title, b.img || rows[0].img, b.time, b.servings,
      JSON.stringify(b.ing), JSON.stringify(b.steps), req.params.id,
    ]
  );
  res.json({ ok: true, dishKey: slug(b.dish) });
}

export async function deleteRecipe(req, res) {
  const [rows] = await pool.query('SELECT uid FROM recipes WHERE id=?', [req.params.id]);
  if (!rows.length) throw fail(404, 'Recipe not found');
  if (Number(rows[0].uid) !== req.uid) throw fail(403, 'Only the author can delete this recipe');

  const rid = 'u_' + req.params.id;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM reviews WHERE rid=?', [rid]);
    await conn.query('DELETE FROM collections WHERE rid=?', [rid]);
    await conn.query('DELETE FROM recipes WHERE id=?', [req.params.id]);
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
  res.json({ ok: true });
}

export async function getMyRecipes(req, res) {
  const [rows] = await pool.query(
    `SELECT r.id,r.dish,r.title,CASE WHEN r.img LIKE 'data:%' THEN CONCAT('/api/recipes/',r.id,'/image') ELSE r.img END AS img,
    COALESCE(AVG(v.rating),0) AS avg,COUNT(v.id) AS n FROM recipes r LEFT JOIN reviews v ON v.rid=CONCAT('u_',r.id)
    WHERE r.uid=? GROUP BY r.id ORDER BY r.created DESC`,
    [req.uid]
  );
  res.json(rows);
}
