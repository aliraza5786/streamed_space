<template>
    <div ref="root" class="relative inline-block text-left">
      <!-- Trigger pill -->
      <button
        type="button"
        class="inline-flex text-[10px] items-center gap-2 rounded-full px-3 py-1 focus:outline-none hover:opacity-90 border border-border"
        :class="disabled ? 'opacity-60 cursor-not-allowed' : ''"
        :style="styleFor(priority)"
        :aria-expanded="open ? 'true' : 'false'"
        @click="toggle"
        :disabled="disabled"
      >
        <span class="truncate">{{ labelFor(priority) }}</span>
      </button>
  
      <!-- Menu -->
      <transition name="fade">
        <div
          v-if="open"
          role="menu"
          class="absolute z-50 mt-2 origin-top-left rounded-md border border-border bg-bg-dropdown p-2 shadow-lg left-0"
          @keydown.esc.prevent.stop="close"
        >
          <ul class="space-y-2" ref="list">
            <li v-for="(opt, idx) in options" :key="opt._id">
              <button
                role="menuitemradio"
                :aria-checked="priority === opt._id ? 'true' : 'false'"
                class="flex w-full items-center justify-between rounded px-1 py-1 text-[10px] gap-1 focus:outline-none focus:ring-2 hover:bg-bg-dropdown-menu-hover"
                @click="select(opt._id)"
                @keydown.down.prevent="focusNext(idx + 1)"
                @keydown.up.prevent="focusNext(idx - 1)"
              >
                <span
                  class="rounded-full px-3 py-1 border"
                  :style="styleFor(opt._id)"
                >
                  {{ opt.title }}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
  import { useFetchPriority, useUpdateProductCard } from '../../../queries/useProductCard'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const { data: PRIORITIES } = useFetchPriority(route.params.id) // Ref<Array<{ _id:string; title:string; color?:string; color_code?:string }>>
  
  type Priority = string
  
  const props = withDefaults(defineProps<{
    default: Priority
    disabled?: boolean
    cardId: string | number
  }>(), {
    default: 'medium',
    disabled: false
  })
  
  const open = ref(false)
  const root = ref<HTMLElement | null>(null)
  const list = ref<HTMLElement | null>(null)
  const priority = ref<Priority>(props.default)
  
  // unwrap safe
  type Opt = { _id: string; title: string; color?: string; color_code?: string; hex?: string; bg_color?: string }
  const options = computed(() => (PRIORITIES?.value ?? []) as Opt[])
  
  // ---- color helpers ----
  function normalizeHex(hex?: string | null) {
    if (!hex) return null
    let h = hex.trim()
    if (!h) return null
    if (h[0] !== '#') h = '#' + h
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(h)) {
      // expand #rgb to #rrggbb
      if (h.length === 4) {
        h = '#' + h.slice(1).split('').map(c => c + c).join('')
      }
      return h
    }
    return null
  }
  function getHexById(id?: string | null) {
    const o = options.value.find(x => x._id === id)
    return normalizeHex(o?.color)
  }
  function contrastColor(hex?: string | null) {
    const h = normalizeHex(hex)
    if (!h) return undefined
    const r = parseInt(h.slice(1,3),16), g = parseInt(h.slice(3,5),16), b = parseInt(h.slice(5,7),16)
    // relative luminance (WCAG-ish quick check)
    const yiq = (r*299 + g*587 + b*114) / 1000
    return yiq >= 140 ? '#111111' : '#FFFFFF'
  }
  function styleFor(id?: string | null) {
    const bg = getHexById(id)
    if (!bg) return undefined
    const clr = contrastColor(bg)
    return {
      backgroundColor: bg,
      color: clr,
      borderColor: bg + '33' // subtle border using 20% alpha
    } as Record<string,string>
  }
  
  // ---- labels ----
  function labelFor(p: Priority) {
    const hit = options.value.find(o => o._id === p)
    return hit?.title ?? 'Select'
  }
  
  // ---- open/close ----
  function toggle() { if (!props.disabled) open.value = !open.value }
  function close() { open.value = false }
  
  // ---- mutation on user action only ----
  const mutate = useUpdateProductCard()
  function updateCardPriority(cardId: string | number, newPriority: Priority) {
    mutate.mutate({ id: cardId, payload: { priority: newPriority } })
  }
  function select(val: Priority) {
    priority.value = val
    updateCardPriority(props.cardId, val)
    close()
  }
  
  // ---- keyboard focus in menu ----
  function focusNext(idx: number) {
    const items = list.value?.querySelectorAll('button[role="menuitemradio"]')
    if (!items?.length) return
    const max = items.length - 1
    const next = Math.max(0, Math.min(idx, max))
    ;(items[next] as HTMLElement).focus()
  }
  
  // ---- click outside ----
  function onDocClick(e: MouseEvent) {
    if (!root.value) return
    if (!root.value.contains(e.target as Node)) close()
  }
  onMounted(() => document.addEventListener('click', onDocClick))
  onUnmounted(() => document.removeEventListener('click', onDocClick))
  
  // ---- validate default & keep in sync ----
  function isValid(id?: string | null) {
    return !!id && options.value.some(o => o._id === id)
  }
  watch(options, (opts) => {
    if (!isValid(priority.value)) {
      if (isValid(props.default)) {
        priority.value = props.default
      } else if (opts.length) {
        priority.value = opts[0]._id // no API call here
      }
    }
  }, { immediate: true })
  watch(() => props.default, (v) => {
    if (isValid(v) && v !== priority.value) {
      priority.value = v // no API call
    }
  })
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active { transition: opacity .12s ease; }
  .fade-enter-from, .fade-leave-to { opacity: 0; }
  </style>
  