const Product = require('../models/product');
const Sequelize = require('sequelize');

module.exports = {
	getProducts: (req, res) => {
		Product.all().then(
			(products) => {
				res.status(200).json(products).end();
			},(err) => {
				res.status(400).json(err).end();
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
		Product.findById(req.params.id).then(
			(product) => {
				if(product){
					res.status(200).json(product).end();
				}else{
					res.status(404).end();
				}
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	deleteProductById: (req, res) => {
		Product.destroy({ where: { id: req.params.id } }).then(
			(product) => {
				if(product){
					res.status(200).json(product).end();
				}else{
					res.status(404).end();
				}
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	updateProductById: (req, res) => {
		Product.findById(req.params.id).then(
			(product) => {
				if(product){
					product.updateAttributes(req.body).then(
						(updatedProduct) => {
							res.status(200).json(updatedProduct.dataValues).end();
						},(err) => {
							res.status(400).json(err).end();
						}
					);
				}else{
					res.status(404).end();
				}
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	searchProducts: (req, res) => {
		Product.all({
			where: {
				[Sequelize.Op.or]: [{id: {
					[Sequelize.Op.like]: '%' + req.params.query + '%'
				}},{name: {
					[Sequelize.Op.like]: '%' + req.params.query + '%'
				}},{description: {
					[Sequelize.Op.like]: '%' + req.params.query + '%'
				}}]
			}
		}).then(
			(products) => {
				res.status(200).json(products).end();
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	addCategories: (req, res) => {
		Product.findById(req.params.id).then(
			(product) => {
				if(product){
					if(Array.isArray(req.body)){
						var ids = [];
						req.body.forEach(function(category){
							ids.push(category.id);
						});
					}

					product.addCategory((ids) ? ids : req.body.id).then(
						(productCategory) => {
							res.status(201).json(productCategory).end();
						},(err) => {
							res.status(400).json(err).end();
						}
					);
				}else{
					res.status(404).end();
				}
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	getCategories: (req, res) => {
		Product.findById(req.params.id).then(
			(product) => {
				if(product){
					product.getCategories().then(
						(categories) => {
							res.status(200).json(categories).end();
						},(err) => {
							res.status(400).json(err).end();
						}
					);
				}else{
					res.status(404).end();
				}
			},(err) => {
				console.log(err);
				res.status(400).json(err).end();
			}
		);
	},

	removeCategories: (req, res) => {
		Product.findById(req.params.id).then(
			(product) => {
				if(product){
					if(Array.isArray(req.body)){
						var ids = [];

						req.body.forEach(function(category){
							ids.push(category.id);
						});
					}

					product.removeCategory((ids) ? ids : req.body.id).then(
						() => {
							res.status(200).end();
						},(err) => {
							res.status(400).json(err).end();
						}
					);
				}else{
					res.status(404).end();
				}
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	}
};