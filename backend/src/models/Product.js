const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(value) {
        return Number.isFinite(value) && value >= 0;
      },
      message: 'Price must be a valid positive number'
    }
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Stock must be a whole number'
    }
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
    validate: {
      validator: async function(categoryId) {
        const Category = mongoose.model('Category');
        const category = await Category.findById(categoryId);
        return category && category.isActive;
      },
      message: 'Category does not exist or is inactive'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual: สถานะ stock
productSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'Out of Stock';
  if (this.stock <= 10) return 'Low Stock';
  return 'In Stock';
});

// Virtual: formatted price
productSchema.virtual('formattedPrice').get(function() {
  return `฿${this.price.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
});

// Indexes สำหรับการค้นหา
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ categoryId: 1 });
productSchema.index({ price: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ isActive: 1 });

// Static methods
productSchema.statics.findActive = function() {
  return this.find({ isActive: true }).populate('categoryId', 'name');
};

productSchema.statics.findByCategory = function(categoryId) {
  return this.find({ categoryId, isActive: true }).populate('categoryId', 'name');
};

productSchema.statics.searchProducts = function(searchTerm) {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { tags: { $in: [new RegExp(searchTerm, 'i')] } }
        ]
      }
    ]
  }).populate('categoryId', 'name');
};

productSchema.statics.findLowStock = function(threshold = 10) {
  return this.find({
    isActive: true,
    stock: { $lte: threshold }
  }).populate('categoryId', 'name');
};

module.exports = mongoose.model('Product', productSchema);