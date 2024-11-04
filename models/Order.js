const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const Product = require('./Product');`
`
const orderSchema = Schema({
    totalPrice : {type:Number, required:true},
    shipTo : {type:Object, required:true},
    contact : {type:Object, required:true},
    userId : {type:mongoose.ObjectId, ref:User},
    items : [{
        productId : {type:mongoose.ObjectId, ref:Product},
        qty : {type:Number, default:1, required:true},
        size : {type:String ,required:true},
        price : {type:Number, required:true},
    }],
    orderNum : {type:String, required:true},
},{timestamps:true});

orderSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.password;
    delete obj.__v; 
    delete obj.updateAt;
    delete obj.createAt;
    return obj;
}

// orderSchema.post("save", async function(){
//     // 카트를 비워주자

// });

const Order = mongoose.model("Order",orderSchema);

module.exports = Order;

