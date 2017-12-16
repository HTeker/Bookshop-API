const 	db = require('../data/db'),
		Sequelize = require('sequelize');

const OrderLine = db.define('OrderLine', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	quantity: Sequelize.INTEGER
});

module.exports = OrderLine;