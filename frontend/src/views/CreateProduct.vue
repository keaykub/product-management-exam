<template>
  <div class="w-full space-y-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-base-content">เพิ่มสินค้าใหม่</h1>
        <p class="text-base-content/70 mt-2">สร้างสินค้าใหม่ในระบบ</p>
      </div>
      <router-link to="/products" class="btn btn-outline w-fit">
        <ArrowLeft class="w-4 h-4 mr-2" />
        กลับไปหน้าสินค้า
      </router-link>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-error flex items-center gap-2">
      <AlertTriangle class="w-5 h-5 text-red-500" />
      <span class="text-sm font-medium text-red-700">{{ error }}</span>
    </div>

    <!-- Success Alert -->
    <div v-if="successMessage" class="alert alert-success flex items-center gap-2">
      <CheckCircle class="w-4 h-4" />
      <span>{{ successMessage }}</span>
    </div>

    <!-- Main Content Container -->
    <div class="flex justify-center px-4">
      <!-- Product Form -->
      <div class="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <!-- Form Header -->
        <div class="border-b border-gray-200 dark:border-gray-700 px-8 py-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">ข้อมูลสินค้า</h2>
          <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">กรอกรายละเอียดเพื่อสร้างสินค้าใหม่</p>
        </div>
        
        <div class="p-8">
          <form @submit.prevent="createProduct" class="space-y-8">
            <!-- Product Name -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
                ชื่อสินค้า *
              </label>
              <input 
                type="text" 
                v-model="form.name"
                :class="[
                  'w-full px-4 py-3 border rounded-md text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none transition-colors',
                  errors.name 
                    ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/10' 
                    : 'border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                ]"
                placeholder="กรอกชื่อสินค้า..."
                maxlength="100"
                required
              />
              <div class="flex justify-between">
                <div v-if="errors.name" class="text-red-600 dark:text-red-400 text-sm">
                  {{ errors.name }}
                </div>
                <div v-else></div>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ form.name.length }}/100</span>
              </div>
            </div>

            <!-- Product Description -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
                คำอธิบาย
              </label>
              <textarea 
                v-model="form.description"
                :class="[
                  'w-full px-4 py-3 border rounded-md text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none transition-colors resize-none h-24',
                  errors.description 
                    ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/10' 
                    : 'border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                ]"
                placeholder="คำอธิบายเกี่ยวกับสินค้า..."
                maxlength="500"
              ></textarea>
              <div class="flex justify-between">
                <div v-if="errors.description" class="text-red-600 dark:text-red-400 text-sm">
                  {{ errors.description }}
                </div>
                <div v-else></div>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ form.description.length }}/500</span>
              </div>
            </div>

            <!-- Price and Stock Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Price -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  ราคา (บาท) *
                </label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">฿</span>
                  <input 
                    type="number" 
                    v-model.number="form.price"
                    :class="[
                      'w-full pl-8 pr-4 py-3 border rounded-md text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none transition-colors',
                      errors.price 
                        ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/10' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                    ]"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div v-if="errors.price" class="text-red-600 dark:text-red-400 text-sm">
                  {{ errors.price }}
                </div>
              </div>

              <!-- Stock -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  จำนวนสต็อก *
                </label>
                <input 
                  type="number" 
                  v-model.number="form.stock"
                  :class="[
                    'w-full px-4 py-3 border rounded-md text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none transition-colors',
                    errors.stock 
                      ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/10' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                  ]"
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                />
                <div v-if="errors.stock" class="text-red-600 dark:text-red-400 text-sm">
                  {{ errors.stock }}
                </div>
              </div>
            </div>

            <!-- Category Selection -->
            <div class="space-y-2 pt-3">
              <div class="flex items-center justify-between">
                <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  หมวดหมู่ *
                </label>
              </div>
              <div class="relative">
                <select 
                  v-model="form.categoryId"
                  :class="[
                    'w-full px-4 py-3 border rounded-md text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none transition-colors',
                    errors.categoryId 
                      ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/10' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                  ]"
                  :disabled="loadingCategories"
                  required
                >
                  <option value="" disabled>
                    {{ loadingCategories ? 'กำลังโหลด...' : 'เลือกหมวดหมู่' }}
                  </option>
                  <option 
                    v-for="category in categories" 
                    :key="category._id"
                    :value="category._id"
                  >
                    {{ category.name }}
                  </option>
                </select>
                
                <!-- Loading spinner -->
                <div v-if="loadingCategories" class="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg class="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
              
              <div v-if="errors.categoryId" class="text-red-600 dark:text-red-400 text-sm">
                {{ errors.categoryId }}
              </div>
              <div v-else-if="!loadingCategories && categories.length === 0" class="text-amber-600 dark:text-amber-400 text-sm">
                ไม่พบหมวดหมู่ที่ใช้งานได้ กรุณาสร้างหมวดหมู่ก่อน
              </div>
            </div>

            <!-- Status -->
            <div class="space-y-2 pt-3">
              <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
                สถานะ
              </label>
              <div class="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-md border border-gray-200 dark:border-gray-700">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="form.isActive"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div>
                    <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ form.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน' }}
                    </span>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ form.isActive ? 'สินค้าจะแสดงให้ผู้ใช้เห็น' : 'สินค้าจะถูกซ่อนจากผู้ใช้' }}
                    </div>
                  </div>
                </label>
              </div>
            </div>
            

            <!-- Submit Buttons -->
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="flex-1 sm:flex-none sm:px-8 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Package v-if="!isSubmitting" class="w-4 h-4 mr-2 inline" />
                <span v-if="isSubmitting" class="loading loading-spinner loading-sm mr-2"></span>
                {{ isSubmitting ? 'กำลังสร้าง...' : 'สร้างสินค้า' }}
              </button>
              
              <router-link 
                to="/products"
                class="flex-1 sm:flex-none sm:px-8 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium text-center"
              >
                ยกเลิก
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Package,
  ArrowLeft,
  AlertTriangle,
  CheckCircle
} from 'lucide-vue-next'
import { categoryAPI } from '../services/categoryAPI'
import { productAPI } from '../services/productAPI'

