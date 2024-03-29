require('co-mocha');

process.env.NODE_ENV = 'test';

let chai = require('chai'),
	should = chai.should(),
	server = require('../server'),
	request = require('co-supertest')
	db = require('../data/db')
	seeder = require('../data/seeder')
	User = require('../models/user');

var token;

describe('Wishlist', () => {

	beforeEach(function(done){
		db.sync({force: true}).then(function(){
			User.create({name: 'Halil', email: 'halil@example.com', isAdmin: true, password: '1234Pass5678', street: 'Lorem Ipsumstraat', number: '123', city: 'Den Haag', zipcode: '1234AB'}).then((user) => {
				Wishlist.bulkCreate([
					{ name: 'Wishlist #1' },
					{ name: 'Wishlist #2' },
					{ name: 'Wishlist #3' },
					{ name: 'Wishlist #4' },
					{ name: 'Wishlist #5' }
				]).then(wishlists => {
					user.addWishlists(wishlists).then(
						createdWishlists => {
							done();
						}
					);
				});
			});
		});
	});

	it('get user token', function*(){
		token = (yield request(server).post('/login').send({email: 'halil@example.com', password: '1234Pass5678'}).expect(200).end()).body.token;
	});

	it('get all wishlists of an user by email', function*(){
		let wishlists = (yield request(server).get('/user/halil@example.com/wishlist').set('Authorization', 'Bearer ' + token).expect(200).end()).body;
		wishlists.should.be.a('array');
		wishlists.should.have.lengthOf(5);
	});

	it('create a wishlist for an user by email', function*(){
		yield request(server).post('/user/halil@example.com/wishlist').send({ name: 'New Wishlist' }).set('Authorization', 'Bearer ' + token).expect(201).end();
		let wishlists = (yield request(server).get('/user/halil@example.com/wishlist').set('Authorization', 'Bearer ' + token).expect(200).end()).body;
        wishlists.should.have.lengthOf(6);
	});

	it('get a wishlist from an user by email', function*(){
		let wishlist = (yield request(server).get('/user/halil@example.com/wishlist/3').set('Authorization', 'Bearer ' + token).expect(200).end()).body;
		delete wishlist.createdAt;
        delete wishlist.updatedAt;
		wishlist.should.deep.equal({id: 3, name: 'Wishlist #3', UserEmail: 'halil@example.com'});
	});

	it('delete a wishlist from an user by email', function*(){
		yield request(server).delete('/user/halil@example.com/wishlist/3').set('Authorization', 'Bearer ' + token).expect(200).end();
		let wishlists = (yield request(server).get('/user/halil@example.com/wishlist').set('Authorization', 'Bearer ' + token).expect(200).end()).body;
		wishlists.should.have.lengthOf(4);
	});

	it('update a wishlist from an user by email', function*(){
		const wishlist = (yield request(server).put('/user/halil@example.com/wishlist/3').send({ name: 'Updated Wishlist' }).set('Authorization', 'Bearer ' + token).expect(200).end()).body;
		delete wishlist.createdAt;
        delete wishlist.updatedAt;
		wishlist.should.deep.equal({ id: 3, name: 'Updated Wishlist', UserEmail: 'halil@example.com' });
	});

	it('search wishlists by name', function*(){
		let wishlists = (yield request(server).get('/user/halil@example.com/wishlist/search/wishlist').set('Authorization', 'Bearer ' + token).expect(200).end()).body;
		wishlists.should.have.lengthOf(5);

		wishlists = (yield request(server).get('/user/halil@example.com/wishlist/search/3').set('Authorization', 'Bearer ' + token).expect(200).end()).body;
		wishlists.should.have.lengthOf(1);
	});

	it('add one product to a wishlist for an user by email', function*(){
		let product = (yield request(server).post('/product').send({ id: '0132350882', name: 'Clean Code : A Handbook of Agile Software Craftsmanship', description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", price: 19.99, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/halil@example.com323/9780132350884.jpg', stock: 10, deliveryDays: 5 }).set('Authorization', 'Bearer ' + token).expect(201).end()).body;
		yield request(server).post('/user/halil@example.com/wishlist/3/product').send(product).set('Authorization', 'Bearer ' + token).expect(201).end();

		let products = (yield request(server).get('/user/halil@example.com/wishlist/3/product').set('Authorization', 'Bearer ' + token).expect(200).end()).body;
		products.should.have.lengthOf(1);
	});

	it('get all products of a wishlist of an user by email', function*(){
		for(var i = 0; i < 5; i++){
			let id = "1234567890" + i.toString();
			let product = (yield request(server).post('/product').send({ id: id, name: 'Name #' + i, description: 'Description #' + i, price: 19.99, imgUrl: 'http://example.com', stock: 10, deliveryDays: 5 }).set('Authorization', 'Bearer ' + token).expect(201).end()).body;
			yield request(server).post('/user/halil@example.com/wishlist/3/product').send(product).set('Authorization', 'Bearer ' + token).expect(201).end();
		}

		let products = (yield request(server).get('/user/halil@example.com/wishlist/3/product').set('Authorization', 'Bearer ' + token).expect(200).end()).body;
		products.should.have.lengthOf(5);
	});

	it('delete one product from a wishlist of an user by email', function*(){
		let product = (yield request(server).post('/product').send({ id: '0132350882', name: 'Clean Code : A Handbook of Agile Software Craftsmanship', description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", price: 19.99, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/halil@example.com323/9780132350884.jpg', stock: 10, deliveryDays: 5 }).set('Authorization', 'Bearer ' + token).expect(201).end()).body;
		yield request(server).post('/user/halil@example.com/wishlist/3/product').send(product).set('Authorization', 'Bearer ' + token).expect(201).end();

		let products = (yield request(server).get('/user/halil@example.com/wishlist/3/product').set('Authorization', 'Bearer ' + token).expect(200).end()).body;
		products.should.have.lengthOf(1);

		yield request(server).delete('/user/halil@example.com/wishlist/3/product').send(product).set('Authorization', 'Bearer ' + token).expect(200).end();

		let newProducts = (yield request(server).get('/user/halil@example.com/wishlist/3/product').set('Authorization', 'Bearer ' + token).expect(200).end()).body;
		newProducts.should.have.lengthOf(0);
	});

	it('delete multiple products from a category', function*(){
		let products = [];
		products.push((yield request(server).post('/product').send({ id: '0132350886', name: 'Clean Code : A Handbook of Agile Software Craftsmanship', description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", price: 19.99, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/halil@example.com323/9780132350884.jpg', stock: 10, deliveryDays: 5 }).set('Authorization', 'Bearer ' + token).expect(201).end()).body);
		products.push((yield request(server).post('/product').send({ id: '0552565970', name: 'Wonder', description: "'My name is August. I won't describe what I look like. Whatever you're thinking, it's probably worse.'", price: 7.30, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/5525/9780552565974.jpg', stock: 10, deliveryDays: 5 }).set('Authorization', 'Bearer ' + token).expect(201).end()).body);
		products.push((yield request(server).post('/product').send({ id: '0008164657', name: 'Bad Dad', description: "In yet another dazzling David Walliams classic, Bad Dad is a fast and furious, heart-warming.", price: 9.17, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/0081/9780008164652.jpg', stock: 10, deliveryDays: 5 }).set('Authorization', 'Bearer ' + token).expect(201).end()).body);

		yield request(server).post('/user/halil@example.com/wishlist/3/product').send(products).set('Authorization', 'Bearer ' + token).expect(201).end();

		let returnedProducts = (yield request(server).get('/user/halil@example.com/wishlist/3/product').set('Authorization', 'Bearer ' + token).expect(200).end()).body;
		returnedProducts.should.have.lengthOf(3);

		yield request(server).delete('/user/halil@example.com/wishlist/3/product').send(products).set('Authorization', 'Bearer ' + token).expect(200).end();

		let newProducts = (yield request(server).get('/user/halil@example.com/wishlist/3/product').set('Authorization', 'Bearer ' + token).expect(200).end()).body;
		newProducts.should.have.lengthOf(0);
	});

});