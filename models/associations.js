const Category = require('./category'),
	  Product = require('./product'),
	  User = require('./user')
	  Wishlist = require('./wishlist'),
	  Order = require('./order'),
	  OrderLine = require('./orderLine');

const Associations = {
	associate: () => {
		Product.belongsToMany(Category, {as: 'categories', through: 'ProductCategory'});
		Category.belongsToMany(Product, {as: 'products', through: 'ProductCategory'});
		Category.belongsTo(Category, {as: 'category'});

		User.hasMany(Wishlist, {as: 'wishlists'});
		Wishlist.belongsToMany(Product, {as: 'products', through: 'WishlistProduct'});
		Product.belongsToMany(Wishlist, {as: 'wishlists', through: 'WishlistProduct'});

		User.hasMany(Order, {as: 'orders'});
		Order.belongsToMany(Product, {as: 'products', through: OrderLine});
		Product.belongsToMany(Order, {as: 'orders', through: OrderLine});
	}
};

module.exports = Associations;