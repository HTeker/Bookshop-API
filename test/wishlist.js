require('co-mocha');

process.env.NODE_ENV = 'test';

let chai = require('chai'),
	should = chai.should(),
	server = require('../server'),
	request = require('co-supertest')
	db = require('../data/db')
	seeder = require('../data/seeder')
	User = require('../models/user');


describe('Wishlist', () => {

	beforeEach(function(done){
		db.sync({force: true}).then(function(){
			User.create({name: 'Halil', email: 'halil@example.com', password: '12345678'}).then((user) => {
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

	it('get all wishlists of an user by id', function*(){
		let wishlists = (yield request(server).get('/user/1/wishlist').expect(200).end()).body;
		wishlists.should.be.a('array');
		wishlists.should.have.lengthOf(5);
	});

	it('create a wishlist for an user by id', function*(){
		yield request(server).post('/user/1/wishlist').send({ name: 'New Wishlist' }).expect(201).end();
		let wishlists = (yield request(server).get('/user/1/wishlist').expect(200).end()).body;
        wishlists.should.have.lengthOf(6);
	});

	it('get a wishlist from an user by id', function*(){
		let wishlist = (yield request(server).get('/user/1/wishlist/3').expect(200).end()).body;
		delete wishlist.createdAt;
        delete wishlist.updatedAt;
		wishlist.should.deep.equal({id: 3, name: 'Wishlist #3', UserId: 1});
	});

});