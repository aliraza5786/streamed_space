<script setup lang="ts">
import { Toaster } from 'vue-sonner';
import 'vue-sonner/style.css' // v2 requires this import

// import { useTheme } from './hooks/useTheme' // or composables
// const { theme, toggleTheme } = useTheme()
</script>

<template>
  <div class="min-h-[100dvh] relative  text-text-primary  transition-colors bg-bg-body">

    <router-view />
    
  </div>
  <Toaster position="top-right" />

</template>

<style scoped></style>
