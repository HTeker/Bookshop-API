const 	db = require('../data/db'),
		Category = require('./category'),
		Sequelize = require('sequelize');

const Product = db.define('Product', {
	id: { type: Sequelize.STRING, primaryKey: true},
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	description: {
		type: Sequelize.TEXT,
		allowNull: false
	},
	price: {
		type: Sequelize.FLOAT,
		allowNull: false
	},
	imgUrl: {
		type: Sequelize.STRING,
		allowNull: false
	},
	stock: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 0
	},
	deliveryDays: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 5
	}
});

module.exports = Product;