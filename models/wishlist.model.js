const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    }
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
