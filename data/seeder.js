const Product = require('../models/product');
//const Category = require('../models/category');

module.exports = {
	seed: (done = function(){}) => {
		Product.bulkCreate([
			{ id: '0132350886', name: 'Clean Code : A Handbook of Agile Software Craftsmanship', description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", price: 19.99, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/1323/9780132350884.jpg', stock: 10, deliveryDays: 5 },
			{ id: '0552565970', name: 'Wonder', description: "'My name is August. I won't describe what I look like. Whatever you're thinking, it's probably worse.'", price: 7.30, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/5525/9780552565974.jpg', stock: 10, deliveryDays: 5 },
			{ id: '0008164657', name: 'Bad Dad', description: "In yet another dazzling David Walliams classic, Bad Dad is a fast and furious, heart-warming.", price: 9.17, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/0081/9780008164652.jpg', stock: 10, deliveryDays: 5 },
			{ id: '1847399304', name: 'The Bro Code', description: "THE BRO CODE provides men with all the rules they need to know in order to become a 'bro' and behave properly among other bros.", price: 8.01, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9781/8473/9781847399304.jpg', stock: 10, deliveryDays: 5 },
			{ id: '0099519852', name: 'The Talent Code : Greatness isn\'t born. It\'s grown', description: "'Talent. You've either got it or you haven't.' Not true, actually.", price: 9.59, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/0995/9780099519850.jpg', stock: 10, deliveryDays: 5 }
		]).then((products) => {
			done();
		});
	}
}