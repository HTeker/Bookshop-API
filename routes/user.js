const User = require('../models/user');
const Sequelize = require('sequelize');

module.exports = {
	getUsers: (req, res) => {
		User.all().then(
			(users) => {
				res.status(200).json(users).end();
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},
};