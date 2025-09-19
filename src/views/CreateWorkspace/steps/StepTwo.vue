<template>

  <div class="w-full">
    <h2 class="text-xl md:text-4xl font-semibold text-text-primary text-left ">
      Choose Your Lanes
    </h2>
    <p class="text-sm md:text-lg text-text-secondary text-left mt-2 mb-6">
      Select the components you want to include in your project
    </p>
  </div>

  <div class="flex flex-col pb-4 items-start gap-4 w-full">
    <!-- Display Lanes (adapted to workspace.lanes structure) -->
    <label
      v-for="lane in form.lanes"
      :key="lane.id"
      :for="`lane-${lane.id}`"
      class="rounded-lg relative flex justify-between items-center w-full p-4 cursor-pointer transition-all bg-bg-surface border border-border"
    >
      <div class="flex gap-3">
        <div class="w-9 h-9 text-text-primary rounded-lg" :style="{ background: lane.color }"></div>
        <div class="flex flex-col gap-1">
          <h3 class="font-medium capitalize text-sm text-text-primary">{{ lane.title }}</h3>
          <p class="text-[11px] text-text-secondary text-start line-clamp-1">{{ lane.description }}</p>
        </div>
      </div>

      <div class="flex gap-2">
        <button
          class="w-5 h-5 text-base aspect-square flex justify-center items-center rounded cursor-pointer text-accent"
          @click.stop="editLane(lane)"
        >
          <FontAwesomeIcon :icon="['far', 'edit']" />
        </button>
        <input
          type="checkbox"
          class="sr-only peer"
          :name="`lane-${lane.id}`"
          :id="`lane-${lane.id}`"
          v-model="selectedLanes"
          :value="lane.id"
        />
        <div
          class="w-5 h-5 flex justify-center items-center border border-border bg-bg-card p-0.5 rounded cursor-pointer peer-checked:bg-accent peer-checked:border-none transition-all"
        >
          <img src="../../../assets/icons/white-tick.svg" class="w-4" alt="" />
        </div>
      </div>
    </label>

    <!-- Add Custom Lane Button -->
    <label
      v-if="!showCustomForm"
      class="rounded-lg w-full relative p-4 cursor-pointer transition-all bg-bg-surface border border-border"
      @click="handleAddCustomClick"
    >
      <div class="flex gap-2 items-center justify-center">
        <div class="p-2.5 bg-accent rounded-full">
          <img class="w-3" src="../../../assets/icons/whitePlus.svg" alt="" />
        </div>
        <div class="flex flex-col justify-center">
          <h3 class="font-medium capitalize text-sm text-text-primary">Add Custom Lane</h3>
          <p class="text-[11px] text-text-secondary text-start line-clamp-1">Create your own component</p>
        </div>
      </div>
    </label>

    <!-- Lanes Form -->
    <div v-if="showCustomForm" class="bg-bg-surface border border-border w-full px-4 pt-4 rounded-lg">
      <h1 class="text-lg text-text-primary mb-3 font-semibold">{{ editMode ? 'Update Lane' : 'Add Custom Lane' }}</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <BaseTextField label="Lane Name" placeholder="Lane Name" size="lg" v-model="newLane.title" :error="!!titleError" :message="titleError" @blur="touched.title = true" />

        <BaseMultiSelect label="User Base Type" placeholder="User Base Type" size="lg" v-model="newLane.user_types" :allowCustom="true" :options="userTypes || []" :error="!!userTypesError" :message="userTypesError" @blur="touched.user_types = true" />

        <BaseTextAreaField class="col-span-full" v-model="newLane.description" label="Description" placeholder="This lane will track support tickets." :error="!!descriptionError" :message="descriptionError" @blur="touched.description = true" />

        <BaseMultiSelect class="col-span-full" :allowCustom="true" label="Technologies" placeholder="Select Technologies" size="lg" v-model="newLane.technologies" :options="technologies || []" :error="!!technologiesError" :message="technologiesError" @blur="touched.technologies = true" />
      </div>

      <!-- Color Picker -->
      <div class="mt-4">
        <label class="block text-base font-medium text-text-primary mb-2">Set Lane Color</label>
        <p v-if="colorError" class="text-red-500 text-sm -mt-2 mb-2">({{ colorError }})</p>
        <div class="flex items-center gap-3">
          <label class="relative block w-10 h-10 rounded-full border border-border cursor-pointer">
            <input type="color" v-model="newLane.color" class="absolute inset-0 opacity-0 cursor-pointer" @input="touched.color = true" />
            <div class="w-full h-full rounded-full" :style="{ backgroundColor: newLane.color }"></div>
          </label>
          <div class="flex flex-col">
            <span class="text-sm text-text-primary">Set Color</span>
            <span class="text-xs text-text-secondary">{{ newLane.color }}</span>
          </div>
        </div>
      </div>

      <!-- Preferred Platforms -->
      <div class="mb-6">
        <div class="mb-4 mt-8 flex items-center gap-3">
          <label class="block text-base font-medium text-text-primary">Preferred Platforms</label>
          <p v-if="platformsError" class="text-red-500 text-sm">({{ platformsError }})</p>
        </div>

        <div class="flex gap-3 flex-wrap">
          <button
            v-for="title in mergedPlatforms"
            :key="title"
            @click="togglePlatform(title)"
            :class="[
              'px-4 py-1 rounded-full cursor-pointer transition text-sm flex items-center gap-2',
              selectedPlatforms.includes(title) ? 'bg-accent text-white' : 'bg-bg-body text-text-primary',
            ]"
          >
            <FontAwesomeIcon :icon="['fas', 'check']" v-if="selectedPlatforms.includes(title)" />
            {{ title }}
            <span v-if="!isOfficial(title)" class="text-[10px] px-2 py-0.5 rounded-full bg-bg-surface">New</span>
          </button>
        </div>
      </div>

      <div class="flex gap-2 mt-4 justify-end border-t border-border bg-bg-surface py-4">
        <Button size="md" variant="primary" @click="editMode ? handleUpdateLane() : handleAddLane()">{{ editMode ? 'Update Lane' : 'Add Lane' }}</Button>
        <Button size="md" variant="secondary" @click="handleCancelLane">Cancel</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed, reactive, nextTick } from 'vue';
