const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const productValidation = require('../middleware/productValidation');

// GET /api/v1/products - ดึงรายการสินค้าทั้งหมดแบบ pagination
router.get('/', productController.getProducts);

// GET /api/v1/product/:id - ดึงข้อมูลสินค้า
router.get('/:id', 
  productValidation.validateObjectId,
  productController.getProduct
);

// POST /api/v1/product - เพิ่มสินค้าใหม่
router.post('/', 
  productValidation.createProduct,
  productController.createProduct
);

// PUT /api/v1/product/:id - แก้ไขข้อมูลสินค้า
router.put('/:id', 
  productValidation.validateObjectId,
  productValidation.updateProduct,
  productController.updateProduct
);

// DELETE /api/v1/product/:id - ลบสินค้า (soft delete หรือ hard delete)
router.delete('/:id', 
  productValidation.validateObjectId,
  productController.deleteProduct
);

module.exports = router;