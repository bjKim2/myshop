const productController = {};
const Product = require('../models/Product');

PAGE_SIZE = 3;

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
        const {page,name} = req.query;
        const cond = name?{name:{$regex:name,$options:"i"}}:{};
        let query = Product.find(cond);
        let response = {status:"success"};
        
        if(page){
            query.skip((page-1)* PAGE_SIZE).limit(PAGE_SIZE);
            // 최종 몇개 페이지인지
            // 데이터 총 개수 / PAGE_SIZE
            const totalItemNum = await Product.countDocuments(cond); // 데이터 총 개수만 리턴 count는
            const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
            response.totalPageNum = totalPageNum;
        }
        const productList = await query.exec();
        response.data = productList;
        res.status(200).json(response);
    }catch(error){
        if (!res.headersSent) {
            res.status(400).json({status:400,error:error.message});
        }
    }
}

productController.getProductDetail = async (req,res) =>{
    try{
        const {id} = req.params;
        const product = await Product.findById(id);
        if(!product) throw new Error("Product not found");
        return res.status(200).json({status:"success",data:product});

    }catch(error){
        return res.status(400).json({status:"fail",error:error.message});
    }
}

productController.updateProduct = async (req,res) =>{
    try{
        const {id} = req.params;
        const {sku,name,size,image,category,description,price,stock,status} = req.body;
        const product = await Product.findByIdAndUpdate(id,{sku,name,size,image,category,description,price,stock,status});
        // console.log("id : ",id);
        if(!product){
            console.log("Product not found");
            throw new Error("Product not found");
        }
        return res.status(200).json({status:"success",data:product});
        
    }catch(error){
        res.status(400).json({status:"fail",error:error.message});
    }
}

productController.deleteProduct = async (req,res) =>{
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product) throw new Error("Product not found");
        return res.status(200).json({status:"success",data:product});

    }catch(error){
        res.status(400).json({status:"fail",error:error.message});
    }
}

module.exports = productController;