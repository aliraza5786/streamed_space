<template>
  <div
    @click="emit('Select', element)"
    class="bg-white border border-border E5E7EB] dark:border-dark-border dark:bg-dark-black  rounded-xl shadow-sm p-4 space-y-3 w-full"
    :style="{
      borderTopColor: element?.color_code || '#E5E7EB',
      borderTopWidth: '3px',
      borderTopStyle: 'solid'
    }"
  >
    <!-- Tags -->
    <div class="flex gap-2">
     
      <StatusChanger
        v-if="selected_view_by !== 'card_status'"
        @click.stop
        :default="element?.card_status_id?._id"
        :cardId="element?._id"
      />
      <div @click.stop>
        <PriorityChanger
          v-if="selected_view_by !== 'card_priority'"
          :default="element?.priority_id"
          :cardId="element?._id"
        />
      </div>
    </div>

    <!-- Title & Description -->
    <div>
      <h3 class="text-base font-semibold text-text-primary ">
        {{ element?.title }}
      </h3>
      <p
        v-html="element?.description"
        class="text-sm text-text-text-secondary  text-secondary line-clamp-3"
      />
    </div>

    <!-- Footer Meta -->
    <div class="flex justify-between items-center mt-2">
      <div class="flex items-center gap-2 text-sm text-text-text-secondary  text-secondary uppercase">
        <img src="../../../assets/icons/ticket.svg" alt="ticket" />
        <span>{{ element?.card_code }}</span>
      </div>

      <!-- Assignment trigger (stops bubbling) -->
      <div @click.stop>
        <AssigmentDropdown
          :users="members"
          :model-value="assigneeId"
          :disabled="saving"
          @update:modelValue="setAssignee"
        />
      </div>
    </div>

    <!-- Bottom Info -->
    <div @click.stop class="flex justify-between text-xs text-text-secondary -500 text-secondary mt-2">
      <!-- <DatePicker
        :model-value="dueDate"
        theme="dark"
        emit-as="ymd"
        :disabled="savingDate"
        @update:modelValue="setDueDate"
      /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import PriorityChanger from './PriorityChanger.vue'
import StatusChanger from './StatusChanger.vue'
// import TypeChanger from './TypeChanger.vue'
import AssigmentDropdown from './AssigmentDropdown.vue'
// import DatePicker from './DatePicker.vue'

interface User {
  _id: string
  name: string
  email: string
  avatar_url?: string
}
interface Lane { color_code?: string }
interface Card {
  _id?: string | number
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  workspace_lane_id?: Lane
  title?: string
  description?: string
  card_code?: string
  created_at?: string | number | Date
  assignee_id?: string | null
  due_date?: string | null // <-- added
}

const props = defineProps<{
  selected_view_by: any
  element: any
  members: User[]
}>()

const emit = defineEmits<{
  (e: 'Select', el: Card): void
  (e: 'AssigneeChange', payload: { cardId?: string | number; userId: string | null }): void
  (e: 'DueDateChange', payload: { cardId?: string | number; due_date: string | null }): void
}>()

/* ===== Assignee (optimistic) ===== */
const assigneeId = ref<string | null>(props.element?.assignee_id ?? null)
watch(() => props.element?.assignee_id, v => { assigneeId.value = v ?? null })

const saving = ref(false)
async function setAssignee(userId: string | null) {
  if (!props.element?._id || saving.value) return
  const prev = assigneeId.value
  assigneeId.value = userId
  saving.value = true
  try {
    // await api.patch(`/cards/${props.element._id}/assignee`, { user_id: userId })
    emit('AssigneeChange', { cardId: props.element._id, userId })
  } catch (e) {
    assigneeId.value = prev // rollback
    console.error('Failed to update assignee', e)
  } finally {
    saving.value = false
  }
}

/* ===== Due date (optimistic) ===== */
const dueDate = ref<string | null>(props.element?.due_date ?? null)
watch(() => props.element?.due_date, v => { dueDate.value = v ?? null })

// const savingDate = ref(false)
// async function setDueDate(v: string | null) {
//   if (!props.element?._id || savingDate.value) return
//   const prev = dueDate.value
//   dueDate.value = v
//   savingDate.value = true
//   try {
//     // await api.patch(`/cards/${props.element._id}/due-date`, { due_date: v })
//     emit('DueDateChange', { cardId: props.element._id, due_date: v })
//   } catch (e) {
//     dueDate.value = prev // rollback
//     console.error('Failed to update due date', e)
//   } finally {
//     savingDate.value = false
//   }
// }
</script>
