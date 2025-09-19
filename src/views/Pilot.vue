<template>
    <div class="flex gap-3 flex-auto h-full overflow-x-auto w-full ">
        <div class="w-full h-full bg-white/90 rounded-lg overflow-y-auto flex-col flex  ">
            <div class="header px-4 py-3 border-b  border-border-gray flex items-center justify-between gap-1">
                <!-- <Dropdown v-model="pilotBy" :options="pilotByOptions" prefix="Pilot by" variant="secondary" /> -->
                <div class="flex gap-3 items-center">
                    <Searchbar placeholder="Search in streamed space">
                    </Searchbar>
                    <Button variant="secondary" size="md">
                        <div class="flex  gap-2">
                            <img src="../assets/icons/filter.svg" alt="">
                            Filter
                        </div>
                    </Button>
                    <!-- <Dropdown v-model="currentView" :options="viewOptions" /> -->
                </div>

            </div>
            <!-- <KanbanBoard :onAddTicket="() => {

            }" v-if="currentView == 'kanban'" :columns="columns" :emptyState="{
                title: 'Start adding bugs, test cases & Use cases',
                description: 'Add/track the activity for bugs, test cases & use cases',
                icon: emptystateIcon,
                buttonLabel: 'Add Bug',
                buttonClickHandler: () => { }
            }">
                <template #kanban-item="element">
                    <div class="bg-white border border-gray rounded-lg p-4  cursor-pointer" @click="() => {
                        workspaceStore.showSettingPanel = false;
                        handleOpenPanel();
                    }">
                        <div class="gap-3   flex">
                            <img src="../assets/temp/Avatar.svg" class="w-16 h-16 rounded-full" alt="">
                            <div class="flex flex-col  flex-auto">
                                <div class="flex justify-between w-full items-center">
                                    <h5 class="text-base font-medium text-text-primary">Olivia Rhye</h5>
                                    <img src="../assets/icons/fi_more-vertical.svg" class="rotate-90" alt="">
                                </div>
                                <p class="text-[#535862] text-sm">olivia@untitledui.com</p>
                                <h6 class="text-sm text-text-primary">Product Designer</h6>
                            </div>
                        </div>
                        <div class=" bg-[#F8F9F9] py-2 px-2.5 rounded-md mt-4">
                            <h5 class="text-text-text-secondary  text-xs font-medium">Task Progress</h5>
                            <p class="text-xs text-[#535862] mt-2 mb-1">Completed 35 tasks out of 100</p>
                            <div class="flex text-sm gap-3 items-center py-2">
                                <ProgressBar fill-color="bg-black" :progress="34" />
                                34%
                            </div>
                        </div>

                        <p class="hidden"> {{ element }} </p>
                    </div>
                </template>
            </KanbanBoard> -->

            <GenericTable v-if="currentView == 'list' && pilotBy == 'bug'" :columns="[
                { label: 'Name', accessor: 'name' },
                { label: 'Teams', accessor: 'team' },
                { label: 'Role', accessor: 'role', postfix: helpCircle },
                { label: 'Status', accessor: 'status', postfix: arrowDown },
            ]" :tableData="pilot" :perPage="9" />

            <GenericTable v-else-if="currentView == 'list' && pilotBy == 'text-case'" :columns="[
                { label: 'Department', accessor: 'department' },
                { label: 'Team', accessor: 'team' },
                { label: 'Members Count', accessor: 'member', postfix: helpCircle },
                { label: 'Status', accessor: 'status', postfix: arrowDown },
            ]" :tableData="tableData" :perPage="9" />
            <GenericTable v-else-if="currentView == 'list' && pilotBy == 'use-case'" :columns="[
                { label: 'Role', accessor: 'role' },
                { label: 'Members', accessor: 'member', postfix: helpCircle },
                { label: 'Teams', accessor: 'team', },
                { label: 'Status', accessor: 'status', postfix: arrowDown },
            ]" :tableData="roleTableData" :perPage="9" />

            <!-- <Mindmap v-else-if="currentView == 'mindmap'" /> -->
        </div>
        <ProfilePanel :isShow="showProfilePanel" @close="closeProfilePenel" />
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { watch } from 'vue'
// import KanbanBoard from '../components/feature/KanbanBoard.vue';
import Button from '../components/ui/Button.vue';
import ProfilePanel from '../layout/WorkspaceLayout/components/ProfilePanel.vue';
import ProgressBar from '../components/ui/ProgressBar.vue';
import Collaborators from '../components/ui/Collaborators.vue';
import { useWorkspaceStore } from '../stores/workspace';
// import Dropdown from '../components/ui/Dropdown.vue';
// import bugIcon from "../assets/icons/bbug.svg"
// import useCaseIcon from "../assets/icons/use-case.svg"
// import testCaseIcon from "../assets/icons/text-case.svg"
// import automationIcon from "../assets/icons/automation.svg"
// import KanbanView from '../assets/IconTemplates/KanbanView.svg';
// import MindmapView from '../assets/IconTemplates/MindmapView.svg';
// import ListView from '../assets/IconTemplates/ListView.svg';
// import emptystateIcon from "../assets/empty-state/pilot.svg"
import GenericTable from '../components/ui/GenericTable.vue';
import helpCircle from "../assets/icons/help-circle.svg";
import arrowDown from "../assets/icons/arrow-down.svg"
import Searchbar from '../components/ui/SearchBar.vue';
// import Mindmap from "../components/feature/Mindmap.vue"
// const columns = ref<{ id: number; name: string; cards: { id: number; title: string }[] }[]>([])
const showProfilePanel = ref<boolean>(false);
const workspaceStore = useWorkspaceStore();
const collaborators = [
    { name: 'A', image: 'https://i.pravatar.cc/100?img=1' },
    { name: 'B', image: 'https://i.pravatar.cc/100?img=2' },
    { name: 'C', image: 'https://i.pravatar.cc/100?img=3' },
    { name: 'D', image: 'https://i.pravatar.cc/100?img=4' },
    { name: 'E', image: 'https://i.pravatar.cc/100?img=5' },
    { name: 'E', image: 'https://i.pravatar.cc/100?img=5' },
    { name: 'E', image: 'https://i.pravatar.cc/100?img=5' },
    { name: 'E', image: 'https://i.pravatar.cc/100?img=5' },
];
function closeProfilePenel() {
    showProfilePanel.value = false;
}
watch(
    () => workspaceStore.showSettingPanel,
    (newVal) => {
        if (newVal === true) {
            showProfilePanel.value = false;
        }
    }
)
// function handleOpenPanel() {
//     workspaceStore.showSettingPanel = false
//     setTimeout(() => {
//         showProfilePanel.value = true
//     }, 500)
// }

