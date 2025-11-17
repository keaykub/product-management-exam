const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const categoryValidation = require('../middleware/categoryValidation');

// GET /api/v1/categories - ดึงรายการหมวดหมู่ทั้งหมด (พร้อม pagination)
router.get('/', 
  categoryValidation.getCategories,
  categoryController.getCategories
);

// GET /api/v1/category/:id - ดึงข้อมูลหมวดหมู่ตาม ID
router.get('/:id', 
  categoryValidation.getCategoryById,
  categoryController.getCategoryById
);

// POST /api/v1/category - เพิ่มหมวดหมู่ใหม่
router.post('/', 
  categoryValidation.createCategory,
  categoryController.createCategory
);

// PUT /api/v1/category/:id - แก้ไขข้อมูลหมวดหมู่
router.put('/:id', 
  categoryValidation.updateCategory,
  categoryController.updateCategory
);

// DELETE /api/v1/category/:id - ลบหมวดหมู่ (soft delete หรือ hard delete)
router.delete('/:id', 
  categoryValidation.deleteCategory,
  categoryController.deleteCategory
);

module.exports = router;