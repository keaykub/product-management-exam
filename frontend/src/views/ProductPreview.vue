<template>
  <div class="w-full space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-base-content">Product Details</h1>
        <p class="text-base-content/70 mt-1">View product information</p>
      </div>
      <div class="flex gap-2">
        <router-link :to="`/products/edit/${productId}`" class="btn btn-primary">
          <Edit class="w-4 h-4 mr-2" />
          Edit Product
        </router-link>
        <router-link to="/products" class="btn btn-outline">
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
        <button class="btn btn-sm btn-outline" @click="fetchProduct">
          Retry
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <!-- Header Skeleton -->
      <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div class="space-y-2">
          <div class="skeleton h-8 w-64"></div>
          <div class="skeleton h-4 w-48"></div>
        </div>
        <div class="skeleton h-10 w-32"></div>
      </div>

      <!-- Content Skeleton -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main card skeleton -->
        <div class="lg:col-span-2">
          <div class="card bg-base-100 shadow">
            <div class="card-body">
              <div class="flex items-center gap-3 mb-6">
                <div class="skeleton w-6 h-6"></div>
                <div class="skeleton h-6 w-48"></div>
              </div>
              <div class="space-y-4">
                <div class="skeleton h-4 w-full"></div>
                <div class="skeleton h-4 w-full"></div>
                <div class="skeleton h-4 w-3/4"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Side card skeleton -->
        <div class="space-y-4">
          <div class="card bg-base-100 shadow">
            <div class="card-body">
              <div class="skeleton h-6 w-32 mb-4"></div>
              <div class="space-y-3">
                <div class="skeleton h-4 w-full"></div>
                <div class="skeleton h-4 w-full"></div>
                <div class="skeleton h-4 w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading spinner with text -->
      <div class="flex justify-center items-center py-8">
        <span class="loading loading-spinner loading-lg text-primary mr-3"></span>
        <span class="text-lg font-medium">Loading product details...</span>
      </div>
    </div>

    <!-- Product Details -->
    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Information Card -->
      <div class="lg:col-span-2">
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title text-2xl mb-6">
              <Package class="w-6 h-6" />
              Product Information
            </h2>
            
            <div class="space-y-6">
              <!-- Name -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold">Product Name</span>
                </label>
                <div class="p-3 bg-base-200 rounded-lg">
                  <p class="text-lg font-medium">{{ product.name }}</p>
                </div>
              </div>

              <!-- Description -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold">Description</span>
                </label>
                <div class="p-3 bg-base-200 rounded-lg min-h-20">
                  <p class="whitespace-pre-wrap">{{ product.description || 'No description provided' }}</p>
                </div>
              </div>

              <!-- Category -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold">Category</span>
                </label>
                <div class="p-3 bg-base-200 rounded-lg">
                  <div class="badge badge-outline badge-lg">
                    {{ product.categoryId?.name || 'No category' }}
                  </div>
                </div>
              </div>

              <!-- Price -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold">Price</span>
                </label>
                <div class="p-3 bg-base-200 rounded-lg">
                  <p class="text-2xl font-bold text-success font-mono">
                    ฿{{ product.price?.toLocaleString('th-TH') || '0' }}
                  </p>
                </div>
              </div>

              <!-- Stock & Status -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-semibold">Stock</span>
                  </label>
                  <div class="p-3 bg-base-200 rounded-lg">
                    <div class="flex items-center gap-3">
                      <span class="text-2xl font-bold" :class="{
                        'text-success': product.stock > 10,
                        'text-warning': product.stock > 0 && product.stock <= 10,
                        'text-error': product.stock === 0
                      }">
                        {{ product.stock }}
                      </span>
                      <div class="flex flex-col gap-1">
                        <div v-if="product.stock === 0" class="badge badge-error badge-sm">
                          Out of Stock
                        </div>
                        <div v-else-if="product.stock <= 10" class="badge badge-warning badge-sm">
                          Low Stock
                        </div>
                        <div v-else class="badge badge-success badge-sm">
                          In Stock
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-semibold">Status</span>
                  </label>
                  <div class="p-3 bg-base-200 rounded-lg">
                    <div :class="[
                      'badge badge-lg',
                      product.isActive ? 'badge-success' : 'badge-error'
                    ]">
                      <div :class="[
                        'w-2 h-2 rounded-full mr-2',
                        product.isActive ? 'bg-success-content' : 'bg-error-content'
                      ]"></div>
                      {{ product.isActive ? 'Active' : 'Inactive' }}
                    </div>
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
              Product Stats
            </h3>
            
            <div class="space-y-4">
              <div class="stat p-0">
                <div class="stat-title text-xs">Total Value</div>
                <div class="stat-value text-lg font-mono">
                  ฿{{ ((product.price || 0) * (product.stock || 0)).toLocaleString('th-TH') }}
                </div>
                <div class="stat-desc">Price × Stock</div>
              </div>
              
              <div class="stat p-0">
                <div class="stat-title text-xs">Stock Level</div>
                <div class="stat-value text-lg" :class="{
                  'text-success': product.stock > 10,
                  'text-warning': product.stock > 0 && product.stock <= 10,
                  'text-error': product.stock === 0
                }">
                  {{ product.stock > 10 ? 'High' : product.stock > 0 ? 'Low' : 'Empty' }}
                </div>
                <div class="stat-desc">{{ product.stock }} units available</div>
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
                  <p class="text-sm opacity-70">{{ formatDateTime(product.createdAt) }}</p>
                </div>
              </div>

              <!-- Updated Date -->
              <div v-if="product.updatedAt && product.updatedAt !== product.createdAt" 
                   class="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <div class="w-2 h-2 bg-secondary rounded-full"></div>
                <div class="flex-1">
                  <p class="font-medium">Last Updated</p>
                  <p class="text-sm opacity-70">{{ formatDateTime(product.updatedAt) }}</p>
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
                :to="`/products/edit/${productId}`" 
                class="btn btn-outline btn-block"
              >
                <Edit class="w-4 h-4 mr-2" />
                Edit Product
              </router-link>
              
              <button 
                class="btn btn-error btn-outline btn-block"
                @click="deleteProduct"
              >
                <Trash2 class="w-4 h-4 mr-2" />
                Delete Product
              </button>
              
              <router-link 
                v-if="product.categoryId?._id"
                :to="`/category/${product.categoryId._id}`" 
                class="btn btn-ghost btn-outline btn-block"
              >
                <Package class="w-4 h-4 mr-2" />
                View Category
              </router-link>
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
import { productAPI } from '../services/productAPI'

const route = useRoute()
const router = useRouter()

// Reactive data
const product = ref(null)
const loading = ref(false)
const error = ref('')
const productId = route.params.id

// Fetch single product
const fetchProduct = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await productAPI.getProduct(productId)
    
    if (response.success) {
      product.value = response.data
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

// Delete product
const deleteProduct = async () => {
  if (!confirm(`Are you sure you want to delete "${product.value.name}"?`)) {
    return
  }
  
  try {
    const response = await productAPI.deleteProduct(productId)
    
    if (response.success) {
      // Redirect to products list
      router.push('/products')
    } else {
      alert(response.message || 'Failed to delete product')
    }
  } catch (err) {
    console.error('Error deleting product:', err)
    alert(err.message || 'An error occurred while deleting product')
  }
}

// Load product when component mounts
onMounted(() => {
  fetchProduct()
})
</script>