import BaseTextField from '../../../components/ui/BaseTextField.vue';
import Button from '../../../components/ui/Button.vue';
import BaseTextAreaField from '../../../components/ui/BaseTextAreaField.vue';
import { usePlatforms, useTechnologies, useUserType } from '../../../queries/useWorkspace';
import BaseMultiSelect from '../../../components/ui/BaseMultiSelect.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { usePlatformMapping } from '../../../composables/usePlatFormMapping';

/**
 * === Workspace shapes ===
 * localStorage.workspace matches the object you posted:
 * { _id, variables, lanes: [{ _id, variables: { 'lane-title', 'lane-color', ... } }], modules, logo, ... }
 */

type WsLane = {
  _id: string;
  workspace_id?: string;
  variables: {
    'lane-title': string;
    'lane-color': string; // hex
    'lane-description'?: string;
    'user-types'?: string[];
    technologies?: string[];
    platforms?: string[]; // titles
    [k: string]: unknown;
  };
  [k: string]: unknown;
};

type Workspace = {
  _id: string;
  variables: Record<string, unknown>;
  lanes: WsLane[];
  modules?: unknown[];
  logo?: string;
  [k: string]: unknown;
};

/** UI lane model used by this component */
type UiLane = {
  id: string; // maps to WsLane._id
  title: string;
  description: string;
  color: string;
  user_types: string[];
  technologies: string[];
  platforms: string[]; // titles
};

/** helpers **/
function safeJSONParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

