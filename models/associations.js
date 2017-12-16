const Category = require('./category'),
	  Product = require('./product'),
	  User = require('./user')
	  Wishlist = require('./wishlist');

//Category.hasMany(Product, {as: 'products', foreignKey: 'product'});
const Associations = {
	associate: () => {
		Product.belongsToMany(Category, {as: 'categories', through: 'ProductCategory'});
		Category.belongsToMany(Product, {as: 'products', through: 'ProductCategory'});
		Category.belongsTo(Category, {as: 'category'});

		User.hasMany(Wishlist, {as: 'wishlists'});
		Wishlist.hasMany(Product, {as: 'products'});
	}
};

module.exports = Associations;