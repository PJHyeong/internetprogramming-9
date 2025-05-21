

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db'); // 데이터베이스 연결 및 모델
const studyRoutes = require('./routes/study'); // 모집글 라우트
const tagRoutes = require('./routes/tag'); // 태그 라우트
const badgeRoutes = require('./routes/badge'); // 뱃지 라우트

const app = express();
app.use(bodyParser.json());

// API 라우트 설정
app.use('/api/study', studyRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/badges', badgeRoutes);

// 데이터베이스 동기화
db.sequelize.sync()
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Error syncing database:', err));

// 서버 시작
const PORT = process.env.PORT || 5432;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});