const pilotBy = ref<'bug' | 'text-case' | 'use-case' | 'automation'>('bug');
// const pilotByOptions = [
//     { label: 'Bugs', value: 'bug', prefix: bugIcon },
//     { label: 'Test Cases', value: 'text-case', prefix: testCaseIcon },
//     { label: 'Use Cases', value: 'use-case', prefix: useCaseIcon },
//     { label: 'Automation', value: 'automation', prefix: automationIcon },
// ]
const currentView = ref<'kanban' | 'list'>('kanban')
// const viewOptions = [
//     { label: 'List', value: 'list', prefix: ListView },
//     { label: 'Kanban', value: 'kanban', prefix: KanbanView },
//     { label: 'Mindmap', value: 'mindmap', prefix: MindmapView },
// ]

function renderTeamTags(teams: string[]): string {
    const visibleTeams = teams.slice(0, 3)
    const remainingCount = teams.length - visibleTeams.length

    return `
    <div class="flex flex-wrap gap-1">
      ${visibleTeams
            .map((team) => {
                const colorClass = getColorClass(team)
                return `<span class="px-1.5 py-0.5 text-xs rounded-full ${colorClass}">${team}</span>`
            })
            .join('')}
      ${remainingCount > 0
            ? `<span class="px-1.5 py-0.5 text-xs rounded-full bg-gray-100 text-text-secondary  border border-gray-200">+${remainingCount}</span>`
            : ''
        }
    </div>
  `
}

