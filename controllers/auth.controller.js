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
        if (!res.headersSent) {
            res.status(400).json({status:"fail", error:err.message})
        }
    }
} 

authController.authenticate = async (req,res,next) =>{
    try{
        const tokenString = req.headers.authorization;
        if(!tokenString) throw new Error("token not found");
        const token = tokenString.replace("Bearer ","");

        jwt.verify(token,JWT_SECRET,(err,payload)=>{
            // if(err) throw new Error("token is invalid");
            if (err) {
                if (err.name === "TokenExpiredError") {
                    throw new Error("Token has expired");  // 만료된 토큰
                } else if (err.name === "JsonWebTokenError") {
                    throw new Error("Token is invalid");  // 잘못된 토큰
                } else {
                    throw new Error("Token verification failed"); // 기타 오류 
                }
            }
            req.userId = payload._id;
        })
        next();
    }catch(error){
        if (!res.headersSent) {
            res.status(400).json({status:400, error:error.message})
        }        
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
        if (!res.headersSent) {
            res.status(400).json({status:400, error:error.message})
        }
    }
}

module.exports = authController;