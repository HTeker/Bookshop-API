require('co-mocha');

process.env.NODE_ENV = 'test';

let chai = require('chai'),
	should = chai.should(),
	server = require('../server'),
	request = require('co-supertest')
	db = require('../data/db');

describe('Category', () => {

	beforeEach(function(done){
		db.sync({force: true}).then(function(){
			done();
		});
	});

	it('get all categories', function*(){
		let categories = (yield request(server).get('/category').expect(200).end()).body;
		categories.should.be.a('array');
	});

	it('create a category', function*(){
		let categories = (yield request(server).get('/category').expect(200).end()).body;

		let new_category = { name: 'Programming'};
		yield request(server).post('/category').send(new_category).expect(201).end();

		let newCategories = (yield request(server).get('/category').expect(200).end()).body;

		newCategories.should.have.lengthOf(categories.length + 1);
	});

});