<template>
  <!-- Header -->
 
    <div class="text-left w-full pt-4 pb-2">
      <h2 class="text-xl md:text-4xl font-semibold text-text-primary mb-1">Team Resources</h2>
      <p class="text-sm md:text-lg text-text-secondary">
        AI-recommended team composition for your project
      </p>
    </div>

    <!-- Roles Grid -->
    <div class="space-y-3 w-full pb-4">
      <div v-for="role in workspace.roles" :key="role.id" class="bg-bg-surface rounded-xl p-6">
        <div class="flex items-center justify-between mb-2">
          <div class="flex gap-4 items-center text-2xl justify-between w-full">
            <div class="flex flex-col text-text-primary text-lg font-semibold">
              <span>
                <span class="text-xl mr-2">{{ role.role_emoji }}</span> {{ role.title }}
              </span>
              <p class="text-sm text-text-secondary">{{ role.description }}</p>
            </div>
            <!-- Update max number of people -->
            <div class="flex items-center gap-3 text-text-primary">
              <button @click="role.max_num_people > 0 && (role.max_num_people--, enforceCapacity(role))"
                class="w-8 h-8 aspect-square rounded-full bg-bg-card flex items-center justify-center text-xl">−</button>
              <span class="text-lg">{{ role.max_num_people }}</span>
              <button @click="role.max_num_people++"
                class="w-8 h-8 aspect-square rounded-full bg-bg-card flex items-center justify-center text-xl">+</button>
            </div>
          </div>
        </div>

        <!-- Display Team Members -->
       <!-- Display Team Members -->
<div class="text-text-primary">
  <p class="text-sm font-medium text-text-secondary mb-2 flex justify-between items-center gap-2.5">
    Team Members
    <span class="flex items-center gap-2">
      <span class="text-xs text-text-secondary">
        {{ role.people.length }}/{{ role.max_num_people }}
      </span>
      <Button
        size="sm"
        variant="secondary"
        @click="openPeopleInput(role)"
        :disabled="role.people.length >= role.max_num_people"
        title="Add people by email"
      >
        Add people
      </Button>
    </span>
  </p>

  <div v-if="role.people.length === 0" class="text-sm text-text-secondary mb-3">
    No team members assigned yet
  </div>

  <div v-for="(member, idx) in role.people" :key="idx" class="flex justify-between items-center mb-3">
    <div>
      <p class="text-sm font-medium capitalize">{{ member.name }}</p>
      <p class="text-xs text-text-secondary">{{ member.email }}</p>
    </div>
    <button @click="removeMember(role, idx)"
      class="text-text-primary w-8 h-8 bg-bg-card rounded-md cursor-pointer">✕</button>
  </div>

  <!-- Email chip input -->
  <div v-if="role.showInput" class="mt-2 space-y-2">
    <BaseEmailChip
      v-model="role.emailList"
      :error="!!role.emailError || role.capacityWarning"
      :message="role.capacityWarning
        ? `Reached role capacity (${role.max_num_people}).`
        : (role.emailError || 'Press Enter, comma, semicolon, or space to add. Invalid entries won’t be added.')"
      showName
      @invalid="onEmailsInvalid(role, $event)"
      @add="onEmailsAdd(role, $event)"
      @remove="onEmailsRemove(role, $event)"
    />

    <div class="flex items-center justify-end gap-2">
      <Button @click="finalizeChips(role)" variant="primary">Done</Button>
      <Button @click="cancelChips(role)" variant="secondary">Cancel</Button>
    </div>
  </div>
