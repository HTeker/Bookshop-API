var products = [];
const Product = require('../models/product');

module.exports = {
	getProducts: (req, res) => {
		Product.all().then(result => {
			res.json(result).end();
		});
	},

	saveProduct: (req, res) => {
		Product.create(req.body).then(() => {
			res.status(201).end();
		});
	},

	getProductById: (req, res) => {
		for(key in products){
			if(products[key].isbn == req.params.id){
				res.json(products[key]).end();
			}
		}
		res.status(404).end();
	}
};