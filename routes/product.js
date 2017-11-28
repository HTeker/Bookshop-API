const Product = require('../models/product');

module.exports = {
	getProducts: (req, res) => {
		Product.all().then(
			(products) => {
				res.status(200).json(products).end();
			},(err) => {
				res.status(404).json(err).end();
			}
		);
	},

	createProduct: (req, res) => {
		Product.create(req.body).then(
			(product) => {
				res.status(201).json(product).end();
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	getProductById: (req, res) => {
		Product.findById().then(
			(product) => {
				res.status(200).json(product).end();
			},(err) => {
				res.status(404).json(err).end();
			}
		);
	},

	deleteProductById: (req, res) => {
		Product.destroy({ where: { id: req.params.id } }).then(
			(product) => {
				res.status(200).json(product).end();
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	}
};