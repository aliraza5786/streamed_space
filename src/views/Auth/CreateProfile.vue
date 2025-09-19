<template>
    <AuthLayout :steps="['Purpose', 'About Company', 'Invite Team']" :activeStep="activeStep">
        <template #form>
            <div class="max-w-[500px] md:mx-auto w-full">
                <div class="mb-12 space-y-2" v-if="activeStep === 1">
                    <h2 class="text-[32px] font-medium text-text-primary ">How will you use Streamed?</h2>
                    <p class="text-base sm:text-nowrap font-medium text-text-secondary ">This will help us personalize
                        your
                        experience in Streamed.
                    </p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4" v-if="activeStep === 1">
                    <label v-for="option in options" :key="option._id"
                        class="border rounded-xl py-4 px-2.5 cursor-pointer transition-all aspect-square"
                        :class="selected === option._id ? 'border-black bg-bg-surface' : 'border-border hover:border-border'">
                        <input type="radio" class="hidden" v-model="selected" :value="option._id" />
                        <div class="flex flex-col items-center">
                            <img :src="option.icon" class="w-12 h-12 " />
                            <h3 class="font-medium text-sm  text-text-primary mt-4">{{ option.title }}</h3>
                            <p class="text-[11px] text-teext-secondary mt-2 text-center">{{ option.description }}</p>
                        </div>
                    </label>
                </div>
                <div class="pb-3 space-y-2 mb-12" v-if="activeStep == 2">
                    <h2 class="text-[32px] font-medium ">Tell us about your company</h2>
                    <p class="text-base sm:text-nowrap font-medium text-text-secondary ">This will help us personalize
                        your
                        experience in Streamed.
                    </p>
                </div>
                <div class="space-y-6" v-if="activeStep == 2">
                    <BaseSelectField v-model="role" label="What role do you perform in your company?" :options="[
                        { title: 'Marketing', _id: 'marketing' },
                        { title: 'HR & Legal', _id: 'hr_legal' },
                        { title: 'Product & Design', _id: 'product_design' },
                        { title: 'Creative Production', _id: 'creative_production' },
                        { title: 'Engineering', _id: 'engineering' },
                        { title: 'Customer Service', _id: 'customer_service' },
                        { title: 'Operations', _id: 'operations' },
                        { title: 'Finance', _id: 'finance' },
                        { title: 'IT & Support', _id: 'it_support' },
                        { title: 'Sales & Account Manager', _id: 'sales_account' },
                        { title: 'Other / Personal', _id: 'other_personal' }
                    ]" placeholder="Select team" size="lg" />

                    <BaseSelectField v-model="team" label="What team are you on?" :options="[
                        { title: 'Marketing', _id: 'marketing' },
                        { title: 'HR & Legal', _id: 'hr_legal' },
                        { title: 'Product & Design', _id: 'product_design' },
                        { title: 'Creative Production', _id: 'creative_production' },
                        { title: 'Engineering', _id: 'engineering' },
                        { title: 'Customer Service', _id: 'customer_service' },
                        { title: 'Operations', _id: 'operations' },
                        { title: 'Finance', _id: 'finance' },
                        { title: 'IT & Support', _id: 'it_support' },
                        { title: 'Sales & Account Manager', _id: 'sales_account' },
                        { title: 'Other / Personal', _id: 'other_personal' }
                    ]" placeholder="Select team" size="lg" />
                    <BaseSelectField v-model="companySize" label="What’s your company size?" :options="[
                        { title: '4 - 35', _id: '4-35' },
                        { title: '45 - 76', _id: '45- 76' },

                    ]" placeholder="Select team" size="lg" />
                </div>
                <div class="mb-12 space-y-2" v-if="activeStep === 3">
                    <h2 class="text-[32px] font-medium ">Invite your team</h2>
                    <p class="text-base sm:text-nowrap font-medium text-text-secondary ">Invite your teammates to your
                        first project.
                    </p>
                </div>

                <div class="space-y-6" v-if="activeStep == 3">
                    <!-- Email Inputs -->
                    <div v-for="(email, index) in emailList" :key="index">
                        <BaseTextField v-model="emailList[index]" placeholder="laila23@example.com" size="lg"
                            @change="console.log(email)" />
                    </div>

                    <!-- Invite Link Section -->
                    <div class="flex flex-col gap-2.5">
                        <p class="text-sm text-medium text-text-primary">Invite link for any email</p>
                        <div class="flex items-center gap-3">
                            <BaseTextField v-model="inviteLink"
                                placeholder="https://chromewebstore.google.com/detail/co...." size="lg" />
                            <span @click="copyToClipboard"
                                class="text-sm text-medium text-text-secondary text-nowrap cursor-pointer hover:text-text-primary">
                                Copy link
                            </span>
                        </div>
                    </div>
                </div>

                <div class="flex justify-between items-center mt-[132px]">
                    <Button variant="secondary" size="md" type="button" @click="activeStep--">
                      <div class="flex items-center gap-1">
                          <FontAwesomeIcon :icon="['fas', 'arrow-left']" /> Back
                      </div>
                    </Button>
                    <div class="flex gap-4 items-center">
                        <router-link to="/"> <button class="text-text-primary text-sm px-3 cursor-pointer">Skip</button>
                        </router-link>
                        <Button size="md" type="submit" @click="continueHandler"
                            :disabled="disaledhandler">Continue</Button>
                    </div>
                </div>
            </div>
            <div class="max-w-[500px] md:mx-auto w-full space-y-6">
            </div>
        </template>
    </AuthLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AuthLayout from '../../layout/AuthLayout/AuthLayout.vue';
import teamIcon from "../../assets/platform/team.svg"
import personalIcon from "../../assets/platform/personal-use.svg"
import schoolIcon from "../../assets/platform/school.svg"
import Button from '../../components/ui/Button.vue';
import BaseSelectField from '../../components/ui/BaseSelectField.vue';
import BaseTextField from '../../components/ui/BaseTextField.vue';
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
const router = useRouter();
const selected = ref('')
const activeStep = ref(1)
const role = ref('')
const team = ref('')
const companySize = ref('')
const options = [
    {
        _id: 'team',
        title: 'For my team',
        description: 'Collaborate on your docs and projects.',
        icon: teamIcon,
        bg: 'bg-blue-200'
    },
    {
        _id: 'personal',
        title: 'For personal use',
        description: 'Write better. Think more clearly. Stay organised.',
        icon: personalIcon,
        bg: 'bg-green-200'
    },
    {
        _id: 'school',
        title: 'For school',
        description: 'Keep notes, research and tasks in one place.',
        icon: schoolIcon,
        bg: 'bg-yellow-200'
    }
]

const emailList = ref(['', '', '', '']);
const inviteLink = ref('https://chromewebstore.google.com/detail/co....');

function copyToClipboard() {
    navigator.clipboard.writeText(inviteLink.value)
        .then(() => console.log('Copied!'))
        .catch((err) => console.error('Copy failed:', err));
}
const disaledhandler = computed(() => {
    if (activeStep.value === 1 && selected.value === '') {
        return true
    }
    else if (activeStep.value === 2 && (role.value === '' || companySize.value === '' || team.value === '')) {
        return true
    }
    else if (activeStep.value === 3 && !emailList.value.every(email => email.trim() !== '')) {
        return true
    }
    else {
        return false
    }
})
const continueHandler = () => {
    if (activeStep.value == 3) {
        router.push('/finish-profile')
        return;
    }
    activeStep.value++
}
</script>