function getWorkspace(): Workspace | null {
  return safeJSONParse<Workspace>(localStorage.getItem('workspace'), null as any);
}

function setWorkspace(updater: (prev: Workspace) => Workspace) {
  const prev = getWorkspace();
  if (!prev) return;
  const next = updater(prev);
  localStorage.setItem('workspace', JSON.stringify(next));
}

// Map WS -> UI
function toUiLane(ws: WsLane): UiLane {
  const v = ws.variables || ({} as WsLane['variables']);
  return {
    id: ws._id,
    title: String(v['lane-title'] || ''),
    description: String(v['lane-description'] || ''),
    color: String(v['lane-color'] || '#4169E1'),
    user_types: Array.isArray(v['user-types']) ? (v['user-types'] as string[]) : [],
    technologies: Array.isArray(v.technologies) ? (v.technologies as string[]) : [],
    platforms: Array.isArray(v.platforms) ? (v.platforms as string[]) : [],
  };
}

// Map UI -> WS (preserve unknown fields on the lane)
function fromUiLane(ui: UiLane, prev?: WsLane): WsLane {
  const base: WsLane = prev || ({ _id: ui.id, variables: {} } as WsLane);
  return {
    ...base,
    variables: {
      ...(base.variables || {}),
      'lane-title': ui.title,
      'lane-description': ui.description,
      'lane-color': ui.color,
      'user-types': ui.user_types,
      technologies: ui.technologies,
      platforms: ui.platforms,
    },
  };
}

/** validations **/
const touched = reactive({ title: false, description: false, user_types: false, technologies: false, platforms: false, color: false });

const titleError = computed(() => {
  if (!touched.title) return '';
  const v = (newLane.value.title || '').trim();
  if (!v) return 'Lane Name is required';
  if (v.length < 3) return 'Lane Name must be at least 3 characters';
  return '';
});

