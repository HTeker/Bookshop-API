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
	},
	totalPrice: {
		type: Sequelize.FLOAT,
		allowNull: false,
		validate: {
			isFloat: {
				args: true,
				msg: "Price should be a valid price"
			}
		}
	}
});

module.exports = Order;