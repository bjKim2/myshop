const authController = {}
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const JWT_SECRET = process.env.JWT_SECRET_KEY;
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

authController.authenticate = async (req,res,next) =>{
    try{
        const tokenString = req.headers.authorization;
        if(!tokenString) throw new Error("token not found");
        const token = tokenString.replace("Bearer ","");
        console.log(token)
        console.log(JWT_SECRET)
        jwt.verify(token,JWT_SECRET,(err,payload)=>{
            if(err) throw new Error("token is invalid")
            req.userId = payload._id;
        })
        next();
    }catch(error){
        res.status(400).json({status:400, error:error.message})
    }
}

authController.checkAdminPermission = async (req,res,next) =>{
    try{
        //token 
        const {userId} = req;
        const user = await User.findById(userId);
        if(user.level !== "admin") throw new Error("관리자 권한이 없습니다.")
        next();
    }catch(error){
        res.status(400).json({status:400, error:error.message})
    }
}

module.exports = authController;