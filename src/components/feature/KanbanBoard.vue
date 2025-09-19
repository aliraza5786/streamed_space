<template>
  <div class="p-4 overflow-x-auto flex-auto flex-grow flex gap-4" @click.self="clearInputs">
    <!-- Empty -->
    <div v-if="!stateCols.length"
      class="w-full flex flex-col max-w-[328px] min-h-[555px] dark:bg-light-black bg-[#F3F4F6] rounded-lg items-center justify-center py-10 px-3">
      <img :src="emptyState.icon" class="w-25 h-25 mb-4" />
      <h4 class="text-base font-medium text-text-primary  text-center mt-8">{{ emptyState.title }}</h4>
      <p class="text-sm font-medium text-text-secondary   mt-1 text-center">{{ emptyState.description }}</p>
      <Button @click="emptyState.buttonClickHandler" class="mt-4">{{ emptyState.buttonLabel }}</Button>
    </div>

    <!-- Columns -->
    <div v-else class="flex gap-6 items-start h-full">
      <div v-for="(column, colIndex) in stateCols" :key="`column-${colIndex}`"
        class="max-w-[328px] min-w-[328px] min-h-[555px] h-full dark:bg-light-black bg-[#F3F4F6] pt-0 rounded-lg relative p-2 flex flex-col max-h-full overflow-auto"
        @click.stop @dragover.prevent="onColumnDragOver(colIndex)" @dragenter.prevent
        @drop="drop(colIndex, column.cards.length)">

        <!-- Header -->
        <div class="flex justify-between items-center py-3 px-4 sticky top-0 dark:bg-light-black bg-[#F3F4F6] z-10">
          <div class="flex gap-2">
            <h2 class="font-semibold text-sm text-text-primary  capitalize">{{ column.title }}</h2>
            <div
              class="bg-[#2B2C301A] flex items-center justify-center font-semibold text-[8px] w-4.5 h-4.5 rounded-full text-text-primary  dark:bg-light-bg">
              {{ column.cards.length }}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Plus class="w-4 cursor-pointer" @click="onAddTicket(colIndex)" />
            <DropMenu :items="getMenuItems()" />
          </div>
        </div>

        <!-- Cards list -->
        <transition-group name="card" tag="div" class="flex-1 min-h-[40px] overflow-x-hidden w-full overflow-y-auto">

          <!-- Each wrapper is a single child of the group (prevents key warnings) -->
          <div v-for="(card, index) in column.cards" :key="`card-${colIndex}-${index}`">
            <!-- Gap BEFORE each card -->
            <div class="h-3 transition-all duration-150" :class="placeholderClass(colIndex, index)"
              @dragover.prevent="onDragOver($event, colIndex, index)" @dragenter.prevent="setHover(colIndex, index)"
              @dragleave="clearHover" @drop="drop(colIndex, index)" />

            <!-- Draggable card -->
            <div class="cursor-move" draggable="true" @dragstart="startDrag($event, colIndex, index, card)"
              @dragend="endDrag" @dragover.prevent="onDragOver($event, colIndex, index)"
              @dragenter.prevent="setHover(colIndex, index)" @drop="dropOnCard(colIndex, index)">
              <slot name="kanban-item" :element="card" :colIndex="colIndex" :cardIndex="index" />
            </div>
          </div>

          <!-- END placeholder (always rendered and keyed) -->
          <div :key="`end-${column._id}`" class="h-6 transition-all duration-150 rounded"
            :class="placeholderClass(colIndex, stateCols[colIndex].cards.length)"
            @dragover.prevent="onDragOver($event, colIndex, stateCols[colIndex].cards.length)"
            @dragenter.prevent="setHover(colIndex, stateCols[colIndex].cards.length)" @dragleave="clearHover"
            @drop="drop(colIndex, stateCols[colIndex].cards.length)" />
        </transition-group>

        <!-- Empty target (lives outside the group) -->
        <div v-if="!column.cards.length" class="h-full rounded flex items-center justify-center text-text-secondary -400"
          @dragover.prevent="onDragOver($event, colIndex, 0)" @dragenter.prevent="setHover(colIndex, 0)"
          @dragleave="clearHover" @drop="drop(colIndex, 0)">
          Drop here
        </div>
      </div>
    </div>

    <!-- Add Column -->
    <div class="min-w-[328px]" @click.stop>
      <div v-if="activeAddList" class="bg-[#F3F4F6] dark:bg-light-black rounded-lg p-4">
        <BaseTextField :autofocus="true" v-model="newColumn" theme="dark" placeholder="Add New list"
          @keyup.enter="emitAddColumn" />
        <p class="text-xs mt-1.5">You can add details while editing</p>
        <div class="flex items-center mt-3 gap-3">
          <Button @click="emitAddColumn" varaint="primary" class="px-3 py-1 bg-black text-white rounded">Add
            list</Button>
          <FontAwesomeIcon class="cursor-pointer" :icon="['fas', 'close']" @click="setActiveAddList" />
        </div>
      </div>
      <button v-else
        class="text-sm text-text-secondary  dark:bg-light-black  opacity-70 py-2.5 cursor-pointer font-medium flex items-center justify-center w-full gap-2 bg-[#F3F4F6] rounded-lg"
        @click.stop="setActiveAddList">
        + Add List
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from '../ui/Button.vue'
import Plus from '../../assets/IconTemplates/plus.vue'
import DropMenu from '../ui/DropMenu.vue'
import BaseTextField from '../ui/BaseTextField.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

