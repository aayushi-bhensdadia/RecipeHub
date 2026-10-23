import { pool } from '../config/db.js';
import { fail } from '../utils/httpError.js';
import { slug } from '../utils/text.js';

export async function listDishes(req, res) {
  const q = '%' + slug(req.query.q || '') + '%';
  const [rows] = await pool.query(
    `SELECT r.dish_key AS \`key\`, MIN(r.dish) AS name, COUNT(DISTINCT r.id) AS versions,
    (SELECT CASE WHEN img LIKE 'data:%' THEN CONCAT('/api/recipes/',id,'/image') ELSE img END FROM recipes WHERE dish_key=r.dish_key AND img<>'' LIMIT 1) AS img,
    COALESCE(AVG(v.rating),0) AS avg FROM recipes r LEFT JOIN reviews v ON v.rid=CONCAT('u_',r.id)
    WHERE r.dish_key LIKE ? GROUP BY r.dish_key ORDER BY avg DESC,versions DESC LIMIT 60`,
    [q]
  );
  res.json(rows);
}

export async function getDish(req, res) {
  const [versions] = await pool.query(
    `SELECT r.id,r.dish,r.title,CASE WHEN r.img LIKE 'data:%' THEN CONCAT('/api/recipes/',r.id,'/image') ELSE r.img END AS img,
    r.time,u.name AS author,r.uid,COALESCE(AVG(v.rating),0) AS avg,COUNT(v.id) AS n
    FROM recipes r JOIN users u ON u.id=r.uid LEFT JOIN reviews v ON v.rid=CONCAT('u_',r.id)
    WHERE r.dish_key=? GROUP BY r.id ORDER BY avg DESC,n DESC,r.created DESC`,
    [slug(req.params.key)]
  );

  if (!versions.length) throw fail(404, 'Dish not found');
  res.json({ key: slug(req.params.key), name: versions[0].dish, versions });
}
