<template>
  <div class="flex bg-bg-body flex-col min-h-[600px] h-full w-80 rounded-lg transition-all duration-200"
    :class="columnBgClass">
    <!-- Column header -->
    <div class="flex items-center justify-between w-full p-4 border-b border-border cursor-grab">
      <div class="flex items-center gap-2 flex-auto max-w-4/5">
        <!-- Title: display vs edit -->
        <button v-if="!isEditingTitle"
          class="font-semibold overflow-ellipsis line-clamp-1 text-nowrap  text-foreground px-1 py-0.5 rounded hover:bg-bg-card focus:outline-none focus:ring-1 focus:ring-border cursor-text"
          @click="beginEdit" @keydown.enter.prevent="beginEdit" title="Click to rename">
          {{ localTitle }}
        </button>

        <input v-else autofocus ref="titleInputRef" v-model="localTitle"
          class="font-semibold inline text-foreground px-1 py-0.5 rounded bg-transparent border border-border focus:outline-none focus:ring-1 focus:ring-border"
          @keydown.enter.prevent="commitTitle" @keydown.esc.prevent="cancelTitle" @blur="commitTitle" @mousedown.stop />

        <span
          class="text-xs bg-muted bg-bg-card aspect-square flex justify-center items-center text-muted-foreground p-1 min-w-6 rounded-full">
          {{ localTickets.length }}
        </span>
      </div>

      <DropMenu :items="getMenuItems()">
        <template #trigger>
          <FontAwesomeIcon :icon="['fas', 'ellipsis']" />
        </template>
      </DropMenu>
    </div>

    <!-- Tickets list -->
    <Draggable v-model="localTickets" item-key="_id" class="flex-1 p-4 space-y-3 overflow-y-auto"
      :group="{ name: 'tickets', pull: true, put: true }" :animation="180" :ghost-class="'kanban-ghost'"
      :chosen-class="'kanban-chosen'" :drag-class="'kanban-dragging'" @change="onTicketsChange">
      <template #item="{ element: ticket }">
        <div>
          <KanbanTicket @click="emit('select:ticket', ticket)" :ticket="ticket" />
        </div>
      </template>

      <template #footer>
        <div v-if="!localTickets.length"
          class="flex items-center justify-center h-32 text-muted-foreground text-sm border border-border text-secondary border-dashed rounded-lg">
          Drop tickets here
        </div>
      </template>
    </Draggable>
  </div>

  <div class="no-drag-zone" draggable="false" @mousedown.stop @touchstart.stop @pointerdown.stop>
    <ConfirmDeleteModal @click.stop="" v-model="showDelete" title="Delete List" itemLabel="list" :itemName="localTitle"
      :requireMatchText="localTitle" confirmText="Delete workspace" cancelText="Cancel" size="md"
      :loading="deletingList" @confirm="handleDeleteColumn" @cancel="() => {
        showDelete = false
      }">

    </ConfirmDeleteModal>
  </div>

</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import Draggable from 'vuedraggable'
import KanbanTicket from './KanbanTicket.vue'
import DropMenu from '../../ui/DropMenu.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useAddList } from '../../../queries/useSheets'
import { useQueryClient } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import ConfirmDeleteModal from '../../../views/Product/modals/ConfirmDeleteModal.vue'
import { toast } from 'vue-sonner'
const showDelete = ref(false)
const route = useRoute()
type Id = string | number
export interface Ticket { _id: Id;[k: string]: any }
export interface Column { _id: Id; title: string; cards: Ticket[] }

const props = defineProps<{ column: Column, variable_id: string }>()
const emit = defineEmits<{
  (e: 'update:column', payload: Column): void
  (e: 'reorder', payload: {
    moved: Ticket
    fromColumnId: Id
    toColumnId: Id
    oldIndex: number | null
    newIndex: number | null
  }): void
  (e: 'select:ticket', payload: Ticket): void
  /** Optional: bubble a dedicated rename signal if you persist title separately */
  (e: 'rename:column', payload: { columnId: Id; title: string }): void
}>()

/** Inline title editing state */
const isEditingTitle = ref(false)
const localTitle = ref(props.column.title)
const titleInputRef = ref<HTMLInputElement | null>(null)

watch(() => props.column.title, (v) => { localTitle.value = v })

function beginEdit() {
  isEditingTitle.value = true
  nextTick(() => {
    if (titleInputRef.value) {
      titleInputRef.value.focus()
      titleInputRef.value.select()
    }
  })
}

function commitTitle() {
  const newTitle = (localTitle.value ?? '').trim() || 'Untitled'
  if (newTitle !== props.column.title) {
    updateList({
      workspace_id: route.params.id,
      module_id: route.params.module_id,
      value: newTitle,
      variable_id: props?.variable_id,

    })
    // Optimistically update the column object the same way you do for cards
    emit('update:column', { ...props.column, title: newTitle })
    emit('rename:column', { columnId: props.column._id, title: newTitle })
  } else {
    // keep local in sync with prop if nothing changed
    localTitle.value = props.column.title
  }

  isEditingTitle.value = false
}

function cancelTitle() {
  localTitle.value = props.column.title
  isEditingTitle.value = false
}

/** Tickets local mirror */
const localTickets = ref<Ticket[]>([...(props.column.cards ?? [])])
watch(() => props.column.cards, (v) => { localTickets.value = [...(v ?? [])] })
watch(localTickets, (v) => { emit('update:column', { ...props.column, cards: v }) }, { deep: true })

/** Background by id */
const columnBgMap: Record<string, string> = {
  backlog: 'bg-column-backlog',
  todo: 'bg-column-todo',
  progress: 'bg-column-progress',
  done: 'bg-column-done',
}
const columnBgClass = computed(() => {
  const key = String(props.column._id)
  return columnBgMap[key] ?? 'bg-muted/30'
})

/** Sortable change */
function onTicketsChange(evt: any) {
  const moved = evt.moved ?? evt.added
  if (!moved) return
  emit('reorder', {
    moved: moved.element,
    fromColumnId: evt.from?.__draggable_component__?.$props?.listOwnerId ?? props.column?.title,
    toColumnId: props.column._id,
    oldIndex: moved.oldIndex ?? null,
    newIndex: moved.newIndex ?? null,
  })
}
const queryClient = useQueryClient()
const { mutate: deleteList, isPending: deletingList } = useAddList({
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['sheet-list'] })
    showDelete.value = false;
    toast.success('deleted list succesfully')
  }
})
const { mutate: updateList, } = useAddList({
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['sheet-list'] })
    // showDelete.value = false;
    // toast.success('deleted list succesfully')
  }
})
function getMenuItems() {
  return [{
    label: 'Delete', danger: true, action: () => {
      showDelete.value = true;
    }
  }]
}
const handleDeleteColumn = () => {
  deleteList({
    workspace_id: route.params.id,
    module_id: route.params.module_id,
    value: props.column.title,
    variable_id: props?.variable_id,
    is_trash: true
  })
}
</script>

<style scoped>
.kanban-ghost {
  opacity: 0.6;
  transform: rotate(2deg) scale(0.98);
}

.kanban-chosen {
  outline: 2px dashed rgba(0, 0, 0, .15);
}

.kanban-dragging {
  cursor: grabbing !important;
}
</style>