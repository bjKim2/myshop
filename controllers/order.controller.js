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

PAGE_SIZE =3;

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

orderController.getOrderList = async (req,res) => {
    try {
        const {userId} = req;
        const orderList = await Order.find({userId}).populate(["userId","items.productId"]).sort({createdAt:-1});
        // const orderWithProduct = await Order.populate(orderList,"items.productId");
        // Order 의 외래키 정보인 productId 와  userId 로 동시에 정보 추가하기 
        return res.status(200).json({status:"success",data:orderList});
        
    } catch (error) {
        res.status(400).json({status:"fail",message:error.message});
    }
}

orderController.adminGetOrderList = async (req,res) => {
    try {
        //const response = await api.get("/order/list", {params: query}) 에 대한 응답;
        const {page,ordernum} = req.query;
        const orderNum = ordernum;

        if (orderNum){
            const cond = { orderNum: {$regex:orderNum,$options:"i"}};
            const orderList = await Order.find(cond).populate(["userId","items.productId"]).sort({createdAt:-1});
            const totalItemNum = await Order.countDocuments({cond}); 
            const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
            return res.status(200).json({status:"success",totalPageNum:1,data:orderList});
        }
        if(!page) throw new Error("page 가 없습니다.");
                

        const orderList = await Order.find({}).populate(["userId","items.productId"]).sort({createdAt:-1}).skip((page-1)*PAGE_SIZE).limit(PAGE_SIZE);
        const totalItemNum = await Order.countDocuments({});
        const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
        return res.status(200).json({status:"success",totalPageNum,data:orderList});
    } catch (error) {
        res.status(400).json({status:"fail",message:error.message});
    }
}

orderController.adminUpdateOrder = async (req,res) => {
    try {
        const {orderId} = req.params;
        const {status} = req.body;
        const order = await Order.findById(orderId);
        if(!order) throw new Error("주문 정보가 없습니다.");
        order.status = status;
        await order.save();

        return res.status(200).json({status:"success",data:order});
    } catch (error) {
        res.status(400).json({status:"fail",message:error.message});
    }
}

module.exports = orderController;