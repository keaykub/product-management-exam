
<script setup>
// Import components
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <!-- Use Sidebar component with router-view in slot -->
  <Sidebar>
    <router-view />
  </Sidebar>
</template>

<style scoped>
</style>
