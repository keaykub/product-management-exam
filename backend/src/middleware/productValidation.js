const { body, param } = require('express-validator');
const mongoose = require('mongoose');

const productValidation = {
  // Validate ObjectId format
  validateObjectId: [
    param('id')
      .isMongoId()
      .withMessage('Invalid product ID format')
  ],

  // Validation for creating product
  createProduct: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Product name is required')
      .isLength({ min: 1, max: 100 })
      .withMessage('Product name must be between 1 and 100 characters'),

    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),

    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number')
      .notEmpty()
      .withMessage('Price is required'),

    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer')
      .notEmpty()
      .withMessage('Stock is required'),

    body('categoryId')
      .isMongoId()
      .withMessage('Invalid category ID format')
      .notEmpty()
      .withMessage('Category ID is required'),

    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),

    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),

    body('tags.*')
      .optional()
      .trim()
      .isLength({ min: 1, max: 30 })
      .withMessage('Each tag must be between 1 and 30 characters')
  ],

  // Validation for updating product
  updateProduct: [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Product name cannot be empty')
      .isLength({ min: 1, max: 100 })
      .withMessage('Product name must be between 1 and 100 characters'),

    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),

    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),

    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),

    body('categoryId')
      .optional()
      .isMongoId()
      .withMessage('Invalid category ID format'),

    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),

    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),

    body('tags.*')
      .optional()
      .trim()
      .isLength({ min: 1, max: 30 })
      .withMessage('Each tag must be between 1 and 30 characters')
  ]
};

module.exports = productValidation;