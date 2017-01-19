var mongoose = require('mongoose');

var WishlistSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

var Wishlist = mongoose.model('Wishlist', WishlistSchema);

module.exports = Wishlist;