function getColorClass(team: string): string {
    const map: Record<string, string> = {
        Design: 'bg-[#F9F5FF] text-[#6941C6] border border-border E9D7FE]',
        Product: 'bg-[#EFF8FF] text-[#175CD3] border border-border B2DDFF]',
        Marketing: 'bg-[#EEF4FF] text-[#3538CD] border border-border C7D7FE]',
    }

    return (
        map[team] ??
        'bg-gray-100 text-text-secondary  border border-gray-200' // fallback
    )
}
function getStatusBadge(status: string): string {
    const base = "px-2 py-0.5 text-xs font-medium rounded-full border inline-flex items-center justify-center w-fit";

    const statusMap: Record<string, { text: string; bg: string; textColor: string; border: string }> = {
        "Online": {
            text: "Online",
            bg: "bg-[#ECFDF3]",
            textColor: "text-[#067647]",
            border: "border-border ABEFC6]"
        },
        "Offline": {
            text: "Offline",
            bg: "bg-[#FEF3F2]",
            textColor: "text-[#B42318]",
            border: "border-border FECDCA]"
        },
        "On Leave": {
            text: "On Leave",
            bg: "bg-[#FFFAEB]",
            textColor: "text-[#B54708]",
            border: "border-border FEDF89]"
        },
        "Design": {
            text: "Design",
            bg: "bg-[#F9F5FF]",
            textColor: "text-[#6941C6]",
            border: "border-border E9D7FE]"
        },
        "Product": {
            text: "Product",
            bg: "bg-[#EFF8FF]",

            textColor: "text-[#175CD3]", border: "border-border B2DDFF]"

        }

    };

    const s = statusMap[status] || {
        text: status,
        bg: "bg-gray-50",
        textColor: "text-text-secondary -700",
        border: "border-gray-200"
    };

    return `<div class="${base} ${s.bg} ${s.textColor} ${s.border}">${s.text}</div>`;
}

