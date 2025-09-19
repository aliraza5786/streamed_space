<template>
    <div class="bg-white border border-gray rounded-lg p-4 cursor-pointer w-full">
        <div class="flex gap-3">
            <img v-if="element.avatar" :src="element.avatar" class="w-16 h-16 rounded-full" alt="avatar" />
            <div v-else
                class="w-16 h-16  rounded-full text-white text-sm font-semibold flex items-center justify-center"
                :class=" defaultColor">
                {{ getInitials(element.title) }}
            </div>
            <div class="flex flex-col flex-auto">
                <div class="flex justify-between w-full items-center">
                    <h5 class="text-base font-medium text-text-primary">{{ element.title }}</h5>
                    <DropMenu :items="menuItems">
                        <template #trigger>
                            <img src="../../../assets/icons/fi_more-vertical.svg"
                                class="rotate-90 w-5 h-5 cursor-pointer" alt="..." />
                        </template>
                    </DropMenu>
                </div>
                <p class="text-[#535862] text-sm">{{ element.email || 'olivia@untitledui.com' }}</p>
                <h6 class="text-sm text-text-primary">{{ element.role || 'Product Designer' }}</h6>
            </div>
        </div>

        <div class="bg-[#F8F9F9] py-2 px-2.5 rounded-md mt-4">
            <h5 class="text-text-text-secondary  text-xs font-medium">Task Progress</h5>
            <p class="text-xs text-[#535862] mt-2 mb-1">
                Completed {{ element.tasksCompleted || 35 }} tasks out of {{ element.totalTasks || 100 }}
            </p>
            <div class="flex text-sm gap-3 items-center py-2">
                <ProgressBar fill-color="bg-black" :progress="progress" />
                {{ progress }}%
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DropMenu from '../../../components/ui/DropMenu.vue';
import ProgressBar from '../../../components/ui/ProgressBar.vue';
import { getInitials } from '../../../utilities';
const defaultColor = 'bg-blue-500';
const props = defineProps<{
    element: any
    colIndex: number
    cardIndex: number
    menuItems: any[]
}>()

const progress = computed(() => {
    const completed = props.element.tasksCompleted || 0
    const total = props.element.totalTasks || 100
    return Math.round((completed / total) * 100)
})


</script>