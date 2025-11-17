<template>
  <div class="w-full space-y-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-base-content">Add New Category</h1>
        <p class="text-base-content/70 mt-2">Create a new product category</p>
      </div>
      <router-link to="/categories" class="btn btn-outline w-fit">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Categories
      </router-link>
    </div>

    <!-- Main Content Container -->
    <div class="flex justify-center px-4">
      <!-- Category Form -->
      <div class="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <!-- Form Header -->
        <div class="border-b border-gray-200 dark:border-gray-700 px-8 py-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Category Information</h2>
          <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">Fill in the details to create a new category</p>
        </div>
        
        <div class="p-8">
          <form @submit.prevent="handleSubmit" class="space-y-8">
            <!-- Category Name -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
                Category Name *
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
                placeholder="Enter category name"
                maxlength="50"
                required
              />
              <div class="flex justify-between">
                <div v-if="errors.name" class="text-red-600 dark:text-red-400 text-sm">
                  {{ errors.name }}
                </div>
                <div v-else></div>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ form.name.length }}/50</span>
              </div>
            </div>

            <!-- Category Description -->
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  Description
                </label>
                <span class="text-xs text-gray-500 dark:text-gray-400">Optional</span>
              </div>
              <textarea 
                v-model="form.description"
                :class="[
                  'w-full px-4 py-3 border rounded-md resize-none h-28 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none transition-colors',
                  errors.description 
                    ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/10' 
                    : 'border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                ]"
                placeholder="Describe this category..."
                maxlength="200"
              ></textarea>
              <div class="flex justify-between">
                <div v-if="errors.description" class="text-red-600 dark:text-red-400 text-sm">
                  {{ errors.description }}
                </div>
                <div v-else></div>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ form.description.length }}/200</span>
              </div>
            </div>

            <!-- Error Alert -->
            <div v-if="submitError" class="border border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
              <p class="text-red-800 dark:text-red-300 text-sm">{{ submitError }}</p>
            </div>

            <!-- Success Alert -->
            <div v-if="submitSuccess" class="border border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
              <p class="text-green-800 dark:text-green-300 text-sm">Category created successfully! Redirecting...</p>
            </div>

            <!-- Form Actions -->
            <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button 
                type="submit" 
                :class="[
                  'btn flex-1',
                  isSubmitting || !isFormValid 
                    ? 'btn-disabled' 
                    : 'btn-primary'
                ]"
                :disabled="isSubmitting || !isFormValid"
              >
                <span v-if="isSubmitting" class="loading loading-spinner loading-sm mr-2"></span>
                <Plus v-else class="w-4 h-4 mr-2" />
                {{ isSubmitting ? 'Creating...' : 'Create Category' }}
              </button>
              
              <button 
                type="button" 
                :class="[
                  'flex-1 px-6 py-3 rounded-md border font-medium text-sm flex items-center justify-center gap-2 transition-colors',
                  isSubmitting 
                    ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
                @click="resetForm"
                :disabled="isSubmitting"
              >
                <RotateCcw class="w-4 h-4" />
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Grid3x3, Plus, RotateCcw, AlertCircle, CheckCircle, Package } from 'lucide-vue-next'
import { categoryAPI } from '../services/categoryAPI'

const router = useRouter()

// Form data
const form = ref({
  name: '',
  description: ''
})

// Form state
const errors = ref({})
const submitError = ref('')
const submitSuccess = ref(false)
const isSubmitting = ref(false)

// Computed properties
const isFormValid = computed(() => {
  return form.value.name.trim().length >= 2 && 
         form.value.name.trim().length <= 50 &&
         Object.keys(errors.value).length === 0
})

// Validation functions
const validateForm = () => {
  errors.value = {}
  
  // Validate name
  if (!form.value.name.trim()) {
    errors.value.name = 'Category name is required'
  } else if (form.value.name.trim().length < 2) {
    errors.value.name = 'Category name must be at least 2 characters'
  } else if (form.value.name.trim().length > 50) {
    errors.value.name = 'Category name cannot exceed 50 characters'
  } else if (!/^[a-zA-Zก-๙\s\-\_\.]+$/.test(form.value.name.trim())) {
    errors.value.name = 'Category name can only contain letters, spaces, hyphens, underscores, and dots'
  }
  
  // Validate description
  if (form.value.description.length > 200) {
    errors.value.description = 'Description cannot exceed 200 characters'
  }
}

// Form handlers
const handleSubmit = async () => {
  validateForm()
  
  if (!isFormValid.value) {
    return
  }
  
  isSubmitting.value = true
  submitError.value = ''
  submitSuccess.value = false
  
  try {
    const categoryData = {
      name: form.value.name.trim(),
      description: form.value.description.trim()
    }
    
    const response = await categoryAPI.createCategory(categoryData)
    
    if (response.success) {
      submitSuccess.value = true
      
      // Redirect to categories page after 2 seconds
      setTimeout(() => {
        router.push('/categories')
      }, 2000)
    } else {
      submitError.value = response.message || 'Failed to create category'
    }
  } catch (error) {
    console.error('Error creating category:', error)
    submitError.value = error.message || 'An error occurred while creating the category'
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  form.value.name = ''
  form.value.description = ''
  errors.value = {}
  submitError.value = ''
  submitSuccess.value = false
}

// Watch for form changes to validate in real-time
const watchForm = () => {
  if (form.value.name || form.value.description) {
    validateForm()
  }
}

onMounted(() => {
  // Clear any previous state
  resetForm()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>