const router = useRouter()

// Reactive data
const isSubmitting = ref(false)
const error = ref('')
const successMessage = ref('')
const categories = ref([])
const loadingCategories = ref(false)

// Form data
const form = reactive({
  name: '',
  description: '',
  price: null,
  stock: null,
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
  loadingCategories.value = true
  error.value = '' // Clear previous errors
  
  try {
    // Try the main API first
    const response = await categoryAPI.getCategories({ 
      page: 1, 
      limit: 100
    })
    
    console.log('API Response:', response)
    
    if (response.success && response.data) {
      // The API returns data directly in response.data array
      const allCategories = Array.isArray(response.data) ? response.data : []
      categories.value = allCategories.filter(cat => cat.isActive === true)
      if (categories.value.length === 0 && allCategories.length > 0) {
        // If no active categories but categories exist, show warning
        error.value = 'มีหมวดหมู่ในระบบ แต่ทั้งหมดถูกปิดใช้งาน กรุณาเปิดใช้งานหมวดหมู่'
      }
    } else {
      error.value = 'ไม่สามารถโหลดหมวดหมู่ได้: ' + (response.message || 'ไม่ทราบสาเหตุ')
    }
  } catch (err) {
    console.error('Error fetching categories:', err)
    
    // Try alternative API call as fallback
    try {
      console.log('Trying fallback API call...')
      const fallbackResponse = await fetch('http://localhost:3000/api/v1/categories')
      const fallbackData = await fallbackResponse.json()
      
      console.log('Fallback API Response:', fallbackData)
      
      if (fallbackData.success && fallbackData.data) {
        const allCategories = Array.isArray(fallbackData.data) ? fallbackData.data : []
        categories.value = allCategories.filter(cat => cat.isActive === true)
      } else {
        throw new Error('Fallback also failed')
      }
    } catch (fallbackErr) {
      error.value = 'เกิดข้อผิดพลาดในการโหลดหมวดหมู่: ' + err.message
    }
  } finally {
    loadingCategories.value = false
  }
}

// Validate form
const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  let isValid = true
  
  // Validate name
  if (!form.name.trim()) {
    errors.name = 'ชื่อสินค้าจำเป็นต้องกรอก'
    isValid = false
  } else if (form.name.length > 100) {
    errors.name = 'ชื่อสินค้าต้องไม่เกิน 100 ตัวอักษร'
    isValid = false
  }
  
  // Validate description
  if (form.description && form.description.length > 500) {
    errors.description = 'คำอธิบายต้องไม่เกิน 500 ตัวอักษร'
    isValid = false
  }
  
  // Validate price
  if (!form.price && form.price !== 0) {
    errors.price = 'ราคาจำเป็นต้องกรอก'
    isValid = false
  } else if (form.price < 0) {
    errors.price = 'ราคาต้องมากกว่าหรือเท่ากับ 0'
    isValid = false
  }
  
  // Validate stock
  if (!form.stock && form.stock !== 0) {
    errors.stock = 'จำนวนสต็อกจำเป็นต้องกรอก'
    isValid = false
  } else if (form.stock < 0) {
    errors.stock = 'จำนวนสต็อกต้องมากกว่าหรือเท่ากับ 0'
    isValid = false
  } else if (!Number.isInteger(form.stock)) {
    errors.stock = 'จำนวนสต็อกต้องเป็นจำนวนเต็ม'
    isValid = false
  }
  
  // Validate category
  if (!form.categoryId) {
    errors.categoryId = 'กรุณาเลือกหมวดหมู่'
    isValid = false
  }
  
  return isValid
}

// Create product function
const createProduct = async () => {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    // Prepare product data
    const productData = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: form.price,
      stock: form.stock,
      categoryId: form.categoryId,
      isActive: form.isActive
    }
    
    const response = await productAPI.createProduct(productData)
    
    if (response.success) {
      successMessage.value = 'สร้างสินค้าสำเร็จแล้ว!'
      
      // Redirect after delay
      setTimeout(() => {
        router.push('/products')
      }, 1500)
    } else {
      error.value = response.message || 'เกิดข้อผิดพลาดในการสร้างสินค้า'
    }
    
  } catch (err) {
    console.error('Error creating product:', err)
    error.value = err.message || 'เกิดข้อผิดพลาดในการสร้างสินค้า'
  } finally {
    isSubmitting.value = false
  }
}

// Load categories when component mounts
onMounted(() => {
  fetchCategories()
})
</script>