<template>
  <div class="w-full pt-4">
    <h2 class="text-xl md:text-4xl font-semibold text-text-primary text-left">Project Details</h2>
    <p class="text-sm md:text-lg text-text-secondary text-left mt-2 mb-6">Let's refine your project details</p>
  </div>

  <div class="space-y-6 pb-4 w-full">
    <FileUploader v-model="logo" label="Upload your project logo" tooltip="You can upload your logo image here"
      message="Supports .png, .jpg, .jpeg file formats" :error="false" placeholder="Choose a logo"
      accept=".png,.jpg,.jpeg" />

    <BaseTextField label="Give your workspace a name" placeholder="Workspace name" size="lg" v-model="form.title"
    :message="ai ? `AI suggested this name based on your description` : ''">
      <template #msgIcon>
        <img src="../../../assets/icons/stars.svg" alt="" />
      </template>
    </BaseTextField>

    <BaseSelectField v-model="form['workspace-type']" :options="workspaceTypeOptions" label="Workspace Type" size="lg"
      :allowCustom="true" :message="ai ? `AI suggested this name based on your description` : ''" placeholder="e.g. for team">
      <template #msgIcon>
        <img src="../../../assets/icons/stars.svg" alt="" />
      </template>
    </BaseSelectField>

    <BaseMultiSelect v-model="form['workspace-industries']" :options="industryData || []" label="Industry" size="lg"
      :allowCustom="true" :message="ai ? `AI suggested this name based on your description` : ''"
      placeholder="e.g. Ecommerce, Health, EdTech">
      <template #msgIcon>
        <img src="../../../assets/icons/stars.svg" alt="" />
      </template>
    </BaseMultiSelect>

  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import BaseTextField from '../../../components/ui/BaseTextField.vue';
import BaseMultiSelect from '../../../components/ui/BaseMultiSelect.vue';
import BaseSelectField from '../../../components/ui/BaseSelectField.vue';
import FileUploader from '../../../components/ui/FileUploader.vue';
import { useIndustries, useWorkspacesTitles } from '../../../queries/useWorkspace';
import { useUploadFile } from '../../../queries/useCommon';
import { toast } from 'vue-sonner';


defineProps<{
  ai: boolean
}>()
/**
 * Types
 */
type WorkspaceVariables = {
  title: string;
  'workspace-type': string;
  'workspace-industries': string[];
  // Allow additional keys without losing type safety entirely
  [k: string]: unknown;
};

type Workspace = {
  logo?: string;
  variables: Partial<WorkspaceVariables>;
};

//  type LogoType = File | string | null;

/**
 * Utilities
 */
function safeJSONParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function getWorkspace(): Workspace {
  return safeJSONParse<Workspace>(localStorage.getItem('workspace'), { variables: {} });
}

function setWorkspace(updater: (prev: Workspace) => Workspace) {
  const prev = getWorkspace();
  const next = updater(prev);
  localStorage.setItem('workspace', JSON.stringify(next));
}

/**
 * Options (static)
 */
const workspaceTypeOptions = [
  { title: 'For client', _id: 'client' },
  { title: 'For Me', _id: 'personel' },
  { title: 'For Team', _id: 'team' },
];

/**
 * Queries
 */
const { data: industryData } = useIndustries();
const { data: allWorkspacesTitles } = useWorkspacesTitles();

/**
 * Emits
 */
const emit = defineEmits<{
  (e: 'next'): void;
  (e: 'back'): void;
}>();

/**
 * State
 */
const logo = ref<any>(getWorkspace().logo ?? null);
const form = ref<WorkspaceVariables>({
  title: '',
  'workspace-type': '',
  'workspace-industries': [],
});

/**
 * Hydrate from localStorage on mount
 */
onMounted(() => {
  const ws = getWorkspace();
  const vars = ws.variables || {};
  form.value = {
    ...form.value,
    ...vars,
    'workspace-type': typeof vars['workspace-type'] === 'string' ? String(vars['workspace-type']).toLowerCase() : '',
    'workspace-industries': Array.isArray(vars['workspace-industries']) ? (vars['workspace-industries'] as string[]) : [],
    title: typeof vars.title === 'string' ? (vars.title as string) : '',
  } as WorkspaceVariables;
});

/**
 * Validation
 */
const isValid = computed(() => {
  const hasLogo = !!logo.value;
  const hasTitle = !!form.value.title?.trim();
  const hasType = !!form.value['workspace-type']?.trim();
  const hasIndustries = (form.value['workspace-industries']?.length || 0) > 0;
  return hasLogo && hasTitle && hasType && hasIndustries;
});

function ensureUniqueTitle() {
  const titles: string[] = (allWorkspacesTitles.value as unknown as string[]) || [];
  const exists = titles.includes(form.value.title);
  if (exists) {
    toast.error('Workspace title already exists. Please choose a different title.');
    return false;
  }
  return true;
}

/**
 * Upload + persist
 */
const { mutate, isPending } = useUploadFile({
  onSuccess: (data: any) => {
    const url: string | undefined = data?.data?.url;
    if (!url) {
      toast.error('Upload succeeded but no URL was returned.');
      return;
    }
    // Persist and advance
    setWorkspace(prev => ({
      ...prev,
      logo: url,
      variables: { ...(prev.variables || {}), ...form.value },
    }));
    emit('next');
  },
  onError: (err: any) => {
    console.error('File upload failed', err);
    toast.error('File upload failed. Please try again.');
  },
});

/**
 * Continue handler
 */
function continueHandler() {
  if (!isValid.value) {
    toast.error('Please fill all fields and upload a file.');
    return;
  }
  if (!ensureUniqueTitle()) return;

  // If logo is a File, upload first, then persist in onSuccess
  if (logo.value instanceof File) {
    const fd = new FormData();
    fd.append('file', logo.value);
    mutate(fd);
    return;
  }

  // Otherwise logo is a string (already uploaded) — persist now and advance
  setWorkspace(prev => ({
    ...prev,
    logo: typeof logo.value === 'string' ? logo.value : prev.logo,
    variables: { ...(prev.variables || {}), ...form.value },
  }));
  emit('next');
}

/**
 * Expose to parent
 */
defineExpose({ continueHandler, isPending });
</script>

<style scoped>
input[type='radio'].peer {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
</style>
