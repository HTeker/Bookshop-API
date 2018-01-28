const User = require('../models/user');
const Sequelize = require('sequelize');
const axios = require('axios');
const config = require('../config.js');

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
				axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + user.street + "+" + user.number + "+" + user.zipcode + "+" + user.city + "&key=" + config.geocoding_api_key)
					.then(function(response){
						if(response.status == 200){
							user.lat = response.data.results[0].geometry.location.lat;
							user.lng = response.data.results[0].geometry.location.lng;
							user.save();
						}
						res.status(201).json(user).end();
					});
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	getUserById: (req, res) => {
		User.findById(req.params.useremail).then(
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
		User.destroy({ where: { email: req.params.useremail } }).then(
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
		User.findById(req.params.useremail).then(
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
	},

	searchUsers: (req, res) => {
		User.all({
			where: {
				[Sequelize.Op.or]: [{name: {
					[Sequelize.Op.like]: '%' + req.params.query + '%'
				}},{email: {
					[Sequelize.Op.like]: '%' + req.params.query + '%'
				}}]
			}
		}).then(
			(users) => {
				res.status(200).json(users).end();
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	}
};