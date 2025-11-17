<template>
  <div class="w-full space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-base-content">Category Details</h1>
        <p class="text-base-content/70 mt-1">View category information</p>
      </div>
      <div class="flex gap-2">
        <router-link :to="`/categories/edit/${categoryId}`" class="btn btn-primary">
          <Edit class="w-4 h-4 mr-2" />
          Edit Category
        </router-link>
        <router-link to="/categories" class="btn btn-outline">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Back to List
        </router-link>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-error">
      <AlertTriangle class="w-4 h-4" />
      <span>{{ error }}</span>
      <div>
        <button class="btn btn-sm btn-outline" @click="fetchCategory">
          Retry
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <span class="loading loading-spinner loading-lg"></span>
      <span class="ml-3">Loading category...</span>
    </div>

    <!-- Category Details -->
    <div v-else-if="category" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Information Card -->
      <div class="lg:col-span-2">
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title text-2xl mb-6">
              <Package class="w-6 h-6" />
              Category Information
            </h2>
            
            <div class="space-y-6">
              <!-- Name -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold">Category Name</span>
                </label>
                <div class="p-3 bg-base-200 rounded-lg">
                  <p class="text-lg font-medium">{{ category.name }}</p>
                </div>
              </div>

              <!-- Description -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold">Description</span>
                </label>
                <div class="p-3 bg-base-200 rounded-lg min-h-20">
                  <p class="whitespace-pre-wrap">{{ category.description || 'No description provided' }}</p>
                </div>
              </div>

              <!-- Status -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold">Status</span>
                </label>
                <div class="p-3 bg-base-200 rounded-lg">
                  <div :class="[
                    'badge badge-lg',
                    category.isActive ? 'badge-success' : 'badge-error'
                  ]">
                    <div :class="[
                      'w-2 h-2 rounded-full mr-2',
                      category.isActive ? 'bg-success-content' : 'bg-error-content'
                    ]"></div>
                    {{ category.isActive ? 'Active' : 'Inactive' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Side Information -->
      <div class="space-y-6">
        <!-- Statistics Card -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">
              <BarChart3 class="w-5 h-5" />
              Statistics
            </h3>
            
            <div class="space-y-4">
              <div class="stat p-0">
                <div class="stat-title text-xs">Products</div>
                <div class="stat-value text-2xl">{{ category.productCount || 0 }}</div>
                <div class="stat-desc">Total products in this category</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline Card -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">
              <Clock class="w-5 h-5" />
              Timeline
            </h3>
            
            <div class="space-y-4">
              <!-- Created Date -->
              <div class="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <div class="w-2 h-2 bg-primary rounded-full"></div>
                <div class="flex-1">
                  <p class="font-medium">Created</p>
                  <p class="text-sm opacity-70">{{ formatDateTime(category.createdAt) }}</p>
                </div>
              </div>

              <!-- Updated Date -->
              <div v-if="category.updatedAt && category.updatedAt !== category.createdAt" 
                   class="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <div class="w-2 h-2 bg-secondary rounded-full"></div>
                <div class="flex-1">
                  <p class="font-medium">Last Updated</p>
                  <p class="text-sm opacity-70">{{ formatDateTime(category.updatedAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions Card -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">
              <Settings class="w-5 h-5" />
              Actions
            </h3>
            
            <div class="space-y-2">
              <router-link 
                :to="`/categories/edit/${categoryId}`" 
                class="btn btn-outline btn-block"
              >
                <Edit class="w-4 h-4 mr-2" />
                Edit Category
              </router-link>
              
              <button 
                class="btn btn-error btn-outline btn-block"
                @click="deleteCategory"
              >
                <Trash2 class="w-4 h-4 mr-2" />
                Delete Category
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Package, 
  Edit, 
  ArrowLeft, 
  AlertTriangle, 
  BarChart3, 
  Clock, 
  Settings, 
  Trash2 
} from 'lucide-vue-next'
import { categoryAPI } from '../services/categoryAPI'

const route = useRoute()
const router = useRouter()

// Reactive data
const category = ref(null)
const loading = ref(false)
const error = ref('')
const categoryId = route.params.id

// Fetch single category
const fetchCategory = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await categoryAPI.getCategory(categoryId)
    
    if (response.success) {
      category.value = response.data
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

// Format date and time
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  const dateOptions = {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  }
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit'
  }
  
  const formattedDate = date.toLocaleDateString('th-TH', dateOptions)
  const formattedTime = date.toLocaleTimeString('th-TH', timeOptions)
  
  return `${formattedDate} at ${formattedTime}`
}

// Delete category
const deleteCategory = async () => {
  if (!confirm(`Are you sure you want to delete "${category.value.name}"?`)) {
    return
  }
  
  try {
    const response = await categoryAPI.deleteCategory(categoryId)
    
    if (response.success) {
      // Redirect to categories list
      router.push('/categories')
    } else {
      alert(response.message || 'Failed to delete category')
    }
  } catch (err) {
    console.error('Error deleting category:', err)
    alert(err.message || 'An error occurred while deleting category')
  }
}

// Load category when component mounts
onMounted(() => {
  fetchCategory()
})
</script>