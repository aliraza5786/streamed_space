<template>
  <div
    :class="`max-w-[358px] bg-bg-card  rounded-lg overflow-y-auto overflow-x-hidden relative ${showPanel ? '!translate-x-0 w-full h-full min-w-[350px] overflow-y-auto' : '!translate-x-100 w-0 h-0'} transition-all`">
    <!-- Header -->
    <div class="py-4 flex justify-between items-center border-b border-border px-5 sticky top-0  bg-bg-card z-1">
      <h5 class="text-[16px] font-medium">Details</h5>
      <FontAwesomeIcon class=" cursor-pointer text-text-primary" :icon="['fas', 'close']" @click="() => { $emit('close') }" />

    </div>

    <!-- Body -->
    <div class="py-4 px-5">
      <!-- Title -->
      <h1 class="text-xl font-medium text-text-primary ">{{ details?.variables ? details['card-title'] : '' }}
      </h1>

      <!-- Row: status + priority + code -->
      <div class="flex mt-2.5 items-center gap-2">
        <TypeChanger v-for="(item, index) in details.variables" v-show="item?.type === 'Select'" :key="index"
          @click.stop :default="item?.value" :data="item?.data" :cardId="details?._id"
          @onselect="(val: any) => handleSelect(val)" />

        <span class="card_code ml-auto text-sm text-text-secondary flex gap-2 text-nowrap items-center">
          <img src="../../../assets/icons/ticket.svg" alt="" /> {{ details['card-code'] }}
        </span>
      </div>
      <br>
      <!-- Description -->
      <BaseRichTextEditor @focusOut="updateDetailHandler" v-model="description" />

      <!-- Posted By -->
      <div class="flex flex-col gap-2 mt-4">
        <label class="text-sm font-medium text-text-primary  ">Posted by</label>
        <div class="flex items-center gap-3 border border-border bg-bg-input rounded-lg px-4 py-2">
          <div
            class="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center text-text-primary text-xs font-semibold uppercase">
            {{ initials(local.posted_by?.name) }}
          </div>
          <input class="flex-1 outline-none text-sm placeholder-text-secondary   text-text-primary" type="text"
            placeholder="Assignee name" v-model="local.posted_by.name" @blur="savePostedBy" />

        </div>
      </div>

      <!-- Posted On -->
      <div class="flex flex-col gap-2 mt-4">
        <label class="text-sm font-medium text-text-primary ">Posted on</label>
        <div class="flex items-center gap-3 border border-border bg-bg-input  rounded-lg px-4 py-2">
          <svg class="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24">
            <path d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <input class="flex-1 outline-none text-sm text-text-primary   " type="date" v-model="dateISO"
            @change="savePostedOn" />

        </div>
      </div>

      <!-- Activity / Comments -->
      <div class="mt-8">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-text-primary  ">History</h3>

        </div>

        <ul class=" list-disc list-inside">
          <li class="text-sm text-text-secondary " v-for="h in details.history">{{ h.message }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import BaseRichTextEditor from '../../../components/ui/BaseRichTextEditor.vue'
// import TypeChanger from './TypeChanger.vue'
import { useUpdateProductCard } from '../../../queries/useProductCard'
import { useMoveCard } from '../../../queries/useSheets'
import { useQueryClient } from '@tanstack/vue-query'
import TypeChanger from './TypeChanger.vue'
const props = defineProps({
  showPanel: { type: Boolean, default: true },
  details: { type: Object as () => any, default: () => ({}) }
})
const description = ref('')
watch(() => props.details, () => {
  description.value = props.details['card-description'];
})
const emit = defineEmits(['close', 'update:details', 'comment:post', 'priority:change'])

// Local editable copy
const local = reactive({
  description: props.details?.description ?? '',
  posted_by: props.details?.posted_by ?? { id: null, name: '' },
  posted_on: props.details?.posted_on ?? props.details?.created_at ?? new Date().toISOString(),
})

// Helpers
function initials(name?: string) {
  if (!name) return 'NA'
  return name.split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase()
}

const dateISO = computed({
  get: () => new Date(local.posted_on).toISOString().slice(0, 10),
  set: (v: string) => { local.posted_on = new Date(v + 'T00:00:00').toISOString() }
})

function savePostedBy() {
  emit('update:details', { ...props.details, posted_by: local.posted_by })
}
function savePostedOn() {
  emit('update:details', { ...props.details, posted_on: local.posted_on })
}

const mutate = useUpdateProductCard()
const updateDetailHandler = () => {
  mutate.mutate({ id: props.details._id, payload: { ...props.details, description: description.value }, })
}
const queryClient = useQueryClient()
const moveCard = useMoveCard({
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['get-sheets']
    })
  }
})
const handleSelect = (val: any) => {
  moveCard.mutate({
    payload: {
      card_id: props.details._id,
      variables: val,
      // variable_id: id,
    }
  })
}
</script>

<style scoped>
/* simple fade for the dropdowns already defined elsewhere */
</style>