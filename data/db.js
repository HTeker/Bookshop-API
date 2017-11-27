const Sequelize = require('sequelize');

const db = new Sequelize({
    host: 'sql11.freemysqlhosting.net',
    port: 3306,
    database: 'sql11207449',
    username: 'sql11207449',
    password: 'HGUbVe47Vx',
    dialect: 'mysql'
});

db.sync({force: true});

module.exports = db;