const Cart = require("../models/cart.model");
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require("../models/order.model")
module.exports.addRemoveFromCart = async (req, res) => {
    try {
        const { userID, productID, count, bookingStartDate, bookingEndDate } = req.body;

        // Check if the user and product exist
        const userExists = await User.exists({ _id: userID });
        const productExists = await Product.exists({ _id: productID });

        if (!userExists || !productExists) {
            return res.status(404).json({
                message: 'User or Product not found'
            });
        }

        // Check if the count is more than unitsAvailable
        const productDetails = await Product.findById(productID);
        if (!productDetails) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        if (count > productDetails.unitsAvailable) {
            return res.status(400).json({
                message: `Only ${productDetails.unitsAvailable} units available`
            });
        }

        // Check if the user already has an entry in the cart
        const cartEntry = await Cart.findOne({ userID });

        if (cartEntry) {
            // Check if the product is already in the user's cart
            const cartProductIndex = cartEntry.products.findIndex(item => item.productID.equals(productID));


            if (cartProductIndex !== -1) {
                // Product is in the cart, remove it
                cartEntry.products = cartEntry.products.filter(item => !item.productID.equals(productID));
            }
            // Add the updated product to the cart
            cartEntry.products.push({
                productID,
                count,
                bookingStartDate,
                bookingEndDate,
                rentedAtPrice: calculateRentedAtPrice(productDetails, count),
            });

            await cartEntry.save();

            return res.status(200).json({
                message: "Cart updated",
                cart: cartEntry.products
            });
        } else {
            // User doesn't have an entry in the cart, create one
            const newCartEntry = new Cart({
                userID,
                products: [{
                    productID,
                    count,
                    bookingStartDate,
                    bookingEndDate,
                    rentedAtPrice: calculateRentedAtPrice(productDetails, count),
                }],
            });
            await newCartEntry.save();

            return res.status(200).json({
                message: "Cart created",
                cart: newCartEntry.products
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}
const calculateRentedAtPrice = (productDetails, count) => {
    const weeklyPrice = productDetails.rentalPricePerWeek * count;
    const monthlyPrice = productDetails.rentalPricePerMonth * count;
    return `${weeklyPrice}/week, ${monthlyPrice}/month`;
};


module.exports.placeOrder = async (req, res) => {
    try {
        const { userID } = req.body;
        console.log(userID);

        // Find the user's cart
        const cart = await Cart.findOne({ userID }).populate('products.productID');
        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found',
            });
        }

        // Create an order based on the cart
        const orderProducts = [];

        for (const item of cart.products) {
            const product = await Product.findById(item.productID);
            if (!product) {
                return res.status(404).json({
                    message: `Product not found with ID: ${item.productID}`,
                });
            }

            // Check if there's enough stock
            if (item.count > product.unitsAvailable) {
                return res.status(400).json({
                    message: `Not enough stock available for product ${product.title}`,
                });
            }

            // Add product details to the order
            orderProducts.push({
                productID: item.productID._id,
                title: product.title,
                thumbnailURL: product.thumbnailURL,
                sellerUsername: product.sellerUsername,
                unitsAvailable: product.unitsAvailable,
                count: item.count,
                productType: product.productType,
                bookingStartDate: item.bookingStartDate,
                bookingEndDate: item.bookingEndDate,
                rentedAtPrice: item.rentedAtPrice,
            });
        }

        // Create and save the order
        const order = new Order({
            userID,
            products: orderProducts,
        });

        await order.save();

        // Empty the user's cart
        await Cart.findOneAndDelete({ userID });

        // Update product availability based on the order
        for (const item of cart.products) {
            const product = await Product.findById(item.productID);
            if (product) {
                product.unitsAvailable -= item.count;
                await product.save();
            }
        }

        return res.status(200).json({
            message: 'Order placed successfully',
            order: orderProducts,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
}