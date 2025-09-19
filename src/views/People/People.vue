<template>
    <div class="flex gap-3 flex-auto h-full overflow-x-auto w-full ">
        <div class="w-full h-full bg-white/90 rounded-lg overflow-y-auto flex-col flex  ">
            <div class="header px-4 py-3 border-b  border-border-gray flex items-center justify-between gap-1">
                <!-- <Dropdown v-model="peopleBy" :options="peopleByOptions" prefix="People by" variant="secondary" /> -->
                <div class="flex gap-3 items-center">
                    <Searchbar placeholder="Search in streamed space">
                    </Searchbar>
                    <Button variant="secondary" size="md" @click="workspaceStore.toggleFilter()">
                        <div class="flex  gap-2">
                            <img src="../../assets/icons/filter.svg" alt="">
                            Filter
                        </div>
                    </Button>
                    <!-- <Dropdown v-model="currentView" :options="viewOptions" /> -->
                </div>
            </div>
            <!-- <KanbanBoard :onAddTicket="(colIndex: number) => {

                currentColIndex = colIndex
                createTeamMemberModal = true
            }" v-if="currentView == 'kanban'" :columns="columns" :emptyState="{
                title: 'Get started with creating team',
                description: 'GCreate teams and assign them their tasks.',
                icon: emptystateIcon,
                buttonLabel: 'Create Team',
                buttonClickHandler: () => { createTeamModal = true }
            }">
                <template #kanban-item="{ element, colIndex, cardIndex }">
                    <TeamCard :element="element" :colIndex="colIndex" :cardIndex="cardIndex"
                        :menuItems="getMenuItems(colIndex, cardIndex)" />
                </template>
            </KanbanBoard> -->
            <TeamTable v-if="currentView == 'list' && peopleBy == 'team'" />
            <!-- <GenericTable v-else-if="currentView == 'list' && peopleBy == 'team'" :columns="[
                { label: 'Name', accessor: 'name' },
                { label: 'Teams', accessor: 'team' },
                {
                    label: 'Role', accessor: 'role', postfix: helpCircle, type: 'select', default: 'Product Designer', options: [{
                        label: 'Manager',
                        value: 'Manager'
                    },
                    {
                        label: 'Product Desinger',
                        value: 'Product Designer'
                    }
                    ]
                },
                {
                    label: 'Status', accessor: 'status', postfix: arrowDown, default: 'unactive', type: 'select', options: [{
                        label: 'Active',
                        value: 'active'
                    },
                    {
                        label: 'UnActive',
                        value: 'unactive'
                    }
                    ]
                },
            ]" :tableData="people" :perPage="9" /> -->

            <GenericTable v-else-if="currentView == 'list' && peopleBy == 'department'" :columns="[
                { label: 'Department', accessor: 'department' },
                { label: 'Team', accessor: 'team' },
                { label: 'Members Count', accessor: 'member', postfix: helpCircle },
                { label: 'Status', accessor: 'status', postfix: arrowDown },
            ]" :tableData="tableData" :perPage="9" />
            <GenericTable v-else-if="currentView == 'list' && peopleBy == 'role'" :columns="[
                { label: 'Role', accessor: 'role' },
                { label: 'Members', accessor: 'member', postfix: helpCircle },
                { label: 'Teams', accessor: 'team', },
                { label: 'Status', accessor: 'status', postfix: arrowDown },
            ]" :tableData="roleTableData" :perPage="9" />


        </div>
        <CreateTeamModal v-model="createTeamModal" @create="createTeam" />
        <AddTeamMemberModal v-model="createTeamMemberModal" @add="createTeamMember" />
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
// import KanbanBoard from '../../components/feature/KanbanBoard.vue';
import Button from '../../components/ui/Button.vue';
import ProgressBar from '../../components/ui/ProgressBar.vue';
import Collaborators from '../../components/ui/Collaborators.vue';
import { useWorkspaceStore } from '../../stores/workspace';
// import Dropdown from '../../components/ui/Dropdown.vue';
// import peopleIcon from "../../assets/icons/people2.svg?url"
// import departmentIcon from "../../assets/icons/department.svg?url"
// import roleIcon from "../../assets/icons/role.svg?url"
// import KanbanView from '../../assets/IconTemplates/KanbanView.svg';
// import MindmapView from '../../assets/IconTemplates/MindmapView.svg';
// import ListView from '../../assets/IconTemplates/ListView.svg';
// import emptystateIcon from "../../assets/empty-state/team.svg"
import GenericTable from '../../components/ui/GenericTable.vue';
import helpCircle from "../../assets/icons/help-circle.svg";
import arrowDown from "../../assets/icons/arrow-down.svg"
import Searchbar from '../../components/ui/SearchBar.vue';
// import cardIcon from "../../assets/icons/card.svg"
// import arrowLeftIcon from "../../assets/icons/arrow-left.svg"
// import arrowRightIcon from "../../assets/icons/arrow-right.svg"
// import deleteIcon from "../../assets/icons/delete.svg"
// import TeamCard from './components/TeamCard.vue';
import CreateTeamModal from './modals/CreateTeamModal.vue';
import AddTeamMemberModal from './modals/AddTeamMemberModal.vue';
import TeamTable from './tables/TeamTable.vue';
const createTeamModal = ref(false);
const createTeamMemberModal = ref(false);
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
const currentColIndex = ref(0)

