<template>
    <BaseModal :model-value="modelValue" @update:modelValue="value => emit('update:modelValue', value)" size="md">

        <form class="px-4" @submit.prevent="submit">
            <h2 class="text-xl font-medium">Create a Team</h2>
            <p class="text-sm mt-4 text-[#2B2C30CC]">
                Bring your team together to collaborate, assign tasks, and streamline communication in Streamed Space.
            </p>

            <div class="py-6 px-1 space-y-5">
                <BaseTextField label="Team name" :model-value="teamName"
                    placeholder="E.g. Product Design, Sprint Alpha, DevOps Squad"
                    @update:model-value="teamName = $event" message="Who can see this team name?" />

                <BaseMultiSelect v-model="selectedUsers" :options="userOptions" label="Assign Members"
                    tooltip="You can select multiple members" placeholder="Choose members" />

                <div>
                    <label class="text-[16px] font-medium text-text-primary mb-2 flex items-center">
                        Membership Settings
                    </label>
                    <Checkbox label="Allow anyone to join without approval" :checked="true" />
                </div>

                <div class="space-x-2 float-end">
                    <Button @click="close" variant="secondary">Cancel</Button>
                    <Button :disabled="!teamName">Create Team</Button>
                </div>
            </div>
        </form>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '../../../components/ui/BaseModal.vue';
import Button from '../../../components/ui/Button.vue';
import Checkbox from '../../../components/ui/Checkbox.vue';
import BaseTextField from '../../../components/ui/BaseTextField.vue';
import BaseMultiSelect from '../../../components/ui/BaseMultiSelect.vue';

defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'create'])

const teamName = ref('')
const selectedUsers = ref([])
const userOptions = [
    { title: 'Olivia Rhye', _id: 1 },
    { title: 'Ali Raza', _id: 2 },
    { title: 'Sarah Lee', _id: 3 }
]

function close() {
    emit('update:modelValue', false)
}

function submit() {
    emit('create', { teamName: teamName.value, users: selectedUsers.value })
    // close()
}
</script>