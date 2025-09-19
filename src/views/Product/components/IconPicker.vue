<script lang="ts" setup>
import { ref, computed } from 'vue';
import Button from '../../../components/ui/Button.vue'; // Keep your button component

// Props & Emits
defineProps<{ modelValue?: { prefix: 'far' | 'fas' | 'fab'; iconName: string } |null }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: { prefix: 'far' | 'fas' | 'fab'; iconName: string } | null): void }>();

// PrimeIcons list — expand this or import dynamically if needed
const allIcons = [
  'home', 'user', 'cog', 'calendar', 'search', 'bell', 'check', 'times',
  'plus', 'minus', 'trash', 'pencil', 'info', 'question', 'lock',
  'unlock', 'star', 'heart', 'bookmark', 'camera', 'cloud', 'download',
  'upload', 'eye', 'envelope', 'file', 'globe', 'key', 'map', 'power-off'
  // Add more from: https://primefaces.org/primeicons/
];

const query = ref('');
const page = ref(1);
const pageSize = 120;

// Filter and paginate icons
const filteredIcons = computed(() =>
  allIcons.filter(name => name.includes(query.value.toLowerCase()))
);
const visibleIcons = computed(() =>
  filteredIcons.value.slice(0, page.value * pageSize)
);

// Infinite scroll
function onScroll(e: Event) {
  const el = e.target as HTMLElement;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) {
    if (visibleIcons.value.length < filteredIcons.value.length) {
      page.value += 1;
    }
  }
}

// Icon selection
function select(iconName: string | null) {
  emit('update:modelValue', { prefix: 'fab', iconName: iconName || '' });
  showIconPicker.value = false;
}

// Toggle picker
const showIconPicker = ref(false);
function openIconLibrary() {
  showIconPicker.value = !showIconPicker.value;
}
</script>

<template>
  <div>
    <!-- Button to open icon picker -->
    <div v-if="!showIconPicker && !modelValue?.iconName"
      class="border border-dashed bg-bg-input border-border rounded-xl p-6 flex flex-col items-center text-center">
      <Button variant="primary" @click="openIconLibrary">
        Select Icon
      </Button>
      <p class="text-xs text-text-secondary mt-2">Explore PrimeIcons Library</p>
    </div>

    <!-- Icon picker -->
    <div v-else-if="showIconPicker" class="mt-6">
      <div class="grid gap-3 w-full">
        <input v-model="query" placeholder="Search PrimeIcons..." class="px-3 py-2 rounded-lg border col-span-full border-border bg-bg-card text-sm placeholder-text-secondary
                 focus:outline-none focus:ring-2 focus:ring-accent focus:border-border" type="text" />

        <div class="grid gap-2 col-span-full grid-cols-[repeat(auto-fill,minmax(90px,1fr))] max-h-[360px] overflow-auto pr-1
                 rounded-lg border-border" @scroll="onScroll">
          <button v-for="name in visibleIcons" :key="name" type="button" @click="select(name)" :aria-label="name"
            :title="name" class="group grid place-items-center gap-1.5 p-2 bg-bg-body cursor-pointer
                   border border-transparent rounded-lg text-text-secondary
                   hover:border-border focus:outline-none focus:ring-2 focus:ring-accent">
            <i :class="`pi pi-${name}`" class="text-base"></i>
            <small class="max-w-[84px] text-[11px] text-text-secondary neutral-400 truncate">
              {{ name }}
            </small>
          </button>
        </div>

        <p v-if="!filteredIcons.length" class="text-sm text-neutral-400">
          No icons match “{{ query }}”.
        </p>
      </div>
    </div>

    <!-- Preview selected icon -->
    <div v-if="modelValue"
      class="mt-4 p-3 bg-bg-input rounded-lg flex items-center gap-2">
      <i :class="`pi pi-${modelValue.iconName}`" class="text-xl"></i>
      <div>
        <p class="font-medium">{{ modelValue.iconName }}</p>
      </div>
      <img src="../../../assets/icons/cross.svg" @click="select(null)" class="ml-auto cursor-pointer"
        alt="Clear icon" />
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 1rem;
}
</style>
