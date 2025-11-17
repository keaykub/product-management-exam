<template>
  <div class="w-full space-y-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-base-content">Edit Category</h1>
        <p class="text-base-content/70 mt-2">Update category information</p>
      </div>
      <router-link to="/categories" class="btn btn-outline w-fit">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Categories
      </router-link>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="max-w-2xl mx-auto mb-6">
      <div class="alert alert-error">
        <AlertTriangle class="w-4 h-4" />
        <span>{{ error }}</span>
      </div>
    </div>

    <!-- Success Alert -->
    <div v-if="successMessage" class="max-w-2xl mx-auto mb-6">
      <div class="alert alert-success">
        <CheckCircle class="w-4 h-4" />
        <span>{{ successMessage }}</span>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="flex justify-center px-4">

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <span class="loading loading-spinner loading-lg"></span>
        <span class="ml-3">Loading category...</span>
      </div>

      <!-- Edit Form -->
      <div v-else class="w-full max-w-2xl">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-2xl mb-6">
              <Edit class="w-6 h-6" />
              Edit Category
            </h2>
          <form @submit.prevent="updateCategory" class="space-y-6">
            <!-- Category Name -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Category Name *</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter category name" 
                class="input input-bordered w-full"
                :class="{ 'input-error': errors.name }"
                v-model="form.name"
                required
              />
              <label class="label">
                <span v-if="errors.name" class="label-text-alt text-error">{{ errors.name }}</span>
                <span class="label-text-alt">{{ form.name.length }}/50</span>
              </label>
            </div>

            <!-- Description -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Description</span>
              </label>
              <textarea 
                class="textarea textarea-bordered h-24 w-full" 
                placeholder="Enter category description (optional)"
                :class="{ 'textarea-error': errors.description }"
                v-model="form.description"
              ></textarea>
              <label class="label">
                <span v-if="errors.description" class="label-text-alt text-error">{{ errors.description }}</span>
                <span class="label-text-alt">{{ (form.description || '').length }}/200</span>
              </label>
            </div>

            <!-- Status Control -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Category Status</span>
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
                      {{ form.isActive ? 'หมวดหมู่จะแสดงให้ผู้ใช้เห็น' : 'หมวดหมู่จะถูกซ่อนจากผู้ใช้' }}
                    </span>
                  </div>
                </label>
                
                <!-- Status Change Warning -->
                <div v-if="originalCategory && form.isActive !== originalCategory.isActive" class="mt-3">
                  <div class="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="text-xs">
                      {{ form.isActive ? 'จะเปิดใช้งานหมวดหมู่นี้' : 'จะปิดใช้งานหมวดหมู่นี้' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="card-actions justify-end gap-3 pt-4">
              <router-link 
                to="/categories"
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
                {{ isSubmitting ? 'Updating...' : 'Update Category' }}
              </button>
            </div>
          </form>
          </div> <!-- Close card-body -->
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
  AlertTriangle, 
  CheckCircle,
  Save
} from 'lucide-vue-next'
import { categoryAPI } from '../services/categoryAPI'

const route = useRoute()
const router = useRouter()

// Reactive data
const loading = ref(false)
const isSubmitting = ref(false)
const error = ref('')
const successMessage = ref('')
const categoryId = route.params.id
const originalCategory = ref(null)

// Form data
const form = reactive({
  name: '',
  description: '',
  isActive: true
})

// Form errors
const errors = reactive({
  name: '',
  description: '',
  isActive: ''
})

// Fetch category data
const fetchCategory = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await categoryAPI.getCategory(categoryId)
    
    if (response.success) {
      originalCategory.value = response.data
      
      // Populate form with existing data
      form.name = response.data.name
      form.description = response.data.description || ''
      form.isActive = response.data.isActive
    } else {
      error.value = response.message || 'Failed to fetch category'
    }
  } catch (err) {
    console.error('Error fetching category:', err)
    error.value = err.message || 'An error occurred while fetching category'
  } finally {
    loading.value = false
  }
}

// Validate form
const validateForm = () => {
  errors.name = ''
  errors.description = ''
  
  let isValid = true
  
  // Validate name
  if (!form.name.trim()) {
    errors.name = 'Category name is required'
    isValid = false
  } else if (form.name.trim().length < 2) {
    errors.name = 'Category name must be at least 2 characters'
    isValid = false
  } else if (form.name.trim().length > 50) {
    errors.name = 'Category name must not exceed 50 characters'
    isValid = false
  }
  
  // Validate description
  if (form.description && form.description.length > 200) {
    errors.description = 'Description must not exceed 200 characters'
    isValid = false
  }
  
  return isValid
}

// Update category
const updateCategory = async () => {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    const response = await categoryAPI.updateCategory(categoryId, {
      name: form.name.trim(),
      description: form.description.trim(),
      isActive: form.isActive
    })
    
    if (response.success) {
      // Show what was changed
      const changes = []
      if (form.name !== originalCategory.value.name) changes.push('ชื่อ')
      if (form.description !== (originalCategory.value.description || '')) changes.push('คำอธิบาย')
      if (form.isActive !== originalCategory.value.isActive) {
        changes.push(form.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน')
      }
      
      successMessage.value = changes.length > 0 
        ? `อัพเดตสำเร็จ: ${changes.join(', ')}` 
        : 'อัพเดตสำเร็จ'
      
      // Update original category data
      originalCategory.value = { ...originalCategory.value, ...form }
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/categories')
      }, 1500)
    } else {
      error.value = response.message || 'Failed to update category'
    }
  } catch (err) {
    console.error('Error updating category:', err)
    error.value = err.message || 'An error occurred while updating category'
  } finally {
    isSubmitting.value = false
  }
}

// Load category when component mounts
onMounted(() => {
  fetchCategory()
})
</script>
