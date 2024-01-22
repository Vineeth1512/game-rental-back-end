const express = require("express");
const mongoose = require("mongoose");
const app = express();
const portNo =3002;

const databaseUrl =require("./utils/database")
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes")
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(userRoutes);
app.use(productRoutes);

mongoose.connect(databaseUrl).then(() => {
    console.log("Connected to mongodb");
    app.listen(portNo, () => {
        console.log(`server is started on port no ${portNo}`);
    })
}).catch((err) => {
    console.log(err);
})
