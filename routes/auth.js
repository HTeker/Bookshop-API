const User = require('../models/user');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const axios = require('axios');
const config = require('../config');

module.exports = {
	login: (req, res) => {
		User.findOne({where: {email: req.body.email}}).then(
			(user) => {
				if(!user){
					res.status(404).json(['No user found with this email']).end();
				}else{
					bcrypt.compare(req.body.password, user.password, function(err, isMatch){
						if(err) throw err;
						if(!isMatch){
							res.status(400).json(['Incorrect password']).end();
						}

						jwt.sign({user}, config.secretkey, (err, token) => {
							if(err){
								res.status(400).json(err).end();
							}else{
								res.status(200).json({user: user, token: token}).end();
							}
						});
					});
				}
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	signup: (req, res, next) => {
		User.create(req.body).then(
			(user) => {
				axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + user.street + "+" + user.number + "+" + user.zipcode + "+" + user.city + "&key=" + config.geocoding_api_key)
					.then(function(response){
						if(response.status == 200){
							user.lat = response.data.results[0].geometry.location.lat;
							user.lng = response.data.results[0].geometry.location.lng;
							user.save();
						}
						jwt.sign({user}, config.secretkey, (err, token) => {
							if(err){
								res.status(400).json(err).end();
							}else{
								res.status(201).json({user: user, token: token}).end();
							}
						});
					});
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	verifyUserToken: (req, res, next) => {
		const bearerHeader = req.headers['authorization'];

		if(bearerHeader){
			const bearer = bearerHeader.split(' ');
			const bearerToken = bearer[1];
			req.token = bearerToken;

			jwt.verify(req.token, config.secretkey, (err, authData) => {
				if(!err && (authData.user.email === req.params.useremail || authData.user.isAdmin)){
					next();
				}else{
					res.status(403).end();
				}
			});
		}else{
			res.status(403).end();
		}
	},

	verifyAdminToken: (req, res, next) => {
		const bearerHeader = req.headers['authorization'];

		if(bearerHeader){
			const bearer = bearerHeader.split(' ');
			const bearerToken = bearer[1];
			req.token = bearerToken;

			jwt.verify(req.token, config.secretkey, (err, authData) => {
				if(!err && authData.user.isAdmin){
					next();
				}else{
					res.status(403).end();
				}
			});
		}else{
			res.status(403).end();
		}
	}
};