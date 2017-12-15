const Wishlist = require('../models/wishlist');
const User = require('../models/user');
const Sequelize = require('sequelize');

module.exports = {
	getWishlists: (req, res)=> {
		User.findById(req.params.id).then(
			(user) => {
				if(user){
					user.getWishlists().then(wishlists => {
						res.status(200).json(wishlists).end();
					});
				}else{
					res.status(404).end();
				}
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	createWishlist: (req, res) => {
		User.findById(req.params.id).then(
			(user) => {
				if(user){
					//res.status(200).json(user).end();
					Wishlist.create(req.body).then(
						(wishlist) => {
							user.addWishlist(wishlist).then(wishlists => {
								res.status(201).json(wishlist).end();
							});
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