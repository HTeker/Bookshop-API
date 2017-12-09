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
		categories.should.be.a('array');
		categories.should.have.lengthOf(5);
	});

	it('create a category', function*(){
		yield request(server).post('/category').send({ name: 'Programming'}).expect(201).end();
		let categories = (yield request(server).get('/category').expect(200).end()).body;
		categories.should.have.lengthOf(6);
	});

	it('get a category by id', function*(){
		let category = (yield request(server).get('/category/3').expect(200).end()).body;
		delete category.createdAt;
        delete category.updatedAt;
		category.should.deep.equal({ id: 3, name: 'Humour', categoryId: null });
	});

	it('delete a category by id', function*(){
		yield request(server).delete('/category/1').expect(200).end();
		let categories = (yield request(server).get('/category').expect(200).end()).body;
		categories.should.have.lengthOf(4);
	});

	it('update a category by id', function*(){
		const category = (yield request(server).put('/category/4').send({ name: 'Updated Category' }).expect(200).end()).body;
		delete category.createdAt;
        delete category.updatedAt;
		category.should.deep.equal({ id: 4, name: 'Updated Category', categoryId: null });
	});

	it('search categories by name', function*(){
		let categories = (yield request(server).get('/category/search/io').expect(200).end()).body;
		categories.should.have.lengthOf(2);

		categories = (yield request(server).get('/category/search/o').expect(200).end()).body;
		categories.should.have.lengthOf(5);

		categories = (yield request(server).get('/category/search/dfgsdfg').expect(200).end()).body;
		categories.should.have.lengthOf(0);

		categories = (yield request(server).get('/category/search/Computing').expect(200).end()).body;
		categories.should.have.lengthOf(1);
	});

	it('add one product to a category', function*(){
		let product = (yield request(server).post('/product').send({ id: '0132350882', name: 'Clean Code : A Handbook of Agile Software Craftsmanship', description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", price: 19.99, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/1323/9780132350884.jpg', stock: 10, deliveryDays: 5 }).expect(201).end()).body;
		yield request(server).post('/category/3/product').send(product).expect(201).end();

		let products = (yield request(server).get('/category/3/product').expect(200).end()).body;
		products.should.have.lengthOf(1);
	});

	it('get all products of the category', function*(){
		let category = (yield request(server).post('/category').send({ name: 'Programming'}).expect(201).end()).body;

		for(var i = 0; i < 5; i++){
			let product = (yield request(server).post('/product').send({ id: i.toString(), name: 'Name #' + i, description: 'Description #' + i, price: 19.99, imgUrl: 'http://example.com', stock: 10, deliveryDays: 5 }).expect(201).end()).body;
			yield request(server).post('/product/' + i.toString() + '/category').send(category).expect(201).end();
		}

		let products = (yield request(server).get('/category/' + category.id + '/product').expect(200).end()).body;
		products.should.have.lengthOf(5);
	});

});