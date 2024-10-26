const authController = {}
const User = require('../models/User');
const bcrypt = require('bcryptjs');

authController.loginWithEmail = async (req,res) =>{
    try{
        let {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.")
        }
        isMatch = bcrypt.compareSync(password,user.password)
        if (!isMatch){
            throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.")
        }
        token = user.generateToken();
        // return res.status(200).json({status:200, message:"login success", user, token})
        return res.status(200).json({status:"success", user, token})

    }catch(err){
        // res.status(400).json({status:400 , error:err.message})
        res.status(400).json({status:"fail", error:err.message})
    }
}

module.exports = authController;