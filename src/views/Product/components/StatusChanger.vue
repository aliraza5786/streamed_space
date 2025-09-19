<template>
    <div ref="root" class="relative inline-block text-left ">
        <!-- Trigger pill -->
        <button type="button"
            class="inline-flex !text-text-primary bg-bg-surface text-[10px] items-center gap-2 rounded-full px-3 py-1  focus:outline-none  hover:opacity-90"
            :aria-expanded="open ? 'true' : 'false'" @click="toggle" :disabled="disabled">
            <span class="truncate capitalize " >{{ labelFor(status) || 'to do' }}</span>

        </button>

        <!-- Menu -->
        <transition name="fade">
            <div v-if="open" role="menu"
                class="absolute z-50 mt-2  origin-top-left rounded-md border border-border   bg-bg-dropdown p-2 shadow-lg left-0"
                @keydown.esc.prevent.stop="close">
                <ul class="space-y-2 max-h-50 overflow-y-auto" ref="list">
                    <li v-for="(opt, idx) in data" :key="opt._id">
                        <button role="menuitemradio" :aria-checked="status === opt._id ? 'true' : 'false'"
                            class="flex !text-text-primary  w-full items-center justify-between rounded px-1 py-1 text-[10px] gap-1 focus:outline-none focus:ring-2 hover:bg-bg-dropdown-menu-hover"
                            @click="select(opt._id)" @keydown.down.prevent="focusNext(idx + 1)"
                            @keydown.up.prevent="focusNext(idx - 1)">
                            <span class="rounded-full px-3  py-1 text-text-primary">{{
                                opt.title
                            }}</span>

                        </button>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import {  useFetchStatus, useUpdateProductCard } from '../../../queries/useProductCard';
import { useRoute } from 'vue-router';
const route = useRoute();
const { data } = useFetchStatus(route.params.id)

const props = withDefaults(defineProps<{
    default: string
    disabled?: boolean
    cardId: string | number
}>(), {

    disabled: false
})

const status = ref<string>(props.default)
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const list = ref<HTMLElement | null>(null)

function labelFor(p: string) { if(data.value) return data.value.find((o: any) => o._id === p)?.title }
function toggle() { if (!props.disabled) open.value = !open.value }
function close() { open.value = false }

function select(val: string) {
    status.value = val
    updateCardStatus(props.cardId, val)
    close()
}
const mutate = useUpdateProductCard()
function updateCardStatus(cardId: string | number, newStatus: string) {
    mutate.mutate({
        id: cardId,
        payload: {
            card_status_id: newStatus
        }
    })
}

function focusNext(idx: number) {
    const items = list.value?.querySelectorAll('button[role="menuitemradio"]')
    if (!items?.length) return
    const max = items.length - 1
    const next = Math.max(0, Math.min(idx, max))
        ; (items[next] as HTMLElement).focus()
}

function onDocClick(e: MouseEvent) {
    if (!root.value) return
    if (!root.value.contains(e.target as Node)) close()
}

onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity .12s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>