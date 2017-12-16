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
									order.addProduct(req.body[i].product.id, {through: {quantity: req.body[i].quantity}}).then(product => {
										user.addOrder(order).then(user => {
											res.status(201).json(order).end();
										});
									});
								}else{
									order.addProduct(req.body[i].product.id, {through: {quantity: req.body[i].quantity}}).then(product => {
										addProduct(i + 1);
									});
								}
							}

							addProducts(0);

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