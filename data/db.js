const Sequelize = require('sequelize');

var logging = true;

if(process.env.NODE_ENV == 'test'){
	logging = false;
}

/*const db = new Sequelize({
    host: 'sql11.freemysqlhosting.net',
    port: 3306,
    database: 'sql11207449',
    username: 'sql11207449',
    password: 'HGUbVe47Vx',
    dialect: 'mysql',
    logging: logging
});*/

const db = new Sequelize({
    host: process.env.DATABASE_URL || 'localhost',
    port: 5432,
    database: 'webapp',
    username: 'root',
    password: 'root',
    dialect: 'postgres',
    logging: logging
});

//db.sync({force: true});

module.exports = db;
