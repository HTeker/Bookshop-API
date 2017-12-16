const 	db = require('../data/db'),
		Sequelize = require('sequelize');

const Order = db.define('Order', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	orderedAt: {
		type: Sequelize.DATE
	},
	shippedAt: {
		type: Sequelize.DATE
	}
});

module.exports = Order;