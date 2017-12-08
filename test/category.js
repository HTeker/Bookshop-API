require('co-mocha');

process.env.NODE_ENV = 'test';

let chai = require('chai'),
	should = chai.should(),
	server = require('../server'),
	request = require('co-supertest')
	db = require('../data/db')
	Category = require('../models/category');

describe('Category', () => {

	beforeEach(function(done){
		db.sync({force: true}).then(function(){
			Category.bulkCreate([
				{ name: 'Fiction' },
				{ name: 'Biography' },
				{ name: 'Humour' },
				{ name: 'Computing' },
				{ name: 'Sport' }
			]).then((categories) => {
				done();
			});
		});
	});

	it('get all categories', function*(){
		let categories = (yield request(server).get('/category').expect(200).end()).body;
		categories.should.have.lengthOf(5);
	});

	it('create a category', function*(){
		let new_category = { name: 'Programming'};
		yield request(server).post('/category').send(new_category).expect(201).end();
		let categories = (yield request(server).get('/category').expect(200).end()).body;
		categories.should.have.lengthOf(6);
	});

});