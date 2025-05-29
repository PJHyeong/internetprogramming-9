require('dotenv').config();
const express    = require('express');
const bodyParser = require('body-parser');
const postsRoute = require('./routes/posts');
const tagsRoute  = require('./routes/tags');
const pool       = require('./config/db'); // 추가

const app = express();
app.use(bodyParser.json());

// 라우트 설정
app.use('/api/posts', postsRoute);
app.use('/api/tags',  tagsRoute);

app.get('/', (req,res)=>res.send('Study Matching API OK'));

// DB 연결 확인 코드 추가
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