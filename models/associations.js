const Category = require('./category'),
	  Product = require('./product');

//Category.hasMany(Product, {as: 'products', foreignKey: 'product'});
const Associations = {
	associate: () => {
		Product.belongsToMany(Category, {as: 'categories', through: 'ProductCategory'});
		Category.belongsToMany(Product, {as: 'products', through: 'ProductCategory'});
		Category.belongsTo(Category, {as: 'category'});
	}
};

module.exports = Associations;