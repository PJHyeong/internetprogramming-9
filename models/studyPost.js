
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'postgres',
});

const StudyPost = sequelize.define('StudyPost', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    field: DataTypes.STRING,
    location: DataTypes.STRING,
    dayOfWeek: DataTypes.STRING,
    time: DataTypes.TIME,
    maxMembers: DataTypes.INTEGER,
    creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = StudyPost;