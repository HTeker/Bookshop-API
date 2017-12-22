const 	db = require('../data/db'),
		Sequelize = require('sequelize'),
		bcrypt = require('bcryptjs');

const User = db.define('User', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: {
				args: [3, 100],
				msg: "Name should have a length between 3 and 100 characters"
			}
		}
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		primaryKey: true,
		validate: {
			isEmail: {
				args: [3, 100],
				msg: "E-mail should be a valid e-mailaddress"
			}
		}
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: {
				args: [8, 35],
				msg: "Password should have a length between 8 and 35 characters"
			},
			is: {
				args: "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)",
				msg: "Password should contain at least 1 lower case character, 1 upper case character and 1 digit"
			}
		}
	},
	salt: {
		type: Sequelize.STRING
	}
});

User.beforeSave((user, options) => {
	user.salt = bcrypt.genSaltSync(10);
	user.password = bcrypt.hashSync(user.password, user.salt);
	return;
});

module.exports = User;