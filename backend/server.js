require('dotenv').config();
const express    = require('express');
const bodyParser = require('body-parser');
const postsRoute = require('./routes/posts');
const tagsRoute  = require('./routes/tags');
const pool       = require('./config/db');
const loginRoutes = require('./routes/login'); 
const userRoutes = require('./routes/user');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express(); // <<== 이 줄이 먼저 와야 함

app.use(cookieParser()); // <<== 그 다음에 호출

app.use(bodyParser.json());
// CORS 설정
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// 라우트 설정
app.use('/api/posts', postsRoute);
app.use('/api/tags',  tagsRoute);
app.use('/api', loginRoutes);
app.use('/my', userRoutes);

app.get('/', (req,res)=>res.send('Study Matching API OK'));

// DB 연결 확인 코드
pool.connect()
  .then(client => {
    return client.query('SELECT NOW()')
      .then(res => {
        console.log('✅ DB 연결 성공:', res.rows[0]);
        client.release();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, ()=>console.log(`✅ 서버가 ${PORT}포트에서 열렸습니다.`));
      })
      .catch(err => {
        console.error('❌ DB 연결 실패:', err);
        client.release();
        process.exit(1);
      });
  })
  .catch(err => {
    console.error('❌ DB 연결 실패:', err);
    process.exit(1);
  });