const 	db = require('../data/db'),
		Sequelize = require('sequelize');

const Wishlist = db.define('Wishlist', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

module.exports = Wishlist;