const pool        = require('../config/db');
const { withBadge } = require('../utils/badgeUtils');

// Helper: post_tags 삽입
async function insertPostTags(client, postId, tagIds=[]) {
  if (!tagIds.length) return;
  const values = tagIds.map((_,i)=>`($1,$${i+2})`).join(',');
  await client.query(
    `INSERT INTO post_tags (post_id, tag_id) VALUES ${values}`,
    [postId, ...tagIds]
  );
}

// 게시글 전체 조회
exports.getAllPosts = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*,
        json_agg(json_build_object('id',t.id,'name',t.name,'type',t.type))
          FILTER (WHERE t.id IS NOT NULL) AS tags
      FROM study_posts p
      LEFT JOIN post_tags pt ON pt.post_id = p.id
      LEFT JOIN tags t       ON t.id       = pt.tag_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    // badgeClass 추가
    const result = rows.map(r=>({
      ...r,
      tags: (r.tags || []).map(withBadge)
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:'서버 오류' });
  }
};

// 게시글 단건 조회
exports.getPostById = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*,
        json_agg(json_build_object('id',t.id,'name',t.name,'type',t.type))
          FILTER (WHERE t.id IS NOT NULL) AS tags
      FROM study_posts p
      LEFT JOIN post_tags pt ON pt.post_id = p.id
      LEFT JOIN tags t       ON t.id       = pt.tag_id
      WHERE p.id = $1
      GROUP BY p.id
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error:'글이 없습니다' });
    const post = rows[0];
    post.tags = post.tags.map(withBadge);
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:'서버 오류' });
  }
};

// 생성
exports.createPost = async (req, res) => {
  const { title, content, capacity, start_date, end_date, author_id, tagIds } = req.body;
  if (!title||!content||!capacity||!start_date||!end_date||!author_id)
    return res.status(400).json({ error:'필수 필드 누락' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(`
      INSERT INTO study_posts
        (title,content,capacity,start_date,end_date,author_id)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
    `, [title,content,capacity,start_date,end_date,author_id]);
    const post = rows[0];
    await insertPostTags(client, post.id, tagIds||[]);
    await client.query('COMMIT');

    // 재조회 후 badge 추가
    const { rows: full } = await pool.query(`
      SELECT p.*,
        json_agg(json_build_object('id',t.id,'name',t.name,'type',t.type))
          AS tags
      FROM study_posts p
      LEFT JOIN post_tags pt ON pt.post_id = p.id
      LEFT JOIN tags t       ON t.id       = pt.tag_id
      WHERE p.id = $1
      GROUP BY p.id
    `, [post.id]);
    const created = full[0];
    created.tags = created.tags.map(withBadge);
    res.status(201).json(created);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error:'서버 오류' });
  } finally {
    client.release();
  }
};

// 수정
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, capacity, start_date, end_date, tagIds } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const { rows } = await client.query(`
      UPDATE study_posts
      SET
        title      = COALESCE($1,title),
        content    = COALESCE($2,content),
        capacity   = COALESCE($3,capacity),
        start_date = COALESCE($4,start_date),
        end_date   = COALESCE($5,end_date),
        updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `, [title,content,capacity,start_date,end_date,id]);

    if (!rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error:'글이 없습니다' });
    }

    if (Array.isArray(tagIds)) {
      await client.query(`DELETE FROM post_tags WHERE post_id = $1`, [id]);
      await insertPostTags(client, id, tagIds);
    }
    await client.query('COMMIT');

    // 재조회
    const { rows: full } = await pool.query(`
      SELECT p.*,
        json_agg(json_build_object('id',t.id,'name',t.name,'type',t.type))
          AS tags
      FROM study_posts p
      LEFT JOIN post_tags pt ON pt.post_id = p.id
      LEFT JOIN tags t       ON t.id       = pt.tag_id
      WHERE p.id = $1
      GROUP BY p.id
    `, [id]);
    const updated = full[0];
    updated.tags = updated.tags.map(withBadge);
    res.json(updated);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error:'서버 오류' });
  } finally {
    client.release();
  }
};

// 삭제
exports.deletePost = async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM study_posts WHERE id = $1',
      [req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error:'글이 없습니다' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:'서버 오류' });
  }
};