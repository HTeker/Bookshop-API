const 	db = require('../data/db'),
		Sequelize = require('sequelize');

const Category = db.define('Category', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

module.exports = Category;