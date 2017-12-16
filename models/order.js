const 	db = require('../data/db'),
		Sequelize = require('sequelize');

const Order = db.define('Order', {
	orderedAt: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	},
	shippedAt: {
		type: Sequelize.DATE
	}
});

module.exports = Order;