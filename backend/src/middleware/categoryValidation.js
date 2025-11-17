const { body, param, query } = require('express-validator');

const categoryValidation = {
  // Validation สำหรับสร้างหมวดหมู่ใหม่
  createCategory: [
    body('name')
      .notEmpty()
      .withMessage('Category name is required')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Category name must be between 2-50 characters')
      .matches(/^[a-zA-Zก-๙\s\-\_\.]+$/)
      .withMessage('Category name can only contain letters, numbers, spaces, hyphens, underscores, and dots'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Description cannot exceed 200 characters')
  ],

  // Validation สำหรับแก้ไขหมวดหมู่
  updateCategory: [
    param('id')
      .isMongoId()
      .withMessage('Invalid category ID'),
    
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Category name must be between 2-50 characters')
      .matches(/^[a-zA-Zก-๙\s\-\_\.]+$/)
      .withMessage('Category name can only contain letters, numbers, spaces, hyphens, underscores, and dots'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Description cannot exceed 200 characters'),
    
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean value')
  ],

  // Validation สำหรับดึงข้อมูลหมวดหมู่ตาม ID
  getCategoryById: [
    param('id')
      .isMongoId()
      .withMessage('Invalid category ID')
  ],

  // Validation สำหรับลบหมวดหมู่
  deleteCategory: [
    param('id')
      .isMongoId()
      .withMessage('Invalid category ID'),
    
    query('permanent')
      .optional()
      .isIn(['true', 'false'])
      .withMessage('Permanent must be true or false')
  ],

  // Validation สำหรับดึงรายการหมวดหมู่
  getCategories: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1-100'),
    
    query('search')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Search term cannot exceed 100 characters'),
    
    query('active')
      .optional()
      .isIn(['true', 'false'])
      .withMessage('Active filter must be true or false')
  ]
};

module.exports = categoryValidation;