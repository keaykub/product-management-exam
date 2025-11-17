<template>
  <div class="w-full space-y-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-base-content">Edit Product</h1>
        <p class="text-base-content/70 mt-2">Update product information</p>
      </div>
      <router-link to="/products" class="btn btn-outline w-fit">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Products
      </router-link>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-error flex items-center gap-2">
      <AlertTriangle class="w-4 h-4" />
      <span>{{ error }}</span>
    </div>

    <!-- Success Alert -->
    <div v-if="successMessage" class="alert alert-success flex items-center gap-2">
      <CheckCircle class="w-4 h-4" />
      <span>{{ successMessage }}</span>
    </div>

    <!-- Main Content Container -->
    <div class="flex justify-center px-4">

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <span class="loading loading-spinner loading-lg"></span>
        <span class="ml-3">Loading product...</span>
      </div>

      <!-- Edit Form -->
      <div v-else class="w-full max-w-2xl">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-2xl mb-6">
              <Edit class="w-6 h-6" />
              Edit Product
            </h2>
          <form @submit.prevent="updateProduct" class="space-y-6">
            <!-- Product Name -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Product Name *</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter product name" 
                class="input input-bordered w-full"
                :class="{ 'input-error': errors.name }"
                v-model="form.name"
                required
              />
              <label class="label">
                <span v-if="errors.name" class="label-text-alt text-error">{{ errors.name }}</span>
                <span class="label-text-alt">{{ form.name.length }}/200</span>
              </label>
            </div>

            <!-- Description -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Description</span>
              </label>
              <textarea 
                class="textarea textarea-bordered h-24 w-full" 
                placeholder="Enter product description (optional)"
                :class="{ 'textarea-error': errors.description }"
                v-model="form.description"
              ></textarea>
              <label class="label">
                <span v-if="errors.description" class="label-text-alt text-error">{{ errors.description }}</span>
                <span class="label-text-alt">{{ (form.description || '').length }}/1000</span>
              </label>
            </div>

            <!-- Price and Stock Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Price -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold">Price (฿) *</span>
                </label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  step="0.01"
                  min="0"
                  class="input input-bordered w-full"
                  :class="{ 'input-error': errors.price }"
                  v-model="form.price"
                  required
                />
                <label class="label">
                  <span v-if="errors.price" class="label-text-alt text-error">{{ errors.price }}</span>
                </label>
              </div>

              <!-- Stock -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold">Stock Quantity *</span>
                </label>
                <input 
                  type="number" 
                  placeholder="0" 
                  min="0"
                  class="input input-bordered w-full"
                  :class="{ 'input-error': errors.stock }"
                  v-model="form.stock"
                  required
                />
                <label class="label">
                  <span v-if="errors.stock" class="label-text-alt text-error">{{ errors.stock }}</span>
                </label>
              </div>
            </div>

            <!-- Category -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Category</span>
              </label>
              <select 
                class="select select-bordered w-full" 
                :class="{ 'select-error': errors.categoryId }"
                v-model="form.categoryId"
              >
                <option value="">Select a category (optional)</option>
                <option 
                  v-for="category in categories" 
                  :key="category._id" 
                  :value="category._id"
                >
                  {{ category.name }}
                </option>
              </select>
              <label class="label">
                <span v-if="errors.categoryId" class="label-text-alt text-error">{{ errors.categoryId }}</span>
              </label>
            </div>

            <!-- Status Control -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Product Status</span>
              </label>
              <div class="p-4 bg-base-200 rounded-lg">
                <label class="label cursor-pointer justify-start gap-4">
                  <input 
                    type="checkbox" 
                    class="toggle toggle-success" 
                    v-model="form.isActive"
                  />
                  <div class="flex flex-col">
                    <span class="font-medium">
                      {{ form.isActive ? '✅ เปิดใช้งาน' : '❌ ปิดใช้งาน' }}
                    </span>
                    <span class="text-sm opacity-70">
                      {{ form.isActive ? 'สินค้าจะแสดงให้ผู้ใช้เห็น' : 'สินค้าจะถูกซ่อนจากผู้ใช้' }}
                    </span>
                  </div>
                </label>
                
                <!-- Status Change Warning -->
                <div v-if="originalProduct && form.isActive !== originalProduct.isActive" class="mt-3">
                  <div class="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="text-xs">
                      {{ form.isActive ? 'จะเปิดใช้งานสินค้านี้' : 'จะปิดใช้งานสินค้านี้' }}
                    </span>
                  </div>
                </div>

                <!-- Stock Warning -->
                <div v-if="form.stock === 0" class="mt-3">
                  <div class="alert alert-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <span class="text-xs">สินค้าหมดสต็อก - ลูกค้าจะไม่สามารถสั่งซื้อได้</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="card-actions justify-end gap-3 pt-4">
              <router-link 
                to="/products"
                class="btn btn-outline"
              >
                Cancel
              </router-link>
              
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="btn btn-primary"
              >
                <Save v-if="!isSubmitting" class="w-4 h-4 mr-2" />
                <span v-if="isSubmitting" class="loading loading-spinner loading-sm mr-2"></span>
                {{ isSubmitting ? 'Updating...' : 'Update Product' }}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Edit,
  ArrowLeft, 
  Save,
  AlertTriangle,
  CheckCircle
} from 'lucide-vue-next'
import { productAPI } from '../services/productAPI'
import { categoryAPI } from '../services/categoryAPI'

