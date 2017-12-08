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
				{ id: 1, name: 'Fiction' },
				{ id: 2, name: 'Biography' },
				{ id: 3, name: 'Humour' },
				{ id: 4, name: 'Computing' },
				{ id: 5, name: 'Sport' }
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

	it('get a category by id', function*(){
		let category = (yield request(server).get('/category/3').expect(200).end()).body;
		delete category.createdAt;
        delete category.updatedAt;
		category.should.deep.equal({ id: 3, name: 'Humour' });
	});

});