// Assuming you have models for User, Product, and Wishlist
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Wishlist = require('../models/wishlist.model');

// Controller method for saving/removing from the wishlist
module.exports.saveRemoveFromWishlist = async (req, res) => {
    try {
        const { userID, productID } = req.body;
        // Check if the user and product exist
        const userExists = await User.exists({ _id: userID });
        const productExists = await Product.exists({ _id: productID });

        if (!userExists || !productExists) {
            return res.status(404).json({
                message: 'User or Product not found'
            });
        }

        // Check if the product is already in the user's wishlist
        const wishlistItem = await Wishlist.findOne({ userID, productID });

        if (wishlistItem) {
            // Product is in the wishlist, remove it
            await Wishlist.findOneAndDelete({ userID, productID });

            // Retrieve and send updated wishlist
            const updatedWishlist = await Wishlist.find({ userID }).populate('productID');

            return res.status(200).json({
                message: "removed from the wishlist",
                wishlist: updatedWishlist
            });
        } else {
            // Product is not in the wishlist, add it
            const newWishlistItem = new Wishlist({
                userID,
                productID,
            });
            await newWishlistItem.save();
            // Retrieve and send updated wishlist
            const updatedWishlist = await Wishlist.find({ userID }).populate('productID');
            return res.status(200).json({
                message: "added to the wishlist",
                wishlist: updatedWishlist
            });

            
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};
