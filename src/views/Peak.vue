<template>
  <div class="space-y-2 flex flex-col h-full overflow-x-auto w-full flex-auto">
    <div class="p-5 rounded-lg bg-bg-card space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex flex-col">
          <h3 class="text-2xl text-text-primary font-semibold">
            Project Overview
          </h3>
          <p class="text-sm text-text-secondary mt-2">
            Last update on Sep 12, 2024 - 09.45 AM
          </p>
        </div>
        <Button variant="primary">
          <div class="flex gap-2 items-center">
            <img src="../assets/icons/whitePlus.svg" alt="" /> Create New Ticket
          </div>
        </Button>
      </div>
      <div class="flex">
        <Collaborators :avatars="collaborators" :maxVisible="3" size="8" overlapSpace="5" />
        <div
          class="add border border-dashed border-border w-8 h-8 p-1 rounded-full flex justify-center items-center ml-2">
          <img src="../assets/icons/grayPlus.svg" alt="" />
        </div>
      </div>
      <div class="flex gap-2.5 overflow-x-auto">
        <ProjectCard v-for="lane in getWorkspace?.lanes" :title="lane.variables['lane-title']"
          subtitle="Mobile Application" status="In-progress" :progress="75" :avatars="[
            'https://randomuser.me/api/portraits/women/1.jpg',
            'https://randomuser.me/api/portraits/men/2.jpg',
            'https://randomuser.me/api/portraits/men/3.jpg',
          ]" date="May 28" />
      </div>
    </div>
    <div class="flex-1 min-h-0 overflow-hidden flex flex-col">
      <Transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter" @before-leave="beforeLeave"
        @leave="leave">
        <div class="p-5 rounded-lg bg-bg-card flex-col w-full transition-all duration-500 overflow-hidden relative"
          :class="`${expanded ? '!fixed h-screen w-screen top-0 left-0 ' : 'flex'
            }`">
          <div class="flex justify-between items-center mb-2.5">
            <!-- <Dropdown v-if="currentView == 'matrics'" v-model="currentMatrics" :options="metricsOptions" /> -->
            <!-- <Dropdown v-else-if="currentView == 'timeline'" v-model="currentTimeline"
                            :options="timelineOptions" /> -->

            <!-- <div class="flex items-center gap-2">
              <Dropdown v-model="currentView" :options="viewOptions" />
              <Button variant="secondary" class="!p-2" @click="expandHandler">
                <FontAwesomeIcon :icon="['fas', 'up-right-and-down-left-from-center']" />
              </Button>
            </div> -->
          </div>

          <StatusTable v-if="currentMatrics == 'process' && currentView == 'matrics'" :columns="columns2"
            :rows="rows2" />
          <StatusTable v-else-if="
            currentMatrics == 'functions' && currentView == 'matrics'
          " :columns="functionColumns" :rows="functionRows" />

          <TimeLineTable :timeline="timeline" :projects="projects2"
            v-if="currentView === 'timeline' && currentTimeline == 'lane'" />
          <TimeLineTable :timeline="timeline" :projects="projectsStep"
            v-if="currentView === 'timeline' && currentTimeline == 'step'" />
          <TimeLineTable :timeline="timeline" :projects="projectsStep"
            v-if="currentView === 'timeline' && currentTimeline == 'process'" />
        </div>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import ProjectCard from "../components/feature/ProjectCard.vue";
import Button from "../components/ui/Button.vue";
import Collaborators from "../components/ui/Collaborators.vue";
import StatusTable from "../components/ui/StatusTable.vue";
import logo from "../assets/temp/myHivelogo.svg";
// import Dropdown from '../components/ui/Dropdown.vue';
import { computed, ref, watch } from "vue";
import TimeLineTable from "../components/ui/TimeLineTable.vue";
import { generateTimeline } from "../utilities/GantChart";
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useCheckProgress, useSingleWorkspace } from "../queries/useWorkspace";
import { useRouteIds } from "../composables/useQueryParams";

const { jobId, workspaceId } = useRouteIds()
const progress = useCheckProgress(jobId.value);
const enableStream = computed(() => progress.isSuccess.value);
const { data: getWorkspace } = useSingleWorkspace(workspaceId.value);

// // Streamed progress call (conditionally triggered)
const {data:progressStreamed} = useCheckProgress(`${jobId.value}/stream`, {
  enabled: enableStream
});


// // Optional: Watch to log when it's available
watch(() => progressStreamed.value, (val) => {
  if (val) {
    console.log('>>> streamed progress:', val);
  }
});
// import Timeline from '../assets/IconTemplates/Timeline.vue';
// import Matrics from '../assets/IconTemplates/Matrics.vue';
const collaborators = [
  { name: "A", image: "https://i.pravatar.cc/100?img=1" },
  { name: "B", image: "https://i.pravatar.cc/100?img=2" },
  { name: "C", image: "https://i.pravatar.cc/100?img=3" },
  { name: "D", image: "https://i.pravatar.cc/100?img=4" },
  { name: "E", image: "https://i.pravatar.cc/100?img=5" },
];
// const lanes = [
//     {
//         name: 'Consumer',

//     },
//     {
//         name: 'Business',
//     },
//     {
//         name: 'Vender',
//     },
//     {
//         name: 'CMS',
//     },
// ]
const columns2 = [
  "RND",
  "Designing",
  "Design Review",
  "Spec Doc",
  "Development",
  "QA",
  "Content",
];
const rows2 = [
  {
    name: "Consumer (App)",
    icon: logo,
    RND: "Done",
    Designing: "Done",
    "Design Review": "Done",
    "Spec Doc": "Done",
    Development: "In progress",
    QA: "In progress",
    Content: "In progress",
    link: "/workspace/2",
  },
  {
    name: "Provider",
    icon: logo,
    RND: "To do",
    Designing: "Back log",
    "Design Review": "In progress",
    "Spec Doc": "To do",
    Development: "To do",
    QA: "To do",
    Content: "To do",
    link: "/workspace/3",
  },
  {
    name: "Company",
    icon: logo,
    RND: "Done",
    Designing: "Done",
    "Design Review": "Done",
    "Spec Doc": "In progress",
    Development: "Done",
    QA: "Done",
    Content: "To do",
    link: "/workspace/3",
  },
  {
    name: "Property",
    icon: logo,
    RND: "In progress",
    Designing: "To do",
    "Design Review": "In progress",
    "Spec Doc": "To do",
    Development: "In progress",
    QA: "To do",
    Content: "To do",
    link: "/workspace/3",
  },
  {
    name: "Landing Page",
    icon: logo,
    RND: "Done",
    Designing: "To do",
    "Design Review": "Done",
    "Spec Doc": "In progress",
    Development: "To do",
    QA: "In progress",
    Content: "To do",
    link: "/workspace/3",
  },
  {
    name: "CMS",
    icon: logo,
    RND: "Done",
    Designing: "In progress",
    "Design Review": "In progress",
    "Spec Doc": "To do",
    Development: "To do",
    QA: "To do",
    Content: "To do",
    link: "/workspace/3",
  },
  {
    name: "Brand/Social Kit",
    icon: logo,
    RND: "Done",
    Designing: "In progress",
    "Design Review": "In progress",
    "Spec Doc": "To do",
    Development: "To do",
    QA: "To do",
    Content: "To do",
    link: "/workspace/3",
  },
  // Add more projects...
];
const functionColumns = [
  "Modules",
  "Features",
  "Frontend Screens",
  "API",
  "User Stories",
  "Use Cases",
  "Test Cases",
];
const functionRows = [
  {
    name: "Consumer (App)",
    icon: logo,
    Modules: "/logos/bonjour.png",
    Features: "Done",
    "Frontend Screens": "Done",
    API: "Done",
    "User Stories": "Done",
    "Use Cases": "In progress",
    "Test Cases": "In progress",
  },
  {
    name: "Provider",
    icon: logo,
    Modules: "/logos/bonjour.png",
    Features: "Done",
    "Frontend Screens": "Done",
    API: "Done",
    "User Stories": "Done",
    "Use Cases": "In progress",
    "Test Cases": "In progress",
  },
  {
    name: "Company",
    icon: logo,
    Modules: "/logos/bonjour.png",
    Features: "Done",
    "Frontend Screens": "Done",
    API: "Done",
    "User Stories": "Done",
    "Use Cases": "In progress",
    "Test Cases": "In progress",
  },
  {
    name: "Property",
    icon: logo,
    Modules: "/logos/bonjour.png",
    Features: "Done",
    "Frontend Screens": "Done",
    API: "Done",
    "User Stories": "Done",
    "Use Cases": "In progress",
    "Test Cases": "In progress",
  },
  {
    name: "Landing Page",
    icon: logo,
    Modules: "/logos/bonjour.png",
    Features: "Done",
    "Frontend Screens": "Done",
    API: "Done",
    "User Stories": "Done",
    "Use Cases": "In progress",
    "Test Cases": "In progress",
  },
  {
    name: "CMS",
    icon: logo,
    Modules: "/logos/bonjour.png",
    Features: "Done",
    "Frontend Screens": "Done",
    API: "Done",
    "User Stories": "Done",
    "Use Cases": "In progress",
    "Test Cases": "In progress",
  },
  {
    name: "Brand/Social Kit",
    icon: logo,
    Modules: "/logos/bonjour.png",
    Features: "Done",
    "Frontend Screens": "Done",
    API: "Done",
    "User Stories": "Done",
    "Use Cases": "In progress",
    "Test Cases": "In progress",
  },
  // Add more projects...
];
// const metricsOptions = [
//     { label: 'Lane vs Process', value: 'process', default: true, },
//     { label: 'Lane vs Functions', value: 'functions' },
// ]
// const timelineOptions = [
//     { label: 'Timeline by Lane', value: 'lane', default: true },
//     { label: 'Timeline by Step', value: 'step' },
//     { label: 'Timeline by Process', value: 'process' },
// ]
// const viewOptions = [
//     { label: 'Matrics', value: 'matrics', default: true, prefix: Matrics },
//     { label: 'Timeline', value: 'timeline', prefix: Timeline },
// ]
const currentTimeline = ref<"process" | "lane" | "step">("lane");
const currentView = ref<"matrics" | "timeline">("matrics");
const currentMatrics = ref<"functions" | "process">("process");
const timeline = generateTimeline("2025-01-01", "2025-05-15", 1); // weekly steps
const expanded = ref<boolean>(false);
const projects2 = [
  {
    name: "Consumer (App)",
    icon: logo,
    bars: [
      {
        label: "In progress",
        startDate: "2025-01-02",
        endDate: "2025-04-23",
        progress: 97,
        pill: "#F87171",
        bg: "#FEF2F2",
        status: "In progress",
      },
    ],
  },
  {
    name: "Provider ",
    icon: logo,
    bars: [
      {
        label: "Live",
        startDate: "2025-01-09",
        endDate: "2025-02-15",
        progress: 100,
        pill: "#06B6D4",
        bg: "#E0F2FE",
        status: "Live",
      },
    ],
  },
  {
    name: "Company ",
    icon: logo,
    bars: [
      {
        label: "Live",
        startDate: "2025-01-09",
        endDate: "2025-02-15",
        progress: 100,
        pill: "#06B6D4",
        bg: "#E0F2FE",
        status: "Live",
      },
    ],
  },
  {
    name: "Property ",
    icon: logo,
    bars: [
      {
        label: "Live",
        startDate: "2025-01-09",
        endDate: "2025-02-15",
        progress: 100,
        pill: "#06B6D4",
        bg: "#E0F2FE",
        status: "Live",
      },
    ],
  },
  {
    name: "Landing Page ",
    icon: logo,
    bars: [
      {
        label: "Live",
        startDate: "2025-01-09",
        endDate: "2025-02-15",
        progress: 100,
        pill: "#06B6D4",
        bg: "#E0F2FE",
        status: "Live",
      },
    ],
  },
  {
    name: "CMS ",
    icon: logo,
    bars: [
      {
        label: "Live",
        startDate: "2025-01-09",
        endDate: "2025-02-15",
        progress: 100,
        pill: "#06B6D4",
        bg: "#E0F2FE",
        status: "Live",
      },
    ],
  },
  {
    name: "Brand/Social Kit ",
    icon: logo,
    bars: [
      {
        label: "Live",
        startDate: "2025-01-09",
        endDate: "2025-02-15",
        progress: 100,
        pill: "#06B6D4",
        bg: "#E0F2FE",
        status: "Live",
      },
    ],
  },
];
const projectsStep = [
  {
    name: "RND",
    icon: logo,
    bars: [
      {
        label: "In progress",
        startDate: "2025-01-02",
        endDate: "2025-04-23",
        progress: 97,
        pill: "#F87171",
        bg: "#FEF2F2",
        status: "In progress",
      },
    ],
  },
  {
    name: "Identity Design ",
    icon: logo,
    bars: [
      {
        label: "Live",
        startDate: "2025-01-09",
        endDate: "2025-02-15",
        progress: 100,
        pill: "#06B6D4",
        bg: "#E0F2FE",
        status: "Live",
      },
    ],
  },
  {
    name: "Social Kit Design ",
    icon: logo,
    bars: [
      {
        label: "Live",
        startDate: "2025-01-09",
        endDate: "2025-02-15",
        progress: 100,
        pill: "#06B6D4",
        bg: "#E0F2FE",
        status: "Live",
      },
    ],
  },
  {
    name: "Landing Page Design ",
    icon: logo,
    bars: [
      {
        label: "Live",
        startDate: "2025-01-09",
        endDate: "2025-02-15",
        progress: 100,
        pill: "#06B6D4",
        bg: "#E0F2FE",
        status: "Live",
      },
    ],
  },
  {
    name: "UI/UX Design",
    icon: logo,
    bars: [
      {
        label: "Live",
        startDate: "2025-01-09",
        endDate: "2025-02-15",
        progress: 100,
        pill: "#06B6D4",
        bg: "#E0F2FE",
        status: "Live",
      },
    ],
  },
  {
    name: "Development ",
    icon: logo,
    bars: [
      {
        label: "Live",
        startDate: "2025-01-09",
        endDate: "2025-02-15",
        progress: 100,
        pill: "#06B6D4",
        bg: "#E0F2FE",
        status: "Live",
      },
    ],
  },
  {
    name: "CMS Content",
    icon: logo,
    bars: [
      {
        label: "Live",
        startDate: "2025-01-09",
        endDate: "2025-02-15",
        progress: 100,
        pill: "#06B6D4",
        bg: "#E0F2FE",
        status: "Live",
      },
    ],
  },
];
// const projectsProcess = [
//     {
//         name: 'RND',
//         icon: logo,
//         bars: [
//             {
//                 label: 'In progress',
//                 startDate: '2025-01-02',
//                 endDate: '2025-04-23',
//                 progress: 97,
//                 pill: '#F87171',
//                 bg: '#FEF2F2',
//                 status: 'In progress'
//             }
//         ]
//     },
//     {
//         name: 'Designing ',
//         icon: logo,
//         bars: [
//             {
//                 label: 'Live',
//                 startDate: '2025-01-09',
//                 endDate: '2025-02-15',
//                 progress: 100,
//                 pill: '#06B6D4',
//                 bg: '#E0F2FE',
//                 status: 'Live'
//             }
//         ]
//     },
//     {
//         name: 'Design Review ',
//         icon: logo,
//         bars: [
//             {
//                 label: 'Live',
//                 startDate: '2025-01-09',
//                 endDate: '2025-02-15',
//                 progress: 100,
//                 pill: '#06B6D4',
//                 bg: '#E0F2FE',
//                 status: 'Live'
//             }
//         ]
//     },
//     {
//         name: 'Spec Docs',
//         icon: logo,
//         bars: [
//             {
//                 label: 'Live',
//                 startDate: '2025-01-09',
//                 endDate: '2025-02-15',
//                 progress: 100,
//                 pill: '#06B6D4',
//                 bg: '#E0F2FE',
//                 status: 'Live'
//             }
//         ]
//     },
//     {
//         name: 'Developmentn',
//         icon: logo,
//         bars: [
//             {
//                 label: 'Live',
//                 startDate: '2025-01-09',
//                 endDate: '2025-02-15',
//                 progress: 100,
//                 pill: '#06B6D4',
//                 bg: '#E0F2FE',
//                 status: 'Live'
//             }
//         ]
//     },
//     {
//         name: 'QA ',
//         icon: logo,
//         bars: [
//             {
//                 label: 'Live',
//                 startDate: '2025-01-09',
//                 endDate: '2025-02-15',
//                 progress: 100,
//                 pill: '#06B6D4',
//                 bg: '#E0F2FE',
//                 status: 'Live'
//             }
//         ]
//     },
//     {
//         name: 'Content',
//         icon: logo,
//         bars: [
//             {
//                 label: 'Live',
//                 startDate: '2025-01-09',
//                 endDate: '2025-02-15',
//                 progress: 100,
//                 pill: '#06B6D4',
//                 bg: '#E0F2FE',
//                 status: 'Live'
//             }
//         ]
//     }
// ]
function beforeEnter(el: Element) {
  const elH = el as HTMLElement;
  elH.style.height = "0px";
  elH.style.opacity = "0";
}

function enter(el: Element) {
  const elH = el as HTMLElement;
  const height = elH.scrollHeight + "px";
  elH.style.transition = "height 0.3s ease, opacity 0.3s ease";
  elH.style.height = height;
  elH.style.opacity = "1";
}

function afterEnter(el: Element) {
  const elH = el as HTMLElement;
  elH.style.height = "auto";
}

function beforeLeave(el: Element) {
  const elH = el as HTMLElement;
  elH.style.height = elH.scrollHeight + "px";
  elH.style.opacity = "1";
}

function leave(el: Element) {
  const elH = el as HTMLElement;
  void elH.offsetHeight; // force reflow
  elH.style.transition = "height 0.3s ease, opacity 0.3s ease";
  elH.style.height = "0px";
  elH.style.opacity = "0";
}
// function expandHandler() {
//   expanded.value = !expanded.value;
// }
</script>