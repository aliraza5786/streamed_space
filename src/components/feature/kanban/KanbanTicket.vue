<template>
    <div class=" bg-bg-card rounded-lg p-4 pt-0 shadow-sm cursor-grab border-t-4
             hover:shadow-md transition-all duration-200 active:cursor-grabbing" :class="priorityBorderClass"
        :style="{ borderColor: ticket.lane.variables['lane-color'] }">

        <div class="flex justify-between gap-2 items-center">
            <div class="flex gap-2 py-2 flex-wrap ">

                <TypeChanger v-for="(item, index) in ticket.variables"
                    v-show="item?.type === 'Select' && item?.visible_on_card" :key="index" @click.stop
                    :default="item?.value" :data="item?.data" :cardId="ticket?._id"
                    @onselect="(val) => handleSelect(val)" />
                <!-- <StatusChanger @click.stop :default="ticket?.card_status_id?._id" :cardId="ticket?._id" />
              <PriorityChanger @click.stop :default="ticket?.priority_id" :cardId="ticket?._id" /> -->
            </div>
            <DropMenu :items="getMenuItems()">
                <template #trigger>
                    <FontAwesomeIcon class=" cursor-pointer" :icon="['fas', 'ellipsis']" />
                </template>
            </DropMenu>
        </div>
        <div class="flex items-start justify-between mb-2">
            <h3 class="text-sm font-medium text-card-foreground leading-tight">
                {{ ticket['card-title'] }}
            </h3>
        </div>
        <p v-html="ticket['card-description']"
            class="text-xs text-muted-foreground mb-3 text-text-secondary line-clamp-2">
        </p>

        <!-- Footer Meta -->
        <div class="flex justify-between items-center mt-2">
            <div class="flex items-center gap-2 text-xs  text-text-secondary uppercase">
                <img src="../../../assets/icons/ticket.svg" class="w-4" alt="ticket" />
                <span>{{ ticket['card-code'] }}</span>
            </div>

            <!-- Assignment trigger (stops bubbling) -->
            <div @click.stop>
                <!-- <AssigmentDropdown
          :users="members"
          :model-value="assigneeId"
          :disabled="saving"
          @update:modelValue="setAssignee"
        /> -->
            </div>
        </div>

        <!-- Bottom Info -->
        <div @click.stop class="flex gap-2 text-xs text-text-secondary mt-2">
            <DatePicker placeholder="set start date" :model-value="startDate" theme="dark" emit-as="ymd"
                @update:modelValue="setStartDate" /> -
            <DatePicker placeholder="set end date" :model-value="dueDate" theme="dark" emit-as="ymd"
                @update:modelValue="setDueDate" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import TypeChanger from '../../../views/Product/components/TypeChanger.vue'
// import AssigmentDropdown from '../../../views/Product/components/AssigmentDropdown.vue'
import DatePicker from '../../../views/Product/components/DatePicker.vue'
import { useUpdateProductCard } from '../../../queries/useProductCard'
import { useMoveCard } from '../../../queries/useSheets'
import { useQueryClient } from '@tanstack/vue-query'
import DropMenu from '../../ui/DropMenu.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

type Priority = any

export interface Ticket {
    _id: string | number
    title: string
    description?: string
    priority: Priority
    color_code: string
    card_type_id: any
    card_status_id: any
    priority_id: any
    card_code: string
    start_date: string
    end_date: string
}

const props = defineProps<{
    ticket: any
}>()


/* ----- Class maps (Tailwind utility classes) ----- */
const priorityBorderMap: Record<Priority, string> = {
    critical: 'border-l-priority-critical',
    high: 'border-l-priority-high',
    medium: 'border-l-priority-medium',
    low: 'border-l-priority-low',
}

const priorityBorderClass = computed(
    () => priorityBorderMap[props.ticket.priority] ?? 'border-l-gray-300'
)


/* Assignee initial */
// const assigneeInitial = computed(() =>
// (props.ticket.assignee || '').trim().charAt(0).toUpperCase() || '?'
// )

// due date 
const mutate = useUpdateProductCard()
const dueDate = ref<string | null>(props.ticket['end-date'] ?? null)
watch(() => props.ticket?.end_date, v => { dueDate.value = v ?? null })

const startDate = ref<string | null>(props.ticket['start-date'] ?? null)
watch(() => props.ticket?.start_date, v => { startDate.value = v ?? null })


function setDueDate(v: string | null) {
    if (!props.ticket?._id) return
    dueDate.value = v
    mutate.mutate({
        id: props.ticket._id, payload: {
            end_date: v
        }
    })

}
function setStartDate(v: string | null) {
    if (!props.ticket?._id) return
    startDate.value = v
    mutate.mutate({
        id: props.ticket._id, payload: {
            start_date: v
        }
    })
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
            card_id: props.ticket._id,
            variables: val,
            // variable_id: id,
        }
    })
}
function getMenuItems() {
    return [{
        label: 'Delete', danger: true, action: () => {
            moveCard.mutate({
                payload: {
                    card_id: props.ticket._id,
                    is_trash: true
                }
            })
        }
    }]
}
</script>