<template>
    <div class="w-full text-text-primary  bg-bg-body ">

        <div class="max-w-[1440px] w-full mx-auto md:px-15 md:py-20 px-5 py-10  ">
            <div class="flex justify-between items-center flex-wrap gap-5">
                <div class="flex flex-col gap-2 max-md:gap-1 ">
                    <h1 class="text-2xl font-medium text-text-primary ">Welcome to Streamed!</h1>
                    <p class="text-sm text-text-secondary">Create, organize, and collaborate seamlessly.
                    </p>
                </div>
                <dv class="flex gap-3 items-center">

                    <Button variant="secondary">Invite team</Button>
                    <RouterLink to="/create-workspace">
                        <Button variant="primary">
                            Create a workspace
                        </Button>
                    </RouterLink>
                </dv>
            </div>
            <h2 class="text-xl font-medium text-text-primary  mt-10">Create New</h2>
            <div class="flex gap-4 mt-4 overflow-x-auto">
                <RouterLink to="/create-workspace">
                    <div class="flex flex-col gap-2">
                        <div class="bg-bg-card  p-6 rounded-lg w-37.5 h-39.5 flex items-center justify-center">
                            <Plus />

                        </div>
                        <div class="flex flex-col gap-1">
                            <h1 class="text-sm font-medium text-text-primary "> Blank project</h1>
                            <p class="text-xs text-text-secondary  ">Start from scratch</p>
                        </div>
                    </div>
                </RouterLink>

                <div v-for="template in templates" :key="template.id" class="flex flex-col gap-2">
                    <div class="bg-bg-card  p-6 rounded-lg w-37.5 h-39.5 flex items-center justify-center">
                        <img :src="template.icon" alt="">
                    </div>
                    <div class="flex flex-col gap-1">
                        <h1 class="text-sm font-medium text-text-primary "> {{ template.name }}</h1>
                        <p class="text-xs text-text-secondary  text-secondary"> {{ template.name }}</p>
                    </div>
                </div>
            </div>

            <h2 class="text-xl font-medium text-text-primary  mt-21">All Workspaces</h2>
            <div class="flex justify-between items-center mt-5 mb-8">
                <div class="flex items-center gap-3">

                    <Button variant="primary">Recents</Button>
                    <!-- <Dropdown v-model="currentView" :options="viewOptions" /> -->
                </div>

                <div class="flex items-center gap-3">
                    <FontAwesomeIcon class="cursor-pointer"
                        :class="{ 'text-accent bg-accent-text p-1 rounded-md': currentView === 'list' }"
                        :icon="['fas', 'align-left']" @click="currentView = 'list'" />

                    <FontAwesomeIcon class=" cursor-pointer" :icon="['fa', 'table-cells-large']"
                        @click="() => currentView = 'gallery'"
                        :class="{ 'text-accent bg-accent-text p-1 rounded-md': currentView === 'gallery' }" />
                    <FontAwesomeIcon class=" cursor-pointer" :icon="['fa', 'table-cells']"
                        @click="() => currentView = 'grid'"
                        :class="{ 'text-accent bg-accent-text p-1 rounded-md': currentView === 'grid' }" />
                </div>
            </div>

            <!-- table list view  -->

            <WorkspaceListTable v-if="currentView === 'list'" :data="data" :isPending="isPending" />
            <TimeLineTable :timeline="timeline" :projects="projects" v-else-if="currentView === 'timeline'" />
            <ProjectGallery :projects="data || []" :loading="isPending" v-else-if="currentView === 'gallery'" />
            <StatusTable :columns="columns2" :rows="data || []" :total="data ? data.length : 0" v-model:page="page"
                v-model:pageSize="pageSize" :loading="isPending"
                @page-change="({ page, pageSize }) => fetchPage(page, pageSize)"
                v-else-if="currentView === 'grid' || currentView === 'process' || currentView === 'progress'" />
        </div>
    </div>
</template>

<script setup lang="ts">
import Button from "../../components/ui/Button.vue";
import eduIcon from "../../assets/icons/education.svg";
import businessIcon from "../../assets/icons/business.svg";
import intertainmentIcon from "../../assets/icons/entertainment.svg";
import financeIcon from "../../assets/icons/Finance.svg";
import medicalIcon from "../../assets/icons/medical.svg";
import drinkIcon from "../../assets/icons/drink.svg";
import gymIcon from "../../assets/icons/gym.svg";
// import Dropdown from "../../components/ui/Dropdown.vue";
import { ref } from 'vue'
import TimeLineTable from "../../components/ui/TimeLineTable.vue";
import { generateTimeline } from "../../utilities/GantChart";
import ProjectGallery from "../../components/ui/ProjectGallery.vue";
import StatusTable from "../../components/ui/StatusTable.vue";
import Plus from "../../assets/IconTemplates/plus.vue";
import { useWorkspaces } from "../../queries/useWorkspace";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import WorkspaceListTable from "./components/WorkspaceListTable.vue";
const columns2 = ['RND', 'Designing', 'Design Review', 'Spec Doc', 'Development', 'QA', 'Content']
const { data, isPending } = useWorkspaces()
const page = ref(1);
const pageSize = ref();
const fetchPage = (page: any, pageSize: any) => {
    page.value = page;
    pageSize.value = pageSize;
}

const currentView = ref<'list' | 'grid' | 'gallery' | 'timeline'>('list')
const templates = [
    {
        id: 1,
        name: "Business",
        icon: businessIcon
    },
    {
        id: 2,
        name: "Education",
        icon: eduIcon
    },
    {
        id: 3,
        name: "Entertainment",
        icon: intertainmentIcon
    },
    {
        id: 4,
        name: "Finance",
        icon: financeIcon
    }
    ,
    {
        id: 5,
        name: "Medical",
        icon: medicalIcon
    }
    ,
    {
        id: 6,
        name: "Food & Drink",
        icon: drinkIcon
    }
    ,
    {
        id: 7,
        name: "health & fitness",
        icon: gymIcon
    }

]

// const viewOptions = [
//     { label: 'Lane vs Process', value: 'list', default: true, },
//     { label: 'Lane vs Timeline', value: 'timeline' },
//     { label: 'Lane vs Progress', value: 'progress' }
// ]



const timeline = generateTimeline('2025-01-01', '2025-05-15', 1) // weekly steps

const projects = [
    {
        name: 'Bonjour',
        icon: '/logos/bonjour.png',
        bars: [
            {
                label: 'In progress',
                startDate: '2025-01-02',
                endDate: '2025-04-23',
                progress: 97,
                pill: '#F87171',
                bg: '#FEF2F2',
                status: 'In progress'
            }
        ]
    },
    {
        name: 'Laqtaat',
        icon: '/logos/laqtaat.png',
        bars: [
            {
                label: 'Live',
                startDate: '2025-01-09',
                endDate: '2025-02-15',
                progress: 100,
                pill: '#06B6D4',
                bg: '#E0F2FE',
                status: 'Live'
            }
        ]
    }
]


</script>