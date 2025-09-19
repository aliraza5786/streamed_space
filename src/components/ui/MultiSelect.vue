<template>
    <div class="space-y-2 relative w-full">


        <!-- Wrapper -->
        <div class="flex items-center gap-2">
            <!-- Tag area + input -->
            <div
                class="flex flex-wrap items-center gap-2 px-1.5 py-1 border border-border-gray h-10 rounded-md w-full relative">
                <!-- Tags -->
                <div v-for="(lane, index) in selectedLanes" :key="index"
                    class="flex items-center gap-2 bg-gray text-text-primary text-xs font-semibold px-2 py-2 rounded-md">
                    {{ lane }}
                    <button @click="removeLane(index)"
                        class="text-text-secondary -400 hover:text-red-500 text-sm w-3 cursor-pointer"><img
                            src="../../assets/icons/cross.svg" alt=""></button>
                </div>

                <!-- Input -->
                <input v-model="laneInput" @input="filterSuggestions" @keyup.enter="addLane(laneInput)"
                    placeholder="Enter lane name"
                    class="flex-1 min-w-[120px] border-none text-sm text-text-secondary -700 focus:outline-none bg-transparent" />

                <!-- Dropdown -->
                <ul v-if="filteredSuggestions.length"
                    class="absolute top-full left-0 w-full mt-1 bg-white border border-border-gray rounded-md shadow z-10">
                    <li v-for="(option, index) in filteredSuggestions" :key="index"
                        class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm" @click="addLane(option)">
                        {{ option }}
                    </li>
                </ul>
            </div>



        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const allOptions = ref([
    'Lane 1', 'Lane 2', 'Mobile', 'CMS', 'Design', 'Web', 'iOS', 'Android'
])
const selectedLanes = ref<string[]>(['Lane 1', 'Lane 2'])
const laneInput = ref('')
const filteredSuggestions = ref<string[]>([])

function filterSuggestions() {
    const query = laneInput.value.toLowerCase()
    filteredSuggestions.value = allOptions.value.filter(
        (option) =>
            option.toLowerCase().includes(query) &&
            !selectedLanes.value.includes(option)
    )
}

function addLane(name: string) {
    const trimmed = name.trim()
    if (trimmed && !selectedLanes.value.includes(trimmed)) {
        selectedLanes.value.push(trimmed)
    }
    laneInput.value = ''
    filteredSuggestions.value = []
}

function removeLane(index: number) {
    selectedLanes.value.splice(index, 1)
}
</script>