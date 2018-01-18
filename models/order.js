const 	db = require('../data/db'),
		Sequelize = require('sequelize');

const Order = db.define('Order', {
	orderedAt: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	},
	shippedAt: {
		type: Sequelize.DATE
	},
	status: {
		type: Sequelize.STRING,
		defaultValue: 'ordered'
	}
});

module.exports = Order;