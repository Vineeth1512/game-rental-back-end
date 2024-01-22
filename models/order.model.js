const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', 
        required: true,
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
    orderDate: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
