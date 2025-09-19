<template>

    <SidebarSkeleton v-if="isLoading" />
    <aside v-else class="w-fit min-w-[36px] px-2 max-h-full h-full flex flex-col items-center gap-1 pb-2.5 ">
        <div class="mt-auto  text-center ">
            <SideItem label="Peak" :to="`/workspace/peak/${workspaceId}/${jobId ? jobId :'undefined'}`" key="peak" id="peak" :icon="{
                prefix: 'far',
                iconName: 'home'
            }" />
        </div>
        <div class="flex-grow flex-col flex gap-1">
            <SideItem v-for="(item, index) in workspace.modules" :key="index" :id="item._id"
                :label="item.variables['module-title']" :to="`/workspace/${workspaceId}/${item._id}`"
                :icon="item?.variables['module-icon']" />
        </div>

        <!-- Draggable Navigation Items -->
        <!-- <Draggable v-model="modules" item-key="label"
            class="flex-grow overflow-y-auto w-full space-y-1 transition-all text-center" handle=".drag-handle"
            animation="400" drag-class="drag" ghost-class="ghost">
            <template #item="{ element }">
                <div>
                    <SideItem :id="element._id" :label="element.title" :to="`/workspace/${workspace_id}/${element._id}`"
                        :icon="element?.icon" />

                </div>
            </template>
</Draggable> -->

        <!-- Static More Item -->
        <div class="mt-auto pt-4 text-center ">
            <SideItem id="more" label="More" to="/workspace/1/more" :icon="{
                prefix: 'fas',
                iconName: 'grid-2'
            }" />

        </div>
    </aside>
</template>


<script setup lang="ts">
// import Draggable from 'vuedraggable'

// import HomeIcon from '../../../assets/IconTemplates/HomeIcon.vue';
// import HomeFilledIcon from '../../../assets/IconTemplates/HomeFilledIcon.vue';
// import PersonIcon from '../../../assets/IconTemplates/PersonIcon.vue';
// import PersonFilledIcon from '../../../assets/IconTemplates/PersonFilledIcon.vue';
// import ProcessIcon from '../../../assets/IconTemplates/ProcessIcon.vue';
// import ProcessFilledIcon from '../../../assets/IconTemplates/ProcessFilledIcon.vue';
// import PinIcon from '../../../assets/IconTemplates/PinIcon.vue';
// import PinFilledIcon from '../../../assets/IconTemplates/PinFilledIcon.vue';
// import ProductIcon from '../../../assets/IconTemplates/ProductIcon.vue';
// import ProductFilledIcon from '../../../assets/IconTemplates/ProductFilledIcon.vue';
// import PrepareIcon from '../../../assets/IconTemplates/PrepareIcon.vue';
// import PrepareFilledIcon from '../../../assets/IconTemplates/PrepareFilledIcon.vue';
// import PilotIcon from '../../../assets/IconTemplates/PilotIcon.vue';
// import PilotFilledIcon from '../../../assets/IconTemplates/PilotFilledIcon.vue';
// import PlanIcon from '../../../assets/IconTemplates/PlanIcon.vue';
// import PlanFilledIcon from '../../../assets/IconTemplates/PlanFilledIcon.vue';
import { ref, watch } from 'vue'
import SideItem from './SideItem.vue';
import { useRouteIds } from '../../../composables/useQueryParams';
const { workspaceId, jobId } = useRouteIds()
const props = defineProps<{ workspace: { modules: any }, isLoading: boolean }>()

const modules = ref([]);

watch(() => props.workspace, (newWorkspace) => {
    if (!newWorkspace) {
        console.log("No workspace data available yet");
        return;
    }

    console.log('>>> props.workspace', newWorkspace);
    modules.value = newWorkspace.modules;
}, { deep: true });


// Sync with menuStyle changes
// watchEffect(() => {
//     sidebarData.value = [
//         {
//             label: workspaceStore.menuStyle === 'classic' ? "Peak" : "Home",
//             icon: HomeIcon,
//             to: '/workspace/1/peak',
//             activeIcon: HomeFilledIcon
//         },
//         {
//             label: "People",
//             icon: PersonIcon,
//             to: '/workspace/1/people',
//             activeIcon: PersonFilledIcon
//         },
//         {
//             label: "Process",
//             icon: ProcessIcon,
//             to: '/workspace/1/process',
//             activeIcon: ProcessFilledIcon
//         },
//         {
//             label: "Pin",
//             icon: PinIcon,
//             to: '/workspace/1/pin',
//             activeIcon: PinFilledIcon
//         },
//         {
//             label: "Product",
//             icon: ProductIcon,
//             to: '/workspace/1/product',
//             activeIcon: ProductFilledIcon
//         },
//         {
//             label: workspaceStore.menuStyle === 'classic' ? "Prepare" : "Business",
//             icon: PrepareIcon,
//             to: '/workspace/1/prepare',
//             activeIcon: PrepareFilledIcon
//         },
//         {
//             label: "Plan",
//             icon: PlanIcon,
//             to: '/workspace/1/plan',
//             activeIcon: PlanFilledIcon
//         },
//         {
//             label: workspaceStore.menuStyle === 'classic' ? "Pilot" : "Lounch",
//             icon: PilotIcon,
//             to: '/workspace/1/pilot',
//             activeIcon: PilotFilledIcon
//         },
//     ]
// })



</script>

<style scoped>
.drag>div {
    transform: rotate(5deg);
}

.ghost {
    background-color: rgba(211, 211, 211, 0.775);
    border-radius: 6px;
}

.ghost>* {
    visibility: hidden;
}
</style>