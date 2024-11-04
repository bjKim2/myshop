const Cart = require('../models/Cart');

const Product = require('../models/Product');
const cartController = {}

cartController.addItemToCart = async (req, res) => {
    try{
        const {userId} = req;
        const {productId,size,qty} = req.body;
        // 유저를 가지고 카트를 찾기
        let cart = await Cart.findOne({userId})
        
        // 유저가 만든 카트가 없다, 새로운 카트를 만듬
        if(!cart){
            cart = new Cart({userId})
            await cart.save()
        }

        // 이미 카트에 아이템이 있으면 에러("이미 아이템이 카트에 있습니다.")
        const existItem = cart.items.find((item) => item.productId.equals(productId) && item.size === size) // productId 는 mongoose objectId 이므로 equals를 사용
        if(existItem){
            return res.status(200).json({status:"success", data :cart, cartItemQty: cart.items.length ,message: "이미 아이템이 카트에 있습니다."})
        }
        // 카트에 아이템을 추가
        cart.items = [...cart.items, {productId,size,qty}]
         await cart.save()
         res.status(200).json({status:"success",data : cart,cartItemQty: cart.items.length})
        // const cart = new Cart({userId,items:[{productId,size,qty}]})

    }catch(error){
        res.status(400).json({status:"fail",error:error.message});
    }
}

cartController.getCartList = async (req,res) =>{ 
    try{
        const {userId} = req;
        const cart = await Cart.findOne({userId}).populate("items.productId"); // populate를 사용해서 items.productId를 통해 product 정보를 가져옴
        // const cart = await Cart.findOne({userId}).populate({
        //     path:"items",
        //     populate:{
        //         path: "productId",
        //         model : "Product"
        //     },
        // }); // populate를 사용해서 items.productId를 통해 product 정보를 가져옴
        res.status(200).json({status:"success",data:cart.items});
    }catch(error){
        res.status(400).json({status:"fail",error:error.message});
    }
}

cartController.updateCartItem = async (req,res) =>{
    try{
        const {userId} = req;
        const {cartItemId,qty} = req.body;

        // 카트 찾고 카트 안에 아이템 찾기
        const cart = await Cart.findOne({userId});
        const selectedItem = cart.items.find(item => item._id.equals(cartItemId))
        
        // 재고 찾기
        const product = await Product.findById(selectedItem.productId);
        if(!product) throw new Error("상품이 존재하지 않습니다."); 
        // 바꾸려는 qty가 재고보다 많으면 에러("현재 해당 사이즈 재고는 ${product.stock[selectedItem.size]}개 입니다. 최대 개수로 자동 조정됩니다.")
        if(product.stock[selectedItem.size] < qty) {
            const temp_error = new Error(`현재 해당 사이즈 재고는 ${product.stock[selectedItem.size]}개 입니다.`);
            temp_error.data = {listId : cartItemId, qty :product.stock[selectedItem.size]};
            throw  temp_error;
        }

        cart.items.map((item) => {
            if(item.productId === (selectedItem.productId) && item.size === selectedItem.size){
                item.qty = qty;
            }
        })
        
        await cart.save();
        const temp_cart = await cart.populate("items.productId");
        res.status(200).json({status:"success",data:temp_cart.items});
    }catch(error){
        res.status(400).json({status:"fail",data: error.data || null,error:error.message});
    }
}

cartController.deleteCartItem = async (req,res) =>{
    try{
        const {userId} = req;
        const {cartItemId} = req.body;
        const cart = await Cart.findOne({userId});
        cart.items = cart.items.filter(item => !item._id.equals(cartItemId));
        await cart.save();  
        res.status(200).json({status:"success",data:cart.items});
    }catch(error){
        res.status(400).json({status:"fail",error:error.message});
    }
}

cartController.getCartQty = async (req,res) =>{
    try{
        const {userId} = req;
        const cart = await Cart.findOne({userId});
        !cart ? res.status(200).json({status:"success",data:0}) :
        res.status(200).json({status:"success",data:cart.items.length});
    }catch(error){
        res.status(400).json({status:"fail",error:error.message});
    }
}

module.exports = cartController;