const Product = require("../models/product.model");
const mongoose = require("mongoose")
module.exports.createProduct = async (req, res) => {
    try {
        const { title, thumbnailURL, sellerUsername, unitsAvailable, productType, rentalPricePerWeek, rentalPricePerMonth } = req.body;
        if (!title || !thumbnailURL || !sellerUsername || !unitsAvailable || !productType || !rentalPricePerWeek || !rentalPricePerMonth) {
            return res.status(400).json({
                message: "All fields are required.."
            })
        }
        const productData = await Product.create(req.body)
        return res.status(200).json({
            message: "Product added successfully..!",
            data: productData
        })

    } catch (err) {
        //Handling error
        return res.status(500).json({
            error: err
        })
    }

}

// Fetch all products by type
module.exports.getAllProducts = async (req, res) => {
    try {
        const allGames = await Product.find({ productType: 'game' }).select({
            title: 1,
            thumbnailURL: 1,
            sellerUsername: 1,
            unitsAvailable: 1,
            productType: 1,
            rentalPricePerWeek: 1,
            rentalPricePerMonth: 1,
            _id: 0
        });
        const allControllers = await Product.find({ productType: 'controller' }).select({
            title: 1,
            thumbnailURL: 1,
            sellerUsername: 1,
            unitsAvailable: 1,
            productType: 1,
            rentalPricePerWeek: 1,
            rentalPricePerMonth: 1,
            _id: 0
        });
        const allConsoles = await Product.find({ productType: 'console' }).select({
            title: 1,
            thumbnailURL: 1,
            sellerUsername: 1,
            unitsAvailable: 1,
            productType: 1,
            rentalPricePerWeek: 1,
            rentalPricePerMonth: 1,
            _id: 0
        });
        const allProducts = {
            games: allGames,
            controllers: allControllers,
            consoles: allConsoles,
        };

        return res.status(200).json(allProducts);

    } catch (err) {
        console.log(err);
    }
}

module.exports.productDetails = async (req, res) => {
    try {
        const productId = req.params._id;
        console.log(productId);
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: 'Invalid ObjectId'
            });
        }

        const productDetails = await Product.findOne({ _id: productId }).select({
            title: 1,
            thumbnailURL: 1,
            sellerUsername: 1,
            unitsAvailable: 1,
            productType: 1,
            productImages: 1,
            rentalPricePerWeek: 1,
            rentalPricePerMonth: 1,
            _id: 1
        });

        if (!productDetails) {
            return res.status(404).json({
                message: "Product Not Found"
            });
        }

        return res.status(200).json(productDetails);

    } catch (err) {
        console.log(err);
    }
}

module.exports.updataProduct = async (req, res) => {
    try {
        console.log(req.params._id)
        const checkProduct = await Product.findById(req.params._id);
        if (!checkProduct) {
            return res.status(400).json({
                message: "Product not found"
            })
        }
        const updateProduct = await Product.findByIdAndUpdate(
            { _id: req.params._id }
            ,
            req.body, {
            new: true
        }
        )

        return res.status(200).json({
            message: "Product Details updated successfully..",
            data: updateProduct
        })

    } catch (err) {
        //Handling error
        return res.status(500).json({
            message: "Internal Server Error..!"
        })
    }
}