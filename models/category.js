const 	db = require('../data/db'),
		Sequelize = require('sequelize');

const Category = db.define('Category', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: Sequelize.STRING
});

module.exports = Category;