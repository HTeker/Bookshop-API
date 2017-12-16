const Order = require('../models/order');
const User = require('../models/user');
const Sequelize = require('sequelize');

module.exports = {
	createOrder: (req, res) => {
		User.findById(req.params.id).then(
			(user) => {
				if(user){
					Order.create().then(
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
	}
};