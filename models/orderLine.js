const 	db = require('../data/db'),
		Sequelize = require('sequelize');

const OrderLine = db.define('OrderLine', {
	quantity: Sequelize.INTEGER
});

module.exports = OrderLine;