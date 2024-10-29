const productController = {};
const Product = require('../models/Product');

productController.createProduct = async(req,res) =>{
    try{
        const {sku,name,size,image,category,description,price,stock,status} = req.body;
        const product = new Product({sku,name,size,image,category,description,price,stock,status});
        await product.save();
        res.status(200).json({status:200,message:"Product created successfully"});
    }catch(error){
        res.status(400).json({status:400,error:error.message});
    }
}

productController.getProducts = async(req,res) =>{
    try{
        const products = await Product.find({isDeleted:false});
        res.status(200).json({status:200,data:products});
    }catch(error){
        res.status(400).json({status:400,error:error.message});
    }
}

module.exports = productController;