const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

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
    const token = jwt.sign({_id:this.id}, JWT_SECRET_KEY,{expiresIn:'1d'});
    return token
}
const User = mongoose.model("User",userSchema);

module.exports = User;

