const pool = require('../config/db');
const { withBadge } = require('../utils/badgeUtils');

// Helper: post_tags 삽입
async function insertPostTags(client, postId, tags = []) {
  if (!tags.length) return;
  const values = tags.map((_, i) => `($1,$${i + 2})`).join(',');
  await client.query(
    `INSERT INTO post_tags (post_id, tag_id) VALUES ${values}`,
    [postId, ...tags]
  );
}

// 게시글 전체 조회
exports.getAllPosts = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*,
        json_agg(json_build_object('id', t.id, 'name', t.name, 'type', t.type))
          FILTER (WHERE t.id IS NOT NULL) AS tags
      FROM study_posts p
      LEFT JOIN post_tags pt ON pt.post_id = p.id
      LEFT JOIN tags t       ON t.id       = pt.tag_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    const result = rows.map(r => ({
      ...r,
      tags: Array.isArray(r.tags) ? r.tags.map(withBadge) : []
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류' });
  }
};

// 게시글 단건 조회
exports.getPostById = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*,
        json_agg(json_build_object('id', t.id, 'name', t.name, 'type', t.type))
          FILTER (WHERE t.id IS NOT NULL) AS tags
      FROM study_posts p
      LEFT JOIN post_tags pt ON pt.post_id = p.id
      LEFT JOIN tags t       ON t.id       = pt.tag_id
      WHERE p.id = $1
      GROUP BY p.id
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: '글이 없습니다' });
    const post = rows[0];
    post.tags = Array.isArray(post.tags) ? post.tags.map(withBadge) : [];
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류' });
  }
};

// 생성
exports.createPost = async (req, res) => {
  const {
    title,
    content,
    deadline,
    maxPeople,
    frequency,
    method,
    tags,
    location,
    userId
  } = req.body;

  // 필수 필드 체크
  if (!title || !content || !deadline || !maxPeople || !userId) {
    return res.status(400).json({ error: '필수 필드 누락' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(`
      INSERT INTO study_posts
        (title, content, maxPeople, frequency, method_offline, method_online, location, start_date, deadline, userId)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8, $9)
      RETURNING *
    `, [
      title,
      content,
      maxPeople,
      frequency || null,
      Array.isArray(method) ? method.includes('offline') : false,
      Array.isArray(method) ? method.includes('online') : false,
      location || null,
      deadline,
      userId
    ]);
    const post = rows[0];

    // tags가 문자열(이름) 배열이면 id 배열로 변환
    let tagIds = [];
    if (Array.isArray(tags) && tags.length > 0) {
      if (typeof tags[0] === 'string') {
        const { rows: tagRows } = await pool.query(
          `SELECT id FROM tags WHERE name = ANY($1::text[])`,
          [tags]
        );
        tagIds = tagRows.map(r => r.id);
      } else {
        tagIds = tags;
      }
    }
    await insertPostTags(client, post.id, tagIds);

    await client.query('COMMIT');

    // 재조회 후 badge 추가
    const { rows: full } = await pool.query(`
      SELECT p.*,
        json_agg(json_build_object('id', t.id, 'name', t.name, 'type', t.type))
          AS tags
      FROM study_posts p
      LEFT JOIN post_tags pt ON pt.post_id = p.id
      LEFT JOIN tags t       ON t.id       = pt.tag_id
      WHERE p.id = $1
      GROUP BY p.id
    `, [post.id]);
    const created = full[0];
    created.tags = Array.isArray(created.tags) ? created.tags.map(withBadge) : [];
    res.status(201).json(created);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: '모집글 생성 실패', detail: err.message });
  } finally {
    client.release();
  }
};

// 수정
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    content,
    maxPeople,
    frequency,
    method,
    location,
    deadline,
    tags
  } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const { rows } = await client.query(`
      UPDATE study_posts
      SET
        title      = COALESCE($1, title),
        content    = COALESCE($2, content),
        maxPeople  = COALESCE($3, maxPeople),
        frequency  = COALESCE($4, frequency),
        method_offline = COALESCE($5, method_offline),
        method_online  = COALESCE($6, method_online),
        location   = COALESCE($7, location),
        deadline   = COALESCE($8, deadline),
        updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `, [
      title,
      content,
      maxPeople,
      frequency,
      Array.isArray(method) ? method.includes('offline') : false,
      Array.isArray(method) ? method.includes('online') : false,
      location,
      deadline,
      id
    ]);

    if (!rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: '글이 없습니다' });
    }

    // tags가 문자열(이름) 배열이면 id 배열로 변환
    let tagIds = [];
    if (Array.isArray(tags)) {
      if (tags.length > 0 && typeof tags[0] === 'string') {
        const { rows: tagRows } = await pool.query(
          `SELECT id FROM tags WHERE name = ANY($1::text[])`,
          [tags]
        );
        tagIds = tagRows.map(r => r.id);
      } else {
        tagIds = tags;
      }
      await client.query(`DELETE FROM post_tags WHERE post_id = $1`, [id]);
      await insertPostTags(client, id, tagIds);
    }
    await client.query('COMMIT');

    // 재조회
    const { rows: full } = await pool.query(`
      SELECT p.*,
        json_agg(json_build_object('id', t.id, 'name', t.name, 'type', t.type))
          AS tags
      FROM study_posts p
      LEFT JOIN post_tags pt ON pt.post_id = p.id
      LEFT JOIN tags t       ON t.id       = pt.tag_id
      WHERE p.id = $1
      GROUP BY p.id
    `, [id]);
    const updated = full[0];
    updated.tags = Array.isArray(updated.tags) ? updated.tags.map(withBadge) : [];
    res.json(updated);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: '서버 오류' });
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
    if (!rowCount) return res.status(404).json({ error: '글이 없습니다' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류' });
  }
};