const userController ={}
const bcrypt = require('bcryptjs');
const User = require('../models/User');

userController.createUser = async (req, res) => {
    try{
        let {name,email,password,level}  = req.body;
        const user = await User.findOne({email});
        if(user){
            throw new Error("User already exists");
        }
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password,salt);
        const newUser = new User({name,email,password,level:level || "customer"});
        await newUser.save();
        return res.status(200).json({status:200,message:"User created successfully"});  
    }catch(err){
        res.status(400).json({status:400, error:err.message});
    }
}

module.exports = userController;