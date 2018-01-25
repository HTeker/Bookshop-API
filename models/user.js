const 	db = require('../data/db'),
		Sequelize = require('sequelize'),
		bcrypt = require('bcryptjs'),
		axios = require('axios');

const config = require('../config.js');

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
	isAdmin: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	street: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: {
				args: [3, 100],
				msg: "Street should have a length between 3 and 100 characters"
			}
		}
	},
	number: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: {
				args: [1, 100],
				msg: "Number should have a length between 1 and 10 characters"
			},
			is: {
				args: "(^[a-zA-Z0-9_.-]*$)",
				msg: "Number should contain characters and digits only."
			}
		}
	},
	city: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: {
				args: [3, 100],
				msg: "Street should have a length between 3 and 100 characters"
			}
		}
	},
	zipcode: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			is: {
				args: "(^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$)",
				msg: "Zipcode should have the following format: 1111AA"
			}
		}
	},
	lat: {
		type: Sequelize.FLOAT
	},
	lng: {
		type: Sequelize.FLOAT
	}
});

User.beforeCreate((user, options) => {
	user.password = bcrypt.hashSync(user.password, user.salt);

	// Calculate geocoding
	axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + user.street + "+" + user.number + "+" + user.zipcode + "+" + user.city + "&key=" + config.geocoding_api_key)
		.then(function(response){
			if(response.status == 200){
				user.lat = response.data.results[0].geometry.location.lat;
				user.lng = response.data.results[0].geometry.location.lng;
				user.save();
			}
			return;
		}.bind(this));
});

User.beforeBulkCreate((users, options) => {
	users.forEach(function(user){
		user.password = bcrypt.hashSync(user.password, user.salt);

		// Calculate geocoding
		axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + user.street + "+" + user.number + "+" + user.zipcode + "+" + user.city + "&key=" + config.geocoding_api_key)
			.then(function(response){
				if(response.status == 200){
					console.log(response.data.results[0].geometry);
					console.log(user);
					user.lat = response.data.results[0].geometry.location.lat;
					user.lng = response.data.results[0].geometry.location.lng;
					console.log(user);
					//user.save();
				}
				return;
			}.bind(this));
	});
});

module.exports = User;