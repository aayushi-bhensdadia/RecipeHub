import { pool } from '../config/db.js';
import { publicUser } from '../utils/serializers.js';

export async function getMe(req, res) {
  const [[u]] = await pool.query('SELECT * FROM users WHERE id=?', [req.uid]);
  const [[recipes]] = await pool.query('SELECT COUNT(*) n FROM recipes WHERE uid=?', [req.uid]);
  const [[favs]] = await pool.query(
    "SELECT COUNT(*) n FROM collections WHERE uid=? AND kind='fav'", [req.uid]
  );
  const [[bookmarks]] = await pool.query(
    "SELECT COUNT(*) n FROM collections WHERE uid=? AND kind='bookmark'", [req.uid]
  );
  const [[reviewsReceived]] = await pool.query(
    "SELECT COUNT(*) n FROM reviews v JOIN recipes r ON v.rid=CONCAT('u_',r.id) WHERE r.uid=?",
    [req.uid]
  );

  res.json({
    user: publicUser(u),
    stats: {
      recipes: recipes.n,
      favs: favs.n,
      bookmarks: bookmarks.n,
      reviewsReceived: reviewsReceived.n,
    },
  });
}
