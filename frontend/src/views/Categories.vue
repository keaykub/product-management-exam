<template>
  <div class="w-full space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-base-content">Categories</h1>
        <p class="text-base-content/70 mt-1">Manage product categories</p>
      </div>
      <router-link to="/categories/create" class="btn btn-primary">
        <Plus class="w-4 h-4 mr-2" />
        Add Category
      </router-link>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-error">
      <AlertTriangle class="w-4 h-4" />
      <span>{{ error }}</span>
      <div>
        <button class="btn btn-sm btn-outline" @click="fetchCategories">
          Retry
        </button>
      </div>
    </div>

    <!-- Categories Table -->
    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="card-title text-2xl">All Categories</h2>
            <p class="text-base-content/60 text-sm mt-1">Manage your product categories</p>
          </div>
          <div class="flex gap-2">
            <button 
              class="btn btn-ghost btn-sm" 
              @click="() => fetchCategories()" 
              :disabled="loading"
              title="Refresh data"
            >
              <RefreshCw class="h-4 w-4 mr-1" :class="{ 'animate-spin': loading }" />
              {{ loading ? 'Loading...' : 'Refresh' }}
            </button>
            
            <!-- Loading indicator when fetching -->
            <div v-if="loading" class="flex items-center">
              <span class="loading loading-dots loading-sm"></span>
            </div>
          </div>
        </div>
        
        <!-- Search Box -->
        <div class="bg-base-200 rounded-lg p-4 mb-6">
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Search Input -->
            <div class="flex-1">
              <div class="form-control">
                <div class="input-group">
                  <span class="bg-base-300 flex items-center justify-center">
                  </span>
                  <input 
                    type="text" 
                    placeholder="Search categories with RegEx support..." 
                    class="input input-bordered input-md flex-1 focus:input-primary"
                    v-model="searchQuery"
                    @keyup.enter="performSearch"
                  />
                </div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex gap-2">
              <button 
                class="btn btn-primary btn-md"
                @click="performSearch"
                :disabled="loading"
              >
                <span v-if="loading" class="loading loading-spinner loading-xs mr-1"></span>
                <Search v-else class="h-4 w-4 mr-1" />
                {{ loading ? 'Searching...' : 'Search' }}
              </button>
              <button 
                class="btn btn-ghost btn-md"
                @click="clearSearch"
                :disabled="loading || !searchQuery"
                title="Clear search"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <!-- RegEx Examples -->
          <!-- <div class="mt-3 p-3 bg-base-100 rounded border-l-4 border-primary/20">
            <div class="flex items-center gap-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-medium text-primary">RegEx Examples:</span>
            </div>
            <div class="mt-1 text-xs text-base-content/70 flex flex-wrap gap-x-4 gap-y-1">
              <span><code class="px-1.5 py-0.5 bg-primary/10 text-primary rounded font-mono">^food</code> starts with "food"</span>
              <span><code class="px-1.5 py-0.5 bg-primary/10 text-primary rounded font-mono">book$</code> ends with "book"</span>
              <span><code class="px-1.5 py-0.5 bg-primary/10 text-primary rounded font-mono">electr.*</code> contains "electr"</span>
              <span><code class="px-1.5 py-0.5 bg-primary/10 text-primary rounded font-mono">(phone|mobile)</code> contains either</span>
            </div>
          </div> -->
        </div>
        
        <!-- Search Results Info -->
        <div v-if="searchQuery" class="mb-4">
          <div class="alert alert-info shadow-sm">
            <div class="flex items-center gap-2">
              <Search class="stroke-current shrink-0 h-5 w-5" />
              <div class="flex-1">
                <span class="font-medium">Search Results:</span>
                <span class="ml-2">
                  {{ totalItems }} result{{ totalItems !== 1 ? 's' : '' }} found for 
                  <code class="px-1 py-0.5 bg-info/20 rounded font-mono text-sm">"{{ searchQuery }}"</code>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col justify-center items-center py-12">
          <div class="flex items-center gap-4">
            <span class="loading loading-spinner loading-lg text-primary"></span>
            <div class="text-center">
              <div class="text-lg font-medium text-base-content">Loading categories...</div>
              <div class="text-sm text-base-content/60 mt-1">Please wait a moment</div>
            </div>
          </div>
          
          <!-- Loading skeleton cards -->
          <div class="w-full mt-8 space-y-3">
            <div class="skeleton h-4 w-full"></div>
            <div class="skeleton h-4 w-full"></div>
            <div class="skeleton h-4 w-full"></div>
            <div class="skeleton h-4 w-3/4"></div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="!loading && categories.length === 0" class="text-center py-8">
          <Package class="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-semibold text-gray-600">No categories found</h3>
          <p class="text-gray-500 mb-4">Create your first category to get started</p>
          <router-link to="/categories/create" class="btn btn-primary">
            <Plus class="w-4 h-4 mr-2" />
            Add Category
          </router-link>
        </div>
        
        <!-- Categories Table -->
        <div v-else class="overflow-x-auto">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th>Category</th>
                <th>Products Count</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in categories" :key="category._id">
                <td>
                  <div>
                    <div class="font-bold">{{ category.name }}</div>
                    <div class="text-sm opacity-50">
                      {{ category.description || 'No description' }}
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge badge-ghost">
                    {{ category.productCount || 0 }}
                  </span>
                </td>
                <td>
                  <div :class="[
                    'badge',
                    category.isActive ? 'badge-success' : 'badge-error'
                  ]">
                    {{ category.isActive ? 'Active' : 'Inactive' }}
                  </div>
                </td>
                <td>{{ formatDate(category.createdAt) }}</td>
                <td>
                  <div class="flex gap-2">
                    <router-link 
                      :to="`/category/${category._id}`" 
                      class="btn btn-ghost btn-xs" 
                      title="Preview"
                    >
                      <Eye class="w-3 h-3" />
                    </router-link>
                    <router-link 
                      :to="`/categories/edit/${category._id}`" 
                      class="btn btn-ghost btn-xs" 
                      title="Edit"
                    >
                      <Edit class="w-3 h-3" />
                    </router-link>
                    <button 
                      class="btn btn-ghost btn-xs text-error" 
                      title="Delete"
                      @click="deleteCategory(category._id, category.name)"
                    >
                      <Trash2 class="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div v-if="!loading && categories.length > 0" class="flex justify-between items-center mt-6">
          <div class="text-sm text-gray-600">
            Showing {{ Math.min(((currentPage - 1) * pageSize) + 1, totalItems) }} to {{ Math.min(currentPage * pageSize, totalItems) }} 
            of {{ totalItems }} entries (Page {{ currentPage }}/{{ totalPages }})
          </div>
          
          <div class="join">
            <button 
              class="join-item btn btn-sm" 
              :disabled="currentPage === 1"
              @click="prevPage"
            >
              « Previous
            </button>
            
            <template v-for="page in Math.min(totalPages, 5)" :key="page">
              <button 
                class="join-item btn btn-sm"
                :class="{ 'btn-active': currentPage === page }"
                @click="() => goToPage(page)"
              >
                {{ page }}
              </button>
            </template>
            
            <button 
              class="join-item btn btn-sm" 
              :disabled="currentPage === totalPages"
              @click="nextPage"
            >
              Next »
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">ยืนยันการลบหมวดหมู่</h3>
      <div class="py-4">
        <div class="alert alert-warning mb-4">
          <AlertTriangle class="w-5 h-5" />
          <span>คุณแน่ใจหรือไม่ที่ต้องการลบหมวดหมู่นี้?</span>
        </div>
        
        <div class="bg-base-200 p-4 rounded-lg mb-4">
          <p class="font-semibold">{{ categoryToDelete?.name }}</p>
          <p class="text-sm opacity-70">{{ categoryToDelete?.description }}</p>
        </div>
        
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">ลบข้อมูลถาวร (ไม่สามารถกู้คืนได้)</span>
            <input 
              type="checkbox" 
              class="toggle toggle-error" 
              v-model="permanentDelete"
            />
          </label>
          <div class="label">
            <span class="label-text-alt" :class="permanentDelete ? 'text-error' : 'text-warning'">
              {{ permanentDelete ? '⚠️ จะลบข้อมูลออกจากระบบถาวร ไม่สามารถกู้คืนได้' : '✓ จะปิดใช้งานเท่านั้น สามารถเปิดใช้งานใหม่ได้' }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="modal-action">
        <button 
          class="btn btn-outline" 
          @click="cancelDelete"
          :disabled="isDeleting"
        >
          ยกเลิก
        </button>
        <button 
          class="btn btn-error" 
          @click="confirmDelete"
          :disabled="isDeleting"
        >
          <Trash2 v-if="!isDeleting" class="w-4 h-4 mr-2" />
          <span v-if="isDeleting" class="loading loading-spinner loading-sm mr-2"></span>
          {{ isDeleting ? 'กำลังลบ...' : (permanentDelete ? 'ลบถาวร' : 'ปิดใช้งาน') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Grid3x3, Package, AlertTriangle, Edit, Trash2, Eye, Search, X, RefreshCw } from 'lucide-vue-next'
import { categoryAPI } from '../services/categoryAPI'

// Reactive data
const categories = ref([])
const loading = ref(false)
const error = ref('')

// Search data
const searchQuery = ref('')

// Pagination data
const currentPage = ref(1)
const pageSize = ref(5)
const totalItems = ref(0)
const totalPages = ref(0)

// Delete modal data
const showDeleteModal = ref(false)
const categoryToDelete = ref(null)
const isDeleting = ref(false)
const permanentDelete = ref(false)

// Fetch categories from API
const fetchCategories = async (page = currentPage.value) => {
  // Handle case when called from button click (event object) or pagination (number)
  const pageNumber = (typeof page === 'number') ? page : currentPage.value
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await categoryAPI.getCategories({
      page: pageNumber,
      limit: pageSize.value,
      search: searchQuery.value
    })
    
    if (response.success) {
      categories.value = response.data
      
      // Handle pagination info
      if (response.pagination) {
        totalItems.value = response.pagination.total
        totalPages.value = response.pagination.pages
      } else if (response.total) {
        totalItems.value = response.total
        totalPages.value = Math.ceil(response.total / pageSize.value)
      } else {
        // Fallback: assume more pages if we got full page of data
        totalItems.value = response.data.length
        totalPages.value = response.data.length === pageSize.value ? pageNumber + 1 : pageNumber
      }
      
      currentPage.value = pageNumber
      console.log('Pagination state:', { currentPage: currentPage.value, totalPages: totalPages.value, totalItems: totalItems.value })
    } else {
      error.value = response.message || 'Failed to fetch categories'
    }
  } catch (err) {
    console.error('Error fetching categories:', err)
    error.value = err.message || 'An error occurred while fetching categories'
  } finally {
    loading.value = false
  }
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Delete category functions
const deleteCategory = (categoryId, categoryName) => {
  // Find the category to show in modal
  categoryToDelete.value = categories.value.find(cat => cat._id === categoryId)
  showDeleteModal.value = true
  permanentDelete.value = false
}

const cancelDelete = () => {
  showDeleteModal.value = false
  categoryToDelete.value = null
  isDeleting.value = false
  permanentDelete.value = false
}

const confirmDelete = async () => {
  if (!categoryToDelete.value) return
  
  isDeleting.value = true
  
  try {
    const response = await categoryAPI.deleteCategory(
      categoryToDelete.value._id, 
      permanentDelete.value
    )
    
    if (response.success) {
      // Show success message
      alert(response.message)
      
      // Refresh the list
      await fetchCategories()
      
      // Close modal
      cancelDelete()
    } else {
      alert(response.message || 'Failed to delete category')
    }
  } catch (err) {
    console.error('Error deleting category:', err)
    alert(err.message || 'An error occurred while deleting category')
  } finally {
    isDeleting.value = false
  }
}

// Pagination functions
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchCategories(page)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

// Search functions
const performSearch = () => {
  // Reset to first page when searching
  currentPage.value = 1
  fetchCategories(1)
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
  fetchCategories(1)
}

// Load categories when component mounts
onMounted(() => {
  fetchCategories()
})
</script>