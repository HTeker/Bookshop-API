require('co-mocha');

process.env.NODE_ENV = 'test';

let chai = require('chai'),
	should = chai.should(),
	server = require('../server'),
	request = require('co-supertest')
	db = require('../data/db')
	seeder = require('../data/seeder')
	User = require('../models/user');

describe('Auth', () => {

	beforeEach(function(done){
		db.sync({force: true}).then(function(){
            User.bulkCreate([
                {name: 'Halil', email: 'halil@example.com', isAdmin: true, password: '1234Pass5678'},
                {name: 'Teker', email: 'teker@example.com', password: '1234Pass5678'},
                {name: 'Ibrahim', email: 'ibrahim@example.com', password: '1234Pass5678'},
                {name: 'Jack', email: 'jack@example.com', password: '1234Pass5678'},
                {name: 'Michael', email: 'michael@example.com', password: '1234Pass5678'}
            ]).then((users) => {
                done();
            });

		});
	});

	it('register a new user', function*(){
		yield request(server).post('/signup').send({ name: 'User #', email: 'email@example.com', password: '1234Pass5678'}).expect(201).end();

		let token = (yield request(server).post('/login').send({ email: 'halil@example.com', password: '1234Pass5678'}).expect(200).end()).body.token;

		let users = (yield request(server).get('/user').set('Authorization', 'Bearer ' + token).expect(200).end()).body;
		users.should.have.lengthOf(6);
	});

	it('login with an existing user', function*(){
		yield request(server).post('/login').send({ email: 'michael@example.com', password: '1234Pass5678'}).expect(200).end();
	});

});