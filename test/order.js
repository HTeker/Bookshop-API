require('co-mocha');

process.env.NODE_ENV = 'test';

let chai = require('chai'),
	should = chai.should(),
	server = require('../server'),
	request = require('co-supertest')
	db = require('../data/db')
	seeder = require('../data/seeder')
	Order = require('../models/order')
	User = require('../models/user')
	Product = require('../models/product');

var token;

describe('Order', () => {

	beforeEach(function(done){
		db.sync({force: true}).then(function(){
			User.create({name: 'Halil', email: 'halil@example.com', isAdmin: true, password: '1234Pass5678', street: 'Lorem Ipsumstraat', number: '123', city: 'Den Haag', zipcode: '1234AB'}).then((user) => {
				Order.create({totalPrice: 99.95}).then(order => {
					Product.create({ id: '2342342341', name: 'Clean Code : A Handbook of Agile Software Craftsmanship', description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", price: 19.99, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/1323/9780132350884.jpg', stock: 10, deliveryDays: 5 }).then(product => {
						order.addProduct(product.id, {through: {quantity: 5}}).then(productOrder => {
							user.addOrder(order).then(user => {
								done();
							});
						});
					});
				});
			});
		});
	});

	it('get user token', function*(){
		token = (yield request(server).post('/login').send({email: 'halil@example.com', password: '1234Pass5678'}).expect(200).end()).body.token;
	});

	it('create an order for an user by email', function*(){
		
		let products = [];
		let product1 = (yield request(server).post('/product').send({ id: '0132350886', name: 'Clean Code : A Handbook of Agile Software Craftsmanship', description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", price: 19.99, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/1323/9780132350884.jpg', stock: 10, deliveryDays: 5 }).set('Authorization', 'Bearer ' + token).expect(201).end()).body;
		let product2 = (yield request(server).post('/product').send({ id: '0552565970', name: 'Wonder', description: "'My name is August. I won't describe what I look like. Whatever you're thinking, it's probably worse.'", price: 7.30, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/5525/9780552565974.jpg', stock: 10, deliveryDays: 5 }).set('Authorization', 'Bearer ' + token).expect(201).end()).body;
		let product3 = (yield request(server).post('/product').send({ id: '0008164657', name: 'Bad Dad', description: "In yet another dazzling David Walliams classic, Bad Dad is a fast and furious, heart-warming.", price: 9.17, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/0081/9780008164652.jpg', stock: 10, deliveryDays: 5 }).set('Authorization', 'Bearer ' + token).expect(201).end()).body;

		products.push({product: product1, quantity: 5});
		products.push({product: product2, quantity: 3});
		products.push({product: product3, quantity: 1});

		yield request(server).post('/user/halil@example.com/order').send(products).set('Authorization', 'Bearer ' + token).expect(201).end();
		
		let orders = (yield request(server).get('/user/halil@example.com/order').set('Authorization', 'Bearer ' + token).expect(200).end()).body;
		orders.should.be.a('array');
		orders.should.have.lengthOf(2);
	});

	it('get all orders of an user by email', function*(){
		let orders = (yield request(server).get('/user/halil@example.com/order').set('Authorization', 'Bearer ' + token).expect(200).end()).body;
		orders.should.be.a('array');
		orders.should.have.lengthOf(1);
	});

	it('get an order of an user by email', function*(){
		let order = (yield request(server).get('/user/halil@example.com/order/1').set('Authorization', 'Bearer ' + token).expect(200).end()).body;
		delete order.createdAt;
        delete order.updatedAt;
        delete order.orderedAt;
        delete order.shippedAt;
		order.should.deep.equal({id: 1, UserEmail: 'halil@example.com', status: 'ordered', totalPrice: 99.95});
	});

});