const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = Schema({
    sku : {type:String, required:true, unique:true},
    name : {type:String, required:true},
    image : {type:String, required:true}, // 이미지 주소
    category : {type:Array , required:true}, // 카테고리 여러개 선택할 수있음
    description : {type:String, required:true},
    price : {type:Number, required:true},
    stock : {type:Object, required:true}, // 사이즈별 재고
    status : {type:String, default:"active"}, // active, inactive
    isDeleted : {type:Boolean, default:false},
},{timestamps:true});

productSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.password;
    delete obj.__v;
    delete obj.updateAt;
    delete obj.createAt;
    return obj;
}

const Product = mongoose.model("Product",productSchema);

module.exports = Product;

