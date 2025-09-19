<template>
  <div class="p-4 overflow-x-auto flex-auto flex-grow flex gap-6">
    <!-- Columns -->
    <div v-for="c in columns" :key="c"
      class="max-w-[328px] min-w-[328px] min-h-[555px] h-full  bg-bg-body rounded-lg p-2 flex flex-col">
      <!-- Header skeleton -->
      <div class="flex justify-between items-center py-3 px-4 sticky top-0 bg-bg-body rounded-xl  mb-2 z-10">
        <div class="flex items-center gap-2">
          <div class="h-4 w-24 rounded shimmer" />
          <div class="h-4 w-4 rounded-full shimmer" />
        </div>
        <div class="flex items-center gap-2">
          <div class="h-4 w-4 rounded shimmer" />
          <div class="h-4 w-4 rounded shimmer" />
        </div>
      </div>

      <!-- Cards skeleton list -->
      <div class="flex-1 w-full overflow-y-auto space-y-3 px-2 pb-2">
        <div v-for="i in cardsPerColumn" :key="`${c}-${i}`"
          class="bg-bg-card  rounded-xl border border-border   p-3 space-y-3 shadow-sm">
          <div class="flex gap-2">
            <div class="h-5 w-14 rounded-full shimmer" />
            <div class="h-5 w-10 rounded-full shimmer" />
          </div>
          <div>
            <div class="h-4 w-3/4 rounded shimmer mb-2" />
            <div class="h-3 w-full rounded shimmer" />
            <div class="h-3 w-5/6 rounded shimmer mt-1" />
          </div>
          <div class="flex justify-between items-center">
            <div class="h-4 w-20 rounded shimmer" />
            <div class="flex -space-x-2">
              <div class="w-6 h-6 rounded-full border-2  border-border shimmer" />
              <div class="w-6 h-6 rounded-full border-2 border-border shimmer" />
            </div>
          </div>
        </div>

        <!-- Add Member button skeleton -->
        <div class="h-9 rounded shimmer mt-3" />
      </div>
    </div>

    <!-- Add list column skeleton -->
    <div v-if="showAddList" class="min-w-[328px]">
      <div class="bg-bg-body  rounded-lg p-4">
        <div class="h-9 rounded shimmer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  columns?: number
  cardsPerColumn?: number
  showAddList?: boolean
}>(), {
  columns: 3,
  cardsPerColumn: 3,
  showAddList: true
})
</script>

<style scoped>
/* Shimmer skeleton */
.shimmer {
  position: relative;
  overflow: hidden;
  background-color: var(--bg-body);
  /* gray-200 */
}

.shimmer::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(90deg, var(--bg-body) , var(--bg-surface) 50%, var(--bg-body) 100%);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>