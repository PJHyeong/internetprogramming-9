
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'postgres',
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 모델 정의
db.StudyPost = require('../models/studyPost')(sequelize, Sequelize);
db.Tag = require('../models/tag')(sequelize, Sequelize);
db.Badge = require('../models/badge')(sequelize, Sequelize);

// 관계 정의 (필요시 추가)
// 예시: db.StudyPost.belongsTo(db.User);

module.exports = db;