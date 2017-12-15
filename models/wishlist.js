const 	db = require('../data/db'),
		Sequelize = require('sequelize');

const Wishlist = db.define('Wishlist', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: Sequelize.STRING
});

module.exports = Wishlist;