const descriptionError = computed(() => (!touched.description ? '' : (newLane.value.description || '').trim() ? '' : 'Description is required'));
const userTypesError = computed(() => (!touched.user_types ? '' : newLane.value.user_types.length ? '' : 'Select at least one user type'));
const technologiesError = computed(() => (!touched.technologies ? '' : newLane.value.technologies.length ? '' : 'Select at least one technology'));
const platformsError = computed(() => (!touched.platforms ? '' : selectedPlatforms.value.length ? '' : 'Select at least one platform'));
const colorError = computed(() => (!touched.color ? '' : /^#([0-9A-Fa-f]{6})$/.test(newLane.value.color || '') ? '' : 'Pick a valid 6-digit HEX color'));

/** data sources **/
const { data: technologies } = useTechnologies();
const { data: platforms } = usePlatforms();
const { data: userTypes } = useUserType();
const emit = defineEmits(['next']);
const {  isOfficial } = usePlatformMapping(platforms as any);

/** state **/
const form = ref<{ lanes: UiLane[] }>({ lanes: [] });
const selectedPlatforms = ref<string[]>([]);
const selectedLanes = ref<string[]>([]); // holds WsLane._id values
const showCustomForm = ref(false);
const editMode = ref(false);
const mergedPlatforms = ref<string[]>([]);

const newLane = ref<UiLane>({ id: '', title: '', user_types: [], description: '', color: '#4169E1', technologies: [], platforms: [] });

/** mount: hydrate from workspace **/
onMounted(() => {
  const ws = getWorkspace();
  if (ws && Array.isArray(ws.lanes)) {
    form.value.lanes = ws.lanes.map(toUiLane);
    selectedLanes.value = ws.lanes.map(l => l._id); // default select all existing
  }

  // Merge platforms for editing
  watch([platforms, newLane], () => {
    const official = (platforms.value || []).map((p: any) => p.title);
    if (editMode.value) {
      mergedPlatforms.value = Array.from(new Set([...(newLane.value.platforms || []), ...official]));
    } else {
      mergedPlatforms.value = official;
      nextTick();
    }
  });
});

watch([platforms, selectedPlatforms, editMode], () => {
  if (!editMode.value) return;
  const officialTitles = (platforms.value || []).map((p: any) => p.title);
  mergedPlatforms.value = Array.from(new Set([...(selectedPlatforms.value || []), ...officialTitles]));
});

/** interactions **/
function togglePlatform(platform: string) {
  const i = selectedPlatforms.value.indexOf(platform);
  if (i > -1) selectedPlatforms.value.splice(i, 1);
  else selectedPlatforms.value.push(platform);
  touched.platforms = true;
}

watch(
  () => newLane.value.color,
  () => { touched.color = true; }
);

function handleAddCustomClick() {
  selectedPlatforms.value = [];
  newLane.value = { id: '', title: '', user_types: [], description: '', color: '#4169E1', technologies: [], platforms: [] };
  showCustomForm.value = true;
  editMode.value = false;
  // reset touched
  touched.technologies = touched.color = touched.description = touched.title = touched.user_types = touched.platforms = false;
}

function handleCancelLane() {
  showCustomForm.value = false;
  editMode.value = false;
}

function editLane(lane: UiLane) {
  newLane.value = { ...lane };
  // Pre-select platforms
  const uniqTitles = Array.from(new Set((lane.platforms || []).map(t => t?.trim()).filter(Boolean))) as string[];
  selectedPlatforms.value = uniqTitles;
  const officialTitles = (platforms.value || []).map((p: any) => p.title);
  mergedPlatforms.value = Array.from(new Set([...uniqTitles, ...officialTitles]));
  showCustomForm.value = true;
  editMode.value = true;
}

function validateLane() {
  touched.title = touched.description = touched.user_types = touched.technologies = touched.color = touched.platforms = true;
  return [titleError.value, descriptionError.value, userTypesError.value, technologiesError.value, colorError.value, platformsError.value].every(e => !e);
}

function handleAddLane() {
  if (!validateLane()) return;
  const id = crypto?.randomUUID?.() || Date.now().toString();
  const lane: UiLane = { ...newLane.value, id, platforms: [...selectedPlatforms.value] };
  form.value.lanes.push(lane);
  selectedLanes.value.push(id);
  showCustomForm.value = false;
  saveToLocalStorage();
}

function handleUpdateLane() {
  if (!validateLane()) return;
  const idx = form.value.lanes.findIndex(l => l.id === newLane.value.id);
  if (idx !== -1) {
    form.value.lanes[idx] = { ...newLane.value, platforms: [...selectedPlatforms.value] };
  }
  editMode.value = false;
  showCustomForm.value = false;
  saveToLocalStorage();
}

/** persistence: write back to *workspace* shape exactly **/
function saveToLocalStorage() {
  const ws = getWorkspace();
  if (!ws) return;

  // Build a map of existing WS lanes for preservation of metadata
  const byId = new Map<string, WsLane>((ws.lanes || []).map(l => [l._id, l]));

  // Determine which UI lanes are selected (keep only those if you want the subset), otherwise you can keep all
  const keepIds = new Set(selectedLanes.value.length ? selectedLanes.value : form.value.lanes.map(l => l.id));

  const nextLanes: WsLane[] = form.value.lanes
    .filter(l => keepIds.has(l.id))
    .map(ui => fromUiLane(ui, byId.get(ui.id)));

  setWorkspace(prev => ({ ...prev, lanes: nextLanes }));
}

// autosave on form changes
watch(
  () => form.value.lanes,
  () => saveToLocalStorage(),
  { deep: true }
);

function continueHandler() {
  // Persist filtered selection and move on
  saveToLocalStorage();
  emit('next');
}

defineExpose({ continueHandler });
</script>

<style scoped>
input[type='radio'].peer { position: absolute; opacity: 0; pointer-events: none; }
</style>

<style scoped>
input[type='radio'].peer {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
</style>
