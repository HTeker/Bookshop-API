const 	db = require('../data/db'),
		Category = require('./category'),
		Sequelize = require('sequelize');

const Product = db.define('Product', {
	id: { type: Sequelize.STRING, primaryKey: true},
	name: Sequelize.STRING,
	description: Sequelize.TEXT,
	price: Sequelize.FLOAT,
	imgUrl: Sequelize.STRING,
	stock: Sequelize.INTEGER,
	deliveryDays: Sequelize.INTEGER
});

//Product.belongsTo(Category);

Product.sync({force: true});
Product.sync();

module.exports = Product;