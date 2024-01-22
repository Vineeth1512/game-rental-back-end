const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    thumbnailURL: {
        type: String,
        required: true
    },
    sellerUsername: {
        type: String,
        required: true
    },
    unitsAvailable: {
        type: Number,
        required: true
    },
    productType: {
        type: String,
        required: true,
        enum: ['game', 'controller', 'console']
    },
    productImages: [{
        type: String,
        required: true
    }],
    rentalPricePerWeek: {
        type: Number,
        required: true
    },
    rentalPricePerMonth: {
        type: Number,
        required: true
    },
},
    { timestamps: true })


productSchema.methods.updateStock = function (orderedUnits) {
    if (this.unitsAvailable >= orderedUnits) {
        this.unitsAvailable -= orderedUnits;
        return true; // Stock updated successfully
    } else {
        return false; // Not enough stock
    }
};

const Product = mongoose.model("Products", productSchema);
module.exports = Product;