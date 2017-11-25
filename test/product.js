require("co-mocha");

process.env.NODE_ENV = 'test';

let chai = require('chai'),
	should = chai.should(),
	server = require('../server'),
	request = require('co-supertest');

describe('Products', () => {
  describe('Get all products', () => {
      it('it should GET all the products', function*(){
        let products = (yield request(server).get('/product').expect(200).end()).body;
      });
  });

  describe('Save a product', () => {
  	it('it should save the product', function*(){
  		let products = (yield request(server).get('/product').expect(200).end()).body;

  		let product = {};
  		yield request(server).post('/product', product).expect(201).end();

  		let newProducts = (yield request(server).get('/product').expect(200).end()).body;

  		expect(newProducts).to.have.lengthOf(products.length + 1);
  	});
  });
});