</div>

      </div>


      <!-- Add New Role Section -->
      <div v-if="!addTeam"
        class="bg-bg-surface mt-2 cursor-pointer rounded-xl p-6 flex flex-col justify-center items-center"
        @click="addTeam = true">
        <div class="p-2.5 bg-accent w-8 h-8 rounded-full">
          <img class="w-3" src="../../../assets/icons/whitePlus.svg" alt="" />
        </div>
        <h3 class="font-medium text-text-primary capitalize text-sm mt-4">Add New Team</h3>
        <p class="text-[11px] text-text-secondary mt-1 text-start line-clamp-1">Create a custom resource type</p>
      </div>

      <div v-else class="bg-bg-surface mt-2 cursor-pointer rounded-xl p-6">
        <h1 class="text-lg text-text-primary font-semibold">Add New Team</h1>
        <br>
        <BaseTextField label="Team Name" v-model="form.name" placeholder="Enter Team Name" size="lg" />
        <BaseTextAreaField label="Description" class="mt-4" v-model="form.description" placeholder="Enter Description"
          size="lg" />
        <div class="flex gap-2 mt-6 justify-end">
          <Button size="md" variant="primary" @click="addNewRole">
            Add Team
          </Button>
          <Button size="md" variant="secondary" @click="addTeam = false">Cancel</Button>
        </div>
      </div>
    </div>


</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import Button from '../../../components/ui/Button.vue'
import BaseTextField from '../../../components/ui/BaseTextField.vue'
import BaseTextAreaField from '../../../components/ui/BaseTextAreaField.vue'
import BaseEmailChip from '../../../components/ui/BaseEmailChip.vue'
// import BaseEmailChip from '../../../components/ui/BaseEmailChip.vue'


const emit = defineEmits(['next', 'back'])

/* ---------------------------
   Types
----------------------------*/
interface TeamMember { name: string; email: string }
interface EmailChip { value: string; valid: boolean; reason?: string }
interface Role {
  id: string
  title: string
  description: string
  people: TeamMember[]
  showInput: boolean
  newEmail: string
  max_num_people: number
  role_emoji: string

  emailChips: EmailChip[]
  emailInput: string
  capacityWarning: boolean

  // Local suggestions (strings)
  suggestions: string[]
  suggestionIndex: number
}


/* ---------------------------
   Persistence
----------------------------*/

onMounted(() => {
  try {
    const savedWorkspace = localStorage.getItem('workspace')
    if (savedWorkspace) {
      const data = JSON.parse(savedWorkspace)
      workspace.roles = (data.variables.roles || []).map((r: Role) => ({
        ...r,
        emailChips: r.emailChips ?? [],
        emailInput: r.emailInput ?? '',
        capacityWarning: false,
        newEmail: r.newEmail ?? '',
        suggestions: [],
        suggestionIndex: -1
      }))
    }
  } catch (error) {
    console.error('Error parsing workspace from localStorage', error)
  }
})



// function onEmailsAdd(role: Role, addedEmails: string[]) {
//   addedEmails.forEach(email => {
//     if (role.people.length < role.max_num_people) {
//       addMemberEmail(role, email); // Add email to people if max not reached
//     } else {
//       role.capacityWarning = true;
//     }
//   });
//   saveToLocalStorage();  // Save updated teams to localStorage
// }

/* ---------------------------
   Types
----------------------------*/
interface TeamMember { name: string; email: string }
interface Role {
  id: string
  title: string
  description: string
  people: TeamMember[]

  // UI state
  showInput: boolean
  max_num_people: number
  role_emoji: string

  // Email chip integration
  emailList: string[]        // v-model for BaseEmailChip
  emailError: string         // error message from invalids
  capacityWarning: boolean   // true when at/over capacity
}

/* ---------------------------
   State
----------------------------*/
const addTeam = ref(false)
const form = ref({ name: '', description: '' })
const workspace = reactive<any>({ roles: [] })

/* ---------------------------
   Helpers
----------------------------*/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i
const isValidEmail = (e: string) => EMAIL_RE.test(e)

/* ---------------------------
   People management
----------------------------*/
function openPeopleInput(role: Role) {
  role.showInput = true
  role.capacityWarning = role.people.length >= role.max_num_people
}

