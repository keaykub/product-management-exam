const { Product, Category } = require('../models');
const { validationResult } = require('express-validator');

const productController = {
  // GET /api/v1/products - ดึงรายการสินค้าทั้งหมดแบบ pagination
  getProducts: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', categoryId = '' } = req.query;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // Build filter
      let filter = {};
      
      // Search filter (RegEx)
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      // Category filter
      if (categoryId) {
        filter.categoryId = categoryId;
      }

      // Get products with pagination and populate category
      const products = await Product.find(filter)
        .populate('categoryId', 'name isActive')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      const totalItems = await Product.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / limitNum);

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalItems,
            itemsPerPage: limitNum,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching products',
        error: error.message
      });
    }
  },

  // GET /api/v1/product/:id - ดึงข้อมูลสินค้า
  getProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.findById(id).populate('categoryId', 'name description isActive');

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching product',
        error: error.message
      });
    }
  },

  // POST /api/v1/product - เพิ่มสินค้าใหม่
  createProduct: async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { name, description, price, stock, categoryId, isActive = true, tags = [] } = req.body;

      // Validate category exists and is active
      const category = await Category.findById(categoryId);
      if (!category || !category.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Category not found or is inactive'
        });
      }

      const product = new Product({
        name,
        description,
        price,
        stock,
        categoryId,
        isActive,
        tags
      });

      const savedProduct = await product.save();

      // Populate category before returning
      await savedProduct.populate('categoryId', 'name description');

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: savedProduct
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating product',
        error: error.message
      });
    }
  },

  // PUT /api/v1/product/:id - แก้ไขข้อมูลสินค้า
  updateProduct: async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { name, description, price, stock, categoryId, isActive, tags } = req.body;

      // Validate category exists and is active if categoryId is provided
      if (categoryId) {
        const category = await Category.findById(categoryId);
        if (!category || !category.isActive) {
          return res.status(400).json({
            success: false,
            message: 'Category not found or is inactive'
          });
        }
      }

      const product = await Product.findByIdAndUpdate(
        id,
        { name, description, price, stock, categoryId, isActive, tags },
        { new: true, runValidators: true }
      ).populate('categoryId', 'name description');

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating product',
        error: error.message
      });
    }
  },

  // DELETE /api/v1/product/:id - ลบสินค้า
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { permanent = false } = req.query;

      let product;
      
      if (permanent === 'true') {
        // Hard delete
        product = await Product.findByIdAndDelete(id);
      } else {
        // Soft delete - set isActive to false
        product = await Product.findByIdAndUpdate(
          id,
          { isActive: false },
          { new: true }
        );
      }

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        message: permanent === 'true' ? 'Product deleted permanently' : 'Product deactivated successfully',
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting product',
        error: error.message
      });
    }
  }
};

module.exports = productController;