<template>
    <div class="h-full flex p-6 gap-3 ">
        <!-- Columns (horizontal) -->
        <Draggable v-model="localBoard.columns" item-key="_id" group="columns" :animation="180"
            :ghost-class="'kanban-ghost'" :chosen-class="'kanban-chosen'" :drag-class="'kanban-dragging'"
            :force-fallback="true" class="flex gap-3 min-w-max" direction="horizontal" @end="onColumnsEnd">
            <!-- Each column -->
            <template #item="{ element: column }">
                <div class="min-w-[320px] max-w-[320px]   rounded-lg bg-bg-surface  "
                    style="height: calc(100dvh - 190px);">
                    <!-- Header: use your own KanbanColumn header if you prefer -->
                    <KanbanColumn :variable_id="variable_id" @select:ticket="(v: Ticket) => emit('select:ticket', v)" :column="column"
                        @reorder="onTicketEnd" />
                </div>
            </template>
        </Draggable>

   
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Draggable from 'vuedraggable'
import KanbanColumn from './KanbanColumn.vue'
/** Types (adjust to your app) */
export interface Ticket { _id: string | number;[k: string]: any }
export interface Column { _id: string | number; title: string; cards: Ticket[] }
export interface Board { columns: Column[] }

const props = withDefaults(defineProps<{
    board: Column[]
    /** optional callback prop to mirror your React API */
    onBoardUpdate?: (board: Board) => void
    variable_id:string
}>(), {})

const emit = defineEmits<{
    /** v-model style if you want to two-way bind the board */
    (e: 'update:board', payload: Board): void
    (e: 'select:ticket', payload: Ticket): void
    /** fires every time a reorder occurs (column or ticket) */
    (e: 'reorder', payload: {
        type: 'column' | 'ticket'
        /** the whole updated board, already mutated */
        board: Board
        /** when ticket: source/target indices & column ids (for persistence) */
        meta?: {
            cardId?: string | number
            fromColumnId?: string | number
            toColumnId?: string | number
            oldIndex?: number
            newIndex?: number
        }

    }): void
    (e: 'addColumn', payload: any): void
}>()

/** Local mirror so we never mutate props directly (optimistic UI) */
const localBoard = ref<Board>(cloneBoard(props.board))

watch(() => props.board, (v) => {
    // Only replace when the reference changes (e.g. from server)
    localBoard.value = cloneBoard(v)
})

/** Column drag end -> columns array already reordered by vuedraggable */
function onColumnsEnd(e: any) {
    const oldIndex = e.oldIndex
    const newIndex = e.newIndex

    // Model should be updated now; grab the moved column
    const moved = props.board[oldIndex]
    const id = moved?.title ? moved?.title : ""

    if (id != null) {
        pushUpdate('column', { id, oldIndex, newIndex })
    }

}

function onTicketEnd(e: any) {
    console.log(e);

    pushUpdate('ticket', e)
}


/** Broadcast updates: emit + optional callback prop */
function pushUpdate(type: 'column' | 'ticket', meta?: any) {
    const board = localBoard.value
    emit('update:board', board)
    emit('reorder', { type, board, meta })
    props.onBoardUpdate?.(board)
}

/** Helpers */
function cloneBoard(b: Column[]): Board {
    return {
        columns: (b ?? []).map(c => ({
            _id: c._id,
            title: c.title,
            cards: (c.cards ?? []).map(t => ({ ...t }))
        }))
    }
}


</script>

<style scoped>
/* Drag classes from vuedraggable / SortableJS */
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