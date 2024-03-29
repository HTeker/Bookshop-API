const Wishlist = require('../models/wishlist');
const User = require('../models/user');
const Sequelize = require('sequelize');

module.exports = {
	getWishlists: (req, res)=> {
		User.findById(req.params.useremail).then(
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
		User.findById(req.params.useremail).then(
			(user) => {
				if(user){
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
	},

	getWishlistById: (req, res) => {
		Wishlist.findOne({where: {
			id: req.params.wid,
			UserEmail: req.params.useremail
		}}).then(
			(wishlist) => {
				if(wishlist){
					res.status(200).json(wishlist.dataValues).end();
				}else{
					res.status(404).end();
				}
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	deleteWishlistById: (req, res) => {
		Wishlist.destroy({ where: {
			id: req.params.wid,
			UserEmail: req.params.useremail
		}}).then(
			(wishlist) => {
				if(wishlist){
					res.status(200).json(wishlist).end();
				}else{
					res.status(404).end();
				}
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	updateWishlistById: (req, res) => {
		Wishlist.findOne({where: {
			id: req.params.wid,
			UserEmail: req.params.useremail
		}}).then(
			(wishlist) => {
				if(wishlist){
					wishlist.updateAttributes(req.body).then(
						(updatedWishlist) => {
							res.status(200).json(updatedWishlist.dataValues).end();
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

	searchWishlists: (req, res) => {
		Wishlist.all({where: {
			UserEmail: req.params.useremail,
			name: {
				[Sequelize.Op.like]: '%' + req.params.query + '%'
			}
		}}).then(
			(wishlists) => {
				res.status(200).json(wishlists).end();
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	addProducts: (req, res) => {
		Wishlist.findOne({where: {
			id: req.params.wid,
			UserEmail: req.params.useremail
		}}).then(
			(wishlist) => {
				if(wishlist){
					if(Array.isArray(req.body)){
						var ids = [];
						req.body.forEach(function(product){
							ids.push(product.id);
						});
					}
					
					wishlist.addProduct((ids) ? ids : req.body.id).then(
						(productWishlist) => {
							res.status(201).json(productWishlist).end();
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
		Wishlist.findOne({where: {
			id: req.params.wid,
			UserEmail: req.params.useremail
		}}).then(
			(wishlist) => {
				if(wishlist){
					wishlist.getProducts().then(
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
		Wishlist.findOne({where: {
			id: req.params.wid,
			UserEmail: req.params.useremail
		}}).then(
			(wishlist) => {
				if(wishlist){
					if(Array.isArray(req.body)){
						var ids = [];

						req.body.forEach(function(product){
							ids.push(product.id);
						});
					}

					wishlist.removeProduct((ids) ? ids : req.body.id).then(
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