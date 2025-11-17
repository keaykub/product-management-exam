const { Category } = require('../models');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const categoryController = {
  // GET /api/v1/categories - ดึงรายการหมวดหมู่ทั้งหมด
  getCategories: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', active } = req.query;
      
      const query = {};
      
      // Filter by search term
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Filter by active status
      if (active !== undefined) {
        query.isActive = active === 'true';
      }
      
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: {
          path: 'productCount',
          select: 'name'
        }
      };
      
      const categories = await Category.aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'categoryId',
            as: 'products',
            pipeline: [
              { $match: { isActive: true } }
            ]
          }
        },
        {
          $addFields: {
            productCount: { $size: '$products' }
          }
        },
        {
          $project: {
            products: 0 // ไม่ต้องส่งข้อมูลสินค้าทั้งหมด
          }
        },
        { $sort: options.sort },
        { $skip: (options.page - 1) * options.limit },
        { $limit: options.limit }
      ]);
      
      const total = await Category.countDocuments(query);
      
      res.json({
        success: true,
        data: categories,
        pagination: {
          page: options.page,
          limit: options.limit,
          total,
          pages: Math.ceil(total / options.limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching categories',
        error: error.message
      });
    }
  },

  // GET /api/v1/category/:id - ดึงข้อมูลหมวดหมู่ตาม ID
  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const categoryWithCount = await Category.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'categoryId',
            as: 'products',
            pipeline: [
              { $match: { isActive: true } }
            ]
          }
        },
        {
          $addFields: {
            productCount: { $size: '$products' }
          }
        },
        {
          $project: {
            products: 0 // ไม่ต้องส่งข้อมูลสินค้าทั้งหมด
          }
        }
      ]);
      
      if (!categoryWithCount || categoryWithCount.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      
      const category = categoryWithCount[0];
      
      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching category',
        error: error.message
      });
    }
  },

  // POST /api/v1/category - เพิ่มหมวดหมู่ใหม่
  createCategory: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { name, description } = req.body;

      const category = new Category({
        name,
        description
      });

      const savedCategory = await category.save();

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: savedCategory
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Category name already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error creating category',
        error: error.message
      });
    }
  },

  // PUT /api/v1/category/:id - แก้ไขข้อมูลหมวดหมู่
  updateCategory: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { name, description, isActive } = req.body;

      const category = await Category.findByIdAndUpdate(
        id,
        { name, description, isActive },
        { new: true, runValidators: true }
      );

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.json({
        success: true,
        message: 'Category updated successfully',
        data: category
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Category name already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error updating category',
        error: error.message
      });
    }
  },

  // DELETE /api/v1/category/:id - ลบหมวดหมู่
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { permanent = false } = req.query;

      // ตรวจสอบว่ามีสินค้าในหมวดหมู่นี้หรือไม่
      const { Product } = require('../models');
      const productCount = await Product.countDocuments({ 
        categoryId: id, 
        isActive: true 
      });

      if (productCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete category. ${productCount} products are still assigned to this category.`
        });
      }

      let category;
      
      if (permanent === 'true') {
        // Hard delete
        category = await Category.findByIdAndDelete(id);
      } else {
        // Soft delete
        category = await Category.findByIdAndUpdate(
          id,
          { isActive: false },
          { new: true }
        );
      }

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.json({
        success: true,
        message: permanent === 'true' ? 'Category deleted permanently' : 'Category deactivated successfully',
        data: category
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting category',
        error: error.message
      });
    }
  }
};

module.exports = categoryController;