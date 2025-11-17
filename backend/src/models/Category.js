const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters'],
    unique: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true, // จะสร้าง createdAt และ updatedAt อัตโนมัติ
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field: นับจำนวนสินค้าในหมวดหมู่
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'categoryId',
  count: true
});

// Index สำหรับการค้นหา
categorySchema.index({ name: 'text', description: 'text' });
categorySchema.index({ isActive: 1 });

// Pre-save middleware: ตรวจสอบชื่อหมวดหมู่ซ้ำ
categorySchema.pre('save', async function(next) {
  if (this.isModified('name')) {
    const existingCategory = await this.constructor.findOne({
      name: { $regex: new RegExp(`^${this.name}$`, 'i') },
      _id: { $ne: this._id }
    });
    
    if (existingCategory) {
      const error = new Error('Category name already exists');
      error.code = 11000;
      return next(error);
    }
  }
  next();
});

// Static methods
categorySchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

categorySchema.statics.searchByName = function(searchTerm) {
  return this.find({
    name: { $regex: searchTerm, $options: 'i' },
    isActive: true
  });
};

module.exports = mongoose.model('Category', categorySchema);