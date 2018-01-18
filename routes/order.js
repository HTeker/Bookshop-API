const Order = require('../models/order');
const User = require('../models/user');
const Sequelize = require('sequelize');

module.exports = {
	getOrders: (req, res) => {
		User.findById(req.params.useremail).then(
			(user) => {
				if(user){
					user.getOrders().then(orders => {
						res.status(200).json(orders).end();
					});
				}else{
					res.status(404).end();
				}
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	},

	createOrder: (req, res) => {
		User.findById(req.params.useremail).then(
			(user) => {
				if(user){

					var totalPrice = 0.0;

					for(var i = 0; i < req.body.length; i++){
						totalPrice += req.body[i].quantity * req.body[i].product.price;
					}

					Order.create({totalPrice}).then(
						(order) => {
							function addProducts(i){
								if(i === req.body.length - 1){
									order.addProduct(req.body[i].product.id, {through: {quantity: req.body[i].quantity}}).then(
										(product) => {
											user.addOrder(order).then(user => {
												res.status(201).json(order).end();
											});
										},(err) => {
											res.status(400).json(err).end();
										}
									);
								}else{
									order.addProduct(req.body[i].product.id, {through: {quantity: req.body[i].quantity}}).then(
										(product) => {
											addProducts(i + 1);
										},(err) => {
											res.status(400).json(err).end();
										}
									);
								}
							}

							if(req.body.length){
								addProducts(0);
							}else{
								res.status(400).end();
							}

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

	getOrderById: (req, res) => {
		Order.findOne({where: {
			id: req.params.oid,
			UserEmail: req.params.useremail
		}}).then(
			(order) => {
				if(order){
					res.status(200).json(order.dataValues).end();
				}else{
					res.status(404).end();
				}
			},(err) => {
				res.status(400).json(err).end();
			}
		);
	}
};