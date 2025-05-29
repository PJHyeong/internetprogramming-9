const express = require('express');
const pool = require('../DB');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const router = express.Router();

// Access Token 생성
function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
}

// Refresh Token 생성
function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// 회원가입
router.post('/register', async (req, res) => {
  const { name, userId, password, studentNumber, email } = req.body;

  try {
    // 이메일 중복 확인
    const check = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (check.rows.length > 0) {
      return res.status(400).json({ message: '이미 등록된 이메일입니다.' });
    }

    // userId 중복 확인
    const userIdCheck = await pool.query('SELECT * FROM users WHERE "userId" = $1', [userId]);
    if (userIdCheck.rows.length > 0) {
      return res.status(400).json({ message: '이미 등록된 사용자 ID입니다.' });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 회원가입 처리
    const role = 'user';

    const result = await pool.query(
      'INSERT INTO users (name, "userId", password, "studentNumber", email, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, "userId", email, role',
      [name, userId, hashedPassword, studentNumber, email, role]
    );


    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 에러' });
  }
});

// 로그인 + Refresh Token 쿠키 저장
router.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE "userId" = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: '사용자 ID 또는 비밀번호가 잘못되었습니다.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '사용자 ID 또는 비밀번호가 잘못되었습니다.' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    res.status(200).json({
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        userId: user.userId,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 에러' });
  }
});

// 토큰 재발급
router.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.status(401).json({ message: 'Refresh Token 없음' });

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const accessToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.status(200).json({ token: accessToken });
  } catch (err) {
    return res.status(403).json({ message: 'Refresh Token 만료 또는 유효하지 않음' });
  }
});

// Refresh Token 제거
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'strict',
    secure: false,
  });
  res.status(200).json({ message: '로그아웃 되었습니다.' });
});

module.exports = router;
