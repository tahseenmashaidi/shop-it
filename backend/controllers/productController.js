const Product = require('../models/product')
const ErrorHandler=require('../utils/errorHandler')
const catchAsyncErrors= require('../middlerwares/catchAsyncErrors')

// create new product => /api/v1/admin/product/new
exports.newProduct =catchAsyncErrors( async (req,res,next) => {
    const product =await  Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
})

// get all product => /api/v2/products
exports.getProducts=catchAsyncErrors( async (req, res,next)=>{
    const products=await Product.find();
    if (!products){
        return next(new ErrorHandler('Products not found',404));
    }
    res.status(200).json({
        success: true,
        count:products.length,
        products
    })
})

// get single product details => /api/v1/product/:id

exports.getSingleProduct=catchAsyncErrors(async (req, res, next)=>{
    const product=await Product.findById(req.params.id)
    if (!product){
        return next(new ErrorHandler('Product not found',404));
    }
    res.status(200).json({
        success: true,
        product
    })
})

//update product => /api/v1/admin/product/:id

exports.updateProduct=catchAsyncErrors(async (req, res, next)=>{
    let product=await Product.findById(req.params.id);
    if (!product){
        return next(new ErrorHandler('Product not found',404));
    }
    product =await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:true
    });
    res.status(200).json({
        success: true,
        product
    })
})

// Delete Product => /api/v1/admin/product/:id
exports.deleteProduct=catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if (!product){
        return next(new ErrorHandler('Product not found',404))
    }
    await product.remove();
    res.status(200).json({
        success: true,
        message:"Product Deleted"
    })
})
