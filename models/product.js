const 	db = require('../data/db'),
		Category = require('./category'),
		Sequelize = require('sequelize');

const Product = db.define('Product', {
	id: { 
		type: Sequelize.STRING,
		primaryKey: true,
		validate: {
			isNumeric: {
				args: true,
				msg: "ISBN should contain only numbers"
			},
			len: {
				args: [10, 13],
				msg: "ISBN should have a length of 10 or 13 numbers"
			}
		}
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: {
				args: [3, 100],
				msg: "Name should have a length between 3 and 100 characters"
			}
		}
	},
	description: {
		type: Sequelize.TEXT,
		allowNull: false,
		validate: {
			len: {
				args: [10, 1000],
				msg: "Description should have a length between 3 and 1000 characters"
			}
		}
	},
	price: {
		type: Sequelize.FLOAT,
		allowNull: false,
		validate: {
			isFloat: {
				args: true,
				msg: "Price should be a valid price"
			}
		}
	},
	imgUrl: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			isUrl: {
				args: true,
				msg: "Image URL should be an URL"
			}
		}
	},
	stock: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 5,
		validate: {
			isInt: {
				args: true,
				msg: "Stock should be a number (without decimals)"
			}
		}
	},
	deliveryDays: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 5,
		validate: {
			isInt: {
				args: true,
				msg: "Delivery should be a number (without decimals)"
			}
		}
	}
});

module.exports = Product;