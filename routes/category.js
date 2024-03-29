const Category = require('../models/category');
const Sequelize = require('sequelize');

module.exports = {
	getCategories: (req, res) => {
		Category.all().then(
			(categories) => {
				res.status(200).json(categories).end();
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	createCategory: (req, res) => {
		Category.create(req.body).then(
			(category) => {
				res.status(201).json(category).end();
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	getCategoryById: (req, res) => {
		Category.findById(req.params.id).then(
			(category) => {
				if(category){
					res.status(200).json(category).end();
				}else{
					res.status(404).end();
				}
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	deleteCategoryById: (req, res) => {
		Category.destroy({ where: { id: req.params.id } }).then(
			(category) => {
				if(category){
					res.status(200).json(category).end();
				}else{
					res.status(404).end();
				}
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	updateCategoryById: (req, res) => {
		Category.findById(req.params.id).then(
			(category) => {
				if(category){
					category.updateAttributes(req.body).then(
						(updatedCategory) => {
							res.status(200).json(updatedCategory.dataValues).end();
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

	searchCategories: (req, res) => {
		Category.all({
			where: {
				name: {
					[Sequelize.Op.like]: '%' + req.params.query + '%'
				}
			}
		}).then(
			(categories) => {
				res.status(200).json(categories).end();
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	addProducts: (req, res) => {
		Category.findById(req.params.id).then(
			(category) => {
				if(category){
					if(Array.isArray(req.body)){
						var ids = [];
						req.body.forEach(function(product){
							ids.push(product.id);
						});
					}
					
					category.addProduct((ids) ? ids : req.body.id).then(
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

	getProducts: (req, res) => {
		Category.findById(req.params.id).then(
			(category) => {
				if(category){
					category.getProducts().then(
						(products) => {
							res.status(200).json(products).end();
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

	removeProducts: (req, res) => {
		Category.findById(req.params.id).then(
			(category) => {
				if(category){
					if(Array.isArray(req.body)){
						var ids = [];

						req.body.forEach(function(product){
							ids.push(product.id);
						});
					}

					category.removeProduct((ids) ? ids : req.body.id).then(
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
	},

	getNewestCategories: (req, res) => {
		Category.all({
			order: [['createdAt', 'DESC']]
		})
		.then(
			(categories) => {
				res.status(200).json(categories).end();
			}, (err) => {
				res.status(400).json(err).end();
			}
		);
	},

	getRandomCategories: (req, res) => {
		Category.all({
			order: [
				Sequelize.fn('RAND')
			]
		})
		.then(
			(categories) => {
				res.status(200).json(categories).end();
			}, (err) => {
				res.status(400).json(err).end();
			}
		);
	}
};