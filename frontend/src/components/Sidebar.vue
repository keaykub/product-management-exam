<script setup>
// Import Lucide Vue icons
import { 
  Menu, 
  Package, 
  Grid3x3,
  User,
  LogOut,
  Settings
} from 'lucide-vue-next'
</script>

<template>
    <div class="drawer lg:drawer-open">
        <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
            <!-- Navbar -->
            <nav class="navbar w-full bg-base-300">
            <label for="my-drawer-4" aria-label="open sidebar" class="btn btn-square btn-ghost">
                <!-- Sidebar toggle icon using Lucide -->
                <Menu :size="16" />
            </label>
            <div class="px-4 font-semibold">ระบบจัดการสินค้า</div>
            </nav>
            <!-- Main Content Area -->
            <main class="flex-1 p-6 w-full">
                <!-- Slot for dynamic content -->
                <slot>
                    <!-- Default content when no slot is provided -->
                    <div class="w-full">
                        <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div class="card bg-base-200 shadow">
                                <div class="card-body">
                                    <h2 class="card-title">Welcome!</h2>
                                    <p>This is your main content area.</p>
                                </div>
                            </div>
                            <div class="card bg-base-200 shadow">
                                <div class="card-body">
                                    <h2 class="card-title">Products</h2>
                                    <p>Manage your inventory here.</p>
                                </div>
                            </div>
                            <div class="card bg-base-200 shadow">
                                <div class="card-body">
                                    <h2 class="card-title">Orders</h2>
                                    <p>View recent orders and sales.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </slot>
            </main>
        </div>

        <div class="drawer-side is-drawer-close:overflow-visible">
            <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
            <div class="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
            <!-- Brand Section -->
            <div class="w-full p-4 border-b border-base-300">
                <div class="flex items-center gap-3">
                    <div class="bg-primary text-primary-content p-2 rounded-lg">
                        <Package :size="16" />
                    </div>
                    <div class="is-drawer-close:hidden">
                        <h1 class="font-bold text-lg">ระบบจัดการสินค้า</h1>
                        <p class="text-sm text-base-content/70">Product Management</p>
                    </div>
                </div>
            </div>
            <!-- Sidebar content here -->
            <ul class="menu w-full grow">
                <!-- List item -->
                <li>
                <router-link to="/products" class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Products">
                    <!-- Product icon using Lucide -->
                    <Package :size="16" />
                    <span class="is-drawer-close:hidden">Products</span>
                </router-link>
                </li>

                <!-- List item -->
                <li>
                <router-link to="/categories" class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Categories">
                    <!-- Category icon using Lucide -->
                    <Grid3x3 :size="16" />
                    <span class="is-drawer-close:hidden">Categories</span>
                </router-link>
                </li>
            </ul>
            
            <!-- Profile Section -->
            <div class="w-full p-4 border-t border-base-300 mt-auto">
                <div class="flex items-center gap-3">
                    <!-- Profile Avatar -->
                    <div class="avatar">
                        <div class="w-8 rounded-full bg-accent text-accent-content flex items-center justify-center">
                            <User :size="16" />
                        </div>
                    </div>
                    
                    <!-- Profile Info -->
                    <div class="flex-1 is-drawer-close:hidden">
                        <p class="font-semibold text-sm">Thanakorn Bunkoy</p>
                        <p class="text-xs text-base-content/70">Administrator</p>
                    </div>
                    
                    <!-- Profile Menu -->
                    <div class="dropdown dropdown-top dropdown-end is-drawer-close:hidden">
                        <div tabindex="0" role="button" class="btn btn-ghost btn-sm btn-circle">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                            </svg>
                        </div>
                        <ul tabindex="0" class="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-48 mb-2">
                            <li>
                                <router-link to="/profile" class="flex items-center gap-2">
                                    <User :size="14" />
                                    Profile Settings
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/settings" class="flex items-center gap-2">
                                    <Settings :size="14" />
                                    Account Settings
                                </router-link>
                            </li>
                            <li><hr /></li>
                            <li>
                                <a class="flex items-center gap-2 text-error">
                                    <LogOut :size="14" />
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>

