<template>
    <BaseModal :model-value="modelValue" @update:modelValue="value => emit('update:modelValue', value)" size="md">

        <form class="px-4" @submit.prevent="submit">
            <h2 class="text-xl font-medium">Add team member</h2>

            <div class="pt-6 px-1 space-y-5">
                <BaseTextField :model-value="email" placeholder="Add people by name or email address"
                    @update:model-value="email = $event" />

                <div>
                    <h3 class="text-sm font-medium text-text-primary mb-3">Shared with</h3>
                    <div v-for="(person, index) in peopleShared" :key="index"
                        class="flex items-center justify-between py-2">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full text-white text-sm font-semibold flex items-center justify-center"
                                :class="person.color">
                                {{ getInitials(person.name) }}
                            </div>
                            <div>
                                <p class="text-sm font-medium text-text-primary">{{ person.name }}</p>
                                <p class="text-xs text-[#2B2C30B2]">{{ person.email }}</p>
                            </div>
                        </div>

                        <div class="text-sm font-medium text-text-secondary  flex items-center">
                            <span v-if="person.role === 'Owner'" class="text-text-secondary -400">Owner</span>
                            <select v-else v-model="person.role"
                                class="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none">
                                <option>Editor</option>
                                <option>Viewer</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="space-x-2 flex justify-between pt-5">
                    <Button @click="copyLink" variant="secondary">
                        <div class="flex gap-2">
                            <img src="../../../assets/icons/fi_link-2.svg  " alt="" /> Copy Link
                        </div>
                    </Button>
                    <Button  :disabled="!email">Add</Button>
                </div>
            </div>
        </form>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '../../../components/ui/BaseModal.vue';
import BaseTextField from '../../../components/ui/BaseTextField.vue';
import Button from '../../../components/ui/Button.vue';
import { getInitials } from '../../../utilities';

defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'add'])

const email = ref('')
const peopleShared = ref([
    { name: 'Olivia Rhye', email: 'olivia@example.com', color: 'bg-black', role: 'Owner' },
    { name: 'Ali Raza', email: 'ali@example.com', color: 'bg-blue-500', role: 'Editor' }
])



function copyLink() {
    navigator.clipboard.writeText('https://yourapp.com/invite-link')
}

function submit() {
    emit('add', { name: email.value })
    emit('update:modelValue', false)
}
</script>