const pilot = [
    {
        id: '1',
        name: {
            template: `<div class="flex items-center gap-3">
        <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
        <div>
          <div class="font-medium text-text-primary">Olivia Rhye</div>
          <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
        </div>
      </div>`
        },
        team: {
            template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

        },
        role: 'Product Designer',
        status:
        {
            template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
            <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
             Active</div>` },
    },
    {
        id: '2',
        name: {
            template: `<div class="flex items-center gap-3">
        <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
        <div>
          <div class="font-medium text-text-primary">Olivia Rhye</div>
          <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
        </div>
      </div>`
        },
        team: {
            template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

        },
        role: 'Product Designer',
        status:
        {
            template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
            <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
             Active</div>` },
    },
    {
        id: '3',
        name: {
            template: `<div class="flex items-center gap-3">
        <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
        <div>
          <div class="font-medium text-text-primary">Olivia Rhye</div>
          <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
        </div>
      </div>`
        },
        team: {
            template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

        },
        role: 'Product Designer',
        status:
        {
            template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
            <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
             Active</div>` },
    },
    {
        id: '4',
        name: {
            template: `<div class="flex items-center gap-3">
        <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
        <div>
          <div class="font-medium text-text-primary">Olivia Rhye</div>
          <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
        </div>
      </div>`
        },
        team: {
            template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

        },
        role: 'Product Designer',
        status:
        {
            template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
            <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
             Active</div>` },
    },
    {
        id: '5',
        name: {
            template: `<div class="flex items-center gap-3">
        <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
        <div>
          <div class="font-medium text-text-primary">Olivia Rhye</div>
          <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
        </div>
      </div>`
        },
        team: {
            template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

        },
        role: 'Product Designer',
        status:
        {
            template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
            <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
             Active</div>` },
    },
    {
        id: '6',
        name: {
            template: `<div class="flex items-center gap-3">
        <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
        <div>
          <div class="font-medium text-text-primary">Olivia Rhye</div>
          <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
        </div>
      </div>`
        },
        team: {
            template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

        },
        role: 'Product Designer',
        status:
        {
            template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
            <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
             Active</div>` },
    },
    {
        id: '7',
        name: {
            template: `<div class="flex items-center gap-3">
        <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
        <div>
          <div class="font-medium text-text-primary">Olivia Rhye</div>
          <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
        </div>
      </div>`
        },
        team: {
            template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

        },
        role: 'Product Designer',
        status:
        {
            template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
            <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
             Active</div>` },
    },
    {
        id: '8',
        name: {
            template: `<div class="flex items-center gap-3">
        <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
        <div>
          <div class="font-medium text-text-primary">Olivia Rhye</div>
          <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
        </div>
      </div>`
        },
        team: {
            template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

        },
        role: 'Product Designer',
        status:
        {
            template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
            <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
             Active</div>` },
    },
    {
        id: '9',
        name: {
            template: `<div class="flex items-center gap-3">
        <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
        <div>
          <div class="font-medium text-text-primary">Olivia Rhye</div>
          <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
        </div>
      </div>`
        },
        team: {
            template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

        },
        role: 'Product Designer',
        status:
        {
            template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
            <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
             Active</div>` },
    },
    {
        id: '10',
        name: {
            template: `<div class="flex items-center gap-3">
        <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
        <div>
          <div class="font-medium text-text-primary">Olivia Rhye</div>
          <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
        </div>
      </div>`
        },
        team: {
            template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

        },
        role: 'Product Designer',
        status:
        {
            template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
            <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
             Active</div>` },
    },
    {
        id: '11',
        name: {
            template: `<div class="flex items-center gap-3">
        <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
        <div>
          <div class="font-medium text-text-primary">Olivia Rhye</div>
          <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
        </div>
      </div>`
        },
        team: {
            template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

        },
        role: 'Product Designer',
        status:
        {
            template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
            <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
             Active</div>` },
    },
    {
        id: '12',
        name: {
            template: `<div class="flex items-center gap-3">
        <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
        <div>
          <div class="font-medium text-text-primary">Olivia Rhye</div>
          <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
        </div>
      </div>`
        },
        team: {
            template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

        },
        role: 'Product Designer',
        status:
        {
            template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
            <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
             Active</div>` },
    },
    {
        id: '13',
        name: {
            template: `<div class="flex items-center gap-3">
        <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
        <div>
          <div class="font-medium text-text-primary">Olivia Rhye</div>
          <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
        </div>
      </div>`
        },
        team: {
            template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

        },
        role: 'Product Designer',
        status:
        {
            template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
            <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
             Active</div>` },
    },
    // more...
]


const tableData = Array.from({ length: 23 }, (_, i) => ({
    id: `dept-${i + 1}`,
    department: 'Design',
    team: {
        template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])
    },
    member: {
        component: Collaborators,
        props: {
            avatars: collaborators,
            maxVisible: 5,
            size: 6,
            overlapSpace: 2,
        }
    },
    status:
    {
        template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
             Active</div>` },
    children: [
        {
            id: 'user-1',
            department: {
                template: ` <div class="flex  items-center  justify-between">

                    <div class="flex items-center gap-3">
       <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
       <div>
         <div class="font-medium text-text-primary">Olivia Rhye</div>
         <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
       </div>
     </div>
 <div class="text-xs font-medium flex flex-col gap-2 ">
                    <span class=" text-[#47494D]">
                    Role
                    </span>
                    <span class=" text-[#6B21A8] bg-[#F3E8FF] py-1 px-2.5 rounded-full">
                    Product Designer
                    </span>
                    </div>
                    </div>`},

            team: {
                template: `<div class="flex items-center text-xs font-medium justify-between max-w-[128px] mb-2">
                        <span class="text-text-primary">Progress</span> <span class="text-sm text-[#16A34A]">75%</span>
                        </div>`,
                component: ProgressBar,
                props: {
                    progress: 75,
                    fillColor: 'bg-[#A855F7]',
                    class: "max-w-[128px]"
                }
            },
            member: {
                template: `<h3 class="text-xs font-medium text-text-primary uppercase mb-1.5">Tasks Completed</h3>
                    <span class="text-sm text-text-primary">75/100</span>
                    `
            },
            status: {
                template: getStatusBadge('Online')
            },
        },
        {
            id: 'user-2',
            department: {
                template: ` <div class="flex  items-center  justify-between">

                    <div class="flex items-center gap-3">
       <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
       <div>
         <div class="font-medium text-text-primary">Olivia Rhye</div>
         <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
       </div>
     </div>
 <div class="text-xs font-medium flex flex-col gap-2 ">
                    <span class=" text-[#47494D]">
                    Role
                    </span>
                    <span class=" text-[#6B21A8] bg-[#F3E8FF] py-1 px-2.5 rounded-full">
                    Product Designer
                    </span>
                    </div>
                    </div>`},

            team: {
                template: `<div class="flex items-center text-xs font-medium justify-between max-w-[128px] mb-2">
                        <span class="text-text-primary">Progress</span> <span class="text-sm text-[#16A34A]">75%</span>
                        </div>`,
                component: ProgressBar,
                props: {
                    progress: 75,
                    fillColor: 'bg-[#A855F7]',
                    class: "max-w-[128px]"
                }
            },
            member: {
                template: `<h3 class="text-xs font-medium text-text-primary uppercase mb-1.5">Tasks Completed</h3>
                    <span class="text-sm text-text-primary">75/100</span>
                    `
            },
            status: {
                template: getStatusBadge('Online')
            },
        }
    ]
}),)


const roleTableData = Array.from({ length: 23 }, (_, i) => (
    {
        id: `user-${i + 1}`,
        role: "Product Designer",
        member: {
            template: `    <div class="flex items-center gap-3">
       <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
       <div>
         <div class="font-medium text-text-primary">Olivia Rhye</div>
         <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
       </div>
     </div>`
        },
        team: {
            template: getStatusBadge('Design')
        },
        status:
        {
            template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
             Active</div>` },
    }
),)

</script>
