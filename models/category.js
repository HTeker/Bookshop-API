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

//Category.hasOne(Category, { as: 'categories', foreignKey: 'category' });

//Category.sync({force: true});

module.exports = Category;