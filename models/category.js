const 	db = require('../data/db'),
		Sequelize = require('sequelize');

const Category = db.define('Category', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: {
				args: [3, 100],
				msg: "Name should have a length between 3 and 100 characters"
			}
		}
	}
});

module.exports = Category;