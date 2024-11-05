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

// productController.checkStock = async (item) => {
//     const product = await Product.findById(item.productId);
//     // 내가 사려는 아이템 qty, 재고 비교

//     if (item.qty > product.stock[item.size]) {
//         return { isVerify: false, message: `${product.name}의 ${item.size} 재고가 부족합니다.` };
//     }

//     return { isVerify: true, product: product, size: item.size, qty: item.qty };
// }

productController.checkItemListStock = async (itemList) => {
    const insufficientStockItems = [];
    const stockUpdates = [];
    
    // 모든 아이템의 재고를 먼저 확인
    for (const item of itemList) {
        // const stockCheck = await productController.checkStock(item);
        const product = await Product.findById(item.productId);
        if (item.qty > product.stock[item.size]) {
            insufficientStockItems.push(`${product.name}의 ${item.size} 재고가 부족합니다.`);
        }else {
            // 재고가 충분한 경우, Product 인스턴스를 저장
            stockUpdates.push({ product: product, size: item.size, qty: item.qty });
        }
    }

    // 재고가 부족한 물품이 있는 경우, 부족한 물품 리스트 반환
    if (insufficientStockItems.length === 0) {
        // 모든 물품의 재고가 충분한 경우에만 재고 업데이트
        await Promise.all(
            stockUpdates.map(async update => {
                update.product.stock[update.size] -= update.qty;
                update.product.markModified('stock'); 
                await update.product.save();
            })
        );
    }

    return insufficientStockItems;
}

module.exports = productController;