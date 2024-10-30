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
        if (!res.headersSent) {
            res.status(400).json({status:400, error:error.message});
        }
    }
}

userController.getUser = async (req,res) =>{
    try{
        const {userId} = req;
        const user = await User.findById(userId);
        if(user){
            return res.status(200).json({status:200, user});
        }
        throw new Error("Invalid token!");
        
    }catch(error){
        res.status(400).json({status:400, error:error.message});
    }
}

// userController.loginWithEmail = async (req,res) =>{
//     try{
//         let {email,password} = req.body;
//         const user = await User.findOne({email});
//         if(!user){
//             throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
//         }
//         const isMatch = bcrypt.compareSync(password,user.password);
//         if (!isMatch){
//             throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
//         }
//         token = user.generateToken();
//         return res.status(200).json({status:200, message:"login success", user, token});

//     }catch(err){
//         res.status(400).json({status:400 , error:err.message})
//     }
// }

module.exports = userController;