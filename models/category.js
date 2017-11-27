const 	db = require('../data/db'),
		Sequelize = require('sequelize');

const Category = db.define('Category', {
	id: { type: Sequelize.INTEGER, primaryKey: true},
	name: Sequelize.STRING,
	category: { type: Sequelize.INTEGER, allowNull: true }
});

//Category.hasOne(Category, { as: 'categories', foreignKey: 'category' });

Category.sync({force: true});
Category.sync();

module.exports = Category;