const route = useRoute()
const router = useRouter()

// Reactive data
const loading = ref(false)
const isSubmitting = ref(false)
const error = ref('')
const successMessage = ref('')
const productId = route.params.id
const originalProduct = ref(null)
const categories = ref([])

// Form data
const form = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  categoryId: '',
  isActive: true
})

// Form errors
const errors = reactive({
  name: '',
  description: '',
  price: '',
  stock: '',
  categoryId: ''
})

// Fetch categories for dropdown
const fetchCategories = async () => {
  try {
    const response = await categoryAPI.getCategories({ page: 1, limit: 100 })
    if (response.success) {
      categories.value = response.data.filter(cat => cat.isActive)
    }
  } catch (err) {
    console.error('Error fetching categories:', err)
  }
}

// Fetch product data
const fetchProduct = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await productAPI.getProduct(productId)
    
    if (response.success) {
      originalProduct.value = response.data
      
      // Populate form with existing data
      form.name = response.data.name
      form.description = response.data.description || ''
      form.price = response.data.price || 0
      form.stock = response.data.stock || 0
      form.categoryId = response.data.categoryId?._id || ''
      form.isActive = response.data.isActive
    } else {
      error.value = response.message || 'Failed to fetch product'
    }
  } catch (err) {
    console.error('Error fetching product:', err)
    error.value = err.message || 'An error occurred while fetching product'
  } finally {
    loading.value = false
  }
}

// Validate form
const validateForm = () => {
  Object.keys(errors).forEach(key => errors[key] = '')
  
  let isValid = true
  
  // Validate name
  if (!form.name.trim()) {
    errors.name = 'Product name is required'
    isValid = false
  } else if (form.name.trim().length < 2) {
    errors.name = 'Product name must be at least 2 characters'
    isValid = false
  } else if (form.name.trim().length > 200) {
    errors.name = 'Product name must not exceed 200 characters'
    isValid = false
  }
  
  // Validate description
  if (form.description && form.description.length > 1000) {
    errors.description = 'Description must not exceed 1000 characters'
    isValid = false
  }
  
  // Validate price
  if (form.price < 0) {
    errors.price = 'Price must be a positive number'
    isValid = false
  }
  
  // Validate stock
  if (form.stock < 0) {
    errors.stock = 'Stock must be a non-negative number'
    isValid = false
  }
  
  return isValid
}

// Update product
const updateProduct = async () => {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    const response = await productAPI.updateProduct(productId, {
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      categoryId: form.categoryId || null,
      isActive: form.isActive
    })
    
    if (response.success) {
      // Show what was changed
      const changes = []
      if (form.name !== originalProduct.value.name) changes.push('ชื่อสินค้า')
      if (form.description !== (originalProduct.value.description || '')) changes.push('คำอธิบาย')
      if (form.price !== originalProduct.value.price) changes.push('ราคา')
      if (form.stock !== originalProduct.value.stock) changes.push('สต็อก')
      if (form.categoryId !== (originalProduct.value.categoryId?._id || '')) changes.push('หมวดหมู่')
      if (form.isActive !== originalProduct.value.isActive) {
        changes.push(form.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน')
      }
      
      successMessage.value = changes.length > 0 
        ? `อัพเดตสำเร็จ: ${changes.join(', ')}` 
        : 'อัพเดตสำเร็จ'
      
      // Update original product data
      originalProduct.value = { ...originalProduct.value, ...form }
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/products')
      }, 1500)
    } else {
      error.value = response.message || 'Failed to update product'
    }
  } catch (err) {
    console.error('Error updating product:', err)
    error.value = err.message || 'An error occurred while updating product'
  } finally {
    isSubmitting.value = false
  }
}

// Load data when component mounts
onMounted(() => {
  fetchCategories()
  fetchProduct()
})
</script>