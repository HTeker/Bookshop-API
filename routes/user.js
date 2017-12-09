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

	createUser: (req, res) => {
		User.create(req.body).then(
			(user) => {
				res.status(201).json(user).end();
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	getUserById: (req, res) => {
		User.findById(req.params.id).then(
			(user) => {
				if(user){
					res.status(200).json(user).end();
				}else{
					res.status(404).end();
				}
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	deleteUserById: (req, res) => {
		User.destroy({ where: { id: req.params.id } }).then(
			(user) => {
				if(user){
					res.status(200).json(user).end();
				}else{
					res.status(404).end();
				}
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	updateUserById: (req, res) => {
		User.findById(req.params.id).then(
			(user) => {
				if(user){
					user.updateAttributes(req.body).then(
						(updatedUser) => {
							res.status(200).json(updatedUser.dataValues).end();
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