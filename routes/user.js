const express = require('express');
const authenticateToken = require('../middlewares/auth');
const bcrypt = require('bcrypt');
const router = express.Router();


//정보가져오기
router.get('/mypage', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT name, "userId", "studentNumber", email FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 에러' });
  }
});


//개인정보 변경
router.put('/mypage', authenticateToken, async (req, res) => {
  const { name, studentNumber, email, password } = req.body;

  try {
    const fields = [];
    const values = [];
    let index = 1;

    if (name) {
      fields.push(`name = $${index++}`);
      values.push(name);
    }
    if (studentNumber) {
      fields.push(`studentNumber = $${index++}`);
      values.push(studentNumber);
    }
    if (email) {
      fields.push(`email = $${index++}`);
      values.push(email);
    }
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      fields.push(`password = $${index++}`);
      values.push(hashed);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: '수정할 항목이 없습니다.' });
    }

    values.push(req.user.id); //WHERE id = 마지막
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${index}`;
    await pool.query(query, values);

    res.status(200).json({ message: '정보가 수정되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 에러' });
  }
});

module.exports = router;

