const 	db = require('../data/db'),
		Sequelize = require('sequelize');

const OrderLine = db.define('OrderLine', {
	quantity: {
		type: Sequelize.INTEGER,
		allowNull: false
	}
});

module.exports = OrderLine;