// function handleOpenPanel() {
//     workspaceStore.toggleProfilePanel()
// }

const peopleBy = ref<'team' | 'department' | 'role'>('team');
// const peopleByOptions = [
//     { label: 'Team', value: 'team', prefix: peopleIcon },
//     { label: 'Departments', value: 'department', prefix: departmentIcon },
//     { label: 'Roles', value: 'role', prefix: roleIcon },
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

// const people = [
//     {
//         id: '1',
//         name: {
//             template: `<div class="flex items-center gap-3">
//         <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
//         <div>
//           <div class="font-medium text-text-primary">Olivia Rhye</div>
//           <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
//         </div>
//       </div>`
//         },
//         team: {
//             template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

//         },
//         role: 'Product Designer',
//         status:
//         {
//             template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
//             <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
//              Active</div>` },
//     },
//     {
//         id: '2',
//         name: {
//             template: `<div class="flex items-center gap-3">
//         <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
//         <div>
//           <div class="font-medium text-text-primary">Olivia Rhye</div>
//           <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
//         </div>
//       </div>`
//         },
//         team: {
//             template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

//         },
//         role: 'Product Designer',
//         status:
//         {
//             template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
//             <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
//              Active</div>` },
//     },
//     {
//         id: '3',
//         name: {
//             template: `<div class="flex items-center gap-3">
//         <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
//         <div>
//           <div class="font-medium text-text-primary">Olivia Rhye</div>
//           <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
//         </div>
//       </div>`
//         },
//         team: {
//             template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

//         },
//         role: 'Product Designer',
//         status:
//         {
//             template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
//             <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
//              Active</div>` },
//     },
//     {
//         id: '4',
//         name: {
//             template: `<div class="flex items-center gap-3">
//         <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
//         <div>
//           <div class="font-medium text-text-primary">Olivia Rhye</div>
//           <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
//         </div>
//       </div>`
//         },
//         team: {
//             template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

//         },
//         role: 'Product Designer',
//         status:
//         {
//             template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
//             <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
//              Active</div>` },
//     },
//     {
//         id: '5',
//         name: {
//             template: `<div class="flex items-center gap-3">
//         <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
//         <div>
//           <div class="font-medium text-text-primary">Olivia Rhye</div>
//           <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
//         </div>
//       </div>`
//         },
//         team: {
//             template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

//         },
//         role: 'Product Designer',
//         status:
//         {
//             template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
//             <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
//              Active</div>` },
//     },
//     {
//         id: '6',
//         name: {
//             template: `<div class="flex items-center gap-3">
//         <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
//         <div>
//           <div class="font-medium text-text-primary">Olivia Rhye</div>
//           <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
//         </div>
//       </div>`
//         },
//         team: {
//             template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

//         },
//         role: 'Product Designer',
//         status:
//         {
//             template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
//             <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
//              Active</div>` },
//     },
//     {
//         id: '7',
//         name: {
//             template: `<div class="flex items-center gap-3">
//         <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
//         <div>
//           <div class="font-medium text-text-primary">Olivia Rhye</div>
//           <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
//         </div>
//       </div>`
//         },
//         team: {
//             template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

//         },
//         role: 'Product Designer',
//         status:
//         {
//             template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
//             <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
//              Active</div>` },
//     },
//     {
//         id: '8',
//         name: {
//             template: `<div class="flex items-center gap-3">
//         <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
//         <div>
//           <div class="font-medium text-text-primary">Olivia Rhye</div>
//           <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
//         </div>
//       </div>`
//         },
//         team: {
//             template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

//         },
//         role: 'Product Designer',
//         status:
//         {
//             template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
//             <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
//              Active</div>` },
//     },
//     {
//         id: '9',
//         name: {
//             template: `<div class="flex items-center gap-3">
//         <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
//         <div>
//           <div class="font-medium text-text-primary">Olivia Rhye</div>
//           <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
//         </div>
//       </div>`
//         },
//         team: {
//             template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

