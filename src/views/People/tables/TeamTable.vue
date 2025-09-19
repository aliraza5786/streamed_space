<template>
    <div class="flex w-full h-full">
        <div class="overflow-x-auto p-4 h-full flex-auto">
            <div class="flex justify-between items-center mb-4">
                <div>
                    <span v-if="selectedCount > 0" class="text-sm font-medium text-text-secondary -700">
                        {{ selectedCount }} selected
                    </span>
                </div>
                <div v-if="selectedCount > 0" class="flex gap-2">
                    <button
                        class="text-sm bg-red-100 text-red-700 border border-red-300 px-3 py-1 rounded hover:bg-red-200"
                        @click="deleteSelected">
                        Delete
                    </button>
                    <button
                        class="text-sm bg-blue-100 text-blue-700 border border-blue-300 px-3 py-1 rounded hover:bg-blue-200"
                        @click="clearSelections">
                        Clear
                    </button>
                </div>
            </div>
            <table class="min-w-full text-sm text-left">
                <thead>
                    <tr>
                        <th class="px-4 py-2">
                            <input type="checkbox" :checked="allSelected" @change="toggleAll" />
                        </th>

                        <th class="px-4 py-2">Name</th>
                        <th class="px-4 py-2">Teams</th>
                        <th class="px-4 py-2">Role</th>
                        <th class="px-4 py-2">Status</th>
                    </tr>
                </thead>
                <tbody>

                    <tr v-for="(person, index) in people" :key="index"
                        class="group hover:bg-gray-50 border-t border-gray-200">

                        <td class="px-4 py-2">
                            <input type="checkbox" v-model="person.selected" />
                        </td>

                        <td class="px-4 py-2 font-medium flex items-center gap-2 relative">
                            <!-- Avatar Hover Trigger -->
                            <div class="h-8 w-8 rounded-full bg-gray-300 cursor-pointer"
                                @mouseenter="hoveredAvatarIndex = index" @mouseleave="onProfileMouseleave"></div>

                            <!-- Text Info -->
                            <div>
                                <div>{{ person.name }}</div>
                                <div class="text-text-secondary -500 text-xs">{{ person.email }}</div>
                            </div>

                            <!-- Hover Card -->
                            <div v-if="hoveredAvatarIndex === index"
                                class="absolute left-10 top-0 z-50 w-64 bg-white border border-gray-300 rounded shadow-lg p-4"
                                @mouseenter="isOverCard = true"
                                @mouseleave="() => { isOverCard = false; hoveredAvatarIndex = null; }">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                                        {{ person.name.charAt(0) }}
                                    </div>
                                    <div>
                                        <div class="font-semibold text-sm">{{ person.name }}</div>
                                        <div class="text-text-secondary -500 text-xs">{{ person.email }}</div>
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <button class="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded">Send
                                        Mail</button>
                                </div>
                            </div>
                        </td>

                        <td class="px-4 py-2 relative">
                            <div class="cursor-pointer mt-2 flex flex-wrap gap-2"
                                @click.stop="toggleTeamPopover(index)">
                                <span v-for="(team, i) in person.teams.slice(0, 3)" :key="i" :class="teamStyle(team)">
                                    {{ team }}
                                </span>
                                <!-- "group" moved INSIDE this span so it's scoped -->
                                <span v-if="person.teams.length > 3" class="relative"
                                    @mouseenter="hoveredTeamIndex = index" @mouseleave="hoveredTeamIndex = null">
                                    <span
                                        class="group rounded-full px-2 py-0.5 text-xs font-medium border text-text-secondary -700 bg-gray-100 border-gray-300 cursor-default">
                                        +{{ person.teams.length - 3 }}

                                        <!-- Tooltip only shows on hover over THIS element -->
                                        <div v-if="hoveredTeamIndex === index"
                                            class="absolute   flex-wrap gap-1 bg-white border border-gray-300 rounded p-2 shadow-lg text-xs z-20 w-max max-w-xs top-full mt-1"
                                            @mouseenter.stop @mouseleave.stop>
                                            <span v-for="(team, idx) in person.teams.slice(3)" :key="team + idx"
                                                :class="teamStyle(team)">
                                                {{ team }}
                                            </span>
                                        </div>
                                    </span>
                                </span>


                            </div>
                            <div v-if="teamPopoverIndex === index"
                                class=" team-popover absolute z-10 bg-white border border-border D5D7DA] mt-2 w-48 rounded shadow">
                                <div v-for="team in teams" :key="team"
                                    class="flex cursor-pointer items-center gap-2 py-1 px-2">
                                    <input :id="`team-${index}-${team}`" type="checkbox" class="accent-black"
                                        :checked="person.teams.includes(team)" @change="toggleTeam(index, team)" />
                                    <label :for="`team-${index}-${team}`" class="cursor-pointer">
                                        {{ team }}
                                    </label>
                                </div>
                            </div>

                        </td>
                        <td class="px-4 py-2 text-sm text-text-secondary -700">
                            <div class="cursor-pointer hover:underline" @click.stop="toggleRolePopover(index)">
                                {{ person.role }}
                            </div>
                            <div v-if="rolePopoverIndex === index"
                                class="role-popover absolute z-10 bg-white border   border-border D5D7DA] mt-2 w-56 rounded shadow">
                                <div v-for="role in roles" :key="role"
                                    class="px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded"
                                    @click="changeValue(index, 'role', role, 'rolePopoverIndex')">
                                    {{ role }}
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-2">
                            <div class="inline-flex items-center gap-2 cursor-pointer rounded-full border px-3 py-1 text-xs font-medium text-green-700 bg-green-100 border-green-300"
                                @click.stop="toggleStatusPopover(index)">
                                <span class="h-2 w-2 rounded-full bg-green-600"></span>
                                {{ person.status }}
                            </div>
                            <div v-if="statusPopoverIndex === index"
                                class="status-popover absolute z-10 bg-white border border-border D5D7DA] mt-2 w-32 rounded shadow">
                                <div v-for="status in statuses" :key="status"
                                    class="px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded"
                                    @click="changeValue(index, 'status', status, 'statusPopoverIndex')">
                                    {{ status }}
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-2 text-right w-24">
                            <div class="invisible group-hover:visible flex gap-2 justify-end">
                                <button class="hover:text-blue-600" @click="editPerson(index)">
                                    ✏️
                                </button>
                                <button class="hover:text-red-600" @click="deletePerson(index)">
                                    🗑️
                                </button>
                                <button class="hover:text-text-secondary -600" @click="sharePerson(index)">
                                    🔗
                                </button>
                            </div>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Slide-over Edit Panel -->
        <transition name="slide">
            <div v-if="showEditPanel"
                class="  w-96 min-h-full bg-white border-l border-gray-300 shadow-xl z-50 flex flex-col">

                <div class="p-4 border-b flex justify-between items-center">
                    <h2 class="text-lg font-semibold">Edit Person</h2>
                    <button @click="showEditPanel = false" class="text-text-secondary -500 hover:text-text-secondary -700">✖</button>
                </div>

                <div class="p-4 flex-1 overflow-y-auto">
                    <label class="block text-sm font-medium mb-1">Name</label>
                    <input v-model="editingPerson!.name" class="w-full mb-4 border px-3 py-1 rounded" />

                    <label class="block text-sm font-medium mb-1">Email</label>
                    <input v-model="editingPerson!.email" class="w-full mb-4 border px-3 py-1 rounded" />

                    <label class="block text-sm font-medium mb-1">Role</label>
                    <select v-model="editingPerson!.role" class="w-full mb-4 border px-3 py-1 rounded">
                        <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
                    </select>

                    <label class="block text-sm font-medium mb-1">Status</label>
                    <select v-model="editingPerson!.status" class="w-full mb-4 border px-3 py-1 rounded">
                        <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
                    </select>
                </div>

                <div class="p-4 border-t flex justify-end gap-2">
                    <button @click="showEditPanel = false"
                        class="px-4 py-1 border border-gray-300 rounded text-sm">Cancel</button>
                    <button @click="savePerson" class="px-4 py-1 bg-blue-600 text-white rounded text-sm">Save</button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { computed } from 'vue';
