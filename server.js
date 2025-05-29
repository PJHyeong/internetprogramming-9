require('dotenv').config();
const express    = require('express');
const bodyParser = require('body-parser');
const postsRoute = require('./routes/posts');
const tagsRoute  = require('./routes/tags');

const app = express();
app.use(bodyParser.json());

// 라우트 설정
app.use('/posts', postsRoute);
app.use('/tags',  tagsRoute);

app.get('/', (req,res)=>res.send('Study Matching API OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`✅ 서버가 ${PORT}포트에서 열렸습니다.`));