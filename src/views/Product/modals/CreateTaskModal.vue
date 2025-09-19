<template>
    <BaseModal v-model="isOpen" modalClass="!py-0" size="lg">
        <!-- Header -->
        <div
            class="sticky top-0 flex flex-col z-2 items-start pt-6 px-6 border-b border-border-gray bg-light-black pb-4 mb-4">
            <h2 class="text-xl font-semibold">Create Ticket</h2>
            <p class="text-sm text-text-secondary  text-secondary mt-1">
                Provide the details below and click <span class="font-medium">Add Ticket</span>.
            </p>
        </div>

        <!-- Body -->
        <div class="space-y-6 px-6">
            <!-- Title -->
            <BaseTextField theme="dark" v-model="form.title" label="Ticket Title"
                placeholder="e.g., Implement real-time notifications" :error="!!titleError" :message="titleError"
                @blur="touched.title = true" />

            <!-- Description -->
            <BaseTextAreaField theme="dark" v-model="form.description" label="Description"
                placeholder="What needs to be done, acceptance criteria, links…" @blur="touched.description = true" />

            <!-- Assign To -->
            <BaseMultiSelect theme="dark" v-model="form.assignees" :options="assigneeOptions" label="Assign to"
                placeholder="Select assignee(s) or type to search" :allowCustom="true" />

            <!-- Priority / Status / Type -->
            <div class=" space-y-2">
                <div>
                    <label class="block text-base font-medium text-white mb-2">Priority</label>
                    <div class="flex flex-wrap gap-2">
                        <button v-for="p in priorities" :key="p" @click="form.priority = p" :class="[
                            'px-3 py-1.5 rounded-full text-sm transition',
                            form.priority === p ? 'bg-white text-text-primary' : 'bg-[#FFFFFF1F] text-white'
                        ]">{{ p }}</button>
                    </div>
                </div>

                <div>
                    <label class="block text-base font-medium text-white mb-2">Status</label>
                    <div class="flex flex-wrap gap-2">
                        <button v-for="s in statuses" :key="s" @click="form.status = s" :class="[
                            'px-3 py-1.5 rounded-full text-sm transition',
                            form.status === s ? 'bg-white text-text-primary' : 'bg-[#FFFFFF1F] text-white'
                        ]">{{ s.title }}</button>
                    </div>
                </div>

                <div>
                    <label class="block text-base font-medium text-white mb-2">Type</label>
                    <div class="flex flex-wrap gap-2">
                        <button v-for="t in types" :key="t" @click="form.type = t" :class="[
                            'px-3 py-1.5 rounded-full text-sm transition',
                            form.type === t ? 'bg-white text-text-primary' : 'bg-[#FFFFFF1F] text-white'
                        ]">{{ t.title }}</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end mt-8 sticky bottom-0 dark:bg-light-black gap-2 p-6 border-t border-border-gray">
            <Button variant="secondary" @click="cancel">Cancel</Button>
            <Button variant="primary" :disabled="!isValid" @click="create">
                {{ isSubmitting ? 'Adding…' : 'Add Ticket' }}
            </Button>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import BaseModal from '../../../components/ui/BaseModal.vue'
import BaseTextField from '../../../components/ui/BaseTextField.vue'
import BaseTextAreaField from '../../../components/ui/BaseTextAreaField.vue'
import BaseMultiSelect from '../../../components/ui/BaseMultiSelect.vue'
import Button from '../../../components/ui/Button.vue'
import { useFetchCardTypes, useFetchStatus } from '../../../queries/useProductCard'
import { useRoute } from 'vue-router'

/** Props */
const props = defineProps({
  modelValue: Boolean
})
const route = useRoute()
const isOpen = ref(props.modelValue);
/** Options (customize as needed) */
const priorities = ['High', 'Medium', 'Low']
const { data:statuses } =  useFetchStatus(route.params.id)
const { data:types } = useFetchCardTypes(route.params.id);
/** Assignees list (id/label/value). Replace with your real data source. */
const assigneeOptions = [
    { title: 'Iman Z — iman.z@streamedinc.com', _id: 'iman.z@streamedinc.com' },
    { title: 'Fida R — fida.r@streamedinc.com', _id: 'fida.r@streamedinc.com' },
]

/** Form */
const form = reactive({
    title: '',
    description: '',
    assignees: [] as string[], // emails or ids depending on your usage
    priority: 'Medium',
    status: 'To Do',
    type: 'Task',
})

/** Validation (same style as your lane modal) */
const touched = reactive({ title: false, description: false })
const titleError = computed(() => {
    if (!touched.title) return ''
    if (!form.title.trim()) return 'Title is required'
    return ''
})
const isValid = computed(() => !titleError.value)

/** UX flags */
const isSubmitting = computed(() => false) // wire to your mutation if needed

/** Actions */
function cancel() {
    console.log(">>>");
    emit('update:modelValue', false)
    reset();
}
function reset() {
    form.title = ''
    form.description = ''
    form.assignees = []
    form.priority = 'Medium'
    form.status = 'To Do'
    form.type = 'Task'
    touched.title = false
    touched.description = false
}
function create() {
    touched.title = true
    if (!isValid.value) return

    // const payload = {
    //     title: form.title.trim(),
    //     description: form.description.trim(),
    //     assignees: form.assignees.slice(),
    //     priority: form.priority,
    //     status: form.status,
    //     type: form.type,
    //     createdAt: new Date().toISOString(),
    // }

    // 👉 Replace this emit/block with your actual mutation (e.g., useCreateTicket).
    // After success:
    // queryClient.invalidateQueries(...)
    // and close the modal.
    // For now, we’ll just close & reset:
    // console.log('ticket payload', payload)

        reset()

    // If you want to notify parent:
    // emit('created', payload)
}
/** Define Emits */
const emit = defineEmits(['update:modelValue'])

</script>