require('co-mocha');

process.env.NODE_ENV = 'test';

let chai = require('chai'),
	should = chai.should(),
	server = require('../server'),
	request = require('co-supertest');

describe('Product', () => {

	it('get all products', function*(){
		let products = (yield request(server).get('/product').expect(200).end()).body;
	});

	it('save a product', function*(){
		let products = (yield request(server).get('/product').expect(200).end()).body;

		let product = { name: 'Product #1' };
		yield request(server).post('/product').send(product).expect(201).end();

		let newProducts = (yield request(server).get('/product').expect(200).end()).body;

		newProducts.should.have.lengthOf(products.length + 1);
	});

	it('get a product by id', function*(){
		let new_product = { isbn: '0132350882', name: 'Clean Code : A Handbook of Agile Software Craftsmanship' };
		yield request(server).post('/product').send(new_product).expect(201).end();

		let product = (yield request(server).get('/product/0132350882').expect(200).end()).body;
	});

});