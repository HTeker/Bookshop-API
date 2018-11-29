const Sequelize = require('sequelize');

let db;

switch(process.env.NODE_ENV.trim()) {

	case 'test':
		
		console.log('Connecting to test database...');

		db = new Sequelize(process.env.DATABASE_URL, {
		    dialect: 'postgres',
		    dialectOptions: {
			ssl: true
		    }
		});

		break;
		
	default:
		
		console.log('Connecting to default database...');

		db = new Sequelize({
		    host: process.env.DATABASE_URL || 'localhost',
		    port: 5432,
		    database: 'webapp',
		    username: 'root',
		    password: 'root',
		    dialect: 'postgres',
		    logging: false
		});

		break;
		
}

module.exports = db;
