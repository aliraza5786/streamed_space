<template>
    <div class="flex-auto flex-grow h-full bg-bg-card rounded-lg border border-border  overflow-x-auto flex-col flex  ">
        <div class="header px-4 py-3 border-b  border-border flex items-center justify-between gap-1">
            <Dropdown v-model="selected_sheet_id" :options="transformedData" variant="secondary">
                <template #more>
                    <div @click="createSheet()"
                        class="  capitalize border-t border-border px-4 py-2 hover:bg-bg-dropdown-menu-hover cursor-pointer flex items-center gap-1 overflow-hidden overflow-ellipsis text-nowrap ">
                        <FontAwesomeIcon :icon="['fas', 'plus']" /> Add new
                    </div>
                </template>
            </Dropdown>
            <div class="flex gap-3 items-center ">
                <Dropdown v-model="selected_view_by" :options="variables" variant="secondary">

                    <template #more>
                        <div @click="createSheet()"
                            class="  capitalize border-t  border-border px-4 py-2 hover:bg-bg-dropdown-menu-hover  cursor-pointer flex items-center gap-1 overflow-hidden overflow-ellipsis text-nowrap ">
                            <FontAwesomeIcon :icon="['fas', 'plus']" /> Add new
                        </div>
                    </template>
                </Dropdown>
                <Searchbar placeholder="Search in streamed space">
                </Searchbar>
                <!-- <Button variant="secondary" size="md" @click="workspaceStore.toggleFilter()">
                        <div class="flex  gap-2">
                            <img src="../../assets/icons/filter.svg" alt="">
                            Filter
                        </div>
                    </Button> -->
                <!-- <Dropdown v-model="currentView" :options="viewOptions" /> -->
            </div>
        </div>
        <KanbanSkeleton v-if="isPending" />
        <div v-else-if="currentView == 'kanban'" class="flex  overflow-x-auto gap-3">
            <KanbanBoard @reorder="onReorder" @addColumn="handleAddColumn" @select:ticket="selectCardHandler"
                :board="Lists" @onBoardUpdate="handleBoardUpdate" :variable_id="selected_view_by" />
            <!-- Add Column -->
            <div class="min-w-[328px] pt-6 pr-6" @click.stop>
                <div v-if="activeAddList" class="bg-bg-body  rounded-lg p-4">
                    <BaseTextField :autofocus="true" v-model="newColumn" placeholder="Add New list"
                        @keyup.enter="emitAddColumn" />
                    <p class="text-xs mt-1.5">You can add details while editing</p>
                    <div class="flex items-center mt-3 gap-3">
                        <Button @click="emitAddColumn" varaint="primary"
                            class="px-3 py-1 bg-accent cursor-pointer text-white rounded">{{ addingList ?
                                'Adding...' :
                                'Add list' }}</Button>
                        <FontAwesomeIcon class="cursor-pointer" :icon="['fas', 'close']" @click="setActiveAddList" />
                    </div>
                </div>
                <button v-else
                    class="text-sm text-white   py-2.5 cursor-pointer font-medium flex items-center justify-center w-full gap-2 bg-accent rounded-lg"
                    @click.stop="setActiveAddList">
                    + Add List
                </button>
            </div>
        </div>
    </div>

    <CreateTaskModal v-if="createTeamModal" key="createTaskModalKey" v-model="createTeamModal" @submit="" />
    <SidePanel :details="selectedCard" @close="() => { selectCardHandler({ variables: {} }) }"
        :showPanel="selectedCard?.variables.length > 0 ? true : false" />
    <CreateSheetModal v-model="isCreateSheetModal" />

