<template>
  <div class="relative" @click.stop @keydown.esc="close">
    <!-- Trigger -->
    <button type="button" class="inline-flex items-center gap-2 rounded-full border border-border E5E7EB] dark:border-dark-border px-2.5 py-1.5 text-sm
               bg-white dark:bg-dark-black hover:bg-gray-50 dark:hover:bg-[#1a1a1f] transition" @click="toggle"
      :disabled="disabled">
      <template v-if="currentAssignee">
        <img v-if="currentAssignee.avatar_url" :src="currentAssignee.avatar_url" class="w-6 h-6 rounded-full" alt="" />
        <div v-else class="w-6 h-6 rounded-full text-[11px] font-semibold text-white flex items-center justify-center"
          :style="{ backgroundColor: colorFor(currentAssignee) }">
          {{ initials(currentAssignee.name || currentAssignee.email) }}
        </div>
        <span class="truncate max-w-[120px]">{{ currentAssignee.name || currentAssignee.email }}</span>
      </template>

      <template v-else>
        <!-- Empty state -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
        </svg>
        <span class="opacity-80">Assign</span>
      </template>
    </button>

    <!-- Popover -->
    <div v-if="open"
      class="absolute right-0 z-50 mt-2 w-60 rounded-2xl border border-border E5E7EB] dark:border-dark-border bg-white dark:bg-dark-black shadow-xl"
      @click.stop>
      <div class="p-3">
        <input ref="searchRef" v-model="query" type="text" placeholder="Add people by name or email" class="w-full rounded-xl border border-border E5E7EB] dark:border-dark-border bg-white dark:bg-[#111114] px-3 py-2 outline-none
                   text-sm dark:!text-white" />
      </div>

      <ul class="max-h-80 overflow-auto py-1">
        <li v-for="u in filteredUsers" :key="u._id"
          class="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#17171c] cursor-pointer">
          <div class="flex items-center gap-3 min-w-0">
            <img v-if="u.avatar_url" :src="u.avatar_url" class="w-8 h-8 rounded-full" alt="" />
            <div v-else class="w-8 h-8 rounded-full text-xs font-semibold text-white flex items-center justify-center"
              :style="{ backgroundColor: colorFor(u) }">
              {{ initials(u.name || u.email) }}
            </div>

            <div class="min-w-0">
              <div class="text-sm font-medium truncate ">{{ u.name }}</div>
              <div class="text-xs text-text-secondary -500 text-secondary-400 truncate">{{ u.email }}</div>
            </div>
          </div>

          <div class="shrink-0">
            <button v-if="modelValue === u._id" class="text-sm text-red-500 hover:underline" @click.stop="unassign()">
              Remove
            </button>
            <button v-else class="text-sm text-[#2563eb] hover:underline" @click.stop="assign(u._id)">
              Assign
            </button>
          </div>
        </li>

        <li v-if="!filteredUsers.length" class="px-4 py-8 text-sm text-text-secondary -500 text-secondary-400">
          No matches
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useWorkspacesRoles } from '../../../queries/useWorkspace';
import { useRouteIds } from '../../../composables/useQueryParams';

const {workspaceId}= useRouteIds()
const { data: roles } = useWorkspacesRoles(workspaceId.value);

const props = defineProps<{

  modelValue: string | null
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'assign', user: any): void
  (e: 'unassign'): void
}>()

const open = ref(false)
const query = ref('')
const searchRef = ref<HTMLInputElement | null>(null)

const currentAssignee = computed(() =>
  roles.value.find((u: any) => u._id === props.modelValue) || null
)

const filteredUsers = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return roles.value
  return roles.value.filter((u: any) =>
    (u.name || '').toLowerCase().includes(q) ||
    (u.email || '').toLowerCase().includes(q)
  )
})

function toggle() { open.value = !open.value }
function close() { open.value = false }
function onDocClick() { if (open.value) close() }

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

watch(open, (v) => {
  if (v) requestAnimationFrame(() => searchRef.value?.focus())
  else query.value = ''
})

function assign(userId: string) {
  const user = roles.value.find((u: any) => u._id === userId)
  emit('update:modelValue', userId)
  if (user) emit('assign', user)
  close()
}
function unassign() {
  emit('update:modelValue', null)
  emit('unassign')
  close()
}

/* UI helpers */
function initials(s?: string) {
  const t = (s || '').trim()
  if (!t) return '?'
  const parts = t.split(/\s+/)
  return (parts[0][0] + (parts[1]?.[0] || parts[0][1] || '')).toUpperCase()
}
function colorFor(u: any) {
  const seed = (u._id || u.email || u.name || '').split('')
    .reduce((a:any, c:any) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
  const palette = ['#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#EC4899', '#22D3EE', '#84CC16', '#FB7185', '#F97316']
  return palette[seed % palette.length]
}
</script>