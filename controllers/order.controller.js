const orderController = {};
const Order = require("../models/Order");
const productController = require("./product.controller");
const {randomStringGenerator} = require("../utils/randomStringGenerator");
// shipTo : {type:String, required:true},
// contact : {type:String, required:true},
// userId : {type:mongoose.ObjectId, ref:User},
// items : [{
//     productId : {type:mongoose.ObjectId, ref:Product},
//     qty : {type:Number, default:1, required:true},
//     size : {type:String ,required:true},
//     price : {type:Number, required:true},
// }]

orderController.createOrder = async (req,res,next)=>{
    try {
        const {userId} = req;
        const {totalPrice,shipInfo,contact,orderList} = req.body;
        //재고 확인 & 업데이트
        const insufficientStockItems = await productController.checkItemListStock(orderList);
        //재고가 충분하지 않는 아이템이 있었다 => 에러
        if(insufficientStockItems.length > 0){
            const errorMessage  = insufficientStockItems.reduce((total,item) => (total += item) , "");
            throw new Error(errorMessage);
        }

        const order = new Order({totalPrice,shipTo:shipInfo,contact:contact,userId,items:orderList , orderNum:randomStringGenerator()});
        await order.save();
        // save 후에 카트 비우기
        
        res.status(200).json({status:"success",orderNum:order.orderNum});
    } catch (error) {
        res.status(400).json({status:"fail",message:error.message});
    }
}

module.exports = orderController;