</template>
<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useWorkspaceStore } from '../../stores/workspace';
import Dropdown from '../../components/ui/Dropdown.vue';
import Searchbar from '../../components/ui/SearchBar.vue';
import CreateTaskModal from './modals/CreateTaskModal.vue';
import { useAddList, useMoveCard, useMoveList, useSheetList, useSheets } from '../../queries/useSheets';
import { useRoute } from 'vue-router';
import SidePanel from './components/SidePanel.vue';
import CreateSheetModal from './modals/CreateSheetModal.vue';
import KanbanSkeleton from '../../components/sceletons/KanbanSkeleton.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import KanbanBoard from '../../components/feature/kanban/KanbanBoard.vue';
import { useWorkspacesVariables } from '../../queries/useWorkspace';
import BaseTextField from '../../components/ui/BaseTextField.vue';
import { useQueryClient } from '@tanstack/vue-query';
import { useRouteIds } from '../../composables/useQueryParams';
const route = useRoute();
const { workspaceId ,moduleId} = useRouteIds();
const workspace_id = route.params.id;
const workspace_module_id = ref(route.params.module_id);
const { data: variables } = useWorkspacesVariables();
const queryClient = useQueryClient()
const { mutate: addList, isPending: addingList } = useAddList({
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sheet-list'] })
        newColumn.value = ''
        activeAddList.value = false
    }
})
const handleAddColumn = (v: any) => {
    addList({
        "workspace_id": workspaceId.value,
        "module_id": moduleId.value,
        "variable_id": selected_view_by.value,
        "value": v
    })
}

// Fetch sheets using `useSheets`
const { data, refetch } = useSheets({
    workspace_id,
    workspace_module_id
}, {
    onSuccess: () => {
        refetchList();  // Refetch data on success
    }
});
const selected_sheet_id = ref<any>(data.value ? data.value[0]._id : null);
const showComponent = ref(true); // Flag to control component rendering
const selected_view_by = ref(variables.value ? variables.value[0]._id : null);

// Watch for changes in route params
watch(() => route.params.module_id, (newId) => {
    workspace_module_id.value = newId;
    // Toggle the flag to unmount and remount the component
    showComponent.value = false;
    nextTick(() => {
        refetch();
        showComponent.value = true;
    });
});

const workspaceStore = useWorkspaceStore();
library.add(faSquarePlus)

// usage
const { data: Lists, isPending, refetch: refetchList } = useSheetList(
    workspace_module_id,
    selected_sheet_id,                      // ref
    computed(() => [...workspaceStore.selectedLaneIds]), // clone so identity changes on mutation
    selected_view_by,                    // ref
)


const createTeamModal = ref(false);

const currentView = ref<'kanban' | 'list'>('kanban')

const selectedCard = ref<{ variables: any }>()
const selectCardHandler = (card: any) => {
    selectedCard.value = card
}
const isCreateSheetModal = ref(false)
const createSheet = () => {
    isCreateSheetModal.value = !isCreateSheetModal.value
}

const moveList = useMoveList()
const moveCard = useMoveCard()
function onReorder(a: any) {
    if (a.type == 'column')
        moveList.mutate({
            payload: {
                id: a.meta.id,
                payload: {
                    list_id: a.meta.id,
                    sort_order: a.meta.newIndex,
                    sheet_id: selected_sheet_id.value,
                    variable_id: selected_view_by.value,
                }
            }
        })
    else {
        moveCard.mutate({
            payload: {
                id: a.meta.moved._id,
                payload: {
                    card_id: a.meta.moved._id,
                    value: a.meta.fromColumnId,
                    variable_id: selected_view_by.value,
                    sort_order: a.meta.newIndex,
                    sheet_id: selected_sheet_id.value
                }
            }
        })
    }

}


const handleBoardUpdate = (_: any) => {

};
// Define the type for the sheet data and dropdown options
interface Sheet {
    _id: string;
    variables: {
        "sheet-title": string;
    };
    icon: IconData
}
interface IconData {
    prefix: string;
    iconName: string;
}
interface DropdownOption {
    _id: string;
    title: string;
    icon: IconData
}
// Define the `transformedData` computed property
const transformedData = computed<DropdownOption[]>(() => {
    return (data.value || []).map((item: Sheet) => ({
        _id: item._id,
        title: item.variables["sheet-title"],
        icon: item.icon
    }));
});



watch(data, (newSheetId) => {
    if (newSheetId) {
        selected_sheet_id.value = newSheetId[0]._id; // Trigger the refetch with the new sheet_id
    }
});
watch(variables, (newSheetId) => {
    if (newSheetId) {
        selected_view_by.value = newSheetId[0]._id; // Trigger the refetch with the new sheet_id
    }
});


// add column 
const activeAddList = ref(false)
const newColumn = ref('')
function setActiveAddList() { activeAddList.value = !activeAddList.value }
function emitAddColumn() {
    const t = newColumn.value.trim()
    if (!t) return
    handleAddColumn(t)

}


</script>
