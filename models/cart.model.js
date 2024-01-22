const mongoose = require('mongoose');
const cartSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
        unique: true
    },
    products: [{
        productID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
            required: true,
        },
        count: {
            type: Number,
            required: true,
        },
        bookingStartDate: {
            type: Date,
            required: true,
        },
        bookingEndDate: {
            type: Date,
            required: true,
        },
        rentedAtPrice: {
            type: String,
            required: true,
        },
    }],
});
cartSchema.methods.clearCart = function () {
    this.products = [];
};



const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
