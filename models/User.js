const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const userSchema = Schema({
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    name:{type:String,required:true},
    level:{type:String,default:"customer"}, // 2type : customer,admin

},{timestamps:true});
userSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.password;
    delete obj.__v;
    delete obj.updateAt;
    delete obj.createAt;
    return obj;
}
// const token = jwt.sign({_id:this.id} , JWT_SECRET_KEY,{expiresIn:'1d'});
userSchema.methods.generateToken = function () {
    // this.id 는 ObjectId 속의 문자열 값이고 ObjectId 값을 사용하고 싶다면 this._id로 사용해야 한다.
    const token = jwt.sign({_id:this.id}, JWT_SECRET_KEY,{expiresIn:'3h'});
    return token
}
const User = mongoose.model("User",userSchema);

module.exports = User;

