const express = require("express");
const router =express.Router();
const userController = require("../controllers/userControllers");
router.post("/register",userController.register);
router.post("/login",userController.login);
router.get("/user/:userName",userController.userDatails);
router.put("/user/:_id",userController.updateUser);

module.exports =router;