//         },
//         role: 'Product Designer',
//         status:
//         {
//             template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
//             <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
//              Active</div>` },
//     },
//     {
//         id: '10',
//         name: {
//             template: `<div class="flex items-center gap-3">
//         <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
//         <div>
//           <div class="font-medium text-text-primary">Olivia Rhye</div>
//           <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
//         </div>
//       </div>`
//         },
//         team: {
//             template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

//         },
//         role: 'Product Designer',
//         status:
//         {
//             template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
//             <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
//              Active</div>` },
//     },
//     {
//         id: '11',
//         name: {
//             template: `<div class="flex items-center gap-3">
//         <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
//         <div>
//           <div class="font-medium text-text-primary">Olivia Rhye</div>
//           <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
//         </div>
//       </div>`
//         },
//         team: {
//             template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

//         },
//         role: 'Product Designer',
//         status:
//         {
//             template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
//             <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
//              Active</div>` },
//     },
//     {
//         id: '12',
//         name: {
//             template: `<div class="flex items-center gap-3">
//         <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
//         <div>
//           <div class="font-medium text-text-primary">Olivia Rhye</div>
//           <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
//         </div>
//       </div>`
//         },
//         team: {
//             template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

//         },
//         role: 'Product Designer',
//         status:
//         {
//             template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
//             <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
//              Active</div>` },
//     },
//     {
//         id: '13',
//         name: {
//             template: `<div class="flex items-center gap-3">
//         <img src="https://i.pravatar.cc/100?img=1" class="w-8 h-8 rounded-full" />
//         <div>
//           <div class="font-medium text-text-primary">Olivia Rhye</div>
//           <div class="text-sm text-text-secondary -500">olivia@untitledui.com</div>
//         </div>
//       </div>`
//         },
//         team: {
//             template: renderTeamTags(['Design', 'Product', 'Marketing', 'professionally', 'dhjh'])

//         },
//         role: 'Product Designer',
//         status:
//         {
//             template: `<div  class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-white border-border D5D7DA] border text-[#414651] flex  items-center gap-1 w-fit"> 
            
//             <div class=" w-1.5 h-1.5 rounded-full bg-[#17B26A]"></div>
//              Active</div>` },
//     },
//     // more...
// ]


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
const columnId = ref(1)
const cardId = ref(1)
const columns = ref<{ id: number; name: string; cards: { id: number; title: string, color: string }[] }[]>([

    // {
    //     id: 1,
    //     name: 'To-Do',
    //     cards: [
    //         {
    //             id: 1,
    //             title: 'Create a new project',
    //         },
    //         {
    //             id: 2,
    //             title: 'Create a new project',
    //         },
    //     ]
    // },
    // {
    //     id: 2,
    //     name: 'To-Do',
    //     cards: [
    //         {
    //             id: 1,
    //             title: 'Create a new project',
    //         },
    //         {
    //             id: 2,
    //             title: 'Create a new project',
    //         },
    //     ]
    // }

])


function createTeam(teamName: { teamName: string }) {

    if (!teamName) return
    columns.value.push({
        id: columnId.value++,
        name: teamName.teamName,
        cards: []
    })
    createTeamModal.value = false
}

function createTeamMember(initialMemberName = { name: 'iman' },) {

    if (!initialMemberName) return
    columns.value[currentColIndex.value].cards.push({
        id: cardId.value++,
        title: initialMemberName.name,
        color: 'bg-red-300'
    })
}

// function moveCardUp(colIndex: number, cardIndex: number) {
//     const cards = columns.value[colIndex].cards
//     if (cardIndex > 0) {
//         const temp = cards[cardIndex]
//         cards[cardIndex] = cards[cardIndex - 1]
//         cards[cardIndex - 1] = temp
//     }
// }

// function moveCardDown(colIndex: number, cardIndex: number) {
//     const cards = columns.value[colIndex].cards
//     if (cardIndex < cards.length - 1) {
//         const temp = cards[cardIndex]
//         cards[cardIndex] = cards[cardIndex + 1]
//         cards[cardIndex + 1] = temp
//     }
// }


// function getMenuItems(colIndex: number, cardIndex: number) {
//     return [
//         {
//             label: 'Open card', icon: cardIcon, action: () => {

//                 handleOpenPanel();
//             }
//         }, {
//             label: 'Move down',
//             icon: arrowRightIcon,
//             action: () => moveCardDown(colIndex, cardIndex)
//         },
//         {
//             label: 'Move up', icon: arrowLeftIcon,
//             action: () => moveCardUp(colIndex, cardIndex)
//         },
//         { label: 'Delete', icon: deleteIcon, action: () => console.log('Remove') },
//         // ... other actions
//     ]
// }

</script>
