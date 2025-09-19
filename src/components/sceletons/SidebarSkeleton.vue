<template>
    <aside class="w-fit px-2 max-h-full h-full flex flex-col items-center pt-2">
      <!-- Draggable area placeholder -->
      <div class="flex-1 w-full space-y-1 flex-grow text-center">
        <div
          v-for="i in items"
          :key="i"
          class="w-full rounded-md px-2 py-2"
        >
          <div
            class="flex flex-col items-center justify-center gap-2 mx-auto
                   h-10 w-[38px] px-2 py-2 rounded-lg border border-border
                   bg-bg-surface"
          >
            <!-- grip / drag handle -->

  
            <!-- icon circle -->
            <div class="w-full h-6 rounded-full shimmer" />
  
            <!-- label bar (adapts to compact vs classic) -->
            <div
              v-if="showLabels"
              class="h-2 w-full rounded shimmer"
            />
          </div>
        </div>
      </div>
  
      <!-- Static More item -->
      <div class="mt-auto pt-4 mb-2 text-center  w-[38px] ">
        <div
          class="mx-auto flex-col  h-10 min-w-[38px] py-2 px-2 rounded-lg border border-border
                 flex items-center justify-center gap-2
                 bg-bg-surface"
        >
          <div class="w-full h-6 rounded shimmer" />
          <div v-if="showLabels" class="h-2 w-full rounded shimmer" />
        </div>
      </div>
    </aside>
  </template>
  
  <script setup lang="ts">
  withDefaults(defineProps<{
    /** Number of sidebar items to mock (excludes "More") */
    items?: number
    /** Whether to show text bars next to icons (compact sidebars can hide labels) */
    showLabels?: boolean
  }>(), {
    items: 8,
    showLabels: true
  })
  </script>
  
  <style scoped>
  /* Shimmer skeleton – matches your Kanban loader */
  .shimmer {
    position: relative;
    overflow: hidden;
    background-color: var(--bg-body);
  }
  
  .shimmer::after {
    content: "";
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      var(--bg-body),
      var(--bg-surface) 50%,
      var(--bg-body) 100%
    );
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes shimmer {
    100% { transform: translateX(100%); }
  }
  
  /* Optional: keep visual parity with your draggable styles if applied */
  .drag > div {
    transform: rotate(5deg);
  }
  .ghost {
    background-color: rgba(211, 211, 211, 0.775);
    border-radius: 6px;
  }
  .ghost > * {
    visibility: hidden;
  }
  </style>
  