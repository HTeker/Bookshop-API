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
	}
};