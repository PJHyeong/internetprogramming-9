const express = require('express');
const cookieParser = require('cookie-parser');
const loginRoutes = require('./routes/login'); 
require('dotenv').config(); 

const app = express();

//미들웨어
app.use(express.json());
app.use(cookieParser());

//라우터 
app.use('/api', loginRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
