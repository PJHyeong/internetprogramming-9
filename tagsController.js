const pool = require('../db');

// 모든 태그 조회
exports.getAllTags = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, name, type
      FROM tags
      ORDER BY type, name
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류' });
  }
};

// 단일 태그 조회
exports.getTagById = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id,name,type FROM tags WHERE id=$1',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: '태그가 없습니다' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류' });
  }
};

// 태그 생성
exports.createTag = async (req, res) => {
  const { name, type } = req.body;
  if (!name || !type) return res.status(400).json({ error: '필수 항목 누락' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO tags (name, type) VALUES ($1,$2) RETURNING *',
      [name, type]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류' });
  }
};

// 태그 수정
exports.updateTag = async (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE tags
         SET name = COALESCE($1,name),
             type = COALESCE($2,type)
       WHERE id = $3
       RETURNING *`,
      [name, type, id]
    );
    if (!rows.length) return res.status(404).json({ error: '태그가 없습니다' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류' });
  }
};

// 태그 삭제
exports.deleteTag = async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM tags WHERE id = $1',
      [req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: '태그가 없습니다' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류' });
  }
};