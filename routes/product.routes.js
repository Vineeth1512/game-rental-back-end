const express = require("express");
const router =express.Router();
const productController =require("../controllers/productController")
const wishlistController = require("../controllers/wishlistController");
const cartController =require("../controllers/cartController");


router.post("/product",productController.createProduct);
router.get("/allProducts",productController.getAllProducts);
router.get('/product/:_id', productController.productDetails);
router.put('/product/:_id',productController.updataProduct);
router.put("/wishlist",wishlistController.saveRemoveFromWishlist);
router.put("/cart", cartController.addRemoveFromCart);
router.post("/placeOrder",cartController.placeOrder);
module.exports =router;
