<template>
    <div class="p-8">
        <h1 class="text-2xl font-bold">Dashboard (Private)</h1>
        <button @click="logout" class="mt-4 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

function logout() {
    localStorage.removeItem('token')
    router.push('/login')
}
</script>