type Id = string | number
interface Card { id?: Id; _id?: Id;[k: string]: any }
interface Column { id?: Id; _id?: Id; title: string; cards: Card[] }

const props = defineProps<{
  columns: Column[]
  onAddTicket: (colIndex: number) => void
  emptyState: { title: string; description: string; icon: string; buttonLabel: string; buttonClickHandler: () => void }
}>()

/* Local mirror (optimistic) — shallow clone only when reference changes */
const stateCols = ref<Column[]>([])
watch(() => props.columns, (v) => {
  stateCols.value = (v || []).map(c => ({ ...c, cards: [...(c.cards || [])] }))
}, { immediate: true }) // no deep watch to avoid churn mid-drag

const emit = defineEmits<{
  (e: 'addColumn', title: string): void
  (e: 'reorder', payload: {
    cardId: Id
    from: { columnId: Id; index: number }
    to: { columnId: Id; index: number }
    afterCardId: Id | null
  }): void
}>()

/* Add column */
const activeAddList = ref(false)
const newColumn = ref('')
function setActiveAddList() { activeAddList.value = !activeAddList.value }
function emitAddColumn() {
  const t = newColumn.value.trim()
  if (!t) return
  emit('addColumn', t)
  newColumn.value = ''
  activeAddList.value = false
}

/* DnD state */
const dragging = ref<{ col: number; index: number; cardId: Id } | null>(null)
const hoverTarget = ref<{ col: number; index: number } | null>(null)

function getId(x: { id?: Id; _id?: Id }) { return x._id ? x._id : Math.random().toString(36).slice(2) }

/* IMPORTANT: set dataTransfer so Safari/Chrome reliably fire `drop` */
function startDrag(e: DragEvent, col: number, index: number, card: Card) {
  const id = getId(card)
  dragging.value = { col, index, cardId: id }
  try {
    e.dataTransfer?.setData('text/plain', String(id))
    e.dataTransfer!.effectAllowed = 'move'
  } catch { }
}

function endDrag() {
  dragging.value = null
  hoverTarget.value = null
}

function onDragOver(e: DragEvent, col: number, index: number) {
  e.dataTransfer && (e.dataTransfer.dropEffect = 'move')
  setHover(col, index)
}

function setHover(col: number, index: number) { hoverTarget.value = { col, index } }
function clearHover() { hoverTarget.value = null }

function onColumnDragOver(col: number) {
  const len = stateCols.value[col]?.cards.length ?? 0
  setHover(col, len)
}

/* Placeholder style */
function placeholderClass(col: number, index: number) {
  const h = hoverTarget.value
  return h && h.col === col && h.index === index ? 'bg-black/10 dark:bg-white/20 my-2 rounded' : ''
}

/* Move (optimistic) */
function moveCard(sourceCol: number, sourceIndex: number, targetCol: number, targetIndex: number) {
  const cols = stateCols.value
  const fromCards = cols[sourceCol]?.cards
  const toCards = cols[targetCol]?.cards
  if (!fromCards || !toCards) return null
  const [card] = fromCards.splice(sourceIndex, 1)
  if (!card) return null
  if (sourceCol === targetCol && sourceIndex < targetIndex) targetIndex--
  if (targetIndex < 0) targetIndex = 0
  if (targetIndex > toCards.length) targetIndex = toCards.length
  toCards.splice(targetIndex, 0, card)
  return card
}

function drop(targetCol: number, targetIndex: number) {
  if (!dragging.value) return
  const { col: sourceCol, index: sourceIndex, cardId } = dragging.value
  if (sourceCol === targetCol && sourceIndex === targetIndex) { endDrag(); return }

  const card = moveCard(sourceCol, sourceIndex, targetCol, targetIndex)
  if (!card) { endDrag(); return }

  const after = stateCols.value[targetCol].cards[targetIndex - 1]
  emit('reorder', {
    cardId,
    from: { columnId: getId(stateCols.value[sourceCol]), index: sourceIndex },
    to: { columnId: getId(stateCols.value[targetCol]), index: targetIndex },
    afterCardId: after ? getId(after) : null
  })

  endDrag()
}

function dropOnCard(col: number, index: number) { drop(col, index) }

/* Misc */
function clearInputs() { activeAddList.value = false }
function getMenuItems() { return [{ label: 'Move right' }, { label: 'Move left' }, { label: 'Delete', danger: true }] }
</script>

<style scoped>
.card-move {
  transition: all .15s ease;
}
</style>