const User = require('../models/user');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = {
	login: (req, res) => {
		User.findOne({where: {email: req.body.email}}).then(
			(user) => {
				if(!user){
					res.status(404).end();
				}else{
					bcrypt.compare(req.body.password, user.password, function(err, isMatch){
						if(err) throw err;
						if(isMatch){
							res.status(200).end();
						}else{
							res.status(400).end();
						}
					});
				}				
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	}
};