require('co-mocha');

process.env.NODE_ENV = 'test';

let chai = require('chai'),
	should = chai.should(),
	server = require('../server'),
	request = require('co-supertest')
	db = require('../data/db');

describe('Product', () => {

	before(function(done){
		db.sync({force: true}).then(function(){
			done();
		});
	});

	it('get all products', function*(){
		let products = (yield request(server).get('/product').expect(200).end()).body;
	});

	it('save a product', function*(){
		let products = (yield request(server).get('/product').expect(200).end()).body;

		let new_product = { id: '0132350882', name: 'Clean Code : A Handbook of Agile Software Craftsmanship', description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", price: 19.99, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/1323/9780132350884.jpg', stock: 10, deliveryDays: 5 };
		yield request(server).post('/product').send(new_product).expect(201).end();

		let newProducts = (yield request(server).get('/product').expect(200).end()).body;

		newProducts.should.have.lengthOf(products.length + 1);
	});

	it('get a product by id', function*(){
		let new_product = { id: '0132350881', name: 'Clean Code : A Handbook of Agile Software Craftsmanship', description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", price: 19.99, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/1323/9780132350884.jpg', stock: 10, deliveryDays: 5 };
		yield request(server).post('/product').send(new_product).expect(201).end();

		let product = (yield request(server).get('/product/0132350881').expect(200).end()).body;
	});

});