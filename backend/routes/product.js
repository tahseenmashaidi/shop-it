const express = require('express');
const router=express.Router();

const {
    getProducts,
    getSingleProduct,
    updateProduct,
    newProduct,
    deleteProduct
}=require('../controllers/productController');

const {isAuthenticatedUser,authorizeRoles}=require('../middlerwares/auth')

router.route('/products').get(isAuthenticatedUser,authorizeRoles('admin'),getProducts);
router.route('/product/:id').get(getSingleProduct)

router.route('/admin/product/new').post(isAuthenticatedUser,newProduct);
router.route('/admin/product/:id').put(isAuthenticatedUser,updateProduct).delete(isAuthenticatedUser,deleteProduct);

module.exports =router;
