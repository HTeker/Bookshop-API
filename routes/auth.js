const User = require('../models/user');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {
	login: (req, res) => {
		User.findOne({where: {email: req.body.email}}).then(
			(user) => {
				if(!user){
					res.status(404).end();
				}else{
					bcrypt.compare(req.body.password, user.password, function(err, isMatch){
						if(err) throw err;
						if(!isMatch){
							res.status(400).end();
						}

						jwt.sign({email: user.email}, config.secretkey, (err, token) => {
							if(err){
								res.status(400).json(err).end();
							}else{
								res.status(200).json({token}).end();
							}
						});
					});
				}				
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	}
};