const hoveredTeamIndex = ref<number | null>(null);
const hoveredAvatarIndex = ref<number | null>(null);

const allSelected = computed(() => people.value.every(p => p.selected));
const toggleAll = () => {
    const newState = !allSelected.value;
    people.value.forEach(p => (p.selected = newState));
};

type Person = {
    name: string;
    email: string;
    teams: string[];
    role: string;
    status: string;
    selected: boolean;
};

const people = ref<Person[]>([
    {
        name: 'Olivia Rhye',
        email: 'olivia@untitledui.com',
        teams: ['Design', 'Product', 'Marketing', 'Sales', 'Support'],
        role: 'Product Designer',
        status: 'Active',
        selected: false
    },
    {
        name: 'Phoenix Baker',
        email: 'olivia@untitledui.com',
        teams: ['Design', 'Product', 'Marketing', 'Sales'],
        role: 'Product Manager',
        status: 'Active',
        selected: false
    }
]);


const teams = ['Design', 'Product', 'Marketing', 'Sales', 'Support', '+4'];
const roles = ['Product Designer', 'Product Manager', 'Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'UX Designer', 'UX Copywriter', 'UI Designer', 'QA Engineer'];
const statuses = ['Active', 'Inactive'];

const teamPopoverIndex = ref<number | null>(null);
const rolePopoverIndex = ref<number | null>(null);
const statusPopoverIndex = ref<number | null>(null);



function toggleTeam(index: number, team: string) {
    const teamsList = people.value[index].teams;
    if (teamsList.includes(team)) {
        people.value[index].teams = teamsList.filter(t => t !== team);
    } else {
        people.value[index].teams = [...teamsList, team];
    }
}

function changeValue(
    index: number,
    key: 'role' | 'status',
    value: string,
    popoverKey: 'rolePopoverIndex' | 'statusPopoverIndex'
) {

    people.value[index][key] = value;
    if (popoverKey === 'rolePopoverIndex') rolePopoverIndex.value = null;
    else statusPopoverIndex.value = null;
}

function teamStyle(team: string) {
    if (team === 'Design') return 'rounded-full px-2 py-0.5 text-xs font-medium border text-purple-700 bg-purple-100 border-purple-300';
    if (team === 'Product') return 'rounded-full px-2 py-0.5 text-xs font-medium border text-blue-700 bg-blue-100 border-blue-300';
    if (team === 'Marketing') return 'rounded-full px-2 py-0.5 text-xs font-medium border text-indigo-700 bg-indigo-100 border-indigo-300';
    return 'rounded-full px-2 py-0.5 text-xs font-medium border text-text-secondary -700 bg-gray-100 border-gray-300';
}
const selectedCount = computed(() => people.value.filter(p => p.selected).length);

function deleteSelected() {
    people.value = people.value.filter(p => !p.selected);
}

function clearSelections() {
    people.value.forEach(p => (p.selected = false));
}
// function editPerson(index: number) {
//     alert(`Edit ${people.value[index].name}`);
// }

function deletePerson(index: number) {
    people.value.splice(index, 1);
}

function sharePerson(index: number) {
    alert(`Share ${people.value[index].email}`);
}
function toggleTeamPopover(index: number) {
    if (teamPopoverIndex.value === index) {
        teamPopoverIndex.value = null;
    } else {
        teamPopoverIndex.value = index;
        rolePopoverIndex.value = null;
        statusPopoverIndex.value = null;
    }
}

function toggleRolePopover(index: number) {
    if (rolePopoverIndex.value === index) {
        rolePopoverIndex.value = null;
    } else {
        rolePopoverIndex.value = index;
        teamPopoverIndex.value = null;
        statusPopoverIndex.value = null;
    }
}

function toggleStatusPopover(index: number) {
    if (statusPopoverIndex.value === index) {
        statusPopoverIndex.value = null;
    } else {
        statusPopoverIndex.value = index;
        teamPopoverIndex.value = null;
        rolePopoverIndex.value = null;
    }
}

import { onMounted, onBeforeUnmount } from 'vue';

function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const isInsidePopover = target.closest('.team-popover')
        || target.closest('.role-popover')
        || target.closest('.status-popover');

    const isPopoverTrigger = target.closest('[data-popover-trigger]');

    if (!isInsidePopover && !isPopoverTrigger) {
        teamPopoverIndex.value = null;
        rolePopoverIndex.value = null;
        statusPopoverIndex.value = null;
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
const isOverCard = ref(false);
function onProfileMouseleave() {
    setTimeout(() => { if (!isOverCard) hoveredAvatarIndex.value = null }, 100)
}

const editingPerson = ref<Person | null>(null);
const showEditPanel = ref(false);
function editPerson(index: number) {
    editingPerson.value = { ...people.value[index] }; // clone so you can edit safely
    showEditPanel.value = true;
}
function savePerson() {
    if (!editingPerson.value) return;

    const index = people.value.findIndex(p => p.email === editingPerson.value!.email);
    if (index !== -1) {
        people.value[index] = { ...editingPerson.value };
    }
    showEditPanel.value = false;
}

</script>

<style scoped>
.table-popover {
    position: absolute;
    z-index: 10;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}
</style>