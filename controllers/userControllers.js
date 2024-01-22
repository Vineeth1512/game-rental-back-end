const User = require("../models/user.model")
module.exports.register = async (req, res) => {
    try {
        const { userName, email, password, firstName, lastName, contactNumber, userType } = req.body;
        const user = await User.findOne({ email });
        //Checking if user already exists
        if (user) {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        //Checking if all fields are present
        if (!userName || !email || !password || !firstName || !lastName || !contactNumber || !userType) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        //Check if the user is a seller and has a valid email domain
        const isSeller = userType.toLowerCase() === 'seller';
        const isValidEmail = email.toLowerCase().endsWith('@admin.com');
        console.log('isSeller:', isSeller);
        console.log('isValidEmail:', isValidEmail);
        if (!isSeller && isValidEmail) {
            return res.status(400).json({
                message: `Sellers can only register with an email address ending with @admin.com`
            });
        }

        const newUser = new User({
            userName,
            email,
            password,
            firstName,
            lastName,
            contactNumber,
            userType
        });
        await newUser.save();
        return res.status(200).json({
            status: 200,
            data: {
                userId: newUser._id,
                userName: newUser.userName,
                password: newUser.password,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                contactNumber: newUser.contactNumber,
                userType: newUser.userType,
            }
        })

    } catch (err) {
        console.log(err);
    }

}

module.exports.login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        
        const user = await User.findOne({ userName, password });

        if (user) {
            res.status(200).json({ userId: user._id, message: 'Login Successful' });
        } else {
            res.status(400).json({ message: 'Invalid Login Credentials' });
        }

    } catch (err) {
        console.log(err);
    }

}
module.exports.userDatails = async(req, res)=>{
    try {
        const userName = req.params.userName;
        const userDetails = await User.findOne({ userName: userName }).select({
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            contactNumber: 1,
            userType: 1,
            
        });

        if (!userDetails) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        return res.status(200).json(userDetails);

    } catch (err) {
        console.log(err);
    }
}
module.exports.updateUser=async(req,res)=>{
    try {
        console.log(req.params._id)
        const checkUser = await User.findById(req.params._id);
        if (!checkUser) {
            return res.status(400).json({
                message: "User not found"
            })
        }
        const updateProduct = await User.findByIdAndUpdate(
            { _id: req.params._id }
            ,
            req.body, {
            new: true
        }
        )

        return res.status(200).json({
            message: "User Details updated successfully..",
            data: updateProduct
        })

    } catch (err) {
        //Handling error
        return res.status(500).json({
            message: "Internal Server Error..!"
        })
    }
}