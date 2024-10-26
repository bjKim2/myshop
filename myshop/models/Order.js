const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const orderSchema = Schema({
    shipTo : {type:String, required:true},
    contact : {type:String, required:true},
    userId : {type:mongoose.ObjectId, ref:User},
    items : [{
        productId : {type:mongoose.ObjectId, ref:Product},
        qty : {type:Number, default:1, required:true},
        size : {type:String ,required:true},
        price : {type:Number, required:true},
    }]


},{timestamps:true});

orderSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.password;
    delete obj.__v;
    delete obj.updateAt;
    delete obj.createAt;
    return obj;
}

const Order = mongoose.model("Order",orderSchema);

module.exports = Order;

