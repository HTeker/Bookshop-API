require('co-mocha');

process.env.NODE_ENV = 'test';

let chai = require('chai'),
	should = chai.should(),
	server = require('../server'),
	request = require('co-supertest')
	db = require('../data/db')
	seeder = require('../data/seeder')
	User = require('../models/user');

describe('User', () => {

	beforeEach(function(done){
		db.sync({force: true}).then(function(){
			User.bulkCreate([
				{name: 'Halil', email: 'halil@example.com', password: '12345678'},
				{name: 'Teker', email: 'teker@example.com', password: '12345678'},
				{name: 'Ibrahim', email: 'ibrahim@example.com', password: '12345678'},
				{name: 'Jack', email: 'jack@example.com', password: '12345678'},
				{name: 'Michael', email: 'michael@example.com', password: '12345678'}
			]).then((users) => {
				done();
			});
		});
	});

	it('get all users', function*(){
		let users = (yield request(server).get('/user').expect(200).end()).body;
		users.should.be.a('array');
		users.should.have.lengthOf(5);
	});

});