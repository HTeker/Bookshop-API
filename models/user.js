const 	db = require('../data/db'),
		Sequelize = require('sequelize');

const User = db.define('User', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: Sequelize.STRING,
	email: Sequelize.STRING,
	password: Sequelize.STRING
});

module.exports = User;