function enforceCapacity(role: Role) {
  // If max decreased, trim overflow people (remove from end)
  while (role.people.length > role.max_num_people) {
    const removed = role.people.pop()!
    // Also reflect that removal in the chip list, if present
    const idx = role.emailList.findIndex(e => e.toLowerCase() === removed.email.toLowerCase())
    if (idx !== -1) role.emailList.splice(idx, 1)
  }
  role.capacityWarning = role.people.length >= role.max_num_people
  saveToLocalStorage()
}

function addMemberEmail(role: Role, email: string) {
  // Prevent duplicates against current people
  if (role.people.some(p => p.email.toLowerCase() === email.toLowerCase())) return
  role.people.push({ name: email.split('@')[0], email })
}

function removeMember(role: Role, index: number) {
  const [removed] = role.people.splice(index, 1)
  // keep chips in sync
  const idx = role.emailList.findIndex(e => e.toLowerCase() === removed.email.toLowerCase())
  if (idx !== -1) role.emailList.splice(idx, 1)
  role.capacityWarning = role.people.length >= role.max_num_people
  saveToLocalStorage()
}

/* ---------------------------
   Email-chip event handlers
----------------------------*/
function onEmailsInvalid(role: Role, invalids: string[]) {
  role.emailError = invalids.length ? `Invalid: ${invalids.join(', ')}` : ''
}

function onEmailsAdd(role: Role, added: string[]) {
  // Respect capacity; add as many as we can
  for (const email of added) {
    if (!isValidEmail(email)) continue
    if (role.people.length >= role.max_num_people) {
      role.capacityWarning = true
      break
    }
    // avoid duplicates between chip list and people list
    const dup =
      role.people.some(p => p.email.toLowerCase() === email.toLowerCase())
    if (dup) continue
    addMemberEmail(role, email)
  }
  role.capacityWarning = role.people.length >= role.max_num_people
  saveToLocalStorage()
}

function onEmailsRemove(role: Role, removedEmail: string) {
  const idx = role.people.findIndex(p => p.email.toLowerCase() === removedEmail.toLowerCase())
  if (idx !== -1) role.people.splice(idx, 1)
  role.capacityWarning = role.people.length >= role.max_num_people
  saveToLocalStorage()
}

function finalizeChips(role: Role) {
  role.showInput = false
  role.capacityWarning = role.people.length >= role.max_num_people
  saveToLocalStorage()
}

function cancelChips(role: Role) {
  // Close input; do NOT discard already-added members
  role.showInput = false
  role.emailError = ''
  role.capacityWarning = role.people.length >= role.max_num_people
}

/* ---------------------------
   Persistence + boot
----------------------------*/
onMounted(() => {
  try {
    const savedWorkspace = localStorage.getItem('workspace')
    if (savedWorkspace) {
      const data = JSON.parse(savedWorkspace)
      workspace.roles = (data.variables.roles || []).map((r: Role) => ({
        ...r,
        // ensure new fields exist
        showInput: r.showInput ?? false,
        emailList: r.emailList ?? r.people?.map(p => p.email) ?? [],
        emailError: '',
        capacityWarning: false,
        max_num_people: typeof r.max_num_people === 'number' ? r.max_num_people : 1,
        role_emoji: r.role_emoji ?? ''
      }))
    }
  } catch (error) {
    console.error('Error parsing workspace from localStorage', error)
  }
})

function addNewRole() {
  const newRole = {
    id: `role-${Date.now()}`,
    title: form.value.name,
    description: form.value.description,
    people: [],
    showInput: false,
    max_num_people: 1,
    role_emoji: '',
    emailList: [],
    emailError: '',
    capacityWarning: false
  }
  workspace.roles.push(newRole)
  saveToLocalStorage()
  form.value.name = ''
  form.value.description = ''
  addTeam.value = false
}

function saveToLocalStorage() {
  const data = localStorage.getItem('workspace')
  const localWorkspace = data ? JSON.parse(data) : { variables: { roles: [] } }
  localWorkspace.variables.roles = workspace.roles
  localStorage.setItem('workspace', JSON.stringify(localWorkspace))
}

defineExpose({ saveToLocalStorage })
</script>
