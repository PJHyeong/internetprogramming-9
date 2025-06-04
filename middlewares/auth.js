const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  // Authorization 헤더 누락
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization 헤더가 없습니다.' });
  }

  // Bearer 형식이 아닐 경우
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '토큰 형식이 잘못되었습니다. Bearer <token> 형식이어야 합니다.' });
  }

  const token = authHeader.split(' ')[1];

  // 토큰 자체가 없을 경우
  if (!token) {
    return res.status(401).json({ message: '토큰이 없습니다.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT 검증 실패:', err.message); // 콘솔에 오류 이유 출력
      return res.status(403).json({ message: '토큰이 유효하지 않거나 만료되었습니다.' });
    }

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
